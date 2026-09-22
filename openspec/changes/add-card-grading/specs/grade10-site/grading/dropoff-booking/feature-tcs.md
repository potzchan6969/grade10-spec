# grade10-site/grading/dropoff-booking Test Cases

**Status:** pending-review
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
* **Status:** draft
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
