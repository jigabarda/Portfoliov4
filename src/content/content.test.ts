import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { roleDuration } from "@/lib/duration";
import { experience } from "./experience";
import { featuredProjects, projects } from "./projects";
import { techTiles } from "./stack-icons";
import { testimonials } from "./testimonials";

describe("projects", () => {
  it("have unique ids and at least one link each", () => {
    expect(new Set(projects.map((p) => p.id)).size).toBe(projects.length);
    for (const p of projects) expect(p.live ?? p.repo, p.id).toBeTruthy();
  });

  it("featured projects carry everything the card and drawer render", () => {
    expect(featuredProjects.map((p) => p.id)).toEqual(["sellora", "safeship", "bms"]);
    for (const p of featuredProjects) {
      expect(p.category, p.id).toBeTruthy();
      expect(p.summary, p.id).toBeTruthy();
      expect(p.platforms, p.id).toBeTruthy();
      expect(p.image, p.id).toBeDefined();
      expect(p.stack.length, p.id).toBeGreaterThanOrEqual(4);
      expect(p.detail?.overview.length, p.id).toBeGreaterThanOrEqual(2);
      expect(p.detail?.features.length, p.id).toBeGreaterThanOrEqual(3);
    }
  });

  it("every image exists in /public", () => {
    for (const p of projects) {
      if (p.image) expect(existsSync(join(process.cwd(), "public", p.image.src)), p.image.src).toBe(true);
      else expect(p.thumbInitials, p.id).toBeTruthy();
    }
  });
});

describe("experience", () => {
  it("has valid date ranges that produce a duration", () => {
    for (const r of experience) expect(() => roleDuration(r.start, r.end, new Date(2026, 8, 1)), r.id).not.toThrow();
  });
});

describe("toolkit tiles", () => {
  it("has 12 tiles with paths and brand colours", () => {
    expect(techTiles).toHaveLength(12);
    for (const t of techTiles) {
      expect(t.path.length, t.name).toBeGreaterThan(20);
      expect(t.brand, t.name).toMatch(/^(#[0-9A-Fa-f]{6}|var\(--text\))$/);
    }
  });
});

describe("testimonials", () => {
  it("never ships the unconfirmed LGU draft", () => {
    expect(testimonials.find((t) => t.id === "lgu-draft")?.approved).toBe(false);
  });
});
