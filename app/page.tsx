import { Check, MapPin } from "lucide-react";
import Link from "next/link";
import { bases } from "@/content/business";
import { eventTypes } from "@/content/events";
import { faqs } from "@/content/faq";
import { boothType, inclusions } from "@/content/packages";
import { DateCheckForm } from "@/components/DateCheckForm";
import { FaqList } from "@/components/FaqList";
import { HeroBooth } from "@/components/HeroBooth";
import { HoursPlannerDemo } from "@/components/HoursPlannerDemo";
import { RecentEvents } from "@/components/RecentEvents";
import { TierCards } from "@/components/TierCards";
import { ButtonLink, Section, SectionHeading } from "@/components/ui";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="overflow-hidden border-b-2 border-espresso bg-booth-yellow px-4 pb-12 pt-10 sm:px-6 md:pb-16 md:pt-16">
        <div className="mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-[1.15fr_1fr]">
          <div>
            <h1 className="font-display text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl">
              Unlimited photobooth for your celebration in Tarlac &amp; Pampanga
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed sm:text-xl">
              From ₱3,500 for 2 hours of unli shots. When your program starts, we pause the booth, so no one misses the
              entrance, the 18 roses or the cake.
            </p>
            <div className="mt-8">
              <DateCheckForm />
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
              {["No deposit to reserve", "Digital copies included", "Props & custom layout included"].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <Check className="size-4" aria-hidden strokeWidth={3} /> {t}
                </li>
              ))}
            </ul>
          </div>
          <HeroBooth className="mx-auto w-full max-w-[20rem] md:max-w-[26rem]" />
        </div>
      </section>

      {/* Tiers */}
      <Section labelledBy="tiers-h">
        <SectionHeading
          id="tiers-h"
          title="Pick your print"
          intro="Your price depends on how many photos go on each print. Every package has 2 hours of unlimited shots and a print for every session."
        />
        <TierCards />
        <p className="mt-6 text-espresso-soft">
          Add magnetic prints for ₱1,000, or extra booth hours for ₱1,000 each.{" "}
          <Link href="/packages" className="font-semibold text-ember underline decoration-2 underline-offset-4">
            See full package details
          </Link>
        </p>
      </Section>

      {/* Signature: pause time */}
      <Section tone="butter" labelledBy="pause-h" className="border-y-2 border-espresso">
        <SectionHeading
          id="pause-h"
          title="Booth hours that fit your program"
          intro="We're on site for up to 4 hours and run the booth for 2. We pause for 1 to 2 hours during your program, then start again for the party. Try it with your own timing."
        />
        <HoursPlannerDemo />
      </Section>

      {/* Inclusions + events */}
      <Section labelledBy="includes-h">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h2 id="includes-h" className="font-display text-3xl font-semibold md:text-[2.5rem]">
              Every package includes
            </h2>
            <ul className="mt-6 space-y-3">
              {inclusions.items.map((item) => (
                <li key={item} className="flex gap-3 text-lg">
                  <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full border-2 border-espresso bg-booth-yellow">
                    <Check className="size-3.5" aria-hidden strokeWidth={3.5} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-espresso-soft">
              <span className="font-semibold text-espresso">{boothType.name}.</span> {boothType.detail}
            </p>
          </div>
          <div>
            <h2 className="font-display text-3xl font-semibold md:text-[2.5rem]">Celebrations we cover</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {eventTypes
                .filter((e) => e.id !== "other")
                .map((e) => (
                  <li key={e.id}>
                    <Link
                      href={`/book?event=${e.id}`}
                      className="block min-h-11 rounded-xl border-2 border-espresso p-4 hover:bg-butter"
                    >
                      <span className="block font-display text-lg font-semibold">{e.name}</span>
                      <span className="text-sm text-espresso-soft">{e.hint}</span>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Proof + area */}
      <Section tone="butter" labelledBy="recent-h" className="border-y-2 border-espresso">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 id="recent-h" className="font-display text-3xl font-semibold md:text-[2.5rem]">
              Recently at the booth
            </h2>
            <p className="mt-3 text-lg text-espresso-soft">
              Every event gets its own photo album on our Facebook page.
            </p>
            <div className="mt-6">
              <RecentEvents />
            </div>
          </div>
          <div>
            <h2 className="font-display text-3xl font-semibold md:text-[2.5rem]">Where we go</h2>
            <p className="mt-3 text-lg text-espresso-soft">
              We have bases in Tarlac and Pampanga. The travel fee depends on your venue, and we&apos;ll confirm it with you
              before anything is final.
            </p>
            <ul className="mt-6 space-y-3">
              {bases.map((b) => (
                <li key={b.id} className="flex items-center gap-3 rounded-xl border-2 border-espresso bg-paper p-4">
                  <MapPin className="size-5 shrink-0 text-ember" aria-hidden />
                  <span>
                    <span className="block font-display text-lg font-semibold">
                      {b.town}, {b.province}
                    </span>
                    {b.detail ? <span className="text-sm text-espresso-soft">{b.detail}</span> : null}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section labelledBy="faq-h">
        <SectionHeading id="faq-h" title="Good to know" />
        <FaqList items={faqs.slice(0, 5)} />
        <Link href="/faq" className="mt-6 inline-flex min-h-11 items-center font-semibold text-ember underline decoration-2 underline-offset-4">
          All questions
        </Link>
      </Section>

      {/* Closing CTA */}
      <section className="border-t-2 border-espresso bg-booth-yellow px-4 py-14 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-3xl font-semibold md:text-4xl">Is your date still open?</h2>
            <p className="mt-2 text-lg">It takes about two minutes to request it, and there&apos;s no deposit.</p>
          </div>
          <ButtonLink href="/book" className="bg-paper">
            Check my date
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
