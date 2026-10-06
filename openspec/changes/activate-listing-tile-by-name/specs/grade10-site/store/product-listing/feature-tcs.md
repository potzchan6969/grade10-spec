# grade10-site/store/product-listing Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## grade10-site-store-product-listing-US16: Collector opens a card from the listing

**As a** collector browsing the listing,
**I want** a card's name to open its product, as its photo does,
**so that** the name I read first takes me to the product I came for.

### grade10-site-store-product-listing-US16-TC1-1: Card's name and photo each open its own product page

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-listing-US-16

**Pre-conditions:**

* The catalogue lists more cards for sale than the listing's first page shows.
* `<card_1>` is for sale and shows on the listing's first page at rest.
* `<card_2>` is for sale and shows only after scrolling past the first page.

**Test data:**

| Card | Control | Outcome |
| --- | --- | --- |
| `<card_1>` | its name | `<card_1>`'s product page |
| `<card_1>` | its photo | `<card_1>`'s product page |
| `<card_2>` | its name | `<card_2>`'s product page |

**Steps:**

1. Navigate to `<grade10 browse listing url>`.
2. Scroll until the row's **Card** shows in the grid.
3. Click the row's **Control** on that card.

**Expected Results:**

* Step 3 opens the row's **Outcome**, at `<lang>/store/products/<handle>` for that card.
* The product page names the row's **Card**, not a neighbouring card.

### grade10-site-store-product-listing-US16-TC2-1: Sold-out card opens from neither its name nor its photo

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
* **Trace:** grade10-site-store-product-listing-US-16

**Pre-conditions:**

* `<card_3>` is sold out by the recipe "Sell a card out".

**Steps:**

1. Navigate to `<grade10 browse listing url>`.
2. Scroll until `<card_3>` shows in the grid.
3. Move the pointer over `<card_3>`'s name.
4. Click `<card_3>`'s name.
5. Click `<card_3>`'s photo.

**Expected Results:**

* `<card_3>` shows as sold out.
* Step 3 leaves the name plain text, not underlined.
* Steps 4 and 5 leave the listing open at `<grade10 browse listing url>`.

## Settled

None yet.

## Reconciliation

- **Raised** — nothing: the journey and the shared decisions settled both outcomes
- **Contradicted** — none: where a case and a scenario state the same outcome they agree
- **Walked** — `grade10-site-store-product-listing-SC-55` by US16-TC1, whose rows press a card's name and its photo, and a card's name past the first page; `grade10-site-store-product-listing-SC-56` by US16-TC2
- **Uncovered** — none of this delta's scenarios
- **Beyond the scenarios** — US16-TC2's plain name on hover is the shared rule that a name which does not open is plain, proven on the tile by the shared suite; it stays here as the listing's own view of it
- **Out of suite** — the name as the card's one keyboard stop is the shared tile's, walked by the shared suite; the listing adds nothing to it
- **Across levels** — the store's `grade10-site-store-e2e-US1-TC1-1` opens a card from this listing, so this change re-words it to a card for sale in its `domain-tcs.md`
- **Not blind** — US16-TC1 and US16-TC2 came from the 2026-10-06 pass, which left no Run line, and no blind pass has read this delta's anchors since they moved
