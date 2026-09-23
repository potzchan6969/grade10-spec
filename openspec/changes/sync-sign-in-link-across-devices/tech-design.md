## Context

`shared-auth-sign-in-SC-70` through `SC-79` govern this change; see
`specs/shared/auth/sign-in/spec.md`. The proposal's Impact section already
names the gap: the only existing "learn about a session elsewhere" path,
`packages/grade10-auth/contracts/src/sessionAnnounce.ts`, rides better-auth's
own same-origin `BroadcastChannel`. It fires when a session lands in *this*
browser and other tabs of *this* browser re-`getSession()` in response — it
cannot reach a second device, and there is no flow-id concept, no
"has this settled" endpoint, and no cross-device push/poll infra anywhere in
the auth stack today (`packages/grade10-auth/backend/src`).

The requesting browser never holds the magic-link token — it is generated
server-side and delivered only to whoever opens the email — so the token
cannot double as the client-side secret this feature needs (`SC-79`).

## Goals / Non-Goals

**Goals:**

- A deterministic, stateless-per-request mechanism a Cloudflare Worker can
  serve without a long-lived connection or a Durable Object.
- A secret that answers only for the surface that requested it, never for an
  arbitrary address (`SC-79`).

**Non-Goals:**

- A fixed polling interval or detection-latency number — `decisions.md`
  already rules this out; cadence is this file's to pick, not the spec's.
- Server push (SSE/WebSocket). Rejected below.
- Any change to the magic-link token's own storage, key format, or the
  existing `invalidateEarlierSignInMail` sweep (`SC-78`).

## Decisions

### A per-request "watch id", not the magic-link token

On every successful send (`sendMagicLink`'s callback, after the email goes
out — first send or resend), the worker also mints an opaque `watchId`
(random, unrelated to the magic-link token) and returns it to the caller
alongside the existing sent/wait/message outcome. The frontend keeps it in
the same component state that already tracks `sent: {email, at}`
(`useSignIn.ts`), replacing it on every successful send rather than trying to
extend an old one's lifetime.

Rejected: reusing the magic-link token as the watch secret — the requesting
browser never has it (see Context). Rejected: keying the poll on the email
address directly — that is exactly the oracle `SC-79` forbids.

### `sign-in-watch`: one Cloudflare KV entry

`sign-in-watch:{watchId}` → `{ email }`, written on send, TTL a few minutes
past the link's own `SIGN_IN_LINK_TTL_SECONDS` so a slow poll near the end of
the window still resolves. Minted and read back by the same requesting
device shortly after send, so KV's propagation window never sits between the
write and the read that matters — approximate, eventually-consistent,
short-TTL data is exactly what KV is for here, and the row does not have to
survive a restart or support a query more complex than a point lookup.

It lives in Cloudflare KV via the existing `secondaryStorage`, not
`authKv`/Postgres: `secondaryStorage.ts`'s `POSTGRES_KEY_PREFIX =
"verification:"` routes only that prefix to Postgres, and
`invalidateEarlierSignInMail` scans every `verification:`-prefixed row by
decoded shape, not by a type tag (a fragility already on record). A `watch`
key under that same prefix is one future collision waiting to happen; a
disjoint KV namespace sidesteps it structurally instead of adding another
name to the exclusion list in `signInMail.ts`.

The email is hashed before it becomes part of a KV key so a leaked key
listing (Cloudflare's dashboard, a log line) does not itself carry the
address in the clear; the watch row's stored value carries the plain address
because only the request holding that watch id's server-side value ever
reads it back.

### `sign-in-settled`: KV was wrong for this one

`sign-in-settled:{sha256(email.toLowerCase())}` was written once by a single
hook at the point better-auth creates a session — the point every method
(magic link, Google, a trusted product's create-or-enter) already funnels
through — and read back from a *different* device's poll. That pair straddles
Cloudflare's own documented KV propagation window (`docs/architecture/edge-cache.md`:
up to 60s cross-colo) whenever the settling device and the watching device
land on different colos, which two separate physical devices routinely do.
The result: a real user signs in on a second device and the first device's
dialog can sit open for up to a minute past the point sign-in actually
completed — the exact failure `edge-cache.md`'s own rule warns against,
"KV holds only keys that are immutable until expiry or whose staleness has
been priced." This key's staleness was never priced; it fell into KV by
analogy with `sign-in-watch` rather than by weighing that rule.

The fix routes the settle marker through Postgres, gated so the cost lands
only on sign-ins that are actually part of a cross-device wait — most
sign-ins on the product are not, and a synchronous Neon round trip on every
sign-in is not free: sessions deliberately stay off Postgres today
(`secondaryStorage.ts`), so this would otherwise be the first synchronous
Postgres write in the sign-in hot path, not a marginal one.

- `sign-in-watch-active:{sha256(email.toLowerCase())}` → a bare marker,
  written to KV alongside `sign-in-watch:{watchId}` at mint time, same TTL
  margin. It is the gate: the settle hook checks it to decide whether this
  sign-in has a live watch worth paying Postgres for. No explicit delete on
  settle — TTL expiry alone cleans it up, since a marker outliving its watch
  only risks one harmless extra Postgres write on a later, unrelated sign-in
  within the TTL window.
- `sign-in-settled-fast:{sha256(email.toLowerCase())}` → `{ settledAt }`,
  written to Postgres (a distinct prefix, routed alongside but never merged
  with `verification:` — see below) only when `sign-in-watch-active` is
  present for that email. `resolveSignInWatch` checks this key first; absent,
  it falls back to the existing `sign-in-settled:{hash}` KV check, unchanged.
- `sign-in-settled:{hash}` on KV keeps being written on every sign-in exactly
  as before — the fast path is additive, not a replacement, so a gate false
  negative (the `-active` marker itself hasn't propagated to this colo yet)
  degrades to today's KV-only behavior rather than to no answer at all.

`sign-in-settled-fast` gets its own literal prefix rather than joining
`verification:` — `secondaryStorage.ts`'s Postgres routing widens from a
single `POSTGRES_KEY_PREFIX` string to a small set of prefixes it tests
against, and `invalidateEarlierSignInMail`'s `LIKE 'verification:%'` scan
never sees these rows, so the collision this file already rejected once for
`sign-in-watch` does not reopen here either.

Neither new key takes an email as input from outside the Worker: the gate
check and the fast write both happen server-side inside the existing
session-creation hook, so `SC-79`'s non-disclosure guarantee is unchanged —
there is still no path from a bare address to an answer.

### The poll endpoint takes a watch id, never an email

`GET /sign-in/magic-link/watch/{watchId}` — the existing `/sign-in/*`
wildcard rate limit already covers a new route under that prefix. Handler:

1. Look up `sign-in-watch:{watchId}`. Missing (expired or never issued) →
   `{ settled: false }`. Nothing distinguishes "expired" from "never
   existed" — the same non-disclosure shape the failed-follow toasts already
   use for used/superseded/invalid.
2. Found → read the email it carries, hash it, look up
   `sign-in-settled:{hash}`. Present → `{ settled: true }`, and delete the
   watch row (one-time answer; a client that keeps polling after settling
   just gets `false` again, harmlessly). Absent → `{ settled: false }`.

No step ever takes an email as input. `SC-79`'s scenario is this shape
directly: naming an address without holding a watch id for it has no path to
an answer at all, not even a slower one.

### Client: poll on an interval, and immediately on visibility change

While Check Your Email is showing, poll on a short interval **and** once
immediately whenever the tab becomes visible again (a `visibilitychange`
listener) — covers `SC-76` without depending on a background tab's throttled
timer actually firing on schedule. Stop polling when the dialog is dismissed
or the link's own TTL has elapsed; a failed attempt elsewhere never marks
`sign-in-settled`, so the poll keeps answering `false` for the whole window
regardless of what happened to the token (`SC-74`).

On `settled: true`: unmount the Check Your Email step (no reload) and fire
`toast.info(signIn.settledElsewhere)` — the catalog key and Storybook story
already landed in `grade10-spec`. No session read, no session request: the
surface's own session state is untouched (`SC-72`).

### Rejected: SSE or a WebSocket via Durable Object

Would remove the polling interval's small latency, but adds a stateful
connection this Worker topology does not otherwise need anywhere in auth,
for a requirement that explicitly has no latency number to hit. Revisit only
if a future feature needs push infrastructure for its own reasons.

## API Contracts

- `POST /sign-in/magic-link` (existing route) — response gains an optional
  `watchId: string`, present on every outcome that means an email actually
  went out (first send or a successful resend); absent on a waited/blocked
  response. Additive, not breaking.
- `GET /sign-in/magic-link/watch/{watchId}` (new) — `{ settled: boolean }`.
  No auth required beyond holding the id; no email in the request.

## Risks / Trade-offs

- [A collector leaves the tab open past the KV TTL, then the address settles]
  → the watch row is already gone, poll answers `false` forever after → the
  countdown/dialog simply behaves as it does today (no regression); a
  generous TTL margin past the link's own lifetime keeps this rare rather
  than eliminating it, which matches the non-goal on a latency guarantee.
- [Polling cost at scale] → short interval, cheap KV point-reads, and the
  client stops polling once the dialog closes for any reason; no fan-out.
- [The settle hook fires for a sign-in unrelated to any pending watch] →
  harmless: the `sign-in-settled` write happens unconditionally on session
  creation, and a poll simply never runs against it when no watch id exists
  for that email — no read amplifies this into a symptom.
- [`sign-in-watch-active` itself has not propagated to the settling device's
  colo yet] → the gate reads a false negative and skips the Postgres write →
  the settle falls back to the existing KV-only path, which is today's
  behavior, not a regression — the gate can only add speed, never remove it.
- [The fast path adds a Postgres point-read to every poll tick that has not
  yet settled] → one extra cheap indexed read against Neon per tick, while
  the flow is live; bounded by the same poll interval and TTL that already
  bound the KV reads.

## Migration Plan

1. Backend: mint and return `watchId` from `sendMagicLink`'s callback; add
   the settle-marking hook at session creation; add the poll route.
2. Frontend: capture `watchId` from the send response; add the poll effect
   (interval + visibility-change) and the settle handler (unmount + toast).
3. Bump the `external/grade10-spec` submodule pin past the commits already
   carrying `signIn.settledElsewhere` and the `Settled elsewhere` story.
4. Rollback: revert the frontend poll effect and the backend route/hook:
   `watchId` being present but unused, or absent entirely, changes no
   existing behavior — every other sign-in path is untouched.
5. Follow-up (this amendment): widen `secondaryStorage.ts`'s Postgres
   routing to a small prefix set; write `sign-in-watch-active` at mint time;
   gate `sign-in-settled-fast` on it in the settle hook; check
   `sign-in-settled-fast` before the existing KV check in
   `resolveSignInWatch`. Rollback: stop writing and stop checking
   `sign-in-settled-fast`/`sign-in-watch-active` — `resolveSignInWatch` falls
   straight back to the KV-only path this change originally shipped with.
