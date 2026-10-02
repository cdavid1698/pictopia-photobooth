"use client";

import { useState } from "react";
import { eventTypes, type EventTypeId } from "@/content/events";
import { planFor } from "@/lib/booking";
import { HoursPlanner, type PlannerValue } from "@/components/HoursPlanner";
import { ButtonLink } from "@/components/ui";

const PRESETS: EventTypeId[] = ["wedding", "debut", "binyag"];

/** Planner with event presets, used on marketing pages. Hands the chosen event to the booking flow. */
export function HoursPlannerDemo() {
  const [eventId, setEventId] = useState<EventTypeId>("wedding");
  const [value, setValue] = useState<PlannerValue>({ plan: planFor("wedding"), extraHours: 0, startTime: 16 * 60 });

  return (
    <div>
      <div role="group" aria-label="Example event" className="mb-6 flex flex-wrap gap-2">
        {PRESETS.map((id) => {
          const ev = eventTypes.find((e) => e.id === id)!;
          const active = id === eventId;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={active}
              onClick={() => {
                setEventId(id);
                setValue((v) => ({ ...v, plan: planFor(id), extraHours: 0 }));
              }}
              className="min-h-11 rounded-full border-2 border-espresso px-4 font-semibold aria-pressed:bg-espresso aria-pressed:text-paper"
            >
              {ev.name}
            </button>
          );
        })}
      </div>
      <HoursPlanner value={value} onChange={setValue} />
      <ButtonLink href={`/book?event=${eventId}`} className="mt-8">
        Book with pause time
      </ButtonLink>
    </div>
  );
}
