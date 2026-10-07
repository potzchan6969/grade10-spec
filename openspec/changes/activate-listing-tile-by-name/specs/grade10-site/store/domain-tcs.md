# grade10-site/store Cross-Feature E2E Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## grade10-site-store-e2e-US1: Collector enters a collection and opens a product

**As a** collector,
**I want** to move from a collection on the Store front door to a product's
own page,
**so that** I can inspect the card I chose in the catalogue.

<!-- trace:case id=g10.store-domain.TC-k4u rev=2 covers=g10.store-home.SC-z40,g10.store-home.SC-uh3,g10.store-home.SC-wdv,g10.store-home.SC-j65,g10.store-home.SC-lc4,g10.store-product-listing.SC-aty,g10.store-product-listing.SC-ksc,g10.store-product-listing.SC-o37,g10.store-product-page.SC-wo0,g10.store-product-page.SC-21y -->
### grade10-site-store-e2e-US1-TC1-2: Collection tile leads to its product page

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-home-US-02, grade10-site-store-product-listing-US-02, grade10-site-store-product-page-US-02

**Pre-conditions:**

* `<collection>` is listed on the Store front door and holds `<product>`.
* `<product>` is listed in `<collection>` and is for sale.

**Steps:**

1. Navigate to `<grade10 store url>`.
2. Open the tile for `<collection>`.
3. Check the collection shown as the listing narrowing.
4. Open the card for `<product>`.

**Expected Results:**

* The Store front door renders with `<collection>` as a collection tile.
* The browse listing shows `<collection>` as the narrowing in force.
* Step 4 opens `<product>`'s own product page.

## Reconciliation

- **Re-worded** - US1-TC1 opened any product in the collection from the listing; the listing now keeps a sold-out card shut, so `<product>` is for sale; which control opens it is the listing's feature suite's. Its meaning moved, so it is revision 2
- **Raised** - nothing: no other cross-feature path is introduced; a sold-out card from the front door's row stays US3-TC1's, whose row does not sell and so still opens it
- **Shared with** - `add-store-product-status` carries US1-TC1 at revision 1, any product in the collection; the fold refuses that copy once this one lands, so that change rewrites its case against revision 2
- **Identical path** - `pnpm run tcs:validate` warns that US1-TC1-2 and the durable US1-TC1-1 walk one path; they are one case at two revisions, and the fold keeps revision 2 alone

**Run:** 2026-10-06, the domain check of `activate-listing-tile-by-name` at QA2: the change touches `grade10-site/store/product-listing` and `grade10-site/store/product-page`, and US1-TC1 traces both.
