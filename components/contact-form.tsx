"use client";

import { Check, LoaderCircle, Send } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
  initialContactState,
  submitContactForm,
  type ContactState,
} from "@/app/actions/contact";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Field({
  label,
  name,
  error,
  defaultValue,
  required,
  children,
  hint,
}: {
  label: string;
  name: string;
  error?: string;
  defaultValue?: string;
  required?: boolean;
  children?: React.ReactNode;
  hint?: string;
}) {
  const id = `contact-${name}`;
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {required ? <span className="ml-1 text-accent">*</span> : null}
      </label>
      {children ?? (
        <input
          id={id}
          name={name}
          defaultValue={defaultValue}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "h-11 rounded-xl bg-surface px-3.5 text-sm ring-hairline transition-shadow outline-none",
            "placeholder:text-subtle focus:ring-2 focus:ring-(--color-accent)",
            error && "ring-2 ring-red-500/60",
          )}
        />
      )}
      {hint && !error ? (
        <p className="text-xs text-subtle">{hint}</p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="text-xs text-red-500">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <LoaderCircle className="size-4 animate-spin" />
          Sending…
        </>
      ) : (
        <>
          <Send className="size-4" />
          Send message
        </>
      )}
    </Button>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState<ContactState, FormData>(
    submitContactForm,
    initialContactState,
  );

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="flex flex-col items-start gap-3 rounded-2xl bg-surface p-7 ring-hairline"
      >
        <span className="grid size-10 place-items-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <Check className="size-5" />
        </span>
        <h3 className="text-lg font-semibold">Message sent</h3>
        <p className="text-sm leading-relaxed text-muted">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Name"
          name="name"
          required
          error={state.errors?.name}
          defaultValue={state.values?.name}
        />
        <Field
          label="Email"
          name="email"
          required
          error={state.errors?.email}
          defaultValue={state.values?.email}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Phone"
          name="phone"
          hint="Optional"
          error={state.errors?.phone}
          defaultValue={state.values?.phone}
        />
        <Field
          label="Subject"
          name="subject"
          hint="Optional"
          error={state.errors?.subject}
          defaultValue={state.values?.subject}
        />
      </div>

      <Field
        label="Message"
        name="message"
        required
        error={state.errors?.message}
      >
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          required
          defaultValue={state.values?.message}
          placeholder="Tell me about your project, timeline and what you need help with."
          aria-invalid={Boolean(state.errors?.message)}
          aria-describedby={
            state.errors?.message ? "contact-message-error" : undefined
          }
          className={cn(
            "resize-y rounded-xl bg-surface p-3.5 text-sm leading-relaxed ring-hairline outline-none transition-shadow",
            "placeholder:text-subtle focus:ring-2 focus:ring-(--color-accent)",
            state.errors?.message && "ring-2 ring-red-500/60",
          )}
        />
      </Field>

      {/* Honeypot: hidden from people, irresistible to bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" && state.message ? (
        <p role="alert" className="text-sm text-red-500">
          {state.message}
        </p>
      ) : null}

      <div className="pt-1">
        <SubmitButton />
      </div>
    </form>
  );
}
