# grade10-site/auction/auto-bidding Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-10, tcs-rules r3.0

## grade10-site-auction-auto-bidding-US1: Collector commits a maximum on an open listing

**As a** collector,
**I want** to commit the most I will pay and raise it later,
**so that** Grade10 bids for me only as far as needed to lead.

### grade10-site-auction-auto-bidding-US1-TC1-1: First maximum opens bidding at the starting price

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
* **Trace:** grade10-site-auction-auto-bidding-US-01

**Pre-conditions:**
An open listing with a starting price of 20000 minor units and no bids.

**Test data:**

| Field | Value |
| --- | --- |
| Starting price | 20000 minor units |
| Maximum | 50000 minor units |

**Steps:**

1. Navigate to <an open listing url>.
2. Enter a maximum of 50000 minor units.
3. Confirm the commitment.

**Expected Results:**

* Grade10 accepts the commitment.
* The current bid is 20000 minor units.
* Customer leads.

### grade10-site-auction-auto-bidding-US1-TC2-1: Maximum below the minimum next bid is refused

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
An open listing whose current bid is 22500 minor units and whose minimum increment is 2500 minor units.

**Test data:**

| Field | Value |
| --- | --- |
| Current bid | 22500 minor units |
| Minimum increment | 2500 minor units |
| Attempted maximum | 24000 minor units |

**Steps:**

1. Navigate to <an open listing url>.
2. Enter a maximum of 24000 minor units.
3. Confirm the commitment.
4. Check the current bid and the leader.

**Expected Results:**

* Grade10 refuses the commitment.
* The current bid and the leader are unchanged.

### grade10-site-auction-auto-bidding-US1-TC3-1: Leader raises their own maximum

**Classification:**

* **Severity:** major
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
customer(leads with a committed maximum of 50000 minor units) is on that open listing's page.

**Test data:**

| Field | Value |
| --- | --- |
| Raised maximum | 80000 minor units |

**Steps:**

1. Enter a maximum of 80000 minor units.
2. Confirm the raise.
3. Check who leads and the current bid.

**Expected Results:**

* Grade10 accepts the raise.
* Customer still leads.
* The current bid is unchanged.

### grade10-site-auction-auto-bidding-US1-TC4-1: Lowering a maximum is refused

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
customer(has a committed maximum of 50000 minor units) is on that open listing's page.

**Test data:**

| Field | Value |
| --- | --- |
| Committed maximum | 50000 minor units |
| Attempted maximum | 30000 minor units |

**Steps:**

1. Enter a maximum of 30000 minor units.
2. Confirm the commitment.
3. Check the committed maximum.

**Expected Results:**

* Grade10 refuses it.
* Customer's committed maximum remains 50000 minor units.

---

## grade10-site-auction-auto-bidding-US2: Collector reads their own maximum and standing

**As a** collector,
**I want** to see my own maximum, the current bid, and whether I lead,
**so that** I know where I stand without my cap being shown to anyone else.

### grade10-site-auction-auto-bidding-US2-TC1-1: Bidder reads their own commitment apart from the current bid

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
customer(committed a maximum of 50000 minor units) is on a listing whose current bid is 25000 minor units.

**Steps:**

1. Open the listing.

**Expected Results:**

* Customer sees their own maximum of 50000 minor units.
* Customer sees the current bid of 25000 minor units as a separate fact.
* Customer sees that they lead.

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

### grade10-site-auction-auto-bidding-US2-TC3-1: Leader's maximum is not disclosed to another bidder

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
customer A(leads with a committed maximum of 50000 minor units) is on a listing whose current bid is 25000 minor units.

**Steps:**

1. Sign in as customer B.
2. Open the listing's public facts.

**Expected Results:**

* The facts carry the current bid of 25000 minor units.
* The facts do not carry, and do not allow deriving, customer A's maximum of 50000 minor units.

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
**I want** the hold to cover my maximum and every bid Grade10 places for me to
count as a bid,
**so that** I am authorized once and still extend the close when I auto-bid in
the window.

### grade10-site-auction-auto-bidding-US5-TC1-1: The hold is the maximum, not the current bid

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auto-bidding-US-05

**Pre-conditions:**
An open listing whose current bid is 22500 minor units.

**Test data:**

| Field | Value |
| --- | --- |
| Committed maximum | 50000 minor units |

**Steps:**

1. Submit and accept a maximum of 50000 minor units for a bidder.
2. Read the card authorization held for that bidder and listing.

**Expected Results:**

* Grade10 holds an authorization for 50000 minor units.
* Exactly one active authorization exists for that bidder and listing.

### grade10-site-auction-auto-bidding-US5-TC2-1: A raise that cannot be authorized changes nothing

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auto-bidding-US-05

**Pre-conditions:**
customer A(leads with a committed maximum of 50000 minor units). The card authorization for a raise to 80000 minor units will fail.

**Test data:**

| Field | Value |
| --- | --- |
| Attempted raise | 80000 minor units |

**Steps:**

1. Raise customer A's maximum to 80000 minor units.
2. Read customer A's committed maximum, the leader, and the current bid.

**Expected Results:**

* Grade10 refuses the raise.
* Customer A's committed maximum remains 50000 minor units.
* The leader and the current bid are unchanged.

### grade10-site-auction-auto-bidding-US5-TC3-1: An auto-bid step needs no new card check

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
customer A(leads with an authorized maximum of 50000 minor units) while the current bid is 25000 minor units.

**Test data:**

| Field | Value |
| --- | --- |
| Challenger's maximum | 30000 minor units |

**Steps:**

1. Commit a maximum of 30000 minor units as a challenger.
2. Read customer A's current bid on their behalf and their authorization amount.

**Expected Results:**

* Grade10 raises customer A's bid on their behalf without a further card authorization.
* The current bid is 32500 minor units.
* Customer A's authorization remains 50000 minor units.

### grade10-site-auction-auto-bidding-US5-TC4-1: An auto bid in the extension window extends the close once

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
A listing is inside its extension window, and its leader's committed maximum has room left.

**Steps:**

1. Commit a challenger's maximum that causes Grade10 to raise the leader's bid on their behalf.
2. Read the listing's recorded close.

**Expected Results:**

* The close moves exactly as a manual bid at that moment would.
* The listing does not close while that extension stands.
* Grade10 places no further bid until another commitment is accepted.

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
