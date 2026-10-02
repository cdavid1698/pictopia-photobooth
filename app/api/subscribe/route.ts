import { subscribeSchema } from "@/lib/schemas";
import { fieldErrors, json, readJson } from "@/lib/server/http";
import { db } from "@/lib/server/supabase";

export async function POST(request: Request) {
  const parsed = subscribeSchema.safeParse(await readJson(request));
  if (!parsed.success) {
    return json({ error: fieldErrors(parsed.error).email ?? "Enter a valid email." }, 400);
  }
  if (parsed.data.company) return json({ ok: true });

  // Upsert so signing up twice is harmless and re-subscribes someone who left.
  const { error } = await db()
    .from("subscribers")
    .upsert({ email: parsed.data.email.toLowerCase(), unsubscribed_at: null }, { onConflict: "email" });
  if (error) {
    console.error("Subscribe failed", error);
    return json({ error: "Something went wrong. Please try again." }, 500);
  }
  return json({ ok: true }, 201);
}
