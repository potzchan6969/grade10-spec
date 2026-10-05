---
title: Products and Stock
spec: grade10-admin/inventory/catalog
order: 1
---

An admin creates and classifies products, then records the stock physically
received. The catalogue keeps card identity, operational inventory, and a
traceable current market reference together without turning the reference into
product history.

## Product identity

- **Product hierarchy** — IP, Category, and Item are the complete product identity
- **Product entry identity** — product names may repeat; import resolution
  uses the name, exact taxonomy tuple, and typed product values
- **Required classification** — one reusable IP, Item, and Category tag
- **PriceCharting identity** — a confirmed provider match with its canonical
  link and stable provider id

## Product schemas

- **Exact tuple** — one IP, one Item, and one Category select the product
  schema; one published schema is active for each tuple
- **Workbook card template** — one shared collectible-card template covers
  the workbook's categories. Year, Set, and Subject describe the product, with
  numeric Year and all three required; Card Number and Variety are optional.
  Serial, certificate, and grading facts describe an individual copy.
- **Schema import** — admins can load attribute definitions into a draft,
  review validation results, then publish the schema through the existing
  draft-and-publish lifecycle
- ❓ **Workbook taxonomy mapping** — each distinct source product family needs
  an explicit mapping to the exact Grade10 IP, Item, and Category tags. A broad
  workbook Category such as TCG Cards must not collapse Pokémon, Lorcana, and
  One Piece into the same taxonomy tuple. The workbook's Item column is the
  product display name, not the Grade10 Item tag.
- **Reusable attribute key** — a stable key, a type, validation rules, and
  displayed labels and option values for English, Traditional Chinese, and
  Simplified Chinese
- **Draft and publish** — an admin edits a draft; publishing checks every
  matching product before the new configuration becomes active
- **Translation warning** — missing non-English copy is reported and uses the
  English value when displayed; it does not block publishing

## Product attributes

- **Universal classification** — IP, Item, and Category remain required for a
  product to become created
- **Typed value** — text, number, boolean, single-select, or multi-select;
  supplied values satisfy the assigned attribute's rules
- **Required value** — every required attribute has a valid value before a
  draft product becomes created; an optional value may remain absent
- **Product status** — a product without a matching published schema remains a
  draft and cannot enter Auction or reserve stock

## Auction presentation

- **Product fields** — an admin selects and orders the fields Auction shows for
  each product schema; selected values remain live and searchable by their
  stable identity
- **Cert ID field** — Cert ID is always available to choose as a displayed
  field, but an admin decides whether it appears and where it sits
- **Listing attribute** — an ordered display item belongs to one Auction
  listing, may carry localized labels and values, and is not searchable or
  filterable
- **Locale fallback** — a missing requested translation uses English, then
  the supplied value for a listing attribute

## Current reference

- **PSA-oriented prices** — the supplied ungraded baseline and numeric grades
- **Freshness** — source, successful update time, and fresh, stale, or
  unavailable state
- **Retention** — the replaceable current cache only; no history chart,
  population report, certificate facts, or other grading data

## Intake

- **Single product** — create or edit the card identity before stock arrives
- **Cert ID per certified copy** - each certified unit enters inventory with
  one Cert ID and creates one Cert record; regular stock without a Cert ID is
  intaken as product quantity and creates no Cert record
- **Copy-level facts** - each Cert record carries its required Cert ID. One
  from the inventory workbook import also carries its issuer, grade, autograph
  grade and serial, grade as source text; one intaken from the product page
  carries the Cert ID alone. A unit without a Cert ID is regular stock rather
  than a Cert record.
- **Every unit in Cert ID details** — View Cert IDs lists each Cert record
  and the regular stock without a Cert ID: one `No Cert ID` row for the
  available units with their count, shown whenever regular stock has any
  history, and one for each active hold with its holder and remaining count. A
  `No Cert ID` row shows the history of regular stock. Sold, withdrawn and
  vaulted regular stock is not listed, because no unit of it is tracked
- **Cert ID correction** — a Cert record that has only been intaken can
  have its Cert ID changed to another one no record of the product holds, in
  any status. A record that has ever been reserved, sold, withdrawn, vaulted
  or listed keeps its Cert ID, and a Cert ID cannot be cleared or read
  `No Cert ID`
- **Cert ID assignment** — an available unit of regular stock can be given
  a Cert ID alone, the one field the intake dialog asks for; it becomes a Cert
  record with no Grade Issuer, Grade, Autograph Grade or Serial and leaves the
  `No Cert ID` count
- **Cert ID change in history** — each change is one history entry with
  its time, actor, the Cert ID before and after (`No Cert ID` before an
  assignment) and optional remarks, and it shows in that unit's history
- 🚧 **Units entered by mistake** — regular stock or a Cert record that has
  only been intaken can be reversed: stock and the ledger fall, withdrawn
  does not. Remarks default to `Entered by mistake`
- **Explicit reservation unit** — every reservation selects one Cert ID or
  explicitly selects `No Cert ID`; a numbered reservation is one unit
- **Product bulk import** — upload product names and typed schema attributes
  separately from physical inventory, then review taxonomy mappings and row
  validation before committing. Trim surrounding whitespace from mapped text
  values and treat blank or standalone `-` cells as absent.
- **Inventory bulk import** - upload stock against existing products, review
  Cert IDs and copy-level facts for certified units, and explicitly include or
  exclude each row whose Item Status is blank before committing. Rows without
  a Cert ID contribute regular stock and do not create Cert records. Trim
  surrounding whitespace from mapped copy facts and treat blank or standalone
  `-` cells as absent.
- **Provider product import** — upload a bounded CSV, review taxonomy and
  provider matches, confirm each row, and commit the batch as one operation
- **Inventory ledger** — track stock, holds, sales, withdrawals, and vaulting
  without losing the arithmetic
- **Unsold auction stock** — when an Auction listing closes Unsold, its hold
  closes as released, available rises by the held units, and the product
  page and the history both name the listing. A hold left over from a listing
  that closed Unsold earlier is released once and reads the same. The
  release's remarks say an Unsold listing released it
- **History** — each entry shows when it happened, its action, quantity
  and actor, the holder — the listing a hold belongs to, by listing code and
  title — and its remarks
- **Cert-scoped media** - an Inventory image or video stays product-level
  when untagged, or is tagged to one same-product Cert record. Every Cert
  record has a Cert ID; regular stock without a Cert ID has no Cert record or
  tag target. Removing a media Cert tag or retagging leaves the originally tagged
  source item untagged. Removing a physical unit removes its Cert record and
  the source media tied to that record; Inventory records the unit as withdrawn

:::detail{title="Product decisions" for="pm"}
Cert-scoped source media keeps product-level shared images while letting an
operator mark which physical Cert a photo belongs to, without inventing a
second gallery.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Cert media tag identity | Decided | The tag stores the immutable Cert record id. Every Cert record has a printed Cert ID used for display only. | Product |
| One Cert per source item | Decided | A source item is untagged and shared, or tagged to exactly one same-product Cert record. Regular stock without a Cert ID has no Cert record and cannot be a tag target. | Product |
| Retag and remove | Decided | An authorized Inventory operator may tag or untag. Retagging leaves the item untagged; assigning another Cert is a separate tag. Physical removal of an available Cert unit withdraws it, deletes its Cert record and its tagged source media, and leaves other product media and saved Auction snapshots unchanged. | Product |
| Units entered by mistake | Decided | A unit that has only been intaken can be taken out as if it was never received: stock and the ledger fall, withdrawn does not move. A unit that has moved leaves only by withdrawal, so the ledger keeps every unit that was ever handled. One removal per Cert record: Remove physical unit is not offered on one that has only been intaken, and a card that left before it ever moved is reversed with remarks saying so. | Product |
:::

:::detail{title="Intake code map" for="engineer"}
- **Release input** — `ReleaseInput` in `packages/inventory/contracts`
- **Reservations** — `ReservationGroup.tsx`
- **Change history** — `ChangeHistoryDialog.tsx`
- **Cert ID correction and assignment** — `correctCertId` and `assignCertId`
  in `services/inventoryMutations.ts`
- **Copy facts** — `normalizeUnitFacts` in `services/unitFacts.ts`
- **Unit history** — the `unit` filter in `repositories/changelogs.ts`
- **Cert ID details** — `CertIdDetailDialog.tsx`
:::
