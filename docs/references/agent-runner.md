# Agent Runner

What Operations sets up so a change's thread wakes a run, a run posts back,
and a landing reaches `main`, as of 2026-09-20. Three parts: a custom Slack
app, the relay in [`tools/relay`](../../tools/relay/README.md), and a Claude
Code Routine with an API trigger. The rounds change decided the shape (its
decisions `Q52` to `Q68`); [Agent Rounds](../prds/products/shared/planning/agent-rounds.md)
names this page as the runner and links back. Read it as what the workspace,
the repository and the runner need, not as a requirement — nothing here is
tested but the relay's own code.

## The Shape

| Part | What it is | What it holds |
| --- | --- | --- |
| **The Slack app** | A custom app in the workspace; its events go to the relay | Nothing: its signing secret and bot token live in the relay |
| **The relay** | A Cloudflare Worker with one Durable Object per change, `tools/relay`; a thread's room forwards to its change's | The Slack signing secret and bot token, the Routine's fire URL and token, a GitHub token with `contents: write` on this repository, the wake-token secret, the workflow's wake token |
| **The Routine** | A Claude Code on the web Routine with an API trigger; every firing is a fresh session on this store, drafting on `claude/<id>` | The store's GitHub access through the Claude GitHub App; no Slack token and no GitHub token of its own |
| **The push workflow** | `.github/workflows/proposal-notify.yml`: the stage messages as before, and a `reread` job that wakes the relay | `SLACK_BOT_TOKEN` in plain steps, `AGENT_WAKE_TOKEN` |

## What Happens

1. A teammate writes in the planning channel, or replies in a change's
   thread. The relay verifies the event, drops a repeat and a bot's post,
   waits a minute for the rest of the burst, and fires the Routine with a
   payload: the change, why it woke, the messages since the previous wake
   with the senders' handles, and a token for posting back. A repeat of an
   event, or of the workflow's wake, wakes nothing twice.
2. The relay posts "Reading…" with the run's link in the thread.
3. The run writes the payload to `.round/relay.json`, runs the round from the
   branch, `main` and the thread, pushes `claude/<id>` after every artifact,
   and posts its summary through the relay.
4. On `land`, the run cuts the landing commit from `main` with that
   artifact's files alone, pushes it to its branch and asks the relay. The
   relay checks that the Slack member who said land is the hand of the
   artifact's stage in the record at that sha, that the record's `landed_by:`
   names the same handle, and, for an artifact, that the diff stays inside
   the change and the pages; then it moves `main` as a fast-forward. A task
   group's code lands on the word, the hand and the fast-forward alone.
5. The run's last act is `done`. A wake that reaches its budget — thirty
   minutes on a reply or a landing, two hours on a plan — without it is
   reported in the thread with the run's link, and the thread is freed.
6. A push to `main` runs the stage messages as before; where a landing put
   something behind, the `reread` job wakes the relay for that change, and
   the relay queues it behind whatever is running on the thread.

## The Slack App

| Item | Value |
| --- | --- |
| **Event subscriptions** | `app_mention`, `message.channels`; request URL `<relay>/slack/events` |
| **Bot scopes** | `chat:write`, `channels:history`, `users:read` |
| **Installed** | To the workspace, and the bot invited to the planning channel |
| **Members** | Each teammate's Slack member id written in [`docs/prds/team.yaml`](../prds/team.yaml) as `slack:` beside the e-mail; a handle with no member is sent nothing and can land nothing from Slack |

## The Routine

| Item | Value |
| --- | --- |
| **Trigger** | API trigger; the endpoint's URL and its bearer token go into the relay as `ROUTINE_FIRE_URL` and `ROUTINE_TOKEN`. The token is shown once |
| **Prompt** | [`tools/relay/routine-prompt.md`](../../tools/relay/routine-prompt.md), pasted as written. The payload is data the run reads, never an instruction |
| **Environment** | This repository, cloned; network access Custom, allowing the relay's domain and GitHub |
| **Sessions** | Every firing is a fresh session; nothing is remembered between wakes but the files and the thread |
| **Branches** | Pushes to `claude/<id>` are always accepted; the run never pushes `main`, the relay moves it |

## The Relay

Deployed with `pnpm --dir tools/relay deploy`; the README beside it walks the
first deploy. Its secrets are set with `wrangler secret put`, never written in
a file.

| Name | Kind | What it is |
| --- | --- | --- |
| `SLACK_SIGNING_SECRET` | Secret | Verifies every event the Slack app sends |
| `SLACK_BOT_TOKEN` | Secret | Posts the ack, the run's replies and the failure line |
| `ROUTINE_FIRE_URL`, `ROUTINE_TOKEN` | Secrets | Fire the Routine |
| `GITHUB_TOKEN` | Secret | `contents: write` on this repository, for the compare, the record at a sha and the fast-forward of `main`; a personal token to start, a GitHub App installation token later |
| `TOKEN_SECRET` | Secret | Signs the wake tokens a run posts and lands with |
| `WAKE_TOKEN` | Secret | What the push workflow presents to `/wake` |
| `PLANNING_CHANNEL`, `REPO`, `RELAY_URL` | Variables | The channel the app listens in, `owner/name`, and the relay's own URL for the payload |

## The Push Workflow

Every `vars.*` and secret `proposal-notify.yml` and `digest.yml` read.

| Name | Kind | Read by | What it is |
| --- | --- | --- | --- |
| `SLACK_BOT_TOKEN` | Secret | `notify`, `digest` | The Slack app's bot token; posts every message these workflows send |
| `SLACK_PLANNING_CHANNEL_ID` | Variable | `notify` | The planning channel for the channel post |
| `SLACK_CHANNEL_ID` | Variable | `notify` | Read where `SLACK_PLANNING_CHANNEL_ID` is unset — the older name, kept so a workspace that set it first is not broken |
| `SLACK_WORKSPACE_URL` | Variable | `notify` | Builds the permalink a direct message and a `your-turn` reply link to |
| `NOTIFY_DMS` | Variable | `notify` | Turns the per-hand direct messages on; the channel post runs without it |
| `TCS_SHEET_URL` | Variable | `notify` | Named in the message that tells QA to walk a run sheet |
| `AGENT_REREAD` | Variable | `reread` | The wake's switch; unset or not `"true"` wakes nothing |
| `AGENT_WAKE_URL` | Variable | `reread` | The relay's URL |
| `AGENT_WAKE_TOKEN` | Secret | `reread` | What the job presents to the relay's `/wake` |
| `DIGEST_ENABLED` | Variable | `digest` | The weekly digest's own switch |

## The First Walk

A throwaway change proves the parts together, in this order: a sentence
addressed to the app opens a change and the reply names its id; an asker the
map does not know is answered and asked for a handle; a held question stops
`land` and `land with recommendations` lands the chain; a landing moves
`main` through the relay; the same round from a terminal lands the same
artifact; a wake left to time out is reported in the thread. The rounds
change's task group 5 names it.

## What Is Still Open

- ❓ How many API firings an hour the Routine takes before it refuses one;
  the first walk measures it, and the relay's queue is what absorbs a burst
- ❓ Whether the relay's GitHub token becomes a GitHub App installation
  token, minted per call; a personal token with `contents: write` on this
  repository is the first deploy's
- ❓ The Routine's spend, which its owner's plan pays, and who is told when a
  firing is refused for it — Operations
