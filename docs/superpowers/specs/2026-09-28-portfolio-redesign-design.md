# Portfolio Redesign — Design Spec

- **Date:** 2026-09-28
- **Branch:** `feat/portfolio-redesign` (cut from `main`)
- **Visual source of truth:** `mockups/jigstack-redesign.html` (approved after iteration). When this spec and the mockup disagree on anything visual, the mockup wins; when they disagree on behaviour or architecture, this spec wins.

## 1. Goal

Replace the current multi-route, three.js-backed portfolio with the approved single-page redesign: monochrome + crimson, light/dark themes, restrained motion, and copy aimed at winning client projects. The port must match the mockup visually at desktop, tablet, and phone widths, in both themes, and add the one thing the mockup fakes: a working contact form that emails inquiries via Resend.

**Success criteria**

1. Every mockup section renders in Next.js with matching layout, type, spacing, and colour in both themes.
2. Theme follows the OS by default, remembers an explicit choice, and never flashes the wrong theme on load.
3. All motion honours `prefers-reduced-motion`.
4. Submitting the contact form delivers an email to `jamesivangabarda8@gmail.com` with Reply-To set to the sender.
5. `npm run lint` and `npm run build` pass with no errors.
6. Nothing unapproved ships: draft content (see §10) is hidden in production.

## 2. Scope

**In:** all sections in the mockup, the project detail drawer, theme system, scroll reveals and effects, contact form with Resend, metadata/title, image cleanup.

**Out:** case-study pages per project, blog, analytics, OG image generation, CMS, i18n, the unused `/api/github-heatmap` route (left untouched).

## 3. Page structure (single page, in order)

| Anchor | Section | Notes |
|---|---|---|
| `#home` | Hero | Status pill, giant name, lede, meta (Based in · live local time · Now · Focus), CTAs, ambient dot field |
| — | Experience strip | "Experience at" + 4 employer names |
| `#projects` | Selected work | 3 featured projects (Sellora, Safeship, BMS) + "Projects at a glance" index + "More on GitHub" below |
| `#services` | What I do | 6-card grid, service-focused copy, "includes" line per card |
| `#process` | How I work | 4 numbered steps, scroll-linked red line |
| `#about` | About me | Sticky grayscale photo, bio, stats, Experience timeline with "Show more", certificates |
| `#stack` | Toolkit | 6×2 logo tiles (dot ripple on hover) + grouped stack list |
| — | Services band | Outlined marquee of service names |
| `#testimonials` | Testimonial | Rendered only when approved (§10) |
| `#contact` | Contact | Heading, mailto email, socials incl. WhatsApp/Viber deep links, form, ambient dot field |
| — | Footer | Wordmark, copyright, back to top |

Nav: Projects · Services · Process · About · Stack · Contact + theme toggle + primary CTA. Collapses to a menu below 960px. Active link tracks the section in view; sections without a nav link clear it.

## 4. Architecture

Server components by default; `"use client"` only where there is state, effects, or browser APIs.

```
src/
├── app/
│   ├── layout.tsx            fonts, metadata, no-flash theme script, providers
│   ├── page.tsx              composes the sections (server component)
│   ├── globals.css           tokens (light + dark), Tailwind v4 @theme mapping, base + effect CSS
│   └── actions/contact.ts    "use server" — validates and sends via Resend
├── content/                  typed data, the single source for every repeated fact
│   ├── site.ts               name, title, email, socials, CV link, location, timezone
│   ├── projects.ts           featured + index projects (drawer data lives here too)
│   ├── experience.ts         roles, dates, summaries, details, tags
│   ├── services.ts           six services
│   ├── process.ts            four steps
│   ├── stack.ts              logo tiles + grouped stack rows
│   └── testimonials.ts       quotes with an `approved` flag
├── components/
│   ├── layout/               Nav, MobileMenu, ThemeToggle, ScrollProgress, Footer
│   ├── sections/             Hero, ExperienceStrip, Projects, ProjectIndex, Services,
│   │                         Process, About, ExperienceTimeline, Toolkit, ServicesBand,
│   │                         Testimonial, Contact, ContactForm
│   ├── project/              ProjectDrawer, ProjectDrawerProvider (open from anywhere)
│   ├── effects/              DotField (ambient canvas), TechTile (hover ripple canvas)
│   └── ui/                   Reveal/Stagger, SectionHead, TagList (+N more), TextLink, Button
└── lib/
    ├── motion.ts             shared framer-motion variants + viewport config (once: true)
    ├── theme.ts              read/apply/persist theme, View Transition reveal
    ├── duration.ts           inclusive-month durations ("1 yr 4 mos")
    └── utils.ts              cn()
```

**Dependencies:** add `resend` and `zod`; remove `three`, `@fontsource/anton`, `@fontsource/secular-one`, and `react-icons` (icons become inline SVG, fonts come from `next/font`). Everything else (`next`, `react`, `framer-motion`, `tailwindcss`, `clsx`, `tailwind-merge`) stays.

**Why content files:** during iteration the featured cards, drawer, and index drifted apart (mismatched tags, a wrong framework, a wrong project type). Rendering all three from one `projects.ts` entry makes that class of bug impossible. Card tags are the first 4 of the project's `stack` array; "+N more" and the drawer read the same array.

## 5. Theming

- Tokens are CSS custom properties copied from the mockup: bare `:root` holds the light palette; dark is defined under `@media (prefers-color-scheme: dark) :root:not([data-theme="light"])` and again under `:root[data-theme="dark"]`, with `color-scheme` set in each.
- Tailwind v4 `@theme inline` maps tokens to utilities (`bg-bg`, `bg-bg-2`, `text-fg`, `text-fg-2`, `border-line`, `text-accent-ink`, …) so components use utilities, not hex values.
- A tiny inline script in `<head>` applies a saved `jigstack-theme` from `localStorage` before first paint (try/catch; no saved value → system). `<html suppressHydrationWarning>`.
- The toggle uses `document.startViewTransition` with a circular clip reveal from the button; instant swap when unsupported or reduced motion.

## 6. Typography

`next/font/google`: **Anton** (display: hero name, section titles, contact heading, wordmark, stats), **Geist** (body), **Geist Mono** (labels, meta, tags). Exposed as `--font-display`, `--font-body`, `--font-mono`. The type scale is the mockup's clamp() values, kept as tokens.

## 7. Motion

| Effect | Implementation |
|---|---|
| Hero load (name rise, period drop, fade-ups) | framer-motion `initial`/`animate` with delays |
| Scroll reveals (fade + 24px rise, once, 70ms stagger capped at 6) | `Reveal`/`Stagger` using `whileInView`, `viewport={{ once: true, margin: "0px 0px -12% 0px" }}` |
| Project drawer slide + content stagger | `AnimatePresence`; focus trap, Esc/backdrop close, focus restore, scroll lock without layout shift |
| Experience "Show more" | height `auto` animation via framer-motion; hidden content is `inert` when closed |
| Theme reveal | View Transitions API (§5) |
| Marquee, status ping, process line, scroll progress | CSS (`@keyframes`, `animation-timeline` where supported; static fallback) |
| Tile ripple + ambient dot fields | `<canvas>` in client components; animate only while visible (IntersectionObserver), ~25fps for ambient, DPR capped at 2 |

`<MotionConfig reducedMotion="user">` wraps the app; CSS effects have `prefers-reduced-motion` guards. Content is never left hidden if JS fails (reveals start from rendered HTML; SSR output is fully readable).

## 8. Contact form (Resend)

- **Transport:** Server Action `sendInquiry(formData)` in `src/app/actions/contact.ts` using the `resend` SDK. `useActionState` drives pending / success / error UI; the submit button shows "Sending…" while pending.
- **Fields:** name*, email*, company, ideal timeline, project type*, budget (pills: Not sure yet, $5k–$25k, $25k–$50k, $50k–$100k, $100k+), message*.
- **Validation:** `zod` on the server (lengths capped, email format); inline field errors returned to the client.
- **Spam:** hidden honeypot field (silently "succeeds" if filled) plus a per-IP limit of 5 submissions per 10 minutes. The limit is in-memory, so it is per server instance; acceptable as a first layer. Upgrade path noted: Upstash Ratelimit or Cloudflare Turnstile if spam appears.
- **Email:** from `Portfolio <onboarding@resend.dev>` (Resend's test sender, which may only deliver to the account owner — exactly our case), to `CONTACT_TO_EMAIL`, `replyTo` = submitter, subject `New inquiry: {project type} · {budget}`, plain-text + simple HTML body listing every field.
- **Resend account:** because the test sender only delivers to the account owner, the Resend account must be registered with `jamesivangabarda8@gmail.com` (the same address as `CONTACT_TO_EMAIL`). Sending from a custom domain is a later upgrade and not required.
- **Env vars:** `RESEND_API_KEY`, `CONTACT_TO_EMAIL`. Documented in `.env.example`; set in Vercel. Missing key → the action returns a clear error and logs it; the page still renders.
- **Drawer hand-off:** "Start a project" in the drawer closes it, scrolls to `#contact`, pre-fills Project type with "Something like {project}" only if empty, and focuses Name.

## 9. Images & assets

- Rename `public/images/Sellora Mobile.png` → `sellora-mobile.png` (spaces in public paths are fragile), and update the mockup to the new path so it keeps rendering.
- All project/profile images via `next/image` with explicit `sizes`; featured images `object-cover` with per-image `objectPosition` where the mockup sets one (Sellora, BMS: `center`).
- Tech logos: inline SVG paths (Simple Icons, CC0) stored in `stack.ts`, so the tiles can switch outline ↔ brand fill.
- `next.config.ts`: drop the deprecated `images.domains` block (no remote images remain; certificates are plain links).
- Favicon: keep `logo.png`.

## 10. Content rules for production

- **Testimonial:** the LGU quote is a draft. `testimonials.ts` entries carry `approved: boolean`; the section renders only approved quotes and is omitted entirely when there are none. The draft ships with `approved: false`.
- **Unconfirmed phrases** kept as the mockup has them, flagged for the user in the PR description: BMS "works without an internet connection", Sellora "Notebook Capture" wording, Pru Life "kept the site maintained…".
- **Nav CTA label:** ships as "Hire me" (as in the mockup). "Start a project" was discussed as an alternative; a one-word change in `site.ts` if chosen.
- Mockup-only affordances do not ship: placeholder tags, "Add number" chips, the mockup's fake form confirmation.

## 11. Removals

Old routes `src/app/home`, `projects`, `services`, `stacks` (their content becomes sections), `src/app/components/*` (Navbar, Footer, About, Inquiry, CVModalProvider, LiquidEther), the `three` dependency, the Font Awesome CDN link, and the `user-select: none` body rule (visitors must be able to select text).

## 12. Accessibility & performance

Semantic landmarks and headings in order; visible focus rings; every icon-only control labelled; drawer is a proper modal dialog; nav `aria-current`; colour contrast per the mockup's measured tokens (small red text uses `--accent-ink`). Only above-the-fold images are `priority`; canvases pause off-screen; no layout shift from fonts (next/font) or scroll lock.

## 13. Verification

1. `npm run lint` and `npm run build` clean.
2. Manual pass at 1440px, 820px, and 390px, in light and dark, against the mockup section by section.
3. Reduced-motion pass (OS setting): no autonomous motion, all content visible.
4. Keyboard pass: nav, theme toggle, drawer (open, tab-trap, Esc, focus restore), Show more, form.
5. Contact form: success path with a real Resend test key; validation errors; honeypot; missing-key error state.

## 14. Delivery

Work on `feat/portfolio-redesign`, commit in logical steps, push once when ready and open a PR into `main` (Vercel deploys a preview for the PR; avoid repeated pushes). The pre-existing `responsive-refactor` edits are preserved in `stash@{0}` and are not part of this branch.
