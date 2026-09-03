## User journeys

### bidding-history-US-01: Collector reads their bidding index

**As a** collector,
**I want** every listing I bid on in one private index,
**so that** I can see my standing without hunting through the catalogue.

**Accepted by:**

- `bidding-history-SC-01` — Repeated activity is grouped under one listing
- `bidding-history-SC-02` — A failed-only listing remains explainable
- `bidding-history-SC-03` — Active and completed activity separate cleanly
- `bidding-history-SC-04` — Paging does not repeat or skip a listing
- `bidding-history-SC-05` — An account with no bidding activity has an empty index

### bidding-history-US-02: Collector audits every retained bidding action

**As a** collector,
**I want** every bid Grade10 evaluated for me kept as a private event,
**so that** I can see what was accepted, refused, or placed automatically without
exposing my maximum to a rival.

**Accepted by:**

- `bidding-history-SC-06` — A manual bid is accepted
- `bidding-history-SC-07` — A server-evaluated bid fails
- `bidding-history-SC-08` — Browser-only validation creates no Auction event
- `bidding-history-SC-09` — An automatic maximum is configured and raised
- `bidding-history-SC-10` — The engine bids for the collector

### bidding-history-US-03: Collector reads one listing's combined history

**As a** collector,
**I want** one chronology of public price movement and my private standing,
**so that** I can see how I was outbid without seeing anyone's maximum.

**Accepted by:**

- `bidding-history-SC-11` — A competing bid visibly causes an outbid state
- `bidding-history-SC-12` — An automatic response is attributed to You
- `bidding-history-SC-13` — A failed attempt sits beside the unchanged auction state
- `bidding-history-SC-14` — Full retained history remains pageable

### bidding-history-US-04: Collector's bidding history stays on their storefront account

**As a** collector,
**I want** only my Grade10 account's history,
**so that** another storefront or an unsigned visitor cannot read my maxima or
failed attempts.

**Accepted by:**

- `bidding-history-SC-15` — A storefront account reads its own history
- `bidding-history-SC-16` — The same account id on another storefront is unrelated
- `bidding-history-SC-17` — An anonymous reader cannot read private history
- `bidding-history-SC-18` — Reading history is inert

### bidding-history-US-05: Collector opens their bids at /bids

**As a** collector,
**I want** `/bids` to show my active and completed summaries and expand each
listing's history,
**so that** I can audit standing without leaving the page.

**Accepted by:**

- `bidding-history-SC-19` — A signed-in collector opens active bids
- `bidding-history-SC-20` — An outbid summary leads to its explanation and listing
- `bidding-history-SC-21` — A signed-out visitor preserves the destination
- `bidding-history-SC-22` — An empty filter is explicit
- `bidding-history-SC-23` — Initial loading reserves the bidding list
- `bidding-history-SC-24` — An index failure is retryable
- `bidding-history-SC-25` — Expanding history preserves its summary while loading
- `bidding-history-SC-26` — Loading more preserves entries already shown
- `bidding-history-SC-27` — A history failure preserves the listing summary
- `bidding-history-SC-28` — ZZZ receives no bidding-history page
