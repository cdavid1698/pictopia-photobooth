import type { Metadata } from "next";
import { business } from "@/content/business";
import { faqs } from "@/content/faq";
import { FaqList } from "@/components/FaqList";
import { ButtonLink, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Questions",
  description: "Pause time, prices, travel fees, soft copies and more: answers about booking Pictopia Photobooth.",
};

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs
      .filter((f) => !f.sample)
      .map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <Section>
      <h1 className="font-display text-4xl font-semibold md:text-6xl">Questions</h1>
      <p className="mb-10 mt-4 max-w-2xl text-lg text-espresso-soft">
        Can&apos;t find your answer? Call or text {business.phoneDisplay.value}.
      </p>
      <FaqList items={faqs} />
      <ButtonLink href="/book" className="mt-10">
        Check my date
      </ButtonLink>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </Section>
  );
}
