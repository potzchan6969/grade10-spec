## Feature set

- Held to the shop's count
  - Ceiling from the shop: the page stops a collector at what the shop has of the chosen variant
  - Silent where unknown: a shop exposing no count puts no ceiling on the page
- Said when it is news
  - Few left: the page says how many remain once the shop is nearly out
  - All of them asked for: the page says the same when the collector has taken the last one

## ADDED Requirements

### Requirement: A card's page holds a collector to the shop's count

The page SHALL NOT let a collector ask for more of the chosen variant than the
shop has left of it. Where the shop exposes no count for that variant, the
page SHALL put no ceiling on what a collector asks for.

The ceiling is what the shop last said, so it is advisory: the cart's own
review remains what decides a quantity, and goes on reducing a line the shop
can no longer fill.

Choosing a different variant SHALL bring that variant's ceiling with it, since
one grade of a card selling out says nothing about another.

#### Scenario: grade10-site-store-product-page-SC-19 - The page stops at what the shop has

- **GIVEN** a card whose chosen variant the shop has three of
- **WHEN** a collector raises the quantity past three
- **THEN** the quantity stays at three

#### Scenario: grade10-site-store-product-page-SC-20 - A shop that counts nothing stops nothing

- **GIVEN** a card whose chosen variant the shop exposes no count for
- **WHEN** a collector raises the quantity above three
- **THEN** the quantity rises as asked

#### Scenario: grade10-site-store-product-page-SC-21 - Another grade brings its own ceiling

- **GIVEN** a card listing one variant the shop has two of and another it has ten of
- **WHEN** a collector chooses the one the shop has ten of and raises the quantity to ten
- **THEN** the quantity rises to ten

### Requirement: A card's page says how many are left when that is news

The page SHALL say how many the shop has left of the chosen variant when the
shop has three or fewer of it, and when the collector has asked for every one
there is. It SHALL say nothing about what is left at any other time.

Three or fewer is what counts as nearly out across this store, and the page
SHALL NOT hold its own number.

#### Scenario: grade10-site-store-product-page-SC-22 - Nearly out is said on the page

- **GIVEN** a card whose chosen variant the shop has three of
- **WHEN** the page renders
- **THEN** the page says three are left

#### Scenario: grade10-site-store-product-page-SC-23 - Asking for the last one is answered

- **GIVEN** a card whose chosen variant the shop has forty-one of
- **WHEN** a collector raises the quantity to forty-one
- **THEN** the page says forty-one are left
- **AND** the quantity does not rise past forty-one

#### Scenario: grade10-site-store-product-page-SC-24 - A well-stocked card says nothing

- **GIVEN** a card whose chosen variant the shop has forty-one of
- **WHEN** the page renders
- **THEN** the page says nothing about how many are left
