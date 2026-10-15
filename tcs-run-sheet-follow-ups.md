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

- [ ] Define how automated and manual results combine without treating unreliable automation as a human verdict
- [ ] Define false-positive fields and ownership for `blocked`, `fail` and `skipped`
- [ ] Decide whether per-row cases need row-level failure identity in Summary
- [ ] Add tests for the settled triage rules
