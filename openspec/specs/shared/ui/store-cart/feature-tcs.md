# shared/ui/store-cart Test Cases

**Status:** pending-review · 0/50
**Drafts styled:** 2026-10-13, tcs-rules r5

**Out of suite:** shared-ui-store-cart-SC-01 - the store-cart export set in `packages/ui/src/index.test.ts`; shared-ui-store-cart-SC-22 - the type assertions in the same test, run by `pnpm run typecheck`; shared-ui-store-cart-SC-43 - the same test, which finds neither slot export

## Background

* `<shared ui storybook url>` is the shared UI Storybook, served by `pnpm storybook:ui`; the drawer's stories sit under Store Cart.
* The Controls panel changes the props of a story that passes its args straight to the drawer, such as Loading No Lines. `Default` keeps its lines in its own state, so a step there changes them through the drawer's own controls.

* <shared ui storybook url> is the shared UI Storybook's Store Cart area.

## shared-ui-store-cart-US2: Shopper reviews what the cart holds

**As a** shopper,
**I want** the drawer to show my items with a count that ignores sold-out
items, an edge fade when there are more, and an empty state when the cart
holds nothing,
**so that** I can see what I am buying, or that there is nothing to buy yet.

<!-- trace:case id=g10.shared-store-cart.TC-nqc rev=2 covers=g10.shared-store-cart.SC-9dd,g10.shared-store-cart.SC-dcr,g10.shared-store-cart.SC-utr,g10.shared-store-cart.SC-e4c,g10.shared-store-cart.SC-j31,g10.shared-store-cart.SC-xfz,g10.shared-store-cart.SC-62u,g10.shared-store-cart.SC-gx1,g10.shared-store-cart.SC-tou -->
### shared-ui-store-cart-US2-TC1-2: A cart with few lines lists only those lines

Runs once per row of **Test data**.

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
* **Trace:** shared-ui-store-cart-US-02

**Pre-conditions:**

* The Default story opens the drawer on 2 lines, both active.

**Test data:**

| `<cart_1>` | `<line count>` | `<setup action>` |
| --- | --- | --- |
| Two lines | 2 | the story as it opens |
| One line | 1 | clicking the remove control on one line |
| Two lines, one at 3 units | 2 | clicking the increase control on the second line until it reads 3 |

| Field | Value |
| --- | --- |
| shared ui storybook url | The shared UI Storybook URL in the test environment; bind its URL only |

**Steps:**

1. Navigate to the Store/Cart/Blocks/CartDrawer Default story at `<shared ui storybook url>`.
2. Reach `<cart_1>` using `<setup action>`.
3. Look at the drawer body.
4. Look at the drawer title and the footer.

**Expected Results:**

* Step 3 shows exactly `<line count>`.
* No dashed or placeholder row follows the last line.
* No empty state shows.
* No edge fade shows while every line fits in the body.
* Step 4: the count beside the drawer title reads `<line count>`.
* Footer shows the price summary and Checkout.

<!-- trace:case id=g10.shared-store-cart.TC-5iw rev=2 covers=g10.shared-store-cart.SC-9dd,g10.shared-store-cart.SC-dcr,g10.shared-store-cart.SC-utr,g10.shared-store-cart.SC-e4c,g10.shared-store-cart.SC-j31,g10.shared-store-cart.SC-xfz,g10.shared-store-cart.SC-62u,g10.shared-store-cart.SC-gx1,g10.shared-store-cart.SC-tou -->
### shared-ui-store-cart-US2-TC2-2: Overflowing lines scroll with an edge fade

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
* **Trace:** shared-ui-store-cart-US-02

**Pre-conditions:**

* None.

**Test data:**

| Field | Value |
| --- | --- |
| shared ui storybook url | The shared UI Storybook URL in the test environment; bind its URL only |

**Steps:**

1. Navigate to the Store/Cart/Blocks/CartDrawer Overflow Items story at `<shared ui storybook url>`.
2. Look at the top and bottom edges of the drawer body.
3. Scroll the drawer body halfway.
4. Look at the top and bottom edges again.
5. Scroll the drawer body to its end.
6. Look at the top and bottom edges again.

**Expected Results:**

* Step 2: a fade at the bottom edge, none at the top.
* Step 4: a fade at both edges.
* Step 5 reaches every line; no placeholder row anywhere.
* Step 6: a fade at the top edge, none at the bottom.

<!-- trace:case id=g10.shared-store-cart.TC-kz7 rev=2 covers=g10.shared-store-cart.SC-9dd,g10.shared-store-cart.SC-dcr,g10.shared-store-cart.SC-utr,g10.shared-store-cart.SC-e4c,g10.shared-store-cart.SC-j31,g10.shared-store-cart.SC-xfz,g10.shared-store-cart.SC-62u,g10.shared-store-cart.SC-gx1,g10.shared-store-cart.SC-tou -->
### shared-ui-store-cart-US2-TC3-2: An empty cart shows the empty state with its description

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-02

**Pre-conditions:**

* The Empty State story supplies `<empty title>` and `<empty description>` on the drawer copy.

**Test data:**

| Field | Value |
| --- | --- |
| empty title | the story's empty-cart title |
| empty description | the story's line under that title |

| Field | Value |
| --- | --- |
| shared ui storybook url | The shared UI Storybook URL in the test environment; bind its URL only |

**Steps:**

1. Navigate to the Store/Cart/Blocks/CartDrawer Empty State story at `<shared ui storybook url>`.
2. Look at the drawer body.
3. Look at the drawer title and the close control.
4. Look below the body for the footer.

**Expected Results:**

* Step 2 shows a cart icon, then `<empty title>`.
* `<empty description>` shows under the title.
* No button in the body.
* No item row and no placeholder row.
* Step 3: no count beside the drawer title; the close control still shows.
* Step 4: no footer, no price summary, no Checkout.

<!-- trace:case id=g10.shared-store-cart.TC-7h8 rev=1 covers=g10.shared-store-cart.SC-9dd,g10.shared-store-cart.SC-dcr,g10.shared-store-cart.SC-utr,g10.shared-store-cart.SC-e4c,g10.shared-store-cart.SC-j31,g10.shared-store-cart.SC-xfz,g10.shared-store-cart.SC-62u,g10.shared-store-cart.SC-gx1,g10.shared-store-cart.SC-tou -->
### shared-ui-store-cart-US2-TC4-1: A sold-out line is left out of the count beside the drawer title

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
* **Trace:** shared-ui-store-cart-US-02

**Pre-conditions:**

* The Mixed Line States story renders `<cart_5>`, loaded.

**Test data:**

| Field | Value |
| --- | --- |
| cart_5 | `<active line>`, `<sold-out line>` and a line marked unavailable |
| active line | an active line |
| sold-out line | a line marked sold out |

| Field | Value |
| --- | --- |
| shared ui storybook url | The shared UI Storybook URL in the test environment; bind its URL only |

**Steps:**

1. Navigate to the Store/Cart/Blocks/CartDrawer Mixed Line States story at `<shared ui storybook url>`.
2. Look at the drawer body.
3. Look at the drawer title.

**Expected Results:**

* Step 2: `<active line>` and `<sold-out line>` show, the second marked sold out.
* Step 3: the count beside the drawer title reads `1`.

<!-- trace:case id=g10.shared-store-cart.TC-6tu rev=1 covers=g10.shared-store-cart.SC-9dd,g10.shared-store-cart.SC-dcr,g10.shared-store-cart.SC-utr,g10.shared-store-cart.SC-e4c,g10.shared-store-cart.SC-j31,g10.shared-store-cart.SC-xfz,g10.shared-store-cart.SC-62u,g10.shared-store-cart.SC-gx1,g10.shared-store-cart.SC-tou -->
### shared-ui-store-cart-US2-TC5-1: An empty cart without a description shows icon and title alone

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-02

**Pre-conditions:**

* The Empty State Without Description story renders a cart with no lines, loaded.
* The story's drawer copy supplies `<empty title>` and no empty description.

**Test data:**

| Field | Value |
| --- | --- |
| empty title | the story's empty-cart title |

| Field | Value |
| --- | --- |
| shared ui storybook url | The shared UI Storybook URL in the test environment; bind its URL only |

**Steps:**

1. Navigate to the Store/Cart/Blocks/CartDrawer Empty State Without Description story at `<shared ui storybook url>`.
2. Look at the drawer body.

**Expected Results:**

* Cart icon, then `<empty title>`.
* No line under the title, and no blank line in its place.
* No button in the body.

<!-- trace:case id=g10.shared-store-cart.TC-ze9 rev=1 covers=g10.shared-store-cart.SC-9dd,g10.shared-store-cart.SC-dcr,g10.shared-store-cart.SC-utr,g10.shared-store-cart.SC-e4c,g10.shared-store-cart.SC-j31,g10.shared-store-cart.SC-xfz,g10.shared-store-cart.SC-62u,g10.shared-store-cart.SC-gx1,g10.shared-store-cart.SC-tou -->
### shared-ui-store-cart-US2-TC6-1: A cart of only sold-out lines lists them, not the empty state

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
* **Trace:** shared-ui-store-cart-US-02

**Pre-conditions:**

* The Only Sold Out Lines story renders `<cart_2>`, loaded.

**Test data:**

| Field | Value |
| --- | --- |
| cart_2 | 2 lines, both sold out, none delisted |

| Field | Value |
| --- | --- |
| shared ui storybook url | The shared UI Storybook URL in the test environment; bind its URL only |

**Steps:**

1. Navigate to the Store/Cart/Blocks/CartDrawer Only Sold Out Lines story at `<shared ui storybook url>`.
2. Look at the drawer body.
3. Look at the drawer title and the footer.

**Expected Results:**

* Step 2: both lines show, each marked sold out.
* No empty state shows.
* Step 3: no count beside the drawer title.
* Footer shows the price summary and Checkout.

<!-- trace:case id=g10.shared-store-cart.TC-hqg rev=1 covers=g10.shared-store-cart.SC-9dd,g10.shared-store-cart.SC-dcr,g10.shared-store-cart.SC-utr,g10.shared-store-cart.SC-e4c,g10.shared-store-cart.SC-j31,g10.shared-store-cart.SC-xfz,g10.shared-store-cart.SC-62u,g10.shared-store-cart.SC-gx1,g10.shared-store-cart.SC-tou -->
### shared-ui-store-cart-US2-TC7-1: Removing the last line turns the drawer to the empty state

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
* **Trace:** shared-ui-store-cart-US-02

**Pre-conditions:**

* The Default story opens the drawer on `<cart_3>` and drops a line when its remove control is clicked.
* The story's drawer copy supplies `<empty title>`.

**Test data:**

| Field | Value |
| --- | --- |
| cart_3 | 2 active lines |
| empty title | the story's empty-cart title |

| Field | Value |
| --- | --- |
| shared ui storybook url | The shared UI Storybook URL in the test environment; bind its URL only |

**Steps:**

1. Navigate to the Store/Cart/Blocks/CartDrawer Default story at `<shared ui storybook url>`.
2. Click the remove control on each line in turn.
3. Look at the drawer body.
4. Look at the drawer title and below the body.

**Expected Results:**

* Step 3: no line shows; cart icon and `<empty title>` show.
* No placeholder row shows.
* Step 4: no count beside the drawer title, no footer.
* The drawer stays open.

<!-- trace:case id=g10.shared-store-cart.TC-bzg rev=1 covers=g10.shared-store-cart.SC-9dd,g10.shared-store-cart.SC-dcr,g10.shared-store-cart.SC-utr,g10.shared-store-cart.SC-e4c,g10.shared-store-cart.SC-j31,g10.shared-store-cart.SC-xfz,g10.shared-store-cart.SC-62u,g10.shared-store-cart.SC-gx1,g10.shared-store-cart.SC-tou -->
### shared-ui-store-cart-US2-TC8-1: The drawer body composed alone shows the empty state from its own copy

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
* **Trace:** shared-ui-store-cart-US-02

**Pre-conditions:**

* The Empty story supplies `<empty title>` and `<empty description>` on the body's own props, not through a drawer.

**Test data:**

| Field | Value |
| --- | --- |
| empty title | the story's empty-cart title |
| empty description | the story's line under that title |

| Field | Value |
| --- | --- |
| shared ui storybook url | The shared UI Storybook URL in the test environment; bind its URL only |

**Steps:**

1. Navigate to the Store/Cart/Blocks/CartDrawerBody Empty story at `<shared ui storybook url>`.
2. Look at the body.

**Expected Results:**

* Cart icon, then `<empty title>`, then `<empty description>`.
* No button, no item row, no placeholder row.

<!-- trace:case id=g10.shared-store-cart.TC-r4q rev=1 covers=g10.shared-store-cart.SC-3aw -->
### shared-ui-store-cart-US2-TC9-1: Supplied picture appears in the existing item frame

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-02

**Pre-conditions:**

* Controlled picture stories supply a served picture URL, an item name and the `<alt text>` for each `<composition>`.

**Test data:**

| `<composition>` | `<alt text>` | Item state |
| --- | --- | --- |
| CartItem alone | Card front | Available |
| CartDrawerBody | two spaces | Available |
| CartDrawer | Card front | Sold out |

| Field | Value |
| --- | --- |
| shared ui storybook url | The shared UI Storybook URL in the test environment; bind its URL only |

**Steps:**

1. Navigate to the `<composition>` picture story at `<shared ui storybook url>`.
2. Inspect the matching item's thumbnail image, its source and alt attribute.
3. Check that the served image completes loading with positive natural width.
4. Activate each available existing item action and inspect its callback record.

**Expected Results:**

* Step 2 shows the supplied picture in the existing thumbnail frame with the supplied URL and `<alt text>` unchanged.
* Step 3 reports a completed image with positive natural width.
* Step 4 preserves the existing callbacks. The sold-out row also keeps its existing sold-out treatment.

<!-- trace:case id=g10.shared-store-cart.TC-w8c rev=1 covers=g10.shared-store-cart.SC-p71 -->
### shared-ui-store-cart-US2-TC10-1: Missing alt text uses the item name

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-02

**Pre-conditions:**

* The CartItem missing-alt story supplies a picture and the item name Gengar VMAX in the existing layout.

**Test data:**

| `<alt text>` | `<expected alt>` |
| --- | --- |
| absent | Gengar VMAX |
| empty string | Gengar VMAX |

| Field | Value |
| --- | --- |
| shared ui storybook url | The shared UI Storybook URL in the test environment; bind its URL only |

**Steps:**

1. Navigate to the CartItem missing-alt story at `<shared ui storybook url>`.
2. Set `<alt text>` for this run.
3. Inspect the item picture, its alt attribute, copy and layout.

**Expected Results:**

* Step 3 still shows the supplied picture.
* Its alt attribute is `<expected alt>`.
* No new copy or layout appears.

<!-- trace:case id=g10.shared-store-cart.TC-y6p rev=1 covers=g10.shared-store-cart.SC-du1 -->
### shared-ui-store-cart-US2-TC11-1: Missing picture retains the existing placeholder

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
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-02

**Pre-conditions:**

* The CartItem no-picture story supplies an item name, quantity, price and an action callback.

**Test data:**

| `<image source>` |
| --- |
| omitted |
| empty string |

| Field | Value |
| --- | --- |
| shared ui storybook url | The shared UI Storybook URL in the test environment; bind its URL only |

**Steps:**

1. Navigate to the CartItem no-picture story at `<shared ui storybook url>` with `<image source>`.
2. Inspect the item's thumbnail frame and other supplied display facts.
3. Activate each available existing item action and inspect its callback record.
4. Inspect product requests and picture metadata in story storage before and after rendering.

**Expected Results:**

* Step 2 shows the existing picture placeholder with the supplied name, quantity and price unchanged.
* Step 3 preserves the existing callbacks.
* Step 4 shows no product request or stored picture metadata from the shared item.

<!-- trace:case id=g10.shared-store-cart.TC-k2v rev=1 -->
### shared-ui-store-cart-US2-TC12-1: Sold-out item retains picture and sold-out treatment

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
* **Trace:** shared-ui-store-cart-US-02

**Pre-conditions:**

* The CartItem sold-out picture story supplies a picture and sold-out status.

**Test data:**

| Field | Value |
| --- | --- |
| shared ui storybook url | The shared UI Storybook URL in the test environment; bind its URL only |

**Steps:**

1. Navigate to the CartItem sold-out picture story at `<shared ui storybook url>`.
2. Inspect the item row.

**Expected Results:**

* Step 2 shows the supplied picture in the thumbnail frame.
* The item keeps its existing sold-out treatment.

---

## shared-ui-store-cart-US3: Shopper opens the cart on current prices

**As a** shopper,
**I want** the drawer to read fresh product status and pricing when it opens,
showing skeletons while that read is in flight,
**so that** I decide against the current prices rather than stale ones.

<!-- trace:case id=g10.shared-store-cart.TC-vgm rev=2 covers=g10.shared-store-cart.SC-dvb,g10.shared-store-cart.SC-4pd,g10.shared-store-cart.SC-etj,g10.shared-store-cart.SC-25l -->
### shared-ui-store-cart-US3-TC1-2: Opening a cart with lines shows skeletons, never the empty state

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-03

**Pre-conditions:**

* The Loading With Lines story holds the drawer loading on a cart with lines and an applied promo code.

**Test data:**

| Field | Value |
| --- | --- |
| shared ui storybook url | The shared UI Storybook URL in the test environment; bind its URL only |

**Steps:**

1. Navigate to the Store/Cart/Blocks/CartDrawer Loading With Lines story at `<shared ui storybook url>`.
2. Look at the drawer body.
3. Look at the drawer title and the footer.

**Expected Results:**

* Step 2: line rows show as skeletons.
* No empty state and no placeholder row.
* Step 3: the count beside the drawer title, subtotal, discount and estimated total show as skeletons.
* Checkout is disabled.

<!-- trace:case id=g10.shared-store-cart.TC-8me rev=1 covers=g10.shared-store-cart.SC-dvb,g10.shared-store-cart.SC-4pd,g10.shared-store-cart.SC-etj,g10.shared-store-cart.SC-25l -->
### shared-ui-store-cart-US3-TC2-1: A cart with no lines opened while loading stays blank until the read ends

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
* **Trace:** shared-ui-store-cart-US-03

**Pre-conditions:**

* The Loading No Lines story holds the drawer loading on a cart with no lines.
* The story's drawer copy supplies `<empty title>`.

**Test data:**

| Field | Value |
| --- | --- |
| empty title | the story's empty-cart title |

| Field | Value |
| --- | --- |
| shared ui storybook url | The shared UI Storybook URL in the test environment; bind its URL only |

**Steps:**

1. Navigate to the Store/Cart/Blocks/CartDrawer Loading No Lines story at `<shared ui storybook url>`.
2. Look at the drawer body.
3. Look at the drawer title and below the body.
4. In the Controls panel, set `loading` to false.
5. Look at the drawer body and the drawer title.

**Expected Results:**

* Step 2: body is blank; no empty state, no row skeletons.
* Step 3: the count beside the drawer title shows as a skeleton; no footer.
* Step 5: cart icon and `<empty title>` show.
* No count beside the drawer title; still no footer.

<!-- trace:case id=g10.shared-store-cart.TC-fab rev=1 covers=g10.shared-store-cart.SC-dvb,g10.shared-store-cart.SC-4pd,g10.shared-store-cart.SC-etj,g10.shared-store-cart.SC-25l -->
### shared-ui-store-cart-US3-TC3-1: A cart whose first read fails stays loading, never empty

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
* **Trace:** shared-ui-store-cart-US-03

**Pre-conditions:**

* customer, signed in, whose cart holds at least one line, is on the Staging storefront with the drawer not yet opened.
* Network conditions are manipulated to fail the cart's read and its status-and-price check.

**Steps:**

1. Click the cart control in the site header.
2. Wait for the cart's read and its check to fail.
3. Look at the drawer body.
4. Look at the drawer title and below the body.

**Expected Results:**

* Step 1 opens the drawer.
* Step 3: body is blank; no empty state, no cart icon.
* Step 4: the count beside the drawer title shows as a skeleton; no footer.

<!-- trace:case id=g10.shared-store-cart.TC-0m3 rev=1 covers=g10.shared-store-cart.SC-dvb,g10.shared-store-cart.SC-4pd,g10.shared-store-cart.SC-etj,g10.shared-store-cart.SC-25l -->
### shared-ui-store-cart-US3-TC4-1: A cart read empty shows the empty state when its price check fails

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
* **Trace:** shared-ui-store-cart-US-03

**Pre-conditions:**

* customer, signed in, whose cart holds no line, is on the Staging storefront with the drawer not yet opened.
* Network conditions are manipulated to fail the cart's status-and-price check, and only that.

**Steps:**

1. Click the cart control in the site header.
2. Wait for the check to fail.
3. Look at the drawer body.
4. Look at the drawer title and below the body.

**Expected Results:**

* Step 3: cart icon and the empty-cart title show; the body is not blank.
* Step 4: no count beside the drawer title; no footer.

---

## shared-ui-store-cart-US4: Shopper dismisses the cart drawer

**As a** shopper,
**I want** to close the drawer from its close button, the backdrop, or the
Escape key, with the page behind it held still,
**so that** I can leave the cart without losing my place on the page beneath
it.

<!-- trace:case id=g10.shared-store-cart.TC-bj1 rev=1 covers=g10.shared-store-cart.SC-yb1 -->
### shared-ui-store-cart-US4-TC1-1: Backdrop or escape closes the drawer

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-04

**Pre-conditions:**
An open cart drawer.

**Steps:**

1. Open the cart drawer.
2. Click the backdrop overlay or press Escape.

**Expected Results:**

* The `onClose` callback is called.

---

## shared-ui-store-cart-US5: Shopper proceeds from the cart to checkout

**As a** shopper,
**I want** the checkout button to show it is redirecting while the
application creates the session,
**so that** I know the checkout is under way, and see the button return to
its label if it fails.

<!-- trace:case id=g10.shared-store-cart.TC-5qb rev=1 covers=g10.shared-store-cart.SC-ubk -->
### shared-ui-store-cart-US5-TC1-1: Checkout button shows redirecting and reports onCheckout

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-05

**Pre-conditions:**
An enabled checkout button.

**Steps:**

1. Open the cart drawer with at least one active item.
2. Activate the checkout button.

**Expected Results:**

* The button shows a loading state labeled with `checkoutRedirecting`.
* `onCheckout` is invoked.

---

## shared-ui-store-cart-US6: Shopper opens a cart that held a delisted product

**As a** shopper,
**I want** a product that left the catalogue to disappear after the drawer
finishes loading, with one toast,
**so that** I am not shown a sold-out row for something the store no longer
sells.

<!-- trace:case id=g10.shared-store-cart.TC-ea2 rev=1 covers=g10.shared-store-cart.SC-sol,g10.shared-store-cart.SC-0wv,g10.shared-store-cart.SC-fy2,g10.shared-store-cart.SC-jbs,g10.shared-store-cart.SC-pvs,g10.shared-store-cart.SC-psl -->
### shared-ui-store-cart-US6-TC1-1: Delisted items clear after loading with one toast

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-06

**Pre-conditions:**

* The Unavailable Items Removed story holds `<cart_6>` behind its Open Cart button; opening the drawer starts the status-and-price read.
* The read returns `<delisted line>` as no longer in the catalogue.

**Test data:**

| Field | Value |
| --- | --- |
| cart_6 | `<active line>` and `<delisted line>`, 1 each |
| active line | an active line |
| delisted line | a line the catalogue no longer sells |

| Field | Value |
| --- | --- |
| shared ui storybook url | The shared UI Storybook URL in the test environment; bind its URL only |

**Steps:**

1. Navigate to the Store/Cart/Blocks/CartDrawer Unavailable Items Removed story at `<shared ui storybook url>` and click Open Cart.
2. Wait until the skeletons clear.
3. Look at the drawer body.
4. Look at the toasts.

**Expected Results:**

* Step 3: `<delisted line>` does not show, not even sold out.
* `<active line>` still shows.
* Step 4: exactly one removal toast shows.

<!-- trace:case id=g10.shared-store-cart.TC-3oj rev=1 covers=g10.shared-store-cart.SC-sol,g10.shared-store-cart.SC-0wv,g10.shared-store-cart.SC-fy2,g10.shared-store-cart.SC-jbs,g10.shared-store-cart.SC-pvs,g10.shared-store-cart.SC-psl -->
### shared-ui-store-cart-US6-TC2-1: No unavailable items means no removal toast

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
* **Trace:** shared-ui-store-cart-US-06

**Pre-conditions:**

* The drawer opens on `<cart_7>`; opening it starts the status-and-price read.
* The read returns every line of `<cart_7>` as still in the catalogue.

**Test data:**

| Field | Value |
| --- | --- |
| cart_7 | 2 active lines, none delisted |

**Steps:**

1. Open the drawer on `<cart_7>`.
2. Wait until the skeletons clear.
3. Look at the drawer body and the toasts.
4. Look at the remove requests the drawer sent, in the story's Actions panel.

**Expected Results:**

* Step 3: both lines show.
* No removal toast shows.
* Step 4: no remove request.

<!-- trace:case id=g10.shared-store-cart.TC-kiq rev=1 covers=g10.shared-store-cart.SC-sol,g10.shared-store-cart.SC-0wv,g10.shared-store-cart.SC-fy2,g10.shared-store-cart.SC-jbs,g10.shared-store-cart.SC-pvs,g10.shared-store-cart.SC-psl -->
### shared-ui-store-cart-US6-TC3-1: Status values and toast copy are the named contract

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-ui-store-cart-US-06

**Pre-conditions:**

* None.

**Steps:**

1. Assign `CartItemStatus` on a cart line.
2. Supply `CartDrawerCopy`.

**Expected Results:**

* Allowed status values are only `default`, `adjusted`, `soldOut`, and `unavailable`.
* The copy includes `unavailableItemsRemoved`.

<!-- trace:case id=g10.shared-store-cart.TC-ulg rev=1 covers=g10.shared-store-cart.SC-sol,g10.shared-store-cart.SC-0wv,g10.shared-store-cart.SC-fy2,g10.shared-store-cart.SC-jbs,g10.shared-store-cart.SC-pvs,g10.shared-store-cart.SC-psl -->
### shared-ui-store-cart-US6-TC4-1: A cart of only delisted lines ends on the empty state

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
* **Trace:** shared-ui-store-cart-US-06

**Pre-conditions:**

* The Only Delisted Lines story holds `<cart_4>` behind its Open Cart button; opening the drawer starts the status-and-price read.
* The read returns every line of `<cart_4>` as no longer in the catalogue.
* The story's drawer copy supplies `<empty title>`.

**Test data:**

| Field | Value |
| --- | --- |
| cart_4 | 2 lines, both delisted |
| empty title | the story's empty-cart title |

| Field | Value |
| --- | --- |
| shared ui storybook url | The shared UI Storybook URL in the test environment; bind its URL only |

**Steps:**

1. Navigate to the Store/Cart/Blocks/CartDrawer Only Delisted Lines story at `<shared ui storybook url>` and click Open Cart.
2. Wait until the skeletons clear.
3. Look at the drawer body.
4. Look at the drawer title, below the body, and the toasts.

**Expected Results:**

* Step 3: no line of `<cart_4>` shows, not even sold out.
* Cart icon and `<empty title>` show.
* Step 4: no count beside the drawer title, no footer.
* Exactly one removal toast shows.

<!-- trace:case id=g10.shared-store-cart.TC-s82 rev=1 covers=g10.shared-store-cart.SC-sol,g10.shared-store-cart.SC-0wv,g10.shared-store-cart.SC-fy2,g10.shared-store-cart.SC-jbs,g10.shared-store-cart.SC-pvs,g10.shared-store-cart.SC-psl -->
### shared-ui-store-cart-US6-TC5-1: Delisted lines beside only sold-out lines leave a sold-out cart, not an empty one

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
* **Trace:** shared-ui-store-cart-US-06

**Pre-conditions:**

* The drawer opens on `<cart_8>`; opening it starts the status-and-price read.
* The read returns `<delisted line>` as no longer in the catalogue and `<sold-out line>` as sold out.

**Test data:**

| Field | Value |
| --- | --- |
| cart_8 | `<delisted line>` and `<sold-out line>`, 1 each, no active line |
| delisted line | a line the catalogue no longer sells |
| sold-out line | a line still in the catalogue, sold out |

**Steps:**

1. Open the drawer on `<cart_8>`.
2. Wait until the skeletons clear.
3. Look at the drawer body.
4. Look at the drawer title, the footer and the toasts.

**Expected Results:**

* Step 3: `<sold-out line>` shows, marked sold out.
* `<delisted line>` does not show.
* No empty state shows.
* Step 4: no count beside the drawer title.
* Footer shows the price summary and Checkout.
* Exactly one removal toast shows.

<!-- trace:case id=g10.shared-store-cart.TC-kad rev=1 covers=g10.shared-store-cart.SC-sol,g10.shared-store-cart.SC-0wv,g10.shared-store-cart.SC-fy2,g10.shared-store-cart.SC-jbs,g10.shared-store-cart.SC-pvs,g10.shared-store-cart.SC-psl -->
### shared-ui-store-cart-US6-TC6-1: An unavailable line the application still passes shows in neither the rows nor the count

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
* **Trace:** shared-ui-store-cart-US-06

**Pre-conditions:**

* The Mixed Line States story renders `<cart_9>`, loaded, and keeps every line when the drawer asks to remove one.

**Test data:**

| Field | Value |
| --- | --- |
| cart_9 | `<active line>`, `<sold-out line>` and `<delisted line>` |
| active line | an active line |
| sold-out line | a line marked sold out |
| delisted line | a line marked unavailable |

| Field | Value |
| --- | --- |
| shared ui storybook url | The shared UI Storybook URL in the test environment; bind its URL only |

**Steps:**

1. Navigate to the Store/Cart/Blocks/CartDrawer Mixed Line States story at `<shared ui storybook url>`.
2. Look at the drawer body.
3. Look at the drawer title.

**Expected Results:**

* Step 2: `<active line>` and `<sold-out line>` show, the second marked sold out.
* `<delisted line>` does not show.
* Step 3: the count beside the drawer title reads `1`.

---

## shared-ui-store-cart-US7: Shopper edits a low-stock line and the warning quiets

**As a** shopper,
**I want** the low-stock warning to hide after I change that line's quantity,
**so that** it does not keep shouting after I have acted, and it returns if the line is adjusted again.

<!-- trace:case id=g10.shared-store-cart.TC-hzl rev=1 covers=g10.shared-store-cart.SC-8f7,g10.shared-store-cart.SC-lju,g10.shared-store-cart.SC-7il -->
### shared-ui-store-cart-US7-TC1-1: Adjusted line shows the low-stock warning

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-07

**Pre-conditions:**
A cart line with status `adjusted`.

**Steps:**

1. Open the cart drawer.
2. Check that line.

**Expected Results:**

* The low-stock warning copy is visible.

<!-- trace:case id=g10.shared-store-cart.TC-69y rev=1 covers=g10.shared-store-cart.SC-8f7,g10.shared-store-cart.SC-lju,g10.shared-store-cart.SC-7il -->
### shared-ui-store-cart-US7-TC2-1: Quantity change hides the warning

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-07

**Pre-conditions:**
A cart line with status `adjusted` showing the low-stock warning. The stepper can change quantity without removing the line.

**Steps:**

1. Open the cart drawer.
2. Change that line's quantity.

**Expected Results:**

* The low-stock warning is no longer visible.
* `onQuantityChange` is invoked with the new quantity.

<!-- trace:case id=g10.shared-store-cart.TC-g4w rev=1 covers=g10.shared-store-cart.SC-8f7,g10.shared-store-cart.SC-lju,g10.shared-store-cart.SC-7il -->
### shared-ui-store-cart-US7-TC3-1: Warning returns when the line is adjusted again

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-ui-store-cart-US-07

**Pre-conditions:**
A cart line that was `adjusted` and whose warning was hidden after a quantity change.

**Steps:**

1. Change the line's status so it is not `adjusted`.
2. Change the line's status to `adjusted` again.
3. Check that line.

**Expected Results:**

* The low-stock warning is visible again.

---

## shared-ui-store-cart-US8: Shopper raises a line to the last unit the shop has

**As a** shopper,
**I want** a line's stepper to stop where the shop runs out, and the line to
say how many are left,
**so that** I am not still raising a number the checkout will quietly put back
down.

<!-- trace:case id=g10.shared-store-cart.TC-uob rev=1 covers=g10.shared-store-cart.SC-zdl,g10.shared-store-cart.SC-27k,g10.shared-store-cart.SC-38a,g10.shared-store-cart.SC-0n8,g10.shared-store-cart.SC-pvg -->
### shared-ui-store-cart-US8-TC1-1: Stepper stops at the maximum and still counts down

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-08

**Pre-conditions:**

* customer is on the cart drawer, holding `<line_1>`.
* `<line_1>` is supplied with a quantity of `<line quantity>` and a maximum of `<line maximum>`.

**Test data:**

| Field | Value |
| --- | --- |
| line_1 | A cart line whose supplied quantity equals its supplied maximum |
| line quantity | 2 |
| line maximum | 2 |

**Steps:**

1. Activate `<line_1>`'s increment control.
2. Activate `<line_1>`'s decrement control.

**Expected Results:**

* Step 1 invokes no `onQuantityChange`.
* The increment control is inoperable and announced as unavailable.
* Step 2 invokes `onQuantityChange` with `<line quantity>` less one.

<!-- trace:case id=g10.shared-store-cart.TC-tpg rev=1 covers=g10.shared-store-cart.SC-zdl,g10.shared-store-cart.SC-27k,g10.shared-store-cart.SC-38a,g10.shared-store-cart.SC-0n8,g10.shared-store-cart.SC-pvg -->
### shared-ui-store-cart-US8-TC2-1: Line supplied no maximum counts on

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
* **Trace:** shared-ui-store-cart-US-08

**Pre-conditions:**

* customer is on the cart drawer, holding `<line_2>`.
* `<line_2>` is supplied with a quantity of `<line quantity>` and no maximum.

**Test data:**

| Field | Value |
| --- | --- |
| line_2 | A cart line supplied with no maximum |
| line quantity | 2 |

**Steps:**

1. Activate `<line_2>`'s increment control.

**Expected Results:**

* `onQuantityChange` is invoked with `<line quantity>` plus one.

<!-- trace:case id=g10.shared-store-cart.TC-0lh rev=1 covers=g10.shared-store-cart.SC-zdl,g10.shared-store-cart.SC-27k,g10.shared-store-cart.SC-38a,g10.shared-store-cart.SC-0n8,g10.shared-store-cart.SC-pvg -->
### shared-ui-store-cart-US8-TC3-1: Remaining count is displayed only where supplied

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
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-08

**Pre-conditions:**

* customer has `<line>` in the cart, supplied with remaining-count content `<remaining count>`.

**Test data:**

| `<line>` | `<remaining count>` | `<expected line display>` |
| --- | --- | --- |
| `<line_3>` | `Only 2 left` | `Only 2 left`, and no other remaining-count copy |
| `<line_4>` | none | no remaining count |

| Field | Value |
| --- | --- |
| line_3 | The cart line with the remaining-count fixture in its data row; bind its line identity only |
| line_4 | The cart line with the remaining-count fixture in its data row; bind its line identity only |

**Steps:**

1. Open the cart drawer.
2. Read `<line>`.

**Expected Results:**

* The line displays `<expected line display>`.
* Nothing else on the line says what is left.

---

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
| sale price | The line's price the story supplies, the price after the site sale |
| list price | The line's list price the story supplies, above `<sale price>` |

| Field | Value |
| --- | --- |
| grade10 ui workbench url | The Grade10 UI workbench URL in the test environment; bind its URL only |

**Steps:**

1. Open the Store Cart / CartItem / Sale Price story at `<grade10 ui workbench url>`.
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
| sale line | Each line the site sale cuts: price `<sale price>`, the price of one, list price `<list price>` above it |
| full price line | A line the site sale does not cut: price `<full price>`, no list price supplied |
| sold-out line | A line the shop no longer sells, marked sold out |
| unavailable line | A line whose product the shop has delisted |
| subtotal | Each line's price times its quantity, added up over every line but a sold-out or unavailable one |

| Field | Value |
| --- | --- |
| full price | The price supplied for the full-price line, with no list price; bind its currency amount only |
| grade10 ui workbench url | The Grade10 UI workbench URL in the test environment; bind its URL only |
| list price | The list price supplied for the fixture’s sale line, above its sale price unless the pre-conditions state equality; bind its currency amount only |
| sale price | The sale price supplied for the fixture’s sale line; bind its currency amount only |

**Steps:**

1. Open the Store Cart / CartDrawer / Auto Discount / On Sale story at `<grade10 ui workbench url>`.
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
| price | The line's price the story supplies |
| list price | The line's list price the story supplies, equal to `<price>` |

| Field | Value |
| --- | --- |
| grade10 ui workbench url | The Grade10 UI workbench URL in the test environment; bind its URL only |

**Steps:**

1. Open the Store Cart / CartItem / Equal List Price story at `<grade10 ui workbench url>`.
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
| sale line | Each line the story puts on the site sale: price `<sale price>`, list price `<list price>` above it |
| stacking code | The held code the story lets stack on the site sale |
| code discount | The amount the story supplies for `<stacking code>` |
| subtotal | Each line's price times its quantity, added up over every line but a sold-out or unavailable one |

| Field | Value |
| --- | --- |
| grade10 ui workbench url | The Grade10 UI workbench URL in the test environment; bind its URL only |
| list price | The list price supplied for the fixture’s sale line, above its sale price unless the pre-conditions state equality; bind its currency amount only |
| sale price | The sale price supplied for the fixture’s sale line; bind its currency amount only |

**Steps:**

1. Open the Store Cart / CartDrawer / Auto Discount / Stack story at `<grade10 ui workbench url>`.
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
| sale line | Each line the story puts on the site sale: price `<sale price>`, list price `<list price>` above it |
| refused code | The code the story refuses on the site sale |
| refusal reason | The sentence the story supplies for refusing the typed `<refused code>`, unlike any held ticket's reason: `This promo code cannot stack on the site sale` |
| subtotal | Each line's price times its quantity, added up over every line but a sold-out or unavailable one |
| total before | The footer's total before the attempt |

| Field | Value |
| --- | --- |
| grade10 ui workbench url | The Grade10 UI workbench URL in the test environment; bind its URL only |
| list price | The list price supplied for the fixture’s sale line, above its sale price unless the pre-conditions state equality; bind its currency amount only |
| sale price | The sale price supplied for the fixture’s sale line; bind its currency amount only |

**Steps:**

1. Open the Store Cart / CartDrawer / Auto Discount / Refuse story at `<grade10 ui workbench url>`.
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
| inapplicable reason | The reason the story supplies for the code not applying |

| Field | Value |
| --- | --- |
| grade10 ui workbench url | The Grade10 UI workbench URL in the test environment; bind its URL only |

**Steps:**

1. Open the Store Cart / PromoTicket / Not Applicable story at `<grade10 ui workbench url>`.
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
| applicable code | A held code that can apply on this cart |
| inapplicable code | A held code that cannot apply on this cart, with `<inapplicable reason>` |

| Field | Value |
| --- | --- |
| grade10 ui workbench url | The Grade10 UI workbench URL in the test environment; bind its URL only |
| inapplicable reason | The supplied reason for `<inapplicable code>` not applying to this cart; bind its text only |

**Steps:**

1. Open the Store Cart / CartDrawer / Auto Discount / Refuse story at `<grade10 ui workbench url>`.
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
| sale line | Each line the story puts on the site sale: price `<sale price>`, list price `<list price>` above it |
| picked code | A held code listed with its Apply control, which the site sale refuses |
| refusal reason | The sentence the story's quote supplies for refusing `<picked code>`, unlike the reason any held ticket shows before the attempt: `This promo code cannot stack on the site sale` |
| subtotal | Each line's price times its quantity, added up over every line but a sold-out or unavailable one |
| total before | The footer's total before the attempt |

| Field | Value |
| --- | --- |
| grade10 ui workbench url | The Grade10 UI workbench URL in the test environment; bind its URL only |
| list price | The list price supplied for the fixture’s sale line, above its sale price unless the pre-conditions state equality; bind its currency amount only |
| sale price | The sale price supplied for the fixture’s sale line; bind its currency amount only |

**Steps:**

1. Open the Store Cart / CartDrawer / Auto Discount / Refuse story at `<grade10 ui workbench url>`.
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
| replaced line | A line the code took the site sale from: price `<list price A>`, no list price supplied |
| kept sale line | A line the code left on the site sale: price `<sale price B>`, list price `<list price B>` above it |
| code discount | The amount the story supplies for the replacing code |
| subtotal | Each line's price times its quantity, added up over every line but a sold-out or unavailable one |

| Field | Value |
| --- | --- |
| grade10 ui workbench url | The Grade10 UI workbench URL in the test environment; bind its URL only |
| list price A | The full list price supplied for `<replaced line>` after its sale is replaced; bind its currency amount only |
| list price B | The higher list price supplied for `<kept sale line>`; bind its currency amount only |
| sale price B | The sale price supplied for `<kept sale line>`; bind its currency amount only |

**Steps:**

1. Open the Store Cart / CartDrawer / Auto Discount / Replace story at `<grade10 ui workbench url>`.
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
| replaced line | Each line the code took the site sale from: list price `<list price>`, sale price `<sale price>` below it |
| subtotal after | Each line's price times its quantity, added up over every line but a sold-out or unavailable one, after the removal |

| Field | Value |
| --- | --- |
| grade10 ui workbench url | The Grade10 UI workbench URL in the test environment; bind its URL only |
| list price | The list price supplied for the fixture’s sale line, above its sale price unless the pre-conditions state equality; bind its currency amount only |
| sale price | The sale price supplied for the fixture’s sale line; bind its currency amount only |

**Steps:**

1. Open the Store Cart / CartDrawer / Auto Discount / Fallback after remove story at `<grade10 ui workbench url>`.
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
| sale line | Each line on the site sale: price `<sale price>`, list price `<list price>` above it |
| stacking code | The held code the story lets stack on the site sale |
| subtotal | Each line's price times its quantity, added up over every line but a sold-out or unavailable one |

| Field | Value |
| --- | --- |
| grade10 ui workbench url | The Grade10 UI workbench URL in the test environment; bind its URL only |
| list price | The list price supplied for the fixture’s sale line, above its sale price unless the pre-conditions state equality; bind its currency amount only |
| sale price | The sale price supplied for the fixture’s sale line; bind its currency amount only |

**Steps:**

1. Open the Store Cart / CartDrawer / Auto Discount / Stack story at `<grade10 ui workbench url>`.
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

---

## shared-ui-store-cart-US19: Shopper waits for an accepted tender choice

**As a** shopper,
**I want** accepted figures held while tender finishes,
**so that** I cannot submit conflicting changes or continue unresolved.

<!-- trace:case id=g10.shared-store-cart.TC-cxw rev=1 covers=g10.shared-store-cart.SC-9yi,g10.shared-store-cart.SC-nty,g10.shared-store-cart.SC-x24 -->
### shared-ui-store-cart-US19-TC1-1: Pending tender blocks every entry point

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
* **Trace:** shared-ui-store-cart-US-19

**Pre-conditions:**

* A consumer supplies the existing drawer content and optional action callbacks.

**Steps:**

1. Open the full-drawer and standalone-footer stories with draft points 120, accepted total and selected code. Exercise both applied and unapplied points and an already-open promo sheet. Set tenderPending true and attempt click and Enter on every tender action and Checkout.

**Expected Results:**

* Points and promo inputs, Apply, Use max, both Remove actions, held-code selection and Checkout are disabled and invoke no callbacks. Accepted figures and draft 120 persist.

<!-- trace:case id=g10.shared-store-cart.TC-sxg rev=1 covers=g10.shared-store-cart.SC-9yi,g10.shared-store-cart.SC-nty,g10.shared-store-cart.SC-x24 -->
### shared-ui-store-cart-US19-TC2-1: Clearing pending restores guarded availability

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
* **Trace:** shared-ui-store-cart-US-19

**Pre-conditions:**

* A consumer supplies the existing drawer content and optional action callbacks.

**Steps:**

1. Clear tenderPending on the same surfaces and attempt actions with supplied or absent callbacks, invalid code and zero input.

**Expected Results:**

* Clearing itself invokes no callbacks. Existing callback-presence and validation constraints still apply. Available actions work; draft and accepted figures stay unchanged.

<!-- trace:case id=g10.shared-store-cart.TC-swe rev=1 covers=g10.shared-store-cart.SC-9yi,g10.shared-store-cart.SC-nty,g10.shared-store-cart.SC-x24 -->
### shared-ui-store-cart-US19-TC3-1: Omitting pending preserves consumer behavior

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
* **Trace:** shared-ui-store-cart-US-19

**Pre-conditions:**

* A consumer supplies the existing drawer content and optional action callbacks.

**Steps:**

1. Open the full-drawer and standalone-footer stories with tenderPending omitted and false, in interactive, read-only, verifying, redirecting, loading and checkoutDisabled states.

**Expected Results:**

* Existing appearance and availability remain. Explicit false overrides none of the existing disabled reasons.

<!-- trace:case id=g10.shared-store-cart.TC-ja3 rev=1 covers=g10.shared-store-cart.SC-pxz -->
### shared.ui-store-cart.US19-TC4: Pending blocks item, tender and navigation controls

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
* **Trace:** shared.ui-store-cart.US19

**Pre-conditions:**

* The tester is on the shared `<surface>` fixture.
* `<drawer>` is open with the consumer pending input false.
* Each action is otherwise available in its `<points_state>` row.

**Test data:**

| Field | Value |
| --- | --- |
| drawer | Controlled shared drawer with an active line, editable quantity, accepted figures, points draft and selected promo code; each listed callback supplied and recorded |
| points_state | Applied points with Remove; unapplied points with Apply and Use max, run separately |
| item_actions | Quantity decrease, quantity increase, line removal and product link |
| tender_actions | Existing points input, points disclosure, Apply, Use max, points Remove, promo disclosure and selected-code Remove |
| navigation_actions | Existing account or loyalty link and Checkout |
| surface | Compound drawer; standalone body, item and footer with the same applicable inputs and callbacks, run separately |

**Steps:**

1. Record the visible accepted figures and entered points.
2. Set the consumer pending input true.
3. Attempt `<item_actions>`, `<tender_actions>` and `<navigation_actions>` with the pointer.
4. Attempt each listed action with Enter and Space, including Enter and value changes in an input.
5. Inspect the displayed values and callback record.

**Expected Results:**

* Item, tender and navigation actions are disabled while pending.
* The points input cannot change its entered value.
* Quantity, selected code and accepted figures remain unchanged.
* No listed action invokes its callback.
* Disclosures remain closed; links and Checkout start no navigation.

<!-- trace:case id=g10.shared-store-cart.TC-cpt rev=1 covers=g10.shared-store-cart.SC-xrx -->
### shared.ui-store-cart.US19-TC5: Pending protects editing in an open promo sheet

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
* **Trace:** shared.ui-store-cart.US19

**Pre-conditions:**

* The tester is on the shared `<surface>` fixture.
* `<promo_sheet>` is open with the consumer pending input false.
* Each `<sheet_actions>` control is otherwise available.

**Test data:**

| Field | Value |
| --- | --- |
| promo_sheet | Existing open promo sheet with an entered code, eligible held codes and enough content to scroll; supplied callbacks recorded |
| sheet_actions | Promo input, typed-code Apply, held-code selection and loyalty link |
| surface | Nested promo sheet; standalone public promo sheet, run separately |
| dismissal | Existing Back or close control, sheet backdrop click and Escape, run separately |

**Steps:**

1. Record the entered code and accepted drawer figures.
2. Set the consumer pending input true.
3. Attempt each sheet action with the pointer.
4. Attempt each sheet action with the keyboard.
5. Scroll the sheet content.
6. Use `<dismissal>`.

**Expected Results:**

* The promo input cannot change its entered code.
* Apply, held-code selection and the loyalty link remain disabled.
* No sheet action invokes its callback.
* Entered code and accepted figures remain unchanged.
* The sheet content scrolls while pending.
* Each dismissal route closes the existing sheet.

<!-- trace:case id=g10.shared-store-cart.TC-d72 rev=1 covers=g10.shared-store-cart.SC-mxv -->
### shared.ui-store-cart.US19-TC6: Pending allows reading, scrolling and drawer dismissal

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
* **Trace:** shared-ui-store-cart-US-04

**Pre-conditions:**

* The tester is on the shared drawer fixture.
* `<drawer>` has its consumer pending input true and `<sheet>` state.

**Test data:**

| Field | Value |
| --- | --- |
| drawer | Open shared drawer with accepted cart content exceeding its viewport and recorded action and dismissal callbacks |
| dismissal | Drawer Close, drawer backdrop click and Escape, run separately |
| sheet | Promo sheet closed; promo sheet open with recorded state proposals and a focused opener, run separately |

**Steps:**

1. Read the visible cart content.
2. Scroll the drawer to its remaining lines.
3. If the sheet is open, scroll it and use Back, backdrop or Escape to dismiss it.
4. Inspect the sheet state proposal and focus after dismissal.
5. Use `<dismissal>` on the drawer.
6. Inspect the dismissal and action callback records.

**Expected Results:**

* Accepted cart content remains readable while pending.
* The drawer content scrolls while pending.
* An open sheet remains readable and scrollable; Back, backdrop and Escape close it first, leave the drawer open and restore focus to its opener.
* Sheet dismissal emits the collapsed-state proposal once; no edit or opening proposal runs.
* Each dismissal route closes the drawer.
* Dismissal invokes its callback once.
* No item, tender or navigation callback runs through dismissal.

<!-- trace:case id=g10.shared-store-cart.TC-wh7 rev=1 covers=g10.shared-store-cart.SC-rb9 -->
### shared.ui-store-cart.US19-TC7: Pending stops a delayed removal before dispatch

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared.ui-store-cart.US19

**Pre-conditions:**

* The shared item fixture holds an active row with a recorded removal callback.
* Removal uses its existing animation; its callback can be delayed.
* interactionPending is false.

**Steps:**

1. Activate item removal.
2. Set interactionPending true before the delayed callback dispatches.
3. Advance beyond the removal delay and inspect the row and callback record.
4. Clear interactionPending and inspect the row and callback record again.

**Expected Results:**

* Pending invokes no removal callback and the retained row leaves its removal animation.
* Clearing pending leaves the item present and invokes no removal callback automatically.

---

## shared.ui-store-cart.US20: Shopper resumes after the drawer receives an answer

**As a** shopper whose drawer is no longer waiting,
**I want** only currently available actions to return without repeating an earlier action,
**so that** I decide what happens next from the accepted cart or its failure feedback.

<!-- trace:case id=g10.shared-store-cart.TC-wru rev=1 covers=g10.shared-store-cart.SC-fct -->
### shared.ui-store-cart.US20-TC1: Clearing pending restores only currently permitted actions

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
* **Trace:** shared.ui-store-cart.US20

**Pre-conditions:**

* The tester is on the shared drawer fixture.
* `<drawer>` is open with the consumer pending input true.
* The consumer supplies availability `<available>`, quantity constraint `<quantity_limit>` and unavailable-action setup `<unavailable_action>`.
* Pointer and keyboard attempts on actions while pending have invoked no callbacks.


* The restored fixture supplies `<available>`.
**Test data:**

| Field | Value |
| --- | --- |
| drawer | Controlled shared drawer with accepted figures, entered values and recorded callbacks |
| available | Supplied item, tender and navigation callbacks; editable quantity and valid tender inputs |
| quantity_limit | An active line at its consumer-supplied maximum; decrease permitted |
| unavailable_action | Missing action callback, invalid promo code, zero points, or existing loading, verifying, redirecting or checkout-disabled state; run each relevant control separately |
| legacy_pending | Existing tenderPending true when the consumer pending input clears |

**Steps:**

1. Record accepted figures, entered values and callback counts.
2. Set the consumer pending input false.
3. Inspect values, callbacks and action availability.
4. Attempt the blocked actions in `<unavailable_action>` by pointer and keyboard.
5. Activate each currently permitted action separately.
6. Inspect callback counts after each activation.

**Expected Results:**

* Clearing pending invokes no action callback.
* Accepted figures and entered values persist until explicit interaction.
* Each `<unavailable_action>` remains unavailable and invokes no callback.
* At `<quantity_limit>`, increase stays disabled; decrease becomes available.
* With `<legacy_pending>`, tender actions and Checkout remain disabled.
* Each currently permitted action invokes its callback once when activated.

<!-- trace:case id=g10.shared-store-cart.TC-r4f rev=1 covers=g10.shared-store-cart.SC-2h3 -->
### shared.ui-store-cart.US20-TC2: Omitted interaction state preserves existing consumers

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
* **Trace:** shared.ui-store-cart.US20

**Pre-conditions:**

* The consumer supplies the existing display values and applicable action callbacks.
* Each surface is otherwise interactive, with existing loading, verification, redirecting and callback-presence guards available for the relevant rows.

**Test data:**

| `<interaction_pending>` | `<tender_pending>` | `<surface>` |
| --- | --- | --- |
| omitted | false | Compound drawer |
| false | false | Compound drawer and standalone body, item, footer and promo sheet where applicable |
| omitted | true | Compound drawer and standalone footer or promo sheet where applicable |
| false | true | Compound drawer and standalone footer or promo sheet where applicable |

**Steps:**

1. Render the `<surface>` with the `<interaction_pending>` and `<tender_pending>` values.
2. Inspect the existing layout, accepted figures, entered values and action availability.
3. Attempt item, tender, disclosure, navigation and Checkout actions that the row supports.
4. Activate one action that remains permitted by the supplied existing guards for `<surface>`.
5. Inspect callback records and displayed values.

**Expected Results:**

* Omitted or false `interactionPending` preserves the existing layout, loading presentation and callback-gated availability.
* `tenderPending` true still disables tender actions and Checkout without newly disabling otherwise-permitted item controls.
* Existing loading, verification, redirecting, checkout-disabled and missing-callback guards remain effective.
* No blocked action invokes a callback, and no displayed value changes without an explicit permitted action.
* The permitted action invokes its existing callback once.

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

- **Folded** - each case agrees with the scenario it reaches: US2-TC1-2 walks `shared-ui-store-cart-SC-23` at two lines and one, and `shared-ui-store-cart-SC-50` at two lines with one raised to 3 units, US2-TC2-2 `shared-ui-store-cart-SC-24`, US2-TC3-2 `shared-ui-store-cart-SC-25`, US2-TC4-1 `shared-ui-store-cart-SC-05`, US2-TC5-1 `shared-ui-store-cart-SC-41`, US3-TC1-2 `shared-ui-store-cart-SC-08`, US3-TC2-1 `shared-ui-store-cart-SC-40` and then `shared-ui-store-cart-SC-25` once the read ends, US3-TC3-1 `shared-ui-store-cart-SC-48`, US3-TC4-1 `shared-ui-store-cart-SC-51`, US6-TC4-1 `shared-ui-store-cart-SC-42` and US6-TC6-1 `shared-ui-store-cart-SC-49`
- **Folded, edge fade** - US2-TC1-2 and US2-TC2-2 see the fade only at an edge with more lines past it. The durable `shared-ui-store-cart-SC-07` states the `scroll-fade` class; the fade by edge is how the design-system utility draws it, so no scenario is owed
- **Folded, body alone** - US2-TC8-1 walks `shared-ui-store-cart-SC-44`. That scenario serves US-02, not the `Drawer export contract` group: what it proves is the empty state a shopper sees, and no case traces the group, so the fold would have left it untraced
- **Folded as a route** - US2-TC7-1 reaches `shared-ui-store-cart-SC-25` by removing the last line rather than by opening an empty cart, and US6-TC5-1 joins `shared-ui-store-cart-SC-42`'s cleanup to `shared-ui-store-cart-SC-45`'s sold-out cart. The drawer derives both from the lines it is given on every render, so no scenario is owed. US2-TC7-1's drawer staying open follows from the dismissal requirement: the drawer closes only by its close control, the backdrop or Escape
- **Raised, landed, folded** - US2-TC6-1 asked what a cart of only sold-out lines shows (R3). A sold-out line stays visible, the badge draws only a positive count, and the footer follows the listed lines. Q8 records it, `shared-ui-store-cart-SC-45` states it, and the badge requirement shows no badge at a count of 0
- **Raised, landed** - US3-TC2-1's blank body asked what a failed first read shows (R4). Q9 has the consumer hold `loading` until it has read the lines, stated as `shared-ui-store-cart-SC-48`. US3-TC2-1 walks what the drawer shows while the consumer holds `loading`, US3-TC3-1 walks the Grade10 host holding it when both first reads fail, and the host tests of group 2 prove it, since the block cannot tell an unread cart from an empty one. Once that read has failed, the drawer keeps the loading treatment (Q14), which US3-TC3-1 expects
- **Raised, landed, folded** - QA1 asked whether a cart read empty whose price check fails is read or unchecked (R5). Its lines are loaded and there are none, so it is read (Q11): the unread-cart clause ends `loading` on it, `shared-ui-store-cart-SC-51` states it, US3-TC4-1 walks it and a third host test of group 2 proves it. The page's Not read yet line said `checked` where it meant `read`; it now says a cart read empty shows the empty state
- **Raised, landed, folded** - QA1 asked whether a line of 3 units counts 3 or 1 (R6). The count is one per line, as the block counts and as `nav-cart-count-badge` counts the site header's cart (Q12): the badge requirement says so, `shared-ui-store-cart-SC-50` states it, and US2-TC1-2 gains the row that raises a line to 3 units. The Background line holding every counted line at 1 unit is gone, and the page's count line no longer reads as units
- **Rejected in part** - US3-TC3-1 expected the host's toast with Retry and no line named. No scenario of this capability states that toast; Cart Validation owns it (`docs/prds/products/grade10-site/store/cart-validation.md`), so the case keeps only what `shared-ui-store-cart-SC-48` states
- **Corrected** - US3-TC1-2 walks the Loading With Lines story, which holds `loading` and applies a promo code, so every skeleton it expects is there to see; the timed Fetching On Open story ends its read before a tester can look, and applies no promo. US3-TC2-1 walks the Loading No Lines story and ends the read by setting `loading` to false in the Controls panel, for the same reason. US2-TC4-1, US2-TC5-1, US2-TC6-1, US6-TC4-1 and US6-TC6-1 walk the stories group 1 adds for their carts, and US2-TC1-2 and US2-TC7-1 walk `Default`, whose 2 lines are `shared-ui-store-cart-SC-23`'s own and whose stepper and remove control reach every row of US2-TC1-2, so a tester builds no cart by hand. `Default` copies its lines into its own state once, so the Background sends Controls panel steps only to stories that pass their args to the drawer
- **Corrected, signed in** - US3-TC3-1 now walks a signed-in customer, as US3-TC4-1 does. A guest's cart is read from the browser, not the network (`packages/grade10-store/frontend/src/features/orders/cart/data/repositories/CartRepositoryImpl.ts:46-53` in the Grade10 repository), so failing the network cannot fail a guest's first read
- **Corrected, reachable** - US6-TC1-1 walks the Unavailable Items Removed story, whose cart is its `<cart_6>`. It no longer reads the remove request in the Actions panel: the story handles `onRemoveItem` itself, so the panel records none, and the drawer hides an unavailable line whether or not it is removed (`shared-ui-store-cart-SC-49`). The Grade10 host test citing `shared-ui-store-cart-SC-10` proves the request (`apps/frontend/grade10/src/chrome/CartDrawer.test.tsx:811` in the Grade10 repository). US6-TC5-1's cart has no story and only a mocked read reaches it, so it plans `automation` alone, as US6-TC2-1 does
- **Contradicted** - none
- **Uncovered anchors** - none. US-02, US-03 and US-06 each have cases. The `Drawer export contract` group is served only by `shared-ui-store-cart-SC-01`, `shared-ui-store-cart-SC-22` and `shared-ui-store-cart-SC-43`, Out of suite and proven by the package's public-entry test and `pnpm run typecheck`. `shared-ui-store-cart-SC-13` stays walked by US6-TC3-1
- **Revised in place** - US2-TC1, US2-TC2, US2-TC3 and US3-TC1 move to revision 2 and carry the durable `trace:case` markers, so the fold replaces the five-row cases. The five-row scenarios retire with their requirement, and no artifact of the change cites them in backticks, since the fold leaves them issued nowhere
- **Carried for its marker** - US2-TC4-1 is the durable case restyled, its behaviour unchanged; it walks the Mixed Line States story group 1 adds. US6-TC1-1 to US6-TC3-1 are the durable cases restyled, their behaviour, id and revision unchanged, so their `covers` can name `shared-ui-store-cart-SC-49` and `shared-ui-store-cart-SC-42`, which the change adds to US-06
- **Folded, count** - the badge requirement leaves out unavailable lines as well as sold-out ones (Q10). `shared-ui-store-cart-SC-49` states it and US6-TC6-1 walks it on the Mixed Line States story, which keeps the unavailable line the drawer asks to remove; `shared-ui-store-cart-SC-42` gains the hidden count badge, which US6-TC4-1 already expects at its step 4
- **Reworded, count** - every case names the count as the page does, the count beside the drawer title, and looks at the drawer title for it, since `header` also names the site header's cart count (Q10). The badge requirement ties the badge to that name, so no case's meaning or revision moves
- **Markers** - each case's `covers` names every scenario serving its `Trace` journey, in the folded spec's order, as `docs/governance/test-traceability.md` requires: `shared-ui-store-cart-SC-50` after `shared-ui-store-cart-SC-05` for US-02, `shared-ui-store-cart-SC-51` after `shared-ui-store-cart-SC-48` for US-03, and `shared-ui-store-cart-SC-49` after the status scenario for US-06. `shared-ui-store-cart-SC-08` and `shared-ui-store-cart-SC-01` move to revision 2, the second because the exports it imports change. `shared-ui-store-cart-SC-50`, `shared-ui-store-cart-SC-51`, US3-TC4-1 and US6-TC6-1 take numbers above every one the base branch and the active changes on the capability issue, the highest being scenario 39, which `add-store-cart-drawer-ui` issues

**Run:** Blind feature pass (QA1) on 2026-10-06 for `cart-drawer-empty-state`, `shared/ui/store-cart`. Reconciled (QA2) on 2026-10-06, and again on 2026-10-07, each in a fresh context against the delta `spec.md`, `ui-design.md`, `tech-design.md`, `tasks.md`, `decisions.md`, the Cart Drawer page, the durable spec and suite, the active changes on the capability, the block and its stories at `packages/ui/src/blocks/store-cart/`, and the Grade10 host it cites.

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

**Run:** 2026-10-13. QA1 drafted the four cases from the frozen `/tmp/add-store-cart-thumbnails-qa1` anchor bundle without requirements, scenarios, technical design or archive material. QA2 compared them with this change's requirements, decisions Q1-Q8, UI design, approved thumbnail reference, technical design and tasks. The case dispositions were decided before the scenario links were added.

| Case | Disposition |
| --- | --- |
| `shared-ui-store-cart-US2-TC9-1` / `TC-r4q` | Retain the blind draft. Group standalone item, body and drawer rows under the supplied-picture route; check image bytes, unchanged alt text, sold-out treatment and callbacks. The thumbnail is `aria-hidden`, so check the image alt attribute rather than an accessible image name. Fully asserts SC-64. |
| `shared-ui-store-cart-US2-TC10-1` / `TC-w8c` | Retain the blind draft. Absent and empty alt partitions use the item name; check that copy and layout stay as they were. Fully asserts SC-65. |
| `shared-ui-store-cart-US2-TC11-1` / `TC-y6p` | Retain the blind draft. Add omitted and empty source partitions, unchanged display facts and callback, and no product request or stored picture metadata. Fully asserts SC-66. |
| `shared-ui-store-cart-US2-TC12-1` / `TC-k2v` | Retain the blind sold-out visual check as an anchor-covered draft. It checks part of SC-64 but does not claim that whole scenario's composition, image-byte, alt and callback assertions. |

| Source in `spec.md` | Complete asserting case |
| --- | --- |
| `shared-ui-store-cart-SC-64` (`SC-3aw`) | `shared-ui-store-cart-US2-TC9-1` |
| `shared-ui-store-cart-SC-65` (`SC-p71`) | `shared-ui-store-cart-US2-TC10-1` |
| `shared-ui-store-cart-SC-66` (`SC-du1`) | `shared-ui-store-cart-US2-TC11-1` |

- **Anchor coverage** - All four cases trace the existing shopper journey and the Product pictures Feature set. No blind case adds a product read, new layout, copy or storage behavior.
- **Uncovered scenarios** - None. TC12 remains anchor-covered and scenario-link-pending because its narrower sold-out check is useful but does not prove a complete scenario.
- **Decisions** - Q7 keeps non-empty whitespace-only alt text unchanged; Q8 sends an empty source to the placeholder. Both are reflected in case partitions. No further product decision or contradiction remains.
- **Ownership** - Group 1.1's controlled browser tests decide the rendered, loaded, callback and no-request assertions. Group 1.2 supplies the stories and assets; Group 1.3 validates them. No test has run in this planning pass.
- **Lifecycle** - All four cases remain draft/manual, with no execution or classification credit.

### Pending QA2 - 2026-10-13

This fresh reconciliation compares the independent shared QA1 restart with
the shared requirement and technical design. Its input identity is
`8a8d6e59d40ebf9ff1cb4b6de04213976b73a4e0be37cb793296ae70beaaed4e`.
Cases are disposed first; scenario links then name only complete assertions.
This dated scope supersedes earlier pending coverage claims.

| Case | Disposition |
| --- | --- |
| `shared-ui-store-cart-US19-TC1-1` / `TC-cxw` | Retain issued identity and draft lifecycle; canonical US19 Trace; exact tender-only guard |
| `shared-ui-store-cart-US19-TC2-1` / `TC-sxg` | Retain issued identity and draft lifecycle; canonical US20 Trace; exact tender-only recovery |
| `shared-ui-store-cart-US19-TC3-1` / `TC-swe` | Retain the existing tender-only compatibility purpose and marker; broader `interactionPending` compatibility is covered by new US20-TC2 |
| `shared.ui-store-cart.US19-TC4` / `TC-ja3` | Retain blind draft; sharpen compound/standalone rows and Enter, Space and input attempts |
| `shared.ui-store-cart.US19-TC5` / `TC-cpt` | Retain blind draft; sharpen nested/standalone sheet, loyalty link and existing dismissal callback |
| `shared.ui-store-cart.US19-TC6` / `TC-d72` | Retain blind draft; add sheet-first dismissal, collapsed proposal, focus and blocked edit/opening proposals |
| `shared.ui-store-cart.US20-TC1` / `TC-wru` | Retain blind draft; attempt actions before clearing to observe no replay |
| `shared.ui-store-cart.US20-TC2` / `TC-r4f` | New QA2 repair case for omitted/false `interactionPending` compatibility and legacy `tenderPending` behavior; no QA1 credit |
| `shared.ui-store-cart.US19-TC7` / `TC-wh7` | New QA2 draft from uncovered delayed-removal THEN, allocated by trace CLI; no QA1 credit |

| Source in `spec.md` | Complete asserting case |
| --- | --- |
| `shared-ui-store-cart-SC-37` (`SC-9yi`) | `shared-ui-store-cart-US19-TC1-1` |
| `shared-ui-store-cart-SC-38` (`SC-nty`) | `shared-ui-store-cart-US19-TC2-1` |
| `shared-ui-store-cart-SC-39` (`SC-x24`) | `shared-ui-store-cart-US19-TC3-1` |
| `g10.shared-store-cart.SC64` (`SC-pxz`) | `shared.ui-store-cart.US19-TC4` |
| `g10.shared-store-cart.SC65` (`SC-xrx`) | `shared.ui-store-cart.US19-TC5` |
| `g10.shared-store-cart.SC66` (`SC-mxv`) | `shared.ui-store-cart.US19-TC6` |
| `g10.shared-store-cart.SC67` (`SC-fct`) | `shared.ui-store-cart.US20-TC1` |
| `g10.shared-store-cart.SC68` (`SC-2h3`) | `shared.ui-store-cart.US20-TC2` |
| `g10.shared-store-cart.SC69` (`SC-rb9`) | `shared.ui-store-cart.US19-TC7` |

- **Anchor coverage** - US19 covers pending controls, retained values, delayed removal and dismissal; US20 covers recovery and compatibility. Context US04 covers dismissal. Durable order-discount US18 is unchanged.
- **Historical links** - The three legacy markers retain their original multi-scenario `covers` values because existing marker ids, revisions and coverage are immutable. Their case bodies remain tender-only; the new US20-TC2 is the complete assertion for SC68. The source table names one canonical asserting case per scenario without treating the historical links as evidence of the broader interaction contract.
- **Uncovered scenarios** - None in this increment. No new product choice or contradiction remains.
- **Lifecycle** - All 9 pending cases remain draft/manual; the run grants no execution or classification credit. Existing revisions and marker identities are preserved.

#### Manual

| Manual | Why |
| --- | --- |
| `shared-ui-store-cart-US19-TC1-1` | To be walked in Cart Drawer Group 15.1 controlled compound and public-part fixtures, then Group 17.1 pending drawer actor walk; delayed answers and callback records are required. No test or walk has executed in this planning run. |
| `shared-ui-store-cart-US19-TC2-1` | To be walked in Cart Drawer Group 15.1 controlled compound and public-part fixtures, then Group 17.1 pending drawer actor walk; delayed answers and callback records are required. No test or walk has executed in this planning run. |
| `shared-ui-store-cart-US19-TC3-1` | To be walked in Cart Drawer Group 15.1 controlled compound and public-part fixtures, then Group 17.1 pending drawer actor walk; delayed answers and callback records are required. No test or walk has executed in this planning run. |
| `shared.ui-store-cart.US19-TC4` | To be walked in Cart Drawer Group 15.1 controlled compound and public-part fixtures, then Group 17.1 pending drawer actor walk; delayed answers and callback records are required. No test or walk has executed in this planning run. |
| `shared.ui-store-cart.US19-TC5` | To be walked in Cart Drawer Group 15.1 controlled compound and public-part fixtures, then Group 17.1 pending drawer actor walk; delayed answers and callback records are required. No test or walk has executed in this planning run. |
| `shared.ui-store-cart.US19-TC6` | To be walked in Cart Drawer Group 15.1 controlled compound and public-part fixtures, then Group 17.1 pending drawer actor walk; delayed answers and callback records are required. No test or walk has executed in this planning run. |
| `shared.ui-store-cart.US20-TC1` | To be walked in Cart Drawer Group 15.1 controlled compound and public-part fixtures, then Group 17.1 pending drawer actor walk; delayed answers and callback records are required. No test or walk has executed in this planning run. |
| `shared.ui-store-cart.US20-TC2` | To be walked in Cart Drawer Group 15.1 controlled compound and public-part fixtures, then Group 17.1 pending drawer actor walk; omitted/false interaction state, tender-only blocking and callback records are required. No test or walk has executed in this planning run. |
| `shared.ui-store-cart.US19-TC7` | To be walked in Cart Drawer Group 15.1 controlled compound and public-part fixtures, then Group 17.1 pending drawer actor walk; delayed answers and callback records are required. No test or walk has executed in this planning run. |

**Run:** 2026-09-22. The coordinator independently derived the three acceptance
cases from the approved pending-state brief, without reading this shared delta.
The spec worker independently wrote the requirement and scenarios. Earlier
independent points QA supplies the consumer pending-operation coverage.

- **Aligned** — disabled entry points, restored availability and omitted-state
  compatibility map to `shared-ui-store-cart-SC-37`,
  `shared-ui-store-cart-SC-38` and `shared-ui-store-cart-SC-39` respectively.
- **Strengthened** — the coordinator explicitly covered Enter, both points
  states, open promo sheet, standalone footer, and existing disabled reasons.
  These test existing guard semantics under the optional prop, adding no new
  product behavior.
- **Raised** — no unanswered product decision; this is a missing presentation
  prop for the approved pending behavior, with default-false compatibility.

### Manual

| Manual | Why |
| --- | --- |
| `shared-ui-store-cart-US2-TC9-1` | To be walked by the controlled Storybook browser tests in Group 1.1 after Group 1.2 supplies the assets and stories. |
| `shared-ui-store-cart-US2-TC10-1` | To be walked by the controlled Storybook browser tests in Group 1.1 with absent and empty alt controls. |
| `shared-ui-store-cart-US2-TC11-1` | To be walked by the controlled Storybook browser tests in Group 1.1 with omitted and empty source controls and callback records. |
| `shared-ui-store-cart-US2-TC12-1` | To be walked in the Group 1.1 sold-out picture story after the shared assets and stories land. |
