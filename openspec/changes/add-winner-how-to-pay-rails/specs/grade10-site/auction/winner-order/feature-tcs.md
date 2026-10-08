# grade10-site/auction/winner-order Test Cases

**Status:** pending-review · 0/4
**Drafts styled:** 2026-09-22, tcs-rules r3.0

## winner-order-US9: Winner pays an invoice by bank transfer

**As a** winner who would rather not pay a card fee,
**I want** to choose bank transfer, see where to send the money and what reference to quote, and send Grade10 proof,
**so that** Grade10 can match my payment and my deadline stops while it is checked.

<!-- trace:case id=g10.auction-winner-order.TC-6nc rev=1 covers=g10.auction-winner-order.SC-c6t,g10.auction-winner-order.SC-6v5,g10.auction-winner-order.SC-sd5,g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-fgj,g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-ymi,g10.auction-winner-order.SC-67v,g10.auction-winner-order.SC-uxu,g10.auction-winner-order.SC-7nh,g10.auction-winner-order.SC-zbt,g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii,g10.auction-winner-order.SC-fm9,g10.auction-winner-order.SC-8q1,g10.auction-winner-order.SC-bb1,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-ddi -->
### winner-order-US9-TC21-1: Order summary offers Submit Payment Proof and View Bank Details

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner) is signed in on <the winner's auction order url> for <pending_bank_transfer_order>.

**Test data:**

| Field | Value |
| --- | --- |
| <pending_bank_transfer_order> | An auction order whose invoice was sent for bank transfer and is pending |

**Steps:**

1. Open <the winner's auction order url> for <pending_bank_transfer_order>.
2. Read Order summary.
3. Choose View Bank Details.
4. Close View Bank Details.
5. Choose Submit Payment Proof.

**Expected result:**

* Order summary shows Submit Payment Proof with View Bank Details under it.
* View Bank Details opens the View Bank Details dialog.
* Submit Payment Proof opens the Submit Payment Proof dialog.

<!-- trace:case id=g10.auction-winner-order.TC-vvf rev=1 covers=g10.auction-winner-order.SC-c6t,g10.auction-winner-order.SC-6v5,g10.auction-winner-order.SC-sd5,g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-fgj,g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-ymi,g10.auction-winner-order.SC-67v,g10.auction-winner-order.SC-uxu,g10.auction-winner-order.SC-7nh,g10.auction-winner-order.SC-zbt,g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii,g10.auction-winner-order.SC-fm9,g10.auction-winner-order.SC-8q1,g10.auction-winner-order.SC-bb1,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-ddi -->
### winner-order-US9-TC32-1: View Bank Details opens on FPS with QR

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
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner) is signed in on <the winner's auction order url> for <pending_bank_transfer_order>.

**Test data:**

| Field | Value |
| --- | --- |
| <pending_bank_transfer_order> | An auction order whose invoice was sent for bank transfer and is pending |

**Steps:**

1. Open View Bank Details from Order summary.

**Expected result:**

* The FPS tab is selected.
* FPS ID, account name and an FPS QR are shown.
* Amount due is shown without Copy.
* The bank reference is shown as a detail row without Copy at the bottom of the FPS tab.

<!-- trace:case id=g10.auction-winner-order.TC-9v4 rev=1 covers=g10.auction-winner-order.SC-c6t,g10.auction-winner-order.SC-6v5,g10.auction-winner-order.SC-sd5,g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-fgj,g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-ymi,g10.auction-winner-order.SC-67v,g10.auction-winner-order.SC-uxu,g10.auction-winner-order.SC-7nh,g10.auction-winner-order.SC-zbt,g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii,g10.auction-winner-order.SC-fm9,g10.auction-winner-order.SC-8q1,g10.auction-winner-order.SC-bb1,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-ddi -->
### winner-order-US9-TC24-1: HK Local and SWIFT tabs show expanded fields

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
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner) has View Bank Details open for <pending_bank_transfer_order>.

**Steps:**

1. Choose HK Local.
2. Choose International (SWIFT).

**Expected result:**

* HK Local shows bank name, bank code, branch code, full account number including bank and branch code, then payment reference.
* SWIFT shows beneficiary name, beneficiary address, bank name, bank address, SWIFT/BIC, full account or IBAN, then payment reference, then the OUR charges note after the reference.

<!-- trace:case id=g10.auction-winner-order.TC-xmr rev=1 covers=g10.auction-winner-order.SC-c6t,g10.auction-winner-order.SC-6v5,g10.auction-winner-order.SC-sd5,g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-fgj,g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-ymi,g10.auction-winner-order.SC-67v,g10.auction-winner-order.SC-uxu,g10.auction-winner-order.SC-7nh,g10.auction-winner-order.SC-zbt,g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii,g10.auction-winner-order.SC-fm9,g10.auction-winner-order.SC-8q1,g10.auction-winner-order.SC-bb1,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-ddi -->
### winner-order-US9-TC25-1: Submit Payment Proof is proof-only

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner) is signed in on <the winner's auction order url> for <pending_bank_transfer_order>.

**Steps:**

1. Choose Submit Payment Proof.

**Expected result:**

* The dialog title is Submit Payment Proof.
* Amount due and transfer reference are not shown.
* No FPS, HK Local or SWIFT tab is shown.

## Reconciliation

**Run:** 2026-09-22; re-checked 2026-09-22 after primary CTA rename (**Submit
Payment Proof**) and OUR note placement after payment reference; scenario
draft from the requirements reading; suite from the blind reading; neither
saw the other's draft before join.

- **Raised:** none — entry points, CTA label, FPS default, expanded rail
  fields (beneficiary address, bank name, bank address, full account number),
  OUR placement, Grade10 / HSBC preview samples and proof-only dialog were
  settled in `decisions.md` (including Q16–Q19).
- **Folded:** none.
- **Covered:** `winner-order-SC-180` ← `US9-TC1-1`; `winner-order-SC-181` ←
  `US9-TC2-1`; `winner-order-SC-182` and `winner-order-SC-183` ←
  `US9-TC3-1`; `winner-order-SC-184` ← `US9-TC4-1`; `winner-order-SC-95`
  remains the three-ways-and-reference case opened from View Bank Details.
- **Uncovered anchors:** none for this change's added scenarios.
- **Out of suite:** abandon gate, HEIC converting — Storybook View Bank
  Details / Submit Payment Proof.
