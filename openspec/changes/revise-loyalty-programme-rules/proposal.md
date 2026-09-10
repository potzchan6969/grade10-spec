# Revise the loyalty programme's tier, points, and redemption rules

**Author:** @echo - 2026-08-18

Product context: [Grade10 loyalty programme](../../../docs/prds/products/grade10-site/loyalty/index.md).

The physical shop is a separate change, `add-shopify-membership-pos`, which
builds on this one.

## Why

The programme specified so far treats a tier as permanent, expires each point
twelve months after the purchase that earned it, and settles a redemption as an
unspecified entitlement. The business has since decided all three differently:
a tier is a twelve-month standing that has to be re-qualified, the balance
expires only when a member goes quiet for twelve months, and a redemption
settles as the kind of thing it is.

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
  and any earn or redemption resets that clock for the whole balance. Resetting
  only ever pushes the date out, so a late-arriving record shortens nothing.
- **One balance, and tier progress summed beside it.** The balance rises on
  earning and falls on redeeming; progress is what the member earned inside a
  period, never reduced by a redemption. Both are read from the same
  append-only entries, so a member who spends their points no longer loses
  their tier and nothing has to be kept in step.
- **Demotion resets tier progress.** Earnings from before a drop count toward
  nothing after it, so a lapsed term cannot re-promote a member out of its own
  earnings the next day.
- **A claw-back re-evaluates the tier at once.** Refunded spend is spend that
  never happened, so the tier it bought does not survive it.
- **An upgrade is immediate; the new rate is not.** Reaching the threshold
  promotes the member on the spot, including on their first purchase, and the
  higher multiplier applies from their next purchase rather than the one that
  triggered it.
- **Qualifying spend is what the member actually paid.** After discounts and
  after coupons, so redeeming a coupon cannot earn points on the value it
  already paid for. Order-level discounts are apportioned so a discount cannot
  be pushed onto the non-earning part of a basket.
- **Earning has a stated scope, on every channel.** Online and in-store
  purchases earn. Shipping, grading service fees, gift-card purchases, credit
  top-ups, auction wins, and unlisted categories do not, and no channel is a way
  around that.
- **Earning floors base points before the tier multiplier.** HKD 139 at 1.2×
  earns 15, never 16. The floor's place is deployed configuration, so the
  single-floor alternative stays one config line away.
- **Points pay for purchases at HKD 1 each.** A member can pay part of a bill
  with points on any channel that sells; the part paid in points earns nothing.
  Whether a channel debits the balance directly or settles the same debit
  through a money-off artifact, it costs the same points and records one
  redemption.
- **A redemption settles by what the reward is.** A reward that takes money off
  is delivered as a discount code with its own validity period set per item on
  the menu; a physical reward is handed over instead and never becomes a code.
- **An artifact left to expire stays spent.** Points return only through an
  operator's recorded cancellation; a used artifact is never reversed, and what
  members forfeit is counted where an operator can read it.
- **Deleting the account ends the membership at once** — balance, tier progress,
  coupons and pending collections, with the ledger record surviving for audit.
- **Tier names and identifiers become Silver and Gold**, replacing the
  pre-launch Platinum and Diamond names and persisted ids. No compatibility
  mapping or data migration is needed because the feature has not launched.
- **Points cannot be spent on an auction.**

## Non-Goals

- **The Black tier's remaining rules.** Its rate (1.7×) and invitation-only
  grant are specified and unchanged. The annual cap and the CEO approval step
  stay unenforced and parked, as they are today.
- **Auction earning.** Named as a Phase 2 candidate; this change specifies only
  that auctions neither earn nor redeem today.
- **Credit top-up earning.** Same — a later-phase candidate, specified here only
  as not earning.
- **The physical shop.** Identification at a till, staff acting for a member,
  and in-person collection all land with `add-shopify-membership-pos`.
- **Editable programme economics.** The rates, thresholds, windows, rounding
  order and validity periods stay deployed configuration, not operator fields.
- **The physical reward menu's content** — which items, their point prices, the
  collection window's length, and how counter stock decrements.

## Capabilities

### New Capabilities

None. Every change lands on the existing loyalty capability.

### Modified Capabilities

- `grade10-site/loyalty/programme`: tier validity and downgrade replace the permanent
  tier; demotion resets progress and a claw-back re-evaluates at once;
  activity-based balance expiry replaces per-credit expiry; tier progress is
  summed apart from the balance; earning gains a defined basis, scope and rounding
  order; redemption settles by reward kind and gains an artifact-expiry rule;
  points pay at checkout; an operator can remove a tier; account deletion ends
  the membership; and the ladder gains validity and retention thresholds
  validated at boot.

## Impact

| Application | What it must do |
| --- | --- |
| `grade10-loyalty` backend | Add tier-progress reset on demotion, points payment at checkout, and account-deletion teardown; flip the refund policy; extend redemption with per-unit quantity, artifact expiry and pending collection |
| `grade10-store` backend | Compute per-line earn eligibility with order-discount apportionment, and carry the channel on every recording |
| `grade10-loyalty` console | Show tier validity and retention progress; add tier removal and redemption cancellation |
| `grade10-loyalty` membership surface | Show two counts, the tier's validity end, retention progress, the balance's lapse date, and issued coupons |
| `grade10-auction` | Reject points and coupons against an auction purchase |

No design-system primitive changes. `packages/ui` gains four exports for the
membership surface — `MembershipSummary`, `RewardMenu`, `CouponList` and
`ActivityList` — named by the requirement *The membership surface exports*.

**Migration.** Little is needed. Tier validity and activity-based expiry are
already running: all four tier columns and `activity_expires_at` are in the
loyalty baseline, `tierValidity` is deployed, and both clocks are written on
every attainment, earn and redemption. There is no cohort holding a permanent
tier. What the migration adds is `channel` on existing rows, attributed to the
online store; the rest is repair that should touch nothing — completing any
tier row missing part of its term, and settling any credit already past its own
date before a member clock is written, since the effective rule is the later of
the two and a clock written ahead of a dead credit would revive it. Each credit
keeps its own date; a check constraint on `ledger_entries` requires it.

**Open decisions**, recorded in the PRD rather than resolved here: the retention
threshold (the deployed value is the same 500 that qualifies for the tier; the
business may prefer a softer 400), and the public names for the two counts.

## References

- [Points · Rules](../../../docs/prds/products/grade10-site/loyalty/points.md#rules)
- [Points · Qualification Criteria](../../../docs/prds/products/grade10-site/loyalty/points.md#qualification-criteria)
- [Points · Refunds](../../../docs/prds/products/grade10-site/loyalty/points.md#refunds)
- [Points · Expiry](../../../docs/prds/products/grade10-site/loyalty/points.md#expiry)
- [Tiers · Ladder](../../../docs/prds/products/grade10-site/loyalty/tiers.md#ladder)
- [Tiers · Tier Progress](../../../docs/prds/products/grade10-site/loyalty/tiers.md#tier-progress)
- [Tiers · Earn Multiplier](../../../docs/prds/products/grade10-site/loyalty/tiers.md#earn-multiplier)
- [Tiers · Keeping a Tier](../../../docs/prds/products/grade10-site/loyalty/tiers.md#keeping-a-tier)
- [Rewards · Using a Reward](../../../docs/prds/products/grade10-site/loyalty/rewards.md#using-a-reward)
- [Rewards · Cancelling a Redemption](../../../docs/prds/products/grade10-site/loyalty/rewards.md#cancelling-a-redemption)
- [Paying with Points · Rules](../../../docs/prds/products/grade10-site/loyalty/paying-with-points.md#rules)
- [Profile · Privacy](../../../docs/prds/products/grade10-site/loyalty/profile.md#privacy)
