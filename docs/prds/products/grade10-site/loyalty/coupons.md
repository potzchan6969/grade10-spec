---
title: Coupons
spec: grade10-site/loyalty/programme
order: 5
---

A coupon is what a redemption leaves the member holding, and what an order
carries to spend it. A reward coupon is always welded onto the order's own
lines — a cut on the lines it applies to, or a gift line — and never a shop
code. What each kind takes off is on
[Rewards](/p/grade10-site/loyalty/rewards).

## Applying one

| Channel | How it lands |
| --- | --- |
| Online | The draft order the checkout builds carries the weld on its lines |
| At the till | Staff apply it from the member's panel, or type it, and the terminal welds it onto the sale |

- **Reserved, then settled** — a coupon is held against the order being paid
  and freed again if that order is not
- **One live attempt** — a second application while one is in flight is
  refused
- **The order's one discount** — a reward coupon is in that count; points
  paid against the bill, and free shipping, sit outside it —
  [Discounts](/p/grade10-site/store/discounts)

Refused, and the member is told which: nothing in the basket matches what the
coupon applies to, the basket is under the coupon's threshold, the currency is
not the programme's, every eligible line is already free, or a gift's variant
is in the basket already.

## When it counts as used

**Settlement, never checkout.** A coupon on a draft nobody paid was never
spent, so it is stamped used by the paid order that carried it and by nothing
else.

- **Used has no way back** — cancelling or refunding that order leaves the
  coupon used and the points spent; only an order that never paid returns one
  to the member, and a reservation nothing ever settles is freed a day later
- **A mismatch is a person's to settle** — a coupon used twice, or used by
  someone who does not hold it

## Validity

| Property | Value |
| --- | --- |
| What it takes off | What the reward defines |
| Uses | One |
| Who | The member who redeemed it, in either channel |
| Runs from | The redemption, for the days the reward states |
| Expiry | Read off the clock, never written down |

A coupon whose validity passes stays spent. Bought and not used is the
member's own, and the money is counted as breakage in the liability register,
which reports outstanding points as a count and the money out in coupons as
money — answering `none` where nothing is outstanding and `unavailable` with a
reason where it cannot be read, never a zero.

::story{id="loyalty-membership-couponlist--default" title="The coupons a member holds"}

## Store promotions

An operator's own discount codes, minted with a prefix and a threshold, are
the store's and not the programme's. They take money off the whole order, the
shop evaluates them itself, and no reward ever defines one —
[Discounts](/p/grade10-site/store/discounts).

:::callout{kind="warning"}
The durable spec has no notion of a coupon: a redemption there is an
entitlement with no settlement. Everything on this page is specified in the
in-flight `revise-loyalty-programme-rules` and `add-shopify-membership-pos`
changes. The one-discount count is decided and unbuilt: a welded coupon still
refuses order discounts alone and combines with the rest.
:::

:::detail{title="Where a coupon lives" for="engineer"}
Two registries. Loyalty's `coupon_instances` is the member's own: one row per
redemption, carrying the definition it was bought under, with `available`,
`reserved`, `used`, `expired` and `void`; `coupon_usages` is one attempt to
apply one to one order, keyed for idempotency and unique on a live attempt per
coupon. The store's own registry holds every coupon the store issued whatever
granted it, as `live`, `used` or `void`. A reward coupon's provider artifact is
always `draft_line_discount` — `discount_code` is the store registry's and
never reaches loyalty. Metric: `loyalty.coupon.reservation_released`.
:::
