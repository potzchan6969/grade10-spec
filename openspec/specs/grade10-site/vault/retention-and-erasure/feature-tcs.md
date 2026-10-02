# grade10-site/vault/retention-and-erasure Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-01, tcs-rules r4

## Background

Grade10 keeps agreements, photos and case records for 2,555 days (7 years) after a submission ends. `<grade10 vault your data url>` is `grade10.com/profile/data`, Your data, reached signed in. `<grade10 grading url>` is `grade10.com/grading`, where a collector plans a submission. `<grade10 admin erasure url>` is `admin.grade10.com/erasure`, the console's Account erasure page: a filed request opens its Checklist, one Erase button a product. Grading's dev seed (`/grading/dev/submissions/seed`) walks a submission to a named status through the desk's own acts, dated off the anchors it is given. The retention review runs on grading's slow sweep lane (`/grading/dev/sweep`, lane `slow`). No route moves a filed erasure request past its 7-day window; a case that runs the erasure ages the request in the stack's data.

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

### grade10-site-vault-retention-and-erasure-US2-TC4-1: A removed walk-in keeps no trace of the collector

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** destructive
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-retention-and-erasure-US-02

**Pre-conditions:**

* `<case_1>` is a draft staff opened for `<walk-in email>`; the customer signed in, viewed both photographs and changed its title; staff attached the two photographs.
* admin(staff, holds vault:operate) is signed in to the console.

**Steps:**

1. Cancel `<case_1>` from the console.
2. Read the API response for `<case_1>`'s history and photograph-read trail.
3. Run the vault's own erasure for `<walk-in email>`'s account.

**Expected Results:**

* Step 2 shows every entry still present: the collector's own entries name no collector, and staff's entries name staff.
* Step 2 reads no photograph and none of the item's words.
* After step 3, `<case_1>`'s history reads as step 2 read it.

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

## grade10-site-vault-retention-and-erasure-US4: Collector who graded cards is forgotten by the same request

**As a** collector who has closed their account after grading cards,
**I want** the one erasure request to reach my submissions as it reaches my vault cases, refused by name while a submission is between booked and ready, money is still due on one or ready cards are uncollected, and otherwise keeping only the sealed documents and the photographs in the vault's classes and the submission record in the vault's case records, each for the window the table names from the later of the day the submission ended and the day nothing is owed either way, and no identity record at all,
**so that** grading keeps nothing of mine the vault would not keep, and I ask once.

### grade10-site-vault-retention-and-erasure-US4-TC1-1: Ended submission's documents, photographs and record survive erasure

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-retention-and-erasure-US-04

**Pre-conditions:**

* `<submission_1>` is seeded at `collected` through grading's dev seed, under the collector's email.
* The account holds no open vault case.
* The account's request to be forgotten is filed and its 7-day window has passed uncancelled.
* admin(holds user:delete) is on `<grade10 admin erasure url>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<submission_1>` | A submission collected with a signed submission agreement, intake receipt, hand-back receipt, hand-in and hand-back photograph pairs, and a submission record naming the collector's name, email, phone, postal address, the card list, the pickup code and the messages |

**Steps:**

1. Open the account's request and its Checklist.
2. Click Erase beside Grading.
3. Read what grading keeps of `<submission_1>`: its documents, photographs and submission record.

**Expected Results:**

* The agreement, the hand-back receipt and the hand-in and hand-back photographs are kept under a hold named on `<submission_1>`.
* The collector's contact details, postal address and the person named to collect are gone.

### grade10-site-vault-retention-and-erasure-US4-TC2-1: Submission record's retention window starts at the end event

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
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

| `<end event>` | How the tester ends it | Recorded window start |
| --- | --- | --- |
| Collected | Seed it on to `collected` through grading's dev seed | The collection date |
| Cancelled | Seed it on to `cancelled` through grading's dev seed, then write to it for another reason | The cancellation date |
| Expired | Seed it at `planned` 30 days back and run grading's fast sweep lane | The plan's expiry date |
| Its last card paid out | Record the payout on its last card from the Money tab of the console's One submission page | The payout date |

**Steps:**

1. End `<submission_2>` by `<end event>`, as the row says.
2. Read the window start recorded for its submission record.

**Expected Results:**

* Grade10 reads the window start as the row states.

### grade10-site-vault-retention-and-erasure-US4-TC3-1: Submission cancelled before hand-in is purged with the account

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
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

**Test data:**

| Field | Value |
| --- | --- |
| `<submission_3>` | A submission cancelled from `planned`, before hand-in, with no submission agreement, receipt or photograph ever created, carrying a submission record |

**Steps:**

1. Read `<submission_3>`'s retained data and the window its record stands under.
2. As the collector, file the ask to be forgotten on `<grade10 vault your data url>`.
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

### grade10-site-vault-retention-and-erasure-US4-TC4-1: Live grading submission refuses the erasure ask by name

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-retention-and-erasure-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/uncollected.spec.ts`

**Pre-conditions:**

* The account holds `<submission_4>` and no open vault case.
* The account's request to be forgotten was filed before `<submission_4>` went live, and its 7-day window has passed uncancelled.
* `<submission_4>` is seeded at the row's status through grading's dev seed, under the account's email and user id.
* admin(holds user:delete) is on `<grade10 admin erasure url>`.

**Test data:**

| `<submission_4>` | Grading answers |
| --- | --- |
| `checked_in`, between booked and ready | Refused, naming `<submission_4>` and cards with the grader |
| `ready`, with an unsettled upcharge | Refused, naming `<submission_4>` and the money unsettled |
| `ready`, with cards uncollected | Refused, naming `<submission_4>` and the cards waiting to be collected |

**Steps:**

1. Open the account's request and its Checklist.
2. Click Erase beside Grading.
3. Read Grading's answer on the Checklist.

**Expected Results:**

* Grade10 answers as the row states.
* `<submission_4>` is not touched.

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
* `<submission_5>` is seeded at `sent` through grading's dev seed, under the account's email and user id.

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

### grade10-site-vault-retention-and-erasure-US4-TC6-1: Submission still with the grader is reported under no class

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-retention-and-erasure-US-04

**Pre-conditions:**

* `<submission_6>` was handed in and has not ended: seeded at `sent` through grading's dev seed, its anchors 2,600 days back.
* The brand keeps agreements, photos and case records for 2,555 days (7 years).

**Test data:**

| Field | Value |
| --- | --- |
| `<submission_6>` | A submission `sent`, with the grader, carrying a sealed submission agreement, an intake receipt, hand-in photographs and a submission record, its drop-off 2,600 days ago (about 7.1 years, past every window) |

**Steps:**

1. Run the retention review on grading's slow sweep lane.
2. Read the classes the review reports `<submission_6>` under.

**Expected Results:**

* `<submission_6>` is reported under no class: not agreements, not photos, not case records.
* Nothing of `<submission_6>` is deleted or flagged for deletion.

### grade10-site-vault-retention-and-erasure-US4-TC7-1: Ended submissions and a never-booked one refuse nothing

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-retention-and-erasure-US-04

**Pre-conditions:**

* The account holds `<submission_7>` alone, with no money due on it, and no open vault case.
* `<submission_7>` is brought to the row's state: seeded at that status through grading's dev seed, or, for the paid-out row, its last card's payout recorded from the Money tab of the console's One submission page.
* The account's request to be forgotten is filed and its 7-day window has passed uncancelled.
* admin(holds user:delete) is on `<grade10 admin erasure url>`.

**Test data:**

| `<submission_7>` | What the run leaves |
| --- | --- |
| `planned`, never booked | Nothing of it names the collector |
| `collected`, its cards gone with the collector | — |
| `cancelled` after the agreement was sealed | — |
| `expired`, never handed in | — |
| Its last card paid out | — |

**Steps:**

1. Open the account's request and its Checklist.
2. Click Erase beside Grading.
3. Read what is left of `<submission_7>`.

**Expected Results:**

* `<submission_7>` refuses nothing: the erasure runs on every row.
* On the `planned` row, Grade10 leaves `<submission_7>` as the row states.

### grade10-site-vault-retention-and-erasure-US4-TC8-1: The ask is withheld in the collector's own words while cards are with the grader

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
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

### grade10-site-vault-retention-and-erasure-US4-TC9-1: Owed mail goes with the erasure and the history keeps its entries

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-retention-and-erasure-US-04

**Pre-conditions:**

* `<submission_9>` reached `collected`.
* The account's request to be forgotten is filed and its 7-day window has passed uncancelled.
* admin(holds user:delete) is on `<grade10 admin erasure url>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<submission_9>` | A collected submission carrying one message still owed and history entries naming the collector on their own moves |

**Steps:**

1. Open the account's request and its Checklist.
2. Click Erase beside Grading.
3. Read `<submission_9>`'s owed messages and its history.

**Expected Results:**

* The owed message is deleted and nothing is sent for it.
* Every history entry stands, none deleted and none rewritten beyond its actor.
* The entries that named the collector name an erased collector.

### grade10-site-vault-retention-and-erasure-US4-TC10-1: The ask stays held while grading cannot say what stands in its way

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
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

### grade10-site-vault-retention-and-erasure-US4-TC11-1: A submission past its window is reported under each class it holds

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-retention-and-erasure-US-04

**Pre-conditions:**

* The brand keeps agreements, photos and case records for 2,555 days (7 years).
* `<submission_11>` is seeded at `collected` through grading's dev seed, its anchors 2,600 days back.

**Test data:**

| Field | Value |
| --- | --- |
| `<submission_11>` | A submission collected 2,600 days ago (about 7.1 years, past every window), carrying a sealed agreement, both receipts, the hand-in and hand-back photographs and a submission record |

**Steps:**

1. Run the retention review on grading's slow sweep lane.
2. Read the classes the review reports `<submission_11>` under.

**Expected Results:**

* `<submission_11>` is reported under agreements, photos and case records.
* It is reported under no identity class.

### grade10-site-vault-retention-and-erasure-US4-TC12-1: A transfer not yet received holds the window

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
* **Trace:** grade10-site-vault-retention-and-erasure-US-04

**Pre-conditions:**

* Grading's slow sweep lane is run as the Background says.

**Test data:**

| Field | Value |
| --- | --- |
| <submission_12> | a submission whose last card was paid out by transfer 2,600 days ago and marked received 2,550 days ago |

**Steps:**

1. Run the retention review.
2. Read the classes the review reports `<submission_12>` under.

**Expected Results:**

* Step 2: `<submission_12>` is reported under no class, its windows measured from the day the transfer was marked received.

---

### grade10-site-vault-retention-and-erasure-US4-TC13-1: A repayment due on a collected submission refuses the erasure

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-retention-and-erasure-US-04

**Pre-conditions:**

* admin(holds the erasure grant) is on `<grade10 admin erasure url>` with the collector's request filed and aged past its window.

**Test data:**

| Field | Value |
| --- | --- |
| <submission_13> | the collector's only submission, collected, a card on it found and its payout reversed, the repayment unpaid |

**Steps:**

1. Click Erase on grading.

**Expected Results:**

* Step 1: refused, naming `<submission_13>` and the money unsettled.

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
| Raised: does an unset window show as undecided, or not show at all? | Answered by the scenario pass | `grade10-site-vault-retention-and-erasure-SC-17` already reads an unset window as undecided, and the class shows either way. Landed as Q34 in the change's `decisions.md`; `grade10-site-vault-retention-and-erasure-US5-TC12-1` walks it |
| Raised: four standings on the page against six on the console's panel | Answered by the scenario pass | The requirement tables all six in the collector's words — stalled reads that a check is out, refused that it was not accepted, neither naming a reason. Landed as Q18; `grade10-site-vault-retention-and-erasure-SC-20` and `grade10-site-vault-retention-and-erasure-SC-22` state them, and `grade10-site-vault-retention-and-erasure-US5-TC14-1` and `grade10-site-vault-retention-and-erasure-US5-TC15-1` walk them |
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

Run: 2026-09-22, blind pass over the isolated input — this capability's `## Purpose` and `## Feature set`, its `user-journeys.md`, the change's `proposal.md` and its `decisions.md` with the `## Raised` table, `ui-design.md` with the state dispositions stripped, and the pages the proposal links; denied every `## Requirements` section, `openspec/specs/`, `openspec/changes/archive/` and `tech-design.md`. Reconciled the same day against the scenario pass's `grade10-site-vault-retention-and-erasure-SC-28` to `grade10-site-vault-retention-and-erasure-SC-37`. The change adds one journey, `grade10-site-vault-retention-and-erasure-US-04`, so the blind pass wrote under US4 alone; the journeys the durable spec already serves keep the suite they have.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `grade10-site-vault-retention-and-erasure-US4-TC1-1` | Covered, corrected | `grade10-site-vault-retention-and-erasure-SC-28` and `grade10-site-vault-retention-and-erasure-SC-35`. The draft read the erasure as leaving the submission record whole: it expected the collector's name, email, phone and postal address still on the record after the run. The erasure takes contact and address off every submission whichever class it falls in — the vault has held that since its own erasure requirement, and the compliance page the blind pass read states it — so the expectation now keeps the card list and the pickup code and loses the person. The record's window is the figure `grade10-site-vault-retention-and-erasure-SC-28` reads, 2,555 days |
| `grade10-site-vault-retention-and-erasure-US4-TC2-1` | Covered | `grade10-site-vault-retention-and-erasure-SC-29` |
| `grade10-site-vault-retention-and-erasure-US4-TC3-1` | Covered, corrected | `grade10-site-vault-retention-and-erasure-SC-36`, with the record's window from `grade10-site-vault-retention-and-erasure-SC-28`. The draft kept the submission record after the erasure of a submission nobody signed; the author's ruling on the raised `planned` question says it is purged with the account like any unsigned record. The case now reads the record and its 2,555-day window before the run and the purge after it |
| `grade10-site-vault-retention-and-erasure-US4-TC4-1` | Covered | `grade10-site-vault-retention-and-erasure-SC-31` — the `checked_in` row; `grade10-site-vault-retention-and-erasure-SC-32` — the unsettled upcharge and the uncollected cards |
| `grade10-site-vault-retention-and-erasure-US4-TC5-1` | Covered | `grade10-site-vault-retention-and-erasure-SC-31` — one live submission refuses the whole ask and the closed vault case beside it is untouched |
| Raised: does a submission still `planned` block or take part in the erasure? | Answered by the author | A `planned` submission was never booked, so it holds nothing and blocks nothing, and it is purged with the account like any unsigned record. Landed as Q67 in the change's `decisions.md`; `grade10-site-vault-retention-and-erasure-SC-38` states it and `grade10-site-vault-retention-and-erasure-US4-TC7-1` walks it |
| Raised: what day count does the submission record's own class carry? | Answered by the scenario pass | The submission record is the vault's case-records class, 2,555 days under Grade10, which the requirement's class table already states and `grade10-site-vault-retention-and-erasure-SC-28` reads. Landed as Q68; the day count is on the vault's compliance page as a 🚧 row, and `grade10-site-vault-retention-and-erasure-US4-TC1-1` and `grade10-site-vault-retention-and-erasure-US4-TC3-1` carry the figure the blind pass left as a placeholder |
| `grade10-site-vault-retention-and-erasure-SC-30` | No case reached it | Case added: `grade10-site-vault-retention-and-erasure-US4-TC6-1`. Every retention case the blind pass wrote reads a submission that has ended; none reads one still with the grader |
| `grade10-site-vault-retention-and-erasure-SC-33` | Half reached | Case added: `grade10-site-vault-retention-and-erasure-US4-TC8-1`. `grade10-site-vault-retention-and-erasure-US4-TC4-1` files the ask and reads the refusal; the withheld words, and that nothing is filed at all, are this case's |
| `grade10-site-vault-retention-and-erasure-SC-34` | No case reached it | Case added: `grade10-site-vault-retention-and-erasure-US4-TC7-1`, a row per end event. The blind pass ran the erasure in its pre-conditions and never read the non-refusal as an outcome |
| `grade10-site-vault-retention-and-erasure-SC-37` | No case reached it | Case added: `grade10-site-vault-retention-and-erasure-US4-TC9-1` — owed mail and the history the erasure leaves standing |
| `grade10-site-vault-retention-and-erasure-SC-38` | Written on the ruling | `grade10-site-vault-retention-and-erasure-US4-TC7-1`'s first row |
| `grade10-site-vault-retention-and-erasure-US4-TC10-1` | Case added | The vault's end-to-end walk found the erasure block reading grading's holds with no case to walk when grading cannot answer. The rule is `grade10-site-vault-retention-and-erasure-SC-15` in `complete-vault-collector-flow`'s delta on this capability: a block that cannot be answered names what failed and leaves the answered blocks standing, so the ask block stays unanswered and offers nothing to file, as `grade10-site-vault-retention-and-erasure-SC-33` withholds it while cards are out |
| Design row `Erasure refused` | Closed | `ui-design.md`'s Your data table, the vault's Your data block, reads `grade10-site-vault-retention-and-erasure-SC-33` |
| `grade10-site-vault-retention-and-erasure-SC-42` | Case added at the acceptance review | `grade10-site-vault-retention-and-erasure-US4-TC12-1`: the window waits for nothing owed either way, Q20's own reading |
| `grade10-site-vault-retention-and-erasure-SC-43` | Case added at the acceptance review | `grade10-site-vault-retention-and-erasure-US4-TC13-1`: a reversed payout's repayment is money unsettled on a collected submission, decided by the product owner, 2026-10-01 |

**Run:** written at the acceptance review of 2026-10-01, which found that the walk-in's removal reuses the unsigned-case purge (Q23) and that the actor rewrite reaches a case through its owner, which the removal clears. No blind pass ran for this capability.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `grade10-site-vault-retention-and-erasure-SC-44` | Case added | `grade10-site-vault-retention-and-erasure-US2-TC4-1` |

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
| `grade10-site-vault-retention-and-erasure-US4-TC4-1` | A person reads the refusal as words on Your data — which submission it names and which hold it names — where an API test decides only that the ask was refused |
| `grade10-site-vault-retention-and-erasure-US4-TC5-1` | A person reads one refusal over two products on one page and checks the vault case beside it is not offered as erasable |
| `grade10-site-vault-retention-and-erasure-US4-TC8-1` | Nothing is filed, so no request exists for a test to assert on: the whole case is the words in the block and the control that is withheld rather than refused on press |
| `grade10-site-vault-retention-and-erasure-US2-TC4-1` | Layer api: the worker's test reads the purged history and the rewrite; a person runs the erasure on staging |
