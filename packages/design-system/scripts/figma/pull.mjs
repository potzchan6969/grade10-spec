#!/usr/bin/env node
/*
 * PULL: Figma Variables -> canonical tokens.json (design -> code leg).
 *
 * Extracts Figma Variables and writes the canonical token DATA (not CSS);
 * tokens:build then projects it to CSS. This is how a designer's Figma edits
 * enter the git source of truth.
 *
 * EXTRACT source: FIGMA_DUMP=<path>, a JSON file shaped like the REST
 * { meta } response. Produce it with the dump plugin — `pnpm tokens:plugin dump`,
 * import it in Figma, hit Download.
 *
 * There is no REST path. GET /v1/files/:key/variables/local needs the
 * file_variables:read scope, which Figma gates to Enterprise; on this plan the
 * token request itself is rejected (403 Invalid scope(s)). The dump plugin reads
 * the same data through the Plugin API, which has no such gate.
 *
 * Identity = the normalized CSS name (cssVar). Refs are emitted as {name},
 * mirroring build-css/push. Primitives come from the Foundation default
 * mode; each configured theme reads its Figma mode from the Semantic collection.
 */
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const pkgDir = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const cfg = JSON.parse(
  await readFile(resolve(pkgDir, "tokens.config.json"), "utf8"),
);
const die = (m) => {
  console.error(`✗ ${m}`);
  process.exit(1);
};

// ── EXTRACT ─────────────────────────────────────────────────────────────────
if (!process.env.FIGMA_DUMP) {
  die(`No dump given. Set FIGMA_DUMP=<file.json>, e.g.

     pnpm tokens:plugin dump                     # build the plugin
     # Figma → Plugins → Development → Import plugin from manifest…
     #   scripts/figma/build/dump/manifest.json
     # run it, click Download
     FIGMA_DUMP=~/Downloads/figma-dump.json pnpm tokens:sync`);
}
const meta = JSON.parse(
  await readFile(resolve(pkgDir, process.env.FIGMA_DUMP), "utf8"),
).meta;
const { variables, variableCollections: collections } = meta;

// ── helpers (same naming/value shape as build-css.mjs & push.mjs) ──────
const toHex = ({ r, g, b, a = 1 }) => {
  const h = (n) =>
    Math.round(n * 255)
      .toString(16)
      .padStart(2, "0");
  return (
    a < 1 ? `#${h(r)}${h(g)}${h(b)}${h(a)}` : `#${h(r)}${h(g)}${h(b)}`
  ).toUpperCase();
};
// Figma name -> canonical key (cssVar WITHOUT the leading "--")
const key = (name) => {
  let n = name;
  if (/^color\//i.test(n)) n = n.slice(6);
  else if (n.includes("/")) n = n.slice(n.indexOf("/") + 1);
  return n
    .replace(/[/\s]+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
};
const cssType = (resolvedType) =>
  resolvedType === "COLOR" ? "color" : "dimension";
function emit(value, resolvedType) {
  if (value && value.type === "VARIABLE_ALIAS") {
    const target = variables[value.id];
    if (!target) die(`Dangling alias -> ${value.id}`);
    return `{${key(target.name)}}`;
  }
  if (resolvedType === "COLOR") return toHex(value);
  if (resolvedType === "FLOAT") return `${value}px`;
  return String(value);
}
const findCollection = (name) =>
  Object.values(collections).find((c) => c.name === name);
// $description is the DTCG slot for Figma's variable Description field. Omitted
// when blank so the diff stays quiet for the tokens nobody has documented.
const token = (v, modeId) => ({
  $type: cssType(v.resolvedType),
  $value: emit(v.valuesByMode[modeId], v.resolvedType),
  ...(v.description ? { $description: v.description } : {}),
});

// ── NORMALIZE + EMIT ────────────────────────────────────────────────────────
const prim = findCollection(cfg.primitiveCollection);
const sem = findCollection(cfg.semanticCollection);
if (!prim || !sem)
  die(
    `Collection not found. Available: ${Object.values(collections)
      .map((c) => `"${c.name}"`)
      .join(", ")}`,
  );

// key() drops the group prefix, so two grouped Figma names can normalize to one token key
// ("Base/card" + "Sidebar/card" -> "card"). Object.fromEntries would silently keep the last.
const keyed = (ids, modeId, where) => {
  const seen = new Map();
  const out = {};
  for (const id of ids) {
    const name = variables[id].name;
    const k = key(name);
    if (seen.has(k))
      die(
        `Name collision in ${where}: "${seen.get(k)}" and "${name}" both normalize to "${k}". Rename one in Figma.`,
      );
    seen.set(k, name);
    out[k] = token(variables[id], modeId);
  }
  return out;
};

const doc = {
  "//": "Canonical design tokens — SOURCE OF TRUTH. Figma and CSS are projections of this file. Pull edits from Figma (tokens:pull), build CSS (tokens:build), push code edits to Figma (tokens:push). Projection rules (slotMap, selectors, collections) live in tokens.config.json.",
  primitives: keyed(
    prim.variableIds,
    prim.defaultModeId,
    cfg.primitiveCollection,
  ),
  themes: {},
};
const modeIdByName = Object.fromEntries(
  sem.modes.map((m) => [m.name, m.modeId]),
);
for (const [name, themeCfg] of Object.entries(cfg.themes)) {
  const figmaMode = Object.keys(themeCfg.modes)[0];
  const modeId = modeIdByName[figmaMode];
  // Hard failure, not a warning. Skipping here writes `themes: {}`, and
  // tokens:build then leaves the theme's CSS untouched on disk — so a renamed
  // Figma mode silently strands a stale theme file against fresh primitives.
  // Renaming a mode is normal designer behaviour; it must stop the pull.
  if (modeId === undefined) {
    die(
      `theme "${name}": Figma mode "${figmaMode}" not found in the "${cfg.semanticCollection}" collection.
     Available modes: ${sem.modes.map((m) => `"${m.name}"`).join(", ")}
     Fix tokens.config.json (themes.${name}.modes) or rename the mode in Figma.`,
    );
  }
  doc.themes[name] = {
    figmaMode,
    tokens: keyed(
      sem.variableIds,
      modeId,
      `${cfg.semanticCollection} / ${figmaMode}`,
    ),
  };
}

await writeFile(
  resolve(pkgDir, "tokens.json"),
  JSON.stringify(doc, null, 2) + "\n",
  "utf8",
);
console.log(
  `✓ ${prim.variableIds.length} primitives + ${sem.variableIds.length} semantic tokens -> tokens.json`,
);
for (const [name, t] of Object.entries(doc.themes))
  console.log(`  theme ${name} (Figma mode "${t.figmaMode}")`);
