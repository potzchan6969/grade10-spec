# shared/ui/store-product-listing Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## shared-ui-store-product-listing-US1: What the listing surface holds

**Walked by:** nobody on their own - a component contract; the journeys live in `grade10-site/store/home`, `grade10-site/store/product-listing` and `grade10-site/store/cross-sell`, which compose the surface
**As a** shopper reading a surface that composes the listing's tiles,
**I want** each tile to show what its surface supplies and to sell only where its surface sells,
**so that** a tile reads the same wherever the store draws it.

<!-- trace:case id=g10.shared-store-product-listing.TC-pov rev=1 covers=g10.shared-store-product-listing.SC-3ob,g10.shared-store-product-listing.SC-9ml,g10.shared-store-product-listing.SC-vgm,g10.shared-store-product-listing.SC-bz2,g10.shared-store-product-listing.SC-0cf,g10.shared-store-product-listing.SC-oxx,g10.shared-store-product-listing.SC-7pj,g10.shared-store-product-listing.SC-d3u,g10.shared-store-product-listing.SC-e9w,g10.shared-store-product-listing.SC-14a,g10.shared-store-product-listing.SC-t2f,g10.shared-store-product-listing.SC-30a,g10.shared-store-product-listing.SC-uoy,g10.shared-store-product-listing.SC-la7,g10.shared-store-product-listing.SC-exb,g10.shared-store-product-listing.SC-eds,g10.shared-store-product-listing.SC-0xx,g10.shared-store-product-listing.SC-yv9,g10.shared-store-product-listing.SC-3n1,g10.shared-store-product-listing.SC-ck1,g10.shared-store-product-listing.SC-z64,g10.shared-store-product-listing.SC-ezf,g10.shared-store-product-listing.SC-iye,g10.shared-store-product-listing.SC-ws9,g10.shared-store-product-listing.SC-ta3,g10.shared-store-product-listing.SC-8fs,g10.shared-store-product-listing.SC-vsm -->
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

* `ProductCardImage` is open in Storybook, drawn as its Non Square Photo story, `<portrait photo>` in one well per status.
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
| `<portrait photo>` | `product-card.portrait.fixture.png`, taller than wide |

**Steps:**

1. Find the well that draws `<portrait photo>` in the row's **Status**.
2. Look at the photo's top and bottom edges.
3. Look at the space left and right of the photo.

**Expected Results:**

* Step 1 shows the well square, in the row's **Status**.
* Step 2: the photo's top and bottom edges meet the well's top and bottom, nothing cut off.
* Step 3: the well's own background fills an equal space on each side of the photo.
* Sold out row: the whole photo is faded.

<!-- trace:case id=g10.shared-store-product-listing.TC-vn1 rev=1 covers=g10.shared-store-product-listing.SC-3ob,g10.shared-store-product-listing.SC-9ml,g10.shared-store-product-listing.SC-vgm,g10.shared-store-product-listing.SC-bz2,g10.shared-store-product-listing.SC-0cf,g10.shared-store-product-listing.SC-oxx,g10.shared-store-product-listing.SC-7pj,g10.shared-store-product-listing.SC-d3u,g10.shared-store-product-listing.SC-e9w,g10.shared-store-product-listing.SC-14a,g10.shared-store-product-listing.SC-t2f,g10.shared-store-product-listing.SC-30a,g10.shared-store-product-listing.SC-uoy,g10.shared-store-product-listing.SC-la7,g10.shared-store-product-listing.SC-exb,g10.shared-store-product-listing.SC-eds,g10.shared-store-product-listing.SC-0xx,g10.shared-store-product-listing.SC-yv9,g10.shared-store-product-listing.SC-3n1,g10.shared-store-product-listing.SC-ck1,g10.shared-store-product-listing.SC-z64,g10.shared-store-product-listing.SC-ezf,g10.shared-store-product-listing.SC-iye,g10.shared-store-product-listing.SC-ws9,g10.shared-store-product-listing.SC-ta3,g10.shared-store-product-listing.SC-8fs,g10.shared-store-product-listing.SC-vsm -->
### shared-ui-store-product-listing-US1-TC19-1: Landscape, square and small photos each show whole

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

* `ProductCardImage` is open in Storybook.
* The pointer rests outside every well.

**Test data:**

| Story | Photo | Shape | Outcome |
| --- | --- | --- | --- |
| Non Square Photo | `<landscape photo>` | wider than tall | left and right edges meet the well; the well fills above and below equally |
| Default | `<square photo>` | square, at the limit | the photo fills the well; no well shows beside it; only its corners round with the well's |
| Non Square Photo | `<small photo>` | taller than wide, smaller than the well | enlarged until its top and bottom edges meet the well; the well fills left and right equally |

| Field | Value |
| --- | --- |
| `<landscape photo>` | `product-card.landscape.fixture.png` |
| `<square photo>` | `product-card.fixture.png` |
| `<small photo>` | `product-card.small.fixture.png` |

**Steps:**

1. Open the row's **Story**.
2. Find the available well that draws the row's **Photo**.
3. Compare the well with the row's **Photo** opened on its own.

**Expected Results:**

* Step 2 shows the well square.
* Step 3 matches the row's **Outcome**.
* Step 3: every edge of the photo opened on its own also shows in the well, all but the corners the row's **Outcome** rounds.

<!-- trace:case id=g10.shared-store-product-listing.TC-e18 rev=1 covers=g10.shared-store-product-listing.SC-3ob,g10.shared-store-product-listing.SC-9ml,g10.shared-store-product-listing.SC-vgm,g10.shared-store-product-listing.SC-bz2,g10.shared-store-product-listing.SC-0cf,g10.shared-store-product-listing.SC-oxx,g10.shared-store-product-listing.SC-7pj,g10.shared-store-product-listing.SC-d3u,g10.shared-store-product-listing.SC-e9w,g10.shared-store-product-listing.SC-14a,g10.shared-store-product-listing.SC-t2f,g10.shared-store-product-listing.SC-30a,g10.shared-store-product-listing.SC-uoy,g10.shared-store-product-listing.SC-la7,g10.shared-store-product-listing.SC-exb,g10.shared-store-product-listing.SC-eds,g10.shared-store-product-listing.SC-0xx,g10.shared-store-product-listing.SC-yv9,g10.shared-store-product-listing.SC-3n1,g10.shared-store-product-listing.SC-ck1,g10.shared-store-product-listing.SC-z64,g10.shared-store-product-listing.SC-ezf,g10.shared-store-product-listing.SC-iye,g10.shared-store-product-listing.SC-ws9,g10.shared-store-product-listing.SC-ta3,g10.shared-store-product-listing.SC-8fs,g10.shared-store-product-listing.SC-vsm -->
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
* `<slab card>` is in the Main Page's merchandised row, by the recipe "Put a card in the Main Page's merchandised row".
* `<slab card>` is a pick on `<another card>`, by the recipe "Choose picks on a staging-shop card".
* The browser window is the row's **Viewport** wide.
* The pointer rests outside the tile for `<slab card>`.

**Test data:**

| Surface | Page | Viewport | Outcome |
| --- | --- | --- | --- |
| Store listing | `<grade10 browse listing url>` | 1440 pixels | whole slab in the tile |
| Store listing | `<grade10 browse listing url>` | 390 pixels | whole slab in the tile |
| Main Page row | `<grade10 store url>` | 1440 pixels | whole slab in the tile |
| You May Also Like | `<another card>`'s page | 1440 pixels | whole slab in the tile |

| Field | Value |
| --- | --- |
| `<slab card>` | a graded slab for sale, not in the cart |
| `<slab photo>` | a studio photo of the whole slab, label to base, taller than wide, shot on white so its edges show against the well |
| `<another card>` | any other card for sale on the staging storefront |

**Steps:**

1. Navigate to the row's **Page**.
2. Scroll to the tile for `<slab card>`.
3. Look at the slab's label at the top of the photo.
4. Look at the slab's base at the bottom of the photo.
5. Look at the space left and right of the photo.

**Expected Results:**

* Step 2 shows the tile with its well square.
* Step 3: the whole label shows, its top edge inside the well.
* Step 4: the slab's base shows, its bottom edge inside the well.
* Step 5: the well's own background fills an equal space on each side of the photo.

## Settled

- **Hover** - a photo the tile grows on hover may lose its edges until the pointer leaves; the whole photo holds at rest
- **Position and size** - a photo that leaves part of the well empty sits centred, scaled up or down until it meets the two edges along its longer side
- **Corners** - a square photo, or one close enough to square that its corners reach into the well's rounded corners, rounds with them there, which is not a crop

## Reconciliation

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `shared-ui-store-product-listing-US1-TC18-1` | Folded | `shared-ui-store-product-listing-SC-63` in all four statuses on the portrait photo. Sharpened to a pointer outside the wells, since the scenario reads the photo at rest (Q4) |
| `shared-ui-store-product-listing-US1-TC19-1` | Folded | `shared-ui-store-product-listing-SC-63` for the landscape and the small photo: its equal space either side and its enlarged small photo are Q5, raised by the blind pass as R3. The square row is `shared-ui-store-product-listing-SC-63a` at its limit: its corners round with the well's, which Q6 settles is not a crop, so its every-edge result now spares the corners the row rounds. Its portrait row is dropped: it walked US1-TC18's available row by the same route. Sharpened to a pointer outside the wells (Q4), and to the story fixtures in place of photos the tester uploads |
| `shared-ui-store-product-listing-US1-TC20-1` | Folded | `shared-ui-store-product-listing-SC-63` on the store listing, the Main Page row and You May Also Like. Sharpened to a pointer outside the tile (Q4), and to a slab photo shot on white, so the space beside the photo is told apart from the photo's own ground |
| `shared-ui-store-product-listing-SC-63` | Reached | US1-TC18, US1-TC19, US1-TC20. Their photos are far enough from square that their corners clear the well's rounded corners, as the scenario's GIVEN states: the play test holds the story fixtures to it, and a slab, label to base, is far from square. Its revision moves to 3, since its GIVEN no longer takes a photo close to square |
| `shared-ui-store-product-listing-SC-63a` | Reached | US1-TC19's square row. A photo close to square meets the same rule on two edges, and `Default`'s play test reads the same geometry, so no fixture of its own is needed |
| The requirement's hover clause | Uncovered, with reason | A permission, not an outcome: the well may clip a grown photo until the pointer leaves (Q4). No scenario states it, and no case walks it |

- **Raised, landed** - R2 landed as Q4 and R3 as Q5, both in `## Settled`. R1 landed as Q7: showing the whole photo is not measured, and no case depends on it. Q6, the photo's corners, came from the accept review and is in `## Settled` too
- **Rejected** - the blind pass's case for the photo drawn without multiply: `drop-product-listing-photo-multiply` owns that requirement, so its cases are that change's
- **Contradicted** - none: where a case and a scenario state the same behaviour, they agree
- **Uncovered** - no scenario. Only the hover clause, which states no outcome
- **Automated by the story** - the Non Square Photo play test decides US1-TC18 whole, and with the same play test on `Default` it decides US1-TC19 whole; group 1 flips both. US1-TC20 stays manual, under `### Manual`
- **Ids moved** - the blind pass issued US1-TC11 to US1-TC14. On this capability, `add-store-cross-sell` holds US1-TC1 to US1-TC3, and the open planning branches of `activate-listing-tile-by-name` and `drop-product-listing-photo-multiply` hold US1-TC4 to US1-TC12 and US1-TC15 to US1-TC17. The three kept here are US1-TC18 to US1-TC20

**Run:** QA2 reconciliation on 2026-10-06 for `fit-product-listing-photo`, in a fresh context, after the second accept review restated the corner rule in Q6 and split `shared-ui-store-product-listing-SC-63` and `shared-ui-store-product-listing-SC-63a` at the well's rounded corners. Read the change's proposal, decisions, journeys, UI design, technical design, tasks and delta `spec.md`, the page [Product Listing Blocks](../../../../../../../docs/prds/products/shared/ui/store-product-listing.md), the durable `spec.md`, the open changes and their planning branches on this capability for their ids, `docs/governance/tcs-conventions.md` for the recipes the cases name, `packages/ui/src/blocks/store-product-listing/product-card-image.tsx` and its stories for what ships, and the application's `StoreHomePage.tsx` and catalogue collection read for the Main Page row's recipe. No `domain-tcs.md`, `product-tcs.md` or `platform-tcs.md` traces this capability, so no suite above it moves. The blind pass left no Run line, so what it read is not on record; its questions are R2 and R3 in `decisions.md`.

### Manual

What stays manual, and why. Each row names the test that proves part of the case, in these words, and what a person walks beyond it:

- the walk - `apps/frontend/grade10/e2e/tests/store/listing-photo.spec.ts`, in the application repository, one test per surface, each citing the case; its stack answers every photo with a stand-in, so the shop's own photo address is not in play

| Manual | Why |
| --- | --- |
| `shared-ui-store-product-listing-US1-TC20-1` | to be walked in group 3's walk, which proves the whole photo on the store listing, the Main Page row and You May Also Like; a person reads a real slab photo, served from the shop's own address, on each surface of the staging storefront |
