# TCS Run-Sheet Follow-ups

## Printing

- [x] Keep the snapshot, eligibility, provenance and execution-record boundary in governance; move operational instructions to the skill
- [x] Define property filters, explicit ids, capability/domain scope and changed-since selection; preserve human confirmation before Sheet writes
- [x] Record intentional exclusions with reasons; allow several ids to share a reason
- [x] Keep a temporary production run record; create one message-only print commit only after finalization; detect unchanged prints and protect merged runs
- [x] Preserve run id, spreadsheet id, tab name and `gid`, environment, source commit, requested scope, ordered selected ids and excluded ids
- [x] Stop on renamed or deleted tabs and report their expected identity and link
- [x] Copy a merged run's selection into a new run against current suites; stop on missing or deprecated ids
- [x] Fill single-row and shared test data in Steps and Expected Results; retain Pre-conditions and normalize unresolved placeholders
- [x] Group selected cases by specs folder and sort US/TC numerically; append the trace marker suffix to the displayed id
- [x] Test selection, provenance, finalization, overwrite identity, unchanged content, missing tabs and commit replacement

## Execution and Triage

Answered on the [Release Phases](docs/prds/products/shared/planning/release-phases.md#results) page.

- [x] Define how automated and manual results combine without treating unreliable automation as a human verdict - decided 2026-11-03: **One Verdict per Row**
- [x] Define false-positive fields and ownership for `blocked`, `fail` and `skipped` - built on the run desk: **Triage** on each marked cell, filtered by mark and surface (flaky on the automated columns only, deferred on a skip only, no "not a bug"), whose next step falls to a team-map role or to the bug issue's assignee
- [x] Decide whether per-row cases need row-level failure identity in Summary - yes, built as **Row Identity**; run 5 printed `g10.store-cart.TC1` three times under one id
- [x] Add tests for the settled triage rules

## Phases, Readiness and the Run Desk

Planned on the [Release Phases](docs/prds/products/shared/planning/release-phases.md) page. The run desk replaces the Sheet as the place results are marked, keeping QA's words but not the spreadsheet's shape.

- [x] Select by phase, release priority and readiness (`--phase`, `--release-priority`, `--ready`, `--section`), resolving to explicit ids through the manual's own unit reader; `--ready` means reviewed or further
- [x] Record `Phase: <id>` in the print commit of a run selected by phase, so its reasoned exclusions leave a capability's cases out of that phase's unit
- [x] Re-run the failed and blocked rows of a run as a new run (`--rerun <run> --only fail,blocked`)
- [x] Open a confirmed selection as a run on the run desk instead of printing a tab; keep the dry run, the fingerprint and the print commit, which names the run in place of the sheet and tab
- [x] Mark on the desk as a run list beside the case: walks first, the rules a case checks, steps beside expectations, the suite's own row table, the Summary's per-surface counts; marking from the list; no grid view
- [x] Keep the real test data objects each row used, offering earlier values without assuming them
- [x] Triage and Issue on every marked cell, the expectation that broke, the row named on each expanded per-row case, and a prefilled bug report from a failed row carrying the objects it used
- [x] Walk a fixed row again in place until the run closes, at the same case revision
- [ ] An Access service token for the run sheet, the release command and the finalized-run check to reach the desk - blocked on the repository secrets `CF_ACCESS_CLIENT_ID` and `CF_ACCESS_CLIENT_SECRET`
- [ ] Retire the Sheets writer, its layout and its Google identity once a phase has passed on the run desk - the writer stays until then
- [ ] Before releasing Internal Consignment or Pre-Store Launch, split the blocks on `site/carried-surfaces.md`, `loyalty/coupons.md` and `loyalty/shopify-integration.md`: an earlier phase's lines sit under a later phase's block beside lines no rule names, so `phase:release` refuses them and names each line
