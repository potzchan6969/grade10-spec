## Purpose
Which surfaces a build of the grade10 site carries, and what the site does
about an address, a link and a crawl entry for one it does not. `navigation`
owns which surface an address resolves to, `page-shell` what the chrome may
link, and `crawlable-pages` what a crawler is offered; this capability
decides the set all three read, so a product that has not opened is absent
rather than hidden.

## Feature set

- What a build carries
  - Decided at build: the set is fixed when the build is made, never read per
    request
  - Store surfaces: the store, its collections, a card's page, the shop's two
    handed-out addresses, the cart, the checkout, and a collector's order
    history and order detail
  - Auction surfaces: the auction, a lot's page, the watchlist, a collector's
    bids, and the winner's order and invoice
  - Vault surfaces: the vault, a case's page, the signing ceremony and the
    identity check
  - Booking surfaces: booking a visit, the private link from a booking's
    mail, and a collector's own visits
  - Labs: the demonstration surfaces and the unapproved refund and shipping
    drafts, carried in development alone
  - Everything else: the front door, the terms and the privacy page,
    membership, join, sign-in and the profile, carried on every lane
- An address nothing carries
  - Not found: it answers with the not-found surface and a 404
  - Every address beneath it: the addresses under an uncarried surface answer
    the same way
- Nothing names an absent surface
  - Header: no navigation item, no cart control and no account menu item for
    a surface the build does not carry
  - Footer: no shop column and no link to a surface the build does not carry
  - Front door: no button and no card for a product the build does not carry
  - Crawler: robots.txt and the sitemap name only what the build answers
- Where a product is open
  - Unchanged: every surface answers, links and works exactly as its own
    capability requires on a lane that carries it
  - One line per product: the lanes carrying each product's set are stated
    once, and each product opens on its own date

## ADDED Requirements

### Requirement: Each product waits for its own launch

Four products wait for the public — the store, the auction, the vault and
booking a visit — and each moves as one set on the lanes stated for it.

**The four sets** - The surfaces of each product are:

| Product | Surface | What it answers |
| --- | --- | --- |
| Store | Store | The store's own address, and the collections beneath it |
| Store | Card page | One card's own page |
| Store | Product address | The address the shop hands out for a card |
| Store | Collection address | The address the shop hands out for a collection |
| Store | Cart | The basket a collector fills |
| Store | Checkout | Where a collector pays |
| Store | Order history | A collector's own orders |
| Store | Order detail | One of a collector's orders |
| Auction | Auction | The auction's own address, and the catalogue beneath it |
| Auction | Lot page | One lot's own page |
| Auction | Watchlist | The lots a collector is watching |
| Auction | Bids | A collector's own bids |
| Auction | Winner order | One lot a collector won |
| Auction | Winner invoice | The invoice for that lot |
| Vault | Vault | The vault's own address, and a collector's cases beneath it |
| Vault | Case page | One case's own page |
| Vault | Signing ceremony | Where a case is signed on the shop's iPad |
| Vault | Identity check | The identity check a case asks for |
| Booking | Booking | Booking a visit |
| Booking | Booking link | The private link a booking's mail carries |
| Booking | Visits | A collector's own visits |

**All or none** - A build SHALL carry every surface of a product's set or none
of it.

**One set at a time** - Each product's set SHALL be decided on its own, and
carrying one SHALL NOT carry another.

**Which lanes** - Which lanes carry each set SHALL be decided by the deploy
environment the build is made for, never by the stage the site is served at:

| Lane | Store | Auction | Vault | Booking | Labs | Every other surface |
| --- | --- | --- | --- | --- | --- | --- |
| Development | carried | carried | carried | carried | carried | carried |
| Staging | carried | carried | carried | carried | not carried | carried |
| Preview | not carried | not carried | not carried | not carried | not carried | carried |
| Production | not carried | not carried | not carried | not carried | not carried | carried |

**Labs** - The labs are the demonstration surfaces and the refund and shipping
drafts nobody has approved.

**Every other surface** - Every other surface — the front door, the terms and
the privacy page, the membership and join pages, sign-in and the profile —
SHALL be carried on every lane.

#### Scenario: grade10-site-site-carried-surfaces-SC-20 - A public build carries none of the four products
**Serves:** grade10-site-site-carried-surfaces-US-05 - the collector who reaches grade10.com before any of the four has opened

- **GIVEN** a build made for production
- **WHEN** a collector opens the site
- **THEN** no surface of the store, the auction, the vault or booking answers,
  at any of their addresses

#### Scenario: grade10-site-site-carried-surfaces-SC-21 - The preview host withholds what production withholds
**Serves:** grade10-site-site-carried-surfaces-US-05 - the same four shut products at the quieter address the preview host serves

- **GIVEN** a build made for preview
- **WHEN** a collector opens an address of any of the four
- **THEN** it answers as the production build does, carrying none of the four
  sets

#### Scenario: grade10-site-site-carried-surfaces-SC-22 - Staging carries all four products
**Serves:** grade10-site-site-carried-surfaces-US-08 - the collector working a product on the lane it is open on

- **GIVEN** a build made for staging
- **WHEN** a collector opens each surface of the store, the auction, the vault
  and booking
- **THEN** every one of them answers

#### Scenario: grade10-site-site-carried-surfaces-SC-23 - The labs answer on a development lane alone
**Serves:** What a build carries - the demonstration pages and the unapproved drafts reached only where they are worked on

- **GIVEN** a build made for staging, preview or production
- **WHEN** a collector opens a labs address
- **THEN** no labs surface answers
- **AND** a development build answers each of them

#### Scenario: grade10-site-site-carried-surfaces-SC-24 - The holding site is carried on every lane
**Serves:** grade10-site-site-carried-surfaces-US-05 - the collector who finds the rest of the site whole while the four products are shut

- **GIVEN** a build made for production
- **WHEN** a collector opens the front door, the terms, the privacy page, the
  membership or join pages, sign-in or their profile
- **THEN** each answers as it does on every other lane

### Requirement: Where a product is carried it behaves as it is specified to

Carrying decides whether a product is there, never how it behaves.

**Unchanged** - A build that carries a product SHALL answer, link and work at
every surface in that product's set exactly as the product's own capabilities
require; which lanes carry the set SHALL change no behaviour on a lane that
carries it.

**One line per product** - Opening a product SHALL be a change to the lanes
carrying that product's set and to nothing else: every surface in the set
SHALL start answering together, no surface outside it SHALL change the lanes
it is carried on, and the other three products SHALL stay on the lanes already
stated for them.

#### Scenario: grade10-site-site-carried-surfaces-SC-25 - Staging works as it did before
**Serves:** grade10-site-site-carried-surfaces-US-08 - the collector who buys a card, bids on a lot, opens a case and books a visit in one sitting

- **GIVEN** a build made for staging
- **WHEN** a collector buys through the store, bids on a lot, opens a vault
  case and books a visit
- **THEN** each surface behaves as its own capability requires, with nothing
  altered by the lanes that do not carry it

#### Scenario: grade10-site-site-carried-surfaces-SC-26 - A product opens for all of its surfaces at once
**Serves:** Where a product is open - the day a product opens, one statement moves and its whole set follows it

- **GIVEN** a lane that does not carry the auction's set
- **WHEN** that lane is stated to carry it
- **THEN** every surface in the auction's set answers on it
- **AND** no surface outside the set changes the lanes it is carried on

#### Scenario: grade10-site-site-carried-surfaces-SC-27 - Three products stay shut while the fourth opens
**Serves:** Where a product is open - the three launches still to come, each waiting on its own line rather than on the first one

- **GIVEN** a build made for production, carrying none of the four sets
- **WHEN** production is stated to carry the auction's set alone
- **THEN** every auction surface answers on it
- **AND** no store, vault or booking surface answers

## MODIFIED Requirements

### Requirement: An address of an uncarried surface is not found

An uncarried address is refused the way an unknown address is, whoever asks.

**Not found** - An address of a surface a build does not carry, and every
address beneath it, SHALL be an address that build does not hold: it answers
with the not-found surface and status 404.

**No redirect** - The build SHALL NOT redirect such an address, and SHALL NOT
answer it with another surface standing in for the one it does not carry.

**Whoever asks** - The answer SHALL NOT depend on who is asking or in which
language: a collector holding a session reads the same refusal as one holding
none and keeps their session, and the address under a language prefix is
refused in that language.

#### Scenario: grade10-site-site-carried-surfaces-SC-08 - A store address on the public site is not found
**Serves:** grade10-site-site-carried-surfaces-US-02 - the collector following a bookmark or a link to a shop the build has no page for

- **GIVEN** a build made for production
- **WHEN** a collector opens the store's own address
- **THEN** the response has status 404 and the not-found surface renders,
  naming the address that failed

#### Scenario: grade10-site-site-carried-surfaces-SC-09 - Every address beneath answers the same way
**Serves:** grade10-site-site-carried-surfaces-US-02 - the collector whose link points deep inside the shop rather than at its front

- **GIVEN** a build made for production
- **WHEN** a collector opens an address beneath the store, such as a
  collection, a card's own page, the cart, the checkout or an order
- **THEN** the response has status 404 and the not-found surface renders

#### Scenario: grade10-site-site-carried-surfaces-SC-10 - An uncarried address is never redirected
**Serves:** grade10-site-site-carried-surfaces-US-02 - the collector who learns the page is absent rather than being moved elsewhere

- **GIVEN** a build made for production
- **WHEN** a collector opens a store address
- **THEN** the site sends them nowhere else, and the address they asked for is
  the address they are left on

#### Scenario: grade10-site-site-carried-surfaces-SC-18 - A session changes nothing about the refusal
**Serves:** grade10-site-site-carried-surfaces-US-02 - the collector who signed in for the auction and still finds no shop

- **GIVEN** a build made for production, and a collector holding a session
- **WHEN** they open a store address
- **THEN** the response has status 404 and the not-found surface renders
- **AND** they are neither asked to sign in nor signed out

#### Scenario: grade10-site-site-carried-surfaces-SC-19 - A prefixed store address is refused in its own language
**Serves:** grade10-site-site-carried-surfaces-US-02 - the collector reading the site in their own language and following a shop link in it

- **GIVEN** a build made for production
- **WHEN** a collector opens a store address under a language prefix the site
  answers in
- **THEN** the response has status 404 and the not-found surface renders in
  that language

#### Scenario: grade10-site-site-carried-surfaces-SC-28 - A withheld product's address on the public site is not found
**Serves:** grade10-site-site-carried-surfaces-US-06 - the collector following an auction, vault or booking link the public build has no page for

- **GIVEN** a build made for production
- **WHEN** a collector opens a lot's page, the watchlist, their bids, a vault
  case, the identity check, booking a visit or their visits
- **THEN** the response has status 404 and the not-found surface renders,
  naming the address that failed

#### Scenario: grade10-site-site-carried-surfaces-SC-29 - A mailed link into a withheld product is refused like any other address
**Serves:** grade10-site-site-carried-surfaces-US-06 - the collector opening a link a mail handed them rather than an address they typed

- **GIVEN** a build made for production
- **WHEN** a collector opens the signing ceremony's link or the private link
  from a booking's mail
- **THEN** the response has status 404 and the not-found surface renders
- **AND** the token the link carries changes nothing about the answer

### Requirement: Nothing in a build names a surface it does not carry

The chrome offers no way into a surface the build has no page for.

**No destination** - A surface a build does not carry SHALL NOT be a
destination anything in that build names.

**Header, footer, front door** - For a product a build does not carry the
header SHALL show no navigation item, no cart control and no account menu
item, the footer SHALL show no shop column and no link into that product, and
the front door SHALL show no button and no card for it.

**Region stays** - The front door's card row SHALL remain part of the page
and hold no card, rather than being removed, where every product it would
show a card for is withheld. A region dedicated to a single product's own
control, such as the footer's shop column, is unaffected and keeps behaving
as already specified.

#### Scenario: grade10-site-site-carried-surfaces-SC-11 - The header names no shop
**Serves:** grade10-site-site-carried-surfaces-US-01 - the collector reading the header of a site with nothing to sell them

- **GIVEN** a build made for production
- **WHEN** the header renders on any surface
- **THEN** it offers no store navigation item and no cart control

#### Scenario: grade10-site-site-carried-surfaces-SC-12 - The footer drops the shop column
**Serves:** grade10-site-site-carried-surfaces-US-01 - the collector reading the foot of the page for what the site offers

- **GIVEN** a build made for production
- **WHEN** the footer renders
- **THEN** no shop column appears and no link leads to a store surface

#### Scenario: grade10-site-site-carried-surfaces-SC-13 - The front door offers no way into a shop
**Serves:** grade10-site-site-carried-surfaces-US-01 - the collector meeting the first page of the site before the shop opens

- **GIVEN** a build made for production
- **WHEN** a collector opens the front door
- **THEN** neither the store button nor the store card is there, and nothing
  in its place promises a shop

#### Scenario: grade10-site-site-carried-surfaces-SC-30 - Nothing in the chrome leads to a withheld product
**Serves:** grade10-site-site-carried-surfaces-US-05 - the collector reading the header, the foot of the page and the front door for what the site offers

- **GIVEN** a build made for production
- **WHEN** any surface renders
- **THEN** no navigation item, no header control, no footer link, no
  front-door button and no front-door card leads to the store, the auction,
  the vault or booking

#### Scenario: grade10-site-site-carried-surfaces-SC-31 - The account menu names only what the build answers
**Serves:** grade10-site-site-carried-surfaces-US-07 - the signed-in collector opening the account menu on a public page

- **GIVEN** a build made for production, and a collector holding a session
- **WHEN** they open the account menu
- **THEN** it names no page of a product the build does not carry
- **AND** every item it does name opens an address the build answers

#### Scenario: grade10-site-site-carried-surfaces-SC-33 - The front door's card row renders empty rather than being removed
**Serves:** grade10-site-site-carried-surfaces-US-05 - the collector reading a front door built to hold a card for each of four products

- **GIVEN** a build made for production
- **WHEN** the front door renders
- **THEN** the card row is present on the page and holds no card for the
  store, the auction, the vault or booking

### Requirement: A crawler is offered only what the build carries

A crawler is told only about addresses the build answers.

**Crawl directory** - The robots.txt and the sitemap a build serves SHALL name
only addresses of surfaces that build carries.

**Catalogue-fed sitemap** - A sitemap read from the catalogue when it is
fetched SHALL list a card or a collection only where the build carries the
surface that answers it.

#### Scenario: grade10-site-site-carried-surfaces-SC-14 - A public build's crawl directory names no store address
**Serves:** grade10-site-site-carried-surfaces-US-03 - the crawler building its list of what grade10.com holds

- **GIVEN** a build made for production
- **WHEN** its sitemap and its robots.txt are fetched
- **THEN** neither names a store address

#### Scenario: grade10-site-site-carried-surfaces-SC-15 - A catalogue adds nothing the build cannot answer
**Serves:** grade10-site-site-carried-surfaces-US-03 - the crawler returning to a sitemap that grows with the catalogue behind it

- **GIVEN** a build made for production, and a catalogue that gains a card
- **WHEN** the sitemap is fetched afterwards
- **THEN** that card's address is not listed, and no collection's is

#### Scenario: grade10-site-site-carried-surfaces-SC-32 - A public build's crawl directory names no withheld product
**Serves:** grade10-site-site-carried-surfaces-US-03 - the crawler listing grade10.com while the four products are shut

- **GIVEN** a build made for production
- **WHEN** its sitemap and its robots.txt are fetched
- **THEN** neither names an auction, a vault or a booking address

## REMOVED Requirements

### Requirement: The store surfaces wait for the shop to open

**Reason**: Only the shop waited. The store, the auction, the vault and
booking a visit each wait for their own launch now, so the single store set
and the lane table beside it state the opposite of what the site does: its
`Every other surface` column carries the other three products onto every lane,
and `grade10-site-site-carried-surfaces-SC-07` asserts they answer on
production.

**Migration**: Replaced by "Each product waits for its own launch" in this
capability, which holds all four sets, one lane table for the four and the
labs, and the surfaces every lane carries. Its five scenarios retire.
`grade10-site-site-carried-surfaces-SC-07` is now false and is not reissued;
the store's lanes, the preview host, staging and the labs are carried by
`grade10-site-site-carried-surfaces-SC-20`,
`grade10-site-site-carried-surfaces-SC-21`,
`grade10-site-site-carried-surfaces-SC-22` and
`grade10-site-site-carried-surfaces-SC-23` under the new requirement, and the
surfaces every lane keeps by
`grade10-site-site-carried-surfaces-SC-24`.

### Requirement: Where the store is carried it behaves as it is specified to

**Reason**: The store is one of four products that wait, and opening one has
to leave the other three where they are. A requirement written for the store
alone cannot say that: its `One line to open it` rule names a single opening,
and `grade10-site-site-carried-surfaces-SC-17` anchors on the feature-set
group `Where the shop is open`, which this change renames to `Where a product
is open`.

**Migration**: Replaced by "Where a product is carried it behaves as it is
specified to" in this capability, which holds the same unchanged-behaviour
rule for every carried set and one line per product. Its two scenarios retire;
`grade10-site-site-carried-surfaces-SC-25` carries staging's unchanged
behaviour and `grade10-site-site-carried-surfaces-SC-26` the whole set opening
at once, under the new requirement.
