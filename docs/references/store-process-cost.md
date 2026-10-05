# Store Process Cost

What one accepted amendment cost in store commands, and seven proposals to cut
that cost. The counts come from one session on 2026-10-05; every line is cited
at store `main` `aea62226f`. No change carries the proposals yet; the accepted
rows become one change. QA1 and QA2 isolation, fingerprints, `rounds.md`
enforcement and immutable acceptance snapshots stay as they are.

❓ Chloe (QA) accepts or rejects each row on its own.

## Cost

| Measure | Value |
| --- | --- |
| One grading amendment, planning to acceptance | 0.8 h · 139 store commands |
| Its governance review | 86 more store commands |
| `validate:changes` runs per acceptance | 4 |
| `prepareAcceptance` and folded `tcs:validate` runs per acceptance | 3 each |

The `validate:changes` runs per acceptance:

1. **accept-review** - its machine gate runs `accept:preflight`
   (`.claude/skills/accept-review/SKILL.md` L34)
2. **planning-dev step 6** - runs `accept:preflight` again for the baseline
   (`.claude/skills/planning-dev/SKILL.md` L62-63)
3. **`spec:accept` before the fold** - `scripts/openspec/lib/acceptance.mjs`
   L1933-1936
4. **`spec:accept` after the fold** - the same file, L1952-1955

The acceptance outputs are then committed and pushed by hand: `plan:land`
carries an artifact's own files, the decisions and the linked pages, never the
fold (`scripts/openspec/plan-land.mjs` L536-543).

## Proposals

| # | Proposal | Cost driver today | Where | What stays for QA, and what it costs |
| --- | --- | --- | --- | --- |
| 1 | **Validate once at acceptance** - accept-review's report ends with its preflight's `Baseline:` line; planning-dev step 6 drops its own `accept:preflight` and passes that baseline to `spec:accept`; `spec:accept` checks its new `acceptance.json` with `verifyAcceptance` in process instead of a second `validate:changes` run | `validate:changes` 4 times, `prepareAcceptance` and folded suites 3 times | `.claude/skills/accept-review/SKILL.md` L62-77; `.claude/skills/planning-dev/SKILL.md` L62-65; `scripts/openspec/lib/acceptance.mjs` L1952-1955 | The baseline guard (`acceptance.mjs` L1903-1910) now holds the fold to the baseline the review read, where step 6 today takes a fresh one the review never saw. If durable specs move after the review, `spec:accept` refuses and accept-review runs again. The run before the fold still holds the CLI's strict validation and the `rounds.md` row checks, which the fold does not write; `check:manual` after the fold (L1951) stays |
| 2 | **Land several artifacts in one run** - `plan:land` takes several artifacts of one hand that have each passed their round, with one fetch, one rebase, one gate over the last tree and one push | Each landing fetches, rebases, runs the full gate and pushes | `scripts/openspec/plan-land.mjs` L3-7, L31-64 | Still one commit, one `landed_by:` and one `rounds.md` row per artifact; `behindOf` order runs per artifact. One hand per run, since the run resolves the hand once (L24-30). A landing bound to a wake stays one artifact per run until the relay takes a list. Commits before the last are not gated, but one fast-forward moves `main` past them all, so none is ever its tip |
| 3 | **`spec:accept` lands its own outputs** - a new acceptance landing kind in `plan:land`, whose hand is `--reviewed-by`, commits the fold and the acceptance record and pushes them through the gate | It writes and stops; the commit and push are by hand | `scripts/openspec/spec-accept.mjs` L26-37; `scripts/openspec/plan-land.mjs` L536-543; `.claude/skills/planning-dev/SKILL.md` L62-65 | The fold reaches `main` only after the gate every artifact passes. A refused gate or push restores every file `spec:accept` wrote, as its catch block does (`acceptance.mjs` L1957-1962); the snapshot and history files are written once (L1891-1892), so a rerun must start clean |
| 4 | **Scope accept-review to an amendment** - for an acceptance that names `--supersedes`, read every page linked to a capability whose delta differs from the superseded snapshot (`acceptance/<fingerprint>.snapshots.json`), and those capabilities' durable specs | It reads the whole change and every linked page, even for a small amendment | `.claude/skills/accept-review/SKILL.md` L16-30 | Checks 1 and 4, the overlapping-changes read (L29-30) and check 8 (L58-60) stay whole, since they catch conflicts; check 5 still reads each such capability's whole folded spec. A page on such a capability is read even when the amendment did not edit it, so a 🚧 line that loses its requirement is still found |
| 5 | **Fold conflicts print the text** - each refusal prints the current and the delta text of the requirement or Purpose it names, and the prior text where one exists | The message names the requirement only, so reconciling it takes several reads and retries | `scripts/openspec/lib/acceptance.mjs` L441-443, L450-452, L911-913, L926-928, L945-947 | The lost-update guards refuse exactly as today |
| 6 | **Write the durable-refinement procedure, and fix the archive step** - give the refinement its steps; replace `pnpm openspec archive` in the walkthrough with the `git mv` that `archive:preflight` prints | No procedure: the guide allows a refinement but says nothing of how. The walkthrough runs `openspec archive`, which folds the delta a second time; the application's `archive-change` skill (L31) forbids it | `docs/governance/prd-and-openspec.md` L106; `docs/governance/agent-workflow-example.md` L92; `scripts/openspec/archive-preflight.mjs` L358-363 | Archive still never folds; a refinement still reconciles at archive against the claim baseline |
| 7 | **Drop the extra preflight before a claim** - the application's `planning-dev` stops running `pnpm plan preflight` before `pnpm plan claim` | `claim` runs the same acceptance check itself | Application repository: `.claude/skills/planning-dev/SKILL.md` L24; `scripts/openspec/plan.mjs` L391 and L888 | `claim` still refuses a change with no valid accepted plan. The `implement` skill's preflight (L37) stays: it reviews provenance before anything is written |

## Related Work

Store CI is a separate change in flight, not proposed here: required checks on
store pull requests, a gate on `pnpm plan done` and `undone`, cancelling only
on pull-request refs, and a path filter on Test.
