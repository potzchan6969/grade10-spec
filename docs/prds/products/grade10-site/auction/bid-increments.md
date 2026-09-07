---
title: Bid Increments
spec: grade10-site/auction/bid-increments
order: 6
---

Every auction currency has one Grade10-owned price schedule. A collector sees
the next minimum for the lot, not the policy table, and can enter any whole
amount at or above that minimum.

## Schedules

The schedule selects the increment from the amount being beaten. Each threshold
includes its lower bound, and amounts are integer minor units.

| Currency | Price from | Increment |
| --- | ---: | ---: |
| USD | 0 | 100 |
| USD | 10000 | 500 |
| USD | 50000 | 1000 |
| USD | 100000 | 2500 |
| USD | 500000 | 5000 |
| USD | 1000000 | 10000 |
| HKD | 0 | 1000 |
| HKD | 80000 | 4000 |
| HKD | 400000 | 8000 |
| HKD | 800000 | 20000 |
| HKD | 4000000 | 40000 |
| HKD | 8000000 | 80000 |
| JPY | 0 | 100 |
| JPY | 15000 | 500 |
| JPY | 75000 | 1000 |
| JPY | 150000 | 4000 |
| JPY | 750000 | 8000 |
| JPY | 1500000 | 15000 |

## Bid pricing

- **Opening bid:** starting price plus the increment selected for that price.
- **Manual bid:** current public price plus the increment selected for that price.
- **Proxy bid:** second-highest maximum plus its selected increment, capped at the leader's maximum.
- **Offer amount:** any whole amount at or above the resulting minimum; intermediate bids are not created.

## Currency and ownership

Only USD, HKD, and JPY can price an auction. Operators select the currency but
do not edit the schedule, and unsupported currencies are refused before a
listing is scheduled.

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
and JPY, exact multiples of an increment, historical bid rewrites, and a
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
| Proxy resolution | Decided | Use one resulting price from the second-highest maximum; never create intermediate bids. | Product |
:::
