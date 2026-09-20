# Relay

The relay sits between the Slack app, the hosted runner and the code host: it
verifies Slack's events, keeps one queue per change, fires one session per wake
with the thread's messages as data, takes that session's posts and its landing
back, and tells every open manual page when `main` moves.

Everything about the runner that is not in this directory — the Slack app's
[scopes and event subscription](../../docs/references/agent-runner.md#the-slack-app),
the Routine's settings, every secret and what each one is for, the push
workflow's variables and the first walk — is in
[`docs/references/agent-runner.md`](../../docs/references/agent-runner.md).
Every rule the relay enforces is a requirement of Agent Rounds, in
[the `run-a-round-on-every-artifact` change](../../openspec/changes/run-a-round-on-every-artifact/specs/shared/planning/agent-rounds/spec.md)
until that change archives.

## The Word

`land` and `land with recommendations` are the two words that land, and
nothing else is one. The relay reads the latest landing word of the burst that
woke the run — a mention of the app stripped off the front, the ends trimmed,
the case folded — so `<@Grade10 Rounds> Land` is the word and `land the
proposal please` is a sentence. A landing word wakes the run at once; every
other reply waits a minute for the rest of the burst, because nothing more is
coming after `land`. The room keeps that word until the run it
woke says it is done: `land` and then `thanks!` still lands, one word lands
every artifact of the chain, and a chain the budget cut halfway is finished by
the next wake on the same word. A thread that has said
no landing word leaves `main` where it is.

## The Prompt

[`routine-prompt.md`](routine-prompt.md), pasted into the Routine as written.
The prompt never changes per wake; the payload carries everything that does.

## The Live Line

One Durable Object, named `main`, holds where `main` is and every open page's
socket. `POST /github/events` is the code host's push webhook, and a push of
this store's `main` is the only delivery that reaches the object; every other
one is answered with the reason it told nobody. A page reads the head two ways:
`GET /live` upgrades a socket, which is sent the head on accept and again on
every move, and `GET /head` answers the same shape to a page that is polling.
Both read from any origin and are cached nowhere.

## Deploying

```bash
pnpm --dir tools/relay deploy
```

In this order, because each step needs the one before it:

1. **The Slack app**, created with no request URL — its event subscription is
   pointed at the relay in step 4, and Slack verifies that URL the moment it
   is saved. This gives `SLACK_SIGNING_SECRET`, `SLACK_BOT_TOKEN` and the
   app's own member id for `SLACK_APP_USER`
2. **The secrets**, each with `pnpm dlx wrangler@4.120.0 secret put <name> -c
   wrangler.jsonc`: the app's two, `GITHUB_TOKEN`, `TOKEN_SECRET`,
   `WAKE_TOKEN`, `GITHUB_WEBHOOK_SECRET` — any long random string, the same
   one the webhook is given in step 6 — and `ROUTINE_FIRE_URL` and
   `ROUTINE_TOKEN` as placeholders until step 5: the router refuses every
   request while one of the eight is unset, and names it
3. **The first deploy**, with the placeholder vars in `wrangler.jsonc`. The
   Durable Object migrations `v1` and `v2` run here and create the `Room` and
   `Live` classes, and the deploy prints the Worker's own origin
4. **The event subscription**, pointed at `<origin>/slack/events` and saved:
   the relay answers Slack's `url_verification` challenge, and the bot is
   invited to the planning channel
5. **The Routine**, created against that origin, which gives the real
   `ROUTINE_FIRE_URL` and `ROUTINE_TOKEN` — put both again over their
   placeholders
6. **The code host's webhook**, on the store's repository under `Settings →
   Webhooks`: payload URL `<origin>/github/events`, content type
   `application/json`, the secret from step 2, and the `push` event alone —
   not every event. Saving it sends a `ping`, and `{"pong":true}` under Recent
   Deliveries is this leg's smoke test: the relay answers a delivery the
   secret signs, and 401 to one it does not
7. **The second deploy**, with `PLANNING_CHANNEL`, `REPO`, `RELAY_URL` and
   `SLACK_APP_USER` set to the real values in `wrangler.jsonc`

Then one call, which is the smoke test:

```bash
curl -s -X POST "$RELAY_URL/wake" \
  -H "authorization: Bearer $WAKE_TOKEN" \
  -H 'content-type: application/json' \
  -d '{"change":"relay-smoke","head":"0000000000000000000000000000000000000000"}'
```

`{"queued":true}` proves three things at once: the origin is this relay, since
nothing else serves `/wake`; every secret is set, since the router answers
`{"reason":"missing-secret","secret":"…"}` with 500 while one is not; and the
migration ran, since the wake reached a room. Repeat the same call and
`{"queued":false,"why":"duplicate"}` proves the room kept what it answered.

It costs one firing: the room fires a session on a change the store does not
hold, which answers in the planning channel and ends. A wrong `WAKE_TOKEN`
answers 401, and a body with no `head` answers 400 without reaching a room.

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
  and one alarm, and `Live` over a storage map and a list of sockets, so the
  runtime's own eviction, alarm retries, concurrency and the hibernation that
  wakes an object with a socket on it are not read here
- **The store's scripts** — what a run does with the payload is
  `scripts/openspec/`'s and is tested there
