## Purpose

Provides one category-aware, reviewable workflow that traces live Figma
annotation drift to registered engineering work and reconciles only changes a
developer explicitly accepts.

## ADDED Requirements

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

#### Scenario: One category catalog resolves many annotations

- **GIVEN** a registered Figma file contains 127 annotation occurrences
- **WHEN** the workflow observes the file
- **THEN** it retrieves the file's category catalog once
- **AND** it resolves every occurrence's category locally by category ID
- **AND** it does not make 127 additional category requests

#### Scenario: Content and Interaction labels are reported

- **GIVEN** two current annotations refer to category IDs whose catalog labels
  are `Content` and `Interaction`
- **WHEN** the live observation is normalized
- **THEN** each occurrence retains its category ID
- **AND** each occurrence reports the corresponding human-readable label

#### Scenario: Annotation has no category

- **GIVEN** a current annotation has no category ID
- **WHEN** the live observation is normalized
- **THEN** the occurrence remains visible as uncategorized
- **AND** the observation is not blocked for that reason

#### Scenario: Category evidence is incomplete

- **GIVEN** a current annotation has a non-null category ID
- **AND** the category ID is absent from the retrieved file catalog
- **WHEN** the workflow validates the observation
- **THEN** it reports the file and category ID as blocked evidence
- **AND** it performs no repository write

#### Scenario: Annotation is outside registered surfaces

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

#### Scenario: Annotation array order changes

- **GIVEN** a node has the same annotation occurrences as its baseline in a
  different array order
- **WHEN** the workflow compares them
- **THEN** it reports no drift

#### Scenario: One of several annotations changes text

- **GIVEN** exact matching cancels every unchanged occurrence on a node
- **AND** one baseline occurrence and one current occurrence remain with the
  same category ID and pinned properties
- **WHEN** the workflow compares the remaining pair
- **THEN** it reports one changed finding
- **AND** the finding retains the accepted annotation key and associations

#### Scenario: Duplicate multiplicity decreases

- **GIVEN** the baseline has two identical occurrences on one node
- **AND** the live observation has one identical occurrence
- **WHEN** the workflow compares their multiplicity
- **THEN** it reports one removal
- **AND** it does not collapse the accepted duplicates

#### Scenario: Several unmatched siblings are ambiguous

- **GIVEN** several unmatched baseline and current occurrences share the same
  category ID and pinned-property set
- **WHEN** the workflow cannot pair them uniquely
- **THEN** it reports the old occurrences as removals and the new occurrences
  as additions
- **AND** it marks the relationship ambiguous
- **AND** it does not transfer keys or associations by guess

#### Scenario: Annotation structure changes

- **GIVEN** an annotation keeps similar text but changes category ID or pinned
  properties
- **WHEN** the workflow compares it with the baseline
- **THEN** it reports a removal and an addition
- **AND** it does not infer that the two occurrences are identical

#### Scenario: Only line-ending representation differs

- **GIVEN** live and accepted annotation text differ only by line-ending style
- **WHEN** the workflow compares them
- **THEN** it reports no drift

### Requirement: Missing or orphaned evidence never appears clean

The workflow SHALL distinguish verified no drift from evidence it could not
read or validate. An inaccessible file, missing tool capability, insufficient
permission, failed request, malformed response, unresolved registered root, or
unresolved category SHALL make the affected evidence blocked and the run
unsuccessful. A baseline node that no longer resolves SHALL be reported as an
orphaned finding in complete, reviewable drift: it SHALL NOT make the run
blocked or clean, and it SHALL remain selectable only with an explicit
removal or replacement decision. Blocked/no-write is reserved for incomplete
or malformed evidence.

#### Scenario: Figma Plugin API access is unavailable

- **WHEN** the invoking harness cannot provide the required Figma Plugin API or
  equivalent MCP evidence
- **THEN** the workflow reports the observation as blocked
- **AND** it does not claim the baseline is current
- **AND** it performs no repository write

#### Scenario: Accepted node no longer resolves

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

#### Scenario: Exact active change reference is found

- **GIVEN** an active OpenSpec artifact references the finding's exact node or
  registered ancestor
- **WHEN** the report traces the finding
- **THEN** it names the matching change and artifact as association evidence

#### Scenario: Similar prose is the only lead

- **GIVEN** annotation text resembles an OpenSpec artifact
- **AND** no exact association exists
- **WHEN** the report traces the finding
- **THEN** it leaves the finding unassigned or untracked
- **AND** it does not claim the prose match as evidence

#### Scenario: Matching task group belongs to the current user

- **GIVEN** a finding has one exact matching task group
- **AND** that group is claimed by the current user's normalized handle
- **WHEN** the report is generated
- **THEN** the finding appears under `My assigned work`

#### Scenario: Proposal authorship does not override another owner

- **GIVEN** the current user authored the associated proposal
- **AND** its exact task group is claimed by another handle
- **WHEN** the report is generated
- **THEN** the finding appears under `Owned by others`

#### Scenario: Current identity is unavailable

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
findings owned by others, without hiding their details. Each finding SHALL
show its stable ID, change kind, category ID and label, Figma file and node
link, registered root and ancestor evidence, previous and current text when
applicable, pinned properties, ambiguity, exact OpenSpec evidence, ownership
group, and recommended next action. A compact owner summary SHALL be explicit
opt-in only. The developer SHALL be able to select individual finding IDs;
unselected findings SHALL remain drift.

#### Scenario: Actionable findings are reported

- **WHEN** one or more annotation changes are found
- **THEN** the skill reports them in ownership groups
- **AND** each finding contains enough evidence to inspect Figma and related
  OpenSpec work
- **AND** no repository file has changed

#### Scenario: No tracked annotations changed

- **GIVEN** all registered evidence is complete
- **AND** the comparison finds no drift
- **WHEN** the report is generated
- **THEN** it states that no tracked annotations changed
- **AND** it does not offer an empty acceptance step

#### Scenario: Developer selects only some findings

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

#### Scenario: Existing text edit is accepted

- **GIVEN** a uniquely matched changed finding is selected
- **AND** its exact association or no-impact reason is confirmed
- **WHEN** reconciliation is applied
- **THEN** the accepted text is updated
- **AND** the existing annotation key and retained metadata survive

#### Scenario: Addition is confirmed

- **GIVEN** an unambiguous added finding is selected
- **AND** its exact association or no-impact reason is confirmed
- **WHEN** reconciliation is applied
- **THEN** the occurrence receives a new reviewed annotation key
- **AND** no key was assigned before confirmation

#### Scenario: Only selected findings are accepted

- **GIVEN** selected and unselected findings share one node
- **WHEN** reconciliation is applied
- **THEN** only selected occurrences update the baseline
- **AND** unselected occurrences remain drift in the next comparison

#### Scenario: Ambiguous duplicate is selected

- **GIVEN** a selected finding belongs to an ambiguous duplicate set
- **WHEN** the workflow validates the acceptance set
- **THEN** it requires the developer to resolve the occurrence identity or
  leave it unaccepted
- **AND** it performs no partial write from the invalid acceptance set

#### Scenario: Association decision is missing

- **GIVEN** a selected occurrence has neither an exact association nor an
  explicit no-impact reason
- **WHEN** the workflow validates the acceptance set
- **THEN** it refuses the reconciliation
- **AND** it performs no repository write

#### Scenario: Observation changed before acceptance

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

#### Scenario: Reconciliation verifies cleanly

- **GIVEN** selected findings were applied successfully
- **WHEN** the skill reruns the comparison against the pinned observation
- **THEN** accepted findings are absent
- **AND** every unselected finding remains in the final report
- **AND** the skill shows the exact Git diff

#### Scenario: Developer confirms the commit

- **GIVEN** verification has completed
- **AND** the relevant diff has no unrelated or overlapping changes
- **WHEN** the developer explicitly confirms the commit
- **THEN** the skill commits only the confirmed `grade10-spec` files
- **AND** it does not push the commit

#### Scenario: Developer declines the commit

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

#### Scenario: Design-sync workflow still checks registered components

- **GIVEN** the deprecated annotation CI steps have been removed
- **WHEN** the design-sync workflow runs on its existing triggers
- **THEN** its non-annotation design checks still run
- **AND** it does not fetch or persist annotation drift

#### Scenario: A supported harness opens the annotation workflow

- **GIVEN** project skill parity has been restored
- **WHEN** a supported harness requests annotation follow-up
- **THEN** it receives the `reconcile-figma-annotations` workflow
- **AND** the deprecated read-only monitor is not presented as a second path
