/** Snapshots built by hand: the derivations under test read the artifact, not
 * the store, so nothing here goes near a reader. */
import { fileURLToPath } from "node:url";
import { stageOf } from "../src/api/stages.ts";
import type {
  ChangeEntry,
  Delta,
  PageEntry,
  Snapshot,
  SpecEntry,
} from "../src/api/types";
import { findStoreRoot } from "../src/store/disk.mts";
import { schemaArtifacts } from "../src/store/read-schema.mts";

/** The store's own planning artifacts, so the rung a fixture's `written`
 * proves is the one every change is read at. A second list of ids here would
 * drift from the schema the day somebody moved an artifact. */
const PLANNING =
  schemaArtifacts(
    findStoreRoot(fileURLToPath(new URL(".", import.meta.url))),
    "grade10-planning",
  ) ?? [];

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

/** One change entry. Its stage is computed from what the fixture says it has
 * written, the way a store reader computes it, so no fixture carries a stage
 * that disagrees with its own files; a case about a rung passes the one it
 * means outright. */
export function changeEntry(
  id: string,
  deltas: Delta[],
  extra: Partial<ChangeEntry> = {},
): ChangeEntry {
  const entry: ChangeEntry = {
    id,
    schema: "grade10-planning",
    status: "in-flight",
    stage: "proposed",
    owners: [],
    created: "2026-01-01",
    title: `Change ${id}`,
    why: "",
    taskGroups: [],
    deltas,
    written: deltas.length > 0 ? ["proposal", "specs"] : ["proposal"],
    ...extra,
  };
  return extra.stage ? entry : { ...entry, stage: stageOf(entry, PLANNING) };
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
    schemas: {},
    assets: [],
    references: [],
    history: [],
    warnings: [],
    ...parts,
  };
}
