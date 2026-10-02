"use client";

import { Minus, Plus } from "lucide-react";
import { useId, type CSSProperties } from "react";
import type { Segment } from "@/content/events";
import { boothHours } from "@/content/packages";
import { STEP, normalisePlan, onSiteHours, operatingHours } from "@/lib/booking";
import { formatClock, formatHours, formatPeso } from "@/lib/format";

export type PlannerValue = { plan: Segment[]; extraHours: number; startTime: number };

const START_TIMES = Array.from({ length: 27 }, (_, i) => 7 * 60 + i * 30); // 7:00 AM – 8:00 PM
const PAUSES = [0, 0.5, 1, 1.5, 2].filter((h) => h >= boothHours.pauseMin && h <= boothHours.pauseMax);

function Stepper({
  label,
  value,
  display,
  onChange,
  min,
  max,
  step,
  hint,
}: {
  label: string;
  value: number;
  display: string;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  hint?: string;
}) {
  const id = useId();
  return (
    <div role="group" aria-labelledby={id}>
      <p id={id} className="font-semibold">
        {label}
      </p>
      {hint ? <p className="text-sm text-espresso-soft">{hint}</p> : null}
      <div className="mt-2 flex items-center gap-2">
        <button
          type="button"
          className="grid size-11 place-items-center rounded-lg border-2 border-espresso bg-paper hover:bg-butter disabled:opacity-40"
          onClick={() => onChange(Math.max(min, value - step))}
          disabled={value <= min}
          aria-label={`Less: ${label}`}
        >
          <Minus className="size-4" aria-hidden />
        </button>
        <output className="min-w-24 text-center font-display text-lg font-semibold tabular" aria-live="polite">
          {display}
        </output>
        <button
          type="button"
          className="grid size-11 place-items-center rounded-lg border-2 border-espresso bg-paper hover:bg-butter disabled:opacity-40"
          onClick={() => onChange(Math.min(max, value + step))}
          disabled={value >= max}
          aria-label={`More: ${label}`}
        >
          <Plus className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}

/** The booth-hours planner: two booth sessions around an optional pause (up to 2 hours) for the event program. */
export function HoursPlanner({
  value,
  onChange,
  editableLabels = false,
}: {
  value: PlannerValue;
  onChange: (v: PlannerValue) => void;
  editableLabels?: boolean;
}) {
  const startId = useId();
  const pauseId = useId();
  const labelId = useId();
  const { plan, extraHours, startTime } = value;
  const [first, pause, second] = plan;
  const total = onSiteHours(plan);
  const op = operatingHours(extraHours);

  const update = (next: Partial<PlannerValue>) => {
    const merged = { ...value, ...next };
    onChange({ ...merged, plan: normalisePlan(merged.plan, merged.extraHours) });
  };
  const setSegment = (i: number, patch: Partial<Segment>) =>
    update({ plan: plan.map((s, j) => (j === i ? { ...s, ...patch } : s)) });

  const timed = plan.map((s, i) => {
    const from = startTime + plan.slice(0, i).reduce((sum, p) => sum + p.hours * 60, 0);
    return { ...s, from, to: from + s.hours * 60 };
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem] lg:items-start">
      <div>
        {/* Track: vertical on phones, horizontal from md up */}
        <ol
          className="flex h-[var(--track-h)] flex-col gap-1.5 md:h-40 md:flex-row"
          style={{ "--track-h": `${total * 84}px` } as CSSProperties}
          aria-label={`Booth plan, ${formatHours(total)} on site`}
        >
          {timed.filter((s) => s.hours > 0).map((s, i) => (
            <li
              key={i}
              style={{ flexGrow: s.hours, flexBasis: 0 }}
              className={`relative flex min-h-0 min-w-0 flex-col justify-between overflow-hidden rounded-xl border-2 border-espresso p-3 transition-[flex-grow] duration-300 ${
                s.kind === "on" ? "bg-booth-yellow" : "hatch"
              }`}
            >
              <div className="min-w-0">
                <p className="font-display text-base font-semibold leading-tight md:text-lg">
                  {s.kind === "on" ? "Booth on" : "Paused"}
                  <span className="font-sans text-sm font-medium"> · {formatHours(s.hours)}</span>
                </p>
                <p className="truncate text-sm">{s.label}</p>
              </div>
              <p className="text-sm font-semibold tabular">
                {formatClock(s.from)} – {formatClock(s.to)}
              </p>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-espresso-soft" aria-live="polite">
          {formatHours(op)} of unlimited shots. We&apos;re on site {formatHours(total)}, from {formatClock(startTime)} to{" "}
          {formatClock(startTime + total * 60)}.
        </p>
      </div>

      <div className="grid gap-6 rounded-2xl border-2 border-espresso bg-paper p-5">
        <div>
          <label htmlFor={startId} className="font-semibold">
            Booth starts at
          </label>
          <select
            id={startId}
            value={startTime}
            onChange={(e) => update({ startTime: Number(e.target.value) })}
            className="mt-2 block min-h-11 w-full rounded-lg border-2 border-espresso bg-paper px-3 tabular"
          >
            {START_TIMES.map((t) => (
              <option key={t} value={t}>
                {formatClock(t)}
              </option>
            ))}
          </select>
        </div>

        <Stepper
          label="First booth session"
          value={first.hours}
          display={formatHours(first.hours)}
          min={STEP}
          max={op - STEP}
          step={STEP}
          onChange={(h) => setSegment(0, { hours: h })}
          hint={`The rest of your ${formatHours(op)} runs in the second session (${formatHours(second.hours)}).`}
        />

        <fieldset>
          <legend id={pauseId} className="font-semibold">
            Pause length
          </legend>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {PAUSES.map((h) => (
              <label key={h} className="flex-1">
                <input
                  type="radio"
                  name={pauseId}
                  value={h}
                  checked={pause.hours === h}
                  onChange={() => setSegment(1, { hours: h })}
                  className="peer sr-only"
                />
                <span className="flex min-h-11 cursor-pointer items-center justify-center whitespace-nowrap rounded-lg border-2 border-espresso px-1 text-center text-sm font-semibold peer-checked:bg-espresso peer-checked:text-paper peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ember">
                  {h === 0 ? "No pause" : formatHours(h)}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {editableLabels && pause.hours > 0 ? (
          <div>
            <label htmlFor={labelId} className="font-semibold">
              What happens during the pause?
            </label>
            <input
              id={labelId}
              value={pause.label}
              maxLength={40}
              onChange={(e) => setSegment(1, { label: e.target.value })}
              className="mt-2 block min-h-11 w-full rounded-lg border-2 border-espresso px-3"
            />
          </div>
        ) : null}

        <Stepper
          label="Extra booth hours"
          value={extraHours}
          display={extraHours === 0 ? "None" : `+${formatHours(extraHours)}`}
          min={0}
          max={boothHours.maxExtraHours}
          step={1}
          onChange={(h) => update({ extraHours: h })}
          hint={`${formatPeso(boothHours.extraHourPrice)} per extra hour`}
        />
      </div>
    </div>
  );
}
