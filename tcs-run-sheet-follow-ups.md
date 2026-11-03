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
- [ ] Define false-positive fields and ownership for `blocked`, `fail` and `skipped` - proposed: **Triage**, whose next step falls to a team-map role or to the bug issue's assignee
- [ ] Decide whether per-row cases need row-level failure identity in Summary - proposed: yes, **Row Identity**
- [ ] Add tests for the settled triage rules

## Phases, Readiness and the Run Desk

Planned on the [Release Phases](docs/prds/products/shared/planning/release-phases.md) page. The run desk replaces the Sheet as the place results are marked.

- [ ] Select by phase, release priority and readiness (`--phase`, `--release-priority`, `--ready`, `--section`), resolving to explicit ids through the manual's own unit reader
- [ ] Re-run the failed and blocked rows of a run as a new run (`--rerun <run> --only fail,blocked`)
- [ ] Open a confirmed selection as a run on the run desk instead of printing a tab; keep the dry run, the fingerprint and the print commit, which names the run in place of the sheet and tab
- [ ] Triage and Issue on every row, and the row named on each expanded per-row case
- [ ] Retire the Sheets writer, its layout and its Google identity once a phase has passed on the run desk
