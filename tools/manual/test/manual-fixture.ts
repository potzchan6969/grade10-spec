/** Snapshots built by hand: the derivations under test read the artifact, not
 * the store, so nothing here goes near a reader. */
import type {
  ChangeEntry,
  Delta,
  PageEntry,
  Snapshot,
  SpecEntry,
} from "../src/api/types";

export function specEntry(id: string, requirements: string[]): SpecEntry {
  return {
    id,
    title: id,
    purpose: "",
    requirements: requirements.map((name) => ({
      name,
      text: "",
      scenarios: [],
    })),
  };
}

export function changeEntry(
  id: string,
  deltas: Delta[],
  extra: Partial<ChangeEntry> = {},
): ChangeEntry {
  return {
    id,
    schema: "grade10-planning",
    status: "in-flight",
    owners: [],
    created: "2026-01-01",
    title: `Change ${id}`,
    why: "",
    taskGroups: [],
    deltas,
    ...extra,
  };
}

export function pageEntry(
  path: string,
  frontmatter: Record<string, string | number>,
): PageEntry {
  const head = Object.entries(frontmatter)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
  return { path, source: `---\n${head}\n---\n\nProse.\n` };
}

export function snapshotOf(parts: Partial<Snapshot> = {}): Snapshot {
  return {
    generatedAt: "2026-08-30T00:00:00.000Z",
    storeHead: "0".repeat(40),
    config: { storybookBase: "", groups: [], platform: [], guides: [] },
    taxonomy: { products: [], topics: [] },
    manualDir: "docs/prds",
    pages: [],
    specs: [],
    changes: [],
    assets: [],
    references: [],
    history: [],
    warnings: [],
    ...parts,
  };
}
