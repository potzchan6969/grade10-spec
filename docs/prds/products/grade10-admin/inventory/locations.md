---
title: Locations
order: 3
---

## Values

| Rule | Value |
| --- | --- |
| Sites | shop · vault · warehouse |
| Storage units | room · safe · locker · cabinet · display case · shelf · tray, each inside a site or another unit |
| Outside places | grader · partner · storage provider · other |
| Label | one short code per item, printed with its QR code and title |
| Cap | the cover value a site or a unit may hold, in the brand's currency |

## Places

- **Site** - a place the house runs, with an address and a time zone; a
  shop also takes visits on the diary
- **Storage unit** - a named place inside a site, such as `Safe 1` or
  `Locker A-12`; a unit may sit inside another, a locker inside a room
- **Outside place** - a place the house sends items to and does not run: a
  grader's receiving address, a partner, a storage provider
- **One registry** - inventory keeps every place; the diary keeps the hours,
  desks and bookings of the sites that take visits, under the ids its shops
  carry today - [Diary](/p/grade10-admin/appointment/diary)
- **Retired, never deleted** - retiring a place is refused while an item is
  in it

## Where an Item Is

- **One answer** - an item in custody is in one storage unit, at an outside
  place, or in transit on one shipment; once released it is with its owner
- **Read from its moves** - the place follows from the item's last
  movement - [Transit](/p/grade10-admin/inventory/transit)
- **The same place everywhere** - the item page, a vault case, a grading
  card and a consignment name one place for one item

## Caps

- **Cover value** - what the house would pay out if the item were lost, as
  its agreement names it: a grading card's declared value, a vault case's
  valuation
- **A consigned item and house stock** - the floor price and the cost, by
  default; an admin may pick the list price or the market reference
- **A cap refuses** - a put-away or a move that would carry a unit or a site
  past its cap is refused, naming the cap
- **Each shop's safe** - grading's safe cap becomes the cap on each shop's
  safe by default, and an admin may keep one cap across every shop -
  [Grading Console](/p/grade10-admin/grading/console#hand-in)
- **Room left** - the receiving desk shows what a cap leaves before the first
  item is checked

## Labels

- **Every item** - a label at receipt: a short code from the alphabet the
  case reference uses, its QR code and the item's title
- **A slab's own barcode** - scanning a grader's barcode finds the slab by
  its grader and cert
- **Reprinted, never changed** - the code stays with the item for life

## Counts

- **Count a unit** - staff scan everything in it; the count lists what is
  missing and what is unexpected
- **Resolve each** - moved, found elsewhere, or missing; a missing item stays
  missing until it is found or written off -
  [Transit](/p/grade10-admin/inventory/transit#exceptions)
- **How often** - a setting per unit: each safe weekly and each locker
  monthly by default; a unit past its count is badged

:::detail{title="Product decisions" for="pm"}
Nothing records where an item is. The vault writes the shop and a free-text
locker, grading counts one safe across every shop, and the catalogue and the
auction know no place, so a shop cannot find a card, cap a safe per shop or
count a shelf. The design is
[Inventory and Services Design](/references/inventory-and-services-design).

**Users.** Staff at the counter and in the back room; admins, who set the
places and their caps.

**Not in scope.** A floor plan; temperature or humidity; shelf space by size;
an item once it has left the house's custody.

**Measurement.** Items in custody with no place, held at zero; counts that
close with nothing missing; put-aways refused at a cap.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Who keeps places | Decided | Inventory keeps every place; the diary schedules the sites that take visits, under the ids its shops carry today - decided under the owner's delegation, 2026-10-08 | Product |
| Where an item is | Decided | Read from its last movement and written nowhere else, so two records can never disagree - decided under the owner's delegation, 2026-10-08 | Engineering |
| The house's own label | Decided | Every item gets one, since a raw card carries no barcode; a grader's barcode is a second way to find a slab - decided under the owner's delegation, 2026-10-08 | Product |
| What a cap counts | Decided | The cover value, what the house would pay out, rather than what the item might sell for - decided under the owner's delegation, 2026-10-08 | Commercial |
| Settings with defaults | Decided | The cover value of a consigned item and of house stock, a cap per shop's safe and how often a unit is counted are settings an admin changes; each starts on the recommendation - decided by the owner, 2026-10-08 | Product |
:::
