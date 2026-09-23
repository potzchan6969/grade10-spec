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

## ADDED Requirements

### Requirement: A heading with nothing to browse needs no browse label

`StoreSectionHeader` SHALL accept copy carrying no browse label where no
browse-all link is to be drawn, so a surface with nothing to browse names no
word for a link it never shows.

#### Scenario: shared-ui-store-home-SC-10 - No browse label is needed where no link is drawn
**Serves:** Section header - a surface with nothing to browse names no word for it

- **WHEN** the header renders with a title and copy carrying no browse label
- **THEN** the title appears and no browse link is shown
- **AND** no browse label is required of the consumer
