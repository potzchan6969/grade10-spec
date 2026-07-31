#!/usr/bin/env node
/**
 * Builds the published artifact for a Git-submodule consumer.
 *
 * `@acetrader/design-system` is consumed from TypeScript source and is not
 * published, so a consumer of this package can never resolve it. The primitives
 * are therefore *bundled* into `dist/index.js` and its theme CSS is copied into
 * `theme/`, leaving only real npm dependencies as external imports. Everything
 * this script writes is generated — do not edit `dist/` or `theme/` by hand.
 */
import { execFileSync } from "node:child_process";
import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const packageRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const designSystem = path.resolve(packageRoot, "../design-system/src");
const dist = path.join(packageRoot, "dist");
const theme = path.join(packageRoot, "theme");

const manifest = JSON.parse(
  readFileSync(path.join(packageRoot, "package.json"), "utf8"),
);

/** Everything a consumer installs from npm stays an import; the rest inlines. */
const external = [
  ...Object.keys(manifest.dependencies ?? {}),
  ...Object.keys(manifest.peerDependencies ?? {}),
].flatMap((name) => [name, `${name}/*`]);

rmSync(dist, { force: true, recursive: true });
rmSync(theme, { force: true, recursive: true });

// Types first: tsc reports contract errors that esbuild, which only strips
// types, would happily emit past.
execFileSync(
  process.execPath,
  [
    path.join(packageRoot, "node_modules/typescript/bin/tsc"),
    "--project",
    path.join(packageRoot, "tsconfig.json"),
    "--emitDeclarationOnly",
  ],
  { stdio: "inherit" },
);

await build({
  bundle: true,
  entryPoints: [path.join(packageRoot, "src/index.ts")],
  external,
  format: "esm",
  jsx: "automatic",
  outfile: path.join(dist, "index.js"),
  platform: "browser",
  sourcemap: true,
  target: "es2022",
});

// A leaked `@acetrader/design-system` specifier in a declaration file resolves
// to nothing in a consumer, and tsc will not warn about it here.
const leaked = readdirSync(dist, { recursive: true }).filter(
  (entry) =>
    String(entry).endsWith(".d.ts") &&
    readFileSync(path.join(dist, String(entry)), "utf8").includes(
      "@acetrader/design-system",
    ),
);
if (leaked.length > 0) {
  throw new Error(
    `Declaration files reference @acetrader/design-system, which a consumer cannot resolve: ${leaked.join(", ")}.\n` +
      "Keep design-system types out of this package's public contract.",
  );
}

mkdirSync(theme, { recursive: true });
cpSync(path.join(designSystem, "theme.css"), path.join(theme, "theme.css"));
cpSync(path.join(designSystem, "themes"), theme, { recursive: true });

console.log("Built dist/index.js and vendored theme/ from the design system.");
