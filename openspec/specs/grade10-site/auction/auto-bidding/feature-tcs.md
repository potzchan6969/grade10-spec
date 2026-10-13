# grade10-site/auction/auto-bidding Test Cases

**Status:** reopened · 0/30
**Drafts styled:** 2026-10-12, tcs-rules r5

## Walk 1: Collector commits a maximum on an open listing

**Starting state:**

- An open listing in the row's currency, starting price 0, with no maximum committed.
- customer is signed in with a card linked and is on that listing's page.
- An open listing in the row's currency, starting price 0, in the row's standing.
- customer B is signed in with a card linked.
- An open listing in the row's currency, starting price 0, extension duration 0, scheduled close 10 minutes ahead.
- customer A committed the row's maximum before the scheduled close, the only maximum on the listing.
- `<listing_1>` starts at 0 `USD`, and customer A's maximum `<user A maximum>` stands alone at `<opening price>`.
- customer B(card linked) is signed in on a separate session, on the lot page for `<listing_1>`.

**Shared test data:**

| Item | Value |
| --- | --- |
| Item | Currency: USD; Starting price: USD56 (range: 1–9999 minor units); Maximum: USD235 (range: 10000–49999 minor units) |
| Item | Currency: USD; Starting price: USD28 (range: 1–9999 minor units); Maximum: USD280 (range: 10000–49999 minor units) |
| Item | Currency: USD; Starting price: USD2,350 (range: 100000–499999 minor units); Maximum: USD23,500 (range: 1000000–999999999 minor units) |
| Item | Currency: USD; Current bid: USD235 (range: 10000–49999 minor units); Minimum increment: USD5 (fixed tier increment); Attempted maximum: USD239 (range: 10000–49999 minor units) |
| Item | Currency: USD; Current bid: USD280 (range: 10000–49999 minor units); Minimum increment: USD5 (fixed tier increment); Attempted maximum: USD284 (range: 10000–49999 minor units) |
| Item | Currency: USD; Current bid: USD23,500 (range: 1000000–999999999 minor units); Minimum increment: USD100 (fixed tier increment); Attempted maximum: USD23,599 (range: 1000000–999999999 minor units) |
| Item | Currency: USD; Committed maximum: USD235 (range: 10000–49999 minor units); Raised maximum: USD470 (range: 10000–49999 minor units) |
| Item | Currency: USD; Committed maximum: USD280 (range: 10000–49999 minor units); Raised maximum: USD560 (range: 50000–99999 minor units) |
| Item | Currency: USD; Committed maximum: USD23,500 (range: 1000000–999999999 minor units); Raised maximum: USD47,000 (range: 1000000–999999999 minor units) |
| Item | Currency: USD; Committed maximum: USD470 (range: 10000–49999 minor units); Attempted maximum: USD235 (range: 10000–49999 minor units) |
| Item | Currency: USD; Committed maximum: USD560 (range: 50000–99999 minor units); Attempted maximum: USD280 (range: 10000–49999 minor units) |
| Item | Currency: USD; Committed maximum: USD47,000 (range: 1000000–999999999 minor units); Attempted maximum: USD23,500 (range: 1000000–999999999 minor units) |
| Item | Currency: USD; Maximum: USD1 (fixed boundary or equality), exactly the minimum; Lowest increment: USD1 (fixed boundary or equality); Current bid after: USD1 (fixed derived value) |
| Item | Currency: USD; Maximum: USD500 (fixed tier boundary), in the USD 500 tier; Lowest increment: USD1 (fixed boundary or equality); Current bid after: USD1 (fixed derived value) |
| Item | Currency: USD; Maximum: USD10 (fixed boundary or equality), exactly the minimum; Lowest increment: USD1 (fixed boundary); Current bid after: USD1 (fixed derived value) |
| Item | Currency: USD; Maximum: USD920 (range: 50000–99999 minor units), in the USD 500 tier; Lowest increment: USD1 (fixed boundary); Current bid after: USD1 (fixed derived value) |
| Item | Currency: USD; Maximum: USD100 (fixed boundary or equality), exactly the minimum; Lowest increment: USD1 (fixed boundary); Current bid after: USD1 (fixed derived value) |
| Item | Currency: USD; Maximum: USD47,000 (range: 1000000–999999999 minor units), in the USD 10,000 tier; Lowest increment: USD1 (fixed boundary); Current bid after: USD1 (fixed derived value) |
| Item | Currency: USD; Standing: No maximum committed; Minimum next bid: USD1 (range: 1–9999 minor units); Customer B's attempted maximum: USD0.99 (range: 1–9999 minor units) |
| Item | Currency: USD; Standing: No maximum committed; Minimum next bid: USD1 (fixed boundary); Customer B's attempted maximum: USD0.99 (range: 1–9999 minor units) |
| Item | Currency: USD; Standing: No maximum committed; Minimum next bid: USD1 (fixed boundary); Customer B's attempted maximum: USD0.99 (range: 1–9999 minor units) |
| Item | Currency: USD; Lowest increment: USD1 (fixed boundary or equality); Winning bid: USD1 (fixed boundary or equality) |
| Item | Currency: USD; Lowest increment: USD1 (fixed boundary); Winning bid: USD1 (fixed boundary or equality) |
| Item | Currency: USD; Lowest increment: USD1 (fixed boundary); Winning bid: USD1 (fixed derived value) |
| USD1 (fixed boundary), the opening price | Refused, naming USD2 (fixed derived value); current bid stays `<opening price>`, customer A leads |
| USD2 (fixed derived value), the opening price plus one increment | Accepted; current bid USD3 (fixed derived value), `<user B maximum>` plus USD1; customer A leads |
| Field | Value |
| `<listing_1>` | An open USD listing, starting price 0, scheduled close more than an hour away |
| `<user A maximum>` | USD470 (range: 10000–49999 minor units) |
| `<opening price>` | USD1 (fixed boundary), the lowest USD increment |

### Route

1. Navigate to `<an open listing url>` priced in the row's currency.
   - Grade10 accepts the commitment. g10.auction-auto-bidding.US1-TC1
2. Enter the row's maximum.
   - The current bid is the row's starting price. g10.auction-auto-bidding.US1-TC1
3. Confirm the commitment.
   - Customer leads. g10.auction-auto-bidding.US1-TC1
4. Navigate to `<an open listing url>` priced in the row's currency.
5. Enter the row's attempted maximum.
6. Confirm the commitment.
7. Check the current bid and the leader.
   - Grade10 refuses the commitment. g10.auction-auto-bidding.US1-TC2
   - The current bid and the leader are unchanged. g10.auction-auto-bidding.US1-TC2
8. Enter the row's raised maximum.
   - Grade10 accepts the raise. g10.auction-auto-bidding.US1-TC3
9. Confirm the raise.
   - Customer still leads. g10.auction-auto-bidding.US1-TC3
10. Check who leads and the current bid.
   - The current bid is unchanged. g10.auction-auto-bidding.US1-TC3
11. Enter the row's attempted maximum.
12. Confirm the commitment.
13. Check the committed maximum.
   - Grade10 refuses it. g10.auction-auto-bidding.US1-TC4
   - Customer's committed maximum remains the row's committed maximum. g10.auction-auto-bidding.US1-TC4
14. Enter the row's maximum in the custom maximum on the bid panel.
15. Confirm the commitment.
16. Read the current bid, the leader, the bid count and Recent Bids.
   - Grade10 accepts the commitment. g10.auction-auto-bidding.US1-TC5
   - The current bid is 0 plus the currency's lowest increment, the row's current bid after, not 0. g10.auction-auto-bidding.US1-TC5
   - The current bid is not the increment of the tier the maximum sits in. g10.auction-auto-bidding.US1-TC5
   - The bid count reads 1, and Recent Bids shows one bid at the row's current bid after. g10.auction-auto-bidding.US1-TC5
   - Customer leads. g10.auction-auto-bidding.US1-TC5
17. As customer B, submit the row's attempted maximum on the listing.
   - Grade10 refuses the commitment, naming the row's minimum next bid. g10.auction-auto-bidding.US1-TC6
18. Read the API response.
   - No maximum is recorded for customer B. g10.auction-auto-bidding.US1-TC6
19. Read the listing's current bid, leader and committed maxima.
   - The current bid and the leader are as the row's standing gives them. g10.auction-auto-bidding.US1-TC6
20. Wait until the scheduled close passes with no further commitment.
21. Read the listing's state, winner and winning bid.
   - The listing is closed. g10.auction-auto-bidding.US1-TC7
   - Customer A wins. g10.auction-auto-bidding.US1-TC7
   - The winning bid is 0 plus the currency's lowest increment, the row's winning bid, not 0. g10.auction-auto-bidding.US1-TC7
22. As customer B, enter the row's `<user B maximum>` in the custom maximum on the bid panel.
23. Confirm the commitment.
   - is the row's outcome. g10.auction-auto-bidding.US1-TC8
24. Read the current bid, the leader and Recent Bids.
   - reads the row's current bid and leader, and `<user A maximum>` appears nowhere. g10.auction-auto-bidding.US1-TC8

## Walk 2: Collector reads their own maximum and standing

**Starting state:**

- No additional setup is named by these cases.

**Shared test data:**

| Item | Value |
| --- | --- |
| Item | Currency: USD; Committed maximum: USD470 (range: 10000–49999 minor units); Current bid: USD235 (range: 10000–49999 minor units) |
| Item | Currency: USD; Committed maximum: USD560 (range: 50000–99999 minor units); Current bid: USD280 (range: 10000–49999 minor units) |
| Item | Currency: USD; Committed maximum: USD47,000 (range: 1000000–999999999 minor units); Current bid: USD23,500 (range: 1000000–999999999 minor units) |
| Item | Currency: USD; Customer A's maximum: USD470 (range: 10000–49999 minor units); Current bid: USD235 (range: 10000–49999 minor units) |
| Item | Currency: USD; Customer A's maximum: USD560 (range: 50000–99999 minor units); Current bid: USD280 (range: 10000–49999 minor units) |
| Item | Currency: USD; Customer A's maximum: USD47,000 (range: 1000000–999999999 minor units); Current bid: USD23,500 (range: 1000000–999999999 minor units) |
| Customer C's maximum | USD600 (range: 50000–99999 minor units) |

### Route

1. Open the listing.
   - Customer sees their own maximum, the row's committed maximum. g10.auction-auto-bidding.US2-TC1
   - Customer sees the current bid, the row's value, as a separate fact. g10.auction-auto-bidding.US2-TC1
   - Customer sees that they lead. g10.auction-auto-bidding.US2-TC1
2. Open the listing.
   - Customer sees that they do not lead. g10.auction-auto-bidding.US2-TC2
   - Customer's own committed maximum is unchanged. g10.auction-auto-bidding.US2-TC2
3. Sign in as customer B.
   - The facts carry the current bid, the row's value. g10.auction-auto-bidding.US2-TC3
4. Open the listing's public facts.
   - The facts do not carry, and do not allow deriving, customer A's maximum, the row's value. g10.auction-auto-bidding.US2-TC3
5. Commit a maximum of USD600 (range: 50000–99999 minor units) as customer C.
   - Grade10 accepts customer C's commitment. g10.auction-auto-bidding.US2-TC4
6. Read customer C's standing.
   - Customer C is reported as not leading. g10.auction-auto-bidding.US2-TC4
7. Read the listing's public bid history.
   - The public history records customer C's accepted action followed by customer B's automatic response, both at USD600 (fixed derived value). g10.auction-auto-bidding.US2-TC4

## Walk 3: Collector competes through two maxima and adjacent checks

**Starting state:**

- No additional setup is named by these cases.

**Shared test data:**

| Item | Value |
| --- | --- |
| `<customer B maximum>` | USD450 (range: 10000–49999 minor units); Resolved bid USD455; customer A leads |
| `<customer B maximum>` | USD500 (fixed tier boundary); Resolved bid USD500; customer A leads on earlier commitment |
| `<customer B maximum>` | USD501 (range: 50000–99999 minor units); Resolved bid USD501; customer B leads |
| `<customer B maximum>` | USD600 (range: 50000–99999 minor units); Resolved bid USD505; customer B leads |
| `<customer B maximum>` | USD601 (range: 50000–99999 minor units); Resolved bid USD505; customer B leads |
| Customer B's raised maximum | USD34,000 (range: 1000000–999999999 minor units) |
| Customer A's raised maximum | USD34,000 (range: 1000000–999999999 minor units) |
| Customer A's raised maximum | USD60,000 (range: 1000000–999999999 minor units) |
| Customer B's maximum | USD9,200 (range: 500000–999999 minor units) |
| Customer C's maximum | USD600 (range: 50000–99999 minor units) |
### Route

1. Commit `<customer B maximum>` as customer B.
2. Read the listing's current bid and leader.
   - The current bid matches the row's resolved current bid. g10.auction-auto-bidding.US3-TC1
   - The leader matches the row's resolved leader. g10.auction-auto-bidding.US3-TC1
   - Grade10 accepts no intermediate bid between the previous current bid and the resolved one. g10.auction-auto-bidding.US3-TC1
3. Raise customer B's maximum to USD34,000 (range: 1000000–999999999 minor units).
   - Customer A still leads. g10.auction-auto-bidding.US3-TC2
4. Read the listing's leader and current bid.
   - The current bid is USD34,100 (fixed derived value), the USD34,000 second-highest maximum plus the USD100 increment. g10.auction-auto-bidding.US3-TC2
5. Raise customer A's maximum to USD34,000 (range: 1000000–999999999 minor units).
   - Customer B still leads. g10.auction-auto-bidding.US3-TC3
6. Read the listing's leader and current bid.
   - The current bid is USD34,000 (fixed derived value); equal maxima keep the earlier leader. g10.auction-auto-bidding.US3-TC3
7. Raise customer A's maximum to USD60,000 (range: 1000000–999999999 minor units).
   - Customer A leads. g10.auction-auto-bidding.US3-TC4
8. Read the listing's leader and current bid.
   - The current bid is USD34,100 (fixed derived value), the second-highest maximum plus the USD100 increment. g10.auction-auto-bidding.US3-TC4
9. Commit a maximum of USD9,200 (range: 1000000–999999999 minor units) as customer B.
   - Customer B leads. g10.auction-auto-bidding.US3-TC5
10. Read the listing's leader and current bid.
   - The current bid is USD8,450 (fixed derived value), below customer B's USD9,200 maximum. g10.auction-auto-bidding.US3-TC5
11. Commit a maximum of USD600 (range: 50000–99999 minor units) as customer C.
   - Customer B remains the leader. g10.auction-auto-bidding.US3-TC6
12. Read the listing's leader and current bid.
   - The current bid is USD600 (fixed derived value); equal maxima keep the earlier leader. g10.auction-auto-bidding.US3-TC6
13. Read the public bid history's ordering and timestamps.
   - The history records customer C's accepted action at USD600 (range: 50000–99999 minor units), then customer B's automatic response at USD600 (fixed derived value), both in the same resolution timestamp group. g10.auction-auto-bidding.US3-TC6
14. Open that listing's bid history.
   - Each commitment shows its bidder, its maximum, and its Accepted At. g10.auction-auto-bidding.US4-TC1

## Walk 4: Collector's auto-bid counts as a bid

**Starting state:**

- customer A(card linked) leads `<listing_3>` with a committed maximum of `<user A maximum>`, at `<leader price>`.
- customer B(card linked, no bid on `<listing_3>`) is signed in on a separate session.
- `<listing_1>` is in extended bidding.
- customer A leads `<listing_1>` with a committed maximum of `<user A maximum>`.
- customer B is signed in with a card saved and is on `<listing_1>`.
- `<listing_2>` is open, and its only bidder, customer A, committed a maximum before the scheduled close and leads at the starting price.

**Shared test data:**

| Item | Value |
| --- | --- |
| `<listing_3>` | An open USD listing taking bids, led by customer A |
| `<leader price>` | USD280 (range: 10000–49999 minor units), the starting price |
| `<user A maximum>` | USD560 (range: 50000–99999 minor units) |
| `<user B maximum>` | USD340 (range: 10000–49999 minor units), below `<user A maximum>` |
| `<increment>` | USD5 (fixed tier increment), the USD10,000 tier at `<user B maximum>` |
| `<user A raise>` | USD920 (range: 50000–99999 minor units) |
| `<listing_1>` | A listing past its scheduled close, in extended bidding, extension duration `<extension duration>`, no cap |
| `<extension duration>` | 1800 seconds |
| `<user A maximum>` | USD8,400 (range: 500000–999999 minor units) |
| `<user B maximum>` | USD5,700 (range: 500000–999999 minor units), below `<user A maximum>` |
| `<bid time>` | The moment customer B confirms |
| `<listing_2>` | An open listing, scheduled close 20:00 UTC, extension duration 1800 seconds |

### Route

1. Read the listing's bid count.
   - The bid count includes that bid. g10.auction-auto-bidding.US5-TC5
2. Read the listing's bid history.
   - The history shows it as placed on that bidder's behalf, not as a manual bid. g10.auction-auto-bidding.US5-TC5
3. Let time pass with no further commitment accepted.
   - Grade10 places no further bid on either bidder's behalf. g10.auction-auto-bidding.US5-TC6
4. Read the current bid and whether Grade10 placed any further bid.
   - The current bid is unchanged. g10.auction-auto-bidding.US5-TC6
5. As customer B, commit `<user B maximum>` on `<listing_3>`.
6. Read the API response and `<listing_3>`'s bids.
   - customer A leads at `<user B maximum>` plus `<increment>`, and that bid is recorded as placed on customer A's behalf. g10.auction-auto-bidding.US5-TC7
7. As customer A, raise the maximum to `<user A raise>`.
8. Read the API response.
   - accepts the raise on the auction's rules alone, with no wait on the card provider, and Your maximum reads `<user A raise>`. g10.auction-auto-bidding.US5-TC7
9. Read both customers' card activity at the card provider.
   - nothing is held or charged on either card. g10.auction-auto-bidding.US5-TC7
10. As customer B, commit a maximum of `<user B maximum>` at `<bid time>`.
11. Read the current bid and Time left.
12. Wait until the new close passes with no further commitment.
   - Grade10 raises customer A's bid on their behalf, and the close moves to `<bid time>` plus `<extension duration>`. g10.auction-auto-bidding.US5-TC8
   - No further bid is placed on either maximum before the close. g10.auction-auto-bidding.US5-TC8
13. Wait for 20:00 UTC.
   - The listing is in extended bidding. g10.auction-auto-bidding.US5-TC9
14. Read the listing's state and recorded close.
   - The recorded close reads 20:30 UTC. g10.auction-auto-bidding.US5-TC9

## g10.auction-auto-bidding.US1: Collector commits a maximum on an open listing

**As a** collector,
**I want** to commit the most I will pay and raise it later,
**so that** Grade10 bids for me only as far as needed to lead.

### g10.auction-auto-bidding.US1-TC1: First maximum opens bidding at the starting price

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auto-bidding.spec.ts`

**Pre-conditions:**
An open listing with no bids, with the row's starting price.

**Test data:**

| Currency | Starting price | Maximum |
| --- | --- | --- |
| USD | USD56 (range: 1–9999 minor units) | USD235 (range: 10000–49999 minor units) |
| USD | USD28 (range: 1–9999 minor units) | USD280 (range: 10000–49999 minor units) |
| USD | USD2,350 (range: 100000–499999 minor units) | USD23,500 (range: 1000000–999999999 minor units) |

**Steps:**

1. Navigate to `<an open listing url>` priced in the row's currency.
2. Enter the row's maximum.
3. Confirm the commitment.

**Expected Results:**

* Grade10 accepts the commitment.
* The current bid is the row's starting price.
* Customer leads.

<!-- trace:case id=g10.auction-auto-bidding.TC-7gl rev=2 -->
### g10.auction-auto-bidding.US1-TC2: Maximum below the minimum next bid is refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auto-bidding.spec.ts`

**Pre-conditions:**
An open listing whose current bid and minimum increment match the row.

**Test data:**

| Currency | Current bid | Minimum increment | Attempted maximum |
| --- | --- | --- | --- |
| USD | USD235 (range: 10000–49999 minor units) | USD5 (fixed tier increment) | USD239 (range: 10000–49999 minor units) |
| USD | USD280 (range: 10000–49999 minor units) | USD5 (fixed tier increment) | USD284 (range: 10000–49999 minor units) |
| USD | USD23,500 (range: 1000000–999999999 minor units) | USD100 (fixed tier increment) | USD23,599 (range: 1000000–999999999 minor units) |

**Steps:**

1. Navigate to `<an open listing url>` priced in the row's currency.
2. Enter the row's attempted maximum.
3. Confirm the commitment.
4. Check the current bid and the leader.

**Expected Results:**

* Grade10 refuses the commitment.
* The current bid and the leader are unchanged.

<!-- trace:case id=g10.auction-auto-bidding.TC-9qy rev=2 -->
### g10.auction-auto-bidding.US1-TC3: Leader raises their own maximum

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auto-bidding.spec.ts`

**Pre-conditions:**
customer(leads with a committed maximum matching the row) is on that open listing's page.

**Test data:**

| Currency | Committed maximum | Raised maximum |
| --- | --- | --- |
| USD | USD235 (range: 10000–49999 minor units) | USD470 (range: 10000–49999 minor units) |
| USD | USD280 (range: 10000–49999 minor units) | USD560 (range: 50000–99999 minor units) |
| USD | USD23,500 (range: 1000000–999999999 minor units) | USD47,000 (range: 1000000–999999999 minor units) |

**Steps:**

1. Enter the row's raised maximum.
2. Confirm the raise.
3. Check who leads and the current bid.

**Expected Results:**

* Grade10 accepts the raise.
* Customer still leads.
* The current bid is unchanged.

<!-- trace:case id=g10.auction-auto-bidding.TC-vq3 rev=2 -->
### g10.auction-auto-bidding.US1-TC4: Lowering a maximum is refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/domain.spec.ts`

**Pre-conditions:**
customer(has a committed maximum matching the row) is on that open listing's page.

**Test data:**

| Currency | Committed maximum | Attempted maximum |
| --- | --- | --- |
| USD | USD470 (range: 10000–49999 minor units) | USD235 (range: 10000–49999 minor units) |
| USD | USD560 (range: 50000–99999 minor units) | USD280 (range: 10000–49999 minor units) |
| USD | USD47,000 (range: 1000000–999999999 minor units) | USD23,500 (range: 1000000–999999999 minor units) |

**Steps:**

1. Enter the row's attempted maximum.
2. Confirm the commitment.
3. Check the committed maximum.

**Expected Results:**

* Grade10 refuses it.
* Customer's committed maximum remains the row's committed maximum.

<!-- trace:case id=g10.auction-auto-bidding.TC-j8v rev=3 -->
### g10.auction-auto-bidding.US1-TC5: Lone maximum on a zero start stands at the lowest increment

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/opening-price.spec.ts`

**Pre-conditions:**

* An open listing in the row's currency, starting price 0, with no maximum committed.
* customer is signed in with a card linked and is on that listing's page.

**Test data:**

| Currency | Maximum | Lowest increment | Current bid after |
| --- | --- | --- | --- |
| USD | USD1 (fixed boundary), the minimum | USD1 (fixed boundary) | USD1 (fixed derived value) |
| USD | USD500 (fixed tier boundary), above the minimum | USD1 (fixed boundary) | USD1 (fixed derived value) |
| USD | USD10 (range: 1–9999 minor units), above the minimum | USD1 (fixed boundary) | USD1 (fixed derived value) |
| USD | USD920 (range: 50000–99999 minor units), above the minimum | USD1 (fixed boundary) | USD1 (fixed derived value) |
| USD | USD100 (range: 1–9999 minor units), above the minimum | USD1 (fixed boundary) | USD1 (fixed derived value) |
| USD | USD47,000 (range: 1000000–999999999 minor units), above the minimum | USD1 (fixed boundary) | USD1 (fixed derived value) |

**Steps:**

1. Enter the row's maximum in the custom maximum on the bid panel.
2. Confirm the commitment.
3. Read the current bid, the leader, the bid count and Recent Bids.

**Expected Results:**

* Grade10 accepts the commitment.
* The current bid is 0 plus the currency's lowest increment, the row's current bid after, not 0.
* The current bid is not the increment of the tier the maximum sits in.
* The bid count reads 1, and Recent Bids shows one bid at the row's current bid after.
* Customer leads.

<!-- trace:case id=g10.auction-auto-bidding.TC-65a rev=3 covers=g10.auction-auto-bidding.SC-arw -->
### g10.auction-auto-bidding.US1-TC6: Maximum one minor unit below the minimum on a zero start is refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-auto-bidding-US-01

**Decided by:** `grade10:apps/backend/grade10/auction/test/db/bidding/autoBidding.spec.ts`

**Pre-conditions:**

* An open listing in the row's currency, starting price 0, in the row's standing.
* customer B is signed in with a card linked.

**Test data:**

| Currency | Standing | Minimum next bid | Customer B's attempted maximum |
| --- | --- | --- | --- |
| USD | No maximum committed on a zero-start lot | USD1 (fixed boundary) | USD0.99 (range: 1–9999 minor units) |

**Steps:**

1. As customer B, submit the row's attempted maximum on the listing.
2. Read the API response.
3. Read the listing's current bid, leader and committed maxima.

**Expected Results:**

* Grade10 refuses the commitment, naming the row's minimum next bid.
* No maximum is recorded for customer B.
* The current bid and the leader are as the row's standing gives them.

<!-- trace:case id=g10.auction-auto-bidding.TC-y4r rev=3 covers=g10.auction-auto-bidding.SC-9mj -->
### g10.auction-auto-bidding.US1-TC7: Lone bidder wins a zero-start lot at the lowest increment

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-auto-bidding-US-01

**Decided by:** `grade10:apps/backend/grade10/auction/test/db/bidding/autoBidding.spec.ts`

**Pre-conditions:**

* An open listing in the row's currency, starting price 0, extension duration 0, scheduled close 10 minutes ahead.
* customer A committed the row's maximum before the scheduled close, the only maximum on the listing.

**Test data:**

| Currency | Lowest increment | Winning bid |
| --- | --- | --- |
| USD | USD1 (fixed boundary) | USD1 (fixed derived value) |

**Steps:**

1. Wait until the scheduled close passes with no further commitment.
2. Read the listing's state, winner and winning bid.

**Expected Results:**

* The listing is closed.
* Customer A wins.
* The winning bid is 0 plus the currency's lowest increment, the row's winning bid, not 0.

<!-- trace:case id=g10.auction-auto-bidding.TC-ic0 rev=3 covers=g10.auction-auto-bidding.SC-qbr -->
### g10.auction-auto-bidding.US1-TC8: Second maximum on a zero start must clear one increment above the opening price

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auto-bidding.spec.ts`

**Pre-conditions:**

* `<listing_1>` starts at 0 `USD`, and customer A's maximum `<user A maximum>` stands alone at `<opening price>`.
* customer B(card linked) is signed in on a separate session, on the lot page for `<listing_1>`.

**Test data:**

| `<user B maximum>` | Outcome |
| --- | --- |
| USD1 (fixed boundary), the opening price | Refused, naming USD2 (fixed derived value); current bid stays `<opening price>`, customer A leads |
| USD2 (fixed derived value), the opening price plus one increment | Accepted; current bid USD3 (fixed derived value), `<user B maximum>` plus USD1; customer A leads |

| Field | Value |
| --- | --- |
| `<listing_1>` | An open USD listing, starting price 0, scheduled close more than an hour away |
| `<user A maximum>` | USD560 (range: 50000–99999 minor units) |
| `<opening price>` | USD1 (fixed boundary), the lowest USD increment |

**Steps:**

1. As customer B, enter the row's `<user B maximum>` in the custom maximum on the bid panel.
2. Confirm the commitment.
3. Read the current bid, the leader and Recent Bids.

**Expected Results:**

* Step 2 is the row's outcome.
* Step 3 reads the row's current bid and leader, and `<user A maximum>` appears nowhere.

---

## g10.auction-auto-bidding.US2: Collector reads their own maximum and standing

**As a** collector,
**I want** to see my own maximum, the current bid, and whether I lead,
**so that** I know where I stand without my cap being shown to anyone else.

<!-- trace:case id=g10.auction-auto-bidding.TC-mjs rev=3 covers=g10.auction-auto-bidding.SC-nqo -->
### g10.auction-auto-bidding.US2-TC1: Bidder reads their own commitment apart from the current bid

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auto-bidding.spec.ts`

**Pre-conditions:**
customer(committed a maximum matching the row) is on a listing whose current bid matches the row.

**Test data:**

| Currency | Committed maximum | Current bid |
| --- | --- | --- |
| USD | USD470 (range: 10000–49999 minor units) | USD235 (range: 10000–49999 minor units) |
| USD | USD560 (range: 50000–99999 minor units) | USD280 (range: 10000–49999 minor units) |
| USD | USD47,000 (range: 1000000–999999999 minor units) | USD23,500 (range: 1000000–999999999 minor units) |

**Steps:**

1. Open the listing.

**Expected Results:**

* Customer sees their own maximum, the row's committed maximum.
* Customer sees the current bid, the row's value, as a separate fact.
* Customer sees that they lead.

<!-- trace:case id=g10.auction-auto-bidding.TC-13a rev=3 covers=g10.auction-auto-bidding.SC-dmo -->
### g10.auction-auto-bidding.US2-TC2: Overtaken bidder sees that they no longer lead

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auto-bidding.spec.ts`

**Pre-conditions:**
customer(has been overtaken on an open listing) is on that listing's page.

**Steps:**

1. Open the listing.

**Expected Results:**

* Customer sees that they do not lead.
* Customer's own committed maximum is unchanged.

<!-- trace:case id=g10.auction-auto-bidding.TC-7io rev=3 covers=g10.auction-auto-bidding.SC-x57 -->
### g10.auction-auto-bidding.US2-TC3: Leader's maximum is not disclosed to another bidder

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auto-bidding.spec.ts`

**Pre-conditions:**
customer A(leads with a committed maximum matching the row) is on a listing whose current bid matches the row.

**Test data:**

| Currency | Customer A's maximum | Current bid |
| --- | --- | --- |
| USD | USD470 (range: 10000–49999 minor units) | USD235 (range: 10000–49999 minor units) |
| USD | USD560 (range: 50000–99999 minor units) | USD280 (range: 10000–49999 minor units) |
| USD | USD47,000 (range: 1000000–999999999 minor units) | USD23,500 (range: 1000000–999999999 minor units) |

**Steps:**

1. Sign in as customer B.
2. Open the listing's public facts.

**Expected Results:**

* The facts carry the current bid, the row's value.
* The facts do not carry, and do not allow deriving, customer A's maximum, the row's value.

<!-- trace:case id=g10.auction-auto-bidding.TC-nmi rev=3 covers=g10.auction-auto-bidding.SC-eiw -->
### g10.auction-auto-bidding.US2-TC4: A tie is accepted and reported as not leading

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auto-bidding.spec.ts`

**Pre-conditions:**
customer B(leads an USD listing with a committed maximum of USD600 (range: 50000–99999 minor units)).

**Test data:**

| Field | Value |
| --- | --- |
| Customer C's maximum | USD600 (range: 50000–99999 minor units) |

**Steps:**

1. Commit a maximum of USD600 (range: 50000–99999 minor units) as customer C.
2. Read customer C's standing.
3. Read the listing's public bid history.

**Expected Results:**

* Grade10 accepts customer C's commitment.
* Customer C is reported as not leading.
* The public history records customer C's accepted action followed by customer B's automatic response, both at USD600 (fixed derived value).

---

## g10.auction-auto-bidding.US3: Collector competes through two maxima

**As a** collector,
**I want** the current bid to come from the two highest maxima,
**so that** I take the lead only when my maximum is higher, and a tie stays
with whoever committed first.

<!-- trace:case id=g10.auction-auto-bidding.TC-1qu rev=3 covers=g10.auction-auto-bidding.SC-arz,g10.auction-auto-bidding.SC-5mw,g10.auction-auto-bidding.SC-bqs,g10.auction-auto-bidding.SC-wgx -->
### g10.auction-auto-bidding.US3-TC1: Current bid resolves from the leader's and challenger's maxima

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auto-bidding.spec.ts`

**Pre-conditions:**
An open USD listing where customer A leads with a committed maximum of USD500 (fixed tier boundary), the current bid is USD100 (fixed tier boundary), and the applicable increment is USD5 (fixed tier increment).

**Test data:**

| `<customer B maximum>` | Resolved current bid | Resolved leader |
| --- | --- | --- |
| USD450 (range: 10000–49999 minor units) | USD455 (fixed derived value) | customer A |
| USD500 (fixed tier boundary) | USD500 (fixed derived value) | customer A |
| USD501 (range: 50000–99999 minor units) | USD510 (fixed derived value) | customer B |
| USD600 (range: 50000–99999 minor units) | USD510 (fixed derived value) | customer B |
| USD601 (range: 50000–99999 minor units) | USD510 (fixed derived value) | customer B |
**Steps:**

1. Commit `<customer B maximum>` as customer B.
2. Read the listing's current bid and leader.

**Expected Results:**

* The current bid matches the row's resolved current bid.
* The leader matches the row's resolved leader.
* Grade10 accepts no intermediate bid between the previous current bid and the resolved one.

<!-- trace:case id=g10.auction-auto-bidding.TC-hpg rev=3 covers=g10.auction-auto-bidding.SC-edj -->
### g10.auction-auto-bidding.US3-TC2: Challenger raises again and still stays below the leader

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auto-bidding.spec.ts`

**Pre-conditions:**
customer A(leads an USD listing at USD28,100 (fixed derived value)) with a maximum of USD56,000 (range: 1000000–999999999 minor units); customer B's existing maximum is USD28,000 (range: 1000000–999999999 minor units).

**Test data:**

| Field | Value |
| --- | --- |
| Customer B's raised maximum | USD34,000 (range: 1000000–999999999 minor units) |

**Steps:**

1. Raise customer B's maximum to USD34,000 (range: 1000000–999999999 minor units).
2. Read the listing's leader and current bid.

**Expected Results:**

* Customer A still leads.
* The current bid is USD34,100 (fixed derived value).

<!-- trace:case id=g10.auction-auto-bidding.TC-29q rev=3 covers=g10.auction-auto-bidding.SC-xwb -->
### g10.auction-auto-bidding.US3-TC3: Overtaken bidder raises but stays below the new leader

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auto-bidding.spec.ts`

**Pre-conditions:**
customer B(leads an USD listing with a committed maximum of USD34,000 (range: 1000000–999999999 minor units)) after overtaking customer A; customer A's maximum is USD30,000 (range: 1000000–999999999 minor units), and the current bid is USD30,100 (fixed derived value).

**Test data:**

| Field | Value |
| --- | --- |
| Customer A's raised maximum | USD34,000 (range: 1000000–999999999 minor units) |

**Steps:**

1. Raise customer A's maximum to USD34,000 (range: 1000000–999999999 minor units).
2. Read the listing's leader and current bid.

**Expected Results:**

* Customer B still leads.
* The current bid is USD34,000 (fixed derived value).

<!-- trace:case id=g10.auction-auto-bidding.TC-s1n rev=3 covers=g10.auction-auto-bidding.SC-n5u -->
### g10.auction-auto-bidding.US3-TC4: Overtaken bidder raises past the current leader

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auto-bidding.spec.ts`

**Pre-conditions:**
customer B(leads an USD listing with a committed maximum of USD34,000 (range: 1000000–999999999 minor units)) after overtaking customer A; customer A's maximum is USD30,000 (range: 1000000–999999999 minor units), and the current bid is USD30,100 (fixed derived value).

**Test data:**

| Field | Value |
| --- | --- |
| Customer A's raised maximum | USD60,000 (range: 1000000–999999999 minor units) |

**Steps:**

1. Raise customer A's maximum to USD60,000 (range: 1000000–999999999 minor units).
2. Read the listing's leader and current bid.

**Expected Results:**

* Customer A leads.
* The current bid is USD34,100 (fixed derived value).

<!-- trace:case id=g10.auction-auto-bidding.TC-wr4 rev=2 -->
### g10.auction-auto-bidding.US3-TC5: The current bid cannot exceed the new leader's own maximum

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auto-bidding.spec.ts`

**Pre-conditions:**
customer A(leads an USD listing with a committed maximum of USD8,400 (range: 500000–999999 minor units)).

**Test data:**

| Field | Value |
| --- | --- |
| Customer B's maximum | USD9,200 (range: 500000–999999 minor units) |

**Steps:**

1. Commit a maximum of USD9,200 (range: 500000–999999 minor units) as customer B.
2. Read the listing's leader and current bid.

**Expected Results:**

* Customer B leads.
* The current bid is USD8,450 (fixed derived value), capped below customer B's USD9,200 maximum.

<!-- trace:case id=g10.auction-auto-bidding.TC-7oh rev=3 covers=g10.auction-auto-bidding.SC-52s -->
### g10.auction-auto-bidding.US3-TC6: Equal maximum keeps the earlier leader and orders both public records together

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auto-bidding.spec.ts`

**Pre-conditions:**
customer B(leads with a committed maximum of USD600 (range: 50000–99999 minor units)).

**Test data:**

| Field | Value |
| --- | --- |
| Customer C's maximum | USD600 (range: 50000–99999 minor units) |

**Steps:**

1. Commit a maximum of USD600 (range: 50000–99999 minor units) as customer C.
2. Read the listing's leader and current bid.
3. Read the public bid history's ordering and timestamps.

**Expected Results:**

* Customer B remains the leader.
* The current bid is USD600 (fixed derived value).
* The history records customer C's accepted action at USD600 (range: 50000–99999 minor units), then customer B's automatic response at USD600 (fixed derived value), both in the same resolution timestamp group.

<!-- trace:case id=g10.auction-auto-bidding.TC-m47 rev=2 -->
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
| `<listing_1>` | A published USD listing taking bids, starting price `<starting price>`, scheduled close a day away |
| `<starting price>` | 400000 minor units (US$4,000.00) |
| `<house maximum>` | 600000 minor units (USD6,000) |

| Row | customer A's maximum | Leader | Highest bid |
| --- | --- | --- | --- |
| Below the house | 500000 | The house | 505000: customer A's maximum plus its 5000 increment |
| One increment short of the house | 595000 | The house | 600000: customer A's maximum plus 5000, capped at `<house maximum>` |
| Above the house | 700000 | customer A | 605000: `<house maximum>` plus its 5000 increment |

**Steps:**

1. As customer A, enter the row's maximum in the custom maximum on the bid panel and confirm.
2. Read the standing, Highest bid and Recent bids.

**Expected Results:**

* Step 1 is accepted.
* Step 2: the leader and Highest bid read the row's values; customer A reads Outbid or Leading to match.
* Step 2: Recent bids lists customer A's bid and the house's bid that answers it, the house under its listing pseudonym.

<!-- trace:case id=g10.auction-auto-bidding.TC-6gi rev=3 covers=g10.auction-auto-bidding.SC-gct -->
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
| `<listing_2>` | A published USD listing taking bids, starting price 400000 minor units, scheduled close a day away |
| `<equal maximum>` | 600000 minor units (USD6,000), the house's and customer A's maximum |

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

<!-- trace:case id=g10.auction-auto-bidding.TC-19o rev=3 covers=g10.auction-auto-bidding.SC-7m7 -->
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
| `<listing_3>` | A published USD listing taking bids, protected by an internal bid |
| `<listing_4>` | A published USD listing taking bids, with no internal bid |
| `<house maximum>` | 600000 minor units (USD6,000) |
| `<customer A maximum>` | 500000 minor units (USD5,000) |
| `<current bid>` | 505000 minor units: `<customer A maximum>` plus its 5000 increment |

**Steps:**

1. As customer C, read the bid panel, Highest bid and Recent bids on `<listing_3>`.
2. Read the API response for `<listing_3>`'s public facts.
3. Open the lot page for `<listing_4>` and read the same.
4. Read the API response for `<listing_4>`'s public facts.

**Expected Results:**

* Step 1 reads like step 3: the leader's row carries a listing pseudonym, with no house, reserve or floor wording.
* Step 2 reads like step 4, save the pseudonyms and times: no field names the house or holds `<house maximum>`.
* Neither lot shows the leader's maximum.
* The house has a different pseudonym on each listing, and no public fact links the two pseudonyms.

<!-- trace:case id=g10.auction-auto-bidding.TC-9jg rev=3 covers=g10.auction-auto-bidding.SC-rh7,g10.auction-auto-bidding.SC-jd3 -->
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

* `<listing_7>` is published and taking bids, with no bids, and its house maximum of `<house maximum>` is set for `<commit time>`.
* `<listing_7>`'s scheduled close is a day away. customer A(card linked) and customer B(card linked) have separate sessions.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_7>` | A published USD listing taking bids, starting price 20000 USD minor units, scheduled close a day away |
| `<customer A maximum>` | 30000 USD minor units |
| `<house maximum>` | 50000 USD minor units |
| `<commit time>` | 18:00:00 UTC |
| `<house first bid>` | 30500 USD minor units: `<customer A maximum>` plus its USD500 tier increment |
| `<customer B maximum>` | 40000 USD minor units |
| `<price after>` | 40500 USD minor units: `<customer B maximum>` plus its USD500 tier increment |

**Steps:**

1. Before `<commit time>`, as customer A, commit `<customer A maximum>`.
2. Read the current bid, bid count and leader.
3. Wait until `<commit time>` passes, opening no page on `<listing_7>`.
4. Within a minute, as customer B, open the lot page for `<listing_7>`.
5. Enter `<customer B maximum>` in the custom maximum on the bid panel and confirm.
6. Read the standing, Highest bid and Recent bids.

**Expected Results:**

* Step 2: customer A leads at the opening price, and the bid count is 1.
* Step 5 is accepted.
* Step 6: customer B reads Outbid; Highest bid reads `<price after>`, and the house leads under one listing pseudonym.
* Step 6: Recent bids lists the house's bid at `<house first bid>` timed at `<commit time>`, before customer B's bid at `<customer B maximum>` and the house's answer at `<price after>`.

---

## g10.auction-auto-bidding.US4: Operator traces every committed maximum

**As an** operator,
**I want** to read every committed maximum and when it was accepted,
**so that** I can answer a dispute about who committed what.

<!-- trace:case id=g10.auction-auto-bidding.TC-de4 rev=3 covers=g10.auction-auto-bidding.SC-aqd -->
### g10.auction-auto-bidding.US4-TC1: Operator reads every committed maximum to answer a dispute

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
admin(holds `auction:operate`) is on <grade10 auction admin listings url>. That listing has several committed maximums recorded.

**Steps:**

1. Open that listing's bid history.

**Expected Results:**

* Each commitment shows its bidder, its maximum, and its Accepted At.

<!-- trace:case id=g10.auction-auto-bidding.TC-63a rev=3 covers=g10.auction-auto-bidding.SC-j3t -->
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
* `<listing_5>` is a published USD listing with the house maximum committed at `<commit time>`, raised at `<raise time>`, collectors A and C committed at their listed times, and the house maximum lowered at `<lower time>`.
* admin(holds auction:reserve and auction:operate) is on <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_5>` | A published USD listing taking bids, starting price 20000 USD minor units |
| `<house maximum>` | 25000 USD minor units |
| `<commit time>` | 18:00:00 UTC |
| `<raised maximum>` | 30000 USD minor units |
| `<raise time>` | 18:10:00 UTC |
| `<customer A maximum>` | 40000 USD minor units, accepted at 18:20:00 UTC |
| `<customer C maximum>` | 60000 USD minor units, accepted at 18:30:00 UTC |
| `<lowered maximum>` | 21000 USD minor units, accepted at 19:00:00 UTC |

**Steps:**

1. Open `<listing_5>`'s bid history.
2. Read each committed maximum.

**Expected Results:**

* Step 2 lists the house's `<house maximum>` at `<commit time>`, `<raised maximum>` at `<raise time>`, and `<lowered maximum>` at `<lower time>`, all in USD minor units.
* Step 2 lists collector A's and C's maximums with their Accepted At times.

<!-- trace:case id=g10.auction-auto-bidding.TC-vzk rev=2 -->
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
| `<listing_6>` | A published USD listing taking bids |
| `<customer A maximum>` | 500000 minor units (USD5,000) |
| `<house maximum>` | 612300 minor units (US$6,123.00), an amount no bid reaches |
| `<current bid>` | 505000 minor units: `<customer A maximum>` plus its 5000 increment |
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

---

## g10.auction-auto-bidding.US5: Collector's auto-bid counts as a bid

**As a** collector,
**I want** every bid Grade10 places for me to count as a bid,
**so that** my auto-bids keep a lot open during extended bidding as a manual bid would.

<!-- trace:case id=g10.auction-auto-bidding.TC-rmo rev=2 -->
### g10.auction-auto-bidding.US5-TC5: An auto bid is counted and recorded on the bidder's behalf

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-auto-bidding-US-05

**Decided by:** `grade10:apps/backend/grade10/auction/test/db/bidding/autoBidding.spec.ts`

**Pre-conditions:**
Grade10 has raised a bidder's bid on their behalf.

**Steps:**

1. Read the listing's bid count.
2. Read the listing's bid history.

**Expected Results:**

* The bid count includes that bid.
* The history shows it as placed on that bidder's behalf, not as a manual bid.

<!-- trace:case id=g10.auction-auto-bidding.TC-zjt rev=2 -->
### g10.auction-auto-bidding.US5-TC6: Standing maxima do not keep bidding on their own

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-auto-bidding-US-05

**Decided by:** `grade10:apps/backend/grade10/auction/test/db/bidding/autoBidding.spec.ts`

**Pre-conditions:**
Two bidders have committed maxima and the listing has been resolved to the two-maximum price.

**Steps:**

1. Let time pass with no further commitment accepted.
2. Read the current bid and whether Grade10 placed any further bid.

**Expected Results:**

* Grade10 places no further bid on either bidder's behalf.
* The current bid is unchanged.

<!-- trace:case id=g10.auction-auto-bidding.TC-s4f rev=4 covers=g10.auction-auto-bidding.SC-0yu -->
### g10.auction-auto-bidding.US5-TC7: Committing, auto-bidding and raising take nothing from the card

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, release
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-05

**Decided by:** `grade10:apps/backend/grade10/auction/test/db/bidding/autoBidding.spec.ts`

**Pre-conditions:**

* customer A(card linked) leads `<listing_3>` with a committed maximum of `<user A maximum>`, at `<leader price>`.
* customer B(card linked, no bid on `<listing_3>`) is signed in on a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_3>` | An open USD listing taking bids, led by customer A |
| `<leader price>` | USD280 (range: 10000–49999 minor units), the starting price |
| `<user A maximum>` | USD560 (range: 50000–99999 minor units) |
| `<user B maximum>` | USD340 (range: 10000–49999 minor units), below `<user A maximum>` |
| `<increment>` | USD5 (fixed tier increment), the USD10,000 tier at `<user B maximum>` |
| `<user A raise>` | USD920 (range: 50000–99999 minor units) |

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

<!-- trace:case id=g10.auction-auto-bidding.TC-y3w rev=2 -->
### g10.auction-auto-bidding.US5-TC8: Auto bid during extended bidding restarts the timer once

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auto-bidding.spec.ts`

**Pre-conditions:**

* `<listing_1>` is in extended bidding.
* customer A leads `<listing_1>` with a committed maximum of `<user A maximum>`.
* customer B is signed in with a card saved and is on `<listing_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | A listing past its scheduled close, in extended bidding, extension duration `<extension duration>`, no cap |
| `<extension duration>` | 1800 seconds |
| `<user A maximum>` | USD8,400 (range: 500000–999999 minor units) |
| `<user B maximum>` | USD5,700 (range: 500000–999999 minor units), below `<user A maximum>` |
| `<bid time>` | The moment customer B confirms |

**Steps:**

1. As customer B, commit a maximum of `<user B maximum>` at `<bid time>`.
2. Read the current bid and Time left.
3. Wait until the new close passes with no further commitment.

**Expected Results:**

* Grade10 raises customer A's bid on their behalf, and the close moves to `<bid time>` plus `<extension duration>`.
* No further bid is placed on either maximum before the close.

<!-- trace:case id=g10.auction-auto-bidding.TC-wqa rev=2 -->
### g10.auction-auto-bidding.US5-TC9: Maximum committed before the close starts extended bidding

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-auto-bidding-US-05

**Decided by:** `grade10:apps/backend/grade10/auction/test/db/bidding/autoBidding.spec.ts`

**Pre-conditions:**

* `<listing_2>` is open, and its only bidder, customer A, committed a maximum before the scheduled close and leads at the starting price.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_2>` | An open listing, scheduled close 20:00 UTC, extension duration 1800 seconds |

**Steps:**

1. Wait for 20:00 UTC.
2. Read the listing's state and recorded close.

**Expected Results:**

* The listing is in extended bidding.
* The recorded close reads 20:30 UTC.

<!-- trace:case id=g10.auction-auto-bidding.TC-dhr rev=2 -->
### g10.auction-auto-bidding.US5-TC1: The hold is the maximum, not the current bid

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
| USD | 22500 minor units (USD 225.00) | 50000 minor units (USD 500.00) |
| USD | 22500 minor units (USD 22,500) | 50000 minor units (USD 50,000) |

**Steps:**

1. Submit and accept the row's maximum for a bidder.
2. Read the card authorization held for that bidder and listing.

**Expected Results:**

* Grade10 holds an authorization for the row's maximum.
* Exactly one active authorization exists for that bidder and listing.

<!-- trace:case id=g10.auction-auto-bidding.TC-5xp rev=2 -->
### g10.auction-auto-bidding.US5-TC2: A raise that cannot be authorized changes nothing

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
| USD | 50000 minor units (USD 500.00) | 80000 minor units (USD 800.00) |
| USD | 50000 minor units (USD 50,000) | 80000 minor units (USD 80,000) |

**Steps:**

1. Raise customer A's maximum to the row's attempted raise.
2. Read customer A's committed maximum, the leader, and the current bid.

**Expected Results:**

* Grade10 refuses the raise.
* Customer A's committed maximum remains the row's committed maximum.
* The leader and the current bid are unchanged.

<!-- trace:case id=g10.auction-auto-bidding.TC-hqr rev=2 -->
### g10.auction-auto-bidding.US5-TC3: An auto-bid step needs no new card check

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
| USD | 50000 minor units (USD 500.00) | 25000 minor units (USD 250.00) | 30000 minor units (USD 300.00) | 32500 minor units (USD 325.00) |
| USD | 50000 minor units (USD 50,000) | 25000 minor units (USD 25,000) | 30000 minor units (USD 30,000) | 32500 minor units (USD 32,500) |

**Steps:**

1. Commit the row's challenger maximum as a challenger.
2. Read customer A's current bid on their behalf and their authorization amount.

**Expected Results:**

* Grade10 raises customer A's bid on their behalf without a further card authorization.
* The current bid is the row's resolved current bid.
* Customer A's authorization remains the row's maximum.

## Settled

- A first maximum on a 0 start must reach 0 plus the currency's lowest increment; a first bid of 0 or of one minor unit is a non-goal, and no case asserts either.
- Committing or raising a maximum takes nothing from the card, and a bid Grade10 places for a collector takes nothing either; no case reads a card authorization or a hold switch (decisions Q1, Q5).
- A raise is accepted or refused on the auction's rules alone; a raise refused for a card reason no longer exists, and its case is deprecated.
- An auto-bid step's price is US3's to assert; with no card check left to tell it apart, the US5 case that read it is deprecated.

### Archived fold records

- Archived suites are reconciliation evidence only; they are not regeneration input.
- **2026-09-16-default-auction-bid-holds-off** — `grade10-site-auction-auto-bidding-US5-TC1-1` → `g10.auction-auto-bidding.US5-TC1`; `grade10-site-auction-auto-bidding-US5-TC2-1` → `g10.auction-auto-bidding.US5-TC2`; `grade10-site-auction-auto-bidding-US5-TC3-1` → `g10.auction-auto-bidding.US5-TC3`
- **2026-09-17-revise-auction-extended-bidding** — `grade10-site-auction-auto-bidding-US5-TC4-2` → `g10.auction-auto-bidding.US5`; `grade10-site-auction-auto-bidding-US5-TC7-1` → `g10.auction-auto-bidding.US5-TC7`
- **2026-10-02-relay-auction-live-state** — `grade10-site-auction-auto-bidding-US1-TC5-1` → `g10.auction-auto-bidding.US1-TC5`; `grade10-site-auction-auto-bidding-US1-TC6-1` → `g10.auction-auto-bidding.US1-TC6`; `grade10-site-auction-auto-bidding-US1-TC7-1` → `g10.auction-auto-bidding.US1-TC7`; `grade10-site-auction-auto-bidding-US1-TC8-1` → `g10.auction-auto-bidding.US1-TC8`
- **2026-10-03-refused-bid-is-not-a-bid** — `grade10-site-auction-auto-bidding-US1-TC8-1` → `g10.auction-auto-bidding.US1-TC8`; `grade10-site-auction-auto-bidding-US5-TC1-1` → `g10.auction-auto-bidding.US5-TC1`; `grade10-site-auction-auto-bidding-US5-TC2-1` → `g10.auction-auto-bidding.US5-TC2`; `grade10-site-auction-auto-bidding-US5-TC3-1` → `g10.auction-auto-bidding.US5-TC3`; `grade10-site-auction-auto-bidding-US5-TC7-2` → `g10.auction-auto-bidding.US5-TC7`
- Operators read the house as House; only `auction:reserve` reads its maximum, and every commitment, raise and lower of it with its Accepted At (Q9, Q25)
- A House bid shows any operator its own Accepted At, as the public history does, even where it equals the commit time (Q26)
- A reserve holder's committed-maximum trace names the internal bidder the house maximum was committed as; other operators read House alone (Q39)

## Reconciliation

**Run:** QA2 reconciliation 2026-10-01 for change `relay-auction-live-state`, joining QA1's blind cases with Dev's delta scenarios on `grade10-site-auction-auto-bidding-US-01`. Read the change's `proposal.md`, `decisions.md` (Q16 to Q30), `tech-design.md`, `tasks.md`, this delta `spec.md`, `user-journeys.md` and `domain-tcs.md`. QA1 had read the frozen anchors only.

| Finding | Disposition |
| --- | --- |
| A lone maximum on a 0 start stands at the lowest increment, in each currency, whatever tier the maximum sits in | **Folded in:** `grade10-site-auction-auto-bidding-SC-30` (Q19) |
| That stand is one public bid: bid count 1, one Recent Bids row | **Folded in:** `grade10-site-auction-auto-bidding-SC-30`, which this run gave the public-record line (Q25) |
| A first maximum one minor unit below the opening price is refused, naming it | **Folded in:** `grade10-site-auction-auction-SC-63` and `grade10-site-auction-bid-increments-SC-12`; a maximum is a bid under the same minimum |
| A lone bidder on a 0 start wins at the lowest increment, never 0 | **Folded in:** `grade10-site-auction-auto-bidding-SC-31` |
| A second maximum must clear the opening price plus one increment, and the price then resolves by the two-maximum rule | **Folded in:** `grade10-site-auction-auto-bidding-SC-30a`, added by this run (Q19); the accepted row follows the requirement's two-maximum resolution |
| Unchanged two-maximum scenarios restated by the modified block - `SC-09` to `SC-18` | **Out of suite:** the durable suite's existing `-US-02` and `-US-03` cases; this change only adds the 0-start sentence |

**Uncovered anchors:** none for `grade10-site-auction-auto-bidding-US-01`.

**Run:** QA2, 2026-10-03. QA1's blind pass read the capability's `## Purpose` and `## Feature set`, its `user-journeys.md`, `proposal.md`, `decisions.md`, the linked pages under `docs/prds/`, and the durable suite and the change's domain draft with `## Reconciliation` stripped; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and `openspec/changes/archive/`. QA2 read QA1's suites, the delta specs, `decisions.md`, `tech-design.md`, `tasks.md`, the durable specs and suites on main after `my-auctions-without-bid-holds` was accepted, and grade10 main's bidding, history, erasure and refusal-copy code and tests. It is a statement, not proof.

- **Folded in** - `grade10-site-auction-auto-bidding-SC-25` and the accepted raise of `grade10-site-auction-auto-bidding-SC-32` by `g10.auction-auto-bidding.US5-TC7`
- **Covered at domain** - `g10.auction-dmn.US4-TC3` reads the refusal and the bid form's words of `grade10-site-auction-auto-bidding-SC-32`'s second half, a maximum not raised
- **Revised** - `g10.auction-auto-bidding.US5-TC7` reads that nothing is taken from the card; its marker drops grade10-site-auction-auto-bidding-SC-19, grade10-site-auction-auto-bidding-SC-20 and grade10-site-auction-auto-bidding-SC-21 and covers `grade10-site-auction-auto-bidding-SC-32`. `g10.auction-auto-bidding.US1-TC8` loses the hold switch pre-condition only, `<v>` kept
- **Deprecated** - `g10.auction-auto-bidding.US5-TC1`, `g10.auction-auto-bidding.US5-TC2` and `g10.auction-auto-bidding.US5-TC3`, with the hold requirement
- **Raised** - none
- **Contradicted** - none
- **Uncovered anchors** - none; the Feature set's No card hold leaf by `g10.auction-auto-bidding.US5-TC7`

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

**Run:** independent QA2, 2026-10-14. Sources read: frozen QA1 packet (digest `4c0f429bb19757925c710ded1fb89c06410660e6ea5b14302f9d2fe2303ce858`); current delta auto-bidding `spec.md` and `user-journeys.md`; current bid-increments delta; proposal, decisions, PRDs, tech design, tasks; durable auto-bidding contract; `docs/governance/specs-to-test-cases.md`, `docs/governance/tcs-conventions.md`, and `.claude/skills/planning-dev/SKILL.md`.

- Case disposition register (opaque IDs and historical groups retained): `TC-7gl@2`, `TC-9qy@2`, `TC-vq3@2`, `TC-j8v@3`, `TC-65a@3`, `TC-y4r@3`, `TC-ic0@3`, `TC-mjs@3`, `TC-13a@3`, `TC-7io@3`, `TC-nmi@3`, `TC-1qu@3`, `TC-hpg@3`, `TC-29q@3`, `TC-s1n@3`, `TC-wr4@2`, `TC-7oh@3`, `TC-m47@2`, `TC-6gi@3`, `TC-19o@3`, `TC-9jg@3`, `TC-de4@3`, `TC-63a@3`, `TC-vzk@2`, `TC-rmo@2`, `TC-zjt@2`, `TC-s4f@4`, `TC-y3w@2`, and `TC-wqa@2` remain active draft cases. `TC-dhr@2`, `TC-5xp@2` and `TC-hqr@2` retain their inherited deprecated status and revision; QA2 did not edit those historical cases. `US1-TC1` remains the single unmarked case inherited from QA1. QA2 revisions were advanced for marker, fixture or assertion changes; case text changes made during QA1 remain draft.
- Linked scenario register: `TC-mjs` -> SC-05; `TC-13a` -> SC-06; `TC-7io` -> SC-07; `TC-de4` -> SC-08; `TC-63a` -> SC-45; `TC-1qu` -> SC-09, SC-11, SC-12 and SC-16; `TC-hpg` -> SC-10; `TC-29q` -> SC-13; `TC-s1n` -> SC-14; `TC-7oh` -> SC-17; `TC-nmi` -> SC-18; `TC-65a` -> SC-30; `TC-ic0` -> SC-30a; `TC-y4r` -> SC-31; `TC-s4f` -> SC-25; `TC-6gi` -> SC-34; `TC-19o` -> SC-47; and `TC-9jg` -> SC-36 and SC-37. These markers name only cases whose preconditions, route and expected result assert the linked scenario behavior.
- The changed suite data follows the single USD schedule in `bid-increments/spec.md`. For example, the USD501 maximum row in `TC-1qu` resolves to USD510 because its second-highest maximum is in the 50000-minor-unit tier. `TC-63a` uses SC-45's exact set/raise/collector/lower times and amounts. The accidental duplicate walk observation in `TC-7oh` was removed. `TC-19o` now asserts per-listing pseudonym separation required by SC-47.
- SC-32, SC-35, SC-38/39/40/44/46 remain out of this feature suite; task 7.14 now names focused regression tests for these behaviors, but they are planned verification, not case coverage or execution evidence. SC-15 remains unlinked because no feature case fully asserts its route and result. Its source scenario was corrected in rev3 to 805000 minor units, matching `min(810000, 800000 + 5000)`; tasks 7.7 and 7.8 name the planned schedule-outcome regression, not execution evidence.
- Out of this feature suite: SC-33 and SC-41/42/43 have exact planned implementation-test references in tasks 7.7 and 7.8. These are planned verifiers, not executed evidence or coverage links. SC-32, SC-35, SC-38/39/40/44/46 have no full feature case; exact planned regression task 7.14 now identifies each behavior. SC-33 and SC-41/42/43 remain mapped to planned test tasks 7.7 and 7.8. Planned tasks are not case coverage or execution evidence. No vague backend check or unrelated durable case is offered as a verifier.
- QA2 made no human-facing product decision or question. All active cases changed by QA1/QA2 remain draft. No implementation tests were run and no execution, acceptance or approval is claimed.

### Archived fold records

- Archived suites are reconciliation evidence only; they are not regeneration input.
- **2026-09-16-default-auction-bid-holds-off** — `grade10-site-auction-auto-bidding-US5-TC1-1` → `g10.auction-auto-bidding.US5-TC1`; `grade10-site-auction-auto-bidding-US5-TC2-1` → `g10.auction-auto-bidding.US5-TC2`; `grade10-site-auction-auto-bidding-US5-TC3-1` → `g10.auction-auto-bidding.US5-TC3`
- **2026-09-17-revise-auction-extended-bidding** — `grade10-site-auction-auto-bidding-US5-TC4-2` → `g10.auction-auto-bidding.US5`; `grade10-site-auction-auto-bidding-US5-TC7-1` → `g10.auction-auto-bidding.US5-TC7`
- **2026-10-02-relay-auction-live-state** — `grade10-site-auction-auto-bidding-US1-TC5-1` → `g10.auction-auto-bidding.US1-TC5`; `grade10-site-auction-auto-bidding-US1-TC6-1` → `g10.auction-auto-bidding.US1-TC6`; `grade10-site-auction-auto-bidding-US1-TC7-1` → `g10.auction-auto-bidding.US1-TC7`; `grade10-site-auction-auto-bidding-US1-TC8-1` → `g10.auction-auto-bidding.US1-TC8`
- **2026-10-03-refused-bid-is-not-a-bid** — `grade10-site-auction-auto-bidding-US1-TC8-1` → `g10.auction-auto-bidding.US1-TC8`; `grade10-site-auction-auto-bidding-US5-TC1-1` → `g10.auction-auto-bidding.US5-TC1`; `grade10-site-auction-auto-bidding-US5-TC2-1` → `g10.auction-auto-bidding.US5-TC2`; `grade10-site-auction-auto-bidding-US5-TC3-1` → `g10.auction-auto-bidding.US5-TC3`; `grade10-site-auction-auto-bidding-US5-TC7-2` → `g10.auction-auto-bidding.US5-TC7`
- Operators read the house as House; only `auction:reserve` reads its maximum, and every commitment, raise and lower of it with its Accepted At (Q9, Q25)
- A House bid shows any operator its own Accepted At, as the public history does, even where it equals the commit time (Q26)
- A reserve holder's committed-maximum trace names the internal bidder the house maximum was committed as; other operators read House alone (Q39)
