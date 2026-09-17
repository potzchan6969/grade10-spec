# Tasks: sharpen the planning cross-check

Every group lands in this store. No deploy is owed.

## 1. The anchor names the walk (grade10-spec)

- [x] 1.1 `tools/manual/src/store/read-specs.mts` and `src/api/types.ts` read the prose after a `**Serves:**` anchor's dash back as `servesProse`
- [x] 1.2 `tools/manual/check/context.mjs`: `qualifiedAnchor`, `anchorRefusal` and `restatesAnchor`, with the `restates` rule registered at `fail`
- [x] 1.3 `tools/manual/check/qa.mjs` and `deltas.mjs` resolve `<product>/<domain>/<capability>#<journey-id>` against that capability's journeys — durable, and the change's own — and name a group anchor whose prose repeats the group
- [x] 1.4 Tests in `tools/manual/test/check-qa.test.ts`: a qualified anchor that resolves, one whose journey is not issued, one whose capability the store does not hold, and the three shapes of restating prose
- [x] 1.5 `openspec/specs/grade10-site/auction/order-status/`: the `**Also walked by:**` note comes off, seven rules take their post-sale and winner-order journeys, and the remaining group anchors say how the rule is reached

## 2. A raised question lands before the change merges (grade10-spec)

- [x] 2.1 `tools/manual/check/planned.mjs`: the `raised` and `asking` rules over `decisions.md`'s `## Raised` table, gated on the change carrying that file and on its requirements having landed
- [x] 2.2 `scripts/openspec/validate-test-cases.mjs` refuses a `## Raised` in a suite whose change carries a `decisions.md`, and keeps the empty-list warning for the suites written before it
- [x] 2.3 `schema.yaml`'s `decisions` and `test-cases` instructions, the `decisions.md` and `feature-tcs.md` templates, and `docs/governance/specs-to-test-cases.md`'s `## Raised`
- [x] 2.4 Tests in `tools/manual/test/check-planned.test.ts`: a landed row, a deferred row, a row that landed nowhere, a row naming a decision the table never issued, a missing table, an empty table, and both gates

## 3. Every design state reaches the requirements (grade10-spec)

- [x] 3.1 `tools/manual/check/planned.mjs`: the `dressed` rule over `ui-design.md`'s `## States` bullets, with the same two gates
- [x] 3.2 `schema.yaml`'s `ui-design` and `specs` instructions, the `ui-design.md` template, and `openspec/config.yaml`'s `ui-design` rules block
- [x] 3.3 Tests in `tools/manual/test/check-planned.test.ts`: a state closed by a scenario, one closed out of suite, one left open, and one wrapped over two lines

## 4. The skills say the same thing (grade10-spec)

- [x] 4.1 `planning-qa`: the three anchors, the group anchor's reach, the design-state walk in pass two, and where the raised questions go
- [x] 4.2 `planning-pm`: step 10, landing every raised row, and the row in `Where a statement belongs`
- [x] 4.3 `planning-design`: one state per bullet, and whose hand closes it
- [x] 4.4 `spec-to-tcs`: the questions go to `decisions.md`, never into the suite; `tcs-review`: check the landings before signing off
- [x] 4.5 Verify: `pnpm check:manual`, `pnpm run tcs:validate`, `pnpm --dir tools/manual test`, `pnpm run test:openspec`, `pnpm run lint`, `pnpm run typecheck` and `pnpm run agent:check-parity` report no new finding
