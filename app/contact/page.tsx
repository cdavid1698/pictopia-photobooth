import { Mail, MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";
import { bases, business } from "@/content/business";
import { PartnerForm } from "@/components/PartnerForm";
import { Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Contact",
  description: "Call or text 0916 565 7183, message us on Facebook, or email. Based in Pura, Tarlac and Magalang, Pampanga.",
};

const channels = [
  { icon: Phone, label: "Call or text", value: business.phoneDisplay.value, href: `tel:${business.phoneE164.value}` },
  { icon: MessageCircle, label: "Messenger", value: "PictopiaPhotobooth2025", href: business.messengerUrl.value },
  { icon: Mail, label: "Email", value: business.email.value, href: `mailto:${business.email.value}` },
];

export default function ContactPage() {
  return (
    <>
      <Section>
        <h1 className="font-display text-4xl font-semibold md:text-6xl">Contact us</h1>
        <p className="mt-4 max-w-2xl text-lg text-espresso-soft">
          Asking about a date? The fastest way is to call or text. You can also send a booking request online any time.
        </p>
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {channels.map(({ icon: Icon, label, value, href }) => (
            <li key={label}>
              <a
                href={href}
                {...(href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}
                className="flex h-full items-start gap-4 rounded-2xl border-2 border-espresso p-5 hover:bg-butter"
              >
                <Icon className="mt-1 size-6 shrink-0 text-ember" aria-hidden />
                <span className="min-w-0">
                  <span className="block font-display text-xl font-semibold">{label}</span>
                  <span className="text-lg tabular [overflow-wrap:anywhere]">
                    {value.includes("@") ? (
                      <>
                        {value.split("@")[0]}
                        <wbr />@{value.split("@")[1]}
                      </>
                    ) : (
                      value
                    )}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="butter" labelledBy="bases-h" className="border-y-2 border-espresso">
        <h2 id="bases-h" className="font-display text-3xl font-semibold md:text-[2.5rem]">
          Where we&apos;re based
        </h2>
        <p className="mt-3 max-w-2xl text-lg text-espresso-soft">
          We travel to venues across Tarlac and Pampanga. The travel fee depends on the location.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {bases.map((b) => (
            <div key={b.id} className="overflow-hidden rounded-2xl border-2 border-espresso bg-paper">
              <iframe
                title={`Map of ${b.town}, ${b.province}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(b.mapQuery)}&z=13&output=embed`}
                className="h-64 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <p className="p-4 font-display text-xl font-semibold">
                {[b.detail, b.town, b.province].filter(Boolean).join(", ")}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section labelledBy="partner-h">
        <div className="grid gap-10 md:grid-cols-[1fr_1.3fr]">
          <div>
            <h2 id="partner-h" className="font-display text-3xl font-semibold md:text-[2.5rem]">
              Caterers, stylists and coordinators
            </h2>
            <p className="mt-3 text-lg text-espresso-soft">
              Planning events for clients? Tell us about your business and we&apos;ll get in touch about working together.
            </p>
          </div>
          <PartnerForm />
        </div>
      </Section>
    </>
  );
}
