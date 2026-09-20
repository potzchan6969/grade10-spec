import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { buildIndex } from "../src/api/derive";
import type { ChangeEntry } from "../src/api/types";
import { OnThePages } from "../src/blocks/on-the-pages";
import {
  changeEntry,
  pageEntry,
  snapshotOf,
  specEntry,
} from "./manual-fixture";

/**
 * On the pages: every line this change marks, by page and section, so a
 * reviewer reads the outcomes it delivers on one screen rather than opening
 * each page the proposal links.
 *
 * The marks are read by `open-marks.ts`, the one reader of the grammar, and
 * the section boundary is `sectionTextOf`'s: a line under another heading of
 * the same page is that section's and not this one's. The row's own label is
 * `ChangeStatus`'s, which is why nothing here asserts it.
 */

const SPEC = "demo-product/alpha";
const PAGE = "docs/prds/products/demo-product/alpha.md";

const BODY = `Prose.

## Points

- 🚧 **Points expire** — a year after the last order
- 🚧 **Points show on the receipt** — under the total
- ❓ **Birthday month** — whether it doubles the month's points
- A line nobody marked
- **A question, not a guess** — a row, or a ❓ line on the page

:::detail{title="Product decisions" for="pm"}
| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Tier window | ❓ Open | Nobody has said. | Product |
:::

## Tiers

- 🚧 **Gold at 500** — a tier this change never touched
- ❓ **Tier discount** — whether Finance funds the gold rate
`;

const asked = {
  artifact: "proposal",
  page: PAGE,
  section: "points",
  role: "pm",
  hand: "robin",
  text: "**Birthday month** — whether it doubles the month's points",
};

/** The ❓ line of the second section, addressed to a confirmer outside the six
 * roles — the store routes it to that word, and nothing narrows it to one of
 * the six on the way to the page. */
const askedOfFinance = {
  artifact: "proposal",
  page: PAGE,
  section: "tiers",
  role: "finance",
  hand: "finance",
  text: "**Tier discount** — whether Finance funds the gold rate",
};

function render(change: ChangeEntry): string {
  const index = buildIndex(
    snapshotOf({
      config: {
        storybookBase: "",
        groups: [{ title: "Products", products: ["demo-product"] }],
        platform: [],
        guides: [],
      },
      taxonomy: { products: ["demo-product"], topics: [] },
      pages: [
        pageEntry("docs/prds/products/demo-product/index.md", {
          title: "Demo product",
        }),
        pageEntry(PAGE, { title: "Alpha", spec: SPEC }, BODY),
      ],
      specs: [specEntry(SPEC, ["Points expire"])],
      changes: [change],
    }),
  );
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={[`/in-flight/${change.id}`]}>
      <OnThePages change={change} index={index} />
    </MemoryRouter>,
  );
}

const marking = (extra: Partial<ChangeEntry> = {}) =>
  changeEntry("gift-cards", [], {
    title: "Gift cards",
    hands: { pm: "robin" },
    sections: [{ page: PAGE, slug: "points" }],
    questions: [asked],
    ...extra,
  });

describe("the lines the change marks", () => {
  const html = render(marking());

  it("shared-planning-change-stages-SC-71 - names the page and the section, linked to where the line sits", () => {
    expect(html).toContain("Alpha");
    expect(html).toContain("Points");
    expect(html).toContain('href="/p/demo-product/alpha#points"');
  });

  it("reads each marked line as the page writes it", () => {
    expect(html).toContain("Points expire");
    expect(html).toContain("a year after the last order");
    expect(html).toContain("<strong>Points expire</strong>");
  });

  it("names the hand of every line nobody has confirmed", () => {
    expect(html).toContain("whether it doubles");
    expect(html).toContain("@robin");
  });

  it("says the role is open where the change names no hand for it", () => {
    const html = render(
      marking({
        hands: {},
        questions: [{ ...asked, hand: "pm" }],
      }),
    );

    expect(html).toContain("product manager");
    expect(html).toContain("open");
  });

  it("leaves a line under another section of the same page alone", () => {
    expect(html).not.toContain("Gold at 500");
  });

  it("leaves a line nobody marked to the page", () => {
    expect(html).not.toContain("A line nobody marked");
  });

  it("leaves a mark the store reads as words to the page", () => {
    // `openMarksOfPage` counts a mark leading its line, so prose about the
    // grammar is not a line this change delivers - and no question of the
    // change could ever name its hand.
    expect(html).not.toContain("A question, not a guess");
  });

  it("leaves a titled block's row to the page", () => {
    // A `Product decisions` table carries what the page keeps against every
    // change that ever touched it, which is the boundary the store's own
    // questions are written on.
    expect(html).not.toContain("Tier window");
  });
});

describe("two linked sections, as the scenario reads them", () => {
  const html = render(
    marking({
      sections: [
        { page: PAGE, slug: "points" },
        { page: PAGE, slug: "tiers" },
      ],
      questions: [asked, askedOfFinance],
    }),
  );

  it("lists each section under its page's title, in the order linked", () => {
    expect(html).toContain("Alpha › Points");
    expect(html).toContain("Alpha › Tiers");
    expect(html.indexOf("Points")).toBeLessThan(html.indexOf("Tiers"));
    expect(html).toContain('href="/p/demo-product/alpha#tiers"');
  });

  it("shows every marked line of both sections", () => {
    expect(html).toContain("Points expire");
    expect(html).toContain("Points show on the receipt");
    expect(html).toContain("Gold at 500");
    expect(html).toContain("Tier discount");
  });

  it("names a hand outside the six roles by the word the row wrote", () => {
    expect(html).toContain("finance — open");
  });
});

describe("a change with nothing marked", () => {
  it("says so rather than drawing a heading over nothing", () => {
    const html = render(marking({ sections: undefined, questions: [] }));

    expect(html).toContain("This change marks no page section");
    expect(html).not.toContain("Points expire");
  });

  it("says so for a section the manual has no page for", () => {
    const html = render(
      marking({
        sections: [
          { page: "docs/prds/products/demo-product/gone.md", slug: "x" },
        ],
        questions: [],
      }),
    );

    expect(html).toContain("This change marks no page section");
  });
});
