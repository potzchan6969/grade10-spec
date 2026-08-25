## Purpose

What the unattended design-to-code audit must find and where it must look: the
rail that compares a shipped component's rendered values against the Figma node
it was converted from, long after whoever converted it has moved on. It governs
the rail's obligations, not any one component's appearance.

## ADDED Requirements

### Requirement: A drawn value the code omits is a finding

The audit SHALL report a finding where the Figma node states a visible fill or
a visible stroke and the audited element names no corresponding class, and
where the audited element names such a class and the node draws no
corresponding value. A property the design draws SHALL NOT pass unremarked
merely because the implementation is silent about it.

This applies to fill and stroke, which every frame and component states. It
SHALL NOT apply to a property a node is permitted to leave unstated, where
absence carries no meaning.

#### Scenario: The design fills a frame the code does not

- **GIVEN** a Figma node that draws a visible solid fill
- **WHEN** the audit runs against an element whose classes name no background
- **THEN** it reports a finding naming the value the node draws
- **AND** the run fails

#### Scenario: The code paints a fill the design does not

- **GIVEN** a Figma node that draws no visible fill
- **WHEN** the audit runs against an element whose classes name a background
- **THEN** it reports a finding
- **AND** the run fails

#### Scenario: A stroke on one side only

- **GIVEN** a Figma node that draws a visible stroke
- **WHEN** the audit runs against an element whose classes name no border
- **THEN** it reports a finding
- **AND** the run fails

#### Scenario: Neither draws the value

- **GIVEN** a Figma node that draws no visible fill
- **WHEN** the audit runs against an element whose classes name no background
- **THEN** it reports no finding for the fill

#### Scenario: A property the node may leave unstated

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

#### Scenario: A design-system component carries an audit table

- **GIVEN** a component directory in the design system with an audit table
- **WHEN** the unattended sweep runs
- **THEN** that component's elements are audited against their Figma nodes
- **AND** a drifted or omitted value fails the run

#### Scenario: A component with no audit table

- **WHEN** the sweep meets a component directory carrying no audit table
- **THEN** it names that directory as uncovered
- **AND** the run does not report it as passing

#### Scenario: The site chrome is covered

- **WHEN** the unattended sweep runs
- **THEN** the site header and site footer are among the components it audits

### Requirement: The audit reports what it did not check

The audit SHALL list every class it could not check alongside those it could,
and SHALL NOT summarize a run as passing without naming the unchecked classes.
A run in which nothing was checked SHALL NOT be reported the same way as a run
in which every checked value matched.

#### Scenario: A run with unchecked classes

- **WHEN** the audit checks some classes and cannot check others
- **THEN** the unchecked ones are named individually in the output
- **AND** the summary distinguishes what was verified from what was not

#### Scenario: Nothing could be checked

- **WHEN** no class in an audited element could be checked against its node
- **THEN** the output says so rather than reporting the element as matching
