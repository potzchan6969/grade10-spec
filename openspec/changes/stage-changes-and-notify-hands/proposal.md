# Stage every change and tell the next hand

**Author:** @ecchochan - 2026-09-17

Product context: [Change Stages](../../../docs/prds/products/shared/planning/change-stages.md), a planned page under [Planning](../../../docs/prds/products/shared/planning/index.md). Owner's brief: [Delivery workflow blueprint](../../../docs/references/delivery-workflow-blueprint.md).

## Why

A change passes through five hands, and nobody is told when it reaches theirs. The board shows four lanes read from the files, so a change waiting on a designer, one waiting on QA and one waiting on a deploy sit in the same column, and the person it waits on finds out by looking. On 2026-09-17 the store holds 71 changes in flight: 29 with no `tasks.md`, 18 with every box ticked and not archived, 8 waiting on a named input, and the board cannot say which of the rest are moving. Idle cannot be counted at all, because one repository-wide commit on 2026-09-16 touched every change.

Success is a change that lands a stage on `main` and tells the next hand within a minute, in a thread they can answer, and a board on which every lane is one stage, every card names a person, and a reader tells a person's move from an agent's. The number to move: the days between a stage landing and the next hand's word, unmeasured today and visible on the change page after this change.

## What Changes

- **Eight stages, read from the files.** Proposed, Designed, Specified, Planned, Building, On staging, Released, Archived - each proven by a file on `main`, never set by hand. Proposed holds the proposal, the decisions and the journeys together, with ❓ on what is still open, because the PM settles the three in one sitting. The four lanes become eight lanes on the board, the change page wears a stepper, and a 🚧 line on a page wears the pip of its change's stage. The ladder is on [Change Stages · Stages](../../../docs/prds/products/shared/planning/change-stages.md#stages).
- **Drafted from Proposed to Building, landed on a person's word.** The change's agent drafts every artifact from the proposal to the code; the hand of the stage answers, tweaks, challenges or reads, and their word lands it. The landing records whose word it was. The board, the stepper and the flow mark the five stages with the hand's move beside the agent's. The tech design is drawn beside the UI design, before the requirements, on every change.
- **Hands, recorded in git.** `hands:` in `.openspec.yaml` names a handle per role. The PM writes it at the interview's end; the local manual's Assign action and `pnpm plan hand <change> <role> @handle` in `grade10` write it too. A team map names each handle's Slack member and roles. The PM holds Proposed and Specified, the designer and the tech PIC take the change once the decisions and the journeys are in, the engineer at Planned, QA and the release hand at On staging.
- **Your turn, once, in the change's thread.** The push to `main` that moves a change to a hand - a stage landed, or the decisions and the journeys completing Proposed - sends one direct message to that hand pointing at the change's thread, or to the role's channel when the hand is unnamed. An artifact behind is one message to its hand; a change reaching staging is one to QA, naming the run sheet to walk. The channel post per push stays and names the stage each change moved into. A weekly digest per person lists their open questions, idle, behind and waiting changes.
- **My turn.** A page listing the open questions addressed to the reader, then the changes whose current stage names them, then the ones that are theirs later; the handle is chosen once per browser.
- **Overlays, five and closed.** Waiting, blocked and idle read from `awaiting:`, `depends_on:` and the days since the last tick, claim or artifact landing; behind reads from an artifact whose page lines or artifacts before it changed after it was drawn or last read again; the suite's verdict shows beside the stage. A `flag:` and a hotfix branch are the release change's, which writes both keys from the application repository (decisions Q36). Behind is shown and told once here; what clears it is [Agent Rounds](../../../docs/prds/products/shared/planning/agent-rounds.md).
- **Keys the record gains.** `hands:`, `ui_waived: "<why>"` for a change with no surface, `landed_by:` naming the hand whose word landed each artifact, `released_in:` for the tag that carried the change; `reviewed:` is read here and written by the round. The store reader and `pnpm check:manual` read all five, and `check:manual` refuses a `hands:` or `landed_by:` handle the team map does not know.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

- `shared/planning/change-stages`: where a change stands, who is on it, and how they are told - the stages, the overlays, the hands, the messages and the surfaces that show them. Held to by the store and the application repository alike, which is why it sits under `shared/`.

### Modified Capabilities

None.

## Impact

- `grade10-spec`: `tools/manual/src/api/derive.ts` derives the stage, the hand and the hand's move; `tools/manual/src/store/read-changes.mts` and `tools/manual/check/record.mjs` read the new keys; the board, the change page, My turn and the page ribbon change under `tools/manual/src/pages/` and `tools/manual/src/blocks/`; `.github/workflows/proposal-notify.yml` and `scripts/openspec/changed-changes.mjs` compute the stage, the hand and what is behind before and after each push and send the direct messages; a scheduled workflow sends the digest; the team map is new; `docs/prds/guides/working-a-change.md` gains the stage table in place of the turn table.
- `grade10`: `scripts/openspec/plan.mjs` gains `hand`, and its board links the change's page in place of printing the stage (decisions Q37).
- Every teammate: a Slack message per turn, answered in the change's thread, and one line of YAML to name a hand.
- This change's own artifacts: `ui-design.md` and `tech-design.md` are drawn from the page and this proposal, which carry every fact the two files need; a state or a constraint either file needs that the page lacks lands on the page first.

## Open Questions

- ❓ **How a handle's Slack member is found** - written into `docs/prds/team.yaml` beside the handle's e-mail, or looked up by e-mail through the Slack app. Operations decides; the map lives in the store either way (decisions Q40).
- ❓ **Whether the hosted manual can take Assign** - it stays local until the manual has a sign-in. Operations decides.

## Follow-on changes

- Run a round on every artifact: `run-a-round-on-every-artifact`, open on [Agent Rounds](../../../docs/prds/products/shared/planning/agent-rounds.md) - the change's agent, the thread, the challengers and verifiers, the re-read that clears Behind and refuses a landing on a behind artifact, the round record, the walk at the end of Building, and the skills that run it.
- Land without a pull request: `pnpm land` runs the gate CI runs and pushes to `main` in both repositories, and a red `main` messages the pusher.
- Cut releases from a tag: a `production` branch that only fast-forwards, `pnpm release cut` and `pnpm release hotfix`, `released_in` in the archive gate, a Release page, a deploy that refuses a pending migration, `pnpm db:reset`, the smoke suite on the preview, a flags table, and the `flag:` and `hotfix:` keys the board reads as two more facts beside the stage.
- Keep the store small: a monthly prune of the archive to one index row per change, the shelf on the board, thirteen skills in place of thirty-seven, a delivery-line guide and a glossary, and `AGENTS.md` cut to a map.

## References

- [Change Stages · Stages](../../../docs/prds/products/shared/planning/change-stages.md#stages)
- [Change Stages · Overlays](../../../docs/prds/products/shared/planning/change-stages.md#overlays)
- [Change Stages · Hands](../../../docs/prds/products/shared/planning/change-stages.md#hands)
- [Change Stages · Messages](../../../docs/prds/products/shared/planning/change-stages.md#messages)
- [Change Stages · Surfaces](../../../docs/prds/products/shared/planning/change-stages.md#surfaces)
- [Delivery workflow blueprint](../../../docs/references/delivery-workflow-blueprint.md)
- [PRDs and OpenSpec · The change's record](../../../docs/governance/prd-and-openspec.md#the-changes-record)
- [Task ownership](../../../docs/governance/task-ownership.md)
