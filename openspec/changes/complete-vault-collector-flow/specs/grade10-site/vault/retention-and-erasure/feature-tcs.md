# grade10-site/vault/retention-and-erasure Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-22, tcs-rules r3.0

## grade10-site-vault-retention-and-erasure-US1: Collector asks to be forgotten and the vault answers for its own data

**As a** collector who has closed their account,
**I want** the vault to delete what it holds about me,
**so that** nothing of mine is kept beyond the record of agreements I actually
signed.

### grade10-site-vault-retention-and-erasure-US1-TC1-1: Erasure purges everything for a never-signed case

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-retention-and-erasure-US-01

**Pre-conditions:**

* The collector has one vault case that ended without any signature —
  declined, cancelled or expired — and the account carries no other case
  that is signed and not yet released or forfeited.

**Steps:**

1. Run the vault's own erasure for the collector's account.

**Expected Results:**

* The case's item photographs, item description and the ceremony's own
  personal data are purged.
* The identity binding behind the case is released.

### grade10-site-vault-retention-and-erasure-US1-TC2-1: Erasure holds sealed documents behind a closed case

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
* **Trace:** grade10-site-vault-retention-and-erasure-US-01

**Pre-conditions:**

* The collector's vault case is signed and closed — released or forfeited —
  and no other case on the account is still in flight.

**Steps:**

1. Run the vault's own erasure for the collector's account.

**Expected Results:**

* The case's contact details, staff free-text notes and decline reason are
  purged.
* The sealed documents, the identity binding and the case's item
  photographs and text stay retained under the hold, with no expiry clock.

### grade10-site-vault-retention-and-erasure-US1-TC3-1: Erasure rewrites the actor id, leaves records intact

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
* **Trace:** grade10-site-vault-retention-and-erasure-US-01

**Pre-conditions:**

* The collector's account carries no case still in flight, and at least one
  case's history names the collector as an actor.

**Steps:**

1. Run the vault's own erasure for the collector's account.
2. Attempt to update or delete a money, correction, valuation or movement
   record the erasure did not touch.

**Expected Results:**

* Only the collector's own actor id inside the case history is rewritten.
* Every other append-only money, correction, valuation, movement and
  audit-trail row is unchanged.
* The attempted update or delete in step 2 is refused.

### grade10-site-vault-retention-and-erasure-US1-TC4-1: No case ever held leaves erasure unblocked

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
* **Trace:** grade10-site-vault-retention-and-erasure-US-01

**Pre-conditions:**

* The collector's account has never held a vault case.

**Steps:**

1. Run the vault's own erasure for the collector's account.

**Expected Results:**

* The vault reports no hold, and nothing blocks the request.
* The vault names nothing it still holds of the collector.

### grade10-site-vault-retention-and-erasure-US1-TC5-1: Filed ask stays held while a case is in flight

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
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

### grade10-site-vault-retention-and-erasure-US1-TC6-1: Ask to be forgotten withheld before filing while in flight

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
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

### grade10-site-vault-retention-and-erasure-US1-TC7-1: Erasure stays blocked though one of several cases already closed

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
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

## grade10-site-vault-retention-and-erasure-US2: Admin runs an erasure without touching a live case

**As an** admin running a person's erasure,
**I want** to be told which of their cases are still in flight rather than
having them erased,
**so that** nobody's item or debt disappears from the record while it still
exists.

### grade10-site-vault-retention-and-erasure-US2-TC1-1: A running loan refuses the erasure and names the case

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-retention-and-erasure-US-02

**Pre-conditions:**

* The person holds two vault cases: one closed after custody, and one loan
  still running.

**Steps:**

1. Run the person's erasure.

**Expected Results:**

* The erasure is refused, naming the running case.
* Neither case is touched.

### grade10-site-vault-retention-and-erasure-US2-TC2-1: A case that goes live under the run is refused and the others erased

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
* **Trace:** grade10-site-vault-retention-and-erasure-US-02

**Pre-conditions:**

* The person holds several cases, none of them in flight when the run lists
  them.
* One listed case becomes live after it is listed and before the run reaches
  it.

**Steps:**

1. Run the person's erasure over the listed cases.

**Expected Results:**

* The case that went live is refused and reported.
* Every other listed case is erased.
* The run does not fail as a whole.

### grade10-site-vault-retention-and-erasure-US2-TC3-1: A recorded payment takes no update and no delete

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
* **Trace:** grade10-site-vault-retention-and-erasure-US-02

**Pre-conditions:**

* A payment is recorded against a vault case.

**Steps:**

1. Try to update the recorded payment from a database session.
2. Try to delete it from the same session.

**Expected Results:**

* The database refuses both.
* The recorded payment is unchanged.

---

## grade10-site-vault-retention-and-erasure-US3: Compliance officer sees what is being kept too long

**As an** admin answerable for what we keep,
**I want** a list of closed cases past the window for each class, and to be
told which windows nobody has decided,
**so that** deleting is a decision somebody makes rather than something that
happens on a clock.

### grade10-site-vault-retention-and-erasure-US3-TC1-1: A case past its window is reported and left as it was

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-retention-and-erasure-US-03

**Pre-conditions:**

* The brand keeps agreements for 2,555 days after a case ends.
* One case was released 2,600 days ago.

**Steps:**

1. Run the review.

**Expected Results:**

* The case is reported with the class that is past its window.
* Nothing about the case has changed: no document, identity record or
  photograph is deleted, and nothing is stamped.
* The next pass reports the same case again.

### grade10-site-vault-retention-and-erasure-US3-TC2-1: A class nobody has decided is reported undecided and flags no case

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-retention-and-erasure-US-03

**Pre-conditions:**

* The brand holds no window for its identity records, and holds one for each
  other class.

**Steps:**

1. Run the review.

**Expected Results:**

* The identity class is reported as undecided.
* No case is flagged for it, and it is not read as zero days.
* The classes that hold a window are reported as they always are.

### grade10-site-vault-retention-and-erasure-US3-TC3-1: The window runs from the case's own ending

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
* **Trace:** grade10-site-vault-retention-and-erasure-US-03

**Pre-conditions:**

* A case reached its terminal status long ago and was written to since for
  another reason.

**Steps:**

1. Run the review.

**Expected Results:**

* The window is measured from the moment the case reached its terminal
  status.
* The later write moves nothing.

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
* **Status:** draft
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

### grade10-site-vault-retention-and-erasure-US5-TC2-1: Your data states that review deletes nothing by itself

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
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

### grade10-site-vault-retention-and-erasure-US5-TC3-1: Standing reads verified until the date, never name or document

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
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

### grade10-site-vault-retention-and-erasure-US5-TC4-1: Standing reads no identity on file yet

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
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
* **Status:** draft
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
* **Status:** draft
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
* **Status:** draft
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

### grade10-site-vault-retention-and-erasure-US5-TC8-1: Your data is reached only while signed in

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
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

### grade10-site-vault-retention-and-erasure-US5-TC9-1: Your data keeps its cards after a failed load

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
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


### grade10-site-vault-retention-and-erasure-US5-TC10-1: Every signed document is listed under its case and the page offers the download

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
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

### grade10-site-vault-retention-and-erasure-US5-TC12-1: A class whose window nobody has decided still shows, reading undecided

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
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

### grade10-site-vault-retention-and-erasure-US5-TC13-1: A case that ended names the same classes and points at Your data

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
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

### grade10-site-vault-retention-and-erasure-US5-TC14-1: A check left undecided long enough still reads that a check is out

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
* **Status:** draft
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

### grade10-site-vault-retention-and-erasure-US5-TC16-1: The ask is filed and reads the day it was filed and the day it may run

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
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

### grade10-site-vault-retention-and-erasure-US5-TC17-1: The request is cancelled inside the window and the ask comes back

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
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

### grade10-site-vault-retention-and-erasure-US5-TC18-1: Once the window has passed no cancel is offered

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
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

## Settled

- A retention class whose window nobody has set shows in the same table as every other, its window reading that it is being decided — never hidden, never zero days, never kept forever.
- The page names all six standings the identity record holds, in the collector's words: a stalled check reads that a check is out, a refused one that the last check was not accepted, and neither names a reason.
- The download is the one `grade10-site/vault/documents-and-signing` defines. This page lists what the collector has signed and offers that download; the bound it covers, and the page a collector who has signed nothing reads, are that capability's and are walked in its suite.

## Reconciliation

Run: 2026-09-22, blind pass over the isolated input — this capability's `## Purpose` and `## Feature set`, its `user-journeys.md`, the change's `proposal.md` and its `decisions.md` with the `## Raised` table, `ui-design.md` with the state dispositions stripped, and the pages the proposal links; denied every `## Requirements` section, `openspec/specs/`, `openspec/changes/archive/` and `tech-design.md`. Reconciled the same day against the scenario pass's `grade10-site-vault-retention-and-erasure-SC-12` to `grade10-site-vault-retention-and-erasure-SC-27` and the durable scenarios the change does not touch. The blind pass read US1 and US5 only; this is the capability's first suite, so US2 and US3 — the journeys the durable spec already serves — were walked here and given cases.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `grade10-site-vault-retention-and-erasure-US1-TC1-1` | Covered | `grade10-site-vault-retention-and-erasure-SC-06` |
| `grade10-site-vault-retention-and-erasure-US1-TC2-1` | Covered | `grade10-site-vault-retention-and-erasure-SC-07` |
| `grade10-site-vault-retention-and-erasure-US1-TC3-1` | Covered | `grade10-site-vault-retention-and-erasure-SC-09`, `grade10-site-vault-retention-and-erasure-SC-10` and `grade10-site-vault-retention-and-erasure-SC-11` |
| `grade10-site-vault-retention-and-erasure-US1-TC4-1` | Folded | `grade10-site-vault-retention-and-erasure-SC-41`. The empty partition of the refusal rule: an account holding no case holds none in flight. `grade10-site-vault-retention-and-erasure-SC-04` states only the refusal, so the change opens `An erasure is refused while any of the person's cases is in flight` in a MODIFIED block and the scenario lands there |
| `grade10-site-vault-retention-and-erasure-US1-TC5-1` | Covered | `grade10-site-vault-retention-and-erasure-SC-26` |
| `grade10-site-vault-retention-and-erasure-US1-TC6-1` | Covered | `grade10-site-vault-retention-and-erasure-SC-23` |
| `grade10-site-vault-retention-and-erasure-US1-TC7-1` | Covered | `grade10-site-vault-retention-and-erasure-SC-04` and `grade10-site-vault-retention-and-erasure-SC-26` — a case that closed does not clear the hold another case stands |
| `grade10-site-vault-retention-and-erasure-US5-TC1-1` | Covered | `grade10-site-vault-retention-and-erasure-SC-16` |
| `grade10-site-vault-retention-and-erasure-US5-TC2-1` | Covered | `grade10-site-vault-retention-and-erasure-SC-16` — the reviewed-not-deleted line is that scenario's second outcome |
| `grade10-site-vault-retention-and-erasure-US5-TC3-1` | Covered | `grade10-site-vault-retention-and-erasure-SC-19` and `grade10-site-vault-retention-and-erasure-SC-22` |
| `grade10-site-vault-retention-and-erasure-US5-TC4-1` | Covered | `grade10-site-vault-retention-and-erasure-SC-40` |
| `grade10-site-vault-retention-and-erasure-US5-TC5-1` | Covered | `grade10-site-vault-retention-and-erasure-SC-20` |
| `grade10-site-vault-retention-and-erasure-US5-TC6-1` | Covered | `grade10-site-vault-retention-and-erasure-SC-21` |
| `grade10-site-vault-retention-and-erasure-US5-TC7-1` | Covered | `grade10-site-vault-retention-and-erasure-SC-15` — the page stands while a block has not been answered. The design's Loading row closes on the same scenario; the skeleton itself is a drawing and no requirement states it |
| `grade10-site-vault-retention-and-erasure-US5-TC8-1` | Covered | `grade10-site-vault-retention-and-erasure-SC-12` |
| `grade10-site-vault-retention-and-erasure-US5-TC9-1` | Covered | `grade10-site-vault-retention-and-erasure-SC-15` |
| Raised: does an unset window show as undecided, or not show at all? | Answered by the scenario pass | `grade10-site-vault-retention-and-erasure-SC-17` already reads an unset window as undecided, and the class shows either way. Landed as `Q34` in the change's `decisions.md`; `grade10-site-vault-retention-and-erasure-US5-TC12-1` walks it |
| Raised: four standings on the page against six on the console's panel | Answered by the scenario pass | The requirement tables all six in the collector's words — stalled reads that a check is out, refused that it was not accepted, neither naming a reason. Landed as `Q18`; `grade10-site-vault-retention-and-erasure-SC-20` and `grade10-site-vault-retention-and-erasure-SC-22` state them, and `grade10-site-vault-retention-and-erasure-US5-TC14-1` and `grade10-site-vault-retention-and-erasure-US5-TC15-1` walk them |
| `grade10-site-vault-retention-and-erasure-SC-13` | No case reached it | Case added: `grade10-site-vault-retention-and-erasure-US5-TC10-1`, the one case walking the foreign `grade10-site/vault/documents-and-signing` US-05 anchor `grade10-site-vault-retention-and-erasure-SC-13` carries; it traces this capability's own journey, which is the only anchor a trace beside this spec takes. The blind pass read the download as that capability's, which is where the bound and the page a collector who has signed nothing reads now stand; this page lists what was signed and offers the download |
| `grade10-site-vault-retention-and-erasure-SC-17` | No case reached it | Case added: `grade10-site-vault-retention-and-erasure-US5-TC12-1` — the blind pass raised the question instead of writing the case |
| `grade10-site-vault-retention-and-erasure-SC-18` | No case reached it | Case added: `grade10-site-vault-retention-and-erasure-US5-TC13-1` |
| `grade10-site-vault-retention-and-erasure-SC-39` | No case reached it | Case added: `grade10-site-vault-retention-and-erasure-US5-TC14-1`. The stalled standing was the second triple under `grade10-site-vault-retention-and-erasure-SC-20` before the split and now carries its own id; `grade10-site-vault-retention-and-erasure-US5-TC5-1` walks the check that is out |
| `grade10-site-vault-retention-and-erasure-SC-22`, the refused standing | Half reached | Case added: `grade10-site-vault-retention-and-erasure-US5-TC15-1`; `grade10-site-vault-retention-and-erasure-US5-TC3-1` walks a verified standing naming no document |
| `grade10-site-vault-retention-and-erasure-SC-24` | No case reached it | Case added: `grade10-site-vault-retention-and-erasure-US5-TC16-1`. Every ask case the blind pass wrote is a refusal or a hold; none files one |
| `grade10-site-vault-retention-and-erasure-SC-25` | No case reached it | Case added: `grade10-site-vault-retention-and-erasure-US5-TC17-1` |
| `grade10-site-vault-retention-and-erasure-SC-27` | No case reached it | Case added: `grade10-site-vault-retention-and-erasure-US5-TC18-1` |
| `grade10-site-vault-retention-and-erasure-SC-04`, `grade10-site-vault-retention-and-erasure-SC-05` and `grade10-site-vault-retention-and-erasure-SC-10` | No case reached them | US2 had no section: `grade10-site-vault-retention-and-erasure-US2-TC1-1`, `grade10-site-vault-retention-and-erasure-US2-TC2-1` and `grade10-site-vault-retention-and-erasure-US2-TC3-1` |
| `grade10-site-vault-retention-and-erasure-SC-01`, `grade10-site-vault-retention-and-erasure-SC-02` and `grade10-site-vault-retention-and-erasure-SC-03` | No case reached them | US3 had no section: `grade10-site-vault-retention-and-erasure-US3-TC2-1`, `grade10-site-vault-retention-and-erasure-US3-TC1-1` and `grade10-site-vault-retention-and-erasure-US3-TC3-1` |
| `grade10-site-vault-retention-and-erasure-SC-11` | Covered | `grade10-site-vault-retention-and-erasure-US1-TC3-1` reads the history keeping its entries and losing the person |

### Manual

| Manual | Why |
| --- | --- |
| `grade10-site-vault-retention-and-erasure-US1-TC5-1` | A person reads the hold and the erasure-waits line as words beside the filed request; an API test decides the hold, never the wording |
| `grade10-site-vault-retention-and-erasure-US1-TC6-1` | The same words before anything is filed, with the control withheld rather than refused on press |
| `grade10-site-vault-retention-and-erasure-US1-TC7-1` | A person reads both cases on one page and checks the closed one does not read as having cleared the hold |
| `grade10-site-vault-retention-and-erasure-US5-TC1-1` | The windows are read per class in the collector's words, which no assertion on a number decides |
| `grade10-site-vault-retention-and-erasure-US5-TC3-1` | A person sweeps the whole page for a name or a document rather than the standing block alone |
| `grade10-site-vault-retention-and-erasure-US5-TC9-1` | The error and the blocks that stayed are read together, which a failed request's assertion does not settle |
| `grade10-site-vault-retention-and-erasure-US5-TC10-1` | A person opens the downloaded file and counts what is in it against the list |
| `grade10-site-vault-retention-and-erasure-US5-TC16-1` | The confirmation's window and its cancel line are read before the ask is sent |
| `grade10-site-vault-retention-and-erasure-US5-TC17-1` | The page after the cancel is read back to the ask it started from |
