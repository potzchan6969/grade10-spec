# Cart Validation — delta

## Purpose

The store keeps its own cart, so what a cart line claims is only as fresh as
the last read behind it. This capability governs when the store re-reads
availability and price for the lines a collector holds, what it does to a line
the read contradicts, and what the collector is told — up to the moment the
cart is offered for checkout, where the shop becomes the authority.

## Feature set

- Two read moments
  - On open: every line is re-read when the cart opens, and nothing is shown as
    current until the read returns
  - On checkout: the read that decides whether the cart goes is the read the
    order is priced from
  - Live answer: each read is answered by the shop at that moment, never by a
    browse cache or a recorded value
- What a read does to a line
  - Reduced: a line the shop can fill in part drops to what it can fill and
    says so
  - Out of stock: a line the shop cannot fill stays, marked, for the collector
    to remove
  - Unavailable: a line whose product left the channel is told apart from one
    that sold out
  - Repriced: a line shows the current price, the change is disclosed once, and
    that price is the line's from then on
  - Never grown: a line keeps the quantity the collector asked for when more
    becomes available
- Handoff
  - Nothing contradicted goes: a cart with any moved line is returned to the
    collector with every such line named
  - Proceed after resolving: a cart of confirmed lines goes without being
    rebuilt
  - Shop's last word: a refusal from the shop after a passing read is reported
    with the line named, and a read that cannot complete blocks the handoff

## User journeys

### cart-validation-US-01: Collector opens the cart and learns what moved

**As a** collector,
**I want** the cart to tell me, as it opens, which lines sold out, shrank, left
the store, or changed price,
**so that** I fix my cart before I try to pay rather than being refused at
checkout for something the store already knew.

**Accepted by:**

- `cart-validation-SC-01` — The cart is opened
- `cart-validation-SC-03` — A read is still in flight
- `cart-validation-SC-04` — A browse cache is not the answer
- `cart-validation-SC-05` — More was in the cart than remains
- `cart-validation-SC-06` — The line sold out entirely
- `cart-validation-SC-07` — A line is never grown
- `cart-validation-SC-08` — A line that is still fillable
- `cart-validation-SC-09` — The product was withdrawn from sale
- `cart-validation-SC-10` — Sold out and withdrawn are told apart
- `cart-validation-SC-11` — A price rose while the line sat in the cart
- `cart-validation-SC-12` — A price fell while the line sat in the cart
- `cart-validation-SC-13` — A disclosed price is the line's price

### cart-validation-US-02: Collector offers the cart for checkout

**As a** collector,
**I want** the store to check every line once more as I check out and to name
every line that moved,
**so that** I reach the shop's payment page only with a cart it can fill, and
when I cannot, I know exactly what to fix.

**Accepted by:**

- `cart-validation-SC-02` — Checkout is requested
- `cart-validation-SC-14` — A supplied price decides nothing
- `cart-validation-SC-15` — One line blocks the handoff
- `cart-validation-SC-16` — Every contradicted line is named at once
- `cart-validation-SC-17` — The collector proceeds after resolving
- `cart-validation-SC-18` — An earlier read does not carry a checkout

### cart-validation-US-03: Collector meets the shop's own refusal

**As a** collector,
**I want** a refusal from the shop, or a check the store could not finish, told
to me with the line named,
**so that** a cart that passed the store's read and still failed is mine to
resolve, not a dead end.

**Accepted by:**

- `cart-validation-SC-19` — The shop refuses what the store had confirmed
- `cart-validation-SC-20` — The shop would fill a line short
- `cart-validation-SC-21` — The read cannot be completed

## ADDED Requirements

### Requirement: The store re-reads availability and price for cart lines at two moments

The store SHALL re-read availability and price for every line the cart holds
when the cart is opened, and again when the cart is offered for checkout. It
SHALL NOT rely on what a line recorded when it was added, however recently.

Each read SHALL be answered by the shop at that moment. A cached read that
serves the listing or a card's page SHALL NOT answer for a cart line: a browse
surface is allowed to lag the shop within the invalidation
`grade10-store/shopify-commerce` requires, and the cart is not.

Availability SHALL be answered for the line's variant and its requested
quantity together, as `grade10-store/product-status` defines it. Price SHALL be
read as an integer count of minor units and an ISO 4217 currency code, as
`money-amounts` requires.

While a read is in flight the store SHALL NOT present the lines it is checking
as confirmed, and SHALL NOT let the cart be offered for checkout on the strength
of the previous read.

#### Scenario: cart-validation-SC-01 - The cart is opened

- **WHEN** a collector opens the cart
- **THEN** availability and price are re-read for every line it holds
- **AND** no line's recorded availability or price is shown as current until
  that read returns

#### Scenario: cart-validation-SC-02 - Checkout is requested

- **WHEN** a collector offers the cart for checkout
- **THEN** availability and price are re-read for every line before any
  checkout order is created

#### Scenario: cart-validation-SC-03 - A read is still in flight

- **GIVEN** a collector who opened the cart and whose re-read has not returned
- **THEN** the lines being checked are not presented as confirmed
- **AND** the cart cannot be offered for checkout until the read returns

#### Scenario: cart-validation-SC-04 - A browse cache is not the answer

- **GIVEN** a variant the shop stopped offering a moment ago, whose listing
  tile still reads available from a cached read
- **WHEN** a collector opens a cart holding that variant
- **THEN** the line is reported as out of stock

### Requirement: A line the store cannot fill in full is reduced to what remains

When a re-read answers fillable in part for a line, the store SHALL reduce that
line to the quantity that can be filled, SHALL report the line as adjusted, and
SHALL tell the collector the quantity changed and was not their doing.

When a re-read answers not fillable, the store SHALL report the line as out of
stock and SHALL NOT reduce it to zero silently or remove it. The collector
SHALL be able to remove it themselves.

The store SHALL NOT increase a line's quantity on a re-read, whatever count has
since become available. A collector asked for what they asked for.

#### Scenario: cart-validation-SC-05 - More was in the cart than remains

- **GIVEN** a cart line requesting 5 of a variant the shop now counts at 2
- **WHEN** the store re-reads it
- **THEN** the line's quantity becomes 2
- **AND** the line is reported as adjusted, saying the quantity changed

#### Scenario: cart-validation-SC-06 - The line sold out entirely

- **GIVEN** a cart line requesting 5 of a variant the shop no longer offers
- **WHEN** the store re-reads it
- **THEN** the line is reported as out of stock
- **AND** the line is still shown, and the collector can remove it

#### Scenario: cart-validation-SC-07 - A line is never grown

- **GIVEN** a cart line requesting 2 of a variant whose count has risen to 40
- **WHEN** the store re-reads it
- **THEN** the line still requests 2

#### Scenario: cart-validation-SC-08 - A line that is still fillable

- **GIVEN** a cart line requesting 2 of a variant the shop counts at 30
- **WHEN** the store re-reads it
- **THEN** the line is unchanged and carries no adjustment or warning

### Requirement: A line whose product was withdrawn from sale is reported as unavailable

When a re-read finds that a line's product, or the variant itself, is no longer
on the store's sales channel, the store SHALL report that line as unavailable,
distinctly from out of stock. A collector whose card sold out SHALL be told
something different from one whose card was withdrawn from sale.

#### Scenario: cart-validation-SC-09 - The product was withdrawn from sale

- **GIVEN** a cart line for a product published when it was added
- **WHEN** the store re-reads it and that product is no longer on the channel
- **THEN** the line is reported as unavailable, and not as out of stock

#### Scenario: cart-validation-SC-10 - Sold out and withdrawn are told apart

- **GIVEN** a cart holding one line whose variant the shop stopped offering and
  one line whose product was unpublished
- **WHEN** the store re-reads them
- **THEN** the first is reported as out of stock and the second as unavailable

### Requirement: A line whose price changed is shown at the current price before checkout

When a re-read returns a price differing from the one the line was showing, the
store SHALL show the current price, SHALL tell the collector the price changed
before the cart is offered for checkout, and SHALL use only the re-read price in
any total it shows. A price that rose SHALL be disclosed as plainly as one that
fell.

A disclosed price SHALL be the line's price from then on: a later read that
returns the same price confirms the line rather than reporting it again.

The store SHALL NOT create a checkout order from a price a browser supplied, a
price a line recorded when it was added, or a price whose read did not return.

#### Scenario: cart-validation-SC-11 - A price rose while the line sat in the cart

- **GIVEN** a cart line showing 10500 minor units `HKD`
- **WHEN** the store re-reads it and the current price is 12300 minor units
  `HKD`
- **THEN** the line shows 12300 minor units `HKD`
- **AND** the collector is told the price changed before checkout is offered

#### Scenario: cart-validation-SC-12 - A price fell while the line sat in the cart

- **GIVEN** a cart line showing 12300 minor units `HKD`
- **WHEN** the store re-reads it and the current price is 10500 minor units
  `HKD`
- **THEN** the line shows 10500 minor units `HKD`
- **AND** the collector is told the price changed

#### Scenario: cart-validation-SC-13 - A disclosed price is the line's price

- **GIVEN** a cart line repriced to 12300 minor units `HKD` when the cart
  opened, and disclosed
- **WHEN** the collector offers the cart for checkout and the re-read returns
  12300 minor units `HKD`
- **THEN** the line is confirmed and no price change is reported

#### Scenario: cart-validation-SC-14 - A supplied price decides nothing

- **GIVEN** a checkout request carrying a price for a line
- **WHEN** the store creates the checkout order
- **THEN** the amount comes from the store's own re-read and not from the
  request

### Requirement: A cart the checkout read contradicts is not offered for checkout unresolved

The read taken when the cart is offered for checkout SHALL be the read the
checkout order is priced from. The store SHALL NOT create the order from an
earlier read, however recent, and SHALL NOT take two reads where one answers
both.

When that read finds any line out of stock, unavailable, adjusted, or repriced,
the store SHALL NOT create the checkout order. It SHALL return the collector to
their cart with every such line identified and what happened to each of them
said — every contradicted line at once, not the first one found.

The collector SHALL be able to proceed once the cart holds only lines the read
confirmed, without rebuilding it from nothing.

#### Scenario: cart-validation-SC-15 - One line blocks the handoff

- **GIVEN** a cart of three lines, one of which the read finds out of stock
- **WHEN** the collector offers the cart for checkout
- **THEN** no checkout order is created
- **AND** the collector is returned to the cart with that line identified

#### Scenario: cart-validation-SC-16 - Every contradicted line is named at once

- **GIVEN** a cart in which one line is unavailable and another was repriced
- **WHEN** the collector offers the cart for checkout
- **THEN** both lines are identified, each saying what happened to it

#### Scenario: cart-validation-SC-17 - The collector proceeds after resolving

- **GIVEN** a collector who removed the line that blocked their checkout
- **WHEN** they offer the cart again and the read confirms every line
- **THEN** the checkout order is created from the confirmed lines

#### Scenario: cart-validation-SC-18 - An earlier read does not carry a checkout

- **GIVEN** a cart whose open-time read confirmed every line
- **AND** a variant on it the shop stopped offering since
- **WHEN** the collector offers the cart for checkout
- **THEN** no checkout order is created
- **AND** that line is identified as out of stock

### Requirement: The store's read is advisory and the shop remains the authority

The store's re-read SHALL be treated as the best available answer at the moment
it was taken, not as a guarantee. A checkout the shop subsequently refuses SHALL
be reported to the collector with the refused lines identified, and SHALL NOT be
presented as a fault of the collector's or hidden behind a generic failure.

A cart the shop would fill short — accepting fewer of a line than were asked
for — SHALL be refused with that line identified and the quantity the shop
would fill, and SHALL NOT be sold short.

When the read itself cannot be completed, the store SHALL NOT invent
availability or price, SHALL NOT fall back to what a line recorded, and SHALL
NOT create a checkout order.

#### Scenario: cart-validation-SC-19 - The shop refuses what the store had confirmed

- **GIVEN** a cart whose re-read confirmed every line
- **WHEN** the shop refuses the checkout for a line it can no longer sell
- **THEN** the collector is told which line was refused
- **AND** the cart is theirs to resolve, with the other lines intact

#### Scenario: cart-validation-SC-20 - The shop would fill a line short

- **GIVEN** a cart line requesting 3 of a variant the store's read confirmed
- **WHEN** the shop accepts 2 of it at checkout
- **THEN** no checkout order is created
- **AND** the line is identified with 2 as the quantity the shop would fill

#### Scenario: cart-validation-SC-21 - The read cannot be completed

- **GIVEN** a collector offering the cart for checkout
- **WHEN** the store cannot complete its availability and price read
- **THEN** no checkout order is created
- **AND** the collector is told the check could not be completed, with no
  invented availability or price shown
