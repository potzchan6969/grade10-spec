## ADDED Requirements

### Requirement: An operator-only client port lives in the operator-facing package

A client port that a collector-facing surface cannot satisfy MUST be declared
by the product's operator-facing frontend package, and the slices that resolve
it MUST live there. A frontend package's core module MUST bind every port it
declares; it MUST NOT declare a port optional so that one set of consumers may
omit it. A package a collector-facing application composes therefore declares
no port that application cannot supply, and the published-list rule stays
satisfiable for every package a composition root loads.

#### Scenario: A product gains a slice only an operator may reach

- **WHEN** a product adds a feature slice whose client port only an operator's
  client satisfies
- **THEN** the slice and its port belong to that product's operator-facing
  frontend package
- **AND THEN** the collector-facing package for that product declares neither
  the port nor the slice

#### Scenario: A collector-facing application composes the product

- **WHEN** an application whose surfaces serve collectors composes a product
  that also has operator-only slices
- **THEN** it installs only that product's collector-facing package
- **AND THEN** every port that package's core module declares is one the
  application supplies, and no token is left unbound

#### Scenario: A core module is offered a port only some consumers can supply

- **WHEN** a frontend package's core module would have to accept a client that
  only some of its consumers can build
- **THEN** the port moves to the operator-facing package rather than becoming
  an optional dependency of the shared one
- **AND THEN** no consumer distinguishes itself by which optional clients it
  passed

#### Scenario: An operator-facing package is composed by a panel

- **WHEN** an application composes a product's operator-facing package
- **THEN** it installs that package's core-module factory with the operator
  client, and loads that package's published list
- **AND THEN** the same client may satisfy the collector-facing package's port
  as well, without either package naming the other
