import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { confine, findStoreRoot, storePath } from "../src/store/disk.mts";
import { writeStore } from "./tmp-store";

const ROOT = "/store";

describe("confine", () => {
  it("accepts a store-relative path", () => {
    expect(confine(ROOT, "manual", "manual/products/a.md")).toBe(
      join(ROOT, "manual/products/a.md"),
    );
  });

  it("accepts a path relative to the directory itself", () => {
    expect(confine(ROOT, "manual", "products/a.md")).toBe(
      join(ROOT, "manual/products/a.md"),
    );
  });

  it("accepts any suffix of a nested directory", () => {
    for (const path of [
      "manual/assets/a.png",
      "assets/a.png",
      "a.png",
    ] as const) {
      expect(confine(ROOT, "manual/assets", path)).toBe(
        join(ROOT, "manual/assets/a.png"),
      );
    }
  });

  it("refuses traversal, an absolute path, and the directory itself", () => {
    for (const path of [
      "../../etc/passwd",
      "manual/../../etc/passwd",
      "/etc/passwd",
      "",
    ]) {
      expect(confine(ROOT, "manual", path)).toHaveProperty("error");
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
    "manual/assets/a.png": "",
  });

  it("refuses a path that opens on another store directory", () => {
    expect(confine(STORE, "manual", "openspec/specs/demo/spec.md")).toEqual({
      error:
        "`openspec/specs/demo/spec.md` names the store's openspec/, not manual/",
    });
    expect(confine(STORE, "manual", "docs/note.md")).toEqual({
      error: "`docs/note.md` names the store's docs/, not manual/",
    });
    expect(confine(STORE, "manual/assets", "manual/products/a.png")).toEqual({
      error:
        "`manual/products/a.png` names the store's manual/, not manual/assets/",
    });
  });

  it("keeps the three forms a page may write", () => {
    for (const path of ["manual/assets/a.png", "assets/a.png", "a.png"]) {
      expect(confine(STORE, "manual/assets", path)).toBe(
        join(STORE, "manual/assets/a.png"),
      );
    }
    expect(confine(STORE, "manual", "products/a.md")).toBe(
      join(STORE, "manual/products/a.md"),
    );
  });

  it("still names a single file that shares a store directory's name", () => {
    expect(confine(STORE, "manual", "docs")).toBe(join(STORE, "manual/docs"));
  });
});

describe("store paths", () => {
  it("finds the root by the openspec directory above it", () => {
    const root = findStoreRoot(
      join(import.meta.dirname, "fixtures/store/manual"),
    );
    expect(root).toBe(join(import.meta.dirname, "fixtures/store"));
  });

  it("writes store-relative paths with forward slashes", () => {
    expect(storePath(ROOT, join(ROOT, "manual", "index.md"))).toBe(
      "manual/index.md",
    );
  });
});
