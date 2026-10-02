import type { Metadata, Viewport } from "next";
import { Figtree, Fredoka } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { StickyBookBar } from "@/components/StickyBookBar";
import { LocalBusinessJsonLd } from "@/components/JsonLd";
import { site } from "@/content/site";
import "./globals.css";

const fredoka = Fredoka({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-fredoka" });
const figtree = Figtree({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-figtree" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Pictopia Photobooth · Photobooth rental in Tarlac & Pampanga",
    template: "%s · Pictopia Photobooth",
  },
  description:
    "Unlimited-shot photobooth for weddings, debuts, binyag and parties in Tarlac and Pampanga. From ₱3,500 for 2 booth hours, with pause time during your program.",
  openGraph: {
    type: "website",
    siteName: "Pictopia Photobooth",
    locale: "en_PH",
    images: [{ url: "/images/pictopia-logo.png", width: 518, height: 398, alt: "Pictopia Photobooth logo" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#ffc72c",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-PH" className={`${fredoka.variable} ${figtree.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-paper focus:px-4 focus:py-2 focus:font-semibold"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <StickyBookBar />
        <LocalBusinessJsonLd />
      </body>
    </html>
  );
}
