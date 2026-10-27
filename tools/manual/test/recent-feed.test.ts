import { describe, expect, it } from "vitest";
import { buildIndex, feedRef } from "../src/api/derive";
import { pageEntry, snapshotOf } from "./manual-fixture";

/** What a commit touched, resolved against the store as it stands today. A
 * page deleted since is the case the feed has to survive: the commit happened
 * either way. */

const index = buildIndex(
  snapshotOf({
    pages: [
      pageEntry("docs/prds/products/demo/alpha.md", {
        title: "Alpha",
        spec: "demo/alpha",
      }),
    ],
  }),
);

describe("a history ref as a chip", () => {
  it("gives a page its title and its route", () => {
    expect(
      feedRef(index, {
        kind: "page",
        path: "docs/prds/products/demo/alpha.md",
      }),
    ).toEqual({
      key: "page:docs/prds/products/demo/alpha.md",
      label: "Alpha",
      to: "/p/demo/alpha",
      kind: "page",
    });
  });

  it("keeps a deleted page's path, with nowhere to click", () => {
    expect(
      feedRef(index, { kind: "page", path: "docs/prds/products/demo/gone.md" }),
    ).toEqual({
      key: "page:docs/prds/products/demo/gone.md",
      label: "docs/prds/products/demo/gone.md",
      kind: "page",
    });
  });

  it("leaves a plain file as a label", () => {
    expect(
      feedRef(index, { kind: "file", path: "docs/prds/manual.yaml" }),
    ).toEqual({
      key: "file:docs/prds/manual.yaml",
      label: "docs/prds/manual.yaml",
      kind: "file",
    });
  });
});
