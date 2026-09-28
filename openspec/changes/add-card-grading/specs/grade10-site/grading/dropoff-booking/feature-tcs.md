# grade10-site/grading/dropoff-booking Test Cases

**Status:** in-review
**Drafts styled:** 2026-09-22, tcs-rules r3.0

## grade10-site-grading-dropoff-booking-US1: Collector books the drop-off from the plan

**As a** collector who has reviewed the plan,
**I want** to pick the shop, a day the diary offers and a time in the shop's own zone, seeing beside the day the batch it makes and the day the cards would leave, and then a booked page and email that say what to bring, that staff check each card against the list, that I sign and then pay, and the estimated day back,
**so that** I arrive at a desk expecting my list, know which batch my cards join, and forget nothing at home.

### grade10-site-grading-dropoff-booking-US1-TC1-1: Collector books a drop-off within the horizon before cut-off

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-dropoff-booking-US-01

**Pre-conditions:**

* customer(with a saved plan under twenty cards) has reached the Book the drop-off step from the plan's review.

**Steps:**

1. Select the shop in the location picker.
2. Select a day inside the service's booking horizon, before this week's batch cut-off.
3. Select one of the day's offered times and confirm the booking.

**Expected Results:**

* The batch line beside the picked day names hand-in by that Thursday's cut-off and the cards leaving the next day.
* The submission's booked page shows the day, the time, the shop and its address, with an add-to-calendar file, Move and Cancel.
* The booked page lists the four Before you come items, and a confirmation email is sent.
* The email is grading's own; the diary sends no message of its own about the visit.

### grade10-site-grading-dropoff-booking-US1-TC2-1: Booking after the cut-off shows the next batch's dates

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
* **Trace:** grade10-site-grading-dropoff-booking-US-01

**Pre-conditions:**

* customer(with a saved plan) is on the Book the drop-off step with the shop selected.

**Steps:**

1. Select a day past this week's batch cut-off but inside the booking horizon.

**Expected Results:**

* The batch line names the following batch's close and ship days rather than the current week's.

### grade10-site-grading-dropoff-booking-US1-TC3-1: Booking exactly at the cut-off stays in that batch, at the limit

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
* **Trace:** grade10-site-grading-dropoff-booking-US-01

**Pre-conditions:**

* customer(with a saved plan) is on the Book the drop-off step.

**Test data:**

| Field | Value |
| --- | --- |
| Picked visit day and time | Thursday, 19:00 on the shop's own clock |

**Steps:**

1. Select the day and time at <Picked visit day and time>.

**Expected Results:**

* The batch line reads hand-in by that same Thursday's cut-off, with the cards leaving the next day.

### grade10-site-grading-dropoff-booking-US1-TC4-1: Shop and days render as skeletons while the diary loads

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-grading-dropoff-booking-US-01

**Pre-conditions:**

* customer(with a saved plan) is on the Book the drop-off step, and the diary's response is still pending.

**Steps:**

1. Observe the shop and day picker.

**Expected Results:**

* The shop and the days render as loading skeletons; no day reads as bookable yet.

### grade10-site-grading-dropoff-booking-US1-TC5-1: No free slot leaves every day in the horizon unbookable

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
* **Trace:** grade10-site-grading-dropoff-booking-US-01

**Pre-conditions:**

* customer(with a saved plan) is on the Book the drop-off step, and the shop's diary offers no free slot anywhere inside the booking horizon.

**Steps:**

1. Open the day picker.

**Expected Results:**

* Every day in the horizon reads with nothing free, and none is selectable.

### grade10-site-grading-dropoff-booking-US1-TC6-1: A day past the booking horizon is disabled, at the limit

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
* **Trace:** grade10-site-grading-dropoff-booking-US-01

**Pre-conditions:**

* customer(with a saved plan) is on the day picker, with slots free on the last day inside the service's booking horizon.

**Steps:**

1. Select the last day inside the booking horizon.
2. Attempt to select the first day past the horizon.

**Expected Results:**

* The last day inside the horizon is selectable, with its times offered.
* The first day past the horizon is disabled and cannot be selected.

### grade10-site-grading-dropoff-booking-US1-TC7-1: The diary's own refusal words offer another day to book

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-grading-dropoff-booking-US-01

**Pre-conditions:**

* customer(with a saved plan) has selected a shop, a day and a time to book.

**Test data:**

| Diary's refusal |
| --- |
| The slot is not offered |
| The slot is full |
| The slot's resource is not available |
| The day is already booked |

**Steps:**

1. Confirm a booking the diary answers with <Diary's refusal>.

**Expected Results:**

* The page reads <Diary's refusal> in the diary's own words.
* Another day is offered, and the day's times are read again.

### grade10-site-grading-dropoff-booking-US1-TC8-1: Diary failure reads in the error tone with no free day

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
* **Trace:** grade10-site-grading-dropoff-booking-US-01

**Pre-conditions:**

* customer(with a saved plan) is on the Book the drop-off step, and the diary's request has failed.

**Steps:**

1. Observe the shop and day picker.

**Expected Results:**

* The failure reads in the page's error tone.
* No day reads as free.

### grade10-site-grading-dropoff-booking-US1-TC9-1: The estimated day back counts from the day the batch leaves

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
* **Trace:** grade10-site-grading-dropoff-booking-US-01

**Pre-conditions:**

* customer(with a saved plan at a level quoted at a number of weeks back) is on the Book the drop-off step.

**Steps:**

1. Select a day inside the horizon and read the estimated day back beside it.
2. Book that day and read the estimated day back on the booked page.

**Expected Results:**

* The estimated day back is the level's weeks counted from the day the batch leaves the shop.
* It is not counted from the day of the visit, nor from the day the booking was made.

### grade10-site-grading-dropoff-booking-US1-TC10-1: The booked page offers a vault case on the same visit

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
* **Trace:** grade10-site-grading-dropoff-booking-US-01

**Pre-conditions:**

* customer(with a drop-off booked) is on the submission's booked page.

**Steps:**

1. Read the vault line on the booked page.

**Expected Results:**

* The page says a card that is not being graded can open a vault case at the same counter.
* It says that case takes the identity check grading itself does not ask for.

---

## grade10-site-grading-dropoff-booking-US2: Collector moves or cancels the drop-off

**As a** collector who cannot make the visit,
**I want** to move or cancel it from the submission page any time before it starts and to be emailed either way,
**so that** a change of plans costs me a minute and not the list.

### grade10-site-grading-dropoff-booking-US2-TC1-1: Collector moves the drop-off to a new day and time

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
* **Trace:** grade10-site-grading-dropoff-booking-US-02

**Pre-conditions:**

* customer(with a drop-off booked and not yet started) is on <the submission page>.

**Steps:**

1. Open Move on the booked visit.
2. Select a new day and time and confirm.

**Expected Results:**

* The visit reads the new day and time, and the batch line reads again for the newly picked day.
* A moved email is sent naming the new visit.

### grade10-site-grading-dropoff-booking-US2-TC4-1: Moving the drop-off never offers its own current slot back

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
* **Trace:** grade10-site-grading-dropoff-booking-US-02

**Pre-conditions:**

* customer(with a drop-off booked and not yet started) is on <the submission page>.

**Steps:**

1. Open Move on the booked visit.
2. Read the days and times offered.

**Expected Results:**

* The day and time the visit already holds is not offered.
* Every other free slot is offered as before.

### grade10-site-grading-dropoff-booking-US2-TC2-1: Collector cancels the drop-off and keeps the card list

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-dropoff-booking-US-02

**Pre-conditions:**

* customer(with a drop-off booked and not yet started) is on <the submission page>.

**Steps:**

1. Open Cancel visit.
2. Confirm the cancellation.

**Expected Results:**

* The visit closes and the submission reads Not handed in yet.
* The list and the estimate stay as they were, and a cancelled email is sent.

### grade10-site-grading-dropoff-booking-US2-TC3-1: Neither Move nor Cancel is offered once the visit has started

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
* **Trace:** grade10-site-grading-dropoff-booking-US-02

**Pre-conditions:**

* customer(with a booked drop-off whose start time has passed and which the shop has not closed) is on <the submission page>.

**Steps:**

1. Read the booked visit card.

**Expected Results:**

* Neither Move nor Cancel visit is offered.

---

## grade10-site-grading-dropoff-booking-US3: Collector who missed the drop-off books another

**As a** collector who missed the visit,
**I want** the visit to close once the shop marks it missed, the submission to tell me within the hour with the list and the estimate exactly as they were, and a line on the page to book again,
**so that** one missed day does not cost me the plan.

### grade10-site-grading-dropoff-booking-US3-TC1-1: A missed visit closes within the hour, list unchanged

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-grading-dropoff-booking-US-03

**Pre-conditions:**

* customer(whose booked visit passed unattended and was marked missed by the shop's console, less than an hour ago) is on <the submission page>.

**Steps:**

1. Read the page's chip, list and estimate.

**Expected Results:**

* The page reads Drop-off booked with the visit closed and the chip Waiting on you.
* The list and the estimate show exactly as they were, and a missed email confirms it.
* A Book another drop-off line is offered.

### grade10-site-grading-dropoff-booking-US3-TC2-1: Booking again after a miss reuses the same list

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
* **Trace:** grade10-site-grading-dropoff-booking-US-03

**Pre-conditions:**

* customer(whose submission shows a missed visit with the Book another drop-off line) is on <the submission page>.

**Steps:**

1. Select Book another drop-off.
2. Complete the booking with a new shop, day and time.

**Expected Results:**

* The new visit books against the same list and estimate the missed visit carried.
* The submission reads Drop-off booked with the new day.

### grade10-site-grading-dropoff-booking-US3-TC4-1: A missed visit restarts the plan's clock from the day of the miss

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-grading-dropoff-booking-US-03

**Decided by:** `grade10:packages/grading/backend/test/sweeps/expiry.repo.test.ts`

**Pre-conditions:**

* A plan kept 25 days ago, `plan_expiry_days` set to 30, whose visit was missed today.

**Steps:**

1. Run the plan expiry sweep `plan_expiry_days` after today.
2. Run the plan expiry sweep `plan_expiry_days` after the day the plan was first kept.

**Expected Results:**

* The plan has not expired after step 1.
* The plan expires only once `plan_expiry_days` has run from the day of the miss, not from the day it was first kept.

### grade10-site-grading-dropoff-booking-US3-TC3-1: The page reads the visit as booked until the diary closes it

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
* **Trace:** grade10-site-grading-dropoff-booking-US-03

**Pre-conditions:**

* customer(whose booked visit's start time has passed with nobody at the desk, and which the shop's diary console has not yet closed) is on <the submission page>.

**Steps:**

1. Read the page's chip, the visit card and the mailbox.

**Expected Results:**

* The page still reads Drop-off booked and holds the visit.
* No missed email has been sent.

---

## grade10-site-grading-dropoff-booking-US4: Collector brings a second submission to the same drop-off

**As a** collector whose cards need two levels,
**I want** the second submission to join the drop-off the first one booked, listed under the same day and time with the slot sized for both lists,
**so that** I make one trip to the shop.

### grade10-site-grading-dropoff-booking-US4-TC1-1: Second submission joins the visit the first one booked

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
* **Trace:** grade10-site-grading-dropoff-booking-US-04

**Pre-conditions:**

* customer(with a first submission's drop-off already booked) is on the Book the drop-off step for a second submission under the same email.

**Steps:**

1. Observe the step's shop and day picker.

**Expected Results:**

* No shop or day picker is shown; the step reads the existing visit as joined instead.
* The second submission's page shows the same day and time, read through the owning submission.

### grade10-site-grading-dropoff-booking-US4-TC2-1: Two joined lists passing twenty resize to the Bulk slot

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
* **Trace:** grade10-site-grading-dropoff-booking-US-04

**Pre-conditions:**

* customer(whose first submission's drop-off is booked at the standard visit) has a second submission ready to join, the two lists' combined count passing twenty.

**Steps:**

1. Join the second submission to the first submission's visit.

**Expected Results:**

* The visit is resized to the longer Bulk service, moved once in the diary.

### grade10-site-grading-dropoff-booking-US4-TC3-1: Owner's cancelled or missed visit detaches every joiner

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-grading-dropoff-booking-US-04

**Pre-conditions:**

* customer(with a second submission joined to the first submission's visit).

**Test data:**

| Owner's action |
| --- |
| Cancels the visit |
| Misses the visit |

**Steps:**

1. The owning submission <Owner's action>.
2. Open the joiner's submission page.

**Expected Results:**

* The joiner's page reads Not handed in yet, with the list and the estimate as they were.
* A Book another drop-off line is offered, and a letter tells the joiner the visit ended.

---

## grade10-site-grading-dropoff-booking-US5: Walk-in books a drop-off without a list

**As a** collector who does not want to list cards on my phone,
**I want** to book the Grading visit with a name and an email and have the cards listed with me at the counter,
**so that** I can still hand cards in on a booked slot.

### grade10-site-grading-dropoff-booking-US5-TC1-1: Walk-in books the Grading visit with a name and email

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
* **Trace:** grade10-site-grading-dropoff-booking-US-05

**Pre-conditions:**

* customer(with no card list) is on <grade10.com/book> with the Grading visit selected.

**Steps:**

1. Enter a name and an email.
2. Select a day and time and confirm the booking.

**Expected Results:**

* The visit books with no card list attached, and no grading submission is created.

### grade10-site-grading-dropoff-booking-US5-TC2-1: Walk-in booking is refused missing a name or email

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-dropoff-booking-US-05

**Pre-conditions:**

* customer(with no card list) is on <grade10.com/book> with the Grading visit selected.

**Test data:**

| Blank field |
| --- |
| Name |
| Email |

**Steps:**

1. Leave the <Blank field> empty.
2. Attempt to confirm the booking.

**Expected Results:**

* The booking is refused until the <Blank field> is filled in.

### grade10-site-grading-dropoff-booking-US5-TC3-1: The booking page lists the Grading visit and neither drop-off

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
* **Trace:** grade10-site-grading-dropoff-booking-US-05

**Pre-conditions:**

* customer(with no card list) is on <grade10.com/book>.

**Steps:**

1. Read the services the page offers.

**Expected Results:**

* The Grading visit is listed.
* Neither the Grading drop-off nor its Bulk variant is offered there.

### grade10-site-grading-dropoff-booking-US5-TC4-1: The walk-in's cards are listed at the desk and grading says nothing about the visit

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
* **Trace:** grade10-site-grading-dropoff-booking-US-05

**Pre-conditions:**

* customer(with no card list) has a booked Grading visit and is at the counter.

**Steps:**

1. Staff write the cards with the collector at the desk.
2. Read the submission the counter created, and the messages sent about the visit.

**Expected Results:**

* The submission is created at the desk and handed in from there.
* Grading sent no booked, moved, cancelled or missed message about that visit.

---

## grade10-site-grading-dropoff-booking-US6: Dealer books the longer Bulk drop-off

**As a** collector dealing in cards, twenty or more at a time,
**I want** the booking to take the longer Bulk drop-off with its slots, and the booked page to say how long the visit takes,
**so that** the desk has the time to check every card and I am not sent away with half a box.

### grade10-site-grading-dropoff-booking-US6-TC1-1: Twenty or more cards book the longer Bulk drop-off

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
* **Trace:** grade10-site-grading-dropoff-booking-US-06

**Pre-conditions:**

* customer(a dealer with a plan of twenty cards or more) is on the Book the drop-off step.

**Steps:**

1. Open the shop and day picker.
2. Book a day and time.

**Expected Results:**

* The Bulk drop-off's longer slots, about 45 minutes, are offered rather than the standard visit.
* The booked page names the visit's length as about 45 minutes.

### grade10-site-grading-dropoff-booking-US6-TC2-1: Nineteen and twenty cards split on either side, at the limit

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
* **Trace:** grade10-site-grading-dropoff-booking-US-06

**Pre-conditions:**

* customer(with a plan of <Cards in the list> cards) is on the Book the drop-off step.

**Test data:**

| Cards in the list | Slot offered |
| --- | --- |
| 19 | The standard visit |
| 20 | The Bulk drop-off |

**Steps:**

1. Open the shop and day picker.

**Expected Results:**

* The slot offered matches <Slot offered>.

### grade10-site-grading-dropoff-booking-US6-TC3-1: A booked list edited past twenty cards takes the Bulk drop-off at the same slot

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
* **Trace:** grade10-site-grading-dropoff-booking-US-06

**Pre-conditions:**

* customer(with a submission of 15 cards and a standard drop-off booked on it) is on <grade10 grading submission page url>, the visit not started.

**Steps:**

1. Click Edit the list.
2. Add seven cards, each with a declared value, to make 22, and save the changes.
3. Read the drop-off on the submission page.

**Expected Results:**

* Step 3: the visit is the Bulk drop-off, about 45 minutes, at the same day and time as before.
* The diary moved the visit once and never cancelled it.

---

## Reconciliation

**Run:** the blind pass read the isolated bundle — this capability's `## Purpose` and `## Feature set`, its `user-journeys.md`, the change's `proposal.md` and `decisions.md` with its `## Raised` table, `ui-design.md` with the state dispositions stripped, and the PRD sections the proposal links. It was denied every `## Requirements` section, `openspec/specs/` entirely, `openspec/changes/archive/` entirely, and `tech-design.md`. Nineteen cases over six journeys came back against twenty-four scenarios; the two readings are joined below on the journey anchors.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `grade10-site-grading-dropoff-booking-US1-TC1-1` | Covered | `grade10-site-grading-dropoff-booking-SC-04`, `grade10-site-grading-dropoff-booking-SC-09`, `grade10-site-grading-dropoff-booking-SC-12`; one expected result added so the case also reaches `grade10-site-grading-dropoff-booking-SC-02`'s other half, that the diary sends nothing of its own |
| `grade10-site-grading-dropoff-booking-US1-TC2-1` | Covered | `grade10-site-grading-dropoff-booking-SC-10` |
| `grade10-site-grading-dropoff-booking-US1-TC3-1` | Raised, answered, folded | The blind pass could not tell whether a visit at the cut-off instant falls in that week's batch. Answered inclusive and folded as `grade10-site-grading-dropoff-booking-SC-25`; landed as `Q53` |
| `grade10-site-grading-dropoff-booking-US1-TC4-1` | Covered | The requirement's outstanding-read clause, stated with `grade10-site-grading-dropoff-booking-SC-08`; the skeleton itself is presentation and is read against the view's story |
| `grade10-site-grading-dropoff-booking-US1-TC5-1` | Covered | `grade10-site-grading-dropoff-booking-SC-07`, applied to every day in the horizon |
| `grade10-site-grading-dropoff-booking-US1-TC6-1` | Covered | `grade10-site-grading-dropoff-booking-SC-03` |
| `grade10-site-grading-dropoff-booking-US1-TC7-1` | Covered | `grade10-site-grading-dropoff-booking-SC-06`; the other three refusals are the requirement's named set |
| `grade10-site-grading-dropoff-booking-US1-TC8-1` | Covered | `grade10-site-grading-dropoff-booking-SC-08` |
| `grade10-site-grading-dropoff-booking-US2-TC1-1` | Folded | The batch reading again after a move reached no scenario; `grade10-site-grading-dropoff-booking-SC-15` gains it as an `AND` |
| `grade10-site-grading-dropoff-booking-US2-TC2-1` | Covered | `grade10-site-grading-dropoff-booking-SC-16` |
| `grade10-site-grading-dropoff-booking-US3-TC1-1` | Covered | `grade10-site-grading-dropoff-booking-SC-18`, `grade10-site-grading-dropoff-booking-SC-19` |
| `grade10-site-grading-dropoff-booking-US3-TC2-1` | Covered | `grade10-site-grading-dropoff-booking-SC-19` |
| `grade10-site-grading-dropoff-booking-US3-TC4-1` | Covered | `grade10-site-grading-dropoff-booking-SC-28` |
| `grade10-site-grading-dropoff-booking-US4-TC1-1` | Covered | `grade10-site-grading-dropoff-booking-SC-20` |
| `grade10-site-grading-dropoff-booking-US4-TC2-1` | Covered | `grade10-site-grading-dropoff-booking-SC-21` |
| `grade10-site-grading-dropoff-booking-US4-TC3-1` | Folded | The Cancels row is `grade10-site-grading-dropoff-booking-SC-22`; the Misses row reached no scenario, and the requirement's "cancels or misses" is folded as `grade10-site-grading-dropoff-booking-SC-27` |
| `grade10-site-grading-dropoff-booking-US5-TC1-1` | Covered | `grade10-site-grading-dropoff-booking-SC-23` |
| `grade10-site-grading-dropoff-booking-US5-TC2-1` | Dropped, `deprecated` | The walk-in books on the diary's own booking-details form, which asks the fields the diary asks for; grading adds no field and no validation of its own, so a refusal on a blank field tests `grade10-site/appointment/booking`, not this capability. Landed as `Q56` |
| `grade10-site-grading-dropoff-booking-US6-TC1-1` | Covered | `grade10-site-grading-dropoff-booking-SC-05`, `grade10-site-grading-dropoff-booking-SC-13` |
| `grade10-site-grading-dropoff-booking-US6-TC2-1` | Covered | `grade10-site-grading-dropoff-booking-SC-05`; the below-twenty partition is the booking requirement's step 2 |
| `grade10-site-grading-dropoff-booking-SC-30` | Case added, added after the run | `grade10-site-grading-dropoff-booking-US6-TC3-1`: decided outside the blind pass; a booked list edited past twenty resizes the visit as a join does, at the same slot |
| `grade10-site-grading-dropoff-booking-SC-01` | Case added | `grade10-site-grading-dropoff-booking-US5-TC3-1` — the booking page lists the Grading visit and neither drop-off |
| `grade10-site-grading-dropoff-booking-SC-11` | Case added | `grade10-site-grading-dropoff-booking-US1-TC9-1` — the estimated day back counts from the day the batch leaves |
| `grade10-site-grading-dropoff-booking-SC-14` | Case added | `grade10-site-grading-dropoff-booking-US1-TC10-1` — the vault line on the booked page |
| `grade10-site-grading-dropoff-booking-SC-17` | Case added | `grade10-site-grading-dropoff-booking-US2-TC3-1`. It also answers the blind pass's question about the window between a visit's start and the shop closing it: Move and Cancel are offered until the start instant and not after. Landed as `Q55` |
| `grade10-site-grading-dropoff-booking-SC-24` | Case added | `grade10-site-grading-dropoff-booking-US5-TC4-1` — the walk-in's cards listed at the desk, with grading silent about the visit |
| `grade10-site-grading-dropoff-booking-SC-26` | Raised, answered, folded and cased | The blind pass could not tell what the page reads after a missed slot and before the diary answers. Answered still booked, folded as `grade10-site-grading-dropoff-booking-SC-26` and walked by `grade10-site-grading-dropoff-booking-US3-TC3-1`; landed as `Q54` |
| `grade10-site-grading-dropoff-booking-SC-29` | Case added, added after the run | `grade10-site-grading-dropoff-booking-US2-TC4-1`: moving the drop-off never offers its own current slot back, since the diary already counts it taken |

### Manual

| Manual | Why |
| --- | --- |
| `grade10-site-grading-dropoff-booking-US1-TC4-1` | The skeleton is a rendering state between two reads; nothing asserts it, and a person reads the shop and day picker against its story while the diary's answer is outstanding |
| `grade10-site-grading-dropoff-booking-US3-TC1-1` | The hour runs from a close made in the shop's diary console, outside grading; a person closes the visit there and reads the submission page and the mailbox after it |
