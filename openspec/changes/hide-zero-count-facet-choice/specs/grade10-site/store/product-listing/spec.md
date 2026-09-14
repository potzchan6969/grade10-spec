## MODIFIED Requirements

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

The same rule SHALL hold one level down. On a listing nothing narrows, a group
that does have something counted behind it SHALL still drop any choice of its
own counted at nothing: the control that only empties the grid is no less a
trap for sitting beside choices that work.

Once a narrowing is in force, every group the catalogue names choices for SHALL
be offered however little is counted behind them: nothing behind a choice is
then the query's doing rather than the shop's, and the collector needs the
groups to widen by. Every choice a narrowed group offers SHALL stay offered
however little is counted behind it, and a choice the collector has selected
SHALL remain selected and selectable however little is counted behind it,
since a selection nobody can undo is a trap.

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

#### Scenario: grade10-site-store-product-listing-SC-42 - A choice with nothing counted behind it

- **GIVEN** a collector on the unscoped listing, in a group the catalogue
  counts something behind at least one choice of
- **WHEN** the panel offers that group
- **THEN** every choice the catalogue counts nothing behind is left off it
- **AND** every choice counted above zero is offered as before
