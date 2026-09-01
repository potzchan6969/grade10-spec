import { describe, expect, it } from "vitest";
import { buildIndex, feedRef } from "../src/api/derive";
import { changeEntry, pageEntry, snapshotOf } from "./manual-fixture";

/** What a commit touched, resolved against the store as it stands today. A
 * page deleted since and a change already archived are the two cases the feed
 * has to survive: the commit happened either way. */

const index = buildIndex(
  snapshotOf({
    pages: [
      pageEntry("manual/products/demo/alpha.md", {
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
      feedRef(index, { kind: "page", path: "manual/products/demo/alpha.md" }),
    ).toEqual({
      key: "page:manual/products/demo/alpha.md",
      label: "Alpha",
      to: "/p/demo/alpha",
      kind: "page",
    });
  });

  it("keeps a deleted page's path, with nowhere to click", () => {
    expect(
      feedRef(index, { kind: "page", path: "manual/products/demo/gone.md" }),
    ).toEqual({
      key: "page:manual/products/demo/gone.md",
      label: "manual/products/demo/gone.md",
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

  it("sends a change in flight to its card on the board", () => {
    expect(feedRef(index, { kind: "change", id: "add-beta" })).toEqual({
      key: "change:add-beta",
      label: "Change add-beta",
      to: "/planning/add-beta",
      kind: "change",
    });
  });

  /** An archived change has no card to anchor to, so the board itself is all
   * there is to point at. */
  it("sends an archived change to the board plainly", () => {
    expect(feedRef(index, { kind: "archived", id: "add-alpha" })).toEqual({
      key: "archived:add-alpha",
      label: "add-alpha",
      to: "/planning",
      kind: "archived",
    });
  });

  it("leaves a plain file as a label", () => {
    expect(
      feedRef(index, { kind: "file", path: "manual/manual.yaml" }),
    ).toEqual({
      key: "file:manual/manual.yaml",
      label: "manual/manual.yaml",
      kind: "file",
    });
  });
});
