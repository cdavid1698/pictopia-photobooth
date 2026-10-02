export const site = {
  agencyName: process.env.NEXT_PUBLIC_AGENCY_NAME ?? "CK David",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en-PH",
  currency: "PHP",
};

export const nav = [
  { href: "/packages", label: "Packages" },
  { href: "/pause-time", label: "Pause time" },
  { href: "/book/status", label: "Booking status" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];
