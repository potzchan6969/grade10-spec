# grade10-site/auction/listing-page Specification

## Feature set

- Public identifier
  - Code-backed address: the canonical address ends in the lower-case listing
    code, without exposing a separate listing-code field or a code-only route
  - Title stays the reference: a collector and support continue to identify
    and quote a lot by its title and its address, exactly as before the
    listing code existed
  - Canonical address: a called-off listing is removed from browse and search
    but remains directly accessible at its canonical address; explicit hard
    deletion is outside this change and its page accessibility is unspecified

## ADDED Requirements

### Requirement: The listing code is only exposed through the canonical address

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
- **Called-off direct address** - Calling a listing off SHALL remove it from
  browse and search while its canonical address remains directly accessible.
  The listing code SHALL remain a non-route and SHALL NOT be accepted as the
  public address. Explicit hard deletion is outside this change; this
  requirement does not state what its page does.
- **Stays true once an order exists** - Once the code becomes the order's
  payment reference on other surfaces, this capability SHALL continue to
  expose it only through the canonical URL suffix.

#### Scenario: grade10-site-auction-listing-page-SC-20 - The served response uses the generated canonical address
**Serves:** Public identifier - the collector opens the code-backed canonical address without receiving a separate identifier field

- **GIVEN** a published lot with generated slug `charizard-psa-10-lk423`
- **WHEN** its address is fetched and no script executes
- **THEN** the canonical address is `/auction/listings/charizard-psa-10-lk423`
- **AND** the response exposes no labelled listing-code or payment-reference field

#### Scenario: grade10-site-auction-listing-page-SC-21 - A shared lot preview uses the canonical address
**Serves:** grade10-site-auction-listing-page-US-10 - Collector shares the lot by its title and canonical URL

- **GIVEN** a published lot with generated slug `charizard-psa-10-lk423`
- **WHEN** a preview fetcher reads the lot's address
- **THEN** `og:url` is `/auction/listings/charizard-psa-10-lk423`
- **AND** `og:title`, `og:description`, the page title and meta description contain no labelled listing-code or payment-reference field

#### Scenario: grade10-site-auction-listing-page-SC-22 - Client-fetched lot data carries no separate listing code
**Serves:** Public identifier - the page does not expose the code as data apart from its canonical address

- **GIVEN** a published lot with its listing code allocated
- **WHEN** scripts finish loading and the page's client code requests lot
  data over the network
- **THEN** no response body carries a separate listing-code or payment-reference field

#### Scenario: grade10-site-auction-listing-page-SC-23 - Support resolves a lot from its title alone
**Serves:** grade10-site-auction-listing-page-US-11 - Collector contacts support about a lot and is identified by title, not a code neither of them has

- **GIVEN** a collector contacting support about a published lot
- **WHEN** support looks up the lot the collector names
- **THEN** support identifies it from the lot's title and address
- **AND** neither the collector nor support needs or is shown the listing
  code to do so

#### Scenario: grade10-site-auction-listing-page-SC-24 - A not-found response carries no listing code
**Serves:** Public identifier - the guard extending to the refusal path, not only lots that resolve

- **GIVEN** an address under the auction's lots naming no published lot
- **WHEN** the address is fetched
- **THEN** the response is the site's Page not found screen
- **AND** nothing in the response, including any error detail, names a
  listing code

#### Scenario: grade10-site-auction-listing-page-SC-25 - The page does not display the listing code once scripts run
**Serves:** Public identifier - the page keeps the code out of labelled collector-facing fields after scripts finish

- **GIVEN** a published lot's generated canonical address
- **WHEN** scripts finish running
- **THEN** the same lot remains on screen with its served title, description
  and standing
- **AND** neither the rendered page nor its current source contains a labelled listing-code or payment-reference field

#### Scenario: grade10-site-auction-listing-page-SC-26 - A listing code does not resolve as a lot address
**Serves:** Public identifier - the guard against the code working as another way to reach or identify a lot

- **GIVEN** a published lot with its listing code allocated
- **WHEN** the auction's lot-address path is fetched with that listing code
  in place of the lot's own address
- **THEN** the response answers the same as any address naming no published
  lot
- **AND** the site's not-found screen is shown, not that lot's page

#### Scenario: grade10-site-auction-listing-page-SC-27 - A public listing keeps the code out of labelled fields once an order exists
**Serves:** grade10-site-auction-listing-page-US-11 - Collector contacts support about a won lot without a separate code field on the listing page

- **GIVEN** a lot whose auction closed with a winning bid, so an order now
  exists on it
- **WHEN** its address is fetched on grade10-site
- **THEN** the response and share preview use the canonical address
- **AND** neither the response, its share preview, nor any client-fetched
  data carries a labelled listing-code or payment-reference field

#### Scenario: grade10-site-auction-listing-page-SC-28 - A called-off listing keeps its canonical address
**Serves:** Public identifier - the canonical address remains usable after the lot leaves browse and search

- **GIVEN** a listing whose code and canonical address were allocated
- **WHEN** the listing is called off before close and its canonical address is
  opened directly
- **THEN** the address still resolves to that listing
- **AND** the listing is absent from browse and search
- **AND** substituting the listing code for the canonical address does not
  resolve the listing

## MODIFIED Requirements

### Requirement: An address that names no lot is refused

The catalogue SHALL be what decides whether an id names a published lot,
asked when the address is asked for. An address under the auction's lots
naming no published lot SHALL answer with status 404 and the site's not-found
screen, never an empty lot page and never the catalogue.

The address of a Draft lot SHALL give the same 404 response, even if it was
once published. A called-off lot's canonical address SHALL continue to serve
its public listing page after it is removed from browse and search, as
`grade10-site/auction/lot-status` defines.

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
