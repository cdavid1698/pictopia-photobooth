// Checks the Facebook Page connection from .env.local. Prints only what the website would show
// (generic event types), never album titles or the token.
// Usage: node --env-file=.env.local scripts/check-facebook.mjs
import { readFileSync } from "node:fs";
import { stripTypeScriptTypes } from "node:module";

const pageId = process.env.FACEBOOK_PAGE_ID;
const token = process.env.FACEBOOK_PAGE_TOKEN;
if (!pageId || !token) {
  console.log("FACEBOOK_PAGE_ID or FACEBOOK_PAGE_TOKEN is missing from .env.local");
  process.exit(1);
}

// Reuse the site's own mapping so this check matches production exactly.
let src = readFileSync(new URL("../lib/server/facebook.ts", import.meta.url), "utf8");
src = src.replace(/^import .*$/gm, "").replace(/export async function getRecentEvents[\s\S]*$/, "");
const { describeAlbum, eventDate } = await import(
  `data:text/javascript,${encodeURIComponent(stripTypeScriptTypes(src) + "\nexport { eventDate };")}`
);

const headers = { Authorization: `Bearer ${token}` };

const me = await fetch("https://graph.facebook.com/me?fields=id,name", { headers }).then((r) => r.json());
if (me.error) {
  console.log(`Token problem: ${me.error.type} ${me.error.code} — ${me.error.message}`);
  process.exit(1);
}
console.log(`Token belongs to: ${me.name} (${me.id === pageId ? "matches FACEBOOK_PAGE_ID" : "DOES NOT match FACEBOOK_PAGE_ID"})`);

const debug = await fetch(`https://graph.facebook.com/debug_token?input_token=${encodeURIComponent(token)}`, { headers }).then((r) => r.json());
if (debug.data) {
  const expires = debug.data.expires_at ? new Date(debug.data.expires_at * 1000).toISOString() : "never";
  console.log(`Token type: ${debug.data.type}, expires: ${expires}, scopes: ${(debug.data.scopes ?? []).join(", ")}`);
}

const fields = "name,type,count,created_time,link,place{name,location{city}}";
const res = await fetch(`https://graph.facebook.com/${pageId}/albums?fields=${fields}&limit=50`, { headers });
const body = await res.json();
if (body.error) {
  console.log(`Albums request failed: ${body.error.type} ${body.error.code} — ${body.error.message}`);
  process.exit(1);
}
const albums = body.data ?? [];
const types = albums.reduce((m, a) => ((m[a.type ?? "?"] = (m[a.type ?? "?"] ?? 0) + 1), m), {});
console.log(`Albums returned: ${albums.length} by type ${JSON.stringify(types)}`);
console.log("What the site will show (newest first):");
albums
  .filter((a) => a.name && (!a.type || a.type === "normal") && a.count)
  .map((a) => ({ date: eventDate(a.name, a.created_time), shown: describeAlbum(a.name), photos: a.count, place: a.place?.name ?? a.place?.location?.city ?? "" }))
  .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""))
  .slice(0, 8)
  .forEach((e) => console.log(`  ${e.date}  ${e.shown.padEnd(28)} ${String(e.photos).padStart(4)} photos  ${e.place}`));
