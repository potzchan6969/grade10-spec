## Goals

- A change's stage is one of eight, read from its files on `main`, and the
  board, the change page, the page's ribbon, My turn and Slack all show the
  same one, and mark the five stages the agent drafts with the hand's move
- Every change names its hands, and the hand whose turn it is is told once,
  in Slack, pointing at the change's thread
- A wait, a block, an idle change and a behind artifact are visible without
  anybody updating a status

## Non-Goals

- The round itself: the change's agent, the thread's replies, the challengers
  and verifiers, the re-read that clears Behind and refuses a landing, the
  round record and the walk are `run-a-round-on-every-artifact`
- Landing without a pull request, the release line, migrations, flags, the
  archive prune and the skill consolidation - each is its own change, named
  under the proposal's follow-on changes
- A sign-in on the hosted manual - Assign stays local, as Propose is today
- Replacing the channel post on every push - it stays beside the direct
  messages
- A message per commit, or per tick

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Is the stage stored or derived? | Derived from the files on `main`, as the four lanes are today; only the hands and who landed each artifact are stored | A `status:` key set by hand, which the board would trust and people would forget to move |
| Q2 | How many stages? | Eight, one per gate a file can prove: Proposed, Designed, Specified, Planned, Building, On staging, Released, Archived | The four lanes, which cannot tell a change waiting on a designer from one waiting on QA, or one on staging from one released; or nine, with a Decided stage after Proposed, which split what the PM settles in one sitting into two gates and made an item still ❓ look like a hold |
| Q3 | Where is a hand recorded? | `hands:` in `.openspec.yaml`, one handle per role, written by the PM, by the local manual's Assign action, or by `pnpm plan hand` from `grade10` | Reusing `owner` and `owners`, which say who claimed work; or an assignment held only in Slack, which git cannot read |
| Q4 | What counts as idle? | Days since the last tick, claim or artifact landing on the change; a repository-wide commit does not count | The last commit touching the directory, which one reformat moves for every change at once |
| Q5 | Who is told, and when? | The hand of the stage a change enters, once per entry, by direct message pointing at the change's thread, or the role's channel when the hand is unnamed; a weekly digest per person for open questions, idle, behind and waiting; the channel post per push stays | A message per commit, which nobody reads; or a daily digest alone, which makes a hand wait a day |
| Q6 | Does the Designed stage wait on a design a change does not need? | No: `ui_waived: "<why>"` says the change has no surface, the way `design_waived` already says it has no application work | Reading the journeys to guess, which puts a QA run behind a designer who was never owed anything |
| Q7 | Does QA's review of the suite gate the ladder? | No: the verdict is an overlay, `draft` or `approved`, beside the stage, and planning goes on in parallel | A Reviewed stage between Specified and Planned, which would hold every engineer to QA's pace |
| Q8 | What proves Released? | `released_in: <tag>` on the change, written when a cut carries it; this change reads the key and the release change writes it | Reading tags out of `grade10` from the manual, which the store cannot see |
| Q9 | Where does the capability live? | `shared/planning/change-stages`, with a planned page under the manual's Platform group, because the store and the application repository are both held to it | `skip_specs`, which would leave the page unmarkable and the requirements unwritten; or a page under one product, which none of them owns |
| Q10 | Is the tech design written before the requirements? | Yes, on every change: the owner's brief of 2026-09-19 orders it beside the UI design, from the page, the decisions and the journeys; the requirements pass reads both designs, and a requirement that reaches the tech design is a dated wait on the tech PIC, never a hold | The schema's order, tech design after the requirements; or holding it for this change alone, which left the page's row open for every other |
| Q11 | What is the design reference, with no Figma file for the manual? | The blueprint page's mock-ups, linked from `ui-design.md` as the layout's source of truth, and the design-system primitives the manual already composes | Prose descriptions of each screen, which drift; or a Figma file drawn for a tool only its makers use |
| Q12 | Which stages does an agent draft? | Every stage from Proposed to Building: the change's agent drafts, the hand of the stage answers, tweaks, challenges or reads, and their word lands it; every surface marks the five with the hand's move beside the agent's | Three agent stages, Specified, Planned and Building, with the PM, the designer and the tech PIC writing by hand, which the owner's second brief replaced; or an agent running the line with nobody reading, which the brief rules out |
| Q13 | Who holds Proposed? | The PM until the decisions, the journeys and the hands are on `main`; the designer and the tech PIC from then, told once when the three land, because a move is the hand changing and not only the stage | A Decided stage to tell them, which held nothing a file could not already say; or telling them on the proposal alone, before there is anything to design from |
| Q14 | What records a person's approval? | The landing: `landed_by:` in the record names the hand whose word landed each artifact, written by the landing itself, so an artifact on `main` is an approved one and the board says by whom | `plan_approved:` and `pnpm plan approve`, a second act after the plan was written, which the round makes redundant; or a commit trailer, which nothing in the store reads and `pnpm plan` in `grade10` cannot |
| Q15 | Does Behind hold anything here? | No: it is shown on the card and the artifact, told once to the hand of the earliest behind artifact, and listed in the digest after 7 days; the fold at archive refuses a behind delta; the landing refusal and the writer of the read record are the round change's | A refusal on a tick or a claim, which are facts about work already pushed; or a refusal in CI, which runs after the landing on a one-commit checkout |
| Q16 | Who reads Specified? | The PM, at the reconciliation, the requirements and the cases together, as the reader of record the passes already name; QA's review of the suite stays the overlay Q7 made it | QA as the hand of Specified, which put QA's verdict back on the ladder Q7 took it off, and left the requirements read by nobody |

## Raised

Empty - the interview settled the frontier, and the blind pass has not run
yet.

| Capability | Raised | Landed |
| --- | --- | --- |
