## Feature set

- Surface exports
  - Named components: browse, filters, header, list, card, and image from the package entry
  - Reusable parts: each part renders without `ProductBrowse`
- Tile contract
  - Supplied facts: price, sold-out, cart action, and image are displayed as given
  - Supplied address: a tile that opens is a link to the address it is given
- Selling is opt-in
  - Supplied handler: the cart control is drawn where the consumer can act on a quantity, and nowhere else
  - No standing default: a control is never drawn over nothing, so a press cannot be swallowed
- Browse states
  - Loading, empty, failed: the application drives display through props
- Filters and sort
  - Reported changes: search, filters, and sort are displayed and reported, never decided by the blocks
- Responsive layout
  - Column count: the list answers the width it is given, and the consumer sets none of it
- Load more
  - Reported reach: arriving at the end is reported like any other change, never acted on by the blocks
  - Loading more: the wait for the next products is shown without disturbing the ones already read
- Accessibility
  - Keyboard and announcements: controls are operable without a pointer; busy and count changes are announced
- No defaulted content
  - Application-owned copy: nothing visible is invented by the listing
- Stock is a ceiling
  - Supplied maximum: the cart control stops where the consumer says the shop's count stops
  - No maximum, no ceiling: a consumer that supplies none keeps a control that counts on
- What is left, said
  - Supplied remaining count: the card displays how many are left, in the consumer's own words
  - Consumer decides when: the card shows what it is given and judges nothing about scarcity

## ADDED Requirements

### Requirement: A tile drawn without a cart control needs no cart words

A tile's cart words SHALL be accepted absent where no cart control is drawn,
so a surface that does not sell names no cart word.

<!-- trace:scenario id=g10.shared-store-product-listing.SC-rzq rev=1 -->
#### Scenario: shared-ui-store-product-listing-SC-92 - A tile drawn without a cart control needs no cart words
**Serves:** Selling is opt-in - a surface that does not sell names no cart word

- **WHEN** a tile renders with no cart quantity handler and copy carrying no cart words
- **THEN** the tile renders its image, name and prices
- **AND** no cart word is required of the consumer

### Requirement: A tile given its product's address is a link to it

A tile that opens SHALL be a link to its product's address where the consumer
supplies one, its photo and its name alike, so its address can be copied and a
press with a modifier key opens it where the browser puts it, a new tab or a
new window, reporting nothing. A plain press SHALL still report the tile's
activation where a handler is supplied, in place of the link's own
navigation. A tile that does not open SHALL be no link, address or not.

<!-- trace:scenario id=g10.shared-store-product-listing.SC-iye rev=1 -->
#### Scenario: shared-ui-store-product-listing-SC-93 - A tile given its address is a link to it
**Serves:** Tile contract - a tile opens its product the way any link opens

- **GIVEN** a tile that opens, supplied with its product's address and a handler for its activation
- **WHEN** it renders
- **THEN** its photo and its name are links to that address
- **AND** a plain press reports the activation once and does not follow the link
- **AND** a press with a modifier key reports nothing and is left to the browser
