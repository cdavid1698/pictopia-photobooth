import { availabilityQuery } from "@/lib/schemas";
import { addDays, fullDates } from "@/lib/server/dates";
import { json } from "@/lib/server/http";

const MAX_RANGE_DAYS = 62;

/** Returns only which dates are full — never any booking details. */
export async function GET(request: Request) {
  const params = Object.fromEntries(new URL(request.url).searchParams);
  const parsed = availabilityQuery.safeParse(params);
  if (!parsed.success || parsed.data.to < parsed.data.from || parsed.data.to > addDays(parsed.data.from, MAX_RANGE_DAYS)) {
    return json({ error: "Invalid date range" }, 400);
  }
  try {
    return json({ full: await fullDates(parsed.data.from, parsed.data.to) });
  } catch (error) {
    console.error("Availability lookup failed", error);
    return json({ error: "Availability is unavailable right now" }, 500);
  }
}
