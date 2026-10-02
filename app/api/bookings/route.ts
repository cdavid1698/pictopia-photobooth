import { randomBytes } from "node:crypto";
import { totalPrice, type BookingRequest } from "@/lib/booking";
import { bookingSchema } from "@/lib/schemas";
import { earliestBookableManila, fullDates } from "@/lib/server/dates";
import { customerReceiptEmail, ownerBookingEmail } from "@/lib/server/emails";
import { fieldErrors, json, readJson } from "@/lib/server/http";
import { ownerInbox, sendMail } from "@/lib/server/mail";
import { db } from "@/lib/server/supabase";

const MAX_REQUESTS_PER_MOBILE_PER_DAY = 5;
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function newReference(): string {
  const bytes = randomBytes(6);
  return `PIC-${Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("")}`;
}

function toClock(minutes: number): string {
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

export async function POST(request: Request) {
  const parsed = bookingSchema.safeParse(await readJson(request));
  if (!parsed.success) {
    return json({ error: "Some details need fixing.", fieldErrors: fieldErrors(parsed.error) }, 400);
  }
  const b = parsed.data;

  // Bots fill the hidden field; pretend it worked and store nothing.
  if (b.company) return json({ reference: newReference(), total: 0 });

  if (b.date < earliestBookableManila()) {
    return json({ error: "We need at least 2 days' notice. Please call us for rush bookings.", fieldErrors: { date: "Pick a later date." } }, 400);
  }

  try {
    const full = await fullDates(b.date, b.date);
    if (full.includes(b.date)) {
      return json({ error: "Sorry, that date just filled up.", fieldErrors: { date: "That date is fully booked. Please pick another." } }, 409);
    }

    const since = new Date(Date.now() - 24 * 3600_000).toISOString();
    const { count, error: countError } = await db()
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("mobile", b.mobile)
      .gte("created_at", since);
    if (countError) throw countError;
    if ((count ?? 0) >= MAX_REQUESTS_PER_MOBILE_PER_DAY) {
      return json({ error: "You've sent several requests today. Please call or text us and we'll sort it out." }, 429);
    }

    const total = totalPrice(b);
    const row = {
      event_type: b.eventType,
      event_date: b.date,
      start_time: toClock(b.startTime),
      venue: b.venue,
      town: b.town,
      province: b.province,
      tier: b.tier,
      print_format: b.format,
      display: b.display,
      backdrop_color: b.backdropColor,
      backdrop_finish: b.backdropFinish,
      plan: b.plan,
      extra_hours: b.extraHours,
      package_total: total,
      customer_name: b.name,
      mobile: b.mobile,
      email: b.email,
      facebook: b.facebook,
      notes: b.notes,
    };

    // Retry on the (very unlikely) reference collision.
    let reference = "";
    for (let attempt = 0; attempt < 3 && !reference; attempt++) {
      const candidate = newReference();
      const { error } = await db().from("bookings").insert({ ...row, reference: candidate });
      if (!error) reference = candidate;
      else if (error.code !== "23505") throw error;
    }
    if (!reference) throw new Error("Could not allocate a booking reference");

    const saved: BookingRequest = {
      ...b,
      venue: b.venue ?? "",
      email: b.email ?? "",
      facebook: b.facebook ?? "",
      notes: b.notes ?? "",
      reference,
      sentAt: new Date().toISOString(),
      total,
    };

    // The booking is saved; email problems are logged but never lose the request.
    const ownerMail = { ...ownerBookingEmail(saved), to: ownerInbox() };
    const [owner, customer] = await Promise.allSettled([
      sendMail(ownerMail),
      b.email ? sendMail(customerReceiptEmail(saved)) : Promise.resolve(null),
    ]);
    const now = new Date().toISOString();
    const notified: Record<string, string> = {};
    if (owner.status === "fulfilled") notified.owner_notified_at = now;
    else console.error("Owner email failed", reference, owner.reason);
    if (b.email && customer.status === "fulfilled") notified.customer_notified_at = now;
    else if (customer.status === "rejected") console.error("Customer email failed", reference, customer.reason);
    if (Object.keys(notified).length) await db().from("bookings").update(notified).eq("reference", reference);

    return json({ reference, total }, 201);
  } catch (error) {
    console.error("Booking request failed", error);
    return json({ error: "Something went wrong saving your request. Please try again, or call us." }, 500);
  }
}
