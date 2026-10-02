**Author:** @mason5991 - 2026-10-02

## Why

An inventory admin opening View Cert IDs on a product sees only its Cert
records. Regular stock without a Cert ID is missing from the table, so the
dialog does not account for every unit the product holds. A Cert ID entered
wrong at intake cannot be corrected, and a unit received without one cannot be
given one later, short of removing the unit and intaking it again, which loses
its history.

**Metric:** physical-unit removals followed by a same-product intake within a
day, the workaround for a wrong Cert ID today, which should fall to none.

## What Changes

- **Every unit is listed.** Cert ID details shows the regular stock beside the
  Cert records: one `No Cert ID` row for the available units with their count,
  and one row for each active hold on regular stock with its holder and
  remaining count. Selecting a `No Cert ID` row shows the history of regular
  stock.
- **A wrong Cert ID can be corrected.** An available Cert record's Cert ID can
  be changed to another one not used on the same product. The record, its
  copy facts and its tagged media stay with the unit.
- **Regular stock can be numbered.** An available unit of regular stock can be
  given a Cert ID with its Grade Issuer, and Grade, Autograph Grade and Serial
  where known. It becomes a Cert record with its own history, and the
  `No Cert ID` count falls by one. Total stock does not move.
- **History records each change.** One entry per change carries its time,
  actor, the Cert ID before and after, and optional remarks. It shows in the
  product's history and in that unit's history.

No running rule is reversed. Regular stock remains a count and creates no Cert
record at intake; a Cert ID stays required on every Cert record.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-admin/inventory/catalog`: the `No Cert ID` rows in Cert ID details,
  correcting and assigning a Cert ID on an available unit, and the Cert ID
  change in the history.

## Impact

- **Admin app** - the `No Cert ID` rows, and the correct and assign actions
  with their history, in Cert ID details on the inventory product page.
- **Inventory service** - a Cert ID change on an available Cert record, an
  assignment that turns one available unit of regular stock into a Cert record,
  and the history entry for both, in one transaction each.
- **Auction** - none to build. A listing reads its unit's Cert record, so an
  ended listing whose unit was released shows the corrected Cert ID.
- **Site** - none; a live listing holds its unit, and a held unit cannot be
  changed.

## Depends On

- `release-stock-on-unsold-close` - it modifies the same history requirement,
  and this change's delta is drawn on top of its accepted contract.

## References

- [Products and Stock · Intake](../../../docs/prds/products/grade10-admin/inventory/catalog.md#intake)
