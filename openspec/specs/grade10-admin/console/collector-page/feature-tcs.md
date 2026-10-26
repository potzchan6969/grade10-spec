# grade10-admin/console/collector-page Test Cases

**Status:** pending-review · 10/16
**Drafts styled:** 2026-10-25, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7

## Background

* A collector's page is `<collector page>`, `admin.grade10.com/vault/collectors/<user id>`, under the Vault entry of the admin console: a header naming the collector, a vault cases section, and an Items section.
* Staff is admin(holds `vault:read` and `kyc:read`); a treasurer is admin(holds `vault:read` and `vault:payout`). Collector A is Chan Tai Man at tai.man@example.com.

## g10adm.console-collector-page.US1: Operator opens a collector's page from their name

**As a** member of shop staff,
**I want** a collector's name to open one page holding who they are and
every vault case they hold,
**so that** I can answer a customer about all of their cases from one place.

<!-- trace:case id=g10adm.console-collector-page.TC-mgb rev=1 covers=g10adm.console-collector-page.SC-80w,g10adm.console-collector-page.SC-hy5,g10adm.console-collector-page.SC-zvu,g10adm.console-collector-page.SC-liq,g10adm.console-collector-page.SC-q24,g10adm.console-collector-page.SC-2do,g10adm.console-collector-page.SC-ls5,g10adm.console-collector-page.SC-ybv,g10adm.console-collector-page.SC-m8a,g10adm.console-collector-page.SC-0o4,g10adm.console-collector-page.SC-bfq,g10adm.console-collector-page.SC-frx,g10adm.console-collector-page.SC-k7t,g10adm.console-collector-page.SC-9ct,g10adm.console-collector-page.SC-ogo -->
### g10adm.console-collector-page.US1-TC1: A collector's name opens their page with who they are and every vault case

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-collector-page-US-01

**Pre-conditions:**

* Staff is on the vault queue; collector A holds three cases, submitted, vaulted and cancelled, each touched on a different day.

**Steps:**

1. In Needs staff, click the link beside Chan Tai Man.
2. Read the address, the nav, the header and the vault cases.
3. Click the first case row.

**Expected Results:**

* Step 1 opens `<collector page>` for collector A, the Vault entry marked.
* The header reads Chan Tai Man and tai.man@example.com; the section lists all three, each with its reference, item, status, lane and last touched, newest-touched first.
* Step 3 opens that case's page.

<!-- trace:case id=g10adm.console-collector-page.TC-r6v rev=1 covers=g10adm.console-collector-page.SC-80w,g10adm.console-collector-page.SC-hy5,g10adm.console-collector-page.SC-zvu,g10adm.console-collector-page.SC-liq,g10adm.console-collector-page.SC-q24,g10adm.console-collector-page.SC-2do,g10adm.console-collector-page.SC-ls5,g10adm.console-collector-page.SC-ybv,g10adm.console-collector-page.SC-m8a,g10adm.console-collector-page.SC-0o4,g10adm.console-collector-page.SC-bfq,g10adm.console-collector-page.SC-frx,g10adm.console-collector-page.SC-k7t,g10adm.console-collector-page.SC-9ct,g10adm.console-collector-page.SC-ogo -->
### g10adm.console-collector-page.US1-TC2: Every route to a collector's page lands on the same page

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-collector-page-US-01

**Pre-conditions:**

* Staff is on the vault queue; collector A holds a vaulted case, its phone +852 9123 4567.

**Test data:**

| `<route>` |
| --- |
| the link beside the name on the case's Held items row |
| The collector's cases in the case's header |
| The collector's cases on the case an exact search for tai.man@example.com finds |
| The collector's cases on the case an exact search for +852 9123 4567 finds |
| The collector's cases on the case a search for its reference finds |

**Steps:**

1. Follow `<route>`.

**Expected Results:**

* Collector A's page opens at `<collector page>`.

<!-- trace:case id=g10adm.console-collector-page.TC-gdf rev=1 covers=g10adm.console-collector-page.SC-80w,g10adm.console-collector-page.SC-hy5,g10adm.console-collector-page.SC-zvu,g10adm.console-collector-page.SC-liq,g10adm.console-collector-page.SC-q24,g10adm.console-collector-page.SC-2do,g10adm.console-collector-page.SC-ls5,g10adm.console-collector-page.SC-ybv,g10adm.console-collector-page.SC-m8a,g10adm.console-collector-page.SC-0o4,g10adm.console-collector-page.SC-bfq,g10adm.console-collector-page.SC-frx,g10adm.console-collector-page.SC-k7t,g10adm.console-collector-page.SC-9ct,g10adm.console-collector-page.SC-ogo -->
### g10adm.console-collector-page.US1-TC3: Each opening of a collector's page is recorded, without the name

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-collector-page-US-01

**Pre-conditions:**

* Collector A holds a vault case.

**Steps:**

1. As staff, open collector A's page, and reload it.
2. As an auditor, read the audit trail since, naming collector A's id.

**Expected Results:**

* Each opening left a header-read and a cases-read entry naming the staff member, the time and the collector's id; no entry holds the name or email.

<!-- trace:case id=g10adm.console-collector-page.TC-94p rev=1 covers=g10adm.console-collector-page.SC-80w,g10adm.console-collector-page.SC-hy5,g10adm.console-collector-page.SC-zvu,g10adm.console-collector-page.SC-liq,g10adm.console-collector-page.SC-q24,g10adm.console-collector-page.SC-2do,g10adm.console-collector-page.SC-ls5,g10adm.console-collector-page.SC-ybv,g10adm.console-collector-page.SC-m8a,g10adm.console-collector-page.SC-0o4,g10adm.console-collector-page.SC-bfq,g10adm.console-collector-page.SC-frx,g10adm.console-collector-page.SC-k7t,g10adm.console-collector-page.SC-9ct,g10adm.console-collector-page.SC-ogo -->
### g10adm.console-collector-page.US1-TC4: The vault cases section pages and says whether there is more

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-collector-page-US-01

**Pre-conditions:**

* Collector D holds 51 vault cases.

**Steps:**

1. Read the vault cases section, and load the next page.

**Expected Results:**

* It lists 50, newest-touched first, saying there is more; the next adds the oldest-touched one, saying there is no more, none listed twice.

<!-- trace:case id=g10adm.console-collector-page.TC-mkt rev=1 covers=g10adm.console-collector-page.SC-80w,g10adm.console-collector-page.SC-hy5,g10adm.console-collector-page.SC-zvu,g10adm.console-collector-page.SC-liq,g10adm.console-collector-page.SC-q24,g10adm.console-collector-page.SC-2do,g10adm.console-collector-page.SC-ls5,g10adm.console-collector-page.SC-ybv,g10adm.console-collector-page.SC-m8a,g10adm.console-collector-page.SC-0o4,g10adm.console-collector-page.SC-bfq,g10adm.console-collector-page.SC-frx,g10adm.console-collector-page.SC-k7t,g10adm.console-collector-page.SC-9ct,g10adm.console-collector-page.SC-ogo -->
### g10adm.console-collector-page.US1-TC5: An account that never held a vault case reads as holding none, and is not named

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-collector-page-US-01

**Pre-conditions:**

* Lee Siu Ming at siu.ming@example.com has never held a vault case.

**Steps:**

1. As staff, open `<collector page>` for that account.

**Expected Results:**

* The header shows its short id and says it holds no vault case, and the section says the same.
* Neither the name nor the email is shown, nor returned by the header's read.

<!-- trace:case id=g10adm.console-collector-page.TC-3t7 rev=1 covers=g10adm.console-collector-page.SC-80w,g10adm.console-collector-page.SC-hy5,g10adm.console-collector-page.SC-zvu,g10adm.console-collector-page.SC-liq,g10adm.console-collector-page.SC-q24,g10adm.console-collector-page.SC-2do,g10adm.console-collector-page.SC-ls5,g10adm.console-collector-page.SC-ybv,g10adm.console-collector-page.SC-m8a,g10adm.console-collector-page.SC-0o4,g10adm.console-collector-page.SC-bfq,g10adm.console-collector-page.SC-frx,g10adm.console-collector-page.SC-k7t,g10adm.console-collector-page.SC-9ct,g10adm.console-collector-page.SC-ogo -->
### g10adm.console-collector-page.US1-TC6: A name the account service cannot answer reads as unavailable, and the cases still load

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-collector-page-US-01

**Pre-conditions:**

* Collector A holds two cases; the account service fails to answer names.

**Steps:**

1. Open collector A's page.

**Expected Results:**

* The header reads the short id and "name unavailable", with no email; both cases are listed.

<!-- trace:case id=g10adm.console-collector-page.TC-gqm rev=1 covers=g10adm.console-collector-page.SC-80w,g10adm.console-collector-page.SC-hy5,g10adm.console-collector-page.SC-zvu,g10adm.console-collector-page.SC-liq,g10adm.console-collector-page.SC-q24,g10adm.console-collector-page.SC-2do,g10adm.console-collector-page.SC-ls5,g10adm.console-collector-page.SC-ybv,g10adm.console-collector-page.SC-m8a,g10adm.console-collector-page.SC-0o4,g10adm.console-collector-page.SC-bfq,g10adm.console-collector-page.SC-frx,g10adm.console-collector-page.SC-k7t,g10adm.console-collector-page.SC-9ct,g10adm.console-collector-page.SC-ogo -->
### g10adm.console-collector-page.US1-TC7: A section that fails shows its own error and retry while the other stands

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-collector-page-US-01

**Pre-conditions:**

* Collector A holds two cases; the read behind `<failing>` fails until its retry is clicked.

**Test data:**

| `<failing>` | `<standing reads>` |
| --- | --- |
| the vault cases section | the header, Chan Tai Man and the email |
| the header | the vault cases, both listed |

**Steps:**

1. Open collector A's page.
2. Click the failing section's retry.

**Expected Results:**

* Step 1 shows `<failing>`'s own error with a retry, `<standing reads>`.
* Step 2 loads it, the other unchanged.

<!-- trace:case id=g10adm.console-collector-page.TC-43i rev=1 covers=g10adm.console-collector-page.SC-80w,g10adm.console-collector-page.SC-hy5,g10adm.console-collector-page.SC-zvu,g10adm.console-collector-page.SC-liq,g10adm.console-collector-page.SC-q24,g10adm.console-collector-page.SC-2do,g10adm.console-collector-page.SC-ls5,g10adm.console-collector-page.SC-ybv,g10adm.console-collector-page.SC-m8a,g10adm.console-collector-page.SC-0o4,g10adm.console-collector-page.SC-bfq,g10adm.console-collector-page.SC-frx,g10adm.console-collector-page.SC-k7t,g10adm.console-collector-page.SC-9ct,g10adm.console-collector-page.SC-ogo -->
### g10adm.console-collector-page.US1-TC8: An id no account answers to says so

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-collector-page-US-01

**Pre-conditions:**

* Staff is signed in.

**Test data:**

| `<id>` |
| --- |
| a well-formed user id no account holds |
| not-a-user-id |

**Steps:**

1. Open `<collector page>` at `<id>`.

**Expected Results:**

* It says nobody answers to that id, showing no name, email or case.

<!-- trace:case id=g10adm.console-collector-page.TC-leh rev=1 covers=g10adm.console-collector-page.SC-80w,g10adm.console-collector-page.SC-hy5,g10adm.console-collector-page.SC-zvu,g10adm.console-collector-page.SC-liq,g10adm.console-collector-page.SC-q24,g10adm.console-collector-page.SC-2do,g10adm.console-collector-page.SC-ls5,g10adm.console-collector-page.SC-ybv,g10adm.console-collector-page.SC-m8a,g10adm.console-collector-page.SC-0o4,g10adm.console-collector-page.SC-bfq,g10adm.console-collector-page.SC-frx,g10adm.console-collector-page.SC-k7t,g10adm.console-collector-page.SC-9ct,g10adm.console-collector-page.SC-ogo -->
### g10adm.console-collector-page.US1-TC11: The header opens the queue narrowed to the collector

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-collector-page-US-01

**Pre-conditions:**

* Collector A holds two submitted cases, no visit booked.

**Test data:**

| `<actor>` |
| --- |
| staff |
| a treasurer |

**Steps:**

1. As `<actor>`, open collector A's page, follow Their cases on the queue, and open Needs staff.

**Expected Results:**

* The queue opens narrowed to collector A; Needs staff lists the two cases and no other.

<!-- trace:case id=g10adm.console-collector-page.TC-0og rev=1 covers=g10adm.console-collector-page.SC-80w,g10adm.console-collector-page.SC-hy5,g10adm.console-collector-page.SC-zvu,g10adm.console-collector-page.SC-liq,g10adm.console-collector-page.SC-q24,g10adm.console-collector-page.SC-2do,g10adm.console-collector-page.SC-ls5,g10adm.console-collector-page.SC-ybv,g10adm.console-collector-page.SC-m8a,g10adm.console-collector-page.SC-0o4,g10adm.console-collector-page.SC-bfq,g10adm.console-collector-page.SC-frx,g10adm.console-collector-page.SC-k7t,g10adm.console-collector-page.SC-9ct,g10adm.console-collector-page.SC-ogo -->
### g10adm.console-collector-page.US1-TC12: A walk-in removed from the account and an erased case are not listed

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-collector-page-US-01

**Pre-conditions:**

* Collector A holds a released case; a walk-in staff opened for them was cancelled and removed; another case of theirs was erased.

**Steps:**

1. Open collector A's page.

**Expected Results:**

* The section lists the released case alone.

<!-- trace:case id=g10adm.console-collector-page.TC-1cp rev=1 covers=g10adm.console-collector-page.SC-80w,g10adm.console-collector-page.SC-hy5,g10adm.console-collector-page.SC-zvu,g10adm.console-collector-page.SC-liq,g10adm.console-collector-page.SC-q24,g10adm.console-collector-page.SC-2do,g10adm.console-collector-page.SC-ls5,g10adm.console-collector-page.SC-ybv,g10adm.console-collector-page.SC-m8a,g10adm.console-collector-page.SC-0o4,g10adm.console-collector-page.SC-bfq,g10adm.console-collector-page.SC-frx,g10adm.console-collector-page.SC-k7t,g10adm.console-collector-page.SC-9ct,g10adm.console-collector-page.SC-ogo -->
### g10adm.console-collector-page.US1-TC9: The page is refused without the vault read grant

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Opening the page

**Pre-conditions:**

* Collector A holds a vault case.

**Test data:**

| `<actor>` | `<answer>` |
| --- | --- |
| admin(holds a console grant but not `vault:read`) | refused |
| customer(collector), collector A themselves | refused, no console |
| signed out | the console's sign-in |

**Steps:**

1. As `<actor>`, open collector A's `<collector page>`.

**Expected Results:**

* It answers `<answer>`; no name, email or case is shown.

<!-- trace:case id=g10adm.console-collector-page.TC-k4e rev=1 covers=g10adm.console-collector-page.SC-80w,g10adm.console-collector-page.SC-hy5,g10adm.console-collector-page.SC-zvu,g10adm.console-collector-page.SC-liq,g10adm.console-collector-page.SC-q24,g10adm.console-collector-page.SC-2do,g10adm.console-collector-page.SC-ls5,g10adm.console-collector-page.SC-ybv,g10adm.console-collector-page.SC-m8a,g10adm.console-collector-page.SC-0o4,g10adm.console-collector-page.SC-bfq,g10adm.console-collector-page.SC-frx,g10adm.console-collector-page.SC-k7t,g10adm.console-collector-page.SC-9ct,g10adm.console-collector-page.SC-ogo -->
### g10adm.console-collector-page.US1-TC10: A case nobody holds offers no collector's page

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Opening the page

**Pre-conditions:**

* A case's collector account has been erased.

**Steps:**

1. As staff, open the case, and read its header.

**Expected Results:**

* It carries no The collector's cases link, and nothing links a collector's page.

---

## g10adm.console-collector-page.US2: Treasurer reads a collector's cases without their name

**As a** treasurer,
**I want** the collector page to show the cases they hold,
**so that** I can follow a borrower's money across their cases without being
shown a name my role does not hold.

<!-- trace:case id=g10adm.console-collector-page.TC-s8o rev=1 covers=g10adm.console-collector-page.SC-4hc,g10adm.console-collector-page.SC-olt,g10adm.console-collector-page.SC-cf6,g10adm.console-collector-page.SC-zfs -->
### g10adm.console-collector-page.US2-TC1: A treasurer reads the collector's cases under their short id and no name

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-collector-page-US-02

**Pre-conditions:**

* A treasurer is on a live loan of collector A, who holds two cases.

**Steps:**

1. Click The collector's cases in the case header, and read the header and the section.
2. Open the case from the section.

**Expected Results:**

* Step 1 opens collector A's page, the header reading the short id with no name or email; both cases are listed with reference, item, status, lane and last touched.
* Step 2's case page shows tai.man@example.com as its contact.

---

## g10adm.console-collector-page.US3: Operator reads a collector's items on their page

**As a** member of shop staff with a collector at the counter,
**I want** their page to list every item they own but a retired one, marked
or not,
**so that** I can see everything they have with us in one place.

<!-- trace:case id=g10adm.console-collector-page.TC-0ku rev=1 covers=g10adm.console-collector-page.SC-tu2,g10adm.console-collector-page.SC-z9y,g10adm.console-collector-page.SC-21h -->
### g10adm.console-collector-page.US3-TC1: The page lists every live item the collector owns

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-collector-page-US-03

**Pre-conditions:**

* Collector A owns an item the vault marks, one nothing marks, and a retired one; another item moved from them to collector B.

**Steps:**

1. As staff, open collector A's page, and read the Items section.
2. Click the marked item's row.

**Expected Results:**

* It lists the marked and the unmarked item, each reading title, category, grader and cert and whether it is marked, with no owner column; neither the retired nor the moved item.
* Step 2 opens the item's page.

<!-- trace:case id=g10adm.console-collector-page.TC-bbx rev=1 covers=g10adm.console-collector-page.SC-tu2,g10adm.console-collector-page.SC-z9y,g10adm.console-collector-page.SC-21h -->
### g10adm.console-collector-page.US3-TC2: A collector who owns no item reads as owning none

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-collector-page-US-03

**Pre-conditions:**

* Collector E holds a vault case and owns no item.

**Steps:**

1. As staff, open their page.

**Expected Results:**

* Items says they own none; the vault cases section lists their case.

<!-- trace:case id=g10adm.console-collector-page.TC-p7a rev=1 covers=g10adm.console-collector-page.SC-tu2,g10adm.console-collector-page.SC-z9y,g10adm.console-collector-page.SC-21h -->
### g10adm.console-collector-page.US3-TC3: The Items section refuses or fails on its own, the rest of the page standing

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-collector-page-US-03

**Pre-conditions:**

* Collector A owns an item and holds a vault case; `<reader>` opens their page.

**Test data:**

| `<reader>` | `<items reads>` |
| --- | --- |
| a treasurer, holding no inventory grant | `inventory:read` named, no item listed |
| staff, the items read failing once | its own error with a retry, which then lists the live items |

**Steps:**

1. Read the Items section, and click any retry offered.

**Expected Results:**

* It reads `<items reads>`; the header and the vault cases still load.

## Settled

- The vault cases section pages 50 at a time, as every console list does.
- A reader without the identity grant reads neither the name nor the email in the header; each case keeps its own contact.
- An account the service cannot read shows neither its name nor its email: both are one read of the account.
- The section lists every case at every status, a case removed from the account or erased excepted.
- Every opening is on the audit chain, whoever opens the page.
