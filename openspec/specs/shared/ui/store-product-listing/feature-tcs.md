# shared/ui/store-product-listing Test Cases

**Status:** in-review
**Drafts styled:** 2026-09-21, tcs-rules r3.0

## shared-ui-store-product-listing-US1: What the listing surface holds

**Walked by:** nobody on their own - a component contract; the journeys live in `grade10-site/store/home`, `grade10-site/store/product-listing` and `grade10-site/store/cross-sell`, which compose the surface
**As a** shopper reading a surface that composes the listing's tiles,
**I want** each tile to show what its surface supplies and to sell only where its surface sells,
**so that** a tile reads the same wherever the store draws it.

<!-- trace:case id=g10.shared-store-product-listing.TC-oqz rev=1 covers=none -->
### shared-ui-store-product-listing-US1-TC1-1: Sold-out tile with an activation target still opens its card

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** deprecated
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

<!-- trace:case id=g10.shared-store-product-listing.TC-mzb rev=1 covers=g10.shared-store-product-listing.SC-rzq -->
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

<!-- trace:case id=g10.shared-store-product-listing.TC-o4i rev=1 covers=g10.shared-store-product-listing.SC-3ob,g10.shared-store-product-listing.SC-9ml,g10.shared-store-product-listing.SC-vgm,g10.shared-store-product-listing.SC-bz2,g10.shared-store-product-listing.SC-0cf,g10.shared-store-product-listing.SC-oxx,g10.shared-store-product-listing.SC-uoy,g10.shared-store-product-listing.SC-la7,g10.shared-store-product-listing.SC-exb,g10.shared-store-product-listing.SC-eds,g10.shared-store-product-listing.SC-0xx,g10.shared-store-product-listing.SC-yv9,g10.shared-store-product-listing.SC-3n1,g10.shared-store-product-listing.SC-ck1,g10.shared-store-product-listing.SC-z64,g10.shared-store-product-listing.SC-ezf,g10.shared-store-product-listing.SC-iye -->
### shared-ui-store-product-listing-US1-TC3-1: Tile given its address opens as a link

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

* A product tile is drawn with its product's address and an activation target, and no cart control.

**Steps:**

1. Read the tile's photo and name.
2. Click the tile's name.
3. Ctrl-click (Cmd-click on a Mac) the tile's photo, then its name.

**Expected Results:**

* The photo and the name are both links to the product's address.
* Step 2 reports the tile's activation once, and the link itself is not followed.
* Step 3 opens the product in a new tab from each link and reports nothing, and the first tab stays where it was.

## Settled

None.

## Reconciliation

- **Raised** — nothing: the input settled both rules (`decisions.md` Q5, Q17, Q28; `ui-design.md` Components)
- **Uncovered anchors** — none of this delta's: `shared-ui-store-product-listing-SC-92` is walked by `shared-ui-store-product-listing-US1-TC2-1`, `shared-ui-store-product-listing-SC-93` by `shared-ui-store-product-listing-US1-TC3-1`
- **Retired** - `shared-ui-store-product-listing-US1-TC1-1`: a sold-out tile that opens where it does not sell is `activate-listing-tile-by-name`'s rule, in its tile requirement, and that change's suite walks it (Q56); this change lands first and states no scenario for it, so the case is retired
- **Trace fixed** - US1-TC3's `covers` named, beside the durable ones, scenarios only three other active changes issue; it now names the scenarios serving Tile contract in the durable spec and this delta, as the rulebook's **Trace identity** sets
- **Cases added after the reconciliation** — US1-TC3 (`shared-ui-store-product-listing-SC-93`, the tile as a link, Q52): written from the scenario, so it is not blind
- **QA2 again, 2026-10-07** - US1-TC2's `covers` names the one scenario serving Selling is opt-in, and US1-TC3's every scenario serving Tile contract, in the durable spec and this delta; nothing raised

**Run:** Blind feature pass on `shared/ui/store-product-listing`, run for `add-store-cross-sell`. Read: the isolated bundle under `.round/blind-store-product-listing/` — `outline.md` (`## Purpose`, `## Feature set` only), `user-journeys.md`, `decisions.md`, `ui-design.md`, `prd-cross-sell.md`, `prd-store-product-listing.md`, `context.md` — plus `docs/governance/specs-to-test-cases.md` for the rulebook and `openspec/specs/grade10-site/auction/auction/feature-tcs.md` for house style. Denied: the capability's `## Requirements` in `spec.md`, every other file under `openspec/specs/` and `openspec/changes/`, and `openspec/changes/archive/` entirely.
