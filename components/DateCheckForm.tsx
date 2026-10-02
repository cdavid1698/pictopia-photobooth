"use client";

import { CalendarCheck, CalendarX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState, useSyncExternalStore } from "react";
import { earliestBookableDate } from "@/lib/booking";
import { formatLongDate } from "@/lib/format";
import { useFullDates } from "@/components/booking/useFullDates";
import { buttonClass } from "@/components/ui";

const noop = () => () => {};

/** Hero date field: checks live availability, then hands the date to the booking flow. */
export function DateCheckForm() {
  const id = useId();
  const router = useRouter();
  const [date, setDate] = useState("");
  // Computed on the client only so the min date never mismatches the server render.
  const min = useSyncExternalStore(noop, earliestBookableDate, () => "");
  const tooSoon = date !== "" && min !== "" && date < min;
  const check = !tooSoon && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : "";
  const { full, loading } = useFullDates(check, check);
  const booked = check !== "" && full.has(check);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(date && !booked && !tooSoon ? `/book?date=${date}` : "/book");
      }}
      className="max-w-md"
    >
      <label htmlFor={id} className="font-semibold">
        When&apos;s your event?
      </label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <input
          id={id}
          type="date"
          min={min || undefined}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          aria-describedby={`${id}-status`}
          className="min-h-12 w-full rounded-xl border-2 border-espresso bg-paper px-3 text-lg tabular sm:flex-1"
        />
        <button type="submit" className={buttonClass("primary", "bg-paper sm:shrink-0")}>
          Check my date
        </button>
      </div>
      <p id={`${id}-status`} className="mt-3 flex min-h-6 items-center gap-2 font-semibold" aria-live="polite">
        {date === "" ? null : loading ? (
          "Checking…"
        ) : tooSoon ? (
          <>
            <CalendarX className="size-5" aria-hidden /> We need at least 2 days&apos; notice. Call us for rush bookings.
          </>
        ) : booked ? (
          <>
            <CalendarX className="size-5" aria-hidden /> {formatLongDate(date)} is fully booked. Try another date.
          </>
        ) : (
          <>
            <CalendarCheck className="size-5" aria-hidden /> {formatLongDate(date)} is available.
          </>
        )}
      </p>
    </form>
  );
}
