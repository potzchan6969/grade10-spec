## User journeys

### home-US-01: Collector arrives at the store front door

**As a** collector,
**I want** the store address to answer with a marketing hero and two ways on
before any script runs,
**so that** I understand what the store sells and can move straight into
browsing or bidding.

**Accepted by:**

- `home-SC-01` — The front door answers whole
- `home-SC-02` — The store and the listing are two surfaces
- `home-SC-03` — The hero reaches the catalogue
- `home-SC-04` — The hero reaches the auction
- `home-SC-15` — The hero does not wait

### home-US-02: Collector enters the catalogue through a collection

**As a** collector,
**I want** every collection the shop lists as a tile on the front door,
**so that** I can open a scoped browse listing without the application
deciding which collections appear.

**Accepted by:**

- `home-SC-05` — The grid is the shop's collections
- `home-SC-06` — A collection added to the shop
- `home-SC-07` — A collection with no artwork
- `home-SC-08` — Nothing to offer
- `home-SC-09` — A tile opens its collection

### home-US-03: Collector browses the merchandised collection

**As a** collector,
**I want** a row of cards from the first collection the catalogue lists,
**so that** I can open a card's page or the rest of that collection from the
front door.

**Accepted by:**

- `home-SC-10` — The row is the first collection's cards
- `home-SC-11` — The row follows the shop
- `home-SC-12` — A card opens its own page
- `home-SC-13` — The row reaches the rest of the collection
- `home-SC-14` — Nothing to merchandise

### home-US-04: Collector keeps using the front door while the catalogue lags

**As a** collector,
**I want** the hero usable while catalogue sections load or fail, and a way
to retry a failed read without a full page load,
**so that** a slow or broken catalogue does not block the front door.

**Accepted by:**

- `home-SC-16` — A section says it is loading
- `home-SC-17` — A failed read can be retried

### home-US-05: Collector moves around the store from the chrome

**As a** collector,
**I want** the site chrome to mark the store on every store surface and to
reach the front door or the unscoped listing,
**so that** I can navigate the store without guessing destinations.

**Accepted by:**

- `home-SC-18` — The listing is still the store
- `home-SC-19` — The chrome reaches the front door
- `home-SC-20` — The chrome reaches every collection
