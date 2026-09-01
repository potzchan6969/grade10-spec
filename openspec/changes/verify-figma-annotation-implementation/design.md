## Context

See [proposal.md](proposal.md) for the problem and the
[annotation implementation verification spec](specs/design-sync/annotation-implementation-verification/spec.md)
for required behavior.

The existing annotation workflow already has the correct evidence and write
seams. `grade10-spec` owns scoped inventory, observation normalization, report
enrichment, selection validation, acceptance, and the reviewed baseline.
`grade10` and `grade10-spec` each expose a narrow
`reconcile-figma-annotations` adapter for the implementation surface that repo
owns. Reports can already be emitted as structured JSON as well as markdown.

The missing step sits between selection and the existing acceptance decision.
Today the workflow asks for an association or `noImpactReason` without first
requiring evidence that code, focused tests, and runtime behavior satisfy the
annotation. Planning cannot be hidden inside acceptance: acceptance only
patches existing clean store targets and is pinned to one observation, while
planning may create several files, require decisions, and outlive that
observation.

## Goals / Non-Goals

**Goals:**

- Keep one repo-local skill interface while adding an evidence-complete impact
  phase at the existing selection seam.
- Put validation shared by both scopes beside the store-owned report and
  association semantics.
- Make every outcome and planning handoff machine-checkable without pretending
  a deterministic script can judge arbitrary product behavior.
- Reuse `pm-planning` and `full-planning` rather than copying their artifact or
  validation rules into reconciliation.
- Preserve the existing observation, acceptance, commit, and repository-scope
  guarantees.

**Non-Goals:**

- Adding a second user-facing verification skill.
- Building a general static analyzer that decides whether arbitrary annotation
  prose is implemented.
- Importing application code into `grade10-spec` or accessing product files
  from a store command.
- Keeping an impact report after the run or turning it into a hosted artifact.
- Changing annotation identity, matching, baseline schema, or acceptance
  transaction semantics.

## Decisions

### 1. The existing skill owns orchestration; a store module owns validation

Both repo-local `reconcile-figma-annotations` adapters gain the impact phase
after stable-ID selection. The public interface stays one guided skill. A new
store-owned module validates the impact document and derives the acceptance and
planning partitions for both scopes.

`grade10-spec` adds:

- `scripts/design-sync/annotation-impact.mjs` for pure validation and routing;
- `scripts/design-sync/annotation-impact-cli.mjs` for the command adapter; and
- `figma:annotations:impact` in `package.json`.

The command requires `--scope`, `--report`, `--ids`, and `--review`; `--json`
returns the validated result. It reuses the existing report selection and
association validators. It performs no Figma, Git, baseline, OpenSpec, or
implementation write.

The product skill requires this command during its existing store-interface
preflight. Each adapter emits its normal markdown report and a JSON report from
the same scanner and identity inputs. The JSON report and selected IDs are the
validator's authority; skill prose never reconstructs findings from markdown.

Alternatives considered:

- Add `verify-figma-implementation` as a second skill: rejected because it has
  one caller, duplicates selection context, and reintroduces workflow discovery.
- Keep the impact matrix entirely in prose: rejected because missing IDs,
  duplicate outcomes, stale digests, and invalid associations would vary by
  harness and be hard to test.
- Make the store inspect product code: rejected because it breaks repository
  ownership and turns the shared command into a checkout-dependent adapter.

### 2. Harnesses collect evidence; the validator proves completeness

The repo-local skill inspects the owning checkout, exact OpenSpec evidence, and
current planning board. It runs the smallest relevant test and obtains runtime
evidence appropriate to the behavior. It writes one temporary impact document
beside the observation and removes it with the existing temporary directory.

The validator checks structure and consistency, not the truth of arbitrary
behavior. It verifies the observation digest, scope, selected-ID coverage,
outcome-specific evidence, exact associations, and gap grouping. The human
still reviews the evidence preview before any write.

An `implemented` result requires an exact existing association as well as code,
test, and runtime evidence. Code without a requirement is a specification gap,
not a completed association. `covered` requires an active change or task group;
a durable capability without delivery evidence does not make missing behavior
covered. `no-impact` maps to the existing explicit reason. `gap` and `blocked`
never enter the acceptance set.

Alternatives considered:

- Let a file match prove implementation: rejected because file names do not
  establish behavior.
- Let a focused test alone prove runtime behavior: rejected because a test may
  cover a lower seam or a stale composition.
- Require the validator to execute commands: rejected because each repository
  and behavior owns its test and runtime lane; execution remains adapter work.

### 3. One temporary impact contract carries both scopes

The impact document uses schema version 1 and this top-level shape:

```json
{
  "schemaVersion": 1,
  "scope": "product",
  "observationDigest": "sha256:...",
  "findings": [],
  "planningGroups": []
}
```

Each `findings[]` entry contains:

| Field | Meaning |
| --- | --- |
| `findingId` | One selected stable report ID. |
| `expectedBehavior` | The behavior tested by the review. |
| `outcome` | `implemented`, `no-impact`, `covered`, `gap`, or `blocked`. |
| `implementationEvidence` | Exact owning-repo locations and what they prove. |
| `testEvidence` | Focused command, named test or scenario, exit result, and observed outcome. |
| `runtimeEvidence` | Environment, check performed, and observed behavior. |
| `association` | Exact existing capability/change/task-group evidence when required. |
| `noImpactReason` | Non-empty reason used only for `no-impact`. |
| `missingBehavior` | What remains absent for `gap`. |
| `blockers` | Unresolved evidence used only for `blocked`. |

Every `gap` appears in exactly one `planningGroups[]` entry. A group contains
finding IDs, capability path, proposed kebab-case change name, `pm-planning` or
`full-planning`, affected clone names, and non-goals. The validator rejects a
gap omitted from planning, an eligible finding included in planning, a finding
in two groups, a stale digest, or an outcome with the wrong evidence fields.

The validated result returns `acceptanceEligibleIds`, `planningGroups`, and
`blockedIds`. It never prepares acceptance decisions or planning files.

Alternatives considered:

- Persist the matrix in either repository: rejected because it describes one
  point-in-time observation and would create stale evidence and merge churn.
- Put planning fields on every gap finding: rejected because related findings
  would duplicate and potentially disagree about one proposed change.

### 4. Impact review partitions the existing transaction

The skill shows one impact preview before proceeding. Outcomes route as follows:

| Outcome | Current run |
| --- | --- |
| `implemented` | Continue with the existing exact association decision. |
| `no-impact` | Continue with the existing `noImpactReason` decision. |
| `covered` | Continue with the exact change or task-group association. |
| `gap` | Remain drift and enter a planning preview. |
| `blocked` | Remain drift with no acceptance or planning write. |

Eligible findings may complete the existing acceptance, same-snapshot
verification, and optional local commit flow. The skill finishes that
transaction before starting any planning write. If the registered store is
dirty afterward, planning pauses until the existing diff is resolved or a
clean planning checkout is selected; reconciliation does not silently mix the
two transactions.

Alternatives considered:

- Refuse all progress when one selected finding is a gap: rejected because
  selective reconciliation already supports safe partial progress.
- Accept gaps against a proposed change name before it exists: rejected because
  it creates unverifiable associations and bypasses store target validation.
- Create planning files inside acceptance: rejected because failure would mix
  different write authorities and invalidate the acceptance allowlist.

### 5. Confirmed gaps hand off to existing planning skills

After eligible acceptance is finished, the skill shows each validated planning
group and asks a separate planning question. On confirmation it loads and runs
the existing lane skill with the impact group as intake:

- `pm-planning` when the requested outcome ends with proposal and requirements;
- `full-planning` when design and implementation tasks are part of the handoff.

The invoked skill owns its interview, artifact instructions, validation, and
handoff. Reconciliation does not write OpenSpec files directly and does not
inherit commit, push, merge, claim, or implementation permission. If several
planning groups exist, they run sequentially so each change remains independently
reviewable.

Once planning begins, the selected gap's current reconciliation path ends. A
later acceptance starts with a new Figma observation and repeats report,
selection, and impact review. This avoids treating an older digest as current
after product decisions or spec files changed.

Alternatives considered:

- Always use `full-planning`: rejected because requirements-only intake is a
  supported team handoff and must not invent delivery tasks.
- Auto-create every suggested change without a preview: rejected because
  grouping and lane choice are product and delivery decisions.
- Resume the old observation after planning: rejected because planning can
  outlive or change the evidence that was originally selected.

### 6. Both adapters share behavior but keep repository evidence local

The shared store reference and validator define the contract once. The
`grade10-spec` adapter collects evidence for primitives and shared blocks in
that checkout. The `grade10` adapter collects application page evidence in the
product checkout and calls the registered store validator with `--scope
product`.

`/dev-help` continues to place reconciliation in Design intake and clarifies
that the skill verifies selected implementation impact before routing gaps into
planning. The two skills keep their current local scope descriptions and safety
prohibitions.

Alternatives considered:

- Add product implementation rules to the store skill only: rejected because
  the spec-scope adapter would expose the same name with materially different
  post-selection semantics.
- Copy the validator into `grade10`: rejected because two implementations could
  disagree on outcome eligibility and planning partitions.

### 7. This change has no UI artifact

The added surfaces are skill prompts, temporary JSON, terminal markdown, and
OpenSpec planning files. No collector or operator screen changes, so `ui.md` is
omitted.

## Impact Review Contract

The command is read-only and deterministic for the same report, IDs, review,
store contents, and scope. Exit codes follow the annotation command convention:

| Exit | Meaning |
| --- | --- |
| `0` | Complete impact review; every selected finding is acceptance-eligible and no planning gap remains. |
| `1` | Complete review with one or more gaps that need planning. |
| `2` | Blocked, stale, malformed, cross-scope, or incomplete review. |

An exit of `1` is actionable planning evidence, not a validation failure. An
exit of `2` permits neither acceptance nor planning writes. The JSON output
always names the selected IDs, partition, blockers, scope, and observation
digest.

## Verification Strategy

- Drive the store validator through pure Node fixtures for every spec scenario,
  including stale digests, duplicate or missing IDs, invalid associations,
  mixed outcomes, and gap grouping.
- Extend the store skill tests for spec-scope evidence collection, impact
  preview, planning confirmation, fresh-observation restart, and no-write
  states.
- Extend the Grade10 agent tests for the required registered-store command,
  product-only implementation evidence, eligible/gap partition, lane handoff,
  dirty-store stop, and independent permissions.
- Run one cross-repository fixture through report JSON, selected impact review,
  eligible acceptance preview, declined planning, and confirmed planning
  preview without committing, pushing, or implementing.
- Finish each repository group with its own parity, focused test, lint,
  typecheck, and diff checks.

## Risks / Trade-offs

- [A model supplies plausible but false evidence] -> Require exact paths,
  commands, observed results, and a human preview; the validator proves
  completeness, not semantic truth.
- [Runtime verification is unavailable] -> Refuse `implemented` and classify
  the finding as `blocked` or `gap`; do not silently downgrade the evidence
  requirement.
- [An active change overlaps the proposed gap] -> Load the current board and
  exact associations before grouping; route to `covered` instead of creating a
  duplicate.
- [Eligible acceptance leaves the store dirty] -> Finish or stop the
  reconciliation transaction before planning; never mix its allowlist with a
  planning write.
- [Planning takes long enough for Figma to change] -> Discard the old selection
  and require a fresh observation before acceptance.
- [The two adapters drift] -> Keep schema and routing validation in the store,
  share the teammate reference, and verify both adapters against the same
  fixture outcomes.

## Migration Plan

1. Add the impact schema, validator, CLI, focused tests, and package command in
   `grade10-spec` without changing existing report or acceptance behavior.
2. Extend the shared teammate reference and spec-scope skill with evidence
   collection, outcome preview, routing, and planning handoff; restore and check
   agent parity.
3. Land the store command and shared guidance on the registered store's `main`.
4. Update the Grade10 product adapter to require the new command, collect
   product evidence, partition outcomes, and invoke the existing planning
   skills only after confirmation; update `/dev-help` and agent tests.
5. Rehearse both scopes with implemented, no-impact, covered, gap, and blocked
   findings, including declined planning, a dirty-store stop, and a fresh-run
   restart after planning.

Rollback removes the product phase first, then the store skill phase and impact
command. Existing reports, baselines, associations, and acceptance transactions
remain valid because no persisted annotation schema changes.
