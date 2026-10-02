// Pricing and inclusions. All values from the client via the agency (A1.x in research/sources.md).

export type TierId = "one" | "two" | "multi";
export type PrintFormat = "4x6-portrait" | "4x6-landscape" | "polaroid" | "strip";

export type Tier = {
  id: TierId;
  name: string;
  shots: string;
  price: number;
  blurb: string;
  formats: PrintFormat[];
  source: string;
};

export const tiers: Tier[] = [
  {
    id: "multi",
    name: "3 or 4 shots",
    shots: "3–4 photos per print",
    price: 3500,
    blurb: "Most fun per print. Great for groups trying a few poses.",
    formats: ["strip", "4x6-portrait", "4x6-landscape"],
    source: "A1.3, A1.11",
  },
  {
    id: "two",
    name: "2 shots",
    shots: "2 photos per print",
    price: 5500,
    blurb: "Two bigger photos, side by side or stacked.",
    formats: ["4x6-portrait", "4x6-landscape"],
    source: "A1.3",
  },
  {
    id: "one",
    name: "1 shot",
    shots: "1 photo per print",
    price: 6000,
    blurb: "One big, clean photo. Our Polaroid-style print lives here.",
    formats: ["4x6-portrait", "4x6-landscape", "polaroid"],
    source: "A1.3, A1.11",
  },
];

export const formatLabels: Record<PrintFormat, string> = {
  "4x6-portrait": "4x6 vertical",
  "4x6-landscape": "4x6 horizontal",
  polaroid: "Polaroid style",
  strip: "Classic photo strip",
};

export const inclusions = {
  source: "A1.2",
  items: [
    "Unlimited shots for 2 hours, with a print for every session",
    "Premium lighting and backdrop",
    "Complete props, picked to suit your event",
    "Free custom layout with your names and date",
    "Digital copies, posted on our Facebook page",
    "On-site staff to help your guests",
    "Standee frame to display the prints",
  ],
};

export const boothHours = {
  onSiteHours: 4,
  operatingHours: 2,
  pauseMin: 0,
  pauseMax: 2,
  extraHourPrice: 1000,
  maxExtraHours: 3,
  source: "A1.6, A1.7",
};

export const magneticPrice = { value: 1000, source: "A1.4" };

export type DisplayId = "standee" | "magnetic";
export const displays: { id: DisplayId; name: string; detail: string; price: number }[] = [
  { id: "standee", name: "Standee frame", detail: "Included", price: 0 },
  { id: "magnetic", name: "Magnetic prints", detail: "Prints with a magnet backing guests take home", price: magneticPrice.value },
];

export type BackdropColor = "blue" | "pink" | "gray" | "white";
export type BackdropFinish = "sequin" | "plain";

export const backdrops = {
  source: "A1.13",
  colors: [
    { id: "blue", name: "Blue", hex: "#6F9FD8" },
    { id: "pink", name: "Pink", hex: "#F2A7C3" },
    { id: "gray", name: "Gray", hex: "#A9A9AE" },
    { id: "white", name: "White", hex: "#F7F7F7" },
  ] satisfies { id: BackdropColor; name: string; hex: string }[],
  finishes: [
    { id: "sequin", name: "Sequin" },
    { id: "plain", name: "Plain" },
  ] satisfies { id: BackdropFinish; name: string }[],
};

export const boothType = {
  name: "Traditional photobooth",
  detail: "Guests see themselves on a live monitor, so everyone's in frame before the countdown.",
  source: "A1.12",
};
