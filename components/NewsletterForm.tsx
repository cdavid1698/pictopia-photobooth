"use client";

import { useId, useState } from "react";
import { postForm } from "@/lib/post";

/** Promo alert sign-up, stored in the subscribers table. */
export function NewsletterForm() {
  const id = useId();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);

  if (done) {
    return (
      <p className="mt-6 rounded-xl border-2 border-booth-yellow p-4" role="status">
        You&apos;re on the list. We&apos;ll email you when we run a promo.
      </p>
    );
  }

  return (
    <form
      className="mt-6 max-w-sm"
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        if (!/^\S+@\S+\.\S+$/.test(email)) {
          setError("Enter an email like name@gmail.com.");
          return;
        }
        setSending(true);
        const result = await postForm("/api/subscribe", { email });
        setSending(false);
        if (result.ok) setDone(true);
        else setError(result.error);
      }}
    >
      <label htmlFor={id} className="font-semibold">
        Get promo alerts by email
      </label>
      <div className="mt-2 flex gap-2">
        <input
          id={id}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-err` : undefined}
          className="min-h-12 w-full min-w-0 rounded-xl border-2 border-paper/60 bg-transparent px-3 text-paper placeholder:text-paper/50 focus:border-booth-yellow focus:outline-none"
          placeholder="you@email.com"
        />
        <button type="submit" disabled={sending} className="min-h-12 shrink-0 rounded-xl bg-booth-yellow px-4 font-display font-semibold text-espresso">
          {sending ? "Saving…" : "Sign up"}
        </button>
      </div>
      {error ? (
        <p id={`${id}-err`} className="mt-2 text-sm text-booth-yellow">
          {error}
        </p>
      ) : null}
    </form>
  );
}
