---
title: Shelf Scanning
spec: grade10-site/store/shelf-scanning
order: 8
---

Shelf scanning lets a shopkeeper point the card scanner at a product on the
shop's shelf and see what the store sells it as. The scanner opens at the
site's `/scan`; the store keeps what it knows in step with the catalogue.

## Values

| Rule | Value |
| --- | --- |
| What the scanner holds | every product the store publishes, sold out included, gift cards excepted |
| A change the shop reports | on the scanner within 6 minutes of the shop's save; on an open scanner within 8 |
| A change only the store's re-read finds | on the scanner within 11 minutes of the shop's save; on an open scanner within 13 |
| A new photo recognisable | at the next hourly run, on staging and production |
| An open scanner's catalogue | read again every 2 minutes while in view, and when the shopkeeper returns to it |
| Photos learned per product | the first 8, in the shop's order |
| What a scan shows | title in the store's default language, the price the shopper pays, Available or Sold out, a link to the store page |

## What the Scanner Holds

🚧 **Every published product** — each product the store publishes is one item
on the scanner: card, slab, sealed box, comic and merch alike

🚧 **In step with the store's mirror** — a product the shop publishes,
reprices, sells out, brings back or changes the photos of reaches the scanner
as the store's own copy of the catalogue moves —
[Product Data](/p/grade10-site/store/product-listing#product-data)

🚧 **Gone when the store drops it** — a product the store unpublishes or
deletes leaves the scanner with the next copy

🚧 **A sold consigned slab leaves** — the store takes a sold consigned slab
off its catalogue, so it leaves the scanner rather than reading Sold out

🚧 **The store's catalogue wins** — an item changed on the scanner is put back
to the store's version with the next copy

🚧 **On production before the store opens there** — production's scanner holds
the store's products with their title, price and availability now; the link to
the store page appears only where the store is carried —
[Carried Surfaces](/p/grade10-site/site/carried-surfaces)

- **Every shelf product is published** — the shop sells nothing on the shelf
  that the store does not publish, so the scanner misses none

:::flow{title="From the shop's catalogue to the shelf" diagram="assets/diagrams/store-shelf-scan.svg"}
## A product is published
A stock keeper publishes a product on the shop, or changes its price,
availability or photos — [Product Data](/p/grade10-site/store/product-listing#product-data).
## The store keeps the scanner in step
When its copy of the catalogue moves, the store adds what is new to the
scanner, rewrites what changed, removes what it no longer publishes, and
leaves what matches untouched.
## Inventory names the slab
For a slab, the store reads the grader, grade and cert of the inventory item
the product names.
## The scanner learns the photos
Every hour the scanner learns the photos it has not seen.
## A shopkeeper points the camera
The shopkeeper opens the scanner's link on a phone and points it at the shelf.
## The product shows
The scanner names the product and shows the store's title, price,
availability and a link to its store page.
:::

## Slabs

A slab is known by its grader and cert, read from the inventory item its
product names. Every slab on the shop's shelf is a registered inventory item.

| Product | How the store knows its slab |
| --- | --- |
| Consigned slab | the consigned item, which inventory holds with a grader |
| House-stock slab | the label code the stock keeper writes on the product in the shop, naming its inventory item |
| Raw card, consigned or not | no slab: recognised by its product photos |

🚧 **The copy, not only the card** — the scanner reading a slab's label names
the one product that sells that slab, and the result shows its grade and cert

🚧 **House-stock slabs name their item** — a stock keeper writes the slab's
label code on the house-stock product in the shop, and the store reads the
grader, grade and cert from inventory, as for a consigned slab

🚧 **A slab with no known unit** — a graded product that names no item, whose
item's grader the scanner does not read, or whose cert another product also
carries, or whose cert is in a form the scanner cannot read, is recognised
by its product photos alone, without grade or cert;
where two products carry one cert, neither carries it. Operations is alerted to
each

- **What makes a slab** — a consigned product whose item inventory holds with
  a grader, whatever its type; a house-stock product of a graded type
- **Certs are public** — a slab's cert and its house label code are printed on
  the slab, so the scan and the store's catalogue may carry them
- **Graders the scanner does not read** — the scanner reads PSA, BGS, CGC, SGC
  and TAG labels; a PCGS, NGC or PMG slab is recognised by its photos
- **Cert forms** — for every grader it reads, the scanner reads a cert of 4 to
  24 letters, digits or hyphens; a cert in any other form is a slab with no
  known unit

## Recognition

🚧 **A store product wins** — where a store product's match is one the scanner
accepts on its own, it is named over the shared card catalogue's same art

🚧 **Held before they are recognised** — a product the scanner cannot yet
recognise from its photos — a sealed box, merch, a comic — is held now with
its title, price and availability, and is recognised once the scanner's box
detector ships

🚧 **Two listings of one art** — where two or more store products match the
same art about as closely, slab or not, the scan shows each of them, closest
first, and the shopkeeper picks one; a slab whose label the scanner read is
named alone, by its cert

🚧 **A raw copy of a slab-only card** — a raw card the store sells only as one
slab names the slab's product, without grade or cert

- **Scanning it meanwhile** — the scanner shows what it shows for anything it
  does not recognise, "Not recognised yet — hold steady"

## Photos

🚧 **Hourly on both** — the scanner learns new photos every hour on staging
and on production

🚧 **Nothing new, nothing done** — an hour with no new photo costs nothing, and
a product whose details and photos have not moved is not written again

🚧 **Photos change, the item learns again** — a product's new or replaced
photo is learned at the next hourly run; a photo the product drops leaves the
scanner with it

🚧 **Failures wait, never repeat** — a photo that could not be learned is
tried again 24 hours later; a run on another model than the scanner's learns
nothing and fails, naming both

## On the Shelf

🚧 **What a scan shows** — the product's title in the store's default
language, and the price a shopper pays for its one item, with a Sale badge
while an automatic discount lowers it; a discount that starts or ends reaches
the scan with the store's next pass —
[Product Status](/p/grade10-site/commerce/product-status#availability)

🚧 **Available or Sold out** — availability is the shop's for-sale answer, read
as the store reads it; a scan shows no count —
[Product Status](/p/grade10-site/commerce/product-status#availability)

🚧 **An open scanner stays current** — an open scanner refreshes its catalogue
every 2 minutes while in view and when the shopkeeper returns to it, so it
never shows an old price or availability for long

🚧 **One link** — shopkeepers open the scanner from one fixed link, bookmarked
or printed as a QR code; it scans only, adds no photos, and shows only what the
store shows publicly; rotating the scanner's key retires it, the old link shows the
scanner's usual refusal for a link that no longer works, and the shop manager
hands out the new QR code

:::detail{title="Code map" for="engineer"}
- **Scanner** — `apps/backend/grade10/tcg-ar`; its platform API —
  `apps/backend/grade10/tcg-ar/docs/PLATFORM.md`
- **Store's catalogue mirror** — `packages/grade10-store/backend/src/durables/CatalogKeeper/`
- **Store's shelf pass** — `packages/grade10-store/backend/src/services/shelfScan/`
- **Store schedule** — `packages/grade10-store/backend/src/sweeps/cron.ts`
- **Scanner's contracts** — `packages/tcg-ar/contracts` (`@grade10/tcg-ar-contracts`)
- **Photo run** — `.github/workflows/tcg-ar-ops.yml`, job `photos`;
  `apps/backend/grade10/tcg-ar/scripts/process-photos.ts`
- **Slab facts** — inventory items, `packages/inventory/backend/src/db/schema/items.ts`,
  read through `StoreItemSlabs` (`@grade10/inventory-contracts/items`)
- **Commerce architecture** — [docs/architecture/commerce.md](https://github.com/9gag/grade10/blob/main/docs/architecture/commerce.md)
:::

:::detail{title="Product decisions" for="pm"}
Shopkeepers need the store's answer for the product in their hand, and the
scanner can only give it if it holds the store's catalogue.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Shopkeeper | A customer asks about a product on the shelf | Sees its title, price and availability, and can open its store page |
| Shopkeeper | Holds one slab of a card the store lists several times | Sees the listing of that slab, with its grade and cert |
| Stock keeper | Lists a house-stock slab | Writes its label code on the product, so the scanner names that copy |

**Measurement.**

| Signal | Definition | Owner |
| --- | --- | --- |
| Scanner in step | Share of published products the scanner holds with the store's current title, price and availability. Unmeasured; first delivery sets the baseline | Product |
| Slabs without a unit | Graded products held without grade or cert. Alerted to Operations | Operations |

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| What is held | Decided | Every published product but gift cards; sold out kept — decided by the owner, 2026-10-13 | Product |
| Production | Decided | Synced now; the store-page link only where the store is carried — decided by the owner, 2026-10-13 | Product |
| Not yet recognisable | Decided | Sealed boxes, merch and comics held now, recognised once the box detector ships — decided by the owner, 2026-10-13 | Product |
| Slabs | Decided | Resolved to the exact unit through the inventory item the product names — decided by the owner, 2026-10-13 | Product |
| House-stock slabs | Decided | The shop product names its item's label code; grader, grade and cert come from inventory — decided by the owner, 2026-10-13 | Product |
| What makes a slab | Decided | Consigned: its inventory item holds a grader, whatever its type. House stock: a graded collectible type — decided by the round, 2026-10-13 | Product |
| A slab with no known unit | Decided | Recognised by its photos, without grade or cert; Operations alerted — decided by the owner, 2026-10-13 | Product |
| Availability | Decided | Available or Sold out, no count — decided by the owner, 2026-10-13 | Product |
| Freshness | Decided | Follows the store's mirror; photos hourly on staging and production; an open scanner refreshes every few minutes — decided by the owner, 2026-10-13 | Product |
| The link | Decided | One fixed scan-only link, bookmarked or printed; retired by rotating its key — decided by the owner, 2026-10-13 | Product |
| ZZZ | Decided | Grade10's store only — decided by the owner, 2026-10-13 | Product |
| Certs | Decided | A slab's cert and house label code are public, printed on the slab — decided by the owner, 2026-10-13 | Product |
| Two listings of one art | Decided | Each close product shown, slabs included unless a label was read, closest first; the shopkeeper picks — decided by the owner, 2026-10-13 | Product |
| Raw copy of a slab-only card | Decided | Names the slab's product without grade or cert, or offers the pick where another product matches as closely — decided by the owner, 2026-10-13 | Product |
| Retired link | Decided | The usual refusal; the shop manager hands out the new QR code — decided by the owner, 2026-10-13 | Product |
| Discounts | Decided | The price the shopper pays with a Sale badge — decided by the owner, 2026-10-13 | Product |
| Title language | Decided | The store's default — decided by the owner, 2026-10-13 | Product |
:::
