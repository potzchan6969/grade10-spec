## MODIFIED Requirements

### Requirement: An address resolves to one surface

The site SHALL resolve every address to at most one surface. A surface SHALL
own every address beneath its own, so a deeper address answers as that
surface — unless a nested surface names that address, in which case the
nested one renders. Where more than one surface could own an address, the
deepest one naming it SHALL be the one that renders. An address under no
surface SHALL resolve to the not-found surface.

#### Scenario: A nested address answers as its surface

- **WHEN** a collector opens an address beneath a surface that no surface of
  its own names, such as an address beneath the store
- **THEN** that surface renders

#### Scenario: A nested surface renders for itself

- **WHEN** a collector opens an address a nested surface names, such as a
  mailed lot link beneath the auction
- **THEN** the nested surface renders, not the surface above it

#### Scenario: An unknown address resolves to not-found

- **WHEN** a collector opens an address under no surface the site answers
- **THEN** the not-found surface renders, naming the address that failed
