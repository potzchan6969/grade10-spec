# Relay

The relay sits between the Slack app, the hosted runner and the code host: it
verifies Slack's events, keeps one queue per change, fires one session per wake
with the thread's messages as data, and takes that session's posts and its
landing back.

Everything about the runner that is not in this directory — the Slack app's
scopes, the Routine's settings, every secret and what each one is for, the
push workflow's variables and the first walk — is in
[`docs/references/agent-runner.md`](../../docs/references/agent-runner.md).
Every rule the relay enforces is a requirement of Agent Rounds, in
[the `run-a-round-on-every-artifact` change](../../openspec/changes/run-a-round-on-every-artifact/specs/shared/planning/agent-rounds/spec.md)
until that change archives.

## The Manifest

The Slack app is created from this, and the request URL is verified the moment
the app is saved — so the relay is deployed first.

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

## The Word

`land` and `land with recommendations` are the two words that land, and
nothing else is one. The relay reads the last message of the burst that woke
the run, strips a mention of the app off the front, trims it and folds the
case, so `<@Grade10 Rounds> Land` is the word and `land the proposal please`
is a sentence. A reply that says anything else leaves `main` where it is.

## The Prompt

[`routine-prompt.md`](routine-prompt.md), pasted into the Routine as written.
The prompt never changes per wake; the payload carries everything that does.

## Deploying

```bash
pnpm --dir tools/relay deploy
```

1. **The first deploy** — with the placeholder vars in `wrangler.jsonc`. The
   Durable Object migration `v1` runs here and creates the `Room` class
2. **The Worker's own origin** — printed by that deploy, and the value of
   `RELAY_URL`
3. **The Routine and the Slack app** — created against that origin, which
   gives `ROUTINE_FIRE_URL`, `ROUTINE_TOKEN` and the app's `SLACK_APP_USER`
4. **The second deploy** — with the four vars set to the real values, and
   every secret already put

## Rotating a Secret

`pnpm dlx wrangler@4.120.0 secret put <name> -c wrangler.jsonc`, then the one
holder of the other end — the Slack app, the Routine, the code host, or the
repository secret `AGENT_WAKE_TOKEN` — and rotating `TOKEN_SECRET` cancels
every wake token that is out.

## Changing the State

`RoomState` is written to storage as it stands, so a room already running
reads back the shape it was stored with: a key that changes meaning needs a
default that reads an old room correctly, and `freshRoom` is what a room with
no state at all starts from.

## Not Covered

- **The runner's firing caps** — how many fires an account takes in an hour is
  measured by the first walk, not by anything here
- **A real Slack, Routine or code host** — every test in this package answers
  its own `fetch`; nothing reaches a network
- **The Durable Object runtime** — the tests drive `Room` over a storage map
  and one alarm, so the runtime's own eviction, alarm retries and concurrency
  are not read here
- **The store's scripts** — what a run does with the payload is
  `scripts/openspec/`'s and is tested there
