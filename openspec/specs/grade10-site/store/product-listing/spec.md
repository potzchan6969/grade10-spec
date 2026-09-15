# grade10-site/store/product-listing Specification

## Purpose

Where the browse listing answers, how a collector narrows it — by the
catalogue's facets, by free text, by an order — and how an address opens it
inside one collection, so what a collector is looking at can be linked to,
shared and bookmarked rather than clicked into.

The listing is a public surface, so every requirement of
`grade10-site/site/crawlable-pages` binds it. Every narrowing lives in the
address. The catalogue narrows by one collection or by a query, never by both.

## Feature set

- Listing address
  - Own address: the listing answers beneath the store, distinct from the store
  - Own metadata: title, meta description and share metadata belong to the listing
  - Crawlable document: a document is written for it in every language and named in the sitemap
  - Unchanged listing: what the listing shows and does does not change with the move
- Facet narrowing
  - Catalogue's facets: the panel offers the groups the catalogue names, with the count it puts behind every choice
  - Nothing behind a facet: a group no product reaches is not drawn, so no control can only empty the grid
  - Narrowing in the address: the facets in force are linkable, and going back widens the listing again
- Catalogue-wide order and search
  - Whole-set ordering: an order describes the whole narrowed catalogue rather than the cards already loaded
  - Whole-set search: free text narrows the whole catalogue rather than the cards already loaded
  - Answerable orders only: the menu offers the orders the catalogue can answer, and none it cannot
- One list that lengthens
  - Cards on approach: reaching the end of what is shown adds the next cards below it, so the catalogue is read by scrolling
  - No page control: nothing offers a page number, a next control or a load-more button, so there is one way through the set
  - Walk per narrowing: a new narrowing lists its own first page, so cards from one set never sit under another's
  - Depth is not the address: a shared address opens the narrowing and never the reader's place in it
  - A page that fails: the cards already read stay read, and reaching the end again asks for that page once more
- A count of the whole set
  - The narrowing's size: the count says how many cards the narrowed catalogue holds, so a collector knows whether to go on
  - Still while scrolling: the count moves when the narrowing moves and at no other time
  - One set in both places: a choice's count in the panel is the size of the listing choosing it opens
- Collection as a way in
  - Arrival scope: an address naming a collection opens the listing inside it, with no control offering one
  - Visible and leaveable: the collection in force is named on the listing and can be dismissed
  - One narrowing at a time: applying a facet, free text or an order leaves the collection behind
  - Same document: which collection is named does not change which document the address serves
- Held to the shop's count
  - Ceiling from the shop: a card's cart stops at what the shop has, where the shop says
  - Silent where unknown: a shop exposing no count puts no ceiling on the card
- Said when it is news
  - Few left: the card says how many remain once the shop is nearly out
  - All of them asked for: the card says the same when the collector has taken the last one
## Requirements
### Requirement: The browse listing answers at its own address

The browse listing SHALL answer at an address of its own beneath the store,
distinct from the store's own address, and SHALL carry its own title, meta
description and share metadata there. It SHALL be one of the surfaces the
build writes a document for, in every language the site answers, and SHALL
appear in the sitemap as such.

Nothing the listing shows or does SHALL change with the move.

#### Scenario: grade10-site-store-product-listing-SC-01 - The listing answers at its address

- **WHEN** the browse listing's address is fetched and no script executes
- **THEN** the response HTML contains the listing's title, meta description
  and static copy

#### Scenario: grade10-site-store-product-listing-SC-02 - The listing is offered to crawlers

- **WHEN** the sitemap is fetched
- **THEN** it names the browse listing's address in every language the site
  answers, beside the store's own

### Requirement: An address can scope the listing to one collection

The listing SHALL read the collection to scope itself to from the address it
was opened at, and SHALL render narrowed to that collection without the
collector touching a control. An address naming no collection SHALL render the
whole catalogue.

Which collection an address names SHALL NOT change which document the address
serves: the cards themselves already arrive by script, and a collection is a
narrowing of the listing rather than a surface of its own.

An address naming a collection the catalogue has nothing for SHALL render the
whole catalogue rather than an empty listing or a refusal, since a collection
is a way of narrowing what is listed and not a surface of its own.

A collection SHALL NOT be offered as a filter control: it is a way into the
catalogue rather than one of the ways to narrow it. The collection in force
SHALL be named on the listing among the narrowings in force, and dismissing it
SHALL widen the listing to the whole catalogue.

The catalogue narrows by one collection or by a query, never by both. Applying
a facet or free text while a collection is in force SHALL therefore leave that
collection behind, and an address carrying a collection alongside either SHALL
render the query and drop the collection.

An order is not one of the ways the catalogue narrows: it orders whatever set
is in force. Choosing an order while a collection is in force SHALL leave that
collection in force and list its cards in that order, and an address naming a
collection and an order SHALL render that collection in that order.

Leaving a collection SHALL be reflected in the address, so the collector can
link to what they are looking at, and going back SHALL return the listing to
the previous narrowing.

#### Scenario: grade10-site-store-product-listing-SC-03 - An address opens the listing narrowed

- **WHEN** a collector opens the listing at an address naming a collection the
  catalogue carries
- **THEN** the listing renders showing that collection's cards, with that
  collection shown as the narrowing in force

#### Scenario: grade10-site-store-product-listing-SC-04 - No collection named

- **WHEN** a collector opens the listing at an address naming no collection
- **THEN** the whole catalogue is listed

#### Scenario: grade10-site-store-product-listing-SC-05 - A collection the catalogue has nothing for

- **WHEN** a collector opens the listing at an address naming a collection the
  catalogue has nothing for
- **THEN** the whole catalogue is listed and the surface answers as itself,
  not as not-found

#### Scenario: grade10-site-store-product-listing-SC-06 - Narrowing in the page is linkable

- **GIVEN** a collector on the listing scoped to a collection
- **WHEN** they select a facet choice or enter free text
- **THEN** the listing narrows the whole catalogue by what they asked for, and
  the collection is no longer in force
- **AND** the address names that narrowing and no longer names the collection,
  and opening it afresh renders the same narrowing

#### Scenario: grade10-site-store-product-listing-SC-07 - Back undoes a narrowing

- **GIVEN** a collector who narrowed the listing from within the collection
  their address opened it in
- **WHEN** they go back
- **THEN** the listing is scoped to that collection again

#### Scenario: grade10-site-store-product-listing-SC-08 - The collection in force can be dismissed

- **GIVEN** a collector on the listing scoped to a collection
- **WHEN** they dismiss the collection named among the narrowings in force
- **THEN** the whole catalogue is listed, and the address no longer names that
  collection

#### Scenario: grade10-site-store-product-listing-SC-09 - An address carrying both

- **WHEN** a collector opens the listing at an address naming both a collection
  and a facet choice or free text
- **THEN** the listing renders narrowed by the facet choice or free text
- **AND** the collection is not in force

#### Scenario: grade10-site-store-product-listing-SC-40 - An order holds the collection it was chosen in

- **GIVEN** a collector on the listing scoped to a collection
- **WHEN** they choose another order
- **THEN** that collection's cards are listed in that order, and the collection
  is still in force and still named among the narrowings
- **AND** the address names the collection and the order, and opening it afresh
  renders the same

### Requirement: The listing narrows by the catalogue's facets

The listing SHALL offer the collector the facet groups the catalogue names, in
the order the catalogue names them, each group listing the choices the
catalogue carries for it with the count the catalogue puts behind each choice.
A count SHALL be the catalogue's own over the whole set the rest of the query
narrows to, never counted from the cards on the page.

Selecting no choice in a group SHALL leave that group unrestricted. A group
SHALL admit more than one choice at once.

A group the catalogue names no choices for SHALL NOT be drawn. On a listing
nothing narrows, neither SHALL a group the catalogue counts nothing behind any
choice of: a control whose only effect is to empty the grid is worse than no
control. A listing left with no group to draw SHALL draw no facet group and
SHALL say nothing in place of one — a shop that has configured no facets is not
a fault the collector is told about. Searching and ordering are not facets and
SHALL stay offered either way.

Once a narrowing is in force, every group the catalogue names choices for SHALL
be offered however little is counted behind them: nothing behind a choice is
then the query's doing rather than the shop's, and the collector needs the
groups to widen by. A choice the collector has selected SHALL remain selected
and selectable however little is counted behind it, since a selection nobody
can undo is a trap.

What each group is called SHALL be the site's own words in the language the
listing is read in; what each choice is called SHALL be the catalogue's, and
SHALL render as the shop authored it.

The worlds a shop carries grow without bound, so the panel SHALL offer the
first five and an invitation to show the rest, named for the group; taking it
SHALL offer every world the catalogue names. The collectible types are a
taxonomy the platform closes rather than one a shop grows, and SHALL be offered
whole however many the catalogue names.

The facets in force SHALL be reflected in the address, so the collector can
link to what they are looking at, and going back SHALL return the listing to
the previous narrowing.

#### Scenario: grade10-site-store-product-listing-SC-10 - The panel is the catalogue's facets

- **WHEN** a collector opens the listing and the catalogue names facet groups
  with choices behind them
- **THEN** the panel offers one group per facet the catalogue names, in the
  catalogue's order
- **AND** each choice is shown with the count the catalogue puts behind it

#### Scenario: grade10-site-store-product-listing-SC-11 - A facet narrowing is linkable

- **GIVEN** a collector on the unscoped listing
- **WHEN** they select a facet choice
- **THEN** the listing lists the catalogue narrowed to that choice, and the
  address names it
- **AND** opening that address afresh renders the same narrowing
- **WHEN** they go back
- **THEN** the listing is unnarrowed again

#### Scenario: grade10-site-store-product-listing-SC-12 - A shop with no facets configured

- **WHEN** a collector opens the listing and the catalogue names no facet
  group, or counts nothing behind every choice of every group it names
- **THEN** the catalogue is listed, and no facet group is drawn
- **AND** nothing is said in place of the groups
- **AND** the search field and the sort menu are still offered

#### Scenario: grade10-site-store-product-listing-SC-16 - A long facet group is capped

- **GIVEN** a catalogue naming more than five worlds, and more than five
  collectible types
- **WHEN** a collector opens the listing
- **THEN** five worlds are offered, with an invitation to show the rest named
  for the group
- **AND** every collectible type the catalogue names is offered
- **WHEN** the collector takes that invitation
- **THEN** every world the catalogue names is offered

#### Scenario: grade10-site-store-product-listing-SC-17 - A narrowing that starves the catalogue

- **GIVEN** a collector on the listing who has selected a choice the catalogue
  now counts nothing behind, leaving every choice of the other group counted
  at nothing too
- **WHEN** the listing renders
- **THEN** both groups are still offered, with their counts as the catalogue
  answers them
- **AND** the selected choice is still shown selected, and can be unselected
- **WHEN** the collector unselects it
- **THEN** the listing widens again

### Requirement: Order and free text describe the whole catalogue

The listing SHALL narrow by free text and order its cards over the whole set
the query describes, never over the cards already loaded. A collector who asks
for the lowest price SHALL be shown the lowest-priced card in the narrowed
catalogue first, whether or not it had been loaded when they asked.

The listing SHALL offer only orders the catalogue can answer: latest product,
lowest price, and highest price. It SHALL NOT offer a popularity order.

At rest the listing SHALL open with latest product in force. The sort trigger
SHALL read as `Sort by` followed by the active option's label. Choosing another
option SHALL put that order in force and update the trigger the same way. No
other resting order SHALL stand in for latest.

An order SHALL apply to the set in force rather than to the catalogue alone: a
collection SHALL open on latest product too, and SHALL be listed in whatever
order the collector chooses while it is in force.

The resting order SHALL NOT be named in the address. An address naming no order
asks for it, so a link carries latest product without spelling it out, and a
link naming another order carries that one.

The free text and the order in force SHALL be reflected in the address, so the
collector can link to what they are looking at, and going back SHALL return the
listing to the previous narrowing.

#### Scenario: grade10-site-store-product-listing-SC-13 - An order covers the whole catalogue

- **GIVEN** a catalogue holding more cards than one page lists, whose
  lowest-priced card is not among those first listed
- **WHEN** a collector orders the listing by lowest price
- **THEN** that lowest-priced card is listed first

#### Scenario: grade10-site-store-product-listing-SC-14 - Free text covers the whole catalogue

- **GIVEN** a catalogue holding more cards than one page lists, whose only
  match for a collector's words is not among those first listed
- **WHEN** the collector enters those words
- **THEN** that card is listed
- **AND** the address carries the words, so opening it afresh lists the same

#### Scenario: grade10-site-store-product-listing-SC-15 - The menu offers only answerable orders

- **WHEN** a collector opens the sort menu
- **THEN** every order it offers is one the catalogue can answer
- **AND** latest product, lowest price, and highest price are offered
- **AND** popularity is not offered

#### Scenario: grade10-site-store-product-listing-SC-29 - At rest the order is latest

- **WHEN** a collector opens the listing with no order in the address
- **THEN** the listing is ordered by latest product
- **AND** the sort trigger reads `Sort by` followed by the latest option's label
- **AND** that option is marked selected in the menu

#### Scenario: grade10-site-store-product-listing-SC-41 - The resting order is not named in the address

- **GIVEN** a collector on the listing with the resting order in force
- **WHEN** they narrow the listing by a facet choice
- **THEN** the address names that choice and names no order
- **AND** opening that address afresh lists the narrowing by latest product

#### Scenario: grade10-site-store-product-listing-SC-39 - A collection opens on the resting order

- **WHEN** a collector opens the listing at an address naming a collection and
  no order
- **THEN** that collection's cards are listed by latest product
- **AND** the sort trigger reads `Sort by` followed by the latest option's
  label, and that option is marked selected in the menu

### Requirement: The browse listing holds a collector to the shop's count

Each card SHALL carry, as its cart's ceiling, the number the shop has left of
the card's buyable variant. Where the shop exposes no count for that variant,
the card SHALL carry no ceiling and a collector SHALL go on asking for any
quantity — the shop has not said there are few, and a ceiling invented here
would refuse a sale nobody refused.

The ceiling is what the shop last said, so it is advisory: the cart's own
review remains what decides a quantity, and goes on reducing a line the shop
can no longer fill.

#### Scenario: grade10-site-store-product-listing-SC-18 - A card stops at what the shop has

- **GIVEN** a listing holding a card the shop has three of
- **WHEN** a collector raises that card's quantity past three
- **THEN** the quantity stays at three
- **AND** the cart holds three of that card

#### Scenario: grade10-site-store-product-listing-SC-19 - A shop that counts nothing stops nothing

- **GIVEN** a listing holding a card the shop exposes no count for
- **WHEN** a collector raises that card's quantity above three
- **THEN** the quantity rises as asked
- **AND** the cart holds what they asked for

### Requirement: The browse listing says how many are left when that is news

A card SHALL say how many the shop has left when the shop has three or fewer
of it, and when the collector has asked for every one there is. It SHALL say
nothing about what is left at any other time, so the count reads as news
rather than as standing pressure to hurry.

Three or fewer is what counts as nearly out across this store, and the
listing SHALL NOT hold its own number.

#### Scenario: grade10-site-store-product-listing-SC-20 - Nearly out is said on the card

- **GIVEN** a listing holding a card the shop has three of and a card the shop has forty-one of
- **WHEN** the listing renders
- **THEN** the card the shop has three of says three are left
- **AND** the card the shop has forty-one of says nothing about what is left

#### Scenario: grade10-site-store-product-listing-SC-21 - Asking for the last one is answered

- **GIVEN** a listing holding a card the shop has forty-one of
- **WHEN** a collector raises that card's quantity to forty-one
- **THEN** the card says forty-one are left
- **AND** the quantity does not rise past forty-one

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

Both counts SHALL describe one set. The count behind a facet choice SHALL be
the number of cards the listing says when that choice is applied and nothing
else about the query changes — whether or not the collector has searched for a
word.

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

#### Scenario: grade10-site-store-product-listing-SC-30 - A choice's count is the listing it opens

- **GIVEN** a collector who has searched for a word, and a world the panel
  counts twelve behind
- **WHEN** they apply that world
- **THEN** the listing says twelve cards
- **AND** the listing lists twelve cards as they read to the end of it

