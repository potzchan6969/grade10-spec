# grade10-site/vault/retention-and-erasure Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-02, tcs-rules r4

## grade10-site-vault-retention-and-erasure-US1: Collector asks to be forgotten and the vault answers for its own data

**As a** collector who has closed their account,
**I want** the vault to delete what it holds about me,
**so that** nothing of mine is kept beyond the record of agreements I actually
signed.

### grade10-site-vault-retention-and-erasure-US1-TC5-2: A hold that opens after the ask is filed is read beside it

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-retention-and-erasure-US-01

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* The collector filed the ask to be forgotten on `<filing day>`, inside its window, with no case in flight.
* Since the filing, staff took `<case_1>`'s item into the vault.

**Steps:**

1. Ask for the collector's own read under their account.

**Expected Results:**

* Step 1 still reads the ask filed on `<filing day>`.
* Step 1 reads `<case_1>` beside it, by its reference, as an item in the vault.

### grade10-site-vault-retention-and-erasure-US1-TC6-2: Filing the ask while a case is in flight is refused by name

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-retention-and-erasure-US-01

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* The collector has filed no ask to be forgotten.
* `<case_1>`, the collector's one vault case, stands as the row says.

**Test data:**

| `<case_1>` stands | Named as |
| --- | --- |
| Sent in and not yet in the vault | A request in flight |
| Its item in the vault | An item in the vault |
| Its loan running | A loan running |

**Steps:**

1. File the ask to be forgotten under the collector's own account.
2. Ask for the collector's own read under their account.

**Expected Results:**

* Step 1 is refused by name, naming `<case_1>` by its reference and the row's Named as.
* Step 2 reads no ask filed, and `<case_1>` beside it as what holds the ask.

### grade10-site-vault-retention-and-erasure-US1-TC7-2: Filing stays refused though one of several cases already closed

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-retention-and-erasure-US-01

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* The collector has filed no ask to be forgotten.
* `<case_1>` was released; `<case_2>`'s item is in the vault.

**Steps:**

1. File the ask to be forgotten under the collector's own account.
2. Ask for the collector's own read under their account.

**Expected Results:**

* Step 1 is refused by name, naming `<case_2>` by its reference as an item in the vault, and not `<case_1>`.
* Step 2 reads no ask filed, and `<case_2>` alone beside it as what holds the ask.

---

## grade10-site-vault-retention-and-erasure-US4: Collector who graded cards is forgotten by the same request

**As a** collector who has closed their account after grading cards,
**I want** the one erasure request to reach my submissions as it reaches my vault cases, refused by name while a submission is between booked and ready, money is still due on one or ready cards are uncollected, and otherwise keeping only the sealed documents and the photographs in the vault's classes and the submission record in the vault's case records, each for the window the table names from the later of the day the submission ended and the day nothing is owed either way, and no identity record at all,
**so that** grading keeps nothing of mine the vault would not keep, and I ask once.

### grade10-site-vault-retention-and-erasure-US4-TC3-2: Submission cancelled before hand-in is purged with the account

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-retention-and-erasure-US-04

**Pre-conditions:**

* `<submission_3>` was cancelled while `planned`, before any drop-off: planned by the collector on `<grade10 grading url>` and cancelled from its own page.
* The account holds no open vault case.
* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.

**Test data:**

| Field | Value |
| --- | --- |
| `<submission_3>` | A submission cancelled from `planned`, before hand-in, with no submission agreement, receipt or photograph ever created, carrying a submission record |

**Steps:**

1. Read `<submission_3>`'s retained data and the window its record stands under.
2. As the collector, file the ask to be forgotten under their own account through the vault's API.
3. Age the request past its 7-day window, uncancelled.
4. As admin(holds user:delete), open the request's Checklist on `<grade10 admin erasure url>`.
5. Click Erase beside Grading.
6. Read `<submission_3>` again.

**Expected Results:**

* No submission agreement, receipt or photograph is held for `<submission_3>` at any point.
* Before the erasure its submission record stands as its own case-records class, 2,555 days from the cancellation date.
* `<submission_3>` refuses nothing: the erasure runs.
* After the erasure nothing of `<submission_3>` names the collector.
* No signing ceremony's personal data remains for `<submission_3>`.
* No identity record exists for `<submission_3>` at any point.

### grade10-site-vault-retention-and-erasure-US4-TC5-2: Live grading submission blocks an otherwise eligible vault erasure

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-retention-and-erasure-US-04

**Pre-conditions:**

* customer(closed account) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* The account holds `<submission_5>` and `<vault case_1>`, and has filed no ask.
* `<submission_5>` is seeded at `sent` through grading's dev seed, under the account's email and user id.
* admin(holds user:delete) is on `<grade10 admin erasure url>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<submission_5>` | A submission `sent`, between booked and ready |
| `<vault case_1>` | A closed, signed vault case past its own window, with nothing else blocking its erasure |

**Steps:**

1. File the ask to be forgotten under the account.
2. Ask for the account's own read under it.
3. Age the request past its 7-day window, uncancelled.
4. As admin, open the request's Checklist.
5. Click Erase beside Grading.
6. Read Grading's answer on the Checklist.

**Expected Results:**

* Step 1 files the request; no vault case holds it back.
* Step 2 reads the request filed, with no hold beside it.
* Step 6 refuses the erasure, naming `<submission_5>` and cards with the grader.
* `<submission_5>` and `<vault case_1>`'s data are unchanged.

### grade10-site-vault-retention-and-erasure-US4-TC8-1: The ask is withheld in the collector's own words while cards are with the grader

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-vault-retention-and-erasure-US-04

**Pre-conditions:**

* customer is signed in and on `<grade10 vault your data url>`.
* The account holds `<submission_8>` and no open vault case.
* `<submission_8>` is seeded at `sent` through grading's dev seed, under the account's email and user id.

**Test data:**

| Field | Value |
| --- | --- |
| `<submission_8>` | A submission `sent`, its cards with the grader |

**Steps:**

1. Scroll to the ask to be forgotten on Your data.
2. Read the ask's block.

**Expected Results:**

* The ask is withheld, in the collector's own words: cards of theirs are with the grader.
* The words name the cards, never a status word and never an internal hold.
* The block offers no control to file the ask, and the page files nothing while it reads this way.

### grade10-site-vault-retention-and-erasure-US4-TC10-1: The ask stays held while grading cannot say what stands in its way

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-retention-and-erasure-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/your-data.spec.ts`

**Pre-conditions:**

* customer(closed account) is signed in and on `<grade10 vault your data url>`.
* The account holds no open vault case and no open erasure request.
* Grading does not answer what stands in the way of the account's erasure.

**Steps:**

1. Open Your data.
2. Read the erasure block.

**Expected Results:**

* The page names that grading's holds could not be read.
* The ask is not offered, and nothing is filed.
* What the vault keeps stays on screen.

---

## grade10-site-vault-retention-and-erasure-US5: Collector reads what the vault keeps about them

**As a** collector,
**I want** one page that says what is kept, for how long, where my identity
stands, and where I ask to be forgotten,
**so that** I know what I am asking for before I ask.

### grade10-site-vault-retention-and-erasure-US5-TC1-2: The collector's own read under the account names every retention class with its window

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-retention-and-erasure-US-05

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* The collector holds at least one vault case, and has filed no ask to be forgotten.

**Test data:**

| Class | Window |
| --- | --- |
| Agreements | 2,555 days |
| Identity records | 1,825 days |
| Item photographs | 2,555 days |
| Case records | 2,555 days |

**Steps:**

1. Ask for the collector's own read under their account.
2. Read the retention classes and the ask in the API response.

**Expected Results:**

* Step 2 names each class in **Test data** with its window, read as days after the case ends.
* Step 2 reads no ask filed, and nothing holding one back.

### grade10-site-vault-retention-and-erasure-US5-TC2-1: Your data states that review deletes nothing by itself

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-retention-and-erasure-US-05

**Pre-conditions:**

* The collector is signed in on <vault your data url>, and one of their
  cases is already past its retention window.

**Steps:**

1. Navigate to <vault your data url>.

**Expected Results:**

* The reviewed-not-deleted line shows beside the retention table.
* The case past its window still lists its class and window unchanged.

### grade10-site-vault-retention-and-erasure-US5-TC3-2: The identity standing in the read never carries the name or the document

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-retention-and-erasure-US-05

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* The collector's identity record stands as the row says.

**Test data:**

| Identity record | Standing read |
| --- | --- |
| A check verified until `<verified until>` | Verified until `<verified until>`, and how it was checked |
| Never asked for | No identity on file |
| A check submitted on `<day>`, undecided | A check is out since `<day>` |
| A check started on `<day>`, undecided long enough to stand as stalled | Stalled, since `<day>` |
| The last check expired on `<day>` | The last check expired on `<day>` |
| The last check decided not accepted on `<day>` | The last check was not accepted on `<day>` |

**Steps:**

1. Ask for the collector's own read under their account.
2. Read the identity standing in the API response.

**Expected Results:**

* Step 2 reads the row's standing, never no identity on file where a check is out or stalled.
* The response carries no legal name, date of birth, document type, document number, document expiry or photograph.
* The response names no reason for a check that was not accepted.

### grade10-site-vault-retention-and-erasure-US5-TC4-1: Standing reads no identity on file yet

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-retention-and-erasure-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/your-data.spec.ts`

**Pre-conditions:**

* The collector's account has never had an identity check asked for.

**Steps:**

1. Navigate to <vault your data url>.

**Expected Results:**

* Standing reads no identity on file, verified at the next visit.

### grade10-site-vault-retention-and-erasure-US5-TC5-1: Standing reads a check is out since the date

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-retention-and-erasure-US-05

**Pre-conditions:**

* A hosted identity check on the collector's account is submitted and the
  provider has not decided.

**Steps:**

1. Navigate to <vault your data url>.

**Expected Results:**

* Standing reads a check is out since the date it was submitted.

### grade10-site-vault-retention-and-erasure-US5-TC6-1: Standing reads the last check expired on the date

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-retention-and-erasure-US-05

**Pre-conditions:**

* The collector's last hosted identity check expired or was withdrawn.

**Steps:**

1. Navigate to <vault your data url>.

**Expected Results:**

* Standing reads the last check expired on the date.

### grade10-site-vault-retention-and-erasure-US5-TC7-1: Your data shows loading cards before data arrives

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-retention-and-erasure-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/your-data.spec.ts`

**Pre-conditions:**

* The collector is signed in, and Your data has not yet returned its
  response.

**Steps:**

1. Navigate to <vault your data url>.

**Expected Results:**

* Skeleton cards show in place of the retention table, standing and
  download cards.

### grade10-site-vault-retention-and-erasure-US5-TC8-2: The read under the account is refused without a session

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
* **Trace:** grade10-site-vault-retention-and-erasure-US-05

**Pre-conditions:**

* The tester holds no session on <grade10 site url>.

**Steps:**

1. Ask for the collector's own read under an account, with no session.

**Expected Results:**

* Step 1 is refused.
* The response names no class, standing, document or ask.

### grade10-site-vault-retention-and-erasure-US5-TC9-1: Your data keeps its cards after a failed load

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-retention-and-erasure-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/your-data.spec.ts`

**Pre-conditions:**

* The collector is signed in on <vault your data url>, and the page's data
  request is made to fail.

**Steps:**

1. Navigate to <vault your data url>.

**Expected Results:**

* The error message shows.
* Any cards that already rendered stay in place.

### grade10-site-vault-retention-and-erasure-US5-TC10-2: Every signed document is read under the case it belongs to

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-retention-and-erasure-US-05

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* The collector holds sealed documents on two released cases, `<case_1>` and `<case_2>`.

**Steps:**

1. Ask for the collector's own read under their account.
2. Read the signed documents in the API response.

**Expected Results:**

* Step 2 lists every sealed document of `<case_1>` under `<case_1>`, and every one of `<case_2>` under `<case_2>`.

### grade10-site-vault-retention-and-erasure-US5-TC12-2: A class whose window nobody has decided is read with no number

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
* **Trace:** grade10-site-vault-retention-and-erasure-US-05

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* The brand's retention table is made to hold no window for identity records.

**Steps:**

1. Ask for the collector's own read under their account.
2. Read the retention classes in the API response.

**Expected Results:**

* Step 2 carries identity records with no number of days: neither zero nor a figure for kept forever.
* Step 2 carries agreements, item photographs and case records with their windows in days.

### grade10-site-vault-retention-and-erasure-US5-TC13-2: A case that ended after custody carries what is kept, and a running one none

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-vault-retention-and-erasure-US-05

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the collector's case, standing as the row says.

**Test data:**

| `<case_1>` stands | The read of `<case_1>` carries |
| --- | --- |
| Released | Agreements 2,555 days, identity records 1,825, item photographs 2,555, case records 2,555 |
| Forfeited | The same four classes and windows |
| In the vault, nothing owed | No retention classes |

**Steps:**

1. Ask for the collector's own read of `<case_1>`.
2. Ask for the collector's own read under their account.

**Expected Results:**

* Step 1 carries what the row's last column names.
* Where step 1 carries classes, they are the classes and windows step 2 carries.

### grade10-site-vault-retention-and-erasure-US5-TC14-1: A check left undecided long enough still reads that a check is out

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-retention-and-erasure-US-05

**Pre-conditions:**

* A check on the collector's account was started, is undecided, and has been
  out long enough to stand as stalled.

**Steps:**

1. Navigate to <vault your data url>.

**Expected Results:**

* Standing reads that a check is out, with the day it was started.
* It does not read as no identity on file.
* It names no reason and no stage of the check.

### grade10-site-vault-retention-and-erasure-US5-TC15-1: A refused check reads as not accepted and names no reason

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-retention-and-erasure-US-05

**Pre-conditions:**

* The collector's last check was decided as not accepted.

**Steps:**

1. Navigate to <vault your data url>.

**Expected Results:**

* Standing reads that the last check was not accepted, with the day it was
  decided.
* No reason for the refusal shows.
* No legal name, date of birth, document type, document number, expiry or
  photograph shows anywhere on the page.

### grade10-site-vault-retention-and-erasure-US5-TC16-2: The collector files the ask under their account and the read names its days

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-retention-and-erasure-US-05

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* The collector has filed no ask, and no case of theirs is in flight.
* The clock reads `<filing day>` on the brand's zone.

**Test data:**

| Field | Value |
| --- | --- |
| `<filing day>` | 2 October, Asia/Hong_Kong |
| `<may run>` | 00:00 on 9 October, Asia/Hong_Kong: the first instant of the seventh day after `<filing day>` |

**Steps:**

1. File the ask to be forgotten under the collector's own account.
2. Ask for the collector's own read under their account.

**Expected Results:**

* Step 1 is accepted.
* Step 2 reads the ask filed on `<filing day>`.
* Step 2 reads that an erasure may run from `<may run>`, and that the ask may be cancelled before then.

### grade10-site-vault-retention-and-erasure-US5-TC17-2: The collector cancels the ask inside the window

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-retention-and-erasure-US-05

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* The collector filed the ask to be forgotten, and the clock reads before the instant an erasure may run.

**Steps:**

1. Cancel the ask under the collector's own account.
2. Ask for the collector's own read under their account.

**Expected Results:**

* Step 1 is accepted.
* Step 2 reads no ask filed, and that one may be filed.

### grade10-site-vault-retention-and-erasure-US5-TC18-2: A cancel at the limit of the window

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-retention-and-erasure-US-05

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* The collector filed the ask on 2 October, Asia/Hong_Kong; an erasure may run from 00:00 on 9 October, Asia/Hong_Kong.
* The clock reads the row's time.

**Test data:**

| Clock | Step 1 |
| --- | --- |
| 23:59 on 8 October, Asia/Hong_Kong | Accepted |
| 00:00 on 9 October, Asia/Hong_Kong | Refused by name |

**Steps:**

1. Cancel the ask under the collector's own account.
2. Ask for the collector's own read under their account.

**Expected Results:**

* Step 1 is answered as the row says.
* Step 2 reads the ask still filed wherever step 1 was refused.

### grade10-site-vault-retention-and-erasure-US5-TC27-1: An identity standing that cannot be answered leaves the rest of the read

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-retention-and-erasure-US-05

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* The collector holds sealed documents on `<case_1>`, a released case.
* The identity service is made to fail every read of the collector's standing.

**Steps:**

1. Ask for the collector's own read under their account.

**Expected Results:**

* Step 1 is answered, not refused.
* It names the identity standing as failed.
* It still carries the retention classes, `<case_1>`'s sealed documents, what holds the ask back and the ask.

## Settled

- **Filing the ask while the vault holds something** - refused by name by the vault before anything is filed with auth, naming each case by reference and hold: a request in flight, an item in the vault or a running loan (Q16)
- **Filing the ask while a grading submission is live** - no new guard: the worker accepts the filing, and grading's erasure refuses when an admin runs it (Q15)

## Reconciliation

**Run:** QA2, 2026-10-02, for change `retire-vault-collector-site`. QA1's blind pass read the Feature set, the journeys, `decisions.md` through Q15, the proposal and the durable suite; it was denied every requirement. QA2 read both suites, this delta, `tech-design.md`, `tasks.md` and the worker they name: `trpc/routers/cases.ts` (`yourData`, `requestErasure`, `cancelErasure`), `collectorHolds`, `cases/yourData.ts` and `retention.ts`. It is a statement, not proof.

- **Raised, folded into spec** - none
- **Raised, escalated** - the refusal on filing, landed as Q16; a live grading submission, landed as Q15: the filing is accepted and grading's erasure refuses the run, as `add-card-grading`'s requirement holds
- **Raised, rejected** - none
- **Re-versioned to the API** - every case whose behaviour the worker keeps and whose run walked Your data or the case page: `grade10-site-vault-retention-and-erasure-US1-TC5-2`, `grade10-site-vault-retention-and-erasure-US1-TC6-2`, `grade10-site-vault-retention-and-erasure-US1-TC7-2`, `grade10-site-vault-retention-and-erasure-US4-TC3-2`, `grade10-site-vault-retention-and-erasure-US4-TC5-2`, `grade10-site-vault-retention-and-erasure-US5-TC1-2`, `grade10-site-vault-retention-and-erasure-US5-TC3-2`, `grade10-site-vault-retention-and-erasure-US5-TC8-2`, `grade10-site-vault-retention-and-erasure-US5-TC10-2`, `grade10-site-vault-retention-and-erasure-US5-TC12-2`, `grade10-site-vault-retention-and-erasure-US5-TC13-2`, `grade10-site-vault-retention-and-erasure-US5-TC16-2`, `grade10-site-vault-retention-and-erasure-US5-TC17-2`, `grade10-site-vault-retention-and-erasure-US5-TC18-2`; `grade10-site-vault-retention-and-erasure-US4-TC3-2` and `grade10-site-vault-retention-and-erasure-US4-TC5-2` are `add-card-grading`'s cases, filing the ask through the API with the admin's run unchanged
- **Deprecated** - the cases whose subject is a removed screen: `grade10-site-vault-retention-and-erasure-US4-TC8-1` and `grade10-site-vault-retention-and-erasure-US4-TC10-1`, Your data withholding the ask, which the worker never did (Q15); `grade10-site-vault-retention-and-erasure-US5-TC2-1`, the reviewed-not-deleted line; `grade10-site-vault-retention-and-erasure-US5-TC7-1` and `grade10-site-vault-retention-and-erasure-US5-TC9-1`, the page's loading and failed cards
- **Deprecated as duplicates** - `grade10-site-vault-retention-and-erasure-US5-TC4-1`, `grade10-site-vault-retention-and-erasure-US5-TC5-1`, `grade10-site-vault-retention-and-erasure-US5-TC6-1`, `grade10-site-vault-retention-and-erasure-US5-TC14-1`, `grade10-site-vault-retention-and-erasure-US5-TC15-1`: each is one row of `grade10-site-vault-retention-and-erasure-US5-TC3-2`, the same read with another standing
- **Carried into a bump** - QA1's new ids that re-covered an earlier case leave the delta: `US1-TC8-1` into `grade10-site-vault-retention-and-erasure-US1-TC6-2` and `grade10-site-vault-retention-and-erasure-US1-TC7-2`; `US1-TC9-1` into `grade10-site-vault-retention-and-erasure-US1-TC5-2`; `US5-TC19-1` into `grade10-site-vault-retention-and-erasure-US5-TC1-2` and `grade10-site-vault-retention-and-erasure-US5-TC10-2`; `US5-TC20-1` into `grade10-site-vault-retention-and-erasure-US5-TC3-2`; `US5-TC21-1` into `grade10-site-vault-retention-and-erasure-US5-TC8-2`; `US5-TC22-1` into `grade10-site-vault-retention-and-erasure-US5-TC16-2`; `US5-TC23-1` into `grade10-site-vault-retention-and-erasure-US5-TC17-2`; `US5-TC24-1` into `grade10-site-vault-retention-and-erasure-US5-TC18-2`; `US5-TC25-1` into `grade10-site-vault-retention-and-erasure-US5-TC12-2`; `US5-TC26-1` into `grade10-site-vault-retention-and-erasure-US5-TC13-2`
- **New ids kept** - `grade10-site-vault-retention-and-erasure-US5-TC27-1`, an identity standing that cannot be answered
- **Joined** - `grade10-site-vault-retention-and-erasure-SC-23`, `-SC-26` into `grade10-site-vault-retention-and-erasure-US1-TC6-2`, `grade10-site-vault-retention-and-erasure-US1-TC7-2` and `grade10-site-vault-retention-and-erasure-US1-TC5-2`; `-SC-12`, `-SC-13`, `-SC-16` into `grade10-site-vault-retention-and-erasure-US5-TC1-2` and `grade10-site-vault-retention-and-erasure-US5-TC10-2`; `-SC-19` to `-SC-22`, `-SC-39`, `-SC-40` into `grade10-site-vault-retention-and-erasure-US5-TC3-2`; `-SC-24`, `-SC-25`, `-SC-27` into `grade10-site-vault-retention-and-erasure-US5-TC16-2` to `grade10-site-vault-retention-and-erasure-US5-TC18-2`; `-SC-17` into `grade10-site-vault-retention-and-erasure-US5-TC12-2`; `-SC-18` into `grade10-site-vault-retention-and-erasure-US5-TC13-2`; `-SC-15` into `grade10-site-vault-retention-and-erasure-US5-TC27-1`
- **Contradicted** - none
- **Uncovered anchors** - none
- **Automated cases re-versioned** - `grade10-site-vault-retention-and-erasure-US1-TC5-2`, `grade10-site-vault-retention-and-erasure-US1-TC6-2`, `grade10-site-vault-retention-and-erasure-US1-TC7-2`, `grade10-site-vault-retention-and-erasure-US5-TC1-2`, `grade10-site-vault-retention-and-erasure-US5-TC8-2`, `grade10-site-vault-retention-and-erasure-US5-TC13-2`, `grade10-site-vault-retention-and-erasure-US5-TC16-2`, `grade10-site-vault-retention-and-erasure-US5-TC17-2` were decided by `your-data.spec.ts`, and `grade10-site-vault-retention-and-erasure-US4-TC5-2` by `grading/uncollected.spec.ts`, at `-1`; each is `manual` until task 4.4 retitles its API walk and flips it
