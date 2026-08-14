# Shared UI Component Package — delta

## ADDED Requirements

### Requirement: Compound components ship once, from this repository

Every compound-component export named by a capability spec SHALL be provided
by this repository's shared UI package, `@grade10/ui`, and a consuming
application SHALL render those exports from the package rather than
maintaining an application-local implementation of them.

#### Scenario: Two stores render one source

- **GIVEN** two applications that render a surface a capability spec names
- **WHEN** each application renders that surface
- **THEN** both render the same component source from the shared package
- **AND** every difference between the two renderings is produced by the props and theme tokens each application supplies, not by diverging component copies

#### Scenario: A contract change lands once

- **WHEN** a capability spec changes a requirement of a shared compound component
- **THEN** one implementation change in the package satisfies it for every consuming application
- **AND** each application adapts only the props and callbacks it supplies

### Requirement: The package is consumed from source

The shared UI package SHALL be consumable directly from its source files
through the repository submodule, with no build step and no committed build
artifact.

#### Scenario: An application consumes without building

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

#### Scenario: Every state is reachable with props alone

- **WHEN** a package component is rendered in a story or test with props alone
- **THEN** every consumer-observable state — loading, empty, error, resolved, selected, and disabled where they exist — can be produced without any application setup

#### Scenario: A forbidden integration is rejected

- **WHEN** a change to a package component introduces data fetching, product-state persistence, navigation, analytics, feature flags, message-catalog imports, or an import of application code
- **THEN** review rejects the change as a contract violation

### Requirement: The package builds on the design system, one way

Shared UI components SHALL compose the design-system primitives and express
every style through design-system token values, and the design system SHALL
NOT depend on the shared UI package.

#### Scenario: Styling stays on tokens

- **WHEN** a package component needs a color, spacing, radius, or type style
- **THEN** it uses a design-system token value rather than an ad-hoc literal
- **AND** re-theming the token values re-brands the component without a source change

#### Scenario: The dependency does not invert

- **WHEN** a design-system primitive is changed
- **THEN** it compiles and its checks pass without the shared UI package present
