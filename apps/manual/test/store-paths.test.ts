import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { confine, findStoreRoot, storePath } from "../src/store/disk.mts";

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
