import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 font-display text-lg font-semibold transition-[transform,box-shadow,background-color] disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  // The only sticker-style control on the site: the primary action.
  primary:
    "bg-booth-yellow text-espresso border-2 border-espresso shadow-print hover:-translate-x-px hover:-translate-y-px hover:shadow-[5px_5px_0_0_#2e1b0e] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
  secondary: "bg-paper text-espresso border-2 border-espresso hover:bg-butter",
  ghost: "text-espresso underline decoration-2 underline-offset-4 hover:decoration-ember px-1",
};

export function buttonClass(variant: Variant = "primary", extra = "") {
  return `${base} ${variants[variant]} ${extra}`;
}

export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link {...props} className={buttonClass(variant, className)} />;
}

export function Section({
  children,
  className = "",
  tone = "paper",
  id,
  labelledBy,
}: {
  children: ReactNode;
  className?: string;
  tone?: "paper" | "butter" | "yellow";
  id?: string;
  labelledBy?: string;
}) {
  const bg = tone === "butter" ? "bg-butter" : tone === "yellow" ? "bg-booth-yellow" : "bg-paper";
  return (
    <section id={id} aria-labelledby={labelledBy} className={`${bg} px-4 py-14 sm:px-6 md:py-20 ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

export function SectionHeading({ id, title, intro }: { id: string; title: string; intro?: ReactNode }) {
  return (
    <div className="mb-8 max-w-2xl md:mb-10">
      <h2 id={id} className="font-display text-3xl font-semibold leading-tight md:text-[2.5rem]">
        {title}
      </h2>
      {intro ? <p className="mt-3 text-lg leading-relaxed text-espresso-soft">{intro}</p> : null}
    </div>
  );
}
