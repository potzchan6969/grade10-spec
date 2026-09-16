---
title: Paying with Points
spec: grade10-site/loyalty/programme
order: 4
reviewed: 2026-09-15
---

## Rules

| Rule | Value |
| --- | --- |
| Currency | **HKD** |
| Rate | **1 point pays $1** — earning is $10 a point, on [Points](/p/grade10-site/loyalty/points) |
| Pays for | **Qualifying goods only** — the same basis as earning: never gift cards, credit top-ups, or grading fees |
| Never pays for | **Shipping or tax** |
| Cap | **Goods total minus coupons and discount codes** — points come after both, so they pay only what is left; a bigger ask is trimmed to fit, not refused |
| Earns | **Nothing** — the part of the bill paid with points earns no points |
| Available | **On**, online and at the till — a manager can turn off the till's points spending, or just typed-email spending, within seconds; a sale never waits on it |
| Discount | **One order-level "Points" discount**, outside the order's one-coupon count, so a coupon and points can be used on the same order — [Discounts](/p/grade10-site/store/discounts) |

## Online

- **Chosen** — in the cart drawer or on `/checkout`, before Shopify's
  checkout; the member types how many points and sees the ceiling after the
  promo code's cut, and an ask past it is trimmed —
  [Cart Drawer](/p/grade10-site/store/cart)
- **Promised** — the order is recorded with that number, and the Shopify
  draft order carries it as one fixed-amount discount named "Points"; nothing
  is deducted and nothing is held
- **Paid** — in Shopify's checkout
- **Debited** — when the paid order lands, once, keyed on the order id; an
  abandoned or cancelled checkout is never debited
- **Scaled only when something went wrong** — where the shop applied less
  than promised, or the balance fell below it meanwhile, the debit is the
  smaller figure and the shortfall is logged and alerted

The systems' steps, with the draft order and the webhook, are on
[Shopify Integration](/p/grade10-site/loyalty/shopify-integration#online-checkout).

:::example{title="Paying at checkout"}
- Order $300

| Step | Event | Points | Balance |
| --- | --- | --- | --- |
| Checkout | 100 points promised, before payment | | 500 |
| Debits | order paid, the whole discount applied | −100 | 400 |

Nothing moves until the order is paid.
:::

:::example{title="Checkout abandoned"}
- Order $300

| Step | Event | Points | Balance |
| --- | --- | --- | --- |
| Checkout | 100 points promised, before payment | | 500 |
| Abandons | the checkout is left unpaid | 0 | 500 |

An order never paid was never debited.
:::

:::example{title="Shop applies less than promised"}
- Order $300

| Step | Event | Points | Balance |
| --- | --- | --- | --- |
| Checkout | 100 points promised, before payment | | 500 |
| Debits | order paid, the shop applied only $60 of the discount | −60 | 440 |

The debit follows what the shop applied, not what was promised.
:::

## At the Till

- **Rung up** — the shopkeeper rings the products up in Shopify POS
- **Identified** — the shopkeeper opens the Grade10 extension and scans the
  member card's QR, from the site or a wallet pass, or types the 8-letter
  short code, the email, or picks the customer already on the cart
- **Applied** — the shopkeeper chooses points and/or coupons and taps Apply;
  the extension writes the store's order id on the cart, takes the "Points"
  amount off the sale, and shows the points spent, the money still due and
  the balance after; no code is minted for the points, and a repeated tap
  spends once
- **Beside the shop's offer** — points go on beside an automatic offer,
  capped at what the offers leave of the goods; a staff order discount on
  the sale refuses the spend until staff take it off
- **Paid** — the shopkeeper takes payment
- **Debited** — when the paid sale lands, the same way as online; clearing
  the discounts before payment undoes the promise, and nothing was debited
- **Reversed only by the console** — once a spend is paid, an operator
  undoes it from the loyalty admin; the till itself never reverses one

The session, the switches and the cart are on
[Shopify Integration](/p/grade10-site/loyalty/shopify-integration#pos-extension).

## Refunds

- **Cancelled before paid** — nothing was debited, so nothing comes back
- **Whole goods, or nothing** — a refund returns the points paid only when
  the goods it states reach the whole of the order's goods; a part refund
  returns nothing, because the points discount is spread across every line
  the shop sold and no line can be shown to carry it
- **A kept exclusion holds it back** — a member who returns every
  qualifying good but keeps a gift card or a fee the same payment covered
  gets nothing back automatically; an operator returns it by hand from the
  loyalty admin, and a spend can be returned only once
- **No extra life** — returned points lapse with the rest of the balance,
  so a return never lengthens the life of points
- **Points earned** — clawed back separately, line by line —
  [Points](/p/grade10-site/loyalty/points)

:::example{title="Whole order refunded"}
- Order $300

| Step | Event | Points | Balance |
| --- | --- | --- | --- |
| Checkout | 100 points promised, before payment | | 500 |
| Debits | order paid, the whole discount applied | −100 | 400 |
| Refunds | every qualifying good in the order | +100 | 500 |

The whole of the order's goods came back, so the points paid come back too.
:::

:::example{title="Part of the order refunded"}
- Order $300

| Step | Event | Points | Balance |
| --- | --- | --- | --- |
| Checkout | 100 points promised, before payment | | 500 |
| Debits | order paid, the whole discount applied | −100 | 400 |
| Refunds | $100 of the order, a part refund | 0 | 400 |

A part refund returns nothing, however much of the goods it names.
:::

:::detail{title="Code map" for="engineer"}
- **Store** — `packages/grade10-store/backend/src/services/pointsTender.ts`,
  `services/loyalty/pointsSpend.ts`, `services/loyalty/sink.ts`
- **Loyalty** — `packages/loyalty/backend/src/services/ledger/payment.ts`
- **POS extension** — `integrations/shopify-pos/grade10`
- **Design record** —
  [loyalty architecture](https://github.com/9gag/grade10/blob/main/docs/architecture/loyalty.md)
:::
