# grade10-site/store/discounts Specification

## Purpose
A discount reaches a draft order one of a few ways — a typed discount code, a
store-minted coupon, a loyalty reward, points, a site discount. This
capability holds how those transports work: what rides as a Shopify Discount
code, how many a draft order can carry at once, and when one is minted.
## Feature set

- One discount-code slot
  - A typed discount code, an order coupon, a product coupon, a gift and a
    loyalty reward's own coupon all ride as one Shopify Discount code
  - At most one applies per order; a checkout eligible for more than one has
    the collector pick
  - A site discount the shop applies in place of the code keeps the sale;
    the coupon returns to the wallet and the member is told
- An ephemeral code, minted once
  - A coupon is the durable record; its code is an intention to spend it on
    one basket, minted when an order claims it and spent once
  - A coupon scoped to a catalogue facet mints against the lines that
    basket actually holds
  - Every code is scoped to the member it was minted for
  - Every code carries its own coupon's combine setting, so Shopify's rules
    decide the outcome beside a site discount
- Price preview
  - A live cart price estimates locally; minting waits for the order
- Two channels
  - The same mechanism online and at the POS till

## Requirements
### Requirement: A coupon reaches the order as its own ephemeral Shopify Discount code

A product coupon, a gift, and a loyalty reward's own coupon SHALL each reach
the order as their own single-use Shopify Discount code. Grade10 SHALL NOT
weld a custom discount onto the draft order's lines for any of them.

Every such code SHALL be minted when an order claims the coupon, and SHALL be
scoped to the member's paired Shopify customer. A member with no paired
Shopify customer SHALL be refused rather than issued an unscoped code, since a
code that is not scoped to its member is a bearer string anyone may spend.

#### Scenario: grade10-site-store-discounts-SC-01 - A product coupon settles by its own Shopify Discount code
**Serves:** grade10-site-store-discounts-US-01 - Collector redeems a coupon at checkout

- **GIVEN** a member holding a product coupon whose basket qualifies
- **WHEN** the checkout is submitted
- **THEN** the draft order carries the coupon's own single-use Shopify Discount code, not a welded line discount

#### Scenario: grade10-site-store-discounts-SC-02 - A gift settles by its own Shopify Discount code
**Serves:** grade10-site-store-discounts-US-01 - Collector redeems a coupon at checkout

- **GIVEN** a member holding a gift whose basket clears its threshold
- **WHEN** the checkout is submitted
- **THEN** the draft order carries the gift product at a full cut through the gift's own single-use Shopify Discount code
- **AND** the gift's line carries no discount of its own, so the benefit is taken exactly once

#### Scenario: grade10-site-store-discounts-SC-08 - A reward coupon settles by its own Shopify Discount code
**Serves:** grade10-site-store-discounts-US-01 - Collector redeems a coupon at checkout

- **GIVEN** a member redeeming a reward coupon against an order
- **WHEN** the order claims the reward coupon
- **THEN** the order carries the reward coupon's own single-use, customer-scoped Shopify Discount code
- **AND** the order later settles reporting that code, not a welded line discount

#### Scenario: grade10-site-store-discounts-SC-12 - A member with no paired Shopify customer is refused
**Serves:** grade10-site-store-discounts-US-03 - Collector keeps the coupon when a checkout cannot take it

- **GIVEN** a member whose Shopify customer pairing has not converged
- **WHEN** they apply a coupon to a checkout
- **THEN** the coupon is refused, naming the pairing as the reason
- **AND** no unscoped discount code is minted

### Requirement: A coupon scoped to a catalogue facet mints against the basket it is spent on

A coupon whose target names catalogue facets SHALL have that target resolved
against the basket claiming it, and its code SHALL be minted against the
variants that basket holds. Shopify scopes a code to all items, products or
variants and knows nothing of the platform's facets, so a facet-scoped
coupon has no expressible code target until a basket exists — which is why
no coupon's code is minted before an order claims it.

Where the catalogue cannot supply a line's facets, the coupon SHALL be
refused rather than minted against a target that may be wrong.

#### Scenario: grade10-site-store-discounts-SC-09 - A facet-scoped coupon cuts only the lines its facet reaches
**Serves:** grade10-site-store-discounts-US-01 - Collector redeems a coupon at checkout

- **GIVEN** a coupon scoped to one catalogue facet choice, and a basket holding lines both inside and outside it
- **WHEN** the order claims the coupon
- **THEN** the minted code names only the variants the facet reaches
- **AND** the shop takes the same amount the platform computed for those lines

#### Scenario: grade10-site-store-discounts-SC-10 - An unavailable catalogue refuses the coupon rather than guessing
**Serves:** grade10-site-store-discounts-US-03 - Collector keeps the coupon when a checkout cannot take it

- **GIVEN** a basket holding a line whose facets the catalogue cannot supply
- **WHEN** a facet-scoped coupon is claimed against it
- **THEN** the coupon is refused
- **AND** no discount code is minted

### Requirement: A draft order carries at most one discount code

A draft order SHALL carry at most one discount code — a typed discount code,
an order coupon, a product coupon, a gift, or a loyalty reward's own coupon —
however the coupon reaches the order, whether typed as a code or redeemed
directly as a reward. A checkout eligible for more than one SHALL have the
collector choose exactly one; none SHALL be applied automatically or stacked
with another. The order's one discount-code slot is this capability's own
requirement; a reward coupon is one case of it.

#### Scenario: grade10-site-store-discounts-SC-03 - A checkout eligible for two coupons asks the collector to choose
**Serves:** grade10-site-store-discounts-US-02 - Collector holding more than one eligible coupon picks which one to spend

- **GIVEN** a basket that qualifies for both a product coupon and an order coupon at once
- **WHEN** the collector checks out
- **THEN** they are asked to choose exactly one, and only that one reaches the draft order

#### Scenario: grade10-site-store-discounts-SC-04 - A second discount code is refused, not stacked
**Serves:** grade10-site-store-discounts-US-02 - Collector holding more than one eligible coupon picks which one to spend

- **GIVEN** a draft order already carrying a discount code
- **WHEN** the collector attempts to add a second discount code, order coupon, product coupon, gift, or reward coupon
- **THEN** the second is refused rather than combined with the first

### Requirement: A live cart price previews locally, and mints nothing until an order claims the coupon

A cart's live price, shown as the collector edits the basket, SHALL be
estimated without minting a Shopify Discount. A coupon's code SHALL be minted
only once an order claims it.

A mint the shop refuses SHALL refuse the checkout, naming the coupon, and
SHALL leave no order behind and the coupon still spendable. A code minted
against an order that is then canceled or fails SHALL be deactivated, and the
coupon returned to the member; an order that merely expires SHALL keep its
code, since such an order can still be paid.

#### Scenario: grade10-site-store-discounts-SC-05 - Editing the cart does not mint a coupon's code
**Serves:** grade10-site-store-discounts-US-01 - Collector redeems a coupon at checkout

- **GIVEN** a basket that qualifies for a product coupon
- **WHEN** the collector adds or removes a line and the cart price re-previews
- **THEN** no Shopify Discount code is minted for that coupon

#### Scenario: grade10-site-store-discounts-SC-06 - An order claiming the coupon mints its code
**Serves:** grade10-site-store-discounts-US-01 - Collector redeems a coupon at checkout

- **GIVEN** a basket that qualifies for a product coupon
- **WHEN** the collector submits the checkout
- **THEN** the coupon's Shopify Discount code is minted and carried on the draft order

#### Scenario: grade10-site-store-discounts-SC-11 - A refused mint refuses the checkout and keeps the coupon
**Serves:** grade10-site-store-discounts-US-03 - Collector keeps the coupon when a checkout cannot take it

- **GIVEN** a basket that qualifies for a coupon
- **WHEN** the shop refuses the mint
- **THEN** the checkout is refused naming that coupon
- **AND** no order is left behind, and the coupon is still spendable

#### Scenario: grade10-site-store-discounts-SC-13 - A dead order's unspent code is deactivated
**Serves:** grade10-site-store-discounts-US-03 - Collector keeps the coupon when a checkout cannot take it

- **GIVEN** an order carrying a minted, unspent discount code
- **WHEN** that order is canceled or fails
- **THEN** the code is deactivated and the coupon returns to the member

### Requirement: A site discount the shop applies in place of the code keeps the sale and returns the coupon

Where the shop's own combine rules apply a site discount in place of the
order's discount code, the checkout SHALL complete at the price the shop
returned. The coupon whose code was set aside SHALL return to the member's
wallet unused, its code deactivated, and the member SHALL be told that the
sale gave more than the coupon and that the coupon is kept. Only a code the
shop refuses outright SHALL refuse the checkout.

#### Scenario: grade10-site-store-discounts-SC-15 - A site discount that beats the coupon keeps the sale
**Serves:** grade10-site-store-discounts-US-03 - Collector keeps the coupon when a checkout cannot take it

- **GIVEN** a basket carrying a coupon and a site discount the shop's rules do not combine with it
- **WHEN** the shop applies the site discount in place of the coupon's code
- **THEN** the order completes at the shop's price
- **AND** the coupon returns to the member's wallet unused, and the member is told the sale gave more

### Requirement: A code carries its own coupon's combine setting

Every minted code SHALL carry the combine setting its coupon's definition
states — whether it combines with the shop's product discounts, order
discounts and shipping discounts — from a reward's definition or an
operator's mint of a store coupon. A definition stating none SHALL carry the
store's default. Grade10 SHALL NOT evaluate the combination itself: the
shop's own rules decide it from that setting and the site discount's own.

#### Scenario: grade10-site-store-discounts-SC-16 - A coupon's combine setting is what its code carries
**Serves:** grade10-site-store-discounts-US-03 - Collector keeps the coupon when a checkout cannot take it

- **GIVEN** a coupon whose definition allows combining with the shop's product discounts and not its order discounts
- **WHEN** an order claims the coupon and its code is minted
- **THEN** the code carries that setting, and the shop prices the basket by its own rules from it

### Requirement: The same discount-code mechanism applies online and at the POS till

A product coupon taken at the POS till SHALL reach the till's own sale by the
same single-use Shopify Discount code mechanism as the online checkout. A
re-plan of the same sale SHALL reuse the code already minted for it; where the
coupon's cut has changed, that coupon SHALL be refused on that re-plan rather
than a second code minted, since the till cannot remove one code from a sale.
Where the coupon's code has already left the sale, the refusal SHALL name a
new sale rather than repeat the remedy that took the code off.

#### Scenario: grade10-site-store-discounts-SC-07 - A product coupon at the till settles by its own code
**Serves:** grade10-site-store-discounts-US-04 - Shop staff spends a member's product coupon at the till

- **GIVEN** a member's product coupon taken at the POS till
- **WHEN** the till sale is tendered
- **THEN** the sale settles by the coupon's own Shopify Discount code, the same as online

#### Scenario: grade10-site-store-discounts-SC-14 - A re-planned sale never carries two codes for one coupon
**Serves:** grade10-site-store-discounts-US-04 - Shop staff spends a member's product coupon at the till

- **GIVEN** a till sale carrying a coupon's minted discount code
- **WHEN** staff re-plan the sale with the same coupon still on it
- **THEN** the sale carries exactly one code for that coupon

#### Scenario: grade10-site-store-discounts-SC-17 - A coupon cleared off a sale cannot go back on it
**Serves:** Two channels - a coupon cleared off a sale cannot go back on it

- **GIVEN** a till sale whose coupon was cleared by "Remove every discount"
- **WHEN** staff apply that coupon to the same sale again
- **THEN** they are told the coupon has come off this sale and to ring it up on
  a new one, and the coupon stands live in the member's wallet

#### Scenario: grade10-site-store-discounts-SC-18 - A code the sale never honoured stops standing
**Serves:** Two channels - a code the sale never honoured stops standing

- **GIVEN** a paid sale carrying a minted code the landed order does not name
- **WHEN** the sale settles
- **THEN** that code stops standing and is taken off the shop, and nothing
  reports it to the member as money they saved

