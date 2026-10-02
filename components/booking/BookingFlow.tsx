"use client";

import { ChevronUp, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { eventTypes, type EventTypeId } from "@/content/events";
import { tiers, type TierId } from "@/content/packages";
import {
  BookingSubmitError,
  emptyDraft,
  isDateSelectable,
  loadDraft,
  planFor,
  saveDraft,
  submitBookingRequest,
  totalPrice,
  validateDetails,
  validateEvent,
  type BookingDraft,
  type FieldErrors,
} from "@/lib/booking";
import { formatPeso } from "@/lib/format";
import { StepDetails, StepEvent, StepHours, StepPrint } from "@/components/booking/steps";
import { StepReview } from "@/components/booking/StepReview";
import { Summary } from "@/components/booking/Summary";
import { knownFullDates } from "@/components/booking/useFullDates";
import { buttonClass } from "@/components/ui";

const STEPS = [
  { title: "Your event", short: "Event" },
  { title: "Print and setup", short: "Print" },
  { title: "Booth hours", short: "Hours" },
  { title: "Your details", short: "Details" },
  { title: "Review and send", short: "Review" },
];

export type BookingPrefill = { date?: string; event?: string; tier?: string };

function applyPrefill(draft: BookingDraft, prefill: BookingPrefill): BookingDraft {
  const next = { ...draft };
  if (prefill.date && /^\d{4}-\d{2}-\d{2}$/.test(prefill.date) && isDateSelectable(prefill.date, knownFullDates())) next.date = prefill.date;
  const event = eventTypes.find((e) => e.id === prefill.event);
  if (event) {
    next.eventType = event.id as EventTypeId;
    next.plan = planFor(event.id);
    next.extraHours = 0;
  }
  const tier = tiers.find((t) => t.id === prefill.tier);
  if (tier) {
    next.tier = tier.id as TierId;
    next.format = tier.formats[0];
  }
  return next;
}

export function BookingFlow({ prefill }: { prefill: BookingPrefill }) {
  const router = useRouter();
  const [draft, setDraft] = useState<BookingDraft | null>(null);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [summaryOpen, setSummaryOpen] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const movedRef = useRef(false);

  // Load after mount: the draft lives in localStorage and dates depend on the visitor's clock.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from browser-only state
    setDraft(applyPrefill(loadDraft() ?? emptyDraft(), prefill));
  }, [prefill]);

  useEffect(() => {
    if (draft) saveDraft(draft);
  }, [draft]);

  useEffect(() => {
    if (!movedRef.current) return;
    headingRef.current?.focus();
    headingRef.current?.scrollIntoView({ block: "start" });
  }, [step]);

  if (!draft) {
    return (
      <div className="grid min-h-[100svh] place-items-start justify-center pt-24" role="status">
        <Loader2 className="size-8 animate-spin" aria-hidden />
        <span className="sr-only">Loading booking form</span>
      </div>
    );
  }

  const update = (patch: Partial<BookingDraft>) => {
    setDraft((d) => (d ? { ...d, ...patch } : d));
    setErrors((e) => {
      const next = { ...e };
      for (const k of Object.keys(patch) as (keyof BookingDraft)[]) delete next[k];
      return next;
    });
  };

  const goTo = (s: number) => {
    movedRef.current = true;
    setErrors({});
    setFormError("");
    setStep(s);
  };

  const validate = (): FieldErrors => (step === 0 ? validateEvent(draft, knownFullDates()) : step === 3 ? validateDetails(draft) : {});

  const next = async () => {
    const found = validate();
    if (Object.keys(found).length) {
      setErrors(found);
      const first = Object.keys(found)[0];
      requestAnimationFrame(() => {
        const el = document.getElementById(first) ?? document.querySelector<HTMLElement>(`[name="${first}"]`);
        el?.focus();
        el?.scrollIntoView({ block: "center" });
      });
      return;
    }
    if (step < STEPS.length - 1) {
      goTo(step + 1);
      return;
    }
    setSending(true);
    setFormError("");
    try {
      const request = await submitBookingRequest(draft, honeypot);
      router.push(`/book/confirmed?ref=${request.reference}`);
    } catch (error) {
      setSending(false);
      const message = error instanceof BookingSubmitError ? error.message : "Something went wrong. Please try again, or call us.";
      const fields = error instanceof BookingSubmitError ? error.fieldErrors : {};
      // Send the visitor back to the step that holds the problem field.
      const eventFields: (keyof BookingDraft)[] = ["eventType", "date", "venue", "town", "province"];
      const detailFields: (keyof BookingDraft)[] = ["name", "mobile", "email", "facebook", "notes"];
      const keys = Object.keys(fields) as (keyof BookingDraft)[];
      const target = keys.some((k) => eventFields.includes(k)) ? 0 : keys.some((k) => detailFields.includes(k)) ? 3 : step;
      if (target !== step) {
        movedRef.current = true;
        setStep(target);
      }
      setErrors(fields);
      setFormError(message);
    }
  };

  const stepProps = { draft, update, errors };
  const isLast = step === STEPS.length - 1;
  const nextLabel = isLast ? "Send booking request" : `Next: ${STEPS[step + 1].short}`;
  const errorCount = Object.keys(errors).length;
  const showAlert = errorCount > 0 || formError !== "";

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
      <div>
        {/* Progress */}
        <nav aria-label="Booking steps">
          <p className="text-sm font-semibold text-espresso-soft lg:hidden">
            Step {step + 1} of {STEPS.length}
          </p>
          <div className="mt-2 flex gap-1.5 lg:hidden" aria-hidden>
            {STEPS.map((s, i) => (
              <span key={s.short} className={`h-2 flex-1 rounded-full ${i <= step ? "bg-espresso" : "bg-line"}`} />
            ))}
          </div>
          <ol className="hidden gap-2 lg:flex">
            {STEPS.map((s, i) => (
              <li key={s.short}>
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  disabled={i > step}
                  aria-current={i === step ? "step" : undefined}
                  className="flex min-h-11 items-center gap-2 rounded-full border-2 border-espresso px-3 font-semibold disabled:border-line disabled:text-espresso/40 aria-[current=step]:bg-booth-yellow"
                >
                  <span className="grid size-6 place-items-center rounded-full bg-espresso text-xs text-paper tabular">
                    {i + 1}
                  </span>
                  {s.short}
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <h2
          ref={headingRef}
          tabIndex={-1}
          className="mt-6 scroll-mt-28 font-display text-3xl font-semibold focus:outline-none md:text-4xl"
        >
          {STEPS[step].title}
        </h2>

        {showAlert ? (
          <div role="alert" className="mt-4 rounded-xl border-2 border-ember bg-paper p-3 text-ember">
            <p className="font-semibold">
              {formError ||
                `${errorCount === 1 ? "One thing needs fixing" : `${errorCount} things need fixing`} before you continue:`}
            </p>
            {errorCount ? (
              <ul className="mt-1 list-disc pl-5">
                {Object.values(errors).map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

        <form
          className="mt-6"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            void next();
          }}
        >
          {step === 0 ? <StepEvent {...stepProps} /> : null}
          {step === 1 ? <StepPrint {...stepProps} /> : null}
          {step === 2 ? <StepHours {...stepProps} /> : null}
          {step === 3 ? <StepDetails {...stepProps} /> : null}
          {step === 4 ? <StepReview draft={draft} goTo={goTo} /> : null}

          {/* Spam trap: hidden from people and screen readers; bots tend to fill it. */}
          <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor="company">Company</label>
            <input
              id="company"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          {/* Desktop actions */}
          <div className="mt-10 hidden items-center gap-4 lg:flex">
            {step > 0 ? (
              <button type="button" onClick={() => goTo(step - 1)} className={buttonClass("secondary")}>
                Back
              </button>
            ) : null}
            <button type="submit" disabled={sending} className={buttonClass("primary", "ml-auto")}>
              {sending ? <Loader2 className="size-5 animate-spin" aria-hidden /> : null}
              {sending ? "Sending…" : nextLabel}
            </button>
          </div>

          {/* Mobile action bar with expandable total */}
          <div className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-espresso bg-paper lg:hidden">
            {summaryOpen ? (
              <div id="mobile-summary" className="max-h-[60vh] overflow-y-auto p-4">
                <Summary draft={draft} />
              </div>
            ) : null}
            <div className="flex items-center gap-3 px-4 py-3">
              <button
                type="button"
                onClick={() => setSummaryOpen((o) => !o)}
                aria-expanded={summaryOpen}
                aria-controls="mobile-summary"
                className="flex min-h-11 items-center gap-1 text-left"
              >
                <span>
                  <span className="block text-xs">Total</span>
                  <span className="font-display text-xl font-semibold tabular">{formatPeso(totalPrice(draft))}</span>
                </span>
                <ChevronUp className={`size-4 transition-transform ${summaryOpen ? "" : "rotate-180"}`} aria-hidden />
                <span className="sr-only">{summaryOpen ? "Hide" : "Show"} booking summary</span>
              </button>
              {step > 0 ? (
                <button type="button" onClick={() => goTo(step - 1)} className={buttonClass("secondary", "px-4")}>
                  Back
                </button>
              ) : null}
              <button type="submit" disabled={sending} className={buttonClass("primary", "flex-1 px-3 text-base")}>
                {sending ? "Sending…" : isLast ? "Send request" : nextLabel}
              </button>
            </div>
          </div>
          <div aria-hidden className="h-24 lg:hidden" />
        </form>
      </div>

      <aside className="hidden lg:block" aria-label="Booking summary">
        <div className="sticky top-28">
          <Summary draft={draft} />
        </div>
      </aside>
    </div>
  );
}
