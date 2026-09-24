# grade10-site/grading/submission-plan Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-22, tcs-rules r3.0
**Out of suite:** grade10-site-grading-submission-plan-SC-02

## Background

Grade10's currency is HKD; every amount below is stated in minor units with its ISO 4217 code. `<grade10 grading url>` is `grade10.com/grading`, the collector's grading home and the plan wizard it mounts; `<grade10 grading submission url>` is one submission's own page.

## grade10-site-grading-submission-plan-US1: Collector learns what grading costs before signing in

**As a** collector who has never used the shop for grading,
**I want** the first visit to say what grading is, the four steps and the price sheet with its cover line, and to let me start a submission or book a drop-off without a list,
**so that** I know the fee and the return date before I give anyone my name.

### grade10-site-grading-submission-plan-US1-TC1-1: The signed-out home explains grading before any details are given

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-01

**Pre-conditions:**

* `customer(no account)` is signed out, `<grade10 grading url>`.

**Steps:**

1. Navigate to `<grade10 grading url>`.
2. Read the page before entering a name, email or phone.

**Expected Results:**

* The four-step explanation of how grading works renders, with no name, email or phone asked for.
* The fee sheet lists the first grader's levels, each with its declared-value ceiling, cards a submission, fee a card and weeks back.
* Start a submission and Book a drop-off without a list are both offered.

### grade10-site-grading-submission-plan-US1-TC2-1: The fee sheet's cover line shows only at Express and Super Express

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-01

**Pre-conditions:**

* `customer(no account)` is signed out, `<grade10 grading url>`.

**Steps:**

1. Read the fee sheet's Value, Regular and Bulk rows.
2. Read the fee sheet's Express and Super Express rows.

**Expected Results:**

* Value, Regular and Bulk name no cover rate.
* Express and Super Express each name a cover rate of 1.5% of the declared value a card.

### grade10-site-grading-submission-plan-US1-TC3-1: Multiple graders show as a tab per grader on the fee sheet

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-01

**Pre-conditions:**

* `customer(no account)` is signed out, `<grade10 grading url>`.
* PSA, CGC and BGS each carry a fee sheet.

**Steps:**

1. Read the fee sheet section.
2. Switch to CGC's tab.

**Expected Results:**

* A tab per grader shows above the fee sheet: PSA, CGC, BGS.
* CGC's tab shows CGC's own levels, replacing PSA's.

### grade10-site-grading-submission-plan-US1-TC4-1: Starting a submission opens an empty plan wizard

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-01

**Pre-conditions:**

* `customer(no account)` is signed out, `<grade10 grading url>`.

**Steps:**

1. Click Start a submission.

**Expected Results:**

* The plan wizard opens on the Cards step, with no card listed.

### grade10-site-grading-submission-plan-US1-TC5-1: Booking without a list leaves the grading home with no list started

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-01

**Pre-conditions:**

* `customer(no account)` is signed out, `<grade10 grading url>`.

**Steps:**

1. Click Book a drop-off without a list.

**Expected Results:**

* The browser leaves `<grade10 grading url>` for the walk-in booking page.
* No card list is created for this visit.

### grade10-site-grading-submission-plan-US1-TC6-1: The fee sheet names the counter for a card above the top ceiling

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-01

**Pre-conditions:**

* `customer(no account)` is signed out, `<grade10 grading url>`.

**Steps:**

1. Read the fee sheet on the grading home, below its level rows.

**Expected Results:**

* The sheet names a card declared above the top level's ceiling of 3900000 (HKD, minor units).
* It says such a card is asked about at the counter or on WhatsApp rather than priced.

---

## grade10-site-grading-submission-plan-US2: Collector lists a few cards by hand

**As a** collector with a handful of cards,
**I want** to add each card with its set matched in the card price reference, its declared value and the recent sales beside it as a reference, and to set a minimum grade on a card I do not want slabbed below it,
**so that** the level and the cover are set by what I would insure each card for, and not by a guess.

### grade10-site-grading-submission-plan-US2-TC1-1: Adding a matched card shows its reference sales

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-02

**Pre-conditions:**

* `customer(collector)` is on the Cards step of a new plan with no card listed, `<grade10 grading url>`.

**Test data:**

| Field | Value |
| --- | --- |
| Card searched | Umbreon VMAX (Alternate Art) |
| Declared value | 850000 (HKD, minor units) |

**Steps:**

1. Search the card from **Test data** and select the matched result.
2. Enter the declared value from **Test data**.

**Expected Results:**

* The card line shows the card price reference's name for the card, with the set and number as typed.
* The recent sales at ungraded, PSA 9 and PSA 10 show beside the card as a reference, not a valuation.
* The declared value entered is held on the card.

### grade10-site-grading-submission-plan-US2-TC2-1: Setting a minimum grade shows the fee applies either way

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-02

**Pre-conditions:**

* `customer(collector)` has one matched card listed on the Cards step, `<grade10 grading url>`.

**Steps:**

1. Open the card's minimum-grade setting.
2. Set the minimum grade to PSA 9.

**Expected Results:**

* The card shows a caption that it will only be encapsulated at PSA 9 or above.
* The caption states the fee applies whether or not the minimum is met.

### grade10-site-grading-submission-plan-US2-TC3-1: An empty card list disables Continue

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-02

**Pre-conditions:**

* `customer(collector)` is on the Cards step of a new plan with no card listed, `<grade10 grading url>`.

**Steps:**

1. Read the Cards step without adding a card.

**Expected Results:**

* No card is listed.
* Add a card and Paste a list are the only actions offered.
* Continue is disabled.

### grade10-site-grading-submission-plan-US2-TC4-1: Removing a card takes it off the list

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-02

**Pre-conditions:**

* `customer(collector)` has two matched cards listed on the Cards step, `<grade10 grading url>`.

**Steps:**

1. Remove one of the two listed cards.

**Expected Results:**

* The removed card no longer shows on the list.
* One card remains listed.

### grade10-site-grading-submission-plan-US2-TC5-1: The wizard rail marks the cards step in progress

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-02

**Pre-conditions:**

* `customer(collector)` is on the Cards step of a new plan, `<grade10 grading url>`.

**Steps:**

1. Read the wizard rail on the Cards step.
2. Continue to the Service step and read the rail again.

**Expected Results:**

* On the Cards step, The cards reads in progress, and The service and Book read as still to come.
* On the Service step, The cards reads done, The service reads in progress and Book reads as still to come.

### grade10-site-grading-submission-plan-US2-TC6-1: Contact details are filled in for a signed-in collector and asked of a signed-out one

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-02

**Pre-conditions:**

* `customer(collector)` has a name, an email and a phone on their account.

**Steps:**

1. Signed in, open the Cards step and read the About you fields.
2. Change the phone for this submission.
3. Sign out, open a new plan and read the same fields.

**Expected Results:**

* Signed in, the name, the email and the phone are filled in from the account.
* The changed phone is held on this submission, and the account is unchanged.
* Signed out, all three are asked for and none is filled in.

### grade10-site-grading-submission-plan-US2-TC7-1: A card added by hand that the reference does not answer for is kept as typed

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-02

**Pre-conditions:**

* `customer(collector)` is on the Cards step of a new plan with no card listed, `<grade10 grading url>`.
* The card price reference is reachable and carries no match for the name typed.

**Test data:**

| Field | Value |
| --- | --- |
| Card typed | Homebrew Test Card |
| Declared value | 50000 (HKD, minor units) |

**Steps:**

1. Type the card name from **Test data** and add it by hand.
2. Enter the declared value from **Test data**.

**Expected Results:**

* The card is listed in the name as typed, the way a pasted line the reference does not answer for is.
* No reference sales show beside it.
* The declared value is asked for and held on the card.

### grade10-site-grading-submission-plan-US2-TC8-1: A reference outage keeps a hand-added card unasked and still asks its value

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-02

**Pre-conditions:**

* `customer(collector)` is on the Cards step of a new plan with no card listed, `<grade10 grading url>`.
* The card price reference cannot be reached.

**Steps:**

1. Type a card name and add it by hand.
2. Read the card line.

**Expected Results:**

* The card carries the reference-unavailable line rather than the kept-as-typed one.
* The declared value is still asked for.
* Nothing on the step waits on the reference.

---

## grade10-site-grading-submission-plan-US3: Collector pastes a list of cards

**As a** collector with many cards,
**I want** to paste one card a line and be told which lines matched the reference, which kept the name I typed, which still need a value and which sit above the level's ceiling,
**so that** a long list takes a minute and nothing on it is silently dropped or guessed.

### grade10-site-grading-submission-plan-US3-TC1-1: Pasted lines matched in the reference report as matched

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-03

**Pre-conditions:**

* `customer(collector)` is on the Cards step of a new plan with the paste sheet open, `<grade10 grading url>`.
* The card price reference is reachable.

**Test data:**

| Field | Value |
| --- | --- |
| Line 1 | Charizard 1st Edition, Base Set 4/102, declared value 350000 (HKD, minor units) |
| Line 2 | Umbreon VMAX (Alternate Art), Evolving Skies 188/203, declared value 850000 (HKD, minor units) |

**Steps:**

1. Paste the two lines from **Test data** into the paste sheet.
2. Wait for matching to finish.

**Expected Results:**

* Both lines report as matched in the card price reference.
* The matched count reads 2, with the references-show line offered.

### grade10-site-grading-submission-plan-US3-TC2-1: A pasted line with no reference match is kept as typed

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-03

**Pre-conditions:**

* `customer(collector)` is on the Cards step of a new plan with the paste sheet open, `<grade10 grading url>`.
* The card price reference is reachable and carries no match for the pasted name.

**Test data:**

| Field | Value |
| --- | --- |
| Line 1 | Homebrew Test Card, no set, declared value 50000 (HKD, minor units) |

**Steps:**

1. Paste the line from **Test data** into the paste sheet.
2. Wait for matching to finish.

**Expected Results:**

* The line reports as kept as typed, naming it as the collector wrote it.
* No reference sales row shows for that line.

### grade10-site-grading-submission-plan-US3-TC3-1: A pasted line missing a value blocks Continue

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-03

**Pre-conditions:**

* `customer(collector)` is on the Cards step of a new plan with the paste sheet open, `<grade10 grading url>`.
* The card price reference is reachable.

**Test data:**

| Field | Value |
| --- | --- |
| Line 1 | Charizard 1st Edition, Base Set 4/102, no value |

**Steps:**

1. Paste the line from **Test data** into the paste sheet.
2. Wait for matching to finish.
3. Click Add 1 card, then read the Cards step.

**Expected Results:**

* The line reports on a row naming it as needing a declared value.
* The card is added to the list with its declared value still asked for.
* Continue is disabled, naming the one card missing a value.

### grade10-site-grading-submission-plan-US3-TC4-1: A pasted line above the top ceiling is sent to the counter

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-03

**Pre-conditions:**

* `customer(collector)` is on the Cards step of a new plan with the paste sheet open, `<grade10 grading url>`.
* The card price reference is reachable.

**Test data:**

| Field | Value |
| --- | --- |
| Line 1 | Umbreon VMAX (Alternate Art), Evolving Skies 188/203, declared value 4200000 (HKD, minor units) |

**Steps:**

1. Paste the line from **Test data** into the paste sheet.
2. Wait for matching to finish.

**Expected Results:**

* The line reports as above the ceiling, naming the card and its declared value.
* The collector is told to ask at the counter or on WhatsApp, 4200000 (HKD, minor units) being above the top level's 3900000 (HKD, minor units) ceiling.
* No second submission is named for it.

### grade10-site-grading-submission-plan-US3-TC5-1: A pasted duplicate of a listed card is skipped

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-03

**Pre-conditions:**

* `customer(collector)` has one matched card listed by hand on the Cards step, `<grade10 grading url>`.
* The card price reference is reachable.

**Test data:**

| Field | Value |
| --- | --- |
| Listed card | Charizard 1st Edition, Base Set 4/102, declared value 350000 (HKD, minor units) |
| Pasted line | Charizard 1st Edition, Base Set 4/102, declared value 350000 (HKD, minor units) |

**Steps:**

1. Open the paste sheet.
2. Paste the pasted line from **Test data**.
3. Wait for matching to finish.

**Expected Results:**

* The pasted line reports as skipped, naming it as a card already listed.
* The skipped count reads 1.

### grade10-site-grading-submission-plan-US3-TC6-1: An empty paste leaves Add disabled

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-03

**Pre-conditions:**

* `customer(collector)` is on the Cards step of a new plan with the paste sheet open, `<grade10 grading url>`.

**Steps:**

1. Leave the paste sheet's text field empty.

**Expected Results:**

* Add stays disabled with nothing read.

### grade10-site-grading-submission-plan-US3-TC7-1: A reference outage keeps every pasted line as typed

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-03

**Pre-conditions:**

* `customer(collector)` is on the Cards step of a new plan with the paste sheet open, `<grade10 grading url>`.
* The card price reference cannot be reached.

**Test data:**

| Field | Value |
| --- | --- |
| Line 1 | Charizard 1st Edition, Base Set 4/102, declared value 350000 (HKD, minor units) |
| Line 2 | Umbreon VMAX (Alternate Art), Evolving Skies 188/203, declared value 850000 (HKD, minor units) |

**Steps:**

1. Paste the two lines from **Test data** into the paste sheet.
2. Wait for matching to finish.

**Expected Results:**

* Both lines report with the reference-unavailable line rather than kept as typed.
* Add stays enabled, and each line's declared value is still asked for.

### grade10-site-grading-submission-plan-US3-TC8-1: The paste counts every line back before any card is added

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-03

**Pre-conditions:**

* `customer(collector)` is on the Cards step of a new plan with the paste sheet open, `<grade10 grading url>`.
* The card price reference is reachable.
* One of the 30 cards pasted is already on the list.

**Test data:**

| Field | Value |
| --- | --- |
| Pasted lines | 30 lines: matched, kept as typed, without a value, above the ceiling and one already listed |

**Steps:**

1. Paste the 30 lines from **Test data**.
2. Wait for matching to finish.
3. Add the counts the paste reports together.

**Expected Results:**

* The five counts - matched, kept as typed, without a value, above the ceiling, skipped - add up to 30.
* The counts show before any card is added.

---

## grade10-site-grading-submission-plan-US4: Dealer submits a box of cards at Bulk

**As a** collector dealing in cards, more than twenty at a time,
**I want** the paste to tell me Bulk is the only level open, what it costs a card and that it takes the longer drop-off, and a card above Bulk's ceiling to be named for a second submission on the same drop-off,
**so that** the whole box goes in on one visit at the right level.

### grade10-site-grading-submission-plan-US4-TC1-1: More than twenty pasted cards leave Bulk the only open level

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-04

**Pre-conditions:**

* `customer(collector)` is on the Cards step of a new plan with the paste sheet open, `<grade10 grading url>`.
* The card price reference is reachable.

**Test data:**

| Field | Value |
| --- | --- |
| Pasted lines | 25 lines, each a card matched in the reference, declared value 100000 (HKD, minor units) |

**Steps:**

1. Paste the 25 lines from **Test data**.
2. Wait for matching to finish, then continue to the Service step.

**Expected Results:**

* Bulk shows as the only open level, naming its fee a card and its ceiling.
* The Bulk drop-off is named as the longer visit.

### grade10-site-grading-submission-plan-US4-TC2-1: Exactly twenty cards leave every level open

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-04

**Pre-conditions:**

* `customer(collector)` is on the Cards step of a new plan with the paste sheet open, `<grade10 grading url>`.
* The card price reference is reachable.

**Test data:**

| Field | Value |
| --- | --- |
| Pasted lines | 20 lines, each a card matched in the reference, declared value 100000 (HKD, minor units) |

**Steps:**

1. Paste the 20 lines from **Test data**.
2. Wait for matching to finish, then continue to the Service step.

**Expected Results:**

* Value, Regular, Express, Super Express and Bulk each show open, naming their own ceiling and fee.

### grade10-site-grading-submission-plan-US4-TC3-1: 21 pasted cards force Bulk as the only open level

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-04

**Pre-conditions:**

* `customer(collector)` is on the Cards step of a new plan with the paste sheet open, `<grade10 grading url>`.
* The card price reference is reachable.

**Test data:**

| Field | Value |
| --- | --- |
| Pasted lines | 21 lines, each a card matched in the reference, declared value 100000 (HKD, minor units) |

**Steps:**

1. Paste the 21 lines from **Test data**.
2. Wait for matching to finish, then continue to the Service step.

**Expected Results:**

* Value, Regular, Express and Super Express each show closed, naming the count that closes them.
* Bulk shows open.

### grade10-site-grading-submission-plan-US4-TC4-1: A card above Bulk's ceiling is named for a second submission

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-04

**Pre-conditions:**

* `customer(collector)` is on the Cards step of a new plan with the paste sheet open, `<grade10 grading url>`.
* The card price reference is reachable.

**Test data:**

| Field | Value |
| --- | --- |
| Pasted lines | 21 lines matched in the reference at 100000 (HKD, minor units) each, and one line at 200000 (HKD, minor units), above Bulk's 150000 (HKD, minor units) ceiling |

**Steps:**

1. Paste the 22 lines from **Test data**.
2. Wait for matching to finish.

**Expected Results:**

* The line above Bulk's ceiling is named for a second submission on the same drop-off.
* The other 21 lines are held in this submission at Bulk.

### grade10-site-grading-submission-plan-US4-TC5-1: The 101st pasted card is refused at Bulk's cap

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-04

**Pre-conditions:**

* `customer(collector)` has 100 cards listed at Bulk on the Cards step, `<grade10 grading url>`.
* The card price reference is reachable.

**Test data:**

| Field | Value |
| --- | --- |
| Pasted line | one more card matched in the reference, declared value 100000 (HKD, minor units) |

**Steps:**

1. Paste the line from **Test data**.
2. Wait for matching to finish.

**Expected Results:**

* The card is refused, naming a second submission on another day.
* The list still holds 100 cards.

### grade10-site-grading-submission-plan-US4-TC6-1: The 100th pasted card is accepted at Bulk's cap

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-04

**Pre-conditions:**

* `customer(collector)` has 99 cards listed at Bulk on the Cards step, `<grade10 grading url>`.
* The card price reference is reachable.

**Test data:**

| Field | Value |
| --- | --- |
| Pasted line | one more card matched in the reference, declared value 100000 (HKD, minor units) |

**Steps:**

1. Paste the line from **Test data**.
2. Wait for matching to finish.

**Expected Results:**

* The card is added to the list at Bulk.
* No cap notice shows.

---

## grade10-site-grading-submission-plan-US5: Collector sees why a level is closed

**As a** collector picking the grader and the level,
**I want** a closed level to name the card declared above its ceiling, or the count that closes it, and an open one to read its ceiling, fee, cover line and return date,
**so that** I can change a declared value or split the list instead of wondering why a level is grey.

### grade10-site-grading-submission-plan-US5-TC1-1: An open level reads its ceiling, fee and return date

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-05

**Pre-conditions:**

* `customer(collector)` is on the Service step with 4 cards listed, the highest declared at 850000 (HKD, minor units), `<grade10 grading url>`.

**Steps:**

1. Select PSA as the grader.
2. Read the Regular level.
3. Read the Express level.

**Expected Results:**

* Regular shows open, naming its ceiling of 1170000 (HKD, minor units), its fee a card of 60000 (HKD, minor units) and its return date about 5 weeks out.
* Express additionally names a cover line at 1.5% of the declared value a card.

### grade10-site-grading-submission-plan-US5-TC2-1: A level closed by value names the card declared above it

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-05

**Pre-conditions:**

* `customer(collector)` is on the Service step with 4 cards listed, the highest declared at 850000 (HKD, minor units), `<grade10 grading url>`.

**Steps:**

1. Select PSA as the grader.
2. Read the Value level.

**Expected Results:**

* Value shows closed, naming the card declared at 850000 (HKD, minor units) as above its 390000 (HKD, minor units) ceiling.

### grade10-site-grading-submission-plan-US5-TC3-1: Bulk closed by count names how many more cards are needed

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-05

**Pre-conditions:**

* `customer(collector)` is on the Service step with 4 cards listed, `<grade10 grading url>`.

**Steps:**

1. Select PSA as the grader.
2. Read the Bulk level.

**Expected Results:**

* Bulk shows closed, naming that Bulk starts at 20 cards and the list holds 4.

### grade10-site-grading-submission-plan-US5-TC4-1: A card above every ceiling closes every level

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
* **Trace:** grade10-site-grading-submission-plan-US-05

**Pre-conditions:**

* `customer(collector)` is on the Service step with one card listed, declared at 4200000 (HKD, minor units), `<grade10 grading url>`.

**Steps:**

1. Select PSA as the grader.
2. Read every level.

**Expected Results:**

* Every level shows closed.
* The step names asking at the counter or on WhatsApp before a level can be picked.
* Continue is disabled.

### grade10-site-grading-submission-plan-US5-TC5-1: No level picked shows no estimate

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
* **Trace:** grade10-site-grading-submission-plan-US-05

**Pre-conditions:**

* `customer(collector)` is on the Service step with a grader selected and no level chosen, `<grade10 grading url>`.

**Steps:**

1. Read the Service step before picking a level.

**Expected Results:**

* No estimate shows.
* Continue is disabled.

### grade10-site-grading-submission-plan-US5-TC6-1: A grader with no figures yet still shows its levels

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
* **Trace:** grade10-site-grading-submission-plan-US-05

**Pre-conditions:**

* `customer(collector)` is on the Service step with cards listed, `<grade10 grading url>`.
* CGC's fee sheet carries only the example figures.

**Steps:**

1. Select CGC as the grader.

**Expected Results:**

* CGC's levels show, marked as carrying no figures.
* None of CGC's levels can be picked, so the step does not continue on one.

### grade10-site-grading-submission-plan-US5-TC7-1: The level picked covers every card on the list

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-05

**Pre-conditions:**

* `customer(collector)` is on the Service step with 4 cards listed, none above Regular's ceiling, `<grade10 grading url>`.

**Steps:**

1. Select PSA as the grader and Regular as the level.
2. Continue to the Book step and read the schedule.

**Expected Results:**

* All four cards read as PSA Regular on the schedule.
* No card on the submission carries another grader or another level.

### grade10-site-grading-submission-plan-US5-TC8-1: The estimate reads the cards times the fee, paid at the counter

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-05

**Pre-conditions:**

* `customer(collector)` is on the Service step with 4 cards listed, `<grade10 grading url>`.

**Test data:**

| Field | Value |
| --- | --- |
| Regular fee a card | 60000 (HKD, minor units) |
| Estimate, 4 cards | 240000 (HKD, minor units) |

**Steps:**

1. Select PSA as the grader and Regular as the level.
2. Read the estimate.

**Expected Results:**

* The estimate reads 240000 (HKD, minor units) from **Test data**, being 4 times the fee a card.
* It carries no cover line at Regular.
* It reads about 5 weeks back, counted from the day the batch leaves the shop.
* It says everything on it is paid at the counter.

### grade10-site-grading-submission-plan-US5-TC9-1: The estimate at Express carries a cover line per card

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-05

**Pre-conditions:**

* `customer(collector)` is on the Service step with one card declared at 850000 (HKD, minor units), `<grade10 grading url>`.

**Test data:**

| Field | Value |
| --- | --- |
| Express fee a card | 120000 (HKD, minor units) |
| Cover, 1.5% of 850000 | 12750 (HKD, minor units) |
| Total | 132750 (HKD, minor units) |

**Steps:**

1. Select PSA as the grader and Express as the level.
2. Read the estimate.

**Expected Results:**

* The cover line for the card reads 12750 (HKD, minor units) from **Test data**.
* The total reads 132750 (HKD, minor units), the fee and the cover line added.

---

## grade10-site-grading-submission-plan-US6: Collector finds the plan again from the emailed link or the signed-in home

**As a** collector who leaves the wizard before booking,
**I want** the plan kept under the email I gave and its link mailed to me the moment I leave, opening on any device with no account, and the home page to list every submission under that email once I sign in with it and no password,
**so that** I can finish on another day, and find every old submission, without a password or a second list.

### grade10-site-grading-submission-plan-US6-TC1-1: Finishing later keeps the plan and mails its link at once

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-06

**Pre-conditions:**

* `customer(no account)` is on the Cards step of a new plan with one card listed, signed out, `<grade10 grading url>`.

**Test data:**

| Field | Value |
| --- | --- |
| Email | collector@example.com |

**Steps:**

1. Enter the email from **Test data**.
2. Click Finish later.
3. Leave the page.

**Expected Results:**

* The plan is kept under the email entered.
* An email carrying the plan's link is sent the moment the page is left.

### grade10-site-grading-submission-plan-US6-TC2-1: Finishing later with no email asks for one first

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-06

**Pre-conditions:**

* `customer(no account)` is on the Cards step of a new plan with one card listed, signed out, with the email field blank, `<grade10 grading url>`.

**Steps:**

1. Click Finish later without entering an email.

**Expected Results:**

* The plan is not kept.
* The email field is asked for before the plan can be kept.

### grade10-site-grading-submission-plan-US6-TC3-1: The emailed link opens the kept plan on another device

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-06

**Pre-conditions:**

* `customer(no account)` has a plan kept under an email, with its link known, on a device other than the one that created it.

**Steps:**

1. Open the emailed link on the second device.

**Expected Results:**

* The kept plan opens with its cards, grader and level as saved.
* No sign-in or account is asked for.

### grade10-site-grading-submission-plan-US6-TC4-1: Signing in with no password lists every submission

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-06

**Pre-conditions:**

* `customer(collector)` has two submissions under one email, one open and one collected.

**Test data:**

| Field | Value |
| --- | --- |
| Email | collector@example.com |

**Steps:**

1. Navigate to `<grade10 grading url>`.
2. Sign in with the email from **Test data**.
3. Read the home page.

**Expected Results:**

* No password is asked for.
* Both submissions list under Your submissions, each with its summary, status word and chip.

### grade10-site-grading-submission-plan-US6-TC5-1: A signed-in collector with no submissions sees the empty state

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
* **Trace:** grade10-site-grading-submission-plan-US-06

**Pre-conditions:**

* `customer(collector)` is signed in under an email with no submissions, `<grade10 grading url>`.

**Steps:**

1. Read the home page.

**Expected Results:**

* Your submissions shows the empty state.
* Start a submission is offered.

### grade10-site-grading-submission-plan-US6-TC6-1: A failed submissions read shows the error state

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-06

**Pre-conditions:**

* `customer(collector)` is signed in, `<grade10 grading url>`.
* Reading the collector's submissions fails.

**Steps:**

1. Read the home page.

**Expected Results:**

* The failure shows in the error tone.
* No submission list renders.

### grade10-site-grading-submission-plan-US6-TC7-1: A sheet changed after booking leaves the submission's figures alone

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-06

**Pre-conditions:**

* `customer(collector)` has a submission booked at PSA Regular at 60000 (HKD, minor units) a card, `<grade10 grading submission url>`.

**Test data:**

| Field | Value |
| --- | --- |
| Regular fee a card, booked on | 60000 (HKD, minor units) |
| Regular fee a card, changed to | 70000 (HKD, minor units) |

**Steps:**

1. Change the fee sheet's Regular fee a card to the changed figure from **Test data**.
2. Open the booked submission again.

**Expected Results:**

* The submission still reads 60000 (HKD, minor units) a card.
* Its estimate and its totals are unchanged.

### grade10-site-grading-submission-plan-US6-TC8-1: A sheet changed before booking reaches the reopened plan

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-06

**Pre-conditions:**

* `customer(collector)` has a plan kept at PSA Regular with no drop-off booked, made while Regular was 60000 (HKD, minor units) a card.

**Test data:**

| Field | Value |
| --- | --- |
| Regular fee a card, changed to | 70000 (HKD, minor units) |

**Steps:**

1. Change the fee sheet's Regular fee a card to the figure from **Test data**.
2. Open the kept plan from its emailed link.

**Expected Results:**

* The estimate reads 70000 (HKD, minor units) a card.

---

## grade10-site-grading-submission-plan-US7: Collector reads the review before booking

**As a** collector about to book the drop-off,
**I want** the review to total the declared value, the fee and the cover line, to name each card that could grade above the level's ceiling with the level the grader would move it to, the sheet's difference due at the counter and what the higher level would cost now, and to say that a fee is charged on a card returned ungraded, that a card can move up a level, that the return date is an estimate, that nothing is paid or signed before the cards are checked with me, and that slabs are not shipped back,
**so that** I choose the level knowing both prices and agree to the terms the agreement will later print rather than meet them on the iPad.

### grade10-site-grading-submission-plan-US7-TC1-1: The review totals the fee and lists Good to know

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-07

**Pre-conditions:**

* `customer(collector)` is on the Book step with 4 cards at PSA Regular, none above the level's ceiling, `<grade10 grading url>`.

**Test data:**

| Field | Value |
| --- | --- |
| Fee a card at Regular | 60000 (HKD, minor units) |
| Fee at the counter, 4 cards | 240000 (HKD, minor units) |

**Steps:**

1. Read the review step's totals.
2. Read Good to know.

**Expected Results:**

* The totals show the fee at the counter of 240000 (HKD, minor units) from **Test data**, with no cover line at Regular.
* Good to know lists, in order: a fee is charged on a card returned ungraded, a card can move up a level, the return date is an estimate, nothing is paid or signed before the cards are checked, and slabs are not shipped back.

### grade10-site-grading-submission-plan-US7-TC2-1: The upcharge warning names the level and both prices

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-07

**Pre-conditions:**

* `customer(collector)` is on the Book step with 4 cards at PSA Regular, `<grade10 grading url>`.
* One card, Umbreon VMAX (Alternate Art), is declared at 850000 (HKD, minor units) with a PSA 10 reference of 1500000 (HKD, minor units), above Regular's 1170000 (HKD, minor units) ceiling.

**Test data:**

| Field | Value |
| --- | --- |
| Regular fee a card | 60000 (HKD, minor units) |
| Express fee a card | 120000 (HKD, minor units) |

**Steps:**

1. Read the review step's upcharge warning for Umbreon VMAX.

**Expected Results:**

* Umbreon VMAX is named with Express as the level the grader would move it to.
* The difference due at the counter reads 60000 (HKD, minor units), Express's fee less Regular's fee from **Test data**.
* Express's fee now, 120000 (HKD, minor units), shows beside it.

### grade10-site-grading-submission-plan-US7-TC3-1: No card above the ceiling shows no upcharge warning

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-07

**Pre-conditions:**

* `customer(collector)` is on the Book step with 4 cards at PSA Regular, every card's PSA 10 reference within Regular's ceiling, `<grade10 grading url>`.

**Steps:**

1. Read the review step.

**Expected Results:**

* No upcharge warning block shows.

### grade10-site-grading-submission-plan-US7-TC4-1: An unticked consent statement disables booking

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
* **Trace:** grade10-site-grading-submission-plan-US-07

**Pre-conditions:**

* `customer(collector)` is on the Book step with the collection statement unticked, `<grade10 grading url>`.

**Steps:**

1. Read the Book step before ticking the consent statement.
2. Tick the consent statement.

**Expected Results:**

* Book the drop-off is disabled while the statement is unticked.
* Book the drop-off becomes enabled once ticked.

### grade10-site-grading-submission-plan-US7-TC5-1: The review totals include the cover line

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-07

**Pre-conditions:**

* `customer(collector)` is on the Book step with 4 cards at PSA Express, each with a declared value, `<grade10 grading url>`.

**Steps:**

1. Read the review step's totals.

**Expected Results:**

* The cover line shows under the fee, per card and in total, at 1.5% of each card's declared value.

### grade10-site-grading-submission-plan-US7-TC6-1: Booking shows pending and disables both buttons

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-07

**Pre-conditions:**

* `customer(collector)` is on the Book step with the consent statement ticked, `<grade10 grading url>`.

**Steps:**

1. Click Book the drop-off.

**Expected Results:**

* Book the drop-off shows pending.
* Book the drop-off and Save and book later are both disabled while booking is in progress.

### grade10-site-grading-submission-plan-US7-TC7-1: Saving the plan for later works with the statement unticked

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-07

**Pre-conditions:**

* `customer(collector)` is on the Book step with the collection statement unticked, `<grade10 grading url>`.

**Steps:**

1. Leave the collection statement unticked.
2. Click Save and book later.

**Expected Results:**

* Save and book later is offered while the statement is unticked.
* The plan is kept, and its page opens at Planned.
* The statement is still unticked on the plan.
* Book the drop-off was the only action the unticked statement refused.

---

### grade10-site-grading-submission-plan-US7-TC8-1: A USD reference sale is warned about at the rate staff set

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-07

**Pre-conditions:**

* The console's reference rate reads 7.84 HKD to 1 USD.
* `customer(collector)` is on the Book step at PSA Regular, `<grade10 grading url>`.
* One card, Umbreon VMAX (Alternate Art), is declared at 850000 (HKD, minor units) with a PSA 10 reference sale of 150000 (USD, minor units).

**Test data:**

| Field | Value |
| --- | --- |
| Reference rate | 784 (HKD, minor units) to 1 USD |
| Regular ceiling | 1170000 (HKD, minor units) |
| Regular fee a card | 60000 (HKD, minor units) |
| Express fee a card | 120000 (HKD, minor units) |

**Steps:**

1. Read the review step's upcharge warning for Umbreon VMAX.

**Expected Results:**

* The PSA 10 sale reads 1176000 (HKD, minor units), 150000 (USD, minor units) at the rate from **Test data**, above Regular's ceiling.
* Umbreon VMAX is named with Express as the level the grader would move it to.
* The difference due at the counter reads 60000 (HKD, minor units).

## grade10-site-grading-submission-plan-US8: Collector who never books is nudged and then let go

**As a** collector who planned a submission and booked no drop-off,
**I want** one reminder with the link and then a short email saying the list has expired with nothing paid and nothing owed,
**so that** I am prompted once and not left with an old list at stale prices.

### grade10-site-grading-submission-plan-US8-TC1-1: An unbooked plan at day 21 shows the nudge

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-08

**Pre-conditions:**

* `customer(collector)` has a plan kept 21 days ago with no drop-off booked, `<grade10 grading submission url>`.

**Steps:**

1. Open the plan's page.

**Expected Results:**

* The page reads a kept-until line naming the expiry day, 30 days from when the plan was kept.
* The plan can still be booked.

### grade10-site-grading-submission-plan-US8-TC2-1: An unbooked plan at day 30 expires

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-08

**Pre-conditions:**

* `customer(collector)` has a plan kept 30 days ago with no drop-off booked, `<grade10 grading submission url>`.

**Steps:**

1. Open the plan's page.

**Expected Results:**

* The status reads Expired, with the rail ended at Planned.
* The page states nothing is paid and nothing is owed.
* Start a submission is offered.

### grade10-site-grading-submission-plan-US8-TC3-1: Booking an expired plan is refused

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-08

**Pre-conditions:**

* `customer(collector)` is on the Book step of a plan kept 30 days ago with no drop-off booked, `<grade10 grading url>`.

**Steps:**

1. Click Book the drop-off.

**Expected Results:**

* Booking is refused by name, stating the plan has expired.
* Start again is offered in place of the review.

### grade10-site-grading-submission-plan-US8-TC4-1: A booked plan does not expire at day 30

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-08

**Pre-conditions:**

* `customer(collector)` has a plan with a drop-off booked 30 days ago, `<grade10 grading submission url>`.

**Steps:**

1. Open the plan's page.

**Expected Results:**

* The status still reads Drop-off booked, not Expired.
* No nudge or expiry line shows.

---

## Reconciliation

**Run:** the blind pass read this capability's `## Purpose` and `## Feature set`, its `user-journeys.md`, the change's `proposal.md` and its `decisions.md` with the `## Raised` table, `ui-design.md` with the state dispositions stripped, and the PRD sections the proposal links. It was denied every `## Requirements` section, `openspec/specs/`, `openspec/changes/archive/` and `tech-design.md`. It wrote 44 cases over US1 to US8 and four raised questions; the scenario pass wrote `grade10-site-grading-submission-plan-SC-01` to `SC-45` over fourteen ADDED requirements. Nothing verifies the bundle; this line is the run's own word for it.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| 33 of the 44 blind cases | **Joined** | each reached a scenario that states it; the rows below are the differences |
| `US1-TC3-1` a tab per grader | **Folded in:** `grade10-site-grading-submission-plan-SC-47` | the home shows every active grader's sheet; no scenario read past the first grader |
| `US1-TC4-1` Start a submission opens an empty wizard | **Folded in:** `grade10-site-grading-submission-plan-SC-49` | the step the home opens on was stated nowhere |
| `US1-TC5-1` booking without a list | **Joined** to `grade10-site-grading-submission-plan-SC-01` | the walk-in visit itself is `grade10-site/grading/dropoff-booking`'s, US-05 |
| `US2-TC3-1` an empty list holds Continue | **Folded in:** `grade10-site-grading-submission-plan-SC-52` | the requirement refused a card with no value and said nothing about a list with no card |
| `US2-TC4-1` removing a card | **Folded in:** `grade10-site-grading-submission-plan-SC-50` | the list is editable on the design and was stated in no requirement |
| `US3-TC4-1` a line above the ceiling named for a second submission | **Corrected against `grade10-site-grading-submission-plan-SC-07`** | at 4200000 HKD minor units the card is above every level's ceiling, so it goes to the counter; the second-submission line is the chosen level's, `grade10-site-grading-submission-plan-SC-22`. Landed as Q65 |
| `US3-TC6-1` an empty paste | **Folded in:** `grade10-site-grading-submission-plan-SC-53` | the paste's own guard |
| `US4-TC2-1` exactly twenty cards leave every level open | **Folded in:** `grade10-site-grading-submission-plan-SC-55`, and the requirement's boundary corrected | "Twenty or more" closed every level at 20, against its own `grade10-site-grading-submission-plan-SC-20`, against the paste's more-than-20 rule and against the sheet's cards-a-submission column of 20. Rewritten as "More than twenty"; the blind pass found it |
| `US4-TC6-1` the hundredth card at Bulk's cap | **Folded in:** `grade10-site-grading-submission-plan-SC-56` | the accepted edge beside `grade10-site-grading-submission-plan-SC-21`'s refused one |
| `US5-TC1-1` what an open level reads | **Folded in:** `grade10-site-grading-submission-plan-SC-57` | the sheet's figures were stated on the home and never on the level picker |
| `US5-TC6-1` a grader with only the example figures is selectable | **Covered by `grade10-site-grading-submission-plan-SC-06`, corrected** | Example figures are not figures supplied, so such a grader shows its levels and none of them can be picked. The case now reads that, and `decisions.md` carries the rule |
| `US6-TC5-1` the empty state | **Folded in:** `grade10-site-grading-submission-plan-SC-46` | the requirement said the home says there is none, and no scenario read it |
| `US7-TC6-1` booking pending, both buttons disabled | **Kept, no scenario** | the button's in-flight state, decided by the view's colocated test rather than by a requirement |
| Raised 1, the home's above-the-top-ceiling note | **Answered, folded in:** `grade10-site-grading-submission-plan-SC-48` | Q63: the note is part of the sheet wherever it renders. Case added, `US1-TC6-1` |
| Raised 2, a hand-added card's outcomes | **Answered, folded in:** `grade10-site-grading-submission-plan-SC-51` | Q64: one set of states however the card arrived. Case added, `US2-TC7-1` |
| Raised 3, which ceiling the Cards step measures | **Answered, folded in:** `grade10-site-grading-submission-plan-SC-54` | Q65: the grader's top ceiling, or Bulk's where the count has closed the rest. `US3-TC4-1` corrected |
| Raised 4, the consent and Save and book later | **Answered, folded in:** `grade10-site-grading-submission-plan-SC-58` | Q66: the statement gates booking the drop-off alone. Case added, `US7-TC7-1` |
| `grade10-site-grading-submission-plan-SC-02` the home still reading | **Out of suite:** the home view's colocated test | presentation only; named under the header, and the design row closes on it |
| `grade10-site-grading-submission-plan-SC-08` the wizard rail | **Case added:** `US2-TC5-1` | |
| `grade10-site-grading-submission-plan-SC-09` contact details | **Case added:** `US2-TC6-1` | |
| `grade10-site-grading-submission-plan-SC-12` the reference out of reach while adding by hand | **Case added:** `US2-TC8-1` | the blind pass walked the outage on the paste alone |
| `grade10-site-grading-submission-plan-SC-17` every line counted back | **Case added:** `US3-TC8-1` | |
| `grade10-site-grading-submission-plan-SC-23` one grader and one level | **Case added:** `US5-TC7-1` | |
| `grade10-site-grading-submission-plan-SC-28`, `grade10-site-grading-submission-plan-SC-30` the estimate | **Case added:** `US5-TC8-1` | the blind pass read the totals on the review and never the estimate on the service step |
| `grade10-site-grading-submission-plan-SC-29` the cover line on the estimate | **Case added:** `US5-TC9-1` | |
| `grade10-site-grading-submission-plan-SC-36` the sheet pinned at booking | **Case added:** `US6-TC7-1` | |
| `grade10-site-grading-submission-plan-SC-37` a sheet changed before booking | **Case added:** `US6-TC8-1` | |
| `grade10-site-grading-submission-plan-SC-60` a USD sale read at the rate staff set | **Case added:** `US7-TC8-1` | written after the blind pass, with Q116; the reference answers in USD alone, so without the rate `US7-TC2-1` never fires |

### Manual

| Manual | Why |
| --- | --- |
| `US6-TC1-1` the link mailed on leaving | the mail is read in an inbox; a script drives the plan being kept and no further |
| `US8-TC1-1` the nudge at day 21 | the day is moved and the nudge is read in an inbox |
| `US8-TC2-1` the expiry at day 30 | the same clock, and the words on the expired page |
| `US6-TC7-1`, `US6-TC8-1` a changed fee sheet | a console settings write sits between the two reads |
| `US2-TC1-1` the reference sales read as a reference | a judgement of the words beside the card, not an assertion |

## Settled

Nothing yet; the fold carries what this run refused into the durable suite.
