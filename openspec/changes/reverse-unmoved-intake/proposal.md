**Author:** @mason5991 - 2026-10-05

## Why

An inventory admin who intakes too many units, or a Cert record that was
never received, has no way to take it back out. Regular stock cannot leave
from the product page at all, and Remove physical unit records a Cert record
as withdrawn, so the withdrawn count and the ledger keep a unit the shop never
had.

**Metric:** Remove physical unit used on a Cert record that has only been
intaken, the workaround today, which should fall to none.

## What Changes

- **Regular stock entered by mistake can be reduced.** While regular stock
  has only been intaken - never held, sold, withdrawn or vaulted - the admin
  reduces the `No Cert ID` available count in Cert ID details by up to its
  units. Stock and the ledger fall by that number; withdrawn does not move.
- **A Cert record entered by mistake can be removed.** A Cert record that has
  only been intaken - the same records whose Cert ID can be corrected - can be
  removed as if it was never received. Its tagged media go with it, as on
  Remove physical unit. Stock and the ledger fall by one; withdrawn does not
  move.
- **Remove physical unit stays.** It is still offered beside the new removal
  and still records a withdrawal, for a card that was received and has left.
- **History records each one.** One entry per reduction or removal carries
  its time, actor, quantity, the Cert ID where there was one, and required
  remarks, under its own action apart from intake and withdraw. It shows in
  the product's history, and a regular stock reduction shows in the
  `No Cert ID` history.

No running rule is reversed. Today the ledger only rises, at intake; this
change adds the one way it falls, and only for units that never moved. Sold,
withdrawn and vaulted still never decrease.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-admin/inventory/catalog`: reducing unmoved regular stock and
  removing an unmoved Cert record from Cert ID details, the history action
  that records both, and the inventory counts they move.

## Impact

- **Admin app** - the reduce action on the `No Cert ID` available row and the
  remove action on an unmoved Cert record, each with required remarks, in
  Cert ID details on the inventory product page.
- **Inventory service** - a reduction of regular stock and a removal of a
  Cert record that lower stock and the ledger, with their history entry, in
  one transaction each; a new history action.
- **Auction, Vault** - none to build. An unmoved unit was never held, so no
  listing or vault hold names it.
- **Site** - none.
- **Suites above** - no domain impact: Inventory has no domain suite and the
  change touches one capability. No product impact: no case in
  `product-tcs.md` traces the journeys this change leans on.

## References

- [Products and Stock · Intake](../../../docs/prds/products/grade10-admin/inventory/catalog.md#intake)
