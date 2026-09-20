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
  - Land: one word lands every drafted artifact of your own hand, in the chain's order, and stops at the first artifact of another hand
  - Edit: a push from a terminal or GitHub is the hand's word for the lines it touched
  - First sentence: a message in the planning channel naming no change opens one, with the asker as its product manager
- Questions, never guesses
  - Decided by the round: a preference the round can take is decided on the best option and recorded as a numbered `## Decisions` row, and one reply from any hand overturns it
  - Held for its hand: a choice that moves scope, is costly to undo, needs a fact only a person has, or divides its options by more than a task group of work waits on its hand and holds the change's landings
  - Ids per change: issued per change and never reused
  - Page lines: a product detail is a ❓ line on the page the change links
  - Listed per hand: the change page and My turn list the held rows addressed to each hand
- Perspectives as data
  - Schema table: each artifact's readers sit in the schema beside its teammate, each with what in a draft summons it
  - Agent definitions: one challenger per perspective and one verifier, each seeing the draft and what is before it and never another reader's output
  - Principles cited: the tech design's and the build's readers hold the draft to the eight principles and the reader's stance
- Read again, in order
  - Content id: `reviewed:` holds, per artifact, a hash of the artifact's `upstream:` set read in the schema's order, the record itself never upstream, a waived artifact fresh
  - Read in order: a landing wakes the change's agent, which reads every artifact after the one that moved, oldest first, redraws each from the redrawn one before it, drafts ahead, and lands nothing
  - No-op read: a read that changes nothing writes the `reviewed:` line alone and says so in the thread; a read that edits opens a round for the artifact's hand
  - Landing refused: an artifact lands only when everything before it is fresh, the fold at archive refuses a behind delta, and a tick, a claim and a wait are never held
  - Moved goals: a goal or non-goal that moved is a question to the product manager, extend, supersede or split, and nothing is rewritten in place
  - Overlap in flight: a sentence naming no change that overlaps an active change's capability or the page sections it would mark is answered in that change's thread, and that change's stage says whether it is extended, held for its product manager, or depended on by a new change
  - Raised rows: a landed Raised row puts the requirements and the cases behind
  - Tech design first: a requirement that reaches the tech design writes a dated wait on the tech PIC, cleared by their edit or a read
- The record
  - Rounds table: `rounds.md` holds one row per round, the artifact or group, the perspectives run, what stood, the question ids raised and the tests per scenario
  - Refused without a row: a landed artifact or a ticked group with no row is refused on a change opened after the rule
  - A fix pass too: a pass landed off a demonstration or off the reading of the whole change is a round, with its reader and its row
  - The change page mirrors the thread: the message each hand of the stage is being told, in the words the workflow sends, and one row per event of the change's history on `main`
  - Archived whole: the file archives with the change and is folded nowhere
- The walk
  - Test first: each task group lands the tests its scenario ids name in their own commit, then the code, then its readers, then the landing summary
  - Demonstrated: the last group walks the journeys end to end through the interface each actor uses and leaves the end-to-end suite, marking each covered case automated
  - Decided by a test: a case a test in this store decides reads automated from the commit that lands that test, and the suite names the deciding test on the case
  - Run sheet: the pass on staging leaves automated cases out and says how many
  - Suite on every push: the end-to-end suite runs on every push to `main`, its smoke cases on every staging deploy and cut
  - Tick refused: a task naming a scenario id no test in the tree cites is not ticked; a task naming none is
  - Whole read: one reader argues the simpler shape for the whole change before staging
- The thread and the runner
  - One thread: `thread:` records the channel and message a change's thread hangs off, written once when it opens, and every message and wake finds it
  - A fresh session per wake: the thread's messages reach a Slack app in front of the store's relay, which fires one run on the change's branch and hands it the wake as data
  - Woken on a landing: the push posts one wake to the relay for each change it put behind, and the relay runs one wake per thread
  - Its own budget: thirty minutes on a landing or a reply, two hours on a plan; a wake that does not finish posts the failure line with the run's link and frees the thread
  - Landed through the relay: a run pushes its branch and asks the relay, which moves `main` only as a fast-forward and only on the hand's own word
  - The word, typed or pressed: a summary that waits on the hand's word carries one Confirm button, and a press is the landing word said by the member who pressed; a landing word wakes the run at once, where a reply waits a minute for the rest of its burst
  - Resumable: a run reads the change's branch, `main` and the wake's messages and continues from what is there; every push is force-with-lease, and a run that loses says so in the thread and stops

## ADDED Requirements

### Requirement: A round runs six steps for every artifact

One round writes one artifact, and these are its steps.

Every artifact of a change, from the proposal to a task group's code, SHALL be
written by one round of six steps, and no artifact SHALL reach `main` by any
other route.

| # | Step | Who | What it produces |
| --- | --- | --- | --- |
| 1 | Ask | The hand | What is wanted, said in the thread, in a terminal, or as a push the hand makes |
| 2 | Draft | The change's agent | The artifact on the change's branch, drawn from what is before it and from the ask |
| 3 | Challenge | One agent per perspective summoned | One reader's findings: what is wrong, what is missing, what is simpler |
| 4 | Verify | One agent per group of findings | A verdict per finding; what stands changes the draft |
| 5 | Read | The hand | The draft's summary and its numbered questions in the thread; the hand answers, remarks, or says land |
| 6 | Land | The change's agent | The artifact on `main`, the round's row, the next hand told, and every artifact after it read again |

- **Drafted, never landed** — steps 2 to 4 land nothing on `main`; the draft
  stays on the change's branch until the hand's word
- **One reply** — the summary reaching the hand is one reply in the thread, of
  one screen, naming the perspectives that read the draft, the findings that
  stood, and each numbered question with its recommendation
- **Verified before read** — a finding that stands is applied to the draft
  before the hand reads it, and a finding that falls is not shown as a question

#### Scenario: shared-planning-agent-rounds-SC-01 - A draft reaches its hand read and verified
**Serves:** shared-planning-agent-rounds-US-02 - the designer finds a summary waiting instead of an empty file

- **WHEN** the change's agent has drafted an artifact and its challengers and verifiers have run
- **THEN** the draft sits on the change's branch and not on `main`
- **AND** one reply in the thread carries the draft's summary of one screen, the perspectives that read it, the findings that stood, and each numbered question with its recommendation
- **AND** a finding the verifier rejected appears neither in the draft nor in the summary

#### Scenario: shared-planning-agent-rounds-SC-02 - Nothing lands without the hand's word
**Serves:** shared-planning-agent-rounds-US-02 - the designer's word is the only thing that puts the design on `main`

- **GIVEN** a draft whose challenge and verify steps are finished
- **WHEN** the hand has neither answered, remarked nor said land
- **THEN** the artifact is not on `main`
- **AND** no further step of the round runs

#### Scenario: shared-planning-agent-rounds-SC-03 - A finding that stands changes the draft
**Serves:** shared-planning-agent-rounds-US-03 - the tech PIC reads a mechanism the readers have already argued over

- **GIVEN** a challenger reports that a proposed mechanism holds state a simpler one would not
- **WHEN** the verifier argues the finding and it stands
- **THEN** the draft is changed before the summary is written
- **AND** the summary names the finding as one that stood

### Requirement: One word lands every artifact of that hand

One word lands every artifact that hand owns, and stops at the first artifact
of another.

On the hand's word the round SHALL land every drafted artifact of that hand in
the chain's order, each in one commit that records who said it, and SHALL stop
at the first artifact of another hand. The word SHALL be the hand of the
artifact's stage, and a word from any other teammate SHALL be refused.

- **In the chain's order** — the artifacts land oldest first, each landing
  drawn from what landed before it
- **Stops at another hand** — the first artifact another hand owns is left
  drafted, and that hand is told it is their turn
- **`landed_by:`** — each landed artifact gains its `landed_by:` line with the
  hand's handle
- **The row** — `rounds.md` gains each round's row, in the same commit as that
  artifact's landing
- **The next hand** — the thread carries one reply naming what landed, the
  handle whose word landed it, and the stage the change reached
- **What comes after** — every artifact after the last one landed is read again
- **A held row first** — while a held row is open the word lands nothing and
  names the rows; `land with recommendations` takes every one of them as
  recommended and goes on
- **Another teammate's word** — refused, with a reply naming whose word the
  artifact waits on; reassigning the hand is the way around

#### Scenario: shared-planning-agent-rounds-SC-04 - One word lands every artifact of that hand
**Serves:** shared-planning-agent-rounds-US-01 - the product manager says land once and the three artifacts they own land together

- **GIVEN** a change whose proposal, decisions and journeys are drafted for the product manager, and whose design is drafted for the designer
- **WHEN** the product manager says land in the thread
- **THEN** the three artifacts land on `main` in the chain's order, each with its `landed_by:` line carrying that handle and its round's row
- **AND** the design is left drafted and the designer is told it is their turn
- **AND** the thread carries one reply naming what landed, the handle whose word landed it, and the stage the change reached

#### Scenario: shared-planning-agent-rounds-SC-05 - Anybody but the hand is refused
**Serves:** shared-planning-agent-rounds-US-02 - the designer's own word is what the design waits on, and nobody else's

- **GIVEN** a drafted artifact whose hand has not read it
- **WHEN** another teammate in the thread says land
- **THEN** the artifact does not reach `main` and no `landed_by:` line is written
- **AND** the reply names the hand whose word the artifact waits on
- **AND** a landing run from a terminal reads the committer's e-mail and resolves it to a handle through the team map, refusing an e-mail the map does not name and a handle that is not the hand of the stage

### Requirement: The blind readings stay the requirements' challenge

The requirements and the cases are read by the two blind readings this store
already runs, in the round's shape.

For `spec.md` and `feature-tcs.md` the round's challenge step SHALL be the two
independent readings of the change's anchors, and its verify step SHALL be
their reconciliation. The product manager's word at the reconciliation SHALL
land both files, together.

- **Two readings, one method each** — the requirements and the cases are drawn
  from the same anchors, neither reader seeing the other's output
- **No verifier over them** — no agent reads both readings to decide which is
  right
- **Stops on the product manager** — a disagreement or a question neither
  reading can settle is asked of the product manager, who reads the
  requirements and the cases together
- **The writer reconciles** — the run that took both readings joins them; it
  does not verify itself

#### Scenario: shared-planning-agent-rounds-SC-06 - The requirements' round takes two readings
**Serves:** The round - the requirements of every change are drawn twice before anybody reads them

- **WHEN** `/specify` runs on a change whose decisions and journeys are on `main`
- **THEN** the requirements and the cases are written by two readers, neither reading the other's output
- **AND** the two are joined by the run that took them
- **AND** no agent is dispatched to decide between them
- **AND** the product manager's word at the reconciliation lands both files together

#### Scenario: shared-planning-agent-rounds-SC-07 - A reading raises what it cannot settle
**Serves:** shared-planning-agent-rounds-US-04 - the hand is asked the one thing the two readings could not decide

- **WHEN** a reading meets a behaviour the anchors do not settle
- **THEN** the product manager is asked it as a numbered question
- **AND** neither reading decides it
- **AND** the requirements and the cases are shown to the product manager together

### Requirement: A round's size is read from the draft

How many readers a round has is read from the draft's own diff.

The perspectives a round dispatches SHALL be computed from what the draft
touches, and no key SHALL declare or waive them.

| `when` | What in the draft summons that reader |
| --- | --- |
| `always` | Every round of the artifacts whose list names it, whatever the draft touched; the reader who argues for the simpler shape is on every list |
| `surface` | A screen, a state, or a story |
| `schema` | A data model |
| `export` | A public export or an interface |
| `system` | Another system reached |
| `migration` | A migration task group |
| `flag` | A flag on a task group |
| `money` | An amount in minor units |
| `deploy` | A deploy step |
| `copy` | A page's words, or words a reader sees |

- **The simpler thing, always** — the `always` reader runs on every round and
  is the floor when a round has one reader
- **One reader verifies itself** — a round that dispatched one reader in all
  dispatches no verifier, and that reader argues its own findings
- **No waiver** — a round's size is computed from the draft alone; a record key
  neither adds a reader nor removes one, and a size somebody believes is wrong
  is a question for the interview

#### Scenario: shared-planning-agent-rounds-SC-08 - A words-only draft is read by one reader
**Serves:** The round - a change that moves a page's words reaches only the reader it needs

- **WHEN** a draft's diff touches a page's words and nothing else
- **THEN** the reader for words and the `always` reader are dispatched
- **AND** no other perspective is dispatched
- **AND** one verifier reads the two readers' findings together

#### Scenario: shared-planning-agent-rounds-SC-09 - A draft that names an export summons its readers
**Serves:** The round - a draft is measured by what it changed, not by who wrote it

- **WHEN** a draft's diff adds a public export and a migration task group
- **THEN** the readers whose `when` is `export` and `migration` are dispatched, with the `always` reader
- **AND** a verifier is dispatched per group of findings

#### Scenario: shared-planning-agent-rounds-SC-10 - No key changes a round's size
**Serves:** The round - the size is computed on every draft and never read from the change's record

- **WHEN** the change's record carries a key that would waive or shorten the readers of an artifact
- **THEN** the perspectives dispatched are those the draft summons plus the `always` reader
- **AND** the key changes nothing

### Requirement: A hand has four moves

Everything a hand says is one of four moves, and each writes one thing.

A hand SHALL work an artifact through four moves, and the round SHALL write
exactly what each one names. A reply that is none of the other three SHALL be
taken as a remark.

| Move | The hand says | What the round writes |
| --- | --- | --- |
| Answer | `Q<n>: <answer>`, or `Q<n>` alone | The answer, or the recommendation where the id stands alone, into that numbered decisions row; the question closes |
| Remark | Any other words | A `rounds.md` row naming the remark; the draft changed as the remark is written; a decisions row where the remark settles a choice one asked |
| Land | `land` | `landed_by:` with the hand's handle, and the artifact on `main` |
| Edit | A push to the change's branch, from a terminal or from the code host | Nothing: the push is the hand's word for the lines it touched |

- **Applied as written** — a remark is applied as the hand wrote it; the round
  does not argue it
- **Re-read by what it touched** — a remark re-runs only the perspectives the
  edited lines summon, and the reply names them
- **No question on an edited line** — a line a hand pushed is never asked back
  to them as a question
- **A reply the round cannot apply** — answered with what it could not do, and
  the question it names stays open
- **A remark on a page's marked lines** — from the product manager it is
  applied to the page as written; from any other hand it becomes a ❓ line on
  the page for the product manager

#### Scenario: shared-planning-agent-rounds-SC-11 - A question answered by its id alone
**Serves:** shared-planning-agent-rounds-US-04 - the hand takes the recommendation without retyping it

- **GIVEN** a numbered decisions row carrying a recommendation
- **WHEN** the hand replies with that question's id and nothing else
- **THEN** the row is written with the recommended option
- **AND** the question closes

#### Scenario: shared-planning-agent-rounds-SC-12 - A remark is applied and re-read narrowly
**Serves:** shared-planning-agent-rounds-US-02 - the designer says what to change and reads which readers ran again

- **WHEN** the designer replies with a remark on one state's words
- **THEN** the draft is changed as the remark is written
- **AND** only the perspectives the edited lines summon read again
- **AND** the reply in the thread names those perspectives
- **AND** `rounds.md` gains a row naming the remark

#### Scenario: shared-planning-agent-rounds-SC-13 - A remark settles a question that was asked
**Serves:** shared-planning-agent-rounds-US-03 - the tech PIC's challenge is answered where the next reader will find it

- **GIVEN** a numbered decisions row asking which mechanism is taken
- **WHEN** the tech PIC remarks that the other option is taken
- **THEN** that row is written with the answer
- **AND** `rounds.md` gains the round's row naming the remark
- **AND** the thread carries the agent's answer to the challenge

#### Scenario: shared-planning-agent-rounds-SC-14 - A hand's own push is their word
**Serves:** shared-planning-agent-rounds-US-02 - the designer changes the file directly and the round takes it

- **WHEN** the hand of an artifact pushes an edit to the change's branch
- **THEN** the pushed lines are treated as that hand's word
- **AND** no question is raised about them
- **AND** the round continues from what is pushed

#### Scenario: shared-planning-agent-rounds-SC-15 - A reply the round cannot apply is answered
**Serves:** shared-planning-agent-rounds-US-04 - the hand learns their words were read and what they did not reach

- **GIVEN** a numbered question open on the hand
- **WHEN** the hand replies with words the round cannot apply to the draft
- **THEN** the reply is answered with what the round could not do
- **AND** the question stays open on that hand
- **AND** no artifact reaches `main` on that reply

#### Scenario: shared-planning-agent-rounds-SC-16 - A remark on a page's marked lines
**Serves:** shared-planning-agent-rounds-US-02 - the designer's words about the product reach the page the product manager keeps

- **GIVEN** a draft whose summary quotes the marked lines of the page the change links
- **WHEN** a remark changes what one of those lines says
- **THEN** a remark from the product manager is applied to the page as written
- **AND** a remark from any other hand becomes a ❓ line on the page for the product manager

### Requirement: A first sentence opens a change

A change can start from one message, with nobody opening a terminal.

A message in the planning channel that addresses the app and names no existing change SHALL open one.

- **The id** — chosen from the sentence
- **The hand** — the asker's handle written as the change's `hands: pm`
- **No entry in the team map** — the change opens with its product manager
  unnamed, and the reply says so and asks for the handle
- **The reply** — the change's id said back in the thread that message started
- **Every later hand** — a message naming a change that exists is answered in
  that change's thread, the reply names that change's id, and nothing is opened

#### Scenario: shared-planning-agent-rounds-SC-17 - A product manager opens a change from one sentence
**Serves:** shared-planning-agent-rounds-US-01 - the product manager says what is wanted and never opens a terminal

- **WHEN** a product manager writes in the planning channel what is wanted, addressing the app and naming no change
- **THEN** a change is opened whose id is drawn from that sentence
- **AND** the asker's handle is written as its `hands: pm`
- **AND** the first reply in that message's thread names the change's id

#### Scenario: shared-planning-agent-rounds-SC-18 - A later message joins the change it names
**Serves:** shared-planning-agent-rounds-US-01 - the product manager answers where the change already lives

- **WHEN** a message names a change that exists
- **THEN** it is answered in that change's thread and the reply names that change's id
- **AND** no second change is opened

#### Scenario: shared-planning-agent-rounds-SC-19 - An asker the team map does not know
**Serves:** shared-planning-agent-rounds-US-01 - a teammate's sentence opens the change and the handle is asked for afterwards

- **GIVEN** an asker with no entry in the team map
- **WHEN** they write in the planning channel what is wanted, addressing the app and naming no change
- **THEN** the change opens with its product manager unnamed
- **AND** the reply says the hand is unnamed and asks for the handle

### Requirement: A draft waits for what only its hand can give

A draft SHALL NOT invent what only the artifact's hand holds; it SHALL write a
dated wait instead.

- **The frames come from the designer** — a designer's ask carries the links to
  the frames the design is drawn from
- **A frame nobody drew** — a draft of `ui-design.md` needing a frame nobody
  has drawn writes a dated `awaiting: ui-design:` line on the designer, and
  describes no screen in prose in its place

#### Scenario: shared-planning-agent-rounds-SC-20 - A design needs a frame nobody drew
**Serves:** shared-planning-agent-rounds-US-02 - the designer is asked for the frame rather than handed a screen written out in words

- **WHEN** a draft of `ui-design.md` needs a screen no frame in the designer's ask covers
- **THEN** the change's record gains a dated `awaiting: ui-design:` line naming the screen and the designer
- **AND** the draft describes no screen of its own in its place

### Requirement: A preference is decided, and a held row waits for its hand

A round decides a preference on the best option, and holds only what a person
has to take.

Every preference and every product decision a round meets SHALL be written as
a numbered row in the change's `decisions.md`, and the round SHALL hold the row
for its hand only where the choice moves the change's scope, is costly to undo,
needs a fact only a person has, or divides its options by more than a task
group of work.

| The row | Written as | What it holds |
| --- | --- | --- |
| Held: it moves the change's scope, is costly to undo, needs a fact only a person has, or divides its options by more than a task group of work | `❓ <role> - recommended: <option>`, the options it was chosen over beside it | Every landing of the change that asks a word, until it is answered or waved through |
| Decided by the round: every other preference | `<option> - decided by the round`, what it passed over beside it | Nothing |

- **The id** — the next number the change has not used, issued per change and
  never reused, not for a withdrawn row and not for an answered one
- **Overturned by one reply** — a row the round decided is changed by any
  hand's reply, applied as written, and the round reads again what the change
  of option reaches
- **Listed to its hand** — a held row is an open question and a row the round
  decided is none; the listing per hand is stated once, under Open questions
  are listed per hand
- **Waved through** — `land with recommendations` takes every held row of the
  change as recommended, and the landing commit records each as answered
- **Holds no stage** — neither row holds a stage, a tick, a claim or a wait; a
  held row holds the change's landings and nothing else

#### Scenario: shared-planning-agent-rounds-SC-21 - A preference is decided, and one that moves scope is held
**Serves:** shared-planning-agent-rounds-US-04 - the hand is asked the choices only they can take and reads the rest already decided

- **WHEN** a round keeps a finding that is a preference or a product decision
- **THEN** a choice that moves the change's scope, is costly to undo, needs a fact only a person has, or divides its options by more than a task group of work is written as `❓ <role> - recommended: <option>`, and the draft ahead of it takes the recommendation until the hand answers, when the cascade redraws what turned on it
- **AND** every other preference is written as `<option> - decided by the round` with what it passed over beside it, and the draft takes that option
- **AND** the held row is an open question and the row the round decided is none
- **AND** any hand's reply overturns a row the round decided

#### Scenario: shared-planning-agent-rounds-SC-22 - A question id is never reused
**Serves:** Questions, never guesses - the thread and the change name the same numbered row months apart

- **GIVEN** a change whose highest numbered row is the seventh, of which two are answered and one withdrawn
- **WHEN** a round raises another
- **THEN** it is written as the eighth row, never as a number a withdrawn row freed
- **AND** no answered or withdrawn number is issued again

#### Scenario: shared-planning-agent-rounds-SC-23 - A row the round decided holds nothing
**Serves:** Questions, never guesses - a change goes on past every choice the round took for itself

- **GIVEN** a change carrying a row the round decided and no held row
- **WHEN** the stage's artifacts are otherwise on `main`
- **THEN** the change's stage moves, and the next artifact lands on its hand's word
- **AND** the row is no open question, and no list carries it
- **AND** a tick, a claim and a wait are taken as usual

#### Scenario: shared-planning-agent-rounds-SC-72 - A held row holds the landing until answered or waved through
**Serves:** shared-planning-agent-rounds-US-04 - the hand's answer is what lets the change land, and one phrase waives it

- **GIVEN** a change carrying two held rows and a drafted artifact of the hand
- **WHEN** the hand says land
- **THEN** nothing lands and the reply names both rows
- **AND** the same word lands the artifact once both rows are answered
- **AND** `land with recommendations` takes every held row of the change as recommended in the landing commit, and the landing goes on

### Requirement: A finding goes where it belongs

Every finding a round keeps has one home, and it is written there first.

A finding a round keeps SHALL be written in the artifact that owns it, before
the draft that depends on it.

| Finding | Written as |
| --- | --- |
| A product detail: a value, a set the reader meets, an outcome they see, a decision | A ❓ line in the section of the page the change links, naming who confirms it |
| A preference or a product decision | A numbered `decisions.md` row, held for its hand or decided by the round, as above |
| A goal or a non-goal | A line in `decisions.md`'s goals or non-goals |
| A state a reader sees | A `## States` bullet in `ui-design.md` |
| A mechanism | A decision in `tech-design.md` |

- **Never two places** — a product detail on the page is not also a numbered
  row, and a requirement is written from the page rather than beside it
- **Before what depends on it** — the artifact that owns the finding is written
  before the draft that would have stated it

#### Scenario: shared-planning-agent-rounds-SC-24 - A draft needs a value nobody confirmed
**Serves:** shared-planning-agent-rounds-US-04 - the hand confirms a value where every reader of the product will find it

- **WHEN** a draft needs a value or an outcome the page does not state
- **THEN** the page gains a ❓ line for it in the section it belongs to, naming who confirms it
- **AND** the draft states no value in its place
- **AND** no numbered decisions row is written for it

#### Scenario: shared-planning-agent-rounds-SC-25 - A finding names a state and a mechanism
**Serves:** shared-planning-agent-rounds-US-03 - the tech PIC's reading lands in the design it is about, not in the requirement drawn from it

- **WHEN** a round on the requirements keeps a finding naming a state a reader sees and one naming a mechanism
- **THEN** the state is written as a `## States` bullet in `ui-design.md` and the mechanism as a decision in `tech-design.md`
- **AND** the requirements are drafted only after both have landed

### Requirement: Open questions are listed per hand

An open row is a held row, and every one of them reaches the hand it waits on.

Every held row SHALL be listed to the hand it waits on, and a row the round
decided SHALL be listed nowhere.

- **An open row is a held row** — the ❓ and the hand it waits on are what make
  a row open; a row the round decided is no question, and no list carries it
- **The change page** — each artifact row carries the ids of the questions open
  on it, linking to the change's decisions
- **My turn** — the questions addressed to the reader sit above the changes on
  them, one row each: the change, the question's id, the question's first line,
  and the thread
- **None** — a reader with no open question is shown the changes on them alone

#### Scenario: shared-planning-agent-rounds-SC-26 - A hand reads their open questions first
**Serves:** shared-planning-agent-rounds-US-04 - the hand finds every question waiting on them in one place

- **GIVEN** two changes carrying open numbered rows addressed to one handle
- **WHEN** that handle opens My turn
- **THEN** both questions are listed above the changes on them, each with its change, its id, its first line and the thread
- **AND** the change page shows those ids on the artifact rows they were raised against

#### Scenario: shared-planning-agent-rounds-SC-27 - A hand with no open question
**Serves:** shared-planning-agent-rounds-US-04 - the hand with nothing to answer reads their changes without a gap

- **WHEN** a handle with no open numbered row opens My turn
- **THEN** the changes on them are shown with no question rows above them

### Requirement: Each artifact's perspectives are data beside its teammate

The readers a round may dispatch SHALL be recorded once per artifact in the
planning schema, beside that artifact's teammate, and every round SHALL read
them from there.

| Artifact | Perspectives it may summon |
| --- | --- |
| The page's marks, `proposal.md`, `decisions.md`, the journeys | Product; the reader of the product; design; backend; integration; operations |
| `ui-design.md` | The journeys, walked; the design system's inventory and its parity with the design file; the words, as the reader would say them |
| `tech-design.md` | Deterministic, resilient, observable; simple and clear; consistent, modular, built on later; testable and buildable |
| `spec.md` and `feature-tcs.md` | The two blind readings, then the reconciliation |
| `tasks.md` | Order and dependencies; tests first; the end-to-end group; migration and flag; the simpler thing |
| A task group | Missing pieces; simplicity; code smell; the repository's conventions; QA; operations on a migration or a flag; the simpler thing |

- **One entry, three facts** — each perspective carries its name, what in a
  draft summons it, and the reader it dispatches
- **A task group — on the schema's apply block** — a task group is no artifact
  of the schema, so its readers sit as `perspectives:` on the schema's `apply:`
  block, read through the same reader
- **No reader without a trigger** — a perspective no draft can summon is not an
  entry
- **One procedure** — `/plan`, `/design`, `/tech`, `/specify`, `/tasks`,
  `/build` and `/land` each name their artifact and call `/round`, which reads
  this table; none of them carries its own copy of it

#### Scenario: shared-planning-agent-rounds-SC-28 - Every round reads one table
**Serves:** Perspectives as data - each line command asks for the readers of its own artifact and gets them from one place

- **WHEN** a round runs for an artifact
- **THEN** the perspectives it may dispatch are those the schema records for that artifact
- **AND** the same table answers every artifact's round

#### Scenario: shared-planning-agent-rounds-SC-29 - A new reader is one row
**Serves:** Perspectives as data - somebody adds a reader and every artifact's round picks it up

- **WHEN** a perspective with its name, its `when` and its reader is added for an artifact
- **THEN** a round on that artifact dispatches it when a draft summons it
- **AND** nothing about the six steps changes

### Requirement: A reader sees the draft and never another reader's output

Each perspective SHALL be read by one agent given the draft and what is before
it, and SHALL NOT be given any other reader's findings or verdicts.

- **One per perspective** — one challenger per perspective summoned, one
  verifier per group of findings
- **What a verifier sees** — the findings of its group and the draft
- **Held to the principles** — `tech-design.md`'s readers and a task group's
  readers hold the draft to the eight principles the store records —
  determinism, simplicity, clarity, flexibility, modularity, consistency,
  resilience, observability — and name the one a finding rests on
- **Conscientious** — every reader names a wrong thing already there and argues
  for its structure to be fixed rather than its symptom, one fix per kind of
  problem

#### Scenario: shared-planning-agent-rounds-SC-30 - Two challengers read the same draft
**Serves:** Perspectives as data - two readers of one draft are two readings, not one passed along

- **WHEN** two perspectives are summoned by one draft
- **THEN** each reader is given the draft and what is before it
- **AND** neither is given the other's findings
- **AND** neither is given a verifier's verdict

#### Scenario: shared-planning-agent-rounds-SC-31 - A design's reader names the principle
**Serves:** shared-planning-agent-rounds-US-03 - the tech PIC reads a finding as a claim against a stated principle

- **WHEN** a reader of `tech-design.md` reports a finding
- **THEN** the finding names which of the eight principles it rests on
- **AND** a finding that names none is not carried into the summary

### Requirement: What is before an artifact

Every artifact is drawn from the artifacts before it, in one order.

Every artifact SHALL carry one upstream set, recorded as `upstream:` on that
artifact in the planning schema and read in the schema's own artifact order,
and everything after an artifact SHALL be drawn from it.

| Artifact | `upstream:` |
| --- | --- |
| `proposal.md` | The page sections the change links |
| `decisions.md` | The page sections; `proposal.md` |
| `user-journeys.md` | The page sections; `proposal.md`; `decisions.md` |
| `ui-design.md` | The page sections; `proposal.md`; `decisions.md`; `user-journeys.md` |
| `tech-design.md` | The page sections; `proposal.md`; `decisions.md`; `user-journeys.md` |
| `spec.md` | The above, then `ui-design.md` and `tech-design.md` |
| `feature-tcs.md` | The page sections; `proposal.md`; `decisions.md`; `user-journeys.md`; `ui-design.md`; `tech-design.md` |
| `tasks.md` | The above, then `spec.md` and `feature-tcs.md` |
| The code and its end-to-end tests | The above, then `tasks.md` |

- **The set is data** — `upstream:` names the artifact ids on each artifact in
  `openspec/schemas/grade10-planning/schema.yaml`, and the set is read in the
  schema's artifact order, in which the tech design sits above the requirements
- **`feature-tcs.md` omits `spec.md`** — the cases are a blind reading of the
  same anchors, drawn beside the requirements and never from them
- **`tech-design.md` omits `ui-design.md`** — both are drawn from the journeys
  side by side, and neither waits on the other
- **One artifact, every capability** — a change specifying several capabilities
  carries one `upstream:` entry and one `reviewed:` line per artifact id, never
  one per capability
- **A change's own artifact, whole** — every line of it is upstream
- **A page, in sections** — only the sections the change links, because a page
  carries the marks of many changes
- **The record is never upstream** — a change's own `.openspec.yaml` is in no
  upstream set
- **A waived artifact is fresh** — a waiver says nothing is owed, so nothing
  after it waits on it
- **The code keeps no read record** — no `reviewed:` line is written for the
  code; a behind `tasks.md` refuses the group's landing instead

#### Scenario: shared-planning-agent-rounds-SC-32 - A waived design leaves nothing behind it
**Serves:** Read again, in order - a change that owes no design still lands its requirements

- **GIVEN** a change whose record waives `ui-design.md`
- **WHEN** the requirements are landed
- **THEN** the waived artifact counts as fresh
- **AND** the landing is not refused on its account

#### Scenario: shared-planning-agent-rounds-SC-33 - The record's own edit moves nothing
**Serves:** Read again, in order - a hand is written into the change and nothing is redrawn

- **WHEN** a change's `.openspec.yaml` is edited and pushed
- **THEN** no artifact of that change goes behind

#### Scenario: shared-planning-agent-rounds-SC-34 - An unlinked page section moves nothing
**Serves:** Read again, in order - a page carrying many changes' marks is edited for one of them

- **GIVEN** a change linking two sections of a page
- **WHEN** a third section of that page changes
- **THEN** no artifact of that change goes behind

### Requirement: The content id says whether an artifact is fresh

Freshness is one comparison over the text of what is before an artifact.

Freshness SHALL be read from the text of what is before an artifact, and never
set by hand.

- **`reviewed:`** — the change's record holds one line per artifact, the
  artifact's id to a content id
- **One function** — `contentIdOf` in the store computes every content id every
  surface, script and check reads, and nothing computes a second one
- **The content id** — the first 8 hexadecimal characters of the SHA-256 of the
  artifact's `upstream:` texts in the schema's order, each text with its
  whitespace collapsed and trimmed, joined by a NUL
- **Collapsed and trimmed, nothing else** — runs of whitespace become one space
  and the ends are trimmed; a link's target and a scenario id are part of the
  text, so a retargeted link or a renumbered scenario puts what comes after it
  behind
- **Equal is fresh** — an artifact whose recorded content id equals the id
  computed from what is on `main` is fresh
- **A differing id is behind** — an artifact whose recorded content id differs
  from the one computed from what is before it reads as behind
- **No line at all** — an artifact carrying no `reviewed:` line is dated by the
  commit-date fallback, and that derivation is `shared/planning/change-stages`'
  own: this capability states no rule of its own in its place
- **A rewrap is not a change** — whitespace is collapsed before the hash, so an
  edit that moves only whitespace leaves the content id equal; a reformat that
  changes words puts what comes after it behind

#### Scenario: shared-planning-agent-rounds-SC-35 - An equal content id reads fresh and every other behind
**Serves:** Read again, in order - every surface that shows an artifact as fresh reads this one comparison

- **WHEN** an artifact's recorded content id equals the id computed from what is before it on `main`
- **THEN** the artifact is fresh and nothing after it waits on it
- **AND** an artifact whose recorded id differs is behind, and one carrying no `reviewed:` line is dated by `shared/planning/change-stages`' commit-date fallback

#### Scenario: shared-planning-agent-rounds-SC-36 - Whitespace alone changes nothing
**Serves:** Read again, in order - an upstream file is rewrapped and every artifact after it stays as it was

- **GIVEN** an artifact recorded as fresh
- **WHEN** an upstream file changes only in its whitespace
- **THEN** the computed content id is unchanged and the artifact stays fresh
- **AND** an upstream reformat that changes words puts it behind

### Requirement: An artifact is fresh, behind, or being read again

Every artifact of a change SHALL be in exactly one of three states, each read
from the files.

| State | Read from | What it holds |
| --- | --- | --- |
| Fresh | The recorded content id equals the computed one, or the artifact is waived | Nothing |
| Behind | No recorded content id, or one that differs | The landing of every artifact after it, and the fold at archive |
| Read again | The change's agent has read the artifact against what is before it since the landing that put it behind, and has written the `reviewed:` line or opened a round | Nothing beyond what the opened round holds |

- **Never held** — a tick, a claim and a wait are never held by a behind
  artifact, in any of the three states

#### Scenario: shared-planning-agent-rounds-SC-37 - A landing puts what follows it behind
**Serves:** shared-planning-agent-rounds-US-05 - the hand of an artifact learns it is behind from the change itself

- **GIVEN** a change whose artifacts are all fresh
- **WHEN** `ui-design.md` lands with changed content
- **THEN** every artifact after it is behind
- **AND** the hand of the earliest behind artifact is told once

#### Scenario: shared-planning-agent-rounds-SC-38 - A behind artifact holds no tick
**Serves:** Read again, in order - work already pushed is recorded whatever the change's earlier artifacts say

- **GIVEN** a change carrying a behind artifact
- **WHEN** a task is ticked, a change is claimed, or a wait is written
- **THEN** each is taken
- **AND** none is refused on account of the behind artifact

### Requirement: A landing reads again, in order

A landing wakes the change and clears what it put behind, one artifact at a
time.

A landing on `main` SHALL wake the change's agent, which SHALL read every
artifact after the one that moved, oldest first.

- **A read that changes nothing** — the agent writes that artifact's
  `reviewed:` line alone, in one commit, and says in the thread what it read
  and that nothing changed
- **Not a round** — a read that changes nothing writes no `rounds.md` row: it
  ran no perspective, and the record's rule reads landed artifacts and ticked
  groups alone
- **A read that edits** — the agent writes no `reviewed:` line and opens a
  round for that artifact's hand, naming what reached it
- **Redrawn, then drafted ahead** — a read that would edit several redraws each
  from the redrawn artifact before it, drafts the rest of the chain from them,
  each draft with its own readers, and opens a round for every edited
  artifact's hand
- **Lands nothing** — the chain sits on the change's branch, each artifact
  waits for its own hand's word, and the hands land them in the chain's order
- **What only a hand holds** — a draft that needs it writes the dated wait and
  drafts nothing that depends on it
- **Nothing after it** — a landing with nothing after it reads nothing and says
  nothing beyond the landing line
- **The agent's only landing** — a `reviewed:` line for an artifact it read and
  found right is the one thing the agent lands on its own; every other landing
  waits for a hand's word

#### Scenario: shared-planning-agent-rounds-SC-39 - A read that changes nothing says so
**Serves:** shared-planning-agent-rounds-US-05 - the hand is told their artifact was read and is not asked to read it

- **GIVEN** an artifact behind a landing that did not move what it says
- **WHEN** the change's agent reads it again
- **THEN** the artifact's `reviewed:` line lands alone, in one commit
- **AND** the thread carries one reply naming what was read and saying nothing changed
- **AND** no `rounds.md` row is written and the artifact's hand is asked nothing

#### Scenario: shared-planning-agent-rounds-SC-40 - A read that edits opens a round
**Serves:** shared-planning-agent-rounds-US-05 - the hand is brought in only when the change reaches their artifact

- **GIVEN** an artifact behind a landing that moved what it says
- **WHEN** the change's agent reads it again
- **THEN** a round opens for that artifact's hand, its reply naming what reached the artifact
- **AND** no `reviewed:` line is written for it
- **AND** the edited artifact does not land until that hand's word

#### Scenario: shared-planning-agent-rounds-SC-41 - Artifacts are read oldest first, each redrawn from the one before it
**Serves:** shared-planning-agent-rounds-US-05 - one landing clears a chain of artifacts in the order they were drawn

- **GIVEN** a change whose design, requirements, cases and plan are all behind one landing
- **WHEN** the change's agent reads them again and two of them need editing
- **THEN** it reads them in the order they sit in the upstream set, oldest first
- **AND** each edited artifact is redrawn from the redrawn artifact before it, and the artifacts after it are drafted from what was redrawn
- **AND** a round opens for every artifact it redrew, nothing lands, and the hands land them in the chain's order
- **AND** a draft that needs what only a hand holds writes the dated wait, and nothing that depends on it is drafted

#### Scenario: shared-planning-agent-rounds-SC-42 - A landing with nothing after it says nothing more
**Serves:** shared-planning-agent-rounds-US-05 - a hand whose artifact is the last one reads one reply and no more

- **GIVEN** a change whose landed artifact has nothing after it
- **WHEN** the landing wakes the change's agent
- **THEN** no round opens and no `reviewed:` line changes
- **AND** the thread carries nothing beyond the landing line

### Requirement: A wake asked to plan drafts the whole chain

A change can be drafted end to end from one ask, with nobody waiting between
its artifacts.

A wake that opens a change or is asked to plan SHALL draft every artifact it
can reach on the change's branch, each from the draft before it except the
cases, and SHALL land nothing.

- **The chain** — `proposal.md`, `decisions.md`, the journeys, `ui-design.md`
  where a surface moves, `tech-design.md`, the requirements and the cases, then
  `tasks.md`, in the order the upstream set gives them
- **The cases beside the requirements** — the cases are the one artifact the
  chain does not draw from the draft before it: their upstream set draws them
  from the anchors, and never from `spec.md`, so neither reading sees the
  other's output
- **Each with its own readers** — every draft in the chain is challenged and
  verified as its own round
- **Pushed as it goes** — the branch is pushed after every artifact, so a wake
  that dies loses one artifact and not the chain
- **Lands nothing** — every artifact waits for its hand's word
- **What only a hand holds** — the draft that needs it writes the dated wait,
  and nothing that depends on it is drafted

#### Scenario: shared-planning-agent-rounds-SC-71 - A plan wake drafts the chain and lands nothing
**Serves:** shared-planning-agent-rounds-US-01 - the product manager's one sentence comes back as a change drafted as far as it can be

- **WHEN** a wake opens a change or is asked to plan one
- **THEN** the proposal, the decisions, the journeys, the design where a surface moves, the tech design, the requirements and the plan are drafted, each from the draft before it
- **AND** the cases are drafted from the anchors, beside the requirements and never from `spec.md`
- **AND** each draft is read by its own perspectives
- **AND** the branch is pushed after every artifact
- **AND** nothing reaches `main`

### Requirement: Nothing lands after a behind artifact

The round's landing step SHALL refuse while any artifact before the one landing
is behind, and the fold at archive SHALL refuse a behind delta.

- **The refusal names it** — the reply says which artifact is behind and whose
  hand it is
- **Archive** — the fold refuses a behind delta, and that refusal is
  `shared/planning/change-stages`' own: `pnpm run archive:preflight` prints it
  with what else still refuses
- **Never held** — a tick, a claim and a wait are refused by neither

#### Scenario: shared-planning-agent-rounds-SC-43 - A landing is refused and says which
**Serves:** shared-planning-agent-rounds-US-05 - the hand asked to land learns which earlier artifact has not been read

- **GIVEN** a change whose `tech-design.md` is behind
- **WHEN** the hand of `spec.md` says land
- **THEN** the landing is refused
- **AND** the reply names `tech-design.md` and the hand it waits on
- **AND** nothing reaches `main`

### Requirement: A goal or a non-goal that moved is a question

A change whose scope moved is never rewritten in place.

A read again that finds a goal or a non-goal in `decisions.md` moved SHALL ask
the product manager one numbered question with three answers, and SHALL rewrite
nothing in place.

- **The three answers** — extend this change, supersede it, or split it
- **What each answer does** — extend: the change goes on with the moved goal
  and everything after the proposal is read again; supersede: a new change
  opens from the moved goal and this one is withdrawn; split: a new change
  takes the moved part and this one keeps the rest
- **Recorded** — each answer is written as a decisions row
- **Until the answer** — nothing after `decisions.md` lands
- **Never in place** — no artifact is redrawn to the moved goal before the
  product manager answers
- **A sentence that overlaps** — a sentence naming no change SHALL be answered
  in the thread of any active change whose deltas name the capability it is
  about, or whose proposal links the page sections it would mark, and that
  change's stage SHALL decide: Proposed or Designed with the same product
  manager is extended by the round, Specified, Planned or Building holds a row
  on its product manager to extend, split or supersede, and a change on
  staging or later is named in a new change's `depends_on:`

#### Scenario: shared-planning-agent-rounds-SC-45 - A moved goal asks the product manager
**Serves:** shared-planning-agent-rounds-US-07 - the product manager is asked before a change mid-build becomes another change

- **GIVEN** a change in Building
- **WHEN** a read again finds a goal or a non-goal in `decisions.md` moved
- **THEN** the product manager is asked one numbered question offering extend, supersede or split
- **AND** no artifact after `decisions.md` is redrawn

#### Scenario: shared-planning-agent-rounds-SC-46 - Nothing lands until the answer
**Serves:** shared-planning-agent-rounds-US-07 - the product manager's answer is what lets the change move again

- **GIVEN** an open question on a moved goal
- **WHEN** the hand of a later artifact says land
- **THEN** the landing is refused and names that question
- **AND** a tick and a claim are still taken

#### Scenario: shared-planning-agent-rounds-SC-47 - Each answer opens or closes what it names
**Serves:** shared-planning-agent-rounds-US-07 - the product manager says one word and the change, or its successor, goes on from there

- **GIVEN** an open question on a moved goal
- **WHEN** the product manager answers extend, supersede or split
- **THEN** extend carries the change on with the moved goal and reads everything after the proposal again
- **AND** supersede opens a new change from the moved goal and withdraws this one
- **AND** split opens a new change for the moved part and leaves the rest here
- **AND** the answer is written as a decisions row

#### Scenario: shared-planning-agent-rounds-SC-80 - A sentence overlaps a change in flight
**Serves:** shared-planning-agent-rounds-US-07 - the product manager says whether a new sentence belongs to the change they already have

- **GIVEN** an active change whose deltas name a capability, or whose proposal links a page's sections
- **WHEN** a sentence naming no change asks for something on that capability or those sections
- **THEN** the run answers in that change's thread
- **AND** the change's stage decides: Proposed or Designed with the same product manager is extended by the round, Specified, Planned or Building holds a row on its product manager to extend, split or supersede, and a change on staging or later is named in a new change's `depends_on:`

### Requirement: A landed Raised row puts the requirements and the cases behind

A row landing in `decisions.md`'s `## Raised` SHALL count as a change to what
is before `spec.md` and `feature-tcs.md`, and both SHALL go behind.

- **No exemption** — `## Raised` is excluded from no upstream set
- **Before the plan** — both are read again before `tasks.md` lands

#### Scenario: shared-planning-agent-rounds-SC-48 - A late answer reaches the requirements
**Serves:** Read again, in order - the answer a reconciliation escalated comes back through the artifacts it was asked about

- **GIVEN** a change whose requirements and cases are fresh
- **WHEN** a row lands in `decisions.md`'s `## Raised`
- **THEN** `spec.md` and `feature-tcs.md` are behind
- **AND** `tasks.md` does not land until both have been read again

### Requirement: A requirement that reaches the tech design writes a dated wait

The tech design is drawn first, and a requirement it does not carry is asked of
the tech PIC rather than written over them.

The requirements pass SHALL read `tech-design.md` beside `ui-design.md`, and a
requirement that needs the proposed mechanism changed SHALL be written as a
dated wait on the tech PIC.

- **The order** — `tech-design.md` is drawn before the requirements, and the
  requirements are drawn from it
- **The wait** — an `awaiting: tech-design:` line carrying the date, the
  requirement and the tech PIC's handle
- **Cleared by** — the tech PIC's edit to `tech-design.md`, or that artifact's
  `reviewed:` line
- **Holds no stage** — the wait is an overlay; it refuses no tick and no claim

#### Scenario: shared-planning-agent-rounds-SC-49 - The requirements pass reads the design
**Serves:** shared-planning-agent-rounds-US-03 - the tech PIC's mechanism is what the requirements are drawn against

- **GIVEN** a change carrying `tech-design.md` and `ui-design.md` on `main`
- **WHEN** the requirements are drafted
- **THEN** both are read as what is before them
- **AND** a requirement contradicting either is not written

#### Scenario: shared-planning-agent-rounds-SC-50 - A requirement reaching the design writes the wait
**Serves:** shared-planning-agent-rounds-US-03 - the tech PIC is told which requirement their design does not carry

- **WHEN** a requirement being drafted needs the proposed mechanism changed
- **THEN** the change's record gains an `awaiting: tech-design:` line with the date, the requirement and the tech PIC's handle
- **AND** the change's stage is not held by it
- **AND** the line is cleared by the tech PIC's edit or by `tech-design.md`'s `reviewed:` line

### Requirement: `rounds.md` holds one row per round

The record says what each round ran, so a round that found nothing and one that
never ran do not read the same.

Every change SHALL carry `rounds.md`, one row per round, written by the landing
in the landing's own commit.

| Column | What it holds |
| --- | --- |
| Round | The round's number in the change, from 1, in landing order |
| Artifact | The artifact's id, or the task group's number |
| Perspectives | The names of the perspectives run, and the verifier where one ran |
| Stood | The findings that stood, as short phrases |
| Asked | The `Q<n>` ids the round raised |
| Tests | Per scenario id, the tests that landed for a task group |

- **With the first round** — the file is written by the first round and is
  absent until then
- **A round that found nothing** — its row names the perspectives run and that
  nothing stood, and lists no question id
- **The change page** — a Rounds row shows one line per row: the artifact or
  group, the perspectives run, what stood, what was asked
- **Archived whole** — the file archives with the change and is folded into no
  durable capability
- **The ids in backticks** — a row's question ids are written in backticks, so
  the store's citation rule resolves each one against that change's own
  `decisions.md`
- **A fix pass is a round** — a pass landed off a demonstration or off the
  reading of the whole change carries its row like any other round: the
  simpler-thing reader reads it, and a round of one reader names no verifier

#### Scenario: shared-planning-agent-rounds-SC-51 - A reader sees what a round did
**Serves:** shared-planning-agent-rounds-US-09 - a reader of the change tells a round that found nothing from one that never ran

- **GIVEN** a change carrying three rounds' rows, one of them from a round whose readers found nothing
- **WHEN** a reader opens the change page
- **THEN** the Rounds row lists one line per round with its artifact or group, the perspectives run, what stood and what was asked
- **AND** the round that found nothing names its perspectives and that nothing stood
- **AND** a ticked task group with no row is shown as having none

#### Scenario: shared-planning-agent-rounds-SC-52 - The record archives with the change
**Serves:** The record - the change is archived and its rows go with it

- **WHEN** a change is archived
- **THEN** `rounds.md` is copied into the archived change
- **AND** nothing from it is folded into the durable capability

#### Scenario: shared-planning-agent-rounds-SC-53 - A change with no round yet carries no record
**Serves:** The record - a change opened this morning is read by the same check as one mid-build

- **GIVEN** a change whose first round has not landed
- **WHEN** a reader opens the change page and `pnpm check:manual` runs
- **THEN** the change carries no `rounds.md` and the Rounds row lists no round
- **AND** the check does not refuse the change

#### Scenario: shared-planning-agent-rounds-SC-70 - A question id the change issues nowhere is refused
**Serves:** The record - a reader follows a row's question id to the decisions row it names

- **GIVEN** a change whose `rounds.md` row names a `Q<n>` in backticks
- **WHEN** `pnpm check:manual` runs and the change's `decisions.md` holds no row with that id
- **THEN** the check refuses and names the id and the change

#### Scenario: shared-planning-agent-rounds-SC-79 - A fix pass is a round with a row
**Serves:** shared-planning-agent-rounds-US-09 - a reader of the change finds the fix passes in the record beside the groups

- **GIVEN** a change whose demonstration or whole-change reading raised fixes
- **WHEN** the fix pass lands
- **THEN** `rounds.md` gains its row, naming the simpler-thing reader among the perspectives it ran
- **AND** the Perspectives column names the verifier where one ran, and names none where that reader was the only one

### Requirement: The change page mirrors the thread and the messages

Before the Slack app is set up, and beside it after, the change page SHALL
show what the thread and the messages say, read from `main` and nowhere else.

- **Told now** — under the Your turn card, the message each hand of the stage
  is being told, in the words the push workflow sends; a stage that names
  nobody says so
- **The thread** — one row per event in the change's history on `main`,
  oldest first, each with its date: opened, each landing and whose word, each
  read again, each round's row, each held question, each hand named, each
  tick; a reading with no history says so
- **One wording** — the message's words come from one module the workflow and
  the manual both import, so Told now and the Slack message are one text

#### Scenario: shared-planning-agent-rounds-SC-81 - The change page mirrors the thread
**Serves:** shared-planning-agent-rounds-US-09 - a reader of the change follows what happened without opening Slack

- **GIVEN** a change on `main` that was opened, landed its proposal on its product manager's word, named a designer, and holds one held row
- **WHEN** a reader opens the change page
- **THEN** the thread lists the opening, the landing with the handle, the hand named and the held row, oldest first, each dated
- **AND** Told now shows the Your turn message the designer receives, word for word as the workflow sends it

### Requirement: A landing or a tick with no row is refused

`pnpm check:manual` SHALL refuse a change that lacks a row for work it has
already done.

- **A written artifact** — an artifact from `proposal.md` to `tasks.md` whose
  `landed_by:` line the change's record carries, with no `rounds.md` row
  naming it; a file on disk that no `landed_by:` line names is a draft
- **A ticked group** — a ticked task group with no row naming that group
- **A missing column** — a row that leaves a column empty is refused as a
  missing row is, naming the column
- **Those two alone** — nothing else owes a row: a read that changed nothing
  ran no round
- **Date-fenced** — the rule reads only changes whose `created:` date is after
  the day it lands, so a change opened that day is not refused by it

#### Scenario: shared-planning-agent-rounds-SC-54 - A landed artifact with no row is refused
**Serves:** The record - a change opened under this rule reaches its next check without a row for what it landed

- **GIVEN** a change created after the day the rule landed, whose record carries a `landed_by:` line for `tasks.md`
- **WHEN** `pnpm check:manual` runs and `rounds.md` carries no row naming `tasks.md`
- **THEN** the check refuses and names the artifact

#### Scenario: shared-planning-agent-rounds-SC-55 - A change opened on or before the rule's day is not refused
**Serves:** The record - the changes already in flight the day the rule lands pass the same check

- **GIVEN** a change whose `created:` date is the day the rule landed, carrying no `rounds.md`
- **WHEN** `pnpm check:manual` runs
- **THEN** it does not refuse the change for a missing row
- **AND** a change created before that day is not refused either

#### Scenario: shared-planning-agent-rounds-SC-56 - A row missing a column is refused
**Serves:** The record - a row half written says as little as no row at all

- **GIVEN** a change created after the day the rule landed, whose `rounds.md` holds a row naming no perspective
- **WHEN** `pnpm check:manual` runs
- **THEN** the check refuses and names the column the row leaves empty

### Requirement: A task group lands test first

Each task group SHALL land its tests before its code, and its landing summary
SHALL reach the engineer only after its readers have run.

1. The tests the group's scenario ids name land in their own commit
2. The code that satisfies them lands
3. The group's perspectives read it and their findings are verified
4. The landing summary reaches the engineer in the thread, naming the
   perspectives that read the group and the tests that landed per scenario
5. The group's `rounds.md` row lands in the store before the group's tasks are
   ticked

#### Scenario: shared-planning-agent-rounds-SC-57 - The tests land in their own commit
**Serves:** shared-planning-agent-rounds-US-06 - the engineer reads a group whose tests were written before its code

- **WHEN** a task group is built
- **THEN** the tests its scenario ids name land in a commit carrying no code for the group
- **AND** the code lands after them

#### Scenario: shared-planning-agent-rounds-SC-58 - The landing summary names its readers and tests
**Serves:** shared-planning-agent-rounds-US-06 - the engineer reads a summary rather than the diff

- **WHEN** a task group's readers and verifiers have run
- **THEN** the thread carries one reply naming the perspectives that read the group and, per scenario id, the tests that landed
- **AND** the group's `rounds.md` row carries the same perspectives and tests

### Requirement: The last group walks the journeys

A change's last task group SHALL walk every journey of every capability the
change specifies, end to end through the interface each actor uses, and SHALL
leave those walks as the change's end-to-end suite.

- **Through the actor's interface** — a journey walked in a browser is walked
  in one; a journey whose actor reads a terminal, a channel message or a file
  is walked there
- **What the suite cannot hold** — a journey no suite can drive, such as one an
  actor walks in Slack or inside an agent's session, is walked once by hand,
  its cases stay manual, and the walk's `rounds.md` row names them
- **Marked automated by the walk** — the commit that lands the walks flips each
  covered case's automation status to automated
- **Marked automated by a test** — a case a unit or script test in this store
  decides reads automated from the commit that lands that test, and the suite
  names the deciding test on the case
- **Marked by neither** — a case no test and no walk decides stays manual,
  with its reason in the suite
- **One pass over the whole** — after the last group, one reader argues the
  simpler shape for the whole change before it goes to staging

#### Scenario: shared-planning-agent-rounds-SC-59 - The walk leaves the suite and marks its cases
**Serves:** shared-planning-agent-rounds-US-08 - the QA teammate reads which cases the walk now covers

- **WHEN** the last task group lands
- **THEN** every journey of every capability the change specifies has been walked end to end through the interface its actor uses and kept as the change's end-to-end suite
- **AND** the same commit sets each covered case's automation status to automated
- **AND** a journey no suite can drive is walked by hand, its cases stay manual, and the walk's `rounds.md` row names them

#### Scenario: shared-planning-agent-rounds-SC-60 - One reader reads the whole change
**Serves:** The walk - a change arrives at staging having been argued as one shape rather than group by group

- **WHEN** the last task group has landed
- **THEN** one reader argues the simpler shape for the whole change
- **AND** the change does not go to staging before that reading

#### Scenario: shared-planning-agent-rounds-SC-78 - A case a store test decides flips with the test
**Serves:** shared-planning-agent-rounds-US-08 - the QA teammate reads which cases a test already decides and which are still theirs to walk

- **GIVEN** a suite whose cases are all manual
- **WHEN** a commit lands a unit or script test in this store that decides one of those cases
- **THEN** that case reads automated from the same commit
- **AND** the case names that test as what decides it
- **AND** a case only the end-to-end walk drives is flipped by the walk's commit instead, and a case neither decides stays manual with its reason

### Requirement: The run sheet keeps what only staging proves

A run sheet SHALL leave out every case whose automation status is automated,
and SHALL say how many it left out.

- **The change page** — the Delivery row shows the suite's automated count
  against its total

#### Scenario: shared-planning-agent-rounds-SC-61 - Automated cases are left out and counted
**Serves:** shared-planning-agent-rounds-US-08 - the QA teammate walks the cases the suite cannot show

- **GIVEN** a suite in which some cases are automated
- **WHEN** a run sheet is written for it
- **THEN** no automated case is on it
- **AND** it says how many it left out
- **AND** the change page shows the automated count against the suite's total

### Requirement: The suite runs on every push and every cut

The change's end-to-end suite SHALL run on every push to `main`, and its smoke
cases SHALL run on every staging deploy and at every release cut.

#### Scenario: shared-planning-agent-rounds-SC-62 - A push runs the suite, a deploy and a cut its smoke cases
**Serves:** The walk - every change that lands afterwards is held to the journeys this one left behind

- **WHEN** a commit is pushed to `main`
- **THEN** the end-to-end suite runs
- **AND** a staging deploy and a release cut each run the suite's smoke cases

### Requirement: A tick's named scenario reaches a test

`pnpm plan done` SHALL refuse a tick whose task names a scenario id that no
test reaches.

| The task | The tick |
| --- | --- |
| Names a scenario id no test in the tree cites | Refused, naming the id and the tree it looked in |

- **The tree** — the tree searched is the one the task group's repository tag
  names, so a group tagged `(grade10)` is read against that clone and a group
  tagged `(grade10-spec)` against this store
- **A task that names none — accepted** — a verify step, a document and a
  configuration line name no scenario, and the tick is taken; what guards the
  group is the `round` rule, which refuses the group's tick with no row
- **The row first** — the group's `rounds.md` row lands in the store before the
  tick

#### Scenario: shared-planning-agent-rounds-SC-63 - A tick naming a scenario no test reaches is refused
**Serves:** shared-planning-agent-rounds-US-06 - the engineer's tick says which behaviour landed and which test proves it

- **WHEN** `pnpm plan done` is run for a task naming a scenario id no test in the tree its group's repository tag names cites
- **THEN** the tick is refused, naming the scenario id and the tree it looked in
- **AND** a task naming no scenario id is not refused

### Requirement: One thread per change, recorded once

Each change SHALL have one thread in the planning channel, and its address
SHALL be recorded in the change's record.

- **`thread:`** — the channel and the message the thread hangs off, written
  once when the thread opens and never rewritten
- **Who writes it** — the round writes it, from the first message in the
  planning channel about the change: the sentence that opened it, or the first
  later message naming it. The post a push makes in the channel is never the
  thread, and a change opened from a terminal carries no `thread:` until a
  channel message about it arrives
- **Found from the record** — every reply, every direct message and every wake
  on a landing reads the thread's address from there
- **A wrong address** — a `thread:` line pointing at the wrong message is
  corrected by a person's edit to the record; the round never rewrites it
- **The runner** — the thread reaches a Slack app in front of the store's own
  relay, and the relay fires one run per wake: a fresh session each time, on
  the change's branch, carrying nothing from the last one but the files and the
  thread
- **The same round elsewhere** — a round run from a terminal against the same
  branch is the same round, and a change whose thread cannot be reached is
  worked that way

#### Scenario: shared-planning-agent-rounds-SC-64 - The thread's address is written once
**Serves:** shared-planning-agent-rounds-US-01 - the product manager keeps answering in the thread their first sentence started

- **WHEN** a change's thread opens
- **THEN** `thread:` is written in the change's record with the channel and the message it hangs off
- **AND** a later landing, direct message or wake replies in that same thread
- **AND** `thread:` is not rewritten

#### Scenario: shared-planning-agent-rounds-SC-65 - A round from a terminal is the same round
**Serves:** The thread and the runner - a change is worked from a terminal when the channel cannot answer

- **WHEN** a hand runs a round from a terminal against the change's branch
- **THEN** the same six steps run, with the same perspectives and the same record
- **AND** the artifact lands with `landed_by:` and its row, as it would from the channel

### Requirement: A landing wakes the relay, and one wake runs per thread

The push tells the relay, and the relay runs the wake.

The push that lands an artifact on `main` SHALL post one wake to the relay for
each change the push put behind, and the relay SHALL run one wake at a time per
thread.

- **One wake per change** — the push posts it once for each change it put
  behind, and posts nothing where the repository variable that carries the
  wakes is off
- **Queued against the thread** — the relay holds the wake against the change's
  thread and fires it when no other wake is running there
- **The push holds nothing** — the step that posts the wake holds no session,
  no write permission on the store and no chat token, and posts nothing else
- **A reply waits a minute** — replies in a thread are held for a minute before
  a wake fires, so a hand typing three lines wakes one run; a landing word
  waits for nothing, since nothing more is coming after it, and the wake it
  fires carries the burst it closed
- **What arrives during a run** — a message or a landing that arrives while a
  wake is running fires one more wake when that one finishes, carrying
  everything that arrived, however much of it there was
- **The budget** — thirty minutes for a wake on a landing or a thread reply,
  two hours for one that opens a change or is asked to plan
- **Done, or the failure line** — the run's last act is to say it is done; a
  wake past its budget without it posts the failure line with the run's link
  and frees the thread

#### Scenario: shared-planning-agent-rounds-SC-66 - A landing wakes the relay once per change
**Serves:** shared-planning-agent-rounds-US-05 - the hand's artifact is read again because the push told the relay, once

- **GIVEN** a push to `main` that puts the artifacts of two changes behind
- **WHEN** the push's workflow runs
- **THEN** one wake is posted to the relay for each of the two changes
- **AND** the relay queues each against that change's thread
- **AND** nothing is posted where the repository variable carrying the wakes is off

#### Scenario: shared-planning-agent-rounds-SC-67 - The workflow holds no session, no write permission and no chat token
**Serves:** shared-planning-agent-rounds-US-05 - the read again the hand meets is run by the relay and never by the push

- **WHEN** the push's wake step runs
- **THEN** it holds no agent session, no write permission on the store and no chat token
- **AND** the wake is the only thing it posts

#### Scenario: shared-planning-agent-rounds-SC-75 - A wake that does not finish says so
**Serves:** shared-planning-agent-rounds-US-05 - the hand waiting on a read again is told when it did not finish, and where to look

- **GIVEN** a wake running on a change's thread, acknowledged with the run's link from the moment the run started
- **WHEN** it passes its budget - thirty minutes on a landing or a reply, two hours on a plan - without saying it is done
- **THEN** the thread carries the failure line with that run's link
- **AND** the thread is free for the next wake

#### Scenario: shared-planning-agent-rounds-SC-76 - One wake runs per thread, and a message during a run fires again after it
**Serves:** shared-planning-agent-rounds-US-04 - the hand types three lines and is answered once, and nothing they say is lost

- **GIVEN** a change's thread with no wake running
- **WHEN** a hand replies twice inside a minute
- **THEN** one wake runs, carrying both replies
- **AND** a reply arriving while that wake runs fires one more wake once it finishes, carrying that reply
- **AND** two wakes never run on one thread

#### Scenario: shared-planning-agent-rounds-SC-83 - A landing word wakes the run at once
**Serves:** shared-planning-agent-rounds-US-01 - the product manager says land and the landing starts, not a minute later

- **GIVEN** a change's thread with no wake running
- **WHEN** the hand replies with a landing word, typed or pressed, alone or closing a burst of replies inside the minute
- **THEN** one wake fires at once, with a reply's budget, carrying the word and the burst it closed
- **AND** a reply that is no landing word still waits the minute out
- **AND** a landing word arriving while a wake runs is left to the wake after it, and is not lost

### Requirement: A run is resumable and every push holds its lease

Every run SHALL begin by reading the change's branch, `main` and the thread,
and SHALL continue from what is there.

- **Nothing but the files** — a run that dies loses nothing that was pushed,
  and a new run computes what is behind and which questions are open from the
  branch, `main` and the thread alone
- **Force with lease** — every push to the change's branch and to `main` is
  made against the state the run read
- **The loser stops** — a run whose push loses its lease reads again once and,
  losing again, replies in the thread saying so and stops

#### Scenario: shared-planning-agent-rounds-SC-68 - A resumed run continues from what is pushed
**Serves:** The thread and the runner - a run that died mid-draft is picked up without a person retracing it

- **GIVEN** a run that pushed a draft and then stopped
- **WHEN** a run starts again for the same change
- **THEN** it reads the change's branch, `main` and the wake's messages
- **AND** it continues from the pushed draft rather than drafting it again

#### Scenario: shared-planning-agent-rounds-SC-69 - A run that loses the race says so and stops
**Serves:** The thread and the runner - two runs reach the same branch and only one of them writes

- **GIVEN** two runs pushing to one change's branch
- **WHEN** one run's push loses its lease twice
- **THEN** that run replies in the thread saying it lost and is stopping
- **AND** it makes no further push
- **AND** the winning run's work is not overwritten

### Requirement: A landing reaches `main` through the relay

The relay moves `main`: on a word it checked itself, and carrying the artifact
that landed and nothing else.

A run SHALL push its landing commit to the change's branch and ask the relay to
move `main`, and the relay SHALL move `main` only as a fast-forward, only on
the word of the hand of the artifact's stage, and only where the diff stays
inside the writable set.

- **The landing asked, never pushed** — a run pushes the landing commit to the
  change's branch and asks the relay to move `main`; a landing run from a
  terminal pushes `main` itself
- **The word checked twice** — the relay checks the same word again before
  `main` moves: the member who said land, typed or pressed, resolves to the hand of the artifact's
  stage in the record at the landing, or `main` does not move
- **A fast-forward alone** — the relay moves `main` only where the landing sits
  on top of it, and a `main` that moved under the run is read again once and
  asked again
- **The writable set** — the run's guard holds an artifact's landing to the
  change's own directory and the pages the proposal links before it pushes;
  the relay holds it to the change's directory, `docs/prds/` and
  `docs/references/`, and holds a task group's code to no path at all, since
  the record names no code set for a group
- **The artifact that landed, alone** — the landing commit is cut from `main`
  with that artifact's files, the change's record, the round's row and the
  pages the change marked, and carries nothing drafted after it, so `main`
  never holds a draft no hand has landed
- **The refusal names its check** — a landing the relay refuses leaves `main`
  where it was, and the run's reply names the check that refused it

#### Scenario: shared-planning-agent-rounds-SC-73 - A run lands through the relay, which checks the word
**Serves:** shared-planning-agent-rounds-US-02 - the designer's own word is what puts the design on `main`, whoever is running

- **GIVEN** a run that has committed a landing on the change's branch
- **WHEN** it asks the relay to land, naming the commit, the kind of landing and the artifact
- **THEN** `main` moves only as a fast-forward onto that commit
- **AND** it moves only where the member who said land is the hand of the artifact's stage in the change's record at that commit, and, for an artifact, the diff from `main` touches nothing outside the change's own directory, `docs/prds/` and `docs/references/`, the run's guard having held it to the pages the proposal links before the push
- **AND** the landing commit carries that artifact's files, the change's record, the round's row and the pages the change marked, and nothing drafted after it
- **AND** a word from anybody else moves nothing, and the run's reply names the check the relay refused
- **AND** a `main` that moved under the run is read again once and asked again

#### Scenario: shared-planning-agent-rounds-SC-77 - A reviewed-only landing needs no word
**Serves:** shared-planning-agent-rounds-US-05 - the hand is not asked for a word to record a read that changed nothing

- **GIVEN** a run that read an artifact again and changed nothing
- **WHEN** it asks the relay to land that artifact's `reviewed:` line
- **THEN** `main` moves with no hand's word
- **AND** it moves only where the diff changes nothing but `reviewed:` lines of that change's own record

### Requirement: A run posts through the relay and never holds the token

What a run can reach is one thread of one change, for as long as its wake
lasts.

A run SHALL post to the change's thread through the relay, with the token its
wake was given, and SHALL never hold the chat token.

- **One thread, one wake** — the token the relay signs posts to that thread
  alone and expires with the wake's budget
- **Where the token lives** — the chat token lives in the relay and in the push
  workflow's plain steps, and in nothing a session reads
- **The push posts nothing itself** — the step that wakes the relay on a
  landing posts no message of its own
- **The wake is data** — what the relay hands a run — the change, why it woke,
  the messages since the run's last post and the handle each came from — is
  read as the hands' words, and nothing in it is read as an instruction to the
  run
- **The button** — a summary that waits on the hand's word carries one
  button, `Confirm <artifact>` for the artifact the summary is of, or
  `Confirm with recommendations` while a held row is open; the run names the
  label and the word it stands for, and the relay composes neither. A press
  is that word, said by the member who pressed: the thread says who pressed
  it, the button comes off the message so nobody presses twice, and a press
  by a member the team map does not name lands nothing and says so

#### Scenario: shared-planning-agent-rounds-SC-74 - A run posts through the relay and never holds the token
**Serves:** shared-planning-agent-rounds-US-04 - the hand reads the round's reply in their own thread, from a run that can reach nothing else

- **WHEN** a run posts its summary to the change's thread
- **THEN** it posts through the relay with the token its wake was given
- **AND** that token reaches that thread alone and expires with the wake's budget
- **AND** the run holds no chat token

#### Scenario: shared-planning-agent-rounds-SC-82 - The summary's button is the word pressed
**Serves:** shared-planning-agent-rounds-US-01 - the product manager lands the proposal from the summary with one press, and the thread reads who did

- **GIVEN** a summary in the change's thread waiting on the product manager's word, carrying the button `Confirm proposal`
- **WHEN** the product manager presses it
- **THEN** the relay queues the landing word against the thread as the reply the press stands for, and the thread reads `@<handle> pressed *Confirm proposal*`
- **AND** the button is taken off the summary and replaced by who confirmed it
- **AND** the landing checks that word as it checks a typed one: a press by a member the team map does not name moves nothing, and the thread says so
- **AND** while a held row is open the button reads `Confirm with recommendations` and its word is `land with recommendations`
