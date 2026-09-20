# Relay

The relay sits between the Slack app, the hosted runner and the code host. It
verifies Slack's events, keeps one queue per planning thread, fires one session
per wake with the thread's messages as data, and takes that session's posts and
its landing back. A landing moves `main` by a fast-forward, and only after the
checks behind the word that asked for it.

It is glue. Every rule it enforces is a requirement of Agent Rounds, in
[the `run-a-round-on-every-artifact` change](../../openspec/changes/run-a-round-on-every-artifact/specs/shared/planning/agent-rounds/spec.md)
until that change archives.

## Secrets and Vars

Set from `tools/relay`, one at a time:
`pnpm dlx wrangler@4.120.0 secret put <NAME> -c wrangler.jsonc`.

| Name | Kind | Value |
| --- | --- | --- |
| `SLACK_SIGNING_SECRET` | secret | The Slack app's signing secret, from Basic Information |
| `SLACK_BOT_TOKEN` | secret | The app's bot token, `xoxb-…`, from OAuth & Permissions |
| `ROUTINE_FIRE_URL` | secret | `https://api.anthropic.com/v1/claude_code/routines/<id>/fire` |
| `ROUTINE_TOKEN` | secret | An API key for the account the Routine belongs to |
| `GITHUB_TOKEN` | secret | A token with contents write on the store, and nothing else |
| `TOKEN_SECRET` | secret | 32 random bytes, hex: the relay's own key for wake tokens |
| `WAKE_TOKEN` | secret | The workflow's bearer, the same value as the repository secret `AGENT_WAKE_TOKEN` |
| `PLANNING_CHANNEL` | var | The channel id of the planning channel, `C…` |
| `REPO` | var | The store as `owner/name` |
| `RELAY_URL` | var | This Worker's own origin, which the payload hands each run |

The vars are in `wrangler.jsonc` with placeholder values. No secret value
belongs in that file, in this one, or in a commit.

## The Slack App

One custom app, created from a manifest. The request URL is the Worker's
`/slack/events`, and Slack verifies it the moment the app is saved, so deploy
first.

```yaml
display_information:
  name: Grade10 Rounds
features:
  bot_user:
    display_name: Grade10 Rounds
oauth_config:
  scopes:
    bot:
      - chat:write
      - channels:history
      - users:read
settings:
  event_subscriptions:
    request_url: https://grade10-relay.<subdomain>.workers.dev/slack/events
    bot_events:
      - app_mention
      - message.channels
```

- **`app_mention`** — a first sentence addressed to the app opens a room
- **`message.channels`** — the thread's replies, which need no mention once the
  room exists
- **`chat:write`** — the relay is the only writer to the thread besides the push
  workflow's own post
- **`channels:history`** — the thread's messages
- **`users:read`** — nothing more than reading a member id
- **Invite** — the app is invited to the planning channel; it reads no other
  channel

## The Routine

One Routine on the account, fired by the relay over its API.

- **Trigger** — API, so every wake is a fire with the relay's payload as its
  message
- **Prompt** — [`routine-prompt.md`](routine-prompt.md), pasted unchanged. The
  prompt never changes per wake; the payload carries everything that does
- **Environment** — this store, so every session starts with the branch, the
  skills and the schema
- **Network access** — Custom, allowing the relay's own domain and the code
  host. A session reaches the thread only through the relay
- **Model and permissions** — the account's defaults; nothing here sets them

## The Code Host Token

The relay holds the only credential that moves `main`.

- **Scope** — contents write on the store, nothing else
- **Why the relay holds it** — the checks behind a landing are the relay's, so
  the token a session holds moves nothing: a session's own token is one wake's
  wake token
- **Later** — an app installation token, which expires by itself and is scoped
  to the store without a person behind it — ❓ Operations confirms whether the
  organization allows the installation

## Deploying

```bash
pnpm --dir tools/relay deploy
```

Wrangler is not a dependency here: the script runs it through `pnpm dlx` at the
pinned version, as the manual's deploy does. The Durable Object migration `v1`
runs on the first deploy and creates the `Room` class.

## The First Test

Walk a throwaway change before any real one, in this order.

1. **The handshake** — save the Slack app's request URL. Slack calls
   `/slack/events` and the relay echoes the challenge
2. **A first sentence** — address the app in the planning channel. The thread
   gains one `Reading… <run url>` reply inside a few seconds
3. **A reply** — say something else in the thread. One wake answers both
   messages, a minute after the first
4. **A landing** — say `land` as the hand of the artifact. `main` moves, and the
   thread names the artifact and the handle
5. **Somebody else's word** — say `land` as anybody but the hand. Nothing moves
   and the reply names the check that refused
6. **A wake left to time out** — the thread carries
   `The read again of <change> did not finish: <run url>` when the budget runs
   out

## Not Covered

- **The runner's firing caps** — how many fires an account takes in an hour is
  undocumented — ❓ Operations confirms it against the plan before the relay
  answers a busy channel
- **A session that survives between replies** — every wake is a fresh session
  that reads the branch, the thread and `main` again
- **A thread outside the planning channel** — the relay wakes nothing there
- **Slack's retries** — a delivery Slack repeats is dropped by `event_id` for 24
  hours; a message the relay never saw is not recovered by anything here
