# grade10-store/home Test Cases

**Status:** approved
**Reviewed:** 2026-09-01

## home-US1: Collector arrives at the store front door

**As a** collector,
**I want** the store address to answer with a marketing hero and two ways on
before any script runs,
**so that** I understand what the store sells and can move straight into
browsing or bidding.

### home-US1-TC1-1: Front door answers whole before scripts run

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** home-US-01

**Pre-conditions:**
JavaScript disabled in the browser.

**Steps:**

1. Navigate to <grade10 store url>.
2. Check the rendered page.
3. Check the page source.

**Expected Results:**

* Front door renders, hero visible.
* URL contains <lang>.
* Page source carries the hero's eyebrow, headline, copy and image.
* Page source carries both ways on — browse listing and auction.

### home-US1-TC2-1: Front door and browse listing are two surfaces

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** home-US-01

**Pre-conditions:**
None.

**Steps:**

1. Navigate to <grade10 store url> and note its title and meta description.
2. Navigate to <grade10 browse listing url> and note the same two.

**Expected Results:**

* Titles differ.
* Meta descriptions differ.

### home-US1-TC3-1: Shopping affordance opens the unscoped listing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** home-US-01

**Pre-conditions:**
Catalogue holds at least two collections.

**Steps:**

1. Navigate to <grade10 store url>.
2. Click the shop button in the hero.

**Expected Results:**

* The browser navigates to <grade10 browse listing url>.
* The listing URL names no collection.
* Cards from the whole catalogue are listed.

### home-US1-TC4-1: Auction button opens the auction surface

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** home-US-01

**Pre-conditions:**
None.

**Steps:**

1. Navigate to <grade10 store url>.
2. Click the auction button in the hero.

**Expected Results:**

* The browser navigates to <grade10 auction url>.

### home-US1-TC5-1: Hero works while the catalogue is still loading

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** performance
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** home-US-01

**Pre-conditions:**
<the catalogue endpoint> delayed 5 seconds by network manipulation.

**Steps:**

1. Navigate to <grade10 store url>.
2. Check the hero while the sections below are still loading.
3. Click the shop button or the auction button in the hero.

**Expected Results:**

* Hero and both buttons are on screen during the delay.
* Step 3 navigates to that button's destination without waiting for the
  delayed catalogue.

---

## home-US2: Collector enters the catalogue through a collection

**As a** collector,
**I want** every collection the shop lists as a tile on the front door,
**so that** I can open a scoped browse listing without the application
deciding which collections appear.

### home-US2-TC1-1: Every collection is a tile, in catalogue order

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** home-US-02

**Pre-conditions:**
Catalogue holds at least three collections, each with a name and artwork.

**Steps:**

1. Navigate to <grade10 store url>.
2. Scroll to the collections section.
3. Compare the tiles and their order against the catalogue.

**Expected Results:**

* Every collection is a tile — none filtered out.
* Each tile shows that collection's name and artwork.
* Tile order matches the catalogue.
* First collection fills the large cell.

### home-US2-TC2-1: Tile opens that collection's listing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** home-US-02

**Pre-conditions:**
Collector is on the front door, viewing the collection tiles.

**Steps:**

1. Click the tile for <a collection>.
2. Check the cards listed.

**Expected Results:**

* The browser navigates to <that collection's listing url>.
* The listing URL names that collection.
* Only that collection's cards are listed.

### home-US2-TC3-1: Collection added to the shop appears with no deploy

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** home-US-02

**Pre-conditions:**
Front door already seen without <a new collection>.

**Steps:**

1. Add <a new collection> to the shop.
2. Navigate to <grade10 store url> — no redeploy.
3. Scroll to the collections section.

**Expected Results:**

* The new collection is a tile.
* No application change was needed.

### home-US2-TC4-1: Collection with no artwork still gets a tile

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** actual
* **Behaviour:** negative
* **Type:** usability
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** home-US-02

**Pre-conditions:**
Catalogue holds <a collection with no artwork>.

**Steps:**

1. Navigate to <grade10 store url>.
2. Scroll to the collections section.
3. Check the tile for that collection.

**Expected Results:**

* Tile renders, named by its collection.
* No gap where the artwork goes, and no missing tile.

### home-US2-TC5-1: Catalogue has no collections

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** home-US-02

**Pre-conditions:**
Catalogue holds no collections.

**Steps:**

1. Navigate to <grade10 store url>.
2. Check where the collections section sits.
3. Check the rest of the page.

**Expected Results:**

* No grid and no heading.
* Rest of the page, hero included, renders.

---

## home-US3: Collector browses the merchandised collection

**As a** collector,
**I want** a row of cards from the first collection the catalogue lists,
**so that** I can open a card's page or the rest of that collection from the
front door.

### home-US3-TC1-1: Row shows the first collection's cards

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** home-US-03

**Pre-conditions:**
Catalogue lists <a collection with cards> first.

**Steps:**

1. Navigate to <grade10 store url>.
2. Scroll to the merchandised row.
3. Check its heading and cards.

**Expected Results:**

* Row is titled as the catalogue names that collection.
* Cards belong to that collection.
* Each card shows name, image and price.

### home-US3-TC2-1: Card opens its own page

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** home-US-03

**Pre-conditions:**
Collector is on the front door, viewing the merchandised row.

**Steps:**

1. Click <a card in the row>.

**Expected Results:**

* That card's page opens.

### home-US3-TC3-1: Row reaches the rest of its collection

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** home-US-03

**Pre-conditions:**
Collector is on the front door, viewing the merchandised row.

**Steps:**

1. Click the row's browse-all button.
2. Check the cards listed.

**Expected Results:**

* The browser navigates to <that collection's listing url>.
* The listing URL names that collection.
* Only that collection's cards are listed.

### home-US3-TC4-1: Row follows whichever collection is listed first

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** home-US-03

**Pre-conditions:**
Front door already seen merchandising the current first collection.

**Steps:**

1. Reorder the shop so <a second collection with cards> is listed first.
2. Navigate to <grade10 store url> — no redeploy.
3. Check the row's heading and cards.

**Expected Results:**

* Row is now the second collection's, titled as the catalogue names it.
* No application change was needed.

### home-US3-TC5-1: No collection holds any cards

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** home-US-03

**Pre-conditions:**
No collection in the catalogue holds cards.

**Steps:**

1. Navigate to <grade10 store url>.
2. Check where the merchandised row sits.
3. Check the rest of the page.

**Expected Results:**

* No row and no heading — no titled empty row.
* Rest of the page renders.

---

## home-US4: Collector keeps using the front door while the catalogue lags

**As a** collector,
**I want** the hero usable while catalogue sections load or fail, and a way
to retry a failed read without a full page load,
**so that** a slow or broken catalogue does not block the front door.

### home-US4-TC1-1: Sections show they are loading

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** home-US-04

**Pre-conditions:**
<the catalogue endpoint> delayed 5 seconds by network manipulation.

**Steps:**

1. Navigate to <grade10 store url>.
2. Check the collections section during the delay.
3. Check the merchandised row during the delay.

**Expected Results:**

* Both sections show they are loading.
* No empty grid and no empty row.

### home-US4-TC2-1: Failed read retries without a page load

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** home-US-04

**Pre-conditions:**
Collections read mocked to fail, so the section shows its failure; mock then removed.

**Steps:**

1. Check the failed section.
2. Click its offer to try again.
3. Watch the network traffic.

**Expected Results:**

* Section says the read failed and offers to try again.
* Step 2 re-reads and renders the collections.
* No full page load.

---

## home-US5: Collector moves around the store from the chrome

**As a** collector,
**I want** the site chrome to mark the store on every store surface and to
reach the front door or the unscoped listing,
**so that** I can navigate the store without guessing destinations.

### home-US5-TC1-1: Chrome marks the store on the browse listing

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** usability
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** home-US-05

**Pre-conditions:**
None.

**Steps:**

1. Navigate to <grade10 browse listing url>.
2. Check the site chrome.

**Expected Results:**

* Chrome marks the store, as it does on the front door.

### home-US5-TC2-1: Chrome reaches the front door and the full listing

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** home-US-05

**Pre-conditions:**
Catalogue holds at least two collections.

**Steps:**

1. Navigate to <a listing url that names a collection>.
2. Click the store item in the chrome.
3. Click the all-collections item in the chrome.

**Expected Results:**

* Step 2: the browser navigates to <grade10 store url>.
* Step 3: the browser navigates to <grade10 browse listing url>.
* After step 3, the listing URL names no collection.
