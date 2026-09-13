# grade10-site/store/site-discounts Specification

## Purpose
Site discounts are storewide merchandising cuts — a product on sale, a
buy-X-get-Y offer, or a spend threshold off the whole order — configured
directly in Shopify's own automatic discounts and reaching every sale this
store makes, online and at the till, with no discount engine of grade10's
own.
## Feature set

- Accepting Shopify's automatic discounts
  - Every draft order this store creates opts into Shopify's own automatic
    discounts, so a merchandiser's automatic discount reaches a real sale
  - At the till the automatics are the POS cart's own, and grade10 leaves
    them alone rather than turning them off
- Authoring
  - A product special sale, a buy-X-get-Y offer, and an order threshold cut
    are authored in Shopify Admin, not a grade10 admin screen
  - Shopify's own combine rules decide what a site discount does beside a
    discount code; grade10 carries each coupon's own setting onto its code
    and accepts what the shop priced

## Requirements
### Requirement: A draft order accepts Shopify's own automatic discounts, and the till leaves the shop's alone

Every draft order this store creates SHALL accept Shopify's automatic
discounts during pricing and at creation, so an automatic discount
configured in Shopify Admin reaches the sale it names.

At the POS till this store creates no draft order — Shopify POS rings the
sale on its own cart, where the shop's automatic discounts already apply —
so grade10 SHALL NOT disable them there. Clearing a sale's discounts SHALL
remove what grade10 put on it and leave the shop's own automatics standing.

#### Scenario: grade10-site-store-site-discounts-SC-01 - An automatic discount reaches the online checkout

- **GIVEN** an active automatic discount configured in Shopify Admin for a product in the basket
- **WHEN** the checkout's draft order is priced and created
- **THEN** the automatic discount's cut is on the order Shopify returns

#### Scenario: grade10-site-store-site-discounts-SC-02 - A till sale keeps the shop's own automatic discount

- **GIVEN** an active automatic discount configured in Shopify Admin for a product
- **WHEN** that product is sold at the POS till and staff clear the sale's discounts
- **THEN** the automatic discount is still on the sale
- **AND** clearing confirms rather than reporting that it could not finish

### Requirement: Shopify's rules decide how a site discount meets a discount code, and grade10 accepts what the shop priced

Whether a site discount stacks with the order's one discount code or
applies in its place — and whether one site discount excludes another on
the same product — SHALL be Shopify's own combine rules, evaluated from the
site discount's setting authored in Shopify Admin and the setting the code
carries. Grade10 SHALL NOT reimplement that evaluation, hold a discount type
of its own, or alter what the provider priced.

The setting a code carries is its own coupon's, per
`grade10-site/store/discounts`. Where the shop applies the site discount in
place of the code, the sale SHALL complete at the shop's price and the
coupon SHALL return to the member, under that capability's own rule; grade10
SHALL NOT fail the sale for a code the shop set aside.

#### Scenario: grade10-site-store-site-discounts-SC-03 - Grade10 presents what the provider priced

- **GIVEN** a basket carrying both an active automatic discount and a discount code
- **WHEN** the draft order is priced
- **THEN** the order's discount total is exactly what the provider priced, whether the two stacked or the shop kept one
- **AND** grade10 alters no amount and fails no sale for a code the shop set aside

