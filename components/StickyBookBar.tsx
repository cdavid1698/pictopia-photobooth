"use client";

import { usePathname } from "next/navigation";
import { tiers } from "@/content/packages";
import { formatPeso } from "@/lib/format";
import { ButtonLink } from "@/components/ui";

const fromPrice = Math.min(...tiers.map((t) => t.price));

/** Mobile-only bar keeping the primary action one tap away. Hidden inside the booking flow. */
export function StickyBookBar() {
  const pathname = usePathname();
  if (pathname.startsWith("/book")) return null;

  return (
    <>
      <div aria-hidden className="h-20 lg:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-espresso bg-paper px-4 py-3 lg:hidden">
        <div className="flex items-center gap-3">
          <p className="text-sm leading-tight">
            From <span className="font-display text-lg font-semibold tabular">{formatPeso(fromPrice)}</span>
            <br />
            No deposit needed
          </p>
          <ButtonLink href="/book" className="ml-auto flex-1">
            Check my date
          </ButtonLink>
        </div>
      </div>
    </>
  );
}
