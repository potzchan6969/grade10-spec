# Cart Validation — delta

## Purpose

The store keeps its own cart, so what a cart line claims is only as fresh as
the last read behind it. This capability governs when the store re-reads
inventory and price for the lines a collector holds, what it does to a line the
read contradicts, and what the collector is told — up to the moment the cart is
offered for checkout, where Shopify becomes the authority.

## ADDED Requirements

### Requirement: The store re-reads inventory and price for cart lines at two moments

The store SHALL re-read availability and price for every line the cart holds
when the cart is opened, and again before the cart is offered for checkout. It
SHALL NOT rely on what a line recorded when it was added, however recently.

Availability SHALL be answered for the line's variant and its requested
quantity together, as `grade10-store/product-status` derives it. Price SHALL be
read as an integer count of minor units and an ISO 4217 currency code, as
`money-amounts` requires.

While a read is in flight the store SHALL NOT present the lines it is checking
as confirmed, and SHALL NOT let the cart be offered for checkout on the strength
of the previous read.

#### Scenario: The cart is opened

- **WHEN** a collector opens the cart
- **THEN** availability and price are re-read for every line it holds
- **AND** no line's recorded availability or price is shown as current until
  that read returns

#### Scenario: Checkout is requested

- **WHEN** a collector offers the cart for checkout
- **THEN** availability and price are re-read for every line before the checkout
  order is created

#### Scenario: A read is still in flight

- **GIVEN** a collector who opened the cart and whose re-read has not returned
- **THEN** the lines being checked are not presented as confirmed
- **AND** the cart cannot be offered for checkout until the read returns

### Requirement: A line the store cannot fill in full is reduced to what remains

When a re-read reports a line fillable in part, the store SHALL reduce that
line to the quantity that can be filled, SHALL report the line as adjusted, and
SHALL tell the collector the quantity changed and was not their doing.

When a re-read reports a line not fillable, the store SHALL report it as out of
stock and SHALL NOT reduce it to zero silently or remove it. The collector
SHALL be able to remove it themselves.

The store SHALL NOT increase a line's quantity on a re-read, whatever quantity
has since become available. A collector asked for what they asked for.

#### Scenario: More was in the cart than remains

- **GIVEN** a cart line requesting 5 of a variant whose available quantity is 2
- **WHEN** the store re-reads it
- **THEN** the line's quantity becomes 2
- **AND** the line is reported as adjusted, saying the quantity changed

#### Scenario: The line sold out entirely

- **GIVEN** a cart line requesting 5 of a variant whose available quantity is 0
- **WHEN** the store re-reads it
- **THEN** the line is reported as out of stock
- **AND** the line is still shown, and the collector can remove it

#### Scenario: A line is never grown

- **GIVEN** a cart line requesting 2 of a variant whose available quantity has
  risen to 40
- **WHEN** the store re-reads it
- **THEN** the line still requests 2

#### Scenario: A line that is still fillable

- **GIVEN** a cart line requesting 2 of a variant whose available quantity is 30
- **WHEN** the store re-reads it
- **THEN** the line is unchanged and carries no adjustment or warning

### Requirement: A line whose product was withdrawn from sale is reported as unavailable

When a re-read reports that a line's product is no longer published to the sales
channel, the store SHALL report that line as unavailable, distinctly from out of
stock. A collector whose card sold out SHALL be told something different from
one whose card was withdrawn from sale.

#### Scenario: The product was withdrawn from sale

- **GIVEN** a cart line for a product published when it was added
- **WHEN** the store re-reads it and that product is no longer published
- **THEN** the line is reported as unavailable, and not as out of stock

#### Scenario: Sold out and withdrawn are told apart

- **GIVEN** a cart holding one line whose variant reached quantity 0 and one
  line whose product was unpublished
- **WHEN** the store re-reads them
- **THEN** the first is reported as out of stock and the second as unavailable

### Requirement: A line whose price changed is shown at the current price before checkout

When a re-read returns a price differing from the one the line was showing, the
store SHALL show the current price, SHALL tell the collector that price changed
before the cart is offered for checkout, and SHALL use only the re-read price in
any total it shows.

The store SHALL NOT create a checkout order from a price a browser supplied, a
price a line recorded when it was added, or a price whose read did not return.
A price that rose SHALL be disclosed as plainly as one that fell.

#### Scenario: A price rose while the line sat in the cart

- **GIVEN** a cart line showing 10500 minor units `HKD`
- **WHEN** the store re-reads it and the current price is 12300 minor units `HKD`
- **THEN** the line shows 12300 minor units `HKD`
- **AND** the collector is told the price changed before checkout is offered

#### Scenario: A price fell while the line sat in the cart

- **GIVEN** a cart line showing 12300 minor units `HKD`
- **WHEN** the store re-reads it and the current price is 10500 minor units `HKD`
- **THEN** the line shows 10500 minor units `HKD`
- **AND** the collector is told the price changed

#### Scenario: A supplied price decides nothing

- **GIVEN** a checkout request carrying a price for a line
- **WHEN** the store creates the checkout order
- **THEN** the amount comes from the store's own re-read and not from the
  request

### Requirement: A cart the re-read contradicts is not offered for checkout unresolved

When the re-read before checkout finds any line out of stock, unavailable,
adjusted, or repriced, the store SHALL NOT create the checkout order. It SHALL
return the collector to their cart with every such line identified and what
happened to each of them said.

The collector SHALL be able to proceed once the cart holds only lines the
re-read confirmed, without rebuilding it from nothing.

#### Scenario: One line blocks the handoff

- **GIVEN** a cart of three lines, one of which the re-read finds out of stock
- **WHEN** the collector offers the cart for checkout
- **THEN** no checkout order is created
- **AND** the collector is returned to the cart with that line identified

#### Scenario: Every contradicted line is named at once

- **GIVEN** a cart in which one line is unavailable and another was repriced
- **WHEN** the collector offers the cart for checkout
- **THEN** both lines are identified, each saying what happened to it

#### Scenario: The collector proceeds after resolving

- **GIVEN** a collector who removed the line that blocked their checkout
- **WHEN** they offer the cart again and the re-read confirms every line
- **THEN** the checkout order is created from the confirmed lines

### Requirement: The store's read is advisory and Shopify remains the authority

The store's re-read SHALL be treated as the best available answer at the moment
it was taken, not as a guarantee. A checkout Shopify subsequently refuses SHALL
be reported to the collector with the refused lines identified, and SHALL NOT be
presented as a fault of the collector's or hidden behind a generic failure.

When the read itself cannot be completed, the store SHALL NOT invent
availability or price, SHALL NOT fall back to what a line recorded, and SHALL
NOT create a checkout order.

#### Scenario: Shopify refuses what the store had confirmed

- **GIVEN** a cart whose re-read confirmed every line
- **WHEN** Shopify refuses the checkout for a line it can no longer sell
- **THEN** the collector is told which line was refused
- **AND** the cart is theirs to resolve, with the other lines intact

#### Scenario: The read cannot be completed

- **GIVEN** a collector offering the cart for checkout
- **WHEN** the store cannot complete its availability and price read
- **THEN** no checkout order is created
- **AND** the collector is told the check could not be completed, with no
  invented availability or price shown
