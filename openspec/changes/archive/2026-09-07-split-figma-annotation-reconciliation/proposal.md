**Author:** @kinisworking - 2026-08-31

## Why

Engineers maintaining collector-facing pages and the shared UI beneath them
currently review one mixed annotation report even though the affected code and
follow-up work belong to different repositories. The change succeeds when every
registered root belongs to exactly one repository scope and both reconciliation
runs report zero out-of-scope findings, removals, or orphan warnings.

## What Changes

- Provide one repo-local `reconcile-figma-annotations` skill in `grade10-spec`
  for design-system primitives and shared `packages/ui` blocks.
- Narrow the existing `grade10` skill to application page-layout annotations.
- Move portable observation, reporting, and reconciliation guidance behind the
  registered store's deterministic command surface so the two skills do not
  fork safety or matching behavior.
- Add explicit `spec` and `product` scope metadata to the canonical annotation
  registration inventory and require every diff and acceptance transaction to
  name one scope.
- Keep one reviewed baseline while deriving each accepted occurrence's scope
  from its registered source root.
- Reject mixed-scope observations and acceptance selections atomically; ignore
  out-of-scope baseline roots and occurrences instead of reporting them as
  removals or orphans.
- Preserve the existing evidence, digest, approval, verification, commit, and
  no-Figma-write guarantees in both repo-local workflows.

## Non-Goals

- Changing annotation occurrence identity, matching, ownership precedence, or
  supported association forms.
- Splitting the reviewed baseline into repository-specific files.
- Treating `packages/ui` shared blocks as application page layouts.
- Reading exploratory Figma areas or changing the Figma file.
- Adding a scheduler, CI monitor, hosted snapshot, credential, dependency, or
  production deployment.
- Accepting findings, committing, pushing, opening a pull request, or advancing
  `external/grade10-spec` as part of planning.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. The existing `shared/design-sync/annotation-monitoring` behavior remains the
contract: registered evidence is observed, compared, selectively accepted,
verified, and optionally committed through one guided workflow. This change
only assigns registered surfaces and the repo-local workflow adapters to their
owning repositories.

## Impact

- `grade10-spec`: scoped registration and baseline validation, inventory/diff/
  accept command interfaces, portable observation and report helpers, fixtures,
  tests, governance, a repo-local skill, `/dev-help`, and agent parity.
- `grade10`: a page-layout-only skill, registered-store command adapter,
  `/dev-help`, removal of duplicated reconciliation logic and tests, and agent
  parity.
- Existing temporary observations become invalid when scope is absent or does
  not match the requested transaction; they are ephemeral and are rerun rather
  than migrated.
- No product API, database, design token, component export, user-facing UI, or
  runtime deployment changes.
