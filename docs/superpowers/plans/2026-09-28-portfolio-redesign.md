# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the old multi-route portfolio with the approved single-page redesign (monochrome + crimson, light/dark, restrained motion) and a contact form that emails inquiries through Resend.

**Architecture:** Server components render the page from typed content files; the mockup's CSS is extracted into per-section stylesheets so markup reuses the mockup's class names; the handful of interactive behaviours (theme, nav, reveals, drawer, canvases, form) are small client components ported from the mockup's script. The contact form is a Server Action with zod validation, a honeypot, and an in-memory rate limit.

**Tech Stack:** Next.js 15.4 (App Router), React 19, TypeScript, Tailwind CSS v4 (reset only), next/font (Anton, Geist, Geist Mono), Resend, zod v4, Vitest.

**Spec:** `docs/superpowers/specs/2026-09-28-portfolio-redesign-design.md` · **Visual source of truth:** `mockups/jigstack-redesign.html`

## Global Constraints

- Branch `feat/portfolio-redesign`; never commit to `main`; no git worktrees.
- Commits as `James Ivan Gabarda <jamesivangabarda8@gmail.com>` (already configured). **No `Co-Authored-By`, no "Generated with Claude Code", no emoji in the PR.**
- Push once at the end (Task 10). Every push to a PR triggers a Vercel preview, so do not push per task.
- Visual parity with the mockup wins over any detail in this plan; behaviour and architecture follow the spec.
- Colours only through CSS tokens (`var(--…)`); no hex values in components except brand colours in `stack-icons.ts`.
- Site title: `James Gabarda — AI & Software Engineer`. Nav CTA: `Hire me` (confirmed). Contact email: `jamesivangabarda8@gmail.com`.
- Draft testimonial ships with `approved: false` and must not render.
- Env vars: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`. Sender: `Portfolio <onboarding@resend.dev>`.
- Every effect respects `prefers-reduced-motion`; server HTML stays readable without JavaScript.

## Review Focus

1. **Contact fields containing line breaks or HTML** (e.g. a project type of `Sales\nBcc: x@y.z` or a message with `<script>`): the email subject must stay one line and the HTML body must be escaped. Pinned in Task 9 (`inquiry.test.ts`).
2. **Resend misconfigured or failing** (missing `RESEND_API_KEY`, API error, thrown exception): the visitor sees a friendly error and the page never crashes. Pinned in Task 9 (`contact.test.ts`).
3. **Storage blocked** (Safari private mode, blocked cookies): reading or writing the saved theme throws; the boot script and toggle must fall back to the system theme silently. Pinned in Task 1 (`theme.test.ts`).
4. **Reduced motion or no IntersectionObserver**: content must never stay hidden; the boot script must not enable reveal hiding. Pinned in Task 1 (`theme.test.ts`).
5. **Bad dates in content** (malformed `YYYY-MM`, end before start): durations must fail loudly at build/test time instead of rendering `-3 mos`. Pinned in Task 2 (`duration.test.ts`, `content.test.ts`).

---

### Task 1: Foundation — dependencies, cleanup, styles, fonts, theme boot

**Files:**
- Modify: `package.json`, `tsconfig.json`, `next.config.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `mockups/jigstack-redesign.html` (image path)
- Create: `vitest.config.ts`, `scripts/extract-mockup-css.mjs`, `scripts/extract-mockup-icons.mjs`, `src/styles/*.css` (16 generated), `src/content/stack-icons.ts` (generated), `src/lib/theme.ts`, `src/lib/theme.test.ts`
- Delete: `src/app/components/`, `src/app/home/`, `src/app/projects/`, `src/app/services/`, `src/app/stacks/`, `src/app/favicon.ico`
- Rename: `public/images/Sellora Mobile.png` → `public/images/sellora-mobile.png`

**Interfaces:**
- Produces: `src/lib/theme.ts` → `type Theme = "light" | "dark"`, `THEME_KEY: "jigstack-theme"`, `isTheme(v: unknown): v is Theme`, `resolveTheme(saved: string | null, prefersDark: boolean): Theme`, `BOOT_SCRIPT: string`, `currentTheme(): Theme`, `applyTheme(next: Theme, origin?: HTMLElement): void`
- Produces: `src/content/stack-icons.ts` → `type TechTile = { name: string; brand: string; path: string }`, `techTiles: TechTile[]` (12 items)
- Produces: global CSS classes identical to the mockup's (`.wrap`, `.sec`, `.btn`, `.feature`, …)

- [ ] **Step 1: Swap dependencies and add the test script**

```bash
npm uninstall three framer-motion react-icons lucide-react @fontsource/anton @fontsource/secular-one clsx tailwind-merge class-variance-authority tw-animate-css
npm install resend zod
npm install -D vitest
npm pkg set scripts.test="vitest run"
```

- [ ] **Step 2: Replace `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "incremental": true,
    "module": "esnext",
    "esModuleInterop": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", ".next/types/**/*.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules", "mockups"]
}
```

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
```

- [ ] **Step 4: Remove the old routes and components, and rename the image**

```bash
git rm -r -q src/app/components src/app/home src/app/projects src/app/services src/app/stacks src/app/favicon.ico
mv "public/images/Sellora Mobile.png" public/images/sellora-mobile.png
sed -i 's#Sellora%20Mobile\.png#sellora-mobile.png#g' mockups/jigstack-redesign.html
grep -c "sellora-mobile.png" mockups/jigstack-redesign.html   # expect 3
```

- [ ] **Step 5: Replace `next.config.ts`** (no remote images remain)

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
```

- [ ] **Step 6: Create `scripts/extract-mockup-css.mjs`**

```js
// One-time extraction of the approved mockup's CSS into per-section stylesheets.
// After this runs, edit src/styles/*.css directly; the mockup stays the visual reference.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const html = readFileSync("mockups/jigstack-redesign.html", "utf8");
const css = html.slice(html.indexOf("<style>") + "<style>".length, html.indexOf("</style>"));

// Mockup banner title (prefix) -> output file name. Order matches the mockup.
const FILES = [
  ["TOKENS", "tokens"], ["BASE", "base"], ["BUTTONS & LINKS", "controls"], ["NAV", "nav"],
  ["HERO", "hero"], ["EXPERIENCE STRIP", "strip"], ["SECTIONS", "sections"], ["WORK", "projects"],
  ["SERVICES BAND", "band"], ["SERVICES", "services"], ["PROCESS", "process"], ["ABOUT", "about"],
  ["STACK", "toolkit"], ["QUOTE", "testimonial"], ["CONTACT", "contact"], ["FOOTER", "footer"],
];

const banner = /\n {2}\/\* =+\n\s+([^\n]+?)\n\s+=+ \*\/\n/g;
const marks = [];
for (let m; (m = banner.exec(css)); ) marks.push({ title: m[1].trim(), start: m.index, body: banner.lastIndex });
if (marks.length !== FILES.length) throw new Error(`expected ${FILES.length} sections, found ${marks.length}`);

const fileFor = (title) => {
  const hit = FILES.find(([prefix]) => title === prefix || title.startsWith(prefix + ":") || title.startsWith(prefix + " ("));
  if (!hit) throw new Error(`no file mapping for section "${title}"`);
  return hit[1];
};

mkdirSync("src/styles", { recursive: true });
marks.forEach((mark, i) => {
  const end = i + 1 < marks.length ? marks[i + 1].start : css.length;
  let body = css.slice(mark.body, end).replace(/^ {2}/gm, "").trim() + "\n";
  const name = fileFor(mark.title);
  if (name === "tokens") {
    const swaps = [
      ['--font-display: "Anton", Impact', "--font-display: var(--font-anton), Impact"],
      ['--font-body: "Geist", ui-sans-serif', "--font-body: var(--font-geist), ui-sans-serif"],
      ['--font-mono: "Geist Mono", ui-monospace', "--font-mono: var(--font-geist-mono), ui-monospace"],
    ];
    for (const [from, to] of swaps) {
      if (!body.includes(from)) throw new Error(`font token not found: ${from}`);
      body = body.replace(from, to);
    }
  }
  writeFileSync(`src/styles/${name}.css`, `/* ${mark.title} — extracted from mockups/jigstack-redesign.html */\n\n${body}`);
  console.log(`src/styles/${name}.css`);
});
```

- [ ] **Step 7: Create `scripts/extract-mockup-icons.mjs`**

```js
// One-time extraction of the 12 toolkit logo tiles (Simple Icons paths, CC0) from the mockup.
import { readFileSync, writeFileSync } from "node:fs";

const html = readFileSync("mockups/jigstack-redesign.html", "utf8");
const re = /<li class="tile" style="--brand: ([^"]+)">\s*<canvas[^>]*><\/canvas>\s*<svg class="tile-logo"[^>]*><path d="([^"]+)"\/><\/svg>\s*<span class="tile-name">([^<]+)<\/span>/g;
const tiles = [...html.matchAll(re)].map(([, brand, path, name]) => ({ name, brand, path }));
if (tiles.length !== 12) throw new Error(`expected 12 tiles, found ${tiles.length}`);

const out = `// Generated from mockups/jigstack-redesign.html by scripts/extract-mockup-icons.mjs.
// Logo paths are from Simple Icons (CC0). A brand of "var(--text)" follows the theme.
export type TechTile = { name: string; brand: string; path: string };

export const techTiles: TechTile[] = ${JSON.stringify(tiles, null, 2)};
`;
writeFileSync("src/content/stack-icons.ts", out);
console.log(`wrote ${tiles.length} tiles`);
```

- [ ] **Step 8: Run both extractions**

```bash
mkdir -p src/content
node scripts/extract-mockup-css.mjs
node scripts/extract-mockup-icons.mjs
ls src/styles | wc -l   # expect 16
```

- [ ] **Step 9: Replace `src/app/globals.css`**

```css
@import "tailwindcss";

/* Ported from the approved mockup. Unlayered, so these rules sit above Tailwind's reset. */
@import "../styles/tokens.css";
@import "../styles/base.css";
@import "../styles/controls.css";
@import "../styles/nav.css";
@import "../styles/hero.css";
@import "../styles/strip.css";
@import "../styles/sections.css";
@import "../styles/projects.css";
@import "../styles/services.css";
@import "../styles/process.css";
@import "../styles/about.css";
@import "../styles/toolkit.css";
@import "../styles/band.css";
@import "../styles/testimonial.css";
@import "../styles/contact.css";
@import "../styles/footer.css";
```

- [ ] **Step 10: Write the failing theme tests** — `src/lib/theme.test.ts`

```ts
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
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });
  it("falls back to the system preference", () => {
    expect(resolveTheme(null, true)).toBe("dark");
    expect(resolveTheme("purple", false)).toBe("light");
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
```

- [ ] **Step 11: Run the tests to verify they fail**

Run: `npm test -- src/lib/theme.test.ts`
Expected: FAIL — `Failed to resolve import "./theme"`.

- [ ] **Step 12: Implement `src/lib/theme.ts`**

```ts
export type Theme = "light" | "dark";

export const THEME_KEY = "jigstack-theme";

export function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

export function resolveTheme(saved: string | null, prefersDark: boolean): Theme {
  if (isTheme(saved)) return saved;
  return prefersDark ? "dark" : "light";
}

/**
 * Runs in <head> before first paint:
 * 1. applies a saved theme (no saved value = follow the OS via CSS),
 * 2. enables scroll-reveal hiding only when motion is allowed, with a 4s failsafe.
 * Kept as a plain string so it can be inlined and unit-tested.
 */
export const BOOT_SCRIPT = `(function(){var d=document.documentElement;try{var t=localStorage.getItem("${THEME_KEY}");if(t==="light"||t==="dark")d.setAttribute("data-theme",t);}catch(e){}if(!matchMedia("(prefers-reduced-motion: reduce)").matches&&"IntersectionObserver" in window){d.classList.add("reveal-on");window.__revealFailsafe=setTimeout(function(){d.classList.remove("reveal-on");},4000);}})();`;

export function currentTheme(): Theme {
  const attr = document.documentElement.getAttribute("data-theme");
  return resolveTheme(attr, matchMedia("(prefers-color-scheme: dark)").matches);
}

type ViewTransitionDoc = Document & {
  startViewTransition?: (update: () => void) => { ready: Promise<void> };
};

/** Switch theme, persist it, and reveal it with a circle growing from `origin` when supported. */
export function applyTheme(next: Theme, origin?: HTMLElement): void {
  const root = document.documentElement;
  const commit = () => {
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Storage blocked: the choice still applies for this visit.
    }
  };

  const doc = document as ViewTransitionDoc;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!doc.startViewTransition || reduce || !origin) {
    commit();
    return;
  }

  const rect = origin.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

  doc.startViewTransition(commit).ready.then(() => {
    root.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      { duration: 650, easing: "cubic-bezier(0.16, 1, 0.3, 1)", pseudoElement: "::view-transition-new(root)" },
    );
  });
}
```

- [ ] **Step 13: Run the tests to verify they pass**

Run: `npm test -- src/lib/theme.test.ts`
Expected: PASS (7 tests).

- [ ] **Step 14: Replace `src/app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Anton, Geist, Geist_Mono } from "next/font/google";
import { BOOT_SCRIPT } from "@/lib/theme";
import "./globals.css";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton", display: "swap" });
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "James Gabarda — AI & Software Engineer",
  description:
    "James Ivan Gabarda builds custom software, web and mobile apps, and AI features for businesses. Based in Bicol, Philippines.",
  icons: { icon: "/logo.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${anton.variable} ${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 15: Replace `src/app/page.tsx` with a temporary shell**

```tsx
export default function Page() {
  return <main />;
}
```

- [ ] **Step 16: Verify lint and build**

Run: `npm run lint && npm run build`
Expected: both succeed; build lists route `/` as static.

- [ ] **Step 17: Commit**

```bash
git add -A package.json package-lock.json tsconfig.json vitest.config.ts next.config.ts scripts src public/images mockups/jigstack-redesign.html
git commit -m "chore: set up redesign foundation (deps, styles, fonts, theme boot)"
```

---

### Task 2: Content model and date/tag helpers

**Files:**
- Create: `src/content/types.ts`, `src/content/site.ts`, `src/content/projects.ts`, `src/content/experience.ts`, `src/content/services.ts`, `src/content/process.ts`, `src/content/stack.ts`, `src/content/testimonials.ts`, `src/lib/duration.ts`, `src/lib/tags.ts`
- Test: `src/lib/duration.test.ts`, `src/lib/tags.test.ts`, `src/content/content.test.ts`

**Interfaces:**
- Produces (types): `Project`, `ProjectImage`, `Role`, `Service`, `ProcessStep`, `StackGroup`, `Testimonial`, `SiteLink` (see `types.ts` below)
- Produces (data): `site`, `NAV_LINKS`, `projects`, `featuredProjects`, `experience`, `services`, `processSteps`, `PROCESS_NOTE`, `stackGroups`, `testimonials`
- Produces (lib): `parseYearMonth(v: string): { y: number; m: number }`, `monthsInclusive(start: string, end: string): number`, `formatDuration(months: number): string`, `toYearMonth(d: Date): string`, `roleDuration(start: string, end?: string, now?: Date): string`, `formatMonth(ym: string): string`, `formatRange(start: string, end?: string): string`, `splitTags<T>(items: T[], max: number, minHidden?: number): { shown: T[]; hidden: T[] }`

- [ ] **Step 1: Write the failing duration tests** — `src/lib/duration.test.ts`

```ts
import { describe, expect, it } from "vitest";
import { formatDuration, formatMonth, formatRange, monthsInclusive, parseYearMonth, roleDuration, toYearMonth } from "./duration";

describe("monthsInclusive", () => {
  it("counts both the start and end month, like LinkedIn", () => {
    expect(monthsInclusive("2025-12", "2026-09")).toBe(10);
    expect(monthsInclusive("2025-06", "2026-09")).toBe(16);
    expect(monthsInclusive("2025-03", "2025-06")).toBe(4);
    expect(monthsInclusive("2023-11", "2025-11")).toBe(25);
    expect(monthsInclusive("2025-01", "2025-01")).toBe(1);
  });
});

describe("formatDuration", () => {
  it("formats years and months with correct plurals", () => {
    expect(formatDuration(1)).toBe("1 mo");
    expect(formatDuration(10)).toBe("10 mos");
    expect(formatDuration(12)).toBe("1 yr");
    expect(formatDuration(16)).toBe("1 yr 4 mos");
    expect(formatDuration(25)).toBe("2 yrs 1 mo");
    expect(formatDuration(24)).toBe("2 yrs");
  });
  it("rejects zero or negative spans (end before start)", () => {
    expect(() => formatDuration(0)).toThrow(RangeError);
    expect(() => formatDuration(monthsInclusive("2025-06", "2025-03"))).toThrow(RangeError);
  });
});

describe("parseYearMonth", () => {
  it("rejects malformed values", () => {
    expect(() => parseYearMonth("2025-13")).toThrow();
    expect(() => parseYearMonth("Dec 2025")).toThrow();
    expect(parseYearMonth("2025-12")).toEqual({ y: 2025, m: 12 });
  });
});

describe("labels", () => {
  it("formats months and ranges without locale drift", () => {
    expect(formatMonth("2025-12")).toBe("Dec 2025");
    expect(formatRange("2025-12")).toBe("Dec 2025 – Present");
    expect(formatRange("2025-03", "2025-06")).toBe("Mar 2025 – Jun 2025");
  });
  it("computes open-ended roles against a given date", () => {
    expect(toYearMonth(new Date(2026, 8, 28))).toBe("2026-09");
    expect(roleDuration("2025-12", undefined, new Date(2026, 8, 28))).toBe("10 mos");
    expect(roleDuration("2023-11", "2025-11")).toBe("2 yrs 1 mo");
  });
});
```

- [ ] **Step 2: Write the failing tag tests** — `src/lib/tags.test.ts`

```ts
import { describe, expect, it } from "vitest";
import { splitTags } from "./tags";

const six = ["a", "b", "c", "d", "e", "f"];

describe("splitTags", () => {
  it("shows the first `max` and hides the rest", () => {
    expect(splitTags(six, 4)).toEqual({ shown: ["a", "b", "c", "d"], hidden: ["e", "f"] });
  });
  it("shows everything when only one would be hidden (default minHidden = 2)", () => {
    expect(splitTags(six.slice(0, 5), 4)).toEqual({ shown: ["a", "b", "c", "d", "e"], hidden: [] });
  });
  it("allows a single hidden item when minHidden = 1 (project cards)", () => {
    expect(splitTags(six.slice(0, 5), 4, 1)).toEqual({ shown: ["a", "b", "c", "d"], hidden: ["e"] });
  });
  it("handles short lists", () => {
    expect(splitTags(["a"], 4)).toEqual({ shown: ["a"], hidden: [] });
  });
});
```

- [ ] **Step 3: Run to verify failure**

Run: `npm test -- src/lib`
Expected: FAIL — cannot resolve `./duration` and `./tags`.

- [ ] **Step 4: Implement `src/lib/duration.ts`**

```ts
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function parseYearMonth(value: string): { y: number; m: number } {
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) throw new Error(`Invalid year-month "${value}" (expected YYYY-MM)`);
  const m = Number(match[2]);
  if (m < 1 || m > 12) throw new Error(`Invalid month in "${value}"`);
  return { y: Number(match[1]), m };
}

/** Months between two YYYY-MM values, counting both ends (LinkedIn style). */
export function monthsInclusive(start: string, end: string): number {
  const a = parseYearMonth(start);
  const b = parseYearMonth(end);
  return (b.y - a.y) * 12 + (b.m - a.m) + 1;
}

export function formatDuration(months: number): string {
  if (!Number.isInteger(months) || months < 1) {
    throw new RangeError(`Duration must be at least 1 month, got ${months}`);
  }
  const yrs = Math.floor(months / 12);
  const mos = months % 12;
  const parts: string[] = [];
  if (yrs) parts.push(`${yrs} ${yrs === 1 ? "yr" : "yrs"}`);
  if (mos) parts.push(`${mos} ${mos === 1 ? "mo" : "mos"}`);
  return parts.join(" ");
}

export function toYearMonth(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function roleDuration(start: string, end?: string, now: Date = new Date()): string {
  return formatDuration(monthsInclusive(start, end ?? toYearMonth(now)));
}

export function formatMonth(ym: string): string {
  const { y, m } = parseYearMonth(ym);
  return `${MONTHS[m - 1]} ${y}`;
}

export function formatRange(start: string, end?: string): string {
  return `${formatMonth(start)} – ${end ? formatMonth(end) : "Present"}`;
}
```

- [ ] **Step 5: Implement `src/lib/tags.ts`**

```ts
/**
 * Split a list into the items shown up front and the ones behind "+N more".
 * If fewer than `minHidden` would be hidden, show everything ("+1 more" is not worth a click).
 */
export function splitTags<T>(items: T[], max: number, minHidden = 2): { shown: T[]; hidden: T[] } {
  if (items.length - max < minHidden) return { shown: items, hidden: [] };
  return { shown: items.slice(0, max), hidden: items.slice(max) };
}
```

- [ ] **Step 6: Run to verify the lib tests pass**

Run: `npm test -- src/lib`
Expected: PASS (theme, duration, tags).

- [ ] **Step 7: Create `src/content/types.ts`**

```ts
export type SiteLink = { label: string; href: string; external?: boolean };

export type ProjectImage = { src: string; alt: string; width: number; height: number; position?: string };

export type Project = {
  id: string;
  title: string;
  year: string;
  /** Index "Type" column, e.g. "Web + Mobile". */
  type: string;
  /** Ordered most important first. Cards show the first 4; the index shows the first 3. */
  stack: string[];
  featured: boolean;
  live?: string;
  repo?: string;
  image?: ProjectImage;
  /** Shown in the index thumbnail when there is no image. */
  thumbInitials?: string;
  /** Featured-only fields (the content test enforces them). */
  category?: string;
  summary?: string;
  platforms?: string;
  users?: string;
  detail?: { overview: string[]; features: string[] };
};

export type Role = {
  id: string;
  mark: string;
  org: string;
  role: string;
  /** YYYY-MM */
  start: string;
  /** YYYY-MM; omitted for current roles. */
  end?: string;
  summary: string;
  more: string;
  tags: string[];
};

export type Service = { title: string; description: string; includes: string[] };

export type ProcessStep = { num: string; title: string; body: string; time: string };

export type StackGroup = { label: string; items: string[] };

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  project: string;
  /** Only approved quotes render. Never approve a quote the client has not confirmed. */
  approved: boolean;
};
```

- [ ] **Step 8: Create `src/content/site.ts`**

```ts
import type { SiteLink } from "./types";

const PHONE = "639566297372";

export const site = {
  name: "James Ivan Gabarda",
  brand: "JIGSTACK",
  email: "jamesivangabarda8@gmail.com",
  cvUrl: "https://drive.google.com/file/d/1v-GBqVPGlbKYV-sEwNu10gzNxMgTdDFS/view",
  githubUrl: "https://github.com/jigabarda",
  status: "Available for new projects",
  heroLede: "I design and build fast, reliable web and mobile products, from the first sketch to launch day.",
  location: "Bicol, PH",
  timeZone: "Asia/Manila",
  timeZoneLabel: "GMT+8",
  now: "Software Engineer, LEAD Management Pte Ltd",
  focus: "Web, mobile & AI products",
  navCta: "Hire me",
  employers: ["LEAD Management Pte Ltd", "Appnado IT Solutions", "Pru Life UK", "Independent clients"],
  bio: [
    "I'm a full-stack developer based in Bicol, Philippines. I build web and mobile products end to end, from the database schema to the last pixel of the interface.",
    "I've shipped sales platforms, real-time broadcast systems, an AI career coach, and a fingerprint door lock running on a Raspberry Pi. I care about clean architecture, fast interfaces, and code the next developer can read.",
    "Right now I'm a Software Engineer at LEAD Management Pte Ltd and a Full Stack Developer at Appnado IT Solutions, and I take on freelance projects on the side.",
  ],
  stats: [
    { label: "Projects completed", value: "10+" },
    { label: "Writing code since", value: "2019" },
    { label: "Platforms: web, mobile, desktop, IoT", value: "4" },
  ],
  experienceLede: "Writing code since 2019, shipping it professionally since 2023.",
  certificates: [
    { label: "MERN Stack Bootcamp, Udemy", href: "https://udemy-certificate.s3.amazonaws.com/image/UC-f008d853-c296-4f81-9358-4c9f51df5a01.jpg?v=1755337118000", external: true },
    { label: "Foundations of Web Development, Udemy", href: "https://udemy-certificate.s3.amazonaws.com/image/UC-e38cebd7-e5c9-4c4d-bc92-5e01f8fbdfdf.jpg?v=1733299197000", external: true },
    { label: "More on LinkedIn", href: "https://www.linkedin.com/in/james-ivan-gabarda/", external: true },
  ] satisfies SiteLink[],
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/james-ivan-gabarda/", external: true },
    { label: "GitHub", href: "https://github.com/jigabarda", external: true },
    { label: "Facebook", href: "https://www.facebook.com/Jeyms.Aybannnnnn", external: true },
    { label: "WhatsApp", href: `https://wa.me/${PHONE}?text=${encodeURIComponent("Hi James, I'd like to talk about a project.")}`, external: true },
    // Opens the Viber app directly; does nothing where Viber is not installed.
    { label: "Viber", href: `viber://chat?number=%2B${PHONE}` },
  ] satisfies SiteLink[],
};

/** Nav order matches the page order. */
export const NAV_LINKS = [
  { id: "projects", label: "Projects" },
  { id: "services", label: "Services" },
  { id: "process", label: "Process" },
  { id: "about", label: "About" },
  { id: "stack", label: "Stack" },
  { id: "contact", label: "Contact" },
] as const;
```

- [ ] **Step 9: Create `src/content/projects.ts`**

```ts
import type { Project } from "./types";

export const projects: Project[] = [
  {
    id: "sellora",
    title: "Sellora",
    year: "2026",
    type: "Web + Mobile",
    featured: true,
    category: "Sales & inventory",
    summary: "Sales and inventory app for small businesses: an online Next.js web dashboard and a Flutter mobile app that works offline or online.",
    platforms: "Web · Android · iOS",
    users: "10+",
    live: "https://sellora-world.vercel.app/",
    image: { src: "/images/sellora-mobile.png", alt: "Sellora mobile app on three phones showing the dashboard, menu, and sales reports", width: 3200, height: 2000, position: "center" },
    stack: ["Next.js", "Flutter", "Supabase", "SQLite", "React", "Recharts", "Dart", "Riverpod", "ML Kit"],
    detail: {
      overview: [
        "Sellora is a sales and inventory platform for small businesses, from retail stores to water stations and rentals. Owners record sales, track stock, log expenses, and read their numbers in one place.",
        "The web app runs online on Next.js and Supabase. The Flutter mobile app is offline-first: everything is saved in a SQLite database on the phone, so it keeps working through a brownout, a dead signal, or a week without data, and it can go online when a connection is available.",
      ],
      features: [
        "Mobile app on Android and iOS that works offline or online",
        "Run several businesses from one account and switch in a tap",
        "Log a sale or expense by typing a single line",
        "Notebook Capture: photograph a page of a paper sales notebook to bring it into the app",
        "Plain-language insights, like which day of the week is slowest",
        "Revenue, expense, profit, and top-product reports, with PDF export on the web",
      ],
    },
  },
  {
    id: "safeship",
    title: "Safeship",
    year: "2026",
    type: "Web + AI",
    featured: true,
    category: "Developer security",
    summary: "A security co-pilot for people who build with AI tools. Connect a GitHub repo and it finds leaked secrets, insecure code, and vulnerable dependencies, then explains each fix in plain English.",
    platforms: "Web",
    users: "20+",
    live: "https://safeship-h9zu.vercel.app/",
    repo: "https://github.com/jigabarda/Safeship",
    image: { src: "/images/AdvisorPage.png", alt: "Safeship Advisor page for reviewing a repository's schema, tech stack, and structure", width: 1917, height: 907 },
    stack: ["Next.js", "Semgrep", "Groq", "GitHub Actions", "gitleaks", "OSV-Scanner", "Prisma", "PostgreSQL", "Auth.js", "Ollama"],
    detail: {
      overview: [
        "Safeship is a security co-pilot for people who build with AI tools. Connect a GitHub repository and it scans the code for leaked secrets, insecure patterns, and vulnerable dependencies, then explains every finding in plain English, ranked by real-world risk, with a copy-paste fix.",
        "Scans run on on-demand GitHub Actions runners with gitleaks, Semgrep, and OSV-Scanner. Secrets are redacted before anything leaves the runner, and the cloned code is destroyed when the job ends. It is static analysis only: Safeship never probes or sends traffic to live systems.",
      ],
      features: [
        "Secret, code (SAST), and dependency scanning in a single run",
        "Plain-English explanations and a 0–100 safety score for every scan",
        "Fix with AI: opens a pull request that resolves a finding",
        "Advisor reviews a repo's schema, tech stack, and structure, and draws its tables",
        "Assistant chat for security and code questions",
        "Runs on Groq in the cloud or fully local with Ollama",
      ],
    },
  },
  {
    id: "broadcast",
    title: "Broadcast Management System",
    year: "2025",
    type: "Web + Mobile",
    featured: false,
    repo: "https://github.com/jigabarda/BMS-Web",
    image: { src: "/images/broadcast.png", alt: "Broadcast Management System dashboard", width: 1269, height: 572 },
    stack: ["Rails", "Next.js", "PostgreSQL"],
  },
  {
    id: "mentra",
    title: "Mentra",
    year: "2025",
    type: "Web + AI",
    featured: false,
    repo: "https://github.com/jigabarda/Mentra",
    image: { src: "/images/mentra.png", alt: "Mentra AI career coach", width: 1365, height: 628 },
    stack: ["Next.js", "Supabase", "OpenAI"],
  },
  {
    id: "lms",
    title: "Learning Management System",
    year: "2025",
    type: "Web",
    featured: false,
    repo: "https://github.com/jigabarda/LeaningManagementSystem",
    image: { src: "/images/cms.png", alt: "Learning Management System", width: 1365, height: 630 },
    stack: ["Next.js", "Supabase", "Tailwind"],
  },
  {
    id: "bms",
    title: "Barangay Management System",
    year: "2025",
    type: "Desktop, client work",
    featured: true,
    category: "Local government",
    summary: "A desktop app that runs a barangay office's records in one place: residents, households, certificates, blotter reports, and finances, with certificates issued as ready-to-print PDFs.",
    platforms: "Desktop",
    users: "5+",
    repo: "https://github.com/jptaycs/BMS",
    image: { src: "/images/bms2.jpg", alt: "Barangay Management System dashboard with youth demographics charts", width: 2048, height: 1223, position: "center" },
    stack: ["Tauri", "React", "TypeScript", "Rust", "SQLite", "TanStack Query", "React PDF", "Tailwind CSS", "Zod"],
    detail: {
      overview: [
        "A desktop app built with Appnado IT Solutions to help local government units run their barangay offices: resident and household records, certificates, blotter reports, events, and finances in one place.",
        "Built by a three-person team on Tauri, with a React and TypeScript interface and a Rust backend that stores everything in a local SQLite database, so records stay on the office computer and the app works without an internet connection.",
      ],
      features: [
        "Resident and household records with search and bulk actions",
        "Certificates issued from templates as ready-to-print PDFs",
        "Blotter records for filing and reviewing incident reports",
        "Youth registry for the Sangguniang Kabataan, including SK voter and school or work status",
        "Barangay officials, events, income, and expense tracking",
        "Dashboard with charts of the barangay's key numbers",
      ],
    },
  },
  {
    id: "resort",
    title: "Resort Reservation App",
    year: "2025",
    type: "Mobile",
    featured: false,
    repo: "https://github.com/jigabarda/ResortReservationApp",
    thumbInitials: "RR",
    stack: ["React Native", "Expo", "Google Maps"],
  },
  {
    id: "prolock",
    title: "ProLock",
    year: "2024",
    type: "IoT + Desktop",
    featured: false,
    repo: "https://github.com/jigabarda/ProLockv5",
    image: { src: "/images/prolock.png", alt: "ProLock attendance system", width: 1728, height: 970 },
    stack: ["Python", "C#", "Raspberry Pi", "RFID"],
  },
  {
    id: "ecommerce",
    title: "E-commerce Platform",
    year: "2024",
    type: "Web + Mobile",
    featured: false,
    repo: "https://github.com/jigabarda/EcommerceApp",
    image: { src: "/images/ecom.png", alt: "E-commerce platform", width: 1280, height: 568 },
    stack: ["React Native", "Expo", "Firebase"],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
```

- [ ] **Step 10: Create `src/content/experience.ts`**

```ts
import type { Role } from "./types";

export const experience: Role[] = [
  {
    id: "lead",
    mark: "LM",
    org: "LEAD Management Pte Ltd",
    role: "Software Engineer",
    start: "2025-12",
    summary: "Led development of internal microservices at LEAD, including the enterprise and CRM services that support the company's day-to-day operations.",
    more: "Owned these services from design to deployment: planning service boundaries and APIs, reviewing code, and shipping releases on Docker and AWS. Also built the company's employee management app, giving teams one place to manage staff records and workflows.",
    tags: ["Ruby on Rails", "React", "Flutter", "PostgreSQL", "Docker", "AWS"],
  },
  {
    id: "appnado",
    mark: "AP",
    org: "Appnado IT Solutions",
    role: "Full Stack Developer",
    start: "2025-06",
    summary: "Led project development and owned the system architecture across Appnado's client builds, from choosing the stack to structuring services and data models.",
    more: "Delivered a Barangay Management System for local government units that moved certificate processing off paper, reduced errors, and gave officials real-time dashboards. Worked closely with stakeholders to turn manual government workflows into software their staff could adopt quickly.",
    tags: ["Go", "Next.js", "React", "Flutter", "PostgreSQL", "Clerk"],
  },
  {
    id: "pru",
    mark: "PRU",
    org: "Pru Life UK",
    role: "Full Stack Web Developer Intern",
    start: "2025-03",
    end: "2025-06",
    summary: "Led development of a website for a Pru Life UK advisor, where their clients can request insurance quotes and book appointments.",
    more: "Built and managed the backend features behind it, handling quote submissions and appointment scheduling end to end, and kept the site maintained through the rest of the internship.",
    tags: ["Next.js", "React", "Tailwind CSS", "PostgreSQL", "Web3Forms"],
  },
  {
    id: "freelance",
    mark: "FL",
    org: "Self-employed",
    role: "Freelance Developer",
    start: "2023-11",
    end: "2025-11",
    summary: "Designed, built, and shipped web and mobile apps end to end, for clients and as my own products.",
    more: "Handled every stage myself: scoping requirements with clients, designing the interface, building the frontend and backend, and deploying to production. Work from this period includes an e-commerce app and a resort reservation app.",
    tags: ["Next.js", "React Native", "Flutter", "Firebase", "PostgreSQL", "Go"],
  },
];
```

- [ ] **Step 11: Create `src/content/services.ts`, `process.ts`, `stack.ts`, `testimonials.ts`**

`src/content/services.ts`:

```ts
import type { Service } from "./types";

export const services: Service[] = [
  { title: "Custom software development", description: "Software built around how your business actually works, so your team stops fighting spreadsheets and paperwork.", includes: ["Business systems", "Internal tools", "Desktop apps"] },
  { title: "Web development", description: "Fast, reliable web apps and sites, from admin dashboards to full products your customers use.", includes: ["Web apps", "Dashboards", "Business websites"] },
  { title: "Mobile app development", description: "iOS and Android apps from one codebase, built to keep working even when the internet doesn't.", includes: ["iOS", "Android", "Offline-first apps"] },
  { title: "AI integration", description: "AI features built into your product that save your team real hours, on cloud or private local models.", includes: ["Assistants", "Document analysis", "Automated reviews"] },
  { title: "UI/UX and web design", description: "Clear, easy-to-use interfaces, designed and prototyped before any code is written.", includes: ["Web design", "Wireframes", "Clickable prototypes"] },
  { title: "Testing and maintenance", description: "Catch bugs before your users do, then keep your app fast, secure, and up to date after launch.", includes: ["Software testing", "Bug fixes", "Upgrades"] },
];

/** Words for the scrolling band between Toolkit and Testimonials. */
export const SERVICE_BAND = ["Custom software", "Web development", "Mobile apps", "AI integration", "UI/UX design", "Testing & maintenance"];
```

`src/content/process.ts`:

```ts
import type { ProcessStep } from "./types";

export const processSteps: ProcessStep[] = [
  { num: "01", title: "Discover", body: "We talk through your goals, users, and budget. You get a written scope and a fixed quote.", time: "2–3 days" },
  { num: "02", title: "Design", body: "Wireframes, then polished screens in Figma that you can click through and comment on.", time: "About 1 week" },
  { num: "03", title: "Build", body: "Weekly demos on a live preview link, so you can watch the product take shape.", time: "2–6 weeks" },
  { num: "04", title: "Launch", body: "Deployment, monitoring, and a handover with documentation. I stay available for fixes.", time: "Ongoing" },
];

export const PROCESS_NOTE = "Timelines are typical for a small to mid-sized project.";
```

`src/content/stack.ts`:

```ts
import type { StackGroup } from "./types";

export const stackGroups: StackGroup[] = [
  { label: "Languages", items: ["TypeScript", "JavaScript", "Python", "C#", "Java", "PHP", "Ruby", "Dart", "Go", "HTML", "CSS"] },
  { label: "Frameworks", items: ["React", "Next.js", "React Native", "Flutter", ".NET", "Laravel", "Ruby on Rails", "Tailwind CSS", "Vite", "Riverpod", "GoRouter"] },
  { label: "Backend", items: ["Node.js", "REST APIs", "Prisma ORM", "JWT", "GitHub OAuth", "Supabase Auth", "Clerk"] },
  { label: "Databases", items: ["PostgreSQL", "MySQL", "MongoDB", "SQLite", "Firebase", "Supabase"] },
  { label: "Cloud and DevOps", items: ["AWS", "Docker", "CI/CD"] },
  { label: "AI and LLMs", items: ["OpenAI", "Claude", "Groq", "Ollama"] },
  { label: "Integrations", items: ["WhatsApp Business API", "Twilio", "Firebase Cloud Messaging", "Third-party APIs"] },
  { label: "Tools", items: ["Figma", "Webflow", "Git", "GitHub", "Bitbucket"] },
];
```

`src/content/testimonials.ts`:

```ts
import type { Testimonial } from "./types";

export const testimonials: Testimonial[] = [
  {
    id: "lgu-draft",
    // DRAFT: wording not yet confirmed by the client. Keep approved: false until they sign off.
    quote: "The team took the time to learn how our office actually works, then turned our paper-based certificate requests into a system our staff rely on every day. Transactions are faster, errors are down, and the dashboards finally show us how our barangay is being served.",
    name: "Barangay official",
    role: "Local government unit, Philippines",
    project: "Barangay Management System, built with Appnado IT Solutions",
    approved: false,
  },
];
```

- [ ] **Step 12: Write the content integrity test** — `src/content/content.test.ts`

```ts
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
```

- [ ] **Step 13: Run all tests**

Run: `npm test`
Expected: PASS (theme, duration, tags, content).

- [ ] **Step 14: Commit**

```bash
git add src/content src/lib
git commit -m "feat: add typed site content and date/tag helpers"
```

---

### Task 3: Page shell — icons, nav, footer, section heading, reveals

**Files:**
- Create: `src/components/icons.tsx`, `src/components/layout/Nav.tsx`, `src/components/layout/Footer.tsx`, `src/components/ui/SectionHead.tsx`, `src/components/ui/RevealObserver.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `site`, `NAV_LINKS` (Task 2); `applyTheme`, `currentTheme`, `Theme` (Task 1)
- Produces: `ArrowRight`, `ArrowUpRight`, `ChevronDown`, `Close`, `Menu`, `Moon`, `Sun` (each `(props: { size?: number }) => JSX.Element`); `<Nav />`, `<Footer />`, `<SectionHead id title lede? />`, `<RevealObserver />`

- [ ] **Step 1: Create `src/components/icons.tsx`**

```tsx
type IconProps = { size?: number };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const ArrowRight = ({ size = 16 }: IconProps) => (
  <svg {...base} width={size} height={size} strokeWidth={2}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

export const ArrowUpRight = ({ size = 13 }: IconProps) => (
  <svg {...base} width={size} height={size} strokeWidth={2}><path d="M7 17 17 7M8 7h9v9" /></svg>
);

export const ChevronDown = ({ size = 12 }: IconProps) => (
  <svg {...base} width={size} height={size} strokeWidth={2}><path d="m6 9 6 6 6-6" /></svg>
);

export const Close = ({ size = 16 }: IconProps) => (
  <svg {...base} width={size} height={size} strokeWidth={2}><path d="M6 6l12 12M18 6 6 18" /></svg>
);

export const Menu = ({ size = 18 }: IconProps) => (
  <svg {...base} width={size} height={size} strokeWidth={1.8}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);

/** Moon and Sun carry the mockup's classes; CSS tokens decide which one shows. */
export const Moon = ({ size = 18 }: IconProps) => (
  <svg {...base} className="i-moon" width={size} height={size} strokeWidth={1.8}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
);

export const Sun = ({ size = 18 }: IconProps) => (
  <svg {...base} className="i-sun" width={size} height={size} strokeWidth={1.8}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);
```

- [ ] **Step 2: Create `src/components/layout/Nav.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { Menu, Moon, Sun } from "@/components/icons";
import { NAV_LINKS, site } from "@/content/site";
import { applyTheme, currentTheme, type Theme } from "@/lib/theme";

/** Every section the highlight should know about; ones without a nav link clear it. */
const TRACKED = ["home", "projects", "services", "process", "about", "stack", "testimonials", "contact"];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [next, setNext] = useState<Theme | null>(null);

  useEffect(() => {
    setNext(currentTheme() === "dark" ? "light" : "dark");
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const id of TRACKED) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
    const target = currentTheme() === "dark" ? "light" : "dark";
    applyTheme(target, event.currentTarget);
    setNext(target === "dark" ? "light" : "dark");
  };

  return (
    <header className="nav" id="nav">
      <div className="wrap nav-inner">
        <a className="brand" href="#home" aria-label="JigStack, back to top">{site.brand}</a>

        <nav className="nav-links" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a key={link.id} href={`#${link.id}`} aria-current={active === link.id ? "true" : undefined}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <button className="icon-btn" type="button" onClick={toggleTheme} aria-label={next ? `Switch to ${next} theme` : "Switch theme"}>
            <Moon />
            <Sun />
          </button>
          <a className="btn btn-primary btn-sm" href="#contact">{site.navCta}</a>
          <button
            className="icon-btn menu-btn"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Menu />
          </button>
        </div>
      </div>

      <div className="mobile-menu" id="mobile-menu" hidden={!menuOpen}>
        <div className="wrap">
          {NAV_LINKS.map((link) => (
            <a key={link.id} href={`#${link.id}`} onClick={() => setMenuOpen(false)}>{link.label}</a>
          ))}
        </div>
      </div>

      <span className="progress" aria-hidden="true" />
    </header>
  );
}
```

- [ ] **Step 3: Create `src/components/layout/Footer.tsx`**

```tsx
import { site } from "@/content/site";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <a className="brand" href="#home">{site.brand}</a>
        <p>© {new Date().getFullYear()} {site.name}</p>
        <a href="#home">Back to top ↑</a>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Create `src/components/ui/SectionHead.tsx`**

```tsx
type Props = { id: string; title: string; lede?: string };

/** "#id" label, Anton title with the crimson period, and an optional lede. */
export default function SectionHead({ id, title, lede }: Props) {
  return (
    <header className="sec-head reveal">
      <p className="label"><b>#</b>{id}</p>
      <h2 className="sec-title">{title}<em>.</em></h2>
      {lede ? <p className="sec-lede">{lede}</p> : null}
    </header>
  );
}
```

- [ ] **Step 5: Create `src/components/ui/RevealObserver.tsx`**

```tsx
"use client";

import { useEffect } from "react";

type RevealWindow = Window & { __revealFailsafe?: number };

/**
 * Adds `.is-in` to each `.reveal` element as it enters the viewport (once).
 * Hiding only happens while <html> has `.reveal-on`, which the boot script sets.
 */
export default function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("reveal-on")) return;
    window.clearTimeout((window as RevealWindow).__revealFailsafe);

    const targets = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    for (const el of targets) {
      const siblings = Array.from(el.parentElement?.children ?? []).filter((c) => c.classList.contains("reveal"));
      if (siblings.length > 1) el.style.setProperty("--d", `${Math.min(siblings.indexOf(el), 6) * 0.07}s`);
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );
    for (const el of targets) io.observe(el);
    return () => io.disconnect();
  }, []);

  return null;
}
```

- [ ] **Step 6: Update `src/app/page.tsx`**

```tsx
import Footer from "@/components/layout/Footer";
import Nav from "@/components/layout/Nav";
import RevealObserver from "@/components/ui/RevealObserver";

export default function Page() {
  return (
    <>
      <Nav />
      <main />
      <Footer />
      <RevealObserver />
    </>
  );
}
```

- [ ] **Step 7: Verify**

Run: `npm run lint && npm run build && npm run dev`
Expected: build succeeds. In the browser at `http://localhost:3000`: nav bar matches the mockup; theme toggle switches with the circular reveal and persists across reload (no flash); below 960px the menu button opens the mobile menu; footer shows the wordmark and current year. Stop the dev server.

- [ ] **Step 8: Commit**

```bash
git add src/components src/app/page.tsx
git commit -m "feat: add nav, footer, section heading, and scroll reveals"
```

---

### Task 4: Hero, local clock, ambient dot field, experience strip

**Files:**
- Create: `src/components/sections/Hero.tsx`, `src/components/sections/LocalClock.tsx`, `src/components/effects/DotField.tsx`, `src/components/sections/ExperienceStrip.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `site`, `ArrowRight`, `ArrowUpRight`
- Produces: `<Hero />`, `<ExperienceStrip />`, `<DotField />` (reused by Contact in Task 9), `<LocalClock timeZone />`

- [ ] **Step 1: Create `src/components/sections/LocalClock.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";

/** Renders "--:--" on the server, then the live time in `timeZone`. */
export default function LocalClock({ timeZone }: { timeZone: string }) {
  const [time, setTime] = useState("--:--");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 15000);
    return () => window.clearInterval(id);
  }, [timeZone]);

  return <span className="clock">{time}</span>;
}
```

- [ ] **Step 2: Create `src/components/effects/DotField.tsx`**

```tsx
"use client";

import { useEffect, useRef } from "react";

const GAP = 14;
const SIZE = 1.5;
const FRAME_MS = 40; // ~25fps is plenty for a slow twinkle

type Dot = { x: number; y: number; m: number; ph: number; sp: number };

/** Ambient dot grid, densest in the top-right corner. Colour and strength come from CSS tokens. */
export default function DotField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;

    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let dots: Dot[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let last = 0;
    let visible = false;
    let resizeTimer: number | undefined;

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.clientWidth;
      h = cv.clientHeight;
      if (!w || !h) return;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      for (let y = GAP / 2; y < h; y += GAP) {
        for (let x = GAP / 2; x < w; x += GAP) {
          const dx = (w - x) / Math.max(w, 900);
          const dy = y / Math.max(h, 600);
          let m = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy * 1.6) / 0.8);
          m *= m;
          if (m <= 0.01 || Math.random() > 0.3 + m * 0.7) continue;
          dots.push({ x, y, m, ph: Math.random() * 6.283, sp: 0.25 + Math.random() * 0.9 });
        }
      }
    };

    const draw = (t: number) => {
      if (!still) raf = requestAnimationFrame(draw);
      if (!still && t - last < FRAME_MS) return;
      last = t;
      const cs = getComputedStyle(cv);
      const max = parseFloat(cs.getPropertyValue("--dotfield-alpha")) || 0.3;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = cs.color;
      for (const d of dots) {
        const tw = still ? 1 : 0.35 + 0.65 * (0.5 + 0.5 * Math.sin((t / 1000) * d.sp + d.ph));
        ctx.globalAlpha = max * d.m * tw;
        ctx.fillRect(d.x, d.y, SIZE, SIZE);
      }
      ctx.globalAlpha = 1;
    };

    const start = () => {
      cancelAnimationFrame(raf);
      if (still) draw(0);
      else raf = requestAnimationFrame(draw);
    };

    build();
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else cancelAnimationFrame(raf);
    });
    io.observe(cv);
    const ro = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        build();
        if (visible) start();
      }, 120);
    });
    ro.observe(cv);
    const mo = still ? new MutationObserver(() => draw(0)) : null;
    mo?.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      io.disconnect();
      ro.disconnect();
      mo?.disconnect();
    };
  }, []);

  return <canvas ref={ref} className="dotfield" aria-hidden="true" />;
}
```

- [ ] **Step 3: Create `src/components/sections/Hero.tsx`**

```tsx
import DotField from "@/components/effects/DotField";
import { ArrowRight, ArrowUpRight } from "@/components/icons";
import { site } from "@/content/site";
import LocalClock from "./LocalClock";

export default function Hero() {
  return (
    <section className="hero" id="home">
      <DotField />
      <div className="wrap">
        <p className="status"><span className="dot" aria-hidden="true" />{site.status}</p>

        <h1 className="hero-name">
          <span className="line"><span>James Ivan</span></span>
          <span className="line"><span>Gabarda<em>.</em></span></span>
        </h1>

        <div className="hero-grid">
          <p className="hero-lede">{site.heroLede}</p>
          <dl className="meta">
            <div><dt className="kicker">Based in</dt><dd>{site.location}</dd></div>
            <div><dt className="kicker">Local time</dt><dd><LocalClock timeZone={site.timeZone} /> {site.timeZoneLabel}</dd></div>
            <div><dt className="kicker">Now</dt><dd>{site.now}</dd></div>
            <div><dt className="kicker">Focus</dt><dd>{site.focus}</dd></div>
          </dl>
        </div>

        <div className="hero-cta">
          <div className="btn-group">
            <a className="btn btn-primary" href="#contact">Start a project <ArrowRight /></a>
            <a className="btn btn-ghost" href="#projects">See my work</a>
          </div>
          <a className="text-link" href={site.cvUrl} target="_blank" rel="noopener noreferrer">View CV <ArrowUpRight /></a>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Create `src/components/sections/ExperienceStrip.tsx`**

```tsx
import { site } from "@/content/site";

export default function ExperienceStrip() {
  return (
    <section className="strip" aria-label="Where I have worked">
      <div className="wrap strip-inner">
        <p className="kicker">Experience at</p>
        <ul>{site.employers.map((name) => <li key={name}>{name}</li>)}</ul>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Mount them in `src/app/page.tsx`** — replace `<main />` with:

```tsx
      <main>
        <Hero />
        <ExperienceStrip />
      </main>
```

and add the imports:

```tsx
import ExperienceStrip from "@/components/sections/ExperienceStrip";
import Hero from "@/components/sections/Hero";
```

- [ ] **Step 6: Verify**

Run: `npm run lint && npm run build && npm run dev`
Expected: hero matches the mockup in both themes (name rises on load, red period drops in, status dot pings); the clock shows current Philippine time within a second; the dot field twinkles in the top-right corner and freezes with OS reduced motion on. Stop the dev server.

- [ ] **Step 7: Commit**

```bash
git add src/components src/app/page.tsx
git commit -m "feat: add hero with live clock, ambient dot field, and experience strip"
```

---

### Task 5: Projects — featured cards, project index, detail drawer

**Files:**
- Create: `src/components/project/ProjectDrawer.tsx`, `src/components/project/OpenProjectButton.tsx`, `src/components/sections/Projects.tsx`, `src/components/sections/ProjectIndex.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `projects`, `featuredProjects`, `Project` (Task 2); `splitTags` (Task 2); `SectionHead`, icons (Task 3)
- Produces: `ProjectDrawerProvider({ projects: Project[], children })`, `useProjectDrawer(): { open(id: string, trigger: HTMLElement): void }`, `OpenProjectButton({ projectId, className?, ariaLabel?, children })`, `<Projects />`

- [ ] **Step 1: Create `src/components/project/ProjectDrawer.tsx`**

```tsx
"use client";

import Image from "next/image";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, ArrowUpRight, Close } from "@/components/icons";
import type { Project } from "@/content/types";

type DrawerApi = { open: (id: string, trigger: HTMLElement) => void };

const DrawerContext = createContext<DrawerApi | null>(null);

export function useProjectDrawer(): DrawerApi {
  const api = useContext(DrawerContext);
  if (!api) throw new Error("useProjectDrawer must be used inside <ProjectDrawerProvider>");
  return api;
}

export function ProjectDrawerProvider({ projects, children }: { projects: Project[]; children: ReactNode }) {
  const [current, setCurrent] = useState<Project | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const hideTimer = useRef<number | undefined>(undefined);

  const open = useCallback(
    (id: string, trigger: HTMLElement) => {
      const project = projects.find((p) => p.id === id);
      if (!project) return;
      window.clearTimeout(hideTimer.current);
      triggerRef.current = trigger;
      setCurrent(project);
      setMounted(true);
      setIsOpen(false);
      // Lock page scroll without the layout jumping when the scrollbar disappears.
      const gap = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = gap ? `${gap}px` : "";
      document.documentElement.style.overflow = "hidden";
      // Two frames: mount closed, then open so the CSS transition runs.
      requestAnimationFrame(() => requestAnimationFrame(() => setIsOpen(true)));
    },
    [projects],
  );

  const close = useCallback((focusTarget?: HTMLElement | null) => {
    setIsOpen(false);
    document.documentElement.style.overflow = "";
    document.body.style.paddingRight = "";
    hideTimer.current = window.setTimeout(() => setMounted(false), 500);
    (focusTarget ?? triggerRef.current)?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    bodyRef.current?.scrollTo(0, 0);
    closeRef.current?.focus({ preventScroll: true });
  }, [isOpen, current]);

  useEffect(() => {
    if (!mounted) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>("button, a[href]"));
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        last.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mounted, close]);

  useEffect(() => () => window.clearTimeout(hideTimer.current), []);

  // "Start a project": close, jump to the form, and pre-fill the project type if it is empty.
  const startProject = () => {
    const field = document.getElementById("cf-project") as HTMLInputElement | null;
    if (current && field && !field.value) field.value = `Something like ${current.title}`;
    close(document.getElementById("cf-name"));
  };

  return (
    <DrawerContext.Provider value={{ open }}>
      {children}
      {mounted && current ? (
        <div className={`drawer${isOpen ? " is-open" : ""}`}>
          <div className="drawer-backdrop" onClick={() => close()} />
          <aside ref={panelRef} className="drawer-panel" role="dialog" aria-modal="true" aria-labelledby="drawer-title" tabIndex={-1}>
            <header className="drawer-top">
              <p className="kicker">{current.year} · {current.category}</p>
              <button ref={closeRef} className="icon-btn" type="button" aria-label="Close project details" onClick={() => close()}>
                <Close />
              </button>
            </header>

            <div ref={bodyRef} className="drawer-body">
              <h2 className="drawer-title" id="drawer-title">{current.title}</h2>
              <dl className="facts drawer-facts">
                <div><dt className="kicker">Platforms</dt><dd>{current.platforms}</dd></div>
                {current.users ? <div><dt className="kicker">Users</dt><dd>{current.users}</dd></div> : null}
              </dl>
              {current.live ? (
                <a className="btn btn-ghost btn-sm drawer-live" href={current.live} target="_blank" rel="noopener noreferrer">
                  Visit live site <ArrowUpRight />
                </a>
              ) : null}
              {current.image ? (
                <div className="drawer-shot">
                  <Image src={current.image.src} alt={current.image.alt} fill sizes="(max-width: 600px) 100vw, 560px" />
                </div>
              ) : null}
              <section>
                <p className="kicker">Overview</p>
                <div className="drawer-overview">
                  {current.detail?.overview.map((para) => <p key={para}>{para}</p>)}
                </div>
              </section>
              <section>
                <p className="kicker">Key features</p>
                <ul className="drawer-features">
                  {current.detail?.features.map((f) => <li key={f}>{f}</li>)}
                </ul>
              </section>
              <section>
                <p className="kicker">Built with</p>
                <ul className="tags">{current.stack.map((t) => <li key={t}>{t}</li>)}</ul>
              </section>
            </div>

            <footer className="drawer-foot">
              <p className="drawer-cta-text">Want something like this?</p>
              <a className="btn btn-primary" href="#contact" onClick={startProject}>Start a project <ArrowRight /></a>
            </footer>
          </aside>
        </div>
      ) : null}
    </DrawerContext.Provider>
  );
}
```

- [ ] **Step 2: Create `src/components/project/OpenProjectButton.tsx`**

```tsx
"use client";

import type { ReactNode } from "react";
import { useProjectDrawer } from "./ProjectDrawer";

type Props = { projectId: string; className?: string; ariaLabel?: string; children: ReactNode };

export default function OpenProjectButton({ projectId, className, ariaLabel, children }: Props) {
  const { open } = useProjectDrawer();
  return (
    <button type="button" className={className} aria-label={ariaLabel} onClick={(e) => open(projectId, e.currentTarget)}>
      {children}
    </button>
  );
}
```

- [ ] **Step 3: Create `src/components/sections/ProjectIndex.tsx`**

```tsx
import Image from "next/image";
import { ArrowUpRight } from "@/components/icons";
import { site } from "@/content/site";
import type { Project } from "@/content/types";

export default function ProjectIndex({ projects }: { projects: Project[] }) {
  return (
    <div className="index-block">
      <div className="index-top">
        <h3>Projects at a glance</h3>
      </div>

      <div className="index" role="list">
        <div className="index-head" aria-hidden="true">
          <span />
          <span className="kicker">Year</span>
          <span className="kicker">Project</span>
          <span className="kicker ix-type">Type</span>
          <span className="kicker ix-stack">Stack</span>
          <span className="kicker">Link</span>
        </div>

        {projects.map((p) => {
          const href = p.live ?? p.repo;
          return (
            <a key={p.id} className="index-row reveal" role="listitem" href={href} target="_blank" rel="noopener noreferrer">
              {p.image ? (
                <span className="ix-thumb"><Image src={p.image.src} alt="" width={176} height={110} /></span>
              ) : (
                <span className="ix-thumb ix-thumb-empty" aria-hidden="true">{p.thumbInitials}</span>
              )}
              <span className="ix-year">{p.year}</span>
              <span className="ix-name">{p.title}</span>
              <span className="ix-type">{p.type}</span>
              <span className="ix-stack">{p.stack.slice(0, 3).join(", ")}</span>
              <span className="ix-go">{p.live ? "Live" : "Code"} <ArrowUpRight size={12} /></span>
            </a>
          );
        })}
      </div>

      <div className="index-foot">
        <a className="text-link index-more" href={site.githubUrl} target="_blank" rel="noopener noreferrer">More on GitHub <ArrowUpRight size={12} /></a>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create `src/components/sections/Projects.tsx`**

```tsx
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "@/components/icons";
import OpenProjectButton from "@/components/project/OpenProjectButton";
import SectionHead from "@/components/ui/SectionHead";
import { featuredProjects, projects } from "@/content/projects";
import type { Project } from "@/content/types";
import { splitTags } from "@/lib/tags";
import ProjectIndex from "./ProjectIndex";

function FeaturedProject({ project: p }: { project: Project }) {
  const { shown, hidden } = splitTags(p.stack, 4, 1);
  return (
    <article className="feature reveal">
      <OpenProjectButton projectId={p.id} className="feature-media" ariaLabel={`View ${p.title} details`}>
        {p.image ? (
          <Image
            src={p.image.src}
            alt={p.image.alt}
            fill
            sizes="(max-width: 860px) 100vw, 50vw"
            style={p.image.position ? { objectPosition: p.image.position } : undefined}
          />
        ) : null}
      </OpenProjectButton>

      <div className="feature-body">
        <p className="feature-meta"><span>{p.year}</span><span>{p.category}</span></p>
        <h3 className="feature-title">{p.title}</h3>
        <p className="feature-desc">{p.summary}</p>
        <dl className="facts">
          <div><dt className="kicker">Platforms</dt><dd>{p.platforms}</dd></div>
          {p.users ? <div><dt className="kicker">Users</dt><dd>{p.users}</dd></div> : null}
        </dl>
        <ul className="tags">
          {shown.map((t) => <li key={t}>{t}</li>)}
          {hidden.length ? (
            <li className="tag-more">
              <OpenProjectButton projectId={p.id} ariaLabel={`See all ${p.stack.length} technologies`}>+{hidden.length} more</OpenProjectButton>
            </li>
          ) : null}
        </ul>
        <div className="feature-actions">
          <OpenProjectButton projectId={p.id} className="text-link view-project">View project <ArrowRight size={14} /></OpenProjectButton>
          {p.live ? (
            <a className="text-link" href={p.live} target="_blank" rel="noopener noreferrer">Live site <ArrowUpRight /></a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  return (
    <section className="sec" id="projects">
      <div className="wrap">
        <SectionHead id="projects" title="Selected work" lede="Recent projects across web, mobile, AI, and hardware. A few highlights first, then everything else." />
        <div className="features">
          {featuredProjects.map((p) => <FeaturedProject key={p.id} project={p} />)}
        </div>
        <ProjectIndex projects={projects} />
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Wrap the page in the provider and mount Projects** — full `src/app/page.tsx`:

```tsx
import Footer from "@/components/layout/Footer";
import Nav from "@/components/layout/Nav";
import { ProjectDrawerProvider } from "@/components/project/ProjectDrawer";
import ExperienceStrip from "@/components/sections/ExperienceStrip";
import Hero from "@/components/sections/Hero";
import Projects from "@/components/sections/Projects";
import RevealObserver from "@/components/ui/RevealObserver";
import { featuredProjects } from "@/content/projects";

export default function Page() {
  return (
    <ProjectDrawerProvider projects={featuredProjects}>
      <Nav />
      <main>
        <Hero />
        <ExperienceStrip />
        <Projects />
      </main>
      <Footer />
      <RevealObserver />
    </ProjectDrawerProvider>
  );
}
```

- [ ] **Step 6: Verify**

Run: `npm run lint && npm run build && npm run dev`
Expected against the mockup: 3 featured cards (Sellora, Safeship, BMS) with Platforms/Users facts, 4 tags + "+N more", "View project →" and (Sellora, Safeship) "Live site ↗"; clicking the image, "+N more", or "View project" opens the drawer with matching data; Esc, backdrop, and ✕ close it and focus returns to the trigger; Tab stays inside; the page does not shift when the scrollbar hides; the index shows 9 rows with grayscale thumbnails that colour on hover and "More on GitHub ↗" below. Stop the dev server.

- [ ] **Step 7: Commit**

```bash
git add src/components src/app/page.tsx
git commit -m "feat: add featured projects, project index, and detail drawer"
```

---

### Task 6: Services, process, and services band

**Files:**
- Create: `src/components/sections/Services.tsx`, `src/components/sections/Process.tsx`, `src/components/sections/ServicesBand.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `services`, `SERVICE_BAND`, `processSteps`, `PROCESS_NOTE`, `SectionHead`
- Produces: `<Services />`, `<Process />`, `<ServicesBand />`

- [ ] **Step 1: Create `src/components/sections/Services.tsx`**

```tsx
import SectionHead from "@/components/ui/SectionHead";
import { services } from "@/content/services";

export default function Services() {
  return (
    <section className="sec" id="services">
      <div className="wrap">
        <SectionHead id="services" title="What I do" lede="Six ways I help businesses, from the first idea to long after launch." />
        <div className="services">
          {services.map((s) => (
            <article key={s.title} className="service reveal">
              <h3>{s.title}</h3>
              <p>{s.description}</p>
              <p className="kicker">{s.includes.join(" · ")}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `src/components/sections/Process.tsx`**

```tsx
import SectionHead from "@/components/ui/SectionHead";
import { PROCESS_NOTE, processSteps } from "@/content/process";

export default function Process() {
  return (
    <section className="sec" id="process">
      <div className="wrap">
        <SectionHead id="process" title="How I work" lede="Four steps from the first call to a product in your users' hands." />
        <div className="steps-track" aria-hidden="true"><span className="steps-fill" /></div>
        <ol className="steps">
          {processSteps.map((step) => (
            <li key={step.num} className="step reveal">
              <span className="step-num">{step.num}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
              <p className="kicker">{step.time}</p>
            </li>
          ))}
        </ol>
        <p className="kicker steps-note">{PROCESS_NOTE}</p>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create `src/components/sections/ServicesBand.tsx`**

```tsx
import { Fragment } from "react";
import { SERVICE_BAND } from "@/content/services";

/** Decorative divider; the same words are real content in #services, so it is hidden from assistive tech. */
export default function ServicesBand() {
  const run = [...SERVICE_BAND, ...SERVICE_BAND];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {run.map((word, i) => (
          <Fragment key={`${word}-${i}`}>
            <span>{word}</span>
            <i />
          </Fragment>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Mount in `src/app/page.tsx`** — after `<Projects />` add `<Services />` and `<Process />`; add imports:

```tsx
import Process from "@/components/sections/Process";
import Services from "@/components/sections/Services";
```

(`ServicesBand` is mounted in Task 8, where it sits after the Toolkit.)

- [ ] **Step 5: Verify**

Run: `npm run lint && npm run build && npm run dev`
Expected: 6 service cards in a 3×2 grid (2 columns under 900px, 1 under 560px) with the red line drawing across the top on hover; 4 process steps with numbers 01–04 and the red track filling on scroll (Chrome/Edge). Stop the dev server.

- [ ] **Step 6: Commit**

```bash
git add src/components src/app/page.tsx
git commit -m "feat: add services, process, and services band"
```

---

### Task 7: About — photo, bio, stats, experience timeline, certificates

**Files:**
- Create: `src/components/ui/TagList.tsx`, `src/components/sections/RoleBlock.tsx`, `src/components/sections/About.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `site`, `experience`, `Role`, `roleDuration`, `formatRange`, `splitTags`, `ChevronDown`, `ArrowUpRight`, `SectionHead`
- Produces: `TagList({ tags: string[], max?: number })`, `RoleBlock({ role: Role, initialDuration: string })`, `<About />`

- [ ] **Step 1: Create `src/components/ui/TagList.tsx`**

```tsx
"use client";

import { useState } from "react";
import { splitTags } from "@/lib/tags";

/** Shows the first `max` tags; a dashed "+N more" chip reveals the rest in place. */
export default function TagList({ tags, max = 4 }: { tags: string[]; max?: number }) {
  const [expanded, setExpanded] = useState(false);
  const { shown, hidden } = splitTags(tags, max);
  const visible = expanded ? tags : shown;

  return (
    <ul className="tags">
      {visible.map((t) => <li key={t}>{t}</li>)}
      {!expanded && hidden.length ? (
        <li className="tag-more">
          <button type="button" aria-label={`Show ${hidden.length} more skills`} onClick={() => setExpanded(true)}>
            +{hidden.length} more
          </button>
        </li>
      ) : null}
    </ul>
  );
}
```

- [ ] **Step 2: Create `src/components/sections/RoleBlock.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "@/components/icons";
import TagList from "@/components/ui/TagList";
import type { Role } from "@/content/types";
import { formatRange, roleDuration } from "@/lib/duration";

/**
 * Role, dates, summary, collapsible detail, and tags.
 * `initialDuration` comes from the server so hydration matches; current roles then update to today's date.
 */
export default function RoleBlock({ role, initialDuration }: { role: Role; initialDuration: string }) {
  const [open, setOpen] = useState(false);
  const [duration, setDuration] = useState(initialDuration);
  const panelId = `xp-more-${role.id}`;

  useEffect(() => {
    if (!role.end) setDuration(roleDuration(role.start));
  }, [role.start, role.end]);

  return (
    <div className="xp-roleblock">
      <p className="xp-role">{role.role}</p>
      <p className="xp-when kicker">{formatRange(role.start, role.end)} · <span className="xp-dur">{duration}</span></p>
      <p className="xp-desc">{role.summary}</p>
      <div className={`xp-more${open ? " is-open" : ""}`} id={panelId}>
        <div><p className="xp-desc">{role.more}</p></div>
      </div>
      <button className="xp-toggle" type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((o) => !o)}>
        <span>{open ? "Show less" : "Show more"}</span>
        <ChevronDown />
      </button>
      <TagList tags={role.tags} max={4} />
    </div>
  );
}
```

- [ ] **Step 3: Create `src/components/sections/About.tsx`**

```tsx
import Image from "next/image";
import { ArrowUpRight } from "@/components/icons";
import SectionHead from "@/components/ui/SectionHead";
import { experience } from "@/content/experience";
import { site } from "@/content/site";
import { roleDuration } from "@/lib/duration";
import RoleBlock from "./RoleBlock";

export default function About() {
  return (
    <section className="sec" id="about">
      <div className="wrap">
        <SectionHead id="about" title="About me" />
        <div className="about">
          <figure className="about-photo">
            <div className="frame">
              <Image src="/images/profile2.jpg" alt={`Portrait of ${site.name}`} width={1462} height={1425} sizes="(max-width: 860px) 22rem, 33vw" />
            </div>
            <figcaption className="kicker">{site.name} · {site.location}</figcaption>
          </figure>

          <div className="about-body">
            <div className="bio">{site.bio.map((p) => <p key={p}>{p}</p>)}</div>

            <dl className="stats">
              {site.stats.map((s) => (
                <div key={s.label}><dt className="kicker">{s.label}</dt><dd>{s.value}</dd></div>
              ))}
            </dl>

            <h3 className="sub-title">Experience</h3>
            <p className="xp-lede">{site.experienceLede}</p>
            <ol className="xp-list">
              {experience.map((role) => (
                <li key={role.id} className={`xp reveal${role.end ? "" : " is-now"}`}>
                  <span className="xp-mark" aria-hidden="true">{role.mark}</span>
                  <div className="xp-body">
                    <div className="xp-head">
                      <h4 className="xp-org">{role.org}</h4>
                      {role.end ? null : <span className="tl-now">Now</span>}
                    </div>
                    <RoleBlock role={role} initialDuration={roleDuration(role.start, role.end)} />
                  </div>
                </li>
              ))}
              <li className="xp xp-origin reveal">
                <span className="xp-mark" aria-hidden="true">&lt;/&gt;</span>
                <div className="xp-body">
                  <h4 className="xp-org">Wrote my first line of code</h4>
                  <p className="xp-when kicker">Sep 2019 · Hello, world</p>
                </div>
              </li>
            </ol>

            <h3 className="sub-title">Certificates</h3>
            <div className="certs">
              {site.certificates.map((c) => (
                <a key={c.label} className="text-link" href={c.href} target="_blank" rel="noopener noreferrer">{c.label} <ArrowUpRight /></a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Mount in `src/app/page.tsx`** — after `<Process />` add `<About />`; import `About from "@/components/sections/About"`.

- [ ] **Step 5: Verify**

Run: `npm run lint && npm run build && npm run dev`
Expected: grayscale photo (colour on hover, sticky beside the text on desktop); stats row; 4 roles with initials boxes joined by a line, red boxes/dots on the two current roles, correct durations (LEAD shows today's month count); "Show more" slides the second paragraph open and flips to "Show less"; tags show 4 + "+2 more" (Pru Life UK shows all 5); certificates list. Stop the dev server.

- [ ] **Step 6: Commit**

```bash
git add src/components src/app/page.tsx
git commit -m "feat: add about section with experience timeline"
```

---

### Task 8: Toolkit tiles, stack list, band placement, testimonial gate

**Files:**
- Create: `src/components/effects/TechTiles.tsx`, `src/components/sections/Toolkit.tsx`, `src/components/sections/Testimonial.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `techTiles` (Task 1), `stackGroups`, `testimonials`, `SectionHead`, `ServicesBand` (Task 6)
- Produces: `<TechTiles />`, `<Toolkit />`, `<Testimonial />` (renders `null` when nothing is approved)

- [ ] **Step 1: Create `src/components/effects/TechTiles.tsx`**

```tsx
"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { techTiles } from "@/content/stack-icons";

const GAP = 7;
const SIZE = 1.6;
const SPEED = 0.38; // px per ms the reveal wave travels
const EDGE = 36; // px over which a dot fades in behind the wave front
const LIFT = 14; // matches the logo's hover lift, so the wave starts at the logo

type Dot = { x: number; y: number; base: number; ph: number; sp: number; dist: number };

export default function TechTiles() {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: Array<() => void> = [];

    list.querySelectorAll<HTMLLIElement>(".tile").forEach((tile) => {
      const cv = tile.querySelector("canvas");
      const ctx = cv?.getContext("2d");
      if (!cv || !ctx) return;
      let dots: Dot[] = [];
      let w = 0;
      let h = 0;
      let color = "";
      let size = SIZE;
      let boost = 1;
      let running = false;
      let raf = 0;
      let t0 = 0;
      let stopTimer: number | undefined;

      const build = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = tile.clientWidth;
        h = tile.clientHeight;
        cv.width = Math.round(w * dpr);
        cv.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        dots = [];
        for (let y = GAP / 2; y < h; y += GAP) {
          const fall = Math.max(0, 1 - y / (h * 0.85));
          for (let x = GAP / 2; x < w; x += GAP) {
            if (Math.random() > 0.2 + fall * 0.8) continue;
            dots.push({
              x, y,
              base: fall * (0.3 + Math.random() * 0.7),
              ph: Math.random() * 6.283,
              sp: 0.8 + Math.random() * 2.4,
              dist: Math.hypot(x - w / 2, y - (h / 2 - LIFT)) + Math.random() * 55,
            });
          }
        }
      };

      const draw = (t: number) => {
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = color;
        const front = (t - t0) * SPEED;
        for (const d of dots) {
          const p = still ? 1 : Math.min(1, Math.max(0, (front - d.dist) / EDGE));
          if (p <= 0) continue;
          const twinkle = still ? 1 : 0.3 + 0.7 * (0.5 + 0.5 * Math.sin((t / 1000) * d.sp + d.ph));
          const flash = p * (1 - p) * 1.4 * (0.25 + d.base);
          ctx.globalAlpha = Math.min(1, (d.base * twinkle * p + flash) * boost);
          ctx.fillRect(d.x, d.y, size, size);
        }
        ctx.globalAlpha = 1;
        if (running && !still) raf = requestAnimationFrame(draw);
      };

      const onEnter = () => {
        window.clearTimeout(stopTimer);
        const cs = getComputedStyle(cv);
        color = cs.color;
        size = parseFloat(cs.getPropertyValue("--dot-size")) || SIZE;
        boost = parseFloat(cs.getPropertyValue("--dot-alpha")) || 1;
        if (!dots.length || Math.abs(tile.clientWidth - w) > 1) build();
        running = true;
        t0 = performance.now();
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(draw);
      };
      const onLeave = () => {
        stopTimer = window.setTimeout(() => {
          running = false;
          cancelAnimationFrame(raf);
        }, 550);
      };

      tile.addEventListener("mouseenter", onEnter);
      tile.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        tile.removeEventListener("mouseenter", onEnter);
        tile.removeEventListener("mouseleave", onLeave);
        cancelAnimationFrame(raf);
        window.clearTimeout(stopTimer);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <ul className="tiles" aria-label="Core technologies" ref={listRef}>
      {techTiles.map((t) => (
        <li key={t.name} className="tile reveal" style={{ "--brand": t.brand } as CSSProperties}>
          <canvas className="tile-dots" aria-hidden="true" />
          <svg className="tile-logo" viewBox="0 0 24 24" aria-hidden="true"><path d={t.path} /></svg>
          <span className="tile-name">{t.name}</span>
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 2: Create `src/components/sections/Toolkit.tsx`**

```tsx
import TechTiles from "@/components/effects/TechTiles";
import SectionHead from "@/components/ui/SectionHead";
import { stackGroups } from "@/content/stack";

export default function Toolkit() {
  return (
    <section className="sec" id="stack">
      <div className="wrap">
        <SectionHead id="stack" title="Toolkit" lede="The languages, frameworks, and services I reach for, grouped the way I use them." />
      </div>
      <div className="wrap">
        <TechTiles />
      </div>
      <div className="wrap">
        <dl className="stack-grid">
          {stackGroups.map((g) => (
            <div key={g.label} className="stack-row">
              <dt className="kicker">{g.label}</dt>
              <dd><ul>{g.items.map((item) => <li key={item}>{item}</li>)}</ul></dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create `src/components/sections/Testimonial.tsx`**

```tsx
import { testimonials } from "@/content/testimonials";

/** Renders the first approved quote; renders nothing until a client has approved one. */
export default function Testimonial() {
  const quote = testimonials.find((t) => t.approved);
  if (!quote) return null;

  return (
    <section className="sec" id="testimonials">
      <div className="wrap">
        <figure className="quote reveal">
          <div className="quote-top">
            <p className="label"><b>#</b>testimonials</p>
          </div>
          <span className="quote-mark" aria-hidden="true">“</span>
          <blockquote>{quote.quote}</blockquote>
          <figcaption>
            <strong>{quote.name}</strong> · {quote.role}
            <span className="quote-project">{quote.project}</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Mount in `src/app/page.tsx`** — after `<About />` add, in order, `<Toolkit />`, `<ServicesBand />`, `<Testimonial />`; add imports:

```tsx
import ServicesBand from "@/components/sections/ServicesBand";
import Testimonial from "@/components/sections/Testimonial";
import Toolkit from "@/components/sections/Toolkit";
```

- [ ] **Step 5: Verify the gate works both ways**

Run: `npm run build && npm run dev`
Expected: toolkit shows 6×2 tiles (4 cols tablet, 3 phone); hovering a tile fills the logo in brand colour, shows the name, and ripples dots out from the logo; light mode shows grey silhouettes and the faint brand tint. The band scrolls between Toolkit and Contact position. **No testimonial section renders.** Temporarily set `approved: true` in `testimonials.ts`, confirm the quote renders like the mockup (without the draft tag), then set it back to `false` and confirm `npm test` passes. Stop the dev server.

- [ ] **Step 6: Commit**

```bash
git add src/components src/app/page.tsx
git commit -m "feat: add toolkit tiles, stack list, and approval-gated testimonial"
```

---

### Task 9: Contact — email link, form, Server Action with Resend

**Files:**
- Create: `src/lib/budgets.ts`, `src/lib/inquiry.ts`, `src/lib/rate-limit.ts`, `src/app/actions/contact.ts`, `src/components/sections/EmailLink.tsx`, `src/components/sections/ContactForm.tsx`, `src/components/sections/Contact.tsx`, `.env.example`
- Modify: `src/styles/contact.css` (append form states), `src/app/page.tsx`
- Test: `src/lib/inquiry.test.ts`, `src/lib/rate-limit.test.ts`, `src/app/actions/contact.test.ts`

**Interfaces:**
- Consumes: `site`, `DotField` (Task 4), `ArrowRight`
- Produces: `BUDGETS: readonly { value: BudgetValue; label: string }[]`, `budgetLabel(v: string): string`; `inquirySchema`, `type Inquiry`, `formDataToObject(fd: FormData): Record<string, string>`, `formatInquiryEmail(i: Inquiry): { subject: string; text: string; html: string }`, `escapeHtml(s: string): string`; `createRateLimiter(opts: { limit: number; windowMs: number; now?: () => number }): (key: string) => boolean`; `sendInquiry(prev: InquiryState, fd: FormData): Promise<InquiryState>`, `type InquiryState = { status: "idle" | "success" | "error"; message?: string; fieldErrors?: Partial<Record<InquiryField, string>> }`

- [ ] **Step 1: Create `src/lib/budgets.ts`** (no zod, safe for the client bundle)

```ts
export const BUDGETS = [
  { value: "unsure", label: "Not sure yet" },
  { value: "5-25k", label: "$5k – $25k" },
  { value: "25-50k", label: "$25k – $50k" },
  { value: "50-100k", label: "$50k – $100k" },
  { value: "100k+", label: "$100k+" },
] as const;

export type BudgetValue = (typeof BUDGETS)[number]["value"];

export function budgetLabel(value: string): string {
  return BUDGETS.find((b) => b.value === value)?.label ?? "Not sure yet";
}
```

- [ ] **Step 2: Write the failing inquiry and rate-limit tests**

`src/lib/inquiry.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { escapeHtml, formatInquiryEmail, formDataToObject, inquirySchema } from "./inquiry";

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
```

`src/lib/rate-limit.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { createRateLimiter } from "./rate-limit";

describe("createRateLimiter", () => {
  it("allows `limit` hits per window per key, then blocks", () => {
    let t = 0;
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
```

- [ ] **Step 3: Run to verify failure**

Run: `npm test -- src/lib/inquiry.test.ts src/lib/rate-limit.test.ts`
Expected: FAIL — cannot resolve `./inquiry` and `./rate-limit`.

- [ ] **Step 4: Implement `src/lib/inquiry.ts`**

```ts
import { z } from "zod";
import { BUDGETS, budgetLabel } from "./budgets";

const budgetValues = BUDGETS.map((b) => b.value) as [string, ...string[]];

export const inquirySchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(120, "That name is too long."),
  email: z.string().trim().max(200).email("Please enter a valid email address."),
  company: z.string().trim().max(160).optional().default(""),
  timeline: z.string().trim().max(160).optional().default(""),
  project: z.string().trim().min(1, "Tell me what kind of project it is.").max(200, "Keep the project type short."),
  budget: z.enum(budgetValues).catch("unsure"),
  message: z.string().trim().min(10, "Add a few details about the project (at least 10 characters).").max(5000, "That message is too long."),
});

export type Inquiry = z.infer<typeof inquirySchema>;

export function formDataToObject(fd: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  fd.forEach((value, key) => {
    if (typeof value === "string") out[key] = value;
  });
  return out;
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

export function formatInquiryEmail(i: Inquiry): { subject: string; text: string; html: string } {
  const budget = budgetLabel(i.budget);
  const rows: Array<[string, string]> = [
    ["Name", i.name],
    ["Email", i.email],
    ["Company", i.company || "—"],
    ["Project type", i.project],
    ["Budget", budget],
    ["Ideal timeline", i.timeline || "—"],
  ];
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${i.message}\n`;
  const html = `<table cellpadding="4">${rows
    .map(([k, v]) => `<tr><td><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(v)}</td></tr>`)
    .join("")}</table><p style="white-space:pre-wrap">${escapeHtml(i.message)}</p>`;
  return { subject: oneLine(`New inquiry: ${i.project} · ${budget}`), text, html };
}
```

- [ ] **Step 5: Implement `src/lib/rate-limit.ts`**

```ts
/**
 * Sliding-window limiter kept in memory. On serverless hosts this is per instance,
 * so it is a first line of defence, not a guarantee.
 */
export function createRateLimiter({ limit, windowMs, now = () => Date.now() }: { limit: number; windowMs: number; now?: () => number }) {
  const hits = new Map<string, number[]>();

  return function allow(key: string): boolean {
    const t = now();
    const recent = (hits.get(key) ?? []).filter((at) => t - at < windowMs);
    if (recent.length >= limit) {
      hits.set(key, recent);
      return false;
    }
    recent.push(t);
    hits.set(key, recent);
    if (hits.size > 1000) {
      for (const [k, times] of hits) if (times.every((at) => t - at >= windowMs)) hits.delete(k);
    }
    return true;
  };
}
```

- [ ] **Step 6: Run to verify the lib tests pass**

Run: `npm test -- src/lib/inquiry.test.ts src/lib/rate-limit.test.ts`
Expected: PASS.

- [ ] **Step 7: Write the failing action tests** — `src/app/actions/contact.test.ts`

```ts
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

  it("rate-limits repeated submissions from one connection", async () => {
    for (let i = 0; i < 5; i++) expect((await sendInquiry(idle, form())).status).toBe("success");
    const blocked = await sendInquiry(idle, form());
    expect(blocked.status).toBe("error");
    expect(blocked.message).toMatch(/too many/i);
  });
});
```

- [ ] **Step 8: Run to verify failure**

Run: `npm test -- src/app/actions/contact.test.ts`
Expected: FAIL — cannot resolve `./contact`.

- [ ] **Step 9: Implement `src/app/actions/contact.ts`**

```ts
"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";
import { formDataToObject, formatInquiryEmail, inquirySchema } from "@/lib/inquiry";
import { createRateLimiter } from "@/lib/rate-limit";

export type InquiryField = "name" | "email" | "company" | "timeline" | "project" | "budget" | "message";

export type InquiryState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<InquiryField, string>>;
};

const FROM = "Portfolio <onboarding@resend.dev>";
const SUCCESS = "Thanks, your message is on its way. I'll reply within a day.";
const NOT_CONFIGURED = "The form isn't available right now. Please email me directly at jamesivangabarda8@gmail.com.";
const SEND_FAILED = "Your message couldn't be sent. Please try again, or email me directly at jamesivangabarda8@gmail.com.";
const TOO_MANY = "Too many messages from your connection. Please try again in a few minutes, or email me directly.";

const allow = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

export async function sendInquiry(_prev: InquiryState, formData: FormData): Promise<InquiryState> {
  const raw = formDataToObject(formData);

  // Honeypot: humans never see this field. Pretend it worked so bots do not retry.
  if (raw.website) return { status: "success", message: SUCCESS };

  const ip = ((await headers()).get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (!allow(ip)) return { status: "error", message: TOO_MANY };

  const parsed = inquirySchema.safeParse(raw);
  if (!parsed.success) {
    const errors = z.flattenError(parsed.error).fieldErrors as Partial<Record<InquiryField, string[]>>;
    const fieldErrors: Partial<Record<InquiryField, string>> = {};
    for (const [field, messages] of Object.entries(errors)) {
      if (messages?.[0]) fieldErrors[field as InquiryField] = messages[0];
    }
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    console.error("Contact form: RESEND_API_KEY or CONTACT_TO_EMAIL is not set.");
    return { status: "error", message: NOT_CONFIGURED };
  }

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: FROM,
      to,
      replyTo: parsed.data.email,
      ...formatInquiryEmail(parsed.data),
    });
    if (error) {
      console.error("Contact form: Resend returned an error", error);
      return { status: "error", message: SEND_FAILED };
    }
  } catch (err) {
    console.error("Contact form: Resend request failed", err);
    return { status: "error", message: SEND_FAILED };
  }

  return { status: "success", message: SUCCESS };
}
```

- [ ] **Step 10: Run to verify the action tests pass**

Run: `npm test`
Expected: PASS (all suites).

- [ ] **Step 11: Append form states to `src/styles/contact.css`**

```css

/* Form states (not in the mockup: its form was a visual prototype). */
.hp { position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden; }
.field-error { margin: 0; font-size: 0.8rem; color: var(--accent-ink); }
.field input[aria-invalid="true"],
.field textarea[aria-invalid="true"] { border-color: var(--accent); }
.btn[disabled] { opacity: 0.6; cursor: progress; transform: none; }
```

- [ ] **Step 12: Create `src/components/sections/EmailLink.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

/** mailto link that also copies the address, for visitors with no mail app set up. */
export default function EmailLink({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onClick = () => {
    if (!navigator.clipboard?.writeText) return;
    navigator.clipboard.writeText(email).then(
      () => {
        setCopied(true);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setCopied(false), 3500);
      },
      () => {},
    );
  };

  return (
    <>
      <a className="email email-link" href={`mailto:${email}?subject=Project%20inquiry`} onClick={onClick}>{email}</a>
      <p className={`copied-note${copied ? " is-on" : ""}`} role="status" aria-live="polite">
        {copied ? "Address copied, in case your email app didn’t open" : ""}
      </p>
    </>
  );
}
```

- [ ] **Step 13: Create `src/components/sections/ContactForm.tsx`**

```tsx
"use client";

import { Fragment, startTransition, useActionState, useEffect, useRef } from "react";
import { sendInquiry, type InquiryField, type InquiryState } from "@/app/actions/contact";
import { ArrowRight } from "@/components/icons";
import { BUDGETS } from "@/lib/budgets";

const initial: InquiryState = { status: "idle" };

export default function ContactForm() {
  const [state, action, pending] = useActionState(sendInquiry, initial);
  const formRef = useRef<HTMLFormElement>(null);

  // Submitted manually so a failed submission keeps what the visitor typed; clear only on success.
  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state]);

  const err = (field: InquiryField) => state.fieldErrors?.[field];
  const invalid = (field: InquiryField) => (err(field) ? { "aria-invalid": true, "aria-describedby": `cf-${field}-error` } : {});
  const errorText = (field: InquiryField) =>
    err(field) ? <p className="field-error" id={`cf-${field}-error`}>{err(field)}</p> : null;

  return (
    <form
      ref={formRef}
      className="form"
      id="contact-form"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => action(data));
      }}
    >
      <div className="hp" aria-hidden="true">
        <label htmlFor="cf-website">Website</label>
        <input id="cf-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="form-row">
        <div className="field">
          <label className="kicker" htmlFor="cf-name">Your name<span className="req" aria-hidden="true">*</span></label>
          <input id="cf-name" name="name" type="text" autoComplete="name" placeholder="Jane Cruz" required {...invalid("name")} />
          {errorText("name")}
        </div>
        <div className="field">
          <label className="kicker" htmlFor="cf-email">Email<span className="req" aria-hidden="true">*</span></label>
          <input id="cf-email" name="email" type="email" autoComplete="email" placeholder="jane@company.com" required {...invalid("email")} />
          {errorText("email")}
        </div>
      </div>

      <div className="form-row">
        <div className="field">
          <label className="kicker" htmlFor="cf-company">Company</label>
          <input id="cf-company" name="company" type="text" autoComplete="organization" placeholder="Optional" />
        </div>
        <div className="field">
          <label className="kicker" htmlFor="cf-timeline">Ideal timeline</label>
          <input id="cf-timeline" name="timeline" type="text" placeholder="e.g. Next month, Q1 2027, flexible" />
        </div>
      </div>

      <div className="field">
        <label className="kicker" htmlFor="cf-project">Project type<span className="req" aria-hidden="true">*</span></label>
        <input id="cf-project" name="project" type="text" placeholder="e.g. Sales dashboard, booking app, AI chatbot" required {...invalid("project")} />
        {errorText("project")}
      </div>

      <fieldset className="choice">
        <legend className="kicker">Budget</legend>
        <div className="pills">
          {BUDGETS.map((b, i) => (
            <Fragment key={b.value}>
              <input type="radio" id={`cf-budget-${i}`} name="budget" value={b.value} defaultChecked={i === 0} />
              <label htmlFor={`cf-budget-${i}`}>{b.label}</label>
            </Fragment>
          ))}
        </div>
      </fieldset>

      <div className="field">
        <label className="kicker" htmlFor="cf-msg">About the project<span className="req" aria-hidden="true">*</span></label>
        <textarea id="cf-msg" name="message" placeholder="What are you building, who is it for, and what would a great result look like?" required minLength={10} {...invalid("message")} />
        {errorText("message")}
      </div>

      <div className="form-foot">
        <button className="btn btn-primary" type="submit" disabled={pending}>
          {pending ? "Sending…" : <>Send message <ArrowRight /></>}
        </button>
      </div>

      {state.message ? <p className="form-note" role="status">{state.message}</p> : null}
    </form>
  );
}
```

- [ ] **Step 14: Create `src/components/sections/Contact.tsx`**

```tsx
import DotField from "@/components/effects/DotField";
import { site } from "@/content/site";
import ContactForm from "./ContactForm";
import EmailLink from "./EmailLink";

export default function Contact() {
  return (
    <section className="sec contact" id="contact">
      <DotField />
      <div className="wrap">
        <p className="label"><b>#</b>contact</p>
        <h2 className="contact-title">Let&apos;s build<br />something<em>.</em></h2>

        <div className="contact-grid">
          <div className="contact-info">
            <div>
              <p className="kicker">Email</p>
              <EmailLink email={site.email} />
              <p className="note">Tell me what you&apos;re building. I usually reply within a day.</p>
            </div>
            <div>
              <p className="kicker">Elsewhere</p>
              <ul className="socials">
                {site.socials.map((s) => (
                  <li key={s.label}>
                    <a className="text-link" href={s.href} {...(s.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{s.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 15: Create `.env.example`**

```bash
# Resend API key (https://resend.com/api-keys). The account must be registered with CONTACT_TO_EMAIL,
# because the onboarding@resend.dev test sender only delivers to the account owner.
RESEND_API_KEY=
CONTACT_TO_EMAIL=jamesivangabarda8@gmail.com
```

- [ ] **Step 16: Mount in `src/app/page.tsx`** — after `<Testimonial />` add `<Contact />`; import `Contact from "@/components/sections/Contact"`.

- [ ] **Step 17: Verify end to end**

Run: `npm test && npm run lint && npm run build`
Expected: all pass. Then with a real key in `.env.local` (`RESEND_API_KEY=re_…`, `CONTACT_TO_EMAIL=jamesivangabarda8@gmail.com`), run `npm run dev`, submit the form, and confirm: button shows "Sending…", success note appears, the form clears, and the email arrives with the right subject and Reply-To. Submit with an invalid email (bypass the browser check by typing `a@b`) and confirm the inline error shows and the other fields keep their values. Remove the key, restart, submit, and confirm the "email me directly" message. Clicking the email address opens the mail app and shows "Address copied…". Stop the dev server.

- [ ] **Step 18: Commit**

```bash
git add src .env.example
git commit -m "feat: add contact section with Resend-backed inquiry form"
```

---

### Task 10: Full verification against the mockup and open the PR

**Files:**
- Modify: `docs/superpowers/specs/2026-09-28-portfolio-redesign-design.md` (mark the nav CTA as confirmed)

**Interfaces:**
- Consumes: everything above.
- Produces: pushed branch `feat/portfolio-redesign` and a PR into `main`.

- [ ] **Step 1: Mark the nav label as confirmed in the spec**

In §10 replace the "Nav CTA label" bullet with:

```markdown
- **Nav CTA label:** "Hire me" (confirmed by the owner on 2026-09-28).
```

- [ ] **Step 2: Clean check**

Run: `npm test && npm run lint && npm run build`
Expected: all green; no TypeScript errors; `/` is static.

- [ ] **Step 3: Visual pass against the mockup**

Run `npm run dev` and open the mockup (`mockups/jigstack-redesign.html`) side by side. At **1440px, 820px, and 390px**, in **light and dark**, walk every section top to bottom and fix any visual difference in `src/styles/*.css` or the matching component. Checklist:
- nav (active link follows scroll, clears on hero/contact; progress line in Chrome), hero (load sequence, clock, dot field), strip
- featured cards, drawer (open/close paths, tab trap, focus restore, no layout shift), index (thumb hover), "More on GitHub" below the list
- services grid, process line, about (sticky photo, Show more, tags), toolkit tiles (ripple, light-mode silhouettes), band, contact (dot field, form states)
- **Reduced motion** (OS setting on): no autonomous motion; all content visible immediately.
- **Keyboard only**: every control reachable with visible focus.

Commit any fixes:

```bash
git add -A src docs
git commit -m "fix: align redesign details with the approved mockup"
```

- [ ] **Step 4: Push once and open the PR**

```bash
git push -u origin feat/portfolio-redesign
gh pr create --base main --head feat/portfolio-redesign --title "Portfolio redesign: single-page monochrome + crimson site" --body-file - <<'EOF'
## Summary
- Replaces the multi-route, three.js portfolio with the approved single-page redesign (spec: docs/superpowers/specs/2026-09-28-portfolio-redesign-design.md, mockup: mockups/jigstack-redesign.html).
- Light and dark themes with no flash on load, scroll reveals, project detail drawer, toolkit logo tiles, ambient dot fields; all respect reduced motion.
- Content lives in typed files under src/content, so cards, drawer, and index share one source.
- Contact form sends inquiries through Resend (Server Action, zod validation, honeypot, rate limit).

## Before merging
- Add RESEND_API_KEY and CONTACT_TO_EMAIL in Vercel (Production and Preview). The Resend account must be registered with jamesivangabarda8@gmail.com.
- Confirm these unverified phrases: BMS "works without an internet connection", Sellora "Notebook Capture" wording, Pru Life UK "kept the site maintained through the rest of the internship".
- The LGU testimonial is hidden until approved (src/content/testimonials.ts, approved: false).

## Test plan
- [ ] npm test, npm run lint, npm run build pass
- [ ] Visual check against the mockup at 1440 / 820 / 390px in light and dark
- [ ] Reduced-motion and keyboard-only passes
- [ ] Contact form: success email received with Reply-To, validation errors, missing-key message
EOF
```

Expected: PR URL printed. Share it with the user; do not merge.
