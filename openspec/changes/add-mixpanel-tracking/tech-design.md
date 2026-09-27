## Context

Capability: [`grade10-site/analytics`](../../specs/grade10-site/analytics/spec.md).
Motivation stays in `proposal.md`.

Today the store worker already owns first-party ingest
(`POST /api/track` → Mixpanel `/import`), a typed catalog with Order Paid on
the server, and `@grade10/mixpanel` (`createTracker`, `createTrackingClient`,
identity stamping). Order Paid ships for owned and ownerless orders. The
Grade10 SPA does not bind the tracking client, so client catalog names never
fire. Checkout Started still sits on the client catalog even though checkout
only exists after `createCheckout`. Auction, vault, and loyalty send nothing.
`/engage` is not built. Owned Order Paid drops `$device_id`, so pre-login
browse cannot join after pay. Sign-out does not rotate the device. Collector
IP is not stamped for geo. Architecture:
[tracking.md](https://github.com/9gag/grade10/blob/main/docs/architecture/tracking.md).

## Goals / Non-Goals

**Goals:**

- Land the Grade10 Mixpanel catalog, identity rules, user-profile snapshot,
  and refusals behind the existing first-party pipeline.
- Keep one Grade10 Mixpanel project so store, auction, vault, and loyalty
  events join on the same user or device.
- Preserve empty-token local no-op and oracle-style catalog tests.

**Non-Goals:**

- Mixpanel browser SDK, Autocapture, Session Replay, or admin Mixpanel.
- ZZZ storefront emit (shared library only).
- Consent gate, Mixpanel erasure, or contact fields on profiles.
- Auth-worker Mixpanel calls.
- New UI, Figma, or `@grade10/ui` analytics hooks.

## Decisions

### Spec already governs

Identity (session stamps the person, anonymous is the device, ownerless order
device, audience, session-end reset, server keeps device, first-touch
campaign, Account Created), the client/server catalog split, geolocation by
collector IP, user-profile snapshot fields, and refusals — all in the
analytics delta. This design picks where they land.

### One Grade10 project; each emitting worker calls Mixpanel

Store, auction, vault, and loyalty each hold `MIXPANEL_PROJECT_TOKEN` for the
same Grade10 project and call `createTracker` with a typed catalog slice they
own. Shared helpers stay in `@grade10/mixpanel`. The store worker remains the
only `/api/track` gateway for browser events.

_Rejected:_ fan every domain event through the store worker — couples auction
and vault deploys to store, and puts domain facts behind the wrong service
boundary.
_Rejected:_ separate Mixpanel projects per service — breaks session joins
across lot view → bid → win.

ZZZ keeps its own token and project when it emits later; catalogs may share
code shapes, never a project.

### Extend `@grade10/mixpanel` before product call sites

Add to the shared package:

| Surface | Land |
| --- | --- |
| Import | Optional collector `ip` on the Mixpanel `/import` payload (never as an event property) |
| Engage | User-profile writes (`$set` / `$set_once`) with `$ip` or `0` |
| Browser client | `resetDevice()` (or equivalent) that rotates localStorage device id and clears the queue's prior identity |
| Audience | Helper that maps session roles → `collector` \| `staff` for identified events |

Oracle and package tests cover the new surfaces. Product workers only compose
them.

### Store catalog owns Grade10 site browser + commerce server names

Expand `packages/grade10-store/backend/src/services/analytics/events.ts`:

- **Client:** Page Viewed, Product Viewed, Product Added, Cart Opened, Lot
  Viewed (with UTM / Initial Referrer as specified).
- **Server:** move Checkout Started here; enrich Order Paid; keep Account
  Created, Pass Added, Reward Redeemed, Member Identified as store-owned
  where the fact is written (loyalty facts that the store already settles may
  emit from the store call site; see Loyalty below).

Export the client catalog through a package subpath the SPA can import
type-only (`/analytics` or equivalent). Update grade10 and zzz
`tracking.spec.ts` sample maps together so the catalog stays total.

### Device continuity on checkout

When `createCheckout` accepts, persist the browser's `deviceId` on the order
(or checkout row the Order Paid path already reads). Checkout Started and web
Order Paid pass that id as `$device_id` when present. Ownerless paid keeps
`deviceId: order-<orderId>` and never reuses that string as a browser device.

_Rejected:_ asking Mixpanel to alias order → user on claim — claims are
revocable; the spec forbids merge.
_Rejected:_ relying on Simplified ID Merge without stamping `$device_id` on
owned Order Paid — today's owned emit drops it, so browse never joins.

### Session-end device rotation in the SPA

On sign-out and when the SPA learns the signed-in session has expired, call
the tracking client's device reset before the next emit. No Signed In / Signed
Out Mixpanel events.

### Account Created from the store, never auth

Emit once when the store first creates a user id (including checkout-created
unverified accounts). Finding an existing account is a no-op. Identity worker
stays Mixpanel-free.

### Auction and vault emit at their write sites

| Service | Events |
| --- | --- |
| Auction worker | Card Linked, Bid Placed, Lot Watched, Bidder Outbid, Auction Won, Invoice Paid |
| Grade10 SPA | Lot Viewed, Page Viewed on auction surfaces (same client as store) |
| Vault worker | Vault Case Submitted, Visit Booked, Offer Made / Accepted / Declined, Payout Recorded, Identity Bound |

Each uses `deterministicInsertId` from the domain key and the domain write's
time. Bid Placed fires after the maximum is accepted, never on engine
auto-bid steps. Invoice Paid never fires on hold capture.

### Loyalty facts

- Enrich Order Paid with Member, Tier, Points Earned, Points Spent at the
  existing store emit sites.
- Pass Added, Reward Redeemed, Member Identified fire where those facts are
  committed (store till / wallet / reward shop paths already in the store or
  loyalty packages — emit beside the write, same Grade10 token).

### User profiles from backends that own the fact

Engage `$set` when Audience, Member, Tier, Identity Standing, or Wallet Pass
changes; `$set_once` Created on Account Created. Never for an anonymous
device. Never from the browser. No `$email` / `$name` / `$phone`.

### Collector IP for geo

| Path | Stamp |
| --- | --- |
| `/api/track` | Cloudflare / request client IP → Mixpanel import `ip` |
| Server emit following a browser or till request | Pass the captured collector IP when the call site still has it |
| Engage with no IP | `$ip: 0` so the worker location is not written |

Never store IP as an event or profile property.

### Tokens and project settings

Staging and production are separate Grade10 Mixpanel projects. Enable
Simplified ID Merge before the first event in each. Empty token remains a
logged no-op. Set real tokens out of band (wrangler vars / secrets as the
architecture doc already describes) — not part of the code merge gate.

## Service Interfaces

### `POST /api/track` (store worker)

| | |
| --- | --- |
| Entrypoint | Existing store route behind `withSession` |
| Input | `{ deviceId, events[] }` — client catalog names only |
| Success | Mixpanel `/import` accepted for the batch |
| Refusal | Unknown name, server name, extra properties, forged user field |

Stamps: session user id (never from the body), Audience on identified events,
collector `ip` for geo, `$device_id` from body when present.

### `trackServerEvent` / `createTracker` (store, auction, vault, loyalty)

| | |
| --- | --- |
| Input | Event name + properties + identity `{ userId? , deviceId? , ip? }` + insert id / time |
| Success | Fire-and-forget via `waitUntil`; metric on failure |
| Refusal | Empty token → no-op log; invalid catalog → type / runtime reject |

### `engagePerson` (new, `@grade10/mixpanel`)

| | |
| --- | --- |
| Input | `userId`, `$set` and/or `$set_once` maps, optional collector `ip` |
| Success | Mixpanel `/engage` accepted |
| Refusal | Missing userId; empty token → no-op |

### Browser `createTrackingClient`

| | |
| --- | --- |
| Bound under | Grade10 SPA DI (`src/core/analytics/` or the site's existing container) |
| Emits | Client catalog only, batched to `/api/track` |
| Reset | Rotates device id on sign-out and session expiry |

## API Contracts

No breaking change to the `/api/track` envelope. Additive client event names
and properties land only in the store catalog and the SPA. No admin track
route. No user, email, or phone field on the wire.

## Risks / Trade-offs

- **[Risk] Owned Order Paid historically omitted `$device_id` → Mitigation:**
  persist checkout device id and stamp it on Checkout Started and web Order
  Paid; cover with capture tests.
- **[Risk] Sticky device after sign-out merges the next guest → Mitigation:**
  SPA reset on sign-out and session expiry; package test for rotation.
- **[Risk] Claiming an ownerless order could double revenue if resent →
  Mitigation:** never resend Order Paid on claim; never merge order device
  onto the member (already specified; assert in tests).
- **[Risk] Auction/vault tokens drift from store → Mitigation:** same var
  name and runbook; empty no-op in local; staging/prod checklist in
  architecture doc.
- **[Risk] Impersonation looks like the member → Mitigation:** out of this
  change; open question below. Do not invent a session flag the auth model
  does not expose yet.
- **[Risk] Mixpanel down drops server events → Mitigation:** accept loss;
  revenue stays in Postgres; count `*.track_failed` where Order Paid already
  documents it.

## Migration Plan

1. Land library + catalog + oracle updates with empty tokens (no Mixpanel
   traffic).
2. Enable Simplified ID Merge and set tokens on staging; verify import /
   engage in a staging project.
3. Ship SPA client emits and server call sites behind the same tokens.
4. Production token + Simplified ID Merge before first production event.
5. Rollback: clear tokens (revert to no-op) or disable SPA binding; server
   call sites become no-ops when the token is empty.

## Open Questions

- **Impersonation** — when storefront impersonation exists, should ingest drop
  or tag those sessions? No session field today; revisit with the
  impersonation change.
- **Token distribution** — ops confirms how auction/vault/loyalty wrangler
  vars receive the same Grade10 project token as store (does not change the
  task shape).
