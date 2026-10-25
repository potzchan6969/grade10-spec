# grade10-site/grading/dropoff-booking Test Cases

**Status:** pending-review · 0/13
**Drafts styled:** 2026-10-25, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7

## Background

* PSA's levels stand as seeded: Regular back in 5 weeks; Express with a cover line, back in 3 weeks; Bulk the only level open at twenty cards or more. The batch cut-off is Thursday 19:00 on the shop's clock, Hong Kong's, the cards leaving the Friday after; the drop-off service's horizon is 30 days.
* A kept plan is made from Start a submission on the Grade10 site, giving `<collector email>`, a mailbox only this run uses, which the tester reads. Its page, `<submission page>`, holds the Book the drop-off step, the collection statement ticked before it.
* The shop's diary console on the admin console is where staff holding `appointment:manage` close a visit as missed, and where a visit's service and moves read.

## g10.grading-dropoff-booking.US1: Collector books the drop-off from the plan

**As a** collector who has reviewed the plan,
**I want** to pick the shop, a day the diary offers and a time in the shop's own zone, seeing beside the day the batch it makes and the day the cards would leave, and then a booked page and email that say what to bring, that staff check each card against the list, that I sign and then pay, and the estimated day back,
**so that** I arrive at a desk expecting my list, know which batch my cards join, and forget nothing at home.

<!-- trace:case id=g10.grading-dropoff-booking.TC-2kk rev=1 covers=g10.grading-dropoff-booking.SC-l56,g10.grading-dropoff-booking.SC-q6n,g10.grading-dropoff-booking.SC-nt0,g10.grading-dropoff-booking.SC-gbe,g10.grading-dropoff-booking.SC-9xv,g10.grading-dropoff-booking.SC-qk1,g10.grading-dropoff-booking.SC-v5k,g10.grading-dropoff-booking.SC-h89,g10.grading-dropoff-booking.SC-y97,g10.grading-dropoff-booking.SC-uzm,g10.grading-dropoff-booking.SC-wxh,g10.grading-dropoff-booking.SC-leu -->
### g10.grading-dropoff-booking.US1-TC1: The collector books a drop-off, the batch named by the cut-off, and the booked page says what to bring

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-dropoff-booking-US-01

**Pre-conditions:**

* A collector is on the Book the drop-off step of a kept plan of 6 cards at Express, each declared HKD 1,000.00, no visit booked.

**Test data:**

| `<picked>` | `<batch line>` |
| --- | --- |
| the Tuesday of a week inside the horizon, its first time | closing that Thursday at 19:00, the cards leaving that Friday |
| that Thursday at 19:00 exactly | closing at that same instant, the cards leaving that Friday |
| that Friday, the day after the cut-off | closing the following Thursday, the cards leaving the day after |

**Steps:**

1. Click the shop, then the day of `<picked>`, and read the batch line and the estimated day back.
2. Click the time of `<picked>`, then Book, and read the booked page.
3. Open `<collector email>`.

**Expected Results:**

* Step 1's batch line names the batch `<batch line>`; the day back is the leaving day plus 3 weeks, not the visit day or today plus 3 weeks; the times read in the shop's own zone.
* Step 2's page shows the day, the time, the shop and its address, with Add to calendar, Move and Cancel; nothing was paid, held or deposited.
* Its four Before you come items read in order: the cards each in a sleeve, the list, the signature then the fee with the cover line beside it, and the day the cards leave with the estimated day back; it says a card not being graded can open a vault case at the same counter, which takes the identity check grading does not ask.
* Step 3 holds grading's booked email, and nothing from the diary about the visit.

<!-- trace:case id=g10.grading-dropoff-booking.TC-sfa rev=1 covers=g10.grading-dropoff-booking.SC-l56,g10.grading-dropoff-booking.SC-q6n,g10.grading-dropoff-booking.SC-nt0,g10.grading-dropoff-booking.SC-gbe,g10.grading-dropoff-booking.SC-9xv,g10.grading-dropoff-booking.SC-qk1,g10.grading-dropoff-booking.SC-v5k,g10.grading-dropoff-booking.SC-h89,g10.grading-dropoff-booking.SC-y97,g10.grading-dropoff-booking.SC-uzm,g10.grading-dropoff-booking.SC-wxh,g10.grading-dropoff-booking.SC-leu -->
### g10.grading-dropoff-booking.US1-TC5: A day the diary cannot offer is not pickable

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-dropoff-booking-US-01

**Pre-conditions:**

* A collector is on the Book the drop-off step of a kept plan of 6 cards at Regular; `<diary>`.

**Test data:**

| `<diary>` | `<day picker reads>` |
| --- | --- |
| every day of the horizon closed for the shop in the diary console | each day saying it has nothing free, with no time offered |
| free slots up to the horizon's last day | the day after that last day disabled |
| the read of shops and slots failing | the failure in the page's error tone, no day free |

**Steps:**

1. Click the shop, and each day up to the one after the horizon's last.

**Expected Results:**

* It reads `<day picker reads>`; no day it cannot offer can be picked.

<!-- trace:case id=g10.grading-dropoff-booking.TC-qqg rev=1 covers=g10.grading-dropoff-booking.SC-l56,g10.grading-dropoff-booking.SC-q6n,g10.grading-dropoff-booking.SC-nt0,g10.grading-dropoff-booking.SC-gbe,g10.grading-dropoff-booking.SC-9xv,g10.grading-dropoff-booking.SC-qk1,g10.grading-dropoff-booking.SC-v5k,g10.grading-dropoff-booking.SC-h89,g10.grading-dropoff-booking.SC-y97,g10.grading-dropoff-booking.SC-uzm,g10.grading-dropoff-booking.SC-wxh,g10.grading-dropoff-booking.SC-leu -->
### g10.grading-dropoff-booking.US1-TC7: A slot the diary refuses at the booking reads in the diary's own words and holds no visit

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-dropoff-booking-US-01

**Pre-conditions:**

* A collector has clicked the shop, a day and a time on a kept plan's Book the drop-off step; the diary will answer `<refusal>`.

**Test data:**

| `<refusal>` | `<reached by>` |
| --- | --- |
| the slot is full | another collector booking the day's last free slot first, in a second session |
| the slot is not offered | a mocked answer |
| the slot's resource is not available | a mocked answer |
| the day is already booked | a mocked answer |

**Steps:**

1. Click Book.

**Expected Results:**

* The page reads `<refusal>` in the diary's own words, offers another day and reads the day's times again; no visit card shows.

---

## g10.grading-dropoff-booking.US2: Collector moves or cancels the drop-off

**As a** collector who cannot make the visit,
**I want** to move or cancel it from the submission page any time before it starts and to be emailed either way,
**so that** a change of plans costs me a minute and not the list.

<!-- trace:case id=g10.grading-dropoff-booking.TC-7t5 rev=1 covers=g10.grading-dropoff-booking.SC-44v,g10.grading-dropoff-booking.SC-9xj,g10.grading-dropoff-booking.SC-mrb,g10.grading-dropoff-booking.SC-wlp,g10.grading-dropoff-booking.SC-1v3 -->
### g10.grading-dropoff-booking.US2-TC1: The collector moves the drop-off, never offered its own slot back, and is told

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-dropoff-booking-US-02

**Pre-conditions:**

* A collector's plan of 1 card at Regular holds a visit not yet started; they noted the day's free times when booking it.

**Steps:**

1. Open `<submission page>` from the booked email, click Move, then the shop and the day the visit holds.
2. Pick another day inside the horizon and its first time, and read the batch line.
3. Click Book, and read the visit card; open `<collector email>`.

**Expected Results:**

* Step 1 offers every time noted but the visit's own.
* Step 2 reads the batch for the new day; the card reads the old visit until step 3 books, the page never holding none.
* Step 3's card reads the new day and time, and a moved email names them.

<!-- trace:case id=g10.grading-dropoff-booking.TC-7fc rev=1 covers=g10.grading-dropoff-booking.SC-44v,g10.grading-dropoff-booking.SC-9xj,g10.grading-dropoff-booking.SC-mrb,g10.grading-dropoff-booking.SC-wlp,g10.grading-dropoff-booking.SC-1v3 -->
### g10.grading-dropoff-booking.US2-TC2: Cancelling the drop-off keeps the list and the estimate

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-dropoff-booking-US-02

**Pre-conditions:**

* A collector's plan of 1 card at Regular holds a visit not yet started.

**Steps:**

1. Note the cards and the estimate, click Cancel visit and confirm.
2. Open `<collector email>`.

**Expected Results:**

* Step 1 shows no visit card, reads that the visit closed, keeps the cards and the estimate as noted, and offers Book another drop-off.
* Step 2 holds a cancelled email.

<!-- trace:case id=g10.grading-dropoff-booking.TC-gkc rev=1 covers=g10.grading-dropoff-booking.SC-44v,g10.grading-dropoff-booking.SC-9xj,g10.grading-dropoff-booking.SC-mrb,g10.grading-dropoff-booking.SC-wlp,g10.grading-dropoff-booking.SC-1v3 -->
### g10.grading-dropoff-booking.US2-TC3: Neither Move nor Cancel is offered once the visit has started

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-dropoff-booking-US-02

**Pre-conditions:**

* A collector's booked visit started 5 minutes ago; the shop has not closed it.

**Steps:**

1. Read the visit card on `<submission page>`.

**Expected Results:**

* Neither Move nor Cancel visit is offered.

---

## g10.grading-dropoff-booking.US3: Collector who missed the drop-off books another

**As a** collector who missed the visit,
**I want** the visit to close once the shop marks it missed, the submission to tell me within the hour with the list and the estimate exactly as they were, and a line on the page to book again,
**so that** one missed day does not cost me the plan.

<!-- trace:case id=g10.grading-dropoff-booking.TC-2cl rev=1 covers=g10.grading-dropoff-booking.SC-qae,g10.grading-dropoff-booking.SC-u2b,g10.grading-dropoff-booking.SC-r0l,g10.grading-dropoff-booking.SC-4vc -->
### g10.grading-dropoff-booking.US3-TC1: A missed visit closes within the hour, the list unchanged, and books again on it

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-dropoff-booking-US-03

**Pre-conditions:**

* A collector's plan of 2 cards at Regular had its visit start pass with nobody at the desk; staff closed it as missed in the diary console under an hour ago.

**Steps:**

1. Open `<submission page>` from the booked email, and note its word, chip, cards and estimate; open `<collector email>`.
2. Click Book another drop-off, tick the statement, pick the shop, a day and its first time, and click Book.

**Expected Results:**

* Step 1 reads Drop-off booked with the visit closed and the chip Waiting on you, the cards and the estimate as they were, offering Book another drop-off; a missed email has arrived.
* Step 2 books the new visit on the same cards and estimate, reading Drop-off booked with the new day.

<!-- trace:case id=g10.grading-dropoff-booking.TC-wx2 rev=1 covers=g10.grading-dropoff-booking.SC-qae,g10.grading-dropoff-booking.SC-u2b,g10.grading-dropoff-booking.SC-r0l,g10.grading-dropoff-booking.SC-4vc -->
### g10.grading-dropoff-booking.US3-TC3: The page reads the visit as booked until the diary closes it

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-dropoff-booking-US-03

**Pre-conditions:**

* A collector's visit started 2 hours ago with nobody at the desk; the diary console has not closed it.

**Steps:**

1. Read `<submission page>`, and open `<collector email>`.

**Expected Results:**

* The page still reads Drop-off booked and holds the visit; no missed email has been sent.

---

## g10.grading-dropoff-booking.US4: Collector brings a second submission to the same drop-off

**As a** collector whose cards need two levels,
**I want** the second submission to join the drop-off the first one booked, listed under the same day and time with the slot sized for both lists,
**so that** I make one trip to the shop.

<!-- trace:case id=g10.grading-dropoff-booking.TC-fx7 rev=1 covers=g10.grading-dropoff-booking.SC-xaq,g10.grading-dropoff-booking.SC-tgw,g10.grading-dropoff-booking.SC-shj,g10.grading-dropoff-booking.SC-mb2 -->
### g10.grading-dropoff-booking.US4-TC1: A second submission joins the first one's visit, sized for both lists

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
* **Trace:** grade10-site-grading-dropoff-booking-US-04

**Pre-conditions:**

* A collector's first submission of `<first>` at Regular has its standard drop-off booked; under the same email they kept a second plan of `<second>` at Express, each card declared HKD 100.00.

**Test data:**

| `<first>` | `<second>` | `<visit>` |
| --- | --- | --- |
| 1 card | 1 card | the standard drop-off |
| 12 cards | 9 cards | the Bulk drop-off, moved once in the diary and never cancelled |

**Steps:**

1. Open the second submission's Book the drop-off step, and tick the statement.
2. Reload its page, and read the visit in the diary console.

**Expected Results:**

* Step 1 shows no shop or day picker, reading the visit as joined.
* Step 2 shows the first submission's day, time and shop, the visit `<visit>`.

<!-- trace:case id=g10.grading-dropoff-booking.TC-ivv rev=1 covers=g10.grading-dropoff-booking.SC-xaq,g10.grading-dropoff-booking.SC-tgw,g10.grading-dropoff-booking.SC-shj,g10.grading-dropoff-booking.SC-mb2 -->
### g10.grading-dropoff-booking.US4-TC3: The owner's cancelled or missed visit detaches every joiner

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
* **Trace:** grade10-site-grading-dropoff-booking-US-04

**Pre-conditions:**

* A collector's second submission of 1 card at Express joined the visit a first submission of 1 card at Regular owns.

**Test data:**

| `<owner>` |
| --- |
| cancels the visit from its page |
| misses the visit, closed as missed in the diary console |

**Steps:**

1. Note the joiner's cards and estimate; the owner `<owner>`.
2. Open the joiner's page, and `<collector email>`.

**Expected Results:**

* The joiner holds no visit and reads that the visit closed, its cards and estimate as noted, offering Book another drop-off; a letter tells the joiner the visit ended.

---

## g10.grading-dropoff-booking.US5: Walk-in books a drop-off without a list

**As a** collector who does not want to list cards on my phone,
**I want** to book the Grading visit with a name and an email and have the cards listed with me at the counter,
**so that** I can still hand cards in on a booked slot.

<!-- trace:case id=g10.grading-dropoff-booking.TC-4q1 rev=1 covers=g10.grading-dropoff-booking.SC-55a,g10.grading-dropoff-booking.SC-qam,g10.grading-dropoff-booking.SC-nqy -->
### g10.grading-dropoff-booking.US5-TC4: A walk-in's cards are listed at the desk, and grading says nothing about the visit

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-dropoff-booking-US-05

**Pre-conditions:**

* A collector with no card list booked a Grading visit on the shop's booking page under `<collector email>`, and is at the counter; staff holding `grading:operate` is on the Walk-in desk.

**Steps:**

1. On the Walk-in desk, enter `<collector email>`, the name and phone, the grader, Regular, the shop and one card declared HKD 1,000.00, and click Open the submission.
2. Hand it in from the hand-in runbook.
3. Open `<collector email>`.

**Expected Results:**

* Step 1 creates the submission at the desk, and step 2 hands it in from there.
* Step 3 holds no booked, moved, cancelled or missed message from grading about the visit.

---

## g10.grading-dropoff-booking.US6: Dealer books the longer Bulk drop-off

**As a** collector dealing in cards, twenty or more at a time,
**I want** the booking to take the longer Bulk drop-off with its slots, and the booked page to say how long the visit takes,
**so that** the desk has the time to check every card and I am not sent away with half a box.

<!-- trace:case id=g10.grading-dropoff-booking.TC-t5j rev=1 covers=g10.grading-dropoff-booking.SC-hgq,g10.grading-dropoff-booking.SC-09j,g10.grading-dropoff-booking.SC-he4 -->
### g10.grading-dropoff-booking.US6-TC1: Twenty cards or more book the longer Bulk drop-off, nineteen the standard visit

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
* **Trace:** grade10-site-grading-dropoff-booking-US-06

**Pre-conditions:**

* A collector is on the Book the drop-off step of a kept plan of `<cards>` at `<level>`, each declared HKD 100.00.

**Test data:**

| `<cards>` | `<level>` | `<offered>` |
| --- | --- | --- |
| 19 | Regular | the standard visit's slots |
| 20 | Bulk | the Bulk drop-off's longer slots, about 45 minutes |

**Steps:**

1. Read the step's lead, click the shop and a day, then the first time and Book.
2. Read the booked page.

**Expected Results:**

* Step 1 offers `<offered>`.
* Step 2 names the visit's length where it is the Bulk drop-off, about 45 minutes.

<!-- trace:case id=g10.grading-dropoff-booking.TC-bdo rev=1 covers=g10.grading-dropoff-booking.SC-hgq,g10.grading-dropoff-booking.SC-09j,g10.grading-dropoff-booking.SC-he4 -->
### g10.grading-dropoff-booking.US6-TC3: A booked list edited past twenty cards takes the Bulk drop-off at the same slot

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-dropoff-booking-US-06

**Pre-conditions:**

* A collector's submission of 15 cards at Regular, each declared HKD 100.00, holds a standard drop-off not yet started.

**Steps:**

1. Click Edit the list, add 7 cards to make 22, pick Bulk and click Save changes.
2. Read the drop-off, and the visit in the diary console.

**Expected Results:**

* The visit is the Bulk drop-off, about 45 minutes, at the same day and time, moved once in the diary and never cancelled.

## Settled

- A walk-in booking refused on a blank name or email is `grade10-site/appointment/booking`'s rule: the walk-in books on the diary's own booking-details form, and grading adds no field or validation of its own.

## Reconciliation

### Manual

| Manual | Why |
| --- | --- |
| `g10.grading-dropoff-booking.US3-TC1` | The hour runs from a close made in the shop's diary console, outside grading; a person closes the visit there and reads the page and the mailbox after it |
