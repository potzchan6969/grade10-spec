# shared/auth/roles Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-02, tcs-rules r4
**Out of suite:** shared-auth-roles-SC-18 - the exact admin list in grade10's `packages/grade10-auth/contracts/test/roles.test.ts`; shared-auth-roles-SC-20 - a `parseRoles("finance,treasurer")` case in the same file; shared-auth-roles-SC-21 - the exact, ordered `PERMISSION_STATEMENTS` assertion in the same file; shared-auth-roles-SC-24 - no role holds `inventory:write` without `inventory:transfer`; the grant split is held by the role and vocabulary tests in grade10's `packages/grade10-auth/contracts/test/roles.test.ts` and the items service tests (tasks 2.1, 5.1), and walked by `grade10-admin-inventory-items-US3-TC9-1`

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
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** shared-auth-roles-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/item-lifecycle.spec.ts`

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
* **Automation status:** automated
* **Testability:** automation
* **Trace:** shared-auth-roles-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/item-lifecycle.spec.ts`

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

## Reconciliation

**Run:** QA2, 2026-10-02. QA1's blind pass read the Feature set, the journey, the proposal, `decisions.md` with its empty `## Raised`, the Roles and Items PRD pages, the durable roles suite and `shared/auth/domain-tcs.md` with their Reconciliation stripped; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and the code. QA2 read QA1's suite, the delta spec, `tech-design.md`, `tasks.md` and the items delta. It is a statement, not proof.

- **Folded** - `shared-auth-roles-US2-TC15-1` into `shared-auth-roles-SC-23` for staff and admin, also reaching `grade10-admin-inventory-items-SC-44`; `shared-auth-roles-US2-TC16-1` into `shared-auth-roles-SC-23` for the treasurer and `grade10-admin-inventory-items-SC-68`
- **Added by QA2** - none
- **Raised, answered by the round** - read-only grant sets no role holds (Q45); `shared-auth-roles-SC-24` is stated for that reason and is out of suite
- **Rejected** - none
- **Contradicted** - none
- **Uncovered anchors** - none: US-02 has two new cases beside the durable fourteen; the modified requirements' other scenarios keep their durable cases
