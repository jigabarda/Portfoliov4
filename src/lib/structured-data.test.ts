import { describe, expect, it } from "vitest";
import { site } from "@/content/site";
import { jsonLdScript, siteJsonLd } from "./structured-data";

describe("siteJsonLd", () => {
  const graph = siteJsonLd()["@graph"];
  const person = graph.find((n) => n["@type"] === "Person")!;
  const website = graph.find((n) => n["@type"] === "WebSite")!;

  it("describes the person behind the site", () => {
    expect(person.name).toBe(site.name);
    expect(person.url).toBe(site.url);
    expect(person.email).toBe(`mailto:${site.email}`);
    expect(person.jobTitle).toBe("Software Engineer");
    expect(person.image).toBe(`${site.url}/images/profile2.jpg`);
  });

  it("links only public web profiles, never app deep links", () => {
    expect(person.sameAs).toContain("https://www.linkedin.com/in/james-ivan-gabarda/");
    expect(person.sameAs).toContain("https://github.com/jigabarda");
    for (const url of person.sameAs as string[]) expect(url).toMatch(/^https:\/\//);
    expect((person.sameAs as string[]).some((u) => u.includes("wa.me"))).toBe(false);
  });

  it("ties the website to the person", () => {
    expect(website.url).toBe(site.url);
    expect(website.publisher).toEqual({ "@id": person["@id"] });
  });
});

describe("jsonLdScript", () => {
  it("escapes '<' so the data cannot close the script tag", () => {
    expect(jsonLdScript({ text: "</script><b>" })).not.toContain("<");
  });
});
