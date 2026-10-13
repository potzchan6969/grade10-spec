## Goals

- Show auction prices in USD on every collector-facing auction surface.
- Make USD the only base currency for an item price and a bid.
- Settle an order in USD, with card, Hong Kong local bank transfer and SWIFT.

## Non-Goals

- HKD settlement and the winner's choice of currency - [`add-hkd-settlement`](../add-hkd-settlement/decisions.md).
- A display in any other currency; if one comes, it converts from USD and is its own change.
- ❓ Whether HKD and JPY lot schedules are retired or kept for lots already live in those currencies - pending PM.
- ❓ The verified-bidder bar restated in USD (today HKD 120,000) - pending PM.
- Changes to `shared/money-amounts` or `shared/ui/auction-listing` contracts.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | How do lots price? | USD alone, for an item price and a bid; collectors see `US$` | A display conversion over a non-USD lot currency |
| Q2 | What does a first order settle in? | USD, with card, Hong Kong local bank transfer and SWIFT | A fixed HKD order |
| Q3 | What happens to JPY in Payment Settings? | It stays, dormant; USD and HKD are the active entries | Removing the row |
| Q4 | ❓ HKD/JPY schedules? | Pending PM - retire, or keep for live lots | - |
| Q5 | ❓ Verified-bidder bar in USD? | Pending PM (today HKD 120,000) | - |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
