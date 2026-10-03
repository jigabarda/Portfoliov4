import { describe, expect, it } from "vitest";
import { escapeHtml, formatAutoReply, formatInquiryEmail, formDataToObject, inquirySchema } from "./inquiry";

const valid = {
  name: "Jane Cruz",
  email: "jane@company.com",
  company: "",
  timeline: "Next month",
  project: "Sales dashboard",
  budget: "5-25k",
  message: "We need a dashboard for three stores.",
};

describe("inquirySchema", () => {
  it("accepts a complete inquiry and trims fields", () => {
    const r = inquirySchema.safeParse({ ...valid, name: "  Jane Cruz  " });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.name).toBe("Jane Cruz");
  });
  it("rejects a bad email and a too-short message", () => {
    const r = inquirySchema.safeParse({ ...valid, email: "not-an-email", message: "hi" });
    expect(r.success).toBe(false);
  });
  it("falls back to 'unsure' for an unknown budget", () => {
    const r = inquirySchema.safeParse({ ...valid, budget: "a million" });
    expect(r.success && r.data.budget).toBe("unsure");
  });
});

describe("formatInquiryEmail", () => {
  it("builds a one-line subject with the budget label", () => {
    const r = inquirySchema.parse(valid);
    expect(formatInquiryEmail(r).subject).toBe("New inquiry: Sales dashboard · $5k – $25k");
  });
  it("strips line breaks from the subject (header injection)", () => {
    const r = inquirySchema.parse({ ...valid, project: "Sales\r\nBcc: attacker@evil.test" });
    expect(formatInquiryEmail(r).subject).not.toMatch(/[\r\n]/);
  });
  it("escapes HTML in the body", () => {
    const r = inquirySchema.parse({ ...valid, message: "<script>alert(1)</script> please" });
    const { html, text } = formatInquiryEmail(r);
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
    expect(text).toContain("<script>alert(1)</script> please");
  });
});

describe("helpers", () => {
  it("escapeHtml escapes the five special characters", () => {
    expect(escapeHtml(`<a href="x">'&'</a>`)).toBe("&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;");
  });
  it("formDataToObject keeps string values only", () => {
    const fd = new FormData();
    fd.set("name", "Jane");
    fd.set("file", new Blob(["x"]));
    expect(formDataToObject(fd)).toEqual({ name: "Jane" });
  });
});

describe("formatAutoReply", () => {
  it("greets by first name only and promises a reply", () => {
    const r = formatAutoReply("Jane Cruz");
    expect(r.subject).toBe("Thanks for reaching out, I got your message");
    expect(r.text).toMatch(/^Hi Jane,/);
    expect(r.text).not.toContain("Cruz");
    expect(r.text).toContain("within one business day");
    expect(r.html).toContain("jamesgabarda.com");
  });

  it("never echoes anything else the visitor typed", () => {
    const r = formatAutoReply("Buy cheap pills at spam.example now");
    expect(r.text).toMatch(/^Hi Buy,/);
    expect(r.text).not.toContain("spam.example");
  });

  it("keeps only name characters and caps the length", () => {
    expect(formatAutoReply("<b>Ann</b>").text).toMatch(/^Hi bAnnb,/);
    expect(formatAutoReply("X".repeat(200)).text.split(",")[0].length).toBeLessThanOrEqual(3 + 30);
  });

  it("falls back to a neutral greeting when no usable name is left", () => {
    expect(formatAutoReply("<<>>").text).toMatch(/^Hi there,/);
  });
});
