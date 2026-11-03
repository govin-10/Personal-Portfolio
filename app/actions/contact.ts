"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";

const ContactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(80, "That name is too long."),
  email: z.string().trim().toLowerCase().email("Please enter a valid email address."),
  phone: z
    .string()
    .trim()
    .max(32, "That phone number is too long.")
    .optional()
    .or(z.literal("")),
  subject: z
    .string()
    .trim()
    .max(120, "That subject is too long.")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Please add a little more detail (at least 10 characters).")
    .max(4000, "That message is too long. Please trim it a bit."),
  /** Honeypot: must stay empty. Bots fill every field they find. */
  website: z.string().max(0).optional().or(z.literal("")),
});

import type { ContactState } from "@/lib/contact-state";

/**
 * Best-effort in-memory rate limit. On serverless this is per-instance, so
 * treat it as friction for casual abuse rather than a real guarantee. The
 * honeypot and Resend's own limits do the heavier lifting.
 */
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 3;
const recentSubmissions = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const hits = (recentSubmissions.get(key) ?? []).filter(
    (time) => now - time < RATE_LIMIT_WINDOW_MS,
  );
  hits.push(now);
  recentSubmissions.set(key, hits);

  // Keep the map from growing without bound on long-lived instances.
  if (recentSubmissions.size > 500) {
    for (const [mapKey, times] of recentSubmissions) {
      if (times.every((time) => now - time > RATE_LIMIT_WINDOW_MS)) {
        recentSubmissions.delete(mapKey);
      }
    }
  }

  return hits.length > RATE_LIMIT_MAX;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function submitContactForm(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    subject: String(formData.get("subject") ?? ""),
    message: String(formData.get("message") ?? ""),
    website: String(formData.get("website") ?? ""),
  };

  // Keep everything except the honeypot for repopulating the form.
  const echo: Record<string, string> = {
    name: raw.name,
    email: raw.email,
    phone: raw.phone,
    subject: raw.subject,
    message: raw.message,
  };

  const parsed = ContactSchema.safeParse(raw);

  if (!parsed.success) {
    const errors: ContactState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof z.infer<typeof ContactSchema>;
      errors[field] ??= issue.message;
    }

    // A filled honeypot is a bot: accept silently rather than teaching it.
    if (errors.website) {
      return { status: "success", message: "Thanks, your message is on its way." };
    }

    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      errors,
      values: echo,
    };
  }

  const data = parsed.data;

  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerList.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return {
      status: "error",
      message: "That's a few messages in quick succession. Try again in a minute.",
      values: echo,
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  // Fail loudly rather than pretending a message was sent into the void.
  if (!apiKey || !to || !from) {
    console.error(
      "[contact] Missing RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL",
    );
    return {
      status: "error",
      message:
        "The contact form isn't configured yet. Please email me directly in the meantime.",
      values: echo,
    };
  }

  const subject = data.subject?.trim()
    ? `Portfolio: ${data.subject.trim()}`
    : `Portfolio enquiry from ${data.name}`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: data.email,
      subject,
      text: [
        `Name:    ${data.name}`,
        `Email:   ${data.email}`,
        data.phone ? `Phone:   ${data.phone}` : null,
        data.subject ? `Subject: ${data.subject}` : null,
        "",
        data.message,
      ]
        .filter((line) => line !== null)
        .join("\n"),
      html: `
        <div style="font-family:ui-sans-serif,system-ui,sans-serif;line-height:1.6">
          <h2 style="margin:0 0 16px">New portfolio enquiry</h2>
          <p style="margin:0 0 4px"><strong>Name:</strong> ${escapeHtml(data.name)}</p>
          <p style="margin:0 0 4px"><strong>Email:</strong> ${escapeHtml(data.email)}</p>
          ${data.phone ? `<p style="margin:0 0 4px"><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>` : ""}
          ${data.subject ? `<p style="margin:0 0 4px"><strong>Subject:</strong> ${escapeHtml(data.subject)}</p>` : ""}
          <hr style="margin:16px 0;border:none;border-top:1px solid #e5e5e5" />
          <p style="white-space:pre-wrap;margin:0">${escapeHtml(data.message)}</p>
        </div>
      `,
    });

    if (error) {
      console.error("[contact] Resend rejected the message", error);
      return {
        status: "error",
        message: "Something went wrong sending that. Please try again, or email me directly.",
        values: echo,
      };
    }

    return {
      status: "success",
      message: "Thanks, your message is on its way. I'll reply soon.",
    };
  } catch (error) {
    console.error("[contact] Unexpected failure", error);
    return {
      status: "error",
      message: "Something went wrong sending that. Please try again, or email me directly.",
      values: echo,
    };
  }
}
