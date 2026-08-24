#!/usr/bin/env node
/*
 * AUDIT: the classnames applied to an element vs the Figma node it was
 * converted from — for arbitrary nodes, which is what a `packages/ui` block
 * is made of. check-components.mjs owns the same comparison for primitive
 * variant sets; nothing owns it for blocks, because the element↔node mapping
 * exists only in the head of whoever did the conversion. This script takes
 * that mapping as input and makes the value comparison deterministic.
 *
 *   FIGMA_TOKEN=figd_… pnpm figma:audit -- --node <url> --classes "h-10 gap-2 bg-primary"
 *   FIGMA_TOKEN=figd_… pnpm figma:audit -- --map audit.json
 *   FIGMA_TOKEN=figd_… pnpm figma:audit -- --node <url>          # dump the node's values
 *
 * audit.json is the class-audit table the figma-page-to-code skill has the
 * converting agent emit: [{ "label": "hero/cta", "node": "<figma url>",
 * "classes": "h-10 px-4 gap-2 bg-primary rounded-md" }, …].
 *
 * DRIFT (✗) = a class resolves to a value the node does not draw; exits 1.
 * UNCHECKED (–) = no rail carries that class (a state prefix, a non-visual
 * utility, a token this cannot resolve); never fails, always listed — a run
 * that only says ✓ would read as coverage it does not have.
 *
 * Values, not names: REST resolves every variable binding before it
 * serializes, so this compares the hex and pixels a viewer sees. A wrong
 * token that resolves to the right value passes here — the variable *names*
 * need file_variables:read, which Figma gates to Enterprise (see pull.mjs).
 * The in-session audit with get_variable_defs remains the stronger check;
 * this is the unattended, re-runnable one.
 */
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import {
  expectations,
  fileKeyFrom,
  normHex,
  radiusResolver,
  toHex8,
  tokenResolver,
} from "./values.mjs";

const pkgDir = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
try {
  process.loadEnvFile(resolve(pkgDir, "../..", ".env"));
} catch {
  // No .env checked in or present — fall through to the ambient environment.
}
const die = (m) => {
  console.error(`✗ ${m}`);
  process.exit(1);
};

const { values: args } = parseArgs({
  options: {
    node: { type: "string" },
    classes: { type: "string" },
    map: { type: "string" },
    file: { type: "string" },
  },
});

const token = process.env.FIGMA_TOKEN;
if (!token)
  die(`No FIGMA_TOKEN. A personal access token with files:read is enough —
   the Enterprise-only file_variables:read gate applies to variable names,
   which this audit deliberately does not read (it compares resolved values).`);

const cfg = JSON.parse(
  await readFile(resolve(pkgDir, "tokens.config.json"), "utf8"),
);
const resolveToken = tokenResolver(
  JSON.parse(await readFile(resolve(pkgDir, "tokens.json"), "utf8")),
);
const resolveRadius = radiusResolver(
  await readFile(resolve(pkgDir, cfg.preamble), "utf8"),
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
if (args.map) {
  const rows = JSON.parse(await readFile(resolve(args.map), "utf8"));
  if (!Array.isArray(rows)) die(`${args.map} is not a JSON array.`);
  for (const [i, row] of rows.entries()) {
    const ref = parseNodeRef(row.node ?? "");
    if (!ref)
      die(
        `Entry ${i} (${row.label ?? "unlabelled"}): cannot read a file key and node id out of "${row.node}".`,
      );
    entries.push({
      label: row.label ?? `entry ${i}`,
      ref,
      classes: row.classes ?? "",
    });
  }
} else if (args.node) {
  const ref = parseNodeRef(args.node);
  if (!ref)
    die(
      `Cannot read a file key and node id out of "${args.node}". Pass a full Figma URL, or --file with a bare node id.`,
    );
  entries.push({ label: args.node, ref, classes: args.classes ?? "" });
} else {
  die(
    'Nothing to audit. Pass --node <url> [--classes "…"] or --map audit.json.',
  );
}

// One request per file key, all ids batched — /nodes is the cheap endpoint,
// and a page audit is one file with many nodes.
const byKey = new Map();
for (const e of entries) {
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
  return {
    type: doc.type,
    name: doc.name,
    fill: fill ? toHex8(fill.color, fill.opacity) : null,
    height: doc.absoluteBoundingBox?.height ?? null,
    width: doc.absoluteBoundingBox?.width ?? null,
    radius: doc.cornerRadius ?? null,
    padX: doc.paddingLeft ?? null,
    padXRight: doc.paddingRight ?? null,
    padY: doc.paddingTop ?? null,
    padYBottom: doc.paddingBottom ?? null,
    gap: doc.itemSpacing ?? null,
  };
}

// Audit-only expectations layered over the shared set: width, vertical
// padding, and text colour on TEXT nodes. These stay here rather than in
// values.mjs because checkValues compares against variant properties that
// have no width or padY, and a shared expectation it cannot meet would
// warn on every primitive.
function auditExpectations(classString, nodeType) {
  const out = expectations(classString, resolveToken, resolveRadius);
  for (const cls of classString.split(/\s+/).filter(Boolean)) {
    if (cls.includes(":")) continue;
    let m;
    if ((m = /^w-(\d+(?:\.\d+)?)$/.exec(cls))) {
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

  const expected = auditExpectations(e.classes, v.type);
  const checked = new Set(expected.map((x) => x.cls));
  for (const { prop, cls, expected: want } of expected) {
    const actual = v[prop];
    if (actual == null) {
      console.error(
        `  ✗ ${cls.padEnd(24)} ${want} in code, but the node sets no ${prop}`,
      );
      drift++;
    } else if (
      typeof want === "number" ? Math.abs(actual - want) > 0.5 : actual !== want
    ) {
      console.error(
        `  ✗ ${cls.padEnd(24)} ${want} in code, ${actual} in Figma`,
      );
      drift++;
    } else {
      console.log(`  ✓ ${cls.padEnd(24)} ${actual}`);
    }
  }
  for (const cls of e.classes.split(/\s+/).filter(Boolean))
    if (!checked.has(cls)) console.log(`  – ${cls.padEnd(24)} unchecked`);
}

console.log("");
if (drift) die(`${drift} value(s) drift from Figma.`);
console.log(
  "✓ every checked value matches Figma; unchecked classes are listed above.",
);
