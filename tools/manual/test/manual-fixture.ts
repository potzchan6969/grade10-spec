/** Snapshots built by hand: the derivations under test read the artifact, not
 * the store, so nothing here goes near a reader. */
import type { PageEntry, Snapshot } from "../src/api/types";

export function pageEntry(
  path: string,
  frontmatter: Record<string, string | number>,
  body = "Prose.\n",
): PageEntry {
  const head = Object.entries(frontmatter)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
  return { path, source: `---\n${head}\n---\n\n${body}` };
}

export function snapshotOf(parts: Partial<Snapshot> = {}): Snapshot {
  return {
    generatedAt: "2026-08-30T00:00:00.000Z",
    storeHead: "0".repeat(40),
    config: { storybookBase: "", groups: [], platform: [], guides: [] },
    taxonomy: { products: [], topics: [] },
    manualDir: "docs/prds",
    pages: [],
    assets: [],
    references: [],
    history: [],
    warnings: [],
    ...parts,
  };
}
