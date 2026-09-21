# grade10-site/store/cross-sell Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-21, tcs-rules r3.0

## grade10-site-store-cross-sell-US1: Collector opens a card the stock keeper chose for this one

**As a** collector reading a card,
**I want** the cards the stock keeper chose for it, shown under it,
**so that** I can open the next card worth having without going back to the listing.

### grade10-site-store-cross-sell-US1-TC1-1: Picks lead the rail and similar cards fill it

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cross-sell-US-01

**Pre-conditions:**

* customer is on `<card_1>`'s page.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_1>` | A card for sale whose picks are `<pick_1>` then `<pick_2>`, sharing its world with at least six other cards for sale |
| `<pick_1>` | The card chosen first on `<card_1>`, for sale |
| `<pick_2>` | The card chosen second on `<card_1>`, for sale |

**Steps:**

1. Scroll to the section under the card.
2. Read the heading and the tiles in order.

**Expected Results:**

* The heading reads You may also like.
* The first tile is `<pick_1>`, the second `<pick_2>`.
* The tiles after them share `<card_1>`'s world, six tiles in all.

### grade10-site-store-cross-sell-US1-TC2-1: Rail stops at six tiles, picks first

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-cross-sell-US-01

**Pre-conditions:**

* customer is on `<card_2>`'s page.
* `<card_2>` is a card for sale carrying the row's picks and sharing its world with at least ten cards for sale.

**Test data:**

| Picks on `<card_2>` | The rail shows |
| --- | --- |
| Seven cards for sale | The first six picks, in the stock keeper's order |
| Six cards for sale | The six picks, no similar card |
| Five cards for sale | The five picks, then one similar card |

**Steps:**

1. Scroll to the section under the card.
2. Count the tiles and read their order.

**Expected Results:**

* Six tiles show, no more.
* The tiles are as the row states.

### grade10-site-store-cross-sell-US1-TC3-1: A rail tile opens that card's own page

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cross-sell-US-01

**Pre-conditions:**

* customer is on `<card_1>`'s page.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_1>` | A card for sale whose picks are `<pick_1>` then `<pick_2>`, sharing its world with at least six other cards for sale |
| `<pick_2>` | The card chosen second on `<card_1>`, for sale |

**Steps:**

1. Scroll to the section under the card.
2. Click the second tile.

**Expected Results:**

* `<pick_2>`'s own page opens.
* That page shows `<pick_2>`'s name, price and add-to-cart control.

### grade10-site-store-cross-sell-US1-TC4-1: No tile in the rail carries a cart control

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cross-sell-US-01

**Pre-conditions:**

* customer is on `<card_1>`'s page.
* Every card in `<card_1>`'s rail is for sale.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_1>` | A card for sale whose picks are `<pick_1>` then `<pick_2>`, sharing its world with at least six other cards for sale |

**Steps:**

1. Scroll to the section under the card.
2. Read every tile in the rail.

**Expected Results:**

* No tile carries an add-to-cart or quantity control.
* Each tile shows image, name and price.
* The card's own add-to-cart control still works.

### grade10-site-store-cross-sell-US1-TC5-1: Rail arrives with the page before any script runs

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cross-sell-US-01

**Pre-conditions:**

* Scripting is disabled in the browser.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_1>` | A card for sale whose picks are `<pick_1>` then `<pick_2>`, sharing its world with at least six other cards for sale |

**Steps:**

1. Navigate to `<card_1>`'s page.
2. Scroll to the section under the card.

**Expected Results:**

* The heading and six tiles render with scripting disabled.
* Each tile is a link to its card's page.
* The page does not shift as it settles.

### grade10-site-store-cross-sell-US1-TC6-1: A sold-out pick stays, says so and still opens

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cross-sell-US-01

**Pre-conditions:**

* customer is on `<card_3>`'s page.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_3>` | A card for sale whose first pick is `<sold-out pick>` |
| `<sold-out pick>` | A card nobody can buy, chosen first on `<card_3>` |

**Steps:**

1. Scroll to the section under the card.
2. Read the first tile.
3. Click the first tile.

**Expected Results:**

* The first tile is `<sold-out pick>`, marked sold out, its price shown.
* Step 3 opens `<sold-out pick>`'s page.

### grade10-site-store-cross-sell-US1-TC7-1: The card being read never appears in its own rail

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-cross-sell-US-01

**Pre-conditions:**

* customer is on `<card_4>`'s page.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_4>` | A card for sale whose picks name `<card_4>` itself and `<pick_1>`, sharing its world with at least six cards for sale |
| `<pick_1>` | A card for sale chosen on `<card_4>` |

**Steps:**

1. Scroll to the section under the card.
2. Read every tile.

**Expected Results:**

* No tile is `<card_4>`.
* `<pick_1>` leads the rail, cards sharing `<card_4>`'s world follow.

### grade10-site-store-cross-sell-US1-TC8-1: A card with nothing to show draws no rail and no space

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cross-sell-US-01

**Pre-conditions:**

* customer is on `<card_5>`'s page.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_5>` | A card for sale with no picks, sharing no world, language or collectible type with any other card |

**Steps:**

1. Scroll past the card's own details.
2. Read the page below the card.

**Expected Results:**

* No heading and no rail.
* What follows the card sits directly under it, with no gap.

### grade10-site-store-cross-sell-US1-TC9-1: Picks that cannot be read leave similar cards and the page whole

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cross-sell-US-01

**Pre-conditions:**

* The source of the stock keeper's picks is mocked to fail.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_6>` | A card for sale with two picks, sharing its world with at least three cards for sale |

**Steps:**

1. Navigate to `<card_6>`'s page.
2. Scroll to the section under the card.

**Expected Results:**

* The rail holds the cards sharing `<card_6>`'s world, and no pick.
* The card's own name, price and add-to-cart control render as usual.

### grade10-site-store-cross-sell-US1-TC10-1: A sold-out card's own page still shows its rail

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-cross-sell-US-01

**Pre-conditions:**

* customer is on `<card_7>`'s page.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_7>` | A card nobody can buy, with one pick for sale and at least three cards sharing its world |

**Steps:**

1. Scroll to the section under the card.
2. Read the heading and the tiles.

**Expected Results:**

* The heading and the rail show.
* The pick leads, cards sharing `<card_7>`'s world follow.

### grade10-site-store-cross-sell-US1-TC12-1: One chosen card is enough for a rail

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cross-sell-US-01

**Pre-conditions:**

* customer is on `<card_20>`'s page.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_20>` | A card for sale with one pick, sharing no world, language or type with any other card for sale |

**Steps:**

1. Scroll to the section under the card.

**Expected Results:**

* The heading reads You may also like.
* One tile is drawn, the pick.

### grade10-site-store-cross-sell-US1-TC13-1: A pick that is also a similar card shows once

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cross-sell-US-01

**Pre-conditions:**

* customer is on `<card_21>`'s page.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_21>` | A card for sale with one pick, `<pick_3>`, and three other cards for sale sharing its world |
| `<pick_3>` | A card for sale sharing `<card_21>`'s world |

**Steps:**

1. Scroll to the section under the card.
2. Read the tiles in order.

**Expected Results:**

* `<pick_3>` is the first tile and appears once.
* The three other cards follow it.

---

## grade10-site-store-cross-sell-US2: Collector opens a card like the one they are reading

**As a** collector reading a card,
**I want** cards like it under it, by its world, its language and its type,
picks or no picks,
**so that** the rail leads me somewhere whether or not anyone chose for it.

### grade10-site-store-cross-sell-US2-TC1-1: A card with no picks shows cards like it

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cross-sell-US-02

**Pre-conditions:**

* customer is on `<card_8>`'s page.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_8>` | A card for sale with no picks, sharing its world with at least six cards for sale |

**Steps:**

1. Scroll to the section under the card.
2. Read the heading and the tiles.

**Expected Results:**

* The heading reads You may also like.
* Six tiles show, each a card sharing `<card_8>`'s world.

### grade10-site-store-cross-sell-US2-TC2-1: World is weighed before language, language before type

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-cross-sell-US-02

**Pre-conditions:**

* customer is on `<card_9>`'s page.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_9>` | A card for sale with no picks |
| `<world match>` | A card for sale sharing only `<card_9>`'s world |
| `<language match>` | A card for sale sharing only `<card_9>`'s language |
| `<type match>` | A card for sale sharing only `<card_9>`'s collectible type |

**Steps:**

1. Scroll to the section under the card.
2. Read the tiles in order.

**Expected Results:**

* `<world match>` comes before `<language match>`, which comes before `<type match>`.
* Every tile shares at least one of the three facts.

### grade10-site-store-cross-sell-US2-TC3-1: Newest first among cards sharing the same fact

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-cross-sell-US-02

**Pre-conditions:**

* customer is on `<card_10>`'s page.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_10>` | A card for sale with no picks |
| `<newest sibling>` | A card for sale sharing only `<card_10>`'s world, the newest of the three |
| `<middle sibling>` | A card for sale sharing only `<card_10>`'s world, added before `<newest sibling>` |
| `<oldest sibling>` | A card for sale sharing only `<card_10>`'s world, added before `<middle sibling>` |

**Steps:**

1. Scroll to the section under the card.
2. Read the tiles in order.

**Expected Results:**

* The order is `<newest sibling>`, `<middle sibling>`, `<oldest sibling>`.

### grade10-site-store-cross-sell-US2-TC4-1: Similar cards stop at six tiles

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-cross-sell-US-02

**Pre-conditions:**

* customer is on `<card_11>`'s page.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_11>` | A card for sale with no picks, sharing its world with ten cards for sale added at different times |

**Steps:**

1. Scroll to the section under the card.
2. Count the tiles.

**Expected Results:**

* Six tiles show, no more.
* They are the six newest of the ten.

### grade10-site-store-cross-sell-US2-TC5-1: A card nobody can buy is never a similar card

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-cross-sell-US-02

**Pre-conditions:**

* customer is on `<card_12>`'s page.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_12>` | A card for sale with no picks, sharing its world with `<sold-out sibling>` and two cards for sale |
| `<sold-out sibling>` | A card nobody can buy, sharing `<card_12>`'s world, newer than the two for sale |

**Steps:**

1. Scroll to the section under the card.
2. Read every tile.

**Expected Results:**

* No tile is `<sold-out sibling>`.
* The two cards for sale show, newest first.

### grade10-site-store-cross-sell-US2-TC6-1: A card missing a shared fact falls to the facts it carries

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-cross-sell-US-02

**Pre-conditions:**

* customer is on `<card_13>`'s page.
* `<card_13>` is a card for sale with no picks, carrying the row's facts, and other cards for sale carry each fact it has.

**Test data:**

| Facts `<card_13>` carries | The rail shows |
| --- | --- |
| Language and collectible type, no world | Cards sharing its language, then cards sharing its type |
| None of the three | No heading and no rail |

**Steps:**

1. Scroll to the section under the card.
2. Read the heading and the tiles.

**Expected Results:**

* The rail answers as the row states.

### grade10-site-store-cross-sell-US2-TC7-1: Similar cards follow the store's copy of the catalogue

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cross-sell-US-02

**Pre-conditions:**

* customer is on `<card_14>`'s page.
* `<new sibling>` is not yet in the store's catalogue.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_14>` | A card for sale with no picks, sharing its world with two cards for sale |
| `<new sibling>` | A card for sale sharing `<card_14>`'s world, newer than both |

**Steps:**

1. Add `<new sibling>` to the catalogue.
2. Wait until the store's listing shows `<new sibling>`, then past the product page's own minute.
3. Reload `<card_14>`'s page.

**Expected Results:**

* `<new sibling>` leads the tiles.
* The two earlier cards follow, newest first.

### grade10-site-store-cross-sell-US2-TC8-1: A fact shared twice ranks no higher than once

**Classification:**

* **Severity:** normal
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cross-sell-US-02

**Pre-conditions:**

* customer is on `<card_22>`'s page.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_22>` | A card for sale in two worlds, with no picks |
| `<card_23>` | A card for sale in both of those worlds, older |
| `<card_24>` | A card for sale in one of those worlds, newer |

**Steps:**

1. Scroll to the section under the card.
2. Read the tiles in order.

**Expected Results:**

* `<card_24>` is before `<card_23>`.

---

## grade10-site-store-cross-sell-US3: Stock keeper chooses the cards shown with a card

**As a** stock keeper on the shop's staff,
**I want** to choose the cards shown with a card in the Shopify dashboard, on
the card itself, and see them on its page,
**so that** what I know belongs together is what the collector sees.

### grade10-site-store-cross-sell-US3-TC1-1: Cards chosen in the dashboard lead the card's page in that order

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cross-sell-US-03

**Pre-conditions:**

* admin(stock keeper) is signed in to the Shopify dashboard on `<card_15>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_15>` | A card for sale with no picks, sharing its world with at least six cards for sale |
| `<first choice>` | A card for sale, chosen first |
| `<second choice>` | A card for sale, chosen second |

**Steps:**

1. Choose `<first choice>`, then `<second choice>`, on `<card_15>`.
2. Open `<card_15>`'s page in the store.
3. Scroll to the section under the card.

**Expected Results:**

* The first tile is `<first choice>`, the second `<second choice>`.
* Cards sharing `<card_15>`'s world fill the tiles after them.

### grade10-site-store-cross-sell-US3-TC2-1: Reordered picks show in the new order

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cross-sell-US-03

**Pre-conditions:**

* admin(stock keeper) is signed in to the Shopify dashboard on `<card_16>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_16>` | A card for sale whose picks are `<first choice>` then `<second choice>` |
| `<page window>` | 1 minute |

**Steps:**

1. Move `<second choice>` above `<first choice>` on `<card_16>`.
2. Wait `<page window>`.
3. Reload `<card_16>`'s page.

**Expected Results:**

* The first tile is `<second choice>`, the second `<first choice>`.
* No other tile moved.

### grade10-site-store-cross-sell-US3-TC3-1: Clearing every pick leaves similar cards under the card

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cross-sell-US-03

**Pre-conditions:**

* admin(stock keeper) is signed in to the Shopify dashboard on `<card_17>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_17>` | A card for sale with two picks, sharing its world with at least six cards for sale |

**Steps:**

1. Remove both picks from `<card_17>`.
2. Reload `<card_17>`'s page.
3. Scroll to the section under the card.

**Expected Results:**

* The heading still shows.
* Every tile is a card sharing `<card_17>`'s world.

### grade10-site-store-cross-sell-US3-TC4-1: A pick the catalogue no longer holds is left out

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-cross-sell-US-03

**Pre-conditions:**

* admin(stock keeper) has chosen `<kept pick>`, then `<gone card>`, on `<card_18>`.
* `<gone card>` is no longer in the catalogue.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_18>` | A card for sale whose picks are `<kept pick>` then `<gone card>`, sharing its world with at least six cards for sale |
| `<kept pick>` | A card for sale, chosen first on `<card_18>` |
| `<gone card>` | A card the catalogue no longer holds |

**Steps:**

1. Open `<card_18>`'s page in the store.
2. Scroll to the section under the card.
3. Read every tile.

**Expected Results:**

* `<gone card>` shows nowhere, and no tile is left blank for it.
* `<kept pick>` leads the rail, cards sharing `<card_18>`'s world follow.

---

### grade10-site-store-cross-sell-US3-TC5-1: A pick added to a card that already has picks reaches the page

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cross-sell-US-03

**Pre-conditions:**

* admin(stock keeper) is on `<card_25>` in the Shopify dashboard.
* `<card_25>`'s page shows `<pick_5>` and `<pick_6>` as its picks.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_25>` | A card for sale with two picks, `<pick_5>` then `<pick_6>` |
| `<pick_7>` | A card for sale not yet among `<card_25>`'s picks |

**Steps:**

1. Add `<pick_7>` to `<card_25>`'s picks, after `<pick_6>`.
2. Wait one minute.
3. Open `<card_25>`'s page as a customer and scroll to the section under the card.

**Expected Results:**

* The first three tiles are `<pick_5>`, `<pick_6>`, `<pick_7>`, in that order.

## Settled

None yet.

## Reconciliation

**Run:** 2026-09-21, blind feature pass, first run on this capability. Read: the isolated bundle in `.round/blind/` - the outline's `## Purpose` and `## Feature set`, `user-journeys.md`, `decisions.md` with its goals, non-goals, decisions and its empty `## Raised`, `ui-design.md`, the cross-sell PRD page, the product page's You may also like section, and `openspec/config.yaml`'s context - plus `docs/governance/specs-to-test-cases.md` whole, and `openspec/specs/grade10-site/auction/auction/feature-tcs.md` for house style. Denied: every `## Requirements` section, the rest of `openspec/specs/`, `openspec/changes/` and `openspec/changes/archive/` entirely. The bundle carried no `proposal.md`, so no case is typed `acceptance`, and there was no existing suite or `## Settled` to read.

- **Raised, folded into spec** — picks unreadable, similar cards fill alone (`grade10-site-store-cross-sell-SC-28`, Q21; the suite's US1-TC9 rewritten to the spec); similar cards stop at six (`grade10-site-store-cross-sell-SC-27`); a card with no world falls to its language and type (`grade10-site-store-cross-sell-SC-29`, Q11); clearing every pick leaves similar cards (`grade10-site-store-cross-sell-SC-30`); a pick that is also a similar card shows once (`grade10-site-store-cross-sell-SC-22`, Q23); more than six picks: the picks past the sixth are left out (`grade10-site-store-cross-sell-SC-04`, Q24); a pick the shop no longer publishes is left out (`grade10-site-store-cross-sell-SC-13`, Q25); newest by when the catalogue gained the card (`grade10-site-store-cross-sell-SC-18`, Q26); a fact shared twice counts once, and the order is strict (`grade10-site-store-cross-sell-SC-19`, Q27)
- **Raised, rejected** — the heading read in the page's served language (the suite's US1-TC11, dropped): a platform rule `shared/localization` states, restated by no capability
- **Raised, settled elsewhere** — the catalogue's copy not held: no rail for that minute at that location (Q22, `grade10-site-store-cross-sell-SC-10`); the narrow viewport: ❓ on the frame, `ui-design.md` § Screens, awaited from @tangconst by 2026-09-24
- **Freshness** — the suite's US2-TC7 waited a fixed 5 minutes and the scenarios a fixed 6; the product manager's word (Q19) is that the page states one clock, so `grade10-site-store-cross-sell-SC-23` and `grade10-site-store-cross-sell-SC-24` are written against the store's copy holding the change, past the page's own minute, and the case was rewritten to match
- **Contradicted** — none: the two readings stated no opposite outcomes. The one apparent one was the suite's US1-TC9 (no rail when the picks cannot be read) against the tech design (similar cards alone): the `ui-design.md` row "Picks could not be read" had said "as if there were nothing to show" and was corrected to "similar cards alone" (Q21) before the case was rewritten
- **Uncovered anchors** — `grade10-site-store-cross-sell-SC-25` and `grade10-site-store-cross-sell-SC-26` (the rail's exports): **Out of suite:** the shared UI package's own tests and stories in this store, `packages/ui/src/blocks/store-product/`; the two widenings the rail leans on are `shared/ui/store-home` (`shared-ui-store-home-SC-10`) and `shared/ui/store-product-listing` (`shared-ui-store-product-listing-SC-91`, `shared-ui-store-product-listing-SC-92`), verified in those packages' own tests
- **Cases added after the reconciliation** — US1-TC12 (`grade10-site-store-cross-sell-SC-05`), US1-TC13 (`grade10-site-store-cross-sell-SC-22`), US2-TC8 (`grade10-site-store-cross-sell-SC-19`), US3-TC5 (`grade10-site-store-cross-sell-SC-12`, on the product manager's remark): written by the run from the scenarios the blind pass left unreached, so they are not blind
