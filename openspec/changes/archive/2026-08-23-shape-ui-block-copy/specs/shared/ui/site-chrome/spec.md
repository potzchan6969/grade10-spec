# shared/ui/site-chrome Specification

## MODIFIED Requirements

### Requirement: The chrome exports

The design system SHALL export, from its public entry, the `Nav` and `Footer`
components and these types: `NavProps`, `NavItem`, `NavLink`, `NavCopy`,
`FooterProps`, `FooterColumn`, `FooterLink`, and `FooterCopy`.

Each SHALL take the words it renders in a single `copy` prop of its own copy
type; every other input — the destinations, the handlers, the promotional and
utility regions, the locale set and the selected locale — SHALL remain its own
prop.

`Nav` and `Footer` SHALL each be renderable on their own, in either order, and
neither SHALL require the other.

#### Scenario: An application imports the chrome

- **WHEN** an application imports each name above from the design system's public entry
- **THEN** every import resolves

#### Scenario: A page renders one without the other

- **WHEN** an application renders the header without the footer, or the footer
  without the header
- **THEN** it renders as specified, with no missing-context error

#### Scenario: The chrome's words arrive as one group

- **WHEN** an application supplies the chrome's words
- **THEN** it passes one object per component, typed by that component's copy type
- **AND** a word it omits is a type error rather than an empty region
