# shared/ui/store-product-listing Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-05, tcs-rules r4

## shared-ui-store-product-listing-US1: What the listing surface holds

**Walked by:** nobody on their own — a component contract; the journeys live in `grade10-site/store/home` and `grade10-site/store/product-listing`, which compose the surface
**As a** shopper reading a surface that composes the listing's tiles,
**I want** each tile to show what its surface supplies and to sell only where its surface sells,
**so that** a tile reads the same wherever the store draws it.

### shared-ui-store-product-listing-US1-TC4-1: Name opens the product the same way as the photo

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Tile contract

**Pre-conditions:**

* `ProductCard` is open in Storybook, drawn as its Named Once story, showing `<product_1>`.
* `<product_1>` is not sold out, and the tile is given an activation callback.
* The tile's cart handler is as the row's **Cart handler** says.

**Test data:**

| Product | Cart handler | Outcome |
| --- | --- | --- |
| `<product_1>` | supplied — the tile sells | name and photo each open `<product_1>` |
| `<product_1>` | not supplied — the tile does not sell | name and photo each open `<product_1>` |

**Steps:**

1. Open Storybook's Actions panel and clear it.
2. Click the tile's photo.
3. Clear the Actions panel.
4. Click the tile's name.

**Expected Results:**

* Step 2 logs one tile activation for `<product_1>`.
* Step 4 logs one tile activation for `<product_1>`, the same as step 2.
* Step 4 logs nothing else: no cart change, no second activation.

### shared-ui-store-product-listing-US1-TC5-1: Name in the browse grid opens its own product

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Tile contract

**Pre-conditions:**

* `ProductBrowse` is open in Storybook, drawn as its Default story, with a product activation callback supplied.
* The grid shows at least two products not sold out, `<product_1>` first and `<product_2>` second.

**Steps:**

1. Open Storybook's Actions panel and clear it.
2. Click `<product_2>`'s name in the grid.
3. Clear the Actions panel.
4. Click `<product_1>`'s name in the grid.

**Expected Results:**

* Step 2 logs one product activation, for `<product_2>`.
* Step 4 logs one product activation, for `<product_1>`.

### shared-ui-store-product-listing-US1-TC6-1: Name is plain at rest and underlined on hover

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** Tile contract

**Pre-conditions:**

* `ProductCard` is open in Storybook, drawn as its Named Once story, with an activation callback and a product not sold out.

**Steps:**

1. Read the tile's name with the pointer away from the tile.
2. Move the pointer over the name.
3. Move the pointer off the tile.

**Expected Results:**

* Step 1 shows the name as plain text, not underlined, as the Figma Product Card draws it.
* Step 2 underlines the name.
* Step 3 removes the underline.

### shared-ui-store-product-listing-US1-TC7-1: Name is the tile's one keyboard stop and opens from the keyboard

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Accessibility

**Pre-conditions:**

* `ProductCard` is open in Storybook, drawn as its Named Once story, showing `<product_1>`, not sold out, with an activation callback and a cart handler.
* A screen reader is on for step 7.

**Steps:**

1. Open Storybook's Actions panel and clear it.
2. Click the canvas above the tile, outside it.
3. Press Tab once at a time until focus leaves the tile.
4. Press Shift+Tab until focus is back on the tile's name.
5. Press Enter.
6. Press Space.
7. Move through the tile with the screen reader.

**Expected Results:**

* Step 3 stops on the name and on the cart control, and never on the photo; the cart control shows on the photo when focus reaches it.
* The focused name is underlined.
* Step 5 logs one tile activation for `<product_1>`.
* Step 6 logs one more tile activation for `<product_1>`, and the page does not scroll.
* Step 7 announces one control named for `<product_1>`; the photo is not announced as a control.

### shared-ui-store-product-listing-US1-TC8-1: Sold-out name and photo stay inert on a tile that sells

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
* **Trace:** Tile contract

**Pre-conditions:**

* `ProductCard` is open in Storybook, drawn as its Sold Out story, showing `<product_3>`.
* `<product_3>` is sold out, and the tile is given both an activation callback and a cart handler.

**Steps:**

1. Open Storybook's Actions panel and clear it.
2. Move the pointer over the tile's name.
3. Click the tile's name.
4. Click the tile's photo.
5. Click the canvas above the tile, outside it.
6. Press Tab through the tile.

**Expected Results:**

* The tile shows its sold-out treatment throughout.
* Step 2 leaves the name plain text, not underlined.
* Steps 3 and 4 log no tile activation.
* Step 6 never lands focus on the name or the photo.
* Neither the name nor the photo is offered as a link or a button.

### shared-ui-store-product-listing-US1-TC9-1: No activation callback leaves name and photo inert

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
* **Trace:** Tile contract

**Pre-conditions:**

* `ProductCard` is open in Storybook, showing `<product_1>`, not sold out, with its activation callback removed in the story's controls.

**Steps:**

1. Open Storybook's Actions panel and clear it.
2. Move the pointer over the tile's name.
3. Click the tile's name.
4. Click the tile's photo.
5. Click the canvas above the tile, outside it.
6. Press Tab through the tile.

**Expected Results:**

* Step 2 leaves the name plain text, not underlined.
* Steps 3 and 4 log no tile activation.
* Step 6 never lands focus on the name or the photo.
* Neither the name nor the photo is offered as a link or a button.

### shared-ui-store-product-listing-US1-TC10-1: Sold-out name and photo open on a tile that does not sell

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Tile contract

**Pre-conditions:**

* `ProductCard` is open in Storybook, drawn as its Sold Out Opens Where Nothing Sells story, showing `<product_3>`.
* `<product_3>` is sold out, and the tile is given an activation callback and no cart handler.

**Steps:**

1. Open Storybook's Actions panel and clear it.
2. Click the tile's name.
3. Click the tile's photo.

**Expected Results:**

* The tile shows its sold-out treatment throughout, and no cart control.
* Steps 2 and 3 each log one tile activation for `<product_3>`.

## Settled

None yet.

## Reconciliation

- **Raised, landed** — the blind pass asked three questions, each landed in `decisions.md`: which keys open the name (Q5: Enter and Space on a button, Enter on a link), whether the keyboard stops on the photo and the name or on one (Q6: the name alone, the one control announced), and whether an inert name takes the underline (Q7: no, plain text with no focus). US1-TC7 was re-worded to Tab stopping on the name and the cart control and never the photo, Enter and Space each reporting once, and one control announced; US1-TC8 and US1-TC9 to an inert name that stays plain text on hover and takes no focus
- **Raised, folded** — US1-TC6 and US1-TC7 assert the underline on hover and on keyboard focus that Q2 decides; the delta states it as `shared-ui-store-product-listing-SC-96`, which US1-TC6 walks on hover and US1-TC7 on focus, and US1-TC8 and US1-TC9 on a name that does not open
- **Contradicted** — none: where a case and a scenario state the same behaviour they agree
- **Uncovered anchors** — none of this delta's: `shared-ui-store-product-listing-SC-87` is walked by `shared-ui-store-product-listing-US1-TC4-1` on the tile and `shared-ui-store-product-listing-US1-TC5-1` in the browse grid, `shared-ui-store-product-listing-SC-88` by `shared-ui-store-product-listing-US1-TC8-1`, `shared-ui-store-product-listing-SC-89` by `shared-ui-store-product-listing-US1-TC9-1`, `shared-ui-store-product-listing-SC-95` by `shared-ui-store-product-listing-US1-TC7-1`, and `shared-ui-store-product-listing-SC-94` by `shared-ui-store-product-listing-US1-TC10-1`, since this suite is the one the durable suite starts from; `add-store-cross-sell`'s `shared-ui-store-product-listing-US1-TC1-1` is retired at that change's fold. `shared-ui-store-product-listing-SC-04` to `shared-ui-store-product-listing-SC-09` are carried unchanged in the modified requirement and are not this change's to cover
- **Carried, not this change's** — the image requirement's `shared-ui-store-product-listing-SC-46` to `shared-ui-store-product-listing-SC-50`, `shared-ui-store-product-listing-SC-52` to `shared-ui-store-product-listing-SC-54`, `shared-ui-store-product-listing-SC-65` and `shared-ui-store-product-listing-SC-66` are carried word for word; the capability's suite refresh owes them cases
- **Reworded for the one keyboard stop** — `shared-ui-store-product-listing-SC-51` moves focus into the image rather than onto it, where Tab now lands on the cart control, walked by US1-TC7's cart-control result; `shared-ui-store-product-listing-SC-55` keeps its outcome, no cart control on a surface that does not sell, which US1-TC10 shows on its tile with no cart handler
- **Cases added after the reconciliation** — US1-TC10 (`shared-ui-store-product-listing-SC-94`), written from the scenario at the acceptance review, so it is not blind

**Run:** Blind feature pass (QA1) on 2026-10-05 for `activate-listing-tile-by-name`, `shared/ui/store-product-listing`. Read the caller's isolated bundle only: the capability's Purpose and Feature set (outline), its `user-journeys.md`, the change's `proposal.md`, `decisions.md` with its Raised table, `ui-design.md` with scenario ids stripped, `openspec/config.yaml` context, the PRD pages `shared/ui/store-product-listing` and `grade10-site/store/product-listing`, and `add-store-cross-sell`'s in-flight suite for this capability with its Reconciliation stripped; plus `docs/governance/specs-to-test-cases.md` and `docs/governance/tcs-conventions.md`. Denied and not opened: every Requirements section, this change's delta `spec.md`, `openspec/specs/`, the rest of `openspec/changes/` and its archive, and `packages/` source.
