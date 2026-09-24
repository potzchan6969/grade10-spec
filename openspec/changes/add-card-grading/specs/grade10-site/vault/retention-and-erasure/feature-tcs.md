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
* The submission record remains as its own case-records class, 2,555 days from the same date, carrying the card list and the pickup code.
* The collector's name, email, phone and postal address are gone from it, and so is the person they named to collect.
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

### grade10-site-vault-retention-and-erasure-US4-TC3-1: Submission cancelled before hand-in is purged with the account

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
* The account holds no open vault case.

**Test data:**

| Field | Value |
| --- | --- |
| `<submission_3>` | A submission cancelled from `planned`, before hand-in, with no submission agreement, receipt or photograph ever created, carrying a submission record |

**Steps:**

1. Read `<submission_3>`'s retained data and the window its record stands under.
2. File the account's erasure ask, let its cancellation window pass uncancelled, and run grading's erasure for the account from the console.
3. Read `<submission_3>` again.

**Expected Results:**

* No submission agreement, receipt or photograph is held for `<submission_3>` at any point.
* Before the erasure its submission record stands as its own case-records class, 2,555 days from the cancellation date.
* `<submission_3>` refuses nothing: the erasure runs.
* After the erasure nothing of `<submission_3>` names the collector.
* No identity record exists for `<submission_3>` at any point.

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

### grade10-site-vault-retention-and-erasure-US4-TC6-1: Submission still with the grader is reported under no class

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

* `<submission_6>` was handed in and has not ended.
* The brand keeps agreements, photos and case records for 2,555 days.

**Test data:**

| Field | Value |
| --- | --- |
| `<submission_6>` | A submission `sent`, with the grader, carrying a sealed submission agreement, an intake receipt, hand-in photographs and a submission record, its drop-off 2,600 days ago |

**Steps:**

1. Run the retention review.

**Expected Results:**

* `<submission_6>` is reported under no class: not agreements, not photos, not case records.
* The age of its drop-off changes nothing; a window starts at an end event it has not reached.
* Nothing of `<submission_6>` is deleted or flagged for deletion.

### grade10-site-vault-retention-and-erasure-US4-TC7-1: Ended submissions and a never-booked one refuse nothing

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-vault-retention-and-erasure-US-04

**Pre-conditions:**

* The account holds `<submission_7>` alone, with no money due on it, and no open vault case.
* The collector filed the account's erasure ask and its cancellation window passed uncancelled.

**Test data:**

| `<submission_7>` | What the run leaves |
| --- | --- |
| `planned`, never booked | Nothing of it names the collector |
| `collected`, its cards gone with the collector | Its agreement, receipts and photographs under a named hold; the person gone |
| `cancelled` after the agreement was sealed | Its sealed papers under a named hold; the person gone |
| `expired`, never handed in | Nothing of it names the collector |
| Its last card paid out | Its sealed papers under a named hold; the person gone |

**Steps:**

1. Run grading's erasure for the account from the console.
2. Read what is left of `<submission_7>`.

**Expected Results:**

* `<submission_7>` refuses nothing: the erasure runs on every row.
* Grade10 leaves `<submission_7>` as the row states.

### grade10-site-vault-retention-and-erasure-US4-TC8-1: The ask is withheld in the collector's own words while cards are with the grader

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-vault-retention-and-erasure-US-04

**Pre-conditions:**

* customer(closed account) is signed in and on `<grade10 vault your data url>`.
* The account holds `<submission_8>` and no open vault case.

**Test data:**

| Field | Value |
| --- | --- |
| `<submission_8>` | A submission `sent`, its cards with the grader |

**Steps:**

1. Read the erasure block on Your data.

**Expected Results:**

* The ask is withheld, in the collector's own words: cards of theirs are with the grader.
* The words name the cards, never a status word and never an internal hold.
* The block offers no control to file the ask, and the page files nothing while it reads this way.

### grade10-site-vault-retention-and-erasure-US4-TC9-1: Owed mail goes with the erasure and the history keeps its entries

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

* `<submission_9>` reached `collected`.
* The collector filed the account's erasure ask, its cancellation window passed uncancelled, and an admin ran grading's erasure for the account from the console.

**Test data:**

| Field | Value |
| --- | --- |
| `<submission_9>` | A collected submission carrying one message still owed and history entries naming the collector on their own moves |

**Steps:**

1. Read `<submission_9>`'s owed messages and its history.

**Expected Results:**

* The owed message is deleted and nothing is sent for it.
* Every history entry stands, none deleted and none rewritten beyond its actor.
* The entries that named the collector name an erased collector.

### grade10-site-vault-retention-and-erasure-US4-TC10-1: The ask stays held while grading cannot say what stands in its way

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
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

## Settled

*None yet — suite pending review.*

## Reconciliation

Run: 2026-09-22, blind pass over the isolated input — this capability's `## Purpose` and `## Feature set`, its `user-journeys.md`, the change's `proposal.md` and its `decisions.md` with the `## Raised` table, `ui-design.md` with the state dispositions stripped, and the pages the proposal links; denied every `## Requirements` section, `openspec/specs/`, `openspec/changes/archive/` and `tech-design.md`. Reconciled the same day against the scenario pass's `grade10-site-vault-retention-and-erasure-SC-28` to `grade10-site-vault-retention-and-erasure-SC-37`. The change adds one journey, `grade10-site-vault-retention-and-erasure-US-04`, so the blind pass wrote under US4 alone; the journeys the durable spec already serves keep the suite they have.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `grade10-site-vault-retention-and-erasure-US4-TC1-1` | Covered, corrected | `grade10-site-vault-retention-and-erasure-SC-28` and `grade10-site-vault-retention-and-erasure-SC-35`. The draft read the erasure as leaving the submission record whole: it expected the collector's name, email, phone and postal address still on the record after the run. The erasure takes contact and address off every submission whichever class it falls in — the vault has held that since its own erasure requirement, and the compliance page the blind pass read states it — so the expectation now keeps the card list and the pickup code and loses the person. The record's window is the figure `grade10-site-vault-retention-and-erasure-SC-28` reads, 2,555 days |
| `grade10-site-vault-retention-and-erasure-US4-TC2-1` | Covered | `grade10-site-vault-retention-and-erasure-SC-29` |
| `grade10-site-vault-retention-and-erasure-US4-TC3-1` | Covered, corrected | `grade10-site-vault-retention-and-erasure-SC-36`, with the record's window from `grade10-site-vault-retention-and-erasure-SC-28`. The draft kept the submission record after the erasure of a submission nobody signed; the author's ruling on the raised `planned` question says it is purged with the account like any unsigned record. The case now reads the record and its 2,555-day window before the run and the purge after it |
| `grade10-site-vault-retention-and-erasure-US4-TC4-1` | Covered | `grade10-site-vault-retention-and-erasure-SC-31` — the `checked_in` row; `grade10-site-vault-retention-and-erasure-SC-32` — the unsettled upcharge and the uncollected cards |
| `grade10-site-vault-retention-and-erasure-US4-TC5-1` | Covered | `grade10-site-vault-retention-and-erasure-SC-31` — one live submission refuses the whole ask and the closed vault case beside it is untouched |
| Raised: does a submission still `planned` block or take part in the erasure? | Answered by the author | A `planned` submission was never booked, so it holds nothing and blocks nothing, and it is purged with the account like any unsigned record. Landed as `Q67` in the change's `decisions.md`; `grade10-site-vault-retention-and-erasure-SC-38` states it and `grade10-site-vault-retention-and-erasure-US4-TC7-1` walks it |
| Raised: what day count does the submission record's own class carry? | Answered by the scenario pass | The submission record is the vault's case-records class, 2,555 days under Grade10, which the requirement's class table already states and `grade10-site-vault-retention-and-erasure-SC-28` reads. Landed as `Q68`; the day count is on the vault's compliance page as a 🚧 row, and `grade10-site-vault-retention-and-erasure-US4-TC1-1` and `grade10-site-vault-retention-and-erasure-US4-TC3-1` carry the figure the blind pass left as a placeholder |
| `grade10-site-vault-retention-and-erasure-SC-30` | No case reached it | Case added: `grade10-site-vault-retention-and-erasure-US4-TC6-1`. Every retention case the blind pass wrote reads a submission that has ended; none reads one still with the grader |
| `grade10-site-vault-retention-and-erasure-SC-33` | Half reached | Case added: `grade10-site-vault-retention-and-erasure-US4-TC8-1`. `grade10-site-vault-retention-and-erasure-US4-TC4-1` files the ask and reads the refusal; the withheld words, and that nothing is filed at all, are this case's |
| `grade10-site-vault-retention-and-erasure-SC-34` | No case reached it | Case added: `grade10-site-vault-retention-and-erasure-US4-TC7-1`, a row per end event. The blind pass ran the erasure in its pre-conditions and never read the non-refusal as an outcome |
| `grade10-site-vault-retention-and-erasure-SC-37` | No case reached it | Case added: `grade10-site-vault-retention-and-erasure-US4-TC9-1` — owed mail and the history the erasure leaves standing |
| `grade10-site-vault-retention-and-erasure-SC-38` | Written on the ruling | `grade10-site-vault-retention-and-erasure-US4-TC7-1`'s first row |
| `grade10-site-vault-retention-and-erasure-US4-TC10-1` | Case added | The vault's end-to-end walk found the erasure block reading grading's holds with no case to walk when grading cannot answer. The rule is `grade10-site-vault-retention-and-erasure-SC-15` in `complete-vault-collector-flow`'s delta on this capability: a block that cannot be answered names what failed and leaves the answered blocks standing, so the ask block stays unanswered and offers nothing to file, as `grade10-site-vault-retention-and-erasure-SC-33` withholds it while cards are out |
| Design row `Erasure refused` | Closed | `ui-design.md`'s Your data state on the submission page reads `grade10-site-vault-retention-and-erasure-SC-33` |

### Manual

| Manual | Why |
| --- | --- |
| `grade10-site-vault-retention-and-erasure-US4-TC4-1` | A person reads the refusal as words on Your data — which submission it names and which hold it names — where an API test decides only that the ask was refused |
| `grade10-site-vault-retention-and-erasure-US4-TC5-1` | A person reads one refusal over two products on one page and checks the vault case beside it is not offered as erasable |
| `grade10-site-vault-retention-and-erasure-US4-TC8-1` | Nothing is filed, so no request exists for a test to assert on: the whole case is the words in the block and the control that is withheld rather than refused on press |
