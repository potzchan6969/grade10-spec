# grade10-site/store Cross-Feature E2E Test Cases

**Status:** pending-review · 0/1
**Drafts styled:** 2026-10-23, tcs-rules r6

## g10.store-dmn.US11: Shopkeeper scans a shelf product and opens its store page

**As a** shopkeeper,
**I want** the product the scanner names to open on its store page with the
same title, price and availability,
**so that** what I tell a customer at the shelf is what the store sells them
online.

<!-- trace:case id=g10.store-dmn.TC-k7u rev=2 covers=g10.store-product-page.SC-f3 -->
### g10.store-dmn.US11-TC2: Missing scanned product shows Store recovery state

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-shelf-scanning.US1, g10.store-shelf-scanning.US2, g10.store-shelf-scanning.US3, g10.store-shelf-scanning.US4, grade10-site-store-product-page-US-01

**Pre-conditions:**

* admin(shopkeeper) has the shop's scanner link open on a phone.

**Test data:**

| Field | Value |
| --- | --- |
| `<missing product scan>` | A shelf label whose scanner link names a known Store product route with no catalogue product |
| `<missing product url>` | The Store product URL from `<missing product scan>` |
| `<grade10 browse listing url>` | The Store product listing URL |
| `<unknown route>` | An arbitrary URL that is not matched to an owned Grade10 surface |

**Steps:**

1. Point the camera at `<missing product scan>` on the shelf.
2. Open the Store product link from the scan.
3. Check the response status and rendered page.
4. Click `Browse the store`.
5. Check the browser destination.
6. Navigate to `<unknown route>` outside an owned Grade10 surface and check its response status and rendered page.

**Expected Results:**

* Step 2 opens `<missing product url>`.
* Response status is 404.
* The existing Store shell remains visible, including its header and footer.
* The title reads `We couldn’t find this product`.
* The description reads `Check the address, or browse the store for what is available.`.
* `Browse the store` is visible as the recovery action.
* No product details, Add to cart control, or related-product rail is shown.
* Step 4 opens `<grade10 browse listing url>` in the same tab.
* Step 6 returns status 404 and shows the generic site-wide not-found surface with `Nothing is here`, its existing explanation, and `Back to Home`.

## Settled

- A missing product reached from a shop-floor scan follows the Store product route's product-specific 404 state; an unrelated unknown address remains on the generic site-wide not-found surface.

## Reconciliation

**Run:** QA2 reconciliation, 2026-10-23. QA1 read the existing Store domain suite with its reconciliation stripped, the frozen product-page anchors and PM bundle, and was denied the requirement text, Dev artifacts and archive material. Dev independently planned the product-page scenarios without reading QA1's suites. QA2 compared the domain draft with the product-page delta and retained this composed path because the durable domain journey already traces the product-page US-01 anchor.

- **Folded in** - `g10.store-dmn.US11-TC2` to `grade10-site-store-product-page-SC-03`; its scan-to-product route asserts the same Store 404 state and its final unrelated-route check preserves the generic boundary.
- **Raised** - none.
- **Contradicted** - none.
- **Uncovered anchors** - none for this domain draft.

