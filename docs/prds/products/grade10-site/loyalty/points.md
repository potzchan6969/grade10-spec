---
title: Points
spec: grade10-site/loyalty/programme
order: 1
---

A point is $10 of qualifying goods, priced once when a paid order reaches
the programme. Behind every member is an append-only ledger of dated point
lots, and a balance is a query over it — nothing is edited, so nothing can
quietly drift ([[grade10-site-loyalty-programme-SC-03]], [[grade10-site-loyalty-programme-SC-04]], [[grade10-site-loyalty-programme-SC-05]]). A
purchase recorded twice under its own key answers once and records nothing
twice ([[grade10-site-loyalty-programme-SC-10]], [[grade10-site-loyalty-programme-SC-11]]).

## Rules

| Rule | Value |
| --- | --- |
| Currency | **HKD**. A foreign currency is refused |
| Clock | **Asia/Hong_Kong** |
| Base rate | **1 point / $10** (qualifying goods after discounts) |
| Multiplier | **Silver** 1×, **Gold** 1.2×, **Black** 1.7× |
| Rounding | **$139** at **1.2×** = **1.2×13** = **15 points** |
| Timing | **After fulfillment** |

## Qualification criteria

Points are earned from the **net paid amount after any discount, excluding shipping and tax**.

| Item | Earns points |
| --- | --- |
| Products | **Yes** |
| Shipping and tax | **No**, never in the basis |
| Gift cards | **No**, excluded as a product rather than as a tender |
| Credit top-ups | **No**, excluded as a product |
| Grading fees | **No**, excluded as a product |
| Auction wins | **No** today, a later-phase candidate |

## Pricing an order

An order is priced once, when it is paid, and the number written then is the
one every point and every refund is read against.

:::flow{title="From a paid order to points" diagram="assets/diagrams/loyalty-pricing-an-order.svg"}
## *Shop* — **Order paid**
The shop sends the paid order: its lines, their discounts, and the goods total it stated

## *Store* — **Which lines earn**
Line by line: earns points, is left out (a gift card, a fee), or is set aside until the shop says what the line is — [Line verdicts](#detail-line-verdicts)
- **Priced** — every line answered, so the points come from the lines that earn
- **Set aside** — a line the shop has not classified yet holds back the points, never the sale

## *Store* — **Fallback when a line cannot answer**
When a line cannot say whether it earns, tried in this order
1. **Store's own item prices** — the whole-order discount shared across the lines by value
2. **Shop's stated goods total** — only where the shop itemised nothing
3. **Nothing** — the points wait, counted, until a source can classify the sale

## *Store* — **Earning amount fixed on the order**
One amount, written once, never re-priced

## *Loyalty* — **Points worked out**
**$10** a base point, rounded down, then the tier rate, rounded down again — **$139** at **1.2×** = **15**

## *Loyalty* — **Points recorded**
A dated entry in the ledger, never edited, carrying its base points and multiplier
:::

:::detail{title="Line verdicts" for="engineer"}
- **Config** — one programme config, `GRADE10_LOYALTY_PROGRAM` in `packages/app-env`
- **Design records** —
  [loyalty architecture](https://github.com/9gag/grade10/blob/main/docs/architecture/loyalty.md)
  and
  [commerce architecture](https://github.com/9gag/grade10/blob/main/docs/architecture/commerce.md)
:::

## Refunds

A refund takes back the points the refunded goods earned, and never more than
the member still holds from them.

- **Goods only** — the store sends the goods share of a refund, priced the
  way the earn was, so refunding the shipping removes no points
- **Same rate** — money comes back at the rate the credit that earned it
  charged, the last money at the last rate ([[grade10-site-loyalty-programme-SC-42]])
- **Once over the whole** — each refund resumes where the last stopped, so
  two halves take exactly what one refund of the whole takes
  ([[grade10-site-loyalty-programme-SC-35]])
- **Never below zero** — a claw-back takes only what the member still holds
  from that money; the gap is counted, spent points first, expired next
  ([[grade10-site-loyalty-programme-SC-36]])
- **Early refund waits** — a refund that arrives before its earn is refused
  and retried until the earn lands, then claws back once
  ([[grade10-site-loyalty-programme-SC-37]])
- **Tier** — the contribution the points made leaves with them, and the tier
  is judged again at once ([[grade10-site-loyalty-programme-SC-38]]) —
  [Tiers](/p/grade10-site/loyalty/tiers)

:::example{title="Shipping refunded" tier="Gold" shipping="$30"}
- Gengar single $139

| Step | Event | Points | Balance |
| --- | --- | --- | --- |
| Earns | 13 pts × 1.2 | +15 | 15 |
| Refunds | the shipping, $30 | 0 | 15 |

The store sends no goods for shipping, so nothing comes back.
:::

:::example{title="Part of the goods refunded" tier="Gold" shipping="$30"}
- Gengar single $139

| Step | Event | Points | Balance |
| --- | --- | --- | --- |
| Earns | 13 pts × 1.2 | +15 | 15 |
| Refunds | $39 of the single, a price match | −4 | 11 |

39 of the 139 that earned 15, floored.
:::

:::example{title="Whole order refunded" tier="Gold" shipping="$30"}
- Gengar single $139

| Step | Event | Points | Balance |
| --- | --- | --- | --- |
| Earns | 13 pts × 1.2 | +15 | 15 |
| Refunds | the single and the shipping, $169 | −15 | 0 |

The goods share is the whole single, $139, and 15 is all it earned.
:::

:::example{title="Refund in two parts" tier="Gold" shipping="$30"}
- Gengar single $139

| Step | Event | Points | Balance |
| --- | --- | --- | --- |
| Earns | 13 pts × 1.2 | +15 | 15 |
| Refunds | $100 of the single | −10 | 5 |
| Refunds | $39 more, priced from $100 on | −5 | 0 |

Priced apart the two would take 14. Together they take what one refund of
$139 takes.
:::

:::example{title="Refund before the earn" tier="Gold" shipping="$30"}
- Gengar single $139

| Step | Event | Points | Balance |
| --- | --- | --- | --- |
| Refunds | $39 of the single, before the earn has landed | 0 | 0 |
| Earns | the earn lands, 13 pts × 1.2 | +15 | 15 |
| Refunds | the same refund, retried by the store | −4 | 11 |

Loyalty refuses a refund of money it has not priced. The store keeps
retrying, and the retry claws back once.
:::

:::example{title="Points already spent" tier="Gold" shipping="$30"}
- Gengar single $139

| Step | Event | Points | Balance |
| --- | --- | --- | --- |
| Earns | 13 pts × 1.2 | +15 | 15 |
| Redeems | a reward for 12 points | −12 | 3 |
| Refunds | the single and the shipping, $169 | −3 | 0 |

3 is all the member still holds from the order. The missing 12 are counted
as spent, and the balance stays at 0.
:::

:::example{title="Points already expired" tier="Gold" shipping="$30"}
- Gengar single $139

| Step | Event | Points | Balance |
| --- | --- | --- | --- |
| Earns | 13 pts × 1.2 | +15 | 15 |
| Lapses | a year on, nothing bought or redeemed | −15 | 0 |
| Refunds | the single and the shipping, $169 | 0 | 0 |

Nothing is held from the order, so nothing comes back. The missing 15 are
counted as expired.
:::

:::example{title="Gift card returned" tier="Gold"}
- Gengar single $139
- Gift card $500

| Step | Event | Points | Balance |
| --- | --- | --- | --- |
| Earns | 13 pts × 1.2, the single alone | +15 | 15 |
| Refunds | the gift card, $500 | 0 | 15 |

A gift card never earned, so the store sends no goods for it.
:::

:::example{title="Two rates on one order" tier="Silver"}
- PSA 10 Charizard slab $6,000
- Booster box $1,000

| Step | Event | Points | Balance |
| --- | --- | --- | --- |
| Earns | the slab, 600 pts × 1, which crosses the Gold gate | +600 | 600 |
| Earns | the booster box, 100 pts × 1.2 | +120 | 720 |
| Refunds | the booster box, $1,000 | −120 | 600 |

The booster box is the money that earned at 1.2×, so it costs 120 back, not
the 100 the slab's rate would price.
:::

## Expiry

The redeemable balance lapses after twelve months with no activity, and a
lapse that has happened is never undone.

- **Window** — twelve calendar months on the Hong Kong clock: the same day
  and time a year on, 365 or 366 days, never a day count; a 29 February lapses
  on the 28th ([[grade10-site-loyalty-programme-SC-150]])
- **Activity** — a purchase or a redemption, even a spend too small to earn a
  point; each pushes the whole balance's date to twelve months from its own
  day ([[grade10-site-loyalty-programme-SC-94]], [[grade10-site-loyalty-programme-SC-95]], [[grade10-site-loyalty-programme-SC-100]])
- **Not activity** — a campaign grant, a correction, a claw-back, a reversal;
  none moves the date, and the points a grant or a correction adds live out
  their own twelve months ([[grade10-site-loyalty-programme-SC-98]], [[grade10-site-loyalty-programme-SC-99]])
- **Forwards only** — a late record shortens nothing; the date sits where the
  latest activity put it ([[grade10-site-loyalty-programme-SC-101]])
- **Born lapsed** — a record older than a year is written with its date already
  past: on the ledger, counting nothing, moving nothing ([[grade10-site-loyalty-programme-SC-151]])
- **Settled first** — whatever is already dead is written off before the date
  moves, so no extension reaches back ([[grade10-site-loyalty-programme-SC-97]])
- **No sweep needed** — a lot past its date stops counting the instant it is
  read; the nightly sweep only writes the record, and a run cut short
  converges ([[grade10-site-loyalty-programme-SC-96]], [[grade10-site-loyalty-programme-SC-102]])

:::example{title="Buying or redeeming keeps the balance alive"}
| When | Event | Points | Balance |
| --- | --- | --- | --- |
| 3 Jan 2026 | earn → lapses 3 Jan 2027 | +15 | 15 |
| 1 Jun 2026 | earn → lapses 1 Jun 2027 | +10 | 25 |
| 20 Nov 2026 | redeem → lapses 20 Nov 2027 | −5 | 20 |
| 3 Jan 2027 | first earn's own year ends · date stays 20 Nov 2027 | 0 | 20 |
| 20 Nov 2027 | lapse | −20 | 0 |

Every purchase and every redemption moves one date for the whole balance,
so the January points live as long as the November redemption does. The
date after the arrow is when the balance lapses if nothing else happens.
:::

:::example{title="A spend too small to earn still counts"}
| When | Event | Points | Balance |
| --- | --- | --- | --- |
| 3 Jan 2026 | earn → lapses 3 Jan 2027 | +15 | 15 |
| 1 Dec 2026 | $8 order, under a point → lapses 1 Dec 2027 | 0 | 15 |
| 3 Jan 2027 | earn's own year ends · date stays 1 Dec 2027 | 0 | 15 |
| 1 Dec 2027 | lapse | −15 | 0 |

The purchase is activity even when it credits nothing.
:::

:::example{title="Expired points do not come back"}
| When | Event | Points | Balance |
| --- | --- | --- | --- |
| 3 Jan 2026 | earn → lapses 3 Jan 2027 | +15 | 15 |
| 3 Jan 2027 | lapse | −15 | 0 |
| 8 Mar 2027 | earn → lapses 8 Mar 2028 | +15 | 15 |

The new purchase starts a fresh balance. The fifteen that lapsed stay
lapsed.
:::

:::example{title="A grant or a correction is not activity"}
| When | Event | Points | Balance |
| --- | --- | --- | --- |
| 3 Jan 2026 | earn → lapses 3 Jan 2027 | +15 | 15 |
| 1 Jun 2026 | campaign grant · own date 1 Jun 2027 · balance date stays 3 Jan 2027 | +100 | 115 |
| 3 Jan 2027 | lapse, the January earn | −15 | 100 |
| 1 Jun 2027 | lapse, the grant on its own date | −100 | 0 |

A grant moves no date, and neither does an operator correction. Each lives
out its own year under a window that has already passed.
:::

:::example{title="A late record shortens nothing"}
| When | Event | Points | Balance |
| --- | --- | --- | --- |
| 8 Mar 2026 | earn → lapses 8 Mar 2027 | +15 | 15 |
| 10 Apr 2026 | order of 3 Jan, arriving late · date stays 8 Mar 2027 | +12 | 27 |
| 8 Mar 2027 | lapse, both | −27 | 0 |

The date only moves forward. The January order would have put it at 3 Jan
2027, so it moves nothing.
:::

:::example{title="A record older than a year is written already lapsed"}
| When | Event | Points | Balance |
| --- | --- | --- | --- |
| 3 Jan 2026 | earn → lapses 3 Jan 2027 | +15 | 15 |
| 3 Jan 2027 | lapse | −15 | 0 |
| 10 Feb 2027 | order of 1 Jan 2026 · 12 pts written lapsed · date stays 3 Jan 2027 | 0 | 0 |

A record whose own year has run out buys nothing: the points are on the
ledger for the audit, and count nothing.
:::

:::example{title="A leap day lapses on the 28th"}
| When | Event | Points | Balance |
| --- | --- | --- | --- |
| 29 Feb 2028 | earn → lapses 28 Feb 2029 | +15 | 15 |
| 28 Feb 2029 | lapse | −15 | 0 |

The window is calendar months, so a day the next year does not have lands
on the last day of that month.
:::

## Grants by operators

An operator can add points two ways, and the difference is the whole point.
A **campaign grant** — a sign-up promotion, a goodwill gift — credits both
counts, so it can move a member up a tier ([[grade10-site-loyalty-programme-SC-49]]). A
**correction** credits or debits the redeemable balance alone, so fixing a
mistake never promotes anyone ([[grade10-site-loyalty-programme-SC-48]]). Neither keeps the balance
alive. The reason an operator types goes to the audit trail; the ledger
carries only its digest.

## Test cases

::cases{id="grade10-site/loyalty/programme"}

:::detail{title="Delivery and metrics" for="engineer"}
- **Handoff** — the store writes an order event in the transaction that marks
  the order paid and drains it to loyalty; the event id is the idempotency
  key, so a redelivery is free ([[grade10-site-loyalty-programme-SC-39]], [[grade10-site-loyalty-programme-SC-40]],
  [[grade10-site-loyalty-programme-SC-41]]). The retry curve, parking and the backlog gauge are the
  store's: [Commerce](/p/grade10-site/commerce/commerce)
- **Handshake** — a drain checks the programme's currency and earn basis
  against its own before it delivers; a mismatch stops the drain, and a
  refusal is reported, not swallowed ([[grade10-site-loyalty-programme-SC-43]], [[grade10-site-loyalty-programme-SC-44]])
- **Keys** — `earn:<event id>` for a spend, `revoke:<event id>` for a refund,
  the order id for a points capture. Loyalty prefixes the earn key again, so
  stored keys read `earn:earn:<id>`; that is kept on purpose
- **Metrics** — `loyalty.points.earned`, `.expired`, `.dead_on_arrival` on its
  own series, `loyalty.clawback.shortfall` by cause;
  `commerce.order_event.undelivered` and `.stuck` on the store side
:::
