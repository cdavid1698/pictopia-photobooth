import { eventTypes } from "@/content/events";
import { backdrops, formatLabels, tiers } from "@/content/packages";
import { onSiteHours, type BookingDraft } from "@/lib/booking";
import { formatClock, formatHours, formatLongDate } from "@/lib/format";

/** Human-readable lines for a booking, shared by the UI and the emails. */
export function describeBooking(d: BookingDraft) {
  const event = eventTypes.find((e) => e.id === d.eventType);
  const tier = tiers.find((t) => t.id === d.tier)!;
  const color = backdrops.colors.find((c) => c.id === d.backdropColor)!;
  const pause = d.plan[1];
  let cursor = d.startTime;
  const sessions = d.plan.filter((s) => s.hours > 0).map((s) => {
    const from = cursor;
    cursor += s.hours * 60;
    return `${s.kind === "on" ? "Booth on" : "Paused"} ${formatClock(from)}–${formatClock(cursor)}${s.label ? ` (${s.label})` : ""}`;
  });
  return {
    event: event?.name ?? "Event not chosen",
    date: d.date ? formatLongDate(d.date) : "Date not chosen",
    where: [d.venue, d.town, d.province !== "Other" ? d.province : ""].filter(Boolean).join(", ") || "Venue not added",
    print: `${tier.name} · ${formatLabels[d.format]}`,
    display: d.display === "magnetic" ? "Magnetic prints" : "Standee frame",
    backdrop: `${color.name} ${d.backdropFinish} backdrop`,
    hours: `${formatClock(d.startTime)} – ${formatClock(d.startTime + onSiteHours(d.plan) * 60)}`,
    pause: pause.hours === 0 ? "no pause" : `${formatHours(pause.hours)} pause${pause.label ? ` for ${pause.label.toLowerCase()}` : ""}`,
    sessions,
  };
}
