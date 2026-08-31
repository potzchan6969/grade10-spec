## Purpose

Charges a collector account for keeping items in vault custody, on a free
tier that never grows a value ceiling and paid tiers above it, pauses the
charge while an item secures a loan, and blocks withdrawal — never
confiscates — when the balance goes unpaid.

## Feature set

- Storage plan tiers
  - Free tier: keeps a small collection genuinely free, whatever it is worth
  - Standard tier: mid-value collections above the free item ceiling
  - Premium tier: high-value collections above the free item ceiling
  - Tier assessment: recomputed once per billing cycle, from storage-billable items only
- Storage-billable items
  - Eligibility window: counts only while an item is vaulted and not loan collateral
  - Collateral pause: a financed item is invisible to billing while its loan is active
- Monthly billing
  - Billing cycle: one charge per account per month, no proration
  - Billing currency: set once, from the account's first storage-billable item
- Payment status
  - Missing payment method: a visible account state, not a silent accrual
  - Overdue notice: collector warned before any block, on the first missed charge
  - Withdrawal block: an unpaid balance folds into the release guard the case lifecycle already applies
  - Never confiscation: forfeiture stays financed-lane, manual, and unrelated to a storage balance

## User journeys

### storage-billing-US-01: Collector reviews what their vaulted collection costs

**As a** collector,
**I want** to see my account's current storage tier, its monthly fee, and any balance I owe,
**so that** I understand what keeping my collection in custody costs before a charge surprises me.

**Accepted by:**

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

### storage-billing-US-02: Collector is warned before an unpaid balance blocks a withdrawal

**As a** collector,
**I want** to be told my storage balance is overdue and that continued non-payment will block me from withdrawing my items,
**so that** I can pay before I am refused at the counter.

**Accepted by:**

- `storage-billing-SC-15` — First missed or failed charge triggers an immediate overdue notice
- `storage-billing-SC-16` — A second unpaid cycle blocks release account-wide
- `storage-billing-SC-17` — Paying the balance in full clears the block
- `storage-billing-SC-18` — A blocked storage-only case is never forfeited
- `storage-billing-SC-19` — Forfeiture stays manual, financed-lane-only, and independent of storage balance

### storage-billing-US-03: Collector's storage fee pauses while an item secures a loan

**As a** collector,
**I want** my storage fee and item count to stop while an item is collateral for an active loan,
**so that** I am never charged storage and loan interest on the same item at once.

**Accepted by:**

- `storage-billing-SC-03` — An active loan's collateral item is excluded from the count and the fee
- `storage-billing-SC-04` — The item resumes counting once its loan leaves active

## ADDED Requirements

### Requirement: An item is storage-billable only while vaulted and not loan collateral

An item SHALL count toward its account's storage-billable item count and
declared value, and SHALL be included in the account's monthly storage
charge, only under the conditions below.

| Case condition | Storage-billable? |
| --- | --- |
| Case status is `vaulted`, storage-only lane | Yes |
| Case status is `vaulted`, financed lane, loan status is not `active` (not yet paid out, or `repaid`) | Yes |
| Case status is before `vaulted` (`draft` through `signing`) | No |
| Case status is `vaulted`, financed lane, loan status is `active` (payout recorded, not yet repaid) | No — collateral pause |
| Case status is a terminal status that ends custody (`released`, `cancelled`, `forfeited`) | No |

#### Scenario: storage-billing-SC-01 - A vaulted storage-lane item counts

- **GIVEN** a storage-lane case at status `vaulted`
- **WHEN** the account's storage-billable items are assessed
- **THEN** the item counts toward the account's item count and declared value

#### Scenario: storage-billing-SC-02 - An item before vaulted does not count

- **GIVEN** a case at status `signing`, not yet `vaulted`
- **WHEN** the account's storage-billable items are assessed
- **THEN** the item does not count toward the account's item count, declared value, or charge

#### Scenario: storage-billing-SC-03 - An active loan's collateral item is excluded from the count and the fee

- **GIVEN** a financed-lane case at status `active` (payout recorded, not yet repaid)
- **WHEN** the account's storage-billable items are assessed
- **THEN** the item does not count toward the account's item count or declared value, and no storage fee is charged for it

#### Scenario: storage-billing-SC-04 - The item resumes counting once its loan leaves active

- **GIVEN** a financed-lane case that moves from `active` to `repaid`, its item still `vaulted`
- **WHEN** the account's next monthly billing cycle assesses storage-billable items
- **THEN** the item counts toward the account's item count, declared value, and charge from that cycle onward

### Requirement: Storage plan tiers

An account SHALL be assigned exactly one storage plan tier, from its
storage-billable item count and total declared value.

| Tier | Item count | Total declared value | Monthly fee |
| --- | --- | --- | --- |
| Free | 3 or fewer | Any | 0 |
| Standard | 4 or more | Up to and including 10,000 major units of the account's billing currency | 5 major units |
| Premium | 4 or more | Above 10,000 major units of the account's billing currency | 20 major units |

The Free tier's item-count ceiling SHALL be the only condition that removes
an account from it. No declared-value ceiling SHALL apply to the Free tier.

#### Scenario: storage-billing-SC-05 - Free tier stays free regardless of a single item's value

- **GIVEN** an account with 1 storage-billable item declared at 5,000,000 minor units USD
- **WHEN** the account's tier is assessed
- **THEN** the account is on the Free tier and charged 0

#### Scenario: storage-billing-SC-06 - Free tier holds at exactly three items

- **GIVEN** an account with 3 storage-billable items, of any total declared value
- **WHEN** the account's tier is assessed
- **THEN** the account is on the Free tier and charged 0

#### Scenario: storage-billing-SC-07 - A fourth item moves the account to Standard

- **GIVEN** an account with 4 storage-billable items totaling 500,000 minor units USD
- **WHEN** the account's tier is assessed
- **THEN** the account is on the Standard tier and charged 500 minor units USD

#### Scenario: storage-billing-SC-08 - Total declared value above the Standard ceiling selects Premium

- **GIVEN** an account with 4 storage-billable items totaling 1,000,001 minor units USD
- **WHEN** the account's tier is assessed
- **THEN** the account is on the Premium tier and charged 2,000 minor units USD

### Requirement: Tier is assessed once per billing cycle, never mid-cycle

An account's tier and monthly fee SHALL be assessed at the start of each
monthly billing cycle, from the storage-billable items in effect at that
moment. A change in item count, declared value, or collateral status that
occurs mid-cycle SHALL NOT change the fee already charged for that cycle;
it SHALL take effect at the next cycle's assessment.

#### Scenario: storage-billing-SC-09 - Crossing a threshold mid-cycle takes effect next cycle

- **GIVEN** an account on the Free tier that adds a 4th storage-billable item three days after its monthly charge
- **WHEN** the tier is assessed
- **THEN** the account remains Free-tier billed for the current cycle, and is assessed on the Standard or Premium tier starting at the next cycle

### Requirement: Monthly billing with no proration

Storage billing SHALL run one charge per account per calendar month, in the
account's billing currency, for the tier and fee assessed at that cycle's
start. A billing cycle in which the account has any storage-billable item
for any part of the cycle SHALL be charged the full monthly fee; no partial
charge SHALL be computed for a partial month, whether the item entered or
left custody mid-cycle.

#### Scenario: storage-billing-SC-10 - Partial month at the start of custody is charged in full

- **GIVEN** an item's case reaches `vaulted` on the 20th day of a monthly billing cycle
- **WHEN** that cycle's charge runs
- **THEN** the full monthly fee for the account's tier is charged, not a prorated amount for the 10 remaining days

#### Scenario: storage-billing-SC-11 - Partial month at the end of custody is charged in full

- **GIVEN** an item's case reaches `released` on the 5th day of a monthly billing cycle
- **WHEN** that cycle's charge runs
- **THEN** the full monthly fee for the account's tier at that cycle's start is charged, not a prorated amount for the 5 elapsed days

### Requirement: An account's billing currency is set once

An account's storage billing currency SHALL be set from the currency of the
first case whose item becomes storage-billable, and SHALL NOT change for the
life of the account. A later case in a different currency SHALL NOT be
refused at intake solely for that reason.

#### Scenario: storage-billing-SC-12 - First storage-billable item sets the account's billing currency

- **GIVEN** an account with no prior storage-billable item, and a case in HKD reaching `vaulted`
- **WHEN** the account's billing currency is determined
- **THEN** the account's billing currency is set to HKD

#### Scenario: storage-billing-SC-13 - A later case in a different currency is still accepted at intake

- **GIVEN** an account already billing storage in HKD, and a new case opened for an item valued in USD
- **WHEN** the new case is submitted
- **THEN** intake is not refused for the currency difference; how the new item's value and fee fold into the account's single bill is not decided by this requirement

### Requirement: A missing payment method is a visible account state

An account with no payment method on file SHALL accrue its monthly storage
charge as an unpaid balance rather than silently failing to charge, and the
collector SHALL be able to see that balance and that no payment method is on
file wherever the account's storage status is shown to them.

#### Scenario: storage-billing-SC-14 - No payment method on file still shows the accruing balance

- **GIVEN** a collector account assessed a monthly storage fee with no payment method on file
- **WHEN** the billing cycle's charge is attempted
- **THEN** the charge cannot be completed, the fee accrues as an unpaid balance, and the collector's view of their account shows the balance and that no payment method is on file

### Requirement: Collector is warned before any withdrawal block

The first monthly charge that fails or cannot be attempted (including no
payment method on file) SHALL produce an immediate notice to the collector
stating the balance is overdue and that continued non-payment will block
withdrawal. Withdrawal SHALL NOT be blocked at this point.

#### Scenario: storage-billing-SC-15 - First missed or failed charge triggers an immediate overdue notice

- **GIVEN** an account's monthly storage charge fails
- **WHEN** the failed charge is recorded
- **THEN** the collector is notified in that same cycle that the balance is overdue and that continued non-payment will block withdrawal, and release on the account's cases is not yet refused

### Requirement: Unpaid storage blocks withdrawal after one full missed cycle

When an account carries an unpaid storage balance from a prior billing cycle
that remains unpaid when the next cycle's charge comes due, release SHALL be
refused for every case under that account, under the same guard the case
lifecycle already applies to release ("nothing outstanding"), until the
balance is paid in full. This SHALL be computed at the time release is
attempted, not stored as a cached status on the case or the account.

#### Scenario: storage-billing-SC-16 - A second unpaid cycle blocks release account-wide

- **GIVEN** an account whose prior cycle's storage charge is still unpaid when the current cycle's charge comes due
- **WHEN** a collector requests release, or staff attempts to complete a release, on any case under that account
- **THEN** release is refused under the account's outstanding-balance guard

#### Scenario: storage-billing-SC-17 - Paying the balance in full clears the block

- **GIVEN** a blocked account whose outstanding storage balance is paid in full
- **WHEN** release is next attempted on a case under that account
- **THEN** release is not refused for an outstanding storage balance

### Requirement: Unpaid storage never leads to forfeiture

An unpaid storage balance SHALL NOT make any case eligible for forfeiture.
Forfeiture SHALL remain financed-lane only, manual, and triggered only by a
past-due loan with a recorded payout, unaffected by a storage balance.

#### Scenario: storage-billing-SC-18 - A blocked storage-only case is never forfeited

- **GIVEN** a storage-only lane case (no loan) whose account is blocked for an unpaid storage balance
- **WHEN** the collector asks for the item back
- **THEN** the case cannot reach `forfeited`; release remains refused until the balance is paid, and the item is never confiscated

#### Scenario: storage-billing-SC-19 - Forfeiture stays manual, financed-lane-only, and independent of storage balance

- **GIVEN** a financed-lane case with a recorded payout and an account also carrying an unpaid storage balance
- **WHEN** staff evaluate the case for forfeiture
- **THEN** forfeiture eligibility is decided solely by the loan's own past-due state, with no contribution from the storage balance
