## Feature set

- What a build carries
  - Decided at build: the set is fixed when the build is made, never read per
    request
  - Store surfaces: the store, its collections, a card's page, the shop's two
    handed-out addresses, the cart, the checkout, and a collector's order
    history and order detail
  - Vault surfaces: the vault, a case's page, the signing ceremony and the
    identity check
  - Booking surfaces: booking a visit, the private link from a booking's
    mail, and a collector's own visits
  - Profile surface: the account page on its own. Order history and order
    detail keep the store's gate rather than the profile's
  - Membership surfaces: the membership page and the join page, one set that
    is carried or withheld whole
  - Labs: the demonstration surfaces and the unapproved refund and shipping
    drafts, carried in development and staging
  - Everything else: the auction, the front door, the terms and the privacy
    page, and sign-in, carried on every lane
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

## MODIFIED Requirements

### Requirement: Each waiting product waits for its own launch

Five products wait for the public — the store, the vault, booking a visit,
the profile and membership — and each moves as one set on the lanes stated
for it. The auction is not one of them: it is carried on every lane already.

**The five sets** - The surfaces of each waiting product are:

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
| Vault | Vault | The vault's own address, and a collector's cases beneath it |
| Vault | Case page | One case's own page |
| Vault | Signing ceremony | Where a case is signed on the shop's iPad |
| Vault | Identity check | The identity check a case asks for |
| Booking | Booking | Booking a visit |
| Booking | Booking link | The private link a booking's mail carries |
| Booking | Visits | A collector's own visits |
| Profile | Profile | The account page on its own |
| Membership | Membership | The member's own page |
| Membership | Join | Joining the programme |

**Order history and order detail keep the store's gate** - Order history and
order detail belong to the store's set alone; whether a build carries the
profile SHALL change neither. A build that carries the store but not the
profile SHALL still answer both wherever the store's set is carried.

**All or none** - A build SHALL carry every surface of a product's set or none
of it.

**One set at a time** - Each product's set SHALL be decided on its own, and
carrying one SHALL NOT carry another.

**Which lanes** - Which lanes carry each set SHALL be decided by the deploy
environment the build is made for, never by the stage the site is served at:

| Lane | Store | Vault | Booking | Profile | Membership | Labs | Every other surface |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Development | carried | carried | carried | carried | carried | carried | carried |
| Staging | carried | carried | carried | carried | carried | carried | carried |
| Preview | not carried | not carried | not carried | not carried | not carried | not carried | carried |
| Production | not carried | not carried | not carried | not carried | not carried | not carried | carried |

**Labs** - The labs are the demonstration surfaces and the refund and shipping
drafts nobody has approved.

**Every other surface** - Every other surface — the auction, the front door,
the terms and the privacy page, and sign-in — SHALL be carried on every lane.

#### Scenario: grade10-site-site-carried-surfaces-SC-20 - A public build carries none of the three waiting products
**Serves:** grade10-site-site-carried-surfaces-US-05 - the collector who reaches grade10.com before any of the three has opened

- **GIVEN** a build made for production
- **WHEN** a collector opens the site
- **THEN** no surface of the store, the vault or booking answers, at any of
  their addresses

#### Scenario: grade10-site-site-carried-surfaces-SC-21 - The preview host withholds what production withholds
**Serves:** grade10-site-site-carried-surfaces-US-05 - the same three shut products at the quieter address the preview host serves

- **GIVEN** a build made for preview
- **WHEN** a collector opens an address of any of the three
- **THEN** it answers as the production build does, carrying none of the
  three sets

#### Scenario: grade10-site-site-carried-surfaces-SC-22 - Staging carries all three waiting products
**Serves:** grade10-site-site-carried-surfaces-US-08 - the collector working a product on the lane it is open on

- **GIVEN** a build made for staging
- **WHEN** a collector opens each surface of the store, the vault and booking
- **THEN** every one of them answers

#### Scenario: grade10-site-site-carried-surfaces-SC-23 - The labs answer on development and staging, and nowhere the public reaches
**Serves:** What a build carries - the demonstration pages and the unapproved drafts reached only where they are worked on

- **GIVEN** a build made for preview or production
- **WHEN** a collector opens a labs address
- **THEN** no labs surface answers
- **AND** a development or a staging build answers each of them

#### Scenario: grade10-site-site-carried-surfaces-SC-24 - The holding site is carried on every lane
**Serves:** grade10-site-site-carried-surfaces-US-05 - the collector who finds the rest of the site whole while the five products are shut

- **GIVEN** a build made for production
- **WHEN** a collector opens the auction, the front door, the terms, the
  privacy page, or sign-in
- **THEN** each answers as it does on every other lane

#### Scenario: grade10-site-site-carried-surfaces-SC-35 - The profile waits on the same lanes the store, the vault and booking wait on
**Serves:** grade10-site-site-carried-surfaces-US-05 - the collector who reaches grade10.com before the profile has opened

- **GIVEN** a build made for production or preview
- **WHEN** a collector opens the profile's own address
- **THEN** no profile surface answers
- **AND** a build made for development or staging answers it

#### Scenario: grade10-site-site-carried-surfaces-SC-36 - Order history and order detail answer without the profile
**Serves:** grade10-site-site-carried-surfaces-US-06 - the collector whose account page is withheld but whose mailed order link still answers, because order history and order detail carry the store's gate alone

- **GIVEN** a build that carries the store's set but not the profile
- **WHEN** a collector opens their order history or one of their orders
- **THEN** the order history and the order detail answer
- **AND** the profile's own address is not found

#### Scenario: grade10-site-site-carried-surfaces-SC-38 - Membership waits on the same lanes the other waiting products wait on
**Serves:** grade10-site-site-carried-surfaces-US-05 - the collector who reaches grade10.com before membership has opened

- **GIVEN** a build made for production or preview
- **WHEN** a collector opens the membership page or the join page
- **THEN** neither surface answers
- **AND** a build made for development or staging answers both

#### Scenario: grade10-site-site-carried-surfaces-SC-39 - Membership and join carry or withhold together
**Serves:** grade10-site-site-carried-surfaces-US-08 - the collector who follows the membership page's link to join, or the join page's link back, and finds the other side of that link exactly as carried as the page they left

- **GIVEN** any build this table describes
- **WHEN** either the membership page or the join page is carried
- **THEN** the other is carried too
- **AND** where one is withheld the other is withheld with it

### Requirement: Where a product is carried it behaves as it is specified to

Carrying decides whether a product is there, never how it behaves.

**Unchanged** - A build that carries a product SHALL answer, link and work at
every surface in that product's set exactly as the product's own capabilities
require; which lanes carry the set SHALL change no behaviour on a lane that
carries it.

**One line per product** - Opening a product SHALL be a change to the lanes
carrying that product's set and to nothing else: every surface in the set
SHALL start answering together, no surface outside it SHALL change the lanes
it is carried on, and the other four waiting products SHALL stay on the
lanes already stated for them.

#### Scenario: grade10-site-site-carried-surfaces-SC-25 - Staging works as it did before
**Serves:** grade10-site-site-carried-surfaces-US-08 - the collector who buys a card, opens a case and books a visit in one sitting

- **GIVEN** a build made for staging
- **WHEN** a collector buys through the store, opens a vault case and books a
  visit
- **THEN** each surface behaves as its own capability requires, with nothing
  altered by the lanes that do not carry it

#### Scenario: grade10-site-site-carried-surfaces-SC-26 - A product opens for all of its surfaces at once
**Serves:** Where a product is open - the day a product opens, one statement moves and its whole set follows it

- **GIVEN** a lane that does not carry the vault's set
- **WHEN** that lane is stated to carry it
- **THEN** every surface in the vault's set answers on it
- **AND** no surface outside the set changes the lanes it is carried on

#### Scenario: grade10-site-site-carried-surfaces-SC-27 - The other waiting products stay shut while one opens
**Serves:** Where a product is open - the launches still to come, each waiting on its own line rather than on the first one

- **GIVEN** a build made for production, carrying none of the five waiting
  sets
- **WHEN** production is stated to carry the vault's set alone
- **THEN** every vault surface answers on it
- **AND** no store, booking, profile or membership surface answers
