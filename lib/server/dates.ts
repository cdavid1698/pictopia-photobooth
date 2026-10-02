import "server-only";
import { MIN_LEAD_DAYS } from "@/lib/booking";
import { db } from "@/lib/server/supabase";

/** Today's date in the Philippines (UTC+8, no daylight saving) as YYYY-MM-DD. */
export function manilaToday(): string {
  return new Date(Date.now() + 8 * 3600_000).toISOString().slice(0, 10);
}

export function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function earliestBookableManila(): string {
  return addDays(manilaToday(), MIN_LEAD_DAYS);
}

export async function maxEventsPerDay(): Promise<number> {
  const { data, error } = await db().from("settings").select("max_events_per_day").eq("id", 1).single();
  if (error) throw error;
  return data.max_events_per_day as number;
}

/** Dates in [from, to] whose confirmed bookings have reached the daily limit. */
export async function fullDates(from: string, to: string): Promise<string[]> {
  const [max, { data, error }] = await Promise.all([
    maxEventsPerDay(),
    db().from("bookings").select("event_date").eq("status", "confirmed").gte("event_date", from).lte("event_date", to),
  ]);
  if (error) throw error;
  const counts = new Map<string, number>();
  for (const row of data as { event_date: string }[]) counts.set(row.event_date, (counts.get(row.event_date) ?? 0) + 1);
  return [...counts].filter(([, n]) => n >= max).map(([date]) => date);
}
