# shared/ui/store-cart Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## Background

* `<shared ui storybook url>` is the shared UI Storybook, served by `pnpm storybook:ui`; the drawer's stories sit under Store Cart.
* The Controls panel changes the props of a story that passes its args straight to the drawer, such as Loading No Lines. `Default` keeps its lines in its own state, so a step there changes them through the drawer's own controls.

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
| `<cart_6>` | `<active line>` and `<delisted line>`, 1 each |
| `<active line>` | an active line |
| `<delisted line>` | a line whose product left the store's sales channel, or whose variant no longer exists |

**Steps:**

1. Navigate to the Store Cart/CartDrawer Unavailable Items Removed story at `<shared ui storybook url>` and click Open Cart.
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
* **Testability:** automation
* **Trace:** shared-ui-store-cart-US-06

**Pre-conditions:**

* The drawer opens on `<cart_8>`; opening it starts the status-and-price read.
* The read returns `<delisted line>` as no longer in the catalogue and `<sold-out line>` as sold out.

**Test data:**

| Field | Value |
| --- | --- |
| `<cart_8>` | `<delisted line>` and `<sold-out line>`, 1 each, no active line |
| `<delisted line>` | a line whose product left the store's sales channel, or whose variant no longer exists |
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

## Reconciliation

- **Carried for its requirement** - `Cart item status includes unavailable` now states what each status means as `grade10-site/store/cart-validation` answers it: `adjusted` a quantity reduced to what the shop can fill, `soldOut` a variant the shop no longer offers, `unavailable` a product that left the channel or a variant that no longer exists. Its scenario, `shared-ui-store-cart-SC-12`, is unchanged. US6-TC1-1 to US6-TC6-1 are `cart-drawer-empty-state`'s US-06 cases as that change folds them, their id, revision and `covers` unchanged, so the fold keeps them whole
- **Contradicted** - none
- **Uncovered anchors** - none. US-06 keeps every case; US6-TC3-1 walks `shared-ui-store-cart-SC-12`

**Run:** Update on 2026-10-07, from `add-store-product-status`'s sixth acceptance review. QA2 reruns on this suite.
