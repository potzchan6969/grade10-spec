#!/usr/bin/env node
/*
 * CHECK: Figma components vs the code they claim to mirror.
 *
 * Nothing keeps a Figma component set and its cva() honest with each other, and
 * the failure is silent — a renamed variant, an option added on one side only,
 * or a Code Connect template whose node-id stopped resolving all look fine
 * until someone reads the Dev Mode snippet. This diffs the three.
 *
 *   FIGMA_TOKEN=figd_… pnpm run design-sync:check        # unattended, use this in CI
 *   FIGMA_DUMP=~/Downloads/dump.json pnpm run design-sync:check   # manual fallback
 *
 * Locally, put FIGMA_TOKEN in a .env at the repository root instead of
 * prefixing every invocation; see .env.example. CI passes it as a real
 * environment variable and needs no file.
 *
 * ERROR = the mapping is broken and Dev Mode will emit wrong code, OR a value
 *         the code renders disagrees with the one Figma draws; exits 1. A rail
 *         that cannot fail is documentation: Button's `default` painted a 10%
 *         tint against a solid fill for months while this reported it as
 *         advice nobody had to read.
 * WARN  = hygiene, and no claim that anything renders wrongly — a missing
 *         description, an axis option nothing maps to, a Figma component with
 *         no code counterpart. Does not exit 1.
 *
 * Axes are matched through the Code Connect template, not by name: Figma's
 * `Type` is cva's `variant`, and comparing those by name produced a pair of
 * contradicting warnings on every component. See resolveAxis.
 *
 * Values are checked as well as names. Every axis and option could line up while
 * the colours and sizes were wrong — which is exactly what happened to Button,
 * whose variants matched by name for months while `default` painted a 10% tint
 * against a design that specifies a solid fill. See checkValues.
 *
 * Base states only: hover, disabled, and loading values are never compared, so
 * a state expressed as an opacity over the variant's own colours is invisible
 * here — the bg-* token this reads is unchanged by it.
 */
import { appendFile, readdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  expectations,
  fileKeyFrom,
  omissions,
  radiusResolver,
  toHex8,
  tokenResolver,
} from "./values.mjs";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
// The design system owns the token data these scripts resolve against; the
// scripts themselves are repository tooling, because they read both packages.
const dsDir = resolve(repoRoot, "packages/design-system");

// A repository-root .env is a convenience for humans; CI passes the token as a
// real environment variable and has no file. loadEnvFile throws when the file
// is absent, which is the normal case in CI, so the miss is not an error.
try {
  process.loadEnvFile(resolve(repoRoot, ".env"));
} catch {
  // No .env checked in or present — fall through to the ambient environment.
}
const die = (m) => {
  console.error(`✗ ${m}`);
  process.exit(1);
};

// ── where the Figma side comes from ─────────────────────────────────────────
// Two sources, same normalized shape: { id -> { id, name, properties } }.
//
// REST is the default because it needs no human. The variables pull cannot use
// REST — /v1/files/:key/variables/local needs file_variables:read, which Figma
// gates to Enterprise (see scripts/tokens-sync/figma-plugins/pull.mjs) — but that gate is specific
// to variables. Component property definitions live in the file document, which
// only needs the standard files:read scope, so this check can run unattended
// even though the token pull cannot.
//
// A check that cannot reach Figma must fail, never pass quietly: an unenforced
// check is worse than no check, because it reads as coverage.
function componentsFromDocument(doc) {
  const out = {};
  // Every node, by id, so a template aimed at something that is not a
  // component can say what it actually hit instead of reporting a deletion.
  const nodes = {};
  const visit = (node, parent) => {
    nodes[node.id] = { type: node.type, name: node.name };
    // A COMPONENT_SET's children are its variants, so index the set and not
    // each variant. A COMPONENT found anywhere else is a standalone component
    // with no variant axes — List, List Item and Radio List are all drawn that
    // way — and a template maps one by node ID exactly as it maps a set.
    // Indexing sets alone left every such template reported as "not found in
    // Figma", which read as deletion rather than as a blind spot here.
    const isVariantOfSet = parent?.type === "COMPONENT_SET";
    const isSet = node.type === "COMPONENT_SET";
    if (isSet || (node.type === "COMPONENT" && !isVariantOfSet)) {
      out[node.id] = {
        id: node.id,
        name: node.name,
        properties: node.componentPropertyDefinitions ?? {},
        // Each child of a set is one variant, named `Type=Danger, State=...`.
        // REST resolves every binding, so these are the values a viewer sees —
        // which is what makes a value check possible without the variables
        // endpoint, whose file_variables:read scope Figma gates to Enterprise.
        //
        // A standalone component has no variants; checkValues skips it, which
        // is correct — there is no second rung to diff its geometry against.
        variants: isSet
          ? (node.children ?? []).map((v) => ({
              name: v.name,
              fill: v.fills?.find(
                (f) => f.visible !== false && f.type === "SOLID",
              ),
              // Read for the same reason as the fill and on the same terms:
              // every variant states `strokes`, so an empty one is the design
              // saying this variant draws no border. See omissions().
              stroke: v.strokes?.find(
                (x) => x.visible !== false && x.type === "SOLID",
              ),
              // A gradient or image fill paints the variant without resolving
              // to one hex; omissions() reads this so it does not call that a
              // missing fill.
              fillUncomparable: (v.fills ?? []).some(
                (f) => f.visible !== false && f.type !== "SOLID",
              ),
              height: v.absoluteBoundingBox?.height,
              radius: v.cornerRadius,
              padX: v.paddingLeft,
              gap: v.itemSpacing,
            }))
          : [],
      };
    }
    for (const child of node.children ?? []) visit(child, node);
  };
  visit(doc, null);
  return { components: out, nodes };
}

async function loadFigmaComponents() {
  if (process.env.FIGMA_DUMP) {
    const meta = JSON.parse(
      await readFile(resolve(repoRoot, process.env.FIGMA_DUMP), "utf8"),
    ).meta;
    if (!meta?.components)
      die(`This dump has no \`meta.components\` — it predates component support.
     Rebuild the plugin (pnpm tokens:plugin dump) and take a fresh dump.`);
    return {
      source: `dump ${process.env.FIGMA_DUMP}`,
      components: meta.components,
      // A plugin dump carries no document, so nothing can say what a stray
      // node-id actually points at; those stay reported as absent.
      nodes: {},
    };
  }

  const token = process.env.FIGMA_TOKEN;
  if (!token)
    die(`No Figma source. Set FIGMA_TOKEN (preferred — runs unattended in CI):

     FIGMA_TOKEN=figd_… pnpm run design-sync:check

   A personal access token with the \`files:read\` scope is enough; the
   Enterprise-only \`file_variables:read\` gate applies to the token pull, not
   to this check. Or fall back to the manual plugin dump:

     FIGMA_DUMP=~/Downloads/figma-dump.json pnpm run design-sync:check`);

  const spec = process.env.FIGMA_FILE ?? cfg.figmaFile;
  if (!spec) die("No figmaFile in tokens.config.json and no FIGMA_FILE set.");
  const key = fileKeyFrom(spec);
  if (!key) die(`Could not read a file key out of figmaFile: ${spec}`);

  const res = await fetch(`https://api.figma.com/v1/files/${key}`, {
    headers: { "X-Figma-Token": token },
  });
  if (!res.ok)
    die(
      `Figma REST ${res.status} ${res.statusText} for file ${key}. ` +
        `A 403 usually means the token lacks files:read or cannot see this file; ` +
        `a 404 usually means the key is wrong (branch URLs resolve to the branch key).`,
    );
  const json = await res.json();
  if (!json.document) die(`Figma REST returned no document for file ${key}.`);
  const { components, nodes } = componentsFromDocument(json.document);
  // Descriptions do not live on the document nodes — they sit in the sibling
  // `components` / `componentSets` maps of the same response, so the check
  // costs no second request and no extra scope.
  for (const [id, meta] of [
    ...Object.entries(json.componentSets ?? {}),
    ...Object.entries(json.components ?? {}),
  ])
    if (components[id])
      components[id].description = (meta.description ?? "").trim();
  if (!Object.keys(components).length)
    die(
      `No COMPONENT or COMPONENT_SET nodes found in file ${key}. Either the ` +
        `file has none, or the response shape changed — failing rather than ` +
        `reporting "no drift".`,
    );
  return { source: `REST ${key}`, components, nodes };
}

const cfg = JSON.parse(
  await readFile(resolve(dsDir, "tokens.config.json"), "utf8"),
);
const {
  source: figmaSource,
  components: figmaComponents,
  nodes: figmaNodes,
} = await loadFigmaComponents();

// ── source scanning ─────────────────────────────────────────────────────────
// Two trees, not one. The primitives are the components this package owns, and
// scanning them alone left the `packages/ui` block templates unread by anything
// — not their node IDs, not their axes — while their Figma sets reported "no
// code component" because the basename lookup could not see the block files.
// `code-connect:publish` parsing them was the only automated read they got.
//
// Blocks carry no cva, so the axis and value comparisons below find nothing to
// diff and skip; what the blocks gain here is node-ID resolution, the template
// prop check, and the description check.
const TREES = [
  resolve(dsDir, "src/components"),
  resolve(repoRoot, "packages/ui/src/blocks"),
];
async function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (err) {
    // A tree that is not checked out is not a failure; a tree that is there
    // and unreadable is.
    if (err?.code === "ENOENT") return out;
    throw err;
  }
  for (const entry of entries) {
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(path)));
    else out.push(path);
  }
  return out;
}
const files = (await Promise.all(TREES.map(walk))).flat();
const rel = (p) => p.slice(repoRoot.length + 1);

// ── a brace matcher that ignores braces inside strings ──────────────────────
// Tailwind class strings are full of [] () {} — counting them would desync.
function sliceBalanced(src, openIdx) {
  let depth = 0;
  for (let i = openIdx; i < src.length; i++) {
    const ch = src[i];
    if (ch === '"' || ch === "'" || ch === "`") {
      for (i++; i < src.length; i++) {
        if (src[i] === "\\") {
          i++;
          continue;
        }
        if (src[i] === ch) break;
      }
      continue;
    }
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return src.slice(openIdx + 1, i);
    }
  }
  return "";
}

/*
 * Comments out of an object-literal body, strings left alone.
 *
 * Every key matcher below is a bare `word:` regex, and prose is full of those.
 * `// … utilities cannot express that: theme.preamble.css` inside button.tsx's
 * `size` variant parsed as an option named `that`, which surfaced as the
 * nonsense warning "size -> cva size: that exist in code but no Figma option
 * maps to them" — and a phantom option sitting next to a real code-only rung is
 * exactly the noise this check exists to remove. Comments cannot be stripped
 * from a whole file, because the template parser reads `// url=` out of one, so
 * this runs per body instead.
 */
function stripComments(body) {
  let out = "";
  for (let i = 0; i < body.length; i++) {
    const ch = body[i];
    if (ch === '"' || ch === "'" || ch === "`") {
      const start = i;
      for (i++; i < body.length; i++) {
        if (body[i] === "\\") {
          i++;
          continue;
        }
        if (body[i] === ch) break;
      }
      out += body.slice(start, i + 1);
      continue;
    }
    if (ch === "/" && body[i + 1] === "/") {
      const end = body.indexOf("\n", i);
      if (end === -1) return out;
      out += "\n";
      i = end;
      continue;
    }
    if (ch === "/" && body[i + 1] === "*") {
      const end = body.indexOf("*/", i + 2);
      if (end === -1) return out;
      out += " ";
      i = end + 1;
      continue;
    }
    out += ch;
  }
  return out;
}

// top-level `key: {...}` pairs of an object literal body
function objectKeys(rawBody) {
  const body = stripComments(rawBody);
  const out = {};
  let i = 0;
  while (i < body.length) {
    const ch = body[i];
    // Keys are matched BEFORE strings are skipped: hyphenated keys have to be
    // quoted ("icon-xs":), and skipping them as string literals would drop them
    // from the axis silently.
    const m = /^(["']?)([A-Za-z0-9_-]+)\1\s*:/.exec(body.slice(i));
    if (!m && (ch === '"' || ch === "'" || ch === "`")) {
      for (i++; i < body.length; i++) {
        if (body[i] === "\\") {
          i++;
          continue;
        }
        if (body[i] === ch) break;
      }
      i++;
      continue;
    }
    if (!m && (ch === "{" || ch === "[" || ch === "(")) {
      const inner = ch === "{" ? sliceBalanced(body, i) : null;
      i += inner === null ? 1 : inner.length + 2;
      continue;
    }
    if (m) {
      const after = i + m[0].length;
      const ws = body.slice(after).search(/\S/);
      if (body[after + ws] === "{") {
        out[m[2]] = sliceBalanced(body, after + ws);
        i = after + ws + out[m[2]].length + 2;
        continue;
      }
      out[m[2]] = null;
      i = after;
      continue;
    }
    i++;
  }
  return out;
}

// component file -> { axis: [options] } from every cva() in it
function cvaAxes(src) {
  const axes = {};
  let from = 0;
  for (;;) {
    const at = src.indexOf("cva(", from);
    if (at === -1) break;
    from = at + 4;
    const open = src.indexOf("{", at);
    if (open === -1) break;
    const config = sliceBalanced(src, open);
    const variants = objectKeys(config).variants;
    if (!variants) continue;
    for (const [axis, body] of Object.entries(objectKeys(variants))) {
      if (body === null) continue;
      axes[axis] = Object.keys(objectKeys(body));
    }
  }
  return axes;
}

// component file -> { axis: { option: "class string" } } and the cva defaults.
// cvaAxes above needs only the option names; the value check needs the classes
// behind them, and which option applies when a prop is omitted.
function cvaClasses(src) {
  const axes = {};
  const defaults = {};
  let baseClasses = "";
  let from = 0;
  for (;;) {
    const at = src.indexOf("cva(", from);
    if (at === -1) break;
    from = at + 4;
    const open = src.indexOf("{", at);
    if (open === -1) break;
    const config = sliceBalanced(src, open);
    const top = objectKeys(config);
    if (!top.variants) continue;
    // The base string is the first argument: everything cva applies whatever
    // the axes say. A fill declared there is claimed for every variant, so
    // omissions() has to see it or it reports every variant as unclaimed.
    const baseLiteral = /^\s*"((?:[^"\\]|\\.)*)"/.exec(src.slice(at + 4));
    if (baseLiteral) baseClasses = baseLiteral[1];
    for (const [axis, body] of Object.entries(objectKeys(top.variants))) {
      if (body === null) continue;
      const options = {};
      const re = /(["']?)([A-Za-z0-9_-]+)\1\s*:\s*"((?:[^"\\]|\\.)*)"/g;
      let m;
      while ((m = re.exec(body))) options[m[2]] = m[3];
      axes[axis] = options;
    }
    for (const [axis, value] of Object.entries(
      enumPairs(top.defaultVariants ?? ""),
    ))
      defaults[axis] = value;
  }
  return { axes, defaults, baseClasses };
}

// flat `Key: <scalar>` pairs — getEnum maps are always flat, so this stays
// simple where objectKeys has to handle nested cva bodies.
function enumPairs(rawBody) {
  const body = stripComments(rawBody);
  const out = {};
  const re =
    /(["']?)([A-Za-z0-9_ -]+)\1\s*:\s*(?:"([^"]*)"|'([^']*)'|(true|false|null))/g;
  let m;
  while ((m = re.exec(body))) {
    out[m[2].trim()] =
      m[3] ??
      m[4] ??
      (m[5] === "true" ? true : m[5] === "false" ? false : null);
  }
  return out;
}

// Which cva axis does a Figma axis correspond to?
//
// Not by name — Figma calls it `Type`, cva calls it `variant`, and comparing
// those produced two mutually-contradicting warnings on every component, which
// is how a real Danger/destructive mismatch once hid inside the noise. The
// template already states the correspondence: getEnum('Type', {Danger:
// 'destructive'}) says this axis produces cva values. So infer the axis from
// the values it emits, and the alias needs no config to drift out of date.
//
// A map producing no strings (a boolean gate such as Loading -> loading) is not
// an axis mapping at all and resolves to null.
function resolveAxis(codeAxes, pairs) {
  const values = Object.values(pairs).filter((v) => typeof v === "string");
  if (!values.length) return null;
  let best = null;
  let bestHits = 0;
  for (const [axis, options] of Object.entries(codeAxes)) {
    const hits = values.filter((v) => options.includes(v)).length;
    if (hits > bestHits) {
      best = axis;
      bestHits = hits;
    }
  }
  return best ? { axis: best, values } : null;
}

const norm = (s) => s.replace(/[^a-z0-9]/gi, "").toLowerCase();
// Figma library folders (`Product / Product Card`) are not part of the
// basename. Try the full name, then the local name after the last ` / `.
function codeForFigmaName(figmaName) {
  const local = figmaName.includes(" / ")
    ? figmaName.slice(figmaName.lastIndexOf(" / ") + 3)
    : figmaName;
  return codeComponents.get(norm(figmaName)) ?? codeComponents.get(norm(local));
}
// ── the description a designer wrote, and its only projection in code ───────
// A set's description reaches code through nothing at all: no token pull, no
// template, no generated file. The JSDoc opening the component is where it is
// copied by hand, so a description edited in Figma stays invisible until
// somebody happens to read both. It cannot be compared verbatim — prose is
// rewrapped to the line width and code notes follow it — so this asserts what
// the skills actually ask for: the JSDoc opens with the description, and its
// first sentence is still in there.
const DOC_BLOCK = /\/\*\*[\s\S]*?\*\//g;
function docText(src) {
  return (src.match(DOC_BLOCK) ?? [])
    .map((b) =>
      b
        .replace(/^\/\*\*/, "")
        .replace(/\*\/$/, "")
        .replace(/^[ \t]*\*[ \t]?/gm, ""),
    )
    .join("\n");
}
// Comparison form: letters and digits only, single-spaced. Line wrapping,
// punctuation style, and back-tick emphasis all differ between a Figma field
// and a doc comment, and none of those differences is drift.
const flatten = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
const firstSentence = (s) => {
  const line = s.replace(/\s+/g, " ").trim();
  const stop = /[.!?](\s|$)/.exec(line);
  return stop ? line.slice(0, stop.index + 1) : line;
};
/*
 * Not everything in the description field is a description, and the two
 * exceptions must not be copied into a doc comment:
 *
 * - `keywords`: the comma-separated search terms Figma seeds library
 *   components with ("chevron, directional, pointer"). Search metadata.
 * - `attribution`: a bare upstream link, which says where the component came
 *   from rather than what it is.
 *
 * Both are reported to the designer as a missing description rather than
 * demanded of the code.
 */
function descriptionKind(desc) {
  if (!desc) return "none";
  if (/^https?:\/\/\S+$/.test(desc)) return "attribution";
  if (/^based on\b/i.test(desc) && /https?:\/\//.test(desc))
    return "attribution";
  const parts = desc.split(",");
  if (
    !/[.!?]/.test(desc) &&
    parts.length > 1 &&
    parts.every((p) => p.trim().split(/\s+/).length <= 4)
  )
    return "keywords";
  return "prose";
}

const codeComponents = new Map(); // normalized name -> { file, axes, docs }
for (const f of files) {
  if (!f.endsWith(".tsx") || f.endsWith(".stories.tsx")) continue;
  const base = f
    .split("/")
    .pop()
    .replace(/\.tsx$/, "");
  const src = await readFile(f, "utf8");
  const { axes: classes, defaults, baseClasses } = cvaClasses(src);
  codeComponents.set(norm(base), {
    file: rel(f),
    axes: cvaAxes(src),
    baseClasses,
    classes,
    defaults,
    docs: docText(src),
    source: src,
  });
}

// A component whose own file only re-exports it — `export { PaginationNext }
// from "./pagination"` — has no JSDoc to carry a description, and the
// documentation it should be compared against lives in the module it points
// at. Follow one hop, so the check reads the docs that exist rather than the
// file that merely shares the component's basename.
const REEXPORT = /export\s*\{[^}]*\}\s*from\s*["']\.\/([\w.-]+)["']/;
for (const entry of codeComponents.values()) {
  if (entry.docs.trim()) continue;
  const target = REEXPORT.exec(entry.source)?.[1];
  if (!target) continue;
  const hit = codeComponents.get(norm(target.replace(/\.tsx?$/, "")));
  if (hit?.docs.trim()) entry.docs = hit.docs;
}

const resolveToken = tokenResolver(
  JSON.parse(await readFile(resolve(dsDir, "tokens.json"), "utf8")),
);
const resolveRadius = radiusResolver(
  await readFile(resolve(dsDir, cfg.preamble), "utf8"),
  cfg,
  resolveToken,
);

// `Type=Danger, State=Default, Size=default` -> { Type: 'Danger', ... }
const variantKey = (name) =>
  Object.fromEntries(
    name.split(",").map((part) => {
      const [k, ...v] = part.split("=");
      return [k.trim(), v.join("=").trim()];
    }),
  );

/*
 * Compares the values behind the names, for one component.
 *
 * A variant is only comparable when every axis other than the one under test
 * sits at its base option, or a Disabled variant's grey would be diffed against
 * the default fill. Base is derived, never hardcoded: for a mapped axis it is
 * the option producing the cva defaultVariant, and for a boolean gate it is the
 * option every map reports false for — `State=Default` is neither disabled nor
 * loading, and the template already says so.
 */
function checkValues(comp, tpl, code, report) {
  if (!comp.variants?.length) return;

  const base = {};
  for (const map of tpl?.maps ?? []) {
    const resolved = resolveAxis(code.axes, map.pairs);
    if (resolved) {
      const want = code.defaults[resolved.axis];
      const hit = Object.entries(map.pairs).find(([, v]) => v === want);
      if (hit) base[map.axis] = hit[0];
    } else {
      // Every boolean map for this axis has to agree the option is off. That
      // can leave more than one candidate: `Hover` emits no props either, since
      // it is a CSS pseudo-state with nothing behind it. Comparing against it
      // would diff the hover tint, so prefer the option Figma names `Default`
      // and refuse to guess when neither that nor a single candidate exists.
      const maps = (tpl?.maps ?? []).filter((x) => x.axis === map.axis);
      const candidates = Object.keys(map.pairs).filter((option) =>
        maps.every((x) => x.pairs[option] === false),
      );
      // Case-insensitively: the file has since lowercased every option name, so
      // matching `Default` literally skipped the value check on every set whose
      // interaction axis is `default`/`hover` — which is now all of them.
      const chosen =
        candidates.find((o) => o.toLowerCase() === "default") ??
        (candidates.length === 1 ? candidates[0] : null);
      if (chosen) base[map.axis] = chosen;
      else if (candidates.length)
        report.warns.push(
          `${comp.name}.${map.axis}: cannot tell which of ${candidates.join(", ")} is the base state, so values are unchecked`,
        );
    }
  }

  for (const map of tpl?.maps ?? []) {
    const resolved = resolveAxis(code.axes, map.pairs);
    if (!resolved) continue;
    for (const [figmaOption, cvaOption] of Object.entries(map.pairs)) {
      const classString = code.classes[resolved.axis]?.[cvaOption];
      if (!classString) continue;

      const wanted = { ...base, [map.axis]: figmaOption };
      const variant = comp.variants.find((v) => {
        const key = variantKey(v.name);
        return Object.entries(wanted).every(([k, val]) => key[k] === val);
      });
      if (!variant) continue;

      for (const { prop, cls, expected } of expectations(
        classString,
        resolveToken,
        resolveRadius,
      )) {
        const actual =
          prop === "fill"
            ? variant.fill
              ? toHex8(variant.fill.color, variant.fill.opacity)
              : null
            : variant[prop];
        const label = `${comp.name} ${map.axis}=${figmaOption}`;
        // Every value mismatch is recorded twice on purpose: as a warning
        // string for the console, and structurally for the job summary. A
        // designer reading the summary needs the numbers in columns, and
        // re-parsing the prose back out of the warning would be worse.
        if (actual == null) {
          const message = `${label}: code says ${cls} (${expected}) but the Figma variant sets no ${prop}`;
          report.errors.push(message);
          report.diffs.push({
            message,
            component: comp.name,
            variant: `${map.axis}=${figmaOption}`,
            prop,
            cls,
            code: expected,
            figma: null,
          });
        } else if (
          typeof expected === "number"
            ? Math.abs(actual - expected) > 0.5
            : actual !== expected
        ) {
          const message = `${label}: ${cls} is ${expected} in code but ${actual} in Figma`;
          report.errors.push(message);
          report.diffs.push({
            message,
            component: comp.name,
            variant: `${map.axis}=${figmaOption}`,
            prop,
            cls,
            code: expected,
            figma: actual,
          });
        } else {
          report.ok.push(`${label}: ${cls} matches Figma ${prop} ${actual}`);
        }
      }

      // Everything above is raised BY a class, so a fill this variant draws
      // and the cva config never names is compared against nothing. Ask the
      // variant instead. Same rule, same module, as the audit tables use.
      //
      // The claim is the union of the base string and EVERY axis that applies
      // to this variant, not the one axis being iterated: a `size` option
      // holds `h-*` and `px-*` and can never name a colour, so asking it
      // alone would report every size variant of every component as
      // unclaimed. The same union the audit tables take across the elements
      // that render one node.
      const label = `${comp.name} ${map.axis}=${figmaOption}`;
      const claims = [code.baseClasses ?? ""];
      for (const other of tpl?.maps ?? []) {
        const otherAxis = resolveAxis(code.axes, other.pairs);
        const otherOption = other.pairs[wanted[other.axis]];
        if (otherAxis && otherOption != null)
          claims.push(code.classes[otherAxis.axis]?.[otherOption] ?? "");
      }
      for (const line of omissions(
        claims.join(" "),
        {
          type: "COMPONENT",
          fill: variant.fill
            ? toHex8(variant.fill.color, variant.fill.opacity)
            : null,
          stroke: variant.stroke
            ? toHex8(variant.stroke.color, variant.stroke.opacity)
            : null,
          fillUncomparable: !variant.fill && variant.fillUncomparable,
        },
        resolveToken,
      )) {
        const message = `${label}: the variant ${line}`;
        report.errors.push(message);
        report.diffs.push({
          message,
          component: comp.name,
          variant: `${map.axis}=${figmaOption}`,
          prop: "fill",
          cls: "(unstyled)",
          code: null,
          figma: null,
        });
      }
    }
  }
}

/*
 * The prop names a template's example emits, and which of them a component is
 * allowed not to name.
 *
 * Nothing else reads them. Every check below compares axes and option values,
 * so a template naming a prop the component has since dropped is a clean run —
 * and six templates emitted exactly that after the `shape-ui-block-copy`
 * reshape folded a component's words into one `copy` object. The snippet a
 * designer copies out of Dev Mode then does not compile, and the run says
 * nothing.
 *
 * A JSX attribute is `name={` or `name="`. An identifier followed by a space
 * and `=` is an assignment or a comparison in the template's own code
 * (`const variant =`, `variant === "default"`) and is deliberately not matched.
 */
const JSX_ATTR = /[\s`{]([a-zA-Z][\w-]*)=(?:\{|")/g;
function emittedProps(src) {
  const out = new Set();
  JSX_ATTR.lastIndex = 0;
  let m;
  while ((m = JSX_ATTR.exec(src))) out.add(m[1]);
  return [...out];
}
// Props a component accepts without ever naming them, by spreading
// `ComponentProps<"a">` and friends. `href` is the live example: link.figma.ts
// emits it and link.tsx never writes the word, so checking these would report
// drift on a component that is entirely correct.
const INHERITED = new Set(
  `className style id href target rel type name value placeholder checked
   defaultChecked defaultValue disabled required readOnly autoFocus maxLength
   min max step src alt title width height role tabIndex key ref children
   htmlFor form onClick onChange onBlur onFocus onInput onSubmit onKeyDown
   onKeyUp onMouseEnter onMouseLeave onPointerDown`.split(/\s+/),
);
const inheritedProp = (p) =>
  INHERITED.has(p) || p.startsWith("aria-") || p.startsWith("data-");

// ── Code Connect templates ──────────────────────────────────────────────────
const templates = [];
for (const f of files) {
  if (!f.endsWith(".figma.ts")) continue;
  const src = await readFile(f, "utf8");
  const url = /^\/\/ url=(.*)$/m.exec(src)?.[1]?.trim();
  const nodeId = /node-id=([\d]+[-:][\d]+)/
    .exec(url ?? "")?.[1]
    ?.replace("-", ":");
  // Both halves of each getEnum: the Figma options it covers, and the code
  // values it produces. The values are what let the axis alias be inferred
  // instead of hand-maintained — see resolveAxis.
  const enums = {};
  const maps = [];
  const re = /getEnum\(\s*['"]([^'"]+)['"]\s*,\s*\{/g;
  let m;
  while ((m = re.exec(src))) {
    const body = sliceBalanced(src, re.lastIndex - 1);
    const pairs = enumPairs(body);
    enums[m[1]] = Object.keys(pairs);
    maps.push({ axis: m[1], pairs });
  }
  // Every template carries a `// source=` header naming the component file it
  // stands for, which is a firmer link than re-deriving one from the node.
  const source = /^\/\/ source=(.*)$/m.exec(src)?.[1]?.trim();
  templates.push({
    file: rel(f),
    url,
    nodeId,
    enums,
    maps,
    source,
    props: emittedProps(src),
  });
}

// ── compare ─────────────────────────────────────────────────────────────────
const errors = [];
const warns = [];
const ok = [];
// Value mismatches in structured form, for the GitHub job summary. The console
// report is written for whoever ran the command; the summary is written for a
// designer who will only ever see the Actions page.
const diffs = [];
// Sets whose description field holds something that is not a description —
// search keywords, a bare attribution, or nothing. Aggregated rather than
// warned one by one: this is a list for the designer who owns the file, and
// most of the library is on it.
const describedGaps = [];
const figma = Object.values(figmaComponents);
const figmaById = Object.fromEntries(figma.map((c) => [c.id, c]));

// Only the REST document carries the variant nodes values are read from. A
// plugin dump reaches this far but silently checks names only, which would read
// as full coverage, so say so.
if (figma.length && !figma.some((c) => c.variants?.length))
  warns.push(
    `${figmaSource} carries no variant nodes, so colours and geometry went unchecked. ` +
      `Use FIGMA_TOKEN for the value checks.`,
  );

for (const comp of figma) {
  const variantAxes = Object.fromEntries(
    Object.entries(comp.properties)
      .filter(([, d]) => d.type === "VARIANT")
      .map(([name, d]) => [name, d.variantOptions ?? []]),
  );
  const code = codeForFigmaName(comp.name);
  if (!code) {
    const local = comp.name.includes(" / ")
      ? comp.name.slice(comp.name.lastIndexOf(" / ") + 3)
      : comp.name;
    warns.push(
      `${comp.name}: no code component (looked for src/components/**/${norm(comp.name)}.tsx or ${norm(local)}.tsx)`,
    );
    continue;
  }
  // The description, which no rail carries: the JSDoc is its only projection.
  if (comp.description !== undefined) {
    const kind = descriptionKind(comp.description);
    if (kind === "prose") {
      const opening = firstSentence(comp.description);
      if (flatten(code.docs).includes(flatten(opening)))
        ok.push(`${comp.name}: description carried into ${code.file}`);
      // Deliberately not "open the JSDoc with this": a description field can
      // hold a note to nobody in particular ("Master Component Radix -
      // Dialog"), and copying that into a doc comment would be worse than
      // the gap. Either side can be the one that is wrong.
      else
        warns.push(
          `${comp.name}: description "${opening}" is not in ${code.file} — carry it into the JSDoc, or fix the description in Figma`,
        );
    } else {
      describedGaps.push({ name: comp.name, kind });
    }
  }

  // The template for this component, if any — it carries the axis aliases.
  const tpl = templates.find((t) => t.nodeId === comp.id);
  const reachedAxes = new Set();

  for (const [axis, options] of Object.entries(variantAxes)) {
    const map = tpl?.maps.find((x) => x.axis === axis);
    if (!map) {
      warns.push(
        `${comp.name}.${axis}: no getEnum('${axis}') in any template — this Figma axis reaches no code prop`,
      );
      continue;
    }
    const resolved = resolveAxis(code.axes, map.pairs);
    if (!resolved) {
      // Boolean gate rather than an axis (Loading -> loading). Nothing to diff
      // against a cva axis, and that is legitimate.
      ok.push(`${comp.name}.${axis}: mapped to a non-variant prop`);
      continue;
    }
    reachedAxes.add(resolved.axis);

    // Values the template emits that the cva cannot honour. This is the check
    // that name-matching could never make, and it is an error: Dev Mode would
    // emit a prop value the component does not accept.
    const bogus = [
      ...new Set(
        resolved.values.filter((v) => !code.axes[resolved.axis].includes(v)),
      ),
    ];
    if (bogus.length)
      errors.push(
        `${comp.name}.${axis} -> cva ${resolved.axis}: emits ${bogus.join(", ")}, which ${code.file} does not define`,
      );

    // cva options no Figma option can produce: code-only surface.
    const unreachable = code.axes[resolved.axis].filter(
      (o) => !resolved.values.includes(o),
    );
    if (unreachable.length)
      warns.push(
        `${comp.name}.${axis} -> cva ${resolved.axis}: ${unreachable.join(", ")} exist in code but no Figma option maps to them`,
      );

    if (!bogus.length && !unreachable.length)
      ok.push(
        `${comp.name}.${axis} -> cva ${resolved.axis}: ${options.length} option(s) matched`,
      );
  }

  for (const axis of Object.keys(code.axes)) {
    if (!reachedAxes.has(axis))
      warns.push(
        `${comp.name}: cva axis '${axis}' in ${code.file} is reachable from no Figma variant property`,
      );
  }

  checkValues(comp, tpl, code, { ok, warns, errors, diffs });
}

for (const t of templates) {
  if (!t.nodeId) {
    errors.push(
      `${t.file}: no node-id in the url= comment — publish will fail validation`,
    );
    continue;
  }
  const comp = figmaById[t.nodeId];
  if (!comp) {
    // Absent and present-but-not-a-component are different faults with
    // different fixes, and calling the second one a deletion sends whoever
    // reads it looking for a node that is sitting right there. Code Connect
    // resolves published components, so a template aimed at a frame maps
    // nothing however well-formed it is.
    const node = figmaNodes[t.nodeId];
    if (node)
      warns.push(
        `${t.file}: node-id ${t.nodeId} is a ${node.type} ("${node.name}"), not a component or component set — Code Connect resolves only published components, so repoint it at one`,
      );
    else
      errors.push(
        `${t.file}: node-id ${t.nodeId} not found in Figma — the component was deleted or replaced`,
      );
    continue;
  }
  ok.push(`${t.file}: node-id ${t.nodeId} -> ${comp.name}`);
  for (const [axis, mapped] of Object.entries(t.enums)) {
    const options = comp.properties[axis]?.variantOptions;
    if (!options) {
      errors.push(
        `${t.file}: getEnum('${axis}') but ${comp.name} has no such VARIANT property`,
      );
      continue;
    }
    const unmapped = options.filter((o) => !mapped.includes(o));
    if (unmapped.length) {
      errors.push(
        `${t.file}: getEnum('${axis}') is missing ${unmapped.join(", ")} — those resolve to undefined`,
      );
    } else
      ok.push(
        `${t.file}: getEnum('${axis}') covers all ${options.length} options`,
      );
  }
}

// ── the props a template emits vs the component that must accept them ───────
// Presence of the identifier in the component file, not a resolved type: props
// arrive through a type alias, an intersection, or a re-export, and following
// all three would be a type checker. Presence is enough to catch the failure
// this exists for — a prop that was renamed or folded away entirely — while an
// inherited DOM prop is skipped rather than guessed at.
for (const t of templates) {
  if (!t.source) {
    warns.push(`${t.file}: no // source= header, so its props went unchecked`);
    continue;
  }
  const base = t.source
    .split("/")
    .pop()
    .replace(/\.tsx$/, "");
  const code = codeComponents.get(norm(base));
  if (!code) {
    warns.push(
      `${t.file}: source=${t.source} is not a component file this check can read`,
    );
    continue;
  }
  const missing = t.props.filter(
    (p) =>
      !inheritedProp(p) &&
      !new RegExp(`(?<![\\w$])${p.replace(/[^\w-]/g, "")}(?![\\w$])`).test(
        code.source,
      ),
  );
  if (missing.length)
    warns.push(
      `${t.file}: emits ${missing.join(", ")}, which ${code.file} does not name — the Dev Mode snippet would not compile`,
    );
  else ok.push(`${t.file}: every prop it emits exists in ${code.file}`);
}

// ── job summary ─────────────────────────────────────────────────────────────
// The console report above is for whoever ran the command. A designer never
// does: they need the same numbers on a web page, which on GitHub means the
// step summary. Written before the error exit below, or a failing run — the
// one most worth reading — would publish nothing.
const PROP_LABELS = {
  fill: "Background",
  height: "Height",
  padX: "Horizontal padding",
  gap: "Gap",
  radius: "Corner radius",
};
const unit = (prop, value) =>
  value == null ? "_not set_" : prop === "fill" ? `\`${value}\`` : `${value}px`;

async function writeSummary() {
  const path = process.env.GITHUB_STEP_SUMMARY;
  if (!path) return;

  const md = [
    "## Design sync — Figma vs code",
    "",
    `\`${figmaSource}\` · ${figma.length} Figma component(s) · ${codeComponents.size} code component(s) · ${templates.length} template(s)`,
    "",
  ];

  if (diffs.length) {
    md.push(
      `### ⚠ ${diffs.length} value(s) differ`,
      "",
      "What the code renders against what the Figma variant draws.",
      "",
      "| Component | Variant | Property | Code | Figma |",
      "| --- | --- | --- | --- | --- |",
      ...diffs.map(
        (d) =>
          `| ${d.component} | \`${d.variant}\` | ${PROP_LABELS[d.prop] ?? d.prop} (\`${d.cls}\`) | ${unit(d.prop, d.code)} | ${unit(d.prop, d.figma)} |`,
      ),
      "",
      "A row here is not automatically a bug — the code may be right and the Figma file stale, or the difference deliberate. It is a disagreement someone has to settle.",
      "",
    );
  } else {
    md.push(
      "### ✓ No value differences",
      "",
      "Every checked background, height, horizontal padding, gap and corner radius matches.",
      "",
    );
  }

  // Stated every run, passing or not. The narrow scope of the value check is
  // the thing most likely to be mistaken for full coverage.
  md.push(
    "<details><summary>What this did and did not check</summary>",
    "",
    "Checked: each variant's own background, height, horizontal padding, gap and corner radius, at the base option of every axis.",
    "",
    "Not checked: vertical and per-side padding, anything inside the component (label colour, icon size, borders, type), and the hover, disabled and loading states. Values come from the utility classes the code declares, not from a rendered page, so a layout that is wrong on screen for some other reason still passes.",
    "",
    "</details>",
    "",
  );

  // Everything the value table does not already show. Matched by exact
  // message, not by component name — a component with a value diff can still
  // have an unrelated structural warning, and prefix matching would swallow it.
  const shown = new Set(diffs.map((d) => d.message));
  const other = warns.filter((w) => !shown.has(w));
  if (errors.length) {
    md.push(
      `### ✗ ${errors.length} error(s) — Dev Mode will emit wrong code`,
      "",
      ...errors.map((e) => `- ${e}`),
      "",
    );
  }
  if (other.length) {
    md.push(
      `### Structural warnings (${other.length})`,
      "",
      ...other.map((w) => `- ${w}`),
      "",
    );
  }

  await appendFile(path, `${md.join("\n")}\n`);
}

// ── report ──────────────────────────────────────────────────────────────────
console.log(
  `Source: ${figmaSource}\nFigma: ${figma.length} component(s) · code: ${codeComponents.size} · templates: ${templates.length}\n`,
);
for (const line of ok) console.log(`  ✓ ${line}`);
if (warns.length) {
  console.log(
    `\n⚠  ${warns.length} warning(s) — the two sides disagree, which may be deliberate:`,
  );
  for (const w of warns) console.log(`   ${w}`);
}
// For the designer, not the build: a description is theirs to write, and the
// code cannot invent one. Listed once, never failing.
if (describedGaps.length) {
  const by = (k) =>
    describedGaps.filter((g) => g.kind === k).map((g) => g.name);
  console.log(
    `\n–  ${describedGaps.length} set(s) with a code component carry no usable description:`,
  );
  for (const [kind, label] of [
    ["none", "no description"],
    ["keywords", "library search keywords, not a description"],
    ["attribution", "an upstream attribution, not a description"],
  ]) {
    const names = by(kind);
    if (names.length) console.log(`   ${label}: ${names.join(", ")}`);
  }
}
await writeSummary();
if (errors.length) {
  console.error(
    `\n✗ ${errors.length} error(s) — Dev Mode will emit wrong code, or the code renders a value Figma does not draw:`,
  );
  for (const e of errors) console.error(`   ${e}`);
  process.exit(1);
}
console.log(
  warns.length
    ? `\n✓ no errors (${warns.length} warning(s) above)`
    : `\n✓ no drift`,
);
