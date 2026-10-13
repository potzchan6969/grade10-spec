# shared/ui/store-cart Test Cases

**Status:** pending-review · 0/11
**Drafts styled:** 2026-10-06, tcs-rules r4

## shared-ui-store-cart-US13: Shopper reads a site sale on the cart lines

**As a** shopper,
**I want** an automatic site sale to show as the lower price with the list
price struck through on each line, without a second Store sale line in the
summary,
**so that** I can trust the Subtotal as the sum of the lines I can still buy,
at the prices I see on them.

<!-- trace:case id=g10.shared-store-cart.TC-no2 rev=1 covers=g10.shared-store-cart.SC-ycc,g10.shared-store-cart.SC-ahq -->
### shared-ui-store-cart-US13-TC1-1: A line on the site sale strikes its list price

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-13

**Pre-conditions:**

* None.

**Test data:**

| Field | Value |
| --- | --- |
| `<sale price>` | The line's price the story supplies, the price after the site sale |
| `<list price>` | The line's list price the story supplies, above `<sale price>` |

**Steps:**

1. Open the Store Cart / CartItem / Sale Price story at <grade10 ui workbench url>.
2. Read the line's prices.

**Expected Results:**

* Step 2: the line shows `<sale price>` as its price.
* Step 2: `<list price>` shows beside it, struck through.
* Step 2: the line shows no third price.

<!-- trace:case id=g10.shared-store-cart.TC-ny1 rev=1 covers=g10.shared-store-cart.SC-ycc,g10.shared-store-cart.SC-ahq -->
### shared-ui-store-cart-US13-TC2-1: Sale lines sum to the Subtotal with no sale row

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-13

**Pre-conditions:**

* The story holds two `<sale line>`s, one of them holding two, a `<full price line>`, a `<sold-out line>` and an `<unavailable line>`.
* No promo code is applied.

**Test data:**

| Field | Value |
| --- | --- |
| `<sale line>` | Each line the site sale cuts: price `<sale price>`, the price of one, list price `<list price>` above it |
| `<full price line>` | A line the site sale does not cut: price `<full price>`, no list price supplied |
| `<sold-out line>` | A line the shop no longer sells, marked sold out |
| `<unavailable line>` | A line whose product the shop has delisted |
| `<subtotal>` | Each line's price times its quantity, added up over every line but a sold-out or unavailable one |

**Steps:**

1. Open the Store Cart / CartDrawer / Auto Discount / On Sale story at <grade10 ui workbench url>.
2. Read each `<sale line>`'s prices.
3. Read `<full price line>`'s prices.
4. Read `<sold-out line>`.
5. Look for `<unavailable line>` among the lines.
6. Read the summary rows in the footer.

**Expected Results:**

* Step 2: each line shows `<sale price>`, with `<list price>` struck through.
* Step 2: the line holding two shows quantity 2 and `<sale price>`, not twice it.
* Step 3: `<full price>` alone, nothing struck through.
* Step 4: the line is marked sold out.
* Step 5: `<unavailable line>` is not listed.
* Step 6: the Subtotal reads `<subtotal>`.
* Step 6: no row names the site sale, and no discount row shows.

<!-- trace:case id=g10.shared-store-cart.TC-wrx rev=1 covers=g10.shared-store-cart.SC-ycc,g10.shared-store-cart.SC-ahq -->
### shared-ui-store-cart-US13-TC3-1: A list price equal to the price is still struck through

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-13

**Pre-conditions:**

* None.

**Test data:**

| Field | Value |
| --- | --- |
| `<price>` | The line's price the story supplies |
| `<list price>` | The line's list price the story supplies, equal to `<price>` |

**Steps:**

1. Open the Store Cart / CartItem / Equal List Price story at <grade10 ui workbench url>.
2. Read the line's prices.

**Expected Results:**

* Step 2: the line shows `<price>` as its price.
* Step 2: `<list price>` shows beside it, struck through.

---

## shared-ui-store-cart-US14: Shopper stacks a promo on the site sale

**As a** shopper,
**I want** a promo that stacks to leave the sale prices on the lines and add
only its own Discount in the footer,
**so that** I can see both cuts without the summary inventing a Store sale
row.

<!-- trace:case id=g10.shared-store-cart.TC-96l rev=1 covers=g10.shared-store-cart.SC-zxr -->
### shared-ui-store-cart-US14-TC1-1: A stacked code keeps the sale lines and adds one discount

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-14

**Pre-conditions:**

* No promo code is applied.

**Test data:**

| Field | Value |
| --- | --- |
| `<sale line>` | Each line the story puts on the site sale: price `<sale price>`, list price `<list price>` above it |
| `<stacking code>` | The held code the story lets stack on the site sale |
| `<code discount>` | The amount the story supplies for `<stacking code>` |
| `<subtotal>` | Each line's price times its quantity, added up over every line but a sold-out or unavailable one |

**Steps:**

1. Open the Store Cart / CartDrawer / Auto Discount / Stack story at <grade10 ui workbench url>.
2. Open the promo sheet.
3. Click Apply on `<stacking code>`'s ticket.
4. Read each `<sale line>`'s prices.
5. Read the summary rows in the footer.

**Expected Results:**

* Step 4: each line shows `<sale price>`, with `<list price>` struck through.
* Step 5: the Subtotal reads `<subtotal>`.
* Step 5: one discount row, for `<stacking code>`, reading `<code discount>`.
* Step 5: no row names the site sale.

---

## shared-ui-store-cart-US15: Shopper is refused a promo against the site sale

**As a** shopper,
**I want** a code that cannot combine with the site sale to leave my sale
prices alone and tell me why, including on a held ticket I cannot Apply,
**so that** I am not left wondering whether the sale or the code won.

<!-- trace:case id=g10.shared-store-cart.TC-dpj rev=1 covers=g10.shared-store-cart.SC-8bx,g10.shared-store-cart.SC-9ie,g10.shared-store-cart.SC-gas,g10.shared-store-cart.SC-tp9 -->
### shared-ui-store-cart-US15-TC1-1: A refused code leaves the sale lines and says why

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-15

**Pre-conditions:**

* No promo code is applied.

**Test data:**

| Field | Value |
| --- | --- |
| `<sale line>` | Each line the story puts on the site sale: price `<sale price>`, list price `<list price>` above it |
| `<refused code>` | The code the story refuses on the site sale |
| `<refusal reason>` | The sentence the story supplies for refusing the typed `<refused code>`, unlike any held ticket's reason: `This promo code cannot stack on the site sale` |
| `<subtotal>` | Each line's price times its quantity, added up over every line but a sold-out or unavailable one |
| `<total before>` | The footer's total before the attempt |

**Steps:**

1. Open the Store Cart / CartDrawer / Auto Discount / Refuse story at <grade10 ui workbench url>.
2. Read the footer's total.
3. Open the promo sheet.
4. Type `<refused code>` in the promo field.
5. Press Enter.
6. Read each `<sale line>`'s prices.
7. Read the summary rows in the footer.

**Expected Results:**

* Step 5: the promo field shows `<refusal reason>` as its error.
* Step 6: each line shows `<sale price>`, with `<list price>` struck through.
* Step 7: the Subtotal reads `<subtotal>`.
* Step 7: the footer's total still reads `<total before>`.
* Step 7: no discount row, and no row names the site sale.

<!-- trace:case id=g10.shared-store-cart.TC-hw6 rev=1 covers=g10.shared-store-cart.SC-8bx,g10.shared-store-cart.SC-9ie,g10.shared-store-cart.SC-gas,g10.shared-store-cart.SC-tp9 -->
### shared-ui-store-cart-US15-TC2-1: A held code that cannot apply has no Apply

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-15

**Pre-conditions:**

* The Actions panel is empty.

**Test data:**

| Field | Value |
| --- | --- |
| `<inapplicable reason>` | The reason the story supplies for the code not applying |

**Steps:**

1. Open the Store Cart / PromoTicket / Not Applicable story at <grade10 ui workbench url>.
2. Read the ticket.
3. Press Tab from the canvas until focus leaves the ticket.
4. Click the ticket.
5. Open the Actions panel.

**Expected Results:**

* Step 2: the ticket is muted and shows `<inapplicable reason>`.
* Step 2: the ticket shows no Apply control.
* Step 3: no Apply control on the ticket takes focus.
* Step 5: no apply action is logged.

<!-- trace:case id=g10.shared-store-cart.TC-oyz rev=1 covers=g10.shared-store-cart.SC-8bx,g10.shared-store-cart.SC-9ie,g10.shared-store-cart.SC-gas,g10.shared-store-cart.SC-tp9 -->
### shared-ui-store-cart-US15-TC3-1: Held codes that cannot apply sit apart from ones that can

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
* **Trace:** shared-ui-store-cart-US-15

**Pre-conditions:**

* The story holds `<applicable code>` and `<inapplicable code>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<applicable code>` | A held code that can apply on this cart |
| `<inapplicable code>` | A held code that cannot apply on this cart, with `<inapplicable reason>` |

**Steps:**

1. Open the Store Cart / CartDrawer / Auto Discount / Refuse story at <grade10 ui workbench url>.
2. Open the promo sheet.
3. Read the held tickets.

**Expected Results:**

* Step 3: `<applicable code>` shows with its Apply control.
* Step 3: `<inapplicable code>` is listed apart from it, muted.
* Step 3: `<inapplicable code>` shows `<inapplicable reason>` and no Apply control.

<!-- trace:case id=g10.shared-store-cart.TC-cep rev=1 covers=g10.shared-store-cart.SC-8bx,g10.shared-store-cart.SC-9ie,g10.shared-store-cart.SC-gas,g10.shared-store-cart.SC-tp9 -->
### shared-ui-store-cart-US15-TC4-1: A picked held code the quote refuses leaves the sale lines and moves apart

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-ui-store-cart-US-15

**Pre-conditions:**

* No promo code is applied.
* The story holds `<picked code>` among the held codes that can apply.
* The story's quote refuses `<picked code>` against the site sale with `<refusal reason>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<sale line>` | Each line the story puts on the site sale: price `<sale price>`, list price `<list price>` above it |
| `<picked code>` | A held code listed with its Apply control, which the site sale refuses |
| `<refusal reason>` | The sentence the story's quote supplies for refusing `<picked code>`, unlike the reason any held ticket shows before the attempt: `This promo code cannot stack on the site sale` |
| `<subtotal>` | Each line's price times its quantity, added up over every line but a sold-out or unavailable one |
| `<total before>` | The footer's total before the attempt |

**Steps:**

1. Open the Store Cart / CartDrawer / Auto Discount / Refuse story at <grade10 ui workbench url>.
2. Read the footer's total.
3. Open the promo sheet.
4. Click Apply on `<picked code>`'s ticket.
5. Read each `<sale line>`'s prices.
6. Read the summary rows in the footer.

**Expected Results:**

* Step 4: the promo sheet shows `<refusal reason>`.
* Step 4: `<picked code>` is listed apart from the held codes that can apply, muted, with `<refusal reason>` and no Apply control.
* Step 5: each line shows `<sale price>`, with `<list price>` struck through.
* Step 6: the Subtotal reads `<subtotal>`.
* Step 6: the footer's total still reads `<total before>`.
* Step 6: no discount row, and no row names the site sale.

---

## shared-ui-store-cart-US16: Shopper's promo replaces the site sale

**As a** shopper,
**I want** a replacing promo to put the list price back on each line it takes
the sale from and show only that code's Discount in the footer,
**so that** I know the site sale is no longer on those lines.

<!-- trace:case id=g10.shared-store-cart.TC-fd7 rev=1 covers=g10.shared-store-cart.SC-6r0 -->
### shared-ui-store-cart-US16-TC1-1: A replacing code puts each line it takes at list price and leaves the rest on sale

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-16

**Pre-conditions:**

* One replacing code is applied.
* The story's quote takes the site sale from `<replaced line>` and leaves it on `<kept sale line>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<replaced line>` | A line the code took the site sale from: price `<list price A>`, no list price supplied |
| `<kept sale line>` | A line the code left on the site sale: price `<sale price B>`, list price `<list price B>` above it |
| `<code discount>` | The amount the story supplies for the replacing code |
| `<subtotal>` | Each line's price times its quantity, added up over every line but a sold-out or unavailable one |

**Steps:**

1. Open the Store Cart / CartDrawer / Auto Discount / Replace story at <grade10 ui workbench url>.
2. Read `<replaced line>`'s prices.
3. Read `<kept sale line>`'s prices.
4. Read the summary rows in the footer.

**Expected Results:**

* Step 2: `<list price A>` alone, nothing struck through.
* Step 3: `<sale price B>`, with `<list price B>` struck through.
* Step 4: the Subtotal reads `<subtotal>`.
* Step 4: one discount row, for the code, reading `<code discount>`.
* Step 4: no row names the site sale.

---

## shared-ui-store-cart-US17: Shopper removes a promo and keeps the site sale

**As a** shopper,
**I want** removing the promo to drop its discount and, where it had replaced
the site sale, put the sale back on the lines while the sale still runs,
**so that** I am not left at full list price after clearing a code.

<!-- trace:case id=g10.shared-store-cart.TC-3df rev=1 covers=g10.shared-store-cart.SC-07s -->
### shared-ui-store-cart-US17-TC1-1: Removing a replacing code puts the sale back on the lines

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-17

**Pre-conditions:**

* A replacing code is applied.
* The site sale still runs.

**Test data:**

| Field | Value |
| --- | --- |
| `<replaced line>` | Each line the code took the site sale from: list price `<list price>`, sale price `<sale price>` below it |
| `<subtotal after>` | Each line's price times its quantity, added up over every line but a sold-out or unavailable one, after the removal |

**Steps:**

1. Open the Store Cart / CartDrawer / Auto Discount / Fallback after remove story at <grade10 ui workbench url>.
2. Read each `<replaced line>`'s prices.
3. Click Remove on the code's discount row.
4. Read each `<replaced line>`'s prices.
5. Read the summary rows in the footer.

**Expected Results:**

* Step 2: each line shows `<list price>` alone, nothing struck through.
* Step 4: each line shows `<sale price>`, with `<list price>` struck through.
* Step 5: the code's discount row is gone.
* Step 5: the Subtotal reads `<subtotal after>`.
* Step 5: no row names the site sale.

<!-- trace:case id=g10.shared-store-cart.TC-rft rev=1 covers=g10.shared-store-cart.SC-07s -->
### shared-ui-store-cart-US17-TC2-1: Removing a stacked code leaves the sale lines unchanged

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-17

**Pre-conditions:**

* No promo code is applied.

**Test data:**

| Field | Value |
| --- | --- |
| `<sale line>` | Each line on the site sale: price `<sale price>`, list price `<list price>` above it |
| `<stacking code>` | The held code the story lets stack on the site sale |
| `<subtotal>` | Each line's price times its quantity, added up over every line but a sold-out or unavailable one |

**Steps:**

1. Open the Store Cart / CartDrawer / Auto Discount / Stack story at <grade10 ui workbench url>.
2. Open the promo sheet.
3. Click Apply on `<stacking code>`'s ticket.
4. Read the Subtotal.
5. Click Remove on the code's discount row.
6. Read each `<sale line>`'s prices.
7. Read the summary rows in the footer.

**Expected Results:**

* Step 4: the Subtotal reads `<subtotal>`.
* Step 6: each line still shows `<sale price>`, with `<list price>` struck through.
* Step 7: the code's discount row is gone.
* Step 7: the Subtotal still reads `<subtotal>`.
* Step 7: no row names the site sale.

## Reconciliation

**Run:** QA1 blind pass, 2026-10-06. Read the delta and durable `## Purpose` and `## Feature set`, `user-journeys.md`, `proposal.md`, `decisions.md` with its `## Raised`, `ui-design.md` with its scenario column set aside, the Cart Drawer, Discounts and Grade10 Cart Drawer PRD pages, `openspec/config.yaml`'s `context`, this suite with its `## Reconciliation` and trace markers set aside, and its `## Settled`; no domain suite sits above `shared/ui`. Denied every `## Requirements` section, `tech-design.md`, `tasks.md` and `openspec/changes/archive/`.

**Run:** QA2 for `present-cart-site-sale-promo-outcomes`, 2026-10-06, in a fresh context, after the QA1 rerun and Dev's scenarios on the Replaced and Held, cannot apply anchors. Read: the blind cases above, `spec.md` (`## Feature set` and the requirements), `user-journeys.md`, `proposal.md`, `decisions.md`, `ui-design.md`, `tasks.md`, the Cart Drawer pages under `docs/prds/products/shared/ui/` and `docs/prds/products/grade10-site/store/`, and the block, stories and fixtures under `packages/ui/src/blocks/store-cart/`. Anchors: `shared-ui-store-cart-US-13` to `US-17` and the root group Site sale and promo outcomes.

**Run:** QA2 rerun, 2026-10-06, in a fresh context, after the scenarios named the line off the sale in each outcome. Read the same sources, the change below it, `cart-drawer-empty-state`, and Grade10's cart in the application repository. Anchors unchanged.

**Run:** QA1 blind pass, 2026-10-07, in a fresh context, after the Subtotal anchor named unavailable lines. Read `## Purpose` and `## Feature set` of the durable and delta `spec.md`, the delta `user-journeys.md`, `proposal.md`, `decisions.md` with its `## Raised`, `ui-design.md` with its States scenario column stripped, the Cart Drawer, Grade10 Cart Drawer and Discounts pages, `openspec/config.yaml`'s `context`, this suite with `## Reconciliation` and trace-marker `covers` stripped, and its `## Settled`; no `domain-tcs.md` sits above `shared/ui`. Denied every `## Requirements` section, `tech-design.md`, `tasks.md`, QA2 material and `openspec/changes/archive/`.

**Run:** QA2, 2026-10-07, in a fresh context, after that QA1 pass. Read the cases above, `spec.md`, `user-journeys.md`, `proposal.md`, `decisions.md`, `ui-design.md`, `tasks.md`, the Cart Drawer pages under `docs/prds/products/shared/ui/` and `docs/prds/products/grade10-site/store/`, `cart-drawer-empty-state`, and Grade10's cart in the application repository. Anchors: `shared-ui-store-cart-US-13` to `US-17` and the root group Site sale and promo outcomes, its Subtotal naming unavailable lines.

**Run:** QA2 rerun, 2026-10-07, in a fresh context, on `cart-drawer-empty-state` as settled. Read the cases above, `spec.md`, `user-journeys.md`, `proposal.md`, `decisions.md`, `ui-design.md`, `tasks.md`, the Cart Drawer page, the block, stories and fixtures under `packages/ui/src/blocks/store-cart/`, the active changes on this capability, and Grade10's cart in the application repository. Anchors unchanged.

| Reading | Anchor | Disposition |
| --- | --- | --- |
| `shared-ui-store-cart-US13-TC1-1` | US-13 | Covered by `shared-ui-store-cart-SC-26`: the sale price beside the struck list price, on the CartItem Sale Price story |
| `shared-ui-store-cart-US13-TC2-1` | US-13 | Covered by `shared-ui-store-cart-SC-26`. Case repaired: the On Sale cart holds a sale line holding two, as the scenario and task 1.1 do, and the Subtotal is each line's price times its quantity, `decisions.md` Q7 |
| `shared-ui-store-cart-US13-TC3-1` | US-13 | Covered by `shared-ui-store-cart-SC-52`, on the CartItem Equal List Price story |
| `shared-ui-store-cart-US14-TC1-1` | US-14 | Covered by `shared-ui-store-cart-SC-27`. Case repaired: the Subtotal is each line's price times its quantity, Q7 |
| `shared-ui-store-cart-US15-TC1-1` | US-15 | Covered by `shared-ui-store-cart-SC-28`, the typed code. Case repaired: the Subtotal, as Q7 |
| `shared-ui-store-cart-US15-TC2-1` | US-15 | Covered by `shared-ui-store-cart-SC-29` |
| `shared-ui-store-cart-US15-TC3-1` | US-15 | Covered by `shared-ui-store-cart-SC-53` |
| `shared-ui-store-cart-US15-TC4-1` | US-15 | Folded: a held code picked from the ones that can apply and refused by the quote leaves the lines and the totals on the sale, and the sheet says why. `shared-ui-store-cart-SC-28` now names a code typed or picked, and task 1.1 has the Refuse story refuse a picked held code with the same sentence. Case repaired: the picked ticket moved apart, muted, with the refusal as its reason and no Apply, as `shared-ui-store-cart-SC-54` and `decisions.md` Q8 settle it; the Subtotal, as Q7; and the refusal sentence the story supplies |
| `shared-ui-store-cart-US16-TC1-1` | US-16 | Covered by `shared-ui-store-cart-SC-30`. Case repaired: it now reads the line the code left on the sale beside the line it took, folded from `US16-TC2-1` |
| `shared-ui-store-cart-US16-TC2-1` | US-16 | Folded into `US16-TC1-1` and dropped: both read the Replace story's lines and footer, and `SC-30` is one scenario naming both lines |
| `shared-ui-store-cart-US17-TC1-1` | US-17 | Covered by `shared-ui-store-cart-SC-31`, the replacing branch. Case repaired: the Subtotal, as Q7 |
| `shared-ui-store-cart-US17-TC2-1` | US-17 | Covered by `shared-ui-store-cart-SC-31`, the stacked branch. Case repaired: the Subtotal, as Q7 |
| `shared-ui-store-cart-US17-TC3-1`, earlier run | US-17 | Rejected and dropped: whether the sale still runs is the quote's, and the drawer renders the lines it is given |
| Feature set, Subtotal | US-13 | Anchor repaired to the Cart Drawer page's words: "as shown" read as the sum of the prices shown, and every blind Subtotal row summed unit prices against Q7. No reading's outcome moves: Dev's scenarios already said price times quantity, and the cases are repaired above |
| `shared-ui-store-cart-SC-26` to `SC-31`, `SC-52` to `SC-54` | US-13 to US-17 | Every scenario is reached by a case above |
| R1, struck price on a line both repriced and on sale | US-13 | Settled as Q6: not this change's; open on the Grade10 Cart Drawer page for the Grade10 product owner |
| R2, a code that replaces the sale on some lines only | US-16, US-17 | Settled as Q3: line by line, from the quote |
| R3, a sold-out line in the Subtotal | US-13 | Settled as Q4: left out |
| R4, a list price equal to the price | US-13 | Settled as Q5: struck through |
| R5, the ticket of a picked code the quote refuses | US-15 | Settled as Q8: apart, muted, with the refusal as its reason and no Apply, the consumer supplying it as not applicable. Covered by `shared-ui-store-cart-SC-54`, read by `US15-TC4-1` |
| R6, a line holding more than one in the Subtotal | US-13 | Settled as Q7: price times quantity |
| R7, the struck price read aloud | US-13 | Settled as Q9: not this change's; one follow-on change labels every struck price. No case asserts it and no scenario is written |
| `shared-ui-store-cart-SC-27`, `SC-28`, `SC-31`, the line off the sale | US-14, US-15, US-17 | Covered: `US13-TC2-1` reads the line off the sale at its price alone on On Sale, and task 1.1 asserts nothing struck on it on every Auto Discount story. The outcome cases read the sale lines only; the drawer prices each line from what it is given |
| `shared-ui-store-cart-SC-52`, `SC-53` | US-13, US-15 | Renumbered from `SC-47` and `SC-46`, above `SC-51`, the highest id `cart-drawer-empty-state` issues for this capability. Trace ids unchanged |
| `shared-ui-store-cart-SC-54` | US-15 | Added for Q8, above `SC-53`, the highest id issued for this capability |
| Requirement A site sale reaches the drawer only on its lines, the Subtotal | US-13 | Repaired: the Subtotal sums every visible item but a sold-out one, as `cart-drawer-empty-state` defines a visible item, so an unavailable line the consumer has not yet removed is left out. Grade10 already leaves both out: `reviewedSubtotalMinor`, `packages/grade10-store/frontend/src/features/orders/cart/domain/models/Cart.ts:165` in the application repository. |
| Feature set, Subtotal, second repair | US-13 | Anchor repaired to the Cart Drawer page's words, which now match the requirement: the Subtotal leaves out sold-out and unavailable lines, as the drawer title's count does. No reading's outcome moves: every case's Subtotal leaves out the sold-out line |
| `shared-ui-store-cart-US15-TC1-1`, `US15-TC4-1`, the refusal sentence | US-15 | Test data reworded to `This promo code cannot stack on the site sale`, the reader's word the page uses, as task 1.1 now supplies it. It still differs from the held ticket's reason |
| `shared-ui-store-cart-US13-TC2-1`, the unavailable line | US-13 | Covered by `shared-ui-store-cart-SC-26`. Case repaired: the On Sale story now holds an `unavailable` line, as the scenario and task 1.1 do, so the case reads it gone from the lines and left out of the Subtotal. |
| Every case's `<subtotal>` | US-13 to US-17 | Reworded to leave out sold-out and unavailable lines, as the Subtotal anchor does. Only On Sale holds an unavailable line, so no other case's value moves |
| `shared-ui-store-cart-US13-TC2-1`, the line holding two | US-13 | Covered by `shared-ui-store-cart-SC-26`: the line shows quantity 2 and the price of one, as Q7 settles |
| Feature set, Refused | US-15 | No anchor change: Refused names the refusal and Held, cannot apply names the muted ticket listed apart, so the picked ticket that moves apart is the two together, as the page's Refused line, Q8 and `shared-ui-store-cart-SC-54` say. Read by `US15-TC4-1` |
| Every case's trace marker | US-13 to US-17 | Unchanged: each `covers` names the scenarios serving its Trace journey, in source order. `SC-26` to `SC-31` were issued with this change and collide with no id another active change or the durable spec holds; `SC-52` to `SC-54` sit above `SC-51`. No new id |
| Every case's steps | US-13 to US-17 | Checked against the stories: Enter submits the promo field, Apply sits inside a held ticket, and Remove sits on the code's discount row. The On Sale and Equal List Price stories, and the Refuse story's held code that can apply, are task 1.1's |
| Q4, Q7, the Subtotal row's citations | US-13 | Checked against the application repository: `Cart.ts:162` and `:165`, `useCartReview.ts:138` and `cartItem.ts:15-16` hold what they cite |

- **Uncovered anchors** - none: every journey US-13 to US-17 is traced by a case, and each outcome under the root group by a scenario
- **Handed to redraw-store-cart-frames** - Q8 and Q9, for the designer to confirm; neither blocks a case

## Settled

- **A code replacing the sale on some lines** - line by line, as the quote supplies each line
- **Sold-out and unavailable lines in the Subtotal** - left out, as the drawer title's count leaves them out
- **A line holding more than one** - the Subtotal counts its price times its quantity; the line shows the price of one
- **A list price equal to the price** - the drawer strikes any list price it is given and compares no amounts
- **A held code picked and then refused** - the lines and the totals stay on the sale and the sheet says why, as for a typed code; its ticket moves apart, muted, with the refusal as its reason and no Apply
- **Removing a replacing code after the sale ended** - the drawer renders the lines it is given; whether the sale still runs is the quote's
- **A line both repriced and on sale** - not the drawer's: it strikes the list price it is given; which price Grade10 supplies is open on the Grade10 Cart Drawer page
