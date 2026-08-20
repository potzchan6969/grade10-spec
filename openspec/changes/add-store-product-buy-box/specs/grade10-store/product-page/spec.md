## ADDED Requirements

### Requirement: A card is added to the cart from its own page

A card's page SHALL let a collector add a variant it lists to the storefront's
cart, without leaving the page and without returning to the grid.

The page SHALL open with the variant it prices already chosen, so a card
listing one thing to buy needs no choice made. A collector SHALL be able to
choose any other variant the page lists, and what is added SHALL be the one
chosen — never whichever the catalogue listed first.

After a card is added the collector SHALL still be on that card, and what the
site says the cart holds SHALL account for what was added.

#### Scenario: A collector adds the grade they chose

- **GIVEN** a card whose page lists more than one variant for sale
- **WHEN** a collector chooses one that is not the one the page opened with,
  and adds it
- **THEN** the cart holds that variant, and not the one the page opened with

#### Scenario: A card with one thing to buy needs no choice

- **GIVEN** a card whose page lists one variant for sale
- **WHEN** a collector adds it without choosing anything
- **THEN** the cart holds that variant

#### Scenario: The collector keeps their place

- **WHEN** a collector adds a card from its page
- **THEN** they are still on that card's address, reading that card
- **AND** what the site says the cart holds has changed to account for it

#### Scenario: The same card twice

- **GIVEN** a collector who has already added a variant from a card's page
- **WHEN** they add the same variant again
- **THEN** the cart holds the quantity they added, as one line rather than two

### Requirement: A card nobody can buy says so where the buying happens

A card the catalogue lists with nothing for sale SHALL say so on its page, in
the place a collector would otherwise buy from. It SHALL NOT show a control
that cannot be used, and it SHALL NOT hide the price it lists — a sold-out
card still costs what it costs, and a page with nothing where the buying goes
reads as a page that failed rather than a card that sold.

A card listing some variants for sale and others not SHALL offer the ones for
sale and refuse the ones not, each said per variant. A variant that cannot be
bought SHALL NOT become what is added by being chosen.

#### Scenario: Nothing on the card is for sale

- **GIVEN** a card the catalogue lists with no variant for sale
- **WHEN** a collector opens its page
- **THEN** the page says the card cannot be bought
- **AND** every variant it lists is still priced
- **AND** there is nothing to press that would add it

#### Scenario: One grade sold, another still for sale

- **GIVEN** a card listing one variant for sale and one sold out
- **WHEN** a collector opens its page
- **THEN** each variant reads as for sale or sold out on its own
- **AND** adding is offered for the one for sale
- **AND** choosing the sold-out one offers no add
