# shared/ui/store-cart Test Cases

**Status:** pending-review · 0/4
**Drafts styled:** 2026-10-06, tcs-rules r4

## Background

* `<shared ui storybook url>` is the shared UI Storybook, served by `pnpm storybook:ui`; the drawer's stories sit under Store Cart.
* The Controls panel changes the props of a story that passes its args straight to the drawer, such as Loading No Lines. `Default` keeps its lines in its own state, so a step there changes them through the drawer's own controls.

## shared.ui-store-cart.US6: Shopper opens a cart that held a delisted product

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

<!-- trace:case id=g10.shared-store-cart.TC-ulg rev=1 covers=g10.shared-store-cart.SC-sol,g10.shared-store-cart.SC-0wv,g10.shared-store-cart.SC-fy2,g10.shared-store-cart.SC-jbs,g10.shared-store-cart.SC-pvs,g10.shared-store-cart.SC-psl -->
### shared-ui-store-cart-US6-TC4-1: A cart of only delisted lines ends on the empty state

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
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

## Reconciliation

- **Status contract source** - `Cart item status includes unavailable` follows the [Cart Validation PRD](../../../../../../../docs/prds/products/grade10-site/store/cart-validation.md): `adjusted` is reduced to what the shop can fill, `soldOut` is a variant the shop no longer offers, and `unavailable` is a product that left the channel or a variant that no longer exists. The status-value scenario `shared-ui-store-cart-SC-12` is unchanged.
- **Already live; duplicate removed** - `shared-ui-store-cart-US6-TC6-1` duplicated the live `shared-ui-store-cart-US6-TC6` (`g10.shared-store-cart.TC-kad@1`) in the [current durable suite](../../../../../../specs/shared/ui/store-cart/feature-tcs.md). Both use the Mixed Line States story and assert that the active and sold-out rows remain, the unavailable row is hidden, and the count reads `1`. It adds no new assertion or row, so its duplicate definition is removed from this delta; the durable case remains live and unchanged. The corresponding count outcome is `shared-ui-store-cart-SC-49` in the [durable spec](../../../../../../specs/shared/ui/store-cart/spec.md).
- **New, not an extension** - `shared-ui-store-cart-US6-TC1-1` - no live case walks the Unavailable Items Removed story or checks the cleanup toast while an active line remains; the durable Mixed Line States case only checks its rows and count. This is the distinct cleanup path in `shared-ui-store-cart-SC-10` ([delta spec](spec.md#requirement-unavailable-items-are-removed-silently-after-open-loading)).
- **New, not an extension** - `shared-ui-store-cart-US6-TC2-1` - it starts with no unavailable line and asserts no toast or removal request, the opposite condition and outcome from the live case, which starts with an unavailable line. It covers the negative path in `shared-ui-store-cart-SC-11` ([delta spec](spec.md#requirement-unavailable-items-are-removed-silently-after-open-loading)).
- **New, not an extension** - `shared-ui-store-cart-US6-TC4-1` - no live case starts with only unavailable lines and checks that cleanup reaches the empty state, hides the count and footer, and shows one toast; the live case keeps active and sold-out rows. This is the all-unavailable path in `shared-ui-store-cart-SC-42` ([durable spec](../../../../../../specs/shared/ui/store-cart/spec.md)).
- **New, not an extension** - `shared-ui-store-cart-US6-TC5-1` - no live case checks a cart where cleanup leaves only sold-out lines, with no empty state or count but with the footer; the live case retains an active line and count `1`. The distinct post-cleanup result follows the unavailable cleanup and sold-out cart requirements in the [durable spec](../../../../../../specs/shared/ui/store-cart/spec.md).
- **Anchor coverage** - the US-06 journey has four distinct delta cases and the existing live TC6. The prior reference to `US6-TC3-1` walking `shared-ui-store-cart-SC-12` was stale: neither this delta nor the current durable suite defines that case.

**Run:** QA2 rerun on 2026-11-02 after the settled answers were recorded in `decisions.md`. Read this suite's cases and anchors, its `spec.md` and `user-journeys.md`, the updated `decisions.md`, the Product Listing and Cart Validation PRDs, `docs/governance/specs-to-test-cases.md`, and the current durable Store Cart spec and feature suite from `origin/main` at `877943c1d`. The archived `cart-drawer-empty-state` suite was consulted only to check the old carry-forward note; the current durable suite determines whether a case is live. No anchors or scenario requirements changed. QA2 found TC6 duplicates the live `TC-kad@1` case and removed it from this delta; TC1, TC2, TC4 and TC5 remain new for the distinct routes and outcomes above.
