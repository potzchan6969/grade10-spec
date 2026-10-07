# shared/ui/store-product-listing Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-06, tcs-rules r4

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

<!-- trace:case id=g10.shared-store-product-listing.TC-e05 rev=1 covers=g10.shared-store-product-listing.SC-3ob,g10.shared-store-product-listing.SC-9ml,g10.shared-store-product-listing.SC-vgm,g10.shared-store-product-listing.SC-bz2,g10.shared-store-product-listing.SC-0cf,g10.shared-store-product-listing.SC-oxx,g10.shared-store-product-listing.SC-7pj,g10.shared-store-product-listing.SC-d3u,g10.shared-store-product-listing.SC-e9w,g10.shared-store-product-listing.SC-14a,g10.shared-store-product-listing.SC-t2f,g10.shared-store-product-listing.SC-30a,g10.shared-store-product-listing.SC-uoy,g10.shared-store-product-listing.SC-la7,g10.shared-store-product-listing.SC-exb,g10.shared-store-product-listing.SC-eds,g10.shared-store-product-listing.SC-0xx,g10.shared-store-product-listing.SC-yv9,g10.shared-store-product-listing.SC-3n1,g10.shared-store-product-listing.SC-ck1,g10.shared-store-product-listing.SC-z64,g10.shared-store-product-listing.SC-ezf,g10.shared-store-product-listing.SC-iye -->
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

* `ProductCard` is open in Storybook, drawn as the row's **Story**, showing `<product_1>`.
* `<product_1>` is not sold out, and the tile is given an activation callback.
* The tile's cart handler is as the row's **Cart handler** says.

**Test data:**

| Product | Story | Cart handler | Cart control |
| --- | --- | --- | --- |
| `<product_1>` | Named Once | supplied, so the tile sells | shows on the photo |
| `<product_1>` | Named Once Not Selling | not supplied, so the tile does not sell | none, on hover or on focus |

**Steps:**

1. Open Storybook's Actions panel and clear it.
2. Click the tile's photo.
3. Clear the Actions panel.
4. Click the tile's name.
5. Click the canvas above the tile, outside it.
6. Press Tab until focus leaves the tile.

**Expected Results:**

* Step 2 logs one tile activation for `<product_1>`.
* Step 4 logs one tile activation for `<product_1>`, the same as step 2.
* Step 4 logs nothing else: no cart change, no second activation.
* The cart control is as the row's **Cart control** says while the pointer is over the photo and while focus is in the tile.

<!-- trace:case id=g10.shared-store-product-listing.TC-5vw rev=1 covers=g10.shared-store-product-listing.SC-3ob,g10.shared-store-product-listing.SC-9ml,g10.shared-store-product-listing.SC-vgm,g10.shared-store-product-listing.SC-bz2,g10.shared-store-product-listing.SC-0cf,g10.shared-store-product-listing.SC-oxx,g10.shared-store-product-listing.SC-7pj,g10.shared-store-product-listing.SC-d3u,g10.shared-store-product-listing.SC-e9w,g10.shared-store-product-listing.SC-14a,g10.shared-store-product-listing.SC-t2f,g10.shared-store-product-listing.SC-30a,g10.shared-store-product-listing.SC-uoy,g10.shared-store-product-listing.SC-la7,g10.shared-store-product-listing.SC-exb,g10.shared-store-product-listing.SC-eds,g10.shared-store-product-listing.SC-0xx,g10.shared-store-product-listing.SC-yv9,g10.shared-store-product-listing.SC-3n1,g10.shared-store-product-listing.SC-ck1,g10.shared-store-product-listing.SC-z64,g10.shared-store-product-listing.SC-ezf,g10.shared-store-product-listing.SC-iye -->
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

<!-- trace:case id=g10.shared-store-product-listing.TC-rny rev=1 covers=g10.shared-store-product-listing.SC-3ob,g10.shared-store-product-listing.SC-9ml,g10.shared-store-product-listing.SC-vgm,g10.shared-store-product-listing.SC-bz2,g10.shared-store-product-listing.SC-0cf,g10.shared-store-product-listing.SC-oxx,g10.shared-store-product-listing.SC-7pj,g10.shared-store-product-listing.SC-d3u,g10.shared-store-product-listing.SC-e9w,g10.shared-store-product-listing.SC-14a,g10.shared-store-product-listing.SC-t2f,g10.shared-store-product-listing.SC-30a,g10.shared-store-product-listing.SC-uoy,g10.shared-store-product-listing.SC-la7,g10.shared-store-product-listing.SC-exb,g10.shared-store-product-listing.SC-eds,g10.shared-store-product-listing.SC-0xx,g10.shared-store-product-listing.SC-yv9,g10.shared-store-product-listing.SC-3n1,g10.shared-store-product-listing.SC-ck1,g10.shared-store-product-listing.SC-z64,g10.shared-store-product-listing.SC-ezf,g10.shared-store-product-listing.SC-iye -->
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

<!-- trace:case id=g10.shared-store-product-listing.TC-63a rev=1 covers=g10.shared-store-product-listing.SC-ou9,g10.shared-store-product-listing.SC-xip,g10.shared-store-product-listing.SC-nh0,g10.shared-store-product-listing.SC-sz8,g10.shared-store-product-listing.SC-ry5,g10.shared-store-product-listing.SC-7v7 -->
### shared-ui-store-product-listing-US1-TC7-1: Name is the tile's one keyboard stop to open, and opens from the keyboard

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
* Step 7 announces one control named for `<product_1>`; the photo is not announced.

<!-- trace:case id=g10.shared-store-product-listing.TC-rg1 rev=1 covers=g10.shared-store-product-listing.SC-3ob,g10.shared-store-product-listing.SC-9ml,g10.shared-store-product-listing.SC-vgm,g10.shared-store-product-listing.SC-bz2,g10.shared-store-product-listing.SC-0cf,g10.shared-store-product-listing.SC-oxx,g10.shared-store-product-listing.SC-7pj,g10.shared-store-product-listing.SC-d3u,g10.shared-store-product-listing.SC-e9w,g10.shared-store-product-listing.SC-14a,g10.shared-store-product-listing.SC-t2f,g10.shared-store-product-listing.SC-30a,g10.shared-store-product-listing.SC-uoy,g10.shared-store-product-listing.SC-la7,g10.shared-store-product-listing.SC-exb,g10.shared-store-product-listing.SC-eds,g10.shared-store-product-listing.SC-0xx,g10.shared-store-product-listing.SC-yv9,g10.shared-store-product-listing.SC-3n1,g10.shared-store-product-listing.SC-ck1,g10.shared-store-product-listing.SC-z64,g10.shared-store-product-listing.SC-ezf,g10.shared-store-product-listing.SC-iye -->
### shared-ui-store-product-listing-US1-TC8-1: Sold-out name and photo stay inert on a tile that sells

Runs once per row of **Test data**.

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
* `<product_3>` is sold out, and the tile is given a cart handler.
* The tile's way in is as the row's **Way in** says, set in the story's controls.

**Test data:**

| Product | Way in | Outcome |
| --- | --- | --- |
| `<product_3>` | an activation callback and `<product_3 address>`, as the story draws them | name and photo inert, no link |
| `<product_3>` | an activation callback alone, as the listing gives its cards | name and photo inert |
| `<product_3>` | `<product_3 address>` alone, no activation callback | name and photo inert, no link |

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
* Steps 3 and 4 log no tile activation and leave the story open.
* Step 6 never lands focus on the name or the photo.
* Neither the name nor the photo is offered as a link or a button.

<!-- trace:case id=g10.shared-store-product-listing.TC-lbw rev=1 covers=g10.shared-store-product-listing.SC-3ob,g10.shared-store-product-listing.SC-9ml,g10.shared-store-product-listing.SC-vgm,g10.shared-store-product-listing.SC-bz2,g10.shared-store-product-listing.SC-0cf,g10.shared-store-product-listing.SC-oxx,g10.shared-store-product-listing.SC-7pj,g10.shared-store-product-listing.SC-d3u,g10.shared-store-product-listing.SC-e9w,g10.shared-store-product-listing.SC-14a,g10.shared-store-product-listing.SC-t2f,g10.shared-store-product-listing.SC-30a,g10.shared-store-product-listing.SC-uoy,g10.shared-store-product-listing.SC-la7,g10.shared-store-product-listing.SC-exb,g10.shared-store-product-listing.SC-eds,g10.shared-store-product-listing.SC-0xx,g10.shared-store-product-listing.SC-yv9,g10.shared-store-product-listing.SC-3n1,g10.shared-store-product-listing.SC-ck1,g10.shared-store-product-listing.SC-z64,g10.shared-store-product-listing.SC-ezf,g10.shared-store-product-listing.SC-iye -->
### shared-ui-store-product-listing-US1-TC9-1: No activation callback and no address leave name and photo inert

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

* `ProductCard` is open in Storybook, drawn as its Inert story, showing `<product_1>`.
* `<product_1>` is not sold out, and the tile is given a cart handler and neither an activation callback nor an address.

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

<!-- trace:case id=g10.shared-store-product-listing.TC-xph rev=1 covers=g10.shared-store-product-listing.SC-3ob,g10.shared-store-product-listing.SC-9ml,g10.shared-store-product-listing.SC-vgm,g10.shared-store-product-listing.SC-bz2,g10.shared-store-product-listing.SC-0cf,g10.shared-store-product-listing.SC-oxx,g10.shared-store-product-listing.SC-7pj,g10.shared-store-product-listing.SC-d3u,g10.shared-store-product-listing.SC-e9w,g10.shared-store-product-listing.SC-14a,g10.shared-store-product-listing.SC-t2f,g10.shared-store-product-listing.SC-30a,g10.shared-store-product-listing.SC-uoy,g10.shared-store-product-listing.SC-la7,g10.shared-store-product-listing.SC-exb,g10.shared-store-product-listing.SC-eds,g10.shared-store-product-listing.SC-0xx,g10.shared-store-product-listing.SC-yv9,g10.shared-store-product-listing.SC-3n1,g10.shared-store-product-listing.SC-ck1,g10.shared-store-product-listing.SC-z64,g10.shared-store-product-listing.SC-ezf,g10.shared-store-product-listing.SC-iye -->
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
2. Move the pointer over the tile's name.
3. Click the tile's name.
4. Clear the Actions panel.
5. Click the tile's photo.
6. Click the canvas above the tile, outside it.
7. Press Tab.

**Expected Results:**

* The tile shows its sold-out treatment throughout, and no cart control.
* Step 2 underlines the name.
* Step 3 logs one tile activation for `<product_3>`.
* Step 5 logs one tile activation for `<product_3>`, the same as step 3.
* Step 7 lands focus on the name, underlined, not on the photo.

<!-- trace:case id=g10.shared-store-product-listing.TC-64a rev=1 covers=g10.shared-store-product-listing.SC-3ob,g10.shared-store-product-listing.SC-9ml,g10.shared-store-product-listing.SC-vgm,g10.shared-store-product-listing.SC-bz2,g10.shared-store-product-listing.SC-0cf,g10.shared-store-product-listing.SC-oxx,g10.shared-store-product-listing.SC-7pj,g10.shared-store-product-listing.SC-d3u,g10.shared-store-product-listing.SC-e9w,g10.shared-store-product-listing.SC-14a,g10.shared-store-product-listing.SC-t2f,g10.shared-store-product-listing.SC-30a,g10.shared-store-product-listing.SC-uoy,g10.shared-store-product-listing.SC-la7,g10.shared-store-product-listing.SC-exb,g10.shared-store-product-listing.SC-eds,g10.shared-store-product-listing.SC-0xx,g10.shared-store-product-listing.SC-yv9,g10.shared-store-product-listing.SC-3n1,g10.shared-store-product-listing.SC-ck1,g10.shared-store-product-listing.SC-z64,g10.shared-store-product-listing.SC-ezf,g10.shared-store-product-listing.SC-iye -->
### shared-ui-store-product-listing-US1-TC11-1: Name is a link where the tile is given an address alone

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

* `ProductCard` is open in Storybook, drawn as the row's **Story**, showing the row's **Product**.
* The tile is given the row's **Address** and no activation callback, and no cart handler.

**Test data:**

| Product | Story | Address | Sold out |
| --- | --- | --- | --- |
| `<product_1>` | Address Only | `<product_1 address>` | no |
| `<product_3>` | Sold Out Opens As A Link | `<product_3 address>` | yes, sold-out treatment shown |

**Steps:**

1. Open Storybook's Actions panel and clear it.
2. Move the pointer over the tile's name.
3. Ctrl-click (Cmd-click on a Mac) the tile's name.
4. Ctrl-click (Cmd-click on a Mac) the tile's photo.
5. Click the canvas above the tile, outside it.
6. Press Tab until focus is on the tile's name.
7. Press Enter.

**Expected Results:**

* Step 2 underlines the name.
* Steps 3 and 4 each open the row's **Address** in a new tab; the story's tab stays where it was.
* Step 6 never stops on the photo.
* Step 7 follows the row's **Address** in the story's frame.
* The Actions panel logs no tile activation throughout.

<!-- trace:case id=g10.shared-store-product-listing.TC-1vn rev=1 covers=g10.shared-store-product-listing.SC-ou9,g10.shared-store-product-listing.SC-xip,g10.shared-store-product-listing.SC-nh0,g10.shared-store-product-listing.SC-sz8,g10.shared-store-product-listing.SC-ry5,g10.shared-store-product-listing.SC-7v7 -->
### shared-ui-store-product-listing-US1-TC12-1: Photo used alone opens where a tile would, as its own stop

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Accessibility

**Pre-conditions:**

* `ProductCardImage` is open in Storybook on its own, drawn as the row's **Story**, showing the row's **Product** and given its name.
* The photo is given an activation callback, and a cart handler as the row's **Cart handler** says.
* A screen reader is on for step 5.

**Test data:**

| Product | Story | Cart handler | Outcome |
| --- | --- | --- | --- |
| `<product_1>`, not sold out | Opens Alone | not supplied | Step 3 lands focus on the photo; step 4 logs one tile activation for `<product_1>`; step 5 announces one control named for `<product_1>`; step 6 logs one more |
| `<product_3>`, sold out | Sold Out Where It Sells | supplied | Step 3 never lands focus on the photo; step 4 logs nothing; step 5 announces no control named for `<product_3>`; step 6 logs nothing |

**Steps:**

1. Open Storybook's Actions panel and clear it.
2. Click the canvas above the photo, outside it.
3. Press Tab.
4. Press Enter.
5. Move to the photo with the screen reader.
6. Click the photo.

**Expected Results:**

* Steps 3 to 6 go as the row's **Outcome** says.

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

## Settled

- **A tile with no name** - outside the contract: a tile is always given its product's name as text, and the catalogue authors a title for every product, so no case walks a nameless tile

## Reconciliation

- **Raised, landed** - the 2026-10-05 pass asked three questions, each landed in `decisions.md`: which keys open the name (Q5), whether the keyboard stops on the photo and the name or on one (Q6), and whether an inert name takes the underline (Q7). US1-TC7 was re-worded to Tab stopping on the name and the cart control and never the photo, Enter and Space each reporting once, and one control announced; US1-TC8 and US1-TC9 to an inert name that stays plain text on hover and takes no focus
- **Raised, settled** - QA2 on 2026-10-06 asked what opens a tile given no name; landed as Q10 from `ProductCardProps.name`, a required string the screen reader reads: a nameless tile is outside the contract, recorded under Settled, no case and no scenario
- **Folded into spec** - US1-TC8's address-alone row keeps a sold-out tile given its address and a cart handler inert, no link drawn; the requirement says so and no scenario proved it, so `shared-ui-store-product-listing-SC-88` now gives the tile both a callback and its address. US1-TC12 keeps a `ProductCardImage` used alone a named, focusable control, as the tech design and the UI design state and no requirement did; the image requirement now says so and `shared-ui-store-product-listing-SC-101` proves it, through the Opens Alone story US1-TC12 opens. The 2026-10-06 review found the image used alone opening wherever it is given a callback, sold out on a tile that sells included; Q14 puts it under the tile's rule, the requirement and `shared-ui-store-product-listing-SC-101` say so, and US1-TC12 gained the Sold Out Where It Sells row
- **Folded into case** - `shared-ui-store-product-listing-SC-55`, re-worded here to focus moving through the tile, had no case that checks the cart control on a tile that does not sell; US1-TC4 gained a Tab walk and a Cart control column, its second row showing none on hover or on focus. QA2 on 2026-10-06 drafted the sold-out tile that does not sell again, with the name's underline and Tab landing on the name; that run is US1-TC10's, so its results joined US1-TC10 and no second case was issued. `shared-ui-store-product-listing-SC-88` gives the tile a callback and its address together, which no row of US1-TC8 did; QA2 added that row first, as the Sold Out story draws it, and kept the callback-alone row as the listing gives its cards
- **Trace fixed** - each case's `covers` listed the scenarios it walked, chosen by their results; it now lists every scenario serving its `**Trace:**` anchor, in the folded spec's order, as `docs/governance/test-traceability.md` requires: Tile contract for the seven cases tracing it, `add-store-cross-sell`'s link scenario included, and Accessibility for US1-TC7 and US1-TC12. Which case walks which scenario is under Walked
- **Contradicted** - none: where a case and a scenario state the same behaviour they agree
- **Re-read** - `shared-ui-store-product-listing-SC-99` now names keyboard focus, as the requirement does; US1-TC7 and US1-TC10 reach the name by Tab and US1-TC6 by hover, so each stands unchanged
- **Walked** - `shared-ui-store-product-listing-SC-87` by US1-TC4 on the tile and US1-TC5 in the browse grid; `shared-ui-store-product-listing-SC-88` by US1-TC8; `shared-ui-store-product-listing-SC-89` by US1-TC9, whose Inert story gives neither a callback nor an address; `shared-ui-store-product-listing-SC-97` by US1-TC10; `shared-ui-store-product-listing-SC-98` by US1-TC7; `shared-ui-store-product-listing-SC-99` by US1-TC6 on hover, US1-TC7 on keyboard focus, US1-TC10 on a tile that does not sell, US1-TC11 on a name that is a link, and US1-TC8 and US1-TC9 on a name that does not open; `shared-ui-store-product-listing-SC-100` by US1-TC11, whose plain press on the photo is shown by the photo's link opening the same address on a modified press, since a plain press leaves Storybook; `shared-ui-store-product-listing-SC-101` by US1-TC12; `shared-ui-store-product-listing-SC-51`, re-worded to focus moving into the image, by US1-TC7's cart-control result; `shared-ui-store-product-listing-SC-55` by US1-TC4's second row
- **Retired elsewhere** - `add-store-cross-sell` retired its blind US1-TC1 when its requirement for a sold-out tile that opens where it does not sell left its delta (its Q56, this change's Q9), so US1-TC10 alone walks `shared-ui-store-product-listing-SC-97`
- **Carried, not this change's** - `shared-ui-store-product-listing-SC-04` to `shared-ui-store-product-listing-SC-09`, `shared-ui-store-product-listing-SC-46` to `shared-ui-store-product-listing-SC-50`, `shared-ui-store-product-listing-SC-52` to `shared-ui-store-product-listing-SC-54`, `shared-ui-store-product-listing-SC-65` and `shared-ui-store-product-listing-SC-66` are carried word for word; the capability's suite refresh owes them cases
- **Uncovered** - none of this delta's scenarios
- **QA2, 2026-10-07** - each case re-read against the scenarios its anchor holds once `add-store-cross-sell` and this change fold: every `covers` lists them in order, and nothing is contradicted, raised or uncovered; US1-TC4's Test data now joins its cells with a comma, not a dash
- **Cases from QA2** - US1-TC11 and US1-TC12, and US1-TC10's underline and Tab results, were drafted by QA2 on 2026-10-06, which read the delta; they are not blind, and the one blind pass is the Run line below

**Run:** Blind feature pass on `shared/ui/store-product-listing`, run for `add-store-cross-sell`. Read: the isolated bundle under `.round/blind-store-product-listing/` — `outline.md` (`## Purpose`, `## Feature set` only), `user-journeys.md`, `decisions.md`, `ui-design.md`, `prd-cross-sell.md`, `prd-store-product-listing.md`, `context.md` — plus `docs/governance/specs-to-test-cases.md` for the rulebook and `openspec/specs/grade10-site/auction/auction/feature-tcs.md` for house style. Denied: the capability's `## Requirements` in `spec.md`, every other file under `openspec/specs/` and `openspec/changes/`, and `openspec/changes/archive/` entirely.

**Run:** Blind feature pass (QA1) on 2026-10-05 for `activate-listing-tile-by-name`, `shared/ui/store-product-listing`. Read the caller's isolated bundle only: the capability's Purpose and Feature set (outline), its `user-journeys.md`, the change's `proposal.md`, `decisions.md` with its Raised table, `ui-design.md` with scenario ids stripped, `openspec/config.yaml` context, the PRD pages `shared/ui/store-product-listing` and `grade10-site/store/product-listing`, and `add-store-cross-sell`'s in-flight suite for this capability with its Reconciliation stripped; plus `docs/governance/specs-to-test-cases.md` and `docs/governance/tcs-conventions.md`. Denied and not opened: every Requirements section, this change's delta `spec.md`, `openspec/specs/`, the rest of `openspec/changes/` and its archive, and `packages/` source.

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
