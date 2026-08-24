#!/usr/bin/env node
/*
 * CHECK: Figma components vs the code they claim to mirror.
 *
 * Nothing keeps a Figma component set and its cva() honest with each other, and
 * the failure is silent — a renamed variant, an option added on one side only,
 * or a Code Connect template whose node-id stopped resolving all look fine
 * until someone reads the Dev Mode snippet. This diffs the three.
 *
 *   FIGMA_TOKEN=figd_… pnpm components:check        # unattended, use this in CI
 *   FIGMA_DUMP=~/Downloads/dump.json pnpm components:check   # manual fallback
 *
 * Locally, put FIGMA_TOKEN in a .env at the repository root instead of
 * prefixing every invocation; see .env.example. CI passes it as a real
 * environment variable and needs no file.
 *
 * ERROR = the mapping is broken and Dev Mode will emit wrong code; exits 1.
 * WARN  = the two sides disagree, which may be intentional; does not exit 1.
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
  radiusResolver,
  toHex8,
  tokenResolver,
} from "./figma/values.mjs";

const pkgDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// A repository-root .env is a convenience for humans; CI passes the token as a
// real environment variable and has no file. loadEnvFile throws when the file
// is absent, which is the normal case in CI, so the miss is not an error.
try {
  process.loadEnvFile(resolve(pkgDir, "../..", ".env"));
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
// gates to Enterprise (see scripts/figma/pull.mjs) — but that gate is specific
// to variables. Component property definitions live in the file document, which
// only needs the standard files:read scope, so this check can run unattended
// even though the token pull cannot.
//
// A check that cannot reach Figma must fail, never pass quietly: an unenforced
// check is worse than no check, because it reads as coverage.
function componentsFromDocument(doc) {
  const out = {};
  const visit = (node, parent) => {
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
  return out;
}

async function loadFigmaComponents() {
  if (process.env.FIGMA_DUMP) {
    const meta = JSON.parse(
      await readFile(resolve(pkgDir, process.env.FIGMA_DUMP), "utf8"),
    ).meta;
    if (!meta?.components)
      die(`This dump has no \`meta.components\` — it predates component support.
     Rebuild the plugin (pnpm tokens:plugin dump) and take a fresh dump.`);
    return {
      source: `dump ${process.env.FIGMA_DUMP}`,
      components: meta.components,
    };
  }

  const token = process.env.FIGMA_TOKEN;
  if (!token)
    die(`No Figma source. Set FIGMA_TOKEN (preferred — runs unattended in CI):

     FIGMA_TOKEN=figd_… pnpm components:check

   A personal access token with the \`files:read\` scope is enough; the
   Enterprise-only \`file_variables:read\` gate applies to the token pull, not
   to this check. Or fall back to the manual plugin dump:

     FIGMA_DUMP=~/Downloads/figma-dump.json pnpm components:check`);

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
  const components = componentsFromDocument(json.document);
  if (!Object.keys(components).length)
    die(
      `No COMPONENT or COMPONENT_SET nodes found in file ${key}. Either the ` +
        `file has none, or the response shape changed — failing rather than ` +
        `reporting "no drift".`,
    );
  return { source: `REST ${key}`, components };
}

const cfg = JSON.parse(
  await readFile(resolve(pkgDir, "tokens.config.json"), "utf8"),
);
const { source: figmaSource, components: figmaComponents } =
  await loadFigmaComponents();

// ── source scanning ─────────────────────────────────────────────────────────
const COMPONENTS = resolve(pkgDir, "src/components");
async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(path)));
    else out.push(path);
  }
  return out;
}
const files = await walk(COMPONENTS);
const rel = (p) => p.slice(resolve(pkgDir, "..", "..").length + 1);

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
  return { axes, defaults };
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
const codeComponents = new Map(); // normalized name -> { file, axes }
for (const f of files) {
  if (!f.endsWith(".tsx") || f.endsWith(".stories.tsx")) continue;
  const base = f
    .split("/")
    .pop()
    .replace(/\.tsx$/, "");
  const src = await readFile(f, "utf8");
  const { axes: classes, defaults } = cvaClasses(src);
  codeComponents.set(norm(base), {
    file: rel(f),
    axes: cvaAxes(src),
    classes,
    defaults,
  });
}

const resolveToken = tokenResolver(
  JSON.parse(await readFile(resolve(pkgDir, "tokens.json"), "utf8")),
);
const resolveRadius = radiusResolver(
  await readFile(resolve(pkgDir, cfg.preamble), "utf8"),
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
          report.warns.push(message);
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
          report.warns.push(message);
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
    }
  }
}

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
  templates.push({ file: rel(f), url, nodeId, enums, maps });
}

// ── compare ─────────────────────────────────────────────────────────────────
const errors = [];
const warns = [];
const ok = [];
// Value mismatches in structured form, for the GitHub job summary. The console
// report is written for whoever ran the command; the summary is written for a
// designer who will only ever see the Actions page.
const diffs = [];
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

  checkValues(comp, tpl, code, { ok, warns, diffs });
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
await writeSummary();
if (errors.length) {
  console.error(
    `\n✗ ${errors.length} error(s) — Dev Mode will emit wrong code:`,
  );
  for (const e of errors) console.error(`   ${e}`);
  process.exit(1);
}
console.log(
  warns.length
    ? `\n✓ no errors (${warns.length} warning(s) above)`
    : `\n✓ no drift`,
);
