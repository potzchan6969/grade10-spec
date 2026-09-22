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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-retention-and-erasure-US-01

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-retention-and-erasure-US-01

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-retention-and-erasure-US-01

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-retention-and-erasure-US-05

**Pre-conditions:**

* The collector is signed in and has at least one vault case.

**Test data:**

| Class | Window |
| --- | --- |
| Agreements | 2,555 days after the case ends |
| Identity records | 1,825 days after the case ends |
| Item photographs | 2,555 days after the case ends |

**Steps:**

1. Navigate to <vault your data url>.

**Expected Results:**

* What the vault keeps lists agreements, identity records and item
  photographs, each with its window from Test data.
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
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-retention-and-erasure-US-05

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
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-retention-and-erasure-US-05

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
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-retention-and-erasure-US-05

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-retention-and-erasure-US-05

**Pre-conditions:**

* The collector is signed in on <vault your data url>, and the page's data
  request is made to fail.

**Steps:**

1. Navigate to <vault your data url>.

**Expected Results:**

* The error message shows.
* Any cards that already rendered stay in place.

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| grade10-site/vault/retention-and-erasure | Does Your data show a distinct "undecided" window for a retention class whose days-after-case-end figure is unset, or does an unset window simply not render until Legal confirms it? |  |
| grade10-site/vault/retention-and-erasure | Your data's identity standing names four states — verified, none, check out, lapsed — while the identity-check capability's console panel names six (also Stalled and Refused). Does the collector's own page fold Stalled and Refused into one of the four shown, or omit them until the check resolves to one of the four? |  |

## Settled
