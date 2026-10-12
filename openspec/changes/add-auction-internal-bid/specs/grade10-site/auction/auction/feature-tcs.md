# grade10-site/auction/auction Test Cases

**Status:** pending-review · 0/4
**Drafts styled:** 2026-10-08, tcs-rules r4

## grade10-site-auction-auction-US1: Collector browses Auction listings

**As a** collector,
**I want** the catalogue to show Auction listings with money in minor units,
**so that** I am not offered Buy Now and a close with bids is absolute.

<!-- trace:case id=g10.auction-auction.TC-m16 rev=1 covers=g10.auction-auction.SC-fec,g10.auction-auction.SC-a4f -->
### grade10-site-auction-auction-US1-TC3-1: A lot the house leads at the close reads sold like any other

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-01

**Pre-conditions:**

* `<listing_1>` is led as the row states at `<final price>`, over customer A's maximum `<customer A maximum>`, its recorded close under a minute away, no further bid coming.
* customer C has never bid on `<listing_1>` and is on its lot page.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | A published HKD listing in extended bidding |
| `<customer A maximum>` | 500000 minor units (HK$5,000.00) |
| `<final price>` | 508000 minor units: `<customer A maximum>` plus its 8000 increment |

| Row | Leader |
| --- | --- |
| House | The house, under `<listing_1>`'s internal bid of 600000 minor units |
| Collector | customer B, with maximum 600000 minor units and no internal bid on the lot |

**Steps:**

1. Wait through the recorded close without reloading.
2. As customer C, read the lot's state, Highest bid and Recent bids.
3. Read the API response for `<listing_1>`'s public facts.
4. Open <grade10 auction url> and read `<listing_1>`'s card.

**Expected Results:**

* Step 2 reads sold at `<final price>`, the winning row crowned under the leader's listing pseudonym.
* Step 3 reads the lot closed with a winner at `<final price>`, the winner by pseudonym only.
* Step 4's card reads Ended, as any sold lot's card does.
* The House row and the Collector row read alike in every step, save the pseudonym.

<!-- trace:case id=g10.auction-auction.TC-fkn rev=1 covers=g10.auction-auction.SC-cqt,g10.auction-auto-bidding.SC-szf -->
### grade10-site-auction-auction-US1-TC4-1: A lot whose only bid is the house's extends and closes sold at the starting price

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
* **Trace:** grade10-site-auction-auction-US-01

**Pre-conditions:**

* `<listing_2>` is published and taking bids with no bid, and its internal bid of `<house maximum>` is set at the row's commit time.
* `<listing_2>`'s scheduled close is a few minutes away, and no collector will bid.
* customer C is on the lot page for `<listing_2>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_2>` | A published HKD listing, starting price `<starting price>`, extension duration `<extension duration>`, no cap |
| `<starting price>` | 400000 minor units (HK$4,000.00) |
| `<house maximum>` | 600000 minor units (HK$6,000.00) |
| `<extension duration>` | 1800s (30mins) |

| Row | Commit time |
| --- | --- |
| Before the close | 1 minute from now, before the scheduled close |
| At the scheduled close | Exactly the scheduled close |

**Steps:**

1. Wait until the scheduled close passes and read Time left.
2. Wait until the extended close passes.
3. Read the lot's state, Highest bid and Recent bids.

**Expected Results:**

* Step 1 reads extended bidding, the close `<extension duration>` after the scheduled close.
* Step 3 reads sold at `<starting price>`, one bid, under the house's listing pseudonym.

<!-- trace:case id=g10.auction-auction.TC-dij rev=1 covers=g10.auction-auction.SC-14a,g10.auction-auction.SC-cqt -->
### grade10-site-auction-auction-US1-TC5-1: A close the house leads opens the internal bidder's order and charges nobody

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-01

**Pre-conditions:**

* `<listing_4>`'s internal bid of `<house maximum>` is committed as `<internal bidder>`, and the house leads as the row states, its recorded close a few minutes away, no further bid coming.
* customer A(card linked) bid on `<listing_4>` as the row states.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_4>` | A published HKD listing in no campaign, starting price `<starting price>` |
| `<starting price>` | 400000 minor units (HK$4,000.00) |
| `<house maximum>` | 600000 minor units (HK$6,000.00) |
| `<internal bidder>` | An active internal bidder profile: name "QA House One", email label qa-house-one@internal.test |

| Row | Bidding at the close | Winning bid |
| --- | --- | --- |
| House over a collector | The house leads over customer A's maximum of 500000 | 508000: customer A's maximum plus its 8000 increment |
| House alone | No collector bid | `<starting price>` |

**Steps:**

1. Wait until `<listing_4>`'s recorded close passes.
2. Read the orders the API holds for `<listing_4>`.
3. Read the order's invoice and payments.
4. In the House over a collector row, read customer A's card charges since the close.
5. Read the API response for `<listing_4>`'s public facts.

**Expected Results:**

* Step 2 holds one order, `<internal bidder>`'s, flagged internal, at the row's winning bid.
* Step 3: no invoice is issued and no payment is recorded.
* Step 4 holds no charge for `<listing_4>`.
* Step 5 reads the lot closed with a winner at the row's winning bid, the winner by pseudonym only.

---

## grade10-site-auction-auction-US11: Bidder is held to the close with everyone else

**As a** bidder,
**I want** a lot to stop taking bids at its close for everyone, and a bid to count when it is accepted before then,
**so that** nobody wins with a bid that arrived after the close.

<!-- trace:case id=g10.auction-auction.TC-itn rev=1 covers=none -->
### grade10-site-auction-auction-US11-TC12-1: A lot the house leads at the close reads sold like any other

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-11

**Pre-conditions:**

* `<listing_1>` is led as the row states at `<final price>`, over customer A's maximum `<customer A maximum>`, its recorded close under a minute away, no further bid coming.
* customer C has never bid on `<listing_1>` and is on its lot page.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | A published HKD listing in extended bidding |
| `<customer A maximum>` | 500000 minor units (HK$5,000.00) |
| `<final price>` | 508000 minor units: `<customer A maximum>` plus its 8000 increment |

| Row | Leader |
| --- | --- |
| House | The house, under `<listing_1>`'s internal bid of 600000 minor units |
| Collector | customer B, with maximum 600000 minor units and no internal bid on the lot |

**Steps:**

1. Wait through the recorded close without reloading.
2. As customer C, read the lot's state, Highest bid and Recent bids.
3. Read the API response for `<listing_1>`'s public facts.
4. Open <grade10 auction url> and read `<listing_1>`'s card.

**Expected Results:**

* Step 2 reads sold at `<final price>`, the winning row crowned under the leader's listing pseudonym.
* Step 3 reads the lot closed with a winner at `<final price>`, the winner by pseudonym only.
* Step 4's card reads Ended, as any sold lot's card does.
* The House row and the Collector row read alike in every step, save the pseudonym.

<!-- trace:case id=g10.auction-auction.TC-xcm rev=1 covers=none -->
### grade10-site-auction-auction-US11-TC13-1: A lot whose only bid is the house's extends and closes sold at the starting price

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-11

**Pre-conditions:**

* `<listing_2>` is published and taking bids with no bid, and its internal bid of `<house maximum>` is set at the row's commit time.
* `<listing_2>`'s scheduled close is a few minutes away, and no collector will bid.
* customer C is on the lot page for `<listing_2>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_2>` | A published HKD listing, starting price `<starting price>`, extension duration `<extension duration>`, no cap |
| `<starting price>` | 400000 minor units (HK$4,000.00) |
| `<house maximum>` | 600000 minor units (HK$6,000.00) |
| `<extension duration>` | 1800s (30mins) |

| Row | Commit time |
| --- | --- |
| Before the close | 1 minute from now, before the scheduled close |
| At the scheduled close | Exactly the scheduled close |

**Steps:**

1. Wait until the scheduled close passes and read Time left.
2. Wait until the extended close passes.
3. Read the lot's state, Highest bid and Recent bids.

**Expected Results:**

* Step 1 reads extended bidding, the close `<extension duration>` after the scheduled close.
* Step 3 reads sold at `<starting price>`, one bid, under the house's listing pseudonym.

---

## grade10-site-auction-auction-US12: Bidder keeps a lot open only by moving its price

**As a** bidder,
**I want** extended bidding to restart only when a bid moves the lot's price,
**so that** a leader cannot keep a lot open by raising their own maximum.

<!-- trace:case id=g10.auction-auction.TC-2g4 rev=1 covers=g10.auction-auto-bidding.SC-pfm,g10.auction-auto-bidding.SC-ax3 -->
### grade10-site-auction-auction-US12-TC3-1: A house change restarts the timer only when it moves the price

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
* **Trace:** grade10-site-auction-auction-US-12

**Pre-conditions:**

* `<listing_3>` is in extended bidding with its recorded close `<time left before change>` away.
* `<listing_3>`'s internal bid of `<house maximum>` is committed, and the bidding is as the row states.
* admin(holds auction:reserve) is on `<listing_3>`'s editor in the admin.
* customer C is on the lot page for `<listing_3>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_3>` | A published HKD listing in extended bidding, extension duration `<extension duration>`, no cap |
| `<extension duration>` | 1800s (30mins) |
| `<time left before change>` | 5 minutes |
| `<house maximum>` | 600000 minor units (HK$6,000.00) |

| Row | Bidding | House change | Highest bid after | Time left after |
| --- | --- | --- | --- | --- |
| Raise past the leader | customer A leads at 608000 with maximum 700000 | Raise to 800000 | 708000: customer A's maximum plus its 8000 increment, the house leading | `<extension duration>` from the raise |
| Raise while leading | The house leads at 508000 over customer A's maximum of 500000 | Raise to 800000 | 508000, unchanged | `<time left before change>`, less the time taken |
| Lower while leading | The house leads at 508000 over customer A's maximum of 500000 | Lower to 550000 | 508000, unchanged | `<time left before change>`, less the time taken |

**Steps:**

1. As the admin, make the row's house change and click Save.
2. As customer C, read Highest bid, the leader and Time left.

**Expected Results:**

* Step 1 is accepted.
* Step 2 reads the row's Highest bid and Time left.

## Settled

- A lot only the house bid on, its commit at or before the scheduled close, enters extended bidding and closes sold at the opening price, as any lone bid does (Q21)
- A lot the house leads at its close is sold to its internal bidder: the close opens that internal bidder's order, flagged internal, with no invoice and no charge to any card, and sends it no letter; collectors still read the lot sold under the house's pseudonym (Q2, Q5, Q33, Q51)

## Reconciliation

**Run:** QA2 round 6, 2026-10-12, over the round-4 run below. Dev's round-6 reading raised `grade10-site-auction-auction-SC-106` to revision 2, added `grade10-site-auction-auction-SC-107` and `grade10-site-auction-auction-SC-108` under the Feature set group `Closing a lot the house leads`, and retired the two Bought in scenarios they replace. QA1's round-6 blind pass, denied every `## Requirements` section, `tech-design.md`, `tasks.md` and `openspec/changes/archive/`, added one case here. QA2 read both, the delta specs, `decisions.md` through Q58, `tech-design.md`, `tasks.md`, the durable specs and suites, and the PRD pages; not the archive. It is a statement, not proof.

- **Round 6, folded in** - `grade10-site-auction-auction-US1-TC5-1` (new) by `grade10-site-auction-auction-SC-107` and the order half of `grade10-site-auction-auction-SC-106`: its House alone row opens the internal bidder's order at the starting price. `grade10-site-auction-auction-US1-TC4-1` keeps `grade10-site-auction-auction-SC-106`'s collector read and its version
- **Round 6, anchors** - `grade10-site-auction-auction-SC-107` serves the Feature set group `Closing a lot the house leads`; its case traces `grade10-site-auction-auction-US-01`, the journey whose close it reads. Joined on the behaviour
- **Round 6, out of suite** - `grade10-site-auction-auction-SC-108` by the backend tests of task 4.1, a double settle opening one order, since a person cannot make the timer and a read settle at one moment; the admin reads of the internal order are `grade10-admin-auction-internal-bid-US6-TC1-2`'s and `grade10-admin-auction-internal-bid-US6-TC3-2`'s
- **Round 6, settled** - the stale line that the house is never a lot's winner is rewritten under Q5, Q33 and Q51
- **Round 6, rejected** - none
- **Round 6, raised** - none
- **Round 6, contradicted** - none

**Run, round 4:** QA2 round 4, 2026-10-08. Dev's round-4 reading moved scenario anchors onto journeys after the accept review; QA1's round-4 blind pass, denied every `## Requirements` section, `tech-design.md`, `tasks.md` and `openspec/changes/archive/`, revised the internal-bid suite and drafted the winner-order case. QA2 read both, the delta specs, `decisions.md` through Q35, `tech-design.md`, `tasks.md`, the durable specs and suites, and the PRD pages; not the archive. It is a statement, not proof.

- **Folded in** - `grade10-site-auction-auction-US1-TC3-1` by `grade10-site-auction-auction-SC-02` and `grade10-site-auction-auction-SC-103`; `grade10-site-auction-auction-US1-TC4-1` by `grade10-site-auction-auction-SC-106` and `grade10-site-auction-auto-bidding-SC-39`, its At the scheduled close row by Q21; `grade10-site-auction-auction-US12-TC3-1` by `grade10-site-auction-auto-bidding-SC-40` and `grade10-site-auction-auto-bidding-SC-41`, its Lower while leading row by the auto-bidding rule that an accepted lower does not move the close
- **Re-homed** - `grade10-site-auction-auction-SC-103` and `grade10-site-auction-auction-SC-106` now serve `grade10-site-auction-auction-US-01`, beside `grade10-site-auction-auction-SC-02`, so `grade10-site-auction-auction-US11-TC12-1` and `grade10-site-auction-auction-US11-TC13-1` traced a journey none of their scenarios serves. Their runs are unchanged as `grade10-site-auction-auction-US1-TC3-1` and `grade10-site-auction-auction-US1-TC4-1`, the next unused numbers under US1 (an archived change issued `TC1-2`); the US11 ids, issued in this change and never accepted, are kept `deprecated` with `covers=none`
- **Anchors** - `grade10-site-auction-auction-US1-TC4-1` also covers `grade10-site-auction-auto-bidding-SC-39`, which serves `grade10-site-auction-auto-bidding-US-05`, and `grade10-site-auction-auction-US12-TC3-1` covers auto-bidding scenarios serving that capability's journeys; joined on the behaviour
- **Covered at domain** - `grade10-site-auction-auction-SC-103` is also walked by `grade10-site-auction-e2e-US13-TC01-1`; `grade10-site-auction-auction-SC-02` by `grade10-site-auction-e2e-US13-TC02-1`
- **Out of suite** - the round-4 Bought in scenarios were retired in round 6; `grade10-site-auction-auction-SC-01` and `grade10-site-auction-auction-SC-03` are unchanged and stay with the durable suite
- **Rejected** - none
- **Raised** - none
- **Contradicted** - none
- **Uncovered anchors** - none
