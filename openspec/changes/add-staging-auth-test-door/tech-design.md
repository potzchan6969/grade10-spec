## Context

The moves this door offers already exist on the disposable `/dev` door in the
auth package, and staging refuses that door on purpose:
`allowsDevEndpoints` in `packages/utils/src/env.ts` allows `development`,
`testing` and `e2e` and nothing else, which
[`docs/architecture/security.md`](https://github.com/9gag/grade10/blob/main/docs/architecture/security.md)
records as deliberate — `POST /dev/login` mints a session for any address at
any role and asks nobody who is calling.

So the work is not the moves. It is a second door beside `/dev` with a lock
`/dev` does not have, and a caller that can prove itself without a secret.
Four pieces of the existing implementation carry over unchanged behind it:
`magicLinkOutbox.ts` (the last mail), `ageSignInLinks` and `banAddress` in
`signInLinkFollow.ts`, and the role write in `devLogin.ts`.

Two facts shape the rest. **Preview runs the production workers** —
`packages/app-env/src/targets.ts` maps preview to `deployEnv: "production"` —
so one staging-only predicate closes preview with no separate rule. And the
outbox is written inside the `sendMagicLink` hook only when
`allowsDevEndpoints(env)`, so on staging there is no last mail to read today.

No schema change. `auth_kv` holds the link and the outbox row; `users` holds
`banned` and `role`.

See [`proposal.md`](proposal.md) for why, and
[`specs/shared/auth/test-sign-in/spec.md`](specs/shared/auth/test-sign-in/spec.md)
for what the door is held to.

## Goals / Non-Goals

**Goals:**

- One lock, verifiable offline by the worker, with no secret that leaks
- The `/dev` predicate untouched, so no deployed environment gains a move
- A staging E2E lane that runs the existing auth specs unedited

**Non-Goals:**

- A shared abstraction over `/dev` and this door. They are two locks on two
  environments; folding them into one predicate is the failure mode this
  change exists to avoid.
- Making the store or auction suites runnable on staging

## Decisions

**A second predicate and a second prefix, never a wider `allowsDevEndpoints`.**
`allowsStagingTestDoor(env)` in `packages/utils/src/env.ts` returns true for
`staging` alone. The routes mount at `/test/*` from a new
`packages/grade10-auth/backend/src/routes/testDoor.ts`, registered from
`app.ts` beside `registerDevRoutes`. Public shape:
`https://api.grade10-stg.com/auth/test/…`. The existing
`describe.each(["production", "staging"])` refusal tests over `/dev` stay
green untouched, which is the regression that matters
(`shared-auth-test-sign-in-SC-13`). *Rejected:* adding `staging` to
`LOCAL_ENVIRONMENTS` behind an extra flag — one predicate then guards two
threat models, and the next `/dev` route added is live on staging by default.

**The caller proves itself with a GitHub Actions OIDC token.** The job requests
a token with `permissions: id-token: write` for a fixed audience; the worker
verifies it against `https://token.actions.githubusercontent.com` and requires
`repository` to be `9gag/grade10`. Nothing to rotate, nothing to leak, and a
fork's token fails the claim (`-SC-01`, `-SC-02`).
[`docs/deployment.md`](https://github.com/9gag/grade10/blob/main/docs/deployment.md)
already treats a staging GitHub secret as readable by anyone with repo write
access, which is what rules out the cheap alternative. *Rejected:* a shared
bearer secret in `secrets.ts` (readable by the population it is meant to
exclude), and Cloudflare Access (it authenticates people, not a job).

**Verification uses `jose`, added as a direct dependency of the auth backend.**
`createRemoteJWKSet` holds the key cache and `jwtVerify` enforces `iss`, `aud`,
`exp` and the algorithm together. It already resolves in the lockfile
transitively, so this adds no new supply-chain surface. *Rejected:* hand-rolled
RS256 over Web Crypto to avoid a dependency — it puts algorithm confusion and
the JWKS cache in our own ~50 lines, on the one code path whose whole job is
to be hard to get past.

**The audience and the repository are constants, not config.** They live beside
the middleware. A widened audience or repository is the one misconfiguration
that opens the door to a stranger, and a constant cannot drift per
environment. The only configuration is the tester list.

**The tester list is one optional secret, and unset means empty.**
`TEST_DOOR_TESTERS` holds `{"collector":…,"banOnly":…,"adminOnly":…}`,
declared **optional** in `apps/backend/grade10/auth/src/secrets.ts`. Optional
is load-bearing twice: a required secret would 503 the whole auth worker on
staging until Ops sets it, and an absent list is exactly the spec's empty list,
so `-SC-04` falls out of the configuration rather than needing a branch. Every
handler resolves its address against the parsed list before touching the
database, and a move naming an address the list does not hold, or naming none,
never reaches a write (`-SC-14`, `-SC-23`). *Rejected:* addresses as wrangler
`vars` — they would sit in the repository inviting mail, and Ops owns them.

**Capture reuses the dev outbox, written on staging for a listed address
only.** The `sendMagicLink` hook in `createAuth.ts` records the outbox when
`allowsDevEndpoints(env)`; the condition becomes that **or** the address is on
the parsed tester list. An unlisted staging address writes no row, so the
capture surface is three addresses wide and the ordinary send path is
otherwise untouched (`-SC-05`). Because the row is keyed per address and
overwritten per send, one tester's mail is never another's and the later send
wins with no ordering code (`-SC-18`, `-SC-19`), and an address with no row
returns no link (`-SC-17`). *Rejected:* a Resend delivery webhook (it does not
give us the link, and it puts a second inbound surface on the worker), and
reconstructing the URL from the `verification:` row in `auth_kv` (the shape
belongs to Better Auth and `brandMagicLinkUrl`, and would drift silently).

**The tester outbox row outlives the link.** `OUTBOX_TTL_SECONDS` is 300
today, the same as `SIGN_IN_LINK_TTL_SECONDS`; a tester row gets 900. The
scenarios that age a link and then read it back, or capture the same send
twice, race a TTL equal to the link's — and what they assert is a property of
the record, not of the link (`-SC-24`, `-SC-27`). *Rejected:* one TTL for
both, which makes those two scenarios flaky rather than wrong.

**A move the door does not offer has no handler.** There is no `/test/login`
returning 403 and no `unban` branch: the router's `notFound` refuses them
(`-SC-09`, `-SC-15`, `-SC-16`). A handler that names a forbidden move is a
switch someone can later turn on; an absent route is not. The assertion in the
tests is that no such route exists and no session cookie comes back.

**Ageing and banning keep their existing semantics, which the scenarios
already match.** `ageSignInLinks` updates `auth_kv` rows keyed `verification:*`
for the address and returns the count: a consumed link's row is already gone,
so a used link cannot be aged and a missing one ages zero, with the count as
the caller's evidence (`-SC-20`, `-SC-21`). `banAddress` sets `banned` alone
and is idempotent (`-SC-26`). Prepare reuses `devLogin.ts`'s create-then-set
path so the admin-only tester need not have signed in first (`-SC-10`,
`-SC-25`).

**The staging lane is a Playwright project plus a door adapter.** `e2e/helpers/auth.ts`
gains one seam — the four moves behind an interface, with a `/dev` implementation
and a `/test` implementation chosen by environment — and a `staging-auth`
project selects `tests/auth/**` against `grade10-stg.com`. The specs
themselves do not change. *Rejected:* a parallel copy of the auth specs
pointed at staging, which doubles every future edit.

**This change qualifies two architecture documents, and says so in them.**
`docs/architecture/security.md` states that dev endpoints stop at the laptop
and that staging answers 403; `docs/architecture/e2e.md` states that the lane
cannot run against a deployed stack. Both stay true of `/dev` and both are now
incomplete. They are edited in this change rather than left to contradict it.

## Service Interfaces

Four processors in `packages/grade10-auth/backend/src/routes/testDoor.ts`,
each behind the same two gates in order: the environment predicate, then the
OIDC verification, then the tester resolution. Every one is a single-statement
write or read on one table, so no processor owns a transaction and none needs
a lock.

| Move | Input | Success | Refusal |
| --- | --- | --- | --- |
| `POST /test/outbox` | `{ email }` | `{ url, body }`, or `{ url: null }` when there is no row | 400 unparseable, 403 not the caller or not on the list |
| `POST /test/age-sign-in-link` | `{ email, seconds }` | `{ aged: <count> }`, zero when there is nothing unused | as above |
| `POST /test/ban-user` | `{ email }` | `{ banned: true }` | as above, and 403 when the address is not the ban-only tester |
| `POST /test/prepare-admin` | `{ email }` | `{ role: "admin" }` | as above, and 403 when the address is not the admin-only tester |

Reads and writes, by move:

| Move | Table | Operation |
| --- | --- | --- |
| Capture | `auth_kv` | read `dev-outbox:<email>` |
| Age | `auth_kv` | update `expires_at` on `verification:*` rows for the address |
| Ban | `users` | set `banned = true` where `email` |
| Prepare | `users` | insert when absent, then set `role = 'admin'` where `email` |

All four are idempotent: capture returns the same row until another send, age
applied twice leaves an already-expired link expired, and ban and prepare are
writes of a fixed value. That is what lets a scenario re-run on the same three
addresses without a reset step.

Identity end to end: the Actions job holds an OIDC token minted for this
audience; the gateway forwards `/auth/test/*` to the staging auth worker
unchanged; the worker verifies the token, resolves the address against the
list, and only then reaches Hyperdrive. No session is issued on any path —
the job signs in by following the captured link through the ordinary
`/magic-link/verify` route, as a collector does (`-SC-22`).

Example, the collector's ordinary sign-in as the job walks it:

```
POST /auth/api/auth/sign-in/magic-link  { email: <collector> }   → 200
POST /auth/test/outbox                  { email: <collector> }   → { url: "https://grade10-stg.com/…", body: "…" }
GET  <url>                                                        → 302 + session cookie
```

## API Contracts

Four new authenticated routes on the staging auth worker, all `POST` under
`/auth/test/`, all requiring `Authorization: Bearer <github-oidc-token>`.
Refusals answer the worker's standard `{ error }` shape with 403; a move the
door does not offer answers the router's 404. No existing endpoint changes
shape. `/dev/*` on staging keeps answering 403.

## Risks / Trade-offs

- **A replayed OIDC token repeats a move** → tokens are short-lived and the
  audience is single-purpose, and every move is idempotent on three fixed
  addresses, so a replay's whole reward is a link the holder already had. A
  `jti` seen-set in `auth_kv` is the escalation if that ever stops being true.
- **The outbox condition is the one edit to the live send path** → it is an
  added disjunct evaluated after the existing one, on staging only, for three
  addresses; a listed address on any other environment behaves as today. The
  backend lane covers a staging send to an unlisted address writing no row.
- **A tester's state leaks between runs — the ban-only tester stays banned,
  the admin-only tester keeps `admin`** → that is the design, and the
  scenarios assert the end state rather than the transition, which is why
  `-SC-25` and `-SC-26` exist. The cost is that the ban-only tester can never
  walk an ordinary sign-in; the collector tester is the one that does.
- **The door's blast radius is three addresses on staging, not zero** → the
  list is the containment, and it is the reason the moves are per-tester
  rather than per-request-body. A caller that gets past the OIDC check can
  still only touch addresses Ops named.
- **`jose` becomes a direct dependency of the auth backend** → it is already
  in the lockfile and maintained for Workers; the trade is against writing
  our own verifier, which is worse.

## Migration Plan

No data migration. Deploy order on staging:

1. Deploy the auth worker with the door mounted and `TEST_DOOR_TESTERS` unset.
   Every move refuses; `/dev` is unchanged. This is a safe resting state.
2. Ops creates the three addresses and sets the secret with
   `pnpm run secrets --env=staging`.
3. Run the `staging-auth` project from the workflow.

Rollback is removing the secret: the list goes empty, every move refuses, and
nothing else on the worker is affected. Removing the routes is the second
step, not the urgent one.

## Open Questions

- Whether the staging lane runs on a schedule or on dispatch only. It changes
  the workflow trigger and nothing else in this design.
