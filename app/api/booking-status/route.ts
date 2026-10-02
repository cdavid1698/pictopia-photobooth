import { z } from "zod";
import { PH_MOBILE } from "@/lib/booking";
import { REFERENCE_PATTERN } from "@/lib/status";
import { lookupBooking } from "@/lib/server/bookings";
import { fieldErrors, json, readJson } from "@/lib/server/http";

const query = z.object({
  reference: z
    .string()
    .trim()
    .transform((s) => s.toUpperCase().replace(/\s/g, ""))
    .refine((s) => REFERENCE_PATTERN.test(s), "Enter your reference, like PIC-AB12CD."),
  mobile: z
    .string()
    .transform((s) => s.replace(/[\s-]/g, ""))
    .refine((s) => PH_MOBILE.test(s), "Enter the mobile number you booked with, like 0917 123 4567."),
});

// POST (not GET) so the mobile number never ends up in URLs, logs or browser history.
export async function POST(request: Request) {
  const parsed = query.safeParse(await readJson(request));
  if (!parsed.success) {
    return json({ error: "Please check your details.", fieldErrors: fieldErrors(parsed.error) }, 400);
  }
  try {
    const found = await lookupBooking(parsed.data.reference, parsed.data.mobile);
    if (!found) {
      // Same answer whether the reference doesn't exist or the mobile doesn't match.
      return json({ error: "We couldn't find a booking with that reference and mobile number. Please check both and try again." }, 404);
    }
    return json(found);
  } catch (error) {
    console.error("Booking status lookup failed", error);
    return json({ error: "Something went wrong checking your booking. Please try again, or call us." }, 500);
  }
}
