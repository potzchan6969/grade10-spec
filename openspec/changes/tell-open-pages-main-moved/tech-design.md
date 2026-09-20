Drawn from [Change Stages · Surfaces](../../../docs/prds/products/shared/planning/change-stages.md#surfaces), the proposal and the journeys, before the requirements. The requirements pass reads it; the reconciliation re-reads it.

## Context

- **The hosted manual is a static snapshot.** `tools/manual/src/store/build-snapshot.mts` writes `dist/api/snapshot`, `dist/api/archive` and one file per change and reference; `SnapshotFooter` names `snapshot.storeHead`, the commit the build read. `manual.yml` rebuilds and redeploys on every push to `main` that touches the paths it watches.
- **The dev server serves the same shapes from disk.** `storeEndpoints` in `tools/manual/src/store/vite-plugin.mts` answers `/api/snapshot`, `/api/change/<id>`, `/api/propose`, `/api/hands` and the rest behind one path allowlist, so a new endpoint is one branch there and one file in the build.
- **The relay is one Worker with one Durable Object.** `tools/relay/src/worker.ts` routes `/slack/events`, `/wake` and `/runs/<token>/<op>`, refuses every request while one of the seven secrets is unset (`missingSecret`), and answers 405 to anything but POST except `/runs/<token>/alive`. `Room` is the only Durable Object class, created by migration `v1`.
- **The signature work already exists.** `hmacSha256`, `fromHex` and `equalBytes` in `src/bytes.ts` verify Slack's v0 signature in `src/slack.ts`; the code host's `x-hub-signature-256` is the same HMAC over the raw body with a different prefix.
- **Nothing in the store watches `main`.** No workflow, no endpoint and no page compares a checkout or a snapshot with `origin/main`.

## Goals / Non-Goals

**Goals:**

- One head, held by the relay, read the same way by every open page
- A page that says it is behind at once and refreshes itself only when the site can show what landed
- A locally run manual that reads its own distance from `main` and fast-forwards on one click
- Every leg off by default: no relay URL, no banner, and the manual reads as it does today

**Non-Goals:**

- A socket per change, per page or per reader beyond the one the shell opens
- Serving the store's data live: the snapshot is still built by the deploy
- Any write to the store from the hosted site
- A merge, a rebase or a stash on the teammate's behalf

## Decisions

The page governs what a reader is told; these are how that lands.

- **The head comes from the code host's push webhook.** `POST /github/events` on the relay: the raw body is read once, `x-hub-signature-256` is verified as `sha256=<hex>` against `GITHUB_WEBHOOK_SECRET` with `hmacSha256` and `equalBytes`, and an unsigned or wrongly signed body answers 401 without reaching a Durable Object. The handler reads `ref`, `after`, `repository.full_name`, `head_commit.timestamp` and the first line of `head_commit.message`; anything but `refs/heads/main` of `REPO` answers 200 and is dropped, so a branch push, a tag and another repository cost one HMAC and nothing else. Rejected: the browser polling the code host, which needs a token in the page and rate-limits per reader; a poll of the deployed snapshot alone, which cannot name what landed until the deploy is done (decisions Q1).
- **`GITHUB_WEBHOOK_SECRET` is the eighth required secret.** Added to `Env` and to `REQUIRED_SECRETS`, so a relay deployed without it answers `{"reason":"missing-secret","secret":"GITHUB_WEBHOOK_SECRET"}` with 500 and names itself, as the other seven do. Rejected: verifying the webhook only when the secret is set, which turns a missing secret into an open endpoint.
- **One `Live` Durable Object holds the head.** Binding `LIVE`, class `Live`, migration `v2` with `new_sqlite_classes: ["Live"]`, addressed as `idFromName("main")` - one object for the store, because there is one `main`. It stores `{ main, at, subject }`: the head sha, the ISO timestamp the push carried, and the commit's subject line. A push writes that record and broadcasts it to every socket; writing the same sha twice broadcasts once, because the set is compared before it is stored. Rejected: a room per change, which would make a reader on the board open one socket per card.
- **Sockets hibernate.** `GET /live` upgrades through `ctx.acceptWebSocket(server)` and sends the stored record on accept, so a page that connects after the push still learns the head; a move calls `getWebSockets()` and sends the same JSON to each. Hibernation is what makes an idle open tab free - the object is evicted between pushes and the socket survives it - and it is why no per-socket state is kept beyond what the accept tags carry. A socket that fails to send is closed and dropped.
- **`GET /head` is the fallback and the smoke test.** It answers the same JSON with `access-control-allow-origin: *`, because the hosted manual is served from another origin and the record says nothing private: a commit sha and a subject line already on `main`. The router's method gate gains the two GET routes beside `/runs/<token>/alive`. Rejected: a signed read, which would put a credential in a static page.
- **The relay's origin reaches the browser as data, never as a build constant.** `GET /api/live` answers `{ relay?: string }`: the dev server reads `process.env.RELAY_URL`, and the build writes `dist/api/live` from `RELAY_URL` in the environment. An absent or empty value answers `{}`, `useMainHead` opens nothing, and no banner is ever shown - which is the off switch Operations holds without a revert (decisions Q3). Rejected: baking the origin into the bundle, which puts a deploy-time value into a file the hosted site serves.
- **`useMainHead()` is one hook in `src/api/head.ts`.** It reads `/api/live` once, opens `wss://<relay>/live` when there is a relay, and falls back to polling `GET /head` every 60 s when the socket cannot be opened or is closed. It returns the record it holds and nothing else; the comparison is the banner's. `src/api/live.ts` keeps its one export, `STORE_CHANGED`, which is the dev server's HMR event and unrelated.
- **Behind is `main !== snapshot.storeHead`.** The banner shows as soon as the two differ, naming the subject and the age from the record. While behind, the shell polls `GET /api/head` - `{ storeHead }`, answered by the dev plugin from the checkout and by `dist/api/head` from the build - every 30 s, and calls the snapshot provider's reload when the value changes. Never `location.reload()`: the reload is the provider's own fetch, so the reader keeps their scroll position, their open sections and anything typed. Rejected: refreshing on the webhook, which serves the reader the same page again because the site has not rebuilt yet (decisions Q2).
- **Nothing is reloaded under a reader who is typing.** The reload is held while `document.activeElement` is a text field, a text area or a `contenteditable` - any of them, wherever it sits - and taken the moment focus leaves; the banner stays up meanwhile, so the reader knows why the page has not moved (decisions Q8). Rejected: reloading anyway and restoring the draft, which needs the editor's state in the shell.
- **The hosted site rebuilds on every push to `main`.** `manual.yml` loses its `paths:` filter: the banner says the site rebuilds and refreshes on its own, and a filtered deploy makes that false on every push that touches none of the watched paths - `tools/relay/**` and `scripts/openspec/**` among them - leaving the banner up until an unrelated push happens to touch one (decisions Q7). `workflow_dispatch` and the `manual-staging` concurrency group with `cancel-in-progress` stay, so a burst of pushes still deploys once. Rejected: filtering the webhook by the paths the manual renders, which puts the manual's path list inside the relay and drifts the day either moves.
- **The locally run manual reads git, not the relay.** `GET /api/upstream` in the dev server's endpoints: `git fetch origin main` at most once every 60 s - the last fetch's time is held in the plugin's own memory - then `git rev-list --left-right --count HEAD...origin/main` for the pair of counts and `git status --porcelain` for whether the tree is dirty, answering `{ behind, ahead, dirty, fetchedAt }`. A checkout with no `origin` has nothing to count against and answers no counts at all, so no banner is shown; a fetch that fails answers the counts it last read with the `fetchedAt` that goes with them (decisions Q6). Rejected: a fetch per request, which spends a network call on every render (decisions Q4).
- **Pull is `--ff-only`, and refuses rather than decides.** `POST /api/pull` runs `git pull --ff-only origin main` behind the same confinement as `/api/propose`, and answers 409 `{ reason }` when the tree is dirty or the checkout is ahead - the two states a fast-forward cannot answer for - so nothing of the teammate's work is stashed, merged or rebased by the manual. A fast-forward that git itself refuses answers 409 with what git said.
- **`manual.yml` passes `RELAY_URL` as a repository variable.** `RELAY_URL: ${{ vars.RELAY_URL }}` on the build step alone, not a secret: the value is a public origin the page has to hold anyway, and a secret would be masked out of the file the build writes. Unset is the off state, and the deploy is unchanged otherwise.

## Service Interfaces

Not a service. The contracts that cross a boundary:

| Contract | Input | Output |
| --- | --- | --- |
| `POST /github/events` (relay) | The push event's raw body and `x-hub-signature-256` | 200 with an empty body once the head is stored, or dropped; 401 on a bad signature; 400 on a body that is not the push shape |
| `GET /head` (relay) | Nothing | `{ main, at, subject }`, or `{}` before the first push, with `access-control-allow-origin: *` |
| `GET /live` (relay) | A WebSocket upgrade | The stored record on accept, then the same JSON on every move |
| `Live` (Durable Object) | `idFromName("main")`; the push's fields | The stored record, and one broadcast per new sha |
| `GET /api/live` (manual) | Nothing | `{ relay }` where the build or the dev server has one, else `{}` |
| `GET /api/head` (manual) | Nothing | `{ storeHead }`: the commit the served snapshot was built from |
| `GET /api/upstream` (manual, dev server only) | Nothing | `{ behind, ahead, dirty, fetchedAt }`; `behind` and `ahead` are the counts against `origin/main` and `fetchedAt` the last fetch's time; a checkout with no remote answers `{ dirty }` alone |
| `POST /api/pull` (manual, dev server only) | Nothing | 200 with `{ behind: 0 }` once the fast-forward lands; 409 `{ reason }` on a dirty tree, a checkout ahead, or a fast-forward git refuses |
| `useMainHead()` (manual) | Nothing | The relay's record, or nothing at all where there is no relay |

The record, as the socket and `GET /head` both send it:

```json
{
  "main": "8f2c1d0e5a7b9c3d4e6f8a1b2c3d4e5f60718293",
  "at": "2026-09-20T04:11:07Z",
  "subject": "docs(planning): land the requirements of tell-open-pages-main-moved"
}
```

## Risks / Trade-offs

- [The code host replays a delivery, or sends the same push twice] → the object compares the sha before it stores it, so a replay writes nothing and broadcasts nothing; the set is idempotent by the same reading the Slack envelope's is
- [A busy `main` floods every open page] → one broadcast per push, not per commit, and the payload is three fields; a reader behind by ten pushes has been told ten times and reloads once, when the deploy catches up
- [The relay is down while `main` moves] → no banner, and the manual reads as it does today; the page is stale and silent rather than wrong
- [A reader sits on the banner for an hour] → the 30 s poll of `GET /api/head` is what ends it, not the socket, so a socket that died unnoticed still lets the page catch up
- [Pull lands on a checkout somebody else is building in] → `--ff-only` and the dirty refusal: nothing is pulled over uncommitted work, and the reason names it
- [`RELAY_URL` is set to the wrong origin] → the page opens a socket that never answers, falls back to the poll, gets nothing, and shows no banner; nothing else on the page depends on it
- [Deploying on every push to `main` costs more runs] → the `manual-staging` concurrency group with `cancel-in-progress` collapses a burst into one deploy, and the build is the one the watched paths already ran

## Migration Plan

1. The relay: the eighth secret, `POST /github/events`, the `Live` class and migration `v2`, `GET /head` and `GET /live`. Deployed with no webhook registered, it holds no head and answers `{}`; nothing else in the relay changes.
2. Operations registers the push webhook and sets `GITHUB_WEBHOOK_SECRET`. `curl "$RELAY_URL/head"` after the next push to `main` is the smoke test: the sha it answers is `main`.
3. The manual's hosted half: `/api/live`, `/api/head`, `useMainHead` and the banner, with `RELAY_URL` still unset. Nothing appears until Operations sets the variable, so this step ships dark.
4. `RELAY_URL` on the repository variables, `manual.yml` passing it to the build step, and the workflow's `paths:` filter dropped. Rollback for the whole hosted half is deleting that variable.
5. The locally run manual's half: `/api/upstream`, `/api/pull` and the banner's local variant. It needs neither the relay nor the variable.

## Open Questions

- Whether the `Live` object should also hold the last deployed snapshot's head, so the page could be told the site has caught up rather than polling for it. It would need the deploy to post back to the relay, which is the deploy's change, not this one; the 30 s poll answers the same question with nothing new deployed.
