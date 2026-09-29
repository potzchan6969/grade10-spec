# grade10-site/auction/listing-page Test Cases

**Status:** reopened
**Drafts styled:** 2026-09-29, tcs-rules r4
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

## grade10-site-auction-listing-page-US6: Watch a lot and open My Auctions from the toast

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
* **Automation status:** manual
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

## grade10-site-auction-listing-page-US7: Unwatch from the lot and undo

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
* **Automation status:** manual
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
* **Automation status:** manual
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
* **Automation status:** manual
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
* **Automation status:** manual
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
* **Automation status:** manual
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
