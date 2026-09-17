# Stage every change and tell the next hand

**Author:** @ecchochan - 2026-09-17

Product context: [Change Stages](../../../docs/prds/products/shared/planning/change-stages.md), a planned page under [Planning](../../../docs/prds/products/shared/planning/index.md). Owner's brief: [Delivery workflow blueprint](../../../docs/references/delivery-workflow-blueprint.md).

## Why

A change passes through five hands, and nobody is told when it reaches theirs. The board shows four lanes read from the files, so a change waiting on a designer, one waiting on QA and one waiting on a deploy sit in the same column, and the person it waits on finds out by looking. On 2026-09-17 the store holds 71 changes in flight: 29 with no `tasks.md`, 18 with every box ticked and not archived, 8 waiting on a named input, and the board cannot say which of the rest are moving. Idle cannot be counted at all, because one repository-wide commit on 2026-09-16 touched every change.

Success is a change that lands a stage on `main` and tells the next hand within a minute, with the command to paste, and a board on which every column is one stage and every card names a person. The number to move: the days between a stage landing and the next hand's first commit, unmeasured today and visible on the change page after this change.

## What Changes

- **Nine stages, read from the files.** Proposed, Decided, Designed, Specified, Planned, Building, On staging, Released, Archived - each proven by a file on `main`, never set by hand. The four lanes become nine columns on the board, the change page wears a stepper, and a 🚧 line on a page wears the pip of its change's stage. The ladder is on [Change Stages · Stages](../../../docs/prds/products/shared/planning/change-stages.md#stages).
- **Hands, recorded in git.** `hands:` in `.openspec.yaml` names a handle per role. The PM writes it at the interview's end; the local manual's Assign action and `pnpm plan hand <change> <role> @handle` in `grade10` write it too. A team map names each handle's Slack member and roles.
- **Your turn, once, in Slack.** The push to `main` that moves a change into a stage sends one direct message to that stage's hand - the change, the stage, the command - or to the role's channel when the hand is unnamed. The channel post per push stays and names the stage each change moved into. A weekly digest per person lists their idle and waiting changes.
- **My turn.** A page listing the changes whose current stage names the reader, then the ones that are theirs later; the handle is chosen once per browser.
- **Overlays.** Waiting, blocked and idle read from `awaiting:`, `depends_on:` and the days since the last tick, claim or artifact landing; the suite's verdict and a `flag:` show beside the stage.
- **Keys the record gains.** `hands:`, `ui_waived: "<why>"` for a change with no surface, `plan_approved:` for a person's approval of the implementation summary, `released_in:` for the tag that carried the change. The store reader and `pnpm check:manual` read all four, and `check:manual` refuses a `hands:` handle the team map does not know.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

- `shared/planning/change-stages`: where a change stands, who is on it, and how they are told - the stages, the overlays, the hands, the messages and the surfaces that show them. Held to by the store and the application repository alike, which is why it sits under `shared/`.

### Modified Capabilities

None.

## Impact

- `grade10-spec`: `tools/manual/src/api/derive.ts` derives the stage; `tools/manual/src/store/read-changes.mts` and `tools/manual/check/record.mjs` read the new keys; the board, the change page, My turn and the page ribbon change under `tools/manual/src/pages/` and `tools/manual/src/blocks/`; `.github/workflows/proposal-notify.yml` and `scripts/openspec/changed-changes.mjs` compute the stage before and after each push and send the direct messages; a scheduled workflow sends the digest; the team map is new; `docs/prds/guides/working-a-change.md` gains the stage table in place of the turn table.
- `grade10`: `scripts/openspec/plan.mjs` gains `hand` and `approve`, and the board prints the stage.
- Every teammate: a Slack message per turn, and one line of YAML to name a hand.
- This change's own artifacts: `ui-design.md` and `tech-design.md` are drawn from the page and this proposal, which carry every fact the two files need; a state or a constraint either file needs that the page lacks lands on the page first.

## Open Questions

- ❓ **Where the handle-to-Slack map lives** - `docs/prds/team.yaml` in the store, or a lookup by e-mail through the Slack app. Operations decides.
- ❓ **What records a person's approval of the implementation summary** - `plan_approved:` written by `pnpm plan approve`, or the first claim on a group. The engineering lead decides.
- ❓ **Whether the tech design is written before the requirements**, as the brief orders the phases, or after, as the schema orders the artifacts today. The PM and the tech PIC decide; the Designed stage reads `tech-design.md` only if the schema places it before the requirements.
- ❓ **Whether the hosted manual can take an action** - Assign and Approve stay local until the manual has a sign-in. Operations decides.

## Follow-on changes

- Land without a pull request: `pnpm land` runs the gate CI runs and pushes to `main` in both repositories, and a red `main` messages the pusher.
- Cut releases from a tag: a `production` branch that only fast-forwards, `pnpm release cut` and `pnpm release hotfix`, `released_in` in the archive gate, a Release page, a deploy that refuses a pending migration, `pnpm db:reset`, the smoke suite on the preview, and a flags table.
- Keep the store small: `/reconcile` and a freshness badge along the artifact chain, a monthly prune of the archive to one index row per change, a stale shelf on the board, thirteen skills in place of thirty-seven, a delivery-line guide and a glossary, and `AGENTS.md` cut to a map.

## References

- [Change Stages · Stages](../../../docs/prds/products/shared/planning/change-stages.md#stages)
- [Change Stages · Overlays](../../../docs/prds/products/shared/planning/change-stages.md#overlays)
- [Change Stages · Hands](../../../docs/prds/products/shared/planning/change-stages.md#hands)
- [Change Stages · Messages](../../../docs/prds/products/shared/planning/change-stages.md#messages)
- [Change Stages · Surfaces](../../../docs/prds/products/shared/planning/change-stages.md#surfaces)
- [Delivery workflow blueprint](../../../docs/references/delivery-workflow-blueprint.md)
- [PRDs and OpenSpec · The change's record](../../../docs/governance/prd-and-openspec.md#the-changes-record)
- [Task ownership](../../../docs/governance/task-ownership.md)
