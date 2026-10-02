"use client";

import { Menu, Phone, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { business } from "@/content/business";
import { nav } from "@/content/site";
import { ButtonLink } from "@/components/ui";

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);

  // Close the mobile menu after navigating.
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b-2 border-espresso bg-paper">
      <div className="mx-auto flex h-18 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="shrink-0" aria-label="Pictopia Photobooth home">
          <Image src="/images/pictopia-logo.png" alt="" width={518} height={398} priority className="h-14 w-auto" />
        </Link>

        <nav aria-label="Main" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="whitespace-nowrap rounded-lg px-3 py-2 font-semibold hover:bg-butter aria-[current=page]:underline aria-[current=page]:decoration-booth-yellow aria-[current=page]:decoration-4 aria-[current=page]:underline-offset-8"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href={`tel:${business.phoneE164.value}`}
          className="ml-auto hidden items-center gap-2 rounded-lg px-2 py-2 font-semibold tabular hover:bg-butter lg:ml-0 xl:flex"
        >
          <Phone className="size-4" aria-hidden />
          {business.phoneDisplay.value}
        </a>

        <ButtonLink href="/book" className="whitespace-nowrap max-lg:hidden">
          Check my date
        </ButtonLink>

        <a
          href={`tel:${business.phoneE164.value}`}
          className="ml-auto grid size-12 place-items-center rounded-xl border-2 border-espresso lg:hidden"
          aria-label={`Call ${business.phoneDisplay.value}`}
        >
          <Phone className="size-5" aria-hidden />
        </a>
        <button
          type="button"
          className="grid size-12 place-items-center rounded-xl border-2 border-espresso lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
        </button>
      </div>

      {menuOpen ? (
        <nav id="mobile-menu" aria-label="Main" className="border-t-2 border-espresso bg-paper px-4 pb-6 pt-2 lg:hidden">
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="block border-b border-line py-4 font-display text-xl font-semibold"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ButtonLink href="/book" className="mt-6 w-full">
            Check my date
          </ButtonLink>
        </nav>
      ) : null}
    </header>
  );
}
