import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Booking terms" };

export default function TermsPage() {
  return (
    <LegalPage title="Booking terms">
      <h2>Booking requests</h2>
      <p>
        Sending a booking request asks us to hold your date. Your booking is confirmed once we&apos;ve contacted you to agree
        the date, package and travel fee.
      </p>
      <h2>Packages</h2>
      <p>
        Each package includes 2 operating hours of unlimited shots within up to 4 hours on site, with a 1 to 2 hour pause
        during your program. Extra operating hours are ₱1,000 each.
      </p>
      <h2>Travel</h2>
      <p>A travel fee applies depending on the venue location and is agreed before your booking is confirmed.</p>
      <h2>Payment</h2>
      <p>No deposit is needed to reserve a date. Payment timing is agreed when we confirm your booking.</p>
      <h2>Changes and cancellations</h2>
      <p>Please tell us as early as possible if your date or venue changes, and we&apos;ll do our best to work around it.</p>
    </LegalPage>
  );
}
