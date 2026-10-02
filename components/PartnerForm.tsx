"use client";

import { useState } from "react";
import { PH_MOBILE } from "@/lib/booking";
import { postForm } from "@/lib/post";
import { TextField } from "@/components/booking/fields";
import { buttonClass } from "@/components/ui";

type Errors = Partial<Record<"business" | "contact" | "mobile" | "message", string>>;

/** Partner enquiry: saved to the database and emailed to Pictopia. */
export function PartnerForm() {
  const [values, setValues] = useState({ business: "", kind: "Catering", contact: "", mobile: "", message: "", company: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div role="status" className="rounded-2xl border-2 border-espresso bg-booth-yellow p-6">
        <p className="font-display text-2xl font-semibold">Enquiry sent</p>
        <p className="mt-2 text-lg">Thanks, {values.contact.split(" ")[0]}. We&apos;ll be in touch about working together.</p>
      </div>
    );
  }

  const set = (k: keyof typeof values) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const showErrors = (found: Errors) => {
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) document.getElementById(`partner-${first}`)?.focus();
  };

  return (
    <form
      noValidate
      className="relative grid gap-5"
      onSubmit={async (e) => {
        e.preventDefault();
        const found: Errors = {};
        if (!values.business.trim()) found.business = "Enter your business name.";
        if (!values.contact.trim()) found.contact = "Enter your name.";
        if (!PH_MOBILE.test(values.mobile.replace(/[\s-]/g, ""))) found.mobile = "Use a PH mobile number, like 0917 123 4567.";
        if (Object.keys(found).length) return showErrors(found);

        setSending(true);
        setFormError("");
        const result = await postForm("/api/enquiries", values);
        setSending(false);
        if (result.ok) setSent(true);
        else {
          setFormError(result.error);
          showErrors(result.fieldErrors as Errors);
        }
      }}
    >
      <TextField id="partner-business" label="Business name" value={values.business} onChange={set("business")} error={errors.business} />
      <div>
        <label htmlFor="partner-kind" className="font-semibold">
          What you do
        </label>
        <select
          id="partner-kind"
          value={values.kind}
          onChange={set("kind")}
          className="mt-2 block min-h-12 w-full rounded-xl border-2 border-espresso bg-paper px-3 text-lg"
        >
          <option>Catering</option>
          <option>Event styling</option>
          <option>Event coordination</option>
          <option>Venue</option>
          <option>Other</option>
        </select>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField id="partner-contact" label="Your name" autoComplete="name" value={values.contact} onChange={set("contact")} error={errors.contact} />
        <TextField
          id="partner-mobile"
          label="Mobile number"
          type="tel"
          autoComplete="tel"
          value={values.mobile}
          onChange={set("mobile")}
          error={errors.mobile}
        />
      </div>
      <div>
        <label htmlFor="partner-message" className="font-semibold">
          Message <span className="font-normal text-espresso-soft">(optional)</span>
        </label>
        <textarea
          id="partner-message"
          rows={4}
          maxLength={1500}
          value={values.message}
          onChange={set("message")}
          className="mt-2 block w-full rounded-xl border-2 border-espresso px-3 py-2 text-lg"
        />
      </div>
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="partner-company">Company</label>
        <input id="partner-company" tabIndex={-1} autoComplete="off" value={values.company} onChange={set("company")} />
      </div>
      {formError ? (
        <p role="alert" className="font-semibold text-ember">
          {formError}
        </p>
      ) : null}
      <button type="submit" disabled={sending} className={buttonClass("primary", "justify-self-start")}>
        {sending ? "Sending…" : "Send partner enquiry"}
      </button>
    </form>
  );
}
