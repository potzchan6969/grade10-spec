# grade10-admin/auction/test-winners Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-29, tcs-rules r4

**Out of suite:** grade10-admin-auction-test-winners-SC-13 — held by the admin console's bundle check, which fails a production build that carries the Test tab's code

## grade10-admin-auction-test-winners-US1: Test winners for QA

**As an** operator testing the winner's order,
**I want** a winner of a closed lot I can sign in as, made in one step,
**so that** I walk the order by hand without bidding and waiting for a close.

<!-- trace:case id=g10adm.auction-test-winners.TC-7qq rev=1 covers=g10adm.auction-test-winners.SC-pxq,g10adm.auction-test-winners.SC-wfn,g10adm.auction-test-winners.SC-kfc,g10adm.auction-test-winners.SC-ibc,g10adm.auction-test-winners.SC-0fh,g10adm.auction-test-winners.SC-qka,g10adm.auction-test-winners.SC-9cm,g10adm.auction-test-winners.SC-fb4,g10adm.auction-test-winners.SC-y07 -->
### grade10-admin-auction-test-winners-US1-TC7-1: One action makes a winner waiting on setup

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
* **Trace:** Making a test winner

**Pre-conditions:**

* admin(operator with `auction:operate` and `user:create`) is signed in as `qa.lead@grade10.com` on staging.

**Steps:**

1. Open Winners in the Test tab under Auction.
2. Make a test winner with the default email, the name "QA Winner" and a winning bid of HK$1,000.00.
3. Choose Open order on the new row.
4. Open the operator's inbox.

**Expected Results:**

* Winners lists the new test winner at `qa.lead+qa-<code>@grade10.com`, reading Awaiting Setup.
* The order is for the closed lot `Test lot <code>`, won at HK$1,000.00.
* The account at that address has not signed in.
* The inbox holds the auction-won letter for that lot, sent to that address.

<!-- trace:case id=g10adm.auction-test-winners.TC-abd rev=1 covers=g10adm.auction-test-winners.SC-pxq,g10adm.auction-test-winners.SC-wfn,g10adm.auction-test-winners.SC-kfc,g10adm.auction-test-winners.SC-ibc,g10adm.auction-test-winners.SC-0fh,g10adm.auction-test-winners.SC-qka,g10adm.auction-test-winners.SC-9cm,g10adm.auction-test-winners.SC-fb4,g10adm.auction-test-winners.SC-y07 -->
### grade10-admin-auction-test-winners-US1-TC8-1: Production, or a missing grant, makes nothing

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Making a test winner

**Pre-conditions:**

* admin(operator with the row's grants) is signed in on the row's lane.

**Test data:**

| Lane | Grants | Answer |
| --- | --- | --- |
| production | `auction:operate` and `user:create` | As if the action did not exist |
| staging | `auction:operate` only | Refused |

**Steps:**

1. Send a make request at the operator's own address with a `+qa-` tag.

**Expected Results:**

* Grade10 gives the row's **Answer**.
* No account, lot or order is made.

<!-- trace:case id=g10adm.auction-test-winners.TC-p4o rev=1 covers=g10adm.auction-test-winners.SC-pxq,g10adm.auction-test-winners.SC-wfn,g10adm.auction-test-winners.SC-kfc,g10adm.auction-test-winners.SC-ibc,g10adm.auction-test-winners.SC-0fh,g10adm.auction-test-winners.SC-qka,g10adm.auction-test-winners.SC-9cm,g10adm.auction-test-winners.SC-fb4,g10adm.auction-test-winners.SC-y07 -->
### grade10-admin-auction-test-winners-US1-TC9-1: An address not the operator's tagged one, or holding a signed-in account, is refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Making a test winner

**Pre-conditions:**

* admin(operator with `auction:operate` and `user:create`) is signed in as `qa.lead@grade10.com` on staging.
* An account at `qa.lead+qa-7kq2@grade10.com` has signed in.

**Test data:**

| Email | The refusal |
| --- | --- |
| `someone@example.com` | Refused |
| `qa.lead@grade10.com` | Refused |
| `qa.lead+qa-7kq2@grade10.com` | Refused, saying the address already holds an account |

**Steps:**

1. Send a make request at the row's **Email**.

**Expected Results:**

* Grade10 gives the row's **The refusal**.
* No account, lot or order is made.

<!-- trace:case id=g10adm.auction-test-winners.TC-3qi rev=1 covers=g10adm.auction-test-winners.SC-pxq,g10adm.auction-test-winners.SC-wfn,g10adm.auction-test-winners.SC-kfc,g10adm.auction-test-winners.SC-ibc,g10adm.auction-test-winners.SC-0fh,g10adm.auction-test-winners.SC-qka,g10adm.auction-test-winners.SC-9cm,g10adm.auction-test-winners.SC-fb4,g10adm.auction-test-winners.SC-y07 -->
### grade10-admin-auction-test-winners-US1-TC10-1: The same address makes one test winner

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
* **Trace:** Making a test winner

**Pre-conditions:**

* admin(operator with `auction:operate` and `user:create`) is signed in as `qa.lead@grade10.com` on staging.
* A test winner made at `qa.lead+qa-7kq2@grade10.com`, whose account has not signed in.

**Steps:**

1. Send a make request at `qa.lead+qa-7kq2@grade10.com` again.
2. Read the list of test winners.

**Expected Results:**

* Grade10 returns the order it made the first time.
* One account, one lot and one order exist for that address.

<!-- trace:case id=g10adm.auction-test-winners.TC-47e rev=1 covers=g10adm.auction-test-winners.SC-pxq,g10adm.auction-test-winners.SC-wfn,g10adm.auction-test-winners.SC-kfc,g10adm.auction-test-winners.SC-ibc,g10adm.auction-test-winners.SC-0fh,g10adm.auction-test-winners.SC-qka,g10adm.auction-test-winners.SC-9cm,g10adm.auction-test-winners.SC-fb4,g10adm.auction-test-winners.SC-y07 -->
### grade10-admin-auction-test-winners-US1-TC11-1: A past close up to 30 days back, at the limit included, opens an overdue order

Runs once per row of **Test data**.

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
* **Trace:** Making a test winner

**Pre-conditions:**

* admin(operator with `auction:operate` and `user:create`) is signed in on staging at 2026-09-29T10:00:00Z.

**Test data:**

| Closed at | The order reads |
| --- | --- |
| 2026-09-26T10:00:00Z | Setup Overdue |
| 2026-08-30T10:00:00Z | Setup Overdue |

**Steps:**

1. Send a make request closed at the row's **Closed at**.
2. Read the order's status.

**Expected Results:**

* The order reads the row's **The order reads**.

<!-- trace:case id=g10adm.auction-test-winners.TC-b5b rev=1 covers=g10adm.auction-test-winners.SC-pxq,g10adm.auction-test-winners.SC-wfn,g10adm.auction-test-winners.SC-kfc,g10adm.auction-test-winners.SC-ibc,g10adm.auction-test-winners.SC-0fh,g10adm.auction-test-winners.SC-qka,g10adm.auction-test-winners.SC-9cm,g10adm.auction-test-winners.SC-fb4,g10adm.auction-test-winners.SC-y07 -->
### grade10-admin-auction-test-winners-US1-TC12-1: A close beyond 30 days back or in the future is refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Making a test winner

**Pre-conditions:**

* admin(operator with `auction:operate` and `user:create`) is signed in on staging at 2026-09-29T10:00:00Z.

**Test data:**

| Closed at |
| --- |
| 2026-08-30T09:59:00Z |
| 2026-09-29T11:00:00Z |

**Steps:**

1. Send a make request closed at the row's **Closed at**.

**Expected Results:**

* Grade10 refuses it.
* No account, lot or order is made.

<!-- trace:case id=g10adm.auction-test-winners.TC-uu2 rev=1 covers=g10adm.auction-test-winners.SC-pxq,g10adm.auction-test-winners.SC-wfn,g10adm.auction-test-winners.SC-kfc,g10adm.auction-test-winners.SC-ibc,g10adm.auction-test-winners.SC-0fh,g10adm.auction-test-winners.SC-qka,g10adm.auction-test-winners.SC-9cm,g10adm.auction-test-winners.SC-fb4,g10adm.auction-test-winners.SC-y07 -->
### grade10-admin-auction-test-winners-US1-TC13-1: The test lot takes no bid, its order cancelled or not

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
* **Trace:** Making a test winner

**Pre-conditions:**

* Two test winners' sandbox lots on staging, one whose order an operator cancelled.
* customer(collector) is signed in on staging.

**Steps:**

1. Send a bid on each lot.
2. Read each lot.

**Expected Results:**

* Grade10 refuses both bids.
* Each lot is still closed, with its winning bid unchanged.

<!-- trace:case id=g10adm.auction-test-winners.TC-69r rev=1 covers=g10adm.auction-test-winners.SC-90p,g10adm.auction-test-winners.SC-3rj -->
### grade10-admin-auction-test-winners-US1-TC14-1: The emailed link signs in as the test winner, and a new one can be sent

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
* **Trace:** Test winner sign-in

**Pre-conditions:**

* admin(operator with `auction:operate` and `user:create`) is signed in on staging.
* A test winner just made, whose sign-in email is in the operator's inbox.

**Steps:**

1. Open the sign-in link from the inbox in a private window.
2. In Winners, choose Email sign-in link on the test winner's row.
3. Open the new link from the inbox in another private window.

**Expected Results:**

* Winners says to open the link in a private window.
* The first private window is signed in as the test account and shows its order in Awaiting Setup.
* A new sign-in email reaches the inbox.
* The new link signs in as the test account and opens its order.

<!-- trace:case id=g10adm.auction-test-winners.TC-ohr rev=1 covers=g10adm.auction-test-winners.SC-qra,g10adm.auction-test-winners.SC-xvn -->
### grade10-admin-auction-test-winners-US1-TC15-1: Winners lists test winners newest first

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
* **Trace:** Test winner panel

**Pre-conditions:**

* admin(operator with `auction:operate` and `user:create`) is signed in on staging.
* A test winner made yesterday, whose order an operator cancelled.
* A test winner made today, in Awaiting Setup.

**Steps:**

1. Open Winners in the Test tab under Auction.
2. Choose Open order on today's test winner.

**Expected Results:**

* Today's test winner is listed first, then yesterday's, reading Cancelled.
* Each row shows its email, its lot, its order status and when it was made, with Open order and Email sign-in link.
* Winners offers no cancel or delete.
* Open order opens that order in Orders.

<!-- trace:case id=g10adm.auction-test-winners.TC-nom rev=1 covers=g10adm.auction-test-winners.SC-qra,g10adm.auction-test-winners.SC-xvn -->
### grade10-admin-auction-test-winners-US1-TC16-1: Without both grants Winners names the access it needs

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Test winner panel

**Pre-conditions:**

* admin(operator with `auction:operate` without `user:create`) is signed in on staging.

**Steps:**

1. Open Winners in the Test tab under Auction.

**Expected Results:**

* Winners names the access it needs.
* It shows no list and no control.

## Settled

- A test winner signs in with the ordinary sign-in link, which the console emails after making it and again on request, opened in a private window.
- Cancel on a test winner is the ordinary order cancel; the sandbox lot stays closed and never takes a bid.

## Reconciliation

**Run:** The same agent wrote the blind cases and the scenarios, so the two readings are not independent. The cases were written from the Feature set, the proposal, the decisions and the linked PRD section, then joined to the scenarios on their anchors.

- **Folded:** the decisions' raised rows each landed as scenarios - Q19 as `grade10-admin-auction-test-winners-SC-20` and `grade10-admin-auction-test-winners-SC-21`, and Q18 as `grade10-admin-auction-test-winners-SC-19` and the cancelled row of `grade10-admin-auction-test-winners-SC-22`.
- **Covered:** `-SC-11` ← `US1-TC7-1`; `-SC-12` ← `US1-TC8-1`; `-SC-14` and `-SC-15` ← `US1-TC9-1`; `-SC-16` ← `US1-TC10-1`; `-SC-17` ← `US1-TC11-1`; `-SC-18` ← `US1-TC12-1`; `-SC-19` ← `US1-TC13-1`; `-SC-20` and `-SC-21` ← `US1-TC14-1`; `-SC-22` ← `US1-TC15-1`; `-SC-23` ← `US1-TC16-1` and the staging row of `US1-TC8-1`.
- **Out of suite:** `grade10-admin-auction-test-winners-SC-13`, held by the admin console's bundle check.
