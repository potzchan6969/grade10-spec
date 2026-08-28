**Author:** @kinisworking - 2026-08-26

## Why

Designers can change annotation text or categories after implementation starts,
but the existing REST-backed CI monitor cannot retrieve the category labels
shown in Figma and leaves acceptance as a separate manual editing exercise.
Developers need one reviewable workflow that fetches complete live evidence,
shows which registered engineering work is affected, and applies only the
changes they explicitly accept. Success means every selected annotation change
is traceable from Figma evidence to a reviewed baseline or OpenSpec decision,
while no unselected, ambiguous, or blocked finding is silently accepted.

## What Changes

- Replace the annotation-specific CI and read-only monitoring path with one
  interactive `reconcile-figma-annotations` project skill.
- Fetch annotations only from registered engineering surfaces through a Figma
  Plugin API or equivalent MCP capability, including one category catalog per
  file so category IDs can be reported as labels such as `Content` and
  `Interaction` without one request per annotation.
- Compare a temporary normalized live observation with the reviewed
  schema-version-2 annotation baseline. Preserve annotation multiplicity and
  match occurrences independently of Figma array order.
- Produce stable finding IDs, exact Figma and OpenSpec evidence, current
  ownership grouping, category metadata, and recommended follow-up actions.
- Let the developer select findings, supply or confirm exact OpenSpec
  associations or an explicit `noImpactReason`, preview an atomic baseline and
  spec patch, and verify the remaining drift.
- After a separate explicit confirmation, let the skill commit only the
  relevant standalone `grade10-spec` changes. Pushing remains a developer
  action.
- Remove superseded annotation CI steps, ephemeral report artifacts, REST live
  fetching, and the old `monitor-figma-annotations` workflow after the new path
  is verified. Preserve the existing component and audit design-sync checks.

## Non-Goals

- Scanning exploratory Figma areas outside registered engineering surfaces.
- Modifying Figma or treating annotation prose as an automatically approved
  product requirement.
- Persisting an `annotation-current.json` snapshot, CI artifact, or other
  generated current-state file in either repository.
- Automatically accepting findings, inferring occurrence identity, ownership,
  or OpenSpec associations from similar prose, or resolving ambiguous
  duplicates.
- Automatically pushing, opening a pull request, writing a protected branch,
  or creating external notifications.
- Defining a scheduler or workflow for Codex, Claude, Gemini, Cursor, or any
  other harness.
- Replacing the component-structure, rendered-value, token, audit, or Code
  Connect checks in design sync.

## Capabilities

### New Capabilities

- `design-sync/annotation-monitoring`: Category-aware observation, deterministic
  drift detection, exact engineering traceability, and selective reconciliation
  of Figma annotation occurrences.

### Modified Capabilities

None.

## Impact

- `grade10-spec`: annotation baseline, deterministic diff and acceptance
  commands, fixtures and tests, governance documentation, and removal of the
  annotation-specific design-sync CI path.
- `grade10`: one canonical interactive skill, deterministic reporting and
  ownership helpers, `/dev-help`, parity checks, and removal of the deprecated
  read-only skill and wrappers.
- Agent harnesses: the workflow requires read access to a Figma Plugin API or
  equivalent MCP tool, but the normalized snapshot, diff, acceptance, and Git
  behavior remain harness-neutral.
- No new production dependency, deployment, credential, hosted service, or
  public API is introduced.
