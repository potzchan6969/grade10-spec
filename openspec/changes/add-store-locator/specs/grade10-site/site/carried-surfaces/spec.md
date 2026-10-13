# grade10-site/site/carried-surfaces Specification

## Feature set

- What a build carries
  - Store surfaces: the store, its collections, a card's page, the shop's two
    handed-out addresses, the cart, the checkout, a collector's order history
    and order detail, and Store Locator
  - Labs: the demonstration surfaces and the unapproved refund and shipping
    drafts, carried in development, staging and staging-2
  - Everything else: the auction, the terms and the privacy page, and
    sign-in, carried on every lane
  - Grading surfaces: the counter signing, where a collector signs a grading
    submission's agreement and receipts on the shop's tablet
  - Front door: carried in development, staging and staging-2; where it is
    withheld, the home address sends a collector on to the auction
  - Lanes: development, staging and staging-2 carry every waiting product;
    uat, preview and production carry none of them

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

<!-- trace:scenario id=g10.site-carried-surfaces.SC-n1s rev=1 -->
#### Scenario: grade10-site-site-carried-surfaces-SC-11 - The header names no shop
**Serves:** grade10-site-site-carried-surfaces-US-01 - the collector reading the header of a site with nothing to sell them

- **GIVEN** a build made for production
- **WHEN** the header renders on any surface
- **THEN** it offers no store navigation item and no cart control

<!-- trace:scenario id=g10.site-carried-surfaces.SC-2fu rev=1 -->
#### Scenario: grade10-site-site-carried-surfaces-SC-12 - The footer drops the shop column
**Serves:** grade10-site-site-carried-surfaces-US-01 - the collector reading the foot of the page for what the site offers

- **GIVEN** a build made for production
- **WHEN** the footer renders
- **THEN** no shop column appears and no link leads to a store surface

<!-- trace:scenario id=g10.site-carried-surfaces.SC-4cr rev=2 -->
#### Scenario: grade10-site-site-carried-surfaces-SC-13 - The front door offers no way into a shop
**Serves:** grade10-site-site-carried-surfaces-US-01 - the collector meeting the first page of the site before the shop opens

- **GIVEN** a build that carries the front door but not the store's set
- **WHEN** a collector opens the front door
- **THEN** neither the store button nor the store card is there, and nothing
  in its place promises a shop

<!-- trace:scenario id=g10.site-carried-surfaces.SC-50x rev=1 -->
#### Scenario: grade10-site-site-carried-surfaces-SC-30 - Nothing in the chrome leads to a withheld product
**Serves:** grade10-site-site-carried-surfaces-US-05 - the collector reading the header, the foot of the page and the front door for what the site offers

- **GIVEN** a build made for production
- **WHEN** any surface renders
- **THEN** no navigation item, no header control, no footer link, no
  front-door button and no front-door card leads to the store, the vault or
  booking

<!-- trace:scenario id=g10.site-carried-surfaces.SC-zcr rev=1 -->
#### Scenario: grade10-site-site-carried-surfaces-SC-31 - The account menu names only what the build answers
**Serves:** grade10-site-site-carried-surfaces-US-07 - the signed-in collector opening the account menu on a public page

- **GIVEN** a build made for production, and a collector holding a session
- **WHEN** they open the account menu
- **THEN** it names no page of a product the build does not carry
- **AND** every item it does name opens an address the build answers

<!-- trace:scenario id=g10.site-carried-surfaces.SC-7os rev=2 -->
#### Scenario: grade10-site-site-carried-surfaces-SC-33 - The front door's card row renders empty rather than being removed
**Serves:** grade10-site-site-carried-surfaces-US-05 - the collector reading a front door built to hold a card for each of the three waiting products

- **GIVEN** a build that carries the front door and none of the store's, the
  vault's or booking's sets
- **WHEN** the front door renders
- **THEN** the card row is present on the page and holds no card for the
  store, the vault or booking

<!-- trace:scenario id=g10.site-carried-surfaces.SC-r14 rev=1 -->
#### Scenario: grade10-site-site-carried-surfaces-SC-34 - No in-app link points at an absent profile
**Serves:** grade10-site-site-carried-surfaces-US-05 - the collector reading checkout, an order's detail, their order history or the auction winner's order breadcrumb, none of which sends them toward a profile the build does not carry

- **GIVEN** a build that carries the store's set but not the profile
- **WHEN** a collector reaches checkout, an order's detail page, their order
  history, or the auction winner's order breadcrumb
- **THEN** none of them link to the profile

<!-- trace:scenario id=g10.site-carried-surfaces.SC-9vv rev=1 -->
#### Scenario: grade10-site-site-carried-surfaces-SC-37 - In-app links reach the profile once it is carried
**Serves:** grade10-site-site-carried-surfaces-US-08 - the collector who reaches checkout, an order's detail, their order history or the auction winner's order breadcrumb, each still sending them to their account page where the profile is carried

- **GIVEN** a build that carries both the store's set and the profile
- **WHEN** a collector reaches checkout, an order's detail page, their order
  history, or the auction winner's order breadcrumb
- **THEN** each of them links to the profile

### Requirement: Each waiting product waits for its own launch

Six products wait for the public - the store, the vault, booking a visit,
the profile, membership and grading - and each moves as one set on the lanes
stated for it. The front door waits behind a gate of its own. The auction is
not one of them: it is carried on every lane already.

**The six sets** - The surfaces of each waiting product are:

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
| Grading | Counter signing | The agreement and receipts a collector signs on the shop's tablet at the counter |

**Order history and order detail keep the store's gate** - Order history and
order detail belong to the store's set alone; whether a build carries the
profile SHALL change neither. A build that carries the store but not the
profile SHALL still answer both wherever the store's set is carried.

**Store Locator moves with the store** - Store Locator's address, its header
and footer items and its sitemap entry SHALL be carried wherever the store's
set is carried, and withheld wherever it is withheld.

**All or none** - A build SHALL carry every surface of a product's set or none
of it.

**The vault's set** - The signing ceremony alone. The collector's own vault
screens are carried by no build until they are designed again, and their
addresses answer as addresses no surface holds.

**One set at a time** - Each product's set, and the front door, SHALL be
decided on its own, and carrying one SHALL NOT carry another.

**Which lanes** - Which lanes carry each set SHALL be decided by the deploy
environment the build is made for, never by the stage the site is served at:

| Lane | Front door | Store | Vault | Booking | Profile | Membership | Grading | Labs | Every other surface |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Development | carried | carried | carried | carried | carried | carried | carried | carried | carried |
| Staging | carried | carried | carried | carried | carried | carried | carried | carried | carried |
| Staging-2 | carried | carried | carried | carried | carried | carried | carried | carried | carried |
| UAT | not carried | not carried | not carried | not carried | not carried | not carried | not carried | not carried | carried |
| Preview | not carried | not carried | not carried | not carried | not carried | not carried | not carried | not carried | carried |
| Production | not carried | not carried | not carried | not carried | not carried | not carried | not carried | not carried | carried |

**The front door** - The front door is the home page. Where a build withholds
it, the home address, bare or under a language prefix, SHALL send a collector
on to the auction in that language, with a redirect that is not permanent. The
home address is then the auction's way in, not an address the build refuses.

**Labs** - The labs are the demonstration surfaces and the refund and shipping
drafts nobody has approved.

**Every other surface** - Every other surface - the auction, the terms and
the privacy page, and sign-in - SHALL be carried on every lane.

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

<!-- trace:scenario id=g10.site-carried-surfaces.SC-d8a rev=2 -->
#### Scenario: grade10-site-site-carried-surfaces-SC-24 - The holding site is carried on every lane
**Serves:** grade10-site-site-carried-surfaces-US-05 - the collector who finds the rest of the site whole while the waiting products are shut

- **GIVEN** a build made for production
- **WHEN** a collector opens the auction, the terms, the privacy page, or
  sign-in
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

- **GIVEN** a build made for production, preview or uat
- **WHEN** a collector opens the Store Locator address
- **THEN** it is not found
- **AND** neither the header nor the footer names Store Locator
- **AND** the sitemap does not list it
- **AND** a build made for development, staging or staging-2 answers it, names
  it in the header and the footer, and lists it in the sitemap

<!-- trace:scenario id=g10.site-carried-surfaces.SC-hn8 rev=1 -->
#### Scenario: grade10-site-site-carried-surfaces-SC-42 - The home address opens the auction where the front door is withheld
**Serves:** grade10-site-site-carried-surfaces-US-05 - the collector who types grade10.com before the front door has opened and lands on the auction

- **GIVEN** a build made for production, preview or uat
- **WHEN** a collector opens the home address, bare or under a language prefix
- **THEN** they are sent on to the auction in that language
- **AND** the redirect is not permanent
- **AND** a build made for development, staging or staging-2 answers the home
  address with the front door

<!-- trace:scenario id=g10.site-carried-surfaces.SC-bpn rev=1 -->
#### Scenario: grade10-site-site-carried-surfaces-SC-43 - Staging-2 carries what staging carries, and uat withholds what production withholds
**Serves:** `grade10-site-site-carried-surfaces-US-05`, `grade10-site-site-carried-surfaces-US-08` - the collector on the second staging lane finds every product open, and on uat finds the public site

- **GIVEN** a build made for staging-2 and a build made for uat
- **WHEN** a collector opens a surface of each waiting product's set and a
  labs address on each
- **THEN** staging-2 answers every one of them
- **AND** uat answers none of them, as production does
- **AND** both answer the auction, the terms, the privacy page and sign-in

<!-- trace:scenario id=g10.site-carried-surfaces.SC-zf5 rev=1 -->
#### Scenario: grade10-site-site-carried-surfaces-SC-44 - Grading waits on the same lanes the other waiting products wait on
**Serves:** grade10-site-site-carried-surfaces-US-05 - the collector who reaches grade10.com before grading has opened

- **GIVEN** a build made for production, preview or uat
- **WHEN** a collector opens grading's counter signing
- **THEN** it is not found
- **AND** a build made for development, staging or staging-2 answers it

### Requirement: Where a product is carried it behaves as it is specified to

Carrying decides whether a product is there, never how it behaves.

**Unchanged** - A build that carries a product SHALL answer, link and work at
every surface in that product's set exactly as the product's own capabilities
require; which lanes carry the set SHALL change no behaviour on a lane that
carries it.

**One line per product** - Opening a product SHALL be a change to the lanes
carrying that product's set and to nothing else: every surface in the set
SHALL start answering together, no surface outside it SHALL change the lanes
it is carried on, and the other waiting products SHALL stay on the lanes
already stated for them.

<!-- trace:scenario id=g10.site-carried-surfaces.SC-hz5 rev=1 -->
#### Scenario: grade10-site-site-carried-surfaces-SC-25 - Staging works as it did before
**Serves:** grade10-site-site-carried-surfaces-US-08 - the collector who buys a card, signs a case's papers at the counter and books a visit in one sitting

- **GIVEN** a build made for staging
- **WHEN** a collector buys through the store, signs a vault case's packet on
  the signing ceremony and books a visit
- **THEN** each surface behaves as its own capability requires, with nothing
  altered by the lanes that do not carry it

<!-- trace:scenario id=g10.site-carried-surfaces.SC-8tm rev=1 -->
#### Scenario: grade10-site-site-carried-surfaces-SC-26 - A product opens for all of its surfaces at once
**Serves:** Where a product is open - the day a product opens, one statement moves and its whole set follows it

- **GIVEN** a lane that does not carry the vault's set
- **WHEN** that lane is stated to carry it
- **THEN** every surface in the vault's set answers on it
- **AND** no surface outside the set changes the lanes it is carried on

<!-- trace:scenario id=g10.site-carried-surfaces.SC-3r5 rev=2 -->
#### Scenario: grade10-site-site-carried-surfaces-SC-27 - The other waiting products stay shut while one opens
**Serves:** Where a product is open - the launches still to come, each waiting on its own line rather than on the first one

- **GIVEN** a build made for production, carrying none of the six waiting
  sets
- **WHEN** production is stated to carry the vault's set alone
- **THEN** every vault surface answers on it
- **AND** no store, booking, profile, membership or grading surface answers
