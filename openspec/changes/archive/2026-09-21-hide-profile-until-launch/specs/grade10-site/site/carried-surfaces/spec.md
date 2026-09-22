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
  - Labs: the demonstration surfaces and the unapproved refund and shipping
    drafts, carried in development and staging
  - Everything else: the auction, the front door, the terms and the privacy
    page, membership, join and sign-in, carried on every lane
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

### Requirement: Nothing in a build names a surface it does not carry

Nothing in a build offers a way into a surface it has no page for.

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
  front-door button and no front-door card leads to the store, the vault or
  booking

#### Scenario: grade10-site-site-carried-surfaces-SC-31 - The account menu names only what the build answers
**Serves:** grade10-site-site-carried-surfaces-US-07 - the signed-in collector opening the account menu on a public page

- **GIVEN** a build made for production, and a collector holding a session
- **WHEN** they open the account menu
- **THEN** it names no page of a product the build does not carry
- **AND** every item it does name opens an address the build answers

#### Scenario: grade10-site-site-carried-surfaces-SC-33 - The front door's card row renders empty rather than being removed
**Serves:** grade10-site-site-carried-surfaces-US-05 - the collector reading a front door built to hold a card for each of the three waiting products

- **GIVEN** a build made for production
- **WHEN** the front door renders
- **THEN** the card row is present on the page and holds no card for the
  store, the vault or booking

#### Scenario: grade10-site-site-carried-surfaces-SC-34 - No in-app link points at an absent profile
**Serves:** grade10-site-site-carried-surfaces-US-05 - the collector reading checkout, an order's detail, their order history or the auction winner's order breadcrumb, none of which sends them toward a profile the build does not carry

- **GIVEN** a build that carries the store's set but not the profile
- **WHEN** a collector reaches checkout, an order's detail page, their order
  history, or the auction winner's order breadcrumb
- **THEN** none of them link to the profile

#### Scenario: grade10-site-site-carried-surfaces-SC-37 - In-app links reach the profile once it is carried
**Serves:** grade10-site-site-carried-surfaces-US-08 - the collector who reaches checkout, an order's detail, their order history or the auction winner's order breadcrumb, each still sending them to their account page where the profile is carried

- **GIVEN** a build that carries both the store's set and the profile
- **WHEN** a collector reaches checkout, an order's detail page, their order
  history, or the auction winner's order breadcrumb
- **THEN** each of them links to the profile

### Requirement: Each waiting product waits for its own launch

Four products wait for the public — the store, the vault, booking a visit
and the profile — and each moves as one set on the lanes stated for it. The
auction is not one of them: it is carried on every lane already.

**The four sets** - The surfaces of each waiting product are:

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

| Lane | Store | Vault | Booking | Profile | Labs | Every other surface |
| --- | --- | --- | --- | --- | --- | --- |
| Development | carried | carried | carried | carried | carried | carried |
| Staging | carried | carried | carried | carried | carried | carried |
| Preview | not carried | not carried | not carried | not carried | not carried | carried |
| Production | not carried | not carried | not carried | not carried | not carried | carried |

**Labs** - The labs are the demonstration surfaces and the refund and shipping
drafts nobody has approved.

**Every other surface** - Every other surface — the auction, the front door,
the terms and the privacy page, the membership and join pages, and sign-in —
SHALL be carried on every lane.

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
**Serves:** grade10-site-site-carried-surfaces-US-05 - the collector who finds the rest of the site whole while the four products are shut

- **GIVEN** a build made for production
- **WHEN** a collector opens the auction, the front door, the terms, the
  privacy page, the membership or join pages, or sign-in
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

### Requirement: Where a product is carried it behaves as it is specified to

Carrying decides whether a product is there, never how it behaves.

**Unchanged** - A build that carries a product SHALL answer, link and work at
every surface in that product's set exactly as the product's own capabilities
require; which lanes carry the set SHALL change no behaviour on a lane that
carries it.

**One line per product** - Opening a product SHALL be a change to the lanes
carrying that product's set and to nothing else: every surface in the set
SHALL start answering together, no surface outside it SHALL change the lanes
it is carried on, and the other three waiting products SHALL stay on the
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

- **GIVEN** a build made for production, carrying none of the four waiting
  sets
- **WHEN** production is stated to carry the vault's set alone
- **THEN** every vault surface answers on it
- **AND** no store, booking or profile surface answers
