# grade10-admin/grading/batches Test Cases

**Status:** approved
**Reviewed:** 2026-09-29, tcs-rules r4

**Out of suite:**

- `grade10-admin-grading-batches-SC-14` - two operators marking one parcel sent: the backend's concurrency test over the ship act, where the second act meets the batch's shipped stamp under `lockBatch` and is refused by name (`grade10:packages/grading/backend/test/batches/ship.repo.test.ts`). Two admins in two browsers could walk it by hand; the review left it to that test.
- `grade10-admin-grading-batches-SC-33` - finishing a box already finished: the backend's idempotency test over finishing, which the panel offers no second time (`grade10:packages/grading/backend/test/receiving/finish.repo.test.ts`). A finish sent to the worker directly could walk it; the review left it to that test.
- `grade10-admin-grading-batches-SC-42` - two desks handing in against one shelf: the backend's concurrency test over the hand-in, which takes the safe's cap row for update before it counts (`grade10:packages/grading/backend/src/testing/suites/contention.ts`). Two hand-ins at the same moment are timing no person can walk.

## Background

* The stack is a Grade10 dev or isolated end-to-end stack, started so its grading dev settings stand: PSA's levels as seeded (Regular: ceiling 1170000 minor units a card, fee 60000, back in 5 weeks; Express: ceiling 1950000, fee 120000, back in 3 weeks; Super Express: ceiling 3900000, fee 240000, back in 2 weeks), the batch cut-off Thursday 19:00 `Asia/Hong_Kong`, and the safe's declared cap as seeded, 999999999. A case that needs the cap at 30000000 writes it first, as *Writing a money setting* says.
* admin A and admin B each hold the `staff` role, which carries `grading:read`, `grading:operate` and `grading:approve`, and each is signed in to the console in a browser of their own. A case naming one admin means admin A. No shipped role holds `grading:read` alone, so a case naming that grant mocks the operator's grants.
* PSA's stages read, in order: Arrived, Order prep, Research and ID, Grading, Assembly, QA checks, Completed, Shipped. Completed is the stage that is the move to the grades being in.
* *Seeding a submission* - `POST <grade10 api origin>/grading/dev/submissions/seed` with a fresh `seed`, the `status` the case names, `level`, `cards` (one declared value per card, in minor units), an `email` only this run uses, and, where the case gives them, `appointmentAt` (the hand-in) and `readyAt`, all in the past. It walks the submission to that status through the desk's own acts; its hand-in joins a batch of its own, closed at the hand-in's instant, and the batch ships a quarter of the way from the hand-in to `readyAt`. `checked_in` leaves the batch closed and not shipped; `sent` shipped; `graded` shipped with the grades in; `returned` back, unchecked, with the grader's manifest entered whole, a line per card, and no invoice; `ready` received.
* *A batch of several submissions* - each submission is handed in at the counter, from its Hand-in runbook at <grade10 admin grading submission url>, for one grader and one level at the shop before that week's Thursday 19:00 cut-off; each joins the trio's open batch. Seeded submissions never share a batch.
* *Arriving a seeded batch* - a submission seeded at `graded`; on <grade10 admin grading batches url>, Arrived on its batch's row. The batch reads Back, unchecked, with no manifest entered.
* *Typing a manifest* - on the batch's Receive page, one line per card in the manifest lines: intake id, cert, grade, level charged as the sheet's level id (`regular`, `express`), the grader's code, note, separated by commas, then Enter the manifest. The intake ids are read off the batch's cards on each submission's console page.
* *Writing a money setting* - admin A edits the row on <grade10 admin grading settings url>, gives a reason and asks for approval; admin B approves the waiting row in their own console.
* *Reading a letter* - `GET <grade10 api origin>/grading/dev/outbox?email=<collector email>` answers the last letter grading sent that address, and 404 where it sent none.

---

## grade10-admin-grading-batches-US1: Operator ships the batch that closed

**As a** member of shop staff on the day after the cut-off,
**I want** the batch closed at Thursday 19:00 with its packing list, the grader's order number, the courier and tracking, the insured total against the courier's written cover figure and the estimate from the ship day, and one act that marks every submission in it as sent and emails every collector,
**so that** one parcel to one grader at one level leaves with one record.

### grade10-admin-grading-batches-US1-TC1-1: Operator ships a closed batch with a complete ship form

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/batch.spec.ts`

**Pre-conditions:**

* admin(holds grading:operate) is on <grade10 admin grading batches url>.
* <closed batch of one card> stands closed and not shipped.

**Test data:**

| Field | Value |
| --- | --- |
| <closed batch of one card> | one submission seeded at `checked_in` at Regular, its one card declared 500000 (HKD, minor units) |
| Grader's order number | PSA-ORDER-0001 |
| Courier | SF Express |
| Tracking number | SF1000000001 |
| Courier's written cover | 30000000, HKD, above the insured total |
| Shipped on | today |
| Estimated back | <ship day> plus Regular's 5 weeks |

**Steps:**

1. Click Ship on <closed batch of one card>'s row.
2. Tick each check under Before it leaves, the packing list printed among them.
3. Enter the order number, courier, tracking number, courier's written cover with its currency, and Shipped on.
4. Click Mark as shipped.
5. Read the batch's row, and read the letter to the submission's collector.

**Expected Results:**

* Step 4: every submission in the batch moves to With the grader.
* Step 5: every collector in the batch is emailed the tracking and the estimate.
* Step 5: the batch's row reads shipped, with its tracking and estimate.

---

### grade10-admin-grading-batches-US1-TC2-1: A batch still open before its cut-off offers no shipping action

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
* **Trace:** grade10-admin-grading-batches-US-01

**Pre-conditions:**

* admin(holds grading:operate) is on <grade10 admin grading batches url>.
* <open batch> holds one submission handed in at the counter, and its cut-off is still ahead.

**Test data:**

| Field | Value |
| --- | --- |
| <open batch> | a batch at PSA · Regular, one submission handed in at the counter earlier in the week, before that Thursday's 19:00 cut-off |

**Steps:**

1. Read <open batch>'s row.

**Expected Results:**

* Step 1: the row reads Open, building until its cut-off, with no Ship offered, so the ship form cannot be opened on it.

---

### grade10-admin-grading-batches-US1-TC3-1: The ship form refuses a shipped-on date set in the future

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/batch.spec.ts`

**Pre-conditions:**

* admin(holds grading:operate) is on <grade10 admin grading batches url>, with <closed batch of one card> closed and not shipped.

**Test data:**

| Field | Value |
| --- | --- |
| <closed batch of one card> | one submission seeded at `checked_in` at Regular, its one card declared 500000 (HKD, minor units) |
| Grader's order number | PSA-ORDER-0003 |
| Courier | SF Express |
| Tracking number | SF1000000003 |
| Courier's written cover | 30000000, HKD |
| Shipped on | tomorrow on the shop's clock, a day after today |

**Steps:**

1. Click Ship on <closed batch of one card>'s row.
2. Tick each check under Before it leaves, and enter the order number, courier, tracking number and courier's written cover with its currency.
3. Set Shipped on to tomorrow.
4. Click Mark as shipped, where it is offered.
5. Read the batch's row.

**Expected Results:**

* Step 3: the date is refused on the field.
* Step 5: no submission moves to With the grader; the row still reads closed.

---

### grade10-admin-grading-batches-US1-TC4-1: The ship form withholds shipping while a required field is missing

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/batch.spec.ts`

**Pre-conditions:**

* admin(holds grading:operate) is on <grade10 admin grading batches url>, with <closed batch of one card> closed and not shipped.

**Test data:**

| Field | Value |
| --- | --- |
| <closed batch of one card> | one submission seeded at `checked_in` at Regular, its one card declared 500000 (HKD, minor units) |
| Grader's order number | PSA-ORDER-0004 |
| Courier | SF Express |
| Tracking number | left blank |
| Courier's written cover | 30000000, HKD |
| Shipped on | today |

**Steps:**

1. Click Ship on <closed batch of one card>'s row.
2. Tick each check under Before it leaves, and fill every ship form field except the tracking number.
3. Read Mark as shipped and the line beside it.

**Expected Results:**

* Step 3: Mark as shipped is disabled, naming the tracking number field.
* Step 3: the batch's submission still reads Handed in.

---

### grade10-admin-grading-batches-US1-TC5-1: The insured total past the courier's written cover figure is flagged before shipping

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/batch.spec.ts`

**Pre-conditions:**

* admin(holds grading:operate) is on <grade10 admin grading batches url>, with <closed batch of three cards> closed and not shipped.
* The batch's declared total exceeds <the courier's written cover figure>.

**Test data:**

| Field | Value |
| --- | --- |
| <closed batch of three cards> | one submission seeded at `checked_in` at Regular, its three cards declared 500000, 300000 and 200000 (HKD, minor units): an insured total of 1000000 |
| <the courier's written cover figure> | 800000, HKD, below the insured total |

**Steps:**

1. Click Ship on <closed batch of three cards>'s row.
2. Enter <the courier's written cover figure> and its currency.
3. Read the insured line.
4. Click Mark as shipped, where it is offered.
5. Read the form and the batch's row.

**Expected Results:**

* Step 3: the insured line reads in the warning tone.
* Step 5: the act is refused naming 1000000 against 800000 (HKD, minor units), and no submission moves.

---

### grade10-admin-grading-batches-US1-TC6-1: Marking a batch shipped moves every submission in it, however many

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-01

**Pre-conditions:**

* admin(holds grading:operate) is on <grade10 admin grading batches url>.
* <closed batch of three collectors> is closed and not shipped, holding several submissions from different collectors.

**Test data:**

| Field | Value |
| --- | --- |
| <closed batch of three collectors> | three submissions at PSA · Regular of 2, 1 and 5 cards, one each from collectors A, B and C, handed in as *A batch of several submissions* says; walked on the Friday after the cut-off |
| Grader's order number | PSA-ORDER-0006 |
| Courier | SF Express |
| Tracking number | SF1000000006 |
| Courier's written cover | 30000000, HKD |
| Shipped on | today |

**Steps:**

1. Click Ship on <closed batch of three collectors>'s row.
2. Read the packing list.
3. Tick each check under Before it leaves, and enter the fields from **Test data**.
4. Click Mark as shipped.
5. Read each of the three submissions on the queue at <grade10 admin grading queue url>.
6. Read the letter to each of collectors A, B and C.

**Expected Results:**

* Step 2: the packing list carries one line per intake id, 8 lines in all.
* Step 5: every submission in the batch, not only one, moves to With the grader.
* Step 6: every collector among them is emailed once; none is skipped.

---

### grade10-admin-grading-batches-US1-TC7-1: A new batch is opened for one grader and one level

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
* **Trace:** grade10-admin-grading-batches-US-01

**Pre-conditions:**

* admin(holds grading:operate) is on <grade10 admin grading batches url>, with no open batch listed for <Grader> and <Level> at the shop.

**Test data:**

| Field | Value |
| --- | --- |
| Shop | the stack's shop |
| Grader | PSA |
| Level | Super Express |

**Steps:**

1. Click New batch.
2. Pick the shop, <Grader> and <Level>, and confirm the dialog.
3. Read the batches list.
4. Hand in a submission of 1 card at <Grader> · <Level> at the counter, from its Hand-in runbook.
5. Read the batches list.

**Expected Results:**

* Step 3: a batch opens for that grader and that level.
* Step 5: the submission joins the batch opened at step 2, and no second batch is listed for the trio.

---

### grade10-admin-grading-batches-US1-TC8-1: A shop-staff holding only the read grant cannot ship a batch

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-01

**Pre-conditions:**

* admin(holds grading:read) is on <grade10 admin grading batches url>, with <closed batch of one card> closed and not shipped.

**Test data:**

| Field | Value |
| --- | --- |
| <closed batch of one card> | one submission seeded at `checked_in` at Regular, its one card declared 500000 (HKD, minor units) |

**Steps:**

1. Read <closed batch of one card>'s row.

**Expected Results:**

* Step 1: no Ship action is offered.

---

### grade10-admin-grading-batches-US1-TC9-1: The ship form stays busy while a batch is being marked shipped

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** actual
* **Behaviour:** positive
* **Type:** usability
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-batches-US-01

**Pre-conditions:**

* admin(holds grading:operate) has the ship form of <closed batch of one card> open, every check under Before it leaves ticked and every field set as **Test data** lists.
* Network conditions are manipulated to hold the ship act's answer pending.

**Test data:**

| Field | Value |
| --- | --- |
| <closed batch of one card> | one submission seeded at `checked_in` at Regular, its one card declared 500000 (HKD, minor units) |
| Grader's order number | PSA-ORDER-0009 |
| Courier | SF Express |
| Tracking number | SF1000000009 |
| Courier's written cover | 30000000, HKD |
| Shipped on | today |

**Steps:**

1. Click Mark as shipped.
2. Read the form while the act is in flight.

**Expected Results:**

* Step 2: the form shows pending; its actions are disabled until it completes.

---

### grade10-admin-grading-batches-US1-TC10-1: The first submission handed in for a grader and level opens the batch

**Classification:**

* **Severity:** normal
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-01

**Pre-conditions:**

* admin(holds grading:operate) is checking in <first submission> at the counter, on its Hand-in runbook at <grade10 admin grading submission url>, before that week's cut-off.
* No open batch stands for that shop, grader and level.

**Test data:**

| Field | Value |
| --- | --- |
| <first submission> | a booked submission of 2 cards at PSA · Super Express, each declared 500000 (HKD, minor units) |

**Steps:**

1. Check in <first submission> from the Hand-in runbook.
2. Open <grade10 admin grading batches url> and read the rows.

**Expected Results:**

* Step 2: a batch opens for that shop, grader and level, carrying its cut-off.
* Step 2: the submission is listed in it, its 2 cards counted on the row.

---

### grade10-admin-grading-batches-US1-TC11-1: A second submission at the same grader and level joins the standing batch

**Classification:**

* **Severity:** normal
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-01

**Pre-conditions:**

* admin(holds grading:operate) is checking in <second submission> at the counter, on its Hand-in runbook at <grade10 admin grading submission url>, before that week's cut-off.
* <open batch> already stands for that shop, grader and level.

**Test data:**

| Field | Value |
| --- | --- |
| <open batch> | a batch at PSA · Regular, one submission handed in at the counter earlier in the week, before that Thursday's 19:00 cut-off |
| <second submission> | a booked submission of 1 card at PSA · Regular, declared 500000 (HKD, minor units) |

**Steps:**

1. Check in <second submission> from the Hand-in runbook.
2. Open <grade10 admin grading batches url> and read the rows.

**Expected Results:**

* Step 2: the submission joins the standing batch.
* Step 2: no second batch is listed for that shop, grader and level.

---

### grade10-admin-grading-batches-US1-TC12-1: A batch reads Closed once its cut-off passes, with no act

**Classification:**

* **Severity:** normal
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-batches-US-01

**Pre-conditions:**

* admin(holds grading:operate) is on <grade10 admin grading batches url>.
* <open batch> holds submissions handed in at the counter, and Thursday 19:00 on the shop's day has passed with no ship date recorded: it is the Friday morning after.

**Test data:**

| Field | Value |
| --- | --- |
| <open batch> | a batch at PSA · Regular, one submission handed in at the counter earlier in the week, before that Thursday's 19:00 cut-off |

**Steps:**

1. Read <open batch>'s row after the cut-off has passed.
2. Click Ship on the row and read the estimated back on the form.

**Expected Results:**

* Step 1: the batch's row reads Closed, with nobody having acted on it.
* Step 1: the row says it ships that day, the day after the cut-off.
* Step 2: its estimate back is counted from that ship day at the level's weeks, today plus Regular's 5 weeks.

---

### grade10-admin-grading-batches-US1-TC13-1: A submission handed in after the cut-off joins the next batch

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-01

**Pre-conditions:**

* admin(holds grading:operate) is checking in <late submission> at the counter, on its Hand-in runbook, after Thursday 19:00 on the shop's day.
* <open batch> closed at that Thursday 19:00 and is not shipped, at the same shop, grader and level.

**Test data:**

| Field | Value |
| --- | --- |
| <open batch> | a batch at PSA · Regular, one submission handed in at the counter earlier in the week, before that Thursday's 19:00 cut-off |
| <late submission> | a booked submission of 1 card at PSA · Regular, declared 500000 (HKD, minor units), checked in on the Thursday evening after 19:00 or on the Friday before the batch ships |

**Steps:**

1. On <grade10 admin grading batches url>, note the cards <open batch>'s row counts.
2. Check in <late submission> from the Hand-in runbook.
3. Read the batches list again.

**Expected Results:**

* Step 3: the submission joins that trio's next batch, not the closed one.
* Step 3: the closed batch's cards are unchanged from step 1.

---

### grade10-admin-grading-batches-US1-TC14-1: A cover figure in another currency is refused, never converted

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/batch.spec.ts`

**Pre-conditions:**

* admin(holds grading:operate) is on <grade10 admin grading batches url>, with <closed batch of three cards> closed and not shipped.

**Test data:**

| Field | Value |
| --- | --- |
| <closed batch of three cards> | one submission seeded at `checked_in` at Regular, its three cards declared 500000, 300000 and 200000 (HKD, minor units): an insured total of 1000000 |
| Insured total | 1000000 (HKD, minor units), read off the cards |
| Cover figure | 500000 (USD, minor units), as the courier wrote it; converted at any rate it would cover the total, so a refusal can only be the currency's |
| Grader's order number | PSA-ORDER-0014 |
| Courier | SF Express |
| Tracking number | SF1000000014 |
| Shipped on | today |

**Steps:**

1. Click Ship on <closed batch of three cards>'s row.
2. Tick each check under Before it leaves, and enter the order number, courier, tracking number and Shipped on.
3. Record the cover figure with USD as its currency.
4. Click Mark as shipped, where it is offered.
5. Read the form and the batch's row.

**Expected Results:**

* Step 5: the batch is refused because the two figures carry different currencies.
* Step 5: no rate is applied to either figure, and no submission moves.

---

### grade10-admin-grading-batches-US1-TC15-1: The ship form reads the insured total off the batch's cards and will not take a typed figure

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
* **Trace:** grade10-admin-grading-batches-US-01

**Pre-conditions:**

* admin(holds grading:operate) is on <grade10 admin grading batches url>, with <closed batch of three cards> closed and not shipped.

**Test data:**

| Field | Value |
| --- | --- |
| <closed batch of three cards> | one submission seeded at `checked_in` at Regular, its three cards declared 500000, 300000 and 200000 (HKD, minor units) |
| Grader's order number | PSA-ORDER-0015 |
| Courier | SF Express |
| Tracking number | SF1000000015 |
| Courier's written cover | 30000000, HKD |
| Shipped on | today |

**Steps:**

1. Click Ship on <closed batch of three cards>'s row.
2. Read the insured line.
3. Attempt to type over the insured total.
4. Tick each check under Before it leaves, enter the fields from **Test data**, and click Mark as shipped.
5. Read the insured total the shipped batch carries.

**Expected Results:**

* Step 2: the insured total reads 1000000 (HKD, minor units), the sum of the batch's declared values.
* Step 3: the figure cannot be typed over.
* Step 5: once the batch ships, that figure stands on it as the one declared to the courier.

---

### grade10-admin-grading-batches-US1-TC16-1: The batches list puts what waits on the shop first and pages the received batches behind it

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
* **Trace:** grade10-admin-grading-batches-US-01

**Pre-conditions:**

* admin(holds grading:operate) is on <grade10 admin grading batches url>.
* The batches listed under **Test data** stand at the shop, reached as its How column says, on a stack holding no other batch.

**Test data:**

| Field | Value | How |
| --- | --- | --- |
| <row_1> | back from the grader, unchecked | *Arriving a seeded batch* |
| <row_2> | closed, shipping today | a submission seeded at `checked_in`, handed in yesterday |
| <row_3> | with the grader, past its estimate | a submission seeded at `sent` at Regular, handed in 60 days back and `readyAt` 50 days back |
| <row_4> | with the grader, due back in 1 week | a submission seeded at `sent` at Regular, shipped 4 weeks back |
| <row_5> | with the grader, due back in 3 weeks | a submission seeded at `sent` at Regular, shipped 2 weeks back |
| <row_6> | open, before its cut-off | New batch at PSA · Express this week |
| <row_7> | closed, holding no submission handed in | New batch at PSA · Value the week before, left empty past its cut-off |
| Received batches | 60 | 60 submissions seeded at `ready`, each receiving its own batch |

**Steps:**

1. Read the batches panel.
2. Page forward once with Older batches.

**Expected Results:**

* Steps 1 and 2: both pages list <row_1>, <row_2>, <row_3>, <row_4>, <row_5> and <row_6> first, in that order.
* Behind them the 60 received batches and <row_7> follow newest first: 50 on the first page and 11 on the second, none twice and none missing.
* Step 2: the second page offers no further page.
* <row_7> offers no Ship.

---

### grade10-admin-grading-batches-US1-TC17-1: A submission at another level joins its own batch and leaves the open one unchanged

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
* **Trace:** grade10-admin-grading-batches-US-01

**Pre-conditions:**

* admin(holds grading:operate) is checking in <other-level submission> at the counter, on its Hand-in runbook at <grade10 admin grading submission url>, before that week's cut-off.
* <open batch> stands open at the same grader and a different level.

**Test data:**

| Field | Value |
| --- | --- |
| <open batch> | a batch at PSA · Regular, one submission handed in at the counter earlier in the week, before that Thursday's 19:00 cut-off |
| <other-level submission> | a booked submission of 1 card at PSA · Express, declared 500000 (HKD, minor units) |

**Steps:**

1. On <grade10 admin grading batches url>, note the cards <open batch>'s row counts.
2. Check in <other-level submission> from the Hand-in runbook.
3. Read the batches list again.

**Expected Results:**

* Step 3: <other-level submission> joins PSA · Express's own batch instead, not <open batch>.
* Step 3: <open batch> is unchanged, its cards as noted at step 1.

---

## grade10-admin-grading-batches-US2: Operator receives a batch against the grader's manifest

**As a** member of shop staff opening a returned box,
**I want** the manifest and the invoice entered first, a manifest line naming no intake id held until I resolve it, each slab scanned and matched to a card by intake id with a cert already held elsewhere refused by name, an upcharge recorded as the sheet's difference with the invoice reconciled against it, counters of scanned, matched, ungraded and upcharges, a half-scanned batch keeping its scans until I come back, and a finish that makes every submission in the batch ready at once with its pickup code emailed,
**so that** a slab can never be handed to the wrong collector, the collector owes what they were quoted, and nobody is told ready twice.

### grade10-admin-grading-batches-US2-TC1-1: Scanning is withheld until the manifest and the invoice are entered

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/batch.spec.ts`

**Pre-conditions:**

* admin(holds grading:operate) is on <grade10 admin grading batches url>, with <batch back without a manifest> reading Back, unchecked and no manifest or invoice entered.

**Test data:**

| Field | Value |
| --- | --- |
| <batch back without a manifest> | one submission of 2 cards at Regular, each declared 500000 (HKD, minor units), brought back as *Arriving a seeded batch* says |

**Steps:**

1. Click Receive on <batch back without a manifest>'s row.
2. Read the scan bar.

**Expected Results:**

* Step 2: Scan is disabled.
* Step 2: Enter the manifest and the invoice first is shown.

---

### grade10-admin-grading-batches-US2-TC2-1: The manifest and the invoice are entered before the first scan

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/batch.spec.ts`

**Pre-conditions:**

* admin(holds grading:operate) is on the Receive page of <batch back without a manifest>, with no manifest or invoice entered.

**Test data:**

| Field | Value |
| --- | --- |
| <batch back without a manifest> | one submission of 2 cards at Regular, each declared 500000 (HKD, minor units), brought back as *Arriving a seeded batch* says |
| Manifest | one line per intake id in the batch: `<intake id 1>, 90000001, MINT 9, regular,,` and `<intake id 2>, 90000002, NM-MT 8, regular,,`, typed as *Typing a manifest* says |
| Invoice | reference INV-0002, currency USD, total 3000 (minor units) |

**Steps:**

1. Type the manifest lines and click Enter the manifest.
2. Enter the invoice's reference, currency and total, and click Enter the invoice.
3. Read the scan bar and the invoice.

**Expected Results:**

* Step 3: Scan becomes enabled.
* Step 3: the invoice's lines and total are shown.

---

### grade10-admin-grading-batches-US2-TC3-1: Scanning a matched cert records the card as matched

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/batch.spec.ts`

**Pre-conditions:**

* admin(holds grading:operate) has entered the manifest and invoice for <batch back with its manifest>, on its Receive page.
* <a slab> carries a cert on a manifest line naming an intake id in the batch, held by no other submission.

**Test data:**

| Field | Value |
| --- | --- |
| <batch back with its manifest> | one submission of 2 cards at Regular, each declared 500000 (HKD, minor units), seeded at `returned`; its invoice entered as reference INV-0003, USD, 3000 |
| <a slab> | the first card's slab; its cert is the one its manifest line reads in the scan table |

**Steps:**

1. Type <a slab>'s cert in Cert and click Scan.
2. Read the line's row in the scan table and the counters.

**Expected Results:**

* Step 2: the row reads the grade, cert, card and submission, Matched and Scanned.
* Step 2: the scanned and matched counters each rise by one.

---

### grade10-admin-grading-batches-US2-TC4-1: A scan is refused by name when the cert is already held elsewhere

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/batch.spec.ts`

**Pre-conditions:**

* admin(holds grading:operate) has entered the manifest and invoice for <batch back without a manifest>, on its Receive page, its first card's manifest line carrying <a cert>.
* <a cert> is already matched and held by <a submission it belongs to>.

**Test data:**

| Field | Value |
| --- | --- |
| <batch back without a manifest> | one submission of 2 cards at Regular, each declared 500000 (HKD, minor units), brought back as *Arriving a seeded batch* says |
| <a submission it belongs to> | another submission, seeded at `ready` at PSA · Regular |
| <a cert> | the cert on <a submission it belongs to>'s card, read off its console page at <grade10 admin grading submission url> |
| Manifest | the first card's line carrying <a cert>, the second card's line carrying 90000402, typed as *Typing a manifest* says |
| Invoice | reference INV-0004, currency USD, total 3000 (minor units) |

**Steps:**

1. Scan <a cert>, the cert on the first card's line.
2. Read the scan bar and the first card's row.

**Expected Results:**

* Step 2: the scan is refused, naming the submission that already holds the cert.
* Step 2: the second card stays unmatched.
* Step 2: nothing changes on <a submission it belongs to>'s card.

---

### grade10-admin-grading-batches-US2-TC5-1: A scan is refused by name when the cert names no manifest line

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/batch.spec.ts`

**Pre-conditions:**

* admin(holds grading:operate) has entered the manifest and invoice for <batch back with its manifest>, on its Receive page.
* <a cert> appears on no line of the entered manifest.

**Test data:**

| Field | Value |
| --- | --- |
| <batch back with its manifest> | one submission of 2 cards at Regular, each declared 500000 (HKD, minor units), seeded at `returned`; its invoice entered as reference INV-0005, USD, 3000 |
| <a cert> | 99999999, a cert no line of the manifest carries |

**Steps:**

1. Type <a cert> in Cert and click Scan.
2. Read the scan bar and the scan table.

**Expected Results:**

* Step 2: the scan is refused by name.
* Step 2: no card is matched to it.

---

### grade10-admin-grading-batches-US2-TC6-1: A manifest line naming no intake id in the batch is held as unmatched

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/batch.spec.ts`

**Pre-conditions:**

* admin(holds grading:operate) is entering the manifest for <batch back without a manifest>, on its Receive page.
* One manifest line names an intake id that belongs to no submission in the batch.

**Test data:**

| Field | Value |
| --- | --- |
| <batch back without a manifest> | one submission of 2 cards at Regular, each declared 500000 (HKD, minor units), brought back as *Arriving a seeded batch* says |
| <stray intake id> | an intake id read off a card of another batch, which no submission in this batch carries |
| Manifest | a line for each of the batch's 2 cards, and a third line `<stray intake id>, 90000603, MINT 9, regular,,`, typed as *Typing a manifest* says |

**Steps:**

1. Type the manifest lines, the <stray intake id> line among the rest, and click Enter the manifest.
2. Read the manifest lines and Finish receiving.

**Expected Results:**

* Step 2: the line is listed as unmatched.
* Step 2: Finish is held until staff resolve it.

---

### grade10-admin-grading-batches-US2-TC7-1: A card returned with no grade is recorded as ungraded

**Classification:**

* **Severity:** normal
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/batch.spec.ts`

**Pre-conditions:**

* admin(holds grading:operate) has entered the manifest and invoice for <batch back without a manifest>, on its Receive page, <a card>'s manifest line carrying the grader's ungraded code and note, no grade.

**Test data:**

| Field | Value |
| --- | --- |
| <batch back without a manifest> | one submission of 2 cards at Regular, each declared 500000 (HKD, minor units), brought back as *Arriving a seeded batch* says |
| <a card> | the first card; its line `<intake id 1>, 90000701, , regular, N1, Authenticity could not be verified` |
| Invoice | reference INV-0007, currency USD, total 3000 (minor units) |

**Steps:**

1. Scan <a card>'s cert, 90000701.
2. Read its row and the counters.

**Expected Results:**

* Step 2: the card is recorded ungraded, with the grader's code and note.
* Step 2: the ungraded counter rises by one.

---

### grade10-admin-grading-batches-US2-TC8-1: A card moved up a level is recorded as an upcharge reconciled against the invoice

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/batch.spec.ts`

**Pre-conditions:**

* admin(holds grading:operate) has entered the manifest and invoice for <batch back without a manifest>, on its Receive page, <a card the grader moved to a higher level>'s line charged at that level and entered on the invoice at that level's fee.

**Test data:**

| Field | Value |
| --- | --- |
| <batch back without a manifest> | one submission of 2 cards at Regular, each declared 500000 (HKD, minor units), brought back as *Arriving a seeded batch* says |
| <a card the grader moved to a higher level> | the first card; its line `<intake id 1>, 90000801, GEM MT 10, express,,` |
| Booked level's fee, on the pinned sheet | Regular, 60000 (HKD, minor units) a card |
| Charged level's fee, on the pinned sheet | Express, 120000 (HKD, minor units) a card |
| <upcharge> | 60000 (HKD, minor units) |
| Invoice | reference INV-0008, currency HKD, total 120000 (minor units), the card at Express's fee |

**Steps:**

1. Scan the card's cert, 90000801.
2. Read its row, the counters and the invoice figure.

**Expected Results:**

* Step 2: the card is recorded at the fee sheet's difference between the two levels, <upcharge>: Express's fee less Regular's.
* Step 2: the invoice is reconciled against that figure; the upcharges counter and its sum rise.

---

### grade10-admin-grading-batches-US2-TC9-1: An invoice gap against the fee sheet is marked Commercial's

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/batch.spec.ts`

**Pre-conditions:**

* admin(holds grading:operate) has recorded, on the Receive page of <batch back without a manifest>, an upcharge whose invoice figure differs from the fee sheet's difference.

**Test data:**

| Field | Value |
| --- | --- |
| <batch back without a manifest> | one submission of 2 cards at Regular, each declared 500000 (HKD, minor units), brought back as *Arriving a seeded batch* says |
| Manifest | the first card's line `<intake id 1>, 90000901, GEM MT 10, express,,`, the second card's at Regular, typed as *Typing a manifest* says |
| Sheet's difference | 60000 (HKD, minor units), Express's fee less Regular's |
| Invoice | reference INV-0009, currency USD, total 8000 (minor units) |

**Steps:**

1. Scan the first card's cert, 90000901.
2. Review the reconciled upcharge row and the invoice figure.

**Expected Results:**

* Step 2: the invoice's 8000 USD and the sheet's 60000 HKD (minor units) are shown against each other, each with its currency, the gap marked Commercial's.
* Step 2: the card still owes the sheet's difference, 60000 (HKD, minor units).

---

### grade10-admin-grading-batches-US2-TC10-1: A batch saved part-scanned keeps its scans

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/batch.spec.ts`

**Pre-conditions:**

* admin(holds grading:operate) has scanned some, not all, of <batch back of ten cards>'s cards on its Receive page.

**Test data:**

| Field | Value |
| --- | --- |
| <batch back of ten cards> | three submissions at PSA · Regular of 3, 3 and 4 cards (10 in all), each card declared 500000 (HKD, minor units), handed in as *A batch of several submissions* says, then shipped, Completed recorded and Arrived; the manifest typed with a line per card, one line with code N1 and no grade and two at `express`; its invoice entered as reference INV-0010, USD, 15000 |
| Scanned before leaving | 6 certs: the N1 line's, both `express` lines', and three others, as the scan table reads them |
| Upcharge each | 60000 (HKD, minor units), Express's fee less Regular's on the pinned sheet |

**Steps:**

1. Save the batch part-scanned, to finish later.
2. Click Back to the batches.
3. Click Receive on the same batch's row again.
4. Read the scan table, the counters and the batch's word.

**Expected Results:**

* Step 4: every earlier scan is still recorded.
* Step 4: the batch still reads Back, unchecked.
* Step 4: the counters read 6 scanned of 10, 6 matched, 1 ungraded, 2 upcharges summing to 120000 (HKD, minor units), and 3 submissions ready when finished.
* Step 4: no collector has been emailed for a plain scan.

---

### grade10-admin-grading-batches-US2-TC11-1: Finish is held while an unmatched line or an unscanned slab remains

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
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/batch.spec.ts`

**Pre-conditions:**

* admin(holds grading:operate) is on the Receive page of <batch back without a manifest>, its invoice entered, with <Unresolved> left open and every other line scanned.

**Test data:**

| Unresolved | How it is left open |
| --- | --- |
| An unmatched manifest line | the manifest typed with a third line naming an intake id no card in the batch carries |
| A manifest slab not yet scanned | the manifest typed with a line per card, and the second card's cert not scanned |
| Both: an unmatched line and an unscanned card | the manifest typed with a line per card and a third line naming an intake id no card in the batch carries, and the second card's cert not scanned |

**Steps:**

1. Read Finish receiving and the line beside it.

**Expected Results:**

* Step 1: Finish is disabled, naming <Unresolved>, each one named where there are two; no submission moves.

---

### grade10-admin-grading-batches-US2-TC12-1: Finishing receiving readies every submission in the batch at once

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/batch.spec.ts`

**Pre-conditions:**

* admin(holds grading:operate) is on the Receive page of <batch back of three collectors>, every manifest line matched or otherwise resolved.

**Test data:**

| Field | Value |
| --- | --- |
| <batch back of three collectors> | three submissions at PSA · Regular, one each from collectors A, B and C, handed in as *A batch of several submissions* says, then shipped, Completed recorded, Arrived, the manifest and invoice entered and every card scanned |

**Steps:**

1. Click Finish receiving.
2. Read the batch's row on <grade10 admin grading batches url> and each submission on the queue.
3. Read the letter to each of collectors A, B and C.

**Expected Results:**

* Step 2: every submission in the batch moves to Ready to collect together, none left behind.
* Step 3: each collector is emailed the pickup code and what is due, once.
* Step 2: the batch closes with its received date.

---

### grade10-admin-grading-batches-US2-TC13-1: A shop-staff holding only the read grant cannot scan, import or finish

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-02

**Pre-conditions:**

* admin(holds grading:read) is on the Receive page of <batch back without a manifest>.

**Test data:**

| Field | Value |
| --- | --- |
| <batch back without a manifest> | one submission of 2 cards at Regular, each declared 500000 (HKD, minor units), brought back as *Arriving a seeded batch* says |

**Steps:**

1. Read the Receive page's actions.

**Expected Results:**

* Step 1: no Scan, Enter or Finish action is offered.

---

### grade10-admin-grading-batches-US2-TC14-1: A batch recorded arrived back reads back, unchecked and is badged after a day

**Classification:**

* **Severity:** normal
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-batches-US-02

**Pre-conditions:**

* admin(holds grading:operate) is on <grade10 admin grading batches url>, with <batch with its grades in> shipped to the grader.

**Test data:**

| Field | Value |
| --- | --- |
| <batch with its grades in> | one submission of 2 cards at Regular, each declared 500000 (HKD, minor units), seeded at `graded` |

**Steps:**

1. Click Arrived on <batch with its grades in>'s row.
2. Read the row.
3. Read the batches panel again more than a day later, the batch still unchecked.

**Expected Results:**

* Step 2: the batch's row reads Back, unchecked, offering Receive.
* Step 3: after it has stood unchecked for more than a day, the row is badged as waiting on the shop.

---

### grade10-admin-grading-batches-US2-TC15-1: A cert that grader returned in an earlier batch is refused by name

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/batch.spec.ts`

**Pre-conditions:**

* admin(holds grading:operate) has entered the manifest and invoice for <batch back without a manifest>, on its Receive page, its first card's line carrying <a cert>.
* <a cert> is already carried by a card in <a submission of an earlier batch at the same grader>, that batch already received.

**Test data:**

| Field | Value |
| --- | --- |
| <batch back without a manifest> | one submission of 2 cards at Regular, each declared 500000 (HKD, minor units), brought back as *Arriving a seeded batch* says |
| <a submission of an earlier batch at the same grader> | a submission seeded at `ready` at PSA · Regular, its batch received |
| <a cert> | the cert on that submission's card, read off its console page at <grade10 admin grading submission url> |
| Manifest | the first card's line carrying <a cert>, the second card's carrying 90001502, typed as *Typing a manifest* says |
| Invoice | reference INV-0015, currency USD, total 3000 (minor units) |

**Steps:**

1. Scan <a cert> against the first card in this batch.
2. Read the scan bar, the first card's row, and the earlier submission's card on its console page.

**Expected Results:**

* Step 2: the scan is refused, naming the submission that holds the cert.
* Step 2: nothing is recorded on either card, the earlier batch's card included.

---

### grade10-admin-grading-batches-US2-TC16-1: An unmatched line is resolved by naming its card or closing it as the grader's error

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/batch.spec.ts`

**Pre-conditions:**

* admin(holds grading:operate) has entered the manifest and invoice for <batch back with three cards typed>, on its Receive page.
* One unmatched line carries a mistyped intake id for <a card in the batch>; a second unmatched line names a card the shop never sent.
* Every other card in the batch is scanned or recorded as an exception.

**Test data:**

| Field | Value |
| --- | --- |
| <batch back with three cards typed> | one submission of 3 cards at Regular, each declared 500000 (HKD, minor units), brought back as *Arriving a seeded batch* says, its invoice entered as INV-0016, USD, 4500 |
| <a card in the batch> | the third card |
| First unmatched line | `<third card's intake id with its last character changed>, 90001603, MINT 9, regular,,` |
| Second unmatched line | `<an intake id no card of this shop carries>, 90001699, MINT 9, regular,,` |
| Reason for the second line | Listed in error by the grader |

**Steps:**

1. On the first line, name <a card in the batch> as the card it meant.
2. Scan the first line's cert, 90001603.
3. Close the second line as the grader's error with the reason.
4. Click Finish receiving.

**Expected Results:**

* Step 2: the first line's cert is recorded on the card named, and the line reads matched.
* Step 3: the second line reads closed with its reason.
* Step 4: Finish receiving goes ahead; neither line holds it.

---

### grade10-admin-grading-batches-US2-TC17-1: Arrived is withheld while a submission in the batch is not yet graded

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
* **Trace:** grade10-admin-grading-batches-US-02

**Pre-conditions:**

* admin(holds grading:operate) is on <grade10 admin grading batches url>.
* <batch half graded> holds two submissions: one at Grades are in, and one the grader has not yet graded. Recording Completed moves a whole batch at once, so the state is made with mock data.

**Test data:**

| Field | Value |
| --- | --- |
| <batch half graded> | a shipped batch at PSA · Regular of two submissions, one at Grades are in and one at With the grader |

**Steps:**

1. Read <batch half graded>'s row on the batches panel.
2. Send the batch's arrival to the worker directly, as a stale console would.
3. Read the row and both submissions again.

**Expected Results:**

* Step 1: the row offers no Arrived.
* Step 2: the arrival is refused, naming the submission not yet graded.
* Step 3: nothing is written: the batch still reads Shipped, and both submissions keep their status.

---

### grade10-admin-grading-batches-US2-TC18-1: A slab the manifest leaves out is added as the grader's omission and then scanned

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/batch.spec.ts`

**Pre-conditions:**

* admin(holds grading:operate) has entered the manifest and invoice for <batch back without a manifest>, on its Receive page.
* <a card> travelled in the batch, no manifest line names it, and its slab is in the box.

**Test data:**

| Field | Value |
| --- | --- |
| <batch back without a manifest> | one submission of 2 cards at Regular, each declared 500000 (HKD, minor units), brought back as *Arriving a seeded batch* says |
| Manifest | one line, for the first card only, typed as *Typing a manifest* says |
| Invoice | reference INV-0018, currency USD, total 3000 (minor units) |
| <a card> | the second card, listed under the scan table as on no line |
| Cert | 90001802, <the slab's cert> |
| Grade | NM-MT 8, <the slab's grade> |

**Steps:**

1. Under the scan table, click Add to the manifest on <a card>, enter the cert and the grade, and confirm.
2. Scan the cert.

**Expected Results:**

* Step 1: the new line stands as the grader's omission.
* Step 2: the cert and the grade stand on <a card>, and its line reads scanned.
* <a card> no longer holds Finish receiving.

---

## grade10-admin-grading-batches-US3: Operator records what did not come back as drawn

**As a** member of shop staff finishing a batch,
**I want** a card on the manifest but not in the box recorded as held by the grader with its expected date or as not returned, a damaged slab photographed before it leaves the box, and the collector emailed the same day either way,
**so that** every exception is a fact on one card with the money it changes.

### grade10-admin-grading-batches-US3-TC1-1: A card kept back by the grader is recorded held with its expected date

**Classification:**

* **Severity:** normal
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/batch.spec.ts`

**Pre-conditions:**

* admin(holds grading:operate) is finishing receiving <batch back with its manifest>, on its Receive page, its invoice entered and its first card scanned.
* <a card> is on the manifest but not found in the box; the grader's morning read gives its expected return date.

**Test data:**

| Field | Value |
| --- | --- |
| <batch back with its manifest> | one submission of 2 cards at Regular, each declared 500000 (HKD, minor units), seeded at `returned`; its invoice entered as reference INV-0101, USD, 3000 |
| <a card> | the second card |
| Expected back | a date 3 weeks after today |

**Steps:**

1. Click Held on <a card>'s line.
2. Enter its expected date, and confirm.
3. Read the card's line, and read the letter to the submission's collector.

**Expected Results:**

* Step 3: the card reads held by the grader, with the expected date.
* Step 3: the collector is emailed the same day.
* Step 3: the letter names the expected back date.

---

### grade10-admin-grading-batches-US3-TC2-1: A card missing from the box with no expected return is recorded not returned

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/batch.spec.ts`

**Pre-conditions:**

* admin(holds grading:operate) is finishing receiving <batch back with its manifest>, on its Receive page, its invoice entered and its first card scanned.
* <a card> is on the manifest but not found in the box, with no held date given.

**Test data:**

| Field | Value |
| --- | --- |
| <batch back with its manifest> | one submission of 2 cards at Regular, seeded at `returned`, the first declared 500000 and the second 800000 (HKD, minor units); its invoice entered as reference INV-0102, USD, 3000 |
| <a card> | the second card, declared 800000 (HKD, minor units) |

**Steps:**

1. Click Not returned on <a card>'s line, and confirm.
2. Read the card's line, and read the letter to the submission's collector.

**Expected Results:**

* Step 2: the card reads not returned, owing a payout of 800000 (HKD, minor units), its declared value.
* Step 2: the collector is emailed the same day.

---

### grade10-admin-grading-batches-US3-TC3-1: A damaged slab is photographed inside the box before it is removed

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
* **Trace:** grade10-admin-grading-batches-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/batch.spec.ts`

**Pre-conditions:**

* admin(holds grading:operate) is on the Receive page of <batch back with its manifest>, its invoice entered, and finds <a slab damaged> still inside its shipping box.

**Test data:**

| Field | Value |
| --- | --- |
| <batch back with its manifest> | one submission of 2 cards at Regular, each declared 500000 (HKD, minor units), seeded at `returned`; its invoice entered as reference INV-0103, USD, 3000 |
| <a slab damaged> | the second card's slab, its case cracked |

**Steps:**

1. Click Damaged on the card's line and confirm with no photograph.
2. Photograph the slab inside the box.
3. Click Damaged on the card's line, attach the photograph from step 2 as the photograph in the box, and confirm.
4. Read the card's line, and read the letter to the submission's collector.

**Expected Results:**

* Step 1: the record is refused until the slab is photographed in the box.
* Step 4: the photograph is attached to the card, taken before it left the box.
* Step 4: the card reads damaged, and owes a payout of 500000 (HKD, minor units), its declared value; the collector is emailed the same day.

---

### grade10-admin-grading-batches-US3-TC4-1: The rest of a submission's cards finish while one card is held

**Classification:**

* **Severity:** normal
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/batch.spec.ts`

**Pre-conditions:**

* admin(holds grading:operate) is finishing receiving <batch back with four cards>, on its Receive page, its invoice entered.
* One card of <a submission with several cards> is held by the grader; the rest are in the box.

**Test data:**

| Field | Value |
| --- | --- |
| <batch back with four cards> | <a submission with several cards>, seeded at `returned`; its invoice entered as reference INV-0104, USD, 6000 |
| <a submission with several cards> | one submission of 4 cards at Regular, each declared 500000 (HKD, minor units) |
| Held card | the fourth card, expected back a date 3 weeks after today |

**Steps:**

1. Scan the first three cards' certs.
2. Record the fourth card as held by the grader, with its expected date.
3. Click Finish receiving.
4. Read the submission's page at <grade10 admin grading submission url>.

**Expected Results:**

* Step 4: the submission's other cards finish and go ready with it.
* Step 4: only the held card's outcome is exceptional.

---

### grade10-admin-grading-batches-US3-TC5-1: Recording a card as held by the grader without an expected date is refused

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/batch.spec.ts`

**Pre-conditions:**

* admin(holds grading:operate) is recording <a card> not found in the box as held by the grader, on the Receive page of <batch back with its manifest>.

**Test data:**

| Field | Value |
| --- | --- |
| <batch back with its manifest> | one submission of 2 cards at Regular, each declared 500000 (HKD, minor units), seeded at `returned`; its invoice entered as reference INV-0105, USD, 3000 |
| <a card> | the second card |
| Expected back | left blank |

**Steps:**

1. Click Held on <a card>'s line.
2. Leave the expected date empty, and confirm.

**Expected Results:**

* Step 2: the record is refused, naming the missing expected date.
* Step 2: nothing is recorded on the card; its line still reads on the manifest, not scanned.

---

### grade10-admin-grading-batches-US3-TC6-1: A card no manifest line names holds Finish until it is recorded

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/batch.spec.ts`

**Pre-conditions:**

* admin(holds grading:operate) is finishing receiving <batch back without a manifest>, on its Receive page.
* The manifest names every card that travelled in the batch but <a card>, and every named card is scanned.
* <a card> is not in the box.

**Test data:**

| Field | Value |
| --- | --- |
| <batch back without a manifest> | one submission of 2 cards at Regular, each declared 500000 (HKD, minor units), brought back as *Arriving a seeded batch* says |
| Manifest | one line, for the first card only, typed as *Typing a manifest* says, its cert scanned |
| Invoice | reference INV-0106, currency USD, total 1500 (minor units) |
| <a card> | the second card, listed under the scan table as on no line |

**Steps:**

1. Click Finish receiving.
2. Click Not returned on <a card> under the scan table, and confirm.
3. Click Finish receiving again.

**Expected Results:**

* Step 1: Finish is refused, naming <a card>, and no submission moves.
* Step 3: every submission in the batch reads Ready to collect.

---

## grade10-admin-grading-batches-US4: Operator re-estimates a batch that is running late

**As a** member of shop staff reading the grader's order status in the morning,
**I want** to type the grader's stage onto the batch, set a new estimate with a reason, and have every collector in it emailed the day I set it,
**so that** the shop tells the collector before the collector asks.

### grade10-admin-grading-batches-US4-TC1-1: The morning read records the grader's own stage on the batch

**Classification:**

* **Severity:** normal
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/batch.spec.ts`

**Pre-conditions:**

* admin(holds grading:operate) is on the row of <a batch with the grader>, on <grade10 admin grading batches url>.

**Test data:**

| Field | Value |
| --- | --- |
| <a batch with the grader> | one submission of 2 cards at Regular, each declared 500000 (HKD, minor units), seeded at `sent` |
| Stage | Research and ID, one of PSA's own stages |
| Note | In research and ID since Monday, as typed |

**Steps:**

1. Open the act that records the grader's stage on the batch's row.
2. Pick the stage from the grader's own stages.
3. Type the grader's words into the note beside it, and confirm.
4. Read the batch's row and the submission's timeline at <grade10 admin grading submission url>.

**Expected Results:**

* Step 4: the stage lands on the batch's timeline and on every submission's timeline in it.
* Step 4: the note carries the grader's words; the stage itself is never free text.

---

### grade10-admin-grading-batches-US4-TC2-1: A batch past its estimate reads Due back in the warning tone

**Classification:**

* **Severity:** normal
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/batch.spec.ts`

**Pre-conditions:**

* admin(holds grading:operate) is on <grade10 admin grading batches url>.
* <a batch with the grader, past its estimate> holds no re-estimate yet.

**Test data:**

| Field | Value |
| --- | --- |
| <a batch with the grader, past its estimate> | one submission of 2 cards at Regular, each declared 500000 (HKD, minor units), seeded at `sent`, handed in 60 days back and `readyAt` 50 days back, so Regular's 5 weeks from its ship day have passed |

**Steps:**

1. Open the batches panel and read the batch's row.

**Expected Results:**

* Step 1: the batch's row reads Due back in the warning tone, read from the clock.
* Step 1: the With graders tile counts the batch among those past their estimate.

---

### grade10-admin-grading-batches-US4-TC3-1: Re-estimating with a new date and a reason emails every collector in the batch

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/batch.spec.ts`

**Pre-conditions:**

* admin(holds grading:operate) is on the row of <a batch with the grader, past its estimate, holding several submissions>, on <grade10 admin grading batches url>.

**Test data:**

| Field | Value |
| --- | --- |
| <a batch with the grader, past its estimate, holding several submissions> | three submissions at PSA · Regular, one each from collectors A, B and C, handed in as *A batch of several submissions* says and shipped more than 5 weeks ago |
| Stage | QA checks, one of PSA's own stages |
| New estimate | a date 2 weeks after today |
| Reason | PSA moved the order to QA checks, as typed |

**Steps:**

1. Click Re-estimate on the batch's row.
2. Set the stage, the new estimate and the reason.
3. Confirm.
4. Read the batch's row, and read the letter to each of collectors A, B and C.

**Expected Results:**

* Step 4: the new estimate is set with its reason on the batch.
* Step 4: every collector in the batch, however many, is emailed the day it is set.

---

### grade10-admin-grading-batches-US4-TC4-1: Re-estimating with no reason is refused

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/batch.spec.ts`

**Pre-conditions:**

* admin(holds grading:operate) is on the Re-estimate dialog of <a batch with the grader, past its estimate>.

**Test data:**

| Field | Value |
| --- | --- |
| <a batch with the grader, past its estimate> | one submission of 2 cards at Regular, each declared 500000 (HKD, minor units), seeded at `sent`, handed in 60 days back and `readyAt` 50 days back |
| Stage | QA checks |
| New estimate | a date 2 weeks after today |
| Reason | left blank |

**Steps:**

1. Set the stage and the new estimate, leaving the reason blank.
2. Attempt to confirm.

**Expected Results:**

* Step 2: the re-estimate is refused, naming the missing reason.
* Step 2: the due date does not move, and no collector is emailed.

---

### grade10-admin-grading-batches-US4-TC5-1: A shop-staff holding only the read grant cannot re-estimate a batch

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-04

**Pre-conditions:**

* admin(holds grading:read) is on <grade10 admin grading batches url>, at the row of <a batch with the grader, past its estimate>.

**Test data:**

| Field | Value |
| --- | --- |
| <a batch with the grader, past its estimate> | one submission of 2 cards at Regular, each declared 500000 (HKD, minor units), seeded at `sent`, handed in 60 days back and `readyAt` 50 days back |

**Steps:**

1. Read the batch's row.

**Expected Results:**

* Step 1: no Re-estimate action is offered.

---

### grade10-admin-grading-batches-US4-TC6-1: The stage that is the move puts every submission in the batch at grades are in

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/batch.spec.ts`

**Pre-conditions:**

* admin(holds grading:operate) is on the row of <a batch with the grader holding several submissions>, each at With the grader, on <grade10 admin grading batches url>.

**Test data:**

| Field | Value |
| --- | --- |
| <a batch with the grader holding several submissions> | three submissions at PSA · Regular, one each from collectors A, B and C, handed in as *A batch of several submissions* says and shipped |
| Stage | Completed, the grader's stage that is the move to the grades being in |
| Note | Grades posted, as typed |

**Steps:**

1. Record Completed from the grader's own stages, with the note.
2. Read each submission on <grade10 admin grading queue url>, and read the letter to each of collectors A, B and C.

**Expected Results:**

* Step 2: every submission in the batch reads Grades are in.
* Step 2: each collector in the batch is emailed once.

---

### grade10-admin-grading-batches-US4-TC7-1: The same stage recorded a second morning emails nobody again

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/batch.spec.ts`

**Pre-conditions:**

* admin(holds grading:operate) is on the row of <a batch with the grader> whose last recorded stage is <a stage>.

**Test data:**

| Field | Value |
| --- | --- |
| <a batch with the grader> | one submission of 2 cards at Regular, each declared 500000 (HKD, minor units), seeded at `sent` |
| <a stage> | Research and ID, recorded once already with the note In research and ID |

**Steps:**

1. Note the batch's timeline and the last letter to the submission's collector.
2. Record <a stage> again.
3. Read the timeline and the last letter again.

**Expected Results:**

* Step 3: nothing further is written to the batch or its submissions.
* Step 3: no collector is emailed a second time.

---

### grade10-admin-grading-batches-US4-TC8-1: A re-estimate to the date already set emails nobody again

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/batch.spec.ts`

**Pre-conditions:**

* admin(holds grading:operate) is on the Re-estimate dialog of <a batch with the grader> whose due date is <a date>.

**Test data:**

| Field | Value |
| --- | --- |
| <a batch with the grader> | one submission of 2 cards at Regular, each declared 500000 (HKD, minor units), seeded at `sent` |
| <a date> | the due date the batch's row reads |
| New estimate | the date already set, <a date> |
| Reason | The grader confirmed the same date, as typed |

**Steps:**

1. Note the batch's timeline and the last letter to the submission's collector.
2. Set the estimate to the date already carried, give the reason and confirm.
3. Read the timeline and the last letter again.

**Expected Results:**

* Step 3: nothing further is written to the batch.
* Step 3: no collector is emailed a second time.

---

### grade10-admin-grading-batches-US4-TC9-1: The due-back badge stands from the estimated day and gives way to running late

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
* **Trace:** grade10-admin-grading-batches-US-04

**Pre-conditions:**

* admin(holds grading:operate) is on <grade10 admin grading queue url>.
* <a batch due back today> carries an estimated day back of the shop's own day and holds <a submission>.

**Test data:**

| Field | Value |
| --- | --- |
| <a submission> | one submission of 2 cards at Regular, each declared 500000 (HKD, minor units), seeded at `graded` with its hand-in 35 days and 5 minutes back and `readyAt` 35 days back, so it shipped 35 days back and Regular's 5 weeks end today |
| <a batch due back today> | <a submission>'s own batch, shipped and not arrived |

**Steps:**

1. Read <a submission>'s row on the queue on the estimated day back.
2. Read it again on the day after the estimate.
3. Receive the batch - Arrived, the manifest and invoice entered, every card scanned, Finish receiving - and read the row again.

**Expected Results:**

* Step 1: on the estimated day the submission's row is badged as due back.
* Step 2: on the day after the estimate the row is badged as running late in place of due back.
* Step 3: once the batch reads Received the row carries neither badge.

---

## grade10-admin-grading-batches-US5: Operator keeps the safe under its cap

**As a** member of shop staff building a batch,
**I want** the tiles to read what is closing, what is with graders and past its estimate, what is back unchecked, and the declared value in the safe, ready slabs included, against its cap, and a hand-in that would pass the cap refused at the desk with the next drop-off booked instead,
**so that** the shop never holds more than it is covered for.

### grade10-admin-grading-batches-US5-TC1-1: The tiles read the batch closing, with graders, back unchecked and the safe

**Classification:**

* **Severity:** normal
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-05

**Pre-conditions:**

* admin(holds grading:operate) is on <grade10 admin grading batches url>, with one batch closed and shipping today, two batches with graders of which one is past its estimate, one batch back and unchecked, and 24000000 (HKD, minor units) of declared value held, on a stack holding no other batch and no other card.
* <the safe's cap> is written as 30000000, as *Writing a money setting* says.

**Test data:**

| Field | Value |
| --- | --- |
| <the safe's cap> | 30000000 (HKD, minor units) |
| A batch closed and shipping today | a submission seeded at `checked_in` at Super Express, handed in yesterday, 3 cards declared 3500000, 3500000 and 3000000 (HKD, minor units): 10000000 held |
| A batch with a grader | a submission seeded at `sent` at Regular, 1 card declared 500000 (HKD, minor units), not held in the shop |
| A batch with a grader, past its estimate | a submission seeded at `sent` at Regular, 1 card declared 500000 (HKD, minor units), handed in 60 days back and `readyAt` 50 days back, not held in the shop |
| A batch back and unchecked | a submission seeded at `graded` at Super Express, 4 cards declared 3500000 each (HKD, minor units), Arrived pressed on its row: 14000000 held |
| Declared value held | 24000000 (HKD, minor units), 10000000 plus 14000000 |

**Steps:**

1. Open the batches panel and read the tiles.

**Expected Results:**

* Step 1: Ship today reads 1.
* Step 1: With graders reads 2, with 1 past its estimate.
* Step 1: Back, unchecked reads 1.
* Step 1: Declared value in the safe reads 24000000 against 30000000 (HKD, minor units).

---

### grade10-admin-grading-batches-US5-TC2-1: The safe's tile counts ready slabs still held toward the declared value

**Classification:**

* **Severity:** normal
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-05

**Pre-conditions:**

* admin(holds grading:operate) is on <grade10 admin grading batches url>, with <several slabs ready and uncollected> and <a batch checked in and not yet shipped>, on a stack holding no other card.

**Test data:**

| Field | Value |
| --- | --- |
| <a batch checked in and not yet shipped> | a submission seeded at `checked_in` at Super Express, 3 cards declared 3500000, 3500000 and 3000000 (HKD, minor units): 10000000 |
| <several slabs ready and uncollected> | a submission seeded at `ready` at Super Express, 2 cards declared 3000000 each (HKD, minor units): 6000000 |
| <cards back at the shop> | a submission seeded at `returned` at Super Express, 3 cards declared 3500000, 3500000 and 1000000 (HKD, minor units): 8000000 |
| <a card collected> | a submission seeded at `collected` at Super Express, 1 card declared 2000000 (HKD, minor units), left out |
| <safe total> | 24000000 (HKD, minor units), 10000000 plus 8000000 plus 6000000 |

**Steps:**

1. Open the batches panel and read the Declared value in the safe tile.

**Expected Results:**

* Step 1: the safe's tile sums the declared value of the checked-in cards, the cards back at the shop and the ready slabs still held, leaving out <a card collected>: <safe total>.

---

### grade10-admin-grading-batches-US5-TC3-1: The safe's tile turns to the warning tone at its cap

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-05

**Pre-conditions:**

* admin(holds grading:operate) is on <grade10 admin grading batches url>.
* <the safe's cap> is written as 30000000, as *Writing a money setting* says.
* The safe's declared value has reached <the safe's cap>, 30000000 (HKD, minor units), on a stack holding no other card.

**Test data:**

| Field | Value |
| --- | --- |
| <the safe's cap> | 30000000 (HKD, minor units) |
| Cards held | 3 submissions seeded at `checked_in` at Super Express, each of 3 cards declared 3500000, 3500000 and 3000000 (HKD, minor units): 30000000 in all |

**Steps:**

1. Open the batches panel and read the Declared value in the safe tile.

**Expected Results:**

* Step 1: the safe's tile reads in the warning tone.

---

### grade10-admin-grading-batches-US5-TC4-1: A hand-in that would carry the safe past its cap is refused, the next drop-off booked instead

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-05

**Pre-conditions:**

* admin(holds grading:operate) is checking in <a submission> at the counter, on its Hand-in runbook at <grade10 admin grading submission url>.
* <the safe's cap> is written as 30000000, as *Writing a money setting* says.
* The safe already holds declared value under <the safe's cap>, and this hand-in's declared total would carry it past <the safe's cap>.

**Test data:**

| Field | Value |
| --- | --- |
| <the safe's cap> | 30000000 (HKD, minor units) |
| <safe held> | 29000000 (HKD, minor units): 3 submissions seeded at `checked_in` at Super Express, of cards declared 3500000, 3500000 and 3000000; 3500000, 3500000 and 3000000; 3500000, 3500000 and 2000000, on a stack holding no other card |
| <a submission> | a booked submission of 1 card at Super Express, declared 2000000 (HKD, minor units): <safe held> plus 2000000 passes <the safe's cap> |

**Steps:**

1. Attempt to check in <a submission> from the Hand-in runbook.
2. Read the runbook and <a submission>'s drop-off.

**Expected Results:**

* Step 2: check-in is refused, naming the safe's cap.
* Step 2: the next drop-off is booked for the submission instead.
* Step 2: the collector is told the shop is at its cap.

---

### grade10-admin-grading-batches-US5-TC5-1: A hand-in that keeps the safe at or under its cap proceeds

**Classification:**

* **Severity:** normal
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-05

**Pre-conditions:**

* admin(holds grading:operate) is checking in <a submission> at the counter, on its Hand-in runbook at <grade10 admin grading submission url>.
* <the safe's cap> is written as 30000000, as *Writing a money setting* says.
* The safe's declared value, with this hand-in added, stays at or under <the safe's cap>.

**Test data:**

| Field | Value |
| --- | --- |
| <the safe's cap> | 30000000 (HKD, minor units) |
| <safe held> | 29000000 (HKD, minor units): 3 submissions seeded at `checked_in` at Super Express, of cards declared 3500000, 3500000 and 3000000; 3500000, 3500000 and 3000000; 3500000, 3500000 and 2000000, on a stack holding no other card |
| <a submission> | a booked submission of 1 card at Super Express, declared 1000000 (HKD, minor units): <safe held> plus 1000000 reaches <the safe's cap> exactly |

**Steps:**

1. Check in <a submission> from the Hand-in runbook.
2. Open <grade10 admin grading batches url>.
3. Read the Declared value in the safe tile.

**Expected Results:**

* Step 1: check-in proceeds; no cap refusal is shown.
* Step 3: the safe reads 30000000 (HKD, minor units), and the tile says it is at its cap.

## Settled

- A read-grant holder offered no act on the batches and receive pages is not this capability's rule: it is `grade10-admin/grading/counter`'s grant rule (the console shows only what the operator may do), walked in the counter suite; the batches spec never stated it

## Reconciliation

**Run:** 2026-09-22, in the change `add-card-grading`. The blind pass read the isolated bundle its caller built - this capability's `## Purpose` and `## Feature set`, its `user-journeys.md`, the change's `proposal.md` and `decisions.md` with its `## Raised` table, `ui-design.md` with the state dispositions stripped, and the PRD pages the proposal links. It was denied every `## Requirements` section, `openspec/specs/`, `openspec/changes/archive/` and `tech-design.md`. Nothing here verifies that; it is the run's own word. The scenario pass wrote its scenarios over sixteen ADDED requirements, and the blind suite wrote 37 cases over US1 to US5. Scenario ids stripped at review, 2026-09-29.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `grade10-admin-grading-batches-US1-TC1-1` | Reached | Marking it shipped moves every submission and tells every collector, and the packing list |
| `grade10-admin-grading-batches-US1-TC2-1` | Folded | No scenario said a batch still taking cards offers no way to ship it; folded as a scenario, with the rule on the shipping requirement |
| `grade10-admin-grading-batches-US1-TC3-1` | Reached | A ship date ahead of today refused |
| `grade10-admin-grading-batches-US1-TC4-1` | Reached | The act held while a field it needs is unset |
| `grade10-admin-grading-batches-US1-TC5-1` | Reached | A declared total above the courier's cover refused. The case reads the warning tone, the scenario the refusal: the same rule at two altitudes. Whether a batch over the cover is split or held is Q29's open ❓ and is not in either |
| `grade10-admin-grading-batches-US1-TC6-1` | Reached | Marking it shipped moves every submission and tells every collector |
| `grade10-admin-grading-batches-US1-TC7-1` | Folded | The console opens a batch for a trio before its first card, which no scenario said; folded as a scenario, with the rule beside `Opened on first use`. Its second reading, a card at another level, is walked by `grade10-admin-grading-batches-US1-TC17-1` |
| `grade10-admin-grading-batches-US1-TC8-1` | Retired at review, `deprecated` | The read grant is `grade10-admin/grading/counter`'s grant rule (the console shows only what the operator may do), walked in the counter suite; the batches spec never stated it |
| `grade10-admin-grading-batches-US1-TC9-1` | Kept, out of the requirements | The in-flight form is presentation; the panel's colocated test decides it, and a walk exercises it beside that test |
| `grade10-admin-grading-batches-US2-TC1-1` | Reached | Nothing scanned until the manifest and the invoice are in |
| `grade10-admin-grading-batches-US2-TC2-1` | Reached | Nothing scanned until the manifest and the invoice are in |
| `grade10-admin-grading-batches-US2-TC3-1` | Reached | A scan matching the cert to the card the manifest names, and the counters |
| `grade10-admin-grading-batches-US2-TC4-1` | Reached, and raised | A cert another submission holds, refused by name. The case asked how far `held elsewhere` reaches; Q74 settles it as one cert per grader across every batch and submission, the scan requirement now says so, and a scenario states the reach |
| `grade10-admin-grading-batches-US2-TC5-1` | Reached | A cert the manifest does not carry, refused |
| `grade10-admin-grading-batches-US2-TC6-1` | Reached | A manifest line naming no intake id in the batch, held unmatched |
| `grade10-admin-grading-batches-US2-TC7-1` | Reached | A card returned raw, recorded ungraded with the grader's code. The case's `the card's fee stands` was the fee's fate per outcome, `grade10-site/grading/submission-lifecycle`'s and Q5's open ❓, not this capability's; dropped from the case at review |
| `grade10-admin-grading-batches-US2-TC8-1` | Reached | A card moved up a level owing the sheet's difference, and the invoice reconciled against it |
| `grade10-admin-grading-batches-US2-TC9-1` | Reached | An invoice that disagrees with the sheet, the shop's to settle |
| `grade10-admin-grading-batches-US2-TC10-1` | Reached | A half-scanned box put down and taken up again, and the counters read on it |
| `grade10-admin-grading-batches-US2-TC11-1` | Reached | Finishing held while a line or a slab is unresolved |
| `grade10-admin-grading-batches-US2-TC12-1` | Reached | Finishing making every submission ready and telling each collector once, and the batch reading received |
| `grade10-admin-grading-batches-US2-TC13-1` | Retired at review, `deprecated` | The read grant is the counter capability's, as `grade10-admin-grading-batches-US1-TC8-1` |
| `grade10-admin-grading-batches-US3-TC1-1` | Reached | A card held by the grader recorded with its expected date, and the same-day letter |
| `grade10-admin-grading-batches-US3-TC2-1` | Reached | A card that did not come back owing its declared value, and the same-day letter |
| `grade10-admin-grading-batches-US3-TC3-1` | Reached | A damaged slab photographed in the box before it leaves it, and the same-day letter |
| `grade10-admin-grading-batches-US3-TC4-1` | Reached | A card held by the grader while the batch can still be finished |
| `grade10-admin-grading-batches-US3-TC5-1` | Folded | No scenario refused a held card with no date the grader expects it; folded as a scenario, with the rule on the exceptions requirement |
| `grade10-admin-grading-batches-US4-TC1-1` | Reached | The morning read recording the grader's stage in its own words |
| `grade10-admin-grading-batches-US4-TC2-1` | Reached | A batch past its estimate reading late with nothing written |
| `grade10-admin-grading-batches-US4-TC3-1` | Reached | A re-estimate taking a reason and telling every collector that day |
| `grade10-admin-grading-batches-US4-TC4-1` | Folded | The requirement refused a re-estimate with no reason and no scenario stated it; folded as a scenario |
| `grade10-admin-grading-batches-US4-TC5-1` | Retired at review, `deprecated` | The read grant is the counter capability's, as `grade10-admin-grading-batches-US1-TC8-1` |
| `grade10-admin-grading-batches-US5-TC1-1` | Reached | The tiles reading the day over the counter |
| `grade10-admin-grading-batches-US5-TC2-1` | Reached | The safe's total counting the ready slabs still held |
| `grade10-admin-grading-batches-US5-TC3-1` | Folded | The tile at the cap was a rule with no scenario; folded as a scenario |
| `grade10-admin-grading-batches-US5-TC4-1` | Reached | A hand-in that would carry the safe past its cap, refused |
| `grade10-admin-grading-batches-US5-TC5-1` | Folded | A hand-in that leaves the safe exactly at its cap is taken, which no scenario stated; folded as a scenario with `grade10-admin-grading-batches-US5-TC3-1` |
| Raised: the ship form's insured total | Landed as Q73, and folded | Read-only, the sum of the batch's cards' declared values at ship, recorded as the figure declared to the courier. The shipping act no longer lists it among the fields that can be unset, the insured-total requirement carries `Derived, never typed`, and a scenario states it; `grade10-admin-grading-batches-US1-TC15-1` walks it |
| Raised: how far `a cert already held elsewhere` reaches | Landed as Q74, and folded | Any card at the same grader carrying that cert, in any submission and any batch, batches already received included. The scan requirement now says so and a scenario states it; `grade10-admin-grading-batches-US2-TC15-1` walks it |
| The first card handed in opening the batch | Case added | `grade10-admin-grading-batches-US1-TC10-1` - the first hand-in for a trio opens the batch |
| A second batch never opening beside an open one | Case added | `grade10-admin-grading-batches-US1-TC11-1` - the second hand-in joins the standing batch |
| The cut-off passing, and the next day's ship | Case added | `grade10-admin-grading-batches-US1-TC12-1` - the cut-off passes, the row reads Closed with nothing written, and it ships the next day |
| The box arriving, back and unchecked | Case added | `grade10-admin-grading-batches-US2-TC14-1` - the box arrives, the row reads back unchecked, and the badge turns after a day |
| A card handed in after the cut-off | Case added | `grade10-admin-grading-batches-US1-TC13-1` - a hand-in after the cut-off joins the next batch |
| A cover figure in another currency | Case added | `grade10-admin-grading-batches-US1-TC14-1` - a cover figure in another currency, refused and never converted |
| The stage that is the move | Case added | `grade10-admin-grading-batches-US4-TC6-1` - the stage that is the move carries the whole batch |
| The same stage recorded twice | Case added | `grade10-admin-grading-batches-US4-TC7-1` - the same stage on a second morning tells nobody again |
| A re-estimate to the date already set | Case added | `grade10-admin-grading-batches-US4-TC8-1` - a re-estimate to the date already set tells nobody again |
| The due-back badge | Case added | `grade10-admin-grading-batches-US4-TC9-1` - the due-back badge stands from the estimated day, gives way to running late the day after, and stands no longer once the batch is received |
| An unmatched line resolved | Case added | `grade10-admin-grading-batches-US2-TC16-1` - an unmatched line resolved by naming the card it meant, a second closed as the grader's error with a reason, and neither holding the finish |
| The box not recorded arrived before its grades are in | Case added, added after the run | `grade10-admin-grading-batches-US2-TC17-1`: decided outside the blind pass, from the worker refusing an arrival while a submission is not yet graded; the row offers no Arrived, and one sent anyway is refused by name |
| A card no manifest line names holding finishing | Case added, added after the run | `grade10-admin-grading-batches-US3-TC6-1`: decided outside the blind pass, from the worker holding the finish on a travelled card no manifest line names |
| A slab the manifest leaves out | Case added, added after the run | `grade10-admin-grading-batches-US2-TC18-1`: decided outside the blind pass, and Operations' open ❓ on the console page; a slab no line names is added to the manifest as the grader's omission, then scanned |
| The list putting what waits on the shop first | Case added, added after the run | `grade10-admin-grading-batches-US1-TC16-1`: decided outside the blind pass, and Product's open ❓ on the console page; every batch not yet received on each page in that order, the rest paged newest first |
| A card at another level waiting for its own batch | Case added at review | `grade10-admin-grading-batches-US1-TC17-1`: no case walked it; the case at the other level joins its own batch and leaves the open one unchanged |
| Two operators shipping one parcel, a box finished twice, two desks against one shelf | Out of suite | Listed in the header: the concurrency and replay guards, verified by the backend's own tests rather than from one panel |

### Manual

| Manual | Why |
| --- | --- |
| `grade10-admin-grading-batches-US1-TC9-1` | A person watches the form while the act is in flight; the panel's colocated test proves the disabled actions, not how long they stay that way |
| `grade10-admin-grading-batches-US1-TC12-1` | The cut-off passing is a day, not an act: a person walks the row on the Friday morning, or the clock is moved for them |
| `grade10-admin-grading-batches-US2-TC14-1` | The unchecked-return badge turns after a day standing; a person reads the panel the next morning |
| `grade10-admin-grading-batches-US4-TC9-1` | The badge turns over a day boundary; a person reads the queue on the estimated day and again the morning after, or the clock is moved for them |
| `grade10-admin-grading-batches-US3-TC3-1` | A person photographs a physical slab inside the box it arrived in; a test can prove the photograph is attached, never that the slab had not been moved |
