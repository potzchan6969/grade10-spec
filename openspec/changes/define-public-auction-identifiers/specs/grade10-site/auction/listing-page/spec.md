## Feature set

- Public identifier
  - No listing code on the page: the lot's own address, its served response
    and its shared-link preview never carry the listing code, before or
    after scripts run
  - Title stays the reference: a collector and support continue to identify
    and quote a lot by its title and its address, exactly as before the
    listing code existed
  - Canonical address: a called-off listing is removed from browse and search
    but remains directly accessible at its canonical address; explicit hard
    deletion is outside this change and its page accessibility is unspecified

## ADDED Requirements

### Requirement: The listing code stays off the public listing page

Every listing carries a stable opaque listing code, allocated and stored when
the listing is created; on `grade10-site/auction/listing-page` a lot stays
identified by its title and address alone, in every surface this capability
serves.

- **Server-rendered response** - The response HTML for a lot's address SHALL
  NOT contain the listing code, before any script executes.
- **Embedded state** - No embedded state or JSON payload the response carries
  for hydration SHALL contain the listing code.
- **After scripts run** - Nothing that appears once scripts finish running
  SHALL introduce the listing code either; the same lot SHALL stay on screen
  named by its title alone.
- **Share preview** - The lot's `og:title`, `og:description`, `og:url`, page
  title and meta description SHALL NOT contain the listing code.
  A previously cached preview MAY persist; Grade10 provides no purge or
  regeneration guarantee. Every current page and fresh metadata fetch SHALL
  still omit the code and private data.
- **Client-fetched data** - No network response the page's own client code
  requests after scripts run SHALL contain the listing code.
- **Sitemap** - No sitemap entry SHALL contain the listing code.
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
  payment reference on other surfaces, this capability's response, share
  preview and client-fetched data SHALL still not contain it; the lot SHALL
  stay identified here by its title and address alone.

#### Scenario: grade10-site-auction-listing-page-SC-20 - The served response carries no listing code
**Serves:** Public identifier - the guard over what the server sends for a lot's address, both the visible markup and any state it embeds for hydration

- **GIVEN** a published lot with its listing code allocated
- **WHEN** its address is fetched and no script executes
- **THEN** the response HTML contains the lot's title, description and
  bidding standing
- **AND** neither the markup nor any embedded state or JSON payload in the
  response contains the listing code

#### Scenario: grade10-site-auction-listing-page-SC-21 - A shared lot preview carries no listing code
**Serves:** grade10-site-auction-listing-page-US-10 - Collector quotes a published lot by its title and URL, never by an internal code

- **GIVEN** a published lot with its listing code allocated
- **WHEN** a preview fetcher reads the lot's address
- **THEN** `og:title`, `og:description`, `og:url`, the page title and the
  meta description all name the lot by its title
- **AND** none of them contains the listing code

#### Scenario: grade10-site-auction-listing-page-SC-22 - Client-fetched lot data carries no listing code
**Serves:** Public identifier - the guard over data the page's own scripts fetch after load, not only what the server first sent

- **GIVEN** a published lot with its listing code allocated
- **WHEN** scripts finish loading and the page's client code requests lot
  data over the network
- **THEN** no response body it receives contains the listing code

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

#### Scenario: grade10-site-auction-listing-page-SC-25 - The listing code stays absent once scripts run
**Serves:** Public identifier - the guard extending past the server-rendered response into what stays on screen once scripts finish

- **GIVEN** a published lot's address served with its listing code allocated
- **WHEN** scripts finish running
- **THEN** the same lot remains on screen with its served title, description
  and standing
- **AND** neither the rendered page nor its current source contains the
  listing code

#### Scenario: grade10-site-auction-listing-page-SC-26 - A listing code does not resolve as a lot address
**Serves:** Public identifier - the guard against the code working as another way to reach or identify a lot

- **GIVEN** a published lot with its listing code allocated
- **WHEN** the auction's lot-address path is fetched with that listing code
  in place of the lot's own address
- **THEN** the response answers the same as any address naming no published
  lot
- **AND** the site's not-found screen is shown, not that lot's page

#### Scenario: grade10-site-auction-listing-page-SC-27 - The listing code stays absent once an order exists on the lot
**Serves:** grade10-site-auction-listing-page-US-11 - Collector contacts support about a lot they won, still by its title, once the code becomes the order's payment reference elsewhere

- **GIVEN** a lot whose auction closed with a winning bid, so an order now
  exists on it
- **WHEN** its address is fetched on grade10-site
- **THEN** the response still carries only the lot's title and its own
  address
- **AND** neither the response, its share preview, nor any client-fetched
  data for it contains the listing code

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

#### Scenario: grade10-site-auction-listing-page-SC-04 - An id the catalogue publishes no lot for
**Serves:** grade10-site-auction-listing-page-US-03 - Collector opens an address that names no lot

- **WHEN** an address under the auction's lots naming no published lot is
  fetched
- **THEN** the response has status 404
- **AND** a collector opening it sees the site's Page not found screen

#### Scenario: grade10-site-auction-listing-page-SC-05 - A lot the catalogue publishes answers
**Serves:** grade10-site-auction-listing-page-US-03 - Collector opens an address that names no lot

- **GIVEN** a lot the catalogue publishes
- **WHEN** its address is fetched
- **THEN** the response has status 200 and carries that lot's page

#### Scenario: grade10-site-auction-listing-page-SC-19 - A hidden lot's address shows Page not found
**Serves:** grade10-site-auction-listing-page-US-03 - Collector opens an address that names no lot

- **GIVEN** a draft lot that is not published
- **WHEN** an address naming that lot is fetched
- **THEN** the response has status 404
- **AND** a collector opening it sees the site's Page not found screen
