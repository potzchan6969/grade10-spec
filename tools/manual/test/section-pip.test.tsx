import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { buildIndex } from "../src/api/derive";
import type { ChangeEntry, Snapshot } from "../src/api/types";
import { BlockScopeProvider } from "../src/blocks/block-scope";
import { ProseBlockView } from "../src/blocks/prose-block";
import { changeEntry, pageEntry, snapshotOf } from "./manual-fixture";

/**
 * The section's in-flight row and the pip a 🚧 line wears — `shared-planning-
 * change-stages-SC-65/66/67`. Rendered at the `ProseBlockView` level, which is
 * exactly the page's own top-level prose `SectionChanges` and the pip both
 * read; the surrounding page chrome (`PageView`) is not this block's own.
 */

const PATH = "docs/prds/products/demo-product/refunds.md";

const BODY = [
  "## Refunds",
  "",
  "Some rule that stands on its own.",
  "",
  "- 🚧 **Window** — refunds close after 30 days",
  "- A line carrying no mark at all",
  "",
].join("\n");

function snapshot(changes: ChangeEntry[]): Snapshot {
  return snapshotOf({
    config: {
      storybookBase: "",
      groups: [{ title: "Products", products: ["demo-product"] }],
      platform: [],
      guides: [],
    },
    taxonomy: { products: ["demo-product"], topics: [] },
    pages: [pageEntry(PATH, { title: "Refunds" }, BODY)],
    changes,
  });
}

function render(changes: ChangeEntry[]): string {
  const index = buildIndex(snapshot(changes));
  const page = index.pageByPath.get(PATH);
  const prose = page?.ast?.blocks.find((block) => block.type === "prose");
  if (prose?.type !== "prose") {
    throw new Error("fixture page did not parse to a single prose block");
  }
  return renderToStaticMarkup(
    <MemoryRouter>
      <BlockScopeProvider value={{ index, pagePath: PATH }}>
        <ProseBlockView block={prose} />
      </BlockScopeProvider>
    </MemoryRouter>,
  );
}

const linked = (id: string, extra: Partial<ChangeEntry>): ChangeEntry =>
  changeEntry(id, [], {
    sections: [{ page: PATH, slug: "refunds" }],
    ...extra,
  });

describe("the section's in-flight row", () => {
  it("shared-planning-change-stages-SC-65 - names the change's stage and its hand", () => {
    const html = render([
      linked("pos", {
        title: "Shorten the refund window",
        stage: "planned",
        hands: { dev: "sam" },
      }),
    ]);

    expect(html).toContain("Shorten the refund window");
    expect(html).toContain("Planned");
    expect(html).toContain("@sam");
  });
});

describe("the pip a 🚧 line wears", () => {
  it("shared-planning-change-stages-SC-65 - bears the stage number of the change delivering it", () => {
    const html = render([
      linked("pos", { title: "Shorten the refund window", stage: "planned" }),
    ]);

    // Planned is the fourth of the eight stages.
    expect(html).toMatch(/title="Shorten the refund window — Planned[^"]*"/);
    expect(html).toContain(">4<");
  });

  it("shared-planning-change-stages-SC-67 - carries the pip for the further stage where two changes deliver it", () => {
    const html = render([
      linked("early", { title: "The designed one", stage: "designed" }),
      linked("late", { title: "The building one", stage: "building" }),
    ]);

    expect(html).toMatch(/title="The building one — Building[^"]*"/);
    expect(html).not.toMatch(/title="The designed one — Designed[^"]*"/);
    // Building is the fifth stage.
    expect(html).toContain(">5<");
  });

  it("shared-planning-change-stages-SC-66 - wears no pip once every change delivering it has archived", () => {
    const html = render([
      linked("gone", {
        title: "The refund window, already shipped",
        status: "archived",
        stage: "archived",
      }),
    ]);

    expect(html).toContain("Window");
    // Scoped past the section's own in-flight row, which is free to say the
    // change has archived — the pip on the 🚧 line itself is what has to
    // stay silent, and that line's own `<li>` is what this checks.
    expect(html.slice(html.indexOf("Window"))).not.toContain(
      'data-slot="badge"',
    );
  });
});

describe("the pip's coverage past the page's first block", () => {
  const PATH2 = "docs/prds/products/demo-product/coverage.md";
  const BODY2 = [
    "## Coverage",
    "",
    "Some rule that stands on its own.",
    "",
    ':::callout{kind="note"}',
    "A note in the middle of the section — never a section of its own.",
    ":::",
    "",
    "- 🚧 **After** — still under Coverage, past the callout",
    "",
    "| Rule | Value |",
    "| --- | --- |",
    "| 🚧 **Deadline** | 30 days |",
    "",
  ].join("\n");

  function render2(changes: ChangeEntry[]): string {
    const index = buildIndex(
      snapshotOf({
        config: {
          storybookBase: "",
          groups: [{ title: "Products", products: ["demo-product"] }],
          platform: [],
          guides: [],
        },
        taxonomy: { products: ["demo-product"], topics: [] },
        pages: [pageEntry(PATH2, { title: "Coverage" }, BODY2)],
        changes,
      }),
    );
    const page = index.pageByPath.get(PATH2);
    const prose = (page?.ast?.blocks ?? []).filter(
      (block) => block.type === "prose",
    );
    return renderToStaticMarkup(
      <MemoryRouter>
        <BlockScopeProvider value={{ index, pagePath: PATH2 }}>
          {prose.map((block, position) =>
            block.type === "prose" ? (
              // biome-ignore lint/suspicious/noArrayIndexKey: a fixed positional sequence parsed from one immutable fixture.
              <ProseBlockView block={block} key={position} />
            ) : null,
          )}
        </BlockScopeProvider>
      </MemoryRouter>,
    );
  }

  it("keeps the section for the prose after a callout, and tags a table's marked row", () => {
    const html = render2([
      changeEntry("cover-it", [], {
        title: "Cover it",
        stage: "planned",
        sections: [{ page: PATH2, slug: "coverage" }],
      }),
    ]);

    expect(html).toContain("After");
    expect(html).toContain("Deadline");
    // Scoped past the section's own in-flight row, which wears its own
    // badges for the stage and the open hand: both marks below sit under
    // `## Coverage`, on either side of the callout and inside the table, and
    // wear the same pip for it.
    const body = html.slice(html.indexOf("Some rule that stands on its own"));
    expect(body.match(/data-slot="badge"/g)?.length).toBe(2);
  });
});
