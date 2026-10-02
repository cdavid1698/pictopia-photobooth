const peso = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 });

export function formatPeso(amount: number): string {
  return peso.format(amount);
}

/** Parses "YYYY-MM-DD" as a local calendar date (no timezone shift). */
export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function toISODate(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${m}-${d}`;
}

export function formatLongDate(iso: string): string {
  return parseISODate(iso).toLocaleDateString("en-PH", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatShortDate(iso: string): string {
  return parseISODate(iso).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
}

/** Minutes since midnight → "4:30 PM". */
export function formatClock(minutes: number): string {
  const m = ((minutes % 1440) + 1440) % 1440;
  const h24 = Math.floor(m / 60);
  const mm = String(m % 60).padStart(2, "0");
  const suffix = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${mm} ${suffix}`;
}

export function formatHours(hours: number): string {
  if (hours === 0.5) return "30 min";
  const whole = Number.isInteger(hours);
  const n = whole ? String(hours) : hours.toFixed(1);
  return `${n} ${hours === 1 ? "hour" : "hours"}`;
}
