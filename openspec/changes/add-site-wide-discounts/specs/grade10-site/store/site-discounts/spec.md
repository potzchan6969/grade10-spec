## Purpose

Site discounts are storewide merchandising cuts — a product on sale, a
buy-X-get-Y offer, or a spend threshold off the whole order — configured
directly in Shopify's own automatic discounts and read onto every draft
order this store creates, online and at the till, with no discount engine
of grade10's own.

## Feature set

- Accepting Shopify's automatic discounts
  - Every draft order this store creates opts into Shopify's own automatic
    discounts, so a merchandiser's automatic discount reaches a real sale
  - Two channels: the same acceptance on the online checkout and at the
    POS till
- Authoring
  - A product special sale, a buy-X-get-Y offer, and an order threshold cut
    are authored in Shopify Admin, not a grade10 admin screen
  - Combining with the order's one discount code, and any exclusivity
    between two site discounts, is Shopify's own combine-rule configuration
    on each discount — grade10 states none of it

## ADDED Requirements

### Requirement: A draft order accepts Shopify's own automatic discounts

Every draft order this store creates, on the online checkout and at the
POS till, SHALL accept Shopify's automatic discounts during pricing and at
creation, so an automatic discount configured in Shopify Admin reaches the
sale it names.

#### Scenario: grade10-site-store-site-discounts-SC-01 - An automatic discount reaches the online checkout

- **GIVEN** an active automatic discount configured in Shopify Admin for a product in the basket
- **WHEN** the checkout's draft order is priced and created
- **THEN** the automatic discount's cut is on the order Shopify returns

#### Scenario: grade10-site-store-site-discounts-SC-02 - A POS sale gets the same automatic discounts as the same basket online

- **GIVEN** an active automatic discount configured in Shopify Admin for a product
- **WHEN** that product is sold at the POS till
- **THEN** the automatic discount applies exactly as it would on the online checkout

### Requirement: Grade10 states no exclusivity or combine rule between a site discount and the order's one discount code

Whether a site discount refuses, stacks with, or replaces the order's one
discount code — and whether one site discount excludes another on the same
product — SHALL be Shopify's own combine-rule configuration on each
discount, authored in Shopify Admin. Grade10 SHALL NOT hold a second copy
of that rule, or a discount type of its own that reimplements it.

#### Scenario: grade10-site-store-site-discounts-SC-03 - Grade10 presents whichever outcome Shopify returns

- **GIVEN** a basket carrying both an active automatic discount and a discount code
- **WHEN** the draft order is priced
- **THEN** the order carries the cut, the combination of cuts, or the refusal that Shopify's own combine-rule configuration produced, and grade10 applies no rule of its own on top
