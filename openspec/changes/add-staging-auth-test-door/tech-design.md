## Context

The actions this endpoint offers already exist on the disposable `/dev` endpoint in the
auth package, and the hosted stacks refuse that endpoint on purpose:
`allowsDevEndpoints` in `packages/utils/src/env.ts` allows `development`,
`testing` and `e2e` and nothing else, which
[`docs/architecture/security.md`](https://github.com/9gag/grade10/blob/main/docs/architecture/security.md)
records as deliberate — `POST /dev/login` generates a session for any address at
any role and asks nobody who is calling.

So the work is not the actions. It is a second endpoint beside `/dev` with an
access check `/dev` does not have. Four pieces of the existing implementation carry
over behind it: `magicLinkOutbox.ts`, `ageSignInLinks` and `banAddress` in
`signInLinkFollow.ts`, and the create-then-set-role path in `devLogin.ts`.

Four facts shape the rest.

**Every workflow in the repository proves the same OIDC claim.** A token's
`repository` claim says the run is under `9gag/grade10`; it does not say
which workflow, which ref, or which event. A run a pull request started
proves it too, and that run executes code the pull request wrote.

**The hosted stacks rate-limit sign-in twice.** `assertSignInSendAllowed` caps
one address at one mail per `SIGN_IN_SEND_WINDOW_SECONDS` (60), and
better-auth's limiter caps `/sign-in/magic-link` at 5 per 60 seconds keyed by
`cf-connecting-ip`. A GitHub runner is one IP for a whole suite, which
`createAuth.ts` describes as "a limit on the suite rather than on anyone".

**A QA agent walking a manual pass has no OIDC token.** It runs outside GitHub
Actions, so the workflow's check cannot admit it. Q38 and Q39 give it a
second, narrower way in.

**Preview runs the production workers** — `packages/app-env/src/targets.ts`
maps preview to `deployEnv: "production"`. The endpoint reads `ENVIRONMENT`,
which is `"production"` on those workers, so preview answers exactly as
production does, with no rule of its own.

No schema change. `auth_kv` holds the link, the outbox row, the send cap and
the rate-limit counters; `users` holds `banned` and `role`; `audit_logs` holds
the trail.

See [`proposal.md`](proposal.md) for why, and
[`specs/shared/auth/test-sign-in/spec.md`](specs/shared/auth/test-sign-in/spec.md)
and [`specs/shared/auth/audit/spec.md`](specs/shared/auth/audit/spec.md) for
what the endpoint is held to.

## Goals / Non-Goals

**Goals:**

- An access check that names one workflow, not one repository
- A QA token that reaches capture, expire and clear on staging, and nothing else
- The `/dev` predicate untouched, so no hosted stack gains `/dev`
- Capture and clear on production and preview, for production's named
  testers, so a smoke test can sign in there
- Every endpoint write on the identity trail
- Every action verifiable without a GitHub-signed token in hand

**Non-Goals:**

- A shared abstraction over `/dev` and this endpoint. They are two checks with
  two threat models; folding them into one predicate is the failure mode this
  change exists to avoid
- Ban, grant or a scoped role on production or preview
- The QA token anywhere but staging
- Making the store or auction suites runnable on the hosted stacks

## Decisions

**Each environment mounts its own set of actions, never a wider
`allowsDevEndpoints`.** `testDoorMoves(env)` in `packages/utils/src/env.ts`
returns all six actions on `staging` and `uat`, `outbox` and `clear-limits` on
`production`, and none elsewhere. The routes mount at `/test/*` from
`packages/grade10-auth/backend/src/routes/testDoor.ts`, registered from
`app.ts` beside `registerDevRoutes`, and `testDoorOnly` answers 404 for an
action the environment does not mount. The existing refusal tests over `/dev`
on production and staging stay green untouched. *Rejected:* adding staging to
`LOCAL_ENVIRONMENTS` behind a flag — one predicate then guards two threat
models, and the next `/dev` route added is live on staging by default.

**The workflow's access check names one workflow, not one repository.** The
workflow requests a GitHub Actions OIDC token; the worker verifies it against
`https://token.actions.githubusercontent.com` and requires all of:

| Claim | Required value | What it closes |
| --- | --- | --- |
| `repository_id`, `repository_owner_id` | the numeric ids | A rename, transfer, or recreation of the `9gag/grade10` name |
| `job_workflow_ref` | the endpoint's own workflow at `@refs/heads/main` | A workflow authored on a branch, and any other workflow in the repository |
| `ref` | `refs/heads/main` | A run on any other ref |
| `event_name` | `workflow_dispatch` | `pull_request`, `pull_request_target`, `workflow_run`, `push` |
| `environment` | the endpoint's GitHub Environment for that stack | Turns "has write access" into "a named reviewer approved this run" |

The audience is a routing label and is checked, but it authenticates nothing —
any workflow in any repository can generate a token for any audience, so no claim
above leans on it. *Rejected:* `repository` alone, which is true of every
workflow in the repository, including one running code a pull request wrote.

**The QA token is a second check, narrower than the first.**
`testDoorQaTokenOr` runs before the OIDC check: a call carrying
`x-grade10-qa-token` equal to `STAGING_QA_TOKEN` in
`packages/app-env/src/testDoorQaToken.ts` is admitted for
`qaTokenTestDoorMoves(env)` alone — `outbox`, `age-sign-in-link` and
`clear-limits` on `staging`, and nothing anywhere else. Any other call falls
through to the OIDC check, so a wrong token is refused as any wrong caller is.
The token is committed and public by Q39; a commit rotates it. *Rejected:* a
token in the environment's secrets, which is safer and costs every agent a
setup step (Q39).

**The QA token never reaches the admin-only tester (task 2.6).** Today the
token's address check is `isTesterMailbox`, which admits the admin-only tester
and its plus-tags. The token's path gains one more check: an address that
folds to the admin-only tester, or to a plus-tag of it, is refused with the
same answer as any wrong caller, so the refusal names no rule (Q43). The
workflow's path is unchanged.

**The subjects are named testers, not a domain.** `grade10TestDoorEmails` in
`@grade10/auth-contracts` names four testers on staging and four on uat — a
collector, a plus-tag sibling, a ban-only and an admin-only address — and the
collector alone on production. Being in code makes each tester easy to
identify, and a new one is a commit (Q40, Q41). `isTesterEmail` admits a named
tester and, where the set names a plus-tag sibling, a unique plus-tag of the
collector; `isTesterMailbox` adds a unique plus-tag of any named tester for
capture, expire and clear. Production names no plus-tag sibling, so it admits
no plus-tag. *Rejected:* a tester-domain secret, the first draft, which nobody
named and which left the endpoint with no subjects (Q40).

**Capture reuses the dev outbox, written for a tester address only.** The
`sendMagicLink` hook records the outbox when `allowsDevEndpoints(env)` or the
address is a tester of that environment. Any other address writes no row, so
the ordinary send path is otherwise untouched. The row is keyed per address and
overwritten per send, so the later send wins with no ordering code, and an
address with no row returns no link. A tester row is held 900 seconds, so a
scenario that expires a link and reads it back does not race the link's own
300.

**Clearing the limits is an action, not an exception inside the limiter.** The
action deletes the send cap at `verification:signin-send:<email>` for the named
address, and the caller's counters at `rate-limit:<cf-connecting-ip>|%`. The
limiter keeps one behaviour for everybody. *Rejected:* exempting tester
traffic inside `assertSignInSendAllowed`, which puts a branch on the live
sign-in path that no test on this endpoint covers.

**Ban and grant create the account.** `banAddress` returns `false` when no
`users` row exists, and a fresh plus-tag has none. Ban, grant `admin` and the
scoped role go through `ensureTesterAccount`, which creates the row at the
default role when absent, then apply their own state. *Rejected:* refusing an
address that never signed in, which makes every walk sign in before it can ban
or grant.

**A scoped role is its own action, on a plus-tag only.** `prepare-role` sets
`staff`, `support`, `finance`, `treasurer` or `auditor` on a unique plus-tag of
the collector and refuses a named tester, so the named testers keep the roles
the lane documents (Q42).

**Every endpoint write lands on the identity trail (task 2.7).** Ban, grant and
the scoped role call `appendAuditLog` from `@grade10/postgres/audit` in the
same transaction as the write, as the operator's own identity writes do. The
actor is the caller's kind — `test-endpoint-workflow` or
`test-endpoint-qa-token` — in place of a user id, since neither caller has one
(Q45). A refused ban writes a refused entry the same way (Q46). Capture, expire
and clear write nothing. The entry holds no token, address or email. A write
the trail cannot record does not run.

**Plus-tag accounts are removed in the next cleanup (task 3.9).** A scheduled
cleanup on staging and uat deletes the account of every unique plus-tag the
endpoint's runs generated, and never a named tester's (Q21).

**An action the endpoint does not offer has no handler.** There is no
`/test/login` and no unban route; the router answers 404. A named handler is
code somebody can later enable.

**Expiring gains a key predicate.** `ageSignInLinks` and
`invalidateEarlierSignInMail` both read `auth_kv` and filter in the worker.
Both gain `key LIKE 'verification:%'`, since this change first puts that read
behind a remotely callable route.

**The hosted lane is its own Playwright config.** The existing config boots the
local Docker stack, so `playwright.staging.config.ts` sits beside it with no
`webServer`, resolving origins from `@grade10/app-env`. The specs are shared;
the endpoint seam in `e2e/helpers/authDoor.ts` normalises `/dev` and `/test`
to one shape, and refuses a base URL outside the stack it was built for.

**The browser presents a Cloudflare Access service token; the endpoint does not
need one.** The staging site sits behind Access, so the lane sends
`CF-Access-Client-Id` and `CF-Access-Client-Secret` from a policy scoped to
that host. The API host is ungated, so the endpoint's calls carry only the OIDC
token or the QA token.

## Service Interfaces

Six actions in `packages/grade10-auth/backend/src/routes/testDoor.ts`, each
behind the same gates in order: the environment's action set, the QA token or
the OIDC check, then the tester check. Each write is one statement plus its
trail entry, in one transaction.

| Action | Input | Success | Workflow | QA token |
| --- | --- | --- | --- | --- |
| `POST /test/outbox` | `{ email }` | `{ url, body }`, or `{ url: null }` | staging, uat, production | staging |
| `POST /test/age-sign-in-link` | `{ email }` | `{ aged: <count> }` | staging, uat | staging |
| `POST /test/clear-limits` | `{ email }` | `{ cleared: … }` | staging, uat, production | staging |
| `POST /test/ban-user` | `{ email }` | `{ banned: true }` | staging, uat | never |
| `POST /test/prepare-admin` | `{ email }` | `{ role: "admin" }` | staging, uat | never |
| `POST /test/prepare-role` | `{ email, role }` | `{ role }` | staging, uat | never |

Reads and writes, by action:

| Action | Table | Operation | Trail |
| --- | --- | --- | --- |
| Capture | `auth_kv` | read `dev-outbox:<email>` | none |
| Expire | `auth_kv` | update `expires_at` on the address's `verification:*` rows | none |
| Clear | `auth_kv` | delete the send cap and the caller's counters | none |
| Ban | `users` | insert when absent, then set `banned = true` | one entry |
| Grant | `users` | insert when absent, then set `role = 'admin'` | one entry |
| Scoped role | `users` | insert when absent, then set `role` | one entry |

Every action is idempotent: capture returns the same row until another send,
expire applied twice leaves an expired link expired, ban and grant write a
fixed value, and clearing a clear counter deletes nothing. A repeated grant
still writes its entry (Q49).

Example, one sign-in as the lane walks it:

```
POST /auth/test/clear-limits            { email: <tester> }      → { cleared: … }
POST /auth/api/auth/sign-in/magic-link  { email: <tester> }      → 200
POST /auth/test/outbox                  { email: <tester> }      → { url: "https://grade10-stg.com/…", body: "…" }
GET  <url>                                                        → 302 + session cookie
```

## API Contracts

Six routes on the auth worker, all `POST` under `/auth/test/`, each requiring
`Authorization: Bearer <github-oidc-token>` or, on staging, the
`x-grade10-qa-token` header. Refusals answer the worker's standard `{ error }`
shape; an action the environment does not mount answers 404. No existing
endpoint changes shape. `/dev/*` keeps answering 403 on every hosted stack.

## Risks / Trade-offs

- **The QA token is public** → anyone who reads the repository can sign in as
  a staging tester other than the admin-only one. Accepted for an easy setup
  (Q39); the token reaches staging alone and never bans, grants or sets a role.
- **Production opens capture and clear** → only through the full OIDC claim
  set, on a reviewed dispatch, for production's named testers. No plus-tag and
  no write beyond clearing that tester's own limits.
- **Clearing the rate limit weakens a real control** → behind the same checks,
  for the calling IP's own counters, and on the record as an action.
- **A replayed OIDC token repeats an action** → tokens are short-lived and
  every action is idempotent on a tester address. A `jti` seen-set in
  `auth_kv` is the next control if that stops being true.
- **The outbox condition is the one edit to the live send path** → an added
  disjunct after the existing one, for tester addresses only.
- **JWKS unreachable closes the endpoint** → the correct direction; it answers
  503, so a red lane reads as infrastructure rather than as a refusal.

## Migration Plan

No data migration. Tasks 2.6, 2.7 and 3.9 ship on the deployed endpoint:

1. Deploy the admin-only refusal for the QA token. Agents lose nothing they
   were meant to hold.
2. Deploy the trail entries. An endpoint write that cannot record its entry
   stops running, so check the trail's write path on staging first.
3. Deploy the plus-tag cleanup on staging, then uat.

Rollback for any step is the previous worker; none changes data in place.

## Open Questions

None.
