# Shared UI Component Package — delta

## ADDED Requirements

### Requirement: No shared component carries a store's content

A component that more than one store application renders — whether it lives in
the shared UI package or in the design system — SHALL NOT supply a default,
fallback, or built-in value for any prop that carries a store's brand,
navigation, catalog, locale, or copy. Such props SHALL be required, so that
omitting one fails type checking rather than falling back to another store's
content.

This applies to a component's brand name and logo, its navigation and utility
links, its footer columns, its social and legal links, its locale or currency
label, its corporate attribution, and any promotional, descriptive, or
marketing string.

It does not apply to a prop carrying no store's content: layout, variant, size,
and accessibility behavior may keep defaults. Nor does it apply to the
accessible name of a standard control, which names that control's function
rather than any store's content and may keep a default that a localizing
consumer overrides.

Where a Figma Code Connect template exists for such a component, the template
SHALL emit every required prop, so the snippet a designer copies from Dev Mode
compiles.

#### Scenario: A second store renders the chrome

- **GIVEN** a store application other than the one a shared component was first built for
- **WHEN** that application renders the component without supplying navigation, brand, or copy
- **THEN** type checking fails, naming the props it must supply
- **AND** no other store's brand name, navigation, or links can be displayed

#### Scenario: The store's own content is supplied

- **WHEN** an application supplies its own brand, navigation, links, locale label, and copy
- **THEN** the component displays exactly what was supplied
- **AND** the component's layout, spacing, and token-derived styling are unchanged from the design source

#### Scenario: A non-content default is kept

- **WHEN** a shared component offers a default for a variant, size, layout, accessibility behavior, or the accessible name of a standard control
- **THEN** that default is permitted, because omitting it displays no store's content

#### Scenario: The design snippet still compiles

- **GIVEN** a shared component with a Figma Code Connect template
- **WHEN** a designer copies the component's snippet from Dev Mode
- **THEN** the snippet supplies every required prop
- **AND** it compiles against the component's current types

#### Scenario: Review catches a reintroduced default

- **WHEN** a change adds a default value for a prop carrying brand, navigation, catalog, locale, or copy on a shared component
- **THEN** review rejects the change as a contract violation
