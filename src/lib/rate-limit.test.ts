import { describe, expect, it } from "vitest";
import { createRateLimiter } from "./rate-limit";

describe("createRateLimiter", () => {
  it("allows `limit` hits per window per key, then blocks", () => {
    const t = 0;
    const allow = createRateLimiter({ limit: 2, windowMs: 1000, now: () => t });
    expect(allow("a")).toBe(true);
    expect(allow("a")).toBe(true);
    expect(allow("a")).toBe(false);
    expect(allow("b")).toBe(true);
  });
  it("frees up again once the window has passed", () => {
    let t = 0;
    const allow = createRateLimiter({ limit: 1, windowMs: 1000, now: () => t });
    expect(allow("a")).toBe(true);
    t = 999;
    expect(allow("a")).toBe(false);
    t = 1001;
    expect(allow("a")).toBe(true);
  });
});
