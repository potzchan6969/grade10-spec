# grade10-admin/grading/batches Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-22, tcs-rules r3.0

**Out of suite:**

- `grade10-admin-grading-batches-SC-14` - two operators marking one parcel sent: the backend's concurrency test over the ship act, where the second act meets the batch's shipped stamp under `lockBatch` and is refused by name.
- `grade10-admin-grading-batches-SC-33` - finishing a box already finished: the backend's idempotency test over finishing, which the panel offers no second time.
- `grade10-admin-grading-batches-SC-42` - two desks handing in against one shelf: the backend's concurrency test over the hand-in, which takes the safe's cap row for update before it counts.

## grade10-admin-grading-batches-US1: Operator ships the batch that closed

**As a** member of shop staff on the day after the cut-off,
**I want** the batch closed at Thursday 19:00 with its packing list, the grader's order number, the courier and tracking, the insured total against the courier's written cover figure and the estimate from the ship day, and one act that marks every submission in it as sent and emails every collector,
**so that** one parcel to one grader at one level leaves with one record.

### grade10-admin-grading-batches-US1-TC1-1: Operator ships a closed batch with a complete ship form

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
* **Trace:** grade10-admin-grading-batches-US-01

**Pre-conditions:**

* admin(holds grading:operate) is on <grade10 admin batches url>.
* <a batch closed at Thursday 19:00> holds every submission checked in before the cut-off.

**Test data:**

| Field | Value |
| --- | --- |
| Packing list | one line per intake id in the batch |
| Grader's order number | <grader order number> |
| Courier | <courier name> |
| Tracking number | <tracking number> |
| Insured total | 30000000 (HKD, minor units), within <the courier's written cover figure> |
| Shipped on | <today> |
| Estimated back | <ship day> plus the level's weeks |

**Steps:**

1. Open the closed batch's row and start Ship.
2. Fill the packing list, order number, courier, tracking, insured total and shipped-on date.
3. Confirm Mark as shipped.

**Expected Results:**

* Every submission in the batch moves to Sent.
* Every collector in the batch is emailed the courier and the estimate.
* The batch's row reads shipped, with its tracking and estimate.

---

### grade10-admin-grading-batches-US1-TC2-1: A batch still open before its cut-off offers no shipping action

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-01

**Pre-conditions:**

* admin(holds grading:operate) is on <grade10 admin batches url>.
* <a batch open, before its cut-off> holds one or more checked-in submissions.

**Steps:**

1. Open the batch's row.

**Expected Results:**

* The row reads building, with no Ship action offered.

---

### grade10-admin-grading-batches-US1-TC3-1: The ship form refuses a shipped-on date set in the future

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-01

**Pre-conditions:**

* admin(holds grading:operate) is on the ship form of <a batch closed at Thursday 19:00>.

**Test data:**

| Field | Value |
| --- | --- |
| Shipped on | a day after today |

**Steps:**

1. Fill the ship form's other fields.
2. Set Shipped on to a day after today.
3. Attempt Mark as shipped.

**Expected Results:**

* The date is refused on the field.
* No submission moves to Sent.

---

### grade10-admin-grading-batches-US1-TC4-1: The ship form withholds shipping while a required field is missing

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-01

**Pre-conditions:**

* admin(holds grading:operate) is on the ship form of <a batch closed at Thursday 19:00>.

**Test data:**

| Field | Value |
| --- | --- |
| Tracking number | left blank |

**Steps:**

1. Fill every ship form field except the tracking number.

**Expected Results:**

* Mark as shipped is disabled, naming the tracking number field.

---

### grade10-admin-grading-batches-US1-TC5-1: The insured total past the courier's written cover figure is flagged before shipping

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-01

**Pre-conditions:**

* admin(holds grading:operate) is on the ship form of <a batch closed at Thursday 19:00>.
* The batch's declared total exceeds <the courier's written cover figure>.

**Steps:**

1. Fill the ship form with the batch's declared total as the insured total.

**Expected Results:**

* The insured line reads in the warning tone.

---

### grade10-admin-grading-batches-US1-TC6-1: Marking a batch shipped moves every submission in it, however many

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
* **Trace:** grade10-admin-grading-batches-US-01

**Pre-conditions:**

* admin(holds grading:operate) is on the ship form of <a batch closed at Thursday 19:00> holding several submissions from different collectors.

**Steps:**

1. Complete the ship form.
2. Confirm Mark as shipped.

**Expected Results:**

* Every submission in the batch, not only one, moves to Sent.
* Every collector among them is emailed; none is skipped.

---

### grade10-admin-grading-batches-US1-TC7-1: A new batch is opened for one grader and one level

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-01

**Pre-conditions:**

* admin(holds grading:operate) is on <grade10 admin batches url>, with no batch listed.

**Test data:**

| Field | Value |
| --- | --- |
| Grader | <a grader> |
| Level | <a level> |

**Steps:**

1. Start New batch.
2. Pick the grader and the level.

**Expected Results:**

* A batch opens for that grader and that level.
* A card at another grader or another level is not offered into it.

---

### grade10-admin-grading-batches-US1-TC8-1: A shop-staff holding only the read grant cannot ship a batch

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
* **Trace:** grade10-admin-grading-batches-US-01

**Pre-conditions:**

* admin(holds grading:read) is on <grade10 admin batches url>, with <a batch closed at Thursday 19:00>.

**Steps:**

1. Open the closed batch's row.

**Expected Results:**

* No Ship action is offered.

---

### grade10-admin-grading-batches-US1-TC9-1: The ship form stays busy while a batch is being marked shipped

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
* **Trace:** grade10-admin-grading-batches-US-01

**Pre-conditions:**

* admin(holds grading:operate) has submitted a complete ship form for <a batch closed at Thursday 19:00>.

**Steps:**

1. Confirm Mark as shipped.

**Expected Results:**

* The form shows pending; its actions are disabled until it completes.

---

### grade10-admin-grading-batches-US1-TC10-1: The first submission handed in for a grader and level opens the batch

**Classification:**

* **Severity:** normal
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-01

**Pre-conditions:**

* admin(holds grading:operate) is checking in <a submission at a grader and level> at the counter.
* No open batch stands for that shop, grader and level.

**Steps:**

1. Check in the submission.

**Expected Results:**

* A batch opens for that shop, grader and level, carrying its cut-off.
* The submission is listed in it.

---

### grade10-admin-grading-batches-US1-TC11-1: A second submission at the same grader and level joins the standing batch

**Classification:**

* **Severity:** normal
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-01

**Pre-conditions:**

* admin(holds grading:operate) is checking in <a second submission at the same grader and level>.
* <an open batch> already stands for that shop, grader and level.

**Steps:**

1. Check in the second submission.

**Expected Results:**

* The submission joins the standing batch.
* No second batch is listed for that shop, grader and level.

---

### grade10-admin-grading-batches-US1-TC12-1: A batch reads Closed once its cut-off passes, with no act

**Classification:**

* **Severity:** normal
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-batches-US-01

**Pre-conditions:**

* admin(holds grading:operate) is on <grade10 admin batches url>.
* <a batch open, before its cut-off> holds checked-in submissions and Thursday 19:00 on the shop's day passes with no ship date recorded.

**Steps:**

1. Read the batches panel after the cut-off has passed.

**Expected Results:**

* The batch's row reads Closed, with nobody having acted on it.
* The row says it ships that day, the day after the cut-off.
* Its estimate back is counted from that ship day at the level's weeks.

---

### grade10-admin-grading-batches-US1-TC13-1: A submission handed in after the cut-off joins the next batch

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-01

**Pre-conditions:**

* admin(holds grading:operate) is checking in <a submission at a grader and level> after Thursday 19:00 on the shop's day.
* <a batch closed at Thursday 19:00> stands for that shop, grader and level.

**Steps:**

1. Check in the submission.

**Expected Results:**

* The submission joins that trio's next batch, not the closed one.
* The closed batch's cards are unchanged.

---

### grade10-admin-grading-batches-US1-TC14-1: A cover figure in another currency is refused, never converted

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-01

**Pre-conditions:**

* admin(holds grading:operate) is on the ship form of <a batch closed at Thursday 19:00>.

**Test data:**

| Field | Value |
| --- | --- |
| Insured total | 45000000 (HKD, minor units) |
| Cover figure | 1000000 (USD, minor units), as the courier wrote it |

**Steps:**

1. Record the cover figure in USD.
2. Attempt Mark as shipped.

**Expected Results:**

* The batch is refused because the two figures carry different currencies.
* No rate is applied to either figure, and no submission moves.

---

### grade10-admin-grading-batches-US1-TC15-1: The ship form reads the insured total off the batch's cards and will not take a typed figure

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
* **Trace:** grade10-admin-grading-batches-US-01

**Pre-conditions:**

* admin(holds grading:operate) is on the ship form of <a batch closed at Thursday 19:00> holding three cards declared at 500000, 300000 and 200000 (HKD, minor units).

**Steps:**

1. Read the insured line.
2. Attempt to type over the insured total.

**Expected Results:**

* The insured total reads 1000000 (HKD, minor units), the sum of the batch's declared values.
* The figure cannot be typed over.
* Once the batch ships, that figure stands on it as the one declared to the courier.

---

## grade10-admin-grading-batches-US2: Operator receives a batch against the grader's manifest

**As a** member of shop staff opening a returned box,
**I want** the manifest and the invoice entered first, a manifest line naming no intake id held until I resolve it, each slab scanned and matched to a card by intake id with a cert already held elsewhere refused by name, an upcharge recorded as the sheet's difference with the invoice reconciled against it, counters of scanned, matched, ungraded and upcharges, a half-scanned batch keeping its scans until I come back, and a finish that makes every submission in the batch ready at once with its pickup code emailed,
**so that** a slab can never be handed to the wrong collector, the collector owes what they were quoted, and nobody is told ready twice.

### grade10-admin-grading-batches-US2-TC1-1: Scanning is withheld until the manifest and the invoice are entered

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-02

**Pre-conditions:**

* admin(holds grading:operate) is on the receive panel of <a batch back from the grader, unchecked>, with no manifest or invoice entered.

**Steps:**

1. Open the receive panel.

**Expected Results:**

* Scan is disabled.
* Import the manifest and the invoice first is shown.

---

### grade10-admin-grading-batches-US2-TC2-1: The manifest and the invoice are entered before the first scan

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
* **Trace:** grade10-admin-grading-batches-US-02

**Pre-conditions:**

* admin(holds grading:operate) is on the receive panel of <a batch back from the grader, unchecked>.

**Test data:**

| Field | Value |
| --- | --- |
| Manifest | one line per intake id in the batch |
| Invoice | the grader's lines and total |

**Steps:**

1. Enter the manifest.
2. Enter the invoice.

**Expected Results:**

* Scan becomes enabled.
* The invoice's lines and total are shown.

---

### grade10-admin-grading-batches-US2-TC3-1: Scanning a matched cert records the card as matched

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
* **Trace:** grade10-admin-grading-batches-US-02

**Pre-conditions:**

* admin(holds grading:operate) has entered the manifest and invoice for <a batch back from the grader, unchecked>.
* <a slab> carries a cert on a manifest line naming an intake id in the batch, held by no other submission.

**Steps:**

1. Scan the slab's cert.

**Expected Results:**

* The row reads the grade, cert, card and submission, Matched and Scanned.
* The scanned and matched counters each rise by one.

---

### grade10-admin-grading-batches-US2-TC4-1: A scan is refused by name when the cert is already held elsewhere

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
* **Trace:** grade10-admin-grading-batches-US-02

**Pre-conditions:**

* admin(holds grading:operate) has entered the manifest and invoice for <a batch back from the grader, unchecked>.
* <a cert> is already matched and held by <a submission it belongs to>.

**Steps:**

1. Scan the same cert against a second card.

**Expected Results:**

* The scan is refused, naming the submission that already holds the cert.
* The second card stays unmatched.

---

### grade10-admin-grading-batches-US2-TC5-1: A scan is refused by name when the cert names no manifest line

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-02

**Pre-conditions:**

* admin(holds grading:operate) has entered the manifest and invoice for <a batch back from the grader, unchecked>.
* <a cert> appears on no line of the entered manifest.

**Steps:**

1. Scan that cert.

**Expected Results:**

* The scan is refused by name.
* No card is matched to it.

---

### grade10-admin-grading-batches-US2-TC6-1: A manifest line naming no intake id in the batch is held as unmatched

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-02

**Pre-conditions:**

* admin(holds grading:operate) is entering the manifest for <a batch back from the grader, unchecked>.
* One manifest line names an intake id that belongs to no submission in the batch.

**Steps:**

1. Enter that manifest line among the rest.

**Expected Results:**

* The line is listed as unmatched.
* Finish is held until staff resolve it.

---

### grade10-admin-grading-batches-US2-TC7-1: A card returned with no grade is recorded as ungraded

**Classification:**

* **Severity:** normal
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-02

**Pre-conditions:**

* admin(holds grading:operate) has matched <a card> whose manifest line carries the grader's ungraded code and note, no grade.

**Steps:**

1. Match the card's line against the manifest.

**Expected Results:**

* The card is recorded ungraded, with the grader's code and note.
* The ungraded counter rises by one; the card's fee stands.

---

### grade10-admin-grading-batches-US2-TC8-1: A card moved up a level is recorded as an upcharge reconciled against the invoice

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-02

**Pre-conditions:**

* admin(holds grading:operate) has scanned <a card the grader moved to a higher level>, entered on the invoice at that level's fee.

**Steps:**

1. Match the card's scan against the manifest.

**Expected Results:**

* The card is recorded at the fee sheet's difference between the two levels.
* The invoice is reconciled against that figure; the upcharges counter and its sum rise.

---

### grade10-admin-grading-batches-US2-TC9-1: An invoice gap against the fee sheet is marked Commercial's

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
* **Trace:** grade10-admin-grading-batches-US-02

**Pre-conditions:**

* admin(holds grading:operate) has recorded an upcharge whose invoice figure differs from the fee sheet's difference.

**Steps:**

1. Review the reconciled upcharge row.

**Expected Results:**

* The gap between the invoice's figure and the sheet's is shown, marked Commercial's.

---

### grade10-admin-grading-batches-US2-TC10-1: A batch saved part-scanned keeps its scans

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-02

**Pre-conditions:**

* admin(holds grading:operate) has scanned some, not all, of <a batch back from the grader, unchecked>'s slabs.

**Steps:**

1. Leave the receive panel with the batch part-scanned.
2. Reopen the same batch's receive panel later.

**Expected Results:**

* Every earlier scan is still recorded.
* The batch still reads back, unchecked.

---

### grade10-admin-grading-batches-US2-TC11-1: Finish is held while an unmatched line or an unscanned slab remains

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-02

**Pre-conditions:**

* admin(holds grading:operate) is on the receive panel of <a batch back from the grader, unchecked>, with an unmatched manifest line or a manifest slab not yet scanned.

**Steps:**

1. Attempt Finish receiving.

**Expected Results:**

* Finish is disabled, naming the unresolved line or slab.

---

### grade10-admin-grading-batches-US2-TC12-1: Finishing receiving readies every submission in the batch at once

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
* **Trace:** grade10-admin-grading-batches-US-02

**Pre-conditions:**

* admin(holds grading:operate) is on the receive panel of <a batch back from the grader, unchecked>, every manifest line matched or otherwise resolved.

**Steps:**

1. Confirm Finish receiving.

**Expected Results:**

* Every submission in the batch moves to ready together, none left behind.
* Each collector is emailed the pickup code and what is due.
* The batch closes with its received date.

---

### grade10-admin-grading-batches-US2-TC13-1: A shop-staff holding only the read grant cannot scan, import or finish

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
* **Trace:** grade10-admin-grading-batches-US-02

**Pre-conditions:**

* admin(holds grading:read) is on the receive panel of <a batch back from the grader, unchecked>.

**Steps:**

1. Open the receive panel.

**Expected Results:**

* No Scan, Import or Finish action is offered.

---

### grade10-admin-grading-batches-US2-TC14-1: A batch recorded arrived back reads back, unchecked and is badged after a day

**Classification:**

* **Severity:** normal
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-grading-batches-US-02

**Pre-conditions:**

* admin(holds grading:operate) is on <grade10 admin batches url>, with <a batch shipped to the grader>.

**Steps:**

1. Record the batch as arrived back at the shop.
2. Read the batches panel again a day later.

**Expected Results:**

* The batch's row reads back, unchecked, offering Receive.
* After it has stood unchecked for more than a day, the row carries the unchecked-return badge.

---

### grade10-admin-grading-batches-US2-TC15-1: A cert that grader returned in an earlier batch is refused by name

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
* **Trace:** grade10-admin-grading-batches-US-02

**Pre-conditions:**

* admin(holds grading:operate) has entered the manifest and invoice for <a batch back from the grader, unchecked>.
* <a cert> is already carried by a card in <a submission of an earlier batch at the same grader>, that batch already received.

**Steps:**

1. Scan that cert against a card in this batch.

**Expected Results:**

* The scan is refused, naming the submission that holds the cert.
* Nothing is recorded on either card, the earlier batch's card included.

---

## grade10-admin-grading-batches-US3: Operator records what did not come back as drawn

**As a** member of shop staff finishing a batch,
**I want** a card on the manifest but not in the box recorded as held by the grader with its expected date or as not returned, a damaged slab photographed before it leaves the box, and the collector emailed the same day either way,
**so that** every exception is a fact on one card with the money it changes.

### grade10-admin-grading-batches-US3-TC1-1: A card kept back by the grader is recorded held with its expected date

**Classification:**

* **Severity:** normal
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-03

**Pre-conditions:**

* admin(holds grading:operate) is finishing receiving <a batch back from the grader, unchecked>.
* <a card> is on the manifest but not found in the box; the grader's morning read gives its expected return date.

**Steps:**

1. Record the card as held by the grader.
2. Enter its expected date.

**Expected Results:**

* The card reads held by the grader, with the expected date.
* The collector is emailed the same day.

---

### grade10-admin-grading-batches-US3-TC2-1: A card missing from the box with no expected return is recorded not returned

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-03

**Pre-conditions:**

* admin(holds grading:operate) is finishing receiving <a batch back from the grader, unchecked>.
* <a card> is on the manifest but not found in the box, with no held date given.

**Steps:**

1. Record the card as not returned.

**Expected Results:**

* The card reads not returned, carrying the payout it owes.
* The collector is emailed the same day.

---

### grade10-admin-grading-batches-US3-TC3-1: A damaged slab is photographed inside the box before it is removed

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
* **Trace:** grade10-admin-grading-batches-US-03

**Pre-conditions:**

* admin(holds grading:operate) finds <a slab damaged> still inside its shipping box.

**Steps:**

1. Photograph the slab inside the box.
2. Record the card as damaged.

**Expected Results:**

* The photograph is attached to the card, taken before it left the box.
* The card reads damaged; the collector is emailed the same day.

---

### grade10-admin-grading-batches-US3-TC4-1: The rest of a submission's cards finish while one card is held

**Classification:**

* **Severity:** normal
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-03

**Pre-conditions:**

* admin(holds grading:operate) is finishing receiving <a batch back from the grader, unchecked>.
* One card of <a submission with several cards> is held by the grader; the rest are in the box.

**Steps:**

1. Record the one card as held by the grader.
2. Finish receiving the batch.

**Expected Results:**

* The submission's other cards finish and go ready with it.
* Only the held card's outcome is exceptional.

---

### grade10-admin-grading-batches-US3-TC5-1: Recording a card as held by the grader without an expected date is refused

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
* **Trace:** grade10-admin-grading-batches-US-03

**Pre-conditions:**

* admin(holds grading:operate) is recording <a card> not found in the box as held by the grader.

**Steps:**

1. Attempt to record the card held, with no expected date entered.

**Expected Results:**

* The record is refused, naming the missing expected date.

---

## grade10-admin-grading-batches-US4: Operator re-estimates a batch that is running late

**As a** member of shop staff reading the grader's order status in the morning,
**I want** to type the grader's stage onto the batch, set a new estimate with a reason, and have every collector in it emailed the day I set it,
**so that** the shop tells the collector before the collector asks.

### grade10-admin-grading-batches-US4-TC1-1: The morning read records the grader's own stage on the batch

**Classification:**

* **Severity:** normal
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-04

**Pre-conditions:**

* admin(holds grading:operate) is on the row of <a batch with the grader>.

**Test data:**

| Field | Value |
| --- | --- |
| Stage | one of the grader's own stages |
| Note | the grader's words, as typed |

**Steps:**

1. Pick the stage from the grader's own stages.
2. Type the grader's words into the note beside it.

**Expected Results:**

* The stage lands on the batch's timeline and on every submission's timeline in it.
* The note carries the grader's words; the stage itself is never free text.

---

### grade10-admin-grading-batches-US4-TC2-1: A batch past its estimate reads Due back in the warning tone

**Classification:**

* **Severity:** normal
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-04

**Pre-conditions:**

* admin(holds grading:operate) is on <grade10 admin batches url>.
* <a batch with the grader, past its estimate> holds no re-estimate yet.

**Steps:**

1. Open the batches panel.

**Expected Results:**

* The batch's row reads Due back in the warning tone, read from the clock.

---

### grade10-admin-grading-batches-US4-TC3-1: Re-estimating with a new date and a reason emails every collector in the batch

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-04

**Pre-conditions:**

* admin(holds grading:operate) is on the row of <a batch with the grader, past its estimate>, holding several submissions.

**Test data:**

| Field | Value |
| --- | --- |
| Stage | one of the grader's own stages |
| New estimate | <a later date> |
| Reason | <a reason, as typed> |

**Steps:**

1. Open Re-estimate.
2. Set the stage, the new estimate and the reason.
3. Confirm.

**Expected Results:**

* The new estimate is set with its reason on the batch.
* Every collector in the batch, however many, is emailed the day it is set.

---

### grade10-admin-grading-batches-US4-TC4-1: Re-estimating with no reason is refused

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
* **Trace:** grade10-admin-grading-batches-US-04

**Pre-conditions:**

* admin(holds grading:operate) is on the Re-estimate dialog of <a batch with the grader, past its estimate>.

**Test data:**

| Field | Value |
| --- | --- |
| Reason | left blank |

**Steps:**

1. Set the stage and a new estimate, leaving the reason blank.
2. Attempt to confirm.

**Expected Results:**

* The re-estimate is refused, naming the missing reason.

---

### grade10-admin-grading-batches-US4-TC5-1: A shop-staff holding only the read grant cannot re-estimate a batch

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
* **Trace:** grade10-admin-grading-batches-US-04

**Pre-conditions:**

* admin(holds grading:read) is on the row of <a batch with the grader, past its estimate>.

**Steps:**

1. Open the batch's row.

**Expected Results:**

* No Re-estimate action is offered.

---

### grade10-admin-grading-batches-US4-TC6-1: The stage that is the move puts every submission in the batch at grades are in

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
* **Trace:** grade10-admin-grading-batches-US-04

**Pre-conditions:**

* admin(holds grading:operate) is on the row of <a batch with the grader> holding several submissions, each at Sent.

**Test data:**

| Field | Value |
| --- | --- |
| Stage | the grader's stage that is the move to the grades being in |

**Steps:**

1. Record that stage from the grader's own stages.

**Expected Results:**

* Every submission in the batch reads grades are in.
* Each collector in the batch is emailed once.

---

### grade10-admin-grading-batches-US4-TC7-1: The same stage recorded a second morning emails nobody again

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
* **Trace:** grade10-admin-grading-batches-US-04

**Pre-conditions:**

* admin(holds grading:operate) is on the row of <a batch with the grader> whose last recorded stage is <a stage>.

**Steps:**

1. Record the same stage again.

**Expected Results:**

* Nothing further is written to the batch or its submissions.
* No collector is emailed a second time.

---

### grade10-admin-grading-batches-US4-TC8-1: A re-estimate to the date already set emails nobody again

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
* **Trace:** grade10-admin-grading-batches-US-04

**Pre-conditions:**

* admin(holds grading:operate) is on the Re-estimate dialog of <a batch with the grader> whose due date is <a date>.

**Test data:**

| Field | Value |
| --- | --- |
| New estimate | the date already set |
| Reason | <a reason, as typed> |

**Steps:**

1. Set the estimate to the date already carried and confirm.

**Expected Results:**

* Nothing further is written to the batch.
* No collector is emailed a second time.

---

### grade10-admin-grading-batches-US4-TC9-1: The due-back badge stands from the estimated day and gives way to running late

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-04

**Pre-conditions:**

* admin(holds grading:operate) is on <grade10 admin queue url>.
* <a batch with the grader> carries an estimated day back of the shop's own day and holds <a submission>.

**Steps:**

1. Read the queue on the estimated day back.
2. Read it again on the day after the estimate.
3. Finish receiving the batch and read it again.

**Expected Results:**

* On the estimated day the submission's row is badged as due back.
* On the day after the estimate the row is badged as running late in place of due back.
* Once the batch reads Received the row carries neither badge.

---

## grade10-admin-grading-batches-US5: Operator keeps the safe under its cap

**As a** member of shop staff building a batch,
**I want** the tiles to read what is closing, what is with graders and past its estimate, what is back unchecked, and the declared value in the safe, ready slabs included, against its cap, and a hand-in that would pass the cap refused at the desk with the next drop-off booked instead,
**so that** the shop never holds more than it is covered for.

### grade10-admin-grading-batches-US5-TC1-1: The tiles read the batch closing, with graders, back unchecked and the safe

**Classification:**

* **Severity:** normal
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-05

**Pre-conditions:**

* admin(holds grading:operate) is on <grade10 admin batches url>, with a batch closing today, a batch with a grader, and a batch back unchecked.

**Steps:**

1. Open the batches panel.

**Expected Results:**

* The Ship today tile names the grader, level, cards and submissions closing.
* The With graders tile counts submissions, and how many are past their estimate.
* The Back unchecked tile counts what has not been received.

---

### grade10-admin-grading-batches-US5-TC2-1: The safe's tile counts ready slabs still held toward the declared value

**Classification:**

* **Severity:** normal
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-05

**Pre-conditions:**

* admin(holds grading:operate) is on <grade10 admin batches url>, with <several slabs ready and uncollected> and <a batch checked in and not yet shipped>.

**Steps:**

1. Open the batches panel.

**Expected Results:**

* The safe's tile sums the declared value of both the checked-in cards and the ready slabs still held.

---

### grade10-admin-grading-batches-US5-TC3-1: The safe's tile turns to the warning tone at its cap

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-05

**Pre-conditions:**

* admin(holds grading:operate) is on <grade10 admin batches url>.
* The safe's declared value has reached <the safe's cap>, 30000000 (HKD, minor units).

**Steps:**

1. Open the batches panel.

**Expected Results:**

* The safe's tile reads in the warning tone.

---

### grade10-admin-grading-batches-US5-TC4-1: A hand-in that would carry the safe past its cap is refused, the next drop-off booked instead

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-05

**Pre-conditions:**

* admin(holds grading:operate) is checking in <a submission> at the counter.
* The safe already holds declared value under <the safe's cap>, and this hand-in's declared total would carry it past <the safe's cap>.

**Steps:**

1. Attempt to check in the submission.

**Expected Results:**

* Check-in is refused, naming the safe's cap.
* The next drop-off is booked for the submission instead.

---

### grade10-admin-grading-batches-US5-TC5-1: A hand-in that keeps the safe at or under its cap proceeds

**Classification:**

* **Severity:** normal
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-grading-batches-US-05

**Pre-conditions:**

* admin(holds grading:operate) is checking in <a submission> at the counter.
* The safe's declared value, with this hand-in added, stays at or under <the safe's cap>.

**Steps:**

1. Check in the submission.

**Expected Results:**

* Check-in proceeds; no cap refusal is shown.

## Reconciliation

**Run:** 2026-09-22, in the change `add-card-grading`. The blind pass read the isolated bundle its caller built - this capability's `## Purpose` and `## Feature set`, its `user-journeys.md`, the change's `proposal.md` and `decisions.md` with its `## Raised` table, `ui-design.md` with the state dispositions stripped, and the PRD pages the proposal links. It was denied every `## Requirements` section, `openspec/specs/`, `openspec/changes/archive/` and `tech-design.md`. Nothing here verifies that; it is the run's own word. The scenario pass issued `grade10-admin-grading-batches-SC-01` to `grade10-admin-grading-batches-SC-42` over sixteen ADDED requirements, and the blind suite wrote 37 cases over US1 to US5.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `grade10-admin-grading-batches-US1-TC1-1` | Reached | `grade10-admin-grading-batches-SC-11`, and the packing list of `grade10-admin-grading-batches-SC-10` |
| `grade10-admin-grading-batches-US1-TC2-1` | Folded | No scenario said a batch still taking cards offers no way to ship it; folded as `grade10-admin-grading-batches-SC-45`, with the rule on the shipping requirement |
| `grade10-admin-grading-batches-US1-TC3-1` | Reached | `grade10-admin-grading-batches-SC-12` |
| `grade10-admin-grading-batches-US1-TC4-1` | Reached | `grade10-admin-grading-batches-SC-13` |
| `grade10-admin-grading-batches-US1-TC5-1` | Reached | `grade10-admin-grading-batches-SC-15`. The case reads the warning tone, the scenario the refusal: the same rule at two altitudes. Whether a batch over the cover is split or held is Q29's open ❓ and is not in either |
| `grade10-admin-grading-batches-US1-TC6-1` | Reached | `grade10-admin-grading-batches-SC-11` |
| `grade10-admin-grading-batches-US1-TC7-1` | Folded | The console opens a batch for a trio before its first card, which no scenario said; folded as `grade10-admin-grading-batches-SC-44`, with the rule beside `Opened on first use`. Its second reading is `grade10-admin-grading-batches-SC-03` |
| `grade10-admin-grading-batches-US1-TC8-1` | Kept, stated elsewhere | The read grant is `grade10-admin/grading/counter`'s `Every act sits behind one of three grants`, walked by its US-14; no scenario folded here |
| `grade10-admin-grading-batches-US1-TC9-1` | Kept, out of the requirements | The in-flight form is presentation; the panel's colocated test decides it, and the ui-design row closes the same way |
| `grade10-admin-grading-batches-US2-TC1-1` | Reached | `grade10-admin-grading-batches-SC-23` |
| `grade10-admin-grading-batches-US2-TC2-1` | Reached | `grade10-admin-grading-batches-SC-23` |
| `grade10-admin-grading-batches-US2-TC3-1` | Reached | `grade10-admin-grading-batches-SC-25`, and the counters of `grade10-admin-grading-batches-SC-29` |
| `grade10-admin-grading-batches-US2-TC4-1` | Reached, and raised | `grade10-admin-grading-batches-SC-26`. The case asked how far `held elsewhere` reaches; Q74 settles it as one cert per grader across every batch and submission, the scan requirement now says so, and `grade10-admin-grading-batches-SC-46` states the reach |
| `grade10-admin-grading-batches-US2-TC5-1` | Reached | `grade10-admin-grading-batches-SC-27` |
| `grade10-admin-grading-batches-US2-TC6-1` | Reached | `grade10-admin-grading-batches-SC-24` |
| `grade10-admin-grading-batches-US2-TC7-1` | Reached | `grade10-admin-grading-batches-SC-28`. The case's `the card's fee stands` is the fee's fate per outcome, `grade10-site/grading/submission-lifecycle`'s and Q5's open ❓, not this capability's |
| `grade10-admin-grading-batches-US2-TC8-1` | Reached | `grade10-admin-grading-batches-SC-38`, and the reconciliation of `grade10-admin-grading-batches-SC-39` |
| `grade10-admin-grading-batches-US2-TC9-1` | Reached | `grade10-admin-grading-batches-SC-39` |
| `grade10-admin-grading-batches-US2-TC10-1` | Reached | `grade10-admin-grading-batches-SC-30` |
| `grade10-admin-grading-batches-US2-TC11-1` | Reached | `grade10-admin-grading-batches-SC-31` |
| `grade10-admin-grading-batches-US2-TC12-1` | Reached | `grade10-admin-grading-batches-SC-32`, and the batch's close in `grade10-admin-grading-batches-SC-06` |
| `grade10-admin-grading-batches-US2-TC13-1` | Kept, stated elsewhere | The read grant is the counter capability's, as `grade10-admin-grading-batches-US1-TC8-1` |
| `grade10-admin-grading-batches-US3-TC1-1` | Reached | `grade10-admin-grading-batches-SC-34`, and the same-day letter of `grade10-admin-grading-batches-SC-37` |
| `grade10-admin-grading-batches-US3-TC2-1` | Reached | `grade10-admin-grading-batches-SC-35`, and `grade10-admin-grading-batches-SC-37` |
| `grade10-admin-grading-batches-US3-TC3-1` | Reached | `grade10-admin-grading-batches-SC-36`, and `grade10-admin-grading-batches-SC-37` |
| `grade10-admin-grading-batches-US3-TC4-1` | Reached | `grade10-admin-grading-batches-SC-34` |
| `grade10-admin-grading-batches-US3-TC5-1` | Folded | No scenario refused a held card with no date the grader expects it; folded as `grade10-admin-grading-batches-SC-47`, with the rule on the exceptions requirement |
| `grade10-admin-grading-batches-US4-TC1-1` | Reached | `grade10-admin-grading-batches-SC-17` |
| `grade10-admin-grading-batches-US4-TC2-1` | Reached | `grade10-admin-grading-batches-SC-20` |
| `grade10-admin-grading-batches-US4-TC3-1` | Reached | `grade10-admin-grading-batches-SC-21` |
| `grade10-admin-grading-batches-US4-TC4-1` | Folded | The requirement refused a re-estimate with no reason and no scenario stated it; folded as `grade10-admin-grading-batches-SC-48` |
| `grade10-admin-grading-batches-US4-TC5-1` | Kept, stated elsewhere | The read grant is the counter capability's, as `grade10-admin-grading-batches-US1-TC8-1` |
| `grade10-admin-grading-batches-US5-TC1-1` | Reached | `grade10-admin-grading-batches-SC-09` |
| `grade10-admin-grading-batches-US5-TC2-1` | Reached | `grade10-admin-grading-batches-SC-40` |
| `grade10-admin-grading-batches-US5-TC3-1` | Folded | The tile at the cap was a rule with no scenario; folded as `grade10-admin-grading-batches-SC-49` |
| `grade10-admin-grading-batches-US5-TC4-1` | Reached | `grade10-admin-grading-batches-SC-41` |
| `grade10-admin-grading-batches-US5-TC5-1` | Folded | A hand-in that leaves the safe exactly at its cap is taken, which no scenario stated; folded as `grade10-admin-grading-batches-SC-49` with `grade10-admin-grading-batches-US5-TC3-1` |
| Raised: the ship form's insured total | Landed as Q73, and folded | Read-only, the sum of the batch's cards' declared values at ship, recorded as the figure declared to the courier. The shipping act no longer lists it among the fields that can be unset, the insured-total requirement carries `Derived, never typed`, and `grade10-admin-grading-batches-SC-43` states it; `grade10-admin-grading-batches-US1-TC15-1` walks it |
| Raised: how far `a cert already held elsewhere` reaches | Landed as Q74, and folded | Any card at the same grader carrying that cert, in any submission and any batch, batches already received included. The scan requirement now says so and `grade10-admin-grading-batches-SC-46` states it; `grade10-admin-grading-batches-US2-TC15-1` walks it |
| `grade10-admin-grading-batches-SC-01` | Case added | `grade10-admin-grading-batches-US1-TC10-1` - the first hand-in for a trio opens the batch |
| `grade10-admin-grading-batches-SC-02` | Case added | `grade10-admin-grading-batches-US1-TC11-1` - the second hand-in joins the standing batch |
| `grade10-admin-grading-batches-SC-04`, `grade10-admin-grading-batches-SC-08` | Case added | `grade10-admin-grading-batches-US1-TC12-1` - the cut-off passes, the row reads Closed with nothing written, and it ships the next day |
| `grade10-admin-grading-batches-SC-05` | Case added | `grade10-admin-grading-batches-US2-TC14-1` - the box arrives, the row reads back unchecked, and the badge turns after a day |
| `grade10-admin-grading-batches-SC-07` | Case added | `grade10-admin-grading-batches-US1-TC13-1` - a hand-in after the cut-off joins the next batch |
| `grade10-admin-grading-batches-SC-16` | Case added | `grade10-admin-grading-batches-US1-TC14-1` - a cover figure in another currency, refused and never converted |
| `grade10-admin-grading-batches-SC-18` | Case added | `grade10-admin-grading-batches-US4-TC6-1` - the stage that is the move carries the whole batch |
| `grade10-admin-grading-batches-SC-19` | Case added | `grade10-admin-grading-batches-US4-TC7-1` - the same stage on a second morning tells nobody again |
| `grade10-admin-grading-batches-SC-22` | Case added | `grade10-admin-grading-batches-US4-TC8-1` - a re-estimate to the date already set tells nobody again |
| `grade10-admin-grading-batches-SC-50` | Case added | `grade10-admin-grading-batches-US4-TC9-1` - the due-back badge stands from the estimated day, gives way to running late the day after, and stands no longer once the batch is received |
| `grade10-admin-grading-batches-SC-14`, `grade10-admin-grading-batches-SC-33`, `grade10-admin-grading-batches-SC-42` | Out of suite | Listed in the header: the concurrency and replay guards, verified by the backend's own tests rather than from one panel |

### Manual

| Manual | Why |
| --- | --- |
| `grade10-admin-grading-batches-US1-TC9-1` | A person watches the form while the act is in flight; the panel's colocated test proves the disabled actions, not how long they stay that way |
| `grade10-admin-grading-batches-US1-TC12-1` | The cut-off passing is a day, not an act: a person walks the row on the Friday morning, or the clock is moved for them |
| `grade10-admin-grading-batches-US2-TC14-1` | The unchecked-return badge turns after a day standing; a person reads the panel the next morning |
| `grade10-admin-grading-batches-US4-TC9-1` | The badge turns over a day boundary; a person reads the queue on the estimated day and again the morning after, or the clock is moved for them |
| `grade10-admin-grading-batches-US3-TC3-1` | A person photographs a physical slab inside the box it arrived in; a test can prove the photograph is attached, never that the slab had not been moved |
