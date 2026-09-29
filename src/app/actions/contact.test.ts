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

import { sendInquiry, type InquiryState } from "./contact";

const idle: InquiryState = { status: "idle" };
let n = 0;

function form(overrides: Record<string, string> = {}): FormData {
  const fd = new FormData();
  const values = { name: "Jane Cruz", email: "jane@company.com", project: "Sales dashboard", budget: "5-25k", message: "We need a dashboard for three stores.", ...overrides };
  for (const [k, v] of Object.entries(values)) fd.set(k, v);
  return fd;
}

beforeEach(() => {
  mocks.send.mockReset();
  mocks.send.mockResolvedValue({ data: { id: "email_1" }, error: null });
  mocks.ip = `10.0.0.${++n}`; // fresh IP per test so the rate limit does not leak between tests
  process.env.RESEND_API_KEY = "re_test";
  process.env.CONTACT_TO_EMAIL = "jamesivangabarda8@gmail.com";
});

describe("sendInquiry", () => {
  it("sends the email with Reply-To set to the visitor", async () => {
    const state = await sendInquiry(idle, form());
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
    expect(state.message).toMatch(/email me directly/i);
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
    expect((await sendInquiry(idle, form())).message).toMatch(/jamesivangabarda8@gmail\.com/);
  });

  it("rate-limits repeated submissions from one connection", async () => {
    for (let i = 0; i < 5; i++) expect((await sendInquiry(idle, form())).status).toBe("success");
    const blocked = await sendInquiry(idle, form());
    expect(blocked.status).toBe("error");
    expect(blocked.message).toMatch(/too many/i);
  });
});
