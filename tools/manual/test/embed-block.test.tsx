import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { buildIndex } from "../src/api/derive";
import type { DesignSyncReport } from "../src/api/types";
import { BlockScopeProvider } from "../src/blocks/block-scope";
import { FigmaBlockView, StoryBlockView } from "../src/blocks/embed-block";
import { snapshotOf } from "./manual-fixture";

/** A story id and a set name taken from the store as it stands: the cart
 * drawer's stories, and the Figma set the checker would key by name. */
const STORY = "store-cart-cartdrawer--default";
const FILE = "GW2WL6JcWok5ypUrUFi9bU";
const frame = (node: string) =>
  `https://www.figma.com/design/${FILE}/Grade10-DS-2026?node-id=${node}`;

const report = (
  sets: DesignSyncReport["sets"],
  rest: Partial<DesignSyncReport> = {},
): DesignSyncReport => ({
  generatedAt: "2026-08-30T01:00:00.000Z",
  sets,
  ...rest,
});

function render(node: React.ReactNode, designSync?: DesignSyncReport): string {
  const index = buildIndex(
    snapshotOf({
      config: {
        storybookBase: "https://storybook.example",
        groups: [],
        platform: [],
        guides: [],
      },
      ...(designSync ? { designSync } : {}),
    }),
  );
  return renderToStaticMarkup(
    <MemoryRouter>
      <BlockScopeProvider
        value={{ index, pagePath: "manual/products/demo-product/alpha.md" }}
      >
        {node}
      </BlockScopeProvider>
    </MemoryRouter>,
  );
}

const story = <StoryBlockView block={{ type: "story", id: STORY }} />;

describe("the drift badge on a story card", () => {
  it("badges a card whose component set the report marks warn", () => {
    const html = render(story, report({ "Cart Drawer": "warn" }));

    expect(html).toContain("design drift");
    expect(html).toContain("bg-warning");
  });

  it("badges a failing set louder", () => {
    const html = render(story, report({ "Cart Drawer": "fail" }));

    expect(html).toContain("design drift");
    expect(html).toContain("bg-destructive");
  });

  /** Without this, a page with no badges reads as "verified" when it usually
   * means "outside the sweep" — the one thing a designer most needs to see. */
  it("says a matching set was checked, quietly", () => {
    const html = render(story, report({ "Cart Drawer": "ok" }));

    expect(html).toContain("checked");
    expect(html).not.toContain("design drift");
    expect(html).not.toContain("bg-warning");
  });

  it("says nothing when no set in the report answers to the story", () => {
    expect(render(story, report({ Badge: "fail" }))).not.toContain("checked");
  });

  it("says nothing when the build read no report at all", () => {
    expect(render(story)).not.toContain("design drift");
  });
});

describe("the drift badge on a figma card", () => {
  const nodes = { "4735-6493": "Cart Drawer", "4171-9023": "Store" };
  const built = report({ "Cart Drawer": "fail" }, { file: FILE, nodes });
  const card = (node: string, set?: string) => (
    <FigmaBlockView
      block={{
        type: "figma",
        url: frame(node),
        title: "Cart Drawer",
        ...(set ? { set } : {}),
      }}
    />
  );

  it("badges the frame whose node id names a drifting set", () => {
    const html = render(card("4735-6493"), built);

    expect(html).toContain("design drift");
    expect(html).toContain("bg-destructive");
  });

  it("says a frame the design file no longer holds is gone", () => {
    expect(render(card("9999-1"), built)).toContain("frame is gone");
  });

  it("badges an assembly frame through the set it names by hand", () => {
    expect(render(card("4171-9023", "Cart Drawer"), built)).toContain(
      "design drift",
    );
  });

  it("carries no badge when the report knows nothing about the frame", () => {
    expect(
      render(card("4735-6493"), report({ "Cart Drawer": "fail" })),
    ).not.toContain("design drift");
  });
});
