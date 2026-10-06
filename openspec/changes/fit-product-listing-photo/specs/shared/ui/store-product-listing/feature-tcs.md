# shared/ui/store-product-listing Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## shared-ui-store-product-listing-US1: What the listing surface holds

**Walked by:** nobody on their own — a component contract; the journeys live in `grade10-site/store/home` and `grade10-site/store/product-listing`, which compose the surface
**As a** shopper reading a surface that composes the listing's tiles,
**I want** each tile to show what its surface supplies and to sell only where its surface sells,
**so that** a tile reads the same wherever the store draws it.

<!-- trace:case id=g10.shared-store-product-listing.TC-pov rev=1 covers=g10.shared-store-product-listing.SC-3ob,g10.shared-store-product-listing.SC-9ml,g10.shared-store-product-listing.SC-vgm,g10.shared-store-product-listing.SC-bz2,g10.shared-store-product-listing.SC-0cf,g10.shared-store-product-listing.SC-oxx,g10.shared-store-product-listing.SC-uoy,g10.shared-store-product-listing.SC-la7,g10.shared-store-product-listing.SC-exb,g10.shared-store-product-listing.SC-eds,g10.shared-store-product-listing.SC-0xx,g10.shared-store-product-listing.SC-yv9,g10.shared-store-product-listing.SC-3n1,g10.shared-store-product-listing.SC-ck1,g10.shared-store-product-listing.SC-z64,g10.shared-store-product-listing.SC-ezf,g10.shared-store-product-listing.SC-7pj,g10.shared-store-product-listing.SC-d3u,g10.shared-store-product-listing.SC-e9w,g10.shared-store-product-listing.SC-vxt,g10.shared-store-product-listing.SC-iye,g10.shared-store-product-listing.SC-8fs,g10.shared-store-product-listing.SC-ws9 -->
### shared-ui-store-product-listing-US1-TC18-1: Non-square photo shows whole in every tile status

Runs once per row of **Test data**.

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

* `ProductCardImage` is open in Storybook, drawn as its Non Square Photo story, one well per status side by side, each showing `<portrait photo>`.
* The pointer rests outside every well.

**Test data:**

| Status | Outcome |
| --- | --- |
| Available | whole photo, the well beside it |
| On sale | whole photo, the well beside it |
| Sold out | whole photo, faded, the well beside it |
| In cart | whole photo, the well beside it |

| Field | Value |
| --- | --- |
| `<portrait photo>` | the Non Square Photo story's portrait fixture, taller than wide |

**Steps:**

1. Find the well drawn in the row's **Status**.
2. Look at the photo's top and bottom edges.
3. Look at the space left and right of the photo.

**Expected Results:**

* Step 1 shows the well square, in the row's **Status**.
* Step 2: the photo's top and bottom edges meet the well's top and bottom, nothing cut off.
* Step 3: the well's own background fills an equal space on each side of the photo.
* Sold out row: the whole photo is faded.

<!-- trace:case id=g10.shared-store-product-listing.TC-vn1 rev=1 covers=g10.shared-store-product-listing.SC-3ob,g10.shared-store-product-listing.SC-9ml,g10.shared-store-product-listing.SC-vgm,g10.shared-store-product-listing.SC-bz2,g10.shared-store-product-listing.SC-0cf,g10.shared-store-product-listing.SC-oxx,g10.shared-store-product-listing.SC-uoy,g10.shared-store-product-listing.SC-la7,g10.shared-store-product-listing.SC-exb,g10.shared-store-product-listing.SC-eds,g10.shared-store-product-listing.SC-0xx,g10.shared-store-product-listing.SC-yv9,g10.shared-store-product-listing.SC-3n1,g10.shared-store-product-listing.SC-ck1,g10.shared-store-product-listing.SC-z64,g10.shared-store-product-listing.SC-ezf,g10.shared-store-product-listing.SC-7pj,g10.shared-store-product-listing.SC-d3u,g10.shared-store-product-listing.SC-e9w,g10.shared-store-product-listing.SC-vxt,g10.shared-store-product-listing.SC-iye,g10.shared-store-product-listing.SC-8fs,g10.shared-store-product-listing.SC-ws9 -->
### shared-ui-store-product-listing-US1-TC19-1: Portrait, landscape and square photos each show whole

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Tile contract

**Pre-conditions:**

* `ProductCardImage` is open in Storybook, drawn as its Default story, status Available.
* The pointer rests outside the well.

**Test data:**

| Photo | Shape | Outcome |
| --- | --- | --- |
| `<portrait photo>` | taller than wide | top and bottom edges meet the well; the well fills left and right equally |
| `<landscape photo>` | wider than tall | left and right edges meet the well; the well fills above and below equally |
| `<square photo>` | square, at the limit | the photo fills the well; no well shows beside it; only its corners round with the well's |
| `<small photo>` | taller than wide, smaller than the well | enlarged until its top and bottom edges meet the well; the well fills left and right equally |

| Field | Value |
| --- | --- |
| `<portrait photo>` | the Non Square Photo story's portrait fixture |
| `<landscape photo>` | a product photo 1600 × 1000 pixels (any photo wider than tall) |
| `<square photo>` | `product-card.fixture.png`, the square fixture the Default story uses |
| `<small photo>` | a product photo 80 × 120 pixels |

**Steps:**

1. Open the Controls panel.
2. Set the tile's image to the row's **Photo**.
3. Compare the tile with the row's **Photo** opened on its own.

**Expected Results:**

* Step 2 keeps the well square.
* Step 3 matches the row's **Outcome**.
* Step 3: every edge of the photo opened on its own also shows in the tile.

<!-- trace:case id=g10.shared-store-product-listing.TC-e18 rev=1 covers=g10.shared-store-product-listing.SC-3ob,g10.shared-store-product-listing.SC-9ml,g10.shared-store-product-listing.SC-vgm,g10.shared-store-product-listing.SC-bz2,g10.shared-store-product-listing.SC-0cf,g10.shared-store-product-listing.SC-oxx,g10.shared-store-product-listing.SC-uoy,g10.shared-store-product-listing.SC-la7,g10.shared-store-product-listing.SC-exb,g10.shared-store-product-listing.SC-eds,g10.shared-store-product-listing.SC-0xx,g10.shared-store-product-listing.SC-yv9,g10.shared-store-product-listing.SC-3n1,g10.shared-store-product-listing.SC-ck1,g10.shared-store-product-listing.SC-z64,g10.shared-store-product-listing.SC-ezf,g10.shared-store-product-listing.SC-7pj,g10.shared-store-product-listing.SC-d3u,g10.shared-store-product-listing.SC-e9w,g10.shared-store-product-listing.SC-vxt,g10.shared-store-product-listing.SC-iye,g10.shared-store-product-listing.SC-8fs,g10.shared-store-product-listing.SC-ws9 -->
### shared-ui-store-product-listing-US1-TC20-1: Slab tile shows the whole slab on every store surface

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** Tile contract

**Pre-conditions:**

* `<slab card>` is for sale on the staging storefront, its first photo `<slab photo>`.
* `<slab card>` is in the merchandised row for the first collection the catalogue lists.
* `<slab card>` is a pick on `<another card>`, by the recipe "Choose picks on a staging-shop card".
* The browser window is the row's **Viewport** wide.
* The pointer rests outside the tile for `<slab card>`.

**Test data:**

| Surface | Page | Viewport | Outcome |
| --- | --- | --- | --- |
| Store listing | `<grade10 store listing url>` | 1440 pixels | whole slab in the tile |
| Store listing | `<grade10 store listing url>` | 390 pixels | whole slab in the tile |
| Main Page row | `<grade10 store url>` | 1440 pixels | whole slab in the tile |
| You May Also Like | `https://grade10-stg.com/store/products/<another card handle>` | 1440 pixels | whole slab in the tile |

| Field | Value |
| --- | --- |
| `<slab card>` | a graded slab for sale, not in the cart |
| `<slab photo>` | a studio photo of the whole slab, label to base, taller than wide |
| `<another card>` | any other card for sale on the staging storefront |

**Steps:**

1. Navigate to the row's **Page**.
2. Scroll to the tile for `<slab card>`.
3. Look at the slab's label at the top of the photo.
4. Look at the slab's base at the bottom of the photo.
5. Look at the space beside the slab.

**Expected Results:**

* Step 2 shows the tile with its well square.
* Step 3: the whole label shows, its top edge inside the well.
* Step 4: the slab's base shows, its bottom edge inside the well.
* Step 5: the well's own background fills the space beside the slab.

## Settled

- **Hover** — a photo the tile grows on hover may lose its edges until the pointer leaves; the whole photo holds at rest
- **Position and size** — a photo that leaves part of the well empty sits centred, scaled up or down until it meets the two edges along its longer side

## Reconciliation

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `shared-ui-store-product-listing-US1-TC18-1` | Reached | `shared-ui-store-product-listing-SC-63` in all four statuses. Sharpened to a pointer outside the wells, since the scenario reads the photo at rest (Q4) |
| `shared-ui-store-product-listing-US1-TC19-1` | Reached, folded in part | `shared-ui-store-product-listing-SC-63` for each photo shape. Its equal space either side and its small-photo row are Q5, raised by this pass as R3 and now stated by the requirement and the scenario. The square row is the boundary; its corners round with the well's own shape, which is not a crop. Sharpened to a pointer outside the well (Q4) |
| `shared-ui-store-product-listing-US1-TC20-1` | Reached | `shared-ui-store-product-listing-SC-63` on the store listing, the store home row and You May Also Like. Sharpened to a pointer outside the tile (Q4) |
| `shared-ui-store-product-listing-SC-63` | Reached | US1-TC18, US1-TC19, US1-TC20 |
| The requirement's hover clause | Not walked | A permission, not an outcome: the well may clip a grown photo until the pointer leaves (Q4). No scenario states it and no case walks it |

- **Raised for the human** — R1, whether showing the whole photo is measured, is the product manager's, open on [Product Listing Blocks](../../../../../../../docs/prds/products/shared/ui/store-product-listing.md). No case depends on it
- **Raised, landed** — R2 landed as Q4 and R3 as Q5; both are in `## Settled`
- **Rejected** — the blind pass's case for the photo drawn without multiply: `drop-product-listing-photo-multiply` owns that requirement, so its cases are that change's
- **Contradicted** — none: where a case and a scenario state the same behaviour they agree
- **Ids moved** — the blind pass issued US1-TC11 to US1-TC14, which overlap the ids `activate-listing-tile-by-name` issues for this capability; the three this suite keeps are US1-TC18 to US1-TC20, after every id another open change holds

**Run:** QA2 reconciliation on 2026-10-06 for `fit-product-listing-photo`, in a fresh context. Read the change's proposal, decisions, journeys, UI design, technical design, tasks and delta `spec.md`, the page [Product Listing Blocks](../../../../../../../docs/prds/products/shared/ui/store-product-listing.md), and `packages/ui/src/blocks/store-product-listing/product-card-image.tsx` for what ships. No `domain-tcs.md`, `product-tcs.md` or `platform-tcs.md` traces this capability, so no suite above it moves. The blind pass left no Run line, so what it read is not on record; its questions are R2 and R3 in `decisions.md`.
