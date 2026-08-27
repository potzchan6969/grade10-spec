#!/usr/bin/env node
/*
 * PUSH: canonical tokens.json -> a Figma Plugin script (code -> design leg).
 *
 * Emits `scripts/figma/build/push.gen.js` — run it inside Figma via the `use_figma`
 * MCP tool or the plugin console (no Enterprise / no REST token, same manual
 * step as the FIGMA_DUMP path of tokens:import). Idempotent.
 *
 * Identity = the normalized CSS name. In Figma, each local variable's name is
 * normalized the same way (cssVar) and matched against our token keys, so we
 * UPDATE existing variables in place without needing their IDs. Refs push as
 * Figma VARIABLE_ALIASes, preserving the primitive->semantic graph.
 *
 * Tokens with no matching variable are CREATED, filed under a group derived from
 * the token name (primitiveGroup/semanticGroup below) — so this also seeds an
 * empty file, collections and theme mode included. The group is a naming choice
 * only: norm() strips it, so it never affects matching on later runs. Existing
 * variables keep whatever name they already have.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const pkgDir = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const cfg = JSON.parse(
  await readFile(resolve(pkgDir, "tokens.config.json"), "utf8"),
);
const doc = JSON.parse(await readFile(resolve(pkgDir, "tokens.json"), "utf8"));

// ── value conversion (done here so the plugin script stays literal) ─────────
const hexToRgb = (h) => ({
  r: parseInt(h.slice(1, 3), 16) / 255,
  g: parseInt(h.slice(3, 5), 16) / 255,
  b: parseInt(h.slice(5, 7), 16) / 255,
  a: h.length >= 9 ? parseInt(h.slice(7, 9), 16) / 255 : 1,
});
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
  return {
    r: g(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    g: g(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    b: g(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
    a,
  };
}
// canonical $value -> { alias } | { t:"COLOR", v } | { t:"FLOAT", v } | null
function convert(val) {
  const v = String(val).trim();
  let m;
  if ((m = v.match(/^\{([\w-]+)\}$/))) return { alias: m[1] };
  if (/^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(v))
    return { t: "COLOR", v: hexToRgb(v.toUpperCase()) };
  if (
    (m = v.match(
      /^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*([\d.]+%?))?\s*\)$/i,
    ))
  )
    return {
      t: "COLOR",
      v: oklchToRgb(
        +m[1],
        +m[2],
        +m[3],
        m[4] ? (m[4].endsWith("%") ? parseFloat(m[4]) / 100 : +m[4]) : 1,
      ),
    };
  if ((m = v.match(/^([\d.]+)rem$/))) return { t: "FLOAT", v: +m[1] * 16 };
  if ((m = v.match(/^([\d.]+)px$/))) return { t: "FLOAT", v: +m[1] };
  // Opacity round-trips as a percentage; Figma stores the same 0–100 number.
  if ((m = v.match(/^([\d.]+)%$/))) return { t: "FLOAT", v: +m[1] };
  if (/^[\d.]+$/.test(v)) return { t: "FLOAT", v: +v };
  return null;
}

// ── Figma naming for tokens that must be CREATED ───────────────────────────
// norm() strips the group prefix, so the group never affects matching — it only
// decides where a newly created variable is filed. Existing variables keep their
// own names; these apply to creation only. Semantic groups follow the names
// already recorded in tokens.config.json → slotMap (e.g. "Layer/layer-01").
//
// Typography's own groups, checked before the generic numeric ones so a font
// weight is not filed as `Number/weight-medium`. Names follow the groups the
// Figma Typography collection already uses (`Typeset/weight-medium`).
const TYPOGRAPHY = /^(typset|typeset|font|family|weight|leading|tracking)-/;
const primitiveGroup = (k, type) =>
  type === "COLOR"
    ? "Color"
    : TYPOGRAPHY.test(k)
      ? "Typeset"
      : /^space-/.test(k)
        ? "Space"
        : /^container-/.test(k)
          ? "Container"
          : /^blur-/.test(k)
            ? "Blur"
            : /^opacity-/.test(k)
              ? "Opacity"
              : "Number";
const semanticGroup = (k) =>
  /^background/.test(k)
    ? "Background"
    : /^layer-/.test(k)
      ? "Layer"
      : /^text-/.test(k)
        ? "Text"
        : /^link-/.test(k)
          ? "Link"
          : /^button-/.test(k)
            ? "Button"
            : /^icon-/.test(k)
              ? "Icon"
              : /^support-/.test(k)
                ? "Support"
                : /^brand/.test(k)
                  ? "Brand"
                  : /^categorical-/.test(k)
                    ? "Chart"
                    : /^rounded-/.test(k)
                      ? "Radius"
                      : /^inline-tooltip-/.test(k)
                        ? "Tooltip"
                        : /^toggle-/.test(k)
                          ? "Toggle"
                          : k === "default"
                            ? "Border"
                            : "Base";
// Rule 16 (figma-use): never leave a created variable at the default ALL_SCOPES.
const scopesFor = (k, type) =>
  type === "FLOAT"
    ? /^rounded-/.test(k)
      ? ["CORNER_RADIUS"]
      : /^(font-)?weight-/.test(k)
        ? ["FONT_WEIGHT"]
        : /^leading-/.test(k) || /^(typset|typeset)-leading-/.test(k)
          ? ["LINE_HEIGHT"]
          : /^tracking-/.test(k)
            ? ["LETTER_SPACING"]
            : /^(typset|typeset)-size-/.test(k)
              ? ["FONT_SIZE"]
              : /^(space|container)-/.test(k)
                ? ["GAP", "WIDTH_HEIGHT"]
                : /^opacity-/.test(k)
                  ? ["OPACITY"]
                  : ["WIDTH_HEIGHT"]
    : /^(text-|link-|inline-tooltip-)/.test(k)
      ? ["TEXT_FILL"]
      : /^icon-/.test(k)
        ? ["SHAPE_FILL", "TEXT_FILL"]
        : /^(default|field|focus)$/.test(k)
          ? ["STROKE_COLOR"]
          : ["FRAME_FILL", "SHAPE_FILL"];

// ── build the push payload ─────────────────────────────────────────────────
// Each primitive carries the collection it came from, so a token this script
// has to CREATE is filed back where the pull found it. Without that every
// section collapses into Foundation and a Typography token pushed once is a
// Foundation token forever.
const primitiveSections = Object.entries(
  cfg.primitiveCollections ?? { primitives: cfg.primitiveCollection },
);
const skipped = [];
const primitives = {};
for (const [section, collection] of primitiveSections) {
  for (const [k, t] of Object.entries(doc[section] ?? {})) {
    const c = convert(t.$value);
    if (c && !c.alias)
      primitives[k] = {
        ...c,
        name: `${primitiveGroup(k, c.t)}/${k}`,
        scopes: scopesFor(k, c.t),
        desc: t.$description ?? null,
        col: collection,
      };
    // A STRING primitive (Typography's `family-sans` = "Inter") has no
    // convert() form — Figma needs a STRING variable, and this pipeline only
    // creates COLOR and FLOAT. Reported, never guessed at.
    else skipped.push(`${section} ${k} = ${t.$value}`);
  }
}
const themes = {};
for (const [name, theme] of Object.entries(doc.themes ?? {})) {
  const tokens = {};
  for (const [k, t] of Object.entries(theme.tokens)) {
    const c = convert(t.$value);
    // An alias has no type of its own — the plugin reads it off the target.
    if (c)
      tokens[k] = {
        ...c,
        name: `${semanticGroup(k)}/${k}`,
        scopes: c.alias ? null : scopesFor(k, c.t),
        desc: t.$description ?? null,
      };
    else skipped.push(`${name}/${k} = ${t.$value}`);
  }
  themes[name] = { mode: theme.figmaMode, tokens };
}

// ── emit the Figma Plugin script ───────────────────────────────────────────
const targetFile =
  process.env.FIGMA_FILE || cfg.figmaFile || cfg.fileKey || "(not set)";
const script = `/* ⚠️  GENERATED by scripts/figma/push.mjs from tokens.json. Do not edit by hand.
 * Run inside Figma via the \`use_figma\` MCP tool, which reports the returned
 * summary. Updates existing variables in place, matched by normalized name.
 * Idempotent.
 *
 * ▸ INTENDED TARGET FILE: ${targetFile}
 *   This runs against whichever file the Figma plugin is connected to — make
 *   sure that is the file above before running. */
return await (async () => {
  const PRIMITIVE_COLLECTIONS = ${JSON.stringify(primitiveSections.map(([, c]) => c))}
  const SEMANTIC = ${JSON.stringify(cfg.semanticCollection)}
  const PRIMITIVES = ${JSON.stringify(primitives)}
  const THEMES = ${JSON.stringify(themes)}

  const norm = (name) => {
    let n = name
    if (/^color\\//i.test(n)) n = n.slice(6)
    else if (n.includes("/")) n = n.slice(n.indexOf("/") + 1)
    return n.replace(/[/\\s]+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "").toLowerCase()
  }

  const cols = await figma.variables.getLocalVariableCollectionsAsync()
  const colByName = Object.fromEntries(cols.map((c) => [c.name, c]))
  const createdCollections = []
  const ensureCollection = (name) => {
    if (colByName[name]) return colByName[name]
    const c = figma.variables.createVariableCollection(name)
    colByName[name] = c; cols.push(c); createdCollections.push(name)
    return c
  }
  const primCols = {}
  for (const n of PRIMITIVE_COLLECTIONS) primCols[n] = ensureCollection(n)
  const semantic = ensureCollection(SEMANTIC)

  // Only the collections this pipeline owns. Other collections in the same
  // file (e.g. a seeded shadcn-default set) share token names and would otherwise
  // register as false ambiguity.
  const scope = new Set(Object.values(primCols).map((c) => c.id).concat(semantic.id))
  const vars = (await figma.variables.getLocalVariablesAsync()).filter((v) => scope.has(v.variableCollectionId))
  // norm() drops the group prefix, so two grouped names can collapse to one key
  // ("Base/card" + "Sidebar/card" -> "card"). Writing to an arbitrary winner would
  // silently hit the wrong variable, so ambiguous keys are refused, not guessed.
  const byNorm = new Map()      // normalized name -> variable (all collections)
  const ambiguous = new Map()   // normalized name -> [conflicting Figma names]
  for (const v of vars) {
    const n = norm(v.name)
    if (byNorm.has(n)) ambiguous.set(n, (ambiguous.get(n) || [byNorm.get(n).name]).concat(v.name))
    byNorm.set(n, v)
  }

  const missing = []
  const collisions = []
  const clash = (label, key) => {
    if (!ambiguous.has(key)) return false
    collisions.push(label + " (" + ambiguous.get(key).join(" | ") + ")")
    return true
  }
  let nSet = 0
  let nDesc = 0
  let nSyntax = 0
  const setDesc = (v, c) => {
    if (c.desc && v.description !== c.desc) { v.description = c.desc; nDesc++ }
  }
  // Dev Mode shows this instead of the Figma name. Derived from the token key,
  // which IS the CSS custom property name — so it is a projection, not data,
  // and is pushed only (never read back into tokens.json).
  const setSyntax = (v, key) => {
    const web = "var(--" + key + ")"
    if (v.codeSyntax && v.codeSyntax.WEB === web) return
    v.setVariableCodeSyntax("WEB", web)
    nSyntax++
  }
  const created = []
  const createdModes = []
  const make = (label, name, col, type, scopes, key) => {
    const v = figma.variables.createVariable(name, col, type)
    if (scopes) v.scopes = scopes
    byNorm.set(key, v)
    created.push(label)
    return v
  }

  // primitives -> the default mode of their own collection (mode-independent).
  // An EXISTING variable is written where it already lives; only a created one
  // uses c.col, the collection tokens.json says it came from.
  for (const [key, c] of Object.entries(PRIMITIVES)) {
    if (clash("primitive " + key, key)) continue
    const home = primCols[c.col] || primCols[PRIMITIVE_COLLECTIONS[0]]
    const v = byNorm.get(key) || make("primitive " + key + " -> " + home.name, c.name, home, c.t, c.scopes, key)
    const col = cols.find((x) => x.id === v.variableCollectionId) || home
    v.setValueForMode(col.defaultModeId, c.v); setDesc(v, c); setSyntax(v, key); nSet++
  }

  // semantic themes -> the named mode of the Semantic collection
  for (const [themeName, theme] of Object.entries(THEMES)) {
    let mode = semantic.modes.find((m) => m.name === theme.mode)
    if (!mode) {
      // A freshly created collection carries one stock mode ("Mode 1") — rename it
      // rather than adding a second, which would leave an empty mode behind.
      const modeId = semantic.modes.length === 1 && semantic.modes[0].name === "Mode 1"
        ? (semantic.renameMode(semantic.modes[0].modeId, theme.mode), semantic.modes[0].modeId)
        : semantic.addMode(theme.mode)
      mode = { modeId: modeId, name: theme.mode }
      createdModes.push(theme.mode)
    }
    for (const [key, c] of Object.entries(theme.tokens)) {
      if (clash(themeName + "/" + key, key)) continue
      // declared outside the branches so the description / code-syntax writes
      // below can see it — both arms resolve the same variable
      let v
      if (c.alias) {
        if (clash(themeName + "/" + key + " -> {" + c.alias + "}", c.alias)) continue
        // Aliases carry no type of their own — the target supplies type and scopes.
        const target = byNorm.get(c.alias)
        if (!target) { missing.push(themeName + "/" + key + " -> {" + c.alias + "}"); continue }
        v = byNorm.get(key) || make(themeName + "/" + key, c.name, semantic, target.resolvedType, target.scopes, key)
        v.setValueForMode(mode.modeId, figma.variables.createVariableAlias(target))
      } else {
        v = byNorm.get(key) || make(themeName + "/" + key, c.name, semantic, c.t, c.scopes, key)
        v.setValueForMode(mode.modeId, c.v)
      }
      setDesc(v, c)
      setSyntax(v, key)
      nSet++
    }
  }

  console.log("✓ set " + nSet + " variable value(s), " + nDesc + " description(s), " + nSyntax + " code syntax, created " + created.length)
  if (missing.length) console.warn("⚠  " + missing.length + " token(s) skipped — alias target absent:\\n   " + missing.join("\\n   "))
  if (collisions.length) console.warn("⚠  " + collisions.length + " token(s) SKIPPED — the normalized name matches more than one Figma variable. Rename one in Figma:\\n   " + collisions.join("\\n   "))
  return {
    file: figma.root.name,
    set: nSet,
    descriptions: nDesc,
    codeSyntax: nSyntax,
    created: created.length,
    createdCollections: createdCollections,
    createdModes: createdModes,
    missing: missing,
    collisions: collisions,
  }
})()
`;
await mkdir(resolve(pkgDir, "scripts/figma/build"), { recursive: true });
await writeFile(
  resolve(pkgDir, "scripts/figma/build/push.gen.js"),
  script,
  "utf8",
);

// ── report ─────────────────────────────────────────────────────────────────
console.log(`✓ tokens.json -> scripts/figma/build/push.gen.js`);
console.log(
  `  ${Object.keys(primitives).length} primitives, ${Object.entries(themes)
    .map(([n, t]) => `${Object.keys(t.tokens).length} ${n}`)
    .join(", ")}`,
);
const aliasCount = Object.values(themes).reduce(
  (s, t) => s + Object.values(t.tokens).filter((c) => c.alias).length,
  0,
);
console.log(`  ${aliasCount} semantic values push as Figma aliases`);
if (skipped.length) {
  console.warn(`⚠  ${skipped.length} unconvertible value(s):`);
  skipped.forEach((s) => console.warn(`   ${s}`));
  process.exitCode = 1;
}
