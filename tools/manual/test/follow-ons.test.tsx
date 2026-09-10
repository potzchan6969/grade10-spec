import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { buildIndex, followOnsForSpec } from "../src/api/derive";
import type { ChangeEntry, SpecEntry } from "../src/api/types";
import type { ArchiveState } from "../src/api/use-archive";
import { BlockScopeProvider } from "../src/blocks/block-scope";
import { NextBlockView } from "../src/blocks/next-block";
import { changeEntry, snapshotOf } from "./manual-fixture";

/** The archive rides its own fetch; the block is under test, not the fetch. */
const archive = vi.hoisted(() => ({
  current: { status: "loading" } as ArchiveState,
}));
vi.mock("../src/api/use-archive", () => ({
  useArchive: () => archive.current,
}));

/** What a capability was said to lead to. The bullets come out of proposals
 * written months apart, half of them shipped, so the only reading that is not
 * a promise is one that keeps each bullet under its own change. */

const SPEC = "demo-product/alpha";

const spec: SpecEntry = {
  id: SPEC,
  title: "Alpha",
  purpose: "",
  requirements: [
    {
      name: "Alpha does things",
      text: "",
      scenarios: [{ id: "alpha-SC-01", name: "The thing happens", text: "" }],
    },
  ],
};

const inFlight = changeEntry(
  "expire-points",
  [{ spec: SPEC, kinds: ["MODIFIED"], requirements: [] }],
  {
    title: "Points should expire",
    created: "2026-03-01",
    lastMoved: "2026-03-04",
    followOns: ["A reminder before the expiry."],
  },
);

const shipped = (
  id: string,
  shippedOn: string,
  extra: Partial<ChangeEntry> = {},
): ChangeEntry =>
  changeEntry(id, [{ spec: SPEC, kinds: ["ADDED"], requirements: [] }], {
    status: "archived",
    shippedOn,
    title: `Change ${id}`,
    ...extra,
  });

const index = (changes: ChangeEntry[] = [inFlight]) =>
  buildIndex(snapshotOf({ specs: [spec], changes }));

describe("gathering the follow-ons a capability was named in", () => {
  it("keeps each change's bullets under that change", () => {
    const found = followOnsForSpec(index(), SPEC, [
      shipped("old-thing", "2026-01-02", {
        followOns: ["The new thing.", "A record of it."],
      }),
    ]);

    expect(found.map((one) => one.change.id)).toEqual([
      "expire-points",
      "old-thing",
    ]);
    expect(found[1].items).toEqual(["The new thing.", "A record of it."]);
  });

  it("puts live intent first, then the shipped changes newest first", () => {
    const found = followOnsForSpec(index(), SPEC, [
      shipped("older", "2026-01-02", { followOns: ["Older."] }),
      shipped("newer", "2026-02-02", { followOns: ["Newer."] }),
    ]);

    expect(found.map((one) => one.change.id)).toEqual([
      "expire-points",
      "newer",
      "older",
    ]);
  });

  it("skips a change that named none", () => {
    const found = followOnsForSpec(index(), SPEC, [
      shipped("quiet-thing", "2026-01-02"),
    ]);

    expect(found.map((one) => one.change.id)).toEqual(["expire-points"]);
  });

  /** An archived change with no delta reaches its capability the one way a
   * proposal does: through the ids its `## References` name. The archive is
   * not a second rule. */
  it("takes an archived change that only cites the capability", () => {
    const found = followOnsForSpec(index([]), SPEC, [
      changeEntry("old-thing", [], {
        status: "archived",
        shippedOn: "2026-01-02",
        cites: ["alpha-SC-01"],
        followOns: ["The new thing."],
      }),
    ]);

    expect(found.map((one) => one.change.id)).toEqual(["old-thing"]);
  });

  it("leaves a capability no change named alone", () => {
    expect(followOnsForSpec(index(), "demo-product/beta", [])).toEqual([]);
  });
});

function render(state: ArchiveState, changes: ChangeEntry[] = [inFlight]) {
  archive.current = state;
  return renderToStaticMarkup(
    <MemoryRouter>
      <BlockScopeProvider
        value={{
          index: index(changes),
          pagePath: "docs/prds/products/demo-product/alpha.md",
        }}
      >
        <NextBlockView block={{ type: "next", spec: SPEC }} />
      </BlockScopeProvider>
    </MemoryRouter>,
  );
}

const ready = (changes: ChangeEntry[]): ArchiveState => ({
  status: "ready",
  archive: { generatedAt: "", storeHead: "", changes },
});

describe("the block on the page", () => {
  it("says who named each bullet, and whether it shipped", () => {
    const html = render(
      ready([
        shipped("old-thing", "2026-01-02", { followOns: ["The new thing."] }),
      ]),
    );

    expect(html).toContain("A reminder before the expiry.");
    expect(html).toContain("The new thing.");
    expect(html).toContain("Points should expire");
    expect(html).toContain("in flight");
    expect(html).toContain("shipped");
  });

  it("says so plainly when no change has named one", () => {
    const html = render(ready([]), []);

    expect(html).toContain("No change has named a follow-on");
  });

  it("still shows the in-flight bullets when the archive will not load", () => {
    const html = render({ status: "unavailable", reason: "404" });

    expect(html).toContain("A reminder before the expiry.");
    expect(html).toContain("archive unavailable");
  });
});
