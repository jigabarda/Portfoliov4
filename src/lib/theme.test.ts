import { describe, expect, it, vi } from "vitest";
import { BOOT_SCRIPT, THEME_KEY, isTheme, resolveTheme } from "./theme";

type Fake = {
  attrs: Record<string, string>;
  classes: Set<string>;
  run: () => void;
};

function fakeBrowser(opts: { saved?: string | null; storageThrows?: boolean; reduceMotion?: boolean; hasIO?: boolean }): Fake {
  const attrs: Record<string, string> = {};
  const classes = new Set<string>();
  const documentStub = {
    documentElement: {
      setAttribute: (k: string, v: string) => { attrs[k] = v; },
      classList: { add: (c: string) => classes.add(c), remove: (c: string) => classes.delete(c) },
    },
  };
  const localStorageStub = {
    getItem: (k: string) => {
      if (opts.storageThrows) throw new Error("SecurityError");
      return k === THEME_KEY ? opts.saved ?? null : null;
    },
  };
  const matchMediaStub = (q: string) => ({ matches: q.includes("reduce") ? !!opts.reduceMotion : false });
  const windowStub: Record<string, unknown> = {};
  if (opts.hasIO !== false) windowStub.IntersectionObserver = function () {};
  const setTimeoutStub = vi.fn(() => 1);
  const run = () =>
    new Function("document", "localStorage", "matchMedia", "window", "setTimeout", BOOT_SCRIPT)(
      documentStub, localStorageStub, matchMediaStub, windowStub, setTimeoutStub,
    );
  return { attrs, classes, run };
}

describe("resolveTheme", () => {
  it("uses a valid saved theme", () => {
    expect(resolveTheme("light")).toBe("light");
    expect(resolveTheme("dark")).toBe("dark");
  });
  it("defaults to dark when nothing valid is saved", () => {
    expect(resolveTheme(null)).toBe("dark");
    expect(resolveTheme("purple")).toBe("dark");
  });
});

describe("isTheme", () => {
  it("accepts only light and dark", () => {
    expect(isTheme("light")).toBe(true);
    expect(isTheme("dark")).toBe(true);
    expect(isTheme("system")).toBe(false);
    expect(isTheme(null)).toBe(false);
  });
});

describe("BOOT_SCRIPT", () => {
  it("applies a saved theme before paint", () => {
    const b = fakeBrowser({ saved: "dark" });
    b.run();
    expect(b.attrs["data-theme"]).toBe("dark");
  });
  it("ignores garbage in storage", () => {
    const b = fakeBrowser({ saved: "neon" });
    b.run();
    expect(b.attrs["data-theme"]).toBeUndefined();
  });
  it("survives storage that throws (private mode)", () => {
    const b = fakeBrowser({ storageThrows: true });
    expect(() => b.run()).not.toThrow();
    expect(b.attrs["data-theme"]).toBeUndefined();
  });
  it("enables reveal hiding only when motion is allowed and IntersectionObserver exists", () => {
    const ok = fakeBrowser({});
    ok.run();
    expect(ok.classes.has("reveal-on")).toBe(true);

    const reduced = fakeBrowser({ reduceMotion: true });
    reduced.run();
    expect(reduced.classes.has("reveal-on")).toBe(false);

    const noIO = fakeBrowser({ hasIO: false });
    noIO.run();
    expect(noIO.classes.has("reveal-on")).toBe(false);
  });
});
