import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { bases, business } from "@/content/business";
import { nav, site } from "@/content/site";
import { NewsletterForm } from "@/components/NewsletterForm";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M13.5 21v-7.5H16l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21h3Z" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-espresso bg-espresso px-4 pb-10 pt-14 text-paper sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl font-semibold">Pictopia Photobooth</p>
          <p className="mt-2 max-w-sm text-paper/80">
            Unlimited-shot photobooth for celebrations across Tarlac and Pampanga.
          </p>
          <NewsletterForm />
        </div>

        <div>
          <h2 className="font-display text-lg font-semibold text-booth-yellow">Get in touch</h2>
          <ul className="mt-3 space-y-3">
            <li>
              <a href={`tel:${business.phoneE164.value}`} className="inline-flex min-h-11 items-center gap-2 tabular hover:underline">
                <Phone className="size-4" aria-hidden /> {business.phoneDisplay.value}
              </a>
            </li>
            <li>
              <a href={`mailto:${business.email.value}`} className="inline-flex min-h-11 items-center gap-2 break-all hover:underline">
                <Mail className="size-4 shrink-0" aria-hidden /> {business.email.value}
              </a>
            </li>
            <li>
              <a href={business.facebookUrl.value} className="inline-flex min-h-11 items-center gap-2 hover:underline" rel="noopener" target="_blank">
                <FacebookIcon className="size-4" /> Facebook: PictopiaPhotobooth2025
              </a>
            </li>
            {bases.map((b) => (
              <li key={b.id} className="flex items-start gap-2 text-paper/80">
                <MapPin className="mt-1 size-4 shrink-0" aria-hidden />
                {[b.detail, b.town, b.province].filter(Boolean).join(", ")}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-lg font-semibold text-booth-yellow">Pages</h2>
          <ul className="mt-3 grid gap-1">
            {[{ href: "/book", label: "Book" }, ...nav, { href: "/privacy", label: "Privacy" }, { href: "/terms", label: "Terms" }].map(
              (item) => (
                <li key={item.href}>
                  <Link href={item.href} className="inline-flex min-h-11 items-center hover:underline">
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-6xl border-t border-paper/20 pt-6 text-sm text-paper/70">
        © {new Date().getFullYear()} Pictopia Photobooth. Website by {site.agencyName}.
      </p>
    </footer>
  );
}
