# grade10-site/vault/case-intake Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-22, tcs-rules r3.0

## Background

`customer(collector)` is signed in and `<grade10 vault url>` is reachable in
every case below unless a pre-condition states otherwise. Every amount is
entered in the brand's own currency; Grade10's is HKD.

## grade10-site-vault-case-intake-US1: Collector sends in a card they want cash against

**As a** collector,
**I want** to describe and photograph one card and say how much I want to
borrow against it,
**so that** the shop can value it and offer me terms before I carry it in.

### grade10-site-vault-case-intake-US1-TC1-1: Describing, photographing and sending a financed request succeeds

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
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* `customer(collector)` is on the Describe step of a new request, `<grade10 vault url>`.

**Test data:**

| Field | Value |
| --- | --- |
| Category | Trading card |
| Title | Charizard 1st Edition |
| Description | Near-mint, unopened sleeve since grading. |
| WhatsApp number | +852 9123 4567 |
| Amount requested | 500000 (HKD, minor units) |

**Steps:**

1. Fill in the category, title, description, WhatsApp number and the amount from **Test data**, then click Continue.
2. Attach one photograph on the Photograph step, then click Continue.
3. Tick the collection statement and click Send it in.

**Expected Results:**

* The request moves from draft to submitted, in the financed lane.
* The case page offers to book a visit.

---

### grade10-site-vault-case-intake-US1-TC2-1: Leaving the amount blank opens the storage lane

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
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* `customer(collector)` is on the Describe step of a new request, `<grade10 vault url>`.

**Test data:**

| Field | Value |
| --- | --- |
| Category | Coin |
| Title | 1oz Britannia |
| Description | Graded, capsule intact. |
| Amount requested | none — left blank |

**Steps:**

1. Fill in the category, title and description from **Test data**, leave the amount blank, then click Continue.
2. Attach one photograph on the Photograph step, then click Continue.
3. Tick the collection statement and click Send it in.

**Expected Results:**

* The request opens in the storage lane, with no financing offer to answer.

---

### grade10-site-vault-case-intake-US1-TC3-1: Title and description at their character caps are accepted

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
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* `customer(collector)` is on the Describe step of a new request, `<grade10 vault url>`.

**Test data:**

| Field | Value |
| --- | --- |
| Title | exactly 200 characters |
| Description | exactly 2,000 characters |

**Steps:**

1. Fill in the category, then the title and description at their **Test data** lengths, then click Continue.

**Expected Results:**

* Continue succeeds; the Photograph step opens.

---

### grade10-site-vault-case-intake-US1-TC4-1: Title or description over its character cap refuses Continue

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* `customer(collector)` is on the Describe step of a new request, `<grade10 vault url>`.

**Test data:**

| Field | Value | Outcome |
| --- | --- | --- |
| Title | 201 characters | Continue refused, title too long |
| Description | 2,001 characters | Continue refused, description too long |

**Steps:**

1. Fill in the category, then the field from **Test data** at the row's length, then click Continue.

**Expected Results:**

* Continue is refused with the row's message; the Describe step stays open.

---

### grade10-site-vault-case-intake-US1-TC5-1: Ten photographs at the size cap all attach

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
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* `customer(collector)` is on the Photograph step of a draft, no photographs attached yet.

**Test data:**

| Field | Value |
| --- | --- |
| Photographs | ten JPEG files, each exactly 20 MB |

**Steps:**

1. Attach the ten photographs from **Test data** one at a time.

**Expected Results:**

* All ten attach; the dropzone reads 10 of 10.

---

### grade10-site-vault-case-intake-US1-TC6-1: An eleventh photograph is refused at the limit

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
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* `customer(collector)` is on the Photograph step of a draft with ten photographs already attached.

**Steps:**

1. Attempt to attach an eleventh photograph.

**Expected Results:**

* The eleventh photograph is refused with the limit message; the count stays at ten.

---

### grade10-site-vault-case-intake-US1-TC7-1: An oversized photograph is refused

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
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* `customer(collector)` is on the Photograph step of a draft, fewer than ten photographs attached.

**Test data:**

| Field | Value |
| --- | --- |
| Photograph | a JPEG file over 20 MB |

**Steps:**

1. Attempt to attach the photograph from **Test data**.

**Expected Results:**

* The photograph is refused with the size message; nothing attaches.

---

### grade10-site-vault-case-intake-US1-TC8-1: A non-raster file is refused

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
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* `customer(collector)` is on the Photograph step of a draft, fewer than ten photographs attached.

**Test data:**

| Field | Value |
| --- | --- |
| File | a PDF |

**Steps:**

1. Attempt to attach the file from **Test data**.

**Expected Results:**

* The file is refused with the type message; nothing attaches.

---

### grade10-site-vault-case-intake-US1-TC9-1: An empty file is refused

**Classification:**

* **Severity:** normal
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* `customer(collector)` is on the Photograph step of a draft, fewer than ten photographs attached.

**Test data:**

| Field | Value |
| --- | --- |
| File | a zero-byte JPEG |

**Steps:**

1. Attempt to attach the file from **Test data**.

**Expected Results:**

* The file is refused with the empty message; nothing attaches.

---

### grade10-site-vault-case-intake-US1-TC10-1: Sending in with no photograph is refused

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
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* `customer(collector)` is on the Photograph step of a draft with its item facts complete and no photographs attached.

**Steps:**

1. Click Continue past the Photograph step with no photograph attached.

**Expected Results:**

* Continue is refused with the at-least-one-photo message; the case stays a draft.

---

### grade10-site-vault-case-intake-US1-TC11-1: Location metadata is stripped from an uploaded photograph

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* `customer(collector)` is on the Photograph step of a draft.

**Test data:**

| Field | Value |
| --- | --- |
| Photograph | a JPEG carrying GPS location metadata |

**Steps:**

1. Attach the photograph from **Test data**.

**Expected Results:**

* The stored photograph carries no location metadata, before and after the upload.

---

### grade10-site-vault-case-intake-US1-TC12-1: A photograph is refused to a collector who does not own the case

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* `customer(collector A)` has a case with a photograph attached.
* `customer(collector B)` is signed in on a different account.

**Steps:**

1. `customer(collector B)` requests `customer(collector A)`'s photograph directly.

**Expected Results:**

* The request is refused; the photograph is not returned.

---

### grade10-site-vault-case-intake-US1-TC13-1: Viewing a photograph is recorded on the read trail

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* `customer(collector)` has a case with a photograph attached.

**Steps:**

1. `customer(collector)` opens the photograph.

**Expected Results:**

* A read of the photograph is recorded, naming who read it and when.

---

### grade10-site-vault-case-intake-US1-TC14-1: A fourth draft is refused at the draft cap

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
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* `customer(collector)` already has three unsent drafts, on the case list, `<grade10 vault url>`.

**Steps:**

1. Click Start a request.

**Expected Results:**

* Start a request is refused with the draft-limit message; no new draft opens.

---

### grade10-site-vault-case-intake-US1-TC15-1: Reopening a draft resumes it on the Photograph step

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
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* `customer(collector)` has a draft with its item facts complete and two photographs already attached, on the case list, `<grade10 vault url>`.

**Steps:**

1. Click Open on the draft's card.

**Expected Results:**

* The wizard opens on the Photograph step, showing two of ten attached.

---

### grade10-site-vault-case-intake-US1-TC16-1: Sending a draft already moved on is refused

**Classification:**

* **Severity:** major
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* `customer(collector)` has already sent the same draft from another session; this session still shows it as a draft on the Review step.

**Steps:**

1. Tick the collection statement and click Send it in.

**Expected Results:**

* Send it in is refused with a case-moved-on message; no second case is created.

---

### grade10-site-vault-case-intake-US1-TC17-1: A WhatsApp number typed differently stores one canonical value

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* `customer(collector)` is on the Describe step of a new request, `<grade10 vault url>`.

**Test data:**

| Field | Value |
| --- | --- |
| WhatsApp number, typed | +852 9123 4567 |
| WhatsApp number, typed | 85291234567 |

**Steps:**

1. Fill in the required item facts, type the row's WhatsApp number, then click Continue.

**Expected Results:**

* Both rows store the same canonical E.164 number against the case.

---

### grade10-site-vault-case-intake-US1-TC18-1: An invalid WhatsApp number is refused

**Classification:**

* **Severity:** normal
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* `customer(collector)` is on the Describe step of a new request, `<grade10 vault url>`.

**Test data:**

| Field | Value |
| --- | --- |
| WhatsApp number | 123-abc |

**Steps:**

1. Fill in the required item facts, type the number from **Test data**, then click Continue.

**Expected Results:**

* Continue is refused with an invalid-number message; the Describe step stays open.

---

### grade10-site-vault-case-intake-US1-TC19-1: Leaving the WhatsApp number blank is accepted

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
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* `customer(collector)` is on the Describe step of a new request, `<grade10 vault url>`.

**Steps:**

1. Fill in the required item facts, leave the WhatsApp number blank, then click Continue.

**Expected Results:**

* Continue succeeds; the Photograph step opens.

---

### grade10-site-vault-case-intake-US1-TC20-1: A case always opens in the brand's own currency

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* `customer(collector)` has an open request on Grade10.

**Steps:**

1. Send the request with an amount, naming a currency other than HKD.

**Expected Results:**

* The request is refused; the case is never opened in the other currency.

---

## grade10-site-vault-case-intake-US4: Collector checks the request before sending it

**As a** collector on the last step of the wizard,
**I want** to read my request back, see what happens next, and tick that I
have read the collection statement,
**so that** I send what I meant and know what I agreed to.

### grade10-site-vault-case-intake-US4-TC1-1: Reviewing and ticking the statement sends the request

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-intake-US-04

**Pre-conditions:**

* `customer(collector)` is on the Review step of a draft with its item facts and one photograph complete.

**Steps:**

1. Read the item facts and photograph read back on the step.
2. Tick the collection statement.
3. Click Send it in.

**Expected Results:**

* The request sends; the version of the statement shown at the tick is recorded with it.

---

### grade10-site-vault-case-intake-US4-TC2-1: Editing a block returns to its step without losing the rest

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-vault-case-intake-US-04

**Pre-conditions:**

* `customer(collector)` is on the Review step of a draft with its item facts and one photograph complete.

**Steps:**

1. Click Edit on the item-facts block.
2. Change the title, then return to the Review step.

**Expected Results:**

* The Review step reads back the changed title.
* The photograph block is unchanged.

---

### grade10-site-vault-case-intake-US4-TC3-1: The review step names what happens next

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-vault-case-intake-US-04

**Pre-conditions:**

* `customer(collector)` is on the Review step of a draft with its item facts and one photograph complete.

**Steps:**

1. Read the What happens next block.

**Expected Results:**

* Three items are listed, naming what the shop does with the request.

---

### grade10-site-vault-case-intake-US4-TC4-1: Sending without ticking the statement is refused

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
* **Trace:** grade10-site-vault-case-intake-US-04

**Pre-conditions:**

* `customer(collector)` is on the Review step of a draft with its item facts and one photograph complete, statement unticked.

**Steps:**

1. Click Send it in without ticking the statement.

**Expected Results:**

* Send it in is refused with a line under the tick; the request is not sent.

---

### grade10-site-vault-case-intake-US4-TC5-1: The statement reads "Being prepared" outside production

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-vault-case-intake-US-04

**Pre-conditions:**

* `customer(collector)` is on the Review step outside production, Legal's statement text not yet supplied.

**Steps:**

1. Click the statement link.
2. Return, tick the statement, and click Send it in.

**Expected Results:**

* The linked page reads "Being prepared".
* The request still sends.

---

### grade10-site-vault-case-intake-US4-TC6-1: Sending is refused in production while the statement is unset

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
* **Trace:** grade10-site-vault-case-intake-US-04

**Pre-conditions:**

* `customer(collector)` is on the Review step in production, Legal's statement text unset.

**Steps:**

1. Tick the statement and click Send it in.

**Expected Results:**

* Send it in is refused by name; the request is not sent.

---

### grade10-site-vault-case-intake-US4-TC7-1: Finish later from the review step saves without sending

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
* **Trace:** grade10-site-vault-case-intake-US-04

**Pre-conditions:**

* `customer(collector)` is on the Review step of a draft with its item facts and one photograph complete, statement ticked.

**Steps:**

1. Click Finish later.

**Expected Results:**

* The draft is saved as it stands, tick included; the request is not sent.

---

## grade10-site-vault-case-intake-US5: Collector gets a reference they can say and type

**As a** collector,
**I want** a short reference for my case,
**so that** I can read it out at the counter and type it as the transfer
reference at my bank.

### grade10-site-vault-case-intake-US5-TC1-1: Sending the request issues a readable reference

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-intake-US-05

**Pre-conditions:**

* `customer(collector)` is on the Review step of a draft with its item facts and one photograph complete, statement ticked.

**Steps:**

1. Click Send it in.

**Expected Results:**

* A six-character reference is shown in mono on the Sent step, drawn only from digits and capitals excluding 0, O, 1, I and L.
* The same reference is named in the confirmation email.
* The case's own list card shows the reference beside the item.

---

### grade10-site-vault-case-intake-US5-TC2-1: A reference draw that collides is redrawn

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-05

**Pre-conditions:**

* Grade10 already has an open case whose reference matches the next value the draw would otherwise produce.

**Steps:**

1. Send in a new request on Grade10.

**Expected Results:**

* The new case's reference does not match the existing case's; the draw was redrawn rather than shared.

---

### grade10-site-vault-case-intake-US5-TC3-1: A reference is unique per brand, not across brands

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-05

**Pre-conditions:**

* Grade10 already has an open case whose reference matches the next value ZZZ's draw would otherwise produce.

**Steps:**

1. Send in a new request on the ZZZ site, `<zzz-site vault url>`.

**Expected Results:**

* The ZZZ case is issued that reference; the clash with Grade10's case is not checked across brands.

---

### grade10-site-vault-case-intake-US5-TC4-1: A reference is never reused, even after its case ends

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-05

**Pre-conditions:**

* A Grade10 case that has since ended holds a known reference.

**Steps:**

1. Send in a new request on Grade10 after the earlier case has ended.

**Expected Results:**

* The new case's reference never matches the ended case's reference.

---

### grade10-site-vault-case-intake-US5-TC5-1: The case's own address still uses the id after the reference is issued

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
* **Trace:** grade10-site-vault-case-intake-US-05

**Pre-conditions:**

* `customer(collector)` has just sent a request and reads its reference on the Sent step.

**Steps:**

1. Open the case from the Sent step.

**Expected Results:**

* The case opens at its id-based address, `<grade10 vault case url>`; the reference is shown in the header beside the item.

---

### grade10-site-vault-case-intake-US5-TC6-1: The several-items note offers another request without disturbing this one

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-vault-case-intake-US-05

**Pre-conditions:**

* `customer(collector)` has just sent a request and is on the Sent step, with another item still to describe.

**Steps:**

1. Click Start another request.

**Expected Results:**

* A new draft opens; the case just sent keeps its reference and status unchanged.

---

### grade10-site-vault-case-intake-US5-TC7-1: Not now opens the case that was just sent

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-05

**Pre-conditions:**

* `customer(collector)` has just sent a request and is on the Sent step.

**Steps:**

1. Click Not now.

**Expected Results:**

* The case opens at its own address instead of starting a visit booking.

---

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| grade10-site/vault/case-intake | What triggers the Photograph step's "empty" refusal — a zero-byte file, an unreadable image, or something else — since the feature set names the four dropzone refusals but not this one's cause? | |
| grade10-site/vault/case-intake | What produces `request.caseConflict` on Send it in — the same draft already sent from another session, a draft cancelled elsewhere, or something else — since the wizard states carry the flag with no trigger described? | |
| grade10-site/vault/case-intake | Is the amount field on the Describe step labelled with the brand's currency for the collector to see, or is the brand-only currency enforced silently with no label? | |
| grade10-site/vault/case-intake | Which typed forms of a WhatsApp number does the canonical-number rule treat as the same person — spacing and dashes, a leading `+852`, a bare eight-digit local number — since the feature set states the outcome and not the input variants it covers? | |
| grade10-site/vault/case-intake | Does the 20 MB photograph cap also bound the ten photographs together, or only each one on its own? | |

## Settled
