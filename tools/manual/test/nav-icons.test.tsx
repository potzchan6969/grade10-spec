import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { buildIndex } from "../src/api/derive";
import { PageSectionsContext } from "../src/shell/page-sections";
import { pageEntry, snapshotOf } from "./manual-fixture";

/** A domain wears the glyph its own landing page names, and the rail keeps the
 * slot for the domain that names none — one missing icon never moves the
 * titles beside it. */

const snapshot = snapshotOf({
  config: {
    storybookBase: "",
    groups: [{ title: "Shop", products: ["demo-product", "plain-product"] }],
    platform: [],
    guides: [],
  },
  taxonomy: { products: ["demo-product", "plain-product"], topics: [] },
  pages: [
    pageEntry("docs/prds/products/demo-product/index.md", {
      title: "Demo",
      icon: "storefront",
    }),
    pageEntry("docs/prds/products/demo-product/loyalty.md", {
      title: "Loyalty",
      order: 1,
    }),
    pageEntry("docs/prds/products/plain-product/index.md", {
      title: "Plain",
    }),
  ],
});

const held = vi.hoisted(() => ({ snapshot: undefined as unknown }));
held.snapshot = snapshot;

vi.mock("../src/api/snapshot-provider", () => ({
  useSnapshot: () => ({
    status: "ready",
    snapshot: held.snapshot,
    source: "store",
  }),
}));

vi.mock("../src/editor/session", () => ({
  useEditorSession: () => ({ store: null }),
  noteWrite: () => {},
}));

const { Sidebar } = await import("../src/shell/sidebar");

const html = renderToStaticMarkup(
  <MemoryRouter initialEntries={["/"]}>
    <PageSectionsContext value={{ sections: [] }}>
      <Sidebar onNavigate={() => {}} open />
    </PageSectionsContext>
  </MemoryRouter>,
);

describe("a domain's icon", () => {
  it("comes off its landing page and nowhere else", () => {
    const index = buildIndex(snapshot);
    const [demo, plain] = index.groups[0].products;

    expect(demo.icon).toBe("storefront");
    expect(plain.icon).toBeUndefined();
    expect(demo.capabilities[0].icon).toBeUndefined();
  });

  it("draws a glyph beside the title in the rail", () => {
    const row = html.slice(html.indexOf('href="/p/demo-product"'));
    expect(row.slice(0, row.indexOf("Demo"))).toContain("<svg");
  });

  it("keeps the slot for a domain that names none", () => {
    const row = html.slice(html.indexOf('href="/p/plain-product"'));
    const head = row.slice(0, row.indexOf("Plain"));
    expect(head).toContain("size-4");
    expect(head).not.toContain("<svg");
  });
});
