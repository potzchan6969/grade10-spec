#!/usr/bin/env node
// Builds the real react-email preview app (sidebar, iframe, linter/spam
// panels) as a static site: `email build` already prerenders every route as
// plain HTML (SSG) — this just lifts those files out of `.next/server/app`
// instead of running `email start` as a live Node server. `--output export`
// is not an option here: the app ships Server Actions the live dev UI calls
// from the client, and Next refuses to build with `output: 'export'` while
// any exist, even unreachable ones.
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const reactEmailApp = join(root, ".react-email");
const nextAppDir = join(reactEmailApp, ".next", "server", "app");
const outDir = join(root, "out");

rmSync(outDir, { recursive: true, force: true });

execFileSync(join(root, "node_modules", ".bin", "email"), ["build"], {
  cwd: root,
  stdio: "inherit",
});

if (!existsSync(nextAppDir)) {
  throw new Error(
    `email build did not produce ${relative(root, nextAppDir)} — react-email's build output shape may have changed.`,
  );
}

const htmlFiles = readdirSync(nextAppDir, {
  recursive: true,
  withFileTypes: true,
})
  .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
  .filter((entry) => entry.name !== "_global-error.html");

if (htmlFiles.length === 0) {
  throw new Error(
    `No prerendered .html files found under ${relative(root, nextAppDir)}.`,
  );
}

for (const entry of htmlFiles) {
  const sourcePath = join(entry.parentPath ?? entry.path, entry.name);
  const relativePath = relative(nextAppDir, sourcePath);
  const destName = entry.name === "_not-found.html" ? "404.html" : entry.name;
  const destPath = join(outDir, dirname(relativePath), destName);
  mkdirSync(dirname(destPath), { recursive: true });
  cpSync(sourcePath, destPath);
}

const nextStaticDir = join(reactEmailApp, ".next", "static");
if (!existsSync(nextStaticDir)) {
  throw new Error(
    `Missing ${relative(root, nextStaticDir)} — the preview app's JS/CSS chunks.`,
  );
}
cpSync(nextStaticDir, join(outDir, "_next", "static"), { recursive: true });

const publicDir = join(reactEmailApp, "public");
if (existsSync(publicDir)) {
  cpSync(publicDir, outDir, { recursive: true });
}

if (!existsSync(join(outDir, "index.html"))) {
  throw new Error("Build finished but out/index.html is missing.");
}

console.log(
  `Wrote ${htmlFiles.length} pages to ${relative(process.cwd(), outDir)}`,
);
