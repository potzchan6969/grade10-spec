# grade10-site/store/product-page Test Cases

**Status:** pending-review · 0/2
**Drafts styled:** 2026-10-06, tcs-rules r4

## grade10-site-store-product-page-US10: Collector opens Store Locator from free pick-up

**As a** collector,
**I want** free pick-up at Hong Kong Grade10 Store on a product page to open
Store Locator,
**so that** I see the same shop's address and hours before I choose pickup.

<!-- trace:case id=g10.store-product-page.TC-ka9 rev=1 covers=g10.store-product-page.SC-21b,g10.store-product-page.SC-res -->
### grade10-site-store-product-page-US10-TC1-1: Free pick-up store name opens Store Locator

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-page-US-10

**Pre-conditions:**

* The site under test is a build that carries the store surfaces.

**Test data:**

| `<product>` |
| --- |
| A card with its one item for sale |
| A sold-out card |

**Steps:**

1. Navigate to <grade10 product url> for `<product>`.
2. Find the free pick-up claim on the page.
3. Click the store name in the claim.

**Expected Results:**

* Step 2: the claim names Hong Kong Grade10 Store, and the name is a link.
* Step 3 opens Store Locator in the same tab, the Location & Hours heading showing.

<!-- trace:case id=g10.store-product-page.TC-q55 rev=1 covers=g10.store-product-page.SC-21b,g10.store-product-page.SC-res -->
### grade10-site-store-product-page-US10-TC2-1: Shipping label with no page behind it is not a link

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-page-US-10

**Pre-conditions:**

* The site under test is a build that carries the store surfaces.

**Test data:**

| Field | Value |
| --- | --- |
| `<product>` | A card with its one item for sale |

**Steps:**

1. Navigate to <grade10 product url> for `<product>`.
2. Find Shipping fee in the line Shipping calculated at checkout.
3. Click Shipping fee.
4. Press Tab through the page from the card's name to the footer.

**Expected Results:**

* Step 2: Shipping fee is text, not a link.
* Step 3 leaves the page and its address unchanged, with no `#` added.
* Step 4 stops on the pick-up store name and skips Shipping fee.

## Settled

- The store name in free pick-up opens Store Locator in the same tab, in the product page's language; only the map, which leaves the site, opens a new tab.

## Reconciliation

**Run:** QA2 reconciliation, 2026-10-06, in a fresh context. Read: this suite, the change's `domain-tcs.md`, the delta `spec.md` with its scenarios, `tech-design.md`, `decisions.md`, `tasks.md` and the Product Details and Store Locator pages. The blind pass recorded no Run line of its own; its question is the product-page row of `decisions.md`'s `## Raised`. Later QA2 runs, each in a fresh context, rechecked every disposition after the accept review's edits; the last, 2026-10-07, read the same set, the application repository's product view and the stack's claims on this domain's ids.

- **Folded** - `grade10-site-store-product-page-US10-TC1-1` to `grade10-site-store-product-page-SC-25`, a sold-out card as a row because the claim is on every card; `grade10-site-store-product-page-US10-TC2-1` to `grade10-site-store-product-page-SC-38`, now naming the Shipping fee label the scenario names rather than the whole shipping line
- **Raised, answered** - whether the store name opens Store Locator in the same tab (Q20): it does, in the product page's language. `grade10-site-store-product-page-SC-25` now says so, and `grade10-site-store-product-page-US10-TC1-1` gains the same-tab result
- **Settled for now** - Shipping fee drawn plain, like the text around it, once it is not a link (Q22), handed to draw-store-locator-page. `grade10-site-store-product-page-US10-TC2-1` reads text, not a link, as `grade10-site-store-product-page-SC-38` does, and no case asserts the look
- **Renumbered** - the Shipping fee scenario is `grade10-site-store-product-page-SC-38` and the domain journey is `grade10-site-store-e2e-US10`, numbers no other open change claims: `add-store-product-status` holds this capability's scenarios 33 to 37, and `add-account-profile`, accepted before this change, holds the domain's journey 9
- **Covered at domain** - `grade10-site-store-e2e-US10-TC1-1` walks `grade10-site-store-product-page-SC-25`'s language: the address keeps the product page's prefix and the name reads the same on both pages
- **Contradicted** - none
- **Uncovered anchors** - none: `grade10-site-store-product-page-US-10` carries both cases, and both leaves of the Free pick-up group are reached
