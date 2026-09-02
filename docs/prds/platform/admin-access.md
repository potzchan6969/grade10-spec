---
title: Admin Access Control
order: 1
---

Three layers gate every admin surface, all fail-closed: role permissions, a second factor, and a tamper-evident audit trail. Enforcement lives in `packages/grade10-auth/contracts/src/rbac.ts`, `packages/worker/src/trpc.ts` (elevated ladder), and `packages/grade10-auth/backend/src/core/securityHooks.ts`.

## Roles and permissions

### Assignments live in the database, the mapping lives in code

- Who holds a role is data: `users.role`, comma-separated, owned by the auth worker
- What a role may do is `ROLE_PERMISSIONS` in `@grade10/auth-contracts`, versioned and reviewed
- So a compromised admin account cannot widen a role's grants

### One vocabulary, two projections

- Permissions are `resource:action` over the statements in `PERMISSION_STATEMENTS`
- The auth worker projects the vocabulary into better-auth's access control, so `/admin/*` endpoints enforce it
- Backends check the same grants with `hasPermission` — never compare role names at a call site, never invent a second permission list
- Adding a concern = a statement + role entries in `rbac.ts`; the `access control projects exactly the shared vocabulary` test in each auth backend pins the two projections together

### Roles scope to one concern

- `support` moderates users, `staff` runs the store, reads loyalty, runs vault cases and reads the identity documents behind them, `treasurer` records vault and lending money and is shown no identity document, `auditor` reads the audit trail, `admin` holds everything
- Grant the scoped role that matches the job; `admin` is for the few who administer the system itself

## Granting roles

### Only through the admin panel

- The Users section in `admin.<brand>` shows every account's roles; the Roles action opens an editor over the shared vocabulary
- The Roles action is visible only with `user:set-role`, i.e. admins
- Unchecking everything returns the account to a plain user; the server refuses any role outside the vocabulary
- Every change goes through `/admin/set-role` — permission-gated, step-up-gated, and appended to the audit chain

### First admin (bootstrap runbook)

`set-role` requires an admin, so a product's first admin cannot come from the API. Locally the dev sign-in widget (or `POST /dev/login` with `role: "admin"`) covers this. Staging and production both need a one-time raw write, once per product — staging runs no dev endpoints, and it still demands TOTP enrollment before any admin call succeeds. Substitute the environment's own database for the `prd-` one below:

1. Have the person sign in to the product once (magic link or Google), so their `users` row exists in that product's identity database.
2. Connect to that database — the registry names it (`prd-grade10-auth`, `prd-zzz-auth`):

   ```bash
   source neondb/registry.sh
   psql "$(neonctl cs --project-id "$(neondb_project_id prd-grade10-auth)" --database-name grade10_auth)"
   ```

3. Run the single accepted raw role write, then verify:

   ```sql
   UPDATE users SET role = 'admin' WHERE email = '<owner-email>';
   SELECT email, role FROM users WHERE role LIKE '%admin%';
   ```

4. Sign in to that brand's admin panel (`admin.<brand>`). The 2FA gate opens immediately — enroll TOTP and store the backup codes before anything else.
5. Grant every further operator through the Users section's Roles editor, with the scoped role that matches their job.

The bootstrap write bypasses the audit chain, which is exactly why it is accepted once per product database and never again: any later raw role write counts as tampering that the chain and the offsite backups exist to catch. The one other accepted raw write is lockout recovery: an operator who loses both authenticator and backup codes gets their `two_factors` row deleted — they re-enroll at their next admin call — recorded as an incident, never routine.

## Dev endpoints stop at the laptop

`POST /dev/login` mints a real session for any email at any role, and `POST /dev/setup` applies migrations; neither asks who is calling. So `allowsDevEndpoints` in `@grade10/utils/env` allows exactly `development`, `testing`, and `e2e` — every deployed environment, staging included, answers 403, and an unset or misspelled `ENVIRONMENT` fails closed. The SPA's dev sign-in widget reads the same predicate, so it offers nothing the server would refuse.

That module holds one predicate per decision, because a single "is this dev?" boolean is what put an open session minter on staging. `allowsSandboxProviders` is the separate rule for money — everything but `production`, so staging keeps rehearsing payments on test keys — `allowsRawErrorDetail` is the rule for what a log may carry, narrow because staging logs ship to Datadog too, and `allowsRawErrorResponse` is the separate rule for what an ERROR RESPONSE may carry — separate because a log is read by operators who already hold the data while a response goes to whoever made the request.

## What leaves the worker

### An error answers with a code, never a message

- Outside a developer's own stack, tRPC's error formatter replaces the message with a code: the domain's own word for the refusal where there is one (`data.domainCode`), tRPC's otherwise, and no stack either way
- A message is the one part of an error nobody wrote for the wire — an ORM quotes the row it refused, Postgres quotes the value that violated a constraint, and a `new Error` reads back whatever the author was debugging with
- The refusal vocabulary is unaffected, because it is codes: `domainCode`, the `twoFactor` gate an admin panel opens on, and a refused input's issues, which are the caller's own values
- The detail is not lost — it goes to the log through `loggableError`, keyed by the tRPC code and the procedure path

### A log names the delivery, never the person

- The tail worker forwards every console line to Datadog, so a console line is a line in a third party's index
- A delivery log carries the provider's own message id, the sender, and the recipient's DOMAIN — never the address, and never the subject, because these subjects name the item somebody pawned (`packages/email/src/send.ts`)
- A push delivery log carries the push service's host, never the endpoint: an endpoint is a bearer address anyone holding it can push to

## Elevated procedures and routes

### `elevatedProcedure` and `elevatedRoute` are the only doors to an admin operation

- A backend exposes an admin operation as `elevatedProcedure("store:write")` — never `authedProcedure` plus a role check in the resolver
- A raw byte route — identity capture, sealed document, item photo — mounts through `elevatedRoute` and climbs the same ladder, written once so the two cannot drift
- It enforces, in order:
  1. A fresh session straight from the auth worker — no cookie cache, so a ban or role change acts immediately
  2. Every named permission; with none named, the blanket `admin` role
  3. 2FA enrollment and a live step-up stamp where enforced
  4. Audit-by-construction: the mutation lands in the app's audit log
- The resolver throws when the auth service is unreachable; admin checks never degrade to signed-out
- An elevated mutation in an app without an audit store refuses to run — wiring the sink is part of adding the first admin mutation
- Money-moving or identity-changing reads also re-resolve fresh sessions; the cookie cache is for browsing ([Account Data](/platform/account-data))

### A customer mutation reads through too

- `authedProcedure` splits on the procedure's own type: a query rides the 5-minute signed session cookie, a mutation re-resolves through the auth worker with the cache bypassed
- So a ban, a role change or a deletion stops the next write rather than the one after the cookie expires — a banned account reading its own pages for a few more minutes costs nothing, writing does
- Split on the type rather than on a list of sensitive paths, because a list is a thing to forget: a mutation written tomorrow reads through by being a mutation
- `freshAuthedProcedure` is the same read for a QUERY that has to outrun the window as well — a payout figure, a balance

## Two-factor authentication

### A session proves nothing about a second factor — step-up stamps do

- A successful TOTP or backup-code verification stamps the session: strongly consistent `auth_kv`, 12-hour cap
- Every `/admin/*` call, elevated procedure, and elevated byte route walks the ladder: under `required` an operator who has not enrolled is refused until they enroll, and an enrolled operator needs a live stamp under any policy but `off`
- Changing the factor — enabling or disabling — walks it too, below

### Changing the factor costs what the factor is worth

- `/two-factor/enable` and `/two-factor/disable` both walk the gate, because both CHANGE the second factor
- An operator who already has one proves it either way — a live step-up stamp. Enrolling over an existing factor is a replacement, and a replacement nobody proved is a takeover
- An operator who has none proves the sign-in instead: the session has to be under 15 minutes old. Enrolling is the one admin operation that cannot demand a second factor — it is how you get one — so what it demands is the channel, and a stolen cookie is old by the time it is used. Refused as `RECENT_SIGN_IN_REQUIRED`; the answer is to sign in again
- Sign-in here is passwordless, so better-auth runs the two-factor plugin with `allowPasswordless`. Without this rung `/two-factor/enable` asked for nothing at all, and a stolen but un-enrolled admin session could mint its own authenticator and satisfy the gate that had just stopped it

### Required in staging and production

- The policy is per brand and environment in `packages/app-env` (`adminTwoFactorPolicy`): `required` in staging and production, `optional` in development, and an unknown brand or environment answers `required`. Only the `testing` and `e2e` stacks skip the gate
- The admin SPAs react to `TWO_FACTOR_ENROLLMENT_REQUIRED` and `TWO_FACTOR_STEP_UP_REQUIRED` by opening the enroll or verify flow; the server stays the authority

## Audit trail

### Each app with an admin surface owns an `audit_logs` table

- In its own database: `createAuditLogsTable` from `@grade10/postgres/audit`, instantiated inside the app's pg schema
- The auth worker appends admin mutations and 2FA lifecycle events through the same chain

### Prevention and proof, separated

- Prevention: triggers reject UPDATE, DELETE, and TRUNCATE, so application credentials cannot rewrite history at all. INSERT stays open — appending is the table's job — so a forged row is caught by the scheduled chain walk, not the triggers
- Every guard trigger is `ENABLE ALWAYS`, which is the difference between that sentence being true and sounding true. A trigger Postgres creates is ENABLE ORIGIN and an ORIGIN trigger stands down for any session that sets `session_replication_role = replica` — so a guard left at the default is one statement away from not being a guard. `appendOnlySql` and `columnGuardSql` render the arming beside every trigger they create; standing one down is `ALTER TABLE`, which the service roles cannot issue
- Proof: rows form a SHA-256 hash chain, so a row edited or dropped from the middle leaves the row after it recording a predecessor that is no longer there. `verifyAuditChain` (the `audit.verify` procedure) names the row where that happens
- The end of the chain is the exception, and it is why the head is witnessed outside: rows dropped off the tail leave nothing behind to contradict, because a chain is dense up to whatever its last row is

### What the chain alone does not prove

The digest is unkeyed and nothing signs it, so an owner who drops the triggers can rewrite the table *and* recompute every hash after it. The chain then verifies — against itself. What convicts is a copy of an earlier head taken somewhere the owner cannot reach:

- Every chain opens on a genesis row its migration wrote, so an emptied table reads as `missing-genesis` rather than a clean start
- Every append emits its new head — `seq` as the `audit.chain.head_seq` gauge, `(seq, hash)` on an `__AUDIT_HEAD__` log line — which the tail worker forwards to Datadog when `DD_API_KEY` is set, best-effort: failed submissions are swallowed. A head that goes backwards, or a hash that no longer matches the one recorded at that `seq`, is the tamper the chain cannot see on its own. Read it as a signal to investigate rather than a verdict: an append handed somebody else's transaction emits its head before that transaction commits, so a rolled-back commit can emit a head for a row that never landed, and two isolates appending at once commit in `seq` order while their emissions race the network. Every deployed chain appends on a top-level handle, where neither applies; `doc-sign`'s seal is the one caller that hands in a transaction
- The scheduled sweep is the second witness: per worker it re-runs the chain walk on a budget and writes each verified `(seq, hash)` into the locked archive bucket, outside the database owner's reach — `docs/operations.md` tracks which workers run it
- The offsite backups ([Backups](/platform/backup)) hold the rows to compare against

So a passing verification says the chain is internally consistent, never that it is intact. The hashes stay off the wire: recomputing them in a browser proves nothing a forger could not also satisfy, and shipping them would advertise a guarantee this does not give.

### Appends are strict

- Nothing serializes appends. `seq` is the primary key, so two writers that read one head compute the same number and only one lands; the loser re-reads and appends behind the winner, across five attempts in all. Past that it throws — over a mutation that has already committed, because the append runs after it, so the request fails loudly with nothing recording what it did. That is the honest outcome left, not a guarantee the trail is complete — the gap is invisible to `verifyAuditChain`, because a row never written breaks no chain, which is why an exhausted append emits `audit.append.lost` before it throws. An advisory lock was the alternative and Cloudflare documents `pg_advisory_*` as unsupported over Hyperdrive
- Details are canonical JSON with secret-looking fields redacted, and the auth worker projects better-auth's bodies through a per-path key allowlist first — `auditor` holds exactly `audit:read`, and names and emails sit behind `user:list` everywhere else
- A failed audit write fails the request loudly, never passes unrecorded — on the elevated procedures and the byte routes alike; a byte route without a sink refuses before any bytes move

## Q & A

- Why step-up instead of better-auth's two-factor sign-in flow?
  - Sign-in here is passwordless (magic link, email OTP, Google), which the two-factor plugin does not intercept — so the second factor must be proven after sign-in, per session.
- Why does enrolling a first factor ask how old the session is, rather than for a password?
  - There is no password to ask for. The only thing an un-enrolled operator can prove is the channel they signed in through, and a session minutes old is proof somebody read that inbox; a stolen cookie is not.
- Why both triggers and a hash chain on the audit log?
  - Different attackers: triggers stop application credentials from rewriting history; the chain catches a database owner who drops the triggers — but only with a head witnessed outside the database, which is what the forwarded `audit.chain.head_seq` and `__AUDIT_HEAD__` lines are for.
