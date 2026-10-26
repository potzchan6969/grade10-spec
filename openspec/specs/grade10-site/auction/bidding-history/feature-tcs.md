# grade10-site/auction/bidding-history Test Cases

**Status:** reopened · 8/27
**Drafts styled:** 2026-10-24, tcs-rules r7
**Regenerated:** 2026-10-24, tcs-rules r7

## Walk 1: Read one collector's bids across states

Starting state:

- customer A leads `<leading listing>`, where it set then raised a maximum; customer B leads `<outbid listing>` over customer A; customer A won `<won listing>` and bid on `<called-off listing>` before an operator called it off.

Shared test data:

| Field | Value |
| --- | --- |
| leading listing | An open USD listing |
| outbid listing | An open USD listing |
| won listing | A closed listing |
| called-off listing | A listing called off after customer A's bid |

### Route

1. Open `<bids url>`.
   - Active, inside the site chrome, lists the leading and outbid listings once each, Leading and Outbid with their prices. `g10.auction-bidding-history.US1-TC1`
2. Expand `<leading listing>`.
   - A maximum set, then a maximum raised, and no refusal. `g10.auction-bidding-history.US8-TC1`
3. Select Completed.
   - The won listing reads Won and the called-off one Canceled, each with its final price. `g10.auction-bidding-history.US1-TC1`

## Walk 2: Read one listing's bidding from its page

Starting state:

- customer A set a maximum on `<listing>`, raised it, then had a further raise refused; Grade10 has placed bids for customer A there; customer B, email ada@example.com, holds a private maximum there; customer A is on its page, with Recent bids, the live maximum and standing noted.

Shared test data:

| Field | Value |
| --- | --- |
| listing | An open USD listing both customers bid on |

### Route

1. Read customer B's row in Recent bids.
   - Its avatar shows A beside the listing pseudonym. `g10.auction-bidding-history.US9-TC1`
2. Activate Your bidding.
   - It opens on Bid placed, listed first, with each bid Grade10 placed for customer A. `g10.auction-bidding-history.US7-TC1`
3. Activate Your maximums.
   - The raise, then the set, never the refused raise or customer B's maximum. `g10.auction-bidding-history.US6-TC2`
4. Close the dialog.
   - Recent bids, the live maximum and standing match the note. `g10.auction-bidding-history.US6-TC3`

## Background

* `<bids url>` is `<g10url>/bids`, the signed-in account's Bids page: Active and Completed summaries, each expanding into that listing's history. A listing's page carries Your bidding beside public Recent bids. `<zzz url>` is the ZZZ site.
* Every listing is priced in USD, whole dollars: +USD1 from USD0, +USD2 from USD10, +USD25 from USD200, +USD100 from USD1,000, +USD500 from USD5,000.
* Collectors are signed in with a card linked, on separate sessions.

* `<bids url>` is `<g10url>/bids`, the signed-in account's Bids page, where a listing's summary expands into its history.
* Bids and maximums are whole units. The step is chosen by the amount being beaten: 1 from 0, 2 from 10, 25 from 200, 100 from 1,000, 500 from 5,000.
* Collectors are signed in with a card linked, on separate sessions.

## g10.auction-bidding-history.US1: Collector reads their bidding index

**As a** collector,
**I want** every listing I placed a bid on in one private index,
**so that** I can see my standing without hunting through the catalogue.

### g10.auction-bidding-history.US1-TC1: Each listing shows once, under Active or Completed, reading its standing

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer A placed bids on `<listing>`, set and raised a maximum there, and it is now `<state>`.

**Test data:**

| `<state>` | `<filter>` | `<standing>` |
| --- | --- | --- |
| open, customer A leading | Active | Leading |
| open, customer B leading | Active | Outbid |
| closed, customer A won | Completed | Won |
| closed, customer B won | Completed | Outbid |
| called off after customer A's bid | Completed | Canceled |

**Steps:**

1. Open `<bids url>`, select `<filter>`, and find `<listing>`; then select the other filter.

**Expected Results:**

* Under `<filter>` it shows once, at its latest activity, reading `<standing>` with its current or final price; it is absent under the other filter.

<!-- trace:case id=g10.auction-bidding-history.TC-s3o rev=1 covers=g10.auction-bidding-history.SC-sg5,g10.auction-bidding-history.SC-nt1,g10.auction-bidding-history.SC-70a,g10.auction-bidding-history.SC-cpz -->
### g10.auction-bidding-history.US1-TC4: Paging repeats and skips no listing

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer has more Active listings than one page holds; no new activity happens during the pass.

**Steps:**

1. Open `<bids url>` and load every further page.

**Expected Results:**

* Every active listing shows exactly once, in latest-activity order.

<!-- trace:case id=g10.auction-bidding-history.TC-ev8 rev=1 covers=g10.auction-bidding-history.SC-sg5,g10.auction-bidding-history.SC-nt1,g10.auction-bidding-history.SC-70a,g10.auction-bidding-history.SC-cpz -->
### g10.auction-bidding-history.US1-TC5: An account with no bids sees its own empty Bids page

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer has placed no bid; another Grade10 account, and a ZZZ account with the same account id, have bids.

**Steps:**

1. Open `<bids url>`, under Active and Completed.

**Expected Results:**

* Both are empty, each with its empty state, and nothing of the other accounts shows.

<!-- trace:case id=g10.auction-bidding-history.TC-92c rev=1 covers=g10.auction-bidding-history.SC-sg5,g10.auction-bidding-history.SC-nt1,g10.auction-bidding-history.SC-70a,g10.auction-bidding-history.SC-cpz,g10.auction-bidding-history.SC-33x,g10.auction-bidding-history.SC-8d3 -->
### g10.auction-bidding-history.US1-TC8: A call-off adds no listing for a collector who never bid on it

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer B watches `<listing>` and never bid; an operator called it off.

**Steps:**

1. As customer B, open `<bids url>` under Active and Completed.

**Expected Results:**

* `<listing>` is never listed.

---

## g10.auction-bidding-history.US2: Collector audits every maximum Grade10 accepted

**As a** collector,
**I want** every maximum Grade10 accepts for me kept as a private event,
**so that** I can see what I set or raised, and what was placed automatically, without exposing my maximum to a rival.

<!-- trace:case id=g10.auction-bidding-history.TC-5aw rev=1 covers=g10.auction-bidding-history.SC-vd5,g10.auction-bidding-history.SC-qhu,g10.auction-bidding-history.SC-qvv -->
### g10.auction-bidding-history.US2-TC4: Each accepted maximum is recorded once, set or raised, and stays private

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer A has not bid on `<listing>`, which opens at USD280 with no other bidder; customer B can open the same listing.

**Steps:**

1. As customer A, place a maximum of USD420, then raise it to USD560.
2. Open `<bids url>` and expand `<listing>`.
3. As customer B, open `<bids url>`; then, signed out, open `<listing>` and read Recent bids.

**Expected Results:**

* Step 2 records one maximum set at USD420, then one raised to USD560.
* Step 3: customer B's Bids page lists only its own listings; Recent bids shows the public price under a listing pseudonym, and neither maximum.

<!-- trace:case id=g10.auction-bidding-history.TC-q0n rev=2 covers=g10.auction-bidding-history.SC-vd5,g10.auction-bidding-history.SC-qhu,g10.auction-bidding-history.SC-qvv -->
### g10.auction-bidding-history.US2-TC2: A refused raise adds nothing to the history

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer A leads `<listing>` with a maximum of USD200; its history and bid count are noted.

**Steps:**

1. Commit USD200 again.
2. Expand `<listing>` on `<bids url>`, and read its bid count.

**Expected Results:**

* Step 1 keeps USD200 as the maximum; step 2 matches the note.

<!-- trace:case id=g10.auction-bidding-history.TC-l6l rev=1 covers=g10.auction-bidding-history.SC-vd5,g10.auction-bidding-history.SC-qhu,g10.auction-bidding-history.SC-qvv -->
### g10.auction-bidding-history.US2-TC3: An amount with cents is stopped in the field and sends nothing

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer has not bid on `<listing>`; `<bids url>` is noted.

**Steps:**

1. On `<listing>`, type 10.50 in the custom maximum and read it.
2. Return to `<bids url>`.

**Expected Results:**

* Step 1 does not accept 10.50 and sends no bid; step 2 matches the note.

<!-- trace:case id=g10.auction-bidding-history.TC-shn rev=1 covers=g10.auction-bidding-history.SC-vd5,g10.auction-bidding-history.SC-qhu,g10.auction-bidding-history.SC-qvv -->
### g10.auction-bidding-history.US2-TC5: A bid Grade10 placed is labelled automatic

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer A leads `<listing>` at USD280 with a maximum of USD680.

**Steps:**

1. As customer B, place a maximum of USD430.
2. As customer A, expand `<listing>` on `<bids url>`.

**Expected Results:**

* customer A's answering movement, to USD455 (USD430 plus the USD25 step), is labelled automatic.

---

## g10.auction-bidding-history.US3: Collector reads one listing's combined history

**As a** collector,
**I want** one history of public price movement and my private standing,
**so that** I can see how I was outbid without seeing anyone's hidden maximum.

<!-- trace:case id=g10.auction-bidding-history.TC-sow rev=2 covers=g10.auction-bidding-history.SC-pbt,g10.auction-bidding-history.SC-9ii,g10.auction-bidding-history.SC-k4s,g10.auction-bidding-history.SC-dtm,g10.auction-bidding-history.SC-uqt,g10.auction-bidding-history.SC-kwx,g10.auction-bidding-history.SC-09w,g10.auction-bidding-history.SC-usg,g10.auction-bidding-history.SC-oyw,g10.auction-bidding-history.SC-4lm,g10.auction-bidding-history.SC-vc4,g10.auction-bidding-history.SC-m9q -->
### g10.auction-bidding-history.US3-TC1: History interleaves public movement with the collector's own, highest amount on top

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
* **Trace:** grade10-site-auction-bidding-history-US-03

**Pre-conditions:**

* `<listing>` opens at 300 with no bid; customer A set a maximum of `<A maximum>` on it, so leads at 300; customer B is on its page.

**Test data:**

| `<A maximum>` | `<B maximum>` | `<history after>` |
| --- | --- | --- |
| 300 (fixed: equal to the price) | 520 | customer B's bid at 325 marking You were outbid, as one step; then your bid at 300; then your maximum set at 300; never 520 |
| 650 (above the price) | 410 | your automatic bid at 435, as one step; then customer B's bid at 410; then your bid at 300; then your maximum set at 650, last though the higher amount |

**Steps:**

1. As customer B, place `<B maximum>`.
2. As customer A, expand `<listing>` on `<bids url>`.

**Expected Results:**

* Read from the top, the history reads `<history after>`, in the public price, never a rival's maximum.

<!-- trace:case id=g10.auction-bidding-history.TC-mq5 rev=2 covers=g10.auction-bidding-history.SC-pbt,g10.auction-bidding-history.SC-9ii,g10.auction-bidding-history.SC-k4s,g10.auction-bidding-history.SC-dtm,g10.auction-bidding-history.SC-uqt,g10.auction-bidding-history.SC-kwx,g10.auction-bidding-history.SC-09w,g10.auction-bidding-history.SC-usg,g10.auction-bidding-history.SC-oyw,g10.auction-bidding-history.SC-4lm,g10.auction-bidding-history.SC-vc4,g10.auction-bidding-history.SC-1rj,g10.auction-bidding-history.SC-m9q,g10.auction-bidding-history.SC-d6n -->
### g10.auction-bidding-history.US3-TC6: A rival maximum against a leader's writes the stated public history

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
* **Trace:** grade10-site-auction-bidding-history-US-03

**Pre-conditions:**

* `<listing>` opens at 4 with no bid; customer A set a maximum of 10 on it, so leads at 4; customer B has not bid on it.

**Test data:**

| `<B maximum>` | `<recent bids>` | `<B history>` |
| --- | --- | --- |
| 5 | customer B at 5, then customer A's automatic 6 | customer A's automatic 6; then You at 5; then your maximum set at `<B maximum>`; then customer A's bid at 4 |
| 9 | customer B at 9, then customer A's automatic 10 | customer A's automatic 10; then You at 9; then your maximum set at `<B maximum>`; then customer A's bid at 4 |
| 10 (fixed: tie) | customer B at 10, then customer A's automatic 10, customer A leading as the earlier maximum | customer A's automatic 10, above You at 10, the same amount; then your maximum set at `<B maximum>`; then customer A's bid at 4 |
| 11 | customer B at 11 once (10 plus the 2 step, capped), no new row for customer A | You at 11; then your maximum set at `<B maximum>`; then customer A's bid at 4 |
| 13 | customer B at 12 once (10 plus the 2 step), no new row for customer A | You at 12; then your maximum set at `<B maximum>`, below the bid though the higher amount; then customer A's bid at 4 |

**Steps:**

1. As customer B, place `<B maximum>`.
2. Read Recent bids.
3. Open `<bids url>` and expand `<listing>`.

**Expected Results:**

* Step 2: Recent bids reads `<recent bids>` under listing pseudonyms.
* Step 3: read from the top, customer B's history reads `<B history>`, with a maximum set at `<B maximum>`, and customer A only under the listing pseudonym.

<!-- trace:case id=g10.auction-bidding-history.TC-mug rev=1 covers=g10.auction-bidding-history.SC-pbt,g10.auction-bidding-history.SC-9ii,g10.auction-bidding-history.SC-k4s,g10.auction-bidding-history.SC-dtm,g10.auction-bidding-history.SC-uqt,g10.auction-bidding-history.SC-kwx,g10.auction-bidding-history.SC-09w,g10.auction-bidding-history.SC-usg,g10.auction-bidding-history.SC-oyw,g10.auction-bidding-history.SC-4lm,g10.auction-bidding-history.SC-vc4 -->
### g10.auction-bidding-history.US3-TC4: A long history loads in full, each entry once, never splitting one bid from its answer

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer A's history on `<listing>` holds more entries than one page; in it customer A raised to USD320, customer B answered automatically at USD330, and customer A was outbid; no new bid lands during the pass.

**Steps:**

1. Open `<bids url>`, expand `<listing>`, and load every further page.

**Expected Results:**

* Every entry shows once, in order, and USD320, customer B's USD330 and the Outbid standing show together, never split by a further page.

<!-- trace:case id=g10.auction-bidding-history.TC-c8f rev=1 covers=g10.auction-bidding-history.SC-y3v -->
### g10.auction-bidding-history.US3-TC7: A maximum raise that causes no bid reads by its time, newer above older

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
* **Trace:** grade10-site-auction-bidding-history-US-03

**Pre-conditions:**

* `<listing>` opens at 280 with no bid; customer A has not bid on it; customer B can open its page.

**Test data:**

| `<then B places>` | `<A history>` |
| --- | --- |
| nothing | your maximum raised to 560, caused no bid; then your bid at 280; then your maximum set at 420, below the bid though the higher amount |
| a maximum of 700 | customer B's bid at 585 marking You were outbid, as one step; then your maximum raised to 560; then your bid at 280; then your maximum set at 420 |
| a maximum of 500 | your automatic response at 525 and customer B's bid at 500, as one step, both newer than the raise and so above it though lower; then your maximum raised to 560; then your bid at 280; then your maximum set at 420 |

**Steps:**

1. As customer A, place a maximum of 420, then raise it to 560.
2. As customer B, place `<then B places>`, unless it says nothing.
3. As customer A, open `<bids url>` and expand `<listing>`.

**Expected Results:**

* Read from the top, the history reads `<A history>`, in the public price, never customer B's maximum.

---

## g10.auction-bidding-history.US4: Collector's bidding history stays on their storefront account

**As a** collector,
**I want** only my Grade10 account's history,
**so that** another storefront or an unsigned visitor cannot read my maximums or my standing.

<!-- trace:case id=g10.auction-bidding-history.TC-nvt rev=1 covers=g10.auction-bidding-history.SC-onh,g10.auction-bidding-history.SC-2pg,g10.auction-bidding-history.SC-uu5,g10.auction-bidding-history.SC-izn -->
### g10.auction-bidding-history.US4-TC1: A Grade10 account reads only its own bidding

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer A and customer B have each bid on `<listing A>`; customer B alone bid on `<listing B>`.

**Steps:**

1. As customer A, open `<bids url>`, under Active and Completed, and expand `<listing A>`.

**Expected Results:**

* `<listing B>` is never listed; `<listing A>`'s history shows customer A's own maximums and the public price, never customer B's maximum.

<!-- trace:case id=g10.auction-bidding-history.TC-0mp rev=1 covers=g10.auction-bidding-history.SC-onh,g10.auction-bidding-history.SC-2pg,g10.auction-bidding-history.SC-uu5,g10.auction-bidding-history.SC-izn -->
### g10.auction-bidding-history.US4-TC2: The same account id on ZZZ sees none of the Grade10 bidding

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-bidding-history-US-04

**Pre-conditions:**

* Grade10 and ZZZ each have an account with the same account id; the Grade10 one bid on `<listing>`.

**Steps:**

1. Sign in to `<zzz url>` as that account and open its bidding history.

**Expected Results:**

* `<listing>` and its maximums never show.

<!-- trace:case id=g10.auction-bidding-history.TC-87o rev=1 covers=g10.auction-bidding-history.SC-onh,g10.auction-bidding-history.SC-2pg,g10.auction-bidding-history.SC-uu5,g10.auction-bidding-history.SC-izn -->
### g10.auction-bidding-history.US4-TC4: Reading the Bids page changes nothing on the listing

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer has a history on `<listing>`; its price, the customer's maximum and standing, and its close are noted.

**Steps:**

1. Open `<bids url>`, load every page, and expand and page `<listing>`'s history.
2. Open `<listing>`.

**Expected Results:**

* Step 2 matches the note.

---

## g10.auction-bidding-history.US5: Collector opens their bids at /bids

**As a** collector,
**I want** `/bids` to show my active and completed summaries and expand each
listing's history,
**so that** I can audit standing without leaving the page.

<!-- trace:case id=g10.auction-bidding-history.TC-p6t rev=1 covers=g10.auction-bidding-history.SC-jfn,g10.auction-bidding-history.SC-bis,g10.auction-bidding-history.SC-k1b,g10.auction-bidding-history.SC-3qb,g10.auction-bidding-history.SC-pej,g10.auction-bidding-history.SC-kcd,g10.auction-bidding-history.SC-pfa,g10.auction-bidding-history.SC-j51,g10.auction-bidding-history.SC-wrj,g10.auction-bidding-history.SC-7tw -->
### g10.auction-bidding-history.US5-TC1: The Bids page opens on Active inside the site chrome, an empty filter saying so

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer has `<bids>`.

**Test data:**

| `<bids>` | `<active reads>` |
| --- | --- |
| active and completed bids | the Active summaries |
| completed bids only | the Active empty state |

**Steps:**

1. Open `<bids url>`.
2. Select Completed.

**Expected Results:**

* Step 1 shows `<active reads>` inside the site chrome; step 2 stays on the same page with the Completed summaries.

<!-- trace:case id=g10.auction-bidding-history.TC-9al rev=1 covers=g10.auction-bidding-history.SC-jfn,g10.auction-bidding-history.SC-bis,g10.auction-bidding-history.SC-k1b,g10.auction-bidding-history.SC-3qb,g10.auction-bidding-history.SC-pej,g10.auction-bidding-history.SC-kcd,g10.auction-bidding-history.SC-pfa,g10.auction-bidding-history.SC-j51,g10.auction-bidding-history.SC-wrj,g10.auction-bidding-history.SC-7tw -->
### g10.auction-bidding-history.US5-TC3: Signing in from the Bids page returns to it

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* A signed-out visitor has an account.

**Steps:**

1. Open `<bids url>` and sign in.

**Expected Results:**

* Sign-in opens first, then the Bids page.

<!-- trace:case id=g10.auction-bidding-history.TC-5h6 rev=1 covers=g10.auction-bidding-history.SC-jfn,g10.auction-bidding-history.SC-bis,g10.auction-bidding-history.SC-k1b,g10.auction-bidding-history.SC-3qb,g10.auction-bidding-history.SC-pej,g10.auction-bidding-history.SC-kcd,g10.auction-bidding-history.SC-pfa,g10.auction-bidding-history.SC-j51,g10.auction-bidding-history.SC-wrj,g10.auction-bidding-history.SC-7tw -->
### g10.auction-bidding-history.US5-TC5: A slow read holds its place with a labelled loading state

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-bidding-history-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer has bids; `<read>` is slow to answer.

**Test data:**

| `<read>` | `<route>` |
| --- | --- |
| the list | open `<bids url>` |
| one listing's history | expand that listing |

**Steps:**

1. `<route>` and read the page before the read answers.

**Expected Results:**

* A labelled loading state holds the read's place inside the site chrome; an expanded summary stays in view.

<!-- trace:case id=g10.auction-bidding-history.TC-u23 rev=1 covers=g10.auction-bidding-history.SC-jfn,g10.auction-bidding-history.SC-bis,g10.auction-bidding-history.SC-k1b,g10.auction-bidding-history.SC-3qb,g10.auction-bidding-history.SC-pej,g10.auction-bidding-history.SC-kcd,g10.auction-bidding-history.SC-pfa,g10.auction-bidding-history.SC-j51,g10.auction-bidding-history.SC-wrj,g10.auction-bidding-history.SC-7tw -->
### g10.auction-bidding-history.US5-TC6: A failed read offers a retry and leaves the rest usable

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-bidding-history-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer has bids on `<listing A>` and `<listing B>`; `<read>` fails.

**Test data:**

| `<read>` | `<route>` |
| --- | --- |
| the list | open `<bids url>` |
| `<listing A>`'s history | expand `<listing A>`, then `<listing B>` |

**Steps:**

1. `<route>`.

**Expected Results:**

* The failed read's place shows an error with a retry, `<listing A>`'s summary staying in view, and `<listing B>`'s history opens.

<!-- trace:case id=g10.auction-bidding-history.TC-h9q rev=1 covers=g10.auction-bidding-history.SC-jfn,g10.auction-bidding-history.SC-bis,g10.auction-bidding-history.SC-k1b,g10.auction-bidding-history.SC-3qb,g10.auction-bidding-history.SC-pej,g10.auction-bidding-history.SC-kcd,g10.auction-bidding-history.SC-pfa,g10.auction-bidding-history.SC-j51,g10.auction-bidding-history.SC-wrj,g10.auction-bidding-history.SC-7tw -->
### g10.auction-bidding-history.US5-TC8: Loading more keeps what is shown and loads the page once

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer has more Active listings than one page holds, on `<bids url>`.

**Steps:**

1. Activate the next-page control twice in quick succession.

**Expected Results:**

* The listings shown stay, and the next page appears once, with no listing repeated.

<!-- trace:case id=g10.auction-bidding-history.TC-nyy rev=1 covers=g10.auction-bidding-history.SC-jfn,g10.auction-bidding-history.SC-bis,g10.auction-bidding-history.SC-k1b,g10.auction-bidding-history.SC-3qb,g10.auction-bidding-history.SC-pej,g10.auction-bidding-history.SC-kcd,g10.auction-bidding-history.SC-pfa,g10.auction-bidding-history.SC-j51,g10.auction-bidding-history.SC-wrj,g10.auction-bidding-history.SC-7tw -->
### g10.auction-bidding-history.US5-TC10: ZZZ has no Bids page

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** compatibility
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-bidding-history-US-05

**Pre-conditions:**

* customer has a ZZZ account.

**Steps:**

1. Sign in to `<zzz url>`, look through its account menu, and open `<zzz url>/bids`.

**Expected Results:**

* No Bids page is offered, and the address shows Page not found.

---

## g10.auction-bidding-history.US6: Collector reviews maximum history on the listing

**As a** signed-in collector,
**I want** to open **Your bidding** on a listing and read every accepted maximum I set or raised there,
**so that** I can see when I raised the ceiling without leaving the listing or opening the full account chronology.

<!-- trace:case id=g10.auction-bidding-history.TC-p4o rev=1 covers=g10.auction-bidding-history.SC-roe -->
### g10.auction-bidding-history.US6-TC1: Your bidding opens on an empty Bid placed when only a maximum exists

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer set one maximum on `<listing>`, and Grade10 has placed no bid for them there; customer is on its page.

**Steps:**

1. Activate Your bidding.
2. Activate Your maximums, then Bid placed.

**Expected Results:**

* Step 1 opens Your bidding with Bid placed, then Your maximums; Bid placed is active and empty.
* Step 2 lists the maximum's amount and time, then returns to the empty Bid placed; the live maximum stays on the bid panel.

<!-- trace:case id=g10.auction-bidding-history.TC-3hn rev=2 covers=g10.auction-bidding-history.SC-roe -->
### g10.auction-bidding-history.US6-TC2: Your maximums lists each set and raise, never a refused raise

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer set a maximum on `<listing>`, raised it, then had a further raise refused; customer is on its page.

**Steps:**

1. Activate Your bidding, then Your maximums.

**Expected Results:**

* It lists the raise, then the set, each an amount and a time, and never the refused raise.

<!-- trace:case id=g10.auction-bidding-history.TC-s22 rev=1 covers=g10.auction-bidding-history.SC-roe -->
### g10.auction-bidding-history.US6-TC3: Your bidding is private, and reading it changes nothing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer A and customer B have both bid on `<listing>`, customer B with a private maximum; customer A is on its page, with Recent bids, the live maximum and standing noted.

**Steps:**

1. Activate Your bidding, switch between Bid placed and Your maximums, and close it.
2. Read the listing.

**Expected Results:**

* Step 1 lists customer A's amounts and times only, never customer B's maximum.
* Step 2 matches the note.

---

## g10.auction-bidding-history.US7: Collector reviews bids Grade10 placed on the listing

**As a** signed-in collector,
**I want** the listing dialog to separate the bids Grade10 placed for me from my
maximums, open on **Bid placed** by default, and list that tab first,
**so that** I do not read an auto-bid step as my maximum.

<!-- trace:case id=g10.auction-bidding-history.TC-lx1 rev=1 covers=g10.auction-bidding-history.SC-mx5,g10.auction-bidding-history.SC-u76,g10.auction-bidding-history.SC-g01 -->
### g10.auction-bidding-history.US7-TC1: Bid placed opens first and stays apart from Your maximums

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-07

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer holds a maximum on `<listing>` and Grade10 has placed bids for them there; customer is on its page.

**Steps:**

1. Activate Your bidding.
2. Activate Your maximums.

**Expected Results:**

* Step 1 opens on Bid placed, listed first, with each bid Grade10 placed for the customer, its amount and time.
* Step 2 lists every set and raise, newest first; the live maximum stays on the bid panel.

---

## g10.auction-bidding-history.US8: Collector reads clearer maximum labels on /bids

**As a** signed-in collector,
**I want** configure and raise events on `/bids` named as maximum set or raised,
**so that** the account chronology matches the listing wording without a new account tab.

<!-- trace:case id=g10.auction-bidding-history.TC-qo3 rev=2 covers=g10.auction-bidding-history.SC-9ua -->
### g10.auction-bidding-history.US8-TC1: The Bids page names a maximum set and raised, and no refusal

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-08

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer set a maximum on `<listing>`, raised it, then had a further raise refused.

**Steps:**

1. Open `<bids url>` and expand `<listing>`.

**Expected Results:**

* It reads a maximum set and a maximum raised, with their amounts, and no refusal; the account navigation stays on the Bids page.

---

## g10.auction-bidding-history.US9: Collector sees public bid avatars without learning emails

**As a** collector,
**I want** each public bid avatar to show one letter from that bidder's email
without learning their email or name,
**so that** I can tell rivals apart on the public ledger while identity stays
behind the listing pseudonym.

<!-- trace:case id=g10.auction-bidding-history.TC-j1q rev=1 -->
### g10.auction-bidding-history.US9-TC1: A public bid shows one letter from the bidder's email, never the email

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-09

**Pre-conditions:**

* customer B, whose account email is `<email>`, has bid on `<listing>`; customer A is on its page.

**Test data:**

| `<email>` | `<letter>` |
| --- | --- |
| ada@example.com | A |
| _@example.com | B (fixed: no letter or digit in the email) |
| Erased by customer B's account deletion | B (fixed: no email) |

**Steps:**

1. Read customer B's row in Recent bids.

**Expected Results:**

* Its avatar shows `<letter>` beside the listing pseudonym, never customer B's email or name.

---

## Settled

- A refused bid is not a bid: it adds no listing to `/bids`, no history entry and no standing, and moves no listing.
- `/bids` standing is Leading, Outbid, Won or Canceled.
- A lot lost at the close reads Outbid on `/bids` and Didn't win on My Auctions.
- Public recent bids keep their order; only the account's combined history on My bids changes.
- The admin Bids tab keeps its own order.
- A maximum set sorts with the bid it causes, so it reads below that bid even where its amount is higher.
- A maximum raise that causes no bid has none to follow: it reads by its own time among the other records, newer above older.
- An automatic response reads above the bid that caused it, equal maximums included, whoever reads: the earlier leader keeps the lead and both records show the same amount.

## Reconciliation

- **Covered at domain** - `g10.auction-dmn.US3-TC2` walks a refused bid that adds no listing, no history and no standing, and leaves an Outbid listing in place; `g10.auction-dmn.US4-TC1` walks an Outbid summary naming the movement that outbid You and offering the listing
