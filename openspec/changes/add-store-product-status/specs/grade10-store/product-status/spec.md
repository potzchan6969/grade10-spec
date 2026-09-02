# Product Status — delta

## Purpose

What a collector is told about buying a variant, derived once from the store's
inventory facts and said the same way wherever the variant appears. The
derivation lives here so no surface invents its own; when the store acts on it
for a cart is `grade10-store/cart-validation`'s.

## ADDED Requirements

### Requirement: A variant's availability is derived from its quantity alone

The store SHALL derive every variant's availability from its available
quantity: a quantity of one or more SHALL be available, and a quantity of zero
or less SHALL be out of stock.

The store SHALL NOT read the variant's inventory policy when deriving
availability. A variant whose policy permits selling past zero SHALL still be
out of stock at zero, SHALL NOT be offered for purchase, and SHALL NOT be
distinguished from any other out-of-stock variant.

An available variant SHALL be purchasable wherever the surface offers
purchasing, whatever quantity remains. An out-of-stock variant SHALL NOT be
purchasable on any surface.

#### Scenario: Stock remains

- **WHEN** a variant's available quantity is 12
- **THEN** it is available
- **AND** it can be added to the cart

#### Scenario: The final copy

- **WHEN** a variant's available quantity is 1
- **THEN** it is available
- **AND** it can be added to the cart, exactly as a variant with 12 can

#### Scenario: Stock exhausted

- **WHEN** a variant's available quantity is 0
- **THEN** it is out of stock
- **AND** it cannot be added to the cart

#### Scenario: Selling past zero is not honoured

- **GIVEN** a variant whose inventory policy permits selling at zero quantity
- **WHEN** its available quantity is 0
- **THEN** it is out of stock
- **AND** it cannot be added to the cart
- **AND** it reads no differently from a variant whose policy denies it

#### Scenario: A negative quantity is not available

- **WHEN** a variant's available quantity is below 0
- **THEN** it is out of stock

### Requirement: Availability is also answerable for a requested quantity

Where a quantity is requested — a cart line, or a line offered for checkout —
the store SHALL answer availability for the variant and that quantity together,
as one of three outcomes: the request is fillable when the available quantity
is at least the requested quantity; it is fillable in part when the available
quantity is at least one but below it; and it is not fillable when the variant
is out of stock.

Fillable in part SHALL name the quantity that can be filled. A request that is
fillable in part SHALL NOT be reported as simply available, and SHALL NOT be
reported as out of stock: the variant can still be bought, but not in the
quantity asked for.

Requesting a quantity SHALL NOT change a variant's own availability. A variant
available for a request of 1 SHALL remain available when a request for 50
cannot be filled.

#### Scenario: The request can be filled

- **WHEN** 3 are requested of a variant whose available quantity is 12
- **THEN** the request is fillable

#### Scenario: The request can be filled exactly

- **WHEN** 12 are requested of a variant whose available quantity is 12
- **THEN** the request is fillable

#### Scenario: More is asked for than remains

- **WHEN** 5 are requested of a variant whose available quantity is 2
- **THEN** the request is fillable in part, naming 2 as the quantity that can be
  filled
- **AND** the variant is still available

#### Scenario: Nothing remains to fill the request

- **WHEN** 5 are requested of a variant whose available quantity is 0
- **THEN** the request is not fillable
- **AND** the variant is out of stock

### Requirement: A browse surface communicates no quantity beyond whether a variant can be bought

The listing and a card's own page SHALL communicate whether a variant can be
bought and nothing more about how much remains. Neither SHALL display a
remaining count, a scarcity treatment, or any label that distinguishes one
available variant from another by quantity, so two available variants are
offered identically however far apart their quantities are.

This binds the surfaces a collector browses on. What the cart tells a collector
about a line it could not fill in full is `grade10-store/cart-validation`'s,
and is told at the moment the store acts on the quantity rather than as a cue
to buy sooner.

#### Scenario: A scarce variant is offered as any other

- **GIVEN** one variant with an available quantity of 1 and another with 400
- **WHEN** a collector sees each of them on the listing
- **THEN** both read available, with the same treatment and the same controls
- **AND** neither shows a remaining count or a scarcity label

#### Scenario: No count reaches the collector while browsing

- **WHEN** the listing or a card's page communicates a variant's availability
- **THEN** it names no remaining quantity

### Requirement: A card's availability is that of its most available variant

Where a card lists more than one variant, the card's own availability SHALL be
that of its most available variant, with available beating out of stock. A card
SHALL be out of stock only when every variant it lists is out of stock.

#### Scenario: One grade left, another sold out

- **GIVEN** a card listing one variant with quantity 20 and one with quantity 0
- **THEN** the card is available

#### Scenario: Only a scarce grade remains

- **GIVEN** a card listing one variant with quantity 2 and one with quantity 0
- **THEN** the card is available, with no treatment marking it apart

#### Scenario: Nothing left on the card

- **GIVEN** a card whose every listed variant has quantity 0
- **THEN** the card is out of stock

### Requirement: Every surface communicates the same derived availability

The listing, a card's own page, and the cart SHALL each communicate the
availability this capability derives, and SHALL NOT derive their own. For the
same variant, read at the same moment, the three SHALL agree.

The listing SHALL communicate each card's rolled-up availability on that card's
tile. A card's own page SHALL communicate availability per variant, for every
variant it lists, rather than for the card as a whole.

A surface SHALL NOT hide a price because a variant is out of stock, and SHALL
NOT offer a purchase control that cannot be used.

#### Scenario: A tile and a card page agree

- **GIVEN** a card listing one variant with quantity 3 and one with quantity 0
- **WHEN** a collector sees its tile and then opens its page
- **THEN** the tile reads available
- **AND** the page reads the quantity-3 variant as available and the quantity-0
  variant as out of stock

#### Scenario: Per-variant, not per-card, on the page

- **GIVEN** a card listing one variant with quantity 30 and one with quantity 0
- **WHEN** a collector opens its page
- **THEN** each variant reads on its own, and the card's rolled-up availability
  is not what either of them shows

#### Scenario: An out-of-stock variant keeps its price

- **GIVEN** a variant with quantity 0
- **WHEN** a collector opens the card's page
- **THEN** the variant is still priced
- **AND** no usable purchase control is offered for it

### Requirement: An unpublished product is absent from browsing rather than marked

A product not published to the sales channel SHALL NOT appear in the listing,
and its address SHALL answer as `grade10-store/product-page` already requires
rather than rendering a card marked unavailable. Unavailable SHALL NOT be an
availability a browse surface communicates.

Where a collector still meets an unpublished product — a cart line whose
product ceased to be published after it was added — is
`grade10-store/cart-validation`'s.

#### Scenario: An unpublished product is not listed

- **GIVEN** a product not published to the sales channel
- **WHEN** a collector opens the listing
- **THEN** no tile for that product appears, with or without an unavailable
  treatment

#### Scenario: The listing reports no unavailable tile

- **WHEN** the listing renders
- **THEN** every tile it shows reads available or out of stock
