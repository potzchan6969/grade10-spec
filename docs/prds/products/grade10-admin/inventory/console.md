---
title: Inventory Console
order: 7
---

The Inventory section of the admin console: one page per item that says what
it is, whose it is, where it is and what is happening to it, and the desks
that receive, move and count.

## Pages

| Page | What it lists |
| --- | --- |
| Items | every item, the ones in custody by default; narrowed by owner, service, site and whether it is in transit |
| Products and Stock | the catalogue - [Products and Stock](/p/grade10-admin/inventory/catalog) |
| Locations | the tree of sites, their units and outside places |
| Transit | shipments, by what each waits for |
| Receiving | the day's expected arrivals and the receive desk |
| Deals | partners and their deals |

- **Every row opens its item** - an item named on a vault case, a grading
  card, a consignment or a lot opens the same item page

## Scan

- **Anywhere** - a scan in the console's header opens the item: its label,
  a grader's barcode, or an item id typed
- **Inside a task** - while packing, receiving or counting, a scan adds the
  item to the task instead
- **Nothing found** - a scan that finds no item offers to receive a new one

## The Item Page

| Part | Shows |
| --- | --- |
| Header | the title, label code, category, grader, grade and cert; the owner, by name under the identity grant; where it is; each open mark as a chip naming its service and reference |
| Values | each value with its source and date - declared, valued, market reference, sold - read from the service that holds it, under that service's grant |
| Overview | the facts, the photographs as received, and the product it is an instance of |
| Where | every receipt, move, shipment and release, with who and when |
| Services | every mark, open and closed, with its outcome and a link to its case, submission, consignment or lot |
| Documents | every agreement and receipt covering the item, across services |
| Owners | every change of owner: a transfer, a sale, a forfeit |
| Activity | every act on the item from the audit chain |

- **Apply to a service** - one menu naming the vault, grading, consignment,
  the auction and the store, each offered or withheld with the reason in
  words - [Services and Hand-offs](/p/grade10-admin/inventory/services#applying-an-item)
- **Move** - a scan of the unit it goes to
- **Print label** - at any time
- **Retire** - as the register runs it -
  [Items](/p/grade10-admin/inventory/items#retiring-an-item)

## Receiving Desk

- **Today** - the drop-offs the diary holds for every service, the parcels
  expected, graders' boxes due back and partner deliveries, each with what it
  should hold
- **Receive** - one card runs the five steps on an item: identify, check,
  photograph, label, put away -
  [Intake and Release](/p/grade10-admin/inventory/intake#receiving-an-item)
- **Room left** - the cap each unit an item can go to still leaves
- **Unmatched** - a parcel nobody expected waits here until staff match it

## Locations Page

- **The tree** - sites, their units and outside places
- **One unit** - what is in it, items and stock; how many; its cover value
  against its cap; its last count
- **Move a selection** - several items to another unit at once
- **Count this unit** - opens a count - [Locations](/p/grade10-admin/inventory/locations#counts)

## Transit Board

| View | What it lists |
| --- | --- |
| To pack | shipments preparing |
| To send | packed shipments waiting for the carrier |
| In transit | sent and not arrived, late ones badged |
| To receive | arrived at a site and not yet scanned in |
| Exceptions | items missing or damaged on arrival |

- **One shipment** - from and to, the carrier and tracking, the insured
  value against the carrier's cover, the expected arrival, each item and its
  state, the packing list and the shipment's timeline -
  [Transit](/p/grade10-admin/inventory/transit)

## Settings

An admin changes every setting here; each starts on its default.

| Setting | Default | Choices |
| --- | --- | --- |
| Cover values on the register | on | off; caps then count only what each service checks |
| Cover value of a consigned item | the floor price | the list price; the market reference |
| Cover value of house stock | the cost | the market reference |
| A cap per shop's safe | each shop's safe its own cap | one cap across every shop |
| How often a unit is counted | each safe weekly, each locker monthly | any number of days, per unit |
| Missing until lost | **30** days | any number of days |
| Sell from the vault | on, storage lane only | off |
| A live loan and a sale | no sale until repaid | the proceeds repay the loan first |

- **On the audit chain** - every change, with the old and new value

## Grants

| Grant | Roles | Opens |
| --- | --- | --- |
| `inventory:read` | staff, admin | items, locations, transit and receiving |
| `inventory:move` | staff, admin | receive, put away, move, pack, send, receive a shipment, count |
| `inventory:locations` | admin | add or retire a site, a unit or an outside place, and set a cap |
| `inventory:deals` | admin | partners and partner deals |
| `inventory:settings` | admin | change a setting |

- **The register's grants stand** - `inventory:write`, `inventory:transfer`
  and `kyc:read` open what they open today -
  [Items](/p/grade10-admin/inventory/items#permissions)
- **Every act on the audit chain** - filed under its item, or under its
  shipment or count

:::detail{title="Product decisions" for="pm"}
Staff answer one question about an item in four sections: its vault case,
its grading card, its catalogue unit and its auction lot each say part of it,
and none says where it is. The owner asks for inventory that every service
builds on, run from the admin console. The design is
[Inventory and Services Design](/references/inventory-and-services-design).

**Users.** Staff at the counter and in the back room; admins who set places,
caps and partner deals.

**Not in scope.** A collector's own page of their items; mobile scanning
apart from the console in a browser; reports beyond the lists here.

**Measurement.** Scans that find their item; items received to put away in
one visit; counts closed with nothing missing.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| The item page is the hub | Decided | One page per item answers what, whose, where and what is happening to it; every service's row opens it - decided under the owner's delegation, 2026-10-08 | Product |
| Scan first | Decided | A scan opens an item anywhere and adds it to the task in hand, since a back room works with the item in one hand - decided under the owner's delegation, 2026-10-08 | Product |
| Lists by wait | Decided | The transit board and the receiving desk are cut by what each row waits for, as the vault's and grading's queues are - decided under the owner's delegation, 2026-10-08 | Product |
| Places and deals are admin acts | Decided | Staff receive, move and count; only an admin adds a place, sets a cap or opens a deal - decided under the owner's delegation, 2026-10-08 | Product |
:::
