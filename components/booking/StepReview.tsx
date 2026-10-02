import Link from "next/link";
import type { BookingDraft } from "@/lib/booking";
import { describeBooking } from "@/lib/describe";

export function StepReview({ draft, goTo }: { draft: BookingDraft; goTo: (step: number) => void }) {
  const info = describeBooking(draft);
  const rows: { label: string; value: string; step: number }[] = [
    { label: "Event", value: info.event, step: 0 },
    { label: "Date", value: info.date, step: 0 },
    { label: "Venue", value: info.where, step: 0 },
    { label: "Print", value: info.print, step: 1 },
    { label: "Display", value: info.display, step: 1 },
    { label: "Backdrop", value: info.backdrop, step: 1 },
    { label: "Booth hours", value: `${info.hours}, ${info.pause}`, step: 2 },
    { label: "Contact", value: [draft.name, draft.mobile, draft.facebook, draft.email].filter(Boolean).join(" · "), step: 3 },
  ];
  if (draft.notes) rows.push({ label: "Notes", value: draft.notes, step: 3 });

  return (
    <div className="max-w-2xl">
      <dl className="divide-y divide-espresso/20 border-y-2 border-espresso">
        {rows.map((r) => (
          <div key={r.label} className="grid grid-cols-[6.5rem_1fr_auto] items-start gap-3 py-3">
            <dt className="font-semibold">{r.label}</dt>
            <dd className="break-words">{r.value}</dd>
            <dd>
              <button
                type="button"
                onClick={() => goTo(r.step)}
                className="min-h-11 px-2 font-semibold text-ember underline decoration-2 underline-offset-4"
              >
                Edit<span className="sr-only"> {r.label.toLowerCase()}</span>
              </button>
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-6 text-espresso-soft">
        Sending this request doesn&apos;t reserve your date yet. We&apos;ll call or text you to confirm it and the travel
        fee, and dates go to whoever confirms first. See our{" "}
        <Link href="/privacy" className="underline">
          privacy notice
        </Link>{" "}
        for how your details are used.
      </p>
    </div>
  );
}
