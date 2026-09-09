---
title: Paying with Points
spec: grade10-site/loyalty/programme
order: 4
---

Points settle straight against a bill, with no reward in between and nothing
to hold afterwards.

## Rules

| Rule | Value |
| --- | --- |
| Rate | **1 point pays HKD 1** |
| Pays for | Qualifying goods, the same basis points are earned on |
| Never pays for | Shipping or tax |
| Earns | Nothing — the part of the bill points paid earns no points back |
| Stacking | Outside the order's one discount, so a coupon can pay the rest — [Discounts](/p/grade10-site/store/discounts) |

## Online

- **Chosen at checkout** — the member says how much of the bill to pay in
  points
- **Debited when the invoice is paid** — never when it is chosen, so an
  abandoned checkout costs nothing
- **Scaled to what the shop took off** — the debit follows the amount actually
  applied, not the amount asked for

## At the till

Staff spend an exact amount on the member's behalf, against the member card
they scanned. No code is minted for that spend.

How each channel carries it is on
[Shopify Integration](/p/grade10-site/loyalty/shopify-integration).

## Refunds

Unlike a coupon, these points come back. What was paid against a bill is
returned when the sale it paid for comes back whole — a cancelled order, or a
refund of every qualifying good.

- **The whole sale, or nothing** — a part refund returns none. The payment is
  one discount spread across every line the shop sold, so no line can be shown
  to have carried it, and giving back a share of it would mint points
- **A kept exclusion holds it back** — a member who returns every qualifying
  good but keeps a gift card or a fee the same payment covered gets nothing
  back, and an operator settles it by hand

Points the order **earned** are clawed back the ordinary way, line by line —
[Points](/p/grade10-site/loyalty/points).

:::callout{kind="warning"}
The durable spec has no notion of paying with points: a redemption there is an
entitlement with no settlement. Everything on this page is specified in the
in-flight `revise-loyalty-programme-rules` and `add-shopify-membership-pos`
changes.
:::

:::detail{title="Ledger shape" for="engineer"}
Paying with points is its own ledger kind, `pay`, with `capture` for the
settlement debit and a keyed return; nothing is ever reserved — a `point_holds`
table was added and dropped again. Returning a captured spend sits behind
`loyalty:adjust` with the operator's other moves. Metric:
`loyalty.points.redeemed`.
:::
