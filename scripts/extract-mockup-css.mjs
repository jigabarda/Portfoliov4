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
