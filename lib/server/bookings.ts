import "server-only";
import type { BookingDraft, Province } from "@/lib/booking";
import type { BookingStatus } from "@/lib/status";
import { db } from "@/lib/server/supabase";

type BookingRow = {
  reference: string;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
  event_type: BookingDraft["eventType"];
  event_date: string;
  start_time: string;
  venue: string | null;
  town: string;
  province: Province;
  tier: BookingDraft["tier"];
  print_format: BookingDraft["format"];
  display: BookingDraft["display"];
  backdrop_color: BookingDraft["backdropColor"];
  backdrop_finish: BookingDraft["backdropFinish"];
  plan: BookingDraft["plan"];
  extra_hours: number;
  package_total: number;
  customer_name: string;
  mobile: string;
  email: string | null;
  facebook: string | null;
  notes: string | null;
};

/** What the customer may see about their own booking. Owner notes and internal timestamps stay private. */
export type BookingLookup = {
  reference: string;
  status: BookingStatus;
  requestedAt: string;
  updatedAt: string;
  total: number;
  booking: BookingDraft;
};

/** "+63 917 123 4567", "0917-123-4567" → "09171234567" so either format matches. */
export function normaliseMobile(mobile: string): string {
  const digits = mobile.replace(/\D/g, "");
  return digits.startsWith("63") ? `0${digits.slice(2)}` : digits;
}

function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

const COLUMNS =
  "reference,status,created_at,updated_at,event_type,event_date,start_time,venue,town,province,tier,print_format,display,backdrop_color,backdrop_finish,plan,extra_hours,package_total,customer_name,mobile,email,facebook,notes";

/** Finds a booking only when both the reference and the mobile number match. */
export async function lookupBooking(reference: string, mobile: string): Promise<BookingLookup | null> {
  const { data, error } = await db()
    .from("bookings")
    .select(COLUMNS)
    .eq("reference", reference.trim().toUpperCase())
    .maybeSingle<BookingRow>();
  if (error) throw error;
  if (!data || normaliseMobile(data.mobile) !== normaliseMobile(mobile)) return null;

  return {
    reference: data.reference,
    status: data.status,
    requestedAt: data.created_at,
    updatedAt: data.updated_at,
    total: data.package_total,
    booking: {
      eventType: data.event_type,
      date: data.event_date,
      startTime: toMinutes(data.start_time),
      venue: data.venue ?? "",
      town: data.town,
      province: data.province,
      tier: data.tier,
      format: data.print_format,
      display: data.display,
      backdropColor: data.backdrop_color,
      backdropFinish: data.backdrop_finish,
      plan: data.plan,
      extraHours: data.extra_hours,
      name: data.customer_name,
      mobile: data.mobile,
      email: data.email ?? "",
      facebook: data.facebook ?? "",
      notes: data.notes ?? "",
    },
  };
}
