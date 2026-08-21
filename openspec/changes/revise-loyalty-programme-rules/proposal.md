# Revise the loyalty programme's tier, points, and redemption rules

**Author:** @echo - 2026-08-18

Product context: [Grade10 loyalty programme](../../../docs/prds/loyalty/programme.md).

## Why

The programme specified so far treats a tier as permanent, expires each point
twelve months after the purchase that earned it, and settles a redemption as an
unspecified entitlement. The business has since decided all three differently:
a tier is a twelve-month standing that has to be re-qualified, the balance
expires only when a member goes quiet for twelve months, and a redemption is a
discount code the member takes to checkout or the counter.

The gap is not academic. A permanent tier costs 1.2× forever on a member who
bought once and left, so the programme's most expensive members are the ones it
no longer has. Per-purchase point expiry is also the wrong nudge: it burns a
returning buyer's oldest points while they are actively buying, which is exactly
the behaviour the programme exists to reward. And with no decided settlement, a
redemption today produces a promise an operator has to honour by hand, so the
reward menu cannot open at all.

The measurable claim: **share of Gold members who re-qualify within their
validity period**, alongside the existing repeat-purchase rate. If tiers with a
validity period work, the second number holds while the population earning 1.2×
tracks members who are still buying.

## What Changes

- **BREAKING — A tier is valid for twelve months and can be lost.** A tier is
  activated the moment a member reaches it, holds for twelve months, and drops
  to the tier they still hold by earning or invitation — the entry tier when
  none is live — unless they earn the retention threshold again inside that
  period. This replaces "a tier once earned is kept".
- **BREAKING — The redeemable balance expires on inactivity, not per purchase.**
  The whole balance expires after twelve months with no earn and no redemption,
  and any earn or redemption resets that clock for the whole balance. This
  replaces per-credit expiry measured from the earning purchase.
- **Tier points and redeemable points become two ledgers.** Tier points are
  cumulative and never reduced by redeeming; redeemable points are the spendable
  balance. A member who spends their points no longer loses their tier progress.
- **An upgrade is immediate; the new rate is not.** Reaching the threshold
  promotes the member on the spot, including on their first purchase, and the
  higher multiplier applies from their next purchase rather than the one that
  triggered it.
- **Qualifying spend is what the member actually paid.** After discounts and
  after coupons, so redeeming a coupon cannot earn points on the value it
  already paid for. Order-level discounts are apportioned so a discount cannot
  be pushed onto the non-earning part of a basket.
- **Earning has a stated scope.** Online store and counter purchases earn.
  Shipping, grading service fees, gift-card purchases, credit top-ups, auction
  wins, and unlisted categories do not.
- **A redemption issues a coupon.** Every reward, discount or physical item, is
  delivered as a discount code with its own validity period set per item on the
  menu. A member cannot convert a coupon back into points; an operator can still
  reverse a redemption on the record, which voids the coupon.
- **Points cannot be spent on an auction.**
- **A counter member is identified by the email on their account**, resolved
  through the identity system, so the programme still stores no email address.

## Non-Goals

- **The Black tier's full rules.** Its rate (1.7×), its invitation-only nature,
  and the operator grant mechanism are already specified and unchanged. The
  annual cap and the CEO approval step stay unenforced and parked, as they are
  today.
- **The points-to-money exchange rate.** Still undecided, so the menu's prices
  stay operator-editable and no monetary value is recorded against a point.
- **Auction earning.** Named as a Phase 2 candidate; this change specifies only
  that auctions neither earn nor redeem today.
- **Credit top-up earning.** Same — a later-phase candidate, specified here only
  as not earning.
- **Editable programme economics.** The rates, thresholds, windows, and validity
  periods stay deployed configuration, not operator fields.
- **Changing what an operator can do.** Permissions, the operator log, and the
  console's shape are untouched beyond the reversal wording.

## Capabilities

### New Capabilities

None. Every change lands on the existing loyalty capability.

### Modified Capabilities

- `grade10-store/loyalty`: tier validity and downgrade replace the permanent
  tier; activity-based balance expiry replaces per-credit expiry; tier points
  and redeemable points separate; earning gains a defined basis and scope;
  redemption becomes a coupon issuance; the ladder gains per-tier validity and
  retention thresholds validated at boot.

## Impact

| Application | What it must do |
| --- | --- |
| `grade10-loyalty` backend | Split the ledger reads into tier points and redeemable points, replace the expiry model, add tier validity and re-qualification, issue and void coupons, and validate the extended ladder at boot |
| `grade10-store` backend | Compute qualifying spend after discounts and coupons, apportion order-level discounts, exclude the non-earning lines, and carry the channel on every recording |
| Counter / POS integration | Resolve the member by account email through the identity system before recording, and complete the sale when it cannot |
| `grade10-loyalty` console | Show tier validity and retention progress; reversal wording changes, the action does not |
| `grade10-loyalty` membership surface | Show two balances, the tier's validity end, retention progress, and the balance's expiry date; list issued coupons and their own expiry |
| `grade10-auction` | Reject points and coupons against an auction purchase |

No design-system primitive changes and no `packages/ui` export contract
changes.

**Migration.** Members holding a tier when this lands have no activation date
and no retention counter. A member's current tier should be activated at the
date the change deploys, giving everyone a full validity period to re-qualify
in; the alternative — backdating activation to the purchase that first
qualified them — demotes members on day one for a rule that did not exist when
they earned it. Existing per-credit expiry dates are dropped in favour of one
last-activity date per member, taken from that member's most recent earn or
redemption.

**Open decisions**, recorded in the PRD rather than resolved here: the
retention threshold (the baseline is the same 500 that qualifies for the tier;
the business may prefer a softer 400), and the exchange rate that prices the
reward menu.
