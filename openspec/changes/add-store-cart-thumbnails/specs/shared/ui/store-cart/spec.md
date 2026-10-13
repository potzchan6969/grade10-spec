## Feature set

- Product pictures
  - Supplied picture: shows the consumer's picture using existing optional props
  - Missing alt text: retains the item-name fallback
  - Missing picture: retains the existing placeholder without fetching product data

## ADDED Requirements

### Requirement: Existing cart item picture props render supplied content

`CartItemSummary` SHALL retain optional `imageSrc?: string` and
`imageAlt?: string`. `CartItem`, `CartDrawerBody` and `CartDrawer` SHALL render
the supplied source in the existing thumbnail frame. Non-empty supplied alt
text SHALL remain unchanged; omitted or empty alt text SHALL use the item name.
An omitted or empty source SHALL render the existing placeholder. The shared
components SHALL acquire no product data, cache or persist no picture facts,
and retain their existing layout, status treatment and callbacks.

<!-- trace:scenario id=g10.shared-store-cart.SC-3aw rev=1 -->
#### Scenario: shared-ui-store-cart-SC-64 - A supplied cart picture loads in the existing frame
**Serves:** shared-ui-store-cart-US-02 - recognising the products in the cart

- **GIVEN** a cart item with a controlled image source and non-empty alt text, including whitespace-only text
- **WHEN** it renders alone, in the body or in the drawer
- **THEN** the image uses that source and alt text in the existing thumbnail frame
- **AND** its image bytes load with positive natural width
- **AND** a sold-out item retains the existing sold-out treatment and callbacks

<!-- trace:scenario id=g10.shared-store-cart.SC-p71 rev=1 -->
#### Scenario: shared-ui-store-cart-SC-65 - Missing alt text uses the item name
**Serves:** shared-ui-store-cart-US-02 - recognising a pictured item whose consumer supplies no alt text

- **WHEN** a pictured item renders with omitted or empty alt text
- **THEN** its image alt attribute is the supplied item name
- **AND** no new copy or layout is introduced

<!-- trace:scenario id=g10.shared-store-cart.SC-du1 rev=1 -->
#### Scenario: shared-ui-store-cart-SC-66 - Missing picture props retain the existing placeholder
**Serves:** shared-ui-store-cart-US-02 - reviewing an item without a supplied picture

- **WHEN** a cart item renders with omitted or empty image source
- **THEN** it renders the existing thumbnail placeholder
- **AND** all other supplied display facts and action callbacks remain unchanged
- **AND** the component makes no product request and stores no picture metadata
