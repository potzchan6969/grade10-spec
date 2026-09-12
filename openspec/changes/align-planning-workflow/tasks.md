# Tasks: align the planning workflow

Every group lands in this store. No deploy is owed.

## 1. Unbreak main (grade10-spec)

- [ ] 1.1 Retag every group of `openspec/changes/backfill-feature-tcs-suites/tasks.md` `(grade10-spec)`, so `node tools/manual/check/check-manual.mjs` reports no `design` failure
- [ ] 1.2 In `tools/manual/check/record.mjs`, name a tag that is a product under `openspec/specs/` for what it is, with a test in `tools/manual/test/check-manual.test.ts`
- [ ] 1.3 In `docs/governance/task-ownership.md`, say a trailing parenthetical is a clone name only, and add the two mis-tags to the parser table
- [ ] 1.4 Verify: `pnpm check:manual` passes and `pnpm --dir tools/manual test` passes

## 2. One set of rules (grade10-spec)

- [ ] 2.1 `docs/prds/guides/working-a-change.md`: QA reviews the suite the PM derived, `tasks.md` carries no archive hand-copy, and the turn table gains the unmarked page and the draft suite
- [ ] 2.2 `tech-design.md` reads as owed by work outside this store in `docs/prds/guides/working-a-change.md`, `.claude/skills/openspec-propose/SKILL.md` and `AGENTS.md`
- [ ] 2.3 `.claude/skills/planning-qa/SKILL.md`: review the feature suite, own the passes above it, which live beside the durable specs
- [ ] 2.4 `.claude/skills/planning-pm/SKILL.md`: four artifacts, pages marked before the change is opened, and what to do when the capability has no page
- [ ] 2.5 `docs/governance/agent-workflow-example.md`: the PM lane leaves four files; the engineer writes `tech-design.md` and `tasks.md` only
- [ ] 2.6 `openspec/README.md` names the `planning-*` skills, `openspec/config.yaml` names `docs/prds/`, and `.claude/skills/openspec-archive-change/SKILL.md` carries the suites across
- [ ] 2.7 `docs/governance/prd-and-openspec.md`: one table of every `.openspec.yaml` key
- [ ] 2.8 `AGENTS.md`: what `check:manual` refuses, the CLI, and the validation rows for `check:manual`, `plan:preflight`, `archive:preflight` and `test:openspec`
- [ ] 2.9 Verify: `pnpm run agent:check-parity` and `pnpm check:manual` pass

## 3. Guardrails (grade10-spec)

- [ ] 3.1 `package.json` gains an `openspec` script pinned to `@fission-ai/openspec@1.8.0`; `scripts/openspec/openspec-version.test.mjs` holds it and both workflows to one version
- [ ] 3.2 `tools/manual/src/store/read-changes.mts` reads an owner tag per `task-ownership.md`: `@` optional, `.` allowed, case-insensitive, `unassigned` is nobody; tests in `tools/manual/test/store-changes.test.ts`
- [ ] 3.3 Verify: `pnpm run test:openspec` and `pnpm --dir tools/manual test` pass
