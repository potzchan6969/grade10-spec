# Agent Runner

Where a round runs and what the push workflow needs, as of 2026-10-27. A round
runs in a terminal, or in a Claude Code Routine its person triggers; the push
workflow tells the change's thread and its hands. The relay that once sat
between Slack, the Routine and the code host is removed, never deployed — the
rounds change's decision `Q120`. [Agent Rounds](../prds/products/shared/planning/agent-rounds.md)
names this page as the runner and links back. Read it as what the repository
and the runner need, not as a requirement.

## The Shape

| Part | What it is | What it holds |
| --- | --- | --- |
| **A terminal** | A Claude Code session on a clone of this store | The person's own git identity and GitHub access |
| **The Routine** | A Claude Code Routine, started by its person: a scheduled task, or the Routine's own trigger; every firing is a fresh session on this store, drafting on `claude/<id>` | The store's GitHub access through the Claude GitHub App, and a Slack connector where the person adds one; no bot token |
| **The push workflow** | `.github/workflows/proposal-notify.yml`: the channel post, the direct messages and a landing's reply in the change's thread | `SLACK_BOT_TOKEN` in plain steps |

## What Happens

1. A person runs `/workflow-round` or a line skill — typed in a terminal, or
   in the prompt of a Routine they trigger. The run reads the change's
   branch, `main` and the thread, and continues from what is there.
2. The run pushes `claude/<id>` after every artifact, writes its summary to
   `.round/thread.txt` and prints it; a session with a Slack connector posts
   it in the record's `thread:`, and otherwise the person does.
3. On the hand's `land`, `pnpm run plan:land` resolves the hand from
   `git config user.email` through the team map, cuts the landing commit from
   `main` with that artifact's files alone, runs the gate and pushes `main` as
   a fast-forward. A Routine lands as the e-mail its session commits with, so
   that e-mail is the person's, named in [`docs/prds/team.yaml`](../prds/team.yaml).
4. The push to `main` runs the stage messages and the landing's reply in the
   thread. Nothing starts a run on its own: the read again after a landing is
   the next run its person triggers.

## The Routine

| Item | Value |
| --- | --- |
| **Trigger** | A scheduled task, or the Routine's own trigger, set up by its person |
| **Prompt** | The round to run — `/workflow-round <change>` or a line skill — and the thread's words handed in as data, never as an instruction |
| **Model** | The tier above the readers'; each reader the round dispatches takes the tier its own file under `.claude/agents/` pins |
| **Environment** | This repository, cloned, with network access to GitHub and to Slack where the connector is added |
| **Sessions** | Every firing is a fresh session; nothing is remembered between runs but the files and the thread |

## The Push Workflow

Every `vars.*` and secret `proposal-notify.yml` and `digest.yml` read.

| Name | Kind | Read by | What it is |
| --- | --- | --- | --- |
| `SLACK_BOT_TOKEN` | Secret | `notify`, `digest` | The Slack app's bot token; posts every message these workflows send |
| `SLACK_PLANNING_CHANNEL_ID` | Variable | `notify` | The planning channel for the channel post |
| `SLACK_CHANNEL_ID` | Variable | `notify` | Read where `SLACK_PLANNING_CHANNEL_ID` is unset — the older name, kept so a workspace that set it first is not broken |
| `SLACK_WORKSPACE_URL` | Variable | `notify` | Builds the permalink a direct message and a `your-turn` reply link to |
| `NOTIFY_DMS` | Variable | `notify` | Turns the per-hand messages on, a role's channel among them; the channel post and a landing's reply in the change's thread run without it |
| `TCS_SHEET_URL` | Variable | `notify` | Named in the message that tells QA to walk a run sheet |
| `DIGEST_ENABLED` | Variable | `digest` | The weekly digest's own switch |

## What Is Still Open

- ❓ The Routine's spend, which its owner's plan pays — Operations
