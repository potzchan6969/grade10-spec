**Author:** @tangconst - 2026-10-29

## Why

The Tiers & Benefits surface no longer draws a stepper: the member's
standing lives on the tier card, so the standalone page and its ladder
were removed and `TierLadder` was deleted from `@grade10/ui`. The
programme spec still names the export and holds its render requirements —
the contract and the package disagree until this delta lands.

## What Changes

- **Export contract** - `TierLadder` leaves the membership surface's
  export list, and its climb-order, invitation-only and qualifying-line
  requirements go with it. `TierCard`, `TierInfoCard`, `HowPointsWork`,
  `MemberPass`, `RewardMenu`, `CouponList` and `PointHistory` are
  unchanged. The programme's config ladder — tiers ordered and validated
  at boot — is a product rule, untouched.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/loyalty/programme`: the membership surface exports

## Impact

- **`packages/ui`** - `TierLadder` is already deleted on
  `fix/membership-coupons`; this change is the contract half of that
  removal
