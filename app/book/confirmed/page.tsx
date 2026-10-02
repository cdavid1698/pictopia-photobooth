import type { Metadata } from "next";
import { Confirmation } from "@/components/booking/Confirmation";

export const metadata: Metadata = {
  title: "Booking request sent",
};

export default async function ConfirmedPage({ searchParams }: PageProps<"/book/confirmed">) {
  const { ref } = await searchParams;
  return (
    <div className="px-4 py-12 sm:px-6 md:py-16">
      <div className="mx-auto max-w-3xl">
        <Confirmation reference={typeof ref === "string" ? ref : ""} />
      </div>
    </div>
  );
}
