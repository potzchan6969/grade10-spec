# shared/ui/store-cart Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-02, tcs-rules r1

## shared-ui-store-cart-US1: Application imports the cart drawer surface

**As an** application,
**I want** every cart drawer component and type available from the shared UI
package's public entry,
**so that** I compose the drawer from its parts rather than defining them
myself.

### shared-ui-store-cart-US1-TC1-1: Public entry exports the cart drawer

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** smoke
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-ui-store-cart-US-01

**Pre-conditions:**
None.

**Steps:**

1. Import any named cart-drawer export from the shared UI package's public entry.

**Expected Results:**

* The import resolves without error.

---

## shared-ui-store-cart-US2: Shopper reviews what the cart holds

**As a** shopper,
**I want** the drawer to show my items on a five-row baseline, with a count
that ignores sold-out items and an edge fade when there are more,
**so that** I can see what I am buying without the drawer changing shape as
the cart fills.

### shared-ui-store-cart-US2-TC1-1: Fewer than five items fill with placeholder slots

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-02

**Pre-conditions:**
A cart with 2 items.

**Steps:**

1. Open the cart drawer.
2. Check the item rows.

**Expected Results:**

* It renders the 2 items followed by 3 placeholder slots.

### shared-ui-store-cart-US2-TC2-1: Five or more items scroll with no placeholders

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-ui-store-cart-US-02

**Pre-conditions:**
A cart with 6 items.

**Steps:**

1. Open the cart drawer.
2. Check the item rows and overflow.

**Expected Results:**

* All 6 items render and no placeholder slots are shown.
* Overflowing items apply the scroll-fade styling.

### shared-ui-store-cart-US2-TC3-1: Empty cart shows five slots and hides count and footer

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-02

**Pre-conditions:**
A cart with 0 items.

**Steps:**

1. Open the cart drawer.
2. Check the rows, header badge, and footer.

**Expected Results:**

* 5 placeholder slots render.
* The item count badge in the header is hidden.
* The footer is hidden entirely.

### shared-ui-store-cart-US2-TC4-1: Sold-out item is excluded from the count badge

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-ui-store-cart-US-02

**Pre-conditions:**
A cart with 1 active item and 1 sold-out item.

**Steps:**

1. Open the cart drawer.
2. Check the header badge.

**Expected Results:**

* The header badge displays `1`.

---

## shared-ui-store-cart-US3: Shopper opens the cart on current prices

**As a** shopper,
**I want** the drawer to read fresh product status and pricing when it opens,
showing skeletons while that read is in flight,
**so that** I decide against the current prices rather than stale ones.

### shared-ui-store-cart-US3-TC1-1: Opening cart shows skeletons and disables checkout

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-03

**Pre-conditions:**
An opening or loading cart drawer with `loading` true.

**Steps:**

1. Open the cart drawer while loading is true.
2. Check items, totals, placeholders, and the checkout button.

**Expected Results:**

* Cart items, the header count badge, subtotal, discount amount, and estimated total display skeleton loaders.
* No placeholder slots are shown.
* The checkout button is disabled.

---

## shared-ui-store-cart-US4: Shopper dismisses the cart drawer

**As a** shopper,
**I want** to close the drawer from its close button, the backdrop, or the
Escape key, with the page behind it held still,
**so that** I can leave the cart without losing my place on the page beneath
it.

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

### shared-ui-store-cart-US6-TC1-1: Delisted items clear after loading with one toast

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-06

**Pre-conditions:**
An open cart drawer whose status-and-price loading has finished. The cart includes at least one item with status `unavailable` and at least one item that is not `unavailable`.

**Steps:**

1. Open the cart drawer and wait until loading finishes.
2. Check the rows and the toast.

**Expected Results:**

* Each `unavailable` item is removed via `onRemoveItem`.
* No `unavailable` item is shown as a cart row.
* Exactly one toast appears with the `unavailableItemsRemoved` message.
* Non-unavailable items remain in the cart.

### shared-ui-store-cart-US6-TC2-1: No unavailable items means no removal toast

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-ui-store-cart-US-06

**Pre-conditions:**
An open cart drawer whose status-and-price loading has finished. No cart item has status `unavailable`.

**Steps:**

1. Open the cart drawer and wait until loading finishes.
2. Check the toast and the rows.

**Expected Results:**

* No toast with the `unavailableItemsRemoved` message is shown.
* No item is removed solely for being unavailable.

### shared-ui-store-cart-US6-TC3-1: Status values and toast copy are the named contract

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-ui-store-cart-US-06

**Pre-conditions:**
None.

**Steps:**

1. Assign `CartItemStatus` on a cart line.
2. Supply `CartDrawerCopy`.

**Expected Results:**

* Allowed status values are only `default`, `adjusted`, `soldOut`, and `unavailable`.
* The copy includes `unavailableItemsRemoved`.

---

## shared-ui-store-cart-US7: Shopper edits a low-stock line and the warning quiets

**As a** shopper,
**I want** the low-stock warning to hide after I change that line's quantity,
**so that** it does not keep shouting after I have acted, and it returns if the line is adjusted again.

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
