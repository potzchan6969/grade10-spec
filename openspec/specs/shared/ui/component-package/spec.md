# shared/ui/component-package Specification

## Purpose

The shared UI component package, `@grade10/ui`: where a compound component
named by a capability spec is implemented once and imported by every store
application, rather than written again in each. This capability governs what
the package is — how it is distributed, what its components may and may not
do, and how it relates to the design system. What any individual component
renders is its own capability.

## Feature set

- One shared implementation
  - Single source: a compound component a capability spec names is implemented once and imported everywhere
  - Contract changes: one change in the package satisfies a spec change for every consuming application
  - Source consumption: the package resolves from its source files through the submodule, with no build step
- App-neutral components
  - Props and callbacks: product state and content arrive as props; every interaction reports through a callback
  - Forbidden integrations: fetching, persistence, navigation, analytics, flags, catalogs, and app imports stay out
  - Story reachability: every consumer-observable state is producible with props alone
- No store's content built in
  - Required content props: brand, navigation, catalog, locale, and copy props are required rather than defaulted
  - Permitted defaults: layout, variant, size, and accessibility behavior may keep defaults
  - Design snippets: a Code Connect template emits every required prop, so the copied snippet compiles
- Typed copy contract
  - One copy prop: every word a component renders arrives in a single prop whose type the component exports
  - Words and slots: a word is a string; a node prop is a slot the component places, not something it says
  - Composable copy: a surface declares its words by composing the copy types of the components it renders
- Design-system foundation
  - One-way dependency: shared components compose the primitives, and the design system never depends back
  - Token-only styling: every style is a token value, so re-theming re-brands without a source change
  - Token-named utilities: a utility named after a token renders the value that token carries in `tokens.json`
- Package entry exports
  - Store-home blocks: the store-home components and their prop and copy types are exported from the public entry

## Requirements
### Requirement: Compound components ship once, from this repository

Every compound-component export named by a capability spec SHALL be provided
by this repository's shared UI package, `@grade10/ui`, and a consuming
application SHALL render those exports from the package rather than
maintaining an application-local implementation of them.

#### Scenario: shared-ui-component-package-SC-01 - Two stores render one source
**Serves:** One shared implementation - two stores render one source

- **GIVEN** two applications that render a surface a capability spec names
- **WHEN** each application renders that surface
- **THEN** both render the same component source from the shared package
- **AND** every difference between the two renderings is produced by the props and theme tokens each application supplies, not by diverging component copies

#### Scenario: shared-ui-component-package-SC-02 - A contract change lands once
**Serves:** One shared implementation - a contract change lands once

- **WHEN** a capability spec changes a requirement of a shared compound component
- **THEN** one implementation change in the package satisfies it for every consuming application
- **AND** each application adapts only the props and callbacks it supplies

### Requirement: The package is consumed from source

The shared UI package SHALL be consumable directly from its source files
through the repository submodule, with no build step and no committed build
artifact.

#### Scenario: shared-ui-component-package-SC-03 - An application consumes without building
**Serves:** One shared implementation - an application consumes without building

- **WHEN** an application installs the workspace with this repository pinned as its submodule
- **THEN** imports from the shared UI package resolve to source files without running any build in this repository
- **AND** no generated bundle for the package is committed here

### Requirement: Package components are app-neutral

A component in the shared UI package SHALL receive all product state and
human-readable content through props, SHALL report every user interaction
through a callback, and SHALL NOT fetch data, mutate product state, navigate,
persist to browser storage, record analytics, read feature flags, import
message catalogs, or import application code. Internal, transient
presentation state and DOM-renderer lifecycle remain permitted.

#### Scenario: shared-ui-component-package-SC-04 - Every state is reachable with props alone
**Serves:** App-neutral components - every state is reachable with props alone

- **WHEN** a package component is rendered in a story or test with props alone
- **THEN** every consumer-observable state — loading, empty, error, resolved, selected, and disabled where they exist — can be produced without any application setup

#### Scenario: shared-ui-component-package-SC-05 - A forbidden integration is rejected
**Serves:** App-neutral components - a forbidden integration is rejected

- **WHEN** a change to a package component introduces data fetching, product-state persistence, navigation, analytics, feature flags, message-catalog imports, or an import of application code
- **THEN** review rejects the change as a contract violation

### Requirement: The package builds on the design system, one way

Shared UI components SHALL compose the design-system primitives and express
every style through design-system token values, and the design system SHALL
NOT depend on the shared UI package.

#### Scenario: shared-ui-component-package-SC-06 - Styling stays on tokens
**Serves:** Design-system foundation - styling stays on tokens

- **WHEN** a package component needs a color, spacing, radius, or type style
- **THEN** it uses a design-system token value rather than an ad-hoc literal
- **AND** re-theming the token values re-brands the component without a source change

#### Scenario: shared-ui-component-package-SC-07 - The dependency does not invert
**Serves:** Design-system foundation - the dependency does not invert

- **WHEN** a design-system primitive is changed
- **THEN** it compiles and its checks pass without the shared UI package present

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

#### Scenario: shared-ui-component-package-SC-08 - A second store renders the chrome
**Serves:** No store's content built in - a second store renders the chrome

- **GIVEN** a store application other than the one a shared component was first built for
- **WHEN** that application renders the component without supplying navigation, brand, or copy
- **THEN** type checking fails, naming the props it must supply
- **AND** no other store's brand name, navigation, or links can be displayed

#### Scenario: shared-ui-component-package-SC-09 - The store's own content is supplied
**Serves:** No store's content built in - the store's own content is supplied

- **WHEN** an application supplies its own brand, navigation, links, locale label, and copy
- **THEN** the component displays exactly what was supplied
- **AND** the component's layout, spacing, and token-derived styling are unchanged from the design source

#### Scenario: shared-ui-component-package-SC-10 - A non-content default is kept
**Serves:** No store's content built in - a non-content default is kept

- **WHEN** a shared component offers a default for a variant, size, layout, accessibility behavior, or the accessible name of a standard control
- **THEN** that default is permitted, because omitting it displays no store's content

#### Scenario: shared-ui-component-package-SC-11 - The design snippet still compiles
**Serves:** No store's content built in - the design snippet still compiles

- **GIVEN** a shared component with a Figma Code Connect template
- **WHEN** a designer copies the component's snippet from Dev Mode
- **THEN** the snippet supplies every required prop
- **AND** it compiles against the component's current types

#### Scenario: shared-ui-component-package-SC-12 - Review catches a reintroduced default
**Serves:** No store's content built in - review catches a reintroduced default

- **WHEN** a change adds a default value for a prop carrying brand, navigation, catalog, locale, or copy on a shared component
- **THEN** review rejects the change as a contract violation

### Requirement: A block's words are one typed group

A shared UI component SHALL take every word it renders in a single `copy`
prop, and SHALL export the type of that prop under the component's own name.
A value that changes with what is being shown — a price, a count, a remaining
time — SHALL be its own prop rather than part of that group, and so SHALL
every slot the consumer fills with markup, every piece of state, and every
callback.

A word SHALL be typed as a string. A prop MAY be typed as a node only where
the consumer composes markup into it, and such a prop SHALL be a slot rather
than a word: something the component places, not something it says.

A component's copy type SHALL be composable — a surface assembled from
several components SHALL be able to declare its own copy as theirs together,
rather than restating the words each of them already declares.

#### Scenario: shared-ui-component-package-SC-13 - A consumer reads what a block needs
**Serves:** Typed copy contract - a consumer reads what a block needs

- **WHEN** an engineer opens a shared component's exported copy type
- **THEN** it lists every word that component renders, and nothing else

#### Scenario: shared-ui-component-package-SC-14 - A word can be an accessible name
**Serves:** Typed copy contract - a word can be an accessible name

- **GIVEN** a component that renders a control labelled by one of its words
- **WHEN** that control needs an accessible name, a title, or a truncation
- **THEN** the word itself serves, without a second prop carrying the same text

#### Scenario: shared-ui-component-package-SC-15 - A slot takes markup, a word does not
**Serves:** Typed copy contract - a slot takes markup, a word does not

- **WHEN** a consumer passes an element where a component expects a word
- **THEN** it is a type error
- **AND** the slots the component does offer accept that element

#### Scenario: shared-ui-component-package-SC-16 - A surface declares its words once
**Serves:** Typed copy contract - a surface declares its words once

- **GIVEN** a surface that renders several shared components
- **WHEN** it declares the copy it needs
- **THEN** it composes their copy types rather than repeating their words

### Requirement: A token-named utility resolves to that token's value

Where the design system exposes a design token as a named utility class, that
utility SHALL resolve to the value the token carries in `tokens.json`. The
generated theme CSS SHALL NOT declare a second value for a token the token
build already emits, whether literal or derived from another token, and SHALL
NOT define a scale by multiplying one token to produce the rest.

A utility that reads a token by name SHALL be interchangeable with the
arbitrary-property form naming the same token: `rounded-md` and
`rounded-(--radius-md)` SHALL render the same value.

#### Scenario: shared-ui-component-package-SC-17 - A designer changes a token value
**Serves:** Design-system foundation - a designer changes a token value

- **WHEN** a token's value changes in `tokens.json` and the theme CSS is rebuilt
- **THEN** every utility named after that token renders the new value
- **AND** no component source changes

#### Scenario: shared-ui-component-package-SC-18 - A utility is named after a token
**Serves:** Design-system foundation - a utility is named after a token

- **WHEN** a component applies a utility named after a design token
- **THEN** the rendered value equals that token's value in `tokens.json`
- **AND** it equals what the arbitrary-property form of the same token renders

#### Scenario: shared-ui-component-package-SC-19 - A scale is projected
**Serves:** Design-system foundation - a scale is projected

- **WHEN** the design system exposes a token scale as utilities
- **THEN** each rung reads its own token
- **AND** no rung is computed from another rung's value

### Requirement: The store home blocks are exported from the package entry

The shared UI package SHALL export, from its public entry, the store-home
components and types named by `shared/ui/store-home`: `StoreHomeHero`,
`StoreSectionHeader`, `StoreCollectionGrid`, `StoreCollectionTile`, and each
of their prop and copy types.

#### Scenario: shared-ui-component-package-SC-20 - An application imports a store-home block
**Serves:** Package entry exports - an application imports a store-home block

- **WHEN** an application imports any store-home export named above from the package's public entry
- **THEN** the import resolves to the implementation in `packages/ui`
