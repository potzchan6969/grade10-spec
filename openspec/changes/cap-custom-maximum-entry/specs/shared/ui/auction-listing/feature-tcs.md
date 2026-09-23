# shared/ui/auction-listing Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-23, tcs-rules r3.0

## shared-ui-auction-listing-US1: The bid panel's rendering contract

**As an** application composing the shared bid panel,
**I want** every standing and every disclosure to render exactly as the
contract states,
**so that** each storefront embedding the panel shows collectors the same thing.

### shared-ui-auction-listing-US1-TC3-1: Draft at the ceiling is accepted

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, release
* **Layer:** unit
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Custom maximum ceiling

**Decided by:** `packages/ui/src/blocks/auction-listing/listing-bid-money.test.ts`

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` → CustomMaximumCeiling with the
  custom maximum field empty.

**Steps:**

1. Enter `9999999999` into the custom maximum field.

**Expected Results:**

* The draft shown is `9999999999`.

### shared-ui-auction-listing-US1-TC4-1: Typed digit past the ceiling restores the prior draft

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** release
* **Layer:** unit
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Custom maximum ceiling

**Decided by:** `packages/ui/src/blocks/auction-listing/listing-bid-money.test.ts`

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` → CustomMaximumCeiling with
  custom maximum draft `9999999999`.

**Steps:**

1. Type one more digit into the custom maximum field.

**Expected Results:**

* The draft remains `9999999999`.
* The field is not clamped to another value.

### shared-ui-auction-listing-US1-TC5-1: Paste past the ceiling from empty stays empty

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** release
* **Layer:** unit
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Custom maximum ceiling

**Decided by:** `packages/ui/src/blocks/auction-listing/listing-bid-money.test.ts`

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` → CustomMaximumCeiling with the
  custom maximum field empty.

**Steps:**

1. Paste `10000000000` into the custom maximum field.

**Expected Results:**

* The draft remains empty.
* No invalid-amount or too-large message appears solely because of the
  rejected paste.

### shared-ui-auction-listing-US1-TC6-1: Paste past the ceiling restores the prior draft

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** release
* **Layer:** unit
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Custom maximum ceiling

**Decided by:** `packages/ui/src/blocks/auction-listing/listing-bid-money.test.ts`

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` → CustomMaximumCeiling with
  custom maximum draft `500`.

**Steps:**

1. Paste `99999999999` into the custom maximum field.

**Expected Results:**

* The draft remains `500`.

### shared-ui-auction-listing-US1-TC7-1: Fractional paste that exceeds after whole-major cleaning restores the prior draft

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** release
* **Layer:** unit
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Custom maximum ceiling

**Decided by:** `packages/ui/src/blocks/auction-listing/listing-bid-money.test.ts`

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` → CustomMaximumCeiling with
  custom maximum draft `500`.

**Steps:**

1. Paste `10000000000.99` into the custom maximum field.

**Expected Results:**

* The draft remains `500`.

### shared-ui-auction-listing-US1-TC8-1: Raise path restores on overshoot

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** release
* **Layer:** unit
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Custom maximum ceiling

**Decided by:** `packages/ui/src/blocks/auction-listing/listing-bid-money.test.ts`

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` → Leading (raise private
  maximum) with custom maximum draft `9999999999`.

**Steps:**

1. Type one more digit into the custom maximum field.

**Expected Results:**

* The draft remains `9999999999`.

### shared-ui-auction-listing-US1-TC9-1: Over-ceiling refuse shows no dedicated error

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** release
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Custom maximum ceiling

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` → CustomMaximumCeiling with a
  valid custom maximum draft (empty or below the ceiling).

**Steps:**

1. Attempt an over-ceiling edit that is refused (typed digit or paste).
2. Observe the panel around the custom maximum field.

**Expected Results:**

* The previous valid draft is restored.
* No dedicated too-large or over-ceiling error copy appears.

## Settled

- Ceiling is 9,999,999,999 whole major units for any listing currency.
- Overshoot restores the previous valid draft, including empty; never clamps.
- Refuse is silent; no dedicated too-large copy in this change.
- Auction-service refuse of the same ceiling is a follow-on, not this change.

## Reconciliation

**Run:** Blind pass read Purpose (durable), Feature set (delta),
user-journeys.md, proposal.md, decisions.md (goals, non-goals, Q1–Q4, empty
Raised), ui-design.md with state dispositions stripped to the
Custom maximum ceiling anchor, PRD Custom Maximum / Auction Panel ceiling
lines, and durable feature-tcs.md for id continuity with Reconciliation
stripped. Denied: every Requirements section, openspec/specs/ beyond those
excerpts, openspec/changes/archive/.

| Finding | Disposition |
| --- | --- |
| Draft at ceiling `9999999999` accepted | Folded as covered by `shared-ui-auction-listing-SC-38` / `shared-ui-auction-listing-US1-TC3-1` |
| Typed digit past ceiling restores prior draft | Folded as covered by `shared-ui-auction-listing-SC-39` / `shared-ui-auction-listing-US1-TC4-1` |
| Paste past ceiling from empty stays empty, silent | Folded as covered by `shared-ui-auction-listing-SC-40` / `shared-ui-auction-listing-US1-TC5-1` |
| Paste past ceiling restores prior draft | Folded as covered by `shared-ui-auction-listing-SC-41` / `shared-ui-auction-listing-US1-TC6-1` |
| Fractional paste exceeds after whole-major cleaning restores | Folded as covered by `shared-ui-auction-listing-SC-42` / `shared-ui-auction-listing-US1-TC7-1` |
| Raise path restores on overshoot | Folded as covered by `shared-ui-auction-listing-SC-43` / `shared-ui-auction-listing-US1-TC8-1` |
| Over-ceiling refuse has no dedicated error | Folded as covered by `shared-ui-auction-listing-SC-40` and `shared-ui-auction-listing-US1-TC9-1` |
| Raised questions from the blind pass | None — Q1–Q4 already settled the ceiling, restore, silence, and server deferral |
