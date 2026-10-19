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
    scanner within 6 minutes, and one only the store's re-read finds within 11
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
  - Graded product: a consigned product whose item inventory holds with a
    grader, or a house-stock product of a graded collectible type
  - Slab with no known unit: a graded product naming no item, one whose
    grader the scanner does not read, or one whose cert another product
    carries is recognised by its photos without grade or cert, and Operations
    is alerted
  - Graders read: PSA, BGS, CGC, SGC and TAG labels; a PCGS, NGC or PMG slab
    is recognised by its photos
- Recognition order
  - Store product first: where a store product and the shared card catalogue
    match the same art, and the store product's match is one the scanner
    accepts on its own, the scanner names the store product
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
    2 minutes and when the shopkeeper returns to it
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
shop reports SHALL reach the scanner within 6 minutes of the shop's save; a
change only the store's re-read of the whole catalogue finds SHALL reach it
within 11 minutes of the save. The store's copy SHALL
decide every field: an item changed on the scanner SHALL be put back with the
next copy, and an item whose fields and photos match the copy SHALL NOT be
written again. An item SHALL follow its product: a product whose handle
changes SHALL keep its one item, and the item's store page SHALL follow the
new handle.

| Field | Value |
| --- | --- |
| Title | The product's title, in the store's default language |
| Price | What a shopper pays for its one item, the shop's automatic discounts taken off, in minor units of the store's currency |
| Sale | A `Sale` badge while an automatic discount lowers the price |
| Availability | `Available` when the shop offers any of its variants for sale, else `Sold out`; never a count |
| Store page | The product's store page, only in a build that carries the store |
| Grade and cert | The unit's grader, grade and cert, only for a slab whose unit is known |
| Photos | The product's first 8 photos, in the shop's order |

<!-- trace:scenario id=g10.store-shelf-scanning.SC-dan rev=1 -->
#### Scenario: g10.store-shelf-scanning.SC1 - A published product becomes one item
**Serves:** g10.store-shelf-scanning.US1 - the shopkeeper scans a sealed box the shop has just listed

- **GIVEN** the store publishes a booster box priced 98000 HKD minor units,
  for sale, with no automatic discount running
- **WHEN** the store's copy holds it and the next copy reaches the scanner
- **THEN** the scanner holds one item for it, titled as the product, priced
  98000 HKD minor units and reading `Available`

<!-- trace:scenario id=g10.store-shelf-scanning.SC-icy rev=1 -->
#### Scenario: g10.store-shelf-scanning.SC2 - A gift card is not held
**Serves:** `Catalogue held in step` - the store copies its catalogue and passes over what is never on the shelf

- **GIVEN** the store publishes a gift card
- **WHEN** the next copy reaches the scanner
- **THEN** the scanner holds no item for it

<!-- trace:scenario id=g10.store-shelf-scanning.SC-c6s rev=1 -->
#### Scenario: g10.store-shelf-scanning.SC3 - A sold-out product stays and reads Sold out
**Serves:** g10.store-shelf-scanning.US4 - the shopkeeper scans a product the shop has sold out of

- **GIVEN** the scanner holds a product reading `Available`
- **WHEN** the shop stops offering every variant of it for sale and the next
  copy reaches the scanner
- **THEN** the scanner still holds the item, with its title and price, and it
  reads `Sold out`

<!-- trace:scenario id=g10.store-shelf-scanning.SC-9kw rev=1 -->
#### Scenario: g10.store-shelf-scanning.SC4 - A product the store drops leaves
**Serves:** `Catalogue held in step` - the store's copy decides what the scanner holds

- **GIVEN** the scanner holds a product
- **WHEN** the store unpublishes or deletes it and the next copy reaches the
  scanner
- **THEN** the scanner no longer holds the item or its photos

<!-- trace:scenario id=g10.store-shelf-scanning.SC-9xz rev=1 -->
#### Scenario: g10.store-shelf-scanning.SC5 - A sold consigned slab leaves
**Serves:** `Catalogue held in step` - a consigned sale takes the slab off the store and so off the scanner

- **GIVEN** the scanner holds a consigned slab
- **WHEN** the slab sells and the store takes its product off the catalogue
- **THEN** the scanner no longer holds the item, rather than reading it
  `Sold out`

<!-- trace:scenario id=g10.store-shelf-scanning.SC-r9i rev=1 -->
#### Scenario: g10.store-shelf-scanning.SC6 - An item changed on the scanner is put back
**Serves:** `Catalogue held in step` - nobody edits the store's items anywhere but the shop

- **GIVEN** someone changes a store item's title or price on the scanner
- **WHEN** the next copy reaches the scanner
- **THEN** the item carries the store's title and price again

<!-- trace:scenario id=g10.store-shelf-scanning.SC-fd7 rev=1 -->
#### Scenario: g10.store-shelf-scanning.SC7 - An unchanged product is not written again
**Serves:** `Catalogue held in step` - every copy reaches the scanner, and only what moved is written

- **GIVEN** the scanner holds a product whose fields and photos match the
  store's copy
- **WHEN** the next copy reaches the scanner
- **THEN** the scanner records no change to the item, queues no photo for it
  and publishes no new version of the store's items

<!-- trace:scenario id=g10.store-shelf-scanning.SC-9ha rev=1 -->
#### Scenario: g10.store-shelf-scanning.SC8 - A reported change reaches the scanner within 6 minutes
**Serves:** g10.store-shelf-scanning.US1 - the shopkeeper never quotes a price the store has since changed

- **GIVEN** the scanner holds a product priced 120000 HKD minor units
- **WHEN** a stock keeper saves a price of 110000 HKD minor units in the
  shop, and the shop reports the change
- **THEN** within 6 minutes of the save, the scanner's item is priced 110000
  HKD minor units
- **AND** within 8 minutes of the save, a scanner left open and in view shows
  110000 HKD minor units

<!-- trace:scenario id=g10.store-shelf-scanning.SC-0a3 rev=1 -->
#### Scenario: g10.store-shelf-scanning.SC9 - A change only the re-read finds reaches the scanner within 11 minutes
**Serves:** g10.store-shelf-scanning.US1 - a change the shop never reported still reaches the shelf

- **GIVEN** the shop changes a product's price without reporting it
- **WHEN** the store's next re-read of the whole catalogue finds the change
- **THEN** within 11 minutes of the shop's save, the scanner's item carries
  the new price
- **AND** within 13 minutes of the save, a scanner left open and in view shows
  it

<!-- trace:scenario id=g10.store-shelf-scanning.SC-t17 rev=1 -->
#### Scenario: g10.store-shelf-scanning.SC10 - Production holds the store's products before the store opens there
**Serves:** g10.store-shelf-scanning.US1 - the shop floor scans on production while production carries no store

- **GIVEN** production's build does not carry the store
- **WHEN** the store's copy reaches production's scanner
- **THEN** production's scanner holds every published product with its title,
  price and availability
- **AND** no item carries a store page

<!-- trace:scenario id=g10.store-shelf-scanning.SC-3fz rev=1 -->
#### Scenario: g10.store-shelf-scanning.SC44 - The title is in the store's default language
**Serves:** g10.store-shelf-scanning.US1 - the shopkeeper reads one title whatever the phone's language

- **GIVEN** a product whose Traditional and Simplified Chinese titles differ
  from its title in the store's default language
- **WHEN** a shopkeeper whose phone is set to Traditional or Simplified
  Chinese scans it
- **THEN** the scan shows the product's title in the store's default language

<!-- trace:scenario id=g10.store-shelf-scanning.SC-80a rev=1 -->
#### Scenario: g10.store-shelf-scanning.SC45 - A product whose handle changes keeps its one item
**Serves:** g10.store-shelf-scanning.US2 - the link never opens a store page the product has left

- **GIVEN** the scanner holds a product, in a build that carries the store
- **WHEN** a stock keeper changes the product's handle in the shop and the
  next copy reaches the scanner
- **THEN** the scanner holds one item for the product, whose store page link
  opens the product's page at its new handle

### Requirement: A slab names its own unit

A graded product's unit SHALL be the inventory item the product names: for a
consigned product, its consigned item; for a house-stock product, the item
whose label code a stock keeper writes on the product in the shop. A graded
product is a consigned product whose item inventory holds with a grader, or a
house-stock product whose collectible type is a graded one. Any other
consigned product, whatever its collectible type, SHALL be held as a raw card,
recognised by its photos, and SHALL NOT alert Operations.
The store SHALL read the unit's grader, grade and cert from inventory for
every copy it sends, and the item SHALL carry the grader and cert the scanner
matches a slab's label to, and show the grade and cert. A graded product with
no known unit SHALL be held with its other fields and its photos, without
grader, grade or cert, and Operations SHALL be alerted to it; the alert SHALL
clear once a copy holds no graded product without a known unit. The scanner
SHALL read a cert of 4 to 24 letters, digits or hyphens from every grader it
reads; a cert in any other form SHALL leave the product without a known unit.

| No known unit | When |
| --- | --- |
| Names no item | A house-stock product names no item, or one inventory does not hold as a live slab |
| Grader not read | The item's grader is PCGS, NGC or PMG; the scanner reads PSA, BGS, CGC, SGC and TAG |
| Unit carried twice | Two products name one item, or one grader and cert; neither carries it |
| Cert not read | The item's grader is one the scanner reads, and its cert is not 4 to 24 letters, digits or hyphens |

<!-- trace:scenario id=g10.store-shelf-scanning.SC-qhd rev=1 -->
#### Scenario: g10.store-shelf-scanning.SC11 - A consigned slab's label names its product
**Serves:** g10.store-shelf-scanning.US3 - the shopkeeper scans a consigned slab of a card the store lists several times

- **GIVEN** the store sells two consigned PSA 10 slabs of one card, their
  items holding certs 126956765 and 126956766
- **WHEN** the shopkeeper scans the slab whose label reads 126956765
- **THEN** the scanner names that slab's product, with its own price
- **AND** shows grade PSA 10 and cert 126956765

<!-- trace:scenario id=g10.store-shelf-scanning.SC-l0k rev=1 -->
#### Scenario: g10.store-shelf-scanning.SC12 - A house-stock slab named by its label code
**Serves:** g10.store-shelf-scanning.US6 - the stock keeper writes the label code and the slab becomes its own listing

- **GIVEN** a house-stock CGC slab registered in inventory with a label code,
  grade 9.5 and cert 4123456001, and its product in the shop naming no item
- **WHEN** a stock keeper writes the slab's label code on the product and the
  next copy reaches the scanner
- **THEN** scanning that slab names the product and shows grade CGC 9.5 and
  cert 4123456001

<!-- trace:scenario id=g10.store-shelf-scanning.SC-y2o rev=1 -->
#### Scenario: g10.store-shelf-scanning.SC13 - A correction in inventory reaches the scanner
**Serves:** `Slab as its copy` - the store reads the unit's facts afresh for every copy

- **GIVEN** the scanner holds a slab with grade 9 from its inventory item
- **WHEN** inventory corrects the item's grade to 10 and the next copy reaches
  the scanner, the product unchanged in the shop
- **THEN** the item shows grade 10

<!-- trace:scenario id=g10.store-shelf-scanning.SC-66m rev=1 -->
#### Scenario: g10.store-shelf-scanning.SC14 - A graded product naming no item
**Serves:** `Slab as its copy` - a slab nobody linked to inventory is still sold and still found

- **GIVEN** a house-stock product whose collectible type is a graded card and
  which names no item
- **WHEN** the next copy reaches the scanner
- **THEN** the scanner holds it with its title, price, availability and
  photos, and no grade or cert
- **AND** Operations is alerted to a slab held without a unit

<!-- trace:scenario id=g10.store-shelf-scanning.SC-j9i rev=1 -->
#### Scenario: g10.store-shelf-scanning.SC15 - A slab whose grader the scanner does not read
**Serves:** `Slab as its copy` - a PCGS, NGC or PMG slab is found by its photos

- **GIVEN** a consigned product whose item is an NGC slab
- **WHEN** the next copy reaches the scanner
- **THEN** the scanner holds it without grade or cert, recognised by its
  photos
- **AND** Operations is alerted to a slab held without a unit

<!-- trace:scenario id=g10.store-shelf-scanning.SC-6to rev=1 -->
#### Scenario: g10.store-shelf-scanning.SC16 - Two products carry one cert
**Serves:** `Slab as its copy` - a unit carried twice names no product rather than the wrong one

- **GIVEN** two products name one item, or two items with the same grader
  and cert
- **WHEN** the next copy reaches the scanner
- **THEN** neither item carries the grader or cert, and scanning that slab's
  label names neither product by its cert
- **AND** Operations is alerted to both

<!-- trace:scenario id=g10.store-shelf-scanning.SC-2ly rev=1 -->
#### Scenario: g10.store-shelf-scanning.SC34 - A cert the scanner cannot read
**Serves:** `Slab as its copy` - a cert in another form is held like a grader the scanner does not read

- **GIVEN** a consigned product whose item is a PSA slab with a cert 30
  characters long
- **WHEN** the next copy reaches the scanner
- **THEN** the scanner holds it without grade or cert, recognised by its
  photos
- **AND** Operations is alerted to a slab held without a unit

<!-- trace:scenario id=g10.store-shelf-scanning.SC-0gv rev=1 -->
#### Scenario: g10.store-shelf-scanning.SC46 - A BGS, SGC or TAG slab is named by its label
**Serves:** g10.store-shelf-scanning.US3 - every grader the scanner reads names the slab as PSA does

- **GIVEN** the store sells a BGS, an SGC and a TAG slab, each product naming
  its inventory item
- **WHEN** the shopkeeper scans each slab's label
- **THEN** the scan names that slab's product with its item's grader, grade
  and cert

<!-- trace:scenario id=g10.store-shelf-scanning.SC-6k5 rev=1 -->
#### Scenario: g10.store-shelf-scanning.SC47 - A label code no inventory item carries
**Serves:** g10.store-shelf-scanning.US6 - a mistyped label code leaves the slab found by its photos, not lost

- **GIVEN** a house-stock slab's product, its photos learned
- **WHEN** a stock keeper writes a label code no inventory item carries on
  the product and the next copy reaches the scanner
- **THEN** the scanner holds it without grade or cert, recognised by its
  photos
- **AND** Operations is alerted to a slab held without a unit, the log naming
  the product

<!-- trace:scenario id=g10.store-shelf-scanning.SC-hn6 rev=1 -->
#### Scenario: g10.store-shelf-scanning.SC48 - A changed label code moves the slab facts
**Serves:** g10.store-shelf-scanning.US6 - the stock keeper corrects which slab a product sells

- **GIVEN** a house-stock product carrying one slab's label code, and a second
  slab registered in inventory with another grade and cert, named by no
  product
- **WHEN** a stock keeper replaces the code with the second slab's and the
  next copy reaches the scanner
- **THEN** scanning the second slab's label names the product with the
  second slab's grade and cert
- **AND** scanning the first slab's label no longer names the product

<!-- trace:scenario id=g10.store-shelf-scanning.SC-q13 rev=2 -->
#### Scenario: g10.store-shelf-scanning.SC51 - A consigned raw card is held as a raw card
**Serves:** `Slab as its copy` - only a real slab raises the alert for a slab without a unit

- **GIVEN** a consigned product whose inventory item is a raw card, with no
  grader, and whose collectible type a merchandiser set to a graded one
- **WHEN** the next copy reaches the scanner
- **THEN** the scanner holds it with its title, price, availability and
  photos, recognised by its photos, with no grade or cert
- **AND** Operations is not alerted

<!-- trace:scenario id=g10.store-shelf-scanning.SC-9sn rev=1 -->
#### Scenario: g10.store-shelf-scanning.SC49 - The alert clears once no slab is held without a unit
**Serves:** g10.store-shelf-scanning.US6 - correcting the last slab without a unit ends the alert

- **GIVEN** the only product held without a unit is a house-stock slab
  carrying a label code no inventory item carries, and Operations is alerted
- **WHEN** a stock keeper writes its item's label code and the next copy
  reaches the scanner
- **THEN** scanning its label names the product with its item's grade and
  cert
- **AND** Operations' alert clears

### Requirement: A store product is named before the shared card catalogue

Where a store product and the scanner's shared card catalogue both match what
the camera sees, and the store product's match is one the scanner accepts on
its own, the scanner SHALL name the store product. Where two or more store
products match one art about as closely, slabs among them, the scan SHALL
show each of them, closest first, and the shopkeeper SHALL pick one; a scan
with one close match SHALL show it directly. A slab whose label the scanner
read SHALL be named alone, by its cert. A slab's grade and cert SHALL show
only when the scanner read its label, so a raw copy of a card the store sells
only as one slab SHALL name the slab's product without them. A product the scanner
cannot yet recognise from its photos SHALL still be held with its title,
price and availability, and scanning it SHALL show what the scanner shows for
anything it does not recognise.

<!-- trace:scenario id=g10.store-shelf-scanning.SC-wsi rev=1 -->
#### Scenario: g10.store-shelf-scanning.SC17 - The store product wins over the catalogue card
**Serves:** g10.store-shelf-scanning.US1 - the shopkeeper scans a raw card the store sells

- **GIVEN** the scanner has learned a store product's photo of a raw card,
  and the same card is in the shared card catalogue
- **WHEN** the shopkeeper scans that card
- **THEN** the scanner names the store product, with the store's title, price
  and availability, and not the catalogue card and its market price

<!-- trace:scenario id=g10.store-shelf-scanning.SC-lrl rev=1 -->
#### Scenario: g10.store-shelf-scanning.SC18 - A sealed box is held before it is recognisable
**Serves:** `Recognition order` - the store sends every kind now so the box detector needs no second sync

- **GIVEN** the store publishes a sealed box, a comic and a piece of merch
- **WHEN** the next copy reaches the scanner
- **THEN** the scanner holds each with its title, price, availability and
  photos

<!-- trace:scenario id=g10.store-shelf-scanning.SC-z1x rev=1 -->
#### Scenario: g10.store-shelf-scanning.SC19 - Scanning a product the scanner cannot recognise
**Serves:** g10.store-shelf-scanning.US1 - the shopkeeper points the camera at a sealed box

- **GIVEN** the scanner holds a sealed box it cannot recognise from its photos
- **WHEN** the shopkeeper scans the box
- **THEN** the scanner shows "Not recognised yet — hold steady", as for
  anything it does not recognise

<!-- trace:scenario id=g10.store-shelf-scanning.SC-ftn rev=1 -->
#### Scenario: g10.store-shelf-scanning.SC35 - One close match shows directly
**Serves:** `g10.store-shelf-scanning.US1`, `Recognition order` - the shopkeeper scans a card the store lists once

- **GIVEN** the store sells one raw listing of a card
- **WHEN** the shopkeeper scans that card
- **THEN** the scan shows that product's title, price and availability, with
  no choice to make

<!-- trace:scenario id=g10.store-shelf-scanning.SC-92k rev=1 -->
#### Scenario: g10.store-shelf-scanning.SC36 - Two listings of one art are both shown
**Serves:** `g10.store-shelf-scanning.US1`, `Recognition order` - the shopkeeper scans a card the store lists twice, say in two languages

- **GIVEN** the store sells two raw listings whose photos show the same art,
  and the scanner matches the card in view to both about as closely
- **WHEN** the shopkeeper scans that card
- **THEN** the scan names the closest listing and says 2 matches
- **AND** opening it lists both listings, closest first, each with its title,
  price and availability

<!-- trace:scenario id=g10.store-shelf-scanning.SC-hyo rev=1 -->
#### Scenario: g10.store-shelf-scanning.SC37 - The shopkeeper picks one listing
**Serves:** `g10.store-shelf-scanning.US1`, `Recognition order` - the shopkeeper chooses the listing in their hand

- **GIVEN** the scan lists two listings of one art
- **WHEN** the shopkeeper picks the second
- **THEN** the scan shows that listing's title, price, availability and, in a
  build that carries the store, its store page link

<!-- trace:scenario id=g10.store-shelf-scanning.SC-egb rev=1 -->
#### Scenario: g10.store-shelf-scanning.SC38 - The shopkeeper dismisses the list
**Serves:** `g10.store-shelf-scanning.US1`, `Recognition order` - the shopkeeper goes back to scanning without choosing

- **GIVEN** the scan lists two listings of one art
- **WHEN** the shopkeeper dismisses the list
- **THEN** the camera view returns with no listing chosen

<!-- trace:scenario id=g10.store-shelf-scanning.SC-jar rev=1 -->
#### Scenario: g10.store-shelf-scanning.SC39 - A raw copy of a card sold only as a slab
**Serves:** `g10.store-shelf-scanning.US1`, `Recognition order` - the shopkeeper scans a raw card the store sells only graded

- **GIVEN** the store sells a card only as a PSA 10 slab, and no other
  product of its art
- **WHEN** the shopkeeper scans a raw copy of that card
- **THEN** the scan names the slab's product with its title, price and
  availability, with no choice to make
- **AND** shows no grade and no cert

<!-- trace:scenario id=g10.store-shelf-scanning.SC-4qs rev=1 -->
#### Scenario: g10.store-shelf-scanning.SC41 - A raw card beside a slab of its art offers the pick
**Serves:** `g10.store-shelf-scanning.US1`, `Recognition order` - a raw card never shows a slab's price without a choice

- **GIVEN** the store sells a raw listing of a card and a PSA 10 slab of it,
  and the scanner matches the card in view to both about as closely
- **WHEN** the shopkeeper scans a raw copy of that card
- **THEN** the scan names the closest product and says 2 matches
- **AND** opening it lists both, closest first, each with its title, price
  and availability, and neither with a grade or cert

<!-- trace:scenario id=g10.store-shelf-scanning.SC-sw4 rev=1 -->
#### Scenario: g10.store-shelf-scanning.SC42 - Two slabs of one card with no label read
**Serves:** `g10.store-shelf-scanning.US3`, `Recognition order` - a slab whose label is not read is picked like any other listing

- **GIVEN** the store sells two PCGS slabs of one card, which the scanner
  cannot read by label
- **WHEN** the shopkeeper scans one of them
- **THEN** the scan names the closest and says 2 matches
- **AND** opening it lists both slabs' products, closest first, with no
  grade or cert

<!-- trace:scenario id=g10.store-shelf-scanning.SC-owc rev=1 -->
#### Scenario: g10.store-shelf-scanning.SC43 - A read label names its slab alone
**Serves:** `g10.store-shelf-scanning.US3`, `Recognition order` - a cert names one unit, so there is nothing to pick

- **GIVEN** the store sells a raw listing of a card and a PSA 10 slab of it
  with cert 126956765
- **WHEN** the shopkeeper scans the slab and the scanner reads its label
- **THEN** the scan names the slab's product with grade PSA 10 and cert
  126956765, with no choice to make

### Requirement: The scanner learns new photos every hour

The scanner SHALL learn the photos it has not yet learned every hour, on
staging and on production, with the model the deployed scanner runs.

| Rule | Value |
| --- | --- |
| Run | Every hour, on staging and production |
| An hour with no photo to learn | No work beyond checking |
| A photo that could not be learned | Tried again 24 hours after the failure |
| The run's model differs from the scanner's | Nothing learned; the run fails |

<!-- trace:scenario id=g10.store-shelf-scanning.SC-s7a rev=2 -->
#### Scenario: g10.store-shelf-scanning.SC20 - A new photo is learned at the next hourly run on production
**Serves:** `Hourly photo learning` - the store adds a photo and the shelf recognises it

- **GIVEN** a product on production gains a photo
- **WHEN** the next copy reaches production's scanner
- **THEN** once the next hourly run has finished, the scanner recognises the
  product from that photo

<!-- trace:scenario id=g10.store-shelf-scanning.SC-i2s rev=1 -->
#### Scenario: g10.store-shelf-scanning.SC21 - An hour with nothing new does no work
**Serves:** `Hourly photo learning` - the hourly run checks and stops

- **GIVEN** no photo is waiting to be learned
- **WHEN** the hourly run starts
- **THEN** it checks once and stops without preparing to learn anything

<!-- trace:scenario id=g10.store-shelf-scanning.SC-c8l rev=1 -->
#### Scenario: g10.store-shelf-scanning.SC22 - A replaced photo is learned again and a dropped one leaves
**Serves:** `Hourly photo learning` - the scanner follows the product's photos

- **GIVEN** the scanner has learned a product's two photos
- **WHEN** the shop replaces one photo and removes the other, and the next
  copy reaches the scanner
- **THEN** the removed photo no longer recognises the product
- **AND** the new photo is learned at the next hourly run

<!-- trace:scenario id=g10.store-shelf-scanning.SC-j8j rev=1 -->
#### Scenario: g10.store-shelf-scanning.SC40 - A product with more than 8 photos
**Serves:** `Hourly photo learning` - the scanner learns what an item can hold

- **GIVEN** a product with 10 photos
- **WHEN** the next copy reaches the scanner and the hourly run has passed
- **THEN** the scanner recognises the product from its first 8 photos in the
  shop's order, and not from the last 2

<!-- trace:scenario id=g10.store-shelf-scanning.SC-cz6 rev=1 -->
#### Scenario: g10.store-shelf-scanning.SC23 - A photo that failed is tried again after 24 hours
**Serves:** `Hourly photo learning` - a photo that could not be fetched once is not lost for good

- **GIVEN** a product photo could not be learned
- **WHEN** 24 hours have passed since the failure
- **THEN** the next hourly run tries it again

<!-- trace:scenario id=g10.store-shelf-scanning.SC-a43 rev=1 -->
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
badge SHALL follow a discount that starts or ends within 6 minutes. An open
scanner SHALL read its catalogue again every 2 minutes while it is in view,
and at once when the shopkeeper returns to it, so it shows a change the shop
reports within 8 minutes of the save, and one only the re-read finds within
13.

<!-- trace:scenario id=g10.store-shelf-scanning.SC-6zi rev=1 -->
#### Scenario: g10.store-shelf-scanning.SC25 - The price is the product page's
**Serves:** g10.store-shelf-scanning.US1 - the shopkeeper quotes what a customer pays online

- **GIVEN** a product with two variants, the first sold out at 150000 HKD
  minor units and the second for sale at 120000 HKD minor units, and an
  automatic discount of 10% off every item with no minimum
- **WHEN** the shopkeeper scans it
- **THEN** the scanner shows 108000 HKD minor units, a `Sale` badge and
  `Available`

<!-- trace:scenario id=g10.store-shelf-scanning.SC-2r0 rev=1 -->
#### Scenario: g10.store-shelf-scanning.SC26 - No count is shown
**Serves:** g10.store-shelf-scanning.US4 - the shopkeeper reads whether the product can be bought, not how many are left

- **GIVEN** the shop holds 3 of a product for sale
- **WHEN** the shopkeeper scans it
- **THEN** the scanner shows `Available` and no number of units

<!-- trace:scenario id=g10.store-shelf-scanning.SC-n6w rev=1 -->
#### Scenario: g10.store-shelf-scanning.SC27 - The link opens the store page
**Serves:** g10.store-shelf-scanning.US2 - the shopkeeper shows the customer the product online

- **GIVEN** a build that carries the store
- **WHEN** the shopkeeper scans a product and opens its link
- **THEN** the product's store page opens

<!-- trace:scenario id=g10.store-shelf-scanning.SC-nae rev=1 -->
#### Scenario: g10.store-shelf-scanning.SC28 - No link where the store is not carried
**Serves:** g10.store-shelf-scanning.US2 - the shopkeeper is never sent to a page the build does not have

- **GIVEN** a build that does not carry the store
- **WHEN** the shopkeeper scans a product
- **THEN** the scanner shows its title, price and availability and no link

<!-- trace:scenario id=g10.store-shelf-scanning.SC-hdf rev=1 -->
#### Scenario: g10.store-shelf-scanning.SC29 - An open scanner reads its catalogue again
**Serves:** g10.store-shelf-scanning.US1 - a scanner left open all day never shows an old price for long

- **GIVEN** a scanner open on the shop floor, and a product repriced since it
  opened
- **WHEN** the scanner's item carries the new price and 2 minutes pass with
  the scanner in view, or the shopkeeper returns to the scanner from another
  app
- **THEN** scanning the product shows the new price, without reopening the
  link

<!-- trace:scenario id=g10.store-shelf-scanning.SC-eqw rev=1 -->
#### Scenario: g10.store-shelf-scanning.SC33 - A discount that starts reaches the scan
**Serves:** g10.store-shelf-scanning.US1 - a sale the shop starts shows on the shelf without any product changing

- **GIVEN** the scanner holds a product at 120000 HKD minor units with no
  discount running
- **WHEN** the shop starts an automatic discount of 10% off every item with
  no minimum
- **THEN** within 6 minutes the scan shows 108000 HKD minor units with a
  `Sale` badge
- **AND** once the discount ends, within 6 minutes it shows 120000 HKD minor
  units and no badge

### Requirement: Shopkeepers open the scanner from one fixed link

Each of staging and production SHALL have one fixed scanner link for the
shop: the hosted scanner with the project's public key, searching the store's
items. It SHALL open without signing in, from outside the company's access
wall, SHALL scan only, adding no photos, SHALL show only what the store shows
publicly, and SHALL stop working when its key is rotated. A scan SHALL show
no stock count and no value but the title, price, `Sale` badge, availability
and store page link, and a slab's grade and cert, which its label prints.

<!-- trace:scenario id=g10.store-shelf-scanning.SC-jxn rev=1 -->
#### Scenario: g10.store-shelf-scanning.SC30 - The link opens the scanner without sign-in
**Serves:** g10.store-shelf-scanning.US7 - the shopkeeper opens the bookmarked link on a shop phone

- **GIVEN** a phone signed in to nothing and outside the company's access
  wall
- **WHEN** the shopkeeper opens the shop's scanner link
- **THEN** the scanner opens and names the store's products

<!-- trace:scenario id=g10.store-shelf-scanning.SC-0cy rev=1 -->
#### Scenario: g10.store-shelf-scanning.SC31 - The link adds no photos
**Serves:** g10.store-shelf-scanning.US7 - the link can only scan

- **GIVEN** the scanner opened from the shop's link
- **WHEN** anyone tries to add a photo to an item through it, from the
  scanner's controls or by sending one with the link's key
- **THEN** the item's photos stay as the store sent them

<!-- trace:scenario id=g10.store-shelf-scanning.SC-3yv rev=1 -->
#### Scenario: g10.store-shelf-scanning.SC32 - Rotating the key retires the link
**Serves:** g10.store-shelf-scanning.US7 - the shop replaces a link that has leaked

- **GIVEN** an operator issues a new key and revokes the link's key
- **WHEN** anyone opens the old link
- **THEN** the scanner does not open, and shows its usual refusal for a link
  that no longer works
- **AND** a link with the new key opens it

<!-- trace:scenario id=g10.store-shelf-scanning.SC-nbk rev=1 -->
#### Scenario: g10.store-shelf-scanning.SC50 - A scan shows only what the store shows publicly
**Serves:** g10.store-shelf-scanning.US7 - a link anyone can open exposes nothing the store keeps private

- **GIVEN** the scanner opened from the shop's link, and the store selling a
  raw card with 7 for sale under an automatic discount and a house-stock slab
- **WHEN** the shopkeeper scans the card, and the slab by its label
- **THEN** each scan shows no stock count and no value but the title, price,
  `Sale` badge, availability, store page link and, for the slab, grade and
  cert
