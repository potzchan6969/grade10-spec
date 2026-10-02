# grade10-site/auction/auto-bidding Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-02, tcs-rules r4

## grade10-site-auction-auto-bidding-US1: Collector commits a maximum on an open listing

**As a** collector,
**I want** to commit the most I will pay and raise it later,
**so that** Grade10 bids for me only as far as needed to lead.

<!-- trace:case id=g10.auction-auto-bidding.TC-0x8 rev=1 covers=g10.auction-auto-bidding.SC-71q,g10.auction-auto-bidding.SC-ec3,g10.auction-auto-bidding.SC-2eu,g10.auction-auto-bidding.SC-6h6 -->
### grade10-site-auction-auto-bidding-US1-TC1-1: First maximum opens bidding at the starting price

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-01

**Pre-conditions:**
An open listing with no bids, with the row's starting price.

**Test data:**

| Currency | Starting price | Maximum |
| --- | --- | --- |
| USD | 20000 minor units (USD 200.00) | 50000 minor units (USD 500.00) |
| HKD | 20000 minor units (HKD 200.00) | 50000 minor units (HKD 500.00) |
| JPY | 20000 minor units (JPY 20,000) | 50000 minor units (JPY 50,000) |

**Steps:**

1. Navigate to <an open listing url> priced in the row's currency.
2. Enter the row's maximum.
3. Confirm the commitment.

**Expected Results:**

* Grade10 accepts the commitment.
* The current bid is the row's starting price.
* Customer leads.

<!-- trace:case id=g10.auction-auto-bidding.TC-7gl rev=1 covers=g10.auction-auto-bidding.SC-71q,g10.auction-auto-bidding.SC-ec3,g10.auction-auto-bidding.SC-2eu,g10.auction-auto-bidding.SC-6h6 -->
### grade10-site-auction-auto-bidding-US1-TC2-1: Maximum below the minimum next bid is refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-01

**Pre-conditions:**
An open listing whose current bid and minimum increment match the row.

**Test data:**

| Currency | Current bid | Minimum increment | Attempted maximum |
| --- | --- | --- | --- |
| USD | 22500 minor units (USD 225.00) | 2500 minor units (USD 25.00) | 24000 minor units (USD 240.00) |
| HKD | 22500 minor units (HKD 225.00) | 2500 minor units (HKD 25.00) | 24000 minor units (HKD 240.00) |
| JPY | 22500 minor units (JPY 22,500) | 2500 minor units (JPY 2,500) | 24000 minor units (JPY 24,000) |

**Steps:**

1. Navigate to <an open listing url> priced in the row's currency.
2. Enter the row's attempted maximum.
3. Confirm the commitment.
4. Check the current bid and the leader.

**Expected Results:**

* Grade10 refuses the commitment.
* The current bid and the leader are unchanged.

<!-- trace:case id=g10.auction-auto-bidding.TC-9qy rev=1 covers=g10.auction-auto-bidding.SC-71q,g10.auction-auto-bidding.SC-ec3,g10.auction-auto-bidding.SC-2eu,g10.auction-auto-bidding.SC-6h6 -->
### grade10-site-auction-auto-bidding-US1-TC3-1: Leader raises their own maximum

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-01

**Pre-conditions:**
customer(leads with a committed maximum matching the row) is on that open listing's page.

**Test data:**

| Currency | Committed maximum | Raised maximum |
| --- | --- | --- |
| USD | 50000 minor units (USD 500.00) | 80000 minor units (USD 800.00) |
| HKD | 50000 minor units (HKD 500.00) | 80000 minor units (HKD 800.00) |
| JPY | 50000 minor units (JPY 50,000) | 80000 minor units (JPY 80,000) |

**Steps:**

1. Enter the row's raised maximum.
2. Confirm the raise.
3. Check who leads and the current bid.

**Expected Results:**

* Grade10 accepts the raise.
* Customer still leads.
* The current bid is unchanged.

<!-- trace:case id=g10.auction-auto-bidding.TC-vq3 rev=1 covers=g10.auction-auto-bidding.SC-71q,g10.auction-auto-bidding.SC-ec3,g10.auction-auto-bidding.SC-2eu,g10.auction-auto-bidding.SC-6h6 -->
### grade10-site-auction-auto-bidding-US1-TC4-1: Lowering a maximum is refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-01

**Pre-conditions:**
customer(has a committed maximum matching the row) is on that open listing's page.

**Test data:**

| Currency | Committed maximum | Attempted maximum |
| --- | --- | --- |
| USD | 50000 minor units (USD 500.00) | 30000 minor units (USD 300.00) |
| HKD | 50000 minor units (HKD 500.00) | 30000 minor units (HKD 300.00) |
| JPY | 50000 minor units (JPY 50,000) | 30000 minor units (JPY 30,000) |

**Steps:**

1. Enter the row's attempted maximum.
2. Confirm the commitment.
3. Check the committed maximum.

**Expected Results:**

* Grade10 refuses it.
* Customer's committed maximum remains the row's committed maximum.

### grade10-site-auction-auto-bidding-US1-TC5-1: Lone maximum on a zero start stands at the lowest increment

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
* **Trace:** grade10-site-auction-auto-bidding-US-01

**Pre-conditions:**

* An open listing in the row's currency, starting price 0, with no maximum committed.
* customer is signed in with a card linked and is on that listing's page.

**Test data:**

| Currency | Maximum | Lowest increment | Current bid after |
| --- | --- | --- | --- |
| USD | 100 minor units (USD 1.00), exactly the minimum | 100 minor units (USD 1.00) | 100 minor units (USD 1.00) |
| USD | 50000 minor units (USD 500.00), in the USD 500 tier | 100 minor units (USD 1.00) | 100 minor units (USD 1.00) |
| HKD | 1000 minor units (HKD 10.00), exactly the minimum | 1000 minor units (HKD 10.00) | 1000 minor units (HKD 10.00) |
| HKD | 100000 minor units (HKD 1,000.00), in the HKD 800 tier | 1000 minor units (HKD 10.00) | 1000 minor units (HKD 10.00) |
| JPY | 100 minor units (JPY 100), exactly the minimum | 100 minor units (JPY 100) | 100 minor units (JPY 100) |
| JPY | 50000 minor units (JPY 50,000), in the JPY 15,000 tier | 100 minor units (JPY 100) | 100 minor units (JPY 100) |

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

### grade10-site-auction-auto-bidding-US1-TC6-1: Maximum one minor unit below the minimum on a zero start is refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auto-bidding-US-01

**Pre-conditions:**

* An open listing in the row's currency, starting price 0, in the row's standing.
* customer B is signed in with a card linked.

**Test data:**

| Currency | Standing | Minimum next bid | Customer B's attempted maximum |
| --- | --- | --- | --- |
| USD | No maximum committed | 100 minor units (USD 1.00) | 99 minor units (USD 0.99) |
| HKD | No maximum committed | 1000 minor units (HKD 10.00) | 999 minor units (HKD 9.99) |
| JPY | No maximum committed | 100 minor units (JPY 100) | 99 minor units (JPY 99) |

**Steps:**

1. As customer B, submit the row's attempted maximum on the listing.
2. Read the API response.
3. Read the listing's current bid, leader and committed maxima.

**Expected Results:**

* Grade10 refuses the commitment, naming the row's minimum next bid.
* No maximum is recorded for customer B.
* The current bid and the leader are as the row's standing gives them.

### grade10-site-auction-auto-bidding-US1-TC7-1: Lone bidder wins a zero-start lot at the lowest increment

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
* **Trace:** grade10-site-auction-auto-bidding-US-01

**Pre-conditions:**

* An open listing in the row's currency, starting price 0, extension duration 0, scheduled close 10 minutes ahead.
* customer A committed a maximum of 50000 minor units before the scheduled close, the only maximum on the listing.

**Test data:**

| Currency | Lowest increment | Winning bid |
| --- | --- | --- |
| USD | 100 minor units (USD 1.00) | 100 minor units (USD 1.00) |
| HKD | 1000 minor units (HKD 10.00) | 1000 minor units (HKD 10.00) |
| JPY | 100 minor units (JPY 100) | 100 minor units (JPY 100) |

**Steps:**

1. Wait until the scheduled close passes with no further commitment.
2. Read the listing's state, winner and winning bid.

**Expected Results:**

* The listing is closed.
* Customer A wins.
* The winning bid is 0 plus the currency's lowest increment, the row's winning bid, not 0.

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

## grade10-site-auction-auto-bidding-US2: Collector reads their own maximum and standing

**As a** collector,
**I want** to see my own maximum, the current bid, and whether I lead,
**so that** I know where I stand without my cap being shown to anyone else.

<!-- trace:case id=g10.auction-auto-bidding.TC-mjs rev=1 covers=g10.auction-auto-bidding.SC-nqo,g10.auction-auto-bidding.SC-dmo,g10.auction-auto-bidding.SC-x57,g10.auction-auto-bidding.SC-eiw -->
### grade10-site-auction-auto-bidding-US2-TC1-1: Bidder reads their own commitment apart from the current bid

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-02

**Pre-conditions:**
customer(committed a maximum matching the row) is on a listing whose current bid matches the row.

**Test data:**

| Currency | Committed maximum | Current bid |
| --- | --- | --- |
| USD | 50000 minor units (USD 500.00) | 25000 minor units (USD 250.00) |
| HKD | 50000 minor units (HKD 500.00) | 25000 minor units (HKD 250.00) |
| JPY | 50000 minor units (JPY 50,000) | 25000 minor units (JPY 25,000) |

**Steps:**

1. Open the listing.

**Expected Results:**

* Customer sees their own maximum, the row's committed maximum.
* Customer sees the current bid, the row's value, as a separate fact.
* Customer sees that they lead.

<!-- trace:case id=g10.auction-auto-bidding.TC-13a rev=1 covers=g10.auction-auto-bidding.SC-nqo,g10.auction-auto-bidding.SC-dmo,g10.auction-auto-bidding.SC-x57,g10.auction-auto-bidding.SC-eiw -->
### grade10-site-auction-auto-bidding-US2-TC2-1: Overtaken bidder sees that they no longer lead

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-02

**Pre-conditions:**
customer(has been overtaken on an open listing) is on that listing's page.

**Steps:**

1. Open the listing.

**Expected Results:**

* Customer sees that they do not lead.
* Customer's own committed maximum is unchanged.

<!-- trace:case id=g10.auction-auto-bidding.TC-7io rev=1 covers=g10.auction-auto-bidding.SC-nqo,g10.auction-auto-bidding.SC-dmo,g10.auction-auto-bidding.SC-x57,g10.auction-auto-bidding.SC-eiw -->
### grade10-site-auction-auto-bidding-US2-TC3-1: Leader's maximum is not disclosed to another bidder

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-02

**Pre-conditions:**
customer A(leads with a committed maximum matching the row) is on a listing whose current bid matches the row.

**Test data:**

| Currency | Customer A's maximum | Current bid |
| --- | --- | --- |
| USD | 50000 minor units (USD 500.00) | 25000 minor units (USD 250.00) |
| HKD | 50000 minor units (HKD 500.00) | 25000 minor units (HKD 250.00) |
| JPY | 50000 minor units (JPY 50,000) | 25000 minor units (JPY 25,000) |

**Steps:**

1. Sign in as customer B.
2. Open the listing's public facts.

**Expected Results:**

* The facts carry the current bid, the row's value.
* The facts do not carry, and do not allow deriving, customer A's maximum, the row's value.

<!-- trace:case id=g10.auction-auto-bidding.TC-nmi rev=1 covers=g10.auction-auto-bidding.SC-nqo,g10.auction-auto-bidding.SC-dmo,g10.auction-auto-bidding.SC-x57,g10.auction-auto-bidding.SC-eiw -->
### grade10-site-auction-auto-bidding-US2-TC4-1: A tie is accepted and reported as not leading

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
* **Trace:** grade10-site-auction-auto-bidding-US-02

**Pre-conditions:**
customer B(leads an HKD listing with a committed maximum of 60000 minor units).

**Test data:**

| Field | Value |
| --- | --- |
| Customer C's maximum | 60000 minor units |

**Steps:**

1. Commit a maximum of 60000 minor units as customer C.
2. Read customer C's standing.
3. Read the listing's public bid history.

**Expected Results:**

* Grade10 accepts customer C's commitment.
* Customer C is reported as not leading.
* The public history records customer C's accepted action followed by customer B's automatic response, both at 60000 minor units.

---

## grade10-site-auction-auto-bidding-US3: Collector competes through two maxima

**As a** collector,
**I want** the current bid to come from the two highest maxima,
**so that** I take the lead only when my maximum is higher, and a tie stays
with whoever committed first.

<!-- trace:case id=g10.auction-auto-bidding.TC-1qu rev=1 covers=g10.auction-auto-bidding.SC-arz,g10.auction-auto-bidding.SC-5mw,g10.auction-auto-bidding.SC-hvc,g10.auction-auto-bidding.SC-wgx,g10.auction-auto-bidding.SC-edj,g10.auction-auto-bidding.SC-bqs,g10.auction-auto-bidding.SC-xwb,g10.auction-auto-bidding.SC-n5u,g10.auction-auto-bidding.SC-52s -->
### grade10-site-auction-auto-bidding-US3-TC1-1: Current bid resolves from the leader's and challenger's maxima

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-03

**Pre-conditions:**
An open HKD listing where customer A leads with a committed maximum of 1000 minor units, the current bid is 400 minor units, and the applicable increment is 100 minor units.

**Test data:**

| `<customer B maximum>` | Resolved current bid | Resolved leader |
| --- | --- | --- |
| 500 minor units | 600 minor units | customer A |
| 700 minor units | 800 minor units | customer A |
| 950 minor units | 1000 minor units | customer A |
| 1001 minor units | 1001 minor units | customer B |
| 1100 minor units | 1100 minor units | customer B |
| 1120 minor units | 1100 minor units | customer B |

**Steps:**

1. Commit `<customer B maximum>` as customer B.
2. Read the listing's current bid and leader.

**Expected Results:**

* The current bid matches the row's resolved current bid.
* The leader matches the row's resolved leader.
* Grade10 accepts no intermediate bid between the previous current bid and the resolved one.

<!-- trace:case id=g10.auction-auto-bidding.TC-hpg rev=1 covers=g10.auction-auto-bidding.SC-arz,g10.auction-auto-bidding.SC-5mw,g10.auction-auto-bidding.SC-hvc,g10.auction-auto-bidding.SC-wgx,g10.auction-auto-bidding.SC-edj,g10.auction-auto-bidding.SC-bqs,g10.auction-auto-bidding.SC-xwb,g10.auction-auto-bidding.SC-n5u,g10.auction-auto-bidding.SC-52s -->
### grade10-site-auction-auto-bidding-US3-TC2-1: Challenger raises again and still stays below the leader

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
* **Trace:** grade10-site-auction-auto-bidding-US-03

**Pre-conditions:**
customer A(leads an HKD listing at a current bid of 23500 minor units), and customer B's existing maximum is 22500 minor units.

**Test data:**

| Field | Value |
| --- | --- |
| Customer B's raised maximum | 30000 minor units |

**Steps:**

1. Raise customer B's maximum to 30000 minor units.
2. Read the listing's leader and current bid.

**Expected Results:**

* Customer A still leads.
* The current bid is 31000 minor units.

<!-- trace:case id=g10.auction-auto-bidding.TC-29q rev=1 covers=g10.auction-auto-bidding.SC-arz,g10.auction-auto-bidding.SC-5mw,g10.auction-auto-bidding.SC-hvc,g10.auction-auto-bidding.SC-wgx,g10.auction-auto-bidding.SC-edj,g10.auction-auto-bidding.SC-bqs,g10.auction-auto-bidding.SC-xwb,g10.auction-auto-bidding.SC-n5u,g10.auction-auto-bidding.SC-52s -->
### grade10-site-auction-auto-bidding-US3-TC3-1: Overtaken bidder raises but stays below the new leader

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
* **Trace:** grade10-site-auction-auto-bidding-US-03

**Pre-conditions:**
customer B(leads an HKD listing with a committed maximum of 50000 minor units), having overtaken customer A.

**Test data:**

| Field | Value |
| --- | --- |
| Customer A's raised maximum | 30000 minor units |

**Steps:**

1. Raise customer A's maximum to 30000 minor units.
2. Read the listing's leader and current bid.

**Expected Results:**

* Customer B still leads.
* The current bid is 31000 minor units.

<!-- trace:case id=g10.auction-auto-bidding.TC-s1n rev=1 covers=g10.auction-auto-bidding.SC-arz,g10.auction-auto-bidding.SC-5mw,g10.auction-auto-bidding.SC-hvc,g10.auction-auto-bidding.SC-wgx,g10.auction-auto-bidding.SC-edj,g10.auction-auto-bidding.SC-bqs,g10.auction-auto-bidding.SC-xwb,g10.auction-auto-bidding.SC-n5u,g10.auction-auto-bidding.SC-52s -->
### grade10-site-auction-auto-bidding-US3-TC4-1: Overtaken bidder raises past the current leader

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
* **Trace:** grade10-site-auction-auto-bidding-US-03

**Pre-conditions:**
customer B(leads an HKD listing with a committed maximum of 50000 minor units), having overtaken customer A.

**Test data:**

| Field | Value |
| --- | --- |
| Customer A's raised maximum | 60000 minor units |

**Steps:**

1. Raise customer A's maximum to 60000 minor units.
2. Read the listing's leader and current bid.

**Expected Results:**

* Customer A leads.
* The current bid is 51000 minor units.

<!-- trace:case id=g10.auction-auto-bidding.TC-wr4 rev=1 covers=g10.auction-auto-bidding.SC-arz,g10.auction-auto-bidding.SC-5mw,g10.auction-auto-bidding.SC-hvc,g10.auction-auto-bidding.SC-wgx,g10.auction-auto-bidding.SC-edj,g10.auction-auto-bidding.SC-bqs,g10.auction-auto-bidding.SC-xwb,g10.auction-auto-bidding.SC-n5u,g10.auction-auto-bidding.SC-52s -->
### grade10-site-auction-auto-bidding-US3-TC5-1: The current bid cannot exceed the new leader's own maximum

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
customer A(leads an HKD listing with a committed maximum of 800000 minor units).

**Test data:**

| Field | Value |
| --- | --- |
| Customer B's maximum | 810000 minor units |

**Steps:**

1. Commit a maximum of 810000 minor units as customer B.
2. Read the listing's leader and current bid.

**Expected Results:**

* Customer B leads.
* The current bid is 810000 minor units, not higher.

<!-- trace:case id=g10.auction-auto-bidding.TC-7oh rev=1 covers=g10.auction-auto-bidding.SC-arz,g10.auction-auto-bidding.SC-5mw,g10.auction-auto-bidding.SC-hvc,g10.auction-auto-bidding.SC-wgx,g10.auction-auto-bidding.SC-edj,g10.auction-auto-bidding.SC-bqs,g10.auction-auto-bidding.SC-xwb,g10.auction-auto-bidding.SC-n5u,g10.auction-auto-bidding.SC-52s -->
### grade10-site-auction-auto-bidding-US3-TC6-1: Equal maximum keeps the earlier leader and orders both public records together

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
customer B(leads with a committed maximum of 60000 minor units).

**Test data:**

| Field | Value |
| --- | --- |
| Customer C's maximum | 60000 minor units |

**Steps:**

1. Commit a maximum of 60000 minor units as customer C.
2. Read the listing's leader and current bid.
3. Read the public bid history's ordering and timestamps.

**Expected Results:**

* Customer B remains the leader.
* The current bid is 60000 minor units.
* The history records customer C's accepted action at 60000 minor units, then customer B's automatic response at 60000 minor units, both in the same resolution timestamp group.

---

## grade10-site-auction-auto-bidding-US4: Operator traces every committed maximum

**As an** operator,
**I want** to read every committed maximum and when it was accepted,
**so that** I can answer a dispute about who committed what.

<!-- trace:case id=g10.auction-auto-bidding.TC-de4 rev=1 covers=g10.auction-auto-bidding.SC-aqd -->
### grade10-site-auction-auto-bidding-US4-TC1-1: Operator reads every committed maximum to answer a dispute

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

---

## grade10-site-auction-auto-bidding-US5: Collector's auto-bid counts as a bid

**As a** collector,
**I want** every bid Grade10 places for me to count as a bid,
**so that** my auto-bids keep a lot open during extended bidding as a manual bid would.

<!-- trace:case id=g10.auction-auto-bidding.TC-dhr rev=1 covers=g10.auction-auto-bidding.SC-i9w,g10.auction-auto-bidding.SC-kxu,g10.auction-auto-bidding.SC-32f,g10.auction-auto-bidding.SC-kr7,g10.auction-auto-bidding.SC-9i5,g10.auction-auto-bidding.SC-44a,g10.auction-auto-bidding.SC-nwr,g10.auction-auto-bidding.SC-0yu -->
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

<!-- trace:case id=g10.auction-auto-bidding.TC-5xp rev=1 covers=g10.auction-auto-bidding.SC-i9w,g10.auction-auto-bidding.SC-kxu,g10.auction-auto-bidding.SC-32f,g10.auction-auto-bidding.SC-kr7,g10.auction-auto-bidding.SC-9i5,g10.auction-auto-bidding.SC-44a,g10.auction-auto-bidding.SC-nwr,g10.auction-auto-bidding.SC-0yu -->
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

<!-- trace:case id=g10.auction-auto-bidding.TC-hqr rev=1 covers=g10.auction-auto-bidding.SC-i9w,g10.auction-auto-bidding.SC-kxu,g10.auction-auto-bidding.SC-32f,g10.auction-auto-bidding.SC-kr7,g10.auction-auto-bidding.SC-9i5,g10.auction-auto-bidding.SC-44a,g10.auction-auto-bidding.SC-nwr,g10.auction-auto-bidding.SC-0yu -->
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

<!-- trace:case id=g10.auction-auto-bidding.TC-rmo rev=1 covers=g10.auction-auto-bidding.SC-i9w,g10.auction-auto-bidding.SC-kxu,g10.auction-auto-bidding.SC-32f,g10.auction-auto-bidding.SC-kr7,g10.auction-auto-bidding.SC-9i5,g10.auction-auto-bidding.SC-44a,g10.auction-auto-bidding.SC-nwr,g10.auction-auto-bidding.SC-0yu -->
### grade10-site-auction-auto-bidding-US5-TC5-1: An auto bid is counted and recorded on the bidder's behalf

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auto-bidding-US-05

**Pre-conditions:**
Grade10 has raised a bidder's bid on their behalf.

**Steps:**

1. Read the listing's bid count.
2. Read the listing's bid history.

**Expected Results:**

* The bid count includes that bid.
* The history shows it as placed on that bidder's behalf, not as a manual bid.

<!-- trace:case id=g10.auction-auto-bidding.TC-zjt rev=1 covers=g10.auction-auto-bidding.SC-i9w,g10.auction-auto-bidding.SC-kxu,g10.auction-auto-bidding.SC-32f,g10.auction-auto-bidding.SC-kr7,g10.auction-auto-bidding.SC-9i5,g10.auction-auto-bidding.SC-44a,g10.auction-auto-bidding.SC-nwr,g10.auction-auto-bidding.SC-0yu -->
### grade10-site-auction-auto-bidding-US5-TC6-1: Standing maxima do not keep bidding on their own

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auto-bidding-US-05

**Pre-conditions:**
Two bidders have committed maxima and the listing has been resolved to the two-maximum price.

**Steps:**

1. Let time pass with no further commitment accepted.
2. Read the current bid and whether Grade10 placed any further bid.

**Expected Results:**

* Grade10 places no further bid on either bidder's behalf.
* The current bid is unchanged.

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

<!-- trace:case id=g10.auction-auto-bidding.TC-y3w rev=1 covers=g10.auction-auto-bidding.SC-i9w,g10.auction-auto-bidding.SC-kxu,g10.auction-auto-bidding.SC-32f,g10.auction-auto-bidding.SC-kr7,g10.auction-auto-bidding.SC-9i5,g10.auction-auto-bidding.SC-44a,g10.auction-auto-bidding.SC-nwr,g10.auction-auto-bidding.SC-0yu -->
### grade10-site-auction-auto-bidding-US5-TC8-1: Auto bid during extended bidding restarts the timer once

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
* **Trace:** grade10-site-auction-auto-bidding-US-05

**Pre-conditions:**

* `<listing_1>` is in extended bidding.
* customer A leads `<listing_1>` with a committed maximum of `<user A maximum>`.
* customer B is signed in with a card saved and is on `<listing_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | A listing past its scheduled close, in extended bidding, extension duration `<extension duration>`, no cap |
| `<extension duration>` | 1800 seconds |
| `<user A maximum>` | 800000 HKD minor units |
| `<user B maximum>` | 555000 HKD minor units, below `<user A maximum>` |
| `<bid time>` | The moment customer B confirms |

**Steps:**

1. As customer B, commit a maximum of `<user B maximum>` at `<bid time>`.
2. Read the current bid and Time left.
3. Wait until the new close passes with no further commitment.

**Expected Results:**

* Grade10 raises customer A's bid on their behalf, and the close moves to `<bid time>` plus `<extension duration>`.
* No further bid is placed on either maximum before the close.

<!-- trace:case id=g10.auction-auto-bidding.TC-wqa rev=1 covers=g10.auction-auto-bidding.SC-i9w,g10.auction-auto-bidding.SC-kxu,g10.auction-auto-bidding.SC-32f,g10.auction-auto-bidding.SC-kr7,g10.auction-auto-bidding.SC-9i5,g10.auction-auto-bidding.SC-44a,g10.auction-auto-bidding.SC-nwr,g10.auction-auto-bidding.SC-0yu -->
### grade10-site-auction-auto-bidding-US5-TC9-1: Maximum committed before the close starts extended bidding

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
* **Trace:** grade10-site-auction-auto-bidding-US-05

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

## Settled

- A first maximum on a 0 start must reach 0 plus the currency's lowest increment; a first bid of 0 or of one minor unit is a non-goal, and no case asserts either.
- Committing or raising a maximum takes nothing from the card, and a bid Grade10 places for a collector takes nothing either; no case reads a card authorization or a hold switch (decisions Q1, Q5).
- A raise is accepted or refused on the auction's rules alone; a raise refused for a card reason no longer exists, and its case is deprecated.
- An auto-bid step's price is US3's to assert; with no card check left to tell it apart, the US5 case that read it is deprecated.

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

- **Folded in** - `grade10-site-auction-auto-bidding-SC-25` and the accepted raise of `grade10-site-auction-auto-bidding-SC-32` by `grade10-site-auction-auto-bidding-US5-TC7-2`
- **Covered at domain** - `grade10-site-auction-e2e-US04-TC03-2` reads the refusal and the bid form's words of `grade10-site-auction-auto-bidding-SC-32`'s second half, a maximum not raised
- **Revised** - `grade10-site-auction-auto-bidding-US5-TC7-2` reads that nothing is taken from the card; its marker drops grade10-site-auction-auto-bidding-SC-19, grade10-site-auction-auto-bidding-SC-20 and grade10-site-auction-auto-bidding-SC-21 and covers `grade10-site-auction-auto-bidding-SC-32`. `grade10-site-auction-auto-bidding-US1-TC8-1` loses the hold switch pre-condition only, `<v>` kept
- **Deprecated** - `grade10-site-auction-auto-bidding-US5-TC1-1`, `grade10-site-auction-auto-bidding-US5-TC2-1` and `grade10-site-auction-auto-bidding-US5-TC3-1`, with the hold requirement
- **Raised** - none
- **Contradicted** - none
- **Uncovered anchors** - none; the Feature set's No card hold leaf by `grade10-site-auction-auto-bidding-US5-TC7-2`
