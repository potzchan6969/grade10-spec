# grade10-site/vault/case-intake Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-01, tcs-rules r4

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
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-intake-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/request.spec.ts`

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
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/request.spec.ts`

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
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/request.spec.ts`

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
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/request.spec.ts`

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
| Photographs | ten different JPEG files, each exactly 20,971,520 bytes (20 MB) |

**Steps:**

1. Attach the ten photographs from **Test data** one at a time.

**Expected Results:**

* All ten attach to the draft.

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
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/request.spec.ts`

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
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/request.spec.ts`

**Pre-conditions:**

* `customer(collector)` is on the Photograph step of a draft, fewer than ten photographs attached.

**Test data:**

| Field | Value |
| --- | --- |
| Photograph | a JPEG file of 20,971,521 bytes, one past 20 MB |

**Steps:**

1. Attempt to attach the photograph from **Test data**.

**Expected Results:**

* The photograph is refused by name; nothing attaches.

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
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/request.spec.ts`

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
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/request.spec.ts`

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
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/request.spec.ts`

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
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/request.spec.ts`

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
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/request.spec.ts`

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
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/request.spec.ts`

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
| WhatsApp number, typed | ９１２３ ４５６７ |

**Steps:**

1. Fill in the required item facts, type the row's WhatsApp number, then click Continue.

**Expected Results:**

* Every row stores the same canonical E.164 number against the case.

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
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/request.spec.ts`

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
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/request.spec.ts`

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

### grade10-site-vault-case-intake-US1-TC21-1: A photograph offered after the request is sent is refused

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** `Opening a request`

**Pre-conditions:**

* `customer(collector)` has sent a request in, and the case carries one photograph.

**Steps:**

1. Offer a further photograph against the sent case.

**Expected Results:**

* The photograph is refused by name; the case still carries one photograph and nothing is stored.

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
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-intake-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/request.spec.ts`

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
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/request.spec.ts`

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
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/request.spec.ts`

**Pre-conditions:**

* `customer(collector)` is on the Review step of a draft with its item facts and one photograph complete, statement ticked.

**Steps:**

1. Click Finish later.

**Expected Results:**

* The request is not sent.
* It is listed as an unsent request on the collector's own list.

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
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-intake-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/request.spec.ts`

**Pre-conditions:**

* `customer(collector)` is on the Review step of a draft with its item facts and one photograph complete, statement ticked.

**Steps:**

1. Click Send it in.

**Expected Results:**

* A six-character reference is shown in mono on the Sent step, drawn only from digits and capitals excluding 0, O, 1, I and L.
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
* **Trace:** `The case reference`

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
* **Status:** deprecated
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
* **Trace:** `The case reference`

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
* **Trace:** `The case reference`

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
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/request.spec.ts`

**Pre-conditions:**

* `customer(collector)` has just sent a request and is on the Sent step.

**Steps:**

1. Click Not now.

**Expected Results:**

* The case opens at its own address instead of starting a visit booking.

---

### grade10-site-vault-case-intake-US5-TC8-1: An unsent draft already carries the reference it keeps

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
* **Trace:** grade10-site-vault-case-intake-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/request.spec.ts`

**Pre-conditions:**

* `customer(collector)` has opened a request and left it unsent, on the case list, `<grade10 vault url>`.

**Steps:**

1. Read the reference on the draft's card.
2. Open the draft, attach one photograph, tick the collection statement and click Send it in.
3. Read the reference on the Sent step.

**Expected Results:**

* The unsent draft already carries a six-character reference of the alphabet, before the request is sent.
* The reference on the Sent step is the one the draft carried.

---

## grade10-site-vault-case-intake-US6: Collector sends a request staff opened for them at the counter

**As a** collector whose request staff opened at the counter,
**I want** to sign in on my own phone, read the request and the photos back,
and tick that I have read the collection statement before I send it,
**so that** nothing happens to my item on a request I have not seen, and a
request typed under the wrong address is never emailed.

### grade10-site-vault-case-intake-US6-TC1-1: The collector signs in, finds the draft staff opened and sends it

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
* **Trace:** grade10-site-vault-case-intake-US-06

**Pre-conditions:**

* Staff opened a walk-in draft `<case_1>` for `<walk-in email>`, financed, 500000 HKD minor units, with title Charizard 1st Edition and two of staff's photographs; nobody has signed in to that account yet.
* The collection statement shows at version `<statement version>`.
* customer(collector) holds `<walk-in email>`'s mailbox, on their own phone, signed out, at `grade10.com/vault`.

**Test data:**

| Field | Value |
| --- | --- |
| `<statement version>` | the version the Review step shows; outside production with no wording set, the unwritten version |

**Steps:**

1. Ask for a sign-in link for `<walk-in email>` in the sign-in dialog.
2. Open the link from the mailbox.
3. Read the case list.
4. Open `<case_1>` from its card.
5. Continue to the Review step and read what it reads back.
6. Tick the collection statement and click Send it in.
7. As admin(staff, holds vault:read), open the queue's Needs staff view on <grade10 admin vault queue url>.

**Expected Results:**

* Step 3 lists `<case_1>` as a draft, reading that staff opened it at the counter.
* Step 4 opens the wizard at its photograph step, carrying both of staff's photographs.
* Step 5 reads back the title, the amount and both of staff's photographs.
* Step 6 sends the request: it reads submitted, the statement's `<statement version>` kept with the send, and the page offers to book a visit.
* Step 7 lists `<case_1>`; it has left the Drafts view.

### grade10-site-vault-case-intake-US6-TC2-1: The collector changes staff's facts and photographs before sending

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
* **Trace:** grade10-site-vault-case-intake-US-06

**Pre-conditions:**

* customer(collector) is signed in at `grade10.com/vault` and holds walk-in draft `<case_1>`, opened by staff with title Charizard 1st Edition, 500000 HKD minor units, and two of staff's photographs.

**Steps:**

1. Open `<case_1>` from the case list.
2. Remove one of staff's photographs.
3. Attach one of the collector's own.
4. On the Describe step, change the title to Charizard 1st Edition PSA 9 and the amount to 300000 HKD minor units.
5. Continue to the Review step.
6. Tick the collection statement and click Send it in.
7. As admin(staff, holds vault:read), open `<case_1>` on <grade10 admin vault case url>.

**Expected Results:**

* Step 5 reads back the new title, 300000 HKD minor units, staff's remaining photograph and the collector's own.
* Step 7 shows the request as the collector sent it, not as staff typed it.
* Nothing was emailed to the collector before step 6's send.

### grade10-site-vault-case-intake-US6-TC3-1: The statement shown at the counter does not stand in for the collector's tick

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
* **Trace:** grade10-site-vault-case-intake-US-06

**Pre-conditions:**

* customer(collector) is signed in and on the Review step of walk-in draft `<case_1>`, whose open kept the statement shown at the counter; the tick is unticked.

**Steps:**

1. Click Send it in without ticking the statement.

**Expected Results:**

* Send it in is refused with a line under the tick.
* `<case_1>` stays a draft.

### grade10-site-vault-case-intake-US6-TC4-1: A walk-in draft fills the collector's draft cap

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-vault-case-intake-US-06

**Pre-conditions:**

* customer(collector) is signed in and on the case list at `grade10.com/vault`, holding the unsent drafts in the row.

**Test data:**

| Unsent drafts held | Continue on the Describe step |
| --- | --- |
| one walk-in draft and one of their own | reaches the photograph step |
| one walk-in draft and two of their own | refused with the draft-limit message |
| three walk-in drafts | refused with the draft-limit message |

**Steps:**

1. Click Start a request.
2. On the Describe step, choose a category, type a title, choose storage and click Continue.

**Expected Results:**

* Step 2's outcome matches the row; a refusal opens no new draft, and the case list still holds the drafts in the row.

### grade10-site-vault-case-intake-US6-TC5-1: A walk-in draft is not another collector's to read

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
* **Trace:** grade10-site-vault-case-intake-US-06

**Pre-conditions:**

* Staff opened walk-in draft `<case_1>` under `<walk-in email>`'s account, with two of staff's photographs.
* customer(collector) is signed in at `grade10.com/vault` under a different account.
* The tester holds `<photo_1 address>`, the address `<case_1>`'s staff case page loads its first photograph from.

**Steps:**

1. Read the case list.
2. Open `grade10.com/vault/cases/<case_1 id>`.
3. Open `<photo_1 address>`.

**Expected Results:**

* Step 1 does not list `<case_1>`.
* Step 2 reads the not-found page.
* Step 3 is refused; the photograph is not served.

### grade10-site-vault-case-intake-US6-TC6-1: Nothing is valued, booked or emailed on a draft staff opened until it is sent

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
* **Trace:** grade10-site-vault-case-intake-US-06

**Pre-conditions:**

* Staff opened walk-in draft `<case_1>` for `<walk-in email>`, a mailbox the tester reads, with one of staff's photographs.
* customer(collector) holding `<walk-in email>` is signed in at `grade10.com/vault`.
* admin(staff, holds vault:operate and vault:approve) has `<case_1>`'s page open on <grade10 admin vault case url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<mail delivery window>` | 5 minutes (assumed; any wait past the first send attempt) |

**Steps:**

1. As staff, read the acts `<case_1>`'s page offers.
2. As the collector, read `<case_1>` on the case list and open it.
3. Wait <mail delivery window> and read `<walk-in email>`'s inbox.

**Expected Results:**

* Step 1 offers Cancel, and nothing to value and no visit to book.
* Step 2 offers no visit to book.
* Step 3 holds no message about `<case_1>`.

### grade10-site-vault-case-intake-US6-TC7-1: The collector removes a photograph before the send and never after

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
* **Trace:** grade10-site-vault-case-intake-US-06

**Pre-conditions:**

* customer(collector) is signed in at `grade10.com/vault`.
* `<case_1>` is a draft staff opened for them at the counter, carrying staff's photographs `<photo_a>` and `<photo_b>`; `<case_2>` is a request they sent, carrying two photographs.
* The tester holds `<photo_a address>`, the address `<case_1>`'s staff case page loads `<photo_a>` from.

**Steps:**

1. Open `<case_1>`.
2. Remove `<photo_a>`.
3. Open `<photo_a address>`.
4. Open `<case_2>` and try to remove one of its photographs.

**Expected Results:**

* Step 2 leaves `<case_1>` carrying `<photo_b>` alone.
* Step 3 is refused; `<photo_a>` is no longer served.
* Step 4 is refused by name, and `<case_2>` still carries both photographs.
* `<case_1>` carries no contact number until the collector adds one.

---

## Settled

- The Photograph step's empty refusal catches a zero-byte file, refused the way anything that is not a JPEG, PNG or WebP is refused.
- The 20 MB cap bounds each photograph; nothing bounds the ten together but the count of ten.
- The conflict on Send it in is the case-lifecycle guard — the draft moved between the session reading it and the send landing — so the send is refused by name and no second case opens.
- Whether the Describe step's amount field names the brand's currency is the product manager's to confirm; the recommendation is that it does, and the refusal of any other currency stands either way.
- Which typed forms of a number are one is decided on `docs/prds/products/grade10-site/vault/collector-pages.md`: spacing, `+852` or `00852`, the bare local number, full-width digits and `852` before a local number store as one.
- Taken at landing: a send is refused in production while no collection statement wording is set; outside production it goes through.

## Reconciliation

**Run:** 2026-09-22, change `complete-vault-collector-flow`, capability
`grade10-site/vault/case-intake`. The blind pass read an isolated bundle: this
capability's `## Purpose` and `## Feature set` outline, its `user-journeys.md`,
the change's `proposal.md` and `decisions.md` — `## Raised` included — its
`ui-design.md` with the state dispositions stripped, and the PRD pages the
proposal links. Denied: every `## Requirements` section, `openspec/specs/`
beyond the two outline sections, `openspec/changes/archive/`, and
`tech-design.md`. The scenario pass read the same anchors and the durable
requirements, and neither pass saw the other's file before this join.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `US1-TC1-1`, `US1-TC2-1` | Covered | `grade10-site-vault-case-intake-SC-05`, `grade10-site-vault-case-intake-SC-06`, `grade10-site-vault-case-intake-SC-13`, `grade10-site-vault-case-intake-SC-14`, `grade10-site-vault-case-intake-SC-15`, `grade10-site-vault-case-intake-SC-17` — the two lanes walked end to end |
| `US1-TC3-1`, `US1-TC4-1` | Folded | `grade10-site-vault-case-intake-SC-24` and `grade10-site-vault-case-intake-SC-25`. The durable requirement `A request states one item, in the brand's own currency` tables the 200 and 2,000 character caps and no scenario stated them; the change now opens that requirement in a MODIFIED block and the two scenarios land there |
| `US1-TC5-1`, `US1-TC7-1` | Folded; question landed | `grade10-site-vault-case-intake-SC-28` and `grade10-site-vault-case-intake-SC-29`, in a MODIFIED block on the photograph requirement, which now names the cap in bytes, 20,971,520, so the bound cannot move with a rounded megabyte. Whether the cap also bounds the ten together landed as Q57 — it does not |
| `US1-TC6-1` | Covered | `grade10-site-vault-case-intake-SC-08` |
| `US1-TC8-1` | Covered | `grade10-site-vault-case-intake-SC-09` |
| `US1-TC9-1` | Covered; question landed | A zero-byte JPEG is not one of the three image types, so `grade10-site-vault-case-intake-SC-09` refuses it by name; the blind pass's question about what the empty refusal catches landed as Q57 |
| `US1-TC10-1` | Covered | `grade10-site-vault-case-intake-SC-13` |
| `US1-TC11-1` | Covered | `grade10-site-vault-case-intake-SC-11` |
| `US1-TC12-1` | Covered | `grade10-site-vault-case-intake-SC-12` |
| `US1-TC13-1` | Folded | `grade10-site-vault-case-intake-SC-30`, in a MODIFIED block on `A photograph is stored without its location and read under a trail`, which states the ledger and had no scenario for a recorded read |
| `US1-TC14-1` | Covered | `grade10-site-vault-case-intake-SC-07` |
| `US1-TC15-1` | Covered | `grade10-site-vault-case-intake-SC-01` |
| `US1-TC16-1` | Covered by another capability | `grade10-site-vault-case-lifecycle-SC-04` — a case that moved under the caller is refused by name; the blind pass's question about what produces `request.caseConflict` landed as Q58, and the design's Moved on state closes on that same scenario |
| `US1-TC17-1`, `US1-TC19-1` | Covered; question escalated | `grade10-site-vault-case-intake-SC-04` stores one canonical number however it was typed, and the number is optional by the requirement's table; which typed forms count as one person is decided on `collector-pages.md` |
| `US1-TC18-1` | Folded | `grade10-site-vault-case-intake-SC-26`. The requirement now says a number the brand's plan cannot read is refused by name, as the worker already refuses it; which typed forms count as one person is decided on `collector-pages.md` |
| `US1-TC20-1` | Covered; question landed | `grade10-site-vault-case-intake-SC-03`; whether the amount field shows the brand's currency to the collector landed as Q56 |
| `US4-TC1-1`, `US4-TC2-1`, `US4-TC3-1` | Covered | `grade10-site-vault-case-intake-SC-15`, `grade10-site-vault-case-intake-SC-17` |
| `US4-TC4-1` | Covered | `grade10-site-vault-case-intake-SC-16` |
| `US4-TC5-1` | Covered | `grade10-site-vault-case-intake-SC-18`, now outside production alone |
| `US4-TC6-1` | Covered; restored to `draft`, id kept | `grade10-site-vault-case-intake-SC-31`. Deprecated at the round as a misreading of Q8 and Q17; at landing the owner took the production refusal, so `decisions.md` Q8 now reads as this case does and the case comes back unchanged |
| `US4-TC7-1` | Covered, trimmed | `grade10-site-vault-case-intake-SC-01` — a request left unsent is listed unsent on the collector's own list. The draft also claimed the tick survives the save, which nothing states; `grade10-site-vault-case-intake-SC-17` records the version at the send, so that result left the case |
| `US5-TC1-1` | Covered | `grade10-site-vault-case-intake-SC-19`, `grade10-site-vault-case-intake-SC-23`; the reference is drawn when the request is opened, so what the case reads at the send is the reference the draft already carried. The letter that carries it is `grade10-site/vault/collector-notifications`', and its suite walks it |
| `US5-TC2-1`, `US5-TC4-1`, `US5-TC5-1` | Covered, retraced | `grade10-site-vault-case-intake-SC-20`, `grade10-site-vault-case-intake-SC-21`, `grade10-site-vault-case-intake-SC-22`; each case now traces `The case reference`, the group those scenarios serve, in place of the journey — one anchor per case, and US-05 keeps its own cases |
| `US5-TC3-1` | Retired; `deprecated`, id kept | Its within-brand half is `US5-TC2-1` on `grade10-site-vault-case-intake-SC-20`. Its cross-brand half cannot be walked: Grade10 alone runs a vault, and each brand's vault is its own database, so no second brand's reference exists to clash with |
| `US5-TC6-1` | Folded | `grade10-site-vault-case-intake-SC-27`. One request per item is the durable requirement's last line and no scenario stated it; the several-items block on the Sent step is the design's |
| `US5-TC7-1` | Covered | `grade10-site-vault-case-intake-SC-22` — Not now opens the case at its id-based address |
| `grade10-site-vault-case-intake-SC-02` | Case added | `US1-TC21-1`, tracing `Opening a request`, the group the scenario serves |
| `grade10-site-vault-case-intake-SC-19` | Case added | `US5-TC8-1` — no case read the reference before the request was sent |

**Uncovered anchors:** none.

**Run:** the blind pass read only its bundle: the spec-to-tcs skill and the rulebook, the change's `proposal.md`, `decisions.md` with its `## Raised` table empty, `ui-design.md`, `openspec/config.yaml`'s context, the PRD pages Operator Console, Collector Page, Collector Pages, Case Lifecycle and Compliance and Readiness, and for each of the five capabilities its `## Purpose` and `## Feature set`, the change's `user-journeys.md` and, where one exists, the durable purpose, journeys and suite with its `## Settled` and without its `## Reconciliation`. It was denied every `## Requirements` section, `openspec/specs/` beyond the bundle, `openspec/changes/archive/`, `tech-design.md`, `tasks.md` and the store's `tcs-conventions.md`, so the house style was taken from the existing suites. It wrote five cases over one journey and raised no question for this capability; the scenario pass issued `grade10-site-vault-case-intake-SC-32` to `grade10-site-vault-case-intake-SC-36` and carried `grade10-site-vault-case-intake-SC-07` in its MODIFIED block. One case was added here.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `grade10-site-vault-case-intake-US6-TC1-1` | Joined | `grade10-site-vault-case-intake-SC-32` and `grade10-site-vault-case-intake-SC-34` |
| `grade10-site-vault-case-intake-US6-TC2-1` | Joined | `grade10-site-vault-case-intake-SC-33`, and `grade10-site-vault-case-intake-SC-35` for nothing emailed before the send |
| `grade10-site-vault-case-intake-US6-TC3-1` | Joined | the durable statement rule the send keeps; `grade10-site-vault-case-intake-SC-34` sends only with the collector's tick, and the counter's version stands in for none |
| `grade10-site-vault-case-intake-US6-TC4-1` | Joined | `grade10-site-vault-case-intake-SC-36` and `grade10-site-vault-case-intake-SC-07` |
| `grade10-site-vault-case-intake-US6-TC5-1` | Joined | the durable rules this change leaves as they stand: another collector's case reads not found, and a photograph is served to its owner and staff alone |
| `grade10-site-vault-case-intake-SC-35` | Case added | `grade10-site-vault-case-intake-US6-TC6-1` |
| `grade10-site-vault-case-intake-SC-37` | Case added | `grade10-site-vault-case-intake-US6-TC7-1`, Q19 and Q53: removal on any unsent draft of the collector's own |
| `grade10-site-vault-case-intake-SC-38` | Case added | `grade10-site-vault-case-intake-US6-TC7-1`'s fourth step |

### Manual

| Manual | Why |
| --- | --- |
| `US1-TC1-1` | The financed walk is driven once on a phone, because the photograph step is a camera and a file picker before it is a request |
| `US4-TC1-1` | Whether the step reads the request back as the collector wrote it is a person's reading, not an assertion |
| `US4-TC2-1` | Edit per block and the way back is walked, so the rest of the request is seen to survive it |
| `US4-TC3-1` | The What happens next wording is read for what it promises the shop will do |
| `US4-TC5-1` | The statement page is opened outside production to read the being-prepared wording |
| `US5-TC1-1` | The reference is read aloud from the Sent step and the card — legibility is the point of the alphabet |
| `US5-TC6-1` | Start another request is walked to see the case just sent left where it was |
