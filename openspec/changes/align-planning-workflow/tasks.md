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

## 4. The PRD stays the essence (grade10-spec)

- [ ] 4.1 `docs/governance/writing.md`: the first Placement rule is the test a line passes to sit on a page, a closed set is stated whole only where the reader meets it, one 🚧 line per outcome, a `Cut` step opens the checklist, and Enforcement names `dense`
- [ ] 4.2 `docs/governance/prd-and-openspec.md`: a `What Does Not Go on the PRD` table, one row per hand, and the PRD's typical-content row no longer lists journeys and cases
- [ ] 4.3 `docs/prds/guides/writing-the-manual.md`: the page is the essence, a 🚧 inside a step is a scenario wearing a mark, `::cases` is how a page shows its suite, and the engineer block example is a code map
- [ ] 4.4 The `planning-pm`, `planning-design`, `planning-qa`, `planning-dev`, `prd-authoring`, `writing-style` and `openspec-apply-change` skills carry each hand's threshold and the `Cut` pass; `AGENTS.md` names the test and the `dense` warning
- [ ] 4.5 `tools/manual/check/dense.mjs`: a warning-level rule for a page past 120 lines of prose outside its examples and details, a section opening on more than six sentences, an engineer block holding a paragraph, and a 🚧 inside a flow step or mid-line; tests in `tools/manual/test/check-dense.test.ts`
- [ ] 4.6 The KYC page's `Service design` engineer block moves to `docs/references/kyc-service-design.md`, linked from its code map
- [ ] 4.7 Verify: `pnpm check:manual` reports no failure, `pnpm --dir tools/manual test` passes, `pnpm run agent:check-parity` passes

## 5. Less to read, less to churn (grade10-spec)

- [ ] 5.1 `.github/workflows/design-sync.yml`: the commit step diffs the report with `generatedAt` ignored, and a run that moved no verdict commits nothing
- [ ] 5.2 `docs/governance/specs-to-test-cases.md`: every rule once, under 450 lines, the format the validator reads unchanged
- [ ] 5.3 `.claude/skills/spec-to-tcs/SKILL.md` and `.claude/skills/tcs-review/SKILL.md`: the steps, the commands and the rules only the skill holds; every restated rule becomes a pointer to the doc
- [ ] 5.4 `openspec/config.yaml`: every key kept; a rule a skill or AGENTS.md states becomes a pointer; `openspec validate` and `openspec instructions` unchanged
- [ ] 5.5 `docs/governance/agent-workflow-example.md` and `docs/prds/guides/working-a-change.md`: the prompts live in the guide once; the example keeps the commands, the record edits and where it goes wrong
- [ ] 5.6 Verify: `node scripts/openspec/validate-test-cases.mjs` reports the same counts as before, `pnpm run test:openspec` and `pnpm run agent:check-parity` pass, `pnpm check:manual` reports no new finding

## 6. One home per rule (grade10-spec)

- [ ] 6.1 `openspec/config.yaml` `rules.user-journeys`: the topic list becomes one line naming the schema instruction and the checks; `openspec/schemas/grade10-planning/templates/user-journeys.md` keeps the shape and points at the instruction for the rules
- [ ] 6.2 `.claude/skills/spec-to-tcs/SKILL.md` and `.claude/skills/tcs-review/SKILL.md`: step 0 reads the rulebook whole on every run; every bold pointer names a rulebook heading in its own casing
- [ ] 6.3 `docs/governance/specs-to-test-cases.md`: `The File Header` in Title Case; `The Format` names the one suite approved under the current revision as the case to copy
- [ ] 6.4 `scripts/openspec/instruction-budget.test.mjs`: fails a QA-skill pointer that names no rulebook section, and `AGENTS.md` or a `rules` block past its recorded word budget
- [ ] 6.5 `docs/governance/writing.md` gains `Where a Rule Lives`; `AGENTS.md` names the `dense` budget by its home instead of enumerating it
- [ ] 6.6 Verify: `pnpm run test:openspec`, `pnpm run agent:check-parity` and `pnpm check:manual` pass; `openspec instructions user-journeys` renders every journey rule once
