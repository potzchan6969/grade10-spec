## ADDED Requirements

### Requirement: Free text offers suggestions and commits as a narrowing

The listing search field SHALL offer suggestions while the collector types,
before free text is committed as a narrowing. Suggestions SHALL cover the
whole catalogue for product hits, even when facet choices are already in
force. Suggestion groups SHALL include matching products and matching facet
choices from the catalogue's world and collectible-type groups. Each group
SHALL be capped at five hits.

Typing alone SHALL NOT put free text in the address and SHALL NOT change
which cards the listing lists. Committing the typed words — by submitting
the field with no suggestion selected — SHALL narrow the whole catalogue by
those words, reflect them in the address, and show them among the applied
narrowings as a dismissible chip. The field SHALL clear once the words are
committed.

Selecting a product suggestion SHALL open that product and SHALL clear the
search field. Selecting a facet suggestion SHALL apply that facet choice as
if the collector had selected it in the panel, SHALL clear the search field,
and SHALL NOT put free text in force. Dismissing the free-text chip SHALL
clear free text from the address and from the applied narrowings.

When no suggestion matches, the field SHALL show that nothing matched and
SHALL still accept a commit of the typed words. While suggestion hits are
still being resolved, the field SHALL show that it is searching until
matches or an empty result are offered. Free text remains catalogue-wide
store search: suggestion hits SHALL NOT include auction lots or other site
surfaces.

#### Scenario: grade10-site-store-product-listing-SC-31 - Typing offers product and filter suggestions
**Serves:** grade10-site-store-product-listing-US-10 - Collector finds a card by typing in search

- **GIVEN** a catalogue holding a product named for words a collector types,
  and a world or collectible type whose name matches those words
- **WHEN** the collector types those words in the listing search field
- **THEN** the field offers that product under a products group and that
  facet choice under a filters group
- **AND** each group shows at most five hits
- **AND** the address and the listed cards are unchanged until they commit
  or select

#### Scenario: grade10-site-store-product-listing-SC-32 - Enter commits free text as a chip
**Serves:** grade10-site-store-product-listing-US-10 - Collector finds a card by typing in search

- **GIVEN** a collector who has typed words in the listing search field with
  no suggestion selected
- **WHEN** they commit those words
- **THEN** the listing lists the catalogue narrowed by those words
- **AND** the address carries the words
- **AND** the words appear among the applied narrowings as a dismissible chip
- **AND** the search field is empty

#### Scenario: grade10-site-store-product-listing-SC-33 - A product suggestion opens the product
**Serves:** grade10-site-store-product-listing-US-10 - Collector finds a card by typing in search

- **GIVEN** suggestions offering a product
- **WHEN** the collector selects that product suggestion
- **THEN** that product's details page opens
- **AND** free text is not put in force on the listing from that selection
- **AND** the search field is empty

#### Scenario: grade10-site-store-product-listing-SC-34 - A filter suggestion applies the facet
**Serves:** grade10-site-store-product-listing-US-10 - Collector finds a card by typing in search

- **GIVEN** suggestions offering a world or collectible-type choice
- **WHEN** the collector selects that filter suggestion
- **THEN** the listing narrows by that facet choice
- **AND** the address names it
- **AND** the choice appears among the applied narrowings
- **AND** free text is not put in force from that selection
- **AND** the search field is empty

#### Scenario: grade10-site-store-product-listing-SC-35 - Dismissing the search chip clears free text
**Serves:** grade10-site-store-product-listing-US-10 - Collector finds a card by typing in search

- **GIVEN** free text in force, shown among the applied narrowings
- **WHEN** the collector dismisses that chip
- **THEN** free text is no longer in force
- **AND** the address no longer carries the words

#### Scenario: grade10-site-store-product-listing-SC-36 - No suggestions still allows commit
**Serves:** grade10-site-store-product-listing-US-10 - Collector finds a card by typing in search

- **GIVEN** typed words that match no product and no facet choice
- **WHEN** the collector commits those words
- **THEN** the listing narrows by those words as free text
- **AND** the address carries the words
- **AND** before commit the field showed that nothing matched

#### Scenario: grade10-site-store-product-listing-SC-37 - Suggestions stay on the store catalogue
**Serves:** grade10-site-store-product-listing-US-10 - Collector finds a card by typing in search

- **WHEN** a collector types in the listing search field
- **THEN** every suggestion offered is a store catalogue product or a store
  listing facet choice
- **AND** no auction lot or other site surface is offered

#### Scenario: grade10-site-store-product-listing-SC-38 - Waiting for suggestions shows searching
**Serves:** grade10-site-store-product-listing-US-10 - Collector finds a card by typing in search

- **GIVEN** a collector who has typed words and whose suggestion hits are
  still being resolved
- **WHEN** the listing has not yet offered matches or an empty result
- **THEN** the search field shows that it is searching
- **AND** the address and the listed cards remain unchanged
