# Tasks

Built in one pass from the landed proposal and decisions; no `/planning-dev`
run (`Q8`).

## 1. One reading of what is issued (grade10-spec)

- [x] 1.1 `issuedIds`, `issuedIdsIn`, `idsInText`, `issuedKey` and `heldElsewhere` in `tools/manual/src/store/issued-ids.mts`: journeys, scenarios and cases by their headings at every suite level, a `## REMOVED` section retired, `## ADDED` apart from a restatement, a case's `<v>` stripped and a journey's spelling folded, each with its trace id
- [x] 1.2 The `issued` check holds case numbers through `heldElsewhere` and names `pnpm run spec:issue move <change>` in every refusal - `shared-planning-agent-rounds-SC-123`
- [x] 1.3 Tests in `tools/manual/test/check-manual.test.ts`: a case issued twice under two trace ids across suite levels refused, a carried case passing, and the move command named

## 2. The command (grade10-spec)

- [x] 2.1 `scripts/openspec/spec-issue.mjs` (`pnpm run spec:issue`): the next `US`, `SC`, `TC` and letter from the branch and the fetched `main`, read in one `cat-file` batch, printing the commit read - `shared-planning-agent-rounds-SC-121`
- [x] 2.2 `spec:issue move <change>`: the change's ids `main` as the branch would leave it holds, journeys first, rewritten in both spellings inside the change only - `shared-planning-agent-rounds-SC-122`
- [x] 2.3 Tests in `scripts/openspec/spec-issue.test.mjs` over a store with a published `main` and a branch

## 3. Acceptance and the trace CLI (grade10-spec)

- [x] 3.1 `acceptanceGate` and `acceptChange` refuse an id the fetched `main` holds, naming who holds it and the move command, before a fingerprint is written - `shared-planning-agent-rounds-SC-124`
- [x] 3.2 `trace init` reuses the trace id a copied record's readable id holds and refuses one held with no marker or under more than one - `shared-planning-agent-rounds-SC-125`
- [x] 3.3 Tests: `scripts/test-traceability/trace.test.mjs` for the carried case and the bare one
- [x] 3.4 The rules name the command: `docs/governance/specs-to-test-cases.md`, `docs/governance/test-traceability.md`, `openspec/config.yaml`'s scenario rule and `tcs-review`
- [x] 3.5 The collision the store already held: `hold-acceptance-on-material-questions` and this change both issued `shared-planning-agent-rounds-US-20` and `US-21`; the first moved to `US-23` and `US-24` with `spec:issue move`
- [x] 3.6 Verify: `pnpm run test:openspec`, `pnpm --dir tools/manual test`, `node --test scripts/test-traceability/trace.test.mjs`, `pnpm check:manual`

## 4. The walk (grade10-spec)

- [ ] 4.1 Walk the journeys once by hand: a hand issues an id beside another open change, lands a branch second and moves its ids, and copies a case into a second change; the cases stay manual with the reason on each — blocked: a walk by the human hands on two real branches; the command and its refusals are proved by `spec-issue.test.mjs`, `check-manual.test.ts` and `trace.test.mjs`
