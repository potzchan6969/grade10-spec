# shared/design-sync/annotation-verification Specification

## Purpose

Ensures selected Figma annotation findings are checked against implementation
evidence and routed into reviewed engineering work before reconciliation can
hide an undelivered requirement.

## Feature set

- Impact review
  - Evidence matrix: shows what behavior, code, tests, and runtime prove for every selected finding.
  - Explicit outcomes: distinguishes implemented, no-impact, covered, gap, and blocked findings.
  - Repository scope: checks implementation only in the repository that owns the selected annotation surface.
- Planning handoff
  - Existing-work reuse: attaches findings to exact settled capabilities, changes, or task groups before proposing work.
  - Gap grouping: combines related findings into capability-sized planning work.
  - Lane routing: uses the requirements-only or delivery-planning workflow after confirmation.
- Safe continuation
  - Separate consent: keeps review, planning, acceptance, commit, and implementation permissions independent.
  - Fresh evidence: requires a new annotation observation after planning before gap findings can be accepted.

## Requirements

### Requirement: Every selected finding receives an implementation-impact review

After finding selection and before acceptance, the workflow SHALL review every
selected finding against the implementation repository that owns its annotation
scope. The review SHALL remain read-only with respect to implementation and
SHALL record the expected behavior, exact implementation evidence, focused test
evidence, runtime evidence, and one impact outcome for each selected finding.

The review SHALL be pinned to the selected report's observation digest and
SHALL represent every selected finding exactly once. A product-scope finding
SHALL use `grade10` implementation evidence. A spec-scope finding SHALL use
`grade10-spec` implementation evidence. Evidence from the other repository is
dependency context only and SHALL NOT prove the owning implementation complete.

#### Scenario: shared-design-sync-annotation-verification-SC-01 - Selected behavior is fully implemented

- **GIVEN** a selected finding's expected behavior is present in its owning repository
- **AND** the finding has one exact existing association
- **AND** a focused test has been executed successfully
- **AND** runtime evidence demonstrates the behavior
- **WHEN** the implementation-impact review is completed
- **THEN** it records the exact implementation location, test command and result, and runtime observation
- **AND** it classifies the finding as `implemented`

#### Scenario: shared-design-sync-annotation-verification-SC-02 - Claimed implementation lacks evidence

- **GIVEN** a selected finding has code or test evidence but not the complete implementation, focused-test, and runtime evidence set
- **WHEN** the workflow validates the implementation-impact review
- **THEN** it refuses an `implemented` outcome
- **AND** it keeps the finding visible as `gap` or `blocked`

#### Scenario: shared-design-sync-annotation-verification-SC-03 - Review stays within the owning repository

- **GIVEN** a selected finding belongs to one registered annotation scope
- **WHEN** its implementation is reviewed
- **THEN** the workflow uses the repository assigned to that scope as the implementation authority
- **AND** it does not infer completion from similarly named code in another repository

#### Scenario: shared-design-sync-annotation-verification-SC-04 - Selection and review digests disagree

- **GIVEN** an impact review names a different observation digest from the selected report
- **WHEN** the workflow validates the review
- **THEN** it rejects the review as stale
- **AND** it performs no annotation acceptance or planning write

### Requirement: Impact outcomes have evidence-specific meanings

Every selected finding SHALL have exactly one outcome from the following set:

| Outcome | Required meaning |
| --- | --- |
| `implemented` | Expected behavior, an exact existing association, exact implementation location, a successful focused test, and runtime evidence are all present. |
| `no-impact` | A specific non-empty reason explains why no implementation or planning change is needed. |
| `covered` | One exact active change or change plus task group already plans the missing behavior. |
| `gap` | The expected behavior is not fully implemented and needs new or expanded planned work. |
| `blocked` | Missing, ambiguous, inaccessible, or conflicting evidence prevents a reliable decision. |

The workflow SHALL NOT derive an outcome from annotation prose similarity,
file-name similarity, Git authorship, or a test unrelated to the expected
behavior. `gap` and `blocked` findings SHALL NOT be eligible for annotation
acceptance in the current run.

#### Scenario: shared-design-sync-annotation-verification-SC-05 - Active work exactly covers a finding

- **GIVEN** one active change or task group exactly plans a selected finding's missing behavior
- **WHEN** the workflow classifies its impact
- **THEN** it records `covered` with that exact association
- **AND** it does not propose a duplicate OpenSpec change

#### Scenario: shared-design-sync-annotation-verification-SC-06 - Finding has no implementation impact

- **GIVEN** a selected finding does not require code, requirement, or delivery-plan changes
- **WHEN** the workflow classifies its impact
- **THEN** it requires a specific non-empty reason before recording `no-impact`
- **AND** it does not infer the reason from the annotation body

#### Scenario: shared-design-sync-annotation-verification-SC-07 - Finding exposes an implementation gap

- **GIVEN** the expected behavior is absent or only partially implemented
- **WHEN** the workflow classifies its impact
- **THEN** it records `gap` with the missing behavior and available evidence
- **AND** it excludes the finding from the current acceptance set

#### Scenario: shared-design-sync-annotation-verification-SC-08 - Evidence remains ambiguous

- **GIVEN** the workflow cannot establish one reliable implementation outcome
- **WHEN** review completes
- **THEN** it records `blocked` with the unresolved evidence
- **AND** it does not create planning artifacts or accept the finding

### Requirement: Gaps route through existing planning workflows

Before proposing a new change, the workflow SHALL inspect the current planning
board and exact OpenSpec evidence for work that already covers each gap. It
SHALL group remaining gaps by coherent capability and delivery outcome rather
than by annotation count.

For every proposed group, the workflow SHALL preview the selected finding IDs,
expected behavior, capability path, proposed change name, how far the change is
to be planned, affected repositories, and non-goals. It SHALL require explicit
confirmation before starting planning. It SHALL hand the group to
`grade10-planning`, stopping at the requirements when that is where the work
ends and continuing to the delivery plan when it does not. The planning
workflow SHALL retain its own validation, commit, push, merge, and
implementation gates.

#### Scenario: shared-design-sync-annotation-verification-SC-09 - Active task group already owns the gap

- **GIVEN** an exact active change and task group already plan the missing behavior
- **WHEN** the workflow prepares the planning handoff
- **THEN** it records `covered` with that task group
- **AND** it does not create another change

#### Scenario: shared-design-sync-annotation-verification-SC-10 - Related gaps form one planning change

- **GIVEN** several selected findings describe one capability and delivery outcome
- **AND** no exact existing work covers them
- **WHEN** the workflow prepares the planning handoff
- **THEN** it proposes one grouped change containing every related finding ID
- **AND** it does not create one change per annotation

#### Scenario: shared-design-sync-annotation-verification-SC-11 - Delivery planning is requested

- **GIVEN** a confirmed gap is intended to proceed toward implementation
- **WHEN** the developer confirms the planning preview
- **THEN** the workflow routes the grouped evidence to `grade10-planning`
- **AND** the resulting change carries proposal, specs, journeys, tech design, and tasks

#### Scenario: shared-design-sync-annotation-verification-SC-12 - Requirements-only planning is requested

- **GIVEN** a confirmed gap is intended to stop after its requirements are settled
- **WHEN** the developer confirms the planning preview
- **THEN** the workflow routes the grouped evidence to `grade10-planning`
- **AND** the resulting change stops at its specs and journeys, inventing no delivery tasks

#### Scenario: shared-design-sync-annotation-verification-SC-13 - Developer declines planning

- **GIVEN** the workflow has previewed one or more planning groups
- **WHEN** the developer declines the planning write
- **THEN** no planning artifact is created or modified
- **AND** every gap remains visible and unaccepted

### Requirement: Planning and annotation acceptance are separate transactions

The workflow SHALL keep planning writes separate from annotation acceptance.
Only eligible `implemented`, `no-impact`, or `covered` findings SHALL be
allowed to continue to the existing decision preview and acceptance gates.
`gap` and `blocked` findings SHALL remain drift.

When confirmed planning starts for a gap, the workflow SHALL end that gap's
current reconciliation path without changing its accepted baseline metadata.
After the planning artifacts exist, the workflow SHALL require a fresh live
observation, report, selection, and impact review before the gap can receive an
exact association and become eligible for acceptance. Planning failure or
partial planning SHALL leave the annotation baseline unchanged.

#### Scenario: shared-design-sync-annotation-verification-SC-14 - Mixed outcomes continue safely

- **GIVEN** one selection contains acceptance-eligible findings and gaps
- **WHEN** the impact review completes
- **THEN** only the eligible findings continue to the existing acceptance preview
- **AND** every gap remains visible for planning and a later reconciliation

#### Scenario: shared-design-sync-annotation-verification-SC-15 - Planning completes for a gap

- **GIVEN** confirmed planning artifacts now describe a previously selected gap
- **WHEN** the developer returns to annotation reconciliation
- **THEN** the workflow takes a fresh live observation and generates new stable findings
- **AND** it requires a new selection and impact review before accepting an association

#### Scenario: shared-design-sync-annotation-verification-SC-16 - Planning fails or remains incomplete

- **GIVEN** a planning workflow fails validation or stops before its required artifacts are complete
- **WHEN** control returns to annotation reconciliation
- **THEN** the original gap remains unaccepted
- **AND** the annotation baseline and unrelated OpenSpec files remain unchanged

#### Scenario: shared-design-sync-annotation-verification-SC-17 - Permissions remain independent

- **WHEN** a developer confirms implementation review or planning
- **THEN** that confirmation does not authorize annotation acceptance, a Git commit, a push, a merge, task claiming, or implementation
- **AND** each later action retains its existing explicit gate
