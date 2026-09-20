Drawn from [Agent Rounds · Surfaces](../../docs/prds/products/shared/planning/agent-rounds.md#surfaces), [Your Moves](../../docs/prds/products/shared/planning/agent-rounds.md#your-moves) and the journeys. The manual has no Figma file; the blueprint page's mock-ups are the layout's source of truth, as `stage-changes-and-notify-hands` decided, and every state below is one the page or a journey already names.

## Screens

### The thread

[Blueprint · 3.4 The thread](https://claude.ai/artifact/FgryWCqw2EFSvoyaSb5BRC#thread). One Slack thread per change in the planning channel, hanging off the message that opened it. Nothing interactive: no buttons, no forms.

### Change page

[Blueprint · 4.2 Change page](https://claude.ai/artifact/FgryWCqw2EFSvoyaSb5BRC#change-page). The artifact rows from `stage-changes-and-notify-hands` gain, per artifact, the open question ids as a link to the decisions tab; a Rounds row under Tasks lists one line per round from `rounds.md`: the artifact or group, the perspectives run, what stood, what was asked. The Your turn card links the thread first and the command second. The Delivery row shows the suite's automated count against its total.

Told now sits inside the Your turn card, under the thread link: one quoted block per hand of the stage, and one for the earliest behind artifact, carrying the message that hand is being sent word for word, with the hand or the role's channel above it and a `Text xs secondary` line "what the message says" beside the title so nobody reads it as a second status. A Thread row is the last row of the page, after every state row: the change's own commits on `main`, oldest first, one line each, with the round a landing recorded as a second line under it and the questions still held at the end, undated. A sentence over it says what it is - "What the change's thread shows, read from `main`."

### My turn

[Blueprint · 4.3 My turn](https://claude.ai/artifact/FgryWCqw2EFSvoyaSb5BRC#my-turn). The open questions addressed to the reader sit above the changes on them, one row each: the change, the question id, the first line of the question, and the thread link.

### Run sheet

The tab `/run-sheet` writes lives in the run spreadsheet, and no frame draws it: the store keeps no copy of the tab (`Q51`).

## Flows

[Day-to-Day Flow](https://claude.ai/artifact/3s5HjqvM9izRSQKPvUvJHk), the canvas beside the blueprint page: the loop every hand runs, the product manager's thread from the first sentence to the three files landing, the designer's and the tech PIC's reads of a draft, the re-read after a landing, and the walk at the end of Building. A flow the canvas draws that the page does not name is a design choice: a question's recommendation is accepted by answering with its id alone.

The onboarding walkthrough [Cross-sell, Start to Finish](https://claude.ai/artifact/D1eDUFmtgWwGsdr7nw8Edp) walks one change through these screens step by step.

## Components

The thread is Slack's own surface: message text, quoted blocks for a question, and a link. The manual's screens sit in the shell as `stage-changes-and-notify-hands` draws them; the new pieces stack in the reading column.

| Export | Where |
| --- | --- |
| `Badge` (`sm`, `outline`) | The question count on an artifact row; the automated count on the Delivery row |
| `Text`, `Button` | The rounds rows and the thread links, as the manual composes them today |
| `EmptyState` (`compact`) | A thread with no commits to show |

New in `tools/manual`, work in grade10-spec: `RoundsList`, `MyTurnPage`'s question rows gain the thread link, `ArtifactList` gains the question ids, `ToldNow` and `SlackText` on the Your turn card, `ThreadSection` as the page's last row. No `packages/i18n` key is owed; the push's channel post and direct messages are composed in `scripts/openspec/lib/wording.mjs` - which the manual imports, so Told now and Slack read the same words - and `scripts/openspec/digest.mjs`, and the thread's own replies come from the round through `scripts/openspec/relay-post.mjs`.

## States

### The thread

| State | Shows | Anchor |
| --- | --- | --- |
| Change opened | The product manager's sentence, with the agent's first reply naming the change's id | `shared-planning-agent-rounds-SC-17` |
| Draft summary, rows held | The held rows first, each with its recommendation, then the ids the round decided, each with the option it took, on one line | `shared-planning-agent-rounds-SC-21` |
| Draft summary, nothing held | No held row and nothing asked: the ids the round decided, each with the option it took, on one line | `shared-planning-agent-rounds-SC-21` |
| Question answered by its id | The row written with the recommended option, and the question closed | `shared-planning-agent-rounds-SC-11` |
| Remark applied | The remark applied as written, and the perspectives that read again named | `shared-planning-agent-rounds-SC-12` |
| Challenge recorded | The tech PIC's challenge as a decisions row, with the agent's answer | `shared-planning-agent-rounds-SC-13` |
| Landing reply | Every artifact that landed on the word, the handle whose word landed it, the stage the change reached, and the hand it stopped at | `shared-planning-agent-rounds-SC-04` |
| Landing held by a row | Nothing landed, and the held rows named | `shared-planning-agent-rounds-SC-72` |
| Re-read, nothing changed | What was read, and that nothing changed | `shared-planning-agent-rounds-SC-39` |
| Re-read opens a round | The round opened for that artifact's hand, naming what reached the artifact | `shared-planning-agent-rounds-SC-40` |
| Landing refused for a behind artifact | The artifact before it that is behind, and the hand it waits on | `shared-planning-agent-rounds-SC-43` |
| Moved goal asked | One numbered question to the product manager: extend, supersede or split | `shared-planning-agent-rounds-SC-45` |
| Task group summary | The perspectives that read the group, and the tests that landed per scenario id | `shared-planning-agent-rounds-SC-58` |
| Wake acknowledged | The run's link, the moment the wake starts | `shared-planning-agent-rounds-SC-75` |
| Wake did not finish | The failure line with that run's link | `shared-planning-agent-rounds-SC-75` |
| Landing refused by the relay | `main` unmoved, and the relay's check that refused it | `shared-planning-agent-rounds-SC-73` |
| Run lost the race | The run saying it lost and is stopping | `shared-planning-agent-rounds-SC-69` |

### Change page

| State | Shows | Anchor |
| --- | --- | --- |
| Rounds row | One line per round: the artifact or group, the perspectives run, what stood, what was asked | `shared-planning-agent-rounds-SC-51` |
| Group with no round | A ticked task group shown as having no row | `shared-planning-agent-rounds-SC-51` |
| Told now, a stage on a hand | One block per hand: the handle, then the message with its bold, its code and its link read | `shared-planning-agent-rounds-SC-81` |
| Told now, a hand the change does not name | The role's channel in the handle's place, carrying the same message | `shared-planning-agent-rounds-SC-81` |
| Told now, a stage that waits on no hand | Nothing at all — no block, and no title over one | `shared-planning-agent-rounds-SC-81` |
| Told now, an artifact behind | A second block to that artifact's hand, naming what changed before it | `shared-planning-agent-rounds-SC-81` |
| Thread, the change opened | One row, dated: who opened it | `shared-planning-agent-rounds-SC-81` |
| Thread, an artifact landed | What landed and whose word landed it, with that landing's round under it | `shared-planning-agent-rounds-SC-81` |
| Thread, a re-read that changed nothing | What was read, and that nothing changed | `shared-planning-agent-rounds-SC-81` |
| Thread, a hand named | The handle and the role the record wrote | `shared-planning-agent-rounds-SC-81` |
| Thread, tasks ticked | The task ids that commit ticked | `shared-planning-agent-rounds-SC-81` |
| Thread, any other commit | Its subject, as written | `shared-planning-agent-rounds-SC-81` |
| Thread, a question still held | Its number, the role it is held for, and what was asked — undated, at the end | `shared-planning-agent-rounds-SC-81` |
| Thread with no commits | "No history — this reading has no commits" | `shared-planning-agent-rounds-SC-81` |

### My turn

| State | Shows | Anchor |
| --- | --- | --- |
| Open questions above the changes | One row per question: the change, the question id, the question's first line, and the thread link | `shared-planning-agent-rounds-SC-26` |
| No open question | The changes on the reader alone, with no question rows above them | `shared-planning-agent-rounds-SC-27` |
| Question row with no thread | "This page is the link to share: no thread is recorded for this change yet.", linking the change page in the thread's place | `shared-planning-agent-rounds-SC-26` |

### Run sheet

| State | Shows | Anchor |
| --- | --- | --- |
| Automated cases left out | No automated case on the tab, and how many it left out | `shared-planning-agent-rounds-SC-61` |
