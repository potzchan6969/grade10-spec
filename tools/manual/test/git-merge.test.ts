import { describe, expect, it } from "vitest";
import type { CommitInfo } from "../src/api/types";
import { type GitIndex, mergeGitIndexes } from "../src/store/git.mts";

/** Two repositories, one index: `docs/prds/…` answers from the content clone,
 * everything else from the store, and the snapshot is stamped with the
 * store's head either way. */

const commit = (sha: string): CommitInfo => ({
  sha,
  date: `2026-08-${sha.slice(-2)}T00:00:00Z`,
});

const indexOf = (sha: string, blobs: Record<string, string>): GitIndex => ({
  head: sha,
  commitOf: () => commit(sha),
  newestUnder: () => commit(sha),
  history: [{ ...commit(sha), subject: sha, refs: [] }],
  readBlobs: async (refs) =>
    new Map(refs.flatMap((ref) => (blobs[ref] ? [[ref, blobs[ref]]] : []))),
});

const store = indexOf("store-11", { "s:openspec/specs/a/spec.md": "spec" });
const content = indexOf("content-20", { "c:docs/prds/index.md": "page" });
const merged = mergeGitIndexes(store, content);

describe("the merged git index", () => {
  it("keeps the store's head", () => {
    expect(merged.head).toBe("store-11");
  });

  it("routes paths to the repository that holds them", () => {
    expect(merged.commitOf("docs/prds/index.md")?.sha).toBe("content-20");
    expect(merged.commitOf("openspec/specs/a/spec.md")?.sha).toBe("store-11");
    expect(merged.newestUnder("docs/prds")?.sha).toBe("content-20");
    expect(merged.newestUnder("openspec/changes/x")?.sha).toBe("store-11");
  });

  it("interleaves both histories, newest first", () => {
    expect(merged.history.map((one) => one.sha)).toEqual([
      "content-20",
      "store-11",
    ]);
  });

  it("asks each repository only for the refs whose paths it holds", async () => {
    const blobs = await merged.readBlobs([
      "c:docs/prds/index.md",
      "s:openspec/specs/a/spec.md",
      "s:docs/prds/index.md",
    ]);
    expect(blobs.get("c:docs/prds/index.md")).toBe("page");
    expect(blobs.get("s:openspec/specs/a/spec.md")).toBe("spec");
    // A ref pairing a store commit with a content path resolves to nothing —
    // the stale check reads that as "moved", never as somebody else's file.
    expect(blobs.has("s:docs/prds/index.md")).toBe(false);
  });
});
