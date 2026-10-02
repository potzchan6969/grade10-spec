# grade10-site/auction/auto-bidding Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-02, tcs-rules r4

## grade10-site-auction-auto-bidding-US1: Collector commits a maximum on an open listing

**As a** collector,
**I want** to commit the most I will pay and raise it later,
**so that** Grade10 bids for me only as far as needed to lead.

### grade10-site-auction-auto-bidding-US1-TC8-1: Second maximum on a zero start must clear one increment above the opening price

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-01

**Pre-conditions:**

* `<listing_1>` starts at 0 `HKD`, and customer A's maximum `<user A maximum>` stands alone at `<opening price>`.
* customer B(card linked) is signed in on a separate session, on the lot page for `<listing_1>`.

**Test data:**

| `<user B maximum>` | Outcome |
| --- | --- |
| 1000 minor units (HKD 10.00), the opening price | Refused, naming 2000 minor units (HKD 20.00); current bid stays `<opening price>`, customer A leads |
| 2000 minor units (HKD 20.00), the opening price plus one increment | Accepted; current bid 3000 minor units (HKD 30.00), `<user B maximum>` plus 1000; customer A leads |

| Field | Value |
| --- | --- |
| `<listing_1>` | An open HKD listing, starting price 0, scheduled close more than an hour away |
| `<user A maximum>` | 50000 minor units (HKD 500.00) |
| `<opening price>` | 1000 minor units (HKD 10.00), the lowest HKD increment |

**Steps:**

1. As customer B, enter the row's `<user B maximum>` in the custom maximum on the bid panel.
2. Confirm the commitment.
3. Read the current bid, the leader and Recent Bids.

**Expected Results:**

* Step 2 is the row's outcome.
* Step 3 reads the row's current bid and leader, and `<user A maximum>` appears nowhere.

---

## grade10-site-auction-auto-bidding-US5: Collector's auto-bid counts as a bid

**As a** collector,
**I want** every bid Grade10 places for me to count as a bid,
**so that** my auto-bids keep a lot open during extended bidding as a manual bid would.

### grade10-site-auction-auto-bidding-US5-TC1-1: The hold is the maximum, not the current bid

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auto-bidding-US-05

**Pre-conditions:**
An open listing whose current bid matches the row.

**Test data:**

| Currency | Current bid | Committed maximum |
| --- | --- | --- |
| USD | 22500 minor units (USD 225.00) | 50000 minor units (USD 500.00) |
| HKD | 22500 minor units (HKD 225.00) | 50000 minor units (HKD 500.00) |
| JPY | 22500 minor units (JPY 22,500) | 50000 minor units (JPY 50,000) |

**Steps:**

1. Submit and accept the row's maximum for a bidder.
2. Read the card authorization held for that bidder and listing.

**Expected Results:**

* Grade10 holds an authorization for the row's maximum.
* Exactly one active authorization exists for that bidder and listing.

### grade10-site-auction-auto-bidding-US5-TC2-1: A raise that cannot be authorized changes nothing

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auto-bidding-US-05

**Pre-conditions:**
customer A(leads with a committed maximum matching the row). The card authorization for the row's attempted raise will fail.

**Test data:**

| Currency | Committed maximum | Attempted raise |
| --- | --- | --- |
| USD | 50000 minor units (USD 500.00) | 80000 minor units (USD 800.00) |
| HKD | 50000 minor units (HKD 500.00) | 80000 minor units (HKD 800.00) |
| JPY | 50000 minor units (JPY 50,000) | 80000 minor units (JPY 80,000) |

**Steps:**

1. Raise customer A's maximum to the row's attempted raise.
2. Read customer A's committed maximum, the leader, and the current bid.

**Expected Results:**

* Grade10 refuses the raise.
* Customer A's committed maximum remains the row's committed maximum.
* The leader and the current bid are unchanged.

### grade10-site-auction-auto-bidding-US5-TC3-1: An auto-bid step needs no new card check

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auto-bidding-US-05

**Pre-conditions:**
customer A(leads with an authorized maximum matching the row) while the current bid matches the row.

**Test data:**

| Currency | Customer A's maximum | Current bid | Challenger's maximum | Resolved current bid |
| --- | --- | --- | --- | --- |
| USD | 50000 minor units (USD 500.00) | 25000 minor units (USD 250.00) | 30000 minor units (USD 300.00) | 32500 minor units (USD 325.00) |
| HKD | 50000 minor units (HKD 500.00) | 25000 minor units (HKD 250.00) | 30000 minor units (HKD 300.00) | 32500 minor units (HKD 325.00) |
| JPY | 50000 minor units (JPY 50,000) | 25000 minor units (JPY 25,000) | 30000 minor units (JPY 30,000) | 32500 minor units (JPY 32,500) |

**Steps:**

1. Commit the row's challenger maximum as a challenger.
2. Read customer A's current bid on their behalf and their authorization amount.

**Expected Results:**

* Grade10 raises customer A's bid on their behalf without a further card authorization.
* The current bid is the row's resolved current bid.
* Customer A's authorization remains the row's maximum.

<!-- trace:case id=g10.auction-auto-bidding.TC-s4f rev=2 covers=g10.auction-auto-bidding.SC-kr7,g10.auction-auto-bidding.SC-9i5,g10.auction-auto-bidding.SC-44a,g10.auction-auto-bidding.SC-nwr,g10.auction-auto-bidding.SC-0yu -->
### grade10-site-auction-auto-bidding-US5-TC7-2: Committing, auto-bidding and raising take nothing from the card

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, release
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-05

**Pre-conditions:**

* customer A(card linked) leads `<listing_3>` with a committed maximum of `<user A maximum>`, at `<leader price>`.
* customer B(card linked, no bid on `<listing_3>`) is signed in on a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_3>` | An open HKD listing taking bids, led by customer A |
| `<leader price>` | 20000 minor units (HKD 200.00), the starting price |
| `<user A maximum>` | 50000 minor units (HKD 500.00) |
| `<user B maximum>` | 30000 minor units (HKD 300.00), below `<user A maximum>` |
| `<increment>` | 1000 minor units (HKD 10.00), the HK$0 tier at `<user B maximum>` |
| `<user A raise>` | 80000 minor units (HKD 800.00) |

**Steps:**

1. As customer B, commit `<user B maximum>` on `<listing_3>`.
2. Read the API response and `<listing_3>`'s bids.
3. As customer A, raise the maximum to `<user A raise>`.
4. Read the API response.
5. Read both customers' card activity at the card provider.

**Expected Results:**

* Step 2: customer A leads at `<user B maximum>` plus `<increment>`, and that bid is recorded as placed on customer A's behalf.
* Step 4 accepts the raise on the auction's rules alone, with no wait on the card provider, and Your maximum reads `<user A raise>`.
* Step 5: nothing is held or charged on either card.

---

## Settled

- Committing or raising a maximum takes nothing from the card, and a bid Grade10 places for a collector takes nothing either; no case reads a card authorization or a hold switch (decisions Q1, Q5).
- A raise is accepted or refused on the auction's rules alone; a raise refused for a card reason no longer exists, and its case is deprecated.
- An auto-bid step's price is US3's to assert; with no card check left to tell it apart, the US5 case that read it is deprecated.

## Reconciliation

**Run:** QA2, 2026-10-03. QA1's blind pass read the capability's `## Purpose` and `## Feature set`, its `user-journeys.md`, `proposal.md`, `decisions.md`, the linked pages under `docs/prds/`, and the durable suite and the change's domain draft with `## Reconciliation` stripped; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and `openspec/changes/archive/`. QA2 read QA1's suites, the delta specs, `decisions.md`, `tech-design.md`, `tasks.md`, the durable specs and suites on main after `my-auctions-without-bid-holds` was accepted, and grade10 main's bidding, history, erasure and refusal-copy code and tests. It is a statement, not proof.

- **Folded in** - `grade10-site-auction-auto-bidding-SC-25` and the accepted raise of `grade10-site-auction-auto-bidding-SC-32` by `grade10-site-auction-auto-bidding-US5-TC7-2`
- **Covered at domain** - `grade10-site-auction-e2e-US04-TC03-2` reads the refusal and the bid form's words of `grade10-site-auction-auto-bidding-SC-32`'s second half, a maximum not raised
- **Revised** - `grade10-site-auction-auto-bidding-US5-TC7-2` reads that nothing is taken from the card; its marker drops grade10-site-auction-auto-bidding-SC-19, grade10-site-auction-auto-bidding-SC-20 and grade10-site-auction-auto-bidding-SC-21 and covers `grade10-site-auction-auto-bidding-SC-32`. `grade10-site-auction-auto-bidding-US1-TC8-1` loses the hold switch pre-condition only, `<v>` kept
- **Deprecated** - `grade10-site-auction-auto-bidding-US5-TC1-1`, `grade10-site-auction-auto-bidding-US5-TC2-1` and `grade10-site-auction-auto-bidding-US5-TC3-1`, with the hold requirement
- **Raised** - none
- **Contradicted** - none
- **Uncovered anchors** - none; the Feature set's No card hold leaf by `grade10-site-auction-auto-bidding-US5-TC7-2`
