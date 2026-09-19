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
| Q17 | Who walks a planning capability? | The team: a capability under `shared/planning/` is the delivery line itself, so its journeys are walked by the hands of a change, classed as `admin` in its suites, and `pnpm run tcs:validate` admits the team's roles there and nowhere else | `**Walked by:** nobody`, which routes every anchor to the feature set and loses the nine walks the pages name; or teaching the vocabulary that a teammate is an end user everywhere, which would let a product capability write a journey for QA |
| Q18 | Who is told at On staging? | Both hands, once each: QA by the staging message carrying the run tab, the release hand by the ordinary Your turn message | One message to QA alone, which leaves the release hand to find the change |
| Q19 | What does a message link before the thread exists? | The change's thread when `thread:` is written, else the change page; the key is written by the round change | A search of the channel for the first message about the change, which needs a user token |
| Q20 | How is a wait shown, and when is it refused? | As written, undated when the line carries no date; the check refuses only a wait naming an artifact the schema does not declare or one the change has written, as it does today | A date format the check enforces, which turns a note into a form |
| Q21 | Where are the idle and behind bounds? | ❓ pm - recommended: whole calendar days elapsed on the UTC date: the idle chip from the seventh day, the shelf from the thirtieth, a behind artifact in the digest from the seventh | Working days on the Hong Kong clock, which the store cannot read without a calendar |
| Q22 | What of a 🚧 line whose change has archived? | It wears no pip, and the existing check refuses it until the mark comes off, which the archive step already does | A pip reading Archived, which would keep a delivered line marked |
| Q23 | How does a change whose record cannot be read show? | In Proposed, named unreadable, with its hands open; it is never left off the board | Leaving it off, which is what hides a change today |
| Q24 | What proves On staging? | Every box ticked and `deployed_env: staging`, as the page's table says | The deploy alone, which would put a half-built change on QA |
| Q25 | What happens when a hand is removed while the change sits on them? | The role's channel is told once, because an unnamed hand is a move; the card shows the hand as open | Nothing until the next stage, which leaves the change on nobody unnoticed |
| Q26 | Is a move keyed for the life of the change? | Per entry: a stage re-entered after a revert tells its hand again, and a message for the same entry is never repeated | For the life of the change, which would leave a re-landed artifact unread |
| Q27 | Does the digest reach a handle the team map does not know? | No: the record rule refuses such a handle before it lands, and a handle with no Slack member gets no message; the map is the fix | A message to the channel naming the handle, which spends the channel on a typo |
| Q28 | Does `landed_by:` hold more than one handle per artifact? | One: the latest landing's word replaces the last | Both kept, which nothing reads |
| Q29 | Which stage wins when a proof lands out of order? | The furthest stage whose proof and every proof before it is on `main`; requirements with no design leave the change in Proposed | The highest proof present, which would let the tech design be skipped |
| Q30 | Who holds Designed, Released and Archived? | Nobody: at Designed the change's agent drafts the requirements and the product manager is told at Specified; Released and Archived name no hand and send no message | The product manager as the hand of Designed, which would tell them nothing when the requirements land, since a move is the hand changing |
| Q31 | Are a written wait and a released dependency messages of their own? | ❓ pm - recommended: no, five kinds - Your turn, Staging, Behind, Landed and the digest; a wait and a change freed by a dependency are lines of the digest, and the page's two rows move there | Seven kinds, which add two direct messages for facts the change page and the digest already show |
| Q32 | What proves Planned? | `tasks.md` and `promoted_by:`, as the page's table says; `landed_by:` gates nothing | `landed_by:` as a gate, which would hold a change planned before the key existed |
| Q33 | Which artifact does an open question count against? | A ❓ decisions row counts against the decisions; a ❓ page line counts against the proposal that links the section; a question naming a role outside the six hand keys is listed under that role and routed like an unnamed hand | Counting a page question against the artifact drawn from the section, which moves as the change progresses |
| Q34 | What is the measure on the change page? | Per stage the change has left, the days from the stage landing to that hand's first word, on the Handoff row | The days to the hand's landing, which counts the whole round rather than the wait |
| Q35 | When does the digest go? | Monday 09:00 on the Hong Kong clock | Monday morning with no hour, which no test can decide |

## Raised

The blind pass raised twelve questions, every one settled here: Q18 to Q28
below, with the idle bounds and the clock landing on one row.

| Capability | Raised | Landed |
| --- | --- | --- |
| shared/planning/change-stages | On staging names two hands, QA and the release hand. Is one direct message sent to each, or only to QA, as the feature set's line reads? | Q18 |
| shared/planning/change-stages | Where is a change's thread recorded, and what does a Your turn message carry before a thread exists: a key on the change, or the thread derived from the first channel message? | Q19 |
| shared/planning/change-stages | An `awaiting:` line with no date or no artifact named: is the wait shown undated, or refused by the check? | Q20 |
| shared/planning/change-stages | Are the idle bounds inclusive: the chip at 7 days or after 7 full days, the shelf at 30 days or after 30? | Q21 |
| shared/planning/change-stages | Does Idle count calendar days or working days, and on which clock? | Q21 |
| shared/planning/change-stages | A 🚧 line whose change has archived wears no pip. Is the line left marked, or does the check refuse a 🚧 line with no live change? | Q22 |
| shared/planning/change-stages | A change whose record the check refuses, a malformed `hands:` or an unknown handle: does the board show it with its hands open, or leave it off? | Q23 |
| shared/planning/change-stages | Is `deployed_env: staging` enough for On staging on its own, or is the message held until the last box is ticked? | Q24 |
| shared/planning/change-stages | A hand removed from `hands:` while the change sits at that hand: is the role's channel told, or is nothing sent until the next move? | Q25 |
| shared/planning/change-stages | Is "once per move" keyed for the life of the change, or per entry: after a revert and a re-landing of the same artifact, is the hand told again? | Q26 |
| shared/planning/change-stages | Does the weekly digest reach a handle the team map does not know, or is it skipped? | Q27 |
| shared/planning/change-stages | Does `landed_by:` hold one handle per artifact: is a second hand's word on the same artifact a replacement, or are both kept? | Q28 |
