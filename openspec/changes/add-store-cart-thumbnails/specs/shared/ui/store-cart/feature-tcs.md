# shared/ui/store-cart Test Cases

**Status:** pending-review · 0/4
**Drafts styled:** 2026-10-13, tcs-rules r5

## Background

* <shared ui storybook url> is the shared UI Storybook's Store Cart area.

## shared-ui-store-cart-US2: Shopper reviews what the cart holds

**As a** shopper,
**I want** the drawer to show my items with a count that ignores sold-out
items, an edge fade when there are more, and an empty state when the cart
holds nothing,
**so that** I can see what I am buying, or that there is nothing to buy yet.

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-02

**Pre-conditions:**

* Controlled picture stories supply a served picture URL, an item name and the **Supplied alt text** for each **Composition**.

**Test data:**

| Composition | Supplied alt text | Item state |
| --- | --- | --- |
| CartItem alone | Card front | Available |
| CartDrawerBody | two spaces | Available |
| CartDrawer | Card front | Sold out |

**Steps:**

1. Navigate to the **Composition** picture story at <shared ui storybook url>.
2. Inspect the matching item's thumbnail image, its source and alt attribute.
3. Check that the served image completes loading with positive natural width.
4. Activate each available existing item action and inspect its callback record.

**Expected Results:**

* Step 2 shows the supplied picture in the existing thumbnail frame with the supplied URL and **Supplied alt text** unchanged.
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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-02

**Pre-conditions:**

* The CartItem missing-alt story supplies a picture and the item name Gengar VMAX in the existing layout.

**Test data:**

| Supplied alt text | Expected alt attribute |
| --- | --- |
| absent | Gengar VMAX |
| empty string | Gengar VMAX |

**Steps:**

1. Navigate to the CartItem missing-alt story at <shared ui storybook url>.
2. Set **Supplied alt text** for this run.
3. Inspect the item picture, its alt attribute, copy and layout.

**Expected Results:**

* Step 3 still shows the supplied picture.
* Its alt attribute is **Expected alt attribute**.
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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-02

**Pre-conditions:**

* The CartItem no-picture story supplies an item name, quantity, price and an action callback.

**Test data:**

| Supplied image source |
| --- |
| omitted |
| empty string |

**Steps:**

1. Navigate to the CartItem no-picture story at <shared ui storybook url> with **Supplied image source**.
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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-02

**Pre-conditions:**

* The CartItem sold-out picture story supplies a picture and sold-out status.

**Steps:**

1. Navigate to the CartItem sold-out picture story at <shared ui storybook url>.
2. Inspect the item row.

**Expected Results:**

* Step 2 shows the supplied picture in the thumbnail frame.
* The item keeps its existing sold-out treatment.

## Reconciliation

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

### Manual

| Manual | Why |
| --- | --- |
| `shared-ui-store-cart-US2-TC9-1` | To be walked by the controlled Storybook browser tests in Group 1.1 after Group 1.2 supplies the assets and stories. |
| `shared-ui-store-cart-US2-TC10-1` | To be walked by the controlled Storybook browser tests in Group 1.1 with absent and empty alt controls. |
| `shared-ui-store-cart-US2-TC11-1` | To be walked by the controlled Storybook browser tests in Group 1.1 with omitted and empty source controls and callback records. |
| `shared-ui-store-cart-US2-TC12-1` | To be walked in the Group 1.1 sold-out picture story after the shared assets and stories land. |

## Settled

- **Whitespace-only alt text** - Q7 retains the supplied non-empty string; only absent or empty alt text uses the item name.
- **Empty picture source** - Q8 uses the existing placeholder.
