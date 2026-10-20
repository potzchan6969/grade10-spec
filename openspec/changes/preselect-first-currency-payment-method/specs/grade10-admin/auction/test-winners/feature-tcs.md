# grade10-admin/auction/test-winners Test Cases

**Status:** pending-review · 0/1
**Drafts styled:** 2026-10-19, tcs-rules r5

## g10adm.auction-test-winners.US1: Test winners for QA

**As an** operator testing the winner's order,
**I want** a winner of a closed lot I can sign in as, made in one step,
**so that** I walk the order by hand without bidding and waiting for a close.

<!-- trace:case id=g10adm.auction-test-winners.TC-7qq rev=4 covers=grade10-admin-auction-test-winners-SC-11,grade10-admin-auction-test-winners-SC-25 -->
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
* Step 6 offers USD or HKD and their offered payment choices, with the first offered currency and its first offered payment method preselected.

## Reconciliation

| Finding | Disposition |
| --- | --- |
| `TC-7qq` step 6 asserted no currency or method selected; SC-11 now preselects the first offered currency and the first offered method | Revised to rev=4 |
