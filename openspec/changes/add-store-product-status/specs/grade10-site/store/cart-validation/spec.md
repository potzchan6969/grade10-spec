# grade10-site/store/cart-validation Specification

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
  - Back to the cart: a checkout the store's read or the shop refuses reads
    the cart again as opening it does
- What a read does to a line
  - Reduced: a line the shop can fill in part drops to what it can fill and
    says so
  - Out of stock: a line the shop cannot fill stays, marked, for the collector
    to remove
  - Withdrawn: a line whose product left the channel is removed and named,
    apart from one that sold out
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

## ADDED Requirements

### Requirement: The store re-reads availability and price for cart lines at two moments

Every cart line is re-read when the cart opens and again when it is offered
for checkout, and each read comes from the shop at that moment.

**Two read moments** - The store SHALL re-read availability and price for
every line the cart holds when the cart is opened, and again when the cart is
offered for checkout. It SHALL NOT rely on what a line recorded when it was
added, however recently.

**Back to the cart** - When the checkout read or the shop refuses a checkout
and the collector is returned to the cart, the store SHALL re-read every line
the cart holds under the rules of the cart-open read.

**Live answer** - Each read SHALL be answered by the shop at that moment. A
cached read that serves the listing or a card's page SHALL NOT answer for a
cart line: a browse surface may use its normal catalogue cache, and the cart
may not.

**What is read** - Availability SHALL be answered for the line's variant and
its requested quantity together, as `grade10-site/commerce/product-status`
defines it. Price SHALL be read as an integer count of minor units and an ISO
4217 currency code, as `money-amounts` requires.

**In flight** - While a read is in flight the store SHALL NOT present the
lines it is checking as confirmed, and SHALL NOT let the cart be offered for
checkout on the strength of the previous read. If a read fails, the store
SHALL mark each affected line unchecked, SHALL offer Retry, SHALL NOT present
its recorded availability, price, or the cart total as current, and SHALL keep
checkout unavailable until a later read returns. If the initial cart read
fails before any lines are known, the store SHALL offer Retry and SHALL NOT
name a line, present a total, present the cart as empty, or allow checkout;
the drawer shows that cart as `shared/ui/store-cart` requires for a cart not
yet read.

<!-- trace:scenario id=g10.store-cart-validation.SC-cl3 rev=1 -->
#### Scenario: grade10-site-store-cart-validation-SC-01 - The cart is opened
**Serves:** grade10-site-store-cart-validation-US-01 - Collector opens the cart and learns what moved

- **WHEN** a collector opens the cart
- **THEN** availability and price are re-read for every line it holds
- **AND** no line's recorded availability or price is shown as current until
  that read returns

<!-- trace:scenario id=g10.store-cart-validation.SC-nv7 rev=1 -->
#### Scenario: grade10-site-store-cart-validation-SC-02 - Checkout is requested
**Serves:** grade10-site-store-cart-validation-US-02 - Collector offers the cart for checkout

- **WHEN** a collector offers the cart for checkout
- **THEN** availability and price are re-read for every line before any
  checkout order is created

<!-- trace:scenario id=g10.store-cart-validation.SC-iwp rev=1 -->
#### Scenario: grade10-site-store-cart-validation-SC-03 - A read is still in flight
**Serves:** grade10-site-store-cart-validation-US-01 - Collector opens the cart and learns what moved

- **GIVEN** a collector who opened the cart and whose re-read has not returned
- **THEN** the lines being checked are not presented as confirmed
- **AND** the cart cannot be offered for checkout until the read returns

<!-- trace:scenario id=g10.store-cart-validation.SC-3ei rev=1 -->
#### Scenario: grade10-site-store-cart-validation-SC-22 - The cart read cannot be completed
**Serves:** grade10-site-store-cart-validation-US-01 - Collector opens the cart and learns what moved

- **GIVEN** a collector opening a cart whose read cannot be completed
- **THEN** every held line is named as unchecked
- **AND** no recorded availability, price, or cart total is presented as current
- **AND** Retry is available while checkout remains unavailable

<!-- trace:scenario id=g10.store-cart-validation.SC-scy rev=2 -->
#### Scenario: grade10-site-store-cart-validation-SC-23 - The cart cannot be loaded
**Serves:** grade10-site-store-cart-validation-US-01 - Collector opens the cart and learns what moved

- **GIVEN** a collector opening a cart whose lines are not yet known
- **WHEN** the initial cart read fails
- **THEN** the drawer says the cart could not be checked and offers Retry
- **AND** no line or total is presented as current, and checkout is unavailable
- **AND** the drawer does not say the cart is empty

<!-- trace:scenario id=g10.store-cart-validation.SC-3j7 rev=1 -->
#### Scenario: grade10-site-store-cart-validation-SC-04 - A browse cache is not the answer
**Serves:** grade10-site-store-cart-validation-US-01 - Collector opens the cart and learns what moved

- **GIVEN** a variant the shop stopped offering a moment ago, whose listing
  tile still reads available from a cached read
- **WHEN** a collector opens a cart holding that variant
- **THEN** the line is reported as out of stock

<!-- trace:scenario id=g10.store-cart-validation.SC-6sg rev=1 -->
#### Scenario: grade10-site-store-cart-validation-SC-28 - The cart is read again after a short fill
**Serves:** grade10-site-store-cart-validation-US-03 - Collector meets the shop's own refusal

- **GIVEN** a cart line requesting 3 of a variant the store's checkout read
  confirmed
- **AND** the shop accepts 2 of it at checkout and now counts it at 2
- **WHEN** the collector is returned to the cart
- **THEN** every line is re-read as when the cart opens
- **AND** the line's quantity becomes 2 and it is reported as adjusted

### Requirement: A line the store cannot fill in full is reduced to what remains

A line the shop can fill only in part drops to what it can fill, a line it
cannot fill stays marked, and no line grows.

**Reduced** - When a re-read answers fillable in part for a line, the store
SHALL reduce that line to the quantity that can be filled, SHALL report the
line as adjusted, and SHALL tell the collector the quantity changed and was
not their doing.

**Out of stock** - When a re-read answers not fillable, the store SHALL report
the line as out of stock and SHALL NOT reduce it to zero silently or remove
it. The collector SHALL be able to remove it themselves, and while it stays
the cart SHALL NOT be offered for checkout.

**Never grown** - The store SHALL NOT increase a line's quantity on a re-read,
whatever count has since become available. A collector asked for what they
asked for.

<!-- trace:scenario id=g10.store-cart-validation.SC-cqz rev=1 -->
#### Scenario: grade10-site-store-cart-validation-SC-05 - More was in the cart than remains
**Serves:** grade10-site-store-cart-validation-US-01 - Collector opens the cart and learns what moved

- **GIVEN** a cart line requesting 5 of a variant the shop now counts at 2
- **WHEN** the store re-reads it
- **THEN** the line's quantity becomes 2
- **AND** the line is reported as adjusted, saying the quantity changed

<!-- trace:scenario id=g10.store-cart-validation.SC-hdi rev=1 -->
#### Scenario: grade10-site-store-cart-validation-SC-06 - The line sold out entirely
**Serves:** grade10-site-store-cart-validation-US-01 - Collector opens the cart and learns what moved

- **GIVEN** a cart line requesting 5 of a variant the shop no longer offers
- **WHEN** the store re-reads it
- **THEN** the line is reported as out of stock
- **AND** the line is still shown, and the collector can remove it

<!-- trace:scenario id=g10.store-cart-validation.SC-c5i rev=1 -->
#### Scenario: grade10-site-store-cart-validation-SC-26 - A sold-out line holds checkout
**Serves:** grade10-site-store-cart-validation-US-01 - Collector opens the cart and learns what moved

- **GIVEN** a cart whose open read found one of its two lines out of stock
- **THEN** the cart cannot be offered for checkout
- **WHEN** the collector removes that line
- **THEN** the cart can be offered for checkout

<!-- trace:scenario id=g10.store-cart-validation.SC-gut rev=1 -->
#### Scenario: grade10-site-store-cart-validation-SC-07 - A line is never grown
**Serves:** grade10-site-store-cart-validation-US-01 - Collector opens the cart and learns what moved

- **GIVEN** a cart line requesting 2 of a variant whose count has risen to 40
- **WHEN** the store re-reads it
- **THEN** the line still requests 2

<!-- trace:scenario id=g10.store-cart-validation.SC-c5f rev=1 -->
#### Scenario: grade10-site-store-cart-validation-SC-08 - A line that is still fillable
**Serves:** grade10-site-store-cart-validation-US-01 - Collector opens the cart and learns what moved

- **GIVEN** a cart line requesting 2 of a variant the shop counts at 30
- **WHEN** the store re-reads it
- **THEN** the line is unchanged and carries no adjustment or warning

### Requirement: A line whose product was withdrawn from sale leaves the cart and is named

A line is withdrawn when its product is no longer on the store's sales channel
or its variant no longer exists. A variant the shop still lists but does not
offer for sale is out of stock, not withdrawn.

**Removed on open** - When the cart-open read finds a withdrawn line, the store
SHALL remove that line from the cart, and one notice SHALL name every line it
removed on that read. An out-of-stock line SHALL stay, as the out-of-stock
rule requires.

**Unavailable at checkout** - When the checkout read finds a withdrawn line,
the store SHALL identify it as unavailable, as a cart the checkout read
contradicts requires, and SHALL then remove it from the cart under the same
notice the cart-open read gives.

**Told apart** - A collector whose card sold out SHALL be told something
different from one whose card was withdrawn from sale.

<!-- trace:scenario id=g10.store-cart-validation.SC-93m rev=2 -->
#### Scenario: grade10-site-store-cart-validation-SC-09 - The product was withdrawn from sale
**Serves:** grade10-site-store-cart-validation-US-01 - Collector opens the cart and learns what moved

- **GIVEN** a cart line for a product published when it was added
- **WHEN** the cart opens and the store's read finds that product no longer on
  the channel
- **THEN** the line leaves the cart
- **AND** one notice names the product removed, and does not call it out of
  stock

<!-- trace:scenario id=g10.store-cart-validation.SC-it2 rev=2 -->
#### Scenario: grade10-site-store-cart-validation-SC-10 - Sold out and withdrawn are told apart
**Serves:** grade10-site-store-cart-validation-US-01 - Collector opens the cart and learns what moved

- **GIVEN** a cart holding one line whose variant the shop stopped offering,
  and two lines whose products were unpublished
- **WHEN** the cart opens and the store re-reads them
- **THEN** the first line stays, marked out of stock, for the collector to
  remove
- **AND** the other two leave the cart, and one notice names both

<!-- trace:scenario id=g10.store-cart-validation.SC-tuc rev=1 -->
#### Scenario: grade10-site-store-cart-validation-SC-25 - The variant no longer exists
**Serves:** grade10-site-store-cart-validation-US-01 - Collector opens the cart and learns what moved

- **GIVEN** a cart line for a variant the shop has since deleted, on a product
  still published
- **WHEN** the cart opens and the store re-reads it
- **THEN** the line leaves the cart
- **AND** one notice names it, and does not call it out of stock

<!-- trace:scenario id=g10.store-cart-validation.SC-5dk rev=1 -->
#### Scenario: grade10-site-store-cart-validation-SC-27 - A product withdrawn while the cart was open
**Serves:** grade10-site-store-cart-validation-US-02 - Collector offers the cart for checkout

- **GIVEN** a cart whose open read confirmed every line
- **AND** a product on it removed from the channel since
- **WHEN** the collector offers the cart for checkout
- **THEN** no checkout order is created
- **AND** that line is identified as unavailable, leaves the cart, and is named
  in one removal notice

### Requirement: A line whose price changed is shown at the current price before checkout

A line whose price moved shows the current price and says so once, and no
other price reaches checkout.

**Repriced** - When a re-read returns a price differing from the one the line
was showing, the store SHALL show the current price, SHALL tell the collector
the price changed before the cart is offered for checkout, and SHALL use only
the re-read price in any total it shows. A price that rose SHALL be disclosed
as plainly as one that fell.

**Disclosed once** - A disclosed price SHALL be the line's price from then on:
a later read that returns the same price confirms the line rather than
reporting it again.

**No other price** - The store SHALL NOT create a checkout order from a price
a browser supplied, a price a line recorded when it was added, or a price
whose read did not return.

<!-- trace:scenario id=g10.store-cart-validation.SC-bi6 rev=1 -->
#### Scenario: grade10-site-store-cart-validation-SC-11 - A price rose while the line sat in the cart
**Serves:** grade10-site-store-cart-validation-US-01 - Collector opens the cart and learns what moved

- **GIVEN** a cart line showing 10500 minor units `HKD`
- **WHEN** the store re-reads it and the current price is 12300 minor units
  `HKD`
- **THEN** the line shows 12300 minor units `HKD`
- **AND** the collector is told the price changed before checkout is offered

<!-- trace:scenario id=g10.store-cart-validation.SC-rsl rev=1 -->
#### Scenario: grade10-site-store-cart-validation-SC-12 - A price fell while the line sat in the cart
**Serves:** grade10-site-store-cart-validation-US-01 - Collector opens the cart and learns what moved

- **GIVEN** a cart line showing 12300 minor units `HKD`
- **WHEN** the store re-reads it and the current price is 10500 minor units
  `HKD`
- **THEN** the line shows 10500 minor units `HKD`
- **AND** the collector is told the price changed

<!-- trace:scenario id=g10.store-cart-validation.SC-cj2 rev=1 -->
#### Scenario: grade10-site-store-cart-validation-SC-13 - A disclosed price is the line's price
**Serves:** grade10-site-store-cart-validation-US-01 - Collector opens the cart and learns what moved

- **GIVEN** a cart line repriced to 12300 minor units `HKD` when the cart
  opened, and disclosed
- **WHEN** the collector offers the cart for checkout and the re-read returns
  12300 minor units `HKD`
- **THEN** the line is confirmed and no price change is reported

<!-- trace:scenario id=g10.store-cart-validation.SC-q4f rev=1 -->
#### Scenario: grade10-site-store-cart-validation-SC-24 - A line both shrank and was repriced
**Serves:** grade10-site-store-cart-validation-US-01 - Collector opens the cart and learns what moved

- **GIVEN** a cart line requesting 5 at 10500 minor units `HKD`
- **WHEN** the store re-reads it and the shop counts 2 at 12300 minor units
  `HKD`
- **THEN** the line's quantity becomes 2 and it is reported as adjusted
- **AND** it shows 12300 minor units `HKD`, and the collector is told the price
  changed

<!-- trace:scenario id=g10.store-cart-validation.SC-eqa rev=1 -->
#### Scenario: grade10-site-store-cart-validation-SC-14 - A supplied price decides nothing
**Serves:** grade10-site-store-cart-validation-US-02 - Collector offers the cart for checkout

- **GIVEN** a checkout request carrying a price for a line
- **WHEN** the store creates the checkout order
- **THEN** the amount comes from the store's own re-read and not from the
  request

### Requirement: A cart the checkout read contradicts is not offered for checkout unresolved

The checkout read prices the order, and a cart with any moved line goes back
to the collector before an order is created.

**On checkout** - The read taken when the cart is offered for checkout SHALL
be the read the checkout order is priced from. The store SHALL NOT create the
order from an earlier read, however recent, and SHALL NOT take two reads where
one answers both.

**Nothing contradicted goes** - When that read finds any line out of stock,
unavailable, adjusted, or repriced, the store SHALL NOT create the checkout
order. It SHALL return the collector to their cart with every such line
identified and what happened to each of them said — every contradicted line at
once, not the first one found.

**Proceed after resolving** - The collector SHALL be able to proceed once the
cart holds only lines the read confirmed, without rebuilding it from nothing.

<!-- trace:scenario id=g10.store-cart-validation.SC-rpy rev=1 -->
#### Scenario: grade10-site-store-cart-validation-SC-15 - One line blocks the handoff
**Serves:** grade10-site-store-cart-validation-US-02 - Collector offers the cart for checkout

- **GIVEN** a cart of three lines, one of which the read finds out of stock
- **WHEN** the collector offers the cart for checkout
- **THEN** no checkout order is created
- **AND** the collector is returned to the cart with that line identified

<!-- trace:scenario id=g10.store-cart-validation.SC-bl4 rev=1 -->
#### Scenario: grade10-site-store-cart-validation-SC-16 - Every contradicted line is named at once
**Serves:** grade10-site-store-cart-validation-US-02 - Collector offers the cart for checkout

- **GIVEN** a cart in which one line is unavailable and another was repriced
- **WHEN** the collector offers the cart for checkout
- **THEN** both lines are identified, each saying what happened to it

<!-- trace:scenario id=g10.store-cart-validation.SC-das rev=1 -->
#### Scenario: grade10-site-store-cart-validation-SC-17 - The collector proceeds after resolving
**Serves:** grade10-site-store-cart-validation-US-02 - Collector offers the cart for checkout

- **GIVEN** a collector who removed the line that blocked their checkout
- **WHEN** they offer the cart again and the read confirms every line
- **THEN** the checkout order is created from the confirmed lines

<!-- trace:scenario id=g10.store-cart-validation.SC-6ed rev=1 -->
#### Scenario: grade10-site-store-cart-validation-SC-18 - An earlier read does not carry a checkout
**Serves:** grade10-site-store-cart-validation-US-02 - Collector offers the cart for checkout

- **GIVEN** a cart whose open-time read confirmed every line
- **AND** a variant on it the shop stopped offering since
- **WHEN** the collector offers the cart for checkout
- **THEN** no checkout order is created
- **AND** that line is identified as out of stock

### Requirement: The store's read is advisory and the shop remains the authority

The store's read is its best answer at the time; the shop's refusal is
reported, a short fill is refused, and a read that fails blocks the handoff.

**Shop's last word** - The store's re-read SHALL be treated as the best
available answer at the moment it was taken, not as a guarantee. A checkout
the shop subsequently refuses SHALL be reported to the collector with the
refused lines identified, and SHALL NOT be presented as a fault of the
collector's or hidden behind a generic failure.

**Filled short** - A cart the shop would fill short — accepting fewer of a
line than were asked for — SHALL be refused with that line identified and the
quantity the shop would fill, and SHALL NOT be sold short.

**Read cannot complete** - When the read itself cannot be completed, the store
SHALL NOT invent availability or price and SHALL NOT create a checkout order.
The lines it holds are treated as **In flight** requires.

<!-- trace:scenario id=g10.store-cart-validation.SC-wfj rev=1 -->
#### Scenario: grade10-site-store-cart-validation-SC-19 - The shop refuses what the store had confirmed
**Serves:** grade10-site-store-cart-validation-US-03 - Collector meets the shop's own refusal

- **GIVEN** a cart whose re-read confirmed every line
- **WHEN** the shop refuses the checkout for a line it can no longer sell
- **THEN** the collector is told which line was refused
- **AND** the cart is theirs to resolve, with the other lines intact

<!-- trace:scenario id=g10.store-cart-validation.SC-14e rev=1 -->
#### Scenario: grade10-site-store-cart-validation-SC-20 - The shop would fill a line short
**Serves:** grade10-site-store-cart-validation-US-03 - Collector meets the shop's own refusal

- **GIVEN** a cart line requesting 3 of a variant the store's read confirmed
- **WHEN** the shop accepts 2 of it at checkout
- **THEN** no checkout order is created
- **AND** the line is identified with 2 as the quantity the shop would fill

<!-- trace:scenario id=g10.store-cart-validation.SC-3zl rev=2 -->
#### Scenario: grade10-site-store-cart-validation-SC-21 - The read cannot be completed
**Serves:** grade10-site-store-cart-validation-US-03 - Collector meets the shop's own refusal

- **GIVEN** a collector offering the cart for checkout
- **WHEN** the store cannot complete its availability and price read
- **THEN** no checkout order is created
- **AND** the collector is told the check could not be completed, with no
  invented availability or price shown
- **AND** each held line is marked unchecked; no recorded availability,
  price, or cart total is presented as current
- **AND** Retry is available, and checkout remains unavailable until a later
  read returns
