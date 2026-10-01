# grade10-site/vault/retention-and-erasure Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-01, tcs-rules r4

## grade10-site-vault-retention-and-erasure-US2: Admin runs an erasure without touching a live case

**As an** admin running a person's erasure,
**I want** to be told which of their cases are still in flight rather than
having them erased,
**so that** nobody's item or debt disappears from the record while it still
exists.

### grade10-site-vault-retention-and-erasure-US2-TC4-1: A removed walk-in keeps no trace of the collector

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-retention-and-erasure-US-02

**Pre-conditions:**

* `<case_1>` is a draft staff opened for `<walk-in email>`; the customer signed in and changed its title, and staff attached two photographs.
* admin(staff, holds vault:operate) is signed in to the console.

**Steps:**

1. Cancel `<case_1>` from the console.
2. Read `<case_1>`'s history and photograph-read trail.
3. Erase `<walk-in email>`'s account.

**Expected Results:**

* Step 2 shows every entry still present: the collector's own entries name no collector, and staff's entries name staff.
* Neither photograph nor the item's words remain.
* Step 3 finds nothing of `<case_1>` left to rewrite.

## Reconciliation

**Run:** written at the acceptance review of 2026-10-01, which found that the walk-in's removal reuses the unsigned-case purge (Q23) and that the actor rewrite reaches a case through its owner, which the removal clears. No blind pass ran for this capability.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `grade10-site-vault-retention-and-erasure-SC-44` | Case added | `grade10-site-vault-retention-and-erasure-US2-TC4-1` |
