# grade10-site/grading/submission-plan Test Cases

**Status:** pending-review · 0/43
**Drafts styled:** 2026-10-25, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7

## Background

* Grade10's currency is HKD; a declared value field and a pasted line take dollars. `<grading home>` is the grading home on the Grade10 site; Start a submission opens the plan wizard, `<wizard>`, on its Cards step, then Service, then Book. A submission's own page, `<submission page>`, opens from its emailed link with no account.
* PSA's five levels stand at the sheet's figures: Value up to HKD 3,900.00 a card; Regular up to HKD 11,700.00, HKD 600.00 a card, about 5 weeks; Express up to HKD 19,500.00, HKD 1,200.00 a card with cover at 1.5% of the declared value; Super Express with cover; Bulk up to HKD 1,500.00, HKD 180.00 a card, about 10 weeks, from 20 to 100 cards. The top ceiling is HKD 39,000.00. CGC and BGS carry no figures.
* The card price reference answers for a card only where a test seeds or mocks it. Fee changes are asked by one `grading:approve` holder in the grading settings on the admin console and written once a second approves. Grading's daily sweep and the shop's clock, Hong Kong's, are moved by the tester to reach a day.

## g10.grading-submission-plan.US1: Collector learns what grading costs before signing in

**As a** collector who has never used the shop for grading,
**I want** the first visit to say what grading is, the four steps and the price sheet with its cover line, and to let me start a submission or book a drop-off without a list,
**so that** I know the fee and the return date before I give anyone my name.

<!-- trace:case id=g10.grading-submission-plan.TC-6v4 rev=1 covers=g10.grading-submission-plan.SC-yns,g10.grading-submission-plan.SC-z5h,g10.grading-submission-plan.SC-d03,g10.grading-submission-plan.SC-48z,g10.grading-submission-plan.SC-a00,g10.grading-submission-plan.SC-e76 -->
### g10.grading-submission-plan.US1-TC1: The signed-out home prices grading, grader by grader, before a name is asked

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-01

**Pre-conditions:**

* A signed-out visitor; PSA, CGC and BGS each carry active levels with figures, written in the grading settings.

**Steps:**

1. Open `<grading home>`, and read How it works and the buttons below the lead.
2. Read the fee sheet under What it costs, and the lines below its rows.
3. Click CGC above the sheet.

**Expected Results:**

* Step 1 shows the four steps, Start a submission and Book a drop-off without a list, asking for no name, email, phone or account.
* Step 2 lists PSA's levels, each with its declared-value ceiling, cards a submission, fee a card and weeks back; Express and Super Express name cover at 1.5% of the declared value, Value, Regular and Bulk none; below, a card declared above the top ceiling of HKD 39,000.00 is asked about at the counter or on WhatsApp rather than priced.
* Step 3 shows CGC's own levels in PSA's place, a tab per grader standing above the sheet.

<!-- trace:case id=g10.grading-submission-plan.TC-0gh rev=1 covers=g10.grading-submission-plan.SC-yns,g10.grading-submission-plan.SC-z5h,g10.grading-submission-plan.SC-d03,g10.grading-submission-plan.SC-48z,g10.grading-submission-plan.SC-a00,g10.grading-submission-plan.SC-e76 -->
### g10.grading-submission-plan.US1-TC4: Each way in from the home opens where it says, with no list until one is started

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-01

**Pre-conditions:**

* A signed-out visitor is on `<grading home>`.

**Test data:**

| `<clicked>` | `<opens>` |
| --- | --- |
| Start a submission | `<wizard>` on its Cards step, no card listed, offering Add a card and Paste a list |
| Book a drop-off without a list | the site's walk-in booking, no card list created |

**Steps:**

1. Click `<clicked>`.

**Expected Results:**

* It opens `<opens>`.

---

## g10.grading-submission-plan.US2: Collector lists a few cards by hand

**As a** collector with a handful of cards,
**I want** to add each card with its set matched in the card price reference, its declared value and the recent sales beside it as a reference, and to set a minimum grade on a card I do not want slabbed below it,
**so that** the level and the cover are set by what I would insure each card for, and not by a guess.

<!-- trace:case id=g10.grading-submission-plan.TC-thx rev=1 covers=g10.grading-submission-plan.SC-prc,g10.grading-submission-plan.SC-ku6,g10.grading-submission-plan.SC-7xf,g10.grading-submission-plan.SC-bph,g10.grading-submission-plan.SC-w4r,g10.grading-submission-plan.SC-7h7,g10.grading-submission-plan.SC-fp6 -->
### g10.grading-submission-plan.US2-TC1: A matched card carries the reference's name and its recent sales, as a reference

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-02

**Pre-conditions:**

* A collector is on `<wizard>`'s Cards step; the reference holds Umbreon VMAX (Alternate Art), Evolving Skies 188/203, with sales at ungraded, PSA 9 and PSA 10.

**Steps:**

1. Type its name, pick the matched result, and enter HKD 8,500.00 as its declared value.

**Expected Results:**

* The card carries the reference's name with the set and number; its recent sales at ungraded, PSA 9 and PSA 10 show beside it as a reference, not a valuation; the value is held.

<!-- trace:case id=g10.grading-submission-plan.TC-njt rev=1 covers=g10.grading-submission-plan.SC-prc,g10.grading-submission-plan.SC-ku6,g10.grading-submission-plan.SC-7xf,g10.grading-submission-plan.SC-bph,g10.grading-submission-plan.SC-w4r,g10.grading-submission-plan.SC-7h7,g10.grading-submission-plan.SC-fp6,g10.grading-submission-plan.SC-r4q,g10.grading-submission-plan.SC-0wj,g10.grading-submission-plan.SC-fik,g10.grading-submission-plan.SC-j6g,g10.grading-submission-plan.SC-40a,g10.grading-submission-plan.SC-34a,g10.grading-submission-plan.SC-oiv,g10.grading-submission-plan.SC-ful -->
### g10.grading-submission-plan.US2-TC7: A card the reference does not answer for is kept as typed, by hand or pasted

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-02

**Pre-conditions:**

* A collector is on `<wizard>`'s Cards step; the reference answers but holds nothing for Homebrew Test Card.

**Test data:**

| `<added>` |
| --- |
| typed in the card name field, then Add this card |
| pasted as the line Homebrew Test Card, 500 |

**Steps:**

1. Add Homebrew Test Card `<added>`, and give its value where asked.

**Expected Results:**

* It is listed in the name as typed, with no reference sales, its declared value asked for and held.

<!-- trace:case id=g10.grading-submission-plan.TC-a07 rev=1 covers=g10.grading-submission-plan.SC-prc,g10.grading-submission-plan.SC-ku6,g10.grading-submission-plan.SC-7xf,g10.grading-submission-plan.SC-bph,g10.grading-submission-plan.SC-w4r,g10.grading-submission-plan.SC-7h7,g10.grading-submission-plan.SC-fp6 -->
### g10.grading-submission-plan.US2-TC2: A minimum grade is captioned, carried to the review and costs nothing

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-02

**Pre-conditions:**

* A collector has Homebrew Lugia, declared HKD 2,000.00, on `<wizard>`'s Cards step, an email given.

**Steps:**

1. Tick its minimum grade at PSA 9.
2. Continue, pick PSA at Regular, and continue to Book.

**Expected Results:**

* Step 1 captions that it is only encapsulated at PSA 9 or above, the fee applying either way.
* Step 2's schedule carries PSA 9 beside it, and the fee reads HKD 600.00, Regular's fee unchanged.

<!-- trace:case id=g10.grading-submission-plan.TC-nyh rev=1 covers=g10.grading-submission-plan.SC-prc,g10.grading-submission-plan.SC-ku6,g10.grading-submission-plan.SC-7xf,g10.grading-submission-plan.SC-bph,g10.grading-submission-plan.SC-w4r,g10.grading-submission-plan.SC-7h7,g10.grading-submission-plan.SC-fp6,g10.grading-submission-plan.SC-r4q,g10.grading-submission-plan.SC-0wj,g10.grading-submission-plan.SC-fik,g10.grading-submission-plan.SC-j6g,g10.grading-submission-plan.SC-40a,g10.grading-submission-plan.SC-34a,g10.grading-submission-plan.SC-oiv,g10.grading-submission-plan.SC-ful -->
### g10.grading-submission-plan.US2-TC3: The Cards step holds a list with no card, or a card with no value

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
* **Trace:** grade10-site-grading-submission-plan-US-02

**Pre-conditions:**

* A collector is on `<wizard>`'s Cards step holding `<list>`.

**Test data:**

| `<list>` | `<continue>` |
| --- | --- |
| no card | disabled, Add a card and Paste a list offered |
| four cards, Charizard 1st Edition, Base Set, 4/102 pasted with no value | disabled, naming the one card without a value |

**Steps:**

1. Read Continue.

**Expected Results:**

* Continue is `<continue>`.

<!-- trace:case id=g10.grading-submission-plan.TC-t4a rev=1 covers=g10.grading-submission-plan.SC-prc,g10.grading-submission-plan.SC-ku6,g10.grading-submission-plan.SC-7xf,g10.grading-submission-plan.SC-bph,g10.grading-submission-plan.SC-w4r,g10.grading-submission-plan.SC-7h7,g10.grading-submission-plan.SC-fp6 -->
### g10.grading-submission-plan.US2-TC4: A card removed leaves the rest of the list alone

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-02

**Pre-conditions:**

* Homebrew Test Card, HKD 500.00, and Homebrew Second Card, HKD 700.00, are listed.

**Steps:**

1. Click Remove on Homebrew Second Card.

**Expected Results:**

* It is off the list; Homebrew Test Card remains, still declared HKD 500.00.

<!-- trace:case id=g10.grading-submission-plan.TC-3mk rev=1 covers=g10.grading-submission-plan.SC-prc,g10.grading-submission-plan.SC-ku6,g10.grading-submission-plan.SC-7xf,g10.grading-submission-plan.SC-bph,g10.grading-submission-plan.SC-w4r,g10.grading-submission-plan.SC-7h7,g10.grading-submission-plan.SC-fp6 -->
### g10.grading-submission-plan.US2-TC5: The wizard rail reads which step the collector is on

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-02

**Pre-conditions:**

* A collector is on `<wizard>`'s Cards step, one card valued and an email given.

**Steps:**

1. Read the rail, click Continue, and read it again.

**Expected Results:**

* On Cards, The cards reads in progress, The service and Book to come; on Service, The cards reads done and The service in progress.

<!-- trace:case id=g10.grading-submission-plan.TC-9ot rev=1 covers=g10.grading-submission-plan.SC-prc,g10.grading-submission-plan.SC-ku6,g10.grading-submission-plan.SC-7xf,g10.grading-submission-plan.SC-bph,g10.grading-submission-plan.SC-w4r,g10.grading-submission-plan.SC-7h7,g10.grading-submission-plan.SC-fp6 -->
### g10.grading-submission-plan.US2-TC6: Contact details are filled in for a signed-in collector, and asked of a signed-out one

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-02

**Pre-conditions:**

* A collector's account holds a name, an email and a phone.

**Steps:**

1. Signed in, click Start a submission, and read About you.
2. Change the phone to +852 5555 0100, and read the account's profile.
3. Signed out, open `<wizard>` and read About you.

**Expected Results:**

* Step 1 fills the name, email and phone from the account.
* Step 2 holds the new phone on this submission, the account unchanged.
* Step 3 asks for all three, none filled in.

---

## g10.grading-submission-plan.US3: Collector pastes a list of cards

**As a** collector with many cards,
**I want** to paste one card a line and be told which lines matched the reference, which kept the name I typed, which still need a value and which sit above the level's ceiling,
**so that** a long list takes a minute and nothing on it is silently dropped or guessed.

<!-- trace:case id=g10.grading-submission-plan.TC-iiu rev=1 covers=g10.grading-submission-plan.SC-r4q,g10.grading-submission-plan.SC-0wj,g10.grading-submission-plan.SC-fik,g10.grading-submission-plan.SC-j6g,g10.grading-submission-plan.SC-40a,g10.grading-submission-plan.SC-34a,g10.grading-submission-plan.SC-oiv,g10.grading-submission-plan.SC-ful -->
### g10.grading-submission-plan.US3-TC8: A paste reports every line before any card is added, and skips a card already listed

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Pasting a list

**Pre-conditions:**

* A collector has Charizard 1st Edition, Base Set 4/102, HKD 3,500.00, listed and matched; the reference holds every matched line's card.

**Test data:**

| Lines | Pasted as |
| --- | --- |
| 6 matched | six cards the reference holds, each at 1000 |
| 14 kept as typed | Homebrew Card 01, 1000 to Homebrew Card 14, 1000 |
| 5 without a value | five more cards the reference holds, no value |
| 4 above the ceiling | Homebrew Card 15, 2000 to Homebrew Card 18, 2000, above Bulk's HKD 1,500.00 |
| 1 skipped | Charizard 1st Edition, Base Set, 4/102, 3500 |

**Steps:**

1. Click Paste a list, paste the 30 lines, and read the rows and the counts.
2. Close the sheet with Go back, and read the list.

**Expected Results:**

* Step 1 reports each line as matched, kept as typed, without a value, above the ceiling or skipped as already listed; the five counts add to 30 and show before any card is added.
* Step 2 lists Charizard once.

<!-- trace:case id=g10.grading-submission-plan.TC-rfw rev=1 covers=g10.grading-submission-plan.SC-r4q,g10.grading-submission-plan.SC-0wj,g10.grading-submission-plan.SC-fik,g10.grading-submission-plan.SC-j6g,g10.grading-submission-plan.SC-40a,g10.grading-submission-plan.SC-34a,g10.grading-submission-plan.SC-oiv,g10.grading-submission-plan.SC-ful,g10.grading-submission-plan.SC-prc,g10.grading-submission-plan.SC-ku6,g10.grading-submission-plan.SC-7xf,g10.grading-submission-plan.SC-bph,g10.grading-submission-plan.SC-w4r,g10.grading-submission-plan.SC-7h7,g10.grading-submission-plan.SC-fp6 -->
### g10.grading-submission-plan.US3-TC7: The reference out of reach holds nothing up, by hand or pasted

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-03

**Pre-conditions:**

* A collector is on `<wizard>`'s Cards step, an email given; the card price reference cannot be reached.

**Test data:**

| `<added>` |
| --- |
| Homebrew Test Card typed, then Add this card |
| two lines pasted: Charizard 1st Edition, Base Set, 4/102, 3500 and Umbreon VMAX (Alternate Art), Evolving Skies, 188/203, 8500 |

**Steps:**

1. Add `<added>`, give any value asked, and read the cards and Continue.

**Expected Results:**

* Each card is marked unasked rather than kept as typed, its declared value still asked for; nothing waits on the reference, and Continue is enabled.

<!-- trace:case id=g10.grading-submission-plan.TC-y5f rev=1 covers=g10.grading-submission-plan.SC-r4q,g10.grading-submission-plan.SC-0wj,g10.grading-submission-plan.SC-fik,g10.grading-submission-plan.SC-j6g,g10.grading-submission-plan.SC-40a,g10.grading-submission-plan.SC-34a,g10.grading-submission-plan.SC-oiv,g10.grading-submission-plan.SC-ful -->
### g10.grading-submission-plan.US3-TC4: A pasted line above every level's ceiling goes to the counter

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-03

**Pre-conditions:**

* A collector has the paste sheet open.

**Steps:**

1. Paste Umbreon VMAX (Alternate Art), Evolving Skies, 188/203, 42000.

**Expected Results:**

* The line reports above the ceiling, telling the collector to ask at the counter or on WhatsApp, HKD 42,000.00 being above the top HKD 39,000.00; no second submission is named.

<!-- trace:case id=g10.grading-submission-plan.TC-6s3 rev=1 covers=g10.grading-submission-plan.SC-r4q,g10.grading-submission-plan.SC-0wj,g10.grading-submission-plan.SC-fik,g10.grading-submission-plan.SC-j6g,g10.grading-submission-plan.SC-40a,g10.grading-submission-plan.SC-34a,g10.grading-submission-plan.SC-oiv,g10.grading-submission-plan.SC-ful -->
### g10.grading-submission-plan.US3-TC6: An empty paste adds nothing

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-03

**Pre-conditions:**

* A collector has the paste sheet open, Your list empty.

**Steps:**

1. Read the sheet.

**Expected Results:**

* No outcome row shows, and Add stays disabled.

---

## g10.grading-submission-plan.US4: Dealer submits a box of cards at Bulk

**As a** collector dealing in cards, more than twenty at a time,
**I want** the paste to tell me Bulk is the only level open, what it costs a card and that it takes the longer drop-off, and a card above Bulk's ceiling to be named for a second submission on the same drop-off,
**so that** the whole box goes in on one visit at the right level.

<!-- trace:case id=g10.grading-submission-plan.TC-3pr rev=1 covers=g10.grading-submission-plan.SC-22f,g10.grading-submission-plan.SC-g1c,g10.grading-submission-plan.SC-rjw,g10.grading-submission-plan.SC-8gr,g10.grading-submission-plan.SC-diu,g10.grading-submission-plan.SC-46m -->
### g10.grading-submission-plan.US4-TC1: A paste over twenty lines names Bulk and its longer visit

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-04

**Pre-conditions:**

* A collector has the paste sheet open, an email given.

**Steps:**

1. Paste 25 lines, Homebrew Card 01, 1000 to Homebrew Card 25, 1000, and read the Bulk notice.

**Expected Results:**

* It says Bulk is the only level open at the next step, at HKD 180.00 a card, cards up to HKD 1,500.00, about 10 weeks back, up to 100 cards, and names the longer drop-off.

<!-- trace:case id=g10.grading-submission-plan.TC-6co rev=1 covers=g10.grading-submission-plan.SC-22f,g10.grading-submission-plan.SC-g1c,g10.grading-submission-plan.SC-rjw,g10.grading-submission-plan.SC-8gr,g10.grading-submission-plan.SC-diu,g10.grading-submission-plan.SC-46m -->
### g10.grading-submission-plan.US4-TC2: Twenty cards leave every level open

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-04

**Pre-conditions:**

* A collector has the paste sheet open, an email given.

**Steps:**

1. Paste 20 lines, Homebrew Card 01, 1000 to Homebrew Card 20, 1000, add them, and continue to Service.

**Expected Results:**

* Value, Regular, Express, Super Express and Bulk are all open, each naming its ceiling and fee.

<!-- trace:case id=g10.grading-submission-plan.TC-41m rev=1 covers=g10.grading-submission-plan.SC-22f,g10.grading-submission-plan.SC-g1c,g10.grading-submission-plan.SC-rjw,g10.grading-submission-plan.SC-8gr,g10.grading-submission-plan.SC-diu,g10.grading-submission-plan.SC-46m -->
### g10.grading-submission-plan.US4-TC3: The twenty-first card leaves Bulk the only level open

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-04

**Pre-conditions:**

* A collector has the paste sheet open, an email given.

**Steps:**

1. Paste 21 lines, Homebrew Card 01, 1000 to Homebrew Card 21, 1000, add them, and continue to Service.

**Expected Results:**

* Value, Regular, Express and Super Express are closed, naming the count; Bulk is open.

<!-- trace:case id=g10.grading-submission-plan.TC-3nj rev=1 covers=g10.grading-submission-plan.SC-22f,g10.grading-submission-plan.SC-g1c,g10.grading-submission-plan.SC-rjw,g10.grading-submission-plan.SC-8gr,g10.grading-submission-plan.SC-diu,g10.grading-submission-plan.SC-46m -->
### g10.grading-submission-plan.US4-TC4: A card above Bulk's ceiling is named for a second submission, not refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-04

**Pre-conditions:**

* A collector has the paste sheet open.

**Steps:**

1. Paste 21 lines at 1000 and Homebrew Grail, 2000, and read its row.
2. Click Add 22 cards, and read its row in Your list.

**Expected Results:**

* Both name it at HKD 2,000.00, going in a second submission on the same drop-off; the other cards stay at Bulk.

<!-- trace:case id=g10.grading-submission-plan.TC-00e rev=1 covers=g10.grading-submission-plan.SC-22f,g10.grading-submission-plan.SC-g1c,g10.grading-submission-plan.SC-rjw,g10.grading-submission-plan.SC-8gr,g10.grading-submission-plan.SC-diu,g10.grading-submission-plan.SC-46m -->
### g10.grading-submission-plan.US4-TC6: The hundredth card is added at Bulk's cap

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-04

**Pre-conditions:**

* A collector has 99 cards listed at 1000 each, Bulk the only open level.

**Steps:**

1. Paste Homebrew Card 100, 1000, and add it.

**Expected Results:**

* It is added at Bulk; nothing is said about a second submission.

<!-- trace:case id=g10.grading-submission-plan.TC-wt4 rev=1 covers=g10.grading-submission-plan.SC-22f,g10.grading-submission-plan.SC-g1c,g10.grading-submission-plan.SC-rjw,g10.grading-submission-plan.SC-8gr,g10.grading-submission-plan.SC-diu,g10.grading-submission-plan.SC-46m -->
### g10.grading-submission-plan.US4-TC5: The card past Bulk's cap is refused, and the list keeps its hundred

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-04

**Pre-conditions:**

* A collector has 100 cards listed at 1000 each, Bulk the only open level.

**Steps:**

1. Paste Homebrew Card 101, 1000, and add it.

**Expected Results:**

* It is refused, saying the rest go in a second submission on another day; the list still holds 100.

---

## g10.grading-submission-plan.US5: Collector sees why a level is closed

**As a** collector picking the grader and the level,
**I want** a closed level to name the card declared above its ceiling, or the count that closes it, and an open one to read its ceiling, fee, cover line and return date,
**so that** I can change a declared value or split the list instead of wondering why a level is grey.

<!-- trace:case id=g10.grading-submission-plan.TC-3x7 rev=1 covers=g10.grading-submission-plan.SC-6qn,g10.grading-submission-plan.SC-a3o,g10.grading-submission-plan.SC-9yc,g10.grading-submission-plan.SC-wfm,g10.grading-submission-plan.SC-bzg,g10.grading-submission-plan.SC-xoj,g10.grading-submission-plan.SC-qbf,g10.grading-submission-plan.SC-vy8,g10.grading-submission-plan.SC-w4u,g10.grading-submission-plan.SC-w6e -->
### g10.grading-submission-plan.US5-TC1: Each level reads why it is open or closed

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-05

**Pre-conditions:**

* A collector is on Service with four cards: Homebrew Umbreon at HKD 8,500.00, Homebrew Pikachu at HKD 1,000.00, Homebrew Eevee at HKD 800.00 and Homebrew Mew at HKD 500.00.

**Steps:**

1. Click PSA, and read every level.

**Expected Results:**

* Value is closed, naming the HKD 8,500.00 card above its HKD 3,900.00 ceiling.
* Regular is open, reading its HKD 11,700.00 ceiling, HKD 600.00 a card and about 5 weeks; Express adds its cover at 1.5% of the declared value.
* Bulk is closed, naming that it starts at 20 cards and the list holds 4.

<!-- trace:case id=g10.grading-submission-plan.TC-8mg rev=1 covers=g10.grading-submission-plan.SC-6qn,g10.grading-submission-plan.SC-a3o,g10.grading-submission-plan.SC-9yc,g10.grading-submission-plan.SC-wfm,g10.grading-submission-plan.SC-bzg,g10.grading-submission-plan.SC-xoj,g10.grading-submission-plan.SC-qbf,g10.grading-submission-plan.SC-vy8,g10.grading-submission-plan.SC-w4u,g10.grading-submission-plan.SC-w6e -->
### g10.grading-submission-plan.US5-TC4: A card above every ceiling closes every level and sends the collector to the counter

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-05

**Pre-conditions:**

* A collector is on Service with Homebrew Grail declared HKD 42,000.00.

**Steps:**

1. Click PSA, and read the levels and Continue.

**Expected Results:**

* Every level is closed; the step names asking at the counter or on WhatsApp, and Continue is disabled.

<!-- trace:case id=g10.grading-submission-plan.TC-iej rev=1 covers=g10.grading-submission-plan.SC-6qn,g10.grading-submission-plan.SC-a3o,g10.grading-submission-plan.SC-9yc,g10.grading-submission-plan.SC-wfm,g10.grading-submission-plan.SC-bzg,g10.grading-submission-plan.SC-xoj,g10.grading-submission-plan.SC-qbf,g10.grading-submission-plan.SC-vy8,g10.grading-submission-plan.SC-w4u,g10.grading-submission-plan.SC-w6e -->
### g10.grading-submission-plan.US5-TC6: A grader nobody has priced shows its levels, none pickable

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-05

**Pre-conditions:**

* A collector is on Service with cards listed; CGC carries no figures.

**Steps:**

1. Click CGC, and read its levels.

**Expected Results:**

* They are listed, marked as carrying no figures, and none can be picked.

<!-- trace:case id=g10.grading-submission-plan.TC-gi9 rev=1 covers=g10.grading-submission-plan.SC-6qn,g10.grading-submission-plan.SC-a3o,g10.grading-submission-plan.SC-9yc,g10.grading-submission-plan.SC-wfm,g10.grading-submission-plan.SC-bzg,g10.grading-submission-plan.SC-xoj,g10.grading-submission-plan.SC-qbf,g10.grading-submission-plan.SC-vy8,g10.grading-submission-plan.SC-w4u,g10.grading-submission-plan.SC-w6e -->
### g10.grading-submission-plan.US5-TC5: No level picked shows no estimate and holds the step

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-05

**Pre-conditions:**

* A collector is on Service, PSA picked and no level.

**Steps:**

1. Read the step and Continue.

**Expected Results:**

* No estimate shows, and Continue is disabled.

<!-- trace:case id=g10.grading-submission-plan.TC-qwl rev=1 covers=g10.grading-submission-plan.SC-6qn,g10.grading-submission-plan.SC-a3o,g10.grading-submission-plan.SC-9yc,g10.grading-submission-plan.SC-wfm,g10.grading-submission-plan.SC-bzg,g10.grading-submission-plan.SC-xoj,g10.grading-submission-plan.SC-qbf,g10.grading-submission-plan.SC-vy8,g10.grading-submission-plan.SC-w4u,g10.grading-submission-plan.SC-w6e -->
### g10.grading-submission-plan.US5-TC7: Four cards at Regular estimate at four times the fee, all on PSA Regular

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-05

**Pre-conditions:**

* A collector is on Service with four cards, none above HKD 11,700.00.

**Steps:**

1. Click PSA, pick Regular, and read Your estimate.
2. Continue to Book, and read the header and the schedule.

**Expected Results:**

* Step 1 reads HKD 2,400.00, four times HKD 600.00, with no cover line, about 5 weeks counted from the day the batch leaves, all paid at the counter.
* Step 2 reads all four cards as PSA Regular, none on another grader or level.

<!-- trace:case id=g10.grading-submission-plan.TC-31a rev=1 covers=g10.grading-submission-plan.SC-6qn,g10.grading-submission-plan.SC-a3o,g10.grading-submission-plan.SC-9yc,g10.grading-submission-plan.SC-wfm,g10.grading-submission-plan.SC-bzg,g10.grading-submission-plan.SC-xoj,g10.grading-submission-plan.SC-qbf,g10.grading-submission-plan.SC-vy8,g10.grading-submission-plan.SC-w4u,g10.grading-submission-plan.SC-w6e -->
### g10.grading-submission-plan.US5-TC9: A covered level prices cover per card on the declared value

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-05

**Pre-conditions:**

* A collector is on Service with one card declared HKD 8,500.00.

**Steps:**

1. Click PSA, pick Express, and read Your estimate.

**Expected Results:**

* The card's cover reads HKD 127.50, and the total HKD 1,327.50, the fee and the cover added.

---

## g10.grading-submission-plan.US6: Collector finds the plan again from the emailed link or the signed-in home

**As a** collector who leaves the wizard before booking,
**I want** the plan kept under the email I gave and its link mailed to me once by the next daily sweep while it stays unbooked, opening on any device with no account, and the home page to list every submission under that email once I sign in with it and no password,
**so that** I can finish on another day, and find every old submission, without a password or a second list.

<!-- trace:case id=g10.grading-submission-plan.TC-26o rev=1 covers=g10.grading-submission-plan.SC-90m,g10.grading-submission-plan.SC-p75,g10.grading-submission-plan.SC-hpb,g10.grading-submission-plan.SC-rsr,g10.grading-submission-plan.SC-vqr,g10.grading-submission-plan.SC-3d2,g10.grading-submission-plan.SC-hk7,g10.grading-submission-plan.SC-ad7,g10.grading-submission-plan.SC-r30,g10.grading-submission-plan.SC-xnp -->
### g10.grading-submission-plan.US6-TC1: Finishing later asks for an email, keeps the plan, and the sweep mails its link once

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-06

**Pre-conditions:**

* A signed-out collector is on `<wizard>`'s Cards step, one card valued, the email blank.

**Steps:**

1. Click Finish later.
2. Enter `<collector email>`, a mailbox only this run uses, click Finish later, and leave the page.
3. Let the daily sweep run, and read `<collector email>`.

**Expected Results:**

* Step 1 keeps nothing, asking for the email.
* Step 2 keeps the plan under it, sending nothing on leaving.
* Step 3 holds one email carrying the plan's link.

<!-- trace:case id=g10.grading-submission-plan.TC-k1k rev=1 covers=g10.grading-submission-plan.SC-90m,g10.grading-submission-plan.SC-p75,g10.grading-submission-plan.SC-hpb,g10.grading-submission-plan.SC-rsr,g10.grading-submission-plan.SC-vqr,g10.grading-submission-plan.SC-3d2,g10.grading-submission-plan.SC-hk7,g10.grading-submission-plan.SC-ad7,g10.grading-submission-plan.SC-r30,g10.grading-submission-plan.SC-xnp -->
### g10.grading-submission-plan.US6-TC3: The emailed link reopens the plan on a device that never signed in

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-06

**Pre-conditions:**

* A collector kept a plan with Save and book later, and holds its emailed link.

**Steps:**

1. Open the link in a private window.

**Expected Results:**

* The plan opens with its cards, grader, level and estimate, the day it is kept until, and booking the drop-off offered; no sign-in or account is asked for.

<!-- trace:case id=g10.grading-submission-plan.TC-am9 rev=1 covers=g10.grading-submission-plan.SC-90m,g10.grading-submission-plan.SC-p75,g10.grading-submission-plan.SC-hpb,g10.grading-submission-plan.SC-rsr,g10.grading-submission-plan.SC-vqr,g10.grading-submission-plan.SC-3d2,g10.grading-submission-plan.SC-hk7,g10.grading-submission-plan.SC-ad7,g10.grading-submission-plan.SC-r30,g10.grading-submission-plan.SC-xnp -->
### g10.grading-submission-plan.US6-TC4: Signing in with no password lists every submission under the email

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-06

**Pre-conditions:**

* Under `<collector email>`, a signed-out collector has a kept plan and a collected submission.

**Steps:**

1. On `<grading home>`, click Sign in, enter `<collector email>`, and open the link mailed to it.
2. Read Your submissions, and click each.

**Expected Results:**

* No password is asked for; both are listed, open and closed, each with its summary, status word and chip, each opening its own page.

<!-- trace:case id=g10.grading-submission-plan.TC-bxv rev=1 covers=g10.grading-submission-plan.SC-90m,g10.grading-submission-plan.SC-p75,g10.grading-submission-plan.SC-hpb,g10.grading-submission-plan.SC-rsr,g10.grading-submission-plan.SC-vqr,g10.grading-submission-plan.SC-3d2,g10.grading-submission-plan.SC-hk7,g10.grading-submission-plan.SC-ad7,g10.grading-submission-plan.SC-r30,g10.grading-submission-plan.SC-xnp -->
### g10.grading-submission-plan.US6-TC5: A signed-in collector who has planned nothing is told so

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-06

**Pre-conditions:**

* A signed-in collector holds no submission under their email.

**Steps:**

1. Read Your submissions on `<grading home>`.

**Expected Results:**

* It says they have none, offering Start a submission.

<!-- trace:case id=g10.grading-submission-plan.TC-8q8 rev=1 covers=g10.grading-submission-plan.SC-90m,g10.grading-submission-plan.SC-p75,g10.grading-submission-plan.SC-hpb,g10.grading-submission-plan.SC-rsr,g10.grading-submission-plan.SC-vqr,g10.grading-submission-plan.SC-3d2,g10.grading-submission-plan.SC-hk7,g10.grading-submission-plan.SC-ad7,g10.grading-submission-plan.SC-r30,g10.grading-submission-plan.SC-xnp -->
### g10.grading-submission-plan.US6-TC6: A home that cannot read the submissions says so

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-06

**Pre-conditions:**

* A signed-in collector's submissions cannot be read.

**Steps:**

1. Read Your submissions on `<grading home>`.

**Expected Results:**

* The failure shows in the page's error tone, and no submission is listed.

<!-- trace:case id=g10.grading-submission-plan.TC-01a rev=1 covers=g10.grading-submission-plan.SC-90m,g10.grading-submission-plan.SC-p75,g10.grading-submission-plan.SC-hpb,g10.grading-submission-plan.SC-rsr,g10.grading-submission-plan.SC-vqr,g10.grading-submission-plan.SC-3d2,g10.grading-submission-plan.SC-hk7,g10.grading-submission-plan.SC-ad7,g10.grading-submission-plan.SC-r30,g10.grading-submission-plan.SC-xnp -->
### g10.grading-submission-plan.US6-TC7: A fee changed on the sheet reaches a plan, and leaves a booked submission alone

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
* **Trace:** Priced at booking

**Pre-conditions:**

* A collector holds `<held>` at PSA Regular, made while Regular was HKD 600.00 a card, and its emailed link.

**Test data:**

| `<held>` | `<reads>` |
| --- | --- |
| a submission with its drop-off booked | HKD 600.00 a card, its estimate and totals unchanged |
| a plan with no drop-off booked | HKD 700.00 a card |

**Steps:**

1. As one approver, change PSA Regular to HKD 700.00 a card with a reason; as a second, approve it.
2. Open the link, and read the fee and the estimate.

**Expected Results:**

* It reads `<reads>`.

<!-- trace:case id=g10.grading-submission-plan.TC-ycj rev=1 covers=g10.grading-submission-plan.SC-90m,g10.grading-submission-plan.SC-p75,g10.grading-submission-plan.SC-hpb,g10.grading-submission-plan.SC-rsr,g10.grading-submission-plan.SC-vqr,g10.grading-submission-plan.SC-3d2,g10.grading-submission-plan.SC-hk7,g10.grading-submission-plan.SC-ad7,g10.grading-submission-plan.SC-r30,g10.grading-submission-plan.SC-xnp -->
### g10.grading-submission-plan.US6-TC9: A plan kept unticked asks for the statement before its drop-off

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-06

**Pre-conditions:**

* A collector holds the emailed link of a plan saved for later with the collection statement unticked, no drop-off held under the email.

**Steps:**

1. Open the link.
2. Send a booking for the plan carrying no tick, outside its page.
3. Tick the statement, and book a free day and time.

**Expected Results:**

* Step 1 asks for the statement in the review's words, offering no day.
* Step 2 is refused by name; the plan holds no drop-off.
* Step 3 offers the days and books the drop-off, the plan holding the tick on reload.

<!-- trace:case id=g10.grading-submission-plan.TC-njb rev=1 covers=g10.grading-submission-plan.SC-90m,g10.grading-submission-plan.SC-p75,g10.grading-submission-plan.SC-hpb,g10.grading-submission-plan.SC-rsr,g10.grading-submission-plan.SC-vqr,g10.grading-submission-plan.SC-3d2,g10.grading-submission-plan.SC-hk7,g10.grading-submission-plan.SC-ad7,g10.grading-submission-plan.SC-r30,g10.grading-submission-plan.SC-xnp -->
### g10.grading-submission-plan.US6-TC10: A plan kept with no level asks for one before its drop-off

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-06

**Pre-conditions:**

* A collector holds the emailed link of a plan kept from Service with PSA and no level, unticked; a drop-off is booked under the same email for another submission.

**Steps:**

1. Open the link.
2. Send a booking, and a join of the other drop-off, for the plan outside its page.
3. Click the list's edit link, pick Regular, and save from the review.

**Expected Results:**

* Step 1 asks for a level beside the edit link, offering no day and no join.
* Step 2 refuses both by name; the diary holds no new visit, and the other drop-off is unchanged.
* Step 3 shows the estimate for Regular, then asks for the statement in the review's words, still offering no day.

---

## g10.grading-submission-plan.US7: Collector reads the review before booking

**As a** collector about to book the drop-off,
**I want** the review to total the declared value, the fee and the cover line, to name each card that could grade above the level's ceiling with the level the grader would move it to, the sheet's difference due at the counter and what the higher level would cost now, and to say that a fee is charged on a card returned ungraded, that a card can move up a level, that the return date is an estimate, that nothing is paid or signed before the cards are checked with me, and that slabs are not shipped back,
**so that** I choose the level knowing both prices and agree to the terms the agreement will later print rather than meet them on the iPad.

<!-- trace:case id=g10.grading-submission-plan.TC-68a rev=1 covers=g10.grading-submission-plan.SC-h3s,g10.grading-submission-plan.SC-6u8,g10.grading-submission-plan.SC-21y,g10.grading-submission-plan.SC-hym,g10.grading-submission-plan.SC-8zk,g10.grading-submission-plan.SC-i18,g10.grading-submission-plan.SC-93c,g10.grading-submission-plan.SC-s0l -->
### g10.grading-submission-plan.US7-TC10: The review totals the declared value, the fee and the cover, and reads the five good-to-know lines

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-07

**Pre-conditions:**

* A collector is on Book with Homebrew Umbreon at HKD 8,500.00 and Homebrew Charizard at HKD 4,000.00, at PSA Express, an email given.

**Steps:**

1. Read the schedule, the totals and Good to know.

**Expected Results:**

* The schedule carries cover of HKD 127.50 on Umbreon and HKD 60.00 on Charizard.
* The totals read HKD 12,500.00 declared, HKD 2,400.00 in fees and HKD 187.50 in cover.
* Good to know reads, in order: a fee on a card returned ungraded, a card can move up a level, the return date is an estimate, nothing paid or signed before the cards are checked, and slabs not shipped back.

<!-- trace:case id=g10.grading-submission-plan.TC-ztl rev=1 covers=g10.grading-submission-plan.SC-h3s,g10.grading-submission-plan.SC-6u8,g10.grading-submission-plan.SC-21y,g10.grading-submission-plan.SC-hym,g10.grading-submission-plan.SC-8zk,g10.grading-submission-plan.SC-i18,g10.grading-submission-plan.SC-93c,g10.grading-submission-plan.SC-s0l -->
### g10.grading-submission-plan.US7-TC2: A card whose PSA 10 sale tops the level's ceiling is warned about, with both prices

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
* **Trace:** grade10-site-grading-submission-plan-US-07

**Pre-conditions:**

* A collector is on Book at PSA Regular; Umbreon VMAX (Alternate Art), matched and declared HKD 8,500.00, has a PSA 10 reference sale of `<sale>`; the reference rate reads 7.84 HKD to 1 USD.

**Test data:**

| `<sale>` | `<sale reads>` |
| --- | --- |
| HKD 15,000.00 | HKD 15,000.00 |
| USD 1,500.00 | HKD 11,760.00 |

**Steps:**

1. Read the upcharge warning.

**Expected Results:**

* The sale reads `<sale reads>`, above Regular's HKD 11,700.00; Umbreon is named with Express as the level the grader would move it to, HKD 600.00 due at the counter as the difference, and Express's HKD 1,200.00 a card beside it.

<!-- trace:case id=g10.grading-submission-plan.TC-jn5 rev=1 covers=g10.grading-submission-plan.SC-h3s,g10.grading-submission-plan.SC-6u8,g10.grading-submission-plan.SC-21y,g10.grading-submission-plan.SC-hym,g10.grading-submission-plan.SC-8zk,g10.grading-submission-plan.SC-i18,g10.grading-submission-plan.SC-93c,g10.grading-submission-plan.SC-s0l -->
### g10.grading-submission-plan.US7-TC3: No card's PSA 10 sale above the ceiling, no warning

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-07

**Pre-conditions:**

* A collector is on Book at PSA Regular, every card's PSA 10 reference within HKD 11,700.00.

**Steps:**

1. Read the review.

**Expected Results:**

* No upcharge warning shows.

<!-- trace:case id=g10.grading-submission-plan.TC-ipn rev=1 covers=g10.grading-submission-plan.SC-h3s,g10.grading-submission-plan.SC-6u8,g10.grading-submission-plan.SC-21y,g10.grading-submission-plan.SC-hym,g10.grading-submission-plan.SC-8zk,g10.grading-submission-plan.SC-i18,g10.grading-submission-plan.SC-93c,g10.grading-submission-plan.SC-s0l -->
### g10.grading-submission-plan.US7-TC4: Booking is refused until the statement is ticked

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-07

**Pre-conditions:**

* A collector is on Book, the collection statement unticked.

**Steps:**

1. Read Book the drop-off; tick the statement and read it again.

**Expected Results:**

* It is disabled while unticked, and enabled once ticked.

<!-- trace:case id=g10.grading-submission-plan.TC-18q rev=1 covers=g10.grading-submission-plan.SC-h3s,g10.grading-submission-plan.SC-6u8,g10.grading-submission-plan.SC-21y,g10.grading-submission-plan.SC-hym,g10.grading-submission-plan.SC-8zk,g10.grading-submission-plan.SC-i18,g10.grading-submission-plan.SC-93c,g10.grading-submission-plan.SC-s0l -->
### g10.grading-submission-plan.US7-TC7: Saving the plan for later needs no tick

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-07

**Pre-conditions:**

* A collector is on Book, an email given, the statement unticked.

**Steps:**

1. Click Save and book later.

**Expected Results:**

* The plan is kept, its page opening at Planned with the statement still unticked; booking was the only act refused.

<!-- trace:case id=g10.grading-submission-plan.TC-65d rev=1 covers=g10.grading-submission-plan.SC-h3s,g10.grading-submission-plan.SC-6u8,g10.grading-submission-plan.SC-21y,g10.grading-submission-plan.SC-hym,g10.grading-submission-plan.SC-8zk,g10.grading-submission-plan.SC-i18,g10.grading-submission-plan.SC-93c,g10.grading-submission-plan.SC-s0l -->
### g10.grading-submission-plan.US7-TC9: A plan booked from a ticked review opens on the picker with nothing asked

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-07

**Pre-conditions:**

* A collector is on Book, an email given and a level picked, no drop-off held under the email.

**Steps:**

1. Tick the statement, click Book the drop-off, and reload the page that opens.

**Expected Results:**

* The page opens on the drop-off picker, asking no statement, before and after the reload.

---

## g10.grading-submission-plan.US8: Collector who never books is nudged and then let go

**As a** collector who planned a submission and booked no drop-off,
**I want** one reminder with the link and then a short email saying the list has expired with nothing paid and nothing owed,
**so that** I am prompted once and not left with an old list at stale prices.

<!-- trace:case id=g10.grading-submission-plan.TC-8pw rev=1 covers=g10.grading-submission-plan.SC-e27,g10.grading-submission-plan.SC-vzu,g10.grading-submission-plan.SC-tuf,g10.grading-submission-plan.SC-5af,g10.grading-submission-plan.SC-l55 -->
### g10.grading-submission-plan.US8-TC1: An unbooked plan is nudged once at twenty-one days and expires at thirty owing nothing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-08

**Pre-conditions:**

* A collector holds the link of a plan kept 21 days ago, no drop-off booked.

**Steps:**

1. Let the sweep run after 09:00 on the shop's clock, twice, and read the plan's email.
2. Open the plan from its link.
3. Move to 30 days after it was kept, let the sweep run, and read the email and the page.

**Expected Results:**

* Step 1 sends one nudge with the plan's link, the second pass none.
* Step 2 reads the day it is kept until, 30 days from its keeping.
* Step 3 sends an email saying the list expired with nothing paid and nothing owed; the page reads Expired, says the same, and offers Start a submission.

<!-- trace:case id=g10.grading-submission-plan.TC-ro2 rev=1 covers=g10.grading-submission-plan.SC-e27,g10.grading-submission-plan.SC-vzu,g10.grading-submission-plan.SC-tuf,g10.grading-submission-plan.SC-5af,g10.grading-submission-plan.SC-l55 -->
### g10.grading-submission-plan.US8-TC4: A plan with a drop-off booked does not expire

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-08

**Pre-conditions:**

* A plan kept 30 days ago has a drop-off booked.

**Steps:**

1. Let the sweep run; open the plan, and read its email.

**Expected Results:**

* It still reads Drop-off booked; no nudge and no expiry email is sent.

<!-- trace:case id=g10.grading-submission-plan.TC-guj rev=1 covers=g10.grading-submission-plan.SC-e27,g10.grading-submission-plan.SC-vzu,g10.grading-submission-plan.SC-tuf,g10.grading-submission-plan.SC-5af,g10.grading-submission-plan.SC-l55 -->
### g10.grading-submission-plan.US8-TC3: Booking a plan that expired meanwhile is refused by name

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-08

**Pre-conditions:**

* A collector left Book open on a plan that has since passed 30 days unbooked.

**Steps:**

1. Tick the statement, and click Book the drop-off.

**Expected Results:**

* It is refused, saying the plan has expired, and offers starting a submission again.

<!-- trace:case id=g10.grading-submission-plan.TC-ky4 rev=1 covers=g10.grading-submission-plan.SC-e27,g10.grading-submission-plan.SC-vzu,g10.grading-submission-plan.SC-tuf,g10.grading-submission-plan.SC-5af,g10.grading-submission-plan.SC-l55 -->
### g10.grading-submission-plan.US8-TC5: A cancelled visit restarts the plan's clock and its nudge

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-plan-US-08

**Pre-conditions:**

* A plan kept on 1 March was nudged on 22 March, then booked on 25 March and its visit cancelled.

**Steps:**

1. Read its emails through 24 April, and the plan's page.

**Expected Results:**

* It is nudged again on 15 April and expires on 24 April, not on 31 March.

## Reconciliation

### Manual

| Manual | Why |
| --- | --- |
| `g10.grading-submission-plan.US6-TC1` | the mail is read in an inbox; a script drives the plan being kept and no further |
| `g10.grading-submission-plan.US8-TC1` | the day is moved, and the nudge and the expired page are read |
| `g10.grading-submission-plan.US6-TC7` | a console settings write sits between the two reads |
| `g10.grading-submission-plan.US2-TC1` | a judgement of the words beside the card, not an assertion |
