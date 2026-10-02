import type { ReactNode } from "react";
import { Section } from "@/components/ui";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Section>
      <div className="max-w-[68ch]">
        <h1 className="font-display text-4xl font-semibold md:text-5xl">{title}</h1>
        <div className="mt-8 grid gap-4 text-lg leading-relaxed [&_h2]:mt-6 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold">
          {children}
        </div>
      </div>
    </Section>
  );
}
