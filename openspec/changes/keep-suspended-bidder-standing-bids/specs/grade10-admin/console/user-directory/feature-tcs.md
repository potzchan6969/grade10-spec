# grade10-admin/console/user-directory Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-14, tcs-rules r3.0

## grade10-admin-console-user-directory-US3: Operator suspends an account from auctions

**As an** operator holding `auction:moderate`,
**I want** to suspend an account from auctions from its panel on Users, and
reinstate it later,
**so that** I can stop a bidder I have reason to stop without banning them
from the whole platform.

### grade10-admin-console-user-directory-US3-TC1-1: Suspend an account from its panel with a reason

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-console-user-directory-US-03

**Pre-conditions:**
Signed in as admin(holds `user:list` and `auction:moderate`). <active account> is not suspended and not banned.

**Test data:**

| Field | Value |
| --- | --- |
| <operator reason> | Suspected shill bidding |

**Steps:**

1. Navigate to <grade10 admin users url>.
2. Open <active account>.
3. Choose suspend from auctions.
4. Enter <operator reason> and confirm.

**Expected Results:**

* Panel shows suspended from auctions, with <operator reason>, who, and when.
* Panel offers reinstate, not suspend.
* Account still shows as not banned.

### grade10-admin-console-user-directory-US3-TC2-1: Suspension cannot be confirmed without a reason

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-console-user-directory-US-03

**Pre-conditions:**
Signed in as admin(holds `user:list` and `auction:moderate`). <active account> is not suspended.

**Steps:**

1. Navigate to <grade10 admin users url>.
2. Open <active account>.
3. Choose suspend from auctions.
4. Try to confirm with the reason left empty.

**Expected Results:**

* The suspension cannot be confirmed.
* Panel still shows <active account> as not suspended.

### grade10-admin-console-user-directory-US3-TC3-1: Reinstate an account suspended for a missed deadline

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
* **Trace:** grade10-admin-console-user-directory-US-03

**Pre-conditions:**
Signed in as admin(holds `user:list` and `auction:moderate`). <deadline-suspended account> is suspended for a missed payment deadline.

**Steps:**

1. Navigate to <grade10 admin users url>.
2. Open <deadline-suspended account>.
3. Choose reinstate and confirm.

**Expected Results:**

* Panel shows not suspended from auctions.
* Panel offers suspend, not reinstate.

### grade10-admin-console-user-directory-US3-TC4-1: Operator without auction:moderate sees neither move

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-console-user-directory-US-03

**Pre-conditions:**
Signed in as admin(holds `user:list`, not `auction:moderate`). <deadline-suspended account> is suspended; <active account> is not.

**Steps:**

1. Navigate to <grade10 admin users url>.
2. Open <deadline-suspended account>.
3. Open <active account>.

**Expected Results:**

* Neither panel offers suspend or reinstate.

## Settled

## Reconciliation

| Finding | Disposition |
| --- | --- |
| Suspension without a reason leaves no usable operator record | **Raised, folded into spec:** `grade10-admin-console-user-directory-SC-17` |
| Platform bans could be mistaken for auction standing | **Raised, folded into spec:** `grade10-admin-console-user-directory-SC-16` |
| A client-only grant gate could be bypassed | **Raised, folded into spec:** `grade10-admin-console-user-directory-SC-19` |
| Run | Read the Users-panel feature set, journey, decisions, and User Directory PRD; denied requirement deltas and archived changes |
