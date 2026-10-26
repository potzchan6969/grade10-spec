# grade10-site/grading/submission-lifecycle Test Cases

**Status:** pending-review · 0/48
**Drafts styled:** 2026-10-25, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7

## Background

* A submission's page, `<submission page>`, opens to the collector signed in under its email and to the link its emails carry. `<collector inbox>` is a mailbox the tester reads. Amounts are HKD; the Regular fee is HKD 600.00 a card, storage HKD 30.00 a card a month from day 90, the ID-glance threshold HKD 10,000.00 declared in total, the notice period pinned at signing 90 days.
* Staff is admin(holds `grading:operate`) on the admin console: the submission's runbooks and Cards and Money tabs, and the batches page with each batch's Receive page. A payout is made by one `grading:approve` holder and approved by a second. The tester moves the shop's clock, Hong Kong's, and runs grading's sweep to reach a day.

## g10.grading-submission-lifecycle.US1: Collector follows the submission from planned to home on one page

**As a** collector with cards in the shop's hands,
**I want** the page to read one status in my words, a chip saying whose move it is, a rail from Planned to Home, and while the cards are away the grader's stages in its own words, the estimate, and Running late with the new date once it is set,
**so that** I never have to ask the shop where my cards are, and waiting on the grader never reads as waiting on the shop.

<!-- trace:case id=g10.grading-submission-lifecycle.TC-3jz rev=1 covers=g10.grading-submission-lifecycle.SC-8dw,g10.grading-submission-lifecycle.SC-xwm,g10.grading-submission-lifecycle.SC-1rg,g10.grading-submission-lifecycle.SC-3gk,g10.grading-submission-lifecycle.SC-05o,g10.grading-submission-lifecycle.SC-ge7,g10.grading-submission-lifecycle.SC-17s,g10.grading-submission-lifecycle.SC-k5p,g10.grading-submission-lifecycle.SC-kui,g10.grading-submission-lifecycle.SC-fda,g10.grading-submission-lifecycle.SC-s5n,g10.grading-submission-lifecycle.SC-mp1,g10.grading-submission-lifecycle.SC-mcw,g10.grading-submission-lifecycle.SC-ejt,g10.grading-submission-lifecycle.SC-sip -->
### g10.grading-submission-lifecycle.US1-TC1: The word, the chip and the rail read one status's row

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-01

**Pre-conditions:**

* A collector's PSA submission stands at `<status>`.

**Test data:**

| `<status>` | `<word>` | `<chip>` | `<rail at>` |
| --- | --- | --- | --- |
| Planned | Not handed in yet | Waiting on you | Planned |
| Booked | Drop-off booked | Drop-off on its day | Booked |
| Handed in | Handed in | With us | Handed in |
| Sent | With the grader | With PSA | Sent |
| Graded | Grades are in | On their way back | Graded |
| Back | Back at the shop, being checked | With us | Back |
| Ready | Ready to collect | Waiting on you | Back |
| Collected | Back with you | Collected | Home |
| Cancelled from Drop-off booked | Cancelled | no chip | Booked |
| Expired from Not handed in yet | Expired | no chip | Planned |

**Steps:**

1. Open `<submission page>`, and read the word, the chip and the rail.

**Expected Results:**

* It reads `<word>`, `<chip>` and the rail at `<rail at>`, every stage before it done and every one after to come; no internal status name shows anywhere.

<!-- trace:case id=g10.grading-submission-lifecycle.TC-9gg rev=1 covers=g10.grading-submission-lifecycle.SC-8dw,g10.grading-submission-lifecycle.SC-xwm,g10.grading-submission-lifecycle.SC-1rg,g10.grading-submission-lifecycle.SC-3gk,g10.grading-submission-lifecycle.SC-05o,g10.grading-submission-lifecycle.SC-ge7,g10.grading-submission-lifecycle.SC-17s,g10.grading-submission-lifecycle.SC-k5p,g10.grading-submission-lifecycle.SC-kui,g10.grading-submission-lifecycle.SC-fda,g10.grading-submission-lifecycle.SC-s5n,g10.grading-submission-lifecycle.SC-mp1,g10.grading-submission-lifecycle.SC-mcw,g10.grading-submission-lifecycle.SC-ejt,g10.grading-submission-lifecycle.SC-sip -->
### g10.grading-submission-lifecycle.US1-TC2: While the cards are away the page reads the grader's stages, the estimate, and running late until a new date

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-lifecycle-US-01

**Pre-conditions:**

* A collector's submission is with PSA, its batch shipped longer ago than the level's quoted weeks; staff recorded a later stage on the batch's row with PSA's words.

**Steps:**

1. Open `<submission page>`.
2. As staff, click Re-estimate on the batch's row, pick the stage, enter a date a week ahead and a reason, and confirm.
3. Reload the page, and open `<collector inbox>`.

**Expected Results:**

* Step 1 shows the stage in PSA's own words and the estimate counted from the ship day; the chip reads Running late naming PSA, the word still With the grader, and nothing to do.
* Step 3 shows the new date with no Running late; a running-late email names it, sent that day.

<!-- trace:case id=g10.grading-submission-lifecycle.TC-4r2 rev=1 covers=g10.grading-submission-lifecycle.SC-8dw,g10.grading-submission-lifecycle.SC-xwm,g10.grading-submission-lifecycle.SC-1rg,g10.grading-submission-lifecycle.SC-3gk,g10.grading-submission-lifecycle.SC-05o,g10.grading-submission-lifecycle.SC-ge7,g10.grading-submission-lifecycle.SC-17s,g10.grading-submission-lifecycle.SC-k5p,g10.grading-submission-lifecycle.SC-kui,g10.grading-submission-lifecycle.SC-fda,g10.grading-submission-lifecycle.SC-s5n,g10.grading-submission-lifecycle.SC-mp1,g10.grading-submission-lifecycle.SC-mcw,g10.grading-submission-lifecycle.SC-ejt,g10.grading-submission-lifecycle.SC-sip -->
### g10.grading-submission-lifecycle.US1-TC5: A reader holding neither the collector's session nor the link reads not found

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-01

**Pre-conditions:**

* A submission is handed in under collector A's email; `<reader>`.

**Test data:**

| `<reader>` | `<opens>` |
| --- | --- |
| a signed-out reader | the submission's address without the link's token |
| collector B, signed in under another email | the same address |
| anyone | the address of an id the shop never issued |

**Steps:**

1. Open `<opens>`.

**Expected Results:**

* The site's not-found page shows, saying nothing of whether the submission exists, with no card, name or pickup code.

<!-- trace:case id=g10.grading-submission-lifecycle.TC-6rh rev=1 covers=g10.grading-submission-lifecycle.SC-8dw,g10.grading-submission-lifecycle.SC-xwm,g10.grading-submission-lifecycle.SC-1rg,g10.grading-submission-lifecycle.SC-3gk,g10.grading-submission-lifecycle.SC-05o,g10.grading-submission-lifecycle.SC-ge7,g10.grading-submission-lifecycle.SC-17s,g10.grading-submission-lifecycle.SC-k5p,g10.grading-submission-lifecycle.SC-kui,g10.grading-submission-lifecycle.SC-fda,g10.grading-submission-lifecycle.SC-s5n,g10.grading-submission-lifecycle.SC-mp1,g10.grading-submission-lifecycle.SC-mcw,g10.grading-submission-lifecycle.SC-ejt,g10.grading-submission-lifecycle.SC-sip -->
### g10.grading-submission-lifecycle.US1-TC8: A plan kept signed out opens its own page on the link it was kept with

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-01

**Pre-conditions:**

* A signed-out collector is at the wizard's review, `<collector inbox>` given and a level picked.

**Test data:**

| `<kept by>` |
| --- |
| Book the drop-off, the statement ticked |
| Save and book later, the statement unticked |

**Steps:**

1. Keep the plan by `<kept by>`.
2. Open its emailed link in a browser that never signed in.

**Expected Results:**

* Both open the same submission page, with no sign-in and no not-found page.

<!-- trace:case id=g10.grading-submission-lifecycle.TC-0kg rev=1 covers=g10.grading-submission-lifecycle.SC-8dw,g10.grading-submission-lifecycle.SC-xwm,g10.grading-submission-lifecycle.SC-1rg,g10.grading-submission-lifecycle.SC-3gk,g10.grading-submission-lifecycle.SC-05o,g10.grading-submission-lifecycle.SC-ge7,g10.grading-submission-lifecycle.SC-17s,g10.grading-submission-lifecycle.SC-k5p,g10.grading-submission-lifecycle.SC-kui,g10.grading-submission-lifecycle.SC-fda,g10.grading-submission-lifecycle.SC-s5n,g10.grading-submission-lifecycle.SC-mp1,g10.grading-submission-lifecycle.SC-mcw,g10.grading-submission-lifecycle.SC-ejt,g10.grading-submission-lifecycle.SC-sip -->
### g10.grading-submission-lifecycle.US1-TC9: One card's outcome is one line on that card, and the status stays

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-lifecycle-US-01

**Pre-conditions:**

* A collector's four-card submission is ready to collect, one card recorded returned ungraded at receiving.

**Steps:**

1. Open `<submission page>`, and read the word and each card.

**Expected Results:**

* It still reads Ready to collect; the ungraded return shows on that card alone.

<!-- trace:case id=g10.grading-submission-lifecycle.TC-otz rev=1 covers=g10.grading-submission-lifecycle.SC-8dw,g10.grading-submission-lifecycle.SC-xwm,g10.grading-submission-lifecycle.SC-1rg,g10.grading-submission-lifecycle.SC-3gk,g10.grading-submission-lifecycle.SC-05o,g10.grading-submission-lifecycle.SC-ge7,g10.grading-submission-lifecycle.SC-17s,g10.grading-submission-lifecycle.SC-k5p,g10.grading-submission-lifecycle.SC-kui,g10.grading-submission-lifecycle.SC-fda,g10.grading-submission-lifecycle.SC-s5n,g10.grading-submission-lifecycle.SC-mp1,g10.grading-submission-lifecycle.SC-mcw,g10.grading-submission-lifecycle.SC-ejt,g10.grading-submission-lifecycle.SC-sip -->
### g10.grading-submission-lifecycle.US1-TC10: A card refused after payment has its fee and cover back

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-lifecycle-US-01

**Pre-conditions:**

* At the counter, a collector's PSA Express submission has every card ticked Present, the agreement sealed and the fee paid; staff is on the hand-in runbook.

**Steps:**

1. Click Refuse on the first card, pick a reason, type Surface scratch the grader will not take, and click Refuse this card.
2. Read the till's lines, and open `<submission page>`.

**Expected Results:**

* The card's fee and cover come back at the till; the page names the refund and the refusal it came back for.

---

## g10.grading-submission-lifecycle.US2: Collector asks for a card back before the batch closes

**As a** collector who changed my mind after hand-in,
**I want** to message the shop before Thursday 19:00 and collect the card at the counter against a receipt, with its fee back at the till the way I paid and the page saying what came back and why,
**so that** a card I want to keep does not leave with the batch.

<!-- trace:case id=g10.grading-submission-lifecycle.TC-48y rev=1 covers=g10.grading-submission-lifecycle.SC-szy,g10.grading-submission-lifecycle.SC-fln,g10.grading-submission-lifecycle.SC-5ig,g10.grading-submission-lifecycle.SC-ie0 -->
### g10.grading-submission-lifecycle.US2-TC1: A card withdrawn before the batch closes comes back with its fee and cover, the rest going on

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-lifecycle-US-02

**Pre-conditions:**

* A collector's four-card submission at PSA Express was handed in before Thursday 19:00, its fee paid by card at the till.

**Steps:**

1. As staff, click Withdraw a card on the first card's Cards tab, and hand it back at the counter against the receipt.
2. Open `<submission page>`, and read each card.

**Expected Results:**

* The fee and cover come back at the till by card, the way they were paid.
* The withdrawn card reads Withdrawn with its refund lines; the other three still read Handed in, unchanged.

<!-- trace:case id=g10.grading-submission-lifecycle.TC-lsq rev=1 covers=g10.grading-submission-lifecycle.SC-szy,g10.grading-submission-lifecycle.SC-fln,g10.grading-submission-lifecycle.SC-5ig,g10.grading-submission-lifecycle.SC-ie0 -->
### g10.grading-submission-lifecycle.US2-TC2: A closed batch takes the withdrawal away

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-lifecycle-US-02

**Pre-conditions:**

* A collector's handed-in submission was open in a second tab before its batch closed at the cut-off.

**Steps:**

1. Open `<submission page>`, and read each card.
2. In the second tab, ask to withdraw a card.

**Expected Results:**

* Step 1 offers no withdrawal on any card.
* Step 2 is refused by name; no card is withdrawn.

<!-- trace:case id=g10.grading-submission-lifecycle.TC-k8d rev=1 covers=g10.grading-submission-lifecycle.SC-szy,g10.grading-submission-lifecycle.SC-fln,g10.grading-submission-lifecycle.SC-5ig,g10.grading-submission-lifecycle.SC-ie0 -->
### g10.grading-submission-lifecycle.US2-TC4: The last withdrawal cancels the submission, and the collector is told

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-lifecycle-US-02

**Pre-conditions:**

* A collector's two-card submission was handed in before the cut-off, one card already withdrawn.

**Steps:**

1. As staff, withdraw the second card, confirming the refund and the receipt, and hand it back.
2. Open `<submission page>` and `<collector inbox>`.

**Expected Results:**

* Both cards read Withdrawn with their refunds; the submission reads Cancelled, the rail ended where it stood, saying what came back and why.
* An email tells the collector it is cancelled.

---

## g10.grading-submission-lifecycle.US3: Collector learns why a card came back ungraded

**As a** collector whose card came back raw,
**I want** the grader's code and note on the card, a plain line saying the fee stands, and that the grade is the grader's decision with a review being a new submission at the grader's review fee,
**so that** I know what the grader found, that I was told before I booked, and where to ask rather than argue with the shop.

<!-- trace:case id=g10.grading-submission-lifecycle.TC-77a rev=1 covers=g10.grading-submission-lifecycle.SC-hct,g10.grading-submission-lifecycle.SC-6hk,g10.grading-submission-lifecycle.SC-l1l,g10.grading-submission-lifecycle.SC-92h -->
### g10.grading-submission-lifecycle.US3-TC1: An ungraded card carries the grader's code and note, the fee standing, and a review is a new submission

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-lifecycle-US-03

**Pre-conditions:**

* A collector's submission has its grades in, one card recorded returned ungraded with PSA's code N1 and note.

**Steps:**

1. Open `<submission page>`, and read the card and About the grades beside it.

**Expected Results:**

* The card shows Ungraded with N1 and the note, says the fee stands, and offers no refund.
* About the grades says the grade is the grader's decision, and a review is a new submission at the grader's review fee, asked for at the counter; nothing offers to reopen the grade.

<!-- trace:case id=g10.grading-submission-lifecycle.TC-eki rev=1 covers=g10.grading-submission-lifecycle.SC-hct,g10.grading-submission-lifecycle.SC-6hk,g10.grading-submission-lifecycle.SC-l1l,g10.grading-submission-lifecycle.SC-92h -->
### g10.grading-submission-lifecycle.US3-TC2: A card graded below its minimum comes back raw, the fee standing

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-lifecycle-US-03

**Pre-conditions:**

* A card listed with a minimum of PSA 9 graded PSA 8, recorded when the grades were recorded.

**Steps:**

1. Open `<submission page>`, and read that card.

**Expected Results:**

* It reads Minimum grade not met, raw, and says the fee stands.

---

## g10.grading-submission-lifecycle.US4: Collector learns the upcharge the day the grades post

**As a** collector whose card came back worth more than the level allows,
**I want** the difference the fee sheet quoted me named on the grades email and on the page as due at the counter before collection,
**so that** I know what to settle before I come in and it is the figure I was warned of.

<!-- trace:case id=g10.grading-submission-lifecycle.TC-8yu rev=1 covers=g10.grading-submission-lifecycle.SC-iwf,g10.grading-submission-lifecycle.SC-7ku -->
### g10.grading-submission-lifecycle.US4-TC1: A card moved up a level names the quoted difference as due, on the page and in the email

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-lifecycle-US-04

**Pre-conditions:**

* A collector's four-card submission has its grades in, one card moved up a level, the sheet's difference HKD 600.00.

**Steps:**

1. Open `<submission page>`, and read the cards and the money.
2. Open the grades email.

**Expected Results:**

* That card reads Moved up a level with the money it changes, the other three no such line; HKD 600.00 is due at the counter before collection, as the review quoted at booking.
* The email names the same difference, sent the day the grades were recorded.

<!-- trace:case id=g10.grading-submission-lifecycle.TC-68o rev=1 covers=g10.grading-submission-lifecycle.SC-iwf,g10.grading-submission-lifecycle.SC-7ku -->
### g10.grading-submission-lifecycle.US4-TC2: No card moved up shows no upcharge

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-lifecycle-US-04

**Pre-conditions:**

* A collector's submission has its grades in, every card at or under its booked level.

**Steps:**

1. Read the cards and the money on `<submission page>`.

**Expected Results:**

* No card reads Moved up a level, and no figure is due at the counter.

<!-- trace:case id=g10.grading-submission-lifecycle.TC-r86 rev=1 covers=g10.grading-submission-lifecycle.SC-iwf,g10.grading-submission-lifecycle.SC-7ku -->
### g10.grading-submission-lifecycle.US4-TC3: The pinned sheet's difference is the figure charged, whatever the grader invoices

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-lifecycle-US-04

**Pre-conditions:**

* A batch is back, one card moved up a level, the submission's pinned sheet putting HKD 600.00 between the two levels; staff is on its Receive page.

**Steps:**

1. Enter the manifest, and the invoice with USD 90.00 on that card's line; scan every cert and click Finish receiving.
2. Read the money on `<submission page>`.

**Expected Results:**

* The collector owes HKD 600.00 for the upcharge.

---

## g10.grading-submission-lifecycle.US5: Collector is paid out for a card that did not come back

**As a** collector whose card was lost or damaged in the grader's hands or in transit,
**I want** to be told the same day, paid out at the card's declared value with its fee refunded inside the payout window, at the till or by transfer, and the payout reversed on its record if the card turns up,
**so that** I never wait on the shop's claim against the grader or the courier.

<!-- trace:case id=g10.grading-submission-lifecycle.TC-8n3 rev=1 covers=g10.grading-submission-lifecycle.SC-5vp,g10.grading-submission-lifecycle.SC-7qs,g10.grading-submission-lifecycle.SC-hmg,g10.grading-submission-lifecycle.SC-1ve -->
### g10.grading-submission-lifecycle.US5-TC1: A lost card is paid out at its declared value with its fee back, the rest ready

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-05

**Pre-conditions:**

* A four-card submission's batch was received, one card declared HKD 5,000.00 recorded Not returned; inside 14 days, it was paid out from the Money tab `<route>`, approved by a second holder.

**Test data:**

| `<route>` |
| --- |
| at the till |
| by bank transfer |

**Steps:**

1. Open `<submission page>`, and read that card and the money.

**Expected Results:**

* It reads Ready to collect, the other three collectable; the card reads Not returned with its payout.
* HKD 5,000.00 is paid out `<route>`, with its fee refunded beside it, the cover kept, and its reference.

<!-- trace:case id=g10.grading-submission-lifecycle.TC-akz rev=1 covers=g10.grading-submission-lifecycle.SC-5vp,g10.grading-submission-lifecycle.SC-7qs,g10.grading-submission-lifecycle.SC-hmg,g10.grading-submission-lifecycle.SC-1ve -->
### g10.grading-submission-lifecycle.US5-TC4: A damaged card is told the same day, with its payout

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-lifecycle-US-05

**Pre-conditions:**

* A collector's card is in a batch being received; staff is on its Receive page.

**Steps:**

1. Photograph the slab in the box, and record it Damaged before its cert is scanned.
2. Open `<collector inbox>` the same day.

**Expected Results:**

* The collector is told that day the card came back damaged, with the payout it owes.

<!-- trace:case id=g10.grading-submission-lifecycle.TC-lwr rev=1 covers=g10.grading-submission-lifecycle.SC-5vp,g10.grading-submission-lifecycle.SC-7qs,g10.grading-submission-lifecycle.SC-hmg,g10.grading-submission-lifecycle.SC-1ve -->
### g10.grading-submission-lifecycle.US5-TC3: A card that turns up reverses its payout and is repaid before it goes home

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-lifecycle-US-05

**Pre-conditions:**

* A card paid out at HKD 8,000.00 as Not returned, its HKD 600.00 fee refunded, has turned up; staff reversed the payout on the Money tab.

**Steps:**

1. Open `<submission page>`, and read the card, the money and the pickup card.

**Expected Results:**

* The card is back on the submission with its outcome and the reversal, on the same record as the payout.
* HKD 8,600.00 reads due to repay at the counter, the card collectable only once it is paid.

---

## g10.grading-submission-lifecycle.US6: Collector reads the pickup card when the cards are ready

**As a** collector whose cards are ready,
**I want** a four-digit code on the page and in the email, the shop's hours with no booking needed, what is due, and whether to bring an ID,
**so that** I walk in and leave with the slabs on one visit.

<!-- trace:case id=g10.grading-submission-lifecycle.TC-yi1 rev=1 covers=g10.grading-submission-lifecycle.SC-47a,g10.grading-submission-lifecycle.SC-70x,g10.grading-submission-lifecycle.SC-6wa,g10.grading-submission-lifecycle.SC-l1n,g10.grading-submission-lifecycle.SC-g8q,g10.grading-submission-lifecycle.SC-qjj,g10.grading-submission-lifecycle.SC-3it -->
### g10.grading-submission-lifecycle.US6-TC1: The pickup card carries the code, the hours and one figure to settle

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-06

**Pre-conditions:**

* A collector's four-card submission is ready to collect with `<owed>`.

**Test data:**

| `<owed>` | `<to settle>` |
| --- | --- |
| no upcharge and no storage | nothing due |
| an upcharge of HKD 600.00 and HKD 120.00 of storage | HKD 720.00, one figure |

**Steps:**

1. Open `<submission page>`, and read the pickup card.
2. Open the ready email.

**Expected Results:**

* Step 1 shows a four-digit code, the shop's hours, that no booking is needed, and To settle reading `<to settle>`.
* Step 2 carries the same code.

<!-- trace:case id=g10.grading-submission-lifecycle.TC-g95 rev=1 covers=g10.grading-submission-lifecycle.SC-47a,g10.grading-submission-lifecycle.SC-70x,g10.grading-submission-lifecycle.SC-6wa,g10.grading-submission-lifecycle.SC-l1n,g10.grading-submission-lifecycle.SC-g8q,g10.grading-submission-lifecycle.SC-qjj,g10.grading-submission-lifecycle.SC-3it -->
### g10.grading-submission-lifecycle.US6-TC2: Above the threshold an ID matching the name is asked for, and nothing is kept

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-06

**Pre-conditions:**

* A collector's ready submission declares `<declared>` in total.

**Test data:**

| `<declared>` |
| --- |
| HKD 10,001.00 |
| HKD 15,000.00 |

**Steps:**

1. Read the pickup card's Bring line.
2. As staff, enter the pickup code and the collector's name on the hand-back runbook.

**Expected Results:**

* Step 1 asks for an ID matching the collector's name.
* Step 2 shows the ID line; nothing from the ID is kept on the submission.

<!-- trace:case id=g10.grading-submission-lifecycle.TC-za4 rev=1 covers=g10.grading-submission-lifecycle.SC-47a,g10.grading-submission-lifecycle.SC-70x,g10.grading-submission-lifecycle.SC-6wa,g10.grading-submission-lifecycle.SC-l1n,g10.grading-submission-lifecycle.SC-g8q,g10.grading-submission-lifecycle.SC-qjj,g10.grading-submission-lifecycle.SC-3it -->
### g10.grading-submission-lifecycle.US6-TC3: At or below the threshold the code and the name release the cards, no ID asked

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-06

**Pre-conditions:**

* A collector's ready submission declares `<declared>` in total.

**Test data:**

| `<declared>` |
| --- |
| HKD 10,000.00, exactly the threshold |
| HKD 9,999.00 |
| HKD 4,000.00 |

**Steps:**

1. Read the pickup card's Bring line.
2. As staff, enter the pickup code and the collector's name on the hand-back runbook.

**Expected Results:**

* Step 1 asks to bring nothing.
* Step 2 shows no ID line; the code and the name release the cards.

<!-- trace:case id=g10.grading-submission-lifecycle.TC-bse rev=1 covers=g10.grading-submission-lifecycle.SC-47a,g10.grading-submission-lifecycle.SC-70x,g10.grading-submission-lifecycle.SC-6wa,g10.grading-submission-lifecycle.SC-l1n,g10.grading-submission-lifecycle.SC-g8q,g10.grading-submission-lifecycle.SC-qjj,g10.grading-submission-lifecycle.SC-3it -->
### g10.grading-submission-lifecycle.US6-TC5: Nothing is handed back while an upcharge is unsettled

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-lifecycle-US-06

**Pre-conditions:**

* A collector's ready submission has an unsettled upcharge; they are at the counter with the code.

**Steps:**

1. As staff, enter the code and the name, tick Handed over on every item, and read the Sign step and Hand over without taking payment.

**Expected Results:**

* The hand-back is refused by name until the figure is settled at the counter.

<!-- trace:case id=g10.grading-submission-lifecycle.TC-rkr rev=1 covers=g10.grading-submission-lifecycle.SC-47a,g10.grading-submission-lifecycle.SC-70x,g10.grading-submission-lifecycle.SC-6wa,g10.grading-submission-lifecycle.SC-l1n,g10.grading-submission-lifecycle.SC-g8q,g10.grading-submission-lifecycle.SC-qjj,g10.grading-submission-lifecycle.SC-3it -->
### g10.grading-submission-lifecycle.US6-TC6: A slab left at the counter becomes a vault case, out of the storage count

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-lifecycle-US-06

**Pre-conditions:**

* A collector's four-slab submission has been ready 100 days; staff entered the code and the name and settled the balance.

**Steps:**

1. Click Vault instead on the first slab and open its vault case with the collector; tick Handed over on the other three, and have the receipt signed.
2. Open `<submission page>`.

**Expected Results:**

* The receipt says that card went to the vault.
* The card reads Vaulted, linking its case, and is not counted for storage.

<!-- trace:case id=g10.grading-submission-lifecycle.TC-34a rev=1 covers=g10.grading-submission-lifecycle.SC-47a,g10.grading-submission-lifecycle.SC-70x,g10.grading-submission-lifecycle.SC-6wa,g10.grading-submission-lifecycle.SC-l1n,g10.grading-submission-lifecycle.SC-g8q,g10.grading-submission-lifecycle.SC-qjj,g10.grading-submission-lifecycle.SC-3it -->
### g10.grading-submission-lifecycle.US6-TC7: A vault reference that matches no case reads as plain text until a case holds it

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-lifecycle-US-06

**Pre-conditions:**

* A signed-in collector's collected submission holds a card vaulted under a reference no vault case holds.

**Steps:**

1. Open `<submission page>`.
2. Open a vault case under that reference, and open the page again.

**Expected Results:**

* Step 1 reads Vaulted with the reference as plain text and no link.
* Step 2 links the case.

---

## g10.grading-submission-lifecycle.US7: Collector names somebody else to collect

**As a** collector who cannot come in,
**I want** to name one person by their full name on the page before they come, change or remove them any time before collection, and see it logged in History,
**so that** they collect with the code and the ID the pickup card asks for, and nobody else can.

<!-- trace:case id=g10.grading-submission-lifecycle.TC-ptg rev=1 covers=g10.grading-submission-lifecycle.SC-a1i,g10.grading-submission-lifecycle.SC-w2k,g10.grading-submission-lifecycle.SC-0xf,g10.grading-submission-lifecycle.SC-qjs,g10.grading-submission-lifecycle.SC-bpr,g10.grading-submission-lifecycle.SC-9u0 -->
### g10.grading-submission-lifecycle.US7-TC1: Naming, changing and removing who collects is logged, sends nothing, and the counter reads it

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-lifecycle-US-07

**Pre-conditions:**

* A collector's submission is ready to collect with nobody named.

**Steps:**

1. Enter Chan Tai Man in Their name, and click Save.
2. Click Change, enter Wong Siu Ming, and click Save; as staff, read who may collect on the hand-back runbook.
3. Click Remove; as staff, read who may collect again.
4. Read History, and `<collector inbox>`.

**Expected Results:**

* Step 1's Named card shows Chan Tai Man with Change and Remove.
* Step 2 shows Wong Siu Ming alone, on the page and the runbook.
* Step 3 returns the page to the field and Save, the runbook reading nobody named.
* Step 4 logs the naming, the change and the removal, each at its time; no email was sent for any.

<!-- trace:case id=g10.grading-submission-lifecycle.TC-asl rev=1 covers=g10.grading-submission-lifecycle.SC-a1i,g10.grading-submission-lifecycle.SC-w2k,g10.grading-submission-lifecycle.SC-0xf,g10.grading-submission-lifecycle.SC-qjs,g10.grading-submission-lifecycle.SC-bpr,g10.grading-submission-lifecycle.SC-9u0 -->
### g10.grading-submission-lifecycle.US7-TC2: An empty name names nobody

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-lifecycle-US-07

**Pre-conditions:**

* A collector's submission is ready to collect with nobody named.

**Steps:**

1. Leave Their name empty, and read Save.

**Expected Results:**

* Save stays disabled; nobody is named.

<!-- trace:case id=g10.grading-submission-lifecycle.TC-moj rev=1 covers=g10.grading-submission-lifecycle.SC-a1i,g10.grading-submission-lifecycle.SC-w2k,g10.grading-submission-lifecycle.SC-0xf,g10.grading-submission-lifecycle.SC-qjs,g10.grading-submission-lifecycle.SC-bpr,g10.grading-submission-lifecycle.SC-9u0 -->
### g10.grading-submission-lifecycle.US7-TC5: Naming is refused once the cards are collected

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-lifecycle-US-07

**Pre-conditions:**

* A collector loaded a ready submission in a second tab before the hand-back; the cards have since been collected.

**Steps:**

1. Open `<submission page>` afresh, and look for the naming.
2. In the second tab, type a name and click Save.

**Expected Results:**

* Step 1 shows no naming field.
* Step 2 is refused by name as already collected, keeping what was typed.

<!-- trace:case id=g10.grading-submission-lifecycle.TC-p8x rev=1 covers=g10.grading-submission-lifecycle.SC-a1i,g10.grading-submission-lifecycle.SC-w2k,g10.grading-submission-lifecycle.SC-0xf,g10.grading-submission-lifecycle.SC-qjs,g10.grading-submission-lifecycle.SC-bpr,g10.grading-submission-lifecycle.SC-9u0 -->
### g10.grading-submission-lifecycle.US7-TC6: Anybody else is turned away, and staff have no way to release to them

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-lifecycle-US-07

**Pre-conditions:**

* A collector's submission is ready with nobody named; Lee Ka Yan, neither the collector nor named, is at the counter with the code.

**Steps:**

1. As staff, enter the code and Lee Ka Yan as who is collecting, and look for any way to release the cards.

**Expected Results:**

* The cards are not released, and the runbook offers no way to release them.

---

## g10.grading-submission-lifecycle.US8: Collector who leaves the cards is reminded, charged and then given notice

**As a** collector who has not collected,
**I want** a reminder at 30 and 60 days costing nothing, the storage fee accruing per card and per month from day 90 and due before collection, and the written notice posted from day 180 giving me the notice period pinned at signing (90 days) from its posting, with the cards mine throughout,
**so that** I am nudged, never surprised, and can still vault them instead.

<!-- trace:case id=g10.grading-submission-lifecycle.TC-hs5 rev=1 covers=g10.grading-submission-lifecycle.SC-ud7,g10.grading-submission-lifecycle.SC-9ig,g10.grading-submission-lifecycle.SC-tlh,g10.grading-submission-lifecycle.SC-opz,g10.grading-submission-lifecycle.SC-det,g10.grading-submission-lifecycle.SC-duo,g10.grading-submission-lifecycle.SC-x12,g10.grading-submission-lifecycle.SC-jli,g10.grading-submission-lifecycle.SC-5ht,g10.grading-submission-lifecycle.SC-vez,g10.grading-submission-lifecycle.SC-7wl -->
### g10.grading-submission-lifecycle.US8-TC1: The ladder counts its rungs from the ready day, the reminders costing nothing

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-08

**Pre-conditions:**

* A collector's submission has been ready `<days>` days.

**Test data:**

| `<days>` | `<passed>` |
| --- | --- |
| 29 | no rung |
| 30 | the first reminder |
| 60 | the second reminder |

**Steps:**

1. Read the uncollected ladder on `<submission page>`.

**Expected Results:**

* `<passed>` reads passed and none after it, each rung with the day it falls counted from the ready day, and nothing charged.

<!-- trace:case id=g10.grading-submission-lifecycle.TC-5hz rev=1 covers=g10.grading-submission-lifecycle.SC-ud7,g10.grading-submission-lifecycle.SC-9ig,g10.grading-submission-lifecycle.SC-tlh,g10.grading-submission-lifecycle.SC-opz,g10.grading-submission-lifecycle.SC-det,g10.grading-submission-lifecycle.SC-duo,g10.grading-submission-lifecycle.SC-x12,g10.grading-submission-lifecycle.SC-jli,g10.grading-submission-lifecycle.SC-5ht,g10.grading-submission-lifecycle.SC-vez,g10.grading-submission-lifecycle.SC-7wl -->
### g10.grading-submission-lifecycle.US8-TC12: A rung falls on the shop's day

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-lifecycle-US-08

**Pre-conditions:**

* A submission became ready at 23:30 on 1 January on the shop's clock.

**Steps:**

1. Read the ladder.

**Expected Results:**

* The first reminder falls on 31 January.

<!-- trace:case id=g10.grading-submission-lifecycle.TC-cf8 rev=1 covers=g10.grading-submission-lifecycle.SC-ud7,g10.grading-submission-lifecycle.SC-9ig,g10.grading-submission-lifecycle.SC-tlh,g10.grading-submission-lifecycle.SC-opz,g10.grading-submission-lifecycle.SC-det,g10.grading-submission-lifecycle.SC-duo,g10.grading-submission-lifecycle.SC-x12,g10.grading-submission-lifecycle.SC-jli,g10.grading-submission-lifecycle.SC-5ht,g10.grading-submission-lifecycle.SC-vez,g10.grading-submission-lifecycle.SC-7wl -->
### g10.grading-submission-lifecycle.US8-TC8: The sweep emails each rung the day it falls

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-08

**Pre-conditions:**

* After 09:00 on the shop's clock, a collector's four-card submission has been ready `<days>` days.

**Test data:**

| `<days>` | `<email names>` |
| --- | --- |
| 30 | a reminder naming the pickup code, what is due, the storage day and the notice day, saying the reminder adds nothing |
| 60 | the same, as the second reminder |
| 90 | the storage fee for each card for each month, what is due now and the notice day |

**Steps:**

1. Run the sweep, and open `<collector inbox>`.

**Expected Results:**

* The latest email is `<email names>`.

<!-- trace:case id=g10.grading-submission-lifecycle.TC-11a rev=1 covers=g10.grading-submission-lifecycle.SC-ud7,g10.grading-submission-lifecycle.SC-9ig,g10.grading-submission-lifecycle.SC-tlh,g10.grading-submission-lifecycle.SC-opz,g10.grading-submission-lifecycle.SC-det,g10.grading-submission-lifecycle.SC-duo,g10.grading-submission-lifecycle.SC-x12,g10.grading-submission-lifecycle.SC-jli,g10.grading-submission-lifecycle.SC-5ht,g10.grading-submission-lifecycle.SC-vez,g10.grading-submission-lifecycle.SC-7wl -->
### g10.grading-submission-lifecycle.US8-TC2: Storage counts each card still held, each month started from the day storage began

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-08

**Pre-conditions:**

* `<submission>`.

**Test data:**

| `<submission>` | `<storage>` |
| --- | --- |
| four cards ready 95 days | HKD 120.00, one month started for each, on the ladder and the money |
| four cards ready 100 days, one vaulted and one paid out | HKD 60.00, for the two still held |
| one card ready 1 January, read 1 May | HKD 60.00, two months started from 1 April |
| ready 1 January, one card held by the grader and back on 1 March, read 15 April | HKD 30.00, for the card at the shop since 1 January, none yet for the held one |

**Steps:**

1. Read the ladder and what is due on `<submission page>`.

**Expected Results:**

* Storage reads `<storage>`.

<!-- trace:case id=g10.grading-submission-lifecycle.TC-v0r rev=1 covers=g10.grading-submission-lifecycle.SC-ud7,g10.grading-submission-lifecycle.SC-9ig,g10.grading-submission-lifecycle.SC-tlh,g10.grading-submission-lifecycle.SC-opz,g10.grading-submission-lifecycle.SC-det,g10.grading-submission-lifecycle.SC-duo,g10.grading-submission-lifecycle.SC-x12,g10.grading-submission-lifecycle.SC-jli,g10.grading-submission-lifecycle.SC-5ht,g10.grading-submission-lifecycle.SC-vez,g10.grading-submission-lifecycle.SC-7wl -->
### g10.grading-submission-lifecycle.US8-TC6: Naming a collector or booking a visit does not pause the ladder

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-lifecycle-US-08

**Pre-conditions:**

* A four-card submission has been ready 95 days; a person is named, and a Grading visit is booked under the collector's email.

**Steps:**

1. Read the ladder and the storage on `<submission page>`.

**Expected Results:**

* The rungs still count from the ready day with storage passed, HKD 120.00 accruing; nothing reads paused or waiting on the visit.

<!-- trace:case id=g10.grading-submission-lifecycle.TC-ogb rev=1 covers=g10.grading-submission-lifecycle.SC-ud7,g10.grading-submission-lifecycle.SC-9ig,g10.grading-submission-lifecycle.SC-tlh,g10.grading-submission-lifecycle.SC-opz,g10.grading-submission-lifecycle.SC-det,g10.grading-submission-lifecycle.SC-duo,g10.grading-submission-lifecycle.SC-x12,g10.grading-submission-lifecycle.SC-jli,g10.grading-submission-lifecycle.SC-5ht,g10.grading-submission-lifecycle.SC-vez,g10.grading-submission-lifecycle.SC-7wl -->
### g10.grading-submission-lifecycle.US8-TC7: Storage is taken at the till, a line per card, before anything is handed back

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-lifecycle-US-08

**Pre-conditions:**

* A four-card submission has been ready 100 days, HKD 120.00 of storage accrued; staff entered the code and the name.

**Steps:**

1. Read the Settle step and Hand over.
2. Click Take payment, and read the till's lines.

**Expected Results:**

* Step 1 hands nothing over yet.
* Step 2 takes the storage to that day, one line per card held.

<!-- trace:case id=g10.grading-submission-lifecycle.TC-ly7 rev=1 covers=g10.grading-submission-lifecycle.SC-ud7,g10.grading-submission-lifecycle.SC-9ig,g10.grading-submission-lifecycle.SC-tlh,g10.grading-submission-lifecycle.SC-opz,g10.grading-submission-lifecycle.SC-det,g10.grading-submission-lifecycle.SC-duo,g10.grading-submission-lifecycle.SC-x12,g10.grading-submission-lifecycle.SC-jli,g10.grading-submission-lifecycle.SC-5ht,g10.grading-submission-lifecycle.SC-vez,g10.grading-submission-lifecycle.SC-7wl -->
### g10.grading-submission-lifecycle.US8-TC10: The written notice is emailed the day it is posted

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-lifecycle-US-08

**Pre-conditions:**

* A submission ready 181 days reads Notice due; staff is on its page.

**Steps:**

1. Click Post the notice, enter today and RR123456789HK, and click Record.
2. Open `<collector inbox>`.

**Expected Results:**

* The notice arrives that day, naming what is due, the pickup code, the 90 days it gives from the posting date as pinned at signing, and the clause it acts under.

<!-- trace:case id=g10.grading-submission-lifecycle.TC-5qu rev=2 covers=g10.grading-submission-lifecycle.SC-ud7,g10.grading-submission-lifecycle.SC-9ig,g10.grading-submission-lifecycle.SC-tlh,g10.grading-submission-lifecycle.SC-opz,g10.grading-submission-lifecycle.SC-det,g10.grading-submission-lifecycle.SC-duo,g10.grading-submission-lifecycle.SC-x12,g10.grading-submission-lifecycle.SC-jli,g10.grading-submission-lifecycle.SC-5ht,g10.grading-submission-lifecycle.SC-vez,g10.grading-submission-lifecycle.SC-7wl -->
### g10.grading-submission-lifecycle.US8-TC3: The notice counts its pinned period from its posting date

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-lifecycle-US-08

**Pre-conditions:**

* A submission ready 185 days had its notice posted 3 days ago, recorded with its tracking.

**Steps:**

1. Read the ladder's notice rung.

**Expected Results:**

* It reads the posting date, and 87 days left of the 90, counted from that date.

<!-- trace:case id=g10.grading-submission-lifecycle.TC-lej rev=2 covers=g10.grading-submission-lifecycle.SC-ud7,g10.grading-submission-lifecycle.SC-9ig,g10.grading-submission-lifecycle.SC-tlh,g10.grading-submission-lifecycle.SC-opz,g10.grading-submission-lifecycle.SC-det,g10.grading-submission-lifecycle.SC-duo,g10.grading-submission-lifecycle.SC-x12,g10.grading-submission-lifecycle.SC-jli,g10.grading-submission-lifecycle.SC-5ht,g10.grading-submission-lifecycle.SC-vez,g10.grading-submission-lifecycle.SC-7wl -->
### g10.grading-submission-lifecycle.US8-TC4: Past the notice's days the cards are still the collector's

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-lifecycle-US-08

**Pre-conditions:**

* A submission's notice was posted 100 days ago.

**Steps:**

1. Read the word, the ladder and the money.

**Expected Results:**

* It reads Ready to collect, the cards named as the collector's, storage still accruing, and the vault offered instead; no rung or act past the notice shows.

<!-- trace:case id=g10.grading-submission-lifecycle.TC-eh9 rev=1 covers=g10.grading-submission-lifecycle.SC-ud7,g10.grading-submission-lifecycle.SC-9ig,g10.grading-submission-lifecycle.SC-tlh,g10.grading-submission-lifecycle.SC-opz,g10.grading-submission-lifecycle.SC-det,g10.grading-submission-lifecycle.SC-duo,g10.grading-submission-lifecycle.SC-x12,g10.grading-submission-lifecycle.SC-jli,g10.grading-submission-lifecycle.SC-5ht,g10.grading-submission-lifecycle.SC-vez,g10.grading-submission-lifecycle.SC-7wl -->
### g10.grading-submission-lifecycle.US8-TC11: Nothing is sent about the uncollected cards after the notice

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-lifecycle-US-08

**Pre-conditions:**

* After 09:00 on the shop's clock, a submission ready 220 days has its notice posted.

**Steps:**

1. Run the sweep, and open `<collector inbox>` within five minutes.

**Expected Results:**

* No further message about the uncollected cards arrives.

<!-- trace:case id=g10.grading-submission-lifecycle.TC-v3e rev=1 covers=g10.grading-submission-lifecycle.SC-ud7,g10.grading-submission-lifecycle.SC-9ig,g10.grading-submission-lifecycle.SC-tlh,g10.grading-submission-lifecycle.SC-opz,g10.grading-submission-lifecycle.SC-det,g10.grading-submission-lifecycle.SC-duo,g10.grading-submission-lifecycle.SC-x12,g10.grading-submission-lifecycle.SC-jli,g10.grading-submission-lifecycle.SC-5ht,g10.grading-submission-lifecycle.SC-vez,g10.grading-submission-lifecycle.SC-7wl -->
### g10.grading-submission-lifecycle.US8-TC13: A submission whose every card is paid out climbs no rung

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-lifecycle-US-08

**Pre-conditions:**

* A two-card submission ready 181 days ago had both cards recorded Not returned and paid out.

**Steps:**

1. Read `<submission page>`, and the emails to the collector.

**Expected Results:**

* It reads as ended, with no storage due and no notice owed; no reminder, storage or notice email was sent.

---

## g10.grading-submission-lifecycle.US9: Collector keeps the graded record after collection

**As a** collector who has collected,
**I want** the grade, grader and cert per slab with a look-up link, the slab photographs and the three documents with their fingerprints to stay on the page and under my account when I keep one,
**so that** a vault valuation or an auction reads the record from there and my slab never enters the shop's stock.

<!-- trace:case id=g10.grading-submission-lifecycle.TC-zk2 rev=1 covers=g10.grading-submission-lifecycle.SC-ko4,g10.grading-submission-lifecycle.SC-6ch,g10.grading-submission-lifecycle.SC-pry -->
### g10.grading-submission-lifecycle.US9-TC1: The collected record carries each slab's grade, cert and photograph, and the papers, under the account too

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-lifecycle-US-09

**Pre-conditions:**

* A collector's submission reads Back with you; they are signed in under its email.

**Steps:**

1. Open `<submission page>`, and read each slab and the documents.
2. Open the grading home, and read Your submissions.

**Expected Results:**

* Each slab shows its grade in PSA's words, PSA, its cert with a Look up link, and its hand-back photograph; the three documents show with their fingerprints and a download.
* Step 2 lists it with its word.

<!-- trace:case id=g10.grading-submission-lifecycle.TC-s38 rev=1 covers=g10.grading-submission-lifecycle.SC-ko4,g10.grading-submission-lifecycle.SC-6ch,g10.grading-submission-lifecycle.SC-pry -->
### g10.grading-submission-lifecycle.US9-TC3: A card the grader holds keeps the submission ready, and its return closes it with both receipts

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-lifecycle-US-09

**Pre-conditions:**

* A four-card submission has one card Held by the grader with PSA's expected date; the other three were handed back on a sealed receipt.

**Steps:**

1. Open `<submission page>`, and read the cards.
2. When the held card is back, as staff hand it over on a second signed receipt, and open the page.

**Expected Results:**

* Step 1 still reads Ready to collect: the three show their graded record, the held one Held by the grader with its expected date, the receipt naming it still out.
* Step 2 reads Back with you, the record carrying both hand-backs and both receipts.

---

## g10.grading-submission-lifecycle.US10: Collector cancels a submission before the visit starts

**As a** collector who no longer wants the cards graded,
**I want** to cancel the submission from the page until the visit starts and until the counter checks or refuses a card, with the drop-off going with it, and after that to have the counter refuse the cards instead,
**so that** nothing is left open in my name and nothing is owed.

<!-- trace:case id=g10.grading-submission-lifecycle.TC-ctj rev=1 covers=g10.grading-submission-lifecycle.SC-nev,g10.grading-submission-lifecycle.SC-bed,g10.grading-submission-lifecycle.SC-gh0,g10.grading-submission-lifecycle.SC-3jh,g10.grading-submission-lifecycle.SC-zwq -->
### g10.grading-submission-lifecycle.US10-TC1: Cancelling before hand-in closes the submission and its drop-off, nothing owed

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-10

**Pre-conditions:**

* A collector's submission stands at `<status>`.

**Test data:**

| `<status>` | `<rail ends at>` |
| --- | --- |
| Planned, no drop-off | Planned |
| Booked, a drop-off booked | Booked |

**Steps:**

1. Click Cancel this submission, then Go back.
2. Click it again, and confirm Yes, cancel.

**Expected Results:**

* Step 1 closes the dialog, the submission unchanged.
* Step 2 reads Cancelled, no chip, the rail ended at `<rail ends at>`, any drop-off closed with it, saying nothing was paid and nothing is owed.

<!-- trace:case id=g10.grading-submission-lifecycle.TC-zwr rev=1 covers=g10.grading-submission-lifecycle.SC-nev,g10.grading-submission-lifecycle.SC-bed,g10.grading-submission-lifecycle.SC-gh0,g10.grading-submission-lifecycle.SC-3jh,g10.grading-submission-lifecycle.SC-zwq -->
### g10.grading-submission-lifecycle.US10-TC2: Cancel is withheld once the cards are in or the visit's start time comes

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-lifecycle-US-10

**Pre-conditions:**

* A collector loaded a booked submission's page in a second tab before `<since>`.

**Test data:**

| `<since>` |
| --- |
| the cards were handed in |
| the visit's start time came, no card checked or refused |

**Steps:**

1. Open `<submission page>` afresh.
2. In the second tab, click Cancel this submission and confirm.

**Expected Results:**

* Step 1 offers no cancel.
* Step 2 is refused by name; the submission is not cancelled.

<!-- trace:case id=g10.grading-submission-lifecycle.TC-ckd rev=1 covers=g10.grading-submission-lifecycle.SC-nev,g10.grading-submission-lifecycle.SC-bed,g10.grading-submission-lifecycle.SC-gh0,g10.grading-submission-lifecycle.SC-3jh,g10.grading-submission-lifecycle.SC-zwq -->
### g10.grading-submission-lifecycle.US10-TC4: The last card refused at the counter cancels the submission, told at the counter

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-lifecycle-US-10

**Pre-conditions:**

* A collector's one-card submission was booked; at hand-in staff refused its card with a reason.

**Steps:**

1. Open `<submission page>`, and `<collector inbox>`.

**Expected Results:**

* The card reads Refused at the counter with the reason as typed, never charged; the submission reads Cancelled, the rail ended at Booked, nothing paid and nothing owed.
* No email was sent about it.

<!-- trace:case id=g10.grading-submission-lifecycle.TC-arv rev=1 covers=g10.grading-submission-lifecycle.SC-nev,g10.grading-submission-lifecycle.SC-bed,g10.grading-submission-lifecycle.SC-gh0,g10.grading-submission-lifecycle.SC-3jh,g10.grading-submission-lifecycle.SC-zwq -->
### g10.grading-submission-lifecycle.US10-TC6: A submission nobody books expires on its own

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-lifecycle-US-10

**Pre-conditions:**

* A collector's plan has stood 31 days with no drop-off.

**Steps:**

1. Run the sweep, and open `<submission page>`.

**Expected Results:**

* It is expired, the rail at Planned; nothing was paid, nothing is owed, and the cards were never handed in.

---

## g10.grading-submission-lifecycle.US11: Collector is offered only what the status allows

**As a** collector reading the page,
**I want** each status to offer only the acts it allows, editing the list before hand-in, withdrawing a card at Handed in, naming a collector when ready, and nothing while the grader has the cards,
**so that** I am never shown a button that will only be refused.

<!-- trace:case id=g10.grading-submission-lifecycle.TC-g1q rev=1 covers=g10.grading-submission-lifecycle.SC-5t2,g10.grading-submission-lifecycle.SC-kds,g10.grading-submission-lifecycle.SC-qt5,g10.grading-submission-lifecycle.SC-bfx,g10.grading-submission-lifecycle.SC-ikp,g10.grading-submission-lifecycle.SC-jx6 -->
### g10.grading-submission-lifecycle.US11-TC1: Each status offers its own acts and no others

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-11

**Pre-conditions:**

* A collector's submission stands at `<status>`.

**Test data:**

| `<status>` | `<acts>` |
| --- | --- |
| Planned | edit the list; book, move or cancel the drop-off; cancel the submission |
| Booked | edit the list; move or cancel the drop-off; cancel the submission |
| Handed in | withdraw a card |
| Sent, Graded or Back | none, saying there is nothing to do |
| Ready | name, change or remove a collector; collect; vault a slab |
| Collected | read the record; vault a slab; consign it to an auction; ask for erasure |

**Steps:**

1. Read every act on `<submission page>`.

**Expected Results:**

* It offers `<acts>`, and nothing else.

<!-- trace:case id=g10.grading-submission-lifecycle.TC-i3k rev=2 covers=g10.grading-submission-lifecycle.SC-5t2,g10.grading-submission-lifecycle.SC-kds,g10.grading-submission-lifecycle.SC-qt5,g10.grading-submission-lifecycle.SC-bfx,g10.grading-submission-lifecycle.SC-ikp,g10.grading-submission-lifecycle.SC-jx6 -->
### g10.grading-submission-lifecycle.US11-TC2: The counter owns the list from the first card it checks or refuses

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-submission-lifecycle-US-11

**Pre-conditions:**

* A collector loaded a two-card booked submission in a second tab; before the visit's start, staff started at the desk and `<counter>` the first card.

**Test data:**

| `<counter>` | `<first card reads>` |
| --- | --- |
| checked | as before, its note and photographs kept on its record |
| refused | Refused at the counter, with the reason as typed |

**Steps:**

1. Open `<submission page>` afresh.
2. In the second tab, add a card and save; then click Cancel this submission and confirm.
3. Reload the page.

**Expected Results:**

* Step 1 offers no edit of the list and no cancel.
* Step 2 refuses the save, saying the list is at the counter, and refuses the cancel by name.
* Step 3 shows both cards as before, the first reading `<first card reads>`.

<!-- trace:case id=g10.grading-submission-lifecycle.TC-bu5 rev=1 covers=g10.grading-submission-lifecycle.SC-5t2,g10.grading-submission-lifecycle.SC-kds,g10.grading-submission-lifecycle.SC-qt5,g10.grading-submission-lifecycle.SC-bfx,g10.grading-submission-lifecycle.SC-ikp,g10.grading-submission-lifecycle.SC-jx6 -->
### g10.grading-submission-lifecycle.US11-TC3: Editing a kept list saves the same submission and books nothing

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-11

**Pre-conditions:**

* A collector's three-card submission stands at `<status>`, the counter having touched none.

**Test data:**

| `<status>` | `<drop-off after>` |
| --- | --- |
| Planned | none |
| Booked | the same day and time |

**Steps:**

1. Click Edit the list, add a fourth card with a value, and save.
2. Open the collector's submissions on the grading home.

**Expected Results:**

* Step 1 opens the same submission, its id unchanged, listing four cards, its drop-off `<drop-off after>`.
* Step 2 lists one submission for it, not two.

<!-- trace:case id=g10.grading-submission-lifecycle.TC-rej rev=1 -->
### g10.grading-submission-lifecycle.US11-TC4: A cancelled submission offers nothing and refuses any move

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** The statuses

**Pre-conditions:**

* A collector loaded a booked submission's page in a second tab; the submission has since been cancelled.

**Steps:**

1. Open `<submission page>` afresh.
2. In the second tab, ask to edit the list and to cancel the submission.

**Expected Results:**

* Step 1 offers no act.
* Step 2 refuses each by name; the submission does not change.

## Settled

- A collected slab never entering the shop's catalogue is verified where the catalogue is, the store's catalogue suite, not on a grading screen.

## Reconciliation

### Manual

| Manual | Why |
| --- | --- |
| `g10.grading-submission-lifecycle.US2-TC1`, `g10.grading-submission-lifecycle.US2-TC4` | The card is pulled from the intake bag and its fee comes back at the till; a person runs the counter and the POS, and only the page's lines are scriptable |
| `g10.grading-submission-lifecycle.US5-TC1` | The payout is made at the till or by bank transfer by a person; the case walks the money as well as the lines the page draws |
| `g10.grading-submission-lifecycle.US6-TC2` | The ID glance happens at the counter and keeps nothing, so nothing but the page's Bring line is scriptable |
| `g10.grading-submission-lifecycle.US8-TC3` | The written notice is posted by registered post, and its posting date and tracking are typed in from the receipt |
| `g10.grading-submission-lifecycle.US10-TC4` | The refusal and the telling both happen at the counter, and the case asserts no message was sent for them |
| `g10.grading-submission-lifecycle.US1-TC10` | A person refuses the card at the counter after payment and reads the fee and cover lines come back at the till |
| `g10.grading-submission-lifecycle.US6-TC6` | A person opens the vault case with the collector at the counter and has the receipt signed on the iPad |
| `g10.grading-submission-lifecycle.US8-TC7` | The storage is taken at the POS, one line per card held, by a person at the till |
