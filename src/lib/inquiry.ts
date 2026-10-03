import { z } from "zod";
import { BUDGETS, budgetLabel } from "./budgets";

const budgetValues = BUDGETS.map((b) => b.value) as [string, ...string[]];

export const inquirySchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(120, "That name is too long."),
  email: z.string().trim().max(200).email("Please enter a valid email address."),
  company: z.string().trim().max(160).optional().default(""),
  timeline: z.string().trim().max(160).optional().default(""),
  project: z.string().trim().min(1, "Tell me what kind of project it is.").max(200, "Keep the project type short."),
  budget: z.enum(budgetValues).catch("unsure"),
  message: z.string().trim().min(10, "Add a few details about the project (at least 10 characters).").max(5000, "That message is too long."),
});

export type Inquiry = z.infer<typeof inquirySchema>;

export function formDataToObject(fd: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  fd.forEach((value, key) => {
    if (typeof value === "string") out[key] = value;
  });
  return out;
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

export function formatInquiryEmail(i: Inquiry): { subject: string; text: string; html: string } {
  const budget = budgetLabel(i.budget);
  const rows: Array<[string, string]> = [
    ["Name", i.name],
    ["Email", i.email],
    ["Company", i.company || "—"],
    ["Project type", i.project],
    ["Budget", budget],
    ["Ideal timeline", i.timeline || "—"],
  ];
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${i.message}\n`;
  const html = `<table cellpadding="4">${rows
    .map(([k, v]) => `<tr><td><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(v)}</td></tr>`)
    .join("")}</table><p style="white-space:pre-wrap">${escapeHtml(i.message)}</p>`;
  return { subject: oneLine(`New inquiry: ${i.project} · ${budget}`), text, html };
}

/** First word of the name, letters only (plus ' and -), at most 30 characters; "there" if nothing is left. */
function greetingName(name: string): string {
  const first = name.trim().split(/\s+/)[0] ?? "";
  const clean = first.replace(/[^\p{L}\p{M}'-]/gu, "").slice(0, 30);
  return clean || "there";
}

/**
 * Confirmation sent to the visitor. It deliberately contains nothing they typed except a
 * cleaned first name, so the form cannot be used to send arbitrary text to someone else.
 */
export function formatAutoReply(name: string): { subject: string; text: string; html: string } {
  const who = greetingName(name);
  const lines = [
    `Hi ${who},`,
    "Thanks for getting in touch about your project. I've received your message and will reply within one business day.",
    "In the meantime, you can look through my recent work at https://www.jamesgabarda.com.",
  ];
  const signature = "James Gabarda\nSoftware Engineer · jamesgabarda.com";
  const text = `${lines.join("\n\n")}\n\n${signature}\n`;
  const html =
    `<p>Hi ${escapeHtml(who)},</p>` +
    `<p>${escapeHtml(lines[1])}</p>` +
    `<p>In the meantime, you can look through my recent work at <a href="https://www.jamesgabarda.com">jamesgabarda.com</a>.</p>` +
    `<p>James Gabarda<br>Software Engineer · <a href="https://www.jamesgabarda.com">jamesgabarda.com</a></p>`;
  return { subject: "Thanks for reaching out, I got your message", text, html };
}
