// Booking logic shared by the browser and the server: pricing, booth hours, validation,
// plus the browser-side calls to /api/bookings and /api/availability.

import { eventTypes, type EventTypeId, type Segment } from "@/content/events";
import {
  boothHours,
  displays,
  tiers,
  type BackdropColor,
  type BackdropFinish,
  type DisplayId,
  type PrintFormat,
  type TierId,
} from "@/content/packages";
import { toISODate } from "@/lib/format";

export type Province = "Tarlac" | "Pampanga" | "Other";

export type BookingDraft = {
  eventType: EventTypeId | null;
  date: string;
  startTime: number; // minutes since midnight
  venue: string;
  town: string;
  province: Province;
  tier: TierId;
  format: PrintFormat;
  display: DisplayId;
  backdropColor: BackdropColor;
  backdropFinish: BackdropFinish;
  plan: Segment[];
  extraHours: number;
  name: string;
  mobile: string;
  email: string;
  facebook: string;
  notes: string;
};

export type BookingRequest = BookingDraft & { reference: string; sentAt: string; total: number };

const DRAFT_KEY = "pictopia:booking-draft";
const REQUESTS_KEY = "pictopia:booking-requests";

export function planFor(eventType: EventTypeId | null): Segment[] {
  const preset = eventTypes.find((e) => e.id === eventType) ?? eventTypes[eventTypes.length - 1];
  return preset.plan.map((s) => ({ ...s }));
}

export function emptyDraft(): BookingDraft {
  return {
    eventType: null,
    date: "",
    startTime: 16 * 60,
    venue: "",
    town: "",
    province: "Tarlac",
    tier: "multi",
    format: "strip",
    display: "standee",
    backdropColor: "white",
    backdropFinish: "sequin",
    plan: planFor(null),
    extraHours: 0,
    name: "",
    mobile: "",
    email: "",
    facebook: "",
    notes: "",
  };
}

// ---- Booth hours -------------------------------------------------------

export const STEP = 0.5;

export function operatingHours(extraHours: number): number {
  return boothHours.operatingHours + extraHours;
}

/** Rebuilds the plan so the two booth sessions add up to the operating hours, keeping the first session where possible. */
export function normalisePlan(plan: Segment[], extraHours: number): Segment[] {
  const total = operatingHours(extraHours);
  const [first, pause, second] = plan;
  const firstHours = Math.min(Math.max(first.hours, STEP), total - STEP);
  const pauseHours = Math.min(Math.max(pause.hours, boothHours.pauseMin), boothHours.pauseMax);
  return [
    { ...first, hours: firstHours },
    { ...pause, hours: pauseHours },
    { ...second, hours: total - firstHours },
  ];
}

export function onSiteHours(plan: Segment[]): number {
  return plan.reduce((sum, s) => sum + s.hours, 0);
}

// ---- Price -------------------------------------------------------------

export type PriceLine = { label: string; amount: number };

export function priceLines(draft: Pick<BookingDraft, "tier" | "display" | "extraHours">): PriceLine[] {
  const tier = tiers.find((t) => t.id === draft.tier) ?? tiers[0];
  const display = displays.find((d) => d.id === draft.display) ?? displays[0];
  const lines: PriceLine[] = [{ label: `${tier.name} package · 2 hrs unli shots`, amount: tier.price }];
  if (display.price > 0) lines.push({ label: display.name, amount: display.price });
  if (draft.extraHours > 0) {
    lines.push({
      label: `${draft.extraHours} extra booth ${draft.extraHours === 1 ? "hour" : "hours"}`,
      amount: draft.extraHours * boothHours.extraHourPrice,
    });
  }
  return lines;
}

export function totalPrice(draft: Pick<BookingDraft, "tier" | "display" | "extraHours">): number {
  return priceLines(draft).reduce((sum, l) => sum + l.amount, 0);
}

// ---- Availability ------------------------------------------------------

export const MIN_LEAD_DAYS = 2;

export function earliestBookableDate(today = new Date()): string {
  const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + MIN_LEAD_DAYS);
  return toISODate(d);
}

/** A date can be requested if it's far enough ahead and not already full of confirmed events. */
export function isDateSelectable(iso: string, fullDates: ReadonlySet<string>, today = new Date()): boolean {
  return iso >= earliestBookableDate(today) && !fullDates.has(iso);
}

/** Dates in [from, to] that are full (confirmed bookings reached the daily limit). */
export async function fetchFullDates(from: string, to: string, signal?: AbortSignal): Promise<Set<string>> {
  const res = await fetch(`/api/availability?from=${from}&to=${to}`, { signal });
  if (!res.ok) throw new Error("Couldn't load availability");
  const data = (await res.json()) as { full: string[] };
  return new Set(data.full);
}

// ---- Validation --------------------------------------------------------

export type FieldErrors = Partial<Record<keyof BookingDraft, string>>;

export const PH_MOBILE = /^(\+?63|0)9\d{9}$/;

export function validateEvent(d: BookingDraft, fullDates: ReadonlySet<string>): FieldErrors {
  const e: FieldErrors = {};
  if (!d.eventType) e.eventType = "Choose the kind of event.";
  if (!d.date) e.date = "Pick your event date.";
  else if (!isDateSelectable(d.date, fullDates)) e.date = "That date is fully booked. Please pick another.";
  if (!d.town.trim()) e.town = "Enter the town or city of your venue so we can work out travel.";
  return e;
}

export function validateDetails(d: BookingDraft): FieldErrors {
  const e: FieldErrors = {};
  if (!d.name.trim()) e.name = "Enter your name.";
  const mobile = d.mobile.replace(/[\s-]/g, "");
  if (!mobile) e.mobile = "Enter a mobile number so we can confirm by text.";
  else if (!PH_MOBILE.test(mobile)) e.mobile = "Use a PH mobile number, like 0917 123 4567.";
  if (d.email && !/^\S+@\S+\.\S+$/.test(d.email)) e.email = "Check the email address, e.g. name@gmail.com.";
  return e;
}

// ---- Persistence -------------------------------------------------------

function readJSON<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJSON(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable (private mode); the flow still works in memory.
  }
}

export function loadDraft(): BookingDraft | null {
  const saved = readJSON<Partial<BookingDraft>>(DRAFT_KEY);
  return saved ? { ...emptyDraft(), ...saved } : null;
}

export function saveDraft(draft: BookingDraft) {
  writeJSON(DRAFT_KEY, draft);
}

export function clearDraft() {
  try {
    window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    // ignore
  }
}

export class BookingSubmitError extends Error {
  constructor(
    message: string,
    readonly fieldErrors: FieldErrors = {},
  ) {
    super(message);
  }
}

/** Sends the request to the server, which saves it and emails Pictopia (and the customer, if they gave an email). */
export async function submitBookingRequest(draft: BookingDraft, honeypot = ""): Promise<BookingRequest> {
  let res: Response;
  try {
    res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...draft, company: honeypot }),
    });
  } catch {
    throw new BookingSubmitError("We couldn't reach the server. Check your connection and try again.");
  }
  const data = (await res.json().catch(() => ({}))) as {
    reference?: string;
    total?: number;
    error?: string;
    fieldErrors?: FieldErrors;
  };
  if (!res.ok || !data.reference) {
    throw new BookingSubmitError(
      data.error ?? "Something went wrong sending your request. Please try again, or call us.",
      data.fieldErrors,
    );
  }
  const request: BookingRequest = {
    ...draft,
    reference: data.reference,
    sentAt: new Date().toISOString(),
    total: data.total ?? totalPrice(draft),
  };
  // Keep a copy on this device so the confirmation page can show it (no personal data in the URL).
  const all = readJSON<BookingRequest[]>(REQUESTS_KEY) ?? [];
  writeJSON(REQUESTS_KEY, [request, ...all].slice(0, 10));
  clearDraft();
  return request;
}

export function findRequest(reference: string): BookingRequest | null {
  return (readJSON<BookingRequest[]>(REQUESTS_KEY) ?? []).find((r) => r.reference === reference) ?? null;
}

// ---- Calendar file -----------------------------------------------------

function icsStamp(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function icsEscape(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/[,;]/g, (m) => `\\${m}`).replace(/\n/g, "\\n");
}

/** Builds an .ics for the on-site window. Manila is UTC+8 with no daylight saving. */
export function buildICS(req: BookingRequest): string {
  const [y, m, d] = req.date.split("-").map(Number);
  const startUtc = new Date(Date.UTC(y, m - 1, d, 0, req.startTime - 8 * 60));
  const endUtc = new Date(startUtc.getTime() + onSiteHours(req.plan) * 3600_000);
  const event = eventTypes.find((e) => e.id === req.eventType)?.name ?? "Event";
  const location = [req.venue, req.town, req.province !== "Other" ? req.province : ""].filter(Boolean).join(", ");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Pictopia Photobooth//Booking//EN",
    "BEGIN:VEVENT",
    `UID:${req.reference}@pictopiaphotobooth`,
    `DTSTAMP:${icsStamp(new Date())}`,
    `DTSTART:${icsStamp(startUtc)}`,
    `DTEND:${icsStamp(endUtc)}`,
    `SUMMARY:${icsEscape(`Pictopia Photobooth — ${event} (pending confirmation)`)}`,
    `LOCATION:${icsEscape(location)}`,
    `DESCRIPTION:${icsEscape(`Booking request ${req.reference}. Pictopia will confirm your date and travel fee.`)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}