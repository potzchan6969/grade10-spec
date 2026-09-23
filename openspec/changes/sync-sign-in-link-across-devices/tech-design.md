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

### Two Cloudflare KV entries, not a Postgres table

- `sign-in-watch:{watchId}` → `{ email }`, written on send, TTL a few minutes
  past the link's own `SIGN_IN_LINK_TTL_SECONDS` so a slow poll near the end
  of the window still resolves.
- `sign-in-settled:{sha256(email.toLowerCase())}` → `{ settledAt }`, written
  once by a single hook at the point better-auth creates a session — the
  point every method (magic link, Google, a trusted product's
  create-or-enter) already funnels through — with a short TTL (comfortably
  longer than `SIGN_IN_LINK_TTL_SECONDS`, short enough that it is gone long
  before anyone could reuse it for anything else).

Both live in Cloudflare KV via the existing `secondaryStorage`, not
`authKv`/Postgres: `secondaryStorage.ts`'s `POSTGRES_KEY_PREFIX =
"verification:"` routes only that prefix to Postgres, and
`invalidateEarlierSignInMail` scans every `verification:`-prefixed row by
decoded shape, not by a type tag (a fragility already on record). A `watch`
or `settled` key under that same prefix is one future collision waiting to
happen; a disjoint KV namespace sidesteps it structurally instead of adding
another name to the exclusion list in `signInMail.ts`. Approximate,
eventually-consistent, short-TTL data is exactly what KV is for, and neither
entry has to survive a restart or support a query more complex than a point
lookup — no Postgres migration, no new table.

The email is hashed before it becomes part of a KV key so a leaked key
listing (Cloudflare's dashboard, a log line) does not itself carry the
address in the clear; the watch row's stored value carries the plain address
because only the request holding that watch id's server-side value ever
reads it back.

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
