# shared/ui/store-cart Test Cases

**Status:** pending-review · 0/38
**Drafts styled:** 2026-10-25, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7

**Out of suite (non-GUI):** shared-ui-store-cart-SC-01, shared-ui-store-cart-SC-22, shared-ui-store-cart-SC-43 - the export set, its types and the retired slot exports, held by `packages/ui/src/index.test.ts` and `pnpm run typecheck`

## Background

* `<storybook>` is the shared UI Storybook, served by `pnpm storybook:ui`; the drawer's stories sit under Store/Cart. A story's Controls panel changes the props it passes to the drawer; its Actions panel records each callback the drawer calls.
* A story named in a case opens the drawer on the lines the case's pre-conditions describe.

## shared.ui-store-cart.US2: Shopper reviews what the cart holds

**As a** shopper,
**I want** the drawer to show my items with a count that ignores sold-out
items, an edge fade when there are more, and an empty state when the cart
holds nothing,
**so that** I can see what I am buying, or that there is nothing to buy yet.

<!-- trace:case id=g10.shared-store-cart.TC-nqc rev=2 covers=g10.shared-store-cart.SC-9dd,g10.shared-store-cart.SC-dcr,g10.shared-store-cart.SC-utr,g10.shared-store-cart.SC-e4c,g10.shared-store-cart.SC-j31,g10.shared-store-cart.SC-xfz,g10.shared-store-cart.SC-62u,g10.shared-store-cart.SC-gx1,g10.shared-store-cart.SC-tou -->
### shared.ui-store-cart.US2-TC1: The drawer lists the cart's lines, counted once each

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-02

**Pre-conditions:**

* The CartDrawer Default story opens on two active lines.

**Test data:**

| `<reach>` | `<count>` |
| --- | --- |
| the story as it opens | 2 |
| removing one line | 1 |
| raising the second line to 3 | 2 |

**Steps:**

1. Open the story on `<storybook>`, and reach the cart by `<reach>`.
2. Read the body, the count beside the drawer title and the footer.

**Expected Results:**

* The body lists exactly `<count>` lines and no placeholder row, empty state or edge fade; the count reads `<count>`; the footer shows the price summary and Checkout.

<!-- trace:case id=g10.shared-store-cart.TC-5iw rev=2 covers=g10.shared-store-cart.SC-9dd,g10.shared-store-cart.SC-dcr,g10.shared-store-cart.SC-utr,g10.shared-store-cart.SC-e4c,g10.shared-store-cart.SC-j31,g10.shared-store-cart.SC-xfz,g10.shared-store-cart.SC-62u,g10.shared-store-cart.SC-gx1,g10.shared-store-cart.SC-tou -->
### shared.ui-store-cart.US2-TC2: Overflowing lines scroll with an edge fade

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-02

**Pre-conditions:**

* The CartDrawer Overflow Items story opens on six lines.

**Steps:**

1. Open the story; read the body's edges.
2. Scroll halfway, and read them; scroll to the end, and read them.

**Expected Results:**

* Step 1 fades the bottom edge alone.
* Step 2 fades both edges halfway, then the top alone at the end, every line reached and no placeholder row.

<!-- trace:case id=g10.shared-store-cart.TC-kz7 rev=2 covers=g10.shared-store-cart.SC-9dd,g10.shared-store-cart.SC-dcr,g10.shared-store-cart.SC-utr,g10.shared-store-cart.SC-e4c,g10.shared-store-cart.SC-j31,g10.shared-store-cart.SC-xfz,g10.shared-store-cart.SC-62u,g10.shared-store-cart.SC-gx1,g10.shared-store-cart.SC-tou -->
### shared.ui-store-cart.US2-TC3: An empty cart shows the empty state and no footer

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-02

**Pre-conditions:**

* `<story>` supplies an empty-cart title, `<description>`.

**Test data:**

| `<story>` | `<description>` | `<reach>` |
| --- | --- | --- |
| CartDrawer Empty State | and a line under it | the story as it opens |
| CartDrawer Empty State Without Description | and no line under it | the story as it opens |
| CartDrawer Default | and a line under it | removing each line in turn |

**Steps:**

1. Open the story, and reach the cart by `<reach>`; read the body, the drawer title and below the body.

**Expected Results:**

* The drawer stays open; the body shows a cart icon and the title, `<description>` with no blank line in its place, no button and no line; no count beside the title, the close control still shown, and no footer, price summary or Checkout.

<!-- trace:case id=g10.shared-store-cart.TC-bzg rev=1 covers=g10.shared-store-cart.SC-9dd,g10.shared-store-cart.SC-dcr,g10.shared-store-cart.SC-utr,g10.shared-store-cart.SC-e4c,g10.shared-store-cart.SC-j31,g10.shared-store-cart.SC-xfz,g10.shared-store-cart.SC-62u,g10.shared-store-cart.SC-gx1,g10.shared-store-cart.SC-tou -->
### shared.ui-store-cart.US2-TC8: The drawer body composed alone shows the empty state from its own copy

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-02

**Pre-conditions:**

* The CartDrawerBody Empty story supplies an empty-cart title and a line under it on the body's own props.

**Steps:**

1. Open the story, and read the body.

**Expected Results:**

* A cart icon, the title and the line under it; no button, item row or placeholder row.

<!-- trace:case id=g10.shared-store-cart.TC-ze9 rev=1 covers=g10.shared-store-cart.SC-9dd,g10.shared-store-cart.SC-dcr,g10.shared-store-cart.SC-utr,g10.shared-store-cart.SC-e4c,g10.shared-store-cart.SC-j31,g10.shared-store-cart.SC-xfz,g10.shared-store-cart.SC-62u,g10.shared-store-cart.SC-gx1,g10.shared-store-cart.SC-tou -->
### shared.ui-store-cart.US2-TC6: A cart of only sold-out lines lists them, not the empty state

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-02

**Pre-conditions:**

* The CartDrawer Only Sold Out Lines story opens on two sold-out lines, none delisted.

**Steps:**

1. Open the story; read the body, the drawer title and the footer.

**Expected Results:**

* Both lines show, each marked sold out; no empty state; no count beside the title; the footer shows the price summary and Checkout.

<!-- trace:case id=g10.shared-store-cart.TC-r4q rev=1 covers=g10.shared-store-cart.SC-3aw -->
### shared.ui-store-cart.US2-TC9: A supplied picture fills the existing thumbnail frame

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-02

**Pre-conditions:**

* `<story>` supplies a served picture, an item name and `<alt text>` for a `<line>`.

**Test data:**

| `<story>` | `<alt text>` | `<line>` |
| --- | --- | --- |
| CartItem/Picture Picture | Card front | available line |
| CartItem/Picture Picture With Whitespace Alt | two spaces | available line |
| CartDrawerBody Pictures | Card front | available line |
| CartDrawer Pictures | Card front | sold-out line |

**Steps:**

1. Open the story; read the line's thumbnail, its picture and alt text.
2. Use each of the line's controls, and read the Actions panel.

**Expected Results:**

* Step 1 shows the supplied picture loaded in the existing frame, its alt text `<alt text>` unchanged; a sold-out line keeps its sold-out treatment.
* Step 2 records each control's callback as before.

<!-- trace:case id=g10.shared-store-cart.TC-w8c rev=1 covers=g10.shared-store-cart.SC-p71 -->
### shared.ui-store-cart.US2-TC10: A picture with no alt text takes the item's name

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-02

**Pre-conditions:**

* `<story>` supplies a picture for Gengar VMAX, its alt text `<alt text>`.

**Test data:**

| `<story>` | `<alt text>` |
| --- | --- |
| CartItem/Picture Picture Without Alt | absent |
| CartItem/Picture Picture With Empty Alt | empty |

**Steps:**

1. Open the story, and read the picture's alt text and the line.

**Expected Results:**

* The picture shows, its alt text Gengar VMAX; no new copy or layout appears.

<!-- trace:case id=g10.shared-store-cart.TC-y6p rev=1 covers=g10.shared-store-cart.SC-du1 -->
### shared.ui-store-cart.US2-TC11: A line with no picture keeps the placeholder

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-02

**Pre-conditions:**

* `<story>` supplies a name, quantity, price and callbacks, the picture `<source>`.

**Test data:**

| `<story>` | `<source>` |
| --- | --- |
| CartItem/Picture Without Picture | omitted |
| CartItem/Picture Empty Picture Source | empty |

**Steps:**

1. Open the story; read the line; use its controls; read the Actions panel and the network log.

**Expected Results:**

* The thumbnail shows the existing placeholder beside the name, quantity and price unchanged; each control records its callback; no product is requested.

---

## shared.ui-store-cart.US3: Shopper opens the cart on current prices

**As a** shopper,
**I want** the drawer to read fresh product status and pricing when it opens,
showing skeletons while that read is in flight,
**so that** I decide against the current prices rather than stale ones.

<!-- trace:case id=g10.shared-store-cart.TC-vgm rev=2 covers=g10.shared-store-cart.SC-dvb,g10.shared-store-cart.SC-4pd,g10.shared-store-cart.SC-etj,g10.shared-store-cart.SC-25l -->
### shared.ui-store-cart.US3-TC1: Opening a cart with lines shows skeletons, never the empty state

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-03

**Pre-conditions:**

* The CartDrawer Loading With Lines story holds the drawer loading on lines and an applied promo code.

**Steps:**

1. Open the story; read the body, the drawer title and the footer.

**Expected Results:**

* The lines, the count beside the title, the Subtotal, the discount and the estimated total show as skeletons; no empty state or placeholder row; Checkout is disabled.

<!-- trace:case id=g10.shared-store-cart.TC-8me rev=1 covers=g10.shared-store-cart.SC-dvb,g10.shared-store-cart.SC-4pd,g10.shared-store-cart.SC-etj,g10.shared-store-cart.SC-25l -->
### shared.ui-store-cart.US3-TC2: A cart with no lines stays blank while loading, then shows the empty state

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-03

**Pre-conditions:**

* The CartDrawer Loading No Lines story holds the drawer loading on no lines.

**Steps:**

1. Open the story; read the body, the drawer title and below the body.
2. In Controls, set loading to false; read them again.

**Expected Results:**

* Step 1 leaves the body blank, with no empty state or row skeleton; the count is a skeleton; no footer.
* Step 2 shows the cart icon and the empty-cart title, no count and no footer.

<!-- trace:case id=g10.shared-store-cart.TC-fab rev=1 covers=g10.shared-store-cart.SC-dvb,g10.shared-store-cart.SC-4pd,g10.shared-store-cart.SC-etj,g10.shared-store-cart.SC-25l -->
### shared.ui-store-cart.US3-TC3: A cart whose first read fails stays loading, never empty

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-03

**Pre-conditions:**

* A signed-in customer whose cart holds a line is on the storefront, the drawer closed; the cart's read and its status-and-price check are made to fail.

**Steps:**

1. Click the cart control in the site header, and wait for both reads to fail.
2. Read the body, the drawer title and below the body.

**Expected Results:**

* The drawer opens; the body is blank, with no empty state or cart icon; the count is a skeleton; no footer.

<!-- trace:case id=g10.shared-store-cart.TC-0m3 rev=1 covers=g10.shared-store-cart.SC-dvb,g10.shared-store-cart.SC-4pd,g10.shared-store-cart.SC-etj,g10.shared-store-cart.SC-25l -->
### shared.ui-store-cart.US3-TC4: A cart read empty shows the empty state when its price check fails

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-03

**Pre-conditions:**

* A signed-in customer whose cart holds no line is on the storefront, the drawer closed; only the status-and-price check is made to fail.

**Steps:**

1. Click the cart control, and wait for the check to fail; read the body, the drawer title and below the body.

**Expected Results:**

* The cart icon and the empty-cart title show; no count beside the title; no footer.

---

## shared.ui-store-cart.US4: Shopper dismisses the cart drawer

**As a** shopper,
**I want** to close the drawer from its close button, the backdrop, or the
Escape key, with the page behind it held still,
**so that** I can leave the cart without losing my place on the page beneath
it.

<!-- trace:case id=g10.shared-store-cart.TC-bj1 rev=1 covers=g10.shared-store-cart.SC-yb1 -->
### shared.ui-store-cart.US4-TC1: The close button, the backdrop or Escape closes the drawer

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-04

**Pre-conditions:**

* The CartDrawer Default story is open.

**Test data:**

| `<close by>` |
| --- |
| clicking the close button |
| clicking the backdrop |
| pressing Escape |

**Steps:**

1. Close the drawer by `<close by>`; read the Actions panel.

**Expected Results:**

* The drawer closes, recording one close.

<!-- trace:case id=g10.shared-store-cart.TC-d72 rev=1 covers=g10.shared-store-cart.SC-mxv -->
### shared.ui-store-cart.US4-TC2: A pending drawer still reads, scrolls and dismisses

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-04

**Pre-conditions:**

* The CartDrawer Interaction Pending story holds an overflowing accepted cart, interaction pending, the promo sheet `<sheet>`.

**Test data:**

| `<sheet>` | `<dismiss by>` |
| --- | --- |
| closed | the close button |
| closed | the backdrop |
| closed | Escape |
| open, reached from its opener | Back |
| open, reached from its opener | the backdrop |
| open, reached from its opener | Escape |

**Steps:**

1. Read the lines, and scroll the drawer, or the open sheet, to its end.
2. Dismiss by `<dismiss by>`; read where focus lands and the Actions panel.

**Expected Results:**

* Step 1 reads and scrolls while pending.
* Step 2 closes an open sheet first, leaving the drawer open with focus back on its opener, and recording the sheet's one collapse; with the sheet closed it closes the drawer, recording one close; no item, tender or navigation callback is recorded.

---

## shared.ui-store-cart.US5: Shopper proceeds from the cart to checkout

**As a** shopper,
**I want** the checkout button to show it is redirecting while the
application creates the session,
**so that** I know the checkout is under way, and see the button return to
its label if it fails.

<!-- trace:case id=g10.shared-store-cart.TC-5qb rev=1 covers=g10.shared-store-cart.SC-ubk -->
### shared.ui-store-cart.US5-TC1: Checkout shows it is redirecting and starts the checkout

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-05

**Pre-conditions:**

* The CartDrawer Default story is open on an active line.

**Steps:**

1. Click Checkout; read the button and the Actions panel.

**Expected Results:**

* The button shows its loading state labelled as redirecting, and one checkout is recorded.

---
## shared.ui-store-cart.US6: Shopper opens a cart that held a delisted product

**As a** shopper,
**I want** a product that left the catalogue to disappear after the drawer
finishes loading, with one toast,
**so that** I am not shown a sold-out row for something the store no longer
sells.

<!-- trace:case id=g10.shared-store-cart.TC-ea2 rev=1 covers=g10.shared-store-cart.SC-sol,g10.shared-store-cart.SC-0wv,g10.shared-store-cart.SC-fy2,g10.shared-store-cart.SC-jbs,g10.shared-store-cart.SC-pvs,g10.shared-store-cart.SC-psl -->
### shared.ui-store-cart.US6-TC1: Delisted lines clear after loading with one toast

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-06

**Pre-conditions:**

* `<story>` holds `<cart>` behind its Open Cart button; the status-and-price read returns each delisted line as gone from the catalogue.

**Test data:**

| `<story>` | `<cart>` | `<left>` |
| --- | --- | --- |
| CartDrawer Unavailable Items Removed | an active line and a delisted line | the active line, the count reading 1 |
| CartDrawer Only Delisted Lines | two delisted lines | the empty state, no count and no footer |
| a drawer opened on that cart | a delisted line and a sold-out line | the sold-out line, no empty state, no count, the footer shown |

**Steps:**

1. Click Open Cart, and wait for the skeletons to clear; read the drawer and the toasts.

**Expected Results:**

* No delisted line shows, not even sold out; the drawer reads `<left>`; exactly one removal toast shows.

<!-- trace:case id=g10.shared-store-cart.TC-3oj rev=1 covers=g10.shared-store-cart.SC-sol,g10.shared-store-cart.SC-0wv,g10.shared-store-cart.SC-fy2,g10.shared-store-cart.SC-jbs,g10.shared-store-cart.SC-pvs,g10.shared-store-cart.SC-psl -->
### shared.ui-store-cart.US6-TC2: A cart with no delisted line raises no removal toast

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-06

**Pre-conditions:**

* A drawer holds two active lines behind an Open Cart button, the read returning both in the catalogue.

**Steps:**

1. Click Open Cart, and wait for the skeletons to clear; read the drawer, the toasts and the Actions panel.

**Expected Results:**

* Both lines show; no removal toast; no removal recorded.

<!-- trace:case id=g10.shared-store-cart.TC-kad rev=1 covers=g10.shared-store-cart.SC-sol,g10.shared-store-cart.SC-0wv,g10.shared-store-cart.SC-fy2,g10.shared-store-cart.SC-jbs,g10.shared-store-cart.SC-pvs,g10.shared-store-cart.SC-psl,g10.shared-store-cart.SC-9dd,g10.shared-store-cart.SC-dcr,g10.shared-store-cart.SC-utr,g10.shared-store-cart.SC-e4c,g10.shared-store-cart.SC-j31,g10.shared-store-cart.SC-xfz,g10.shared-store-cart.SC-62u,g10.shared-store-cart.SC-gx1,g10.shared-store-cart.SC-tou -->
### shared.ui-store-cart.US6-TC6: A sold-out line shows but is not counted, and a delisted line shows neither way

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-06

**Pre-conditions:**

* The CartDrawer Mixed Line States story holds an active line, a sold-out line and a line marked unavailable, loaded, and keeps every line when the drawer asks to remove one.

**Steps:**

1. Open the story; read the body and the count beside the drawer title.

**Expected Results:**

* The active line and the sold-out line show, the second marked sold out; the unavailable line does not; the count reads 1.

---

## shared.ui-store-cart.US7: Shopper edits a low-stock line and the warning quiets

**As a** shopper,
**I want** the low-stock warning to hide after I change that line's quantity,
**so that** it does not keep shouting after I have acted, and it returns if the line is adjusted again.

<!-- trace:case id=g10.shared-store-cart.TC-hzl rev=1 covers=g10.shared-store-cart.SC-8f7,g10.shared-store-cart.SC-lju,g10.shared-store-cart.SC-7il -->
### shared.ui-store-cart.US7-TC1: The low-stock warning quiets once the line is edited, and returns when adjusted again

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-07

**Pre-conditions:**

* The CartItem/Status Quantity Adjusted story holds a line whose status is adjusted, its quantity able to change without removing it.

**Steps:**

1. Read the line.
2. Change its quantity; read the line and the Actions panel.
3. In Controls, set its status to default, then adjusted again; read the line.

**Expected Results:**

* Step 1 shows the low-stock warning.
* Step 2 hides it, recording the new quantity.
* Step 3 shows it again.

---

## shared.ui-store-cart.US8: Shopper raises a line to the last unit the shop has

**As a** shopper,
**I want** a line's stepper to stop where the shop runs out, and the line to
say how many are left,
**so that** I am not still raising a number the checkout will quietly put back
down.

<!-- trace:case id=g10.shared-store-cart.TC-uob rev=1 covers=g10.shared-store-cart.SC-zdl,g10.shared-store-cart.SC-27k,g10.shared-store-cart.SC-38a,g10.shared-store-cart.SC-0n8,g10.shared-store-cart.SC-pvg -->
### shared.ui-store-cart.US8-TC1: The stepper stops at the line's maximum and still counts down

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-08

**Pre-conditions:**

* The CartItem/Quantity At Line Maximum story holds a line at quantity 2 with a maximum of 2.

**Steps:**

1. Click its increase control; read the control and the Actions panel.
2. Click its decrease control; read the Actions panel.

**Expected Results:**

* Step 1 records nothing, the control announced unavailable.
* Step 2 records quantity 1.

<!-- trace:case id=g10.shared-store-cart.TC-tpg rev=1 covers=g10.shared-store-cart.SC-zdl,g10.shared-store-cart.SC-27k,g10.shared-store-cart.SC-38a,g10.shared-store-cart.SC-0n8,g10.shared-store-cart.SC-pvg -->
### shared.ui-store-cart.US8-TC2: A line with no maximum counts on

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-08

**Pre-conditions:**

* The CartItem/Quantity No Line Maximum story holds a line at quantity 2 with no maximum.

**Steps:**

1. Click its increase control; read the Actions panel.

**Expected Results:**

* It records quantity 3.

<!-- trace:case id=g10.shared-store-cart.TC-0lh rev=1 covers=g10.shared-store-cart.SC-zdl,g10.shared-store-cart.SC-27k,g10.shared-store-cart.SC-38a,g10.shared-store-cart.SC-0n8,g10.shared-store-cart.SC-pvg -->
### shared.ui-store-cart.US8-TC3: A line says what is left only where it is told

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-08

**Pre-conditions:**

* `<story>` holds a line supplied `<remaining>`.

**Test data:**

| `<story>` | `<remaining>` | `<reads>` |
| --- | --- | --- |
| CartItem/Status Remaining Count | Only 2 left | Only 2 left |
| CartItem/Status No Remaining Count | nothing | no remaining count |

**Steps:**

1. Read the line.

**Expected Results:**

* It reads `<reads>`, and nothing else on it says what is left.

---

## shared.ui-store-cart.US13: Shopper reads a site sale on the cart lines

**As a** shopper,
**I want** an automatic site sale to show as the lower price with the list
price struck through on each line, without a second Store sale line in the
summary,
**so that** I can trust the Subtotal as the sum of the lines I can still buy,
at the prices I see on them.

<!-- trace:case id=g10.shared-store-cart.TC-no2 rev=1 covers=g10.shared-store-cart.SC-ycc,g10.shared-store-cart.SC-ahq -->
### shared.ui-store-cart.US13-TC1: A line given a list price strikes it beside its price

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-13

**Pre-conditions:**

* `<story>` supplies a line's price and `<list price>`.

**Test data:**

| `<story>` | `<list price>` |
| --- | --- |
| CartItem/Price Sale Price | above the price |
| CartItem/Price Equal List Price | equal to the price |

**Steps:**

1. Open the story, and read the line's prices.

**Expected Results:**

* The line shows its price with the list price struck through beside it, and no third price.

<!-- trace:case id=g10.shared-store-cart.TC-ny1 rev=1 covers=g10.shared-store-cart.SC-ycc,g10.shared-store-cart.SC-ahq -->
### shared.ui-store-cart.US13-TC2: Sale lines sum to the Subtotal with no sale row

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-13

**Pre-conditions:**

* The CartDrawer/Auto Discount On Sale story holds two sale lines, one of two units, a full-price line, a sold-out line and an unavailable line, no code applied.

**Steps:**

1. Read each line's prices, and the summary rows.

**Expected Results:**

* Each sale line shows its sale price with its list price struck through, the line of two at the price of one; the full-price line shows one price; the sold-out line is marked; the unavailable line is not listed.
* The Subtotal is each listed line's price times its quantity, leaving out the sold-out line; no row names the sale, and no discount row shows.

---

## shared.ui-store-cart.US14: Shopper stacks a promo on the site sale

**As a** shopper,
**I want** a promo that stacks to leave the sale prices on the lines and add
only its own Discount in the footer,
**so that** I can see both cuts without the summary inventing a Store sale
row.

<!-- trace:case id=g10.shared-store-cart.TC-96l rev=1 covers=g10.shared-store-cart.SC-zxr -->
### shared.ui-store-cart.US14-TC1: A stacked code keeps the sale lines and adds one discount

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-14

**Pre-conditions:**

* The CartDrawer/Auto Discount Stack story holds sale lines and a held code that stacks, none applied.

**Steps:**

1. Open the promo sheet, and click Apply on the stacking code.
2. Read each sale line's prices, and the summary rows.

**Expected Results:**

* Each sale line still shows its sale price with its list price struck through; the Subtotal is unchanged; one discount row, for the code, reads its amount; no row names the sale.

---

## shared.ui-store-cart.US15: Shopper is refused a promo against the site sale

**As a** shopper,
**I want** a code that cannot combine with the site sale to leave my sale
prices alone and tell me why, including on a held ticket I cannot Apply,
**so that** I am not left wondering whether the sale or the code won.

<!-- trace:case id=g10.shared-store-cart.TC-dpj rev=1 covers=g10.shared-store-cart.SC-8bx,g10.shared-store-cart.SC-9ie,g10.shared-store-cart.SC-gas,g10.shared-store-cart.SC-tp9 -->
### shared.ui-store-cart.US15-TC1: A refused code leaves the sale lines and says why

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-15

**Pre-conditions:**

* The CartDrawer/Auto Discount Refuse story holds sale lines, no code applied; its quote refuses a code against the sale with This promo code cannot stack on the site sale.

**Test data:**

| `<route>` | `<refusal shows>` |
| --- | --- |
| typing the refused code in the promo field and pressing Enter | as the field's error |
| clicking Apply on a held code listed as able to apply | in the sheet, the ticket moved apart, muted, with the refusal as its reason and no Apply |

**Steps:**

1. Read the total; open the promo sheet, and try the code by `<route>`.
2. Read each sale line's prices, and the summary rows.

**Expected Results:**

* Step 1 shows the refusal `<refusal shows>`.
* Step 2 leaves each sale line at its sale price with its list price struck through, the Subtotal and the total unchanged, no discount row and no row naming the sale.

<!-- trace:case id=g10.shared-store-cart.TC-oyz rev=1 covers=g10.shared-store-cart.SC-8bx,g10.shared-store-cart.SC-9ie,g10.shared-store-cart.SC-gas,g10.shared-store-cart.SC-tp9 -->
### shared.ui-store-cart.US15-TC3: A held code that cannot apply sits apart, with no Apply

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-15

**Pre-conditions:**

* The CartDrawer/Auto Discount Refuse story holds one held code that can apply and one that cannot, with its reason.

**Steps:**

1. Open the promo sheet, and read the held tickets.
2. Tab through the sheet, and click the code that cannot apply; read the Actions panel.

**Expected Results:**

* Step 1 shows the code that can apply with its Apply; the other is listed apart, muted, with its reason and no Apply.
* Step 2 never focuses an Apply on it, and records no apply.

---

## shared.ui-store-cart.US16: Shopper's promo replaces the site sale

**As a** shopper,
**I want** a replacing promo to put the list price back on each line it takes
the sale from and show only that code's Discount in the footer,
**so that** I know the site sale is no longer on those lines.

<!-- trace:case id=g10.shared-store-cart.TC-fd7 rev=1 covers=g10.shared-store-cart.SC-6r0 -->
### shared.ui-store-cart.US16-TC1: A replacing code puts each line it takes at list price and leaves the rest on sale

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-16

**Pre-conditions:**

* The CartDrawer/Auto Discount Replace story holds a replacing code applied, its quote taking the sale from line A and leaving it on line B.

**Steps:**

1. Read line A's and line B's prices, and the summary rows.

**Expected Results:**

* Line A shows its list price alone; line B its sale price with its list price struck through; the Subtotal sums the lines; one discount row, for the code; no row names the sale.

---

## shared.ui-store-cart.US17: Shopper removes a promo and keeps the site sale

**As a** shopper,
**I want** removing the promo to drop its discount and, where it had replaced
the site sale, put the sale back on the lines while the sale still runs,
**so that** I am not left at full list price after clearing a code.

<!-- trace:case id=g10.shared-store-cart.TC-3df rev=1 covers=g10.shared-store-cart.SC-07s -->
### shared.ui-store-cart.US17-TC1: Removing a code leaves the lines on the sale

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-17

**Pre-conditions:**

* The site sale still runs; `<story>` holds `<code>` applied.

**Test data:**

| `<story>` | `<code>` | `<before>` |
| --- | --- | --- |
| CartDrawer/Auto Discount Fallback After Remove | a code that replaced the sale | the replaced lines at list price alone |
| CartDrawer/Auto Discount Stack, after applying the stacking code | a code stacked on the sale | the sale lines at their sale price |

**Steps:**

1. Read the lines' prices.
2. Click Remove on the code's discount row; read the lines' prices and the summary rows.

**Expected Results:**

* Step 1 reads `<before>`.
* Step 2 shows each line at its sale price with its list price struck through, the code's row gone, the Subtotal summing the lines and no row naming the sale.

---

## shared.ui-store-cart.US18: Shopper reads an order discount in the summary

**As a** shopper,
**I want** a cut the shop takes off the whole order to show as its own row
after the Subtotal, with no line struck and no Remove,
**so that** the cart reads the way the shop's checkout prints it.

<!-- trace:case id=g10.shared-store-cart.TC-pfl rev=1 -->
### shared.ui-store-cart.US18-TC1: An order discount sits under the Subtotal, with no Remove

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-18

**Pre-conditions:**

* The CartDrawerFooter/Checkout Order Discount story supplies one order discount row, its label and amount.

**Steps:**

1. Read the summary rows and each line's prices.

**Expected Results:**

* The order discount reads its label and amount after the Subtotal and before the promo code row, its amount in the success colour, with no Remove; no line is struck for it.

---
## shared.ui-store-cart.US19: Shopper waits for an accepted tender choice

**As a** shopper,
**I want** the drawer to hold my accepted figures while a tender change finishes,
**so that** I cannot submit conflicting changes or continue with an unresolved choice.

<!-- trace:case id=g10.shared-store-cart.TC-cxw rev=1 covers=g10.shared-store-cart.SC-9yi,g10.shared-store-cart.SC-nty,g10.shared-store-cart.SC-x24 -->
### shared.ui-store-cart.US19-TC1: A pending tender choice holds every tender action and Checkout

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-19

**Pre-conditions:**

* `<story>` holds accepted figures, a selected code and 120 points entered, `<points>`, every callback supplied, tender pending.

**Test data:**

| `<story>` | `<points>` |
| --- | --- |
| CartDrawerFooter/Points Tender Pending Applied Points | applied |
| CartDrawerFooter/Points Tender Pending Points | not applied |
| CartDrawer Tender Pending With Open Promo Sheet | not applied, the promo sheet open |

**Steps:**

1. Click, and press Enter on, the points and promo fields, Apply, Use max, both Removes, a held code and Checkout; read the figures and the Actions panel.

**Expected Results:**

* Each is disabled and records nothing; the accepted figures and the 120 entered stay.

<!-- trace:case id=g10.shared-store-cart.TC-ja3 rev=1 covers=g10.shared-store-cart.SC-pxz -->
### shared.ui-store-cart.US19-TC4: A pending drawer holds its item, tender and navigation controls

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared.ui-store-cart.US19

**Pre-conditions:**

* `<surface>` holds an active line, accepted figures, points entered and a selected code, `<points>`, every callback supplied.

**Test data:**

| `<surface>` | `<points>` |
| --- | --- |
| the CartDrawer Interaction Pending story | applied, with Remove |
| the CartDrawer Interaction Pending story | not applied, with Apply and Use max |
| the CartDrawerBody, CartItem and CartDrawerFooter/Interactive Interaction Pending stories | not applied, with Apply and Use max |

**Steps:**

1. In Controls, set interaction pending.
2. Click, and press Enter and Space on, the quantity controls, the line's remove and product link, the points field, its disclosure, Apply, Use max, Remove, the promo disclosure, the code's Remove, the account or loyalty link and Checkout; type in the points field.
3. Read the figures, the entered points and the Actions panel.

**Expected Results:**

* Each is disabled and records nothing; no disclosure opens and no link navigates; the quantity, the selected code, the figures and the entered points stay.

<!-- trace:case id=g10.shared-store-cart.TC-cpt rev=1 covers=g10.shared-store-cart.SC-xrx -->
### shared.ui-store-cart.US19-TC5: A pending drawer holds the open promo sheet, which still scrolls and closes

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared.ui-store-cart.US19

**Pre-conditions:**

* `<sheet>` is open on a typed code and held codes, long enough to scroll, every callback supplied.

**Test data:**

| `<sheet>` | `<dismiss by>` |
| --- | --- |
| the CartDrawer Nested Promo Dismiss story's promo sheet | Back |
| the CartDrawer Nested Promo Dismiss story's promo sheet | the backdrop |
| the CartDrawerFooter/Promo Sheet Interaction Pending story | Escape |

**Steps:**

1. In Controls, set interaction pending.
2. Type in the code field; click, and press Enter on, Apply, a held code and the loyalty link; read the field and the Actions panel.
3. Scroll the sheet; dismiss it by `<dismiss by>`.

**Expected Results:**

* Step 2 changes nothing and records nothing, the typed code and the figures unchanged.
* Step 3 scrolls, and closes the sheet.

<!-- trace:case id=g10.shared-store-cart.TC-wh7 rev=1 covers=g10.shared-store-cart.SC-rb9 -->
### shared.ui-store-cart.US19-TC7: Pending stops a removal before it is sent

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared.ui-store-cart.US19

**Pre-conditions:**

* The CartDrawerBody Line Removal Pending story holds an active line, its removal sent when its animation ends.

**Steps:**

1. Click the line's remove; before the animation ends, set interaction pending in Controls.
2. Wait past the animation; read the line and the Actions panel.
3. Clear interaction pending; read them again.

**Expected Results:**

* Step 2 keeps the line, out of its removal animation, recording no removal.
* Step 3 still keeps it, recording no removal.

---

## shared.ui-store-cart.US20: Shopper resumes after the drawer receives an answer

**As a** shopper whose drawer is no longer waiting,
**I want** only currently available actions to return without repeating an earlier action,
**so that** I decide what happens next from the accepted cart or its failure feedback.

<!-- trace:case id=g10.shared-store-cart.TC-wru rev=1 covers=g10.shared-store-cart.SC-fct,g10.shared-store-cart.SC-9yi,g10.shared-store-cart.SC-nty,g10.shared-store-cart.SC-x24 -->
### shared.ui-store-cart.US20-TC1: Clearing pending brings back only what is allowed now, repeating nothing

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared.ui-store-cart.US20

**Pre-conditions:**

* The CartDrawer story holds accepted figures, entered values, a line at its maximum and `<held back>`, with `<pending>` set; every attempt while pending recorded nothing.

**Test data:**

| `<pending>` | `<held back>` | `<cleared>` | `<still held>` |
| --- | --- | --- | --- |
| interaction pending | no Checkout callback | interaction pending | Checkout |
| interaction pending | an invalid typed code | interaction pending | Apply |
| interaction pending | zero points entered | interaction pending | the points Apply |
| interaction pending, and tender pending | nothing | interaction pending | every tender action and Checkout |
| tender pending | no points callback | tender pending | the points Apply |

**Steps:**

1. Record the figures, the entered values and the Actions panel; in Controls, clear `<cleared>`.
2. Try `<still held>`, and the line's increase; use each other control once, and read the Actions panel after each.

**Expected Results:**

* Step 1 records nothing, the figures and entered values unchanged.
* Step 2 leaves `<still held>` and the increase disabled, recording nothing for them; each other control, the line's decrease among them, records one action.

<!-- trace:case id=g10.shared-store-cart.TC-r4f rev=1 covers=g10.shared-store-cart.SC-2h3,g10.shared-store-cart.SC-9yi,g10.shared-store-cart.SC-nty,g10.shared-store-cart.SC-x24 -->
### shared.ui-store-cart.US20-TC2: A drawer given no pending state keeps its existing behaviour

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared.ui-store-cart.US20

**Pre-conditions:**

* `<surface>` holds an interactive cart, `<interaction pending>` and `<tender pending>`.

**Test data:**

| `<surface>` | `<interaction pending>` | `<tender pending>` |
| --- | --- | --- |
| the CartDrawer story | omitted | omitted |
| the CartDrawer story | omitted | false |
| the CartDrawerBody, CartItem, CartDrawerFooter and CartDrawerFooter/Promo Sheet stories | false | false |
| the CartDrawer story, then read-only, verifying, redirecting, loading and checkout-disabled | omitted | false |

**Steps:**

1. Read the layout and the controls; use each available control once, and read the Actions panel.

**Expected Results:**

* The layout and loading look as before, each existing guard still disabling its controls; each available control records one action and no figure changes otherwise.

---

## shared.ui-store-cart.US21: Shopper sees a guest checkout in the cart footer

**As a** shopper who is not signed in,
**I want** the footer to offer a guest checkout action with a sign-in link under it and no points block or wallet section,
**so that** I can continue to checkout without the benefits a guest does not hold.

<!-- trace:case id=g10.shared-store-cart.TC-3vp rev=1 -->
### shared.ui-store-cart.US21-TC1: A guest's footer offers sign-in under Checkout, with no member codes or points

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared.ui-store-cart.US21

**Pre-conditions:**

* The CartDrawerFooter/Guest Guest story holds a ready guest cart, a sign-in action and no held codes, `<state>`.

**Test data:**

| `<state>` | `<sign-in link>` |
| --- | --- |
| idle | records one sign-in |
| interaction pending | disabled, recording nothing |
| redirecting | disabled, recording nothing |

**Steps:**

1. Read the footer; click the sign-in link, and read the Actions panel.

**Expected Results:**

* A sign-in line shows under Checkout, its link `<sign-in link>`; no held-code section, no empty held-code state and no loyalty call to action show.

---

## shared.ui-store-cart.US22: Shopper sees public codes in the picker

**As a** shopper,
**I want** the promo-code picker to list the public codes the consumer passes in their own section,
**so that** I can pick a code open to everyone beside whatever codes are mine.

<!-- trace:case id=g10.shared-store-cart.TC-l75 rev=1 -->
### shared.ui-store-cart.US22-TC1: Public codes join the picker under their own heading

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared.ui-store-cart.US22

**Pre-conditions:**

* The CartDrawerFooter/Guest Member With Public Codes story holds one held code that can apply, one public code that can apply and one public code that cannot, with its reason.

**Steps:**

1. Open the promo sheet, and read the codes.

**Expected Results:**

* Both codes that can apply are listed under the public codes heading, each with Apply; the public code that cannot is listed apart, muted, with its reason and no Apply.

---

## Settled

- A cart of only sold-out lines is not empty: it lists them with the footer and no count beside the drawer title.
- A cart nobody has read stays loading, never the empty state.
- A cart read empty shows the empty state, even when its price check fails.
- The count beside the drawer title is one per line, whatever its quantity.
- **A code replacing the sale on some lines** - line by line, as the quote supplies each line
- **Sold-out and unavailable lines in the Subtotal** - left out, as the drawer title's count leaves them out
- **A line holding more than one** - the Subtotal counts its price times its quantity; the line shows the price of one
- **A list price equal to the price** - the drawer strikes any list price it is given and compares no amounts
- **A held code picked and then refused** - the lines and the totals stay on the sale and the sheet says why, as for a typed code; its ticket moves apart, muted, with the refusal as its reason and no Apply
- **Removing a replacing code after the sale ended** - the drawer renders the lines it is given; whether the sale still runs is the quote's
- **A line both repriced and on sale** - not the drawer's: it strikes the list price it is given; which price Grade10 supplies is open on the Grade10 Cart Drawer page
- **Whitespace-only alt text** - Q7 retains the supplied non-empty string; only absent or empty alt text uses the item name.
- **Empty picture source** - Q8 uses the existing placeholder.
