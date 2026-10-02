import { Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { backdrops, boothHours, boothType, displays, inclusions } from "@/content/packages";
import { formatPeso } from "@/lib/format";
import { TierCards } from "@/components/TierCards";
import { ButtonLink, Section, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Packages and prices",
  description:
    "Photobooth packages from ₱3,500: 2 hours of unlimited shots, props, backdrop, custom layout and digital copies. Serving Tarlac and Pampanga.",
};

export default function PackagesPage() {
  const magnetic = displays.find((d) => d.id === "magnetic")!;
  return (
    <>
      <section className="border-b-2 border-espresso bg-booth-yellow px-4 py-12 sm:px-6 md:py-16">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-display text-4xl font-semibold md:text-6xl">Packages and prices</h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl">
            One simple rule: the fewer photos on each print, the bigger they are. Every package includes 2 hours of
            unlimited shots, with pause time during your program.
          </p>
        </div>
      </section>

      <Section labelledBy="tiers-h">
        <h2 id="tiers-h" className="sr-only">
          Price by photos per print
        </h2>
        <TierCards />
      </Section>

      <Section tone="butter" labelledBy="inc-h" className="border-y-2 border-espresso">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h2 id="inc-h" className="font-display text-3xl font-semibold md:text-[2.5rem]">
              Included in every package
            </h2>
            <ul className="mt-6 space-y-3">
              {inclusions.items.map((item) => (
                <li key={item} className="flex gap-3 text-lg">
                  <Check className="mt-1 size-5 shrink-0" aria-hidden strokeWidth={3} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-3xl font-semibold md:text-[2.5rem]">Extras</h2>
            <table className="mt-6 w-full text-left text-lg">
              <caption className="sr-only">Optional extras and prices</caption>
              <tbody className="divide-y divide-espresso/20">
                <tr>
                  <th scope="row" className="py-3 pr-4 font-semibold">
                    {magnetic.name}
                    <span className="block text-base font-normal text-espresso-soft">{magnetic.detail}</span>
                  </th>
                  <td className="py-3 text-right tabular">+{formatPeso(magnetic.price)}</td>
                </tr>
                <tr>
                  <th scope="row" className="py-3 pr-4 font-semibold">
                    Extra booth hour
                    <span className="block text-base font-normal text-espresso-soft">More time with unlimited shots</span>
                  </th>
                  <td className="py-3 text-right tabular">+{formatPeso(boothHours.extraHourPrice)} / hr</td>
                </tr>
                <tr>
                  <th scope="row" className="py-3 pr-4 font-semibold">
                    Travel fee
                    <span className="block text-base font-normal text-espresso-soft">Depends on your venue</span>
                  </th>
                  <td className="py-3 text-right">Quoted</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      <Section labelledBy="setup-h">
        <SectionHeading id="setup-h" title="Your setup" />
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-display text-xl font-semibold">{boothType.name}</h3>
            <p className="mt-2 text-lg text-espresso-soft">{boothType.detail}</p>
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold">Backdrop</h3>
            <p className="mt-2 text-lg text-espresso-soft">Sequin or plain, in your choice of color:</p>
            <ul className="mt-3 flex flex-wrap gap-3">
              {backdrops.colors.map((c) => (
                <li key={c.id} className="flex items-center gap-2">
                  <span className="size-6 rounded-full border-2 border-espresso" style={{ backgroundColor: c.hex }} aria-hidden />
                  {c.name}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold">Props</h3>
            <p className="mt-2 text-lg text-espresso-soft">
              Free to use. We pick a set to match your event, so a debut and a christening each get the right look.
            </p>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap items-center gap-6">
          <ButtonLink href="/book">Check my date</ButtonLink>
          <Link href="/pause-time" className="font-semibold text-ember underline decoration-2 underline-offset-4">
            How pause time works
          </Link>
        </div>
      </Section>
    </>
  );
}
