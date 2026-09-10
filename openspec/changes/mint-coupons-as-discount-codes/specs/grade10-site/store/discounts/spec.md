## Purpose

A discount reaches a draft order one of a few ways — a typed discount code, a
store-minted coupon, a loyalty reward, points, a site discount. This
capability holds how those transports work: what rides as a Shopify Discount
code, how many a draft order can carry at once, and when one is minted.

## Feature set

- One discount-code slot
  - A typed discount code, an order coupon, a product coupon, and a gift all
    ride as one Shopify Discount code on the draft order
  - At most one applies per order; a checkout eligible for more than one has
    the collector pick
- Reward coupon transport
  - A product coupon and a gift mint their own ephemeral Shopify Discount
    once the basket qualifies, single-use, spent once
- Price preview
  - A live cart price estimates locally; minting waits for the checkout to
    be submitted
- Two channels
  - The same mechanism online and at the POS till

## ADDED Requirements

### Requirement: A product coupon and a gift ride onto the draft order as their own ephemeral Shopify Discount

A product coupon and a gift, once redeemed against a basket that qualifies
for them, SHALL reach the draft order as their own single-use Shopify
Discount code, minted once the basket qualifies — the same mechanism an
order coupon already uses. Grade10 SHALL NOT weld a custom discount onto the
draft order's lines for either.

#### Scenario: grade10-site-store-discounts-SC-01 - A product coupon settles by its own Shopify Discount code

- **GIVEN** a member holding a product coupon whose basket qualifies
- **WHEN** the checkout is submitted
- **THEN** the draft order carries the coupon's own single-use Shopify Discount code, not a welded line discount

#### Scenario: grade10-site-store-discounts-SC-02 - A gift settles by its own Shopify Discount code

- **GIVEN** a member holding a gift whose basket clears its threshold
- **WHEN** the checkout is submitted
- **THEN** the draft order carries the gift product at a 100% cut through the gift's own single-use Shopify Discount code

### Requirement: A draft order carries at most one discount code

A draft order SHALL carry at most one discount code — a typed discount
code, an order coupon, a product coupon, or a gift — however the coupon
reaches the order, whether typed as a code or redeemed directly as a
reward. A checkout eligible for more than one SHALL have the collector
choose exactly one; none SHALL be applied automatically or stacked with
another. This is the durable requirement for `grade10-site/loyalty/programme`'s "a
coupon is the order's one discount" too — one requirement, enforced here,
not restated in that capability's own delta.

#### Scenario: grade10-site-store-discounts-SC-03 - A checkout eligible for two coupons asks the collector to choose

- **GIVEN** a basket that qualifies for both a product coupon and an order coupon at once
- **WHEN** the collector checks out
- **THEN** they are asked to choose exactly one, and only that one reaches the draft order

#### Scenario: grade10-site-store-discounts-SC-04 - A second discount code is refused, not stacked

- **GIVEN** a draft order already carrying a discount code
- **WHEN** the collector attempts to add a second discount code, order coupon, product coupon, or gift
- **THEN** the second is refused rather than combined with the first

### Requirement: A live cart price previews locally, and mints nothing until checkout

A cart's live price, shown as the collector edits the basket, SHALL be
estimated without minting a Shopify Discount. A product coupon's or a
gift's Shopify Discount code SHALL be minted only once the checkout that
will spend it is submitted.

#### Scenario: grade10-site-store-discounts-SC-05 - Editing the cart does not mint a coupon's code

- **GIVEN** a basket that qualifies for a product coupon
- **WHEN** the collector adds or removes a line and the cart price re-previews
- **THEN** no Shopify Discount code is minted for that coupon

#### Scenario: grade10-site-store-discounts-SC-06 - Submitting the checkout mints the coupon's code

- **GIVEN** a basket that qualifies for a product coupon
- **WHEN** the collector submits the checkout
- **THEN** the coupon's Shopify Discount code is minted and carried on the draft order

### Requirement: The same discount-code mechanism applies online and at the POS till

A product coupon or a gift taken at the POS till SHALL reach the till's own
sale by the same single-use Shopify Discount code mechanism as the online
checkout.

#### Scenario: grade10-site-store-discounts-SC-07 - A product coupon at the till settles by its own code

- **GIVEN** a member's product coupon taken at the POS till
- **WHEN** the till sale is tendered
- **THEN** the sale settles by the coupon's own Shopify Discount code, the same as online
