# grade10-site/store/cross-sell Test Cases

**Status:** approved
**Reviewed:** 2026-09-28, tcs-rules r4
**Out of suite:** grade10-site-store-cross-sell-SC-25, grade10-site-store-cross-sell-SC-26, grade10-site-store-cross-sell-SC-34

## grade10-site-store-cross-sell-US1: Collector opens a card the stock keeper chose for this one

**As a** collector reading a card,
**I want** the cards the stock keeper chose for it, shown under it,
**so that** I can open the next card worth having without going back to the listing.

### grade10-site-store-cross-sell-US1-TC1-1: Picks lead the rail and similar cards fill it

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cross-sell-US-01

**Pre-conditions:**

* `<card_1>`'s picks are set by the recipe "Choose picks on a staging-shop card".
* customer is on `<card_1>`'s page.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_1>` | A card for sale whose picks are `<pick_1>` then `<pick_2>`, sharing its world with at least six other cards for sale |
| `<pick_1>` | The card chosen first on `<card_1>`, for sale |
| `<pick_2>` | The card chosen second on `<card_1>`, for sale |
| `<world>` | `<card_1>`'s world, as the listing's world filter names it |

**Steps:**

1. Scroll to the section under the card.
2. Read the heading and the tiles in order.
3. Open the store listing filtered to `<world>`.

**Expected Results:**

* The heading reads You may also like.
* The first tile is `<pick_1>`, the second `<pick_2>`.
* Tiles 3 to 6 each show on the listing filtered to `<world>`.
* Six tiles in all.
* No tile or label marks a card as chosen or similar.

### grade10-site-store-cross-sell-US1-TC2-1: Rail stops at six tiles, picks first

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cross-sell-US-01

**Pre-conditions:**

* `<card_2>`'s picks are set by the recipe "Choose picks on a staging-shop card".
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
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cross-sell-US-01

**Pre-conditions:**

* `<card_1>`'s picks are set by the recipe "Choose picks on a staging-shop card".
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
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cross-sell-US-01

**Pre-conditions:**

* `<card_1>`'s picks are set by the recipe "Choose picks on a staging-shop card".
* customer is on `<card_1>`'s page.
* Every card in `<card_1>`'s rail is for sale.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_1>` | A card for sale whose picks are `<pick_1>` then `<pick_2>`, sharing its world with at least six other cards for sale |
| `<pick_1>` | The card chosen first on `<card_1>`, for sale |
| `<pick_2>` | The card chosen second on `<card_1>`, for sale |

**Steps:**

1. Scroll to the section under the card.
2. Read every tile in the rail.

**Expected Results:**

* No tile carries an add-to-cart or quantity control.

### grade10-site-store-cross-sell-US1-TC5-1: Rail arrives with the page before any script runs

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cross-sell-US-01

**Pre-conditions:**

* `<card_1>`'s picks are set by the recipe "Choose picks on a staging-shop card".
* Scripting is disabled in the browser.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_1>` | A card for sale whose picks are `<pick_1>` then `<pick_2>`, sharing its world with at least six other cards for sale |

**Steps:**

1. Navigate to `<card_1>`'s page.
2. Scroll to the section under the card.
3. Hover each tile in turn.
4. Click the first tile.
5. Enable scripting in the browser.
6. Set DevTools network throttling to Slow 3G.
7. Open `<card_1>`'s page.
8. Watch the card and the section under it until loading ends.

**Expected Results:**

* Step 2: under the card, the heading You may also like and six tiles render.
* Step 3 shows each tile's own card address as its link target.
* Step 4 opens that card's page, scripting still disabled.
* Step 8: no placeholder shows in the rail's place.
* Step 8: the card's name and price do not move.

### grade10-site-store-cross-sell-US1-TC6-1: A sold-out pick stays, says so and still opens

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cross-sell-US-01

**Pre-conditions:**

* `<card_3>`'s picks are set by the recipe "Choose picks on a staging-shop card".
* customer is on `<card_3>`'s page.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_3>` | A card for sale whose first pick is `<sold-out pick>` |
| `<sold-out pick>` | A card nobody can buy (sold out by the recipe "Sell a card out"), chosen first on `<card_3>` |

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
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-cross-sell-US-01

**Pre-conditions:**

* `<card_4>`'s picks are set by the recipe "Choose picks on a staging-shop card".
* customer is on `<card_4>`'s page.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_4>` | A card for sale whose picks name `<card_4>` itself and `<pick_4>`, sharing its world with at least six cards for sale |
| `<pick_4>` | A card for sale chosen on `<card_4>` |

**Steps:**

1. Scroll to the section under the card.
2. Read every tile.

**Expected Results:**

* No tile is `<card_4>`.
* `<pick_4>` leads the rail, cards sharing `<card_4>`'s world follow.

### grade10-site-store-cross-sell-US1-TC8-1: A card with nothing to show draws no rail and no space

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cross-sell-US-01

**Pre-conditions:**

* `<card_5>` is made by the recipe "A card sharing nothing".
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
* Nothing in the page body follows the card's last line.

### grade10-site-store-cross-sell-US1-TC9-1: Picks that cannot be read leave similar cards and the page whole

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
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
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cross-sell-US-01

**Pre-conditions:**

* `<card_7>`'s picks are set by the recipe "Choose picks on a staging-shop card".
* customer is on `<card_7>`'s page.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_7>` | A card nobody can buy (sold out by the recipe "Sell a card out"), with one pick for sale and at least three cards for sale sharing its world |

**Steps:**

1. Scroll to the section under the card.
2. Read the heading and the tiles.

**Expected Results:**

* The heading You may also like shows, the rail under it.
* The pick leads, cards sharing `<card_7>`'s world follow.

### grade10-site-store-cross-sell-US1-TC12-1: One chosen card is enough for a rail

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-cross-sell-US-01

**Pre-conditions:**

* `<card_20>` is made by the recipe "A card sharing nothing".
* `<card_20>`'s picks are set by the recipe "Choose picks on a staging-shop card".
* customer is on `<card_20>`'s page.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_20>` | A card for sale with one pick, sharing no world, language or type with any other card for sale |

**Steps:**

1. Scroll to the section under the card.
2. Read the heading and the tiles.

**Expected Results:**

* The heading reads You may also like.
* One tile is drawn, the pick.

### grade10-site-store-cross-sell-US1-TC13-1: A pick that is also a similar card shows once

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-cross-sell-US-01

**Pre-conditions:**

* `<card_21>`'s picks are set by the recipe "Choose picks on a staging-shop card".
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

### grade10-site-store-cross-sell-US1-TC14-1: A card the store has just taken in shows its picks alone

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-cross-sell-US-01

**Pre-conditions:**

* `<card_26>`'s picks are set by the recipe "Choose picks on a staging-shop card".
* The store's copy of the catalogue does not hold `<card_26>`.
* customer is on `<card_26>`'s page.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_26>` | A card with two picks chosen, sharing its world with at least three cards for sale |
| `<card_27>`, `<card_28>` | Its two picks, for sale and long in the catalogue |

**Steps:**

1. Scroll to the section under the card.
2. Read the tiles.

**Expected Results:**

* The rail holds `<card_27>` and `<card_28>` in the stock keeper's order and no other card.
* The card's own name, price and add-to-cart control render as usual.

### grade10-site-store-cross-sell-US1-TC15-1: A rail the site cannot compose leaves the page whole

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-cross-sell-US-01

**Pre-conditions:**

* The store's copy of the catalogue is not to hand.
* customer is on `<card_1>`'s page.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_1>` | A card for sale whose picks are `<pick_1>` then `<pick_2>`, sharing its world with at least six other cards for sale |

**Steps:**

1. Scroll past the card's own details.
2. Read the page below the card.

**Expected Results:**

* The card's name, price and add-to-cart control render.
* No heading and no rail.
* Nothing in the page body follows the card's last line.

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
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cross-sell-US-02

**Pre-conditions:**

* The cards in **Test data** are set up as the recipe "A card with chosen facts, on the staging shop" says.
* customer is on `<card_8>`'s page.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_8>` | A card for sale with no picks, sharing its world with four cards for sale, gained on different days |

**Steps:**

1. Scroll to the section under the card.
2. Read the heading and the tiles.

**Expected Results:**

* The heading reads You may also like.
* The four cards sharing `<card_8>`'s world show, newest first, and no other tile.

### grade10-site-store-cross-sell-US2-TC2-1: World is weighed before language, language before type

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cross-sell-US-02

**Pre-conditions:**

* The cards in **Test data** are set up as the recipe "A card with chosen facts, on the staging shop" says.
* customer is on `<card_9>`'s page.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_9>` | A card for sale with no picks, carrying a world, a language and a collectible type |
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
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cross-sell-US-02

**Pre-conditions:**

* The cards in **Test data** are set up as the recipe "A card with chosen facts, on the staging shop" says.
* customer is on `<card_10>`'s page.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_10>` | A card for sale with no picks |
| `<newest sibling>` | A card for sale sharing only `<card_10>`'s world, the newest of the three |
| `<middle sibling>` | A card for sale sharing only `<card_10>`'s world, gained by the catalogue before `<newest sibling>` |
| `<oldest sibling>` | A card for sale sharing only `<card_10>`'s world, gained by the catalogue before `<middle sibling>` |

**Steps:**

1. Scroll to the section under the card.
2. Read the tiles in order.

**Expected Results:**

* The order is `<newest sibling>`, `<middle sibling>`, `<oldest sibling>`.

### grade10-site-store-cross-sell-US2-TC4-1: Similar cards stop at six tiles

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cross-sell-US-02

**Pre-conditions:**

* The cards in **Test data** are set up as the recipe "A card with chosen facts, on the staging shop" says.
* customer is on `<card_11>`'s page.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_11>` | A card for sale with no picks, sharing its world with ten cards for sale, gained by the catalogue on different days |

**Steps:**

1. Scroll to the section under the card.
2. Count the tiles.

**Expected Results:**

* Six tiles show, no more.
* They are the six newest of the ten, newest first.

### grade10-site-store-cross-sell-US2-TC5-1: A card nobody can buy is never a similar card

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cross-sell-US-02

**Pre-conditions:**

* The cards in **Test data** are set up as the recipe "A card with chosen facts, on the staging shop" says.
* `<sold-out sibling>` is sold out by the recipe "Sell a card out".
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
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cross-sell-US-02

**Pre-conditions:**

* The cards in **Test data** are set up as the recipe "A card with chosen facts, on the staging shop" says.
* customer is on `<card_13>`'s page.
* `<card_13>` is a card for sale carrying the row's facts and picks; for each fact it carries, one other card for sale shares that fact alone.

**Test data:**

| What `<card_13>` carries | The rail shows |
| --- | --- |
| Language and collectible type, no world, no picks | Cards sharing its language, then cards sharing its type |
| None of the three, picks `<pick_a>`, `<pick_b>` | `<pick_a>`, `<pick_b>` in that order, no other tile |
| None of the three, no picks | No heading and no rail |

**Steps:**

1. Scroll to the section under the card.
2. Read the heading and the tiles.

**Expected Results:**

* The rail answers as the row states.

### grade10-site-store-cross-sell-US2-TC7-1: Similar cards follow the store's copy of the catalogue

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cross-sell-US-02

**Pre-conditions:**

* `<card_14>` and the two cards sharing its world are set up as the recipe "A card with chosen facts, on the staging shop" says.
* customer is on `<card_14>`'s page.
* `<new sibling>` is created in the staging shop's admin after both cards, with `<card_14>`'s world, and not published to the store's sales channel.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_14>` | A card for sale with no picks, sharing its world with two cards for sale |
| `<new sibling>` | A card for sale sharing `<card_14>`'s world, newer than both |

**Steps:**

1. In the staging shop's admin, publish `<new sibling>` to the store's sales channel.
2. Wait until the store listing shows `<new sibling>`, then 60 more seconds.
3. Reload `<card_14>`'s page.

**Expected Results:**

* Before step 1, the two cards sharing `<card_14>`'s world show.
* After step 3, `<new sibling>` leads the tiles.
* After step 3, the two earlier cards follow, newest first.

### grade10-site-store-cross-sell-US2-TC8-1: A fact shared twice ranks no higher than once

**Classification:**

* **Severity:** normal
* **Priority:** low
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cross-sell-US-02

**Pre-conditions:**

* The cards in **Test data** are set up as the recipe "A card with chosen facts, on the staging shop" says.
* customer is on `<card_22>`'s page.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_22>` | A card for sale in two worlds, with no picks |
| `<card_23>` | A card for sale in both of those worlds, sharing no language or type with `<card_22>`, gained earlier |
| `<card_24>` | A card for sale in one of those worlds, sharing no language or type with `<card_22>`, gained later |

**Steps:**

1. Scroll to the section under the card.
2. Read the tiles in order.

**Expected Results:**

* `<card_24>` is before `<card_23>`.

### grade10-site-store-cross-sell-US2-TC9-1: Closer comes before newer

**Classification:**

* **Severity:** normal
* **Priority:** low
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cross-sell-US-02

**Pre-conditions:**

* The cards in **Test data** are set up as the recipe "A card with chosen facts, on the staging shop" says.
* customer is on `<card_29>`'s page.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_29>` | A card for sale with a world and a language, no picks |
| `<card_30>` | A card for sale sharing its world and its language, gained in March |
| `<card_31>` | A card for sale sharing only its world, gained in April |

**Steps:**

1. Scroll to the section under the card.
2. Read the tiles in order.

**Expected Results:**

* `<card_30>` is before `<card_31>`.

### grade10-site-store-cross-sell-US2-TC10-1: A similar card that sells out leaves the rail

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cross-sell-US-02

**Pre-conditions:**

* The cards in **Test data** are set up as the recipe "A card with chosen facts, on the staging shop" says.
* customer is on `<card_32>`'s page.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_32>` | A card for sale with no picks, sharing its world with `<leaving sibling>` and one other card for sale |
| `<leaving sibling>` | A card for sale sharing `<card_32>`'s world |

**Steps:**

1. Sell `<leaving sibling>` out by the recipe "Sell a card out".
2. Reload `<card_32>`'s page.

**Expected Results:**

* Before step 1, `<leaving sibling>` shows.
* After step 2, `<leaving sibling>` is gone and the other card remains.

### grade10-site-store-cross-sell-US2-TC11-1: Picks that cannot be read leave similar cards and the page whole

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-cross-sell-US-02

**Pre-conditions:**

* The cards in **Test data** are set up as the recipe "A card with chosen facts, on the staging shop" says.
* The stock keeper's picks on `<card_6>` cannot be read.

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
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-store-cross-sell-US-03

**Pre-conditions:**

* admin(stock keeper) is in the staging shop's admin, at Apps > Search & Discovery > Product recommendations, with `<card_15>` open.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_15>` | A card for sale with no picks |
| `<first choice>`, `<second choice>`, `<third choice>` | Cards for sale sharing no world, language or type with `<card_15>` |
| `<page window>` | 1 minute |

**Steps:**

1. Under Complementary products, add `<first choice>`, `<second choice>`, `<third choice>`, in that order.
2. Click Save.
3. Wait `<page window>`.
4. Open `<card_15>`'s page on the staging storefront.
5. Scroll to You may also like.

**Expected Results:**

* The first three tiles are `<first choice>`, `<second choice>`, `<third choice>`, in that order.

### grade10-site-store-cross-sell-US3-TC2-1: Reordered picks show in the new order

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-store-cross-sell-US-03

**Pre-conditions:**

* `<card_16>`'s picks are set by the recipe "Choose picks on a staging-shop card".
* admin(stock keeper) is in the staging shop's admin, at Apps > Search & Discovery > Product recommendations, with `<card_16>` open.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_16>` | A card for sale whose picks are `<first choice>` then `<second choice>` |
| `<first choice>`, `<second choice>` | Cards for sale sharing no world, language or type with `<card_16>` |
| `<page window>` | 1 minute |

**Steps:**

1. Under Complementary products, drag `<second choice>` above `<first choice>`.
2. Click Save.
3. Wait `<page window>`.
4. Open `<card_16>`'s page on the staging storefront.
5. Scroll to You may also like.

**Expected Results:**

* The first tile is `<second choice>`, the second `<first choice>`.

### grade10-site-store-cross-sell-US3-TC3-1: Clearing every pick leaves similar cards under the card

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-store-cross-sell-US-03

**Pre-conditions:**

* `<card_17>`'s picks are set by the recipe "Choose picks on a staging-shop card".
* admin(stock keeper) is in the staging shop's admin, at Apps > Search & Discovery > Product recommendations, with `<card_17>` open.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_17>` | A card for sale whose picks are `<pick_8>` then `<pick_9>`, sharing its world with at least six cards for sale |
| `<pick_8>`, `<pick_9>` | Cards for sale sharing no world, language or type with `<card_17>` |
| `<page window>` | 1 minute |

**Steps:**

1. Under Complementary products, remove `<pick_8>` and `<pick_9>`.
2. Click Save.
3. Wait `<page window>`.
4. Open `<card_17>`'s page on the staging storefront.
5. Scroll to You may also like.

**Expected Results:**

* Every tile shares `<card_17>`'s world.
* Neither `<pick_8>` nor `<pick_9>` shows.

### grade10-site-store-cross-sell-US3-TC4-1: A pick the catalogue no longer holds is left out

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-store-cross-sell-US-03

**Pre-conditions:**

* `<card_18>`'s picks are set by the recipe "Choose picks on a staging-shop card".
* admin(stock keeper) is in the staging shop's admin, with `<gone card>` open.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_18>` | A card for sale whose picks are `<kept pick 1>`, `<gone card>`, `<kept pick 2>` |
| `<kept pick 1>`, `<kept pick 2>` | Cards for sale sharing no world, language or type with `<card_18>` |
| `<gone card>` | A card for sale, chosen second on `<card_18>`, sharing no world, language or type with it |
| `<page window>` | 1 minute |

**Steps:**

1. Unpublish `<gone card>` from the Headless sales channel.
2. Wait until the store listing no longer shows `<gone card>`.
3. Wait `<page window>`.
4. Open `<card_18>`'s page on the staging storefront.
5. Scroll to You may also like.
6. Publish `<gone card>` back to the Headless sales channel.

**Expected Results:**

* `<gone card>` shows nowhere, and no tile is left blank for it.
* The first two tiles are `<kept pick 1>`, then `<kept pick 2>`.

### grade10-site-store-cross-sell-US3-TC5-1: A pick added to a card that already has picks reaches the page

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-store-cross-sell-US-03

**Pre-conditions:**

* admin(stock keeper) is in the staging shop's admin, at Apps > Search & Discovery > Product recommendations, with `<card_25>` open.
* `<card_25>`'s picks are `<pick_5>` then `<pick_6>`, set by the recipe "Choose picks on a staging-shop card".

**Test data:**

| Field | Value |
| --- | --- |
| `<card_25>` | A card for sale with two picks, `<pick_5>` then `<pick_6>` |
| `<pick_5>`, `<pick_6>`, `<pick_7>` | Cards for sale sharing no world, language or type with `<card_25>`; `<pick_7>` not yet a pick |
| `<page window>` | 1 minute |

**Steps:**

1. Under Complementary products, add `<pick_7>` after `<pick_6>`.
2. Click Save.
3. Wait `<page window>`.
4. Open `<card_25>`'s page on the staging storefront.
5. Scroll to You may also like.

**Expected Results:**

* The first three tiles are `<pick_5>`, `<pick_6>`, `<pick_7>`, in that order.

## Settled

None yet.

## Reconciliation

**Run:** 2026-09-21, blind feature pass, first run on this capability. Read: the isolated bundle in `.round/blind/` - the outline's `## Purpose` and `## Feature set`, `user-journeys.md`, `decisions.md` with its goals, non-goals, decisions and its empty `## Raised`, `ui-design.md`, the cross-sell PRD page, the product page's You may also like section, and `openspec/config.yaml`'s context - plus `docs/governance/specs-to-test-cases.md` whole, and `openspec/specs/grade10-site/auction/auction/feature-tcs.md` for house style. Denied: every `## Requirements` section, the rest of `openspec/specs/`, `openspec/changes/` and `openspec/changes/archive/` entirely. The bundle carried no `proposal.md`, so no case is typed `acceptance`, and there was no existing suite or `## Settled` to read.

- **Raised, folded into spec** — picks unreadable, similar cards fill alone (`grade10-site-store-cross-sell-SC-28`, Q21; the suite's US1-TC9 rewritten to the spec); similar cards stop at six (`grade10-site-store-cross-sell-SC-27`); a card with no world falls to its language and type (`grade10-site-store-cross-sell-SC-29`, Q11); clearing every pick leaves similar cards (`grade10-site-store-cross-sell-SC-30`); a pick that is also a similar card shows once (`grade10-site-store-cross-sell-SC-22`, Q23); more than six picks: the picks past the sixth are left out (`grade10-site-store-cross-sell-SC-04`, Q24); a pick the shop no longer publishes is left out (`grade10-site-store-cross-sell-SC-13`, Q25); newest by when the catalogue gained the card (`grade10-site-store-cross-sell-SC-18`, Q26); a fact shared twice counts once, and the order is strict (`grade10-site-store-cross-sell-SC-19`, Q27)
- **Raised, rejected** — the heading read in the page's served language (the suite's US1-TC11, dropped): a platform rule `shared/localization` states, restated by no capability
- **Raised, settled elsewhere** — the catalogue's copy not held: no rail for that minute at that location (Q22, `grade10-site-store-cross-sell-SC-10`); the narrow viewport: settled in `ui-design.md` § Screens (Q51)
- **Freshness** — the suite's US2-TC7 waited a fixed 5 minutes and the scenarios a fixed 6; the product manager's word (Q19) is that the page states one clock, so `grade10-site-store-cross-sell-SC-23` and `grade10-site-store-cross-sell-SC-24` are written against the store's copy holding the change, past the page's own minute, and the case was rewritten to match
- **Contradicted** — none: the two readings stated no opposite outcomes. The one apparent one was the suite's US1-TC9 (no rail when the picks cannot be read) against the tech design (similar cards alone): the `ui-design.md` row "Picks could not be read" had said "as if there were nothing to show" and was corrected to "similar cards alone" (Q21) before the case was rewritten
- **Uncovered anchors** — `grade10-site-store-cross-sell-SC-25` and `grade10-site-store-cross-sell-SC-26` (the rail's exports): **Out of suite:** the shared UI package's own tests and stories in this store, `packages/ui/src/blocks/store-product/`; the widenings the rail leans on are `shared/ui/store-home` (`shared-ui-store-home-SC-10`) and `shared/ui/store-product-listing` (`shared-ui-store-product-listing-SC-91`, `shared-ui-store-product-listing-SC-92`, `shared-ui-store-product-listing-SC-93`), verified in those packages' own tests
- **Cases added after the reconciliation** — US1-TC12 (`grade10-site-store-cross-sell-SC-05`), US1-TC13 (`grade10-site-store-cross-sell-SC-22`), US2-TC8 (`grade10-site-store-cross-sell-SC-19`), US3-TC5 (`grade10-site-store-cross-sell-SC-12`, on the product manager's remark): written by the run from the scenarios the blind pass left unreached, so they are not blind
- **Scenarios added after the reconciliation** — `grade10-site-store-cross-sell-SC-33`, a card in the rail is a link to its page (Q52), is asserted by US1-TC5-1's link result, which the blind pass wrote before the scenario existed; the case's block on the listing's round is lifted with it

### Out of suite

* `grade10-site-store-cross-sell-SC-34` - the rail switched off: the store's own switch, set in code and deployed, so no walk on a running stack can turn it. Its verifier, in the application repository: the card read's test, `packages/grade10-store/backend/test/services/catalog/related.test.ts` (`readCard`, cited by the id), which drives the decision the catalog router answers from, switched off and on.
* `grade10-site-store-cross-sell-SC-25` and `grade10-site-store-cross-sell-SC-26` - the rail's exports: the block's own stories and public-exports test in this store, `packages/ui/src/blocks/store-product/`.

### Manual

What stays manual, and why. No single test decides a case whole, and the
walks live in the application repository, where a `**Decided by:**` path
cannot reach, so no case here is flipped. Each row names the test that proves
part of the case, in these words, and what a person walks beyond it:

- the rule's test - `packages/grade10-store/backend/test/services/catalog/related.test.ts`, in the application repository
- the page's test - `apps/frontend/grade10/src/pages/store/ProductPage.test.tsx`, in the application repository
- the served document's test - `apps/frontend/grade10/src/serving/hydration.test.tsx`, in the application repository
- the shop read's test - `packages/shopify/backend/test/catalog/createShopifyCatalog.test.ts`, in the application repository
- the rail's stories - `packages/ui/src/blocks/store-product/store-product-related-rail.stories.tsx`, in this store
- the tile's stories - `packages/ui/src/blocks/store-product-listing/product-card.stories.tsx`, in this store
- the walk - `apps/frontend/grade10/e2e/tests/store/cross-sell.spec.ts`, in the application repository, one test per case it names, on the isolated stack's fixture catalogue; a row that names it is proved by the walk's run, which `rounds.md` records

The person's part is walked on the run sheet, on the staging shop and the
staging storefront, where its picks and its clock are in play.

| Manual | Why |
| --- | --- |
| `grade10-site-store-cross-sell-US1-TC1-1` | the rule's test proves the picks lead in the stock keeper's order and the cards like it fill after them; the walk names it, on three tiles; a person counts six on the staging storefront |
| `grade10-site-store-cross-sell-US1-TC2-1` | the rule's test proves the cut to six; a person walks a card with six or more like it on the staging storefront |
| `grade10-site-store-cross-sell-US1-TC3-1` | the page's test proves a tile's activation opens its card's page; the walk names it; a person opens a tile on the staging storefront |
| `grade10-site-store-cross-sell-US1-TC4-1` | the rail's stories and the page's test prove no tile carries a cart control; the walk names it; a person reads the tiles on the staging storefront |
| `grade10-site-store-cross-sell-US1-TC5-1` | the served document's test proves the rail is in the page's response with each tile a link to its card, and the page's test that it sits under the buy box; the walk names it, with the scripts held, each tile's link read and the page not moving; a person opens the page with scripting off on the staging storefront, hovers a tile and opens it |
| `grade10-site-store-cross-sell-US1-TC6-1` | the page's test and the tile's stories prove a sold-out pick's place, its words and its activation; a person sells a pick out on the staging shop and reads its tile on the staging storefront |
| `grade10-site-store-cross-sell-US1-TC7-1` | the rule's test proves the card is never under itself; the walk names it, on its fixture; a person chooses a card as its own pick on the staging shop, and where the dashboard refuses the card itself, the walk alone proves it |
| `grade10-site-store-cross-sell-US1-TC8-1` | the page's test proves no rail, no heading and no space; the walk names it, nothing following the card's last line; a person reads the space on the staging storefront |
| `grade10-site-store-cross-sell-US1-TC10-1` | the page's test proves a sold-out card shows its own rail; a person reads one on the staging storefront |
| `grade10-site-store-cross-sell-US1-TC12-1` | the page's test proves one card is enough; the walk names it, on the apron's one pick; nothing remains for a person beyond the walk |
| `grade10-site-store-cross-sell-US1-TC13-1` | the rule's test proves a pick is not repeated among the similar cards; the walk names it; nothing remains for a person beyond the walk |
| `grade10-site-store-cross-sell-US1-TC14-1` | the rule's test proves a card the store's copy does not hold yet shows its picks alone; a person publishes a card with picks on the staging shop and reads it on the staging storefront within the catalogue's window |
| `grade10-site-store-cross-sell-US1-TC15-1` | the page's test proves a card whose rail cannot be composed answers whole, with no rail; neither the walk nor a person on staging can make an isolate hold no copy on demand, so the page's test decides it |
| `grade10-site-store-cross-sell-US2-TC1-1` | the rule's test proves a card with no picks shows the cards like it; the walk names it, on one tile; a person reads four cards sharing a world, newest first, on the staging storefront |
| `grade10-site-store-cross-sell-US2-TC2-1` | the rule's test proves a shared world weighs before a shared language, and a language before a type; a person reads the order on the staging shop's cards |
| `grade10-site-store-cross-sell-US2-TC3-1` | the rule's test proves newest first among cards sharing the same fact; a person reads two such cards on the staging storefront |
| `grade10-site-store-cross-sell-US2-TC4-1` | the rule's test proves the similar cards stop at six; a person counts the tiles under a card with seven or more like it |
| `grade10-site-store-cross-sell-US2-TC5-1` | the rule's test proves a card nobody can buy is never a similar card; a person sells a similar card out on the staging shop and reads the rail |
| `grade10-site-store-cross-sell-US2-TC6-1` | the rule's test proves a card with no world falls to its language and type, and a card with no facts draws none; a person reads a card the staging shop names no world for |
| `grade10-site-store-cross-sell-US2-TC7-1` | the rule's test proves a card the copy gains joins; the walk names it, and proves only a deleted card leaving and a card reported again returning, not `grade10-site-store-cross-sell-SC-23` or `grade10-site-store-cross-sell-SC-24`; a person publishes a card on the staging shop and waits its window |
| `grade10-site-store-cross-sell-US2-TC8-1` | the rule's test proves a fact shared twice counts once; a person reads two cards sharing two worlds on the staging storefront |
| `grade10-site-store-cross-sell-US2-TC9-1` | the rule's test proves closer comes before newer; a person reads an older card sharing two facts beside a newer one sharing one |
| `grade10-site-store-cross-sell-US2-TC10-1` | the rule's test proves a similar card that sells out leaves; a person sells a similar card out on the staging shop and reloads the card's page on the staging storefront |
| `grade10-site-store-cross-sell-US2-TC11-1` | the rule's test proves unreadable picks leave the similar cards and the page whole; no hand walk reaches unreadable picks on staging; it waits on an automated test |
| `grade10-site-store-cross-sell-US3-TC1-1` | the rule's test proves the stock keeper's order is the rail's; the walk skips it, the dashboard being out of its lane; the stock keeper's steps are walked by hand on the staging shop and the page read on the staging storefront within its minute |
| `grade10-site-store-cross-sell-US3-TC2-1` | the rule's test proves the stock keeper's order is the rail's; the reorder in the dashboard is walked by hand and the page read within its minute |
| `grade10-site-store-cross-sell-US3-TC3-1` | the rule's test proves clearing every pick leaves the similar cards; the clearing in the dashboard is walked by hand |
| `grade10-site-store-cross-sell-US3-TC4-1` | the rule's test proves a pick the catalogue no longer holds is left out; the card's removal from the staging shop is walked by hand |
| `grade10-site-store-cross-sell-US3-TC5-1` | the shop read's test proves a changed pick is read with the card; the pick added in the dashboard is walked by hand and the page read within its minute |
