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

const SITE = "https://www.jamesgabarda.com";
const LINKEDIN = "https://www.linkedin.com/in/james-ivan-gabarda/";
const GITHUB = "https://github.com/jigabarda";

/**
 * Confirmation sent to the visitor. It deliberately contains nothing they typed except a
 * cleaned first name, so the form cannot be used to send arbitrary text to someone else.
 * Table layout with inline styles, which is what email clients render reliably.
 */
export function formatAutoReply(name: string): { subject: string; text: string; html: string } {
  const who = greetingName(name);
  const promise = "Thanks for getting in touch about your project. I've received your message and will reply within one business day.";
  const meanwhile = "In the meantime, feel free to look through my recent projects.";
  const footnote = "You're receiving this because you sent a message through my portfolio's contact form. Just reply to this email if you have anything to add.";

  const text = [
    `Hi ${who},`,
    promise,
    `${meanwhile}\n${SITE}`,
    "James Gabarda\nSoftware Engineer · Bicol, Philippines",
    `LinkedIn: ${LINKEDIN}\nGitHub: ${GITHUB}`,
    footnote,
  ].join("\n\n") + "\n";

  const font = "font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
  const html = `<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light"></head><body style="margin:0;padding:0;background:#F1EFEE">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#F1EFEE"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border-radius:12px;overflow:hidden">
<tr><td bgcolor="#0B0A0A" style="padding:22px 32px">
<span style="font-family:Impact,'Arial Narrow Bold','Arial Black',sans-serif;font-size:24px;letter-spacing:1px;color:#D8393B">JIGSTACK</span>
</td></tr>
<tr><td style="padding:32px 32px 8px;${font};font-size:16px;line-height:1.6;color:#1A1717">
<p style="margin:0 0 16px">Hi ${escapeHtml(who)},</p>
<p style="margin:0 0 16px">${escapeHtml(promise)}</p>
<p style="margin:0 0 24px">${escapeHtml(meanwhile)}</p>
<table role="presentation" cellpadding="0" cellspacing="0"><tr><td bgcolor="#D8393B" style="border-radius:999px">
<a href="${SITE}" style="display:inline-block;padding:12px 24px;${font};font-size:15px;font-weight:600;color:#FFFFFF;text-decoration:none">See my recent work &rarr;</a>
</td></tr></table>
</td></tr>
<tr><td style="padding:24px 32px 32px;${font};font-size:16px;line-height:1.5;color:#1A1717">
<strong>James Gabarda</strong><br><span style="color:#6B6464;font-size:14px">Software Engineer &middot; Bicol, Philippines</span>
</td></tr>
<tr><td bgcolor="#F7F5F4" style="padding:20px 32px;border-top:1px solid #E6E1E0;${font};font-size:12px;line-height:1.6;color:#8A8383">
<a href="${LINKEDIN}" style="color:#1A1717;font-weight:600;text-decoration:none">LinkedIn</a>&nbsp;&nbsp;&middot;&nbsp;&nbsp;<a href="${GITHUB}" style="color:#1A1717;font-weight:600;text-decoration:none">GitHub</a><br>
${escapeHtml(footnote)}
</td></tr>
</table>
</td></tr></table>
</body></html>`;

  return { subject: "Thanks for reaching out, I got your message", text, html };
}
