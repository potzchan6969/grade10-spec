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

const report = (sets: DesignSyncReport["sets"]): DesignSyncReport => ({
  generatedAt: "2026-08-30T01:00:00.000Z",
  sets,
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

  it("says nothing for a set that matched, or one nothing was compared for", () => {
    for (const verdict of ["ok", "skipped"] as const) {
      expect(render(story, report({ "Cart Drawer": verdict }))).not.toContain(
        "design drift",
      );
    }
  });

  it("says nothing when no set in the report answers to the story", () => {
    expect(render(story, report({ Badge: "fail" }))).not.toContain(
      "design drift",
    );
  });

  it("says nothing when the build read no report at all", () => {
    expect(render(story)).not.toContain("design drift");
  });
});

describe("a figma card", () => {
  it("carries no badge — a node id and a set name do not join here", () => {
    const html = render(
      <FigmaBlockView
        block={{
          type: "figma",
          url: "https://www.figma.com/design/abc/Store?node-id=4735-6493",
          title: "Cart Drawer",
        }}
      />,
      report({ "Cart Drawer": "fail" }),
    );

    expect(html).toContain("Cart Drawer");
    expect(html).not.toContain("design drift");
  });
});
