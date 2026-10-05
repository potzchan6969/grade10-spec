# A change from proposal to archive

This example follows one change in `grade10`, from the product brief through
acceptance, implementation, verification, and archive. The product example is
cross-sell on a card's page. See [Working a change](../prds/guides/working-a-change.md)
for its product detail.

## Open the Change

Everyone works in `grade10`, including PM and design. Its `openspec/` is
config-only with `store: grade10-spec`. OpenSpec commands run from the app
resolve to the store clone, where the change, durable specs and acceptance
records live.

Give the agent the store clone before drafting. Never edit the submodule pinned
inside the app repository; it may be an older SHA and the change would be
invisible to the store tools.

The PM starts with one brief:

```text
/workflow-plan cross-sell on a card's page: complementary products picked per
card in Shopify first, then similar cards by tags and shared facets, up to six.
Customers-also-bought from orders is phase two.
```

The planning command creates a `grade10-planning` change, then writes the
proposal, decisions and journeys. The capability is
`grade10-site/store/cross-sell`, with a delta on
`grade10-site/store/product-page` for the rail's placement. The PM answers the
interview questions and records the decisions. A designer adds `ui-design.md`
when the change alters a user-facing surface.

## Plan and Accept

Run `/planning-dev add-store-cross-sell` once the PM and designer artifacts are
ready. The run fixes the anchor set, which combines the full journey set with
the root groups of `## Feature set`.

1. **QA1** - A fresh isolated agent reads the approved planning input and writes
   blind draft cases. It cannot read requirements, scenarios, technical design,
   QA2 output or archived changes.
2. **Dev** - A separate fresh agent writes `tech-design.md`, the requirement
   scenarios and `tasks.md`. It does not see QA1's cases until this independent
   draft is complete.
3. **QA2** - A fresh reviewer compares cases and scenarios against the same
   anchors, records each disposition in `feature-tcs.md`, and raises unsettled
   questions. If an answer changes anchors, discard both readings and restart
   them with fresh contexts. Other edits get a fresh QA2 comparison.

The same human answers questions that affect the product, design or plan. After
the run resolves every such question, check and accept the completed artifacts:

```bash
pnpm accept:preflight add-store-cross-sell
pnpm spec:accept add-store-cross-sell --baseline <printed-baseline> --reviewed-by <human>
```

Acceptance records the reviewer, timestamp, baseline fingerprint, artifact
hashes and derived contract targets in `acceptance.json`; it also publishes the
requirements and companion artifacts into `openspec/specs/` before
implementation. The accepted snapshot preserves planning evidence. The first
task claim records the durable store commit and those targets. An amendment
names the prior fingerprint with `--supersedes <old-fingerprint>` and keeps
earlier accepted snapshots.

New cases stay draft. Planning does not ask a human QA reviewer to approve or
execute them. The same human's final acceptance covers the complete planning
output, including QA1 and QA2.

## Implement and Archive

The application repository has no planning store of its own; it reads tasks and
accepted contracts from this store. The first claim records the durable baseline
and target scope. Claim and complete task groups there with
`/workflow-build add-store-cross-sell <group>`, keeping checks and implementation
commits linked to the historical accepted fingerprint and that baseline.

After engineering verification, record implementation provenance in the app
repository:

```bash
pnpm plan implementation add-store-cross-sell --commit <sha> --component <deploy-component>
```

The command completes `implementation.json` with the repository commit and
concrete deploy component. Archive the change after this verification and before
deployment:

```bash
pnpm run archive:preflight add-store-cross-sell
pnpm openspec archive add-store-cross-sell
```

Archive compares the claim baseline with the current durable targets. Every
difference needs a compatibility acknowledgement; a semantic difference names
test or other evidence. Archive preserves the accepted and implementation
records. It does not fold requirements into durable specs a second time and does
not wait for deployment. Deployment availability is tracked separately. After
deployment makes the implementation available, human QA reviews the cases with
`/tcs-review` and uses `/tcs-run-sheet` for manual execution where needed. A QA
classification is not a test result.

## Where This Goes Wrong

- **Drafting from the pinned submodule** - give the agent the store clone and
  edit only that clone.
- **Changing an anchor after QA1 or Dev starts** - invalidate both readings and
  restart them with fresh isolated agents.
- **Accepting with open product or technical questions** - resolve them with
  the same human before `pnpm spec:accept`.
- **Treating the accepted snapshot as an implementation lock** - preserve it as
  planning evidence, record the baseline at first claim, and reconcile only the
  claimed targets at archive.
- **Waiting for deployment to archive** - archive after engineering
  verification and before deployment; QA review follows when the application is
  available.

## See Also

- [Working a change](../prds/guides/working-a-change.md) - artifacts, stages and
  the human handoff
- [PRDs and OpenSpec](prd-and-openspec.md) - sources of truth and lifecycle
- [Task ownership](task-ownership.md) - parsed task-group and owner format
- [UI component contracts](ui-component-contracts.md) - public component exports
