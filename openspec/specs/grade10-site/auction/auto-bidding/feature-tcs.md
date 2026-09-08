# grade10-site/auction/auto-bidding Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-01, tcs-rules r1

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
* **Type:** smoke
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
* That bidder leads.

### grade10-site-auction-auto-bidding-US1-TC2-1: Maximum below the minimum next bid is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
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
| Maximum | 24000 minor units |

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
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-01

**Pre-conditions:**
Bidder A leads with a committed maximum of 50000 minor units.

**Test data:**

| Field | Value |
| --- | --- |
| Raised maximum | 80000 minor units |

**Steps:**

1. Navigate to <an open listing url> as bidder A.
2. Enter a maximum of 80000 minor units.
3. Confirm the raise.
4. Check who leads and the current bid.

**Expected Results:**

* Grade10 accepts the raise.
* Bidder A still leads.
* The current bid is unchanged.

### grade10-site-auction-auto-bidding-US1-TC4-1: Lowering a maximum is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-01

**Pre-conditions:**
A bidder with a committed maximum of 50000 minor units on an open listing.

**Test data:**

| Field | Value |
| --- | --- |
| Committed maximum | 50000 minor units |
| Attempted maximum | 30000 minor units |

**Steps:**

1. Navigate to <an open listing url>.
2. Enter a maximum of 30000 minor units.
3. Confirm the commitment.
4. Check the committed maximum.

**Expected Results:**

* Grade10 refuses it.
* Their committed maximum remains 50000 minor units.

---

## grade10-site-auction-auto-bidding-US2: Collector reads their own maximum and standing

**As a** collector,
**I want** to see my own maximum, the current bid, and whether I lead,
**so that** I know where I stand without my cap being shown to anyone else.

### grade10-site-auction-auto-bidding-US2-TC1-1: Bidder reads their own maximum beside the current bid

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-02

**Pre-conditions:**
Bidder A has committed a maximum of 50000 minor units while the current bid is 25000 minor units.

**Test data:**

| Field | Value |
| --- | --- |
| Own maximum | 50000 minor units |
| Current bid | 25000 minor units |

**Steps:**

1. Navigate to <an open listing url> as bidder A.
2. Check the listing's bidding facts.

**Expected Results:**

* They see their own maximum of 50000 minor units.
* They see the current bid of 25000 minor units as a separate fact.
* They see that they lead.

### grade10-site-auction-auto-bidding-US2-TC2-1: Overtaken bidder sees they no longer lead

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-02

**Pre-conditions:**
Bidder A has been overtaken on a listing.

**Steps:**

1. Navigate to <an open listing url> as bidder A.
2. Check standing and the committed maximum.

**Expected Results:**

* They see that they do not lead.
* They see their own committed maximum unchanged.

### grade10-site-auction-auto-bidding-US2-TC3-1: Leader's maximum is not public

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-02

**Pre-conditions:**
Bidder A leads with a committed maximum of 50000 minor units while the current bid is 25000.

**Test data:**

| Field | Value |
| --- | --- |
| A's maximum | 50000 minor units |
| Current bid | 25000 minor units |

**Steps:**

1. Navigate to <an open listing url> as any other bidder.
2. Check the listing's public facts.

**Expected Results:**

* Those facts carry the current bid of 25000 minor units.
* They do not carry, and do not allow deriving, A's maximum of 50000.

### grade10-site-auction-auto-bidding-US2-TC4-1: Matching maximum is accepted without taking the lead

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-02

**Pre-conditions:**
Bidder B leads a listing with a committed maximum of 60000 minor units. Bidder C has committed a matching maximum of 60000 minor units.

**Test data:**

| Field | Value |
| --- | --- |
| Tied maximum | 60000 minor units |

**Steps:**

1. Navigate to <an open listing url> as bidder C.
2. Check C's own standing.

**Expected Results:**

* Their commitment is recorded as accepted.
* They are not the leader.

---

## grade10-site-auction-auto-bidding-US3: Collector competes through two maxima

**As a** collector,
**I want** the current bid to come from the two highest maxima,
**so that** I take the lead only when my maximum is higher, and a tie stays
with whoever committed first.

### grade10-site-auction-auto-bidding-US3-TC1-1: Challenger below the leader raises the price only

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-03

**Pre-conditions:**
A listing whose minimum increment is 2500 minor units. Bidder A leads with a committed maximum of 50000 minor units.

**Test data:**

| Field | Value |
| --- | --- |
| Minimum increment | 2500 minor units |
| A's maximum | 50000 minor units |
| B's maximum | 22500 minor units |

**Steps:**

1. Navigate to <an open listing url> as bidder B.
2. Commit a maximum of 22500 minor units.
3. Check who leads and the current bid.

**Expected Results:**

* Bidder A still leads.
* The current bid is 25000 minor units.

### grade10-site-auction-auto-bidding-US3-TC2-1: Challenger raises again, still below the leader

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-03

**Pre-conditions:**
Bidder A leads with a committed maximum of 50000 minor units. Bidder B has a committed maximum of 22500 minor units. The current bid is 25000 minor units. The minimum increment is 2500 minor units.

**Test data:**

| Field | Value |
| --- | --- |
| B's raised maximum | 30000 minor units |

**Steps:**

1. Navigate to <an open listing url> as bidder B.
2. Raise the maximum to 30000 minor units.
3. Check who leads and the current bid.

**Expected Results:**

* Bidder A still leads.
* The current bid is 32500 minor units.

### grade10-site-auction-auto-bidding-US3-TC3-1: Challenger above the leader takes the lead

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-03

**Pre-conditions:**
Bidder A leads with a committed maximum of 50000 minor units. The increment is 2500 minor units.

**Test data:**

| Field | Value |
| --- | --- |
| A's maximum | 50000 minor units |
| B's raised maximum | 60000 minor units |

**Steps:**

1. Navigate to <an open listing url> as bidder B.
2. Raise the maximum to 60000 minor units.
3. Check who leads and the current bid.

**Expected Results:**

* Bidder B leads.
* The current bid is 52500 minor units.

### grade10-site-auction-auto-bidding-US3-TC4-1: First bidder is overtaken by a higher maximum

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-03

**Pre-conditions:**
An open listing with a starting price of 20000 minor units and a minimum increment of 2500 minor units. Bidder A has committed a maximum of 22500 minor units and leads at 20000 minor units.

**Test data:**

| Field | Value |
| --- | --- |
| Starting price | 20000 minor units |
| Minimum increment | 2500 minor units |
| A's maximum | 22500 minor units |
| B's maximum | 50000 minor units |

**Steps:**

1. Navigate to <an open listing url> as bidder B.
2. Commit a maximum of 50000 minor units.
3. Check who leads and the current bid.

**Expected Results:**

* Bidder B leads.
* The current bid is 25000 minor units.

### grade10-site-auction-auto-bidding-US3-TC5-1: Overtaken bidder raises but stays below

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-03

**Pre-conditions:**
Bidder B leads with a maximum of 50000 minor units. Bidder A has a committed maximum below that. The minimum increment is 2500 minor units.

**Test data:**

| Field | Value |
| --- | --- |
| B's maximum | 50000 minor units |
| A's raised maximum | 30000 minor units |

**Steps:**

1. Navigate to <an open listing url> as bidder A.
2. Raise the maximum to 30000 minor units.
3. Check who leads and the current bid.

**Expected Results:**

* Bidder B still leads.
* The current bid is 32500 minor units.

### grade10-site-auction-auto-bidding-US3-TC6-1: Overtaken bidder raises past the leader

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-03

**Pre-conditions:**
Bidder B's maximum is 50000 minor units and the increment is 2500. Bidder A is not leading.

**Test data:**

| Field | Value |
| --- | --- |
| B's maximum | 50000 minor units |
| A's raised maximum | 60000 minor units |

**Steps:**

1. Navigate to <an open listing url> as bidder A.
2. Raise the maximum to 60000 minor units.
3. Check who leads and the current bid.

**Expected Results:**

* Bidder A leads.
* The current bid is 52500 minor units.

### grade10-site-auction-auto-bidding-US3-TC7-1: Step to lead cannot exceed the new leader's maximum

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-03

**Pre-conditions:**
A listing whose minimum increment is 2500 minor units. Bidder A leads with a committed maximum of 50000 minor units.

**Test data:**

| Field | Value |
| --- | --- |
| Minimum increment | 2500 minor units |
| A's maximum | 50000 minor units |
| B's maximum | 51000 minor units |

**Steps:**

1. Navigate to <an open listing url> as bidder B.
2. Commit a maximum of 51000 minor units.
3. Check who leads and the current bid.

**Expected Results:**

* Bidder B leads.
* The current bid is 51000 minor units.

### grade10-site-auction-auto-bidding-US3-TC8-1: Challenge lands at the two-maximum price, not a ladder

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-03

**Pre-conditions:**
A listing whose minimum increment is 2500 minor units, starting price 20000 minor units, and no bids. Bidder A has committed a maximum of 50000 minor units.

**Test data:**

| Field | Value |
| --- | --- |
| Starting price | 20000 minor units |
| Minimum increment | 2500 minor units |
| A's maximum | 50000 minor units |
| B's maximum | 80000 minor units |

**Steps:**

1. Navigate to <an open listing url> as bidder B.
2. Commit a maximum of 80000 minor units.
3. Check who leads, the current bid, and the bid history.

**Expected Results:**

* Bidder B leads.
* The current bid is 52500 minor units.
* Grade10 has not accepted bids at the intermediate increment amounts between 20000 and 52500.

### grade10-site-auction-auto-bidding-US3-TC9-1: Tie goes to the earlier commitment

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-03

**Pre-conditions:**
Bidder B leads a listing with a committed maximum of 60000 minor units.

**Test data:**

| Field | Value |
| --- | --- |
| Tied maximum | 60000 minor units |

**Steps:**

1. Navigate to <an open listing url> as bidder C.
2. Commit a maximum of 60000 minor units.
3. Check who leads and the current bid.

**Expected Results:**

* Bidder B still leads.
* The current bid is 60000 minor units.

---

## grade10-site-auction-auto-bidding-US4: Operator traces every committed maximum

**As an** operator,
**I want** to read every committed maximum and when it was accepted,
**so that** I can answer a dispute about who committed what.

### grade10-site-auction-auto-bidding-US4-TC1-1: Operator reads each committed maximum and Accepted At

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-04

**Pre-conditions:**
A listing with several committed maximums. An authorized operator.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that listing's bid history.
3. Check each commitment.

**Expected Results:**

* Each commitment shows its bidder, its maximum, and its Accepted At.

---

## grade10-site-auction-auto-bidding-US5: Collector's auto-bid counts as a bid

**As a** collector,
**I want** the hold to cover my maximum and every bid Grade10 places for me to
count as a bid,
**so that** I am authorized once and still extend the close when I auto-bid in
the window.

### grade10-site-auction-auto-bidding-US5-TC1-1: Hold is the maximum, not the price

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-05

**Pre-conditions:**
A listing whose current bid is 22500 minor units.

**Test data:**

| Field | Value |
| --- | --- |
| Current bid | 22500 minor units |
| Maximum | 50000 minor units |

**Steps:**

1. Navigate to <an open listing url>.
2. Commit a maximum of 50000 minor units and wait until it is accepted.
3. Check <the authorization for that bidder and listing>.

**Expected Results:**

* Grade10 holds an authorization for 50000 minor units.
* It holds exactly one active authorization for that bidder and listing.

### grade10-site-auction-auto-bidding-US5-TC2-1: Raise that cannot be authorized changes nothing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-05

**Pre-conditions:**
Bidder A leads with a committed maximum of 50000 minor units. Card authorization for 80000 minor units is set to fail.

**Test data:**

| Field | Value |
| --- | --- |
| Committed maximum | 50000 minor units |
| Raised maximum | 80000 minor units |

**Steps:**

1. Navigate to <an open listing url> as bidder A.
2. Raise to 80000 minor units.
3. Check the committed maximum, the leader, and the current bid.

**Expected Results:**

* Grade10 refuses the raise.
* A's committed maximum remains 50000 minor units.
* The leader and the current bid are unchanged.

### grade10-site-auction-auto-bidding-US5-TC3-1: Auto-bid step needs no new card check

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-05

**Pre-conditions:**
Bidder A leads with an authorized maximum of 50000 minor units and the current bid is 25000.

**Test data:**

| Field | Value |
| --- | --- |
| A's maximum | 50000 minor units |
| Challenger maximum | 30000 minor units |

**Steps:**

1. Navigate to <an open listing url> as a challenger.
2. Commit a maximum of 30000 minor units.
3. Check the current bid and <the authorization for bidder A and listing>.

**Expected Results:**

* Grade10 raises A's bid on their behalf without a further card authorization.
* The current bid is 32500 minor units.
* A's authorization remains 50000 minor units.

### grade10-site-auction-auto-bidding-US5-TC4-1: Auto bid in the extension window extends once

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-05

**Pre-conditions:**
A listing inside its extension window, and a leader whose committed maximum has room left.

**Steps:**

1. Navigate to <an open listing url> as a challenger.
2. Commit a maximum that causes Grade10 to raise the leader's bid on their behalf.
3. Check the listing's close and whether further bids are placed.

**Expected Results:**

* That bid moves the listing's close exactly as a manual bid at that moment would.
* The listing does not close while that extension stands.
* Grade10 places no further bid until another commitment is accepted.

### grade10-site-auction-auto-bidding-US5-TC5-1: Auto bid is counted and recorded

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-05

**Pre-conditions:**
Grade10 has raised a bidder's bid on their behalf.

**Steps:**

1. Navigate to <an open listing url>.
2. Check the listing's bid count and history.

**Expected Results:**

* The bid count includes that bid.
* The history shows it as placed on that bidder's behalf, not as a manual bid.

### grade10-site-auction-auto-bidding-US5-TC6-1: Standing maxima do not keep bidding

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-05

**Pre-conditions:**
Two bidders have committed maxima and the listing has been resolved to the two-maximum price.

**Steps:**

1. Navigate to <an open listing url>.
2. Wait with no further commitment accepted.
3. Check the current bid and whether further bids are placed.

**Expected Results:**

* Grade10 places no further bid on either bidder's behalf.
* The current bid is unchanged.
