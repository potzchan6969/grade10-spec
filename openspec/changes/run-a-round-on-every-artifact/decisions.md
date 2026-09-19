## Goals

- Every artifact from the proposal to the code is drafted by the change's
  agent, read by named perspectives, verified, and landed on its hand's word,
  and the change records each round
- A product manager, a designer and a tech PIC work a change from its thread:
  a sentence to open it, numbered questions to answer, a draft to tweak or
  challenge, one word to land
- An artifact that goes behind is read again before anything is built on it,
  and a change ends with its journeys walked end to end

## Non-Goals

- The stage, the hands, Behind as a chip and the direct messages -
  `stage-changes-and-notify-hands`, which this change depends on
- Landing without a pull request - the landing refusal here runs in the
  round's own landing step and waits for `pnpm land` to become the one gate
- Interactive buttons in Slack; every move is a reply in words
- Replacing the two blind readings of the requirements and the cases, or
  their reconciliation, with a challenge and a verify
- A waiver for the round: its size is computed, never declared

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | What does the agent land on its own? | One thing: a `reviewed:` line for an artifact it read again and found right, said so in the thread; every other landing waits for the hand's word | A re-read that edits downstream files unattended, which puts the designer's or the tech PIC's file on `main` unread; or a re-read that lands nothing, which leaves a behind chip a person has to clear by hand |
| Q2 | What is the read record? | `reviewed:` in `.openspec.yaml`, one line per artifact holding a content id: a hash over the text of what is before the artifact, page sections first, whitespace collapsed; `.openspec.yaml` itself is never upstream | A commit sha, which a rebase invalidates and the one-commit checkout that runs the checks cannot resolve; a date, which cannot tell two edits on one day apart; a line inside the artifact, which turns a no-op read into prose churn |
| Q3 | What counts as upstream of an artifact? | The whole file for a change's own artifacts; only the sections the proposal links for a page, because a page carries many changes' marks; a waived artifact is fresh | The whole page, which puts every change marking it behind on a copy edit; comparing meaning, which no reader can do for a proposal the way the stale rule does for a requirement |
| Q4 | Does a landed Raised row put the requirements behind? | Yes: the answer is a product decision, and the requirements and the cases are read again against it before the plan lands | Exempting `## Raised`, which is how a late answer stays out of the requirements |
| Q5 | What refuses while an artifact is behind? | The landing of any artifact after it, in the round's landing step, and the fold at archive; never a tick, a claim or a wait | A refusal in CI, which runs after the landing; a refusal on a tick, which is a fact about work already pushed |
| Q6 | Where do open questions live? | Numbered `## Decisions` rows in the change, with the agent's recommendation and the hand they wait on, ids never reused; ❓ lines on the page for a product detail; My turn and the change page list them per hand | A question inside `ui-design.md` or `tech-design.md`, whose templates have no place for one; ids per round, which recur; a question only in the thread, which a resumed agent cannot match |
| Q7 | What is the record of a round? | `rounds.md` in the change, one row per round: the artifact or group, the perspectives run, what stood, the question ids raised, the tests each scenario landed with; archived with the change and folded nowhere; `check:manual` refuses a landed artifact or a ticked group with no row on a change opened after the rule | The thread alone, where a round that found nothing and one that never ran look the same; a block in each artifact, which the delta spec cannot hold; the decisions table's `Instead of` column, which would become a transcript |
| Q8 | How big is a round? | The simpler-thing reader always; a perspective joins when the draft touches what it reads for: design for a surface, backend for a schema, an export or an interface, integration for another system, operations for a migration, a flag, money or a deploy step, QA at the requirements and the build, the reader for a page or copy; a round of one reader verifies itself, and the writer of the blind readings reconciles rather than verifies | Four to seven readers on every artifact, which manufactures findings on a copy change; a `round_waived` key, which is a size somebody declares |
| Q9 | Who reads Specified? | The product manager, at the reconciliation, the requirements and the cases together; the blind readings stay two independent readings with their stops on the product manager, and no verifier agent reads both | QA as the hand, which put its verdict back on the ladder; a verifier over the readings, which overrules the reading it exists to check |
| Q10 | What are a hand's moves? | Answer a numbered question; remark, applied as written and read again by the perspectives it touches, recorded as a round row and as a decisions row when it settles a choice; land; and an edit pushed from a terminal or GitHub, which the push makes the hand's word for the lines it touched | Send back, which re-runs every perspective and records nothing; a hand edit from Slack, which Slack cannot do |
| Q11 | Where do the perspectives live? | One `round` skill every line skill calls, and `perspectives:` per artifact in the schema beside `teammate:`, so a new reader is a row | The procedure and the readers repeated in six skills, which drift |
| Q12 | Where do the principles live? | `docs/governance/system-design.md`: determinism, simplicity, clarity, flexibility, modularity, consistency, resilience, observability, cited by the tech design's and the build's readers; conscientious is every reader's stance, named there, not a ninth principle | Four agent prompts nobody else reads; the reference alone, which is explanatory and never authoritative |
| Q13 | Is the round idempotent? | No, resumable: a run reads the branch, `main` and the thread, computes what is behind and what is asked, and continues; one run per change at a time, a second firing joins the running one; every push is force-with-lease, and a loser says so in the thread and stops | Two runs on one branch, where the loser overwrites the winner or dies silently |
| Q14 | Where does the walk record what it covers? | On each case's automation status, flipped to automated by the walk's commit; the run sheet leaves automated cases out; the suite runs on every push to `main`, its smoke cases on every staging deploy and cut | A second list of covered cases, which drifts from the suite |
| Q15 | Does the thread's address live in the record? | Yes: `thread:` in `.openspec.yaml`, written once when the thread opens, so every message and every wake finds it | A search of the app's own messages, which needs a user token; the workflow's cache, which evicts |
| Q16 | Where does a requirement that reaches the tech design go? | A dated `awaiting: tech-design:` line for the tech PIC, cleared by their edit or a `reviewed:` line; the order stays the owner's, the tech design before the requirements | A tech design after the requirements, which the owner's brief ruled out; a second chain in which the design depends on the spec, which is circular |
| Q17 | What does a channel message naming an open change do? | It is answered in that change's thread, and the reply names the id; no second change opens | A second change, which doubles the work and splits the thread |
| Q18 | What if the asker has no entry in the team map? | The change opens with its product manager hand unnamed, and the reply says so and asks for the handle; the map is the fix | Refusing the sentence, which turns the smooth path into a form |
| Q19 | Who may say land? | ❓ pm - recommended: the hand of the stage alone; another teammate's word is refused with a reply naming whose word it waits on, and reassigning the hand is the way around | Anybody in the thread, with the record naming them, which makes the hands table decorative |
| Q20 | What is a reply that is none of the moves? | A remark, applied as written; a reply the round cannot apply is answered with what it could not do | Leaving it unapplied with the question open, which makes silence look like an answer |
| Q21 | What does a re-read that would edit several artifacts do? | It reads in order, opens a round for the earliest edited artifact's hand and stops there; what comes after is read again once that lands | A round per edited artifact at once, which puts three hands on drafts drawn from a draft |
| Q22 | Is a no-op re-read a round? | No: it writes the `reviewed:` lines and one thread line and no row; the `round` rule reads landed artifacts and ticked groups alone | A row per re-read, which fills the record with rounds that ran nothing |
| Q23 | What does a landing with nothing after it say? | Nothing beyond the landing line; the re-read runs and finds nothing to read | A second line saying nothing was read, which is noise |
| Q24 | When does `rounds.md` exist? | With the first round; absent until then, and the check refuses only a landed artifact or a ticked group with no row | An empty file from `openspec new change`, which the CLI does not write |
| Q25 | What of a `rounds.md` row missing a column? | Refused by the `round` rule like a missing row, naming the column | A warning, which leaves the record half written |
| Q26 | What does each answer to a moved goal do? | ❓ pm - recommended: extend: the change goes on with the moved goal and everything after the proposal is read again; supersede: a new change opens from the moved goal and this one is withdrawn; split: a new change takes the moved part and this one keeps the rest; each is recorded as a decisions row | Recording the word alone, which leaves the agent to guess what to open |
| Q27 | Where is the product manager's read of the requirements walked? | In `change-stages`, as the hand's move at Specified; here only the exemption of the two readings is stated, and no journey or case walks the read | A journey of its own here, which would double the walk |
| Q28 | What of a remark that touches a page's marked lines? | From the product manager it is applied to the page as written; from any other hand it becomes a ❓ line on the page for the product manager | Applying every remark to the page, which lets a designer settle a product detail |
| Q29 | What is the schema's order for the content id? | The artifact list's order in `schema.yaml`, with `tech-design` moved above `specs` in the list so the order and the page's table agree | A list unchanged with only `requires` moved, which would hash the tech design after the suite |
| Q30 | Does a rewrap put artifacts behind? | No: whitespace is collapsed before hashing, so an edit that changes only whitespace leaves the content id equal; a reformat that changes words does put them behind | Hashing the bytes, which puts every artifact behind on a rewrap |
| Q31 | Does the code carry a `reviewed:` line? | No: the refusal on a behind `tasks.md` covers a group's landing, and the schema issues no id for the code | An entry the schema has no id for, written from the application repository |
| Q32 | Whose word lands `spec.md` and `feature-tcs.md`? | The product manager's, at the reconciliation, both together | QA's, which Q9 took off the ladder |
| Q33 | What is the `round` rule's date fence? | A change created on or after the day the rule lands, read from `created:` | The day after, which excuses the changes opened that day |
| Q34 | How is the Round column numbered? | Within the change, from 1, in landing order | Per artifact, which makes two rounds share a number |

## Raised

Thirteen questions the blind reading of the cases could not settle from the
outline, the journeys, the decisions, the design and the page: who may land, what
a reply that is none of the moves does, what a re-read that edits several
artifacts does, when the record exists and what it owes, what each answer to a
moved goal does, and where a remark on the page lands. Each landed as a
`## Decisions` row above, `Q17` to `Q28`, and `Q19` and `Q26` also as a ❓ line
on the page for the product manager.

| Capability | Raised | Landed |
| --- | --- | --- |
| shared/planning/agent-rounds | A planning-channel message that names an open change: does it route into that change's thread, or open a second change? The feature set states only that a message naming no change opens one. | Q17 |
| shared/planning/agent-rounds | A first sentence from a teammate with no entry in the handle map: is the asker still recorded as the change's product manager by their Slack handle, or does the change open with the hand unnamed? | Q18 |
| shared/planning/agent-rounds | Saying land as a teammate who is not the hand of the stage: is the word refused and the artifact held, or does any teammate in the thread land it and the record name them? | Q19 |
| shared/planning/agent-rounds | A thread reply that is neither an answer, a remark nor land: is it taken as a remark, since a remark is applied as written, or left unapplied with the question still open? | Q20 |
| shared/planning/agent-rounds | A re-read that edits several artifacts at once: does it open a round for each edited artifact's hand, or stop at the earliest and wait for that hand? | Q21 |
| shared/planning/agent-rounds | Two landings inside one run's life: does the change's record carry one row for the joined run, or one row per landing? | Q22 |
| shared/planning/agent-rounds | A landing on a change with nothing after it: does the run post a line in the thread saying it read nothing, or stay silent, given a landing is one reply? | Q23 |
| shared/planning/agent-rounds | Is `rounds.md` owed from a change's first file, or written with its first round? A change with no round yet: no file, or a file with no row? | Q24 |
| shared/planning/agent-rounds | A `rounds.md` row missing a column, such as the perspectives: does the check refuse it as it refuses a missing row, or report it only? | Q25 |
| shared/planning/agent-rounds | A `reviewed:` line the agent lands on its own (Q1): does it owe a round row, which Q7 refuses a landed artifact without, or is a no-op read not a round? | Q22 |
| shared/planning/agent-rounds | Answering a moved-goal question extend, supersede or split: does each answer do something to the change - a new change, a closed one - or does it only record the product manager's word? | Q26 |
| shared/planning/agent-rounds | No journey walks the product manager reading the requirements and the cases together at the reconciliation (Q9, the blind readings' stops). Is that the hand of US-05, or a journey not yet written? | Q27 |
| shared/planning/agent-rounds | A remark that touches a page's marked lines rather than the artifact: is it applied to the page as written, or asked as a ❓ line for the page's owner? | Q28 |
