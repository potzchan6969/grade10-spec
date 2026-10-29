# grade10-site/auction/auction Test Cases

**Status:** reopened · 2/22
**Drafts styled:** 2026-10-24, tcs-rules r7
**Regenerated:** 2026-10-24, tcs-rules r7

## Background

* `<g10url>/auction` is the catalogue: Featured, when an operator has set a complete slot, then All auctions. A listing's page opens from its card. My Auctions and the Bids page are the signed-in collector's own.
* Every listing is priced in USD, whole dollars: +USD250 from USD2,500, +USD500 from USD5,000. A listing with a bid by its scheduled close stays open in extended bidding, 30 minutes from the last price-moving bid, up to an optional cap. No bid takes a card hold.
* Unless a case says otherwise, collectors are signed in with a card linked, on separate sessions.

## Walk 1: Read the catalogue and open a Featured listing

Starting state:

- Two complete Featured slots hold Active `<listing A>` and Upcoming `<listing B>`; All auctions holds more listings than one batch.

Shared test data:

| Field | Value |
| --- | --- |
| listing A | A published Active listing with bids |
| listing B | A published Upcoming listing |

### Route

1. Open `<g10url>/auction`.
   - Featured, then All auctions, and nothing else. `g10.auction-auction.US5-TC5`
2. Read the two slides, moving with the dots.
   - A reads LIVE BIDDING, Ends in, its current bid and Bid Now; B reads UPCOMING, Opens in, no money and View Auction. `g10.auction-auction.US6-TC1`
3. Select Bid Now on A's slide, then go back.
   - A's page opens. `g10.auction-auction.US8-TC1`
4. Scroll All auctions to its end.
   - The next batch loads below, with no pagination. `g10.auction-auction.US5-TC10`

## g10.auction-auction.US1: Collector browses Auction listings

**As a** collector,
**I want** the catalogue to show Auction listings with money in minor units,
**so that** I am not offered Buy Now and a close with bids is absolute.

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
* **Testability:** manual
* **Trace:** grade10-site-auction-auction-US-01

**Pre-conditions:**

* `<listing>` is published with no bid, starting at USD4,000, no cap; its internal bid of USD6,000 commits at `<commit time>`; no collector will bid; customer C is on its page.

**Test data:**

| `<commit time>` |
| --- |
| one minute before the scheduled close |
| exactly the scheduled close |

**Steps:**

1. Read Time left as the scheduled close passes.
2. Let the extended close pass, and read the state, Highest bid and Recent bids.

**Expected Results:**

* Step 1 reads Extended bidding, counting to the scheduled close plus 30 minutes.
* Step 2 reads sold at USD4,000, one bid, under the house's listing pseudonym.

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

* customer has no bid on `<listing>`, which is past its scheduled close in extended bidding, no cap, and is on its page.

**Steps:**

1. Place a bid at the minimum next bid.
2. Read Time left.

**Expected Results:**

* The bid is accepted, and the close moves to 30 minutes after it.

---

## g10.auction-auction.US4: Collector meets the identity bar on a high-value bid

**As a** collector bidding the bar or more on a listing,
**I want** to be told at once that a verified identity is needed and where to get one,
**so that** the auction records nothing for a bid it cannot take, and I can verify and bid again before the listing closes.

<!-- trace:case id=g10.auction-auction.TC-zsd rev=3 covers=g10.auction-auction.SC-d78 -->
### g10.auction-auction.US4-TC1: A bid goes through with no identity asked below the bar, or at it for a verified bidder

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-auction-US-04

**Pre-conditions:**

* customer, identity `<standing>`, has no bid on live `<listing>`, whose minimum next bid is at or below `<bid>`, and is on its page.

**Test data:**

| `<standing>` | `<bid>` |
| --- | --- |
| never verified | USD14,999 (fixed boundary: one dollar under the bar) |
| verified | USD15,000 (fixed boundary: the bar) |
| verified | USD15,500 |

**Steps:**

1. Place `<bid>`.

**Expected Results:**

* It is accepted with no ask for an identity, and customer leads.

<!-- trace:case id=g10.auction-auction.TC-5gi rev=3 covers=g10.auction-auction.SC-uhh,g10.auction-auction.SC-l64 -->
### g10.auction-auction.US4-TC2: A bidder without a verified identity is held at and above the bar

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-auction-US-04

**Pre-conditions:**

* customer, identity `<standing>`, has no bid on live `<listing>`, whose minimum next bid is USD15,000, and is on its page.

**Test data:**

| `<standing>` | `<bid>` |
| --- | --- |
| never verified | USD15,000 (fixed boundary: the bar) |
| expired | USD15,500 |

**Steps:**

1. Place `<bid>` and read the bid form.
2. Select Verify, then return to the listing.
3. Reload, and open My Auctions and the Bids page.

**Expected Results:**

* Step 1 holds the bid, saying bids this high need a verified identity, and offers Verify.
* Step 2 opens the verification page and returns to `<listing>`.
* Step 3 shows Highest bid and the bid count unchanged, and `<listing>` on neither page.

---

## g10.auction-auction.US5: Collector reads the catalogue in one order

**As a** collector,
**I want** All auctions to lead with the listings I can bid on, soonest to close first, and to keep that order as I read on — below Featured when Featured is present, with no category section —,
**so that** what I can still bid on is in front of me and reading further never shows me a listing twice or skips one.

<!-- trace:case id=g10.auction-auction.TC-91h rev=1 covers=g10.auction-auction.SC-5vk,g10.auction-auction.SC-c4r,g10.auction-auction.SC-icd,g10.auction-auction.SC-zvy,g10.auction-auction.SC-zv8,g10.auction-auction.SC-4je,g10.auction-auction.SC-7l1,g10.auction-auction.SC-tb4,g10.auction-auction.SC-iyy,g10.auction-auction.SC-cys,g10.auction-auction.SC-ned,g10.auction-auction.SC-fs8 -->
### g10.auction-auction.US5-TC1: All auctions reads open listings first, each status in its own order

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

* All auctions holds Active listings closing at 18:00 and 19:00 UTC, Upcoming ones opening on 2026-10-01 and 2026-10-02, and Ended ones that closed on 2026-09-22 and 2026-09-15.

**Steps:**

1. Open `<g10url>/auction` and read All auctions in order.

**Expected Results:**

* The Active listings come first, 18:00 before 19:00; then Upcoming, 1 October before 2 October; then Ended, 22 September before 15 September.

<!-- trace:case id=g10.auction-auction.TC-2gb rev=1 covers=g10.auction-auction.SC-5vk,g10.auction-auction.SC-c4r,g10.auction-auction.SC-icd,g10.auction-auction.SC-zvy,g10.auction-auction.SC-zv8,g10.auction-auction.SC-4je,g10.auction-auction.SC-7l1,g10.auction-auction.SC-tb4,g10.auction-auction.SC-iyy,g10.auction-auction.SC-cys,g10.auction-auction.SC-ned,g10.auction-auction.SC-fs8 -->
### g10.auction-auction.US5-TC5: The catalogue holds Featured when set, then All auctions, and nothing else

Runs once per row of **Test data**.

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

* The catalogue holds `<featured>` and `<listings>`.

**Test data:**

| `<featured>` | `<listings>` | `<sections>` |
| --- | --- | --- |
| one complete slot, holding `<listing>` | `<listing>` and others | Featured, then All auctions, `<listing>` in both, once in All auctions |
| no complete slot | some listings | All auctions alone |
| one complete slot | no listing in All auctions | Featured alone |

**Steps:**

1. Open `<g10url>/auction` and read its sections.

**Expected Results:**

* It shows `<sections>`, and no Categories heading, category tile or filter chrome.

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

* All auctions holds more listings than its first batch.

**Steps:**

1. Scroll to the end of the first batch and wait.

**Expected Results:**

* Skeleton cards show below while the next batch loads, then it lands below, the first batch kept, the order holding, and no pagination control.

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

* An Upcoming listing is in All auctions.

**Steps:**

1. Read its card.

**Expected Results:**

* It shows Opens in, and no starting bid or other money.

---

## g10.auction-auction.US6: Collector reads Featured on the catalogue

**As a** collector opening `/auction`,
**I want** the operator's Featured slides when any are set — front page image, title,
status, countdown, current bid and Bid Now —,
**so that** the listings the house leads with are what I meet first.

<!-- trace:case id=g10.auction-auction.TC-5my rev=1 covers=g10.auction-auction.SC-kis,g10.auction-auction.SC-3g8,g10.auction-auction.SC-8d7,g10.auction-auction.SC-rl4,g10.auction-auction.SC-wea -->
### g10.auction-auction.US6-TC1: A Featured slide shows its image, title, status, countdown and money by the listing's status

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
* **Trace:** grade10-site-auction-auction-US-06

**Pre-conditions:**

* The only complete Featured slot holds `<listing>`, `<status>`, and its uploaded front page image.

**Test data:**

| `<status>` | `<slide reads>` |
| --- | --- |
| Active | LIVE BIDDING with a live dot, a relative Ends in, the current bid and Bid Now |
| Upcoming | UPCOMING with no live dot, a relative Opens in, no money and View Auction |

**Steps:**

1. Open `<g10url>/auction` and read the slide.

**Expected Results:**

* It shows the front page image as banner and slab, `<listing>`'s title, and `<slide reads>`.

<!-- trace:case id=g10.auction-auction.TC-d55 rev=1 covers=g10.auction-auction.SC-kis,g10.auction-auction.SC-3g8,g10.auction-auction.SC-8d7,g10.auction-auction.SC-rl4,g10.auction-auction.SC-wea -->
### g10.auction-auction.US6-TC4: Complete slots show in operator order, and an incomplete one is left out

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

* Featured slots 1 to 3 hold listings X, Y and Z with images; slot 2 is then left without its image.

**Steps:**

1. Open `<g10url>/auction` and step through the slides.

**Expected Results:**

* Two slides show, X then Z; Y is not shown in Featured.

---

## g10.auction-auction.US7: Collector advances Featured slides

**As a** collector on `/auction` with more than one Featured slide,
**I want** to move between slides with the progress control, and on a small
viewport also with stage previous/next or a horizontal swipe,
**so that** I can reach every curated listing without leaving the band.

<!-- trace:case id=g10.auction-auction.TC-72n rev=1 covers=g10.auction-auction.SC-94x -->
### g10.auction-auction.US7-TC1: Featured advances to every slide

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
* **Trace:** grade10-site-auction-auction-US-07

**Pre-conditions:**

* Featured holds `<slides>` complete slots, read on `<device>`.

**Test data:**

| `<slides>` | `<device>` | `<advance by>` |
| --- | --- | --- |
| 2 | a desktop browser | the dots |
| 3 | a desktop browser | the dots |
| 2 | [Mobile only] a phone | the stage's next control, then a swipe |

**Steps:**

1. Advance by `<advance by>` until every slide has shown.

**Expected Results:**

* Each slide shows in turn, and the active dot follows.

<!-- trace:case id=g10.auction-auction.TC-7lv rev=1 covers=g10.auction-auction.SC-94x -->
### g10.auction-auction.US7-TC3: A single slide shows no dots or stage arrows

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-07

**Pre-conditions:**

* Featured holds one complete slot.

**Steps:**

1. Read the Featured band on a desktop browser and on a phone.

**Expected Results:**

* No dots and no previous or next control show.

---

## g10.auction-auction.US8: Collector opens a Featured listing

**As a** collector on a Featured slide,
**I want** Bid Now when the listing is Active, or View Auction when it is Upcoming,
to open that listing's details page,
**so that** I land on the listing the catalogue led with.

<!-- trace:case id=g10.auction-auction.TC-ytf rev=1 covers=g10.auction-auction.SC-sh8,g10.auction-auction.SC-b2i -->
### g10.auction-auction.US8-TC1: A slide's action opens its own listing

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
* **Trace:** grade10-site-auction-auction-US-08

**Pre-conditions:**

* Featured holds Active X, then Active Y, then Upcoming Z.

**Test data:**

| `<slide>` | `<action>` |
| --- | --- |
| X, the first | Bid Now |
| Y, after advancing once | Bid Now |
| Z | View Auction |

**Steps:**

1. Show `<slide>` and select `<action>`.

**Expected Results:**

* That slide's listing page opens, never another slide's.

---

## g10.auction-auction.US9: Collector watches from an All auctions card

**As a** signed-in collector reading All auctions,
**I want** the watch control on a card to watch or unwatch that listing the same way as on the listing page and My Auctions,
**so that** I do not learn a second watch rule on the catalogue.

<!-- trace:case id=g10.auction-auction.TC-fjy rev=1 covers=g10.auction-auction.SC-na4,g10.auction-auction.SC-epv -->
### g10.auction-auction.US9-TC1: Watching or unwatching from an All auctions card applies everywhere

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

* customer neither watches nor bid on open `<listing>`, and is on `<g10url>/auction`.

**Steps:**

1. Select the watch control on `<listing>`'s card, then open its page and My Auctions.
2. Back on the catalogue, unwatch it from the card, then reopen its page and My Auctions.

**Expected Results:**

* Step 1: the card, the page and My Auctions read watched, alerts on.
* Step 2: none of them does.

<!-- trace:case id=g10.auction-auction.TC-txe rev=1 covers=g10.auction-auction.SC-na4,g10.auction-auction.SC-epv -->
### g10.auction-auction.US9-TC3: A closed listing's card shows no watch control

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-09

**Pre-conditions:**

* An Ended listing is in All auctions; customer watched it before it closed.

**Steps:**

1. Read its card.

**Expected Results:**

* No watch control shows.

---

## g10.auction-auction.US10: Collector sees a live Featured bid and clock

**As a** collector on an Active Featured slide,
**I want** the current bid to roll when it increases after first paint, and
Ends in to follow the recorded close with the same freshness (including when
extended bidding moves that close), without an Extended label on the banner,
**so that** the lead band matches the live sale without lot-page chrome.

<!-- trace:case id=g10.auction-auction.TC-s8h rev=2 -->
### g10.auction-auction.US10-TC1: A Featured slide shows a new bid and its moved close without a reload

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-10

**Pre-conditions:**

* Featured shows Active `<listing>` at USD4,960, past its scheduled close and in extended bidding with no cap, a few minutes left; customer is on `<g10url>/auction`; customer B is on its page.

**Steps:**

1. As customer B, place USD5,210.
2. As customer, read the slide without reloading.

**Expected Results:**

* The current bid rolls up to USD5,210, and Ends in counts to 30 minutes after the bid.

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

* customer B leads `<listing>` at USD4,960; it is `<state>`, its effective close under a minute away; once customer A's page loads, the browser blocks the auction's time, live and listing reads and runs its clock 30 seconds behind.

**Test data:**

| `<state>` |
| --- |
| in extended bidding, no cap |
| open with an extension of 0, so the scheduled close is the effective close |

**Steps:**

1. Five seconds after the effective close by the auction's clock, as customer A, place USD5,210.
2. Unblock the auction, reload once the close is recorded, and read the result.

**Expected Results:**

* Step 1 reads "Your bid did not go through." alone.
* Step 2: customer B wins at USD4,960, and the close did not move.

---

## g10.auction-auction.US12: Bidder keeps a listing open only by moving its price

**As a** bidder,
**I want** extended bidding to restart only when a bid moves the listing's price,
**so that** a leader cannot keep a listing open by raising their own maximum.

<!-- trace:case id=g10.auction-auction.TC-lmv rev=1 covers=g10.auction-auction.SC-e9w,g10.auction-auction.SC-xd3 -->
### g10.auction-auction.US12-TC1: A change that moves the price restarts the close

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
* **Trace:** grade10-site-auction-auction-US-12

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auction/auction-bids.spec.ts`

**Pre-conditions:**

* `<listing>` is in extended bidding, no cap, its recorded close 5 minutes away, in `<setup>`; customer C is on its page.

**Test data:**

| `<setup>` | `<change>` | `<price after>` |
| --- | --- | --- |
| customer A leads at USD1,260 with a maximum of USD2,360 | customer B places a maximum of USD2,360 | USD2,360, customer A still leading as the earlier maximum |
| customer A leads at USD6,500 with a maximum of USD7,000 over a committed internal bid of USD6,000 | an admin raises the internal bid to USD8,000 | USD7,500 (USD7,000 plus the USD500 step), the house leading |

**Steps:**

1. Make `<change>`.
2. As customer C, read Highest bid, the leader and Time left.

**Expected Results:**

* Highest bid reads `<price after>`, and Time left reads 30 minutes from the change.

<!-- trace:case id=g10.auction-auction.TC-gqo rev=1 covers=g10.auction-auction.SC-e9w,g10.auction-auction.SC-xd3 -->
### g10.auction-auction.US12-TC2: A change that leaves the price where it was leaves the close too

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-12

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auction/auction-bids.spec.ts`

**Pre-conditions:**

* `<listing>` is in extended bidding, no cap, its recorded close 3 minutes away, with `<leader>` leading at USD5,500; customer C is on its page.

**Test data:**

| `<leader>` | `<change>` |
| --- | --- |
| customer A, maximum USD6,000 | customer A raises the maximum to USD9,000 |
| the house, internal bid USD6,000, over customer A's maximum of USD5,000 | an admin raises the internal bid to USD8,000 |
| the house, internal bid USD6,000, over customer A's maximum of USD5,000 | an admin lowers the internal bid to USD5,600 |

**Steps:**

1. Make `<change>`.
2. As customer C, read Highest bid and Time left.

**Expected Results:**

* Highest bid stays USD5,500, and Time left counts on to the same close.

---

## g10.auction-auction.US13: Runner-up takes the lead when the leader's account is erased

**As a** bidder whose maximum is the highest left on a listing,
**I want** to take the lead at a price set by the maxima still standing when the leader's account is erased,
**so that** the listing keeps a leader and I never pay more than the price stood at before.

<!-- trace:case id=g10.auction-auction.TC-yo2 rev=1 -->
### g10.auction-auction.US13-TC1: The runner-up leads at a price no higher than before when the leader's account is erased

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-auction-US-13

**Pre-conditions:**

* customer A leads open `<listing>` at USD6,200 (USD5,700 plus the USD500 step) with a maximum of USD8,400, over customer B's USD5,700 and customer C's USD3,000; customer A's account erasure is ready to complete.

**Steps:**

1. Complete customer A's account erasure.
2. As customer B, reload `<listing>` and read the standing, Highest bid and Recent bids.

**Expected Results:**

* customer B leads at USD3,250 (USD3,000 plus the USD250 step), no higher than USD6,200, and Recent bids names no erased account.

---

## g10.auction-auction.US14: Bidder reads why a bid was refused, and nothing else moves

**As a** bidder,
**I want** above-ceiling attempts to show no maximum-bid message and other refusals to say why on the bid form, with no trace of a refused bid anywhere else,
**so that** an oversized entry does not interrupt my review and I never read a bid I did not place as one I did.

<!-- trace:case id=g10.auction-auction.TC-dim rev=1 covers=g10.auction-auction.SC-rl3,g10.auction-auction.SC-lu0,g10.auction-auction.SC-fnt,g10.auction-auction.SC-nh5,g10.auction-auction.SC-ulv -->
### g10.auction-auction.US14-TC2: A rival's refused bid moves nothing for the leader

**Classification:**

* **Severity:** critical
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

* customer A leads `<listing>` at USD5,210 with a maximum of USD8,400 and is on its page; customer B has no bid on it.

**Steps:**

1. As customer B, place USD5,709, one dollar under the minimum USD5,710.
2. As customer A, without reloading, read the page, then My Auctions and the inbox.

**Expected Results:**

* Step 1 is refused on customer B's bid form.
* Step 2: Highest bid USD5,210, Recent bids unchanged, customer A Leading on the page and My Auctions, and no new-bid or outbid letter.

<!-- trace:case id=g10.auction-auction.TC-m0b rev=1 covers=g10.auction-auction.SC-rl3,g10.auction-auction.SC-lu0,g10.auction-auction.SC-fnt,g10.auction-auction.SC-nh5,g10.auction-auction.SC-ulv -->
### g10.auction-auction.US14-TC3: A bid whose answer is lost reads by the bidder's standing

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-14

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auction/auction-bids.spec.ts`

**Pre-conditions:**

* customer is on `<listing>`'s page, open at USD280 with no other bidder, holding `<before>`; the network drops `<dropped>`.

**Test data:**

| `<before>` | `<amount>` | `<dropped>` | `<reads>` |
| --- | --- | --- | --- |
| no bid | USD560 | the answer, after the auction accepts | Leading, Your maximum USD560, listed on My Auctions |
| no bid | USD560 | the request, before the auction hears it | Could not place this bid.; no bid, not on My Auctions |
| Leading, Your maximum USD560 | USD920 | the answer, after the auction accepts | Leading, Your maximum USD920 |
| Leading, Your maximum USD560 | USD920 | the request, before the auction hears it | Could not place this bid.; Leading, Your maximum USD560 |

**Steps:**

1. Place `<amount>` and read the bid form once it settles.
2. Reload, and open My Auctions.

**Expected Results:**

* Both steps read `<reads>`, never both placed and refused.

---

## Settled

- A bid takes no card hold: it stands when accepted, and nothing is held or charged on the card when a collector bids.
- A refused attempt is not a bid: it writes no bid, standing or history and moves nobody's row.

## Reconciliation

- **Covered at domain** - `g10.auction-dmn.US13-TC1` walks a listing the house leads at the close reading sold under its pseudonym; `g10.auction-dmn.US3-TC2` walks a refused bid showing on the bid form and nowhere else
