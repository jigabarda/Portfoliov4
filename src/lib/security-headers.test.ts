import { describe, expect, it } from "vitest";
import { securityHeaders } from "./security-headers";

const get = (key: string) => securityHeaders.find((h) => h.key === key)?.value;

describe("securityHeaders", () => {
  it("blocks other sites from framing the page (clickjacking)", () => {
    expect(get("X-Frame-Options")).toBe("DENY");
    expect(get("Content-Security-Policy")).toBe("frame-ancestors 'none'");
  });

  it("stops MIME sniffing and limits referrer leaks", () => {
    expect(get("X-Content-Type-Options")).toBe("nosniff");
    expect(get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
  });

  it("turns off browser features the site never uses", () => {
    expect(get("Permissions-Policy")).toBe("camera=(), microphone=(), geolocation=(), browsing-topics=()");
  });
});
