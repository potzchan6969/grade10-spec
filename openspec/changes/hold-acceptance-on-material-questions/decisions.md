## Goals

- An accepting human answers only the questions that move scope or cannot be
  undone.
- Every raised question carries a recommendation, and the ones it settles
  close without a human.
- A designer's ask about a look never holds a feature's acceptance, and waits
  under the designer's name on Pending.

## Non-Goals

- Changing the blind reading: its method, its isolated input and the failure
  signal of an empty Raised table stay as they are.
- A tool that judges which question is material: the planner judges, and any
  hand reopens a closed row with one reply.
- A product detail from a designer: a state that changes what the reader can
  do, see counted or is refused stays a ❓ on the page, held like any product
  question.
- Scenario, case and story ids issued across open changes, which is its own
  change.
- The acceptance tool's refusals of forms the governance defines, such as an
  untitled delta, which are bug fixes.
- Moving the asks on changes already open: the batch moved the store's, and
  any other moves on its change's next round.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Do it now? | Yes - the owner's word | Waiting, which leaves settled rows holding acceptance on every change planned meanwhile |
| Q2 | Which questions hold acceptance? | Only one that materially affects scope or is an irreversible product choice; a designer's ask about a look never does - the owner's word | Every raised row, which in the batch held acceptance on 32 rows, 30 of them settled by their recommendation |
| Q3 | Does the blind reading raise less? | No: it still raises every unsettled point, and an empty Raised table still signals a failed reading; each row now carries options and a recommendation - the owner's word | The reader filtering its own questions, which hides the state nobody thought about and silences the one signal the store can read |
| Q4 | Which test sorts a raised row? | The held test in `workflow-round`: a row stays open when it moves scope, is costly to undo, needs a fact only a person has, or divides the options by more than a task group of work; AGENTS.md links it - decided by the round | A second, narrower test for raised rows alone, so one question asked in a round and raised by a blind reading could be sorted two ways |
| Q5 | Who closes a row? | The planner who takes the two readings, citing the page line, the build or the default that settles it - decided by the round | The blind reader, which would read the requirements it must not see; the accepting human, which is the 30 rows again |
| Q6 | Where does a closed row land? | A `Decisions` row written `<answer> - decided by the round`, its source in the cell, and its answer in the suite's `## Settled` - decided by the round | A third resting place for Raised rows, which the store's checks would need to learn; no `## Settled` line, so the next blind pass raises it again |
| Q7 | Where does the recommendation sit? | In the Raised cell, as `Options:` and `Recommended:`, and `check:manual` refuses a row with none - decided by the round | A fourth column, which every reader of the table would need to parse anew |
| Q8 | What counts as a look? | What planning-design keeps off the page: a breakpoint, a token, a label, a frame, a story, a loading, empty, error or edge treatment - decided by the round | A new definition beside the one the designer already works to |
| Q9 | Where does a designer's ask wait? | In one change per surface, extended by the next ask on that surface, with `awaiting: ui-design` naming the designer and `awaiting: specs` until the answer moves a requirement; the feature names no dependency on it - decided by the round | One change per ask, which scatters a designer's work across many records; a ❓ on the feature's page, which holds its acceptance |
| Q10 | What does the feature ship meanwhile? | The recommended interim, written as the state in its own `ui-design.md`; an answer that differs moves the build through the designer's change - decided by the round | Waiting for the designer, which held whole features in the batch; the interim left unwritten, so nobody can tell the shipped look from the asked one |
| Q11 | Does the accepting human see the closed rows? | Yes, listed as decided by the round with their source in the acceptance summary, holding nothing - decided by the round | Holding acceptance until each is acknowledged, which is the 30 rows again; leaving them unlisted, so a wrong closure is read by nobody |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
