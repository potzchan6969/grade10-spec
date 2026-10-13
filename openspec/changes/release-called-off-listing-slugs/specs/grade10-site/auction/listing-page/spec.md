## Feature set

- Lot address
  - Server-rendered lot page: the lot's name, description, sale and bidding
    standing are in the response HTML before any script runs
  - One lot per address: two lot addresses answer with their own lot, their own
    title, meta description and `og:url`
- Shared link preview
  - Open Graph per lot: `og:title`, `og:description` and `og:url` name that lot
    and its own canonical address rather than the auction catalogue
- Unknown lot refusal
  - Catalogue decides: whether an id names a published lot is asked of the
    catalogue at the moment the address is asked for
  - Not-found answer: an address naming no published lot answers 404 with the
    site's not-found surface, never an empty lot page
- Live lot handover
  - Served content persists: once scripts run the same lot is on screen and
    nothing it showed is replaced by a loading placeholder
  - Clock values carry on: a value that follows the clock continues from what
    was served rather than contradicting it
- Watching a lot
  - Watch from the page: a collector marks the lot they are reading, and nothing else on the page moves
  - Watching a lot - the control acts on the addressed lot
  - Watching a lot - watching changes nothing else on the page
  - After bidding, Watching stays locked
  - Closed lot has no watch control
- Catalogue and sitemap
  - Opened from the catalogue: the catalogue reaches a lot's own address
    without a page load
  - Lots in the sitemap: every lot the catalogue holds is listed when the
    sitemap is fetched, and none is an unfilled parameter
- Live lot updates
  - Without a reload: another page's accepted bid, an extension or a close
    shows with the new price, bid count and close
  - Own standing follows: when the lot's version rises, the page reads the
    viewer's own standing again, so Outbid shows without a reload while live
    updates stay anonymous
  - Polling fallback: a page that cannot hold a live line still catches up
- One service clock
  - Service time: the countdown runs on the auction service's clock, whatever
    the device's clock says
  - Probed again: after sleep, a reconnect or a return to the tab, and a
    correction under a second never makes the countdown jump up
  - Rounds up: the last second never reads 0 while the lot takes bids
- Close and result
  - Closed until recorded: past the close, the page shows the existing Closed
    state with no result until the close is recorded
  - Result from the record: Won, Did not win or Unsold comes from the recorded
    result, never from the page's own clock
  - Existing words only: Extended bidding for an extension, and a bid refused
    past the close in the bid form's own words
- Recent bids outcome
  - Winner after close: a closed sold lot crowns its winning public row; a live lot crowns none
  - Equal-max tip: a public row tied on amount with a row above it carries the earlier-leads tip
  - Avatar letter: each public Recent Bids avatar uses the email-derived letter from the public listing and live payloads; the readable label stays Bidder N
- Public identifier
  - Code-backed address: the canonical address ends in the lower-case listing
    code, without exposing a separate listing-code field or a code-only route
  - Title stays the reference: a collector and support continue to identify
    and quote a lot by its title and its address, exactly as before the
    listing code existed
  - Called-off address: the original slug becomes available for reuse; an
    eligible new holder answers there, otherwise the address is not found

## REMOVED Feature set

- Public identifier
  - Canonical address:

## MODIFIED Requirements

### Requirement: An address that names no lot is refused

The catalogue SHALL be what decides whether an id names a published lot,
asked when the address is asked for. An address under the auction's lots
naming no published lot SHALL answer with status 404 and the site's not-found
screen, never an empty lot page and never the catalogue.

The address SHALL be resolved against the current slug holder. A draft,
created or called-off lot SHALL NOT answer as a public lot. A called-off
listing's released address SHALL answer 404 when no published, closed or
settled listing now holds it. When an eligible new listing holds the address,
the response SHALL serve that new listing with its own title, description
and canonical metadata. The same outcome SHALL apply to server-rendered
responses and client-fetched listing data.

<!-- trace:scenario id=g10.auction-listing-page.SC-s88 rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-04 - An id the catalogue publishes no lot for
**Serves:** grade10-site-auction-listing-page-US-03 - Collector opens an address that names no lot

- **WHEN** an address under the auction's lots naming no published lot is
  fetched
- **THEN** the response has status 404
- **AND** a collector opening it sees the site's Page not found screen

<!-- trace:scenario id=g10.auction-listing-page.SC-jj1 rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-05 - A lot the catalogue publishes answers
**Serves:** grade10-site-auction-listing-page-US-03 - Collector opens an address that names no lot

- **GIVEN** a lot the catalogue publishes
- **WHEN** its address is fetched
- **THEN** the response has status 200 and carries that lot's page

<!-- trace:scenario id=g10.auction-listing-page.SC-c13 rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-19 - A hidden lot's address shows Page not found
**Serves:** grade10-site-auction-listing-page-US-03 - Collector opens an address that names no lot

- **GIVEN** a draft lot that is not published
- **WHEN** an address naming that lot is fetched
- **THEN** the response has status 404
- **AND** a collector opening it sees the site's Page not found screen

<!-- trace:scenario id=g10.auction-listing-page.SC-b49 rev=1 -->
#### Scenario: g10.auction-listing-page.SC54 - A released address with no holder is not found
**Serves:** grade10-site-auction-listing-page-US-03 - the collector opens the former address of a withdrawn lot

- **GIVEN** a called-off lot has released its former slug and no other listing holds it
- **WHEN** a collector fetches the former address without scripts and then requests the same address through client navigation
- **THEN** the served response is 404 with Page not found; client lookup returns no public lot and the existing not-found surface, with no alias or redirect to the called-off lot

<!-- trace:scenario id=g10.auction-listing-page.SC-l9n rev=1 -->
#### Scenario: g10.auction-listing-page.SC55 - A reused address serves the new public holder
**Serves:** grade10-site-auction-listing-page-US-01 - the collector reads the lot currently offered at the shared address

- **GIVEN** another listing has taken a called-off lot's former slug and is published, closed or settled
- **WHEN** a collector fetches that address without scripts and reads it after scripts load
- **THEN** the served page, title, description, canonical URL and Open Graph metadata name the new holder; client-fetched data and the hydrated page name that same new lot

<!-- trace:scenario id=g10.auction-listing-page.SC-w3i rev=1 -->
#### Scenario: g10.auction-listing-page.SC56 - A draft or created holder remains private
**Serves:** grade10-site-auction-listing-page-US-03 - the collector follows a released address before its new holder is public

- **GIVEN** a draft or created listing holds the original slug released by a called-off lot
- **WHEN** the address is fetched and its client-fetched lot data is requested
- **THEN** the response is 404 with Page not found and no public lot data; neither the new private listing nor the called-off lot is exposed

## RENAMED Requirements

- FROM: `### Requirement: The listing code is only exposed through the canonical address`
- TO: `### Requirement: Listing code remains separate from public address lookup`

**Reason** - The [owner's address decision](../../../../decisions.md#decisions), confirmed in [issue 956](https://github.com/9gag/grade10/issues/956#issuecomment-6119982504), retires permanent direct access to the called-off lot. This requirement included that exception and its canonical-retention scenario.

**Migration** - Rename this requirement to "Listing code remains separate from public address lookup" below. Preserve its code visibility, metadata, support-reference and code-only refusal rules, and the existing scenario identities that prove them. Retire only the called-off canonical-retention scenario; former addresses follow current-holder lookup. The complete target block below is the native rename replacement; its existing scenarios retain their permanent identities.

### Requirement: Listing code remains separate from public address lookup

Every listing carries a stable opaque listing code, allocated on its first
saved draft. A generated canonical address ends with that code in lower case;
the public page does not make the code a separate field or an alternate route.

- **Canonical address** - A listing that keeps its generated slug SHALL answer
  at `/auction/listings/<normalized title>-<lowercase code>`. The canonical
  URL and `og:url` SHALL use that address.
- **No separate field** - The server-rendered page, embedded state,
  client-fetched data, visible page fields, `og:title`, `og:description`, page
  title and meta description SHALL NOT expose a labelled listing-code or
  payment-reference field. A previously cached preview MAY persist; Grade10
  provides no purge or regeneration guarantee.
- **Sitemap** - No sitemap entry SHALL expose a listing-code field.
- **Not-found response** - The response for an address naming no listing or a
  draft lot SHALL NOT contain the listing code, including in any error detail.
- **Does not resolve as an address** - The listing code SHALL NOT work as an
  alternate way to reach the lot's address; fetching the auction's
  lot-address path with the listing code in place of the lot's own address
  SHALL answer the same as any address naming no published lot.
- **Called-off address** - Calling a listing off SHALL release its original
  slug. The address SHALL follow current-holder lookup under "An address
  that names no lot is refused". The listing code SHALL remain permanently
  reserved, remain a non-route and SHALL NOT be accepted as an alternate
  public address. Explicit hard deletion is outside this requirement.
- **Stays true once an order exists** - Once the code becomes the order's
  payment reference on other surfaces, this capability SHALL continue to
  expose it only through the canonical URL suffix.

<!-- trace:scenario id=g10.auction-listing-page.SC-rop rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-20 - The served response uses the generated canonical address
**Serves:** Public identifier - the collector opens the code-backed canonical address without receiving a separate identifier field

- **GIVEN** a published lot with generated slug `charizard-psa-10-lk423`
- **WHEN** its address is fetched and no script executes
- **THEN** the canonical address is `/auction/listings/charizard-psa-10-lk423`
- **AND** the response exposes no labelled listing-code or payment-reference field

<!-- trace:scenario id=g10.auction-listing-page.SC-oq9 rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-21 - A shared lot preview uses the canonical address
**Serves:** grade10-site-auction-listing-page-US-10 - Collector shares the lot by its title and canonical URL

- **GIVEN** a published lot with generated slug `charizard-psa-10-lk423`
- **WHEN** a preview fetcher reads the lot's address
- **THEN** `og:url` is `/auction/listings/charizard-psa-10-lk423`
- **AND** `og:title`, `og:description`, the page title and meta description contain no labelled listing-code or payment-reference field

<!-- trace:scenario id=g10.auction-listing-page.SC-2d9 rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-22 - Client-fetched lot data carries no separate listing code
**Serves:** Public identifier - the page does not expose the code as data apart from its canonical address

- **GIVEN** a published lot with its listing code allocated
- **WHEN** scripts finish loading and the page's client code requests lot
  data over the network
- **THEN** no response body carries a separate listing-code or payment-reference field

<!-- trace:scenario id=g10.auction-listing-page.SC-51n rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-23 - Support resolves a lot from its title alone
**Serves:** grade10-site-auction-listing-page-US-11 - Collector contacts support about a lot and is identified by title, not a code neither of them has

- **GIVEN** a collector contacting support about a published lot
- **WHEN** support looks up the lot the collector names
- **THEN** support identifies it from the lot's title and address
- **AND** neither the collector nor support needs or is shown the listing
  code to do so

<!-- trace:scenario id=g10.auction-listing-page.SC-suj rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-24 - A not-found response carries no listing code
**Serves:** Public identifier - the guard extending to the refusal path, not only lots that resolve

- **GIVEN** an address under the auction's lots naming no published lot
- **WHEN** the address is fetched
- **THEN** the response is the site's Page not found screen
- **AND** nothing in the response, including any error detail, names a
  listing code

<!-- trace:scenario id=g10.auction-listing-page.SC-57v rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-25 - The page does not display the listing code once scripts run
**Serves:** Public identifier - the page keeps the code out of labelled collector-facing fields after scripts finish

- **GIVEN** a published lot's generated canonical address
- **WHEN** scripts finish running
- **THEN** the same lot remains on screen with its served title, description
  and standing
- **AND** neither the rendered page nor its current source contains a labelled listing-code or payment-reference field

<!-- trace:scenario id=g10.auction-listing-page.SC-kfl rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-26 - A listing code does not resolve as a lot address
**Serves:** Public identifier - the guard against the code working as another way to reach or identify a lot

- **GIVEN** a published lot with its listing code allocated
- **WHEN** the auction's lot-address path is fetched with that listing code
  in place of the lot's own address
- **THEN** the response answers the same as any address naming no published
  lot
- **AND** the site's not-found screen is shown, not that lot's page

<!-- trace:scenario id=g10.auction-listing-page.SC-dc3 rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-27 - A public listing keeps the code out of labelled fields once an order exists
**Serves:** grade10-site-auction-listing-page-US-11 - Collector contacts support about a won lot without a separate code field on the listing page

- **GIVEN** a lot whose auction closed with a winning bid, so an order now
  exists on it
- **WHEN** its address is fetched on grade10-site
- **THEN** the response and share preview use the canonical address
- **AND** neither the response, its share preview, nor any client-fetched
  data carries a labelled listing-code or payment-reference field
