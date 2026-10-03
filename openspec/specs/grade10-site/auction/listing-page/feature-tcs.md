# grade10-site/auction/listing-page Test Cases

**Status:** reopened
**Drafts styled:** 2026-10-02, tcs-rules r4
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

## Settled

- A bid takes no card hold, so no bid is still confirming at the close: a bid is accepted or refused in one answer, and the lot page never reads Authorizing… (decisions Q3).
- A bid refused past the close is not a bid: the bid form says "Your bid did not go through." and the lot's result is decided as if it was never sent (decisions Q6).

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
