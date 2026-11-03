/**
 * Shared state shape for the contact form.
 *
 * This lives OUTSIDE app/actions/contact.ts on purpose: a `"use server"` file
 * may only export async functions, so exporting the `initialContactState`
 * object from there crashes the action at module evaluation with
 * "A 'use server' file can only export async functions, found object."
 */
export interface ContactState {
  status: "idle" | "success" | "error";
  message?: string;
  /**
   * Field-level errors, keyed by input name. `website` is the honeypot: it
   * never surfaces in the UI, but the action keys an error onto it when a bot
   * fills it in, so it has to exist in the type.
   */
  errors?: Partial<
    Record<
      "name" | "email" | "phone" | "subject" | "message" | "website",
      string
    >
  >;
  /** Echoed back so the form can repopulate after a failed submit. */
  values?: Record<string, string>;
}

export const initialContactState: ContactState = { status: "idle" };
