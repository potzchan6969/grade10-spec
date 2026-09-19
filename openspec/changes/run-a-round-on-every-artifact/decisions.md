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

## Raised

Empty - the blind pass has not run yet.

| Capability | Raised | Landed |
| --- | --- | --- |
