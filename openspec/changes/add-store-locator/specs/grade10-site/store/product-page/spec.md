## ADDED Requirements

### Requirement: Free pick-up opens Store Locator

The store name in the free pick-up claim is the way into Store Locator.

**Store name as control** - When the product page shows free pick-up at Hong
Kong Grade10 Store, that claim SHALL open the Store Locator surface. The store
name in the claim SHALL be the control that reaches Store Locator.

**Replaces the underline** - This replaces the non-interactive fulfilment
underline for that store name in `redesign-store-product-detail-page` once
both changes fold.

#### Scenario: grade10-site-store-product-page-SC-25 - Free pick-up reaches Store Locator
**Serves:** grade10-site-store-product-page-US-10 - Collector opens Store Locator from free pick-up

- **GIVEN** a product page showing free pick-up at Hong Kong Grade10 Store
- **WHEN** a collector activates that store name
- **THEN** Store Locator renders
