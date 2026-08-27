# design-sync/audit-coverage Specification

## Purpose
What the unattended design-to-code audit must find and where it must look: the
rail that compares a shipped component's rendered values against the Figma node
it was converted from, long after whoever converted it has moved on. It governs
the rail's obligations, not any one component's appearance.

## Feature set

- Omission as a finding
  - Unclaimed drawn values: a fill or stroke the design draws that no audited element names is reported
  - Per-node judgement: a node rendered as several elements is asked once, not once per element
  - Permitted silence: a property the node may leave unstated is reported as unchecked rather than as a finding
  - Both rails: the variant-set comparison reports omission on the same terms as the audit tables
- Sweep coverage
  - Every audited directory: the shared UI package and the design system are swept alike
  - Uncovered directories: a directory carrying no audit table reads as a gap rather than as passing
  - Site chrome: the site header and site footer are among the components the sweep audits
- Honest reporting
  - Named unchecked classes: every class the audit could not check is listed alongside those it could
  - Nothing checked: a run that verified nothing is not reported like one where every checked value matched
  - Coverage by component: the run names the components lacking coverage, not directories the other rail covers
- One rail per component
  - Variant-set ownership: a component whose counterpart defines variant axes is compared by that rail
  - Audit-table ownership: a component whose counterpart defines none is compared by an audit table
  - No double coverage: no component is covered by both, so none has two disagreeing sources of truth
- Run outcomes
  - Mismatch fails: a value that disagrees with Figma fails the run rather than being reported as advice
  - Advisory findings: a missing description, an unmapped axis option, or a counterpartless Figma component does not fail

## Requirements
### Requirement: A drawn value the code omits is a finding

The audit SHALL report a finding where the Figma node states a visible fill or
a visible stroke and no element audited against that node names a
corresponding class, and where an audited element names such a class and the
node draws no corresponding value. A property the design draws SHALL NOT pass
unremarked merely because the implementation is silent about it.

An implementation MAY render one node as several elements. The audit SHALL
therefore ask whether the node's value is claimed by any element audited
against it, not by each element separately, and SHALL report an unclaimed
value once per node rather than once per element.

This applies to fill and stroke, which every frame and component states. It
SHALL NOT apply to a property a node is permitted to leave unstated, where
absence carries no meaning.

#### Scenario: audit-coverage-SC-01 - The design fills a frame the code does not

- **GIVEN** a Figma node that draws a visible solid fill
- **WHEN** the audit runs and no element audited against that node names a background
- **THEN** it reports a finding naming the value the node draws
- **AND** the run fails

#### Scenario: audit-coverage-SC-02 - One node rendered as two elements

- **GIVEN** a Figma node that draws a visible stroke
- **AND** two elements audited against it, of which one names a border and the
  other names only layout
- **WHEN** the audit runs
- **THEN** it reports no unclaimed-stroke finding for that node

#### Scenario: audit-coverage-SC-03 - The code paints a fill the design does not

- **GIVEN** a Figma node that draws no visible fill
- **WHEN** the audit runs against an element whose classes name a background
- **THEN** it reports a finding
- **AND** the run fails

#### Scenario: audit-coverage-SC-04 - A stroke on one side only

- **GIVEN** a Figma node that draws a visible stroke
- **WHEN** the audit runs against an element whose classes name no border
- **THEN** it reports a finding
- **AND** the run fails

#### Scenario: audit-coverage-SC-05 - Neither draws the value

- **GIVEN** a Figma node that draws no visible fill
- **WHEN** the audit runs against an element whose classes name no background
- **THEN** it reports no finding for the fill

#### Scenario: audit-coverage-SC-06 - A property the node may leave unstated

- **WHEN** the audit meets a property the node is silent about and is permitted
  to be silent about
- **THEN** it reports the property as unchecked rather than as a finding
- **AND** the run does not fail on it

### Requirement: The sweep reaches every audited component

The unattended sweep SHALL audit every component directory that carries an
audit table, in the shared UI package and in the design system alike. A
component SHALL NOT be excluded from the sweep by which package it lives in.

A directory that carries no audit table SHALL be reported as uncovered rather
than as passing, so an unaudited component reads as a gap.

#### Scenario: audit-coverage-SC-07 - A design-system component carries an audit table

- **GIVEN** a component directory in the design system with an audit table
- **WHEN** the unattended sweep runs
- **THEN** that component's elements are audited against their Figma nodes
- **AND** a drifted or omitted value fails the run

#### Scenario: audit-coverage-SC-08 - A component with no audit table

- **WHEN** the sweep meets a component directory carrying no audit table
- **THEN** it names that directory as uncovered
- **AND** the run does not report it as passing

#### Scenario: audit-coverage-SC-09 - The site chrome is covered

- **WHEN** the unattended sweep runs
- **THEN** the site header and site footer are among the components it audits

### Requirement: The audit reports what it did not check

The audit SHALL list every class it could not check alongside those it could,
and SHALL NOT summarize a run as passing without naming the unchecked classes.
A run in which nothing was checked SHALL NOT be reported the same way as a run
in which every checked value matched.

#### Scenario: audit-coverage-SC-10 - A run with unchecked classes

- **WHEN** the audit checks some classes and cannot check others
- **THEN** the unchecked ones are named individually in the output
- **AND** the summary distinguishes what was verified from what was not

#### Scenario: audit-coverage-SC-11 - Nothing could be checked

- **WHEN** no class in an audited element could be checked against its node
- **THEN** the output says so rather than reporting the element as matching

### Requirement: A component with no variant axes is still compared

Every design-system component that has a Figma counterpart SHALL have its
rendered values compared against that counterpart by some rail, whether or not
the counterpart defines variant axes.

Where a component defines variant axes, the variant-set comparison SHALL own
it. Where it defines none, an audit table SHALL own it. A component SHALL NOT
be covered by both, so that one component never has two disagreeing sources of
truth.

#### Scenario: audit-coverage-SC-12 - A standalone component drifts

- **GIVEN** a design-system component whose Figma counterpart defines no
  variant axes
- **WHEN** a value it renders stops matching that counterpart
- **THEN** the unattended run reports it
- **AND** the run fails

#### Scenario: audit-coverage-SC-13 - A component with variant axes

- **GIVEN** a design-system component whose Figma counterpart defines variant
  axes
- **WHEN** the unattended run executes
- **THEN** the variant-set comparison reports on it
- **AND** no audit table is required for it

#### Scenario: audit-coverage-SC-14 - Coverage is reported by component

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

#### Scenario: audit-coverage-SC-15 - A variant's fill stops matching

- **GIVEN** a component whose Figma variant specifies one fill and whose code
  draws another
- **WHEN** the unattended run executes
- **THEN** it reports the disagreement, naming both values
- **AND** the run fails

#### Scenario: audit-coverage-SC-16 - A hygiene finding

- **WHEN** the run finds a component with no description, an axis option with
  no mapping, or a Figma component with no code counterpart
- **THEN** it reports the finding
- **AND** the run does not fail on it

### Requirement: Omission is detected wherever values are compared

The variant-set comparison SHALL report a fill or a stroke a Figma variant
draws that no class in the component's configuration names, on the same terms
as the audit tables: a property the design draws and the code omits is a
finding, not silence.

#### Scenario: audit-coverage-SC-17 - A variant fills what the code never names

- **GIVEN** a Figma variant that draws a visible fill
- **AND** a component configuration whose classes for that variant name no
  background
- **WHEN** the unattended run executes
- **THEN** it reports a finding naming the value the variant draws
- **AND** the run fails

