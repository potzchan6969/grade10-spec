## ADDED Requirements

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
