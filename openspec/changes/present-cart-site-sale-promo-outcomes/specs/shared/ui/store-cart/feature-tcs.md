# shared/ui/store-cart Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## shared-ui-store-cart-US13: Shopper reads a site sale on the cart lines

**As a** shopper,
**I want** an automatic site sale to show as the lower price with the list
price struck through on each line, without a second Store sale line in the
summary,
**so that** I can trust the Subtotal as the sum of the lines I can still buy,
at the prices I see on them.

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

* Storybook renders `Store Cart/CartItem` → Sale Price.

**Test data:**

| Field | Value |
| --- | --- |
| `<sale price>` | The line's price the story supplies, the price after the site sale |
| `<list price>` | The line's list price the story supplies, above `<sale price>` |

**Steps:**

1. Read the line's prices.

**Expected Results:**

* The line shows `<sale price>` as its price.
* `<list price>` shows beside it, struck through.
* The line shows no third price.

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

* Storybook renders `Store Cart/CartDrawer/Auto Discount` → On Sale, with `<sale line>`, `<full price line>` and `<sold-out line>`, quantity 1 each.
* No promo code is applied.

**Test data:**

| Field | Value |
| --- | --- |
| `<sale line>` | A line the site sale cuts: price `<sale price>`, list price `<list price>` above it |
| `<full price line>` | A line the site sale does not cut: price `<full price>`, no list price supplied |
| `<sold-out line>` | A line the shop no longer sells, marked sold out, price `<sold-out price>` |
| `<subtotal>` | `<sale price>` plus `<full price>`, without `<sold-out price>` |

**Steps:**

1. Read `<sale line>`'s prices.
2. Read `<full price line>`'s prices.
3. Read `<sold-out line>`.
4. Read the summary rows in the footer.

**Expected Results:**

* Step 1: `<sale price>`, with `<list price>` struck through.
* Step 2: `<full price>` alone, nothing struck through.
* Step 3: the line is marked sold out.
* Step 4: the Subtotal reads `<subtotal>`.
* Step 4: no row names the site sale, and no discount row shows.

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

* Storybook renders `Store Cart/CartItem` → Equal List Price.

**Test data:**

| Field | Value |
| --- | --- |
| `<price>` | The line's price the story supplies |
| `<list price>` | The line's list price the story supplies, equal to `<price>` |

**Steps:**

1. Read the line's prices.

**Expected Results:**

* The line shows `<price>` as its price.
* `<list price>` shows beside it, struck through.

---

## shared-ui-store-cart-US14: Shopper stacks a promo on the site sale

**As a** shopper,
**I want** a promo that stacks to leave the sale prices on the lines and add
only its own Discount in the footer,
**so that** I can see both cuts without the summary inventing a Store sale
row.

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

* Storybook renders `Store Cart/CartDrawer/Auto Discount` → Stack.

**Test data:**

| Field | Value |
| --- | --- |
| `<sale line>` | Each line the story puts on the site sale: price `<sale price>`, list price `<list price>` above it |
| `<stacking code>` | The held code the story lets stack on the site sale |
| `<code discount>` | The amount the story supplies for `<stacking code>` |
| `<subtotal>` | The sum of every line's shown price |

**Steps:**

1. Open the promo sheet.
2. Click Apply on `<stacking code>`'s ticket.
3. Read each `<sale line>`'s prices.
4. Read the summary rows in the footer.

**Expected Results:**

* Step 3: each line shows `<sale price>`, with `<list price>` struck through.
* Step 4: the Subtotal reads `<subtotal>`.
* Step 4: one discount row, for `<stacking code>`, reading `<code discount>`.
* Step 4: no row names the site sale.

---

## shared-ui-store-cart-US15: Shopper is refused a promo against the site sale

**As a** shopper,
**I want** a code that cannot combine with the site sale to leave my sale
prices alone and tell me why, including on a held ticket I cannot Apply,
**so that** I am not left wondering whether the sale or the code won.

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

* Storybook renders `Store Cart/CartDrawer/Auto Discount` → Refuse.

**Test data:**

| Field | Value |
| --- | --- |
| `<sale line>` | Each line the story puts on the site sale: price `<sale price>`, list price `<list price>` above it |
| `<refused code>` | The code the story refuses on the site sale |
| `<refusal reason>` | The sentence the story supplies for refusing the typed `<refused code>`, unlike any held ticket's reason: `This promo code cannot stack on the store sale` |
| `<subtotal>` | The sum of every line's shown price |
| `<estimated total>` | The estimated total before the attempt |

**Steps:**

1. Read the Estimated Total.
2. Open the promo sheet.
3. Type `<refused code>` and press Enter.
4. Read each `<sale line>`'s prices.
5. Read the summary rows in the footer.

**Expected Results:**

* Step 3: the promo field shows `<refusal reason>` as its error.
* Step 4: each line shows `<sale price>`, with `<list price>` struck through.
* Step 5: the Subtotal reads `<subtotal>`.
* Step 5: the Estimated Total still reads `<estimated total>`.
* Step 5: no discount row, and no row names the site sale.

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

* Storybook renders `Store Cart/PromoTicket` → Not Applicable.

**Test data:**

| Field | Value |
| --- | --- |
| `<inapplicable reason>` | The reason the story supplies for the code not applying |

**Steps:**

1. Read the ticket.
2. Press Tab from the canvas until focus leaves the ticket.
3. Click the ticket.
4. Open the Actions panel.

**Expected Results:**

* Step 1: the ticket is muted and shows `<inapplicable reason>`.
* Step 1: the ticket shows no Apply control.
* Step 2: no Apply control on the ticket takes focus.
* Step 4: no apply action is logged.

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

* Storybook renders `Store Cart/CartDrawer/Auto Discount` → Refuse, holding `<applicable code>` and `<inapplicable code>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<applicable code>` | A held code that can apply on this cart |
| `<inapplicable code>` | A held code that cannot apply on this cart, with `<inapplicable reason>` |

**Steps:**

1. Open the promo sheet.
2. Read the held tickets.

**Expected Results:**

* `<applicable code>` shows with its Apply control.
* `<inapplicable code>` is listed apart from it, muted.
* `<inapplicable code>` shows `<inapplicable reason>` and no Apply control.

---

## shared-ui-store-cart-US16: Shopper's promo replaces the site sale

**As a** shopper,
**I want** a replacing promo to put list prices back on the lines and show
only that code's Discount in the footer,
**so that** I know the site sale is no longer on those lines.

### shared-ui-store-cart-US16-TC1-1: A replacing code puts the lines at list price

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

* Storybook renders `Store Cart/CartDrawer/Auto Discount` → Replace.

**Test data:**

| Field | Value |
| --- | --- |
| `<replaced line>` | Each line the code took the site sale from: price `<list price>` |
| `<code discount>` | The amount the story supplies for the replacing code |
| `<subtotal>` | The sum of every line's shown price |

**Steps:**

1. Read each `<replaced line>`'s prices.
2. Read the summary rows in the footer.

**Expected Results:**

* Step 1: each line shows `<list price>` alone, nothing struck through.
* Step 2: the Subtotal reads `<subtotal>`.
* Step 2: one discount row, for the code, reading `<code discount>`.
* Step 2: no row names the site sale.

---

## shared-ui-store-cart-US17: Shopper removes a promo and keeps the site sale

**As a** shopper,
**I want** removing the promo to drop its discount and, where it had replaced
the site sale, put the sale back on the lines while the sale still runs,
**so that** I am not left at full list price after clearing a code.

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

* Storybook renders `Store Cart/CartDrawer/Auto Discount` → Fallback after remove.
* A replacing code is applied, and the site sale still runs.

**Test data:**

| Field | Value |
| --- | --- |
| `<replaced line>` | Each line the code took the site sale from: list price `<list price>`, sale price `<sale price>` below it |
| `<subtotal after>` | The sum of every line's shown price after the removal |

**Steps:**

1. Read each `<replaced line>`'s prices.
2. Click Remove on the code's discount row.
3. Read each `<replaced line>`'s prices.
4. Read the summary rows in the footer.

**Expected Results:**

* Step 1: each line shows `<list price>` alone, nothing struck through.
* Step 3: each line shows `<sale price>`, with `<list price>` struck through.
* Step 4: the code's discount row is gone.
* Step 4: the Subtotal reads `<subtotal after>`.
* Step 4: no row names the site sale.

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

* Storybook renders `Store Cart/CartDrawer/Auto Discount` → Stack.

**Test data:**

| Field | Value |
| --- | --- |
| `<sale line>` | Each line on the site sale: price `<sale price>`, list price `<list price>` above it |
| `<stacking code>` | The held code the story lets stack on the site sale |
| `<subtotal>` | The sum of every line's shown price |

**Steps:**

1. Open the promo sheet.
2. Click Apply on `<stacking code>`'s ticket.
3. Read the Subtotal.
4. Click Remove on the code's discount row.
5. Read each `<sale line>`'s prices.
6. Read the summary rows in the footer.

**Expected Results:**

* Step 3: the Subtotal reads `<subtotal>`.
* Step 5: each line still shows `<sale price>`, with `<list price>` struck through.
* Step 6: the code's discount row is gone.
* Step 6: the Subtotal still reads `<subtotal>`.
* Step 6: no row names the site sale.

## Reconciliation

**Run:** QA2 for `present-cart-site-sale-promo-outcomes`, 2026-10-06, in a fresh context. Read: the blind cases above, `spec.md` (`## Feature set` and the requirements), `user-journeys.md`, `proposal.md`, `decisions.md`, `ui-design.md`, `tasks.md`, the Cart Drawer pages under `docs/prds/products/shared/ui/` and `docs/prds/products/grade10-site/store/`, the block, stories and fixtures under `packages/ui/src/blocks/store-cart/`, and Grade10's cart mapper in the application repository. Anchors: `shared-ui-store-cart-US-13` to `US-17` and the root group Site sale and promo outcomes.

| Reading | Anchor | Disposition |
| --- | --- | --- |
| `shared-ui-store-cart-US13-TC1-1` | US-13 | Covered by `shared-ui-store-cart-SC-26`: the sale price over the struck list price, on the CartItem Sale Price story |
| `shared-ui-store-cart-US13-TC2-1` | US-13 | Folded: a line off the sale shows its price alone and still counts in the Subtotal, and a sold-out line does not. `shared-ui-store-cart-SC-26` walks a cart with sale lines, a line off the sale and a sold-out line, on the On Sale story |
| `shared-ui-store-cart-US13-TC3-1` | US-13 | Added by QA2 for `shared-ui-store-cart-SC-47`, which no blind case reached: a list price equal to the price is still struck through, on a new CartItem Equal List Price story that task 1.1 now names |
| `shared-ui-store-cart-US14-TC1-1` | US-14 | Covered by `shared-ui-store-cart-SC-27`. Case repaired: the Stack story opens with no code, so the case applies the held code before reading |
| `shared-ui-store-cart-US15-TC1-1` | US-15 | Covered by `shared-ui-store-cart-SC-28`. Case repaired: the refusal is the typed code's own sentence, read in the promo field's error rather than the held ticket's reason, and the Estimated Total is read before and after |
| `shared-ui-store-cart-US15-TC2-1` | US-15 | Covered by `shared-ui-store-cart-SC-29` |
| `shared-ui-store-cart-US15-TC3-1` | US-15 | Folded as `shared-ui-store-cart-SC-46`: held codes that cannot apply are listed apart from the ones that can. Already decided on the Grade10 Cart Drawer page, Picked, and drawn by the block's two held lists; the shared page's Held, cannot apply line says it. The Refuse story's held list carries two codes that can apply and two that cannot |
| `shared-ui-store-cart-US16-TC1-1` | US-16 | Covered by `shared-ui-store-cart-SC-30` |
| `shared-ui-store-cart-US17-TC1-1` | US-17 | Covered by `shared-ui-store-cart-SC-31`, the replacing branch |
| `shared-ui-store-cart-US17-TC2-1` | US-17 | Covered by `shared-ui-store-cart-SC-31`, the stacked branch. Case repaired: the Stack story opens with no code, so the case applies the held code before reading |
| `shared-ui-store-cart-US17-TC3-1` | US-17 | Rejected and dropped: whether the sale still runs is the quote's, and the drawer only renders the lines it is given; a line with no list price showing its price alone is `shared-ui-store-cart-SC-26` and `SC-30` |
| `shared-ui-store-cart-SC-26` to `SC-31`, `SC-46`, `SC-47` | US-13 to US-17 | Every scenario is reached by a case above; no scenario is uncovered |
| Replaced, a cart with sale lines and replaced lines under one code | US-16 | Rejected as a scenario of its own: the drawer prices each line from its props, so a sale line beside a line at its price alone is `shared-ui-store-cart-SC-26`, and a replaced line is `SC-30`; which lines a code takes is the quote's, `decisions.md` Q3 |
| R1, struck price on a line both repriced and on sale | US-13 | Settled as `decisions.md` Q6: not this change's. Grade10 supplies no site sale on its lines here, and the drawer strikes whatever list price it is given, Q5. The product choice stays open on the Grade10 Cart Drawer page, row Struck price on a line, for the Grade10 product owner and the change that prices the shop's sale in that drawer; no scenario is written |
| R2, a code that replaces the sale on some lines only | US-16, US-17 | Settled as `decisions.md` Q3: line by line, from the quote. The shared page's Replaced line says each line it takes the sale from |
| R3, a sold-out line in the Subtotal | US-13 | Settled as `decisions.md` Q4 from the Grade10 implementation: a sold-out line is left out. The requirement and the shared page's Subtotal line say so |
| R4, a list price equal to the price | US-13 | Settled as `decisions.md` Q5: the drawer strikes any list price it is given and compares no amounts |

- **Uncovered anchors** — none: every journey US-13 to US-17 is traced by a case, and each outcome under the root group by a scenario
- **Cases added after the reconciliation** — `shared-ui-store-cart-US13-TC3-1`, draft

## Settled

- **A code replacing the sale on some lines** — line by line, as the quote supplies each line
- **A sold-out line in the Subtotal** — left out, as the count badge leaves it out
- **A list price equal to the price** — the drawer strikes any list price it is given and compares no amounts
- **Removing a replacing code after the sale ended** — the drawer renders the lines it is given; whether the sale still runs is the quote's
- **A line both repriced and on sale** — not the drawer's: it strikes the list price it is given; which price Grade10 supplies is open on the Grade10 Cart Drawer page
