# grade10-site/vault/retention-and-erasure Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-02, tcs-rules r4

## grade10-site-vault-retention-and-erasure-US1: Collector asks to be forgotten and the vault answers for its own data

**As a** collector who has closed their account,
**I want** the vault to delete what it holds about me,
**so that** nothing of mine is kept beyond the record of agreements I actually
signed.

### grade10-site-vault-retention-and-erasure-US1-TC5-1: Filed ask stays held while a case is in flight

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-retention-and-erasure-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/your-data.spec.ts`

**Pre-conditions:**

* The collector has already filed the ask to be forgotten, is signed in and
  is on <vault your data url>.
* The account's vault case matches the row's condition below.

**Test data:**

| Case condition | Reason shown |
| --- | --- |
| An item is in the vault's custody | An item in the vault or a loan running |
| A loan is running | An item in the vault or a loan running |

**Steps:**

1. Navigate to <vault your data url>.

**Expected Results:**

* Your data reads the request filed on the date it was filed.
* The hold shows in words, matching the row's Reason shown.
* Cancel the request is offered, and that erasure waits until the hold
  lifts.

---

### grade10-site-vault-retention-and-erasure-US1-TC6-1: Ask to be forgotten withheld before filing while in flight

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-retention-and-erasure-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/your-data.spec.ts`

**Pre-conditions:**

* The collector has not yet filed an ask to be forgotten, is signed in and
  is on <vault your data url>.
* The account's vault case matches the row's condition below.

**Test data:**

| Case condition | Reason shown |
| --- | --- |
| An item is in the vault's custody | An item in the vault or a loan running |
| A loan is running | An item in the vault or a loan running |

**Steps:**

1. Navigate to <vault your data url>.

**Expected Results:**

* The Ask to be forgotten control is withheld.
* The reason shows in words, matching the row's Reason shown.

---

### grade10-site-vault-retention-and-erasure-US1-TC7-1: Erasure stays blocked though one of several cases already closed

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-retention-and-erasure-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/your-data.spec.ts`

**Pre-conditions:**

* The collector holds two vault cases: one signed and closed — released or
  forfeited — and the other still in flight, either an item in custody or a
  loan running.
* The collector has already filed the ask to be forgotten and is signed in
  on <vault your data url>.

**Steps:**

1. Navigate to <vault your data url>.

**Expected Results:**

* Your data still reads the hold in words, naming the in-flight case's
  reason.
* Cancel the request remains the only offered action; nothing shows the
  closed case as having cleared the hold.

---

### grade10-site-vault-retention-and-erasure-US1-TC8-1: Filing the ask while a case is in flight is refused by name

Runs once per row of **Test data**.

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
* The collector has filed no ask to be forgotten.
* The collector's vault cases stand as the row says.

**Test data:**

| The collector's cases | Case in flight | Named as |
| --- | --- | --- |
| `<case_1>`, sent in and not yet in the vault | `<case_1>` | A request in flight |
| `<case_1>`, its item in the vault | `<case_1>` | An item in the vault |
| `<case_1>`, its loan running | `<case_1>` | A loan running |
| `<case_1>` released; `<case_2>`, its item in the vault | `<case_2>` | An item in the vault |

**Steps:**

1. File the ask to be forgotten under the collector's own account.
2. Ask for the collector's own read under their account.

**Expected Results:**

* Step 1 is refused by name, naming the row's case in flight by its reference and the row's Named as.
* Step 2 reads no ask filed, and the row's case beside it as what holds the ask.

---

### grade10-site-vault-retention-and-erasure-US1-TC9-1: A hold that opens after the ask is filed is read beside it

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

---

## grade10-site-vault-retention-and-erasure-US4: Collector who graded cards is forgotten by the same request

**As a** collector who has closed their account after grading cards,
**I want** the one erasure request to reach my submissions as it reaches my vault cases, refused by name while a submission is between booked and ready, money is still due on one or ready cards are uncollected, and otherwise keeping only the sealed documents and the photographs in the vault's classes and the submission record in the vault's case records, each for the window the table names from the later of the day the submission ended and the day nothing is owed either way, and no identity record at all,
**so that** grading keeps nothing of mine the vault would not keep, and I ask once.

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

---

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

### grade10-site-vault-retention-and-erasure-US4-TC3-1: Submission cancelled before hand-in is purged with the account

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

---

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

---

## grade10-site-vault-retention-and-erasure-US5: Collector reads what the vault keeps about them

**As a** collector,
**I want** one page that says what is kept, for how long, where my identity
stands, and where I ask to be forgotten,
**so that** I know what I am asking for before I ask.

### grade10-site-vault-retention-and-erasure-US5-TC1-1: Your data lists every retention class with its window

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-retention-and-erasure-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/your-data.spec.ts`

**Pre-conditions:**

* The collector is signed in and has at least one vault case.

**Test data:**

| Class | Window |
| --- | --- |
| Agreements | 2,555 days after the case ends |
| Identity records | 1,825 days after the case ends |
| Item photographs | 2,555 days after the case ends |
| Case records | 2,555 days after the case ends |

**Steps:**

1. Navigate to <vault your data url>.

**Expected Results:**

* What the vault keeps lists agreements, identity records, item photographs
  and case records, each with its window from Test data.
* Each window reads as the days kept after the case ends.

---

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

---

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

---

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

---

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

---

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

---

### grade10-site-vault-retention-and-erasure-US5-TC8-1: Your data is reached only while signed in

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-retention-and-erasure-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/your-data.spec.ts`

**Pre-conditions:**

* The visitor is not signed in.

**Steps:**

1. Navigate to <vault your data url>.

**Expected Results:**

* The site's sign-in dialog shows.
* No retention, standing or ask content renders behind it.

---

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

---

### grade10-site-vault-retention-and-erasure-US5-TC10-1: Every signed document is listed under its case and the page offers the download

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-retention-and-erasure-US-05

**Pre-conditions:**

* The collector is signed in and holds sealed documents on two closed cases.

**Steps:**

1. Navigate to <vault your data url>.
2. Take the download.

**Expected Results:**

* Every one of those documents is listed under the case it belongs to.
* The page offers the one download `grade10-site/vault/documents-and-signing`
  defines, over the documents it lists.

---

### grade10-site-vault-retention-and-erasure-US5-TC12-1: A class whose window nobody has decided still shows, reading undecided

**Classification:**

* **Severity:** major
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

* The brand holds no window for its identity records.
* The collector is signed in.

**Steps:**

1. Navigate to <vault your data url>.

**Expected Results:**

* What the vault keeps still lists the identity class; it is not hidden.
* Its window reads that it is being decided.
* It reads neither as zero days, nor as deleted at once, nor as kept
  forever.

---

### grade10-site-vault-retention-and-erasure-US5-TC13-1: A case that ended names the same classes and points at Your data

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

* The collector is signed in and holds a case whose item was released.

**Steps:**

1. Open that case.

**Expected Results:**

* The same classes and windows Your data names are named on the case.
* The case points at Your data for the ask to be forgotten.

---

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

---

### grade10-site-vault-retention-and-erasure-US5-TC16-1: The ask is filed and reads the day it was filed and the day it may run

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-retention-and-erasure-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/your-data.spec.ts`

**Pre-conditions:**

* The collector is signed in, has filed no request, and has nothing in the
  vault's way: no item held and no loan running.

**Steps:**

1. Navigate to <vault your data url>.
2. Ask to be forgotten.
3. Confirm the ask.

**Expected Results:**

* The confirmation names the window before an erasure may run, and that the
  ask may be cancelled inside it.
* The request is filed.
* The page names the day it was filed and the day an erasure may run.

---

### grade10-site-vault-retention-and-erasure-US5-TC17-1: The request is cancelled inside the window and the ask comes back

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-retention-and-erasure-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/your-data.spec.ts`

**Pre-conditions:**

* The collector's request is filed and it is before the day an erasure may run.
* The collector is signed in.

**Steps:**

1. Navigate to <vault your data url>.
2. Cancel the request.

**Expected Results:**

* No filed request stands.
* The page offers the ask again.

---

### grade10-site-vault-retention-and-erasure-US5-TC18-1: Once the window has passed no cancel is offered

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-retention-and-erasure-US-05

**Pre-conditions:**

* The collector's filed request has reached the day an erasure may run.
* The collector is signed in.

**Steps:**

1. Navigate to <vault your data url>.

**Expected Results:**

* No cancel is offered.
* The page says each product erases what it holds.

---

### grade10-site-vault-retention-and-erasure-US5-TC19-1: The collector's own read under the account names what is kept, the standing, the documents and the ask

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
* **Trace:** grade10-site-vault-retention-and-erasure-US-05

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* The collector's identity check is verified until `<verified until>`.
* The collector holds sealed documents on two released cases, `<case_1>` and `<case_2>`, and no case in flight.
* The collector has filed no ask to be forgotten.

**Test data:**

| Class | Window |
| --- | --- |
| Agreements | 2,555 days |
| Identity records | 1,825 days |
| Item photographs | 2,555 days |
| Case records | 2,555 days |

**Steps:**

1. Ask for the collector's own read under their account.
2. Read the API response.

**Expected Results:**

* Step 2 names each class in **Test data** with its window, read as days after the case ends.
* Step 2 reads the identity verified until `<verified until>`, and how it was checked.
* Step 2 lists every sealed document of `<case_1>` and `<case_2>` under its case.
* Step 2 reads no ask filed, and nothing holding one back.

---

### grade10-site-vault-retention-and-erasure-US5-TC20-1: The standing in the read never carries the name or the document

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
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

---

### grade10-site-vault-retention-and-erasure-US5-TC21-1: The read under the account is refused without a session

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

---

### grade10-site-vault-retention-and-erasure-US5-TC22-1: The collector files the ask under their account and the read names its days

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

---

### grade10-site-vault-retention-and-erasure-US5-TC23-1: The collector cancels the ask inside the window

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

---

### grade10-site-vault-retention-and-erasure-US5-TC24-1: A cancel at the limit of the window

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

---

### grade10-site-vault-retention-and-erasure-US5-TC3-1: Standing reads verified until the date, never name or document

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-retention-and-erasure-US-05

**Pre-conditions:**

* The collector has an identity check bound to their account.

**Steps:**

1. Navigate to <vault your data url>.

**Expected Results:**

* Standing reads verified until the date, checked how and on which day.
* Neither the collector's legal name nor the document shows anywhere on
  the page.

---

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

---

### grade10-site-vault-retention-and-erasure-US5-TC25-1: A class whose window nobody has decided is read with no number

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

---

### grade10-site-vault-retention-and-erasure-US5-TC26-1: A case that ended after custody carries what is kept, and a running one none

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

---

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

## Reconciliation

**Run:** QA2, 2026-10-02, for change `retire-vault-collector-site`. QA1's blind pass read the Feature set, the journeys, `decisions.md` through Q15, the proposal and the durable suite; it was denied every requirement. QA2 read both suites, this delta, `tech-design.md`, `tasks.md` and the worker they name: `trpc/routers/erasure.ts`, `eraseUser` and `collectorHoldOf`, `cases/yourData.ts` and `retention.ts`. It is a statement, not proof.

- **Raised, folded into spec** - none
- **Raised, escalated** - the refusal on filing, landed as Q16; a live grading submission is Q15's, settled by its recommendation: the filing is accepted and grading's erasure refuses the run, as `add-card-grading`'s requirement holds
- **Raised, rejected** - none
- **Revised** - `grade10-site-vault-retention-and-erasure-US4-TC3-1` files the ask through the API, keeping `<v>`; `grade10-site-vault-retention-and-erasure-US4-TC5-2` accepts the filing and has the admin's run refused beside grading, naming the submission, blocked on Q15
- **Deprecated as duplicates** - `grade10-site-vault-retention-and-erasure-US5-TC3-1` and `grade10-site-vault-retention-and-erasure-US5-TC15-1`; `grade10-site-vault-retention-and-erasure-US5-TC20-1` holds their purpose
- **Joined** - `grade10-site-vault-retention-and-erasure-SC-23`, `-SC-26` into `grade10-site-vault-retention-and-erasure-US1-TC8-1`; `grade10-site-vault-retention-and-erasure-SC-12`, `-SC-13`, `-SC-16` into `grade10-site-vault-retention-and-erasure-US5-TC19-1`; `grade10-site-vault-retention-and-erasure-SC-19` to `-SC-22`, `-SC-39`, `-SC-40` into `grade10-site-vault-retention-and-erasure-US5-TC20-1`; `grade10-site-vault-retention-and-erasure-SC-24`, `-SC-25`, `-SC-27` into `grade10-site-vault-retention-and-erasure-US5-TC22-1` to `grade10-site-vault-retention-and-erasure-US5-TC24-1`
- **Corrected** - `grade10-site-vault-retention-and-erasure-US1-TC8-1` adds the request-in-flight hold and names each hold; `grade10-site-vault-retention-and-erasure-US5-TC19-1` lists the documents of both cases and drops the offered download; `grade10-site-vault-retention-and-erasure-US5-TC20-1` reads a stalled check as out since its day, adds the document's expiry, and gives no reason for a refused check
- **Added by QA2** - `grade10-site-vault-retention-and-erasure-US1-TC9-1` for `grade10-site-vault-retention-and-erasure-SC-26`; `grade10-site-vault-retention-and-erasure-US5-TC25-1` for `grade10-site-vault-retention-and-erasure-SC-17`; `grade10-site-vault-retention-and-erasure-US5-TC26-1` for `grade10-site-vault-retention-and-erasure-SC-18`; `grade10-site-vault-retention-and-erasure-US5-TC27-1` for `grade10-site-vault-retention-and-erasure-SC-15`
- **Contradicted** - none
- **Uncovered anchors** - none
