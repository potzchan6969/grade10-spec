# grade10-site/vault/retention-and-erasure Test Cases

**Status:** in-review
**Drafts styled:** 2026-09-29, tcs-rules r4

## Background

Grade10 keeps agreements, photos and case records for 2,555 days (7 years) after a submission ends. `<grade10 vault your data url>` is `grade10.com/profile/data`, Your data, reached signed in. `<grade10 grading url>` is `grade10.com/grading`, where a collector plans a submission. `<grade10 admin erasure url>` is `admin.grade10.com/erasure`, the console's Account erasure page: a filed request opens its Checklist, one Erase button a product. Grading's dev seed (`/grading/dev/submissions/seed`) walks a submission to a named status through the desk's own acts, dated off the anchors it is given. The retention review runs on grading's slow sweep lane (`/grading/dev/sweep`, lane `slow`). No route moves a filed erasure request past its 7-day window; a case that runs the erasure ages the request in the stack's data.

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

### Manual

| Manual | Why |
| --- | --- |
| `grade10-site-vault-retention-and-erasure-US4-TC4-1` | A person reads the refusal as words on Your data — which submission it names and which hold it names — where an API test decides only that the ask was refused |
| `grade10-site-vault-retention-and-erasure-US4-TC5-1` | A person reads one refusal over two products on one page and checks the vault case beside it is not offered as erasable |
| `grade10-site-vault-retention-and-erasure-US4-TC8-1` | Nothing is filed, so no request exists for a test to assert on: the whole case is the words in the block and the control that is withheld rather than refused on press |
