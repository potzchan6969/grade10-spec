# grade10-site/grading/counter-documents Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-22, tcs-rules r3.0

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

* The submission is `booked`, every card on the list has been checked against it, and the submission agreement is not yet signed.
* The collector is on `grade10.com/grading/sign#<token>`, the agreement's one active link, opened inside its 30-minute window.

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

**Expected Results:**

* The agreement prints the submission, the collector, the grader and level, the cards as a schedule with each declared value, the total declared value, the fee, the estimated return as an estimate, the date, and the complaints contact.
* The document seals, showing the sealed outcome and a download of the signed PDF.
* The fee is charged at the till only after the seal.

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

* The submission is `booked` at a level that carries a cover line, every card has been checked, and the agreement is not yet signed.
* The collector is on the agreement's active sign link.

**Test data:**

| Field | Value |
| --- | --- |
| Name typed | <the name on the booking> |
| Postal address | <a one-line postal address> |

**Steps:**

1. Scroll the agreement through to its last page.
2. Type <the name on the booking>, enter <a one-line postal address>, and sign.

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

* No postal address is saved on the collector's account, so the line is empty when the agreement opens.
* The collector is on the agreement's active sign link, with every card checked.

**Test data:**

| Field | Value |
| --- | --- |
| Name typed | <the name on the booking> |
| Postal address | (left empty) |

**Steps:**

1. Scroll the agreement through to its last page.
2. Type <the name on the booking>, leaving the postal address line empty.

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

* The collector is on the agreement's active sign link, with every card checked.

**Test data:**

| Field | Value |
| --- | --- |
| Name typed | <the name on the booking> |
| Postal address | <a one-line postal address> |

**Steps:**

1. Type <the name on the booking> and <a one-line postal address> without scrolling past the agreement's first page.
2. Attempt to sign.

**Expected Results:**

* Signing is refused by name, stating the document must be read to its end.
* Nothing is sealed and nothing is paid.

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

* The collector is on the agreement's active sign link, with every card checked, scrolled to the document's end.

**Test data:**

| Field | Value |
| --- | --- |
| Name typed | <a name that does not match the name on the booking> |
| Postal address | <a one-line postal address> |

**Steps:**

1. Type <a name that does not match the name on the booking> and <a one-line postal address>.
2. Attempt to sign.

**Expected Results:**

* Signing is refused by name, against the booking's name.
* Nothing is sealed and nothing is paid.

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

* More than 30 minutes have passed since the agreement's sign link was shown on the iPad or copied from the console.

**Steps:**

1. Open the agreement's sign link after its 30-minute window has passed.

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
* A fact the agreement prints (such as the complaints contact) is unset on the submission.
* The collector is on the agreement's active sign link, scrolled to its end, name and postal address entered.

**Steps:**

1. Attempt to sign.

**Expected Results:**

* Signing is refused, naming the unset fact.
* Nothing is sealed.

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

* The environment is outside production.
* A fact the agreement prints (such as the complaints contact) is unset on the submission.
* The collector is on the agreement's active sign link, scrolled to its end, name and postal address entered.

**Steps:**

1. Sign the agreement.

**Expected Results:**

* The agreement prints the unset fact as a marked bracket placeholder.
* The document seals.

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

* The collector is on the submission agreement's active sign link, every card checked, not yet signed.

**Steps:**

1. Open the agreement to any page.
2. Tap Decline.

**Expected Results:**

* The agreement is withdrawn, and the decline is itself recorded on the submission.
* Nothing is paid, and nothing is signed in the collector's name.

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

* The collector is on the hand-back receipt's active sign link, the balance settled and every item ticked, not yet signed.

**Steps:**

1. Open the receipt to any page.
2. Tap Decline.

**Expected Results:**

* The receipt is withdrawn, and the decline is itself recorded on the submission.
* Nothing is handed back, and nothing is signed in the collector's name.

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

* The submission is `ready`, every item is ticked, and nothing is due.
* The collector is on the hand-back receipt's active sign link, not yet signed.

**Test data:**

| Field | Value |
| --- | --- |
| Name typed | <the collector's name as on the booking> |

**Steps:**

1. Scroll the receipt through to its last page.
2. Type <the collector's name as on the booking>.
3. Draw a signature and tap Sign.

**Expected Results:**

* The receipt lists every encapsulated card with its cert and any card returned ungraded with its code, what was paid, and what was paid out and how.
* The receipt names the collector as who collected.
* The receipt seals; the slabs are the collector's from that moment and the submission closes.

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

* The submission's total declared value is above the ID-glance threshold, the balance is settled and every item is ticked.
* Staff has glanced at an ID matching the collector's name and kept nothing.

**Steps:**

1. Scroll the receipt through to its last page.
2. Type the collector's name and sign.

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

* One card on the submission is still held by the grader; the balance on the rest is settled and every other item is ticked.

**Steps:**

1. Scroll the receipt through to its last page.
2. Type the collector's name and sign.

**Expected Results:**

* The receipt names the card still held by the grader.
* The submission stays ready for the held card, pending a second hand-back to close it.

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

* One slab on the submission was placed into a vault case at the counter instead of being handed to the collector; the balance is settled and every item is ticked.

**Steps:**

1. Scroll the receipt through to its last page.
2. Type the collector's name and sign.

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

* One card on the submission was paid out at its declared value as not returned or damaged; the balance on the rest is settled and every other item is ticked.

**Steps:**

1. Scroll the receipt through to its last page.
2. Type the collector's name and sign.

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

* The submission is `ready` with an upcharge still due.

**Steps:**

1. Attempt to open the hand-back receipt's sign link.

**Expected Results:**

* The receipt cannot be prepared; signing is refused, naming the balance still due.

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

* The submission is `ready`, the balance is settled, and one item on the receipt's list is not yet ticked.

**Steps:**

1. Attempt to open the hand-back receipt's sign link.

**Expected Results:**

* The receipt cannot be prepared; signing is refused, naming the item still unticked.

---

## grade10-site-grading-counter-documents-US4: Named person signs the receipt in the collector's place

**As** somebody the collector named to collect,
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

* The collector has named a person to collect on the submission page.
* The submission is `ready`, the balance is settled, and every item is ticked.
* The named person is on the hand-back receipt's active sign link.

**Steps:**

1. Observe the name field on the sign screen.
2. Scroll the receipt through to its last page and sign.

**Expected Results:**

* The signer's name is prefilled as the person named on the submission page, with a hint that it was prefilled.
* The receipt records the named person, not the collector, as who collected.

---

## grade10-site-grading-counter-documents-US5: Signer keeps a copy of every document

**As** somebody who has just signed at the counter,
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

* A document has just sealed on its sign link.

**Steps:**

1. Observe the sealed screen after signing.
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

* The submission agreement has just sealed at hand-in.

**Steps:**

1. Open the email sent for the seal.

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

* The hand-back receipt has just sealed at collection.

**Steps:**

1. Open the email sent for the seal.

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

* At least one document has sealed on the submission.

**Steps:**

1. Open `grade10.com/grading/submissions/<id>`.

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

* A document on the submission has already sealed.

**Steps:**

1. Open the document's sign link again.

**Expected Results:**

* Signing is refused by name, naming that the document is already signed.
* The sealed copy is shown on the page.
