# shared/ui/auction-listing Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-05, tcs-rules r4

## shared-ui-auction-listing-US1: The listing page blocks' rendering contract

**Walked by:** nobody on their own — a component contract; the journeys live in `grade10-site/auction/listing-page`, which composes the blocks

**As a** customer,
**I want** the lot page's blocks to show the gallery, my bidding and its disclosures as the contract states,
**so that** every storefront composing them shows me the same thing.

### shared-ui-auction-listing-US1-TC19-1: Draft at the ceiling is accepted

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

### shared-ui-auction-listing-US1-TC20-1: Typed digit past the ceiling restores the prior draft

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

### shared-ui-auction-listing-US1-TC21-1: Paste past the ceiling from empty stays empty

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

### shared-ui-auction-listing-US1-TC22-1: Paste past the ceiling restores the prior draft

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

### shared-ui-auction-listing-US1-TC23-1: Fractional paste that exceeds after whole-major cleaning restores the prior draft

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

### shared-ui-auction-listing-US1-TC24-1: Raise path restores on overshoot

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

### shared-ui-auction-listing-US1-TC25-1: Over-ceiling refuse shows no dedicated error

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
* No invalid-amount, below-floor or too-large message appears.

### shared-ui-auction-listing-US1-TC26-1: Fractional paste at the ceiling after cleaning is accepted

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** release
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Custom maximum ceiling

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` → CustomMaximumCeiling with the
  custom maximum draft `500`.

**Steps:**

1. Paste `9999999999.99` into the custom maximum field.

**Expected Results:**

* The draft shown is `9999999999`.

## Settled

- Ceiling is 9,999,999,999 whole major units for any listing currency.
- Overshoot restores the previous valid draft, including empty; never clamps.
- Refuse is silent; no dedicated too-large copy in this change.
- Auction-service keeps its own refusal above the currency's bid ceiling; with the JPY ceiling at 5,000,000,000, every currency's ceiling sits below the field (`cap-custom-maximum-entry` Q4, Q6).

## Reconciliation

**Run:** QA2 reconciliation 2026-10-05 for change `cap-custom-maximum-entry`, rereading every case in this suite against the delta's scenarios and the `Custom maximum ceiling` anchor after the accept-review fix round. Read the change's `proposal.md`, `decisions.md` (Q1 to Q6 and `## Raised`), `ui-design.md`, `tech-design.md`, `tasks.md`, this delta `spec.md` and `user-journeys.md`, the PRD's Custom Maximum section and the bidding page's Ceiling, Custom maximum and Bid ceiling lines, the durable `spec.md` and suite, the `bid-history-winner-priority` and `lot-gallery-strip-by-width` suites on this capability, `listing-bid-money.test.ts` and the `ListingAuctionBidCard` stories. QA1's blind pass had read the Purpose, the Feature set, the journeys, the proposal, Q1 to Q4, the stripped `ui-design.md`, the PRD lines and the durable suite with its Reconciliation stripped, and was denied every Requirements section and the archive.

| Finding | Disposition |
| --- | --- |
| Draft at ceiling `9999999999` accepted | **Folded in:** `shared-ui-auction-listing-SC-38` / `shared-ui-auction-listing-US1-TC19-1` |
| Typed digit past ceiling restores prior draft | **Folded in:** `shared-ui-auction-listing-SC-39` / `shared-ui-auction-listing-US1-TC20-1` |
| Paste past ceiling from empty stays empty, silent | **Folded in:** `shared-ui-auction-listing-SC-40` / `shared-ui-auction-listing-US1-TC21-1` |
| Paste past ceiling restores prior draft | **Folded in:** `shared-ui-auction-listing-SC-41` / `shared-ui-auction-listing-US1-TC22-1` |
| Fractional paste exceeds after whole-major cleaning restores | **Folded in:** `shared-ui-auction-listing-SC-42` / `shared-ui-auction-listing-US1-TC23-1` |
| Raise path restores on overshoot | **Folded in:** `shared-ui-auction-listing-SC-43` / `shared-ui-auction-listing-US1-TC24-1` |
| Over-ceiling refuse has no dedicated error | **Folded in:** `shared-ui-auction-listing-SC-40` and the requirement's no-ceiling-error-copy rule / `shared-ui-auction-listing-US1-TC25-1` |
| Raised questions from the blind pass | None - Q1 to Q4 already settled the ceiling, restore, silence and the service's own refusal |
| Accept-review, 2026-10-05: case ids `TC3` to `TC9` were the durable suite's quick-bid, raise-floor and gallery cases, which the fold would have overwritten | **Renumbered:** `shared-ui-auction-listing-US1-TC19-1` to `shared-ui-auction-listing-US1-TC25-1`, after the durable suite's last, `TC18`. QA2 found no collision with the durable suite or with `TC27`, `TC28` in `bid-history-winner-priority` |
| Accept-review, 2026-10-05: Q5 had no scenario - a fractional paste whose whole part equals the ceiling is accepted | **Folded in:** `shared-ui-auction-listing-SC-53` / `shared-ui-auction-listing-US1-TC26-1`. QA2 reread it: seed `500`, paste `9999999999.99` and the draft `9999999999` match the scenario |
| QA2: `TC25` expected "no dedicated too-large or over-ceiling error copy", but the requirement names the copy that stays away - the invalid-amount and below-floor messages | **Folded in:** `shared-ui-auction-listing-US1-TC25-1` now expects no invalid-amount, below-floor or too-large message |
| QA2: `TC26` expected no invalid-amount message, which `shared-ui-auction-listing-SC-53` does not state | **Folded in:** dropped from `shared-ui-auction-listing-US1-TC26-1`; the case asserts the scenario's THEN alone |
| QA2: `TC20` and `TC24` type "one more digit" where `shared-ui-auction-listing-SC-39` types `0` and `shared-ui-auction-listing-SC-43` types `1` | **Rejected:** any digit past `9999999999` overshoots, so the steps cover the scenarios' values; both cases are automated, and an automated case's wording moves only with its behaviour |
| QA2: `TC24` names `listing-bid-money.test.ts`, which never renders the raise title | **Rejected:** set and raise share one change handler in `listing-quick-maximum-bid-actions.tsx` that calls `sanitizeCustomMaximumDraft`, so the helper's test decides the draft on both |
| QA2: the cases name Storybook stories, not the scenarios' HKD listing | **Rejected:** `CustomMaximumCeiling` and `Leading` render an HKD listing, so the values match |
| QA2: `TC26` stays manual though `listing-bid-money.test.ts` pastes `9999999999.99` with an empty seed | **Rejected:** not QA's to flip; engineering flips it with `pnpm run tcs:automated` if that test is taken to decide it |
| QA2: facts across the artifacts - field ceiling 9,999,999,999 in any currency, restore not clamp, silent refuse, set and raise on one field, JPY bid ceiling 10,000,000,000 | **Rejected:** no artifact states one differently - the proposal, Q1 to Q6, `ui-design.md`, `tech-design.md`, both PRD pages and every case agree |

**Uncovered anchors:** none for `Custom maximum ceiling`.

**Run:** QA2 reconciliation 2026-10-05, rerun after the accept-review fixes, for change `cap-custom-maximum-entry`. Reread every case in this suite against the delta's seven scenarios and the `Custom maximum ceiling` anchor, after the decisions rows named their carriers, `tech-design.md` and `ui-design.md` put `CUSTOM_MAXIMUM_MAJOR_CEILING` and `sanitizeCustomMaximumDraft` outside the contract, task 3.3 took the `TC26` walk, and the US1 header and journeys line took the durable text. Read the change's `proposal.md`, `decisions.md` (Q1 to Q6 with their carriers, and `## Raised`), `ui-design.md`, `tech-design.md`, `tasks.md`, this delta `spec.md` and `user-journeys.md`, the PRD's Custom Maximum section and the bidding page's Ceiling, Custom maximum and Bid ceiling lines, the durable `spec.md`, suite and journeys, the `bid-history-winner-priority` and `lot-gallery-strip-by-width` suites on this capability, `listing-bid-money.ts` and its test, `listing-quick-maximum-bid-actions.tsx` and the `ListingAuctionBidCard` stories. It is a statement, not proof.

| Finding | Disposition |
| --- | --- |
| Each case against its scenario - `TC19` / `SC-38`, `TC20` / `SC-39`, `TC21` / `SC-40`, `TC22` / `SC-41`, `TC23` / `SC-42`, `TC24` / `SC-43`, `TC26` / `SC-53` | **Joined:** the GIVEN drafts, the typed and pasted values and the drafts each THEN names match; `TC25` carries the requirement's No ceiling error copy clause |
| The decisions rows' carriers - Q1 to `shared-ui-auction-listing-SC-38`, Q2 to `shared-ui-auction-listing-SC-39` to `-SC-43`, Q3 to `shared-ui-auction-listing-SC-40`, Q5 to `shared-ui-auction-listing-SC-53` | **Joined:** each carrier has a case here, and no case asserts what its row did not decide |
| The ceiling helpers are exports for stories and tests outside the listing surface's contract, yet `TC19` to `TC24` name `listing-bid-money.test.ts`, which tests the helper | **Rejected:** a Decided-by line names what decides a case, not a contract export; set and raise both route every edit through `sanitizeCustomMaximumDraft` in `listing-quick-maximum-bid-actions.tsx`, so the helper's test decides the draft each case reads |
| The US1 header and the journeys line now read as the durable suite's | **Joined:** both match the durable text verbatim, so the fold rewrites neither |
| Task 3.3 walks `shared-ui-auction-listing-US1-TC26-1` on CustomMaximumCeiling with the seed `500`, paste `9999999999.99`, draft `9999999999` | **Joined:** the walk's values are `shared-ui-auction-listing-SC-53`'s and the case's |
| `TC19` and `TC21` start from an empty field, while CustomMaximumCeiling's play seeds `500` | **Rejected:** a pre-condition states the field's state, and clearing the seed reaches it; both cases are automated, so their wording moves only with their behaviour |
| The suite's two manual cases had no `### Manual` row saying what a person drives | **Folded in:** `### Manual` below names the walk for `shared-ui-auction-listing-US1-TC25-1` and `shared-ui-auction-listing-US1-TC26-1` |
| Case ids against the durable suite (last `TC18`) and the other active changes on this capability - `bid-history-winner-priority` now issues `TC27` to `TC29`, `lot-gallery-strip-by-width` `TC10` to `TC12` | **Joined:** `TC19` to `TC26` collide with none; scenario ids `SC-38` to `SC-43` and `SC-53` collide with neither the durable spec nor `SC-47` to `SC-51` and `SC-54` |
| Facts across the artifacts after the fixes - field ceiling 9,999,999,999 in any currency, restore not clamp, silent refuse, set and raise on one field, JPY bid ceiling 10,000,000,000 | **Joined:** the proposal, Q1 to Q6, `ui-design.md`, `tech-design.md`, `tasks.md`, both PRD pages and every case agree; nothing for `## Raised` |

**Uncovered anchors:** none for `Custom maximum ceiling`; every scenario on the anchor has a case asserting its THEN.

### Manual

| Manual | Why |
| --- | --- |
| `shared-ui-auction-listing-US1-TC25-1` | A person makes a refused edit on CustomMaximumCeiling and reads the panel around the field for any invalid-amount, below-floor or too-large message; the helper's test returns a draft and renders no panel |
| `shared-ui-auction-listing-US1-TC26-1` | A person pastes `9999999999.99` over the seeded `500` on CustomMaximumCeiling and reads the draft, in task 3.3's walk; engineering flips it with `pnpm run tcs:automated` if the helper's paste from an empty seed is taken to decide it |
