## User journeys

### grade10-site-store-product-listing-US-01: Collector opens the listing at its own address

**As a** collector,
**I want** the browse listing to answer at an address of its own, with its own
title and metadata, before any script runs,
**so that** I can link to, share and bookmark the catalogue rather than click
into it.

**Accepted by:**

- `grade10-site-store-product-listing-SC-01` — The listing answers at its address
- `grade10-site-store-product-listing-SC-02` — The listing is offered to crawlers

### grade10-site-store-product-listing-US-02: Collector opens a collection from its address

**As a** collector,
**I want** an address that names a collection to open the listing already
narrowed to it,
**so that** a way into the catalogue can be linked, shared and bookmarked
rather than clicked into.

**Accepted by:**

- `grade10-site-store-product-listing-SC-03` — An address opens the listing narrowed
- `grade10-site-store-product-listing-SC-04` — No collection named
- `grade10-site-store-product-listing-SC-05` — A collection the catalogue has nothing for

### grade10-site-store-product-listing-US-03: Collector leaves the collection they arrived in

**As a** collector who came in through a collection,
**I want** to see which collection I am inside and step out of it,
**so that** I can search the whole catalogue without going back to where I came
from.

**Accepted by:**

- `grade10-site-store-product-listing-SC-06` — Narrowing in the page is linkable
- `grade10-site-store-product-listing-SC-07` — Back undoes a narrowing
- `grade10-site-store-product-listing-SC-08` — The collection in force can be dismissed
- `grade10-site-store-product-listing-SC-09` — An address carrying both

### grade10-site-store-product-listing-US-04: Collector narrows the catalogue to what they collect

**As a** collector,
**I want** to narrow the listing by the world a card comes from and the kind of
collectible it is, and to see how many cards sit behind each choice before I
pick one,
**so that** I reach the cards I collect without reading past the ones I do not.

**Accepted by:**

- `grade10-site-store-product-listing-SC-10` — The panel is the catalogue's facets
- `grade10-site-store-product-listing-SC-11` — A facet narrowing is linkable
- `grade10-site-store-product-listing-SC-12` — A shop with no facets configured
- `grade10-site-store-product-listing-SC-16` — A long facet group is capped
- `grade10-site-store-product-listing-SC-17` — A narrowing that starves the catalogue
- `grade10-site-store-product-listing-SC-42` — A choice with nothing counted behind it
- `grade10-site-store-product-listing-SC-43` — A narrowing cannot resurrect a choice the catalogue never carries

### grade10-site-store-product-listing-US-05: Collector orders and searches the whole shop

**As a** collector,
**I want** an order and a search that cover every card the shop lists rather
than the ones already on screen,
**so that** the cheapest card I could buy is the one I am shown first.

**Accepted by:**

- `grade10-site-store-product-listing-SC-13` — An order covers the whole catalogue
- `grade10-site-store-product-listing-SC-14` — Free text covers the whole catalogue
- `grade10-site-store-product-listing-SC-15` — The menu offers only answerable orders

### grade10-site-store-product-listing-US-06: Collector takes the last of a card from the listing

**As a** collector,
**I want** a card's quantity to stop where the shop runs out, and to be told
how many are left when it does,
**so that** I buy the number the shop will actually send me rather than
finding out at the order.

**Accepted by:**

- `grade10-site-store-product-listing-SC-18` — A card stops at what the shop has
- `grade10-site-store-product-listing-SC-19` — A shop that counts nothing stops nothing
- `grade10-site-store-product-listing-SC-20` — Nearly out is said on the card
- `grade10-site-store-product-listing-SC-21` — Asking for the last one is answered

### grade10-site-store-product-listing-US-07: Collector reads past the first page of the listing

**As a** collector,
**I want** the listing to keep giving me cards as I reach the end of the ones
shown, without a page to pick,
**so that** I can look through the whole catalogue in one run and come back to
where a narrowing left off rather than to a page number.

**Accepted by:**

- `grade10-site-store-product-listing-SC-22` — The next cards arrive at the end
- `grade10-site-store-product-listing-SC-23` — The end of the set
- `grade10-site-store-product-listing-SC-24` — A narrowing starts the walk again
- `grade10-site-store-product-listing-SC-25` — Depth is not carried in the address
- `grade10-site-store-product-listing-SC-26` — A page the catalogue does not answer

### grade10-site-store-product-listing-US-08: Collector sees how large their narrowing is

**As a** collector,
**I want** to be told how many cards my narrowing found, not how many I have
scrolled past,
**so that** I can tell whether it is worth reading on before I have read to the
end.

**Accepted by:**

- `grade10-site-store-product-listing-SC-27` — The count is the set, not what was read
- `grade10-site-store-product-listing-SC-28` — The count follows the narrowing
- `grade10-site-store-product-listing-SC-30` — A choice's count is the listing it opens

### grade10-site-store-product-listing-US-09: Collector opens the listing at rest

**As a** collector,
**I want** the catalogue already ordered by latest product when I arrive,
**so that** I see new stock first without picking a sort.

**Accepted by:**

- `grade10-site-store-product-listing-SC-15` — The menu offers only answerable orders
- `grade10-site-store-product-listing-SC-29` — At rest the order is latest
- `grade10-site-store-product-listing-SC-41` — The resting order is not named in the address

### grade10-site-store-product-listing-US-11: Collector orders the collection they arrived in

**As a** collector who followed a front-door tile into a collection,
**I want** to order that collection without leaving it,
**so that** I can read it newest or cheapest first and still be in the
collection I came for.

**Accepted by:**

- `grade10-site-store-product-listing-SC-39` — A collection opens on the resting order
- `grade10-site-store-product-listing-SC-40` — An order holds the collection it was chosen in
