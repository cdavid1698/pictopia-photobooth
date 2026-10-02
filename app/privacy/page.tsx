import type { Metadata } from "next";
import { business } from "@/content/business";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Privacy notice" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy notice">
      <p>
        Pictopia Photobooth respects your privacy and handles personal information in line with the Philippine Data Privacy
        Act of 2012 (Republic Act No. 10173).
      </p>
      <h2>What we collect</h2>
      <p>
        When you send a booking request, we collect your name, mobile number, and optionally your email, Facebook name and event
        details, so we can confirm your booking.
      </p>
      <h2>Event photos</h2>
      <p>
        We post photos from events to an album on our Facebook page so guests can download them. Ask us if you&apos;d like your
        event&apos;s album kept private or a photo removed.
      </p>
      <h2>How we use it</h2>
      <p>We only use your details to arrange your booking and, if you sign up, to send promo alerts. We don&apos;t sell your data.</p>
      <h2>Where it&apos;s kept</h2>
      <p>
        Booking requests and enquiries are stored in a secure database (Supabase) and sent to our Gmail inbox so we can call you.
        If you give your email, we send you a copy of your request. Access is limited to Pictopia and the people who maintain this website.
      </p>
      <h2>Your rights</h2>
      <p>
        You can ask us to show, correct or delete the details we hold about you at any time, and you can unsubscribe from promo
        alerts whenever you like.
      </p>
      <h2>Contact</h2>
      <p>
        For privacy questions, email {business.email.value} or call {business.phoneDisplay.value}.
      </p>
    </LegalPage>
  );
}
