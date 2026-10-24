# grade10-site/auction/bidding-history Test Cases

**Status:** reopened · 15/40
**Drafts styled:** 2026-10-24, tcs-rules r7
**Regenerated:** 2026-10-24, tcs-rules r7

## Background

* `<bids url>` is `<g10url>/bids`, the signed-in account's Bids page on the Grade10 site of the environment under test: Active and Completed summaries, each expanding into that listing's combined history. A listing's page carries Your bidding beside public Recent bids. `<zzz url>` is the ZZZ site.
* Every listing is priced in USD. The step is chosen by the amount being beaten: +USD1 from USD0, +USD2 from USD10, +USD25 from USD200, +USD100 from USD1,000, +USD500 from USD5,000.

## Walk 1: Read one collector's bids across states

Starting state:

- customer A(signed in) bid on `<leading listing>` and still leads it, and set then raised a maximum there.
- customer A bid on `<outbid listing>`, since led by customer B; won `<won listing>`; and bid on `<called-off listing>` before an operator called it off.

Shared test data:

| Field | Value |
| --- | --- |
| leading listing | An open USD listing customer A leads |
| outbid listing | An open USD listing customer B leads |
| won listing | A closed listing customer A won |
| called-off listing | A listing called off after customer A's bid |

### Route

1. Open `<bids url>`.
   - Active shows inside the site chrome. `g10.auction-bidding-history.US5-TC1`
   - Active lists `<leading listing>` and `<outbid listing>` only. `g10.auction-bidding-history.US1-TC3`
   - `<leading listing>` shows once, Leading, with its current price; `<outbid listing>` shows Outbid. `g10.auction-bidding-history.US1-TC6`
   - `<leading listing>` shows once, at its latest activity, though customer A set and raised a maximum on it. `g10.auction-bidding-history.US1-TC1`
2. Expand `<outbid listing>`.
   - Its history names the public movement that outbid You, and offers a way to the open listing. `g10.auction-bidding-history.US5-TC2`
3. Select Completed.
   - The page stays the same, now listing `<won listing>` and `<called-off listing>`. `g10.auction-bidding-history.US5-TC1`
   - `<won listing>` reads Won and `<called-off listing>` Canceled, each with its final price. `g10.auction-bidding-history.US1-TC6`

## Walk 2: Read one listing's bidding from its page

Starting state:

- customer A(signed in) set a maximum on `<listing>`, raised it, then had a further raise refused; Grade10 has placed bids for customer A there.
- customer B, whose account email is ada@example.com, holds a private maximum on `<listing>`.
- customer A is on `<listing>`'s page, with Recent bids, the live maximum and standing noted.

Shared test data:

| Field | Value |
| --- | --- |
| listing | An open USD listing both customers bid on |

### Route

1. Read customer B's row in Recent bids.
   - Its avatar shows A beside the listing pseudonym, never the email or a name. `g10.auction-bidding-history.US9-TC1`
2. Activate Your bidding.
   - It opens on Bid placed, listed first, showing each bid Grade10 placed for customer A. `g10.auction-bidding-history.US7-TC1`
3. Activate Your maximums.
   - It lists the raise, then the set, each an amount and a time, and never the refused raise or customer B's maximum. `g10.auction-bidding-history.US6-TC2`
4. Close the dialog and read the listing.
   - Recent bids, the live maximum and standing match the note. `g10.auction-bidding-history.US7-TC3`

## g10.auction-bidding-history.US1: Collector reads their bidding index

**As a** collector,
**I want** every listing I placed a bid on in one private index,
**so that** I can see my standing without hunting through the catalogue.

### g10.auction-bidding-history.US1-TC1: Repeated activity is grouped under one listing

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer(signed in) set a maximum on `<listing_3>`, then raised it.

**Steps:**

1. Open `<bids url>` and find `<listing_3>`.

**Expected Results:**

* `<listing_3>` shows once, at the place of its latest activity, with the customer's current standing.

<!-- trace:case id=g10.auction-bidding-history.TC-c6d rev=1 covers=g10.auction-bidding-history.SC-sg5,g10.auction-bidding-history.SC-nt1,g10.auction-bidding-history.SC-70a,g10.auction-bidding-history.SC-cpz -->
### g10.auction-bidding-history.US1-TC3: Active and Completed separate open from finished listings

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer(signed in) has accepted bids on open `<listing_9>`, closed `<listing_10>` and called-off `<listing_11>`.

**Steps:**

1. Open `<bids url>`, select Active, then Completed.

**Expected Results:**

* Active lists `<listing_9>` only.
* Completed lists `<listing_10>` and `<listing_11>`.

<!-- trace:case id=g10.auction-bidding-history.TC-wit rev=1 covers=g10.auction-bidding-history.SC-sg5,g10.auction-bidding-history.SC-nt1,g10.auction-bidding-history.SC-70a,g10.auction-bidding-history.SC-cpz,g10.auction-bidding-history.SC-33x,g10.auction-bidding-history.SC-8d3 -->
### g10.auction-bidding-history.US1-TC6: Each listing reads Leading, Outbid, Won or Canceled

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

* customer A(signed in) placed a bid on `<listing_18>`, which is now `<state>`.

**Test data:**

| `<state>` | `<filter>` | `<standing>` |
| --- | --- | --- |
| Open, customer A leading | Active | Leading |
| Open, customer B leading | Active | Outbid |
| Closed, customer A won | Completed | Won |
| Closed, customer B won | Completed | Outbid |
| Called off after customer A's bid | Completed | Canceled |

**Steps:**

1. Open `<bids url>`, select `<filter>`, and find `<listing_18>`.

**Expected Results:**

* `<listing_18>` shows once, reading `<standing>` with its current or final price.

<!-- trace:case id=g10.auction-bidding-history.TC-bhz rev=2 covers=g10.auction-bidding-history.SC-sg5,g10.auction-bidding-history.SC-nt1,g10.auction-bidding-history.SC-70a,g10.auction-bidding-history.SC-cpz -->
### g10.auction-bidding-history.US1-TC2: A listing whose only bid was refused is not in the Bids page

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer(signed in, card linked) has an accepted bid on `<listing_6>`, has never bid on `<listing_7>`, and is on `<listing_7>`'s page.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_6>` | An open USD listing the customer bid on |
| `<listing_7>` | An open USD listing with no bid, starting at `<opening price>` |
| `<opening price>` | USD370 (range: 20000–99999 minor units) |
| `<refused bid>` | USD120 (range: below `<opening price>`) |

**Steps:**

1. Enter `<refused bid>` in the custom maximum and confirm.
2. Open `<bids url>`, select Active, then Completed.

**Expected Results:**

* Step 1: the bid form names the minimum, `<opening price>`.
* Step 2 lists `<listing_6>` and never `<listing_7>`; every standing reads Leading, Outbid, Won or Canceled.

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

* customer(signed in) has more Active listings than one page holds, and no new activity happens during the pass.

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

* customer(signed in) has placed no bid; another Grade10 account, and a ZZZ account with the same account id, have bids.

**Steps:**

1. Open `<bids url>`.

**Expected Results:**

* The page is empty, and it is this account's.

<!-- trace:case id=g10.auction-bidding-history.TC-hv4 rev=1 covers=g10.auction-bidding-history.SC-sg5,g10.auction-bidding-history.SC-nt1,g10.auction-bidding-history.SC-70a,g10.auction-bidding-history.SC-cpz,g10.auction-bidding-history.SC-33x,g10.auction-bidding-history.SC-8d3 -->
### g10.auction-bidding-history.US1-TC7: A refused bid leaves an Outbid listing where it was

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

* customer A(signed in, card linked) bid on `<listing_21>` and `<listing_22>`, later on `<listing_22>`; customer B has since outbid customer A on `<listing_21>`.
* customer A is on `<listing_21>`'s page.

**Test data:**

| Field | Value |
| --- | --- |
| `<current bid>` | USD5,460 (range: 500000–799999 minor units), `<listing_21>`'s current bid |
| `<next minimum>` | USD5,960 (fixed derived): `<current bid>` plus the USD500 step |
| `<refused bid>` | `<current bid>` (fixed: below `<next minimum>`) |

**Steps:**

1. Enter `<refused bid>` in the custom maximum and confirm.
2. Open `<bids url>`, read Active, and expand `<listing_21>`.

**Expected Results:**

* Step 1: the bid form names `<next minimum>`.
* Step 2: `<listing_21>` reads Outbid at `<current bid>`, still below `<listing_22>`, its latest activity time and its history those of its last accepted bid.

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

* customer A placed a bid on `<listing_24>`; customer B watches it and never bid; an operator then called it off.

**Steps:**

1. As customer A, open `<bids url>` and select Completed.
2. As customer B, open `<bids url>` and select Active, then Completed.

**Expected Results:**

* Step 1 lists `<listing_24>`, Canceled.
* Step 2 lists customer B's own listings and never `<listing_24>`.

---

## g10.auction-bidding-history.US2: Collector audits every maximum Grade10 accepted

**As a** collector,
**I want** every maximum Grade10 accepts for me kept as a private event,
**so that** I can see what I set or raised, and what was placed automatically, without exposing my maximum to a rival.

<!-- trace:case id=g10.auction-bidding-history.TC-1ao rev=2 covers=g10.auction-bidding-history.SC-vd5,g10.auction-bidding-history.SC-qhu,g10.auction-bidding-history.SC-qvv -->
### g10.auction-bidding-history.US2-TC1: An accepted bid is recorded once, as a maximum

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer(signed in, card linked) has not bid on `<listing_27>`, which has no other bidder and opens at USD100, and is on its page.

**Test data:**

| Field | Value |
| --- | --- |
| `<maximum>` | USD560 (range: 50000–99999 minor units) |

**Steps:**

1. Enter `<maximum>` in the custom maximum and place the bid.
2. Open `<bids url>` and expand `<listing_27>`.

**Expected Results:**

* Step 2 shows one event, a maximum set at `<maximum>`.

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

* customer A(signed in, card linked) leads `<listing_30>` with a maximum of `<maximum>`; its history on `<bids url>` and its bid count are noted; customer A is on its page.

**Test data:**

| Field | Value |
| --- | --- |
| `<maximum>` | USD200 (range: 1000–79999 minor units) |
| `<refused raise>` | `<maximum>` (fixed equality) |

**Steps:**

1. Enter `<refused raise>` in the custom maximum and confirm.
2. Open `<bids url>`, expand `<listing_30>`, then return to its page and read the bid count.

**Expected Results:**

* Step 1 keeps `<maximum>` as the maximum on file.
* Step 2 shows the noted history and bid count.

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

* customer(signed in, card linked) has not bid on `<listing_33>`; `<bids url>` is noted.

**Test data:**

| Field | Value |
| --- | --- |
| `<malformed maximum>` | 10.50 (fixed: not whole dollars) |

**Steps:**

1. Open `<listing_33>`, type `<malformed maximum>` in the custom maximum, and read it.
2. Return to `<bids url>`.

**Expected Results:**

* Step 1 shows `<malformed maximum>` not accepted, and no bid is sent.
* Step 2 matches the note.

<!-- trace:case id=g10.auction-bidding-history.TC-5aw rev=1 covers=g10.auction-bidding-history.SC-vd5,g10.auction-bidding-history.SC-qhu,g10.auction-bidding-history.SC-qvv -->
### g10.auction-bidding-history.US2-TC4: Set and raised maximums are recorded and stay private

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

* customer A(signed in, card linked) has not bid on `<listing_36>`, which opens at USD280, and is on its page; customer B can open the same listing.

**Test data:**

| Field | Value |
| --- | --- |
| `<first maximum>` | USD420 (range: 28000–79999 minor units) |
| `<raised maximum>` | USD560 (range: above `<first maximum>`) |

**Steps:**

1. As customer A, place `<first maximum>`, then `<raised maximum>`.
2. Open `<bids url>` and expand `<listing_36>`.
3. As customer B, open `<bids url>`.
4. Signed out, open `<listing_36>` and read Recent bids.

**Expected Results:**

* Step 2 records `<first maximum>`, then `<raised maximum>`.
* Step 3 lists customer B's own listings only.
* Step 4 shows the public price under a listing pseudonym, and neither maximum.

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

* customer A leads `<listing_39>` at USD280 with a maximum of USD680; customer B(signed in, card linked) is on its page.

**Test data:**

| Field | Value |
| --- | --- |
| `<customer B maximum>` | USD430 (range: below USD680) |

**Steps:**

1. As customer B, place `<customer B maximum>`.
2. As customer A, open `<bids url>` and expand `<listing_39>`.
3. Signed out, open `<listing_39>` and read the new price.

**Expected Results:**

* Step 2 labels customer A's answering movement as automatic.
* Step 3 shows the new price under the listing pseudonym.

---
## g10.auction-bidding-history.US3: Collector reads one listing's combined history

**As a** collector,
**I want** one chronology of public price movement and my private standing,
**so that** I can see how I was outbid without seeing anyone's hidden maximum.

<!-- trace:case id=g10.auction-bidding-history.TC-sow rev=1 covers=g10.auction-bidding-history.SC-pbt,g10.auction-bidding-history.SC-9ii,g10.auction-bidding-history.SC-k4s,g10.auction-bidding-history.SC-dtm,g10.auction-bidding-history.SC-uqt,g10.auction-bidding-history.SC-kwx,g10.auction-bidding-history.SC-09w,g10.auction-bidding-history.SC-usg,g10.auction-bidding-history.SC-oyw,g10.auction-bidding-history.SC-4lm,g10.auction-bidding-history.SC-vc4 -->
### g10.auction-bidding-history.US3-TC1: A competing bid shows customer A outbid at the public price

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer A(signed in) leads `<listing_42>` at `<opening price>`, with a maximum equal to `<opening price>`.
* customer B(signed in, card linked) is on `<listing_42>`'s page.

**Test data:**

| Field | Value |
| --- | --- |
| `<opening price>` | USD360 (range: 1000–79999 minor units) |
| `<customer B maximum>` | USD520 (range: above `<opening price>`) |

**Steps:**

1. As customer B, enter `<customer B maximum>` in the custom maximum and place the bid.
2. As customer A, open `<bids url>` and expand `<listing_42>`.

**Expected Results:**

* Step 2 shows customer B under the listing pseudonym, and customer A outbid at the public price, never at `<customer B maximum>`.

<!-- trace:case id=g10.auction-bidding-history.TC-i8u rev=1 covers=g10.auction-bidding-history.SC-pbt,g10.auction-bidding-history.SC-9ii,g10.auction-bidding-history.SC-k4s,g10.auction-bidding-history.SC-dtm,g10.auction-bidding-history.SC-uqt,g10.auction-bidding-history.SC-kwx,g10.auction-bidding-history.SC-09w,g10.auction-bidding-history.SC-usg,g10.auction-bidding-history.SC-oyw,g10.auction-bidding-history.SC-4lm,g10.auction-bidding-history.SC-vc4 -->
### g10.auction-bidding-history.US3-TC2: An automatic response is attributed to customer A after the bid it answers

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer A(signed in) leads `<listing_45>` at `<current bid>` with a maximum of `<customer A maximum>`.
* customer B(signed in, card linked) is on `<listing_45>`'s page.

**Test data:**

| Field | Value |
| --- | --- |
| `<current bid>` | USD300 (range: 1000–79999 minor units) |
| `<customer A maximum>` | USD650 (range: above `<customer B maximum>`) |
| `<customer B maximum>` | USD410 (range: above `<current bid>`) |

**Steps:**

1. As customer B, enter `<customer B maximum>` in the custom maximum and place the bid.
2. As customer A, open `<bids url>` and expand `<listing_45>`.

**Expected Results:**

* Customer B's bid comes first and customer A's answering movement follows it, labelled automatic, the two read as one step.

<!-- trace:case id=g10.auction-bidding-history.TC-mug rev=1 covers=g10.auction-bidding-history.SC-pbt,g10.auction-bidding-history.SC-9ii,g10.auction-bidding-history.SC-k4s,g10.auction-bidding-history.SC-dtm,g10.auction-bidding-history.SC-uqt,g10.auction-bidding-history.SC-kwx,g10.auction-bidding-history.SC-09w,g10.auction-bidding-history.SC-usg,g10.auction-bidding-history.SC-oyw,g10.auction-bidding-history.SC-4lm,g10.auction-bidding-history.SC-vc4 -->
### g10.auction-bidding-history.US3-TC4: A long history loads in full, each entry once

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

* customer(signed in) has more history entries on `<listing_48>` than one page holds; no new bid lands during the pass.

**Steps:**

1. Open `<bids url>`, expand `<listing_48>`, and load every further page of its history.

**Expected Results:**

* Every entry shows exactly once, in the same order.

<!-- trace:case id=g10.auction-bidding-history.TC-iuc rev=1 covers=g10.auction-bidding-history.SC-dtm,g10.auction-bidding-history.SC-uqt,g10.auction-bidding-history.SC-kwx,g10.auction-bidding-history.SC-09w,g10.auction-bidding-history.SC-usg,g10.auction-bidding-history.SC-oyw,g10.auction-bidding-history.SC-4lm,g10.auction-bidding-history.SC-vc4,g10.auction-bidding-history.SC-pbt,g10.auction-bidding-history.SC-9ii,g10.auction-bidding-history.SC-k4s,g10.auction-bidding-history.SC-1rj -->
### g10.auction-bidding-history.US3-TC5: Loading more never splits one bid and its answer

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

* On `<listing_51>`, customer A raised to `<accepted price>`, customer B answered automatically at `<response price>`, and customer A was outbid, between an older and a newer rival price; the history holds more than one page; no new bid lands during the pass.

**Test data:**

| Field | Value |
| --- | --- |
| `<accepted price>` | USD320 (range: 10000–49999 minor units) |
| `<response price>` | USD330 (fixed derived): `<accepted price>` plus the USD10 step |

**Steps:**

1. As customer A, open `<bids url>`, expand `<listing_51>`, and load every further page.

**Expected Results:**

* `<accepted price>`, customer B's answer at `<response price>` and the Outbid standing show together, never split by a further page.

<!-- trace:case id=g10.auction-bidding-history.TC-mq5 rev=1 covers=g10.auction-bidding-history.SC-dtm,g10.auction-bidding-history.SC-uqt,g10.auction-bidding-history.SC-kwx,g10.auction-bidding-history.SC-09w,g10.auction-bidding-history.SC-usg,g10.auction-bidding-history.SC-oyw,g10.auction-bidding-history.SC-4lm,g10.auction-bidding-history.SC-vc4,g10.auction-bidding-history.SC-pbt,g10.auction-bidding-history.SC-9ii,g10.auction-bidding-history.SC-k4s,g10.auction-bidding-history.SC-1rj -->
### g10.auction-bidding-history.US3-TC6: A rival maximum at or below the leader's is answered automatically

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
* **Trace:** grade10-site-auction-bidding-history-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer A leads `<listing_54>` at USD4 with a maximum of USD10.
* customer B(signed in, card linked) has not bid on `<listing_54>` and is on its page.

**Test data:**

| `<customer B maximum>` | `<answer>` |
| --- | --- |
| USD5 | USD6 |
| USD7 | USD8 |
| USD9 | USD10 |
| USD10 | USD10 (fixed: tie, the earlier maximum keeps the lead) |

**Steps:**

1. As customer B, enter `<customer B maximum>` in the custom maximum and place the bid.
2. Read Recent bids.

**Expected Results:**

* Customer B's bid at `<customer B maximum>` comes first, then customer A's automatic answer at `<answer>`, both under listing pseudonyms; customer A leads.

<!-- trace:case id=g10.auction-bidding-history.TC-sc6 rev=1 -->
### g10.auction-bidding-history.US3-TC7: A rival maximum above the leader's takes the lead once, capped at that maximum

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

* customer A leads `<listing_54>` at USD4 with a maximum of USD10.
* customer B(signed in, card linked) has not bid on `<listing_54>` and is on its page.

**Test data:**

| `<customer B maximum>` | `<price>` |
| --- | --- |
| USD11 | USD11 (fixed: USD10 plus the USD2 step, capped at `<customer B maximum>`) |
| USD13 | USD12 (fixed derived: USD10 plus the USD2 step) |

**Steps:**

1. As customer B, enter `<customer B maximum>` in the custom maximum and place the bid.
2. Read Recent bids.
3. Open `<bids url>` and expand `<listing_54>`.

**Expected Results:**

* Step 2 adds one bid, customer B's at `<price>`, and no new bid for customer A; customer B leads.
* Step 3 shows `<customer B maximum>` as customer B's maximum set.

<!-- trace:case id=g10.auction-bidding-history.TC-ybl rev=1 covers=g10.auction-bidding-history.SC-pbt,g10.auction-bidding-history.SC-9ii,g10.auction-bidding-history.SC-k4s,g10.auction-bidding-history.SC-dtm,g10.auction-bidding-history.SC-uqt,g10.auction-bidding-history.SC-kwx,g10.auction-bidding-history.SC-09w,g10.auction-bidding-history.SC-usg,g10.auction-bidding-history.SC-oyw,g10.auction-bidding-history.SC-4lm,g10.auction-bidding-history.SC-vc4 -->
### g10.auction-bidding-history.US3-TC3: Failed attempt sits beside unchanged auction state

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-bidding-history-US-03

**Retirement:** A refused bid is no longer kept as a history event; `g10.auction-bidding-history.US2-TC2` holds that a refusal adds nothing.

**Pre-conditions:**

* A collector's attempt fails while another bidder leads.

**Steps:**

1. Open `<bids url>` and expand that listing.

**Expected Results:**

* The listing's price and leading pseudonym are unchanged.

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

* customer A(signed in) and customer B have each bid on `<listing_57>`, and customer B on `<listing_58>`, where customer A never bid.

**Steps:**

1. As customer A, open `<bids url>`, select Active then Completed, and expand `<listing_57>`.

**Expected Results:**

* `<listing_58>` is never listed.
* `<listing_57>`'s history shows customer A's own maximums and the public price under listing pseudonyms, never customer B's maximum.

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

* Grade10 and ZZZ each have an account with the same account id; the Grade10 account has bid on `<listing_60>`.

**Steps:**

1. Sign in to `<zzz url>` as that account and open its bidding history.

**Expected Results:**

* `<listing_60>` and its maximums never show; only ZZZ's own activity does.

<!-- trace:case id=g10.auction-bidding-history.TC-87o rev=1 covers=g10.auction-bidding-history.SC-onh,g10.auction-bidding-history.SC-2pg,g10.auction-bidding-history.SC-uu5,g10.auction-bidding-history.SC-izn -->
### g10.auction-bidding-history.US4-TC4: Reading history changes nothing on the listing

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

* customer(signed in) has a history on `<listing_63>`; its price, the customer's maximum and standing, and its closing time are noted.

**Steps:**

1. Open `<bids url>`, load every page, and expand and page `<listing_63>`'s history.
2. Open `<listing_63>`.

**Expected Results:**

* Step 2 matches the note.

---

## g10.auction-bidding-history.US5: Collector opens their bids at /bids

**As a** collector,
**I want** `/bids` to show my active and completed summaries and expand each
listing's history,
**so that** I can audit standing without leaving the page.

<!-- trace:case id=g10.auction-bidding-history.TC-p6t rev=1 covers=g10.auction-bidding-history.SC-jfn,g10.auction-bidding-history.SC-bis,g10.auction-bidding-history.SC-k1b,g10.auction-bidding-history.SC-3qb,g10.auction-bidding-history.SC-pej,g10.auction-bidding-history.SC-kcd,g10.auction-bidding-history.SC-pfa,g10.auction-bidding-history.SC-j51,g10.auction-bidding-history.SC-wrj,g10.auction-bidding-history.SC-7tw -->
### g10.auction-bidding-history.US5-TC1: The Bids page opens on Active inside the site chrome

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

* customer(signed in) has active and completed bids.

**Steps:**

1. Open `<bids url>`.
2. Select Completed.

**Expected Results:**

* Step 1 shows the Active summaries inside the site chrome.
* Step 2 stays on the same page, showing the Completed summaries.

<!-- trace:case id=g10.auction-bidding-history.TC-04o rev=1 covers=g10.auction-bidding-history.SC-jfn,g10.auction-bidding-history.SC-bis,g10.auction-bidding-history.SC-k1b,g10.auction-bidding-history.SC-3qb,g10.auction-bidding-history.SC-pej,g10.auction-bidding-history.SC-kcd,g10.auction-bidding-history.SC-pfa,g10.auction-bidding-history.SC-j51,g10.auction-bidding-history.SC-wrj,g10.auction-bidding-history.SC-7tw -->
### g10.auction-bidding-history.US5-TC2: An Outbid summary explains the outbid and leads to the listing

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

* customer(signed in) is outbid on open `<listing_66>`.

**Steps:**

1. Open `<bids url>` and expand `<listing_66>`.
2. Follow its way to the listing.

**Expected Results:**

* Step 1 names the public movement that outbid You.
* Step 2 opens `<listing_66>`'s page.

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

* The visitor is signed out and has a Grade10 account.

**Steps:**

1. Open `<bids url>`.
2. Sign in.

**Expected Results:**

* Step 1 opens the sign-in.
* Step 2 lands on the Bids page.

<!-- trace:case id=g10.auction-bidding-history.TC-u0u rev=1 covers=g10.auction-bidding-history.SC-jfn,g10.auction-bidding-history.SC-bis,g10.auction-bidding-history.SC-k1b,g10.auction-bidding-history.SC-3qb,g10.auction-bidding-history.SC-pej,g10.auction-bidding-history.SC-kcd,g10.auction-bidding-history.SC-pfa,g10.auction-bidding-history.SC-j51,g10.auction-bidding-history.SC-wrj,g10.auction-bidding-history.SC-7tw -->
### g10.auction-bidding-history.US5-TC4: An empty filter says so

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

* customer(signed in) has completed bids and no active bid.

**Steps:**

1. Open `<bids url>` on Active.

**Expected Results:**

* The list shows the Active empty state in its place.

<!-- trace:case id=g10.auction-bidding-history.TC-5h6 rev=1 covers=g10.auction-bidding-history.SC-jfn,g10.auction-bidding-history.SC-bis,g10.auction-bidding-history.SC-k1b,g10.auction-bidding-history.SC-3qb,g10.auction-bidding-history.SC-pej,g10.auction-bidding-history.SC-kcd,g10.auction-bidding-history.SC-pfa,g10.auction-bidding-history.SC-j51,g10.auction-bidding-history.SC-wrj,g10.auction-bidding-history.SC-7tw -->
### g10.auction-bidding-history.US5-TC5: A slow first load holds the list's place

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

* customer(signed in) has bids; the Bids list is slow to answer.

**Steps:**

1. Open `<bids url>` and read the page before the list answers.

**Expected Results:**

* A labelled loading state holds the list's place inside the site chrome.

<!-- trace:case id=g10.auction-bidding-history.TC-u23 rev=1 covers=g10.auction-bidding-history.SC-jfn,g10.auction-bidding-history.SC-bis,g10.auction-bidding-history.SC-k1b,g10.auction-bidding-history.SC-3qb,g10.auction-bidding-history.SC-pej,g10.auction-bidding-history.SC-kcd,g10.auction-bidding-history.SC-pfa,g10.auction-bidding-history.SC-j51,g10.auction-bidding-history.SC-wrj,g10.auction-bidding-history.SC-7tw -->
### g10.auction-bidding-history.US5-TC6: A failed list offers a retry

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

* customer(signed in) has bids; the Bids list fails to load.

**Steps:**

1. Open `<bids url>`.

**Expected Results:**

* The list's place shows an error with a retry.

<!-- trace:case id=g10.auction-bidding-history.TC-jy9 rev=1 covers=g10.auction-bidding-history.SC-jfn,g10.auction-bidding-history.SC-bis,g10.auction-bidding-history.SC-k1b,g10.auction-bidding-history.SC-3qb,g10.auction-bidding-history.SC-pej,g10.auction-bidding-history.SC-kcd,g10.auction-bidding-history.SC-pfa,g10.auction-bidding-history.SC-j51,g10.auction-bidding-history.SC-wrj,g10.auction-bidding-history.SC-7tw -->
### g10.auction-bidding-history.US5-TC7: A slow history keeps its summary in view

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

* customer(signed in) has a summary for `<listing_69>` on `<bids url>`; its history is slow to answer.

**Steps:**

1. Expand `<listing_69>` and read it before the history answers.

**Expected Results:**

* The summary stays in view, with a labelled loading state in the history's place.

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

* customer(signed in) has more Active listings than one page holds, on `<bids url>`.

**Steps:**

1. Activate the next-page control twice in quick succession.

**Expected Results:**

* The listings already shown stay in view, and the next page appears once, with no listing repeated.

<!-- trace:case id=g10.auction-bidding-history.TC-e9b rev=1 covers=g10.auction-bidding-history.SC-jfn,g10.auction-bidding-history.SC-bis,g10.auction-bidding-history.SC-k1b,g10.auction-bidding-history.SC-3qb,g10.auction-bidding-history.SC-pej,g10.auction-bidding-history.SC-kcd,g10.auction-bidding-history.SC-pfa,g10.auction-bidding-history.SC-j51,g10.auction-bidding-history.SC-wrj,g10.auction-bidding-history.SC-7tw -->
### g10.auction-bidding-history.US5-TC9: A failed history keeps its summary and the others usable

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

* customer(signed in) has summaries for `<listing_72>` and `<listing_73>` on `<bids url>`; `<listing_72>`'s history fails to load.

**Steps:**

1. Expand `<listing_72>`.
2. Expand `<listing_73>`.

**Expected Results:**

* Step 1 keeps `<listing_72>`'s summary, with an error and a retry in its history's place.
* Step 2 shows `<listing_73>`'s history.

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

1. Sign in to `<zzz url>` and look through its account menu.
2. Open `<zzz url>/bids`.

**Expected Results:**

* Step 1 offers no Bids page.
* Step 2 shows Page not found.

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

* customer(signed in) set one maximum on `<listing_102>`, and Grade10 has placed no bid for them there; customer is on its page.

**Steps:**

1. Activate Your bidding.
2. Activate Your maximums.

**Expected Results:**

* Step 1 opens Your bidding with Bid placed, then Your maximums; Bid placed is active and empty.
* Step 2 lists the maximum's amount and time; the live maximum stays on the bid panel.

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

* customer(signed in) set a maximum on `<listing_105>`, raised it, then had a further raise refused; customer is on its page.

**Steps:**

1. Activate Your bidding, then Your maximums.
2. Open `<bids url>` and expand `<listing_105>`.

**Expected Results:**

* Step 1 lists the raise, then the set, each an amount and a time, and never the refused raise.
* Step 2 lists the same two amounts.

<!-- trace:case id=g10.auction-bidding-history.TC-s22 rev=1 covers=g10.auction-bidding-history.SC-roe -->
### g10.auction-bidding-history.US6-TC3: Your bidding is private and reading it changes nothing

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

* customer A(signed in) and customer B have both bid on `<listing_108>`, customer B with a private maximum; customer A is on its page, with Recent bids, the live maximum and standing noted.

**Steps:**

1. Activate Your bidding and read Bid placed and Your maximums.
2. Close the dialog and read the listing.

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

* customer(signed in) has a maximum on `<listing_111>` and Grade10 has placed bids for them there; customer is on its page.

**Steps:**

1. Activate Your bidding.
2. Activate Your maximums.

**Expected Results:**

* Step 1 opens on Bid placed, listed first, showing each bid Grade10 placed for the customer with its amount and time.
* Step 2 lists every set and raise, newest first, each an amount and a time; the live maximum stays on the bid panel.

<!-- trace:case id=g10.auction-bidding-history.TC-j30 rev=1 covers=g10.auction-bidding-history.SC-mx5,g10.auction-bidding-history.SC-u76,g10.auction-bidding-history.SC-g01 -->
### g10.auction-bidding-history.US7-TC2: Bid placed stays the default before any bid is placed

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-07

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer(signed in) set one maximum on `<listing_114>`, and Grade10 has placed no bid for them there; customer is on its page.

**Steps:**

1. Activate Your bidding.
2. Activate Your maximums, then Bid placed.

**Expected Results:**

* Step 1 opens on Bid placed, empty.
* Step 2 keeps the two tabs separate.

<!-- trace:case id=g10.auction-bidding-history.TC-7py rev=1 covers=g10.auction-bidding-history.SC-mx5,g10.auction-bidding-history.SC-u76,g10.auction-bidding-history.SC-g01 -->
### g10.auction-bidding-history.US7-TC3: Switching tabs changes nothing on the listing

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-07

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer(signed in) has rows in both tabs on `<listing_117>` and is on its page, with standing, live maximum and Recent bids noted.

**Steps:**

1. Activate Your bidding and switch between Bid placed and Your maximums.
2. Close the dialog and read the listing.

**Expected Results:**

* Step 2 matches the note.

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

* customer(signed in) set a maximum on `<listing_120>`, raised it, then had a further raise refused.

**Steps:**

1. Open `<bids url>` and expand `<listing_120>`.

**Expected Results:**

* The history reads a maximum set and a maximum raised, with their amounts, and no refusal; the account navigation stays on the Bids page.

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

* customer B, whose account email is `<email>`, has bid on `<listing_123>`; customer A(signed in) is on its page.

**Test data:**

| `<email>` | `<letter>` |
| --- | --- |
| ada@example.com | A |
| 123@example.com | B (fixed: no letter in the email) |
| Erased by customer B's account deletion | B (fixed: no email) |

**Steps:**

1. Read customer B's row in Recent bids.

**Expected Results:**

* The row's avatar shows `<letter>` beside the listing pseudonym, and never customer B's email or name.

---

## Settled

- A refused bid is not a bid: it adds no listing to `/bids`, no history entry and no standing, and moves no listing.
- `/bids` standing is Leading, Outbid, Won or Canceled.
- A lot lost at the close reads Outbid on `/bids` and Didn't win on My Auctions.

## Reconciliation

- **Covered at domain** - `g10.auction-dmn.US3-TC2` walks `grade10-site-auction-bidding-history-SC-29`: a maximum below the next bid is refused and its history gains no event
