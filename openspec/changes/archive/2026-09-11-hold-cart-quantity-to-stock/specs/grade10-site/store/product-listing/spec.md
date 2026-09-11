## Feature set

- Held to the shop's count
  - Ceiling from the shop: a card's cart stops at what the shop has, where the shop says
  - Silent where unknown: a shop exposing no count puts no ceiling on the card
- Said when it is news
  - Few left: the card says how many remain once the shop is nearly out
  - All of them asked for: the card says the same when the collector has taken the last one

## ADDED Requirements

### Requirement: The browse listing holds a collector to the shop's count

Each card SHALL carry, as its cart's ceiling, the number the shop has left of
the card's buyable variant. Where the shop exposes no count for that variant,
the card SHALL carry no ceiling and a collector SHALL go on asking for any
quantity — the shop has not said there are few, and a ceiling invented here
would refuse a sale nobody refused.

The ceiling is what the shop last said, so it is advisory: the cart's own
review remains what decides a quantity, and goes on reducing a line the shop
can no longer fill.

#### Scenario: grade10-site-store-product-listing-SC-18 - A card stops at what the shop has

- **GIVEN** a listing holding a card the shop has three of
- **WHEN** a collector raises that card's quantity past three
- **THEN** the quantity stays at three
- **AND** the cart holds three of that card

#### Scenario: grade10-site-store-product-listing-SC-19 - A shop that counts nothing stops nothing

- **GIVEN** a listing holding a card the shop exposes no count for
- **WHEN** a collector raises that card's quantity above three
- **THEN** the quantity rises as asked
- **AND** the cart holds what they asked for

### Requirement: The browse listing says how many are left when that is news

A card SHALL say how many the shop has left when the shop has three or fewer
of it, and when the collector has asked for every one there is. It SHALL say
nothing about what is left at any other time, so the count reads as news
rather than as standing pressure to hurry.

Three or fewer is what counts as nearly out across this store, and the
listing SHALL NOT hold its own number.

#### Scenario: grade10-site-store-product-listing-SC-20 - Nearly out is said on the card

- **GIVEN** a listing holding a card the shop has three of and a card the shop has forty-one of
- **WHEN** the listing renders
- **THEN** the card the shop has three of says three are left
- **AND** the card the shop has forty-one of says nothing about what is left

#### Scenario: grade10-site-store-product-listing-SC-21 - Asking for the last one is answered

- **GIVEN** a listing holding a card the shop has forty-one of
- **WHEN** a collector raises that card's quantity to forty-one
- **THEN** the card says forty-one are left
- **AND** the quantity does not rise past forty-one
