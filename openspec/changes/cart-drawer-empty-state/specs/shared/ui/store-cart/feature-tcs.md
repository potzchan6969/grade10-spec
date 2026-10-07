# shared/ui/store-cart Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-06, tcs-rules r4

**Out of suite:** shared-ui-store-cart-SC-01 - the store-cart export set in `packages/ui/src/index.test.ts`; shared-ui-store-cart-SC-22 - the type assertions in the same test, run by `pnpm run typecheck`; shared-ui-store-cart-SC-43 - the same test, which finds neither slot export

## Background

* `<shared ui storybook url>` is the shared UI Storybook, served by `pnpm storybook:ui`; the drawer's stories sit under Store Cart.
* The Controls panel changes the props of a story that passes its args straight to the drawer, such as Loading No Lines. `Default` keeps its lines in its own state, so a step there changes them through the drawer's own controls.

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

| `<cart_1>` | Lines | Reached by |
| --- | --- | --- |
| Two lines | 2 | the story as it opens |
| One line | 1 | clicking the remove control on one line |
| Two lines, one at 3 units | 2 | clicking the increase control on the second line until it reads 3 |

**Steps:**

1. Navigate to the Store Cart/CartDrawer Default story at `<shared ui storybook url>`.
2. Reach `<cart_1>` as **Reached by** says.
3. Look at the drawer body.
4. Look at the drawer title and the footer.

**Expected Results:**

* Step 3 shows exactly the row count in **Lines**.
* No dashed or placeholder row follows the last line.
* No empty state shows.
* No edge fade shows while every line fits in the body.
* Step 4: the count beside the drawer title reads the row count in **Lines**.
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

**Steps:**

1. Navigate to the Store Cart/CartDrawer Overflow Items story at `<shared ui storybook url>`.
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
| `<empty title>` | the story's empty-cart title |
| `<empty description>` | the story's line under that title |

**Steps:**

1. Navigate to the Store Cart/CartDrawer Empty State story at `<shared ui storybook url>`.
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

* The drawer renders `<cart_5>`, loaded.

**Test data:**

| Field | Value |
| --- | --- |
| `<cart_5>` | 1 active line and 1 sold-out line |

**Steps:**

1. Open the drawer on `<cart_5>`.
2. Look at the drawer body.
3. Look at the drawer title.

**Expected Results:**

* Step 2: both lines show, the sold-out one marked sold out.
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
| `<empty title>` | the story's empty-cart title |

**Steps:**

1. Navigate to the Store Cart/CartDrawer Empty State Without Description story at `<shared ui storybook url>`.
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
| `<cart_2>` | 2 lines, both sold out, none delisted |

**Steps:**

1. Navigate to the Store Cart/CartDrawer Only Sold Out Lines story at `<shared ui storybook url>`.
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
| `<cart_3>` | 2 active lines |
| `<empty title>` | the story's empty-cart title |

**Steps:**

1. Navigate to the Store Cart/CartDrawer Default story at `<shared ui storybook url>`.
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
| `<empty title>` | the story's empty-cart title |
| `<empty description>` | the story's line under that title |

**Steps:**

1. Navigate to the Store Cart/CartDrawerBody Empty story at `<shared ui storybook url>`.
2. Look at the body.

**Expected Results:**

* Cart icon, then `<empty title>`, then `<empty description>`.
* No button, no item row, no placeholder row.

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

**Steps:**

1. Navigate to the Store Cart/CartDrawer Loading With Lines story at `<shared ui storybook url>`.
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
| `<empty title>` | the story's empty-cart title |

**Steps:**

1. Navigate to the Store Cart/CartDrawer Loading No Lines story at `<shared ui storybook url>`.
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

* The drawer opens on `<cart_6>`; opening it starts the status-and-price read.
* The read returns `<delisted line>` as no longer in the catalogue.

**Test data:**

| Field | Value |
| --- | --- |
| `<cart_6>` | `<active line>` and `<delisted line>`, 1 each |
| `<active line>` | an active line |
| `<delisted line>` | a line the catalogue no longer sells |

**Steps:**

1. Open the drawer on `<cart_6>`.
2. Wait until the skeletons clear.
3. Look at the drawer body.
4. Look at the toasts.
5. Look at the remove requests the drawer sent, in the story's Actions panel.

**Expected Results:**

* Step 3: `<delisted line>` does not show, not even sold out.
* `<active line>` still shows.
* Step 4: exactly one removal toast shows.
* Step 5: one remove request, for `<delisted line>`.

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
| `<cart_7>` | 2 active lines, none delisted |

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
| `<cart_4>` | 2 lines, both delisted |
| `<empty title>` | the story's empty-cart title |

**Steps:**

1. Navigate to the Store Cart/CartDrawer Only Delisted Lines story at `<shared ui storybook url>` and click Open Cart.
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
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-06

**Pre-conditions:**

* The drawer opens on `<cart_8>`; opening it starts the status-and-price read.
* The read returns `<delisted line>` as no longer in the catalogue and `<sold-out line>` as sold out.

**Test data:**

| Field | Value |
| --- | --- |
| `<cart_8>` | `<delisted line>` and `<sold-out line>`, 1 each, no active line |
| `<delisted line>` | a line the catalogue no longer sells |
| `<sold-out line>` | a line still in the catalogue, sold out |

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
| `<cart_9>` | `<active line>`, `<sold-out line>` and `<delisted line>` |
| `<active line>` | an active line |
| `<sold-out line>` | a line marked sold out |
| `<delisted line>` | a line marked unavailable |

**Steps:**

1. Navigate to the Store Cart/CartDrawer Mixed Line States story at `<shared ui storybook url>`.
2. Look at the drawer body.
3. Look at the drawer title.

**Expected Results:**

* Step 2: `<active line>` and `<sold-out line>` show, the second marked sold out.
* `<delisted line>` does not show.
* Step 3: the count beside the drawer title reads `1`.

## Settled

- A cart of only sold-out lines is not empty: it lists them with the footer and no count beside the drawer title.
- A cart nobody has read stays loading, never the empty state.
- A cart read empty shows the empty state, even when its price check fails.
- The count beside the drawer title is one per line, whatever its quantity.

## Reconciliation

- **Folded** - each case agrees with the scenario it reaches: US2-TC1-2 walks `shared-ui-store-cart-SC-23` at two lines and one, and `shared-ui-store-cart-SC-50` at two lines with one raised to 3 units, US2-TC2-2 `shared-ui-store-cart-SC-24`, US2-TC3-2 `shared-ui-store-cart-SC-25`, US2-TC4-1 `shared-ui-store-cart-SC-05`, US2-TC5-1 `shared-ui-store-cart-SC-41`, US3-TC1-2 `shared-ui-store-cart-SC-08`, US3-TC2-1 `shared-ui-store-cart-SC-40` and then `shared-ui-store-cart-SC-25` once the read ends, US3-TC3-1 `shared-ui-store-cart-SC-48`, US3-TC4-1 `shared-ui-store-cart-SC-51`, US6-TC4-1 `shared-ui-store-cart-SC-42` and US6-TC6-1 `shared-ui-store-cart-SC-49`
- **Folded, edge fade** - US2-TC1-2 and US2-TC2-2 see the fade only at an edge with more lines past it. The durable `shared-ui-store-cart-SC-07` states the `scroll-fade` class; the fade by edge is how the design-system utility draws it, so no scenario is owed
- **Folded, body alone** - US2-TC8-1 walks `shared-ui-store-cart-SC-44`. That scenario serves US-02, not the `Drawer export contract` group: what it proves is the empty state a shopper sees, and no case traces the group, so the fold would have left it untraced
- **Folded as a route** - US2-TC7-1 reaches `shared-ui-store-cart-SC-25` by removing the last line rather than by opening an empty cart, and US6-TC5-1 joins `shared-ui-store-cart-SC-42`'s cleanup to `shared-ui-store-cart-SC-45`'s sold-out cart. The drawer derives both from the lines it is given on every render, so no scenario is owed. US2-TC7-1's drawer staying open follows from the dismissal requirement: the drawer closes only by its close control, the backdrop or Escape
- **Raised, landed, folded** - US2-TC6-1 asked what a cart of only sold-out lines shows (R3). A sold-out line stays visible, the badge draws only a positive count, and the footer follows the listed lines. Q8 records it, `shared-ui-store-cart-SC-45` states it, and the badge requirement shows no badge at a count of 0
- **Raised, landed** - US3-TC2-1's blank body asked what a failed first read shows (R4). Q9 has the consumer hold `loading` until it has read the lines, stated as `shared-ui-store-cart-SC-48`. US3-TC2-1 walks what the drawer shows while the consumer holds `loading`, US3-TC3-1 walks the Grade10 host holding it when both first reads fail, and the host tests of group 2 prove it, since the block cannot tell an unread cart from an empty one
- **Raised, landed, folded** - QA1 asked whether a cart read empty whose price check fails is read or unchecked (R5). Its lines are loaded and there are none, so it is read (Q11): the unread-cart clause ends `loading` on it, `shared-ui-store-cart-SC-51` states it, US3-TC4-1 walks it and a third host test of group 2 proves it. The page's Not read yet line said `checked` where it meant `read`; it now says a cart read empty shows the empty state
- **Raised, landed, folded** - QA1 asked whether a line of 3 units counts 3 or 1 (R6). The count is one per line, as the block counts and as `nav-cart-count-badge` counts the site header's cart (Q12): the badge requirement says so, `shared-ui-store-cart-SC-50` states it, and US2-TC1-2 gains the row that raises a line to 3 units. The Background line holding every counted line at 1 unit is gone, and the page's count line no longer reads as units
- **Rejected in part** - US3-TC3-1 expected the host's toast with Retry and no line named. No scenario of this capability states that toast; Cart Validation owns it (`docs/prds/products/grade10-site/store/cart-validation.md`), so the case keeps only what `shared-ui-store-cart-SC-48` states
- **Corrected** - US3-TC1-2 walks the Loading With Lines story, which holds `loading` and applies a promo code, so every skeleton it expects is there to see; the timed Fetching On Open story ends its read before a tester can look, and applies no promo. US3-TC2-1 walks the Loading No Lines story and ends the read by setting `loading` to false in the Controls panel, for the same reason. US2-TC5-1, US2-TC6-1, US6-TC4-1 and US6-TC6-1 walk the stories group 1 adds for their carts, and US2-TC1-2 and US2-TC7-1 walk `Default`, whose 2 lines are `shared-ui-store-cart-SC-23`'s own and whose stepper and remove control reach every row of US2-TC1-2, so a tester builds no cart by hand. `Default` copies its lines into its own state once, so the Background sends Controls panel steps only to stories that pass their args to the drawer
- **Corrected, signed in** - US3-TC3-1 now walks a signed-in customer, as US3-TC4-1 does. A guest's cart is read from the browser, not the network (`packages/grade10-store/frontend/src/features/orders/cart/data/repositories/CartRepositoryImpl.ts:46-53` in the Grade10 repository), so failing the network cannot fail a guest's first read
- **Contradicted** - none
- **Uncovered anchors** - none. US-02, US-03 and US-06 each have cases. The `Drawer export contract` group is served only by `shared-ui-store-cart-SC-01`, `shared-ui-store-cart-SC-22` and `shared-ui-store-cart-SC-43`, Out of suite and proven by the package's public-entry test and `pnpm run typecheck`. `shared-ui-store-cart-SC-13` stays walked by US6-TC3-1
- **Revised in place** - US2-TC1, US2-TC2, US2-TC3 and US3-TC1 move to revision 2 and carry the durable `trace:case` markers, so the fold replaces the five-row cases. The five-row scenarios retire with their requirement, and no artifact of the change cites them in backticks, since the fold leaves them issued nowhere
- **Carried for its marker** - US2-TC4-1 is the durable case restyled, its behaviour unchanged. No story holds its cart of 1 active and 1 sold-out line, so `/tcs-review` prepares one before it runs. US6-TC1-1 to US6-TC3-1 are the durable cases restyled, their behaviour, id and revision unchanged, so their `covers` can name `shared-ui-store-cart-SC-49` and `shared-ui-store-cart-SC-42`, which the change adds to US-06
- **Folded, count** - the badge requirement leaves out unavailable lines as well as sold-out ones (Q10). `shared-ui-store-cart-SC-49` states it and US6-TC6-1 walks it on the Mixed Line States story, which keeps the unavailable line the drawer asks to remove; `shared-ui-store-cart-SC-42` gains the hidden count badge, which US6-TC4-1 already expects at its step 4
- **Reworded, count** - every case names the count as the page does, the count beside the drawer title, and looks at the drawer title for it, since `header` also names the site header's cart count (Q10). The badge requirement ties the badge to that name, so no case's meaning or revision moves
- **Markers** - each case's `covers` names every scenario serving its `Trace` journey, in the folded spec's order, as `docs/governance/test-traceability.md` requires: `shared-ui-store-cart-SC-50` after `shared-ui-store-cart-SC-05` for US-02, `shared-ui-store-cart-SC-51` after `shared-ui-store-cart-SC-48` for US-03, and `shared-ui-store-cart-SC-49` after the status scenario for US-06. `shared-ui-store-cart-SC-08` and `shared-ui-store-cart-SC-01` move to revision 2, the second because the exports it imports change. `shared-ui-store-cart-SC-50`, `shared-ui-store-cart-SC-51`, US3-TC4-1 and US6-TC6-1 take numbers above every one the base branch and the active changes on the capability issue, the highest being scenario 39, which `add-store-cart-drawer-ui` issues

**Run:** Blind feature pass (QA1) on 2026-10-06 for `cart-drawer-empty-state`, `shared/ui/store-cart`. Reconciled (QA2) on 2026-10-06 in a fresh context against the delta `spec.md`, `ui-design.md`, `tech-design.md`, `tasks.md`, `decisions.md`, the Cart Drawer page, the durable spec and suite, the active changes on the capability, the block and its stories at `packages/ui/src/blocks/store-cart/`, and the Grade10 host it cites.
