## Goals

- No journey, scenario or case id is issued by two changes that land.
- The landing or the acceptance that refuses an id another change holds names
  the command that moves the branch's own ids.
- A scenario or case carried by two changes holds one trace id.

## Non-Goals

- Renumbering an id already landed on `main`.
- A new id form: the readable `US-<n>`, `SC-<n>` and `TC<m>` and the trace
  sequence stay as they are.
- A landing that rewrites a change's text on its own.
- Decision row numbers, which are already the change's own.
- The acceptance-tool bugs the batch met, the untitled delta and the scenario
  id reused under `MODIFIED Requirements` among them: each is a bug fix, the
  first two on `fix/openspec-delta-sections`.
- Sorting Raised rows by whether they need the author, and moving a look off
  the page into `ui-design.md`: each is its own change.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | What keeps two open changes from issuing one id? | A command issues the next id from the branch's tree and the fetched `main`, and prints the commit it read: `US-<n>` and `SC-<n>` within the capability's prefix, `TC<m>` within its journey in its suite, and a suite's `e2e` journeys within that suite's prefix - decided by the round | Change-scoped ids, which carry their change for life, break every reader of `SC-<n>`, or renumber at the fold against "an issued id is permanent"; a reservation file, a second record of what the headings say that drifts when an id is written by hand, and whose conflict arrives at the same rebase the `issued` check already runs at |
| Q2 | What keeps it deterministic when two branches are worked at once? | Landing order: the first branch to land keeps its ids; the second is refused at its landing by the `issued` check, which `pnpm push:main` runs after its rebase - decided by the round | Reading every pushed branch, which depends on what was pushed and fetched, so two runs disagree; refusing at the fold, after suites, plans and an acceptance fingerprint cite the ids |
| Q3 | Who moves the second branch's ids? | The hand who writes the delta or the suite, with one command the refusal names. It moves the branch's ids that `main` holds above `main`'s, lettered ones included, and rewrites every citation inside the change. Moving a journey moves every case id, suite heading and `**Trace:**` line built from it, in the canonical and the compact spelling, at every suite level in the change; nothing outside the change cites an unlanded id - decided by the round | `pnpm push:main` moving them itself, which lands text nobody read; moving them by hand, as the batch did for eight scenario ids |
| Q4 | Which ids does the command issue? | Journey `US-<n>`, scenario `SC-<n>` and case `TC<m>` at every suite level, and a lettered id beside a named one (`…-SC-07a`), whose letter is part of the id. A scenario's or a case's issued identity is its readable id, a case's with `<v>` stripped (`<prefix>-US<n>-TC<m>`), paired with its trace id: the same pair is a carry, and the same readable id under another trace id, in the durable spec or another change, is refused. The trace CLI keeps its own sequence - decided by the round | Scenario ids alone, which leaves the case number, which the `issued` check does not read today; the readable id alone, which cannot tell a carried or revised case from a collision |
| Q5 | What id does a record copied into a second change take? | The trace id its readable id already holds in its scope, in the durable spec or an open change, matched on the readable id the target heading carries (`…-SC-<n>`, `…-US<n>-TC<m>` with `<v>` stripped), never on the heading's text - decided by the round | A fresh id, as `trace init` issues today, so one scenario carries two; matching on the heading's text, which gives a reworded or revised copy a fresh id |
| Q6 | What does acceptance read? | `accept:preflight` and `spec:accept` read the fetched `main` and refuse an id it holds before writing the fingerprint. A change accepted on its branch and beaten to the landing moves its ids with the command and is accepted again with `--supersedes` - decided by the round | The branch's tree alone, which lets two branches each be accepted with one id and leaves the second no way forward |
| Q7 | Which copied record does `trace init` refuse? | One whose readable id is held elsewhere with no marker, or under more than one - the owner's word | Every id with no marker, which refuses every new record |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
