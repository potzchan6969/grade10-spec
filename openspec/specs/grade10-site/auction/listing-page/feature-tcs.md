# grade10-site/auction/listing-page Test Cases

**Status:** pending-review · 0/28
**Drafts styled:** 2026-10-24, tcs-rules r7
**Regenerated:** 2026-10-24, tcs-rules r7

## Background

* A listing's page is `<g10url>/auction/listings/<slug>`, with `/tc` or `/sc` before `/auction` for Traditional or Simplified Chinese; its slug is built from the English title and ends in the lower-case listing code, read on its admin listing screen. A link preview is read by pasting an address into a chat app that unfurls links.
* Every listing is priced in USD, whole dollars: +USD250 from USD2,500, +USD500 from USD5,000. Bids take no card hold.
* Unless a case says otherwise the listing is open, closes more than an hour away, and customer A and customer B (card linked) are signed in on separate sessions.

## Walk 1: Read and follow one live listing

Starting state:

- `<listing>` is open at USD4,960, led by customer B; customer A(signed in, card linked) has never watched or bid on it.

Shared test data:

| Field | Value |
| --- | --- |
| listing | An open USD listing with bids, closing in under a minute when step 5 begins |

### Route

1. As customer A, open `<listing>` from its catalogue card.
   - Its own address opens, the served content staying as scripts load. `g10.auction-listing-page.US5-TC1`
2. Select Watch, then View My Auctions in the toast; go back and Unwatch, then Undo.
   - Watching with alerts on, listed on My Auctions; Unwatch removes it and Undo restores it. `g10.auction-listing-page.US7-TC1`
3. Place USD5,210.
   - One alerts toast; Watching locks. `g10.auction-listing-page.US8-TC1`
4. As customer B, place a maximum of USD6,000; as customer A, read the page without reloading.
   - The price, bid count and Recent bids row arrive, and customer A reads Outbid. `g10.auction-listing-page.US12-TC1`
5. Let `<listing>` close.
   - Closed until the close is recorded, then Did not win, the winning row crowned. `g10.auction-listing-page.US14-TC1`

## g10.auction-listing-page.US1: Collector opens a listing at its own address

**As a** collector,
**I want** a listing's address to answer with that listing's own page in the response
HTML,
**so that** I can read its name, its description and where its bidding stands
without waiting for a script to run.

<!-- trace:case id=g10.auction-listing-page.TC-2it rev=4 -->
### g10.auction-listing-page.US1-TC3: A listing's address opens that listing, whatever its state, and only its current holder

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-01

**Pre-conditions:**

* `<listing>` holds `<slug>` and is `<state>`.

**Test data:**

| `<state>` | `<route>` |
| --- | --- |
| published, open | the address |
| closed, its order settled | the address |
| published under a slug a called-off listing released | the address |
| published under a slug a called-off listing released | its catalogue card, after the old listing's card was seen in an earlier session |

**Steps:**

1. Open `<listing>` by `<route>` and read the page, its tab title and the address bar.

**Expected Results:**

* `<listing>`'s own title, gallery, price and state show at `<g10url>/auction/listings/<slug>`, never another listing's.

---

## g10.auction-listing-page.US2: Collector shares a listing link

**As a** collector,
**I want** a listing link to unfurl as that listing and its own canonical address,
**so that** a link I pass on names the listing it points at instead of the auction
catalogue.

<!-- trace:case id=g10.auction-listing-page.TC-89i rev=2 -->
### g10.auction-listing-page.US2-TC1: A shared link unfurls as that listing

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-page/listing-page.spec.ts`

**Pre-conditions:**

* `<listing>` is published.

**Steps:**

1. Paste `<listing>`'s address into a chat app and read the preview.

**Expected Results:**

* The preview's title and description name `<listing>`, and its address is `<listing>`'s, never the catalogue.

---

## g10.auction-listing-page.US3: Collector opens an address that names no listing

**As a** collector,
**I want** an address under the auction's listings that names no published listing to
answer with the site's not-found surface,
**so that** I am never shown an empty listing page or the catalogue in its place.

<!-- trace:case id=g10.auction-listing-page.TC-3xv rev=2 -->
### g10.auction-listing-page.US3-TC1: An address that names no public listing shows Page not found

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-03

**Pre-conditions:**

* No published listing answers `<address>`.

**Test data:**

| `<address>` | `<route>` |
| --- | --- |
| A slug never issued | typed |
| A slug a called-off listing released, held by no published listing | its catalogue card, seen in an earlier session |
| `<g10url>/auction/listings/<code>`, a published listing's code alone | typed |

**Steps:**

1. Open `<address>` by `<route>`.

**Expected Results:**

* The site's Page not found shows, never an empty listing page, the catalogue or a listing code.

---

## g10.auction-listing-page.US4: Collector reads a live listing while scripts load

**As a** collector,
**I want** the listing I was served to stay on screen once scripts finish loading,
**so that** nothing I was reading blanks into a placeholder and no value
disagrees with what the document carried.

<!-- trace:case id=g10.auction-listing-page.TC-wka rev=2 -->
### g10.auction-listing-page.US4-TC1: The served listing stays on screen as scripts load, and time left carries on

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-page/listing-page.spec.ts`

**Pre-conditions:**

* `<listing>` is open with bids, its close about 10 minutes away.

**Steps:**

1. With scripts off, open `<listing>` and note the title, description, price, bid count, standing and time left.
2. Turn scripts on and reload, watching the page as it loads.

**Expected Results:**

* Step 1 shows each noted value.
* Step 2 never replaces one with a placeholder, and time left counts on from about the value served.

---

## g10.auction-listing-page.US5: Collector reaches a listing from the catalogue

**As a** collector,
**I want** to open a listing's own address from the catalogue without a page load,
**so that** the listing I picked out of the list is the page I land on.

<!-- trace:case id=g10.auction-listing-page.TC-fe3 rev=2 -->
### g10.auction-listing-page.US5-TC1: The catalogue opens a listing at its own address without a page load

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-05

**Pre-conditions:**

* `<listing>` is published on `<g10url>/auction`.

**Steps:**

1. Select `<listing>`'s card.
2. Reload.

**Expected Results:**

* Step 1 opens `<listing>`'s page at its own address, the site chrome never flashing blank.
* Step 2 shows the same listing.

---

## g10.auction-listing-page.US6: Watch an auction and open My Auctions from the toast

**As a** collector on a listing I have not bid on,
**I want** Watching to tell me email alerts are on and offer My Auctions,
**so that** I know how to manage that listing without hunting for the account page.

<!-- trace:case id=g10.auction-listing-page.TC-4op rev=2 -->
### g10.auction-listing-page.US6-TC1: Watching from the page says alerts are on and leads to My Auctions

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-page/listing-page.spec.ts`

**Pre-conditions:**

* customer A has neither watched nor bid on `<listing>`, and is on its page; its price and bid count are noted.

**Steps:**

1. Select Watch.
2. Select View My Auctions in the toast.

**Expected Results:**

* Step 1 reads Watching, with a toast that email alerts are on; the price and bid count are unchanged.
* Step 2 lists `<listing>` on My Auctions, watch-only.

<!-- trace:case id=g10.auction-listing-page.TC-sip rev=2 -->
### g10.auction-listing-page.US6-TC2: A signed-out viewer is offered sign-in, and nothing is watched

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-page/listing-page.spec.ts`

**Pre-conditions:**

* A signed-out visitor is on `<listing>`'s page.

**Steps:**

1. Select Watch.

**Expected Results:**

* Sign-in is offered; the control still reads Watch and nothing is recorded.

---

## g10.auction-listing-page.US7: Unwatch from the auction and undo

**As a** collector who watched a listing without bidding,
**I want** Unwatch to confirm alerts are off and let me Undo,
**so that** a mis-tap does not force me to find the listing again.

<!-- trace:case id=g10.auction-listing-page.TC-pjv rev=2 -->
### g10.auction-listing-page.US7-TC1: Unwatching removes the listing from My Auctions, and Undo puts it back

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-07

**Pre-conditions:**

* customer A watches `<listing>` without bidding, and is on its page.

**Steps:**

1. Select Unwatch, and open My Auctions in another tab.
2. Select Undo in the toast, and reload My Auctions.

**Expected Results:**

* Step 1 reads Watch, and My Auctions no longer lists `<listing>`.
* Step 2 reads Watching with alerts on, and My Auctions lists it again.

---

## g10.auction-listing-page.US8: After bidding, Watching stays locked

**As a** bidder on this listing,
**I want** the watch control locked as Watching and one alerts toast when the bid bookmarks the listing,
**so that** I am not invited to unwatch money I already put down, and I am not toasted on every revisit.

<!-- trace:case id=g10.auction-listing-page.TC-jhd rev=2 -->
### g10.auction-listing-page.US8-TC1: A first bid locks Watching and says alerts are on once

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-08

**Pre-conditions:**

* customer A has neither watched nor bid on `<listing>`, and is on its page.

**Steps:**

1. Place the next valid bid.
2. Place a further, higher maximum.
3. Try the watch control.

**Expected Results:**

* Step 1 shows one toast that email alerts are on, and the control reads Watching, locked.
* Step 2 shows no alerts toast.
* Step 3 does nothing.

---

## g10.auction-listing-page.US9: Closed listing has no watch control

**As a** collector on a closed listing (sold or unsold),
**I want** no Watch / Watching control,
**so that** I am not invited to watch a sale that has already ended.

<!-- trace:case id=g10.auction-listing-page.TC-84a rev=2 -->
### g10.auction-listing-page.US9-TC1: A closed listing shows no watch control to any viewer

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-09

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-page/listing-page.spec.ts`

**Pre-conditions:**

* `<listing>` has closed; customer A watched it, customer B bid on it.

**Steps:**

1. Open its page signed out, then as customer A, then as customer B.

**Expected Results:**

* No watch control shows to any of them.

---

## g10.auction-listing-page.US10: Collector quotes a published listing

**As a** collector browsing a listing,
**I want** to reference and share a listing by its title and URL,
**so that** I can discuss it with others and return to it easily.

<!-- trace:case id=g10.auction-listing-page.TC-87q rev=4 -->
### g10.auction-listing-page.US10-TC2: No listing code shows on the page, whoever reads it and whatever the listing's state

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-10

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-page/listing-page.spec.ts`

**Pre-conditions:**

* `<listing>` is `<state>`; its code is noted from the admin listing screen; the reader is `<reader>`.

**Test data:**

| `<state>` | `<reader>` |
| --- | --- |
| open | signed out, with scripts off, then on |
| open | customer A, signed in |
| closed, its order open | the winner |

**Steps:**

1. Open `<listing>`'s page and search it for the code.

**Expected Results:**

* The code shows only at the end of the address, with no listing-code or payment-reference field.

---

## g10.auction-listing-page.US11: Collector contacts support about a listing

**As a** collector contacting support about a listing,
**I want** support to quickly identify which listing I'm referring to,
**so that** my inquiry is resolved faster without having to copy listing URLs or titles.

<!-- trace:case id=g10.auction-listing-page.TC-du4 rev=4 -->
### g10.auction-listing-page.US11-TC1: The title and address stay the one reference support and the collector share

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-listing-page-US-11

**Pre-conditions:**

* customer A won `<listing>`, so its order exists; admin(support) is on Listings.

**Steps:**

1. As customer A, read `<listing>`'s page and its order for a reference to quote.
2. As admin, search Listings for the title customer A read.

**Expected Results:**

* Step 1 offers the title and the full address, and no separate code or payment reference.
* Step 2 finds `<listing>` by its title alone, at the same address.

---

## g10.auction-listing-page.US12: Collector sees another bid on the listing without reloading

**As a** collector,
**I want** a bid placed on another page to show on mine with the new price and close, without a reload,
**so that** I bid against the price that stands.

<!-- trace:case id=g10.auction-listing-page.TC-3rf rev=2 -->
### g10.auction-listing-page.US12-TC1: Another session's bid reaches the open page with its price, count, row and the viewer's standing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-12

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-page/live-room.spec.ts`

**Pre-conditions:**

* customer A leads `<listing>` at USD4,960 with a maximum of USD4,960, and has its page open; customer B, email bea@example.com, is on it in another session.

**Steps:**

1. As customer B, place a maximum of USD5,210.
2. As customer A, read the page without reloading.

**Expected Results:**

* Highest bid reads USD5,210 (USD4,960 plus the USD250 step), the bid count rises by one, a Recent bids row arrives with the avatar letter B, and customer A reads Outbid.

<!-- trace:case id=g10.auction-listing-page.TC-b7y rev=2 -->
### g10.auction-listing-page.US12-TC3: A page without its live line still catches up without a reload

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-12

**Pre-conditions:**

* `<listing>` is at USD4,960; customer A's page `<line>`.

**Test data:**

| `<line>` |
| --- |
| never gets a live line, the browser blocking it |
| loses its line, and the tab is hidden until step 2 |

**Steps:**

1. As customer B, place a maximum of USD5,210.
2. As customer A, wait on the page, returning to the tab if hidden.

**Expected Results:**

* Highest bid reads USD5,210 and the bid count includes customer B's bid, with no reload.

<!-- trace:case id=g10.auction-listing-page.TC-0yw rev=2 -->
### g10.auction-listing-page.US12-TC7: A row tied on amount with a row above carries the earlier-leads tip

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-12

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-page/live-room.spec.ts`

**Pre-conditions:**

* `<listing>` is open with no bid, starting at USD1,000; customers A, B and C are on its page in English.

**Test data:**

| `<bids>` | `<tie>` |
| --- | --- |
| customer A, then customer B, each a maximum of USD1,800 | at the current price |
| customer A, then customer B, each USD1,800; then customer C USD2,500 | lower down, below customer C's row |

**Steps:**

1. Place `<bids>` in order.
2. Read the two USD1,800 rows `<tie>`, and hover the Info control.

**Expected Results:**

* customer A's row is first and carries no Info control; customer B's carries one, reading When maximums match, the earlier one leads.

---

## g10.auction-listing-page.US13: Collector reads the same time left as every other page

**As a** collector,
**I want** the listing's countdown to agree with every other page on that listing, whatever my device's clock says,
**so that** the time I see left is the time I have.

<!-- trace:case id=g10.auction-listing-page.TC-o3v rev=2 -->
### g10.auction-listing-page.US13-TC1: The countdown runs on the auction's clock, whatever the device's clock or a pause

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-13

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-page/live-room.spec.ts`

**Pre-conditions:**

* `<listing>` closes about 12 minutes away; customer A has its page open on a device whose clock is `<device clock>`.

**Test data:**

| `<device clock>` | `<interruption>` |
| --- | --- |
| 5 minutes fast | none |
| 5 minutes slow | none |
| right | the tab hidden for 2 minutes |
| right | the device asleep for 2 minutes |
| right | on return, the auction's time is 0.6 seconds earlier than the page assumed |

**Steps:**

1. Read Time left beside a second device with the right clock, through `<interruption>`, for 10 seconds after.

**Expected Results:**

* Both read the same time left, within a second, and it never steps up.

<!-- trace:case id=g10.auction-listing-page.TC-56e rev=2 -->
### g10.auction-listing-page.US13-TC2: The last second never reads 0 while the listing takes bids

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-13

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-page/live-room.spec.ts`

**Pre-conditions:**

* `<listing>` has no bid and closes in under a minute; customer A is on its page.

**Steps:**

1. Read Time left at 0.4 seconds before the close, then just after it.

**Expected Results:**

* At 0.4 seconds it reads 1 second; just after, 0 or Closed.

<!-- trace:case id=g10.auction-listing-page.TC-o30 rev=1 -->
### g10.auction-listing-page.US13-TC5: The deadline names the viewer's zone

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-13

**Pre-conditions:**

* `<listing>` closes at 2027-09-01T12:00:00Z; the browser is set to `<viewer zone>`.

**Test data:**

| `<viewer zone>` | `<deadline reads>` |
| --- | --- |
| Asia/Hong_Kong | 1 Sep 2027, 20:00 HKT |
| America/New_York | 1 Sep 2027, 08:00 EDT |
| Asia/Tokyo | 1 Sep 2027, 21:00 GMT+9 (fixed: no US English short name, so the offset) |

**Steps:**

1. Open `<listing>` and read the deadline beside the countdown, in English and under `/tc`.

**Expected Results:**

* It reads `<deadline reads>` in both languages.

---

## g10.auction-listing-page.US14: Bidder waits on a closed listing for its result

**As a** bidder,
**I want** a listing past its close to read Closed until its result is recorded, then Won or Did not win,
**so that** I am never shown a result the auction has not decided.

<!-- trace:case id=g10.auction-listing-page.TC-ffc rev=2 -->
### g10.auction-listing-page.US14-TC1: Past the close the page reads Closed until the close is recorded, then the recorded result

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-14

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-page/live-room.spec.ts`

**Pre-conditions:**

* customer A leads `<listing>` over customer B, and it closes in a minute; recording the close is `<recording>`.

**Test data:**

| `<recording>` |
| --- |
| prompt |
| held back for 2 minutes |

**Steps:**

1. As customer A and customer B, watch the page through the close and until the close is recorded, without reloading.

**Expected Results:**

* Until recorded both read Closed, with no result and the bid controls disabled; then customer A reads Won and customer B Did not win.

<!-- trace:case id=g10.auction-listing-page.TC-51a rev=3 -->
### g10.auction-listing-page.US14-TC4: A bid that reaches the auction after the close is not a bid

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-14

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-page/live-room.spec.ts`

**Pre-conditions:**

* customer A has never bid on `<listing>`, which is `<listing state>` and closes in under a minute; once loaded, customer A's browser blocks the auction's time, live and listing reads and runs its clock 30 seconds behind, so the bid controls stay enabled.

**Test data:**

| `<listing state>` | `<bid>` | `<after>` |
| --- | --- | --- |
| in extended bidding, led by customer B at USD4,960 | USD5,210 | Highest bid USD4,960, neither Won nor Did not win for customer A |
| open with no bid, starting at USD280 | USD280 | Ended, No bids, neither Won nor Did not win; Time left never read Extended bidding |

**Steps:**

1. Five seconds after the close by the auction's clock, place `<bid>`.
2. Unblock the auction, reload once the close is recorded, and read the page.

**Expected Results:**

* Step 1's bid panel reads "Your bid did not go through." alone.
* Step 2 reads `<after>`.

<!-- trace:case id=g10.auction-listing-page.TC-ecq rev=2 -->
### g10.auction-listing-page.US14-TC6: A later close turns a Closed page back to Extended bidding

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-14

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-page/live-room.spec.ts`

**Pre-conditions:**

* `<listing>` is in extended bidding, led by customer B, its close under a minute away, extension 30 minutes; customer A's page gets live updates 5 seconds late; customer C is on it in another session.

**Steps:**

1. As customer C, place the next valid bid one second before the close.
2. As customer A, watch the page through that close until the update arrives.

**Expected Results:**

* customer A's page first reads Closed with no result and controls disabled, then Extended bidding counting to customer C's bid time plus 30 minutes, controls enabled; it never reads Won, Did not win or Ended, and never reloads.

<!-- trace:case id=g10.auction-listing-page.TC-4ba rev=2 -->
### g10.auction-listing-page.US14-TC7: A sold listing crowns its winning bid, and an unsold one crowns none

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-14

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-page/live-room.spec.ts`

**Pre-conditions:**

* `<listing>` is `<state>` and closes in a minute.

**Test data:**

| `<state>` | `<recent bids after>` |
| --- | --- |
| led by customer A over customer B | customer A's winning row crowned after its amount; no other row |
| open with no bid | no row and no crown |

**Steps:**

1. Read Recent bids before the close, then after it is recorded.

**Expected Results:**

* Before the close no row is crowned; after, `<recent bids after>`.

---

## g10.auction-listing-page.US15: Collector tells Recent Bids rivals apart by avatar letter

**As a** collector,
**I want** each Recent Bids avatar on the listing to show that bidder's email
initial while the label stays Bidder N,
**so that** I can tell who bid what without reading a name or email.

<!-- trace:case id=g10.auction-listing-page.TC-ava rev=2 -->
### g10.auction-listing-page.US15-TC1: Recent bids avatars show each bidder's email letter, the viewer's own row included

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-15

**Pre-conditions:**

* customer A, email ada@example.com, and customer B, email bea@example.com, have each bid on `<listing>`.

**Steps:**

1. As customer A, read Recent bids.

**Expected Results:**

* customer A's row shows A under the You badge; customer B's shows B beside Bidder N, never the email or a name.

---

## g10.auction-listing-page.US16: Collector reads a lot's title and description in their own language

**As a** collector,
**I want** the card and the lot page to show the lot's title and description in the language I browse in,
**so that** I understand the card before I bid on it.

<!-- trace:case id=g10.auction-listing-page.TC-x0c rev=1 -->
### g10.auction-listing-page.US16-TC1: The card and the page read the listing in the page's language, at one address

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-16

**Pre-conditions:**

* `<listing>` is published with English, Traditional and Simplified Chinese titles and descriptions, attribute values typed in English, a campaign, and a first image with no alt text.

**Test data:**

| `<lang>` | `<title>` | `<description>` |
| --- | --- | --- |
| /tc | 寶可夢 噴火龍 PSA 10 | 1999 年基本系列，正面無瑕。 |
| /sc | 宝可梦 喷火龙 PSA 10 | 1999 年基本系列，正面无瑕。 |
| (none) | Charizard PSA 10 | 1999 Base Set, clean front. |

**Steps:**

1. Open `<g10url><lang>/auction` and read `<listing>`'s card, then open it.
2. Turn scripts off and reload.
3. Switch the page language to English with the site's language control.

**Expected Results:**

* Steps 1 and 2 read `<title>` and `<description>`, at the same slug in every language, with no text of another language; the attribute values, the campaign's title and cover copy, and the image's alt text, Charizard PSA 10, read as written in English.
* Step 3 switches the title and description to English at the same slug.

<!-- trace:case id=g10.auction-listing-page.TC-cmf rev=1 covers=g10.auction-listing-page.SC-sbq -->
### g10.auction-listing-page.US16-TC3: A text missing in the page's language falls back to English, one text at a time, never to the other Chinese

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-16

**Pre-conditions:**

* `<listing>` is published titled Charizard PSA 10, described 1999 Base Set, clean front., and also holds `<written>`.

**Test data:**

| `<lang>` | `<written>` | `<title>` | `<description>` |
| --- | --- | --- | --- |
| /tc | A Traditional Chinese title only | 寶可夢 噴火龍 PSA 10 | 1999 Base Set, clean front. |
| /tc | Simplified Chinese texts only | Charizard PSA 10 | 1999 Base Set, clean front. |
| /sc | Traditional Chinese texts only | Charizard PSA 10 | 1999 Base Set, clean front. |
| /tc | No translation | Charizard PSA 10 | 1999 Base Set, clean front. |
| /tc | A Traditional Chinese title saved as spaces | Charizard PSA 10 | 1999 Base Set, clean front. |

**Steps:**

1. Open `<listing>` under `<lang>` and read the title and description.

**Expected Results:**

* They read `<title>` and `<description>`, no area left empty, and the rest of the page reads in the page's language.

<!-- trace:case id=g10.auction-listing-page.TC-k7m rev=1 -->
### g10.auction-listing-page.US16-TC8: The tab title and the link preview follow the page's language, falling back text by text

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-16

**Pre-conditions:**

* `<listing>` is titled Charizard PSA 10 and described 1999 Base Set, clean front., and holds `<written>`.

**Test data:**

| `<written>` | `<preview title>` | `<preview description>` |
| --- | --- | --- |
| A Traditional Chinese title and description | 寶可夢 噴火龍 PSA 10 | 1999 年基本系列，正面無瑕。 |
| A Traditional Chinese title only | 寶可夢 噴火龍 PSA 10 | 1999 Base Set, clean front. |

**Steps:**

1. Open `<listing>` under `/tc` and read the tab title.
2. Paste the same address into a chat app and read the preview.

**Expected Results:**

* The tab title and the preview title include `<preview title>`, and the preview description includes `<preview description>`.

<!-- trace:case id=g10.auction-listing-page.TC-ofr rev=1 covers=g10.auction-listing-page.SC-ex9 -->
### g10.auction-listing-page.US16-TC12: An edited translation shows on the next load and is not pushed to an open page

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-listing-page-US-16

**Pre-conditions:**

* customer is reading `<listing>` under `/tc`, titled 寶可夢 噴火龍 PSA 10; admin(holds auction:operate) can edit it.

**Steps:**

1. As admin, change the Traditional Chinese title to 寶可夢 噴火龍 初版 PSA 10 and Save.
2. As customer, read the title without reloading, then reload.

**Expected Results:**

* Before the reload it still reads 寶可夢 噴火龍 PSA 10; after, 寶可夢 噴火龍 初版 PSA 10.

<!-- trace:case id=g10.auction-listing-page.TC-qnq rev=1 -->
### g10.auction-listing-page.US16-TC14: Every surface but the lot page and its card names a lot by its English title

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-16

**Pre-conditions:**

* customer(signed in) browses in Traditional Chinese; `<listing>` is titled Charizard PSA 10 in English and 寶可夢 噴火龍 PSA 10 in Traditional Chinese, and is `<state>`.

**Test data:**

| `<surface>` | `<state>` |
| --- | --- |
| The Featured carousel | a Featured slide |
| My Auctions | bid on by customer |
| The watchlist | watched by customer |
| Winner Order | won by customer |

**Steps:**

1. Open `<surface>` under `/tc` and find `<listing>`.

**Expected Results:**

* It is named Charizard PSA 10, never 寶可夢 噴火龍 PSA 10.

---

## Settled

- A bid takes no card hold, so no bid is still confirming at the close: a bid is accepted or refused in one answer, and the listing page never reads Authorizing….
- A bid refused past the close is not a bid: the bid form says "Your bid did not go through." and the listing's result is decided as if it was never sent.
- Rows tied on amount are listed the leading or won row first, then the row of the bidder who set that maximum earlier, and keep that order once both are outbid; the tip goes on the row of the later maximum, at any older tie lower down too.
- A lost standing on the bid card is the Did not win badge alone; that the card was not charged is said on My Auctions, never on the listing's card.
- Winner is a primary crown after the amount on a closed sold listing, not a Winner badge.
- A catalogue tile's Ends, Opens and Closed lines name the viewer's zone; the bid card carries a dated deadline beside its countdown, and its closed block names the viewer's zone after a close time with a clock; a close shown as a day alone names none.
- An older bid row's time carries no zone name; activity time reads relative below seven days and as a local moment from seven days.
- A zone name on a tile or a bid card is English in every language - US English short names, HKT for Hong Kong, an offset where US English has none - and the tile's Ends, Opens and Closed words stay English.
- Magnification happens in place under a pointer-following lens; there is no magnifier button or zoom dialog, and a touch pointer raises nothing.

## Reconciliation

- **Covered at domain** - `g10.auction-dmn.US9-TC1` walks the not-found and reused-address rows of `grade10-site-auction-listing-page-US-03` beside the catalogue; `g10.auction-dmn.US7-TC3` walks a scheduled close turning to Extended bidding on the open page without a reload
