# Product Status — delta

## Purpose

What a collector is told about buying a variant: the shop's own answer for that
variant, said the same way wherever the variant appears, and the answer for a
quantity a collector asks for. The derivation lives here so no surface invents
its own; when the store acts on it for a cart is
`grade10-site/store/cart-validation`'s.

## Feature set

- Variant availability
  - Shop's answer: a variant is available when the shop offers it for sale on
    the store's channel, out of stock when it does not
  - No second derivation: the store reads neither a count nor the shop's
    inventory policy to decide availability
- Requested quantity
  - Three answers: a request is fillable, fillable in part naming what can be
    filled, or not fillable
  - Count as bound: only a count above zero the shop exposes bounds a request
- Cards on browse surfaces
  - Tile rollup: a card is available while any variant on it is
  - Per-variant page: a card's page answers for each variant on its own
  - No quantity: a browse surface says whether a variant can be bought and
    nothing about how many remain
  - Priced but unbuyable: an out-of-stock variant keeps its price and offers no
    control that cannot be used
- Unpublished products
  - Absent, not marked: an unpublished product is missing from the listing and
    its address refuses

## ADDED Requirements

### Requirement: A variant's availability is the shop's answer for it

The store SHALL take a variant's availability from the shop: a variant the shop
offers for sale on the store's sales channel SHALL be available, and a variant
the shop does not SHALL be out of stock.

The store SHALL NOT derive availability from a count, and SHALL NOT read the
shop's inventory policy. A variant the shop keeps offering at zero quantity
SHALL be available; a variant the shop stops offering at zero SHALL be out of
stock; a variant whose count the shop does not expose SHALL be whatever the
shop answers. Whether a variant sells past zero is decided on the shop.

An available variant SHALL be purchasable wherever the surface offers
purchasing, whatever count remains. An out-of-stock variant SHALL NOT be
purchasable on any surface.

#### Scenario: product-status-SC-01 - The shop offers the variant

- **GIVEN** a variant the shop offers for sale with a count of 12
- **THEN** it is available
- **AND** it can be added to the cart

#### Scenario: product-status-SC-02 - The shop no longer offers the variant

- **GIVEN** a variant the shop stopped offering when its count reached 0
- **THEN** it is out of stock
- **AND** it cannot be added to the cart

#### Scenario: product-status-SC-03 - The shop sells past zero

- **GIVEN** a variant the shop still offers for sale at a count of 0
- **THEN** it is available
- **AND** it can be added to the cart, exactly as a variant with 12 can

#### Scenario: product-status-SC-04 - The shop exposes no count

- **GIVEN** a variant the shop offers for sale and exposes no count for
- **THEN** it is available
- **AND** it can be added to the cart

### Requirement: Availability is also answerable for a requested quantity

Where a quantity is requested — a cart line, or a line offered for checkout —
the store SHALL answer for the variant and that quantity together, as one of
three outcomes.

| Answer | When |
| --- | --- |
| Fillable | The variant is available, and the shop exposes no bounding count or the request is at or below it |
| Fillable in part | The variant is available, the shop exposes a count above zero, and the request is above it; the answer names that count |
| Not fillable | The variant is out of stock |

Only a count above zero SHALL bound a request. A shop that exposes no count for
a variant, or a count of zero while still offering it, SHALL bound nothing:
every request of that variant is fillable, and the shop's own checkout answers
for what it can deliver.

Requesting a quantity SHALL NOT change a variant's availability. A variant that
is fillable in part for a request of 50 SHALL remain available.

#### Scenario: product-status-SC-05 - The request can be filled

- **WHEN** 3 are requested of an available variant with a count of 12
- **THEN** the request is fillable

#### Scenario: product-status-SC-06 - The request can be filled exactly

- **WHEN** 12 are requested of an available variant with a count of 12
- **THEN** the request is fillable

#### Scenario: product-status-SC-07 - More is asked for than the count

- **WHEN** 5 are requested of an available variant with a count of 2
- **THEN** the request is fillable in part, naming 2
- **AND** the variant is still available

#### Scenario: product-status-SC-08 - Nothing remains to fill the request

- **WHEN** 5 are requested of an out-of-stock variant
- **THEN** the request is not fillable

#### Scenario: product-status-SC-09 - An unbounded variant fills any request

- **GIVEN** an available variant the shop exposes no count for, and another the
  shop still offers at a count of 0
- **WHEN** 50 are requested of each
- **THEN** both requests are fillable

### Requirement: A browse surface communicates no quantity beyond whether a variant can be bought

The listing and a card's own page SHALL communicate whether a variant can be
bought and nothing more about how much remains. Neither SHALL display a
remaining count, a scarcity treatment, or any label that distinguishes one
available variant from another by quantity, so two available variants are
offered identically however far apart their counts are.

This binds the surfaces a collector browses on. What the cart tells a collector
about a line it could not fill in full is
`grade10-site/store/cart-validation`'s, and is told at the moment the store
acts on the quantity rather than as a cue
to buy sooner.

#### Scenario: product-status-SC-10 - A scarce variant is offered as any other

- **GIVEN** one available variant with a count of 1 and another with a count of
  400
- **WHEN** a collector sees each of them on the listing
- **THEN** both read available, with the same treatment and the same controls
- **AND** neither shows a remaining count or a scarcity label

#### Scenario: product-status-SC-11 - No count reaches the collector while browsing

- **WHEN** the listing or a card's page communicates a variant's availability
- **THEN** it names no remaining quantity

### Requirement: A card's availability is that of its most available variant

Where a card lists more than one variant, the card's own availability SHALL be
that of its most available variant, with available beating out of stock. A card
SHALL be out of stock only when every variant it lists is out of stock.

The listing SHALL communicate each card's rolled-up availability on that card's
tile. A card's own page SHALL communicate availability per variant, for every
variant it lists, rather than for the card as a whole.

#### Scenario: product-status-SC-12 - One grade left, another sold out

- **GIVEN** a card listing one available variant and one out-of-stock variant
- **THEN** the card's tile reads available
- **AND** the card's page reads the first as available and the second as out of
  stock

#### Scenario: product-status-SC-13 - Nothing left on the card

- **GIVEN** a card whose every listed variant is out of stock
- **THEN** the card's tile reads out of stock

### Requirement: Every surface communicates the same availability

The listing, a card's own page, and the cart SHALL each communicate the
availability this capability defines and SHALL NOT derive their own. For the
same variant, read at the same moment, the three SHALL agree.

A surface SHALL NOT hide a price because a variant is out of stock, and SHALL
NOT offer a purchase control that cannot be used.

#### Scenario: product-status-SC-14 - Three surfaces, one answer

- **GIVEN** a variant the shop stopped offering
- **WHEN** a collector sees it on the listing, on its card's page, and as a
  line in the cart, each read at the same moment
- **THEN** all three read it as out of stock

#### Scenario: product-status-SC-15 - An out-of-stock variant keeps its price

- **GIVEN** an out-of-stock variant
- **WHEN** a collector opens the card's page
- **THEN** the variant is still priced
- **AND** no usable purchase control is offered for it

### Requirement: An unpublished product is absent from browsing rather than marked

A product not published to the store's sales channel SHALL NOT appear in the
listing, and its address SHALL answer as `grade10-site/store/product-page`
requires rather than rendering a card marked unavailable. Unavailable SHALL NOT
be an
availability a browse surface communicates: every tile reads available or out
of stock.

Where a collector still meets an unpublished product — a cart line whose
product ceased to be published after it was added — is
`grade10-site/store/cart-validation`'s.

#### Scenario: product-status-SC-16 - An unpublished product is not listed

- **GIVEN** a product not published to the store's sales channel
- **WHEN** a collector opens the listing
- **THEN** no tile for that product appears, with or without an unavailable
  treatment
- **AND** every tile that does appear reads available or out of stock
