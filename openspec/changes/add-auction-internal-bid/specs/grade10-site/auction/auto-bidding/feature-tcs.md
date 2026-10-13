# grade10-site/auction/auto-bidding Test Cases

**Status:** pending-review · 0/6
**Drafts styled:** 2026-10-07, tcs-rules r4

## g10.auction-auto-bidding.US3: Collector competes through two maxima

**As a** collector,
**I want** the current bid to come from the two highest maxima,
**so that** I take the lead only when my maximum is higher, and a tie stays
with whoever committed first.

<!-- trace:case id=g10.auction-auto-bidding.TC-m47 rev=1 covers=g10.auction-auto-bidding.SC-99a -->
### g10.auction-auto-bidding.US3-TC7: A collector's maximum resolves against the house maximum like any other

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
* **Trace:** grade10-site-auction-auto-bidding-US-03

**Pre-conditions:**

* `<listing_1>`'s internal bid of `<house maximum>` was committed at its time, and the house leads at `<starting price>` with no other bid.
* customer A(card linked) is signed in on the lot page for `<listing_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | A published HKD listing taking bids, starting price `<starting price>`, scheduled close a day away |
| `<starting price>` | 400000 minor units (HK$4,000.00) |
| `<house maximum>` | 600000 minor units (HK$6,000.00) |

| Row | customer A's maximum | Leader | Highest bid |
| --- | --- | --- | --- |
| Below the house | 500000 | The house | 508000: customer A's maximum plus its 8000 increment |
| One increment short of the house | 592000 | The house | 600000: customer A's maximum plus 8000, capped at `<house maximum>` |
| Above the house | 700000 | customer A | 608000: `<house maximum>` plus its 8000 increment |

**Steps:**

1. As customer A, enter the row's maximum in the custom maximum on the bid panel and confirm.
2. Read the standing, Highest bid and Recent bids.

**Expected Results:**

* Step 1 is accepted.
* Step 2: the leader and Highest bid read the row's values; customer A reads Outbid or Leading to match.
* Step 2: Recent bids lists customer A's bid and the house's bid that answers it, the house under its listing pseudonym.

<!-- trace:case id=g10.auction-auto-bidding.TC-6gi rev=1 covers=g10.auction-auto-bidding.SC-gct -->
### g10.auction-auto-bidding.US3-TC8: A tie with the house stays with whoever committed first

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-auction-auto-bidding-US-03

**Pre-conditions:**

* `<listing_2>` is published and taking bids, with an internal bid of `<equal maximum>`.
* The order of commitments is as the row states.
* customer A(card linked) is signed in on the lot page for `<listing_2>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_2>` | A published HKD listing taking bids, starting price 400000 minor units, scheduled close a day away |
| `<equal maximum>` | 600000 minor units (HK$6,000.00), the house's and customer A's maximum |

| Row | First committed | Then committed | Leader | Highest bid |
| --- | --- | --- | --- | --- |
| Collector earlier | customer A, `<equal maximum>`, before the internal bid's time | The house, at its time | customer A | `<equal maximum>` |
| House earlier | The house, at its time | customer A, `<equal maximum>`, after the internal bid's time | The house | `<equal maximum>` |

**Steps:**

1. Let the row's two commitments happen in its order.
2. As customer A, read the standing, Highest bid and Recent bids.

**Expected Results:**

* Step 2: the leader is the row's leader, the earlier maximum.
* Step 2: Highest bid reads `<equal maximum>`.
* Step 2: Recent bids lists both bids at `<equal maximum>`, the earlier maximum's row first.

<!-- trace:case id=g10.auction-auto-bidding.TC-19o rev=1 covers=g10.auction-auto-bidding.SC-x57,g10.auction-auto-bidding.SC-99a -->
### g10.auction-auto-bidding.US3-TC9: A collector learns nothing of the house beyond a bidder's pseudonym

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
* **Trace:** grade10-site-auction-auto-bidding-US-03

**Pre-conditions:**

* `<listing_3>`'s internal bid of `<house maximum>` is committed, and the house leads at `<current bid>` over customer A's maximum `<customer A maximum>`.
* `<listing_4>` is published and taking bids with no internal bid, led by customer B at `<current bid>` with maximum `<house maximum>`, over customer A's maximum `<customer A maximum>`.
* customer C is signed in, has never bid on either lot, and is on the lot page for `<listing_3>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_3>` | A published HKD listing taking bids, protected by an internal bid |
| `<listing_4>` | A published HKD listing taking bids, with no internal bid |
| `<house maximum>` | 600000 minor units (HK$6,000.00) |
| `<customer A maximum>` | 500000 minor units (HK$5,000.00) |
| `<current bid>` | 508000 minor units: `<customer A maximum>` plus its 8000 increment |

**Steps:**

1. As customer C, read the bid panel, Highest bid and Recent bids on `<listing_3>`.
2. Read the API response for `<listing_3>`'s public facts.
3. Open the lot page for `<listing_4>` and read the same.
4. Read the API response for `<listing_4>`'s public facts.

**Expected Results:**

* Step 1 reads like step 3: the leader's row carries a listing pseudonym, with no house, reserve or floor wording.
* Step 2 reads like step 4, save the pseudonyms and times: no field names the house or holds `<house maximum>`.
* Neither lot shows the leader's maximum.

<!-- trace:case id=g10.auction-auto-bidding.TC-9jg rev=1 covers=g10.auction-auto-bidding.SC-jd3 -->
### g10.auction-auto-bidding.US3-TC10: A bid just after the house's time meets the house first

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auto-bidding-US-03

**Pre-conditions:**

* `<listing_7>` is published and taking bids, led by customer A at `<starting price>` with maximum `<customer A maximum>`.
* `<listing_7>` has an internal bid of `<house maximum>` at `<commit time>`, still ahead.
* No page is open on `<listing_7>`, and nobody else will bid on it.
* customer B(card linked) is signed in, on a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_7>` | A published HKD listing taking bids, starting price `<starting price>`, scheduled close a day away |
| `<starting price>` | 400000 minor units (HK$4,000.00) |
| `<customer A maximum>` | 450000 minor units (HK$4,500.00) |
| `<house maximum>` | 600000 minor units (HK$6,000.00) |
| `<commit time>` | 5 minutes from now |
| `<house first bid>` | 458000 minor units: `<customer A maximum>` plus its 8000 increment |
| `<customer B maximum>` | 500000 minor units (HK$5,000.00), below `<house maximum>` |
| `<price after>` | 508000 minor units: `<customer B maximum>` plus its 8000 increment |

**Steps:**

1. Wait until `<commit time>` passes, opening no page on `<listing_7>`.
2. Within a minute, as customer B, open the lot page for `<listing_7>`.
3. Enter `<customer B maximum>` in the custom maximum on the bid panel and confirm.
4. Read the standing, Highest bid and Recent bids.

**Expected Results:**

* Step 3 is accepted.
* Step 4: customer B reads Outbid; Highest bid reads `<price after>`, the leader under one listing pseudonym.
* Step 4: Recent bids lists that pseudonym's bid at `<house first bid>`, timed at `<commit time>`, before customer B's bid at `<customer B maximum>`, then its answer at `<price after>`.

---

## g10.auction-auto-bidding.US4: Operator traces every committed maximum

**As an** operator,
**I want** to read every committed maximum and when it was accepted,
**so that** I can answer a dispute about who committed what.

<!-- trace:case id=g10.auction-auto-bidding.TC-63a rev=1 covers=g10.auction-auto-bidding.SC-j3t -->
### g10.auction-auto-bidding.US4-TC2: The house's commitment, raise and lower are traced with when each was accepted

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-04

**Pre-conditions:**

* customer A committed `<customer A maximum>` on `<listing_5>`.
* `<listing_5>`'s internal bid of `<house maximum>` was committed at `<commit time>`, raised to `<raised maximum>` at `<raise time>`, then lowered to `<lowered maximum>` at `<lower time>`, the house leading at `<current bid>` throughout.
* admin(holds auction:reserve and auction:operate) is on <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_5>` | A published HKD listing taking bids |
| `<customer A maximum>` | 500000 minor units (HK$5,000.00) |
| `<house maximum>` | 600000 minor units (HK$6,000.00) |
| `<current bid>` | 508000 minor units: `<customer A maximum>` plus its 8000 increment |
| `<commit time>` | The internal bid's set time |
| `<raised maximum>` | 750000 minor units (HK$7,500.00) |
| `<raise time>` | When the admin saved the raise |
| `<lowered maximum>` | 650000 minor units (HK$6,500.00), above `<current bid>` |
| `<lower time>` | When the admin saved the lower |

**Steps:**

1. Open `<listing_5>`'s bid history.
2. Read each committed maximum.

**Expected Results:**

* Step 2 lists customer A's commitment, with its Accepted At.
* Step 2 lists the house's `<house maximum>` accepted at `<commit time>`, not at when it was set.
* Step 2 lists the house's `<raised maximum>` accepted at `<raise time>`, as a new commitment.
* Step 2 lists the house's `<lowered maximum>` accepted at `<lower time>`.

<!-- trace:case id=g10.auction-auto-bidding.TC-vzk rev=1 covers=g10.auction-auto-bidding.SC-aqd,g10adm.auction-internal-bid.SC-ftu -->
### g10.auction-auto-bidding.US4-TC3: Staff without secret-floor access read House in the trace, never its maximum

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
* **Trace:** grade10-site-auction-auto-bidding-US-04

**Pre-conditions:**

* customer A committed `<customer A maximum>` on `<listing_6>`.
* `<listing_6>`'s internal bid of `<house maximum>` was committed at `<commit time>`, and the house leads at `<current bid>`.
* admin(staff, holds auction:operate, not auction:reserve) is on <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_6>` | A published HKD listing taking bids |
| `<customer A maximum>` | 500000 minor units (HK$5,000.00) |
| `<house maximum>` | 612300 minor units (HK$6,123.00), an amount no bid reaches |
| `<current bid>` | 508000 minor units: `<customer A maximum>` plus its 8000 increment |
| `<commit time>` | The internal bid's set time |

**Steps:**

1. Open `<listing_6>`'s bid history.
2. Read each committed maximum and each bid.
3. As customer B, open the lot page for `<listing_6>` and read Recent bids.

**Expected Results:**

* Step 2 lists customer A's commitment, with its Accepted At.
* Step 2: the house's bid at `<current bid>` reads House, with no account.
* Step 2: no house row shows a maximum; `<house maximum>` shows nowhere.
* Step 2: the house's bid shows its own Accepted At, the time Recent bids shows for it; no house row shows when a maximum was accepted.
* Step 2: no row reads the house's listing pseudonym, or an internal bid.
* Step 3: the house's bid reads under its listing pseudonym; nothing reads House.

## Settled

- Operators read the house as House; only `auction:reserve` reads its maximum, and every commitment, raise and lower of it with its Accepted At (Q9, Q25)
- A House bid shows any operator its own Accepted At, as the public history does, even where it equals the commit time (Q26)
- A reserve holder's committed-maximum trace names the internal bidder the house maximum was committed as; other operators read House alone (Q39)

## Reconciliation

**Run:** QA2 round 5, 2026-10-12, over the round-4 run below: Dev added `grade10-site-auction-auto-bidding-SC-47` and named the internal bidder in the reserve holder's trace; QA1's round-5 blind pass wrote no case here. Round 4, 2026-10-08. Dev's round-4 reading moved scenario anchors onto journeys after the accept review; QA1's round-4 blind pass, denied every `## Requirements` section, `tech-design.md`, `tasks.md` and `openspec/changes/archive/`, revised the internal-bid suite and drafted the winner-order case. QA2 read both, the delta specs, `decisions.md` through Q35, `tech-design.md`, `tasks.md`, the durable specs and suites, and the PRD pages; not the archive. It is a statement, not proof.

- **Folded in** - `g10.auction-auto-bidding.US3-TC7` by `grade10-site-auction-auto-bidding-SC-33`; `g10.auction-auto-bidding.US3-TC8` by `grade10-site-auction-auto-bidding-SC-34`, its House earlier row the durable tie rule; `g10.auction-auto-bidding.US3-TC9` by `grade10-site-auction-auto-bidding-SC-33` and `grade10-site-auction-auto-bidding-SC-07`; `g10.auction-auto-bidding.US4-TC2` by `grade10-site-auction-auto-bidding-SC-45`; `g10.auction-auto-bidding.US4-TC3` by `grade10-site-auction-auto-bidding-SC-08` and `grade10-admin-auction-internal-bid-SC-32`
- **Added by QA2** - `g10.auction-auto-bidding.US3-TC10`: a collector bid just after the house's time meets the house first, for `grade10-site-auction-auto-bidding-SC-37`, which no blind case reached
- **Corrected to the decisions** - `g10.auction-auto-bidding.US4-TC3` expected no time on a House row; Q26 shows a house bid's own Accepted At, so it now expects it and refuses only when a maximum was accepted
- **Covered at domain** - `grade10-site-auction-auto-bidding-SC-33` is also walked by `g10.auction-dmn.US13-TC1`
- **Out of suite** - `grade10-site-auction-auto-bidding-SC-36` by `grade10-admin-auction-internal-bid-US1-TC4-1`; `grade10-site-auction-auto-bidding-SC-38` by `grade10-admin-auction-internal-bid-US5-TC1-1`; `grade10-site-auction-auto-bidding-SC-39` by `g10.auction-auction.US1-TC4`; `grade10-site-auction-auto-bidding-SC-40` by `g10.auction-auction.US12-TC3`; `grade10-site-auction-auto-bidding-SC-41` by `grade10-admin-auction-internal-bid-US3-TC2-1` and `g10.auction-auction.US12-TC3`; `grade10-site-auction-auto-bidding-SC-42` and `grade10-site-auction-auto-bidding-SC-44` by `grade10-admin-auction-internal-bid-US4-TC4-1`; `grade10-site-auction-auto-bidding-SC-43` by `grade10-admin-auction-internal-bid-US4-TC2-2`; `grade10-site-auction-auto-bidding-SC-46` by `grade10-admin-auction-internal-bid-US5-TC7-1`; `grade10-site-auction-auto-bidding-SC-35` by the backend tests of tasks 3.1 and 3.2, since a person sees only that the house bids; `grade10-site-auction-auto-bidding-SC-01` to `grade10-site-auction-auto-bidding-SC-08`, `grade10-site-auction-auto-bidding-SC-22` to `grade10-site-auction-auto-bidding-SC-24` and `grade10-site-auction-auto-bidding-SC-25a` restate collector behaviour this change does not move, and stay with the durable suite's cases
- **Anchors** - `grade10-site-auction-auto-bidding-SC-35`, `grade10-site-auction-auto-bidding-SC-38` and `grade10-site-auction-auto-bidding-SC-46` serve the Feature set group `House maximum`, rules with no actor; `grade10-site-auction-auto-bidding-SC-42`, `grade10-site-auction-auto-bidding-SC-43` and `grade10-site-auction-auto-bidding-SC-44` now serve `grade10-admin/auction/internal-bid#grade10-admin-auction-internal-bid-US-04`, the journey their covering cases trace; `grade10-site-auction-auto-bidding-SC-39` and `grade10-site-auction-auto-bidding-SC-40` serve the durable journey `grade10-site-auction-auto-bidding-US-05`, carried under Context user journeys. `grade10-site-auction-auto-bidding-US-04` reads for an operator holding `auction:reserve`; what an operator without it reads of the house maximum is `grade10-admin/auction/internal-bid#grade10-admin-auction-internal-bid-US-07`, served there by `grade10-admin-auction-internal-bid-SC-32` and `grade10-admin-auction-internal-bid-SC-40`. No scenario here serves that exception, so none is re-anchored; `g10.auction-auto-bidding.US4-TC3` keeps its trace to `grade10-site-auction-auto-bidding-US-04` for `grade10-site-auction-auto-bidding-SC-08` and joins `grade10-admin-auction-internal-bid-SC-32` on the behaviour
- **Round 5, out of suite** - `grade10-site-auction-auto-bidding-SC-47` by `grade10-admin-auction-internal-bid-US1-TC12-1`, which reads one internal bidder under each lot's own pseudonym; it serves the Feature set group `House maximum`, a rule with no actor
- **Round 5, anchors** - `grade10-admin-auction-internal-bid-SC-67` serves `grade10-site-auction-auto-bidding-US-04` beside its own journey, for the internal bidder the reserve holder's trace names (Q39); `grade10-admin-auction-internal-bid-US7-TC10-1` covers it, joined on the behaviour, and no case here is revised
- **Rejected** - none
- **Raised** - none
- **Contradicted** - none
- **Uncovered anchors** - none
