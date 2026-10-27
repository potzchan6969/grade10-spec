import { describe, expect, it } from "vitest";
import { casesOfPage, readSuite } from "../src/api/suites";
import { splitPage } from "../src/blocks/side-blocks";
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

  it("groups a page's cases by section, with the rules each checks", () => {
    const cases = casesOfPage([SUITE], `${STORE}/listing.md`);
    expect(
      cases.bySection.get("filters")?.map(({ testCase, rules }) => [
        testCase.id,
        rules,
      ]),
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

  it("moves stories, designs and the engineer's detail under their section", () => {
    const { main, side } = splitPage(page.blocks);
    expect(side.map(({ tab, section }) => [tab, section])).toEqual([
      ["ui", ""],
      ["ui", "products-display"],
      ["tech", "filters"],
    ]);
    expect(main.some((block) => block.type === "story")).toBe(false);
    expect(main.some((block) => block.type === "callout")).toBe(true);
    expect(
      main.filter((block) => block.type === "detail").map((block) => block.for),
    ).toEqual(["pm"]);
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
