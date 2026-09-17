## Purpose
Which surfaces a build of the grade10 site carries, and what the site does
about an address, a link and a crawl entry for one it does not. `navigation`
owns which surface an address resolves to, `page-shell` what the chrome may
link, and `crawlable-pages` what a crawler is offered; this capability
decides the set all three read, so a surface the shop is not ready to sell
from is absent rather than hidden.

## Feature set

- What a build carries
  - Decided at build: the set is fixed when the build is made, never read per
    request
  - Store surfaces: the store, its collections, a card's page, the shop's two
    handed-out addresses, the cart, the checkout, and a collector's order
    history and order detail
  - Labs: the demonstration surfaces and the unapproved refund and shipping
    drafts, carried in development alone
  - Everything else: the auction, the vault, booking, membership, join and
    the profile, carried on every lane
- An address nothing carries
  - Not found: it answers with the not-found surface and a 404
  - Every address beneath it: the addresses under an uncarried surface answer
    the same way
  - No page code: a build ships none of an uncarried surface's page code
- Nothing names an absent surface
  - Header: no navigation item and no cart control for a surface the build
    does not carry
  - Footer: no shop column and no link to a surface the build does not carry
  - Front door: no store button and no store card
  - Crawler: robots.txt and the sitemap name only what the build answers
- Where the shop is open
  - Unchanged: every store surface answers, links and sells exactly as it
    does where the shop is shut to nobody
  - One line to open it: the lanes that carry the store are stated once

## ADDED Requirements

### Requirement: A build carries a surface or it does not

The site SHALL fix the set of surfaces a build carries when that build is
made, and SHALL NOT read the set again while the build is running. For a
surface in the set the build SHALL hold the address, the page and the page
code; for a surface outside it the build SHALL hold none of the three. No
setting a running build reads, and no request it receives, SHALL add a
surface to the set or take one out of it.

#### Scenario: grade10-site-site-carried-surfaces-SC-01 - A running build cannot be told to carry more
**Serves:** What a build carries - the set is settled before a build leaves the pipeline, so nothing in front of it can widen what the site answers

- **GIVEN** a build made without the store surfaces
- **WHEN** it runs under any configuration its lane can supply
- **THEN** no store surface answers

#### Scenario: grade10-site-site-carried-surfaces-SC-02 - An uncarried surface costs no page code
**Serves:** What a build carries - a collector downloads nothing of a shop the build in front of them holds no page for

- **WHEN** every script a build without the store surfaces serves is read
- **THEN** none of them holds a store surface's page code

### Requirement: The store surfaces wait for the shop to open

The store surfaces are:

| Surface | What it answers |
| --- | --- |
| Store | The store's own address, and the collections beneath it |
| Card page | One card's own page |
| Product address | The address the shop hands out for a card |
| Collection address | The address the shop hands out for a collection |
| Cart | The basket a collector fills |
| Checkout | Where a collector pays |
| Order history | A collector's own orders |
| Order detail | One of a collector's orders |

A build SHALL carry every surface in that set or none of it. Which lanes
carry it SHALL be decided by the deploy environment the build is made for,
never by the stage the site is served at:

| Lane | Store surfaces | Labs | Every other surface |
| --- | --- | --- | --- |
| Development | carried | carried | carried |
| Staging | carried | not carried | carried |
| Preview | not carried | not carried | carried |
| Production | not carried | not carried | carried |

The labs are the demonstration surfaces and the refund and shipping drafts
nobody has approved. Every other surface — the auction with its own order and
invoice, the vault, booking a visit, the membership and join pages, and the
profile — SHALL be carried on every lane.

#### Scenario: grade10-site-site-carried-surfaces-SC-03 - A production build carries no store surface
**Serves:** grade10-site-site-carried-surfaces-US-01 - the collector who arrives at grade10.com while the shop is shut

- **GIVEN** a build made for production
- **WHEN** a collector opens the site
- **THEN** none of the store surfaces answers, at any of their addresses

#### Scenario: grade10-site-site-carried-surfaces-SC-04 - The preview host carries what production carries
**Serves:** grade10-site-site-carried-surfaces-US-01 - the same shut shop at the quieter address the preview host serves

- **GIVEN** a build made for preview
- **WHEN** a collector opens a store address on it
- **THEN** it answers as the production build does, carrying no store surface

#### Scenario: grade10-site-site-carried-surfaces-SC-05 - Staging carries every store surface
**Serves:** grade10-site-site-carried-surfaces-US-04 - the teammate who buys through the whole shop on the lane it is open on

- **GIVEN** a build made for staging
- **WHEN** a collector opens each of the store surfaces
- **THEN** every one of them answers

#### Scenario: grade10-site-site-carried-surfaces-SC-06 - The labs answer on a development lane alone
**Serves:** What a build carries - the demonstration pages and the unapproved drafts reached only where they are worked on

- **GIVEN** a build made for staging, preview or production
- **WHEN** a collector opens a labs address
- **THEN** no labs surface answers
- **AND** a development build answers each of them

#### Scenario: grade10-site-site-carried-surfaces-SC-07 - Everything outside the store set stays
**Serves:** grade10-site-site-carried-surfaces-US-01 - the collector who came for an auction and finds the rest of the site whole

- **GIVEN** a build made for production
- **WHEN** a collector opens the auction, an auction order or its invoice, the
  vault, booking a visit, the membership or join pages, or their profile
- **THEN** each answers as it does on every other lane

### Requirement: An address of an uncarried surface is not found

An address of a surface a build does not carry, and every address beneath it,
SHALL be an address that build does not hold: it answers with the not-found
surface and status 404. The build SHALL NOT redirect such an address, and
SHALL NOT answer it with another surface standing in for the one it does not
carry.

The answer SHALL NOT depend on who is asking or in which language: a collector
holding a session reads the same refusal as one holding none and keeps their
session, and the address under a language prefix is refused in that language.

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

### Requirement: Nothing in a build names a surface it does not carry

A surface a build does not carry SHALL NOT be a destination anything in that
build names. In a build without the store surfaces the header SHALL show no
store navigation item and no cart control, the footer SHALL show no shop
column, and the front door SHALL show no store button and no store card.

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

### Requirement: A crawler is offered only what the build carries

The robots.txt and the sitemap a build serves SHALL name only addresses of
surfaces that build carries. A sitemap read from the catalogue when it is
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

### Requirement: Where the store is carried it behaves as it is specified to

A build that carries the store SHALL answer, link and sell at every store
surface exactly as the store's own capabilities require; which lanes carry
the set SHALL change no store behaviour on a lane that carries it. Opening
the shop SHALL be a change to the lanes carrying the store set and to nothing
else: every surface in the set SHALL start answering together, and no surface
outside it SHALL change lanes with them.

#### Scenario: grade10-site-site-carried-surfaces-SC-16 - Staging sells as it did before
**Serves:** grade10-site-site-carried-surfaces-US-04 - the teammate who browses, fills a basket, pays and reads the order back

- **GIVEN** a build made for staging
- **WHEN** a collector browses the store, adds a card to the cart, checks out
  and opens their order history
- **THEN** each surface behaves as its own capability requires, with nothing
  altered by the lanes that do not carry it

#### Scenario: grade10-site-site-carried-surfaces-SC-17 - The shop opens for all of its surfaces at once
**Serves:** Where the shop is open - the day the shop opens, one statement moves and the whole set follows it

- **GIVEN** a lane that does not carry the store surfaces
- **WHEN** that lane is stated to carry them
- **THEN** every surface in the store set answers on it
- **AND** no surface outside the set changes the lanes it is carried on
