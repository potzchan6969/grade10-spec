# grade10-site/auction/winner-order Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-18, tcs-rules r3.0

## winner-order-US5: Winner misses the payment deadline

**As a** winner whose invoice deadline has passed unpaid,
**I want** clear Contact Us and no card Pay,
**so that** I know self-service payment has stopped and how to reach Grade10.

### winner-order-US5-TC1-1: Payment overdue still shows Contact Us and hides Pay

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
* **Trace:** winner-order-US-05

**Pre-conditions:**

* customer(winner) is signed in on <the winner's auction order url> for <order_payment_overdue>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_payment_overdue> | An auction order whose payment deadline has passed unpaid |

**Steps:**

1. Open <the winner's auction order url> for <order_payment_overdue>.
2. Check the inline alert and payment controls.

**Expected Results:**

* Contact Us is shown.
* No card Pay control is offered.

---

## winner-order-US7: Winner misses the address deadline

**As a** winner who did not confirm a delivery address within 48 hours of lot close,
**I want** clear Contact Us and no Confirm control,
**so that** I know self-service address confirmation has stopped and how to reach Grade10.

### winner-order-US7-TC1-1: Setup overdue still shows Contact Us and hides Confirm

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
* **Trace:** winner-order-US-07

**Pre-conditions:**

* customer(winner) is signed in on <the winner's auction order url> for <order_setup_overdue>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_setup_overdue> | An auction order whose setup deadline has passed with setup incomplete |

**Steps:**

1. Open <the winner's auction order url> for <order_setup_overdue>.
2. Check the inline alert and setup controls.

**Expected Results:**

* Contact Us is shown.
* No Confirm control is offered.

---

## winner-order-US15: Winner emails Grade10 from a locked order

**As a** winner whose payment access has closed,
**I want** a ready email with this order's details that I can copy into any mail app,
**so that** I can reach Grade10 without a system mail client, and support can find the order.

### winner-order-US15-TC1-1: Contact Us opens the copy-first Email Grade10 dialog

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-15

**Pre-conditions:**

* customer(winner) is signed in on <the winner's auction order url> for <order_payment_overdue>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_payment_overdue> | An auction order whose payment deadline has passed unpaid |

**Steps:**

1. Open <the winner's auction order url> for <order_payment_overdue>.
2. Click Contact Us on the inline alert.

**Expected Results:**

* The Email Grade10 dialog opens.
* The dialog shows To, Subject and Message.
* No toast that only names the support address replaces the dialog.
* No mail client opens as the Contact Us action itself.

### winner-order-US15-TC2-1: Dialog To is support at grade10.com

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-15

**Pre-conditions:**

* customer(winner) is signed in on <the winner's auction order url> for <order_payment_overdue>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_payment_overdue> | An auction order whose payment deadline has passed unpaid |

**Steps:**

1. Open <the winner's auction order url> for <order_payment_overdue>.
2. Click Contact Us.
3. Read the To field.

**Expected Results:**

* To is `support@grade10.com`.

### winner-order-US15-TC3-1: Setup overdue subject names the lot and omits an invoice id

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-15

**Pre-conditions:**

* customer(winner) is signed in on <the winner's auction order url> for <order_setup_overdue>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_setup_overdue> | An auction order past the setup deadline with no invoice issued |
| <lot_title> | The lot title on that order |

**Steps:**

1. Open <the winner's auction order url> for <order_setup_overdue>.
2. Click Contact Us.
3. Read the Subject field.

**Expected Results:**

* Subject is `Auction lot <lot_title>: setup overdue`.
* Subject contains no invoice id.

### winner-order-US15-TC4-1: Payment overdue subject names the invoice id

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-15

**Pre-conditions:**

* customer(winner) is signed in on <the winner's auction order url> for <order_payment_overdue>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_payment_overdue> | An auction order whose payment deadline has passed unpaid |
| <invoice_id> | The issued invoice id on that order |

**Steps:**

1. Open <the winner's auction order url> for <order_payment_overdue>.
2. Click Contact Us.
3. Read the Subject field.

**Expected Results:**

* Subject is `Auction order <invoice_id>: payment overdue`.

### winner-order-US15-TC5-1: Partially paid subject names invoice and lists receipts without remaining balance

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-15

**Pre-conditions:**

* customer(winner) is signed in on <the winner's auction order url> for <order_partially_paid>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_partially_paid> | An auction order in Partially Paid with at least one recorded receipt |
| <invoice_id> | The invoice id on that order |
| <receipt_ids> | The receipt ids listed for that invoice |

**Steps:**

1. Open <the winner's auction order url> for <order_partially_paid>.
2. Click Contact Us.
3. Read the Subject and Message fields.

**Expected Results:**

* Subject is `Auction order <invoice_id>: partial payment`.
* Message lists <receipt_ids>.
* Message does not show the remaining balance owed.

### winner-order-US15-TC6-1: Partially paid with several receipts lists each receipt id

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
* **Trace:** winner-order-US-15

**Pre-conditions:**

* customer(winner) is signed in on <the winner's auction order url> for <order_partially_paid_many>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_partially_paid_many> | An auction order in Partially Paid with two or more receipt ids |
| <receipt_ids> | Every receipt id on that invoice, oldest first |

**Steps:**

1. Open <the winner's auction order url> for <order_partially_paid_many>.
2. Click Contact Us.
3. Read the Message field.

**Expected Results:**

* Message lists every id in <receipt_ids>.
* Message still omits the remaining balance.

### winner-order-US15-TC7-1: Support address stays off the order until the dialog opens

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-15

**Pre-conditions:**

* customer(winner) is signed in on <the winner's auction order url> for <order_payment_overdue>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_payment_overdue> | An auction order whose payment deadline has passed unpaid |

**Steps:**

1. Open <the winner's auction order url> for <order_payment_overdue>.
2. Scan the order page before Contact Us.
3. Click Contact Us.
4. Read the To field.

**Expected Results:**

* Before step 3, `support@grade10.com` is not shown on the order page.
* After step 3, To shows `support@grade10.com`.

### winner-order-US15-TC8-1: Copy Message is first and Open Mail App is second

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-15

**Pre-conditions:**

* customer(winner) is signed in on <the winner's auction order url> for <order_payment_overdue>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_payment_overdue> | An auction order whose payment deadline has passed unpaid |

**Steps:**

1. Open <the winner's auction order url> for <order_payment_overdue>.
2. Click Contact Us.
3. Check the dialog footer actions.

**Expected Results:**

* Copy Message is the primary footer action.
* Open Mail App is the secondary outline action.

### winner-order-US15-TC9-1: Message is an editable textarea with footer-only full copy

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-15

**Pre-conditions:**

* customer(winner) is signed in on <the winner's auction order url> for <order_payment_overdue>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_payment_overdue> | An auction order whose payment deadline has passed unpaid |
| <winner_question> | A short question the winner types into Message |

**Steps:**

1. Open <the winner's auction order url> for <order_payment_overdue>.
2. Click Contact Us.
3. Check the Message field and copy controls beside To, Subject and Message.
4. Type <winner_question> into the blank area of Message.

**Expected Results:**

* Message is an editable multi-line field with order facts already filled and space for the winner's question.
* To and Subject each have an in-place copy control.
* Message has no icon copy beside it.
* The only full-email copy control is Copy Message in the footer.
* Step 4 keeps the typed <winner_question> in Message.

### winner-order-US15-TC10-1: Copy Message copies the ready email including the current Message

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-15

**Pre-conditions:**

* customer(winner) is signed in on <the winner's auction order url> for <order_payment_overdue>.
* The clipboard is available to the browser.

**Test data:**

| Field | Value |
| --- | --- |
| <order_payment_overdue> | An auction order whose payment deadline has passed unpaid |
| <invoice_id> | The issued invoice id on that order |
| <winner_question> | A short question typed into Message |

**Steps:**

1. Open <the winner's auction order url> for <order_payment_overdue>.
2. Click Contact Us.
3. Type <winner_question> into Message.
4. Click Copy Message.
5. Paste into a plain-text field.

**Expected Results:**

* The paste includes To `support@grade10.com`.
* The paste includes Subject `Auction order <invoice_id>: payment overdue`.
* The paste includes the Message text with <winner_question>.

### winner-order-US15-TC11-1: Open Mail App uses the current subject and body

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-15

**Pre-conditions:**

* customer(winner) is signed in on <the winner's auction order url> for <order_payment_overdue>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_payment_overdue> | An auction order whose payment deadline has passed unpaid |
| <invoice_id> | The issued invoice id on that order |
| <winner_question> | A short question typed into Message |

**Steps:**

1. Open <the winner's auction order url> for <order_payment_overdue>.
2. Click Contact Us.
3. Type <winner_question> into Message.
4. Activate Open Mail App.
5. Inspect the `mailto:` target.

**Expected Results:**

* The link addresses `support@grade10.com`.
* The mailto subject is `Auction order <invoice_id>: payment overdue`.
* The mailto body includes <winner_question>.

### winner-order-US15-TC12-1: In-place To and Subject copy do not replace Copy Message

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-15

**Pre-conditions:**

* customer(winner) is signed in on <the winner's auction order url> for <order_payment_overdue>.
* The clipboard is available to the browser.

**Test data:**

| Field | Value |
| --- | --- |
| <order_payment_overdue> | An auction order whose payment deadline has passed unpaid |

**Steps:**

1. Open <the winner's auction order url> for <order_payment_overdue>.
2. Click Contact Us.
3. Activate the To copy control and paste.
4. Activate the Subject copy control and paste.

**Expected Results:**

* Step 3 pastes only `support@grade10.com`.
* Step 4 pastes only the Subject text.
* Copy Message remains available in the footer for the full ready email.

### winner-order-US15-TC13-1: A reissued invoice uses the current invoice id in Subject

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-15

**Pre-conditions:**

* customer(winner) is signed in on <the winner's auction order url> for <order_payment_overdue_reissued>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_payment_overdue_reissued> | An auction order payment-overdue after a reissue |
| <current_invoice_id> | The current invoice id on that order |
| <replaced_invoice_id> | The replaced invoice id on that order |

**Steps:**

1. Open <the winner's auction order url> for <order_payment_overdue_reissued>.
2. Click Contact Us.
3. Read the Subject field.

**Expected Results:**

* Subject is `Auction order <current_invoice_id>: payment overdue`.
* Subject does not name <replaced_invoice_id>.

## Settled

- Subject uses the order's current invoice id after a reissue
- Partial-payment letter Contact Us is in scope with the same ready mailto

## Reconciliation

**Run:** Blind suite reading 2026-09-18 for change `add-winner-contact-email` capability `grade10-site/auction/winner-order`. Read isolated bundle under `/tmp/winner-contact-blind/` (`proposal.md`, `decisions.md`, `ui-design.md`, `prd-post-bidding-excerpt.md`, `winner-order/outline.md`, `winner-order/user-journeys.md`, `winner-order/feature-tcs-existing.md`) and store shape docs `docs/governance/specs-to-test-cases.md`, `.claude/skills/spec-to-tcs/SKILL.md`. Denied: every `## Requirements` section; durable `openspec/specs/**` beyond the isolated Purpose/Feature set excerpts; `openspec/changes/archive/`; `/tmp/winner-contact-scenarios/` and any scenario draft.

| Finding | Disposition |
| --- | --- |
| Contact Us opens copy-first dialog; To is `support@grade10.com`; footer order Copy Message then Open Mail App | **Folded in:** `winner-order-SC-160` |
| Support address stays off the order until the dialog opens | **Folded in:** `winner-order-SC-161` |
| Message is editable Textarea; full copy is footer-only; Copy Message includes current Message | **Folded in:** `winner-order-SC-162` |
| Open Mail App carries current subject and body | **Folded in:** `winner-order-SC-163` |
| Setup overdue subject names the lot; payment overdue and partial payment name the invoice; partial payment lists receipts and never the balance | **Folded in:** `winner-order-SC-164`, `winner-order-SC-165`, `winner-order-SC-166` |
| To and Subject copy in place and are not editable | **Folded in:** `winner-order-SC-167` |
| Several receipt ids on partial payment | **Folded in:** `winner-order-SC-166` (MAY list) |
| Empty receipt list on partial payment | **Folded in:** `winner-order-SC-166` (list none) |
| Reissued invoice uses the current invoice id | **Folded in:** `winner-order-SC-168` |
| Whether To/Subject are editable | **Rejected:** ui-design and Q7 already lock copy-in-place; folded as `winner-order-SC-167` |
| Prefill body facts beyond subject | **Folded in:** ready-email body rules under `The ready email names the invoice or the lot and the reason` |
| Whether the winner may clear prefilled Message facts | **Rejected:** Message is editable end-to-end (`winner-order-SC-162`); no separate lock on the prefills |
| Dialog title "Email Grade10" as a SHALL | **Rejected:** presentation in `ui-design.md`, not a product rule |
| Copy Message success confirmation | **Escalated:** ❓ on Post-Bidding; Raised row for Product (@tangconst). No scenario. Case `winner-order-US15-TC10-1` stays without asserting confirmation chrome |
| US-05 / US-07 still show Contact Us and hide Pay / Confirm | **Out of suite:** durable `winner-order-SC-37`, `winner-order-SC-71` — this change names the destination, not when Contact Us appears |
| `Textarea` design-system export | **Out of suite:** `packages/design-system` typecheck and colocated stories |

**Uncovered anchors:** none for `winner-order-US-15`. Context journeys `winner-order-US-05` and `winner-order-US-07` keep regression cases; appearance rules stay on the durable scenarios above.
