# grade10-admin/grading/counter Test Cases

**Status:** in-review
**Drafts styled:** 2026-09-29, tcs-rules r4

**Out of suite:**

- `grade10-admin-grading-counter-SC-11` - the queue row badging a letter that never went: `grade10-site/grading/submission-lifecycle`'s feature suite, where `grade10-site/grading/collector-notifications` routes its uncollected ladder. This suite reads the flagged letter on the submission, not the row's badge; the review left the badge to that suite.
- `grade10-admin-grading-counter-SC-47` - a declined signature leaving nothing handed over: `grade10-site/grading/counter-documents`'s feature suite, which walks the collector declining on the iPad. The counter only reads the decline back on its step.
- `grade10-admin-grading-counter-SC-81` - an act with nowhere to record itself, refused: the grading worker's audit-write test, where the chain refuses the act's row and the act goes back with it (`grade10:packages/grading/backend/src/testing/suites/audit.ts`). No counter act reaches an unwritable audit entry from a screen; the review left it to that test.

## Background

* The stack is a Grade10 dev or isolated end-to-end stack, started so its grading dev settings stand: PSA's five levels (Value: ceiling 390000 minor units, fee 25000; Regular: ceiling 1170000, fee 60000; Express: ceiling 1950000, fee 120000, cover 1.5%; Super Express: ceiling 3900000, fee 240000, cover 1.5%; Bulk: ceiling 150000, fee 18000), the storage fee of 3000 minor units a card a month, the ID glance threshold of 2000000, the safe's declared cap of 999999999, and the clocks as seeded: storage from day 90, reminders on days 30 and 60, the notice on day 180, settlement in 14 days, the batch cut-off Thursday 19:00 `Asia/Hong_Kong`. A case that needs another figure writes it first, as *Writing a money setting* says.
* admin A and admin B each hold the `staff` role, which carries `grading:read`, `grading:operate` and `grading:approve`, and each is signed in to the console in a browser of their own. A case naming one admin means admin A.
* The collector of a submission reads it at <grade10 grading submission url>, through the access link its seed answers.
* *Seeding a submission* — `POST <grade10 api origin>/grading/dev/submissions/seed` with a fresh `seed`, the `status` the case names and, where the case gives them, `arrival` (`booked` or `walk-in`), `level`, `cards` (one declared value per card, in minor units), `appointmentAt` and `readyAt`, all in the past. It walks the submission to that status through the desk's own acts and answers its id, reference, pickup code and batch; its page is <grade10 admin grading submission url> with that id.
* *Receiving with an exception* — seed the submission at `sent`; on <grade10 admin grading batches url> record on its batch the grader's stage that puts the grades in, then press Arrived; press Receive, enter the manifest and the invoice with a line per card, a card moved up a level on a line at the higher level; scan every card but the one the case names, record that one as the case says (held by the grader, not returned, damaged or returned ungraded), and press Finish receiving.
* *Writing a money setting* — admin A edits the row on <grade10 admin grading settings url>, gives a reason and asks for approval; admin B presses Approve on the waiting row in their own console. It is written before any submission the figure must reach is seeded, since a submission pins its figures at booking and at signing.
* *Reading a letter* — `GET <grade10 api origin>/grading/dev/outbox?email=<collector email>` answers the last letter grading sent that address, and 404 where it sent none.

---

## grade10-admin-grading-counter-US1: Operator opens the shop and sees what every submission waits for

**As a** member of shop staff starting a shift,
**I want** the queue cut by what each submission waits for, today's drop-offs in a strip, and a badge naming why a row needs me,
**so that** I work the counter without being emailed anything.

### grade10-admin-grading-counter-US1-TC1-1: The seven views cut submissions by exactly what they wait for

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-01

**Pre-conditions:**

* admin(holds `grading:read`) is on <grade10 admin grading queue url>.
* One submission is seeded at each of `booked`, `checked_in`, `sent`, `returned`, `ready`, `collected`, `cancelled` and `expired`, as *Seeding a submission* says, and the tester has noted each reference.

**Steps:**

1. Navigate to <grade10 admin grading queue url>.
2. Click Booked.
3. Click Ready.
4. Click Closed.
5. Click Handed in.
6. Click With the grader.
7. Click Back.

**Expected Results:**

* Step 2 lists the `booked` submission and no other seeded one, with the view's own count.
* Step 3 lists the `ready` submission and no other seeded one.
* Step 4 lists the `collected`, `cancelled` and `expired` submissions together, and none of them appears in another view.
* Each seeded submission is listed by exactly one of the six status views.
* Every row carries the submission id, the collector, the cards, the grader and level, the status word, the visit, when it was last touched and what it is waiting on.

### grade10-admin-grading-counter-US1-TC2-1: The Today strip lists the day's drop-offs in slot order

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-01

**Pre-conditions:**

* admin(holds `grading:read`) is on <grade10 admin grading queue url>.
* Two submissions are seeded at `booked`, as *Seeding a submission* says, with `appointmentAt` at two different times earlier on the shop's own day, `Asia/Hong_Kong`.

**Steps:**

1. Navigate to <grade10 admin grading queue url>.
2. Read the strip of the day's drop-offs above the rows.

**Expected Results:**

* The strip lists the two drop-offs in slot order, each with its time, collector, id, cards, and grader and level.
* One line under them says that pickups walk in.

### grade10-admin-grading-counter-US1-TC3-1: A row's badge names the wait and clears once it no longer applies

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-01

**Pre-conditions:**

* admin(holds `grading:read`) is on <grade10 admin grading queue url>.
* It is Thursday on the shop's own day, `Asia/Hong_Kong`, the batch cut-off's day.
* A `checked_in` submission sits in a batch whose cut-off is today: handed in at the desk this week, as a walk-in at <grade10 admin grading walk-in url>.

**Steps:**

1. Click Handed in.
2. Read the submission's row.
3. On Friday, with nothing done to the submission, click Handed in again.
4. Read the same row.

**Expected Results:**

* Step 2 shows the Batch closes today badge.
* Step 4 no longer shows that badge on the same row, recomputed from the submission's own dates rather than a value somebody has to clear.

### grade10-admin-grading-counter-US1-TC4-1: The counter tiles summarise closing, with graders, ready, and to settle

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-01

**Pre-conditions:**

* admin(holds `grading:read`) is on <grade10 admin grading queue url>, on a stack holding no submission but those below.
* A batch at PSA Regular closes at the next cut-off, holding two submissions of one card each, handed in at the desk this week as walk-ins at <grade10 admin grading walk-in url>.
* Three submissions are with the grader, seeded at `sent` at Express as *Seeding a submission* says, one with `appointmentAt` 30 days back so its batch is past its three-week estimate, two with the default anchors.
* Four submissions are ready and uncollected: two seeded at `ready`, one with `readyAt` 45 days back and one with the default anchors; and two reached by *Receiving with an exception*, each owing an unpaid upcharge, one card moved from Value to Regular, 35000 minor units (HKD 350.00), and one from Regular to Express, 60000 minor units (HKD 600.00).

**Steps:**

1. Navigate to <grade10 admin grading queue url>.
2. Read the four tiles.

**Expected Results:**

* The Batch closing tile names PSA Regular, its 2 cards, its 2 submissions, how many more may still join today, and the day it ships.
* The With graders tile reads 3, of which 1 is past its estimate.
* The Ready, uncollected tile reads 4, of which 1 is past 30 days.
* The To settle tile reads 95000 minor units (HKD 950.00), 35000 plus 60000, over 2 submissions.

### grade10-admin-grading-counter-US1-TC5-1: A view with no submissions shows its empty state

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-01

**Pre-conditions:**

* admin(holds `grading:read`) is on <grade10 admin grading queue url>.
* The stack holds no `collected`, `cancelled` or `expired` submission, as a fresh stack does.

**Steps:**

1. Navigate to <grade10 admin grading queue url>.
2. Click Closed.

**Expected Results:**

* Closed shows its empty state rather than a blank table, and every other view is still offered.

### grade10-admin-grading-counter-US1-TC6-1: A view past 50 rows pages instead of overflowing

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-01

**Pre-conditions:**

* admin(holds `grading:read`) is on <grade10 admin grading queue url>.
* The row's number of submissions are seeded at `booked`, as *Seeding a submission* says, and no other submission is booked.

**Test data:**

| Row | Booked submissions | Outcome |
| --- | --- | --- |
| A | 51 | two pages; the 51st row on the second |
| B | 50, exactly the page | one page; no more remain |

**Steps:**

1. Navigate to <grade10 admin grading queue url>.
2. Click Booked.
3. Click the pager's next page, where one is offered.

**Expected Results:**

* Step 2 lists the newest-touched 50 rows.
* Step 3, in row A, loads the 51st row without repeating any row already shown; in row B, no next page is offered.
* Each page shows how many rows stand behind the cut and whether more remain.

### grade10-admin-grading-counter-US1-TC7-1: A read-grant holder sees no row action beyond Open

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-grading-counter-US-01

**Pre-conditions:**

* admin(holds `grading:read`, not `grading:operate` or `grading:approve`) is on <grade10 admin grading queue url>.
* The operator's grants are mocked to `grading:read` alone, since no shipped role holds that grant alone.
* A submission is seeded at `booked`, as *Seeding a submission* says.

**Steps:**

1. Navigate to <grade10 admin grading queue url>.
2. Read the actions on the `booked` submission's row.

**Expected Results:**

* Open is the only action offered; no hand-in, hand-back or settings act shows on the row.

### grade10-admin-grading-counter-US1-TC8-1: The Today cut is made on the shop's own day, not the server's

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-01

**Pre-conditions:**

* admin(holds `grading:read`) is on <grade10 admin grading queue url>.
* The time is between 00:00 and 07:59 on the shop's own day, `Asia/Hong_Kong`, so the date in Coordinated Universal Time is still the day before.
* The collector has booked a drop-off for later that day on the site, at <grade10 grading url>, so its submission is `booked`.

**Steps:**

1. Navigate to <grade10 admin grading queue url>.
2. Click Today.
3. Read the submission's row.

**Expected Results:**

* Step 2 lists the submission booked for later that day on the shop's own calendar day, `Asia/Hong_Kong`.
* Step 3 shows the row's Visit today badge, agreeing with the Today cut.

### grade10-admin-grading-counter-US1-TC9-1: A planned submission with no drop-off booked is in no view

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-01

**Pre-conditions:**

* admin(holds `grading:read`) is on <grade10 admin grading queue url>.
* A submission is seeded at `planned`, as *Seeding a submission* says, with no drop-off booked, and the tester has noted its reference.

**Steps:**

1. Click Booked, Handed in, With the grader, Back, Ready and Closed in turn, reading each list.
2. Click Today.

**Expected Results:**

* The planned submission is in none of them; the collector's own list holds it.

### grade10-admin-grading-counter-US1-TC10-1: Nothing about a submission is emailed or pushed to staff

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-01

**Pre-conditions:**

* admin A and admin B hold the `staff` role, each with a mailbox the tester can read, *Reading a letter* serving for each staff address.
* A submission is `sent` in a batch whose grades are in, a second is seeded at `sent` at Express with `appointmentAt` 30 days back so its batch is past its estimate, and a third is seeded at `ready` with `readyAt` 180 days back.

**Steps:**

1. Receive the first submission's batch, as *Receiving with an exception* says with no exception, so it becomes `ready`.
2. Read each staff address's letters, as *Reading a letter* says.
3. Navigate to <grade10 admin grading queue url>.
4. Read the tiles, the strip and the three submissions' rows.

**Expected Results:**

* No email and no push reaches any member of staff.
* The queue's badges, its tiles and the day's strip carry all three instead.

---

## grade10-admin-grading-counter-US2: Operator hands a booked list in at the counter

**As a** member of shop staff with a collector at the desk,
**I want** to find the booking, or write a walk-in's list with them, check each card and photograph it, confirm the level fits every declared value, show the agreement on the iPad, take the fee and any cover line at the till only once it is sealed, and print the labels and hand in with the intake receipt going out, the submission staying booked and the cards going home if no line was paid,
**so that** the cards are sealed in the bag with a receipt in one visit and nothing was paid for a card nobody checked.

### grade10-admin-grading-counter-US2-TC1-1: The day's booking opens its submission and starts the visit at the desk

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-02

**Pre-conditions:**

* admin(holds `grading:operate`) is on <grade10 admin grading queue url>.
* A submission is seeded at `booked`, as *Seeding a submission* says, with `appointmentAt` earlier on the shop's own day; its visit has not been started at the desk.

**Steps:**

1. Click the submission in the strip of the day's drop-offs.
2. Click Start at the desk.

**Expected Results:**

* Step 1 opens the hand-in runbook at Not handed in yet.
* Step 2 starts the visit and offers the card checks.

### grade10-admin-grading-counter-US2-TC2-1: A walk-in's list is written at the desk, card by card, with the collector

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-02

**Pre-conditions:**

* admin(holds `grading:operate`) is on <grade10 admin grading walk-in url>.
* A collector is at the desk with two cards and no submission.

**Test data:**

| Field | Value |
| --- | --- |
| Grader and level | PSA Regular |
| First card's declared value | 300000 minor units (HKD 3,000.00), any value up to Regular's ceiling of 1170000 |
| Second card's declared value | 500000 minor units (HKD 5,000.00), any value up to Regular's ceiling of 1170000 |

**Steps:**

1. Enter the collector's email, name and phone, the grader and level, the shop and the first card with its declared value.
2. Click Open the submission.
3. On the submission's runbook, click Add a card and enter the second card with its declared value.

**Expected Results:**

* Step 1 takes one card, and neither step offers a paste of a list.
* Step 3 adds the second card, one at a time with the collector.
* The runbook proceeds from Not handed in yet with the two cards listed.
* The Money tab prices the cards on PSA Regular's fee as it stands at the hand-in.

### grade10-admin-grading-counter-US2-TC3-1: A card is checked present, condition-noted and photographed front and back

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/handin.spec.ts`

**Pre-conditions:**

* admin(holds `grading:operate`) is on <grade10 admin grading submission url> for a submission seeded at `booked`, as *Seeding a submission* says, its visit started with Start at the desk.
* The collector's page for the submission is open at <grade10 grading submission url>.

**Test data:**

| Field | Value |
| --- | --- |
| Condition note | Light whitening on the back corners |

**Steps:**

1. On the first card's row, tick Present.
2. Type the condition note.
3. Take the front photograph, then the back photograph.
4. Reload the collector's page.

**Expected Results:**

* Step 1 marks the card present.
* Step 2 shows the note as typed in place of "Nothing noted."
* Step 4 shows both photographs on the collector's page.

### grade10-admin-grading-counter-US2-TC4-1: A card at the level's declared-value ceiling passes the level check

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-02

**Pre-conditions:**

* admin(holds `grading:operate`) is on <grade10 admin grading submission url> for a submission seeded at `booked` at Value with one card of the declared value below, as *Seeding a submission* says, its visit started with Start at the desk.

**Test data:**

| Field | Value |
| --- | --- |
| Level | Value |
| Ceiling | 390000 minor units (HKD 3,900.00) |
| Card's declared value | 390000 minor units (HKD 3,900.00), exactly the ceiling |

**Steps:**

1. On the card's row, tick Present, keep the declared value as listed, and take the front and back photographs.
2. Read the level check.

**Expected Results:**

* The banner reads every declared value inside the ceiling, the at-ceiling card counted as fitting.

### grade10-admin-grading-counter-US2-TC5-1: A card above the level's ceiling is marked and moves to a second submission or is refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-02

**Pre-conditions:**

* admin(holds `grading:operate`) is on <grade10 admin grading submission url> for a submission seeded at `booked` at Value with two cards of 300000 minor units (HKD 3,000.00) each, as *Seeding a submission* says, its visit started with Start at the desk.
* Value's ceiling is 390000 minor units (HKD 3,900.00), as the stack seeds it.

**Test data:**

| Row | Card's value declared at the desk | Outcome |
| --- | --- | --- |
| A | 400000 minor units (HKD 4,000.00), any value above the ceiling | marked above Value's ceiling, refused at Value |
| B | 390001 minor units (HKD 3,900.01), one above the ceiling | marked above Value's ceiling, refused at Value |

**Steps:**

1. On the first card's row, tick Present and change the declared value to the row's value declared at the desk.
2. Read the level check and the first card's row.

**Expected Results:**

* The row is marked above Value's ceiling and refused at Value by name.
* Staff are offered to move the card to a second submission or refuse it; the rest of the list is unaffected.

### grade10-admin-grading-counter-US2-TC6-1: The agreement is not mintable while a card is unchecked

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-02

**Pre-conditions:**

* admin(holds `grading:operate`) is on <grade10 admin grading submission url> for a submission seeded at `booked` with three cards, as *Seeding a submission* says, its visit started with Start at the desk.
* Two cards are checked, Present ticked and both photographs taken; the third is neither checked nor refused.

**Steps:**

1. Read the Sign the agreement step.

**Expected Results:**

* The step names the unchecked card as the reason the agreement cannot be minted.

### grade10-admin-grading-counter-US2-TC7-1: The agreement mints once every card is checked

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/handin.spec.ts`

**Pre-conditions:**

* admin(holds `grading:operate`) is on <grade10 admin grading submission url> for a submission seeded at `booked` with two cards, as *Seeding a submission* says, its visit started with Start at the desk.
* Both cards are checked, Present ticked and both photographs taken.
* The shop's iPad is at the desk with a browser open.

**Steps:**

1. Read the Sign the agreement step.
2. Click Show on iPad.
3. Read the agreement on the iPad.

**Expected Results:**

* Step 1 offers Show on iPad and Copy link with the 30-minute line.
* Step 3 shows the schedule of cards as checked, on the collector's device.

### grade10-admin-grading-counter-US2-TC8-1: The till opens only once the agreement is sealed, one line per card and a cover line where the level carries one

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-02

**Pre-conditions:**

* admin(holds `grading:operate`) is on <grade10 admin grading submission url> for a submission seeded at `booked` at Express with the two cards below, as *Seeding a submission* says, its visit started with Start at the desk.
* Both cards are checked, Present ticked and both photographs taken; the agreement is not yet sealed.
* The shop's iPad is at the desk, and the collector signs on it when asked.

**Test data:**

| Field | Value |
| --- | --- |
| Level | Express |
| Fee a card | 120000 minor units (HKD 1,200.00) |
| Cover rate | 1.5% of each card's declared value |
| First card's declared value | 200000 minor units (HKD 2,000.00), any value up to Express's ceiling of 1950000 |
| Second card's declared value | 400000 minor units (HKD 4,000.00), any value up to Express's ceiling of 1950000 |
| Cover lines | 3000 and 6000 minor units (HKD 30.00 and HKD 60.00) |

**Steps:**

1. Read Take payment before the agreement is sealed.
2. Click Show on iPad, and have the collector sign the agreement on the iPad.
3. Click Take payment.
4. Record the paid order.

**Expected Results:**

* Step 1 shows Take payment disabled, the unsealed agreement named as the reason.
* Step 3 opens the till with one Grading Service line per card at 120000 minor units (HKD 1,200.00) and one cover line per card at 1.5% of its declared value, 3000 and 6000 minor units.
* Step 4 writes the order back one fee line to each card in list order, a cover line beside each.

### grade10-admin-grading-counter-US2-TC9-1: No hand-in without a paid line leaves the submission booked and the cards with the collector

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-02

**Pre-conditions:**

* admin(holds `grading:operate`) is on <grade10 admin grading submission url> for a submission seeded at `booked`, as *Seeding a submission* says, every card checked at the desk and the agreement sealed on the iPad.
* Take payment has opened the till.

**Steps:**

1. Close the till without taking payment, so no paid order is recorded.
2. Click Print n labels and check in.

**Expected Results:**

* Step 2 is refused by name; the submission stays `booked`, the seal still stands, and the cards go home with the collector.
* The runbook offers to run the till again or wait for another drop-off.

### grade10-admin-grading-counter-US2-TC10-1: The safe's cap refuses a hand-in that would carry it past the cap

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-02

**Pre-conditions:**

* The safe's declared cap is written as below, as *Writing a money setting* says, on a stack holding no other `checked_in`, `returned` or `ready` submission.
* The safe holds the declared value below: one submission seeded at `checked_in` at Super Express, as *Seeding a submission* says, with eight cards, seven of 3900000 minor units and one of 2600000.
* admin(holds `grading:operate`) is on <grade10 admin grading submission url> for a further submission seeded at `booked` with one card of the declared total below, every card checked at the desk and the agreement sealed on the iPad.
* The fee is paid at the till.

**Test data:**

| Field | Value |
| --- | --- |
| Safe declared cap | 30000000 minor units (HKD 300,000.00) |
| Safe currently holds | 29900000 minor units (HKD 299,000.00) |
| This hand-in's declared total | 200000 minor units (HKD 2,000.00) |
| Held after this hand-in | 30100000 minor units (HKD 301,000.00), past the cap |

**Steps:**

1. Click Print 1 label and check in.

**Expected Results:**

* Step 1 is refused by name, naming the safe's cap, and the counter offers Book the next drop-off.

### grade10-admin-grading-counter-US2-TC11-1: Labels, seal and check-in move the submission from Booked to Handed in

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/handin.spec.ts`

**Pre-conditions:**

* admin(holds `grading:operate`) is on <grade10 admin grading submission url> for a submission seeded at `booked` with three cards, as *Seeding a submission* says.
* At the desk, all three cards are checked, the agreement is sealed on the iPad, and the fee is paid at the till with Take payment.
* The desk's label printer is on.

**Steps:**

1. Click Print 3 labels and check in.
2. Seal the three cards into the intake bag with the printed list.
3. Read the submission's status word.
4. Read the collector's letter, as *Reading a letter* says.

**Expected Results:**

* Step 1 prints three intake labels, one per card.
* Step 2 seals the cards into the intake bag with the printed list.
* Step 3 reads Handed in: the submission moved `booked → checked_in`.
* Step 4 is the intake receipt, with the signed agreement.

### grade10-admin-grading-counter-US2-TC12-1: A second submission on the same visit runs its own hand-in runbook

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-02

**Pre-conditions:**

* admin(holds `grading:operate`) is on <grade10 admin grading submission url> for the first of two submissions on one drop-off today: the collector booked the drop-off for the first on the site, at <grade10 grading url>, and brought a second list to that same drop-off there.
* The first submission's visit is started with Start at the desk.

**Steps:**

1. Click the second submission where the runbook names it under the visit.
2. On the second submission's runbook, check its cards, tick Present and take both photographs for each, without touching the first.
3. Read its level check and its Take payment step.

**Expected Results:**

* The second submission runs its own hand-in runbook, its own level check and its own till line, without depending on the first submission's state.
* Each runbook names the other submission under the visit.

### grade10-admin-grading-counter-US2-TC13-1: Check in is refused while the agreement is unsealed

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-grading-counter-US-02

**Pre-conditions:**

* admin(holds `grading:operate`) is on <grade10 admin grading submission url> for a submission seeded at `booked`, as *Seeding a submission* says, every card checked at the desk and the agreement not sealed.

**Steps:**

1. Send the check-in for the submission directly, outside the runbook, which offers no step before the one above it is done.
2. Read the submission's status word.

**Expected Results:**

* The check-in is refused by name, naming the unsealed agreement.
* The submission stays `booked` and the cards stay with the collector.

### grade10-admin-grading-counter-US2-TC14-1: An order recorded on another submission is refused, and a replay answers the first its own lines

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-02

**Pre-conditions:**

* Two submissions are seeded at `booked`, as *Seeding a submission* says, as the test data sets them, each with its card checked at the desk and its agreement sealed on the iPad.
* One paid order is rung at the till carrying a Grading Service line at each level, and its order number is noted.
* admin(holds `grading:operate`) has both submissions open at <grade10 admin grading submission url>, one tab each, at the fee step.

**Test data:**

| Field | Value |
| --- | --- |
| First submission | Express, one card, agreement sealed |
| Second submission | Regular, one card, agreement sealed |
| Paid order | one order carrying a Grading Service line at each level |

**Steps:**

1. On the Express submission, record the paid order by its order number.
2. On the Regular submission, record the same order number.
3. On the Express submission, record the same order number again.

**Expected Results:**

* Step 1 writes the Express line back to the Express submission.
* Step 2 is refused by name, naming the Express submission as the one holding the order, and the Regular submission shows no fee line and no new timeline entry.
* Step 3 writes nothing and shows the Express submission's own line from step 1.

---

## grade10-admin-grading-counter-US3: Operator refuses one card and the rest go on

**As a** member of shop staff checking a card the grader would not take,
**I want** to refuse it with one of three reasons and a line in the collector's words that shows on their page and the receipt, the list and the fee dropping to the cards that go on and a line already paid refunded at the till,
**so that** one card never charges the collector or holds the others.

### grade10-admin-grading-counter-US3-TC1-1: A card is refused with each of the three collector-facing reasons

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-03

**Pre-conditions:**

* admin(holds `grading:operate`) is on <grade10 admin grading submission url> for a submission seeded at `booked` with two cards, as *Seeding a submission* says, its visit started with Start at the desk.
* The collector's page for the submission is open at <grade10 grading submission url>.

**Test data:**

| Row | Reason | Words |
| --- | --- | --- |
| A | The grader would not take it | Corner crease along the top edge |
| B | Declared above the level | Declared HKD 50,000, this level tops at HKD 39,000 |
| C | The collector withdrew it | Collector wants to keep this one for now |

**Steps:**

1. On the first card's row, click Refuse.
2. Choose the row's reason.
3. Type the row's words in the collector's-words field.
4. Click Refuse this card.
5. Reload the collector's page.
6. Check the second card, seal the agreement on the iPad, take the fee with Take payment, and click Print 1 label and check in.
7. Read the intake receipt, as *Reading a letter* says.

**Expected Results:**

* Step 4 strikes the row with its own reason.
* Steps 5 and 7 show the words exactly as typed, on the submission page and on the receipt.
* The card is never charged: step 6's till carries no line for it.

### grade10-admin-grading-counter-US3-TC2-1: Refuse stays disabled until a reason and the collector's words are given

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/handin.spec.ts`

**Pre-conditions:**

* admin(holds `grading:operate`) is on <grade10 admin grading submission url> for a submission seeded at `booked`, as *Seeding a submission* says, its visit started with Start at the desk.

**Test data:**

| Row | Reason | Collector's words | Outcome |
| --- | --- | --- | --- |
| A | none picked | empty | Refuse this card disabled |
| B | The grader would not take it | empty | Refuse this card disabled |
| C | none picked | Corner crease along the top edge | Refuse this card disabled |

**Steps:**

1. On a card's row, click Refuse.
2. Pick the row's reason and type the row's words, leaving unpicked or empty what the row leaves so.
3. Read Refuse this card.

**Expected Results:**

* Refuse this card stays disabled.

### grade10-admin-grading-counter-US3-TC3-1: A refused card's fee never charges, and the till lists only the cards that go on

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-03

**Pre-conditions:**

* admin(holds `grading:operate`) is on <grade10 admin grading submission url> for a submission seeded at `booked` at Regular with three cards, as *Seeding a submission* says.
* At the desk, all three cards are checked and the agreement is sealed on the iPad; the fee is not yet taken.

**Steps:**

1. On the first card's row, click Refuse, choose The grader would not take it, type Corner crease along the top edge, and click Refuse this card.
2. Click Take payment.
3. Take the payment, then click Print 2 labels and check in.

**Expected Results:**

* The till lists one Grading Service line per remaining card only; the refused card is never charged.
* Step 3 labels, seals in and checks in the other two cards, the fee standing for those two alone.

### grade10-admin-grading-counter-US3-TC4-1: A refused line already paid is refunded at the till

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-03

**Pre-conditions:**

* admin(holds `grading:operate`) is on <grade10 admin grading submission url> for a submission seeded at `booked` at Regular with two cards, as *Seeding a submission* says.
* At the desk, both cards are checked, the agreement is sealed on the iPad and the fee is paid at the till with Take payment; the cards are not yet checked in.

**Test data:**

| Field | Value |
| --- | --- |
| Fee already paid for the card | 60000 minor units (HKD 600.00), Regular's fee |

**Steps:**

1. On the first card's row, click Refuse, choose The collector withdrew it and type Collector wants to keep this one for now.
2. Read the notice in the dialog.
3. Click Refuse this card.

**Expected Results:**

* The Notice adds a refund line of 60000 minor units (HKD 600.00) at the till, back the way it was paid.
* Step 3 takes the refund of 60000 minor units at the till against the submission, naming the card and the line it refunds.

### grade10-admin-grading-counter-US3-TC5-1: Refusing a submission's only remaining card is named on the Notice

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/handin.spec.ts`

**Pre-conditions:**

* admin(holds `grading:operate`) is on <grade10 admin grading submission url> for a submission seeded at `booked` with one card, as *Seeding a submission* says, its visit started with Start at the desk.
* The collector's last letter is noted, as *Reading a letter* says.

**Steps:**

1. On the card's row, click Refuse.
2. Choose The grader would not take it and type Corner crease along the top edge.
3. Read the notice in the dialog.
4. Click Refuse this card.
5. Read the submission's status word and its money.
6. Read the collector's last letter again.

**Expected Results:**

* The Notice states the submission has no card left to hand in.
* The submission is cancelled from `booked` at the desk and the collector is told there; no message is sent.
* The refused card is never charged.

---

## grade10-admin-grading-counter-US4: Operator hands the cards back against the code and the receipt

**As a** member of shop staff with a collector at the desk,
**I want** to take the pickup code and the name, glance at an ID above the threshold and keep nothing, settle the upcharge and the storage accrued at the till, tick each item as it is handed over and inspected, photograph each slab, and show the receipt on the iPad, a second hand-back closing a submission whose card the grader held,
**so that** the submission closes on a sealed receipt with nothing outstanding.

### grade10-admin-grading-counter-US4-TC1-1: The pickup code and the name are matched against the submission page

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-04

**Pre-conditions:**

* admin(holds `grading:operate`) is on <grade10 admin grading submission url> for a submission seeded at `ready`, as *Seeding a submission* says, its hand-back runbook at who is collecting.
* The collector is at the desk with the pickup code the seed answered, and gives the name on the submission.

**Steps:**

1. Enter the collector's pickup code in the code field.
2. Enter the name the collector gives.
3. Read the hand-back runbook.

**Expected Results:**

* Step 3 matches the code to the submission and the given name to the collector on the page.
* Step 3 opens the runbook at Settle, what is due.

### grade10-admin-grading-counter-US4-TC2-1: Above the threshold, the counter glances at an ID and keeps nothing

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-04

**Pre-conditions:**

* The ID glance threshold is written at 1000000 minor units (HKD 10,000.00), as *Writing a money setting* says, before the submission is seeded, since the agreement pins it.
* admin(holds `grading:operate`) is on <grade10 admin grading submission url> for a submission seeded at `ready` at Express with one card of the row's declared total, as *Seeding a submission* says, its hand-back runbook at who is collecting.
* The collector is at the desk with the pickup code and an identity document in the name on the submission.

**Test data:**

| Row | Declared total | Outcome |
| --- | --- | --- |
| A | 1200000 minor units (HKD 12,000.00), any total above the threshold | ID asked for |
| B | 1000001 minor units (HKD 10,000.01), one above the threshold | ID asked for |

**Steps:**

1. Enter the pickup code and the collector's name.
2. Glance at the collector's identity document, matching it to the name.
3. Mark the identity matched and continue.
4. At the end of the hand-back, read the sealed receipt on the Documents tab.

**Expected Results:**

* Step 1 shows the ID line.
* Step 4's receipt records that an ID was matched to the name, keeping no document number, no photograph and no document kind.

### grade10-admin-grading-counter-US4-TC3-1: At the threshold, the code and the name alone release the cards

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/handback.spec.ts`

**Pre-conditions:**

* The ID glance threshold is written as below, as *Writing a money setting* says, before the submission is seeded, since the agreement pins it.
* admin(holds `grading:operate`) is on <grade10 admin grading submission url> for a submission seeded at `ready` at Regular with one card of the declared total below, as *Seeding a submission* says, its hand-back runbook at who is collecting.
* The collector is at the desk with the pickup code.

**Test data:**

| Field | Value |
| --- | --- |
| ID glance threshold | 1000000 minor units (HKD 10,000.00) |
| Declared total | 1000000 minor units (HKD 10,000.00), exactly the threshold |

**Steps:**

1. Enter the pickup code and the collector's name.
2. Read the runbook's next step.

**Expected Results:**

* No ID line is offered at exactly the figure: above the threshold is more than the figure, never the figure itself. The matched code and name alone release the cards.

### grade10-admin-grading-counter-US4-TC4-1: A wrong pickup code is refused on the field

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/handback.spec.ts`

**Pre-conditions:**

* admin(holds `grading:operate`) is on <grade10 admin grading submission url> for a submission seeded at `ready`, as *Seeding a submission* says, its hand-back runbook at who is collecting.

**Test data:**

| Field | Value |
| --- | --- |
| Code given | any four digits but the pickup code the seed answered |

**Steps:**

1. Type the code given in the pickup code field.
2. Submit it.

**Expected Results:**

* The field refuses the code; nothing releases.

### grade10-admin-grading-counter-US4-TC5-1: The upcharge and the storage accrued are settled at the till before anything is handed over

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-04

**Pre-conditions:**

* admin(holds `grading:operate`) is on <grade10 admin grading submission url> for a `ready` submission owing the upcharge and the storage below, and has matched the collector's code and name at who is collecting.
* A card moved from Regular to Express at receiving owes the upcharge, as *Receiving with an exception* says; the storage accrues only past day 90 of ready, so a submission owing both is a mocked state.

**Test data:**

| Field | Value |
| --- | --- |
| Upcharge due | 60000 minor units (HKD 600.00), Express's fee less Regular's |
| Storage accrued | 12000 minor units (HKD 120.00) |

**Steps:**

1. Read the Settle step.
2. Open Hand over and inspect before taking payment.
3. Click Take payment and take the payment at the till.

**Expected Results:**

* Step 1 lists the upcharge and storage lines separately, totalling 72000 minor units (HKD 720.00).
* Step 2 ticks nothing and names 72000 minor units still due.
* Step 3 takes payment before any item can be ticked over.

### grade10-admin-grading-counter-US4-TC6-1: Nothing due ticks the Settle step through without opening the till

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/handback.spec.ts`

**Pre-conditions:**

* admin(holds `grading:operate`) is on <grade10 admin grading submission url> for a submission seeded at `ready` with the default anchors, as *Seeding a submission* says, so no upcharge and no storage are due.
* The collector's code and name are matched at who is collecting.

**Steps:**

1. Read the Settle step.

**Expected Results:**

* The step is ticked with nothing to take; Hand over and check proceeds without opening the till.

### grade10-admin-grading-counter-US4-TC7-1: Each item is ticked as handed over and inspected, each slab photographed

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/handback.spec.ts`

**Pre-conditions:**

* A submission of three cards is received with the third returned ungraded, as *Receiving with an exception* says, so it is `ready` with two slabs and one raw card.
* admin(holds `grading:operate`) is on <grade10 admin grading submission url> for it, its hand-back runbook past who is collecting and Settle, nothing being due.

**Steps:**

1. On the first slab's row, tick Handed over.
2. Photograph the slab.
3. On the raw card's row, tick Handed over.
4. Reload the collector's page at <grade10 grading submission url>.

**Expected Results:**

* Steps 1 and 3 tick each item as inspected.
* Step 2 attaches one photograph to the slab; the raw card takes no photograph.
* Step 4 shows the slab's photograph and each item as handed over.

### grade10-admin-grading-counter-US4-TC8-1: The receipt is refused while anything is due or an item is unticked

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-04

**Pre-conditions:**

* admin(holds `grading:operate`) is on <grade10 admin grading submission url> for a submission seeded at `ready` with two cards and the default anchors, as *Seeding a submission* says, so nothing is due.
* On its hand-back runbook the code and name are matched, Settle is ticked, and the first item is ticked Handed over; the second is not.

**Steps:**

1. Read the Sign the receipt step.

**Expected Results:**

* The step names the unticked item as the reason the receipt cannot be minted.

### grade10-admin-grading-counter-US4-TC9-1: Closing on the sealed receipt moves the submission from Ready to Collected

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/handback.spec.ts`

**Pre-conditions:**

* admin(holds `grading:operate`) is on <grade10 admin grading submission url> for a submission seeded at `ready` with the default anchors, as *Seeding a submission* says, nothing held by the grader.
* On its hand-back runbook every item is ticked Handed over and the receipt is sealed on the iPad.
* The collector's page for the submission is open at <grade10 grading submission url>.

**Steps:**

1. Click Hand over.
2. Read the submission's status word.
3. Reload the collector's page.

**Expected Results:**

* Step 1: the packet goes over the counter.
* Step 2 reads Back with you: the submission moved `ready → collected`.
* Step 3: the record stays on the collector's page.

### grade10-admin-grading-counter-US4-TC10-1: A second hand-back closes a submission whose card the grader held

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
* **Trace:** grade10-admin-grading-counter-US-04

**Pre-conditions:**

* A submission of three cards is received with one card held by the grader, as *Receiving with an exception* says, and its first hand-back over the other two is closed on a sealed receipt, leaving it `ready`.
* The held card has since come back and is received at the shop.
* admin(holds `grading:operate`) is on <grade10 admin grading submission url> for it, and the collector is at the desk with the pickup code.

**Steps:**

1. Open the submission's second hand-back runbook.
2. Enter the pickup code and the collector's name.
3. Settle, then tick Handed over on the one item.
4. Seal its receipt on the iPad and click Hand over.

**Expected Results:**

* Only the one held item is offered.
* The runbook opens at who is collecting, taking the code and the name again, and the ID glance where the declared total is above the threshold.
* Closing it moves the submission to `collected` on its own receipt, separate from the first.

### grade10-admin-grading-counter-US4-TC11-1: A card the grader still holds cannot be ticked and is named on the receipt

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
* **Trace:** grade10-admin-grading-counter-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/handback.spec.ts`

**Pre-conditions:**

* A submission of three cards is received with the third held by the grader, as *Receiving with an exception* says, so it is `ready`.
* admin(holds `grading:operate`) is on <grade10 admin grading submission url> for it, its hand-back runbook past who is collecting and Settle, nothing being due.

**Steps:**

1. Read the Hand over and inspect step.
2. Attempt to tick Handed over on the held card's row.
3. Tick Handed over on the other two, seal the receipt on the iPad and click Hand over.
4. Read the sealed receipt on the Documents tab and the submission's status word.

**Expected Results:**

* Steps 1 and 2: the held card's row reads as still out and cannot be ticked.
* Step 4: the sealed receipt names that card as still with the grader, and the submission stays `ready`.

### grade10-admin-grading-counter-US4-TC12-1: A wrong pickup code is refused as often as it is typed

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-04

**Pre-conditions:**

* admin(holds `grading:operate`) is on <grade10 admin grading submission url> for a submission seeded at `ready`, as *Seeding a submission* says, its hand-back runbook at who is collecting.

**Test data:**

| Field | Value |
| --- | --- |
| Wrong codes | three different four-digit codes, none the pickup code the seed answered |

**Steps:**

1. Enter the first wrong code in the pickup code field.
2. Enter the second wrong code.
3. Enter the third wrong code.
4. Read the runbook's who is collecting step.
5. Open the submission's Timeline tab.

**Expected Results:**

* Steps 1 to 3 are each refused on the field, and nothing closes the field after the third.
* Step 4 offers the ID glance against the collector's own name instead.
* Step 5 lists each of the three refusals.

---

## grade10-admin-grading-counter-US5: Operator releases the cards to the named person or turns anyone else away

**As a** member of shop staff,
**I want** the hand-back step to read the person named on the submission page and the receipt to record that they collected, and the counter to refuse anyone who is neither the collector nor that person, code or no code, with no override to press,
**so that** a named person leaves with the cards and a forwarded email never walks out with somebody's slabs while the collector can name them from their phone.

### grade10-admin-grading-counter-US5-TC1-1: A named person is read from the page and recorded on the receipt as who collected

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/handback.spec.ts`

**Pre-conditions:**

* A submission is seeded at `ready`, as *Seeding a submission* says, and its collector has named a pickup person on their page at <grade10 grading submission url>.
* admin(holds `grading:operate`) is on <grade10 admin grading submission url> for it, its hand-back runbook at who is collecting.
* The named person is at the desk with the pickup code.

**Test data:**

| Field | Value |
| --- | --- |
| Named person | Chan Tai Man, any full name other than the collector's |

**Steps:**

1. Enter the pickup code and the named person's name.
2. Read who the runbook matches.
3. Work the hand-back to the end: Settle, tick Handed over on each item, seal the receipt on the iPad and click Hand over.
4. Read the sealed receipt on the Documents tab.

**Expected Results:**

* Step 2 matches the named person, not the collector.
* Step 4's receipt records that person, not the collector, as who collected.

### grade10-admin-grading-counter-US5-TC2-1: Somebody who is neither the collector nor the named person is turned away, code or no code

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/handback.spec.ts`

**Pre-conditions:**

* A submission is seeded at `ready`, as *Seeding a submission* says, and its collector has named a pickup person on their page.
* admin(holds `grading:operate`) is on <grade10 admin grading submission url> for it, its hand-back runbook at who is collecting.
* A third person, neither the collector nor the named person, is at the desk with the correct pickup code.

**Steps:**

1. Enter the pickup code the person gives.
2. Enter the name the person gives.
3. Read the who is collecting step.

**Expected Results:**

* The name matches neither the collector nor the named person; the runbook turns them away even though the code is correct, offers no override, and says the collector can name a person from their own page.

### grade10-admin-grading-counter-US5-TC3-1: No release override is offered to any grant

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-05

**Pre-conditions:**

* A submission is seeded at `ready`, as *Seeding a submission* says.
* admin(holds `grading:operate` and `grading:approve`) is on <grade10 admin grading submission url> for it, its hand-back runbook at who is collecting.
* A person who is not the collector is at the desk with the correct pickup code, and has been turned away.

**Steps:**

1. Read every control on the who is collecting step and the rest of the runbook for a way to release the cards anyway.

**Expected Results:**

* No override control is offered, including to the `grading:approve` holder.

### grade10-admin-grading-counter-US5-TC4-1: The collector renames the pickup person from their own device before hand-back

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/handback.spec.ts`

**Pre-conditions:**

* A submission is seeded at `ready`, as *Seeding a submission* says, naming no pickup person.
* The collector has its page open at <grade10 grading submission url>.
* admin(holds `grading:operate`) has <grade10 admin grading submission url> for it open at the hand-back runbook.

**Test data:**

| Field | Value |
| --- | --- |
| Named person | Chan Tai Man, any full name other than the collector's |

**Steps:**

1. As the collector, name the person on the submission page.
2. As the admin, reload the hand-back runbook.

**Expected Results:**

* Step 2 shows the newly named person as who the hand-back step will match.

### grade10-admin-grading-counter-US5-TC5-1: The collector remains an accepted pickup identity alongside a named person

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/handback.spec.ts`

**Pre-conditions:**

* A submission is seeded at `ready`, as *Seeding a submission* says, and its collector has named a pickup person on their page.
* admin(holds `grading:operate`) is on <grade10 admin grading submission url> for it, its hand-back runbook at who is collecting.
* The collector is at the desk with the pickup code.

**Steps:**

1. Enter the pickup code and the collector's own name.
2. Read who the runbook matches.

**Expected Results:**

* The collector matches and is released, even though a different person is also named on the page.

---

## grade10-admin-grading-counter-US6: Operator moves a slab into a vault case at hand-back

**As a** member of shop staff asked to keep a slab,
**I want** to open a vault case for it from the hand-back step once the balance is settled, the receipt saying the card went to the vault,
**so that** the collector leaves with the case open and no second visit.

### grade10-admin-grading-counter-US6-TC1-1: Open a vault case is disabled until the balance is settled

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-06

**Pre-conditions:**

* A submission of one card is received with that card moved from Value to Regular, as *Receiving with an exception* says, so it is `ready` owing an upcharge of 35000 minor units (HKD 350.00), unpaid.
* admin(holds `grading:operate`) is on <grade10 admin grading submission url> for it, its hand-back runbook past who is collecting, the upcharge not taken.

**Steps:**

1. On the slab's row, click Vault instead.
2. Read Open a vault case.

**Expected Results:**

* Open a vault case is disabled, the unpaid upcharge named on the step as the reason.

### grade10-admin-grading-counter-US6-TC2-1: A slab opens a vault case from the same hand-back step once settled

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/handback.spec.ts`

**Pre-conditions:**

* A submission of one card is seeded at `ready` with the default anchors, as *Seeding a submission* says, so nothing is due.
* admin(holds `grading:operate`) is on <grade10 admin grading submission url> for it, its hand-back runbook past who is collecting and Settle.
* The collector is at the desk.

**Steps:**

1. On the slab's row, click Vault instead, then Open a vault case.
2. Open the case with the collector, as the vault's own form asks.
3. Read the vault case the step names.

**Expected Results:**

* The vault case opens under the collector's account, on the same visit, with no second appointment.

### grade10-admin-grading-counter-US6-TC3-1: The hand-back receipt names a vaulted card as gone to the vault

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/handback.spec.ts`

**Pre-conditions:**

* A submission of two cards is seeded at `ready` with the default anchors, as *Seeding a submission* says, so nothing is due.
* admin(holds `grading:operate`) is on <grade10 admin grading submission url> for it, its hand-back runbook past who is collecting and Settle.

**Steps:**

1. On the first slab's row, click Vault instead and open its vault case with the collector.
2. On the second slab's row, tick Handed over and photograph it.
3. Seal the receipt on the iPad and click Hand over.
4. Read the sealed receipt on the Documents tab.

**Expected Results:**

* The receipt names the vaulted card as gone to the vault and the other item as collected in person.
* The other item ticks and hands over independently of the vaulted slab.

### grade10-admin-grading-counter-US6-TC4-1: Vaulting one item does not block ticking the rest of the submission's items

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-06

**Pre-conditions:**

* A submission of two cards is received with the second returned ungraded, as *Receiving with an exception* says, so it is `ready` with one slab and one raw card and nothing due.
* admin(holds `grading:operate`) is on <grade10 admin grading submission url> for it, its hand-back runbook past who is collecting and Settle.

**Steps:**

1. On the slab's row, click Vault instead and open its vault case with the collector.
2. On the raw card's row, tick Handed over.

**Expected Results:**

* The raw card ticks and hands over independently of the vaulted slab.

---

## grade10-admin-grading-counter-US7: Operator withdraws a card the collector asked back

**As a** member of shop staff at Handed in,
**I want** to withdraw one card until the batch closes, refunding its POS line and releasing it against a hand-back receipt,
**so that** the card leaves the intake bag with a record and the rest go on.

### grade10-admin-grading-counter-US7-TC1-1: A card is withdrawn at Handed in before the batch closes

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-07

**Pre-conditions:**

* A submission of three cards at Regular is handed in at the desk this week as a walk-in at <grade10 admin grading walk-in url>, its fee paid at the till, so it is `checked_in` in a batch still open until its cut-off. A seeded `checked_in` submission will not do: its batch closes at the hand-in.
* admin(holds `grading:operate`) is on the Cards tab of <grade10 admin grading submission url> for it.

**Test data:**

| Field | Value |
| --- | --- |
| Card's paid fee | 60000 minor units (HKD 600.00), Regular's fee |

**Steps:**

1. On the first card's row, click Withdraw.
2. Confirm the withdrawal in the dialog.
3. Read the card rows.
4. Open the Money tab and read the refund line.
5. Read the receipt the withdrawal offers, and the Documents tab.
6. On <grade10 admin grading batches url>, open the submission's batch and read its cards.

**Expected Results:**

* Step 3: the card is marked withdrawn and released; the other two cards stay checked in unaffected.
* Step 4: a refund of 60000 minor units (HKD 600.00) is recorded at the till, back the way the fee was paid.
* Step 5: the card is released against its own withdrawal receipt naming that one card, separate from the submission's eventual full receipt.
* Step 6: the remaining two cards stay in the batch and go on to the grader.

### grade10-admin-grading-counter-US7-TC2-1: Withdrawing refunds the card's own POS line

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-07

**Pre-conditions:**

* A submission of two cards at Regular is handed in at the desk this week as a walk-in at <grade10 admin grading walk-in url>, its fee paid at the till, so it is `checked_in` in a batch still open until its cut-off.
* admin(holds `grading:operate`) is on the Cards tab of <grade10 admin grading submission url> for it.

**Test data:**

| Field | Value |
| --- | --- |
| Card's paid fee | 60000 minor units (HKD 600.00), Regular's fee |

**Steps:**

1. On the first card's row, click Withdraw and confirm in the dialog.
2. Open the Money tab and read the refund line.

**Expected Results:**

* A refund of 60000 minor units (HKD 600.00) is recorded at the till, back the way the fee was paid.

### grade10-admin-grading-counter-US7-TC3-1: The withdrawal is offered against a hand-back receipt naming that one card

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-07

**Pre-conditions:**

* A submission of two cards is handed in at the desk this week as a walk-in at <grade10 admin grading walk-in url>, so it is `checked_in` in a batch still open until its cut-off.
* admin(holds `grading:operate`) is on the Cards tab of <grade10 admin grading submission url> for it.

**Steps:**

1. On the first card's row, click Withdraw and confirm in the dialog.
2. Read the receipt the withdrawal offers, and the Documents tab.

**Expected Results:**

* The card is released against its own withdrawal receipt naming that one card, separate from the submission's eventual full receipt.

### grade10-admin-grading-counter-US7-TC4-1: Withdraw is absent once the batch has closed

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-07

**Pre-conditions:**

* A submission is seeded at `checked_in`, as *Seeding a submission* says; its batch closes at the hand-in.
* admin(holds `grading:operate`) is on <grade10 admin grading submission url> for it.

**Steps:**

1. Click the Cards tab.
2. Read each card row's actions.

**Expected Results:**

* Withdraw is not offered on any card row.

### grade10-admin-grading-counter-US7-TC5-1: Withdrawing one card leaves the rest of the submission going on to the grader

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-07

**Pre-conditions:**

* A submission of three cards is handed in at the desk this week as a walk-in at <grade10 admin grading walk-in url>, so it is `checked_in` in a batch still open until its cut-off.
* admin(holds `grading:operate`) is on the Cards tab of <grade10 admin grading submission url> for it.

**Steps:**

1. On the first card's row, click Withdraw and confirm in the dialog.
2. Read the other two card rows.
3. On <grade10 admin grading batches url>, open the submission's batch and read its cards.

**Expected Results:**

* The remaining two cards stay checked in, unaffected, and go to the grader in the batch.

---

## grade10-admin-grading-counter-US8: Approver waives an upcharge with a second person

**As a** member of shop staff holding `grading:approve`,
**I want** to waive the difference the sheet charged with a reason and a second approve holder who is not me, once the cards are back,
**so that** nobody can write off money alone and the collector's due drops to nothing before they collect.

### grade10-admin-grading-counter-US8-TC1-1: An upcharge is waived with a reason and a second approve holder

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-08

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/uncollected.spec.ts`

**Pre-conditions:**

* A submission of one card is received with that card moved from Regular to Express, as *Receiving with an exception* says, so it is `ready` owing the upcharge below, unpaid.
* admin A(holds `grading:approve`) is on the Money tab of <grade10 admin grading submission url> for it.
* admin B(holds `grading:approve`) has the same submission's Money tab open in their own console.

**Test data:**

| Field | Value |
| --- | --- |
| Upcharge | 60000 minor units (HKD 600.00), Express's fee less Regular's |
| Reason | Grader moved the level on its own reading; goodwill |

**Steps:**

1. As admin A, click Waive the upcharge.
2. Type the reason.
3. Click Ask for approval.
4. As admin B, reload the Money tab and click Approve on the request waiting on a second person.

**Expected Results:**

* Step 3 leaves the due as it was and shows the request waiting for a second approve holder.
* Step 4 records the waiver against the card, with the reason, admin A as the recorder and admin B as the approver.
* The collector's due drops by 60000 minor units (HKD 600.00) before collection.

### grade10-admin-grading-counter-US8-TC2-1: Waive is absent until the cards are back

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-08

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/uncollected.spec.ts`

**Pre-conditions:**

* A submission is seeded at the row's status, as *Seeding a submission* says, so its cards are not yet back.
* admin(holds `grading:approve`) is on <grade10 admin grading submission url> for it.

**Test data:**

| Row | Status | Outcome |
| --- | --- | --- |
| A | `sent`, the cards with the grader | Waive the upcharge absent |
| B | `checked_in`, the cards at the shop before shipping | Waive the upcharge absent |
| C | `graded`, the grades in and the cards not yet back | Waive the upcharge absent |

**Steps:**

1. Click the Money tab.
2. Read its acts for Waive the upcharge.

**Expected Results:**

* The act is absent; nothing offers to write off before the cards are back.

### grade10-admin-grading-counter-US8-TC3-1: The recorder cannot approve their own waiver

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-grading-counter-US-08

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/uncollected.spec.ts`

**Pre-conditions:**

* A submission of one card is received with that card moved from Regular to Express, as *Receiving with an exception* says, so it is `ready` owing an upcharge of 60000 minor units (HKD 600.00).
* admin A(holds `grading:approve`) has asked for the upcharge's waiver on its Money tab at <grade10 admin grading submission url>, with a reason, and nobody has approved it.

**Steps:**

1. As admin A, send the approval of admin A's own request directly, outside the console, which offers the recorder no Approve on their own request.
2. As admin A, reload the Money tab.

**Expected Results:**

* The approval is refused by name: the recorder cannot approve their own request.
* No waiver is written and the due is unchanged.

### grade10-admin-grading-counter-US8-TC4-1: A waiver refuses a second person who does not hold `grading:approve`

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-grading-counter-US-08

**Pre-conditions:**

* A submission of one card is received with that card moved from Regular to Express, as *Receiving with an exception* says, so it is `ready` owing an upcharge of 60000 minor units (HKD 600.00).
* admin A(holds `grading:approve`) has asked for the upcharge's waiver on its Money tab at <grade10 admin grading submission url>, with a reason, and nobody has approved it.
* admin C(holds `grading:operate`, not `grading:approve`) is signed in to their own console.
* admin C's grants are mocked to `grading:read` and `grading:operate` without `grading:approve`, since no shipped role holds `grading:operate` without `grading:approve`.

**Steps:**

1. As admin C, on admin C's own console, send the approval of admin A's request.
2. As admin A, reload the Money tab.

**Expected Results:**

* The approval is refused by name, naming `grading:approve`.
* No waiver is written and the due is unchanged.

### grade10-admin-grading-counter-US8-TC5-1: A waived upcharge is filed under the submission on the audit chain

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** security
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-08

**Pre-conditions:**

* A submission of one card is received with that card moved from Regular to Express, as *Receiving with an exception* says, so it is `ready` owing an upcharge of 60000 minor units (HKD 600.00).
* admin A(holds `grading:approve`) has asked for the upcharge's waiver on its Money tab at <grade10 admin grading submission url>, with a reason.
* admin B(holds `grading:approve`) has the same Money tab open in their own console.

**Steps:**

1. As admin B, click Approve on the request waiting on a second person.
2. On <grade10 admin audit url>, pull the trail for the submission's id.

**Expected Results:**

* The waiver, its reason and both admins' names appear as an event filed under the submission.

---

## grade10-admin-grading-counter-US9: Approver records a payout for a card that did not come back

**As a** member of shop staff holding `grading:approve`,
**I want** to record a payout at the declared value, with the fee refunded, for a card not returned or damaged, on its own record with a second approve holder, at the till or by transfer, inside the window, and to reverse it on that record if the card turns up,
**so that** the collector is paid without waiting on the shop's claim and the money book shows what went out and why.

### grade10-admin-grading-counter-US9-TC1-1: A payout is recorded at the declared value with the fee refunded, by either route

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-09

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/handback.spec.ts`

**Pre-conditions:**

* A submission of one card at Regular, declared at the row's value, is received today with that card not returned, as *Receiving with an exception* says.
* admin A(holds `grading:approve`) is on the Money tab of <grade10 admin grading submission url> for it.
* admin B(holds `grading:approve`) has the same Money tab open in their own console.

**Test data:**

| Row | Route | Declared value | Fee refunded | Reference |
| --- | --- | --- | --- | --- |
| A | Till | 300000 minor units (HKD 3,000.00) | 60000 minor units (HKD 600.00) | none |
| B | Bank transfer | 300000 minor units (HKD 3,000.00) | 60000 minor units (HKD 600.00) | TRF-0001, any reference the bank gives |

**Steps:**

1. As admin A, click the act that records a payout on the not-returned card.
2. Choose the row's route and type the reason, Lost by the grader in transit.
3. Click Ask for approval.
4. As admin B, reload the Money tab and click Approve on the request waiting on a second person.

**Expected Results:**

* Step 3 records no payout and no refund.
* Step 4 records the row's declared value and refunds the row's fee, on its own record with admin A as the recorder and admin B as the approver, by the row's route.
* Row B's record carries the transfer's reference.

### grade10-admin-grading-counter-US9-TC2-1: A payout past its settlement window is marked on the dialog

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-09

**Pre-conditions:**

* A submission holds a card recorded not returned in a batch received at the shop 15 days ago. Receiving happens now, so a batch received 15 days back is a mocked state.
* admin(holds `grading:approve`) is on the Money tab of <grade10 admin grading submission url> for it.

**Test data:**

| Field | Value |
| --- | --- |
| Settlement window | 14 days from the batch's received day |
| Batch received | 15 days ago, one day past the window |

**Steps:**

1. Click the act that records a payout on the not-returned card.
2. Choose the till and type the reason.
3. Click Ask for approval.

**Expected Results:**

* The dialog marks that the window has passed.
* Step 3 asks for the payout although the window has passed.

### grade10-admin-grading-counter-US9-TC3-1: A payout is reversed on its own record when the card turns up

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-09

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/handback.spec.ts`

**Pre-conditions:**

* A submission of one card is received with that card not returned, as *Receiving with an exception* says, and its payout is recorded by the till: asked for by admin A and approved by admin B.
* The grader has since located the card.
* admin A(holds `grading:approve`) is on the Money tab of <grade10 admin grading submission url> for it; admin B(holds `grading:approve`) has the same tab open in their own console.

**Steps:**

1. As admin A, click Reverse the payout on the payout's record.
2. Type the reason, Card located by the grader, and click Ask for approval.
3. As admin B, reload the Money tab and click Approve on the request waiting on a second person.
4. Read the payout's record and the Cards tab.

**Expected Results:**

* Step 4 shows the reversal written on the same record, the payout itself left as it was, and the card back on the submission.

### grade10-admin-grading-counter-US9-TC4-1: The recorder cannot approve their own payout

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-grading-counter-US-09

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/handback.spec.ts`

**Pre-conditions:**

* A submission of one card is received with that card not returned, as *Receiving with an exception* says.
* admin A(holds `grading:approve`) has asked for its payout on the Money tab of <grade10 admin grading submission url>, with a reason, and nobody has approved it.

**Steps:**

1. As admin A, send the approval of admin A's own request directly, outside the console, which offers the recorder no Approve on their own request.
2. As admin A, reload the Money tab.

**Expected Results:**

* The approval is refused by name: the recorder cannot approve their own request.
* No payout and no refund is written.

### grade10-admin-grading-counter-US9-TC5-1: A payout is filed under the submission on the audit chain

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** security
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-09

**Pre-conditions:**

* A submission of one card is received with that card not returned, as *Receiving with an exception* says.
* admin A(holds `grading:approve`) has asked for its payout by the till on the Money tab of <grade10 admin grading submission url>, with a reason.
* admin B(holds `grading:approve`) has the same Money tab open in their own console.

**Steps:**

1. As admin B, click Approve on the request waiting on a second person.
2. On <grade10 admin audit url>, pull the trail for the submission's id.

**Expected Results:**

* The payout, its route, its amount and both admins' names appear as an event filed under the submission.

### grade10-admin-grading-counter-US9-TC6-1: A payout still owed past its window badges its row on the queue

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-09

**Pre-conditions:**

* admin(holds `grading:read`) is on <grade10 admin grading queue url>.
* `grading.settlement_days` stands at 14, as seeded.
* A payout is owed on a card recorded not returned in a batch received at the shop 15 days ago, and nothing is paid out. Receiving happens now, so a batch received 15 days back is a mocked state.

**Steps:**

1. Navigate to <grade10 admin grading queue url>.
2. Click Ready and read the submission's row.

**Expected Results:**

* The row badges the payout as past its window, derived at the read from the batch's received day.

### grade10-admin-grading-counter-US9-TC7-1: A card already carrying a live payout refuses a second

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
* **Trace:** grade10-admin-grading-counter-US-09

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/handback.spec.ts`

**Pre-conditions:**

* A submission of one card is received with that card not returned, as *Receiving with an exception* says, and its payout is recorded by the till: asked for by admin A and approved by admin B, and not reversed.
* admin(holds `grading:approve`) is on the Money tab of <grade10 admin grading submission url> for it.

**Steps:**

1. Look on the Money tab for the act that records a payout on the same card.
2. Ask for a second payout on that card, from the tab where it is offered, or directly, outside the console, where it is not.
3. Read the payout's record.

**Expected Results:**

* The second payout is refused by name, naming the payout the card already carries.
* Nothing is written and the first record is untouched.

### grade10-admin-grading-counter-US9-TC8-1: A payout request nobody has approved moves no money

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-09

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/handback.spec.ts`

**Pre-conditions:**

* A submission of one card is received with that card not returned, as *Receiving with an exception* says.
* admin A(holds `grading:approve`) is on the Money tab of <grade10 admin grading submission url> for it; nobody else has opened it.

**Steps:**

1. Click the act that records a payout on the not-returned card, choose the till and type the reason, Lost by the grader in transit.
2. Click Ask for approval.
3. Read the Money tab, then click the Timeline tab and read it.

**Expected Results:**

* No payout and no fee refund appear on the Money tab; the card is still owed its payout.
* The request shows as waiting for a second approve holder.
* The timeline carries no payout.

---

## grade10-admin-grading-counter-US10: Operator answers a collector from one submission's tabs

**As a** member of shop staff opening a submission,
**I want** per card the intake id, the declared value, the level and the one it was moved to, the grade and cert in the grader's words and the outcome, the money as paid, due, refunded and paid out with the till's references, and the timeline with the grader's stages in its words,
**so that** the till and the record say the same figure and I can answer a collector on the phone from one screen.

### grade10-admin-grading-counter-US10-TC1-1: The Cards tab reads intake id, declared value, level, grade and outcome per card

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-10

**Pre-conditions:**

* A submission of two cards at Regular is received with the first card moved to Express, as *Receiving with an exception* says, the grades entered in the grader's words; it reads Ready to collect, its cards back.
* admin(holds `grading:read`) is on <grade10 admin grading submission url> for it.

**Test data:**

| Field | Value |
| --- | --- |
| Moved-up card's grade | PSA 10 GEM MT, as the grader wrote it |

**Steps:**

1. Click the Cards tab.
2. Read the moved-up card's row.

**Expected Results:**

* The row shows the intake id, the declared value, the original level and the level moved to, the grade in the grader's words (for example `PSA 10 GEM MT`) and its cert, and its outcome.

### grade10-admin-grading-counter-US10-TC2-1: The Money tab shows paid, due, refunded and paid out with the till's own references

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-10

**Pre-conditions:**

* A `ready` submission of four cards at Regular, its fee paid at hand-in, owes an upcharge on one card moved to Express and storage accrued. The upcharge comes from *Receiving with an exception*, and the storage only past day 90 of ready, so a submission owing both is a mocked state.
* admin(holds `grading:read`) is on <grade10 admin grading submission url> for it.

**Test data:**

| Field | Value |
| --- | --- |
| Paid at hand-in | 240000 minor units (HKD 2,400.00), four cards at Regular's 60000 |
| Upcharge due | 60000 minor units (HKD 600.00), Express's fee less Regular's |
| Storage accrued | 12000 minor units (HKD 120.00) |

**Steps:**

1. Click the Money tab.

**Expected Results:**

* Paid at hand-in shows 240000 minor units (HKD 2,400.00) over four lines, each naming the till's reference and its card.
* To settle shows the upcharge and storage lines separately, totalling 72000 minor units (HKD 720.00).

### grade10-admin-grading-counter-US10-TC3-1: The till and the record say the same figure

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-10

**Pre-conditions:**

* A submission of four cards at Regular is handed in at the desk, its fee paid at the till with Take payment.
* admin(holds `grading:read`) is on <grade10 admin grading submission url> for it, and can read the till's orders.

**Steps:**

1. Click the Money tab and note the paid amount and the till's reference.
2. In the till, open the order by that reference and read its total.

**Expected Results:**

* The paid amount on the Money tab matches the POS order's total exactly.

### grade10-admin-grading-counter-US10-TC4-1: The header answers the phone with what is due, what came back ungraded, and the batch

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-10

**Pre-conditions:**

* A submission of three cards at Regular is received with the first card moved to Express and the second returned ungraded, as *Receiving with an exception* says, so it owes an upcharge and has one card back ungraded, in its batch.
* admin(holds `grading:read`) is on <grade10 admin grading submission url> for it.

**Steps:**

1. Read the header.

**Expected Results:**

* The header shows the summary, the status word, declared in total, the upcharge to settle, the ungraded card, and the batch it is in.

### grade10-admin-grading-counter-US10-TC5-1: The collector's email, phone and click-to-chat templates are reachable from the header

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-10

**Pre-conditions:**

* A submission is seeded at `ready`, as *Seeding a submission* says, its collector having given an email and a phone number.
* admin(holds `grading:read`) is on <grade10 admin grading submission url> for it, on a device that opens WhatsApp.

**Steps:**

1. Read the collector block in the header.
2. Click one of the WhatsApp templates.

**Expected Results:**

* Step 1 shows the email and phone with a WhatsApp click-to-chat entry.
* Step 2 opens the chat pre-filled with a staff-pressed template, never sent automatically.

### grade10-admin-grading-counter-US10-TC6-1: A submission id that does not resolve shows the console's not-found line

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-10

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/handback.spec.ts`

**Pre-conditions:**

* admin(holds `grading:read`) is signed in to the console.

**Test data:**

| Field | Value |
| --- | --- |
| Submission id | gs_dev_nosuchsubmission, any id no submission holds |

**Steps:**

1. Navigate to <grade10 admin grading submission url> with the submission id.

**Expected Results:**

* The console's not-found line shows instead of a blank or broken panel.

---

## grade10-admin-grading-counter-US11: Operator hands a document over only when the counter is ready for it

**As a** member of shop staff,
**I want** the agreement to be mintable only once every card is checked and the receipt only once the balance is settled and every item is ticked, one document each time on a 30-minute link, and to show any sealed document on the iPad, copy its link or send it or the grades email again,
**so that** nothing is handed over to sign that the shop could not be held to, and a collector who lost an email gets the same sealed copy.

### grade10-admin-grading-counter-US11-TC1-1: One document is live on the link at a time, for 30 minutes

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-11

**Pre-conditions:**

* admin(holds `grading:operate`) is on <grade10 admin grading submission url> for a submission seeded at `booked`, as *Seeding a submission* says, every card checked at the desk and the agreement not sealed.
* The shop's iPad is at the desk with a browser open.

**Steps:**

1. Click Show on iPad.
2. Read the link's timer on the Sign the agreement step.
3. Wait 31 minutes without signing, then reload the link on the iPad.
4. Mint the agreement again and read the step.

**Expected Results:**

* Step 2 shows a 30-minute countdown.
* Step 3 shows the link expired; step 4 issues a new one, never two live links at once.

### grade10-admin-grading-counter-US11-TC2-1: Minting is refused in production while a fact the document prints is unset

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-11

**Pre-conditions:**

* The console runs in production, where the custodian's registered name, a fact the agreement prints, is unset. A stack outside production does not refuse, so this is a manipulated environment.
* admin(holds `grading:operate`) is on <grade10 admin grading submission url> for a `booked` submission, every card checked at the desk.

**Steps:**

1. Click Show on iPad on the Sign the agreement step.

**Expected Results:**

* The seal refuses, naming the unset fact; nothing is offered to sign.

### grade10-admin-grading-counter-US11-TC3-1: A sealed document reopens on the iPad from the Documents tab

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-11

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/handback.spec.ts`

**Pre-conditions:**

* A submission is seeded at `collected`, as *Seeding a submission* says, so its agreement, its intake receipt and its hand-back receipt are sealed.
* admin(holds `grading:operate`) is on <grade10 admin grading submission url> for it, and the shop's iPad is at the desk.

**Steps:**

1. Click the Documents tab and note the agreement's fingerprint.
2. Click Show on iPad on the agreement.
3. Read the fingerprint of the copy shown on the iPad.

**Expected Results:**

* The tab lists the agreement, the intake receipt and the hand-back receipt, each with its fingerprint.
* Showing it again reopens the same sealed copy, not a new mint.

### grade10-admin-grading-counter-US11-TC4-1: A sealed document's link is copied instead of shown on iPad

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-11

**Pre-conditions:**

* admin(holds `grading:operate`) is on <grade10 admin grading submission url> for a submission seeded at `booked`, as *Seeding a submission* says, every card checked at the desk and the agreement not sealed.

**Steps:**

1. On the Sign the agreement step, click Copy link.
2. Paste the clipboard into a new browser tab.

**Expected Results:**

* The link copies to the clipboard for handing to the collector another way, on the same 30-minute rule.

### grade10-admin-grading-counter-US11-TC5-1: Send again resends a sealed document, or the grades email, unchanged

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-11

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/handback.spec.ts`

**Pre-conditions:**

* A submission is seeded at `collected`, as *Seeding a submission* says, so its hand-back receipt is sealed and sent with the letter at collection; the collector says they lost that email.
* admin(holds `grading:operate`) is on the Documents tab of <grade10 admin grading submission url> for it, and has noted the hand-back receipt's fingerprint.

**Steps:**

1. Click Send again on the hand-back receipt.
2. Read the collector's last letter, as *Reading a letter* says, and its attached receipt's fingerprint.

**Expected Results:**

* The signed document is re-sent to the collector's email as the same sealed copy, with no re-mint.

### grade10-admin-grading-counter-US11-TC6-1: Before hand-in, the Documents tab shows nothing sealed

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-11

**Pre-conditions:**

* A submission is seeded at `booked`, as *Seeding a submission* says, and no card is checked.
* admin(holds `grading:read`) is on <grade10 admin grading submission url> for it.

**Steps:**

1. Click the Documents tab.

**Expected Results:**

* The tab shows nothing sealed yet.

### grade10-admin-grading-counter-US11-TC7-1: A failed send is flagged with its reason and Send again offered

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-11

**Pre-conditions:**

* A submission's grades email has run out of attempts. The stack's mail never fails on its own, so a letter out of attempts is a mocked state.
* admin(holds <the row's grant>) is on <grade10 admin grading submission url> for it.

**Test data:**

| Row | Grant | Outcome |
| --- | --- | --- |
| A | `grading:operate` | the letter flagged with its reason, Send again offered |
| B | `grading:read` alone, the grants mocked since no shipped role holds it alone | the letter flagged with its reason, no Send again offered |

**Steps:**

1. Click the Documents tab and read the flagged letter.

**Expected Results:**

* The failed letter is flagged with its reason; Send again is offered on it only to the row's operate holder.

### grade10-admin-grading-counter-US11-TC8-1: An agreement sealed before the hand-in is not sent again

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-11

**Pre-conditions:**

* A submission is seeded at `booked`, as *Seeding a submission* says; at the desk every card is checked and the collector has just sealed the agreement on the iPad, before the cards are checked in.
* admin(holds `grading:operate`) is on <grade10 admin grading submission url> for it, and the collector's last letter is noted, as *Reading a letter* says.

**Steps:**

1. Click the Documents tab.
2. Send the agreement again directly, outside the tab.
3. Read the collector's last letter again.

**Expected Results:**

* Step 1 lists the agreement with its fingerprint and offers no Send again on it.
* Step 2 is refused by name, and the collector's mailbox receives nothing.

### grade10-admin-grading-counter-US11-TC9-1: The hand-back receipt is refused while a balance is due

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-11

**Pre-conditions:**

* A submission is seeded at `ready` with `readyAt` 150 days back, as *Seeding a submission* says, so storage has accrued past day 90 and is unpaid.
* admin(holds `grading:operate`) is on <grade10 admin grading submission url> for it, its hand-back runbook past who is collecting, the storage not taken at Settle.

**Test data:**

| Field | Value |
| --- | --- |
| Storage accrued | whatever the 60 days past day 90 come to at 3000 minor units a card a month; any amount above nought |

**Steps:**

1. Mint the hand-back receipt from the Sign the receipt step.

**Expected Results:**

* Step 1 is refused by name before the iPad is offered.

---

## grade10-admin-grading-counter-US12: Operator posts the written notice from the Notice due rung

**As a** member of shop staff working the Ready view,
**I want** a submission uncollected past the notice day to ask me for the notice, and to record the posting date and the tracking once it is in the post, the email going the same day and the 30 days counting from that date,
**so that** the notice is a fact with a date on it and nothing after it runs off a guess.

### grade10-admin-grading-counter-US12-TC1-1: A submission ready past the notice day asks staff for the notice

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-12

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/uncollected.spec.ts`

**Pre-conditions:**

* `grading.notice_day` stands at 180, as seeded.
* A submission is seeded at `ready` with `readyAt` the row's days back, as *Seeding a submission* says, and is not collected.
* admin(holds `grading:operate`) is on <grade10 admin grading queue url>.

**Test data:**

| Row | Ready for | Outcome |
| --- | --- | --- |
| A | 180 days, the notice day | Notice due |
| B | 179 days, a day before the notice day | no Notice due |

**Steps:**

1. Click Ready.
2. Read the submission's row.
3. Click the row and read the submission page's badges.
4. Read the collector's last letter, as *Reading a letter* says.

**Expected Results:**

* Step 2's row and step 3's submission page read the row's outcome: the Notice due badge in row A, no Notice due badge in row B.
* Step 4 is no notice: nothing has been sent without staff.

### grade10-admin-grading-counter-US12-TC2-1: Posting the notice records the posting date and tracking; the email goes the same day

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-12

**Pre-conditions:**

* A submission is seeded at `ready` with `readyAt` 180 days back, as *Seeding a submission* says, so it is badged Notice due.
* admin(holds `grading:operate`) is on <grade10 admin grading submission url> for it.

**Test data:**

| Field | Value |
| --- | --- |
| Posting date | today |
| Tracking number | RR123456785HK, any registered-post number |

**Steps:**

1. Click Post the notice.
2. Enter the posting date and the tracking number.
3. Click Record.
4. Click the Timeline tab.
5. Read the collector's last letter, as *Reading a letter* says.

**Expected Results:**

* The posting date and tracking appear on the timeline.
* The notice email goes out the same day.

### grade10-admin-grading-counter-US12-TC3-1: Record is disabled while the posting date or tracking is missing

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-12

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/uncollected.spec.ts`

**Pre-conditions:**

* A submission is seeded at `ready` with `readyAt` 180 days back, as *Seeding a submission* says, so it is badged Notice due.
* admin(holds `grading:operate`) is on <grade10 admin grading submission url> for it.

**Steps:**

1. Click Post the notice.
2. Enter today as the posting date and leave the tracking number empty.
3. Read Record.

**Expected Results:**

* Record stays disabled, naming the missing tracking field.

### grade10-admin-grading-counter-US12-TC4-1: The 30 days run from the posting date, not the notice day

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-12

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/uncollected.spec.ts`

**Pre-conditions:**

* A submission is seeded at `ready` with `readyAt` 186 days back, as *Seeding a submission* says, so it first badged Notice due 6 days ago.
* admin(holds `grading:operate`) is on <grade10 admin grading submission url> for it.

**Test data:**

| Field | Value |
| --- | --- |
| Notice day | 180 |
| Posted | day 183, 3 days ago |
| Recorded | day 186, today |
| Tracking number | RR123456785HK, any registered-post number |

**Steps:**

1. Click Post the notice, enter the date 3 days ago as the posting date and the tracking number, and click Record.
2. Click the Timeline tab and read the notice entry's 30 days.

**Expected Results:**

* The 30 days are counted from day 183, the posting date, not from day 186, the day it was entered.

### grade10-admin-grading-counter-US12-TC5-1: Nothing more is offered once the 30 days pass

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-12

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/uncollected.spec.ts`

**Pre-conditions:**

* A submission is seeded at `ready` with `readyAt` 211 days back, as *Seeding a submission* says, and its notice is recorded with a posting date 31 days ago and a tracking number, the cards still uncollected.
* admin(holds `grading:operate`) is signed in to the console.

**Steps:**

1. Navigate to <grade10 admin grading submission url> for the submission.
2. Read every act the page offers, and the Money tab's storage.

**Expected Results:**

* No further notice or disposal act is offered; storage keeps accruing and the cards stay in the safe.

### grade10-admin-grading-counter-US12-TC6-1: The notice's address is read only by an operate holder, and only while the notice is due

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-grading-counter-US-12

**Pre-conditions:**

* <submission_1> and <submission_2> are seeded at `ready`, as *Seeding a submission* says, with `readyAt` 180 and 179 days back.
* admin A(holds `grading:operate`) is on <grade10 admin grading queue url>, Ready clicked.
* admin C(holds `grading:read` alone) is signed in to their own console. No shipped role holds `grading:read` alone, so admin C's grants are mocked.

**Test data:**

| Field | Value |
| --- | --- |
| <submission_1> | ready 180 days, the notice due and not posted |
| <submission_2> | ready 179 days, its notice day tomorrow |

**Steps:**

1. As admin A, click Post the notice on <submission_1>'s row.
2. As admin A, ask for the notice's address on <submission_2> directly, outside the console, which offers no Post the notice before the notice day.
3. As admin C, ask for the notice's address on <submission_1> directly, outside the console.

**Expected Results:**

* Step 1: the dialog shows the postal address taken at signing.
* Step 2: refused by name, with the day the notice falls due.
* Step 3: refused by name.

### grade10-admin-grading-counter-US12-TC7-1: Cards ready a month badge as uncollected, worked out at the read

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-12

**Pre-conditions:**

* A submission is seeded at `ready` with `readyAt` 29 days back, as *Seeding a submission* says, and is not collected.
* admin(holds `grading:read`) is on <grade10 admin grading queue url>.

**Steps:**

1. Click Ready and read the submission's row.
2. The next day, with nothing done to the submission, click Ready again and read the same row.
3. Open the submission and click the Timeline tab.

**Expected Results:**

* Step 2's row badges Uncollected 30 d.
* Step 3 shows no entry between the two reads: the badge came with no write.

---

## grade10-admin-grading-counter-US13: Admin reconstructs one submission's history on the audit chain

**As an** admin holding a submission in a dispute,
**I want** every event on the timeline with the figures it carried and the grader's stages in its words, staff-only entries kept from the collector, and every action filed under the submission on the audit chain,
**so that** the record can be tested rather than believed.

### grade10-admin-grading-counter-US13-TC1-1: The timeline lists every event with the figures it carried

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-13

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/uncollected.spec.ts`

**Pre-conditions:**

* A submission of one card at Regular, its fee paid at hand-in, is received with that card moved to Express, as *Receiving with an exception* says, and its upcharge of 60000 minor units (HKD 600.00) is waived: asked for by admin A with a reason and approved by admin B.
* The submission is then collected at the counter, its hand-back closed on a sealed receipt.
* admin(holds `grading:read`) is on <grade10 admin grading submission url> for it.

**Steps:**

1. Click the Timeline tab.

**Expected Results:**

* Every event from booking to collection is listed in order, each with the figures it carried and who did it — the paid amount, the upcharge and the waiver's reason among them.

### grade10-admin-grading-counter-US13-TC2-1: The grader's stages appear on the timeline in the grader's own words

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-13

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/batch.spec.ts`

**Pre-conditions:**

* A submission is seeded at `sent`, as *Seeding a submission* says.
* That morning a stage is recorded on its batch at <grade10 admin grading batches url>, picked from the grader's stages with the grader's words below in the note beside it.
* admin(holds `grading:read`) is on <grade10 admin grading submission url> for it.

**Test data:**

| Field | Value |
| --- | --- |
| The grader's words | Research & ID, as PSA's order page wrote it |

**Steps:**

1. Click the Timeline tab.

**Expected Results:**

* The stage appears in the grader's own words, not rephrased by the console.

### grade10-admin-grading-counter-US13-TC3-1: Staff-only entries stay off the collector's page

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-13

**Pre-conditions:**

* A submission carries an entry marked staff-only on its timeline.
* admin(holds `grading:read`) is on <grade10 admin grading submission url> for it, and the collector has its page open at <grade10 grading submission url>.

**Steps:**

1. Click the Timeline tab.
2. Reload the collector's page and read it whole.
3. Read every letter sent about the submission, as *Reading a letter* says.

**Expected Results:**

* Step 1 shows the staff-only entry.
* Step 2 does not show that entry anywhere on the collector's page.
* Step 3's letters do not carry the entry.

### grade10-admin-grading-counter-US13-TC4-1: Every action on the submission is filed under it on the audit chain

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-13

**Pre-conditions:**

* A submission of one card is checked in and shipped, then received with that card moved from Regular to Express, as *Receiving with an exception* says, so it owes an upcharge of 60000 minor units (HKD 600.00).
* Its upcharge is waived on the Money tab of <grade10 admin grading submission url>: asked for by admin A(holds `grading:approve`) with a reason and approved by admin B(holds `grading:approve`) in their own console.
* The submission is then collected at the counter, its hand-back closed on a sealed receipt.
* A second submission, seeded at `ready` as *Seeding a submission* says, stands on the same stack.
* admin(holds `grading:read`) is on <grade10 admin audit url>.

**Steps:**

1. On <grade10 admin audit url>, pull the trail for the first submission's id.
2. Pull the trail for the second submission's id.

**Expected Results:**

* Step 1's trail lists every one of those acts — checked in, shipped, received, waived and collected — each with who did it, and none from the second submission.

---

## grade10-admin-grading-counter-US14: Operator's acts follow the grant they hold and the status in front of them

**As a** member of shop staff,
**I want** each tab to offer exactly the acts my grant and the submission's status allow, cancel only on the collector's word and never once the visit starts or a card is checked or refused, refused independently when the submission has moved under me,
**so that** I am never shown a button that will only be refused, and two of us at one counter cannot leave a submission where neither meant.

### grade10-admin-grading-counter-US14-TC1-1: An operate-grant holder sees only the acts that grant covers

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** smoke
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-grading-counter-US-14

**Pre-conditions:**

* A submission of one card is received with that card moved from Regular to Express, as *Receiving with an exception* says, so it owes an upcharge.
* admin(holds `grading:operate`, not `grading:approve`) is on <grade10 admin grading submission url> for it.
* The operator's grants are mocked to `grading:read` and `grading:operate` without `grading:approve`, since no shipped role holds `grading:operate` without `grading:approve`.

**Steps:**

1. Click the Money tab.
2. Read its acts for Waive the upcharge and for recording a payout.

**Expected Results:**

* Waive the upcharge and Payout are absent; only the acts `grading:operate` covers are offered.

### grade10-admin-grading-counter-US14-TC2-1: Cancel is never offered once the cards have left

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
* **Trace:** grade10-admin-grading-counter-US-14

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/handin.spec.ts`

**Pre-conditions:**

* A submission is seeded at `checked_in`, as *Seeding a submission* says, its cards sealed in the intake bag.
* admin(holds `grading:operate`) is on <grade10 admin grading submission url> for it, with `?view=record`.

**Steps:**

1. Read every act the header and each tab offer.
2. Send the cancel directly, outside the console.

**Expected Results:**

* Cancel is not offered on any status from `checked_in` onward.
* Step 2 is refused by name.

### grade10-admin-grading-counter-US14-TC3-1: A stale act is refused by name when the submission moved under the operator

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-14

**Pre-conditions:**

* A submission of two cards is seeded at `booked`, as *Seeding a submission* says.
* admin A(holds `grading:operate`) and admin B(holds `grading:operate`) each have its hand-in runbook open at <grade10 admin grading submission url>, in their own consoles, after both cards are checked.
* Admin A has then sealed the agreement, taken the fee and checked the submission in; admin B's page has not reloaded since.

**Steps:**

1. As admin B, on the unreloaded runbook, click Refuse on the first card, choose a reason, type the words and click Refuse this card.
2. Read the refusal and the runbook.

**Expected Results:**

* Admin B's act is refused by name, naming that the submission has moved; the panel re-reads the current state rather than overwriting it.

### grade10-admin-grading-counter-US14-TC4-1: A read-grant holder is offered no act on any tab

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-grading-counter-US-14

**Pre-conditions:**

* A submission of one card is received with that card moved from Regular to Express, as *Receiving with an exception* says, so it has cards back and an upcharge owed.
* admin(holds `grading:read` only) is on <grade10 admin grading submission url> for it.
* The operator's grants are mocked to `grading:read` alone, since no shipped role holds that grant alone.

**Steps:**

1. Click the Cards tab.
2. Click the Money tab.
3. Click the Documents tab.
4. Send a request to waive the upcharge directly, outside the console.

**Expected Results:**

* Every tab offers reading only; no act appears on any of the three.
* Step 4 is refused by name.

### grade10-admin-grading-counter-US14-TC5-1: An approve-grant holder sees the operate acts as well as the approve-only ones

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-14

**Pre-conditions:**

* admin(holds `grading:operate` and `grading:approve`) holds the `staff` role, which carries both.
* A submission of one card is received with that card moved from Regular to Express, as *Receiving with an exception* says, so it is `ready` owing an upcharge.
* The admin is on <grade10 admin grading submission url> for it.

**Steps:**

1. Read the acts the submission offers on its runbook and its tabs.
2. Click the Money tab and read its acts.

**Expected Results:**

* Step 1 offers the hand-back, the `grading:operate` act, and step 2 offers Waive the upcharge, the `grading:approve` act: the acts of both grants offered together on the one submission.

### grade10-admin-grading-counter-US14-TC6-1: Production asks for the second factor before any grading surface opens

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-14

**Pre-conditions:**

* admin(holds `grading:operate`) has a production console account with a second factor enrolled, and no verified session.

**Steps:**

1. Sign in to the production console.
2. Navigate to <grade10 admin grading queue url> on production.

**Expected Results:**

* The second factor is required before the surface opens.

### grade10-admin-grading-counter-US14-TC7-1: One verification covers the next act for twelve hours

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-14

**Pre-conditions:**

* admin(holds `grading:operate`) verified their session with the second factor an hour ago in the production console.
* A `ready` submission in production owes a balance at the hand-back, and the admin has its hand-back runbook open at <grade10 admin grading submission url>, the collector matched.

**Steps:**

1. On the Settle step, click Take payment and take the payment at the till.
2. Tick Handed over on an item.

**Expected Results:**

* Neither act asks for the second factor again; the session stays verified for 12 hours from the verification.

### grade10-admin-grading-counter-US14-TC8-1: Staff cancel a booked submission on the collector's word

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-grading-counter-US-14

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/handin.spec.ts`

**Pre-conditions:**

* The collector has booked a drop-off for later today on the site, at <grade10 grading url>, so its submission is `booked`, its visit not started and none of its cards checked or refused; the collector has asked the shop to call it off.
* admin(holds `grading:operate`) is on <grade10 admin grading submission url> for it, with `?view=record`, and has noted the collector's last letter, as *Reading a letter* says.

**Steps:**

1. Click Cancel on the submission.
2. Click Yes, cancel in the confirm.
3. On <grade10 admin audit url>, pull the trail for the submission's id.
4. Read the collector's last letter again.

**Expected Results:**

* Step 2: the submission reads Cancelled, and its drop-off is cancelled in the diary with it.
* Step 3: the cancel is on the trail, with the operator who made it.
* Step 4: no message about the cancel was sent.

### grade10-admin-grading-counter-US14-TC9-1: Cancel is withheld once the visit's start time comes or a card is checked or refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-grading-counter-US-14

**Pre-conditions:**

* A `booked` submission stands in the row's state. For Start time come it is seeded at `booked`, as *Seeding a submission* says, with the default anchors, its visit's start time an hour or more past; for the other two rows the collector booked a drop-off for later today on the site, at <grade10 grading url>, and the desk clicked Start at the desk early and acted as the row says.
* admin(holds `grading:operate`) has <grade10 admin grading submission url> for it open with `?view=record` in a second tab, loaded before the row's state was reached.

**Test data:**

| State | The desk |
| --- | --- |
| Start time come | the visit's start time has come; no card checked or refused |
| Card checked early | before the visit's start time, the desk started early and checked one card, with both intake photographs |
| Card refused early | before the visit's start time, the desk started early and refused the first card, with its reason |

**Steps:**

1. Load the submission with `?view=record` in the first tab.
2. In the second tab, click Cancel on the submission and click Yes, cancel.

**Expected Results:**

* Step 1: Cancel is not offered.
* Step 2: the cancel is refused by name, and the submission reads as before.

---

## grade10-admin-grading-counter-US15: Operations changes a default without a deploy

**As an** admin answerable for how the counter runs,
**I want** every clock, cap, fee sheet and threshold the pages run on to be a setting I read and change in the console under `grading:approve`, a money setting taking a second person, filed under its own audit subject, and reaching only submissions not yet booked,
**so that** confirming a default is a decision I record and not a release I wait for, and no signed paper changes under a collector.

### grade10-admin-grading-counter-US15-TC1-1: Every setting is read with its default and its owner

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-15

**Pre-conditions:**

* admin(holds `grading:approve`) is signed in to the console.

**Steps:**

1. Navigate to <grade10 admin grading settings url>.
2. Read the table, then the notice-day row.

**Expected Results:**

* The table lists every setting with its current value, the owner who confirms it, and the pinned line explaining where a change takes effect.

### grade10-admin-grading-counter-US15-TC2-1: A clock is edited in place with a single saveable field

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-15

**Pre-conditions:**

* admin(holds `grading:approve`) is on <grade10 admin grading settings url>, `grading.plan_nudge_days` standing at 21 as seeded.

**Test data:**

| Field | Value |
| --- | --- |
| Setting | `grading.plan_nudge_days` |
| Old value | 21 |
| New value | 25 |

**Steps:**

1. Click the `grading.plan_nudge_days` field.
2. Change it to 25.
3. Save the field.
4. On <grade10 admin audit url>, pull the trail for the `settings` subject.

**Expected Results:**

* Step 3 saves the field in place with no second-person dialog.
* Step 4 shows the entry under the settings subject, naming the key, 21, 25 and the writer.

### grade10-admin-grading-counter-US15-TC3-1: A money setting requires a reason and a second approve holder

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-15

**Pre-conditions:**

* admin A(holds `grading:approve`) is on <grade10 admin grading settings url>, the storage fee standing at 3000 minor units as the dev settings write it.
* admin B(holds `grading:approve`) has the same page open in their own console.

**Test data:**

| Field | Value |
| --- | --- |
| Setting | `grading.storage_fee_per_card_month` |
| Old value | 3000 minor units (HKD 30.00) |
| New value | 3500 minor units (HKD 35.00) |

**Steps:**

1. As admin A, change the storage fee to 3500 minor units (HKD 35.00).
2. Type the reason, Storage fee reviewed for the new year, in the second-person dialog.
3. Ask for approval, and read the row.
4. As admin B, reload the page and click Approve on the waiting row.
5. Read the row, then pull the trail for the `settings` subject on <grade10 admin audit url>.

**Expected Results:**

* Step 3's row waits on a second approver; step 5's row reads 3500, carrying admin A's and admin B's names.
* The audit entry is filed under `settings`, not under any submission.

### grade10-admin-grading-counter-US15-TC4-1: The recorder cannot approve their own settings change

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-grading-counter-US-15

**Pre-conditions:**

* admin A(holds `grading:approve`) has asked for a change to the storage fee on <grade10 admin grading settings url>, with a reason, and nobody has approved it.

**Steps:**

1. As admin A, send the approval of admin A's own request directly, outside the console, which offers the recorder no Approve on their own request.
2. Reload the page and read the storage fee row.

**Expected Results:**

* Step 1 is refused by name, and step 2's row still waits on a second approver.

### grade10-admin-grading-counter-US15-TC5-1: A changed setting reaches only submissions not yet booked

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-15

**Pre-conditions:**

* The storage fee stands at 3000 minor units, as the dev settings write it.
* A submission is seeded at `checked_in`, as *Seeding a submission* says, so its agreement is sealed with the old fee printed.
* admin(holds `grading:approve`) is on <grade10 admin grading settings url>.

**Test data:**

| Field | Value |
| --- | --- |
| Old storage fee | 3000 minor units (HKD 30.00) |
| New storage fee | 3500 minor units (HKD 35.00) |

**Steps:**

1. Change the storage fee to 3500 minor units, as *Writing a money setting* says.
2. On the first submission's Documents tab, show the agreement and read the storage fee it prints.
3. Seed a new submission at `checked_in`, then show its agreement and read the storage fee it prints.

**Expected Results:**

* Step 2 still shows the old 3000 minor units (HKD 30.00) fee, unchanged.
* Step 3 shows the new 3500 minor units (HKD 35.00) fee.

### grade10-admin-grading-counter-US15-TC6-1: An operate-grant holder sees the settings table read-only

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-grading-counter-US-15

**Pre-conditions:**

* admin(holds `grading:operate`, not `grading:approve`) is signed in to the console.
* The operator's grants are mocked to `grading:read` and `grading:operate` without `grading:approve`, since no shipped role holds `grading:operate` without `grading:approve`.

**Steps:**

1. Navigate to <grade10 admin grading settings url>.
2. Click a setting's value to edit it.
3. Send a write of that setting directly, outside the console.

**Expected Results:**

* The table reads, but no field opens for editing.
* Step 3 is refused by name.

### grade10-admin-grading-counter-US15-TC7-1: An unset fact is marked on Settings with its readiness owner

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-15

**Pre-conditions:**

* A fee-sheet row stands unwritten, as on a stack where the grading dev settings were not written, only the migrations. The dev launcher writes every row, so an unwritten one is a manipulated environment.
* admin(holds `grading:approve`) is signed in to the console.

**Steps:**

1. Navigate to <grade10 admin grading settings url>.
2. Read the fee sheet section.

**Expected Results:**

* The unset row is marked as a bracketed value, naming its owner on the readiness line.

### grade10-admin-grading-counter-US15-TC8-1: A read that needs a setting nobody has written is refused by name

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-15

**Pre-conditions:**

* `grading.storage_fee_per_card_month` stands unwritten by its owner, as on a stack where the grading dev settings were not written, only the migrations. The dev launcher writes it, so an unwritten one is a manipulated environment.
* A `ready` submission stands on that stack, and admin(holds `grading:read`) is on <grade10 admin grading submission url> for it.

**Steps:**

1. Click the Money tab.

**Expected Results:**

* The read is refused by name, naming that setting and its owner.
* No value compiled into the code is used in its place.

### grade10-admin-grading-counter-US15-TC9-1: The reference rate is written by one approve holder, and nought is refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-15

**Pre-conditions:**

* admin(holds `grading:approve`) is on <grade10 admin grading settings url>, the reference rate at 7.84 as seeded.

**Test data:**

| Row | Refused rate | Outcome |
| --- | --- | --- |
| A | 0 | refused, naming the reference rate |
| B | −1 | refused, naming the reference rate |

**Steps:**

1. Change the reference rate field to 7.90 and save it.
2. Change it to the row's refused rate and save it.
3. Reload the page and read the reference rate row.
4. As a collector, paste a list with a USD reference sale at <grade10 grading url>/new and read its HKD reading.

**Expected Results:**

* The first save writes 7.90 with no second-person dialog, naming the writer alone.
* The second save is refused, naming the reference rate, and 7.90 stays.
* Step 4 reads the USD sale at 7.90.

### grade10-admin-grading-counter-US15-TC10-1: A fee-sheet change reaches only what is not yet booked

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-15

**Pre-conditions:**

* PSA Regular's fee stands at 60000 minor units, as the dev settings write it.
* One submission at Regular is seeded at `booked` and a second at `planned`, as *Seeding a submission* says.
* admin(holds `grading:approve`) is on <grade10 admin grading settings url>.

**Test data:**

| Field | Value |
| --- | --- |
| Regular's fee before | 60000 minor units (HKD 600.00) |
| Regular's fee after | 70000 minor units (HKD 700.00), any other fee |

**Steps:**

1. Write Regular's fee-sheet row with the fee after, as *Writing a money setting* says.
2. On the booked submission, check its cards at the desk, seal the agreement on the iPad and click Take payment.
3. Walk the planned submission on to `booked`, as *Seeding a submission* says, then at the desk check its cards, seal the agreement and click Take payment.

**Expected Results:**

* Step 2's till prices each card at the fee before, 60000 minor units: the booked submission is untouched.
* Step 3's till prices each card at the fee after, 70000 minor units: the planned submission is priced on the new row when it books.

## Reconciliation

**Run:** the blind pass read the isolated bundle — this capability's `## Purpose` and `## Feature set`, its `user-journeys.md`, the change's `proposal.md` and its `decisions.md` with the `## Raised` table, `ui-design.md` with the state dispositions stripped, and the PRD sections the proposal links. It was denied every `## Requirements` section, `openspec/specs/` entirely, `openspec/changes/archive/` entirely, and `tech-design.md`. Ninety-two cases over fifteen journeys came back against eighty-four scenarios; the two readings are joined below on the journey anchors, and the suite now carries a hundred and four cases against a hundred and two scenarios.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `grade10-admin-grading-counter-US1-TC1-1` | Covered | `grade10-admin-grading-counter-SC-02`; one expected result added so the case also reaches `grade10-admin-grading-counter-SC-86`, the fields a row is worked from |
| `grade10-admin-grading-counter-US1-TC2-1` | Folded, one reading dropped | The strip in slot order reached no scenario and is folded as `grade10-admin-grading-counter-SC-85`. The claim that a submission ready for pickup shows on the strip's pickups line is a misreading: the strip carries the day's booked drop-offs and one line saying that pickups walk in, so that expected result and its pre-condition are dropped |
| `grade10-admin-grading-counter-US1-TC3-1` | Covered | `grade10-admin-grading-counter-SC-06`, `grade10-admin-grading-counter-SC-10` |
| `grade10-admin-grading-counter-US1-TC4-1` | Folded | The ready and settle tiles are `grade10-admin-grading-counter-SC-12`, `grade10-admin-grading-counter-SC-13`; the batch closing and with-graders tiles reached no scenario and are folded as `grade10-admin-grading-counter-SC-87` |
| `grade10-admin-grading-counter-US1-TC5-1` | Covered | `grade10-admin-grading-counter-SC-05` |
| `grade10-admin-grading-counter-US1-TC6-1` | Covered | `grade10-admin-grading-counter-SC-04` |
| `grade10-admin-grading-counter-US1-TC7-1` | Covered | `grade10-admin-grading-counter-SC-75` |
| `grade10-admin-grading-counter-US2-TC1-1` | Covered | `grade10-admin-grading-counter-SC-14` |
| `grade10-admin-grading-counter-US2-TC2-1` | Covered | `grade10-admin-grading-counter-SC-15` |
| `grade10-admin-grading-counter-US2-TC3-1` | Covered | `grade10-admin-grading-counter-SC-16` |
| `grade10-admin-grading-counter-US2-TC5-1` | Covered | `grade10-admin-grading-counter-SC-17` |
| `grade10-admin-grading-counter-US2-TC6-1` | Covered | `grade10-admin-grading-counter-SC-42` |
| `grade10-admin-grading-counter-US2-TC7-1` | Covered | `grade10-admin-grading-counter-SC-42`, `grade10-admin-grading-counter-SC-45` |
| `grade10-admin-grading-counter-US2-TC8-1` | Covered | `grade10-admin-grading-counter-SC-18`, `grade10-admin-grading-counter-SC-19` |
| `grade10-admin-grading-counter-US2-TC9-1` | Covered | `grade10-admin-grading-counter-SC-23` |
| `grade10-admin-grading-counter-US2-TC10-1` | Covered | `grade10-admin-grading-counter-SC-24` |
| `grade10-admin-grading-counter-US2-TC11-1` | Covered | `grade10-admin-grading-counter-SC-20` |
| `grade10-admin-grading-counter-US2-TC12-1` | Covered | `grade10-admin-grading-counter-SC-21` |
| `grade10-admin-grading-counter-US2-TC4-1` | Folded | A card declared exactly at the level's ceiling is the boundary of step 3's refusal and reached no scenario; folded as `grade10-admin-grading-counter-SC-88` |
| `grade10-admin-grading-counter-US3-TC1-1` | Covered | `grade10-admin-grading-counter-SC-25` |
| `grade10-admin-grading-counter-US3-TC2-1` | Covered | `grade10-admin-grading-counter-SC-26` |
| `grade10-admin-grading-counter-US3-TC3-1` | Covered | `grade10-admin-grading-counter-SC-28` |
| `grade10-admin-grading-counter-US3-TC4-1` | Covered | `grade10-admin-grading-counter-SC-27` |
| `grade10-admin-grading-counter-US3-TC5-1` | Raised, answered, folded | The blind pass could not tell what the submission becomes when its last card is refused. Answered: the counter cancels it from `booked` at the desk and tells the collector there, and no message is sent. Folded as `grade10-admin-grading-counter-SC-89`, added to the case, and landed as `Q75` |
| `grade10-admin-grading-counter-US4-TC1-1` | Covered | `grade10-admin-grading-counter-SC-29` |
| `grade10-admin-grading-counter-US4-TC2-1` | Covered | `grade10-admin-grading-counter-SC-30` |
| `grade10-admin-grading-counter-US4-TC3-1` | **Covered by `grade10-admin-grading-counter-SC-31`, corrected** | The requirement said at or above while `grade10-site/grading/submission-lifecycle` said above. Above is more than the figure, as the lifecycle's Q85 rules, so the scenario and the case now stand at exactly 1000000 HKD minor units on the no-ID side |
| `grade10-admin-grading-counter-US4-TC5-1` | Covered | `grade10-admin-grading-counter-SC-32` |
| `grade10-admin-grading-counter-US4-TC6-1` | Covered | `grade10-admin-grading-counter-SC-33` |
| `grade10-admin-grading-counter-US4-TC7-1` | Covered | `grade10-admin-grading-counter-SC-33` |
| `grade10-admin-grading-counter-US4-TC8-1` | Covered | `grade10-admin-grading-counter-SC-44`; its run has only an unticked item, so `grade10-admin-grading-counter-SC-43` went to a case of its own at review |
| `grade10-admin-grading-counter-US4-TC9-1` | Covered | `grade10-admin-grading-counter-SC-35` |
| `grade10-admin-grading-counter-US4-TC4-1` | Raised, answered, folded | The blind pass could not tell whether repeated wrong codes do anything beyond the field's own refusal. Answered: a wrong code is refused as often as it is typed, nothing closes the field, each refusal is on the timeline, and the ID glance against the collector's own name is the fallback. Folded as `grade10-admin-grading-counter-SC-91` and landed as `Q76` |
| `grade10-admin-grading-counter-US4-TC10-1` | Raised, answered, folded | The blind pass could not tell whether a second hand-back re-runs who is collecting. Answered: it does, as every hand-back does. Folded as `grade10-admin-grading-counter-SC-90`, added to the case, and landed as `Q78`. The case's own close is `grade10-admin-grading-counter-SC-36`. Deferred at review, still `draft`: no spec names the receive that records the held card back at the shop, so a tester cannot reach the case's starting state; the spec's author owes it |
| `grade10-admin-grading-counter-US5-TC1-1` | Covered | `grade10-admin-grading-counter-SC-38` |
| `grade10-admin-grading-counter-US5-TC2-1` | Covered | `grade10-admin-grading-counter-SC-39` |
| `grade10-admin-grading-counter-US5-TC3-1` | Retired at review, `deprecated` | Every holder of `grading:operate` also holds `grading:approve`, so the case ran the same operator on the same route as `grade10-admin-grading-counter-US5-TC2-1`, which walks it: no override is offered to anyone turned away |
| `grade10-admin-grading-counter-US5-TC4-1` | Covered | `grade10-admin-grading-counter-SC-38` — the counter reads the person named on the page as it stands at the hand-back; naming them is the collector's own act in `grade10-site/grading/submission-lifecycle` |
| `grade10-admin-grading-counter-US5-TC5-1` | Folded | The collector collecting while somebody else is also named reached no scenario; the requirement releases to two people and the second is folded as `grade10-admin-grading-counter-SC-92` |
| `grade10-admin-grading-counter-US6-TC1-1` | Covered | `grade10-admin-grading-counter-SC-41` |
| `grade10-admin-grading-counter-US6-TC2-1` | Covered | `grade10-admin-grading-counter-SC-40` |
| `grade10-admin-grading-counter-US6-TC3-1` | Covered | `grade10-admin-grading-counter-SC-33`, `grade10-admin-grading-counter-SC-40`; the other item handing over beside the vaulted slab joined from `grade10-admin-grading-counter-US6-TC4-1` at review |
| `grade10-admin-grading-counter-US6-TC4-1` | Retired at review, `deprecated` | Its result sat on `grade10-admin-grading-counter-US6-TC3-1`'s run: the other item ticking and handing over beside the vaulted slab is joined to that case, which walks it |
| `grade10-admin-grading-counter-US7-TC1-1` | Covered | `grade10-admin-grading-counter-SC-54` whole; the refund, the withdrawal receipt and the rest staying in the batch joined from `grade10-admin-grading-counter-US7-TC2-1`, `grade10-admin-grading-counter-US7-TC3-1` and `grade10-admin-grading-counter-US7-TC5-1` at review |
| `grade10-admin-grading-counter-US7-TC2-1` | Retired at review, `deprecated` | One starting state and one route with `grade10-admin-grading-counter-US7-TC1-1`; the refund of the card's own line is joined to that case, which walks it |
| `grade10-admin-grading-counter-US7-TC3-1` | Retired at review, `deprecated` | One starting state and one route with `grade10-admin-grading-counter-US7-TC1-1`; the card's own withdrawal receipt is joined to that case, which walks it |
| `grade10-admin-grading-counter-US7-TC4-1` | Covered | `grade10-admin-grading-counter-SC-55` |
| `grade10-admin-grading-counter-US7-TC5-1` | Retired at review, `deprecated` | One starting state and one route with `grade10-admin-grading-counter-US7-TC1-1`; the rest staying in the batch is joined to that case, which walks it |
| `grade10-admin-grading-counter-US8-TC1-1` | Covered | `grade10-admin-grading-counter-SC-59` |
| `grade10-admin-grading-counter-US8-TC2-1` | Covered | `grade10-admin-grading-counter-SC-61` |
| `grade10-admin-grading-counter-US8-TC3-1` | Covered | `grade10-admin-grading-counter-SC-60` |
| `grade10-admin-grading-counter-US8-TC4-1` | Folded | A second approver who does not hold `grading:approve` is the permission matrix's other cell and reached no scenario; folded as `grade10-admin-grading-counter-SC-95` |
| `grade10-admin-grading-counter-US8-TC5-1` | Covered | `grade10-admin-grading-counter-SC-80` |
| `grade10-admin-grading-counter-US9-TC1-1` | Folded | Row A is `grade10-admin-grading-counter-SC-62`; row B, the bank transfer and its reference, reached no scenario and is folded as `grade10-admin-grading-counter-SC-96` |
| `grade10-admin-grading-counter-US9-TC2-1` | Folded | A payout recorded past its window saying so reached no scenario; folded as `grade10-admin-grading-counter-SC-97` |
| `grade10-admin-grading-counter-US9-TC3-1` | Covered | `grade10-admin-grading-counter-SC-64` |
| `grade10-admin-grading-counter-US9-TC4-1` | Covered | `grade10-admin-grading-counter-SC-60` — one rule over a waiver, a payout and a money setting alike |
| `grade10-admin-grading-counter-US9-TC5-1` | Covered | `grade10-admin-grading-counter-SC-80` |
| `grade10-admin-grading-counter-US10-TC1-1` | Covered | `grade10-admin-grading-counter-SC-51` |
| `grade10-admin-grading-counter-US10-TC2-1` | Covered | `grade10-admin-grading-counter-SC-52` |
| `grade10-admin-grading-counter-US10-TC3-1` | Covered | `grade10-admin-grading-counter-SC-52` |
| `grade10-admin-grading-counter-US10-TC4-1` | Covered | `grade10-admin-grading-counter-SC-50` |
| `grade10-admin-grading-counter-US10-TC5-1` | Covered | `grade10-admin-grading-counter-SC-53` |
| `grade10-admin-grading-counter-US10-TC6-1` | Folded | A submission id that resolves to nothing reached no scenario; folded as `grade10-admin-grading-counter-SC-94` |
| `grade10-admin-grading-counter-US11-TC1-1` | Covered | `grade10-admin-grading-counter-SC-45` |
| `grade10-admin-grading-counter-US11-TC2-1` | Covered | `grade10-admin-grading-counter-SC-46` |
| `grade10-admin-grading-counter-US11-TC3-1` | Covered | `grade10-admin-grading-counter-SC-48` |
| `grade10-admin-grading-counter-US11-TC4-1` | Covered | `grade10-admin-grading-counter-SC-45`, `grade10-admin-grading-counter-SC-48` |
| `grade10-admin-grading-counter-US11-TC5-1` | Covered | `grade10-admin-grading-counter-SC-49` |
| `grade10-admin-grading-counter-US11-TC6-1` | Folded | A submission with nothing sealed reached no scenario; folded as `grade10-admin-grading-counter-SC-93` |
| `grade10-admin-grading-counter-US11-TC7-1` | Covered | `grade10-admin-grading-counter-SC-49` — the letter's own failure and the reason it carries are `grade10-site/grading/collector-notifications`'s, and this capability offers the send again, to an operate holder only. The case reads the flagged letter, not the queue row's badge, so `grade10-admin-grading-counter-SC-11` went out of suite at review |
| `grade10-admin-grading-counter-US12-TC1-1` | Covered | `grade10-admin-grading-counter-SC-08`, `grade10-admin-grading-counter-SC-65` |
| `grade10-admin-grading-counter-US12-TC2-1` | Covered | `grade10-admin-grading-counter-SC-66`, `grade10-admin-grading-counter-SC-67` |
| `grade10-admin-grading-counter-US12-TC3-1` | Covered | `grade10-admin-grading-counter-SC-66` |
| `grade10-admin-grading-counter-US12-TC4-1` | Covered | `grade10-admin-grading-counter-SC-67` |
| `grade10-admin-grading-counter-US12-TC5-1` | Covered | `grade10-admin-grading-counter-SC-68` |
| `grade10-admin-grading-counter-US13-TC1-1` | Covered | `grade10-admin-grading-counter-SC-56` |
| `grade10-admin-grading-counter-US13-TC2-1` | Covered | `grade10-admin-grading-counter-SC-58` |
| `grade10-admin-grading-counter-US13-TC3-1` | Covered, deferred at review | `grade10-admin-grading-counter-SC-57`; the letters step was added at review. Still `draft`: no act or surface marks a timeline entry staff-only, so no tester can reach the case's starting state; the spec's author owes it |
| `grade10-admin-grading-counter-US13-TC4-1` | Covered | `grade10-admin-grading-counter-SC-80` |
| `grade10-admin-grading-counter-US14-TC1-1` | Covered | `grade10-admin-grading-counter-SC-75`, `grade10-admin-grading-counter-SC-82` |
| `grade10-admin-grading-counter-US14-TC2-1` | Covered | `grade10-admin-grading-counter-SC-83` |
| `grade10-admin-grading-counter-US14-TC3-1` | Covered | `grade10-admin-grading-counter-SC-84` |
| `grade10-admin-grading-counter-US14-TC4-1` | Covered | `grade10-admin-grading-counter-SC-75` |
| `grade10-admin-grading-counter-US14-TC5-1` | Folded | An operator holding more than one grant being offered the acts of each reached no scenario; the grants requirement gains the rule and it is folded as `grade10-admin-grading-counter-SC-100` |
| `grade10-admin-grading-counter-US15-TC1-1` | Raised, answered, folded | The blind pass could not tell whether an operator without `grading:approve` opens the settings at all. Answered: it opens them read-only, with every value and the owner who confirms it, and only `grading:approve` edits them. The feature set's grants line and the grants table are amended, folded as `grade10-admin-grading-counter-SC-99`, and landed as `Q77` |
| `grade10-admin-grading-counter-US15-TC2-1` | Covered | `grade10-admin-grading-counter-SC-71` |
| `grade10-admin-grading-counter-US15-TC3-1` | Covered | `grade10-admin-grading-counter-SC-70` |
| `grade10-admin-grading-counter-US15-TC4-1` | Covered | `grade10-admin-grading-counter-SC-60` |
| `grade10-admin-grading-counter-US15-TC5-1` | Covered | `grade10-admin-grading-counter-SC-73`; it walks the storage fee, not the fee sheet, so `grade10-admin-grading-counter-SC-72` and `grade10-admin-grading-counter-SC-74` went to a case of their own at review |
| `grade10-admin-grading-counter-US15-TC6-1` | Covered | `grade10-admin-grading-counter-SC-76` |
| `grade10-admin-grading-counter-US15-TC7-1` | Folded | A setting nobody has written being marked on the settings page with its owner reached no scenario; folded as `grade10-admin-grading-counter-SC-98` |
| `grade10-admin-grading-counter-SC-01` | Case added | `grade10-admin-grading-counter-US1-TC8-1` — the Today cut made on the shop's own day while the date in Coordinated Universal Time is still yesterday's |
| `grade10-admin-grading-counter-SC-03` | Case added | `grade10-admin-grading-counter-US1-TC9-1` — a `planned` submission in none of the views |
| `grade10-admin-grading-counter-SC-77` | Case added | `grade10-admin-grading-counter-US1-TC10-1` — no email and no push to staff over a shift |
| `grade10-admin-grading-counter-SC-22` | Case added | `grade10-admin-grading-counter-US2-TC13-1` — check in refused while the agreement is unsealed |
| `grade10-admin-grading-counter-SC-101` | Case added | `grade10-admin-grading-counter-US2-TC14-1` — an order recorded on one submission refused on another at a second level, and a replay on the first answering its own lines |
| `grade10-admin-grading-counter-SC-102` | Case added | `grade10-admin-grading-counter-US11-TC8-1` — an agreement sealed before the hand-in, which no letter has carried, not offered again and a send of it refused by name |
| `grade10-admin-grading-counter-SC-34` | Case added | `grade10-admin-grading-counter-US4-TC11-1` — the held card untickable and named on the receipt |
| `grade10-admin-grading-counter-SC-09` | Case added | `grade10-admin-grading-counter-US9-TC6-1` — the queue badging a payout past its window |
| `grade10-admin-grading-counter-SC-63` | Case added | `grade10-admin-grading-counter-US9-TC7-1` — a second payout on a card already carrying one refused |
| `grade10-admin-grading-counter-SC-103` | Case added | `grade10-admin-grading-counter-US9-TC8-1` — a payout asked for and never approved, which moves no money |
| `grade10-admin-grading-counter-SC-78` | Case added | `grade10-admin-grading-counter-US14-TC6-1` — the second factor asked for in production |
| `grade10-admin-grading-counter-SC-79` | Case added | `grade10-admin-grading-counter-US14-TC7-1` — one verification covering the next act for twelve hours |
| `grade10-admin-grading-counter-SC-69` | Case added | `grade10-admin-grading-counter-US15-TC8-1` — a read refused by name for a setting nobody has written |
| `grade10-admin-grading-counter-SC-104` | Case added, added after the run | `grade10-admin-grading-counter-US15-TC9-1`: the staff-set reference rate decided outside the blind pass; it prices nothing a collector pays, so one approve holder writes it and nought is refused |
| `grade10-admin-grading-counter-SC-105` | Case added, added after the run | `grade10-admin-grading-counter-US12-TC6-1`: decided outside the blind pass; the address is personal data, so only a holder who may post the notice reads it, and only while the notice is due |
| `grade10-admin-grading-counter-SC-106` | Case added, added after the run | `grade10-admin-grading-counter-US14-TC8-1`: decided outside the blind pass; staff cancel on the collector's word inside the collector's own window, the drop-off going with it, filed on the audit chain and no message sent |
| `grade10-admin-grading-counter-SC-107` | Case added, added after the run | `grade10-admin-grading-counter-US14-TC9-1`: decided outside the blind pass; one window for both hands, so the console withholds Cancel once the visit's start time comes or a card is checked or refused, a desk that started early included, and the desk refuses the cards instead |
| `grade10-admin-grading-counter-SC-91` | Case added at review | `grade10-admin-grading-counter-US4-TC12-1` — three wrong codes, each refused on the field and on the timeline, nothing closing the field, and the ID glance as the fallback; `grade10-admin-grading-counter-US4-TC4-1` asserts one wrong code only |
| `grade10-admin-grading-counter-SC-43` | Case added at review | `grade10-admin-grading-counter-US11-TC9-1` — the receipt refused by name before the iPad while storage is unpaid; `grade10-admin-grading-counter-US4-TC8-1`'s run has only an unticked item |
| `grade10-admin-grading-counter-SC-07` | Case added at review | `grade10-admin-grading-counter-US12-TC7-1` — a submission read on its 29th and 30th day ready, badged uncollected on the second read with nothing written between; one condition, one case |
| `grade10-admin-grading-counter-SC-10` | Case added at review | `grade10-admin-grading-counter-US12-TC7-1` — a submission read on its 29th and 30th day ready, badged uncollected on the second read with nothing written between; one condition, one case |
| `grade10-admin-grading-counter-SC-72` | Case added at review | `grade10-admin-grading-counter-US15-TC10-1` — a fee-sheet row written after one booking and before another, reaching only the one not yet booked; `grade10-admin-grading-counter-US15-TC5-1` walks the storage fee, not the fee sheet |
| `grade10-admin-grading-counter-SC-74` | Case added at review | `grade10-admin-grading-counter-US15-TC10-1` — a fee-sheet row written after one booking and before another, reaching only the one not yet booked; `grade10-admin-grading-counter-US15-TC5-1` walks the storage fee, not the fee sheet |
| `grade10-admin-grading-counter-SC-47` | Out of suite | **Out of suite:** `grade10-site/grading/counter-documents`'s feature suite, which walks the collector declining on the iPad; the counter only reads the decline back on its step |
| `grade10-admin-grading-counter-SC-81` | Out of suite | **Out of suite:** the grading worker's audit-write test, `grade10:packages/grading/backend/src/testing/suites/audit.ts` — an audit entry can only be made unwritable below the console, and no counter act reaches that state from a screen |
| `grade10-admin-grading-counter-SC-11` | Out of suite | **Out of suite:** `grade10-site/grading/submission-lifecycle`'s feature suite, where `grade10-site/grading/collector-notifications` routes its uncollected ladder; no counter case reads the queue row's badge |

### Manual

| Manual | Why |
| --- | --- |
| `grade10-admin-grading-counter-US1-TC10-1` | Nothing is asserted: a person works a shift with the mailbox and the push notifications open and reads that neither carried any of the three submissions |
| `grade10-admin-grading-counter-US2-TC8-1` | The till is the shop's own point of sale; a person runs the order there and reads the lines written back against it |
| `grade10-admin-grading-counter-US2-TC11-1` | One label per card leaves a printer at the desk, and the bag is sealed by hand |
| `grade10-admin-grading-counter-US4-TC2-1` | An identity document is glanced at across the counter; the test is that nothing about it reaches a screen or a record |
| `grade10-admin-grading-counter-US9-TC1-1` | Row B leaves the till: a person makes the bank transfer and reads its reference onto the record |
| `grade10-admin-grading-counter-US11-TC1-1` | The link runs on the clock; a person holds it past 30 minutes and reads the expiry, then mints again |
| `grade10-admin-grading-counter-US12-TC2-1` | The notice goes by registered post; a person posts it and enters the date and tracking the counter clerk gave them |
| `grade10-admin-grading-counter-US14-TC6-1` | The second factor is the console's own, driven on production by a person with the device |
| `grade10-admin-grading-counter-US10-TC5-1` | The click-to-chat template opens WhatsApp outside the console, and the test is that nothing sends until staff press it |
| `grade10-admin-grading-counter-US15-TC10-1` | The till is the shop's own point of sale; a person runs both orders and reads the prices |
| `grade10-admin-grading-counter-US12-TC7-1` | The badge comes a day later; a person reads the queue on two days |
