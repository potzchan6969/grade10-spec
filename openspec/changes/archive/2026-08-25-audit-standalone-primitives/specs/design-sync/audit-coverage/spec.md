## ADDED Requirements

### Requirement: A component with no variant axes is still compared

Every design-system component that has a Figma counterpart SHALL have its
rendered values compared against that counterpart by some rail, whether or not
the counterpart defines variant axes.

Where a component defines variant axes, the variant-set comparison SHALL own
it. Where it defines none, an audit table SHALL own it. A component SHALL NOT
be covered by both, so that one component never has two disagreeing sources of
truth.

#### Scenario: A standalone component drifts

- **GIVEN** a design-system component whose Figma counterpart defines no
  variant axes
- **WHEN** a value it renders stops matching that counterpart
- **THEN** the unattended run reports it
- **AND** the run fails

#### Scenario: A component with variant axes

- **GIVEN** a design-system component whose Figma counterpart defines variant
  axes
- **WHEN** the unattended run executes
- **THEN** the variant-set comparison reports on it
- **AND** no audit table is required for it

#### Scenario: Coverage is reported by component

- **WHEN** the run names what it did not audit
- **THEN** it names the components lacking coverage
- **AND** does not report a directory as uncovered whose components are
  covered by the other rail

### Requirement: A value mismatch fails the run

A rail that compares rendered values against Figma SHALL fail the run when a
value disagrees, in the variant-set comparison as in the audit tables. A value
disagreement SHALL NOT be reported only as advice.

A finding that does not assert the code draws the wrong thing — a missing
description, an unmapped axis option, a Figma component with no code
counterpart — SHALL remain advisory and SHALL NOT fail the run.

#### Scenario: A variant's fill stops matching

- **GIVEN** a component whose Figma variant specifies one fill and whose code
  draws another
- **WHEN** the unattended run executes
- **THEN** it reports the disagreement, naming both values
- **AND** the run fails

#### Scenario: A hygiene finding

- **WHEN** the run finds a component with no description, an axis option with
  no mapping, or a Figma component with no code counterpart
- **THEN** it reports the finding
- **AND** the run does not fail on it

### Requirement: Omission is detected wherever values are compared

The variant-set comparison SHALL report a fill or a stroke a Figma variant
draws that no class in the component's configuration names, on the same terms
as the audit tables: a property the design draws and the code omits is a
finding, not silence.

#### Scenario: A variant fills what the code never names

- **GIVEN** a Figma variant that draws a visible fill
- **AND** a component configuration whose classes for that variant name no
  background
- **WHEN** the unattended run executes
- **THEN** it reports a finding naming the value the variant draws
- **AND** the run fails
