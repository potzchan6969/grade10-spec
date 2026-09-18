# grade10-site/auction/notifications-order Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-18, tcs-rules r3.0

## order-mail-US1: Post-close letters

**As a** winner whose order letter offers Contact Us,
**I want** that CTA to open the same ready email Winner Order would copy,
**so that** support can find the order whether I write from the letter or the page.

### order-mail-US1-TC7-1: Setup overdue letter Contact Us carries the ready mailto and names the address

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
* **Trace:** Contact Us destination

**Pre-conditions:**

* customer(winner of <lot_1>) has a registered email.
* The setup deadline for <lot_1> has just passed with setup incomplete.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_1> | A won lot whose setup overdue letter is due |
| <lot_title> | The lot title on that order |

**Steps:**

1. Wait for the setup overdue letter for <lot_1>.
2. Open the letter.
3. Read the letter body and the Contact Us link.

**Expected Results:**

* The letter body names `support@grade10.com`.
* Contact Us is a `mailto:` to `support@grade10.com`.
* The mailto subject is `Auction lot <lot_title>: setup overdue`.
* The mailto includes a body with the matching order facts.

### order-mail-US1-TC8-1: Payment overdue letter Contact Us carries the ready mailto and names the address

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
* **Trace:** Contact Us destination

**Pre-conditions:**

* customer(winner of <lot_1>) has a registered email.
* The payment deadline for <lot_1> has just passed unpaid.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_1> | A won lot whose payment overdue letter is due |
| <invoice_id> | The issued invoice id on that order |

**Steps:**

1. Wait for the payment overdue letter for <lot_1>.
2. Open the letter.
3. Read the letter body and the Contact Us link.

**Expected Results:**

* The letter body names `support@grade10.com`.
* Contact Us is a `mailto:` to `support@grade10.com`.
* The mailto subject is `Auction order <invoice_id>: payment overdue`.
* The mailto includes a body with the matching order facts.

### order-mail-US1-TC9-1: Cancelled letter Contact Us carries the ready mailto and names the address

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
* **Trace:** Contact Us destination

**Pre-conditions:**

* customer(winner of <lot_1>) has a registered email.
* admin(operator) has cancelled the unpaid order for <lot_1>.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_1> | A won lot whose order cancelled letter is due |

**Steps:**

1. Wait for the order cancelled letter for <lot_1>.
2. Open the letter.
3. Read the letter body and the Contact Us link.

**Expected Results:**

* The letter body names `support@grade10.com`.
* Contact Us is a `mailto:` to `support@grade10.com` with subject and body prefilling the same ready email as Winner Order Contact Us for that order.
* The mailto is not a bare `mailto:support@grade10.com` without subject and body.

### order-mail-US1-TC10-1: Delivered letter Contact Us carries the ready mailto and names the address

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
* **Trace:** Contact Us destination

**Pre-conditions:**

* customer(winner of <lot_1>) has a registered email.
* The carrier has confirmed delivery for <lot_1>.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_1> | A won lot whose delivered letter is due |
| <invoice_id> | The paid invoice id on that order |

**Steps:**

1. Wait for the delivered letter for <lot_1>.
2. Open the letter.
3. Read the letter body and the Contact Us link.

**Expected Results:**

* The letter body names `support@grade10.com`.
* Contact Us is a `mailto:` to `support@grade10.com` with subject and body prefilling the same ready email as Winner Order Contact Us for that order.
* The mailto is not a bare `mailto:support@grade10.com` without subject and body.

### order-mail-US1-TC11-1: Overdue letter mailto matches Winner Order subject and body for the same order

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
* **Trace:** Contact Us destination

**Pre-conditions:**

* customer(winner of <lot_1>) has a registered email and can open <the winner's auction order url> for the same payment-overdue order.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_1> | A won lot in Payment Overdue with a payment overdue letter already sent |
| <invoice_id> | The issued invoice id on that order |

**Steps:**

1. Open the payment overdue letter for <lot_1> and read the Contact Us `mailto:` subject and body.
2. Open <the winner's auction order url> for that order.
3. Click Contact Us and read Subject and Message.

**Expected Results:**

* Letter mailto subject equals the dialog Subject `Auction order <invoice_id>: payment overdue`.
* Letter mailto body matches the dialog Message order facts.

### order-mail-US1-TC12-1: Letter Contact Us still names the address when no mail client will open

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** Contact Us destination

**Pre-conditions:**

* customer(winner of <lot_1>) opens a payment overdue letter in a browser mail surface that does not hand off to a system mail client.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_1> | A won lot whose payment overdue letter is open |

**Steps:**

1. Open the payment overdue letter for <lot_1>.
2. Read the letter body without activating Contact Us.

**Expected Results:**

* The letter body still shows `support@grade10.com` for the collector to copy by hand.

### order-mail-US1-TC13-1: Overdue cancelled and delivered Contact Us are not a bare support mailto

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Contact Us destination

**Pre-conditions:**

* customer(winner of <lot_1>) has a registered email and the letter in the row is the latest for that order.

**Test data:**

| Letter | <lot_1> |
| --- | --- |
| Setup overdue | A won lot whose setup overdue letter is open |
| Payment overdue | A won lot whose payment overdue letter is open |
| Order cancelled | A won lot whose order cancelled letter is open |
| Delivered | A won lot whose delivered letter is open |

**Steps:**

1. Open the letter named in the row for <lot_1>.
2. Inspect the Contact Us href.

**Expected Results:**

* The href includes a subject query.
* The href includes a body query.
* The href is not only `mailto:support@grade10.com`.

### order-mail-US1-TC14-1: Partial-payment letter Contact Us carries the ready mailto without the balance

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
* **Trace:** Contact Us destination

**Pre-conditions:**

* customer(winner of <lot_1>) has a registered email.
* An operator has recorded a partial payment on the order for <lot_1> and the partial-payment letter is due.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_1> | A won lot whose partial-payment letter is due |
| <invoice_id> | The current invoice id on that order |
| <receipt_ids> | Receipt ids recorded so far |

**Steps:**

1. Wait for the partial-payment letter for <lot_1>.
2. Open the letter.
3. Read the letter body and the Contact Us link.

**Expected Results:**

* The letter body names `support@grade10.com`.
* Contact Us is a `mailto:` to `support@grade10.com`.
* The mailto subject is `Auction order <invoice_id>: partial payment`.
* The mailto body may list <receipt_ids> and does not name the remaining balance.

## Settled

- Subject uses the order's current invoice id after a reissue
- Partial-payment letter Contact Us is in scope with the same ready mailto
- Cancelled and delivered subject reason fragments are `cancelled` and `delivered`

## Reconciliation

**Run:** Blind suite reading 2026-09-18 for change `add-winner-contact-email` capability `grade10-site/auction/notifications-order`. Read isolated bundle under `/tmp/winner-contact-blind/` (`proposal.md`, `decisions.md`, `ui-design.md`, `prd-post-bidding-excerpt.md`, `notifications-order/outline.md`, `notifications-order/user-journeys.md`, `notifications-order/feature-tcs-existing.md`) and store shape docs `docs/governance/specs-to-test-cases.md`, `.claude/skills/spec-to-tcs/SKILL.md`. Denied: every `## Requirements` section; durable `openspec/specs/**` beyond the isolated Purpose/Feature set excerpts; `openspec/changes/archive/`; `/tmp/winner-contact-scenarios/` and any scenario draft.

| Finding | Disposition |
| --- | --- |
| Setup overdue / payment overdue Contact Us mailto + address in letter | **Folded in:** `order-mail-SC-57`, `order-mail-SC-58` |
| Cancelled / delivered Contact Us mailto + address in letter | **Folded in:** `order-mail-SC-59`, `order-mail-SC-60`; MODIFIED durable delivered/cancelled destination |
| Letter mailto matches Winner Order subject and body | Covered by the same ready-email definition; cases `order-mail-US1-TC11-1` keep the cross-surface check |
| Address still named when no mail client opens | **Folded in:** address-in-letter rule on `order-mail-SC-57`–`order-mail-SC-61` |
| Overdue / cancelled / delivered Contact Us is not a bare mailto | **Folded in:** mailto rules above; case `order-mail-US1-TC13-1` |
| Exact cancelled / delivered subject reason strings | **Folded in:** `cancelled`, `delivered` on `order-mail-SC-59`, `order-mail-SC-60` |
| Partial-payment draft Contact Us in scope | **Folded in:** `order-mail-SC-61`; Feature set leaf updated |

**Uncovered anchors:** none for `Contact Us destination`. Foreign-journey scenarios `order-mail-SC-57`–`order-mail-SC-61` are walked here under that group.
