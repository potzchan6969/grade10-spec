import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import {
  buildIndex,
  changesForSpec,
  proposalsForSpec,
} from "../src/api/derive";
import type { SpecEntry } from "../src/api/types";
import { BlockScopeProvider } from "../src/blocks/block-scope";
import { ChangeRibbon } from "../src/blocks/change-views";
import { SpecBlockView } from "../src/blocks/spec-block";
import { changeEntry, pageEntry, snapshotOf } from "./manual-fixture";

// The row carries a Propose control; this page is not what is under test.
vi.mock("../src/editor/session", () => ({
  useEditorSession: () => ({ store: null }),
}));

/** The two things a capability page could not say: that somebody proposed
 * something about it, and which permanent id the next author has to clear. */

const SPEC = "demo-product/alpha";

const spec: SpecEntry = {
  id: SPEC,
  title: "Alpha Specification",
  purpose: "",
  requirements: [
    {
      name: "A purchase earns points",
      text: "",
      scenarios: [{ id: "alpha-SC-04", name: "It earns", text: "" }],
    },
  ],
  issuedThrough: { sc: 149, us: 6, tc: 58 },
};

const proposal = changeEntry("gift-cards", [], {
  title: "Gift cards in the store",
  cites: ["alpha-SC-04"],
});
const planned = changeEntry(
  "expire-points",
  [{ spec: SPEC, kinds: ["MODIFIED"], requirements: [] }],
  { title: "Points should expire" },
);

const index = buildIndex(
  snapshotOf({
    pages: [
      pageEntry("docs/prds/products/demo-product/alpha.md", {
        title: "Alpha",
        spec: SPEC,
      }),
    ],
    specs: [spec],
    changes: [proposal, planned],
  }),
);

const ribbon = (specId: string) =>
  renderToStaticMarkup(
    <MemoryRouter>
      <ChangeRibbon
        changes={changesForSpec(index, specId)}
        proposals={proposalsForSpec(index, specId)}
        specId={specId}
      />
    </MemoryRouter>,
  );

describe("a proposal reaching the capability it is about", () => {
  const html = ribbon(SPEC);

  it("shows up in the ribbon, linked to the board", () => {
    expect(html).toContain("Gift cards in the store");
    expect(html).toContain('href="/in-flight/gift-cards"');
  });

  it("reads as a proposal, never as work in flight", () => {
    expect(html).toContain(">proposed<");
    expect(html).toContain("no delta yet");
    expect(html.indexOf("Points should expire")).toBeLessThan(
      html.indexOf("Gift cards in the store"),
    );
  });

  it("still says nothing is in flight when only proposals cite it", () => {
    const alone = buildIndex(
      snapshotOf({ specs: [spec], changes: [proposal] }),
    );
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <ChangeRibbon
          changes={changesForSpec(alone, SPEC)}
          proposals={proposalsForSpec(alone, SPEC)}
          specId={SPEC}
        />
      </MemoryRouter>,
    );

    expect(html).toContain("Gift cards in the store");
    expect(html).not.toContain("Nothing in flight");
  });

  it("says nothing extra where nobody proposed anything", () => {
    expect(ribbon("demo-product/beta")).toContain("Nothing in flight");
  });
});

describe("the ceiling a new id has to clear", () => {
  const render = (
    entry: SpecEntry,
    block = { type: "spec" as const, id: SPEC },
  ) =>
    renderToStaticMarkup(
      <MemoryRouter>
        <BlockScopeProvider
          value={{
            index: buildIndex(snapshotOf({ specs: [entry] })),
            pagePath: "docs/prds/products/demo-product/alpha.md",
          }}
        >
          <SpecBlockView block={block} />
        </BlockScopeProvider>
      </MemoryRouter>,
    );

  /** The durable file's highest id is SC-04; in-flight deltas have issued
   * through SC-149, and picking SC-05 collides head-on. */
  it("states every kind's high-water mark on the contract itself", () => {
    const html = render(spec);

    expect(html).toContain("ids issued through");
    expect(html).toContain("SC-149 · US-6 · TC-58");
    expect(html).toContain("counting in-flight and archived work");
  });

  it("says nothing where the snapshot counted nothing", () => {
    expect(render({ ...spec, issuedThrough: undefined })).not.toContain(
      "ids issued through",
    );
  });

  it("stays off a single row — that is not where an id gets picked", () => {
    const html = render(spec, {
      type: "spec",
      id: SPEC,
      requirement: "A purchase earns points",
    } as never);

    expect(html).not.toContain("ids issued through");
  });
});
