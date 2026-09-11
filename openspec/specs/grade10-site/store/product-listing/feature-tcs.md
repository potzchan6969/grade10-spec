# grade10-site/store/product-listing Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-01, tcs-rules r1

## grade10-site-store-product-listing-US1: Collector opens the listing at its own address

**As a** collector,
**I want** the browse listing to answer at an address of its own, with its own
title and metadata, before any script runs,
**so that** I can link to, share and bookmark the catalogue rather than click
into it.

### grade10-site-store-product-listing-US1-TC1-1: Listing answers at its own address before scripts run

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-listing-US-01

**Pre-conditions:**
JavaScript disabled in the browser.

**Steps:**

1. Navigate to <grade10 browse listing url>.
2. Check the rendered page and the tab title.
3. Check the page source for meta description and share metadata.

**Expected Results:**

* Listing renders with its static copy.
* URL sits under <grade10 store url> and contains <lang>.
* Tab title and meta description are the listing's own, not the store's.
* Share metadata is present, so the link previews as the listing.

### grade10-site-store-product-listing-US1-TC2-1: Sitemap lists the listing in every language

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-product-listing-US-01

**Pre-conditions:**
None.

**Steps:**

1. Fetch <grade10 sitemap url>.
2. Find the entries for the browse listing.

**Expected Results:**

* Sitemap has one browse listing entry per <lang>.
* Each entry shows <grade10 store url> and its <lang>.
* The store's own address is still listed alongside.

---

## grade10-site-store-product-listing-US2: Collector opens a collection from its address

**As a** collector,
**I want** an address that names a collection to open the listing already
narrowed to it,
**so that** a way into the catalogue can be linked, shared and bookmarked
rather than clicked into.

### grade10-site-store-product-listing-US2-TC1-1: Address naming a collection opens narrowed

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-listing-US-02

**Pre-conditions:**
Catalogue carries <a collection>.

**Steps:**

1. Open a clean browser session.
2. Navigate to <that collection's listing url>.
3. Check the narrowing shown and the cards listed.

**Expected Results:**

* Listing opens already narrowed — no control touched.
* Narrowing in force is the collection the address names.
* Only that collection's cards are listed.

### grade10-site-store-product-listing-US2-TC2-1: Address naming no collection lists everything

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-product-listing-US-02

**Pre-conditions:**
Catalogue carries at least two collections.

**Steps:**

1. Navigate to <grade10 browse listing url>, which names no collection.
2. Check the cards listed.

**Expected Results:**

* Whole catalogue is listed.
* No collection narrowing in force.

### grade10-site-store-product-listing-US2-TC3-1: Address names a collection the catalogue lacks

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-listing-US-02

**Pre-conditions:**
Catalogue has nothing for <an unknown collection>.

**Steps:**

1. Navigate to <that collection's listing url>.
2. Check the cards listed and the page status.

**Expected Results:**

* Listing renders — not a 404, not a refusal.
* Whole catalogue is listed, not an empty listing.

---

## grade10-site-store-product-listing-US3: Collector leaves the collection they arrived in

**As a** collector who came in through a collection,
**I want** to see which collection I am inside and step out of it,
**so that** I can search the whole catalogue without going back to where I came
from.

### grade10-site-store-product-listing-US3-TC1-2: Narrowing made in the page is linkable

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-listing-US-03

**Pre-conditions:**

* Catalogue carries <a collection> and names <a facet group> with <a facet
  choice> counted outside that collection.
* Collector is on <that collection's listing url>, scoped to it.

**Steps:**

1. Select <that facet choice> in the filter panel.
2. Check the narrowings in force and the cards listed.
3. Check the address bar.
4. Open that address in a clean browser session.

**Expected Results:**

* Listing narrows the whole catalogue by the facet choice.
* Collection is no longer in force, and cards from outside it are listed.
* Address names the facet choice and no longer names the collection.
* Step 4 shows the same narrowing and the same cards.

### grade10-site-store-product-listing-US3-TC2-2: Back undoes a narrowing

**Classification:**

* **Severity:** major
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

* Catalogue carries <a collection> and names <a facet choice> counted outside
  it.
* Collector is on <that collection's listing url>, scoped to it.

**Steps:**

1. Select <that facet choice> in the filter panel.
2. Click the browser's "Back" button.
3. Check the narrowings in force and the cards listed.

**Expected Results:**

* Listing is scoped to the collection again.
* Only that collection's cards are listed.

### grade10-site-store-product-listing-US3-TC3-1: Collection in force can be dismissed

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

* Catalogue carries <a collection> and at least one card outside it.
* Collector is on <that collection's listing url>, scoped to it.

**Steps:**

1. Check the filter panel for any control offering a collection.
2. Dismiss the collection named among the narrowings in force.
3. Check the cards listed and the address bar.

**Expected Results:**

* Step 1 finds no collection control in the filter panel.
* Whole catalogue is listed, cards from outside the collection included.
* Address no longer names the collection.

### grade10-site-store-product-listing-US3-TC4-1: Address naming a collection and a facet together

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-listing-US-03

**Pre-conditions:**
Catalogue carries <a collection> and names <a facet choice> counted outside it.

**Steps:**

1. Navigate to an address naming both that collection and that facet choice.
2. Check the narrowings in force and the cards listed.

**Expected Results:**

* Listing is narrowed by the facet choice.
* Collection is not in force, and cards from outside it are listed.

---

## grade10-site-store-product-listing-US4: Collector narrows the catalogue to what they collect

**As a** collector,
**I want** to narrow the listing by the world a card comes from and the kind of
collectible it is, and to see how many cards sit behind each choice before I
pick one,
**so that** I reach the cards I collect without reading past the ones I do not.

### grade10-site-store-product-listing-US4-TC1-1: Filter panel is the catalogue's own facets

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-listing-US-04

**Pre-conditions:**
Catalogue names <the world facet group> and <the collectible type facet group>,
each carrying choices with cards counted behind them.

**Steps:**

1. Navigate to <grade10 browse listing url>, unscoped.
2. Check the groups the filter panel offers and their order.
3. Check the choices under each group and the number beside each.

**Expected Results:**

* Panel offers one group per facet the catalogue names, in the catalogue's
  order.
* Each choice carries the count the catalogue puts behind it.
* Group names are in <lang>; choice names are the shop's own words.

### grade10-site-store-product-listing-US4-TC2-1: Facet narrowing is linkable and reversible

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
* **Trace:** grade10-site-store-product-listing-US-04

**Pre-conditions:**
Catalogue names <a facet choice> with fewer cards behind it than the whole
catalogue holds.

**Steps:**

1. Navigate to <grade10 browse listing url>, unscoped.
2. Select <that facet choice> in the filter panel.
3. Check the address bar and the cards listed.
4. Open that address in a clean browser session.
5. Return to the first session and click the browser's "Back" button.

**Expected Results:**

* Cards listed are the catalogue narrowed to that choice, matching its count.
* Address names the choice.
* Step 4 shows the same narrowing and the same cards.
* Step 5 lists the whole catalogue again.

### grade10-site-store-product-listing-US4-TC3-1: Catalogue naming no facet group at all

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
* **Trace:** grade10-site-store-product-listing-US-04

**Pre-conditions:**
Shop is configured with no facet metadata, so the catalogue names no facet
group.

**Steps:**

1. Navigate to <grade10 browse listing url>, unscoped.
2. Check the sidebar for facet groups and for any message in place of them.
3. Check that the search field and the sort menu are still offered.
4. Check the cards listed.

**Expected Results:**

* No facet group is drawn, and nothing is said in place of the groups.
* Search field and sort menu are both still offered.
* Catalogue is listed as normal.

### grade10-site-store-product-listing-US4-TC4-1: Facet groups with nothing counted behind them

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
* **Trace:** grade10-site-store-product-listing-US-04

**Pre-conditions:**
Catalogue names its facet groups and their choices, and no card in the shop is
counted behind any of them.

**Steps:**

1. Navigate to <grade10 browse listing url>, unscoped.
2. Check the sidebar for facet groups and for any message in place of them.
3. Check that the search field and the sort menu are still offered.
4. Check the cards listed.

**Expected Results:**

* No facet group is drawn — no choice is offered that could only empty the
  grid.
* Search field and sort menu are both still offered.
* Catalogue is listed as normal.

### grade10-site-store-product-listing-US4-TC5-1: Worlds are capped and types are shown whole

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-listing-US-04

**Pre-conditions:**
Catalogue names more than five worlds and more than five collectible types.

**Steps:**

1. Navigate to <grade10 browse listing url>, unscoped.
2. Count the worlds offered and check for an invitation to show the rest.
3. Count the collectible types offered.
4. Take the invitation and count the worlds offered again.

**Expected Results:**

* Step 2 offers five worlds and an invitation naming the group.
* Step 3 offers every collectible type the catalogue names, with no invitation.
* Step 4 offers every world the catalogue names.

### grade10-site-store-product-listing-US4-TC6-1: Narrowing that leaves nothing behind any choice

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-listing-US-04

**Pre-conditions:**
Catalogue names both facet groups, and one choice the whole catalogue counts
nothing behind.

**Steps:**

1. Navigate to <grade10 browse listing url>, unscoped.
2. Select the choice nothing is counted behind.
3. Check both groups, their counts, and the state of the choice just selected.
4. Unselect it.

**Expected Results:**

* Step 3 still offers both groups, counts included, though the grid is empty.
* Choice selected in step 2 is shown selected and is still selectable.
* Step 4 widens the listing again.

---

## grade10-site-store-product-listing-US5: Collector orders and searches the whole shop

**As a** collector,
**I want** an order and a search that cover every card the shop lists rather
than the ones already on screen,
**so that** the cheapest card I could buy is the one I am shown first.

### grade10-site-store-product-listing-US5-TC1-1: Lowest-price order reaches past the loaded page

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-listing-US-05

**Pre-conditions:**
Catalogue holds more cards than one page lists, and <the cheapest card> is not
among those listed when the page first loads.

**Steps:**

1. Navigate to <grade10 browse listing url>, unscoped.
2. Confirm <the cheapest card> is not among the cards listed.
3. Order the listing by lowest price.
4. Check the first card listed.

**Expected Results:**

* Step 4 lists <the cheapest card> first.
* Order is applied without the collector loading more cards.

### grade10-site-store-product-listing-US5-TC2-1: Search finds a card the page had not loaded

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
* **Trace:** grade10-site-store-product-listing-US-05

**Pre-conditions:**
Catalogue holds more cards than one page lists, and <a searched-for card> — the
only card matching <its words> — is not among those listed when the page first
loads.

**Steps:**

1. Navigate to <grade10 browse listing url>, unscoped.
2. Confirm <that card> is not among the cards listed.
3. Enter <its words> in the search field.
4. Check the cards listed and the address bar.
5. Open that address in a clean browser session.

**Expected Results:**

* Step 4 lists <that card>.
* Address carries the words searched for.
* Step 5 lists the same card for the same words.

### grade10-site-store-product-listing-US5-TC3-1: Sort menu offers only orders the catalogue answers

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
* **Trace:** grade10-site-store-product-listing-US-05

**Pre-conditions:**
Catalogue holds cards and the collector has chosen no order.

**Steps:**

1. Navigate to <grade10 browse listing url>, unscoped.
2. Check which order the listing shows as in force.
3. Open the sort menu and read every option it offers.

**Expected Results:**

* No order is in force before the collector chooses one.
* Every option offered is an order the catalogue can answer.
* No popularity option is offered.

## grade10-site-store-product-listing-US6: Collector takes the last of a card from the listing

**As a** collector,
**I want** a card's quantity to stop where the shop runs out, and to be told
how many are left when it does,
**so that** I buy the number the shop will actually send me rather than
finding out at the order.

### grade10-site-store-product-listing-US6-TC1-1: Card's quantity stops at the shop's count

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-listing-US-06

**Pre-conditions:**

* The shop has `<low count>` of `<card_1>` and exposes that count.
* `<card_1>` is listed at <grade10 browse listing url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_1>` | A card the shop has few of and exposes a count for |
| `<low count>` | `3` |

**Steps:**

1. Navigate to <grade10 browse listing url>.
2. Raise `<card_1>`'s quantity past `<low count>`.
3. Open the cart drawer.

**Expected Results:**

* `<card_1>`'s quantity stays at `<low count>`.
* The cart holds `<low count>` of `<card_1>`.

### grade10-site-store-product-listing-US6-TC2-1: Card the shop counts nothing for is not capped

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
* **Trace:** grade10-site-store-product-listing-US-06

**Pre-conditions:**

* The shop exposes no count for `<card_3>`.
* `<card_3>` is listed at <grade10 browse listing url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_3>` | A card whose buyable variant the shop exposes no count for |
| `<asked quantity>` | `4` |

**Steps:**

1. Navigate to <grade10 browse listing url>.
2. Raise `<card_3>`'s quantity to `<asked quantity>`.
3. Open the cart drawer.

**Expected Results:**

* `<card_3>`'s quantity rises to `<asked quantity>`.
* The cart holds `<asked quantity>` of `<card_3>`.

### grade10-site-store-product-listing-US6-TC3-1: Nearly out is said, well stocked says nothing

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
* **Trace:** grade10-site-store-product-listing-US-06

**Pre-conditions:**

* The shop has `<low count>` of `<card_1>` and `<full count>` of `<card_2>`, and exposes both counts.
* Both cards are listed at <grade10 browse listing url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_1>` | A card the shop has few of and exposes a count for |
| `<card_2>` | A card the shop has many of and exposes a count for |
| `<low count>` | `3` |
| `<full count>` | `41` |

**Steps:**

1. Navigate to <grade10 browse listing url>.
2. Read `<card_1>` and `<card_2>`.

**Expected Results:**

* `<card_1>` says `<low count>` are left.
* `<card_2>` says nothing about what is left.

### grade10-site-store-product-listing-US6-TC4-1: Asking for every one there is answered on the card

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-listing-US-06

**Pre-conditions:**

* The shop has `<full count>` of `<card_2>` and exposes that count.
* `<card_2>` is listed at <grade10 browse listing url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_2>` | A card the shop has many of and exposes a count for |
| `<full count>` | `41` |

**Steps:**

1. Navigate to <grade10 browse listing url>.
2. Raise `<card_2>`'s quantity to `<full count>`.
3. Raise `<card_2>`'s quantity once more.

**Expected Results:**

* `<card_2>` says `<full count>` are left.
* The quantity does not rise past `<full count>`.
