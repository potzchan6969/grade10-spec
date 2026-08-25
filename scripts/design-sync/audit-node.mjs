#!/usr/bin/env node
/*
 * AUDIT: the classnames applied to an element vs the Figma node it was
 * converted from — for arbitrary nodes, which is what a block or a component
 * with no variant axes is made of. check-components.mjs owns the same
 * comparison for primitive variant sets; nothing owns it here, because the
 * element↔node mapping exists only in the head of whoever did the conversion.
 * This script takes that mapping as input and makes the comparison
 * deterministic.
 *
 *   FIGMA_TOKEN=figd_… pnpm run figma:audit --node <url> --classes "h-10 gap-2 bg-primary"
 *   FIGMA_TOKEN=figd_… pnpm run figma:audit --map audit.json
 *   FIGMA_TOKEN=figd_… pnpm run figma:audit --all-blocks
 *   FIGMA_TOKEN=figd_… pnpm run figma:audit --node <url>          # dump the node's values
 *
 * audit.json is the class-audit table the page-from-figma skill has the
 * converting agent emit: [{ "label": "hero/cta", "node": "<figma url>",
 * "classes": "h-10 px-4 gap-2 bg-primary rounded-md" }, …]. The unit of
 * audit is the COMPONENT DIRECTORY: each packages/ui/src/blocks/<capability>/
 * and each packages/design-system/src/components/<group>/ carries one
 * audit.json covering the elements its conversion styled, and --all-blocks
 * sweeps every one of them — which is what lets the nightly design-sync run
 * re-check them long after their converter is gone. Which package a component
 * lives in decides nothing: the site chrome sits in the design system, has no
 * variant axes for check-components.mjs to diff, and so was checked by neither
 * rail while its footer shipped the inverse of its design. A directory with no
 * audit.json is listed as uncovered rather than failed, so components that
 * predate the convention read as gaps, not as passes.
 *
 * DRIFT (✗) = a class resolves to a value the node does not draw, OR the node
 * draws a fill or a stroke that nothing mapped to it claims; exits 1. The
 * second half exists because expectations are otherwise raised BY classes, so
 * a property the code never styled was compared against nothing at all.
 * UNCHECKED (–) = never fails, always listed — a run that only says ✓ would
 * read as coverage it does not have. Two different things produce one:
 *   - No rail carries the class: a state or breakpoint prefix, a non-visual
 *     utility (`group/*`, `relative`), a token this cannot resolve. `w-full`
 *     is deliberately here: it means FILL, but a component or page-level
 *     frame is the root of its own auto-layout and reads FIXED whatever the
 *     code does with it, so a rail would fail every block for being a block.
 *   - A rail carries it, but the node states no such property — layoutAlign
 *     and layoutGrow exist only on a child of an auto-layout frame,
 *     targetAspectRatio only where the ratio is locked. Silence is not
 *     disagreement, so these read as unchecked and name the property looked
 *     for. `overflow-hidden` is the exception: every frame and component
 *     states clipsContent, so silence there would itself be an answer.
 *
 * Values, not names: REST resolves every variable binding before it
 * serializes, so this compares the hex and pixels a viewer sees. A wrong
 * token that resolves to the right value passes here — the variable *names*
 * need file_variables:read, which Figma gates to Enterprise (see pull.mjs).
 * The in-session audit with get_variable_defs remains the stronger check;
 * this is the unattended, re-runnable one.
 */
import { readdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import {
  expectations,
  fileKeyFrom,
  normHex,
  omissions,
  radiusResolver,
  toHex8,
  tokenResolver,
} from "./values.mjs";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
// The design system owns the token data these scripts resolve against; the
// scripts themselves are repository tooling, because they read both packages.
const dsDir = resolve(repoRoot, "packages/design-system");
try {
  process.loadEnvFile(resolve(repoRoot, ".env"));
} catch {
  // No .env checked in or present — fall through to the ambient environment.
}
const die = (m) => {
  console.error(`✗ ${m}`);
  process.exit(1);
};

// `pnpm run figma:audit -- --all-blocks` is the habitual way to pass flags
// through pnpm, and it leaves a literal `--` in argv that parseArgs would read
// as the start of positionals and throw on. It is not needed any more — this
// runs from the root with one hop — but tolerating it costs a filter, and the
// alternative is a crash that reads as a bug in the flag someone just typed.
const argv = process.argv.slice(2).filter((a) => a !== "--");
const { values: args } = parseArgs({
  args: argv,
  options: {
    node: { type: "string" },
    classes: { type: "string" },
    map: { type: "string" },
    file: { type: "string" },
    "all-blocks": { type: "boolean" },
  },
});

const token = process.env.FIGMA_TOKEN;
if (!token)
  die(`No FIGMA_TOKEN. A personal access token with files:read is enough —
   the Enterprise-only file_variables:read gate applies to variable names,
   which this audit deliberately does not read (it compares resolved values).`);

const cfg = JSON.parse(
  await readFile(resolve(dsDir, "tokens.config.json"), "utf8"),
);
const resolveToken = tokenResolver(
  JSON.parse(await readFile(resolve(dsDir, "tokens.json"), "utf8")),
);
const resolveRadius = radiusResolver(
  await readFile(resolve(dsDir, cfg.preamble), "utf8"),
  cfg,
  resolveToken,
);

// A node reference is a full Figma URL (`…?node-id=12-34`) or a bare id
// (`12:34` / `12-34`). The file key comes from the URL itself when there is
// one; --file or tokens.config.json's figmaFile covers bare ids.
function parseNodeRef(ref) {
  const id =
    /node-id=(\d+[-:]\d+)/.exec(ref)?.[1] ??
    /^(\d+[-:]\d+)$/.exec(ref.trim())?.[1];
  if (!id) return null;
  const key = fileKeyFrom(ref) ?? fileKeyFrom(args.file ?? cfg.figmaFile ?? "");
  if (!key) return null;
  return { key, id: id.replace("-", ":") };
}

const entries = [];
const uncovered = [];
const nothingChecked = [];
// Components a rail must own, resolved to their Figma node kind after the
// fetch below: a component SET is the variant comparison's, a standalone one
// needs an audit table here.
const candidates = [];
// Uncovered directories come from more than one root now, and a design-system
// directory listed flat beside a block reads as one set of equals. Group them
// so a reader can tell which package a gap is in.
function groupUncovered(rows) {
  const byRoot = new Map();
  for (const { root, name } of rows) {
    if (!byRoot.has(root)) byRoot.set(root, []);
    byRoot.get(root).push(name);
  }
  return byRoot;
}
async function pushMap(path, prefix = "") {
  const rows = JSON.parse(await readFile(path, "utf8"));
  if (!Array.isArray(rows)) die(`${path} is not a JSON array.`);
  for (const [i, row] of rows.entries()) {
    const ref = parseNodeRef(row.node ?? "");
    if (!ref)
      die(
        `${path} entry ${i} (${row.label ?? "unlabelled"}): cannot read a file key and node id out of "${row.node}".`,
      );
    entries.push({
      label: `${prefix}${row.label ?? `entry ${i}`}`,
      ref,
      classes: row.classes ?? "",
      // Figma sometimes draws as two nodes what the code renders as one — a
      // frame that positions and an inner slot that carries the spacing. An
      // entry may then point at the inner node while still being the coverage
      // its component owes; `covers` names that component so the coverage
      // report does not go on calling it a gap.
      covers: row.covers ?? null,
    });
  }
}
if (args["all-blocks"]) {
  // The unit of audit is the component directory: one audit.json per
  // capability in packages/ui, and per component group in the design system,
  // written at conversion time. Which package a component lives in decides
  // nothing about whether it is checked — the site chrome sits in the design
  // system and drifted for weeks behind a sweep that walked packages/ui only.
  // A directory without an audit.json is a gap to report, never a pass.
  const roots = [
    {
      label: "block",
      dir: resolve(repoRoot, "packages/ui/src/blocks"),
      // shared/ is cross-capability plumbing that never came from a Figma
      // frame (docs/governance/ui-component-contracts.md, "shared/ is earned,
      // not planned") — there is no node to audit against, so listing it as
      // uncovered forever would be noise rather than a gap.
      skip: new Set(["shared"]),
    },
    {
      label: "design-system",
      dir: resolve(repoRoot, "packages/design-system/src/components"),
      // providers/ is the same case as shared/ one root up: it draws nothing
      // and has no Figma counterpart to audit against.
      skip: new Set(["providers"]),
      // A design-system directory holds both kinds of component. Reporting the
      // directory would call `forms` a gap while Button, Text Input, and the
      // rest of its component SETS are compared variant by variant elsewhere —
      // and would go on saying so after the one standalone component in it was
      // covered. Ask per component instead; which rail owes a component is
      // decided by whether its Figma counterpart has variant axes.
      perComponent: true,
    },
  ];
  for (const root of roots) {
    for (const entry of await readdir(root.dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      if (root.skip.has(entry.name)) continue;
      const dir = resolve(root.dir, entry.name);
      let covered = true;
      try {
        await pushMap(resolve(dir, "audit.json"), `${entry.name}: `);
      } catch (err) {
        if (err?.code !== "ENOENT") throw err;
        covered = false;
      }
      if (!root.perComponent) {
        if (!covered) uncovered.push({ root: root.label, name: entry.name });
        continue;
      }
      for (const file of await readdir(dir)) {
        if (!file.endsWith(".figma.ts")) continue;
        const src = await readFile(resolve(dir, file), "utf8");
        const ref = parseNodeRef(/url=(\S+)/.exec(src)?.[1] ?? "");
        if (!ref) continue;
        candidates.push({
          root: root.label,
          name: /component=(.+)/.exec(src)?.[1]?.trim() ?? file,
          ref,
        });
      }
    }
  }
  if (!entries.length) {
    console.log(
      `No component directory carries an audit.json yet (${uncovered.length} uncovered: ${uncovered.map((u) => u.name).join(", ")}). ` +
        `Nothing audited — the page-from-figma skill writes one per converted block.`,
    );
    process.exit(0);
  }
} else if (args.map) {
  await pushMap(resolve(args.map));
} else if (args.node) {
  const ref = parseNodeRef(args.node);
  if (!ref)
    die(
      `Cannot read a file key and node id out of "${args.node}". Pass a full Figma URL, or --file with a bare node id.`,
    );
  entries.push({ label: args.node, ref, classes: args.classes ?? "" });
} else {
  die(
    'Nothing to audit. Pass --node <url> [--classes "…"], --map audit.json, or --all-blocks.',
  );
}

// One request per file key, all ids batched — /nodes is the cheap endpoint,
// and a page audit is one file with many nodes.
const byKey = new Map();
for (const e of [...entries, ...candidates]) {
  if (!byKey.has(e.ref.key)) byKey.set(e.ref.key, new Set());
  byKey.get(e.ref.key).add(e.ref.id);
}
const fetched = new Map();
for (const [key, ids] of byKey) {
  const res = await fetch(
    `https://api.figma.com/v1/files/${key}/nodes?ids=${encodeURIComponent([...ids].join(","))}`,
    { headers: { "X-Figma-Token": token } },
  );
  if (!res.ok)
    die(
      `Figma REST ${res.status} ${res.statusText} for file ${key}. ` +
        `A 403 usually means the token lacks files:read or cannot see this file; ` +
        `a 404 usually means the key is wrong (branch URLs resolve to the branch key).`,
    );
  const json = await res.json();
  for (const [id, entry] of Object.entries(json.nodes ?? {}))
    fetched.set(`${key}/${id}`, entry?.document ?? null);
}

// The same properties check-components.mjs reads off a variant, plus width
// and vertical padding, which a page audit meets and a variant diff never
// needed. On a TEXT node the fill IS the text colour, so text-* is the class
// that compares against it and bg-* stops being meaningful.
function nodeValues(doc) {
  const fill = doc.fills?.find(
    (f) => f.visible !== false && f.type === "SOLID",
  );
  // A stroke is read the same way as a fill and for the same reason: every
  // frame and component states `strokes`, so an empty array is the node
  // saying it draws no border, not the node declining to answer. Which edges
  // carry it is not compared — `border-t` and a full box both read as "there
  // is a stroke here", and Figma's individualStrokeWeights would have to be
  // matched against four separate utilities to say more.
  const stroke = doc.strokes?.find(
    (s) => s.visible !== false && s.type === "SOLID",
  );
  return {
    type: doc.type,
    name: doc.name,
    fill: fill ? toHex8(fill.color, fill.opacity) : null,
    stroke: stroke ? toHex8(stroke.color, stroke.opacity) : null,
    height: doc.absoluteBoundingBox?.height ?? null,
    width: doc.absoluteBoundingBox?.width ?? null,
    radius: doc.cornerRadius ?? null,
    padX: doc.paddingLeft ?? null,
    padXRight: doc.paddingRight ?? null,
    padY: doc.paddingTop ?? null,
    padYBottom: doc.paddingBottom ?? null,
    gap: doc.itemSpacing ?? null,
    // Padding and item spacing exist only on an auto-layout frame. A frame
    // that positions its children absolutely insets them with offsets
    // instead, and states no padding at all — so a px-* on the element that
    // renders it is unverifiable here, not wrong. Same rule as layoutAlign
    // below: silence from a node in no position to speak is not disagreement.
    autoLayout: doc.layoutMode != null && doc.layoutMode !== "None",
    // Layout intent, as booleans, for the utilities that carry no number.
    // Each is null when the node does not state the property at all, which
    // is the difference between "Figma disagrees" and "Figma is silent" —
    // see the `optional` expectations below.
    clips: doc.clipsContent ?? null,
    sticky:
      doc.scrollBehavior == null
        ? null
        : doc.scrollBehavior === "STICKY_SCROLLS",
    square:
      doc.targetAspectRatio == null
        ? null
        : doc.targetAspectRatio.x === doc.targetAspectRatio.y,
    // layoutAlign / layoutGrow exist only on a child of an auto-layout
    // frame. A component or page-level frame is neither, so these stay null
    // there rather than asserting a default nothing chose.
    stretch: doc.layoutAlign == null ? null : doc.layoutAlign === "STRETCH",
    noGrow: doc.layoutGrow == null ? null : doc.layoutGrow === 0,
  };
}

// Audit-only expectations layered over the shared set: width, vertical
// padding, text colour on TEXT nodes, and the layout-intent booleans. These
// stay here rather than in values.mjs because checkValues compares against
// variant properties that have no width, padY, or layout intent, and a
// shared expectation it cannot meet would warn on every primitive.
//
// `optional` marks an expectation the node is allowed to be SILENT about:
// absent reads as unchecked, not as drift. Every layout-intent rail is
// optional, because the Figma property behind it exists only in a context
// the node may not be in — layoutAlign and layoutGrow only on a child of an
// auto-layout frame, targetAspectRatio only where the ratio was locked. A
// non-optional expectation still fails when the node sets no such value,
// which is what keeps a missing height or padding a real finding.
function auditExpectations(classString, v) {
  const nodeType = v.type;
  const out = expectations(classString, resolveToken, resolveRadius);
  for (const cls of classString.split(/\s+/).filter(Boolean)) {
    if (cls.includes(":")) continue;
    let m;
    if (cls === "overflow-hidden") {
      // clipsContent is stated by every frame and component, so this one is
      // not optional: silence would itself be the answer.
      out.push({ prop: "clips", cls, expected: true });
    } else if (cls === "overflow-visible") {
      out.push({ prop: "clips", cls, expected: false });
    } else if (cls === "sticky") {
      out.push({ prop: "sticky", cls, expected: true, optional: true });
    } else if (cls === "aspect-square") {
      out.push({ prop: "square", cls, expected: true, optional: true });
    } else if (cls === "self-stretch") {
      out.push({ prop: "stretch", cls, expected: true, optional: true });
    } else if (cls === "shrink-0") {
      out.push({ prop: "noGrow", cls, expected: true, optional: true });
    } else if ((m = /^w-(\d+(?:\.\d+)?)$/.exec(cls))) {
      out.push({ prop: "width", cls, expected: Number(m[1]) * 4 });
    } else if ((m = /^py-(\d+(?:\.\d+)?)$/.exec(cls))) {
      out.push({ prop: "padY", cls, expected: Number(m[1]) * 4 });
    } else if ((m = /^p-(\d+(?:\.\d+)?)$/.exec(cls))) {
      out.push({ prop: "padX", cls, expected: Number(m[1]) * 4 });
      out.push({ prop: "padY", cls, expected: Number(m[1]) * 4 });
    } else if (nodeType === "TEXT" && (m = /^text-(.+)$/.exec(cls))) {
      const value = resolveToken(m[1]);
      if (value?.startsWith("#"))
        out.push({ prop: "fill", cls, expected: normHex(value) });
    }
  }
  return out;
}

// The layout-intent props are named for what the class means; when one is
// reported as unstated, name the Figma property instead, because that is
// what whoever opens the file has to go and look at.
const figmaProp = {
  padX: "layoutMode, so no padding",
  padY: "layoutMode, so no padding",
  gap: "layoutMode, so no itemSpacing",
  clips: "clipsContent",
  sticky: "scrollBehavior",
  square: "targetAspectRatio",
  stretch: "layoutAlign",
  noGrow: "layoutGrow",
};

// A conversion routinely splits one Figma node across two elements — a root
// that positions and an inner surface that paints — so asking whether THIS
// element claims the node's fill would fail the root of every such pair. The
// question is whether anything mapped to the node claims it, which is why the
// claims are unioned per node and the answer reported once, against the first
// entry that names it.
const claimsByNode = new Map();
for (const e of entries) {
  const k = `${e.ref.key}/${e.ref.id}`;
  claimsByNode.set(k, `${claimsByNode.get(k) ?? ""} ${e.classes}`);
}
const omissionsReported = new Set();

// A component SET is compared variant by variant by check-components.mjs, so
// it is not this rail's to cover and is not a gap. A standalone component has
// no second rung to diff against there — checkValues skips it — so if no entry
// here names its node, nothing in the repository compares its values.
const audited = new Set(entries.map((e) => `${e.ref.key}/${e.ref.id}`));
const claimed = new Set(entries.map((e) => e.covers).filter(Boolean));
for (const c of candidates) {
  const doc = fetched.get(`${c.ref.key}/${c.ref.id}`);
  if (!doc || doc.type === "COMPONENT_SET") continue;
  if (!audited.has(`${c.ref.key}/${c.ref.id}`) && !claimed.has(c.name))
    uncovered.push({ root: `${c.root} standalone component`, name: c.name });
}

let drift = 0;
for (const e of entries) {
  const doc = fetched.get(`${e.ref.key}/${e.ref.id}`);
  console.log(`\n◆ ${e.label}`);
  if (!doc) {
    console.error(`  ✗ node ${e.ref.id} not found in file ${e.ref.key}`);
    drift++;
    continue;
  }
  const v = nodeValues(doc);
  console.log(`  ${v.type} "${v.name}" (${e.ref.id})`);

  if (!e.classes.trim()) {
    // No classes: dump what the node resolves to, as a poor man's
    // get_variable_defs for whoever has no MCP session open.
    for (const [k, val] of Object.entries(v))
      if (val != null && k !== "type" && k !== "name")
        console.log(`  ${k.padEnd(10)} ${val}`);
    continue;
  }
  if (v.padX != null && v.padXRight != null && v.padX !== v.padXRight)
    console.log(
      `  ! asymmetric horizontal padding (${v.padX} / ${v.padXRight}); px-* compares against the left`,
    );
  if (v.padY != null && v.padYBottom != null && v.padY !== v.padYBottom)
    console.log(
      `  ! asymmetric vertical padding (${v.padY} / ${v.padYBottom}); py-* compares against the top`,
    );

  const expected = auditExpectations(e.classes, v);
  // A spacing rail only means something on an auto-layout frame; elsewhere
  // the node cannot answer, so demote these to the optional set rather than
  // reading their absence as drift.
  if (!v.autoLayout)
    for (const x of expected)
      if (x.prop === "padX" || x.prop === "padY" || x.prop === "gap")
        x.optional = true;
  const checked = new Set(expected.map((x) => x.cls));
  let compared = 0;
  for (const { prop, cls, expected: want, optional } of expected) {
    const actual = v[prop];
    if (actual == null && optional) {
      // The node is in no position to state this — not a disagreement.
      console.log(
        `  – ${cls.padEnd(24)} unchecked (node states no ${figmaProp[prop] ?? prop})`,
      );
    } else if (actual == null) {
      console.error(
        `  ✗ ${cls.padEnd(24)} ${want} in code, but the node sets no ${prop}`,
      );
      drift++;
      compared++;
    } else if (
      typeof want === "number" ? Math.abs(actual - want) > 0.5 : actual !== want
    ) {
      console.error(
        `  ✗ ${cls.padEnd(24)} ${want} in code, ${actual} in Figma`,
      );
      drift++;
      compared++;
    } else {
      console.log(`  ✓ ${cls.padEnd(24)} ${actual}`);
      compared++;
    }
  }
  // Raised by the node rather than by a class, so these are reported after
  // the class list and carry no class to name in the left column.
  const nodeKey = `${e.ref.key}/${e.ref.id}`;
  if (!omissionsReported.has(nodeKey)) {
    omissionsReported.add(nodeKey);
    for (const line of omissions(
      claimsByNode.get(nodeKey) ?? "",
      v,
      resolveToken,
    )) {
      console.error(`  ✗ ${"(unstyled)".padEnd(24)} ${line}`);
      drift++;
      compared++;
    }
  }
  for (const cls of e.classes.split(/\s+/).filter(Boolean))
    if (!checked.has(cls)) console.log(`  – ${cls.padEnd(24)} unchecked`);
  if (compared === 0) {
    // Every class was unchecked and the node volunteered nothing. Saying
    // nothing here would let the run's closing ✓ stand for this element too,
    // which is coverage it does not have.
    nothingChecked.push(e.label);
    console.log("  ! nothing in this element could be checked against Figma");
  }
}

console.log("");
if (uncovered.length)
  for (const [root, names] of groupUncovered(uncovered))
    console.log(
      `– ${names.length} ${root}${names.length === 1 ? "" : "s"} carry no audit table and were not audited: ${names.join(", ")}`,
    );
if (nothingChecked.length)
  console.log(
    `! ${nothingChecked.length} element(s) had nothing checkable against Figma: ${nothingChecked.join(", ")}`,
  );
if (drift) die(`${drift} value(s) drift from Figma.`);
console.log(
  "✓ every checked value matches Figma; unchecked classes are listed above.",
);
