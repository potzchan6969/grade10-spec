# grade10-admin/auction/test-winners Test Cases

**Status:** pending-review · 0/12
**Drafts styled:** 2026-09-29, tcs-rules r4

**Out of suite:** grade10-admin-auction-test-winners-SC-13 — held by the admin console's bundle check, which fails a production build that carries the Test tab's code

## g10adm.auction-test-winners.US1: Test winners for QA

**As an** operator testing the winner's order,
**I want** a winner of a closed lot I can sign in as, made in one step,
**so that** I walk the order by hand without bidding and waiting for a close.

<!-- trace:case id=g10adm.auction-test-winners.TC-7qq rev=3 covers=grade10-admin-auction-test-winners-SC-11,grade10-admin-auction-test-winners-SC-25 -->
### g10adm.auction-test-winners.US1-TC7: One action makes a winner waiting on setup

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
2. Make a test winner with the default email, the name "QA Winner" and a winning bid of US$1,000.00.
3. Choose Open order on the new row.
4. Open the operator's inbox.
5. Open the sign-in link in a private window.
6. Read the settlement and payment choices on the order setup.

**Expected Results:**

* Winners lists the new test winner at `qa.lead+qa-<code>@grade10.com`, reading Awaiting Setup.
* The order is for the closed lot `Test lot <code>`, won at US$1,000.00.
* The test-winner form fixes the bid currency to USD and offers no HKD or JPY choice.
* Before step 5, the account at that address has not signed in.
* The inbox holds the auction-won letter for that lot, sent to that address.
* Step 5 signs in as the test account and leaves the order in Awaiting Setup.
* Step 6 offers USD or HKD and their offered payment choices, with no currency or method selected.

<!-- trace:case id=g10adm.auction-test-winners.TC-abd rev=1 -->
### g10adm.auction-test-winners.US1-TC8: Production, or a missing grant, makes nothing

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

<!-- trace:case id=g10adm.auction-test-winners.TC-p4o rev=1 -->
### g10adm.auction-test-winners.US1-TC9: An address not the operator's tagged one, or holding a signed-in account, is refused

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

<!-- trace:case id=g10adm.auction-test-winners.TC-3qi rev=1 -->
### g10adm.auction-test-winners.US1-TC10: The same address makes one test winner

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

<!-- trace:case id=g10adm.auction-test-winners.TC-47e rev=1 -->
### g10adm.auction-test-winners.US1-TC11: A past close up to 30 days back, at the limit included, opens an overdue order

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

<!-- trace:case id=g10adm.auction-test-winners.TC-b5b rev=1 -->
### g10adm.auction-test-winners.US1-TC12: A close beyond 30 days back or in the future is refused

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

<!-- trace:case id=g10adm.auction-test-winners.TC-uu2 rev=1 -->
### g10adm.auction-test-winners.US1-TC13: The test lot takes no bid, its order cancelled or not

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

<!-- trace:case id=g10adm.auction-test-winners.TC-69r rev=1 -->
### g10adm.auction-test-winners.US1-TC14: The emailed link signs in as the test winner, and a new one can be sent

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
* **Trace:** Making a test winner

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/test-winners.spec.ts`

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

<!-- trace:case id=g10adm.auction-test-winners.TC-ohr rev=1 -->
### g10adm.auction-test-winners.US1-TC15: Winners lists test winners newest first

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
* **Trace:** Making a test winner

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/test-winners.spec.ts`

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

<!-- trace:case id=g10adm.auction-test-winners.TC-nom rev=1 -->
### g10adm.auction-test-winners.US1-TC16: Without both grants Winners names the access it needs

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Making a test winner

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/test-winners.spec.ts`

**Pre-conditions:**

* admin(operator with `auction:operate` without `user:create`) is signed in on staging.

**Steps:**

1. Open Winners in the Test tab under Auction.

**Expected Results:**

* Winners names the access it needs.
* It shows no list and no control.

<!-- trace:case id=g10adm.auction-test-winners.TC-setup rev=1 -->
### g10adm.auction-test-winners.US1-TC17: A test winner chooses settlement currency and rail with no default

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Making a test winner

**Pre-conditions:**

* admin(operator with `auction:operate` and `user:create`) is signed in on staging.
* A test winner's link is in the operator's inbox.

**Test data:**

| Settlement currency | Chosen rail |
| --- | --- |
| USD | International via SWIFT |
| HKD | FPS |

**Steps:**

1. Open the test winner's sign-in link in a private window.
2. Open the new order's setup.
3. Read the settlement and payment choices before making a selection.
4. Choose the row's settlement currency and bank transfer rail, then confirm setup.
5. Read the order.

**Expected Results:**

* Step 3 has no settlement currency, payment method or rail selected by default.
* Step 3 offers USD and HKD; its available rails follow the chosen settlement currency.
* Step 4 is accepted.
* Step 5 reads the row's settlement currency and rail and Preparing Invoice.

<!-- trace:case id=g10adm.auction-test-winners.TC-currency rev=1 -->
### g10adm.auction-test-winners.US1-TC18: A non-USD bid currency refuses the test winner atomically

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
* **Trace:** Making a test winner

**Pre-conditions:**

* admin(operator with `auction:operate` and `user:create`) is signed in on staging.
* `<email>` is a unique tagged email address controlled by QA.
* No account, lot or order exists for `<email>`.

**Test data:**

| `<email>` | `qa+<row>@example.test`, a unique tagged address for this row in the controlled test domain |
| Bid currency | Why this row |
| --- | --- |
| HKD | A retired bid currency |
| JPY | A retired bid currency |
| EUR | Any other unsupported bid currency |

**Steps:**

1. Send a make test winner request at the row's tagged email, with bid currency from the row.
2. Read the response and search for an account, lot or order at that email.

**Expected Results:**

* Step 1 is refused.
* Step 2 finds no account, lot or order.

## Settled

- A test winner signs in with the ordinary sign-in link, which the console emails after making it and again on request, opened in a private window.
- Cancel on a test winner is the ordinary order cancel; the sandbox lot stays closed and never takes a bid.



## Reconciliation

**Run:** Independent QA2, 2026-10-14. Reconciled the blind cases with current delta scenarios against the single feature root. Read the current PRD, decisions including Q29, journeys, delta requirements, technical design and durable baseline.

- **Retained:** All 12 active case IDs, revisions and routes remain draft. The normal winner setup case remains separate from test-winner creation; it checks that settlement and method are selected through ordinary setup.
- **Covered:** `SC-24` is fully asserted by `US1-TC18`; it refuses HKD, JPY and other non-USD bid currencies atomically.
- **Covered:** `SC-11` and `SC-25` are fully asserted by revised `US1-TC7` (same marker, revision 3). Its route continues from test-winner creation through the emailed link into order setup, and checks the USD-only bid form plus default-free settlement and method choices.
- **Out of suite:** `SC-13` remains held by the production-console bundle check.
- **Anchors:** The single root journey retains active cases. No unresolved product question remains.
