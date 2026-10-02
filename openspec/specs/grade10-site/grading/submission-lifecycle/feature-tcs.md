# grade10-site/grading/submission-lifecycle Test Cases

**Status:** in-review
**Drafts styled:** 2026-09-29, tcs-rules r4

**Out of suite:**

- `grade10-site-grading-submission-lifecycle-SC-01` — the moves are made from the counter, and `grade10-admin/grading/counter`'s suite walks a move asked of a submission that has already moved
- `grade10-site-grading-submission-lifecycle-SC-45` — the store's catalogue suite: a collector's slab in no catalogue is an absence, checked where the catalogue is (`decisions.md` Q82); no grading screen shows it

## grade10-site-grading-submission-lifecycle-US1: Collector follows the submission from planned to home on one page

**As a** collector with cards in the shop's hands,
**I want** the page to read one status in my words, a chip saying whose move it is, a rail from Planned to Home, and while the cards are away the grader's stages in its own words, the estimate, and Running late with the new date once it is set,
**so that** I never have to ask the shop where my cards are, and waiting on the grader never reads as waiting on the shop.

### grade10-site-grading-submission-lifecycle-US1-TC1-1: Status word, move chip and rail step agree at every status

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
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-01

**Pre-conditions:**

* customer(collector) is on <grade10 grading submission page url> for a PSA submission at the status in the row: on the local stack, seeded at that status and opened from the link its latest grading email carries.

**Test data:**

| Status | Word | Chip | Rail step |
| --- | --- | --- | --- |
| Planned | Not handed in yet | Waiting on you | Planned, progress |
| Booked | Drop-off booked | Drop-off on its day | Booked, progress |
| Handed in | Handed in | With us | Handed in, progress |
| Sent | With the grader | With PSA | Sent, progress |
| Graded | Grades are in | On their way back | Graded, progress |
| Back | Back at the shop, being checked | With us | Back, progress |
| Ready | Ready to collect | Waiting on you | Back, progress |
| Collected | Back with you | Collected | Home, progress |
| Cancelled, from Drop-off booked | Cancelled | No chip | Booked, progress |
| Expired, from Not handed in yet | Expired | No chip | Planned, progress |

**Steps:**

1. Load the submission page.
2. Read the status word, the chip beside it and the rail.

**Expected Results:**

* Step 2: the status word, the chip and the rail step in the row all show together.
* Every rail step before the row's step reads completed, and every step after reads upcoming.
* No internal status name shows anywhere on the page.

### grade10-site-grading-submission-lifecycle-US1-TC2-1: The grader's stages reach the page in its own words

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-01

**Pre-conditions:**

* customer(collector)'s submission is With the grader at PSA: on the local stack, seeded at With the grader.
* admin(holds grading:operate) has recorded, on the batch's row at <grade10 admin grading batches url>, a stage beyond the first, picked from PSA's stages, with PSA's words in the note.
* The collector is on <grade10 grading submission page url> for the submission.

**Steps:**

1. Load the submission page.
2. Read the grader's stages.

**Expected Results:**

* Step 2: the stage staff recorded shows in the grader's own words.
* Nothing to do shows beside the stages.

### grade10-site-grading-submission-lifecycle-US1-TC3-1: The estimate reads against the clock rather than a fixed date

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-01

**Pre-conditions:**

* customer(collector)'s submission is With the grader, its batch shipped inside the level's quoted turnaround counted from the ship day: on the local stack, seeded at With the grader.
* The collector is on <grade10 grading submission page url> for the submission.

**Test data:**

| Field | Value |
| --- | --- |
| <ship day> | The day the batch shipped, as its row on <grade10 admin grading batches url> reads it |

**Steps:**

1. Load the submission page.
2. Read the estimate.

**Expected Results:**

* The estimate reads <ship day> plus the level's quoted turnaround.

### grade10-site-grading-submission-lifecycle-US1-TC4-1: Running late shows once the estimate passes, with the new date once set

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-01

**Pre-conditions:**

* customer(collector)'s submission is With the grader under <collector email>, its batch shipped longer ago than the level's quoted turnaround: on the local stack, seeded at With the grader with its visit set back further than the turnaround.
* The collector is on <grade10 grading submission page url> for the submission.
* admin(holds grading:operate) is on <grade10 admin grading batches url>, where the batch's row reads past its estimate.

**Test data:**

| Field | Value |
| --- | --- |
| <new date> | Any day at least a week after today |

**Steps:**

1. Load the submission page before staff re-estimate the batch.
2. On the batch's row, click Re-estimate, pick the stage, enter <new date> and a reason, and confirm.
3. Reload the submission page.
4. Open the latest grading email to <collector email>.

**Expected Results:**

* Step 1 shows the chip reading Running late with the grader named, and no new date yet.
* Step 1: the status word still reads With the grader.
* Step 3 shows the same chip with the new date.
* Step 4: the running-late email names the new date, sent that day.

### grade10-site-grading-submission-lifecycle-US1-TC5-1: A submission id that does not exist shows the not-found page

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-01

**Pre-conditions:**

* None.

**Test data:**

| Field | Value |
| --- | --- |
| <unissued id> | gs_never_issued_0001, or any id the shop never issued |

**Steps:**

1. Navigate to <grade10 grading submission page url> with <unissued id> as the submission id.

**Expected Results:**

* The site's not-found page shows, naming nothing about the mistyped submission.

### grade10-site-grading-submission-lifecycle-US1-TC6-1: A failed load shows an error the collector can retry

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-01

**Pre-conditions:**

* The submission record request is stubbed to fail.
* customer(collector) holds the link to a submission of theirs, at any status.

**Steps:**

1. Load the submission page.
2. Let the request through again and retry.

**Expected Results:**

* Step 1: the failure shows in the error tone, with no status, chip or rail rendered.
* Step 2: the page reads again once the request is retried.

### grade10-site-grading-submission-lifecycle-US1-TC7-1: A reader who is neither the collector nor the link reads not found

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-01

**Pre-conditions:**

* A submission exists at Handed in, booked under customer A's email: on the local stack, seeded at Handed in.
* The tester holds its address, <grade10 grading submission page url>, without the access token the emailed link carries.
* customer B holds an account under a different email.

**Steps:**

1. Open <grade10 grading submission page url> for that submission in a private window, signed out.
2. Open the same address signed in as customer B.

**Expected Results:**

* Both steps show the site's not-found page.
* Nothing on the page says whether that submission exists, and no card, name or pickup code shows.

### grade10-site-grading-submission-lifecycle-US1-TC8-1: A plan kept signed out lands on its own page with no account

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/plan.spec.ts`

**Pre-conditions:**

* customer(collector) is signed out, on the wizard at <grade10 grading url>/new, at the review with <collector email> given and a level picked.

**Test data:**

| Kept by | Review |
| --- | --- |
| Book the drop-off | the statement ticked |
| Save and book later | the statement unticked |

**Steps:**

1. Keep the plan as in the row.
2. Open the plan's link from the email it sent to <collector email>, in a second browser that has never signed in.

**Expected Results:**

* Step 1: the plan's submission page opens, with no sign-in asked for and no not-found page.
* Step 2: the same submission page opens.

### grade10-site-grading-submission-lifecycle-US1-TC9-1: One card back ungraded leaves the submission ready to collect

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-01

**Pre-conditions:**

* customer(collector)'s submission of four cards is Ready to collect, one card recorded returned ungraded on its batch's Receive page before Finish receiving.
* The collector is on <grade10 grading submission page url> for the submission.

**Steps:**

1. Load the submission page.
2. Read the status word.
3. Read each of the four cards.

**Expected Results:**

* Step 2: the submission still reads Ready to collect.
* Step 3: the ungraded return shows on that card alone; the other three carry no ungraded line.

### grade10-site-grading-submission-lifecycle-US1-TC10-1: A card refused after payment has its fee and cover back

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-01

**Pre-conditions:**

* customer(collector)'s submission at <cover level> is at the counter: every card ticked Present on its hand-in runbook at <grade10 admin grading submission url>, the agreement sealed and the fee paid at the till, not yet checked in.
* admin(holds grading:operate) is on that runbook.

**Test data:**

| Field | Value |
| --- | --- |
| <cover level> | A level whose fee sheet row carries a cover rate: PSA Express or Super Express as seeded |
| <reason> | Any of the three reasons the Refuse dialog offers |
| <collector's words> | Surface scratch the grader will not take |

**Steps:**

1. Click Refuse on the first card's row.
2. Pick <reason>, type <collector's words>, and click Refuse this card.
3. Read the till's lines for the submission.
4. Open <grade10 grading submission page url> for the submission.

**Expected Results:**

* Step 3: that card's fee and cover come back at the till.
* Step 4: the page names the refund and the refusal it came back for.

---

## grade10-site-grading-submission-lifecycle-US2: Collector asks for a card back before the batch closes

**As a** collector who changed my mind after hand-in,
**I want** to message the shop before Thursday 19:00 and collect the card at the counter against a receipt, with its fee back at the till the way I paid and the page saying what came back and why,
**so that** a card I want to keep does not leave with the batch.

### grade10-site-grading-submission-lifecycle-US2-TC1-1: A card withdrawn before the batch closes shows collected with its fee refunded

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-02

**Pre-conditions:**

* customer(collector)'s submission, at a level whose fee sheet carries a cover rate, is Handed in through its hand-in runbook, before Thursday 19:00 on the shop's clock. A submission seeded at Handed in will not do: the seed closes its batch at the hand-in.
* One card was withdrawn: admin(holds grading:operate) clicked Withdraw a card on the Cards tab at <grade10 admin grading submission url>, and the collector collected it at the counter against the receipt, its fee refunded at the till.
* The collector is on <grade10 grading submission page url> for the submission.

**Steps:**

1. Load the submission page.
2. Read the withdrawn card.

**Expected Results:**

* The withdrawn card shows the Withdrawn badge.
* The card's fee and cover lines show refunded the way they were paid.

### grade10-site-grading-submission-lifecycle-US2-TC2-1: Withdrawing a card is not offered once the batch has closed

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-02

**Pre-conditions:**

* customer(collector)'s submission is Handed in, its batch closed at the week's cut-off and not yet shipped: on the local stack, seeded at Handed in, which closes its batch at once.
* The collector is on <grade10 grading submission page url> for the submission.

**Steps:**

1. Load the submission page.
2. Read each card for a withdraw act.

**Expected Results:**

* No withdraw act shows on any card.

### grade10-site-grading-submission-lifecycle-US2-TC3-1: Withdrawing one card leaves the rest of the submission unaffected

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-02

**Pre-conditions:**

* customer(collector)'s submission of four cards is Handed in through its hand-in runbook, before Thursday 19:00 on the shop's clock.
* One card was withdrawn: admin(holds grading:operate) clicked Withdraw a card on the Cards tab at <grade10 admin grading submission url>.
* The collector is on <grade10 grading submission page url> for the submission.

**Steps:**

1. Load the submission page.
2. Read each of the four cards.

**Expected Results:**

* The withdrawn card shows the Withdrawn badge with its refund line.
* The other three cards still show Handed in, with no change to their lines.

### grade10-site-grading-submission-lifecycle-US2-TC4-1: Withdrawing the last card cancels the submission

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-02

**Pre-conditions:**

* customer(collector)'s submission of two cards is Handed in through its hand-in runbook under <collector email>, before Thursday 19:00 on the shop's clock, with one card already withdrawn.
* admin(holds grading:operate) is on the submission's Cards tab at <grade10 admin grading submission url>.

**Steps:**

1. Click Withdraw a card on the second card, and confirm the refund and the receipt.
2. Hand the card back at the counter, its fee refunded at the till.
3. Load <grade10 grading submission page url> for the submission.
4. Open the latest grading email to <collector email>.

**Expected Results:**

* Step 3: both cards show the Withdrawn badge with their refund lines.
* Step 3: the submission reads Cancelled, with the rail ended where it stood.
* Step 4: the collector is told the submission is cancelled.

---

## grade10-site-grading-submission-lifecycle-US3: Collector learns why a card came back ungraded

**As a** collector whose card came back raw,
**I want** the grader's code and note on the card, a plain line saying the fee stands, and that the grade is the grader's decision with a review being a new submission at the grader's review fee,
**so that** I know what the grader found, that I was told before I booked, and where to ask rather than argue with the shop.

### grade10-site-grading-submission-lifecycle-US3-TC1-1: A card returned ungraded shows the grader's code, note and that the fee stands

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/batch.spec.ts`

**Pre-conditions:**

* customer(collector)'s submission is Ready to collect, with one card recorded returned ungraded on its batch's Receive page, carrying the grader's code N1 and note.
* The collector is on <grade10 grading submission page url> for the submission.

**Steps:**

1. Load the submission page.
2. Read the ungraded card.

**Expected Results:**

* The card shows the Ungraded badge with the grader's code and note.
* The card's line states the fee stands.
* No refund is offered on the card.

### grade10-site-grading-submission-lifecycle-US3-TC2-1: A card below its named minimum grade shows raw with the fee standing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-03

**Pre-conditions:**

* customer(collector)'s submission is at Graded, with one card listed at a minimum grade of PSA 9 that graded PSA 8, recorded when the grades were recorded on its batch.
* The collector is on <grade10 grading submission page url> for the submission.

**Steps:**

1. Load the submission page.
2. Read that card.

**Expected Results:**

* The card shows the Minimum grade not met badge, raw.
* The card's line states the fee stands.

### grade10-site-grading-submission-lifecycle-US3-TC3-1: The page names a review as a new submission at the grader's review fee

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/batch.spec.ts`

**Pre-conditions:**

* customer(collector)'s submission is at Graded, with one card recorded returned ungraded when the grades were recorded on its batch.
* The collector is on <grade10 grading submission page url> for the submission.

**Steps:**

1. Load the submission page.
2. Read the About the grades text beside the ungraded card.
3. Look for any act on the page.

**Expected Results:**

* Step 2 states the grade is the grader's decision, and that a review is a new submission at the grader's review fee, asked for at the counter.
* Step 3: no act on this submission offers to reopen the grade.

---

## grade10-site-grading-submission-lifecycle-US4: Collector learns the upcharge the day the grades post

**As a** collector whose card came back worth more than the level allows,
**I want** the difference the fee sheet quoted me named on the grades email and on the page as due at the counter before collection,
**so that** I know what to settle before I come in and it is the figure I was warned of.

### grade10-site-grading-submission-lifecycle-US4-TC1-1: A card moved up a level names the quoted difference as due at the counter

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/batch.spec.ts`

**Pre-conditions:**

* customer(collector)'s submission of four cards is at Graded under <collector email>, with one card recorded moved up a level when the grades were recorded on its batch; the fee sheet's difference between the two levels for that card is 60000 (HKD, minor units).
* The collector is on <grade10 grading submission page url> for the submission.

**Steps:**

1. Load the submission page.
2. Read that card, then the other three cards, then the money block.
3. Open the latest grading email to <collector email>.

**Expected Results:**

* The card shows the Moved up a level badge.
* The other three cards show no Moved up a level line.
* The money block shows 60000 (HKD, minor units) due at the counter before collection, matching the figure the review step quoted at booking.
* Step 3: the grades email names the same difference as due at the counter before collection.

### grade10-site-grading-submission-lifecycle-US4-TC2-1: No card moved up a level shows no upcharge due line

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-04

**Pre-conditions:**

* customer(collector)'s submission is at Graded, with every card graded at or under its booked level: on the local stack, seeded at Grades are in.
* The collector is on <grade10 grading submission page url> for the submission.

**Steps:**

1. Load the submission page.
2. Read the cards, then the money block.

**Expected Results:**

* No card shows the Moved up a level badge.
* The money block shows no due-at-the-counter line.

### grade10-site-grading-submission-lifecycle-US4-TC3-1: A different invoice figure leaves the upcharge at the sheet's difference

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-04

**Pre-conditions:**

* customer(collector)'s submission is in a batch back from the grader, one card moved up a level; the fee sheet pinned to the submission puts 60000 HKD minor units between the level booked and the level charged.
* admin(holds grading:operate) is on the batch's Receive page from <grade10 admin grading batches url>, the invoice not yet entered.

**Test data:**

| Field | Value |
| --- | --- |
| Sheet difference | 60000 HKD minor units (HKD 600.00) |
| <invoice figure> | The grader's invoice line for that card at any figure other than the sheet difference, for example USD 90.00 |

**Steps:**

1. Enter the manifest, then the invoice with <invoice figure> on that card's line.
2. Scan every card's cert, then click Finish receiving.
3. Open <grade10 grading submission page url> for the submission and read the money block.

**Expected Results:**

* Step 3: the collector owes 60000 HKD minor units for the upcharge.

---

## grade10-site-grading-submission-lifecycle-US5: Collector is paid out for a card that did not come back

**As a** collector whose card was lost or damaged in the grader's hands or in transit,
**I want** to be told the same day, paid out at the card's declared value with its fee refunded inside the payout window, at the till or by transfer, and the payout reversed on its record if the card turns up,
**so that** I never wait on the shop's claim against the grader or the courier.

### grade10-site-grading-submission-lifecycle-US5-TC1-1: A card not returned or damaged is paid out at declared value with its fee refunded

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/batch.spec.ts`

**Pre-conditions:**

* customer(collector)'s submission of four cards is at Ready, with one card recorded Not returned on its batch's Receive page, declared at 500000 (HKD, minor units), inside the payout window of 14 days from the batch's receipt.
* The payout was made from the submission's Money tab at <grade10 admin grading submission url>: Payout by one `grading:approve` holder, approved by a second.
* The collector is on <grade10 grading submission page url> for the submission.

**Steps:**

1. Load the submission page.
2. Read that card, then the money block.

**Expected Results:**

* The submission reads Ready to collect, and the other three cards are collectable.
* The card shows the Not returned badge with the payout line.
* The money block shows 500000 (HKD, minor units) paid out, with the card's fee refunded beside it and the cover kept, its route and its reference.

### grade10-site-grading-submission-lifecycle-US5-TC2-1: A payout reaches the collector by either route

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/batch.spec.ts`

**Pre-conditions:**

* customer(collector)'s submission is at Ready, with one card recorded Damaged on its batch's Receive page and paid out from the Money tab at <grade10 admin grading submission url> by the route in the row, approved by a second `grading:approve` holder.
* The collector is on <grade10 grading submission page url> for the submission.

**Test data:**

| Route | Value |
| --- | --- |
| Till | Paid out at the till |
| Bank transfer | Paid out by bank transfer |

**Steps:**

1. Load the submission page.
2. Read the money block.

**Expected Results:**

* The money block names the route in the row.

### grade10-site-grading-submission-lifecycle-US5-TC3-1: A payout is reversed on its record when the card turns up

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/batch.spec.ts`

**Pre-conditions:**

* customer(collector)'s submission is at Ready, with a card paid out as Not returned whose payout was then reversed on the Money tab at <grade10 admin grading submission url> when the card turned up.
* The collector is on <grade10 grading submission page url> for the submission.

**Steps:**

1. Load the submission page.
2. Read that card, then the money block.

**Expected Results:**

* The card shows back on the submission with the reversal line, in place of the Not returned badge.
* The money block shows the payout reversed on the same record.

### grade10-site-grading-submission-lifecycle-US5-TC4-1: A card recorded damaged is told the same day, with its payout

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-05

**Pre-conditions:**

* customer(collector)'s card, planned under <collector email>, is in a batch back from the grader and being received.
* admin(holds grading:operate) is on the batch's Receive page from <grade10 admin grading batches url>.

**Steps:**

1. Photograph the slab in the box and record the card Damaged, before its cert is scanned.
2. The same day, open the latest grading email to <collector email>.

**Expected Results:**

* Step 2: the collector is told that day that the card came back damaged, with the payout it owes.

---

### grade10-site-grading-submission-lifecycle-US5-TC5-1: A card that turns up is repaid before it goes home

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-05

**Pre-conditions:**

* <collector> opens <their submission>'s page.

**Test data:**

| Field | Value |
| --- | --- |
| <their submission> | a ready submission whose card was paid out at 800000 (HKD, minor units) with its fee of 60000 refunded, since found and its payout reversed |

**Steps:**

1. Read the money block and the pickup card.

**Expected Results:**

* Step 1: 860000 (HKD, minor units) read due to repay at the counter, and the card is collectable only once they are paid.

---

## grade10-site-grading-submission-lifecycle-US6: Collector reads the pickup card when the cards are ready

**As a** collector whose cards are ready,
**I want** a four-digit code on the page and in the email, the shop's hours with no booking needed, what is due, and whether to bring an ID,
**so that** I walk in and leave with the slabs on one visit.

### grade10-site-grading-submission-lifecycle-US6-TC1-1: The pickup card shows the code, the shop's hours and that no booking is needed

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/handback.spec.ts`

**Pre-conditions:**

* customer(collector)'s submission is Ready to collect under <collector email>: on the local stack, seeded at Ready to collect.
* The collector is on <grade10 grading submission page url> for the submission.

**Steps:**

1. Load the submission page.
2. Read the pickup card.
3. Open the ready email in <collector email>'s grading emails.

**Expected Results:**

* The pickup card shows a four-digit code, the shop's hours, and that no booking is needed.
* The pickup card shows one figure to settle.
* Step 3: it carries the same four-digit code.

### grade10-site-grading-submission-lifecycle-US6-TC2-1: At the ID-glance threshold the page asks for no ID, above it it asks for one

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/handback.spec.ts`

**Pre-conditions:**

* customer(collector) holds a submission at Ready with a total declared value of 1000000 (HKD, minor units): on the local stack, seeded at Ready to collect with cards declared to that total.
* The same collector holds a second submission at Ready with a total declared value of 1000100 (HKD, minor units), seeded the same way.

**Steps:**

1. Load <grade10 grading submission page url> for the submission declared at 1000000, and read the pickup card's Bring line.
2. Load <grade10 grading submission page url> for the submission declared at 1000100, and read the pickup card's Bring line.
3. As admin(holds grading:operate), open the hand-back runbook for the submission declared at 1000100 at <grade10 admin grading submission url>, and enter its pickup code and the collector's name.

**Expected Results:**

* At exactly 1000000 the pickup card's Bring line shows nothing: above the threshold is more than the figure, never the figure itself.
* At 1000100 the pickup card names bringing an ID matching the collector's name.
* Step 3: at 1000100 the hand-back runbook shows the ID line, and nothing from the ID is kept on the submission.

### grade10-site-grading-submission-lifecycle-US6-TC3-1: Below the ID-glance threshold, the page asks the collector to bring nothing

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/handback.spec.ts`

**Pre-conditions:**

* customer(collector)'s submission is at Ready with a total declared value of 999900 (HKD, minor units): on the local stack, seeded at Ready to collect with cards declared to that total.
* The collector is on <grade10 grading submission page url> for the submission.

**Steps:**

1. Load the submission page.
2. Read the pickup card's Bring line.
3. As admin(holds grading:operate), open the submission's hand-back runbook at <grade10 admin grading submission url>, and enter its pickup code and the collector's name.

**Expected Results:**

* The pickup card's Bring line shows nothing.
* Step 3: on the hand-back runbook no ID line shows, and the code and the name release the cards.

### grade10-site-grading-submission-lifecycle-US6-TC4-1: What is due shows nothing owed, or one combined figure

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-06

**Pre-conditions:**

* customer(collector)'s submission of four cards is at Ready in the state the row names: the first row seeded at Ready to collect on the local stack; the second needs the upcharge recorded at receiving and the ready day 100 days back, which only a manipulated clock gives.
* The collector is on <grade10 grading submission page url> for the submission.

**Test data:**

| State | What is due |
| --- | --- |
| No upcharge, no storage | Nothing |
| An upcharge of 60000 and storage of 12000 (HKD, minor units) | 72000 (HKD, minor units), one figure |

**Steps:**

1. Load the submission page.
2. Read the pickup card's To settle line.

**Expected Results:**

* The pickup card's To settle line matches the row.

### grade10-site-grading-submission-lifecycle-US6-TC5-1: Nothing is handed back while an upcharge is unsettled

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-06

**Pre-conditions:**

* customer(collector)'s submission is Ready to collect with an unsettled upcharge: a card recorded moved up a level on its batch.
* The collector is at the counter with the pickup code, and admin(holds grading:operate) is on the submission's hand-back runbook at <grade10 admin grading submission url>.

**Steps:**

1. Enter the pickup code and the collector's name.
2. Tick Handed over on every item.
3. Read the Sign step and Hand over, without taking payment.

**Expected Results:**

* Step 3: the hand-back is refused by name until the figure is settled at the counter.

### grade10-site-grading-submission-lifecycle-US6-TC6-1: A slab put into a vault case at the counter reads Vaulted

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-06

**Pre-conditions:**

* customer(collector)'s submission of four slabs is Ready to collect with its storage accruing: on the local stack, seeded at Ready to collect with its ready day 100 days back.
* admin(holds grading:operate) is on the hand-back runbook at <grade10 admin grading submission url>, the pickup code and the collector's name entered and the balance settled.

**Steps:**

1. Click Vault instead on the first slab's row, and open its vault case with the collector.
2. Tick Handed over on the other three items.
3. Click Copy link on the Sign step, and have the collector sign the receipt on <grade10 grading sign link>.
4. Open <grade10 grading submission page url> for the submission.

**Expected Results:**

* Step 3: the receipt says the card went to the vault.
* Step 4: that card reads Vaulted and links its case.
* Step 4: it is not counted for storage on the submission.

---

### grade10-site-grading-submission-lifecycle-US6-TC7-1: A vault reference that matches no case reads as plain text

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-06

**Pre-conditions:**

* collector(signed in under the booking email) owns a collected submission with <vaulted card>.

**Test data:**

| Field | Value |
| --- | --- |
| <vaulted card> | a card vaulted at the counter under a reference that matches no vault case |

**Steps:**

1. Open the submission page.
2. Open a vault case under that reference, then open the submission page again.

**Expected Results:**

* Step 1: the card reads Vaulted with the reference as plain text and no link.
* Step 2: the card links the case.

---

## grade10-site-grading-submission-lifecycle-US7: Collector names somebody else to collect

**As a** collector who cannot come in,
**I want** to name one person by their full name on the page before they come, change or remove them any time before collection, and see it logged in History,
**so that** they collect with the code and the ID the pickup card asks for, and nobody else can.

### grade10-site-grading-submission-lifecycle-US7-TC1-1: Naming a collector saves the full name and logs it in History

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-07

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/handback.spec.ts`

**Pre-conditions:**

* customer(collector)'s submission is at Ready with nobody named, under <collector email>: on the local stack, seeded at Ready to collect.
* The collector is on <grade10 grading submission page url> for the submission.

**Test data:**

| Field | Value |
| --- | --- |
| Their name | Chan Tai Man |

**Steps:**

1. Enter Their name.
2. Click Save.
3. Read History.
4. Open the latest grading email to <collector email>.

**Expected Results:**

* Step 2: the Named card shows Chan Tai Man with Change and Remove.
* Step 3: History logs the name against its instant.
* Step 4: no email is sent for the naming.

### grade10-site-grading-submission-lifecycle-US7-TC2-1: An empty name cannot be saved

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-07

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/handback.spec.ts`

**Pre-conditions:**

* customer(collector)'s submission is at Ready with nobody named: on the local stack, seeded at Ready to collect.
* The collector is on <grade10 grading submission page url> for the submission.

**Steps:**

1. Leave Their name empty.
2. Read Save.

**Expected Results:**

* Save stays disabled.
* Nobody is named on the page.

### grade10-site-grading-submission-lifecycle-US7-TC3-1: Changing the named person replaces the previous name and logs it

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-07

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/handback.spec.ts`

**Pre-conditions:**

* customer(collector)'s submission is at Ready with Chan Tai Man named in Their name.
* The collector is on <grade10 grading submission page url> for the submission.

**Test data:**

| Field | Value |
| --- | --- |
| Their name | Wong Siu Ming |

**Steps:**

1. Click Change on the Named card.
2. Enter Their name and click Save.
3. Read History.
4. As admin(holds grading:operate), open the submission's hand-back runbook at <grade10 admin grading submission url> and read who may collect.

**Expected Results:**

* Step 2: the Named card shows Wong Siu Ming in place of Chan Tai Man.
* Step 3: History logs the change against its instant.
* Step 4: on the hand-back runbook, the named person read from the page is Wong Siu Ming alone.

### grade10-site-grading-submission-lifecycle-US7-TC4-1: Removing the named person returns the page to nobody named and logs it

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-07

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/handback.spec.ts`

**Pre-conditions:**

* customer(collector)'s submission is at Ready with Chan Tai Man named in Their name, under <collector email>.
* The collector is on <grade10 grading submission page url> for the submission.

**Steps:**

1. Click Remove on the Named card.
2. Read History.
3. Open the latest grading email to <collector email>.
4. As admin(holds grading:operate), open the submission's hand-back runbook at <grade10 admin grading submission url> and read who may collect.

**Expected Results:**

* Step 1: the page returns to the field and Save, with nobody named.
* Step 2: History logs the removal against its instant.
* Step 3: no email is sent for the removal.
* Step 4: on the hand-back runbook no named person is read from the page.

### grade10-site-grading-submission-lifecycle-US7-TC5-1: Naming a collector is refused once the cards are already collected

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-07

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/handback.spec.ts`

**Pre-conditions:**

* customer(collector)'s submission was Ready to collect when the collector loaded <grade10 grading submission page url> for it in a second tab, before the hand-back; the cards have since been handed back at the counter, so it is Collected.
* The collector is on <grade10 grading submission page url> for the submission in a first tab, loaded after the hand-back.

**Steps:**

1. In the first tab, look for a way to name a collector on the page.
2. In the second tab, type a name in Their name.
3. Click Save.

**Expected Results:**

* Step 1: no naming field shows on a Collected submission.
* Step 3: refused by name as already collected, what was typed still there.

### grade10-site-grading-submission-lifecycle-US7-TC6-1: Somebody neither the collector nor the named person is turned away

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-07

**Pre-conditions:**

* customer(collector)'s submission is Ready to collect with nobody named: on the local stack, seeded at Ready to collect, which prints its pickup code.
* A person who is not the collector is at the counter with that pickup code, and admin(holds grading:operate) is on the submission's hand-back runbook at <grade10 admin grading submission url>.

**Test data:**

| Field | Value |
| --- | --- |
| <other person> | Lee Ka Yan, a name that is neither the booking's nor a named person's |

**Steps:**

1. Enter the pickup code and <other person> as who is collecting.
2. Look for any way on the runbook to release the cards to <other person>.

**Expected Results:**

* Step 1: the cards are not released.
* Step 2: staff have no way to release them.

---

## grade10-site-grading-submission-lifecycle-US8: Collector who leaves the cards is reminded, charged and then given notice

**As a** collector who has not collected,
**I want** a reminder at 30 and 60 days costing nothing, the storage fee accruing per card and per month from day 90 and due before collection, and the written notice posted from day 180 giving me the notice period pinned at signing (90 days) from its posting, with the cards mine throughout,
**so that** I am nudged, never surprised, and can still vault them instead.

### grade10-site-grading-submission-lifecycle-US8-TC1-1: The reminders at day 30 and day 60 cost nothing

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-08

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/uncollected.spec.ts`

**Pre-conditions:**

* customer(collector)'s submission is at Ready, the number of days in the row since the ready date: on the local stack, seeded at Ready to collect with its ready day that many days back.
* The collector is on <grade10 grading submission page url> for the submission.

**Test data:**

| Days since ready | Rung |
| --- | --- |
| 29 | None passed |
| 30 | First reminder |
| 60 | Second reminder |

**Steps:**

1. Load the submission page.
2. Read the uncollected ladder.

**Expected Results:**

* The uncollected ladder shows the rung in the row as passed, and none after it, with no charge against it.
* The ladder shows each rung with the day it falls, counted from the ready day.

### grade10-site-grading-submission-lifecycle-US8-TC2-1: Storage accrues per card and per month started from day 90

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-08

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/uncollected.spec.ts`

**Pre-conditions:**

* customer(collector)'s submission of four cards is at Ready, 95 days since the ready date: on the local stack, seeded at Ready to collect with its ready day 95 days back.
* The collector is on <grade10 grading submission page url> for the submission.

**Steps:**

1. Load the submission page.
2. Read the uncollected ladder, then the money block.

**Expected Results:**

* The uncollected ladder shows the storage rung passed, at 4 cards times 3000 (HKD, minor units).
* The money block shows the same storage figure due before collection.

### grade10-site-grading-submission-lifecycle-US8-TC3-2: The written notice counts its period from its posting date, not from day 180

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-08

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/uncollected.spec.ts`

**Pre-conditions:**

* customer(collector)'s submission is at Ready, 185 days since the ready date: on the local stack, seeded at Ready to collect with its ready day 185 days back.
* The written notice was posted 3 days ago: admin(holds grading:operate) clicked Post the notice on <grade10 admin grading submission url> and recorded a posting date 3 days back with its tracking.
* The collector is on <grade10 grading submission page url> for the submission.

**Steps:**

1. Load the submission page.
2. Read the uncollected ladder's notice rung.

**Expected Results:**

* The uncollected ladder shows the notice rung with its posting date, and 87 days left of the 90 seeded as the notice period, counted from that posting date.

### grade10-site-grading-submission-lifecycle-US8-TC4-2: The cards stay the collector's and nothing further shows past the notice

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-08

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/uncollected.spec.ts`

**Pre-conditions:**

* customer(collector)'s submission is at Ready, 100 days past the notice's posting date and so past the 90 seeded as the notice period: on the local stack, seeded at Ready to collect with its ready day 290 days back, the notice recorded with Post the notice with a posting date 100 days back.
* The collector is on <grade10 grading submission page url> for the submission.

**Steps:**

1. Load the submission page.
2. Read the status word and the uncollected ladder.

**Expected Results:**

* The submission still reads Ready to collect, with the cards named as the collector's.
* No rung or act past the notice shows on the ladder.
* Storage still accrues on the money block.
* The page offers the vault instead.

### grade10-site-grading-submission-lifecycle-US8-TC5-1: A slab vaulted instead of collected is excluded from the storage count

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-08

**Pre-conditions:**

* customer(collector)'s submission of four cards is at Ready, 95 days since the ready date, with one card put into a vault case with Vault instead on its hand-back runbook and the other three not handed over.
* The collector is on <grade10 grading submission page url> for the submission.

**Steps:**

1. Load the submission page.
2. Read the uncollected ladder, then the storage figure.

**Expected Results:**

* The uncollected ladder's cards-held count reads 3, excluding the vaulted card.
* The storage figure is 3 cards times 3000 (HKD, minor units), not 4.

### grade10-site-grading-submission-lifecycle-US8-TC6-1: Booking a visit or naming a collector does not pause the ladder

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-08

**Pre-conditions:**

* customer(collector)'s submission of four cards is at Ready, 95 days since the ready date: on the local stack, seeded at Ready to collect with its ready day 95 days back.
* A person is named in Their name on the submission page, and a Grading visit is booked at the shop at <grade10 url>/book under the collector's email.
* The collector is on <grade10 grading submission page url> for the submission.

**Steps:**

1. Load the submission page.
2. Read the uncollected ladder, then the storage figure.

**Expected Results:**

* The uncollected ladder still counts its rungs from the ready date, with the storage rung passed.
* The storage figure still accrues at 4 cards times 3000 (HKD, minor units) a month started.
* Nothing on the ladder reads as paused, held or waiting on the booked visit.

### grade10-site-grading-submission-lifecycle-US8-TC7-1: Storage is taken at the till, a line per card, before hand-back

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-08

**Pre-conditions:**

* customer(collector)'s submission of four cards is Ready to collect with storage accrued: on the local stack, seeded at Ready to collect with its ready day 100 days back.
* The collector is at the counter, and admin(holds grading:operate) is on the hand-back runbook at <grade10 admin grading submission url>, the pickup code and the name entered.

**Test data:**

| Field | Value |
| --- | --- |
| Storage accrued | 12000 HKD minor units: 4 cards times 3000, one month started |

**Steps:**

1. Read the Settle step and Hand over.
2. Click Take payment.
3. Read the till's lines.

**Expected Results:**

* Step 1: nothing can be handed over yet.
* Step 3: the storage accrued to that day is taken at the till, one line per card held.

### grade10-site-grading-submission-lifecycle-US8-TC8-1: A reminder names the code, what is due and the days ahead

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-08

**Pre-conditions:**

* On the local stack, after 09:00 on the shop's clock, customer(collector)'s submission is Ready to collect under <collector email>, seeded with its ready day the row's days back.

**Test data:**

| Days since ready | Rung |
| --- | --- |
| 30 | First reminder |
| 60 | Second reminder |

**Steps:**

1. Run grading's reminder sweep once.
2. Open the latest grading email to <collector email>.

**Expected Results:**

* Step 2: a reminder has gone, naming the pickup code, what is due, the storage day and the notice day.
* It says the reminder itself adds nothing.

### grade10-site-grading-submission-lifecycle-US8-TC9-1: The storage fee is told the day it starts

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-08

**Pre-conditions:**

* On the local stack, after 09:00 on the shop's clock, customer(collector)'s submission of four cards is Ready to collect under <collector email>, seeded with its ready day 90 days back.

**Steps:**

1. Run grading's reminder sweep once.
2. Open the latest grading email to <collector email>.

**Expected Results:**

* Step 2: the storage email names the fee for each card for each month, what is due now and the notice day.

### grade10-site-grading-submission-lifecycle-US8-TC10-1: The written notice is emailed the day it is posted

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-08

**Pre-conditions:**

* customer(collector)'s submission is Ready to collect under <collector email>, 181 days since the ready date, its row badged Notice due: on the local stack, seeded at Ready to collect with its ready day 181 days back.
* admin(holds grading:operate) is on <grade10 admin grading submission url> for the submission.

**Test data:**

| Field | Value |
| --- | --- |
| Posting date | Today, on the shop's clock |
| Tracking | RR123456789HK |

**Steps:**

1. Click Post the notice.
2. Enter the posting date and the tracking, and click Record.
3. Open the latest grading email to <collector email>.

**Expected Results:**

* Step 3: the collector is sent the notice that day, naming what is due, the pickup code, the 90 days it gives from the posting date as the period pinned at signing, and the clause it acts under.

### grade10-site-grading-submission-lifecycle-US8-TC11-1: Nothing is sent about the uncollected cards after the notice

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-08

**Pre-conditions:**

* On the local stack, after 09:00 on the shop's clock, customer(collector)'s submission is Ready to collect under <collector email>, seeded with its ready day 220 days back.
* Its written notice is posted: recorded with Post the notice on <grade10 admin grading submission url>.

**Steps:**

1. Run grading's reminder sweep.
2. Within five minutes, open the latest grading email to <collector email>.

**Expected Results:**

* Step 2: no further message is sent about the cards being uncollected.

---

### grade10-site-grading-submission-lifecycle-US8-TC12-1: A rung falls on the shop's day

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-08

**Pre-conditions:**

* <collector> opens <their submission>'s page.

**Test data:**

| Field | Value |
| --- | --- |
| <their submission> | a submission that became ready at 23:30 on 1 January on the shop's clock |

**Steps:**

1. Read the ladder.

**Expected Results:**

* Step 1: the first reminder falls on 31 January.

---

### grade10-site-grading-submission-lifecycle-US8-TC13-1: A submission whose every card is paid out climbs no rung

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-08

**Pre-conditions:**

* <collector> opens <their submission>'s page, its ready day 181 days past.

**Test data:**

| Field | Value |
| --- | --- |
| <their submission> | a ready submission of two cards, both recorded not returned and paid out |

**Steps:**

1. Read the page.
2. Read the letters sent to <collector>.

**Expected Results:**

* Step 1: the submission reads as ended; no storage reads due and no notice is owed.
* Step 2: no reminder, storage or notice letter was sent.

---

### grade10-site-grading-submission-lifecycle-US8-TC14-1: Storage months come round on the day storage began

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-08

**Pre-conditions:**

* <collector> opens <their submission>'s page on 1 May.

**Test data:**

| Field | Value |
| --- | --- |
| <their submission> | a ready submission of one card that became ready on 1 January |

**Steps:**

1. Read what is due.

**Expected Results:**

* Step 1: storage reads 6000 (HKD, minor units), two months started from 1 April.

---

### grade10-site-grading-submission-lifecycle-US8-TC15-1: A card the grader held starts its storage from the day it came back

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-08

**Pre-conditions:**

* <collector> opens <their submission>'s page on 15 April.

**Test data:**

| Field | Value |
| --- | --- |
| <their submission> | a submission ready on 1 January, one card held by the grader and back at the shop on 1 March, one card at the shop since 1 January |

**Steps:**

1. Read what is due.

**Expected Results:**

* Step 1: storage reads 3000 (HKD, minor units), one month for the card at the shop since 1 January, and none for the card back on 1 March.

---

## grade10-site-grading-submission-lifecycle-US9: Collector keeps the graded record after collection

**As a** collector who has collected,
**I want** the grade, grader and cert per slab with a look-up link, the slab photographs and the three documents with their fingerprints to stay on the page and under my account when I keep one,
**so that** a vault valuation or an auction reads the record from there and my slab never enters the shop's stock.

### grade10-site-grading-submission-lifecycle-US9-TC1-1: The collected record shows the grade, grader, cert, photographs and documents

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-09

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/handback.spec.ts`

**Pre-conditions:**

* customer(collector)'s submission is at Collected: on the local stack, seeded at Back with you.
* The collector is on <grade10 grading submission page url> for the submission.

**Steps:**

1. Load the submission page.
2. Read each slab, then the documents.

**Expected Results:**

* Each slab shows its grade, grader and cert with a Look up link, and its photograph.
* The three documents show with their fingerprints and a download.

### grade10-site-grading-submission-lifecycle-US9-TC2-1: Signed in, the collected record also lists under the collector's account

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-09

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/handback.spec.ts`

**Pre-conditions:**

* customer(collector)'s submission under <collector email> is Collected: on the local stack, seeded at Back with you.
* The collector is signed in with <collector email>, the same email the submission was booked under.

**Steps:**

1. Open the signed-in home at <grade10 grading url>.
2. Read Your submissions.

**Expected Results:**

* The Collected submission shows in Your submissions with its status word.

### grade10-site-grading-submission-lifecycle-US9-TC3-1: A card still held by the grader shows as held on an otherwise collected record

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-09

**Pre-conditions:**

* customer(collector)'s submission of four cards has one card recorded Held by the grader, with the grader's expected date, on its batch's Receive page, and the other three handed back on a sealed first receipt.
* The collector is on <grade10 grading submission page url> for the submission.

**Steps:**

1. Load the submission page.
2. Read the three handed-back cards, then the held card.

**Expected Results:**

* The submission still reads Ready to collect.
* The three collected cards show their graded record.
* The held card shows the Held by the grader badge with the expected date, and the record names a second hand-back still to come.
* The first receipt names the card still out.

### grade10-site-grading-submission-lifecycle-US9-TC4-1: The held card's return closes the submission, keeping both receipts

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-09

**Pre-conditions:**

* customer(collector)'s submission is Ready to collect: its other cards were handed back on a sealed first receipt, and the one card the grader held has come back.
* admin(holds grading:operate) is on the second hand-back's runbook at <grade10 admin grading submission url>.

**Steps:**

1. Enter the pickup code and the collector's name.
2. Tick Handed over on the one item.
3. Click Copy link on the Sign step, and have the collector sign the second receipt on <grade10 grading sign link>.
4. Click Hand over.
5. Open <grade10 grading submission page url> for the submission.

**Expected Results:**

* Step 5: the submission is collected: it reads Back with you.
* Step 5: the record carries both hand-backs and both receipts.

---

## grade10-site-grading-submission-lifecycle-US10: Collector cancels a submission before the visit starts

**As a** collector who no longer wants the cards graded,
**I want** to cancel the submission from the page until the visit starts and until the counter checks or refuses a card, with the drop-off going with it, and after that to have the counter refuse the cards instead,
**so that** nothing is left open in my name and nothing is owed.

### grade10-site-grading-submission-lifecycle-US10-TC1-1: Cancelling before hand-in closes the submission and its drop-off, with nothing owed

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-10

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/handin.spec.ts`

**Pre-conditions:**

* customer(collector) is on <grade10 grading submission page url> for a submission at the status in the row: Planned seeded on the local stack; Booked with its drop-off booked from the page's drop-off picker.

**Test data:**

| Status | Drop-off |
| --- | --- |
| Planned | None booked |
| Booked | A drop-off booked |

**Steps:**

1. Click Cancel this submission.
2. Confirm Yes, cancel.

**Expected Results:**

* The submission reads Cancelled, with the rail ended at the row's stage.
* No chip shows beside the word.
* Where a drop-off was booked, it closes with the submission.
* The page states nothing was paid and nothing is owed.

### grade10-site-grading-submission-lifecycle-US10-TC2-1: The cancel act disappears once the cards are handed in

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-10

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/handin.spec.ts`

**Pre-conditions:**

* customer(collector)'s submission is at Handed in, handed in through its hand-in runbook.
* The collector has the page also open in a second tab, loaded before the hand-in, while Cancel this submission was offered.
* The collector is on <grade10 grading submission page url> for the submission.

**Steps:**

1. Load the submission page.
2. Look for Cancel this submission.
3. In the second tab, click Cancel this submission and confirm Yes, cancel.

**Expected Results:**

* No Cancel this submission act shows on the page.
* Step 3: the cancel is refused by name.

### grade10-site-grading-submission-lifecycle-US10-TC3-1: Backing out of the cancel confirmation leaves the submission unchanged

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-10

**Pre-conditions:**

* customer(collector)'s submission is at Booked, its drop-off booked from the page's drop-off picker.
* The collector is on <grade10 grading submission page url> for the submission.

**Steps:**

1. Click Cancel this submission.
2. Click Go back on the confirmation.

**Expected Results:**

* The dialog closes, and the submission still reads Drop-off booked with its visit intact.

### grade10-site-grading-submission-lifecycle-US10-TC4-1: The last card refused at the counter cancels the submission

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-10

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/handin.spec.ts`

**Pre-conditions:**

* customer(collector)'s submission of one card was at Booked under <collector email>, its drop-off booked from the page's drop-off picker, so the booked email is the latest grading email to that address.
* At hand-in, admin(holds grading:operate) clicked Refuse on its only card on the hand-in runbook, picked a reason, typed the collector's words, and clicked Refuse this card.
* The collector is on <grade10 grading submission page url> for the submission.

**Steps:**

1. Load the submission page.
2. Open the latest grading email to <collector email>.

**Expected Results:**

* Step 1: the card shows the Refused at the counter badge with the reason as staff typed it, never charged.
* Step 1: the submission reads Cancelled, with the rail ended at Booked.
* Step 1: the page states nothing was paid and nothing is owed.
* Step 2: no message about the cancellation is in the submission's messages: the collector was told at the counter.

### grade10-site-grading-submission-lifecycle-US10-TC5-1: Cancel is withheld once the visit's start time comes or the counter checks or refuses a card

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-10

**Pre-conditions:**

* customer(collector) has <grade10 grading submission page url> open in a second tab for a submission of two cards at Booked, loaded before the state in the row was reached.
* The row's state is reached as its How column says; admin(holds grading:operate) acts on the submission's hand-in runbook at <grade10 admin grading submission url>.

**Test data:**

| State | The desk | How |
| --- | --- | --- |
| Start time come | the visit's start time has come; no card checked or refused | on the local stack, seeded at Drop-off booked with its visit 30 minutes past, and the sweep not run |
| Card checked early | before the visit's start time, the desk started early and checked the first card | booked from the page for a later time; Start at the desk, then Present ticked on the first card |
| Card refused early | before the visit's start time, the desk started early and refused the first card | booked from the page for a later time; Start at the desk, then Refuse on the first card |

**Steps:**

1. Load the submission page in the first tab.
2. In the second tab, click Cancel this submission and confirm Yes, cancel.

**Expected Results:**

* Step 1: no Cancel this submission shows.
* Step 2: the cancel is refused by name, and the submission is not cancelled.

### grade10-site-grading-submission-lifecycle-US10-TC6-1: A plan nobody books expires on its own

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-10

**Pre-conditions:**

* On the local stack, customer(collector)'s submission is Planned with no drop-off booked, kept longer ago than the plan's expiry: seeded at Planned with its kept day 31 days back.
* The collector holds the link to its page, <grade10 grading submission page url>.

**Steps:**

1. Run grading's sweep once.
2. Load the submission page.

**Expected Results:**

* Step 2: the submission is expired, the rail stands at Planned.
* Step 2: nothing was paid, nothing is owed, and the cards were never handed in.

---

## grade10-site-grading-submission-lifecycle-US11: Collector is offered only what the status allows

**As a** collector reading the page,
**I want** each status to offer only the acts it allows, editing the list before hand-in, withdrawing a card at Handed in, naming a collector when ready, and nothing while the grader has the cards,
**so that** I am never shown a button that will only be refused.

### grade10-site-grading-submission-lifecycle-US11-TC1-1: Each status shows only the acts it allows

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
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-11

**Pre-conditions:**

* customer(collector) is on <grade10 grading submission page url> for a submission at the status in the row: on the local stack, seeded at that status, except Booked and Handed in, which need a drop-off booked from the page and a hand-in through the runbook before the week's cut-off.

**Test data:**

| Status | Acts shown |
| --- | --- |
| Planned | Edit the list; book, move or cancel the drop-off; cancel the submission |
| Booked | Edit the list; move or cancel the drop-off; cancel the submission |
| Handed in | Withdraw a card |
| Sent | None |
| Graded | None |
| Back | None |
| Ready | Name, change or remove a collector; collect; vault a slab |
| Collected | Read the record; vault a slab; consign it to an auction; ask for erasure |

**Steps:**

1. Load the submission page.
2. Read every act, control and button on the page.

**Expected Results:**

* Only the acts listed for that status show on the page.
* No other act, control or button shows.

### grade10-site-grading-submission-lifecycle-US11-TC2-2: The edit of the list and the cancel go once the counter checks or refuses a card

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
* **Trace:** grade10-site-grading-submission-lifecycle-US-11

**Pre-conditions:**

* customer(collector) has <grade10 grading submission page url> open in a second tab for a submission of two cards at Booked, its drop-off booked from the page for a later time, loaded before the counter acted.
* At the counter, before the visit's start time, admin(holds grading:operate) clicked Start at the desk on the hand-in runbook at <grade10 admin grading submission url> and acted on the first card as in the row, and on nothing else.

**Test data:**

| The counter | On the first card |
| --- | --- |
| Checked it | the condition note and both intake photographs |
| Refused it | the Refused at the counter badge with the reason as staff typed it |

**Steps:**

1. Load the submission page in the first tab.
2. In the second tab, change a card's name and save the list.
3. In the second tab, click Cancel this submission and confirm Yes, cancel.

**Expected Results:**

* Step 1: the page offers no edit of the list and no Cancel this submission.
* Step 2: the save is refused with a message that the list is at the counter.
* Step 3: the cancel is refused by name, and the submission is not cancelled.
* After step 3, reloading the page shows both cards as before, and the first card as in the row.

### grade10-site-grading-submission-lifecycle-US11-TC3-1: Editing a kept list saves the same submission and books nothing

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-grading-submission-lifecycle-US-11

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/plan.spec.ts`

**Pre-conditions:**

* customer(collector) is on <grade10 grading submission page url> for a submission of three cards at the status in the row, and the counter has checked or refused none of them: Planned seeded on the local stack; Booked with its drop-off booked from the page's drop-off picker.

**Test data:**

| Status | Drop-off |
| --- | --- |
| Planned | None booked |
| Booked | A drop-off booked |

**Steps:**

1. Click Edit the list.
2. Add a fourth card with a declared value, and save the changes.
3. Open the collector's submissions on <grade10 grading url>.

**Expected Results:**

* Step 2: the same submission page opens, its id unchanged, listing four cards.
* Step 2: the drop-off is as in the row: none on the Planned one, the same day and time on the Booked one.
* Step 3: one submission is listed for this list, not two.

---

## Reconciliation

**Run:** the blind pass read the bundle built for `grade10-site/grading/submission-lifecycle` under `add-card-grading` - this capability's `## Purpose` and `## Feature set`, its `user-journeys.md`, the change's `proposal.md`, its `decisions.md` with the `## Raised` table, `ui-design.md` with the state dispositions stripped, and the linked pages under `docs/prds/products/grade10-site/grading/`. Denied: every `## Requirements` section, `openspec/specs/`, `openspec/changes/archive/` and `tech-design.md`. It wrote 38 cases over US1-US11 and four raised questions; the scenario pass wrote SC-01 to SC-51 over eighteen requirements. The two are joined here on anchors.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `US1-TC1-1`'s rail step for Graded, Back and Ready | Corrected | The case read Sent at all three; the status table the page and the PRD both carry reads Graded, Back and Back. The material settles it, so the case moved rather than the requirement |
| `US1-TC1-1`'s walk of the whole status table | Folded in | `grade10-site-grading-submission-lifecycle-SC-53` - the scenarios took one status each, and none said the word, the chip and the rail are one row read three ways |
| `US1-TC5-1` an id that does not exist reads not found | Folded in | `grade10-site-grading-submission-lifecycle-SC-52`, with the rule the raised question settled: an unissued id and a reader who holds neither the session nor the link are answered the same way |
| Raised: is the page restricted to the owning collector, or does anyone with the URL read it? | Folded in | `grade10-site-grading-submission-lifecycle-SC-52` and the requirement "The submission page opens to the collector and to the emailed link"; landed as `decisions.md` Q80. Case `US1-TC7-1` added |
| `US1-TC6-1` a failed load shows an error to retry | No scenario: presentation | Loading and error are the view's states; the `ui-design.md` rows close as `**Out of suite:** the view's colocated test`, and the case stays as their guard |
| Raised: what does the status do once every card is withdrawn before the batch closes? | Folded in | `grade10-site-grading-submission-lifecycle-SC-54` - the last withdrawal cancels the submission and the collector is told; landed as `decisions.md` Q81. Case `US2-TC4-1` added |
| `US4-TC2-1` no card moved up shows no upcharge line | Reached | The empty case of `grade10-site-grading-submission-lifecycle-SC-23`; `grade10-site-grading-submission-lifecycle-SC-27` states what the page shows when nothing is due. No new rule |
| `US6-TC2-1` the ID glance at exactly HKD 10,000 declared | **Covered by `grade10-site-grading-submission-lifecycle-SC-28` and `grade10-site-grading-submission-lifecycle-SC-29`, corrected** | Above the threshold is more than the figure, so a submission declared at exactly 1000000 HKD minor units is released on the code and the name. The case now reads the figure on the no-ID side and the sum above it on the ID side, and `decisions.md` carries the rule as Q85 |
| `US7-TC2-1` an empty name cannot be saved | Folded in | `grade10-site-grading-submission-lifecycle-SC-55` |
| `US7-TC4-1` removing the named person | Folded in | `grade10-site-grading-submission-lifecycle-SC-56` - the requirement allowed the removal and no scenario walked it |
| Raised: does the uncollected ladder pause once a visit is booked or a collector named? | Folded in | `grade10-site-grading-submission-lifecycle-SC-57` - it keeps counting, and only collection, vaulting or a payout takes a card off it; landed as `decisions.md` Q83. Case `US8-TC6-1` added |
| `US9-TC2-1` the collected record under the signed-in account | Reached | Stated by the record requirement's **Where it is read**; the signed-in list itself is `grade10-site/grading/submission-plan`'s surface, walked by its US-06 |
| Raised: where is "a collector's slab never enters the catalogue" observable? | **Out of suite:** the store's catalogue suite | The absence is verified where the catalogue is, not on a grading screen; landed as `decisions.md` Q82. `grade10-site-grading-submission-lifecycle-SC-45` keeps the submission's record as the one place a valuation or a consignment reads |
| `US10-TC1-1`'s rail after a cancel from Booked | Corrected | The case ended the rail at Planned for both rows; `grade10-site-grading-submission-lifecycle-SC-06` leaves it at the stage the submission ended on |
| `US10-TC3-1` backing out of the cancel confirmation | No scenario: the dialog's own | `grade10-site-grading-submission-lifecycle-SC-47` states the cancel; Go back is the view's branch, and the case stays as its guard |
| The last card refused at the counter | Folded in | `grade10-site-grading-submission-lifecycle-SC-58` - the counter cancels the submission and tells the collector there, and no message sends; landed as `decisions.md`'s last-card-refused row, which the counter's hand wrote from its own side as `grade10-admin-grading-counter-SC-89`, written as a 🚧 line on `docs/prds/products/grade10-site/grading/submission.md`, and the `ui-design.md` Flags question closed. Case `US10-TC4-1` added |
| The counter owns the list from the first card it checks or refuses | Folded in | `grade10-site-grading-submission-lifecycle-SC-59` - an edit sent after the counter checked a card deleted cards its photographs hang off; the director ruled the list the counter's from its first check or refusal, written as a 🚧 line on `docs/prds/products/grade10-site/grading/submission.md` and in task 11.8. Case `US11-TC2-2` added |
| `US11-TC1-1`'s acts for a Collected submission | Corrected | The case offered Vault it and erasure alone; the acts table also offers reading the record and consigning to an auction |
| `grade10-site-grading-submission-lifecycle-SC-01` a move the status does not name is refused | **Out of suite:** `grade10-admin/grading/counter`'s suite | Its anchor is the feature set group The statuses: no journey of this capability walks a move, and every move is made at the counter |
| `grade10-site-grading-submission-lifecycle-SC-60` | Case added, added after the run | `US1-TC8-1`: decided outside the blind pass, after a plan kept signed out landed on not found; the wizard opens the page on the access the emailed link carries |
| `grade10-site-grading-submission-lifecycle-SC-61` | Case added, added after the run | `US10-TC5-1`: decided outside the blind pass; one window for both hands, so the cancel goes once the visit's start time comes or a card is checked or refused, a desk that started early included. `US11-TC2-1` became `US11-TC2-2` beside it: the cancel goes with the edit once the counter acts, and a cancel from a stale page is refused |
| `grade10-site-grading-submission-lifecycle-SC-62` | Case added, added after the run | `US11-TC3-1`: decided outside the blind pass; the editor saves the same submission at Planned and Booked and books nothing |
| A vault reference matching no case | Case added, added after the run | `grade10-site-grading-submission-lifecycle-US6-TC7-1`: decided by the product owner after the run (Q133), stated by `grade10-site-grading-submission-lifecycle-SC-63` |

**Uncovered anchors:** none. Every journey US-01 to US-11 carries cases, and the one feature-set anchor, The statuses, is listed out of suite above.
| The collector's notice period in the journey | Case amended at the acceptance review | `US8` statement: 30 days became the notice period pinned at signing, 90, as `grade10-site-grading-submission-lifecycle-SC-36` reads |
| What a payout refunds | Case amended at the acceptance review | `US5-TC1-1`: the cover is kept, decided by the product owner, 2026-10-01, as the counter's payout requirement reads |
| A card repaid before it goes home | Case added at the acceptance review | `US5-TC5-1`, stated by `grade10-site-grading-submission-lifecycle-SC-68` |
| The ladder on the shop's day | Case added at the acceptance review | `US8-TC12-1`, stated by `grade10-site-grading-submission-lifecycle-SC-64` |
| Nothing left to hand back | Case added at the acceptance review | `US8-TC13-1`: decided by the product owner, 2026-10-01, stated by `grade10-site-grading-submission-lifecycle-SC-65` |
| Storage months and a held card's storage | Case added at the acceptance review | `US8-TC14-1` and `US8-TC15-1`: the held card's start decided by the product owner, 2026-10-01, stated by `grade10-site-grading-submission-lifecycle-SC-66` and `SC-67` |

### Manual

| Manual | Why |
| --- | --- |
| `US2-TC1-1`, `US2-TC4-1` | The card is pulled from the intake bag and its fee comes back at the till; a person runs the counter and the POS, and only the page's lines are scriptable |
| `US5-TC1-1`, `US5-TC2-1` | The payout is made at the till or by bank transfer by a person; the case walks the money as well as the lines the page draws |
| `US6-TC2-1` | The ID glance happens at the counter and keeps nothing, so nothing but the page's Bring line is scriptable |
| `US8-TC3-2` | The written notice is posted by registered post, and its posting date and tracking are typed in from the receipt |
| `US10-TC4-1` | The refusal and the telling both happen at the counter, and the case asserts no message was sent for them |
| `US1-TC10-1` | A person refuses the card at the counter after payment and reads the fee and cover lines come back at the till; only the page's refund line is scriptable |
| `US6-TC6-1` | A person opens the vault case with the collector at the counter and has the receipt signed on the iPad; the page's Vaulted line and the storage count are scriptable |
| `US7-TC6-1` | A person who is not the collector stands at the counter with a forwarded code, and staff look for a way to release to them; the runbook's refusal is scriptable |
| `US8-TC7-1` | The storage is taken at the POS, one line per card held, by a person at the till; the Settle step's hold is scriptable |
| `US8-TC10-1` | The written notice is posted by registered post and its posting date and tracking typed in from the receipt; the email that day is scriptable |
