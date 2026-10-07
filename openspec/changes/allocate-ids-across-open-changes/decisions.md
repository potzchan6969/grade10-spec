## Goals

- No journey, scenario or case id is issued by two open changes.
- An id taken twice on parallel branches is refused at the second landing,
  with the command that moves it, never at an acceptance.
- A scenario or case carried by two changes holds one trace id.
- A change written from the templates folds through acceptance, proven in CI.

## Non-Goals

- Renumbering an id already landed, accepted or archived.
- A new id form: the readable `US-<n>`, `SC-<n>` and `TC<m>` and the trace
  sequence stay as they are.
- A landing that rewrites a change's text on its own.
- Decision row numbers, which are already the change's own.
- Every acceptance-tool bug the batch met: the guard test holds what the
  templates write; the rest are bug fixes.
- Sorting Raised rows by whether they need the author, and moving a look off
  the page into `ui-design.md`: each is its own change.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | What keeps two open changes from issuing one id? | Read the open changes: a command issues the next id from the durable specs and every open and archived change on the capability - decided by the round | Change-scoped ids, which carry their change for life, break every reader of `SC-<n>`, or renumber at the fold against "an issued id is permanent"; a reservation file, a second record of what the headings say that drifts when an id is written by hand, and whose conflict arrives at the same rebase the `issued` check already runs at |
| Q2 | What keeps it deterministic when two branches are worked at once? | Landing order: the first branch to land keeps its ids; the second is refused at its landing by the `issued` check, which `pnpm push:main` runs after its rebase - decided by the round | Reading every pushed branch, which depends on what was pushed and fetched, so two runs disagree; refusing at the fold, after suites, plans and an acceptance fingerprint cite the ids |
| Q3 | Who moves the second branch's ids? | The engineer, with one command the refusal names; it moves the branch's unlanded ids above `main`'s and rewrites their citations inside the change, and nothing outside the change cites an unlanded id - decided by the round | `pnpm push:main` moving them itself, which lands text nobody read; moving them by hand, as the batch did for eight scenario ids |
| Q4 | Which ids does the command issue? | Journey `US-<n>`, scenario `SC-<n>` and case `TC<m>` at every suite level; the trace CLI keeps its own sequence - decided by the round | Scenario ids alone, which leaves the case number, which the `issued` check does not read today |
| Q5 | What id does a record copied into a second change take? | The trace id the same heading already holds in its scope, in the durable spec or an open change - decided by the round | A fresh id, as `trace init` issues today, so one scenario carries two |
| Q6 | How is a template form the fold refuses caught? | A test scaffolds a change from `openspec/schemas/grade10-planning/templates`, fills each placeholder, and folds it through acceptance under `pnpm run test:openspec` in CI - decided by the round | A fixture written by hand, which tests the fold against the form its author remembered, not the one the templates write |
| Q7 | Where the templates and the fold disagree, which one changes? | The fold accepts every form the templates write, starting with an untitled delta, since 46 of 106 open deltas were written from that template - decided by the round | A title added to the template, which leaves those 46 deltas refused |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
