import "server-only";
import { recentEvents as fallbackEvents, type RecentEvent } from "@/content/events";

// Pulls the latest event albums from the Pictopia Facebook page.
// Album titles name the client ("Dhea's 18th Birthday"), so titles are never shown:
// we only derive a generic event type, the date, the venue and the photo count.

const REFRESH_SECONDS = 30 * 60;

type GraphAlbum = {
  id: string;
  name?: string;
  type?: string;
  count?: number;
  created_time?: string;
  link?: string;
  place?: { name?: string; location?: { city?: string } };
};

const MONTHS: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, sept: 9, oct: 10, nov: 11, dec: 12,
};

/** "… (Sept. 27, 2026)" → "2026-09-27". Falls back to the album's creation date in Manila time. */
function eventDate(name: string, created?: string): string | null {
  const m = name.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sept?|oct|nov|dec)[a-z]*\.?\s+(\d{1,2}),?\s+(20\d{2})/i);
  if (m) {
    const month = MONTHS[m[1].toLowerCase()];
    return `${m[3]}-${String(month).padStart(2, "0")}-${m[2].padStart(2, "0")}`;
  }
  if (!created) return null;
  return new Date(new Date(created).getTime() + 8 * 3600_000).toISOString().slice(0, 10);
}

/** Generic, name-free description of the event from keywords in the album title. */
export function describeAlbum(name: string): string {
  const n = name.toLowerCase();
  const ordinal = (word: string) => n.match(new RegExp(`(\\d{1,3})(st|nd|rd|th)\\s+${word}`))?.[0];
  const christening = /christening|binyag|baptism|dedication/.test(n);
  const birthday = /birthday|bday|b-day/.test(n);

  if (/wedding|kasal|nuptial/.test(n)) return "Wedding";
  if (/debut/.test(n) || /\b18th\b/.test(n)) return "18th birthday";
  if (christening && birthday) return `${ordinal("birthday") ?? "Birthday"} & christening`;
  if (christening) return "Christening";
  if (/anniversary/.test(n)) return `${ordinal("anniversary") ?? "Anniversary"} celebration`;
  if (/christmas/.test(n)) return "Christmas party";
  if (/graduation|recognition|moving up/.test(n)) return "Graduation";
  if (/reunion/.test(n)) return "Reunion";
  if (/corporate|company|year[- ]end|team building|launch/.test(n)) return "Corporate event";
  if (birthday) return ordinal("birthday") ? `${ordinal("birthday")}` : "Birthday party";
  return "Private celebration";
}

const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Latest event albums, newest first. Returns the hand-written list if Facebook isn't set up or fails. */
export async function getRecentEvents(limit = 4): Promise<{ events: RecentEvent[]; live: boolean }> {
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const token = process.env.FACEBOOK_PAGE_TOKEN;
  if (!pageId || !token) return { events: fallbackEvents.slice(0, limit), live: false };

  try {
    const fields = "name,type,count,created_time,link,place{name,location{city}}";
    const res = await fetch(`https://graph.facebook.com/${encodeURIComponent(pageId)}/albums?fields=${fields}&limit=50`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: REFRESH_SECONDS, tags: ["facebook-albums"] },
    });
    if (!res.ok) throw new Error(`Graph API ${res.status}: ${(await res.text()).slice(0, 300)}`);
    const { data } = (await res.json()) as { data: GraphAlbum[] };

    // Pictopia often posts one event as two uploads with the same album name — merge them.
    const byName = new Map<string, RecentEvent>();
    for (const album of data) {
      const name = album.name?.trim();
      if (!name || (album.type && album.type !== "normal") || !album.count) continue;
      const date = eventDate(name, album.created_time);
      if (!date) continue;
      const key = name.toLowerCase();
      const existing = byName.get(key);
      if (existing) {
        existing.photos += album.count;
        continue;
      }
      byName.set(key, {
        title: capitalise(describeAlbum(name)),
        date,
        place: album.place?.name ?? album.place?.location?.city,
        photos: album.count,
        url: album.link,
        source: "facebook",
      });
    }

    const events = [...byName.values()].sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);
    return events.length ? { events, live: true } : { events: fallbackEvents.slice(0, limit), live: false };
  } catch (error) {
    console.error("Facebook albums unavailable, showing saved list", error);
    return { events: fallbackEvents.slice(0, limit), live: false };
  }
}
