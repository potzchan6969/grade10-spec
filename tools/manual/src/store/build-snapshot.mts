import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { resolveRoots } from "./roots.mts";
import { readStore } from "./snapshot.mts";

/**
 * Writes the artifacts — the snapshot, the archive, one document per in-flight
 * change — and the images they point at into `dist/`, so the hosted site is
 * static files only. Runs after `vite build`, which empties `dist/` first.
 */
const here = fileURLToPath(new URL(".", import.meta.url));
const roots = resolveRoots();
const app = join(here, "..", "..");
const dist = join(app, "dist");

const { snapshot, archive, documents } = await readStore(roots);

mkdirSync(join(dist, "api", "change"), { recursive: true });
writeFileSync(join(dist, "api", "snapshot"), JSON.stringify(snapshot));
writeFileSync(join(dist, "api", "archive"), JSON.stringify(archive));
for (const document of documents) {
  writeFileSync(
    join(dist, "api", "change", document.id),
    JSON.stringify(document),
  );
}

// The artifacts carry no extension, so the host has to be told what they are.
writeFileSync(
  join(dist, "_headers"),
  "/api/*\n  content-type: application/json; charset=utf-8\n  cache-control: no-cache\n",
);

const assets = join(roots.content, "manual", "assets");
if (existsSync(assets)) {
  cpSync(assets, join(dist, "assets"), { recursive: true });
}

const broken = [...snapshot.specs, ...snapshot.changes, ...archive.changes]
  .filter((entry) => entry.error)
  .map(
    (entry) => `${entry.id}: ${entry.error?.file} — ${entry.error?.message}`,
  );

console.info(
  `manual: ${snapshot.specs.length} specs, ${snapshot.changes.length} in-flight changes (${documents.length} documents), ` +
    `${archive.changes.length} archived, ${snapshot.pages.length} pages, ` +
    `${snapshot.assets.length} assets, ${snapshot.warnings.length} warnings at ${snapshot.storeHead.slice(0, 8)}`,
);
if (broken.length > 0) {
  console.warn(`manual: ${broken.length} malformed store files`);
  for (const line of broken) console.warn(`  ${line}`);
}
