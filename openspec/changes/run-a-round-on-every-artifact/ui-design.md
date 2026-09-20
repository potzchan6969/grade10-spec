Drawn from [Agent Rounds · Surfaces](../../docs/prds/products/shared/planning/agent-rounds.md#surfaces), [Your Moves](../../docs/prds/products/shared/planning/agent-rounds.md#your-moves) and the journeys. The manual has no Figma file; the blueprint page's mock-ups are the layout's source of truth, as `stage-changes-and-notify-hands` decided, and every state below is one the page or a journey already names.

## Screens

### The thread

[Blueprint · 3.4 The thread](https://claude.ai/artifact/FgryWCqw2EFSvoyaSb5BRC#thread). One Slack thread per change in the planning channel. Its first message is the product manager's sentence or the landing that opened the change; the agent's replies carry the draft's one-screen summary, the numbered questions with a recommendation each, and each landing and re-read as one line; a hand replies in words. Nothing interactive: no buttons, no forms.

### Change page

[Blueprint · 4.2 Change page](https://claude.ai/artifact/FgryWCqw2EFSvoyaSb5BRC#change-page). The artifact rows from `stage-changes-and-notify-hands` gain, per artifact, the open question ids as a link to the decisions tab; a Rounds row under Tasks lists one line per round from `rounds.md`: the artifact or group, the perspectives run, what stood, what was asked. The Your turn card links the thread first and the command second.

### My turn

[Blueprint · 4.3 My turn](https://claude.ai/artifact/FgryWCqw2EFSvoyaSb5BRC#my-turn). The open questions addressed to the reader sit above the changes on them, one row each: the change, the question id, the first line of the question, and the thread link.

### Run sheet

The tab `/run-sheet` writes leaves automated cases out and says how many it left out; the change page's Delivery row shows the suite's automated count against its total.

## Flows

[Day-to-Day Flow](https://claude.ai/artifact/3s5HjqvM9izRSQKPvUvJHk), the canvas beside the blueprint page: the loop every hand runs, the product manager's thread from the first sentence to the three files landing, the designer's and the tech PIC's reads of a draft, the re-read after a landing, and the walk at the end of Building. A flow the canvas draws that the page does not name is a design choice: a question's recommendation is accepted by answering with its id alone.

## Components

The thread is Slack's own surface: message text, quoted blocks for a question, and a link. The manual's screens sit in the shell as `stage-changes-and-notify-hands` draws them; the new pieces stack in the reading column.

| Export | Where |
| --- | --- |
| `Badge` (`sm`, `outline`) | The question count on an artifact row; the automated count on the Delivery row |
| `Text`, `Button` | The rounds rows and the thread links, as the manual composes them today |

New in `tools/manual`, work in grade10-spec: `RoundsList`, `QuestionList` gains the thread link, `ArtifactList` gains the question ids. No `packages/i18n` key is owed; the thread's message bodies live in `scripts/openspec/changed-changes.mjs` and the round skill.

## States

- A thread whose first message is the product manager's sentence, with the agent's first reply naming the change id - `shared-planning-agent-rounds-US-01` - `shared-planning-agent-rounds-SC-17`
- A draft summary with the held questions first, each with its recommendation, and the ids the round decided on one line - `shared-planning-agent-rounds-US-04` - `shared-planning-agent-rounds-SC-21`
- A question answered by its id alone, closing on the recommendation - `shared-planning-agent-rounds-US-04` - `shared-planning-agent-rounds-SC-11`
- A remark applied as written, with the perspectives it re-ran named in the reply - `shared-planning-agent-rounds-US-02` - `shared-planning-agent-rounds-SC-12`
- A challenge from the tech PIC recorded as a decisions row with the agent's answer - `shared-planning-agent-rounds-US-03` - `shared-planning-agent-rounds-SC-13`
- A landing reply naming every artifact that landed on the word, the handle, the stage the change reached and the hand it stopped at - `shared-planning-agent-rounds-US-02` - `shared-planning-agent-rounds-SC-04`
- A re-read reply saying what was read and that nothing changed - `shared-planning-agent-rounds-US-05` - `shared-planning-agent-rounds-SC-39`
- A re-read reply opening a round for a hand, with the change that reached the artifact - `shared-planning-agent-rounds-US-05` - `shared-planning-agent-rounds-SC-40`
- A round refused to land because an artifact before it is behind, saying which - `shared-planning-agent-rounds-US-05` - `shared-planning-agent-rounds-SC-43`
- A question to the product manager on a moved goal: extend, supersede or split - `shared-planning-agent-rounds-US-07` - `shared-planning-agent-rounds-SC-45`
- A landing summary for a task group naming the perspectives that read it and the tests per scenario - `shared-planning-agent-rounds-US-06` - `shared-planning-agent-rounds-SC-58`
- A run sheet tab with automated cases left out and the count said - `shared-planning-agent-rounds-US-08` - `shared-planning-agent-rounds-SC-61`
- The change page's Rounds row with one line per round, and a group with no round row shown as such - `shared-planning-agent-rounds-US-09` - `shared-planning-agent-rounds-SC-51`
- My turn with open questions above the changes, and with none - `shared-planning-agent-rounds-US-04` - `shared-planning-agent-rounds-SC-26` and `shared-planning-agent-rounds-SC-27`
- ❓ My turn's question row for a change with no `thread:` - the row says `no thread is recorded for this change yet` and links the change page in the thread's place; the designer confirms the words - `shared-planning-agent-rounds-US-04` - `shared-planning-agent-rounds-SC-26`
- A thread reply from a run that lost a race, saying so and stopping - `shared-planning-agent-rounds-US-05` - `shared-planning-agent-rounds-SC-69`
