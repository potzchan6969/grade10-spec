# shared/ui/store-product-listing Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## shared-ui-store-product-listing-US1: What the listing surface holds

**Walked by:** nobody on their own - a component contract; the journeys live in `grade10-site/store/home`, `grade10-site/store/product-listing` and `grade10-site/store/cross-sell`, which compose the surface
**As a** shopper reading a surface that composes the listing's tiles,
**I want** each tile to show what its surface supplies and to sell only where its surface sells,
**so that** a tile reads the same wherever the store draws it.

<!-- trace:case id=g10.shared-store-product-listing.TC-d6j rev=1 covers=g10.shared-store-product-listing.SC-ws9 -->
### shared-ui-store-product-listing-US1-TC15-1: Photo draws as supplied in an available, on-sale or in-cart tile

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Tile contract

**Pre-conditions:**

* Storybook renders `ProductCardImage` in the story the row names.

**Test data:**

| Tile status | Story | Photo |
| --- | --- | --- |
| Available | `<grade10 ui storybook url>?path=/story/store-product-listing-productcardimage--default` | `<white-fill photo url>`, a product photo on a white studio fill, wider than it is tall |
| On sale | `<grade10 ui storybook url>?path=/story/store-product-listing-productcardimage--sale` | `<white-fill photo url>`, a product photo on a white studio fill, wider than it is tall |
| In cart | `<grade10 ui storybook url>?path=/story/store-product-listing-productcardimage--in-cart` | `<white-fill photo url>`, a product photo on a white studio fill, wider than it is tall |

**Steps:**

1. Navigate to the row's story.
2. In the story's Controls panel, set the image source to `<white-fill photo url>`.
3. Open `<white-fill photo url>` in a new tab.
4. Compare the tile's photo with the file in that tab.
5. Inspect the photo in the browser's developer tools.

**Expected Results:**

* Step 1 shows the tile in the row's status, photo in its grey well.
* Step 4: the photo's white fill reads white, as in the file.
* Step 4: the photo's colours match the file, with no grey cast.
* Step 5: the photo's computed blend mode is `normal`.

<!-- trace:case id=g10.shared-store-product-listing.TC-ema rev=1 covers=g10.shared-store-product-listing.SC-ta3 -->
### shared-ui-store-product-listing-US1-TC16-1: Sold-out photo draws as supplied under the sold-out treatment

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Tile contract

**Pre-conditions:**

* Storybook renders `ProductCardImage` sold out, in the story the row names.

**Test data:**

| Where the tile is | Story | Photo |
| --- | --- | --- |
| A surface that sells, where the tile stays inert | `<grade10 ui storybook url>?path=/story/store-product-listing-productcardimage--sold-out` | `<white-fill photo url>`, a product photo on a white studio fill, wider than it is tall |
| A surface that does not sell, where the tile opens | `<grade10 ui storybook url>?path=/story/store-product-listing-productcardimage--sold-out-with-handler` | `<white-fill photo url>`, a product photo on a white studio fill, wider than it is tall |

**Steps:**

1. Navigate to the row's story.
2. In the story's Controls panel, set the image source to `<white-fill photo url>`.
3. Inspect the photo in the browser's developer tools.

**Expected Results:**

* Step 1 shows the tile sold out, photo in its grey well.
* Step 2: the sold-out treatment draws over the photo.
* Step 3: the photo's computed blend mode is `normal`.

<!-- trace:case id=g10.shared-store-product-listing.TC-5u0 rev=1 covers=g10.shared-store-product-listing.SC-ws9 -->
### shared-ui-store-product-listing-US1-TC17-1: Every store surface drawing the tile shows the photo as supplied

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Tile contract

**Pre-conditions:**

* `<white-fill product>` is for sale and shows on each surface the rows name.

**Test data:**

| Surface | Where | Product |
| --- | --- | --- |
| Product listing | `<grade10 store url>/store/collections`, the tile of `<white-fill product>` | `<white-fill product>`, for sale, its photo on a white studio fill, wider than it is tall |
| Store home's row of cards | `<grade10 store url>/store`, the merchandised row, the tile of `<white-fill product>` | `<white-fill product>`, for sale, its photo on a white studio fill, wider than it is tall |
| You May Also Like | `<grade10 store url>/store/products/<a product whose rail lists it>`, the rail's tile of `<white-fill product>` | `<white-fill product>`, for sale, its photo on a white studio fill, wider than it is tall |

**Steps:**

1. Navigate to the row's page.
2. Scroll to the tile of `<white-fill product>`.
3. Open the tile photo's file in a new tab.
4. Compare the tile's photo with the file in that tab.
5. Inspect the tile's photo in the browser's developer tools.

**Expected Results:**

* Step 2 shows the tile, photo in its grey well.
* Step 4: the photo's white fill reads white, as in the file.
* Step 5: the photo's computed blend mode is `normal`.

## Reconciliation

**Run:** 2026-10-06, QA2 reconciliation for `drop-product-listing-photo-multiply`, in a fresh context. Joined the three blind cases and the delta's two scenarios on `Tile contract` and its `Photo as supplied` part. Read the delta `spec.md`, `user-journeys.md`, `proposal.md`, `decisions.md`, `ui-design.md`, `tasks.md`, the page [Product Listing Blocks](../../../../../../../docs/prds/products/shared/ui/store-product-listing.md), `packages/ui/src/blocks/store-product-listing/product-card-image.tsx` and its stories, and the application's listing, home and You May Also Like surfaces and their end-to-end tests. No durable suite or `## Settled` exists for this capability, and no `domain-tcs.md` traces it.

**Rerun:** 2026-10-07, fresh context, on the stack above `activate-listing-tile-by-name`. Every disposition below holds against the delta, `product-card-image.tsx` and its five stories. `shared-ui-store-product-listing-SC-64` is this change's own id, issued 2026-09-09 before the stack's `SC-92` to `SC-101`; `SC-64a` sits beside it, and the cases take `US1-TC15` to `US1-TC17`, above the stack's `US1-TC12`.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `shared-ui-store-product-listing-US1-TC15-1` | Reached | `shared-ui-store-product-listing-SC-64` for available, on sale and in cart: the photo unblended, its white fill white in the grey well |
| `shared-ui-store-product-listing-US1-TC16-1` | Reached | `shared-ui-store-product-listing-SC-64a`, sold out where the tile stays inert (`SoldOut`) and where it opens (`SoldOutWithHandler`). The rows match the stories: `SoldOut` keeps its cart handler and has no activation; `SoldOutWithHandler` opens and draws no cart |
| `shared-ui-store-product-listing-US1-TC17-1` | Reached | `shared-ui-store-product-listing-SC-64` on the store listing (`/store/collections`), the store home row (`/store`) and You May Also Like (`/store/products/:handle`), the surfaces `proposal.md` names. It is the walk group 3 of `tasks.md` keeps as the end-to-end guard |
| `shared-ui-store-product-listing-SC-64` | Reached | US1-TC15, US1-TC17 |
| `shared-ui-store-product-listing-SC-64a` | Reached | US1-TC16 |

- **Raised for the human** - none from the blind pass. R1 in `decisions.md`, whether the designer redraws the Figma frame, was raised at review and is handed to the redraw-store-product-card-frames change as Q2; no case depends on it
- **Folded** - none: no case carries an outcome the scenarios do not state
- **Rejected** - none
- **Contradicted** - none: where a case and a scenario state the same behaviour they agree
- **Automation** - `tasks.md` 1.1 flips US1-TC15 and US1-TC16 to `automated`, decided by `product-card-image.stories.tsx`; 3.1 flips US1-TC17, decided by the application's `product-photo.spec.ts`, one test per surface
