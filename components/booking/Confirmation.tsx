"use client";

import { CalendarPlus, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { business } from "@/content/business";
import { buildICS, findRequest, type BookingRequest } from "@/lib/booking";
import { formatPeso } from "@/lib/format";
import { describeBooking } from "@/lib/describe";
import { ButtonLink, buttonClass } from "@/components/ui";

export function Confirmation({ reference }: { reference: string }) {
  const [request, setRequest] = useState<BookingRequest | null | undefined>(undefined);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read browser-only storage
    setRequest(reference ? findRequest(reference) : null);
  }, [reference]);

  if (request === undefined) return <p role="status">Loading your booking…</p>;

  if (request === null) {
    return (
      <div>
        <h1 className="font-display text-4xl font-semibold">We couldn&apos;t find that booking</h1>
        <p className="mt-4 text-lg">
          It may have been made on another device. Start a new request, or call us on {business.phoneDisplay.value}.
        </p>
        <ButtonLink href="/book" className="mt-8">
          Check my date
        </ButtonLink>
      </div>
    );
  }

  const info = describeBooking(request);
  const download = () => {
    const blob = new Blob([buildICS(request)], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pictopia-${request.reference}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <p className="inline-block rounded-full border-2 border-espresso bg-booth-yellow px-3 py-1 font-semibold tabular">
        Reference {request.reference}
      </p>
      <h1 className="mt-4 font-display text-4xl font-semibold md:text-5xl">Booking request sent</h1>
      <p className="mt-4 text-lg leading-relaxed">
        Thanks, {request.name.split(" ")[0]}! We&apos;ve received your request for <strong>{info.date}</strong>{" "}
        <span className="whitespace-nowrap">({info.event.toLowerCase()})</span>. We&apos;ll call or text {request.mobile} {business.replyTime.value} to confirm the date
        and travel fee.
        {request.email ? <> A copy is on its way to {request.email}.</> : null}
      </p>
      <p className="mt-4 rounded-xl border-2 border-espresso bg-paper p-4">
        <strong>Your date isn&apos;t reserved yet.</strong> Other people may ask for the same date, and it goes to whoever
        confirms with us first, so please answer when we call.
      </p>

      <div className="mt-8 rounded-2xl border-2 border-espresso bg-butter p-5">
        <dl className="grid gap-2 sm:grid-cols-[8rem_1fr]">
          <dt className="font-semibold">Where</dt>
          <dd>{info.where}</dd>
          <dt className="font-semibold">Booth hours</dt>
          <dd className="tabular">
            {info.hours}, {info.pause}
          </dd>
          <dt className="font-semibold">Print</dt>
          <dd>
            {info.print}, {info.display.toLowerCase()}
          </dd>
          <dt className="font-semibold">Backdrop</dt>
          <dd>{info.backdrop}</dd>
          <dt className="font-semibold">Total</dt>
          <dd>
            <span className="font-display text-2xl font-semibold tabular">{formatPeso(request.total)}</span> + travel fee.
            No deposit needed.
          </dd>
        </dl>
      </div>

      <h2 className="mt-10 font-display text-2xl font-semibold">What happens next</h2>
      <ol className="mt-4 grid gap-4">
        {[
          "We check the date and work out the travel fee to your venue.",
          "We call or text to confirm. Once you say yes, the date is yours.",
          "We design your free custom layout with your names and date.",
        ].map((t, i) => (
          <li key={t} className="flex gap-4">
            <span className="grid size-9 shrink-0 place-items-center rounded-full border-2 border-espresso bg-booth-yellow font-display font-semibold">
              {i + 1}
            </span>
            <span className="pt-1 text-lg">{t}</span>
          </li>
        ))}
      </ol>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button type="button" onClick={download} className={buttonClass("primary")}>
          <CalendarPlus className="size-5" aria-hidden /> Add to calendar
        </button>
        <a href={business.messengerUrl.value} target="_blank" rel="noopener" className={buttonClass("secondary")}>
          <MessageCircle className="size-5" aria-hidden /> Message us
        </a>
        <a href={`tel:${business.phoneE164.value}`} className={buttonClass("secondary")}>
          <Phone className="size-5" aria-hidden /> Call {business.phoneDisplay.value}
        </a>
      </div>
      <p className="mt-8 rounded-xl border-2 border-espresso bg-paper p-4">
        Save your reference <strong className="tabular">{request.reference}</strong>. You can{" "}
        <Link
          href={`/book/status?ref=${request.reference}`}
          className="font-semibold text-ember underline decoration-2 underline-offset-4"
        >
          check your booking status
        </Link>{" "}
        any time with it and your mobile number.
      </p>
      <p className="mt-6">
        <Link href="/" className="font-semibold text-ember underline decoration-2 underline-offset-4">
          Back to home
        </Link>
      </p>
    </div>
  );
}
