import type { Metadata } from "next";
import { REFERENCE_PATTERN } from "@/lib/status";
import { BookingStatusCheck } from "@/components/booking/BookingStatusCheck";

export const metadata: Metadata = {
  title: "Check your booking status",
  description: "Enter your booking reference and mobile number to see the latest status and full details of your Pictopia booking.",
};

export default async function BookingStatusPage({ searchParams }: PageProps<"/book/status">) {
  const { ref } = await searchParams;
  const reference = typeof ref === "string" && REFERENCE_PATTERN.test(ref.toUpperCase()) ? ref.toUpperCase() : "";
  return (
    <div className="px-4 py-12 sm:px-6 md:py-16">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-display text-4xl font-semibold md:text-5xl">Check your booking status</h1>
        <p className="mb-8 mt-4 max-w-2xl text-lg text-espresso-soft">
          Enter your reference number and the mobile number you booked with to see whether your booking is pending,
          confirmed or declined, along with all the details.
        </p>
        <BookingStatusCheck initialReference={reference} />
      </div>
    </div>
  );
}
