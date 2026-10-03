"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";
import { formDataToObject, formatInquiryEmail, inquirySchema } from "@/lib/inquiry";
import { createRateLimiter } from "@/lib/rate-limit";

export type InquiryField = "name" | "email" | "company" | "timeline" | "project" | "budget" | "message";

export type InquiryState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<InquiryField, string>>;
};

// Resend's shared test sender; set CONTACT_FROM_EMAIL once your own domain is verified in Resend.
const DEFAULT_FROM = "Portfolio <onboarding@resend.dev>";
const SUCCESS = "Thanks, your message is on its way. I'll reply within a day.";
const NOT_CONFIGURED = "The form isn't available right now. Please email me directly at jamesivangabarda8@gmail.com.";
const SEND_FAILED = "Your message couldn't be sent. Please try again, or email me directly at jamesivangabarda8@gmail.com.";
const TOO_MANY = "Too many messages from your connection. Please try again in a few minutes, or email me directly at jamesivangabarda8@gmail.com.";

const allow = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

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

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    console.error("Contact form: RESEND_API_KEY or CONTACT_TO_EMAIL is not set.");
    return { status: "error", message: NOT_CONFIGURED };
  }

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM,
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

  return { status: "success", message: SUCCESS };
}
