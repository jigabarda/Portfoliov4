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
