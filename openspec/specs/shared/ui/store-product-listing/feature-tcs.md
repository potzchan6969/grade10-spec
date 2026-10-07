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

- **A tile with no name** - outside the contract: a tile is always given its product's name as text, and the catalogue authors a title for every product, so no case walks a nameless tile
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

**Run:** QA2 reconciliation on 2026-10-06 for `fit-product-listing-photo`, in a fresh context, after the second accept review restated the corner rule in Q6 and split `shared-ui-store-product-listing-SC-63` and `shared-ui-store-product-listing-SC-63a` at the well's rounded corners. Read the change's proposal, decisions, journeys, UI design, technical design, tasks and delta `spec.md`, the page [Product Listing Blocks](../../../../../../../docs/prds/products/shared/ui/store-product-listing.md), the durable `spec.md`, the open changes and their planning branches on this capability for their ids, `docs/governance/tcs-conventions.md` for the recipes the cases name, `packages/ui/src/blocks/store-product-listing/product-card-image.tsx` and its stories for what ships, and the application's `StoreHomePage.tsx` and catalogue collection read for the Main Page row's recipe. No `domain-tcs.md`, `product-tcs.md` or `platform-tcs.md` traces this capability, so no suite above it moves. The blind pass left no Run line, so what it read is not on record; its questions are R2 and R3 in `decisions.md`.

**Rerun:** 2026-10-07, fresh context, on the stack above `drop-product-listing-photo-multiply`. Every disposition above holds against the delta, Q1 to Q7, the page's Whole photo line and `product-card-image.tsx`. `shared-ui-store-product-listing-SC-63` is this change's own id, issued 2026-09-09 with b632582fe before the stack's `SC-64` and `SC-92` to `SC-101`; `SC-63a` sits beside it. Each case's `covers` names exactly the 27 scenarios that serve Tile contract in the durable spec and the stack, in source order.

### Manual

What stays manual, and why. Each row names the test that proves part of the case, in these words, and what a person walks beyond it:

- the walk - `apps/frontend/grade10/e2e/tests/store/listing-photo.spec.ts`, in the application repository, one test per surface, each citing the case; its stack answers every photo with a stand-in, so the shop's own photo address is not in play

| Manual | Why |
| --- | --- |
| `shared-ui-store-product-listing-US1-TC20-1` | to be walked in group 3's walk, which proves the whole photo on the store listing, the Main Page row and You May Also Like; a person reads a real slab photo, served from the shop's own address, on each surface of the staging storefront |
