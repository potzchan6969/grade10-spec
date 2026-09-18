Drawn from [Change Stages · Surfaces](../../docs/prds/products/shared/planning/change-stages.md#surfaces) and the journeys. The manual has no Figma file; the blueprint page's mock-ups are the layout's source of truth (decisions Q11), and every state below is one the page or a journey already names.

## Screens

### Board

[Blueprint · 3.1 Board](https://claude.ai/artifact/FgryWCqw2EFSvoyaSb5BRC#board). Eight lanes in stage order, stacked as In Flight stacks four today, each collapsible to its heading with its count and its open hands; the Specified, Planned and Building headings carry the agent-driven mark with who reads them; Archived starts collapsed, and Proposed opens because the designer's and the tech PIC's turns sit in it; Mine, Waiting, Idle and Blocked as a filter row under the page heading; the stale shelf as a link. The open lanes sit side by side only above 1536px. Replaces the four lanes of `/in-flight`.

### Change page

[Blueprint · 3.2 Change page](https://claude.ai/artifact/FgryWCqw2EFSvoyaSb5BRC#change-page). The stepper under the page heading, its Specified, Planned and Building steps bracketed with the agent-driven mark; the Your turn card; then the `ChangeStatus` rows gain Hands, Artifacts with their freshness, Delivery and Handoff, one labelled row per fact as the page reads today; the documents tabs and the tasks by group below, unchanged. Nothing sits beside the reading column.

### My turn

[Blueprint · 3.3 My turn](https://claude.ai/artifact/FgryWCqw2EFSvoyaSb5BRC#my-turn). A handle picker in the page heading; the changes on the reader now, then the ones that are theirs later, in the Pending page's card grammar with the command on the card. Replaces `/pending` for a person; the per-role Pending page stays for a hand nobody has named.

### Page ribbon and pip

[Blueprint · 3.4 PRD page](https://claude.ai/artifact/FgryWCqw2EFSvoyaSb5BRC#prd-ribbon). The section's in-flight row gains the stage and the hand; each 🚧 line gains the pip of its change's stage, a small outline badge with the stage number, so no colour carries the meaning on its own.

### Slack messages

[Blueprint · 3.6 Slack](https://claude.ai/artifact/FgryWCqw2EFSvoyaSb5BRC#slack). Your turn, Landed on main, Staging deployed and the weekly digest; each carries the command as text and a link to the change page. No interactive buttons until the identity map is settled.

## Flows

[Day-to-Day Flow](https://claude.ai/artifact/3s5HjqvM9izRSQKPvUvJHk), a canvas beside the blueprint page: the loop every hand runs (told, open, run, review, land, next), the hands and the agent against the eight stages with the agent-driven three banded, one QA hand's day as a four-screen walkthrough (the message, the change page, the terminal run with its summary, the landed messages), My turn, the board, the page, the Storybook walk, the release page, the remaining Slack messages, each hand's six steps, what one push does, and an example week. The states below are the ones those screens show. A flow the canvas draws that the page does not name is a design choice: My turn takes the arrow keys, Enter to open and C to copy the command; every message and card carries the command as text; the terminal shows the summary before anything lands.

## Components

Every manual screen sits in the manual's shell as it is: the header, the rail, the 896px reading column, `PageHeading`, the card, and the `ChangeStatus` label-and-value rows. The new blocks stack in that column; none opens a second column.

Design-system primitives, from `@grade10/design-system/components/`:

| Export | Where |
| --- | --- |
| `Stepper`, `Step`, `StepIndicator` | The change page's stepper, one `Step` per stage |
| `Badge` (`sm`, `outline`) with the stage number | The pip on a page's 🚧 line and in the section's in-flight row; the hover names the change and the hand |
| `Badge` (`sm`, `outline`) reading agent-driven, with who reads it | The mark on a lane heading and under the stepper's three steps; the text carries the meaning, and the hollow dot beside it says no person writes the stage |
| `Badge` | Every overlay chip and the suite's verdict |
| `Avatar`, `AvatarFallback` | The hand on a card and in the hands table |
| `Card`, `CardHeader`, `CardContent` | The Your turn card and the board's cards |
| `EmptyState` | A lane, My turn or a hands table with nothing to show |
| `Skeleton` | The board while the snapshot loads |
| `Text`, `Button`, `IconButton` | As the manual composes them today |

The manual's own blocks, in `tools/manual/src/blocks/`, kept: `ChangeCard`, `ChangeStatus`, `TaskProgress`, `CopyableCommand`, `Attribution`, `IdleBadge`, `DependencyPills`, `NextAction`, `ChangeRibbon`, `CapabilityPip`.

New in `tools/manual`, work in grade10-spec: `StageStepper`, `StageLane`, `YourTurnCard`, `HandsTable`, `ArtifactList` with its freshness chip, `DeliveryRow`, `MyTurnPage`, `StagePip`. The manual carries its own English strings and imports no catalog, so no `packages/i18n` key is owed; the Slack message bodies live in `scripts/openspec/changed-changes.mjs`.

## States

- Board with no change in flight - `shared-planning-change-stages-US-02`
- A lane with no change in it, collapsed to its heading - `shared-planning-change-stages-US-02`
- A lane heading and a stepper step marked agent-driven, naming who reads it - `shared-planning-change-stages-US-02`
- A card in Proposed on the product manager, and one on the designer once the decisions and the journeys are in - `shared-planning-change-stages-US-02`
- A card whose hand is unnamed, showing the hand as open - `shared-planning-change-stages-US-04`
- A card waiting, with the line and its date - `shared-planning-change-stages-US-06`
- A card blocked, naming the change it waits for - `shared-planning-change-stages-US-02`
- A card idle 7 days, with the day count - `shared-planning-change-stages-US-02`
- A card stale 30 days, on the stale shelf - `shared-planning-change-stages-US-02`
- A card whose suite is a draft, and one whose suite is approved - `shared-planning-change-stages-US-02`
- A card behind a flag, with the flag's name - `shared-planning-change-stages-US-02`
- The Mine filter with no handle chosen - `shared-planning-change-stages-US-03`
- The change page's Your turn card on the hosted manual, with Assign shown as read-only - `shared-planning-change-stages-US-01`
- The change page for a change waiting on a stage whose hand is unnamed - `shared-planning-change-stages-US-04`
- The change page for a change with `ui_waived`, showing the design as not owed - `shared-planning-change-stages-US-05`
- An artifact behind an upstream one, with the badge - `shared-planning-change-stages-US-02`
- My turn with nothing on the reader - `shared-planning-change-stages-US-03`
- My turn before a handle is chosen - `shared-planning-change-stages-US-03`
- My turn for a handle the team map does not know - `shared-planning-change-stages-US-03`
- A 🚧 line whose change has archived, wearing no pip - `shared-planning-change-stages-US-07`
- A 🚧 line delivered by two changes, wearing the further stage - `shared-planning-change-stages-US-07`
- A Your turn message for a change reaching a stage twice, sent once - `shared-planning-change-stages-US-01`
- A Staging deployed message with no run tab yet - `shared-planning-change-stages-US-08`
- A weekly digest with nothing to say, not sent - `shared-planning-change-stages-US-01`
