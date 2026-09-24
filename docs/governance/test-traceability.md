# Test Traceability

The trace CLI joins selected OpenSpec scenarios, feature cases, and application tests from markers beside their source records. The source files carry the graph; there is no central registry.

## Markers

Place each marker immediately above the heading or test line it belongs to:

```markdown
<!-- trace:scenario id=scn_<stable-id> key=visitor-signs-in rev=1 -->
#### Scenario: Existing scenario heading

<!-- trace:case id=tcase_<stable-id> rev=1 covers=scn_<stable-id> -->
### Existing case heading
```

```ts
// trace:acceptance=tcase_<stable-id>@1
test("the case's full outcome", () => {});

// trace:supports=scn_<stable-id>
test("a supporting behavior", () => {});
```

- **Scenario id** - `scn_` plus an immutable generated id. The semantic `key` is editable and names the behavior in plain words. It is not a cross-artifact reference.
- **Case id** - `tcase_` plus an immutable generated id. `covers` names one or more `scn_` ids, separated by commas.
- **Revision** - a positive integer, starting at `1`. Increase it when the scenario or case meaning changes. An acceptance test names the exact current case revision; `supports` names a scenario id directly.
- **Legacy identifiers** - existing `US`, `SC`, and `TC` headings and `**Trace:**` lines remain as they are. They do not become keys in this graph.
- **Scope** - initialize markers only for records whose app-test relationship needs stable tracking. Existing scenarios and cases are not backfilled by this change.

## Commands

Run the CLI from this repository:

```sh
pnpm run trace -- init scenario --file openspec/specs/<path>/spec.md --target '#### Scenario: Exact existing heading' --key visitor-signs-in --dry-run
pnpm run trace -- init case --file openspec/specs/<path>/feature-tcs.md --target '### Exact existing case heading' --covers scn_<stable-id> --dry-run
pnpm run trace -- link --file <app-test-file> --target '  test("exact test title", () => {});' --acceptance tcase_<stable-id>@1 --dry-run
pnpm run trace -- validate --app-root <grade10-app-root>
pnpm run trace -- report --app-root <grade10-app-root>
```

From a Grade10 app checkout, use the spec-store checkout explicitly:

```sh
pnpm --dir <grade10-spec-root> run trace -- validate --app-root "$PWD"
```

`--target` matches the entire source line. Mutating commands require `--file` and `--target`, refuse a missing or ambiguous target, and insert one adjacent marker. `--dry-run` prints the proposed marker without writing. Case initialization and test linking also require referenced ids to resolve to one record.

`validate` scans durable specs and active changes under the store, then source files under `--app-root`. It excludes archived changes and generated or third-party directories. It checks duplicate ids, malformed or non-positive revisions, malformed markers, unresolved references, marker adjacency, and acceptance links whose revision no longer matches the case. Invalid links return a non-zero exit code. Unlinked scenarios and cases are reported as rollout information and do not fail validation.

`report` lists the records and links and calls out unlinked records. A scenario is unlinked when no case covers it and no test supports it. A case is unlinked when no current acceptance test accepts it. Pass `--json` for structured output. `--store-root` selects another store root, chiefly for isolated fixtures.

## Lifecycle

The first interface creates scenario and case markers and links tests. It has no revision or retirement command. Edit a marker's `rev` as part of the reviewed behavior change, then update acceptance links to the new case revision. Use the normal OpenSpec and test-case lifecycle to retire behavior; keep decisions about retirement in those artifacts. The trace CLI does not rewrite headings, scenario prose, case steps, or tests.
