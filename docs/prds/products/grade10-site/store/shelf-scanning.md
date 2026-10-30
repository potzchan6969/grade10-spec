---
title: Shelf Scanning
spec: grade10-site/store/shelf-scanning
order: 8
---

Shelf scanning lets a shopkeeper point the card scanner at a product on the
shop's shelf and see what the store sells it as. The scanner opens at the
site's `/scan`; the store keeps what it knows in step with the catalogue.

:::flow{title="From the shop's catalogue to the shelf" diagram="assets/diagrams/store-shelf-scan.svg"}
## A product is published
A stock keeper publishes a product on the shop, or changes its price,
availability or photos — [Catalogue Source](/p/grade10-site/store/product-listing#catalogue-source).
## The store keeps the scanner in step
When its copy of the catalogue moves, the store adds what is new to the
scanner, rewrites what changed, removes what it no longer publishes, and
leaves what matches untouched.
## Inventory names the slab
For a slab, the store reads the grader, grade and cert of the inventory item
the product names.
## The scanner learns the photos
Every two hours the scanner learns the photos it has not seen.
## A shopkeeper points the camera
The shopkeeper opens the scanner's link on a phone and points it at the shelf.
## The product shows
The scanner names the product and shows the store's title, price,
availability and a link to its store page.
:::

## What the Scanner Holds

- 🚧 **Every Published Product** — one item for each product the store
  publishes: card, slab, sealed box, comic and merch, sold out included, gift
  cards excepted
  - **Every Shelf Product Published** — the shop sells nothing on the shelf
    that the store does not publish, so the scanner misses none
- 🚧 **Catalogue Changes** — a product the shop publishes, reprices, sells out,
  brings back or changes the photos of reaches the scanner as the store's own
  copy of the catalogue moves —
  [Catalogue Source](/p/grade10-site/store/product-listing#catalogue-source)
  - **Reported Change** — on the scanner within 6 minutes of the shop's save;
    within 8 on an open scanner
  - **Change Only the Re-Read Finds** — one the shop never reported, found
    when the store reads its whole catalogue again: within 11 minutes of the
    shop's save; within 13 on an open scanner
  - 🚧 **Dropped Product** — a product the store unpublishes or deletes leaves
    the scanner with the next copy
    - 🚧 **Sold Consigned Slab** — the store takes it off its catalogue, so it
      leaves the scanner rather than reading Sold out
  - 🚧 **The Store's Version Wins** — an item changed on the scanner is put back
    to the store's version with the next copy
- 🚧 **Before the Store Opens on Production** — production's scanner holds the
  store's products with their title, price and availability now; the link to
  the store page appears only where the store is carried —
  [Carried Surfaces](/p/grade10-site/site/carried-surfaces)

## Slabs

- **What Makes a Slab** — a consigned product whose item inventory holds with
  a grader, whatever its type; a house-stock product of a graded type. Every
  slab on the shop's shelf is a registered inventory item
  - **Consigned Slab** — known by its consigned item, which inventory holds
    with a grader
  - 🚧 **House-Stock Slab** — the stock keeper writes the slab's label code on
    the product in the shop, naming its inventory item; the store reads the
    grader, grade and cert from inventory, as for a consigned slab
  - **Raw Card** — consigned or not, no slab: recognised by its product photos
- 🚧 **Slab Label** — the scanner reading a slab's label names the one product
  that sells that copy, and the result shows its grade and cert
  - **Graders the Scanner Reads** — PSA, BGS, CGC, SGC and TAG; a PCGS, NGC or
    PMG slab is recognised by its photos
  - **Cert Forms** — 4 to 24 letters, digits or hyphens, for every grader it
    reads
  - **Certs Are Public** — a slab's cert and its house label code are printed
    on the slab, so the scan and the store's catalogue may carry them
- 🚧 **Slab with No Known Unit** — recognised by its product photos alone,
  without grade or cert, and Operations is alerted to each
  - **No Item** — a graded product that names no inventory item
  - **Unread Grader** — its item's grader is one the scanner does not read
  - **Unread Cert** — its cert is in a form the scanner cannot read
  - **Shared Cert** — its cert another product also carries; neither carries it

## Photos

- 🚧 **Photo Run** — every two hours, on staging and on production, the scanner
  learns the photos it has not seen
  - **Photos Learned** — the first 8 of each product, in the shop's order
  - 🚧 **Changed Photos** — a new or replaced photo is learned at the next run;
    a photo the product drops leaves the scanner with it
  - 🚧 **Failed Photos** — a photo that could not be learned is tried again 24
    hours later; a run on another model than the scanner's learns nothing and
    fails, naming both
  - 🚧 **Idle Run** — a run with no new photo costs nothing

## Recognition

- 🚧 **Store Product First** — where a store product's match is one the scanner
  accepts on its own, it is named over the shared card catalogue's same art
- 🚧 **Two Listings of One Art** — where two or more store products match the
  same art about as closely, slab or not, the scan shows each of them, closest
  first, and the shopkeeper picks one; a slab whose label the scanner read is
  named alone, by its cert
- 🚧 **Raw Copy of a Slab-Only Card** — a raw card the store sells only as one
  slab names the slab's product, without grade or cert
- 🚧 **Products Not Yet Recognised** — a sealed box, merch or a comic is held
  now with its title, price and availability, and is recognised once the
  scanner's box detector ships
  - **Scanning One Meanwhile** — shows what the scanner shows for anything it
    does not recognise, "Not recognised yet — hold steady"

## On the Shelf

- 🚧 **Scanner Link** — one fixed link, bookmarked or printed as a QR code;
  it scans only, adds no photos, and shows only what the store shows publicly
  - 🚧 **New Key** — rotating the scanner's key retires the link: the old link
    shows the scanner's usual refusal for a link that no longer works, and the
    shop manager hands out the new QR code
- 🚧 **Scan Result** — the product's title in the store's default language, the
  price a shopper pays for its one item, its availability and a link to its
  store page —
  [Product Status](/p/grade10-site/commerce/product-status#availability)
  - 🚧 **Sale Badge** — while an automatic discount lowers the price; a
    discount that starts or ends reaches the scan with the store's next pass
  - 🚧 **Availability** — Available or Sold out, the shop's for-sale answer
    read as the store reads it; no count
- 🚧 **Open Scanner** — reads its catalogue again every 2 minutes while in view
  and when the shopkeeper returns to it, so it never shows an old price or
  availability for long

:::detail{title="How it works" for="engineer"}
- **Scanner** — a backend service of its own, with its own platform API and
  shared contracts
- **Shelf Pass** — on the store's schedule, compares the store's copy of the
  catalogue with what the scanner holds and writes only the difference
- **Photo Run** — a scheduled job every two hours that teaches the scanner's
  model the photos it has not seen
- **Slab Facts** — grader, grade and cert, read from inventory's items
- **Commerce architecture** — [docs/architecture/commerce.md](https://github.com/9gag/grade10/blob/main/docs/architecture/commerce.md)
:::

:::detail{title="Product decisions" for="pm"}
Shopkeepers need the store's answer for the product in their hand, and the
scanner can only give it if it holds the store's catalogue.

- ❓ **Unmeasured** — the share of published products the scanner holds with the store's current title, price and availability, and graded products held without grade or cert; nothing records them yet. Product and Operations confirm
:::
