Drawn from [Change Stages](../../docs/prds/products/shared/planning/change-stages.md), the proposal and the journeys, before the requirements (decisions Q10). The requirements pass reads it; the reconciliation re-reads it.

## Context

- **Everything is derived today, and stays so.** `laneOf` in `tools/manual/src/api/derive.ts` reads four lanes from `deltas`, `taskGroups` and the tick counts; `pendingByTeammate` reads what each role owes from the schema's `teammate` and `requires`; `ChangeEntry` in `tools/manual/src/api/types.ts` already carries `owners`, `promotedBy`, `awaiting`, `dependsOn`, `deployedEnv`, `lastMoved` and `written`; each change document carries `lastCommit` from `git.commitOf`.
- **One record per change.** `.openspec.yaml` is read by `read-changes.mts` and checked by `tools/manual/check/record.mjs`; every waiver is text, never `true`, and a key read as absent waives nothing.
- **One post per push.** `.github/workflows/proposal-notify.yml` runs `scripts/openspec/changed-changes.mjs` on every push to `main`, on a full checkout, classifies the changes touched, and posts one channel message through `slackapi/slack-github-action`; its `paths:` filter omits `docs/prds/**`.
- **The board commits from the application repository.** `pnpm plan claim` and `pnpm plan done` in `grade10` push one commit each to this store's `main`, so a hand written from there follows the same path.
- **Git dates lie about idle.** `lastMoved` is the last commit touching the directory; the repository-wide commit of 2026-09-16 moved every change at once.
- **The checks run on a one-commit checkout.** `lint.yml` runs `check:manual` after a push to `main` at the default depth, so a rule there cannot read history and cannot refuse a landing.

## Goals / Non-Goals

**Goals:**

- One derivation of the stage, the hand and the hand's move, in `derive.ts`, that every surface and the notify workflow call
- The hands and who landed each artifact as the only stored facts this change writes, validated against the team map
- A direct message per hand change, and one per artifact going behind, that cannot be sent twice for one move

**Non-Goals:**

- Writing the read record, refusing a landing, or waking an agent: `run-a-round-on-every-artifact`
- A sign-in on the hosted manual
- A Slack app with interactive buttons; every message links the thread and the change page and carries the command as text until Q3 settles the identity map
- Reading tags or deploys out of `grade10`; the store reads only what `pnpm plan` writes into it

## Decisions

The page governs what a stage is and who is told; these are how that lands.

- **Stage is a pure function of the entry.** `stageOf(change: ChangeEntry, schema: SchemaArtifact[]): Stage` beside `laneOf`, returning one of `proposed | designed | specified | planned | building | on-staging | released | archived`, tested in `derive.test.ts` with one fixture per stage and one per boundary. `laneOf` becomes a projection of `stageOf` so the four lanes and the eight stages can never disagree while both exist. Rejected: a second reader in the workflow script, which would drift from the manual's within a week.
- **The hand is derived beside the stage.** `handOf(change, stage): Role[]` returns whose turn it is: inside Proposed, `pm` until `decisions.md`, the journeys file and `hands:` are all present, then `design` and `tech`; `pm` at Specified; `dev` at Planned and Building; `qa` and `release` at On staging. A move is the pair `(stage, hands)` changing, which is what the workflow compares and what My turn lists. Rejected: a stage of its own for the completed proposal, which the page's decisions rule out.
- **The agent mark and the move are a table, not a key.** `DRAFTED: Record<Stage, { move: string }>` for the five stages from `proposed` to `building` - answer, tweak and challenge, read, read, read each landing - beside `stageOf`; the lane heading, the stepper and the flow render the mark and the move from it. Nothing in a change's record says it, because which stages an agent drafts is the schema's rule, not one change's.
- **Designed reads waivers as written artifacts.** `written` gains `ui-design` when `ui_waived` is set and `tech-design` when `design_waived` is set, in `read-changes.mts`, so the schema's `requires` stays the one order and no rule special-cases a waiver. The schema's `requires` for `tech-design` becomes `decisions` and `user-journeys` (decisions Q10); the derivation reads the schema, so the order lives in `schema.yaml` and nowhere here.
- **Hands are a mapping, not a list.** `hands:` maps `pm | design | tech | qa | dev | release` to one handle each; `read-changes.mts` parses it with the `handles` helper that already reads `owner`, and `record.mjs` gains a `hands` rule refusing an unknown role, a handle absent from the team map, and a value that is not one handle. `owners` keeps its meaning of who claimed work. Rejected: extending `owners` with roles, which would break `pnpm plan claim`'s reading of it.
- **Who landed an artifact is a key.** `landed_by:` maps a schema artifact id to the handle whose word landed it, written by the landing (the round's `/land`, or the person's own push through it) in the same commit as the artifact; `read-changes.mts` reads it beside `written`, `record.mjs` refuses a handle the team map does not know and an artifact id the schema does not issue, and the change page shows the handle beside the artifact. Replaces `plan_approved:` and `pnpm plan approve`: an artifact on `main` is an approved one (decisions Q14). Rejected: a commit trailer, which no reader in this store or in `grade10`'s `plan.mjs` parses.
- **The read record is read here, written elsewhere.** `reviewed:` maps a schema artifact id to a content id: a hash over the text of what is before the artifact - the page sections the proposal links, then the artifact files before it in the schema's order - with whitespace collapsed the way `stale.mjs` collapses it. `read-changes.mts` reads it and computes the same id from the tree; the round change writes it. Never a commit sha, which a shallow checkout cannot resolve and a rebase invalidates; never a date, which cannot tell two edits on one day apart.
- **Behind is computed from the tree.** An artifact is behind when its content id of what is before it differs from `reviewed:`; with no `reviewed:` line, when the last commit of anything before it is later than its own `lastCommit`. `.openspec.yaml` is never upstream, a waived artifact is never behind, and the page counts only the sections the change links. Shown on the artifact row and as one card chip naming the earliest behind artifact and its hand; no rule fails on it, and `archive:preflight` refuses a behind delta.
- **The team map is a store file.** `docs/prds/team.yaml`: one entry per handle with `slack` (the member id) and `roles`; read by the snapshot so the manual can show a hand's name, and by the workflow so it can address a message. Q3 may move it; the reader takes a path, so moving it is one constant.
- **Idle counts landings, not commits.** `read-changes.mts` reads, per change, the last commit that changed a `- [x]` line or an owner tag in `tasks.md`, or added a schema artifact file, and records it as `lastLanded`; `idleDays` is today minus that. `lastMoved` stays for the board's sort. Rejected: excluding commits by message or by size, which guesses.
- **Open questions are read from the decisions and the page.** A `## Decisions` row whose `Decided` cell starts with ❓ and names a role, and a ❓ line under a section the proposal links, are the change's open questions; `read-changes.mts` lists them with the row's `Q<n>` and the hand, the change page counts them per artifact, and My turn lists them per hand.
- **The workflow computes the stage, the hands and behind twice.** `changed-changes.mjs` gains `--stages`: for each change the push touched, `stageOf`, `handOf` and the behind set at `base` and at `head`, using the manual's reader against `git show` of both trees. A change whose hands changed sends one direct message to each new hand with the thread link; an artifact newly behind sends one to its hand; the channel post gains the stage after each change. Sent messages are keyed `<change>:<stage>:<role>` and `<change>:behind:<artifact>` and written to the workflow's cache, so a re-run of the same push sends nothing twice; a stage re-entered after a revert sends again, which is correct. The workflow's `paths:` gains `docs/prds/**`, because a page landing can put an artifact behind.
- **The thread link is read from the record.** `thread:` names the change's Slack thread; this change reads it into every message and falls back to the change page's link when it is absent. The round change writes it.
- **Unnamed hand routes to a channel.** The team map carries `channels:` per role; a stage whose hand is unnamed posts to that role's channel with the same body, and the card on the board says the hand is open.
- **The digest is a scheduled workflow.** `digest.yml` every Monday 09:00 Hong Kong time, reading the snapshot's open questions, `idleDays`, the behind set, `awaiting` and `hands`, one direct message per person with at least one line to say; a behind artifact appears after 7 days. Rejected: a daily digest, which the page's Messages table rules out.
- **`pnpm plan hand` reuses the claim path.** In `grade10`'s `scripts/openspec/plan.mjs`, `hand` edits the change's `.openspec.yaml` on the store's `main` and pushes one commit, as `claim` does for `tasks.md`.
- **Assign on the local manual writes through the dev server.** The Vite plugin's confined endpoint gains `hands(change, role, handle)`, one atomic commit like `propose`, behind the same path allowlist.

## Service Interfaces

Not a service. The contracts that cross a boundary:

| Contract | Input | Output |
| --- | --- | --- |
| `stageOf(entry, artifacts)` | A `ChangeEntry` and the schema's artifacts | One stage id; never throws, an unreadable entry is `proposed` with `error` set |
| `handOf(entry, stage)` | A `ChangeEntry` and its stage | The roles whose turn it is; `pm` on an unreadable entry |
| `behindOf(entry, tree)` | A `ChangeEntry` and the tree it was read from | The artifact ids behind, in the schema's order, with what changed before each |
| `changed-changes.mjs --stages` | `--base`, `--head`, the team map path | The channel payload with a stage per change, one direct-message payload per hand change keyed `<change>:<stage>:<role>`, and one per artifact newly behind keyed `<change>:behind:<artifact>` |

The team map:

```yaml
handles:
  ecchochan: { slack: U0123ABCD, roles: [pm, dev] }
channels:
  design: C0456EFGH
```

## Risks / Trade-offs

- [The workflow sends to a wrong person after a rename] → the `hands` and `landed_by` rules refuse a handle the map does not hold, on the push that renamed it, before any message goes out
- [A rebase replays a stage entry and a second message goes out] → the `<change>:<stage>:<role>` key in the workflow cache; a duplicate is dropped
- [A stage flips back and forth on a half-written change] → the message says the stage and the file that proved it; a flip back sends nothing, only a rise does
- [Idle reads wrong on a change planned by hand edits] → a hand edit to `tasks.md` still changes a line the reader counts as a landing
- [A reformat of a proposal puts every artifact after it behind] → the chip is honest, and the round change's re-read clears it with one record line per artifact
- [Eight lanes make a long page] → a lane with nothing in it collapses to its heading, Archived starts collapsed, and the open lanes sit side by side only above 1536px

## Migration Plan

1. `stageOf`, `handOf`, `behindOf`, the eight lanes with the agent mark and the move, the stepper and the pip; `landed_by:` and `reviewed:` read; no message yet. Nothing changes for anybody who writes a change.
2. `hands:`, the team map, the `hands` and `landed_by` rules, `pnpm plan hand`, Assign on the local manual, My turn. Changes without hands show open hands.
3. `--stages` in the workflow, the direct messages, then the digest. Rollback for this step is the workflow's `if:` on a repository variable; steps 1 and 2 need none.

## Open Questions

- Whether the stage should also be printed by `pnpm plan` in `grade10`, or only linked from it; either fits the board's current lanes.
- Whether a direct message to the pusher of a red `main` belongs here or to the land-without-a-pull-request change; the payload is the same either way.
