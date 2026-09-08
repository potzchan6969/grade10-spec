## User journeys

### grade10-site-auction-watchlist-US-01: Collector watches a listing to come back to it

**As a** signed-in collector,
**I want** to mark a listing to come back to without bidding on it,
**so that** I can leave the page and find it again without searching.

**Accepted by:**

- `grade10-site-auction-watchlist-SC-01` — A collector watches a listing
- `grade10-site-auction-watchlist-SC-03` — Watching twice leaves one watch
- `grade10-site-auction-watchlist-SC-04` — A signed-out viewer is offered sign-in
- `grade10-site-auction-watchlist-SC-05` — A watch follows the collector, not the browser
- `grade10-site-auction-watchlist-SC-06` — A watch belongs to one collector
- `grade10-site-auction-watchlist-SC-07` — A watch count is not public
- `grade10-site-auction-watchlist-SC-08` — One collector cannot see another's watch
- `grade10-site-auction-watchlist-SC-09` — Watching does not change the sale

### grade10-site-auction-watchlist-US-02: Collector unwatches a listing they no longer follow

**As a** signed-in collector,
**I want** to remove a watch, including after the listing has closed or been
called off,
**so that** my list only holds listings I still mean to follow.

**Accepted by:**

- `grade10-site-auction-watchlist-SC-02` — A collector unwatches a listing
- `grade10-site-auction-watchlist-SC-14` — A collector unwatches a closed listing
- `grade10-site-auction-watchlist-SC-18` — A collector unwatches from the watched list

### grade10-site-auction-watchlist-US-03: Collector reads the listings they watch

**As a** signed-in collector,
**I want** to see the listings I watch, most recently watched first, with
enough to decide whether to act,
**so that** I can return to a listing from one place.

**Accepted by:**

- `grade10-site-auction-watchlist-SC-11` — The list is ordered by when each watch was made
- `grade10-site-auction-watchlist-SC-12` — A collector watching nothing
- `grade10-site-auction-watchlist-SC-13` — An entry leads to its listing
- `grade10-site-auction-watchlist-SC-15` — An entry carries the facts needed to act
- `grade10-site-auction-watchlist-SC-16` — A closed listing stays in the list
- `grade10-site-auction-watchlist-SC-17` — A called-off listing is shown as called off

### grade10-site-auction-watchlist-US-04: Operator judges interest from the watch count

**As an** auction operator,
**I want** to see how many collectors watch a listing, across both brands,
**so that** I can judge interest without treating a watch as a commitment
to buy.

**Accepted by:**

- `grade10-site-auction-watchlist-SC-10` — An operator counts every watch on a listing
