## User journeys

### listing-page-US-01: Collector opens a lot at its own address

**As a** collector,
**I want** a lot's address to answer with that lot's own page in the response
HTML,
**so that** I can read its name, its description and where its bidding stands
without waiting for a script to run.

**Accepted by:**

- `listing-page-SC-01` — A lot answers whole
- `listing-page-SC-02` — Two lots, two pages
- `listing-page-SC-05` — A lot the catalogue publishes answers

### listing-page-US-02: Collector shares a lot link

**As a** collector,
**I want** a lot link to unfurl as that lot and its own canonical address,
**so that** a link I pass on names the lot it points at instead of the auction
catalogue.

**Accepted by:**

- `listing-page-SC-03` — A preview fetcher reads a lot

### listing-page-US-03: Collector opens an address that names no lot

**As a** collector,
**I want** an address under the auction's lots that names no published lot to
answer with the site's not-found surface,
**so that** I am never shown an empty lot page or the catalogue in its place.

**Accepted by:**

- `listing-page-SC-04` — An id the catalogue publishes no lot for
- `listing-page-SC-05` — A lot the catalogue publishes answers

### listing-page-US-04: Collector reads a live lot while scripts load

**As a** collector,
**I want** the lot I was served to stay on screen once scripts finish loading,
**so that** nothing I was reading blanks into a placeholder and no value
disagrees with what the document carried.

**Accepted by:**

- `listing-page-SC-06` — The served lot stays on screen
- `listing-page-SC-07` — A value that follows the clock carries on

### listing-page-US-05: Collector reaches a lot from the catalogue

**As a** collector,
**I want** to open a lot's own address from the catalogue without a page load,
**so that** the lot I picked out of the list is the page I land on.

**Accepted by:**

- `listing-page-SC-08` — A lot is opened from the catalogue
- `listing-page-SC-09` — The sitemap names no lot
