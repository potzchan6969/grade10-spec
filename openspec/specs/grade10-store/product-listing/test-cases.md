# grade10-store/product-listing Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-01, tcs-rules r1

## product-listing-US1: Collector opens the listing at its own address

**As a** collector,
**I want** the browse listing to answer at an address of its own, with its own
title and metadata, before any script runs,
**so that** I can link to, share and bookmark the catalogue rather than click
into it.

### product-listing-US1-TC1-1: Listing answers at its own address before scripts run

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** product-listing-US-01

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

### product-listing-US1-TC2-1: Sitemap lists the listing in every language

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** product-listing-US-01

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

## product-listing-US2: Collector opens a collection from its address

**As a** collector,
**I want** an address that names a collection to open the listing already
narrowed to it,
**so that** a way into the catalogue can be linked, shared and bookmarked
rather than clicked into.

### product-listing-US2-TC1-1: Address naming a collection opens narrowed

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** product-listing-US-02

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

### product-listing-US2-TC2-1: Address naming no collection lists everything

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** product-listing-US-02

**Pre-conditions:**
Catalogue carries at least two collections.

**Steps:**

1. Navigate to <grade10 browse listing url>, which names no collection.
2. Check the cards listed.

**Expected Results:**

* Whole catalogue is listed.
* No collection narrowing in force.

### product-listing-US2-TC3-1: Address names a collection the catalogue lacks

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** product-listing-US-02

**Pre-conditions:**
Catalogue has nothing for <an unknown collection>.

**Steps:**

1. Navigate to <that collection's listing url>.
2. Check the cards listed and the page status.

**Expected Results:**

* Listing renders — not a 404, not a refusal.
* Whole catalogue is listed, not an empty listing.

---

## product-listing-US3: Collector keeps a narrowing in the address

**As a** collector,
**I want** a narrowing I make on the page to live in the address,
**so that** I can link to what I am looking at and return to the previous
narrowing.

### product-listing-US3-TC1-1: Narrowing made in the page is linkable

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** product-listing-US-03

**Pre-conditions:**
Catalogue carries at least two collections.

**Steps:**

1. Navigate to <grade10 browse listing url>, unscoped.
2. Narrow to <a collection> from within the page.
3. Check the address bar.
4. Open the address in a clean browser session.

**Expected Results:**

* Address now names the collection narrowed to.
* Step 4 shows the same narrowing and the same cards.

### product-listing-US3-TC2-1: Back undoes a narrowing

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** product-listing-US-03

**Pre-conditions:**
Catalogue carries at least two collections.

**Steps:**

1. Navigate to <grade10 browse listing url>, unscoped.
2. Narrow to <a collection> from within the page.
3. Click the browser's "Back" button.
4. Check the cards listed.

**Expected Results:**

* Listing is unscoped again.
* Whole catalogue is listed.
