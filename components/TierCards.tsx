import Link from "next/link";
import { formatLabels, tiers } from "@/content/packages";
import { formatPeso } from "@/lib/format";
import { PrintPreview } from "@/components/PrintPreview";

/** The three price tiers, each shown as the print it produces. */
export function TierCards() {
  return (
    <ul className="grid gap-6 sm:grid-cols-3">
      {tiers.map((t) => {
        const format = t.formats[0];
        return (
          <li key={t.id} className="flex flex-col rounded-2xl border-2 border-espresso bg-paper p-5">
            <div className="grid h-64 place-items-center rounded-xl bg-butter p-4">
              <PrintPreview
                tier={t.id}
                format={format}
                color={t.id === "one" ? "blue" : t.id === "two" ? "pink" : "white"}
                className="h-full max-w-full"
                title={`Example ${formatLabels[format]} print with ${t.shots}`}
              />
            </div>
            <h3 className="mt-5 font-display text-2xl font-semibold">{t.name}</h3>
            <p className="font-display text-3xl font-semibold tabular text-ember">{formatPeso(t.price)}</p>
            <p className="mt-2 text-espresso-soft">{t.blurb}</p>
            <p className="mt-3 text-sm">
              <span className="font-semibold">Print styles:</span> {t.formats.map((f) => formatLabels[f]).join(", ")}
            </p>
            <Link
              href={`/book?tier=${t.id}`}
              className="mt-auto inline-flex min-h-11 items-center pt-4 font-semibold text-ember underline decoration-2 underline-offset-4 hover:text-espresso"
            >
              Book the {t.name.toLowerCase()} package
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
