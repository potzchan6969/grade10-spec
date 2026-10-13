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
