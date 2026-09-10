---
title: Refunds
spec: grade10-site/store/order-settlement
order: 21
---

A refund is money going back, and everything that rode on it going back with it.
Staff take it in Shopify; the collector's order, their points and their coupons
follow from there.

- **Where it starts** — Shopify, always. A collector has no action that starts
  one, and the store never refunds on its own
- **What the collector sees** — the order reads Refunded, in full or in part,
  and the amount sits beside what they paid
- **What comes back to them** — the money the shop sent, on the card or wallet
  that paid
- **What comes back to the programme** — points earned on the goods returned,
  and the points tender the return undoes
  1. **Earning** — clawed back for the goods that came back, never for the
     delivery, and never for goods that earned nothing
  2. **The tender** — all the goods back, or none of it. One discount the shop
     spread across every line it sold, so no part of the sale carried it. Only
     goods a refund states count towards it, so a sale returned as a typed
     amount holds its tender whichever order its parts are rung in. A member
     the threshold leaves short — everything that earned back, a gift card
     kept — is counted as `store.points_tender.return_held`, and an operator
     gives the points back by hand
- **What it is priced on** — what the refund names came back, read against what
  the order earned on. A refund naming only the delivery moved no goods; one
  naming nothing at all gets the goods' share of its amount instead, counted as
  `commerce.order.refund_by_share`
- **Money cannot come back that never went out** — the money refunded stops at
  the charge and the claw-back at what the order earned on, and the excess is
  counted (`commerce.order.refund_over_ceiling`). The goods totals carry no
  ceiling of their own: more back than the sale sold is a sale edited after it
  was paid, so the evidence stays in the total and is counted instead of being
  clipped away — tagged `basis:goods`, whichever arm priced the return.
  `commerce.order.amount_drift` says the same about the charge
- **Every penny back over goods still held is reported** — goodwill, an amount
  typed beside a delivery, or a refund that overran a charge recorded too low,
  counted as `commerce.order.charge_closed_short` on any sale, tendered or not

❓ **A return the refund names no lines for is priced by share** — an operator's
typed amount, a refund the store asked for itself, a sale whose shop named no
line handles, one naming a line the sale never settled, or one settled before
the record existed. The share prices a return of the fee alone as a fraction of
everything the sale sold, so it claws back earning nobody earned. Counted as
`commerce.order.refund_by_share`, and the ones the share cannot price either
way as `commerce.order.refund_estimated`.

❓ **A shop that states no goods split** measures a tender's return against the
whole charge, shipping and tax included, so a return of the goods alone never
reaches it. Tagged `basis:charge` where the counter fires.

❓ **A delivery refunded with money typed beside it** — the shop names the
delivery and the refund reads as no goods, so anything typed on top claws back
nothing. Nothing on the wire prices it: a refunded delivery states its subtotal
and never the tax on it, so the shortfall cannot be told from the tax. The
member keeps the earning either way.

❓ **A delivery an operator types the amount for** — the same body as any other
typed amount, so it is priced as a share and claws back goods that never came
back. Unreachable from the payload; the reach is inside
`commerce.order.refund_by_share`. It is also why a sale rung as a typed amount
and a ticked delivery leaves the goods short of a sale that came back whole.
The tender is held either way round; what moves with the order the parts are
rung in is the earn the share claws back, so `commerce.order.charge_closed_short`
reports such a sale on both permutations and `store.points_tender.return_held`
on one.

❓ **A physical card coming back** — an operator's move with a record of its own.
