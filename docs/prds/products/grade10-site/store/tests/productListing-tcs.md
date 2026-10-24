---
title: Store Product Listing Test Cases
---

# grade10-site/store/product-listing Test Cases

**Status:** pending-review · 0/35
**Drafts styled:** 2026-10-24, tcs-rules r7
**Capabilities:** grade10-site/store/product-listing, grade10-site/store/discounts

## Background

* `<listing url>` is `<g10url>/store/collections`.
* `<catalogue>` holds at least 3 pages of cards across at least 6 worlds and 2 types, with known creation dates and prices; `<world A>` and `<world B>` are worlds with cards and known counts, `<type A>` a type with cards inside `<world A>`; `<search words>` is a word in at least 6 product titles and in no world or type name.

## Walk 1: Browse, narrow and search on a wide screen

**Starting state:**

- customer(signed out) on `<listing url>`, in a wide desktop browser window; the catalogue is `<catalogue>`; `<cheapest product>` has the lowest variant price and is not on the first page at rest

### Route

1. Read the sort control, the count above the grid and the first cards.
   - Latest product, and the whole set's count `g10.store-product-listing.TC1`
2. Scroll to the end of the cards twice.
   - Cards added below, no paging control, the count still `g10.store-product-listing.TC2`
3. Select an available card's name, then go back.
   - Its product page opened `g10.store-product-listing.TC3`
4. Tick `<world A>`, then `<type A>`.
   - The narrowed cards, counts, chips and address `g10.store-product-listing.TC11`
5. Copy the address and open it in a new private window.
   - The same narrowing at its first page `g10.store-product-listing.TC13`
6. Back in the first window, dismiss the `<type A>` chip, go back, then select Clear filters.
   - Each widening `g10.store-product-listing.TC12`
7. Type `<search words>` in the search field.
   - Up to five product suggestions `g10.store-product-listing.TC23`
8. Press Enter.
   - A search chip, the field cleared, the cards narrowed `g10.store-product-listing.TC24`
9. Clear filters, then order by lowest price, then highest price.
   - The menu's three orders, and `<cheapest product>` first `g10.store-product-listing.TC4`

## Walk 2: [Mobile only] Narrow the listing on a phone

**Starting state:**

- customer(signed out) on `<listing url>`, on a phone below the wide breakpoint

### Route

1. Read the area above the grid.
   - The count and the pills, with no search `g10.store-product-listing.TC14`
2. Open the sort pill and choose highest price.
   - A bottom drawer; the order applies on choose `g10.store-product-listing.TC16`
3. Open the Worlds pill, tick `<world A>` and `<world B>`, then tap Show Results.
   - The draft applies, and the pill names the count `g10.store-product-listing.TC15`
4. Read an available card without touching it.
   - Its cart control is visible `g10.store-product-listing.TC27`

## Walk 3: Fill a guest cart from the listing

**Starting state:**

- customer(signed out) on `<listing url>`, with an empty cart in this browser; `<cart product>` is available on the first page, with at least 3 for sale

### Route

1. Select Add to cart on `<cart product>`'s card.
   - Quantity controls, and no sign-in asked `g10.store-product-listing.TC28`
2. Select increase twice, decrease once, then remove.
   - 3, then 2, then Add to cart again `g10.store-product-listing.TC28`

## product-listing: Product Listing

<!-- trace:case id=g10.store-product-listing.TC-4yp rev=1 -->
### g10.store-product-listing.TC1: The listing opens on latest product, counting the whole set

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** product-listing

**Pre-conditions:**

* The catalogue holds `<catalogue>`, larger than one page of cards.

**Test data:**

| Address |
| --- |
| `<listing url>` |
| `<listing url>` copied from the listing before any choice, carrying no order |

**Steps:**

1. Open the row's address.
2. Read the sort control, the count above the grid and the first cards.

**Expected Results:**

* Latest product is named; the count is every card for sale and sold out in `<catalogue>`, not the cards on screen; the cards for sale list newest first, UI matching store-product-listing-screens-product-list--default.

<!-- trace:case id=g10.store-product-listing.TC-toj rev=1 -->
### g10.store-product-listing.TC2: Scrolling to the end adds the next cards below, and the count stays

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** product-listing

**Pre-conditions:**

* The catalogue holds at least 3 pages of cards; customer is on `<listing url>` with its first page loaded.

**Steps:**

1. Note the count and the last card.
2. Scroll to the end of the cards, twice.

**Expected Results:**

* No page number, next control or load-more button shows.
* Each scroll adds cards below the last ones, UI matching store-product-listing-blocks-productbrowse-states--loading-more while they load; the count stays as in step 1.

<!-- trace:case id=g10.store-product-listing.TC-m0e rev=2 -->
### g10.store-product-listing.TC3: An available card's name and photo open its product page

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** product-listing

**Pre-conditions:**

* `<tile product>` is for sale, with a known handle, on the first page of `<listing url>`.

**Steps:**

1. Select `<tile product>`'s name.
2. Go back, then select its photo.

**Expected Results:**

* Each opens `/store/products/<handle>`.

<!-- trace:case id=g10.store-product-listing.TC-kkm rev=1 -->
### g10.store-product-listing.TC4: Ordering by price covers the whole catalogue, cards for sale first

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** product-listing

**Pre-conditions:**

* customer is on `<listing url>` with no narrowing, first page only.
* `<cheapest product>` is for sale and not on the first page at rest; `<sold-out product>` is sold out and cheaper than every card for sale; `<multi-variant product>` has variants at `<lowest variant price>` and a higher one.

**Test data:**

| Order | First card for sale |
| --- | --- |
| lowest price | `<cheapest product>` |
| highest price | the card with the highest lowest-variant price |
| latest product | the newest card for sale |

**Steps:**

1. Open the sort control and read its choices.
2. Choose the row's order, then scroll to the end.
3. Read the address bar.

**Expected Results:**

* Step 1 offers latest product, lowest price and highest price only.
* Step 2 starts with the row's first card; every card for sale lists before `<sold-out product>`; `<multi-variant product>` sorts at `<lowest variant price>`.
* Step 3 carries `sort=` for a price order.

---

## product-listing#adaptive-filter: Adaptive Filter

<!-- trace:case id=g10.store-product-listing.TC-5u2 rev=1 -->
### g10.store-product-listing.TC11: Ticking a world and a type narrows the cards, the counts and the address

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** product-listing#adaptive-filter

**Pre-conditions:**

* customer is on `<listing url>` on a wide screen, with no narrowing; `<world A>`, `<world B>` and `<type A>` hold cards with known counts.

**Test data:**

| Choices | Address carries |
| --- | --- |
| `<world A>` | `worlds=<world A handle>` |
| `<world A>`, then `<type A>` | `worlds=<world A handle>` and `types=<type A handle>` |

**Steps:**

1. Read the count beside `<world A>`.
2. Tick the row's choices.
3. Read the cards, the count, the chips, the count beside `<world B>` and the address bar.

**Expected Results:**

* Every card belongs to the choices; for one world the count equals step 1's.
* A chip shows for each choice; `<world B>`'s count says what picking it instead would find.
* The address carries the row's.

<!-- trace:case id=g10.store-product-listing.TC-uzx rev=1 -->
### g10.store-product-listing.TC12: A chip, Back and Clear filters each widen the listing

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** product-listing#adaptive-filter

**Pre-conditions:**

* customer is on `<listing url>` on a wide screen, narrowed by `<world A>` then `<type A>`.

**Test data:**

| Action | Narrowing afterwards |
| --- | --- |
| dismiss the `<type A>` chip | `<world A>` alone |
| the browser's Back | `<world A>` alone |
| Clear filters | none |

**Steps:**

1. Do the row's action.
2. Read the chips, the count and the address bar.

**Expected Results:**

* The row's narrowing, with its count, and the address carries only it.

<!-- trace:case id=g10.store-product-listing.TC-gld rev=1 -->
### g10.store-product-listing.TC13: A shared listing address opens the same narrowing at the top

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** product-listing#adaptive-filter

**Pre-conditions:**

* customer has `<listing url>` narrowed by `<world A>` and `<type A>`, scrolled past its first page.

**Test data:**

| Route |
| --- |
| copy the address and open it in a new private window |
| open a card's product page, then go back |

**Steps:**

1. Follow the row's route.
2. Read the chips, the count and the first cards.

**Expected Results:**

* Chips for `<world A>` and `<type A>`, the narrowing's count, and its first page at the top.

<!-- trace:case id=g10.store-product-listing.TC-qa1 rev=1 -->
### g10.store-product-listing.TC14: [Mobile only] A small screen shows the count and pills, and no search

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** product-listing#adaptive-filter

**Pre-conditions:**

* customer is on a phone below the wide breakpoint, on `<listing url>`, with the row's worlds in force.

**Test data:**

| Worlds in force | Worlds pill |
| --- | --- |
| none | Worlds |
| `<world A>` | `<world A>`'s name |
| `<world A>` and `<world B>` | a compact name with the count 2 |

**Steps:**

1. Read the area above the grid and the Worlds pill.

**Expected Results:**

* The result count and pills for sort, Worlds and Types, UI matching store-product-listing-blocks-productbrowse--narrow; no search field, Filter icon, left drawer or chip row.
* The Worlds pill reads the row's label.

<!-- trace:case id=g10.store-product-listing.TC-rqy rev=1 -->
### g10.store-product-listing.TC15: [Mobile only] A facet pill's drawer applies its draft on Show Results

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** product-listing#adaptive-filter

**Pre-conditions:**

* customer is on a phone below the wide breakpoint, on `<listing url>`, with no narrowing.

**Test data:**

| Taps | Narrowing |
| --- | --- |
| tick `<world A>` and `<world B>`, then Show Results | `<world A>` and `<world B>` |
| tick `<world A>`, Clear, then Show Results, UI matching store-product-listing-blocks-productbrowse--narrow-facet-clear-draft | none |

**Steps:**

1. Tap the Worlds pill.
2. Do the row's taps.
3. Read the cards, the count and the Worlds pill.

**Expected Results:**

* Step 1 opens a bottom drawer for Worlds; ticking narrows nothing before Show Results.
* Step 3 lists the row's narrowing.

<!-- trace:case id=g10.store-product-listing.TC-83t rev=1 -->
### g10.store-product-listing.TC16: [Mobile only] The sort pill's drawer applies an order on choose

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** product-listing#adaptive-filter

**Pre-conditions:**

* customer is on a phone below the wide breakpoint, on `<listing url>`, ordered by latest product.

**Steps:**

1. Tap the sort pill.
2. Tap highest price.

**Expected Results:**

* Step 1 opens a bottom drawer of orders.
* Step 2 applies it, UI matching store-product-listing-blocks-productbrowse--narrow-sort-applies-on-choose, listing the highest-priced card for sale first; ❓ the drawer closes - design confirms.

---

## product-listing#search: Search

<!-- trace:case id=g10.store-product-listing.TC-5h3 rev=1 -->
### g10.store-product-listing.TC23: Typing suggests up to five products and five filters

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** product-listing#search

**Pre-conditions:**

* customer is on `<listing url>` on a wide screen, with the row's facets in force.

**Test data:**

| Words | Facets in force | Suggestions |
| --- | --- | --- |
| `<search words>`, in at least 6 titles | none | exactly 5 products; no filter group |
| a word in at least 6 world or type names | none | exactly 5 filters, each with World or Type beside its name |
| a word in a title outside `<world A>` | `<world A>` | that product among the products |

**Steps:**

1. Select the search field and type the row's words.

**Expected Results:**

* The row's suggestions, every product suggestion a store product, UI matching store-product-listing-blocks-productbrowse-search--suggestions-and-commit.

<!-- trace:case id=g10.store-product-listing.TC-dwm rev=1 -->
### g10.store-product-listing.TC24: Enter commits the words as a chip and clears the field

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** product-listing#search

**Pre-conditions:**

* customer is on `<listing url>` on a wide screen, narrowed by `<world A>`.

**Test data:**

| Words |
| --- |
| `<search words>` |
| a string no title, world or type holds |

**Steps:**

1. Type the row's words and press Enter.
2. Dismiss the search chip.

**Expected Results:**

* Step 1: a search chip beside the `<world A>` chip, the field empty, only cards matching both over the whole catalogue, and `q=` in the address.
* Step 2 lists `<world A>` alone again.

---

## product-listing#product-tile: Product Tile

<!-- trace:case id=g10.store-product-listing.TC-6x5 rev=1 -->
### g10.store-product-listing.TC27: The cart control shows without hover on narrow and touch screens

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** product-listing#product-tile

**Pre-conditions:**

* customer is on `<listing url>` on the row's device; an available card shows on the first page.

**Test data:**

| Device |
| --- |
| a desktop browser below the wide breakpoint, with a mouse |
| a phone browser with touch |

**Steps:**

1. Read the available card without hovering or tapping it.

**Expected Results:**

* Its Add to cart control is visible.

<!-- trace:case id=g10.store-product-listing.TC-glr rev=2 -->
### g10.store-product-listing.TC28: A guest's card controls add the card and change its quantity, kept across a reload

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** product-listing#product-tile

**Pre-conditions:**

* customer(signed out) is on `<listing url>`; `<cart product>` is available on the first page with at least 3 for sale; the cart holds the row's quantity.

**Test data:**

| Cart holds | Control | Card afterwards |
| --- | --- | --- |
| nothing | Add to cart | quantity 1, with increase, decrease and remove |
| 2 | increase | quantity 3 |
| 2 | decrease | quantity 1 |
| 2 | remove | Add to cart, no quantity |

**Steps:**

1. Select the row's control on `<cart product>`'s card.
2. Reload the page.

**Expected Results:**

* Step 1 asks for no sign-in and shows the row's card; step 2 shows it still.

---

## Ungrouped

### product-listing: Product Listing

<!-- trace:case id=g10.store-product-listing.TC-gps rev=1 -->
#### g10.store-product-listing.TC7: An empty catalogue says so, with no Clear filters

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** product-listing

**Pre-conditions:**

* The shop's store channel offers no products.

**Steps:**

1. Open `<listing url>` and read the results area.

**Expected Results:**

* It says the store has no products yet, with no Clear filters, UI matching store-product-listing-screens-product-list--empty-catalogue.

<!-- trace:case id=g10.store-product-listing.TC-s9s rev=1 -->
#### g10.store-product-listing.TC8: A collection address opens inside it, named and dismissible

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** product-listing

**Pre-conditions:**

* `<collection>` is a published collection with a known name, handle and products.

**Steps:**

1. Open `<listing url>?collection=<collection handle>`.
2. Dismiss the collection's name.

**Expected Results:**

* Step 1 names `<collection>` above the grid, the sort control names latest product, and every card belongs to it.
* Step 2 lists the whole catalogue with its count, and the address names no collection.

<!-- trace:case id=g10.store-product-listing.TC-qme rev=2 -->
#### g10.store-product-listing.TC9: Filtering or searching leaves the collection behind

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** product-listing

**Pre-conditions:**

* customer is on `<listing url>?collection=<collection handle>` on a wide screen.

**Test data:**

| Action |
| --- |
| tick `<world A>` |
| type `<search words>` and press Enter |

**Steps:**

1. Do the row's action.
2. Read the area above the grid, the cards and the address bar.

**Expected Results:**

* The collection is gone; the row's narrowing applies over the whole catalogue, and the address names no collection.

#### g10.store-product-listing.TC10: Choosing an order keeps the collection

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** product-listing

**Pre-conditions:**

* customer is on `<listing url>?collection=<collection handle>` on a wide screen.

**Steps:**

1. Choose lowest price.

**Expected Results:**

* `<collection>` stays named, listed in lowest-price order, and the address still names it.

---

### product-listing#product-tile: Product Tile

<!-- trace:case id=g10.store-product-listing.TC-mvj rev=2 -->
#### g10.store-product-listing.TC5: A card reads available while any of its variants is for sale

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** product-listing#product-tile

**Pre-conditions:**

* `<tile product>` is in the catalogue with the row's variants.

**Test data:**

| Variants |
| --- |
| 2, both for sale |
| 2, the first not for sale, the second for sale |
| 1, with 1 for sale |

**Steps:**

1. Open `<listing url>` and read `<tile product>`'s card.

**Expected Results:**

* Available, with no remaining count or scarcity cue.

#### g10.store-product-listing.TC6: A sold-out card reads sold out and opens nothing

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** product-listing#product-tile

**Pre-conditions:**

* `<sold-out product>` has every variant at 0, by the recipe "Sell a card out", on the first page.

**Steps:**

1. Open `<listing url>` and read its card.
2. Select its name, then its photo.

**Expected Results:**

* Step 1 reads sold out.
* Step 2 opens nothing; the listing stays.

<!-- trace:case id=g10.store-product-listing.TC-qil rev=2 -->
#### g10.store-product-listing.TC29: Card changes reach the member's own cart

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** product-listing#product-tile

**Pre-conditions:**

* customer, a member with an empty cart, is on `<listing url>` as the row says; `<cart product>` is available on the first page with at least 3 for sale.

**Test data:**

| Adds while | Then |
| --- | --- |
| signed in | signs in as the same member in another browser |
| signed out | signs in as the member in this browser |

**Steps:**

1. Select Add to cart on `<cart product>`, then increase twice and decrease once.
2. Do the row's step, then open `<listing url>` and read `<cart product>`'s card.

**Expected Results:**

* Step 2 shows `<cart product>` at 2.

---

### discounts#where-each-shows: Where Each Shows

<!-- trace:case id=g10.store-product-listing.TC-zpe rev=1 -->
#### g10.store-product-listing.TC30: A card's price shows sales and basket-free discounts only

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** discounts#where-each-shows

**Pre-conditions:**

* `<discount product>` is for sale at HKD880 (any price above HKD100), on the first page; the shop holds only the row's discount for it, saved at least a minute ago.

**Test data:**

| Discount | Price | Struck |
| --- | --- | --- |
| compare-at HKD1,000 | HKD880 | HKD1,000 |
| 10% off this product | HKD792 = HKD880 × 0.9 | HKD880 |
| 10% off each item in the order | HKD792 = HKD880 × 0.9 | HKD880 |
| 10% off after buying 2 units | HKD880 | none |
| spend HKD1,000, save HKD100 | HKD880 | none |
| HKD100 off the order | HKD880 | none |
| buy 2, get 1 free | HKD880 | none |
| 10% and 20% off this product, both no minimum | HKD704 = HKD880 × 0.8 | HKD880 |
| a cut computed by a Shopify app | HKD880 | none |

**Steps:**

1. Open `<listing url>` and read `<discount product>`'s card.

**Expected Results:**

* The row's price and strike; the card names no discount (❓ a conditional offer's name on the card waits on design).

---

### product-listing#adaptive-filter: Adaptive Filter

<!-- trace:case id=g10.store-product-listing.TC-m8o rev=1 -->
#### g10.store-product-listing.TC17: Worlds show five and See all worlds; types show whole

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** product-listing#adaptive-filter

**Pre-conditions:**

* The catalogue holds cards in at least 6 worlds and 6 types; customer is on `<listing url>` on a wide screen.

**Steps:**

1. Read the Worlds and Types groups.
2. Select See all worlds.

**Expected Results:**

* Step 1: 5 worlds and See all worlds; every type with cards.
* Step 2: every world with cards, each with its count.

<!-- trace:case id=g10.store-product-listing.TC-35z rev=2 -->
#### g10.store-product-listing.TC18: A choice the catalogue never counts never shows

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** product-listing#adaptive-filter

**Pre-conditions:**

* `<empty world>` is a world no product carries; customer is on `<listing url>` on a wide screen, narrowed as the row says.

**Test data:**

| Narrowing |
| --- |
| none |
| `<type A>` ticked |
| `<search words>` committed |

**Steps:**

1. Read the Worlds group, expanded.

**Expected Results:**

* `<empty world>` is not there.

#### g10.store-product-listing.TC19: A choice the narrowing starved stays, at 0, and can still be ticked

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** product-listing#adaptive-filter

**Pre-conditions:**

* `<world B>` has cards, none matching the row's narrowing; customer is on `<listing url>` on a wide screen.

**Test data:**

| Narrowing |
| --- |
| `<type A>` ticked |
| `<search words>` committed |

**Steps:**

1. Apply the row's narrowing and read the Worlds group.
2. Tick `<world B>`, then untick it.

**Expected Results:**

* Step 1 shows `<world B>` with count 0.
* Step 2 ticks and unticks it.

<!-- trace:case id=g10.store-product-listing.TC-ytw rev=1 -->
#### g10.store-product-listing.TC20: A narrowing nothing matches offers Clear filters

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** product-listing#adaptive-filter

**Pre-conditions:**

* customer is on `<listing url>` on a wide screen, narrowed by `<world B>` and `<type B>`, which no card shares.

**Steps:**

1. Read the results area.
2. Select Clear filters there.

**Expected Results:**

* Step 1 says no product matches the filters, UI matching store-product-listing-screens-product-list--no-match.
* Step 2 lists the whole catalogue with its count.

<!-- trace:case id=g10.store-product-listing.TC-klx rev=1 -->
#### g10.store-product-listing.TC21: The count moves with the narrowing, not the scroll

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** product-listing#adaptive-filter

**Pre-conditions:**

* customer is on `<listing url>` on a wide screen, with no narrowing; `<world A>` has more cards than one page.

**Steps:**

1. Tick `<world A>` and read the count while the first page loads, then once the cards show.
2. Scroll to the end twice and read it again.

**Expected Results:**

* While loading, no count shows, never `0 products`; then `<world A>`'s sidebar count.
* Step 2: the same count.

<!-- trace:case id=g10.store-product-listing.TC-39v rev=1 -->
#### g10.store-product-listing.TC22: A shop with no facets shows no facet groups and no message

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** product-listing#adaptive-filter

**Pre-conditions:**

* The shop has configured no world or type facets.

**Steps:**

1. Open `<listing url>` on a wide screen and read the sidebar.

**Expected Results:**

* No facet group and no message in its place; the search field and the sort control show.

---

### product-listing#search: Search

<!-- trace:case id=g10.store-product-listing.TC-xwq rev=1 -->
#### g10.store-product-listing.TC25: Suggestions say they are searching, or that nothing matched

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** product-listing#search

**Pre-conditions:**

* customer is on `<listing url>` on a wide screen; the suggestion read is in the row's state.

**Test data:**

| Words | Suggestion read | Panel |
| --- | --- | --- |
| `<search words>` | held pending | says it is searching |
| a string no title, world or type holds | answered with no hits | says nothing matched |

**Steps:**

1. Type the row's words and read the suggestion panel.
2. Press Enter.

**Expected Results:**

* Step 1: the row's panel.
* Step 2 puts the words in force as a chip.

<!-- trace:case id=g10.store-product-listing.TC-a9s rev=1 -->
#### g10.store-product-listing.TC26: Picking a suggestion opens its product or applies its filter

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** product-listing#search

**Pre-conditions:**

* customer is on `<listing url>` on a wide screen, with no narrowing.

**Test data:**

| Words | Pick | Outcome |
| --- | --- | --- |
| part of `<search product>`'s title | `<search product>`, under products | its product page opens |
| part of `<world A>`'s name | `<world A>`, under filters | the listing narrows by `<world A>`, with its chip and no search chip, UI matching store-product-listing-blocks-productbrowse-search--select-filter-applies-chip |

**Steps:**

1. Type the row's words and select the row's pick.

**Expected Results:**

* The row's outcome, and the search field empty.

---

### product-listing#product-data: Product Data

<!-- trace:case id=g10.store-product-listing.TC-zzi rev=1 -->
#### g10.store-product-listing.TC31: A change the shop reports reaches the listing within seconds

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** product-listing#product-data

**Pre-conditions:**

* customer is on the row's view; admin is in the shop's admin, on `<change product>`.

**Test data:**

| Change | View | Limit |
| --- | --- | --- |
| publish a new product to the store's channel | `<listing url>` | 10 seconds |
| unpublish `<change product>` | `<listing url>` | 10 seconds |
| change `<change product>`'s price | `<listing url>` | 10 seconds |
| sell `<change product>` out | `<listing url>` | 10 seconds |
| restock a sold-out `<change product>` | `<listing url>` | 10 seconds |
| reprice `<change product>`, in `<collection>` | `<listing url>?collection=<collection handle>` | 1 minute |

**Steps:**

1. Make the row's change and save, and confirm the admin shows it saved.
2. Reload the row's view every few seconds and read the card, the count and the sidebar counts.

**Expected Results:**

* The change shows within the row's limit of step 1, with the counts following it.

<!-- trace:case id=g10.store-product-listing.TC-2gw rev=1 -->
#### g10.store-product-listing.TC32: A change the shop never reports shows within 5 minutes

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** product-listing#product-data

**Pre-conditions:**

* The shop's change reports to the store are blocked; `<change product>` shows on `<listing url>`.

**Steps:**

1. Reprice `<change product>` in the shop.
2. Reload `<listing url>` every 30 seconds.

**Expected Results:**

* The new price shows within 5 minutes of step 1.

<!-- trace:case id=g10.store-product-listing.TC-xyx rev=2 -->
#### g10.store-product-listing.TC33: While the shop is unreachable the listing keeps answering

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** product-listing#product-data

**Pre-conditions:**

* The store cannot reach the shop; its mirror holds `<catalogue>`.

**Steps:**

1. Open `<listing url>`.
2. Tick `<world A>`.

**Expected Results:**

* Step 1 shows the cards, the count and the sidebar.
* Step 2 narrows, with its counts.

#### g10.store-product-listing.TC34: While the shop is unreachable, opening a product waits on it

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** product-listing#product-data

**Pre-conditions:**

* The store cannot reach the shop; customer is on `<listing url>`.

**Steps:**

1. Select an available card's name.

**Expected Results:**

* The product page waits on the shop, and opens once the shop answers.

<!-- trace:case id=g10.store-product-listing.TC-82a rev=1 -->
#### g10.store-product-listing.TC35: A product in Draft stays off the cards, the counts and search

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** product-listing#product-data

**Pre-conditions:**

* admin is in the shop's admin; `<draft product>` carries `<world A>` and a title word `<draft word>` no other product has, in the row's state.

**Test data:**

| `<draft product>` |
| --- |
| ❓ created as Draft and published to the store's channel - product confirms |
| ❓ an active product set to Draft and saved - product confirms |

**Steps:**

1. Wait 60 seconds past the save, then open `<listing url>` and read the count and `<world A>`'s count.
2. Tick `<world A>`, then type `<draft word>` and press Enter.

**Expected Results:**

* Neither count includes `<draft product>`; it is not listed, suggested or found.
