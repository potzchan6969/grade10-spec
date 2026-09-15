# shared/ui/store-home Specification

## Purpose

The shared blocks a store landing page assembles between site chrome and a
product row: a marketing hero, a titled section header with a browse-all link,
and a bento grid of collection tiles. Every store application renders them from
one component source, supplying its own copy, imagery, collections, and
callbacks.

## Feature set

- Surface exports
  - Named components: hero, section header, collection grid, and tile from the package entry
  - Reusable parts: hero, header, and tile render without the grid
- Hero
  - Supplied marketing: eyebrow, title, description, image, and two callbacks
- Section header
  - Title and browse: a browse link only when an href is supplied
- Collection grid
  - Catalogue tiles: one tile per supplied collection, featured in the large cell
- No defaulted content
  - Application-owned copy: nothing visible is invented by the blocks

## Requirements

### Requirement: The store home surface exports

The shared UI package SHALL export, from its public entry, exactly these
components for the store home surface — `StoreHomeHero`, `StoreSectionHeader`,
`StoreCollectionGrid`, and `StoreCollectionTile` — and exactly these types:
`StoreHomeHeroProps`, `StoreHomeHeroCopy`, `StoreSectionHeaderProps`,
`StoreSectionHeaderCopy`, `StoreCollectionGridProps`, `StoreCollectionTileProps`,
and `StoreCollectionSummary`.

Each component SHALL take the words it renders in a single `copy` prop of its
own copy type where it renders words; collection tiles and the hero SHALL
receive imagery, labels, and destinations through props.

`StoreSectionHeader`, `StoreCollectionTile`, and `StoreHomeHero` SHALL each be
renderable on their own, outside `StoreCollectionGrid`, so a later surface can
reuse one without the others.

#### Scenario: shared-ui-store-home-SC-01 - An application imports the surface
**Serves:** Surface exports - an application imports the surface

- **WHEN** an application imports each name above from the shared UI package's public entry
- **THEN** every import resolves
- **AND** no other component or type is exported for this surface

#### Scenario: shared-ui-store-home-SC-02 - A part is reused alone
**Serves:** Surface exports - a part is reused alone

- **WHEN** an application renders the hero, the section header, or a collection tile without the collection grid
- **THEN** it renders and behaves as specified, with no missing-context error

### Requirement: The hero displays supplied marketing content

`StoreHomeHero` SHALL display a supplied background image, an eyebrow label, a
title, a description, and two call-to-action controls whose labels come from
its copy prop. It SHALL report activation of each control through a named
callback. It SHALL NOT navigate or fetch content.

#### Scenario: shared-ui-store-home-SC-03 - Both controls are supplied
**Serves:** Hero - both controls are supplied

- **GIVEN** a hero with copy for both controls and handlers for both
- **WHEN** the hero renders
- **THEN** both controls appear with the supplied labels
- **AND** activating either reports through its callback

#### Scenario: shared-ui-store-home-SC-04 - A control has no handler
**Serves:** Hero - a control has no handler

- **GIVEN** a hero that supplies a handler for only one control
- **WHEN** the hero renders
- **THEN** only the control with a handler appears

### Requirement: The section header displays a title and an optional browse link

`StoreSectionHeader` SHALL display a supplied title as a heading and SHALL
display a browse-all link only when the application supplies an `href` and the
link label in copy. The link SHALL NOT appear when no `href` is supplied.

#### Scenario: shared-ui-store-home-SC-05 - Browse link is supplied
**Serves:** Section header - browse link is supplied

- **WHEN** the header renders with a title, a browse label, and an href
- **THEN** the title and the link both appear

#### Scenario: shared-ui-store-home-SC-06 - No browse destination
**Serves:** Section header - no browse destination

- **WHEN** the header renders with a title and no href
- **THEN** the title appears and no browse link is shown

### Requirement: The collection grid displays supplied tiles in bento layout

`StoreCollectionGrid` SHALL display one tile per supplied collection, in the
order supplied. A collection marked featured SHALL span the larger bento cell
defined by the design; every other collection SHALL use the smaller cell. Each
tile SHALL display its supplied icon or image and label and SHALL navigate only
through a supplied href or an activation callback — not both required, but at
least one affordance the application wires.

The grid SHALL NOT decide which collections exist or their order.

#### Scenario: shared-ui-store-home-SC-07 - A featured and standard tile render
**Serves:** Collection grid - a featured and standard tile render

- **GIVEN** one collection marked featured and one standard collection
- **WHEN** the grid renders
- **THEN** both labels appear
- **AND** the featured tile occupies the larger bento cell

#### Scenario: shared-ui-store-home-SC-08 - Activating a tile
**Serves:** Collection grid - activating a tile

- **GIVEN** a tile with an activation callback
- **WHEN** the shopper activates the tile
- **THEN** the callback identifies that collection

### Requirement: The store home blocks carry no content of their own

Every store-home component SHALL render no visible copy, image, or collection
the application did not supply.

#### Scenario: shared-ui-store-home-SC-09 - Nothing is defaulted
**Serves:** No defaulted content - nothing is defaulted

- **WHEN** any store-home component renders
- **THEN** every visible string and image is one the application supplied
