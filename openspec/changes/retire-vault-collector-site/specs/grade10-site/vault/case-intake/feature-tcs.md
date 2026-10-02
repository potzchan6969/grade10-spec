# grade10-site/vault/case-intake Test Cases

**Status:** pending-review

## grade10-site-vault-case-intake-US1: Collector sends in a card they want cash against

**As a** collector,
**I want** to describe and photograph one card and say how much I want to
borrow against it,
**so that** the shop can value it and offer me terms before I carry it in.

### grade10-site-vault-case-intake-US1-TC3-1: Title and description at their character caps are accepted

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** deprecated
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
* **Status:** deprecated
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

### grade10-site-vault-case-intake-US1-TC10-1: Sending in with no photograph is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** deprecated
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

### grade10-site-vault-case-intake-US1-TC15-1: Reopening a draft resumes it on the Photograph step

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
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

### grade10-site-vault-case-intake-US1-TC18-1: An invalid WhatsApp number is refused

**Classification:**

* **Severity:** normal
* **Priority:** low
* **Status:** deprecated
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
* **Status:** deprecated
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

### grade10-site-vault-case-intake-US1-TC22-1: The wizard offers the register's ten categories in each language

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** compatibility
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* customer(collector) is signed in on <grade10 vault url> in the language of the row, with no unsent draft.

**Test data:**

| Language |
| --- |
| English |
| Traditional Chinese |
| Simplified Chinese |
| Korean |

**Steps:**

1. Start a new request.
2. Open the category choice on the Describe step.
3. Choose comic and fill in a title and a description.
4. Click Continue.

**Expected Results:**

* Step 2 offers ten categories: trading card, comic, coin, banknote, stamp, bullion, watch, jewellery, memorabilia and other.
* Every category reads in the row's language, none as a raw key.
* Step 4 moves to the Photograph step with comic kept as the category.

---

### grade10-site-vault-case-intake-US1-TC25-1: A loan of zero is refused on the Describe step

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* `customer(collector)` is on the Describe step of a new request, `<grade10 vault url>`.

**Test data:**

| `<zero amount>` |
| --- |
| `0` |
| `0.00` |

| Field | Value |
| --- | --- |
| Category | Trading card |
| Title | Charizard 1st Edition |
| Description | Near-mint, unopened sleeve since grading. |

**Steps:**

1. Fill in the category, title and description from **Test data**.
2. Choose a loan at the lane question.
3. Type `<zero amount>` into the loan field.
4. Click Continue.
5. Choose storage only at the lane question.
6. Click Continue.

**Expected Results:**

* Step 3 leaves the loan field empty, no amount read back under it.
* Step 4 shows the refusal asking how much, or for storage only.
* After step 4 the Describe step stays open, and nothing is sent.
* The category, title and description keep what was typed.
* Step 6 moves on to the Photograph step.

---

## grade10-site-vault-case-intake-US4: Collector checks the request before sending it

**As a** collector on the last step of the wizard,
**I want** to read my request back, see what happens next, and tick that I
have read the collection statement,
**so that** I send what I meant and know what I agreed to.

### grade10-site-vault-case-intake-US4-TC2-1: Editing a block returns to its step without losing the rest

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
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
* **Status:** deprecated
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
* **Status:** deprecated
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
* **Status:** deprecated
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

### grade10-site-vault-case-intake-US4-TC7-1: Finish later from the review step saves without sending

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** deprecated
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
* **Status:** deprecated
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

### grade10-site-vault-case-intake-US5-TC5-1: The case's own address still uses the id after the reference is issued

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** deprecated
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
* **Status:** deprecated
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
* **Status:** deprecated
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
