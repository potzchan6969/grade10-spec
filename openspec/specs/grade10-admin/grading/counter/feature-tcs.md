# grade10-admin/grading/counter Test Cases

**Status:** pending-review · 0/87
**Drafts styled:** 2026-10-25, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7

## Background

* PSA's five levels stand as seeded: Value up to HKD 3,900.00 a card at HKD 250.00; Regular up to HKD 11,700.00 at HKD 600.00; Express up to HKD 19,500.00 at HKD 1,200.00 with cover at 1.5%; Super Express up to HKD 39,000.00 at HKD 2,400.00 with cover; Bulk up to HKD 1,500.00 at HKD 180.00. Storage is HKD 30.00 a card a month from day 90 of ready; the ID-glance threshold HKD 10,000.00; the courier's cover and the safe's cap HKD 300,000.00; the notice day 180 and the notice period 90 days.
* admin A and admin B hold the `staff` role, carrying `grading:read`, `grading:operate` and `grading:approve`, each in a console of their own; a case naming one admin means admin A. A money setting is asked by one approve holder in the grading settings and written once the other approves.
* The grading queue is `<queue>`; a submission's console page, `<console page>`, holds its runbooks and its Cards, Money, Documents, Timeline and Activity tabs. The collector reads it at `<submission page>`, and their mail at `<collector inbox>`. The shop's iPad is at the desk; the shop's clock is Hong Kong's.

## g10adm.grading-counter.US1: Operator opens the shop and sees what every submission waits for

**As a** member of shop staff starting a shift,
**I want** the queue cut by what each submission waits for, today's submissions, and a badge naming why a row needs me,
**so that** I work the counter without being emailed anything.

<!-- trace:case id=g10adm.grading-counter.TC-d7j rev=2 covers=g10adm.grading-counter.SC-9l0,g10adm.grading-counter.SC-h3e,g10adm.grading-counter.SC-yss,g10adm.grading-counter.SC-2dw,g10adm.grading-counter.SC-pux,g10adm.grading-counter.SC-vj8,g10adm.grading-counter.SC-0zy,g10adm.grading-counter.SC-cc0,g10adm.grading-counter.SC-y4w -->
### g10adm.grading-counter.US1-TC1: The six status views cut submissions by exactly what they wait for

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-01

**Pre-conditions:**

* One submission stands at each of booked, handed in, sent, back, ready, collected, cancelled and expired.

**Steps:**

1. On `<queue>`, click Booked, Ready, Closed, Handed in, With the grader and Back in turn.

**Expected Results:**

* Each lists its own submissions and no other, with its own count; Closed lists the collected, cancelled and expired ones together; each submission is in exactly one view.
* Every row carries the submission id, the collector, the cards, the grader and level, the status word, when it was last touched and what it waits on.

<!-- trace:case id=g10adm.grading-counter.TC-2fg rev=2 covers=g10adm.grading-counter.SC-9l0,g10adm.grading-counter.SC-h3e,g10adm.grading-counter.SC-yss,g10adm.grading-counter.SC-2dw,g10adm.grading-counter.SC-pux,g10adm.grading-counter.SC-vj8,g10adm.grading-counter.SC-0zy,g10adm.grading-counter.SC-cc0,g10adm.grading-counter.SC-y4w -->
### g10adm.grading-counter.US1-TC8: Today is the shop's day, and a plan not yet brought to the desk is in no view

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-01

**Pre-conditions:**

* A booked submission was opened a minute past the shop's midnight, while UTC was still the day before; a planned submission stands too.

**Steps:**

1. Click Today, and read its rows.
2. Click every status view in turn.

**Expected Results:**

* Step 1 lists the booked submission, with its reference.
* Step 2 lists the planned submission in none of them.

<!-- trace:case id=g10adm.grading-counter.TC-jnd rev=1 covers=g10adm.grading-counter.SC-9l0,g10adm.grading-counter.SC-h3e,g10adm.grading-counter.SC-yss,g10adm.grading-counter.SC-2dw,g10adm.grading-counter.SC-pux,g10adm.grading-counter.SC-vj8,g10adm.grading-counter.SC-0zy,g10adm.grading-counter.SC-cc0,g10adm.grading-counter.SC-y4w,g10adm.grading-counter.SC-3i7,g10adm.grading-counter.SC-lz5,g10adm.grading-counter.SC-3er,g10adm.grading-counter.SC-0c4,g10adm.grading-counter.SC-8y2,g10adm.grading-counter.SC-y6m,g10adm.grading-counter.SC-6gr,g10adm.grading-counter.SC-3gz -->
### g10adm.grading-counter.US1-TC3: A row's badge is worked out at the read, never written down

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
* **Trace:** The queue

**Pre-conditions:**

* `<submission>`.

**Test data:**

| `<submission>` | `<first read>` | `<next day reads>` |
| --- | --- | --- |
| handed in this week, its batch closing today, Thursday | Batch closes today | no such badge |
| ready 29 days, uncollected | no uncollected badge | Uncollected 30 d |

**Steps:**

1. Read its row on `<queue>`.
2. The next day, with nothing done, read it again, and its Timeline tab.

**Expected Results:**

* Step 1 reads `<first read>`, step 2 `<next day reads>`; the timeline holds no entry between the reads.

<!-- trace:case id=g10adm.grading-counter.TC-28a rev=1 covers=g10adm.grading-counter.SC-9l0,g10adm.grading-counter.SC-h3e,g10adm.grading-counter.SC-yss,g10adm.grading-counter.SC-2dw,g10adm.grading-counter.SC-pux,g10adm.grading-counter.SC-vj8,g10adm.grading-counter.SC-0zy,g10adm.grading-counter.SC-cc0,g10adm.grading-counter.SC-y4w -->
### g10adm.grading-counter.US1-TC4: The tiles summarise closing, with graders, ready and to settle

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-01

**Pre-conditions:**

* The shop holds only: a PSA Regular batch closing next, two one-card submissions in it; three submissions with PSA at Express, one past its estimate; four ready and uncollected, one ready 45 days; two owing upcharges of HKD 350.00 and HKD 600.00.

**Steps:**

1. Read the four tiles on `<queue>`.

**Expected Results:**

* Batch closing names PSA Regular, 2 cards, 2 submissions, how many more may still join today and the day it ships; With graders reads 3, 1 past its estimate; Ready, uncollected 4, 1 past 30 days; To settle HKD 950.00 over 2 submissions.

<!-- trace:case id=g10adm.grading-counter.TC-swj rev=1 covers=g10adm.grading-counter.SC-9l0,g10adm.grading-counter.SC-h3e,g10adm.grading-counter.SC-yss,g10adm.grading-counter.SC-2dw,g10adm.grading-counter.SC-pux,g10adm.grading-counter.SC-vj8,g10adm.grading-counter.SC-0zy,g10adm.grading-counter.SC-cc0,g10adm.grading-counter.SC-y4w -->
### g10adm.grading-counter.US1-TC5: A view with nothing in it says so

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-01

**Pre-conditions:**

* No submission is collected, cancelled or expired.

**Steps:**

1. Click Closed.

**Expected Results:**

* It shows its empty state, every other view still offered.

<!-- trace:case id=g10adm.grading-counter.TC-36h rev=1 covers=g10adm.grading-counter.SC-9l0,g10adm.grading-counter.SC-h3e,g10adm.grading-counter.SC-yss,g10adm.grading-counter.SC-2dw,g10adm.grading-counter.SC-pux,g10adm.grading-counter.SC-vj8,g10adm.grading-counter.SC-0zy,g10adm.grading-counter.SC-cc0,g10adm.grading-counter.SC-y4w -->
### g10adm.grading-counter.US1-TC6: A view past 50 rows pages on from where the last page stopped

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-01

**Pre-conditions:**

* 51 submissions are booked, and no other.

**Steps:**

1. Click Booked, then the pager's next page.

**Expected Results:**

* The first page lists the newest-touched 50, saying more remain; the second the 51st alone, none repeated, saying none remain.

<!-- trace:case id=g10adm.grading-counter.TC-z3t rev=2 covers=g10adm.grading-counter.SC-9l0,g10adm.grading-counter.SC-h3e,g10adm.grading-counter.SC-yss,g10adm.grading-counter.SC-2dw,g10adm.grading-counter.SC-pux,g10adm.grading-counter.SC-vj8,g10adm.grading-counter.SC-0zy,g10adm.grading-counter.SC-cc0,g10adm.grading-counter.SC-y4w -->
### g10adm.grading-counter.US1-TC10: Staff are sent nothing, the queue carrying it instead

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** The grants

**Pre-conditions:**

* admin A and admin B have mailboxes the tester reads; one submission's batch has its grades in, a second is with PSA past its estimate, a third has been ready 180 days.

**Steps:**

1. Receive the first submission's batch to the end.
2. Read each staff mailbox, and `<queue>`'s tiles and rows.

**Expected Results:**

* No email or push reaches any staff; the queue's badges and tiles carry all three.

---

## g10adm.grading-counter.US2: Operator hands a booked list in at the counter

**As a** member of shop staff with a collector at the desk,
**I want** to open the submission a visit started, or write a walk-in's list with them, check each card and photograph it, confirm the level fits every declared value, show the agreement on the iPad, take the fee and any cover line at the till only once it is sealed, and print the labels and hand in with the intake receipt going out, the submission staying booked and the cards going home if no line was paid,
**so that** the cards are sealed in the bag with a receipt in one visit and nothing was paid for a card nobody checked.

<!-- trace:case id=g10adm.grading-counter.TC-nup rev=2 covers=g10adm.grading-counter.SC-0sq,g10adm.grading-counter.SC-lbh,g10adm.grading-counter.SC-tsj,g10adm.grading-counter.SC-w0j,g10adm.grading-counter.SC-1ek,g10adm.grading-counter.SC-1wd,g10adm.grading-counter.SC-92s,g10adm.grading-counter.SC-2rk,g10adm.grading-counter.SC-imm,g10adm.grading-counter.SC-xas -->
### g10adm.grading-counter.US2-TC1: A booked submission opens at the card check from Today

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-02

**Pre-conditions:**

* A submission was booked earlier on the shop's day.

**Steps:**

1. Click Today, then its reference.

**Expected Results:**

* It is listed, and its hand-in runbook opens at the card check with no Start at the desk.

<!-- trace:case id=g10adm.grading-counter.TC-5av rev=1 covers=g10adm.grading-counter.SC-0sq,g10adm.grading-counter.SC-lbh,g10adm.grading-counter.SC-tsj,g10adm.grading-counter.SC-w0j,g10adm.grading-counter.SC-1ek,g10adm.grading-counter.SC-1wd,g10adm.grading-counter.SC-92s,g10adm.grading-counter.SC-2rk,g10adm.grading-counter.SC-imm,g10adm.grading-counter.SC-xas -->
### g10adm.grading-counter.US2-TC2: A walk-in's list is written at the desk, card by card

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-02

**Pre-conditions:**

* A collector is at the desk with two cards and no submission; staff is on the Walk-in desk.

**Steps:**

1. Enter the collector's email, name and phone, PSA Regular, the shop and one card at HKD 3,000.00, and click Open the submission.
2. Click Add a card, and enter the second at HKD 5,000.00.

**Expected Results:**

* Each step takes one card, no paste of a list offered; the runbook goes on from Not handed in yet with both cards, priced on Regular's fee as it stands at the hand-in.

<!-- trace:case id=g10adm.grading-counter.TC-pdw rev=2 covers=g10adm.grading-counter.SC-0sq,g10adm.grading-counter.SC-lbh,g10adm.grading-counter.SC-tsj,g10adm.grading-counter.SC-w0j,g10adm.grading-counter.SC-1ek,g10adm.grading-counter.SC-1wd,g10adm.grading-counter.SC-92s,g10adm.grading-counter.SC-2rk,g10adm.grading-counter.SC-imm,g10adm.grading-counter.SC-xas -->
### g10adm.grading-counter.US2-TC3: A card is checked present, condition-noted and photographed front and back

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-02

**Pre-conditions:**

* A booked submission's runbook is open; `<submission page>` is open beside it.

**Steps:**

1. Tick Present on the first card, type Light whitening on the back corners, and take the front and back photographs.
2. Reload `<submission page>`.

**Expected Results:**

* The card reads checked, the note as typed in place of Nothing noted.
* Both photographs show on the collector's page.

<!-- trace:case id=g10adm.grading-counter.TC-qdz rev=2 covers=g10adm.grading-counter.SC-0sq,g10adm.grading-counter.SC-lbh,g10adm.grading-counter.SC-tsj,g10adm.grading-counter.SC-w0j,g10adm.grading-counter.SC-1ek,g10adm.grading-counter.SC-1wd,g10adm.grading-counter.SC-92s,g10adm.grading-counter.SC-2rk,g10adm.grading-counter.SC-imm,g10adm.grading-counter.SC-xas -->
### g10adm.grading-counter.US2-TC4: A card declared at the level's ceiling is checked in at that level

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-02

**Pre-conditions:**

* A booked Value submission holds one card declared HKD 3,900.00, Value's ceiling.

**Steps:**

1. Check the card, and read the level check.

**Expected Results:**

* Every declared value reads inside the ceiling, the at-ceiling card fitting.

<!-- trace:case id=g10adm.grading-counter.TC-yce rev=2 covers=g10adm.grading-counter.SC-0sq,g10adm.grading-counter.SC-lbh,g10adm.grading-counter.SC-tsj,g10adm.grading-counter.SC-w0j,g10adm.grading-counter.SC-1ek,g10adm.grading-counter.SC-1wd,g10adm.grading-counter.SC-92s,g10adm.grading-counter.SC-2rk,g10adm.grading-counter.SC-imm,g10adm.grading-counter.SC-xas -->
### g10adm.grading-counter.US2-TC5: A card above the level's ceiling is refused at that level, offered a second submission

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-02

**Pre-conditions:**

* A booked Value submission holds two cards of HKD 3,000.00.

**Test data:**

| `<declared at the desk>` |
| --- |
| HKD 4,000.00 |
| HKD 3,900.01 |

**Steps:**

1. Tick Present on the first card, change its value to `<declared at the desk>`, and read the level check and its row.

**Expected Results:**

* The row is marked above Value's ceiling and refused at Value by name; moving it to a second submission or refusing it is offered, the rest of the list unaffected.

<!-- trace:case id=g10adm.grading-counter.TC-z7k rev=2 covers=g10adm.grading-counter.SC-0sq,g10adm.grading-counter.SC-lbh,g10adm.grading-counter.SC-tsj,g10adm.grading-counter.SC-w0j,g10adm.grading-counter.SC-1ek,g10adm.grading-counter.SC-1wd,g10adm.grading-counter.SC-92s,g10adm.grading-counter.SC-2rk,g10adm.grading-counter.SC-imm,g10adm.grading-counter.SC-xas -->
### g10adm.grading-counter.US2-TC6: The agreement is not offered while a card is unchecked

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-02

**Pre-conditions:**

* A booked three-card submission has two cards checked, the third neither checked nor refused.

**Steps:**

1. Read the Sign the agreement step.

**Expected Results:**

* It names the unchecked card as why the agreement cannot be prepared.

<!-- trace:case id=g10adm.grading-counter.TC-j89 rev=2 covers=g10adm.grading-counter.SC-0sq,g10adm.grading-counter.SC-lbh,g10adm.grading-counter.SC-tsj,g10adm.grading-counter.SC-w0j,g10adm.grading-counter.SC-1ek,g10adm.grading-counter.SC-1wd,g10adm.grading-counter.SC-92s,g10adm.grading-counter.SC-2rk,g10adm.grading-counter.SC-imm,g10adm.grading-counter.SC-xas -->
### g10adm.grading-counter.US2-TC7: The agreement is shown on the iPad once every card is checked

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-02

**Pre-conditions:**

* A booked two-card submission has both cards checked.

**Steps:**

1. Read the Sign the agreement step, and click Show on iPad.

**Expected Results:**

* It offers Show on iPad and Copy link with the 30-minute line; the iPad shows the schedule of cards as checked.

<!-- trace:case id=g10adm.grading-counter.TC-82p rev=2 covers=g10adm.grading-counter.SC-0sq,g10adm.grading-counter.SC-lbh,g10adm.grading-counter.SC-tsj,g10adm.grading-counter.SC-w0j,g10adm.grading-counter.SC-1ek,g10adm.grading-counter.SC-1wd,g10adm.grading-counter.SC-92s,g10adm.grading-counter.SC-2rk,g10adm.grading-counter.SC-imm,g10adm.grading-counter.SC-xas -->
### g10adm.grading-counter.US2-TC8: The till opens only on the sealed agreement, one line per card and a cover line where the level carries one

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-02

**Pre-conditions:**

* A booked Express submission's two cards, declared HKD 2,000.00 and HKD 4,000.00, are checked; the agreement is not sealed.

**Steps:**

1. Read Take payment.
2. Show the agreement on the iPad, and have the collector sign it.
3. Click Take payment, and record the paid order.

**Expected Results:**

* Step 1 is disabled, naming the unsealed agreement.
* Step 3 opens the till with one Grading Service line per card at HKD 1,200.00 and a cover line per card, HKD 30.00 and HKD 60.00; the order writes back one fee line to each card in list order, a cover line beside each.

<!-- trace:case id=g10adm.grading-counter.TC-w9c rev=2 covers=g10adm.grading-counter.SC-0sq,g10adm.grading-counter.SC-lbh,g10adm.grading-counter.SC-tsj,g10adm.grading-counter.SC-w0j,g10adm.grading-counter.SC-1ek,g10adm.grading-counter.SC-1wd,g10adm.grading-counter.SC-92s,g10adm.grading-counter.SC-2rk,g10adm.grading-counter.SC-imm,g10adm.grading-counter.SC-xas -->
### g10adm.grading-counter.US2-TC9: No paid line, no hand-in: the submission stays booked and the cards go home

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-02

**Pre-conditions:**

* A booked submission's cards are checked and its agreement sealed; Take payment has opened the till.

**Steps:**

1. Close the till without taking payment, and click Print labels and check in.

**Expected Results:**

* It is refused by name; the submission stays booked with its seal standing, the cards going home, and running the till again or another visit is offered.

<!-- trace:case id=g10adm.grading-counter.TC-7cd rev=2 covers=g10adm.grading-counter.SC-0sq,g10adm.grading-counter.SC-lbh,g10adm.grading-counter.SC-tsj,g10adm.grading-counter.SC-w0j,g10adm.grading-counter.SC-1ek,g10adm.grading-counter.SC-1wd,g10adm.grading-counter.SC-92s,g10adm.grading-counter.SC-2rk,g10adm.grading-counter.SC-imm,g10adm.grading-counter.SC-xas -->
### g10adm.grading-counter.US2-TC10: A list that would carry the safe past its cap is refused at the desk

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-02

**Pre-conditions:**

* The safe holds HKD 299,000.00; a booked submission declares HKD 2,000.00, reaching `<at>`.

**Test data:**

| `<at>` | `<refused>` |
| --- | --- |
| its runbook opened from Today, no card checked | at the first step: no card can be checked and no till offered |
| check-in, every card checked and the fee paid | at Print labels and check in |

**Steps:**

1. Read the runbook at `<at>`.

**Expected Results:**

* It is refused `<refused>`, naming the safe's cap, and offers Book the next visit.

<!-- trace:case id=g10adm.grading-counter.TC-48j rev=1 covers=g10adm.grading-counter.SC-0sq,g10adm.grading-counter.SC-lbh,g10adm.grading-counter.SC-tsj,g10adm.grading-counter.SC-w0j,g10adm.grading-counter.SC-1ek,g10adm.grading-counter.SC-1wd,g10adm.grading-counter.SC-92s,g10adm.grading-counter.SC-2rk,g10adm.grading-counter.SC-imm,g10adm.grading-counter.SC-xas -->
### g10adm.grading-counter.US2-TC11: Labels, the sealed bag and the intake receipt hand the cards in

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-02

**Pre-conditions:**

* A booked three-card submission has every card checked, its agreement sealed and its fee paid; the label printer is on.

**Steps:**

1. Click Print 3 labels and check in, and seal the cards into the intake bag with the printed list.
2. Read the status word, and the collector's latest email.

**Expected Results:**

* Three intake labels print, one per card; it reads Handed in.
* The email is the intake receipt, with the signed agreement.

<!-- trace:case id=g10adm.grading-counter.TC-1jv rev=2 covers=g10adm.grading-counter.SC-0sq,g10adm.grading-counter.SC-lbh,g10adm.grading-counter.SC-tsj,g10adm.grading-counter.SC-w0j,g10adm.grading-counter.SC-1ek,g10adm.grading-counter.SC-1wd,g10adm.grading-counter.SC-92s,g10adm.grading-counter.SC-2rk,g10adm.grading-counter.SC-imm,g10adm.grading-counter.SC-xas -->
### g10adm.grading-counter.US2-TC12: A second submission on one visit runs its own hand-in

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-02

**Pre-conditions:**

* Two submissions were opened from one visit today; staff is on the first's runbook.

**Steps:**

1. Open the second, check its cards without touching the first, and read its level check and Take payment.

**Expected Results:**

* It runs its own runbook, level check and till line, independent of the first.

<!-- trace:case id=g10adm.grading-counter.TC-7b0 rev=1 covers=g10adm.grading-counter.SC-0sq,g10adm.grading-counter.SC-lbh,g10adm.grading-counter.SC-tsj,g10adm.grading-counter.SC-w0j,g10adm.grading-counter.SC-1ek,g10adm.grading-counter.SC-1wd,g10adm.grading-counter.SC-92s,g10adm.grading-counter.SC-2rk,g10adm.grading-counter.SC-imm,g10adm.grading-counter.SC-xas -->
### g10adm.grading-counter.US2-TC14: An order recorded on another submission is refused, and a replay answers the first its own line

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-02

**Pre-conditions:**

* An Express and a Regular submission each have one card checked and the agreement sealed; one paid order carries a Grading Service line at each level.

**Steps:**

1. Record the order on the Express submission.
2. Record the same order on the Regular one.
3. Record it again on the Express one.

**Expected Results:**

* Step 1 writes the Express line back.
* Step 2 is refused, naming the Express submission as holding the order; the Regular one shows no fee line and no new entry.
* Step 3 writes nothing, showing the Express line from step 1.

---

## g10adm.grading-counter.US3: Operator refuses one card and the rest go on

**As a** member of shop staff checking a card the grader would not take,
**I want** to refuse it with one of three reasons and a line in the collector's words that shows on their page and the receipt, the list and the fee dropping to the cards that go on and a line already paid refunded at the till,
**so that** one card never charges the collector or holds the others.

<!-- trace:case id=g10adm.grading-counter.TC-iqt rev=2 covers=g10adm.grading-counter.SC-aco,g10adm.grading-counter.SC-mma,g10adm.grading-counter.SC-cmm,g10adm.grading-counter.SC-51f,g10adm.grading-counter.SC-dcy,g10adm.grading-counter.SC-dxp,g10adm.grading-counter.SC-m00 -->
### g10adm.grading-counter.US3-TC1: A card is refused with its reason, in the collector's words on the page and the receipt

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
* **Trace:** grade10-admin-grading-counter-US-03

**Pre-conditions:**

* A booked two-card submission's runbook is open, `<submission page>` beside it.

**Test data:**

| `<reason>` | `<words>` |
| --- | --- |
| The grader would not take it | Corner crease along the top edge |
| Declared above the level | Declared HKD 50,000, this level tops at HKD 39,000 |
| The collector withdrew it | Collector wants to keep this one for now |

**Steps:**

1. Click Refuse on the first card, choose `<reason>`, type `<words>`, and click Refuse this card.
2. Reload `<submission page>`.
3. Check the second card, seal, take the fee, and check in; read the intake receipt.

**Expected Results:**

* Step 1 strikes the row with its reason; steps 2 and 3 show `<words>` exactly as typed.
* The till in step 3 carries no line for the refused card.

<!-- trace:case id=g10adm.grading-counter.TC-mv4 rev=2 covers=g10adm.grading-counter.SC-aco,g10adm.grading-counter.SC-mma,g10adm.grading-counter.SC-cmm,g10adm.grading-counter.SC-51f,g10adm.grading-counter.SC-dcy,g10adm.grading-counter.SC-dxp,g10adm.grading-counter.SC-m00 -->
### g10adm.grading-counter.US3-TC2: A refusal needs a reason and the words

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-03

**Pre-conditions:**

* The Refuse dialog is open on a card.

**Test data:**

| `<reason>` | `<words>` |
| --- | --- |
| none | empty |
| The grader would not take it | empty |
| none | Corner crease along the top edge |

**Steps:**

1. Leave the dialog at `<reason>` and `<words>`, and read Refuse this card.

**Expected Results:**

* It stays disabled.

<!-- trace:case id=g10adm.grading-counter.TC-obk rev=1 covers=g10adm.grading-counter.SC-aco,g10adm.grading-counter.SC-mma,g10adm.grading-counter.SC-cmm,g10adm.grading-counter.SC-51f,g10adm.grading-counter.SC-dcy,g10adm.grading-counter.SC-dxp,g10adm.grading-counter.SC-m00 -->
### g10adm.grading-counter.US3-TC3: One refusal never holds the others, and the refused card is never charged

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-03

**Pre-conditions:**

* A booked Regular submission's three cards are checked and the agreement sealed, the fee not taken.

**Steps:**

1. Refuse the first card, The grader would not take it.
2. Click Take payment, take it, and click Print 2 labels and check in.

**Expected Results:**

* The till lists one line per remaining card; the other two are labelled and checked in, the fee standing for those two alone.

<!-- trace:case id=g10adm.grading-counter.TC-rc2 rev=1 covers=g10adm.grading-counter.SC-aco,g10adm.grading-counter.SC-mma,g10adm.grading-counter.SC-cmm,g10adm.grading-counter.SC-51f,g10adm.grading-counter.SC-dcy,g10adm.grading-counter.SC-dxp,g10adm.grading-counter.SC-m00 -->
### g10adm.grading-counter.US3-TC4: A line already paid comes back at the till

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-03

**Pre-conditions:**

* A booked Regular submission's two cards are checked, sealed and paid, HKD 600.00 each, not yet checked in.

**Steps:**

1. Click Refuse on the first card, choose The collector withdrew it with its words, and read the dialog's notice.
2. Click Refuse this card.

**Expected Results:**

* The notice adds a refund of HKD 600.00 at the till, back the way it was paid.
* The refund is taken against the submission, naming the card and the line it refunds.

<!-- trace:case id=g10adm.grading-counter.TC-lh4 rev=2 covers=g10adm.grading-counter.SC-aco,g10adm.grading-counter.SC-mma,g10adm.grading-counter.SC-cmm,g10adm.grading-counter.SC-51f,g10adm.grading-counter.SC-dcy,g10adm.grading-counter.SC-dxp,g10adm.grading-counter.SC-m00 -->
### g10adm.grading-counter.US3-TC5: Refusing the last card cancels the submission at the desk

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-03

**Pre-conditions:**

* A booked one-card submission's runbook is open; the collector's latest email is noted.

**Steps:**

1. Refuse the card, The grader would not take it, reading the notice.
2. Read the status and money, and the collector's latest email.

**Expected Results:**

* The notice says nothing is left to hand in; the submission is cancelled from booked, the card never charged, and no email is sent.

<!-- trace:case id=g10adm.grading-counter.TC-t6y rev=1 covers=g10adm.grading-counter.SC-aco,g10adm.grading-counter.SC-mma,g10adm.grading-counter.SC-cmm,g10adm.grading-counter.SC-51f,g10adm.grading-counter.SC-dcy,g10adm.grading-counter.SC-dxp,g10adm.grading-counter.SC-m00 -->
### g10adm.grading-counter.US3-TC6: A card declared above the courier's cover is refused at the check

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-03

**Pre-conditions:**

* A booked Super Express submission lists a card declared HKD 350,000.00.

**Steps:**

1. Check the card, and read it.

**Expected Results:**

* It is refused by name, naming the courier's cover, and no higher level is offered.

---

## g10adm.grading-counter.US4: Operator hands the cards back against the code and the receipt

**As a** member of shop staff with a collector at the desk,
**I want** to take the pickup code and the name, glance at an ID above the threshold and keep nothing, settle the upcharge and the storage accrued at the till, tick each item as it is handed over and inspected, photograph each slab, and show the receipt on the iPad, a second hand-back closing a submission whose card the grader held,
**so that** the submission closes on a sealed receipt with nothing outstanding.

<!-- trace:case id=g10adm.grading-counter.TC-r2b rev=1 covers=g10adm.grading-counter.SC-3s8,g10adm.grading-counter.SC-xct,g10adm.grading-counter.SC-eak,g10adm.grading-counter.SC-o99,g10adm.grading-counter.SC-m60,g10adm.grading-counter.SC-f99,g10adm.grading-counter.SC-4zl,g10adm.grading-counter.SC-ekx,g10adm.grading-counter.SC-r90,g10adm.grading-counter.SC-77c -->
### g10adm.grading-counter.US4-TC1: The code and the name open the hand-back at what is due

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-04

**Pre-conditions:**

* A ready submission's hand-back runbook is at who is collecting; the collector gives its pickup code and their name.

**Steps:**

1. Enter the code and the name.

**Expected Results:**

* Both match, and the runbook opens at Settle.

<!-- trace:case id=g10adm.grading-counter.TC-vu6 rev=1 covers=g10adm.grading-counter.SC-3s8,g10adm.grading-counter.SC-xct,g10adm.grading-counter.SC-eak,g10adm.grading-counter.SC-o99,g10adm.grading-counter.SC-m60,g10adm.grading-counter.SC-f99,g10adm.grading-counter.SC-4zl,g10adm.grading-counter.SC-ekx,g10adm.grading-counter.SC-r90,g10adm.grading-counter.SC-77c -->
### g10adm.grading-counter.US4-TC4: A wrong code is refused on the field as often as it is typed

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-04

**Pre-conditions:**

* A ready submission's hand-back runbook is at who is collecting.

**Steps:**

1. Enter three different wrong codes in turn.
2. Read who is collecting, and the Timeline tab.

**Expected Results:**

* Each is refused on the field, nothing releasing and nothing closing the field after the third.
* Step 2 offers the ID glance against the collector's own name, and the timeline lists the three refusals.

<!-- trace:case id=g10adm.grading-counter.TC-li5 rev=1 covers=g10adm.grading-counter.SC-3s8,g10adm.grading-counter.SC-xct,g10adm.grading-counter.SC-eak,g10adm.grading-counter.SC-o99,g10adm.grading-counter.SC-m60,g10adm.grading-counter.SC-f99,g10adm.grading-counter.SC-4zl,g10adm.grading-counter.SC-ekx,g10adm.grading-counter.SC-r90,g10adm.grading-counter.SC-77c -->
### g10adm.grading-counter.US4-TC2: Above the threshold an ID is glanced at, and nothing is kept

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-04

**Pre-conditions:**

* A ready Express submission declares `<declared>`; the collector holds an ID in its name.

**Test data:**

| `<declared>` |
| --- |
| HKD 12,000.00 |
| HKD 10,000.01 |

**Steps:**

1. Enter the code and the name, glance at the ID, mark it matched, and finish the hand-back.
2. Read the sealed receipt.

**Expected Results:**

* Step 1 shows the ID line.
* Step 2 records an ID matched to the name, keeping no number, photograph or kind of document.

<!-- trace:case id=g10adm.grading-counter.TC-l7q rev=1 covers=g10adm.grading-counter.SC-3s8,g10adm.grading-counter.SC-xct,g10adm.grading-counter.SC-eak,g10adm.grading-counter.SC-o99,g10adm.grading-counter.SC-m60,g10adm.grading-counter.SC-f99,g10adm.grading-counter.SC-4zl,g10adm.grading-counter.SC-ekx,g10adm.grading-counter.SC-r90,g10adm.grading-counter.SC-77c -->
### g10adm.grading-counter.US4-TC3: At the threshold the code and the name alone release the cards

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-04

**Pre-conditions:**

* A ready Regular submission declares exactly HKD 10,000.00.

**Steps:**

1. Enter the code and the name, and read the next step.

**Expected Results:**

* No ID line is offered; the code and the name release the cards.

<!-- trace:case id=g10adm.grading-counter.TC-dqc rev=1 covers=g10adm.grading-counter.SC-3s8,g10adm.grading-counter.SC-xct,g10adm.grading-counter.SC-eak,g10adm.grading-counter.SC-o99,g10adm.grading-counter.SC-m60,g10adm.grading-counter.SC-f99,g10adm.grading-counter.SC-4zl,g10adm.grading-counter.SC-ekx,g10adm.grading-counter.SC-r90,g10adm.grading-counter.SC-77c -->
### g10adm.grading-counter.US4-TC5: What is due is taken before anything is handed over

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-04

**Pre-conditions:**

* A ready submission owes an upcharge of HKD 600.00 and HKD 120.00 of storage; the code and name are matched.

**Steps:**

1. Read Settle.
2. Open Hand over and inspect.
3. Click Take payment, and take it.

**Expected Results:**

* Step 1 lists the two separately, HKD 720.00 in all.
* Step 2 ticks nothing, naming HKD 720.00 still due.
* Step 3 takes it before any item can be ticked.

<!-- trace:case id=g10adm.grading-counter.TC-gtu rev=1 covers=g10adm.grading-counter.SC-3s8,g10adm.grading-counter.SC-xct,g10adm.grading-counter.SC-eak,g10adm.grading-counter.SC-o99,g10adm.grading-counter.SC-m60,g10adm.grading-counter.SC-f99,g10adm.grading-counter.SC-4zl,g10adm.grading-counter.SC-ekx,g10adm.grading-counter.SC-r90,g10adm.grading-counter.SC-77c -->
### g10adm.grading-counter.US4-TC6: Nothing due ticks Settle through without the till

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-04

**Pre-conditions:**

* A ready submission owes nothing; the code and name are matched.

**Steps:**

1. Read Settle.

**Expected Results:**

* It is ticked with nothing to take; Hand over and inspect proceeds without the till.

<!-- trace:case id=g10adm.grading-counter.TC-et9 rev=1 covers=g10adm.grading-counter.SC-3s8,g10adm.grading-counter.SC-xct,g10adm.grading-counter.SC-eak,g10adm.grading-counter.SC-o99,g10adm.grading-counter.SC-m60,g10adm.grading-counter.SC-f99,g10adm.grading-counter.SC-4zl,g10adm.grading-counter.SC-ekx,g10adm.grading-counter.SC-r90,g10adm.grading-counter.SC-77c -->
### g10adm.grading-counter.US4-TC7: Each item is ticked as handed over and inspected, each slab photographed

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-04

**Pre-conditions:**

* A ready submission holds two slabs and one card returned ungraded, nothing due.

**Steps:**

1. Tick Handed over on the first slab and photograph it; tick the raw card.
2. Reload `<submission page>`.

**Expected Results:**

* Each item is ticked as inspected; the slab takes one photograph, the raw card none.
* The collector's page shows the slab's photograph and each item handed over.

<!-- trace:case id=g10adm.grading-counter.TC-58a rev=1 covers=g10adm.grading-counter.SC-3s8,g10adm.grading-counter.SC-xct,g10adm.grading-counter.SC-eak,g10adm.grading-counter.SC-o99,g10adm.grading-counter.SC-m60,g10adm.grading-counter.SC-f99,g10adm.grading-counter.SC-4zl,g10adm.grading-counter.SC-ekx,g10adm.grading-counter.SC-r90,g10adm.grading-counter.SC-77c -->
### g10adm.grading-counter.US4-TC11: A card the grader still holds cannot be ticked, and the receipt names it

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-04

**Pre-conditions:**

* A ready three-card submission has its third card held by the grader, nothing due.

**Steps:**

1. Try to tick Handed over on the held card.
2. Tick the other two, seal the receipt, click Hand over, and read the receipt and the status.

**Expected Results:**

* Step 1's row reads still out and takes no tick.
* Step 2's receipt names the card still with the grader; the submission stays ready.

<!-- trace:case id=g10adm.grading-counter.TC-tp0 rev=1 covers=g10adm.grading-counter.SC-3s8,g10adm.grading-counter.SC-xct,g10adm.grading-counter.SC-eak,g10adm.grading-counter.SC-o99,g10adm.grading-counter.SC-m60,g10adm.grading-counter.SC-f99,g10adm.grading-counter.SC-4zl,g10adm.grading-counter.SC-ekx,g10adm.grading-counter.SC-r90,g10adm.grading-counter.SC-77c -->
### g10adm.grading-counter.US4-TC9: The submission closes on the sealed receipt

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-04

**Pre-conditions:**

* A ready submission has every item ticked and its receipt sealed on the iPad.

**Steps:**

1. Click Hand over, and read the status word and `<submission page>`.

**Expected Results:**

* It reads Back with you, collected, the record staying on the collector's page.

<!-- trace:case id=g10adm.grading-counter.TC-elb rev=1 covers=g10adm.grading-counter.SC-3s8,g10adm.grading-counter.SC-xct,g10adm.grading-counter.SC-eak,g10adm.grading-counter.SC-o99,g10adm.grading-counter.SC-m60,g10adm.grading-counter.SC-f99,g10adm.grading-counter.SC-4zl,g10adm.grading-counter.SC-ekx,g10adm.grading-counter.SC-r90,g10adm.grading-counter.SC-77c -->
### g10adm.grading-counter.US4-TC10: A second hand-back reads who collects again and closes the submission

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-04

**Pre-conditions:**

* A three-card submission's first hand-back closed over two cards; the held one is back.

**Steps:**

1. Open the second hand-back, enter the code and the name, settle, and tick the one item.
2. Seal its receipt, and click Hand over.

**Expected Results:**

* Step 1 offers the one held item, opening at who is collecting with the ID glance where the declared total is above the threshold.
* Step 2 closes it collected, on its own receipt.

---

## g10adm.grading-counter.US5: Operator releases the cards to the named person or turns anyone else away

**As a** member of shop staff,
**I want** the hand-back step to read the person named on the submission page and the receipt to record that they collected, and the counter to refuse anyone who is neither the collector nor that person, code or no code, with no override to press,
**so that** a named person leaves with the cards and a forwarded email never walks out with somebody's slabs while the collector can name them from their phone.

<!-- trace:case id=g10adm.grading-counter.TC-05h rev=1 covers=g10adm.grading-counter.SC-90l,g10adm.grading-counter.SC-u6y,g10adm.grading-counter.SC-x8k,g10adm.grading-counter.SC-vhz -->
### g10adm.grading-counter.US5-TC1: The named person, or the collector, collects, and the receipt says who

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-05

**Pre-conditions:**

* A ready submission's collector named Chan Tai Man on their page; `<at the desk>` holds the code.

**Test data:**

| `<at the desk>` |
| --- |
| Chan Tai Man |
| the collector |

**Steps:**

1. Enter the code and `<at the desk>`'s name, and read who the runbook matches.
2. Work the hand-back to the end, and read the sealed receipt.

**Expected Results:**

* It matches and releases to `<at the desk>`; the receipt records them as who collected.

<!-- trace:case id=g10adm.grading-counter.TC-psk rev=1 covers=g10adm.grading-counter.SC-90l,g10adm.grading-counter.SC-u6y,g10adm.grading-counter.SC-x8k,g10adm.grading-counter.SC-vhz -->
### g10adm.grading-counter.US5-TC4: A person named from the collector's phone reaches the counter at once

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-05

**Pre-conditions:**

* A ready submission names nobody; staff has its hand-back runbook open.

**Steps:**

1. As the collector, name Chan Tai Man on `<submission page>`.
2. As staff, reload the runbook.

**Expected Results:**

* It shows Chan Tai Man as who the hand-back will match.

<!-- trace:case id=g10adm.grading-counter.TC-i9q rev=1 covers=g10adm.grading-counter.SC-90l,g10adm.grading-counter.SC-u6y,g10adm.grading-counter.SC-x8k,g10adm.grading-counter.SC-vhz -->
### g10adm.grading-counter.US5-TC2: Anybody else is turned away, code or no code, with no override

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-05

**Pre-conditions:**

* A ready submission's collector named a person; a third person holds the right code.

**Steps:**

1. Enter the code and the third person's name, and read who is collecting.

**Expected Results:**

* They match neither; the runbook turns them away though the code is right, offers no override, and says the collector can name a person from their own page.

---

## g10adm.grading-counter.US6: Operator moves a slab into a vault case at hand-back

**As a** member of shop staff asked to keep a slab,
**I want** to open a vault case for it from the hand-back step once the balance is settled, the receipt saying the card went to the vault,
**so that** the collector leaves with the case open and no second visit.

<!-- trace:case id=g10adm.grading-counter.TC-5ah rev=1 covers=g10adm.grading-counter.SC-o4e,g10adm.grading-counter.SC-j26 -->
### g10adm.grading-counter.US6-TC1: An unsettled balance holds the vault case

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-06

**Pre-conditions:**

* A ready one-card submission owes an upcharge of HKD 350.00, untaken.

**Steps:**

1. Click Vault instead on the slab, and read Open a vault case.

**Expected Results:**

* It is disabled, naming the unpaid upcharge.

<!-- trace:case id=g10adm.grading-counter.TC-and rev=1 covers=g10adm.grading-counter.SC-o4e,g10adm.grading-counter.SC-j26 -->
### g10adm.grading-counter.US6-TC2: A settled slab opens a vault case on the same visit, and the receipt says so

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-06

**Pre-conditions:**

* A ready two-slab submission owes nothing; the collector is at the desk.

**Steps:**

1. Click Vault instead on the first slab, then Open a vault case, and open it with the collector.
2. Tick the second, photograph it, seal the receipt and click Hand over; read the receipt.

**Expected Results:**

* Step 1 opens the case under the collector's account on the same visit.
* The receipt names the first slab as gone to the vault and the second collected in person, handed over independently.

---

## g10adm.grading-counter.US7: Operator withdraws a card the collector asked back

**As a** member of shop staff at Handed in,
**I want** to withdraw one card until the batch closes, refunding its POS line and releasing it against a hand-back receipt,
**so that** the card leaves the intake bag with a record and the rest go on.

<!-- trace:case id=g10adm.grading-counter.TC-q8f rev=1 covers=g10adm.grading-counter.SC-7xq,g10adm.grading-counter.SC-0n7 -->
### g10adm.grading-counter.US7-TC1: A card is withdrawn before the batch closes, its line refunded and the rest going on

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-07

**Pre-conditions:**

* A three-card Regular walk-in was handed in this week, its fee paid; its batch is open.

**Steps:**

1. On the Cards tab, click Withdraw on the first card and confirm.
2. Read the cards, the Money tab, the receipt offered and the Documents tab, and the batch's cards.

**Expected Results:**

* The card reads withdrawn and released against its own receipt naming it alone; HKD 600.00 is refunded at the till, back the way it was paid.
* The other two stay handed in, unaffected, in the batch going on to the grader.

<!-- trace:case id=g10adm.grading-counter.TC-znx rev=1 covers=g10adm.grading-counter.SC-7xq,g10adm.grading-counter.SC-0n7 -->
### g10adm.grading-counter.US7-TC4: A closed batch takes the withdrawal away

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-07

**Pre-conditions:**

* A handed-in submission's batch has closed.

**Steps:**

1. Read each card's acts on the Cards tab.

**Expected Results:**

* Withdraw is offered on none.

---

## g10adm.grading-counter.US8: Approver waives an upcharge or a card's storage with a second person

**As a** member of shop staff holding `grading:approve`,
**I want** to waive the difference the sheet charged, or a card's storage, with a reason and a second approve holder who is not me, once the cards are back,
**so that** nobody can write off money alone and the collector's due drops to nothing before they collect.

<!-- trace:case id=g10adm.grading-counter.TC-6qc rev=1 covers=g10adm.grading-counter.SC-cae,g10adm.grading-counter.SC-nkf,g10adm.grading-counter.SC-2iq,g10adm.grading-counter.SC-1zq,g10adm.grading-counter.SC-wab -->
### g10adm.grading-counter.US8-TC1: An upcharge is waived with a reason and a second approve holder

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-08

**Pre-conditions:**

* A ready one-card submission owes an upcharge of HKD 600.00; admin A and admin B have its Money tab open.

**Steps:**

1. As admin A, click Waive the upcharge, type Grader moved the level on its own reading; goodwill, and click Ask for approval.
2. As admin B, reload and click Approve.

**Expected Results:**

* Step 1 leaves the due as it was, the request waiting on a second approve holder.
* Step 2 records the waiver against the card with its reason, admin A recording and admin B approving; the due drops by HKD 600.00.

<!-- trace:case id=g10adm.grading-counter.TC-92b rev=1 covers=g10adm.grading-counter.SC-cae,g10adm.grading-counter.SC-nkf,g10adm.grading-counter.SC-2iq,g10adm.grading-counter.SC-1zq,g10adm.grading-counter.SC-wab -->
### g10adm.grading-counter.US8-TC6: A card's storage is waived as an upcharge is, the waiver naming its kind

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-08

**Pre-conditions:**

* A ready four-card submission has been ready 100 days, each card owing HKD 30.00 of storage, one also an upcharge of HKD 600.00.

**Steps:**

1. As admin A, click Waive the storage on the moved card, type The collector was in hospital for the month, and ask for approval.
2. As admin B, approve it.

**Expected Results:**

* Step 1 waits on a second approve holder, named a storage waiver.
* Step 2 records it against that card; its storage drops to nothing, its upcharge still due, the other three still owing HKD 30.00 each.

<!-- trace:case id=g10adm.grading-counter.TC-ee2 rev=1 -->
### g10adm.grading-counter.US8-TC7: A waiver is refused to its own recorder, and to an approver without the grant

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-08

**Pre-conditions:**

* admin A asked to waive a ready submission's upcharge of HKD 600.00.

**Test data:**

| `<approver>` | `<refused, naming>` |
| --- | --- |
| admin A, who asked | that the recorder cannot approve |
| staff whose roles lack `grading:approve` | `grading:approve` |

**Steps:**

1. As `<approver>`, click Approve on the waiting request.

**Expected Results:**

* It is refused, naming `<refused, naming>`; nothing is written and the due stands.

<!-- trace:case id=g10adm.grading-counter.TC-fwb rev=1 covers=g10adm.grading-counter.SC-cae,g10adm.grading-counter.SC-nkf,g10adm.grading-counter.SC-2iq,g10adm.grading-counter.SC-1zq,g10adm.grading-counter.SC-wab -->
### g10adm.grading-counter.US8-TC2: Nothing is waived before the cards are back

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-08

**Pre-conditions:**

* An approve holder opens the Money tab of a submission `<status>`.

**Test data:**

| `<status>` |
| --- |
| with the grader |
| handed in, not shipped |
| graded, the cards not yet back |

**Steps:**

1. Read its acts.

**Expected Results:**

* Waive the upcharge is not offered.

---

## g10adm.grading-counter.US9: Approver records a payout for a card that did not come back

**As a** member of shop staff holding `grading:approve`,
**I want** to record a payout at the declared value, with the fee refunded, for a card not returned or damaged, on its own record with a second approve holder, at the till or by transfer, inside the window, and to reverse it on that record if the card turns up,
**so that** the collector is paid without waiting on the shop's claim and the money book shows what went out and why.

<!-- trace:case id=g10adm.grading-counter.TC-dpq rev=1 covers=g10adm.grading-counter.SC-nbg,g10adm.grading-counter.SC-o9q,g10adm.grading-counter.SC-kdi,g10adm.grading-counter.SC-g7t,g10adm.grading-counter.SC-kiz,g10adm.grading-counter.SC-2z1,g10adm.grading-counter.SC-qcm,g10adm.grading-counter.SC-nyo,g10adm.grading-counter.SC-ewk,g10adm.grading-counter.SC-n5p,g10adm.grading-counter.SC-5wb -->
### g10adm.grading-counter.US9-TC1: A payout pays the declared value and refunds the fee, once a second holder approves

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-09

**Pre-conditions:**

* A one-card Regular submission declared HKD 3,000.00 was received today, the card not returned; admin A and admin B have its Money tab open.

**Test data:**

| `<route>` | `<reference>` |
| --- | --- |
| the till | none |
| bank transfer | TRF-0001 |

**Steps:**

1. As admin A, record a payout on the card by `<route>`, Lost by the grader in transit, and click Ask for approval; read the Money and Timeline tabs.
2. As admin B, approve it.
3. Pull the submission's audit trail.

**Expected Results:**

* Step 1 records no payout and no refund, the card still owed, the request waiting on a second holder; the timeline carries no payout.
* Step 2 records HKD 3,000.00 paid and HKD 600.00 refunded by `<route>`, on its own record, admin A recording and admin B approving, carrying `<reference>`.
* Step 3 files the payout, its route, its amount and both names under the submission.

<!-- trace:case id=g10adm.grading-counter.TC-4sx rev=1 covers=g10adm.grading-counter.SC-nbg,g10adm.grading-counter.SC-o9q,g10adm.grading-counter.SC-kdi,g10adm.grading-counter.SC-g7t,g10adm.grading-counter.SC-kiz,g10adm.grading-counter.SC-2z1,g10adm.grading-counter.SC-qcm,g10adm.grading-counter.SC-nyo,g10adm.grading-counter.SC-ewk,g10adm.grading-counter.SC-n5p,g10adm.grading-counter.SC-5wb -->
### g10adm.grading-counter.US9-TC6: A payout past its window badges its row, and can still be recorded

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-09

**Pre-conditions:**

* A card not returned was in a batch received 15 days ago, the window 14 days; nothing is paid out.

**Steps:**

1. Click Ready on `<queue>`, and read its row.
2. On its Money tab, open the payout, choose the till, type a reason and ask for approval.

**Expected Results:**

* Step 1 badges the payout past its window, worked out at the read.
* Step 2 marks the window passed, and asks for the payout all the same.

<!-- trace:case id=g10adm.grading-counter.TC-au1 rev=1 covers=g10adm.grading-counter.SC-nbg,g10adm.grading-counter.SC-o9q,g10adm.grading-counter.SC-kdi,g10adm.grading-counter.SC-g7t,g10adm.grading-counter.SC-kiz,g10adm.grading-counter.SC-2z1,g10adm.grading-counter.SC-qcm,g10adm.grading-counter.SC-nyo,g10adm.grading-counter.SC-ewk,g10adm.grading-counter.SC-n5p,g10adm.grading-counter.SC-5wb -->
### g10adm.grading-counter.US9-TC7: A card carries one live payout

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-09

**Pre-conditions:**

* A card not returned carries a payout by the till, approved and not reversed.

**Steps:**

1. Look for a second payout on it, and ask for one directly where none is offered.

**Expected Results:**

* It is refused, naming the payout the card carries; nothing is written.

<!-- trace:case id=g10adm.grading-counter.TC-6dl rev=1 covers=g10adm.grading-counter.SC-nbg,g10adm.grading-counter.SC-o9q,g10adm.grading-counter.SC-kdi,g10adm.grading-counter.SC-g7t,g10adm.grading-counter.SC-kiz,g10adm.grading-counter.SC-2z1,g10adm.grading-counter.SC-qcm,g10adm.grading-counter.SC-nyo,g10adm.grading-counter.SC-ewk,g10adm.grading-counter.SC-n5p,g10adm.grading-counter.SC-5wb -->
### g10adm.grading-counter.US9-TC3: A card that turns up is a reversal on the payout's own record

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-09

**Pre-conditions:**

* A card's payout was recorded by the till; PSA has since found the card.

**Steps:**

1. As admin A, click Reverse the payout, type Card located by the grader, and ask for approval; as admin B, approve it.
2. Read the payout's record and the Cards tab.

**Expected Results:**

* The reversal is written on the same record, the payout left as it was, and the card is back on the submission.

<!-- trace:case id=g10adm.grading-counter.TC-x7b rev=1 covers=g10adm.grading-counter.SC-nbg,g10adm.grading-counter.SC-o9q,g10adm.grading-counter.SC-kdi,g10adm.grading-counter.SC-g7t,g10adm.grading-counter.SC-kiz,g10adm.grading-counter.SC-2z1,g10adm.grading-counter.SC-qcm,g10adm.grading-counter.SC-nyo,g10adm.grading-counter.SC-ewk,g10adm.grading-counter.SC-n5p,g10adm.grading-counter.SC-5wb -->
### g10adm.grading-counter.US9-TC9: A reversed payout is repaid at the till before the card goes home

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
* **Trace:** grade10-admin-grading-counter-US-09

**Pre-conditions:**

* A card declared HKD 4,000.00 was paid out, its HKD 150.00 fee refunded, then found and the payout reversed; its submission is `<status>`.

**Test data:**

| `<status>` | `<after>` |
| --- | --- |
| ready | the submission closes |
| collected | a hand-back receipt for that card alone, the submission still collected |

**Steps:**

1. Open the hand-back, read what is due, and try to close before paying.
2. Settle at the till, hand the card over and seal its receipt.

**Expected Results:**

* Step 1 reads HKD 4,150.00 due as one repayment, refusing to close while it is unpaid.
* Step 2 hands the card back, `<after>`.

<!-- trace:case id=g10adm.grading-counter.TC-til rev=1 covers=g10adm.grading-counter.SC-nbg,g10adm.grading-counter.SC-o9q,g10adm.grading-counter.SC-kdi,g10adm.grading-counter.SC-g7t,g10adm.grading-counter.SC-kiz,g10adm.grading-counter.SC-2z1,g10adm.grading-counter.SC-qcm,g10adm.grading-counter.SC-nyo,g10adm.grading-counter.SC-ewk,g10adm.grading-counter.SC-n5p,g10adm.grading-counter.SC-5wb -->
### g10adm.grading-counter.US9-TC10: A transfer payout is marked received by its own act, and badges until it is

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-09

**Pre-conditions:**

* One submission carries a payout recorded at the till and another by bank transfer, not marked received.

**Steps:**

1. Read both payouts, the transfer's row on `<queue>`, and To settle.
2. Mark the transfer received, and again.

**Expected Results:**

* Step 1 reads the till payout received from its recording, the transfer not yet; its row badges Transfer unconfirmed, and To settle counts one transfer unconfirmed.
* Step 2 reads it received with the day and who marked it, no money moving, the badge gone; the second mark is refused by name.

---

## g10adm.grading-counter.US10: Operator answers a collector from one submission's tabs

**As a** member of shop staff opening a submission,
**I want** per card the intake id, the declared value, the level and the one it was moved to, the grade and cert in the grader's words and the outcome, the money as paid, due, refunded and paid out with the till's references, and the timeline with the grader's stages in its words,
**so that** the till and the record say the same figure and I can answer a collector on the phone from one screen.

<!-- trace:case id=g10adm.grading-counter.TC-5mj rev=1 covers=g10adm.grading-counter.SC-n6l,g10adm.grading-counter.SC-hwv,g10adm.grading-counter.SC-2lg,g10adm.grading-counter.SC-rrl,g10adm.grading-counter.SC-9rj,g10adm.grading-counter.SC-x5b -->
### g10adm.grading-counter.US10-TC1: The header, the Cards tab and the Money tab answer the phone

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-10

**Pre-conditions:**

* A ready four-card Regular submission paid HKD 2,400.00 at hand-in; its first card moved to Express, PSA 10 GEM MT, its second returned ungraded; HKD 120.00 of storage has accrued.

**Steps:**

1. Read the header, the Cards tab and the Money tab.

**Expected Results:**

* The header shows the summary, the status word, the declared total, what is due, the ungraded card and the batch.
* The moved card's row reads its intake id, declared value, Regular and Express, PSA 10 GEM MT as the grader wrote it, its cert and its outcome.
* The Money tab shows HKD 2,400.00 paid over four lines, each naming the till's reference and its card, and the upcharge and storage due separately, HKD 720.00 in all.

<!-- trace:case id=g10adm.grading-counter.TC-13a rev=1 covers=g10adm.grading-counter.SC-n6l,g10adm.grading-counter.SC-hwv,g10adm.grading-counter.SC-2lg,g10adm.grading-counter.SC-rrl,g10adm.grading-counter.SC-9rj,g10adm.grading-counter.SC-x5b -->
### g10adm.grading-counter.US10-TC3: The till and the record say the same figure, and the header reaches the collector

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-10

**Pre-conditions:**

* A four-card Regular submission was handed in and paid; its collector gave an email and a phone; staff's device opens WhatsApp.

**Steps:**

1. Note the Money tab's paid amount and the till's reference; open that order in the till.
2. Read the header's collector block, and click a WhatsApp template.

**Expected Results:**

* The paid amount matches the order's total exactly.
* The header shows the email and phone with click-to-chat; the template opens the chat pre-filled, never sent by itself.

<!-- trace:case id=g10adm.grading-counter.TC-7co rev=1 covers=g10adm.grading-counter.SC-n6l,g10adm.grading-counter.SC-hwv,g10adm.grading-counter.SC-2lg,g10adm.grading-counter.SC-rrl,g10adm.grading-counter.SC-9rj,g10adm.grading-counter.SC-x5b -->
### g10adm.grading-counter.US10-TC6: A submission id that resolves to nothing says so

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-10

**Pre-conditions:**

* Staff is signed in to the console.

**Steps:**

1. Open `<console page>` for gs_dev_nosuchsubmission.

**Expected Results:**

* The console's not-found line shows, with no blank or broken panel.

---

## g10adm.grading-counter.US11: Operator hands a document over only when the counter is ready for it

**As a** member of shop staff,
**I want** the agreement to be mintable only once every card is checked and the receipt only once the balance is settled and every item is ticked, one document each time on a 30-minute link, and to show any sealed document on the iPad, copy its link or send it or the grades email again,
**so that** nothing is handed over to sign that the shop could not be held to, and a collector who lost an email gets the same sealed copy.

<!-- trace:case id=g10adm.grading-counter.TC-fac rev=1 covers=g10adm.grading-counter.SC-p78,g10adm.grading-counter.SC-qzs,g10adm.grading-counter.SC-h13,g10adm.grading-counter.SC-swq,g10adm.grading-counter.SC-ye7,g10adm.grading-counter.SC-rth,g10adm.grading-counter.SC-2hl,g10adm.grading-counter.SC-8ni,g10adm.grading-counter.SC-ccd -->
### g10adm.grading-counter.US11-TC1: One document is live on the link at a time, for 30 minutes

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-11

**Pre-conditions:**

* A booked submission's cards are all checked.

**Steps:**

1. Click Show on iPad, and read the step's timer.
2. Wait 31 minutes unsigned, and reload the link.
3. Show it again, and read the step.

**Expected Results:**

* Step 1 counts down from 30 minutes.
* Step 2 reads the link expired; step 3 issues a new one, never two live at once.

<!-- trace:case id=g10adm.grading-counter.TC-54a rev=1 covers=g10adm.grading-counter.SC-p78,g10adm.grading-counter.SC-qzs,g10adm.grading-counter.SC-h13,g10adm.grading-counter.SC-swq,g10adm.grading-counter.SC-ye7,g10adm.grading-counter.SC-rth,g10adm.grading-counter.SC-2hl,g10adm.grading-counter.SC-8ni,g10adm.grading-counter.SC-ccd -->
### g10adm.grading-counter.US11-TC4: A document's link is copied instead of shown on the iPad

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-11

**Pre-conditions:**

* A booked submission's cards are all checked.

**Steps:**

1. Click Copy link on Sign the agreement, and paste it into a new tab.

**Expected Results:**

* The agreement opens from it, on the same 30-minute rule.

<!-- trace:case id=g10adm.grading-counter.TC-ntq rev=1 covers=g10adm.grading-counter.SC-p78,g10adm.grading-counter.SC-qzs,g10adm.grading-counter.SC-h13,g10adm.grading-counter.SC-swq,g10adm.grading-counter.SC-ye7,g10adm.grading-counter.SC-rth,g10adm.grading-counter.SC-2hl,g10adm.grading-counter.SC-8ni,g10adm.grading-counter.SC-ccd,g10adm.grading-counter.SC-3s8,g10adm.grading-counter.SC-xct,g10adm.grading-counter.SC-eak,g10adm.grading-counter.SC-o99,g10adm.grading-counter.SC-m60,g10adm.grading-counter.SC-f99,g10adm.grading-counter.SC-4zl,g10adm.grading-counter.SC-ekx,g10adm.grading-counter.SC-r90,g10adm.grading-counter.SC-77c -->
### g10adm.grading-counter.US11-TC9: The receipt is held while anything is due or an item is unticked

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-11

**Pre-conditions:**

* A ready submission's code and name are matched; `<held>`.

**Test data:**

| `<held>` | `<refused, naming>` |
| --- | --- |
| storage accrued over 60 days past day 90, untaken at Settle | the balance due, before the iPad is offered |
| nothing due, the first of two items ticked | the unticked item |

**Steps:**

1. Read Sign the receipt, and try to prepare it.

**Expected Results:**

* It is refused, naming `<refused, naming>`.

<!-- trace:case id=g10adm.grading-counter.TC-heg rev=1 covers=g10adm.grading-counter.SC-p78,g10adm.grading-counter.SC-qzs,g10adm.grading-counter.SC-h13,g10adm.grading-counter.SC-swq,g10adm.grading-counter.SC-ye7,g10adm.grading-counter.SC-rth,g10adm.grading-counter.SC-2hl,g10adm.grading-counter.SC-8ni,g10adm.grading-counter.SC-ccd -->
### g10adm.grading-counter.US11-TC2: In production, a fact the agreement prints that nobody set refuses it

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-11

**Pre-conditions:**

* In production, the custodian's registered name is unset; a booked submission's cards are all checked.

**Steps:**

1. Click Show on iPad on Sign the agreement.

**Expected Results:**

* It is refused, naming the unset fact; nothing is offered to sign.

<!-- trace:case id=g10adm.grading-counter.TC-ctm rev=1 covers=g10adm.grading-counter.SC-p78,g10adm.grading-counter.SC-qzs,g10adm.grading-counter.SC-h13,g10adm.grading-counter.SC-swq,g10adm.grading-counter.SC-ye7,g10adm.grading-counter.SC-rth,g10adm.grading-counter.SC-2hl,g10adm.grading-counter.SC-8ni,g10adm.grading-counter.SC-ccd -->
### g10adm.grading-counter.US11-TC3: A sealed document is shown again or sent again as the same sealed copy

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-11

**Pre-conditions:**

* A collected submission's agreement, intake receipt and hand-back receipt are sealed; the collector lost the hand-back email.

**Steps:**

1. Open the Documents tab, and note the fingerprints.
2. Click Show on iPad on the agreement, and read the fingerprint shown.
3. Click Send again on the hand-back receipt, and read the collector's latest email.

**Expected Results:**

* Step 1 lists all three, each with its fingerprint.
* Step 2 reopens the same sealed copy, not a new one.
* Step 3's email carries the same sealed receipt, its fingerprint unchanged.

<!-- trace:case id=g10adm.grading-counter.TC-77v rev=1 covers=g10adm.grading-counter.SC-p78,g10adm.grading-counter.SC-qzs,g10adm.grading-counter.SC-h13,g10adm.grading-counter.SC-swq,g10adm.grading-counter.SC-ye7,g10adm.grading-counter.SC-rth,g10adm.grading-counter.SC-2hl,g10adm.grading-counter.SC-8ni,g10adm.grading-counter.SC-ccd -->
### g10adm.grading-counter.US11-TC6: A submission with nothing sealed says so

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-11

**Pre-conditions:**

* A booked submission has no card checked.

**Steps:**

1. Open the Documents tab.

**Expected Results:**

* It says nothing has been sealed yet.

<!-- trace:case id=g10adm.grading-counter.TC-hfs rev=1 covers=g10adm.grading-counter.SC-p78,g10adm.grading-counter.SC-qzs,g10adm.grading-counter.SC-h13,g10adm.grading-counter.SC-swq,g10adm.grading-counter.SC-ye7,g10adm.grading-counter.SC-rth,g10adm.grading-counter.SC-2hl,g10adm.grading-counter.SC-8ni,g10adm.grading-counter.SC-ccd -->
### g10adm.grading-counter.US11-TC8: An agreement no letter has carried is not sent again

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-11

**Pre-conditions:**

* A booked submission's agreement was just sealed, its cards not yet handed in; the collector's latest email is noted.

**Steps:**

1. Open the Documents tab.
2. Send the agreement again directly, outside the tab, and read the collector's mail.

**Expected Results:**

* Step 1 lists it with its fingerprint, offering no Send again.
* Step 2 is refused by name; nothing reaches the collector.

<!-- trace:case id=g10adm.grading-counter.TC-o9d rev=1 covers=g10adm.grading-counter.SC-p78,g10adm.grading-counter.SC-qzs,g10adm.grading-counter.SC-h13,g10adm.grading-counter.SC-swq,g10adm.grading-counter.SC-ye7,g10adm.grading-counter.SC-rth,g10adm.grading-counter.SC-2hl,g10adm.grading-counter.SC-8ni,g10adm.grading-counter.SC-ccd -->
### g10adm.grading-counter.US11-TC7: A letter that never went is flagged with its reason, and sent again

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-11

**Pre-conditions:**

* A submission's grades email ran out of attempts.

**Steps:**

1. Read its row on `<queue>`, and the Documents tab.
2. Click Send again on the flagged letter.

**Expected Results:**

* Step 1 badges the row Message not sent, and the tab flags the letter with its reason, offering Send again.
* Step 2 sends it once more.

---

## g10adm.grading-counter.US12: Operator posts the written notice from the Notice due rung

**As a** member of shop staff working the Ready view,
**I want** a submission uncollected past the notice day to ask me for the notice, and to record the posting date and the tracking once it is in the post, the email going the same day and the notice period counting from that date,
**so that** the notice is a fact with a date on it and nothing after it runs off a guess.

<!-- trace:case id=g10adm.grading-counter.TC-8x8 rev=1 covers=g10adm.grading-counter.SC-3i7,g10adm.grading-counter.SC-lz5,g10adm.grading-counter.SC-3er,g10adm.grading-counter.SC-0c4,g10adm.grading-counter.SC-8y2,g10adm.grading-counter.SC-y6m,g10adm.grading-counter.SC-6gr,g10adm.grading-counter.SC-3gz -->
### g10adm.grading-counter.US12-TC1: A submission ready 180 days asks for the notice, and nothing has gone without staff

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-12

**Pre-conditions:**

* A submission has been ready and uncollected 180 days.

**Steps:**

1. Click Ready, read its row, and open it.
2. Read the collector's latest email.

**Expected Results:**

* The row and the page badge Notice due.
* No notice has been sent.

<!-- trace:case id=g10adm.grading-counter.TC-4r1 rev=1 -->
### g10adm.grading-counter.US12-TC8: A submission ready 179 days asks for no notice yet

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-12

**Pre-conditions:**

* A submission has been ready and uncollected 179 days.

**Steps:**

1. Click Ready, read its row, and open it.

**Expected Results:**

* Neither badges Notice due.

<!-- trace:case id=g10adm.grading-counter.TC-slm rev=1 covers=g10adm.grading-counter.SC-3i7,g10adm.grading-counter.SC-lz5,g10adm.grading-counter.SC-3er,g10adm.grading-counter.SC-0c4,g10adm.grading-counter.SC-8y2,g10adm.grading-counter.SC-y6m,g10adm.grading-counter.SC-6gr,g10adm.grading-counter.SC-3gz -->
### g10adm.grading-counter.US12-TC2: Posting the notice records its date and tracking, the email going that day

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-12

**Pre-conditions:**

* A submission reads Notice due.

**Steps:**

1. Click Post the notice, enter today and RR123456785HK, and click Record.
2. Read the Timeline tab and the collector's latest email.

**Expected Results:**

* The timeline carries the posting date and the tracking; the notice email went that day.

<!-- trace:case id=g10adm.grading-counter.TC-lhs rev=1 covers=g10adm.grading-counter.SC-3i7,g10adm.grading-counter.SC-lz5,g10adm.grading-counter.SC-3er,g10adm.grading-counter.SC-0c4,g10adm.grading-counter.SC-8y2,g10adm.grading-counter.SC-y6m,g10adm.grading-counter.SC-6gr,g10adm.grading-counter.SC-3gz -->
### g10adm.grading-counter.US12-TC3: The posting date and the tracking are recorded together

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-12

**Pre-conditions:**

* A submission reads Notice due.

**Steps:**

1. Click Post the notice, enter today, leave the tracking empty, and read Record.

**Expected Results:**

* Record stays disabled, naming the tracking.

<!-- trace:case id=g10adm.grading-counter.TC-edm rev=1 covers=g10adm.grading-counter.SC-3i7,g10adm.grading-counter.SC-lz5,g10adm.grading-counter.SC-3er,g10adm.grading-counter.SC-0c4,g10adm.grading-counter.SC-8y2,g10adm.grading-counter.SC-y6m,g10adm.grading-counter.SC-6gr,g10adm.grading-counter.SC-3gz -->
### g10adm.grading-counter.US12-TC6: The notice's address is read by who may post it, and only while it is due

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-12

**Pre-conditions:**

* One submission's notice is due, another's falls due tomorrow; admin C holds `grading:read` alone.

**Steps:**

1. As admin A, click Post the notice on the first.
2. As admin A, ask directly for the second's notice address.
3. As admin C, ask directly for the first's.

**Expected Results:**

* Step 1 shows the postal address taken at signing.
* Step 2 is refused by name, with the day the notice falls due; step 3 is refused by name.

<!-- trace:case id=g10adm.grading-counter.TC-ikq rev=2 covers=g10adm.grading-counter.SC-3i7,g10adm.grading-counter.SC-lz5,g10adm.grading-counter.SC-3er,g10adm.grading-counter.SC-0c4,g10adm.grading-counter.SC-8y2,g10adm.grading-counter.SC-y6m,g10adm.grading-counter.SC-6gr,g10adm.grading-counter.SC-3gz -->
### g10adm.grading-counter.US12-TC4: The notice period runs from the posting date

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-12

**Pre-conditions:**

* A submission ready 186 days was posted its notice 3 days ago, unrecorded.

**Steps:**

1. Post the notice with the date 3 days ago and RR123456785HK, and read the Timeline tab.

**Expected Results:**

* The 90 days are counted from the posting date, not from today.

<!-- trace:case id=g10adm.grading-counter.TC-aa8 rev=2 covers=g10adm.grading-counter.SC-3i7,g10adm.grading-counter.SC-lz5,g10adm.grading-counter.SC-3er,g10adm.grading-counter.SC-0c4,g10adm.grading-counter.SC-8y2,g10adm.grading-counter.SC-y6m,g10adm.grading-counter.SC-6gr,g10adm.grading-counter.SC-3gz -->
### g10adm.grading-counter.US12-TC5: Nothing further is offered after the notice period

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-12

**Pre-conditions:**

* A submission's notice was posted 91 days ago, the cards uncollected.

**Steps:**

1. Read every act on `<console page>`, and the Money tab's storage.

**Expected Results:**

* No act beyond the hand-back is offered; storage keeps accruing and the cards stay in the safe.

---

## g10adm.grading-counter.US13: Admin reconstructs one submission's history on the audit chain

**As an** admin holding a submission in a dispute,
**I want** every event on the timeline with the figures it carried and the grader's stages in its words, staff-only entries kept from the collector, and every action filed under the submission on the audit chain,
**so that** the record can be tested rather than believed.

<!-- trace:case id=g10adm.grading-counter.TC-o3v rev=2 covers=g10adm.grading-counter.SC-uf6,g10adm.grading-counter.SC-xzo,g10adm.grading-counter.SC-v27,g10adm.grading-counter.SC-xku -->
### g10adm.grading-counter.US13-TC1: The timeline lists every event with its figures, the grader's stages in its own words

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-13

**Pre-conditions:**

* A two-card Regular submission paid by card at hand-in; its batch carries PSA's stage Research & ID as PSA wrote it; its first card moved to Express, the upcharge waived by admin A and a colleague.

**Steps:**

1. Read the Activity and Timeline tabs.

**Expected Results:**

* The plan is listed once with its cards and level; the payment, the move and the waiver each carry their figures, the waiver its reason and who asked and approved; no entry lacks a fact.
* The stage reads Research & ID, unchanged.

<!-- trace:case id=g10adm.grading-counter.TC-oif rev=1 covers=g10adm.grading-counter.SC-uf6,g10adm.grading-counter.SC-xzo,g10adm.grading-counter.SC-v27,g10adm.grading-counter.SC-xku -->
### g10adm.grading-counter.US13-TC3: A staff-only entry never reaches the collector

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-13

**Pre-conditions:**

* A submission carries a staff-only entry.

**Steps:**

1. Read the Timeline tab, `<submission page>` whole, and every email about it.

**Expected Results:**

* The tab shows the entry; neither the page nor any email carries it.

<!-- trace:case id=g10adm.grading-counter.TC-1c4 rev=1 covers=g10adm.grading-counter.SC-uf6,g10adm.grading-counter.SC-xzo,g10adm.grading-counter.SC-v27,g10adm.grading-counter.SC-xku,g10adm.grading-counter.SC-cae,g10adm.grading-counter.SC-nkf,g10adm.grading-counter.SC-2iq,g10adm.grading-counter.SC-1zq,g10adm.grading-counter.SC-wab -->
### g10adm.grading-counter.US13-TC4: One submission's trail is one query, every act with who did it

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-13

**Pre-conditions:**

* A one-card submission was handed in, shipped, received with its card moved up, its upcharge waived by admin A and admin B, and collected; a second submission stands ready.

**Steps:**

1. Pull the audit trail for the first submission's id, then the second's.

**Expected Results:**

* The first lists handed in, shipped, received, waived with its reason and both names, and collected, each with who did it, and nothing of the second.

---

## g10adm.grading-counter.US14: Operator's acts follow the grant they hold and the status in front of them

**As a** member of shop staff,
**I want** each tab to offer exactly the acts my grant and the submission's status allow, cancel only on the collector's word and never once a card is checked or refused, refused independently when the submission has moved under me,
**so that** I am never shown a button that will only be refused, and two of us at one counter cannot leave a submission where neither meant.

<!-- trace:case id=g10adm.grading-counter.TC-32a rev=1 covers=g10adm.grading-counter.SC-m3l,g10adm.grading-counter.SC-wfj,g10adm.grading-counter.SC-zwe,g10adm.grading-counter.SC-ldu,g10adm.grading-counter.SC-ld3,g10adm.grading-counter.SC-x8l,g10adm.grading-counter.SC-edx,g10adm.grading-counter.SC-4rb,g10adm.grading-counter.SC-tiv -->
### g10adm.grading-counter.US14-TC10: A read holder is offered no act, and an act sent anyway is refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-14

**Pre-conditions:**

* An operator holds `grading:read` alone and opens `<surface>`.

**Test data:**

| `<surface>` | `<sent>` |
| --- | --- |
| a ready submission | a hand-back step |
| a closed batch and a batch back unchecked | a ship |
| the grading settings | a write |
| a submission with a letter that never went | Send again |

**Steps:**

1. Read every act offered.
2. Send `<sent>` directly.

**Expected Results:**

* Step 1 offers no act needing another grant: no hand-back, ship, stage, re-estimate, arrive, manifest, scan, exception, finish, settings field or Send again.
* Step 2 is refused by name.

<!-- trace:case id=g10adm.grading-counter.TC-zoh rev=1 covers=g10adm.grading-counter.SC-m3l,g10adm.grading-counter.SC-wfj,g10adm.grading-counter.SC-zwe,g10adm.grading-counter.SC-ldu,g10adm.grading-counter.SC-ld3,g10adm.grading-counter.SC-x8l,g10adm.grading-counter.SC-edx,g10adm.grading-counter.SC-4rb,g10adm.grading-counter.SC-tiv -->
### g10adm.grading-counter.US14-TC5: An operator is offered every grant they hold

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-14

**Pre-conditions:**

* An operator holds `grading:operate` and `grading:approve`; a ready submission owes an upcharge.

**Steps:**

1. Read the runbook's acts and the Money tab's.

**Expected Results:**

* The hand-back and Waive the upcharge are offered together.

<!-- trace:case id=g10adm.grading-counter.TC-wtp rev=2 covers=g10adm.grading-counter.SC-m3l,g10adm.grading-counter.SC-wfj,g10adm.grading-counter.SC-zwe,g10adm.grading-counter.SC-ldu,g10adm.grading-counter.SC-ld3,g10adm.grading-counter.SC-x8l,g10adm.grading-counter.SC-edx,g10adm.grading-counter.SC-4rb,g10adm.grading-counter.SC-tiv -->
### g10adm.grading-counter.US14-TC8: Staff cancel a booked submission on the collector's word

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-14

**Pre-conditions:**

* A booked submission has no card checked or refused; the collector asked the shop to call it off; their latest email is noted.

**Steps:**

1. Click Cancel, then Yes, cancel.
2. Read the Activity tab and the collector's mail.

**Expected Results:**

* It reads Cancelled, no drop-off section showing; the cancel is listed with who made it, and no email was sent.

<!-- trace:case id=g10adm.grading-counter.TC-8xo rev=2 covers=g10adm.grading-counter.SC-m3l,g10adm.grading-counter.SC-wfj,g10adm.grading-counter.SC-zwe,g10adm.grading-counter.SC-ldu,g10adm.grading-counter.SC-ld3,g10adm.grading-counter.SC-x8l,g10adm.grading-counter.SC-edx,g10adm.grading-counter.SC-4rb,g10adm.grading-counter.SC-tiv -->
### g10adm.grading-counter.US14-TC9: Cancel is withheld once a card is checked or refused, or the cards are in

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-14

**Pre-conditions:**

* Staff loaded a booked submission's page in a second tab before `<since>`.

**Test data:**

| `<since>` |
| --- |
| the desk checked one card, with both photographs |
| the desk refused the first card |
| the cards were handed in and sealed in the bag |

**Steps:**

1. Load the page afresh, and read its acts.
2. In the second tab, click Cancel and Yes, cancel.

**Expected Results:**

* Step 1 offers no Cancel.
* Step 2 is refused by name; the submission reads as before.

<!-- trace:case id=g10adm.grading-counter.TC-rvd rev=1 covers=g10adm.grading-counter.SC-m3l,g10adm.grading-counter.SC-wfj,g10adm.grading-counter.SC-zwe,g10adm.grading-counter.SC-ldu,g10adm.grading-counter.SC-ld3,g10adm.grading-counter.SC-x8l,g10adm.grading-counter.SC-edx,g10adm.grading-counter.SC-4rb,g10adm.grading-counter.SC-tiv -->
### g10adm.grading-counter.US14-TC3: An act sent from a page the submission moved under is refused by name

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-14

**Pre-conditions:**

* admin A and admin B had a booked two-card submission's runbook open; admin A has since sealed, paid and checked it in.

**Steps:**

1. As admin B, unreloaded, refuse the first card with a reason and words.

**Expected Results:**

* It is refused, naming that the submission moved; the panel re-reads the current state, keeping what admin A wrote.

<!-- trace:case id=g10adm.grading-counter.TC-3cq rev=1 covers=g10adm.grading-counter.SC-m3l,g10adm.grading-counter.SC-wfj,g10adm.grading-counter.SC-zwe,g10adm.grading-counter.SC-ldu,g10adm.grading-counter.SC-ld3,g10adm.grading-counter.SC-x8l,g10adm.grading-counter.SC-edx,g10adm.grading-counter.SC-4rb,g10adm.grading-counter.SC-tiv -->
### g10adm.grading-counter.US14-TC6: Production asks for the second factor, once for the shift's next acts

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** The grants

**Pre-conditions:**

* An operator holds a production console account with a second factor and no verified session.

**Steps:**

1. Sign in, and open `<queue>`.
2. An hour after verifying, take a payment at the till and tick an item handed over.

**Expected Results:**

* Step 1 asks for the second factor before the surface opens.
* Step 2 asks for nothing again, the session verified for 12 hours.

---

## g10adm.grading-counter.US15: Operations changes a default without a deploy

**As an** admin answerable for how the counter runs,
**I want** every clock, cap, fee sheet and threshold the pages run on to be a setting I read and change in the console under `grading:approve`, a money setting taking a second person, filed under its own audit subject, and reaching only submissions not yet booked,
**so that** confirming a default is a decision I record and not a release I wait for, and no signed paper changes under a collector.

<!-- trace:case id=g10adm.grading-counter.TC-b1h rev=1 covers=g10adm.grading-counter.SC-c3e,g10adm.grading-counter.SC-vb8,g10adm.grading-counter.SC-7dr,g10adm.grading-counter.SC-6gs,g10adm.grading-counter.SC-62a,g10adm.grading-counter.SC-8fi,g10adm.grading-counter.SC-oe8,g10adm.grading-counter.SC-ach,g10adm.grading-counter.SC-osf,g10adm.grading-counter.SC-xnx -->
### g10adm.grading-counter.US15-TC1: Every setting is read with its value and its owner

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-15

**Pre-conditions:**

* An approve holder is signed in.

**Steps:**

1. Open the grading settings, and read the table and the notice-day row.

**Expected Results:**

* Every setting lists its value, the owner who confirms it, and where a change takes effect.

<!-- trace:case id=g10adm.grading-counter.TC-w3k rev=1 covers=g10adm.grading-counter.SC-c3e,g10adm.grading-counter.SC-vb8,g10adm.grading-counter.SC-7dr,g10adm.grading-counter.SC-6gs,g10adm.grading-counter.SC-62a,g10adm.grading-counter.SC-8fi,g10adm.grading-counter.SC-oe8,g10adm.grading-counter.SC-ach,g10adm.grading-counter.SC-osf,g10adm.grading-counter.SC-xnx -->
### g10adm.grading-counter.US15-TC2: A clock is edited in place, filed under the settings subject

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-15

**Pre-conditions:**

* The plan nudge stands at 21 days.

**Steps:**

1. Change it to 25, and save the field.
2. Pull the audit trail for the settings subject.

**Expected Results:**

* It saves in place, with no second-person dialog.
* The trail files the write under settings, naming the key, 21, 25 and the writer.

<!-- trace:case id=g10adm.grading-counter.TC-gg8 rev=1 covers=g10adm.grading-counter.SC-c3e,g10adm.grading-counter.SC-vb8,g10adm.grading-counter.SC-7dr,g10adm.grading-counter.SC-6gs,g10adm.grading-counter.SC-62a,g10adm.grading-counter.SC-8fi,g10adm.grading-counter.SC-oe8,g10adm.grading-counter.SC-ach,g10adm.grading-counter.SC-osf,g10adm.grading-counter.SC-xnx -->
### g10adm.grading-counter.US15-TC3: A money setting takes a reason and a second approve holder

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-15

**Pre-conditions:**

* The storage fee stands at HKD 30.00; admin A and admin B have the settings open.

**Steps:**

1. As admin A, change it to HKD 35.00, type Storage fee reviewed for the new year, and ask for approval.
2. As admin B, approve it; read the row and the settings audit trail.

**Expected Results:**

* Step 1's row waits on a second approver.
* Step 2 reads HKD 35.00 carrying both names, filed under settings, not under a submission.

<!-- trace:case id=g10adm.grading-counter.TC-fui rev=1 covers=g10adm.grading-counter.SC-c3e,g10adm.grading-counter.SC-vb8,g10adm.grading-counter.SC-7dr,g10adm.grading-counter.SC-6gs,g10adm.grading-counter.SC-62a,g10adm.grading-counter.SC-8fi,g10adm.grading-counter.SC-oe8,g10adm.grading-counter.SC-ach,g10adm.grading-counter.SC-osf,g10adm.grading-counter.SC-xnx -->
### g10adm.grading-counter.US15-TC9: The reference rate takes one approve holder, and nought is refused

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
* **Trace:** grade10-admin-grading-counter-US-15

**Pre-conditions:**

* The reference rate reads 7.84.

**Test data:**

| `<refused rate>` |
| --- |
| 0 |
| −1 |

**Steps:**

1. Change it to 7.90, and save.
2. Change it to `<refused rate>`, and save; reload.
3. As a collector, paste a list with a USD sale.

**Expected Results:**

* Step 1 writes 7.90 with no second-person dialog, naming the writer alone.
* Step 2 is refused, naming the reference rate, 7.90 standing.
* Step 3 reads the USD sale at 7.90.

<!-- trace:case id=g10adm.grading-counter.TC-c5k rev=1 covers=g10adm.grading-counter.SC-c3e,g10adm.grading-counter.SC-vb8,g10adm.grading-counter.SC-7dr,g10adm.grading-counter.SC-6gs,g10adm.grading-counter.SC-62a,g10adm.grading-counter.SC-8fi,g10adm.grading-counter.SC-oe8,g10adm.grading-counter.SC-ach,g10adm.grading-counter.SC-osf,g10adm.grading-counter.SC-xnx -->
### g10adm.grading-counter.US15-TC5: A change reaches only what is not yet booked, and nothing already signed

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-15

**Pre-conditions:**

* `<setting>` stands at `<before>`; one Regular submission is `<held>`, and another planned.

**Test data:**

| `<setting>` | `<before>` | `<after>` | `<held>` | `<read on>` |
| --- | --- | --- | --- | --- |
| the storage fee | HKD 30.00 | HKD 35.00 | handed in, its agreement sealed | the agreement each prints |
| Regular's fee | HKD 600.00 | HKD 700.00 | booked | the till at hand-in |

**Steps:**

1. Write `<after>`, approved by a second holder.
2. Read `<read on>` for the first submission, then book and hand in the planned one and read it.

**Expected Results:**

* The first still reads `<before>`; the one booked after the change reads `<after>`.

<!-- trace:case id=g10adm.grading-counter.TC-ntn rev=1 covers=g10adm.grading-counter.SC-c3e,g10adm.grading-counter.SC-vb8,g10adm.grading-counter.SC-7dr,g10adm.grading-counter.SC-6gs,g10adm.grading-counter.SC-62a,g10adm.grading-counter.SC-8fi,g10adm.grading-counter.SC-oe8,g10adm.grading-counter.SC-ach,g10adm.grading-counter.SC-osf,g10adm.grading-counter.SC-xnx -->
### g10adm.grading-counter.US15-TC7: A setting nobody has written is marked, and a read that needs it is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-15

**Pre-conditions:**

* On a stack where only the migrations ran, a fee-sheet row and the storage fee stand unwritten; a ready submission stands.

**Steps:**

1. Read the grading settings.
2. Open the submission's Money tab.

**Expected Results:**

* Step 1 marks the unset row as a bracketed value, naming its owner.
* Step 2 is refused, naming the storage fee and its owner; no compiled value stands in.

<!-- trace:case id=g10adm.grading-counter.TC-xml rev=1 covers=g10adm.grading-counter.SC-c3e,g10adm.grading-counter.SC-vb8,g10adm.grading-counter.SC-7dr,g10adm.grading-counter.SC-6gs,g10adm.grading-counter.SC-62a,g10adm.grading-counter.SC-8fi,g10adm.grading-counter.SC-oe8,g10adm.grading-counter.SC-ach,g10adm.grading-counter.SC-osf,g10adm.grading-counter.SC-xnx -->
### g10adm.grading-counter.US15-TC11: A seeded figure no owner approved holds the seal in production

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-counter-US-15

**Pre-conditions:**

* In production, the notice period stands at its seeded 90 days with no approver; a booked Regular submission is at the agreement step.

**Steps:**

1. Seal the agreement.
2. Have an approve holder approve the 90 days, and seal again.

**Expected Results:**

* Step 1 is refused, naming the notice period; nothing is sealed.
* Step 2 seals it.
