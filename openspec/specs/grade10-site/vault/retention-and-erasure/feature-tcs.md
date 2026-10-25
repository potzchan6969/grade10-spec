# grade10-site/vault/retention-and-erasure Test Cases

**Status:** pending-review · 0/16
**Drafts styled:** 2026-10-25, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7
**Out of suite (non-GUI):** grade10-site-vault-retention-and-erasure-SC-01, grade10-site-vault-retention-and-erasure-SC-02, grade10-site-vault-retention-and-erasure-SC-03 - the retention review's report, which no screen shows

## Background

* Grade10 keeps agreements, photos and case records for 2,555 days after a case or submission ends. Your data is `<g10url>/profile/data`, read signed in.
* The console's Account erasure page lists filed requests to be forgotten; a request's Checklist offers Erase per product, run by admin(holds `user:delete`) once the request's seven days have passed uncancelled. A test ages a request past its window in the stack's data.
* A case or submission after an erasure is read on its console page by admin(holds `vault:operate`); grading's submissions are brought to a status through grading's own dev seed.

## Walk 1: Read Your data, ask, and be forgotten

Starting state:

- customer(collector) signed in, with one released vault case and nothing in flight.

Shared test data:

| Field | Value |
| --- | --- |
| released case | a case whose item went home after a signed agreement |

### Route

1. Open Your data.
   - Each class with its window, the identity standing, and the signed documents under their case. `g10.vault-retention-and-erasure.US5-TC1`
2. As admin, once the request is filed and its window passed, Erase beside Vault.
   - It runs; the sealed documents and identity stay under a named hold; the contact details go. `g10.vault-retention-and-erasure.US1-TC1`
3. Read `<released case>`'s history.
   - Every entry stands; the collector's own name an erased collector. `g10.vault-retention-and-erasure.US1-TC2`

## g10.vault-retention-and-erasure.US1: Collector asks to be forgotten and the vault answers for its own data

**As a** collector who has closed their account,
**I want** the vault to delete what it holds about me,
**so that** nothing of mine is kept beyond the record of agreements I actually
signed.

<!-- trace:case id=g10.vault-retention-and-erasure.TC-aow rev=1 -->
### g10.vault-retention-and-erasure.US1-TC1: The vault's erasure keeps a signed case's evidence under a hold and drops everything else of the person

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
* **Trace:** grade10-site-vault-retention-and-erasure-US-01

**Pre-conditions:**

* The collector, `<holding>`, has a request filed with its window passed; admin(holds `user:delete`) has its Checklist open.

**Test data:**

| `<holding>` | `<afterwards>` |
| --- | --- |
| a case cancelled before anything was signed | its photographs and item text gone, its identity released, the case naming no person |
| a released case with a signed agreement | its sealed documents, identity record and photograph kept under a hold named on it; the contact details gone |
| a case carrying an owed message | the message deleted, never sent |
| no vault case ever | nothing refuses the run, and the vault names nothing it holds of them |

**Steps:**

1. Select Erase beside Vault.
2. Read the case on its console page, where there is one.

**Expected Results:**

* Step 1 runs; step 2 reads `<afterwards>`.

<!-- trace:case id=g10.vault-retention-and-erasure.TC-s4i rev=1 -->
### g10.vault-retention-and-erasure.US1-TC2: After an erasure every history entry stands, and none names the person

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** What cannot be rewritten

**Pre-conditions:**

* The collector's released case has history entries naming them on their own moves and staff on theirs; their erasure has run.

**Steps:**

1. Read the case's history on its console page.

**Expected Results:**

* Every entry is still there; the collector's own name an erased collector, and staff entries are as they were.

<!-- trace:case id=g10.vault-retention-and-erasure.TC-rb3 rev=1 -->
### g10.vault-retention-and-erasure.US1-TC3: The ask is withheld by name while the vault still holds something

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
* **Trace:** grade10-site-vault-retention-and-erasure-US-01

**Pre-conditions:**

* customer(collector) is on Your data, with no request open, `<holding>`.

**Test data:**

| `<holding>` | `<named>` |
| --- | --- |
| an item in the vault | that case, as an item in the vault |
| a running loan | that case, as a loan still running |
| a request in flight | that case, as a request not yet ended |

**Steps:**

1. Read the ask's block, and try to ask to be forgotten.

**Expected Results:**

* The ask is refused, naming `<named>` by reference; no request is filed.

<!-- trace:case id=g10.vault-retention-and-erasure.TC-l68 rev=1 -->
### g10.vault-retention-and-erasure.US1-TC4: A hold that arrives after the ask is named beside the open request

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-retention-and-erasure-US-01

**Pre-conditions:**

* customer(collector) has a request filed, then puts an item in the vault.

**Steps:**

1. Open Your data.

**Expected Results:**

* The request still reads with the day it was filed, and beside it the hold, naming the case.

---

## g10.vault-retention-and-erasure.US2: Admin runs an erasure without touching a live case

**As an** admin running a person's erasure,
**I want** to be told which of their cases are still in flight rather than
having them erased,
**so that** nobody's item or debt disappears from the record while it still
exists.

<!-- trace:case id=g10.vault-retention-and-erasure.TC-km2 rev=1 -->
### g10.vault-retention-and-erasure.US2-TC1: A running loan refuses the vault's erasure by name and touches no case

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-retention-and-erasure-US-02

**Pre-conditions:**

* The collector holds one closed case and one running loan; a request was filed with its window passed; admin(holds `user:delete`) has its Checklist open.

**Steps:**

1. Select Erase beside Vault.
2. Read both cases.

**Expected Results:**

* Step 1 is refused, naming the running case.
* Step 2: neither case has changed.

<!-- trace:case id=g10.vault-retention-and-erasure.TC-f2t rev=1 -->
### g10.vault-retention-and-erasure.US2-TC2: A removed walk-in is purged and keeps only staff's own history

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-retention-and-erasure-US-02

**Pre-conditions:**

* Staff opened a walk-in draft for the collector, whose title the collector changed after signing in; admin(holds `vault:operate`) is on it.

**Steps:**

1. Cancel the draft.
2. Read its history and what it holds.

**Expected Results:**

* Its photographs and item text are gone; its history names no collector, and staff's entries stand.

---

## g10.vault-retention-and-erasure.US3: Compliance officer sees what is being kept too long

**As an** admin answerable for what we keep,
**I want** a list of closed cases past the window for each class, and to be
told which windows nobody has decided,
**so that** deleting is a decision somebody makes rather than something that
happens on a clock.

---

## g10.vault-retention-and-erasure.US4: Collector who graded cards is forgotten by the same request

**As a** collector who has closed their account after grading cards,
**I want** the one erasure request to reach my submissions as it reaches my vault cases, refused by name while a submission is between booked and ready, money is still due on one or ready cards are uncollected, and otherwise keeping only the sealed documents and the photographs in the vault's classes and the submission record in the vault's case records, each for the window the table names from the later of the day the submission ended and the day nothing is owed either way, and no identity record at all,
**so that** grading keeps nothing of mine the vault would not keep, and I ask once.

<!-- trace:case id=g10.vault-retention-and-erasure.TC-lzf rev=1 covers=g10.vault-retention-and-erasure.SC-4zz,g10.vault-retention-and-erasure.SC-1ly -->
### g10.vault-retention-and-erasure.US4-TC4: A live submission, money due, or cards waiting refuse grading's erasure by name

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
* **Trace:** grade10-site-vault-retention-and-erasure-US-04

**Pre-conditions:**

* The collector holds `<submission>` and no open vault case; a request was filed with its window passed; admin(holds `user:delete`) has its Checklist open.

**Test data:**

| `<submission>` | `<refusal names>` |
| --- | --- |
| checked in, between booked and ready | the submission, and cards with the grader |
| ready, an upcharge unsettled | the submission, and the money unsettled |
| ready, its cards uncollected | the submission, and the cards waiting to be collected |
| collected, a card found and its payout reversed, the repayment unpaid | the submission, and the money unsettled |

**Steps:**

1. Select Erase beside Grading.

**Expected Results:**

* It is refused, naming `<refusal names>`; the submission is not touched.

<!-- trace:case id=g10.vault-retention-and-erasure.TC-56f rev=1 covers=g10.vault-retention-and-erasure.SC-4zz,g10.vault-retention-and-erasure.SC-1ly -->
### g10.vault-retention-and-erasure.US4-TC7: Submissions that have all ended, or were never booked, refuse nothing

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
* **Trace:** grade10-site-vault-retention-and-erasure-US-04

**Pre-conditions:**

* The collector holds `<submission>` alone, nothing due, no open vault case; a request was filed with its window passed; admin(holds `user:delete`) has its Checklist open.

**Test data:**

| `<submission>` | `<afterwards>` |
| --- | --- |
| planned, never booked | purged, nothing of it naming the collector |
| collected | kept as US4-TC1 reads |
| cancelled after its agreement was sealed | kept as US4-TC1 reads |
| expired, never handed in | nothing of it naming the collector |
| collected, its last card paid out | kept as US4-TC1 reads |

**Steps:**

1. Select Erase beside Grading, and read the submission.

**Expected Results:**

* It runs; the submission reads `<afterwards>`.

<!-- trace:case id=g10.vault-retention-and-erasure.TC-ggi rev=1 covers=g10.vault-retention-and-erasure.SC-4zz,g10.vault-retention-and-erasure.SC-1ly -->
### g10.vault-retention-and-erasure.US4-TC1: A collected submission keeps its papers, photographs and record, and loses the person

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-retention-and-erasure-US-04

**Pre-conditions:**

* The collector's submission is collected against a sealed agreement, an intake and a hand-back receipt, and hand-in and hand-back photographs; a request was filed with its window passed; admin(holds `user:delete`) has its Checklist open.

**Steps:**

1. Select Erase beside Grading.
2. Read the submission on its console page.

**Expected Results:**

* The agreement, the hand-back receipt and the photographs are kept under a hold named on it.
* The collector's contact details, postal address and the person named to collect are gone; no identity record is held.

<!-- trace:case id=g10.vault-retention-and-erasure.TC-50v rev=2 covers=g10.vault-retention-and-erasure.SC-4zz,g10.vault-retention-and-erasure.SC-1ly -->
### g10.vault-retention-and-erasure.US4-TC3: A submission cancelled before anyone signed keeps nothing of the person

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-retention-and-erasure-US-04

**Pre-conditions:**

* The collector planned a submission on `<g10url>/grading` and cancelled it before drop-off; a request was filed with its window passed; admin(holds `user:delete`) has its Checklist open.

**Steps:**

1. Read the submission on its console page.
2. Select Erase beside Grading, and read it again.

**Expected Results:**

* Step 1 shows no agreement, receipt, photograph or identity record, its record held 2,555 days from the cancellation.
* Step 2: the run is not refused; nothing of the submission names the collector, and no signing data remains.

<!-- trace:case id=g10.vault-retention-and-erasure.TC-kwk rev=1 covers=g10.vault-retention-and-erasure.SC-4zz,g10.vault-retention-and-erasure.SC-1ly -->
### g10.vault-retention-and-erasure.US4-TC9: Owed grading mail goes, and the history keeps its entries without the person

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-retention-and-erasure-US-04

**Pre-conditions:**

* The collector's collected submission carries one owed message and history entries naming them on their own moves; a request was filed with its window passed.

**Steps:**

1. As admin(holds `user:delete`), select Erase beside Grading.
2. Read the submission's messages and history.

**Expected Results:**

* The owed message is deleted, never sent; every history entry stands, the collector's own naming an erased collector.

<!-- trace:case id=g10.vault-retention-and-erasure.TC-1f0 rev=1 covers=g10.vault-retention-and-erasure.SC-4zz,g10.vault-retention-and-erasure.SC-1ly -->
### g10.vault-retention-and-erasure.US4-TC8: The ask is filed while cards are with the grader, and Your data names them as its hold

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-retention-and-erasure-US-04

**Pre-conditions:**

* customer(collector) is on Your data, with no vault case and a submission sent to the grader.

**Steps:**

1. Ask to be forgotten, and confirm.
2. Read Your data.

**Expected Results:**

* Step 1 files the request.
* Step 2 reads the request with its days, and beside it that cards of theirs are with the grader, in the collector's words, with no status word or internal hold.

---

## g10.vault-retention-and-erasure.US5: Collector reads what the vault keeps about them

**As a** collector,
**I want** one page that says what is kept, for how long, where my identity
stands, and where I ask to be forgotten,
**so that** I know what I am asking for before I ask.

<!-- trace:case id=g10.vault-retention-and-erasure.TC-pb2 rev=1 covers=g10.vault-retention-and-erasure.SC-j8k,g10.vault-retention-and-erasure.SC-4vv,g10.vault-retention-and-erasure.SC-1hs,g10.vault-retention-and-erasure.SC-sxi,g10.vault-retention-and-erasure.SC-4ye,g10.vault-retention-and-erasure.SC-ry3,g10.vault-retention-and-erasure.SC-9u2,g10.vault-retention-and-erasure.SC-zcq,g10.vault-retention-and-erasure.SC-avy,g10.vault-retention-and-erasure.SC-1jf,g10.vault-retention-and-erasure.SC-8wl -->
### g10.vault-retention-and-erasure.US5-TC1: Your data names each class with its window, the cases it applies to, and every signed document once

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
* **Trace:** grade10-site-vault-retention-and-erasure-US-05

**Pre-conditions:**

* customer(collector) is signed in, with `<cases>`; `<windows>`.

**Test data:**

| `<cases>` | `<windows>` | `<page reads>` |
| --- | --- | --- |
| two released cases with sealed documents, one past its window | every class has a window | each class with its window in days after a case ends; a line that review deletes nothing by itself; the case past its window unchanged; every sealed document under its case, offered once |
| one released case | no window set for identity records | identity records reading that the window is being decided, never zero or forever |
| one running loan | every class has a window | the running case carries no class or window |

**Steps:**

1. Open Your data, then each case named.

**Expected Results:**

* It reads `<page reads>`; an ended case's own page carries the same classes and windows.

<!-- trace:case id=g10.vault-retention-and-erasure.TC-fpf rev=1 covers=g10.vault-retention-and-erasure.SC-j8k,g10.vault-retention-and-erasure.SC-4vv,g10.vault-retention-and-erasure.SC-1hs,g10.vault-retention-and-erasure.SC-sxi,g10.vault-retention-and-erasure.SC-4ye,g10.vault-retention-and-erasure.SC-ry3,g10.vault-retention-and-erasure.SC-9u2,g10.vault-retention-and-erasure.SC-zcq,g10.vault-retention-and-erasure.SC-avy,g10.vault-retention-and-erasure.SC-1jf,g10.vault-retention-and-erasure.SC-8wl -->
### g10.vault-retention-and-erasure.US5-TC2: The identity standing reads in the collector's words and never names them or their document

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
* **Trace:** grade10-site-vault-retention-and-erasure-US-05

**Pre-conditions:**

* customer(collector) is signed in, their identity `<state>`.

**Test data:**

| `<state>` | `<standing reads>` |
| --- | --- |
| bound, expiring on a later day | verified until that day, with how and when it was checked |
| a check started, undecided | a check out, since the day it started |
| a check started long enough ago to stand as stalled | a check out, since the day it started |
| the last check expired | lapsed, on the day it expired |
| never asked for | none on file, to be verified at the next visit |
| the last check refused | not accepted, on the day decided, with no reason |

**Steps:**

1. Open Your data, and read the standing.

**Expected Results:**

* It reads `<standing reads>`; no legal name, date of birth, document type or number, expiry or photograph shows anywhere on the page.

<!-- trace:case id=g10.vault-retention-and-erasure.TC-2ih rev=1 covers=g10.vault-retention-and-erasure.SC-j8k,g10.vault-retention-and-erasure.SC-4vv,g10.vault-retention-and-erasure.SC-1hs,g10.vault-retention-and-erasure.SC-sxi,g10.vault-retention-and-erasure.SC-4ye,g10.vault-retention-and-erasure.SC-ry3,g10.vault-retention-and-erasure.SC-9u2,g10.vault-retention-and-erasure.SC-zcq,g10.vault-retention-and-erasure.SC-avy,g10.vault-retention-and-erasure.SC-1jf,g10.vault-retention-and-erasure.SC-8wl -->
### g10.vault-retention-and-erasure.US5-TC5: A part of Your data that cannot load leaves the rest standing

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
* **Trace:** grade10-site-vault-retention-and-erasure-US-05

**Pre-conditions:**

* customer(collector) is signed in, with no request open; `<failure>`.

**Test data:**

| `<failure>` | `<page shows>` |
| --- | --- |
| the response has not yet arrived | skeleton cards in place of the table, standing and documents |
| the identity standing cannot be answered | the standing named as failed; what is kept, the documents, the holds and the ask still shown |
| grading cannot say what stands in the way | that grading's holds could not be read; the ask not offered; what is kept still shown |
| the page's request fails after some cards rendered | the error message; the rendered cards still in place |

**Steps:**

1. Open Your data.

**Expected Results:**

* It shows `<page shows>`, and files nothing.

<!-- trace:case id=g10.vault-retention-and-erasure.TC-whu rev=1 -->
### g10.vault-retention-and-erasure.US5-TC4: Your data opens only to its account holder

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-retention-and-erasure-US-05

**Pre-conditions:**

* Nobody is signed in on `<g10url>`.

**Steps:**

1. Open Your data's address.

**Expected Results:**

* It asks for sign-in, and shows nothing of any account.

## Settled

- A class whose window nobody set shows in the same table, its window reading that it is being decided.
- All six identity standings read in the collector's words; a stalled check reads as out, a refused one as not accepted, neither with a reason.
- The signed-document download is `grade10-site/vault/documents-and-signing`'s; this page lists the documents and offers it.
- Filing the ask while the vault holds something is refused by name before anything is filed, naming each case and hold (Q16). A live grading submission does not stop the filing; grading's erasure refuses when an admin runs it (Q15).
- Filing the ask, cancelling it inside the window, and the cancel refused once the window passed are `shared/auth/users`' and walked there on Your data.
