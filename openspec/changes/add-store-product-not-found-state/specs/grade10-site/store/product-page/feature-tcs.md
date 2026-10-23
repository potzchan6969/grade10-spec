# grade10-site/store/product-page Test Cases

**Status:** pending-review · 0/2
**Drafts styled:** 2026-10-23, tcs-rules r6

## g10.store-product-page.US1: Collector reads a card at its own address

**As a** collector,
**I want** a product address to answer with that card's own page, and to refuse
when the catalogue holds no such card,
**so that** the page I read is the card the address names rather than an empty
product page.

<!-- trace:case id=g10.store-product-page.TC-pv8 rev=2 covers=g10.store-product-page.SC-f3 -->
### g10.store-product-page.US1-TC1: Missing product shows its Store recovery state

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
* **Trace:** grade10-site-store-product-page-US-01

**Pre-conditions:**

None.

**Test data:**

| Field | Value |
| --- | --- |
| `<missing product url>` | A Store product URL with a well-formed product handle that the catalogue does not hold |
| `<grade10 browse listing url>` | The Store product listing URL |

**Steps:**

1. Navigate to `<missing product url>`.
2. Check the response status and rendered page.
3. Click `Browse the store`.
4. Check the browser destination.

**Expected Results:**

* Response status is 404.
* The existing Store shell remains visible, including its header and footer.
* The title reads `We couldn’t find this product`.
* The description reads `Check the address, or browse the store for what is available.`.
* `Browse the store` is visible as the recovery action.
* No product details, Add to cart control, or related-product rail is shown.
* Step 3 opens `<grade10 browse listing url>` in the same tab.

<!-- trace:case id=g10.store-product-page.TC-7nq rev=1 covers=g10.store-product-page.SC-f3 -->
### g10.store-product-page.US1-TC2: Generic unknown route keeps the site not-found state

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
* **Trace:** grade10-site-store-product-page-US-01

**Pre-conditions:**

None.

**Test data:**

| Field | Value |
| --- | --- |
| `<unknown route>` | An arbitrary URL that is not matched to an owned Grade10 surface |

**Steps:**

1. Navigate to `<unknown route>`.
2. Check the response status and rendered page.

**Expected Results:**

* Response status is 404.
* The generic site-wide not-found surface remains visible with `Nothing is here`.
* The generic explanation reads `The link may be wrong, or the page may have moved.`.
* `Back to Home` remains the recovery action.

## Settled

- The Store product route owns a product-specific 404 presentation; an arbitrary unknown address outside an owned surface keeps the generic site-wide not-found presentation.

## Reconciliation

**Run:** QA2 reconciliation, 2026-10-23. QA1 read the frozen `## Purpose` and `## Feature set`, this change's proposal, decisions, user journeys and UI design, the linked PRD pages, the existing product-page feature suite and Store domain suite with their reconciliation sections stripped, and was denied all requirement text, Dev artifacts and archive material. Dev independently read the PM bundle, the full durable product-page requirement, implementation evidence and the planning templates without reading QA1's suite. QA2 then read both drafts, the delta spec, technical design, tasks, decisions, durable suites and PRD; no archive material.

- **Folded in** - `g10.store-product-page.US1-TC1` to `grade10-site-store-product-page-SC-03` for the Store product route's 404, shell, localized product-specific copy, listing recovery action and absence of product/cart content; `g10.store-product-page.US1-TC2` to the same scenario for the unchanged generic unknown-route boundary.
- **Covered at domain** - `grade10.store-product-page-SC-03` is also walked by `g10.store-dmn.US11-TC2` in the change's Store domain suite.
- **Raised** - none.
- **Contradicted** - none.
- **Uncovered anchors** - none; the existing success-path scenario `grade10-site-store-product-page-SC-04` remains covered by the durable suite.

