# grade10-site/store/product-page Specification

## Feature set

- Free pick-up
  - Store name opens Store Locator: the store name in the free pick-up claim
    is a link to Store Locator
  - No dead label: a fulfilment label the site has no page for is not a link

## ADDED Requirements

### Requirement: Free pick-up opens Store Locator

The store name in the free pick-up claim is the way into Store Locator.

**Store name as control** - When the product page shows free pick-up at Hong
Kong Grade10 Store, that claim SHALL open the Store Locator surface. The store
name in the claim SHALL be the control that reaches Store Locator, in the same
tab and in the product page's language.

**No dead label** - A fulfilment label the site has no page for SHALL NOT be a
link.

<!-- trace:scenario id=g10.store-product-page.SC-21b rev=1 -->
#### Scenario: grade10-site-store-product-page-SC-25 - Free pick-up reaches Store Locator
**Serves:** grade10-site-store-product-page-US-10 - Collector opens Store Locator from free pick-up

- **GIVEN** a product page showing free pick-up at Hong Kong Grade10 Store
- **WHEN** a collector activates that store name
- **THEN** Store Locator renders in the same tab
- **AND** in the product page's language

<!-- trace:scenario id=g10.store-product-page.SC-res rev=1 -->
#### Scenario: grade10-site-store-product-page-SC-38 - A label with no page is not a link
**Serves:** grade10-site-store-product-page-US-10 - the collector reading the shipping and pickup lines finds one link, the shop's

- **GIVEN** a product page showing its shipping and pickup lines
- **WHEN** a collector reads them
- **THEN** Shipping fee is not a link
- **AND** the store name in free pick-up is the only link among them
