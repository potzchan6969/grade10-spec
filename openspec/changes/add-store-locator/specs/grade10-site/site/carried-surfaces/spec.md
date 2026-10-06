# grade10-site/site/carried-surfaces Specification

## Feature set

- What a build carries
  - Store surfaces: the store, its collections, a card's page, the shop's two
    handed-out addresses, the cart, the checkout, a collector's order history
    and order detail, and Store Locator

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
| Store | Store Locator | The shop's location and hours |
| Vault | Signing ceremony | Where a case is signed on the shop's iPad |
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

**The vault's set** - The signing ceremony alone. The collector's own vault
screens are carried by no build until they are designed again, and their
addresses answer as addresses no surface holds.

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

<!-- trace:scenario id=g10.site-carried-surfaces.SC-w1o rev=1 -->
#### Scenario: grade10-site-site-carried-surfaces-SC-20 - A public build carries none of the three waiting products
**Serves:** grade10-site-site-carried-surfaces-US-05 - the collector who reaches grade10.com before any of the three has opened

- **GIVEN** a build made for production
- **WHEN** a collector opens the site
- **THEN** no surface of the store, the vault or booking answers, at any of
  their addresses

<!-- trace:scenario id=g10.site-carried-surfaces.SC-0lq rev=1 -->
#### Scenario: grade10-site-site-carried-surfaces-SC-21 - The preview host withholds what production withholds
**Serves:** grade10-site-site-carried-surfaces-US-05 - the same three shut products at the quieter address the preview host serves

- **GIVEN** a build made for preview
- **WHEN** a collector opens an address of any of the three
- **THEN** it answers as the production build does, carrying none of the
  three sets

<!-- trace:scenario id=g10.site-carried-surfaces.SC-neg rev=1 -->
#### Scenario: grade10-site-site-carried-surfaces-SC-22 - Staging carries all three waiting products
**Serves:** grade10-site-site-carried-surfaces-US-08 - the collector working a product on the lane it is open on

- **GIVEN** a build made for staging
- **WHEN** a collector opens each surface of the store, the vault and booking
- **THEN** every one of them answers

<!-- trace:scenario id=g10.site-carried-surfaces.SC-6ym rev=1 -->
#### Scenario: grade10-site-site-carried-surfaces-SC-23 - The labs answer on development and staging, and nowhere the public reaches
**Serves:** What a build carries - the demonstration pages and the unapproved drafts reached only where they are worked on

- **GIVEN** a build made for preview or production
- **WHEN** a collector opens a labs address
- **THEN** no labs surface answers
- **AND** a development or a staging build answers each of them

<!-- trace:scenario id=g10.site-carried-surfaces.SC-d8a rev=1 -->
#### Scenario: grade10-site-site-carried-surfaces-SC-24 - The holding site is carried on every lane
**Serves:** grade10-site-site-carried-surfaces-US-05 - the collector who finds the rest of the site whole while the five products are shut

- **GIVEN** a build made for production
- **WHEN** a collector opens the auction, the front door, the terms, the
  privacy page, or sign-in
- **THEN** each answers as it does on every other lane

<!-- trace:scenario id=g10.site-carried-surfaces.SC-hx8 rev=1 -->
#### Scenario: grade10-site-site-carried-surfaces-SC-35 - The profile waits on the same lanes the store, the vault and booking wait on
**Serves:** grade10-site-site-carried-surfaces-US-05 - the collector who reaches grade10.com before the profile has opened

- **GIVEN** a build made for production or preview
- **WHEN** a collector opens the profile's own address
- **THEN** no profile surface answers
- **AND** a build made for development or staging answers it

<!-- trace:scenario id=g10.site-carried-surfaces.SC-lvd rev=1 -->
#### Scenario: grade10-site-site-carried-surfaces-SC-36 - Order history and order detail answer without the profile
**Serves:** grade10-site-site-carried-surfaces-US-06 - the collector whose account page is withheld but whose mailed order link still answers, because order history and order detail carry the store's gate alone

- **GIVEN** a build that carries the store's set but not the profile
- **WHEN** a collector opens their order history or one of their orders
- **THEN** the order history and the order detail answer
- **AND** the profile's own address is not found

<!-- trace:scenario id=g10.site-carried-surfaces.SC-tfq rev=1 -->
#### Scenario: grade10-site-site-carried-surfaces-SC-38 - Membership waits on the same lanes the other waiting products wait on
**Serves:** grade10-site-site-carried-surfaces-US-05 - the collector who reaches grade10.com before membership has opened

- **GIVEN** a build made for production or preview
- **WHEN** a collector opens the membership page or the join page
- **THEN** neither surface answers
- **AND** a build made for development or staging answers both

<!-- trace:scenario id=g10.site-carried-surfaces.SC-k9w rev=1 -->
#### Scenario: grade10-site-site-carried-surfaces-SC-39 - Membership and join carry or withhold together
**Serves:** grade10-site-site-carried-surfaces-US-08 - the collector who follows the membership page's link to join, or the join page's link back, and finds the other side of that link exactly as carried as the page they left

- **GIVEN** any build this table describes
- **WHEN** either the membership page or the join page is carried
- **THEN** the other is carried too
- **AND** where one is withheld the other is withheld with it

<!-- trace:scenario id=g10.site-carried-surfaces.SC-4zd rev=1 -->
#### Scenario: grade10-site-site-carried-surfaces-SC-40 - The collector's vault screens answer not-found on every lane
**Serves:** grade10-site-site-carried-surfaces-US-06 - the collector who opens an old vault link finds nothing rather than a screen nobody designed

- **GIVEN** a build made for any lane, the vault's set carried or not
- **WHEN** a collector opens the vault's case list, its request, a case's page, the identity check or Your data
- **THEN** each is not found
- **AND** where the vault's set is carried, the signing ceremony still answers

<!-- trace:scenario id=g10.site-carried-surfaces.SC-wjy rev=1 -->
#### Scenario: grade10-site-site-carried-surfaces-SC-41 - Store Locator waits with the store
**Serves:** `grade10-site-site-carried-surfaces-US-01`, `grade10-site-site-carried-surfaces-US-03` - the collector and the crawler on a build whose shop has not opened meet no shop location either

- **GIVEN** a build made for production or preview
- **WHEN** a collector opens the Store Locator address
- **THEN** it is not found
- **AND** neither the header nor the footer names Store Locator
- **AND** the sitemap does not list it
- **AND** a build made for development or staging answers it, names it in the
  header and the footer, and lists it in the sitemap
