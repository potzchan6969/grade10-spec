# shared/ui/store-cart Test Cases

**Status:** pending-review · 0/9
**Drafts styled:** 2026-10-27, tcs-rules r7
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

## shared.ui-store-cart.US6: Shopper opens a cart that held a delisted product

**As a** shopper,
**I want** a product that left the catalogue to disappear after the drawer
finishes loading, with one toast,
**so that** I am not shown a sold-out row for something the store no longer
sells.

<!-- trace:case id=g10.shared-store-cart.TC-kad rev=1 covers=g10.shared-store-cart.SC-sol,g10.shared-store-cart.SC-0wv,g10.shared-store-cart.SC-fy2,g10.shared-store-cart.SC-jbs,g10.shared-store-cart.SC-pvs,g10.shared-store-cart.SC-psl,g10.shared-store-cart.SC-9dd,g10.shared-store-cart.SC-dcr,g10.shared-store-cart.SC-utr,g10.shared-store-cart.SC-e4c,g10.shared-store-cart.SC-j31,g10.shared-store-cart.SC-xfz,g10.shared-store-cart.SC-62u,g10.shared-store-cart.SC-gx1,g10.shared-store-cart.SC-tou -->
### shared.ui-store-cart.US6-TC6: A line still passed as unavailable is neither shown nor counted

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

* The active line and the sold-out line show, the second marked sold out; the unavailable line, which no application leaves in its cart, does not; the count reads 1.

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

1. Open the story, and read the line's prices.

**Expected Results:**

* The line shows its price with the list price struck through beside it, and no third price.

---

## shared.ui-store-cart.US19: Shopper waits for an accepted tender choice

**As a** shopper,
**I want** the drawer to hold my accepted figures while a tender change finishes,
**so that** I cannot submit conflicting changes or continue with an unresolved choice.

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

## shared.ui-store-cart.US22: Shopper sees public codes in the picker

**As a** shopper,
**I want** the promo-code picker to list the public codes the consumer passes in their own section,
**so that** I can pick a code open to everyone beside whatever codes are mine.

<!-- trace:case id=g10.shared-store-cart.TC-97c rev=1 covers=g10.shared-store-cart.SC-n0y,g10.shared-store-cart.SC-rt4,g10.shared-store-cart.SC-p5j -->
### shared.ui-store-cart.US22-TC1: Promo tickets keep supplied detail emphasis separate from the title

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
* **Trace:** shared.ui-store-cart.US22

**Pre-conditions:**

* The matching `PromoTicket` story is available at `<storybook>` and can be
  supplied the row's title, expiry/conditions detail, code, applicability,
  refusal reason, detail emphasis and action.

**Test data:**

| State | `detailEmphasis` | Applicability and action |
| --- | --- | --- |
| applicable near-expiry ticket | `true` | applicable, Apply action supplied |
| applicable plain ticket | `false`, then omitted | applicable, Apply action supplied |
| public inapplicable near-expiry ticket | `true` | muted and inapplicable, refusal supplied, no action |

**Steps:**

1. Open the matching `PromoTicket` story at `<storybook>` with the row's
   props.
2. Read the title, detail, code, refusal reason and action slots, and inspect
   the ticket order and the detail's classes.
3. Activate Apply where the row supplies it and inspect the callback record.

**Expected Results:**

* The near-expiry applicable row keeps the supplied discount title, expiry or
  conditions detail, code, Apply action, callback and position; only the
  existing detail slot has the emphasis treatment.
* The plain row remains plain for both false and omitted values; the shared
  ticket does not infer emphasis from the displayed text or a clock, and all
  supplied slots remain unchanged.
* The public inapplicable row remains muted with its refusal reason and no
  Apply action, while its supplied expiry detail alone receives the emphasis;
  title, detail text, code and position remain unchanged.

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

## Reconciliation

### Manual

| Manual | Why |
| --- | --- |
| `shared.ui-store-cart.US22-TC1` | To be walked in the controlled shared UI Storybook after the shared contract and Grade10 mapper land. |
