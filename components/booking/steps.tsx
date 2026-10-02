"use client";

import { eventTypes, type EventTypeId } from "@/content/events";
import { backdrops, boothType, displays, formatLabels, tiers } from "@/content/packages";
import { planFor, type BookingDraft, type FieldErrors, type Province } from "@/lib/booking";
import { formatLongDate, formatPeso } from "@/lib/format";
import { HoursPlanner } from "@/components/HoursPlanner";
import { PrintPreview } from "@/components/PrintPreview";
import { Calendar } from "@/components/booking/Calendar";
import { ChoiceCard, FieldError, TextField } from "@/components/booking/fields";

type StepProps = {
  draft: BookingDraft;
  update: (patch: Partial<BookingDraft>) => void;
  errors: FieldErrors;
};

const legend = "font-display text-xl font-semibold";

export function StepEvent({ draft, update, errors }: StepProps) {
  return (
    <div className="grid gap-10">
      <fieldset aria-describedby={errors.eventType ? "eventType-err" : undefined}>
        <legend className={legend}>What are you celebrating?</legend>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {eventTypes.map((e) => (
            <ChoiceCard
              key={e.id}
              name="eventType"
              value={e.id}
              checked={draft.eventType === e.id}
              onChange={() => update({ eventType: e.id as EventTypeId, plan: planFor(e.id), extraHours: 0 })}
            >
              <span className="block font-semibold">{e.name}</span>
              <span className="text-sm">{e.hint}</span>
            </ChoiceCard>
          ))}
        </div>
        <FieldError id="eventType-err" message={errors.eventType} />
      </fieldset>

      <fieldset>
        <legend className={legend}>Event date</legend>
        <p className="mt-1 text-espresso-soft">
          {draft.date ? <>Selected: <span className="font-semibold text-espresso">{formatLongDate(draft.date)}</span></> : "Pick a date. Crossed-out dates are taken."}
        </p>
        <div className="mt-4">
          <Calendar value={draft.date} onChange={(date) => update({ date })} describedBy={errors.date ? "date-err" : undefined} />
        </div>
        <FieldError id="date-err" message={errors.date} />
      </fieldset>

      <fieldset className="grid gap-5">
        <legend className={legend}>Venue</legend>
        <TextField
          id="venue"
          label="Venue name"
          optional
          autoComplete="off"
          value={draft.venue}
          onChange={(e) => update({ venue: e.target.value })}
          placeholder="e.g. resort, pavilion or church hall"
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            id="town"
            label="Town or city"
            hint="We use this to work out the travel fee."
            autoComplete="address-level2"
            value={draft.town}
            error={errors.town}
            onChange={(e) => update({ town: e.target.value })}
          />
          <div>
            <label htmlFor="province" className="font-semibold">
              Province
            </label>
            <p className="text-sm text-espresso-soft">Outside these? Choose Other.</p>
            <select
              id="province"
              value={draft.province}
              onChange={(e) => update({ province: e.target.value as Province })}
              className="mt-2 block min-h-12 w-full rounded-xl border-2 border-espresso bg-paper px-3 text-lg"
            >
              <option>Tarlac</option>
              <option>Pampanga</option>
              <option>Other</option>
            </select>
          </div>
        </div>
      </fieldset>
    </div>
  );
}

export function StepPrint({ draft, update }: StepProps) {
  const tier = tiers.find((t) => t.id === draft.tier)!;
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_15rem]">
      <div className="grid gap-10">
        <fieldset>
          <legend className={legend}>Photos per print</legend>
          <div className="mt-4 grid gap-3">
            {tiers.map((t) => (
              <ChoiceCard
                key={t.id}
                name="tier"
                value={t.id}
                checked={draft.tier === t.id}
                onChange={() => update({ tier: t.id, format: t.formats.includes(draft.format) ? draft.format : t.formats[0] })}
              >
                <span className="flex items-baseline justify-between gap-3">
                  <span className="font-semibold">{t.name}</span>
                  <span className="font-display text-xl font-semibold tabular">{formatPeso(t.price)}</span>
                </span>
                <span className="text-sm">{t.blurb}</span>
              </ChoiceCard>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className={legend}>Print style</legend>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {tier.formats.map((f) => (
              <ChoiceCard key={f} name="format" value={f} checked={draft.format === f} onChange={() => update({ format: f })}>
                <span className="font-semibold">{formatLabels[f]}</span>
              </ChoiceCard>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className={legend}>How prints are displayed</legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {displays.map((d) => (
              <ChoiceCard key={d.id} name="display" value={d.id} checked={draft.display === d.id} onChange={() => update({ display: d.id })}>
                <span className="flex items-baseline justify-between gap-3">
                  <span className="font-semibold">{d.name}</span>
                  <span className="tabular">{d.price ? `+${formatPeso(d.price)}` : "Included"}</span>
                </span>
                {d.price ? <span className="text-sm">{d.detail}</span> : null}
              </ChoiceCard>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className={legend}>Backdrop</legend>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {backdrops.finishes.map((f) => (
              <ChoiceCard
                key={f.id}
                name="finish"
                value={f.id}
                checked={draft.backdropFinish === f.id}
                onChange={() => update({ backdropFinish: f.id })}
              >
                <span className="font-semibold">{f.name}</span>
              </ChoiceCard>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-3" role="radiogroup" aria-label="Backdrop color">
            {backdrops.colors.map((c) => (
              <label key={c.id} className="cursor-pointer">
                <input
                  type="radio"
                  name="color"
                  value={c.id}
                  checked={draft.backdropColor === c.id}
                  onChange={() => update({ backdropColor: c.id })}
                  className="peer sr-only"
                />
                <span className="flex min-h-11 items-center gap-2 rounded-full border-2 border-espresso py-1 pl-1 pr-4 font-semibold peer-checked:bg-espresso peer-checked:text-paper peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ember">
                  <span className="size-8 rounded-full border-2 border-espresso" style={{ backgroundColor: c.hex }} aria-hidden />
                  {c.name}
                </span>
              </label>
            ))}
          </div>
          <p className="mt-4 text-espresso-soft">
            Props are free to use. We bring a set picked for your event. {boothType.name} with live monitor view.
          </p>
        </fieldset>
      </div>

      <figure className="order-first lg:sticky lg:top-28 lg:order-none lg:self-start">
        <div className="grid h-56 place-items-center rounded-2xl bg-butter p-4 lg:h-80 lg:p-5">
          <PrintPreview
            tier={draft.tier}
            format={draft.format}
            color={draft.backdropColor}
            finish={draft.backdropFinish}
            className="h-full max-w-full"
            title={`Preview: ${formatLabels[draft.format]}, ${tier.shots}, ${draft.backdropFinish} ${draft.backdropColor} backdrop`}
          />
        </div>
        <figcaption className="mt-2 text-center text-sm text-espresso-soft">
          Your layout preview. We design the final one with your names and date.
        </figcaption>
      </figure>
    </div>
  );
}

export function StepHours({ draft, update }: StepProps) {
  return (
    <div>
      <p className="mb-6 max-w-2xl text-lg text-espresso-soft">
        We&apos;re on site for up to 4 hours. Place your 2 booth hours around your program, and we&apos;ll pause for 1 to 2 hours
        while it happens.
      </p>
      <HoursPlanner
        value={{ plan: draft.plan, extraHours: draft.extraHours, startTime: draft.startTime }}
        onChange={(v) => update(v)}
        editableLabels
      />
    </div>
  );
}

export function StepDetails({ draft, update, errors }: StepProps) {
  return (
    <div className="grid max-w-xl gap-6">
      <TextField
        id="name"
        label="Your name"
        autoComplete="name"
        value={draft.name}
        error={errors.name}
        onChange={(e) => update({ name: e.target.value })}
      />
      <TextField
        id="mobile"
        label="Mobile number"
        hint="We'll text you to confirm the date and travel fee."
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="0917 123 4567"
        value={draft.mobile}
        error={errors.mobile}
        onChange={(e) => update({ mobile: e.target.value })}
      />
      <TextField
        id="facebook"
        label="Facebook name"
        optional
        hint="So we can reach you on Messenger."
        value={draft.facebook}
        onChange={(e) => update({ facebook: e.target.value })}
      />
      <TextField
        id="email"
        label="Email"
        optional
        type="email"
        autoComplete="email"
        value={draft.email}
        error={errors.email}
        onChange={(e) => update({ email: e.target.value })}
      />
      <div>
        <label htmlFor="notes" className="font-semibold">
          Anything else? <span className="font-normal text-espresso-soft">(optional)</span>
        </label>
        <p id="notes-hint" className="text-sm text-espresso-soft">
          Theme, motif colors, names for the layout, guest count…
        </p>
        <textarea
          id="notes"
          rows={4}
          aria-describedby="notes-hint"
          value={draft.notes}
          onChange={(e) => update({ notes: e.target.value })}
          className="mt-2 block w-full rounded-xl border-2 border-espresso bg-paper px-3 py-2 text-lg"
        />
      </div>
    </div>
  );
}
