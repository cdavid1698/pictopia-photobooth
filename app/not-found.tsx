import { ButtonLink, Section } from "@/components/ui";

export default function NotFound() {
  return (
    <Section>
      <h1 className="font-display text-4xl font-semibold md:text-5xl">This page didn&apos;t make it into the album</h1>
      <p className="mt-4 text-lg text-espresso-soft">The link may be old or mistyped.</p>
      <div className="mt-8 flex flex-wrap gap-4">
        <ButtonLink href="/">Go to home</ButtonLink>
        <ButtonLink href="/book" variant="secondary">
          Check my date
        </ButtonLink>
      </div>
    </Section>
  );
}
