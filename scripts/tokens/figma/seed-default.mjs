#!/usr/bin/env node
/*
 * SEED: src/themes/default.css -> a Figma Plugin script that CREATES variables.
 *
 * One-off, outside the tokens.json pipeline. The `default` theme is code-only
 * (hand-maintained default.css), and tokens:push only UPDATES variables that
 * already exist — neither can seed an empty file. This does.
 *
 * Emits `scripts/tokens/figma/build/seed-default.gen.js`. Run it inside Figma via the
 * `use_figma` MCP tool. Idempotent: reuses a collection / mode / variable of
 * the same name instead of duplicating it.
 *
 * Structure: one collection ("Semantic") with two modes, Light (:root) and
 * Dark (.dark). Stock shadcn has no primitive layer — every value is a literal
 * oklch — so there is no Foundation collection to create.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
// Token data and the CSS it projects to are the design system's and stay there;
// only the tooling lives at the root. Same split as scripts/design-sync/.
const dsDir = resolve(repoRoot, "packages/design-system");
const die = (m) => {
  console.error(`✗ ${m}`);
  process.exit(1);
};

// A collection of its own: the DS-POC file's "Semantic" holds the AceTrader mode,
// and this seeder renames modes[0] to Light — pointing both at "Semantic" would
// clobber the AceTrader mode that tokens:push writes to.
const COLLECTION = "Semantic (shadcn default)";
const TARGET =
  process.env.FIGMA_FILE ||
  JSON.parse(await readFile(resolve(dsDir, "tokens.config.json"), "utf8"))
    .figmaFile;

// ── value conversion (same math as scripts/tokens/figma/push.mjs) ─────────────────
function oklchToRgb(L, C, H, a = 1) {
  const h = (H * Math.PI) / 180,
    oa = C * Math.cos(h),
    ob = C * Math.sin(h);
  const l = (L + 0.3963377774 * oa + 0.2158037573 * ob) ** 3;
  const m = (L - 0.1055613458 * oa - 0.0638541728 * ob) ** 3;
  const s = (L - 0.0894841775 * oa - 1.291485548 * ob) ** 3;
  const g = (c) => {
    c = c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
    return Math.min(1, Math.max(0, c));
  };
  const r3 = (n) => Math.round(n * 1e4) / 1e4;
  return {
    r: r3(g(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s)),
    g: r3(g(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s)),
    b: r3(g(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s)),
    a,
  };
}
function convert(raw) {
  const v = raw.trim();
  let m;
  if (
    (m = v.match(
      /^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*([\d.]+%?))?\s*\)$/i,
    ))
  )
    return {
      type: "COLOR",
      value: oklchToRgb(
        +m[1],
        +m[2],
        +m[3],
        m[4] ? (m[4].endsWith("%") ? parseFloat(m[4]) / 100 : +m[4]) : 1,
      ),
    };
  if ((m = v.match(/^([\d.]+)rem$/)))
    return { type: "FLOAT", value: +m[1] * 16 };
  if ((m = v.match(/^([\d.]+)px$/))) return { type: "FLOAT", value: +m[1] };
  return null;
}

// ── parse default.css ──────────────────────────────────────────────────────
const css = await readFile(resolve(dsDir, "src/themes/default.css"), "utf8");
const block = (selector) => {
  const body = css.match(
    new RegExp(`${selector}\\s*\\{([\\s\\S]*?)\\n\\}`),
  )?.[1];
  if (!body) die(`Selector ${selector} not found in src/themes/default.css`);
  return Object.fromEntries(
    [...body.matchAll(/^\s*--([\w-]+):\s*([^;]+);/gm)].map((m) => [m[1], m[2]]),
  );
};
const light = block(":root");
const dark = block("\\.dark");

// Figma group prefix — normalizes back to the bare shadcn name (see cssVar in build-css.mjs).
const group = (k) =>
  k === "radius"
    ? "Radius"
    : /^chart-/.test(k)
      ? "Chart"
      : /^sidebar/.test(k)
        ? "Sidebar"
        : /^(success|info|warning|error)/.test(k)
          ? "Status"
          : "Base";

// Rule 16 (figma-use): never leave variables at the default ALL_SCOPES.
const scopes = (k, type) =>
  type === "FLOAT"
    ? ["CORNER_RADIUS"]
    : k === "foreground" || /-foreground$/.test(k)
      ? ["TEXT_FILL"]
      : /^(border|input|ring|sidebar-border|sidebar-ring)$/.test(k)
        ? ["STROKE_COLOR"]
        : k === "destructive"
          ? ["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL"]
          : ["FRAME_FILL", "SHAPE_FILL"];

const skipped = [];
const tokens = [];
for (const [k, raw] of Object.entries(light)) {
  const l = convert(raw);
  if (!l) {
    skipped.push(`:root --${k} = ${raw}`);
    continue;
  }
  // --radius is mode-independent in default.css; reuse the light value for Dark.
  const d = dark[k] === undefined ? l : convert(dark[k]);
  if (!d) {
    skipped.push(`.dark --${k} = ${dark[k]}`);
    continue;
  }
  if (d.type !== l.type) {
    skipped.push(`--${k}: type mismatch ${l.type}/${d.type}`);
    continue;
  }
  tokens.push({
    name: `${group(k)}/${k}`,
    type: l.type,
    scopes: scopes(k, l.type),
    light: l.value,
    dark: d.value,
  });
}
const darkOnly = Object.keys(dark).filter((k) => !(k in light));
if (darkOnly.length)
  skipped.push(`dark-only (no :root value): ${darkOnly.join(", ")}`);

// ── emit the Figma Plugin script ───────────────────────────────────────────
const script = `/* ⚠️  GENERATED by scripts/tokens/figma/seed-default.mjs from src/themes/default.css. Do not edit by hand.
 * Run inside Figma via the \`use_figma\` MCP tool. Creates the collection, both
 * modes, and every variable. Idempotent — reuses anything already named the same.
 *
 * ▸ INTENDED TARGET FILE: ${TARGET}
 *   This runs against whichever file the plugin is connected to — check first. */
const COLLECTION = ${JSON.stringify(COLLECTION)}
const TOKENS = ${JSON.stringify(tokens)}

const cols = await figma.variables.getLocalVariableCollectionsAsync()
let col = cols.find((c) => c.name === COLLECTION)
const createdCollection = !col
if (!col) col = figma.variables.createVariableCollection(COLLECTION)

// modes: rename the default mode to Light, add Dark if absent
const lightMode = col.modes[0]
if (lightMode.name !== "Light") col.renameMode(lightMode.modeId, "Light")
const darkModeId = (col.modes.find((m) => m.name === "Dark") || {}).modeId || col.addMode("Dark")

const existing = await figma.variables.getLocalVariablesAsync()
const byName = new Map(existing.filter((v) => v.variableCollectionId === col.id).map((v) => [v.name, v]))

const created = [], reused = []
for (const t of TOKENS) {
  let v = byName.get(t.name)
  if (v) reused.push(t.name)
  else { v = figma.variables.createVariable(t.name, col, t.type); created.push(t.name) }
  v.setValueForMode(lightMode.modeId, t.light)
  v.setValueForMode(darkModeId, t.dark)
  v.scopes = t.scopes
}

return {
  collection: col.name,
  collectionId: col.id,
  createdCollection,
  modes: col.modes.map((m) => m.name),
  createdCount: created.length,
  reusedCount: reused.length,
  created,
}
`;
await mkdir(resolve(repoRoot, "scripts/tokens/figma/build"), {
  recursive: true,
});
await writeFile(
  resolve(repoRoot, "scripts/tokens/figma/build/seed-default.gen.js"),
  script,
  "utf8",
);

console.log(
  `✓ src/themes/default.css -> scripts/tokens/figma/build/seed-default.gen.js`,
);
console.log(
  `  ${tokens.length} variables (${tokens.filter((t) => t.type === "COLOR").length} COLOR, ${tokens.filter((t) => t.type === "FLOAT").length} FLOAT) x 2 modes`,
);
console.log(`  target: ${TARGET}`);
if (skipped.length) {
  console.warn(`⚠  ${skipped.length} skipped:`);
  skipped.forEach((s) => console.warn(`   ${s}`));
  process.exitCode = 1;
}
