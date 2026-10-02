"use client";

import { Ban, CheckCircle2, Clock, MessageCircle, Phone, XCircle, type LucideIcon } from "lucide-react";
import { useRef, useState } from "react";
import { business } from "@/content/business";
import { priceLines } from "@/lib/booking";
import { describeBooking } from "@/lib/describe";
import { formatPeso } from "@/lib/format";
import { statusInfo, type BookingStatus } from "@/lib/status";
import type { BookingLookup } from "@/lib/server/bookings";
import { TextField } from "@/components/booking/fields";
import { buttonClass } from "@/components/ui";

const badges: Record<BookingStatus, { icon: LucideIcon; className: string }> = {
  pending: { icon: Clock, className: "bg-butter" },
  confirmed: { icon: CheckCircle2, className: "bg-booth-yellow" },
  declined: { icon: XCircle, className: "bg-paper text-ember border-ember" },
  cancelled: { icon: Ban, className: "bg-paper text-espresso-soft" },
};

const stamp = (iso: string) =>
  new Date(iso).toLocaleString("en-PH", { timeZone: "Asia/Manila", dateStyle: "medium", timeStyle: "short" });

type Errors = Partial<Record<"reference" | "mobile", string>>;

export function BookingStatusCheck({ initialReference }: { initialReference: string }) {
  const [reference, setReference] = useState(initialReference);
  const [mobile, setMobile] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BookingLookup | null>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);

  const check = async () => {
    setLoading(true);
    setFormError("");
    try {
      const res = await fetch("/api/booking-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference, mobile }),
      });
      const data = (await res.json().catch(() => ({}))) as BookingLookup & { error?: string; fieldErrors?: Errors };
      if (!res.ok) {
        setResult(null);
        setErrors(data.fieldErrors ?? {});
        setFormError(data.error ?? "Something went wrong. Please try again.");
        const first = Object.keys(data.fieldErrors ?? {})[0];
        if (first) document.getElementById(`status-${first}`)?.focus();
        return;
      }
      setErrors({});
      setResult(data);
      requestAnimationFrame(() => {
        resultRef.current?.focus();
        resultRef.current?.scrollIntoView({ block: "start" });
      });
    } catch {
      setFormError("We couldn't reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-10">
      <form
        noValidate
        className="grid max-w-xl gap-5 rounded-2xl border-2 border-espresso bg-paper p-5 sm:p-6"
        onSubmit={(e) => {
          e.preventDefault();
          void check();
        }}
      >
        <TextField
          id="status-reference"
          label="Reference number"
          hint="It's in your confirmation email and on the confirmation page, e.g. PIC-AB12CD."
          autoCapitalize="characters"
          autoComplete="off"
          spellCheck={false}
          value={reference}
          error={errors.reference}
          onChange={(e) => {
            setReference(e.target.value);
            setErrors((er) => ({ ...er, reference: undefined }));
          }}
        />
        <TextField
          id="status-mobile"
          label="Mobile number you booked with"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="0917 123 4567"
          value={mobile}
          error={errors.mobile}
          onChange={(e) => {
            setMobile(e.target.value);
            setErrors((er) => ({ ...er, mobile: undefined }));
          }}
        />
        {formError ? (
          <p role="alert" className="font-semibold text-ember">
            {formError}
          </p>
        ) : null}
        <button type="submit" disabled={loading} className={buttonClass("primary", "justify-self-start")}>
          {loading ? "Checking…" : "Check booking status"}
        </button>
      </form>

      {result ? <StatusResult result={result} headingRef={resultRef} /> : null}
    </div>
  );
}

function StatusResult({ result, headingRef }: { result: BookingLookup; headingRef: React.RefObject<HTMLHeadingElement | null> }) {
  const info = describeBooking(result.booking);
  const badge = badges[result.status];
  const status = statusInfo[result.status];
  const Icon = badge.icon;
  const lines = priceLines(result.booking);
  const b = result.booking;

  return (
    <section aria-labelledby="status-result-h" className="max-w-3xl">
      <p className="inline-block rounded-full border-2 border-espresso bg-booth-yellow px-3 py-1 font-semibold tabular">
        Reference {result.reference}
      </p>
      <h2 id="status-result-h" ref={headingRef} tabIndex={-1} className="mt-4 scroll-mt-28 font-display text-3xl font-semibold outline-none focus:outline-none focus-visible:outline-none md:text-4xl">
        {info.event} · {info.date}
      </h2>

      <div className="mt-5 flex flex-col gap-3 rounded-2xl border-2 border-espresso p-5 sm:flex-row sm:items-start" aria-live="polite">
        <span
          className={`inline-flex shrink-0 items-center gap-2 self-start rounded-full border-2 border-espresso px-3 py-1 font-display text-lg font-semibold ${badge.className}`}
        >
          <Icon className="size-5" aria-hidden />
          {status.label}
        </span>
        <div>
          <p className="text-lg">{status.message(info.date)}</p>
          <p className="mt-2 text-sm text-espresso-soft">
            Requested {stamp(result.requestedAt)} · Last updated {stamp(result.updatedAt)}
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border-2 border-espresso bg-butter p-5">
        <h3 className="font-display text-xl font-semibold">Booking details</h3>
        <dl className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-[9rem_1fr]">
          <dt className="font-semibold">Event</dt>
          <dd>{info.event}</dd>
          <dt className="font-semibold">Date</dt>
          <dd>{info.date}</dd>
          <dt className="font-semibold">Venue</dt>
          <dd>{info.where}</dd>
          <dt className="font-semibold">Booth hours</dt>
          <dd className="tabular">
            {info.sessions.map((s) => (
              <span key={s} className="block">
                {s}
              </span>
            ))}
          </dd>
          <dt className="font-semibold">Print</dt>
          <dd>{info.print}</dd>
          <dt className="font-semibold">Display</dt>
          <dd>{info.display}</dd>
          <dt className="font-semibold">Backdrop</dt>
          <dd>{info.backdrop}</dd>
          <dt className="font-semibold">Name</dt>
          <dd>{b.name}</dd>
          <dt className="font-semibold">Contact</dt>
          <dd className="break-words">{[b.mobile, b.email, b.facebook].filter(Boolean).join(" · ")}</dd>
          {b.notes ? (
            <>
              <dt className="font-semibold">Notes</dt>
              <dd className="whitespace-pre-line break-words">{b.notes}</dd>
            </>
          ) : null}
        </dl>
        <ul className="mt-5 grid gap-1 border-t border-espresso/30 pt-3">
          {lines.map((l) => (
            <li key={l.label} className="flex justify-between gap-3">
              <span>{l.label}</span>
              <span className="tabular">{formatPeso(l.amount)}</span>
            </li>
          ))}
          <li className="flex justify-between gap-3 text-espresso-soft">
            <span>Travel fee</span>
            <span>Confirmed by phone</span>
          </li>
        </ul>
        <p className="mt-3 flex items-baseline justify-between border-t-2 border-espresso pt-3">
          <span className="font-semibold">Total</span>
          <span className="font-display text-3xl font-semibold tabular">{formatPeso(result.total)}</span>
        </p>
      </div>

      <p className="mt-6 text-espresso-soft">Need to change something? Call, text or message us with your reference number.</p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <a href={`tel:${business.phoneE164.value}`} className={buttonClass("secondary")}>
          <Phone className="size-5" aria-hidden /> Call {business.phoneDisplay.value}
        </a>
        <a href={business.messengerUrl.value} target="_blank" rel="noopener" className={buttonClass("secondary")}>
          <MessageCircle className="size-5" aria-hidden /> Message us
        </a>
      </div>
    </section>
  );
}
