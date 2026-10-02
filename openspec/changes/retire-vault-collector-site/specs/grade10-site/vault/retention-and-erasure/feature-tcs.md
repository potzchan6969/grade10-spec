# grade10-site/vault/retention-and-erasure Test Cases

**Status:** pending-review

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
