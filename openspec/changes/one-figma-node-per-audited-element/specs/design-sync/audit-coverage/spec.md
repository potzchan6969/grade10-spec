## Feature set

- One node per audited element
  - Mapping agreement: a Code Connect template and an audit-table entry for the same element must name the same Figma node, so there is one answer to which frame it was converted from
  - Disagreement fails: two nodes named for one element fails the run and identifies both, the way a value mismatch already does
  - Declared vs undetected silence: an element only one side names a node for reads as uncovered, and a designer can tell a deliberate exemption from an unexplained gap
  - Counted, not just listed: every run states how many elements are agreed, deliberately uncovered, and accidentally uncovered, so a change in any of the three is visible run over run without reading the underlying list

## ADDED Requirements

### Requirement: A Code Connect template and an audit-table entry agree on one node

Where an audited element has both a Code Connect template and an audit-table
entry, the two SHALL name the same Figma node — one answer to which frame the
element was converted from.

Where they name different nodes, the audit SHALL fail the run and report a
finding naming the Figma file, the component's Figma name, and both node ids.

Where only one of the two names a node for an element, the element SHALL be
reported as uncovered rather than as passing or agreed, and the run SHALL NOT
fail on it. An audit-table entry MAY declare that its element has no Code
Connect counterpart by design; an element so declared SHALL be reported as
deliberately uncovered. An element for which only one side names a node, with
no such declaration, SHALL be reported as accidentally uncovered.

Every run SHALL report a count of elements in each of the three states —
agreed, deliberately uncovered, and accidentally uncovered.

#### Scenario: audit-coverage-SC-18 - Two mappings name different nodes for the same element

- **GIVEN** an audited element whose Code Connect template names one Figma
  node and whose audit-table entry names a different Figma node
- **WHEN** the audit runs
- **THEN** it reports a finding naming the Figma file, the component's Figma
  name, and both node ids
- **AND** the run fails

#### Scenario: audit-coverage-SC-19 - One mapping is silent with no declaration

- **GIVEN** an audited element for which only its Code Connect template names
  a Figma node, or only its audit-table entry does, and nothing declares that
  the silent side is expected to be silent
- **WHEN** the audit runs
- **THEN** the element is reported as accidentally uncovered
- **AND** it is not reported as passing or agreed
- **AND** the run does not fail on it

#### Scenario: audit-coverage-SC-20 - An element declares it has no Code Connect counterpart

- **GIVEN** an audit-table entry that declares its element has no Code
  Connect counterpart by design
- **WHEN** the audit runs
- **THEN** the element is reported as deliberately uncovered
- **AND** it is not reported as passing or agreed
- **AND** the run does not fail on it

#### Scenario: audit-coverage-SC-21 - The run counts each state

- **WHEN** an audit run completes
- **THEN** it reports how many elements are agreed, how many are deliberately
  uncovered, and how many are accidentally uncovered
- **AND** each count can be compared against a prior run's without reading
  the underlying list
