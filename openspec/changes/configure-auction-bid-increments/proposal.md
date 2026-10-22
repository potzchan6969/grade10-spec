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
  lower-inclusive tiers, a lowest tier from $0, the tier chosen from the amount
  being beaten, the last tier unbounded. It carries no increment value, so the
  lowest tier is retuned like any other.
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
- `grade10-admin/auction/listing`: a starting price is a whole-dollar amount,
  so an operator's draft save, create or update of one with cents is refused

## Impact

- **Manual** - Bidding shows the new values and marks the configured schedule.
- **Code** - the auction contracts package holds the schedule today, and the
  backend, the collector site and the demo read it from there.
  `tech-design.md` settles where the configuration lives and how the manual
  reads it.
- **Tests** - the scenarios and e2e cases that quote a tier amount are
  rewritten against the configured values.
- **Neighbouring specs** - `auto-bidding`, `bidding-history`, `auction`,
  `account-record` and `grade10-admin/auction/internal-bid` quote amounts from
  the old tiers. They get no delta: their amounts read as examples under other
  configuration values, and only the application's tests and fixtures are
  rewritten.
- **Starting price** - a starting price an operator or a consignment ask sets
  is whole dollars (Q16, Q17, Q19). A price already stored with cents is left as
  it is (Q18); the opening minimum on such a row is held for the product
  manager (see Raised in [decisions](decisions.md#raised)).
- **Depends on** - `usd-lot-currency-winner-settlement-choice`, which also
  modifies this capability and archives first, as its `depends_on` records.
  This change owns the rule-and-configuration text; that one owns the USD-only
  requirement.

## References

- [Bidding · Auction Logic](../../../docs/prds/products/grade10-site/auction/bidding.md#auction-logic)
- [Listing Management · Listings](../../../docs/prds/products/grade10-admin/auction/management.md#listings)
