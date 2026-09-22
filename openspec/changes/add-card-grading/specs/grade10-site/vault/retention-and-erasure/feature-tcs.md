# grade10-site/vault/retention-and-erasure Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-22, tcs-rules r3.0

## grade10-site-vault-retention-and-erasure-US4: Collector who graded cards is forgotten by the same request

**As a** collector who has closed their account after grading cards,
**I want** the one erasure request to reach my submissions as it reaches my vault cases, refused by name while a submission is between booked and ready, an upcharge is unsettled or ready cards are uncollected, and otherwise keeping only the sealed documents and the photographs in the vault's classes and the submission record in a class of its own, each for the window the table names from the day the submission ended, and no identity record at all,
**so that** grading keeps nothing of mine the vault would not keep, and I ask once.

### grade10-site-vault-retention-and-erasure-US4-TC1-1: Ended submission's documents, photographs and record survive erasure

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-retention-and-erasure-US-04

**Pre-conditions:**

* `<submission_1>` reached `collected` with the classes it carries.
* The collector filed the account's erasure ask, its cancellation window passed uncancelled, and an admin ran grading's erasure for the account from the console.
* The account holds no open vault case.

**Test data:**

| Field | Value |
| --- | --- |
| `<submission_1>` | A submission collected with a signed submission agreement, intake receipt, hand-back receipt, hand-in and hand-back photograph pairs, and a submission record naming the collector's name, email, phone, postal address, the card list, the pickup code and the messages |

**Steps:**

1. Read `<submission_1>`'s retained data.

**Expected Results:**

* The submission agreement, intake receipt and hand-back receipt remain, held in the vault's agreements class, 2,555 days from `<submission_1>`'s collection date.
* The hand-in and hand-back photograph pairs remain, held in the vault's photos class, 2,555 days from the same date.
* The submission record remains as its own class, `<submission record window>` days from the same date, naming the collector's name, email, phone, postal address, the card list, the pickup code and the messages.
* No identity record exists for `<submission_1>`.

### grade10-site-vault-retention-and-erasure-US4-TC2-1: Submission record's retention window starts at the end event

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-retention-and-erasure-US-04

**Pre-conditions:**

* `<submission_2>` is active and not yet ended, carrying a submission record.

**Test data:**

| `<end event>` | Recorded window start |
| --- | --- |
| Collected | The collection date |
| Cancelled | The cancellation date |
| Expired | The plan's expiry date |
| Its last card paid out | The payout date |

**Steps:**

1. End `<submission_2>` by `<end event>`.
2. Read the window start recorded for its submission record.

**Expected Results:**

* Grade10 reads the window start as the row states.

### grade10-site-vault-retention-and-erasure-US4-TC3-1: Submission cancelled before hand-in keeps only its record

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-retention-and-erasure-US-04

**Pre-conditions:**

* `<submission_3>` was cancelled while `planned`, before any drop-off.
* The collector filed the account's erasure ask, its cancellation window passed uncancelled, and an admin ran grading's erasure for the account from the console.

**Test data:**

| Field | Value |
| --- | --- |
| `<submission_3>` | A submission cancelled from `planned`, before hand-in, with no submission agreement, receipt or photograph ever created, carrying a submission record |

**Steps:**

1. Read `<submission_3>`'s retained data.

**Expected Results:**

* No submission agreement, receipt or photograph is held for `<submission_3>`.
* Its submission record remains as its own class, `<submission record window>` days from the cancellation date.
* No identity record exists for `<submission_3>`.

### grade10-site-vault-retention-and-erasure-US4-TC4-1: Live grading submission refuses the erasure ask by name

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-vault-retention-and-erasure-US-04

**Pre-conditions:**

* customer(closed account) is signed in and on `<grade10 vault your data url>`.
* The account holds `<submission_4>` and no open vault case.

**Test data:**

| `<submission_4>` | Grading answers |
| --- | --- |
| `checked_in`, between booked and ready | Refuses the ask, naming `<submission_4>` |
| `ready`, with an unsettled upcharge | Refuses the ask, naming `<submission_4>` |
| `ready`, with cards uncollected | Refuses the ask, naming `<submission_4>` |

**Steps:**

1. File the erasure ask.
2. Read the ask's outcome and Your data's erasure line.

**Expected Results:**

* Grade10 answers as the row states.
* Nothing is erased for the account.

### grade10-site-vault-retention-and-erasure-US4-TC5-1: Live grading submission blocks an otherwise eligible vault erasure

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
* **Trace:** grade10-site-vault-retention-and-erasure-US-04

**Pre-conditions:**

* customer(closed account) is signed in and on `<grade10 vault your data url>`.
* The account holds `<submission_5>` and `<vault case_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<submission_5>` | A submission `sent`, between booked and ready |
| `<vault case_1>` | A closed, signed vault case past its own window, with nothing else blocking its erasure |

**Steps:**

1. File the erasure ask.
2. Read the ask's outcome for the account.

**Expected Results:**

* Grade10 refuses the whole ask, naming `<submission_5>`.
* `<vault case_1>`'s data is unchanged.
* Nothing is erased anywhere on the account.

## Settled

*None yet — suite pending review.*
