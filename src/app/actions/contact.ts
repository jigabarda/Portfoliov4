"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";
import { formDataToObject, formatAutoReply, formatInquiryEmail, inquirySchema } from "@/lib/inquiry";
import { createCooldown } from "@/lib/cooldown";
import { createRateLimiter } from "@/lib/rate-limit";
import { site } from "@/content/site";

export type InquiryField = "name" | "email" | "company" | "timeline" | "project" | "budget" | "message";

export type InquiryState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<InquiryField, string>>;
};

// Resend's shared test sender; set CONTACT_FROM_EMAIL once your own domain is verified in Resend.
const DEFAULT_FROM = "Portfolio <onboarding@resend.dev>";
const SUCCESS = "Thanks, your message is on its way. I'll reply within a day.";
const NOT_CONFIGURED = `The form isn't available right now. Please email me directly at ${site.email}.`;
const SEND_FAILED = `Your message couldn't be sent. Please try again, or email me directly at ${site.email}.`;
const TOO_MANY = `Too many messages from your connection. Please try again in a few minutes, or email me directly at ${site.email}.`;

const EMAIL_COOLDOWN_MINUTES = 10;

const allow = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });
// One inquiry per email address per cooldown, so the form cannot be used to flood one inbox.
const emailCooldown = createCooldown({ ms: EMAIL_COOLDOWN_MINUTES * 60 * 1000 });

function sameEmailWait(minutes: number): string {
  return `Your earlier message from this email already reached me. Please wait ${minutes} minute${minutes === 1 ? "" : "s"} before sending another, or email me directly at ${site.email}.`;
}

export async function sendInquiry(_prev: InquiryState, formData: FormData): Promise<InquiryState> {
  const raw = formDataToObject(formData);

  // Honeypot: humans never see this field. Pretend it worked so bots do not retry.
  if (raw.website) return { status: "success", message: SUCCESS };

  const parsed = inquirySchema.safeParse(raw);
  if (!parsed.success) {
    const errors = z.flattenError(parsed.error).fieldErrors as Partial<Record<InquiryField, string[]>>;
    const fieldErrors: Partial<Record<InquiryField, string>> = {};
    for (const [field, messages] of Object.entries(errors)) {
      if (messages?.[0]) fieldErrors[field as InquiryField] = messages[0];
    }
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors };
  }

  // Count only submissions that would really send, so a visitor fixing typos is never locked out.
  const ip = ((await headers()).get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (!allow(ip)) return { status: "error", message: TOO_MANY };

  const emailKey = parsed.data.email.toLowerCase();
  const wait = emailCooldown.remaining(emailKey);
  if (wait > 0) return { status: "error", message: sameEmailWait(Math.ceil(wait / 60_000)) };

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    console.error("Contact form: RESEND_API_KEY or CONTACT_TO_EMAIL is not set.");
    return { status: "error", message: NOT_CONFIGURED };
  }

  const resend = new Resend(apiKey);
  const customFrom = process.env.CONTACT_FROM_EMAIL;

  try {
    const { error } = await resend.emails.send({
      from: customFrom || DEFAULT_FROM,
      to,
      replyTo: parsed.data.email,
      ...formatInquiryEmail(parsed.data),
    });
    if (error) {
      console.error("Contact form: Resend returned an error", error);
      return { status: "error", message: SEND_FAILED };
    }
  } catch (err) {
    console.error("Contact form: Resend request failed", err);
    return { status: "error", message: SEND_FAILED };
  }

  // Start the cooldown only once the inquiry really went out, so a failed send can be retried.
  emailCooldown.start(emailKey);

  // Confirmation to the visitor. Only from the verified domain: Resend's shared test sender
  // can mail nobody but the account owner. The inquiry already arrived, so a failure here is
  // logged and never shown to the visitor.
  if (customFrom) {
    try {
      const { error } = await resend.emails.send({ from: customFrom, to: parsed.data.email, ...formatAutoReply(parsed.data.name) });
      if (error) console.error("Contact form: auto-reply returned an error", error);
    } catch (err) {
      console.error("Contact form: auto-reply request failed", err);
    }
  }

  return { status: "success", message: SUCCESS };
}
