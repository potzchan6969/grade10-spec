# vault/storage-billing Test Cases

**Status:** pending-review

## storage-billing-US-01: Collector reviews what their vaulted collection costs

**As a** collector,
**I want** to see my account's current storage tier, its monthly fee, and any balance I owe,
**so that** I understand what keeping my collection in custody costs before a charge surprises me.

**Covers:**

- `storage-billing-SC-01` — A vaulted storage-lane item counts
- `storage-billing-SC-02` — An item before vaulted does not count
- `storage-billing-SC-05` — Free tier stays free regardless of a single item's value
- `storage-billing-SC-06` — Free tier holds at exactly three items
- `storage-billing-SC-07` — A fourth item moves the account to Standard
- `storage-billing-SC-08` — Total declared value above the Standard ceiling selects Premium
- `storage-billing-SC-09` — Crossing a threshold mid-cycle takes effect next cycle
- `storage-billing-SC-10` — Partial month at the start of custody is charged in full
- `storage-billing-SC-11` — Partial month at the end of custody is charged in full
- `storage-billing-SC-12` — First storage-billable item sets the account's billing currency
- `storage-billing-SC-13` — A later case in a different currency is still accepted at intake
- `storage-billing-SC-14` — No payment method on file still shows the accruing balance

### storage-billing-TC-01: Collector's vaulted storage-lane item counts toward storage billing

**Description:** Proves the base eligibility rule the rest of storage billing depends on: an item counts toward its account's storage-billable item count and declared value once its case is vaulted.

**Preconditions:**

- The collector's account has a storage-lane case (no loan) at status `vaulted`.

**Test data:** None — the case takes no input.

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Assess the account's storage-billable items. | The item counts toward the account's item count and declared value. |

**Properties:**

- **Severity:** major
- **Priority:** high
- **Status:** actual
- **Behaviour:** positive
- **Type:** smoke
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** storage-billing-SC-01

### storage-billing-TC-02: Collector's item before vaulted does not count toward storage billing

**Description:** Proves an item does not become storage-billable until its case actually reaches `vaulted`, so custody that has not started yet is never counted or charged.

**Preconditions:**

- The collector's case is at status `signing`, not yet `vaulted`.

**Test data:** None — the case takes no input.

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Assess the account's storage-billable items. | The item does not count toward the account's item count, declared value, or charge. |

**Properties:**

- **Severity:** major
- **Priority:** high
- **Status:** actual
- **Behaviour:** positive
- **Type:** functional
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** storage-billing-SC-02

### storage-billing-TC-03: Collector's single high-value item keeps the account on the Free tier

**Description:** Proves the Free tier's item-count-only rule: a collection of one item, however valuable, is never pushed onto a paid tier by its declared value.

**Preconditions:**

- The account has exactly 1 storage-billable item.

**Test data:**

| Field | Value |
| --- | --- |
| Storage-billable items | 1 |
| Declared value | 5,000,000 minor units USD |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Assess the account's tier. | The account is on the Free tier and charged 0. |

**Properties:**

- **Severity:** critical
- **Priority:** high
- **Status:** actual
- **Behaviour:** positive
- **Type:** regression
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** storage-billing-SC-05

### storage-billing-TC-04: Collector's account holds the Free tier at exactly three items

**Description:** Proves the Free tier's upper boundary — three storage-billable items, of any total declared value, still qualifies for Free.

**Preconditions:**

- The account has exactly 3 storage-billable items.

**Test data:**

| Field | Value |
| --- | --- |
| Storage-billable items | 3 |
| Total declared value | Any — value does not affect the Free tier |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Assess the account's tier. | The account is on the Free tier and charged 0. |

**Properties:**

- **Severity:** major
- **Priority:** high
- **Status:** actual
- **Behaviour:** positive
- **Type:** functional
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** storage-billing-SC-06

### storage-billing-TC-05: Collector's fourth item moves the account to the Standard tier

**Description:** Proves the Standard tier boundary — 4 or more items with total declared value up to 10,000 major units — is assigned and charged correctly.

**Preconditions:**

- None.

**Test data:**

| Field | Value |
| --- | --- |
| Storage-billable items | 4 |
| Total declared value | 500,000 minor units USD |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Assess the account's tier. | The account is on the Standard tier and charged 500 minor units USD. |

**Properties:**

- **Severity:** critical
- **Priority:** high
- **Status:** actual
- **Behaviour:** positive
- **Type:** functional
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** storage-billing-SC-07

### storage-billing-TC-06: Collector's total declared value above 10,000 major units selects the Premium tier

**Description:** Proves the Premium tier boundary — 4 or more items with total declared value above 10,000 major units — is assigned and charged correctly.

**Preconditions:**

- None.

**Test data:**

| Field | Value |
| --- | --- |
| Storage-billable items | 4 |
| Total declared value | 1,000,001 minor units USD |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Assess the account's tier. | The account is on the Premium tier and charged 2,000 minor units USD. |

**Properties:**

- **Severity:** critical
- **Priority:** high
- **Status:** draft
- **Behaviour:** positive
- **Type:** functional
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** storage-billing-SC-08

### storage-billing-TC-07: Collector's mid-cycle tier crossing takes effect only at the next cycle

**Description:** Proves tier reassessment never happens mid-cycle: a fourth item added partway through a Free-tier cycle does not change that cycle's charge.

**Preconditions:**

- The account is currently on the Free tier.

**Test data:**

| Field | Value |
| --- | --- |
| New storage-billable item added | 3 days after the current cycle's monthly charge |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Reach the end of the current billing cycle after the fourth item was added. | The current cycle remains billed on the Free tier, unaffected by the new item. |
| 2 | Reach the next cycle's tier assessment. | The account is assessed on the Standard or Premium tier starting from that cycle. |

**Properties:**

- **Severity:** major
- **Priority:** medium
- **Status:** draft
- **Behaviour:** positive
- **Type:** functional
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** storage-billing-SC-09

### storage-billing-TC-08: Collector's item vaulted mid-cycle is still charged the full monthly fee

**Description:** Proves storage billing never prorates at the start of custody — an item entering the vault partway through a cycle is billed the full fee for that cycle.

**Preconditions:**

- None.

**Test data:**

| Field | Value |
| --- | --- |
| Day the item's case reaches `vaulted` | Day 20 of the monthly billing cycle |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Run that cycle's charge. | The full monthly fee for the account's tier is charged, not a prorated amount for the 10 remaining days. |

**Properties:**

- **Severity:** critical
- **Priority:** high
- **Status:** draft
- **Behaviour:** positive
- **Type:** regression
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** storage-billing-SC-10

### storage-billing-TC-09: Collector's item released mid-cycle is still charged the full monthly fee

**Description:** Proves storage billing never prorates at the end of custody — an item leaving the vault partway through a cycle is still billed the full fee assessed for that cycle.

**Preconditions:**

- None.

**Test data:**

| Field | Value |
| --- | --- |
| Day the item's case reaches `released` | Day 5 of the monthly billing cycle |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Run that cycle's charge. | The full monthly fee for the account's tier at that cycle's start is charged, not a prorated amount for the 5 elapsed days. |

**Properties:**

- **Severity:** critical
- **Priority:** high
- **Status:** draft
- **Behaviour:** positive
- **Type:** regression
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** storage-billing-SC-11

### storage-billing-TC-10: Collector's first storage-billable item sets the account's billing currency

**Description:** Proves an account's storage billing currency is established from the first case whose item becomes storage-billable.

**Preconditions:**

- The account has no prior storage-billable item.

**Test data:**

| Field | Value |
| --- | --- |
| New case's currency | HKD |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Determine the account's billing currency after the case reaches `vaulted`. | The account's billing currency is set to HKD. |

**Properties:**

- **Severity:** major
- **Priority:** medium
- **Status:** draft
- **Behaviour:** positive
- **Type:** functional
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** storage-billing-SC-12

### storage-billing-TC-11: Collector's case in a different currency is still accepted at intake

**Description:** Proves intake never refuses a case for carrying a different currency than the account's existing storage billing currency — Grade10 does not turn a collector away over billing plumbing.

**Preconditions:**

- The account already bills storage in HKD.

**Test data:**

| Field | Value |
| --- | --- |
| New case's item currency | USD |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Submit the new case. | Intake is not refused for the currency difference. |

**Properties:**

- **Severity:** critical
- **Priority:** high
- **Status:** draft
- **Behaviour:** positive
- **Type:** regression
- **Layer:** e2e
- **Automation status:** manual
- **Testability:** automation
- **Trace:** storage-billing-SC-13

### storage-billing-TC-12: Collector sees the accruing balance when no payment method is on file

**Description:** Proves a missing payment method is never a silent gap: the monthly charge still accrues as a visible unpaid balance, and the collector can see both the balance and that no payment method is on file.

**Preconditions:**

- The account has no payment method on file.
- The account has been assessed a monthly storage fee.

**Test data:** None — the case takes no input.

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Attempt the billing cycle's charge. | The charge cannot be completed, and the fee accrues as an unpaid balance. |
| 2 | Collector opens their view of the account's storage status. | The view shows the accrued balance and that no payment method is on file. |

**Properties:**

- **Severity:** critical
- **Priority:** high
- **Status:** draft
- **Behaviour:** positive
- **Type:** functional
- **Layer:** e2e
- **Automation status:** manual
- **Testability:** manual, automation
- **Trace:** storage-billing-SC-14

## storage-billing-US-02: Collector is warned before an unpaid balance blocks a withdrawal

**As a** collector,
**I want** to be told my storage balance is overdue and that continued non-payment will block me from withdrawing my items,
**so that** I can pay before I am refused at the counter.

**Covers:**

- `storage-billing-SC-15` — First missed or failed charge triggers an immediate overdue notice
- `storage-billing-SC-16` — A second unpaid cycle blocks release account-wide
- `storage-billing-SC-17` — Paying the balance in full clears the block
- `storage-billing-SC-18` — A blocked storage-only case is never forfeited
- `storage-billing-SC-19` — Forfeiture stays manual, financed-lane-only, and independent of storage balance

### storage-billing-TC-13: Collector is notified the same cycle a storage charge first fails

**Description:** Proves the overdue notice fires immediately on the first missed or failed charge, and that withdrawal is not yet blocked at that point — the collector always gets the warning before any consequence.

**Preconditions:**

- The account's monthly storage charge fails.

**Test data:** None — the case takes no input.

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Record the failed charge. | The collector is notified, in that same cycle, that the balance is overdue and that continued non-payment will block withdrawal. |
| 2 | Attempt release on a case under the account. | Release is not refused for the storage balance. |

**Properties:**

- **Severity:** critical
- **Priority:** high
- **Status:** draft
- **Behaviour:** positive
- **Type:** smoke
- **Layer:** e2e
- **Automation status:** manual
- **Testability:** manual, automation
- **Trace:** storage-billing-SC-15

### storage-billing-TC-14: Collector's release is no longer refused once the balance is paid in full

**Description:** Proves the withdrawal block is reversible: paying the outstanding storage balance in full clears it, computed fresh at the next release attempt.

**Preconditions:**

- The account is currently blocked for an unpaid storage balance.

**Test data:**

| Field | Value |
| --- | --- |
| Payment amount | The full outstanding balance |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Pay the outstanding balance in full. | The payment is recorded against the account. |
| 2 | Attempt release on a case under the account. | Release is not refused for an outstanding storage balance. |

**Properties:**

- **Severity:** major
- **Priority:** high
- **Status:** draft
- **Behaviour:** positive
- **Type:** functional
- **Layer:** e2e
- **Automation status:** manual
- **Testability:** automation
- **Trace:** storage-billing-SC-17

### storage-billing-TC-15: Staff's forfeiture evaluation ignores an unpaid storage balance

**Description:** Proves forfeiture eligibility is decided solely by the loan's own past-due state, so an unrelated unpaid storage balance never contributes to it in either direction.

**Preconditions:**

- The case is financed-lane, with a recorded payout and a past-due loan.
- The account separately carries an unpaid storage balance.

**Test data:** None — the case takes no input.

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Staff evaluate the case for forfeiture eligibility. | Eligibility is decided solely by the loan's own past-due state, with no contribution from the storage balance. |

**Properties:**

- **Severity:** critical
- **Priority:** high
- **Status:** draft
- **Behaviour:** positive
- **Type:** regression
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** storage-billing-SC-19

### storage-billing-TC-16: Collector's release is refused after a second unpaid billing cycle

**Description:** Proves the withdrawal block itself: once a storage balance is still unpaid when the next cycle's charge comes due, release is refused account-wide until it is paid.

**Preconditions:**

- The account's prior billing cycle's storage charge remains unpaid when the current cycle's charge comes due.

**Test data:** None — the case takes no input.

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Request release on a case under the account. | Release is refused under the account's outstanding-balance guard. |

**Properties:**

- **Severity:** critical
- **Priority:** high
- **Status:** draft
- **Behaviour:** negative
- **Type:** functional
- **Layer:** e2e
- **Automation status:** manual
- **Testability:** automation
- **Trace:** storage-billing-SC-16

### storage-billing-TC-17: Collector's blocked storage-only case is never forfeited

**Description:** Proves the "block, never confiscate" guarantee: a storage-only case blocked for an unpaid balance stays refused rather than ever reaching forfeiture, so the item is never seized over the bill.

**Preconditions:**

- The case is storage-only lane (no loan).
- The account is blocked for an unpaid storage balance.

**Test data:** None — the case takes no input.

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Collector asks for the item back. | The case cannot reach `forfeited`; release remains refused until the balance is paid, and the item is never confiscated. |

**Properties:**

- **Severity:** critical
- **Priority:** high
- **Status:** draft
- **Behaviour:** negative
- **Type:** regression
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** storage-billing-SC-18

## storage-billing-US-03: Collector's storage fee pauses while an item secures a loan

**As a** collector,
**I want** my storage fee and item count to stop while an item is collateral for an active loan,
**so that** I am never charged storage and loan interest on the same item at once.

**Covers:**

- `storage-billing-SC-03` — An active loan's collateral item is excluded from the count and the fee
- `storage-billing-SC-04` — The item resumes counting once its loan leaves active

### storage-billing-TC-18: Collector's active-loan collateral item is excluded from storage billing

**Description:** Proves the collateral pause: an item securing an active loan is invisible to storage billing — no count, no fee — for as long as the loan stays active.

**Preconditions:**

- The case is financed-lane, at status `active` (payout recorded, loan not yet repaid).

**Test data:** None — the case takes no input.

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Assess the account's storage-billable items. | The item does not count toward the account's item count or declared value, and no storage fee is charged for it. |

**Properties:**

- **Severity:** critical
- **Priority:** high
- **Status:** draft
- **Behaviour:** positive
- **Type:** smoke
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** storage-billing-SC-03

### storage-billing-TC-19: Collector's item resumes counting once its loan leaves active

**Description:** Proves the pause is temporary: once a case's loan moves out of `active` (repaid), its still-vaulted item counts and bills again from the next cycle onward.

**Preconditions:**

- The case's loan status moves from `active` to `repaid`.
- The item remains at status `vaulted`.

**Test data:** None — the case takes no input.

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Reach the account's next monthly billing cycle. | The item counts toward the account's item count, declared value, and charge from that cycle onward. |

**Properties:**

- **Severity:** major
- **Priority:** high
- **Status:** draft
- **Behaviour:** positive
- **Type:** functional
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** storage-billing-SC-04
