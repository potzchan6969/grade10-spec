## MODIFIED Requirements

### Requirement: An address answers with its true status

An address nested under a public surface SHALL answer with status 200 and
that surface's identity, unless the surface itself refuses it: a surface whose
address names something the site holds SHALL answer 404 when it holds no such
thing. An address the site does not answer SHALL return status 404, while
still showing the site's not-found surface to a collector.

#### Scenario: A nested address belongs to its surface

- **WHEN** an address beneath the auction — such as a mailed lot link — is
  fetched
- **THEN** the response has status 200 and carries the auction's identity

#### Scenario: A surface refuses an address of its own

- **WHEN** an address beneath a surface that names one thing is fetched, and
  the site holds no such thing
- **THEN** the response has status 404
- **AND** a collector opening it still sees the site's not-found surface

#### Scenario: An unknown address is refused honestly

- **WHEN** an address under no surface the site answers is fetched
- **THEN** the response has status 404
- **AND** a collector opening it still sees the site's not-found surface
