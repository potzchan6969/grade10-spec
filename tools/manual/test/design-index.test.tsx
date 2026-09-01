import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { buildIndex, designShelves } from "../src/api/derive";
import type { PageEntry, Snapshot } from "../src/api/types";
import { snapshotOf } from "./manual-fixture";

/** "Which pages show my designs" had no answer but opening every page: nav is
 * group → product → capability, and nothing groups by what is drawn. */

const held = vi.hoisted(() => ({ index: undefined as unknown }));
vi.mock("../src/api/use-manual-index", () => ({
  useManualIndex: () => held.index,
}));

const { DesignPage } = await import("../src/pages/design-page");

const page = (path: string, title: string, body: string[]): PageEntry => ({
  path,
  source: ["---", `title: ${title}`, "---", "", ...body, ""].join("\n"),
});

const FRAME = "https://www.figma.com/design/KEY/Store?node-id=4735-6493";

const snapshot: Snapshot = snapshotOf({
  pages: [
    page("manual/products/demo-product/alpha.md", "Alpha", [
      `::figma{url="${FRAME}" title="Order history, empty"}`,
      "",
      ':::detail{for="designer" title="Behind the fold"}',
      "",
      '::story{id="blocks-store-cart--default" title="Cart drawer"}',
      "",
      ":::",
    ]),
    page("manual/products/demo-product/beta.md", "Beta", ["Just prose."]),
  ],
  designSync: {
    generatedAt: "2026-08-28T02:00:00.000Z",
    file: "KEY",
    sets: { "Store / CartDrawer": "warn" },
    nodes: { "4735-6493": "Store / CartDrawer" },
    messages: { "Store / CartDrawer": ["padding is 12, code says 16"] },
  },
});

const index = buildIndex(snapshot);
held.index = index;

describe("every visual the manual shows", () => {
  const shelves = designShelves(index);

  it("collects the cards of a page, container bodies included", () => {
    expect(shelves).toHaveLength(1);
    expect(shelves[0].cards.map((card) => card.type)).toEqual([
      "figma",
      "story",
    ]);
  });

  it("passes over a page that draws nothing", () => {
    expect(shelves.map((shelf) => shelf.title)).not.toContain("Beta");
  });
});

describe("the index it becomes", () => {
  const html = renderToStaticMarkup(
    <MemoryRouter>
      <DesignPage />
    </MemoryRouter>,
  );

  it("names each card and the page it lives on", () => {
    expect(html).toContain("Order history, empty");
    expect(html).toContain("Cart drawer");
    expect(html).toContain('href="/p/demo-product/alpha"');
    expect(html).toContain("blocks-store-cart--default");
  });

  it("carries the nightly verdict beside the card it is about", () => {
    expect(html).toContain("design drift");
    expect(html).toContain("last checked 2026-08-28");
  });

  it("keeps the way out to Figma", () => {
    expect(html).toContain(FRAME.replace(/&/g, "&amp;"));
  });
});
