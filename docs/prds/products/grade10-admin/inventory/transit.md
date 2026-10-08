---
title: Transit
order: 4
---

## Values

| Rule | Value |
| --- | --- |
| Shipment states | Preparing · Sent · Arrived · Cancelled |
| Late | past its expected arrival and not arrived; read, never stored |
| Insured value | at most the carrier's cover a parcel; more ships split |
| Lost | missing for **30** days by default, a setting an admin changes |

## Moves Within a Site

- **Put away** - an item received goes to a storage unit on a scan of the
  unit - [Locations](/p/grade10-admin/inventory/locations)
- **Move** - from one unit to another on a scan of each; several items move
  together from a selection
- **Who and when** - every move names the staff member and the moment

## Shipments

A shipment carries one or more items between two places, or from a place to
an address.

| A shipment names | Value |
| --- | --- |
| From and to | a site, an outside place or an address |
| Carrier | a courier, or a staff run between sites |
| Tracking | the courier's number and its tracking link where there is one; none on a staff run |
| Insured value | the cover values of its items, within the carrier's cover |
| Expected arrival | a day |
| For | the service that asked: a grading batch, an auction order, a consignment's return, a transfer, a mail-in |

- **Preparing** - items are scanned into the parcel and the packing list
  prints
- **Sent** - handed to the carrier, on a day never in the future
- **Arrived** - scanned in at a site, or delivered at an outside place or an
  address
- **Cancelled** - only before it is sent; its items stay where they were
- **Late** - badged on the board once past the expected arrival

## Who Asks

- **Grading** - a batch ships to its grader and comes back in the grader's
  box; the batch keeps the grader's order and manifest -
  [Grading Console](/p/grade10-admin/grading/console#batches)
- **The auction** - a paid order ships to the winner's address -
  [Auction Management](/p/grade10-admin/auction/management#fulfilment)
- **Consignment** - an item goes back to its consignor -
  [Consignment](/p/grade10-site/consignment)
- **A transfer** - a run between two sites, such as a shop and the vault
- **A mail-in** - a parcel a collector sends is expected before it lands -
  [Intake and Release](/p/grade10-admin/inventory/intake#by-post)

## Custody in Transit

- **Still the house's** - an item in transit stays in custody, on its
  shipment rather than in a unit
- **Ends at an address** - delivery to the owner or a buyer ends custody, on
  the carrier's proof

## Exceptions

| On arrival | What happens |
| --- | --- |
| Received | the item goes to a storage unit |
| Missing | the item is badged missing on its shipment until it is found or declared lost |
| Damaged | photographed in the parcel; the owner's service acts under its agreement |

- **Lost** - a missing item is declared lost after the days above; the
  owner's service pays out under its agreement, the claim against the carrier
  is recorded, and the item retires as lost -
  [Items](/p/grade10-admin/inventory/items#retiring-an-item)
- **Found** - an item found later is received as any other, and the service
  that paid out reverses the payout under its own rule

:::detail{title="Product decisions" for="pm"}
Three services move items three ways: grading's batch shipments, the
auction's dispatch and delivery, and the vault's moves between lockers.
Nothing moves an item between shops, expects a parcel a collector sends, or
ships an item home outside the auction. The design is
[Inventory and Services Design](/references/inventory-and-services-design).

**Users.** Staff who pack, send and receive; the services that ask for a
shipment.

**Not in scope.** Buying postage or printing a courier's label from the
console; a courier's tracking read automatically; customs papers.

**Measurement.** Shipments past their expected arrival; items missing on
arrival; items declared lost.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| One shipment for every service | Decided | Grading's batches, the auction's orders, consignment's returns, transfers and mail-ins ship on one record; each service keeps what is its own, such as the grader's manifest - decided under the owner's delegation, 2026-10-08 | Product |
| Late is read | Decided | Past the expected arrival and not arrived, never a status - decided under the owner's delegation, 2026-10-08 | Engineering |
| Cover per parcel | Decided | Grading's rule for every shipment: the insured value stays within the carrier's cover, and more ships split - decided under the owner's delegation, 2026-10-08 | Operations |
| Tracking by hand | Decided | Staff type the courier and the number, as grading and the auction do today; reading a courier's tracking is a later change | Product |
| When a missing item is lost | Decided | A setting, **30** days missing by default - decided by the owner, 2026-10-08 | Operations |
:::
