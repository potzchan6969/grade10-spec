# frontend-composition Specification

## Purpose
Define what a product's frontend package publishes so its features can be composed, and what an application's composition root is allowed to load, so a feature reaches every application that shows its product without a composition root changing.
## Requirements
### Requirement: A product frontend package publishes its feature modules as one list

A frontend package that defines feature slices MUST publish every dependency-injection module those slices define as a single ordered list, reachable at one dedicated subpath of the package entry. The list MUST contain every such module the package defines and MUST NOT be filterable, reorderable, or parameterised by a consumer. A package that defines exactly one slice today MUST publish the list all the same, so the second slice joins a list that already exists rather than changing every consumer.

#### Scenario: A product gains a feature slice

- **WHEN** a frontend package adds a feature slice that defines a dependency-injection module
- **THEN** that module joins the package's published list
- **AND THEN** every application composing that product resolves the new slice's bindings without its composition root changing

#### Scenario: A package defines a single feature slice

- **WHEN** a frontend package defines exactly one feature slice
- **THEN** it still publishes the one-entry list at the dedicated subpath
- **AND THEN** a consumer composing that product names the list, not the single module

#### Scenario: An admin frontend package is composed

- **WHEN** an application composes a package whose slices serve an operator rather than a collector
- **THEN** that package publishes its modules as one list on the same terms as a user-facing package

### Requirement: A composition root loads published lists, not individual feature modules

An application MUST load a product's published list in its composition root and MUST NOT name an individual feature slice's dependency-injection module there. A test that exercises one slice in isolation MAY load that slice's module directly; no other consumer may.

#### Scenario: An application composes a product

- **WHEN** an application's composition root installs a product's features
- **THEN** it loads that product's published list
- **AND THEN** no individual feature module of that product is named in the composition root

#### Scenario: An application composes several products

- **WHEN** an application composes more than one product
- **THEN** its composition root reads as one core module and one published list per product
- **AND THEN** the set of products the application shows is legible from that file alone

#### Scenario: A test exercises one feature slice

- **WHEN** a test composes a container to exercise a single feature slice against a fixture client
- **THEN** it may load that slice's module directly without the rest of the product's list
- **AND THEN** a test harness that stands in for a whole application composes the published list instead

### Requirement: A core-module factory names the product it composes

The exported name of a frontend package's core-module factory MUST identify the product it binds the shared ports of. A name that identifies only the layer, or that identifies nothing, MUST NOT be used, because a composition root installing several products would then read as repeated identical calls.

#### Scenario: A composition root installs several core modules

- **WHEN** an application installs the core module of more than one product
- **THEN** each call names its product at the call site
- **AND THEN** a reader identifies which product each set of client dependencies belongs to without opening the package

#### Scenario: A package publishes a core-module factory

- **WHEN** a frontend package publishes a factory that binds its shared ports
- **THEN** the exported name carries the product, distinguishing the user-facing package from the operator-facing one for the same product

### Requirement: An application constructs its outbound clients in one place

An application MUST construct every client it hands to a composition root in one dedicated directory, one module per client. The shared response cache MUST be its own module rather than an export of any single client's module, so cache-wide policy has a home that belongs to no one backend.

#### Scenario: An application constructs its clients

- **WHEN** an application builds the session client and typed procedure clients its composition root passes into core modules
- **THEN** each is defined in its own module inside the application's client directory
- **AND THEN** the composition root's imports name the clients it wires and nothing else

#### Scenario: Cache-wide policy is added

- **WHEN** an application adds policy that applies to every response it caches
- **THEN** that policy lands in the shared cache's own module
- **AND THEN** no single backend's client module is edited to carry it

