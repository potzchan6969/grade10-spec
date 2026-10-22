# grade10-site/auction/bid-increments Specification

## Purpose

Makes the next auction bid proportionate to the price being beaten, using one
Grade10-owned USD schedule for every auction. The schedule's values are
configuration; this capability holds the rule that reads them.

## Feature set

- Currency schedules
  - Configured schedule: the USD tiers are configuration, one for every auction, and no requirement states a tier amount
  - Schedule shape: lower-inclusive tiers, the last tier unbounded, a $1 floor tier from $0
  - A change takes effect on the next bid: open lots included, standing bids untouched
- Minimum bid
  - One lookup rule: manual and proxy bidding select the tier from the amount being beaten, read from the configured schedule
  - Opening price: before any bid, the minimum is the starting price, or the lowest configured increment on a 0 start
