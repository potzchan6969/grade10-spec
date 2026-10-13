## Purpose

How the card scanner at the grade10 site's `/scan` holds every product the
grade10 store publishes, in step with the store's copy of the shop's
catalogue, and what a shopkeeper sees when they scan a product on the shop's
shelf: the store's title, price and availability, a link to its store page,
and for a slab the one product that sells it, with its grade and cert.

Availability is `grade10-site/commerce/product-status`'s answer; which builds
carry the store page is `grade10-site/site/carried-surfaces`'s.

## Feature set

- Catalogue held in step
  - Every published product: each product the store publishes but gift cards
    is one item on the scanner, card, slab, sealed box, comic and merch alike
  - Following the store's mirror: a change the shop reports reaches the
    scanner within 5 minutes, and one only the store's re-read finds within 10
  - Sold out stays: a sold-out product stays on the scanner and reads Sold out
  - Dropped products leave: a product the store unpublishes or deletes leaves
    with the next copy
  - Sold consigned slab leaves: the store takes it off its catalogue, so it
    leaves rather than reading Sold out
  - Store's version wins: an item changed on the scanner is put back to the
    store's version with the next copy
  - Unchanged products untouched: a product whose details and photos have not
    moved is not written again
  - Production before the store: production's scanner holds title, price and
    availability before the store opens there
- Slab as its copy
  - Label names its product: the scanner reading a slab's label names the one
    product that sells that slab
  - Grade and cert from inventory: read from the inventory item the product
    names, for a consigned and a house-stock slab alike
  - House-stock label code: a stock keeper writes the slab's label code on the
    house-stock product, naming its inventory item
  - Slab with no known unit: a graded product naming no item, one whose
    grader the scanner does not read, or one whose cert another product
    carries is recognised by its photos without grade or cert, and Operations
    is alerted
  - Graders read: PSA, BGS, CGC, SGC and TAG labels; a PCGS, NGC or PMG slab
    is recognised by its photos
- Recognition order
  - Store product first: where a store product and the shared card catalogue
    match the same art, the scanner names the store product
  - Held before recognisable: a sealed box, merch or a comic carries its
    title, price and availability now, and is recognised once the box detector
    ships
  - Not recognised yet: scanning a product the scanner cannot recognise shows
    what it shows for anything unknown
- Hourly photo learning
  - Hourly on both: the scanner learns new photos every hour on staging and on
    production
  - Idle hour costs nothing: an hour with no new photo does no work
  - Photos change, item relearns: a new or replaced photo is learned at the
    next hourly run, and a dropped photo leaves the scanner
- What a scan shows
  - Store's title and price: what the product page shows, its title and the
    price of its one item with automatic discounts
  - Available or Sold out: the shop's for-sale answer, with no count
  - Store page link: opens the product's store page, shown only where the
    store is carried
  - Open scanner stays current: an open scanner refreshes its catalogue every
    few minutes and when the shopkeeper returns to it
- Shop's scanner link
  - One fixed link: shopkeepers open the scanner from one link, bookmarked or
    printed as a QR code, without signing in
  - Scan only: the link adds no photos and shows only what the store shows
    publicly
  - Retired by its key: rotating the scanner's key retires the link

## ADDED Requirements

### Requirement: The scanner holds every published store product

The scanner SHALL hold one item for each product in the store's copy of the
shop's catalogue, card, slab, sealed box, comic and merch alike, except a gift
card, and SHALL hold no other item for the store. A product missing from the
copy SHALL leave the scanner with the next copy that reaches it. A change the
store's copy takes from the shop's report SHALL reach the scanner within 5
minutes of the copy taking it; a change only the store's re-read of the whole
catalogue finds SHALL reach it within 10 minutes. The store's copy SHALL
decide every field: an item changed on the scanner SHALL be put back with the
next copy, and an item whose fields and photos match the copy SHALL NOT be
written again.

| Field | Value |
| --- | --- |
| Title | The product's title, in the store's default language |
| Price | What a shopper pays for its one item, the shop's automatic discounts taken off, in minor units of the store's currency |
| Sale | A `Sale` badge while an automatic discount lowers the price |
| Availability | `Available` when the shop offers any of its variants for sale, else `Sold out`; never a count |
| Store page | The product's store page, only in a build that carries the store |
| Grade and cert | The unit's grader, grade and cert, only for a slab whose unit is known |
| Photos | The product's first 8 photos, in the shop's order |

#### Scenario: g10.store-shelf-scanning.SC1 - A published product becomes one item
**Serves:** g10.store-shelf-scanning.US1 - the shopkeeper scans a sealed box the shop has just listed

- **GIVEN** the store publishes a booster box priced 98000 HKD minor units,
  for sale, with no automatic discount running
- **WHEN** the store's copy holds it and the next copy reaches the scanner
- **THEN** the scanner holds one item for it, titled as the product, priced
  98000 HKD minor units and reading `Available`

#### Scenario: g10.store-shelf-scanning.SC2 - A gift card is not held
**Serves:** `Catalogue held in step` - the store copies its catalogue and passes over what is never on the shelf

- **GIVEN** the store publishes a gift card
- **WHEN** the next copy reaches the scanner
- **THEN** the scanner holds no item for it

#### Scenario: g10.store-shelf-scanning.SC3 - A sold-out product stays and reads Sold out
**Serves:** g10.store-shelf-scanning.US4 - the shopkeeper scans a product the shop has sold out of

- **GIVEN** the scanner holds a product reading `Available`
- **WHEN** the shop stops offering every variant of it for sale and the next
  copy reaches the scanner
- **THEN** the scanner still holds the item, with its title and price, and it
  reads `Sold out`

#### Scenario: g10.store-shelf-scanning.SC4 - A product the store drops leaves
**Serves:** `Catalogue held in step` - the store's copy decides what the scanner holds

- **GIVEN** the scanner holds a product
- **WHEN** the store unpublishes or deletes it and the next copy reaches the
  scanner
- **THEN** the scanner no longer holds the item or its photos

#### Scenario: g10.store-shelf-scanning.SC5 - A sold consigned slab leaves
**Serves:** `Catalogue held in step` - a consigned sale takes the slab off the store and so off the scanner

- **GIVEN** the scanner holds a consigned slab
- **WHEN** the slab sells and the store takes its product off the catalogue
- **THEN** the scanner no longer holds the item, rather than reading it
  `Sold out`

#### Scenario: g10.store-shelf-scanning.SC6 - An item changed on the scanner is put back
**Serves:** `Catalogue held in step` - nobody edits the store's items anywhere but the shop

- **GIVEN** someone changes a store item's title or price on the scanner
- **WHEN** the next copy reaches the scanner
- **THEN** the item carries the store's title and price again

#### Scenario: g10.store-shelf-scanning.SC7 - An unchanged product is not written again
**Serves:** `Catalogue held in step` - every copy reaches the scanner, and only what moved is written

- **GIVEN** the scanner holds a product whose fields and photos match the
  store's copy
- **WHEN** the next copy reaches the scanner
- **THEN** the scanner records no change to the item, queues no photo for it
  and publishes no new version of the store's items

#### Scenario: g10.store-shelf-scanning.SC8 - A reported change reaches the scanner within 5 minutes
**Serves:** g10.store-shelf-scanning.US1 - the shopkeeper never quotes a price the store has since changed

- **GIVEN** the scanner holds a product priced 120000 HKD minor units
- **WHEN** a stock keeper reprices it to 110000 HKD minor units in the shop
  and the store's copy takes the shop's report
- **THEN** within 5 minutes of the copy taking it, the scanner's item is
  priced 110000 HKD minor units

#### Scenario: g10.store-shelf-scanning.SC9 - A change only the re-read finds reaches the scanner within 10 minutes
**Serves:** g10.store-shelf-scanning.US1 - a change the shop never reported still reaches the shelf

- **GIVEN** the shop changes a product's price without reporting it
- **WHEN** the store's next re-read of the whole catalogue finds the change
- **THEN** within 10 minutes of the change, the scanner's item carries the
  new price

#### Scenario: g10.store-shelf-scanning.SC10 - Production holds the store's products before the store opens there
**Serves:** g10.store-shelf-scanning.US1 - the shop floor scans on production while production carries no store

- **GIVEN** production's build does not carry the store
- **WHEN** the store's copy reaches production's scanner
- **THEN** production's scanner holds every published product with its title,
  price and availability
- **AND** no item carries a store page

### Requirement: A slab names its own unit

A graded product's unit SHALL be the inventory item the product names: for a
consigned product, its consigned item; for a house-stock product, the item
whose label code a stock keeper writes on the product in the shop. A graded
product is a consigned product, or one whose collectible type is a graded one.
The store SHALL read the unit's grader, grade and cert from inventory for
every copy it sends, and the item SHALL carry the grader and cert the scanner
matches a slab's label to, and show the grade and cert. A graded product with
no known unit SHALL be held with its other fields and its photos, without
grader, grade or cert, and Operations SHALL be alerted to it.

| No known unit | When |
| --- | --- |
| Names no item | The product names no item, or one inventory does not hold as a live slab |
| Grader not read | The item's grader is PCGS, NGC or PMG; the scanner reads PSA, BGS, CGC, SGC and TAG |
| Unit carried twice | Two products name one item, or one grader and cert; neither carries it |
| Cert not read | The item's cert is not 4 to 24 letters, digits or hyphens |

#### Scenario: g10.store-shelf-scanning.SC11 - A consigned slab's label names its product
**Serves:** g10.store-shelf-scanning.US3 - the shopkeeper scans a consigned slab of a card the store lists several times

- **GIVEN** the store sells two consigned PSA 10 slabs of one card, their
  items holding certs 126956765 and 126956766
- **WHEN** the shopkeeper scans the slab whose label reads 126956765
- **THEN** the scanner names that slab's product, with its own price
- **AND** shows grade PSA 10 and cert 126956765

#### Scenario: g10.store-shelf-scanning.SC12 - A house-stock slab named by its label code
**Serves:** g10.store-shelf-scanning.US6 - the stock keeper writes the label code and the slab becomes its own listing

- **GIVEN** a house-stock CGC slab registered in inventory with a label code,
  grade 9.5 and cert 4123456001, and its product in the shop naming no item
- **WHEN** a stock keeper writes the slab's label code on the product and the
  next copy reaches the scanner
- **THEN** scanning that slab names the product and shows grade CGC 9.5 and
  cert 4123456001

#### Scenario: g10.store-shelf-scanning.SC13 - A correction in inventory reaches the scanner
**Serves:** `Slab as its copy` - the store reads the unit's facts afresh for every copy

- **GIVEN** the scanner holds a slab with grade 9 from its inventory item
- **WHEN** inventory corrects the item's grade to 10 and the next copy reaches
  the scanner, the product unchanged in the shop
- **THEN** the item shows grade 10

#### Scenario: g10.store-shelf-scanning.SC14 - A graded product naming no item
**Serves:** `Slab as its copy` - a slab nobody linked to inventory is still sold and still found

- **GIVEN** a house-stock product whose collectible type is a graded card and
  which names no item
- **WHEN** the next copy reaches the scanner
- **THEN** the scanner holds it with its title, price, availability and
  photos, and no grade or cert
- **AND** Operations is alerted to a slab held without a unit

#### Scenario: g10.store-shelf-scanning.SC15 - A slab whose grader the scanner does not read
**Serves:** `Slab as its copy` - a PCGS, NGC or PMG slab is found by its photos

- **GIVEN** a consigned product whose item is an NGC slab
- **WHEN** the next copy reaches the scanner
- **THEN** the scanner holds it without grade or cert, recognised by its
  photos
- **AND** Operations is alerted to a slab held without a unit

#### Scenario: g10.store-shelf-scanning.SC16 - Two products carry one cert
**Serves:** `Slab as its copy` - a unit carried twice names no product rather than the wrong one

- **GIVEN** two products name one item, or two items with the same grader
  and cert
- **WHEN** the next copy reaches the scanner
- **THEN** neither item carries the grader or cert, and scanning that slab's
  label names neither product by its cert
- **AND** Operations is alerted to both

#### Scenario: g10.store-shelf-scanning.SC34 - A cert the scanner cannot read
**Serves:** `Slab as its copy` - a cert in another form is held like a grader the scanner does not read

- **GIVEN** a consigned product whose item's cert is 30 characters long
- **WHEN** the next copy reaches the scanner
- **THEN** the scanner holds it without grade or cert, recognised by its
  photos
- **AND** Operations is alerted to a slab held without a unit

### Requirement: A store product is named before the shared card catalogue

Where a store product and the scanner's shared card catalogue both match what
the camera sees, and the store product's match is one the scanner accepts on
its own, the scanner SHALL name the store product. Where two or more store
products that are not slabs match one art about as closely, the scan SHALL
show each of them, closest first, and the shopkeeper SHALL pick one; a scan
with one close match SHALL show it directly. A slab's grade and cert SHALL
show only when the scanner read its label, so a raw copy of a card the store
sells only as a slab SHALL name the slab's product without them. A product the scanner
cannot yet recognise from its photos SHALL still be held with its title,
price and availability, and scanning it SHALL show what the scanner shows for
anything it does not recognise.

#### Scenario: g10.store-shelf-scanning.SC17 - The store product wins over the catalogue card
**Serves:** g10.store-shelf-scanning.US1 - the shopkeeper scans a raw card the store sells

- **GIVEN** the scanner has learned a store product's photo of a raw card,
  and the same card is in the shared card catalogue
- **WHEN** the shopkeeper scans that card
- **THEN** the scanner names the store product, with the store's title, price
  and availability, and not the catalogue card and its market price

#### Scenario: g10.store-shelf-scanning.SC18 - A sealed box is held before it is recognisable
**Serves:** `Recognition order` - the store sends every kind now so the box detector needs no second sync

- **GIVEN** the store publishes a sealed box, a comic and a piece of merch
- **WHEN** the next copy reaches the scanner
- **THEN** the scanner holds each with its title, price, availability and
  photos

#### Scenario: g10.store-shelf-scanning.SC19 - Scanning a product the scanner cannot recognise
**Serves:** g10.store-shelf-scanning.US1 - the shopkeeper points the camera at a sealed box

- **GIVEN** the scanner holds a sealed box it cannot recognise from its photos
- **WHEN** the shopkeeper scans the box
- **THEN** the scanner shows "Not recognised yet — hold steady", as for
  anything it does not recognise

#### Scenario: g10.store-shelf-scanning.SC35 - One close match shows directly
**Serves:** `g10.store-shelf-scanning.US1`, `Recognition order` - the shopkeeper scans a card the store lists once

- **GIVEN** the store sells one raw listing of a card
- **WHEN** the shopkeeper scans that card
- **THEN** the scan shows that product's title, price and availability, with
  no choice to make

#### Scenario: g10.store-shelf-scanning.SC36 - Two listings of one art are both shown
**Serves:** `g10.store-shelf-scanning.US1`, `Recognition order` - the shopkeeper scans a card the store lists twice, say in two languages

- **GIVEN** the store sells two raw listings whose photos show the same art,
  and the scanner matches the card in view to both about as closely
- **WHEN** the shopkeeper scans that card
- **THEN** the scan names the closest listing and says 2 matches
- **AND** opening it lists both listings, closest first, each with its title,
  price and availability

#### Scenario: g10.store-shelf-scanning.SC37 - The shopkeeper picks one listing
**Serves:** `g10.store-shelf-scanning.US1`, `Recognition order` - the shopkeeper chooses the listing in their hand

- **GIVEN** the scan lists two listings of one art
- **WHEN** the shopkeeper picks the second
- **THEN** the scan shows that listing's title, price, availability and, in a
  build that carries the store, its store page link

#### Scenario: g10.store-shelf-scanning.SC38 - The shopkeeper dismisses the list
**Serves:** `g10.store-shelf-scanning.US1`, `Recognition order` - the shopkeeper goes back to scanning without choosing

- **GIVEN** the scan lists two listings of one art
- **WHEN** the shopkeeper dismisses the list
- **THEN** the camera view returns with no listing chosen

#### Scenario: g10.store-shelf-scanning.SC39 - A raw copy of a card sold only as a slab
**Serves:** `g10.store-shelf-scanning.US1`, `Recognition order` - the shopkeeper scans a raw card the store sells only graded

- **GIVEN** the store sells a card only as a PSA 10 slab, and no listing of it
  raw
- **WHEN** the shopkeeper scans a raw copy of that card
- **THEN** the scan names the slab's product with its title, price and
  availability
- **AND** shows no grade and no cert

### Requirement: The scanner learns new photos every hour

The scanner SHALL learn the photos it has not yet learned every hour, on
staging and on production, with the model the deployed scanner runs.

| Rule | Value |
| --- | --- |
| Run | Every hour, on staging and production |
| An hour with no photo to learn | No work beyond checking |
| A photo that could not be learned | Tried again 24 hours after the failure |
| The run's model differs from the scanner's | Nothing learned; the run fails |

#### Scenario: g10.store-shelf-scanning.SC20 - A new photo is learned within the hour on production
**Serves:** `Hourly photo learning` - the store adds a photo and the shelf recognises it

- **GIVEN** a product on production gains a photo
- **WHEN** the next copy reaches production's scanner
- **THEN** within the hour after, the scanner recognises the product from
  that photo

#### Scenario: g10.store-shelf-scanning.SC21 - An hour with nothing new does no work
**Serves:** `Hourly photo learning` - the hourly run checks and stops

- **GIVEN** no photo is waiting to be learned
- **WHEN** the hourly run starts
- **THEN** it checks once and stops without preparing to learn anything

#### Scenario: g10.store-shelf-scanning.SC22 - A replaced photo is learned again and a dropped one leaves
**Serves:** `Hourly photo learning` - the scanner follows the product's photos

- **GIVEN** the scanner has learned a product's two photos
- **WHEN** the shop replaces one photo and removes the other, and the next
  copy reaches the scanner
- **THEN** the removed photo no longer recognises the product
- **AND** the new photo is learned at the next hourly run

#### Scenario: g10.store-shelf-scanning.SC40 - A product with more than 8 photos
**Serves:** `Hourly photo learning` - the scanner learns what an item can hold

- **GIVEN** a product with 10 photos
- **WHEN** the next copy reaches the scanner and the hourly run has passed
- **THEN** the scanner recognises the product from its first 8 photos in the
  shop's order, and not from the last 2

#### Scenario: g10.store-shelf-scanning.SC23 - A photo that failed is tried again after 24 hours
**Serves:** `Hourly photo learning` - a photo that could not be fetched once is not lost for good

- **GIVEN** a product photo could not be learned
- **WHEN** 24 hours have passed since the failure
- **THEN** the next hourly run tries it again

#### Scenario: g10.store-shelf-scanning.SC24 - A run with another model learns nothing
**Serves:** `Hourly photo learning` - a run never relearns the same photos every hour

- **GIVEN** the hourly run's model differs from the one the scanner runs
- **WHEN** the run starts
- **THEN** it learns no photo and the run fails, naming both models

### Requirement: A scan shows the store's answer

When the scanner names a store product, it SHALL show the item's title, its
price, `Available` or `Sold out`, and, in a build that carries the store, a
link that opens the product's store page; for a slab whose unit is known,
read from its label, it SHALL also show the grade and cert. It SHALL show a
`Sale` badge while an automatic discount lowers the price, and the price and
badge SHALL follow a discount that starts or ends within 5 minutes. An open
scanner SHALL read its catalogue again every 2 minutes while it is in view,
and at once when the shopkeeper returns to it.

#### Scenario: g10.store-shelf-scanning.SC25 - The price is the product page's
**Serves:** g10.store-shelf-scanning.US1 - the shopkeeper quotes what a customer pays online

- **GIVEN** a product with two variants, the first sold out at 150000 HKD
  minor units and the second for sale at 120000 HKD minor units, and an
  automatic discount of 10% off every item with no minimum
- **WHEN** the shopkeeper scans it
- **THEN** the scanner shows 108000 HKD minor units, a `Sale` badge and
  `Available`

#### Scenario: g10.store-shelf-scanning.SC26 - No count is shown
**Serves:** g10.store-shelf-scanning.US4 - the shopkeeper reads whether the product can be bought, not how many are left

- **GIVEN** the shop holds 3 of a product for sale
- **WHEN** the shopkeeper scans it
- **THEN** the scanner shows `Available` and no number of units

#### Scenario: g10.store-shelf-scanning.SC27 - The link opens the store page
**Serves:** g10.store-shelf-scanning.US2 - the shopkeeper shows the customer the product online

- **GIVEN** a build that carries the store
- **WHEN** the shopkeeper scans a product and opens its link
- **THEN** the product's store page opens

#### Scenario: g10.store-shelf-scanning.SC28 - No link where the store is not carried
**Serves:** g10.store-shelf-scanning.US2 - the shopkeeper is never sent to a page the build does not have

- **GIVEN** a build that does not carry the store
- **WHEN** the shopkeeper scans a product
- **THEN** the scanner shows its title, price and availability and no link

#### Scenario: g10.store-shelf-scanning.SC29 - An open scanner reads its catalogue again
**Serves:** g10.store-shelf-scanning.US1 - a scanner left open all day never shows an old price for long

- **GIVEN** a scanner open on the shop floor, and a product repriced since it
  opened
- **WHEN** the scanner's item carries the new price and 2 minutes pass with
  the scanner in view, or the shopkeeper returns to the scanner from another
  app
- **THEN** scanning the product shows the new price, without reopening the
  link

#### Scenario: g10.store-shelf-scanning.SC33 - A discount that starts reaches the scan
**Serves:** g10.store-shelf-scanning.US1 - a sale the shop starts shows on the shelf without any product changing

- **GIVEN** the scanner holds a product at 120000 HKD minor units with no
  discount running
- **WHEN** the shop starts an automatic discount of 10% off every item with
  no minimum
- **THEN** within 5 minutes the scan shows 108000 HKD minor units with a
  `Sale` badge
- **AND** once the discount ends, within 5 minutes it shows 120000 HKD minor
  units and no badge

### Requirement: Shopkeepers open the scanner from one fixed link

Each of staging and production SHALL have one fixed scanner link for the
shop: the hosted scanner with the project's public key, searching the store's
items. It SHALL open without signing in, from outside the company's access
wall, SHALL scan only, adding no photos, and SHALL stop working when its key
is rotated.

#### Scenario: g10.store-shelf-scanning.SC30 - The link opens the scanner without sign-in
**Serves:** g10.store-shelf-scanning.US7 - the shopkeeper opens the bookmarked link on a shop phone

- **GIVEN** a phone signed in to nothing and outside the company's access
  wall
- **WHEN** the shopkeeper opens the shop's scanner link
- **THEN** the scanner opens and names the store's products

#### Scenario: g10.store-shelf-scanning.SC31 - The link adds no photos
**Serves:** g10.store-shelf-scanning.US7 - the link can only scan

- **GIVEN** the scanner opened from the shop's link
- **WHEN** anyone tries to add a photo to an item through it
- **THEN** the scanner offers no way to, and the service refuses a photo sent
  with the link's key

#### Scenario: g10.store-shelf-scanning.SC32 - Rotating the key retires the link
**Serves:** g10.store-shelf-scanning.US7 - the shop replaces a link that has leaked

- **GIVEN** an operator issues a new key and revokes the link's key
- **WHEN** anyone opens the old link
- **THEN** the scanner does not open, and shows its usual refusal for a link
  that no longer works
- **AND** a link with the new key opens it
