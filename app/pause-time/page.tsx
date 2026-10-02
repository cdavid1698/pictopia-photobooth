import type { Metadata } from "next";
import { HoursPlannerDemo } from "@/components/HoursPlannerDemo";
import { Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "How pause time works",
  description:
    "We stay up to 4 hours and run the booth for 2, pausing for up to 2 hours during your program so guests don't miss the important parts.",
};

const reasons = [
  {
    title: "Guests watch the program",
    body: "No queue at the booth while the couple makes their entrance or the debutante dances with her 18 roses.",
  },
  {
    title: "Booth time when it's busiest",
    body: "Your 2 hours go where they count: when guests arrive, and when the party starts after dinner.",
  },
  {
    title: "You set the timing",
    body: "Tell us when your program starts and how long it runs, and we'll plan the pause around it.",
  },
];

export default function PauseTimePage() {
  return (
    <>
      <section className="border-b-2 border-espresso bg-booth-yellow px-4 py-12 sm:px-6 md:py-16">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-display text-4xl font-semibold md:text-6xl">How pause time works</h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl">
            We stay at your venue for up to 4 hours and run the booth for 2 of them. During your program we can pause for up to 2
            hours, then start again for the party. No program? We can run straight through.
          </p>
        </div>
      </section>

      <Section labelledBy="why-h">
        <h2 id="why-h" className="font-display text-3xl font-semibold md:text-[2.5rem]">
          Why it matters
        </h2>
        <ul className="mt-8 grid gap-8 md:grid-cols-3">
          {reasons.map((r) => (
            <li key={r.title} className="border-t-4 border-booth-yellow pt-4">
              <h3 className="font-display text-xl font-semibold">{r.title}</h3>
              <p className="mt-2 text-lg text-espresso-soft">{r.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="butter" labelledBy="try-h" className="border-t-2 border-espresso">
        <h2 id="try-h" className="mb-8 font-display text-3xl font-semibold md:text-[2.5rem]">
          Plan your booth hours
        </h2>
        <HoursPlannerDemo />
      </Section>
    </>
  );
}
