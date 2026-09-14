---
title: Edge Caching
order: 5
---

Which cache layer serves what: Workers Cache for public GET responses purged by tag, KV for cross-request state, a DO when there is one writer. Session caching has its own section — read it before touching anything under `packages/grade10-auth/backend`. Data ownership: [Account Data](/platform/account-data).

## Picking a layer

### Match the layer to the need

| Need | Layer |
| --- | --- |
| Public GET, bounded staleness OK, invalidated by a known mutation | Workers Cache (`edgeCache` + tag purge) |
| Cross-request state the worker reads/writes as values (sessions, rate limits, flags) | KV — accepting its ≤60 s propagation |
| One consistent writer, transactions, fan-out | Durable Object |
| Must be exact on every read | No cache — read the source of truth |

## Workers Cache

### The default for public reads

- A per-Worker response cache in front of the entrypoint (Cloudflare's Workers Cache, shipped July 2026)
- Hits are served without running Worker code and bill no CPU; purge is global through Instant Purge
- Enable per worker in `wrangler.jsonc`: `"cache": { "enabled": true }`
- Enabling is inert until a route opts in — a response that sets no cache headers is untouched
- Both store backends ship with it enabled; their catalog routes are the pattern in use

### Publish with `edgeCache`, invalidate with `purgeCache`

```ts
import { cacheTag, edgeCache, purgeCache } from "@grade10/worker";

app.get("/api/public/products", async (c) => {
  const products = await listProducts(c.env);
  edgeCache(c, { maxAge: 300, tags: [cacheTag("catalog", "list")] });
  return c.json(products);
});

// the mutation that invalidates the read
ctx.executionCtx.waitUntil(
  purgeCache(ctx.executionCtx, { tags: [cacheTag("catalog", "list")] }),
);
```

### Tags are `entity:id`

- `cacheTag("product", 123)` → `product:123`
- One tag per thing a mutation can invalidate; a response may carry many

### Only session-independent responses

- The cache key is the URL, not the user
- Anything derived from the caller's session or cookies never passes through `edgeCache()`
- The auth worker deliberately does not enable Workers Cache

### A query string is part of the key, so answer one spelling of it

- Every distinct query string is its own entry, so `?b=2&a=1`, `?a=1&b=2` and `?a=1&b=2&utm=x` are three entries holding one answer — and anyone can mint more
- Pick a canonical spelling — parameters in name order, multi-values deduped and sorted, defaults omitted, unrecognised parameters absent — and redirect anything else onto it with a 308
- Build it with `URLSearchParams`, so the canonical string is byte-identical to what a caller's own `searchParams.set` produces and an ordinary request never pays for the redirect
- Cache the redirect too. Uncached it costs a worker invocation on every request, which is most of what canonicalising was meant to save
- Canonicalising bounds *spellings*, never *values*. It collapses `?b=2&a=1` and drops `?utm=x`, but `?q=<anything>` is already canonical, so it answers — and if answering is expensive, that is an open axis. Give each such parameter its own bound: a closed vocabulary, a shape the route can only have issued, or a rate limit
- The store's catalog reads keep the rule without the cache: `services/catalog/query.ts` decides the one spelling a query is answered on, facets and cursors are bounded there and free text is not; the reads moved onto tRPC, which this cache does not serve, and what answers them is [Commerce](/p/grade10-site/commerce/commerce)

### Purge is best-effort, TTL is the backstop

- Purge rides `waitUntil` — a purge hiccup must never fail the mutation
- `purgeCache` returns false with a loud warn when the runtime has no `ctx.cache`
- Pick a `maxAge` you could live with if a purge were missed

### tRPC stays on its own lane

- The `cached` procedure tier (`packages/worker/src/trpcCache.ts`) caches server-side by input hash and sets no headers on the outgoing response
- Content that deserves edge caching belongs on a plain GET route with `edgeCache()`, where the URL is the cache key and tags give it a purge handle

## Sessions

### Revocation staleness stacks two windows

- Sessions live in KV behind a 5-minute signed cookie cache; the identity Postgres is off the per-request path ([Account Data](/platform/account-data))
- Cookie cache, ≤5 min: the session rides in a signed cookie the caller holds; no store is consulted until it expires
- KV propagation, ≤60 s: a delete (sign-out, ban) written at one location may be served stale elsewhere until the edge TTL passes
- A revoked session dies within ~6 minutes everywhere; money-moving checks bypass both with `getSession({ fresh: true })`

### One-time tokens do not ride KV

- KV's staleness is priced for sessions, not for magic-link tokens
- A colo that cached a verification can serve the consumed value for up to 60 s — a single-use token redeems twice
- The auth worker's `secondaryStorage` splits by keyspace (`packages/grade10-auth/backend/src/secondaryStorage.ts`)
- `verification:` keys live in the identity Postgres (`auth_kv` — KV-shaped, TTL via `expires_at`, expired rows swept on write); everything else stays on KV
- The rule: KV holds only keys that are immutable until expiry or whose staleness has been priced

### Accepted residuals

- better-auth's read-then-delete still allows truly simultaneous redemptions (milliseconds); no store choice fixes it through that contract
- Rate-limit counters stay per-isolate memory until a product needs global limits — going global puts a read+write on every rate-limited auth request

## Q & A

- How do KV and Workers Cache fail differently?
  - KV is a store with eventually consistent reads everywhere; Workers Cache is a cache whose entries can evict at any moment but whose purge is global and immediate. A purge fixes staleness now; a KV write becomes visible when the edge TTL expires.
- Why can't Workers Cache hold sessions?
  - It is a response cache in front of an entrypoint, not a keyed store better-auth can call get/set/delete on — and session responses must never be edge-cached anyway.
- What if a product needs sub-minute global revocation?
  - Shrink or disable the cookie cache and pay a KV read — then a Postgres read — per request, in that order.
