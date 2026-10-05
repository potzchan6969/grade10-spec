# Round Summary and Landing

What a round owes the hand who reads it, and what a landing proves before it
writes its row. The `workflow-round` and `workflow-build` skills carry the
procedure and link here; a section a hand meets links the page that says it in
their words.

## Summary

- **The shape, quoted** — the signature, the answer shape, the asserted list;
  never a count. Counts get copied and lists get checked
- **One finding per line, with its reason** — the two or three that changed
  the shape first, the rest under them; a line a page owner will read quotes
  the page's line before and after
- **The branch** — what else sits unlanded on it, in one line

## Held Row

[Agent Rounds · Your Moves](../prds/products/shared/planning/agent-rounds.md#your-moves)

- **Its own message** — a held row addressed to another hand is the round's
  own reply in the change's thread, mentioning that hand: the row, the
  sentence it would put on the page, and the decision rows it touches, quoted; once
  per change, round and row. Never a build round's thread to read
- **Its cost** — the cost of the recommended option in one clause, beside the
  option it was chosen over

## Page Line

[Agent Rounds · Your Moves](../prds/products/shared/planning/agent-rounds.md#your-moves)

- **The right hand** — a product detail a build round lands on a page reaches
  the product manager as a ❓ line, never as decided by the round; the reply
  quotes the line before and after, `(none)` where it was added or removed;
  the line holds no landing and, answered, carries 🚧 until the change that
  delivers it archives

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

- **What has not run, above the draft** — a lane the environment cannot start,
  a helper no executed test calls, a tests commit pushed unrun. Before any
  count, alone on its line
- **Files outside the artifact** — every file a fix pass touched that the
  group's tasks do not name, with what it changed
- **The verify line, word for word** — checked against the group's verify
  task; a command the fix pass skipped is the hand's first question
- **Tests run before they push** — a tests-first commit has run and failed
  before it is pushed
- **Pinned to a commit** — every reader brief names the landing's commit,
  never the tree, and a reader writes nothing to the run's checkout
- **The cited file carries the id** — `plan:land` and `pnpm run tcs:validate`
  refuse a credited test that does not cite the id; the match is
  `scripts/openspec/lib/cites.mjs`'s
- **Written, not run** — `plan:land --unrun "<why>"` writes the clause first
  in the row; the tasks stay unticked until a row without it lands
- **The clone per group** — a `--tests` path is bare; `plan:land` resolves an
  application group's paths against `--app-root <dir>` when given, else the
  superproject the store clone sits in, refusing a path that clone lacks by
  the path and the root, and a landing that reaches no clone by the group's
  tag

## Interview

[Agent Rounds · The Round](../prds/products/shared/planning/agent-rounds.md#the-round)

- **What is asked** — about three questions, the ones that change most what is
  built, none trivial, one of them whether to do it now. A sentence that
  leaves nothing else open is asked that one question alone
- **What is held** — a further choice the
  [held test](../../.claude/skills/workflow-round/SKILL.md#questions-held-or-decided-by-the-round)
  holds is a held row in the draft's summary, never applied as a default
- **What is decided** — every other choice is applied as a default and listed
  under "decided by the round" in the same message, each with the option it
  took; one reply overturns any of them
- **`not now`** — the change stays Proposed with a dated `awaiting:` line on
  `proposal`, naming the product manager, and nothing is drafted ahead until
  they lift it
- **A fact the sentence states** — is recorded as the product manager's, never
  asked back
- **How it is asked** — as a [Clarification Request](#clarification-request)

## Clarification Request

Every message that asks the human to decide — the interview, a held row,
planning-dev's `Q<n>` stop, an accept-review blocker only a person can settle —
takes this shape.

- **A numbered list** — one item per blocker, the ones that change most what is
  built first; the item opens with a short label in bold, a dash, and the
  question in the reader's words: what the user sees or can do, never the
  mechanism
- **Lettered options** — `A`, `B`, and more where they exist, each one line on
  what the user meets under it and what it costs; the recommended one first,
  marked `Recommended`
- **Why it matters** — what goes wrong for the user, or the operator, while
  nobody answers
- **Blocks** — the journeys, requirements, contracts and tests that wait on
  the answer
- **Quoted, with links** — a past decision or requirement the question turns
  on is quoted and linked, never paraphrased: the PRD page on the manual, as
  `https://spec.grade10-stg.com/p/grade10-site/auction/display`; the change,
  as `https://spec.grade10-stg.com/openspec/#/change/define-public-auction-identifiers`,
  naming its decision row; a requirement, as its page route plus
  `#req-<requirement-slug>`
- **Then the defaults** — what the round decided without asking, each with the
  option it took, under the list

```markdown
1. **Partial payment state** - After a winner pays only part of an invoice, what should they see and be allowed to do?
   - **A - Add a `partially_paid` invoice state - Recommended.** The winner sees Partially Paid and cannot pay again, reissue, cancel, submit proof or view bank details. An operator owns the balance and final settlement.
   - **B - Keep the invoice Pending** and derive Partially Paid from recorded payments. No new state, but every payment, bank-transfer and cancellation control needs extra conditions so it does not contradict Pending.
   - **Why it matters** - Without it, the app can show a partial balance while still offering actions that should be closed.
   - **Blocks** - Partial payment, bank rails, order status, receipts and operator queue contracts.
   - **Past decisions** - [<page title>](https://spec.grade10-stg.com/p/<product>/<capability>): "<the line, quoted>"; [<change-id>](https://spec.grade10-stg.com/openspec/#/change/<change-id>), row Q<n>: "<the row, quoted>".
```

## Readers

[Agent Rounds · Perspectives](../prds/products/shared/planning/agent-rounds.md#perspectives)

- **One verifier over the round** — every reader's findings go to one
  verifier, whose table carries one row per kind of finding naming each reader
  that filed it and quoting each reader's fix where they differ
- **The fallback** — `sonnet` for a definition on `opus`; one already on
  `sonnet` is retried once on `sonnet`; a dispatch the vendor kills is retried once on the fallback,
  and the reader that ran on it is `<name> (fallback)` in the summary's
  perspectives line and the row's cell, written from the model the run
  reports
- **A reader still missing** — a dispatch killed on its model and on the
  fallback stops the round before the summary: the thread is told which reader
  the round lacks through `relay-post.mjs`, and no row is written
