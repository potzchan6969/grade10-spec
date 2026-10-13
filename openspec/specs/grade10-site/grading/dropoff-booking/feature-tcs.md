# grade10-site/grading/dropoff-booking Test Cases

**Status:** reopened · 0/26
**Reviewed:** 2026-09-29, tcs-rules r4, lapsed 2026-09-30
**Drafts styled:** 2026-09-30, tcs-rules r4

## Background

* The stack is a Grade10 dev or isolated end-to-end stack, started so grading's dev settings and the diary's shop and services stand: PSA's levels as seeded (Regular: ceiling 1170000 minor units a card, back in 5 weeks; Express: ceiling 1950000, a cover line, back in 3 weeks; Bulk: ceiling 150000, twenty cards or more), the batch cut-off Thursday 19:00 `Asia/Hong_Kong`, and the drop-off's horizon of 30 days as the diary seeds it.
* A kept plan is made from Start a submission on <grade10 grading url>: the cards typed one by one, or pasted where there are more than three, About you giving the collector's email, the level picked at the service step, and Book on the review; the page opens at <grade10 grading submission page url> on its Book the drop-off step, which asks for the collection statement's tick first.
* *Seeding a submission* - `POST <grade10 api origin>/grading/dev/submissions/seed` with a fresh `seed`, the `status` the case names, `cards` (one declared value per card, in minor units), an `email` only this run uses, and `createdAt`, `appointmentAt` (the visit) and `readyAt`, all in the past. A seed at `booked` holds a visit the diary does not hold, so the sweep's fast lane closes it as missed. It answers the submission's id and an access token; its page is <grade10 grading submission page url> with that id and `#t=<token>`.
* *Running the sweep* - `POST <grade10 api origin>/grading/dev/sweep` with `lane` `fast`.
* *Reading a letter* - `GET <grade10 api origin>/grading/dev/outbox?email=<collector email>` answers the last letter grading sent that address, where the tester has no inbox for it.

---

## grade10-site-grading-dropoff-booking-US1: Collector books the drop-off from the plan

**As a** collector who has reviewed the plan,
**I want** to pick the shop, a day the diary offers and a time in the shop's own zone, seeing beside the day the batch it makes and the day the cards would leave, and then a booked page and email that say what to bring, that staff check each card against the list, that I sign and then pay, and the estimated day back,
**so that** I arrive at a desk expecting my list, know which batch my cards join, and forget nothing at home.

<!-- trace:case id=g10.grading-dropoff-booking.TC-2kk rev=1 covers=g10.grading-dropoff-booking.SC-l56,g10.grading-dropoff-booking.SC-q6n,g10.grading-dropoff-booking.SC-nt0,g10.grading-dropoff-booking.SC-gbe,g10.grading-dropoff-booking.SC-9xv,g10.grading-dropoff-booking.SC-qk1,g10.grading-dropoff-booking.SC-v5k,g10.grading-dropoff-booking.SC-h89,g10.grading-dropoff-booking.SC-y97,g10.grading-dropoff-booking.SC-uzm,g10.grading-dropoff-booking.SC-wxh,g10.grading-dropoff-booking.SC-leu -->
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

* customer(with a kept plan of <cards in the list> at <level>, no visit booked) is on the Book the drop-off step at <grade10 grading submission page url>, the collection statement ticked.
* The plan was kept from Start a submission on <grade10 grading url>, giving <collector email>, and Book pressed on its review.

**Test data:**

| Field | Value |
| --- | --- |
| <cards in the list> | 6 cards, each declared HKD 1,000.00 (any count under 20 takes the standard drop-off) |
| <level> | Express (a level whose fee carries a cover line) |
| <collector email> | an address only this run uses, whose inbox the tester reads |
| <picked day> | the Tuesday of a week inside the booking horizon, before that week's Thursday 19:00 cut-off |
| <picked time> | the first time offered on <picked day> |

**Steps:**

1. Click the shop in the shop picker.
2. Click <picked day> in the day picker.
3. Read the batch line beside the day.
4. Click <picked time>, then Book <day, time>.
5. Read the booked page.
6. Open the inbox of <collector email>.

**Expected Results:**

* Step 3: the batch line names hand-in by that Thursday's cut-off and the cards leaving the next day.
* Step 5: the booked page shows the day, the time, the shop and its address, with Add to calendar, Move and Cancel.
* Step 4: the times read in the shop's own zone, Asia/Hong_Kong.
* Step 5: the booked page lists the four Before you come items.
* Step 5: nothing was paid, held or deposited.
* Step 5: the four Before you come items read in order: the cards each in a sleeve, the list, the signature then the fee, the day the cards leave.
* Step 5: the third item names the fee with the cover line beside it.
* Step 5: the fourth item names the day the cards leave and the estimated day back.
* Step 6: a confirmation email has arrived.
* Step 6: the email is grading's own; no message from the diary about the visit arrives.

<!-- trace:case id=g10.grading-dropoff-booking.TC-5ce rev=1 covers=g10.grading-dropoff-booking.SC-l56,g10.grading-dropoff-booking.SC-q6n,g10.grading-dropoff-booking.SC-nt0,g10.grading-dropoff-booking.SC-gbe,g10.grading-dropoff-booking.SC-9xv,g10.grading-dropoff-booking.SC-qk1,g10.grading-dropoff-booking.SC-v5k,g10.grading-dropoff-booking.SC-h89,g10.grading-dropoff-booking.SC-y97,g10.grading-dropoff-booking.SC-uzm,g10.grading-dropoff-booking.SC-wxh,g10.grading-dropoff-booking.SC-leu -->
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

* customer(with a kept plan of 6 cards at Regular, no visit booked) is on the Book the drop-off step at <grade10 grading submission page url>, the collection statement ticked and the shop clicked in the shop picker.

**Test data:**

| Field | Value |
| --- | --- |
| <picked day> | the Friday of a week inside the booking horizon, the day after that week's Thursday 19:00 cut-off |

**Steps:**

1. Click <picked day> in the day picker.
2. Read the batch line beside the day.

**Expected Results:**

* Step 2: the batch line names the following batch's close and ship days rather than the current week's.

<!-- trace:case id=g10.grading-dropoff-booking.TC-tt7 rev=1 covers=g10.grading-dropoff-booking.SC-l56,g10.grading-dropoff-booking.SC-q6n,g10.grading-dropoff-booking.SC-nt0,g10.grading-dropoff-booking.SC-gbe,g10.grading-dropoff-booking.SC-9xv,g10.grading-dropoff-booking.SC-qk1,g10.grading-dropoff-booking.SC-v5k,g10.grading-dropoff-booking.SC-h89,g10.grading-dropoff-booking.SC-y97,g10.grading-dropoff-booking.SC-uzm,g10.grading-dropoff-booking.SC-wxh,g10.grading-dropoff-booking.SC-leu -->
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

* customer(with a kept plan of 6 cards at Regular, no visit booked) is on the Book the drop-off step at <grade10 grading submission page url>, the collection statement ticked and the shop clicked in the shop picker.
* The shop's diary offers a free time at 19:00 on a Thursday inside the booking horizon.

**Test data:**

| Field | Value |
| --- | --- |
| Picked visit day and time | Thursday, 19:00 on the shop's own clock |

**Steps:**

1. Click the Thursday of <Picked visit day and time> in the day picker.
2. Click the 19:00 time.
3. Read the batch line beside the day.

**Expected Results:**

* Step 3: the batch line reads hand-in by that same Thursday's cut-off, with the cards leaving the next day.

<!-- trace:case id=g10.grading-dropoff-booking.TC-80t rev=1 covers=g10.grading-dropoff-booking.SC-l56,g10.grading-dropoff-booking.SC-q6n,g10.grading-dropoff-booking.SC-nt0,g10.grading-dropoff-booking.SC-gbe,g10.grading-dropoff-booking.SC-9xv,g10.grading-dropoff-booking.SC-qk1,g10.grading-dropoff-booking.SC-v5k,g10.grading-dropoff-booking.SC-h89,g10.grading-dropoff-booking.SC-y97,g10.grading-dropoff-booking.SC-uzm,g10.grading-dropoff-booking.SC-wxh,g10.grading-dropoff-booking.SC-leu -->
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
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-dropoff-booking-US-01

**Pre-conditions:**

* customer(with a kept plan of 6 cards at Regular, no visit booked) has <grade10 grading submission page url> open, the collection statement ticked.
* Network conditions are manipulated to hold the diary's answer of shops and slots pending.

**Steps:**

1. Reload the page and scroll to the Book the drop-off step.
2. Read the shop picker and the day picker before the diary answers.

**Expected Results:**

* Step 2: the shop and the days render as loading skeletons; no day reads as bookable yet.

<!-- trace:case id=g10.grading-dropoff-booking.TC-sfa rev=1 covers=g10.grading-dropoff-booking.SC-l56,g10.grading-dropoff-booking.SC-q6n,g10.grading-dropoff-booking.SC-nt0,g10.grading-dropoff-booking.SC-gbe,g10.grading-dropoff-booking.SC-9xv,g10.grading-dropoff-booking.SC-qk1,g10.grading-dropoff-booking.SC-v5k,g10.grading-dropoff-booking.SC-h89,g10.grading-dropoff-booking.SC-y97,g10.grading-dropoff-booking.SC-uzm,g10.grading-dropoff-booking.SC-wxh,g10.grading-dropoff-booking.SC-leu -->
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

* customer(with a kept plan of 6 cards at Regular, no visit booked) is on the Book the drop-off step at <grade10 grading submission page url>, the collection statement ticked.
* The shop's diary offers no free slot anywhere inside the booking horizon: every day from today to the horizon's last day is closed for the shop in the shop's diary console at <grade10 admin appointments url>.

**Steps:**

1. Click the shop in the shop picker.
2. Click each day of the horizon in the day picker in turn.

**Expected Results:**

* Step 2: every day in the horizon reads with nothing free, and none is selectable.

<!-- trace:case id=g10.grading-dropoff-booking.TC-l9y rev=1 covers=g10.grading-dropoff-booking.SC-l56,g10.grading-dropoff-booking.SC-q6n,g10.grading-dropoff-booking.SC-nt0,g10.grading-dropoff-booking.SC-gbe,g10.grading-dropoff-booking.SC-9xv,g10.grading-dropoff-booking.SC-qk1,g10.grading-dropoff-booking.SC-v5k,g10.grading-dropoff-booking.SC-h89,g10.grading-dropoff-booking.SC-y97,g10.grading-dropoff-booking.SC-uzm,g10.grading-dropoff-booking.SC-wxh,g10.grading-dropoff-booking.SC-leu -->
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

* customer(with a kept plan of 6 cards at Regular, no visit booked) is on the Book the drop-off step at <grade10 grading submission page url>, the collection statement ticked and the shop clicked in the shop picker.
* The drop-off service's horizon in the shop's diary is <horizon>, and slots are free on <last horizon day>.

**Test data:**

| Field | Value |
| --- | --- |
| <horizon> | 30 days, as the diary seeds it |
| <last horizon day> | the last day <horizon> reaches from today |
| <first day past> | the day after <last horizon day> |

**Steps:**

1. Page the day picker forward to <last horizon day>.
2. Click <last horizon day>.
3. Click <first day past>.

**Expected Results:**

* Step 2: <last horizon day> is selectable, with its times offered.
* Step 3: <first day past> is disabled and cannot be selected.

<!-- trace:case id=g10.grading-dropoff-booking.TC-qqg rev=1 covers=g10.grading-dropoff-booking.SC-l56,g10.grading-dropoff-booking.SC-q6n,g10.grading-dropoff-booking.SC-nt0,g10.grading-dropoff-booking.SC-gbe,g10.grading-dropoff-booking.SC-9xv,g10.grading-dropoff-booking.SC-qk1,g10.grading-dropoff-booking.SC-v5k,g10.grading-dropoff-booking.SC-h89,g10.grading-dropoff-booking.SC-y97,g10.grading-dropoff-booking.SC-uzm,g10.grading-dropoff-booking.SC-wxh,g10.grading-dropoff-booking.SC-leu -->
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

* customer(with a kept plan of 6 cards at Regular, no visit booked) is on the Book the drop-off step at <grade10 grading submission page url>, having clicked the shop, <picked day> and <picked time>.
* The diary will answer the booking of <picked time> with <Diary's refusal>, reached as <How the refusal is reached> says.

**Test data:**

| Diary's refusal | How the refusal is reached |
| --- | --- |
| The slot is not offered | the diary's answer is mocked |
| The slot is full | in a second browser session, another collector books <picked time>, the day's last free slot, first |
| The slot's resource is not available | the diary's answer is mocked |
| The day is already booked | the diary's answer is mocked |

**Steps:**

1. Click Book <day, time>.
2. Read the drop-off step.

**Expected Results:**

* Step 2: the page reads <Diary's refusal> in the diary's own words.
* Step 2: another day is offered, and the day's times are read again.
* Step 2: the submission holds no visit: no visit card shows on the page.

<!-- trace:case id=g10.grading-dropoff-booking.TC-hg7 rev=1 covers=g10.grading-dropoff-booking.SC-l56,g10.grading-dropoff-booking.SC-q6n,g10.grading-dropoff-booking.SC-nt0,g10.grading-dropoff-booking.SC-gbe,g10.grading-dropoff-booking.SC-9xv,g10.grading-dropoff-booking.SC-qk1,g10.grading-dropoff-booking.SC-v5k,g10.grading-dropoff-booking.SC-h89,g10.grading-dropoff-booking.SC-y97,g10.grading-dropoff-booking.SC-uzm,g10.grading-dropoff-booking.SC-wxh,g10.grading-dropoff-booking.SC-leu -->
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

* customer(with a kept plan of 6 cards at Regular, no visit booked) has <grade10 grading submission page url> open, the collection statement ticked.
* Network conditions are manipulated to fail the diary's read of shops and slots.

**Steps:**

1. Reload the page and scroll to the Book the drop-off step.
2. Read the shop picker and the day picker.

**Expected Results:**

* Step 2: the failure reads in the page's error tone.
* Step 2: no day reads as free, and none can be picked.

<!-- trace:case id=g10.grading-dropoff-booking.TC-wu4 rev=1 covers=g10.grading-dropoff-booking.SC-l56,g10.grading-dropoff-booking.SC-q6n,g10.grading-dropoff-booking.SC-nt0,g10.grading-dropoff-booking.SC-gbe,g10.grading-dropoff-booking.SC-9xv,g10.grading-dropoff-booking.SC-qk1,g10.grading-dropoff-booking.SC-v5k,g10.grading-dropoff-booking.SC-h89,g10.grading-dropoff-booking.SC-y97,g10.grading-dropoff-booking.SC-uzm,g10.grading-dropoff-booking.SC-wxh,g10.grading-dropoff-booking.SC-leu -->
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

* customer(with a kept plan of 1 card at <level>, no visit booked) is on the Book the drop-off step at <grade10 grading submission page url>, the collection statement ticked and the shop clicked in the shop picker.

**Test data:**

| Field | Value |
| --- | --- |
| <level> | Regular, quoted at <weeks back> on the fee sheet |
| <weeks back> | the weeks the fee sheet quotes for <level> (5 on the stack's dev sheet) |
| <picked day> | the Tuesday of a week inside the horizon, before that week's cut-off |
| <ship day> | the day the batch line names the cards leaving, the Friday after <picked day> |

**Steps:**

1. Click <picked day> in the day picker.
2. Read the estimated day back beside it.
3. Click the first time offered, then Book <day, time>.
4. Read the estimated day back in the fourth Before you come item on the booked page.

**Expected Results:**

* Steps 2 and 4: the estimated day back is <ship day> plus <weeks back>.
* It is not <picked day> plus <weeks back>, nor today plus <weeks back>.

<!-- trace:case id=g10.grading-dropoff-booking.TC-77t rev=1 covers=g10.grading-dropoff-booking.SC-l56,g10.grading-dropoff-booking.SC-q6n,g10.grading-dropoff-booking.SC-nt0,g10.grading-dropoff-booking.SC-gbe,g10.grading-dropoff-booking.SC-9xv,g10.grading-dropoff-booking.SC-qk1,g10.grading-dropoff-booking.SC-v5k,g10.grading-dropoff-booking.SC-h89,g10.grading-dropoff-booking.SC-y97,g10.grading-dropoff-booking.SC-uzm,g10.grading-dropoff-booking.SC-wxh,g10.grading-dropoff-booking.SC-leu -->
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

* customer(with a drop-off booked from a kept plan of 1 card at Regular) is on the submission's booked page at <grade10 grading submission page url>.

**Steps:**

1. Read the vault line on the booked page.

**Expected Results:**

* Step 1: the page says a card that is not being graded can open a vault case at the same counter.
* Step 1: it says that case takes the identity check grading itself does not ask for.

---

## grade10-site-grading-dropoff-booking-US2: Collector moves or cancels the drop-off

**As a** collector who cannot make the visit,
**I want** to move or cancel it from the submission page any time before it starts and to be emailed either way,
**so that** a change of plans costs me a minute and not the list.

<!-- trace:case id=g10.grading-dropoff-booking.TC-7t5 rev=1 covers=g10.grading-dropoff-booking.SC-44v,g10.grading-dropoff-booking.SC-9xj,g10.grading-dropoff-booking.SC-mrb,g10.grading-dropoff-booking.SC-wlp,g10.grading-dropoff-booking.SC-1v3 -->
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

* customer(with a drop-off booked from a kept plan of 1 card at Regular under <collector email>, the visit not yet started) is on <grade10 grading submission page url>, opened from the booked email's link.

**Test data:**

| Field | Value |
| --- | --- |
| <collector email> | an address only this run uses, whose inbox the tester reads |
| <new day> | a day inside the horizon other than the one the visit holds |
| <new time> | the first time offered on <new day> |

**Steps:**

1. Click Move on the visit card.
2. Click the shop, then <new day>, and read the batch line.
3. Click <new time>, then Book <day, time>.
4. Read the visit card.
5. Open the inbox of <collector email>.

**Expected Results:**

* Steps 2 and 4: the visit reads <new day> and <new time>, and the batch line reads again for <new day>.
* Steps 2 and 3: the visit card reads the old day and time until step 3 books the new one; the page never holds no visit.
* Step 5: a moved email has arrived naming <new day> and <new time>.

<!-- trace:case id=g10.grading-dropoff-booking.TC-9ic rev=1 covers=g10.grading-dropoff-booking.SC-44v,g10.grading-dropoff-booking.SC-9xj,g10.grading-dropoff-booking.SC-mrb,g10.grading-dropoff-booking.SC-wlp,g10.grading-dropoff-booking.SC-1v3 -->
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

* customer(with a drop-off booked on <held day> at <held time> from a kept plan of 1 card at Regular, the visit not yet started) is on <grade10 grading submission page url>.

**Test data:**

| Field | Value |
| --- | --- |
| <held day>, <held time> | the day and time the visit already holds |
| <times seen when booking> | the free times on <held day> the tester noted before booking the visit |

**Steps:**

1. Click Move on the visit card.
2. Click the shop, then <held day>.
3. Read the times offered.

**Expected Results:**

* Step 3: <held time> is not offered.
* Step 3: every other time in <times seen when booking> is offered as before.

<!-- trace:case id=g10.grading-dropoff-booking.TC-7fc rev=1 covers=g10.grading-dropoff-booking.SC-44v,g10.grading-dropoff-booking.SC-9xj,g10.grading-dropoff-booking.SC-mrb,g10.grading-dropoff-booking.SC-wlp,g10.grading-dropoff-booking.SC-1v3 -->
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

* customer(with a drop-off booked from a kept plan of 1 card at Regular under <collector email>, the visit not yet started) is on <grade10 grading submission page url>.

**Test data:**

| Field | Value |
| --- | --- |
| <collector email> | an address only this run uses, whose inbox the tester reads |

**Steps:**

1. Note the cards and the estimate on the page.
2. Click Cancel visit on the visit card.
3. Confirm the cancel in the dialog.
4. Read the page.
5. Open the inbox of <collector email>.

**Expected Results:**

* Step 4: the visit closes: no visit card shows, and the page reads that the visit closed.
* Step 4: the list and the estimate stay as they were at step 1.
* Step 4: Book another drop-off is offered.
* Step 5: a cancelled email has arrived.

<!-- trace:case id=g10.grading-dropoff-booking.TC-gkc rev=1 covers=g10.grading-dropoff-booking.SC-44v,g10.grading-dropoff-booking.SC-9xj,g10.grading-dropoff-booking.SC-mrb,g10.grading-dropoff-booking.SC-wlp,g10.grading-dropoff-booking.SC-1v3 -->
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

* customer(with a booked drop-off whose start time passed 5 minutes ago and which the shop has not closed) is on <grade10 grading submission page url>.
* The visit was booked for the earliest free time and the tester waited past its start, or, on the local stack, the submission was seeded at Drop-off booked with its visit 5 minutes past and no sweep run since.

**Steps:**

1. Read the booked visit card.

**Expected Results:**

* Step 1: neither Move nor Cancel visit is offered.

<!-- trace:case id=g10.grading-dropoff-booking.TC-tms rev=1 covers=g10.grading-dropoff-booking.SC-44v,g10.grading-dropoff-booking.SC-9xj,g10.grading-dropoff-booking.SC-mrb,g10.grading-dropoff-booking.SC-wlp,g10.grading-dropoff-booking.SC-1v3 -->
### grade10-site-grading-dropoff-booking-US2-TC5-1: A cancelled visit restarts the plan's clock from the day of the cancel

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
* **Trace:** grade10-site-grading-dropoff-booking-US-02

**Pre-conditions:**

* A plan kept 25 days ago, `plan_expiry_days` set to 30, whose visit the collector cancelled today.

**Steps:**

1. Run the plan expiry sweep `plan_expiry_days` after the day the plan was first kept.
2. Run the plan expiry sweep `plan_expiry_days` after today.

**Expected Results:**

* The plan has not expired after step 1.
* The plan expires only once `plan_expiry_days` has run from the day of the cancel, not from the day it was first kept.

---

## grade10-site-grading-dropoff-booking-US3: Collector who missed the drop-off books another

**As a** collector who missed the visit,
**I want** the visit to close once the shop marks it missed, the submission to tell me within the hour with the list and the estimate exactly as they were, and a line on the page to book again,
**so that** one missed day does not cost me the plan.

<!-- trace:case id=g10.grading-dropoff-booking.TC-2cl rev=1 covers=g10.grading-dropoff-booking.SC-qae,g10.grading-dropoff-booking.SC-u2b,g10.grading-dropoff-booking.SC-r0l,g10.grading-dropoff-booking.SC-4vc -->
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

* customer(with a drop-off booked from a kept plan of 2 cards at Regular under <collector email>) booked the visit for the earliest free time, and its start time has passed with nobody at the desk.
* admin(holds appointment:manage) closed that visit as missed in the shop's diary console at <grade10 admin appointments url>, less than an hour ago.

**Test data:**

| Field | Value |
| --- | --- |
| <collector email> | an address only this run uses, whose inbox the tester reads |

**Steps:**

1. Open <grade10 grading submission page url> from the booked email's link.
2. Read the page's status word, chip, list and estimate.
3. Open the inbox of <collector email>.

**Expected Results:**

* Step 2: the page reads Drop-off booked with the visit closed and the chip Waiting on you.
* Steps 2 and 3: the list and the estimate show exactly as they were, and a missed email confirms it.
* Step 2: a Book another drop-off line is offered.

<!-- trace:case id=g10.grading-dropoff-booking.TC-dxx rev=1 covers=g10.grading-dropoff-booking.SC-qae,g10.grading-dropoff-booking.SC-u2b,g10.grading-dropoff-booking.SC-r0l,g10.grading-dropoff-booking.SC-4vc -->
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

* customer(whose submission of 2 cards shows a missed visit with the Book another drop-off line) is on <grade10 grading submission page url>.
* The missed visit was closed as missed in the shop's diary console, or, on the local stack, the submission was seeded at Drop-off booked with its visit 2 hours past and the sweep's fast lane run.

**Steps:**

1. Note the cards and the estimate on the page.
2. Click Book another drop-off.
3. Tick the collection statement where the step asks for it.
4. Click the shop, a day inside the horizon and its first free time, then Book <day, time>.
5. Read the page.

**Expected Results:**

* Step 5: the new visit books against the same list and estimate noted at step 1.
* Step 5: the submission reads Drop-off booked with the new day.

<!-- trace:case id=g10.grading-dropoff-booking.TC-xy1 rev=1 covers=g10.grading-dropoff-booking.SC-qae,g10.grading-dropoff-booking.SC-u2b,g10.grading-dropoff-booking.SC-r0l,g10.grading-dropoff-booking.SC-4vc -->
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

<!-- trace:case id=g10.grading-dropoff-booking.TC-wx2 rev=1 covers=g10.grading-dropoff-booking.SC-qae,g10.grading-dropoff-booking.SC-u2b,g10.grading-dropoff-booking.SC-r0l,g10.grading-dropoff-booking.SC-4vc -->
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

* customer(with a drop-off booked under <collector email>, whose start time passed 2 hours ago with nobody at the desk, and which the shop's diary console has not yet closed) is on <grade10 grading submission page url>.
* On the local stack, the submission was seeded at Drop-off booked with its visit 2 hours past, and no sweep has run since.

**Test data:**

| Field | Value |
| --- | --- |
| <collector email> | an address only this run uses, whose inbox the tester reads |

**Steps:**

1. Read the page's status word and the visit card.
2. Open the inbox of <collector email>.

**Expected Results:**

* Step 1: the page still reads Drop-off booked and holds the visit.
* Step 2: no missed email has been sent.

---

## grade10-site-grading-dropoff-booking-US4: Collector brings a second submission to the same drop-off

**As a** collector whose cards need two levels,
**I want** the second submission to join the drop-off the first one booked, listed under the same day and time with the slot sized for both lists,
**so that** I make one trip to the shop.

<!-- trace:case id=g10.grading-dropoff-booking.TC-fx7 rev=1 covers=g10.grading-dropoff-booking.SC-xaq,g10.grading-dropoff-booking.SC-tgw,g10.grading-dropoff-booking.SC-shj,g10.grading-dropoff-booking.SC-mb2 -->
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

* customer(with a first submission of 1 card at Regular whose drop-off is booked under <collector email>) has kept a second plan of 1 card at Express under the same email, and is on its Book the drop-off step at <grade10 grading submission page url>, the collection statement ticked.

**Test data:**

| Field | Value |
| --- | --- |
| <collector email> | an address only this run uses |
| <owner's visit> | the day and time the first submission's visit card reads |

**Steps:**

1. Read the second submission's Book the drop-off step.
2. Reload the second submission's page and read its visit card.

**Expected Results:**

* Step 1: no shop or day picker is shown; the step reads the existing visit as joined instead.
* Step 2: the second submission's page shows <owner's visit> and its shop, read through the owning submission.

<!-- trace:case id=g10.grading-dropoff-booking.TC-dgw rev=1 covers=g10.grading-dropoff-booking.SC-xaq,g10.grading-dropoff-booking.SC-tgw,g10.grading-dropoff-booking.SC-shj,g10.grading-dropoff-booking.SC-mb2 -->
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

* customer(whose first submission of <first list> has its drop-off booked at the standard visit under <collector email>) has kept a second plan of <second list> under the same email, the two lists' combined count passing twenty.

**Test data:**

| Field | Value |
| --- | --- |
| <first list> | 12 cards at Regular, each declared HKD 100.00 |
| <second list> | 9 cards at Express, each declared HKD 100.00 |
| <collector email> | an address only this run uses |

**Steps:**

1. Open the second submission at <grade10 grading submission page url> and tick the collection statement, so it joins the first submission's visit.
2. Read the joined line on the second submission's page.
3. Read the visit in the shop's diary console at <grade10 admin appointments url>.

**Expected Results:**

* Steps 2 and 3: the visit is the longer Bulk service at the same day and time, moved once in the diary and never cancelled.

<!-- trace:case id=g10.grading-dropoff-booking.TC-ivv rev=1 covers=g10.grading-dropoff-booking.SC-xaq,g10.grading-dropoff-booking.SC-tgw,g10.grading-dropoff-booking.SC-shj,g10.grading-dropoff-booking.SC-mb2 -->
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

* customer(with a second submission of 1 card at Express joined to the visit a first submission of 1 card at Regular owns, both under <collector email>).

**Test data:**

| Owner's action | How the tester makes it |
| --- | --- |
| Cancels the visit | on the owning submission's page, click Cancel visit and confirm the cancel |
| Misses the visit | book the owner's visit for the earliest free time, let its start pass, and close it as missed in the shop's diary console at <grade10 admin appointments url> |

**Steps:**

1. Note the joiner's cards and estimate on its page.
2. Make the owning submission <Owner's action>, as the row says.
3. Open the joiner's submission page at <grade10 grading submission page url>.
4. Open the inbox of <collector email>.

**Expected Results:**

* Step 3: the joiner's page holds no visit and reads that the visit closed, with the list and the estimate as noted at step 1.
* Steps 3 and 4: a Book another drop-off line is offered, and a letter tells the joiner the visit ended.

---

## grade10-site-grading-dropoff-booking-US5: Walk-in books a drop-off without a list

**As a** collector who does not want to list cards on my phone,
**I want** to book the Grading visit with a name and an email and have the cards listed with me at the counter,
**so that** I can still hand cards in on a booked slot.

<!-- trace:case id=g10.grading-dropoff-booking.TC-rrq rev=1 covers=g10.grading-dropoff-booking.SC-55a,g10.grading-dropoff-booking.SC-qam,g10.grading-dropoff-booking.SC-nqy -->
### grade10-site-grading-dropoff-booking-US5-TC1-1: Walk-in books the Grading visit with a name and email

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-dropoff-booking-US-05

**Pre-conditions:**

* customer(with no card list) is on <grade10 booking page url> with the Grading visit selected.
* admin(holds grading:read) is signed in to the console in a browser of their own.

**Test data:**

| Field | Value |
| --- | --- |
| <walk-in name> | Walk In Collector |
| <walk-in email> | an address only this run uses, whose inbox the tester reads |

**Steps:**

1. Click the shop, a day inside the horizon and its first free time.
2. Enter <walk-in name> and <walk-in email> in the booking details.
3. Confirm the booking.
4. Open the inbox of <walk-in email>.
5. In the console, open the queue at <grade10 admin grading queue url> and look for a grading submission under <walk-in email>.

**Expected Results:**

* Steps 3 and 4: the visit books with no card list attached.
* Step 5: no grading submission is created: the queue holds none under <walk-in email>.

<!-- trace:case id=g10.grading-dropoff-booking.TC-1si rev=1 covers=g10.grading-dropoff-booking.SC-55a,g10.grading-dropoff-booking.SC-qam,g10.grading-dropoff-booking.SC-nqy -->
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

<!-- trace:case id=g10.grading-dropoff-booking.TC-iw2 rev=1 covers=g10.grading-dropoff-booking.SC-55a,g10.grading-dropoff-booking.SC-qam,g10.grading-dropoff-booking.SC-nqy -->
### grade10-site-grading-dropoff-booking-US5-TC3-1: The booking page lists the Grading visit and neither drop-off

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-dropoff-booking-US-05

**Pre-conditions:**

* customer(with no card list) is on <grade10 booking page url>.

**Steps:**

1. Read the services the page offers.

**Expected Results:**

* Step 1: the Grading visit is listed.
* Step 1: neither the Grading drop-off nor its Bulk variant is offered there.

<!-- trace:case id=g10.grading-dropoff-booking.TC-4q1 rev=1 covers=g10.grading-dropoff-booking.SC-55a,g10.grading-dropoff-booking.SC-qam,g10.grading-dropoff-booking.SC-nqy -->
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

* customer(with no card list) booked a Grading visit on <grade10 booking page url> under <walk-in email>, and is at the counter on its day.
* admin(holds grading:operate) is on the Walk-in desk at <grade10 admin grading walk-in url>.

**Test data:**

| Field | Value |
| --- | --- |
| <walk-in email> | the address the Grading visit was booked under, whose inbox the tester reads |
| <first card> | one card at Regular, declared HKD 1,000.00 |

**Steps:**

1. On the Walk-in desk, enter <walk-in email>, the name and the phone, the grader, Regular, the shop and <first card>, then click Open the submission.
2. Hand the submission in from the Hand-in runbook with the collector at the desk.
3. Read the submission the desk created, on its page in the console.
4. Open the inbox of <walk-in email>.

**Expected Results:**

* Step 3: the submission is created at the desk and handed in from there.
* Step 4: grading sent no booked, moved, cancelled or missed message about that visit.

---

## grade10-site-grading-dropoff-booking-US6: Dealer books the longer Bulk drop-off

**As a** collector dealing in cards, twenty or more at a time,
**I want** the booking to take the longer Bulk drop-off with its slots, and the booked page to say how long the visit takes,
**so that** the desk has the time to check every card and I am not sent away with half a box.

<!-- trace:case id=g10.grading-dropoff-booking.TC-t5j rev=1 covers=g10.grading-dropoff-booking.SC-hgq,g10.grading-dropoff-booking.SC-09j,g10.grading-dropoff-booking.SC-he4 -->
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

* customer(a dealer with a kept plan of <cards in the list> at Bulk, no visit booked) is on the Book the drop-off step at <grade10 grading submission page url>, the collection statement ticked.

**Test data:**

| Field | Value |
| --- | --- |
| <cards in the list> | 20 cards, each declared HKD 100.00 (twenty or more) |

**Steps:**

1. Read the step's lead, then click the shop and a day inside the horizon.
2. Click the first time offered, then Book <day, time>.
3. Read the booked page.

**Expected Results:**

* Step 1: the Bulk drop-off's longer slots, about 45 minutes, are offered rather than the standard visit.
* Step 3: the booked page names the visit's length as about 45 minutes.

<!-- trace:case id=g10.grading-dropoff-booking.TC-nen rev=1 covers=g10.grading-dropoff-booking.SC-hgq,g10.grading-dropoff-booking.SC-09j,g10.grading-dropoff-booking.SC-he4 -->
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

* customer(with a kept plan of <Cards in the list> cards at <Level>, each declared HKD 100.00, no visit booked) is on the Book the drop-off step at <grade10 grading submission page url>, the collection statement ticked.

**Test data:**

| Cards in the list | Level | Slot offered |
| --- | --- | --- |
| 19 | Regular | The standard visit |
| 20 | Bulk, the only level open at twenty | The Bulk drop-off |

**Steps:**

1. Read the step's lead.
2. Click the shop and a day inside the horizon.

**Expected Results:**

* Steps 1 and 2: the slot offered matches <Slot offered>.

<!-- trace:case id=g10.grading-dropoff-booking.TC-bdo rev=1 covers=g10.grading-dropoff-booking.SC-hgq,g10.grading-dropoff-booking.SC-09j,g10.grading-dropoff-booking.SC-he4 -->
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

* customer(with a submission of 15 cards at Regular, each declared HKD 100.00, and a standard drop-off booked on it) is on <grade10 grading submission page url>, the visit not started.

**Test data:**

| Field | Value |
| --- | --- |
| <booked slot> | the day and time the visit card reads before the edit |
| <added cards> | 7 cards, each declared HKD 100.00 |

**Steps:**

1. Click Edit the list.
2. Add <added cards> to make 22, pick Bulk at the service step, and click Save changes.
3. Read the drop-off on the submission page.
4. Read the visit in the shop's diary console at <grade10 admin appointments url>.

**Expected Results:**

* Step 3: the visit is the Bulk drop-off, about 45 minutes, at <booked slot>.
* Step 4: the diary moved the visit once and never cancelled it.

---

## Settled

- The grading visit is no longer booked through grading: the booking is owned by the standalone appointments change (`add-multi-store-appointments`) and the product no longer books its own visits, so `grade10-site-grading-dropoff-booking-US5-TC1-1` and `grade10-site-grading-dropoff-booking-US5-TC3-1` are `deprecated` and their walk, `grading/dropoff.spec.ts`, is gone.
- A walk-in booking refused on a blank name or email is not this capability's rule: the walk-in books on the diary's own booking-details form, and grading adds no field and no validation of its own, so the refusal belongs to `grade10-site/appointment/booking`

## Reconciliation

**Run:** the blind pass read the isolated bundle — this capability's `## Purpose` and `## Feature set`, its `user-journeys.md`, the change's `proposal.md` and `decisions.md` with its `## Raised` table, `ui-design.md` with the state dispositions stripped, and the PRD sections the proposal links. It was denied every `## Requirements` section, `openspec/specs/` entirely, `openspec/changes/archive/` entirely, and `tech-design.md`. Nineteen cases over six journeys came back against twenty-four scenarios; the two readings are joined below on the journey anchors. Scenario ids stripped at review, 2026-09-29.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `grade10-site-grading-dropoff-booking-US1-TC1-1` | Covered | The booked visit, the batch named before the cut-off and the booked page; one expected result added so the case also reaches the other half of the booked-message rule, that the diary sends nothing of its own |
| `grade10-site-grading-dropoff-booking-US1-TC2-1` | Covered | The day past the cut-off naming the next batch |
| `grade10-site-grading-dropoff-booking-US1-TC3-1` | Raised, answered, folded | The blind pass could not tell whether a visit at the cut-off instant falls in that week's batch. Answered inclusive and folded as a scenario; landed as Q53 |
| `grade10-site-grading-dropoff-booking-US1-TC4-1` | Covered | The requirement's outstanding-read clause, stated beside the failed read; the skeleton itself is presentation and is read against the view's story |
| `grade10-site-grading-dropoff-booking-US1-TC5-1` | Covered | The day with nothing free, applied to every day in the horizon |
| `grade10-site-grading-dropoff-booking-US1-TC6-1` | Covered | The day past the service's horizon |
| `grade10-site-grading-dropoff-booking-US1-TC7-1` | Covered | The slot taken meanwhile; the other three refusals are the requirement's named set |
| `grade10-site-grading-dropoff-booking-US1-TC8-1` | Covered | The diary that cannot be read |
| `grade10-site-grading-dropoff-booking-US2-TC1-1` | Folded | The batch reading again after a move reached no scenario; the move's scenario gains it as an `AND` |
| `grade10-site-grading-dropoff-booking-US2-TC2-1` | Covered | The cancelled visit leaving the list as it was |
| `grade10-site-grading-dropoff-booking-US3-TC1-1` | Covered | The visit nobody started, closed within the hour, and the list surviving the miss |
| `grade10-site-grading-dropoff-booking-US3-TC2-1` | Covered | The list surviving the miss, booked again |
| `grade10-site-grading-dropoff-booking-US3-TC4-1` | Covered | The plan's clock restarting from the day of the miss |
| `grade10-site-grading-dropoff-booking-US4-TC1-1` | Covered | The second submission joining the first one's drop-off |
| `grade10-site-grading-dropoff-booking-US4-TC2-1` | Covered | Two lists passing twenty taking the longer visit at the same slot |
| `grade10-site-grading-dropoff-booking-US4-TC3-1` | Folded | The Cancels row is the owner's cancel; the Misses row reached no scenario, and the requirement's "cancels or misses" is folded as a scenario of its own |
| `grade10-site-grading-dropoff-booking-US5-TC1-1` | Covered | The walk-in booking the Grading visit with a name and an email |
| `grade10-site-grading-dropoff-booking-US5-TC2-1` | Dropped, `deprecated` | The walk-in books on the diary's own booking-details form, which asks the fields the diary asks for; grading adds no field and no validation of its own, so a refusal on a blank field tests `grade10-site/appointment/booking`, not this capability. Landed as Q56 |
| `grade10-site-grading-dropoff-booking-US6-TC1-1` | Covered | Twenty cards taking the Bulk visit, and the Bulk booking said to take about 45 minutes |
| `grade10-site-grading-dropoff-booking-US6-TC2-1` | Covered | Twenty cards taking the Bulk visit; the below-twenty partition is the booking requirement's step 2 |
| A booked list edited past twenty | Case added, added after the run | `grade10-site-grading-dropoff-booking-US6-TC3-1`: decided outside the blind pass; a booked list edited past twenty resizes the visit as a join does, at the same slot |
| The booking surface listing the visit and neither drop-off | Case added | `grade10-site-grading-dropoff-booking-US5-TC3-1` — the booking page lists the Grading visit and neither drop-off |
| The day back counted from the ship day | Case added | `grade10-site-grading-dropoff-booking-US1-TC9-1` — the estimated day back counts from the day the batch leaves |
| The vault on the same visit | Case added | `grade10-site-grading-dropoff-booking-US1-TC10-1` — the vault line on the booked page |
| Neither move nor cancel once the visit has started | Case added | `grade10-site-grading-dropoff-booking-US2-TC3-1`. It also answers the blind pass's question about the window between a visit's start and the shop closing it: Move and Cancel are offered until the start instant and not after. Landed as Q55 |
| The walk-in's cards listed at the desk | Case added | `grade10-site-grading-dropoff-booking-US5-TC4-1` — the walk-in's cards listed at the desk, with grading silent about the visit |
| The page reading booked until the diary answers | Raised, answered, folded and cased | The blind pass could not tell what the page reads after a missed slot and before the diary answers. Answered still booked, folded as a scenario and walked by `grade10-site-grading-dropoff-booking-US3-TC3-1`; landed as Q54 |
| A move never offering its own slot back | Case added, added after the run | `grade10-site-grading-dropoff-booking-US2-TC4-1`: moving the drop-off never offers its own current slot back, since the diary already counts it taken |
| A cancelled visit restarting the plan's clock | Case added, added after the run | `grade10-site-grading-dropoff-booking-US2-TC5-1`: decided at landing; a visit cancelled without a hand-in restarts the plan's clock from the day of the cancel, as a missed one does |

### Manual

| Manual | Why |
| --- | --- |
| `grade10-site-grading-dropoff-booking-US1-TC4-1` | The skeleton is a rendering state between two reads; nothing asserts it, and a person reads the shop and day picker against its story while the diary's answer is outstanding |
| `grade10-site-grading-dropoff-booking-US3-TC1-1` | The hour runs from a close made in the shop's diary console, outside grading; a person closes the visit there and reads the submission page and the mailbox after it |
