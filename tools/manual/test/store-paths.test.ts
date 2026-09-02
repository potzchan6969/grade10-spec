import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { confine, findStoreRoot, storePath } from "../src/store/disk.mts";
import { writeStore } from "./tmp-store";

const ROOT = "/store";

describe("confine", () => {
  it("accepts a store-relative path", () => {
    expect(confine(ROOT, "docs/prds", "docs/prds/products/a.md")).toBe(
      join(ROOT, "docs/prds/products/a.md"),
    );
  });

  it("accepts a path relative to the directory itself", () => {
    expect(confine(ROOT, "docs/prds", "products/a.md")).toBe(
      join(ROOT, "docs/prds/products/a.md"),
    );
  });

  it("accepts any suffix of a nested directory", () => {
    for (const path of [
      "docs/prds/assets/a.png",
      "assets/a.png",
      "a.png",
    ] as const) {
      expect(confine(ROOT, "docs/prds/assets", path)).toBe(
        join(ROOT, "docs/prds/assets/a.png"),
      );
    }
  });

  it("refuses traversal, an absolute path, and the directory itself", () => {
    for (const path of [
      "../../etc/passwd",
      "docs/prds/../../etc/passwd",
      "/etc/passwd",
      "",
    ]) {
      expect(confine(ROOT, "docs/prds", path)).toHaveProperty("error");
    }
  });
});

/** A path written against the store root, for a tree that is not this one:
 * re-rooting it under the confined directory answers with a file nobody
 * asked for. */
describe("confine against a store that exists", () => {
  const STORE = writeStore({
    "openspec/specs/demo/spec.md": "# demo\n",
    "docs/note.md": "note\n",
    "docs/prds/assets/a.png": "",
  });

  it("refuses a path that opens on another store directory", () => {
    expect(confine(STORE, "docs/prds", "openspec/specs/demo/spec.md")).toEqual({
      error:
        "`openspec/specs/demo/spec.md` names the store's openspec/, not docs/prds/",
    });
    expect(confine(STORE, "docs/prds", "docs/note.md")).toEqual({
      error: "`docs/note.md` names the store's docs/, not docs/prds/",
    });
    expect(
      confine(STORE, "docs/prds/assets", "docs/prds/products/a.png"),
    ).toEqual({
      error:
        "`docs/prds/products/a.png` names the store's docs/, not docs/prds/assets/",
    });
  });

  it("keeps the three forms a page may write", () => {
    for (const path of ["docs/prds/assets/a.png", "assets/a.png", "a.png"]) {
      expect(confine(STORE, "docs/prds/assets", path)).toBe(
        join(STORE, "docs/prds/assets/a.png"),
      );
    }
    expect(confine(STORE, "docs/prds", "products/a.md")).toBe(
      join(STORE, "docs/prds/products/a.md"),
    );
  });

  it("still names a single file that shares a store directory's name", () => {
    expect(confine(STORE, "docs/prds", "docs")).toBe(
      join(STORE, "docs/prds/docs"),
    );
  });
});

describe("store paths", () => {
  it("finds the root by the openspec directory above it", () => {
    const root = findStoreRoot(
      join(import.meta.dirname, "fixtures/store/docs/prds"),
    );
    expect(root).toBe(join(import.meta.dirname, "fixtures/store"));
  });

  it("writes store-relative paths with forward slashes", () => {
    expect(storePath(ROOT, join(ROOT, "docs/prds", "index.md"))).toBe(
      "docs/prds/index.md",
    );
  });
});
