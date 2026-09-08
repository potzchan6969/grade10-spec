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
     spread across every line it sold, so no part of the sale carried it. The
     goods decide and the money never does: money closes on goodwill, on an
     amount typed beside a delivery, and on a refund that overran a charge
     recorded too low, and reading any of those as the whole sale hands points
     back on goods the member still holds. A member the threshold leaves short
     — everything that earned back with a gift card kept, or every penny back
     with the goods still short — is counted as
     `store.points_tender.return_held`, and an operator gives the points back
     by hand
- **What it is priced on** — what the refund names came back, read against what
  the order earned on. A refund naming only the delivery moved no goods; one
  naming nothing at all gets the goods' share of its amount instead, counted as
  `commerce.order.refund_by_share`
- **Money cannot come back that never went out** — the money refunded stops at
  the charge and the claw-back at what the order earned on, and the excess is
  said out loud. The goods total the tender is measured against carries no
  ceiling of its own: more back than the order sold is a sale edited after it
  was paid, and it is the only signal that says so

❓ **A mixed sale's return is priced by share, not by line** — an order that sold
a gift card or a grading fee beside graded cards prices a return as a fraction
of both, so a return of the fee alone claws back earning nobody earned. Counted
as `commerce.order.refund_estimated` so the population is findable. Pricing a
refund against the lines the order earned on is what retires it.

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
and a ticked delivery leaves the goods short of a sale that came back whole,
and why which part lands last changes the answer — the return is reported,
never estimated into a tender.

❓ **A physical card coming back** — an operator's move with a record of its own.
`TBC`
