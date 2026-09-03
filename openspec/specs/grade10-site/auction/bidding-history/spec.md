# grade10-site/auction/bidding-history Specification

## Purpose
Lets a collector audit every retained bidding interaction on their own
storefront account and understand how public auction activity changed their
standing without exposing private bidding facts.

## Feature set

- Bidding index
  - One row per listing: repeated activity groups under one listing ordered by
    latest activity, with title, image, price, currency, time, and standing
  - Standing vocabulary: pending, leading, outbid, won, lost, canceled, and
    failed-only
  - Active and Completed: open listings versus ended or canceled, cursor-paged
    without duplicates
- Private action log
  - Server-evaluated events: every bid request, accept, refuse, maximum, and
    engine-placed bid leaves a timestamped private event
  - Safe failure reasons: window, minimum, account, payment, stale price, or
    unavailable — never a provider message or another account's facts
- Combined listing history
  - Public plus private: accepted price movements sit with this account's events
    and standing changes in one stable order
  - You versus a rival: the account's pseudonym renders as You; a rival stays a
    listing pseudonym
- Storefront identity
  - Own storefront, own account: a matching id on another storefront cannot read
    Grade10 private history
  - Read is inert: paging history places no bid and changes no auction fact
- Bids page
  - `/bids` in site chrome: signed-in Active by default, Completed without a
    reload, expand in place
  - Honest loading: empty, failed, and still-loading are distinct, and already
    shown summaries stay on screen

## Requirements

### Requirement: A storefront account has one retained bidding index

Grade10 SHALL give a signed-in collector a private index containing every
listing on which that storefront account has a retained bid attempt or
automatic-bid activity. A listing SHALL appear once, ordered by its latest
bidding activity, with its title, image when available, current or final price,
currency, latest activity time, and the collector's current standing.

The standing SHALL distinguish pending, leading, outbid, won, lost, canceled,
and failed-only participation. Failed-only means the account has one or more
failed attempts on the listing and no accepted manual or automatic bid.
Amounts SHALL be integer counts of minor units paired with an ISO 4217 currency
code.

The index SHALL be cursor-paged without duplicates or omissions. It SHALL offer
an **Active** filter for listings whose bidding remains open and a **Completed**
filter for listings whose bidding has ended or been canceled. Retained entries
SHALL have no account control to delete or hide them.

#### Scenario: bidding-history-SC-01 - Repeated activity is grouped under one listing

- **GIVEN** a collector has submitted manual bids, configured an automatic
  maximum, and raised that maximum on one listing
- **WHEN** the collector reads their bidding index
- **THEN** that listing appears once at the position of its latest activity
- **AND** its summary carries the collector's current standing rather than one
  row per action

#### Scenario: bidding-history-SC-02 - A failed-only listing remains explainable

- **GIVEN** a collector's server-evaluated bid attempts on a listing all failed
- **AND** no manual or automatic bid was accepted for that account
- **WHEN** the collector reads their bidding index
- **THEN** the listing appears with failed-only standing
- **AND** the collector can open its history to read each safe failure reason

#### Scenario: bidding-history-SC-03 - Active and completed activity separate cleanly

- **GIVEN** a collector has activity on one open listing, one closed listing,
  and one canceled listing
- **WHEN** the collector selects **Active**
- **THEN** only the open listing appears
- **WHEN** the collector selects **Completed**
- **THEN** the closed and canceled listings appear

#### Scenario: bidding-history-SC-04 - Paging does not repeat or skip a listing

- **GIVEN** a collector has more bidding listings than one page holds
- **WHEN** the collector follows every returned cursor while no newer activity
  is added
- **THEN** every matching listing appears exactly once in latest-activity order

#### Scenario: bidding-history-SC-05 - An account with no bidding activity has an empty index

- **GIVEN** a signed-in storefront account with no retained bid attempt or
  automatic-bid activity
- **WHEN** the collector reads their bidding index
- **THEN** Grade10 returns an empty result rather than another account's or
  another storefront's activity

### Requirement: Every server-evaluated account action leaves a private event

Grade10 SHALL retain a timestamped private event when the Auction authority
receives a signed-in account's manual bid request, accepts or refuses that
request, configures an automatic-bid maximum, raises that maximum, or places an
automatic bid for that account. A configured or raised maximum event SHALL
carry the account's resulting private maximum. An automatic-bid event SHALL
distinguish an engine-placed bid from a manual bid.

A refused request SHALL retain a stable, collector-safe reason covering the
applicable category: the bidding window, minimum amount, account eligibility,
payment authorization, stale competing price, or unavailable bidding
capability. It SHALL NOT expose a payment-provider message, card data, secret,
another account's maximum, or another account's identity. Input rejected only
inside the browser before a request reaches Auction SHALL NOT become an Auction
history event.

An idempotent replay of the same account action SHALL NOT add a second event.

The retained action-log type vocabulary SHALL contain exactly:

- `manual_bid_requested` — Auction received a manual bid for evaluation;
- `manual_bid_accepted` — Auction accepted that manual bid;
- `manual_bid_refused` — Auction refused that manual bid;
- `automatic_max_configured` — the account configured its first automatic
  maximum for the listing;
- `automatic_max_raised` — the account raised its existing automatic maximum;
- `automatic_bid_accepted` — the engine placed an accepted bid for the
  account;
- `accepted_price` — an accepted public price movement occurred; and
- `standing_changed` — the account's standing on the listing changed.

The safe failure-code vocabulary SHALL contain exactly:

- `window` — the listing is outside its bidding window;
- `minimum` — the attempted amount does not meet the current minimum;
- `account` — the account is not eligible to bid;
- `payment` — payment authorization did not succeed;
- `stale_price` — a competing price made the evaluated request stale; and
- `unavailable` — bidding could not be evaluated because the capability was
  unavailable.

#### Scenario: bidding-history-SC-06 - A manual bid is accepted

- **WHEN** Auction accepts a collector's manual bid
- **THEN** the collector's history records the submitted amount and accepted
  outcome at their authoritative times
- **AND** the same action replayed idempotently adds no duplicate event

#### Scenario: bidding-history-SC-07 - A server-evaluated bid fails

- **WHEN** Auction refuses a collector's bid after evaluating it
- **THEN** the collector's history records the attempted amount, failure time,
  and safe reason category
- **AND** the failed attempt does not appear in the anonymous auction log or
  accepted bid count

#### Scenario: bidding-history-SC-08 - Browser-only validation creates no Auction event

- **GIVEN** a collector enters a malformed amount that the browser refuses to
  submit
- **WHEN** the collector later reads the listing's history
- **THEN** that local validation failure is absent from the Auction history

#### Scenario: bidding-history-SC-09 - An automatic maximum is configured and raised

- **WHEN** a collector configures an automatic-bid maximum and later raises it
- **THEN** the collector's private history records both resulting maximums in
  order
- **AND** neither maximum appears in any rival's history or anonymous read

#### Scenario: bidding-history-SC-10 - The engine bids for the collector

- **GIVEN** a collector has an active automatic-bid maximum
- **WHEN** the automatic-bidding engine places a bid for that account
- **THEN** the collector's private history labels the action as automatic
- **AND** the accepted public price movement remains subject to the auction's
  existing pseudonym rules

### Requirement: One listing history combines public movement and private meaning

For a listing on which the signed-in account has activity, Grade10 SHALL return
one stably ordered, cursor-paged chronology combining every retained accepted
price movement from the auction log with that account's private events and
standing transitions. Events with the same timestamp SHALL keep a stable
auction-defined order so that later pages cannot reorder them.

The combined history SHALL render the account's auction pseudonym as **You**
and every rival only by that listing's pseudonym. It SHALL merge two facts from
one auction decision into one understandable step rather than presenting
contradictory duplicates.

#### Scenario: bidding-history-SC-11 - A competing bid visibly causes an outbid state

- **GIVEN** the collector is leading a listing
- **WHEN** a rival's accepted price movement displaces the collector
- **THEN** the combined history shows that rival under its listing pseudonym
- **AND** the same step marks **You were outbid** at the resulting public price
- **AND** it reveals neither account's private maximum

#### Scenario: bidding-history-SC-12 - An automatic response is attributed to You

- **GIVEN** a rival bid causes the collector's automatic maximum to advance the
  public price
- **WHEN** the collector reads the combined history
- **THEN** the resulting accepted movement is attributed to **You** and marked
  as automatic
- **AND** the private automatic event is not rendered as a contradictory
  second accepted bid

#### Scenario: bidding-history-SC-13 - A failed attempt sits beside the unchanged auction state

- **GIVEN** a collector's attempt fails while another bidder remains leading
- **WHEN** the collector reads the combined history
- **THEN** the failed private event appears at its authoritative time with its
  safe reason
- **AND** the auction's accepted price and leading pseudonym remain unchanged

#### Scenario: bidding-history-SC-14 - Full retained history remains pageable

- **GIVEN** one listing has more public and private events than one page holds
- **WHEN** the collector follows every returned cursor while no new event is
  added
- **THEN** every retained event visible to that collector appears exactly once
  in stable order

### Requirement: Private bidding history follows the storefront identity boundary

Only an authenticated storefront backend acting through its storefront-pinned
Auction entrypoint SHALL read an account's bidding index or combined listing
history. The history SHALL match both the pinned storefront and the signed-in
account id. A matching account id from another storefront SHALL NOT grant
access.

Anonymous Auction reads SHALL continue to expose only accepted public price
movements and listing pseudonyms. They SHALL NOT expose failed attempts,
automatic maximums, private event kinds, payment facts, or the identity behind
a pseudonym. Reading history SHALL NOT place a bid or change any auction fact.

#### Scenario: bidding-history-SC-15 - A storefront account reads its own history

- **GIVEN** a Grade10 storefront session for account A
- **WHEN** its backend requests A's bidding history through the Grade10-pinned
  Auction entrypoint
- **THEN** Auction returns only A's Grade10 activity and the public movements
  that belong in its combined histories

#### Scenario: bidding-history-SC-16 - The same account id on another storefront is unrelated

- **GIVEN** Grade10 and ZZZ each have an account with the same account id
- **WHEN** the ZZZ account reads its bidding history
- **THEN** it receives only activity created through the ZZZ-pinned entrypoint
- **AND** no Grade10 private event or maximum is returned

#### Scenario: bidding-history-SC-17 - An anonymous reader cannot read private history

- **WHEN** a request without a storefront session attempts to read an account
  index or combined history
- **THEN** Grade10 refuses the request
- **AND** the anonymous public auction response gains no private field

#### Scenario: bidding-history-SC-18 - Reading history is inert

- **GIVEN** any retained bidding history
- **WHEN** an authorized collector reads or pages it
- **THEN** no bid, maximum, hold, listing standing, or auction close changes

### Requirement: Grade10 presents bidding history at the account's bids address

The Grade10 site SHALL serve the signed-in bidding index at `/bids` inside the
existing site chrome. A signed-out visitor SHALL be sent through the existing
sign-in flow with `/bids` as the return destination. ZZZ SHALL NOT gain a screen
from this change.

The page SHALL default to **Active**, offer **Active** and **Completed** filters,
and show each listing as a summary that can expand its combined history without
leaving the page. An open listing on which the collector can bid again SHALL
offer a route back to that listing. Opening the listing or moving between
history pages SHALL use application navigation without a document reload.

The page SHALL format money from minor units and currency, and dates and times
in the reader's locale. It SHALL distinguish initial loading, empty Active,
empty Completed, page failure, history loading, history failure, and further
pages without blanking summaries that are already available.

#### Scenario: bidding-history-SC-19 - A signed-in collector opens active bids

- **GIVEN** a signed-in Grade10 collector with active and completed bidding
  activity
- **WHEN** the collector opens `/bids`
- **THEN** the page shows the Active summaries inside the existing site chrome
- **AND** the collector can switch to Completed without a document reload

#### Scenario: bidding-history-SC-20 - An outbid summary leads to its explanation and listing

- **GIVEN** an open listing on which the collector is outbid
- **WHEN** the collector expands that summary
- **THEN** the combined history identifies the public movement that outbid
  **You**
- **AND** the page offers a route to the still-open listing

#### Scenario: bidding-history-SC-21 - A signed-out visitor preserves the destination

- **WHEN** a signed-out visitor opens `/bids`
- **THEN** the Grade10 site starts its existing sign-in flow
- **AND** successful sign-in returns the collector to `/bids`

#### Scenario: bidding-history-SC-22 - An empty filter is explicit

- **GIVEN** a signed-in collector with no entries in the selected filter
- **WHEN** the filter finishes loading
- **THEN** the page names that the selected bidding history is empty
- **AND** it does not show a loading placeholder or failure message

#### Scenario: bidding-history-SC-23 - Initial loading reserves the bidding list

- **GIVEN** a signed-in collector opening `/bids`
- **WHEN** the selected index page has not answered yet
- **THEN** the page shows a labeled bidding-history loading state inside the
  site chrome
- **AND** it does not claim that the selected filter is empty or failed

#### Scenario: bidding-history-SC-24 - An index failure is retryable

- **GIVEN** a signed-in collector opening `/bids`
- **WHEN** the selected index page fails to load
- **THEN** the page shows a retryable bidding-history error
- **AND** it does not claim that the selected filter is empty

#### Scenario: bidding-history-SC-25 - Expanding history preserves its summary while loading

- **GIVEN** a visible bidding summary
- **WHEN** the collector expands it and its combined history has not answered
  yet
- **THEN** that summary stays visible with a labeled history-loading state
- **AND** the page does not show an empty history or failure message

#### Scenario: bidding-history-SC-26 - Loading more preserves entries already shown

- **GIVEN** a visible index or combined history page with a further cursor
- **WHEN** the collector requests the next page
- **THEN** the entries already shown remain visible while the next page loads
- **AND** the control cannot submit the same next-page request twice

#### Scenario: bidding-history-SC-27 - A history failure preserves the listing summary

- **GIVEN** the bidding index is visible
- **WHEN** one expanded listing history fails to load
- **THEN** that summary remains visible with a retryable history error
- **AND** other summaries and their histories remain usable

#### Scenario: bidding-history-SC-28 - ZZZ receives no bidding-history page

- **WHEN** this change is delivered
- **THEN** the ZZZ storefront has no new bidding-history route or screen
- **AND** its authenticated backend remains compatible with the shared history
  contract
