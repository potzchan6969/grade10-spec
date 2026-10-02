# grade10-admin/console/collector-page Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-02, tcs-rules r4

## grade10-admin-console-collector-page-US3: Operator reads a collector's items on their page

**As a** member of shop staff with a collector at the counter,
**I want** their page to list every item they own but a retired one, marked
or not,
**so that** I can see everything they have with us in one place.

### grade10-admin-console-collector-page-US3-TC1-1: The collector page lists every live item the collector owns

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-collector-page-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/items-case.spec.ts`

**Pre-conditions:**

* admin(staff) is signed in to the Grade10 console.
* `<collector_A>` owns `<item_1>`, marked by the vault, `<item_2>`, not marked, and `<item_3>`, retired.
* `<item_20>` moved from `<collector_A>` to `<collector_B>`.

**Steps:**

1. Navigate to `admin.grade10.com/vault/collectors/<collector_A user id>`.
2. Read the Items section.
3. Click the row of `<item_1>`.

**Expected Results:**

* The section lists `<item_1>` as marked and `<item_2>` as not marked.
* Each row reads title, category, grader and cert, with no owner column.
* `<item_3>` and `<item_20>` are not listed.
* Step 3 opens the page of `<item_1>`.

### grade10-admin-console-collector-page-US3-TC2-1: A collector who owns no item reads none

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-collector-page-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/items-case.spec.ts`

**Pre-conditions:**

* admin(staff) is signed in to the Grade10 console.
* `<collector_E>` holds a vault case and owns no item.

**Steps:**

1. Navigate to `admin.grade10.com/vault/collectors/<collector_E user id>`.

**Expected Results:**

* The Items section says the collector owns no item.
* The vault cases section lists `<collector_E>`'s case.

### grade10-admin-console-collector-page-US3-TC3-1: A treasurer reads the collector page without its items

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-collector-page-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/items-case.spec.ts`

**Pre-conditions:**

* admin(treasurer only) is signed in to the Grade10 console.
* `<collector_A>` owns `<item_1>` and holds a vault case.

**Steps:**

1. Navigate to `admin.grade10.com/vault/collectors/<collector_A user id>`.

**Expected Results:**

* The Items section is refused, naming `inventory:read`, and lists no item.
* The header and the vault cases section still load.

### grade10-admin-console-collector-page-US3-TC4-1: The items section fails alone

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-console-collector-page-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/items-case.spec.ts`

**Pre-conditions:**

* admin(staff) is signed in to the Grade10 console.
* The read of `<collector_A>`'s items is mocked to fail once, then answer.

**Steps:**

1. Navigate to `admin.grade10.com/vault/collectors/<collector_A user id>`.
2. Click retry in the Items section.

**Expected Results:**

* Step 1 shows the Items section's own error with a retry.
* The header and the vault cases section still load.
* Step 2 lists `<collector_A>`'s live items.

## Reconciliation

**Run:** QA2, 2026-10-02. The Items section moved here from `grade10-admin/inventory/items` once `vault-walk-ins-and-owners` published this capability; its journey, requirement and cases moved with it, unchanged but for their ids. It is a statement, not proof.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `grade10-admin-console-collector-page-US3-TC1-1` | Joined | `grade10-admin-console-collector-page-SC-23` |
| `grade10-admin-console-collector-page-US3-TC2-1` | Joined | `grade10-admin-console-collector-page-SC-24` |
| `grade10-admin-console-collector-page-US3-TC3-1` | Joined | `grade10-admin-console-collector-page-SC-25`, the treasurer's refusal |
| `grade10-admin-console-collector-page-US3-TC4-1` | Joined | `grade10-admin-console-collector-page-SC-25`, the section's own failure |
