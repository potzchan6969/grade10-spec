# grade10-site/grading/submission-lifecycle Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-22, tcs-rules r3.0
**Out of suite:** grade10-site-grading-submission-lifecycle-SC-01 - the moves are made from the counter, and `grade10-admin/grading/counter`'s suite walks a move asked of a submission that has already moved

## grade10-site-grading-submission-lifecycle-US1: Collector follows the submission from planned to home on one page

**As a** collector with cards in the shop's hands,
**I want** the page to read one status in my words, a chip saying whose move it is, a rail from Planned to Home, and while the cards are away the grader's stages in its own words, the estimate, and Running late with the new date once it is set,
**so that** I never have to ask the shop where my cards are, and waiting on the grader never reads as waiting on the shop.

### grade10-site-grading-submission-lifecycle-US1-TC1-1: Status word, move chip and rail step agree at every status

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-01

**Pre-conditions:**

* The collector is on <grade10 grading submission page url> for a submission at the status in the row.

**Test data:**

| Status | Word | Chip | Rail step |
| --- | --- | --- | --- |
| Planned | Not handed in yet | Waiting on you | Planned, progress |
| Booked | Drop-off booked | Drop-off on its day | Booked, progress |
| Handed in | Handed in | With us | Handed in, progress |
| Sent | With the grader | With PSA | Sent, progress |
| Graded | Grades are in | On their way back | Graded, progress |
| Back | Back at the shop, being checked | With us | Back, progress |
| Ready | Ready to collect | Waiting on you | Back, progress |
| Collected | Back with you | Collected | Home, progress |

**Steps:**

1. Load the submission page.

**Expected Results:**

* The status word, the chip and the rail step in the row all show together.
* Every rail step before the row's step reads completed, and every step after reads upcoming.

### grade10-site-grading-submission-lifecycle-US1-TC2-1: The grader's stages reach the page in its own words

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-01

**Pre-conditions:**

* The collector is on <grade10 grading submission page url> for a submission at Sent with PSA, and the grader's order has published a stage beyond the first.

**Steps:**

1. Load the submission page.

**Expected Results:**

* The grader's stages read in the grader's own words, with the stage it published most recently marked as the next stage.
* Nothing to do shows beside the stages.

### grade10-site-grading-submission-lifecycle-US1-TC3-1: The estimate reads against the clock rather than a fixed date

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-01

**Pre-conditions:**

* The collector is on <grade10 grading submission page url> for a submission at Sent, inside the grader's quoted turnaround counted from the ship day.

**Steps:**

1. Load the submission page.

**Expected Results:**

* The estimate reads as time remaining against the current clock, not as a date fixed at booking.

### grade10-site-grading-submission-lifecycle-US1-TC4-1: Running late shows once the estimate passes, with the new date once set

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-01

**Pre-conditions:**

* The collector is on <grade10 grading submission page url> for a submission at Sent, past the grader's quoted turnaround.

**Steps:**

1. Load the submission page before staff re-estimate the batch.
2. Reload the page after staff set a new date on the batch.

**Expected Results:**

* Step 1 shows the chip reading Running late with the grader named, and no new date yet.
* Step 2 shows the same chip with the new date.

### grade10-site-grading-submission-lifecycle-US1-TC5-1: A submission id that does not exist shows the not-found page

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-01

**Pre-conditions:**

* None.

**Steps:**

1. Navigate to <grade10 grading submission page url> with a submission id that does not exist.

**Expected Results:**

* The site's not-found page shows, naming nothing about the mistyped submission.

### grade10-site-grading-submission-lifecycle-US1-TC6-1: A failed load shows an error the collector can retry

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-01

**Pre-conditions:**

* The submission record request is stubbed to fail.

**Steps:**

1. Load the submission page.

**Expected Results:**

* The failure shows in the error tone, with no status, chip or rail rendered.
* The page reads again once the request is retried.

### grade10-site-grading-submission-lifecycle-US1-TC7-1: A reader who is neither the collector nor the link reads not found

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-01

**Pre-conditions:**

* A submission exists at Handed in, booked under another collector's email.

**Steps:**

1. Open <grade10 grading submission page url> for that submission, signed out and without the emailed link's token.
2. Open the same address signed in as a different collector.

**Expected Results:**

* Both steps show the site's not-found page.
* Nothing on the page says whether that submission exists, and no card, name or pickup code shows.

### grade10-site-grading-submission-lifecycle-US1-TC8-1: A plan kept signed out lands on its own page with no account

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-01

**Pre-conditions:**

* The collector is signed out, on <grade10 grading url>'s wizard at the review with an email given and a level picked.

**Test data:**

| Kept by | Review |
| --- | --- |
| Book the drop-off | the statement ticked |
| Save and book later | the statement unticked |

**Steps:**

1. Keep the plan as in the row.
2. Open the plan's link from the email it sent, in a second browser that has never signed in.

**Expected Results:**

* Step 1: the plan's submission page opens, with no sign-in asked for and no not-found page.
* Step 2: the same submission page opens.

---

## grade10-site-grading-submission-lifecycle-US2: Collector asks for a card back before the batch closes

**As a** collector who changed my mind after hand-in,
**I want** to message the shop before Thursday 19:00 and collect the card at the counter against a receipt, with its fee back at the till the way I paid and the page saying what came back and why,
**so that** a card I want to keep does not leave with the batch.

### grade10-site-grading-submission-lifecycle-US2-TC1-1: A card withdrawn before the batch closes shows collected with its fee refunded

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-02

**Pre-conditions:**

* The collector is on <grade10 grading submission page url> for a submission at Handed in, before Thursday 19:00, with one card withdrawn against a counter receipt.

**Steps:**

1. Load the submission page.

**Expected Results:**

* The withdrawn card shows the Withdrawn badge.
* The card's line shows its fee refunded the way it was paid.

### grade10-site-grading-submission-lifecycle-US2-TC2-1: Withdrawing a card is not offered once the batch has closed

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-02

**Pre-conditions:**

* The collector is on <grade10 grading submission page url> for a submission at Sent, after Thursday 19:00.

**Steps:**

1. Load the submission page.

**Expected Results:**

* No withdraw act shows on any card.

### grade10-site-grading-submission-lifecycle-US2-TC3-1: Withdrawing one card leaves the rest of the submission unaffected

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-02

**Pre-conditions:**

* The collector is on <grade10 grading submission page url> for a submission of four cards at Handed in, before Thursday 19:00, with one card withdrawn.

**Steps:**

1. Load the submission page.

**Expected Results:**

* The withdrawn card shows the Withdrawn badge with its refund line.
* The other three cards still show Handed in, with no change to their lines.

### grade10-site-grading-submission-lifecycle-US2-TC4-1: Withdrawing the last card cancels the submission

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-02

**Pre-conditions:**

* The collector is on <grade10 grading submission page url> for a submission of two cards at Handed in, before Thursday 19:00, with one card already withdrawn.

**Steps:**

1. Load the submission page after the second card is withdrawn and collected at the counter.

**Expected Results:**

* Both cards show the Withdrawn badge with their refund lines.
* The submission reads Cancelled, with the rail ended where it stood.
* The collector is told the submission is cancelled.

---

## grade10-site-grading-submission-lifecycle-US3: Collector learns why a card came back ungraded

**As a** collector whose card came back raw,
**I want** the grader's code and note on the card, a plain line saying the fee stands, and that the grade is the grader's decision with a review being a new submission at the grader's review fee,
**so that** I know what the grader found, that I was told before I booked, and where to ask rather than argue with the shop.

### grade10-site-grading-submission-lifecycle-US3-TC1-1: A card returned ungraded shows the grader's code, note and that the fee stands

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-03

**Pre-conditions:**

* The collector is on <grade10 grading submission page url> for a submission at Graded, with one card returned ungraded carrying the grader's code N1 and note.

**Steps:**

1. Load the submission page.

**Expected Results:**

* The card shows the Ungraded badge with the grader's code and note.
* The card's line states the fee stands.

### grade10-site-grading-submission-lifecycle-US3-TC2-1: A card below its named minimum grade shows raw with the fee standing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-03

**Pre-conditions:**

* The collector is on <grade10 grading submission page url> for a submission at Graded, with one card listed at a minimum grade of PSA 9 that graded PSA 8.

**Steps:**

1. Load the submission page.

**Expected Results:**

* The card shows the Minimum grade not met badge, raw.
* The card's line states the fee stands.

### grade10-site-grading-submission-lifecycle-US3-TC3-1: The page names a review as a new submission at the grader's review fee

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-03

**Pre-conditions:**

* The collector is on <grade10 grading submission page url> for a submission at Graded, with one card returned ungraded.

**Steps:**

1. Load the submission page.
2. Read the About the grades text beside the ungraded card.

**Expected Results:**

* Step 2 states the grade is the grader's decision, and that a review is a new submission at the grader's review fee, asked for at the counter.
* No act on this submission offers to reopen the grade.

---

## grade10-site-grading-submission-lifecycle-US4: Collector learns the upcharge the day the grades post

**As a** collector whose card came back worth more than the level allows,
**I want** the difference the fee sheet quoted me named on the grades email and on the page as due at the counter before collection,
**so that** I know what to settle before I come in and it is the figure I was warned of.

### grade10-site-grading-submission-lifecycle-US4-TC1-1: A card moved up a level names the quoted difference as due at the counter

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-04

**Pre-conditions:**

* The collector is on <grade10 grading submission page url> for a submission at Graded, with one card moved up a level; the fee sheet's difference between the two levels for that card is 60000 (HKD, minor units).

**Steps:**

1. Load the submission page.

**Expected Results:**

* The card shows the Moved up a level badge.
* The money block shows 60000 (HKD, minor units) due at the counter before collection, matching the figure the review step quoted at booking.

### grade10-site-grading-submission-lifecycle-US4-TC2-1: No card moved up a level shows no upcharge due line

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-04

**Pre-conditions:**

* The collector is on <grade10 grading submission page url> for a submission at Graded, with every card graded at or under its booked level.

**Steps:**

1. Load the submission page.

**Expected Results:**

* No card shows the Moved up a level badge.
* The money block shows no due-at-the-counter line.

---

## grade10-site-grading-submission-lifecycle-US5: Collector is paid out for a card that did not come back

**As a** collector whose card was lost or damaged in the grader's hands or in transit,
**I want** to be told the same day, paid out at the card's declared value with its fee refunded inside the payout window, at the till or by transfer, and the payout reversed on its record if the card turns up,
**so that** I never wait on the shop's claim against the grader or the courier.

### grade10-site-grading-submission-lifecycle-US5-TC1-1: A card not returned or damaged is paid out at declared value with its fee refunded

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-05

**Pre-conditions:**

* The collector is on <grade10 grading submission page url> for a submission at Ready, with one card marked Not returned, declared at 500000 (HKD, minor units), inside the payout window of 14 days from the batch's receipt.

**Steps:**

1. Load the submission page.

**Expected Results:**

* The card shows the Not returned badge with the payout line.
* The money block shows 500000 (HKD, minor units) paid out, with the card's fee refunded beside it.

### grade10-site-grading-submission-lifecycle-US5-TC2-1: A payout reaches the collector by either route

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-05

**Pre-conditions:**

* The collector is on <grade10 grading submission page url> for a submission at Ready, with one card marked Damaged and paid out by the route in the row.

**Test data:**

| Route | Value |
| --- | --- |
| Till | Paid out at the till |
| Bank transfer | Paid out by bank transfer |

**Steps:**

1. Load the submission page.

**Expected Results:**

* The money block names the route in the row.

### grade10-site-grading-submission-lifecycle-US5-TC3-1: A payout is reversed on its record when the card turns up

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-05

**Pre-conditions:**

* The collector is on <grade10 grading submission page url> for a submission at Ready, with a card whose earlier Not returned payout has been reversed on that record.

**Steps:**

1. Load the submission page.

**Expected Results:**

* The card shows back on the submission with the reversal line, in place of the Not returned badge.
* The money block shows the payout reversed on the same record.

---

## grade10-site-grading-submission-lifecycle-US6: Collector reads the pickup card when the cards are ready

**As a** collector whose cards are ready,
**I want** a four-digit code on the page and in the email, the shop's hours with no booking needed, what is due, and whether to bring an ID,
**so that** I walk in and leave with the slabs on one visit.

### grade10-site-grading-submission-lifecycle-US6-TC1-1: The pickup card shows the code, the shop's hours and that no booking is needed

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-06

**Pre-conditions:**

* The collector is on <grade10 grading submission page url> for a submission at Ready.

**Steps:**

1. Load the submission page.

**Expected Results:**

* The pickup card shows a four-digit code, the shop's hours, and that no booking is needed.

### grade10-site-grading-submission-lifecycle-US6-TC2-1: At the ID-glance threshold the page asks for no ID, above it it asks for one

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-06

**Pre-conditions:**

* The collector is on <grade10 grading submission page url> for a submission at Ready with a total declared value of 1000000 (HKD, minor units).
* The same collector holds a second submission at Ready with a total declared value of 1000100 (HKD, minor units).

**Steps:**

1. Load the submission page of the submission declared at 1000000.
2. Load the submission page of the submission declared at 1000100.

**Expected Results:**

* At exactly 1000000 the pickup card's Bring line shows nothing: above the threshold is more than the figure, never the figure itself.
* At 1000100 the pickup card names bringing an ID matching the collector's name.

### grade10-site-grading-submission-lifecycle-US6-TC3-1: Below the ID-glance threshold, the page asks the collector to bring nothing

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-06

**Pre-conditions:**

* The collector is on <grade10 grading submission page url> for a submission at Ready with a total declared value of 999900 (HKD, minor units).

**Steps:**

1. Load the submission page.

**Expected Results:**

* The pickup card's Bring line shows nothing.

### grade10-site-grading-submission-lifecycle-US6-TC4-1: What is due shows nothing owed, or one combined figure

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-06

**Pre-conditions:**

* The collector is on <grade10 grading submission page url> for a submission at Ready in the state the row names.

**Test data:**

| State | What is due |
| --- | --- |
| No upcharge, no storage | Nothing |
| An upcharge of 60000 and storage of 12000 (HKD, minor units) | 72000 (HKD, minor units), one figure |

**Steps:**

1. Load the submission page.

**Expected Results:**

* The pickup card's To settle line matches the row.

---

## grade10-site-grading-submission-lifecycle-US7: Collector names somebody else to collect

**As a** collector who cannot come in,
**I want** to name one person by their full name on the page before they come, change or remove them any time before collection, and see it logged in History,
**so that** they collect with the code and the ID the pickup card asks for, and nobody else can.

### grade10-site-grading-submission-lifecycle-US7-TC1-1: Naming a collector saves the full name and logs it in History

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-07

**Pre-conditions:**

* The collector is on <grade10 grading submission page url> for a submission at Ready with nobody named.

**Test data:**

| Field | Value |
| --- | --- |
| Their name | Chan Tai Man |

**Steps:**

1. Enter Their name.
2. Click Save.

**Expected Results:**

* The Named card shows Chan Tai Man with Change and Remove.
* History logs the name against its instant.

### grade10-site-grading-submission-lifecycle-US7-TC2-1: An empty name cannot be saved

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-07

**Pre-conditions:**

* The collector is on <grade10 grading submission page url> for a submission at Ready with nobody named.

**Steps:**

1. Leave Their name empty.

**Expected Results:**

* Save stays disabled.

### grade10-site-grading-submission-lifecycle-US7-TC3-1: Changing the named person replaces the previous name and logs it

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-07

**Pre-conditions:**

* The collector is on <grade10 grading submission page url> for a submission at Ready with Chan Tai Man named.

**Test data:**

| Field | Value |
| --- | --- |
| Their name | Wong Siu Ming |

**Steps:**

1. Click Change on the Named card.
2. Enter Their name and click Save.

**Expected Results:**

* The Named card shows Wong Siu Ming in place of Chan Tai Man.
* History logs the change against its instant.

### grade10-site-grading-submission-lifecycle-US7-TC4-1: Removing the named person returns the page to nobody named and logs it

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-07

**Pre-conditions:**

* The collector is on <grade10 grading submission page url> for a submission at Ready with Chan Tai Man named.

**Steps:**

1. Click Remove on the Named card.

**Expected Results:**

* The page returns to the field and Save, with nobody named.
* History logs the removal against its instant.

### grade10-site-grading-submission-lifecycle-US7-TC5-1: Naming a collector is refused once the cards are already collected

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-07

**Pre-conditions:**

* The collector is on <grade10 grading submission page url> for a submission at Collected.

**Steps:**

1. Look for a way to name a collector on the page.

**Expected Results:**

* No naming field shows on a Collected submission.

---

## grade10-site-grading-submission-lifecycle-US8: Collector who leaves the cards is reminded, charged and then given notice

**As a** collector who has not collected,
**I want** a reminder at 30 and 60 days costing nothing, the storage fee accruing per card and per month from day 90 and due before collection, and the written notice posted from day 180 giving me 30 days from its posting, with the cards mine throughout,
**so that** I am nudged, never surprised, and can still vault them instead.

### grade10-site-grading-submission-lifecycle-US8-TC1-1: The reminders at day 30 and day 60 cost nothing

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-08

**Pre-conditions:**

* The collector is on <grade10 grading submission page url> for a submission at Ready, the number of days in the row since the ready date.

**Test data:**

| Days since ready | Rung |
| --- | --- |
| 30 | First reminder |
| 60 | Second reminder |

**Steps:**

1. Load the submission page.

**Expected Results:**

* The uncollected ladder shows the rung in the row as passed, with no charge against it.

### grade10-site-grading-submission-lifecycle-US8-TC2-1: Storage accrues per card and per month started from day 90

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-08

**Pre-conditions:**

* The collector is on <grade10 grading submission page url> for a submission of four cards at Ready, 95 days since the ready date.

**Steps:**

1. Load the submission page.

**Expected Results:**

* The uncollected ladder shows the storage rung passed, at 4 cards times 3000 (HKD, minor units).
* The money block shows the same storage figure due before collection.

### grade10-site-grading-submission-lifecycle-US8-TC3-1: The written notice counts its 30 days from its posting date, not from day 180

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-08

**Pre-conditions:**

* The collector is on <grade10 grading submission page url> for a submission at Ready, 185 days since the ready date, with the written notice posted 3 days ago.

**Steps:**

1. Load the submission page.

**Expected Results:**

* The uncollected ladder shows the notice rung with its posting date, and 27 days left of the 30 counted from that posting date.

### grade10-site-grading-submission-lifecycle-US8-TC4-1: The cards stay the collector's and nothing further shows past the notice

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-08

**Pre-conditions:**

* The collector is on <grade10 grading submission page url> for a submission at Ready, 40 days past the notice's posting date.

**Steps:**

1. Load the submission page.

**Expected Results:**

* The submission still reads Ready to collect, with the cards named as the collector's.
* No rung or act past the notice shows on the ladder.

### grade10-site-grading-submission-lifecycle-US8-TC5-1: A slab vaulted instead of collected is excluded from the storage count

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-08

**Pre-conditions:**

* The collector is on <grade10 grading submission page url> for a submission of four cards at Ready, 95 days since the ready date, with one card vaulted.

**Steps:**

1. Load the submission page.

**Expected Results:**

* The uncollected ladder's cards-held count reads 3, excluding the vaulted card.
* The storage figure is 3 cards times 3000 (HKD, minor units), not 4.

### grade10-site-grading-submission-lifecycle-US8-TC6-1: Booking a visit or naming a collector does not pause the ladder

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-08

**Pre-conditions:**

* The collector is on <grade10 grading submission page url> for a submission of four cards at Ready, 95 days since the ready date, with a person named and a visit booked at the shop.

**Steps:**

1. Load the submission page.

**Expected Results:**

* The uncollected ladder still counts its rungs from the ready date, with the storage rung passed.
* The storage figure still accrues at 4 cards times 3000 (HKD, minor units) a month started.
* Nothing on the ladder reads as paused, held or waiting on the booked visit.

---

## grade10-site-grading-submission-lifecycle-US9: Collector keeps the graded record after collection

**As a** collector who has collected,
**I want** the grade, grader and cert per slab with a look-up link, the slab photographs and the three documents with their fingerprints to stay on the page and under my account when I keep one,
**so that** a vault valuation or an auction reads the record from there and my slab never enters the shop's stock.

### grade10-site-grading-submission-lifecycle-US9-TC1-1: The collected record shows the grade, grader, cert, photographs and documents

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-09

**Pre-conditions:**

* The collector is on <grade10 grading submission page url> for a submission at Collected.

**Steps:**

1. Load the submission page.

**Expected Results:**

* Each slab shows its grade, grader and cert with a Look up link, and its photograph.
* The three documents show with their fingerprints and a download.

### grade10-site-grading-submission-lifecycle-US9-TC2-1: Signed in, the collected record also lists under the collector's account

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-09

**Pre-conditions:**

* The collector is signed in with the same email the submission was booked under, which is now Collected.

**Steps:**

1. Open the signed-in home.

**Expected Results:**

* The Collected submission shows in Your submissions with its status word.

### grade10-site-grading-submission-lifecycle-US9-TC3-1: A card still held by the grader shows as held on an otherwise collected record

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-09

**Pre-conditions:**

* The collector is on <grade10 grading submission page url> for a submission of four cards, three Collected and one Held by the grader with the grader's expected date.

**Steps:**

1. Load the submission page.

**Expected Results:**

* The three collected cards show their graded record.
* The held card shows the Held by the grader badge with the expected date, and the record names a second hand-back still to come.

---

## grade10-site-grading-submission-lifecycle-US10: Collector cancels a submission before the visit starts

**As a** collector who no longer wants the cards graded,
**I want** to cancel the submission from the page until the visit starts and until the counter checks or refuses a card, with the drop-off going with it, and after that to have the counter refuse the cards instead,
**so that** nothing is left open in my name and nothing is owed.

### grade10-site-grading-submission-lifecycle-US10-TC1-1: Cancelling before hand-in closes the submission and its drop-off, with nothing owed

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-10

**Pre-conditions:**

* The collector is on <grade10 grading submission page url> for a submission at the status in the row.

**Test data:**

| Status | Drop-off |
| --- | --- |
| Planned | None booked |
| Booked | A drop-off booked |

**Steps:**

1. Click Cancel this submission.
2. Confirm Yes, cancel.

**Expected Results:**

* The submission reads Cancelled, with the rail ended at the row's stage.
* Where a drop-off was booked, it closes with the submission.
* The page states nothing was paid and nothing is owed.

### grade10-site-grading-submission-lifecycle-US10-TC2-1: The cancel act disappears once the cards are handed in

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-10

**Pre-conditions:**

* The collector is on <grade10 grading submission page url> for a submission at Handed in.

**Steps:**

1. Load the submission page.

**Expected Results:**

* No Cancel this submission act shows on the page.

### grade10-site-grading-submission-lifecycle-US10-TC3-1: Backing out of the cancel confirmation leaves the submission unchanged

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-10

**Pre-conditions:**

* The collector is on <grade10 grading submission page url> for a submission at Booked with a drop-off booked.

**Steps:**

1. Click Cancel this submission.
2. Click Go back on the confirmation.

**Expected Results:**

* The dialog closes, and the submission still reads Drop-off booked with its visit intact.

### grade10-site-grading-submission-lifecycle-US10-TC4-1: The last card refused at the counter cancels the submission

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-10

**Pre-conditions:**

* The collector is on <grade10 grading submission page url> for a submission of one card at Booked, whose only card the counter refused at hand-in.

**Steps:**

1. Load the submission page.

**Expected Results:**

* The card shows the Refused at the counter badge with the reason as staff typed it, never charged.
* The submission reads Cancelled, with the rail ended at Booked.
* The page states nothing was paid and nothing is owed.
* No message about the cancellation is in the submission's messages: the collector was told at the counter.

---

## grade10-site-grading-submission-lifecycle-US11: Collector is offered only what the status allows

**As a** collector reading the page,
**I want** each status to offer only the acts it allows, editing the list before hand-in, withdrawing a card at Handed in, naming a collector when ready, and nothing while the grader has the cards,
**so that** I am never shown a button that will only be refused.

### grade10-site-grading-submission-lifecycle-US11-TC1-1: Each status shows only the acts it allows

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-11

**Pre-conditions:**

* The collector is on <grade10 grading submission page url> for a submission at the status in the row.

**Test data:**

| Status | Acts shown |
| --- | --- |
| Planned | Edit the list; book, move or cancel the drop-off; cancel the submission |
| Booked | Edit the list; move or cancel the drop-off; cancel the submission |
| Handed in | Withdraw a card |
| Sent | None |
| Graded | None |
| Back | None |
| Ready | Name, change or remove a collector; collect; vault a slab |
| Collected | Read the record; vault a slab; consign it to an auction; ask for erasure |

**Steps:**

1. Load the submission page.

**Expected Results:**

* Only the acts listed for that status show on the page.
* No other act, control or button shows.

---

### grade10-site-grading-submission-lifecycle-US11-TC2-2: The edit of the list and the cancel go once the counter checks or refuses a card

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
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-11

**Pre-conditions:**

* The collector has <grade10 grading submission page url> open in a second tab for a submission of two cards at Booked, loaded before the counter acted.
* At the counter, staff have acted on the first card as in the row, and on nothing else.

**Test data:**

| The counter | On the first card |
| --- | --- |
| Checked it | the condition note and both intake photographs |
| Refused it | the Refused at the counter badge with the reason as staff typed it |

**Steps:**

1. Load the submission page in the first tab.
2. In the second tab, change a card's name and save the list.
3. In the second tab, click Cancel this submission and confirm Yes, cancel.

**Expected Results:**

* Step 1: the page offers no edit of the list and no Cancel this submission.
* Step 2: the save is refused with a message that the list is at the counter.
* Step 3: the cancel is refused by name, and the submission is not cancelled.
* After step 3, reloading the page shows both cards as before, and the first card as in the row.

### grade10-site-grading-submission-lifecycle-US11-TC3-1: Editing a kept list saves the same submission and books nothing

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-11

**Pre-conditions:**

* The collector is on <grade10 grading submission page url> for a submission of three cards at the status in the row, and the counter has checked or refused none of them.

**Test data:**

| Status | Drop-off |
| --- | --- |
| Planned | None booked |
| Booked | A drop-off booked |

**Steps:**

1. Click Edit the list.
2. Add a fourth card with a declared value, and save the changes.
3. Open the collector's submissions on <grade10 grading url>.

**Expected Results:**

* Step 2: the same submission page opens, its id unchanged, listing four cards.
* Step 2: the drop-off is as in the row: none on the Planned one, the same day and time on the Booked one.
* Step 3: one submission is listed for this list, not two.

---

## Reconciliation

**Run:** the blind pass read the bundle built for `grade10-site/grading/submission-lifecycle` under `add-card-grading` - this capability's `## Purpose` and `## Feature set`, its `user-journeys.md`, the change's `proposal.md`, its `decisions.md` with the `## Raised` table, `ui-design.md` with the state dispositions stripped, and the linked pages under `docs/prds/products/grade10-site/grading/`. Denied: every `## Requirements` section, `openspec/specs/`, `openspec/changes/archive/` and `tech-design.md`. It wrote 38 cases over US1-US11 and four raised questions; the scenario pass wrote SC-01 to SC-51 over eighteen requirements. The two are joined here on anchors.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `US1-TC1-1`'s rail step for Graded, Back and Ready | Corrected | The case read Sent at all three; the status table the page and the PRD both carry reads Graded, Back and Back. The material settles it, so the case moved rather than the requirement |
| `US1-TC1-1`'s walk of the whole status table | Folded in | `grade10-site-grading-submission-lifecycle-SC-53` - the scenarios took one status each, and none said the word, the chip and the rail are one row read three ways |
| `US1-TC5-1` an id that does not exist reads not found | Folded in | `grade10-site-grading-submission-lifecycle-SC-52`, with the rule the raised question settled: an unissued id and a reader who holds neither the session nor the link are answered the same way |
| Raised: is the page restricted to the owning collector, or does anyone with the URL read it? | Folded in | `grade10-site-grading-submission-lifecycle-SC-52` and the requirement "The submission page opens to the collector and to the emailed link"; landed as `decisions.md` Q80. Case `US1-TC7-1` added |
| `US1-TC6-1` a failed load shows an error to retry | No scenario: presentation | Loading and error are the view's states; the `ui-design.md` rows close as `**Out of suite:** the view's colocated test`, and the case stays as their guard |
| Raised: what does the status do once every card is withdrawn before the batch closes? | Folded in | `grade10-site-grading-submission-lifecycle-SC-54` - the last withdrawal cancels the submission and the collector is told; landed as `decisions.md` Q81. Case `US2-TC4-1` added |
| `US4-TC2-1` no card moved up shows no upcharge line | Reached | The empty case of `grade10-site-grading-submission-lifecycle-SC-23`; `grade10-site-grading-submission-lifecycle-SC-27` states what the page shows when nothing is due. No new rule |
| `US6-TC2-1` the ID glance at exactly HKD 10,000 declared | **Covered by `grade10-site-grading-submission-lifecycle-SC-28` and `grade10-site-grading-submission-lifecycle-SC-29`, corrected** | Above the threshold is more than the figure, so a submission declared at exactly 1000000 HKD minor units is released on the code and the name. The case now reads the figure on the no-ID side and the sum above it on the ID side, and `decisions.md` carries the rule as Q85 |
| `US7-TC2-1` an empty name cannot be saved | Folded in | `grade10-site-grading-submission-lifecycle-SC-55` |
| `US7-TC4-1` removing the named person | Folded in | `grade10-site-grading-submission-lifecycle-SC-56` - the requirement allowed the removal and no scenario walked it |
| Raised: does the uncollected ladder pause once a visit is booked or a collector named? | Folded in | `grade10-site-grading-submission-lifecycle-SC-57` - it keeps counting, and only collection, vaulting or a payout takes a card off it; landed as `decisions.md` Q83. Case `US8-TC6-1` added |
| `US9-TC2-1` the collected record under the signed-in account | Reached | Stated by the record requirement's **Where it is read**; the signed-in list itself is `grade10-site/grading/submission-plan`'s surface, walked by its US-06 |
| Raised: where is "a collector's slab never enters the catalogue" observable? | **Out of suite:** the store's catalogue suite | The absence is verified where the catalogue is, not on a grading screen; landed as `decisions.md` Q82. `grade10-site-grading-submission-lifecycle-SC-45` keeps the submission's record as the one place a valuation or a consignment reads |
| `US10-TC1-1`'s rail after a cancel from Booked | Corrected | The case ended the rail at Planned for both rows; `grade10-site-grading-submission-lifecycle-SC-06` leaves it at the stage the submission ended on |
| `US10-TC3-1` backing out of the cancel confirmation | No scenario: the dialog's own | `grade10-site-grading-submission-lifecycle-SC-47` states the cancel; Go back is the view's branch, and the case stays as its guard |
| The last card refused at the counter | Folded in | `grade10-site-grading-submission-lifecycle-SC-58` - the counter cancels the submission and tells the collector there, and no message sends; landed as `decisions.md`'s last-card-refused row, which the counter's hand wrote from its own side as `grade10-admin-grading-counter-SC-89`, written as a 🚧 line on `docs/prds/products/grade10-site/grading/submission.md`, and the `ui-design.md` Flags ❓ closed. Case `US10-TC4-1` added |
| The counter owns the list from the first card it checks or refuses | Folded in | `grade10-site-grading-submission-lifecycle-SC-59` - an edit sent after the counter checked a card deleted cards its photographs hang off; the director ruled the list the counter's from its first check or refusal, written as a 🚧 line on `docs/prds/products/grade10-site/grading/submission.md` and in task 11.8. Case `US11-TC2-2` added |
| `US11-TC1-1`'s acts for a Collected submission | Corrected | The case offered Vault it and erasure alone; the acts table also offers reading the record and consigning to an auction |
| `grade10-site-grading-submission-lifecycle-SC-01` a move the status does not name is refused | **Out of suite:** `grade10-admin/grading/counter`'s suite | Its anchor is the feature set group The statuses: no journey of this capability walks a move, and every move is made at the counter |
| `grade10-site-grading-submission-lifecycle-SC-60` | Case added, added after the run | `US1-TC8-1`: decided outside the blind pass, after a plan kept signed out landed on not found; the wizard opens the page on the access the emailed link carries |
| `grade10-site-grading-submission-lifecycle-SC-61` | Case revised, added after the run | `US11-TC2-1` became `US11-TC2-2`: decided outside the blind pass, the cancel shares the counter's window, so it goes with the edit once a card is checked or refused and a cancel sent from a stale page is refused |
| `grade10-site-grading-submission-lifecycle-SC-62` | Case added, added after the run | `US11-TC3-1`: decided outside the blind pass; the editor saves the same submission at Planned and Booked and books nothing |

**Uncovered anchors:** none. Every journey US-01 to US-11 carries cases, and the one feature-set anchor, The statuses, is listed out of suite above.

### Manual

| Manual | Why |
| --- | --- |
| `US2-TC1-1`, `US2-TC4-1` | The card is pulled from the intake bag and its fee comes back at the till; a person runs the counter and the POS, and only the page's lines are scriptable |
| `US5-TC1-1`, `US5-TC2-1` | The payout is made at the till or by bank transfer by a person; the case walks the money as well as the lines the page draws |
| `US6-TC2-1` | The ID glance happens at the counter and keeps nothing, so nothing but the page's Bring line is scriptable |
| `US8-TC3-1` | The written notice is posted by registered post, and its posting date and tracking are typed in from the receipt |
| `US10-TC4-1` | The refusal and the telling both happen at the counter, and the case asserts no message was sent for them |
