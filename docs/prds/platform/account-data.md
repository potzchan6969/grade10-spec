---
title: Account Data
order: 4
---

Where account data lives and how apps reach it. Applies to every brand; examples use Grade10. Commerce flows: [Commerce](/p/grade10-site/commerce/commerce). Hostnames and ports: `packages/app-env`.

## Ownership

### One owner per piece of data

- Only the owning service reads or writes its store
- Everyone else goes through its API (service binding or tRPC)
- Postgres roles enforce it

### Auth owns sign-in; the identity store owns the verified record

- Sign-in identity, display name, avatar live in auth
- The verified record — legal name, date of birth, document type, masked number, expiry, and the photograph of the document — lives in `grade10-e-kyc-service`: its own worker, its own Neon project, its own R2 bucket. It has no gateway route and no `ServiceId`, so no browser reaches it; a product reaches it over a `KYC_SERVICE` binding
- Writes and case bindings are scoped to the calling product, by the entrypoint its binding names. Reading a person's verification is not: the same human is the same human, so a second product binds the check the first recorded instead of photographing the passport again
- Only the vault holds a binding today. The reuse is a wiring job rather than a rewrite, and it is not done
- Erasure is product-driven. The product that opened a case calls `releaseCaseBinding`, and the record and its capture are purged once nothing binds them — only the owning product knows whether the evidence is under legal hold, so a binding that still stands is the hold
- Addresses stay product data, owned by apps

### The user id is the only key

- The better-auth user id keys account data everywhere
- Email is an attribute, never a key

## Storage

### Postgres by default

- One shared Neon project per brand and environment (`stg-grade10`, `prd-grade10`); a database and role per service inside it, reached through Hyperdrive
- Auth (per brand), the identity store, finance and the vault are their own projects — walls around PII and money, so a leaked app credential cannot reach them and each restores on its own clock
- The identity store is the widest of those walls: it holds the legal name, the birth date and the document photograph of every customer of every product, so nothing else shares a credential with it

### Tables

- `account_<context>`, keyed by `user_id`
- Rows appear lazily: every writer calls the `ensureAccount(userId)` upsert — no signup fan-out
- App tables FK only to rows `ensureAccount` creates

### A Durable Object is not a store

- Records go straight to Postgres, ordered by a row lock
- A DO carries only WebSockets, alarms, and in-memory hot state
- A DO hands Postgres writes to its worker (self service binding) to stay testable

### Caches are not a store either

- KV and caches never hold the truth
- Create Hyperdrive bindings with query caching disabled unless read-only and staleness-tolerant

## Identity

### Sessions live in KV

- Behind a 5-minute signed cookie cache, so session reads never touch Postgres
- Resolved through the `AUTH_SERVICE` binding (`withSession` in `packages/worker`) as `{ id, email, name, role }`
- Revocation (ban, sign-out) lags up to ~6 minutes for a READ; every authed mutation and every elevated call resolves with `fresh: true`, so a write is refused at once

### The cookie is a trust boundary

- Any https host under the brand domain can call the auth API with credentials
- Putting a host on that domain is an access grant, not config
- Lower-trust surfaces get their own tokens on their own domain

### Sign-in pages are per app

- Each app hosts its own page against the shared auth worker
- A redirect flow resolves its `redirect` param through `@grade10/auth-contracts/redirect` — an unvalidated redirect is an open redirect

### Admin reads identity through the auth API only

- Screens joining identity with app data are per-app fan-out

## Cross-service

### Talk through APIs

- A service binding, never another service's database. There are no queues: which shape an edge takes is [Cross-Service Work](/platform/cross-service), and who decides a refusal is [the backend conventions](https://github.com/9gag/grade10/blob/main/docs/conventions/backend.md)

### Delivery is at-least-once

- Dedupe on a unique constraint; one side effect per task
- Repair by sweeping destination rows, never queue bookkeeping

### Showing other users

- Rows store only `user_id`; render the latest name and avatar through a cached auth lookup
- Immutable records (invoices, settled bids) snapshot instead — a rename must not rewrite history

## Erasure

### An admin drives it, nothing schedules it

- An erasure begins as a row: `auth.deletion_requests`, filed from a console's users page under `user:delete`. Filing bans the account and stamps `execute_after` seven days out; cancelling before then closes the request and lifts the ban
- One open request per person (partial unique index). A request closes once, as `cancelled` or `completed`, under a column guard that refuses DELETE, TRUNCATE, and any second close
- Nothing polls and nothing sweeps. The open request IS the worklist, and an admin is the retry. `scripts/checks/check-erasure-consumers.mjs` is what stops a product being forgotten, since no scheduler does
- better-auth's `/admin/remove-user` is refused and the refusal is audited: it hard-deletes with no request behind it, so nothing would ever have authorized the products to erase

### Auth is the guard, not the orchestrator

- Every product exposes an `erasure` router — `status` and `erase`, both `user:delete` — and calls `assertErasureCleared(AUTH_SERVICE, brand, userId)` before it writes anything. Auth binds no products and knows none
- The licence is a fact about the request's history: any matured request that was not cancelled clears, completed ones included. So a product that failed while others succeeded can still finish after the login is gone, and a product added later backfills through the same screen
- The worker refuses a `brand` that is not its own, so a miswired binding fails by name rather than answering from another brand's request table

### Two answers, never merged

- `status` returns `holds` — why the product will not erase yet — and `remaining` — what it still holds of the person. Both empty is the only state that means done
- The console's checklist gates "delete login" on every product reporting both empty. A product with nothing in its way has not been erased, it has only been asked; keeping the two apart is what stops the last button opening over intact data
- The login goes last. Delete it first and "login gone" stops meaning "data gone": the account is erased from auth, intact everywhere else, and nothing is left that says it should not be

### What each product does

| Product | Refuses while | Erases |
| --- | --- | --- |
| Appointment | never | Nulls `bookings.user_id` in the named lane; the seat stays as the shop's record of its own day |
| Auction | uncaptured settlement, unit in transit, or a live payment hold | Bidder name and email, watches, fulfillment address and proof documents, and the Stripe customer. `user_id` stays as an opaque key on bids and settlements |
| Store | never | Profile and push subscriptions deleted; checkout address, vendor customer ref and an operator's claim notes cleared off the person's own rows; pairing marked deleted, which drops the phone it last pushed. Order, event, claim, code and handle ids stay |
| Vault | a case still in custody or otherwise unerasable | Every case that named the person — phone, email, decline reason, item titles, photos, notes, signer details — and the identity binding released over the kyc port |

- Loyalty is a named exemption with its column inventory pinned: every id there is an opaque FK that still balances once the auth user is gone

### Retention classes

- Profiles purge
- Orders, ledgers, and bids anonymize
- A verified identity is released rather than swept: it lives in another service's database, so the owning product drops its case binding and the store purges the record and its capture once no binding is left. The capture delete is queued in the purge's own transaction and the release fails until the bytes are gone, so a retried erasure finishes rather than reporting done over a leftover photograph

### Open

- `auth.verifications` keeps an email address with no FK to `users` and nothing expires it. With no cron on auth, the answer is to delete expired rows on the write path
- The auction worker serves both storefronts but binds only `grade10-auth`, so a zzz bidder cannot be erased. No zzz bidder exists yet either — that storefront has no auction host, no email catalog and no console — so erasure lands with the rest of the launch rather than ahead of it ([Auction Service](/platform/auction-service)). Declared in the check's `KNOWN_GAPS`, which fails the day either half is wired
- A vendor customer this shop **adopted** survives the erasure: `retireCustomer` strips the member key and stops there, because the customer existed before the member and owns its own order history. So the shop keeps their name, email and addresses after the console says done. Whether an adoption should instead take the `customerRequestDataErasure` path is a merchant decision, not a code one
- `minted_codes.customer_ref` keeps the vendor customer's gid. The column belongs to loyalty's write surface and `ck_minted_codes_scope_ref` refuses a null under `scope='customer'`, so clearing it is a constraint change in loyalty rather than a write from here
- `pos_handles` and `pos_sessions` record which shop and till saw the person and when — the member's own card reads it back as their history. Both `user_id` columns are NOT NULL and neither table is ever deleted from, so erasing this needs a migration and a decision about how long that history should live

## Finance

### Isolated from day one

- Own Neon project and roles; own Cloudflare account if compliance asks
- Sign-in and the verified identity record stay shared: a residency requirement on either means a second deployment of that service, and retrofitting one is a migration

### Session identifies, never authorizes

- Money movement needs step-up re-auth and a cache-bypassed session

### Ledgers

- Append-only double-entry; erasure anonymizes, never deletes
- Backups add scheduled logical dumps to R2

## Examples (store)

| Data | Home |
| --- | --- |
| Sign-in, session, ban, display name, avatar | auth |
| Billing and shipping addresses, watchlist, ratings | store schema |
| userId ↔ Stripe customer id | store schema, written before first use |
| Catalog | Shopify, fetched live behind Workers Cache — no mirror |
| Orders and items | store schema; Stripe holds the payment objects |
| Auctions, bids, holds, settlement | auction service ([Auction Service](/platform/auction-service)) |

## Q & A

- Do service bindings cost money or add latency?
  - No — https://developers.cloudflare.com/workers/runtime-apis/bindings/service-bindings/
- Why Postgres and not D1?
  - Account data needs interactive transactions, real joins, and constraints; one engine across apps beats two. Dev and tests use docker Postgres and pglite, never another dialect.
- Why one shared Neon project?
  - One warm compute, one restore story, one bill; a database and role per service keeps ownership enforceable — Postgres cannot even join across databases. Co-tenants share restore blast radius — fine everywhere except the four walled projects: auth, the identity store, finance and the vault.
- Is Neon fast enough?
  - Single-region; the first query after idle costs ~0.5–2 s. Hot session-free reads use the cached tRPC procedure; admin tolerates cold starts.
- Why not make a DO the source of truth?
  - Most account data has no write contention, and a DO store gets mirrored to Postgres anyway — mirrors drift and every backfill turns into a per-shard migration instead of one SQL statement.
  - Durable Objects are not a store, they are a cache.

## Open

- Staging cookie domain — decide with the first staging deploy.
