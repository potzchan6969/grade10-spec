## Purpose
What shows under a card on its own page: the cards the stock keeper chose for
it and the cards like it, up to six, in the response as the page arrives, and
what fills the rail, in what order, and when it shows nothing.

## Feature set

- The rail
  - Place and heading: under the card, headed You may also like, in the page's response
  - Order: the picks first in the stock keeper's order, then similar cards, up to six
  - Opens the card: a tile opens its card's own page; nothing in the rail adds to the cart
  - Nothing to show: no rail and no space where there are no picks and no similar cards
  - Never itself: the card being read is never in its own rail
- Picks
  - Chosen in Shopify: the cards a stock keeper picks on the card, in the dashboard, in their order
  - Left out: a pick the catalogue no longer holds
  - Sold out: a pick nobody can buy stays, says so and still opens
  - Reaches the page: with the card's own page
- Similar cards
  - Shared facts: a card sharing this card's world, its language or its type, weighed in that order, newest first among equals
  - Nothing shared: no similar cards
  - For sale only: a card nobody can buy is never among them
  - Moves with the catalogue: appears and leaves as the store's copy of the catalogue moves
- Rail block
  - One export: the rail composes the tiles it is given, with the heading, and draws no cart control

## ADDED Requirements

### Requirement: The rail sits under the card in the page's response

A card's page SHALL carry, under the card, a rail of other cards the collector
may want.

- **Heading** — the rail is headed **You may also like**.
- **Unlabelled** — nothing in the rail names a card as chosen or computed, and
  nothing separates one half from the other.
- **In the response** — the rail is in the card page's own response, before any
  script runs, so nothing stands in its place while the page loads and the card
  does not move once it has.
- **A card nobody can buy** — a card the catalogue lists with nothing for sale
  shows its rail like any other card.

#### Scenario: grade10-site-store-cross-sell-SC-01 - The rail arrives with the card
**Serves:** `grade10-site-store-cross-sell-US-01`, `grade10-site/store/product-page#grade10-site-store-product-page-US-01` - the collector reads a card and the next card is already under it

- **GIVEN** a card with cards to show under it
- **WHEN** its page is fetched and no script runs
- **THEN** the response holds the rail under the card, headed **You may also like**
- **AND** nothing stands in the rail's place while the page loads
- **AND** the card does not move when the rail appears

#### Scenario: grade10-site-store-cross-sell-SC-02 - A card nobody can buy still shows its rail
**Serves:** grade10-site-store-cross-sell-US-01 - the collector who cannot buy this card is carried to the next one

- **GIVEN** a card the catalogue lists with nothing for sale, with cards to show under it
- **WHEN** a collector opens its page
- **THEN** the rail is under the card, headed and filled as on a card for sale

### Requirement: The rail holds up to six cards, the picks first

The rail SHALL hold the stock keeper's picks first, in their order, then
similar cards to fill.

- **Order** — every pick that reaches the page comes before every similar card.
- **Cap** — at most 6 cards in all; what does not fit is left out, picks past
  the sixth included.
- **Never itself** — the card being read is never among the cards under it,
  whether the stock keeper chose it or it shares its own facts.
- **One card shows** — a rail of one card is drawn, headed as ever.

#### Scenario: grade10-site-store-cross-sell-SC-03 - The picks lead and similar cards fill
**Serves:** grade10-site-store-cross-sell-US-01 - the collector meets the stock keeper's cards first and more cards after them

- **GIVEN** a card with two picks, and more cards sharing its world than the rail holds
- **WHEN** a collector opens its page
- **THEN** the first two cards in the rail are the two picks, in the stock keeper's order
- **AND** the remaining four are cards sharing its world
- **AND** nothing in the rail says which of the two a card came from

#### Scenario: grade10-site-store-cross-sell-SC-04 - The rail stops at six
**Serves:** grade10-site-store-cross-sell-US-01 - the collector is given a set they can read, not the catalogue

- **GIVEN** a card with eight picks the catalogue still holds
- **WHEN** a collector opens its page
- **THEN** the rail holds the first six of them, in the stock keeper's order
- **AND** no similar card is in the rail

#### Scenario: grade10-site-store-cross-sell-SC-05 - One card is enough for a rail
**Serves:** grade10-site-store-cross-sell-US-01 - the collector is shown the one card the stock keeper meant

- **GIVEN** a card with one pick and no card sharing its world, its language or its collectible type
- **WHEN** a collector opens its page
- **THEN** the rail is under the card, headed, holding that one card

#### Scenario: grade10-site-store-cross-sell-SC-06 - The card being read is never under itself
**Serves:** The rail - the card a collector is on is kept out of the set composed for it

- **GIVEN** a card a stock keeper also chose as one of its own picks, and cards sharing its world
- **WHEN** a collector opens its page
- **THEN** that card is not among the cards under it
- **AND** the cards under it are its other picks and cards sharing its world

### Requirement: A card in the rail opens its own page and sells nothing

A card in the rail SHALL open that card's own page, and the rail SHALL offer
nothing that adds to the cart.

- **Opens the card** — activating a card in the rail lands the collector on
  that card's own page, reading that card.
- **No cart control** — no card in the rail offers a control that adds to the
  cart, whether or not it is for sale.
- **Buying is on the card's page** — adding is done on the page the rail
  opened.

#### Scenario: grade10-site-store-cross-sell-SC-07 - A card in the rail opens
**Serves:** grade10-site-store-cross-sell-US-01 - the collector goes on to the next card without returning to the listing

- **GIVEN** a collector reading a card with a rail under it
- **WHEN** they open a card in the rail
- **THEN** they are on that card's own page, reading that card

#### Scenario: grade10-site-store-cross-sell-SC-08 - Nothing in the rail adds to the cart
**Serves:** grade10-site-store-cross-sell-US-01 - the collector buys on the card's own page, not from under another card

- **WHEN** a card's page with a rail renders
- **THEN** no card in the rail offers a control that adds it to the cart
- **AND** a card in the rail that is for sale offers none either

### Requirement: A card with nothing to show has no rail

Where there is nothing to show under a card, the page SHALL show no rail and
SHALL leave no space for one.

- **Nothing to show** — no pick the catalogue still holds, and no similar card.
- **The heading goes with it** — no heading is drawn where no rail is.
- **No space** — the page reads as a card with nothing under it, not as a card
  missing something.
- **A rail the site cannot compose** — where the site cannot compose the rail,
  the card's page answers whole and shows no rail, as with nothing to show.

#### Scenario: grade10-site-store-cross-sell-SC-09 - Nothing to show, nothing drawn
**Serves:** grade10-site-store-cross-sell-US-01 - the collector reads a card whose page ends with the card

- **GIVEN** a card with no picks and no card sharing its world, its language or its collectible type
- **WHEN** a collector opens its page
- **THEN** no rail and no heading are under the card
- **AND** no space is left where the rail would be

#### Scenario: grade10-site-store-cross-sell-SC-10 - A rail the site cannot compose
**Serves:** grade10-site-store-cross-sell-US-01 - the collector still gets the card they asked for

- **GIVEN** a card the site cannot compose a rail for
- **WHEN** a collector opens its page
- **THEN** the card's page answers whole
- **AND** no rail, no heading and no space are under the card

### Requirement: The picks are the stock keeper's, chosen in Shopify

The cards a stock keeper chooses for a card in the Shopify dashboard, on the
card itself, SHALL be that card's picks.

- **Chosen in Shopify** — the stock keeper chooses them there and nowhere else;
  the store holds no second list of them.
- **Their order** — the rail keeps the order the stock keeper chose, and never
  reorders the picks.
- **Reaches the page** — a pick added, removed or reordered reaches the card's
  page when the page's own reading does, within a minute.
- **Left out** — a pick the catalogue no longer holds is left out, and the rest
  of the rail stands.

#### Scenario: grade10-site-store-cross-sell-SC-11 - The stock keeper's order is the rail's order
**Serves:** grade10-site-store-cross-sell-US-03 - the stock keeper puts the cards in an order and the page keeps it

- **GIVEN** a stock keeper who chose three cards for a card, in an order
- **WHEN** a collector opens that card's page
- **THEN** the rail's first three cards are those three, in the order the stock keeper chose them

#### Scenario: grade10-site-store-cross-sell-SC-12 - A changed pick reaches the page
**Serves:** grade10-site-store-cross-sell-US-03 - the stock keeper changes the cards and sees the change on the page

- **GIVEN** a card whose page shows the picks the stock keeper chose
- **WHEN** the stock keeper adds a card to them in Shopify
- **THEN** reading the card's page afresh within a minute shows the added card among the picks, in the stock keeper's order

#### Scenario: grade10-site-store-cross-sell-SC-13 - A pick the catalogue no longer holds
**Serves:** Picks - a chosen card the catalogue has let go never reaches the collector

- **GIVEN** a card with three chosen cards, one of them no longer in the catalogue
- **WHEN** a collector opens its page
- **THEN** the rail holds the other two, in the stock keeper's order
- **AND** nothing stands in the missing card's place

### Requirement: A chosen pick nobody can buy stays in the rail

A pick the catalogue lists with nothing for sale SHALL stay in the rail, say it
is sold out, and still open its own page.

- **Stays** — selling out does not drop a pick; the stock keeper chose it.
- **Says so** — the card carries the sold-out wording the store's tiles carry,
  and keeps its price.
- **Still opens** — it opens its own page like every other card in the rail.

#### Scenario: grade10-site-store-cross-sell-SC-14 - A sold-out pick says so and still opens
**Serves:** grade10-site-store-cross-sell-US-01 - the collector meets a card the stock keeper meant them to see, sold out and still worth opening

- **GIVEN** a card whose picks include one the catalogue lists with nothing for sale
- **WHEN** a collector opens the card's page
- **THEN** that pick is in the rail, in the stock keeper's order, saying it is sold out and showing its price
- **AND** opening it lands the collector on its own page

### Requirement: Similar cards fill the rail by what they share

Where the picks do not fill the rail, the site SHALL fill it with other cards
sharing this card's world, its language or its collectible type.

- **Weighed in that order** — a card sharing a world comes before one sharing
  only a language, which comes before one sharing only a collectible type.
- **Shared once** — a fact shared counts once, however many worlds, languages
  or collectible types either card carries; sharing a fact twice ranks a card no
  higher than sharing it once.
- **Newest first** — cards sharing the same facts are ordered newest first, by
  when the catalogue gained the card — the order the listing calls latest
  product.
- **Fills what is left** — similar cards fill the rail to six after the picks,
  and no further.
- **Picks unreadable** — where the picks cannot be read, similar cards fill the
  rail alone, as for a card nobody chose for.
- **A fact missing** — a card with no world draws similar cards by its language
  and its type; the order is unchanged.

#### Scenario: grade10-site-store-cross-sell-SC-27 - Similar cards stop at six
**Serves:** grade10-site-store-cross-sell-US-02 - the collector is given a set they can read

- **GIVEN** a card with no picks and ten cards sharing its world
- **WHEN** a collector opens its page
- **THEN** the rail holds six of them, newest first
- **AND** no seventh tile is drawn

#### Scenario: grade10-site-store-cross-sell-SC-28 - Picks unreadable, similar cards fill
**Serves:** grade10-site-store-cross-sell-US-02 - the collector is still led somewhere when the picks are not to be had

- **GIVEN** a card whose picks cannot be read, and cards sharing its world
- **WHEN** a collector opens its page
- **THEN** the rail holds the cards sharing its world, as for a card nobody chose for
- **AND** the card's page is otherwise unchanged

#### Scenario: grade10-site-store-cross-sell-SC-29 - A card with no world falls to its language and type
**Serves:** grade10-site-store-cross-sell-US-02 - the collector on a card the catalogue names no world for still sees cards like it

- **GIVEN** a card the catalogue names no world for, with no picks, one card sharing its language and one sharing only its collectible type
- **WHEN** a collector opens its page
- **THEN** the rail holds both, the card sharing the language first

#### Scenario: grade10-site-store-cross-sell-SC-30 - Clearing every pick leaves similar cards
**Serves:** grade10-site-store-cross-sell-US-03 - the stock keeper takes their picks back and the page still leads somewhere

- **GIVEN** a card whose page shows the stock keeper's picks, and cards sharing its world
- **WHEN** the stock keeper removes every pick in Shopify
- **THEN** reading the card's page afresh within a minute shows the cards sharing its world and no pick

#### Scenario: grade10-site-store-cross-sell-SC-15 - A card nobody chose picks for shows cards like it
**Serves:** grade10-site-store-cross-sell-US-02 - the collector on an unchosen card is still led somewhere

- **GIVEN** a card no stock keeper chose picks for, and four cards sharing its world
- **WHEN** a collector opens its page
- **THEN** the rail holds those four cards, newest first

#### Scenario: grade10-site-store-cross-sell-SC-16 - A shared world comes before a shared language
**Serves:** grade10-site-store-cross-sell-US-02 - the collector sees the cards closest to the one they are reading first

- **GIVEN** a card with no picks, one other card sharing only its world and one sharing only its language
- **WHEN** a collector opens its page
- **THEN** the card sharing the world is before the card sharing the language

#### Scenario: grade10-site-store-cross-sell-SC-17 - A shared language comes before a shared type
**Serves:** grade10-site-store-cross-sell-US-02 - the collector reading in one language is offered that language first

- **GIVEN** a card with no picks, one other card sharing only its language and one sharing only its collectible type
- **WHEN** a collector opens its page
- **THEN** the card sharing the language is before the card sharing the collectible type

#### Scenario: grade10-site-store-cross-sell-SC-18 - Newest first among cards sharing the same fact
**Serves:** grade10-site-store-cross-sell-US-02 - the collector is offered what the store has just taken in

- **GIVEN** a card with no picks, and two cards sharing its world and nothing else, gained by the catalogue on different days
- **WHEN** a collector opens its page
- **THEN** the card the catalogue gained later is before the other

#### Scenario: grade10-site-store-cross-sell-SC-19 - A fact shared twice counts once
**Serves:** Similar cards - two cards sharing one fact rank alike however many worlds, languages or collectible types each carries

- **GIVEN** a card in two worlds, with no picks
- **AND** another card in both of those worlds, gained by the catalogue in March
- **AND** a third card in one of them, gained by the catalogue in April
- **WHEN** a collector opens the first card's page
- **THEN** the April card is before the March card

### Requirement: Cards kept out of the similar cards

The site SHALL keep out of the similar cards every card a collector cannot buy
and every card already in the rail as a pick.

- **For sale only** — a card the catalogue lists with nothing for sale is never
  a similar card.
- **Never twice** — a card already in the rail as a pick is not repeated among
  the similar cards, whatever it shares.
- **Nothing shared** — a card sharing no world, no language and no collectible
  type with the card being read is never among them, and a card the catalogue
  names none of the three facts for draws no similar card at all.

#### Scenario: grade10-site-store-cross-sell-SC-20 - A card the catalogue names no facts for
**Serves:** grade10-site-store-cross-sell-US-02 - the collector on a card the catalogue says little about still gets what was chosen for it

- **GIVEN** a card the catalogue names no world, no language and no collectible type for, with two picks
- **WHEN** a collector opens its page
- **THEN** the rail holds those two picks
- **AND** no similar card is in the rail

#### Scenario: grade10-site-store-cross-sell-SC-21 - A card nobody can buy is never a similar card
**Serves:** grade10-site-store-cross-sell-US-02 - the collector is led on to cards they can still buy

- **GIVEN** a card with no picks, one card sharing its world with nothing for sale, and one sharing its world for sale
- **WHEN** a collector opens its page
- **THEN** the rail holds the card for sale
- **AND** the card with nothing for sale is not in the rail

#### Scenario: grade10-site-store-cross-sell-SC-22 - A pick is not repeated among the similar cards
**Serves:** Similar cards - a card shown under the one being read is shown once

- **GIVEN** a card whose single pick also shares its world, and three other cards sharing its world
- **WHEN** a collector opens its page
- **THEN** the pick is in the rail once, first
- **AND** the other three cards follow it

### Requirement: Similar cards move with the store's copy of the catalogue

The similar cards SHALL be composed from the store's copy of the catalogue as
the card's page is read, so a card the copy gains or loses enters or leaves
them.

- **Enters** — a card the copy gains that shares a fact with this card is among
  the similar cards the next time the page is read.
- **Leaves** — a card the copy loses, or that the copy holds with nothing for
  sale, is gone from them the next time the page is read.
- **The windows** — the store's copy follows the shop within the windows
  `grade10-site/store/product-listing` holds it to; the page states one clock,
  its own minute, and promises no second one for the similar cards.

#### Scenario: grade10-site-store-cross-sell-SC-23 - A card the catalogue gains joins the similar cards
**Serves:** grade10-site-store-cross-sell-US-02 - the collector is offered the card the store took in this morning

- **GIVEN** a card with no picks, whose page shows cards sharing its world
- **WHEN** the shop publishes another card sharing that world
- **AND** the store's copy of the catalogue holds it
- **THEN** reading the card's page afresh, past the page's own minute, shows the published card among the similar cards, first among those sharing its world

#### Scenario: grade10-site-store-cross-sell-SC-24 - A similar card that sells out leaves
**Serves:** grade10-site-store-cross-sell-US-02 - the collector is not led to a card that has gone

- **GIVEN** a card with no picks, whose page shows a similar card for sale
- **WHEN** that similar card sells out
- **AND** the store's copy of the catalogue holds the change
- **THEN** reading the card's page afresh, past the page's own minute, shows the rail without it

### Requirement: The rail's exports

The shared UI package SHALL export, from its public entry,
`StoreProductRelatedRail` for this surface, and exactly these types:
`StoreProductRelatedRailProps` and `StoreProductRelatedRailCopy`.

- **What it composes** — `StoreProductRelatedRail` draws the heading with
  `StoreSectionHeader` and one `ProductCard` per card it is given, in the order
  given, and draws no cart control on any of them.
- **Words through copy** — it takes the words it renders in a single `copy`
  prop of its own copy type, and each card's own words with that card; it
  passes no browse-all word and no cart word.
- **Nothing of its own** — it takes the cards and their order as given: it
  reads no catalogue, cuts no list, orders nothing and decides nothing about
  what a card is worth showing.
- **What the tiles owe it** — a heading that needs no browse label and a
  sold-out tile that still opens are `shared/ui/store-home`'s and
  `shared/ui/store-product-listing`'s rules, carried by this change's deltas on
  them.

#### Scenario: grade10-site-store-cross-sell-SC-25 - An application imports the surface
**Serves:** Rail block - an application builds the section under a card from the package rather than its own copy

- **WHEN** an application imports each name above from the shared UI package's public entry
- **THEN** every import resolves
- **AND** no other component or type is exported for this surface

#### Scenario: grade10-site-store-cross-sell-SC-26 - The rail draws what it is given, and sells nothing
**Serves:** Rail block - the page decides the cards, the block draws them

- **GIVEN** `StoreProductRelatedRail` rendered with a heading and seven cards, one of them sold out
- **WHEN** it renders
- **THEN** seven tiles appear in the order given, the sold-out one with its treatment
- **AND** no tile offers a cart control, and no browse-all link is drawn under the heading
