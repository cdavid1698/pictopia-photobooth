import { priceLines, totalPrice, type BookingDraft } from "@/lib/booking";
import { describeBooking } from "@/lib/describe";
import { formatPeso } from "@/lib/format";

/** Running summary with the live total. */
export function Summary({ draft }: { draft: BookingDraft }) {
  const info = describeBooking(draft);
  const lines = priceLines(draft);
  return (
    <div className="rounded-2xl border-2 border-espresso bg-butter p-5">
      <h2 className="font-display text-xl font-semibold">Your booking</h2>
      <dl className="mt-3 grid gap-2 text-sm">
        <div>
          <dt className="sr-only">Event</dt>
          <dd className="font-semibold">{info.event}</dd>
        </div>
        <div>
          <dt className="sr-only">Date</dt>
          <dd>{info.date}</dd>
        </div>
        <div>
          <dt className="sr-only">Booth hours</dt>
          <dd className="tabular">
            {info.hours} · {info.pause}
          </dd>
        </div>
        <div>
          <dt className="sr-only">Print</dt>
          <dd>{info.print}</dd>
        </div>
      </dl>
      <ul className="mt-4 grid gap-1 border-t border-espresso/30 pt-3 text-sm">
        {lines.map((l) => (
          <li key={l.label} className="flex justify-between gap-3">
            <span>{l.label}</span>
            <span className="tabular">{formatPeso(l.amount)}</span>
          </li>
        ))}
        <li className="flex justify-between gap-3 text-espresso-soft">
          <span>Travel fee</span>
          <span>Quoted after booking</span>
        </li>
      </ul>
      <p className="mt-3 flex items-baseline justify-between border-t-2 border-espresso pt-3">
        <span className="font-semibold">Total</span>
        <span className="font-display text-3xl font-semibold tabular" aria-live="polite">
          {formatPeso(totalPrice(draft))}
        </span>
      </p>
      <p className="mt-1 text-sm">No deposit needed. You pay nothing today.</p>
    </div>
  );
}
