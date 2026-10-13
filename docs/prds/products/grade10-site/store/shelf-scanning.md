---
title: Shelf Scanning
spec: grade10-site/store/shelf-scanning
order: 8
---

Shelf scanning lets shop staff point the card scanner at a product on the
shop's shelf and see what the store sells it as. The scanner opens at the
site's `/scan`; the store keeps what it knows in step with the catalogue.

## Values

| Rule | Value |
| --- | --- |
| What the scanner holds | every product the store publishes, sold out included |
| A catalogue change on the scanner | within 5 minutes |
| A new photo recognisable | within the hour, on staging and production |
| A photo run with nothing new | does nothing |
| What a scan shows | title, price, stock, a link to the store page |

## What the Scanner Holds

🚧 **Every published product** — each product the store publishes is one item
on the scanner: card, slab, sealed box and merch alike

🚧 **In step within 5 minutes** — a product the shop publishes, reprices,
sells out, brings back or changes the photos of reaches the scanner within 5
minutes

🚧 **Gone when the store drops it** — a product the store unpublishes or
deletes leaves the scanner within 5 minutes

🚧 **The store's catalogue wins** — an item changed on the scanner is put back
to the store's version within 5 minutes

- **Every shelf product is published** — the shop sells nothing on the shelf
  that the store does not publish, so the scanner misses none

:::flow{title="From the shop's catalogue to the shelf" diagram="assets/diagrams/store-shelf-scan.svg"}
## A product is published
A stock keeper publishes a product on the shop, or changes its price, stock or
photos — [Product Data](/p/grade10-site/store/product-listing#product-data).
## The store keeps the scanner in step
Every 5 minutes the store compares its catalogue with the scanner's items. It
adds what is new, rewrites what moved, removes what it no longer publishes,
and leaves what matches untouched. A slab carries its own unit's grader, grade
and cert.
## The scanner learns the photos
Every hour the scanner learns the photos it has not seen. A run that finds
none does nothing.
## Staff point the camera
A shopkeeper opens `/scan` on a phone and points it at the shelf.
## The product shows
The scanner names the product and shows the store's title, price, stock and a
link to its store page.
:::

## Slabs

A slab is known by its grader and cert.

| Product | How the store knows its slab |
| --- | --- |
| Consigned slab | the consigned item, and that item's grader, grade and cert in inventory |
| House-stock slab | the grader and cert the stock keeper writes on the product in the shop |
| Raw card | no slab: held by its card |

🚧 **The copy, not only the card** — a consigned slab's product carries the
grader, grade and cert of the one slab it sells, so the scanner reading that
slab's label names that product with its grade and cert

🚧 **House-stock slabs** — a stock keeper writes the slab's grader and cert on
the product in the shop, and the scanner names that product when it reads
that slab's label

🚧 **A slab with no known unit** — a graded product the store cannot join to
one slab is held by its card alone, without grade or cert, and counted so the
gap shows

## Sealed Boxes

🚧 **Held before they are recognised** — sealed boxes are on the scanner now,
with their title, price and stock; the scanner does not recognise a box from
its product photos until its box detector ships

- **Scanning a box** — until the box detector ships, the scanner shows what
  it shows for anything it does not recognise, "Not recognised yet — hold
  steady"

## Photos

🚧 **Hourly on both** — the scanner learns new photos every hour on staging
and on production

🚧 **Nothing new, nothing done** — an item whose fields and photo list match
what the scanner holds is not written again, so no photo is queued, the
scanner's files are not rebuilt, and an hourly run that finds no photo to
learn does nothing

- **Photos change, the item learns again** — a product's new or replaced
  photo is learned at the next hourly run; a photo the product drops leaves
  the scanner with it

## On the Shelf

🚧 **What a scan shows** — the product's title, its price in the store's
currency, its stock, and a link that opens its store page

🚧 **Sold out** — a sold-out product is still named, and its stock reads
"Sold out", as the store reads availability —
[Product Page](/p/grade10-site/store/product-page)

🚧 **A link from the store** — shop staff open `/scan` through a link the
store hands out; anyone holding it sees the store's public prices and nothing
more

- **Grade10's store only** — ZZZ's store is not held

:::detail{title="Code map" for="engineer"}
- **Scanner** — `apps/backend/grade10/tcg-ar`; its platform API —
  `apps/backend/grade10/tcg-ar/docs/PLATFORM.md`
- **Store pass** — the store's 5-minute schedule, `packages/grade10-store/backend/src/sweeps/cron.ts`
- **Photo run** — `.github/workflows/tcg-ar-ops.yml`, job `photos`;
  `apps/backend/grade10/tcg-ar/scripts/process-photos.ts`
- **Slab facts** — inventory items, `packages/inventory/backend/src/db/schema/items.ts`
- **Commerce architecture** — [docs/architecture/commerce.md](https://github.com/9gag/grade10/blob/main/docs/architecture/commerce.md)
:::

:::detail{title="Product decisions" for="pm"}
Staff on the shop floor need the store's answer for the product in their hand,
and the scanner can only give it if it holds the store's catalogue.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Shopkeeper | A customer asks about a product on the shelf | Sees its title, price and stock, and can open its store page |
| Shopkeeper | Holds one slab of a card the store lists several times | Sees the listing of that slab, with its grade and cert |
| Stock keeper | Publishes, reprices or sells out a product | Sees the scanner follow within minutes |
| Stock keeper | Lists a house-stock slab | Writes its grader and cert on the product, so the scanner names that copy |

**Measurement.**

| Signal | Definition | Owner |
| --- | --- | --- |
| Scanner in step | Share of published products the scanner holds with the store's current title, price and stock. Unmeasured; first delivery sets the baseline | Product |

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| What is held | Decided | Every published product; sold out kept and labelled — decided by the owner, 2026-10-13 | Product |
| Sealed boxes | Decided | Held now, recognised once the box detector ships — decided by the owner, 2026-10-13 | Product |
| Slabs | Decided | Resolved to the exact unit: a consigned slab through its inventory item, a house-stock slab through the grader and cert on its shop product — decided by the owner, 2026-10-13 | Product |
| Freshness | Decided | Products every 5 minutes; photos hourly on staging and production; nothing new, nothing done — decided by the owner, 2026-10-13 | Product |
| House-stock slabs | Decided | The stock keeper writes the grader and cert on the shop product; the store reads them — decided by the owner, 2026-10-13 | Product |
| A slab with no known unit | Decided | Held by its card alone, without grade or cert, and counted — decided by the owner, 2026-10-13 | Product |
| Scanning a sealed box | Decided | The scanner's usual "not recognised" hint — decided by the owner, 2026-10-13 | Product |
| Who opens the scanner | Decided | Shop staff, through a link the store hands out; prices are public — decided by the owner, 2026-10-13 | Product |
| ZZZ | Decided | Grade10's store only — decided by the owner, 2026-10-13 | Product |
| Till-only products | Decided | None: every shelf product is published to the store — decided by the owner, 2026-10-13 | Operations |
:::
