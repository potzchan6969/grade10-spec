## Goals

- Let an operator create a listing with a starting price of 0
- Keep the first-bid minimum rule as it is

## Non-Goals

- Reserve prices
- A first bid of 0, or of one minor unit
- Changing the price-tier increments
- Changing how the collector's page shows a starting price

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | With a 0 start, what is the lowest first bid? | 0 plus the currency's lowest increment — today's rule, unchanged (author's choice) | Any bid from 0; one minor unit — rejected: both change the bidding rules |
| Q2 | Which currencies allow a 0 start? | USD, HKD and JPY (author's choice) | Only some currencies |
| Q3 | Are negative or non-whole amounts still refused? | Yes (decided by the round) | Accept any amount — rejected: out of scope |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
