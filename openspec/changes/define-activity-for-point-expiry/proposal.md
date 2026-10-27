**Author:** @tangconst - 2026-10-27

## Why

The twelve-month inactivity lapse never said what "no activity" means, so the
ledger and the member could disagree on what keeps a balance alive. The
programme now fixes it: buying and topping up are activity, and nothing else
is — with one open call on whether redeeming still counts.

**Metric:** share of lapses a member could have prevented with one purchase
or top-up (expected to rise as the rule becomes legible); secondary: support
contacts about balances lapsing after a redemption (watch).

## What Changes

- **Activity defined** — a member's inactivity window resets only on a
  purchase, online or in store, or on a points top-up. Nothing else moves
  the date
- **Any purchase counts** — whatever it cost, including a spend too small
  to earn a point, and however it was tendered, including one paid partly
  or fully with points
- **A refunded purchase still counts** — the purchase was activity on the
  day it happened; a later refund, even in full, does not take the reset
  back, though its points still claw back as today
- **A top-up counts on credit** — the window moves on the day the pack is
  credited, not the day it is paid; the payment gateway makes that gap
  near-instant
- **Operator actions unchanged** — a grant, a correction, a reversal and a
  console restart behave exactly as the running spec has them
- **Redemption open** — the proposal is that redeeming stops resetting the
  window, so only money in keeps a balance alive. Not confirmed by the PM;
  ❓ on the [Points page](../../../docs/prds/products/grade10-site/loyalty/points.md#expiry)

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### Modified Capabilities

- `grade10-site/loyalty/programme` — the requirement `The redeemable
  balance expires after a period of inactivity` redefines what resets the
  window: purchases and top-up credits in, redemption out pending PM
  confirmation, operator movements unchanged

## Impact

- **Loyalty backend** — the activity test moves from "earn or redemption"
  to "purchase or top-up credit"; a purchase later refunded in full keeps
  its reset, and a redemption no longer moves the date if the open call
  lands that way
- **Member surfaces** — the expiry table on the membership pages and the
  [Points page](../../../docs/prds/products/grade10-site/loyalty/points.md#expiry)
  examples re-read under the new rule
- **Consumer apps** — grade10-site only; no component export changes

## References

- [Points · Expiry](../../../docs/prds/products/grade10-site/loyalty/points.md#expiry)
- [Top-ups · Topped-up points](../../../docs/prds/products/grade10-site/loyalty/top-ups.md#topped-up-points)
