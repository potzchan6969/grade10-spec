# Discounts — delta

## Feature set

- Codes and their lifetime
  - A claim elsewhere: a code minted for a coupon is deactivated when the
    member claims that coupon on another sale, whatever the order carrying it
    is doing; an order that merely expires keeps its code until then
  - A sale that collects a deactivated code is settled from what the shop
    says it carried, and reported

## MODIFIED Requirements

### Requirement: A live cart price previews locally, and mints nothing until an order claims the coupon

A cart's live price, shown as the collector edits the basket, SHALL be
estimated without minting a Shopify Discount. A coupon's code SHALL be minted
only once an order claims it.

A mint the shop refuses SHALL refuse the checkout, naming the coupon, and
SHALL leave no order behind and the coupon still spendable. A code minted
against an order that is then canceled or fails SHALL be deactivated, and the
coupon returned to the member; an order that merely expires SHALL keep its
code, since such an order can still be paid — until the member claims that
coupon on another sale, which SHALL deactivate the code and take the cut off
the order, whatever state it is in.

A code SHALL NOT go back on an order it has left. The remedy SHALL name a new
sale.

#### Scenario: grade10-site-store-discounts-SC-05 - Editing the cart does not mint a coupon's code

- **GIVEN** a basket that qualifies for a product coupon
- **WHEN** the collector adds or removes a line and the cart price re-previews
- **THEN** no Shopify Discount code is minted for that coupon

#### Scenario: grade10-site-store-discounts-SC-06 - An order claiming the coupon mints its code

- **GIVEN** a basket that qualifies for a product coupon
- **WHEN** the collector submits the checkout
- **THEN** the coupon's Shopify Discount code is minted and carried on the draft order

#### Scenario: grade10-site-store-discounts-SC-11 - A refused mint refuses the checkout and keeps the coupon

- **GIVEN** a basket that qualifies for a coupon
- **WHEN** the shop refuses the mint
- **THEN** the checkout is refused naming that coupon
- **AND** no order is left behind, and the coupon is still spendable

#### Scenario: grade10-site-store-discounts-SC-13 - A dead order's unspent code is deactivated

- **GIVEN** an order carrying a minted, unspent discount code
- **WHEN** that order is canceled or fails
- **THEN** the code is deactivated and the coupon returns to the member

#### Scenario: grade10-site-store-discounts-SC-19 - An expired sale's code dies when the coupon is claimed elsewhere

- **GIVEN** an expired counter sale carrying a live code for the member's coupon
- **WHEN** the member claims that coupon on another sale
- **THEN** the code is deactivated and the cut comes off the expired sale
- **AND** the sale is not cancelled and can still collect at full price

#### Scenario: grade10-site-store-discounts-SC-20 - A code does not go back on the sale it left

- **GIVEN** a sale whose coupon's code was deactivated when the member claimed it elsewhere
- **WHEN** that coupon is offered to the same sale again
- **THEN** it is refused, naming a new sale as the remedy

#### Scenario: grade10-site-store-discounts-SC-21 - A sale that collects a deactivated code is reported

- **GIVEN** a sale that collected a code this store had deactivated
- **WHEN** it settles
- **THEN** the coupon is spent by whichever sale settled first, and never twice
- **AND** the sale that collected it is reported with the order on it
