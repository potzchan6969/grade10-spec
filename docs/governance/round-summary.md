# Round Summary and Landing

What a round owes the hand who reads it, and what a landing proves before it
writes its row. The `workflow-round` and `workflow-build` skills carry the
procedure and point here for the conduct; a rule below is read by the run,
never by a hand. Each section links the page that says its outcome in the
reader's words, and the page names the requirement. The rules were drawn from
one walkthrough (`add-store-cross-sell`, 2026-09-21) and moved by the second
change through the workflow, `address-each-hand-in-the-round`.

## Summary

[Agent Rounds · The Round](../prds/products/shared/planning/agent-rounds.md#the-round)

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

[Agent Rounds · Your Moves](../prds/products/shared/planning/agent-rounds.md#your-moves)

- **Its own message** — a held row addressed to another hand is the round's
  own reply in the change's thread, mentioning that hand: the row, the
  sentence already on the page, and the decision rows it touches, quoted; once
  per change, round and row. Never a build round's thread to read
- **Its cost** — the cost of the recommended option in one clause, beside the
  option it was chosen over
- **Already decided** — before an `asks`, the verifier reads `decisions.md`; a
  question a row already answers stands or falls on that row, and is never a
  new held row
- **The right hand** — a product detail a build round lands on a page reaches
  the product manager as a ❓ line, never as decided by the round; the reply
  quotes the line before and after, `(none)` where it was added or removed;
  the line holds no landing and, answered, carries 🚧 until its group lands

## Hand's Reply

[Agent Rounds · Your Moves](../prds/products/shared/planning/agent-rounds.md#your-moves)

- **One reply, several moves** — a reply may carry one answer and any number
  of remarks; a remark comes back to the hand before anything lands, and the
  footer says so
- **Only their moves** — the summary's footer lists the moves of the hand it
  addresses alone; `land with recommendations` is offered only while a held
  row is open
- **A remark on a case** — a remark on a suite case's wording routes to
  `/tcs-review`, never to the draft
- **Proved as a finding is** — a remark's application is written into the row
  from `git show`, never from the intent: a row that says `corrected` names a
  commit that holds the correction

## Build Round

[Agent Rounds · The Walk](../prds/products/shared/planning/agent-rounds.md#the-walk)

- **Tests run before they push** — a tests-first commit has run and failed
  before it is pushed
- **Pinned to a commit** — every reader brief names the landing's commit,
  never the tree, and a reader writes nothing to the run's checkout
- **The cited file carries the id** — `plan:land` refuses a `--tests` path
  that does not cite the scenario id its entry credits, and `pnpm run
  tcs:validate` a Manual row whose named test in this store does not cite the
  row's case; a citation is the id followed by no digit
- **Written, not run** — `plan:land --unrun "<why>"` writes `written, not run
  — <why>` as the row's first clause; the tasks stay unticked, and a Manual
  row naming the walk reads `to be walked in <the walk>` until the run that
  ran the lane lands a row without the clause
- **The clone per group** — a `--tests` path is bare, and the group's tag
  names the repository it is resolved in: an application group's paths
  resolve against `--app-root <dir>`, or the superproject the store clone sits
  in, and a path neither holds is refused by name

## Interview

[Agent Rounds · The Round](../prds/products/shared/planning/agent-rounds.md#the-round)

- **What is asked** — at most three questions that change what is built, one
  of them whether to do it now. A sentence that leaves nothing else open is
  asked that one question alone
- **What is decided** — every other choice is applied as a default and listed
  under "decided by the round" in the same message, each with the option it
  took; one reply overturns any of them
- **`not now`** — the change stays Proposed with `awaiting: proposal` on the
  product manager, and nothing is drafted ahead until they lift it
- **A fact the sentence states** — is recorded as the product manager's, never
  asked back

## Readers

[Agent Rounds · Perspectives](../prds/products/shared/planning/agent-rounds.md#perspectives)

- **One verifier over the round** — every reader's findings go to one
  verifier, whose table carries one row per kind of finding naming each reader
  that filed it and quoting each reader's fix where they differ
- **The fallback** — `sonnet` for a definition on `opus`, none for one already
  on `sonnet`; a dispatch the vendor kills is retried once on the fallback,
  and the reader that ran on it is `<name> (fallback)` in the summary's
  perspectives line and the row's cell, written from the model the run
  reports
- **A reader still missing** — a dispatch killed on its model and on the
  fallback stops the round before the summary: the thread is told which reader
  the round lacks through `relay-post.mjs`, and no row is written
