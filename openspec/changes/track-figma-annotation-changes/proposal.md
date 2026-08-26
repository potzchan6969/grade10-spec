**Author:** @kinisworking - 2026-08-26

## Why

Designers can change a component annotation after its implementation work has
started, but the current design-sync rail checks component structure and drawn
values rather than the annotation text that may describe product behaviour.
Developers therefore have no dependable way to notice, trace, or triage those
changes; success means every tracked annotation change is surfaced by the next
daily scan and the median time from edit to a relevant developer report stays
below one business day.

## What Changes

- Add a versioned baseline and deterministic scanner for annotations attached
  to tracked Figma components and nodes.
- Produce a stable machine-readable diff that distinguishes added, changed,
  removed, untracked, ambiguous, and blocked evidence.
- Add a Grade10 project skill that interprets the diff against active OpenSpec
  changes and groups findings by the current user's task ownership, proposal
  authorship, unassigned work, and work owned by others.
- Publish the read-only reporting skill through the repository's existing
  agent-platform parity so different AI models and harnesses can invoke the same
  workflow on demand or through their own scheduling facilities.
- Document how a reviewed OpenSpec change accepts an annotation baseline update
  and how designers and developers trace a finding back to Figma and OpenSpec.

## Non-Goals

- Inferring responsibility from a Figma editor, Git commit author, component
  author, or fuzzy text similarity.
- Automatically accepting annotation changes into the baseline.
- Automatically creating or editing OpenSpec changes, task assignments, GitHub
  issues, pull requests, Slack messages, or other external records.
- Replacing the existing component-structure, rendered-value, token, or Code
  Connect checks.
- Treating annotation prose as an executable product requirement without an
  explicit OpenSpec decision.
- Defining, configuring, or standardizing a Codex-, Claude-, Cursor-, or other
  harness-specific scheduler.
- Building a product-facing notification UI or a new centrally hosted
  scheduler.

## Capabilities

### New Capabilities

- `design-sync/annotation-monitoring`: Versioning, detecting, tracing, and
  reporting changes to tracked Figma annotations without silently accepting or
  misattributing them.

### Modified Capabilities

None.

## Impact

- `grade10-spec`: design-sync scripts, fixtures, package commands, governance
  documentation, the nightly design-sync workflow, and the versioned annotation
  baseline.
- `grade10`: a project-local workflow skill, its `/dev-help` route, and parity
  checks across supported agent platforms.
- Supported agent harnesses: one canonical read-only skill distributed through
  the repository's existing parity mechanism; each harness owns any recurrence
  it configures around that skill.
- Existing Figma read credentials are reused; no new production dependency,
  deployment, or public API is introduced.
