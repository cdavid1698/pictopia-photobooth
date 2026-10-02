// Booking statuses as stored in Supabase (bookings.status), with customer-facing wording.

export type BookingStatus = "pending" | "confirmed" | "declined" | "cancelled";

export const statusInfo: Record<BookingStatus, { label: string; message: (date: string) => string }> = {
  pending: {
    label: "Pending",
    message: () =>
      "We've received your request and will call or text you to confirm the date and travel fee. Dates go to whoever confirms first, so please answer when we call.",
  },
  confirmed: {
    label: "Confirmed",
    message: (date) => `Your booking is confirmed. See you on ${date}!`,
  },
  declined: {
    label: "Declined",
    message: () =>
      "Sorry, we couldn't take this booking, usually because the date filled up. Call or text us and we'll help you find another date.",
  },
  cancelled: {
    label: "Cancelled",
    message: () => "This booking was cancelled. If that doesn't sound right, call or text us.",
  },
};

export const REFERENCE_PATTERN = /^PIC-[A-Z0-9]{6}$/;
