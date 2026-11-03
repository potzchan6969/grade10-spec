---
title: Inventory
icon: package
---

::phase{id="internal-consignment" priority="P1"}

Inventory is the house ledger for physical stock more than one application
consumes. One snapshot per catalogue product answers how much Grade10 holds
and where every unit stands — available, reserved, vaulted, sold, withdrawn —
and every hold names its consumer explicitly: a reservation carries a
`holder_kind` of `grade10-auction` or `grade10-vault`, never an inference
from ids. Each application reads availability and its own holds, and no other
application's.

Settling is not one shape, so partial moves are first-class: part of a hold
sells, part releases, the remainder stays held. The auction settles a hold by
selling; the vault settles one by taking custody, not by a sale. Every
quantity change appends one changelog entry — who, what, and the counts
before and after — so the arithmetic is never lost.

This is an operator product: everything here happens in the admin console,
and for stock, the number that matters is whether it reconciles — available
plus every hold, grouped by who holds it, equal to what the house actually
has.

| Page | What it holds |
| --- | --- |
| [Products and Stock](/p/grade10-admin/inventory/catalog) | The catalogue, house stock, its holds and Cert IDs |
| [Items](/p/grade10-admin/inventory/items) | One record per physical object, and who owns it |
| [Locations](/p/grade10-admin/inventory/locations) | Every place an item can be, caps, labels and counts |
| [Transit](/p/grade10-admin/inventory/transit) | Moves between places, shipments and what arrives |
| [Intake and Release](/p/grade10-admin/inventory/intake) | How items come into custody and how they leave |
| [Services and Hand-offs](/p/grade10-admin/inventory/services) | Which service acts on an item, and passing it to the next |
| [Inventory Console](/p/grade10-admin/inventory/console) | The item page, scanning, receiving, the transit board and counts |

## The Intake Form

The vault's intake form finds and creates its products, receives its cards and
prints their labels through inventory - [Vault Intake](/p/grade10-site/vault/intake#intake-form).

- 🚧 **SNKRDUNK Card** — an item's SNKRDUNK card is inventory's; its product
  remembers the SNKRDUNK card so the next copy fills it in, the condition
  coming from the copy; the vault and consignment read it rather than keep
  their own

## Product Assets

| Rule | Value |
| --- | --- |
| Files | JPEG, PNG, WebP, AVIF, MP4, WebM or QuickTime |
| File size | At most **100 MiB** each |
| Gallery | **0 to 8** images or videos, in the inventory admin's order |

- **Reusable product media** — an inventory admin keeps photographs and
  video on the catalogue product, not on an individual Cert ID. The gallery
  can be added to, replaced, reordered, or cleared while the product record
  remains editable. It prepares material for Auction; it does not appear on a
  storefront product page.
- **Stable auction selection** — when an auction operator selects a product
  asset for a listing and saves, that listing keeps its own copy of the
  selected media. Changing, reordering, or removing the product gallery later
  does not change the listing.
- 🚧 **Media by Unit** — the gallery grouped into the product and each of its
  Cert units; the look waits on its design
  - **Drop on a Unit** — a file dropped on a unit's group is tagged to it, and
    a file dragged to another group is tagged again
  - **Intake Photos Beside It** — each unit's front, back and other photos from
    intake, read-only, with who took them and when
  - **Copy to Gallery** — copies an intake photo into the gallery for that unit;
    the intake photo itself is never moved or deleted
  - **The Same Bounds** — up to 8 assets, as for Auction listing media
- ❓ **Intake Photos in Marketing** — whether a collector's intake photos may be
  copied into material Grade10 markets. Legal confirms

:::detail{title="Product decisions" for="pm"}
Three records count physical things and never meet: the catalogue counts
house stock and the auction's holds, the register holds objects only the
vault marks, and Shopify counts the shop's retail stock. The owner asks for
inventory every downstream service builds on - the vault, grading, store
consignment and auction consignment. The design is
[Inventory and Services Design](/references/inventory-and-services-design).

Reusable media belongs on the catalogue product so Auction listings of that
product can start from material already checked once. Listing galleries keep
their own copy at Save; later product-gallery edits do not rewrite a lot.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| One record per object | Decided | Every object the house touches is an item, whoever owns it: a Cert record links to one the custodian owns and a grading card is one from hand-in, so a slab never has two identities - decided under the owner's delegation, 2026-10-08 | Product |
| Interchangeable stock | Decided | Stock nobody could tell apart, such as sealed boxes, stays a count on its product - decided under the owner's delegation, 2026-10-08 | Product |
| Places and moves are inventory's | Decided | Every service asks inventory where an item is and to move it; none keeps a place of its own - decided under the owner's delegation, 2026-10-08 | Product |
| The shop's own stock | Decided | Shopify keeps the shop's retail stock; a consigned item is published to the store and its sale comes back - decided under the owner's delegation, 2026-10-08 | Product |
| Media owner | Decided | Catalogue product, not a Cert ID or physical unit. Cert-tagged source media is a later change; Media by Unit is that change, keeping intake photos as their own record and copying, never moving, them into the gallery - the counter review, round 3, 2026-11-02 | Product |
| Media policy | Decided | Same accepted types, 100 MiB maximum, and gallery bounds as Auction listing media. | Product |
| Storefront product media | Decided | Out of scope; product assets prepare Auction material only. | Product |
| Backfill | Decided | Existing products and listings stay unchanged until an operator adds assets. | Product |
:::
