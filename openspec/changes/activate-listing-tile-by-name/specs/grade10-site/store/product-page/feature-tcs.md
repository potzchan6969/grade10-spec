# grade10-site/store/product-page Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## grade10-site-store-product-page-US2: Collector opens a card from the storefront

**As a** collector,
**I want** to reach a card's own address from the grid without a page load,
**so that** the card I opened is the one I land on, at an address that answers
on its own.

### grade10-site-store-product-page-US2-TC1-1: Card opens from the grid at its own address

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
* **Trace:** grade10-site-store-product-page-US-02

**Pre-conditions:**

* The catalogue holds `<card_1>`, published and for sale.

**Steps:**

1. Navigate to `<grade10 browse listing url>`.
2. Scroll until `<card_1>` shows in the grid.
3. Click `<card_1>`'s photo.

**Expected Results:**

* Step 3 opens `<card_1>`'s page at `<lang>/store/products/<handle>` for `<card_1>`.
* The page renders without a full document load.

## Reconciliation

- **Re-worded** — US2-TC1 opened any published card from the grid; the requirement now holds only for a card that opens, and the listing keeps a sold-out card shut (Q12, Q3), so its card is for sale and its grid is the browse listing
- **Walked** — `grade10-site-store-product-page-SC-05` by US2-TC1
- **Out of suite** — which cards open, and from which control, is the surface's rule: a sold-out card on the listing by `grade10-site/store/product-listing`'s US16-TC2, a sold-out card on the front door's row by `grade10-site-store-e2e-US3-TC1-1`
- **Carried, not this change's** — `grade10-site-store-product-page-SC-06` and its case US2-TC2 are unchanged on the durable suite
- **Raised** — nothing
- **Not blind** — no blind pass has read this delta; US2-TC1 was re-worded at the 2026-10-06 reconciliation from the durable case, with the scenarios in sight
