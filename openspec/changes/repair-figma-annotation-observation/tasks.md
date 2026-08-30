## 1. Normalize multi-source observation evidence (grade10-spec)

- [ ] 1.1 Add the temporary observation schema-version-2 root contract with
  unique node IDs, canonically ordered `sources`, matching skipped-root shape,
  and unchanged durable baseline registrations, making `One category catalog
  resolves many annotations`, `Unresolved registered root is skipped`, and
  `Every registered root is unresolved` pass for repeated registrations.
- [ ] 1.2 Preserve nearest-parent-first ancestor chains, reject duplicate
  ancestor IDs, and make the store the sole observation digest authority so
  `Observation changed before acceptance` distinguishes stale evidence without
  rejecting a complete producer payload.
- [ ] 1.3 Expand every observed root into all registered-source records before
  comparison and reporting, including orphan and skipped-root evidence, making
  `Exact active change reference is found`, `Actionable findings are reported`,
  and `Unresolved registered root is skipped` retain both audit and Code Connect
  provenance.
- [ ] 1.4 Update design-sync governance for schema version 2, unique traversal
  roots, ordered ancestors, store-generated digests, and compact complete
  evidence without changing baseline acceptance or transaction semantics.
- [ ] 1.5 Verify the group with focused schema, multi-source, ancestor-order,
  digest, orphan, and skipped-root fixtures; `pnpm test:design-sync`; `pnpm run
  lint`; `pnpm run typecheck`; and `git diff --check`.

## 2. Capture unique and stable Plugin API evidence (grade10)

This group depends on group 1 being available in the standalone registered
`grade10-spec` store. It does not require an `external/grade10-spec` submodule
update.

- [ ] 2.1 Replace configured traversal roots with flat registrations and
  baseline-tracked node IDs, group registrations by file and normalized node
  ID, and resolve each unique root once, making `One category catalog resolves
  many annotations`, `Unresolved registered root is skipped`, and `Every
  registered root is unresolved` pass without losing source evidence.
- [ ] 2.2 Merge nodes independently of root traversal, union their registered
  root IDs, block inconsistent repeated evidence, and record each annotation
  occurrence once, making `Duplicate multiplicity decreases`, `Several
  unmatched siblings are ambiguous`, and `Annotation structure changes`
  operate on Figma multiplicity rather than traversal multiplicity.
- [ ] 2.3 Emit only annotation-bearing and baseline-tracked nodes while keeping
  tracked zero-annotation nodes and orphan evidence, making `Accepted node no
  longer resolves`, `Only line-ending representation differs`, and `No tracked
  annotations changed` preserve complete removal behavior in a bounded payload.
- [ ] 2.4 Remove producer-side digest generation and unsupported all-page
  loading, require one complete file-level Plugin API capture, and block
  unavailable, inconsistent, or truncated evidence, making `Figma Plugin API
  access is unavailable` and `Observation changed before acceptance` use the
  registered store's canonical evidence.
- [ ] 2.5 Render every source associated with findings and skipped roots, then
  update the portable adapter reference and skill guidance so `Human report is
  structured for reading`, `Actionable findings are reported`, and `A supported
  harness opens the annotation workflow` describe the schema-version-2 path.
- [ ] 2.6 Verify the group with focused duplicate-registration,
  overlapping-root, one-catalog-read, tracked-removal, inconsistent-node,
  unsupported-operation, report, and blocked-transport tests; run one read-only
  live registered-file capture in a single Plugin API invocation, materialize
  its complete temporary schema-version-2 snapshot, and pass that snapshot
  through the registered store to confirm unique roots, preserved sources, one
  category read, non-duplicated occurrences, and stable diff and acceptance
  digests; then run `pnpm run test:tooling`, `pnpm run agent:check-parity`,
  `pnpm run lint`, `pnpm run typecheck`, and `git diff --check`.
