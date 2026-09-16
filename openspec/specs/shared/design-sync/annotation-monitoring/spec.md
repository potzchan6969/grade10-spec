# shared/design-sync/annotation-monitoring Specification

## Purpose

Provides one category-aware, reviewable workflow that traces live Figma
annotation drift to registered engineering work and reconciles only changes a
developer explicitly accepts.

## Feature set

- Live observation
  - Registered surfaces only: reads annotations under registered engineering roots and their descendants, so exploratory areas never enter an engineering report.
  - One category catalog: resolves every occurrence's category locally from a single per-file catalog read rather than a request per annotation.
  - Temporary evidence: the observation is digest-pinned and discarded, so no current-state file is written to either repository.
- Occurrence comparison
  - Order-independent multiset: annotations on one node compare as a set, so array reordering is not drift.
  - Unique-pair matching: an occurrence counts as changed only when the remaining pair is unambiguous, so keys are never transferred by guess.
  - Stable finding ids: every finding carries an id a selection, a task, or a review comment can name.
- Honest evidence
  - Blocked over clean: unreadable, malformed, or unresolved evidence fails the run rather than passing as no drift.
  - Partial roots: an unresolved registered root is skipped and reported while its siblings in the same file continue.
  - Orphaned baseline: an accepted node that no longer resolves stays reviewable instead of disappearing.
- Tracing and ownership
  - Exact association only: a finding attaches to work through an exact node, registered ancestor, or component registration, and the report names the evidence.
  - Ownership groups: findings sort by explicit task-group claim before authorship, so the developer sees their own work first.
  - No guessed identity: prose similarity, a Figma editor, and a Git author establish neither association nor owner.
- Reporting and selection
  - One guided skill: observation, report, selection, reconciliation, verification, and optional commit are one workflow whose report phase is read-only.
  - Complete bodies: each finding shows the whole previous and current annotation, untruncated and readable as chat markdown.
  - Subset selection: the developer picks finding ids, and everything unpicked stays visible as drift.
- Deliberate reconciliation
  - Confirmed decisions: every accepted occurrence carries one exact association form or a stated no-impact reason.
  - Atomic writes: the baseline and every related OpenSpec edit apply together or not at all.
  - Stale selection refused: a selection produced from an earlier observation cannot be applied to a later one.
- Verification and commit
  - Rerun against the pin: the comparison repeats on the same observation and names the drift that remains.
  - Separate commit consent: the commit is its own confirmation and stages only the files in the shown diff.
  - Nothing leaves the repository: no push, no submodule move, no pull request, and no Figma write.
- Retired automation
  - Annotation CI removed: the daily and pull-request annotation scan and its ephemeral snapshot file are gone.
  - Other checks intact: component, rendered-value, token, audit, and Code Connect checks keep their purpose and triggers.
  - One path: the deprecated read-only monitor is not offered beside the reconciliation workflow.

## Requirements

### Requirement: Live observations are complete, scoped, and category-aware

The workflow SHALL read annotations only from registered engineering surfaces
and their descendants. It SHALL use a Figma Plugin API or equivalent MCP
capability that exposes annotation category IDs. For each Figma file, it SHALL
read the category catalog once and resolve annotation category IDs locally; it
SHALL NOT issue one category request per annotation.

The normalized live observation SHALL include the file, registered root, exact
node and ancestor evidence, Figma URL, annotation text, category ID, resolved
category label, category color and preset status when available, and canonical
pinned properties. A null category ID SHALL remain a valid uncategorized
annotation. A non-null category ID that cannot be resolved from the file's
catalog SHALL block the observation.

The observation SHALL be temporary and SHALL carry a digest that pins the
evidence used by reporting, acceptance, and verification. It SHALL NOT create
or update an `annotation-current.json` or another current-state file in either
repository.

#### Scenario: shared-design-sync-annotation-monitoring-SC-01 - One category catalog resolves many annotations
**Serves:** Live observation - one category catalog resolves many annotations

- **GIVEN** a registered Figma file contains 127 annotation occurrences
- **WHEN** the workflow observes the file
- **THEN** it retrieves the file's category catalog once
- **AND** it resolves every occurrence's category locally by category ID
- **AND** it does not make 127 additional category requests

#### Scenario: shared-design-sync-annotation-monitoring-SC-02 - Content and Interaction labels are reported
**Serves:** Live observation - content and Interaction labels are reported

- **GIVEN** two current annotations refer to category IDs whose catalog labels
  are `Content` and `Interaction`
- **WHEN** the live observation is normalized
- **THEN** each occurrence retains its category ID
- **AND** each occurrence reports the corresponding human-readable label

#### Scenario: shared-design-sync-annotation-monitoring-SC-03 - Annotation has no category
**Serves:** Live observation - annotation has no category

- **GIVEN** a current annotation has no category ID
- **WHEN** the live observation is normalized
- **THEN** the occurrence remains visible as uncategorized
- **AND** the observation is not blocked for that reason

#### Scenario: shared-design-sync-annotation-monitoring-SC-04 - Category evidence is incomplete
**Serves:** Live observation - category evidence is incomplete

- **GIVEN** a current annotation has a non-null category ID
- **AND** the category ID is absent from the retrieved file catalog
- **WHEN** the workflow validates the observation
- **THEN** it reports the file and category ID as blocked evidence
- **AND** it performs no repository write

#### Scenario: shared-design-sync-annotation-monitoring-SC-05 - Annotation is outside registered surfaces
**Serves:** Live observation - annotation is outside registered surfaces

- **GIVEN** an annotation exists only in an exploratory area outside every
  registered engineering surface
- **WHEN** the workflow observes the file
- **THEN** it does not include that annotation in the engineering report

### Requirement: Annotation occurrences are compared with accepted engineering state

The workflow SHALL compare the temporary live observation with the reviewed
schema-version-2 annotation baseline. A node MAY carry zero, one, or multiple
annotation occurrences. The baseline SHALL give each accepted occurrence a
baseline-local `annotationKey` that is stable across text edits and Figma array
reordering. It SHALL store the authoritative category ID and canonical pinned
properties for the occurrence; resolved category labels and colors SHALL be
live presentation evidence rather than accepted identity.

Comparison SHALL treat annotations on one node as an order-independent
multiset. It SHALL cancel exact canonical matches first. It SHALL classify one
remaining baseline occurrence and one remaining current occurrence as changed
only when they are the unique unmatched pair with the same category ID and
pinned-property set. It SHALL preserve duplicate multiplicity and SHALL NOT
pair ambiguous occurrences by array position, text similarity, or edit
distance.

Every finding SHALL have a stable ID. A matched finding SHALL retain its
baseline key. An unmatched current occurrence SHALL use its canonical
fingerprint and multiplicity ordinal after canonical sorting, not its raw Figma
array position.

#### Scenario: shared-design-sync-annotation-monitoring-SC-06 - Annotation array order changes
**Serves:** Live observation - annotation array order changes

- **GIVEN** a node has the same annotation occurrences as its baseline in a
  different array order
- **WHEN** the workflow compares them
- **THEN** it reports no drift

#### Scenario: shared-design-sync-annotation-monitoring-SC-07 - One of several annotations changes text
**Serves:** Live observation - one of several annotations changes text

- **GIVEN** exact matching cancels every unchanged occurrence on a node
- **AND** one baseline occurrence and one current occurrence remain with the
  same category ID and pinned properties
- **WHEN** the workflow compares the remaining pair
- **THEN** it reports one changed finding
- **AND** the finding retains the accepted annotation key and associations

#### Scenario: shared-design-sync-annotation-monitoring-SC-08 - Duplicate multiplicity decreases
**Serves:** Live observation - duplicate multiplicity decreases

- **GIVEN** the baseline has two identical occurrences on one node
- **AND** the live observation has one identical occurrence
- **WHEN** the workflow compares their multiplicity
- **THEN** it reports one removal
- **AND** it does not collapse the accepted duplicates

#### Scenario: shared-design-sync-annotation-monitoring-SC-09 - Several unmatched siblings are ambiguous
**Serves:** Live observation - several unmatched siblings are ambiguous

- **GIVEN** several unmatched baseline and current occurrences share the same
  category ID and pinned-property set
- **WHEN** the workflow cannot pair them uniquely
- **THEN** it reports the old occurrences as removals and the new occurrences
  as additions
- **AND** it marks the relationship ambiguous
- **AND** it does not transfer keys or associations by guess

#### Scenario: shared-design-sync-annotation-monitoring-SC-10 - Annotation structure changes
**Serves:** Live observation - annotation structure changes

- **GIVEN** an annotation keeps similar text but changes category ID or pinned
  properties
- **WHEN** the workflow compares it with the baseline
- **THEN** it reports a removal and an addition
- **AND** it does not infer that the two occurrences are identical

#### Scenario: shared-design-sync-annotation-monitoring-SC-11 - Only line-ending representation differs
**Serves:** Live observation - only line-ending representation differs

- **GIVEN** live and accepted annotation text differ only by line-ending style
- **WHEN** the workflow compares them
- **THEN** it reports no drift

### Requirement: Missing or orphaned evidence never appears clean

The workflow SHALL distinguish verified no drift from evidence it could not
read or validate. An inaccessible file, missing tool capability, insufficient
permission, failed request, malformed response, or unresolved category SHALL
make the affected evidence blocked and the run unsuccessful. An unresolved
registered root SHALL be skipped when at least one other registered root in
the same file resolves; the skipped root SHALL be reported at the end of the
run and SHALL NOT block acceptance of other findings. If every registered
root in the file is unresolved, the observation SHALL be blocked. A baseline
node that no longer resolves SHALL be reported as an orphaned finding in
complete, reviewable drift: it SHALL NOT make the run blocked or clean, and
it SHALL remain selectable only with an explicit removal or replacement
decision. Blocked/no-write is reserved for incomplete or malformed evidence.

#### Scenario: shared-design-sync-annotation-monitoring-SC-12 - Figma Plugin API access is unavailable
**Serves:** Honest evidence - figma Plugin API access is unavailable

- **WHEN** the invoking harness cannot provide the required Figma Plugin API or
  equivalent MCP evidence
- **THEN** the workflow reports the observation as blocked
- **AND** it does not claim the baseline is current
- **AND** it performs no repository write

#### Scenario: shared-design-sync-annotation-monitoring-SC-13 - Unresolved registered root is skipped
**Serves:** Honest evidence - unresolved registered root is skipped

- **GIVEN** a registered Figma file has more than one registered root
- **AND** one registered root cannot be resolved
- **AND** at least one other registered root resolves
- **WHEN** the workflow observes the file
- **THEN** it skips the unresolved root
- **AND** it continues observing the resolved roots
- **AND** it reports the skipped root at the end of the report
- **AND** it does not block the run for that skipped root

#### Scenario: shared-design-sync-annotation-monitoring-SC-14 - Every registered root is unresolved
**Serves:** Honest evidence - every registered root is unresolved

- **GIVEN** no registered root in the file can be resolved
- **WHEN** the workflow observes the file
- **THEN** it reports the observation as blocked
- **AND** it performs no repository write

#### Scenario: shared-design-sync-annotation-monitoring-SC-15 - Accepted node no longer resolves
**Serves:** Honest evidence - accepted node no longer resolves

- **GIVEN** a baseline entry names a node that cannot be resolved under its
  registered surface
- **WHEN** the workflow compares live and accepted evidence
- **THEN** it reports an orphaned baseline finding for review
- **AND** it does not silently remove the accepted occurrence

### Requirement: Findings use exact engineering evidence and current ownership

The report SHALL associate a finding with project work only through a reviewed
baseline association, an exact Figma node or registered ancestor referenced by
an active OpenSpec artifact, or an exact registered component association. It
SHALL name the evidence used. Similar prose, a Figma editor, a Git author, and
an implementation author SHALL NOT establish an association or owner.

The workflow SHALL resolve the current user's normalized OpenSpec handle
through the planning workflow and SHALL use explicit task-group claims as the
primary ownership signal. Findings SHALL be grouped as `My assigned work`,
`Owned by others`, `Authored by me`, or `Unassigned or untracked`, in that
precedence. Multiple exact candidates SHALL remain ambiguous.

#### Scenario: shared-design-sync-annotation-monitoring-SC-16 - Exact active change reference is found
**Serves:** Tracing and ownership - exact active change reference is found

- **GIVEN** an active OpenSpec artifact references the finding's exact node or
  registered ancestor
- **WHEN** the report traces the finding
- **THEN** it names the matching change and artifact as association evidence

#### Scenario: shared-design-sync-annotation-monitoring-SC-17 - Similar prose is the only lead
**Serves:** Tracing and ownership - similar prose is the only lead

- **GIVEN** annotation text resembles an OpenSpec artifact
- **AND** no exact association exists
- **WHEN** the report traces the finding
- **THEN** it leaves the finding unassigned or untracked
- **AND** it does not claim the prose match as evidence

#### Scenario: shared-design-sync-annotation-monitoring-SC-18 - Matching task group belongs to the current user
**Serves:** Tracing and ownership - matching task group belongs to the current user

- **GIVEN** a finding has one exact matching task group
- **AND** that group is claimed by the current user's normalized handle
- **WHEN** the report is generated
- **THEN** the finding appears under `My assigned work`

#### Scenario: shared-design-sync-annotation-monitoring-SC-19 - Proposal authorship does not override another owner
**Serves:** Tracing and ownership - proposal authorship does not override another owner

- **GIVEN** the current user authored the associated proposal
- **AND** its exact task group is claimed by another handle
- **WHEN** the report is generated
- **THEN** the finding appears under `Owned by others`

#### Scenario: shared-design-sync-annotation-monitoring-SC-20 - Current identity is unavailable
**Serves:** Tracing and ownership - current identity is unavailable

- **WHEN** the planning workflow cannot resolve a current-user handle
- **THEN** the report still includes every finding
- **AND** it states that personal ownership could not be determined
- **AND** it does not guess an identity

### Requirement: One interactive skill reports and selects reconciliation work

The project SHALL provide one `reconcile-figma-annotations` skill through the
existing agent-platform parity mechanism. The skill SHALL perform observation,
comparison, reporting, selection, reconciliation, verification, and optional
commit as one guided workflow. The initial report phase SHALL be read-only.

The default human report SHALL show all four ownership groups, including
findings owned by others, without hiding their details. The report SHALL be
structured chat markdown: one heading per finding, with each annotation
body in its own fenced block. It SHALL NOT be emitted as one wrapping code
fence. Each finding SHALL show a human-review block with the node name,
category label and ID, the complete previous annotation body, and the
complete current annotation body. A missing version SHALL be shown as
`(none)`. Neither annotation body SHALL be truncated, summarized,
excerpted, or JSON-escaped onto a single line. Each finding SHALL also
show its stable ID, change kind, Figma file and node link, registered root
and ancestor evidence, pinned properties, ambiguity, exact OpenSpec
evidence, ownership group, and recommended next action. A compact owner
summary SHALL be explicit opt-in only. The developer SHALL be able to
select individual finding IDs; unselected findings SHALL remain drift.

#### Scenario: shared-design-sync-annotation-monitoring-SC-21 - Actionable findings are reported
**Serves:** Reporting and selection - actionable findings are reported

- **WHEN** one or more annotation changes are found
- **THEN** the skill reports them in ownership groups
- **AND** each finding contains enough evidence to inspect Figma and related
  OpenSpec work
- **AND** no repository file has changed

#### Scenario: shared-design-sync-annotation-monitoring-SC-22 - Human report includes complete annotation bodies
**Serves:** Reporting and selection - human report includes complete annotation bodies

- **WHEN** a finding is reported
- **THEN** it shows the node name
- **AND** it shows the category label and ID
- **AND** it shows the complete previous annotation body, or `(none)` when
  there is no previous version
- **AND** it shows the complete current annotation body, or `(none)` when
  there is no current version
- **AND** neither body is truncated, summarized, or JSON-escaped onto a
  single line

#### Scenario: shared-design-sync-annotation-monitoring-SC-23 - Human report is structured for reading
**Serves:** Reporting and selection - human report is structured for reading

- **WHEN** findings are reported
- **THEN** each finding has its own heading with the node name
- **AND** the previous and current annotation bodies are each in their own
  fenced block
- **AND** the report is chat markdown rather than one wrapping code fence

#### Scenario: shared-design-sync-annotation-monitoring-SC-24 - No tracked annotations changed
**Serves:** Reporting and selection - no tracked annotations changed

- **GIVEN** all registered evidence is complete
- **AND** the comparison finds no drift
- **WHEN** the report is generated
- **THEN** it states that no tracked annotations changed
- **AND** it does not offer an empty acceptance step

#### Scenario: shared-design-sync-annotation-monitoring-SC-25 - Developer selects only some findings
**Serves:** Reporting and selection - developer selects only some findings

- **GIVEN** the report contains several findings
- **WHEN** the developer selects a subset of stable finding IDs
- **THEN** only that subset becomes eligible for reconciliation
- **AND** every unselected finding remains visible as drift

### Requirement: Selected findings are reconciled atomically and deliberately

Before writing, the skill SHALL require the developer to confirm the selected
findings and each resulting engineering decision. Every accepted occurrence
SHALL have exactly one supported association form — an existing capability,
an existing change, or an existing change plus task-group — or an explicit
`noImpactReason`. Unknown association keys and references to missing store
artifacts SHALL be rejected by the registered store interface. The workflow
MAY assist with related OpenSpec edits, but it SHALL NOT invent a requirement,
association, no-impact decision, or ownership claim.

The acceptance operation SHALL validate the pinned observation digest and
accepted baseline digest, then apply all selected baseline and OpenSpec
patches atomically. Related OpenSpec edits SHALL carry exact relative paths,
expected pre-write content digests, and complete replacement contents; the
operation SHALL validate the resulting baseline and every related file before
writing, and SHALL refuse overlapping dirty targets. A changed
occurrence SHALL retain its existing annotation key. A confirmed addition
SHALL receive a new reviewed key only when accepted. Unselected, rejected, or
ambiguous findings SHALL not modify the baseline. Removals, replacement nodes,
and orphaned baseline entries SHALL always require explicit review.

#### Scenario: shared-design-sync-annotation-monitoring-SC-26 - Existing text edit is accepted
**Serves:** Deliberate reconciliation - existing text edit is accepted

- **GIVEN** a uniquely matched changed finding is selected
- **AND** its exact association or no-impact reason is confirmed
- **WHEN** reconciliation is applied
- **THEN** the accepted text is updated
- **AND** the existing annotation key and retained metadata survive

#### Scenario: shared-design-sync-annotation-monitoring-SC-27 - Addition is confirmed
**Serves:** Deliberate reconciliation - addition is confirmed

- **GIVEN** an unambiguous added finding is selected
- **AND** its exact association or no-impact reason is confirmed
- **WHEN** reconciliation is applied
- **THEN** the occurrence receives a new reviewed annotation key
- **AND** no key was assigned before confirmation

#### Scenario: shared-design-sync-annotation-monitoring-SC-28 - Only selected findings are accepted
**Serves:** Deliberate reconciliation - only selected findings are accepted

- **GIVEN** selected and unselected findings share one node
- **WHEN** reconciliation is applied
- **THEN** only selected occurrences update the baseline
- **AND** unselected occurrences remain drift in the next comparison

#### Scenario: shared-design-sync-annotation-monitoring-SC-29 - Ambiguous duplicate is selected
**Serves:** Deliberate reconciliation - ambiguous duplicate is selected

- **GIVEN** a selected finding belongs to an ambiguous duplicate set
- **WHEN** the workflow validates the acceptance set
- **THEN** it requires the developer to resolve the occurrence identity or
  leave it unaccepted
- **AND** it performs no partial write from the invalid acceptance set

#### Scenario: shared-design-sync-annotation-monitoring-SC-30 - Association decision is missing
**Serves:** Deliberate reconciliation - association decision is missing

- **GIVEN** a selected occurrence has neither an exact association nor an
  explicit no-impact reason
- **WHEN** the workflow validates the acceptance set
- **THEN** it refuses the reconciliation
- **AND** it performs no repository write

#### Scenario: shared-design-sync-annotation-monitoring-SC-31 - Observation changed before acceptance
**Serves:** Deliberate reconciliation - observation changed before acceptance

- **GIVEN** the selected findings were produced from one observation digest
- **AND** the evidence supplied for acceptance has a different digest
- **WHEN** reconciliation is attempted
- **THEN** it refuses the stale selection
- **AND** it requires a new report before any write

### Requirement: Verification and commit remain explicit and scoped

After a successful reconciliation, the skill SHALL show the resulting Git diff
and rerun the comparison against the same pinned observation. It SHALL report
all remaining unaccepted drift. It SHALL ask for a separate explicit
confirmation before creating a commit in the standalone registered
`grade10-spec` repository.

The commit SHALL stage only the accepted baseline and exact related OpenSpec
files shown in the confirmed diff. Unrelated or overlapping dirty changes SHALL
block the commit. The skill SHALL NOT push, modify the application repository's
submodule pointer, open a pull request, or modify Figma.

#### Scenario: shared-design-sync-annotation-monitoring-SC-32 - Reconciliation verifies cleanly
**Serves:** Reporting and selection - reconciliation verifies cleanly

- **GIVEN** selected findings were applied successfully
- **WHEN** the skill reruns the comparison against the pinned observation
- **THEN** accepted findings are absent
- **AND** every unselected finding remains in the final report
- **AND** the skill shows the exact Git diff

#### Scenario: shared-design-sync-annotation-monitoring-SC-33 - Developer confirms the commit
**Serves:** Reporting and selection - developer confirms the commit

- **GIVEN** verification has completed
- **AND** the relevant diff has no unrelated or overlapping changes
- **WHEN** the developer explicitly confirms the commit
- **THEN** the skill commits only the confirmed `grade10-spec` files
- **AND** it does not push the commit

#### Scenario: shared-design-sync-annotation-monitoring-SC-34 - Developer declines the commit
**Serves:** Reporting and selection - developer declines the commit

- **GIVEN** reconciliation has produced a verified working-tree diff
- **WHEN** the developer declines commit confirmation
- **THEN** the changes remain uncommitted for manual review
- **AND** no push or other external write occurs

### Requirement: Deprecated annotation automation is removed without weakening design sync

The annotation-specific daily and pull-request CI scan, ephemeral
`annotation-monitor.json`, REST live-fetch path, and separate read-only monitor
skill SHALL be removed after the reconciliation workflow is verified. Existing
component, rendered-value, token, audit, and Code Connect checks SHALL remain
unchanged in purpose and trigger coverage.

#### Scenario: shared-design-sync-annotation-monitoring-SC-35 - Design-sync workflow still checks registered components
**Serves:** Retired automation - design-sync workflow still checks registered components

- **GIVEN** the deprecated annotation CI steps have been removed
- **WHEN** the design-sync workflow runs on its existing triggers
- **THEN** its non-annotation design checks still run
- **AND** it does not fetch or persist annotation drift

#### Scenario: shared-design-sync-annotation-monitoring-SC-36 - A supported harness opens the annotation workflow
**Serves:** Retired automation - a supported harness opens the annotation workflow

- **GIVEN** project skill parity has been restored
- **WHEN** a supported harness requests annotation follow-up
- **THEN** it receives the `reconcile-figma-annotations` workflow
- **AND** the deprecated read-only monitor is not presented as a second path
