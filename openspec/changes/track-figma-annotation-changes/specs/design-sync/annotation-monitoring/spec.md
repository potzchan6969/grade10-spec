## Purpose

Provides a dependable trail from changed Figma annotation text to a repeatable,
ownership-aware engineering report without treating design prose as an
automatically accepted requirement.

## ADDED Requirements

### Requirement: Tracked annotation text is compared with a reviewed baseline

The monitor SHALL compare every annotation occurrence in each registered
design surface with a versioned baseline. A node MAY carry zero, one, or
multiple annotations. Each occurrence SHALL preserve its text, category, and
set of pinned properties; an annotation without text SHALL remain a trackable
occurrence. The monitor SHALL report an occurrence as added, changed, or removed
when its content or presence differs, while ignoring representation-only
differences such as line-ending style.

The baseline SHALL identify the containing Figma file and node, then identify
each accepted annotation occurrence with a baseline-local key that is stable
across text edits and array reordering. Each occurrence SHALL retain its own
reviewed association to an OpenSpec capability, change, or task group. A scan
SHALL NOT update the baseline.

#### Scenario: Annotation text changes

- **GIVEN** a tracked node has multiple baseline annotation occurrences
- **AND** one current occurrence has different text while its siblings are
  unchanged
- **WHEN** the monitor scans the node
- **THEN** it reports only that occurrence as changed
- **AND** it includes the previous and current text
- **AND** it does not report the unchanged sibling occurrences

#### Scenario: Annotation is added under a tracked design surface

- **GIVEN** a node within a registered design surface has an annotation
  occurrence that is absent from the baseline
- **WHEN** the monitor scans that surface
- **THEN** it reports that occurrence as added
- **AND** it does not add the occurrence to the baseline

#### Scenario: Annotation is removed from an existing node

- **GIVEN** the baseline contains multiple annotation occurrences for a node
  that still exists
- **AND** one baseline occurrence is absent while another remains current
- **WHEN** the monitor scans the node
- **THEN** it reports only the absent occurrence as removed
- **AND** it does not report the remaining occurrence

#### Scenario: Only line-ending representation differs

- **GIVEN** the current and baseline annotation text differ only by line-ending
  representation
- **WHEN** the monitor compares them
- **THEN** it reports no annotation change

#### Scenario: Multiple annotations are baselined independently

- **GIVEN** one tracked node has two annotations with different text or
  structure
- **WHEN** the baseline is reviewed
- **THEN** it records two annotation occurrences under that node
- **AND** each occurrence has its own baseline-local key and associations

#### Scenario: Property-only annotation is tracked

- **GIVEN** a tracked node has an annotation with pinned properties and no text
- **WHEN** the monitor scans the node
- **THEN** it treats that annotation as an occurrence
- **AND** it compares the category and pinned properties with the baseline

### Requirement: Multiple annotations are matched without guessing

The monitor SHALL compare annotations on the same node as an order-independent
multiset. It SHALL first match occurrences whose normalized text, category, and
canonical pinned-property set are equal. Among the remaining occurrences, it
SHALL classify one old and one current occurrence as changed only when they are
the unique unmatched pair with the same category and pinned-property set.

The monitor SHALL preserve the number of identical occurrences. When multiple
unmatched old and current occurrences share the same category and
pinned-property set, it SHALL NOT infer which texts correspond. It SHALL report
the unresolved old occurrences as removed, the unresolved current occurrences
as added, and the pairing as ambiguous. An occurrence whose category or pinned
properties change SHALL likewise be reported as removed plus added rather than
being paired by similar text.

#### Scenario: Annotation array order changes

- **GIVEN** a node has the same annotation occurrences as its baseline in a
  different array order
- **WHEN** the monitor scans the node
- **THEN** it reports no annotation change

#### Scenario: One of several structural matches changes text

- **GIVEN** exact matching cancels every unchanged annotation on a node
- **AND** one unmatched baseline occurrence and one unmatched current
  occurrence share the same category and pinned-property set
- **WHEN** the monitor compares the remaining occurrences
- **THEN** it reports that unique pair as one changed annotation
- **AND** it retains the baseline-local key and associations on the finding

#### Scenario: Duplicate annotation count decreases

- **GIVEN** the baseline contains two identical annotation occurrences on one
  node
- **AND** the current node contains one identical occurrence
- **WHEN** the monitor compares their multiplicity
- **THEN** it reports one occurrence as removed
- **AND** it does not collapse the baseline duplicates into one occurrence
- **AND** if the duplicate occurrences have different associations, it marks
  the removed occurrence's ownership as ambiguous

#### Scenario: Several unmatched siblings are ambiguous

- **GIVEN** two unmatched baseline occurrences and two unmatched current
  occurrences share the same category and pinned-property set
- **WHEN** the monitor cannot pair them uniquely
- **THEN** it reports the baseline occurrences as removed
- **AND** it reports the current occurrences as added
- **AND** it marks the pairing and any occurrence-specific ownership as
  ambiguous

#### Scenario: Annotation structure changes

- **GIVEN** an annotation retains similar text but changes category or pinned
  properties
- **WHEN** the monitor compares the node with its baseline
- **THEN** it reports the baseline occurrence as removed
- **AND** it reports the current occurrence as added
- **AND** it does not infer occurrence identity from similar text

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
and node link, annotation key when known, category and pinned properties,
change kind, previous and current text when applicable, ambiguity and
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
