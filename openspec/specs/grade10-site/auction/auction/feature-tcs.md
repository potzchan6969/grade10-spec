# grade10-site/auction/auction Test Cases

**Status:** reopened · 3/40
**Reviewed:** 2026-09-29, tcs-rules r4, lapsed 2026-10-02
**Drafts styled:** 2026-10-24, tcs-rules r7
**Regenerated:** 2026-10-24, tcs-rules r7

## Background

* `<auction url>` is the Grade10 auction catalogue on the Grade10 site of the environment under test; `<my auctions url>` and `<bids url>` are the signed-in account's My Auctions and Bids pages. A listing's page opens from its card.
* Every listing is priced in USD. The increment is chosen by the amount being beaten: +USD1 from USD0, +USD25 from USD200, +USD100 from USD1,000, +USD250 from USD2,500 and +USD500 from USD5,000.
* The house bids through an internal bid an admin sets on the listing in the Grade10 admin console; collectors read it under a listing pseudonym.

## Walk 1: Read and open the Featured slides

Starting state:

- customer is signed out on `<auction url>`.
- Three complete Featured slots are set, in operator order: `<listing a>`, `<listing b>`, `<listing c>`.

Shared test data:

| Field | Value |
| --- | --- |
| listing a | A published Active listing with a front page image |
| listing b | Another published Active listing with a front page image |
| listing c | A published Upcoming listing with a front page image |

### Route

1. Read the Featured band's first slide.
   - It shows `<listing a>`'s front page image as banner and slab, its title, LIVE BIDDING with a live dot, a relative Ends in, the current bid and Bid Now. `g10.auction-auction.US6-TC1`
   - The Ends in counts to `<listing a>`'s close. `g10.auction-auction.US6-TC3`
2. Advance with the progress dots to the last slide, reading each.
   - The slides read `<listing a>`, `<listing b>`, `<listing c>`, in that order, without leaving the band. `g10.auction-auction.US6-TC4`
   - Each slide shows in turn. `g10.auction-auction.US7-TC2`
   - `<listing c>` reads UPCOMING with no live dot, a relative Opens in, View Auction, and no money. `g10.auction-auction.US6-TC3`
3. Select View Auction.
   - `<listing c>`'s page opens. `g10.auction-auction.US8-TC3`
4. Return to `<auction url>`, advance to `<listing b>`, and select Bid Now.
   - `<listing b>`'s page opens, not `<listing a>`'s. `g10.auction-auction.US8-TC2`
5. Return to `<auction url>` and select Bid Now on `<listing a>`.
   - `<listing a>`'s page opens. `g10.auction-auction.US8-TC1`

## Walk 2: Browse, watch and scroll All auctions

Starting state:

- customer(signed in) is on `<auction url>`; one complete Featured slot is set for `<featured listing>`.
- All auctions holds more listings than its first batch, among them the ones below; the customer watches none of them.

Shared test data:

| Field | Value |
| --- | --- |
| featured listing | A published Active listing in the Featured slot |
| active early | An Active listing closing at 18:00 UTC |
| active late | An Active listing closing at 19:00 UTC |
| upcoming early | An Upcoming listing opening on 2026-10-01 |
| upcoming late | An Upcoming listing opening on 2026-10-02 |
| ended recent | An Ended listing that closed on 2026-09-22 |
| ended older | An Ended listing that closed on 2026-09-15 |

### Route

1. Read the page's sections.
   - The only sections are Featured, then All auctions; there is no Categories heading, no category tile and no filter chrome. `g10.auction-auction.US5-TC6`
   - `<featured listing>` shows in Featured and again in All auctions, once. `g10.auction-auction.US5-TC8`
2. Read All auctions in order.
   - Active listings lead, then Upcoming, then Ended. `g10.auction-auction.US5-TC1`
   - `<active early>` reads before `<active late>`, `<upcoming early>` before `<upcoming late>`, and `<ended recent>` before `<ended older>`. `g10.auction-auction.US5-TC2`
   - `<upcoming early>`'s card shows Opens in and no money. `g10.auction-auction.US5-TC11`
3. Select watch on `<active early>`'s card, then open `<my auctions url>`.
   - The card reads watched, and My Auctions lists `<active early>` as watched. `g10.auction-auction.US9-TC1`
4. Return to `<auction url>`, select watch off on `<active early>`'s card, and open `<my auctions url>` again.
   - The card reads unwatched, and My Auctions no longer lists it. `g10.auction-auction.US9-TC2`
5. Find `<ended recent>`'s card.
   - It shows no watch control. `g10.auction-auction.US9-TC3`
6. Scroll to the end of the shown listings and wait.
   - Skeleton cards show while the next batch loads; it lands below, the first batch stays, the order holds, and no pagination control shows. `g10.auction-auction.US5-TC10`

## g10.auction-auction.US1: Collector browses Auction listings

**As a** collector,
**I want** the catalogue to show Auction listings with money in minor units,
**so that** I am not offered Buy Now and a close with bids is absolute.

<!-- trace:case id=g10.auction-auction.TC-m16 rev=1 covers=g10.auction-auction.SC-fec,g10.auction-auction.SC-a4f -->
### g10.auction-auction.US1-TC3: A listing the house leads at the close reads sold like any other

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-01

**Pre-conditions:**

* `<listing_1>` is in extended bidding, led by `<leader>` at `<final price>` over customer A's maximum `<customer A maximum>`; its recorded close is under a minute away, and nobody bids again.
* customer C has never bid on `<listing_1>` and is on its page.

**Test data:**

| `<leader>` |
| --- |
| The house, under `<listing_1>`'s internal bid of USD6,000 |
| customer B, with a maximum of USD6,000 and no internal bid on the listing |

| Field | Value |
| --- | --- |
| `<listing_1>` | A published USD listing in extended bidding |
| `<customer A maximum>` | USD5,000 (range: 500000–549999 minor units) |
| `<final price>` | USD5,500 (fixed derived): `<customer A maximum>` plus USD500 |

**Steps:**

1. Wait through the recorded close without reloading.
2. As customer C, read the listing's state, Highest bid and Recent bids.
3. Open `<auction url>` and read `<listing_1>`'s card.

**Expected Results:**

* Step 2 reads sold at `<final price>`, the winning row crowned under the leader's listing pseudonym.
* Step 3's card reads Ended, as any sold listing's card does.
* Both rows read alike at every step, save the pseudonym.

<!-- trace:case id=g10.auction-auction.TC-fkn rev=1 covers=g10.auction-auction.SC-cqt,g10.auction-auto-bidding.SC-szf -->
### g10.auction-auction.US1-TC4: A listing whose only bid is the house's extends and sells at the starting price

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
* **Trace:** grade10-site-auction-auction-US-01

**Pre-conditions:**

* `<listing_2>` is published with no bid; its internal bid of `<house maximum>` commits at `<commit time>`.
* Its scheduled close is a few minutes away, no collector will bid, and customer C is on its page.

**Test data:**

| `<commit time>` |
| --- |
| One minute from now, before the scheduled close |
| Exactly the scheduled close |

| Field | Value |
| --- | --- |
| `<listing_2>` | A published USD listing starting at `<starting price>`, no cap |
| `<starting price>` | USD4,000 (range: 100000–499999 minor units) |
| `<house maximum>` | USD6,000 (range: above `<starting price>`) |
| `<extension duration>` | 1800 seconds (30 minutes, fixed configured duration) |

**Steps:**

1. Wait until the scheduled close passes and read Time left.
2. Wait until the extended close passes, then read the state, Highest bid and Recent bids.

**Expected Results:**

* Step 1 reads Extended bidding, counting to the scheduled close plus `<extension duration>`.
* Step 2 reads sold at `<starting price>`, one bid, under the house's listing pseudonym.

---

## g10.auction-auction.US2: Collector places a bid inside the window

**As a** bidder,
**I want** a listing I bid on by its close to stay open until bidding stops,
**so that** a bid placed at the last second can always be answered, up to the listing's cap.

<!-- trace:case id=g10.auction-auction.TC-q6k rev=1 covers=g10.auction-auction.SC-jsr,g10.auction-auction.SC-5ao,g10.auction-auction.SC-2js,g10.auction-auction.SC-p70,g10.auction-auction.SC-n8w,g10.auction-auction.SC-z62,g10.auction-auction.SC-dnt,g10.auction-auction.SC-a33,g10.auction-auction.SC-cib,g10.auction-auction.SC-z5s,g10.auction-auction.SC-h4d,g10.auction-auction.SC-ch5,g10.auction-auction.SC-bz7,g10.auction-auction.SC-t3k -->
### g10.auction-auction.US2-TC8: A first bid in extended bidding is accepted and restarts the close

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-02

**Pre-conditions:**

* customer(card linked) has no bid on `<listing_43>`, is signed in and is on its page.
* `<listing_43>` is in extended bidding.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_43>` | A listing past its scheduled close, in extended bidding, no cap |
| `<extension duration>` | 1800 seconds (30 minutes, fixed configured duration) |

**Steps:**

1. Place a bid at the minimum next bid.
2. Read Time left.

**Expected Results:**

* The bid is accepted.
* The close moves to `<extension duration>` after that bid.

<!-- trace:case id=g10.auction-auction.TC-edh rev=2 covers=g10.auction-auction.SC-jsr,g10.auction-auction.SC-5ao,g10.auction-auction.SC-2js,g10.auction-auction.SC-p70,g10.auction-auction.SC-n8w,g10.auction-auction.SC-z62,g10.auction-auction.SC-dnt,g10.auction-auction.SC-a33,g10.auction-auction.SC-cib,g10.auction-auction.SC-z5s,g10.auction-auction.SC-h4d,g10.auction-auction.SC-ch5,g10.auction-auction.SC-bz7,g10.auction-auction.SC-23v,g10.auction-auction.SC-6b9,g10.auction-auction.SC-7kh,g10.auction-auction.SC-dbc,g10.auction-auction.SC-wlg,g10.auction-auction.SC-t3k,g10.auction-auction.SC-uha,g10.auction-auction.SC-xrx,g10.auction-auction.SC-s1d -->
### g10.auction-auction.US2-TC15: A first bid at the opening price is accepted

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
* **Trace:** grade10-site-auction-auction-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auction/opening-price.spec.ts`

**Pre-conditions:**

* `<listing_45>` is open, starting at `<start>`, with no accepted bid.
* customer(card linked) has no bid on it, is signed in and is on its page.

**Test data:**

| `<start>` | `<opening price>` | `<next minimum>` |
| --- | --- | --- |
| USD280 (range: 20000–99999 minor units) | USD280, the start | USD305, plus the USD25 step |
| USD7 (fixed boundary: under USD10) | USD7, the start | USD8, plus the USD1 step |
| USD0 (fixed boundary) | USD1, the lowest step | USD2, plus the USD1 step |

**Steps:**

1. Enter `<opening price>` in the custom maximum and place the bid.
2. Read Highest bid, the bid count, Recent Bids and the minimum next bid.

**Expected Results:**

* The bid is accepted, and Highest bid reads `<opening price>`, never 0.
* The bid count reads 1, and Recent Bids shows the bid as You.
* The minimum next bid reads `<next minimum>`.

---

## g10.auction-auction.US4: Collector meets the identity bar on a high-value bid

**As a** collector bidding the bar or more on a listing,
**I want** to be told at once that a verified identity is needed and where to get one,
**so that** the auction records nothing for a bid it cannot take, and I can verify and bid again before the listing closes.

<!-- trace:case id=g10.auction-auction.TC-zsd rev=3 covers=g10.auction-auction.SC-d78 -->
### g10.auction-auction.US4-TC1: A verified bidder's bid at the bar goes through like any other

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-04

**Pre-conditions:**

* customer(verified, card linked with `<card>`) is signed in and on `<listing_12>`.
* `<listing_12>` is live, its minimum next bid `<bar>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<card>` | Visa ending 4242 |
| `<listing_12>` | A live USD listing |
| `<bar>` | USD15,000 (fixed configured value) |

**Steps:**

1. Enter `<bar>` and select Place Bid.
2. Read Highest bid and the bid count.
3. Read `<card>`'s activity at the card provider.

**Expected Results:**

* Step 1 accepts the bid, with no refusal naming a verified identity.
* Step 2 reads `<bar>`, and the bid count rose by one.
* Step 3 shows nothing held or charged.

<!-- trace:case id=g10.auction-auction.TC-5gi rev=3 covers=g10.auction-auction.SC-uhh,g10.auction-auction.SC-l64 -->
### g10.auction-auction.US4-TC2: A bidder without a verified identity is stopped at and above the bar

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-04

**Pre-conditions:**

* customer(card linked, identity `<standing>`) has no bid on `<listing_12>`, is signed in and is on it.
* `<listing_12>` is live, its minimum next bid USD15,000.

**Test data:**

| `<standing>` | `<bid amount>` |
| --- | --- |
| never verified | USD15,000 (fixed boundary: the bar) |
| never verified | USD15,200 (range: above the bar) |
| expired | USD15,000 (fixed boundary: the bar) |
| expired | USD15,200 (range: above the bar) |

**Steps:**

1. Enter `<bid amount>` and select Place Bid, then read the bid form.
2. Reload `<listing_12>` and read Highest bid and the bid count.
3. Open `<my auctions url>`, then `<bids url>`, and look for `<listing_12>`.

**Expected Results:**

* Step 1 refuses the bid with: Bids this high need a verified identity. Verify from your account, then bid again.
* Step 2 shows Highest bid and the bid count unchanged.
* Step 3 shows `<listing_12>` on neither page.

<!-- trace:case id=g10.auction-auction.TC-49i rev=2 covers=g10.auction-auction.SC-ndj,g10.auction-auction.SC-99a -->
### g10.auction-auction.US4-TC3: A bid below the bar asks no bidder for an identity

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
* **Trace:** grade10-site-auction-auction-US-04

**Pre-conditions:**

* customer(card linked, identity `<standing>`) is signed in and on `<listing_13>`, a live listing whose minimum next bid is at or below `<bid amount>`.

**Test data:**

| `<standing>` | `<bid amount>` |
| --- | --- |
| never verified | USD520 (range: below the bar) |
| expired | USD520 (range: below the bar) |
| verified | USD520 (range: below the bar) |
| never verified | USD14,999 (fixed boundary: one dollar below the bar) |
| never verified | USD14,999.99 (fixed boundary: one cent below the bar) |

**Steps:**

1. Enter `<bid amount>` and select Place Bid.
2. Read the bid form and Highest bid.

**Expected Results:**

* The bid is accepted, with no identity prompt or refusal, and Highest bid reads `<bid amount>`.

---

## g10.auction-auction.US5: Collector reads the catalogue in one order

**As a** collector,
**I want** All auctions to lead with the listings I can bid on, soonest to close first, and to keep that order as I read on — below Featured when Featured is present, with no category section —,
**so that** what I can still bid on is in front of me and reading further never shows me a listing twice or skips one.

<!-- trace:case id=g10.auction-auction.TC-91h rev=1 covers=g10.auction-auction.SC-5vk,g10.auction-auction.SC-c4r,g10.auction-auction.SC-icd,g10.auction-auction.SC-zvy,g10.auction-auction.SC-zv8,g10.auction-auction.SC-4je,g10.auction-auction.SC-7l1,g10.auction-auction.SC-tb4,g10.auction-auction.SC-iyy,g10.auction-auction.SC-cys,g10.auction-auction.SC-ned,g10.auction-auction.SC-fs8 -->
### g10.auction-auction.US5-TC1: Open listings lead the catalogue

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-05

**Pre-conditions:**

* The catalogue lists `<listing_48>`, `<listing_49>` and `<listing_50>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_48>` | An Active listing closing at 18:00 UTC |
| `<listing_49>` | An Upcoming listing opening at 19:00 UTC |
| `<listing_50>` | An Ended listing that closed at 12:00 UTC |

**Steps:**

1. Open `<auction url>` and read the listings in order.

**Expected Results:**

* `<listing_48>` reads before `<listing_49>`, and `<listing_49>` before `<listing_50>`.

<!-- trace:case id=g10.auction-auction.TC-yh1 rev=1 covers=g10.auction-auction.SC-5vk,g10.auction-auction.SC-c4r,g10.auction-auction.SC-icd,g10.auction-auction.SC-zvy,g10.auction-auction.SC-zv8,g10.auction-auction.SC-4je,g10.auction-auction.SC-7l1,g10.auction-auction.SC-tb4,g10.auction-auction.SC-iyy,g10.auction-auction.SC-cys,g10.auction-auction.SC-ned,g10.auction-auction.SC-fs8 -->
### g10.auction-auction.US5-TC2: Each status keeps its own order

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-05

**Pre-conditions:**

* The catalogue lists the six listings in **Test data**.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_51>` | An Active listing closing at 18:00 UTC |
| `<listing_52>` | An Active listing closing at 19:00 UTC |
| `<listing_53>` | An Upcoming listing opening on 2026-10-01 |
| `<listing_54>` | An Upcoming listing opening on 2026-10-02 |
| `<listing_55>` | An Ended listing that closed on 2026-09-22 |
| `<listing_56>` | An Ended listing that closed on 2026-09-15 |

**Steps:**

1. Open `<auction url>` and read the listings in order.

**Expected Results:**

* `<listing_51>` reads before `<listing_52>`, `<listing_53>` before `<listing_54>`, and `<listing_55>` before `<listing_56>`.

<!-- trace:case id=g10.auction-auction.TC-izg rev=1 covers=g10.auction-auction.SC-5vk,g10.auction-auction.SC-c4r,g10.auction-auction.SC-icd,g10.auction-auction.SC-zvy,g10.auction-auction.SC-zv8,g10.auction-auction.SC-4je,g10.auction-auction.SC-7l1,g10.auction-auction.SC-tb4,g10.auction-auction.SC-iyy,g10.auction-auction.SC-cys,g10.auction-auction.SC-ned,g10.auction-auction.SC-fs8 -->
### g10.auction-auction.US5-TC6: The catalogue shows no category chrome

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** usability
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auction/catalogue-access.spec.ts`

**Pre-conditions:**

* customer is on `<auction url>`.

**Steps:**

1. Read the page's sections.

**Expected Results:**

* No Categories heading, category tile or filter chrome shows.
* The only sections are Featured, when set, then All auctions.

<!-- trace:case id=g10.auction-auction.TC-yqf rev=1 covers=g10.auction-auction.SC-5vk,g10.auction-auction.SC-c4r,g10.auction-auction.SC-icd,g10.auction-auction.SC-zvy,g10.auction-auction.SC-zv8,g10.auction-auction.SC-4je,g10.auction-auction.SC-7l1,g10.auction-auction.SC-tb4,g10.auction-auction.SC-iyy,g10.auction-auction.SC-cys,g10.auction-auction.SC-ned,g10.auction-auction.SC-fs8 -->
### g10.auction-auction.US5-TC8: A Featured listing also reads in All auctions, once

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auction/catalogue-access.spec.ts`

**Pre-conditions:**

* customer is on `<auction url>`; a complete Featured slot is set for `<featured listing>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<featured listing>` | A published listing in a complete Featured slot |

**Steps:**

1. Read Featured, then All auctions, for `<featured listing>`.

**Expected Results:**

* `<featured listing>` shows in Featured and once in All auctions, in its resting place, with no listing repeated or skipped.

<!-- trace:case id=g10.auction-auction.TC-90r rev=1 covers=g10.auction-auction.SC-5vk,g10.auction-auction.SC-c4r,g10.auction-auction.SC-icd,g10.auction-auction.SC-zvy,g10.auction-auction.SC-zv8,g10.auction-auction.SC-4je,g10.auction-auction.SC-7l1,g10.auction-auction.SC-tb4,g10.auction-auction.SC-iyy,g10.auction-auction.SC-cys,g10.auction-auction.SC-ned,g10.auction-auction.SC-fs8 -->
### g10.auction-auction.US5-TC10: More listings load as All auctions scrolls

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auction/catalogue-access.spec.ts`

**Pre-conditions:**

* customer is on `<auction url>`; All auctions holds more listings than its first batch.

**Steps:**

1. Read the first batch, scroll to its end, and wait for the next.

**Expected Results:**

* Skeleton cards show below while the next batch loads, or it lands at once.
* The next batch lands below, the first batch stays, the order holds, and no pagination control shows.

<!-- trace:case id=g10.auction-auction.TC-apa rev=1 covers=g10.auction-auction.SC-5vk,g10.auction-auction.SC-c4r,g10.auction-auction.SC-icd,g10.auction-auction.SC-zvy,g10.auction-auction.SC-zv8,g10.auction-auction.SC-4je,g10.auction-auction.SC-7l1,g10.auction-auction.SC-tb4,g10.auction-auction.SC-iyy,g10.auction-auction.SC-cys,g10.auction-auction.SC-ned,g10.auction-auction.SC-fs8 -->
### g10.auction-auction.US5-TC11: An Upcoming card in All auctions shows no money

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auction/catalogue-access.spec.ts`

**Pre-conditions:**

* customer is on `<auction url>`; `<upcoming listing>` is in All auctions.

**Test data:**

| Field | Value |
| --- | --- |
| `<upcoming listing>` | A published Upcoming listing |

**Steps:**

1. Read `<upcoming listing>`'s card.

**Expected Results:**

* It shows Opens in, and no starting bid or other money.

---

## g10.auction-auction.US6: Collector reads Featured on the catalogue

**As a** collector opening `/auction`,
**I want** the operator's Featured slides when any are set — front page image, title,
status, countdown, current bid and Bid Now —,
**so that** the listings the house leads with are what I meet first.

<!-- trace:case id=g10.auction-auction.TC-5my rev=1 covers=g10.auction-auction.SC-kis,g10.auction-auction.SC-3g8,g10.auction-auction.SC-8d7,g10.auction-auction.SC-rl4,g10.auction-auction.SC-wea -->
### g10.auction-auction.US6-TC1: A Featured slide shows its image, title, status, countdown, bid and Bid Now

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-06

**Pre-conditions:**

* customer is on `<auction url>`; the only complete Featured slot holds `<featured listing>` and `<front page image>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<featured listing>` | A published Active listing |
| `<front page image>` | The image uploaded for the slot |

**Steps:**

1. Read the Featured band.

**Expected Results:**

* One slide shows `<front page image>` as banner and slab, `<featured listing>`'s title, LIVE BIDDING with a live dot, a relative Ends in, the current bid and Bid Now.

<!-- trace:case id=g10.auction-auction.TC-htt rev=1 covers=g10.auction-auction.SC-kis,g10.auction-auction.SC-3g8,g10.auction-auction.SC-8d7,g10.auction-auction.SC-rl4,g10.auction-auction.SC-wea -->
### g10.auction-auction.US6-TC3: A slide counts to the close when Active and to the open when Upcoming

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
* **Trace:** grade10-site-auction-auction-US-06

**Pre-conditions:**

* customer is on `<auction url>`; a complete Featured slot holds a listing that is `<status>`.

**Test data:**

| `<status>` | `<slide reads>` |
| --- | --- |
| Active | A relative Ends in to its close, LIVE BIDDING and the current bid |
| Upcoming | A relative Opens in to its open, UPCOMING with no live dot, View Auction, and no money |

**Steps:**

1. Read the slide's countdown and status.

**Expected Results:**

* The slide reads `<slide reads>`.

<!-- trace:case id=g10.auction-auction.TC-d55 rev=1 covers=g10.auction-auction.SC-kis,g10.auction-auction.SC-3g8,g10.auction-auction.SC-8d7,g10.auction-auction.SC-rl4,g10.auction-auction.SC-wea -->
### g10.auction-auction.US6-TC4: Three slides show in operator order

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-06

**Pre-conditions:**

* Three complete Featured slots are set, in operator order `<listing a>`, `<listing b>`, `<listing c>`.

**Steps:**

1. Open `<auction url>` and read the slides from first to last.

**Expected Results:**

* They read `<listing a>`, `<listing b>`, `<listing c>`, in that order.

---

## g10.auction-auction.US7: Collector advances Featured slides

**As a** collector on `/auction` with more than one Featured slide,
**I want** to move between slides with the progress control, and on a small
viewport also with stage previous/next or a horizontal swipe,
**so that** I can reach every curated listing without leaving the band.

<!-- trace:case id=g10.auction-auction.TC-9ji rev=1 covers=g10.auction-auction.SC-94x -->
### g10.auction-auction.US7-TC2: The progress dots reach every one of three slides

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-07

**Pre-conditions:**

* customer is on `<auction url>`; three complete Featured slots hold `<listing a>`, `<listing b>`, `<listing c>`.

**Steps:**

1. Advance with the progress dots until each slide has shown, reading each.

**Expected Results:**

* The slides show `<listing a>`, `<listing b>` and `<listing c>` in turn, without leaving the band.

---

## g10.auction-auction.US8: Collector opens a Featured listing

**As a** collector on a Featured slide,
**I want** Bid Now when the listing is Active, or View Auction when it is Upcoming,
to open that listing's details page,
**so that** I land on the listing the catalogue led with.

<!-- trace:case id=g10.auction-auction.TC-ytf rev=1 covers=g10.auction-auction.SC-sh8,g10.auction-auction.SC-b2i -->
### g10.auction-auction.US8-TC1: Bid Now opens an Active slide's listing

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-08

**Pre-conditions:**

* customer is on `<auction url>`, with a Featured slide for `<featured listing>` showing.

**Test data:**

| Field | Value |
| --- | --- |
| `<featured listing>` | A published Active listing |

**Steps:**

1. Select Bid Now on the slide.

**Expected Results:**

* `<featured listing>`'s page opens.

<!-- trace:case id=g10.auction-auction.TC-0qt rev=1 covers=g10.auction-auction.SC-sh8,g10.auction-auction.SC-b2i -->
### g10.auction-auction.US8-TC2: Bid Now on a later slide opens that slide's listing

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-08

**Pre-conditions:**

* customer is on `<auction url>` with Featured slides for `<listing a>` then `<listing b>`, both Active, advanced to `<listing b>`.

**Steps:**

1. Select Bid Now on the slide.

**Expected Results:**

* `<listing b>`'s page opens, not `<listing a>`'s.

<!-- trace:case id=g10.auction-auction.TC-2aj rev=1 covers=g10.auction-auction.SC-sh8,g10.auction-auction.SC-b2i -->
### g10.auction-auction.US8-TC3: View Auction opens an Upcoming slide's listing

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-08

**Pre-conditions:**

* customer is on `<auction url>`, with a Featured slide for `<upcoming listing>` showing.

**Test data:**

| Field | Value |
| --- | --- |
| `<upcoming listing>` | A published Upcoming listing |

**Steps:**

1. Select View Auction on the slide.

**Expected Results:**

* `<upcoming listing>`'s page opens.

---

## g10.auction-auction.US9: Collector watches from an All auctions card

**As a** signed-in collector reading All auctions,
**I want** the watch control on a card to watch or unwatch that listing the same way as on the listing page and My Auctions,
**so that** I do not learn a second watch rule on the catalogue.

<!-- trace:case id=g10.auction-auction.TC-fjy rev=1 covers=g10.auction-auction.SC-na4,g10.auction-auction.SC-epv -->
### g10.auction-auction.US9-TC1: Watching from an All auctions card watches the listing everywhere

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-09

**Pre-conditions:**

* customer(signed in) is on `<auction url>` and does not watch `<open listing>`, which shows on an All auctions card.

**Test data:**

| Field | Value |
| --- | --- |
| `<open listing>` | A published Active or Upcoming listing |

**Steps:**

1. Select watch on `<open listing>`'s card and read it.
2. Open `<my auctions url>`.

**Expected Results:**

* Step 1's card reads watched.
* Step 2 lists `<open listing>` as watched.

<!-- trace:case id=g10.auction-auction.TC-8nw rev=1 covers=g10.auction-auction.SC-na4,g10.auction-auction.SC-epv -->
### g10.auction-auction.US9-TC2: Unwatching from an All auctions card unwatches it everywhere

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-09

**Pre-conditions:**

* customer(signed in) is on `<auction url>` and watches `<open listing>`, which shows on an All auctions card.

**Steps:**

1. Select watch off on `<open listing>`'s card and read it.
2. Open `<my auctions url>`.

**Expected Results:**

* Step 1's card reads unwatched.
* Step 2 no longer lists `<open listing>` as watched.

<!-- trace:case id=g10.auction-auction.TC-txe rev=1 covers=g10.auction-auction.SC-na4,g10.auction-auction.SC-epv -->
### g10.auction-auction.US9-TC3: A closed listing's card shows no watch control

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-09

**Pre-conditions:**

* customer(signed in) is on `<auction url>`; `<closed listing>` shows in All auctions.

**Steps:**

1. Read `<closed listing>`'s card.

**Expected Results:**

* It shows no watch control.

---

## g10.auction-auction.US10: Collector sees a live Featured bid and clock

**As a** collector on an Active Featured slide,
**I want** the current bid to roll when it increases after first paint, and
Ends in to follow the recorded close with the same freshness (including when
extended bidding moves that close), without an Extended label on the banner,
**so that** the lead band matches the live sale without lot-page chrome.

<!-- trace:case id=g10.auction-auction.TC-s8h rev=1 -->
### g10.auction-auction.US10-TC1: A Featured slide shows a new bid and its moved close without a reload

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-10

**Pre-conditions:**

* customer is on `<auction url>` with `<featured listing>`'s Featured slide showing; `<featured listing>` is in extended bidding, its close 4 minutes away.
* customer B(card linked) is on `<featured listing>`'s page in a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| `<featured listing>` | A published Active USD listing in a complete Featured slot, no cap |
| `<bid amount>` | The minimum next bid the listing offers |
| `<extension duration>` | 1800 seconds (30 minutes, fixed configured duration) |

**Steps:**

1. As customer B, place `<bid amount>`.
2. As customer, without reloading, read the slide's current bid and Ends in.

**Expected Results:**

* The slide's current bid rolls up to `<bid amount>`, and Ends in counts to `<extension duration>` from customer B's bid.
* The slide shows no Extended label, and the page did not reload.

---

## g10.auction-auction.US11: Bidder is held to the close with everyone else

**As a** bidder,
**I want** a listing to stop taking bids at its close for everyone, and a bid to count when it is accepted before then,
**so that** nobody wins with a bid that arrived after the close.

<!-- trace:case id=g10.auction-auction.TC-huk rev=1 -->
### g10.auction-auction.US11-TC14: A bid that reaches the auction after the effective close does not count

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-11

**Pre-conditions:**

* customer B leads `<listing_2>` at `<leader price>`, `<listing_2>` is `<state>`, and its effective close is under a minute away.
* customer A(card linked) is signed in on `<listing_2>`'s page; once it loads, customer A's browser blocks the auction's time, live and listing reads and runs its clock 30 seconds behind, so the bid controls stay enabled past the close.

**Test data:**

| `<state>` |
| --- |
| In extended bidding, no cap |
| Open with an extension duration of 0, so the scheduled close is the effective close |

| Field | Value |
| --- | --- |
| `<listing_2>` | A USD listing led by customer B |
| `<leader price>` | USD4,960 (range: 250000–499999 minor units) |
| `<bid amount>` | USD5,210 (fixed derived): `<leader price>` plus USD250 |

**Steps:**

1. Five seconds after the effective close by the auction's clock, place `<bid amount>` and read the bid form.
2. Unblock the auction, reload, and wait until the close is recorded.
3. Read the listing's result and Highest bid.

**Expected Results:**

* Step 1 reads "Your bid did not go through." alone.
* Step 3: customer B wins at `<leader price>`, and the close was not moved.

<!-- trace:case id=g10.auction-auction.TC-ppq rev=1 covers=g10.auction-auction.SC-r92,g10.auction-auction.SC-wu6,g10.auction-auction.SC-c6m,g10.auction-auction.SC-ckp -->
### g10.auction-auction.US11-TC2: Payment confirmed after the effective close loses and releases its hold

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-11

**Retirement:** A bid takes no card hold, so no payment confirms after the close; replaced by `g10.auction-auction.US11-TC14`

**Pre-conditions:**

* Bid-time holds are on.

**Steps:**

1. Place a bid five seconds before the close and wait for its confirmation.

**Expected Results:**

* The bid panel reads "Your bid did not go through."

<!-- trace:case id=g10.auction-auction.TC-2di rev=1 covers=g10.auction-auction.SC-r92,g10.auction-auction.SC-wu6,g10.auction-auction.SC-c6m,g10.auction-auction.SC-ckp -->
### g10.auction-auction.US11-TC3: Lone first bid still confirming at the scheduled close leaves the lot unsold

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-11

**Retirement:** A bid takes no card hold, so no first bid is still confirming at the close; removed behaviour.

**Pre-conditions:**

* Bid-time holds are on.

**Steps:**

1. Place the starting price five seconds before the scheduled close.

**Expected Results:**

* The lot closes unsold.

<!-- trace:case id=g10.auction-auction.TC-itn rev=1 covers=none -->
### g10.auction-auction.US11-TC12: A lot the house leads at the close reads sold like any other

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-11

**Retirement:** Moved to journey US1; replaced by `g10.auction-auction.US1-TC3`

**Pre-conditions:**

* `<listing_1>` is led by the house or customer B at its close.

**Steps:**

1. Wait through the recorded close.

**Expected Results:**

* The lot reads sold.

<!-- trace:case id=g10.auction-auction.TC-xcm rev=1 covers=none -->
### g10.auction-auction.US11-TC13: A lot whose only bid is the house's extends and closes sold at the starting price

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-11

**Retirement:** Moved to journey US1; replaced by `g10.auction-auction.US1-TC4`

**Pre-conditions:**

* `<listing_2>` has no collector bid and an internal bid.

**Steps:**

1. Wait through the scheduled and extended close.

**Expected Results:**

* The lot reads sold at the starting price.

---

## g10.auction-auction.US12: Bidder keeps a listing open only by moving its price

**As a** bidder,
**I want** extended bidding to restart only when a bid moves the listing's price,
**so that** a leader cannot keep a listing open by raising their own maximum.

<!-- trace:case id=g10.auction-auction.TC-lmv rev=1 covers=g10.auction-auction.SC-e9w,g10.auction-auction.SC-xd3 -->
### g10.auction-auction.US12-TC1: An equal maximum moves the price and restarts the close

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-12

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auction/auction-bids.spec.ts`

**Pre-conditions:**

* `<listing_66>` is in extended bidding, its recorded close 5 minutes away; customer A leads at `<leader price>` with maximum `<customer A maximum>`.
* customer B(card linked) is on its page in a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_66>` | A USD listing in extended bidding, no cap |
| `<extension duration>` | 1800 seconds (30 minutes, fixed configured duration) |
| `<leader price>` | USD1,260 (range: 100000–235999 minor units) |
| `<customer A maximum>` | USD2,360 (range: 236000–249999 minor units) |
| `<customer B maximum>` | `<customer A maximum>` (fixed equality) |

**Steps:**

1. As customer B, enter `<customer B maximum>` in the custom maximum and confirm.
2. Read Highest bid, the leader and Time left.

**Expected Results:**

* Highest bid reads `<customer B maximum>`, and customer A still leads, as the earlier maximum.
* Time left reads `<extension duration>` from customer B's bid.

<!-- trace:case id=g10.auction-auction.TC-gqo rev=1 covers=g10.auction-auction.SC-e9w,g10.auction-auction.SC-xd3 -->
### g10.auction-auction.US12-TC2: A leader raising their own maximum leaves the close where it was

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-12

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auction/auction-bids.spec.ts`

**Pre-conditions:**

* `<listing_67>` is in extended bidding, its recorded close 3 minutes away; customer A leads at `<leader price>` with maximum `<customer A maximum>` and is on its page.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_67>` | A USD listing in extended bidding, no cap |
| `<leader price>` | USD5,460 (range: 500000–799999 minor units) |
| `<customer A maximum>` | USD8,400 (range: 800000–899999 minor units) |
| `<raised maximum>` | USD9,600 (range: above `<customer A maximum>`) |

**Steps:**

1. Select Raise, enter `<raised maximum>` and confirm.
2. Read Your maximum, Highest bid and Time left.
3. Wait through the close with no further bid, and read the result.

**Expected Results:**

* Step 2 reads Your maximum `<raised maximum>`, Highest bid still `<leader price>`, and Time left still counting to the same close.
* Step 3: the listing closes at that close, customer A winning at `<leader price>`.

<!-- trace:case id=g10.auction-auction.TC-2g4 rev=1 covers=g10.auction-auto-bidding.SC-pfm,g10.auction-auto-bidding.SC-ax3 -->
### g10.auction-auction.US12-TC3: A house change restarts the close only when it moves the price

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
* **Trace:** grade10-site-auction-auction-US-12

**Pre-conditions:**

* `<listing_3>` is in extended bidding, its recorded close 5 minutes away, its internal bid of USD6,000 committed, and `<setup>`.
* admin(holds auction:reserve) is on its editor; customer C is on its page.

**Test data:**

| `<setup>` | `<house change>` | `<highest bid after>` | `<time left after>` |
| --- | --- | --- | --- |
| customer A leads at USD6,500 with a maximum of USD7,000 | Raise to USD8,000 | USD7,500, the house leading (customer A's maximum plus USD500) | 30 minutes from the change |
| The house leads at USD5,500 over customer A's maximum of USD5,000 | Raise to USD8,000 | USD5,500, unchanged | The same close, still counting |
| The house leads at USD5,500 over customer A's maximum of USD5,000 | Lower to USD5,600 | USD5,500, unchanged | The same close, still counting |

| Field | Value |
| --- | --- |
| `<listing_3>` | A published USD listing in extended bidding, extension duration 1800 seconds, no cap |

**Steps:**

1. As admin, make `<house change>` and select Save.
2. As customer C, read Highest bid, the leader and Time left.

**Expected Results:**

* Step 1 is accepted.
* Step 2 reads `<highest bid after>`, and Time left reads `<time left after>`.

---

## g10.auction-auction.US13: Runner-up takes the lead when the leader's account is erased

**As a** bidder whose maximum is the highest left on a listing,
**I want** to take the lead at a price set by the maxima still standing when the leader's account is erased,
**so that** the listing keeps a leader and I never pay more than the price stood at before.

<!-- trace:case id=g10.auction-auction.TC-yo2 rev=1 -->
### g10.auction-auction.US13-TC1: The runner-up takes the lead at a price no higher than before when the leader's account is erased

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-13

**Pre-conditions:**

* `<listing_7>` is open; customer A leads at `<price before>` with maximum `<customer A maximum>`, over customer B's `<customer B maximum>` and customer C's `<customer C maximum>`.
* customer B is signed in on `<listing_7>`'s page; customer A's account erasure is ready to complete.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_7>` | An open USD listing |
| `<customer A maximum>` | USD8,400 |
| `<customer B maximum>` | USD5,700 |
| `<customer C maximum>` | USD3,000 |
| `<price before>` | USD6,200 (fixed derived): `<customer B maximum>` plus USD500 |
| `<price after>` | USD3,250 (fixed derived): `<customer C maximum>` plus USD250, no higher than `<price before>` |

**Steps:**

1. Complete customer A's account erasure.
2. As customer B, reload `<listing_7>` and read the standing, Highest bid and Recent Bids.

**Expected Results:**

* Step 2 reads customer B Leading at `<price after>`.
* Recent Bids names no erased account, and Highest bid is no higher than `<price before>`.

---

## g10.auction-auction.US14: Bidder reads why a bid was refused, and nothing else moves

**As a** bidder,
**I want** above-ceiling attempts to show no maximum-bid message and other refusals to say why on the bid form, with no trace of a refused bid anywhere else,
**so that** an oversized entry does not interrupt my review and I never read a bid I did not place as one I did.

<!-- trace:case id=g10.auction-auction.TC-r0p rev=3 covers=g10.auction-auction.SC-rl3,g10.auction-auction.SC-lu0,g10.auction-auction.SC-fnt,g10.auction-auction.SC-nh5,g10.auction-auction.SC-ulv,g10.auction-auction.SC-cfg -->
### g10.auction-auction.US14-TC1: A refused bid says why on the bid form and records nothing

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-14

**Pre-conditions:**

* customer(card linked, account `<account state>`) holds no bid on `<listing_29>`, does not watch it, and is on its page.
* `<listing_29>` is led by customer B at `<current bid>` with `<bid count>` bids, and `<listing state>`.

**Test data:**

| `<account state>` | `<listing state>` | `<amount>` | `<refusal>` |
| --- | --- | --- | --- |
| in good standing | Open; the page loaded at a current bid of USD4,960 and its live updates are held back, so it still offers `<stale minimum>` | `<stale minimum>` | Minimum bid is `<next minimum>` |
| bidding suspended | Open | `<next minimum>` | Bidding is suspended on this account. Contact Us to resolve it. |
| banned from bidding | Open | `<next minimum>` | This account cannot bid. |
| in good standing | Past its effective close, the close not yet recorded, its live updates held back | `<next minimum>` | Your bid did not go through. |

| Field | Value |
| --- | --- |
| `<listing_29>` | A USD listing led by customer B |
| `<current bid>` | USD5,210 (range: 500000–549999 minor units) |
| `<bid count>` | 3 |
| `<stale minimum>` | USD5,210 (fixed derived): USD4,960 plus USD250, the minimum before customer B's bid |
| `<next minimum>` | USD5,710 (fixed derived): `<current bid>` plus USD500 |

**Steps:**

1. Enter `<amount>` in the custom maximum, place the bid, and read the bid form.
2. Reload and read Highest bid, the bid count, Recent Bids and the standing.
3. Open `<my auctions url>`, then `<bids url>`, and look for `<listing_29>`.

**Expected Results:**

* Step 1 shows `<refusal>`.
* Step 2 reads `<current bid>`, `<bid count>` bids, Recent Bids unchanged, and no Leading or Outbid standing for the customer.
* Step 3 finds `<listing_29>` on neither page.

<!-- trace:case id=g10.auction-auction.TC-dim rev=1 covers=g10.auction-auction.SC-rl3,g10.auction-auction.SC-lu0,g10.auction-auction.SC-fnt,g10.auction-auction.SC-nh5,g10.auction-auction.SC-ulv -->
### g10.auction-auction.US14-TC2: A rival's refused bid moves nothing for the leader

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-14

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auction/auction-bids.spec.ts`

**Pre-conditions:**

* customer A leads `<listing_68>` at `<current bid>` with a maximum of USD8,400, and is on its page.
* customer B(card linked) has no bid on it and is on its page in a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_68>` | An open USD listing |
| `<current bid>` | USD5,210 (range: 500000–549999 minor units) |
| `<below minimum>` | USD5,709 (fixed boundary): one dollar under `<current bid>` plus USD500 |

**Steps:**

1. As customer B, enter `<below minimum>` and place the bid.
2. As customer A, without reloading, read Highest bid, Recent Bids and the standing.
3. As customer A, open `<my auctions url>` and read `<listing_68>`'s row.
4. As customer A, read the inbox for a letter about `<listing_68>` sent after step 1.

**Expected Results:**

* Step 1 is refused on customer B's bid form.
* Step 2 reads `<current bid>`, Recent Bids unchanged, and customer A Leading.
* Step 3's row reads Leading, Current bid `<current bid>`.
* Step 4 finds no new-bid or outbid letter.

<!-- trace:case id=g10.auction-auction.TC-m0b rev=1 covers=g10.auction-auction.SC-rl3,g10.auction-auction.SC-lu0,g10.auction-auction.SC-fnt,g10.auction-auction.SC-nh5,g10.auction-auction.SC-ulv -->
### g10.auction-auction.US14-TC3: A bid whose answer is lost reads by the bidder's standing

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-14

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auction/auction-bids.spec.ts`

**Pre-conditions:**

* customer(card linked) is signed in on `<listing_69>`'s page with `<standing before>`.
* The network is made to drop `<dropped>`.

**Test data:**

| `<standing before>` | `<amount>` | `<dropped>` | `<bid form>` | `<standing after>` |
| --- | --- | --- | --- | --- |
| No bid | `<maximum>` | The answer, after the auction accepts the bid | Placed, Leading with Your maximum `<maximum>` | Leading, Your maximum `<maximum>`, with a row on My Auctions |
| No bid | `<maximum>` | The request, before the auction receives it | Could not place this bid. | No bid and no row on My Auctions |
| Leading, Your maximum `<maximum>` | `<raised maximum>` | The answer, after the auction accepts the raise | Placed, Leading with Your maximum `<raised maximum>` | Leading, Your maximum `<raised maximum>` |
| Leading, Your maximum `<maximum>` | `<raised maximum>` | The request, before the auction receives it | Could not place this bid. | Leading, Your maximum `<maximum>` |

| Field | Value |
| --- | --- |
| `<listing_69>` | An open USD listing with no other bidder, starting at USD280 |
| `<maximum>` | USD560 (range: 28000–89999 minor units) |
| `<raised maximum>` | USD920 (range: 90000–399999 minor units) |

**Steps:**

1. Enter `<amount>` in the custom maximum, place the bid, and read the bid form once it settles.
2. Reload and read the standing.
3. Open `<my auctions url>` and look for `<listing_69>`.

**Expected Results:**

* Step 1 reads `<bid form>`, never both placed and refused.
* Steps 2 and 3 agree with `<standing after>`.

<!-- trace:case id=g10.auction-auction.TC-55k rev=1 covers=g10.auction-auction.SC-rl3,g10.auction-auction.SC-lu0,g10.auction-auction.SC-fnt,g10.auction-auction.SC-nh5,g10.auction-auction.SC-ulv,g10.auction-auction.SC-cfg -->
### g10.auction-auction.US14-TC4: The ceiling refusal shows no message and sends no retry

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-14

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/shared/ui/auction-listing/custom-maximum-ceiling.spec.ts`

**Pre-conditions:**

* customer(card linked, in good standing) holds no bid on `<listing_70>`, does not watch it, and is on its page with `<valid draft>` typed.
* The auction's next answer is made to be its above-ceiling refusal, `<with ceiling>` and `<with server message>`.

**Test data:**

| `<with ceiling>` | `<with server message>` |
| --- | --- |
| naming the USD10,000,000 ceiling | carrying a server message |
| naming no ceiling | carrying a server message |
| naming the USD10,000,000 ceiling | carrying no server message |
| naming no ceiling | carrying no server message |

| Field | Value |
| --- | --- |
| `<listing_70>` | An open USD listing led by customer B at USD5,210, with 3 bids |
| `<valid draft>` | 5710, the minimum next bid |

**Steps:**

1. Place the bid and wait for the refusal.
2. Read the bid form, the custom maximum field and the number of attempts sent.
3. Reload and read the public bids and the standing; then open My Auctions and the Bids page.

**Expected Results:**

* Step 2 shows no maximum-bid, refusal or server message and no toast; the bid action is usable again; the draft still reads `<valid draft>`; one attempt was sent, with no retry.
* Step 3 shows the price, leader, bid count and public bids unchanged, no Leading or Outbid standing, and no record of the attempt on either page.

## Ungrouped

### g10.auction-auction.US5: Collector reads the catalogue in one order

<!-- trace:case id=g10.auction-auction.TC-2gb rev=1 covers=g10.auction-auction.SC-5vk,g10.auction-auction.SC-c4r,g10.auction-auction.SC-icd,g10.auction-auction.SC-zvy,g10.auction-auction.SC-zv8,g10.auction-auction.SC-4je,g10.auction-auction.SC-7l1,g10.auction-auction.SC-tb4,g10.auction-auction.SC-iyy,g10.auction-auction.SC-cys,g10.auction-auction.SC-ned,g10.auction-auction.SC-fs8 -->
#### g10.auction-auction.US5-TC5: With no Featured slot, the catalogue shows All auctions alone

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auction/catalogue-access.spec.ts`

**Pre-conditions:**

* No complete Featured slot is set, and All auctions holds at least one listing.

**Steps:**

1. Open `<auction url>` and read its sections.

**Expected Results:**

* No Featured band shows, and All auctions shows its listings in the resting order.

<!-- trace:case id=g10.auction-auction.TC-j25 rev=1 covers=g10.auction-auction.SC-5vk,g10.auction-auction.SC-c4r,g10.auction-auction.SC-icd,g10.auction-auction.SC-zvy,g10.auction-auction.SC-zv8,g10.auction-auction.SC-4je,g10.auction-auction.SC-7l1,g10.auction-auction.SC-tb4,g10.auction-auction.SC-iyy,g10.auction-auction.SC-cys,g10.auction-auction.SC-ned,g10.auction-auction.SC-fs8 -->
#### g10.auction-auction.US5-TC7: With no listing in All auctions, Featured still shows

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auction/catalogue-access.spec.ts`

**Pre-conditions:**

* At least one complete Featured slot is set, and no listing is available for All auctions.

**Steps:**

1. Open `<auction url>` and read Featured and All auctions.

**Expected Results:**

* Featured shows its slides, and All auctions says there are no auctions.

### g10.auction-auction.US6: Collector reads Featured on the catalogue

<!-- trace:case id=g10.auction-auction.TC-zwc rev=1 covers=g10.auction-auction.SC-kis,g10.auction-auction.SC-3g8,g10.auction-auction.SC-8d7,g10.auction-auction.SC-rl4,g10.auction-auction.SC-wea -->
#### g10.auction-auction.US6-TC2: A slide's current bid rolls up when the price rises

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-06

**Pre-conditions:**

* customer is on `<auction url>` with `<featured listing>`'s slide showing `<bid before>`; customer B(card linked) is on `<featured listing>`'s page in a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| `<featured listing>` | A published Active listing |
| `<bid before>` | The slide's current bid |
| `<bid after>` | The minimum next bid the listing offers |

**Steps:**

1. As customer B, place `<bid after>`.
2. As customer, without reloading, read the slide's current bid.

**Expected Results:**

* It rolls up from `<bid before>` to `<bid after>`.

<!-- trace:case id=g10.auction-auction.TC-b8d rev=1 covers=g10.auction-auction.SC-kis,g10.auction-auction.SC-3g8,g10.auction-auction.SC-8d7,g10.auction-auction.SC-rl4,g10.auction-auction.SC-wea -->
#### g10.auction-auction.US6-TC5: An incomplete Featured slot is not shown

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
* **Trace:** grade10-site-auction-auction-US-06

**Pre-conditions:**

* The only Featured slot holds `<slot>`.

**Test data:**

| `<slot>` |
| --- |
| An eligible listing and no image |
| An image and no listing |

**Steps:**

1. Open `<auction url>` and look for a Featured band.

**Expected Results:**

* No Featured band shows; All auctions follows the page chrome.

### g10.auction-auction.US7: Collector advances Featured slides

<!-- trace:case id=g10.auction-auction.TC-72n rev=1 covers=g10.auction-auction.SC-94x -->
#### g10.auction-auction.US7-TC1: The progress dots move between two slides

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-07

**Pre-conditions:**

* customer is on `<auction url>`; two complete Featured slots hold `<listing a>` then `<listing b>`.

**Steps:**

1. Read the slide, advance with the progress dots, and read it again.

**Expected Results:**

* It shows `<listing a>`, then `<listing b>`, with two progress dots.

<!-- trace:case id=g10.auction-auction.TC-fbj rev=1 covers=g10.auction-auction.SC-94x -->
#### g10.auction-auction.US7-TC4: [Mobile only] Stage next moves between two slides

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-07

**Pre-conditions:**

* customer is on `<auction url>` on a mobile-width screen; two complete Featured slots hold `<listing a>` then `<listing b>`.

**Steps:**

1. Read the slide, select stage next on its image, and read it again.

**Expected Results:**

* It shows `<listing a>`, then pages across to `<listing b>`, with the dots marking `<listing b>`.

<!-- trace:case id=g10.auction-auction.TC-7lv rev=1 covers=g10.auction-auction.SC-94x -->
#### g10.auction-auction.US7-TC3: A single slide shows no dots or stage arrows

**Classification:**

* **Severity:** trivial
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-07

**Pre-conditions:**

* customer is on `<auction url>`; exactly one complete Featured slot is set.

**Steps:**

1. Read the Featured band's controls.

**Expected Results:**

* The one slide shows, with no multi-dot advance and no stage previous or next.

## Settled

- A listing only the house bid on, its commit at or before the scheduled close, enters extended bidding and sells at the opening price, as any lone bid does.
- A listing the house leads at its close is sold to its internal bidder: the close opens that bidder's order, flagged internal, with no invoice, no charge to any card and no letter; collectors read the listing sold under the house's pseudonym.

## Reconciliation

- **Covered at domain** — `g10.auction-dmn.US7-TC3` walks `grade10-site-auction-auction-SC-06`: a price-moving bid in extended bidding restarts the close
- **Covered at domain** — `g10.auction-dmn.US7-TC3` walks `grade10-site-auction-auction-SC-65` and `grade10-site-auction-auction-SC-66`: the card moves with a bid and counts to the new close
- **Covered at domain** — `g10.auction-dmn.US12-TC1` walks `grade10-site-auction-auction-SC-88`: the card shows its closed state with no result, then the result, without a reload
- **Covered at domain** - `g10.auction-dmn.US3-TC2` reads the bid form's words for a maximum not raised, the row of `grade10-site-auction-auction-SC-91` this suite leaves to it
- **Covered at domain** - `grade10-site-auction-auction-SC-109` is also walked by `g10.auction-dmn.US13-TC1`; `grade10-site-auction-auction-SC-02` by `g10.auction-dmn.US13-TC1`
