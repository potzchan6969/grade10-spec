# grade10-site/store/product-listing Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-08, tcs-rules r2

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
