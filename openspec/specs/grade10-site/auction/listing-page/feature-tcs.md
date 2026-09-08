# grade10-site/auction/listing-page Test Cases

**Status:** approved
**Reviewed:** 2026-09-01

## grade10-site-auction-listing-page-US1: Collector opens a lot at its own address

**As a** collector,
**I want** a lot's address to answer with that lot's own page in the response
HTML,
**so that** I can read its name, its description and where its bidding stands
without waiting for a script to run.

### grade10-site-auction-listing-page-US1-TC1-1: Lot answers whole before scripts run

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-01

**Pre-conditions:**
The catalogue publishes <a published lot>. JavaScript disabled in the browser.

**Steps:**

1. Navigate to <a published lot url>.
2. Check the rendered page.
3. Check the page source.

**Expected Results:**

* Response status is 200 and the lot page renders.
* URL contains <lang>.
* Page source carries that lot's name, description, and bidding standing.

### grade10-site-auction-listing-page-US1-TC2-1: Two lots answer as two pages

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-01

**Pre-conditions:**
The catalogue publishes two lots.

**Steps:**

1. Navigate to <a published lot url> and note name, standing, title, meta description and `og:url`.
2. Navigate to <a second published lot url> and note the same.

**Expected Results:**

* Each response carries its own lot's name and standing.
* Each response carries its own title, meta description and `og:url`.

---

## grade10-site-auction-listing-page-US2: Collector shares a lot link

**As a** collector,
**I want** a lot link to unfurl as that lot and its own canonical address,
**so that** a link I pass on names the lot it points at instead of the auction
catalogue.

### grade10-site-auction-listing-page-US2-TC1-1: Shared lot link unfurls as that lot

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-02

**Pre-conditions:**
JavaScript disabled in the browser.

**Steps:**

1. Navigate to <a published lot url>.
2. Check the page source for `og:title`, `og:description` and `og:url`.

**Expected Results:**

* Page source carries `og:title`, `og:description` and `og:url` naming that lot and its own address.
* None of them names the auction catalogue in its place.

---

## grade10-site-auction-listing-page-US3: Collector opens an address that names no lot

**As a** collector,
**I want** an address under the auction's lots that names no published lot to
answer with the site's not-found surface,
**so that** I am never shown an empty lot page or the catalogue in its place.

### grade10-site-auction-listing-page-US3-TC1-1: Unknown lot address returns not-found

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-03

**Pre-conditions:**
The catalogue publishes no lot for <a lot address naming no published lot>.

**Steps:**

1. Navigate to <a lot address naming no published lot>.
2. Check the rendered page.
3. Check the response status.

**Expected Results:**

* Response status is 404.
* The site's not-found surface is on screen.

### grade10-site-auction-listing-page-US3-TC2-1: Published lot address returns the lot page

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-03

**Pre-conditions:**
The catalogue publishes <a published lot>.

**Steps:**

1. Navigate to <a published lot url>.
2. Check the response status and the rendered page.

**Expected Results:**

* Response status is 200.
* The page is that lot's page.

---

## grade10-site-auction-listing-page-US4: Collector reads a live lot while scripts load

**As a** collector,
**I want** the lot I was served to stay on screen once scripts finish loading,
**so that** nothing I was reading blanks into a placeholder and no value
disagrees with what the document carried.

### grade10-site-auction-listing-page-US4-TC1-1: Served lot stays on screen after scripts

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-04

**Pre-conditions:**
<a published lot> is on the catalogue.

**Steps:**

1. Navigate to <a published lot url>.
2. Note the served name, description and standing in the document.
3. Wait until scripts finish loading.
4. Check the same fields on screen.

**Expected Results:**

* The same lot is on screen with its served name, description and standing still present.
* None of them is replaced by a loading placeholder.

### grade10-site-auction-listing-page-US4-TC2-1: Clock value continues from the served document

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-04

**Pre-conditions:**
a bidding countdown is shown on <a published lot>.

**Steps:**

1. Navigate to <a published lot url>.
2. Note how long bidding has left in the document.
3. Wait until scripts finish loading.
4. Check how long bidding has left on screen.

**Expected Results:**

* What is on screen continues from what the document carried, rather than contradicting it.

---

## grade10-site-auction-listing-page-US5: Collector reaches a lot from the catalogue

**As a** collector,
**I want** to open a lot's own address from the catalogue without a page load,
**so that** the lot I picked out of the list is the page I land on.

### grade10-site-auction-listing-page-US5-TC1-1: Catalogue opens the lot's own address

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-05

**Pre-conditions:**
The collector is viewing the auction catalogue, which lists <a published lot>.

**Steps:**

1. Navigate to <grade10 auction url>.
2. Open <a published lot> the catalogue lists.

**Expected Results:**

* The browser is on that lot's address, showing that lot's page.

### grade10-site-auction-listing-page-US5-TC2-1: Sitemap names no lot address

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-05

**Pre-conditions:**
None.

**Steps:**

1. Fetch <grade10 sitemap url>.
2. Check every sitemap entry.

**Expected Results:**

* No entry is a lot address.
* None carries an unfilled parameter in place of one.
