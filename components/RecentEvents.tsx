import { ExternalLink } from "lucide-react";
import { business } from "@/content/business";
import { formatShortDate } from "@/lib/format";
import { getRecentEvents } from "@/lib/server/facebook";

/** Latest events from the Facebook page — event type, date and venue only, never client names. */
export async function RecentEvents() {
  const { events } = await getRecentEvents(4);
  return (
    <div>
      <ul className="divide-y divide-espresso/20">
        {events.map((e) => {
          const photos = `${e.photos} photos posted`;
          return (
            <li key={e.url ?? e.title + e.date} className="grid grid-cols-[6.5rem_1fr] gap-x-4 py-3 sm:grid-cols-[7.5rem_1fr_auto]">
              <span className="tabular text-espresso-soft">{formatShortDate(e.date)}</span>
              <span className="font-semibold">
                {e.title}
                {e.place ? <span className="block font-normal text-espresso-soft">{e.place}</span> : null}
              </span>
              <span className="col-start-2 text-sm tabular text-espresso-soft sm:col-start-3 sm:text-base">
                {e.url ? (
                  <a href={e.url} target="_blank" rel="noopener" className="underline decoration-1 underline-offset-4 hover:text-ember">
                    {photos}
                    <span className="sr-only"> on Facebook (opens in a new tab)</span>
                  </a>
                ) : (
                  photos
                )}
              </span>
            </li>
          );
        })}
      </ul>
      <a
        href={business.facebookUrl.value}
        target="_blank"
        rel="noopener"
        className="mt-4 inline-flex min-h-11 items-center gap-2 font-semibold text-ember underline decoration-2 underline-offset-4 hover:text-espresso"
      >
        See the albums on Facebook <ExternalLink className="size-4" aria-hidden />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </div>
  );
}
