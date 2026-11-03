/** A small release read by hand: a store page split across two phases, a
 * capability outside the store, a page with no suite and one with lines
 * being built in no phase, with the desk's verdicts built per case. */
import type { DeskVerdicts, Mark } from "../src/api/desk";
import { readPhases } from "../src/api/phases";
import { readRelease } from "../src/api/units";
import { parsePage } from "../src/content/grammar";

export const phases = readPhases(`phases:
  - id: auction
    name: Auction
    env: staging-1
    released: 2026-09-01
  - id: store-launch-1
    name: Store Launch 1
    env: staging-1
    target: 2026-11-05
  - id: store-launch-2
    name: Store Launch 2
    env: staging-1
`);

export const STORE = "docs/prds/products/site/store";
export const SHOP = `${STORE}/shop.md`;
export const TIERS = "docs/prds/products/site/loyalty/tiers.md";
export const MISC = "docs/prds/products/site/misc.md";
export const LATER = "docs/prds/products/site/later.md";
export const BARE = "docs/prds/products/site/bare.md";

export const SHOP_SOURCE = `---
title: Shop
---

::phase{id="store-launch-1" priority="P0"}

The shop opens on its grid.

## Browse

- **Grid** — cards in a grid
- **Sort** — by price

❓ Whether a sort is remembered. Product confirms

## Basket

::phase{id="store-launch-2" priority="P1" rules="gift"}

- **Add** — a line goes in
- 🚧 **Gift** — a free item comes along
  - **Wrapped** — with paper

### Points

::phase{id="store-launch-2" priority="P0"}

- **Spend** — points come off

## Same

::phase{id="store-launch-1" priority="P0"}

- **Echo** — launches with the page
`;

const SUITE = `# Shop Test Cases

## shop#browse: Browse

### g10.store-shop.TC1: The grid sorts

**Classification:**

* **Status:** actual
* **Trace:** shop#browse/grid, shop#browse/sort

## shop#basket: Basket

### g10.store-shop.TC2: A line goes in

**Classification:**

* **Status:** actual
* **Trace:** shop#basket/add

<!-- trace:case id=g10.store-shop.TC-g rev=2 -->
### g10.store-shop.TC3: A gift comes wrapped

**Classification:**

* **Status:** actual
* **Trace:** shop#basket/gift, shop#basket/wrapped

### g10.store-shop.TC4: Points come off

**Classification:**

* **Status:** actual
* **Trace:** shop#points/spend

## shop#same: Same

### g10.store-shop.TC5: Echo

**Classification:**

* **Status:** draft
* **Trace:** shop#same/echo
`;

export const pageSources: Record<string, string> = {
  [SHOP]: SHOP_SOURCE,
  [TIERS]: `---
title: Tiers
spec: site/loyalty/tiers
---

::phase{id="store-launch-1" priority="P1"}

## Tiers

- **Gold** — a tier
- ❓ **Expiry** — when a tier lapses. Product confirms
`,
  [MISC]: `---
title: Misc
---

::phase{id="store-launch-1" priority="P2"}

- **Thing** — a thing
`,
  [LATER]: `---
title: Later
---

## Planned

::phase{id="store-launch-2" priority="P1"}

- 🚧 **Soon** — placed

## Loose

- 🚧 **Drift** — in no phase
- 🚧 **Wander** — in no phase either
- **Done** — launched
`,
  [BARE]: `---
title: Bare
---

## Only

- 🚧 **Someday** — nobody placed it
`,
};

export const suites = [{ path: `${STORE}/tests/shop-tcs.md`, source: SUITE }];

export const capabilityCases = {
  "site/loyalty/tiers": [
    { id: "t.TC1", status: "actual" },
    { id: "t.TC2", status: "actual" },
  ],
};

export const reading = readRelease({
  phases,
  pages: Object.entries(pageSources).map(([path, source]) => ({
    path,
    ast: parsePage(source),
  })),
  suites,
  capabilityCases,
});

export function mark(
  row: string,
  surface: Mark["surface"],
  value: Mark["value"],
  triage?: Mark["triage"],
): Mark {
  return {
    id: `${row}-${surface}`,
    row,
    surface,
    value,
    by: "qa@example.com",
    at: "2026-11-03T00:00:00Z",
    seq: 1,
    ...(triage ? { triage } : {}),
  };
}

const both = (row: string, value: Mark["value"], triage?: Mark["triage"]) => [
  mark(row, "web", value, triage),
  mark(row, "mobile", value === "fail" ? "pass" : value),
];

/** Run 27 on staging-1: the grid passes, a line fails as a bug, a gift
 * passes beside an automated fail nobody triaged, and points wait. */
export const verdicts: DeskVerdicts = {
  runs: [
    {
      id: "r27",
      name: "Run 27",
      env: "staging-1",
      state: "open",
      openedBy: "qa@example.com",
      openedAt: "2026-11-01T00:00:00Z",
      source: "abc",
      fingerprint: "f",
      cases: 4,
      rows: 4,
    },
  ],
  cases: {
    "staging-1": {
      "g10.store-shop.TC1": {
        run: "r27",
        rows: [{ key: "g10.store-shop.TC1", marks: both("TC1", "pass") }],
      },
      "g10.store-shop.TC2": {
        run: "r27",
        rows: [
          { key: "g10.store-shop.TC2", marks: both("TC2", "fail", "bug") },
        ],
      },
      "g10.store-shop.TC3": {
        run: "r27",
        marker: "g10.store-shop.TC-g",
        rev: 2,
        rows: [
          {
            key: "g10.store-shop.TC3",
            marks: [...both("TC3", "pass"), mark("TC3", "autoWeb", "fail")],
          },
        ],
      },
      "g10.store-shop.TC4": {
        run: "r27",
        rows: [{ key: "g10.store-shop.TC4", marks: both("TC4", "todo") }],
      },
    },
  },
  excluded: {},
};
