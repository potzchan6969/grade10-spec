# grade10-admin/grading/counter Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-22, tcs-rules r3.0

## grade10-admin-grading-counter-US1: Operator opens the shop and sees what every submission waits for

**As a** member of shop staff starting a shift,
**I want** the queue cut by what each submission waits for, today's drop-offs in a strip, and a badge naming why a row needs me,
**so that** I work the counter without being emailed anything.

### grade10-admin-grading-counter-US1-TC1-1: The seven views cut submissions by exactly what they wait for

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-01

**Pre-conditions:**
Admin(holds `grading:read`) is on <grade10 admin grading queue url>. The queue holds at least one submission each in Booked, Handed in, With the grader, Ready, and Closed.

**Steps:**

1. Navigate to <grade10 admin grading queue url>.
2. Open Booked.
3. Open Ready.
4. Open Closed.

**Expected Results:**

* Step 2 lists only `booked` submissions, with its own count on the view.
* Step 3 lists only `ready` submissions.
* Step 4 lists `collected`, `cancelled` and `expired` submissions together, and none of them appears in another view.
* Every row carries the submission id, the collector, the cards, the grader and level, the status word, the visit, when it was last touched and what it is waiting on.

### grade10-admin-grading-counter-US1-TC2-1: The Today strip lists the day's drop-offs in slot order

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-01

**Pre-conditions:**
Admin(holds `grading:read`) is on <grade10 admin grading queue url>. Two drop-offs fall on the shop's own day, one earlier than the other.

**Steps:**

1. Navigate to <grade10 admin grading queue url>.
2. Read the Today strip.

**Expected Results:**

* The strip lists the two drop-offs in slot order, each with its time, collector, id, cards and grader.
* One line under them says that pickups walk in.

### grade10-admin-grading-counter-US1-TC3-1: A row's badge names the wait and clears once it no longer applies

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
* **Trace:** grade10-admin-grading-counter-US-01

**Pre-conditions:**
Admin(holds `grading:read`) is on the Handed in view. A `checked_in` submission's batch cut-off is today.

**Steps:**

1. Open the Handed in view.
2. Read the submission's badge.
3. Reload the view after the batch has closed past its cut-off.

**Expected Results:**

* Step 2 shows the Batch closes today badge.
* Step 3 no longer shows that badge on the same row, recomputed from the submission's own dates rather than a value somebody has to clear.

### grade10-admin-grading-counter-US1-TC4-1: The counter tiles summarise closing, with graders, ready, and to settle

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-01

**Pre-conditions:**
Admin(holds `grading:read`) is on <grade10 admin grading queue url>. A batch closes today, some submissions with a grader are past their estimate, some ready submissions are past 30 days uncollected, and one ready submission owes an unpaid upcharge.

**Steps:**

1. Navigate to <grade10 admin grading queue url>.
2. Read the four tiles.

**Expected Results:**

* The closing tile names the grader and level, the cards, the submissions, and the ship day.
* The with-graders tile shows the total count and how many are past their estimate.
* The ready tile shows the total count and how many are past 30 days.
* The to-settle tile shows the sum and the count of unpaid upcharges.

### grade10-admin-grading-counter-US1-TC5-1: A view with no submissions shows its empty state

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-01

**Pre-conditions:**
Admin(holds `grading:read`) is on <grade10 admin grading queue url>. The Closed view holds no submission.

**Steps:**

1. Navigate to <grade10 admin grading queue url>.
2. Open Closed.

**Expected Results:**

* Closed shows its empty state rather than a blank table.

### grade10-admin-grading-counter-US1-TC6-1: A view past 50 rows pages instead of overflowing

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
* **Trace:** grade10-admin-grading-counter-US-01

**Pre-conditions:**
Admin(holds `grading:read`) is on <grade10 admin grading queue url>. A view holds 51 submissions.

**Steps:**

1. Navigate to <grade10 admin grading queue url>.
2. Open that view.
3. Advance the pager.

**Expected Results:**

* Step 2 lists the newest-touched 50 rows.
* Step 3 loads the 51st row without repeating any row already shown.

### grade10-admin-grading-counter-US1-TC7-1: A read-grant holder sees no row action beyond Open

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-01

**Pre-conditions:**
Admin(holds `grading:read`, not `grading:operate` or `grading:approve`) is on <grade10 admin grading queue url>. A row is `booked`.

**Steps:**

1. Navigate to <grade10 admin grading queue url>.
2. Check the row's actions.

**Expected Results:**

* Open is the only action offered; no hand-in, hand-back or settings act shows on the row.

### grade10-admin-grading-counter-US1-TC8-1: The Today cut is made on the shop's own day, not the server's

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
* **Trace:** grade10-admin-grading-counter-US-01

**Pre-conditions:**
Admin(holds `grading:read`) reads the queue early in the shop's morning, while the date in Coordinated Universal Time is still the day before.

**Steps:**

1. Navigate to <grade10 admin grading queue url>.
2. Open Today.

**Expected Results:**

* Today lists the drop-off booked for later that day on the shop's own calendar day, `Asia/Hong_Kong`.
* The row's Visit today badge and the Today cut agree.

### grade10-admin-grading-counter-US1-TC9-1: A planned submission with no drop-off booked is in no view

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-01

**Pre-conditions:**
Admin(holds `grading:read`) is on <grade10 admin grading queue url>. A submission is `planned` with no drop-off booked.

**Steps:**

1. Open each of the six status views in turn.
2. Open Today.

**Expected Results:**

* The planned submission is in none of them; the collector's own list holds it.

### grade10-admin-grading-counter-US1-TC10-1: Nothing about a submission is emailed or pushed to staff

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-01

**Pre-conditions:**
Admin(holds `grading:read`) works a shift with a mailbox and push notifications open. A submission becomes `ready`, another runs past its estimate, and a third falls due for the written notice.

**Steps:**

1. Let the three submissions move.
2. Read the mailbox and the push notifications.
3. Read the queue.

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
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-02

**Pre-conditions:**
Admin(holds `grading:operate`) is on the Today strip of <grade10 admin grading queue url>. A `booked` submission's drop-off falls today and has not started.

**Steps:**

1. Open the submission from the Today strip.
2. Start at the desk.

**Expected Results:**

* Step 1 opens the hand-in runbook at Not handed in yet.
* Step 2 starts the visit and offers the card checks.

### grade10-admin-grading-counter-US2-TC2-1: A walk-in's list is written at the desk, card by card, with the collector

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
* **Trace:** grade10-admin-grading-counter-US-02

**Pre-conditions:**
Admin(holds `grading:operate`) is at the desk with a walk-in collector who holds no booking.

**Steps:**

1. Open a new submission at the desk.
2. Add a card with the collector, naming it and its declared value.
3. Add a second card the same way.

**Expected Results:**

* Steps 2 and 3 each add one card at a time with no paste option offered.
* The runbook proceeds from Not handed in yet with the two cards listed.

### grade10-admin-grading-counter-US2-TC3-1: A card is checked present, condition-noted and photographed front and back

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
* **Trace:** grade10-admin-grading-counter-US-02

**Pre-conditions:**
Admin(holds `grading:operate`) is checking cards on a `booked` submission's runbook. One card on the list has not yet been checked.

**Steps:**

1. Tick Present for the card.
2. Type a condition note.
3. Capture the front and back photographs.

**Expected Results:**

* Step 1 marks the card present.
* Step 2 shows the note in place of "Nothing noted."
* Step 3 attaches both photographs to the collector's page.

### grade10-admin-grading-counter-US2-TC4-1: A card at the level's declared-value ceiling passes the level check

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
* **Trace:** grade10-admin-grading-counter-US-02

**Pre-conditions:**
Admin(holds `grading:operate`) is checking cards on a `booked` submission at Value level.

**Test data:**

| Field | Value |
| --- | --- |
| Level | Value |
| Ceiling | 390000 minor units (HKD 3,900.00) |
| Card's declared value | 390000 minor units (HKD 3,900.00) |

**Steps:**

1. Check the card's declared value against the ceiling.
2. Read the level banner.

**Expected Results:**

* The banner reads every declared value inside the ceiling, the at-ceiling card counted as fitting.

### grade10-admin-grading-counter-US2-TC5-1: A card above the level's ceiling is marked and moves to a second submission or is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-02

**Test data:**

| Field | Value |
| --- | --- |
| Level | Value |
| Ceiling | 390000 minor units (HKD 3,900.00) |
| Card's value on the list | 300000 minor units (HKD 3,000.00) |
| Card's value declared at the desk | 400000 minor units (HKD 4,000.00) |

**Pre-conditions:**
Admin(holds `grading:operate`) is checking cards on a `booked` submission at Value level, its visit started at the desk.

**Steps:**

1. Check the card, declaring HKD 4,000.00 against its reference.
2. Read the level banner.

**Expected Results:**

* The row is marked as above the ceiling, at the limit of what the level accepts.
* Staff are offered to move the card to a second submission or refuse it; the rest of the list is unaffected.

### grade10-admin-grading-counter-US2-TC6-1: The agreement is not mintable while a card is unchecked

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
* **Trace:** grade10-admin-grading-counter-US-02

**Pre-conditions:**
Admin(holds `grading:operate`) is on the hand-in runbook of a three-card submission. One card has not been checked.

**Steps:**

1. Open the sign step.

**Expected Results:**

* The step names the unchecked card as the reason the agreement cannot be minted.

### grade10-admin-grading-counter-US2-TC7-1: The agreement mints once every card is checked

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
* **Trace:** grade10-admin-grading-counter-US-02

**Pre-conditions:**
Admin(holds `grading:operate`) is on the hand-in runbook. Every card is checked.

**Steps:**

1. Open the sign step.
2. Show on iPad, or copy the link.

**Expected Results:**

* Step 1 offers Show on iPad and Copy link with the 30-minute line.
* Step 2 opens the schedule of cards as checked on the collector's device.

### grade10-admin-grading-counter-US2-TC8-1: The till opens only once the agreement is sealed, one line per card and a cover line where the level carries one

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
* **Trace:** grade10-admin-grading-counter-US-02

**Test data:**

| Field | Value |
| --- | --- |
| Level | Express |
| Cards | 2 |
| Fee a card | 120000 minor units (HKD 1,200.00) |
| Cover a card | 1.5% of each card's declared value |

**Pre-conditions:**
Admin(holds `grading:operate`) is on the hand-in runbook of a two-card Express submission.

**Steps:**

1. Read Take payment before the agreement is sealed.
2. Seal the agreement.
3. Open the till.

**Expected Results:**

* Step 1 shows Take payment disabled.
* Step 3 opens the POS with one Grading Service line per card at 120000 minor units (HKD 1,200.00) and one cover line per card at 1.5% of its declared value.

### grade10-admin-grading-counter-US2-TC9-1: No hand-in without a paid line leaves the submission booked and the cards with the collector

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
* **Trace:** grade10-admin-grading-counter-US-02

**Pre-conditions:**
Admin(holds `grading:operate`) sealed the agreement on a `booked` submission and opened the till.

**Steps:**

1. Leave the till without a paid order.
2. Close the runbook.

**Expected Results:**

* The submission stays `booked`, the seal still stands, and the cards go home with the collector.
* The runbook offers to run the till again or wait for another drop-off.

### grade10-admin-grading-counter-US2-TC10-1: The safe's cap refuses a hand-in that would carry it past the cap

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
* **Trace:** grade10-admin-grading-counter-US-02

**Test data:**

| Field | Value |
| --- | --- |
| Safe declared cap | 30000000 minor units (HKD 300,000.00) |
| Safe currently holds | 29900000 minor units (HKD 299,000.00) |
| This hand-in's declared total | 200000 minor units (HKD 2,000.00) |

**Pre-conditions:**
Admin(holds `grading:operate`) is at the till step of the hand-in runbook. Sealing this hand-in would carry the safe from 29900000 to 30100000 minor units, past its cap.

**Steps:**

1. Attempt to take the fee.

**Expected Results:**

* The hand-in is refused; the collector is told the safe is full and the next drop-off is booked instead.

### grade10-admin-grading-counter-US2-TC11-1: Labels, seal and check-in move the submission from Booked to Handed in

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-02

**Pre-conditions:**
Admin(holds `grading:operate`) has a paid order on a sealed, fully checked three-card submission.

**Steps:**

1. Print labels and check in.

**Expected Results:**

* Three intake labels print, one per card.
* The cards are sealed into the intake bag with the printed list.
* The submission moves `booked → checked_in`.
* The intake receipt and the signed agreement go out by email.

### grade10-admin-grading-counter-US2-TC12-1: A second submission on the same visit runs its own hand-in runbook

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-02

**Pre-conditions:**
Admin(holds `grading:operate`) opens the drop-off's first submission at the desk. A second submission is listed under the same visit.

**Steps:**

1. Open the second submission from the visit.
2. Check its cards independently of the first.

**Expected Results:**

* The second submission runs its own hand-in runbook, its own level check and its own till line, without depending on the first submission's state.

### grade10-admin-grading-counter-US2-TC13-1: Check in is refused while the agreement is unsealed

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
* **Trace:** grade10-admin-grading-counter-US-02

**Pre-conditions:**
Admin(holds `grading:operate`) has every card checked on a `booked` submission and has not sealed the agreement.

**Steps:**

1. Attempt to print labels and check in.

**Expected Results:**

* The check-in is refused by name, naming the unsealed agreement.
* The submission stays `booked` and the cards stay with the collector.

### grade10-admin-grading-counter-US2-TC14-1: An order recorded on another submission is refused, and a replay answers the first its own lines

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
* **Trace:** grade10-admin-grading-counter-US-02

**Test data:**

| Field | Value |
| --- | --- |
| First submission | Express, one card, agreement sealed |
| Second submission | Regular, one card, agreement sealed |
| Paid order | one order carrying a Grading Service line at each level |

**Pre-conditions:**
Admin(holds `grading:operate`) is at the till step of both submissions' hand-in runbooks, and the one paid order is in the till.

**Steps:**

1. Record the paid order on the Express submission.
2. Record the same order on the Regular submission.
3. Record the same order on the Express submission again.

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
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-03

**Test data:**

| Row | Reason | Words |
| --- | --- | --- |
| A | The grader would not take it | Corner crease along the top edge |
| B | Declared above the level | Declared HKD 50,000, this level tops at HKD 39,000 |
| C | The collector withdrew it | Collector wants to keep this one for now |

**Pre-conditions:**
Admin(holds `grading:operate`) is checking a card on a `booked` submission's runbook.

**Steps:**

1. Open Refuse on the card.
2. Choose the row's reason.
3. Type the row's words.
4. Refuse the card.

**Expected Results:**

* Step 4 strikes the row with its own reason and the words shown exactly as typed, both on the submission page and on the receipt.
* The card is never charged.

### grade10-admin-grading-counter-US3-TC2-1: Refuse stays disabled until a reason and the collector's words are given

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-03

**Pre-conditions:**
Admin(holds `grading:operate`) opened Refuse on a card and has picked no reason.

**Steps:**

1. Open Refuse.
2. Leave the reason and the words empty.

**Expected Results:**

* Refuse this card stays disabled.

### grade10-admin-grading-counter-US3-TC3-1: A refused card's fee never charges, and the till lists only the cards that go on

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
* **Trace:** grade10-admin-grading-counter-US-03

**Pre-conditions:**
Admin(holds `grading:operate`) refuses one card of a three-card, sealed, unpaid submission before the till opens.

**Steps:**

1. Refuse the card with a reason and words.
2. Open the till.

**Expected Results:**

* The till lists one Grading Service line per remaining card only; the refused card is never charged.

### grade10-admin-grading-counter-US3-TC4-1: A refused line already paid is refunded at the till

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
* **Trace:** grade10-admin-grading-counter-US-03

**Test data:**

| Field | Value |
| --- | --- |
| Fee already paid for the card | 60000 minor units (HKD 600.00) |

**Pre-conditions:**
Admin(holds `grading:operate`) is refusing a card whose fee was already paid at the till.

**Steps:**

1. Refuse the card with a reason and words.
2. Read the Notice on the dialog.

**Expected Results:**

* The Notice adds a refund line of 60000 minor units (HKD 600.00) at the till, back the way it was paid.

### grade10-admin-grading-counter-US3-TC5-1: Refusing a submission's only remaining card is named on the Notice

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-03

**Pre-conditions:**
Admin(holds `grading:operate`) is refusing the last unrefused card on a submission whose other cards, if any, have already been refused or withdrawn.

**Steps:**

1. Open Refuse on the last card.
2. Choose a reason and type the words.
3. Read the Notice.

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
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-04

**Pre-conditions:**
Admin(holds `grading:operate`) is at the hand-back runbook of a `ready` submission with a four-digit pickup code and the collector's name on the page.

**Steps:**

1. Take the pickup code.
2. Take the name given at the counter.
3. Match it to the submission page.

**Expected Results:**

* Step 3 matches the code to the submission and the given name to the collector on the page.

### grade10-admin-grading-counter-US4-TC2-1: Above the threshold, the counter glances at an ID and keeps nothing

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
* **Trace:** grade10-admin-grading-counter-US-04

**Test data:**

| Field | Value |
| --- | --- |
| ID glance threshold | 1000000 minor units (HKD 10,000.00) |
| Declared total | 1200000 minor units (HKD 12,000.00) |

**Pre-conditions:**
Admin(holds `grading:operate`) is verifying a collector at hand-back whose submission's declared total is above the threshold.

**Steps:**

1. Match the code and the name.
2. Glance at an ID matching the name.
3. Continue.

**Expected Results:**

* Step 2 shows the ID line.
* Step 3 records that an ID was matched to the name, keeping no document number or photograph.

### grade10-admin-grading-counter-US4-TC3-1: At the threshold, the code and the name alone release the cards

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-04

**Test data:**

| Field | Value |
| --- | --- |
| ID glance threshold | 1000000 minor units (HKD 10,000.00) |
| Declared total | 1000000 minor units (HKD 10,000.00) |

**Pre-conditions:**
Admin(holds `grading:operate`) is verifying a collector at hand-back whose submission's declared total is exactly the threshold.

**Steps:**

1. Match the code and the name.
2. Continue.

**Expected Results:**

* No ID line is offered at exactly the figure: above the threshold is more than the figure, never the figure itself. The matched code and name alone release the cards.

### grade10-admin-grading-counter-US4-TC4-1: A wrong pickup code is refused on the field

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-04

**Pre-conditions:**
Admin(holds `grading:operate`) is at the hand-back runbook. The person at the desk gives a code that does not match the submission.

**Steps:**

1. Type the wrong code.
2. Submit it.

**Expected Results:**

* The field refuses the code; nothing releases.

### grade10-admin-grading-counter-US4-TC5-1: The upcharge and the storage accrued are settled at the till before anything is handed over

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
* **Trace:** grade10-admin-grading-counter-US-04

**Test data:**

| Field | Value |
| --- | --- |
| Upcharge due | 60000 minor units (HKD 600.00) |
| Storage accrued | 12000 minor units (HKD 120.00) |

**Pre-conditions:**
Admin(holds `grading:operate`) matched the collector on a `ready` submission owing an upcharge and storage.

**Steps:**

1. Read the Settle step.
2. Take payment.

**Expected Results:**

* Step 1 lists the upcharge and storage lines separately, totalling 72000 minor units (HKD 720.00).
* Step 2 takes payment before any item can be ticked over.

### grade10-admin-grading-counter-US4-TC6-1: Nothing due ticks the Settle step through without opening the till

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-04

**Pre-conditions:**
Admin(holds `grading:operate`) matched a collector on a `ready` submission with no upcharge and no storage due.

**Steps:**

1. Read the Settle step.

**Expected Results:**

* The step is ticked with nothing to take; Hand over and check proceeds without opening the till.

### grade10-admin-grading-counter-US4-TC7-1: Each item is ticked as handed over and inspected, each slab photographed

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
* **Trace:** grade10-admin-grading-counter-US-04

**Pre-conditions:**
Admin(holds `grading:operate`) settled the balance on a `ready` submission with two slabs and one raw card returned ungraded.

**Steps:**

1. Tick the first slab as handed over.
2. Photograph it.
3. Tick the raw card as handed over.

**Expected Results:**

* Steps 1 and 3 tick each item as inspected.
* Step 2 attaches one photograph to the slab; the raw card takes no photograph.

### grade10-admin-grading-counter-US4-TC8-1: The receipt is refused while anything is due or an item is unticked

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
* **Trace:** grade10-admin-grading-counter-US-04

**Pre-conditions:**
Admin(holds `grading:operate`) is on the sign step of the hand-back runbook with one item still unticked.

**Steps:**

1. Open the sign step.

**Expected Results:**

* The step names the unticked item as the reason the receipt cannot be minted.

### grade10-admin-grading-counter-US4-TC9-1: Closing on the sealed receipt moves the submission from Ready to Collected

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-04

**Pre-conditions:**
Admin(holds `grading:operate`) sealed the hand-back receipt for every item on a `ready` submission with nothing held by the grader.

**Steps:**

1. Hand over on the sealed step.

**Expected Results:**

* The packet goes over the counter; the submission reads `ready → collected`; the record stays on the page.

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
Admin(holds `grading:operate`) already closed a first hand-back on a submission with one card the grader held; that card has now come back and is ready.

**Steps:**

1. Open the submission's second hand-back.
2. Tick the one remaining item.
3. Close on its own sealed receipt.

**Expected Results:**

* Only the one held item is offered.
* The runbook opens at who is collecting, taking the code and the name again, and the ID glance where the declared total is above the threshold.
* Closing it moves the submission to `collected` on its own receipt, separate from the first.

### grade10-admin-grading-counter-US4-TC11-1: A card the grader still holds cannot be ticked and is named on the receipt

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
* **Trace:** grade10-admin-grading-counter-US-04

**Pre-conditions:**
Admin(holds `grading:operate`) settled the balance on a `ready` submission of three cards, one of which the grader is still holding.

**Steps:**

1. Read the items step.
2. Attempt to tick the held card.
3. Seal the receipt over the other two.

**Expected Results:**

* The held card's row reads as still out and cannot be ticked.
* The sealed receipt names that card as still with the grader, and the submission stays `ready`.

---

## grade10-admin-grading-counter-US5: Operator releases the cards to the named person or turns anyone else away

**As a** member of shop staff,
**I want** the hand-back step to read the person named on the submission page and the receipt to record that they collected, and the counter to refuse anyone who is neither the collector nor that person, code or no code, with no override to press,
**so that** a named person leaves with the cards and a forwarded email never walks out with somebody's slabs while the collector can name them from their phone.

### grade10-admin-grading-counter-US5-TC1-1: A named person is read from the page and recorded on the receipt as who collected

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
* **Trace:** grade10-admin-grading-counter-US-05

**Pre-conditions:**
Admin(holds `grading:operate`) is at hand-back for a `ready` submission where the collector named a pickup person on the page.

**Steps:**

1. Take the code and the named person's name.
2. Match it to the page.

**Expected Results:**

* The named person is matched, not the collector.
* The hand-back receipt records that person, not the collector, as who collected.

### grade10-admin-grading-counter-US5-TC2-1: Somebody who is neither the collector nor the named person is turned away, code or no code

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-05

**Pre-conditions:**
Admin(holds `grading:operate`) is at hand-back for a `ready` submission naming a specific pickup person. A different person presents the correct pickup code.

**Steps:**

1. Take the code from the person at the desk.
2. Take their name.

**Expected Results:**

* The name matches neither the collector nor the named person; the runbook turns them away even though the code is correct, with no override offered.

### grade10-admin-grading-counter-US5-TC3-1: No release override is offered to any grant

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-05

**Pre-conditions:**
Admin(holds `grading:operate` and `grading:approve`) is at hand-back with a turned-away person at the desk.

**Steps:**

1. Check the runbook for a release override.

**Expected Results:**

* No override control is offered, including to the `grading:approve` holder.

### grade10-admin-grading-counter-US5-TC4-1: The collector renames the pickup person from their own device before hand-back

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-05

**Pre-conditions:**
A `ready` submission currently names no pickup person. The collector is about to send someone else in their place.

**Steps:**

1. The collector names a person on the submission page.
2. Staff reload the hand-back runbook.

**Expected Results:**

* Step 2 shows the newly named person as who the hand-back step will match.

### grade10-admin-grading-counter-US5-TC5-1: The collector remains an accepted pickup identity alongside a named person

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
* **Trace:** grade10-admin-grading-counter-US-05

**Pre-conditions:**
Admin(holds `grading:operate`) is at hand-back for a `ready` submission that also names a pickup person. The collector themself arrives.

**Steps:**

1. Take the code and the collector's own name.
2. Match it.

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
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-06

**Pre-conditions:**
Admin(holds `grading:operate`) is at the items step of hand-back on a `ready` submission with an unsettled upcharge.

**Steps:**

1. Open the slab's row.
2. Read Open a vault case.

**Expected Results:**

* Open a vault case is disabled until the balance is settled.

### grade10-admin-grading-counter-US6-TC2-1: A slab opens a vault case from the same hand-back step once settled

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-06

**Pre-conditions:**
Admin(holds `grading:operate`) settled the balance on a `ready` submission with one slab.

**Steps:**

1. Open Open a vault case on the slab's row.
2. Complete opening the case with the collector.

**Expected Results:**

* The vault case opens under the collector's account, on the same visit, with no second appointment.

### grade10-admin-grading-counter-US6-TC3-1: The hand-back receipt names a vaulted card as gone to the vault

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
* **Trace:** grade10-admin-grading-counter-US-06

**Pre-conditions:**
Admin(holds `grading:operate`) opened a vault case for one of two items on a `ready` submission; the other item is handed over in person.

**Steps:**

1. Complete hand-back for both items.
2. Seal and read the receipt.

**Expected Results:**

* The receipt names the vaulted card as gone to the vault and the other item as collected in person.

### grade10-admin-grading-counter-US6-TC4-1: Vaulting one item does not block ticking the rest of the submission's items

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-06

**Pre-conditions:**
Admin(holds `grading:operate`) is on a two-item `ready` submission, one slab and one raw card.

**Steps:**

1. Vault the slab.
2. Tick the raw card as handed over.

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
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-07

**Pre-conditions:**
Admin(holds `grading:operate`) is on the Cards tab of a `checked_in` submission with two cards, whose batch has not closed.

**Steps:**

1. Open Withdraw on one card.
2. Confirm the withdrawal.

**Expected Results:**

* The card is marked withdrawn and released; the other card stays checked in unaffected.

### grade10-admin-grading-counter-US7-TC2-1: Withdrawing refunds the card's own POS line

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-07

**Test data:**

| Field | Value |
| --- | --- |
| Card's paid fee | 60000 minor units (HKD 600.00) |

**Pre-conditions:**
Admin(holds `grading:operate`) withdraws a card whose fee line was already paid at hand-in.

**Steps:**

1. Withdraw the card.
2. Read the refund line.

**Expected Results:**

* A refund of 60000 minor units (HKD 600.00) is recorded at the till, back the way the fee was paid.

### grade10-admin-grading-counter-US7-TC3-1: The withdrawal is offered against a hand-back receipt naming that one card

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
* **Trace:** grade10-admin-grading-counter-US-07

**Pre-conditions:**
Admin(holds `grading:operate`) is withdrawing a card at Handed in.

**Steps:**

1. Withdraw the card.
2. Read the receipt offered.

**Expected Results:**

* The card is released against a hand-back receipt naming that one card, separate from the submission's eventual full receipt.

### grade10-admin-grading-counter-US7-TC4-1: Withdraw is absent once the batch has closed

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-07

**Pre-conditions:**
Admin(holds `grading:operate`) opens the Cards tab of a submission whose batch has closed.

**Steps:**

1. Open the Cards tab.
2. Check the card row's actions.

**Expected Results:**

* Withdraw is not offered on any card row.

### grade10-admin-grading-counter-US7-TC5-1: Withdrawing one card leaves the rest of the submission going on to the grader

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-07

**Pre-conditions:**
Admin(holds `grading:operate`) is on a `checked_in` submission with three cards before the batch closes.

**Steps:**

1. Withdraw one card.
2. Read the remaining cards' status.

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
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-08

**Test data:**

| Field | Value |
| --- | --- |
| Upcharge | 60000 minor units (HKD 600.00) |

**Pre-conditions:**
Admin A(holds `grading:approve`) is on the Money tab of a `returned` submission owing the upcharge; admin B also holds `grading:approve`.

**Steps:**

1. Open Waive the upcharge.
2. Type the reason.
3. Send the request.
4. As admin B, on admin B's own console, open the request and approve it.

**Expected Results:**

* Step 3 leaves the due as it was and shows the request waiting for a second approve holder.
* Step 4 records the waiver with the reason, admin A as the recorder and admin B as the approver.
* The collector's due drops by 60000 minor units (HKD 600.00) before collection.

### grade10-admin-grading-counter-US8-TC2-1: Waive is absent until the cards are back

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-08

**Pre-conditions:**
Admin(holds `grading:approve`) is on the Money tab of a `sent` submission with an upcharge expected once graded.

**Steps:**

1. Open the Money tab.
2. Check for Waive the upcharge.

**Expected Results:**

* The act is absent; nothing offers to write off before the cards are back.

### grade10-admin-grading-counter-US8-TC3-1: The recorder cannot approve their own waiver

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-08

**Pre-conditions:**
Admin A(holds `grading:approve`) asked for a waiver of the upcharge on a `returned` submission.

**Steps:**

1. As admin A, open the request and approve it.

**Expected Results:**

* The approval is refused by name: the recorder cannot approve their own request.
* No waiver is written and the due is unchanged.

### grade10-admin-grading-counter-US8-TC4-1: A waiver refuses a second person who does not hold `grading:approve`

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-08

**Pre-conditions:**
Admin A(holds `grading:approve`) asked for a waiver of the upcharge on a `returned` submission. Admin C's roles do not hold `grading:approve`.

**Steps:**

1. As admin C, on admin C's own console, send the approval of admin A's request.

**Expected Results:**

* The approval is refused by name, naming `grading:approve`.
* No waiver is written and the due is unchanged.

### grade10-admin-grading-counter-US8-TC5-1: A waived upcharge is filed under the submission on the audit chain

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-08

**Pre-conditions:**
Admin A and admin B both hold `grading:approve`; A asks for a waiver of an upcharge on a `returned` submission.

**Steps:**

1. As admin B, on admin B's own console, approve the request.
2. Open the Timeline tab.

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
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-09

**Test data:**

| Row | Route | Declared value | Fee refunded |
| --- | --- | --- | --- |
| A | Till | 300000 minor units (HKD 3,000.00) | 60000 minor units (HKD 600.00) |
| B | Bank transfer | 300000 minor units (HKD 3,000.00) | 60000 minor units (HKD 600.00) |

**Pre-conditions:**
Admin A(holds `grading:approve`) is on the Money tab of a submission whose batch was received with one card not returned; admin B also holds `grading:approve`.

**Steps:**

1. Open Payout.
2. Choose the row's route and type the reason.
3. Send the request.
4. As admin B, on admin B's own console, open the request and approve it.

**Expected Results:**

* Step 3 records no payout and no refund.
* Step 4 records the row's declared value and refunds the row's fee, on its own record with admin A as the recorder and admin B as the approver, by the row's route.

### grade10-admin-grading-counter-US9-TC2-1: A payout past its settlement window is marked on the dialog

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
* **Trace:** grade10-admin-grading-counter-US-09

**Test data:**

| Field | Value |
| --- | --- |
| Settlement window | 14 days from the batch's received day |

**Pre-conditions:**
Admin(holds `grading:approve`) opens Payout on a card not returned, 15 days after the batch's received day.

**Steps:**

1. Open Payout.

**Expected Results:**

* The dialog marks that the window has passed.

### grade10-admin-grading-counter-US9-TC3-1: A payout is reversed on its own record when the card turns up

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-09

**Pre-conditions:**
Admin A(holds `grading:approve`) recorded a payout for a card the grader has now located; admin B also holds `grading:approve`.

**Steps:**

1. Open the payout's record.
2. Ask for its reversal with a reason.
3. As admin B, on admin B's own console, approve the request.

**Expected Results:**

* The reversal is written on the same payout record; the card's outcome returns to the submission rather than staying paid out.

### grade10-admin-grading-counter-US9-TC4-1: The recorder cannot approve their own payout

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-09

**Pre-conditions:**
Admin A(holds `grading:approve`) asked for a payout on a card not returned.

**Steps:**

1. As admin A, open the request and approve it.

**Expected Results:**

* The approval is refused by name: the recorder cannot approve their own request.
* No payout and no refund is written.

### grade10-admin-grading-counter-US9-TC5-1: A payout is filed under the submission on the audit chain

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-09

**Pre-conditions:**
Admin A and admin B both hold `grading:approve`; admin A asked for a payout on a card not returned.

**Steps:**

1. As admin B, on admin B's own console, approve the request.
2. Open the Timeline tab.

**Expected Results:**

* The payout, its route, its amount and both admins' names appear as an event filed under the submission.

### grade10-admin-grading-counter-US9-TC6-1: A payout still owed past its window badges its row on the queue

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
* **Trace:** grade10-admin-grading-counter-US-09

**Pre-conditions:**
Admin(holds `grading:read`) is on <grade10 admin grading queue url>. A payout is owed on a card whose batch was received at the shop 15 days ago, with `grading.settlement_days` at 14 and nothing paid out.

**Steps:**

1. Navigate to <grade10 admin grading queue url>.
2. Read the submission's row.

**Expected Results:**

* The row badges the payout as past its window, derived at the read from the batch's received day.

### grade10-admin-grading-counter-US9-TC7-1: A card already carrying a live payout refuses a second

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
* **Trace:** grade10-admin-grading-counter-US-09

**Pre-conditions:**
Admin(holds `grading:approve`) opens Payout on a card that already carries a payout nobody has reversed.

**Steps:**

1. Open Payout on that card.
2. Ask for a second payout.

**Expected Results:**

* The second payout is refused by name, naming the payout the card already carries.
* Nothing is written and the first record is untouched.

### grade10-admin-grading-counter-US9-TC8-1: A payout request nobody has approved moves no money

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-09

**Pre-conditions:**
Admin A(holds `grading:approve`) is on the Money tab of a submission with one card not returned; nobody else has opened it.

**Steps:**

1. Open Payout, choose the till and type the reason.
2. Send the request.
3. Read the Money tab and the Timeline tab.

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
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-10

**Pre-conditions:**
Admin(holds `grading:read`) opens the Cards tab of a `returned` submission with one card moved up a level.

**Steps:**

1. Open the Cards tab.
2. Read the moved-up card's row.

**Expected Results:**

* The row shows the intake id, the declared value, the original level and the level moved to, the grade in the grader's words (for example `PSA 10 GEM MT`) and its cert, and its outcome.

### grade10-admin-grading-counter-US10-TC2-1: The Money tab shows paid, due, refunded and paid out with the till's own references

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
* **Trace:** grade10-admin-grading-counter-US-10

**Test data:**

| Field | Value |
| --- | --- |
| Paid at hand-in | 240000 minor units (HKD 2,400.00) |
| Upcharge due | 60000 minor units (HKD 600.00) |
| Storage accrued | 12000 minor units (HKD 120.00) |

**Pre-conditions:**
Admin(holds `grading:read`) opens the Money tab of a `ready` submission with a paid hand-in fee, an upcharge due and storage accrued.

**Steps:**

1. Open the Money tab.

**Expected Results:**

* Paid at hand-in shows 240000 minor units (HKD 2,400.00) with its POS reference.
* To settle shows the upcharge and storage lines separately, totalling 72000 minor units (HKD 720.00).

### grade10-admin-grading-counter-US10-TC3-1: The till and the record say the same figure

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-10

**Pre-conditions:**
Admin(holds `grading:read`) is comparing the Money tab's paid line against the POS reference it names.

**Steps:**

1. Open the Money tab.
2. Open the POS order by its reference.

**Expected Results:**

* The paid amount on the Money tab matches the POS order's total exactly.

### grade10-admin-grading-counter-US10-TC4-1: The header answers the phone with what is due, what came back ungraded, and the batch

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
* **Trace:** grade10-admin-grading-counter-US-10

**Pre-conditions:**
Admin(holds `grading:read`) opens a `returned` submission with an upcharge due and one card ungraded, in a named batch.

**Steps:**

1. Read the header.

**Expected Results:**

* The header shows the summary, declared in total, the upcharge to settle, the ungraded card, and the batch it is in.

### grade10-admin-grading-counter-US10-TC5-1: The collector's email, phone and click-to-chat templates are reachable from the header

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-10

**Pre-conditions:**
Admin(holds `grading:read`) opens a submission whose collector gave an email and a phone number.

**Steps:**

1. Read the collector block.
2. Open a click-to-chat template.

**Expected Results:**

* Step 1 shows the email and phone with a WhatsApp click-to-chat entry.
* Step 2 opens the chat pre-filled with a staff-pressed template, never sent automatically.

### grade10-admin-grading-counter-US10-TC6-1: A submission id that does not resolve shows the console's not-found line

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-10

**Pre-conditions:**
Admin(holds `grading:read`) has a link to a submission id that does not exist.

**Steps:**

1. Open that address.

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
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-11

**Pre-conditions:**
Admin(holds `grading:operate`) mints the agreement's link for a checked, unsealed submission.

**Steps:**

1. Show on iPad.
2. Read the timer.
3. Wait past 30 minutes without signing.

**Expected Results:**

* Step 2 shows a 30-minute countdown.
* Step 3 expires the link; minting again issues a new one, never two live links at once.

### grade10-admin-grading-counter-US11-TC2-1: Minting is refused in production while a fact the document prints is unset

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
* **Trace:** grade10-admin-grading-counter-US-11

**Pre-conditions:**
Admin(holds `grading:operate`) is minting the agreement in production, where the custodian's registered name is unset.

**Steps:**

1. Attempt to show on iPad.

**Expected Results:**

* The seal refuses, naming the unset fact; nothing is offered to sign.

### grade10-admin-grading-counter-US11-TC3-1: A sealed document reopens on the iPad from the Documents tab

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
* **Trace:** grade10-admin-grading-counter-US-11

**Pre-conditions:**
Admin(holds `grading:read`) opens the Documents tab of a submission with a sealed agreement.

**Steps:**

1. Open the Documents tab.
2. Show the agreement on iPad again.

**Expected Results:**

* The tab lists the document with its fingerprint.
* Showing it again reopens the same sealed copy, not a new mint.

### grade10-admin-grading-counter-US11-TC4-1: A sealed document's link is copied instead of shown on iPad

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-11

**Pre-conditions:**
Admin(holds `grading:operate`) is on a checked, unsealed submission's sign step.

**Steps:**

1. Copy link instead of Show on iPad.

**Expected Results:**

* The link copies to the clipboard for handing to the collector another way, on the same 30-minute rule.

### grade10-admin-grading-counter-US11-TC5-1: Send again resends a sealed document, or the grades email, unchanged

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-11

**Pre-conditions:**
Admin(holds `grading:operate`) opens the Documents tab of a submission with a sealed hand-back receipt, after the collector says they lost the email.

**Steps:**

1. Open Send again on the hand-back receipt.

**Expected Results:**

* The signed document is re-sent to the collector's email as the same sealed copy, with no re-mint.

### grade10-admin-grading-counter-US11-TC6-1: Before hand-in, the Documents tab shows nothing sealed

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-11

**Pre-conditions:**
Admin(holds `grading:read`) opens the Documents tab of a `booked` submission before any card is checked.

**Steps:**

1. Open the Documents tab.

**Expected Results:**

* The tab shows nothing sealed yet.

### grade10-admin-grading-counter-US11-TC7-1: A failed send is flagged with its reason and Send again offered

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-11

**Pre-conditions:**
Admin(holds `grading:read`) opens a submission whose grades email failed to send.

**Steps:**

1. Read the flagged letter.

**Expected Results:**

* The failed letter is flagged with its reason; Send again is offered on it.

### grade10-admin-grading-counter-US11-TC8-1: An agreement sealed before the hand-in is not sent again

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
* **Trace:** grade10-admin-grading-counter-US-11

**Pre-conditions:**
Admin(holds `grading:operate`) is at a `booked` submission whose agreement the collector has just sealed on the iPad, before the cards are checked in.

**Steps:**

1. Open the Documents tab.
2. Call the send for the agreement directly, outside the tab.

**Expected Results:**

* Step 1 lists the agreement with its fingerprint and offers no Send again on it.
* Step 2 is refused by name, and the collector's mailbox receives nothing.

---

## grade10-admin-grading-counter-US12: Operator posts the written notice from the Notice due rung

**As a** member of shop staff working the Ready view,
**I want** a submission uncollected past the notice day to ask me for the notice, and to record the posting date and the tracking once it is in the post, the email going the same day and the 30 days counting from that date,
**so that** the notice is a fact with a date on it and nothing after it runs off a guess.

### grade10-admin-grading-counter-US12-TC1-1: A submission ready past the notice day asks staff for the notice

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
* **Trace:** grade10-admin-grading-counter-US-12

**Test data:**

| Field | Value |
| --- | --- |
| Notice day | 180 days after ready |

**Pre-conditions:**
Admin(holds `grading:operate`) is on the Ready view with a submission ready 180 days and not collected.

**Steps:**

1. Open the Ready view.
2. Read the submission's badge.

**Expected Results:**

* The row and the submission page badge read Notice due.

### grade10-admin-grading-counter-US12-TC2-1: Posting the notice records the posting date and tracking; the email goes the same day

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-12

**Pre-conditions:**
Admin(holds `grading:operate`) opens Post the notice on a submission badged Notice due.

**Steps:**

1. Open Post the notice.
2. Enter the posting date and the tracking number.
3. Record.

**Expected Results:**

* The posting date and tracking appear on the timeline.
* The notice email goes out the same day.

### grade10-admin-grading-counter-US12-TC3-1: Record is disabled while the posting date or tracking is missing

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-12

**Pre-conditions:**
Admin(holds `grading:operate`) opens Post the notice and enters only the posting date.

**Steps:**

1. Open Post the notice.
2. Enter only the posting date.

**Expected Results:**

* Record stays disabled, naming the missing tracking field.

### grade10-admin-grading-counter-US12-TC4-1: The 30 days run from the posting date, not the notice day

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
* **Trace:** grade10-admin-grading-counter-US-12

**Test data:**

| Field | Value |
| --- | --- |
| Notice day | 180 |
| Posted | day 183, 3 days after Notice due |

**Pre-conditions:**
Admin(holds `grading:operate`) posts the notice 3 days after the submission first badged Notice due.

**Steps:**

1. Post the notice on day 183.
2. Read the 30-day count.

**Expected Results:**

* The 30 days are counted from day 183, the posting date, not from day 180.

### grade10-admin-grading-counter-US12-TC5-1: Nothing more is offered once the 30 days pass

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-12

**Pre-conditions:**
Admin(holds `grading:operate`) opens a submission whose posted notice's 30 days have passed.

**Steps:**

1. Open the submission.

**Expected Results:**

* No further notice or disposal act is offered; storage keeps accruing and the cards stay in the safe.

### grade10-admin-grading-counter-US12-TC6-1: The notice's address is read only by an operate holder, and only while the notice is due

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
* **Trace:** grade10-admin-grading-counter-US-12

**Test data:**

| Field | Value |
| --- | --- |
| <submission_1> | ready 180 days, the notice due and not posted |
| <submission_2> | ready 179 days, its notice day tomorrow |

**Pre-conditions:**
Admin(holds `grading:operate`) is on the Ready view with <submission_1> and <submission_2>; a second operator holds `grading:read` alone.

**Steps:**

1. As the operate holder, open Post the notice on <submission_1>.
2. As the operate holder, ask for the notice's address on <submission_2>.
3. As the read holder, ask for the notice's address on <submission_1>.

**Expected Results:**

* Step 1: the dialog shows the postal address taken at signing.
* Step 2: refused by name, with the day the notice falls due.
* Step 3: refused by name.

---

## grade10-admin-grading-counter-US13: Admin reconstructs one submission's history on the audit chain

**As an** admin holding a submission in a dispute,
**I want** every event on the timeline with the figures it carried and the grader's stages in its words, staff-only entries kept from the collector, and every action filed under the submission on the audit chain,
**so that** the record can be tested rather than believed.

### grade10-admin-grading-counter-US13-TC1-1: The timeline lists every event with the figures it carried

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-13

**Pre-conditions:**
Admin(holds `grading:read`) opens the Timeline tab of a submission with a paid hand-in, an upcharge and a waiver on it.

**Steps:**

1. Open the Timeline tab.

**Expected Results:**

* Every event lists its own figures — the paid amount, the upcharge, and the waiver's reason — none summarised away.

### grade10-admin-grading-counter-US13-TC2-1: The grader's stages appear on the timeline in the grader's own words

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
* **Trace:** grade10-admin-grading-counter-US-13

**Pre-conditions:**
Admin(holds `grading:read`) opens the Timeline tab of a `sent` submission whose stage was read from the grader's order status that morning.

**Steps:**

1. Open the Timeline tab.

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
Admin(holds `grading:read`) opens the Timeline tab of a submission with a staff-only note.

**Steps:**

1. Open the Timeline tab as staff.
2. Open the same submission's page as the collector would see it.

**Expected Results:**

* Step 1 shows the staff-only entry.
* Step 2 does not show that entry anywhere on the collector's page.

### grade10-admin-grading-counter-US13-TC4-1: Every action on the submission is filed under it on the audit chain

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
Admin(holds `grading:approve`) records a waiver on a submission.

**Steps:**

1. Complete the waiver.
2. Open the audit chain for that submission.

**Expected Results:**

* The waiver appears filed under that submission's own chain, distinct from any other submission's.

---

## grade10-admin-grading-counter-US14: Operator's acts follow the grant they hold and the status in front of them

**As a** member of shop staff,
**I want** each tab to offer exactly the acts my grant and the submission's status allow, cancel only on the collector's word and never once the visit starts or a card is checked or refused, refused independently when the submission has moved under me,
**so that** I am never shown a button that will only be refused, and two of us at one counter cannot leave a submission where neither meant.

### grade10-admin-grading-counter-US14-TC1-1: An operate-grant holder sees only the acts that grant covers

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-14

**Pre-conditions:**
Admin(holds `grading:operate`, not `grading:approve`) opens the Money tab of a `returned` submission owing an upcharge.

**Steps:**

1. Open the Money tab.
2. Check for Waive the upcharge and Payout.

**Expected Results:**

* Waive the upcharge and Payout are absent; only the acts `grading:operate` covers are offered.

### grade10-admin-grading-counter-US14-TC2-1: Cancel is never offered once the cards have left

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
* **Trace:** grade10-admin-grading-counter-US-14

**Pre-conditions:**
Admin(holds `grading:operate`) opens a `checked_in` submission whose cards are sealed in the intake bag.

**Steps:**

1. Open the submission's actions.

**Expected Results:**

* Cancel is not offered on any status from `checked_in` onward.

### grade10-admin-grading-counter-US14-TC3-1: A stale act is refused by name when the submission moved under the operator

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
* **Trace:** grade10-admin-grading-counter-US-14

**Pre-conditions:**
Two admins, A and B, both holding `grading:operate`, open the same `booked` submission's hand-in runbook at the same time. Admin A checks the submission in first.

**Steps:**

1. Admin B, working from the state before A's check-in, attempts to refuse a card.
2. Read the refusal.

**Expected Results:**

* Admin B's act is refused by name, naming that the submission has moved; the panel re-reads the current state rather than overwriting it.

### grade10-admin-grading-counter-US14-TC4-1: A read-grant holder is offered no act on any tab

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-14

**Pre-conditions:**
Admin(holds `grading:read` only) opens each tab of a `returned` submission.

**Steps:**

1. Open the Cards tab.
2. Open the Money tab.
3. Open the Documents tab.

**Expected Results:**

* Every tab offers reading only; no act appears on any of the three.

### grade10-admin-grading-counter-US14-TC5-1: An approve-grant holder sees the operate acts as well as the approve-only ones

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-14

**Pre-conditions:**
Admin(holds `grading:approve`) opens a `checked_in` submission with a card to check and a `returned` submission's upcharge to settle.

**Steps:**

1. Open the Cards tab and check a card.
2. Open the Money tab on the other submission.

**Expected Results:**

* Step 1 succeeds as it would for `grading:operate`.
* Step 2 also offers Waive and Payout, the acts of both grants offered together.

### grade10-admin-grading-counter-US14-TC6-1: Production asks for the second factor before any grading surface opens

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
* **Trace:** grade10-admin-grading-counter-US-14

**Pre-conditions:**
Admin(holds `grading:operate`) signs in to production without a verified session.

**Steps:**

1. Sign in to the production console.
2. Open a grading surface.

**Expected Results:**

* The second factor is required before the surface opens.
* The same is optional in staging and development.

### grade10-admin-grading-counter-US14-TC7-1: One verification covers the next act for twelve hours

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-14

**Pre-conditions:**
Admin(holds `grading:operate`) verified their session an hour ago in production.

**Steps:**

1. Record a payment at the counter.
2. Work another act on the same submission.

**Expected Results:**

* Neither act asks for the second factor again; the session stays verified for 12 hours from the verification.

### grade10-admin-grading-counter-US14-TC8-1: Staff cancel a booked submission on the collector's word

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
* **Trace:** grade10-admin-grading-counter-US-14

**Pre-conditions:**
Admin(holds `grading:operate`) is on <grade10 admin grading submission url> for a `booked` submission whose visit has not started, none of whose cards the counter has checked or refused; the collector has asked the shop to call it off.

**Steps:**

1. Click Cancel on the submission.
2. Confirm the cancel.
3. Pull the submission's audit trail by its id.
4. Open the collector's messages for the submission.

**Expected Results:**

* Step 2: the submission reads Cancelled, and its drop-off is cancelled in the diary with it.
* Step 3: the cancel is on the trail, with the operator who made it.
* Step 4: no message about the cancel was sent.

### grade10-admin-grading-counter-US14-TC9-1: Cancel is withheld once the visit's start time comes or a card is checked or refused

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
* **Trace:** grade10-admin-grading-counter-US-14

**Pre-conditions:**
Admin(holds `grading:operate`) has <grade10 admin grading submission url> open in a second tab for a `booked` submission, loaded before the state in the row was reached.

**Test data:**

| State | The desk |
| --- | --- |
| Start time come | the visit's start time has come; no card checked or refused |
| Card checked early | before the visit's start time, the desk started early and checked one card, with both intake photographs |
| Card refused early | before the visit's start time, the desk started early and refused the first card, with its reason |

**Steps:**

1. Load the submission in the first tab.
2. In the second tab, click Cancel on the submission and confirm.

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
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-15

**Pre-conditions:**
Admin(holds `grading:approve`) opens Settings.

**Steps:**

1. Open Settings.
2. Read the notice-day row.

**Expected Results:**

* The table lists every setting with its current value, the owner who confirms it, and the pinned line explaining where a change takes effect.

### grade10-admin-grading-counter-US15-TC2-1: A clock is edited in place with a single saveable field

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-15

**Test data:**

| Field | Value |
| --- | --- |
| Setting | `grading.plan_nudge_days` |
| Old value | 21 |
| New value | 25 |

**Pre-conditions:**
Admin(holds `grading:approve`) is on Settings.

**Steps:**

1. Open `grading.plan_nudge_days`.
2. Change it to 25.
3. Save.

**Expected Results:**

* The field saves in place with no second-person dialog.
* The audit entry is filed under the settings subject.

### grade10-admin-grading-counter-US15-TC3-1: A money setting requires a reason and a second approve holder

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
* **Trace:** grade10-admin-grading-counter-US-15

**Test data:**

| Field | Value |
| --- | --- |
| Setting | `grading.storage_fee_per_card_month` |
| Old value | 3000 minor units (HKD 30.00) |
| New value | 3500 minor units (HKD 35.00) |

**Pre-conditions:**
Admin A(holds `grading:approve`) opens the storage fee setting; admin B also holds `grading:approve`.

**Steps:**

1. Change the value to 3500 minor units (HKD 35.00).
2. Type a reason.
3. Name admin B as the second person.
4. Save.

**Expected Results:**

* The change is refused without admin B's approval and saves once given.
* The audit entry is filed under `settings`, not under any submission.

### grade10-admin-grading-counter-US15-TC4-1: The recorder cannot approve their own settings change

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-15

**Pre-conditions:**
Admin A(holds `grading:approve`) edits a money setting and names themself as the second person.

**Steps:**

1. Name admin A as the second approve holder.

**Expected Results:**

* The dialog refuses admin A by name.

### grade10-admin-grading-counter-US15-TC5-1: A changed setting reaches only submissions not yet booked

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
* **Trace:** grade10-admin-grading-counter-US-15

**Test data:**

| Field | Value |
| --- | --- |
| Old storage fee | 3000 minor units (HKD 30.00) |
| New storage fee | 3500 minor units (HKD 35.00) |

**Pre-conditions:**
Admin(holds `grading:approve`) changes the storage fee setting. A submission was already booked on the old fee before the change; a new submission books after it.

**Steps:**

1. Change the storage fee with a second approval.
2. Read the already-booked submission's pinned fee.
3. Book a new submission and read its fee.

**Expected Results:**

* Step 2 still shows the old 3000 minor units (HKD 30.00) fee, unchanged.
* Step 3 shows the new 3500 minor units (HKD 35.00) fee.

### grade10-admin-grading-counter-US15-TC6-1: An operate-grant holder sees the settings table read-only

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-15

**Pre-conditions:**
Admin(holds `grading:operate`, not `grading:approve`) opens Settings.

**Steps:**

1. Open Settings.
2. Try to open a field to edit.

**Expected Results:**

* The table reads, but no field opens for editing.

### grade10-admin-grading-counter-US15-TC7-1: An unset fact is marked on Settings with its readiness owner

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-15

**Pre-conditions:**
Admin(holds `grading:approve`) opens Settings before Commercial has supplied a fee sheet row.

**Steps:**

1. Open Settings.
2. Read the fee sheet section.

**Expected Results:**

* The unset row is marked as a bracketed value, naming its owner on the readiness line.

### grade10-admin-grading-counter-US15-TC8-1: A read that needs a setting nobody has written is refused by name

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
* **Trace:** grade10-admin-grading-counter-US-15

**Pre-conditions:**
Admin(holds `grading:read`) opens a surface that needs `grading.storage_fee_per_card_month`, which no owner has written.

**Steps:**

1. Open the submission's Money tab.

**Expected Results:**

* The read is refused by name, naming that setting and its owner.
* No value compiled into the code is used in its place.

### grade10-admin-grading-counter-US15-TC9-1: The reference rate is written by one approve holder, and nought is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-15

**Pre-conditions:**
Admin(holds `grading:approve`) opens Settings, with the reference rate at 7.84.

**Steps:**

1. Change the reference rate to 7.90 and save.
2. Change it to 0 and save.

**Expected Results:**

* The first save writes 7.90 with no second-person dialog, naming the writer alone.
* The second save is refused, naming the reference rate, and 7.90 stays.

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
| `grade10-admin-grading-counter-US4-TC8-1` | Covered | `grade10-admin-grading-counter-SC-43`, `grade10-admin-grading-counter-SC-44` |
| `grade10-admin-grading-counter-US4-TC9-1` | Covered | `grade10-admin-grading-counter-SC-35` |
| `grade10-admin-grading-counter-US4-TC4-1` | Raised, answered, folded | The blind pass could not tell whether repeated wrong codes do anything beyond the field's own refusal. Answered: a wrong code is refused as often as it is typed, nothing closes the field, each refusal is on the timeline, and the ID glance against the collector's own name is the fallback. Folded as `grade10-admin-grading-counter-SC-91` and landed as `Q76` |
| `grade10-admin-grading-counter-US4-TC10-1` | Raised, answered, folded | The blind pass could not tell whether a second hand-back re-runs who is collecting. Answered: it does, as every hand-back does. Folded as `grade10-admin-grading-counter-SC-90`, added to the case, and landed as `Q78`. The case's own close is `grade10-admin-grading-counter-SC-36` |
| `grade10-admin-grading-counter-US5-TC1-1` | Covered | `grade10-admin-grading-counter-SC-38` |
| `grade10-admin-grading-counter-US5-TC2-1` | Covered | `grade10-admin-grading-counter-SC-39` |
| `grade10-admin-grading-counter-US5-TC3-1` | Covered | `grade10-admin-grading-counter-SC-39` |
| `grade10-admin-grading-counter-US5-TC4-1` | Covered | `grade10-admin-grading-counter-SC-38` — the counter reads the person named on the page as it stands at the hand-back; naming them is the collector's own act in `grade10-site/grading/submission-lifecycle` |
| `grade10-admin-grading-counter-US5-TC5-1` | Folded | The collector collecting while somebody else is also named reached no scenario; the requirement releases to two people and the second is folded as `grade10-admin-grading-counter-SC-92` |
| `grade10-admin-grading-counter-US6-TC1-1` | Covered | `grade10-admin-grading-counter-SC-41` |
| `grade10-admin-grading-counter-US6-TC2-1` | Covered | `grade10-admin-grading-counter-SC-40` |
| `grade10-admin-grading-counter-US6-TC3-1` | Covered | `grade10-admin-grading-counter-SC-40` |
| `grade10-admin-grading-counter-US6-TC4-1` | Covered | `grade10-admin-grading-counter-SC-33`, `grade10-admin-grading-counter-SC-40` |
| `grade10-admin-grading-counter-US7-TC1-1` | Covered | `grade10-admin-grading-counter-SC-54` |
| `grade10-admin-grading-counter-US7-TC2-1` | Covered | `grade10-admin-grading-counter-SC-54` |
| `grade10-admin-grading-counter-US7-TC3-1` | Covered | `grade10-admin-grading-counter-SC-54` |
| `grade10-admin-grading-counter-US7-TC4-1` | Covered | `grade10-admin-grading-counter-SC-55` |
| `grade10-admin-grading-counter-US7-TC5-1` | Covered | `grade10-admin-grading-counter-SC-54` |
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
| `grade10-admin-grading-counter-US11-TC7-1` | Covered | `grade10-admin-grading-counter-SC-11`, `grade10-admin-grading-counter-SC-49` — the letter's own failure and the reason it carries are `grade10-site/grading/collector-notifications`'s, and this capability offers the send again |
| `grade10-admin-grading-counter-US12-TC1-1` | Covered | `grade10-admin-grading-counter-SC-08`, `grade10-admin-grading-counter-SC-65` |
| `grade10-admin-grading-counter-US12-TC2-1` | Covered | `grade10-admin-grading-counter-SC-66`, `grade10-admin-grading-counter-SC-67` |
| `grade10-admin-grading-counter-US12-TC3-1` | Covered | `grade10-admin-grading-counter-SC-66` |
| `grade10-admin-grading-counter-US12-TC4-1` | Covered | `grade10-admin-grading-counter-SC-67` |
| `grade10-admin-grading-counter-US12-TC5-1` | Covered | `grade10-admin-grading-counter-SC-68` |
| `grade10-admin-grading-counter-US13-TC1-1` | Covered | `grade10-admin-grading-counter-SC-56` |
| `grade10-admin-grading-counter-US13-TC2-1` | Covered | `grade10-admin-grading-counter-SC-58` |
| `grade10-admin-grading-counter-US13-TC3-1` | Covered | `grade10-admin-grading-counter-SC-57` |
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
| `grade10-admin-grading-counter-US15-TC5-1` | Covered | `grade10-admin-grading-counter-SC-72`, `grade10-admin-grading-counter-SC-73`, `grade10-admin-grading-counter-SC-74` |
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
| `grade10-admin-grading-counter-SC-47` | Out of suite | **Out of suite:** `grade10-site/grading/counter-documents`'s feature suite, which walks the collector declining on the iPad; the counter only reads the decline back on its step |
| `grade10-admin-grading-counter-SC-81` | Out of suite | **Out of suite:** the grading worker's audit-write test in the application repository — an audit entry can only be made unwritable below the console, and no counter act reaches that state from a screen |

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
