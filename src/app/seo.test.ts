import { describe, expect, it } from "vitest";
import { site } from "@/content/site";
import robots from "./robots";
import sitemap from "./sitemap";

describe("robots.txt", () => {
  it("allows crawling and points to the sitemap on the canonical domain", () => {
    const r = robots();
    expect(r.rules).toEqual({ userAgent: "*", allow: "/", disallow: "/api/" });
    expect(r.sitemap).toBe(`${site.url}/sitemap.xml`);
    expect(r.host).toBe(site.url);
  });
});

describe("sitemap.xml", () => {
  it("lists the home page on the canonical domain", () => {
    const entries = sitemap();
    expect(entries.map((e) => e.url)).toEqual([site.url]);
  });
});
