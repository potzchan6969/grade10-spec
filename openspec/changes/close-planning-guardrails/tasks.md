## 1. Store checks (grade10-spec)

- [ ] 1.1 Read `page_waived`, `design_waived`, `deployed_at`, `deployed_env`, `deploy_waived`, `tasks_waived` from `.openspec.yaml` into `ChangeEntry` in `read-changes.mts`; carry each mark's `##` section on `OpenMark`
- [ ] 1.2 Add `tools/manual/check/record.mjs` with the `unmarked`, `design` and `archived` rules, registered in `RULES`, with `readArchivedChanges` wired into `check-manual.mjs`
- [ ] 1.3 Tests in `check-manual.test.ts`: each rule's pass, refusal, and waiver; a change linking a section with no 🚧; a mark above any heading; a store-only archive; an archive with no manifest
- [ ] 1.4 Make `archive-preflight.mjs` write the deploy record into the manifest, take `--deployed-env` and `--tasks-waived`, refuse unchecked tasks, and print the commit to make
- [ ] 1.5 Add the `openspec` job to `.github/workflows/lint.yml`
- [ ] 1.6 Write `page_waived` and `design_waived` into every in-flight manifest the rules fail, then run `pnpm check:manual`, `pnpm --dir tools/manual test`, and `openspec validate --changes --strict`

## 2. Store prose (grade10-spec)

- [ ] 2.1 Name the rules, the waivers and the deploy record in `docs/governance/prd-and-openspec.md`; rewrite the `tech-design` entry in `schema.yaml` and `planning-dev` to match the `design` rule
- [ ] 2.2 Point `openspec-archive-change` at `pnpm plan shipped` and the manifest record
- [ ] 2.3 Run `pnpm check:manual` and `pnpm run agent:check-parity`

## 3. The plan command (grade10)

- [ ] 3.1 Add `shipped` to `scripts/openspec/plan.mjs`: deploy run lookup, merge-commit resolution from the PR footer, ancestry check, store preflight in place, commit and push of the manifest
- [ ] 3.2 Board: planning age, all-done line, waiver count; `done` prints the `shipped` line
- [ ] 3.3 Run `pnpm plan board`, `pnpm plan shipped` on an archived change with `--merged`, and `pnpm run lint`

## 4. Skills and conventions (grade10)

- [ ] 4.1 `planning-pm`: one sentence that the pages are marked and linked before the deltas, naming the rule and the waiver
- [ ] 4.2 `planning-dev`: the design decision, and `pnpm plan done` as each task lands
- [ ] 4.3 `archive-change`: `pnpm plan shipped` in place of the hand-typed commands; drop the dead jobs query; "the capability's page"
- [ ] 4.4 `reality-sweep`: read `docs/prds/products/` on `origin/main`; lane (c) becomes page silent
- [ ] 4.5 `pr-push` description rules: the `Change: <change-id>` footer and the trimmed `Also includes:` line; `review-changes`: read a `page_waived` line; `dev-help` rows
- [ ] 4.6 `AGENTS.md` planning section: claim, check off, ship, and "the capability's page"; `validation.md` one row; `development.md` names which manual `check:manual` checks
- [ ] 4.7 Run `pnpm run agent:check-parity`
