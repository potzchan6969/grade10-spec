# grade10-site/vault/case-lifecycle Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-02, tcs-rules r4

## grade10-site-vault-case-lifecycle-US3: Operator moves a case through the counter without stepping over a guard

**As a** member of shop staff,
**I want** each move to run only where it belongs and to be refused when the
case has moved under me,
**so that** two of us working the same counter cannot leave one case in a
state neither of us meant.

### grade10-site-vault-case-lifecycle-US3-TC1-1: Starting the valuation registers the item under the collector

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
* **Trace:** grade10-site-vault-case-lifecycle-US-03

**Pre-conditions:**

* admin(staff) is on <grade10 admin vault case page url> for `<case_1>`.
* `<case_1>` is submitted by `<collector A>`, a request for a comic titled `<request title>`, naming no slab; no item is linked to it.

**Steps:**

1. Click Start valuation on the Case tab.
2. Read the item's facts on the Case tab.
3. Click the link to the item.

**Expected Results:**

* `<case_1>` reads under valuation.
* The Case tab reads the registered item's category comic and title `<request title>`, linking it.
* Step 3 opens an item owned by `<collector A>`, not marked.

### grade10-site-vault-case-lifecycle-US3-TC2-1: Confirm vaulted marks the item for the vault

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
* **Trace:** grade10-site-vault-case-lifecycle-US-03

**Pre-conditions:**

* admin(staff) is on the Custody tab of <grade10 admin vault case page url> for `<case_2>`.
* `<case_2>`'s packet is signed; its item `<item_2>` is owned by `<collector A>` and not marked.

**Steps:**

1. Confirm `<case_2>` vaulted with a shop.
2. Navigate to <grade10 admin item page url> for `<item_2>`.
3. Navigate to the marked tab of <grade10 admin items url>.

**Expected Results:**

* `<case_2>` reads vaulted.
* Step 2's place row names the vault, `<case_2>`'s reference and its status; Transfer and Retire are not offered.
* Step 3 lists `<item_2>`.

### grade10-site-vault-case-lifecycle-US3-TC3-1: Release and unwind close the mark and keep the owner

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
* **Trace:** grade10-site-vault-case-lifecycle-US-03

**Pre-conditions:**

* admin(staff) is on the Custody tab of <grade10 admin vault case page url> for `<case_3>`.
* `<case_3>` is as the row of **Test data** says; its item `<item_3>` is owned by `<collector A>` and marked by the vault on `<case_3>`.

**Test data:**

| `<case_3>` | Act |
| --- | --- |
| Vaulted on the storage lane, release packet signed | Release |
| Vaulted on the financed lane, no payout recorded | Unwind with a reason |

**Steps:**

1. Take the act from **Test data**.
2. Navigate to <grade10 admin item page url> for `<item_3>`.

**Expected Results:**

* `<case_3>` reads released or cancelled as the act gives.
* `<item_3>` reads not marked, still owned by `<collector A>`, with no new move.
* Transfer and Retire are offered.

### grade10-site-vault-case-lifecycle-US3-TC4-1: Forfeit closes the mark and moves the item to the lender

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
* **Trace:** grade10-site-vault-case-lifecycle-US-03

**Pre-conditions:**

* admin(staff) is on the Custody tab of <grade10 admin vault case page url> for `<case_4>`.
* `<case_4>` is active, past its due date and past the cure date of a sent forfeiture notice; its item `<item_4>` is owned by `<collector A>` and marked by the vault on `<case_4>`.

**Steps:**

1. Forfeit `<case_4>` with a reason.
2. Navigate to <grade10 admin item page url> for `<item_4>`.
3. Navigate to <grade10 admin collector page url> for `<collector A>`.

**Expected Results:**

* `<case_4>` reads forfeited.
* `<item_4>` reads not marked and owned by the lender's registered name.
* Step 3's Items section no longer lists `<item_4>`.

### grade10-site-vault-case-lifecycle-US3-TC5-1: An item that never reached custody stays registered and unmarked

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
* **Trace:** grade10-site-vault-case-lifecycle-US-03

**Pre-conditions:**

* admin(staff) is on <grade10 admin vault case page url> for `<case_5>`.
* `<case_5>` is under valuation by `<collector A>`; its item `<item_5>` is registered and not marked.

**Test data:**

| Act |
| --- |
| Decline with a reason |
| Cancel |

**Steps:**

1. Take the act from **Test data** on `<case_5>`.
2. Navigate to <grade10 admin item page url> for `<item_5>`.

**Expected Results:**

* `<case_5>` reads declined or cancelled as the act gives.
* `<item_5>` is still owned by `<collector A>` and reads not marked.

### grade10-site-vault-case-lifecycle-US3-TC6-1: Prepare documents is not offered while the register names another owner

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
* **Trace:** grade10-site-vault-case-lifecycle-US-03

**Pre-conditions:**

* admin(staff) holds `inventory:transfer` and is signed in to the Grade10 console.
* `<case_6>` of `<collector A>` is accepted, its identity check recorded; its item `<item_6>` is owned by `<collector B>` and not marked.

**Steps:**

1. Navigate to the Documents tab of <grade10 admin vault case page url> for `<case_6>`.
2. Click the item link on the line that names the owner.
3. Transfer `<item_6>` to `<collector A>`'s exact email with a reason.
4. Return to the Documents tab of `<case_6>` and reload it.

**Expected Results:**

* Step 1 does not offer Prepare documents; a line names `<collector B>` and links `<item_6>`.
* Step 2 opens `<item_6>`.
* Step 4 offers Prepare documents.

### grade10-site-vault-case-lifecycle-US3-TC7-1: An owner moved under an open Documents tab refuses Prepare documents

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
* **Trace:** grade10-site-vault-case-lifecycle-US-03

**Pre-conditions:**

* admin(staff) holds `inventory:transfer` and is on the Documents tab of <grade10 admin vault case page url> for `<case_7>`.
* `<case_7>` of `<collector A>` is accepted, its identity check recorded and its key terms recorded where its lane needs them; its item `<item_7>` is owned by `<collector A>` and not marked.

**Steps:**

1. In a second tab, transfer `<item_7>` to `<collector B>`'s exact email with a reason.
2. On the first tab, click Prepare documents.

**Expected Results:**

* Step 2 is refused with an error naming `<collector B>` and linking `<item_7>`.
* `<case_7>` stays accepted and no packet is prepared.
