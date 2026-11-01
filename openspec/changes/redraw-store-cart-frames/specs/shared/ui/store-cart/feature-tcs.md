# shared/ui/store-cart Test Cases

**Status:** pending-review · 0/4
**Drafts styled:** 2026-10-30, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7

**Out of suite (non-GUI):** shared-ui-store-cart-SC-01, shared-ui-store-cart-SC-22, shared-ui-store-cart-SC-43 - the export set, its types and the retired slot exports, held by `packages/ui/src/index.test.ts` and `pnpm run typecheck`

## Background

* Every outcome a store page shows is walked in the store's cart suite; these cases hold the variants no application renders, walked in the shared UI Storybook.
* `<storybook>` is the shared UI Storybook, served by `pnpm storybook:ui`; the drawer's stories sit under Store/Cart. A story's Controls panel changes the props it passes to the drawer; its Actions panel records each callback the drawer calls.
* A story named in a case opens the drawer on the lines the case's pre-conditions describe.

* `<storybook>` is the shared UI Storybook's Store Cart area. The
  `Store/Cart/Blocks/PromoTicket` stories accept the supplied title, detail,
  code, applicability, detail emphasis and action props.

## shared.ui-store-cart.US2: Shopper reviews what the cart holds

**As a** shopper,
**I want** the drawer to show my items with a count that ignores sold-out
items, an edge fade when there are more, and an empty state when the cart
holds nothing,
**so that** I can see what I am buying, or that there is nothing to buy yet.

<!-- trace:case id=g10.shared-store-cart.TC-kz7 rev=2 covers=g10.shared-store-cart.SC-9dd,g10.shared-store-cart.SC-dcr,g10.shared-store-cart.SC-utr,g10.shared-store-cart.SC-e4c,g10.shared-store-cart.SC-j31,g10.shared-store-cart.SC-xfz,g10.shared-store-cart.SC-62u,g10.shared-store-cart.SC-gx1,g10.shared-store-cart.SC-tou -->
### shared.ui-store-cart.US2-TC3: An empty state given no description shows its icon and title alone

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-02

**Pre-conditions:**

* The CartDrawer Empty State Without Description story supplies an empty-cart title and no description; no application renders this variant.

**Steps:**

1. Open the story on `<storybook>`; read the body.

**Expected Results:**

* A cart icon and the title, with no line or blank space under it and no button.

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

<!-- trace:case id=g10.shared-store-cart.TC-r4q rev=1 covers=g10.shared-store-cart.SC-3aw -->
### shared.ui-store-cart.US2-TC9: Whitespace alt text is kept as given

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-02

**Pre-conditions:**

* The CartItem/Picture Picture With Whitespace Alt story supplies a picture whose alt text is two spaces.

**Steps:**

1. Open the story; read the picture and its alt text.

**Expected Results:**

* The picture shows in the frame, its alt text the two spaces, not the item's name.

---

## shared.ui-store-cart.US13: Shopper reads a site sale on the cart lines

**As a** shopper,
**I want** an automatic site sale to show as the lower price with the list
price struck through on each line, without a second Store sale line in the
summary,
**so that** I can trust the Subtotal as the sum of the lines I can still buy,
at the prices I see on them.

<!-- trace:case id=g10.shared-store-cart.TC-no2 rev=1 covers=g10.shared-store-cart.SC-ycc,g10.shared-store-cart.SC-ahq -->
### shared.ui-store-cart.US13-TC1: A list price equal to the price is still struck

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-13

**Pre-conditions:**

* The CartItem/Price Equal List Price story supplies a list price equal to the price.

**Steps:**

1. Open the story on `<storybook>`, and read the line's prices.

**Expected Results:**

* The line shows its price with the list price struck through beside it, and no third price.

---

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
- **Status-only order-line strikes (Q5)** - a refunded or cancelled line's strike marks its status, not a sale; its status badge explains it and it gets no `Sale price` or `Was` words.

## Reconciliation

**Run:** QA2, 2026-10-30, tcs-rules r7, after the approved Q5 and Q6 decisions. Compared the QA1 bundle (`/tmp/redraw-store-cart-frames-qa1.md`, SHA-256 `3a85df05b5ddcc89bee1501ed1b86ecd76dd41672278dbcbe433b91839caf110`) with the changed scenarios, `decisions.md`, the shared Cart PRD and its Storybook stories, and the Grade10 Store cart suite.

- **shared-ui-store-cart-SC-67 - covered** - the existing `g10.store-cart.TC16` app case is extended at rev 2 to read struck and unstruck cart lines with a screen reader and verify the words and their order. It also checks that the words remain hidden visually.
- **Equal-price Storybook case - kept, not linked to SC-67** - QA1's `g10.shared-store-cart.TC-no2` remains the visual equal-price variant. It does not assert the new spoken labels. A separate Storybook accessibility assertion is unnecessary because the Grade10 Store cart case exercises the shared block on the product route and checks its accessible output.
- **Q5 - settled** - a refunded or cancelled order-line strike is status-only, so the status badge remains its explanation and the price is outside the Sale price/Was labels scope. This matches the approved PRD decision; it does not create an order-line scenario or case here.
- **Task 3.1 - still open** - no English and Traditional Chinese screen-reader walk evidence was supplied, so this reconciliation does not mark the task complete.

