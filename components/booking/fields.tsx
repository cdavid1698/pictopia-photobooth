import type { ComponentProps, ReactNode } from "react";

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 font-semibold text-ember">
      {message}
    </p>
  );
}

export function TextField({
  id,
  label,
  hint,
  error,
  optional,
  ...input
}: ComponentProps<"input"> & { id: string; label: string; hint?: string; error?: string; optional?: boolean }) {
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-err` : null].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={id} className="font-semibold">
        {label}
        {optional ? <span className="font-normal text-espresso-soft"> (optional)</span> : null}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="text-sm text-espresso-soft">
          {hint}
        </p>
      ) : null}
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`mt-2 block min-h-12 w-full rounded-xl border-2 bg-paper px-3 text-lg ${
          error ? "border-ember" : "border-espresso"
        }`}
        {...input}
      />
      <FieldError id={`${id}-err`} message={error} />
    </div>
  );
}

/** Radio styled as a selectable card. */
export function ChoiceCard({
  name,
  value,
  checked,
  onChange,
  children,
  className = "",
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block cursor-pointer ${className}`}>
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="peer sr-only" />
      <span className="block h-full rounded-xl border-2 border-espresso p-4 peer-checked:bg-booth-yellow peer-checked:shadow-print-sm peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ember">
        {children}
      </span>
    </label>
  );
}
