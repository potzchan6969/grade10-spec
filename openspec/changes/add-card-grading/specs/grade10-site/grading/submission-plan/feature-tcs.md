# grade10-site/grading/submission-plan Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-29, tcs-rules r4
**Out of suite:** grade10-site-grading-submission-plan-SC-02

## Background

Grade10's currency is HKD; every amount is stated in minor units with its ISO 4217 code, and beside it the dollar reading a tester types or reads: the card's declared value field and a pasted line both take dollars.

`<grade10 grading url>` is `grade10.com/grading`, the grading home. `<grade10 plan wizard url>` is `grade10.com/grading/new`, the plan wizard, opening on its empty Cards step. `<grade10 grading submission url>` is one submission's own page, opened from its emailed link with no account. `<grade10 book url>` is `grade10.com/book`, the site's walk-in booking. `<grade10 admin grading settings url>` is `admin.grade10.com/grading/settings`: a fee change is asked by one approver and written once a second approves it.

The stack opens with PSA's five levels at the sheet's figures and no figures for CGC or BGS. Its card price reference holds no rows, so a typed name matches nothing and no reference sale shows: a matched card and a PSA 10 reference sale are a seeded or mocked reference. Grading's dev seed (`/grading/dev/submissions/seed`) walks a submission to a named status, dated off the anchors it is given; its fast sweep lane (`/grading/dev/sweep`, lane `fast`) runs the nudge and the expiry now and holds a letter until 09:00 on the shop's clock; its outbox (`/grading/dev/outbox?email=<address>`) reads the last letter sent to an address. Signing in on the site mails a link to the email given.

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

* customer(no account) is signed out.

**Steps:**

1. Navigate to `<grade10 grading url>`.
2. Read How it works.
3. Scroll to the fee sheet under What it costs.
4. Read the buttons below the lead.

**Expected Results:**

* The four steps of How it works render, and no name, email or phone is asked for.
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

* customer(no account) is signed out and on `<grade10 grading url>`.

**Steps:**

1. Scroll to the fee sheet under What it costs.
2. Read the cover column on the Value, Regular and Bulk rows.
3. Read the cover column on the Express and Super Express rows.

**Expected Results:**

* Value, Regular and Bulk name no cover rate.
* Express and Super Express each name a cover rate of 150 basis points (1.5%) of the declared value a card.

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

* customer(no account) is signed out and on `<grade10 grading url>`.
* PSA, CGC and BGS each carry active levels with their figures, written in `<grade10 admin grading settings url>`; the stack writes PSA's alone.

**Steps:**

1. Scroll to the fee sheet under What it costs.
2. Read the grader switch above it.
3. Click CGC.

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

* customer(no account) is signed out and on `<grade10 grading url>`.

**Steps:**

1. Click Start a submission.

**Expected Results:**

* The plan wizard opens at `<grade10 plan wizard url>` on the Cards step, with no card listed.

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

* customer(no account) is signed out and on `<grade10 grading url>`.

**Steps:**

1. Click Book a drop-off without a list.

**Expected Results:**

* The browser leaves `<grade10 grading url>` for the walk-in booking at `<grade10 book url>`.
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

* customer(no account) is signed out and on `<grade10 grading url>`.

**Steps:**

1. Scroll to the fee sheet under What it costs.
2. Read the lines below its level rows.

**Expected Results:**

* The sheet names a card declared above the top level's ceiling of 3900000 (HKD minor units, HK$39,000.00).
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

* customer is on the Cards step at `<grade10 plan wizard url>`, with no card listed.
* The card price reference holds a row for `<card A>`, with recent sales at ungraded, PSA 9 and PSA 10.

**Test data:**

| Field | Value |
| --- | --- |
| `<card A>` | Umbreon VMAX (Alternate Art), Evolving Skies 188/203 |
| Declared value | 850000 (HKD minor units, HK$8,500.00): any value above nought |

**Steps:**

1. Type `<card A>`'s name in the card name field.
2. Pick the matched result from the list under the field.
3. Enter the declared value from **Test data**, in dollars.

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

* customer is on the Cards step at `<grade10 plan wizard url>`, with one card listed and its declared value given.

**Steps:**

1. Find the card's minimum-grade tick.
2. Tick it at PSA 9.

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

* customer is on the Cards step at `<grade10 plan wizard url>`, with no card listed.

**Steps:**

1. Read the Cards step without adding a card.
2. Read the continue button at its foot.

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

* customer is on the Cards step at `<grade10 plan wizard url>`, with `<card B>` and `<card C>` listed.

**Test data:**

| Field | Value |
| --- | --- |
| `<card B>` | Homebrew Test Card, declared 50000 (HKD minor units, HK$500.00) |
| `<card C>` | Homebrew Second Card, declared 70000 (HKD minor units, HK$700.00) |

**Steps:**

1. Click Remove on `<card C>`.
2. Read the list.

**Expected Results:**

* `<card C>` no longer shows on the list.
* One card remains listed: `<card B>`.

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

* customer is on the Cards step at `<grade10 plan wizard url>`, with one card listed, its declared value given and an email in About you.

**Steps:**

1. Read the wizard rail.
2. Click Continue.
3. Read the wizard rail on the Service step.

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

* customer(signed in) has a name, an email and a phone on their account.

**Test data:**

| Field | Value |
| --- | --- |
| Phone for this submission | +852 5555 0100: any valid phone other than the account's |

**Steps:**

1. Navigate to `<grade10 grading url>`.
2. Click Start a submission.
3. Read the About you fields.
4. Change the phone to the one in **Test data**.
5. Open the account's profile page and read its phone.
6. Sign out from the header.
7. Navigate to `<grade10 plan wizard url>`.
8. Read the About you fields.

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

* customer is on the Cards step at `<grade10 plan wizard url>`, with no card listed.
* The card price reference is reachable and carries no match for the name typed; the stack's reference holds none.

**Test data:**

| Field | Value |
| --- | --- |
| Card typed | Homebrew Test Card |
| Declared value | 50000 (HKD minor units, HK$500.00): any value above nought |

**Steps:**

1. Type the card name from **Test data** in the card name field.
2. Click Add this card.
3. Enter the declared value from **Test data**, in dollars.

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

* customer is on the Cards step at `<grade10 plan wizard url>`, with no card listed.
* The card price reference cannot be reached.

**Test data:**

| Field | Value |
| --- | --- |
| Card typed | Homebrew Test Card |

**Steps:**

1. Type the card name from **Test data** in the card name field.
2. Click Add this card.
3. Read the card line.

**Expected Results:**

* The card carries the reference-unavailable line rather than the kept-as-typed one.
* The declared value is still asked for.
* Nothing on the step waits on the reference.

### grade10-site-grading-submission-plan-US2-TC9-1: A minimum grade is carried to the review and costs nothing

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

* customer is on the Cards step at `<grade10 plan wizard url>`, with `<card D>` listed, its declared value given, and an email in About you.

**Test data:**

| Field | Value |
| --- | --- |
| `<card D>` | Homebrew Lugia, declared 200000 (HKD minor units, HK$2,000.00): any value at or below Regular's 1170000 (HK$11,700.00) |
| Regular fee a card | 60000 (HKD minor units, HK$600.00) |

**Steps:**

1. Tick `<card D>`'s minimum grade at PSA 9.
2. Click Continue.
3. Pick PSA at Regular.
4. Continue to the Book step.
5. Read the schedule and the fee at the counter.

**Expected Results:**

* `<card D>` carries a minimum grade of PSA 9 beside it on the schedule.
* The fee at the counter reads 60000 (HKD minor units, HK$600.00), Regular's fee a card for one card, unchanged by the minimum.

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

* customer is on the Cards step at `<grade10 plan wizard url>`, with the paste sheet open over it from Paste a list.
* The card price reference holds a row for each line's card.

**Test data:**

| Field | Value |
| --- | --- |
| Line 1 | `Charizard 1st Edition, Base Set, 4/102, 3500`: declared 350000 (HKD minor units, HK$3,500.00) |
| Line 2 | `Umbreon VMAX (Alternate Art), Evolving Skies, 188/203, 8500`: declared 850000 (HKD minor units, HK$8,500.00) |

**Steps:**

1. Paste the two lines from **Test data** into Your list.
2. Wait for matching to finish.
3. Read the rows under the lines-read counter.

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

* customer is on the Cards step at `<grade10 plan wizard url>`, with the paste sheet open over it from Paste a list.
* The card price reference is reachable and carries no match for the pasted name; the stack's reference holds none.

**Test data:**

| Field | Value |
| --- | --- |
| Line 1 | `Homebrew Test Card, 500`: no set, declared 50000 (HKD minor units, HK$500.00) |

**Steps:**

1. Paste the line from **Test data** into Your list.
2. Wait for matching to finish.
3. Read the rows under the lines-read counter.

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

* customer is on the Cards step at `<grade10 plan wizard url>`, with the paste sheet open over it from Paste a list.
* The card price reference is reachable.

**Test data:**

| Field | Value |
| --- | --- |
| Line 1 | `Charizard 1st Edition, Base Set, 4/102`: no value |

**Steps:**

1. Paste the line from **Test data** into Your list.
2. Wait for matching to finish.
3. Read the rows under the lines-read counter.
4. Click the button that adds 1 card to the list.
5. Read the Cards step and its continue button.

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

* customer is on the Cards step at `<grade10 plan wizard url>`, with the paste sheet open over it from Paste a list.
* The card price reference is reachable.

**Test data:**

| Field | Value |
| --- | --- |
| Line 1 | `Umbreon VMAX (Alternate Art), Evolving Skies, 188/203, 42000`: declared 4200000 (HKD minor units, HK$42,000.00), any value above the top ceiling of 3900000 (HK$39,000.00) |

**Steps:**

1. Paste the line from **Test data** into Your list.
2. Wait for matching to finish.
3. Read the rows under the lines-read counter.

**Expected Results:**

* The line reports as above the ceiling, naming the card and its declared value.
* The collector is told to ask at the counter or on WhatsApp, 4200000 (HKD minor units) being above the top level's 3900000 (HKD minor units) ceiling.
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

* customer is on the Cards step at `<grade10 plan wizard url>`, with the listed card from **Test data** added by hand and matched.
* The card price reference is reachable and holds a row for the listed card.

**Test data:**

| Field | Value |
| --- | --- |
| Listed card | Charizard 1st Edition, Base Set 4/102, declared 350000 (HKD minor units, HK$3,500.00) |
| Pasted line | `Charizard 1st Edition, Base Set, 4/102, 3500`: the same card |

**Steps:**

1. Click Paste a list.
2. Paste the pasted line from **Test data** into Your list.
3. Wait for matching to finish.
4. Read the rows under the lines-read counter.

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

* customer is on the Cards step at `<grade10 plan wizard url>`, with the paste sheet open over it from Paste a list.

**Steps:**

1. Leave Your list empty.
2. Read the sheet's add button.

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

* customer is on the Cards step at `<grade10 plan wizard url>`, with the paste sheet open over it from Paste a list.
* The card price reference cannot be reached.

**Test data:**

| Field | Value |
| --- | --- |
| Line 1 | `Charizard 1st Edition, Base Set, 4/102, 3500`: declared 350000 (HKD minor units, HK$3,500.00) |
| Line 2 | `Umbreon VMAX (Alternate Art), Evolving Skies, 188/203, 8500`: declared 850000 (HKD minor units, HK$8,500.00) |

**Steps:**

1. Paste the two lines from **Test data** into Your list.
2. Wait for matching to finish.
3. Read the rows and the sheet's add button.

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

* customer is on the Cards step at `<grade10 plan wizard url>`, with the paste sheet open over it from Paste a list.
* The card price reference is reachable and holds a row for each matched line's card.
* One of the 30 cards pasted is already on the list.

**Test data:**

| Line kind | Lines | Pasted as |
| --- | --- | --- |
| Matched | 6 | Six cards the reference holds, each `<name>, <set>, <number>, 1000`: declared 100000 (HKD minor units, HK$1,000.00) |
| Kept as typed | 14 | `Homebrew Card 01, 1000` to `Homebrew Card 14, 1000` |
| Without a value | 5 | Five more cards the reference holds, with no value |
| Above the ceiling | 4 | `Homebrew Card 15, 2000` to `Homebrew Card 18, 2000`: declared 200000 (HK$2,000.00), above Bulk's 150000 (HK$1,500.00), the ceiling a list past 20 lines is read against |
| Skipped | 1 | The card already on the list, pasted again |

**Steps:**

1. Paste the 30 lines from **Test data** into Your list.
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

* customer is on the Cards step at `<grade10 plan wizard url>`, with an email in About you and the paste sheet open over it from Paste a list.
* The card price reference is reachable.

**Test data:**

| Field | Value |
| --- | --- |
| Pasted lines | 25 lines, `Homebrew Card 01, 1000` to `Homebrew Card 25, 1000`: each declared 100000 (HKD minor units, HK$1,000.00), inside Bulk's 150000 (HK$1,500.00); any count above 20 |

**Steps:**

1. Paste the 25 lines from **Test data** into Your list.
2. Wait for matching to finish.
3. Click the button that adds 25 cards to the list.
4. Click Continue.
5. Read the levels.

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

* customer is on the Cards step at `<grade10 plan wizard url>`, with an email in About you and the paste sheet open over it from Paste a list.
* The card price reference is reachable.

**Test data:**

| Field | Value |
| --- | --- |
| Pasted lines | 20 lines, `Homebrew Card 01, 1000` to `Homebrew Card 20, 1000`: each declared 100000 (HKD minor units, HK$1,000.00), inside every level's ceiling |

**Steps:**

1. Paste the 20 lines from **Test data** into Your list.
2. Wait for matching to finish.
3. Click the button that adds 20 cards to the list.
4. Click Continue.
5. Read the levels.

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

* customer is on the Cards step at `<grade10 plan wizard url>`, with an email in About you and the paste sheet open over it from Paste a list.
* The card price reference is reachable.

**Test data:**

| Field | Value |
| --- | --- |
| Pasted lines | 21 lines, `Homebrew Card 01, 1000` to `Homebrew Card 21, 1000`: each declared 100000 (HKD minor units, HK$1,000.00), inside Bulk's 150000 (HK$1,500.00) |

**Steps:**

1. Paste the 21 lines from **Test data** into Your list.
2. Wait for matching to finish.
3. Click the button that adds 21 cards to the list.
4. Click Continue.
5. Read the levels.

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

* customer is on the Cards step at `<grade10 plan wizard url>`, with the paste sheet open over it from Paste a list.
* The card price reference is reachable.

**Test data:**

| Field | Value |
| --- | --- |
| Pasted lines | 21 lines, `Homebrew Card 01, 1000` to `Homebrew Card 21, 1000`: each declared 100000 (HKD minor units, HK$1,000.00) |
| The line above Bulk's ceiling | `Homebrew Grail, 2000`: declared 200000 (HKD minor units, HK$2,000.00), above Bulk's 150000 (HK$1,500.00) and inside the top ceiling of 3900000 (HK$39,000.00) |

**Steps:**

1. Paste the 22 lines from **Test data** into Your list.
2. Wait for matching to finish.
3. Read the rows under the lines-read counter.

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

* customer is on the Cards step at `<grade10 plan wizard url>`, with 100 cards listed, which leaves Bulk the only open level: pasted as `Homebrew Card 001, 1000` to `Homebrew Card 100, 1000`.
* The card price reference is reachable.

**Test data:**

| Field | Value |
| --- | --- |
| Pasted line | `Homebrew Card 101, 1000`: one more card, declared 100000 (HKD minor units, HK$1,000.00) |

**Steps:**

1. Click Paste a list.
2. Paste the line from **Test data** into Your list.
3. Wait for matching to finish.
4. Click the button that adds the card to the list.
5. Read the Cards step.

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

* customer is on the Cards step at `<grade10 plan wizard url>`, with 99 cards listed, which leaves Bulk the only open level: pasted as `Homebrew Card 001, 1000` to `Homebrew Card 099, 1000`.
* The card price reference is reachable.

**Test data:**

| Field | Value |
| --- | --- |
| Pasted line | `Homebrew Card 100, 1000`: one more card, declared 100000 (HKD minor units, HK$1,000.00) |

**Steps:**

1. Click Paste a list.
2. Paste the line from **Test data** into Your list.
3. Wait for matching to finish.
4. Click the button that adds the card to the list.
5. Read the Cards step.

**Expected Results:**

* The card is added to the list at Bulk.
* The over-the-cap line, the rest in a second submission on another day, does not show.

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

* customer is on the Service step at `<grade10 plan wizard url>`, the four cards in **Test data** listed and an email given on the Cards step.

**Test data:**

| Field | Value |
| --- | --- |
| Cards | `Homebrew Umbreon` 850000 (HK$8,500.00), `Homebrew Pikachu` 100000 (HK$1,000.00), `Homebrew Eevee` 80000 (HK$800.00), `Homebrew Mew` 50000 (HK$500.00), all HKD minor units: the highest above Value's 390000 (HK$3,900.00) and at or below Regular's 1170000 (HK$11,700.00) |

**Steps:**

1. Click PSA under Grader.
2. Read the Regular level.
3. Read the Express level.

**Expected Results:**

* Regular shows open, naming its ceiling of 1170000 (HKD minor units, HK$11,700.00), its fee a card of 60000 (HKD minor units, HK$600.00) and its return date about 5 weeks out.
* Express additionally names a cover line at 150 basis points (1.5%) of the declared value a card.

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

* customer is on the Service step at `<grade10 plan wizard url>`, the four cards in **Test data** listed and an email given on the Cards step.

**Test data:**

| Field | Value |
| --- | --- |
| Cards | `Homebrew Umbreon` 850000 (HK$8,500.00), `Homebrew Pikachu` 100000 (HK$1,000.00), `Homebrew Eevee` 80000 (HK$800.00), `Homebrew Mew` 50000 (HK$500.00), all HKD minor units: the highest above Value's 390000 (HK$3,900.00) |

**Steps:**

1. Click PSA under Grader.
2. Read the Value level.

**Expected Results:**

* Value shows closed, naming the card declared at 850000 (HKD minor units, HK$8,500.00) as above its 390000 (HKD minor units, HK$3,900.00) ceiling.

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

* customer is on the Service step at `<grade10 plan wizard url>`, four cards listed, each declared inside Bulk's 150000 (HKD minor units, HK$1,500.00), and an email given on the Cards step.

**Steps:**

1. Click PSA under Grader.
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

* customer is on the Service step at `<grade10 plan wizard url>`, the card in **Test data** listed and an email given on the Cards step.

**Test data:**

| Field | Value |
| --- | --- |
| Card | `Homebrew Grail`, declared 4200000 (HKD minor units, HK$42,000.00): any value above the top ceiling of 3900000 (HK$39,000.00) |

**Steps:**

1. Click PSA under Grader.
2. Read every level.
3. Read the line under the levels and the continue button.

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

* customer is on the Service step at `<grade10 plan wizard url>`, with a grader selected and no level chosen.

**Steps:**

1. Read the Service step before picking a level.
2. Read the continue button.

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

* customer is on the Service step at `<grade10 plan wizard url>`, with cards listed.
* CGC's fee sheet carries only the example figures: no CGC figure is written in `<grade10 admin grading settings url>`, as the stack opens.

**Steps:**

1. Click CGC under Grader.
2. Read CGC's levels.

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

* customer is on the Service step at `<grade10 plan wizard url>`, four cards listed, none declared above Regular's 1170000 (HKD minor units, HK$11,700.00), and an email given on the Cards step.

**Steps:**

1. Click PSA under Grader.
2. Pick Regular.
3. Continue to the Book step.
4. Read the review's header and the schedule.

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

* customer is on the Service step at `<grade10 plan wizard url>`, four cards listed, none declared above Regular's 1170000 (HKD minor units, HK$11,700.00), and an email given on the Cards step.

**Test data:**

| Field | Value |
| --- | --- |
| Regular fee a card | 60000 (HKD minor units, HK$600.00) |
| Estimate, 4 cards | 240000 (HKD minor units, HK$2,400.00) |

**Steps:**

1. Click PSA under Grader.
2. Pick Regular.
3. Read Your estimate.

**Expected Results:**

* The estimate reads 240000 (HKD minor units) from **Test data**, being 4 times the fee a card.
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

* customer is on the Service step at `<grade10 plan wizard url>`, one card listed, declared at 850000 (HKD minor units, HK$8,500.00), and an email given on the Cards step.

**Test data:**

| Field | Value |
| --- | --- |
| Express fee a card | 120000 (HKD minor units, HK$1,200.00) |
| Cover, 150 basis points (1.5%) of 850000 | 12750 (HKD minor units, HK$127.50) |
| Total | 132750 (HKD minor units, HK$1,327.50) |

**Steps:**

1. Click PSA under Grader.
2. Pick Express.
3. Read Your estimate.

**Expected Results:**

* The cover line for the card reads 12750 (HKD minor units) from **Test data**.
* The total reads 132750 (HKD minor units), the fee and the cover line added.

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

* customer(no account) is signed out and on the Cards step at `<grade10 plan wizard url>`, with one card listed and its declared value given.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | An address only this run writes to, such as `plan-later-<run>@grade10.dev` |

**Steps:**

1. Enter `<collector email>` in About you.
2. Click Finish later.
3. Leave the page.
4. Read the last letter to `<collector email>` in grading's outbox.

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

* customer(no account) is signed out and on the Cards step at `<grade10 plan wizard url>`, with one card listed and the email field blank.

**Steps:**

1. Click Finish later without entering an email.
2. Read the Cards step under About you.

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

* customer(no account) has a plan kept under an email with Save and book later, and holds its emailed link.
* A second device, or a private window, has never signed in to the site.

**Steps:**

1. Open the emailed link on the second device.
2. Read the page that opens.

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

* customer(signed out) has two submissions under `<collector email>`: one planned on the site and kept, and one seeded at `collected` through grading's dev seed.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | An address only this run writes to, such as `plan-home-<run>@grade10.dev` |

**Steps:**

1. Navigate to `<grade10 grading url>`.
2. Click Sign in in the header.
3. Enter `<collector email>`.
4. Open the sign-in link mailed to it.
5. Read Your submissions on the home.

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

* customer(signed in) has no submission under their email and is on `<grade10 grading url>`.

**Steps:**

1. Read Your submissions on the home.

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

* customer(signed in) is on `<grade10 grading url>`.
* Reading the collector's submissions fails.

**Steps:**

1. Read Your submissions on the home.

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

* customer has a submission at PSA Regular with its drop-off booked from its page, while Regular was 60000 (HKD minor units, HK$600.00) a card, and holds its emailed link.
* admin A(holds grading:approve) and admin B(holds grading:approve) are each on `<grade10 admin grading settings url>`.

**Test data:**

| Field | Value |
| --- | --- |
| Regular fee a card, booked on | 60000 (HKD minor units, HK$600.00) |
| Regular fee a card, changed to | 70000 (HKD minor units, HK$700.00): any figure other than the booked one |

**Steps:**

1. As admin A, change PSA Regular's fee a card to the changed figure from **Test data**, with a reason.
2. As admin B, approve the waiting change.
3. As the customer, open the booked submission from its emailed link.
4. Read its fee a card, its estimate and its totals.

**Expected Results:**

* The submission still reads 60000 (HKD minor units) a card.
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

* customer has a plan kept at PSA Regular with Save and book later, no drop-off booked, made while Regular was 60000 (HKD minor units, HK$600.00) a card, and holds its emailed link.
* admin A(holds grading:approve) and admin B(holds grading:approve) are each on `<grade10 admin grading settings url>`.

**Test data:**

| Field | Value |
| --- | --- |
| Regular fee a card, changed to | 70000 (HKD minor units, HK$700.00): any figure other than the one the plan was made on |

**Steps:**

1. As admin A, change PSA Regular's fee a card to the figure from **Test data**, with a reason.
2. As admin B, approve the waiting change.
3. As the customer, open the kept plan from its emailed link.
4. Read its estimate.

**Expected Results:**

* The estimate reads 70000 (HKD minor units) a card.

### grade10-site-grading-submission-plan-US6-TC9-1: A plan saved unticked asks for the statement before its drop-off

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-plan-US-06

**Pre-conditions:**

* customer has a plan saved for later with the collection statement unticked, no drop-off booked and none held under the same email, and holds its emailed link.
* A second tab holds the plan's page, loaded while the plan was unticked.

**Steps:**

1. Open the kept plan from its emailed link.
2. In the second tab, send a booking of a free day and time for the plan carrying no tick.
3. In the first tab, tick the statement.
4. Book a free day and time.

**Expected Results:**

* Step 1: the statement is asked for in the review's words, and no day is offered.
* Step 2: the booking is refused by name, and the plan holds no drop-off.
* Step 3: the days are offered.
* Step 4: the drop-off is booked, and on reload the plan holds the tick with it.

### grade10-site-grading-submission-plan-US6-TC10-1: A plan kept with no level asks for one before its drop-off

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-plan-US-06

**Pre-conditions:**

* customer has a plan kept part way through the wizard with Finish later on the Service step, PSA picked, no level picked, the collection statement unticked and no drop-off booked, and holds its emailed link.
* A drop-off is booked under the same email for another submission.

**Test data:**

| Field | Value |
| --- | --- |
| Level picked in the edit | Regular |

**Steps:**

1. Open the kept plan from its emailed link.
2. Send a booking of a free day and time for the plan, outside its page.
3. Send a join of the other submission's drop-off for the plan, outside its page.
4. Click the list's edit link.
5. On the service step, pick the level from **Test data**.
6. Save the changes from the review.

**Expected Results:**

* Step 1: the page asks for a level beside the list's edit link; no day and no join are offered.
* Step 2: the booking is refused by name; the diary holds no new visit.
* Step 3: the join is refused by name; the other drop-off is unchanged.
* Step 4: the editor opens on the kept list.
* Step 5: the estimate shows for the level picked.
* Step 6: the page no longer asks for a level; it asks for the statement in the review's words, and no day is offered yet.

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

* customer is on the Book step at `<grade10 plan wizard url>`, four cards listed at PSA Regular, none declared above Regular's 1170000 (HKD minor units, HK$11,700.00), and an email given.

**Test data:**

| Field | Value |
| --- | --- |
| Fee a card at Regular | 60000 (HKD minor units, HK$600.00) |
| Fee at the counter, 4 cards | 240000 (HKD minor units, HK$2,400.00) |

**Steps:**

1. Read the review's totals.
2. Read Good to know.

**Expected Results:**

* The totals show the fee at the counter of 240000 (HKD minor units) from **Test data**, with no cover line at Regular.
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

* customer is on the Book step at `<grade10 plan wizard url>`, four cards listed at PSA Regular.
* One card, Umbreon VMAX (Alternate Art), is matched in the card price reference and declared at 850000 (HKD minor units, HK$8,500.00), its PSA 10 reference reading 1500000 (HKD minor units, HK$15,000.00) at the reference rate, above Regular's 1170000 (HKD minor units, HK$11,700.00) ceiling.

**Test data:**

| Field | Value |
| --- | --- |
| Regular fee a card | 60000 (HKD minor units, HK$600.00) |
| Express fee a card | 120000 (HKD minor units, HK$1,200.00) |

**Steps:**

1. Read the review's upcharge warning for Umbreon VMAX.

**Expected Results:**

* Umbreon VMAX is named with Express as the level the grader would move it to.
* The difference due at the counter reads 60000 (HKD minor units), Express's fee less Regular's fee from **Test data**.
* Express's fee now, 120000 (HKD minor units), shows beside it.

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

* customer is on the Book step at `<grade10 plan wizard url>`, four cards listed at PSA Regular, every card's PSA 10 reference within Regular's 1170000 (HKD minor units, HK$11,700.00) ceiling.

**Steps:**

1. Read the review.

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

* customer is on the Book step at `<grade10 plan wizard url>`, with the collection statement unticked.

**Steps:**

1. Read Book the drop-off before ticking the collection statement.
2. Tick the collection statement.
3. Read Book the drop-off again.

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

* customer is on the Book step at `<grade10 plan wizard url>`, four cards listed at PSA Express, each with a declared value inside Express's 1950000 (HKD minor units, HK$19,500.00).

**Steps:**

1. Read the review's totals.

**Expected Results:**

* The cover line shows under the fee, per card and in total, at 150 basis points (1.5%) of each card's declared value.

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

* customer is on the Book step at `<grade10 plan wizard url>`, with the collection statement ticked.

**Steps:**

1. Click Book the drop-off.
2. Read both buttons while the booking is in progress.

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

* customer is on the Book step at `<grade10 plan wizard url>`, with an email given and the collection statement unticked.

**Steps:**

1. Leave the collection statement unticked.
2. Click Save and book later.
3. Read the submission page that opens.

**Expected Results:**

* Save and book later is offered while the statement is unticked.
* The plan is kept, and its page opens at Planned.
* The statement is still unticked on the plan.
* Book the drop-off was the only action the unticked statement refused.

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

* The reference rate in `<grade10 admin grading settings url>` reads 7.84 HKD to 1 USD, as the stack seeds it.
* customer is on the Book step at `<grade10 plan wizard url>`, at PSA Regular.
* One card, Umbreon VMAX (Alternate Art), is matched in the card price reference and declared at 850000 (HKD minor units, HK$8,500.00), with a PSA 10 reference sale of 150000 (USD minor units, US$1,500.00).

**Test data:**

| Field | Value |
| --- | --- |
| Reference rate | 784 (HKD minor units) to 1 USD (7.84) |
| Regular ceiling | 1170000 (HKD minor units, HK$11,700.00) |
| Regular fee a card | 60000 (HKD minor units, HK$600.00) |
| Express fee a card | 120000 (HKD minor units, HK$1,200.00) |

**Steps:**

1. Read the review's upcharge warning for Umbreon VMAX.

**Expected Results:**

* The PSA 10 sale reads 1176000 (HKD minor units, HK$11,760.00), 150000 (USD minor units) at the rate from **Test data**, above Regular's ceiling.
* Umbreon VMAX is named with Express as the level the grader would move it to.
* The difference due at the counter reads 60000 (HKD minor units).

### grade10-site-grading-submission-plan-US7-TC9-1: A plan booked from a ticked review opens on the picker with nothing asked

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-plan-US-07

**Pre-conditions:**

* customer is on the wizard's review at `<grade10 plan wizard url>`, with an email given, a level picked and no drop-off held under the email.

**Steps:**

1. Tick the collection statement.
2. Click Book the drop-off.
3. Reload the submission page that opens.

**Expected Results:**

* Step 2: the submission page opens on the drop-off picker, and the statement is not asked for.
* Step 3: the page still opens on the picker with no statement asked: the plan was kept ticked.

### grade10-site-grading-submission-plan-US7-TC10-1: The review totals the declared value, the fee and the cover

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

* customer is on the Book step at `<grade10 plan wizard url>`, the two cards in **Test data** listed at PSA Express and an email given.

**Test data:**

| Field | Value |
| --- | --- |
| Cards | `Homebrew Umbreon` 850000 (HK$8,500.00) and `Homebrew Charizard` 400000 (HK$4,000.00), HKD minor units, each inside Express's 1950000 (HK$19,500.00) |
| Declared in total | 1250000 (HKD minor units, HK$12,500.00) |
| Fee at the counter | 240000 (HKD minor units, HK$2,400.00) |
| Cover | 18750 (HKD minor units, HK$187.50) |

**Steps:**

1. Read the review's totals.

**Expected Results:**

* The declared total reads 1250000 (HKD minor units) from **Test data**, the two declared values added.
* The fee reads 240000 (HKD minor units), 2 times Express's fee a card of 120000.
* The cover reads 18750 (HKD minor units), 150 basis points (1.5%) of each card's declared value, added.

---

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

* customer has a plan kept 21 Asia/Hong_Kong days ago with no drop-off booked: seeded at `planned` through grading's dev seed, created 21 days back, and holds its link.

**Steps:**

1. Open the plan's page from its link.
2. Read the lead under the status.

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

* customer has a plan kept 30 Asia/Hong_Kong days ago with no drop-off booked: seeded at `planned` through grading's dev seed, created 30 days back, and holds its link.

**Steps:**

1. Run grading's fast sweep lane.
2. Open the plan's page from its link.
3. Read the status and the lead.

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

* customer is on the Book step at `<grade10 plan wizard url>`, the plan kept from the wizard with Finish later, and its keep moved 30 Asia/Hong_Kong days back while the review stays open, no drop-off booked.

**Steps:**

1. Tick the collection statement.
2. Click Book the drop-off.

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

* customer has a plan with a drop-off booked, kept 30 Asia/Hong_Kong days ago: seeded at `booked` through grading's dev seed, created 30 days back, and holds its link.

**Steps:**

1. Run grading's fast sweep lane.
2. Open the plan's page from its link.
3. Read the status and the lead.

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
| `grade10-site-grading-submission-plan-SC-62` a plan kept from a ticked review | **Case added:** `US7-TC9-1` | written after the blind pass: the keep carries the review's tick, so a plan booked from the review is never asked for it again |
| `grade10-site-grading-submission-plan-SC-61` a plan kept unticked asks for the statement | **Case added:** `US6-TC9-1` | written after the blind pass: a plan saved unticked and booked from its page was asked for nothing, so the plan now holds its tick and a booking or a join for it unticked is refused |
| `grade10-site-grading-submission-plan-SC-63` a plan kept with no level asks for one | **Case added:** `US6-TC10-1` | written after the blind pass: a plan kept before a level was picked was offered a drop-off its booking could only refuse, so its page now asks for the level through the list's edit, and a booking or a join sent for it is refused before the diary is asked |

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
