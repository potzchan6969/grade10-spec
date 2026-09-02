## Context

See [proposal.md](proposal.md) for motivation. The behavior remains governed by
the active
[`shared/design-sync/annotation-monitoring`](../track-figma-annotation-changes/specs/shared/design-sync/annotation-monitoring/spec.md)
contract.

The workflow is currently split at the wrong seam. `grade10` owns the portable
Plugin API observer, ownership-aware report renderer, skill, and their tests;
the registered `grade10-spec` store owns the reviewed baseline and deterministic
diff and acceptance commands. Both primitive and page-layout registrations are
fed into one observation, so the skill cannot select the repository that owns
the resulting work.

At planning time the baseline has 85 flat registrations: 60 beneath
`packages/design-system`, 17 beneath `packages/ui`, and 8 page-layout records.
The flat records intentionally preserve multiple audit and Code Connect sources
for one Figma root. Accepted entries refer to one `sourceRoot`, so their scope
can be derived without duplicating it on every occurrence.

`repair-figma-annotation-observation` is still completing its live verification
task. Its schema-version-2 source grouping, unique traversal, compact evidence,
and store-owned digest are prerequisites for this change and are not redesigned
here.

## Goals / Non-Goals

**Goals:**

- Put the deterministic workflow implementation beside the baseline it
  validates and mutates.
- Give each repository one small, explicit skill interface over that shared
  implementation.
- Make repository scope an input to inventory, diff, reporting, acceptance,
  and verification rather than a report-time filter.
- Keep the baseline schema version and occurrence identity stable while adding
  explicit ownership to registrations.
- Make an out-of-scope root, tracked node, finding, or acceptance selection a
  no-write refusal rather than an accidental removal.

**Non-Goals:**

- Changing Figma observation semantics established by the repair change.
- Making the two scopes concurrently writable; the full baseline digest remains
  the optimistic-concurrency guard for every acceptance transaction.
- Adding a shared package consumed through `external/grade10-spec`; the product
  skill invokes the separately registered store.
- Coupling reconciliation to page implementation or primitive authoring. An
  accepted annotation remains traceability evidence, not proof of delivery.

## Decisions

### 1. Scope follows source ownership, not visual complexity

Every flat baseline root receives one required `scope` value:

| Scope | Registrations | Repo-local workflow |
| --- | --- | --- |
| `spec` | `packages/design-system/**` primitives and `packages/ui/**` shared blocks | `grade10-spec` |
| `product` | `kind: layout` application page roots | `grade10` |

All registrations for the same normalized Figma file and node must have the
same scope. An accepted entry derives its scope through `sourceRoot`; no second
scope field is stored on the entry. The baseline remains schema version 2
because the occurrence model and accepted identity are unchanged; `scope` is
additive registration metadata.

The migration writes explicit values for the current inventory. Runtime code
does not infer a missing value from `path`, `kind`, or node name after that
migration. Missing, unknown, or conflicting scope is malformed baseline
evidence and exits blocked.

Alternatives considered:

- Split only primitives from full pages and leave `packages/ui` implicit:
  rejected because shared blocks and their export contracts live in
  `grade10-spec` even when applications compose them into pages.
- Infer scope from file paths forever: rejected because layout roots have no
  path and a future source kind could silently route to the wrong repository.
- Add a third `shared-ui` scope: rejected because scope names the owning
  repository, not every source category within it.

### 2. One baseline exposes two validated projections

The store builds a scope index from baseline roots before it reads a snapshot.
An inventory operation returns only registrations and tracked node IDs for one
requested scope. Observation consumes that inventory, so a normal snapshot is
already scope-bounded.

Diff validates that every observed and skipped root belongs to the requested
scope. It compares only accepted entries whose `sourceRoot` belongs to that
scope. Roots and entries in the other scope are absent from the comparison and
cannot become removals or orphans. Acceptance recomputes the same scoped diff
and refuses a selected ID that is not in it.

The observation and baseline digests keep their existing meaning. In
particular, acceptance continues to pin the complete baseline digest. A change
in the other scope therefore makes the transaction stale and requires a fresh
report; this is deliberately stricter than merging concurrent baseline writes.

Alternatives considered:

- Store `annotation-baseline.spec.json` and
  `annotation-baseline.product.json`: rejected because it duplicates schema,
  transaction, and occurrence identity rules and makes cross-root provenance
  harder to audit.
- Filter findings after a full diff: rejected because out-of-scope baseline
  entries would already have been classified as removals or orphans.
- Pin only a scope-local baseline digest: rejected because acceptance writes
  one shared file and the existing whole-file digest prevents lost updates.

### 3. The store presents the shared command interface

`grade10-spec/package.json` exposes four deterministic commands. Each requires
`--scope spec|product`; there is no mixed or default scope.

| Command | Input | Output / effect |
| --- | --- | --- |
| `figma:annotations:inventory` | `--scope`, optional `--json` | File metadata, flat registrations, and tracked node IDs for observation |
| `figma:annotations:diff` | `--scope`, `--snapshot`, optional `--json` | Scoped findings, blockers, observation digest, and full baseline digest; no writes |
| `figma:annotations:report` | `--scope`, `--scanner`, optional `--mine` | Existing complete ownership-grouped chat markdown; no writes |
| `figma:annotations:accept` | `--scope`, `--snapshot`, `--ids`, `--decisions`, optional `--json` | Existing atomic baseline/OpenSpec transaction for scoped findings |

The inventory JSON has one stable shape:

```json
{
  "schemaVersion": 1,
  "scope": "spec",
  "files": [
    {
      "fileKey": "GW2WL6JcWok5ypUrUFi9bU",
      "fileUrl": "https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU",
      "registrations": [],
      "trackedNodeIds": []
    }
  ]
}
```

Portable observation functions move from
`grade10/scripts/reconcile-figma-annotations.mjs` to
`grade10-spec/scripts/design-sync/annotation-observation.mjs`. Reporting moves
from `grade10/scripts/figma-annotation-report.mjs` to
`grade10-spec/scripts/design-sync/annotation-report.mjs`. Store-only scope,
normalization, comparison, and mutation stay in the existing design-sync
modules rather than being copied into either skill.

Exit codes remain `0` for complete/no drift, `1` for complete/drift, and `2`
for blocked or malformed evidence. Missing `--scope`, a mixed-scope snapshot,
or a cross-scope selected ID exits `2` and performs no write.

Alternatives considered:

- Keep the observer and renderer in `grade10` and copy them to the store:
  rejected because fixes to evidence and safety behavior would need two commits
  and could disagree during a run.
- Put the shared implementation in a published package: rejected because the
  registered-store command interface already exists and no runtime consumer
  needs a package dependency.
- Let skill prose filter baseline JSON directly: rejected because scoping and
  no-write validation must be deterministic and testable.

### 4. Both repositories expose the same skill name through narrow adapters

Each repository exposes `reconcile-figma-annotations` through its canonical
`.claude/skills` tree and parity aliases. The name remains stable for teammate
muscle memory; the description and first workflow step state the local scope.

The `grade10-spec` skill:

- runs from the standalone store and requests `--scope spec`;
- observes design-system and shared-block registrations only;
- uses the shared report helper with current identity when it can be resolved;
- accepts and optionally commits only the baseline and confirmed OpenSpec files
  in the same repository.

The `grade10` skill:

- resolves `grade10-spec` with `openspec list --json` on every run;
- requests `--scope product` from every store command;
- supplies `pnpm plan mine` output to the shared report helper;
- accepts and optionally commits only the registered store, never the product
  checkout or `external/grade10-spec`.

Both keep the existing three pauses: selection after a read-only report,
confirmation of the decision preview before writes, and separate confirmation
after same-snapshot verification before a local store commit. The shared
Plugin API and teammate guidance live with the store implementation; the
product skill links to those references after resolving the store instead of
copying them.

Alternatives considered:

- Give the two skills different names: rejected because repository context is
  already the routing input and one stable command is easier to remember.
- Keep one product-repo skill with a scope prompt: rejected because it leaves
  primitive work outside its owning repository and makes the user choose a
  fact the registration inventory already knows.
- Add a third router skill: rejected because it recreates the mixed entrypoint
  this change removes.

### 5. Product-side duplicated logic is removed after the store lands

Once the store commands and spec-scope skill are on the registered store's
`main`, `grade10` replaces its current helper-heavy workflow with the product
adapter. The portable observer, report renderer, their focused test files, and
the now-empty `test:tooling` package script are removed from `grade10`; their
behavioral coverage moves to `grade10-spec`'s design-sync suite.

`/dev-help` in each repository lists only its local skill meaning. Agent UI
metadata remains explicit-invocation compatible and describes the correct
scope. No submodule bump is required by the runtime path, although the product
group may start only after the standalone store implementation has landed.

Alternatives considered:

- Retain product helper copies as a fallback: rejected because fallback code
  becomes a second implementation and can bypass scope validation.
- Import helpers through `external/grade10-spec`: rejected because the workflow
  intentionally resolves the standalone current store instead of the possibly
  stale submodule pin.

## Baseline and Observation Contracts

The existing flat baseline root shape gains one field:

```json
{
  "fileKey": "GW2WL6JcWok5ypUrUFi9bU",
  "nodeId": "4098:2423",
  "kind": "layout",
  "path": null,
  "label": "Pages/Product Detail/root",
  "scope": "product"
}
```

Canonical ordering includes `scope`. Duplicate registrations remain legal only
when their source evidence differs and their scope agrees. Baseline entries
remain unchanged and continue to reference a flat registration through
`sourceRoot`.

Observation schema version 2 remains compact and temporary. Its roots do not
repeat scope: the requested command scope and the store's baseline index are
the authority. The store rejects an observed root absent from the selected
projection, a tracked node not reachable from a selected root, and a skipped
root owned by the other scope.

## Verification Strategy

- Migrate the current registration inventory and assert that every root has one
  valid scope, all `packages/design-system` and `packages/ui` records are
  `spec`, and all layout records are `product`.
- Exercise inventory grouping, duplicate registrations, conflicting scope,
  missing scope, and tracked-node projection with focused fixtures.
- Run the same complete fixture through both scopes and prove that each report
  contains only its own findings while the other scope produces no removal or
  orphan drift.
- Attempt cross-scope and mixed-snapshot acceptance and assert the baseline and
  related OpenSpec files remain byte-identical.
- Re-run existing multiplicity, ambiguity, category, ownership, stale-digest,
  atomic transaction, skipped-root, orphan, and complete-report tests from
  their new store-owned modules.
- Finish with one read-only live Figma capture per scope from the same registered
  store inventory. Do not select or accept findings during this rehearsal.

## Risks / Trade-offs

- [The unfinished observation repair moves the same helpers] → Complete and
  verify `repair-figma-annotation-observation` task 2.6 before starting this
  change, then move the verified code without redesigning it.
- [A registration is assigned to the wrong repository] → Store explicit scope,
  validate same-node agreement, and review the full baseline migration as its
  own spec-repo group before enabling either skill.
- [A partial scoped snapshot creates false removals] → Build observation input
  only through scoped inventory and validate every root again at diff and
  acceptance.
- [The product skill runs against an older registered store] → Require the
  scope-aware command interface during preflight and stop blocked when it is
  unavailable; never fall back to product-local helpers.
- [Two scoped acceptances race on one baseline] → Retain the complete baseline
  digest so the second transaction must rerun against current state.
- [Moving tests loses behavior coverage] → Move existing cases first, keep them
  green, then add scope cases before deleting the product copies.

## Migration Plan

1. Complete `repair-figma-annotation-observation` task 2.6 and re-establish its
   cross-repository verification baseline.
2. Add scope validation, inventory projection, required CLI scope, and the
   mechanical baseline migration in `grade10-spec`; verify no accepted entry or
   association changes.
3. Move the portable observer, report renderer, references, and behavioral
   tests into `grade10-spec`; add the spec-scope skill and parity metadata.
4. Land the `grade10-spec` groups on the standalone store's `main` before
   changing `grade10`.
5. Narrow the `grade10` skill to product scope and remove duplicated helpers,
   references, tests, and package script.
6. Run fixture-based cross-scope verification followed by separate read-only
   live captures for `spec` and `product`. Confirm zero cross-scope findings,
   removals, and orphans; perform no acceptance.

Rollback restores the product-local helper and original skill before reverting
the store command changes. The additive baseline `scope` fields may remain
during a product rollback; removing them is a separate mechanical revert after
no scoped transaction is active. Temporary observations are discarded and
recaptured after either direction of the migration.
