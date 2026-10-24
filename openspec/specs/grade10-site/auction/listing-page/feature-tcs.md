# grade10-site/auction/listing-page Test Cases

**Status:** reopened · 0/58
**Reviewed:** 2026-09-01, lapsed 2026-09-29
**Drafts styled:** 2026-10-24, tcs-rules r7
**Regenerated:** 2026-10-24, tcs-rules r7
**Out of suite (unit):**
- `grade10-site-auction-listing-page-SC-75` - a page language the brand has no field for is a mapping in the views, not a route a collector walks

## Background

* `<g10url>` is the Grade10 site of the environment under test; a listing's page is `<g10url>/auction/listings/<slug>`, with `/tc` or `/sc` before `/auction` for Traditional or Simplified Chinese. `<auction url>` is the auction catalogue and `<my auctions url>` the signed-in account's My Auctions page.
* A listing's code is read on its admin listing screen. A link preview is read by pasting an address into a chat app that unfurls links.
* Every listing is priced in USD: +USD100 from USD1,000, +USD250 from USD2,500.

## Walk 1: Watch, unwatch, undo and bid on one listing

Starting state:

- customer(signed in, card linked) is on `<listing_12>`'s page, has not bid on it and does not watch it.

Shared test data:

| Field | Value |
| --- | --- |
| listing_12 | An open USD listing taking bids |
| first bid | The next valid bid the bid panel shows |

### Route

1. Note the current bid, time left and bid panel, then select Watch.
   - The control reads Watching, and a toast says email alerts are on, offering View My Auctions. `g10.auction-listing-page.US6-TC1`
   - Current bid, time left and the bid panel are unchanged. `g10.auction-listing-page.US6-TC1`
2. Select View My Auctions in the toast.
   - My Auctions lists `<listing_12>` once, Your Standing `--`, its email alerts switch on. `g10.auction-listing-page.US6-TC1`
3. Go back to `<listing_12>` and select Watching.
   - The control reads Watch, and a toast says the listing left My Auctions, offering Undo. `g10.auction-listing-page.US7-TC1`
   - Current bid, time left and the bid panel are unchanged. `g10.auction-listing-page.US7-TC1`
4. Select Undo, then open `<my auctions url>` in a new tab.
   - The control reads Watching again. `g10.auction-listing-page.US7-TC2`
   - My Auctions lists `<listing_12>` once, Your Standing `--`, its email alerts switch on. `g10.auction-listing-page.US7-TC2`
5. Select Watching to unwatch, then place `<first bid>` from the bid panel.
   - A toast says email alerts are on, and the control reads Watching, disabled. `g10.auction-listing-page.US8-TC1`
6. Select Watching, then reload the page.
   - Nothing changes and no Unwatch toast shows; after the reload the control still reads Watching, disabled, with no alerts toast. `g10.auction-listing-page.US8-TC1`

## Walk 2: A rival's bid reaches the leader's open page

Starting state:

- customer A(signed in, email ada@example.com) leads `<listing_8>` at `<current bid>` with maximum `<customer A maximum>`, and is on its page.
- customer B(signed in, card linked, email bob@example.com) is on the same page in a separate session.

Shared test data:

| Field | Value |
| --- | --- |
| listing_8 | An open USD listing with two bids, its scheduled close more than an hour away |
| current bid | USD1,200 (range: 100000–124999 minor units) |
| customer A maximum | USD1,275 (range: 120000–129999 minor units) |
| customer B maximum | USD1,300 (fixed: the minimum next bid, above `<customer A maximum>`) |
| highest bid after | USD1,300 (fixed derived): `<customer A maximum>` plus USD100, capped at `<customer B maximum>` |
| minimum next bid | USD1,400 (fixed derived): `<highest bid after>` plus USD100 |

### Route

1. As customer A, read the standing.
   - It reads Leading, with Your maximum `<customer A maximum>`. `g10.auction-listing-page.US12-TC5`
2. As customer B, enter `<customer B maximum>` in the custom maximum and confirm the bid.
3. As customer A, without reloading, read the bid panel and Recent Bids.
   - Highest bid reads `<highest bid after>` and the bid count rose by one, with no reload. `g10.auction-listing-page.US12-TC1`
   - The standing reads Outbid, and the next valid bid is `<minimum next bid>`. `g10.auction-listing-page.US12-TC5`
   - customer B's new row arrived without a reload, its avatar showing B and its label a listing pseudonym, not an email. `g10.auction-listing-page.US12-TC9`
   - customer A's row shows avatar A, customer B's shows B, and neither shows an email or a personal name. `g10.auction-listing-page.US15-TC1`

## Walk 3: Read one listing in three languages

Starting state:

- customer is on `<g10url>/tc/auction`.
- `<listing_1>` is published and live, with its title and description written in English, Traditional Chinese and Simplified Chinese.

Shared test data:

| Field | Value |
| --- | --- |
| listing_1 | A published, live listing, slug `<slug_1>` |
| slug_1 | The address built from the English title and the listing code |
| english title | Charizard PSA 10 |
| english description | 1999 Base Set, clean front. |
| traditional title | 寶可夢 噴火龍 PSA 10 |
| traditional description | 1999 年基本系列，正面無瑕。 |
| simplified title | 宝可梦 喷火龙 PSA 10 |
| simplified description | 1999 年基本系列，正面无瑕。 |

### Route

1. Select `<listing_1>`'s card and read the address, the title, the description and the browser tab's title.
   - The address ends `/tc/auction/listings/<slug_1>`, built from the English title. `g10.auction-listing-page.US16-TC11`
   - The page reads `<traditional title>` and `<traditional description>`, with no text of another language. `g10.auction-listing-page.US16-TC1`
   - The tab's title includes `<traditional title>`. `g10.auction-listing-page.US16-TC8`
2. Choose Simplified Chinese in the site's language choice.
   - The page reads `<simplified title>` and `<simplified description>` at the `/sc` address with the same `<slug_1>`. `g10.auction-listing-page.US16-TC13`
3. Choose English in the site's language choice.
   - The page reads `<english title>` and `<english description>` at the unprefixed address with the same `<slug_1>`. `g10.auction-listing-page.US16-TC13`

## Walk 4: Follow a released address to its new holder

Starting state:

- customer saved `<reused address>` before `<original listing>` was called off; `<replacement listing>` is published at it.
- customer is on `<auction url>` in a browser that can turn JavaScript off and on.

Shared test data:

| Field | Value |
| --- | --- |
| original listing | A called-off listing |
| replacement listing | A published listing with its own title, description and bids, holding the released slug |
| reused address | The address both listings held |

### Route

1. With JavaScript on, open the saved link from the catalogue session.
   - The page shows `<replacement listing>`'s content and standing at `<reused address>`, with nothing of `<original listing>`. `g10.auction-listing-page.US1-TC4`
2. Turn JavaScript off and reload `<reused address>`.
   - The page shows `<replacement listing>`'s title, description and standing, with no redirect and no called-off page. `g10.auction-listing-page.US1-TC3`
3. Turn JavaScript on, reload, and paste `<reused address>` into a chat app.
   - The page keeps `<replacement listing>`'s title, description and standing, with no placeholder over them. `g10.auction-listing-page.US1-TC3`
   - The preview's title, description and address name `<replacement listing>` and `<reused address>`. `g10.auction-listing-page.US1-TC3`

## g10.auction-listing-page.US1: Collector opens a listing at its own address

**As a** collector,
**I want** a listing's address to answer with that listing's own page in the response
HTML,
**so that** I can read its name, its description and where its bidding stands
without waiting for a script to run.

<!-- trace:case id=g10.auction-listing-page.TC-2it rev=4 -->
### g10.auction-listing-page.US1-TC3: A reused address serves only its current holder

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
* **Trace:** grade10-site-auction-listing-page-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-page/listing-page.spec.ts`

**Pre-conditions:**

* customer saved `<reused address>` before `<original listing>` was called off.
* `<replacement listing>` holds the address and is `<replacement state>`.
* customer's browser has JavaScript turned off.

**Test data:**

| `<replacement state>` |
| --- |
| Published and open to collectors |
| Closed |
| Settled |

| Field | Value |
| --- | --- |
| `<original listing>` | A called-off listing with its own title and description |
| `<replacement listing>` | The listing now holding the released slug, with its own title, description and standing |
| `<reused address>` | The address both listings held |

**Steps:**

1. Open `<reused address>` and read the page and the browser tab's title.
2. Paste `<reused address>` into a chat app and read the preview.
3. Turn JavaScript on, reload and read the page.

**Expected Results:**

* Step 1 shows `<replacement listing>`'s title, description and standing, with no redirect, no called-off page and nothing of `<original listing>`.
* Step 2's preview names `<replacement listing>` and `<reused address>`.
* Step 3 keeps the same title, description and standing, with no placeholder or old content over them.
* No step shows a separate listing-code or payment-reference field; a code shows only at the end of the address.

<!-- trace:case id=g10.auction-listing-page.TC-tof rev=3 -->
### g10.auction-listing-page.US1-TC4: Opening a released address from the catalogue shows its new holder

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-01

**Pre-conditions:**

* customer saved `<reused address>` before `<original listing>` was called off; `<replacement listing>` is published at it.
* customer is on `<auction url>` with JavaScript on, and the saved link is in this session.

**Test data:**

| Field | Value |
| --- | --- |
| `<original listing>` | A called-off listing with its own title and description |
| `<replacement listing>` | The published listing holding the released slug |
| `<reused address>` | The address both listings held |

**Steps:**

1. Open the saved link from the catalogue session.
2. Reload `<reused address>`.

**Expected Results:**

* Step 1 shows `<replacement listing>`'s content and standing, and the address stays `<reused address>`.
* Step 2 shows the same `<replacement listing>`, with no redirect or called-off page.
* Neither step shows anything of `<original listing>` or a separate listing-code field.

---

## g10.auction-listing-page.US2: Collector shares a listing link

**As a** collector,
**I want** a listing link to unfurl as that listing and its own canonical address,
**so that** a link I pass on names the listing it points at instead of the auction
catalogue.

<!-- trace:case id=g10.auction-listing-page.TC-89i rev=2 -->
### g10.auction-listing-page.US2-TC1: A shared listing link unfurls as that listing

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

**Test data:**

| Field | Value |
| --- | --- |
| `<listing>` | A published listing |
| `<listing address>` | `<listing>`'s address |

**Steps:**

1. Paste `<listing address>` into a chat app and read the preview.

**Expected Results:**

* The preview's title and description name `<listing>`, and its address is `<listing address>`.
* The preview does not name the auction catalogue in their place.

---

## g10.auction-listing-page.US3: Collector opens an address that names no listing

**As a** collector,
**I want** an address under the auction's listings that names no published listing to
answer with the site's not-found surface,
**so that** I am never shown an empty listing page or the catalogue in its place.

<!-- trace:case id=g10.auction-listing-page.TC-3xv rev=2 -->
### g10.auction-listing-page.US3-TC1: An unknown listing address shows Page not found

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-03

**Pre-conditions:**

* No published listing or holder answers at `<unknown address>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<unknown address>` | `<g10url>/auction/listings/no-such-listing` (any slug no listing holds) |

**Steps:**

1. Open `<unknown address>`.

**Expected Results:**

* The site's Page not found screen shows, not an empty listing page.

<!-- trace:case id=g10.auction-listing-page.TC-6r8 rev=2 -->
### g10.auction-listing-page.US3-TC2: A published listing's address shows its page

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-03

**Pre-conditions:**

* `<listing>` is published.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing>` | A published listing |

**Steps:**

1. Open `<listing>`'s address.

**Expected Results:**

* `<listing>`'s own page shows.

<!-- trace:case id=g10.auction-listing-page.TC-pdz rev=5 -->
### g10.auction-listing-page.US3-TC3: An address no eligible listing holds shows Page not found

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-03

**Pre-conditions:**

* customer saved `<original address>`, and for a called-off row watched the listing before it was called off.
* The original listing is `<state>`, and no eligible published listing holds its slug.
* customer's browser has JavaScript turned off.

**Test data:**

| `<state>` | `<original address>` |
| --- | --- |
| A draft, never published | The draft's address |
| Called off in this pass | Its saved address |
| Called off before this release | Its saved address |
| Called off, its slug saved by a new unpublished draft | The shared slug's address |
| Called off, its slug held by a created, unpublished replacement | The shared slug's address |

| Field | Value |
| --- | --- |
| `<code>` | The original listing's code |

**Steps:**

1. Open `<original address>`.
2. Open `<g10url>/auction/listings/<code>`.
3. Open the watchlist, then search the catalogue for the original listing.

**Expected Results:**

* Steps 1 and 2 show Page not found, with nothing of the original listing or an unpublished replacement, its code or a payment reference, and no redirect, empty listing page or catalogue in its place.
* Step 3 shows neither the original listing nor an unpublished replacement.

<!-- trace:case id=g10.auction-listing-page.TC-x03 rev=3 -->
### g10.auction-listing-page.US3-TC4: Opening an ineligible released address from the catalogue shows Page not found

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

* customer is on `<auction url>` with JavaScript on, with a saved link to `<released address>` in this session.
* `<original listing>` is called off, and `<holder state>`.

**Test data:**

| `<holder state>` |
| --- |
| No listing holds the released slug |
| A new unpublished draft holds the released slug |
| A created, unpublished replacement holds the released slug |

| Field | Value |
| --- | --- |
| `<original listing>` | The called-off listing that held `<released address>` |
| `<released address>` | `<original listing>`'s former address |
| `<code>` | `<original listing>`'s code |

**Steps:**

1. Open the saved link from the catalogue session.
2. Reload the address.
3. From the catalogue session, open `<g10url>/auction/listings/<code>`, then reload it.

**Expected Results:**

* Steps 1, 2 and 3 each show Page not found, with nothing of `<original listing>` or the unpublished holder and no listing code.
* No redirect, empty listing page or catalogue shows in its place.

---

## g10.auction-listing-page.US4: Collector reads a live listing while scripts load

**As a** collector,
**I want** the listing I was served to stay on screen once scripts finish loading,
**so that** nothing I was reading blanks into a placeholder and no value
disagrees with what the document carried.

<!-- trace:case id=g10.auction-listing-page.TC-wka rev=2 -->
### g10.auction-listing-page.US4-TC1: The served listing stays on screen once scripts load

**Classification:**

* **Severity:** major
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

* `<listing>` is published and open, and no bid is placed on it during the pass.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing>` | A published, open listing with bids |

**Steps:**

1. With JavaScript off, open `<listing>`'s page and note its name, description and standing.
2. Turn JavaScript on, reload, and read the same fields as the page finishes loading.

**Expected Results:**

* Step 2 shows the same listing with the name, description and standing noted at step 1.
* None of them is replaced by a loading placeholder.

<!-- trace:case id=g10.auction-listing-page.TC-e6y rev=2 -->
### g10.auction-listing-page.US4-TC2: Time left carries on from the served value

**Classification:**

* **Severity:** major
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

* `<listing>` is open and shows a countdown.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing>` | An open listing whose close is 10 minutes away (range: 2–60 minutes) |

**Steps:**

1. With JavaScript off, open `<listing>`'s page and note Time left.
2. Turn JavaScript on, reload, and read Time left as the page finishes loading.

**Expected Results:**

* Step 2's Time left carries on from step 1's, never jumping back up or blanking.

---

## g10.auction-listing-page.US5: Collector reaches a listing from the catalogue

**As a** collector,
**I want** to open a listing's own address from the catalogue without a page load,
**so that** the listing I picked out of the list is the page I land on.

<!-- trace:case id=g10.auction-listing-page.TC-fe3 rev=2 -->
### g10.auction-listing-page.US5-TC1: The catalogue opens a listing at its own address

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-05

**Pre-conditions:**

* customer is on `<auction url>`, which lists `<listing>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing>` | A published listing |

**Steps:**

1. Select `<listing>`'s card.

**Expected Results:**

* The browser is at `<listing>`'s address, showing its page, without a full page load.

---

## g10.auction-listing-page.US6: Watch an auction and open My Auctions from the toast

**As a** collector on a listing I have not bid on,
**I want** Watching to tell me email alerts are on and offer My Auctions,
**so that** I know how to manage that listing without hunting for the account page.

<!-- trace:case id=g10.auction-listing-page.TC-4op rev=2 -->
### g10.auction-listing-page.US6-TC1: Watching announces alerts on and opens My Auctions

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

* customer(signed in) is on `<listing_12>`'s page, has not bid on it and does not watch it.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_12>` | An open listing taking bids |

**Steps:**

1. Note the current bid, time left and bid panel, then select Watch.
2. Select View My Auctions in the toast.

**Expected Results:**

* Step 1: the control reads Watching, and a toast says email alerts are on, offering View My Auctions.
* Step 1 leaves the current bid, time left and bid panel unchanged.
* Step 2 opens My Auctions, listing `<listing_12>` once, Your Standing `--`, its email alerts switch on.

---

## g10.auction-listing-page.US7: Unwatch from the auction and undo

**As a** collector who watched a listing without bidding,
**I want** Unwatch to confirm alerts are off and let me Undo,
**so that** a mis-tap does not force me to find the listing again.

<!-- trace:case id=g10.auction-listing-page.TC-pjv rev=2 -->
### g10.auction-listing-page.US7-TC1: Unwatching removes the listing from My Auctions

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-07

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-page/listing-page.spec.ts`

**Pre-conditions:**

* customer(signed in) watches `<listing_13>` with email alerts on, has not bid on it, and is on its page.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_13>` | An open listing taking bids |

**Steps:**

1. Select Watching.
2. Open `<my auctions url>` in a new tab.

**Expected Results:**

* Step 1: the control reads Watch, and a toast says the listing left My Auctions, offering Undo.
* Step 1 leaves the current bid, time left and bid panel unchanged.
* Step 2 does not list `<listing_13>`.

<!-- trace:case id=g10.auction-listing-page.TC-i5l rev=2 -->
### g10.auction-listing-page.US7-TC2: Undo restores the watch with alerts on

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-07

**Pre-conditions:**

* customer(signed in) watches `<listing_13>` with email alerts on, has not bid on it, and is on its page.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_13>` | An open listing taking bids |

**Steps:**

1. Select Watching, then Undo in the toast.
2. Open `<my auctions url>` in a new tab.

**Expected Results:**

* Step 1 leaves the control reading Watching.
* Step 2 lists `<listing_13>` once, Your Standing `--`, its email alerts switch on.

---

## g10.auction-listing-page.US8: After bidding, Watching stays locked

**As a** bidder on this listing,
**I want** the watch control locked as Watching and one alerts toast when the bid bookmarks the listing,
**so that** I am not invited to unwatch money I already put down, and I am not toasted on every revisit.

<!-- trace:case id=g10.auction-listing-page.TC-jhd rev=2 -->
### g10.auction-listing-page.US8-TC1: A first bid locks Watching and toasts alerts once

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

* customer(signed in, card linked) is on `<listing_14>`'s page, does not watch it and has not bid on it.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_14>` | An open listing taking bids |
| `<first bid>` | The next valid bid the bid panel shows |

**Steps:**

1. Place `<first bid>` from the bid panel.
2. Select Watching.
3. Reload the page.

**Expected Results:**

* Step 1: a toast says email alerts are on, and the control reads Watching, disabled.
* Step 2 changes nothing and shows no Unwatch toast.
* Step 3: the control still reads Watching, disabled, and no alerts toast shows.

---

## g10.auction-listing-page.US9: Closed listing has no watch control

**As a** collector on a closed listing (sold or unsold),
**I want** no Watch / Watching control,
**so that** I am not invited to watch a sale that has already ended.

<!-- trace:case id=g10.auction-listing-page.TC-84a rev=2 -->
### g10.auction-listing-page.US9-TC1: A closed listing shows no watch control to any viewer

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
* **Trace:** grade10-site-auction-listing-page-US-09

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-page/listing-page.spec.ts`

**Pre-conditions:**

* The listing is `<state>`, and `<viewer>` opens it.

**Test data:**

| `<state>` | `<viewer>` |
| --- | --- |
| Sold, with a winner | customer(signed in, never watched or bid on it) |
| Sold, with a winner | customer(signed in, watched it before the close, no bid) |
| Sold, with a winner | customer(signed in, bid on it and lost) |
| Sold, with a winner | customer(signed out) |
| Ended with no bids | customer(signed in, watched it before the close) |
| Ended with no bids | customer(signed out) |

**Steps:**

1. Open the listing's page and read the image area and the bid panel area.

**Expected Results:**

* The listing page shows, and no Watch or Watching control shows anywhere on it.

---

## g10.auction-listing-page.US10: Collector quotes a published listing

**As a** collector browsing a listing,
**I want** to reference and share a listing by its title and URL,
**so that** I can discuss it with others and return to it easily.

<!-- trace:case id=g10.auction-listing-page.TC-87q rev=4 -->
### g10.auction-listing-page.US10-TC2: No listing code shows on the page before or after it loads

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-10

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-page/listing-page.spec.ts`

**Pre-conditions:**

* `<listing>` is published at its own address, and its standing stays unchanged during the pass.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing>` | A published listing |
| `<listing code>` | `<listing>`'s code, read on its admin listing screen |

**Steps:**

1. With JavaScript off, open `<listing>`'s page and note its title, description and standing.
2. Turn JavaScript on, reload, and read the page, its tab title and the address bar.
3. Search the page for `<listing code>`.

**Expected Results:**

* Step 2 keeps the title, description and standing noted at step 1, with no placeholder over them.
* No step shows a separate listing-code or payment-reference field.
* Step 3 finds `<listing code>` only at the end of the address.

<!-- trace:case id=g10.auction-listing-page.TC-cbx rev=2 -->
### g10.auction-listing-page.US10-TC7: A listing code is not an address

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-10

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-page/listing-page.spec.ts`

**Pre-conditions:**

* `<listing>` is published.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing>` | A published listing |
| `<listing code>` | `<listing>`'s code, read on its admin listing screen |

**Steps:**

1. Open `<g10url>/auction/listings/<listing code>`.

**Expected Results:**

* The site's Page not found screen shows, the same as for any address naming no listing, not `<listing>`'s page.

<!-- trace:case id=g10.auction-listing-page.TC-udv rev=2 -->
### g10.auction-listing-page.US10-TC8: No listing code shows whether the collector is signed in or not

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-10

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-page/listing-page.spec.ts`

**Pre-conditions:**

* `<listing>` is published.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing>` | A published listing |
| `<listing code>` | `<listing>`'s code, read on its admin listing screen |

**Steps:**

1. Signed out, open `<listing>`'s page and search it for `<listing code>`.
2. Signed in as a collector, open the same address and search again.

**Expected Results:**

* Neither view shows a labelled listing-code or payment-reference field; the address may end in the lower-case code.
* Both views show the same title and address.

<!-- trace:case id=g10.auction-listing-page.TC-6de rev=3 -->
### g10.auction-listing-page.US10-TC9: No listing code shows once an order exists on the listing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-10

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-page/listing-page.spec.ts`

**Pre-conditions:**

* `<listing>` closed with a winner, so an order exists on it.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing>` | A closed listing with an order |
| `<listing code>` | `<listing>`'s code, which is also the order's payment reference |

**Steps:**

1. Open `<listing>`'s page and read it, its tab title and the address bar.
2. Paste the address into a chat app and read the preview.

**Expected Results:**

* Neither the page nor the preview shows a labelled listing-code or payment-reference field.
* `<listing code>` shows only as the lower-case end of the address, and the title and description carry neither.
* Both name the same listing and its full address.

<!-- trace:case id=g10.auction-listing-page.TC-y7l rev=3 -->
### g10.auction-listing-page.US10-TC10: An address naming no listing shows no listing code

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-10

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-page/listing-page.spec.ts`

**Pre-conditions:**

* No published listing or holder answers at `<unknown address>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<unknown address>` | `<g10url>/auction/listings/no-such-listing` (any slug no listing holds) |

**Steps:**

1. Open `<unknown address>` and read the page, including any error detail.

**Expected Results:**

* Page not found shows, with no listing code, listing content or payment reference.

<!-- trace:case id=g10.auction-listing-page.TC-90g rev=4 -->
### g10.auction-listing-page.US10-TC11: Closed and settled listings keep their public addresses

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-10

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-page/listing-page.spec.ts`

**Pre-conditions:**

* `<listing>` was published at `<listing address>`, then closed or settled, and was never called off or deleted.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing>` | A closed or settled listing |
| `<listing address>` | The address `<listing>` was published at |
| `<listing code>` | `<listing>`'s code |

**Steps:**

1. Open `<listing address>`.
2. Paste `<listing address>` into a chat app and read the preview.

**Expected Results:**

* Step 1 shows `<listing>`'s page, identified by its title and address.
* Step 2's preview names `<listing>` and `<listing address>`.
* `<listing code>` shows only as the end of `<listing address>`.

---

## g10.auction-listing-page.US11: Collector contacts support about a listing

**As a** collector contacting support about a listing,
**I want** support to quickly identify which listing I'm referring to,
**so that** my inquiry is resolved faster without having to copy listing URLs or titles.

<!-- trace:case id=g10.auction-listing-page.TC-du4 rev=4 -->
### g10.auction-listing-page.US11-TC1: Support finds a listing by its title, with no code to ask for

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-11

**Pre-conditions:**

* `<listing>` is published.
* admin(support) is on the Auction listings page of the admin console.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing>` | A published listing |

**Steps:**

1. As a collector, open `<listing>`'s page and read its title and address.
2. As admin, search the listings for that title and open the match.

**Expected Results:**

* Step 1 gives the title and full address, and no separate code or payment reference.
* Step 2 finds `<listing>` by its title alone and identifies the same listing by title and address.

<!-- trace:case id=g10.auction-listing-page.TC-h6y rev=3 -->
### g10.auction-listing-page.US11-TC3: The title and address stay the collector's only reference once an order exists

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-11

**Pre-conditions:**

* `<listing>` closed with a winner, so an order exists on it.
* admin(support) is on the Auction listings page of the admin console.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing>` | A closed listing with an order |

**Steps:**

1. As a collector, open `<listing>`'s page and note its title and address.
2. As admin, search the listings for that title and open the match.

**Expected Results:**

* Step 1's title and address are unchanged by the order, and the page shows no labelled listing-code or payment-reference field.
* Step 2 finds the same listing without a code.

<!-- trace:case id=g10.auction-listing-page.TC-wxd rev=2 -->
### g10.auction-listing-page.US11-TC2: A listing code known from elsewhere gives no working link

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-11

**Retirement:** The same claim on the same surface from the same starting state as `g10.auction-listing-page.US10-TC7`; replaced by `g10.auction-listing-page.US10-TC7`

**Pre-conditions:**

* A published listing exists and its listing code is known from a leak or from another surface.

**Steps:**

1. Attempt to open the listing's address by substituting `<listing_code>` for the listing's usual identifier.

**Expected Results:**

* The listing code does not resolve to the listing.
* No working link to the listing can be built from the code alone.

<!-- trace:case id=g10.auction-listing-page.TC-sa9 rev=3 -->
### g10.auction-listing-page.US11-TC4: Called-off listing remains directly accessible

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-11

**Retirement:** Permanent called-off access is replaced by the released-address cases; replaced by `g10.auction-listing-page.US3-TC3`, `g10.auction-listing-page.US3-TC4`

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

## g10.auction-listing-page.US12: Collector sees another bid on the listing without reloading

**As a** collector,
**I want** a bid placed on another page to show on mine with the new price and close, without a reload,
**so that** I bid against the price that stands.

<!-- trace:case id=g10.auction-listing-page.TC-3rf rev=2 -->
### g10.auction-listing-page.US12-TC1: Another session's bid shows its price and bid count without a reload

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

* `<listing_1>` is open with Highest bid `<current bid>` and `<bid count>` bids, its scheduled close more than an hour away.
* customer A is on `<listing_1>`'s page; customer B(card linked) is on it in a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | An open USD listing with bids |
| `<current bid>` | USD4,960 (range: 250000–499999 minor units, the USD2,500 tier) |
| `<bid count>` | 3 (range: 1–20) |
| `<bid amount>` | USD5,210 (fixed derived): `<current bid>` plus USD250, the minimum next bid |

**Steps:**

1. As customer B, enter `<bid amount>` in the custom maximum and confirm the bid.
2. As customer A, without reloading, read Highest bid, the bid count and Time left.

**Expected Results:**

* Highest bid reads `<bid amount>` and the bid count reads `<bid count>` plus 1.
* Time left still counts to the scheduled close.
* customer A's page did not reload.

<!-- trace:case id=g10.auction-listing-page.TC-5ps rev=3 covers=g10.auction-listing-page.SC-7c2 -->
### g10.auction-listing-page.US12-TC5: The leader's own standing turns to Outbid without a reload

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-12

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-page/live-room.spec.ts`

**Pre-conditions:**

* customer A(signed in) leads `<listing_8>` at `<current bid>` with maximum `<customer A maximum>`, and is on its page.
* customer B(card linked) is on the same page in a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_8>` | An open USD listing, its scheduled close more than an hour away |
| `<current bid>` | USD1,200 (range: 100000–124999 minor units) |
| `<customer A maximum>` | USD1,275 (range: 120000–129999 minor units) |
| `<customer B maximum>` | USD1,300 (fixed: the minimum next bid, above `<customer A maximum>`) |
| `<highest bid after>` | USD1,300 (fixed derived): `<customer A maximum>` plus USD100, capped at `<customer B maximum>` |
| `<minimum next bid>` | USD1,400 (fixed derived): `<highest bid after>` plus USD100 |

**Steps:**

1. As customer A, read the standing.
2. As customer B, enter `<customer B maximum>` in the custom maximum and confirm the bid.
3. As customer A, without reloading, read the standing, Highest bid and the next valid bid.

**Expected Results:**

* Step 1 reads Leading, with Your maximum `<customer A maximum>`.
* Step 3 reads Outbid with no reload, Highest bid `<highest bid after>`, and `<minimum next bid>` as the next valid bid.

<!-- trace:case id=g10.auction-listing-page.TC-avc rev=2 -->
### g10.auction-listing-page.US12-TC9: A live bid arrives with its email avatar letter

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

* customer A is on `<listing_17>`'s page.
* customer B(card linked, email `<customer B email>`) can bid on `<listing_17>` from a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_17>` | An open USD listing |
| `<customer B email>` | mike@example.com |
| `<avatar letter>` | M (fixed derived): the first letter of `<customer B email>` |

**Steps:**

1. As customer B, place an accepted bid on `<listing_17>`.
2. As customer A, without reloading, find customer B's new Recent Bids row.

**Expected Results:**

* The new row appears without a reload.
* Its avatar shows `<avatar letter>`, and its label is a listing pseudonym, not an email.

---

## g10.auction-listing-page.US13: Collector reads the same time left as every other page

**As a** collector,
**I want** the listing's countdown to agree with every other page on that listing, whatever my device's clock says,
**so that** the time I see left is the time I have.

<!-- trace:case id=g10.auction-listing-page.TC-o3v rev=2 -->
### g10.auction-listing-page.US13-TC1: The countdown agrees across devices whose clocks disagree

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

* `<listing_3>` is open, its close about 12 minutes away.
* customer A is on its page on a device whose clock is `<device skew>`; customer B is on it on a device whose clock is right.

**Test data:**

| `<device skew>` |
| --- |
| 4 minutes ahead |
| 4 minutes behind |

| Field | Value |
| --- | --- |
| `<listing_3>` | An open USD listing |

**Steps:**

1. Read Time left on both pages at the same moment.
2. Wait 45 seconds, then read both again at the same moment.

**Expected Results:**

* At steps 1 and 2 both pages read the same Time left, to the second.
* Neither page is off by `<device skew>`.

<!-- trace:case id=g10.auction-listing-page.TC-56e rev=2 -->
### g10.auction-listing-page.US13-TC2: The last second never reads 0 while the listing takes bids

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-13

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-page/live-room.spec.ts`

**Pre-conditions:**

* `<listing_4>` is open with no accepted bid, its close under a minute away, and customer A is on its page.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_4>` | An open USD listing with no bids |
| `<last moment>` | 0.4 seconds before the close (range: 0.01–0.99 seconds) |

**Steps:**

1. Watch Time left from 10 seconds before the close.
2. Read Time left at `<last moment>`.
3. Read Time left just after the close passes.

**Expected Results:**

* Through step 1 Time left shows whole seconds only.
* Step 2 reads 1 second, never 0.
* Step 3 reads 0 or Closed.

<!-- trace:case id=g10.auction-listing-page.TC-iu2 rev=2 -->
### g10.auction-listing-page.US13-TC3: The countdown corrects itself after the page was away

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
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

* `<listing_3>` is open, its close about 12 minutes away.
* customer A is on its page; customer B is on it on a device whose clock is right.

**Test data:**

| `<away>` |
| --- |
| customer A's device sleeps for 45 seconds |
| customer A's browser goes offline for 45 seconds, then reconnects |
| customer A switches to another tab for 45 seconds, then back |

| Field | Value |
| --- | --- |
| `<listing_3>` | An open USD listing |
| `<clock change>` | customer A's device clock moved 90 seconds forward |

**Steps:**

1. Apply `<clock change>` while `<away>`.
2. Return to the page without reloading, and read Time left on both pages at the same moment.

**Expected Results:**

* Both pages read the same Time left, to the second.

<!-- trace:case id=g10.auction-listing-page.TC-ncg rev=2 -->
### g10.auction-listing-page.US13-TC4: A sub-second correction never makes the countdown jump up

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-13

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-page/live-room.spec.ts`

**Pre-conditions:**

* `<listing_3>` is open, its close about 12 minutes away, and customer A is on its page.
* The auction service's time read on customer A's return is `<correction>` earlier than the page assumes.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_3>` | An open USD listing |
| `<correction>` | 0.6 seconds (range: 0.01–0.99 seconds) |

**Steps:**

1. Switch to another tab, then back to the page.
2. Watch Time left for 5 seconds.

**Expected Results:**

* Time left never reads higher than it read the moment before.

---

## g10.auction-listing-page.US14: Bidder waits on a closed listing for its result

**As a** bidder,
**I want** a listing past its close to read Closed until its result is recorded, then Won or Did not win,
**so that** I am never shown a result the auction has not decided.

<!-- trace:case id=g10.auction-listing-page.TC-ffc rev=2 -->
### g10.auction-listing-page.US14-TC1: Closed shows until the close is recorded, then the result

Runs once per row of **Test data**.

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-14

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-page/live-room.spec.ts`

**Pre-conditions:**

* `<listing_18>` is `<state>`, its close under a minute away, and nobody bids again.
* `<viewer>` is signed in and on its page.

**Test data:**

| `<state>` | `<viewer>` | `<result>` |
| --- | --- | --- |
| Led by customer A | customer A | Won |
| Led by customer A, customer B outbid | customer B | Did not win |
| Open with no accepted bid | customer A | Ended, with No bids under it |

| Field | Value |
| --- | --- |
| `<listing_18>` | A USD listing in `<state>` |

**Steps:**

1. Watch the listing through its close, without reloading, until the result shows.

**Expected Results:**

* Once the close passes the page reads Closed with no result.
* The page then reads `<result>`, without a reload.

<!-- trace:case id=g10.auction-listing-page.TC-iet rev=2 -->
### g10.auction-listing-page.US14-TC2: A delayed close keeps Closed and never guesses a result

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

* customer A leads `<listing_6>` and is on its page; its close is under a minute away, and nobody bids again.
* Recording `<listing_6>`'s close is held back until the next sweep.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_6>` | A USD listing led by customer A |

**Steps:**

1. Watch the listing through its close, without reloading.
2. Wait 30 seconds, then reload.
3. Wait until the close is recorded.

**Expected Results:**

* Through steps 1 and 2 the page reads Closed with no result, never Won, Did not win or Ended.
* After step 3 the page reads Won, without a reload.

<!-- trace:case id=g10.auction-listing-page.TC-51a rev=3 -->
### g10.auction-listing-page.US14-TC4: A bid that reaches the auction after the close reads in existing words

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

* customer B leads `<listing_9>` at `<leader price>`, its close under a minute away.
* customer A(card linked) is signed in on `<listing_9>`'s page and has never bid on it.
* Once the page has loaded, customer A's browser blocks the auction's time, live and listing reads, and its clock runs `<clock lag>` behind, so its bid controls stay enabled past the close.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_9>` | A USD listing in extended bidding, led by customer B, no cap |
| `<leader price>` | USD4,960 (range: 250000–499999 minor units) |
| `<bid amount>` | USD5,210 (fixed derived): `<leader price>` plus USD250 |
| `<clock lag>` | 30 seconds (fixed) |

**Steps:**

1. Five seconds after the close by the auction's clock, place `<bid amount>` and read the bid panel.
2. Unblock the auction, reload, and wait until the close is recorded.
3. Read the listing's state and the bid panel.

**Expected Results:**

* Step 1's bid panel reads "Your bid did not go through." alone, with no new wording.
* Step 3 reads Highest bid `<leader price>` and shows neither Won nor Did not win to customer A.

<!-- trace:case id=g10.auction-listing-page.TC-1pq rev=3 -->
### g10.auction-listing-page.US14-TC5: A lone first bid refused past the close leaves the listing Ended with No bids

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

* `<listing_10>` is open with no accepted bid, its scheduled close under a minute away.
* customer A(card linked) is signed in on its page.
* Once the page has loaded, customer A's browser blocks the auction's time, live and listing reads, and its clock runs `<clock lag>` behind, so its bid controls stay enabled past the close.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_10>` | An open USD listing with no bids, starting at `<bid amount>`, no cap |
| `<bid amount>` | USD280 (range: 20000–49999 minor units), the starting price |
| `<clock lag>` | 30 seconds (fixed) |

**Steps:**

1. Five seconds after the scheduled close by the auction's clock, place `<bid amount>` and read the bid panel.
2. Unblock the auction, reload, and wait until the close is recorded.
3. Read Time left, the listing's state and the bid panel.

**Expected Results:**

* Step 1's bid panel reads "Your bid did not go through." alone.
* Step 3: Time left never read Extended bidding, the listing reads Ended with No bids under it, and neither Won nor Did not win shows.

<!-- trace:case id=g10.auction-listing-page.TC-ecq rev=2 -->
### g10.auction-listing-page.US14-TC6: A later close turns a Closed page back to Extended bidding

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

* `<listing_11>` is in extended bidding, led by customer B, its recorded close under a minute away.
* customer A is on its page with live updates delayed by 5 seconds; customer C(card linked) is on it in a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_11>` | A USD listing in extended bidding, led by customer B, no cap |
| `<bid amount>` | The minimum next bid the bid panel shows |
| `<extension duration>` | 1800 seconds (30 minutes, fixed configured duration) |

**Steps:**

1. As customer C, place `<bid amount>` one second before the recorded close.
2. As customer A, watch Time left through the recorded close, without reloading.
3. As customer A, read the listing's state and the bid panel once the update arrives.

**Expected Results:**

* Once the close it counted to passes, customer A's page reads Closed with no result and its bid controls disabled.
* Step 3: Time left is labelled Extended bidding, counting to customer C's bid time plus `<extension duration>`, and the bid controls are enabled.
* No step shows Won, Did not win or Ended, and the page did not reload.

<!-- trace:case id=g10.auction-listing-page.TC-4ba rev=2 -->
### g10.auction-listing-page.US14-TC7: A sold listing crowns its winning bid and no other

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

* `<listing_19>` is live, led by customer A with a lower bid from customer B, its recorded close a minute away.
* customer C is on its page, in English.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_19>` | A live USD listing led by customer A |

**Steps:**

1. As customer C, read Recent bids.
2. Wait for the close to be recorded as sold to customer A, without reloading, and read Recent bids again.

**Expected Results:**

* Step 1 shows no crown on any row.
* Step 2 shows a crown named Winner after customer A's winning amount, and on no other row.

<!-- trace:case id=g10.auction-listing-page.TC-hqd rev=2 -->
### g10.auction-listing-page.US14-TC8: A listing with no winner crowns no bid

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
* **Trace:** grade10-site-auction-listing-page-US-14

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-page/live-room.spec.ts`

**Pre-conditions:**

* `<listing>` is `<state>`, and customer C is signed in.

**Test data:**

| `<state>` | `<reads>` |
| --- | --- |
| Past its close with bids, its close not yet recorded | Closed |
| Past its close with no bid, recorded with no winner | Ended with No bids under it, and no Recent bids row |

| Field | Value |
| --- | --- |
| `<listing>` | A USD listing in `<state>` |

**Steps:**

1. As customer C, open `<listing>`'s page and read Recent bids.

**Expected Results:**

* The listing reads `<reads>`.
* No row shows a crown.

<!-- trace:case id=g10.auction-listing-page.TC-jic rev=2 -->
### g10.auction-listing-page.US14-TC3: A bid still confirming at the close reads in existing words

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-14

**Retirement:** A bid takes no card hold, so no bid is still confirming at the close; replaced by `g10.auction-listing-page.US14-TC4`

**Pre-conditions:**

* Bid-time holds are on.
* customer B leads `<listing_7>`, its close under a minute away.

**Steps:**

1. Place `<bid amount>` 5 seconds before the close.
2. Read the bid panel.

**Expected Results:**

* At step 2 the bid panel reads Authorizing….

---

## g10.auction-listing-page.US15: Collector tells Recent Bids rivals apart by avatar letter

**As a** collector,
**I want** each Recent Bids avatar on the listing to show that bidder's email
initial while the label stays Bidder N,
**so that** I can tell who bid what without reading a name or email.

<!-- trace:case id=g10.auction-listing-page.TC-ava rev=2 -->
### g10.auction-listing-page.US15-TC1: Rival Recent Bids avatars show different email letters

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-15

**Pre-conditions:**

* customer A(email `<customer A email>`) and customer B(email `<customer B email>`) each hold an accepted bid on open `<listing_1>`.
* A collector is on `<listing_1>`'s page, in English.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | An open USD listing |
| `<customer A email>` | ada@example.com |
| `<customer B email>` | bob@example.com |

**Steps:**

1. Open Recent Bids and find customer A's and customer B's rows.

**Expected Results:**

* customer A's avatar shows A and customer B's shows B.
* Neither row shows an email or a personal name; labels stay listing pseudonyms or You.

---

## g10.auction-listing-page.US16: Collector reads a lot's title and description in their own language

**As a** collector,
**I want** the card and the lot page to show the lot's title and description in the language I browse in,
**so that** I understand the card before I bid on it.

<!-- trace:case id=g10.auction-listing-page.TC-x0c rev=1 -->
### g10.auction-listing-page.US16-TC1: A listing page reads its title and description in the page's language

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

* `<listing_1>` is published and live, with all three languages written.

**Test data:**

| `<lang>` | `<title reads>` | `<description reads>` |
| --- | --- | --- |
| /tc | `<traditional title>` | `<traditional description>` |
| /sc | `<simplified title>` | `<simplified description>` |
| (none, English) | `<english title>` | `<english description>` |

| Field | Value |
| --- | --- |
| `<listing_1>` | A published, live listing, slug `<slug_1>` |
| `<slug_1>` | The address built from the English title and the listing code |
| `<english title>` | Charizard PSA 10 |
| `<english description>` | 1999 Base Set, clean front. |
| `<traditional title>` | 寶可夢 噴火龍 PSA 10 |
| `<traditional description>` | 1999 年基本系列，正面無瑕。 |
| `<simplified title>` | 宝可梦 喷火龙 PSA 10 |
| `<simplified description>` | 1999 年基本系列，正面无瑕。 |

**Steps:**

1. Open `<g10url><lang>/auction/listings/<slug_1>` and read the title and description.

**Expected Results:**

* The title reads `<title reads>` and the description `<description reads>`, with no text of another language.

<!-- trace:case id=g10.auction-listing-page.TC-k7m rev=1 -->
### g10.auction-listing-page.US16-TC8: The tab title and the link preview follow the page's language

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

* `<listing_1>` is published, with all three languages written.

**Test data:**

| `<lang>` | `<title reads>` | `<description reads>` |
| --- | --- | --- |
| /tc | 寶可夢 噴火龍 PSA 10 | 1999 年基本系列，正面無瑕。 |
| /sc | 宝可梦 喷火龙 PSA 10 | 1999 年基本系列，正面无瑕。 |
| (none, English) | Charizard PSA 10 | 1999 Base Set, clean front. |

| Field | Value |
| --- | --- |
| `<listing_1>` | A published listing, slug `<slug_1>` |

**Steps:**

1. Open `<g10url><lang>/auction/listings/<slug_1>` and read the browser tab's title.
2. Paste the same address into a chat app and read the preview.

**Expected Results:**

* Step 1's tab title includes `<title reads>`.
* Step 2's preview title includes `<title reads>` and its description `<description reads>`.

<!-- trace:case id=g10.auction-listing-page.TC-11y rev=1 covers=g10.auction-listing-page.SC-xpl -->
### g10.auction-listing-page.US16-TC11: Every language opens the same listing address, built from the English title

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

* `<listing_1>` is published, with all three languages written.

**Test data:**

| `<lang>` |
| --- |
| /tc |
| /sc |
| (none, English) |

| Field | Value |
| --- | --- |
| `<listing_1>` | A published listing, slug `<slug_1>` |
| `<slug_1>` | The address built from the English title Charizard PSA 10, not from a Chinese title |

**Steps:**

1. Open `<g10url><lang>/auction` and select `<listing_1>`'s card.
2. Read the address.

**Expected Results:**

* Step 1 opens the listing page.
* Step 2 ends `<lang>/auction/listings/<slug_1>`, the same `<slug_1>` in every row.

<!-- trace:case id=g10.auction-listing-page.TC-p0g rev=1 -->
### g10.auction-listing-page.US16-TC13: Switching the page language switches the listing's texts

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

* customer is on `<g10url>/tc/auction/listings/<slug_1>`.
* `<listing_1>` is published, with all three languages written.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | A published listing, slug `<slug_1>` |
| `<english title>` | Charizard PSA 10 |
| `<english description>` | 1999 Base Set, clean front. |
| `<traditional title>` | 寶可夢 噴火龍 PSA 10 |
| `<traditional description>` | 1999 年基本系列，正面無瑕。 |
| `<simplified title>` | 宝可梦 喷火龙 PSA 10 |
| `<simplified description>` | 1999 年基本系列，正面无瑕。 |

**Steps:**

1. Read the title and description.
2. Choose Simplified Chinese in the site's language choice and read them.
3. Choose English in the site's language choice and read them.

**Expected Results:**

* Step 1 reads `<traditional title>` and `<traditional description>`.
* Step 2 reads `<simplified title>` and `<simplified description>`, at the `/sc` address.
* Step 3 reads `<english title>` and `<english description>`, at the unprefixed address.

## Ungrouped

### g10.auction-listing-page.US6: Watch an auction and open My Auctions from the toast

<!-- trace:case id=g10.auction-listing-page.TC-sip rev=2 -->
#### g10.auction-listing-page.US6-TC2: A signed-out viewer is offered sign-in, and nothing is watched

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

* customer is signed out and on `<listing_12>`'s page.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_12>` | An open listing taking bids |

**Steps:**

1. Select Watch.
2. Sign in through the offered sign-in.

**Expected Results:**

* Step 1 offers sign-in, and no toast says email alerts are on.
* Step 2 returns to `<listing_12>`'s page, its control reading Watch.

### g10.auction-listing-page.US8: After bidding, Watching stays locked

<!-- trace:case id=g10.auction-listing-page.TC-amc rev=2 -->
#### g10.auction-listing-page.US8-TC2: A further bid on the listing shows no alerts toast

**Classification:**

* **Severity:** trivial
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-08

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-page/listing-page.spec.ts`

**Pre-conditions:**

* customer A(signed in, card linked) bid on `<listing_15>` before, customer B now leads it, and customer A is on its page.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_15>` | An open listing led by customer B |
| `<raise>` | The next valid bid the bid panel shows |

**Steps:**

1. Place `<raise>` from the bid panel.

**Expected Results:**

* No toast says email alerts are on.
* The control reads Watching, disabled.

### g10.auction-listing-page.US12: Collector sees another bid on the listing without reloading

<!-- trace:case id=g10.auction-listing-page.TC-d35 rev=2 -->
#### g10.auction-listing-page.US12-TC2: A scheduled close with a bid turns to Extended bidding without a reload

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-12

**Pre-conditions:**

* `<listing_2>` is open with one accepted bid, its scheduled close under a minute away, and customer A is on its page.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_2>` | An open USD listing with one accepted bid, no cap |
| `<extension duration>` | 1800 seconds (30 minutes, fixed configured duration) |

**Steps:**

1. Watch Time left through the scheduled close, without reloading.

**Expected Results:**

* Time left never reads Closed at the scheduled close.
* Time left is labelled Extended bidding and counts to the scheduled close plus `<extension duration>`, with no reload.

<!-- trace:case id=g10.auction-listing-page.TC-b7y rev=2 -->
#### g10.auction-listing-page.US12-TC3: A page with no live line still catches up without a reload

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-12

**Pre-conditions:**

* `<listing_1>` is open with Highest bid `<current bid>`, its close more than an hour away.
* customer A is on its page with the browser's live connection to the auction blocked; customer B(card linked) is on it in a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | An open USD listing with bids |
| `<current bid>` | USD4,960 (range: 250000–499999 minor units) |
| `<bid amount>` | USD5,210 (fixed derived): `<current bid>` plus USD250 |

**Steps:**

1. As customer B, enter `<bid amount>` in the custom maximum and confirm the bid.
2. As customer A, wait on the page without reloading, then read Highest bid and the bid count.

**Expected Results:**

* Highest bid reads `<bid amount>`, and the bid count includes customer B's bid.
* customer A's page did not reload.

<!-- trace:case id=g10.auction-listing-page.TC-nz3 rev=2 -->
#### g10.auction-listing-page.US12-TC4: A page that lost its line catches up when it returns

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-12

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-page/live-room.spec.ts`

**Pre-conditions:**

* `<listing_1>` is open with Highest bid `<current bid>`, its close more than an hour away.
* customer A is on its page; customer B(card linked) is on it in a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | An open USD listing with bids |
| `<current bid>` | USD4,960 (range: 250000–499999 minor units) |
| `<bid amount>` | USD5,210 (fixed derived): `<current bid>` plus USD250 |

**Steps:**

1. Take customer A's browser offline.
2. As customer B, enter `<bid amount>` in the custom maximum and confirm the bid.
3. Bring customer A's browser back online, without reloading, and read Highest bid and the bid count.

**Expected Results:**

* Highest bid reads `<bid amount>`, and the bid count includes customer B's bid.
* customer A's page did not reload.

<!-- trace:case id=g10.auction-listing-page.TC-0yw rev=2 -->
#### g10.auction-listing-page.US12-TC7: A tied maximum set second carries the earlier-leads tip

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

* `<listing_16>` is open with no bid; customer A(card linked) and customer B(card linked) are on its page in separate sessions, in English.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_16>` | An open USD listing with no bid, starting at least two increments below `<maximum>` |
| `<maximum>` | USD1,800 (range: 120000–249999 minor units) |

**Steps:**

1. As customer A, confirm `<maximum>` in the custom maximum.
2. As customer B, confirm the same `<maximum>`.
3. As customer B, read the Recent bids rows at `<maximum>`, then hover the Info control on customer B's row.

**Expected Results:**

* Both rows read `<maximum>`, customer A's first, whatever time each shows.
* customer A's row carries no Info control; customer B's does.
* The tip reads When maximums match, the earlier one leads.

<!-- trace:case id=g10.auction-listing-page.TC-7nz rev=2 -->
#### g10.auction-listing-page.US12-TC8: An older tie lower down keeps the earlier-leads tip

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-12

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-page/live-room.spec.ts`

**Pre-conditions:**

* `<listing_16>` is open with no bid; customers A, B and C(each card linked) are on its page in separate sessions, in English.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_16>` | An open USD listing with no bid, starting at least two increments below `<maximum>` |
| `<maximum>` | USD1,800 (range: 120000–199999 minor units) |
| `<higher maximum>` | USD2,200 (range: 200000–249999 minor units), at least two increments above `<maximum>` |

**Steps:**

1. As customer A, then customer B, confirm `<maximum>` in the custom maximum.
2. As customer C, confirm `<higher maximum>`.
3. As customer C, read the current price and the rows at `<maximum>`, then hover the Info control on customer B's row.

**Expected Results:**

* The current price is above `<maximum>`, and customer C's row leads Recent bids.
* customer A's and customer B's rows both read `<maximum>`, customer A's first; only customer B's carries an Info control.
* The tip reads When maximums match, the earlier one leads.

### g10.auction-listing-page.US15: Collector tells Recent Bids rivals apart by avatar letter

<!-- trace:case id=g10.auction-listing-page.TC-avb rev=2 -->
#### g10.auction-listing-page.US15-TC2: The viewer's own row keeps the email letter under You

**Classification:**

* **Severity:** trivial
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-15

**Pre-conditions:**

* customer A(signed in, email ada@example.com) holds an accepted bid on open `<listing_2>` and is on its page.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_2>` | An open USD listing |

**Steps:**

1. Open Recent Bids and find the row marked You.

**Expected Results:**

* The row's avatar shows A, and it still carries the You badge.

### g10.auction-listing-page.US16: Collector reads a lot's title and description in their own language

<!-- trace:case id=g10.auction-listing-page.TC-juv rev=1 -->
#### g10.auction-listing-page.US16-TC2: A catalogue card shows its title in the page's language

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

* `<listing_1>` has all three languages written and `<listing_2>` an English title only; both are `<card state>` on the catalogue.

**Test data:**

| `<lang>` | `<card state>` | `<card title>` |
| --- | --- | --- |
| /tc | Active | 寶可夢 噴火龍 PSA 10 |
| /sc | Active | 宝可梦 喷火龙 PSA 10 |
| /tc | Upcoming | 寶可夢 噴火龍 PSA 10 |
| /tc | Closed | 寶可夢 噴火龍 PSA 10 |

| Field | Value |
| --- | --- |
| `<listing_1>` | A published listing with English, Traditional and Simplified Chinese titles |
| `<listing_2>` | A published listing titled Charizard PSA 10 in English only |

**Steps:**

1. Open `<g10url><lang>/auction` and find `<listing_1>`'s and `<listing_2>`'s cards.

**Expected Results:**

* `<listing_1>`'s card title reads `<card title>`, and `<listing_2>`'s reads Charizard PSA 10.
* Neither card shows a description.

<!-- trace:case id=g10.auction-listing-page.TC-cmf rev=1 covers=g10.auction-listing-page.SC-sbq -->
#### g10.auction-listing-page.US16-TC3: A text left unwritten falls back to English on its own

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

* `<listing_3>` is published with a Traditional Chinese title and no Traditional Chinese description.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_3>` | A published listing titled Charizard PSA 10 and 寶可夢 噴火龍 PSA 10, described 1999 Base Set, clean front. in English only, slug `<slug_3>` |

**Steps:**

1. Open `<g10url>/tc/auction/listings/<slug_3>` and read the title and description.

**Expected Results:**

* The title reads 寶可夢 噴火龍 PSA 10, and the description 1999 Base Set, clean front.
* No empty description area shows.

<!-- trace:case id=g10.auction-listing-page.TC-44a rev=1 -->
#### g10.auction-listing-page.US16-TC4: One Chinese is never shown in place of the other

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-16

**Pre-conditions:**

* `<listing_4>` is published with English texts and only the `<written>` texts.

**Test data:**

| `<lang>` | `<written>` |
| --- | --- |
| /sc | Traditional Chinese title and description |
| /tc | Simplified Chinese title and description |

| Field | Value |
| --- | --- |
| `<listing_4>` | A published listing titled Charizard PSA 10, described 1999 Base Set, clean front., slug `<slug_4>` |

**Steps:**

1. Open `<g10url><lang>/auction/listings/<slug_4>` and read the title and description.

**Expected Results:**

* The title reads Charizard PSA 10 and the description 1999 Base Set, clean front.

<!-- trace:case id=g10.auction-listing-page.TC-xjc rev=1 -->
#### g10.auction-listing-page.US16-TC5: A listing with no translations reads in English in every language

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

* `<listing_5>` was published before translations existed and has an English title and description only.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_5>` | A published listing titled Charizard PSA 10, described 1999 Base Set, clean front., slug `<slug_5>` |

**Steps:**

1. Open `<g10url>/tc/auction/listings/<slug_5>` and read the title and description.
2. Open `<g10url>/auction/listings/<slug_5>` and read them.

**Expected Results:**

* Step 1 reads Charizard PSA 10 and 1999 Base Set, clean front.
* Step 2 reads the same title and description.

<!-- trace:case id=g10.auction-listing-page.TC-pda rev=1 -->
#### g10.auction-listing-page.US16-TC6: A translation saved as spaces falls back to English

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-16

**Pre-conditions:**

* `<listing_6>` is published; its Traditional Chinese `<field>` was saved as 3 spaces, and its other Traditional Chinese text is written.

**Test data:**

| `<field>` | `<title reads>` | `<description reads>` |
| --- | --- | --- |
| title | Charizard PSA 10 | 1999 年基本系列，正面無瑕。 |
| description | 寶可夢 噴火龍 PSA 10 | 1999 Base Set, clean front. |

| Field | Value |
| --- | --- |
| `<listing_6>` | A published listing with English texts Charizard PSA 10 and 1999 Base Set, clean front., slug `<slug_6>` |

**Steps:**

1. Open `<g10url>/tc/auction/listings/<slug_6>` and read the title and description.

**Expected Results:**

* The title reads `<title reads>` and the description `<description reads>`.
* No blank title or description area shows.

<!-- trace:case id=g10.auction-listing-page.TC-e8q rev=1 -->
#### g10.auction-listing-page.US16-TC7: The page reads in its language with JavaScript off

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

* customer's browser has JavaScript turned off.
* `<listing_1>` is published and live, with all three languages written.

**Test data:**

| `<lang>` | `<title reads>` | `<description reads>` |
| --- | --- | --- |
| /tc | 寶可夢 噴火龍 PSA 10 | 1999 年基本系列，正面無瑕。 |
| /sc | 宝可梦 喷火龙 PSA 10 | 1999 年基本系列，正面无瑕。 |
| (none, English) | Charizard PSA 10 | 1999 Base Set, clean front. |

| Field | Value |
| --- | --- |
| `<listing_1>` | A published, live listing, slug `<slug_1>` |

**Steps:**

1. Open `<g10url><lang>/auction/listings/<slug_1>` and read the title and description.

**Expected Results:**

* The title reads `<title reads>` and the description `<description reads>`.

<!-- trace:case id=g10.auction-listing-page.TC-hmv rev=1 -->
#### g10.auction-listing-page.US16-TC9: The link preview falls back to English one text at a time

**Classification:**

* **Severity:** trivial
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-16

**Pre-conditions:**

* `<listing_3>` is published with a Traditional Chinese title and no Traditional Chinese description.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_3>` | A published listing titled Charizard PSA 10 and 寶可夢 噴火龍 PSA 10, described 1999 Base Set, clean front. in English only, slug `<slug_3>` |

**Steps:**

1. Open `<g10url>/tc/auction/listings/<slug_3>` and read the browser tab's title.
2. Paste the same address into a chat app and read the preview.

**Expected Results:**

* Step 1's tab title and step 2's preview title include 寶可夢 噴火龍 PSA 10.
* Step 2's preview description includes 1999 Base Set, clean front.

<!-- trace:case id=g10.auction-listing-page.TC-ofr rev=1 covers=g10.auction-listing-page.SC-ex9 -->
#### g10.auction-listing-page.US16-TC12: An edited translation shows on the next load and is not pushed to an open page

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-16

**Pre-conditions:**

* customer is on `<g10url>/tc/auction/listings/<slug_1>`, reading `<traditional title>`.
* admin(holds auction:operate) can edit `<listing_1>` in a second session.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | A published, live listing, slug `<slug_1>` |
| `<traditional title>` | 寶可夢 噴火龍 PSA 10 |
| `<new traditional title>` | 寶可夢 噴火龍 初版 PSA 10 |

**Steps:**

1. As admin, replace the Traditional Chinese title with `<new traditional title>` and select Save.
2. As customer, read the title without reloading.
3. Reload the page and read the title.

**Expected Results:**

* Step 2 still reads `<traditional title>`.
* Step 3 reads `<new traditional title>`.

## Settled

- A bid takes no card hold, so no bid is still confirming at the close: a bid is accepted or refused in one answer, and the listing page never reads Authorizing….
- A bid refused past the close is not a bid: the bid form says "Your bid did not go through." and the listing's result is decided as if it was never sent.
- A row tied on amount with a row above it carries the earlier-leads tip at any older tie lower down Recent bids, not only at the current price; the row above carries none.
- Rows tied on amount are listed the leading or won row first, then the row of the bidder who set that maximum earlier, and keep that order once both are outbid; the tip goes on the row of the later maximum.

## Reconciliation

- **Covered at domain** — `g10.auction-dmn.US7-TC3` walks `grade10-site-auction-listing-page-SC-30`: a price-moving bid in extended bidding restarts the open page's countdown, labelled Extended bidding, without a reload

### Manual

| Manual | Why |
| --- | --- |
| `g10.auction-listing-page.US12-TC7` | A person confirms the same custom maximum from two bidders in turn, reads the rows at that amount and hovers the Info control; the mapper's test flags a tied row it is handed |
| `g10.auction-listing-page.US12-TC8` | A person confirms a third, higher maximum, reads the older tie and hovers its Info control; the backend test proves the order and the mapper's test the flag |
| `g10.auction-listing-page.US14-TC7` | A person watches a live listing's close be recorded as sold without reloading and reads Recent bids before and after; the mapper's test proves the crown from a sold flag |
| `g10.auction-listing-page.US14-TC8` | A person opens a listing whose close is held back and one ended with no bid, and reads each one's Recent bids; the mapper's test proves no crown before the listing is closed sold |
