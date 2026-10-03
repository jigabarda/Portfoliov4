import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ send: vi.fn(), ip: "10.0.0.1" }));

vi.mock("next/headers", () => ({
  headers: async () => new Headers({ "x-forwarded-for": mocks.ip }),
}));
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: mocks.send };
  },
}));

import { site } from "@/content/site";
import { sendInquiry, type InquiryState } from "./contact";

const idle: InquiryState = { status: "idle" };
let n = 0;
let e = 0;

// A fresh email per submission keeps the per-email cooldown out of tests that are not about it.
function form(overrides: Record<string, string> = {}): FormData {
  const fd = new FormData();
  const values = { name: "Jane Cruz", email: `jane${++e}@company.com`, project: "Sales dashboard", budget: "5-25k", message: "We need a dashboard for three stores.", ...overrides };
  for (const [k, v] of Object.entries(values)) fd.set(k, v);
  return fd;
}

beforeEach(() => {
  mocks.send.mockReset();
  mocks.send.mockResolvedValue({ data: { id: "email_1" }, error: null });
  mocks.ip = `10.0.0.${++n}`; // fresh IP per test so the rate limit does not leak between tests
  process.env.RESEND_API_KEY = "re_test";
  process.env.CONTACT_TO_EMAIL = "jamesivangabarda8@gmail.com";
  delete process.env.CONTACT_FROM_EMAIL;
});

describe("sendInquiry", () => {
  it("sends from CONTACT_FROM_EMAIL when it is set", async () => {
    process.env.CONTACT_FROM_EMAIL = "James Gabarda <hello@jamesgabarda.com>";
    await sendInquiry(idle, form());
    expect(mocks.send).toHaveBeenCalledWith(expect.objectContaining({ from: "James Gabarda <hello@jamesgabarda.com>" }));
  });

  it("sends the email with Reply-To set to the visitor", async () => {
    const state = await sendInquiry(idle, form({ email: "jane@company.com" }));
    expect(state.status).toBe("success");
    expect(mocks.send).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "Portfolio <onboarding@resend.dev>",
        to: "jamesivangabarda8@gmail.com",
        replyTo: "jane@company.com",
        subject: "New inquiry: Sales dashboard · $5k – $25k",
      }),
    );
  });

  it("returns field errors without sending", async () => {
    const state = await sendInquiry(idle, form({ email: "nope" }));
    expect(state.status).toBe("error");
    expect(state.fieldErrors?.email).toBeTruthy();
    expect(mocks.send).not.toHaveBeenCalled();
  });

  it("pretends to succeed for bots that fill the honeypot", async () => {
    const state = await sendInquiry(idle, form({ website: "http://spam.test" }));
    expect(state.status).toBe("success");
    expect(mocks.send).not.toHaveBeenCalled();
  });

  it("reports a friendly error when Resend is not configured", async () => {
    delete process.env.RESEND_API_KEY;
    const state = await sendInquiry(idle, form());
    expect(state.status).toBe("error");
    expect(state.message).toContain(`email me directly at ${site.email}`);
  });

  it("reports a friendly error when Resend fails or throws", async () => {
    mocks.send.mockResolvedValueOnce({ data: null, error: { name: "validation_error", message: "bad" } });
    expect((await sendInquiry(idle, form())).status).toBe("error");
    mocks.send.mockRejectedValueOnce(new Error("network down"));
    expect((await sendInquiry(idle, form())).status).toBe("error");
  });

  it("does not count rejected submissions against the rate limit", async () => {
    for (let i = 0; i < 5; i++) expect((await sendInquiry(idle, form({ email: "jane@company" }))).status).toBe("error");
    expect((await sendInquiry(idle, form())).status).toBe("success");
  });

  it("tells a rate-limited visitor how to reach me directly", async () => {
    for (let i = 0; i < 5; i++) await sendInquiry(idle, form());
    expect((await sendInquiry(idle, form())).message).toContain(site.email);
  });

  it("rate-limits repeated submissions from one connection", async () => {
    for (let i = 0; i < 5; i++) expect((await sendInquiry(idle, form())).status).toBe("success");
    const blocked = await sendInquiry(idle, form());
    expect(blocked.status).toBe("error");
    expect(blocked.message).toMatch(/too many/i);
  });

  it("lets one email address send only once per cooldown, whatever the IP or letter case", async () => {
    expect((await sendInquiry(idle, form({ email: "repeat@company.com" }))).status).toBe("success");
    mocks.ip = "10.9.9.9";
    const again = await sendInquiry(idle, form({ email: " Repeat@Company.com " }));
    expect(again.status).toBe("error");
    expect(again.message).toMatch(/already reached me/i);
    expect(again.message).toContain(site.email);
    expect(mocks.send).toHaveBeenCalledTimes(1);
  });

  it("does not start the email cooldown when sending fails", async () => {
    mocks.send.mockResolvedValueOnce({ data: null, error: { name: "validation_error", message: "bad" } });
    expect((await sendInquiry(idle, form({ email: "retry@company.com" }))).status).toBe("error");
    expect((await sendInquiry(idle, form({ email: "retry@company.com" }))).status).toBe("success");
  });

  describe("auto-reply", () => {
    const FROM = "James Gabarda <hello@jamesgabarda.com>";

    it("sends the visitor a confirmation after the inquiry goes out", async () => {
      process.env.CONTACT_FROM_EMAIL = FROM;
      const state = await sendInquiry(idle, form({ email: "client@company.com" }));
      expect(state.status).toBe("success");
      expect(mocks.send).toHaveBeenCalledTimes(2);
      expect(mocks.send).toHaveBeenLastCalledWith(
        expect.objectContaining({ from: FROM, to: "client@company.com", subject: "Thanks for reaching out, I got your message" }),
      );
    });

    it("is skipped on Resend's shared test sender, which can only mail the account owner", async () => {
      await sendInquiry(idle, form());
      expect(mocks.send).toHaveBeenCalledTimes(1);
    });

    it("is not sent when the inquiry itself fails", async () => {
      process.env.CONTACT_FROM_EMAIL = FROM;
      mocks.send.mockResolvedValueOnce({ data: null, error: { name: "validation_error", message: "bad" } });
      expect((await sendInquiry(idle, form())).status).toBe("error");
      expect(mocks.send).toHaveBeenCalledTimes(1);
    });

    it("never turns a delivered inquiry into an error", async () => {
      process.env.CONTACT_FROM_EMAIL = FROM;
      mocks.send
        .mockResolvedValueOnce({ data: { id: "email_1" }, error: null })
        .mockRejectedValueOnce(new Error("network down"));
      expect((await sendInquiry(idle, form())).status).toBe("success");
    });
  });
});
