import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { liveBodies } from "./main-moved.mts";
import { resolveRoots } from "./roots.mts";
import { readStore } from "./snapshot.mts";

/**
 * Writes the artifacts — the snapshot and one document per reference — and
 * the images they point at into `dist/`, so
 * the hosted site is static files only. Runs after `vite build`, which empties
 * `dist/` first.
 *
 * Two of them are what a page open in a browser reads while it waits: the
 * relay it listens to for `main` moving, and the head this build was made
 * from. A build with no `RELAY_URL` writes no relay, and nothing listens.
 */
const here = fileURLToPath(new URL(".", import.meta.url));
const roots = resolveRoots();
const app = join(here, "..", "..");
const dist = join(app, "dist");

const { snapshot, references } = await readStore(roots);

mkdirSync(join(dist, "api", "reference"), { recursive: true });
writeFileSync(join(dist, "api", "snapshot"), JSON.stringify(snapshot));
const live = liveBodies(snapshot.storeHead);
writeFileSync(join(dist, "api", "relay"), JSON.stringify(live.relay));
writeFileSync(join(dist, "api", "head"), JSON.stringify(live.head));
for (const reference of references) {
  writeFileSync(
    join(dist, "api", "reference", reference.slug),
    JSON.stringify(reference),
  );
}

// The artifacts carry no extension, so the host has to be told what they are.
writeFileSync(
  join(dist, "_headers"),
  "/api/*\n  content-type: application/json; charset=utf-8\n  cache-control: no-cache\n",
);

const assets = join(roots.content, roots.manual, "assets");
if (existsSync(assets)) {
  cpSync(assets, join(dist, "assets"), { recursive: true });
}

console.info(
  `manual: ${snapshot.pages.length} pages, ${references.length} references, ` +
    `${snapshot.assets.length} assets, ${snapshot.warnings.length} warnings at ${snapshot.storeHead.slice(0, 8)}`,
);
