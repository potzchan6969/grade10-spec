---
title: Intake and Release
order: 5
---

## Values

| Channel | Starts with | Custody starts |
| --- | --- | --- |
| At a shop | a booked or walk-in visit and the service's own counter steps | when the item is handed in under an executed agreement |
| By post | the service's request online, its agreement signed online and a shipping instruction | when the parcel is received |
| Partner deal | an admin's deal: the partner, the purpose, the terms and the expected items | when each item is received against the deal |
| House purchase | stock bought, through the catalogue's intake | on receipt; the custodian owns it |

## Receiving an Item

Every channel receives an item the same way, whichever service it is for.

:::flow{title="Receiving an item"}
## *Staff* - **Identify**
Scan the label or the grader's barcode, type the grader and the cert, or register a new item under its owner; a known slab is found rather than added twice.

## *Staff* - **Check**
Against what was expected, with a condition note.

## *Staff* - **Photograph**
Front and back, as received; every service reads these photographs.

## *Staff* - **Label**
The item's label prints; a slab's own barcode stays a second way to find it.

## *Staff* - **Put away**
A scan of a storage unit, refused past the unit's cap - [Locations](/p/grade10-admin/inventory/locations#caps).
:::

- **Nothing arrives without paper** - a counter hand-in waits for the
  service's agreement to be signed, and a mail-in's shipping instruction is
  issued only once it is
- **The service's own steps** - grading's declared value and level, the
  vault's valuation and consignment's price run on the item as received,
  never on a second copy

## By Post

- **Request first** - the collector opens the service's request online and
  signs its agreement on their own phone
- **Shipping instruction** - the address, how to pack, and the most a parcel
  may declare
- **Expected** - the collector types the courier and the tracking number,
  and the parcel waits on the transit board -
  [Transit](/p/grade10-admin/inventory/transit)
- ❓ Legal - **Risk on the way in** - the collector's until the parcel is
  received, as proposed
- **A parcel nobody expected** - waits in Receiving until staff match it to
  a request

## Partner Deals

- **A partner** - an organisation an admin registers, with its contacts, that
  owns the items it sends - [Items](/p/grade10-admin/inventory/items#owners)
- **A deal** - the partner, the purpose, the terms, the expected items as an
  imported list, and the master agreement signed once
- **Purposes** - consign to the store or the auction, sell to the house, or
  grade in bulk
- **Received against the list** - items arrive at a shop or on a shipment,
  and the deal shows what has arrived and what has not
- ❓ Commercial - **Settling a deal** - one monthly statement in place of a
  payout for each item is proposed

## Release

| Way out | Custody ends when |
| --- | --- |
| Collected at a shop | the owner, or a person they named, signs the receipt |
| Shipped | the carrier's proof of delivery, or Shopify's fulfilment for a store sale |
| Sold and kept | the owner moves to the buyer; the item stays where it is |
| Written off | lost or destroyed and paid out under its agreement; the item retires |

- **A release ends a mark** - the mark of the service that held the item
  closes with it - [Services and Hand-offs](/p/grade10-admin/inventory/services)
- ❓ Commercial, Legal - **Shipping home** - a vault or grading item shipped
  to its owner waits on transit cover -
  [Grading](/p/grade10-site/grading#before-the-first-submission)

:::detail{title="Product decisions" for="pm"}
Each service takes items in its own way: the vault's request and counter,
grading's list and counter, the catalogue's intake for house stock. None
takes a parcel by post or a dealer's batch, and each records the same object
again. The design is
[Inventory and Services Design](/references/inventory-and-services-design).

**Users.** Staff at the counter and in the back room; admins, who run
partner deals; collectors and partners, who send items in.

**Not in scope.** Buying from a collector at the counter; paying a partner
for a purchase, which the firm's accounts keep; customs for a parcel from
abroad.

**Measurement.** Items received with no agreement, held at zero; parcels
waiting unmatched; days from arrival to put-away.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| One way to receive | Decided | Identify, check, photograph, label and put away, for every channel and every service - decided under the owner's delegation, 2026-10-08 | Product |
| Paper before custody | Decided | No item is taken in for someone else without the service's agreement signed - decided under the owner's delegation, 2026-10-08 | Legal |
| Partners own their items | Decided | A partner is an organisation an admin registers, so a deal's items belong to the company rather than to the person who signed - decided under the owner's delegation, 2026-10-08 | Product |
| Risk on the way in | ❓ Open | The collector's until the parcel is received | Legal |
| Settling a partner deal | ❓ Open | One monthly statement | Commercial |
| Shipping home | ❓ Open | Waits on transit cover, as grading's slabs do | Commercial, Legal |
:::
