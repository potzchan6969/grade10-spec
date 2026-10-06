# grade10-site/store/product-listing Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-24, tcs-rules r3.0

## grade10-site-store-product-listing-US1: Collector opens the listing at its own address

**As a** collector,
**I want** the browse listing to answer at an address of its own, with its own
title and metadata, before any script runs,
**so that** I can link to, share and bookmark the catalogue rather than click
into it.

<!-- trace:case id=g10.store-product-listing.TC-xve rev=1 covers=g10.store-product-listing.SC-4mv,g10.store-product-listing.SC-eac -->
### grade10-site-store-product-listing-US1-TC1-1: Listing address answers before scripts run

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-product-listing-US-01

**Pre-conditions:**

* The shop lists <a product>.

**Steps:**

1. Open <grade10 browse listing url> with scripts disabled.
2. Read the page title, metadata and product tile.

**Expected Results:**

* The listing answers at its own address.
* Its title, metadata and product tile are present before scripts run.

<!-- trace:case id=g10.store-product-listing.TC-jg5 rev=1 covers=g10.store-product-listing.SC-4mv,g10.store-product-listing.SC-eac -->
### grade10-site-store-product-listing-US1-TC6-1: Saved listing address reopens the catalogue

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
* **Trace:** grade10-site-store-product-listing-US-01

**Pre-conditions:**

* <grade10 browse listing url> names the whole catalogue.

**Steps:**

1. Save <grade10 browse listing url> as a bookmark.
2. Open the bookmark in a fresh browser tab.

**Expected Results:**

* The whole catalogue opens at the saved address.

<!-- trace:case id=g10.store-product-listing.TC-pj9 rev=1 covers=g10.store-product-listing.SC-4mv,g10.store-product-listing.SC-eac -->
### grade10-site-store-product-listing-US1-TC3-1: Tile is available while any variant is offered

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
* **Trace:** grade10-site-store-product-listing-US-01

**Pre-conditions:**

* Shopify offers one variant of <a product> and does not offer another.

**Steps:**

1. Navigate to <grade10 browse listing url>.
2. Read <a product>'s tile.

**Expected Results:**

* The tile reads available.
* The tile shows no remaining count or scarcity cue.

<!-- trace:case id=g10.store-product-listing.TC-ek4 rev=1 covers=g10.store-product-listing.SC-4mv,g10.store-product-listing.SC-eac -->
### grade10-site-store-product-listing-US1-TC4-1: Tile is out of stock only when every variant is unavailable

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-listing-US-01

**Pre-conditions:**

* Shopify does not offer any variant of <a product> for sale.

**Steps:**

1. Navigate to <grade10 browse listing url>.
2. Read <a product>'s tile and look for a usable add control.

**Expected Results:**

* The tile reads out of stock without a remaining count or scarcity cue.
* No usable add control is offered.

<!-- trace:case id=g10.store-product-listing.TC-ca2 rev=1 covers=g10.store-product-listing.SC-4mv,g10.store-product-listing.SC-eac -->
### grade10-site-store-product-listing-US1-TC5-1: Quantity above the shop count reaches cart review

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
* **Trace:** grade10-site-store-product-listing-US-01

**Pre-conditions:**

* Shopify offers <a product>'s item with inventory 1.

**Test data:**

| Requested quantity |
| ---: |
| 2 |

**Steps:**

1. Navigate to <grade10 browse listing url>.
2. Request the quantity in the row on <a product>'s tile.
3. Add the item.
4. Open cart review.

**Expected Results:**

* The tile accepts the requested quantity without a stock-derived maximum.
* Cart review receives the requested quantity.

---

## grade10-site-store-product-listing-US2: Collector opens a collection from its address

**As a** collector,
**I want** an address that names a collection to open the listing already
narrowed to it,
**so that** a way into the catalogue can be linked, shared and bookmarked
rather than clicked into.

<!-- trace:case id=g10.store-product-listing.TC-1an rev=1 covers=g10.store-product-listing.SC-aty,g10.store-product-listing.SC-ksc,g10.store-product-listing.SC-o37 -->
### grade10-site-store-product-listing-US2-TC1-1: Collection address opens its products

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-listing-US-02

**Pre-conditions:**

* <a collection> contains <a product>.

**Steps:**

1. Navigate to <grade10 collection listing url>.
2. Read the collection name and product tiles.

**Expected Results:**

* The listing names <a collection>.
* The tiles belong to <a collection>.

<!-- trace:case id=g10.store-product-listing.TC-i25 rev=1 covers=g10.store-product-listing.SC-aty,g10.store-product-listing.SC-ksc,g10.store-product-listing.SC-o37 -->
### grade10-site-store-product-listing-US2-TC4-1: Collection address opens directly in a fresh tab

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
* **Trace:** grade10-site-store-product-listing-US-02

**Pre-conditions:**

* <grade10 collection listing url> names <a collection>.

**Steps:**

1. Open <grade10 collection listing url> in a fresh browser tab.

**Expected Results:**

* The listing opens already narrowed to <a collection>.

<!-- trace:case id=g10.store-product-listing.TC-7tl rev=1 covers=g10.store-product-listing.SC-aty,g10.store-product-listing.SC-ksc,g10.store-product-listing.SC-o37 -->
### grade10-site-store-product-listing-US2-TC5-1: Storefront collection tile opens the named collection

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
* **Trace:** grade10-site-store-product-listing-US-02

**Pre-conditions:**

* <A storefront collection tile> names <a collection>.

**Steps:**

1. Open <a storefront collection tile>.

**Expected Results:**

* The listing opens at an address naming <a collection>.
* The listing shows products from <a collection>.

---

## grade10-site-store-product-listing-US3: Collector leaves the collection they arrived in

**As a** collector who came in through a collection,
**I want** to see which collection I am inside and step out of it,
**so that** I can search the whole catalogue without going back to where I came
from.

<!-- trace:case id=g10.store-product-listing.TC-ssy rev=2 covers=g10.store-product-listing.SC-9nu,g10.store-product-listing.SC-2oj,g10.store-product-listing.SC-3ya,g10.store-product-listing.SC-eqs -->
### grade10-site-store-product-listing-US3-TC5-2: Listing names the collection in force

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
* **Trace:** grade10-site-store-product-listing-US-03

**Pre-conditions:**

* customer is on <a collection listing url>.

**Steps:**

1. Read the collection name above the listing.

**Expected Results:**

* The listing names the collection in the address.
* The collection can be dismissed.

<!-- trace:case id=g10.store-product-listing.TC-2ab rev=2 covers=g10.store-product-listing.SC-9nu,g10.store-product-listing.SC-2oj,g10.store-product-listing.SC-3ya,g10.store-product-listing.SC-eqs -->
### grade10-site-store-product-listing-US3-TC6-2: Dismissing collection opens the whole catalogue

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
* **Trace:** grade10-site-store-product-listing-US-03

**Pre-conditions:**

* customer is on <a collection listing url>.

**Steps:**

1. Dismiss the collection.

**Expected Results:**

* The collection is removed from the address.
* The listing opens the whole catalogue.

<!-- trace:case id=g10.store-product-listing.TC-9x6 rev=1 covers=g10.store-product-listing.SC-9nu,g10.store-product-listing.SC-2oj,g10.store-product-listing.SC-3ya,g10.store-product-listing.SC-eqs -->
### grade10-site-store-product-listing-US3-TC7-1: Search leaves the collection and searches the whole catalogue

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
* **Trace:** grade10-site-store-product-listing-US-03

**Pre-conditions:**

* customer is on <a collection listing url>.
* <A matching product> is outside <the collection>.

**Steps:**

1. Search for <a matching product>.
2. Commit the search.

**Expected Results:**

* The collection is no longer in the address.
* The listing finds <a matching product> across the catalogue.

<!-- trace:case id=g10.store-product-listing.TC-pj3 rev=1 covers=g10.store-product-listing.SC-9nu,g10.store-product-listing.SC-2oj,g10.store-product-listing.SC-3ya,g10.store-product-listing.SC-eqs -->
### grade10-site-store-product-listing-US3-TC8-1: Facet narrowing leaves the collection

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
* **Trace:** grade10-site-store-product-listing-US-03

**Pre-conditions:**

* customer is on <a collection listing url>.
* <A product outside the collection> matches <a facet value>.

**Steps:**

1. Apply <a facet value>.

**Expected Results:**

* The collection is no longer in the address.
* The listing shows products matching <a facet value> across the catalogue.

---

## grade10-site-store-product-listing-US4: Collector narrows the catalogue to what they collect

**As a** collector,
**I want** to narrow the listing by the world a card comes from and the kind of
collectible it is, and to see how many cards sit behind each choice before I
pick one,
**so that** I reach the cards I collect without reading past the ones I do not.

<!-- trace:case id=g10.store-product-listing.TC-ph8 rev=1 covers=g10.store-product-listing.SC-c0e,g10.store-product-listing.SC-69a,g10.store-product-listing.SC-q1g,g10.store-product-listing.SC-yl8,g10.store-product-listing.SC-tbd -->
### grade10-site-store-product-listing-US4-TC7-1: World choice narrows the catalogue

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-listing-US-04

**Pre-conditions:**

* The catalogue has products in <a world> and <another world>.

**Steps:**

1. Open the filter panel.
2. Read the world choices and their counts.
3. Choose <a world>.

**Expected Results:**

* The panel shows world choices with catalogue counts.
* The listing narrows to products from <a world>.

<!-- trace:case id=g10.store-product-listing.TC-bzp rev=1 covers=g10.store-product-listing.SC-c0e,g10.store-product-listing.SC-69a,g10.store-product-listing.SC-q1g,g10.store-product-listing.SC-yl8,g10.store-product-listing.SC-tbd -->
### grade10-site-store-product-listing-US4-TC8-1: Type choice narrows the catalogue

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
* **Trace:** grade10-site-store-product-listing-US-04

**Pre-conditions:**

* The catalogue has products in <a collectible type> and <another type>.

**Steps:**

1. Open the filter panel.
2. Read the type choices and their counts.
3. Choose <a collectible type>.

**Expected Results:**

* The panel shows type choices with catalogue counts.
* The listing narrows to products of <a collectible type>.

<!-- trace:case id=g10.store-product-listing.TC-i2r rev=1 covers=g10.store-product-listing.SC-c0e,g10.store-product-listing.SC-69a,g10.store-product-listing.SC-q1g,g10.store-product-listing.SC-yl8,g10.store-product-listing.SC-tbd -->
### grade10-site-store-product-listing-US4-TC9-1: Facet counts describe products behind each choice

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-listing-US-04

**Pre-conditions:**

* The catalogue count for <a world> is known.

**Steps:**

1. Open the filter panel.
2. Read the count beside <a world>.

**Expected Results:**

* The count names how many catalogue products match <a world>.

<!-- trace:case id=g10.store-product-listing.TC-6ko rev=1 covers=g10.store-product-listing.SC-c0e,g10.store-product-listing.SC-69a,g10.store-product-listing.SC-q1g,g10.store-product-listing.SC-yl8,g10.store-product-listing.SC-tbd -->
### grade10-site-store-product-listing-US4-TC4-1: Catalogue with no facets shows no facet panel

**Classification:**

* **Severity:** normal
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-listing-US-04

**Pre-conditions:**

* The catalogue has no configured facet groups.

**Steps:**

1. Navigate to <grade10 browse listing url>.
2. Inspect the listing controls.

**Expected Results:**

* No facet panel or empty-facet message appears.
* Search and sort remain available.

<!-- trace:case id=g10.store-product-listing.TC-hye rev=1 covers=g10.store-product-listing.SC-c0e,g10.store-product-listing.SC-69a,g10.store-product-listing.SC-q1g,g10.store-product-listing.SC-yl8,g10.store-product-listing.SC-tbd -->
### grade10-site-store-product-listing-US4-TC10-1: Zero-count facet stays available only when it exists in the catalogue

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-listing-US-04

**Pre-conditions:**

* <A facet value> matches products in the catalogue but none in the current narrowing.
* <Another facet value> matches no product in the whole catalogue.

**Steps:**

1. Narrow the listing until <a facet value> has no matching products.
2. Read the facet choices.

**Expected Results:**

* <A facet value> remains available with a zero count.
* <Another facet value> is not shown.

<!-- trace:case id=g10.store-product-listing.TC-iw8 rev=1 covers=g10.store-product-listing.SC-c0e,g10.store-product-listing.SC-69a,g10.store-product-listing.SC-q1g,g10.store-product-listing.SC-yl8,g10.store-product-listing.SC-tbd -->
### grade10-site-store-product-listing-US4-TC11-1: Back restores the previous facet narrowing

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
* **Trace:** grade10-site-store-product-listing-US-04

**Pre-conditions:**

* <A world> and <a collectible type> each match products in the catalogue.

**Steps:**

1. Choose <a world>.
2. Choose <a collectible type>.
3. Use browser Back once.

**Expected Results:**

* The listing returns to the prior world narrowing.
* The address names the restored narrowing.

---

## grade10-site-store-product-listing-US5: Collector orders and searches the whole shop

**As a** collector,
**I want** an order and a search that cover every card the shop lists rather
than the ones already on screen,
**so that** the cheapest card I could buy is the one I am shown first.

<!-- trace:case id=g10.store-product-listing.TC-gkw rev=1 covers=g10.store-product-listing.SC-l5j,g10.store-product-listing.SC-7b0 -->
### grade10-site-store-product-listing-US5-TC4-1: Search finds a card beyond the loaded products

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-listing-US-05

**Pre-conditions:**

* <A matching product> is in the catalogue beyond the products first shown.

**Steps:**

1. Search for <a matching product>.
2. Commit the search.

**Expected Results:**

* The listing finds <a matching product> across the catalogue.

<!-- trace:case id=g10.store-product-listing.TC-1wr rev=1 covers=g10.store-product-listing.SC-l5j,g10.store-product-listing.SC-7b0 -->
### grade10-site-store-product-listing-US5-TC5-1: Lowest-price order reaches beyond the loaded products

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
* **Trace:** grade10-site-store-product-listing-US-05

**Pre-conditions:**

* <The least expensive offered product> is not among the products first shown.
* <The least expensive offered product> and <a more expensive offered product> are both available.

**Steps:**

1. Choose lowest-price order.
2. Read the first product tile.

**Expected Results:**

* <The least expensive offered product> appears before <a more expensive offered product>.

<!-- trace:case id=g10.store-product-listing.TC-2um rev=1 covers=g10.store-product-listing.SC-l5j,g10.store-product-listing.SC-7b0 -->
### grade10-site-store-product-listing-US5-TC3-1: Sort menu offers the catalogue's available orders

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-product-listing-US-05

**Pre-conditions:**

* customer is on <grade10 browse listing url>.

**Steps:**

1. Open the sort menu.

**Expected Results:**

* The menu offers latest, lowest-price and highest-price orders.

---

## grade10-site-store-product-listing-US7: Collector reads past the first page of the listing

**As a** collector,
**I want** the listing to keep giving me cards as I reach the end of the ones
shown, without a page to pick,
**so that** I can look through the whole catalogue in one run and come back to
where a narrowing left off rather than to a page number.

<!-- trace:case id=g10.store-product-listing.TC-llq rev=1 covers=g10.store-product-listing.SC-qj6,g10.store-product-listing.SC-d8r,g10.store-product-listing.SC-8ue,g10.store-product-listing.SC-elc,g10.store-product-listing.SC-k0m -->
### grade10-site-store-product-listing-US7-TC1-1: More cards appear at the end of the list

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-listing-US-07

**Pre-conditions:**

* The catalogue has more products than fit in the first list.

**Steps:**

1. Navigate to <grade10 browse listing url>.
2. Scroll to the end of the visible products.

**Expected Results:**

* More product tiles appear below the visible products.
* No page number, next control or load-more button is offered.

<!-- trace:case id=g10.store-product-listing.TC-kv0 rev=1 covers=g10.store-product-listing.SC-qj6,g10.store-product-listing.SC-d8r,g10.store-product-listing.SC-8ue,g10.store-product-listing.SC-elc,g10.store-product-listing.SC-k0m -->
### grade10-site-store-product-listing-US7-TC2-1: End of catalogue passes without another page

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-listing-US-07

**Pre-conditions:**

* customer has reached the end of <the whole catalogue>.

**Steps:**

1. Scroll past the final product tile.

**Expected Results:**

* No further product tiles appear.
* The end passes without an error message or page control.

<!-- trace:case id=g10.store-product-listing.TC-tbp rev=1 covers=g10.store-product-listing.SC-qj6,g10.store-product-listing.SC-d8r,g10.store-product-listing.SC-8ue,g10.store-product-listing.SC-elc,g10.store-product-listing.SC-k0m -->
### grade10-site-store-product-listing-US7-TC3-1: New narrowing starts at its first products

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
* **Trace:** grade10-site-store-product-listing-US-07

**Pre-conditions:**

* customer has scrolled beyond the first products in the whole catalogue.
* <A narrowing> has matching products.

**Steps:**

1. Apply <a narrowing>.

**Expected Results:**

* The narrowed listing starts with its first products.

<!-- trace:case id=g10.store-product-listing.TC-re7 rev=1 covers=g10.store-product-listing.SC-qj6,g10.store-product-listing.SC-d8r,g10.store-product-listing.SC-8ue,g10.store-product-listing.SC-elc,g10.store-product-listing.SC-k0m -->
### grade10-site-store-product-listing-US7-TC4-1: Shared narrowing address opens at its first products

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
* **Trace:** grade10-site-store-product-listing-US-07

**Pre-conditions:**

* <A shared listing address> names <a narrowing>.

**Steps:**

1. Navigate to <a shared listing address>.

**Expected Results:**

* The listing opens at the first products matching <a narrowing>.

<!-- trace:case id=g10.store-product-listing.TC-2vd rev=1 covers=g10.store-product-listing.SC-qj6,g10.store-product-listing.SC-d8r,g10.store-product-listing.SC-8ue,g10.store-product-listing.SC-elc,g10.store-product-listing.SC-k0m -->
### grade10-site-store-product-listing-US7-TC5-1: Failed next page keeps cards already shown

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
* **Trace:** grade10-site-store-product-listing-US-07

**Pre-conditions:**

* The listing has shown <the first products>.
* The next catalogue read fails.

**Steps:**

1. Scroll to request more products.

**Expected Results:**

* <The first products> remain visible.

---

## grade10-site-store-product-listing-US8: Collector sees how large their narrowing is

**As a** collector,
**I want** to be told how many cards my narrowing found, not how many I have
scrolled past,
**so that** I can tell whether it is worth reading on before I have read to the
end.

<!-- trace:case id=g10.store-product-listing.TC-5io rev=1 covers=g10.store-product-listing.SC-rsf,g10.store-product-listing.SC-7i5,g10.store-product-listing.SC-wxo -->
### grade10-site-store-product-listing-US8-TC1-1: Result count stays ahead of scroll depth

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-listing-US-08

**Pre-conditions:**

* <A narrowing> finds more products than fit in the first list.

**Steps:**

1. Open the listing narrowed to <a narrowing>.
2. Read the result count.
3. Scroll until more products appear.

**Expected Results:**

* The count names all products found by <a narrowing>.
* The count stays the same while the collector scrolls.

<!-- trace:case id=g10.store-product-listing.TC-el1 rev=1 covers=g10.store-product-listing.SC-rsf,g10.store-product-listing.SC-7i5,g10.store-product-listing.SC-wxo -->
### grade10-site-store-product-listing-US8-TC2-1: Result count follows the narrowing

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-listing-US-08

**Pre-conditions:**

* <A narrowing> and <another narrowing> find different numbers of products.

**Steps:**

1. Open the listing narrowed to <a narrowing>.
2. Read the result count.
3. Change the narrowing to <another narrowing>.
4. Read the result count again.

**Expected Results:**

* The count changes to the number found by <another narrowing>.

<!-- trace:case id=g10.store-product-listing.TC-bx8 rev=1 covers=g10.store-product-listing.SC-rsf,g10.store-product-listing.SC-7i5,g10.store-product-listing.SC-wxo -->
### grade10-site-store-product-listing-US8-TC3-1: Facet count agrees with the listing it opens

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-listing-US-08

**Pre-conditions:**

* The facet count for <a world> is known for the current narrowing.

**Steps:**

1. Read the count beside <a world>.
2. Choose <a world>.
3. Read the listing's result count.

**Expected Results:**

* The facet count matches the listing opened by choosing <a world>.

---

## grade10-site-store-product-listing-US9: Collector opens the listing at rest

**As a** collector,
**I want** the catalogue already ordered by latest product when I arrive,
**so that** I see new stock first without picking a sort.

<!-- trace:case id=g10.store-product-listing.TC-vb6 rev=1 covers=g10.store-product-listing.SC-xvx,g10.store-product-listing.SC-5kb -->
### grade10-site-store-product-listing-US9-TC1-1: Listing at rest opens latest-first

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-listing-US-09

**Pre-conditions:**

* <A newest product> and <an older product> are in the catalogue.

**Steps:**

1. Navigate to <grade10 browse listing url> without a sort.
2. Read the first two product tiles and sort control.

**Expected Results:**

* <A newest product> appears before <an older product>.
* The sort control names the latest order.

---

## grade10-site-store-product-listing-US11: Collector orders the collection they arrived in

**As a** collector who followed a front-door tile into a collection,
**I want** to order that collection without leaving it,
**so that** I can read it newest or cheapest first and still be in the
collection I came for.

<!-- trace:case id=g10.store-product-listing.TC-y6t rev=1 covers=g10.store-product-listing.SC-pag,g10.store-product-listing.SC-x5i -->
### grade10-site-store-product-listing-US11-TC1-1: Collection opens on latest products

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-listing-US-11

**Pre-conditions:**

* <A collection> has products of different ages.

**Steps:**

1. Open <a collection> from a storefront tile.
2. Read its first product tile and address.

**Expected Results:**

* The collection is ordered by latest product.
* The address names <a collection>.

<!-- trace:case id=g10.store-product-listing.TC-cd4 rev=1 covers=g10.store-product-listing.SC-pag,g10.store-product-listing.SC-x5i -->
### grade10-site-store-product-listing-US11-TC2-1: Changing order keeps the collection

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
* **Trace:** grade10-site-store-product-listing-US-11

**Pre-conditions:**

* customer is on <a collection listing url> for <a collection>.

**Steps:**

1. Choose lowest-price order.
2. Read the listing address.

**Expected Results:**

* The address still names <a collection>.
* The collection remains open in the chosen order.

---

## grade10-site-store-product-listing-US12: Collector signs in to add from the listing

**As a** signed-out collector on the browse listing,
**I want** Add to cart to open sign-in instead of building a guest cart,
**so that** I only hold lines I can take to members-only checkout.

<!-- trace:case id=g10.store-product-listing.TC-43d rev=1 covers=g10.store-product-listing.SC-dhn,g10.store-product-listing.SC-xyt,g10.store-product-listing.SC-9gl -->
### grade10-site-store-product-listing-US12-TC1-1: Signed-out add opens sign-in

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-listing-US-12

**Pre-conditions:**

* customer is signed out on <grade10 browse listing url>.

**Steps:**

1. Activate Add to cart on <a product tile>.

**Expected Results:**

* The sign-in dialog opens.
* No guest cart line is created.

<!-- trace:case id=g10.store-product-listing.TC-1rh rev=1 covers=g10.store-product-listing.SC-dhn,g10.store-product-listing.SC-xyt,g10.store-product-listing.SC-9gl -->
### grade10-site-store-product-listing-US12-TC2-1: Dismissing sign-in adds no product

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
* **Trace:** grade10-site-store-product-listing-US-12

**Pre-conditions:**

* customer is signed out on <grade10 browse listing url> with the sign-in dialog open.

**Steps:**

1. Dismiss the sign-in dialog.
2. Open the cart.

**Expected Results:**

* No line for <a product tile> is held in the cart.

<!-- trace:case id=g10.store-product-listing.TC-d3y rev=1 covers=g10.store-product-listing.SC-dhn,g10.store-product-listing.SC-xyt,g10.store-product-listing.SC-9gl -->
### grade10-site-store-product-listing-US12-TC3-1: Sign-in completes the listing add

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
* **Trace:** grade10-site-store-product-listing-US-12

**Pre-conditions:**

* customer is signed out on <grade10 browse listing url> with the sign-in dialog open.

**Steps:**

1. Complete sign-in.
2. Open the cart.

**Expected Results:**

* <A product tile>'s item is added after sign-in.

---

## grade10-site-store-product-listing-US13: Collector sees why sign-in is asked when adding from the listing

**As a** signed-out collector on the browse listing,
**I want** the sign-in dialog to say I am signing in to add to cart,
**so that** I know why the shop stopped the add.

<!-- trace:case id=g10.store-product-listing.TC-v56 rev=1 covers=g10.store-product-listing.SC-gj6 -->
### grade10-site-store-product-listing-US13-TC1-1: Sign-in title names the add

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-product-listing-US-13

**Pre-conditions:**

* customer is signed out on <grade10 browse listing url> with the sign-in dialog open.

**Steps:**

1. Read the dialog title.

**Expected Results:**

* The title is Sign In to Add to Cart.

## Reconciliation

**Run:** Implementation update on 2026-09-25. Kept the existing case IDs,
draft statuses and review history. Confirmed the active listing cases cover
availability roll-up, no remaining-count or scarcity cue, and a requested
quantity above the browse count reaching cart review; the retired US-06
stock-limit journey remains retired in `user-journeys.md` and is not
reintroduced. The price-order question remains escalated for review.

**Run:** Blind feature-TCS pass on 2026-09-24. Read the caller-supplied exact Purpose and Feature set for grade10-site/store/product-listing; openspec/changes/add-store-product-status/proposal.md and decisions.md including Raised; ui-design.md state descriptions without following their scenario references; the product-listing, product-page and product-status change-local user-journeys.md files; docs/prds/products/grade10-site/store/index.md, store/product-page.md, store/product-listing.md, commerce/index.md and commerce/product-status.md; openspec/config.yaml context; the durable product-listing feature suite for case-ID continuity only; docs/governance/specs-to-test-cases.md; and the current-major approved suite corpus (14 actual cases from shared/auth/sign-out and grade10-site/auction/bid-increments). The no-stock-ceiling and tile availability checks sit under the active listing-address journey because the former US-06 is retired.

**Excluded:** Every spec.md file, all requirements and scenarios in openspec/specs/ and openspec/changes/add-store-product-status/specs/, and the archive tree. The Purpose and Feature set came from the caller; no spec file was opened. No scenario reference in ui-design was followed.

**Question for the author:** The US-05 journey says the first result is the cheapest card a collector could buy, while the Product Listing PRD says price ordering follows the product's lowest price whether sold out or not. Which answer should a price-order case verify when the lowest-priced product is out of stock?
