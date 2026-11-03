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

Each item has a proposed answer on the [Release Phases](docs/prds/products/shared/planning/release-phases.md#results) page, marked ❓ until QA confirms it.

- [ ] Define how automated and manual results combine without treating unreliable automation as a human verdict - proposed: **One Verdict per Row**
- [ ] Define false-positive fields and ownership for `blocked`, `fail` and `skipped` - proposed: **Triage**, with the owner read from the delivering change's hands
- [ ] Decide whether per-row cases need row-level failure identity in Summary - proposed: yes, **Row Identity**
- [ ] Add tests for the settled triage rules

## Phases and Readiness

Planned on the [Release Phases](docs/prds/products/shared/planning/release-phases.md) page.

- [ ] Select by phase, release priority and readiness (`--phase`, `--release-priority`, `--ready`, `--section`), resolving to explicit ids through the manual's own unit reader
- [ ] Re-run the failed and blocked rows of a finalized run as a new run (`--rerun <run> --only fail,blocked`)
- [ ] Add Triage and Issue cells after Auto mobile, and name the row on each expanded per-row case
- [ ] Read the marks of finalized runs read-only into the manual's build; refresh when QA publishes results and on a schedule
