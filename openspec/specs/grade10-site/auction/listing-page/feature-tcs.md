# grade10-site/auction/listing-page Test Cases

**Status:** reopened
**Drafts styled:** 2026-10-05, tcs-rules r4
**Reviewed:** 2026-09-01, lapsed 2026-09-29

## grade10-site-auction-listing-page-US1: Collector opens a lot at its own address

**As a** collector,
**I want** a lot's address to answer with that lot's own page in the response
HTML,
**so that** I can read its name, its description and where its bidding stands
without waiting for a script to run.

<!-- trace:case id=g10.auction-listing-page.TC-zeh rev=1 covers=g10.auction-listing-page.SC-vnl,g10.auction-listing-page.SC-4q9 -->
### grade10-site-auction-listing-page-US1-TC1-1: Lot answers whole before scripts run

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
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

<!-- trace:case id=g10.auction-listing-page.TC-82e rev=1 covers=g10.auction-listing-page.SC-vnl,g10.auction-listing-page.SC-4q9 -->
### grade10-site-auction-listing-page-US1-TC2-1: Two lots answer as two pages

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
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

<!-- trace:case id=g10.auction-listing-page.TC-89i rev=1 covers=g10.auction-listing-page.SC-mda -->
### grade10-site-auction-listing-page-US2-TC1-1: Shared lot link unfurls as that lot

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
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

<!-- trace:case id=g10.auction-listing-page.TC-3xv rev=1 covers=g10.auction-listing-page.SC-s88,g10.auction-listing-page.SC-jj1,g10.auction-listing-page.SC-c13 -->
### grade10-site-auction-listing-page-US3-TC1-1: Unknown lot address returns not-found

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
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

<!-- trace:case id=g10.auction-listing-page.TC-6r8 rev=1 covers=g10.auction-listing-page.SC-s88,g10.auction-listing-page.SC-jj1,g10.auction-listing-page.SC-c13 -->
### grade10-site-auction-listing-page-US3-TC2-1: Published lot address returns the lot page

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
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

### grade10-site-auction-listing-page-US3-TC3-1: Hidden lot's address shows Page not found

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-03

**Pre-conditions:**

* The catalogue published <called-off lot>, then an operator called it off.

**Test data:**

| Field | Value |
| --- | --- |
| <called-off lot> | A lot that was published and then called off |

**Steps:**

1. Navigate to <called-off lot url>.
2. Check the response status.
3. Check the rendered page.

**Expected Results:**

* Step 2: response status is 404.
* Step 3: the site's Page not found screen is on screen, not the lot and not the catalogue.

---

## grade10-site-auction-listing-page-US4: Collector reads a live lot while scripts load

**As a** collector,
**I want** the lot I was served to stay on screen once scripts finish loading,
**so that** nothing I was reading blanks into a placeholder and no value
disagrees with what the document carried.

<!-- trace:case id=g10.auction-listing-page.TC-wka rev=1 covers=g10.auction-listing-page.SC-c09,g10.auction-listing-page.SC-y8j -->
### grade10-site-auction-listing-page-US4-TC1-1: Served lot stays on screen after scripts

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
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

<!-- trace:case id=g10.auction-listing-page.TC-e6y rev=1 covers=g10.auction-listing-page.SC-c09,g10.auction-listing-page.SC-y8j -->
### grade10-site-auction-listing-page-US4-TC2-1: Clock value continues from the served document

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
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

<!-- trace:case id=g10.auction-listing-page.TC-fe3 rev=1 covers=g10.auction-listing-page.SC-fl9,g10.auction-listing-page.SC-aga -->
### grade10-site-auction-listing-page-US5-TC1-1: Catalogue opens the lot's own address

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-05

**Pre-conditions:**
The collector is viewing the auction catalogue, which lists <a published lot>.

**Steps:**

1. Navigate to <grade10 auction url>.
2. Open <a published lot> the catalogue lists.

**Expected Results:**

* The browser is on that lot's address, showing that lot's page.

<!-- trace:case id=g10.auction-listing-page.TC-edm rev=1 covers=g10.auction-listing-page.SC-fl9,g10.auction-listing-page.SC-aga -->
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

---

## grade10-site-auction-listing-page-US6: Watch an auction and open My Auctions from the toast

**As a** collector on a lot I have not bid on,
**I want** Watching to tell me email alerts are on and offer My Auctions,
**so that** I know how to manage that lot without hunting for the account page.

### grade10-site-auction-listing-page-US6-TC1-1: Watch announces alerts on and opens My Auctions

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-06

**Pre-conditions:**

* customer(signed in, no bid on <lot_1>, not watching <lot_1>) is on <lot_1 url>.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_1> | An open lot taking bids, not watched and not bid on by this collector |

**Steps:**

1. Note the current bid, time left and bid panel.
2. Click the Watch control.
3. Click View My Auctions in the toast.

**Expected Results:**

* Step 2: the control reads Watching.
* Step 2: a toast says email alerts are on, with View My Auctions.
* Step 2: current bid, time left and bid panel are unchanged.
* Step 3: My Auctions opens and lists <lot_1> once, Your Standing `--`.
* Step 3: <lot_1>'s email alerts switch is on.

### grade10-site-auction-listing-page-US6-TC2-1: Signed-out viewer is offered sign-in, no watch

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
* **Trace:** grade10-site-auction-listing-page-US-06

**Pre-conditions:**

* customer(signed out) is on <lot_1 url>.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_1> | An open lot taking bids |

**Steps:**

1. Click the Watch control.
2. Sign in using the offered sign-in flow.

**Expected Results:**

* Step 1: sign-in is offered; no toast says email alerts are on.
* Step 2: the collector returns to <lot_1 url>.
* Step 2: the control reads Watch; nothing was watched before sign-in.

---

## grade10-site-auction-listing-page-US7: Unwatch from the auction and undo

**As a** collector who watched a lot without bidding,
**I want** Unwatch to confirm alerts are off and let me Undo,
**so that** a mis-tap does not force me to find the lot again.

### grade10-site-auction-listing-page-US7-TC1-1: Unwatch removes the lot and turns alerts off

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-07

**Pre-conditions:**

* customer(signed in, watching <lot_2>, no bid on <lot_2>) is on <lot_2 url>.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_2> | An open lot taking bids, watched with email alerts on, not bid on by this collector |

**Steps:**

1. Click the Watching control.
2. Open <grade10 my auctions url> in a new tab.

**Expected Results:**

* Step 1: the control reads Watch.
* Step 1: a toast says the lot left My Auctions, with Undo.
* Step 1: current bid, time left and bid panel are unchanged.
* Step 2: <lot_2> is not listed.

### grade10-site-auction-listing-page-US7-TC2-1: Undo restores the watch with alerts on

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-07

**Pre-conditions:**

* customer(signed in, watching <lot_2>, no bid on <lot_2>) is on <lot_2 url>.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_2> | An open lot taking bids, watched with email alerts on, not bid on by this collector |

**Steps:**

1. Click the Watching control.
2. Click Undo in the toast.
3. Open <grade10 my auctions url> in a new tab.

**Expected Results:**

* Step 2: the control reads Watching again.
* Step 3: <lot_2> is listed once, Your Standing `--`.
* Step 3: <lot_2>'s email alerts switch is on.

---

## grade10-site-auction-listing-page-US8: After bidding, Watching stays locked

**As a** bidder on this lot,
**I want** the watch control locked as Watching and one alerts toast when the bid bookmarks the lot,
**so that** I am not invited to unwatch money I already put down, and I am not toasted on every revisit.

### grade10-site-auction-listing-page-US8-TC1-1: First bid locks Watching and toasts alerts once

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-08

**Pre-conditions:**

* customer(signed in, enrolled to bid, not watching <lot_3>, no bid on <lot_3>) is on <lot_3 url>.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_3> | An open lot taking bids, with no bid from this collector |
| <first bid> | The next valid bid shown on the bid panel |

**Steps:**

1. Place <first bid> from the bid panel.
2. Click the Watching control.
3. Reload <lot_3 url>.

**Expected Results:**

* Step 1: a toast says email alerts are on.
* Step 1: the control reads Watching, disabled.
* Step 2: nothing changes; no Unwatch toast.
* Step 3: the control still reads Watching, disabled; no alerts toast.

### grade10-site-auction-listing-page-US8-TC2-1: A second bid on the lot shows no alerts toast

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-08

**Pre-conditions:**

* customer A(signed in, has bid on <lot_4>, outbid) is on <lot_4 url>.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_4> | An open lot taking bids, where customer A bid before and customer B now leads |
| <raise> | The next valid bid shown on the bid panel |

**Steps:**

1. Place <raise> from the bid panel.

**Expected Results:**

* No toast says email alerts are on.
* The control reads Watching, disabled.

---

## grade10-site-auction-listing-page-US9: Closed lot has no watch control

**As a** collector on a closed lot (sold or unsold),
**I want** no Watch / Watching control,
**so that** I am not invited to watch a sale that has already ended.

### grade10-site-auction-listing-page-US9-TC1-1: A closed lot shows no watch control

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-09

**Pre-conditions:**

* <closed lot> is closed as the row states.

**Test data:**

| Closed lot | Viewer |
| --- | --- |
| Sold, with a winner | customer(signed in, never watched or bid on it) |
| Sold, with a winner | customer(signed in, watched it before the close, no bid) |
| Sold, with a winner | customer(signed in, bid on it and lost) |
| Sold, with a winner | customer(signed out) |
| Ended with no bids | customer(signed in, watched it before the close) |
| Ended with no bids | customer(signed out) |

**Steps:**

1. Navigate to <closed lot url>.
2. Check the lot image area and the bid panel area.

**Expected Results:**

* Step 1: the lot page renders.
* Step 2: no Watch or Watching control shows anywhere on the lot page.

---

## grade10-site-auction-listing-page-US10: Collector quotes a published lot

**As a** collector browsing a listing,
**I want** to reference and share a lot by its title and URL,
**so that** I can discuss it with others and return to it easily.

### grade10-site-auction-listing-page-US10-TC1-1: Listing code absent from the response before scripts run

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-10

**Pre-conditions:**

* A published lot exists at its own address.
* The lot's listing code is known from the admin listing screen.

**Steps:**

1. Open `<a published lot's address>`.
2. View the page's response source before any script runs.
3. Identify each occurrence of the lot's listing code and inspect its context.

**Expected Results:**

* The source names the lot by its title.
* The only code occurrence is the lower-case suffix of the canonical address; no labelled listing-code or payment-reference field is present.

### grade10-site-auction-listing-page-US10-TC2-1: Listing code absent from the page once scripts finish running

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-10

**Pre-conditions:**

* A published lot exists at its own address.
* The lot's listing code is known from the admin listing screen.

**Steps:**

1. Open `<a published lot's address>` and let the page finish loading its scripts.
2. View the rendered page and its current source.
3. Identify each occurrence of the lot's listing code in both.

**Expected Results:**

* The rendered page has no labelled listing-code or payment-reference field.
* Every code occurrence in the source is the lower-case suffix of the canonical address.

### grade10-site-auction-listing-page-US10-TC3-1: Listing code absent from the shared-link preview

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-10

**Pre-conditions:**

* A published lot exists at its own address.
* The lot's listing code is known from the admin listing screen.

**Steps:**

1. Fetch the share-preview metadata for `<a published lot's address>`.
2. Search the preview's title, description and url for the lot's listing code.

**Expected Results:**

* The preview's title and description have no labelled listing-code or payment-reference field.
* Its URL is the canonical address ending in the lower-case listing-code suffix.

Previously cached preview content may persist; the test does not require a
purge or regeneration. A fresh preview fetch must satisfy the absence above.

### grade10-site-auction-listing-page-US10-TC4-1: Listing code absent from the page title and meta description

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-10

**Pre-conditions:**

* A published lot exists at its own address.
* The lot's listing code is known from the admin listing screen.

**Steps:**

1. Open `<a published lot's address>`.
2. Read the browser tab title and the page's meta description.

**Expected Results:**

* Neither the tab title nor the meta description contains the listing code.

### grade10-site-auction-listing-page-US10-TC5-1: Listing code absent from the page's embedded data

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-10

**Pre-conditions:**

* A published lot exists at its own address.
* The lot's listing code is known from the admin listing screen.

**Steps:**

1. Open `<a published lot's address>`.
2. View the page's response source.
3. Search any data embedded in the document, outside the visible text, for the lot's listing code.

**Expected Results:**

* No field in the embedded data carries the listing code.

### grade10-site-auction-listing-page-US10-TC6-1: Listing code absent from the page's own network responses

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-10

**Pre-conditions:**

* A published lot exists at its own address.
* The lot's listing code is known from the admin listing screen.

**Steps:**

1. Open `<a published lot's address>` and let the page finish loading.
2. Inspect the responses the page's own client-side requests receive.
3. Search those responses for the lot's listing code.

**Expected Results:**

* No page response contains a separate listing-code or payment-reference field.

### grade10-site-auction-listing-page-US10-TC7-1: Listing code does not resolve as a lot address

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-10

**Pre-conditions:**

* A published lot exists and its listing code is known from the admin listing screen.

**Steps:**

1. Open the auction's lot-address path, substituting the lot's listing code for its usual identifier.

**Expected Results:**

* The address does not resolve to that lot's page.
* The site's not-found surface is shown, the same as for any address naming no published lot.

### grade10-site-auction-listing-page-US10-TC8-1: Listing code stays absent regardless of the collector's signed-in state

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-10

**Pre-conditions:**

* A published lot exists at its own address.
* The lot's listing code is known from the admin listing screen.

**Steps:**

1. Open `<a published lot's address>` as a signed-out visitor and search the page and its source for the lot's listing code.
2. Open the same address signed in as a registered collector and repeat the search.

**Expected Results:**

* Neither view has a labelled listing-code or payment-reference field; the canonical address may end in the lower-case code suffix.
* The title and address shown are identical in both views.

### grade10-site-auction-listing-page-US10-TC9-1: Listing code stays absent once an order exists on the lot

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-10

**Pre-conditions:**

* A lot's auction has closed with a winning bid, so an order now exists on that lot.

**Steps:**

1. Open the lot's own address on the public listing page.
2. View the page, its source, and its share-preview metadata.
3. Inspect every occurrence of the lower-case listing-code suffix, which is now also the order's payment reference.

**Expected Results:**

* The page and preview contain no labelled listing-code or payment-reference field.
* The code appears only as the lower-case suffix of the canonical address.

### grade10-site-auction-listing-page-US10-TC10-1: An address naming no lot carries no listing code

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-10

**Pre-conditions:**

* The catalogue publishes no lot for `<a lot address naming no published lot>`.

**Steps:**

1. Fetch `<a lot address naming no published lot>`.
2. Search the response, including any error detail, for a listing code.

**Expected Results:**

* Response status is 404.
* No listing code appears anywhere in the response.

### grade10-site-auction-listing-page-US10-TC11-1: A listing removed from browse and search remains available at its original URL

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
* **Trace:** grade10-site-auction-listing-page-US-10

**Pre-conditions:**

* A previously published listing has canonical address `<listing_url>` and code `<listing_code>`.
* The listing has been removed from browse and search without being explicitly deleted.

**Steps:**

1. Browse the auction catalogue and search for the listing.
2. Open `<listing_url>` directly.
3. Inspect the rendered page, response source and fresh share-preview metadata.

**Expected Results:**

* Browse and search do not return the listing.
* `<listing_url>` still returns its public listing page.
* The page and fresh preview identify the listing by its public title and canonical URL.
* Outside the lower-case suffix of `<listing_url>`, `<listing_code>` is absent from the page, embedded data, network responses and fresh preview metadata.
* Removal from browse and search does not release or replace `<listing_url>` or `<listing_code>`.

### grade10-site-auction-listing-page-US10-TC12-1: A cached preview may persist after browse/search removal without private data

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
* **Trace:** grade10-site-auction-listing-page-US-10

**Pre-conditions:**

* A preview for `<listing_url>` was cached while the listing was publicly available.
* The listing is subsequently removed from browse and search, without explicit deletion.
* An authorized admin or the winner knows `<listing_code>`.

**Steps:**

1. Request the existing cached preview for `<listing_url>`.
2. Inspect its title, description, URL, image and embedded metadata.

**Expected Results:**

* The cached preview may continue to show previously cached public listing metadata and `<listing_url>`.
* It contains no separate listing code or payment reference, internal/provider reference, winner data or admin-only data.
* A persistent preview does not make the listing discoverable through browse or search.

---

## grade10-site-auction-listing-page-US11: Collector contacts support about a lot

**As a** collector contacting support about a lot,
**I want** support to quickly identify which lot I'm referring to,
**so that** my inquiry is resolved faster without having to copy listing URLs or titles.

### grade10-site-auction-listing-page-US11-TC1-1: No listing code available on the page for the collector to send

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-11

**Pre-conditions:**

* A published lot exists at its own address.
* The lot's listing code is known from the admin listing screen.

**Steps:**

1. Open `<a published lot's address>`.
2. Inspect the visible page and its source for a labelled listing-code or payment-reference field.

**Expected Results:**

* The page has no labelled listing-code or payment-reference field for the collector to copy; its canonical address may end in the lower-case code suffix.

### grade10-site-auction-listing-page-US11-TC2-1: A listing code known from elsewhere gives no working link

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-11

**Pre-conditions:**

* A published lot exists and its listing code is known from a leak or from another surface.

**Steps:**

1. Attempt to open the lot's address by substituting its listing code for the lot's usual identifier.

**Expected Results:**

* The listing code does not resolve to the lot.
* No working link to the lot can be built from the code alone.

### grade10-site-auction-listing-page-US11-TC3-1: Title and address stay the collector's only reference once an order exists

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-11

**Pre-conditions:**

* A lot's auction has closed with a winning bid, so an order now exists on that lot.

**Steps:**

1. Open the lot's own address on the public listing page.
2. Note its title and address, and search the page for the lot's listing code.

**Expected Results:**

* The title and canonical address are unchanged by the order.
* The page has no labelled listing-code or payment-reference field; the code appears only as the lower-case canonical-address suffix.

### grade10-site-auction-listing-page-US11-TC4-1: Called-off listing remains directly accessible

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
* **Trace:** grade10-site-auction-listing-page-US-11

**Pre-conditions:**

* A listing has an allocated canonical address and listing code.

**Steps:**

1. Call the listing off before close.
2. Open its canonical address directly.
3. Search browse and search results for the listing.
4. Try the listing code as the address.

**Expected Results:**

* The canonical address still resolves to the called-off listing.
* The listing is absent from browse and search.
* The listing code does not resolve as a public route.

---

## grade10-site-auction-listing-page-US12: Collector sees another bid on the lot without reloading

**As a** collector,
**I want** a bid placed on another page to show on mine with the new price and close, without a reload,
**so that** I bid against the price that stands.

### grade10-site-auction-listing-page-US12-TC1-1: Another session's bid shows its price and bid count without a reload

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
* **Trace:** grade10-site-auction-listing-page-US-12

**Pre-conditions:**

* `<listing_1>` is open, before its scheduled close, with Highest bid `<current bid>` and bid count `<bid count>`.
* customer A is on the lot page for `<listing_1>`.
* customer B(card linked) is signed in on a separate session, on the same lot page.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | An open HKD listing with bids, scheduled close more than an hour away |
| `<current bid>` | 480000 minor units |
| `<bid count>` | 3 |
| `<bid amount>` | 505000 minor units, at or above the minimum next bid |

**Steps:**

1. As customer B, enter `<bid amount>` in the custom maximum on the bid panel and confirm the bid.
2. As customer A, without reloading, read Highest bid, the bid count and Time left.

**Expected Results:**

* Highest bid reads `<bid amount>` on customer A's page.
* The bid count reads `<bid count>` plus 1.
* Time left still counts to the scheduled close.
* customer A's page did not reload.

### grade10-site-auction-listing-page-US12-TC2-1: Scheduled close with a bid turns to Extended bidding without a reload

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
* **Trace:** grade10-site-auction-listing-page-US-12

**Pre-conditions:**

* `<listing_2>` is open with one accepted bid, its scheduled close under a minute away.
* customer A is on the lot page for `<listing_2>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_2>` | An open HKD listing with one accepted bid, extension duration `<extension duration>`, no cap |
| `<extension duration>` | 1800s (30mins) |

**Steps:**

1. Watch Time left through the scheduled close, without reloading.
2. Read Time left and its label.

**Expected Results:**

* Time left never reads Closed at the scheduled close.
* Time left is labelled Extended bidding and counts to the scheduled close plus `<extension duration>`.
* The page did not reload.

### grade10-site-auction-listing-page-US12-TC3-1: A page with no live line still catches up without a reload

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
* **Trace:** grade10-site-auction-listing-page-US-12

**Pre-conditions:**

* `<listing_1>` is open, before its scheduled close, with Highest bid `<current bid>`.
* customer A is on the lot page for `<listing_1>`, with the browser's live connection to the auction blocked.
* customer B(card linked) is signed in on a separate session, on the same lot page.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | An open HKD listing with bids, scheduled close more than an hour away |
| `<current bid>` | 480000 minor units |
| `<bid amount>` | 505000 minor units, at or above the minimum next bid |

**Steps:**

1. As customer B, enter `<bid amount>` in the custom maximum on the bid panel and confirm the bid.
2. As customer A, wait on the page without reloading.
3. Read Highest bid and the bid count.

**Expected Results:**

* Highest bid reads `<bid amount>` and the bid count includes customer B's bid.
* customer A's page did not reload.

### grade10-site-auction-listing-page-US12-TC4-1: A page that lost its line catches up when it returns

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
* **Trace:** grade10-site-auction-listing-page-US-12

**Pre-conditions:**

* `<listing_1>` is open, before its scheduled close, with Highest bid `<current bid>`.
* customer A is on the lot page for `<listing_1>`.
* customer B(card linked) is signed in on a separate session, on the same lot page.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | An open HKD listing with bids, scheduled close more than an hour away |
| `<current bid>` | 480000 minor units |
| `<bid amount>` | 505000 minor units, at or above the minimum next bid |

**Steps:**

1. Take customer A's browser offline.
2. As customer B, enter `<bid amount>` in the custom maximum on the bid panel and confirm the bid.
3. Bring customer A's browser back online, without reloading.
4. As customer A, read Highest bid and the bid count.

**Expected Results:**

* Highest bid reads `<bid amount>` and the bid count includes customer B's bid.
* customer A's page did not reload.

### grade10-site-auction-listing-page-US12-TC5-1: Leader's own standing turns to Outbid without a reload

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
* **Trace:** grade10-site-auction-listing-page-US-12

**Pre-conditions:**

* customer A(signed in) leads `<listing_8>` at `<current bid>` with maximum `<user A maximum>`, and is on its lot page.
* customer B(card linked) is signed in on a separate session, on the same lot page.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_8>` | An open HKD listing, scheduled close more than an hour away |
| `<current bid>` | 480000 minor units |
| `<user A maximum>` | 500000 minor units |
| `<user B maximum>` | 600000 minor units, above `<user A maximum>` |
| `<increment>` | 8000 minor units (HKD 80.00), the HK$4,000 tier |

**Steps:**

1. As customer A, read the standing on the bid panel.
2. As customer B, enter `<user B maximum>` in the custom maximum on the bid panel and confirm the bid.
3. As customer A, without reloading, read the standing, Highest bid and the next valid bid.

**Expected Results:**

* Step 1 reads Leading, with Your maximum `<user A maximum>`.
* Step 3 reads Outbid, with no reload.
* Step 3 reads Highest bid `<user A maximum>` plus `<increment>`.
* Step 3 shows the next valid bid, Highest bid plus its increment.

### grade10-site-auction-listing-page-US12-TC6-1: Live updates name no bidder and no maximum

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-12

**Pre-conditions:**

* customer A(signed in) leads `<listing_8>` with maximum `<user A maximum>`.
* customer C(signed out) is on the lot page for `<listing_8>`, with the browser's network inspector recording its live connection.
* customer B(card linked) is signed in on a separate session, on the same lot page.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_8>` | An open HKD listing, scheduled close more than an hour away |
| `<user A maximum>` | 900000 minor units |
| `<user B maximum>` | 600000 minor units, below `<user A maximum>` |

**Steps:**

1. As customer B, enter `<user B maximum>` in the custom maximum on the bid panel and confirm the bid.
2. As customer C, read every message the live connection received after step 1.

**Expected Results:**

* Step 2 shows an update carrying the new price, bid count and close.
* No message carries `<user A maximum>`, an account id, an email or a card detail.
* Any bidder a message names appears only by the lot's pseudonym.

### grade10-site-auction-listing-page-US12-TC7-1: A tied maximum that came second carries the earlier-leads tip

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
* **Trace:** grade10-site-auction-listing-page-US-12

**Pre-conditions:**

* `<listing_1>` is open in HKD, before its scheduled close, with no bid.
* customer A(card linked) and customer B(card linked) are signed in on separate sessions, each on the lot page for `<listing_1>`, in English.

**Test data:**

| Field | Value |
| --- | --- |
| `<maximum>` | At least two increments above the opening price |

**Steps:**

1. As customer A, enter `<maximum>` in the custom maximum on the bid panel and confirm it, so customer A sets `<maximum>` first.
2. As customer B, enter `<maximum>` in the custom maximum on the bid panel and confirm it, so customer B sets the same maximum later.
3. As customer B, read the Recent bids rows at `<maximum>`.
4. Hover the Info control on customer B's row at `<maximum>`.

**Expected Results:**

* Step 3: customer A's row and customer B's row both read `<maximum>`, customer A's first, since customer A leads and set `<maximum>` first, whatever time each row shows.
* Step 3: customer A's row at `<maximum>` carries no Info control; customer B's row, the later maximum, carries one.
* Step 4: the tip reads When maximums match, the earlier one leads.

### grade10-site-auction-listing-page-US12-TC8-1: An older tie lower down keeps the earlier-leads tip

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
* **Trace:** grade10-site-auction-listing-page-US-12

**Pre-conditions:**

* `<listing_5>` is open in HKD, before its scheduled close, with no bid.
* customer A(card linked), customer B(card linked) and customer C(card linked) are signed in on separate sessions, each on the lot page for `<listing_5>`, in English.

**Test data:**

| Field | Value |
| --- | --- |
| `<maximum>` | At least two increments above the opening price |
| `<higher maximum>` | At least two increments above `<maximum>` |

**Steps:**

1. As customer A, enter `<maximum>` in the custom maximum on the bid panel and confirm it, so customer A sets `<maximum>` first.
2. As customer B, enter `<maximum>` in the custom maximum on the bid panel and confirm it, so customer B sets the same maximum later.
3. As customer C, enter `<higher maximum>` in the custom maximum on the bid panel and confirm it.
4. As customer C, read the current price and the Recent bids rows at `<maximum>`.
5. Hover the Info control on customer B's row at `<maximum>`.

**Expected Results:**

* Step 4: the current price is above `<maximum>`, and customer C's row leads Recent bids.
* Step 4: customer A's row and customer B's row both read `<maximum>`, customer A's first, since customer A set `<maximum>` first, whatever time each row shows.
* Step 4: customer A's row at `<maximum>` carries no Info control; customer B's row, the later maximum, carries one.
* Step 5: the tip reads When maximums match, the earlier one leads.

---

## grade10-site-auction-listing-page-US13: Collector reads the same time left as every other page

**As a** collector,
**I want** the lot's countdown to agree with every other page on that lot, whatever my device's clock says,
**so that** the time I see left is the time I have.

### grade10-site-auction-listing-page-US13-TC1-1: Countdown agrees across devices whose clocks disagree

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-auction-listing-page-US-13

**Pre-conditions:**

* `<listing_3>` is open, its close about 10 minutes away.
* customer A is on the lot page for `<listing_3>` on a device whose clock is `<device skew>`.
* customer B is on the same lot page on a device whose clock is correct.

**Test data:**

| `<device skew>` |
| --- |
| 5 minutes ahead |
| 5 minutes behind |

| Field | Value |
| --- | --- |
| `<listing_3>` | An open HKD listing, close about 10 minutes away |

**Steps:**

1. Read Time left on customer A's page and customer B's page at the same moment.
2. Wait 1 minute.
3. Read Time left on both pages at the same moment.

**Expected Results:**

* Both pages read the same Time left, to the second, at step 1.
* Both pages read the same Time left, to the second, at step 3.
* Neither page is off by `<device skew>`.

### grade10-site-auction-listing-page-US13-TC2-1: Last second never reads 0 while the lot takes bids

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
* **Trace:** grade10-site-auction-listing-page-US-13

**Pre-conditions:**

* `<listing_4>` is open with no accepted bid, its close under a minute away.
* customer A is on the lot page for `<listing_4>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_4>` | An open HKD listing with no bids, extension duration 1800s (30mins) |
| `<last moment>` | 0.4 seconds before the close |

**Steps:**

1. Watch Time left from 10 seconds before the close.
2. Read Time left at `<last moment>`.
3. Read Time left just after the close passes.

**Expected Results:**

* Through step 1 Time left shows whole seconds only, never tenths.
* At step 2 Time left reads 1 second, never 0.
* At step 3 Time left reads 0 or the lot reads Closed.

### grade10-site-auction-listing-page-US13-TC3-1: Countdown corrects itself after the page was away

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
* **Trace:** grade10-site-auction-listing-page-US-13

**Pre-conditions:**

* `<listing_3>` is open, its close about 10 minutes away.
* customer A is on the lot page for `<listing_3>`.
* customer B is on the same lot page on a device whose clock is correct.

**Test data:**

| `<away>` |
| --- |
| customer A's device sleeps for 1 minute |
| customer A's browser goes offline for 1 minute, then reconnects |
| customer A switches to another tab for 1 minute, then back |

| Field | Value |
| --- | --- |
| `<listing_3>` | An open HKD listing, close about 10 minutes away |
| `<clock change>` | customer A's device clock set 2 minutes ahead |

**Steps:**

1. Make `<clock change>` while `<away>`.
2. Return to the lot page, without reloading.
3. Read Time left on customer A's page and customer B's page at the same moment.

**Expected Results:**

* Both pages read the same Time left, to the second.

### grade10-site-auction-listing-page-US13-TC4-1: A sub-second correction never makes the countdown jump up

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
* **Trace:** grade10-site-auction-listing-page-US-13

**Pre-conditions:**

* `<listing_3>` is open, its close about 10 minutes away.
* customer A is on the lot page for `<listing_3>`.
* The auction service's time, read on customer A's return, is `<correction>` earlier than the page's countdown assumes, so the new reading would add time.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_3>` | An open HKD listing, close about 10 minutes away |
| `<correction>` | 0.6 seconds, under a second |

**Steps:**

1. Switch to another tab.
2. Switch back to the lot page.
3. Watch Time left for 5 seconds.

**Expected Results:**

* Time left never reads a higher value than it read the moment before.

---

## grade10-site-auction-listing-page-US14: Bidder waits on a closed lot for its result

**As a** bidder,
**I want** a lot past its close to read Closed until its result is recorded, then Won or Did not win,
**so that** I am never shown a result the auction has not decided.

### grade10-site-auction-listing-page-US14-TC1-1: Closed shows until the close is recorded, then the result

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-auction-listing-page-US-14

**Pre-conditions:**

* `<listing_5>` is in the state the row gives, its close under a minute away, and no further bid will be placed.
* `<viewer>` is signed in and on the lot page for `<listing_5>`.

**Test data:**

| `<listing_5>` | `<viewer>` | `<result>` |
| --- | --- | --- |
| Led by customer A | customer A | Won |
| Led by customer A, customer B outbid | customer B | Did not win |
| Open with no accepted bid | customer A | Ended, with No bids under it |

**Steps:**

1. Watch the lot through its close, without reloading.
2. Read the lot's state until the result appears.

**Expected Results:**

* Once the close passes, the page reads Closed with no result.
* The page then reads `<result>`, without a reload.

### grade10-site-auction-listing-page-US14-TC2-1: A delayed close keeps Closed and never guesses a result

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-14

**Pre-conditions:**

* customer A leads `<listing_6>` and is on its lot page.
* `<listing_6>`'s close is under a minute away, and no further bid will be placed.
* Recording `<listing_6>`'s close is held back until the next sweep.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_6>` | An HKD listing led by customer A |

**Steps:**

1. Watch the lot through its close, without reloading.
2. Wait 30 seconds.
3. Reload the lot page.
4. Wait until the close is recorded.

**Expected Results:**

* Through steps 1 to 3 the page reads Closed with no result.
* No step shows Won, Did not win or Ended before the close is recorded.
* After step 4 the page reads Won, without a reload.

### grade10-site-auction-listing-page-US14-TC3-1: A bid still confirming at the close reads in existing words

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-14

**Pre-conditions:**

* Bid-time holds are on.
* customer B leads `<listing_7>`, its close under a minute away.
* customer A(card linked) is signed in and on the lot page for `<listing_7>`.
* customer A's card authorization is held until after the close.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_7>` | An HKD listing in extended bidding, led by customer B |
| `<bid amount>` | 505000 minor units, at or above the minimum next bid |

**Steps:**

1. Place `<bid amount>` 5 seconds before the close.
2. Read the bid panel.
3. Wait until the close is recorded.
4. Read the bid panel and the lot's state.

**Expected Results:**

* At step 2 the bid panel reads Authorizing….
* At step 4 the bid panel reads "Your bid did not go through." alone, never "The card was not authorized."
* The lot reads Did not win for customer A, with customer B's price as Highest bid.

### grade10-site-auction-listing-page-US14-TC4-2: A bid reaching the auction after the close reads in existing words

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-14

**Pre-conditions:**

* customer B leads `<listing_9>` at `<leader price>`, its close under a minute away.
* customer A(card linked) is signed in and on the lot page for `<listing_9>`, and has never bid on it.
* Once the page has loaded, customer A's browser blocks the auction's time route, live socket and lot reads, and its device clock runs 30 seconds behind the auction's, so the page keeps its bid controls enabled past the close.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_9>` | An HKD listing in extended bidding, led by customer B, no cap |
| `<leader price>` | 480000 minor units |
| `<bid amount>` | 505000 minor units, at or above the minimum next bid |

**Steps:**

1. Wait until 5 seconds after the close, by the auction's clock.
2. Place `<bid amount>`.
3. Read the bid panel.
4. Unblock the auction, reload the lot page and wait until the close is recorded.
5. Read the lot's state and the bid panel.

**Expected Results:**

* At step 3 the bid panel reads "Your bid did not go through." alone.
* No new label or wording appears for the refused bid.
* At step 5 Highest bid reads `<leader price>`.
* At step 5 customer A's page shows neither Won nor Did not win.

### grade10-site-auction-listing-page-US14-TC5-2: A lone first bid refused past the close leaves the lot Ended with No bids

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-14

**Pre-conditions:**

* `<listing_10>` is open with no accepted bid, its scheduled close under a minute away.
* customer A(card linked) is signed in and on the lot page for `<listing_10>`.
* Once the page has loaded, customer A's browser blocks the auction's time route, live socket and lot reads, and its device clock runs 30 seconds behind the auction's, so the page keeps its bid controls enabled past the close.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_10>` | An open HKD listing with no bids, starting price 20000 minor units, extension duration 1800s (30mins), no cap |
| `<bid amount>` | 20000 minor units, the opening price |

**Steps:**

1. Wait until 5 seconds after the scheduled close, by the auction's clock.
2. Place `<bid amount>`.
3. Read the bid panel.
4. Unblock the auction, reload the lot page and wait until the close is recorded.
5. Read Time left, the lot's state and the bid panel.

**Expected Results:**

* At step 3 the bid panel reads "Your bid did not go through." alone.
* At step 5 Time left never read Extended bidding.
* At step 5 the lot reads Ended, with No bids under it.
* At step 5 the page shows neither Won nor Did not win.

### grade10-site-auction-listing-page-US14-TC6-1: A later close turns a Closed page back to Extended bidding

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
* **Trace:** grade10-site-auction-listing-page-US-14

**Pre-conditions:**

* `<listing_11>` is in extended bidding, led by customer B, its recorded close under a minute away.
* customer A is on the lot page for `<listing_11>`, with its live updates delayed by 5 seconds.
* customer C(card linked) is signed in on a separate session, on the same lot page.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_11>` | An HKD listing in extended bidding, led by customer B, extension duration 1800s (30mins), no cap |
| `<bid amount>` | At or above the minimum next bid |

**Steps:**

1. As customer C, place `<bid amount>` 1 second before the recorded close.
2. As customer A, watch Time left through the recorded close, without reloading.
3. As customer A, read the lot's state and the bid panel once the update arrives.

**Expected Results:**

* Once the close it counted to passes, customer A's page reads Closed with no result and its bid controls disabled.
* At step 3 Time left is labelled Extended bidding and counts to customer C's bid time plus 1800s.
* At step 3 the bid controls are enabled.
* No step shows Won, Did not win or Ended, and the page did not reload.

### grade10-site-auction-listing-page-US14-TC7-1: A sold lot crowns its winning bid and no other

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
* **Trace:** grade10-site-auction-listing-page-US-14

**Pre-conditions:**

* `<listing_2>` is live in HKD, led by customer A, with a bid from customer B below it, its recorded close a minute away.
* customer C is on the lot page for `<listing_2>`, in English.

**Steps:**

1. As customer C, read Recent bids before the close.
2. Wait for the close to be recorded as sold to customer A, without reloading.
3. As customer C, read Recent bids again.

**Expected Results:**

* Step 1: no row shows a crown.
* Step 3: customer A's winning row shows a crown named Winner after the amount.
* Step 3: no other row, customer B's included, shows a crown.

### grade10-site-auction-listing-page-US14-TC8-1: A lot without a winner crowns no bid

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
* **Trace:** grade10-site-auction-listing-page-US-14

**Pre-conditions:**

* `<listing_3>` is past its close with bids from customer A and customer B, and recording its close is held back until the next sweep.
* `<listing_4>` is past its close with no bid, its close recorded with no winner.
* customer C is signed in on a separate session.

**Steps:**

1. As customer C, open the lot page for `<listing_3>` and read Recent bids.
2. As customer C, open the lot page for `<listing_4>` and read Recent bids.

**Expected Results:**

* Step 1: the lot reads Closed and no row shows a crown.
* Step 2: the lot reads Ended with No bids under it, Recent bids holds no row, and no crown shows.

## Settled

- A bid takes no card hold, so no bid is still confirming at the close: a bid is accepted or refused in one answer, and the lot page never reads Authorizing… (decisions Q3).
- A bid refused past the close is not a bid: the bid form says "Your bid did not go through." and the lot's result is decided as if it was never sent (decisions Q6).
- A row tied on amount with a row above it carries the earlier-leads tip at any older tie lower down Recent bids, not only at the current price; the row above carries none (`bid-history-winner-priority` Q4).
- Rows tied on amount are listed the leading or won row first, then the row of the bidder who set that maximum earlier, and keep that order once both are outbid; the tip goes on the row of the later maximum (`bid-history-winner-priority` Q6).

## Reconciliation

**Run:** QA2 rerun, 2026-10-01, for change `relay-auction-live-state`. Joined QA1's blind cases, written from the re-frozen anchors (Purpose, Feature set, `user-journeys.md`, `proposal.md`, `decisions.md` with `## Raised`, and the change's `domain-tcs.md`), with the delta scenarios SC-29 to SC-46, `tech-design.md` and `tasks.md`. QA1 was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and the archive. QA2 added US14-TC5 and US14-TC6 for scenarios no blind case reached.

| Finding | Disposition |
| --- | --- |
| US12-TC1: another session's bid shows price and bid count without a reload | **Folded in:** `grade10-site-auction-listing-page-SC-29` |
| US12-TC2: the scheduled close with a bid turns to Extended bidding | **Folded in:** `grade10-site-auction-listing-page-SC-31` |
| US12-TC3: a page with the live line blocked catches up by polling | **Folded in:** `grade10-site-auction-listing-page-SC-32`, `grade10-site-auction-auction-SC-77`. QA2 dropped the case's `auction.realtime` row: no flag exists (Q11) |
| US12-TC4: a page that lost its line catches up when it returns | **Folded in:** `grade10-site-auction-listing-page-SC-41` |
| US12-TC5: the leader's standing turns to Outbid with the next valid bid, without a reload | **Folded in:** `grade10-site-auction-listing-page-SC-43` (Q12) |
| US12-TC6: live updates carry no maximum, account, email or card | **Folded in:** `grade10-site-auction-listing-page-SC-43` (AND clause); the frame contract is `grade10-site-auction-auction-SC-76` |
| US13-TC1: countdowns agree across devices whose clocks disagree | **Folded in:** `grade10-site-auction-listing-page-SC-33` |
| US13-TC2: the last second reads 1, whole seconds only | **Folded in:** `grade10-site-auction-listing-page-SC-34`, `grade10-site-auction-listing-page-SC-44` (Q31) |
| US13-TC3: sleep, reconnect and a tab return re-read the clock | **Folded in:** `grade10-site-auction-listing-page-SC-35` |
| US13-TC4: a sub-second correction never raises the countdown | **Folded in:** `grade10-site-auction-listing-page-SC-36` |
| US14-TC1: Closed with no result until recorded, then Won, Did not win, or Ended with No bids | **Folded in:** `grade10-site-auction-listing-page-SC-37`, `grade10-site-auction-listing-page-SC-38`, `grade10-site-auction-listing-page-SC-40`; the no-bid row is the requirement's No winner row |
| US14-TC2: a close held to the sweep keeps Closed through a reload and never guesses | **Folded in:** `grade10-site-auction-listing-page-SC-37`, `grade10-site-auction-listing-page-SC-40` |
| US14-TC3: a hold confirming after the close reads "Your bid did not go through." alone, then Did not win | **Withdrawn:** `grade10-site-auction-listing-page-SC-39` is dropped, because a bid takes no card hold and none confirms after the close |
| US14-TC4: a bid reaching the auction after the close reads the same words alone | **Folded in:** `grade10-site-auction-listing-page-SC-45` (Q13) |
| `grade10-site-auction-listing-page-SC-46`: a lone first bid confirming at the scheduled close; no blind case walked the pending bid | **Added:** `grade10-site-auction-listing-page-US14-TC5-1`. It also answers QA1's third raised question on the lot page: Ended with No bids, neither Won nor Did not win (Q1) |
| `grade10-site-auction-listing-page-SC-42`: a later recorded close returns a Closed page to Extended bidding; no blind case reached it | **Added:** `grade10-site-auction-listing-page-US14-TC6-1` |

- **Covered at domain** — `grade10-site-auction-e2e-US07-TC03-2` walks `grade10-site-auction-listing-page-SC-30`: a price-moving bid in extended bidding restarts the open page's countdown, labelled Extended bidding, without a reload

**Uncovered anchors:** none. `grade10-site-auction-listing-page-US-04` is a context journey; this change adds no scenario serving it, and its durable cases stand.

**Run:** QA2, 2026-10-03. QA1's blind pass read the capability's `## Purpose` and `## Feature set`, its `user-journeys.md`, `proposal.md`, `decisions.md`, the linked pages under `docs/prds/`, and the durable suite and the change's domain draft with `## Reconciliation` stripped; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and `openspec/changes/archive/`. QA2 read QA1's suites, the delta specs, `decisions.md`, `tech-design.md`, `tasks.md`, the durable specs and suites on main after `my-auctions-without-bid-holds` was accepted, and grade10 main's bidding, history, erasure and refusal-copy code and tests. It is a statement, not proof.

- **Folded in** - `grade10-site-auction-listing-page-SC-45` by `grade10-site-auction-listing-page-US14-TC4-2`; `grade10-site-auction-listing-page-SC-47` by the No bids row of the durable `grade10-site-auction-listing-page-US14-TC1-1`, which reads Ended with No bids without a reload, and by `grade10-site-auction-listing-page-US14-TC5-2` for a refused bid past the close
- **Revised** - `grade10-site-auction-listing-page-US14-TC4-2` adds that a bidder whose only bid was refused past the close reads neither Won nor Did not win; `grade10-site-auction-listing-page-US14-TC5-2` replaces a bid still confirming at the close with a bid refused past it. QA1 kept their ids; both move up a revision. `grade10-site-auction-listing-page-US12-TC5-1` and `grade10-site-auction-listing-page-US14-TC6-1` lose the hold switch pre-condition only, `<v>` kept
- **Deprecated** - `grade10-site-auction-listing-page-US14-TC3-1`, a bid still confirming at the close
- **Raised** - none
- **Retired** - grade10-site-auction-listing-page-SC-46, a lone first bid still confirming at the close, leaves the result words with the payment confirmation (Q3). No retired id is reissued
- **Contradicted** - none
- **Uncovered anchors** - none

**Run:** Accept-review fix round, 2026-10-05, for change `bid-history-winner-priority`. The Bidding page's Recent bids Winner line promised collectors an outcome no consumer requirement delivered, while `grade10` already sets both flags in `listingLotExtras.ts`. Read `proposal.md`, `decisions.md` (Q1 to Q3), this delta `spec.md`, the page line and the consumer's mapper and its tests. Written beside the scenarios, not blind.

**Run:** QA2 reconciliation 2026-10-05, for change `bid-history-winner-priority`. Reread both cases against `grade10-site-auction-listing-page-SC-48` and `grade10-site-auction-listing-page-SC-49`, the requirement, `user-journeys.md`, `proposal.md`, `decisions.md`, `ui-design.md`, `tech-design.md`, `tasks.md`, the Bidding · Auction Panel line and decision row, the durable spec and suite, `define-public-auction-identifiers`'s suite on this capability, and in `grade10` `listingLotExtras.ts`, its test, `listingUi.ts`'s sold panel and `ListingView.tsx`'s copy. It is a statement, not proof.

**Run:** QA2 reconciliation 2026-10-05, rerun after Q4 and Q5, for change `bid-history-winner-priority`. Reread every case against `grade10-site-auction-listing-page-SC-48` to `grade10-site-auction-listing-page-SC-51`, the requirement, `user-journeys.md`, `proposal.md`, `decisions.md` (Q1 to Q5), `ui-design.md`, `tech-design.md`, `tasks.md`, the Bidding · Auction Panel line and decision row as Q4 left them, the durable spec and suite, `define-public-auction-identifiers`'s suite on this capability, and in `grade10` `listingLotExtras.ts` and `listingLotExtras.test.ts`. It is a statement, not proof.

| Finding | Disposition |
| --- | --- |
| A sold lot crowns its won row and no other; a live lot crowns none | **Folded in:** `grade10-site-auction-listing-page-SC-48` / `grade10-site-auction-listing-page-US14-TC7-1` |
| A tied maximum that came second carries the earlier-leads tip; the leader carries none | **Folded in:** `grade10-site-auction-listing-page-SC-49` / `grade10-site-auction-listing-page-US12-TC7-1` |
| The tip on an older pair of equal amounts, below the current price | **Folded in:** Q4 settled it and `grade10-site-auction-listing-page-SC-51` states it, so the earlier Out of suite no longer holds; `grade10-site-auction-listing-page-US12-TC8-1` walks it. The mapper test in `grade10`, `listingLotExtras.test.ts`, "keeps the same-price priority tip on older equal-price pairs", stays its unit proof |
| US12-TC8: an older tie needs a third bidder to move the price past it; customer A's earlier maximum answers customer B's later one | **Kept:** the case reads the rows at `<maximum>` by bidder, not by time, as `grade10-site-auction-listing-page-SC-51` does; customer A's automatic answer is stamped one ms after customer B's challenge, so customer A's row lists first once both are outbid |
| No crown on a lot Closed without a result or ended without a winner, stated by the requirement; no scenario carried it at the first QA2 | **Folded in:** reported to Dev, then at the owner's word `grade10-site-auction-listing-page-SC-50` / `grade10-site-auction-listing-page-US14-TC8-1`; `listingLotExtras.test.ts`, "crowns no row until the lot is closed sold", proves the mapper half |
| US14-TC8 reread, written without a QA2 read: a sale is absolute and a called-off lot is hidden, so a close with no winner is a lot with no bid, and Recent bids holds no row to crown | **Kept:** the second lot stays, since `grade10-site-auction-listing-page-SC-50` names it; step 2 now asserts Ended with No bids and an empty Recent bids, which the durable `Anyone - No winner` row states, rather than a crown with no row to sit on |
| US14-TC8's first lot was "result not yet recorded" with no way to hold it there | **Folded in:** its pre-condition holds the close back until the next sweep, as the durable US14 delayed-close case does |
| US12-TC7: customer A's maximum on a lot with no bid leaves customer A a row at the opening price as well, so "customer A's row" named two rows, and the tip was read by accessible name | **Folded in:** steps and results name the rows at `<maximum>`, and step 4 hovers the Info control, `grade10-site-auction-listing-page-SC-49`'s WHEN |
| US14-TC7: "customer B's row shows no crown" asserted less than `grade10-site-auction-listing-page-SC-48`'s "no other row" | **Folded in:** step 3 asserts no other row, customer B's included |
| US14-TC7 waits for the sold result without a reload; the scenario does not say so | **Kept:** the page's sold panel and the crown read the same won bid (`listingUi.ts`, `ListingView.tsx`), and US-14's durable cases already read the result without a reload |
| Case ids `US12-TC7-1`, `US12-TC8-1`, `US14-TC7-1` and `US14-TC8-1` | **Checked:** the durable suite ends at `US12-TC6` and `US14-TC6`; `define-public-auction-identifiers` issues `US10` and `US11` only, and no other active change holds a suite on this capability. No collision |
| `tasks.md` 4.1 cited `grade10-site-auction-listing-page-SC-48` and `-SC-49` only, and the walk named neither the older tie nor `grade10-site-auction-listing-page-US12-TC8-1` | **Resolved:** reported to Dev; 4.2 now names `grade10-site-auction-listing-page-SC-48` to `-SC-51` in the test titles, and 4.4 walks `grade10-site-auction-listing-page-US12-TC8-1` |
| Facts across the Bidding page line and decision row, Q1 to Q5, `tech-design.md` Decision 4, the delta and the cases | **Agree:** the won row is crowned only once the close is recorded as sold; every row tied on amount with a row above it carries the tip, at the current price and at any older tie; the page supplies the copy in `en`, `ko`, `zh-Hans` and `zh-Hant` |
| Questions for the PM | None - Q1 to Q5 settle what this capability turns on |

**Run:** QA2 reconciliation 2026-10-05, rerun after Q6, for change `bid-history-winner-priority`. Reread every case against `grade10-site-auction-listing-page-SC-48` to `grade10-site-auction-listing-page-SC-51`, the requirement's Tied maximum clause as Q6 left it, `user-journeys.md`, `proposal.md`, `decisions.md` (Q1 to Q6), `ui-design.md`, `tech-design.md` Decisions 4 and 5, `tasks.md` 4.1 to 4.4, the Bidding · Auction Panel line and decision row, the durable spec and suite, `define-public-auction-identifiers`'s suite on this capability, and in `grade10` `listingLotExtras.ts`, `listingLotExtras.test.ts` and the public ledger read in `repositories/listings.ts`. It is a statement, not proof.

| Finding | Disposition |
| --- | --- |
| Q6: rows tied on amount list leader or won first, then the earlier maximum | **Agree:** `grade10-site-auction-listing-page-SC-49` and `-SC-51` already name the tie by whose maximum came earlier, not by row time; both cases now say who sets `<maximum>` first in steps 1 and 2 and expect the tip on the row of the later maximum |
| US12-TC7: customer A's automatic answer at `<maximum>` is the leading row | **Kept:** the leader lists first under the build and under Q6 alike |
| US12-TC8: once customer C leads, neither row at `<maximum>` leads | **Kept:** the case expects Q6's order, customer A first; the build gives it, since customer A's answer is stamped one ms after customer B's challenge and both the public read and the mapper rank the newer row first. See the rerun after the built tie order below |
| A walker cannot see when a maximum was set, only each row's shown time, the same on both rows of a tie | **Folded in:** both cases expect the order by who set `<maximum>` first, whatever time each row shows |
| `tasks.md` 4.1 cited `grade10-site-auction-listing-page-SC-48` and `-SC-49` only, and the walk named no older tie | **Resolved:** 4.2 names `grade10-site-auction-listing-page-SC-48` to `-SC-51` in the test titles with no build change; 4.4 walks the tip at the current price and at an older tie lower down |
| Case ids `US12-TC7-1`, `US12-TC8-1`, `US14-TC7-1` and `US14-TC8-1` | **Checked:** the durable suite ends at `US12-TC6` and `US14-TC6`; no other active change holds these ids. No collision |
| Facts across the Bidding page line and decision row, Q1 to Q6, `tech-design.md` Decisions 4 and 5, the delta and the cases | **Agree:** the won row is crowned only once the close is recorded as sold; a tie lists leader or won first, then the earlier maximum; every row with an equal amount listed above it carries the tip, at the current price and at any older tie |
| Questions for the PM | None - Q6 settles the order of a tie, and Q1 to Q5 the rest |

**Uncovered anchors:** none. Recent bids outcome's two items each have cases - winner after close by `grade10-site-auction-listing-page-US14-TC7-1` and `-US14-TC8-1`, equal-max tip by `-US12-TC7-1` and `-US12-TC8-1` - and each of `grade10-site-auction-listing-page-SC-48` to `-SC-51` is asserted by one of them.

**Run:** QA2 reconciliation 2026-10-05, rerun after the built tie order, for change `bid-history-winner-priority`. Reread every case against `grade10-site-auction-listing-page-SC-48` to `grade10-site-auction-listing-page-SC-51`, the requirement's Tied maximum clause, `user-journeys.md`, `proposal.md`, `decisions.md` (Q1 to Q6, as Q6 now names the one-ms answer stamp), `ui-design.md`, `tech-design.md` Decisions 4 and 5, `tasks.md` 4.1 to 4.4, the Bidding · Auction Panel line and decision row, the durable spec and suite, `define-public-auction-identifiers`'s suite on this capability, and in `grade10` the stamp in `resolveStandingMaxima.ts`, the public ledger read in `repositories/listings.ts`, the "recent-bids consecutive same-bidder" test in `autoBidding.spec.ts`, and `listingLotExtras.ts` and its test. It is a statement, not proof.

| Finding | Disposition |
| --- | --- |
| A tie is not random: `resolveStandingMaxima.ts` stamps the leader's automatic answer one ms after the challenger, the public read orders an amount leader or won first, then newer, and the mapper ranks the same way | **Agree:** the earlier maximum lists first at the current price and after both are outbid; `autoBidding.spec.ts` lists the first bidder to set 180,000 above the second once both are outbid |
| An earlier row said US12-TC8 fails at random until task 4.2 lands | **Corrected:** `grade10-site-auction-listing-page-US12-TC8-1` expects what the build already gives, customer A's row above customer B's at `<maximum>` and the tip on customer B's, and should pass at task 4.4's walk; task 4.2 names scenarios in test titles and changes no build. Each row above now states this outcome |
| US12-TC7 against `grade10-site-auction-listing-page-SC-49` | **Agree:** customer A leads at `<maximum>` and lists first; the tip is on customer B's row only |
| Each of US14-TC7 / `grade10-site-auction-listing-page-SC-48` and US14-TC8 / `-SC-50` | **Agree:** values and outcomes match each GIVEN, THEN and AND; the tie change touches neither |
| Accept-review: the `## Settled` lines cited decisions Q4 and Q6 without the change, and fold beside other changes' Settled lines | **Folded in:** each names `bid-history-winner-priority`; the Q6 line no longer says the order ignores the stamp, since the stamp is what keeps it |
| Accept-review: no `### Manual` table for the four manual cases | **Folded in:** `### Manual` below names what a person drives for each |
| Case ids `US12-TC7-1`, `US12-TC8-1`, `US14-TC7-1` and `US14-TC8-1` | **Checked:** the durable suite ends at `US12-TC6` and `US14-TC6`; `define-public-auction-identifiers` issues `US10` and `US11` only, and no other active change holds a suite on this capability. No collision |
| Questions for the PM | None - Q6 settles the order of a tie and the build keeps it, and Q1 to Q5 the rest |

**Uncovered anchors:** none. Recent bids outcome's two items each have cases - winner after close by `grade10-site-auction-listing-page-US14-TC7-1` and `-US14-TC8-1`, equal-max tip by `-US12-TC7-1` and `-US12-TC8-1` - and each of `grade10-site-auction-listing-page-SC-48` to `-SC-51` is asserted by one of them; every case stays `draft`.

**Run:** the suite pass read the isolated bundle assembled by hand at
`/private/tmp/.../scratchpad/blind-suite-isolated-input.md` (Purpose, Feature
set with the new "Public identifier" group, this capability's
`user-journeys.md` including US-10 and US-11, `decisions.md` with `## Raised`
included, the two PRD sections, and the existing `feature-tcs.md` for id
continuity); it was denied `## Requirements`, `openspec/specs/` beyond the
quoted sections, and `openspec/changes/archive/`. The scenario pass read
`proposal.md`, `decisions.md`, this capability's `user-journeys.md`, the
durable `spec.md`'s full `## Requirements`, and the same two PRD sections; it
did not read `feature-tcs.md` or the suite draft.

| Diff | Disposition |
| --- | --- |
| Suite carried a case for the listing code staying absent once scripts finish running (US10-TC2); no scenario stated it — the scenario draft's "Server-rendered response" bullet only covered the pre-script HTML | Real: the requirement's after-scripts behaviour is undecided by any prior requirement, and the durable "served lot becomes live without blanking" requirement is silent on the listing code. Folded in as `grade10-site-auction-listing-page-SC-25` |
| Suite carried a case for the listing code not resolving as a lot address (US10-TC7, US11-TC2); no scenario stated it | Real: whether the code could double as an alternate lookup key was never proposed or ruled out. Folded in as `grade10-site-auction-listing-page-SC-26` |
| Suite carried a case for a separate listing-code field staying absent once an order exists on the lot (US10-TC9, US11-TC3); no scenario stated it | Real, and already settled by decisions.md Q18 and the proposal: the lower-case code is the canonical-address suffix, never a labelled public field, regardless of whether an order exists. Folded in as `grade10-site-auction-listing-page-SC-27` |
| Suite carried a case for the listing code staying absent regardless of signed-in state (US10-TC8) | Already covered: `SC-20`'s GIVEN/WHEN never conditions on an actor or auth state, so the rule is already unconditional across signed-in and signed-out visitors. No new scenario; case kept as a boundary check against that existing scenario |
| Suite carried two positive cases on US10 (title/address present in the served response; shared-link preview names the lot by title/address) | Misreading of scope: both duplicate durable `grade10-site-auction-listing-page-SC-01` and `-SC-03`, which already prove a lot's title, description and preview render correctly. Not new behaviour from this change. Dropped |
| Suite carried two positive cases on US11 (title/address together identify exactly one lot; the address a collector quotes reopens the same lot) | Misreading of scope: both duplicate durable `SC-01`/`SC-02`/`SC-05` (two lots answer as two pages; a published lot's address answers). Not new behaviour from this change. Dropped |
| Suite carried a case on US11 for a closed lot still resolving by title and address | Misreading of scope: tests general lot-status resolution (Ended lots stay published), which is `grade10-site/auction/lot-status`'s durable behaviour, not this change's identifier guard. Dropped |
| Scenario draft's `SC-24` (not-found response carries no listing code) reached no suite case | Hole: added `grade10-site-auction-listing-page-US10-TC10-1`, tracing `US-10` — an in-flight delta's suite can only trace journeys this same delta defines, and the durable `US-03` journey (whose not-found requirement this scenario extends) is not part of this delta's `user-journeys.md` |
| Suite's raised question on whether a stale/cached share-preview generated before this change could still surface on a re-share | **Decided in Q15:** old cached content may persist and no purge or regeneration is guaranteed; current pages and fresh metadata still omit the code and private data |
| Suite's raised question on whether the collector-facing payment reference (Q6) ever appears on the listing page after an order exists | Already settled, not a genuine gap: Q10 and the proposal are unconditional that the listing page never shows the code, in any order state. Resolved directly as `SC-27` rather than raised |
| Suite's raised question on whether signed-in state matters here | Already settled, not a genuine gap: the requirement's rule is stated with no actor qualifier. No row raised |
| Suite's raised question on whether a code-shaped-but-wrong guess is handled differently from an ordinary bad address | Already settled by the durable "An address that names no lot is refused" requirement plus this delta's `SC-26`: a listing code is not wired into the address's lookup at all, so it is refused the same as any other unrecognized address. No row raised |

No contradiction between the two readings arose — both independently concluded
the code must never appear on this capability's public surfaces.

### Manual

| Manual | Why |
| --- | --- |
| `grade10-site-auction-listing-page-US12-TC7-1` | To be walked in task 4.4 on the isolated stack: two signed-in bidders each confirm the same custom maximum in turn, and a person reads the rows at that amount and hovers the Info control; the mapper's test flags a tied row it is handed, and the case walks the order the server writes and the tip the page draws |
| `grade10-site-auction-listing-page-US12-TC8-1` | To be walked in task 4.4 on the isolated stack: three signed-in bidders, the third confirming a higher maximum, and a person reads the older tie and hovers its Info control; the backend test proves the read's order and the mapper's test the flag, and the case walks both through the page |
| `grade10-site-auction-listing-page-US14-TC7-1` | To be walked in task 4.4 on the isolated stack: a person watches a live lot's close be recorded as sold without reloading, and reads Recent bids before and after; the mapper's test proves the crown from a sold flag it is handed |
| `grade10-site-auction-listing-page-US14-TC8-1` | To be walked in task 4.4 on the isolated stack: a person opens a lot whose close is held back until the next sweep and a lot ended with no bid, and reads each one's Recent bids; the mapper's test proves no crown before the lot is closed sold |
