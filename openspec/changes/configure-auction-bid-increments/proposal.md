**Author:** @htonyl - 2026-10-22

## Why

Collectors who bid on both Grade10 and Goldin meet two sets of steps. A $1,000
lot moves by $25 here and by $100 there, so a bid sized for one site is
refused or overpays on the other. The schedule is also written into the
requirement itself, so retuning one step is a spec change, a delta and an
acceptance. The measure is the number of increment retunes that need a spec
change: today every one does, and after this change none does.

## What Changes

- The increments follow Goldin's published schedule, which is finer at low prices
  and coarser at high ones: $2 from $10, $25 from $200, $100 from $1,000,
  $1,000 from $10,000, and $100,000 from $1,500,000. Below $10 stays $1.
- The schedule is configuration. The requirement states the rule alone:
  lower-inclusive tiers, the tier chosen from the amount being beaten, the last
  tier unbounded. It carries no increment value.
- A change to the configured values reaches the next bid on every lot, open
  lots included. A bid already standing keeps its amount.
- The manual shows the values in force, so a reader sees the latest
  configuration without reading code.
- **BREAKING** The minimum next bid moves on every open lot whose price sits
  above $10, on deploy. Bidders who planned an amount on the old steps see a
  new minimum.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/bid-increments`: the schedule table leaves the
  requirement, which states the rule over a configured schedule

## Impact

- **Manual** - Bidding shows the new values and marks the configured schedule.
- **Code** - the auction contracts package holds the schedule today, and the
  backend, the collector site and the demo read it from there.
  `tech-design.md` settles where the configuration lives and how the manual
  reads it.
- **Tests** - the scenarios and e2e cases that quote a tier amount are
  rewritten against the configured values.

## References

- [Bidding · Auction Logic](../../../docs/prds/products/grade10-site/auction/bidding.md#auction-logic)
