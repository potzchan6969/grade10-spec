# shared/ui/store-product-listing Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-21, tcs-rules r3.0

## shared-ui-store-product-listing-US1: What the listing surface holds

**Walked by:** nobody on their own — a component contract; the journeys live in `grade10-site/store/home` and `grade10-site/store/product-listing`, which compose the surface
**As a** shopper reading a surface that composes the listing's tiles,
**I want** each tile to show what its surface supplies and to sell only where its surface sells,
**so that** a tile reads the same wherever the store draws it.

### shared-ui-store-product-listing-US1-TC1-1: Sold-out tile with an activation target still opens its card

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Tile contract

**Decided by:** `packages/ui/src/blocks/store-product-listing/product-card.stories.tsx`

**Pre-conditions:**

* A product tile is drawn marked sold out, with an activation target and no cart control supplied.

**Steps:**

1. Click the tile's name or image.

**Expected Results:**

* The tile opens its product.
* The tile still shows its sold-out treatment.
* No cart control is drawn on the tile.

### shared-ui-store-product-listing-US1-TC2-1: Tile drawn with no cart control does not require cart copy

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** Selling is opt-in

**Decided by:** `packages/ui/src/blocks/store-product-listing/product-card.stories.tsx`

**Pre-conditions:**

* A product tile is drawn with no cart control supplied and no cart wording given.

**Steps:**

1. Render the tile.

**Expected Results:**

* The tile renders its image, name and price.
* No cart control is drawn on the tile.
* No cart wording appears on the tile.

## Settled

None yet.

## Reconciliation

- **Raised** — nothing: the input settled both rules (`decisions.md` Q5, Q17, Q28; `ui-design.md` Components)
- **Uncovered anchors** — none of this delta's: `shared-ui-store-product-listing-SC-91` is walked by `shared-ui-store-product-listing-US1-TC1-1`, `shared-ui-store-product-listing-SC-92` by `shared-ui-store-product-listing-US1-TC2-1`

**Run:** Blind feature pass on `shared/ui/store-product-listing`, run for `add-store-cross-sell`. Read: the isolated bundle under `.round/blind-store-product-listing/` — `outline.md` (`## Purpose`, `## Feature set` only), `user-journeys.md`, `decisions.md`, `ui-design.md`, `prd-cross-sell.md`, `prd-store-product-listing.md`, `context.md` — plus `docs/governance/specs-to-test-cases.md` for the rulebook and `openspec/specs/grade10-site/auction/auction/feature-tcs.md` for house style. Denied: the capability's `## Requirements` in `spec.md`, every other file under `openspec/specs/` and `openspec/changes/`, and `openspec/changes/archive/` entirely.
