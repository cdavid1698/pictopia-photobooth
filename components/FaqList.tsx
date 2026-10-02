import { ChevronDown } from "lucide-react";
import type { Faq } from "@/content/faq";

export function FaqList({ items }: { items: Faq[] }) {
  return (
    <div className="divide-y-2 divide-espresso border-y-2 border-espresso">
      {items.map((f) => (
        <details key={f.q} className="group">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-display text-xl font-semibold [&::-webkit-details-marker]:hidden">
            {f.q}
            <ChevronDown className="size-5 shrink-0 transition-transform group-open:rotate-180" aria-hidden />
          </summary>
          <p className="max-w-[68ch] pb-5 text-lg leading-relaxed">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
