#!/usr/bin/env node
/*
 * CHECK: Figma components vs the code they claim to mirror.
 *
 * Nothing keeps a Figma component set and its cva() honest with each other, and
 * the failure is silent — a renamed variant, an option added on one side only,
 * or a Code Connect template whose node-id stopped resolving all look fine
 * until someone reads the Dev Mode snippet. This diffs the three.
 *
 *   FIGMA_DUMP=~/Downloads/figma-dump.json pnpm components:check
 *
 * Reads `meta.components` from the dump plugin (pnpm tokens:plugin dump).
 * ERROR = the mapping is broken and Dev Mode will emit wrong code; exits 1.
 * WARN  = the two sides disagree, which may be intentional; does not exit 1.
 */
import { readdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const pkgDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const die = (m) => {
  console.error(`✗ ${m}`);
  process.exit(1);
};

if (!process.env.FIGMA_DUMP) {
  die(`No dump given. Set FIGMA_DUMP=<file.json>, e.g.

     pnpm tokens:plugin dump                     # build the plugin
     # Figma → Plugins → Development → Import plugin from manifest…
     #   scripts/figma/build/dump/manifest.json
     # run it, click Download
     FIGMA_DUMP=~/Downloads/figma-dump.json pnpm components:check`);
}
const meta = JSON.parse(
  await readFile(resolve(pkgDir, process.env.FIGMA_DUMP), "utf8"),
).meta;
if (!meta.components) {
  die(`This dump has no \`meta.components\` — it predates component support.
     Rebuild the plugin (pnpm tokens:plugin dump) and take a fresh dump.`);
}

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
  const enums = {};
  const re = /getEnum\(\s*['"]([^'"]+)['"]\s*,\s*\{/g;
  let m;
  while ((m = re.exec(src))) {
    enums[m[1]] = Object.keys(objectKeys(sliceBalanced(src, re.lastIndex - 1)));
  }
  templates.push({ file: rel(f), url, nodeId, enums });
}

// ── compare ─────────────────────────────────────────────────────────────────
const errors = [];
const warns = [];
const ok = [];
const figma = Object.values(meta.components);
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
  for (const [axis, options] of Object.entries(variantAxes)) {
    const codeOptions = code.axes[axis];
    if (!codeOptions) {
      warns.push(
        `${comp.name}.${axis}: Figma axis has no cva() counterpart in ${code.file}`,
      );
      continue;
    }
    const missingInFigma = codeOptions.filter((o) => !options.includes(o));
    const missingInCode = options.filter((o) => !codeOptions.includes(o));
    if (!missingInFigma.length && !missingInCode.length) {
      ok.push(
        `${comp.name}.${axis}: ${options.length}/${options.length} matched`,
      );
    }
    if (missingInCode.length)
      errors.push(
        `${comp.name}.${axis}: in Figma but not in cva() — ${missingInCode.join(", ")}`,
      );
    if (missingInFigma.length)
      warns.push(
        `${comp.name}.${axis}: in cva() but not in Figma — ${missingInFigma.join(", ")}`,
      );
  }
  for (const axis of Object.keys(code.axes)) {
    if (!variantAxes[axis])
      warns.push(
        `${comp.name}.${axis}: cva() axis has no Figma variant property`,
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
  `Figma: ${figma.length} component(s) · code: ${codeComponents.size} · templates: ${templates.length}\n`,
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
