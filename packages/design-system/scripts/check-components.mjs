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
 * ERROR = the mapping is broken and Dev Mode will emit wrong code; exits 1.
 * WARN  = the two sides disagree, which may be intentional; does not exit 1.
 *
 * Axes are matched through the Code Connect template, not by name: Figma's
 * `Type` is cva's `variant`, and comparing those by name produced a pair of
 * contradicting warnings on every component. See resolveAxis.
 *
 * What this still does NOT check: token values and geometry. Every axis and
 * option can line up while the colours and sizes are wrong, which is exactly
 * what happened to Button. Names only, for now.
 */
import { readdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const pkgDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
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
function fileKeyFrom(spec) {
  // /design/:key/branch/:branchKey/:name resolves to the BRANCH key — a branch
  // is a distinct file to the API, and tokens.config.json points at one today.
  const branch = /\/branch\/([0-9a-zA-Z]{22,128})/.exec(spec)?.[1];
  if (branch) return branch;
  const inUrl = /\/(?:design|file)\/([0-9a-zA-Z]{22,128})/.exec(spec)?.[1];
  if (inUrl) return inUrl;
  return /^[0-9a-zA-Z]{22,128}$/.test(spec.trim()) ? spec.trim() : null;
}

function componentsFromDocument(doc) {
  const out = {};
  const visit = (node) => {
    if (node.type === "COMPONENT_SET") {
      out[node.id] = {
        id: node.id,
        name: node.name,
        properties: node.componentPropertyDefinitions ?? {},
      };
    }
    for (const child of node.children ?? []) visit(child);
  };
  visit(doc);
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
      `No COMPONENT_SET nodes found in file ${key}. Either the file has none, ` +
        `or the response shape changed — failing rather than reporting "no drift".`,
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

// top-level `key: {...}` pairs of an object literal body
function objectKeys(body) {
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

// flat `Key: <scalar>` pairs — getEnum maps are always flat, so this stays
// simple where objectKeys has to handle nested cva bodies.
function enumPairs(body) {
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
const codeComponents = new Map(); // normalized name -> { file, axes }
for (const f of files) {
  if (!f.endsWith(".tsx") || f.endsWith(".stories.tsx")) continue;
  const base = f
    .split("/")
    .pop()
    .replace(/\.tsx$/, "");
  codeComponents.set(norm(base), {
    file: rel(f),
    axes: cvaAxes(await readFile(f, "utf8")),
  });
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
const figma = Object.values(figmaComponents);
const figmaById = Object.fromEntries(figma.map((c) => [c.id, c]));

for (const comp of figma) {
  const variantAxes = Object.fromEntries(
    Object.entries(comp.properties)
      .filter(([, d]) => d.type === "VARIANT")
      .map(([name, d]) => [name, d.variantOptions ?? []]),
  );
  const code = codeComponents.get(norm(comp.name));
  if (!code) {
    warns.push(
      `${comp.name}: no code component (looked for src/components/**/${norm(comp.name)}.tsx)`,
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
