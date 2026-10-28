import { describe, expect, it } from "vitest";
import { refsOf } from "../src/store/history.mts";

/** What a commit touched, read off its paths alone: a page of the manual, or a
 * file the feed names by its path. */

describe("classifying a commit's paths", () => {
  it("names a manual page by its path", () => {
    expect(refsOf(["docs/prds/products/demo/alpha.md"])).toEqual([
      { kind: "page", path: "docs/prds/products/demo/alpha.md" },
    ]);
  });

  it("keeps a path no page claims as a path", () => {
    expect(
      refsOf(["docs/prds/manual.yaml", "openspec/specs/demo/alpha/spec.md"]),
    ).toEqual([
      { kind: "file", path: "docs/prds/manual.yaml" },
      { kind: "file", path: "openspec/specs/demo/alpha/spec.md" },
    ]);
  });
});
