## Context

The actions this endpoint offers already exist on the disposable `/dev` endpoint in the
auth package, and staging refuses that endpoint on purpose:
`allowsDevEndpoints` in `packages/utils/src/env.ts` allows `development`,
`testing` and `e2e` and nothing else, which
[`docs/architecture/security.md`](https://github.com/9gag/grade10/blob/main/docs/architecture/security.md)
records as deliberate — `POST /dev/login` generates a session for any address at
any role and asks nobody who is calling.

So the work is not the actions. It is a second endpoint beside `/dev` with a lock
`/dev` does not have, and a caller that can prove itself without a secret.
Four pieces of the existing implementation carry over behind it:
`magicLinkOutbox.ts`, `ageSignInLinks` and `banAddress` in
`signInLinkFollow.ts`, and the create-then-set-role path in `devLogin.ts`.

Four facts shape the rest, and the first three are why this design is the
second attempt rather than the first.

**Every workflow in the repository proves the same OIDC claim.** A token's
`repository` claim says the run is under `9gag/grade10`; it does not say
which workflow, which ref, or which event. A run a pull request started
proves it too, and that run executes code the pull request wrote.

**Staging rate-limits sign-in twice, and the limiter's own comment names this
lane as the case it breaks.** `assertSignInSendAllowed` caps one address at one
mail per `SIGN_IN_SEND_WINDOW_SECONDS` (60), and better-auth's limiter caps
`/sign-in/magic-link` at 5 per 60 seconds keyed by `cf-connecting-ip`, with
`/magic-link/verify` carrying the plugin's own 5 per 60. Both are on for every
deployed environment. A GitHub runner is one IP for a whole suite, which
`createAuth.ts` describes as "a limit on the suite rather than on anyone".

**The suite generates its own addresses.** `tests/auth/` calls `freshEmail()`
25 times and `prepareDevUser` 21 times, and two cases turn on addresses that
differ only by a plus tag or by letter case. A fixed roster of testers cannot
run them; a tester domain can.

**Preview runs the production workers** — `packages/app-env/src/targets.ts`
maps preview to `deployEnv: "production"`. The test endpoint's predicate reads
`ENVIRONMENT`, which is `"production"` on those workers, so preview is closed
by the same allowlist that closes production rather than by a rule of its own.

The outbox is written inside the `sendMagicLink` hook only when
`allowsDevEndpoints(env)`, so on staging there is no last mail to read today.

No schema change. `auth_kv` holds the link, the outbox row, the send cap and
the rate-limit counters; `users` holds `banned` and `role`.

See [`proposal.md`](proposal.md) for why, and
[`specs/shared/auth/test-sign-in/spec.md`](specs/shared/auth/test-sign-in/spec.md)
for what the test endpoint is held to.

## Goals / Non-Goals

**Goals:**

- A lock that names one workflow, not one repository
- The `/dev` predicate untouched, so no deployed environment gains an action
- A staging lane that runs the existing auth specs with their own addresses
- Every action verifiable without a GitHub-signed token in hand

**Non-Goals:**

- A shared abstraction over `/dev` and this endpoint. They are two locks on two
  environments; folding them into one predicate is the failure mode this
  change exists to avoid.
- Making the store or auction suites runnable on staging
- Removing the tester accounts a run leaves behind

## Decisions

**A second predicate and a second prefix, never a wider `allowsDevEndpoints`.**
`allowsStagingTestDoor(env)` in `packages/utils/src/env.ts` returns true for
`staging` alone. The routes mount at `/test/*` from a new
`packages/grade10-auth/backend/src/routes/testDoor.ts`, registered from
`app.ts` beside `registerDevRoutes`. Public shape:
`https://api.grade10-stg.com/auth/test/…`. The existing
`describe.each(["production", "staging"])` refusal tests over `/dev` stay
green untouched, which is the regression that matters. *Rejected:* adding
`staging` to `LOCAL_ENVIRONMENTS` behind an extra flag — one predicate then
guards two threat models, and the next `/dev` route added is live on staging
by default.

**The access check names one workflow, not one repository.** The workflow requests a
GitHub Actions OIDC token; the worker verifies it against
`https://token.actions.githubusercontent.com` and requires all of:

| Claim | Required value | What it closes |
| --- | --- | --- |
| `repository_id`, `repository_owner_id` | the numeric ids | A rename, transfer, or recreation of the `9gag/grade10` name |
| `job_workflow_ref` | the test endpoint's own workflow at `@refs/heads/main` | A workflow authored on a branch, and any other workflow in the repository |
| `ref` | `refs/heads/main` | A run on any other ref |
| `event_name` | `workflow_dispatch` | `pull_request`, `pull_request_target`, `workflow_run`, `push` |
| `environment` | the test endpoint's GitHub Environment | Turns "has write access" into "a named reviewer approved this run" |

The audience is a routing label and is checked, but it authenticates nothing —
any workflow in any repository can generate a token for any audience, so no claim
above may lean on it. *Rejected:* `repository` alone, which is what the first
draft of this design had; it is true of every workflow in the repository, including
one running code a pull request wrote.

**The token never shares a workflow with pull-request code.** The workflow is two
workflows: one carries `id-token: write`, calls the test endpoint, and checks out nothing
from a pull request; the other runs Playwright with no `id-token` permission.
`ACTIONS_ID_TOKEN_REQUEST_URL` and its token sit in the environment of every
step in a workflow that holds the permission, so workflow separation is the control, not
step ordering. *Rejected:* one workflow on a pull-request label, which is what the
first draft specified and what would have handed a endpoint key to any contributor
who could get a label applied.

**Verification uses `jose`, added as a direct dependency of the auth backend,
behind an injectable seam.** `createRemoteJWKSet` at module scope holds the key
cache across requests in an isolate, and `jwtVerify` enforces issuer, audience,
expiry and `algorithms: ["RS256"]` together. The claims policy above is a
source constant; the issuer and key source are a parameter, so a test can
drive the whole router with a token from a local key pair. That is a
testability seam, not a configuration surface — the deployed worker constructs
it one way. *Rejected:* hand-rolled RS256 over Web Crypto (it puts algorithm
confusion and the JWKS cache in our own code, on the one path whose workflow is to
be hard to get past), and pinning the issuer as a constant too, which would
make the happy path unverifiable anywhere.

**The subjects are a tester domain, not a roster.** `TEST_DOOR_TESTER_DOMAIN`
holds one domain, declared **optional** in
`apps/backend/grade10/auth/src/secrets.ts`. An address belongs when the part
after its last `@`, lowercased, equals that domain exactly — a suffix match
would admit `evil-test.grade10-stg.com`. Optional does two things: a required
secret would 503 the whole auth worker on staging until Ops sets it, and an
absent domain is the spec's empty subject set, so that refusal comes from the
configuration rather than from a branch. A value that does
not parse as a bare domain is treated as unset and logged loudly, so a typo
fails closed too. *Rejected:* a roster of three fixed addresses, which
was the first draft; it cannot run a suite that generates its own addresses, it
collides with the per-address send cap, and it needs an unban this endpoint
refuses to offer. Its cost was unbounded staging accounts, which is now a
cleanup nobody has specified rather than a reason to refuse.

**Capture reuses the dev outbox, written on staging for a tester address
only.** The `sendMagicLink` hook records the outbox when
`allowsDevEndpoints(env)` **or** the address is under the tester domain. An
address outside it writes no row, so the capture surface is one domain wide
and the ordinary send path is otherwise untouched. The row is keyed per
address and overwritten per send, so one address's mail is never another's,
the later send wins with no ordering code, and an address with no row returns
no link. *Rejected:* a Resend delivery webhook (it does not give us the link,
and it puts a second inbound surface on the worker), and reconstructing the
URL from the `verification:` row in `auth_kv` (the shape belongs to Better
Auth and `brandMagicLinkUrl`, and would drift silently).

**The tester outbox row outlives the link.** `OUTBOX_TTL_SECONDS` is 300
today, the same as `SIGN_IN_LINK_TTL_SECONDS`; a tester row gets 900. A
scenario that expires a link and then reads it back, or captures the same send
twice, otherwise races a TTL equal to the link's — and what it asserts is a
property of the record, not of the link. Fifteen minutes is a product-visible
bound, because a capture after it answers nothing, so it is on the PRD's
values table as well as here. *Rejected:* one TTL for both, which makes those
scenarios flaky rather than wrong.

**Clearing the limits is an action, not an exception inside the limiter.** Both
counters live in `auth_kv`, so the action is two deletes: the send cap at
`verification:signin-send:<email>` for the named address, and the caller's
counters at `rate-limit:<cf-connecting-ip>|%`, which is the same IP the
suite's own sends are counted against. The limiter keeps one behaviour for
everybody and the exception is a thing the test endpoint does, on the record, under the
same lock as every other action. *Rejected:* exempting tester traffic inside
`assertSignInSendAllowed` and better-auth's `customRules`, which puts a
branch on the live sign-in path that no test on this endpoint would cover; and
waiting out the wall clock, which is over half an hour a run.

**Ban and grant create the account.** `banAddress` returns `false` when no
`users` row exists, and on a fresh staging database that is the first thing the
lane hits. Both actions go through one `ensureTesterAccount(db, email)` that
creates the row at the default role when absent — the create half of
`prepareDevUser` — and then apply their own state. *Rejected:* refusing a ban
on an unseen address, which would make every run sign in before it could ban,
and would make the refusal indistinguishable from an off-domain one.

**An action the test endpoint does not offer has no handler.** There is no `/test/login`
returning 403 and no `unban` branch: the router's `notFound` answers 404. A
named handler is code somebody can later enable; an absent route is not there
to enable. A run that needs an unbanned address generates one, so the unban
refusal costs nothing.

**Expiring gains a key predicate.** `ageSignInLinks` and
`invalidateEarlierSignInMail` both `select()` all of `auth_kv` and filter in
the worker, so every verification value — other collectors' addresses among
them — crosses Hyperdrive on each call. Staging's table is small, so this is
not a performance fix; it is that this change is what first puts that read
behind a remotely callable route. Both gain `key LIKE 'verification:%'`.

**The staging lane is its own Playwright config.** `webServer` is
config-level, not project-level, and the existing config boots the local
Docker stack unconditionally and throws at import time when the run-scoped
origins are absent. So `playwright.staging.config.ts` sits beside it with no
`webServer`, resolving origins from `@grade10/app-env` for the staging target.
The specs are shared; only the config and the test endpoint implementation differ.

**The test endpoint adapter refuses a target that is not staging.** The `/test`
implementation asserts its base URL is the staging gateway before its first
call. A configuration is editable, and a spec that signs in must not be
pointable at production by a one-line mistake. The adapter's assertion is the
control; the config file being correct is not.

**The two endpoints answer differently, and the adapter normalises.** `/dev`
answers 404 for an absent outbox, an absent link and an absent user; `/test`
answers 200 with `{ url: null }` and `{ expired: 0 }`, because a count is what
the scenarios assert. The seam in `e2e/helpers/auth.ts` normalises both sides
to one shape so a spec reads the same against either. *Rejected:* changing
`/dev` to match, which edits a working local lane to serve a new one.

**The browser presents a Cloudflare Access service token; the test endpoint does not
need one.** `grade10-stg.com` sits behind Access — `docs/temp/ops.md` records
the staging apex as gated, and carries an open carve-out for
`storybook.grade10-stg.com` for the same reason — so a browser driving the
staging site is answered by Access's login page. The project sends
`CF-Access-Client-Id` and `CF-Access-Client-Secret` from a service-token
policy scoped to that host. `api.grade10-stg.com` is already confirmed
ungated, which is why the test endpoint's own calls carry only the OIDC token.
*Rejected:* a bypass policy on the staging apex, which un-gates the site for
everyone to serve one workflow.

**This change qualifies two architecture documents, and says so in them.**
`docs/architecture/security.md` states that dev endpoints stop at the laptop
and that staging answers 403; `docs/architecture/e2e.md` states that the lane
cannot run against a deployed stack. Both stay true of `/dev` and both are now
incomplete.

## Service Interfaces

Five processors in `packages/grade10-auth/backend/src/routes/testDoor.ts`,
each behind the same gates in order: the environment predicate, the OIDC
verification, then the domain check. Every one is a single-statement write or
read on one table, so no processor owns a transaction and none needs a lock.

| Action | Input | Success | Refusal |
| --- | --- | --- | --- |
| `POST /test/outbox` | `{ email }` | `{ url, body }`, or `{ url: null }` when there is no row | 400 unparseable, 403 not the caller or off-domain |
| `POST /test/expire-sign-in-link` | `{ email }` | `{ expired: <count> }`, zero when there is nothing unused | as above |
| `POST /test/ban-user` | `{ email }` | `{ banned: true }`, the account created when absent | as above |
| `POST /test/grant-admin` | `{ email }` | `{ role: "admin" }`, the account created when absent | as above |
| `POST /test/clear-limits` | `{ email }` | `{ cleared: { sendCap: <count>, rateLimit: <count> } }` | as above |

Reads and writes, by action:

| Action | Table | Operation |
| --- | --- | --- |
| Capture | `auth_kv` | read `dev-outbox:<email>` |
| Expire | `auth_kv` | update `expires_at` on `verification:*` rows for the address |
| Ban | `users` | insert when absent, then set `banned = true` |
| Grant | `users` | insert when absent, then set `role = 'admin'` |
| Clear | `auth_kv` | delete `verification:signin-send:<email>` and `rate-limit:<caller-ip>|%` |

All five are idempotent, and with a per-run address the question barely
arises: capture returns the same row until another send, expire applied twice
leaves an expired link expired, ban and grant write a fixed value, and
clearing an already-clear counter deletes nothing and answers zero.

Expire takes `{ email }` only. The handler applies a fixed offset past
`SIGN_IN_LINK_TTL_SECONDS`. *Rejected:* a caller-supplied `seconds`, which
would let a caller expire by one second or by a day, and which the spec does
not grant.

Identity end to end: the workflow holds an OIDC token generated for this audience by
the test endpoint's own workflow on a reviewed dispatch; the gateway forwards
`/auth/test/*` to the staging auth worker unchanged; the worker verifies every
claim in the table above, checks the address's domain, and only then reaches
Hyperdrive. No session is issued on any path — the workflow signs in by following
the captured link through the ordinary `/magic-link/verify` route, as a
collector does.

Example, one sign-in as the lane walks it:

```
POST /auth/test/clear-limits            { email: <tester> }      → { cleared: … }
POST /auth/api/auth/sign-in/magic-link  { email: <tester> }      → 200
POST /auth/test/outbox                  { email: <tester> }      → { url: "https://grade10-stg.com/…", body: "…" }
GET  <url>                                                        → 302 + session cookie
```

## API Contracts

Five new routes on the staging auth worker, all `POST` under `/auth/test/`,
all requiring `Authorization: Bearer <github-oidc-token>`. Refusals answer the
worker's standard `{ error }` shape with 403; an action the test endpoint does not offer
answers the router's 404. No existing endpoint changes shape. `/dev/*` on
staging keeps answering 403.

## Risks / Trade-offs

- **Clearing the rate limit is a real weakening of a real control** → it is
  reachable only behind the full claim set, only on staging, and it clears the
  calling IP's own counters rather than anyone's. The limiter is unchanged for
  every other caller, and the action is on the record where an exemption buried
  in `customRules` would not be.
- **Tester accounts accumulate on staging** → that is the cost of reversing
  the roster decision, and nobody has specified the cleanup. It is an open
  question rather than a mitigation, and it grows at roughly one account per
  test per run.
- **The tester domain receives real mail with no human reading it** → Ops
  gives it a catch-all so nothing bounces, which keeps the sender reputation
  Resend prices. A domain with no catch-all turns every run into 25 bounces.
- **A replayed OIDC token repeats an action** → tokens are short-lived, the claim
  set narrows the generating surface to one reviewed workflow, and every action is
  idempotent on an address the replayer would have to guess. A `jti` seen-set
  in `auth_kv` is the next control if that stops being true.
- **The outbox condition is the one edit to the live send path** → an added
  disjunct evaluated after the existing one, on staging only, for one domain.
  The backend lane covers a staging send to an off-domain address writing no
  row.
- **`jose` becomes a direct dependency of the auth backend** → it is already
  in the lockfile and maintained for Workers; the trade is against writing our
  own verifier, which is worse.
- **JWKS unreachable closes the test endpoint** → the correct direction, and it answers
  503 rather than throwing, so a red lane reads as infrastructure rather than
  as a refusal.

## Migration Plan

No data migration. Deploy order on staging:

1. Deploy the auth worker with the test endpoint mounted and `TEST_DOOR_TESTER_DOMAIN`
   unset. Every action refuses; `/dev` is unchanged. This is a safe resting
   state.
2. Ops names the tester domain, gives it a catch-all inbox, sets the secret
   with `pnpm run secrets --env=staging`, creates the GitHub Environment with
   its reviewers, and issues the Access service token for the staging apex.
3. Dispatch the lane.

Rollback is removing the secret: the domain goes empty, every action refuses,
and nothing else on the worker is affected. Removing the routes is the second
step, not the urgent one.

## Open Questions

- How old a tester account gets before it is removed, and what does the
  removing. It changes nothing above; it is the bill this design's subject
  model runs up.
- Which Access service-token policy the lane uses, and whether one already
  exists for the staging apex. `docs/temp/ops.md` tracks the zone's carve-outs.
