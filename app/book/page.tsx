import type { Metadata } from "next";
import { BookingFlow } from "@/components/booking/BookingFlow";

export const metadata: Metadata = {
  title: "Book your photobooth",
  description: "Check your date, pick your print and booth hours, and send a booking request. No deposit needed.",
};

export default async function BookPage({ searchParams }: PageProps<"/book">) {
  const params = await searchParams;
  const pick = (k: string) => (typeof params[k] === "string" ? (params[k] as string) : undefined);

  return (
    <div className="px-4 py-10 sm:px-6 md:py-14">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-display text-xl font-semibold text-espresso-soft">Book Pictopia Photobooth</h1>
        <BookingFlow prefill={{ date: pick("date"), event: pick("event"), tier: pick("tier") }} />
      </div>
    </div>
  );
}
