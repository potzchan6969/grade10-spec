Drawn from [Change Stages](../../docs/prds/products/shared/planning/change-stages.md), the proposal and the journeys, before the requirements, as the brief orders the phases (decisions Q10). The requirements pass reads it; the reconciliation re-reads it.

## Context

- **Everything is derived today, and stays so.** `laneOf` in `tools/manual/src/api/derive.ts` reads four lanes from `deltas`, `taskGroups` and the tick counts; `pendingByTeammate` reads what each role owes from the schema's `teammate` and `requires`; `ChangeEntry` in `tools/manual/src/api/types.ts` already carries `owners`, `promotedBy`, `awaiting`, `dependsOn`, `deployedEnv`, `lastMoved` and `written`.
- **One record per change.** `.openspec.yaml` is read by `read-changes.mts` and checked by `tools/manual/check/record.mjs`; every waiver is text, never `true`, and a key read as absent waives nothing.
- **One post per push.** `.github/workflows/proposal-notify.yml` runs `scripts/openspec/changed-changes.mjs` on every push to `main`, classifies the changes touched, and posts one channel message through `slackapi/slack-github-action`.
- **The board commits from the application repository.** `pnpm plan claim` and `pnpm plan done` in `grade10` push one commit each to this store's `main`, so a hand written from there follows the same path.
- **Git dates lie about idle.** `lastMoved` is the last commit touching the directory; the repository-wide commit of 2026-09-16 moved every change at once.

## Goals / Non-Goals

**Goals:**

- One derivation of the stage, in `derive.ts`, that every surface and the notify workflow call
- The hands as the only stored fact, validated against the team map
- A direct message per hand change that cannot be sent twice for one move

**Non-Goals:**

- A sign-in on the hosted manual
- A Slack app with interactive buttons; every message links the change page and carries the command as text until Q3 settles the identity map
- Reading tags or deploys out of `grade10`; the store reads only what `pnpm plan` writes into it

## Decisions

The page governs what a stage is and who is told; these are how that lands.

- **Stage is a pure function of the entry.** `stageOf(change: ChangeEntry, schema: SchemaArtifact[]): Stage` beside `laneOf`, returning one of `proposed | designed | specified | planned | building | on-staging | released | archived`, tested in `derive.test.ts` with one fixture per stage and one per boundary. `laneOf` becomes a projection of `stageOf` so the four lanes and the eight stages can never disagree while both exist. Rejected: a second reader in the workflow script, which would drift from the manual's within a week.
- **The hand is derived beside the stage.** `handOf(change, stage): Role` returns whose turn it is: inside Proposed, `pm` until `decisions.md`, the journeys file and `hands:` are all present, then `design` and `tech`; on every other stage the role the page's Hands table names. A move is the pair `(stage, hand)` changing, which is what the workflow compares and what My turn lists. Rejected: a stage of its own for the completed proposal, which the page's decisions rule out.
- **Agent-driven is a constant, not a key.** `AGENT_DRIVEN: Stage[] = ["specified", "planned", "building"]` beside `stageOf`, with the reader's role per stage; the lane heading, the stepper and the flow render the mark from it. Nothing in a change's record says it, because which hand writes a stage is the schema's rule, not one change's.
- **Designed reads waivers as written artifacts.** `written` gains `ui-design` when `ui_waived` is set and `tech-design` when `design_waived` is set, in `read-changes.mts`, so the schema's `requires` stays the one order and no rule special-cases a waiver. Whether `tech-design` sits before or after `specs` in that order is Q1 of the proposal; the derivation reads the schema, so the answer changes `schema.yaml` and nothing here.
- **Hands are a mapping, not a list.** `hands:` maps `pm | design | tech | qa | dev | release` to one handle each; `read-changes.mts` parses it with the `handles` helper that already reads `owner`, and `record.mjs` gains a `hands` rule refusing an unknown role, a handle absent from the team map, and a value that is not one handle. `owners` keeps its meaning of who claimed work. Rejected: extending `owners` with roles, which would break `pnpm plan claim`'s reading of it.
- **The team map is a store file.** `docs/prds/team.yaml`: one entry per handle with `slack` (the member id) and `roles`; read by the snapshot so the manual can show a hand's name, and by the workflow so it can address a message. Q3 may move it; the reader takes a path, so moving it is one constant.
- **Idle counts landings, not commits.** `read-changes.mts` reads, per change, the last commit that changed a `- [x]` line or an owner tag in `tasks.md`, or added a schema artifact file, and records it as `lastLanded`; `idleDays` is today minus that. `lastMoved` stays for the board's sort. Rejected: excluding commits by message or by size, which guesses.
- **Freshness is pairwise along the chain.** Each artifact's last commit date is read once; an artifact is `behind` when any artifact before it in the schema's `requires` closure carries a later date. Shown on the change page only; no rule fails on it, since the reconcile change owns what happens next.
- **The workflow computes the stage and the hand twice.** `changed-changes.mjs` gains `--stages`: for each change the push touched, `stageOf` and `handOf` at `base` and at `head`, using the manual's reader against `git show` of both trees. A change whose hand changed sends one direct message to the new hand, so the designer and the tech PIC are told when the decisions and the journeys complete Proposed, and the channel post gains the stage after each change. Sent messages are keyed `<change>:<stage>:<role>` and written to the workflow's cache, so a re-run of the same push sends nothing twice; a stage re-entered after a revert sends again, which is correct.
- **Unnamed hand routes to a channel.** The team map carries `channels:` per role; a stage whose hand is unnamed posts to that role's channel with the same body, and the card on the board says the hand is open.
- **The digest is a scheduled workflow.** `digest.yml` every Monday 09:00 Hong Kong time, reading the snapshot's `idleDays`, `awaiting` and `hands`, one direct message per person with at least one line to say. Rejected: a daily digest, which the page's Messages table rules out.
- **`pnpm plan hand` and `pnpm plan approve` reuse the claim path.** In `grade10`'s `scripts/openspec/plan.mjs`, both edit the change's `.openspec.yaml` on the store's `main` and push one commit, as `claim` does for `tasks.md`; `approve` writes `plan_approved: @handle YYYY-MM-DD`. Q2 may make the first claim carry the approval instead; the command stays either way.
- **Assign on the local manual writes through the dev server.** The Vite plugin's confined endpoint gains `hands(change, role, handle)`, one atomic commit like `propose`, behind the same path allowlist.

## Service Interfaces

Not a service. The two contracts that cross a boundary:

| Contract | Input | Output |
| --- | --- | --- |
| `stageOf(entry, artifacts)` | A `ChangeEntry` and the schema's artifacts | One stage id; never throws, an unreadable entry is `proposed` with `error` set |
| `handOf(entry, stage)` | A `ChangeEntry` and its stage | The role whose turn it is; `pm` on an unreadable entry |
| `changed-changes.mjs --stages` | `--base`, `--head`, the team map path | The channel payload with a stage per change, and one direct-message payload per hand change, keyed `<change>:<stage>:<role>` |

The team map:

```yaml
handles:
  ecchochan: { slack: U0123ABCD, roles: [pm, dev] }
channels:
  design: C0456EFGH
```

## Risks / Trade-offs

- [The workflow sends to a wrong person after a rename] → the `hands` rule refuses a handle the map does not hold, on the push that renamed it, before any message goes out
- [A rebase replays a stage entry and a second message goes out] → the `<change>:<stage>` key in the workflow cache; a duplicate is dropped
- [A stage flips back and forth on a half-written change] → the message says the stage and the file that proved it; a flip back sends nothing, only a rise does
- [Idle reads wrong on a change planned by hand edits] → a hand edit to `tasks.md` still changes a line the reader counts as a landing
- [Eight lanes make a long page] → a lane with nothing in it collapses to its heading, Archived starts collapsed, and the open lanes sit side by side only above 1536px

## Migration Plan

1. `stageOf`, `handOf`, the eight lanes with the agent-driven mark, the stepper and the pip; no new keys read yet. Nothing changes for anybody who writes a change.
2. `hands:`, the team map, the `hands` rule, `pnpm plan hand`, Assign on the local manual, My turn. Changes without hands show open hands.
3. `--stages` in the workflow, the direct messages, then the digest. Rollback for this step is the workflow's `if:` on a repository variable; steps 1 and 2 need none.

## Open Questions

- Whether the stage should also be printed by `pnpm plan` in `grade10`, or only linked from it; either fits the board's current lanes.
- Whether a direct message to the pusher of a red `main` belongs here or to the land-without-a-pull-request change; the payload is the same either way.
