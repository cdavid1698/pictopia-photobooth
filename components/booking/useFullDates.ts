"use client";

import { useEffect, useState } from "react";
import { fetchFullDates } from "@/lib/booking";

// Every full date seen this session, so step validation can use what the calendar already loaded.
const knownFull = new Set<string>();
const cache = new Map<string, Set<string>>();

export function knownFullDates(): ReadonlySet<string> {
  return knownFull;
}

type State = { key: string; full: Set<string>; failed: boolean };

/** Loads which dates in [from, to] are fully booked. Pass empty strings to skip. */
export function useFullDates(from: string, to: string) {
  const key = from && to ? `${from}:${to}` : "";
  const [state, setState] = useState<State>({ key: "", full: new Set(), failed: false });

  useEffect(() => {
    if (!key || cache.has(key)) return;
    const controller = new AbortController();
    fetchFullDates(from, to, controller.signal)
      .then((full) => {
        cache.set(key, full);
        full.forEach((d) => knownFull.add(d));
        setState({ key, full, failed: false });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        console.error(error);
        setState({ key, full: new Set(), failed: true });
      });
    return () => controller.abort();
  }, [key, from, to]);

  const cached = cache.get(key);
  if (!key) return { full: new Set<string>(), loading: false, failed: false };
  if (cached) return { full: cached, loading: false, failed: false };
  if (state.key === key) return { full: state.full, loading: false, failed: state.failed };
  return { full: new Set<string>(), loading: true, failed: false };
}
