# shared/console/audit Test Cases

**Status:** pending-review · 0/5
**Drafts styled:** 2026-10-25, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7

## Background

* Audit is the console's merged audit trail page, read by auditor(holds `audit:read`) on `<console url>`, the Grade10 console of the environment under test. Every product that writes to the trail has its own chain, shown on the chain strip above the filters.
* Rows name people by user id; no row, expanded or not, shows an email address or a hash.

## Walk 1: An auditor narrows the trail and checks the chains

Starting state:

- auditor signed in on `<console url>`; the trail holds writes on more than one product for more than one subject, and every chain is consistent.

Shared test data:

| Field | Value |
| --- | --- |
| subject | a user id with writes on two products |

### Route

1. Open Audit.
   - One line about chain health, no product list. `shared.console-audit.US4-TC1`
2. Filter to one product and `<subject>`, oldest first, and reopen the same address.
   - Only that product's rows for `<subject>`, the filters and order restored. `shared.console-audit.US1-TC1`
3. Expand a row and copy its subject id.
   - The subject id and a readable action, roles and details, and no email. `shared.console-audit.US2-TC1`

## shared.console-audit.US1: Auditor isolates writes on the merged trail

**As an** auditor,
**I want** the merged trail filtered and ordered by time,
**so that** I can see one person's writes without paging past other products.

<!-- trace:case id=g10.shared-audit.TC-fh6 rev=1 covers=g10.shared-audit.SC-mum,g10.shared-audit.SC-z5c,g10.shared-audit.SC-1hn,g10.shared-audit.SC-u0a,g10.shared-audit.SC-1gn,g10.shared-audit.SC-7pf,g10.shared-audit.SC-15d,g10.shared-audit.SC-wnk,g10.shared-audit.SC-dlc -->
### shared.console-audit.US1-TC1: Filters and order combine, and the page's address brings them back

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-console-audit-US-01

**Pre-conditions:**

* auditor is on Audit; the trail holds writes on more than one product for more than one subject.

**Steps:**

1. Filter to one product and one subject's user id, and choose oldest first.
2. Open the page's address in a new tab.

**Expected Results:**

* Step 1 leaves only that product's rows for that subject, oldest first; no email filter is offered, and no row shows an email.
* Step 2 opens with the same filters and order.

<!-- trace:case id=g10.shared-audit.TC-ps9 rev=1 covers=g10.shared-audit.SC-mum,g10.shared-audit.SC-z5c,g10.shared-audit.SC-1hn,g10.shared-audit.SC-u0a,g10.shared-audit.SC-1gn,g10.shared-audit.SC-7pf,g10.shared-audit.SC-15d,g10.shared-audit.SC-wnk,g10.shared-audit.SC-dlc -->
### shared.console-audit.US1-TC2: A day's range keeps its last second, no match reads apart from an empty trail, and a silent product holds nothing up

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-console-audit-US-01

**Pre-conditions:**

* auditor is on Audit; the trail holds a write in the last second of `<day>`, and one product does not answer.

**Test data:**

| `<narrowed to>` | `<shows>` |
| --- | --- |
| a range ending on `<day>` | the write from its last second |
| filters that match no row | a no-matches message, unlike the empty-trail message |
| another product, one that answers, with more rows than a page | its rows, paging to older ones and back; the silent product holds no page up |

**Steps:**

1. Narrow the trail to `<narrowed to>`.

**Expected Results:**

* It shows `<shows>`.

---

## shared.console-audit.US2: Auditor inspects a trail row

**As an** auditor,
**I want** subject, a readable action, roles, and details on a row,
**so that** I can name who was acted on without email or hashes.

<!-- trace:case id=g10.shared-audit.TC-adt rev=1 covers=g10.shared-audit.SC-9n2,g10.shared-audit.SC-ylk,g10.shared-audit.SC-rqe,g10.shared-audit.SC-pcc,g10.shared-audit.SC-w54,g10.shared-audit.SC-l5y -->
### shared.console-audit.US2-TC1: A row names its subject and a readable action, expands, copies ids, and links to the directory only where it can

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-console-audit-US-02

**Pre-conditions:**

* `<reader>` is on Audit; the trail holds a write on a directory person and one whose actor is `system`.

**Test data:**

| `<reader>` | `<links>` |
| --- | --- |
| auditor also holding `user:list` | the actor and subject ids of the directory person open them in Users; `system` is plain text |
| auditor without `user:list` | no id is a link |

**Steps:**

1. Read the directory person's row, and expand it.
2. Copy its actor and subject ids.
3. Read the `system` row.

**Expected Results:**

* Step 1 names the subject's user id and a readable action, with the recorded action kept beside it; expanded, it shows roles and details, and no email or hash.
* Step 2 copies each id.
* Step 3 and step 1 show `<links>`.

---

## shared.console-audit.US3: Auditor jumps to a chain break

**As an** auditor,
**I want** a chain broken at a position to open that row,
**so that** I land on the break instead of paging to it.

<!-- trace:case id=g10.shared-audit.TC-v8r rev=1 covers=g10.shared-audit.SC-7ok -->
### shared.console-audit.US3-TC1: Jumping to a break opens that product's trail at the broken row

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-console-audit-US-03

**Pre-conditions:**

* auditor is on Audit; one product's chain is reported broken at a position.

**Steps:**

1. Jump to the break from the chain strip.

**Expected Results:**

* The product's trail opens with the row at that position shown.

---

## shared.console-audit.US4: Auditor sees chain health without a product list

**As an** auditor,
**I want** one line when every chain is reading, and a notice only when one is not,
**so that** the trail is not buried under seven identical rows.

<!-- trace:case id=g10.shared-audit.TC-an7 rev=1 covers=g10.shared-audit.SC-1a3 -->
### shared.console-audit.US4-TC1: The strip is one quiet line while every chain holds, and names only a chain that does not

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-console-audit-US-04

**Pre-conditions:**

* auditor opens Audit while `<chains>`.

**Test data:**

| `<chains>` | `<strip shows>` |
| --- | --- |
| every chain reads and is consistent | one line under the description and above the filters, naming no product |
| one chain is broken | a notice naming that product, and no product that answers |

**Steps:**

1. Read the chain strip.

**Expected Results:**

* It shows `<strip shows>`.
