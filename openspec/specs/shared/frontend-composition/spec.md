# shared/frontend-composition Specification

## Purpose
Define what a product's frontend package publishes so its features can be composed, and what an application's composition root is allowed to load, so a feature reaches every application that shows its product without a composition root changing.

## Feature set

- Published module lists
  - One ordered list: every module a package's feature slices define is reachable as one list at a dedicated subpath
  - Not consumer-shaped: the list cannot be filtered, reordered, or parameterised by whoever loads it
  - Single-slice packages: a package with one slice publishes the list anyway, so the second slice joins it
- Composition root rules
  - Lists over modules: a composition root loads a product's published list and names no individual slice module
  - Legible from one file: several products read as one core module and one published list each
  - Test exception: a test exercising one slice against a fixture client may load that slice's module directly
- Named core modules
  - Product in the name: a core-module factory's export names the product whose shared ports it binds
  - Two audiences distinguished: the name separates a product's user-facing package from its operator-facing one
- Client construction
  - One client per module: an application defines every client it hands to composition in one dedicated directory
  - Shared cache module: cache-wide policy has its own home rather than living inside one backend's client
- Operator-only ports
  - Operator package ownership: a port only an operator's client satisfies is declared where its slices live
  - No optional ports: a core module binds every port it declares rather than letting some consumers omit one
  - Collector-facing composability: a collector application supplies every port its package declares, leaving no token unbound

## Requirements
### Requirement: A product frontend package publishes its feature modules as one list

A frontend package that defines feature slices MUST publish every dependency-injection module those slices define as a single ordered list, reachable at one dedicated subpath of the package entry. The list MUST contain every such module the package defines and MUST NOT be filterable, reorderable, or parameterised by a consumer. A package that defines exactly one slice today MUST publish the list all the same, so the second slice joins a list that already exists rather than changing every consumer.

#### Scenario: shared-frontend-composition-SC-01 - A product gains a feature slice

- **WHEN** a frontend package adds a feature slice that defines a dependency-injection module
- **THEN** that module joins the package's published list
- **AND THEN** every application composing that product resolves the new slice's bindings without its composition root changing

#### Scenario: shared-frontend-composition-SC-02 - A package defines a single feature slice

- **WHEN** a frontend package defines exactly one feature slice
- **THEN** it still publishes the one-entry list at the dedicated subpath
- **AND THEN** a consumer composing that product names the list, not the single module

#### Scenario: shared-frontend-composition-SC-03 - An admin frontend package is composed

- **WHEN** an application composes a package whose slices serve an operator rather than a collector
- **THEN** that package publishes its modules as one list on the same terms as a user-facing package

### Requirement: A composition root loads published lists, not individual feature modules

An application MUST load a product's published list in its composition root and MUST NOT name an individual feature slice's dependency-injection module there. A test that exercises one slice in isolation MAY load that slice's module directly; no other consumer may.

#### Scenario: shared-frontend-composition-SC-04 - An application composes a product

- **WHEN** an application's composition root installs a product's features
- **THEN** it loads that product's published list
- **AND THEN** no individual feature module of that product is named in the composition root

#### Scenario: shared-frontend-composition-SC-05 - An application composes several products

- **WHEN** an application composes more than one product
- **THEN** its composition root reads as one core module and one published list per product
- **AND THEN** the set of products the application shows is legible from that file alone

#### Scenario: shared-frontend-composition-SC-06 - A test exercises one feature slice

- **WHEN** a test composes a container to exercise a single feature slice against a fixture client
- **THEN** it may load that slice's module directly without the rest of the product's list
- **AND THEN** a test harness that stands in for a whole application composes the published list instead

### Requirement: A core-module factory names the product it composes

The exported name of a frontend package's core-module factory MUST identify the product it binds the shared ports of. A name that identifies only the layer, or that identifies nothing, MUST NOT be used, because a composition root installing several products would then read as repeated identical calls.

#### Scenario: shared-frontend-composition-SC-07 - A composition root installs several core modules

- **WHEN** an application installs the core module of more than one product
- **THEN** each call names its product at the call site
- **AND THEN** a reader identifies which product each set of client dependencies belongs to without opening the package

#### Scenario: shared-frontend-composition-SC-08 - A package publishes a core-module factory

- **WHEN** a frontend package publishes a factory that binds its shared ports
- **THEN** the exported name carries the product, distinguishing the user-facing package from the operator-facing one for the same product

### Requirement: An application constructs its outbound clients in one place

An application MUST construct every client it hands to a composition root in one dedicated directory, one module per client. The shared response cache MUST be its own module rather than an export of any single client's module, so cache-wide policy has a home that belongs to no one backend.

#### Scenario: shared-frontend-composition-SC-09 - An application constructs its clients

- **WHEN** an application builds the session client and typed procedure clients its composition root passes into core modules
- **THEN** each is defined in its own module inside the application's client directory
- **AND THEN** the composition root's imports name the clients it wires and nothing else

#### Scenario: shared-frontend-composition-SC-10 - Cache-wide policy is added

- **WHEN** an application adds policy that applies to every response it caches
- **THEN** that policy lands in the shared cache's own module
- **AND THEN** no single backend's client module is edited to carry it

### Requirement: An operator-only client port lives in the operator-facing package

A client port that a collector-facing surface cannot satisfy MUST be declared
by the product's operator-facing frontend package, and the slices that resolve
it MUST live there. A frontend package's core module MUST bind every port it
declares; it MUST NOT declare a port optional so that one set of consumers may
omit it. A package a collector-facing application composes therefore declares
no port that application cannot supply, and the published-list rule stays
satisfiable for every package a composition root loads.

#### Scenario: shared-frontend-composition-SC-11 - A product gains a slice only an operator may reach

- **WHEN** a product adds a feature slice whose client port only an operator's
  client satisfies
- **THEN** the slice and its port belong to that product's operator-facing
  frontend package
- **AND THEN** the collector-facing package for that product declares neither
  the port nor the slice

#### Scenario: shared-frontend-composition-SC-12 - A collector-facing application composes the product

- **WHEN** an application whose surfaces serve collectors composes a product
  that also has operator-only slices
- **THEN** it installs only that product's collector-facing package
- **AND THEN** every port that package's core module declares is one the
  application supplies, and no token is left unbound

#### Scenario: shared-frontend-composition-SC-13 - A core module is offered a port only some consumers can supply

- **WHEN** a frontend package's core module would have to accept a client that
  only some of its consumers can build
- **THEN** the port moves to the operator-facing package rather than becoming
  an optional dependency of the shared one
- **AND THEN** no consumer distinguishes itself by which optional clients it
  passed

#### Scenario: shared-frontend-composition-SC-14 - An operator-facing package is composed by a panel

- **WHEN** an application composes a product's operator-facing package
- **THEN** it installs that package's core-module factory with the operator
  client, and loads that package's published list
- **AND THEN** the same client may satisfy the collector-facing package's port
  as well, bound at the composition root rather than by either package's ports
  or core module naming the other's

### Requirement: A product's browser data layer lives in a frontend package for every audience it serves

Every call a browser makes to a product's backend MUST be defined in a frontend
package for that product, behind a client port that package declares, and MUST
be reached through a feature slice that package publishes. This holds for each
audience the product serves: a surface an operator reaches is a feature slice on
the same terms as a surface a collector reaches, and a product that serves both
therefore publishes a package per audience, as the existing requirement on
operator-only client ports already assumes. An application MUST NOT define a
product's browser data layer in its own source, whether or not that product has
a package already.

#### Scenario: A product gains an operator surface

- **WHEN** a product that already publishes a collector-facing frontend package
  gains a surface only an operator reaches
- **THEN** that surface's data layer lands in that product's operator-facing
  frontend package
- **AND THEN** the collector-facing package gains neither the slice nor its port

#### Scenario: A product's first surface serves operators

- **WHEN** a product's only browser surface is one an operator reaches
- **THEN** that product publishes an operator-facing frontend package for it
- **AND THEN** no collector-facing package is created to hold work no collector
  reaches

#### Scenario: Only one brand shows the surface

- **WHEN** a surface is shown by one brand's application and no other
- **THEN** its slice still lives in the product's frontend package, and the
  application that shows it installs that package's published list
- **AND THEN** a second brand showing the surface later installs the same list
  and copies nothing

### Requirement: Application page code reaches a backend only through the container

An application's page, view and component code MUST reach a product's backend
only through a handle resolved from the application's container. It MUST NOT
call a transport client, issue a request of its own, or declare a schema by
which a backend's response is checked. A transport client MAY be constructed in
the application's client directory and handed to a package's port at the
composition root, and nowhere else may name it.

#### Scenario: A page renders data from a backend

- **WHEN** an application's page shows data a backend answers with
- **THEN** it resolves the feature slice's published handle from the container
- **AND THEN** no transport client, request, or response schema is named in the
  application's page code

#### Scenario: A page carries out an operator command

- **WHEN** an operator's action changes state a backend owns
- **THEN** the command is a feature slice's handle the page resolves
- **AND THEN** the decision the command protects lives in the package, not in
  the surface that triggered it

#### Scenario: An application constructs a transport client

- **WHEN** an application builds a typed client for a product's backend
- **THEN** the composition root is the only place that hands it to a port
- **AND THEN** no page, view or component imports that client

### Requirement: One slice serves every brand that shows a surface

A surface more than one brand shows MUST be defined once, in the product's
frontend package, and installed by each brand's application. An application MUST
NOT hold a second copy of another application's data layer, view code or page
code for the same surface. Where a brand differs, the difference MUST be
expressed as configuration the application supplies or as a value the surface is
handed, not as a duplicated file.

#### Scenario: Two brands show the same operator surface

- **WHEN** two brands' applications both show a surface for the same product
- **THEN** one slice in that product's package serves both
- **AND THEN** neither application holds a copy of the other's version of it

#### Scenario: A brand needs the surface to differ

- **WHEN** one brand's version of a shared surface must differ from another's
- **THEN** the difference is supplied by the application as configuration or as
  a value handed to the surface
- **AND THEN** the slice stays one definition, and the brands stay legible
  against each other

### Requirement: Composition boundaries are checked automatically

The implementing repository MUST carry an automated check that fails when
application code reaches a product's backend outside the container, and MUST run
it in the same lane as its other repository-wide checks. A path that breaks the
rule on purpose MUST be named in that check with the reason it is exempt, and a
named exemption that no longer matches a real path MUST fail the check rather
than being ignored.

#### Scenario: Application code reaches a transport directly

- **WHEN** page, view or component code in an application names a transport
  client, issues its own request to a product's backend, or declares a schema
  for a backend's response
- **THEN** the repository's checks fail, naming the file and the rule
- **AND THEN** the failure is visible before review rather than during it

#### Scenario: A path is exempt on purpose

- **WHEN** a path must reach a backend outside the container
- **THEN** the check names that path with the reason it is allowed to
- **AND THEN** an exemption whose path no longer exists fails the check, so an
  exemption cannot outlive what it was written for

