import { describe, expect, it } from "vitest";
import { createCooldown } from "./cooldown";

describe("createCooldown", () => {
  it("is free until started, then blocks the key for the window", () => {
    let t = 0;
    const c = createCooldown({ ms: 60_000, now: () => t });
    expect(c.remaining("a")).toBe(0);
    c.start("a");
    t = 15_000;
    expect(c.remaining("a")).toBe(45_000);
    expect(c.remaining("b")).toBe(0);
  });

  it("frees the key once the window has passed", () => {
    let t = 0;
    const c = createCooldown({ ms: 60_000, now: () => t });
    c.start("a");
    t = 60_000;
    expect(c.remaining("a")).toBe(0);
  });

  it("only starts when asked, so a failed send never locks anyone out", () => {
    const c = createCooldown({ ms: 60_000, now: () => 0 });
    c.remaining("a");
    c.remaining("a");
    expect(c.remaining("a")).toBe(0);
  });
});
