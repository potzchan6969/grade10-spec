# shared/console/audit Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-05, tcs-rules r4

## shared-console-audit-US1: Auditor isolates writes on the merged trail

**As an** auditor,
**I want** the merged trail filtered and ordered by time,
**so that** I can see one person's writes without paging past other products.

<!-- trace:case id=g10.shared-audit.TC-fh6 rev=1 covers=g10.shared-audit.SC-mum,g10.shared-audit.SC-z5c,g10.shared-audit.SC-1hn,g10.shared-audit.SC-u0a,g10.shared-audit.SC-1gn,g10.shared-audit.SC-7pf,g10.shared-audit.SC-15d,g10.shared-audit.SC-wnk,g10.shared-audit.SC-dlc -->
### shared-console-audit-US1-TC1-1: Filters combine and restore from the location

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
* **Trace:** shared-console-audit-US-01

**Pre-conditions:**
Writes on more than one product for more than one subject. Operator holds `audit:read`.

**Steps:**

1. Open Audit and filter to one product and one subject user id.
2. Choose oldest-first.
3. Open that same location again.

**Expected Results:**

* Only rows for that product and subject remain.
* The same filters and sort are restored.
* No email filter is offered; no row returns an email.

<!-- trace:case id=g10.shared-audit.TC-ps9 rev=1 covers=g10.shared-audit.SC-mum,g10.shared-audit.SC-z5c,g10.shared-audit.SC-1hn,g10.shared-audit.SC-u0a,g10.shared-audit.SC-1gn,g10.shared-audit.SC-7pf,g10.shared-audit.SC-15d,g10.shared-audit.SC-wnk,g10.shared-audit.SC-dlc -->
### shared-console-audit-US1-TC2-1: Date range, no-matches, and product silence

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-console-audit-US-01

**Pre-conditions:**
A trail that has writes, including one in the final second of a calendar day. One product does not answer.

**Steps:**

1. Set a date range whose end day is that day.
2. Apply filters that match no rows.
3. Filter to a different product that does answer.

**Expected Results:**

* The end-of-day write remains in the range.
* No-matches is distinct from an empty trail.
* Paging works on the selected product; the silent product does not hold it.

## shared-console-audit-US2: Auditor inspects a trail row

**As an** auditor,
**I want** subject, a readable action, roles, and details on a row,
**so that** I can name who was acted on without email or hashes.

<!-- trace:case id=g10.shared-audit.TC-adt rev=1 covers=g10.shared-audit.SC-9n2,g10.shared-audit.SC-ylk,g10.shared-audit.SC-rqe,g10.shared-audit.SC-pcc,g10.shared-audit.SC-w54,g10.shared-audit.SC-l5y -->
### shared-console-audit-US2-TC1-1: Subject, readable action, expand, copy, and directory links

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
* **Trace:** shared-console-audit-US-02

**Pre-conditions:**
A recorded write whose subject is a user id. Operator may or may not hold `user:list`.

**Steps:**

1. Open Audit and expand that row.
2. Copy actor and subject ids.
3. Repeat as an operator without `user:list`, and with a `system` actor row.

**Expected Results:**

* The row names the subject user id and a readable action; the recorded action identity remains.
* Expand shows roles and details without email or hashes.
* Ids copy; directory links appear only for a directory person when the operator can open Users; `system` stays plain text.

## shared-console-audit-US3: Auditor jumps to a chain break

**As an** auditor,
**I want** a chain broken at a position to open that row,
**so that** I land on the break instead of paging to it.

<!-- trace:case id=g10.shared-audit.TC-v8r rev=1 covers=g10.shared-audit.SC-7ok -->
### shared-console-audit-US3-TC1-1: Jump opens the broken position

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-console-audit-US-03

**Pre-conditions:**
A product chain reported broken at a position.

**Steps:**

1. Jump to that break from the chain strip.

**Expected Results:**

* The auditor is on that product's trail with the row at that position shown.

## shared-console-audit-US4: Auditor sees chain health without a product list

**As an** auditor,
**I want** one line when every chain is reading, and a notice only when one is not,
**so that** the trail is not buried under seven identical rows.

<!-- trace:case id=g10.shared-audit.TC-an7 rev=1 covers=g10.shared-audit.SC-1a3 -->
### shared-console-audit-US4-TC1-1: Quiet strip vs issue notice

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-console-audit-US-04

**Pre-conditions:**
Every requested chain is reading and internally consistent; then one becomes broken.

**Steps:**

1. Open Audit with every chain consistent.
2. Open Audit with one chain broken.

**Expected Results:**

* Consistent: one line under the description and above the filters; products are not listed.
* Broken: that product is named in a notice; answering products stay off the strip.

## Reconciliation

**Run:** 2026-10-05 · blind cases reconciled against the console scenario pass after AuditTrailSection shipped in grade10#219 and directory-link narrowing in #307.

| Spec scenario or anchor | Suite coverage |
| --- | --- |
| shared-console-audit-SC-01, SC-03, SC-04, SC-05, SC-06, SC-07 | US1-TC1-1 |
| shared-console-audit-SC-02, SC-08, SC-09 | US1-TC2-1 |
| shared-console-audit-SC-10, SC-11, SC-12, SC-13, SC-14, SC-15 | US2-TC1-1 |
| shared-console-audit-SC-16 | US3-TC1-1 |
| shared-console-audit-SC-17 | US4-TC1-1 |
| Uncovered anchors | none |
| Contradicted readings | SC-14 narrowed to directory people and `subjectType: user` to match #307 |

### Manual

None — AuditTrailSection, ChainStrip, and audit list tests hold the automated coverage.
