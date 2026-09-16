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
  the store gives back every claim its own orders hold on it — the cut comes
  off, the code minted for it is deactivated, and an online draft is cancelled.
  No draft and no counter sale locks a coupon the member wants to spend
  somewhere else.
- **A counter sale keeps its cart and loses its cut.** The shop owns that cart
  and it can still collect, so the sale is never cancelled; only the coupon
  leaves it.
- **The one refusal left is an outage.** A sale that has already taken money, a
  checkout the provider will not kill, a code the shop will not deactivate —
  the member is told an earlier code stands, not that their coupon is
  unavailable.
- **A sale that collects a code this store killed is reported.** Today nothing
  looks: a reward's code is the only one that never reaches the mint register,
  so no reader corroborates it against what the sale carried.
- **The member is shown no claimed state.** The wallet, the cart drawer and the
  till panel all read every coupon the member holds as spendable.
- **The stale-claim sweep stops freeing a coupon whose code is still live.** It
  runs on the same clock as the code it is meant to outlast, and the code is
  minted after the claim — so today it manufactures the double discount it
  exists to prevent.
- **An operator's reversal is still refused while a sale claims the coupon**,
  and stops being refused once that sale's code can no longer be collected.

## Non-Goals

- **Stopping a counter cart that already carries the code from collecting.**
  The shop honours what it applied, whatever becomes of the code. What this
  change owes is to notice and say so with the order on it.
- **Moving the claim out of `coupon_instances`.** The guarded write on that row
  is what serialises a claim against a reversal and an erasure. No schema
  changes.
- **The POS extension learning it live.** Staff see the cut leave on the sale's
  next plan, which now names the member's coupon; a live push is its own
  change.

## References

- [Coupons · Applying one](../../../docs/prds/products/grade10-site/loyalty/coupons.md#applying-one)
- [Coupons · Refusals](../../../docs/prds/products/grade10-site/loyalty/coupons.md#refusals)
- [Coupons · Spending one](../../../docs/prds/products/grade10-site/loyalty/coupons.md#spending-one)
- [Discounts · Online draft order mechanism](../../../docs/prds/products/grade10-site/store/discounts.md#online-draft-order-mechanism)
