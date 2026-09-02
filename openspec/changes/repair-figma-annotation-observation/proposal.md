**Author:** @kinisworking - 2026-08-30

## Why

Collectors rely on engineering changes matching reviewed Figma intent, but the
annotation workflow can currently count one live annotation more than once or
reject complete evidence when several engineering registrations share a Figma
root. The repair succeeds when every complete observation in the contract test
corpus is accepted by the registered store and every live annotation occurrence
is represented exactly once.

## What Changes

- Treat engineering registrations and Figma traversal roots as separate
  concepts: retain every audit and Code Connect registration while traversing
  each unique Figma root once.
- Prevent overlapping registered subtrees from duplicating node or annotation
  evidence.
- **BREAKING:** replace the temporary observation schema version 1 root source
  with schema version 2 roots that contain all associated source registrations.
- Make the registered store the sole canonicalizer and digest authority, while
  preserving the actual ancestor-chain order supplied by the observation.
- Bound live evidence to annotation-bearing nodes and reviewed baseline nodes,
  including tracked nodes whose final annotation was removed.
- Align the portable adapter contract with supported Figma Plugin API
  operations and require one complete, consistent capture per file.
- Add cross-layer regression coverage and update the workflow reference and
  governance guidance for the repaired contract.

## Non-Goals

- Changing the durable schema-version-2 annotation baseline or collapsing its
  flat engineering registration inventory.
- Changing occurrence matching, ownership precedence, finding selection,
  acceptance decisions, or atomic store writes.
- Reading exploratory Figma areas, modifying Figma, or falling back to REST
  evidence.
- Persisting a current-state snapshot, adding CI automation, or introducing a
  scheduler, dependency, hosted service, or credential.
- Committing, pushing, advancing the application submodule, or opening a pull
  request as part of planning.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. The existing `shared/design-sync/annotation-monitoring` requirements already
require complete scoped observations, exact registered-root and ancestor
evidence, digest-pinned reconciliation, and blocked handling for incomplete
evidence. This change repairs the implementation against that contract.

## Impact

- `grade10-spec`: temporary observation validation, canonicalization,
  reconciliation source expansion, skipped-root rendering, fixtures, tests,
  and design-sync governance documentation.
- `grade10`: read-only Plugin API observation adapter, temporary observation
  schema, report rendering, adapter reference, and tooling tests.
- Agent harnesses: schema-version-2 temporary observations must be captured in
  one file-level invocation; unsupported or truncated evidence remains blocked.
- No production API, deployment, database, design-system package, or
  user-facing UI changes.
