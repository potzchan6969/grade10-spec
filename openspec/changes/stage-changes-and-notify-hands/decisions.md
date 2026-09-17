## Goals

- A change's stage is one of nine, read from its files on `main`, and the
  board, the change page, the page's ribbon, My turn and Slack all show the
  same one
- Every change names its hands, and the hand whose turn it is is told once,
  in Slack, with the command to paste
- A wait, a block and an idle change are visible without anybody updating a
  status

## Non-Goals

- Landing without a pull request, the release line, migrations, flags, the
  archive prune, the reconcile skill and the skill consolidation - each is
  its own change, named under the proposal's follow-on changes
- A sign-in on the hosted manual - Assign and Approve stay local, as Propose
  is today
- Changing which hand writes which artifact, or the schema's artifact list
- Replacing the channel post on every push - it stays beside the direct
  messages
- A message per commit, or per tick

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Is the stage stored or derived? | Derived from the files on `main`, as the four lanes are today; only the hands are stored | A `status:` key set by hand, which the board would trust and people would forget to move |
| Q2 | How many stages? | Nine, one per gate a file can prove: Proposed, Decided, Designed, Specified, Planned, Building, On staging, Released, Archived | The four lanes, which cannot tell a change waiting on a designer from one waiting on QA, or one on staging from one released |
| Q3 | Where is a hand recorded? | `hands:` in `.openspec.yaml`, one handle per role, written by the PM, by the local manual's Assign action, or by `pnpm plan hand` from `grade10` | Reusing `owner` and `owners`, which say who claimed work; or an assignment held only in Slack, which git cannot read |
| Q4 | What counts as idle? | Days since the last tick, claim or artifact landing on the change; a repository-wide commit does not count | The last commit touching the directory, which one reformat moves for every change at once |
| Q5 | Who is told, and when? | The hand of the stage a change enters, once per entry, by direct message, or the role's channel when the hand is unnamed; a weekly digest per person for idle and waiting; the channel post per push stays | A message per commit, which nobody reads; or a daily digest alone, which makes a hand wait a day |
| Q6 | Does the Designed stage wait on a design a change does not need? | No: `ui_waived: "<why>"` says the change has no surface, the way `design_waived` already says it has no application work | Reading the journeys to guess, which puts a QA run behind a designer who was never owed anything |
| Q7 | Does QA's review of the suite gate the ladder? | No: the verdict is an overlay, `draft` or `approved`, beside the stage, and planning goes on in parallel | A Reviewed stage between Specified and Planned, which would hold every engineer to QA's pace |
| Q8 | What proves Released? | `released_in: <tag>` on the change, written when a cut carries it; this change reads the key and the release change writes it | Reading tags out of `grade10` from the manual, which the store cannot see |
| Q9 | Where does the capability live? | `shared/planning/change-stages`, with a planned page under the manual's Platform group, because the store and the application repository are both held to it | `skip_specs`, which would leave the page unmarkable and the requirements unwritten; or a page under one product, which none of them owns |
| Q10 | Is the tech design written before the requirements on this change? | Yes, from the page, the proposal and the journeys, as the brief orders the phases; the requirements pass reads it and the reconciliation re-reads it (held) | The schema's order, tech design after the requirements, which the proposal's open question puts to the PM and the tech PIC for every change |
| Q11 | What is the design reference, with no Figma file for the manual? | The blueprint page's mock-ups, linked from `ui-design.md` as the layout's source of truth, and the design-system primitives the manual already composes | Prose descriptions of each screen, which drift; or a Figma file drawn for a tool only its makers use |

## Raised

Empty - the interview settled the frontier, and the blind pass has not run
yet.

| Capability | Raised | Landed |
| --- | --- | --- |
