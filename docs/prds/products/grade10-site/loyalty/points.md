---
title: Points
spec: grade10-site/loyalty/programme
order: 1
reviewed: 2026-09-16
---

## Rules

| Rule | Value |
| --- | --- |
| Currency | **HKD**. A foreign currency is refused |
| Clock | **Asia/Hong_Kong** |
| Base rate | **1 point / $10** (qualifying goods after discounts) |
| Multiplier | **Silver** 1×, **Gold** 1.2×, **Black** 1.7× |
| Rounding | **$139** at **1.2×** = **1.2×13** = **15 points** |
| Timing | **When the order is paid** |

## Qualification Criteria

Points are earned from the **net paid amount after any discount or coupon,
excluding shipping and tax**, so a redemption never earns back part of what it
spent. A whole-order discount is shared across the lines by value, so it cannot
land on the part of a basket that earns nothing.

| Item | Earns points |
| --- | --- |
| Products | **Yes** |
| Shipping and tax | **No**, never in the basis |
| Gift cards | **No**, excluded as a product rather than as a tender |
| Credit top-ups | **No**, excluded as a product rather than as a tender |
| Grading fees | **No**, excluded as a product |
| Auction wins | **No** today, a later-phase candidate |

A fully discounted order earns nothing and writes no ledger entry.

## Backend Flow

An order is priced once, when it is paid, and the number written then is the
one every point and every refund is read against. The earn is delivered by
retry until the programme takes it, and taken once, so a purchase during an
outage still earns, and never twice.

:::flow{title="From a paid order to points" case="Normal" diagram="assets/diagrams/loyalty-pricing-an-order.svg"}
## *Shop* — **Order paid**
The shop sends the paid order: its lines, their discounts, and the goods total it stated

```json
{
  "line_items": [
    { "title": "Charizard VMAX", "quantity": 1, "price": "199.00" },
    { "title": "Booster Pack", "quantity": 2, "price": "45.00",
      "discount_allocations": [{ "amount": "10.00" }] }
  ],
  "current_total_discounts": "10.00",
  "subtotal_price": "279.00"
}
```

`subtotal_price` is the goods total after discounts, before shipping and tax — the webhook flags a gift card outright, but a grading fee or a top-up looks like real goods until the read answers

## *Store* — **Asks Shopify**
The webhook already flags a gift card, but a grading fee, a top-up, and real goods all look the same to it — only a read of each line's product type and tags can tell them apart

```json
{
  "productType": "Trading Card",
  "tags": ["pokemon", "singles"]
}
```

The read for the Charizard VMAX line — a real product, so the order prices as usual

## *Store* — **Order recorded**
The lines judged by that read, a gift card, a fee, a grading service left out, and the earning amount written on the order once, never re-priced — [Code map](#detail-code-map)

## *Loyalty* — **Points granted**
Reached by an order event, not by the sale waiting: **$10** a base point, rounded down, then the tier rate, rounded down again — **$139** at **1.2×** = **15** — as a dated entry, never edited
:::

:::flow{title="From a paid order to points" case="A line the shop cannot classify" diagram="assets/diagrams/loyalty-pricing-unclassified.svg"}
## *Shop* — **Order paid**
A line names a product, but nothing here says its type or tags yet — only the read can tell real goods from a fee or a top-up

```json
{
  "line_items": [
    { "title": "Mystery Booster Box", "quantity": 1, "price": "89.00" }
  ],
  "subtotal_price": "89.00"
}
```

## *Store* — **Asks Shopify**
A read back is what would answer for the line — the webhook alone never says what it is

```json
{
  "productType": null,
  "tags": null
}
```

The product behind the Mystery Booster Box line was deleted from Shopify since the sale — the read answers with nothing, so there's nothing to judge it by

## *Store* — **Order recorded**
A read that answers prices the order as usual; a read that fails writes no earning amount, and the sale still stands

## *Loyalty* — **Points granted**
No amount, so no order event and no points — counted, and granted when a retry classifies the sale
:::

:::flow{title="From a paid order to points" case="A total with no lines" diagram="assets/diagrams/loyalty-pricing-unitemised.svg"}
## *Shop* — **Order paid**
One goods total and no lines at all

```json
{
  "line_items": [],
  "subtotal_price": "312.00"
}
```

## *Store* — **Order recorded**
The store's own item prices, the whole-order discount shared across them by value; the shop's stated goods total only where the store has no prices of its own

## *Loyalty* — **Points granted**
As usual, on the amount the order carries
:::

:::flow{title="From a paid order to points" case="A custom sale" diagram="assets/diagrams/loyalty-pricing-custom-sale.svg"}
## *Shop* — **Order paid**
A line rung at the till names no catalog product — a consignment, a repair, a price override

```json
{
  "line_items": [
    { "title": "Repair — screen replacement", "variant_id": null, "quantity": 1, "price": "80.00" }
  ],
  "subtotal_price": "80.00"
}
```

## *Store* — **Order recorded**
Nothing can ever classify that line, so it is left out and the rest of the order is priced; waiting would hold the sale for a fact that is never coming

## *Loyalty* — **Points granted**
As usual, on the lines that earn; the custom line earns nothing
:::

### When a line cannot be priced

The shop says what a line is, and can pay an order before it has said
everything — the case picker on the flow walks each way that happens. A line
whose tax-free money the shop never states lands there too. What prices the
order then, in order:

1. **Store's own item prices** — the whole-order discount shared across the lines by value
2. **Shop's stated goods total** — only where the shop sent no lines; the total still holds a line the rule threw out, so an unanswered line never falls here
3. **Nothing** — the points wait, counted, until a source can classify the sale

:::detail{title="Code map" for="engineer"}
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
  charged, the last money at the last rate
- **Once over the whole** — each refund resumes where the last stopped, so
  two halves take exactly what one refund of the whole takes
- **Never below zero** — a claw-back takes only what the member still holds
  from that money; the gap is counted, spent points first, expired next
- **Early refund waits** — a refund that arrives before its earn is refused
  and retried until the earn lands, then claws back once
- **Tier** — the contribution the points made leaves with them, and the tier
  is judged again at once — [Tiers](/p/grade10-site/loyalty/tiers)

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

Every point a member holds lapses on the same day, whatever recorded it.

| What happens | The date |
| --- | --- |
| A purchase or a redemption, even one too small to earn a point | Twelve months from that day |
| A grant, a correction or a reversal | Unchanged; those points take the date the balance already has |
| Operator points with nothing live to join | Twelve months from the day they land |
| An operator restarts the window | Twelve months from today — [Operator Console](/p/grade10-site/loyalty/operator-console) |
| A record older than the window | Unchanged; those points are written already lapsed |
| The day arrives | Gone; the whole balance is written off, and never revived |

- **Window** — twelve calendar months on the Hong Kong clock: the same day
  and time a year on, 365 or 366 days, never a day count; a 29 February lapses
  on the 28th
- **Forwards only** — a late record shortens nothing; the date sits where the
  latest activity put it
- **Settled first** — whatever is already dead is written off before the date
  moves, so no date reaches back over a lapse
- 🚧 **A warning is owed** — the programme records which members are close to
  losing points; nothing tells them yet —
  [Expiry Reminders](/p/grade10-site/loyalty/expiry-reminders)
- **Dead at once** — points past the date stop counting the instant they are
  read, with nothing waiting on a nightly pass

:::example{title="Buying or redeeming keeps the balance alive"}
| When | Event | Points | Balance |
| --- | --- | --- | --- |
| 2026/01/03 | earn → lapses 2027/01/03 | +15 | 15 |
| 2026/06/01 | earn → lapses 2027/06/01 | +10 | 25 |
| 2026/11/20 | redeem → lapses 2027/11/20 | −5 | 20 |
| 2027/01/03 | first earn's own year ends · date stays 2027/11/20 | 0 | 20 |
| 2027/11/20 | lapse | −20 | 0 |

Every purchase and every redemption moves one date for the whole balance,
so the January points live as long as the November redemption does. The
date after the arrow is when the balance lapses if nothing else happens.
:::

:::example{title="A spend too small to earn still counts"}
| When | Event | Points | Balance |
| --- | --- | --- | --- |
| 2026/01/03 | earn → lapses 2027/01/03 | +15 | 15 |
| 2026/12/01 | $8 order, under a point → lapses 2027/12/01 | 0 | 15 |
| 2027/01/03 | earn's own year ends · date stays 2027/12/01 | 0 | 15 |
| 2027/12/01 | lapse | −15 | 0 |

The purchase is activity even when it credits nothing.
:::

:::example{title="Expired points do not come back"}
| When | Event | Points | Balance |
| --- | --- | --- | --- |
| 2026/01/03 | earn → lapses 2027/01/03 | +15 | 15 |
| 2027/01/03 | lapse | −15 | 0 |
| 2027/03/08 | earn → lapses 2028/03/08 | +15 | 15 |

The new purchase starts a fresh balance. The fifteen that lapsed stay
lapsed.
:::

:::example{title="A grant takes the balance's date"}
| When | Event | Points | Balance |
| --- | --- | --- | --- |
| 2026/01/03 | earn → lapses 2027/01/03 | +15 | 15 |
| 2026/06/01 | campaign grant · takes 2027/01/03 · date stays | +100 | 115 |
| 2027/01/03 | lapse, all of it | −115 | 0 |

A grant moves no date, and neither does an operator correction. Both take the
date the balance already has, so the member reads one day for everything.
:::

:::example{title="A grant to an empty balance starts the date"}
| When | Event | Points | Balance |
| --- | --- | --- | --- |
| 2026/01/03 | earn → lapses 2027/01/03 | +15 | 15 |
| 2027/01/03 | lapse | −15 | 0 |
| 2027/03/08 | goodwill grant → lapses 2028/03/08 | +50 | 50 |

Nothing was left to join, so the grant names the date itself.
:::

:::example{title="An operator restarts the window"}
| When | Event | Points | Balance |
| --- | --- | --- | --- |
| 2026/01/03 | earn → lapses 2027/01/03 | +15 | 15 |
| 2026/06/01 | campaign grant · takes 2027/01/03 | +100 | 115 |
| 2026/06/01 | operator restarts the window → lapses 2027/06/01 | 0 | 115 |
| 2027/06/01 | lapse, all of it | −115 | 0 |

The restart moves the whole balance, the grant and the earn alike. Nothing
else moves the date without the member buying or redeeming.
:::

:::example{title="A late record shortens nothing"}
| When | Event | Points | Balance |
| --- | --- | --- | --- |
| 2026/03/08 | earn → lapses 2027/03/08 | +15 | 15 |
| 2026/04/10 | order of 3 Jan, arriving late · date stays 2027/03/08 | +12 | 27 |
| 2027/03/08 | lapse, both | −27 | 0 |

The date only moves forward. The January order would have put it at 3 Jan
2027, so it moves nothing.
:::

:::example{title="A record older than a year is written already lapsed"}
| When | Event | Points | Balance |
| --- | --- | --- | --- |
| 2026/01/03 | earn → lapses 2027/01/03 | +15 | 15 |
| 2027/01/03 | lapse | −15 | 0 |
| 2027/02/10 | order of 2026/01/01 · 12 pts written lapsed · date stays 2027/01/03 | 0 | 0 |

A record whose own year has run out buys nothing: the points are on the
ledger for the audit, and count nothing.
:::

:::example{title="A leap day lapses on the 28th"}
| When | Event | Points | Balance |
| --- | --- | --- | --- |
| 2028/02/29 | earn → lapses 2029/02/28 | +15 | 15 |
| 2029/02/28 | lapse | −15 | 0 |

The window is calendar months, so a day the next year does not have lands
on the last day of that month.
:::

:::detail{title="Product decisions" for="pm"}
A member holds one balance and reads one day for it: every point they hold
lapses together, whatever recorded it. Measured by the share of members who
spend rather than lose a balance that was about to lapse.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| What a grant's points live for | Decided | They take the date the balance already has, and push it no further. | Product |
| A balance with nothing live | Decided | Operator points start the date, twelve months out. | Product |
| Points that should outlive the balance | Decided | An operator restarts the window instead, on the record. | Product |
| How long a restart runs | Decided | Twelve months from today, never a day the operator picks. | Product |
| Dates members have already been shown | Decided | Every member's date moves up to the longest-lived point they hold, so no date moves back. | Product |
| What moving those dates costs | Decided | Nothing; the move ran on staging alone, which holds play data. A production database starts under the one date. | Finance |
| Warning a member before the day | ❓ Open | Which channel tells them, and how far ahead; who is owed one is recorded — [Expiry Reminders](/p/grade10-site/loyalty/expiry-reminders). | Product |
:::
