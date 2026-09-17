---
title: Bid Increments
spec: grade10-site/auction/bid-increments
order: 22
---

## Values

| Rule | Value |
| --- | --- |
| Currencies | **USD**, **HKD** or **JPY**, one per lot; nothing else prices an auction |
| Schedule | One Grade10-owned price schedule per currency; operators choose the currency and never edit the schedule |
| Tiers | A tier includes its lower bound; the last tier has no upper bound |
| Amounts | Any whole amount at or above the next minimum, never a required multiple |
| Ceiling | **USD 10,000,000**, **HKD 80,000,000**, **JPY 150,000,000,000** — the same on every lot |
| What a collector sees | The next minimum for the lot, not the schedule |

## Schedules

The increment is selected by the amount being beaten.

| Currency | Price from | Increment |
| --- | ---: | ---: |
| USD | $0 | $1 |
| USD | $100 | $5 |
| USD | $500 | $10 |
| USD | $1,000 | $25 |
| USD | $5,000 | $50 |
| USD | $10,000 | $100 |
| HKD | HK$0 | HK$10 |
| HKD | HK$800 | HK$40 |
| HKD | HK$4,000 | HK$80 |
| HKD | HK$8,000 | HK$200 |
| HKD | HK$40,000 | HK$400 |
| HKD | HK$80,000 | HK$800 |
| JPY | ¥0 | ¥100 |
| JPY | ¥15,000 | ¥500 |
| JPY | ¥75,000 | ¥1,000 |
| JPY | ¥150,000 | ¥4,000 |
| JPY | ¥750,000 | ¥8,000 |
| JPY | ¥1,500,000 | ¥15,000 |

## The Next Minimum

- **First bid** — the starting price plus the increment its tier selects; the
  price a first maximum creates is the starting price itself —
  [Auto-Bidding](/p/grade10-site/auction/auto-bidding)
- **After a bid** — the current price plus the increment its tier selects
- **Between two maxima** — settled once from the second-highest maximum, never
  through intermediate bids — [Auto-Bidding](/p/grade10-site/auction/auto-bidding)
- **Any whole amount above** — accepted as offered; nothing rounds it to a
  multiple

| Lot | Amount being beaten | Increment | Next minimum | Outcome |
| --- | ---: | ---: | ---: | --- |
| HKD lot opens | HK$200 starting price | HK$10 | HK$210 | The first bid must reach HK$210 |
| USD lot on a tier boundary | $100 | $5 | $105 | The $100 tier is selected, not the $0 tier |
| A bidder offers more | $100 | $5 | $105 | $120 is accepted as $120; no bid at $105 is created |
| A bidder offers less | $100 | $5 | $105 | $104 is refused and $105 is named |
| HKD lot climbs | HK$8,000 | HK$200 | HK$8,200 | The minimum is HK$8,200 |
| USD lot at the ceiling | $10,000,000 | — | Above the ceiling | Every further bid is refused |

## Refusals

| Refused when | What happens |
| --- | --- |
| Below the next minimum | Refused, naming the minimum |
| A bid or a maximum above the ceiling | Refused, naming the ceiling; the price, the leader and every maximum stay as they were, and a refused maximum records nothing |
| The lot is at the ceiling | A bid at the ceiling is accepted; once the next minimum would pass it, every further bid is refused |
| A listing in another currency | Refused before the listing is scheduled; the draft stays as it was |

::cases{id="grade10-site/auction/bid-increments"}

:::detail{title="Product decisions" for="pm"}
The auction starts with a price that invites participation and increases in
steps that stay proportionate as competition grows. A shared schedule keeps
that promise consistent across the admin listing form, manual bids, proxy
resolution, and collector quick bids.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Collector | Opening or following a competitive lot | Sees a sensible next minimum and can enter a larger whole amount. |
| Auction operator | Creating a listing | Chooses a supported currency without predicting its closing price. |
| Product | Comparing lots across currencies | Applies one stable policy per supported currency. |

**Not in scope.** Operator editing of schedules, currencies beyond USD, HKD,
and JPY, exact multiples of an increment, a per-lot ceiling, historical bid rewrites, and a
collector-facing policy ladder.

**Measurement.**

| Signal | Definition | Owner |
| --- | --- | --- |
| High-value bids per lot | Bids per lot that closes above ten times its starting price. | Product |
| Slow high-value lots | Share of those lots that stall for more than an hour below the eventual close. | Product |

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Schedule ownership | Decided | Grade10 owns one fixed schedule for USD, HKD, and JPY. | Product |
| Tier boundary | Decided | A threshold includes its lower bound and the last tier has no upper bound. | Product |
| Flexible amounts | Decided | A bid may exceed the calculated minimum and need not be an exact multiple. | Product |
| Operator override | Decided | No listing-level minimum-increment field or policy editor. | Product |
| Collector display | Decided | Show the next minimum, not the full schedule. | Product |
| Bid ceiling | Decided | One ceiling per currency for every lot, refused above it: USD 10,000,000, HKD 80,000,000, JPY 150,000,000,000. | Product |
| Proxy resolution | Decided | Use one resulting price from the second-highest maximum; never create intermediate bids. | Product |
:::
