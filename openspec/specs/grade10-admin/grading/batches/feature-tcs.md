# grade10-admin/grading/batches Test Cases

**Status:** pending-review · 0/40
**Drafts styled:** 2026-10-25, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7

**Out of suite (api):** grade10-admin-grading-batches-SC-14, grade10-admin-grading-batches-SC-33, grade10-admin-grading-batches-SC-42 - two operators shipping one parcel, a finished box finished again, and two desks filling the safe at one moment: timing no screen sets up, held by the backend's concurrency and idempotency tests

## Background

* Staff is admin(holds `grading:operate`) on the batches panel, `<batches>`, on the admin console, its tiles above the batches list; a batch's Ship form and its Receive page open from its row. A money setting is written by one `grading:approve` holder and approved by a second.
* PSA's levels stand as seeded: Regular HKD 600.00 a card, back in 5 weeks; Express HKD 1,200.00; Super Express. PSA's stages read, in order: Arrived, Order prep, Research and ID, Grading, Assembly, QA checks, Completed, Shipped; Completed is the move to the grades being in. The cut-off is Thursday 19:00 on the shop's clock, Hong Kong's.
* The courier's cover is HKD 300,000.00 and the safe's cap HKD 300,000.00, as seeded. A manifest is typed on the Receive page one line per card: intake id, cert, grade, level charged, the grader's code, note. `<collector inbox>` is each collector's mailbox, which the tester reads.

## g10adm.grading-batches.US1: Operator ships the batch that closed

**As a** member of shop staff on the day after the cut-off,
**I want** the batch closed at Thursday 19:00 with its packing list, the grader's order number, one or more shipments each with its courier, tracking and insured total at or under the courier's cover, and the estimate from the ship day, and one act that marks every submission in it as sent and emails every collector,
**so that** one parcel to one grader at one level leaves with one record.

<!-- trace:case id=g10adm.grading-batches.TC-s7t rev=1 covers=g10adm.grading-batches.SC-jam,g10adm.grading-batches.SC-uzm,g10adm.grading-batches.SC-e4n,g10adm.grading-batches.SC-yte,g10adm.grading-batches.SC-24g,g10adm.grading-batches.SC-ucf,g10adm.grading-batches.SC-uso,g10adm.grading-batches.SC-tky,g10adm.grading-batches.SC-3kj,g10adm.grading-batches.SC-z6w,g10adm.grading-batches.SC-p89,g10adm.grading-batches.SC-bll,g10adm.grading-batches.SC-ppx,g10adm.grading-batches.SC-26l,g10adm.grading-batches.SC-uis,g10adm.grading-batches.SC-x8i,g10adm.grading-batches.SC-vk6 -->
### g10adm.grading-batches.US1-TC1: The operator ships a closed batch with a complete ship form

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-batches-US-01

**Pre-conditions:**

* A closed PSA Regular batch holds one handed-in card declared HKD 5,000.00.

**Steps:**

1. Click Ship on its row, tick each check under Before it leaves, and enter PSA-ORDER-0001, SF Express, SF1000000001 and today.
2. Click Mark as shipped, and read the row and the collector's email.

**Expected Results:**

* Every submission in the batch moves to With the grader; the row reads shipped with its tracking and the estimate, today plus 5 weeks.
* The collector is emailed the tracking and the estimate.

<!-- trace:case id=g10adm.grading-batches.TC-lfs rev=1 covers=g10adm.grading-batches.SC-jam,g10adm.grading-batches.SC-uzm,g10adm.grading-batches.SC-e4n,g10adm.grading-batches.SC-yte,g10adm.grading-batches.SC-24g,g10adm.grading-batches.SC-ucf,g10adm.grading-batches.SC-uso,g10adm.grading-batches.SC-tky,g10adm.grading-batches.SC-3kj,g10adm.grading-batches.SC-z6w,g10adm.grading-batches.SC-p89,g10adm.grading-batches.SC-bll,g10adm.grading-batches.SC-ppx,g10adm.grading-batches.SC-26l,g10adm.grading-batches.SC-uis,g10adm.grading-batches.SC-x8i,g10adm.grading-batches.SC-vk6 -->
### g10adm.grading-batches.US1-TC6: Shipping a batch of three collectors moves every submission and tells each once

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-batches-US-01

**Pre-conditions:**

* On the Friday after the cut-off, a closed PSA Regular batch holds three submissions of 2, 1 and 5 cards from collectors A, B and C.

**Steps:**

1. Click Ship, and read the packing list.
2. Complete the form with PSA-ORDER-0006 and SF1000000006, and click Mark as shipped.
3. Read each submission on the queue, and each collector's email.

**Expected Results:**

* Step 1's packing list carries one line per intake id, 8 in all.
* Step 3 reads all three With the grader; each collector is emailed once, none skipped.

<!-- trace:case id=g10adm.grading-batches.TC-sgd rev=1 covers=g10adm.grading-batches.SC-jam,g10adm.grading-batches.SC-uzm,g10adm.grading-batches.SC-e4n,g10adm.grading-batches.SC-yte,g10adm.grading-batches.SC-24g,g10adm.grading-batches.SC-ucf,g10adm.grading-batches.SC-uso,g10adm.grading-batches.SC-tky,g10adm.grading-batches.SC-3kj,g10adm.grading-batches.SC-z6w,g10adm.grading-batches.SC-p89,g10adm.grading-batches.SC-bll,g10adm.grading-batches.SC-ppx,g10adm.grading-batches.SC-26l,g10adm.grading-batches.SC-uis,g10adm.grading-batches.SC-x8i,g10adm.grading-batches.SC-vk6 -->
### g10adm.grading-batches.US1-TC10: A batch opens for the first card of its trio, and the next card joins it

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
* **Trace:** grade10-admin-grading-batches-US-01

**Pre-conditions:**

* No open batch stands for the shop, PSA and Super Express.

**Test data:**

| `<opened by>` |
| --- |
| handing in a booked submission of 2 cards at PSA Super Express from its hand-in runbook, before the cut-off |
| New batch on `<batches>`, picking the shop, PSA and Super Express |

**Steps:**

1. Open the batch by `<opened by>`, and read `<batches>`.
2. Hand in a one-card submission at PSA Super Express, and read `<batches>` again.

**Expected Results:**

* Step 1 lists one batch for that shop, PSA and Super Express, carrying its cut-off.
* Step 2 lists the card in that batch; no second batch opens for the trio.

<!-- trace:case id=g10adm.grading-batches.TC-phr rev=1 covers=g10adm.grading-batches.SC-jam,g10adm.grading-batches.SC-uzm,g10adm.grading-batches.SC-e4n,g10adm.grading-batches.SC-yte,g10adm.grading-batches.SC-24g,g10adm.grading-batches.SC-ucf,g10adm.grading-batches.SC-uso,g10adm.grading-batches.SC-tky,g10adm.grading-batches.SC-3kj,g10adm.grading-batches.SC-z6w,g10adm.grading-batches.SC-p89,g10adm.grading-batches.SC-bll,g10adm.grading-batches.SC-ppx,g10adm.grading-batches.SC-26l,g10adm.grading-batches.SC-uis,g10adm.grading-batches.SC-x8i,g10adm.grading-batches.SC-vk6 -->
### g10adm.grading-batches.US1-TC11: A card handed in before the cut-off joins its own grader and level's batch

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
* **Trace:** grade10-admin-grading-batches-US-01

**Pre-conditions:**

* An open batch stands at PSA Regular, one submission in it.

**Test data:**

| `<level>` | `<joins>` |
| --- | --- |
| Regular | the standing Regular batch, no second batch listed for the trio |
| Express | PSA Express's own batch, the Regular batch unchanged |

**Steps:**

1. Note the Regular batch's cards; hand in a one-card submission at PSA `<level>` before the cut-off.
2. Read `<batches>`.

**Expected Results:**

* The submission joins `<joins>`.

<!-- trace:case id=g10adm.grading-batches.TC-m7m rev=1 covers=g10adm.grading-batches.SC-jam,g10adm.grading-batches.SC-uzm,g10adm.grading-batches.SC-e4n,g10adm.grading-batches.SC-yte,g10adm.grading-batches.SC-24g,g10adm.grading-batches.SC-ucf,g10adm.grading-batches.SC-uso,g10adm.grading-batches.SC-tky,g10adm.grading-batches.SC-3kj,g10adm.grading-batches.SC-z6w,g10adm.grading-batches.SC-p89,g10adm.grading-batches.SC-bll,g10adm.grading-batches.SC-ppx,g10adm.grading-batches.SC-26l,g10adm.grading-batches.SC-uis,g10adm.grading-batches.SC-x8i,g10adm.grading-batches.SC-vk6 -->
### g10adm.grading-batches.US1-TC13: A card handed in after the cut-off joins the trio's next batch

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-batches-US-01

**Pre-conditions:**

* A PSA Regular batch closed at Thursday 19:00 and is not shipped.

**Steps:**

1. Note its cards; hand in a one-card submission at PSA Regular that evening or the Friday before it ships.
2. Read `<batches>`.

**Expected Results:**

* The submission joins the trio's next batch; the closed batch's cards are unchanged.

<!-- trace:case id=g10adm.grading-batches.TC-qir rev=1 covers=g10adm.grading-batches.SC-jam,g10adm.grading-batches.SC-uzm,g10adm.grading-batches.SC-e4n,g10adm.grading-batches.SC-yte,g10adm.grading-batches.SC-24g,g10adm.grading-batches.SC-ucf,g10adm.grading-batches.SC-uso,g10adm.grading-batches.SC-tky,g10adm.grading-batches.SC-3kj,g10adm.grading-batches.SC-z6w,g10adm.grading-batches.SC-p89,g10adm.grading-batches.SC-bll,g10adm.grading-batches.SC-ppx,g10adm.grading-batches.SC-26l,g10adm.grading-batches.SC-uis,g10adm.grading-batches.SC-x8i,g10adm.grading-batches.SC-vk6 -->
### g10adm.grading-batches.US1-TC2: A batch still open before its cut-off offers no way to ship it

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-batches-US-01

**Pre-conditions:**

* A PSA Regular batch holds one submission, its cut-off ahead.

**Steps:**

1. Read its row.

**Expected Results:**

* It reads Open, building until its cut-off, with no Ship offered.

<!-- trace:case id=g10adm.grading-batches.TC-kpa rev=1 covers=g10adm.grading-batches.SC-jam,g10adm.grading-batches.SC-uzm,g10adm.grading-batches.SC-e4n,g10adm.grading-batches.SC-yte,g10adm.grading-batches.SC-24g,g10adm.grading-batches.SC-ucf,g10adm.grading-batches.SC-uso,g10adm.grading-batches.SC-tky,g10adm.grading-batches.SC-3kj,g10adm.grading-batches.SC-z6w,g10adm.grading-batches.SC-p89,g10adm.grading-batches.SC-bll,g10adm.grading-batches.SC-ppx,g10adm.grading-batches.SC-26l,g10adm.grading-batches.SC-uis,g10adm.grading-batches.SC-x8i,g10adm.grading-batches.SC-vk6 -->
### g10adm.grading-batches.US1-TC12: A batch reads Closed once its cut-off passes, and ships the next day

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** The batch and its cut-off

**Pre-conditions:**

* It is the Friday morning after a PSA Regular batch's Thursday 19:00 cut-off, no ship date recorded.

**Steps:**

1. Read its row.
2. Click Ship, and read the estimated back.

**Expected Results:**

* Step 1 reads Closed with nobody having acted, shipping that day.
* Step 2 counts the estimate from that ship day, today plus 5 weeks.

<!-- trace:case id=g10adm.grading-batches.TC-rff rev=1 covers=g10adm.grading-batches.SC-jam,g10adm.grading-batches.SC-uzm,g10adm.grading-batches.SC-e4n,g10adm.grading-batches.SC-yte,g10adm.grading-batches.SC-24g,g10adm.grading-batches.SC-ucf,g10adm.grading-batches.SC-uso,g10adm.grading-batches.SC-tky,g10adm.grading-batches.SC-3kj,g10adm.grading-batches.SC-z6w,g10adm.grading-batches.SC-p89,g10adm.grading-batches.SC-bll,g10adm.grading-batches.SC-ppx,g10adm.grading-batches.SC-26l,g10adm.grading-batches.SC-uis,g10adm.grading-batches.SC-x8i,g10adm.grading-batches.SC-vk6 -->
### g10adm.grading-batches.US1-TC15: The ship form reads the insured total off the batch's cards, and takes no typed figure

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-batches-US-01

**Pre-conditions:**

* A closed batch holds three cards declared HKD 5,000.00, HKD 3,000.00 and HKD 2,000.00.

**Steps:**

1. Click Ship, read the insured line, and try to type over it.
2. Complete the form with PSA-ORDER-0015 and SF1000000015, ship it, and read the insured total it carries.

**Expected Results:**

* Step 1 reads HKD 10,000.00, the sum of the declared values, and takes no typing.
* Step 2 stands that figure on the batch as the one declared to the courier.

<!-- trace:case id=g10adm.grading-batches.TC-msb rev=1 covers=g10adm.grading-batches.SC-jam,g10adm.grading-batches.SC-uzm,g10adm.grading-batches.SC-e4n,g10adm.grading-batches.SC-yte,g10adm.grading-batches.SC-24g,g10adm.grading-batches.SC-ucf,g10adm.grading-batches.SC-uso,g10adm.grading-batches.SC-tky,g10adm.grading-batches.SC-3kj,g10adm.grading-batches.SC-z6w,g10adm.grading-batches.SC-p89,g10adm.grading-batches.SC-bll,g10adm.grading-batches.SC-ppx,g10adm.grading-batches.SC-26l,g10adm.grading-batches.SC-uis,g10adm.grading-batches.SC-x8i,g10adm.grading-batches.SC-vk6 -->
### g10adm.grading-batches.US1-TC3: The ship form refuses a ship date out of its window, or a shipment with no tracking

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
* **Trace:** grade10-admin-grading-batches-US-01

**Pre-conditions:**

* The Ship form of a closed PSA Regular batch, cut-off Thursday 19:00, has every check ticked and every field filled but `<left>`.

**Test data:**

| `<left>` | `<refused>` |
| --- | --- |
| Shipped on, set to tomorrow | on the date field |
| Shipped on, set to the Wednesday before the cut-off | on the date field |
| the tracking number, left blank | at Mark as shipped, disabled and naming the tracking number |

**Steps:**

1. Try Mark as shipped, and read the batch's row.

**Expected Results:**

* It is refused `<refused>`; the row still reads Closed and no submission moves.

<!-- trace:case id=g10adm.grading-batches.TC-lvg rev=1 covers=g10adm.grading-batches.SC-jam,g10adm.grading-batches.SC-uzm,g10adm.grading-batches.SC-e4n,g10adm.grading-batches.SC-yte,g10adm.grading-batches.SC-24g,g10adm.grading-batches.SC-ucf,g10adm.grading-batches.SC-uso,g10adm.grading-batches.SC-tky,g10adm.grading-batches.SC-3kj,g10adm.grading-batches.SC-z6w,g10adm.grading-batches.SC-p89,g10adm.grading-batches.SC-bll,g10adm.grading-batches.SC-ppx,g10adm.grading-batches.SC-26l,g10adm.grading-batches.SC-uis,g10adm.grading-batches.SC-x8i,g10adm.grading-batches.SC-vk6 -->
### g10adm.grading-batches.US1-TC18: A batch above the courier's cover ships only split into shipments each under it

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-batches-US-01

**Pre-conditions:**

* A closed PSA Regular batch holds three cards declared HKD 200,000.00, HKD 150,000.00 and HKD 100,000.00, the first two in one submission.

**Steps:**

1. Record it as one shipment, read the insured line, and try Mark as shipped.
2. Split it into two shipments, the first card alone and then the other two, each with its courier and tracking, and mark it shipped.

**Expected Results:**

* Step 1's insured line reads in the warning tone; the act is refused naming HKD 450,000.00 against HKD 300,000.00, and nothing moves.
* Step 2's shipments read HKD 200,000.00 and HKD 250,000.00 insured; every submission reads With the grader, each collector told the tracking of each shipment carrying their cards, the one whose cards travel apart told both.

<!-- trace:case id=g10adm.grading-batches.TC-8mq rev=1 covers=g10adm.grading-batches.SC-jam,g10adm.grading-batches.SC-uzm,g10adm.grading-batches.SC-e4n,g10adm.grading-batches.SC-yte,g10adm.grading-batches.SC-24g,g10adm.grading-batches.SC-ucf,g10adm.grading-batches.SC-uso,g10adm.grading-batches.SC-tky,g10adm.grading-batches.SC-3kj,g10adm.grading-batches.SC-z6w,g10adm.grading-batches.SC-p89,g10adm.grading-batches.SC-bll,g10adm.grading-batches.SC-ppx,g10adm.grading-batches.SC-26l,g10adm.grading-batches.SC-uis,g10adm.grading-batches.SC-x8i,g10adm.grading-batches.SC-vk6 -->
### g10adm.grading-batches.US1-TC14: An unset courier cover holds the ship

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-batches-US-01

**Pre-conditions:**

* As production would read it, the courier's cover is cleared; a closed batch holds three cards.

**Steps:**

1. Complete the Ship form with PSA-ORDER-0014 and SF1000000014, and try Mark as shipped.

**Expected Results:**

* It is refused naming the courier's cover; no submission moves.

<!-- trace:case id=g10adm.grading-batches.TC-ng7 rev=1 covers=g10adm.grading-batches.SC-jam,g10adm.grading-batches.SC-uzm,g10adm.grading-batches.SC-e4n,g10adm.grading-batches.SC-yte,g10adm.grading-batches.SC-24g,g10adm.grading-batches.SC-ucf,g10adm.grading-batches.SC-uso,g10adm.grading-batches.SC-tky,g10adm.grading-batches.SC-3kj,g10adm.grading-batches.SC-z6w,g10adm.grading-batches.SC-p89,g10adm.grading-batches.SC-bll,g10adm.grading-batches.SC-ppx,g10adm.grading-batches.SC-26l,g10adm.grading-batches.SC-uis,g10adm.grading-batches.SC-x8i,g10adm.grading-batches.SC-vk6 -->
### g10adm.grading-batches.US1-TC16: The batches list puts what waits on the shop first and pages the received batches behind it

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-batches-US-01

**Pre-conditions:**

* The shop holds, and nothing else: a batch back unchecked; one closed, shipping today; three with PSA, past their estimate, due in 1 week and due in 3 weeks; one open; one closed and empty; and 60 received.

**Steps:**

1. Read `<batches>`, and page forward once with Older batches.

**Expected Results:**

* Both pages list the back, shipping, past-estimate, 1-week, 3-week and open batches first, in that order.
* Behind them the 60 received and the empty batch follow newest first, 50 on the first page and 11 on the second, none twice or missing, the second offering no further page; the empty batch offers no Ship.

---

## g10adm.grading-batches.US2: Operator receives a batch against the grader's manifest

**As a** member of shop staff opening a returned box,
**I want** the manifest and the invoice entered first, a manifest line naming no intake id held until I resolve it, a card the grader held from an earlier box matched when it comes back, each slab scanned and matched to a card by intake id with a cert already held elsewhere refused by name, an upcharge recorded as the sheet's difference with the invoice reconciled against it, counters of scanned, matched, ungraded and upcharges, a half-scanned batch keeping its scans until I come back, and a finish that makes every submission in the batch ready at once with its pickup code emailed,
**so that** a slab can never be handed to the wrong collector, the collector owes what they were quoted, and nobody is told ready twice.

<!-- trace:case id=g10adm.grading-batches.TC-6vw rev=1 covers=g10adm.grading-batches.SC-oj1,g10adm.grading-batches.SC-fxt,g10adm.grading-batches.SC-s4w,g10adm.grading-batches.SC-xx9,g10adm.grading-batches.SC-n7i,g10adm.grading-batches.SC-t91,g10adm.grading-batches.SC-pqo,g10adm.grading-batches.SC-5j9,g10adm.grading-batches.SC-1hw,g10adm.grading-batches.SC-06a,g10adm.grading-batches.SC-x40,g10adm.grading-batches.SC-uhm,g10adm.grading-batches.SC-u0i,g10adm.grading-batches.SC-mg6,g10adm.grading-batches.SC-21a,g10adm.grading-batches.SC-8ys,g10adm.grading-batches.SC-y5i,g10adm.grading-batches.SC-j3q,g10adm.grading-batches.SC-xay -->
### g10adm.grading-batches.US2-TC14: A box recorded arrived reads back, unchecked, and is badged after a day

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-batches-US-02

**Pre-conditions:**

* A shipped batch's two cards have their grades in.

**Steps:**

1. Click Arrived on its row, and read it.
2. Read it again more than a day later, still unchecked.

**Expected Results:**

* Step 1 reads Back, unchecked, offering Receive.
* Step 2 is badged as waiting on the shop.

<!-- trace:case id=g10adm.grading-batches.TC-cph rev=1 covers=g10adm.grading-batches.SC-oj1,g10adm.grading-batches.SC-fxt,g10adm.grading-batches.SC-s4w,g10adm.grading-batches.SC-xx9,g10adm.grading-batches.SC-n7i,g10adm.grading-batches.SC-t91,g10adm.grading-batches.SC-pqo,g10adm.grading-batches.SC-5j9,g10adm.grading-batches.SC-1hw,g10adm.grading-batches.SC-06a,g10adm.grading-batches.SC-x40,g10adm.grading-batches.SC-uhm,g10adm.grading-batches.SC-u0i,g10adm.grading-batches.SC-mg6,g10adm.grading-batches.SC-21a,g10adm.grading-batches.SC-8ys,g10adm.grading-batches.SC-y5i,g10adm.grading-batches.SC-j3q,g10adm.grading-batches.SC-xay -->
### g10adm.grading-batches.US2-TC17: A box is not recorded arrived before its grades are in

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-batches-US-02

**Pre-conditions:**

* A shipped PSA Regular batch holds two submissions, one with its grades in and one still with PSA.

**Steps:**

1. Read its row.
2. Send its arrival directly, as a stale console would, and read the row and both submissions.

**Expected Results:**

* Step 1 offers no Arrived.
* Step 2 is refused, naming the submission not yet graded; the batch still reads Shipped and both keep their status.

<!-- trace:case id=g10adm.grading-batches.TC-fob rev=1 covers=g10adm.grading-batches.SC-oj1,g10adm.grading-batches.SC-fxt,g10adm.grading-batches.SC-s4w,g10adm.grading-batches.SC-xx9,g10adm.grading-batches.SC-n7i,g10adm.grading-batches.SC-t91,g10adm.grading-batches.SC-pqo,g10adm.grading-batches.SC-5j9,g10adm.grading-batches.SC-1hw,g10adm.grading-batches.SC-06a,g10adm.grading-batches.SC-x40,g10adm.grading-batches.SC-uhm,g10adm.grading-batches.SC-u0i,g10adm.grading-batches.SC-mg6,g10adm.grading-batches.SC-21a,g10adm.grading-batches.SC-8ys,g10adm.grading-batches.SC-y5i,g10adm.grading-batches.SC-j3q,g10adm.grading-batches.SC-xay -->
### g10adm.grading-batches.US2-TC1: Nothing is scanned until the manifest and the invoice are entered

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-batches-US-02

**Pre-conditions:**

* A two-card batch reads Back, unchecked, no manifest or invoice entered.

**Steps:**

1. Click Receive, and read the scan bar.
2. Type a line per card, click Enter the manifest, enter INV-0002, USD, 30.00 and click Enter the invoice; read the scan bar and the invoice.

**Expected Results:**

* Step 1 disables Scan, asking for the manifest and the invoice first.
* Step 2 enables Scan and shows the invoice's lines and total.

<!-- trace:case id=g10adm.grading-batches.TC-ruj rev=1 covers=g10adm.grading-batches.SC-oj1,g10adm.grading-batches.SC-fxt,g10adm.grading-batches.SC-s4w,g10adm.grading-batches.SC-xx9,g10adm.grading-batches.SC-n7i,g10adm.grading-batches.SC-t91,g10adm.grading-batches.SC-pqo,g10adm.grading-batches.SC-5j9,g10adm.grading-batches.SC-1hw,g10adm.grading-batches.SC-06a,g10adm.grading-batches.SC-x40,g10adm.grading-batches.SC-uhm,g10adm.grading-batches.SC-u0i,g10adm.grading-batches.SC-mg6,g10adm.grading-batches.SC-21a,g10adm.grading-batches.SC-8ys,g10adm.grading-batches.SC-y5i,g10adm.grading-batches.SC-j3q,g10adm.grading-batches.SC-xay -->
### g10adm.grading-batches.US2-TC3: A scan records the cert on the card its manifest line names, graded or ungraded

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
* **Trace:** grade10-admin-grading-batches-US-02

**Pre-conditions:**

* A two-card batch's manifest and invoice are entered; the first card's line reads `<line>`.

**Test data:**

| `<line>` | `<card reads>` | `<counter>` |
| --- | --- | --- |
| cert 90000001, MINT 9, regular | the grade, cert, card and submission, Matched and Scanned | scanned and matched |
| cert 90000701, no grade, regular, N1, Authenticity could not be verified | ungraded, with N1 and the note | ungraded |

**Steps:**

1. Scan the first card's cert, and read its row and the counters.

**Expected Results:**

* The row reads `<card reads>`; the `<counter>` counter rises by one.

<!-- trace:case id=g10adm.grading-batches.TC-rnb rev=1 covers=g10adm.grading-batches.SC-oj1,g10adm.grading-batches.SC-fxt,g10adm.grading-batches.SC-s4w,g10adm.grading-batches.SC-xx9,g10adm.grading-batches.SC-n7i,g10adm.grading-batches.SC-t91,g10adm.grading-batches.SC-pqo,g10adm.grading-batches.SC-5j9,g10adm.grading-batches.SC-1hw,g10adm.grading-batches.SC-06a,g10adm.grading-batches.SC-x40,g10adm.grading-batches.SC-uhm,g10adm.grading-batches.SC-u0i,g10adm.grading-batches.SC-mg6,g10adm.grading-batches.SC-21a,g10adm.grading-batches.SC-8ys,g10adm.grading-batches.SC-y5i,g10adm.grading-batches.SC-j3q,g10adm.grading-batches.SC-xay -->
### g10adm.grading-batches.US2-TC8: A card moved up a level owes the sheet's difference, the invoice read against it

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
* **Trace:** grade10-admin-grading-batches-US-02

**Pre-conditions:**

* A two-card Regular batch's first line is charged at Express, GEM MT 10; the invoice reads `<invoice>`.

**Test data:**

| `<invoice>` | `<invoice reads>` |
| --- | --- |
| HKD 1,200.00, the card at Express's fee | reconciled against HKD 600.00 |
| USD 80.00 | shown against the sheet's HKD 600.00, each in its own currency, the gap marked Commercial's |

**Steps:**

1. Scan the first card's cert, and read its row, the counters and the invoice figure.

**Expected Results:**

* The card owes HKD 600.00, Express's fee less Regular's on the pinned sheet; the upcharges counter and its sum rise; the invoice is `<invoice reads>`.

<!-- trace:case id=g10adm.grading-batches.TC-90l rev=1 covers=g10adm.grading-batches.SC-oj1,g10adm.grading-batches.SC-fxt,g10adm.grading-batches.SC-s4w,g10adm.grading-batches.SC-xx9,g10adm.grading-batches.SC-n7i,g10adm.grading-batches.SC-t91,g10adm.grading-batches.SC-pqo,g10adm.grading-batches.SC-5j9,g10adm.grading-batches.SC-1hw,g10adm.grading-batches.SC-06a,g10adm.grading-batches.SC-x40,g10adm.grading-batches.SC-uhm,g10adm.grading-batches.SC-u0i,g10adm.grading-batches.SC-mg6,g10adm.grading-batches.SC-21a,g10adm.grading-batches.SC-8ys,g10adm.grading-batches.SC-y5i,g10adm.grading-batches.SC-j3q,g10adm.grading-batches.SC-xay -->
### g10adm.grading-batches.US2-TC4: A scan the manifest or another card's record forbids is refused by name

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-batches-US-02

**Pre-conditions:**

* A two-card batch's manifest and invoice are entered; `<cert>`.

**Test data:**

| `<cert>` | `<refused, naming>` |
| --- | --- |
| the first line carries a cert held by a card of another ready submission | the submission holding it |
| the first line carries a cert a card of an earlier, received PSA batch carries | the submission holding it |
| 99999999 is on no line | the cert, on no line of the manifest |

**Steps:**

1. Scan `<cert>`, and read the scan bar and both cards.

**Expected Results:**

* It is refused, naming `<refused, naming>`; nothing is recorded on any card.

<!-- trace:case id=g10adm.grading-batches.TC-oto rev=1 covers=g10adm.grading-batches.SC-oj1,g10adm.grading-batches.SC-fxt,g10adm.grading-batches.SC-s4w,g10adm.grading-batches.SC-xx9,g10adm.grading-batches.SC-n7i,g10adm.grading-batches.SC-t91,g10adm.grading-batches.SC-pqo,g10adm.grading-batches.SC-5j9,g10adm.grading-batches.SC-1hw,g10adm.grading-batches.SC-06a,g10adm.grading-batches.SC-x40,g10adm.grading-batches.SC-uhm,g10adm.grading-batches.SC-u0i,g10adm.grading-batches.SC-mg6,g10adm.grading-batches.SC-21a,g10adm.grading-batches.SC-8ys,g10adm.grading-batches.SC-y5i,g10adm.grading-batches.SC-j3q,g10adm.grading-batches.SC-xay -->
### g10adm.grading-batches.US2-TC6: A manifest line naming no intake id in the batch is held until staff resolve it

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-batches-US-02

**Pre-conditions:**

* A three-card batch's manifest is entered with two lines unmatched: the third card's intake id mistyped, and an id no card of the shop carries; every other card is scanned.

**Steps:**

1. Read the manifest lines and Finish receiving.
2. On the first line, name the third card as the one it meant, and scan 90001603.
3. Close the second line as the grader's error, Listed in error by the grader.
4. Click Finish receiving.

**Expected Results:**

* Step 1 lists both lines unmatched, holding Finish.
* Step 2 records the cert on the third card, the line reading matched; step 3 reads the second closed with its reason.
* Step 4 goes ahead, neither line holding it.

<!-- trace:case id=g10adm.grading-batches.TC-an8 rev=1 covers=g10adm.grading-batches.SC-oj1,g10adm.grading-batches.SC-fxt,g10adm.grading-batches.SC-s4w,g10adm.grading-batches.SC-xx9,g10adm.grading-batches.SC-n7i,g10adm.grading-batches.SC-t91,g10adm.grading-batches.SC-pqo,g10adm.grading-batches.SC-5j9,g10adm.grading-batches.SC-1hw,g10adm.grading-batches.SC-06a,g10adm.grading-batches.SC-x40,g10adm.grading-batches.SC-uhm,g10adm.grading-batches.SC-u0i,g10adm.grading-batches.SC-mg6,g10adm.grading-batches.SC-21a,g10adm.grading-batches.SC-8ys,g10adm.grading-batches.SC-y5i,g10adm.grading-batches.SC-j3q,g10adm.grading-batches.SC-xay -->
### g10adm.grading-batches.US2-TC18: A slab the manifest leaves out is added as the grader's omission, then scanned

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-batches-US-02

**Pre-conditions:**

* A two-card batch's manifest names only the first card; the second's slab is in the box.

**Steps:**

1. Click Add to the manifest on the second card, enter 90001802 and NM-MT 8, and confirm.
2. Scan 90001802.

**Expected Results:**

* Step 1's line stands as the grader's omission.
* Step 2 stands the cert and grade on the card, its line scanned, no longer holding Finish.

<!-- trace:case id=g10adm.grading-batches.TC-m8p rev=1 covers=g10adm.grading-batches.SC-oj1,g10adm.grading-batches.SC-fxt,g10adm.grading-batches.SC-s4w,g10adm.grading-batches.SC-xx9,g10adm.grading-batches.SC-n7i,g10adm.grading-batches.SC-t91,g10adm.grading-batches.SC-pqo,g10adm.grading-batches.SC-5j9,g10adm.grading-batches.SC-1hw,g10adm.grading-batches.SC-06a,g10adm.grading-batches.SC-x40,g10adm.grading-batches.SC-uhm,g10adm.grading-batches.SC-u0i,g10adm.grading-batches.SC-mg6,g10adm.grading-batches.SC-21a,g10adm.grading-batches.SC-8ys,g10adm.grading-batches.SC-y5i,g10adm.grading-batches.SC-j3q,g10adm.grading-batches.SC-xay -->
### g10adm.grading-batches.US2-TC19: A card the grader held comes home in a later box

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-batches-US-02

**Pre-conditions:**

* One of a submission's two cards was recorded held by PSA when its batch was received; a later PSA Regular batch has arrived; a card is held at CGC.

**Steps:**

1. Type the later batch's manifest with a line naming the held card's intake id and 90000001, and one naming the CGC card.
2. Scan 90000001, and read the held card and its collector's email.

**Expected Results:**

* Step 1 matches the held card's line, and lists the CGC line unmatched.
* Step 2 stands 90000001 and its grade on the card, no longer held; its collector is told the grades that day, and the submission offers the second hand-back.

<!-- trace:case id=g10adm.grading-batches.TC-sej rev=1 covers=g10adm.grading-batches.SC-oj1,g10adm.grading-batches.SC-fxt,g10adm.grading-batches.SC-s4w,g10adm.grading-batches.SC-xx9,g10adm.grading-batches.SC-n7i,g10adm.grading-batches.SC-t91,g10adm.grading-batches.SC-pqo,g10adm.grading-batches.SC-5j9,g10adm.grading-batches.SC-1hw,g10adm.grading-batches.SC-06a,g10adm.grading-batches.SC-x40,g10adm.grading-batches.SC-uhm,g10adm.grading-batches.SC-u0i,g10adm.grading-batches.SC-mg6,g10adm.grading-batches.SC-21a,g10adm.grading-batches.SC-8ys,g10adm.grading-batches.SC-y5i,g10adm.grading-batches.SC-j3q,g10adm.grading-batches.SC-xay -->
### g10adm.grading-batches.US2-TC10: A half-scanned box is put down and taken up again, its counters standing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-batches-US-02

**Pre-conditions:**

* A ten-card batch of three submissions has 6 certs scanned, among them the N1 line and two Express lines.

**Steps:**

1. Save it part-scanned, click Back to the batches, and click Receive on it again.

**Expected Results:**

* Every scan stands, the batch still Back, unchecked; the counters read 6 scanned of 10, 6 matched, 1 ungraded, 2 upcharges summing HKD 1,200.00, and 3 submissions ready when finished; no collector was emailed for a scan.

<!-- trace:case id=g10adm.grading-batches.TC-jef rev=1 covers=g10adm.grading-batches.SC-oj1,g10adm.grading-batches.SC-fxt,g10adm.grading-batches.SC-s4w,g10adm.grading-batches.SC-xx9,g10adm.grading-batches.SC-n7i,g10adm.grading-batches.SC-t91,g10adm.grading-batches.SC-pqo,g10adm.grading-batches.SC-5j9,g10adm.grading-batches.SC-1hw,g10adm.grading-batches.SC-06a,g10adm.grading-batches.SC-x40,g10adm.grading-batches.SC-uhm,g10adm.grading-batches.SC-u0i,g10adm.grading-batches.SC-mg6,g10adm.grading-batches.SC-21a,g10adm.grading-batches.SC-8ys,g10adm.grading-batches.SC-y5i,g10adm.grading-batches.SC-j3q,g10adm.grading-batches.SC-xay -->
### g10adm.grading-batches.US2-TC11: Finishing is held while a line or a slab is unresolved

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
* **Trace:** grade10-admin-grading-batches-US-02

**Pre-conditions:**

* A two-card batch's invoice is entered, every line scanned but `<left>`.

**Test data:**

| `<left>` |
| --- |
| a third line naming an intake id no card carries |
| the second card's cert, unscanned |
| both |

**Steps:**

1. Read Finish receiving.

**Expected Results:**

* It is disabled, naming each of `<left>`; no submission moves.

<!-- trace:case id=g10adm.grading-batches.TC-ca2 rev=1 covers=g10adm.grading-batches.SC-oj1,g10adm.grading-batches.SC-fxt,g10adm.grading-batches.SC-s4w,g10adm.grading-batches.SC-xx9,g10adm.grading-batches.SC-n7i,g10adm.grading-batches.SC-t91,g10adm.grading-batches.SC-pqo,g10adm.grading-batches.SC-5j9,g10adm.grading-batches.SC-1hw,g10adm.grading-batches.SC-06a,g10adm.grading-batches.SC-x40,g10adm.grading-batches.SC-uhm,g10adm.grading-batches.SC-u0i,g10adm.grading-batches.SC-mg6,g10adm.grading-batches.SC-21a,g10adm.grading-batches.SC-8ys,g10adm.grading-batches.SC-y5i,g10adm.grading-batches.SC-j3q,g10adm.grading-batches.SC-xay -->
### g10adm.grading-batches.US2-TC12: Finishing makes every submission ready at once and tells each collector once

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-batches-US-02

**Pre-conditions:**

* A batch of three collectors' submissions has every line matched or resolved.

**Steps:**

1. Click Finish receiving.
2. Read the row, each submission on the queue, and each collector's email.

**Expected Results:**

* The batch reads Received with its date back; every submission reads Ready to collect together.
* Each collector is emailed the pickup code and what is due, once.

---

## g10adm.grading-batches.US3: Operator records what did not come back as drawn

**As a** member of shop staff finishing a batch,
**I want** a card on the manifest but not in the box recorded as held by the grader with its expected date or as not returned, a damaged slab photographed before it leaves the box, and the collector emailed the same day either way,
**so that** every exception is a fact on one card with the money it changes.

<!-- trace:case id=g10adm.grading-batches.TC-9r7 rev=1 covers=g10adm.grading-batches.SC-dn8,g10adm.grading-batches.SC-jze,g10adm.grading-batches.SC-awd,g10adm.grading-batches.SC-y6t,g10adm.grading-batches.SC-dpc,g10adm.grading-batches.SC-lnj -->
### g10adm.grading-batches.US3-TC1: A card not in the box is recorded held with its date, or not returned owing its value, and the collector told that day

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
* **Trace:** grade10-admin-grading-batches-US-03

**Pre-conditions:**

* A two-card batch is being received, the first card scanned; the second, declared HKD 8,000.00, is on the manifest but not in the box.

**Test data:**

| `<recorded>` | `<card reads>` |
| --- | --- |
| Held, expected back 3 weeks from today | held by the grader, with that date |
| Not returned | not returned, owing a payout of HKD 8,000.00 |

**Steps:**

1. Record the second card `<recorded>`, and read its line and the collector's email.

**Expected Results:**

* It reads `<card reads>`; the collector is emailed that day, in the message for a card not back with the box, naming the date where it is held.

<!-- trace:case id=g10adm.grading-batches.TC-3ua rev=1 covers=g10adm.grading-batches.SC-dn8,g10adm.grading-batches.SC-jze,g10adm.grading-batches.SC-awd,g10adm.grading-batches.SC-y6t,g10adm.grading-batches.SC-dpc,g10adm.grading-batches.SC-lnj -->
### g10adm.grading-batches.US3-TC3: A damaged slab is photographed in the box before it leaves it

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-batches-US-03

**Pre-conditions:**

* A slab declared HKD 5,000.00 has come back cracked, still in its box.

**Steps:**

1. Click Damaged on its line, and confirm with no photograph.
2. Photograph it in the box, click Damaged, attach the photograph and confirm; read the line and the collector's email.

**Expected Results:**

* Step 1 is refused until the slab is photographed in the box.
* Step 2 attaches the photograph, the card reading damaged and owing HKD 5,000.00; the collector is emailed that day.

<!-- trace:case id=g10adm.grading-batches.TC-xpf rev=1 covers=g10adm.grading-batches.SC-dn8,g10adm.grading-batches.SC-jze,g10adm.grading-batches.SC-awd,g10adm.grading-batches.SC-y6t,g10adm.grading-batches.SC-dpc,g10adm.grading-batches.SC-lnj -->
### g10adm.grading-batches.US3-TC4: The rest of a submission's cards finish while one is held

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-batches-US-03

**Pre-conditions:**

* A four-card submission's batch is being received.

**Steps:**

1. Scan the first three certs, record the fourth held with a date 3 weeks out, and click Finish receiving.
2. Read the submission's page.

**Expected Results:**

* The other cards finish and go ready with it; only the held card's outcome is an exception.

<!-- trace:case id=g10adm.grading-batches.TC-x1b rev=1 covers=g10adm.grading-batches.SC-dn8,g10adm.grading-batches.SC-jze,g10adm.grading-batches.SC-awd,g10adm.grading-batches.SC-y6t,g10adm.grading-batches.SC-dpc,g10adm.grading-batches.SC-lnj -->
### g10adm.grading-batches.US3-TC5: A card recorded held with no expected date is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-batches-US-03

**Pre-conditions:**

* A card on the manifest is not in the box.

**Steps:**

1. Click Held on its line, leave the date empty, and confirm.

**Expected Results:**

* It is refused, naming the date; the line still reads on the manifest, not scanned.

<!-- trace:case id=g10adm.grading-batches.TC-vxy rev=1 covers=g10adm.grading-batches.SC-dn8,g10adm.grading-batches.SC-jze,g10adm.grading-batches.SC-awd,g10adm.grading-batches.SC-y6t,g10adm.grading-batches.SC-dpc,g10adm.grading-batches.SC-lnj -->
### g10adm.grading-batches.US3-TC6: A card no manifest line names holds finishing until it is recorded

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-batches-US-03

**Pre-conditions:**

* A two-card batch's manifest names only the first card, scanned; the second is not in the box.

**Steps:**

1. Click Finish receiving.
2. Click Not returned on the second card under the scan table, confirm, and click Finish receiving again.

**Expected Results:**

* Step 1 is refused, naming the second card; no submission moves.
* Step 2 finishes, every submission reading Ready to collect.

---

## g10adm.grading-batches.US4: Operator re-estimates a batch that is running late

**As a** member of shop staff reading the grader's order status in the morning,
**I want** to type the grader's stage onto the batch, set a new estimate with a reason, and have every collector in it emailed the day I set it,
**so that** the shop tells the collector before the collector asks.

<!-- trace:case id=g10adm.grading-batches.TC-hzz rev=1 covers=g10adm.grading-batches.SC-7sk,g10adm.grading-batches.SC-pxd,g10adm.grading-batches.SC-wfu,g10adm.grading-batches.SC-08v,g10adm.grading-batches.SC-8c6,g10adm.grading-batches.SC-xgu -->
### g10adm.grading-batches.US4-TC1: The morning read records the grader's own stage on the batch

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-batches-US-04

**Pre-conditions:**

* A two-card batch is with PSA.

**Steps:**

1. Record Research and ID from PSA's stages on its row, with the note In research and ID since Monday.
2. Read the batch's and the submission's timelines.

**Expected Results:**

* The stage lands on both timelines, the note carrying PSA's words; the stage itself is never free text.

<!-- trace:case id=g10adm.grading-batches.TC-mv7 rev=1 covers=g10adm.grading-batches.SC-7sk,g10adm.grading-batches.SC-pxd,g10adm.grading-batches.SC-wfu,g10adm.grading-batches.SC-08v,g10adm.grading-batches.SC-8c6,g10adm.grading-batches.SC-xgu -->
### g10adm.grading-batches.US4-TC6: The stage that is the move puts every submission in the batch at Grades are in

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-batches-US-04

**Pre-conditions:**

* A batch with PSA holds three collectors' submissions.

**Steps:**

1. Record Completed with the note Grades posted.
2. Read each submission on the queue, and each collector's email.

**Expected Results:**

* Every submission reads Grades are in; each collector is emailed once.

<!-- trace:case id=g10adm.grading-batches.TC-3t2 rev=1 covers=g10adm.grading-batches.SC-7sk,g10adm.grading-batches.SC-pxd,g10adm.grading-batches.SC-wfu,g10adm.grading-batches.SC-08v,g10adm.grading-batches.SC-8c6,g10adm.grading-batches.SC-xgu -->
### g10adm.grading-batches.US4-TC7: Recording what the batch already carries writes nothing and tells nobody again

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
* **Trace:** The grader's stages

**Pre-conditions:**

* A two-card batch with PSA carries `<carries>`.

**Test data:**

| `<carries>` | `<recorded again>` |
| --- | --- |
| Research and ID as its last stage | Research and ID |
| a due date | a re-estimate to that same date, The grader confirmed the same date |

**Steps:**

1. Note the batch's timeline and the collector's last email.
2. Record `<recorded again>`, and read them again.

**Expected Results:**

* Nothing further is written to the batch or its submissions, and no collector is emailed again.

<!-- trace:case id=g10adm.grading-batches.TC-fad rev=1 covers=g10adm.grading-batches.SC-7sk,g10adm.grading-batches.SC-pxd,g10adm.grading-batches.SC-wfu,g10adm.grading-batches.SC-08v,g10adm.grading-batches.SC-8c6,g10adm.grading-batches.SC-xgu -->
### g10adm.grading-batches.US4-TC2: A batch past its estimate reads late, with nothing written

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-batches-US-04

**Pre-conditions:**

* A batch with PSA has passed its estimate, not re-estimated.

**Steps:**

1. Read its row and the tiles.

**Expected Results:**

* It reads Due back in the warning tone, read from the clock; With graders counts it past its estimate.

<!-- trace:case id=g10adm.grading-batches.TC-4ij rev=1 covers=g10adm.grading-batches.SC-7sk,g10adm.grading-batches.SC-pxd,g10adm.grading-batches.SC-wfu,g10adm.grading-batches.SC-08v,g10adm.grading-batches.SC-8c6,g10adm.grading-batches.SC-xgu -->
### g10adm.grading-batches.US4-TC9: The due-back badge stands from the estimated day and gives way to running late

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-batches-US-04

**Pre-conditions:**

* A shipped batch's estimated day back is today, the shop's.

**Steps:**

1. Read a submission's row in it on the queue.
2. Read it the next day.
3. Receive the batch to the end, and read it again.

**Expected Results:**

* Step 1 badges it due back; step 2 running late instead; step 3 neither.

<!-- trace:case id=g10adm.grading-batches.TC-46a rev=1 covers=g10adm.grading-batches.SC-7sk,g10adm.grading-batches.SC-pxd,g10adm.grading-batches.SC-wfu,g10adm.grading-batches.SC-08v,g10adm.grading-batches.SC-8c6,g10adm.grading-batches.SC-xgu -->
### g10adm.grading-batches.US4-TC3: A re-estimate takes a reason and tells every collector that day

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-batches-US-04

**Pre-conditions:**

* A batch past its estimate holds three collectors' submissions.

**Steps:**

1. Click Re-estimate, set QA checks, a date 2 weeks out and PSA moved the order to QA checks, and confirm.
2. Read the row, and each collector's email.

**Expected Results:**

* The batch carries the new date with its reason; every collector is emailed that day.

<!-- trace:case id=g10adm.grading-batches.TC-wuw rev=1 covers=g10adm.grading-batches.SC-7sk,g10adm.grading-batches.SC-pxd,g10adm.grading-batches.SC-wfu,g10adm.grading-batches.SC-08v,g10adm.grading-batches.SC-8c6,g10adm.grading-batches.SC-xgu -->
### g10adm.grading-batches.US4-TC4: A re-estimate with no reason is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-batches-US-04

**Pre-conditions:**

* The Re-estimate dialog of a batch past its estimate is open.

**Steps:**

1. Set QA checks and a date 2 weeks out, leave the reason blank, and confirm.

**Expected Results:**

* It is refused, naming the reason; the due date does not move, and no collector is emailed.

---

## g10adm.grading-batches.US5: Operator keeps the safe under its cap

**As a** member of shop staff building a batch,
**I want** the tiles to read what is closing, what is with graders and past its estimate, what is back unchecked, and the declared value in the safe, ready slabs included, against its cap, and a hand-in that would pass the cap refused at the desk with the next drop-off booked instead,
**so that** the shop never holds more than it is covered for.

<!-- trace:case id=g10adm.grading-batches.TC-61i rev=1 covers=g10adm.grading-batches.SC-7n8,g10adm.grading-batches.SC-7rg,g10adm.grading-batches.SC-nmc,g10adm.grading-batches.SC-5n2 -->
### g10adm.grading-batches.US5-TC1: The tiles read the day over the counter

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-batches-US-05

**Pre-conditions:**

* The shop holds one batch closed and shipping today, with HKD 100,000.00 declared; two with PSA, one past its estimate; one back and unchecked, with HKD 140,000.00.

**Steps:**

1. Read the tiles on `<batches>`.

**Expected Results:**

* Ship today reads 1; With graders 2, 1 past its estimate; Back, unchecked 1; the declared value in the safe HKD 240,000.00 against HKD 300,000.00.

<!-- trace:case id=g10adm.grading-batches.TC-yhm rev=1 covers=g10adm.grading-batches.SC-7n8,g10adm.grading-batches.SC-7rg,g10adm.grading-batches.SC-nmc,g10adm.grading-batches.SC-5n2 -->
### g10adm.grading-batches.US5-TC2: The safe counts every card held, ready slabs included, and not a card collected

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-batches-US-05

**Pre-conditions:**

* Held at the shop: HKD 100,000.00 handed in, HKD 80,000.00 back from PSA, and HKD 60,000.00 of ready slabs; HKD 20,000.00 collected.

**Steps:**

1. Read the Declared value in the safe tile.

**Expected Results:**

* It reads HKD 240,000.00, leaving out the collected card.

<!-- trace:case id=g10adm.grading-batches.TC-84a rev=1 covers=g10adm.grading-batches.SC-7n8,g10adm.grading-batches.SC-7rg,g10adm.grading-batches.SC-nmc,g10adm.grading-batches.SC-5n2 -->
### g10adm.grading-batches.US5-TC5: A hand-in that fills the safe to its cap is taken, and the tile warns

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-batches-US-05

**Pre-conditions:**

* The safe holds HKD 290,000.00.

**Steps:**

1. Hand in a one-card submission declared HKD 10,000.00.
2. Read the Declared value in the safe tile.

**Expected Results:**

* Step 1 is taken, with no cap refusal.
* Step 2 reads HKD 300,000.00 in the warning tone, at its cap.

<!-- trace:case id=g10adm.grading-batches.TC-hwf rev=1 covers=g10adm.grading-batches.SC-7n8,g10adm.grading-batches.SC-7rg,g10adm.grading-batches.SC-nmc,g10adm.grading-batches.SC-5n2 -->
### g10adm.grading-batches.US5-TC4: A hand-in that would carry the safe past its cap is refused, the next drop-off booked instead

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-batches-US-05

**Pre-conditions:**

* The safe holds HKD 290,000.00.

**Steps:**

1. Try to hand in a one-card submission declared HKD 20,000.00, and read the runbook and its drop-off.

**Expected Results:**

* It is refused, naming the safe's cap; the next drop-off is booked for it, and the collector is told the shop is at its cap.

## Settled

- A read-grant holder offered no act on the batches and receive pages is `grade10-admin/grading/counter`'s grant rule, walked in the counter suite.
