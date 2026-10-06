# A coupon is never locked

**Author:** @brianchacha6969 - 2026-09-15

Product context: [Coupons · Applying one](../../../docs/prds/products/grade10-site/loyalty/coupons.md#applying-one),
[Coupons · Refusals](../../../docs/prds/products/grade10-site/loyalty/coupons.md#refusals)
and [Discounts · Online draft order mechanism](../../../docs/prds/products/grade10-site/store/discounts.md#online-draft-order-mechanism).

## Why

A member who walks away from a counter cannot spend their own coupon. The sale
is never cancelled, on purpose — the shop's cart goes on collecting and the
money still has to bind to the row it was promised against — so the order stays
open, keeps the coupon, and keeps its code live. Nothing releases either. The
coupon then disappears from their cart drawer, and the checkout that does reach
it is told only that the coupon is not available.

It fails the other way too. A member with a checkout open on their phone is
refused at the till: staff cannot see the coupon in the member's panel, and the
member revealing it from their own screen is refused in front of a shopkeeper.

What was meant to stop one coupon paying for two orders does not even do that.
The claim is released by a clock after a day, and the code minted for it lives
a day from a later moment — so the sweep frees the coupon while its code is
still live, and manufactures exactly the double discount it exists to prevent.

Every other instrument on the platform already works the other way. Points are
held by nothing. The store's own coupons are held by nothing. The reward coupon
is the one exception, and the exception buys nothing.

The measurable claims: **coupon claims refused as unavailable**, which should
reach zero, and **coupons spent within a day of a counter sale the member
walked away from**.

## What Changes

- **A coupon is never held.** It stays spendable until a paid order takes it,
  the same rule points and store coupons already run under. A checkout the
  member walks away from, and a counter sale nobody tendered, cost them
  nothing.
- **A claim moves the coupon.** Before a sale asks the programme for a coupon,
  the store gives back every claim its own orders hold on it — the claim
  leaves that sale, the code minted for it is deactivated, and an online draft
  is cancelled.
  No draft and no counter sale locks a coupon the member wants to spend
  somewhere else.
- **A counter sale keeps its cart and loses its claim.** The shop owns that
  cart and it can still collect, so a newer promise retires the sale and never
  cancels it; whatever reward it holds leaves it, and a cart that already
  carries the code is settled against what it carried.
- **The one refusal left is a sale that cannot let go.** An online checkout
  the provider reports collected, one the provider will not close, or a sale
  still being submitted with the coupon. The member
  is told an earlier sale stands, not that their coupon is unavailable. A code
  the shop will not deactivate refuses nothing: the deactivation is retried.
- **A counter sale nobody paid gives the coupon back an hour after its last
  plan.** An online order that only expires keeps its claim until its code can
  no longer be collected, and the programme's clock then releases it.
- **A counter sale a reward's code has left takes no reward again.** The
  remedy is a new sale, and points still go on. A counter sale a newer promise
  retired takes no new plan at all, and the till tells staff to ring the goods
  on a new sale. A fresh scan on the cart of a sale still open, carrying the
  member's reward code, is not yet decided, since a till session ends long
  before a sale's hour (decisions.md, Raised R1).
- **A sale that collects a code this store deactivated is reported, and pays
  for the coupon once.** It spends the coupon where no other sale claims it.
  Today nothing looks: a reward's code is the only one that never reaches the
  mint register, so no reader corroborates it against what the sale carried.
- **The member is shown no claimed state.** In the wallet, the cart drawer and
  the till panel a coupon a sale claims reads as it would unclaimed.
- **The stale-claim sweep stops freeing a coupon whose code is still live.** It
  runs on the same clock as the code it is meant to outlast, and the code is
  minted after the claim — so today it manufactures the double discount it
  exists to prevent.
- **A claim given back frees its retry key.** The same sale asking again gets a
  new claim; a claim the shop already collected still refuses a second.
- **An operator's reversal is still refused while a sale claims the coupon**,
  and stops being refused once that sale gives the coupon back.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/loyalty/programme`: a coupon is held by nothing and the newest
  claim is the only live one; a claim's retry key answers only while the claim
  stands; a reversal is refused only while a sale claims the coupon, and the
  programme's own clock never frees a coupon whose code is live; a claim a
  checkout left before its order was written is released by the next claim;
  the member's coupon list and `CouponList`'s contract carry no code for a
  reward coupon; what a redemption forfeits when it
  lapses unused is its coupon, never a code minted for one sale.
- `grade10-site/store/discounts`: at the till a gift reaches the sale as its
  own line and carries no code, and the till journey names a reward coupon,
  a product coupon or a gift; an online order that expires keeps its code
  and a counter sale that runs out its hour, or that a newer promise retires,
  loses it; a counter sale a reward's code has left takes no reward again, and
  one a newer promise retired takes no new plan; a paid sale carrying a code
  this store deactivated spends the coupon where no other sale claims it, and
  is reported.

## Impact

- **Store backend** (`packages/grade10-store/backend`) — the supersede pass,
  the claim, settlement of a paid sale, the till plan and the reconcile pass
  that ends a counter sale's hour.
- **Loyalty backend** (`packages/loyalty/backend`) — `useCoupon`'s key
  answering only a live claim, `spendCarriedCouponFor` for a coupon a paid
  sale carried, `releaseUnwrittenClaim` for a claim whose order was never
  written, the reversal's refusal, the stale-claim sweep's horizon, and two
  answers the measures read: the standing behind `not_available`, and the
  order whose claim a capture's coupon gave up within a day.
- **Store contracts** (`packages/grade10-store/contracts`) —
  `PosSalePlanResult` names the member's coupon; `PosSalePlanInput` carries the
  order id the cart already names; `CouponRefusalCause` gains
  `held_elsewhere`; the till plan refusal gains `coupon_off_sale` and
  `coupon_held_elsewhere`.
- **POS extension** (`integrations/shopify-pos/grade10`) — the till's
  sentences for both new refusals, `sale_closed`'s sentence naming a new
  sale, and the cart's order id sent with each plan.
- **`@grade10/i18n`** (this store) — `checkout.refusal.held_elsewhere` in
  every locale, and `checkout.refusal.idempotency_conflict` reworded to a
  coupon already used on another order.
- **`@grade10/ui`** (this store) - `CouponList`'s contract wording only: it
  carries a code where the consumer passes one, and a reward coupon carries
  none. No component changes.
- **Consumer apps** — the Grade10 site's cart drawer and `/checkout`, the
  membership wallet, and the POS till.

No domain impact: `grade10-site/store/domain-tcs.md` walks a paid till sale
settling points and its own product coupon, which this change does not move.
It moves sales nobody paid, and paid sales carrying a code their order gave
up. The loyalty domain has one capability and no domain suite.

## References

- [Coupons · Applying one](../../../docs/prds/products/grade10-site/loyalty/coupons.md#applying-one)
- [Coupons · Refusals](../../../docs/prds/products/grade10-site/loyalty/coupons.md#refusals)
- [Coupons · Spending one](../../../docs/prds/products/grade10-site/loyalty/coupons.md#spending-one)
- [Discounts · Online draft order mechanism](../../../docs/prds/products/grade10-site/store/discounts.md#online-draft-order-mechanism)
- [Discounts · Undo](../../../docs/prds/products/grade10-site/store/discounts.md#undo)
- [Rewards · Cancelling a Redemption](../../../docs/prds/products/grade10-site/loyalty/rewards.md#cancelling-a-redemption)
