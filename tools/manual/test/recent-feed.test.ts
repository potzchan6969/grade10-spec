import { describe, expect, it } from "vitest";
import { buildIndex, feedRef } from "../src/api/derive";
import { changeEntry, pageEntry, snapshotOf } from "./manual-fixture";

/** What a commit touched, resolved against the store as it stands today. A
 * page deleted since and a change already archived are the two cases the feed
 * has to survive: the commit happened either way. */

const index = buildIndex(
  snapshotOf({
    pages: [
      pageEntry("docs/prds/products/demo/alpha.md", {
        title: "Alpha",
        spec: "demo/alpha",
      }),
    ],
    changes: [changeEntry("add-beta", [])],
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

  it("sends a spec to the page that documents it", () => {
    expect(feedRef(index, { kind: "spec", id: "demo/alpha" })).toEqual({
      key: "spec:demo/alpha",
      label: "Alpha",
      to: "/p/demo/alpha",
      kind: "spec",
    });
  });

  it("names a change in flight without a link: the board is gone", () => {
    expect(feedRef(index, { kind: "change", id: "add-beta" })).toEqual({
      key: "change:add-beta",
      label: "Change add-beta",
      kind: "change",
    });
  });

  it("names an archived change plainly, with no link", () => {
    expect(feedRef(index, { kind: "archived", id: "add-alpha" })).toEqual({
      key: "archived:add-alpha",
      label: "add-alpha",
      kind: "archived",
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
