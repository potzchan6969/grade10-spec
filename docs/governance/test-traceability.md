# Test Traceability

The trace CLI joins selected OpenSpec scenarios, feature cases, and application tests from markers beside their source records. The source files carry the graph; there is no central registry.

## Markers

Place each marker immediately above the heading or test line it belongs to:

```markdown
<!-- trace:scenario id=g10.auction-listing-media.SC-c93 rev=1 -->
#### Scenario: The gallery refuses a ninth media item

<!-- trace:case id=g10.auction-listing-media.TC-c94 rev=2 covers=g10.auction-listing-media.SC-c93 -->
### The gallery refuses a ninth media item
```

```ts
// trace:acceptance=g10.auction-listing-media.TC-c94@2
test("the gallery refuses a ninth media item", () => {});

// trace:supports=g10.auction-listing-media.SC-c93
test("supporting gallery behavior", () => {});
```

- **Reference** - `<app>.<product>-<capability>.<US|SC|TC>-<seq>`. Apps are `g10`, `zzz`, `g10adm`, and `zzzadm`. `US` identifies a journey, `SC` a scenario, and `TC` a test case. The CLI creates `SC` and `TC` markers.
- **Casing** - App, product, capability, and sequence are stored in lowercase. Product and capability are lowercase hyphenated slugs. The kind token is uppercase. CLI inputs are case-insensitive and are written in canonical casing. A stored marker with different casing fails validation as `noncanonical-id`.
- **Capability slug** - The capability slug stays stable across its journeys, scenarios, and cases. Put behavior-specific meaning in the heading, not in the identifier.
- **Sequence** - Exactly three Base36 characters (`000` to `zzz`), stored in lowercase. Initialization derives a non-numeric candidate from the scope, kind, and exact heading, then advances only to avoid an existing scenario or case marker in that app, product, and capability. The sequence is shared by `SC` and `TC` markers. The scan includes durable specs, active changes, and archived changes so an archived marker does not free its suffix.
- **Scenario id** - An `SC` reference identifies one scenario. A scenario marker carries its positive `rev`.
- **Case id** - A `TC` reference identifies one case. `covers` lists one or more `SC` references separated by commas. A case can cover scenarios from any app, product, or capability, and a scenario can be covered by multiple cases.
- **Revision** - A positive integer, starting at `1`. Increase it when the scenario or case meaning changes. A case marker's `rev` equals the `<v>` suffix of the case heading below it, and the two move together; `pnpm run tcs:validate` refuses a pair that differs. An acceptance test names the exact current case revision; `supports` names a scenario directly.
- **Markdown scope** - All scenario and case marker ids in one Markdown file share one app, product, and capability prefix. Application test files can link markers from multiple scopes.

## Commands

Run the CLI from this repository:

```sh
pnpm run trace -- init scenario --file openspec/specs/<path>/spec.md --target '#### Scenario: Exact existing heading' --app g10 --product auction --capability listing-media --dry-run
pnpm run trace -- init case --file openspec/specs/<path>/feature-tcs.md --target '### Exact existing case heading' --app g10 --product auction --capability listing-media --covers g10.auction-listing-media.SC-c93 --dry-run
pnpm run trace -- link --file <app-test-file> --target '  test("exact test title", () => {});' --acceptance g10.auction-listing-media.TC-c94@2 --dry-run
pnpm run trace -- link --file <app-test-file> --target '  test("supporting behavior", () => {});' --supports g10.auction-listing-media.SC-c93 --dry-run
pnpm run trace -- validate --app-root <grade10-app-root>
pnpm run trace -- fold --change <change-id>
pnpm run trace -- report --app-root <grade10-app-root>
```

From a Grade10 app checkout, use the spec-store checkout explicitly:

```sh
pnpm --dir <grade10-spec-root> run trace -- validate --app-root "$PWD"
```

`--target` matches the entire source line. Mutating commands require `--file` and `--target`, refuse a missing or ambiguous target, and insert one adjacent marker. `init` requires `--app`, `--product`, and `--capability`; it derives a stable non-numeric sequence within that full scope and accepts those values in any casing. `--covers`, `--acceptance`, and `--supports` resolve references without regard to input casing and write canonical values. `--dry-run` prints the proposed marker without writing. Case initialization and test linking also require referenced ids to resolve to one record.

`validate` scans durable specs and active changes under the store, then source files under `--app-root`. It excludes archived changes and generated or third-party directories. It checks duplicate ids, unknown apps, malformed or non-positive revisions, malformed markers, noncanonical casing, mixed marker scopes within a Markdown file, unresolved references, marker adjacency, and acceptance links whose revision no longer matches the case. Invalid links return a non-zero exit code. Unlinked scenarios and cases are reported as rollout information and do not fail validation.

`fold --change <id>` checks the pre-archive handover for one active change. For each `openspec/changes/<id>/specs/<product>/<domain>/<capability>/feature-tcs.md`, it reads the matching durable suite under `openspec/specs/`. Every active case marker must appear exactly once there with the same `id`, `rev`, and ordered `covers` values. Each active case's `covers` references must resolve to a scenario marker anywhere in the active or durable store. Missing, changed, or duplicate durable case markers and unresolved references fail the command. Use `--store-root` for an alternate store or an isolated fixture.

`validate` remains strict across active and durable files, so it can report the deliberate case marker duplication before archive. `fold` is the transitional validator for that handover; run `validate` after archive.

`report` lists the records and links and calls out unlinked records. A scenario is unlinked when no case covers it and no test supports it. A case is unlinked when no current acceptance test accepts it. Pass `--json` for structured output. `--store-root` selects another store root, chiefly for isolated fixtures.

## Lifecycle

The first interface creates scenario and case markers and links tests. It has no revision or retirement command. Edit a marker's `rev` as part of the reviewed behavior change, then update acceptance links to the new case revision. Use the normal OpenSpec and test-case lifecycle to retire behavior; keep decisions about retirement in those artifacts. The trace CLI does not rewrite headings, scenario prose, case steps, or tests.
