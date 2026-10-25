# grade10-site/grading/counter-documents Test Cases

**Status:** pending-review · 0/23
**Drafts styled:** 2026-10-25, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7

## Background

* Staff is admin(holds `grading:operate`) on the submission's hand-in or hand-back runbook on the admin console. Its Sign step prepares the document and offers Show on iPad and Copy link; the link it mints, `<sign link>`, opens the document on the shop iPad for 30 minutes.
* The collector's submission page is `<submission page>` on the Grade10 site, listing each sealed document with its fingerprint and a download. `<collector inbox>` is a mailbox the tester reads.
* Signing takes the signer's typed name, and for the agreement one line of postal address, then a drawn signature and Sign, once the document is turned to its last page.

## g10.grading-counter-documents.US1: Collector signs the submission agreement at the counter

**As a** collector at the shop counter with every card checked,
**I want** to read the agreement on the iPad with the schedule of cards as checked and the figures I was quoted, type my name as on the booking with no ID asked for, give one line of postal address kept only for the written notice, and sign once,
**so that** I know exactly what I signed and the fee is only taken after it.

<!-- trace:case id=g10.grading-counter-documents.TC-ib5 rev=1 covers=g10.grading-counter-documents.SC-ofs,g10.grading-counter-documents.SC-bkh,g10.grading-counter-documents.SC-azu,g10.grading-counter-documents.SC-7ub,g10.grading-counter-documents.SC-0d4,g10.grading-counter-documents.SC-8hi,g10.grading-counter-documents.SC-0qe,g10.grading-counter-documents.SC-y94,g10.grading-counter-documents.SC-uif -->
### g10.grading-counter-documents.US1-TC1: The collector reads the agreement to its end, signs it, and the fee follows the seal

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-counter-documents-US-01

**Pre-conditions:**

* A collector's submission is drop-off booked under the name on the booking; staff started the visit, ticked Present on every card and copied the Sign step's link, which is open on the iPad.

**Steps:**

1. Turn the agreement to its last page.
2. Type the name on the booking and a one-line postal address, draw a signature and tap Sign.
3. On the runbook, read Take payment.

**Expected Results:**

* Step 1's agreement prints the submission, the collector, the grader and level, the cards as a schedule with each declared value and their total, the fee, the estimated return as weeks from the day the batch leaves, said to be an estimate and not a promise, and the date.
* Step 2 seals it, showing the sealed outcome and a download of the signed PDF.
* Step 3 takes the fee only now, after the seal.

<!-- trace:case id=g10.grading-counter-documents.TC-05a rev=1 covers=g10.grading-counter-documents.SC-ofs,g10.grading-counter-documents.SC-bkh,g10.grading-counter-documents.SC-azu,g10.grading-counter-documents.SC-7ub,g10.grading-counter-documents.SC-0d4,g10.grading-counter-documents.SC-8hi,g10.grading-counter-documents.SC-0qe,g10.grading-counter-documents.SC-y94,g10.grading-counter-documents.SC-uif -->
### g10.grading-counter-documents.US1-TC2: A level that carries cover prints a cover line per card and the cover in total

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-counter-documents-US-01

**Pre-conditions:**

* A collector's submission is drop-off booked at PSA Express, a level whose fee sheet row carries a cover rate; every card is ticked Present and the link is open on the iPad.

**Steps:**

1. Turn the agreement to its last page, and sign it.

**Expected Results:**

* The schedule shows a cover beside each card's declared value, and the cover in total beside the total declared value.

<!-- trace:case id=g10.grading-counter-documents.TC-78m rev=1 covers=g10.grading-counter-documents.SC-ofs,g10.grading-counter-documents.SC-bkh,g10.grading-counter-documents.SC-azu,g10.grading-counter-documents.SC-7ub,g10.grading-counter-documents.SC-0d4,g10.grading-counter-documents.SC-8hi,g10.grading-counter-documents.SC-0qe,g10.grading-counter-documents.SC-y94,g10.grading-counter-documents.SC-uif -->
### g10.grading-counter-documents.US1-TC11: A Bulk list of a hundred cards runs on and is signed once, on the last page

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-counter-documents-US-01

**Pre-conditions:**

* A Bulk submission of 100 cards, each named as the dealer listed it, is drop-off booked; all 100 are ticked Present and the link is open on the iPad.

**Steps:**

1. Turn the agreement through every page to its last, and sign it.

**Expected Results:**

* The agreement runs past its first page, its schedule listing all 100 cards; the signature block is on the last page alone, and the sealed agreement carries one signature there.

<!-- trace:case id=g10.grading-counter-documents.TC-uiu rev=1 covers=g10.grading-counter-documents.SC-ofs,g10.grading-counter-documents.SC-bkh,g10.grading-counter-documents.SC-azu,g10.grading-counter-documents.SC-7ub,g10.grading-counter-documents.SC-0d4,g10.grading-counter-documents.SC-8hi,g10.grading-counter-documents.SC-0qe,g10.grading-counter-documents.SC-y94,g10.grading-counter-documents.SC-uif -->
### g10.grading-counter-documents.US1-TC3: The agreement takes no signature until it is read to its end and holds a postal address

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
* **Trace:** grade10-site-grading-counter-documents-US-01

**Pre-conditions:**

* Every card is ticked Present; the agreement's link is open on the iPad.

**Test data:**

| `<left>` | `<refused, naming>` |
| --- | --- |
| the agreement on its first page, name and address typed | that the document must be read to its end |
| the postal address empty, the agreement turned to its end and the name typed | the empty postal address line, Sign disabled |

**Steps:**

1. With `<left>`, draw a signature and try Sign.
2. On the runbook, read the Sign step and Take payment.

**Expected Results:**

* Step 1 is refused, naming `<refused, naming>`.
* Step 2 shows nothing sealed and nothing paid.

<!-- trace:case id=g10.grading-counter-documents.TC-bwc rev=1 covers=g10.grading-counter-documents.SC-ofs,g10.grading-counter-documents.SC-bkh,g10.grading-counter-documents.SC-azu,g10.grading-counter-documents.SC-7ub,g10.grading-counter-documents.SC-0d4,g10.grading-counter-documents.SC-8hi,g10.grading-counter-documents.SC-0qe,g10.grading-counter-documents.SC-y94,g10.grading-counter-documents.SC-uif,g10.grading-counter-documents.SC-rfe,g10.grading-counter-documents.SC-e21,g10.grading-counter-documents.SC-fbo,g10.grading-counter-documents.SC-6eh,g10.grading-counter-documents.SC-8w2,g10.grading-counter-documents.SC-djb,g10.grading-counter-documents.SC-rtd -->
### g10.grading-counter-documents.US1-TC5: A name that is not the booking's is refused, on the agreement and on the receipt

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
* **Trace:** grade10-site-grading-counter-documents-US-01

**Pre-conditions:**

* `<document>`'s link is open on the iPad, turned to its end; nobody is named to collect.

**Test data:**

| `<document>` | `<nothing>` |
| --- | --- |
| the agreement, every card ticked Present | sealed and nothing paid |
| the hand-back receipt, the balance settled and every item ticked Handed over | sealed and nothing handed back |

**Steps:**

1. Type a name that is not the booking's, draw a signature and tap Sign.
2. On the runbook, read the Sign step.

**Expected Results:**

* Step 1 is refused by name, against the booking's name.
* Step 2 shows nothing `<nothing>`.

<!-- trace:case id=g10.grading-counter-documents.TC-ajv rev=1 covers=g10.grading-counter-documents.SC-ofs,g10.grading-counter-documents.SC-bkh,g10.grading-counter-documents.SC-azu,g10.grading-counter-documents.SC-7ub,g10.grading-counter-documents.SC-0d4,g10.grading-counter-documents.SC-8hi,g10.grading-counter-documents.SC-0qe,g10.grading-counter-documents.SC-y94,g10.grading-counter-documents.SC-uif -->
### g10.grading-counter-documents.US1-TC6: A sign link is refused past its 30 minutes, and staff can show it again

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-counter-documents-US-01

**Pre-conditions:**

* The agreement's link was minted `<age>` ago and never opened.

**Test data:**

| `<age>` | `<opens>` |
| --- | --- |
| 29 minutes | the agreement, ready to sign |
| 31 minutes | a refusal by name, saying to ask staff for a new link |

**Steps:**

1. Open the link on the iPad.
2. On the runbook, click Show on iPad on the Sign step.

**Expected Results:**

* Step 1 opens `<opens>`.
* Step 2's new link opens the same agreement.

<!-- trace:case id=g10.grading-counter-documents.TC-3mz rev=1 covers=g10.grading-counter-documents.SC-ofs,g10.grading-counter-documents.SC-bkh,g10.grading-counter-documents.SC-azu,g10.grading-counter-documents.SC-7ub,g10.grading-counter-documents.SC-0d4,g10.grading-counter-documents.SC-8hi,g10.grading-counter-documents.SC-0qe,g10.grading-counter-documents.SC-y94,g10.grading-counter-documents.SC-uif -->
### g10.grading-counter-documents.US1-TC9: The agreement seals with no identity record asked for or kept

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-counter-documents-US-01

**Pre-conditions:**

* Grading holds no identity check for the collector; every card is ticked Present and the link is open on the iPad.

**Steps:**

1. Turn the agreement to its end, and sign it.
2. Open the sealed PDF's signing certificate.
3. On the console, read the submission's collector block.

**Expected Results:**

* Step 1 seals with no identity check asked for.
* Step 2's certificate says the document was signed without an identity check.
* Step 3 holds no identity record.

<!-- trace:case id=g10.grading-counter-documents.TC-z1y rev=1 covers=g10.grading-counter-documents.SC-ofs,g10.grading-counter-documents.SC-bkh,g10.grading-counter-documents.SC-azu,g10.grading-counter-documents.SC-7ub,g10.grading-counter-documents.SC-0d4,g10.grading-counter-documents.SC-8hi,g10.grading-counter-documents.SC-0qe,g10.grading-counter-documents.SC-y94,g10.grading-counter-documents.SC-uif -->
### g10.grading-counter-documents.US1-TC10: A storage fee raised after the seal leaves the signed agreement as it was

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-counter-documents-US-01

**Pre-conditions:**

* An agreement sealed with storage at 3000 HKD minor units a card a month; the setting was then raised to 5000, approved by a second `grading:approve` holder; the submission has been ready to collect for 100 days.

**Steps:**

1. Open the sealed agreement from `<submission page>`.
2. On the hand-back runbook, read the money due.

**Expected Results:**

* Step 1 still prints 3000 HKD minor units a card a month.
* Step 2 works out what is due at the pinned 3000, not 5000.

<!-- trace:case id=g10.grading-counter-documents.TC-4dj rev=1 covers=g10.grading-counter-documents.SC-ofs,g10.grading-counter-documents.SC-bkh,g10.grading-counter-documents.SC-azu,g10.grading-counter-documents.SC-7ub,g10.grading-counter-documents.SC-0d4,g10.grading-counter-documents.SC-8hi,g10.grading-counter-documents.SC-0qe,g10.grading-counter-documents.SC-y94,g10.grading-counter-documents.SC-uif -->
### g10.grading-counter-documents.US1-TC7: In production, an agreement naming a fact not set is refused before anything renders

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Pinned figures and placeholders

**Pre-conditions:**

* In production, the custodian's registered name reads not set in the grading settings; staff ticked Present on every card.

**Steps:**

1. Click Show on iPad on the Sign step.

**Expected Results:**

* Preparing is refused, naming the unset fact; nothing is rendered, no link is minted and nothing is sealed.

<!-- trace:case id=g10.grading-counter-documents.TC-ala rev=1 covers=g10.grading-counter-documents.SC-ofs,g10.grading-counter-documents.SC-bkh,g10.grading-counter-documents.SC-azu,g10.grading-counter-documents.SC-7ub,g10.grading-counter-documents.SC-0d4,g10.grading-counter-documents.SC-8hi,g10.grading-counter-documents.SC-0qe,g10.grading-counter-documents.SC-y94,g10.grading-counter-documents.SC-uif -->
### g10.grading-counter-documents.US1-TC8: Outside production, a fact not set prints as a marked bracket

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Pinned figures and placeholders

**Pre-conditions:**

* On staging, the complaints contact reads not set; the agreement's link is open on the iPad, turned to its end, name and address typed.

**Steps:**

1. Sign, and open the sealed PDF.

**Expected Results:**

* The agreement seals, printing the complaints contact as a bracket marked as a placeholder.

---

## g10.grading-counter-documents.US2: Collector declines to sign

**As a** collector who would rather not sign on a screen,
**I want** to decline on the spot and have nothing paid and nothing signed in my name,
**so that** the member of staff with me takes it from there with nothing half-done.

<!-- trace:case id=g10.grading-counter-documents.TC-l1u rev=1 covers=g10.grading-counter-documents.SC-ub5,g10.grading-counter-documents.SC-shr -->
### g10.grading-counter-documents.US2-TC1: Declining withdraws the document with nothing paid or handed back

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
* **Trace:** grade10-site-grading-counter-documents-US-02

**Pre-conditions:**

* `<document>`'s link is open on the iPad, unsigned.

**Test data:**

| `<document>` | `<nothing>` | `<still reads>` |
| --- | --- | --- |
| the agreement, every card ticked Present | paid | Drop-off booked |
| the hand-back receipt, the balance settled and every item ticked Handed over | handed back | Ready to collect |

**Steps:**

1. Tap Decline.
2. On the console, read the Timeline tab and the runbook.

**Expected Results:**

* The document is withdrawn and the decline is recorded on the submission.
* Nothing is `<nothing>`, nothing is signed in the collector's name, and the submission still reads `<still reads>`.

<!-- trace:case id=g10.grading-counter-documents.TC-e18 rev=1 covers=g10.grading-counter-documents.SC-ub5,g10.grading-counter-documents.SC-shr -->
### g10.grading-counter-documents.US2-TC3: The desk reads a declined receipt back and can prepare it again

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-counter-documents-US-02

**Pre-conditions:**

* The collector declined a ready submission's hand-back receipt; staff is on its hand-back runbook.

**Steps:**

1. Read the Sign and Hand over steps.
2. Click Show on iPad on the Sign step.

**Expected Results:**

* Step 1 shows the decline, nothing handed over, the submission still Ready to collect.
* Step 2's new link opens the receipt.

---

## g10.grading-counter-documents.US3: Collector signs the hand-back receipt and leaves with the slabs

**As a** collector collecting my cards,
**I want** the receipt to list every cert and raw card I inspected, what was paid and paid out and how, and who collected, and to be signable only once nothing is due and every item is ticked,
**so that** the slabs are mine the moment it is sealed and the submission closes.

<!-- trace:case id=g10.grading-counter-documents.TC-n81 rev=1 covers=g10.grading-counter-documents.SC-rfe,g10.grading-counter-documents.SC-e21,g10.grading-counter-documents.SC-fbo,g10.grading-counter-documents.SC-6eh,g10.grading-counter-documents.SC-8w2,g10.grading-counter-documents.SC-djb,g10.grading-counter-documents.SC-rtd -->
### g10.grading-counter-documents.US3-TC1: The collector signs the receipt and the slabs become theirs

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-counter-documents-US-03

**Pre-conditions:**

* A collector's submission is ready to collect with nothing due; staff entered the pickup code and the collector's name, ticked Handed over on every item and copied the link, open on the iPad.

**Steps:**

1. Turn the receipt to its last page.
2. Type the collector's name, and sign.
3. On the runbook, click Hand over, and open `<submission page>`.

**Expected Results:**

* Step 1's receipt lists every encapsulated card with its cert and any card returned ungraded with its code, what was paid and paid out and how, and names the collector as who collected.
* Step 2 seals it; step 3 closes the submission, the slabs the collector's.

<!-- trace:case id=g10.grading-counter-documents.TC-akt rev=1 covers=g10.grading-counter-documents.SC-rfe,g10.grading-counter-documents.SC-e21,g10.grading-counter-documents.SC-fbo,g10.grading-counter-documents.SC-6eh,g10.grading-counter-documents.SC-8w2,g10.grading-counter-documents.SC-djb,g10.grading-counter-documents.SC-rtd -->
### g10.grading-counter-documents.US3-TC6: The receipt cannot be prepared while a balance is due or an item is unticked

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
* **Trace:** grade10-site-grading-counter-documents-US-03

**Pre-conditions:**

* A submission is ready to collect; staff entered the pickup code and the name, `<held>`.

**Test data:**

| `<held>` | `<naming>` |
| --- | --- |
| an upcharge still due, every item ticked Handed over | the balance due |
| the balance settled, one item not ticked | the item unticked |

**Steps:**

1. Read the Sign step.

**Expected Results:**

* Preparing is refused, naming `<naming>`; no Show on iPad or Copy link is offered, and nothing is handed back.

<!-- trace:case id=g10.grading-counter-documents.TC-00a rev=1 covers=g10.grading-counter-documents.SC-rfe,g10.grading-counter-documents.SC-e21,g10.grading-counter-documents.SC-fbo,g10.grading-counter-documents.SC-6eh,g10.grading-counter-documents.SC-8w2,g10.grading-counter-documents.SC-djb,g10.grading-counter-documents.SC-rtd -->
### g10.grading-counter-documents.US3-TC2: Above the declared threshold, the receipt names the ID glanced at and that nothing was kept

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-counter-documents-US-03

**Pre-conditions:**

* A ready submission declares HKD 12,000.00 in total, above the ID-glance threshold of HKD 10,000.00; staff glanced at an ID matching the collector's name and kept nothing, and the receipt's link is open.

**Steps:**

1. Turn the receipt to its end, and sign it.

**Expected Results:**

* Collected by names that an ID was matched to the name, and that nothing was kept from it.

<!-- trace:case id=g10.grading-counter-documents.TC-v41 rev=1 covers=g10.grading-counter-documents.SC-rfe,g10.grading-counter-documents.SC-e21,g10.grading-counter-documents.SC-fbo,g10.grading-counter-documents.SC-6eh,g10.grading-counter-documents.SC-8w2,g10.grading-counter-documents.SC-djb,g10.grading-counter-documents.SC-rtd -->
### g10.grading-counter-documents.US3-TC5: The receipt prints what was paid, refunded and paid out, and how

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-counter-documents-US-03

**Pre-conditions:**

* On one submission, a card withdrawn before its batch closed was refunded at the till, a card moved up a level was settled at the till, and a card not returned was paid out at its declared value, approved by a second holder; the receipt's link is open.

**Steps:**

1. Turn the receipt to its end, and sign it.

**Expected Results:**

* It prints what was paid, what was refunded and what was paid out, each with how it moved.

<!-- trace:case id=g10.grading-counter-documents.TC-0ot rev=1 covers=g10.grading-counter-documents.SC-rfe,g10.grading-counter-documents.SC-e21,g10.grading-counter-documents.SC-fbo,g10.grading-counter-documents.SC-6eh,g10.grading-counter-documents.SC-8w2,g10.grading-counter-documents.SC-djb,g10.grading-counter-documents.SC-rtd -->
### g10.grading-counter-documents.US3-TC9: Two exceptions on one hand-back print one receipt with a line per card

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-counter-documents-US-03

**Pre-conditions:**

* A ready submission of four cards: one held by the grader, one placed into a vault case with Vault instead, two ticked Handed over; the balance settled.

**Steps:**

1. Click Copy link on the Sign step, open it on the iPad, turn the receipt to its end and sign it.

**Expected Results:**

* One receipt is prepared, not one per exception, carrying a line per card: the two handed back, the one still held by the grader, and the one that went to the vault rather than to the collector.

<!-- trace:case id=g10.grading-counter-documents.TC-moq rev=1 covers=g10.grading-counter-documents.SC-rfe,g10.grading-counter-documents.SC-e21,g10.grading-counter-documents.SC-fbo,g10.grading-counter-documents.SC-6eh,g10.grading-counter-documents.SC-8w2,g10.grading-counter-documents.SC-djb,g10.grading-counter-documents.SC-rtd -->
### g10.grading-counter-documents.US3-TC3: A card the grader held keeps the submission open, and a second receipt closes it

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-counter-documents-US-03

**Pre-conditions:**

* A ready submission of four cards, one recorded Held by the grader; the other three are ticked Handed over, the balance settled.

**Steps:**

1. Sign the receipt for the three, and open `<submission page>`.
2. When the held card is back and ready, sign its second receipt, and click Hand over.

**Expected Results:**

* Step 1's receipt names the card still held, and the submission stays ready.
* Step 2's receipt prints that card alone, naming the first receipt by its date and fingerprint, and the submission reads Back with you.

---

## g10.grading-counter-documents.US4: Named person signs the receipt in the collector's place

**As a** person the collector named to collect,
**I want** the iPad to prefill my name as named on the submission page and the receipt to record that I collected,
**so that** the collector's record says who took the cards.

<!-- trace:case id=g10.grading-counter-documents.TC-idw rev=1 covers=g10.grading-counter-documents.SC-n5f,g10.grading-counter-documents.SC-vje -->
### g10.grading-counter-documents.US4-TC1: The named person's name is prefilled, takes no edit, and the receipt records them

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-counter-documents-US-04

**Pre-conditions:**

* The collector named Chan Tai Man on `<submission page>`; staff entered the pickup code and Chan Tai Man, settled the balance, ticked every item and copied the link, open on the iPad.

**Steps:**

1. Read the name field, and try to retype it as another name.
2. Turn the receipt to its end, and sign it.

**Expected Results:**

* Step 1 shows Chan Tai Man prefilled, with a hint that it was, and the line takes no edit.
* Step 2 seals under Chan Tai Man, recording that they collected in the customer's place.

---

## g10.grading-counter-documents.US5: Signer keeps a copy of every document

**As a** person who has just signed at the counter,
**I want** a download after the seal, an email with the signed PDF attached, and each document on the submission page with its fingerprint,
**so that** I hold my own copy without asking for one.

<!-- trace:case id=g10.grading-counter-documents.TC-eoe rev=1 covers=g10.grading-counter-documents.SC-nke,g10.grading-counter-documents.SC-haq,g10.grading-counter-documents.SC-7c2,g10.grading-counter-documents.SC-orn -->
### g10.grading-counter-documents.US5-TC1: A sealed document downloads there and then, and arrives attached to its step's email

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
* **Trace:** grade10-site-grading-counter-documents-US-05

**Pre-conditions:**

* `<document>` has just sealed on the iPad.

**Test data:**

| `<document>` | `<email>` | `<attached>` |
| --- | --- | --- |
| the agreement, the cards then handed in | the handed-in email | the signed agreement, with the intake receipt beside it |
| the hand-back receipt, the cards then handed over | the collection email | the signed hand-back receipt |

**Steps:**

1. Tap the download on the sealed screen.
2. Open `<email>` in `<collector inbox>`.

**Expected Results:**

* Step 1 downloads the signed PDF.
* Step 2 carries `<attached>` as PDFs.

<!-- trace:case id=g10.grading-counter-documents.TC-zpe rev=1 covers=g10.grading-counter-documents.SC-nke,g10.grading-counter-documents.SC-haq,g10.grading-counter-documents.SC-7c2,g10.grading-counter-documents.SC-orn -->
### g10.grading-counter-documents.US5-TC4: The submission page lists each document grading issued with its fingerprint

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
* **Trace:** grade10-site-grading-counter-documents-US-05

**Pre-conditions:**

* `<document>`.

**Test data:**

| `<document>` | `<listed>` |
| --- | --- |
| the agreement sealed and the cards handed in | the sealed agreement and the intake receipt |
| a card of two withdrawn from a handed-in submission before its batch closed, its fee of HKD 150.00 refunded | the withdrawal receipt, naming that card alone and the HKD 150.00 refunded, issued with nobody asked to sign it |

**Steps:**

1. Open `<submission page>`, and read its documents list.
2. Check a listed fingerprint at grading's public digest check.

**Expected Results:**

* Step 1 lists `<listed>`, each with its fingerprint and a download.
* Step 2 answers as a document grading issued.

<!-- trace:case id=g10.grading-counter-documents.TC-gtz rev=1 covers=g10.grading-counter-documents.SC-nke,g10.grading-counter-documents.SC-haq,g10.grading-counter-documents.SC-7c2,g10.grading-counter-documents.SC-orn -->
### g10.grading-counter-documents.US5-TC5: Reopening a signed link shows the sealed copy instead

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-counter-documents-US-05

**Pre-conditions:**

* A document has sealed on its link.

**Steps:**

1. Open the same link again on the iPad.

**Expected Results:**

* Signing is refused, naming that the document is already signed; the sealed copy is shown.

<!-- trace:case id=g10.grading-counter-documents.TC-0hw rev=1 covers=g10.grading-counter-documents.SC-nke,g10.grading-counter-documents.SC-haq,g10.grading-counter-documents.SC-7c2,g10.grading-counter-documents.SC-orn -->
### g10.grading-counter-documents.US5-TC6: A declined document reaches none of the three ways to a copy

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-counter-documents-US-05

**Pre-conditions:**

* The collector declined the agreement at the counter.

**Steps:**

1. Open `<submission page>`, and look for the agreement.
2. Open the latest grading email.

**Expected Results:**

* Step 1 neither lists it nor offers a download.
* Step 2 carries no attachment of it.

## Settled

- A document refused for an unset fact, a balance still due or an item unticked is not refused at the sign link: the rules refuse when the document is prepared, before anything is rendered or a link minted, so a case reaches that refusal by preparing the document.
