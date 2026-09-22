# Round Summary and Landing

What a round owes the hand who reads it, and what a landing proves before it
writes its row. The `workflow-round` and `workflow-build` skills carry the
procedure and point here for the conduct; a rule below is read by the run,
never by a hand.

## Summary

- **What has not run, first** — a lane the environment cannot start, a helper
  no executed test calls, a tests commit pushed unrun. Before any count, alone
  on its line
- **The shape, quoted** — the signature, the answer shape, the asserted list;
  never a count. Counts get copied and lists get checked
- **One finding per line, with its reason** — the two or three that changed
  the shape first, the rest under them; a line a page owner will read quotes
  the page's line before and after
- **Files outside the artifact** — every file a fix pass touched that the
  group's tasks do not name, with what it changed
- **The verify line, word for word** — checked against the group's verify
  task; a command the fix pass skipped is the hand's first question
- **The branch** — what else sits unlanded on it, in one line

## Held Row

- **Its own message** — a held row addressed to another hand goes to that hand
  alone: the row, the sentence it would put on the page, and the decision rows
  it touches, quoted. Never a build round's thread to read
- **Its cost** — the cost of the recommended option in one clause, beside the
  option it was chosen over
- **Already decided** — before an `asks`, the verifier reads `decisions.md`; a
  question a row already answers stands or falls on that row, and is never a
  new held row
- **The right hand** — a product detail a round lands on a page reaches the
  product manager as ❓, never as decided by the round

## Hand's Reply

- **One reply, several moves** — a reply may carry one answer and remarks; a
  remark comes back to the hand before anything lands, and the footer says so
- **Only their moves** — the summary shows a hand the moves that are theirs;
  `land with recommendations` is offered only while a held row is open
- **A remark on a case** — a remark on a suite case's wording routes to
  `/tcs-review`, never to the draft
- **Proved as a finding is** — a remark's application is written into the row
  from `git show`, never from the intent: a row that says `corrected` names a
  commit that holds the correction

## Build Round

- **Tests run before they push** — a tests-first commit has run and failed
  before it is pushed
- **Pinned to a commit** — every reader brief names the landing's commit,
  never the tree, and a reader writes nothing to the run's checkout
- **The cited file carries the id** — before the row, `grep -o
  '<capability>-SC-[0-9]*' <path>` over every path the `--tests` cell and every
  Manual row names
- **Written, not run** — a group whose lane did not run says so in its row's
  first clause and keeps its tasks unticked
- **The repository per path** — a `--tests` cell names the repository with
  each path, since both repositories have a `packages/` root

## Open

- ❓ `plan:land` refuses a `--tests` path this store holds no file at, so an
  application group's row cannot land through the command; the cell's shape
  for a path outside this store waits on a change of its own
- ❓ The rules above were drawn from one walkthrough (`add-store-cross-sell`,
  2026-09-21); a second change through the workflow confirms or moves them
