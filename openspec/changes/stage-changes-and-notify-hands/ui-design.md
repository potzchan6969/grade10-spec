Drawn from [Change Stages · Surfaces](../../docs/prds/products/shared/planning/change-stages.md#surfaces) and the journeys. The manual has no Figma file; the blueprint page's mock-ups are the layout's source of truth (decisions Q11), and every state below is one the page or a journey already names.

## Screens

### Board

[Blueprint · 4.1 Board](https://claude.ai/artifact/FgryWCqw2EFSvoyaSb5BRC#board). Eight lanes in stage order, stacked down the reading column as In Flight stacks four today, each collapsible to its heading with its count and its open hands; the headings of Proposed to Building carry the agent mark and the hand's move; Mine, Waiting, Idle, Behind and Blocked as a filter row under the page heading; the shelf as a link. Replaces the four lanes of `/in-flight`, titled Board at the same route.

A lane opens when its stage names a hand - Proposed, Specified, Planned, Building and On staging - and starts collapsed when it names nobody: Designed, Released and Archived. A lane with nothing in it collapses whichever it is, and a reader may open or shut any lane.

### Change page

[Blueprint · 4.2 Change page](https://claude.ai/artifact/FgryWCqw2EFSvoyaSb5BRC#change-page). The stepper under the page heading, the agent mark and the hand's move as a short caption under each drafted step, the whole sentence on hover; below `sm` the stepper reads as one line - the stage's position of eight, its name, and the mark and the move beneath it - because eight steps do not fit a phone's width; the Your turn card with the thread link and the command; then the `ChangeStatus` rows gain Hands, Artifacts with fresh or behind, the open questions and who landed each, Delivery naming - `main`, staging with the build the deploy recorded, and the release - and Handoff, one labelled row per fact as the page reads today; the documents tabs and the tasks by group below, unchanged. Nothing sits beside the reading column.

### My turn

[Blueprint · 4.3 My turn](https://claude.ai/artifact/FgryWCqw2EFSvoyaSb5BRC#my-turn). A handle picker in the page heading; the open questions addressed to the reader, one row each with the change and the question id; then the changes on the reader now, then the ones that are theirs later, in the Pending page's card grammar with the thread link and the command on the card. Replaces `/pending` for a person; the per-role Pending page stays for a hand nobody has named. My turn is reached from the rail's fixed entries, beside Board; Pending from the foot of My turn.

### Page ribbon and pip

[Blueprint · 4.4 PRD page](https://claude.ai/artifact/FgryWCqw2EFSvoyaSb5BRC#prd-ribbon). The section's in-flight row gains the stage and the hand; each 🚧 line gains the pip of its change's stage, a small outline badge with the stage number, so no colour carries the meaning on its own.

### Slack messages

[Blueprint · 4.6 Slack](https://claude.ai/artifact/FgryWCqw2EFSvoyaSb5BRC#slack). Your turn, Behind, Landed on main, Staging deployed and the weekly digest; each carries the link to the change's thread and to the change page, and the command as text. No button on these five: the one button a round's summary carries is the round change's.

## Flows

[Day-to-Day Flow](https://claude.ai/artifact/3s5HjqvM9izRSQKPvUvJHk), a canvas beside the blueprint page: the loop every hand runs (told, open, answer, read, land, next), the hands and the agent against the eight stages, one hand's day as a walkthrough (the message, the change page, the thread, the landed messages), My turn, the board, the page, the Storybook walk, the release page, the remaining Slack messages, each hand's six steps, what one push does, and an example week. The states below are the ones those screens show. A flow the canvas draws that the page does not name is a design choice: every message and card carries the thread link, and the thread shows the summary before anything lands. My turn takes no keyboard shortcut of its own - the rows are links, and the command is a `CopyableCommand` as the manual composes it everywhere else.

The onboarding walkthrough [Cross-sell, Start to Finish](https://claude.ai/artifact/D1eDUFmtgWwGsdr7nw8Edp) walks one change through these screens step by step.

## Components

Every manual screen sits in the manual's shell as it is: the header, the rail, the 896px reading column, `PageHeading`, the card, and the `ChangeStatus` label-and-value rows. The new blocks stack in that column; none opens a second column.

Design-system primitives, from `@grade10/design-system/components/`:

| Export | Where |
| --- | --- |
| `Stepper`, `Step`, `StepIndicator` | The change page's stepper, one `Step` per stage |
| `Badge` (`sm`, `outline`) with the stage number | The pip on a page's 🚧 line and in the section's in-flight row; the hover names the change and the hand |
| `Badge` (`sm`, `outline`) with the agent mark and the hand's move | A lane heading, from Proposed to Building; the text carries the meaning, and no mark beside it - the design system draws no hollow dashed dot, and a variant Figma does not define is not ours to add, the mark in an `sr-only` span and the sentence on hover, as the stepper's caption reads, and a badge that wraps grows |
| `Text` (`xs`, `secondary`) with the agent and the hand's move | A stepper step, from Proposed to Building; one step of eight is a tenth of the reading column, so the caption reads `agent drafts · <move>`, the mark stays in an `sr-only` span between them, and the whole sentence sits on the element's `title` |
| `Badge` | Every overlay chip, the suite's verdict, and who landed an artifact |
| `Avatar`, `AvatarFallback` | The hand on a card and in the hands table |
| `Card`, `CardHeader`, `CardContent` | The Your turn card and the board's cards |
| `EmptyState` | A lane, My turn or a hands table with nothing to show |
| `Skeleton` | The board while the snapshot loads |
| `Text`, `Button`, `IconButton` | As the manual composes them today |

The manual's own blocks, in `tools/manual/src/blocks/`, kept: `ChangeCard`, `ChangeStatus`, `TaskProgress`, `CopyableCommand`, `Attribution`, `IdleBadge`, `DependencyPills`, `NextAction`, `ChangeRibbon`, `CapabilityPip`.

New in `tools/manual`, work in grade10-spec: `StageStepper`, `StageLane`, `YourTurnCard`, `HandsTable`, `ArtifactList` with its freshness chip, the question count and the landed-by handle, `QuestionList`, `DeliveryRow`, `MyTurnPage`, `StagePip`. The manual carries its own English strings and imports no catalog, so no `packages/i18n` key is owed; the Slack message bodies live in `scripts/openspec/lib/moves.mjs` (Your turn, On staging, Behind) and `scripts/openspec/digest.mjs` (the digest), with only the channel post in `scripts/openspec/changed-changes.mjs`.

## States

- Board with no change in flight - `shared-planning-change-stages-US-02` - `shared-planning-change-stages-SC-53`
- A lane with no change in it, collapsed to its heading - `shared-planning-change-stages-US-02` - `shared-planning-change-stages-SC-52`
- A lane whose stage names nobody, collapsed while a lane on a hand is open - `shared-planning-change-stages-US-02` - `shared-planning-change-stages-SC-51`
- A lane heading with the agent mark and the hand's move, the whole sentence - `shared-planning-change-stages-US-02` - `shared-planning-change-stages-SC-10`
- A stepper step with the agent and the hand's move as a short caption, the whole sentence on hover and in the DOM for a screen reader - `shared-planning-change-stages-US-02` - `shared-planning-change-stages-SC-10`
- A card in Proposed on the product manager, and one on the designer once the decisions and the journeys are in - `shared-planning-change-stages-US-02` - `shared-planning-change-stages-SC-15`
- A card whose hand is unnamed, showing the hand as open - `shared-planning-change-stages-US-04` - `shared-planning-change-stages-SC-17`
- A card waiting, with the line and its date - `shared-planning-change-stages-US-06` - `shared-planning-change-stages-SC-21`
- A card blocked, naming the change it waits for - `shared-planning-change-stages-US-02` - `shared-planning-change-stages-SC-19`
- A card idle 7 days, with the day count - `shared-planning-change-stages-US-02` - `shared-planning-change-stages-SC-22`
- A card idle 30 days, on the shelf - `shared-planning-change-stages-US-02` - `shared-planning-change-stages-SC-24`
- A card wearing Behind, naming the earliest behind artifact and its hand - `shared-planning-change-stages-US-09` - `shared-planning-change-stages-SC-26`
- A card whose suite is a draft, and one whose suite is approved - `shared-planning-change-stages-US-02` - `shared-planning-change-stages-SC-19`
- The Mine filter with no handle chosen - `shared-planning-change-stages-US-03` - `shared-planning-change-stages-SC-55`
- The change page's Your turn card on the hosted manual, with Assign shown as read-only - `shared-planning-change-stages-US-01` - `shared-planning-change-stages-SC-69`
- The change page's Your turn card on the locally run manual, Assign as a role picker and a handle picker over every handle the team map knows, the chosen role's own first, then everyone else, each group alphabetical - `shared-planning-change-stages-US-04` - `shared-planning-change-stages-SC-68`
- The change page's stepper below `sm`, on one line - `shared-planning-change-stages-US-02` - `shared-planning-change-stages-SC-57`
- The change page for a change waiting on a stage whose hand is unnamed - `shared-planning-change-stages-US-04` - `shared-planning-change-stages-SC-17`
- The change page for a change with `ui_waived`, showing the design as not owed and fresh - `shared-planning-change-stages-US-05` - `shared-planning-change-stages-SC-07`
- The delivery row for a deploy recording no build, reading as before - `shared-planning-change-stages-US-02` - `shared-planning-change-stages-SC-59`, `shared-planning-change-stages-SC-76`
- An artifact behind, with the chip naming what changed before it - `shared-planning-change-stages-US-09` - `shared-planning-change-stages-SC-25`
- An artifact with open questions, counted, and one landed, with the handle - `shared-planning-change-stages-US-02` - `shared-planning-change-stages-SC-34`
- My turn with nothing on the reader - `shared-planning-change-stages-US-03` - `shared-planning-change-stages-SC-61`
- My turn with open questions above the changes - `shared-planning-change-stages-US-03` - `shared-planning-change-stages-SC-60`
- My turn before a handle is chosen - `shared-planning-change-stages-US-03` - `shared-planning-change-stages-SC-62`
- My turn for a handle the team map does not know - `shared-planning-change-stages-US-03` - `shared-planning-change-stages-SC-64`
- A section's in-flight row naming the stage and the hand, and its 🚧 line wearing that stage's own pip - `shared-planning-change-stages-US-07` - `shared-planning-change-stages-SC-65`
- A 🚧 line whose change has archived, wearing no pip - `shared-planning-change-stages-US-07` - `shared-planning-change-stages-SC-66`
- A 🚧 line delivered by two changes, wearing the further stage - `shared-planning-change-stages-US-07` - `shared-planning-change-stages-SC-67`
- A Your turn message for a change reaching a stage twice, sent once - `shared-planning-change-stages-US-01` - `shared-planning-change-stages-SC-36`
- A Behind message for an artifact behind twice before it is read, sent once - `shared-planning-change-stages-US-09` - `shared-planning-change-stages-SC-39`
- A Staging deployed message naming the run sheet and the build - `shared-planning-change-stages-US-08` - `shared-planning-change-stages-SC-45`
- A weekly digest with nothing to say, not sent - `shared-planning-change-stages-US-01` - `shared-planning-change-stages-SC-50`
