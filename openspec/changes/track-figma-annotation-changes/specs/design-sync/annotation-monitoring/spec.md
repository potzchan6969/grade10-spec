## Purpose

Provides a dependable trail from changed Figma annotation text to a repeatable,
ownership-aware engineering report without treating design prose as an
automatically accepted requirement.

## ADDED Requirements

### Requirement: Tracked annotation text is compared with a reviewed baseline

The monitor SHALL compare every annotation in each registered design surface
with a versioned baseline. It SHALL report an annotation as added, changed, or
removed when its text or presence differs, while ignoring representation-only
differences such as line-ending style.

The baseline SHALL identify annotations by their Figma file and node identity
and SHALL retain any reviewed association to an OpenSpec capability, change,
or task group. A scan SHALL NOT update the baseline.

#### Scenario: Annotation text changes

- **GIVEN** a tracked node whose current annotation text differs from its
  baseline text
- **WHEN** the monitor scans the node
- **THEN** it reports the annotation as changed
- **AND** it includes the previous and current text

#### Scenario: Annotation is added under a tracked design surface

- **GIVEN** a node within a registered design surface has an annotation that is
  absent from the baseline
- **WHEN** the monitor scans that surface
- **THEN** it reports the annotation as added
- **AND** it does not add the annotation to the baseline

#### Scenario: Annotation is removed from an existing node

- **GIVEN** the baseline contains an annotation for a node that still exists
- **AND** the current node has no annotation
- **WHEN** the monitor scans the node
- **THEN** it reports the annotation as removed

#### Scenario: Only line-ending representation differs

- **GIVEN** the current and baseline annotation text differ only by line-ending
  representation
- **WHEN** the monitor compares them
- **THEN** it reports no annotation change

### Requirement: Missing evidence never appears as a clean scan

The monitor SHALL distinguish a verified no-change result from a run that
could not read all registered design surfaces. An inaccessible file, missing
credential, insufficient permission, failed request, malformed response, or
unresolvable tracked node SHALL make the affected evidence blocked and the run
unsuccessful.

A baseline node that cannot be read SHALL NOT be reported as an annotation
removal. An annotation discovered without an exact project or OpenSpec
association SHALL be reported as untracked rather than omitted.

#### Scenario: Figma cannot be read

- **WHEN** the monitor cannot read a registered Figma file
- **THEN** it reports the file and reason as blocked
- **AND** it does not report the run as having no annotation changes
- **AND** the run is unsuccessful

#### Scenario: A baseline node no longer resolves

- **GIVEN** an annotation baseline entry names a node that cannot be resolved
- **WHEN** the monitor scans its file
- **THEN** it reports the node as blocked or orphaned
- **AND** it does not classify the annotation as removed

#### Scenario: An annotation has no project association

- **GIVEN** a newly discovered annotation has no exact association to a tracked
  component, capability, change, or task group
- **WHEN** the monitor reports it
- **THEN** the report classifies it as untracked
- **AND** the annotation remains visible for triage

### Requirement: Annotation changes are traced only through exact evidence

The report SHALL associate a finding with project work only through an exact
recorded relationship: a reviewed baseline association, an exact Figma node or
ancestor referenced by an active OpenSpec artifact, or an exact registered
component association. It SHALL name the evidence used for each association.

The report SHALL mark multiple or incomplete matches as ambiguous and SHALL
NOT infer a match from prose similarity, a Figma editor, a Git author, or an
implementation author. It MAY recommend that a finding be handled as a
requirement, UI state, technical note, visual note, or no-impact clarification,
but SHALL NOT modify OpenSpec or implementation files.

#### Scenario: Active change references the exact node

- **GIVEN** an active OpenSpec change references the finding's exact Figma node
  or a registered ancestor
- **WHEN** the report traces the finding
- **THEN** it names that change and the matching artifact as association
  evidence

#### Scenario: Two active changes match exactly

- **GIVEN** two active changes contain exact associations for the same finding
- **WHEN** the report traces the finding
- **THEN** it marks the ownership association as ambiguous
- **AND** it names both matches for manual triage

#### Scenario: Only similar words are found

- **GIVEN** an annotation resembles text in an OpenSpec artifact but has no
  exact recorded association
- **WHEN** the report traces the finding
- **THEN** it does not claim that artifact owns the finding

### Requirement: Personal grouping follows OpenSpec task ownership

The report SHALL resolve the current user's normalized OpenSpec handle through
the same identity sources and precedence as the project's planning workflow.
It SHALL use explicit task-group owner claims, not authorship, as the primary
signal for personal responsibility.

Findings SHALL be grouped in this precedence order: `My assigned work` when an
exact matching task group is owned by the current user; `Owned by others` when
an exact matching task group is owned by another handle; `Authored by me` when
no exact task-group owner applies and the associated change proposal was
authored by the current user; and `Unassigned or untracked` otherwise. An
ambiguous owner SHALL remain in `Unassigned or untracked` and name every
candidate.

#### Scenario: Matching task group is assigned to the current user

- **GIVEN** a finding has one exact matching OpenSpec task group
- **AND** that group is owned by the current user's normalized handle
- **WHEN** the personal report is generated
- **THEN** the finding appears under `My assigned work`

#### Scenario: Proposal author does not override another owner

- **GIVEN** the current user authored an associated proposal
- **AND** the exact matching task group is owned by another handle
- **WHEN** the personal report is generated
- **THEN** the finding appears under `Owned by others`
- **AND** proposal authorship does not make it the current user's assignment

#### Scenario: Authored change has no matching claimed group

- **GIVEN** a finding maps exactly to a change authored by the current user
- **AND** no exact matching task group has an owner
- **WHEN** the personal report is generated
- **THEN** the finding appears under `Authored by me`

#### Scenario: Current identity cannot be resolved

- **WHEN** the planning workflow cannot resolve a current-user handle
- **THEN** the report still includes every finding
- **AND** it states that personal ownership grouping could not be determined
- **AND** it does not guess an identity

### Requirement: Reports are concise, traceable, read-only, and harness-neutral

The project SHALL provide one manually runnable workflow skill through its
supported agent-platform parity mechanism. Every supported AI model or harness
SHALL receive the same report contract from that skill without requiring a
harness-specific project workflow. Each finding SHALL include its Figma file
and node link, change kind, previous and current text when applicable,
association evidence, ownership group, and a recommended next action.

The default report SHALL show `My assigned work`, `Authored by me`, and
`Unassigned or untracked` in full, summarize `Owned by others`, and preserve a
way to inspect that summarized detail. A verified scan with no findings SHALL
say that no tracked annotations changed. The workflow SHALL perform no
external write.

#### Scenario: Actionable changes are found

- **WHEN** the workflow skill finds one or more annotation changes
- **THEN** the invoking agent session reports them in ownership groups
- **AND** each finding contains enough evidence to open the Figma node and the
  associated OpenSpec work

#### Scenario: No tracked annotations changed

- **GIVEN** every registered design surface was read successfully
- **AND** no annotation differs from the reviewed baseline
- **WHEN** the report is generated
- **THEN** it states that no tracked annotations changed
- **AND** it does not emit an empty actionable section

#### Scenario: Work owned by others is present

- **WHEN** findings map to task groups owned by other handles
- **THEN** the default report summarizes their count and owners
- **AND** the underlying findings remain available for inspection

#### Scenario: A supported harness invokes the workflow skill

- **GIVEN** the workflow skill is available through the project's agent-platform
  parity mechanism
- **WHEN** a supported AI harness invokes it
- **THEN** the invoking session receives the report contract
- **AND** no OpenSpec artifact, baseline, GitHub record, or external message is
  created or changed
