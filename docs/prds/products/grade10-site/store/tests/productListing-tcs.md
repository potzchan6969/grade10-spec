# grade10-site/store/product-listing Test Cases

**Status:** pending-review · 0/30
**Drafts styled:** 2026-10-22, tcs-rules r6

## Walk 1: Browse, Narrow and Search on a Wide Screen

**Starting state:**

- customer(signed out) is on `<store listing url>` on staging, in a wide desktop browser window.
- The catalogue holds `<catalogue>`, larger than one page of cards.

**Shared test data:**

| Field | Value |
| --- | --- |
| `store listing url` | The staging site's `/store/collections`. |
| `catalogue` | At least 3 pages of cards across at least 6 worlds and 2 types, with known creation dates and prices. |
| `world A` | A world with cards in the catalogue and a known count. |
| `type A` | A type with cards inside `<world A>` and a known count. |
| `search words` | A word in at least 6 product titles and in no world or type name. |
| `cheapest product` | The card with the lowest variant price in the catalogue, not on the first page at rest. |

### Route

1. Read the sort control, the count above the grid and the first cards.
   - Record the order at rest, the sort label and the count `g10.store-product-listing.US1-TC1`
2. Scroll to the end of the cards twice.
   - Record the added cards, the missing paging controls and the still count `g10.store-product-listing.US1-TC2`
3. Click the name of an available card, then press Back.
   - Record the product page opened by the name `g10.store-product-listing.US1-TC3`
4. Tick `<world A>` in the sidebar, then tick `<type A>`.
   - Record the narrowed cards, counts, chips and address `g10.store-product-listing.US2-TC1`
5. Copy the address and open it in a new private window.
   - Record the same narrowing opening at its first page `g10.store-product-listing.US2-TC7`
6. Back in the first window, dismiss the `<type A>` chip, then press Back, then click Clear filters.
   - Record each widening `g10.store-product-listing.US2-TC5`
7. Type `<search words>` in the search field.
   - Record the suggestion groups and their caps `g10.store-product-listing.US3-TC1`
8. Press Enter.
   - Record the search chip, the cleared field and the narrowed cards `g10.store-product-listing.US3-TC2`
9. Clear filters, open the sort control and choose lowest price, then highest price.
   - Record the menu, the orders and `<cheapest product>` first `g10.store-product-listing.US4-TC1`

## Walk 2: Narrow the Listing on a Small Screen

**Starting state:**

- customer(signed out) is on `<store listing url>` on staging, in a browser emulating a phone, below the wide breakpoint.
- The catalogue holds at least 6 worlds and 2 types with cards.

**Shared test data:**

| Field | Value |
| --- | --- |
| `store listing url` | The staging site's `/store/collections`. |
| `world A` | A world with cards and a known name. |
| `world B` | A second world with cards and a known name. |

### Route

1. Read the area above the grid.
   - Record the count, the pills and the missing wide-screen controls `g10.store-product-listing.US6-TC1`
2. Open the sort pill and choose highest price.
   - Record the bottom drawer and the order applied on choose `g10.store-product-listing.US6-TC3`
3. Open the Worlds pill, tick `<world A>` and `<world B>`, then tap Show Results.
   - Record the drawer, the applied draft and the pill label `g10.store-product-listing.US6-TC2`
4. Read an available card without hovering.
   - Record the visible cart control `g10.store-product-listing.US6-TC4`

## Walk 3: Fill a Guest Cart from the Listing

**Starting state:**

- customer(signed out) is on `<store listing url>` on staging, with an empty cart in this browser.
- `<cart product>` is available, with at least 3 for sale, and shows on the first page.

**Shared test data:**

| Field | Value |
| --- | --- |
| `store listing url` | The staging site's `/store/collections`. |
| `cart product` | An available card on the first page, at least 3 for sale. |

### Route

1. Click Add to cart on the card for `<cart product>`.
   - Record the card's quantity controls, with no sign-in asked `g10.store-product-listing.US7-TC1`
2. Click the card's increase control twice, then its decrease control once.
   - Record the card's quantity after each click `g10.store-product-listing.US7-TC2`
3. Click the card's remove control.
   - Record the card back to Add to cart `g10.store-product-listing.US7-TC2`

## g10.store-product-listing.US1: Browse the catalogue

**As a** customer,
**I want** to read the whole catalogue as one list I scroll,
**so that** I can find a product and open it.

<!-- trace:case id=g10.store-product-listing.TC-4yp rev=1 -->
### g10.store-product-listing.US1-TC1: Listing opens on latest product with the whole set's count

Runs once per row of **Test data**.

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** acceptance, smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-product-listing.US1

**Pre-conditions:**

* The catalogue holds `<catalogue>`, larger than one page of cards.

**Test data:**

| Partition | `<listing address>` |
| --- | --- |
| Plain address | `<store listing url>`. |
| A link made at rest | `<store listing url>` copied from the listing before any choice; it carries no order. |

**Steps:**

1. Navigate to `<listing address>`.
2. Read the sort control.
3. Read the count above the grid.
4. Read the first cards in order.

**Expected Results:**

* Step 2 names the latest product order.
* Step 3 equals the number of cards for sale and sold out in `<catalogue>`.
* Step 3 is not the number of cards on screen.
* Step 4 lists cards for sale newest first.

<!-- trace:case id=g10.store-product-listing.TC-toj rev=1 -->
### g10.store-product-listing.US1-TC2: Scrolling to the end adds the next cards below

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-product-listing.US1

**Pre-conditions:**

* The catalogue holds `<catalogue>`, at least 3 pages of cards.
* customer is on `<store listing url>` with its first page loaded.

**Steps:**

1. Note the count above the grid and the last card.
2. Scroll to the end of the cards.
3. Wait for more cards to appear.
4. Scroll to the end again.
5. Read the count above the grid.

**Expected Results:**

* No page number, next control or load-more button shows.
* Step 3 adds cards below the last card from step 1.
* Step 4 adds another set below those.
* Step 5 equals the count from step 1.

<!-- trace:case id=g10.store-product-listing.TC-m0e rev=1 -->
### g10.store-product-listing.US1-TC3: Card name and photo open the product page unless sold out

Runs once per row of **Test data**.

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** acceptance, smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-product-listing.US1

**Pre-conditions:**

* `<tile product>` shows on the first page of `<store listing url>`, in the state its row describes.

**Test data:**

| Partition | `<tile product>` | `<expected opening>` |
| --- | --- | --- |
| Available | Offered for sale, with a known handle. | `/store/products/<handle>` opens. |
| Sold out | Nothing offered for sale, by the recipe "Sell a card out". | Nothing opens; the listing stays. |

**Steps:**

1. Navigate to `<store listing url>`.
2. Click the name on the card for `<tile product>`.
3. Return to `<store listing url>`.
4. Click the photo on the card for `<tile product>`.

**Expected Results:**

* Step 2 matches `<expected opening>`.
* Step 4 matches `<expected opening>`.

---

## g10.store-product-listing.US2: Narrow by world and type

**As a** customer,
**I want** to narrow the listing to the worlds and kinds of collectible I collect,
**so that** I see how much is there before I pick.

<!-- trace:case id=g10.store-product-listing.TC-5u2 rev=1 -->
### g10.store-product-listing.US2-TC1: Ticking a world and type narrows cards, counts and address

Runs once per row of **Test data**.

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** acceptance, smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-product-listing.US2

**Pre-conditions:**

* customer is on `<store listing url>` on a wide screen, with no narrowing in force.
* The catalogue holds cards in `<world A>`, `<world B>` and `<type A>`, with known counts.

**Test data:**

| Partition | `<choices>` | `<expected address>` |
| --- | --- | --- |
| One world | `<world A>`. | Carries `worlds=<world A handle>`. |
| A world and a type | `<world A>`, then `<type A>`. | Carries `worlds=<world A handle>` and `types=<type A handle>`. |

**Steps:**

1. Read the count beside `<world A>` in the sidebar.
2. Tick `<choices>` in the sidebar.
3. Read the cards, the count above the grid and the chips.
4. Read the count beside `<world B>`.
5. Read the address bar.

**Expected Results:**

* Every card in step 3 belongs to `<choices>`.
* For one world, step 3's count equals step 1's count.
* Step 3 shows a chip for each of `<choices>` in the header.
* Step 4 counts what picking `<world B>` instead would find.
* Step 5 matches `<expected address>`.

<!-- trace:case id=g10.store-product-listing.TC-uzx rev=1 -->
### g10.store-product-listing.US2-TC5: Chips, Back and Clear filters each widen the listing

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-product-listing.US2

**Pre-conditions:**

* customer is on `<store listing url>` on a wide screen, narrowed by `<world A>` then `<type A>`, in that order.

**Test data:**

| Partition | `<widening action>` | `<expected narrowing>` |
| --- | --- | --- |
| Dismiss a chip | Dismiss the `<type A>` chip. | `<world A>` alone. |
| Back | Press the browser's Back button. | `<world A>` alone. |
| Clear filters | Click Clear filters. | None; the whole catalogue. |

**Steps:**

1. Do `<widening action>`.
2. Read the chips, the count and the address bar.

**Expected Results:**

* Step 2 shows `<expected narrowing>` in the chips.
* The count is the catalogue's count for `<expected narrowing>`.
* The address carries only `<expected narrowing>`.

<!-- trace:case id=g10.store-product-listing.TC-gld rev=1 -->
### g10.store-product-listing.US2-TC7: A shared listing address opens the same narrowing at the top

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
* **Trace:** g10.store-product-listing.US2

**Pre-conditions:**

* customer has `<store listing url>` narrowed by `<world A>` and `<type A>`, scrolled past its first page.

**Test data:**

| Partition | `<reopen route>` |
| --- | --- |
| Shared address | Copy the address and open it in a new private window. |
| Back from a product | Open a card's product page, then press Back. |

**Steps:**

1. Follow `<reopen route>`.
2. Read the chips, the count and the first cards.

**Expected Results:**

* Step 2 shows chips for `<world A>` and `<type A>`.
* The count matches the narrowing's count.
* The listing shows its first page, at the top.

---

## g10.store-product-listing.US3: Search the catalogue

**As a** customer,
**I want** to search the whole catalogue by words,
**so that** I can jump to a product or a narrowing.

<!-- trace:case id=g10.store-product-listing.TC-5h3 rev=1 -->
### g10.store-product-listing.US3-TC1: Typing suggests up to five products and five filters

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-product-listing.US3

**Pre-conditions:**

* customer is on `<store listing url>` on a wide screen, with `<facets in force>`.

**Test data:**

| Partition | `<typed words>` | `<facets in force>` | `<expected suggestions>` |
| --- | --- | --- | --- |
| Many product hits | `<search words>`, in at least 6 titles. | None. | Exactly 5 products; no filter group. |
| Filter hits | A word in at least 6 world or type names. | None. | Exactly 5 filters, each with World or Type beside its name. |
| Hits beyond the facets | A word in a title outside `<world A>`. | `<world A>`. | That product listed among the products. |

**Steps:**

1. Click the search field in the sidebar.
2. Type `<typed words>`.
3. Read the suggestions.

**Expected Results:**

* Step 3 shows `<expected suggestions>`.
* Every product suggestion is a store product.

<!-- trace:case id=g10.store-product-listing.TC-dwm rev=1 -->
### g10.store-product-listing.US3-TC2: Enter commits the words as a chip and clears the field

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-product-listing.US3

**Pre-conditions:**

* customer is on `<store listing url>` on a wide screen, narrowed by `<world A>`.

**Test data:**

| Partition | `<typed words>` |
| --- | --- |
| Words with hits | `<search words>`. |
| Words with no hit | A string no title, world or type holds. |

**Steps:**

1. Type `<typed words>` in the search field.
2. Press Enter.
3. Read the chips, the field, the cards and the address bar.
4. Dismiss the search chip.

**Expected Results:**

* Step 3 shows a search chip for `<typed words>` beside the `<world A>` chip.
* Step 3 shows the search field empty.
* Step 3 lists only cards matching both, over the whole catalogue.
* Step 3's address carries `q=` with `<typed words>`.
* Step 4 lists `<world A>` alone again.

---

## g10.store-product-listing.US4: Order the listing

**As a** customer,
**I want** to order the whole catalogue by latest or by price,
**so that** I find the cheapest or newest card in the shop.

<!-- trace:case id=g10.store-product-listing.TC-kkm rev=1 -->
### g10.store-product-listing.US4-TC1: Price order covers the whole catalogue, cards for sale first

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** acceptance, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-product-listing.US4

**Pre-conditions:**

* customer is on `<store listing url>` with no narrowing, scrolled to its first page only.
* `<cheapest product>` is for sale and not on the first page at rest.
* `<sold-out product>` is sold out and cheaper than every card for sale.
* `<multi-variant product>` has variants at `<lowest variant price>` and a higher price.

**Test data:**

| Partition | `<order>` | `<expected first card for sale>` |
| --- | --- | --- |
| Lowest price | Lowest price. | `<cheapest product>`. |
| Highest price | Highest price. | The card with the highest lowest-variant price. |
| Latest | Latest product. | The newest card for sale. |

**Steps:**

1. Click the sort control.
2. Read the menu's choices.
3. Choose `<order>`.
4. Scroll through the cards to the end.
5. Read the address bar.

**Expected Results:**

* Step 2 offers latest product, lowest price and highest price only.
* Step 4 starts with `<expected first card for sale>`.
* Every card for sale lists before `<sold-out product>`.
* `<multi-variant product>` sorts at `<lowest variant price>`.
* For a price order, step 5's address carries `sort=`.

---

## g10.store-product-listing.US6: Narrow the listing on a small screen

**As a** customer,
**I want** to sort and narrow the listing on my phone,
**so that** I browse the shop without a desktop.

<!-- trace:case id=g10.store-product-listing.TC-qa1 rev=1 -->
### g10.store-product-listing.US6-TC1: Small screens show the count and pills, no search

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** compatibility
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-product-listing.US6

**Pre-conditions:**

* customer is on `<store listing url>` below the wide breakpoint, with `<worlds in force>`.

**Test data:**

| Partition | `<worlds in force>` | `<expected Worlds pill label>` |
| --- | --- | --- |
| None | None. | The group name, Worlds. |
| One | `<world A>`. | `<world A>`'s name. |
| Several | `<world A>` and `<world B>`. | A compact name with the count 2. |

**Steps:**

1. Read the area above the grid.
2. Read the Worlds pill.

**Expected Results:**

* Step 1 shows the result count and pills for sort, Worlds and Types.
* Step 1 shows no search field, Filter icon, left drawer or chip row.
* Step 2 reads `<expected Worlds pill label>`.

<!-- trace:case id=g10.store-product-listing.TC-rqy rev=1 -->
### g10.store-product-listing.US6-TC2: A facet pill's drawer applies on Show Results, Clear empties it

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
* **Trace:** g10.store-product-listing.US6

**Pre-conditions:**

* customer is on `<store listing url>` below the wide breakpoint, with no narrowing in force.

**Test data:**

| Partition | `<drawer actions>` | `<expected narrowing>` |
| --- | --- | --- |
| Show Results | Tick `<world A>` and `<world B>`, then tap Show Results. | `<world A>` and `<world B>`. |
| Clear, then Show Results | Tick `<world A>`, tap Clear, then tap Show Results. | None. |

**Steps:**

1. Tap the Worlds pill.
2. Read the drawer.
3. Do `<drawer actions>`.
4. Read the cards, the count and the Worlds pill.

**Expected Results:**

* Step 2 opens a bottom drawer for the Worlds group.
* Ticking in step 3 does not narrow the cards before Show Results.
* Step 4 lists `<expected narrowing>`.

<!-- trace:case id=g10.store-product-listing.TC-83t rev=1 -->
### g10.store-product-listing.US6-TC3: The sort pill's drawer applies an order on choose

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-product-listing.US6

**Pre-conditions:**

* customer is on `<store listing url>` below the wide breakpoint, ordered by latest product.

**Steps:**

1. Tap the sort pill.
2. Tap highest price.
3. Read the cards and the sort pill.

**Expected Results:**

* Step 1 opens a bottom drawer of orders.
* Step 2 closes the drawer and applies the order.
* Step 3 lists the highest-priced card for sale first.

<!-- trace:case id=g10.store-product-listing.TC-6x5 rev=1 -->
### g10.store-product-listing.US6-TC4: Cart control shows without hover on small and touch screens

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** compatibility
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-product-listing.US6

**Pre-conditions:**

* customer is on `<store listing url>` on `<device>`.
* An available card shows on the first page.

**Test data:**

| Partition | `<device>` |
| --- | --- |
| Narrow viewport, mouse | A desktop browser below the wide breakpoint. |
| Touch | A phone browser with touch input. |

**Steps:**

1. Read the available card without hovering or tapping it.

**Expected Results:**

* The card's Add to cart control is visible.

---

## g10.store-product-listing.US7: Add to cart from the listing

**As a** customer,
**I want** to put cards in my cart straight from the listing,
**so that** I can keep browsing while I shop.

<!-- trace:case id=g10.store-product-listing.TC-glr rev=1 -->
### g10.store-product-listing.US7-TC1: A guest's Add to cart turns the card's control into a quantity

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** acceptance, smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-product-listing.US7

**Pre-conditions:**

* customer(signed out) is on `<store listing url>`, with an empty cart in this browser.
* `<cart product>` is available on the first page.

**Steps:**

1. Click Add to cart on the card for `<cart product>`.
2. Read the card's cart controls.
3. Reload the page.
4. Read the card's cart controls again.

**Expected Results:**

* Step 1 asks for no sign-in.
* Step 2 shows quantity 1, with increase, decrease and remove controls.
* Step 4 still shows quantity 1.

<!-- trace:case id=g10.store-product-listing.TC-wne rev=1 -->
### g10.store-product-listing.US7-TC2: The card's increase, decrease and remove controls change its quantity

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
* **Trace:** g10.store-product-listing.US7

**Pre-conditions:**

* customer(signed out) is on `<store listing url>`.
* The cart holds `<cart product>` at quantity 2; the shop has at least 3 for sale.

**Test data:**

| Partition | `<card control>` | `<expected card>` |
| --- | --- | --- |
| Increase | The card's increase control. | Quantity 3. |
| Decrease | The card's decrease control. | Quantity 1. |
| Remove | The card's remove control. | Add to cart, no quantity. |

**Steps:**

1. Click `<card control>` on the card for `<cart product>`.
2. Read the card's cart controls.
3. Reload the page.
4. Read the card's cart controls again.

**Expected Results:**

* Step 2 shows `<expected card>`.
* Step 4 shows `<expected card>`.

---

## Ungrouped

### g10.store-product-listing.US1: Browse the catalogue

**As a** customer,
**I want** to read the whole catalogue as one list I scroll,
**so that** I can find a product and open it.

<!-- trace:case id=g10.store-product-listing.TC-mvj rev=1 -->
#### g10.store-product-listing.US1-TC4: Tiles read sold out only when no variant is for sale

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
* **Trace:** g10.store-product-listing.US1

**Pre-conditions:**

* `<tile product>` is in the catalogue, in the state its row describes.

**Test data:**

| Partition | `<tile product>` | `<expected tile>` |
| --- | --- | --- |
| Every variant for sale | 2 variants, both for sale. | Available. |
| Some variants for sale | 2 variants, the first not for sale, the second for sale. | Available. |
| One left | 1 variant, 1 for sale. | Available. |
| None for sale | Every variant at 0, by the recipe "Sell a card out". | Sold out. |

**Steps:**

1. Navigate to `<store listing url>`.
2. Find the card for `<tile product>`.
3. Read its availability.

**Expected Results:**

* Step 3 reads `<expected tile>`.
* The card shows no remaining count or scarcity cue.

<!-- trace:case id=g10.store-product-listing.TC-zpe rev=1 -->
#### g10.store-product-listing.US1-TC5: Tile prices show sales and basket-free discounts only

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
* **Testability:** automation
* **Trace:** g10.store-product-listing.US1

**Pre-conditions:**

* `<discount product>` is for sale at HKD880 (range: any price above HKD100), on the first page.
* The shop holds only `<shop discount>` for `<discount product>`.
* 1 minute has passed since the shop saved `<shop discount>`.

**Test data:**

| Partition | `<shop discount>` | `<expected price>` | `<expected strike>` |
| --- | --- | --- | --- |
| Sale price | Compare-at HKD1,000. | HKD880 | HKD1,000 struck |
| Product cut, no minimum | 10% off this product. | HKD792 = HKD880 × 0.9 | HKD880 struck |
| Order cut, no minimum | 10% off each item in the order. | HKD792 = HKD880 × 0.9 | HKD880 struck |
| Product cut with a minimum | 10% off after buying 2 units. | HKD880 | None |
| Order cut with a minimum | Spend HKD1,000, save HKD100. | HKD880 | None |
| Fixed amount once across the order | HKD100 off the order. | HKD880 | None |
| Buy X get Y | Buy 2, get 1 free. | HKD880 | None |
| Two cuts | 10% and 20% off this product, both no minimum. | HKD704 = HKD880 × 0.8 | HKD880 struck |
| An app's discount | A cut computed by a Shopify app. | HKD880 | None |

**Steps:**

1. Navigate to `<store listing url>`.
2. Read the card for `<discount product>`.

**Expected Results:**

* Step 2 shows `<expected price>`.
* Step 2 matches `<expected strike>`.
* The card names no discount.

<!-- trace:case id=g10.store-product-listing.TC-gps rev=1 -->
#### g10.store-product-listing.US1-TC6: An empty catalogue says so, with no Clear filters

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-product-listing.US1

**Pre-conditions:**

* The shop's store channel offers no products.

**Steps:**

1. Navigate to `<store listing url>`.
2. Read the results area.

**Expected Results:**

* Step 2 says the store has no products yet.
* Step 2 offers no Clear filters action.

---

### g10.store-product-listing.US2: Narrow by world and type

**As a** customer,
**I want** to narrow the listing to the worlds and kinds of collectible I collect,
**so that** I see how much is there before I pick.

<!-- trace:case id=g10.store-product-listing.TC-m8o rev=1 -->
#### g10.store-product-listing.US2-TC2: Worlds show five and See all worlds; types show whole

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-product-listing.US2

**Pre-conditions:**

* The catalogue holds cards in at least 6 worlds and at least 6 types.
* customer is on `<store listing url>` on a wide screen.

**Steps:**

1. Read the Worlds group in the sidebar.
2. Read the Types group.
3. Click the See all worlds text button.
4. Read the Worlds group again.

**Expected Results:**

* Step 1 shows 5 worlds and the See all worlds text button.
* Step 2 shows every type with cards.
* Step 4 shows every world with cards, each with its count.

<!-- trace:case id=g10.store-product-listing.TC-35z rev=1 -->
#### g10.store-product-listing.US2-TC3: A choice the catalogue never counts stays hidden; a starved one stays

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
* **Trace:** g10.store-product-listing.US2

**Pre-conditions:**

* customer is on `<store listing url>` on a wide screen.
* `<empty world>` is a world value no product in the catalogue carries.
* `<world B>` has cards, none matching `<narrowing>`.

**Test data:**

| Partition | `<narrowing>` |
| --- | --- |
| No narrowing | None. |
| Narrowed by a type | `<type A>` ticked. |
| Narrowed by search | Committed `<search words>`. |

**Steps:**

1. Apply `<narrowing>`.
2. Read the Worlds group, expanded.

**Expected Results:**

* Step 2 never shows `<empty world>`.
* Where `<narrowing>` is set, step 2 shows `<world B>` with count 0.
* `<world B>` can still be ticked or unticked.

<!-- trace:case id=g10.store-product-listing.TC-ytw rev=1 -->
#### g10.store-product-listing.US2-TC4: A narrowing nothing matches offers Clear filters

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
* **Trace:** g10.store-product-listing.US2

**Pre-conditions:**

* customer is on `<store listing url>` on a wide screen, narrowed by `<world B>` and `<type B>`, which no card shares.

**Steps:**

1. Read the results area.
2. Click Clear filters in the results area.
3. Read the cards and the count.

**Expected Results:**

* Step 1 says no product matches the filters.
* Step 3 lists the whole catalogue with its count.

<!-- trace:case id=g10.store-product-listing.TC-klx rev=1 -->
#### g10.store-product-listing.US2-TC6: Counts and sidebar move with the narrowing, not the scroll

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
* **Trace:** g10.store-product-listing.US2

**Pre-conditions:**

* customer is on `<store listing url>` on a wide screen, with no narrowing.
* `<world A>` has more cards than one page.

**Steps:**

1. Tick `<world A>`.
2. Read the count above the grid while the first page loads.
3. Read the count once the cards show.
4. Scroll to the end of the cards twice.
5. Read the count again.

**Expected Results:**

* Step 2 shows no count, never `0 products`.
* Step 3 equals `<world A>`'s count in the sidebar.
* Step 5 equals step 3.

<!-- trace:case id=g10.store-product-listing.TC-39v rev=1 -->
#### g10.store-product-listing.US2-TC8: A shop with no facets shows no facet groups, no message

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-product-listing.US2

**Pre-conditions:**

* The shop has configured no world or type facets.

**Steps:**

1. Navigate to `<store listing url>` on a wide screen.
2. Read the sidebar.

**Expected Results:**

* Step 2 shows no facet group and no message in its place.
* Step 2 shows the search field.
* The sort control shows.

---

### g10.store-product-listing.US3: Search the catalogue

**As a** customer,
**I want** to search the whole catalogue by words,
**so that** I can jump to a product or a narrowing.

<!-- trace:case id=g10.store-product-listing.TC-xwq rev=1 -->
#### g10.store-product-listing.US3-TC3: Suggestions say searching, or that nothing matched

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-product-listing.US3

**Pre-conditions:**

* customer is on `<store listing url>` on a wide screen.
* The suggestion read for `<typed words>` is in `<suggestion state>`.

**Test data:**

| Partition | `<typed words>` | `<suggestion state>` | `<expected panel>` |
| --- | --- | --- | --- |
| Waiting | `<search words>`. | Held pending. | Says it is searching. |
| No match | A string no title, world or type holds. | Answered with no hits. | Says nothing matched. |

**Steps:**

1. Type `<typed words>` in the search field.
2. Read the suggestion panel.
3. Press Enter.

**Expected Results:**

* Step 2 shows `<expected panel>`.
* Step 3 puts `<typed words>` in force as a chip.

<!-- trace:case id=g10.store-product-listing.TC-a9s rev=1 -->
#### g10.store-product-listing.US3-TC4: Picking a suggestion opens its product or applies its filter

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
* **Trace:** g10.store-product-listing.US3

**Pre-conditions:**

* customer is on `<store listing url>` on a wide screen, with no narrowing.

**Test data:**

| Partition | `<typed words>` | `<pick>` | `<expected outcome>` |
| --- | --- | --- | --- |
| Product | Part of `<search product>`'s title. | `<search product>` under products. | `<search product>`'s product page opens. |
| Filter | Part of `<world A>`'s name. | `<world A>` under filters. | The listing narrows by `<world A>`; a `<world A>` chip shows; no search chip. |

**Steps:**

1. Type `<typed words>` in the search field.
2. Click `<pick>`.
3. Read the page and the search field.

**Expected Results:**

* Step 3 shows `<expected outcome>`.
* For the filter row, the search field is empty.

---

### g10.store-product-listing.US5: Browse inside a collection

**As a** customer,
**I want** to arrive in the listing inside a collection and step out of it,
**so that** I can follow the shop's grouping or leave it for my own.

<!-- trace:case id=g10.store-product-listing.TC-s9s rev=1 -->
#### g10.store-product-listing.US5-TC1: A collection address opens inside it, named and dismissible

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** acceptance, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-product-listing.US5

**Pre-conditions:**

* `<collection>` is a published collection with a known name, handle and products.

**Steps:**

1. Navigate to `<store listing url>?collection=<collection handle>`.
2. Read the area above the grid, the sort control and the cards.
3. Dismiss the collection's name.
4. Read the cards, the count and the address bar.

**Expected Results:**

* Step 2 names `<collection>` above the grid.
* Step 2's sort control names latest product.
* Every card in step 2 belongs to `<collection>`.
* Step 4 lists the whole catalogue with its count.
* Step 4's address names no collection.

<!-- trace:case id=g10.store-product-listing.TC-qme rev=1 -->
#### g10.store-product-listing.US5-TC2: Filtering or searching leaves the collection; ordering keeps it

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
* **Trace:** g10.store-product-listing.US5

**Pre-conditions:**

* customer is on `<store listing url>?collection=<collection handle>` on a wide screen.

**Test data:**

| Partition | `<action>` | `<expected collection>` |
| --- | --- | --- |
| Tick a world | Tick `<world A>`. | Gone; `<world A>` over the whole catalogue. |
| Commit a search | Type `<search words>` and press Enter. | Gone; the search over the whole catalogue. |
| Choose an order | Choose lowest price. | Kept; `<collection>` in lowest-price order. |

**Steps:**

1. Do `<action>`.
2. Read the area above the grid, the cards and the address bar.

**Expected Results:**

* Step 2 matches `<expected collection>`.
* Step 2's address names the collection only where it is kept.

---

### g10.store-product-listing.US9: See the shop's current catalogue

**As a** customer,
**I want** the listing to show what the shop sells now,
**so that** I do not chase a card that has gone or changed.

<!-- trace:case id=g10.store-product-listing.TC-zzi rev=1 -->
#### g10.store-product-listing.US9-TC1: A shop change reaches the listing within seconds

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** performance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-product-listing.US9

**Pre-conditions:**

* customer is on `<listing view>` on staging.
* admin is in the staging shop's admin, on `<change product>`.

**Test data:**

| Partition | `<shop change>` | `<listing view>` | `<limit>` |
| --- | --- | --- | --- |
| Publish | Publish a new product to the store's channel. | `<store listing url>`. | 10 seconds |
| Take down | Unpublish `<change product>`. | `<store listing url>`. | 10 seconds |
| Reprice | Change `<change product>`'s price. | `<store listing url>`. | 10 seconds |
| Sell out | Sell `<change product>` out. | `<store listing url>`. | 10 seconds |
| Bring back | Restock a sold-out `<change product>`. | `<store listing url>`. | 10 seconds |
| Inside a collection | Reprice `<change product>`, in `<collection>`. | `<store listing url>?collection=<collection handle>`. | 1 minute |

**Steps:**

1. Make `<shop change>` and save.
2. Confirm the shop's admin shows the change saved.
3. Reload `<listing view>` every few seconds.
4. Read the card, the count and the sidebar counts.

**Expected Results:**

* Step 4 shows the change within `<limit>` of step 2.
* The count and sidebar counts follow the change.

<!-- trace:case id=g10.store-product-listing.TC-2gw rev=1 -->
#### g10.store-product-listing.US9-TC2: A change the shop never reports shows within 5 minutes

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** performance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-product-listing.US9

**Pre-conditions:**

* The shop's change reports to the store are blocked.
* `<change product>` shows on `<store listing url>`.

**Steps:**

1. Reprice `<change product>` in the shop.
2. Reload `<store listing url>` every 30 seconds.
3. Read the card for `<change product>`.

**Expected Results:**

* Step 3 shows the new price within 5 minutes of step 1.

<!-- trace:case id=g10.store-product-listing.TC-xyx rev=1 -->
#### g10.store-product-listing.US9-TC3: Listing keeps answering while the shop is unreachable

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-product-listing.US9

**Pre-conditions:**

* The store cannot reach the shop.
* The catalogue mirror holds `<catalogue>`.

**Steps:**

1. Navigate to `<store listing url>`.
2. Tick `<world A>`.
3. Click the name of an available card.

**Expected Results:**

* Step 1 shows the cards, the count and the sidebar.
* Step 2 narrows with its counts.
* Step 3 waits on the shop.
