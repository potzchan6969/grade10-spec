## User journeys

### grade10-site-auction-bidding-history-US-01: Collector reads their bidding index

**As a** collector,
**I want** every listing with my retained maximum activity in one private index,
**so that** I can see my standing without hunting through the catalogue.

**Accepted by:**

- `grade10-site-auction-bidding-history-SC-01` — Repeated activity is grouped under one listing
- `grade10-site-auction-bidding-history-SC-02` — A failed-only listing remains explainable
- `grade10-site-auction-bidding-history-SC-03` — Active and completed activity separate cleanly
- `grade10-site-auction-bidding-history-SC-04` — Paging does not repeat or skip a listing
- `grade10-site-auction-bidding-history-SC-05` — An account with no bidding activity has an empty index

### grade10-site-auction-bidding-history-US-02: Collector audits every retained maximum action

**As a** collector,
**I want** every maximum Grade10 evaluates for me kept as a private event,
**so that** I can see what was accepted, refused, or placed automatically without exposing my maximum to a rival.

**Accepted by:**

- `grade10-site-auction-bidding-history-SC-37` — A manual bid is not accepted
- `grade10-site-auction-bidding-history-SC-38` — A server-evaluated maximum fails
- `grade10-site-auction-bidding-history-SC-39` — Browser-only validation creates no Auction event
- `grade10-site-auction-bidding-history-SC-40` — An automatic maximum is configured and raised
- `grade10-site-auction-bidding-history-SC-41` — The engine bids for the collector

### grade10-site-auction-bidding-history-US-03: Collector reads one listing's combined history

**As a** collector,
**I want** one chronology of public price movement and my private standing,
**so that** I can see how I was outbid without seeing anyone's hidden maximum.

**Accepted by:**

- `grade10-site-auction-bidding-history-SC-11` — A competing bid visibly causes an outbid state
- `grade10-site-auction-bidding-history-SC-12` — An automatic response is attributed to You
- `grade10-site-auction-bidding-history-SC-13` — A failed attempt sits beside the unchanged auction state
- `grade10-site-auction-bidding-history-SC-14` — Full retained history remains pageable
- `grade10-site-auction-bidding-history-SC-29` — A maximum below the next bid is refused
- `grade10-site-auction-bidding-history-SC-30` — A matching minimum creates challenger and response records
- `grade10-site-auction-bidding-history-SC-31` — A lower maximum below A's cap creates two ordered records
- `grade10-site-auction-bidding-history-SC-32` — A maximum one increment below A's cap stops at A's maximum
- `grade10-site-auction-bidding-history-SC-33` — An equal maximum creates two records for the earlier leader
- `grade10-site-auction-bidding-history-SC-34` — A maximum just above A's cap takes the lead
- `grade10-site-auction-bidding-history-SC-35` — A maximum equal to the next increment takes the lead once
- `grade10-site-auction-bidding-history-SC-36` — A higher maximum is capped at one increment above A's cap

### grade10-site-auction-bidding-history-US-04: Collector's bidding history stays on their storefront account

**As a** collector,
**I want** only my Grade10 account's history,
**so that** another storefront or an unsigned visitor cannot read my maximums or failed attempts.

**Accepted by:**

- `grade10-site-auction-bidding-history-SC-15` — A storefront account reads its own history
- `grade10-site-auction-bidding-history-SC-16` — The same account id on another storefront is unrelated
- `grade10-site-auction-bidding-history-SC-17` — An anonymous reader cannot read private history
- `grade10-site-auction-bidding-history-SC-18` — Reading history is inert

### grade10-site-auction-bidding-history-US-05: Collector opens their bids at /bids

**As a** collector,
**I want** `/bids` to show my active and completed summaries and expand each listing's history,
**so that** I can audit standing without leaving the page.

**Accepted by:**

- `grade10-site-auction-bidding-history-SC-19` — A signed-in collector opens active bids
- `grade10-site-auction-bidding-history-SC-20` — An outbid summary leads to its explanation and listing
- `grade10-site-auction-bidding-history-SC-21` — A signed-out visitor preserves the destination
- `grade10-site-auction-bidding-history-SC-22` — An empty filter is explicit
- `grade10-site-auction-bidding-history-SC-23` — Initial loading reserves the bidding list
- `grade10-site-auction-bidding-history-SC-24` — An index failure is retryable
- `grade10-site-auction-bidding-history-SC-25` — Expanding history preserves its summary while loading
- `grade10-site-auction-bidding-history-SC-26` — Loading more preserves entries already shown
- `grade10-site-auction-bidding-history-SC-27` — A history failure preserves the listing summary
- `grade10-site-auction-bidding-history-SC-28` — ZZZ receives no bidding-history page
