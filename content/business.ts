// Facts about the business. `source` refers to an ID in research/sources.md.

export type Sourced<T> = { value: T; source: string; sample?: false } | { value: T; sample: true; source?: undefined };

export const business = {
  name: { value: "Pictopia Photobooth", source: "F1" },
  tagline: {
    value: "At Pictopia, we bring your events to life with our state-of-the-art photobooth experience!",
    source: "F9",
  },
  owners: { value: ["Juliette Barrera", "Kenneth David"], source: "F20" },
  phoneDisplay: { value: "0916 565 7183", source: "A1.1" },
  phoneE164: { value: "+639165657183", source: "A1.1" },
  email: { value: "pictopiamirrorphotobooth@gmail.com", source: "F5" },
  facebookUrl: { value: "https://www.facebook.com/PictopiaPhotobooth2025", source: "S1" },
  messengerUrl: { value: "https://m.me/PictopiaPhotobooth2025", source: "S1" },
  replyTime: { value: "within 24 hours", sample: true },
} satisfies Record<string, Sourced<unknown>>;

export type Base = {
  id: string;
  town: string;
  province: string;
  detail?: string;
  mapQuery: string;
  source: string;
};

export const bases: Base[] = [
  {
    id: "pura",
    town: "Pura",
    province: "Tarlac",
    detail: "Brgy. Estipona",
    mapQuery: "Estipona, Pura, Tarlac, Philippines",
    source: "F6, F7",
  },
  {
    id: "magalang",
    town: "Magalang",
    province: "Pampanga",
    mapQuery: "Magalang, Pampanga, Philippines",
    source: "F7",
  },
];
