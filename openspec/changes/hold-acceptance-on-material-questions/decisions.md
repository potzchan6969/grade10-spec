## Goals

- An accepting human answers only the questions that move scope or cannot be
  undone.
- Every raised question carries a recommendation, and the ones it settles
  close without a human.
- A question about a look never holds a feature's acceptance, and waits under
  the designer's name on Pending.

## Non-Goals

- Changing the blind reading: its method, its isolated input and the failure
  signal of an empty Raised table stay as they are.
- A tool that judges which question is material: QA2 judges, and any hand
  reopens a closed row with one reply.
- A product detail from a designer: a state that changes what the reader can
  do, see counted or is refused stays a ❓ on the page, held like any product
  question.
- Scenario, case and story ids issued across open changes, which is its own
  change.
- The acceptance tool's refusals of forms the governance defines, such as an
  untitled delta, which are bug fixes.
- Moving the questions about a look on changes already open: the batch moved
  the store's, and any other moves on its change's next round.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Do it now? | Yes - the owner's word | Waiting, which leaves settled rows holding acceptance on every change planned meanwhile |
| Q2 | Which questions hold acceptance? | Only one that materially affects scope or is an irreversible product choice; a question about a look never does - the owner's word | Every raised row, which in the batch held acceptance on 32 rows, 30 of them settled by their recommendation |
| Q3 | Does the blind reading raise less? | No: it still raises every unsettled point, and an empty Raised table still signals a failed reading; each row now carries options and a recommendation - the owner's word | The reader filtering its own questions, which hides the state nobody thought about and silences the one signal the store can read |
| Q4 | Which test sorts a raised row? | The held test in `workflow-round`: a row stays open when it moves scope, is costly to undo, needs a fact only a person has, or divides the options by more than a task group of work, and every other closes on its recommendation, citing the page line where one settles it; a contradiction between the two readings stays held whatever the default, since it is the blind reading's one check on the scenarios; AGENTS.md links the test - decided by the round | A second, narrower test for raised rows alone, so one question asked in a round and raised by a blind reading could be sorted two ways; "the page, the build or a sensible default" as a second sorter, which disagrees with the held test on a row that moves scope and has a default |
| Q5 | Who closes a row? | QA2, in planning-dev's reconciliation, which takes the two readings - decided by the round | The blind reader, which would read the requirements it must not see; the accepting human, which is the 30 rows again |
| Q6 | Where does a closed row land? | A `Decisions` row written `<answer> - decided by the round`, its source in the cell, and its answer in the suite's `## Settled` - decided by the round | A third resting place for Raised rows, which the store's checks would need to learn; no `## Settled` line, so the next blind pass raises it again |
| Q7 | Where does the recommendation sit? | In the Raised cell, as the options and `recommended: <option>`, the held row's spelling; the spec-to-tcs skill carries the reader's method, and no check is added - decided by the round | A fourth column, which every reader of the table would need to parse anew; an `Options:` and `Recommended:` spelling, a third beside the held row's; a `check:manual` refusal of a row with no recommendation, which reaches the open changes the non-goal leaves alone, while a row landed nowhere is already refused and a landed row's `Q<n>` carries the recommendation |
| Q8 | What counts as a look? | What planning-design's Product detail line keeps off the page: a breakpoint, a token, a label, a loading, empty, error or edge treatment, and the frame and the story this change adds to that line - decided by the round | A new definition beside the one the designer already works to |
| Q9 | Where does a question about a look wait? | In one designer's change per capability, extended by the next question on it under the overlap rule; it waits through `awaiting: ui-design` naming the designer, with `hands: design` set, and carries no `awaiting: specs`; a look-only answer closes it with `skip_specs: true` and `skip_specs_why`, and an answer that moves a requirement replaces the wait with a delta; the feature names no dependency on it - decided by the round | One change per question, which scatters a designer's work across many records; a ❓ on the feature's page, which holds its acceptance; a wait on `specs`, which never ends on a look-only answer and is the opposite of `skip_specs` |
| Q10 | What does the feature ship meanwhile? | An interim built from the store's existing blocks and tokens, written as the shipped state in its own `ui-design.md`; a look that needs a new variant, token or block ships without that look and waits wholly in the designer's change; an answer that differs moves the build through the designer's change - decided by the round | Waiting for the designer, which held whole features in the batch; the interim left unwritten, so nobody can tell the shipped look from the asked one; an interim that adds a block variant, which the store refuses as a local addition |
| Q11 | Does the accepting human see the closed rows? | Yes: accept-review's report, which the accepting human reads before `spec:accept`, lists each closed row with its source, holding nothing; the round's Interview names the source of each row it closes - decided by the round | Holding acceptance until each is acknowledged, which is the 30 rows again; leaving them unlisted, so a wrong closure is read by nobody |
| Q12 | Do Raised rows that one source settles share one `Q<n>`? | Yes: they land on one shared `Q<n>`, which names that source - the owner's word | One Decisions row per Raised row, about 30 rows on the cross-sell change |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| shared/planning/agent-rounds | Do Raised rows that one source settles share one `Q<n>`? A: they land on one shared `Q<n>`, which names that source. B: one Decisions row per Raised row, as Q6 reads now. recommended: A | Q12 |
