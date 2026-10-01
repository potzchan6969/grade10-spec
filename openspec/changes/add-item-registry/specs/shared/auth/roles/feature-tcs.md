# shared/auth/roles Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-02, tcs-rules r4

## shared-auth-roles-US2: Operator's grants follow the closed vocabulary

**As an** operator,
**I want** each action allowed only when my role grants that permission,
**so that** support cannot set roles, staff cannot ban, and an unknown permission grants nothing.

### shared-auth-roles-US2-TC15-1: Staff and admin move an item and open its proof

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
* **Trace:** shared-auth-roles-US-02

**Pre-conditions:**

* admin(only operator role is the row's) is signed in to the Grade10 console.
* `<item_1>` is owned by `<collector A>`, no place marks it, and its top move carries one proof.

**Test data:**

| Operator role |
| --- |
| `staff` |
| `admin` |

**Steps:**

1. Navigate to <grade10 admin item page url> for `<item_1>`.
2. Click the proof on the top move.
3. Transfer `<item_1>` to the custodian with a reason.

**Expected Results:**

* The proof downloads.
* `<item_1>` reads the custodian as owner, with the move at the top.

### shared-auth-roles-US2-TC16-1: Treasurer holds no inventory grant

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
* **Trace:** shared-auth-roles-US-02

**Pre-conditions:**

* admin(only operator role is `treasurer`) is signed in to the Grade10 console.
* `<item_1>` is owned by `<collector A>`, no place marks it, and its top move carries one proof.

**Steps:**

1. Read `<item_1>` from the register.
2. Edit `<item_1>`'s title.
3. Transfer `<item_1>` to the custodian with a reason.
4. Request the proof of `<item_1>`'s top move.

**Expected Results:**

* Each step is refused.
* `<item_1>` keeps its title, its owner and its moves.
