# shared/planning/agent-rounds Specification

## Purpose

How an artifact is written and read again: the change's agent drafts every
artifact from the proposal to the code, named perspectives read the draft and
verifiers argue their findings, the hand of the stage answers, remarks or says
land in the change's thread, and an artifact behind what it was drawn from is
read again before anything lands after it, with one record row per round.

## Feature set

- The round
  - Six steps: ask, draft on the change's branch, challenge by one agent per perspective, verify by one agent per group of findings, read by the hand, land on their word
  - Your word lands it: the landing writes `landed_by:` and the round's row, tells the next hand, and reads again what comes after
  - Blind readings exempt: the requirements' challenge is the two independent readings, its verify the reconciliation, with its stops on the product manager and no verifier over them
  - Sized by the diff: the perspectives summoned are read from what the draft touches, the simpler-thing reader always, and a round of one reader verifies itself
- Your moves
  - Answer: `Q<n>: <answer>` writes the answer into the decisions row, and `Q<n>` alone takes the recommendation
  - Remark: applied as written, re-runs only the perspectives the edited lines summon, and is recorded as a round row and a decisions row when it settles a choice
  - Land: one word lands the artifact on `main`
  - Edit: a push from a terminal or GitHub is the hand's word for the lines it touched
  - First sentence: a message in the planning channel naming no change opens one, with the asker as its product manager
- Questions, never guesses
  - Decisions rows: a preference or a product decision is a numbered `## Decisions` row with the agent's recommendation and the hand it waits on, ids issued per change and never reused
  - Page lines: a product detail is a ❓ line on the page the change links
  - Listed per hand: the change page and My turn list the open questions addressed to each hand
- Perspectives as data
  - Schema table: each artifact's readers sit in the schema beside its teammate, each with what in a draft summons it
  - Agent definitions: one challenger per perspective and one verifier, each seeing the draft and what is before it and never another reader's output
  - Principles cited: the tech design's and the build's readers hold the draft to the eight principles and the reader's stance
- Read again, in order
  - Content id: `reviewed:` holds, per artifact, a hash of what is before it, the linked page sections first, then the artifact files before it, whitespace collapsed, the record itself never upstream, a waived artifact fresh
  - Read in order: a landing wakes the change's agent, which reads every artifact after the one that moved, oldest first
  - No-op read: a read that changes nothing writes the `reviewed:` line alone and says so in the thread; a read that edits opens a round for the artifact's hand
  - Landing refused: an artifact lands only when everything before it is fresh, the fold at archive refuses a behind delta, and a tick, a claim and a wait are never held
  - Moved goals: a goal or non-goal that moved is a question to the product manager, extend, supersede or split, and nothing is rewritten in place
  - Raised rows: a landed Raised row puts the requirements and the cases behind
- The record
  - Rounds table: `rounds.md` holds one row per round, the artifact or group, the perspectives run, what stood, the question ids raised and the tests per scenario
  - Refused without a row: a landed artifact or a ticked group with no row is refused on a change opened after the rule
  - Archived whole: the file archives with the change and is folded nowhere
- The walk
  - Test first: each task group lands the tests its scenario ids name in their own commit, then the code, then its readers, then the landing summary
  - Demonstrated: the last group walks the journeys in a browser and leaves the end-to-end suite, marking each covered case automated
  - Run sheet: the pass on staging leaves automated cases out and says how many
  - Suite on every push: the end-to-end suite runs on every push to `main`, its smoke cases on every staging deploy and cut
  - Tick refused: a task naming no scenario id, or one no test in the tree cites, is not ticked
- The thread and the runner
  - One thread: `thread:` records the channel and message a change's thread hangs off, written once when it opens, and every message and wake finds it
  - Woken on a landing: the push that lands an artifact runs the re-read for each change with something behind, one run per change at a time
  - Resumable: a run reads the branch, `main` and the thread and continues from what is there; every push is force-with-lease, and a run that loses says so in the thread and stops

