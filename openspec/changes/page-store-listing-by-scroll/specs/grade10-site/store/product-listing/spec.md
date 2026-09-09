## Feature set

- One list that lengthens
  - Cards on approach: reaching the end of what is shown adds the next cards below it, so the catalogue is read by scrolling
  - No page control: nothing offers a page number, a next control or a load-more button, so there is one way through the set
  - Walk per narrowing: a new narrowing lists its own first page, so cards from one set never sit under another's
  - Depth is not the address: a shared address opens the narrowing and never the reader's place in it
  - A page that fails: the cards already read stay read, and reaching the end again asks for that page once more
- A count of the whole set
  - The narrowing's size: the count says how many cards the narrowed catalogue holds, so a collector knows whether to go on
  - Still while scrolling: the count moves when the narrowing moves and at no other time

## ADDED Requirements

### Requirement: The browse listing lengthens as the collector scrolls

The listing SHALL list the first page of the set the query names, and SHALL
read the next page as the collector reaches the end of what is shown, adding
those cards below the ones already there. Cards already listed SHALL stay
listed, in the order they arrived, and reading further SHALL NOT move the
collector's place in the list.

The listing SHALL offer no page number, no next or previous control and no
load-more control: scrolling is the only way through the set, so a collector
never has to choose between two ways of asking for the same cards.

Where the set has no further page, nothing further SHALL be read and nothing
SHALL be said in place of it — reaching the end of a catalogue is not news.

A walk belongs to the narrowing it walks. Applying a facet, free text, an
order or a collection SHALL start again from that narrowing's first page, and
no card of the previous narrowing SHALL remain listed.

How far a collector has walked SHALL NOT be reflected in the address: an
address carries the narrowing so it can be linked and shared, and opening one
afresh SHALL list that narrowing's first page. Going back SHALL undo a
narrowing rather than a page.

A page the catalogue does not answer SHALL leave every card already listed
standing, and the listing SHALL neither empty nor refuse. Reaching the end of
what is shown again SHALL ask the catalogue for that page again.

#### Scenario: grade10-site-store-product-listing-SC-22 - The next cards arrive at the end

- **GIVEN** a collector on a listing whose set holds more cards than one page
  lists
- **WHEN** they reach the end of the cards shown
- **THEN** the next cards are listed below the ones already shown
- **AND** the cards already shown stay listed, in the order they arrived
- **AND** no page number, next control or load-more control is offered

#### Scenario: grade10-site-store-product-listing-SC-23 - The end of the set

- **GIVEN** a collector who has read every card the narrowed set holds
- **WHEN** they reach the end of the cards shown
- **THEN** nothing further is read
- **AND** nothing is said in place of the cards that would have followed

#### Scenario: grade10-site-store-product-listing-SC-24 - A narrowing starts the walk again

- **GIVEN** a collector who has read three pages of the listing
- **WHEN** they select a facet choice, enter free text, or choose an order
- **THEN** the listing lists the first page of the new narrowing
- **AND** no card read before that narrowing is listed

#### Scenario: grade10-site-store-product-listing-SC-25 - Depth is not carried in the address

- **GIVEN** a collector who has read three pages of a narrowing
- **WHEN** the address they are on is opened afresh
- **THEN** the first page of that narrowing is listed
- **WHEN** the collector goes back instead
- **THEN** the listing returns to the previous narrowing rather than to the
  previous page of this one

#### Scenario: grade10-site-store-product-listing-SC-26 - A page the catalogue does not answer

- **GIVEN** a collector who has read two pages, and a catalogue that fails the
  third
- **WHEN** that failure answers
- **THEN** every card already listed is still listed
- **AND** the listing neither empties nor answers as a failure
- **WHEN** the collector reaches the end of the cards shown again
- **THEN** that page is asked for again

### Requirement: The listing says how large the narrowing is

The listing SHALL say how many cards the whole narrowed set holds, counted by
the catalogue over that set, never the number of cards read so far. The count
SHALL change when the narrowing changes and at no other time, so reading
further leaves it where it was.

This is the same rule the facet counts are held to: a count on this surface is
the catalogue's own over the whole set the query narrows to, and is never
counted from the cards on the page.

#### Scenario: grade10-site-store-product-listing-SC-27 - The count is the set, not what was read

- **GIVEN** a narrowed set the catalogue holds one hundred cards for, listed
  ten at a time
- **WHEN** the listing first renders
- **THEN** it says one hundred cards
- **WHEN** the collector reads two further pages
- **THEN** it still says one hundred cards

#### Scenario: grade10-site-store-product-listing-SC-28 - The count follows the narrowing

- **GIVEN** a catalogue of one hundred cards, twelve of them in one world
- **WHEN** a collector narrows the listing to that world
- **THEN** the listing says twelve cards, before any further page is read
