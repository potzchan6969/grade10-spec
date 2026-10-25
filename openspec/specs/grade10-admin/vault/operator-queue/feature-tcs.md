# grade10-admin/vault/operator-queue Test Cases

**Status:** pending-review · 24/80
**Drafts styled:** 2026-10-25, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7

## Background

* The vault console's queue is `<queue>`, on the Grade10 admin console: five status views (Needs staff, Agreeing, In vault, Drafts, Closed), the Overdue view, Held items, search, and Open a walk-in in its header. A case opens on its own page with its Case, Documents, Custody and Payouts tabs.
* Staff is admin(holds `vault:operate`, `vault:read` and `kyc:read`) and a treasurer admin(holds `vault:read` and `vault:payout`), unless a case says otherwise. The brand's clock is Hong Kong's; a tester moves it to reach a moment. The register is the item register, which can be made not to answer.
* Lists page 50 rows at a time.

## Walk 1: Open the shop and serve the counter

Starting state:

- Staff signed in on `<queue>`, cases waiting in several views; a customer at the counter holding reference QC7PEQ.

Shared test data:

| Field | Value |
| --- | --- |
| case | the customer's case QC7PEQ, its item in the vault |

### Route

1. Open the vault section.
   - Needs staff, each view counting what it holds. `g10adm.vault-operator-queue.US6-TC1`
2. Search for qc7peq.
   - The case. `g10adm.vault-operator-queue.US5-TC1`
3. Open it and read its tabs.
   - Only the acts its status allows, the withheld ones saying what they wait for. `g10adm.vault-operator-queue.US3-TC2`
4. Open Held items.
   - Each item by shop and locker, the figures counting the holdings. `g10adm.vault-operator-queue.US4-TC2`

## g10adm.vault-operator-queue.US1: Operator opens the shop and sees what is waiting

**As a** member of shop staff starting a shift,
**I want** the queue cut by what each case is waiting for, with a badge saying
why a case needs me,
**so that** I can work the counter without being emailed anything.

<!-- trace:case id=g10adm.vault-operator-queue.TC-bwg rev=2 covers=g10adm.vault-operator-queue.SC-77a,g10adm.vault-operator-queue.SC-90m,g10adm.vault-operator-queue.SC-9ub,g10adm.vault-operator-queue.SC-uo6,g10adm.vault-operator-queue.SC-bd3,g10adm.vault-operator-queue.SC-6lc -->
### g10adm.vault-operator-queue.US1-TC1: A queue row reads the case in the collector's words, and says when the collector is the one awaited

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-01

**Pre-conditions:**

* Staff is on `<queue>`; a case is `<state>`.

**Test data:**

| `<state>` | `<row reads>` |
| --- | --- |
| under valuation | its reference, item and collector, and the word the collector's own page shows, never under_valuation |
| holding an offer out and unanswered | waiting on the collector |

**Steps:**

1. Read the case's row.

**Expected Results:**

* It reads `<row reads>`.

<!-- trace:case id=g10adm.vault-operator-queue.TC-hcu rev=1 covers=g10adm.vault-operator-queue.SC-77a,g10adm.vault-operator-queue.SC-90m,g10adm.vault-operator-queue.SC-9ub,g10adm.vault-operator-queue.SC-uo6,g10adm.vault-operator-queue.SC-bd3,g10adm.vault-operator-queue.SC-6lc -->
### g10adm.vault-operator-queue.US1-TC2: Every status lives in exactly one view, and there is no Today view

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-01

**Pre-conditions:**

* Cases stand at every status, one opened at the counter today from a visit the diary passed on.

**Steps:**

1. Read the five status views together.

**Expected Results:**

* Every status appears in exactly one view; none is called Today; today's case sits in its status's view.

<!-- trace:case id=g10adm.vault-operator-queue.TC-gfo rev=1 covers=g10adm.vault-operator-queue.SC-77a,g10adm.vault-operator-queue.SC-90m,g10adm.vault-operator-queue.SC-9ub,g10adm.vault-operator-queue.SC-uo6,g10adm.vault-operator-queue.SC-bd3,g10adm.vault-operator-queue.SC-6lc -->
### g10adm.vault-operator-queue.US1-TC4: A valuation untouched past a week is badged stalled, and not before

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
* **Trace:** The queue

**Pre-conditions:**

* A case under valuation was last touched `<ago>`.

**Test data:**

| `<ago>` | `<badge>` |
| --- | --- |
| 8 days ago | a stalled valuation |
| exactly 7 days ago | none |
| 2 days ago | none |

**Steps:**

1. Read its row on `<queue>`.

**Expected Results:**

* It carries `<badge>`.

---

## g10adm.vault-operator-queue.US2: Operator finds the case of the person at the counter

**As a** member of shop staff,
**I want** to find a case by the customer's number, address or case id,
**so that** somebody standing in front of me is served without my being able
to walk the whole customer list.

<!-- trace:case id=g10adm.vault-operator-queue.TC-xod rev=1 covers=g10adm.vault-operator-queue.SC-02a,g10adm.vault-operator-queue.SC-bol,g10adm.vault-operator-queue.SC-m6s,g10adm.vault-operator-queue.SC-4px,g10adm.vault-operator-queue.SC-i1e,g10adm.vault-operator-queue.SC-ehn -->
### g10adm.vault-operator-queue.US2-TC1: Search finds a case by its address, its number however typed, or the start of its id

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-02

**Pre-conditions:**

* A case is stored under the address mei.chan@example.com, the number +85298765432, and an id staff reads off another screen.

**Test data:**

| `<searched>` |
| --- |
| mei.chan@example.com |
| +852 9876 5432 |
| ９８７６ ５４３２, in full-width digits |
| 852 9876 5432, with no + |
| the first eight characters of its id |

**Steps:**

1. Search for `<searched>`.

**Expected Results:**

* The case is found.

<!-- trace:case id=g10adm.vault-operator-queue.TC-af0 rev=1 covers=g10adm.vault-operator-queue.SC-02a,g10adm.vault-operator-queue.SC-bol,g10adm.vault-operator-queue.SC-m6s,g10adm.vault-operator-queue.SC-4px,g10adm.vault-operator-queue.SC-i1e,g10adm.vault-operator-queue.SC-ehn -->
### g10adm.vault-operator-queue.US2-TC4: Part of a number, or nothing that matches, finds no case

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-02

**Pre-conditions:**

* A case is stored under +85298765432.

**Test data:**

| `<searched>` |
| --- |
| 98765, part of the number |
| an address no case holds |

**Steps:**

1. Search for `<searched>`.

**Expected Results:**

* No case is found, and the results say so.

<!-- trace:case id=g10adm.vault-operator-queue.TC-u6z rev=1 covers=g10adm.vault-operator-queue.SC-02a,g10adm.vault-operator-queue.SC-bol,g10adm.vault-operator-queue.SC-m6s,g10adm.vault-operator-queue.SC-4px,g10adm.vault-operator-queue.SC-i1e,g10adm.vault-operator-queue.SC-ehn,g10adm.vault-operator-queue.SC-ybs,g10adm.vault-operator-queue.SC-76n,g10adm.vault-operator-queue.SC-qhf -->
### g10adm.vault-operator-queue.US2-TC6: A search is recorded without its term

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-02

**Pre-conditions:**

* Staff is on `<queue>`.

**Test data:**

| `<searched>` | `<entry names>` |
| --- | --- |
| a customer's email address | that the term was an address |
| a case reference | that the term was a reference |

**Steps:**

1. Search for `<searched>`; as an auditor, read the audit trail.

**Expected Results:**

* One entry names the operator, the moment, `<entry names>` and how many matched; the term itself appears nowhere.

<!-- trace:case id=g10adm.vault-operator-queue.TC-c2r rev=1 covers=g10adm.vault-operator-queue.SC-02a,g10adm.vault-operator-queue.SC-bol,g10adm.vault-operator-queue.SC-m6s,g10adm.vault-operator-queue.SC-4px,g10adm.vault-operator-queue.SC-i1e,g10adm.vault-operator-queue.SC-ehn -->
### g10adm.vault-operator-queue.US2-TC7: Reading the queue unnarrowed records nothing

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-02

**Pre-conditions:**

* A treasurer is signed in.

**Steps:**

1. Read `<queue>` unnarrowed; as an auditor, read the audit trail.

**Expected Results:**

* No entry is written for it.

---

## g10adm.vault-operator-queue.US3: Operator works one case from its own tabs

**As a** member of shop staff,
**I want** each tab to offer exactly the acts this case's status allows,
**so that** I cannot be shown a button that will only be refused.

<!-- trace:case id=g10adm.vault-operator-queue.TC-0uh rev=1 covers=g10adm.vault-operator-queue.SC-skv,g10adm.vault-operator-queue.SC-jmv,g10adm.vault-operator-queue.SC-4bx,g10adm.vault-operator-queue.SC-ld3,g10adm.vault-operator-queue.SC-tog -->
### g10adm.vault-operator-queue.US3-TC2: Each tab offers the acts the case's status allows, and names the ones it withholds

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-03

**Pre-conditions:**

* Staff opens a case whose item is in the vault.

**Steps:**

1. Read each tab.

**Expected Results:**

* No act that runs only before custody is offered; each act this status withholds is named with what it waits for.

<!-- trace:case id=g10adm.vault-operator-queue.TC-0mn rev=1 covers=g10adm.vault-operator-queue.SC-skv,g10adm.vault-operator-queue.SC-jmv,g10adm.vault-operator-queue.SC-4bx,g10adm.vault-operator-queue.SC-ld3,g10adm.vault-operator-queue.SC-tog -->
### g10adm.vault-operator-queue.US3-TC1: A case offers only the acts the operator's grants allow, and refuses the rest by name

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
* **Trace:** grade10-admin-vault-operator-queue-US-03

**Pre-conditions:**

* `<operator>` opens an active case.

**Test data:**

| `<operator>` | `<tried>` |
| --- | --- |
| admin holding `vault:read` alone | an act needing `vault:operate`, through its address |
| staff, without `vault:payout` | Record a repayment, through its address |

**Steps:**

1. Read the tabs, and try `<tried>`.

**Expected Results:**

* No act needing another grant is offered; `<tried>` is refused, naming the grant.

<!-- trace:case id=g10adm.vault-operator-queue.TC-p8j rev=1 covers=g10adm.vault-operator-queue.SC-skv,g10adm.vault-operator-queue.SC-jmv,g10adm.vault-operator-queue.SC-4bx,g10adm.vault-operator-queue.SC-ld3,g10adm.vault-operator-queue.SC-tog -->
### g10adm.vault-operator-queue.US3-TC4: An act sent from a page the case has moved under is refused by name

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-03

**Pre-conditions:**

* Staff has a case open under valuation; in another tab it is then declined.

**Steps:**

1. From the first tab, record a valuation.

**Expected Results:**

* It is refused, naming the case's new status; nothing is recorded.

<!-- trace:case id=g10adm.vault-operator-queue.TC-9u7 rev=1 covers=g10adm.vault-operator-queue.SC-skv,g10adm.vault-operator-queue.SC-jmv,g10adm.vault-operator-queue.SC-4bx,g10adm.vault-operator-queue.SC-ld3,g10adm.vault-operator-queue.SC-tog -->
### g10adm.vault-operator-queue.US3-TC5: Production asks for a second factor, once for the shift's next act

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Who may act

**Pre-conditions:**

* Staff signs in to the production console.

**Steps:**

1. Open a vault surface.
2. Prove the second factor; an hour later, record a payment as a treasurer who also proved it an hour ago.

**Expected Results:**

* Step 1 asks for the second factor.
* Step 2 asks nothing again.

<!-- trace:case id=g10adm.vault-operator-queue.TC-kre rev=1 -->
### g10adm.vault-operator-queue.US3-TC7: One case's audit trail carries every act on it with who did it, and an act it cannot record is refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Who may act

**Pre-conditions:**

* `<state>`.

**Test data:**

| `<state>` | `<then>` | `<reads>` |
| --- | --- | --- |
| a case valued, offered, signed and paid out | as an auditor, filter the audit trail by its id | each of those acts, naming who did it |
| the audit trail made to refuse its next entry | staff records a valuation | the act refused, nothing recorded |

**Steps:**

1. `<then>`.

**Expected Results:**

* It reads `<reads>`.

---

## g10adm.vault-operator-queue.US4: Operator takes an item in and can say where it is

**As a** member of shop staff,
**I want** to name the shop and locker when I take an item in, and to list
everything we hold,
**so that** anybody can be told which vault an item is sitting in.

<!-- trace:case id=g10adm.vault-operator-queue.TC-3im rev=1 covers=g10adm.vault-operator-queue.SC-96r,g10adm.vault-operator-queue.SC-1uj,g10adm.vault-operator-queue.SC-4c4,g10adm.vault-operator-queue.SC-1ij,g10adm.vault-operator-queue.SC-4h9,g10adm.vault-operator-queue.SC-j43,g10adm.vault-operator-queue.SC-0nd -->
### g10adm.vault-operator-queue.US4-TC1: Confirming an item vaulted needs its shop, and its locker is optional

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-04

**Pre-conditions:**

* Staff is on a case's Custody tab, its packet signed.

**Steps:**

1. Confirm it vaulted with no shop.
2. Confirm it with a shop and no locker.

**Expected Results:**

* Step 1 is refused, naming the shop.
* Step 2 is taken; the case reads vaulted at that shop.

<!-- trace:case id=g10adm.vault-operator-queue.TC-4pr rev=1 covers=g10adm.vault-operator-queue.SC-96r,g10adm.vault-operator-queue.SC-1uj,g10adm.vault-operator-queue.SC-4c4,g10adm.vault-operator-queue.SC-1ij,g10adm.vault-operator-queue.SC-4h9,g10adm.vault-operator-queue.SC-j43,g10adm.vault-operator-queue.SC-0nd -->
### g10adm.vault-operator-queue.US4-TC2: Held items lists everything held by shop, its figures counting the holdings and narrowing with the shop

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-04

**Pre-conditions:**

* 60 items are held across shops A and B, 25 of them under a live loan; shop C holds nothing.

**Test data:**

| `<narrowed to>` | `<lists>` | `<figures read>` |
| --- | --- | --- |
| every shop | every item, each naming its shop, over two pages | 60 held, 25 carrying a live loan, and how many per shop |
| shop A | shop A's items alone | shop A's alone |
| shop C | that nothing is held | none |

**Steps:**

1. Open Held items narrowed to `<narrowed to>`, paging to the end.

**Expected Results:**

* It lists `<lists>`; the figures read `<figures read>`, the same on every page.

<!-- trace:case id=g10adm.vault-operator-queue.TC-y6r rev=2 covers=g10adm.vault-operator-queue.SC-96r,g10adm.vault-operator-queue.SC-1uj,g10adm.vault-operator-queue.SC-4c4,g10adm.vault-operator-queue.SC-1ij,g10adm.vault-operator-queue.SC-4h9,g10adm.vault-operator-queue.SC-j43,g10adm.vault-operator-queue.SC-0nd -->
### g10adm.vault-operator-queue.US4-TC8: A held row says what the item is carrying

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
* **Trace:** grade10-admin-vault-operator-queue-US-04

**Pre-conditions:**

* Held items lists an item `<carrying>`.

**Test data:**

| `<carrying>` |
| --- |
| under a live loan |
| whose loan was repaid |

**Steps:**

1. Read its row.

**Expected Results:**

* It names the case reference, the item, the shop, the locker, the day it was taken in, the days it has been held, and what it carries: the live loan, or nothing owed.

<!-- trace:case id=g10adm.vault-operator-queue.TC-a8a rev=1 covers=g10adm.vault-operator-queue.SC-96r,g10adm.vault-operator-queue.SC-1uj,g10adm.vault-operator-queue.SC-4c4,g10adm.vault-operator-queue.SC-1ij,g10adm.vault-operator-queue.SC-4h9,g10adm.vault-operator-queue.SC-j43,g10adm.vault-operator-queue.SC-0nd -->
### g10adm.vault-operator-queue.US4-TC6: A move between lockers reads back on the custody log

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-04

**Pre-conditions:**

* Staff is on the Custody tab of a case held in locker 3.

**Steps:**

1. Move it to locker 7, and read the custody log.

**Expected Results:**

* The newest row names the move, locker 7, when and who.

---

## g10adm.vault-operator-queue.US5: Operator finds the case by the reference read out

**As a** member of shop staff,
**I want** the six characters a customer reads out to find their case,
**so that** I need not ask for their phone number or email.

<!-- trace:case id=g10adm.vault-operator-queue.TC-jmh rev=1 covers=g10adm.vault-operator-queue.SC-ybs,g10adm.vault-operator-queue.SC-76n,g10adm.vault-operator-queue.SC-qhf -->
### g10adm.vault-operator-queue.US5-TC1: The reference read out finds its case, in any case and from its first characters

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-05

**Pre-conditions:**

* A case carries QC7PEQ.

**Test data:**

| `<searched>` |
| --- |
| QC7PEQ |
| qc7peq |
| QC7P |

**Steps:**

1. Search for `<searched>`.

**Expected Results:**

* The case is found, alone where the whole reference is typed.

<!-- trace:case id=g10adm.vault-operator-queue.TC-xgg rev=1 covers=g10adm.vault-operator-queue.SC-ybs,g10adm.vault-operator-queue.SC-76n,g10adm.vault-operator-queue.SC-qhf -->
### g10adm.vault-operator-queue.US5-TC3: A reference no case holds finds no case, and says so

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-05

**Pre-conditions:**

* No case carries VK3TXZ.

**Steps:**

1. Search for VK3TXZ.

**Expected Results:**

* The answer says no case answers to it.

<!-- trace:case id=g10adm.vault-operator-queue.TC-8w9 rev=1 -->
### g10adm.vault-operator-queue.US5-TC5: Every surface of a case carries its reference

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-05

**Pre-conditions:**

* QC7PEQ's item is in the vault.

**Steps:**

1. Read its queue row, its Held items row and its page header.

**Expected Results:**

* Each shows QC7PEQ.

---

## g10adm.vault-operator-queue.US6: Operator reads the shop's day at a glance

**As a** member of shop staff starting a shift,
**I want** a count on every view and the cases waiting on staff first,
**so that** I know the day's load before I open a case.

<!-- trace:case id=g10adm.vault-operator-queue.TC-alu rev=2 covers=g10adm.vault-operator-queue.SC-5zv,g10adm.vault-operator-queue.SC-2bi,g10adm.vault-operator-queue.SC-q25 -->
### g10adm.vault-operator-queue.US6-TC1: The section opens on Needs staff, every view counting what it holds and an empty one saying so

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-06

**Pre-conditions:**

* `<cases>`.

**Test data:**

| `<cases>` | `<reads>` |
| --- | --- |
| 60 cases waiting on staff, none agreeing, one accepted | Needs staff open, counting 60 and its page showing how many it holds; Agreeing counting none; the accepted case not in Needs staff |
| no case waiting on staff | Needs staff open, saying it holds no case, its count none |

**Steps:**

1. Open the vault section, and read each view's count.

**Expected Results:**

* It reads `<reads>`.

<!-- trace:case id=g10adm.vault-operator-queue.TC-jpr rev=1 covers=g10adm.vault-operator-queue.SC-5zv,g10adm.vault-operator-queue.SC-2bi,g10adm.vault-operator-queue.SC-q25 -->
### g10adm.vault-operator-queue.US6-TC5: Load more pages on from the last row, and offers nothing once the view is whole

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
* **Trace:** The queue

**Pre-conditions:**

* A view holds `<held>`.

**Test data:**

| `<held>` | `<after the first page>` |
| --- | --- |
| 120 cases | Load more adds the next 50, none seen twice or skipped, the counts shown updating |
| exactly 50 cases | that nothing more remains, no Load more |

**Steps:**

1. Read the first page, and page on while offered.

**Expected Results:**

* It reads `<after the first page>`.

---

## g10adm.vault-operator-queue.US7: Operator walks the counter's case in order

**As a** member of shop staff with a customer at the counter,
**I want** the case to list the counter's steps in order, tick each as it
lands, and say why an act is not offered yet,
**so that** a shop of three runs the flow from the screen rather than from
memory.

<!-- trace:case id=g10adm.vault-operator-queue.TC-92x rev=2 covers=g10adm.vault-operator-queue.SC-i5p,g10adm.vault-operator-queue.SC-on2,g10adm.vault-operator-queue.SC-a0m,g10adm.vault-operator-queue.SC-fzi,g10adm.vault-operator-queue.SC-ffw -->
### g10adm.vault-operator-queue.US7-TC1: A counter case opens on its lane's steps in order, the done ones ticked

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-07

**Pre-conditions:**

* Staff opens a `<lane>` case opened at the counter, its identity check recorded and nothing valued.

**Test data:**

| `<lane>` | `<steps read>` |
| --- | --- |
| financed | seven steps in order, identity ticked, the terms step asking for the loan agreement's key terms |
| storage | the steps, the terms step reading the custody terms, none asking for key terms |

**Steps:**

1. Read the Case tab.

**Expected Results:**

* It opens on `<steps read>`.

<!-- trace:case id=g10adm.vault-operator-queue.TC-hib rev=2 covers=g10adm.vault-operator-queue.SC-i5p,g10adm.vault-operator-queue.SC-on2,g10adm.vault-operator-queue.SC-a0m,g10adm.vault-operator-queue.SC-fzi,g10adm.vault-operator-queue.SC-ffw -->
### g10adm.vault-operator-queue.US7-TC5: An act lands its step, and the next step carries its act

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-07

**Pre-conditions:**

* Staff is on a counter case at its valuation step.

**Steps:**

1. Record the valuation from that step.

**Expected Results:**

* The step is ticked; the next step is current, carrying the act that lands it.

<!-- trace:case id=g10adm.vault-operator-queue.TC-nj3 rev=2 covers=g10adm.vault-operator-queue.SC-i5p,g10adm.vault-operator-queue.SC-on2,g10adm.vault-operator-queue.SC-a0m,g10adm.vault-operator-queue.SC-fzi,g10adm.vault-operator-queue.SC-ffw -->
### g10adm.vault-operator-queue.US7-TC2: A step the case does not allow yet offers no act and says what it waits for

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-07

**Pre-conditions:**

* Staff is on a financed counter case whose packet is unsigned.

**Steps:**

1. Read the step that puts the item in the vault.

**Expected Results:**

* It offers no act, and says it waits for the signed packet.

<!-- trace:case id=g10adm.vault-operator-queue.TC-lbt rev=2 covers=g10adm.vault-operator-queue.SC-i5p,g10adm.vault-operator-queue.SC-on2,g10adm.vault-operator-queue.SC-a0m,g10adm.vault-operator-queue.SC-fzi,g10adm.vault-operator-queue.SC-ffw -->
### g10adm.vault-operator-queue.US7-TC4: A case the collector sent online shows no checklist

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-07

**Pre-conditions:**

* Staff opens a case the collector sent online.

**Steps:**

1. Read the Case tab.

**Expected Results:**

* No checklist is shown.

---

## g10adm.vault-operator-queue.US8: Operator reads why a late loan cannot be forfeited yet

**As a** member of shop staff,
**I want** the custody tab to say in words why Forfeit is not offered — not
before the cure date, the notice sent on which day,
**so that** I never take an item a day early.

<!-- trace:case id=g10adm.vault-operator-queue.TC-v2p rev=1 covers=g10adm.vault-operator-queue.SC-cby,g10adm.vault-operator-queue.SC-ngn,g10adm.vault-operator-queue.SC-xep,g10adm.vault-operator-queue.SC-oxk,g10adm.vault-operator-queue.SC-g9x -->
### g10adm.vault-operator-queue.US8-TC1: Forfeit is withheld, in words, until the due date and the notice's date have passed

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-08

**Pre-conditions:**

* Staff reads the Custody tab of a live loan `<state>`.

**Test data:**

| `<state>` | `<reason reads>` |
| --- | --- |
| not yet due | that the due date has not passed |
| past due, no notice sent | that no written notice has been sent, offering the notice |
| a notice sent on 1 December, paying by 15 December, it being 10 December | 15 December, and that the notice went on 1 December |

**Steps:**

1. Look for Forfeit.

**Expected Results:**

* It is not offered; the reason reads `<reason reads>`.

<!-- trace:case id=g10adm.vault-operator-queue.TC-yg6 rev=1 covers=g10adm.vault-operator-queue.SC-cby,g10adm.vault-operator-queue.SC-ngn,g10adm.vault-operator-queue.SC-xep,g10adm.vault-operator-queue.SC-oxk,g10adm.vault-operator-queue.SC-g9x -->
### g10adm.vault-operator-queue.US8-TC4: Forfeit is offered once nothing holds it

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-08

**Pre-conditions:**

* A live loan is past due, its notice's date to pay by passed.

**Steps:**

1. Read the Custody tab.

**Expected Results:**

* Forfeit is offered, with no reason withholding it.

<!-- trace:case id=g10adm.vault-operator-queue.TC-pwu rev=1 covers=g10adm.vault-operator-queue.SC-cby,g10adm.vault-operator-queue.SC-ngn,g10adm.vault-operator-queue.SC-xep,g10adm.vault-operator-queue.SC-oxk,g10adm.vault-operator-queue.SC-g9x -->
### g10adm.vault-operator-queue.US8-TC5: The Custody tab lists what the collector was told

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-08

**Pre-conditions:**

* A late loan was sent two reminders and a forfeiture notice.

**Steps:**

1. Read the Custody tab.

**Expected Results:**

* Each of the three is listed with the day it went and its channel.

---

## g10adm.vault-operator-queue.US9: Operator reads the identity state the record names

**As a** member of shop staff working a case,
**I want** the identity panel to say Verified, Out, Stalled, Refused, Lapsed
or None,
**so that** I know whether to send the check again, wait, or do it at the
counter.

<!-- trace:case id=g10adm.vault-operator-queue.TC-xkz rev=1 covers=g10adm.vault-operator-queue.SC-xz7,g10adm.vault-operator-queue.SC-rz1,g10adm.vault-operator-queue.SC-fw0,g10adm.vault-operator-queue.SC-3z5,g10adm.vault-operator-queue.SC-k4s -->
### g10adm.vault-operator-queue.US9-TC1: The identity panel reads one of six states, with what it adds and the acts it offers

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-09

**Pre-conditions:**

* Staff reads the identity panel of a case whose check is `<check>`.

**Test data:**

| `<check>` | `<panel reads>` |
| --- | --- |
| verified at the counter by Ana Lee on 2 Oct | Verified, by Ana Lee on 2 Oct |
| invited two days ago, unanswered | Out, with the day it went, offering to send it again |
| submitted, the provider undecided | Out |
| submitted long enough to stand stalled | Stalled |
| reported by the provider in a stage of its own | one of the six, with no word of the provider's |
| declined by the provider | Refused, with the day and the reason |
| expired | Lapsed |
| never asked for | None |

**Steps:**

1. Read the panel.

**Expected Results:**

* It reads `<panel reads>`, with what that state adds and the acts it offers.

<!-- trace:case id=g10adm.vault-operator-queue.TC-zxo rev=1 covers=g10adm.vault-operator-queue.SC-xz7,g10adm.vault-operator-queue.SC-rz1,g10adm.vault-operator-queue.SC-fw0,g10adm.vault-operator-queue.SC-3z5,g10adm.vault-operator-queue.SC-k4s -->
### g10adm.vault-operator-queue.US9-TC4: Recording a check over a refused one names who records over it and why

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-09

**Pre-conditions:**

* Staff reads a case whose last check reads Refused.

**Steps:**

1. Record a check at the counter, giving a reason.

**Expected Results:**

* It is recorded; the panel names who recorded over the refusal, and the reason.

<!-- trace:case id=g10adm.vault-operator-queue.TC-3jw rev=1 covers=g10adm.vault-operator-queue.SC-xz7,g10adm.vault-operator-queue.SC-rz1,g10adm.vault-operator-queue.SC-fw0,g10adm.vault-operator-queue.SC-3z5,g10adm.vault-operator-queue.SC-k4s -->
### g10adm.vault-operator-queue.US9-TC5: Recording over a refused check without a reason is refused

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-09

**Pre-conditions:**

* Staff reads a case whose last check reads Refused.

**Steps:**

1. Record a check at the counter, leaving the reason empty.

**Expected Results:**

* It is refused, naming the reason; the panel still reads Refused.

<!-- trace:case id=g10adm.vault-operator-queue.TC-5vm rev=1 covers=g10adm.vault-operator-queue.SC-xz7,g10adm.vault-operator-queue.SC-rz1,g10adm.vault-operator-queue.SC-fw0,g10adm.vault-operator-queue.SC-3z5,g10adm.vault-operator-queue.SC-k4s -->
### g10adm.vault-operator-queue.US9-TC3: The identity photograph opens only with the identity read

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-09

**Pre-conditions:**

* A case carries a verified check with its photograph; admin(holds `vault:operate`, not `kyc:read`) opens it.

**Steps:**

1. Look for View photograph; open its address.

**Expected Results:**

* It is not offered, and the address is refused, naming the grant.

---

## g10adm.vault-operator-queue.US10: Operator opens a case for a customer at the counter

**As a** member of shop staff with a customer and their item in front of me,
**I want** to open the case myself from their email, the item and my own
photos,
**so that** a customer with no request on their phone is served on the spot,
and the draft waits for them to send it.

<!-- trace:case id=g10adm.vault-operator-queue.TC-p4n rev=1 covers=g10adm.vault-operator-queue.SC-vri,g10adm.vault-operator-queue.SC-mvr,g10adm.vault-operator-queue.SC-rkk,g10adm.vault-operator-queue.SC-9is,g10adm.vault-operator-queue.SC-8w3,g10adm.vault-operator-queue.SC-d45,g10adm.vault-operator-queue.SC-or8,g10adm.vault-operator-queue.SC-us4,g10adm.vault-operator-queue.SC-bsk,g10adm.vault-operator-queue.SC-icq,g10adm.vault-operator-queue.SC-03h,g10adm.vault-operator-queue.SC-xu5,g10adm.vault-operator-queue.SC-wqo,g10adm.vault-operator-queue.SC-q6y,g10adm.vault-operator-queue.SC-wjv,g10adm.vault-operator-queue.SC-cgu,g10adm.vault-operator-queue.SC-jcc -->
### g10adm.vault-operator-queue.US10-TC1: A walk-in for a new address opens a draft under a new account

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* Staff is on `<queue>`, outside production.
* No account exists for `<walk-in email>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<walk-in email>` | walkin.new+`<run id>`@example.com |
| Category | Trading card |
| Title | Charizard 1st Edition |
| Description | Near-mint, unopened sleeve since grading. |
| Amount | HKD 5,000.00 |
| Photos | two JPEG photographs, each under 20 MB |

**Steps:**

1. Click Open a walk-in in the queue's header, and read the collection statement the form shows.
2. Fill in the email, category, title, description and amount from **Test data**, attach the two photographs, and click Open case.
3. Open the Drafts view.

**Expected Results:**

* Step 2 opens the new draft on its own page: financed, in HKD, with the facts and two photographs from **Test data**, offering Cancel and nothing to value and no visit to book; its header carries The collector's cases.
* Step 3 lists the draft as any draft reads there, its collector reading the handle of `<walk-in email>`; no name was asked for on the form.

<!-- trace:case id=g10adm.vault-operator-queue.TC-u0u rev=1 covers=g10adm.vault-operator-queue.SC-vri,g10adm.vault-operator-queue.SC-mvr,g10adm.vault-operator-queue.SC-rkk,g10adm.vault-operator-queue.SC-9is,g10adm.vault-operator-queue.SC-8w3,g10adm.vault-operator-queue.SC-d45,g10adm.vault-operator-queue.SC-or8,g10adm.vault-operator-queue.SC-us4,g10adm.vault-operator-queue.SC-bsk,g10adm.vault-operator-queue.SC-icq,g10adm.vault-operator-queue.SC-03h,g10adm.vault-operator-queue.SC-xu5,g10adm.vault-operator-queue.SC-wqo,g10adm.vault-operator-queue.SC-q6y,g10adm.vault-operator-queue.SC-wjv,g10adm.vault-operator-queue.SC-cgu,g10adm.vault-operator-queue.SC-jcc -->
### g10adm.vault-operator-queue.US10-TC2: A walk-in for an address nobody has signed in to opens under that account and renames nothing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* Staff is on `<queue>`, outside production.
* An account for `<walk-in email>`, which nobody has ever signed in to, carries the name Chan Tai Man and holds no vault case.

**Test data:**

| Field | Value |
| --- | --- |
| Title | Pikachu Illustrator |
| Description | Graded, slab intact. |
| Lane | storage only |
| Photos | one PNG photograph |

**Steps:**

1. Open a walk-in for `<walk-in email>` from **Test data**.
2. Open the account's collector page from the draft's header.

**Expected Results:**

* Step 1 opens the draft on the storage lane under that account; no second account exists for `<walk-in email>`, and it is still named Chan Tai Man.
* Step 2 lists the draft among its vault cases.

<!-- trace:case id=g10adm.vault-operator-queue.TC-vyx rev=1 covers=g10adm.vault-operator-queue.SC-vri,g10adm.vault-operator-queue.SC-mvr,g10adm.vault-operator-queue.SC-rkk,g10adm.vault-operator-queue.SC-9is,g10adm.vault-operator-queue.SC-8w3,g10adm.vault-operator-queue.SC-d45,g10adm.vault-operator-queue.SC-or8,g10adm.vault-operator-queue.SC-us4,g10adm.vault-operator-queue.SC-bsk,g10adm.vault-operator-queue.SC-icq,g10adm.vault-operator-queue.SC-03h,g10adm.vault-operator-queue.SC-xu5,g10adm.vault-operator-queue.SC-wqo,g10adm.vault-operator-queue.SC-q6y,g10adm.vault-operator-queue.SC-wjv,g10adm.vault-operator-queue.SC-cgu,g10adm.vault-operator-queue.SC-jcc -->
### g10adm.vault-operator-queue.US10-TC3: The statement is shown before the address, and the draft keeps its version

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* Staff is on `<queue>`, the collection statement written at `<statement version>`; no account exists for `<walk-in email>`.

**Steps:**

1. Click Open a walk-in, and read what the form shows before the email field.
2. Open a walk-in for `<walk-in email>` with one photograph, and read the draft's history.

**Expected Results:**

* Step 1 shows the collection statement before the email can be typed.
* Step 2 records that the statement was shown at the counter, at `<statement version>`, and no tick by the collector, whose own tick is still owed at the send.

<!-- trace:case id=g10adm.vault-operator-queue.TC-iqc rev=1 covers=g10adm.vault-operator-queue.SC-vri,g10adm.vault-operator-queue.SC-mvr,g10adm.vault-operator-queue.SC-rkk,g10adm.vault-operator-queue.SC-9is,g10adm.vault-operator-queue.SC-8w3,g10adm.vault-operator-queue.SC-d45,g10adm.vault-operator-queue.SC-or8,g10adm.vault-operator-queue.SC-us4,g10adm.vault-operator-queue.SC-bsk,g10adm.vault-operator-queue.SC-icq,g10adm.vault-operator-queue.SC-03h,g10adm.vault-operator-queue.SC-xu5,g10adm.vault-operator-queue.SC-wqo,g10adm.vault-operator-queue.SC-q6y,g10adm.vault-operator-queue.SC-wjv,g10adm.vault-operator-queue.SC-cgu,g10adm.vault-operator-queue.SC-jcc -->
### g10adm.vault-operator-queue.US10-TC4: Production refuses a walk-in while the collection statement is unwritten

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* Staff is on `<queue>` in production, with no collection statement written; no account exists for `<walk-in email>`.

**Steps:**

1. Open a walk-in for `<walk-in email>` with one photograph.

**Expected Results:**

* It is refused, saying the collection statement is not yet written; no draft opens, no account is created and nothing is emailed.

<!-- trace:case id=g10adm.vault-operator-queue.TC-3hf rev=1 covers=g10adm.vault-operator-queue.SC-vri,g10adm.vault-operator-queue.SC-mvr,g10adm.vault-operator-queue.SC-rkk,g10adm.vault-operator-queue.SC-9is,g10adm.vault-operator-queue.SC-8w3,g10adm.vault-operator-queue.SC-d45,g10adm.vault-operator-queue.SC-or8,g10adm.vault-operator-queue.SC-us4,g10adm.vault-operator-queue.SC-bsk,g10adm.vault-operator-queue.SC-icq,g10adm.vault-operator-queue.SC-03h,g10adm.vault-operator-queue.SC-xu5,g10adm.vault-operator-queue.SC-wqo,g10adm.vault-operator-queue.SC-q6y,g10adm.vault-operator-queue.SC-wjv,g10adm.vault-operator-queue.SC-cgu,g10adm.vault-operator-queue.SC-jcc -->
### g10adm.vault-operator-queue.US10-TC5: Outside production an unwritten statement reads Being prepared and the walk-in opens

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* Staff is on `<queue>` in staging, with no collection statement written; no account exists for `<walk-in email>`.

**Steps:**

1. Click Open a walk-in, and read the statement the form shows.
2. Open the walk-in for `<walk-in email>` with one photograph.

**Expected Results:**

* Step 1 says the collection statement is being prepared.
* Step 2 opens the draft on its own page.

<!-- trace:case id=g10adm.vault-operator-queue.TC-ntv rev=1 covers=g10adm.vault-operator-queue.SC-vri,g10adm.vault-operator-queue.SC-mvr,g10adm.vault-operator-queue.SC-rkk,g10adm.vault-operator-queue.SC-9is,g10adm.vault-operator-queue.SC-8w3,g10adm.vault-operator-queue.SC-d45,g10adm.vault-operator-queue.SC-or8,g10adm.vault-operator-queue.SC-us4,g10adm.vault-operator-queue.SC-bsk,g10adm.vault-operator-queue.SC-icq,g10adm.vault-operator-queue.SC-03h,g10adm.vault-operator-queue.SC-xu5,g10adm.vault-operator-queue.SC-wqo,g10adm.vault-operator-queue.SC-q6y,g10adm.vault-operator-queue.SC-wjv,g10adm.vault-operator-queue.SC-cgu,g10adm.vault-operator-queue.SC-jcc -->
### g10adm.vault-operator-queue.US10-TC6: A walk-in for an address someone has signed in to is refused, however it is typed

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* Staff is on `<queue>`, outside production.
* An account for `<signed-in email>`, which its owner has signed in to, carries the name Wong Siu Ming.

**Test data:**

| Field | Value |
| --- | --- |
| Typed as | `<signed-in email>` with its first letter and its domain in capitals, and a space either side |
| Title | Blastoise Base Set |
| Photos | one JPEG photograph |

**Steps:**

1. Open a walk-in from **Test data**, the email as Typed as.

**Expected Results:**

* A notice says only that the address has signed in before, and that this customer sends the request from their own phone; it names neither Wong Siu Ming nor the account's cases.
* The form keeps what was typed; no draft opens, no second account exists for the address, and nothing is emailed to it.

<!-- trace:case id=g10adm.vault-operator-queue.TC-qht rev=1 covers=g10adm.vault-operator-queue.SC-vri,g10adm.vault-operator-queue.SC-mvr,g10adm.vault-operator-queue.SC-rkk,g10adm.vault-operator-queue.SC-9is,g10adm.vault-operator-queue.SC-8w3,g10adm.vault-operator-queue.SC-d45,g10adm.vault-operator-queue.SC-or8,g10adm.vault-operator-queue.SC-us4,g10adm.vault-operator-queue.SC-bsk,g10adm.vault-operator-queue.SC-icq,g10adm.vault-operator-queue.SC-03h,g10adm.vault-operator-queue.SC-xu5,g10adm.vault-operator-queue.SC-wqo,g10adm.vault-operator-queue.SC-q6y,g10adm.vault-operator-queue.SC-wjv,g10adm.vault-operator-queue.SC-cgu,g10adm.vault-operator-queue.SC-jcc -->
### g10adm.vault-operator-queue.US10-TC7: A walk-in counts against the account's three unsent drafts

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
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* The account for `<walk-in email>`, which nobody has signed in to, holds `<held>`.

**Test data:**

| `<held>` | `<outcome>` |
| --- | --- |
| two drafts staff opened | the draft opens; the account now holds three |
| three drafts staff opened | the draft cap's own refusal, no draft opening |

**Steps:**

1. Open a walk-in for `<walk-in email>` with one photograph.

**Expected Results:**

* It reads `<outcome>`.

<!-- trace:case id=g10adm.vault-operator-queue.TC-srd rev=1 covers=g10adm.vault-operator-queue.SC-vri,g10adm.vault-operator-queue.SC-mvr,g10adm.vault-operator-queue.SC-rkk,g10adm.vault-operator-queue.SC-9is,g10adm.vault-operator-queue.SC-8w3,g10adm.vault-operator-queue.SC-d45,g10adm.vault-operator-queue.SC-or8,g10adm.vault-operator-queue.SC-us4,g10adm.vault-operator-queue.SC-bsk,g10adm.vault-operator-queue.SC-icq,g10adm.vault-operator-queue.SC-03h,g10adm.vault-operator-queue.SC-xu5,g10adm.vault-operator-queue.SC-wqo,g10adm.vault-operator-queue.SC-q6y,g10adm.vault-operator-queue.SC-wjv,g10adm.vault-operator-queue.SC-cgu,g10adm.vault-operator-queue.SC-jcc -->
### g10adm.vault-operator-queue.US10-TC8: Opening a walk-in emails nothing

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* `<walk-in email>` is a mailbox the tester reads, with no account behind it.

**Steps:**

1. Open a walk-in for `<walk-in email>` with one photograph.
2. After 5 minutes, read the inbox and the draft's page.

**Expected Results:**

* The inbox holds no message about the case: no case, no reference, no sign-in link.
* The draft's page shows no message owed or parked.

<!-- trace:case id=g10adm.vault-operator-queue.TC-rae rev=2 covers=g10adm.vault-operator-queue.SC-vri,g10adm.vault-operator-queue.SC-mvr,g10adm.vault-operator-queue.SC-rkk,g10adm.vault-operator-queue.SC-9is,g10adm.vault-operator-queue.SC-8w3,g10adm.vault-operator-queue.SC-d45,g10adm.vault-operator-queue.SC-or8,g10adm.vault-operator-queue.SC-us4,g10adm.vault-operator-queue.SC-bsk,g10adm.vault-operator-queue.SC-icq,g10adm.vault-operator-queue.SC-03h,g10adm.vault-operator-queue.SC-xu5,g10adm.vault-operator-queue.SC-wqo,g10adm.vault-operator-queue.SC-q6y,g10adm.vault-operator-queue.SC-wjv,g10adm.vault-operator-queue.SC-cgu,g10adm.vault-operator-queue.SC-jcc -->
### g10adm.vault-operator-queue.US10-TC9: Photos on the walk-in form stop at ten and can be removed

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* Staff has the walk-in form open.

**Steps:**

1. Attach ten photographs, and look for a way to add another.
2. Remove one.

**Expected Results:**

* Step 1 shows the ten, reading 10 of 10, with no way to add another.
* Step 2 leaves nine, reading 9 of 10, and a way to add one returns.

<!-- trace:case id=g10adm.vault-operator-queue.TC-csn rev=1 covers=g10adm.vault-operator-queue.SC-vri,g10adm.vault-operator-queue.SC-mvr,g10adm.vault-operator-queue.SC-rkk,g10adm.vault-operator-queue.SC-9is,g10adm.vault-operator-queue.SC-8w3,g10adm.vault-operator-queue.SC-d45,g10adm.vault-operator-queue.SC-or8,g10adm.vault-operator-queue.SC-us4,g10adm.vault-operator-queue.SC-bsk,g10adm.vault-operator-queue.SC-icq,g10adm.vault-operator-queue.SC-03h,g10adm.vault-operator-queue.SC-xu5,g10adm.vault-operator-queue.SC-wqo,g10adm.vault-operator-queue.SC-q6y,g10adm.vault-operator-queue.SC-wjv,g10adm.vault-operator-queue.SC-cgu,g10adm.vault-operator-queue.SC-jcc -->
### g10adm.vault-operator-queue.US10-TC10: A title or description the intake refuses reads beside its field

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* Staff has the walk-in form filled in validly, with one photograph, but for `<field>`.

**Test data:**

| `<field>` | `<entered>` |
| --- | --- |
| Title | 201 characters |
| Description | 2,001 characters |

**Steps:**

1. Enter `<entered>` in `<field>`, and try to click Open case.

**Expected Results:**

* Open case stays disabled, the refusal in words beside `<field>`; the rest of the form keeps what was typed, and no draft opens.

<!-- trace:case id=g10adm.vault-operator-queue.TC-uzm rev=1 covers=g10adm.vault-operator-queue.SC-vri,g10adm.vault-operator-queue.SC-mvr,g10adm.vault-operator-queue.SC-rkk,g10adm.vault-operator-queue.SC-9is,g10adm.vault-operator-queue.SC-8w3,g10adm.vault-operator-queue.SC-d45,g10adm.vault-operator-queue.SC-or8,g10adm.vault-operator-queue.SC-us4,g10adm.vault-operator-queue.SC-bsk,g10adm.vault-operator-queue.SC-icq,g10adm.vault-operator-queue.SC-03h,g10adm.vault-operator-queue.SC-xu5,g10adm.vault-operator-queue.SC-wqo,g10adm.vault-operator-queue.SC-q6y,g10adm.vault-operator-queue.SC-wjv,g10adm.vault-operator-queue.SC-cgu,g10adm.vault-operator-queue.SC-jcc -->
### g10adm.vault-operator-queue.US10-TC11: Opening holds the form and opens one draft

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Walk-in intake

**Pre-conditions:**

* Staff has the walk-in form filled in validly for `<walk-in email>`, no account behind it, and the open is held pending by a slowed response.

**Steps:**

1. Click Open case, and again while it is pending.
2. Let the response land, and open the Drafts view.

**Expected Results:**

* Step 1 shows Open case pending and the form held, and the second click sends nothing.
* Step 2 lists one draft for `<walk-in email>`.

<!-- trace:case id=g10adm.vault-operator-queue.TC-vgy rev=1 covers=g10adm.vault-operator-queue.SC-vri,g10adm.vault-operator-queue.SC-mvr,g10adm.vault-operator-queue.SC-rkk,g10adm.vault-operator-queue.SC-9is,g10adm.vault-operator-queue.SC-8w3,g10adm.vault-operator-queue.SC-d45,g10adm.vault-operator-queue.SC-or8,g10adm.vault-operator-queue.SC-us4,g10adm.vault-operator-queue.SC-bsk,g10adm.vault-operator-queue.SC-icq,g10adm.vault-operator-queue.SC-03h,g10adm.vault-operator-queue.SC-xu5,g10adm.vault-operator-queue.SC-wqo,g10adm.vault-operator-queue.SC-q6y,g10adm.vault-operator-queue.SC-wjv,g10adm.vault-operator-queue.SC-cgu,g10adm.vault-operator-queue.SC-jcc -->
### g10adm.vault-operator-queue.US10-TC12: Only an operate holder can open a walk-in

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* `<actor>` is on `<queue>`, or sends the walk-in open directly where it is not offered.

**Test data:**

| `<actor>` | `<offered>` | `<direct open>` |
| --- | --- | --- |
| admin(holds `vault:operate`) | Open a walk-in | opens the draft |
| admin(admin) | Open a walk-in | opens the draft |
| admin(holds `vault:read` and `vault:payout`) | no Open a walk-in | refused, naming the grant |
| a signed-in collector | no console | refused |
| signed out | the console's sign-in | refused |

**Steps:**

1. Read the queue's header.
2. Send a walk-in open for a fresh address with one photograph.

**Expected Results:**

* Step 1 shows `<offered>`.
* Step 2 is `<direct open>`; a refusal opens no draft and creates no account.

<!-- trace:case id=g10adm.vault-operator-queue.TC-50a rev=1 covers=g10adm.vault-operator-queue.SC-vri,g10adm.vault-operator-queue.SC-mvr,g10adm.vault-operator-queue.SC-rkk,g10adm.vault-operator-queue.SC-9is,g10adm.vault-operator-queue.SC-8w3,g10adm.vault-operator-queue.SC-d45,g10adm.vault-operator-queue.SC-or8,g10adm.vault-operator-queue.SC-us4,g10adm.vault-operator-queue.SC-bsk,g10adm.vault-operator-queue.SC-icq,g10adm.vault-operator-queue.SC-03h,g10adm.vault-operator-queue.SC-xu5,g10adm.vault-operator-queue.SC-wqo,g10adm.vault-operator-queue.SC-q6y,g10adm.vault-operator-queue.SC-wjv,g10adm.vault-operator-queue.SC-cgu,g10adm.vault-operator-queue.SC-jcc -->
### g10adm.vault-operator-queue.US10-TC13: A walk-in opens with no photograph, and its send still needs one

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* No account answers to `<walk-in email>`, a mailbox the tester reads.

**Steps:**

1. Open a walk-in for `<walk-in email>`, category Trading card, title Charizard PSA 10 and no photograph.
2. As the customer, signed in at `<walk-in email>`, open the draft and send it.

**Expected Results:**

* Step 1 opens the draft; the form asked for no contact number.
* Step 2 is refused until the draft holds a photograph.

<!-- trace:case id=g10adm.vault-operator-queue.TC-l20 rev=1 covers=g10adm.vault-operator-queue.SC-vri,g10adm.vault-operator-queue.SC-mvr,g10adm.vault-operator-queue.SC-rkk,g10adm.vault-operator-queue.SC-9is,g10adm.vault-operator-queue.SC-8w3,g10adm.vault-operator-queue.SC-d45,g10adm.vault-operator-queue.SC-or8,g10adm.vault-operator-queue.SC-us4,g10adm.vault-operator-queue.SC-bsk,g10adm.vault-operator-queue.SC-icq,g10adm.vault-operator-queue.SC-03h,g10adm.vault-operator-queue.SC-xu5,g10adm.vault-operator-queue.SC-wqo,g10adm.vault-operator-queue.SC-q6y,g10adm.vault-operator-queue.SC-wjv,g10adm.vault-operator-queue.SC-cgu,g10adm.vault-operator-queue.SC-jcc -->
### g10adm.vault-operator-queue.US10-TC15: An address that is not an email address is refused beside its field once left

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* Staff has the walk-in form filled in validly but for the email, with one photograph; no account exists for walkin.fixed+`<run id>`@example.com.

**Test data:**

| `<typed>` | `<left by>` |
| --- | --- |
| mei.chan@example | pressing Tab |
| walkin.example.com | pressing Tab |
| @example.com | clicking the Title field |
| walkin@ | pressing Tab |

**Steps:**

1. Click in the email field and press Tab, leaving it empty.
2. Type `<typed>` a character at a time, and leave the field by `<left by>`.
3. Try to click Open case.
4. Type walkin.fixed+`<run id>`@example.com over it, staying in the field, and click Open case.

**Expected Results:**

* Step 1 shows no refusal, Open case disabled.
* Step 2 shows no refusal while typing; once left, beside the email field, that it is not an email address, and none in the footer; the rest of the form keeps what was typed.
* Step 3 finds Open case disabled; no draft opens.
* Step 4 clears the refusal once the address is whole, and opens the draft on its own page.

<!-- trace:case id=g10adm.vault-operator-queue.TC-i6v rev=1 covers=g10adm.vault-operator-queue.SC-vri,g10adm.vault-operator-queue.SC-mvr,g10adm.vault-operator-queue.SC-rkk,g10adm.vault-operator-queue.SC-9is,g10adm.vault-operator-queue.SC-8w3,g10adm.vault-operator-queue.SC-d45,g10adm.vault-operator-queue.SC-or8,g10adm.vault-operator-queue.SC-us4,g10adm.vault-operator-queue.SC-bsk,g10adm.vault-operator-queue.SC-icq,g10adm.vault-operator-queue.SC-03h,g10adm.vault-operator-queue.SC-xu5,g10adm.vault-operator-queue.SC-wqo,g10adm.vault-operator-queue.SC-q6y,g10adm.vault-operator-queue.SC-wjv,g10adm.vault-operator-queue.SC-cgu,g10adm.vault-operator-queue.SC-jcc -->
### g10adm.vault-operator-queue.US10-TC16: A loan that is not more than zero is refused beside its field

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* Staff has the walk-in form filled in validly for walkin.zero+`<run id>`@example.com, with one photograph, a loan chosen and the loan field empty.

**Test data:**

| `<typed>` | `<refusal>` |
| --- | --- |
| 0 | A loan is more than zero. Ask the customer how much, or choose Storage only., once the field is left |
| 0.00 | Not an amount in HKD. at 0., then A loan is more than zero. Ask the customer how much, or choose Storage only., once the field is left |
| -1 | An amount, not a debit., as it is typed |
| 0.004 | At most 2 decimals in HKD., as it is typed |

**Steps:**

1. Type `<typed>` a character at a time, and leave the field by clicking the Title field.
2. Try to click Open case.
3. Type 0.01 over it, staying in the field, and click Open case.

**Expected Results:**

* Step 1 shows `<refusal>` beside the loan field, and none in the footer; the rest of the form keeps what was typed.
* Step 2 finds Open case disabled; nothing is sent and no draft opens.
* Step 3 clears the refusal once 0.01 is whole, and opens the draft financed, asking HKD 0.01.

<!-- trace:case id=g10adm.vault-operator-queue.TC-89x rev=1 covers=g10adm.vault-operator-queue.SC-vri,g10adm.vault-operator-queue.SC-mvr,g10adm.vault-operator-queue.SC-rkk,g10adm.vault-operator-queue.SC-9is,g10adm.vault-operator-queue.SC-8w3,g10adm.vault-operator-queue.SC-d45,g10adm.vault-operator-queue.SC-or8,g10adm.vault-operator-queue.SC-us4,g10adm.vault-operator-queue.SC-bsk,g10adm.vault-operator-queue.SC-icq,g10adm.vault-operator-queue.SC-03h,g10adm.vault-operator-queue.SC-xu5,g10adm.vault-operator-queue.SC-wqo,g10adm.vault-operator-queue.SC-q6y,g10adm.vault-operator-queue.SC-wjv,g10adm.vault-operator-queue.SC-cgu,g10adm.vault-operator-queue.SC-jcc -->
### g10adm.vault-operator-queue.US10-TC17: Choosing Storage only sets a refused loan of zero aside

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* Staff has the walk-in form filled in validly for walkin.storage+`<run id>`@example.com, with one photograph, a loan chosen and 0 left in the loan field, refused beside it.

**Steps:**

1. Choose Storage only.
2. Choose the loan again, click in the loan field, then click the Title field.
3. Choose Storage only again, and click Open case.

**Expected Results:**

* Step 1 hides the loan field and its refusal; Open case becomes available.
* Step 2 shows 0.00 with no refusal until the field is left, then the refusal again.
* Step 3 opens the draft on its own page, storage only, asking no loan.

<!-- trace:case id=g10adm.vault-operator-queue.TC-f40 rev=1 -->
### g10adm.vault-operator-queue.US10-TC19: A photograph staff attach lands on their unsent draft and is refused on a sent request

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* A collector sent a request; staff opened an unsent draft for another customer.

**Steps:**

1. Attach a photograph to each.

**Expected Results:**

* The sent request refuses it by name and is unchanged; the draft takes it.

---

## g10adm.vault-operator-queue.US11: Operator reads whose case it is by name

**As a** member of shop staff,
**I want** the queue and the held items to name each case's collector,
**so that** I can greet the customer and tell two customers' cases apart
without opening each one.

<!-- trace:case id=g10adm.vault-operator-queue.TC-bv9 rev=1 covers=g10adm.vault-operator-queue.SC-lnp,g10adm.vault-operator-queue.SC-e22,g10adm.vault-operator-queue.SC-msu,g10adm.vault-operator-queue.SC-00c,g10adm.vault-operator-queue.SC-t8q -->
### g10adm.vault-operator-queue.US11-TC1: Queue and held-item rows name each case's collector

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-11

**Pre-conditions:**

* Staff is on `<queue>`; Chan Tai Man holds two cases in `<list>`, Lee Ka Yan one.

**Test data:**

| `<list>` |
| --- |
| the Needs staff view |
| Held items |

**Steps:**

1. Open `<list>`, and read the collector on each row.

**Expected Results:**

* Chan Tai Man's two rows read Chan Tai Man, Lee Ka Yan's reads Lee Ka Yan, a link beside each name opening that collector's page; the rest of each row reads as before.

<!-- trace:case id=g10adm.vault-operator-queue.TC-per rev=1 covers=g10adm.vault-operator-queue.SC-lnp,g10adm.vault-operator-queue.SC-e22,g10adm.vault-operator-queue.SC-msu,g10adm.vault-operator-queue.SC-00c,g10adm.vault-operator-queue.SC-t8q -->
### g10adm.vault-operator-queue.US11-TC2: An account the walk-in created reads by its email handle until the customer names themselves

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-11

**Pre-conditions:**

* A walk-in draft sits under an account the walk-in created for mei.ling.walkin@example.com, nobody signed in to it.

**Steps:**

1. Read the draft's collector in the Drafts view.
2. Rename the account Ho Mei Ling, and reload the Drafts view.

**Expected Results:**

* Step 1 reads mei.ling.walkin.
* Step 2 reads Ho Mei Ling, with no change made on the case.

<!-- trace:case id=g10adm.vault-operator-queue.TC-p86 rev=1 covers=g10adm.vault-operator-queue.SC-lnp,g10adm.vault-operator-queue.SC-e22,g10adm.vault-operator-queue.SC-msu,g10adm.vault-operator-queue.SC-00c,g10adm.vault-operator-queue.SC-t8q -->
### g10adm.vault-operator-queue.US11-TC3: A name the account service cannot answer reads as unavailable and the list stands

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-11

**Pre-conditions:**

* Needs staff holds cases of several collectors; the account service fails to answer names.

**Steps:**

1. Open Needs staff and Held items.
2. Click the short id on one row, then Every collector.

**Expected Results:**

* Every row's collector reads the account's short id and "name unavailable"; every other field reads as with names answered, and both lists load in full.
* Step 2 narrows the list to that collector, and Every collector lists them all again.

<!-- trace:case id=g10adm.vault-operator-queue.TC-kx8 rev=1 covers=g10adm.vault-operator-queue.SC-lnp,g10adm.vault-operator-queue.SC-e22,g10adm.vault-operator-queue.SC-msu,g10adm.vault-operator-queue.SC-00c,g10adm.vault-operator-queue.SC-t8q -->
### g10adm.vault-operator-queue.US11-TC4: A reader without the identity grant sees no collector column

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-11

**Pre-conditions:**

* A treasurer is on `<queue>`, with cases of several collectors in Needs staff and Held items.

**Steps:**

1. Open Needs staff and Held items.

**Expected Results:**

* Neither list carries a collector column, a name or a name link, nor carries a name in what it reads; every other field reads as before.

<!-- trace:case id=g10adm.vault-operator-queue.TC-2pj rev=1 covers=g10adm.vault-operator-queue.SC-lnp,g10adm.vault-operator-queue.SC-e22,g10adm.vault-operator-queue.SC-msu,g10adm.vault-operator-queue.SC-00c,g10adm.vault-operator-queue.SC-t8q -->
### g10adm.vault-operator-queue.US11-TC6: The overdue rows keep the reference and the contact, with no name

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-11

**Pre-conditions:**

* A named collector's live loan is past its due date.

**Steps:**

1. Open the Overdue view.

**Expected Results:**

* The row names the case reference, the item and the contact the case holds, and no collector.

<!-- trace:case id=g10adm.vault-operator-queue.TC-zfg rev=1 covers=g10adm.vault-operator-queue.SC-lnp,g10adm.vault-operator-queue.SC-e22,g10adm.vault-operator-queue.SC-msu,g10adm.vault-operator-queue.SC-00c,g10adm.vault-operator-queue.SC-t8q -->
### g10adm.vault-operator-queue.US11-TC7: A list that names collectors is recorded without the names

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-11

**Pre-conditions:**

* Needs staff holds cases of two named collectors.

**Steps:**

1. Open Needs staff; as an auditor, read the operator's audit entries since.

**Expected Results:**

* One entry records who read the names, when, and both collectors' ids; neither name nor email appears in any column of it.

---

## g10adm.vault-operator-queue.US12: Operator narrows the queue to one collector's cases

**As a** member of shop staff,
**I want** a collector's name to narrow the queue and the held items to that
collector,
**so that** I can see everything one customer has with us without being able
to search the customer list by name.

<!-- trace:case id=g10adm.vault-operator-queue.TC-bpi rev=1 covers=g10adm.vault-operator-queue.SC-tjf,g10adm.vault-operator-queue.SC-8mz,g10adm.vault-operator-queue.SC-q78,g10adm.vault-operator-queue.SC-z5x,g10adm.vault-operator-queue.SC-gij,g10adm.vault-operator-queue.SC-xda -->
### g10adm.vault-operator-queue.US12-TC1: A collector's name narrows the list to that collector, and clearing it lists them all

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-12

**Pre-conditions:**

* Chan Tai Man holds two cases in `<list>`; two other collectors hold one each.

**Test data:**

| `<list>` |
| --- |
| the Needs staff view |
| Held items |

**Steps:**

1. Open `<list>`, click Chan Tai Man on one row, and read the list and the address.
2. Clear the collector.

**Expected Results:**

* Step 1 lists only Chan Tai Man's two rows, the name above them and a count of 2; the address carries the collector's user id.
* Step 2 lists all four rows, the address no longer carrying the collector.

<!-- trace:case id=g10adm.vault-operator-queue.TC-myy rev=1 covers=g10adm.vault-operator-queue.SC-tjf,g10adm.vault-operator-queue.SC-8mz,g10adm.vault-operator-queue.SC-q78,g10adm.vault-operator-queue.SC-z5x,g10adm.vault-operator-queue.SC-gij,g10adm.vault-operator-queue.SC-xda -->
### g10adm.vault-operator-queue.US12-TC2: A narrowed address opened afresh narrows the same way

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-12

**Pre-conditions:**

* Collector A holds two cases in Needs staff; staff holds `<queue>`?queue=waiting&collector=`<collector A user id>`.

**Steps:**

1. Open that address in a new tab.

**Expected Results:**

* It lists only collector A's two rows, their name above and a count of 2.

<!-- trace:case id=g10adm.vault-operator-queue.TC-ucj rev=1 covers=g10adm.vault-operator-queue.SC-tjf,g10adm.vault-operator-queue.SC-8mz,g10adm.vault-operator-queue.SC-q78,g10adm.vault-operator-queue.SC-z5x,g10adm.vault-operator-queue.SC-gij,g10adm.vault-operator-queue.SC-xda -->
### g10adm.vault-operator-queue.US12-TC3: A collector with nothing in the narrowed list reads none

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-12

**Pre-conditions:**

* Collector C holds one submitted case and no item in the vault.

**Steps:**

1. Click collector C's name in Needs staff, then open Held items.

**Expected Results:**

* Held items says the collector holds no case in this list, their name above and its count none; clearing the collector is still offered.

<!-- trace:case id=g10adm.vault-operator-queue.TC-c0i rev=1 covers=g10adm.vault-operator-queue.SC-tjf,g10adm.vault-operator-queue.SC-8mz,g10adm.vault-operator-queue.SC-q78,g10adm.vault-operator-queue.SC-z5x,g10adm.vault-operator-queue.SC-gij,g10adm.vault-operator-queue.SC-xda -->
### g10adm.vault-operator-queue.US12-TC4: The queue offers no way to find a collector by name

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-12

**Pre-conditions:**

* Chan Tai Man holds a case in Needs staff.

**Steps:**

1. Look for a field taking a collector or a name on the queue and Held items.
2. Search for Chan Tai Man.

**Expected Results:**

* Step 1 finds none.
* Step 2 finds no case.

<!-- trace:case id=g10adm.vault-operator-queue.TC-mil rev=1 covers=g10adm.vault-operator-queue.SC-tjf,g10adm.vault-operator-queue.SC-8mz,g10adm.vault-operator-queue.SC-q78,g10adm.vault-operator-queue.SC-z5x,g10adm.vault-operator-queue.SC-gij,g10adm.vault-operator-queue.SC-xda -->
### g10adm.vault-operator-queue.US12-TC5: Reading one collector's cases is recorded with their id alone

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-12

**Pre-conditions:**

* Collector A holds a case in Needs staff.

**Steps:**

1. Click collector A's name; as an auditor, read the operator's audit entries since.

**Expected Results:**

* One entry records who read collector A's cases, when, and collector A's id; no name or email appears in any column.

<!-- trace:case id=g10adm.vault-operator-queue.TC-f1e rev=1 covers=g10adm.vault-operator-queue.SC-tjf,g10adm.vault-operator-queue.SC-8mz,g10adm.vault-operator-queue.SC-q78,g10adm.vault-operator-queue.SC-z5x,g10adm.vault-operator-queue.SC-gij,g10adm.vault-operator-queue.SC-xda -->
### g10adm.vault-operator-queue.US12-TC6: An address narrowed to nobody reads as a collector holding no case

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
* **Trace:** grade10-admin-vault-operator-queue-US-12

**Pre-conditions:**

* Staff is signed in to the console.

**Test data:**

| `<collector>` |
| --- |
| a well-formed user id no account holds |
| not-a-user-id |

**Steps:**

1. Open `<queue>`?collector=`<collector>`, and each view in turn.

**Expected Results:**

* Every view says the collector holds no case in it, every count reading none.

<!-- trace:case id=g10adm.vault-operator-queue.TC-32a rev=1 covers=g10adm.vault-operator-queue.SC-tjf,g10adm.vault-operator-queue.SC-8mz,g10adm.vault-operator-queue.SC-q78,g10adm.vault-operator-queue.SC-z5x,g10adm.vault-operator-queue.SC-gij,g10adm.vault-operator-queue.SC-xda -->
### g10adm.vault-operator-queue.US12-TC7: The Overdue view and search stay whole while the queue is narrowed

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-12

**Pre-conditions:**

* `<queue>` is narrowed to collector A; loans of collectors A and B are both past due.

**Steps:**

1. Open the Overdue view.
2. Search for collector B's phone number.

**Expected Results:**

* Step 1 lists both overdue loans, no row naming a collector.
* Step 2 finds collector B's case, naming no collector.

---

## g10adm.vault-operator-queue.US20: Operator takes in a slab the register already knows

**As a** member of shop staff opening a case for a walk-in,
**I want** to type the slab's grader and cert and have the case take the item
the register already knows, its facts filled in,
**so that** one slab never has two records and nobody types its facts twice.

<!-- trace:case id=g10adm.vault-operator-queue.TC-pf9 rev=1 covers=g10adm.vault-operator-queue.SC-knz,g10adm.vault-operator-queue.SC-s8n,g10adm.vault-operator-queue.SC-z22,g10adm.vault-operator-queue.SC-nyo,g10adm.vault-operator-queue.SC-5z0,g10adm.vault-operator-queue.SC-qjf,g10adm.vault-operator-queue.SC-jor -->
### g10adm.vault-operator-queue.US20-TC1: A slab the register knows is taken by the case, never registered twice

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-20

**Pre-conditions:**

* A live item carries PSA, grade 10 and cert 12345678, owned by the customer and marked by no case; `<case>`.

**Test data:**

| `<case>` | `<named>` |
| --- | --- |
| a walk-in at the counter | PSA and ` 12345678 ` typed on the walk-in form, then the draft opened |
| a submitted case naming no slab, its collector having asked about "Charizard card" | PSA, 10 and 12345678 given as its valuation starts |

**Steps:**

1. Name the slab: `<named>`.
2. Read the case's Case tab.

**Expected Results:**

* On the walk-in form, it says it is looking the slab up, then shows the register's facts read-only, filling the category and title from them.
* The case takes the register's item, no second item registered; the Case tab reads its facts, and a collector's request stays as they sent it.

<!-- trace:case id=g10adm.vault-operator-queue.TC-s3l rev=1 covers=g10adm.vault-operator-queue.SC-knz,g10adm.vault-operator-queue.SC-s8n,g10adm.vault-operator-queue.SC-z22,g10adm.vault-operator-queue.SC-nyo,g10adm.vault-operator-queue.SC-5z0,g10adm.vault-operator-queue.SC-qjf,g10adm.vault-operator-queue.SC-jor -->
### g10adm.vault-operator-queue.US20-TC2: A slab the register holds no live item for is registered when the valuation starts

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
* **Trace:** grade10-admin-vault-operator-queue-US-20

**Pre-conditions:**

* `<register>`.

**Test data:**

| `<register>` | `<form reads>` |
| --- | --- |
| no item carries PSA and 87654321 | nothing filled |
| a retired item carries PSA and 87654321, and no live one | the slab as retired |

**Steps:**

1. Type PSA, grade 9 and 87654321 on the walk-in form.
2. Open the draft; later, start its valuation.
3. On another walk-in, give PSA and a cert with no grade, and open it.

**Expected Results:**

* Step 1 reads `<form reads>`.
* Step 2 registers a new item carrying PSA, 9 and 87654321.
* Step 3 is refused, naming the grade.

<!-- trace:case id=g10adm.vault-operator-queue.TC-bcc rev=1 covers=g10adm.vault-operator-queue.SC-knz,g10adm.vault-operator-queue.SC-s8n,g10adm.vault-operator-queue.SC-z22,g10adm.vault-operator-queue.SC-nyo,g10adm.vault-operator-queue.SC-5z0,g10adm.vault-operator-queue.SC-qjf,g10adm.vault-operator-queue.SC-jor -->
### g10adm.vault-operator-queue.US20-TC3: A known slab owned by someone else is taken, naming its owner as the grant allows

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-20

**Pre-conditions:**

* A live item carries PSA and 12345678, owned by another account and marked by no case; `<operator>` has the walk-in form open.

**Test data:**

| `<operator>` | `<owner reads>` |
| --- | --- |
| staff holding `kyc:read` | the owner's name, the read recorded on the audit trail |
| staff without `kyc:read` | the owner's short id |

**Steps:**

1. Type PSA and 12345678.
2. Open the draft, and try Prepare documents.

**Expected Results:**

* Step 1 shows the item naming `<owner reads>`, filling nothing.
* Step 2 takes the item; Prepare documents is refused until the owners match.

<!-- trace:case id=g10adm.vault-operator-queue.TC-oac rev=1 covers=g10adm.vault-operator-queue.SC-knz,g10adm.vault-operator-queue.SC-s8n,g10adm.vault-operator-queue.SC-z22,g10adm.vault-operator-queue.SC-nyo,g10adm.vault-operator-queue.SC-5z0,g10adm.vault-operator-queue.SC-qjf,g10adm.vault-operator-queue.SC-jor -->
### g10adm.vault-operator-queue.US20-TC4: A slab another case marks refuses the walk-in

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-20

**Pre-conditions:**

* A live item carries PSA and 12345678, marked for case K7P2QX.

**Steps:**

1. Open a walk-in's draft naming PSA and 12345678.

**Expected Results:**

* It is refused, naming and linking K7P2QX; no case is opened.

<!-- trace:case id=g10adm.vault-operator-queue.TC-ba3 rev=1 covers=g10adm.vault-operator-queue.SC-knz,g10adm.vault-operator-queue.SC-s8n,g10adm.vault-operator-queue.SC-z22,g10adm.vault-operator-queue.SC-nyo,g10adm.vault-operator-queue.SC-5z0,g10adm.vault-operator-queue.SC-qjf,g10adm.vault-operator-queue.SC-jor -->
### g10adm.vault-operator-queue.US20-TC6: A lookup that cannot reach the register keeps the form

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-20

**Pre-conditions:**

* The register does not answer.

**Steps:**

1. Type a grader and cert on the walk-in form.

**Expected Results:**

* The form shows an error with a retry, and keeps everything typed.

---

## g10adm.vault-operator-queue.US21: Operator reads and corrects the item's facts on the case

**As a** member of shop staff working a case,
**I want** the Case tab to show the register's category, title, description,
grader, grade and cert, editable once the register has the item, with the
collector's request kept as they sent it, and to show registration pending
until it does,
**so that** the case and the register never tell two stories about one item.

<!-- trace:case id=g10adm.vault-operator-queue.TC-yfe rev=1 covers=g10adm.vault-operator-queue.SC-pfx,g10adm.vault-operator-queue.SC-54k,g10adm.vault-operator-queue.SC-2vm,g10adm.vault-operator-queue.SC-ned,g10adm.vault-operator-queue.SC-0bj -->
### g10adm.vault-operator-queue.US21-TC1: The Case tab says the item is registered when the valuation starts

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-21

**Pre-conditions:**

* A case is submitted, nobody having started its valuation.

**Steps:**

1. Read the item's facts section on its Case tab.

**Expected Results:**

* It says the item is registered when the valuation starts.

<!-- trace:case id=g10adm.vault-operator-queue.TC-etq rev=1 covers=g10adm.vault-operator-queue.SC-pfx,g10adm.vault-operator-queue.SC-54k,g10adm.vault-operator-queue.SC-2vm,g10adm.vault-operator-queue.SC-ned,g10adm.vault-operator-queue.SC-0bj -->
### g10adm.vault-operator-queue.US21-TC2: The Case tab shows the register's facts, and corrects them through the register

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-21

**Pre-conditions:**

* A case whose collector asked about "Charizard card" is registered as "Charizard 1999 Base Set", PSA, 10, cert 12345678; staff holds `inventory:write`.

**Steps:**

1. Read the item's facts section on its Case tab.
2. Choose Edit, and correct the cert.

**Expected Results:**

* Step 1 shows the register's category, title, description, PSA, 10 and 12345678, linking the item; the collector's request still reads "Charizard card".
* Step 2 opens the register's edit, and the section shows the corrected cert once it lands.

<!-- trace:case id=g10adm.vault-operator-queue.TC-z8m rev=1 covers=g10adm.vault-operator-queue.SC-pfx,g10adm.vault-operator-queue.SC-54k,g10adm.vault-operator-queue.SC-2vm,g10adm.vault-operator-queue.SC-ned,g10adm.vault-operator-queue.SC-0bj -->
### g10adm.vault-operator-queue.US21-TC3: Without the register's grant the facts section withholds what it cannot offer

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-21

**Pre-conditions:**

* A case is registered; `<operator>` opens its Case tab.

**Test data:**

| `<operator>` | `<section reads>` |
| --- | --- |
| staff holding `vault:read`, not `inventory:write` | the facts with no Edit, an edit sent anyway refused by name |
| a treasurer, holding no inventory grant | `inventory:read` named, no facts shown |

**Steps:**

1. Read the item's facts section.

**Expected Results:**

* It reads `<section reads>`; the rest of the tab stands.

<!-- trace:case id=g10adm.vault-operator-queue.TC-wo3 rev=1 covers=g10adm.vault-operator-queue.SC-pfx,g10adm.vault-operator-queue.SC-54k,g10adm.vault-operator-queue.SC-2vm,g10adm.vault-operator-queue.SC-ned,g10adm.vault-operator-queue.SC-0bj -->
### g10adm.vault-operator-queue.US21-TC4: A register that cannot be read fails the facts section alone

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-21

**Pre-conditions:**

* A case is registered; the register does not answer.

**Steps:**

1. Open its Case tab.

**Expected Results:**

* The item's facts section shows its own error with a retry; the case's acts and timeline stand.

---

## g10adm.vault-operator-queue.US23: Operator checks the forfeiture notice before it goes

**As a** member of shop staff,
**I want** sending the forfeiture notice to ask me first, naming the address it
goes to and the date to pay by it sets,
**so that** a legal deadline never starts on a misplaced press, and I know who
will read it.

<!-- trace:case id=g10adm.vault-operator-queue.TC-9xk rev=1 covers=g10adm.vault-operator-queue.SC-5hv,g10adm.vault-operator-queue.SC-1bh,g10adm.vault-operator-queue.SC-o3p,g10adm.vault-operator-queue.SC-jnl -->
### g10adm.vault-operator-queue.US23-TC1: The notice confirm names who is emailed and the brand's date to pay by, and confirming sends it

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-23

**Pre-conditions:**

* The brand gives a 14-day notice period, on Hong Kong's calendar; a live loan past its due date holds no notice, `<case>`.

**Test data:**

| `<case>` | `<pressed at>` | `<confirm names>` |
| --- | --- | --- |
| holding collector@example.com | 10:00 on 1 December, Hong Kong | collector@example.com, and 15 December 2026 |
| kept at a shop on Tokyo's zone | 23:30 on 1 December Hong Kong, 00:30 on 2 December Tokyo | 15 December 2026, never 16 |
| holding no email address | 10:00 on 1 December, Hong Kong | that nobody is emailed, no address, and 15 December 2026 |

**Steps:**

1. Press Send forfeiture notice at `<pressed at>`.
2. Confirm it.

**Expected Results:**

* Step 1 opens a confirm in the destructive tone naming `<confirm names>` as the date to pay by; nothing is sent yet.
* Step 2 closes it; the case carries a notice naming that date, the collector is sent it where an address is held, and the header reads pay by that date.

<!-- trace:case id=g10adm.vault-operator-queue.TC-92p rev=1 covers=g10adm.vault-operator-queue.SC-wro -->
### g10adm.vault-operator-queue.US23-TC3: Dismissing the notice confirm sends nothing and starts no deadline

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-23

**Pre-conditions:**

* The Send forfeiture notice confirm is open.

**Steps:**

1. Dismiss it.

**Expected Results:**

* No notice is recorded and no message is sent; the Custody tab still offers the notice beside the reason no written notice has been sent.

<!-- trace:case id=g10adm.vault-operator-queue.TC-0cq rev=1 covers=g10adm.vault-operator-queue.SC-mu0 -->
### g10adm.vault-operator-queue.US23-TC4: A day turning before the confirm names the later date to pay by

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-23

**Pre-conditions:**

* The brand gives a 14-day notice period; the confirm was opened at 23:59 on 1 December on its clock, naming 15 December 2026.

**Steps:**

1. Confirm it at 00:01 on 2 December.

**Expected Results:**

* The notice names 16 December 2026; no second confirm is asked.

<!-- trace:case id=g10adm.vault-operator-queue.TC-0ae rev=1 covers=g10adm.vault-operator-queue.SC-ekb -->
### g10adm.vault-operator-queue.US23-TC6: With no notice period the confirm says so, and holds the refusal

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-23

**Pre-conditions:**

* The brand gives no notice period; a live loan past its due date holds no notice.

**Steps:**

1. Press Send forfeiture notice, and confirm.

**Expected Results:**

* The confirm says no date to pay by can be named without a notice period; on confirming, the refusal shows in it, it stays open, and no notice is recorded.

<!-- trace:case id=g10adm.vault-operator-queue.TC-xek rev=1 covers=g10adm.vault-operator-queue.SC-kbm,g10adm.vault-operator-queue.SC-rtl -->
### g10adm.vault-operator-queue.US23-TC7: No confirm opens on a case the console cannot read afresh, or one already noticed

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-23

**Pre-conditions:**

* A live loan past its due date was opened holding no notice; since then, `<since>`.

**Test data:**

| `<since>` | `<tab reads>` |
| --- | --- |
| a notice naming 15 December 2026 was sent in another tab | the notice sent naming 15 December 2026, no longer offering the notice |
| the case or the brand's notice period cannot be read afresh | the failure beside Send forfeiture notice |

**Steps:**

1. Press Send forfeiture notice.

**Expected Results:**

* No confirm opens and no notice is recorded or sent; the Custody tab reads `<tab reads>`.

---

## g10adm.vault-operator-queue.US24: Operator reads how late a loan is from the case header

**As a** member of shop staff,
**I want** the case header to say how many days a live loan is past its due
date, and the date to pay by once a forfeiture notice stands,
**so that** I know where a late loan stands the moment I open its case,
without the money grant.

<!-- trace:case id=g10adm.vault-operator-queue.TC-2m8 rev=1 covers=g10adm.vault-operator-queue.SC-syo,g10adm.vault-operator-queue.SC-jhz,g10adm.vault-operator-queue.SC-9xn,g10adm.vault-operator-queue.SC-4es,g10adm.vault-operator-queue.SC-g7w -->
### g10adm.vault-operator-queue.US24-TC1: The header counts the days a live loan is past due on the brand's calendar, with no grace taken off

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-24

**Pre-conditions:**

* A live loan due on 30 November holds no forfeiture notice; the brand is on Hong Kong's zone, `<brand>`; it is `<read at>`.

**Test data:**

| `<brand>` | `<read at>` | `<header reads>` |
| --- | --- | --- |
| no grace days | 3 December | 3 days past due |
| no grace days | 00:30 on 1 December Hong Kong, still 30 November in UTC | 1 day past due |
| 3 grace days | 2 December | 2 days past due |

**Steps:**

1. Open the case.

**Expected Results:**

* The header reads `<header reads>` beside the status; no badge says the case waits on staff for being late.

<!-- trace:case id=g10adm.vault-operator-queue.TC-6aw rev=1 covers=g10adm.vault-operator-queue.SC-j1h,g10adm.vault-operator-queue.SC-b6w,g10adm.vault-operator-queue.SC-sn7 -->
### g10adm.vault-operator-queue.US24-TC2: Once a notice stands the header names its date to pay by, on the brand's day, even past it

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-24

**Pre-conditions:**

* A live loan due on 30 November was sent a forfeiture notice naming 15 December 2026, `<kept>`; it is `<read on>`.

**Test data:**

| `<kept>` | `<read on>` |
| --- | --- |
| at a shop on Hong Kong's zone | 5 December |
| at a shop on Hong Kong's zone | 16 December |
| at a shop on Tokyo's zone, where that day ends at 00:59 on 16 December | 5 December |

**Steps:**

1. Open the case.

**Expected Results:**

* The header reads pay by 15 Dec 2026 beside the status, no count of days, never 16 Dec.

<!-- trace:case id=g10adm.vault-operator-queue.TC-vc8 rev=1 covers=g10adm.vault-operator-queue.SC-fgo -->
### g10adm.vault-operator-queue.US24-TC3: Staff without the money grant read the clock

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-24

**Pre-conditions:**

* Staff, without `vault:payout`; a live loan is 3 days past its due date.

**Steps:**

1. Open the case.

**Expected Results:**

* The header reads 3 days past due; no Payouts tab is offered.

<!-- trace:case id=g10adm.vault-operator-queue.TC-5r8 rev=1 covers=g10adm.vault-operator-queue.SC-6jj -->
### g10adm.vault-operator-queue.US24-TC5: The header carries no clock on a case with no loan running late

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-24

**Pre-conditions:**

* `<case>`.

**Test data:**

| `<case>` |
| --- |
| a live loan due on 30 November, read at 23:00 on 30 November on the brand's calendar |
| a live loan due on 30 November at a shop on Tokyo's zone, read at 00:30 on 1 December Tokyo, 23:30 on 30 November Hong Kong |
| a storage case in the vault |
| a repaid loan whose due date has passed |
| a forfeited case |

**Steps:**

1. Open the case.

**Expected Results:**

* The header reads no clock beside the status.
