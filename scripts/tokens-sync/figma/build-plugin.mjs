#!/usr/bin/env node
/*
 * WRAP: a generated *.gen.js -> an importable Figma plugin folder.
 *
 * The .gen.js files are written for the `use_figma` MCP tool, which wraps them in
 * an async context and reports the returned value. A plugin main file gets
 * neither, so this wraps the body in an async IIFE and surfaces the result via
 * console.log (full JSON) + figma.closePlugin (headline). Use it when the MCP
 * bridge is unavailable or bound to the wrong file: Figma → Plugins →
 * Development → Import plugin from manifest…
 *
 *   node scripts/tokens-sync/figma/build-plugin.mjs push   # -> scripts/tokens-sync/figma/build/push/
 *   node scripts/tokens-sync/figma/build-plugin.mjs seed   # -> scripts/tokens-sync/figma/build/seed/
 *   node scripts/tokens-sync/figma/build-plugin.mjs dump   # -> scripts/tokens-sync/figma/build/dump/
 *
 * push/seed WRAP a generated script (token values baked in — rebuild whenever
 * tokens.json changes). dump COPIES hand-written source from scripts/tokens-sync/figma/plugin-src/dump/
 * (reads Figma at runtime, carries no data, so it never goes stale).
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const die = (m) => {
  console.error(`✗ ${m}`);
  process.exit(1);
};

const TARGETS = {
  push: {
    gen: "scripts/tokens-sync/figma/build/push.gen.js",
    out: "scripts/tokens-sync/figma/build/push",
    name: "DS Token Push",
    id: "ds-token-push-local",
    headline:
      '"created " + r.created + " · set " + r.set + " · missing " + r.missing.length + " · collisions " + r.collisions.length',
  },
  seed: {
    gen: "scripts/tokens-sync/figma/build/seed-default.gen.js",
    out: "scripts/tokens-sync/figma/build/seed",
    name: "DS Token Seed (shadcn default)",
    id: "ds-token-seed-default-local",
    headline:
      '"collection " + r.collection + " · created " + r.createdCount + " · reused " + r.reusedCount',
  },
  // No `gen`: the dump bakes in no token data, so its source is hand-written and
  // copied verbatim. Nothing to regenerate when tokens.json changes.
  dump: {
    src: "scripts/tokens-sync/figma/plugin-src/dump",
    files: ["code.js", "ui.html"],
    out: "scripts/tokens-sync/figma/build/dump",
    name: "DS Token Dump",
    id: "ds-token-dump-local",
    ui: "ui.html",
  },
};

const t = TARGETS[process.argv[2]];
if (!t)
  die(
    `Usage: node scripts/tokens-sync/figma/build-plugin.mjs <${Object.keys(TARGETS).join("|")}>`,
  );

const outDir = resolve(repoRoot, t.out);
await mkdir(outDir, { recursive: true });
const written = [];

if (t.gen) {
  // WRAP: the generated script carries the token values and is reshaped to run
  // as a plugin. push.mjs emits `return await (async () => {…})()`;
  // seed-default.mjs emits a bare body with top-level await + a trailing
  // return. Neither is legal at the top level of a plugin, so both end up
  // inside one IIFE.
  const src = (await readFile(resolve(repoRoot, t.gen), "utf8")).trimEnd();
  const body = src.includes("return await (async () => {")
    ? src.replace("return await (async () => {", "(async () => {")
    : `(async () => {\n${src}\n})()`;
  const code = `${body}
  .then((r) => {
    console.log(JSON.stringify(r, null, 2));
    figma.closePlugin(${t.headline});
  })
  .catch((e) => {
    console.error(e);
    figma.closePlugin("ERROR: " + e.message);
  });
`;
  new Function(code); // parse check — a syntax error here beats one inside Figma
  await writeFile(resolve(outDir, "code.js"), code, "utf8");
  written.push("code.js");
} else {
  // COPY: the dump reads Figma at runtime and bakes in no data, so its source is
  // already plugin-shaped and constant. Only the manifest is generated.
  for (const f of t.files) {
    const content = await readFile(resolve(repoRoot, t.src, f), "utf8");
    if (f.endsWith(".js")) new Function("figma", "__html__", content);
    await writeFile(resolve(outDir, f), content, "utf8");
    written.push(f);
  }
}

await writeFile(
  resolve(outDir, "manifest.json"),
  JSON.stringify(
    {
      name: t.name,
      id: t.id,
      api: "1.0.0",
      main: "code.js",
      ...(t.ui ? { ui: t.ui } : {}),
      editorType: ["dev"],
      capabilities: ["inspect", "vscode"],
      documentAccess: "dynamic-page",
    },
    null,
    2,
  ) + "\n",
  "utf8",
);

console.log(
  `✓ ${t.gen ?? t.src} -> ${t.out}/ (${written.join(" + ")} + manifest.json)`,
);
console.log(
  `  Figma → Plugins → Development → Import plugin from manifest… → ${t.out}/manifest.json`,
);
