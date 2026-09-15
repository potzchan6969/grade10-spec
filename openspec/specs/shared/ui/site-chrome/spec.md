# shared/ui/site-chrome Specification

## Purpose
The chrome every storefront wraps its pages in: the site header and the site
footer, shipped once from the design system so two brands render the same
shell. The components own the layout; the application owns every string, every
destination, and every control that does something.

## Feature set

- Chrome exports
  - Header and footer: `Nav` and `Footer` from the design-system entry, each usable alone
- Header controls
  - Handler-gated: search, account, and cart render only when a handler is supplied
  - No wishlist: the header does not offer a wishlist control
- Current surface
  - Marked destination: the chrome can mark which surface is being viewed
- Footer
  - Supplied sections: columns and links the application provides; empty sections stay empty
- No defaulted content
  - Application-owned copy: nothing visible is invented by the chrome

## Requirements
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

#### Scenario: shared-ui-site-chrome-SC-01 - An application imports the chrome

- **WHEN** an application imports each name above from the design system's public entry
- **THEN** every import resolves

#### Scenario: shared-ui-site-chrome-SC-02 - A page renders one without the other

- **WHEN** an application renders the header without the footer, or the footer
  without the header
- **THEN** it renders as specified, with no missing-context error

#### Scenario: shared-ui-site-chrome-SC-03 - The chrome's words arrive as one group

- **WHEN** an application supplies the chrome's words
- **THEN** it passes one object per component, typed by that component's copy type
- **AND** a word it omits is a type error rather than an empty region

### Requirement: A control renders only when it can act

`Nav` SHALL render its search, account, and cart controls only when the
application supplies a handler for that control. A control with no handler
SHALL be absent from the rendered header — not present and inert, and not
visually disabled.

`Nav` SHALL NOT render a wishlist control.

The locale control SHALL always display the supplied locale label, and SHALL
be interactive only when a handler is supplied.

#### Scenario: shared-ui-site-chrome-SC-04 - A storefront with no cart
**Serves:** Header controls - a storefront with no cart

- **GIVEN** an application that supplies no cart handler
- **WHEN** the header renders
- **THEN** no cart control appears in it, and no space is reserved for one

#### Scenario: shared-ui-site-chrome-SC-05 - Only the supplied controls appear
**Serves:** Header controls - only the supplied controls appear

- **GIVEN** an application that supplies a handler for the account control alone
- **WHEN** the header renders
- **THEN** the account control appears
- **AND** the search and cart controls do not

#### Scenario: shared-ui-site-chrome-SC-06 - Wishlist is not a header control
**Serves:** Header controls - wishlist is not a header control

- **WHEN** the header renders
- **THEN** no wishlist control appears, and no space is reserved for one

#### Scenario: shared-ui-site-chrome-SC-07 - The locale label without a handler
**Serves:** Header controls - the locale label without a handler

- **GIVEN** an application that supplies a locale label and no locale handler
- **WHEN** the header renders
- **THEN** the label is displayed
- **AND** nothing about it invites a click

### Requirement: An empty region of the header is absent

`Nav` SHALL omit the promotional bar when the application supplies no promo
content, and SHALL omit the utility row when the application supplies no
utility links. An omitted region SHALL occupy no height.

#### Scenario: shared-ui-site-chrome-SC-08 - No promo content
**Serves:** Footer - no promo content

- **WHEN** the header renders with no promo content
- **THEN** no promotional bar appears and the header is shorter by its height

#### Scenario: shared-ui-site-chrome-SC-09 - No utility links
**Serves:** Footer - no utility links

- **WHEN** the header renders with an empty set of utility links
- **THEN** no utility row appears, and no empty strip is left in its place

### Requirement: The header marks the current surface

`Nav` SHALL mark the navigation item the application identifies as current,
both visually and to assistive technology, and SHALL mark no item when the
application identifies none.

#### Scenario: shared-ui-site-chrome-SC-10 - A surface is current

- **GIVEN** navigation items of which one is marked current
- **WHEN** the header renders
- **THEN** that item is distinguished from the others and is announced as the
  current page
- **AND** no other item is

#### Scenario: shared-ui-site-chrome-SC-11 - No surface is current

- **WHEN** the header renders with no item marked current
- **THEN** no item is announced as the current page

### Requirement: The footer omits a section it has no content for

`Footer` SHALL display the supplied brand block, link columns, social links,
copyright, legal links, and locale, and SHALL omit any of the columns, social
links, or legal links the application supplies none of, rather than rendering
an empty heading or an empty row.

#### Scenario: shared-ui-site-chrome-SC-12 - Every section is supplied
**Serves:** Footer - every section is supplied

- **WHEN** the footer renders with a brand block, columns, social links,
  copyright, legal links, and a locale
- **THEN** all of them are displayed

#### Scenario: shared-ui-site-chrome-SC-13 - A section has no content
**Serves:** Footer - a section has no content

- **WHEN** the footer renders with no social links, no legal links, or an
  empty set of columns
- **THEN** nothing stands in its place — no heading, no empty row, no reserved
  space

### Requirement: The chrome carries no content of its own

`Nav` and `Footer` SHALL render no visible copy the application did not
supply — no brand name, no navigation label, no link text, and no fallback for
an omitted value.

#### Scenario: shared-ui-site-chrome-SC-14 - Nothing is defaulted
**Serves:** No defaulted content - nothing is defaulted

- **WHEN** the chrome renders
- **THEN** every visible string is one the application supplied

