**Author:** @kinisworking - 2026-09-01

## Why

Collectors can still receive behavior that disagrees with reviewed Figma intent
after an annotation is accepted, because acceptance currently proves
traceability but not implementation. A recent store-page review needed a
separate manual pass to map accepted findings to behavior, code, tests, and
runtime evidence. This change succeeds when every selected finding is either
verified with complete implementation evidence, tied to settled existing work,
given an explicit no-impact reason, or routed into a reviewed plan before it can
leave the reconciliation workflow.

## What Changes

- Extend both repository-scoped `reconcile-figma-annotations` workflows with a
  read-only implementation-impact review after finding selection.
- Require one explicit impact status per selected finding, backed by expected
  behavior, exact implementation location, focused test evidence, and runtime
  evidence where implementation is claimed complete.
- Reuse exact capability, change, and task-group evidence before proposing new
  work; leave incomplete or ambiguous reviews blocked from acceptance.
- Group genuine gaps into coherent planning handoffs rather than creating one
  change per annotation.
- Preview the proposed OpenSpec lane and artifacts, then require explicit
  confirmation before running `pm-planning` or `full-planning`.
- End reconciliation without accepting gap findings when planning is required;
  require a fresh observation and selection after the plan exists.
- Preserve separate consent for annotation acceptance, local commits, planning
  commits, pushes, and implementation.
- Measure coverage as the percentage of selected findings with one validated
  impact outcome; the target is 100%, with zero gap or blocked findings accepted
  as implemented.

## Non-Goals

- Treating annotation prose, file presence, or a green unrelated test as proof
  that behavior is implemented.
- Automatically choosing product requirements, architecture, ownership, or an
  implementation plan without review.
- Creating one OpenSpec change per annotation when several findings describe
  one capability or delivery slice.
- Implementing application or design-system changes from the reconciliation
  skill.
- Committing, pushing, merging, claiming task groups, opening pull requests, or
  advancing `external/grade10-spec` without the existing separate workflow and
  consent.
- Accepting findings from the old observation after a planning handoff.
- Modifying Figma, adding a scheduler, or introducing a hosted report or
  persistent current-state snapshot.

## Capabilities

### New Capabilities

- `design-sync/annotation-implementation-verification`: Evidence-complete
  implementation review and safe planning handoff for selected Figma annotation
  findings.

### Modified Capabilities

None.

## Impact

- `grade10-spec`: shared impact-review contract and validation, spec-scope skill
  and teammate guidance, design-sync fixtures and tests, package commands, and
  agent parity.
- `grade10`: product-scope skill orchestration, workflow-map guidance, focused
  agent tests, and planning handoff into the registered store.
- Existing `design-sync/annotation-monitoring` observation, matching,
  acceptance, baseline, and commit semantics remain unchanged.
- No production dependency, product API, database, deployment, credential,
  design token, component export, or user-facing UI is introduced.
