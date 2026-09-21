## ADDED Requirements

### Requirement: A sold-out tile still opens where its activation is handled

A tile supplied as sold out SHALL still report its activation where the
consumer handles it, so a surface that carries the shopper on rather than
selling can open a card nobody can buy; its cart action SHALL NOT be
activatable, and its sold-out treatment SHALL stay.

#### Scenario: shared-ui-store-product-listing-SC-91 - A sold-out product still opens where activation is handled
**Serves:** Tile contract - a surface that carries the shopper on opens a card nobody can buy

- **GIVEN** a product supplied as sold out, with a handler for tile activation and none for the cart
- **WHEN** the shopper activates the tile
- **THEN** the activation is reported once, identifying that product
- **AND** the tile keeps the sold-out treatment and offers no cart control

### Requirement: A tile drawn without a cart control needs no cart words

A tile's cart words SHALL be accepted absent where no cart control is drawn,
so a surface that does not sell names no cart word.

#### Scenario: shared-ui-store-product-listing-SC-92 - A tile drawn without a cart control needs no cart words
**Serves:** Selling is opt-in - a surface that does not sell names no cart word

- **WHEN** a tile renders with no cart quantity handler and copy carrying no cart words
- **THEN** the tile renders its image, name and prices
- **AND** no cart word is required of the consumer
