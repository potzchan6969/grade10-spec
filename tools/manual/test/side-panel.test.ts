import { describe, expect, it } from "vitest";
import { caseParts, casesOfPage, readSuite } from "../src/api/suites";
import { rulesOf, sectionRows } from "../src/blocks/side-blocks";
import { parsePage } from "../src/content/grammar";
import { readStored } from "../src/shell/layout";

const STORE = "docs/prds/products/site/store";

const SUITE = {
  path: `${STORE}/tests/listing-tcs.md`,
  source: `# Listing Test Cases

## listing#filters: Filters

### g10.store-listing.TC1: Two worlds widen the cards

**Classification:**

* **Severity:** critical
* **Trace:** listing#filters/combining-options, listing#links/address

**Steps:**

1. Tick two worlds.

<!-- trace:case id=g10.store-listing.TC-a rev=1 -->
### g10.store-listing.TC2: The page opens

**Classification:**

* **Trace:** listing

**Steps:**

1. Open it.

### g10.store-listing.TC3: A retired case

**Classification:**

* **Trace:** listing#filters
* **Retired:** 2026-10-27 - gone
`,
};

describe("a suite's cases", () => {
  it("reads each live case's traces against the pages above its folder", () => {
    const cases = readSuite(SUITE);
    expect(cases.map((testCase) => testCase.id)).toEqual([
      "g10.store-listing.TC1",
      "g10.store-listing.TC2",
    ]);
    expect(cases[0].traces).toEqual([
      {
        page: `${STORE}/listing.md`,
        section: "filters",
        rule: "combining-options",
      },
      { page: `${STORE}/listing.md`, section: "links", rule: "address" },
    ]);
    expect(cases[0].severity).toBe("critical");
  });

  it("leaves the classification out of the body a tester reads", () => {
    const [first] = readSuite(SUITE);
    expect(first.body).toBe("**Steps:**\n\n1. Tick two worlds.");
  });

  it("leaves the rule closing a group out of its last case", () => {
    const [last] = readSuite({
      path: SUITE.path,
      source:
        "### g10.store-listing.TC9: Last\n\n**Steps:**\n\n1. Look.\n\n---\n\n### listing#links: Links\n",
    });
    expect(last.body).toBe("**Steps:**\n\n1. Look.");
  });

  it("groups a page's cases by section, with the rules each checks", () => {
    const cases = casesOfPage([SUITE], `${STORE}/listing.md`);
    expect(
      cases.bySection
        .get("filters")
        ?.map(({ testCase, rules }) => [testCase.id, rules]),
    ).toEqual([["g10.store-listing.TC1", ["combining-options"]]]);
    expect(cases.bySection.get("links")?.[0].rules).toEqual(["address"]);
    expect(cases.page.map((testCase) => testCase.id)).toEqual([
      "g10.store-listing.TC2",
    ]);
  });

  it("finds nothing for another page", () => {
    const cases = casesOfPage([SUITE], `${STORE}/cart.md`);
    expect(cases.bySection.size).toBe(0);
    expect(cases.page).toEqual([]);
  });
});

describe("a page read in two columns", () => {
  const page = parsePage(`---
title: Listing
---

Intro.

::figma{url="https://www.figma.com/design/abc/x?node-id=1-2" title="Overview"}

## Products Display

- **Grid** — cards

::story{id="grid--default" title="Grid"}

\`\`\`md
## Not a section
\`\`\`

## Filters

:::callout{kind="note"}
::story{id="inside--callout"}
:::

:::detail{title="Code map" for="engineer"}
- **Reads** — the router
:::

:::detail{title="Product decisions" for="pm"}
Why.
:::
`);

  it("cuts the page into one row a section, its side blocks beside it", () => {
    const rows = sectionRows(page.blocks);
    expect(
      rows.map((row) => [row.section, row.side.map((item) => item.tab)]),
    ).toEqual([
      ["", ["ui"]],
      ["products-display", ["ui"]],
      ["filters", ["tech"]],
    ]);
    const display = rows[1].main;
    expect(display.every((block) => block.type === "prose")).toBe(true);
    expect(
      display.map((block) => block.type === "prose" && block.markdown),
    ).toEqual([
      "## Products Display\n\n- **Grid** — cards",
      "```md\n## Not a section\n```",
    ]);
    const filters = rows[2].main.map((block) =>
      block.type === "detail" ? `detail:${block.for}` : block.type,
    );
    expect(filters).toEqual(["prose", "callout", "detail:pm"]);
  });
});

describe("the stored layout", () => {
  it("defaults whatever it cannot read", () => {
    expect(readStored(null)).toEqual({
      navWidth: 304,
      navCollapsed: false,
      panelWidth: 520,
      tab: "ui",
    });
    expect(readStored('{"navWidth":9000,"tab":"x"}').navWidth).toBe(480);
    expect(readStored('{"navWidth":9000,"tab":"x"}').tab).toBe("ui");
  });
});

describe("a case read as a tester walks it", () => {
  it("splits it into where it starts, what to do and what to see", () => {
    const parts = caseParts(`Runs once per row of **Test data**.

**Pre-conditions:**

* \`<collection>\` is published
  with products.

**Test data:**

| Action |
| --- |
| tick a world |

**Steps:**

1. Open it.
2. Dismiss the name.

**Expected Results:**

* Step 2 lists the whole catalogue.
* Nothing else moves.`);
    expect(parts).toEqual({
      lead: "Runs once per row of **Test data**.",
      given: ["`<collection>` is published with products."],
      steps: ["Open it.", "Dismiss the name."],
      expect: [
        { step: 2, text: "lists the whole catalogue." },
        { text: "Nothing else moves." },
      ],
      other: [
        { label: "Test data", text: "| Action |\n| --- |\n| tick a world |" },
      ],
    });
  });

  it("keeps a part that is not a plain list as written", () => {
    const parts = caseParts("**Steps:**\n\nOpen it, then:\n\n1. Look.");
    expect(parts.steps).toEqual([]);
    expect(parts.other).toEqual([
      { label: "Steps", text: "Open it, then:\n\n1. Look." },
    ]);
  });
});

describe("a section's rules", () => {
  it("names them as the page does, in its order, anchored as a trace writes them", () => {
    const [row] = sectionRows([
      {
        type: "prose",
        markdown: [
          "## Promo Code",
          "",
          "- **Typed** — a code",
          "  - 🚧 **Refusals in the reader's language** — in its words",
          "1. **Repriced** — first, where it applies",
          "",
          "```",
          "- **Not a rule**",
          "```",
        ].join("\n"),
      },
    ]);
    expect(rulesOf(row.main)).toEqual([
      { anchor: "typed", name: "Typed" },
      {
        anchor: "refusals-in-the-readers-language",
        name: "Refusals in the reader's language",
      },
      { anchor: "repriced", name: "Repriced" },
    ]);
  });
});
