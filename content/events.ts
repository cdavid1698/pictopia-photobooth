// Event types and the booth-hours presets used by the planner.
// Recent events come from public Facebook albums (F21). Client names are deliberately left out.

export type EventTypeId = "wedding" | "debut" | "binyag" | "birthday" | "corporate" | "other";

export type Segment = { kind: "on" | "pause"; hours: number; label: string };

export type EventType = {
  id: EventTypeId;
  name: string;
  hint: string;
  // Default plan: 2 operating hours split around an optional pause of up to 2 hours, all within 4 hours on site.
  plan: Segment[];
};

export const eventTypes: EventType[] = [
  {
    id: "wedding",
    name: "Wedding",
    hint: "Reception photos, then the party",
    plan: [
      { kind: "on", hours: 1, label: "Cocktails & guest arrival" },
      { kind: "pause", hours: 2, label: "Entrance, program & dinner" },
      { kind: "on", hours: 1, label: "Dancing & send-off" },
    ],
  },
  {
    id: "debut",
    name: "Debut (18th birthday)",
    hint: "Booth before and after the 18 roses",
    plan: [
      { kind: "on", hours: 1, label: "Guests arrive" },
      { kind: "pause", hours: 2, label: "18 roses, candles & dinner" },
      { kind: "on", hours: 1, label: "Party" },
    ],
  },
  {
    id: "binyag",
    name: "Binyag / 1st birthday",
    hint: "Christening, first birthday, or both",
    plan: [
      { kind: "on", hours: 1, label: "Guests arrive" },
      { kind: "pause", hours: 1, label: "Cake, program & lunch" },
      { kind: "on", hours: 1, label: "Games & photos" },
    ],
  },
  {
    id: "birthday",
    name: "Birthday party",
    hint: "Kids or adults",
    plan: [
      { kind: "on", hours: 1, label: "Party starts" },
      { kind: "pause", hours: 1, label: "Program & food" },
      { kind: "on", hours: 1, label: "Games & photos" },
    ],
  },
  {
    id: "corporate",
    name: "Corporate or church event",
    hint: "Anniversaries, launches, Christmas parties",
    plan: [
      { kind: "on", hours: 1, label: "Registration" },
      { kind: "pause", hours: 2, label: "Program & meal" },
      { kind: "on", hours: 1, label: "Fellowship" },
    ],
  },
  {
    id: "other",
    name: "Something else",
    hint: "Tell us about it",
    plan: [
      { kind: "on", hours: 1, label: "First booth hour" },
      { kind: "pause", hours: 1, label: "Pause" },
      { kind: "on", hours: 1, label: "Second booth hour" },
    ],
  },
];

export type RecentEvent = { title: string; date: string; place?: string; photos: number; source: string };

export const recentEvents: RecentEvent[] = [
  { title: "7th anniversary celebration", date: "2026-09-27", photos: 260, source: "F21" },
  { title: "18th birthday", date: "2026-09-26", photos: 375, source: "F21" },
  { title: "1st birthday & christening", date: "2026-09-26", place: "Tagpuan sa Nayon, Pura", photos: 235, source: "F21" },
  { title: "Wedding", date: "2026-09-20", photos: 209, source: "F21" },
];
