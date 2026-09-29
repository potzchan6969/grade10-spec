# grade10-site/grading/counter-documents Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-29, tcs-rules r4

**Out of suite:**

- `grade10-site-grading-counter-documents-SC-01` — walked in `grade10-admin/grading/counter`'s suite, at its `grade10-admin-grading-counter-US-11`
- `grade10-site-grading-counter-documents-SC-03` — walked in `grade10-admin/grading/counter`'s suite, at its `grade10-admin-grading-counter-US-02`
- `grade10-site-grading-counter-documents-SC-13` — walked in `grade10-admin/grading/counter`'s suite, at its `grade10-admin-grading-counter-US-03`
- `grade10-site-grading-counter-documents-SC-15` — walked in `grade10-admin/grading/counter`'s suite, at its `grade10-admin-grading-counter-US-02`

## grade10-site-grading-counter-documents-US1: Collector signs the submission agreement at the counter

**As a** collector at the shop counter with every card checked,
**I want** to read the agreement on the iPad with the schedule of cards as checked and the figures I was quoted, type my name as on the booking with no ID asked for, give one line of postal address kept only for the written notice, and sign once,
**so that** I know exactly what I signed and the fee is only taken after it.

### grade10-site-grading-counter-documents-US1-TC1-1: Collector reads the agreement to the end and signs it

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
* **Trace:** grade10-site-grading-counter-documents-US-01

**Pre-conditions:**

* customer(collector)'s submission is Drop-off booked under <the name on the booking>, booked from its page's drop-off picker, and its agreement is not yet signed.
* admin(holds grading:operate) has started the visit at the desk on the submission's hand-in runbook at <grade10 admin grading submission url>, ticked Present on every card, and clicked Copy link on the Sign step.
* The collector has <grade10 grading sign link> open on the shop iPad, inside its 30 minutes.

**Test data:**

| Field | Value |
| --- | --- |
| Name typed | <the name on the booking> |
| Postal address | <a one-line postal address> |

**Steps:**

1. Scroll the agreement through to its last page.
2. Type <the name on the booking> as the signer's name.
3. Enter <a one-line postal address>.
4. Draw a signature and tap Sign.
5. On the runbook, read Take payment.

**Expected Results:**

* Step 1: the agreement prints the submission, the collector, the grader and level, the cards as a schedule with each declared value, the total declared value, the fee, the estimated return as an estimate, the date, and the complaints contact.
* Step 4: the document seals, showing the sealed outcome and a download of the signed PDF.
* Step 5: the fee is charged at the till only after the seal.

### grade10-site-grading-counter-documents-US1-TC2-1: Cover schedule prints for a level that carries cover

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
* **Trace:** grade10-site-grading-counter-documents-US-01

**Pre-conditions:**

* customer(collector)'s submission is Drop-off booked at <cover level>, booked from its page's drop-off picker, and its agreement is not yet signed.
* admin(holds grading:operate) has ticked Present on every card on its hand-in runbook at <grade10 admin grading submission url> and clicked Copy link on the Sign step.
* The collector has <grade10 grading sign link> open on the shop iPad, inside its 30 minutes.

**Test data:**

| Field | Value |
| --- | --- |
| <cover level> | A level whose fee sheet row carries a cover rate: PSA Express or Super Express as seeded |
| Name typed | <the name on the booking> |
| Postal address | <a one-line postal address> |

**Steps:**

1. Scroll the agreement through to its last page.
2. Type <the name on the booking> as the signer's name.
3. Enter <a one-line postal address>.
4. Draw a signature and tap Sign.

**Expected Results:**

* The schedule shows a cover column beside each card's declared value.
* The schedule totals the cover across every card, beside the total declared value.

### grade10-site-grading-counter-documents-US1-TC3-1: Sign stays disabled while the postal address is empty

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
* **Trace:** grade10-site-grading-counter-documents-US-01

**Pre-conditions:**

* customer(collector) has no account, or one with no postal address saved, so the address line is empty when the agreement opens.
* Every card is ticked Present on the submission's hand-in runbook, and the collector has <grade10 grading sign link> for the agreement open on the shop iPad, inside its 30 minutes.

**Test data:**

| Field | Value |
| --- | --- |
| Name typed | <the name on the booking> |
| Postal address | (left empty) |

**Steps:**

1. Scroll the agreement through to its last page.
2. Type <the name on the booking> as the signer's name, leaving the postal address line empty.
3. Read Sign.

**Expected Results:**

* Sign is disabled, naming the empty postal address line as the reason.

### grade10-site-grading-counter-documents-US1-TC4-1: Signing is refused before the document is fully read

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
* **Trace:** grade10-site-grading-counter-documents-US-01

**Pre-conditions:**

* Every card is ticked Present on the submission's hand-in runbook at <grade10 admin grading submission url>, and the collector has <grade10 grading sign link> for the agreement open on the shop iPad, on its first page, inside its 30 minutes.

**Test data:**

| Field | Value |
| --- | --- |
| Name typed | <the name on the booking> |
| Postal address | <a one-line postal address> |

**Steps:**

1. Type <the name on the booking> and <a one-line postal address> without scrolling past the agreement's first page.
2. Draw a signature and tap Sign.
3. On the runbook, read the Sign step and Take payment.

**Expected Results:**

* Step 2: signing is refused by name, stating the document must be read to its end.
* Step 3: nothing is sealed and nothing is paid.

### grade10-site-grading-counter-documents-US1-TC5-1: Signing is refused when the typed name mismatches the booking

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
* **Trace:** grade10-site-grading-counter-documents-US-01

**Pre-conditions:**

* Every card is ticked Present on the submission's hand-in runbook at <grade10 admin grading submission url>, and the collector has <grade10 grading sign link> for the agreement open on the shop iPad, scrolled to its end, inside its 30 minutes.

**Test data:**

| Field | Value |
| --- | --- |
| Name typed | <a name that does not match the name on the booking> |
| Postal address | <a one-line postal address> |

**Steps:**

1. Type <a name that does not match the name on the booking> and <a one-line postal address>.
2. Draw a signature and tap Sign.
3. On the runbook, read the Sign step and Take payment.

**Expected Results:**

* Step 2: signing is refused by name, against the booking's name.
* Step 3: nothing is sealed and nothing is paid.

### grade10-site-grading-counter-documents-US1-TC6-1: Signing is refused once the sign link has expired

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-counter-documents-US-01

**Pre-conditions:**

* More than 30 minutes have passed since the agreement's <grade10 grading sign link> was shown on the iPad or copied from the console, and it was never opened.

**Steps:**

1. Open <grade10 grading sign link> on the shop iPad.

**Expected Results:**

* Signing is refused by name, naming that staff must issue a new link.

### grade10-site-grading-counter-documents-US1-TC7-1: Sealing is refused in production with a fact unset

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
* **Trace:** grade10-site-grading-counter-documents-US-01

**Pre-conditions:**

* The environment is production.
* A fact the agreement prints, such as the complaints contact, is unset for the brand: <grade10 admin grading settings url> reads it as not set.
* The submission is Drop-off booked, and admin(holds grading:operate) has ticked Present on every card on its hand-in runbook at <grade10 admin grading submission url>.

**Steps:**

1. Click Show on iPad on the Sign step.

**Expected Results:**

* Preparing is refused, naming the unset fact.
* Nothing is rendered, no sign link is minted, and nothing is sealed.

### grade10-site-grading-counter-documents-US1-TC8-1: An unset fact prints as a placeholder outside production

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
* **Trace:** grade10-site-grading-counter-documents-US-01

**Pre-conditions:**

* The environment is staging or the local stack.
* A fact the agreement prints, such as the complaints contact, is unset: <grade10 admin grading settings url> reads it as not set.
* The collector has <grade10 grading sign link> for the agreement open on the shop iPad, scrolled to its end, name and postal address entered.

**Steps:**

1. Draw a signature and tap Sign.
2. Tap the download and open the sealed PDF.

**Expected Results:**

* Step 1: the document seals.
* Step 2: the agreement prints the unset fact as a marked bracket placeholder.

### grade10-site-grading-counter-documents-US1-TC9-1: Agreement seals with no identity record asked for or kept

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-counter-documents-US-01

**Pre-conditions:**

* Grading holds no identity check for customer(collector), and none is asked for at the counter.
* Every card is ticked Present on the submission's hand-in runbook at <grade10 admin grading submission url>, and the collector has <grade10 grading sign link> for the agreement open on the shop iPad, inside its 30 minutes.

**Test data:**

| Field | Value |
| --- | --- |
| Name typed | <the name on the booking> |
| Postal address | <a one-line postal address> |

**Steps:**

1. Scroll the agreement through to its last page.
2. Type <the name on the booking> as the signer's name.
3. Enter <a one-line postal address>.
4. Draw a signature and tap Sign.
5. Tap the download and open the sealed PDF's signing certificate.
6. On the console, open the submission's record and read the collector block.

**Expected Results:**

* Step 4: the seal is not refused for want of an identity check.
* Steps 1 to 4 and step 6: no identity check is read, asked for or kept against the submission.
* Step 5: the signing certificate says the document was signed without an identity check.

### grade10-site-grading-counter-documents-US1-TC10-1: A storage fee raised after the seal leaves the signed agreement as it was

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
* **Trace:** grade10-site-grading-counter-documents-US-01

**Pre-conditions:**

* The agreement sealed with the storage fee at 3000 HKD minor units a card a month.
* The storage fee setting is then changed to 5000 HKD minor units a card a month on <grade10 admin grading settings url>, by one `grading:approve` holder and approved by a second.
* The submission is Ready to collect with storage accrued: on the local stack, seeded Ready to collect with its ready day 100 days back before the setting changed.

**Test data:**

| Field | Value |
| --- | --- |
| Storage fee at signing | 3000 HKD minor units |
| Storage fee after the change | 5000 HKD minor units |

**Steps:**

1. Open the sealed agreement from the documents on <grade10 grading submission page url>.
2. On <grade10 admin grading submission url>, open the hand-back runbook and read the money due.

**Expected Results:**

* Step 1: the sealed agreement still prints 3000 HKD minor units a card a month.
* Step 2: what is due on that submission is worked out at the pinned 3000, not the new 5000.

### grade10-site-grading-counter-documents-US1-TC11-1: A Bulk list of a hundred cards runs on and is signed once, on the last page

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
* **Trace:** grade10-site-grading-counter-documents-US-01

**Pre-conditions:**

* customer(collector)'s submission is Drop-off booked at Bulk with 100 cards, planned from a pasted list of 100 lines, and its agreement is not yet signed.
* admin(holds grading:operate) has ticked Present on all 100 cards on its hand-in runbook at <grade10 admin grading submission url> and clicked Copy link on the Sign step.
* The collector has <grade10 grading sign link> open on the shop iPad, inside its 30 minutes.

**Test data:**

| Field | Value |
| --- | --- |
| Cards | 100, each named as the dealer listed it |
| Name typed | <the name on the booking> |
| Postal address | <a one-line postal address> |

**Steps:**

1. Scroll the agreement through every page to its last.
2. Type <the name on the booking> as the signer's name.
3. Enter <a one-line postal address>.
4. Draw a signature and tap Sign.

**Expected Results:**

* Step 1: the schedule lists all 100 cards, running on past the first page.
* Step 4: the signature block is on the last page alone, and the sealed agreement carries one signature there.

---

## grade10-site-grading-counter-documents-US2: Collector declines to sign

**As a** collector who would rather not sign on a screen,
**I want** to decline on the spot and have nothing paid and nothing signed in my name,
**so that** the member of staff with me takes it from there with nothing half-done.

### grade10-site-grading-counter-documents-US2-TC1-1: Declining the agreement withdraws it with nothing paid

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
* **Trace:** grade10-site-grading-counter-documents-US-02

**Pre-conditions:**

* Every card is ticked Present on the submission's hand-in runbook at <grade10 admin grading submission url>, and the collector has <grade10 grading sign link> for the agreement open on the shop iPad, not yet signed, inside its 30 minutes.

**Steps:**

1. Open the agreement to any page.
2. Tap Decline.
3. On the console, open the submission's Timeline tab.
4. On the runbook, read the Sign step and Take payment.

**Expected Results:**

* Steps 2 and 3: the agreement is withdrawn, and the decline is itself recorded on the submission.
* Step 4: nothing is paid, and nothing is signed in the collector's name.

### grade10-site-grading-counter-documents-US2-TC2-1: Declining the receipt withdraws it with nothing handed back

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
* **Trace:** grade10-site-grading-counter-documents-US-02

**Pre-conditions:**

* The submission is Ready to collect; on its hand-back runbook at <grade10 admin grading submission url> admin(holds grading:operate) has entered the pickup code and the collector's name, settled the balance, ticked Handed over on every item, and clicked Copy link on the Sign step.
* The collector has <grade10 grading sign link> for the receipt open on the shop iPad, not yet signed, inside its 30 minutes.

**Steps:**

1. Open the receipt to any page.
2. Tap Decline.
3. On the console, open the submission's Timeline tab.
4. On the runbook, read the Sign step and Hand over.

**Expected Results:**

* Steps 2 and 3: the receipt is withdrawn, and the decline is itself recorded on the submission.
* Step 4: nothing is handed back, and nothing is signed in the collector's name.

### grade10-site-grading-counter-documents-US2-TC3-1: The desk reads a declined receipt back and can prepare it again

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-counter-documents-US-02

**Pre-conditions:**

* The submission is Ready to collect, and the collector declined its hand-back receipt on <grade10 grading sign link> on the shop iPad.
* admin(holds grading:operate) is on the submission's hand-back runbook at <grade10 admin grading submission url>.

**Steps:**

1. Read the Sign step.
2. Read the Hand over step.
3. Click Show on iPad on the Sign step.

**Expected Results:**

* Step 1: the step shows the decline.
* Step 2: nothing is handed over; the submission still reads Ready to collect.
* Step 3: minting again is offered, and a new link opens the receipt.

---

## grade10-site-grading-counter-documents-US3: Collector signs the hand-back receipt and leaves with the slabs

**As a** collector collecting my cards,
**I want** the receipt to list every cert and raw card I inspected, what was paid and paid out and how, and who collected, and to be signable only once nothing is due and every item is ticked,
**so that** the slabs are mine the moment it is sealed and the submission closes.

### grade10-site-grading-counter-documents-US3-TC1-1: Collector signs the receipt and the slabs become theirs

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
* **Trace:** grade10-site-grading-counter-documents-US-03

**Pre-conditions:**

* customer(collector)'s submission is Ready to collect with nothing due: on the local stack, seeded Ready to collect, which prints its pickup code.
* On the hand-back runbook at <grade10 admin grading submission url>, admin(holds grading:operate) has entered the pickup code and the collector's name, ticked Handed over on every item, and clicked Copy link on the Sign step.
* The collector has <grade10 grading sign link> for the receipt open on the shop iPad, not yet signed.

**Test data:**

| Field | Value |
| --- | --- |
| Name typed | <the collector's name as on the booking> |

**Steps:**

1. Scroll the receipt through to its last page.
2. Type <the collector's name as on the booking>.
3. Draw a signature and tap Sign.
4. On the runbook, click Hand over.
5. Open <grade10 grading submission page url> for the submission.

**Expected Results:**

* Step 1: the receipt lists every encapsulated card with its cert and any card returned ungraded with its code, what was paid, and what was paid out and how.
* Step 1: the receipt names the collector as who collected.
* Steps 3 to 5: the receipt seals; the slabs are the collector's from that moment and the submission closes.

### grade10-site-grading-counter-documents-US3-TC2-1: Receipt names the ID glance above the declared threshold

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-counter-documents-US-03

**Pre-conditions:**

* The submission's total declared value is above the ID-glance threshold, and it is Ready to collect with the balance settled.
* On the hand-back runbook at <grade10 admin grading submission url>, admin(holds grading:operate) has entered the pickup code and the collector's name, glanced at an ID matching that name and kept nothing, ticked Handed over on every item, and clicked Copy link on the Sign step.
* The collector has <grade10 grading sign link> for the receipt open on the shop iPad.

**Test data:**

| Field | Value |
| --- | --- |
| Total declared | 1200000 HKD minor units (HKD 12,000.00), or any total above 1000000 |

**Steps:**

1. Scroll the receipt through to its last page.
2. Type the collector's name.
3. Draw a signature and tap Sign.

**Expected Results:**

* Collected by names that an ID was matched to the name and that nothing was kept.

### grade10-site-grading-counter-documents-US3-TC3-1: Receipt names a card still held by the grader

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
* **Trace:** grade10-site-grading-counter-documents-US-03

**Pre-conditions:**

* One card on the submission was recorded Held by the grader on its batch's Receive page before Finish receiving, and the submission is Ready to collect.
* On the hand-back runbook at <grade10 admin grading submission url>, the balance on the rest is settled, every other item is ticked Handed over, and Copy link was clicked on the Sign step.
* The collector has <grade10 grading sign link> for the receipt open on the shop iPad.

**Steps:**

1. Scroll the receipt through to its last page.
2. Type the collector's name.
3. Draw a signature and tap Sign.
4. Open <grade10 grading submission page url> for the submission.

**Expected Results:**

* Step 1: the receipt names the card still held by the grader.
* Step 4: the submission stays ready for the held card, pending a second hand-back to close it.

### grade10-site-grading-counter-documents-US3-TC4-1: Receipt says a slab went to the vault instead

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
* **Trace:** grade10-site-grading-counter-documents-US-03

**Pre-conditions:**

* The submission is Ready to collect with the balance settled.
* On its hand-back runbook at <grade10 admin grading submission url>, one slab was placed into a vault case with Vault instead, every other item is ticked Handed over, and Copy link was clicked on the Sign step.
* The collector has <grade10 grading sign link> for the receipt open on the shop iPad.

**Steps:**

1. Scroll the receipt through to its last page.
2. Type the collector's name.
3. Draw a signature and tap Sign.

**Expected Results:**

* The receipt says that card went to the vault rather than to the collector.

### grade10-site-grading-counter-documents-US3-TC5-1: Receipt names a card paid out as lost or damaged

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
* **Trace:** grade10-site-grading-counter-documents-US-03

**Pre-conditions:**

* One card was recorded Not returned or Damaged on its batch's Receive page, and paid out at its declared value from the submission's Money tab at <grade10 admin grading submission url>, approved by a second `grading:approve` holder.
* The submission is Ready to collect; on its hand-back runbook the balance on the rest is settled, every other item is ticked Handed over, and Copy link was clicked on the Sign step.
* The collector has <grade10 grading sign link> for the receipt open on the shop iPad.

**Steps:**

1. Scroll the receipt through to its last page.
2. Type the collector's name.
3. Draw a signature and tap Sign.

**Expected Results:**

* The receipt names what was paid out and how.

### grade10-site-grading-counter-documents-US3-TC6-1: Receipt cannot be prepared while a balance is due

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
* **Trace:** grade10-site-grading-counter-documents-US-03

**Pre-conditions:**

* The submission is Ready to collect with an upcharge still due: a card recorded moved up a level on its batch's Receive page.
* On its hand-back runbook at <grade10 admin grading submission url>, admin(holds grading:operate) has entered the pickup code and the name and ticked Handed over on every item, and has not taken payment.

**Steps:**

1. Read the Sign step.
2. Look for Show on iPad and Copy link on it.

**Expected Results:**

* Preparing is refused by name, naming the balance still due.
* No sign link is minted and nothing is handed back.

### grade10-site-grading-counter-documents-US3-TC7-1: Receipt cannot be prepared while an item is unticked

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
* **Trace:** grade10-site-grading-counter-documents-US-03

**Pre-conditions:**

* The submission is Ready to collect with the balance settled.
* On its hand-back runbook at <grade10 admin grading submission url>, admin(holds grading:operate) has entered the pickup code and the name, and left one item not ticked Handed over.

**Steps:**

1. Read the Sign step.
2. Look for Show on iPad and Copy link on it.

**Expected Results:**

* Preparing is refused by name, naming the item still unticked.
* No sign link is minted and nothing is handed back.

### grade10-site-grading-counter-documents-US3-TC8-1: Receipt refuses a name the submission does not hold

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
* **Trace:** grade10-site-grading-counter-documents-US-03

**Pre-conditions:**

* The submission is Ready to collect with nobody named to collect; the balance is settled and every item is ticked Handed over on its hand-back runbook.
* The signer has <grade10 grading sign link> for the receipt open on the shop iPad, scrolled to its end.

**Test data:**

| Field | Value |
| --- | --- |
| Name typed | <a name that is neither the booking's nor a named person's> |

**Steps:**

1. Type <a name that is neither the booking's nor a named person's>.
2. Draw a signature and tap Sign.
3. On the runbook, read the Sign step and Hand over.

**Expected Results:**

* Step 2: signing is refused by name, against the booking's name.
* Step 3: nothing is sealed and nothing is handed back.

### grade10-site-grading-counter-documents-US3-TC9-1: Two exceptions on one hand-back print one receipt with a line per card

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
* **Trace:** grade10-site-grading-counter-documents-US-03

**Pre-conditions:**

* A Ready to collect submission of four cards: one recorded Held by the grader on its batch's Receive page, one placed into a vault case with Vault instead on the hand-back runbook, and the other two ticked Handed over.
* The balance is settled, and admin(holds grading:operate) is on the hand-back runbook at <grade10 admin grading submission url>.

**Steps:**

1. Click Copy link on the Sign step.
2. Open <grade10 grading sign link> on the shop iPad.
3. Scroll the receipt through to its last page.
4. Type the collector's name.
5. Draw a signature and tap Sign.

**Expected Results:**

* Step 1: one receipt is prepared for the hand-back, not one per exception.
* Step 3: it carries a line per card stating that card's outcome: the two handed back, the one still held by the grader, and the one that went to the vault.

### grade10-site-grading-counter-documents-US3-TC10-1: The second receipt prints the late card alone and names the first

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
* **Trace:** grade10-site-grading-counter-documents-US-03

**Pre-conditions:**

* A submission of four cards whose other three were handed back on a sealed first receipt, with one card held by the grader; that card has since come back and the submission is Ready to collect.
* On the second hand-back's runbook at <grade10 admin grading submission url>, admin(holds grading:operate) has entered the pickup code and the name, ticked Handed over on the one item, and clicked Copy link on the Sign step.
* The collector has <grade10 grading sign link> for the second receipt open on the shop iPad.

**Steps:**

1. Scroll the second receipt through to its last page.
2. Type the collector's name.
3. Draw a signature and tap Sign.
4. On the runbook, click Hand over.
5. Open <grade10 grading submission page url> for the submission.

**Expected Results:**

* Step 1: the second receipt prints the card handed back late alone, and names the first receipt by its date and fingerprint.
* Step 5: the submission is closed by the second receipt: it reads Back with you.

---

## grade10-site-grading-counter-documents-US4: Named person signs the receipt in the collector's place

**As a** person the collector named to collect,
**I want** the iPad to prefill my name as named on the submission page and the receipt to record that I collected,
**so that** the collector's record says who took the cards.

### grade10-site-grading-counter-documents-US4-TC1-1: Named person's iPad prefills their name and the receipt records them

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
* **Trace:** grade10-site-grading-counter-documents-US-04

**Pre-conditions:**

* The collector named <named person> in Their name on <grade10 grading submission page url> while the submission was Ready to collect.
* On the hand-back runbook at <grade10 admin grading submission url>, admin(holds grading:operate) has entered the pickup code and <named person>, settled the balance, ticked Handed over on every item, and clicked Copy link on the Sign step.
* The named person has <grade10 grading sign link> for the receipt open on the shop iPad.

**Test data:**

| Field | Value |
| --- | --- |
| <named person> | Chan Tai Man |

**Steps:**

1. Read the name field on the sign screen.
2. Scroll the receipt through to its last page.
3. Draw a signature and tap Sign.

**Expected Results:**

* Step 1: the signer's name is prefilled as the person named on the submission page, with a hint that it was prefilled.
* Step 3: the receipt records the named person, not the collector, as who collected.

### grade10-site-grading-counter-documents-US4-TC2-1: The named person's prefilled name does not take an edit

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-counter-documents-US-04

**Pre-conditions:**

* The collector named <the person named on the submission page> in Their name on <grade10 grading submission page url> while the submission was Ready to collect.
* On the hand-back runbook at <grade10 admin grading submission url>, the balance is settled, every item is ticked Handed over, and Copy link was clicked on the Sign step.
* The named person has <grade10 grading sign link> for the receipt open on the shop iPad.

**Test data:**

| Field | Value |
| --- | --- |
| Name prefilled | <the person named on the submission page> |
| Name retyped | <any other name> |

**Steps:**

1. Attempt to retype the prefilled name as <any other name>.
2. Scroll the receipt through to its last page.
3. Draw a signature and tap Sign.

**Expected Results:**

* Step 1: the name line does not take the edit.
* Step 3: the receipt seals under the name the submission page holds, and records that person as who collected.

---

## grade10-site-grading-counter-documents-US5: Signer keeps a copy of every document

**As a** signer who has just signed at the counter,
**I want** a download after the seal, an email with the signed PDF attached, and each document on the submission page with its fingerprint,
**so that** I hold my own copy without asking for one.

### grade10-site-grading-counter-documents-US5-TC1-1: Signer downloads the signed PDF right after the seal

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
* **Trace:** grade10-site-grading-counter-documents-US-05

**Pre-conditions:**

* A document has just sealed on <grade10 grading sign link> on the shop iPad, and the sealed screen shows.

**Steps:**

1. Read the sealed screen.
2. Tap the download.

**Expected Results:**

* The signed PDF downloads to the device.

### grade10-site-grading-counter-documents-US5-TC2-1: Sealed agreement's email attaches the agreement and intake receipt

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
* **Trace:** grade10-site-grading-counter-documents-US-05

**Pre-conditions:**

* The submission agreement sealed and the cards were handed in under <collector email>: on the local stack, a submission seeded at Handed in, whose hand-in sends the handed-in email to the grading outbox for that address.

**Steps:**

1. Open the latest grading email to <collector email>: the handed-in email sent for the seal.

**Expected Results:**

* The email carries the signed agreement as an attached PDF, with the intake receipt attached beside it.

### grade10-site-grading-counter-documents-US5-TC3-1: Sealed receipt's email attaches the signed hand-back receipt

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
* **Trace:** grade10-site-grading-counter-documents-US-05

**Pre-conditions:**

* The hand-back receipt sealed and the cards were handed over under <collector email>: on the local stack, a submission seeded at Back with you, whose hand-back sends the collection email to the grading outbox for that address.

**Steps:**

1. Open the latest grading email to <collector email>: the collection email sent for the seal.

**Expected Results:**

* The email carries the signed hand-back receipt as an attached PDF.

### grade10-site-grading-counter-documents-US5-TC4-1: Submission page lists each document with its fingerprint

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
* **Trace:** grade10-site-grading-counter-documents-US-05

**Pre-conditions:**

* At least one document has sealed on the submission: on the local stack, a submission seeded at Handed in.

**Steps:**

1. Open <grade10 grading submission page url> for the submission.
2. Read its documents list.

**Expected Results:**

* Each sealed document is listed with a fingerprint that tells the signed copy apart from an unsigned one.

### grade10-site-grading-counter-documents-US5-TC5-1: Reopening a signed link shows the sealed copy instead

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
* **Trace:** grade10-site-grading-counter-documents-US-05

**Pre-conditions:**

* A document on the submission has already sealed on <grade10 grading sign link>, on the shop iPad.

**Steps:**

1. Open the same <grade10 grading sign link> again on the shop iPad.

**Expected Results:**

* Signing is refused by name, naming that the document is already signed.
* The sealed copy is shown on the page.

### grade10-site-grading-counter-documents-US5-TC6-1: A declined document reaches none of the three ways to a copy

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
* **Trace:** grade10-site-grading-counter-documents-US-05

**Pre-conditions:**

* The collector declined the submission agreement on <grade10 grading sign link> at the counter, and it was withdrawn.

**Steps:**

1. Open <grade10 grading submission page url> for the submission.
2. Look for the declined agreement in the documents list.
3. Open the latest grading email to <collector email>.

**Expected Results:**

* Step 2: the declined document is not listed and no download is offered for it.
* Step 3: no email carries it as an attachment.

### grade10-site-grading-counter-documents-US5-TC7-1: A fingerprint grading never issued answers as none of its own

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
* **Trace:** grade10-site-grading-counter-documents-US-05

**Pre-conditions:**

* At least one document has sealed on the submission, so <grade10 grading submission page url> lists fingerprints.

**Test data:**

| Field | Value |
| --- | --- |
| Digest checked | <the SHA-256 of a PDF grading never issued or sealed> |

**Steps:**

1. Check <the SHA-256 of a PDF grading never issued or sealed> against grading's public digest check, and read the API response.
2. Check the fingerprint the submission page lists for a sealed document the same way.

**Expected Results:**

* Step 1: the unknown digest answers that it is not one grading issued or sealed, and names nobody.
* Step 2: the listed fingerprint answers as one grading sealed.


### grade10-site-grading-counter-documents-US5-TC8-1: A withdrawn card's receipt is issued and listed with its fingerprint

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
* **Trace:** grade10-site-grading-counter-documents-US-05

**Pre-conditions:**

* A Handed in submission of two cards, each with its fee paid, its batch not yet closed: handed in through its hand-in runbook before the week's cut-off. A submission seeded at Handed in will not do: the seed closes its batch at the hand-in.
* admin(holds grading:operate) is on the submission's Cards tab at <grade10 admin grading submission url>.

**Test data:**

| Field | Value |
| --- | --- |
| Fee refunded | 15000 minor units (HKD 150.00) |

**Steps:**

1. Click Withdraw a card on the first card, and confirm the refund and the receipt.
2. Open <grade10 grading submission page url> for the submission.
3. Check the listed fingerprint of the withdrawal receipt against grading's public digest check.

**Expected Results:**

* Step 1 issues a receipt naming the withdrawn card alone and the fee of 15000 minor units refunded for it, with nobody asked to sign it and no signing link minted.
* Step 2 lists the withdrawal receipt with its fingerprint and a download, and the withdrawal email carries it attached.
* Step 3 answers as a document grading issued.

---

## Reconciliation

**Run:** the blind pass read the isolated bundle — this capability's `## Purpose`
and `## Feature set`, its `user-journeys.md`, the change's `proposal.md` and
`decisions.md` with its `## Raised` table, `ui-design.md` with the state
dispositions stripped, and the PRD pages the proposal links. It was denied every
`## Requirements` section, `openspec/specs/` beyond the two included sections,
`openspec/changes/archive/` and `tech-design.md`. Nothing verifies that line; it
is the run's own statement. The scenario pass issued `SC-01` to `SC-27` over
eight ADDED requirements; the blind suite wrote 23 cases over `US1` to `US5`.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| Raised: does the receipt's signing block refuse a name mismatch the way the agreement's does? | **Raised, folded in** | It does, against the booking's name or the named person's. Folded as `grade10-site-grading-counter-documents-SC-28` and a line on the ceremony requirement's `**The name**` rule; landed as `Q57`. Case `grade10-site-grading-counter-documents-US3-TC8-1` added |
| Raised: is the named person's prefilled name editable? | **Raised, folded in** | It is fixed — the collector named them and the counter's ID glance checks it. Folded as `grade10-site-grading-counter-documents-SC-29` and a `**The named person**` rule on the hand-back receipt; landed as `Q58`. Case `grade10-site-grading-counter-documents-US4-TC2-1` added |
| Raised: do two receipt-worthy exceptions on one submission print one receipt or two? | **Raised, folded in** | One receipt per hand-back, with a line per card stating that card's outcome. Folded as `grade10-site-grading-counter-documents-SC-30` and a `**Several outcomes at once**` rule; landed as `Q59`. Case `grade10-site-grading-counter-documents-US3-TC9-1` added |
| `grade10-site-grading-counter-documents-US1-TC1-1` — "the fee is charged at the till only after the seal" | **Kept, stated elsewhere** | Grading's money is the counter's and the lifecycle's, not this capability's paper; `Q4` decides it and no scenario is folded here |
| `grade10-site-grading-counter-documents-US1-TC3-1` — Sign *disabled* rather than refused | **Kept, no change** | The same rule as `grade10-site-grading-counter-documents-SC-06`; the disabled control is that refusal's presentation, and the `Postal address empty` design row carries it |
| `grade10-site-grading-counter-documents-US1-TC7-1`, `…-US3-TC6-1`, `…-US3-TC7-1` — refusal fired at the sign link | **Amended** | The rules refuse at preparation, before anything is rendered (`grade10-site-grading-counter-documents-SC-23`, `…-SC-02`), so the three cases could not be reached as written. Steps moved to preparing the document; no behaviour claimed beyond the scenarios |
| `grade10-site-grading-counter-documents-US4-TC1-1` — "with a hint that it was prefilled" | **Kept, presentation** | Not behaviour: the hint is the `Receipt, named person` design row, and the case keeps it as an observation |
| `grade10-site-grading-counter-documents-SC-05` — signed with no identity record | **Case added** | `grade10-site-grading-counter-documents-US1-TC9-1` |
| `grade10-site-grading-counter-documents-SC-22` — a figure pinned at signing | **Case added** | `grade10-site-grading-counter-documents-US1-TC10-1` |
| `grade10-site-grading-counter-documents-SC-26` — a declined document on none of the three | **Case added** | `grade10-site-grading-counter-documents-US5-TC6-1` |
| `grade10-site-grading-counter-documents-SC-27` — a digest grading never issued | **Case added** | `grade10-site-grading-counter-documents-US5-TC7-1` |
| `grade10-site-grading-counter-documents-SC-31` — a Bulk list of a hundred cards runs on | **Case added** | `grade10-site-grading-counter-documents-US1-TC11-1`; the paper ran to one page when the suite was drawn, and a Bulk list of 100 could not be printed on it (`Q112`) |
| `grade10-site-grading-counter-documents-SC-01` — the agreement waits for every card to be checked | **Out of suite:** `grade10-admin/grading/counter`'s suite | Its only anchor is that capability's `grade10-admin-grading-counter-US-11`; staff at the desk walk it, nobody here |
| `grade10-site-grading-counter-documents-SC-03` — the intake receipt is issued rather than signed | **Out of suite:** `grade10-admin/grading/counter`'s suite | Its only anchor is `grade10-admin-grading-counter-US-02`; no signer ever meets the intake receipt on a link |
| `grade10-site-grading-counter-documents-SC-13` — a card refused at the check is off the schedule | **Out of suite:** `grade10-admin/grading/counter`'s suite | Its only anchor is `grade10-admin-grading-counter-US-03`, the refusal staff make |
| `grade10-site-grading-counter-documents-SC-15` — the intake receipt names every intake id | **Out of suite:** `grade10-admin/grading/counter`'s suite | Its only anchor is `grade10-admin-grading-counter-US-02`; `grade10-site-grading-counter-documents-US5-TC2-1` walks the attachment alone |
| `grade10-site-grading-counter-documents-SC-20` — a withdrawn card has a receipt of its own | **Case added** | `grade10-site-grading-counter-documents-US5-TC8-1`. It was routed out of suite, serving `grade10-site-grading-submission-lifecycle-US-02`, while the document table named no such document. The table now lists the withdrawal receipt as issued, so the scenario serves `grade10-site-grading-counter-documents-US-05`, the copy the collector keeps |
| `grade10-site-grading-counter-documents-SC-18` — the second receipt | **Kept, stated elsewhere** | The second receipt prints only its own cards and names the first. `grade10-site-grading-counter-documents-US3-TC3-1` stops at the first receipt, and `grade10-admin-grading-counter-US4-TC10-1` walks the second hand-back |

### Manual

| Manual | Why |
| --- | --- |
| `grade10-site-grading-counter-documents-US1-TC1-1` | An automated test decides the rendered agreement and the seal; a person reads the printed page on the iPad and watches the fee reach the till only after it |
| `grade10-site-grading-counter-documents-US3-TC1-1` | The cards are on the desk and the balance settles at the POS; no automated test decides that the slabs left with the collector |
| `grade10-site-grading-counter-documents-US3-TC2-1` | The ID glance is staff's act at the counter; the receipt's line is all software sees, so a person confirms the glance happened and nothing was kept |
