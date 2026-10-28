---
title: Refunds
spec: grade10-site/store/order-settlement
order: 21
---

A refund is money going back, and everything that rode on it going back with it.
Staff take it in Shopify; the collector's order, their points and their coupons
follow from there.

## Starting a Refund

- **Shopify, Always** — a collector has no action that starts one, and the store
  never refunds on its own

## What the Collector Sees

- **Amount Refunded** — beside what they paid
- **Order Badge** — the one [Order Status](/p/grade10-site/commerce/order-status)
  gives the order
- **Money Back** — what the shop sent, on the card or wallet that paid

## What Comes Back to the Programme

- **Earning** — clawed back for the goods that came back; never for the
  delivery, and never for goods that earned nothing
- **Points Tender** — all the goods back, or none of it
  - **One Discount** — spread across every line the shop sold, so no part of
    the sale carried it alone
  - **Only Stated Goods Count** — so a sale returned as a typed amount holds its
    tender whichever order its parts are rung in
  - **Held Return** — a member the threshold leaves short (everything that
    earned back, a gift card kept) gets the points back from an operator by hand

## Pricing a Return

- **What the Refund Names** — what came back, read against what the order
  earned on
  - **Delivery Only** — moved no goods
  - **Nothing Named** — gets the goods' share of the amount
- **Ceilings** — the money refunded stops at the charge, and the claw-back at
  what the order earned on; money cannot come back that never went out
  - **Goods Totals** — no ceiling of their own: more back than the sale sold is
    a sale edited after it was paid, so the evidence stays in the total and is
    reported rather than clipped
- **Money Back Over Goods Still Held** — always reported: goodwill, an amount
  typed beside a delivery, or a refund that overran a charge recorded too low,
  on any sale, tendered or not

:::callout{kind="note"}
- ❓ **A return the refund names no lines for is priced by share** — an operator's typed amount, a refund the store asked for itself, a sale whose shop named no line handles, one naming a line the sale never settled, or one settled before the record existed. The share prices a return of the fee alone as a fraction of everything the sale sold, so it claws back earning nobody earned. Product confirms
- ❓ **A shop that states no goods split** — measures a tender's return against the whole charge, shipping and tax included, so a return of the goods alone never reaches it. Product confirms
- ❓ **A delivery refunded with money typed beside it** — the shop names the delivery and the refund reads as no goods, so anything typed on top claws back nothing; a refunded delivery states its subtotal and never its tax, so the shortfall cannot be told from the tax. The member keeps the earning either way. Product confirms
- ❓ **A delivery an operator types the amount for** — priced as a share like any typed amount, so it claws back goods that never came back; also why a sale rung as a typed amount and a ticked delivery leaves the goods short of a sale that came back whole. The tender is held either way round; only the earn the share claws back moves with the order the parts are rung in. Product confirms
- ❓ **A physical card coming back** — an operator's move with a record of its own. Product confirms
:::

:::detail{title="How it is counted" for="engineer"}
- **Held tender return** — `store.points_tender.return_held`
- **Priced by share** — `commerce.order.refund_by_share`; ones the share cannot price either way, `commerce.order.refund_estimated`
- **Over a ceiling** — `commerce.order.refund_over_ceiling`; goods totals over the sale are tagged `basis:goods`, whichever arm priced the return; `commerce.order.amount_drift` says the same about the charge
- **No goods split** — tagged `basis:charge` where the counter fires
- **Money back over goods still held** — `commerce.order.charge_closed_short`
- **Typed delivery amount** — unreachable from the payload; its reach is inside `refund_by_share`. A sale rung as a typed amount plus a ticked delivery shows in `charge_closed_short` on both orderings and in `return_held` on one
:::
