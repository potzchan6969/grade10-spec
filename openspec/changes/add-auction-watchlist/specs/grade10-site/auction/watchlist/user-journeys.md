## User journeys

### watchlist-US-01: Collector watches a lot to come back to it

**As a** signed-in collector,
**I want** to mark a lot to come back to without bidding on it,
**so that** I can leave the page and find it again without searching.

**Accepted by:**

- `watchlist-SC-01` — A collector watches a lot
- `watchlist-SC-03` — Watching twice leaves one watch
- `watchlist-SC-04` — A signed-out viewer is offered sign-in
- `watchlist-SC-05` — A watch follows the collector, not the browser
- `watchlist-SC-06` — A watch belongs to one collector
- `watchlist-SC-07` — A watch count is not public
- `watchlist-SC-08` — One collector cannot see another's watch
- `watchlist-SC-09` — Watching does not change the sale

### watchlist-US-02: Collector unwatches a lot they no longer follow

**As a** signed-in collector,
**I want** to remove a watch, including after the lot has closed or been
called off,
**so that** my list only holds lots I still mean to follow.

**Accepted by:**

- `watchlist-SC-02` — A collector unwatches a lot
- `watchlist-SC-14` — A collector unwatches a closed lot

### watchlist-US-03: Collector reads the lots they watch

**As a** signed-in collector,
**I want** to see the lots I watch, most recently watched first, with
enough to decide whether to act,
**so that** I can return to a lot from one place.

**Accepted by:**

- `watchlist-SC-11` — The list is ordered by when each watch was made
- `watchlist-SC-12` — A collector watching nothing
- `watchlist-SC-13` — An entry leads to its lot
- `watchlist-SC-15` — An entry carries the facts needed to act
- `watchlist-SC-16` — A closed lot stays in the list
- `watchlist-SC-17` — A called-off lot is shown as called off

### watchlist-US-04: Operator judges interest from the watch count

**As an** auction operator,
**I want** to see how many collectors watch a lot, across both brands,
**so that** I can judge interest without treating a watch as a commitment
to buy.

**Accepted by:**

- `watchlist-SC-10` — An operator counts every watch on a lot
