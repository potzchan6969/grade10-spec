---
title: Product Analytics
order: 3
---

Events reach Mixpanel from Grade10's own backends — never from the browser
directly:

:::flow{title="Posting to Mixpanel" case="Client events"}
## *Browser* — **Posts `/api/track`**
Typed client events, batched; retries until the route acks.
## *Backend route* — **Validates and stamps identity**
Rejects names outside the client catalog; one Mixpanel request for the whole batch.
## *Mixpanel* — **Receives `/import`**
:::

:::flow{title="Posting to Mixpanel" case="Server events"}
## *Domain worker* — **Calls `/import`**
Store, auction, vault, or loyalty — server events only; same project token per environment; no browser hop.
## *Mixpanel* — **Receives the event**
:::

Domain signals and the Mixpanel catalog sit on
[Analytics](/p/grade10-site/analytics) and
[Mixpanel Events](/p/grade10-site/analytics/mixpanel-events).

## Catalog

### One typed catalog per product

- Lives in the backend at `src/analytics/events.ts`; one `z.strictObject` per event
- Title Case names and property keys (`"Trade Placed"`, `Market`) — the convention every sister site uses
- The backend compiles against it (`createTracker<StoreEvents>(env)`), the web client too (`createTrackingClient<StoreClientEvents>`, type-only via the backend package's `/analytics` subpath), and `/api/track` validates against it at runtime
- A renamed event or property breaks the build, not the dashboard

### Client events and server events are split

- The browser may send client events only
- The ingest route rejects server event names, so a browser cannot forge them

### `Order Paid` reports the goods and the charge apart

- `Value Minor` is the goods and `Charged Minor` the whole charge, tax and the shipping a provider that owns the checkout added included
- Two facts rather than one: tax collected is a liability and shipping is a pass-through, so a revenue chart built on the charge would overstate. They are the same number under a provider that adds nothing
- Each property's exact definition lives with the typed catalog in `src/analytics/events.ts`, beside the code that writes it

### Adding an event

- Add it to the catalog
- Add its sample to the oracle test (`test/worker/tracking.spec.ts`) — the sample map is total over the catalog, so forgetting is a compile error
- Call the tracker from the right layer

## Identity

### Simplified ID Merge

- Enable **Simplified ID Merge** in the Mixpanel project settings before the first event
- Grade10 does not use Original ID Merge or Mixpanel's [`$merge` identity API](https://docs.mixpanel.com/reference/identity-merge) — linking is `$device_id` on identified emits, not a merge call
- Anonymous: `distinct_id = "$device:<deviceId>"`; the browser client persists the device id in localStorage
- Signed in: `distinct_id = userId`, with `$device_id` still attached so Mixpanel links the anonymous history to the user

### An ownerless paid order reports under the order

- A checkout placed with an address alone gains its account when its paid event is delivered; one whose address turns out to be a stranger's proven account never gains one
- The money landed either way, so `Order Paid` is still sent — `distinct_id = "$device:order-<orderId>"`, attached to nobody's profile. Only loyalty is gated on ownership

### The server names the user, never the client

- The server resolves the user from the session
- The wire format has no user field — a client can name its device but never its user

### 🚧 Sign-out and session expiry rotate the device

- The browser client drops the device id and mints a new one so the next guest is not merged onto the last person

### 🚧 Server emits keep `$device_id` when Grade10 still holds it

- Checkout Started, web Order Paid, and every other server event that continues a browser or till visit attach that `$device_id` when Grade10 still has it, so pre-login browse joins after pay or sign-in

### 🚧 Collector IP for Mixpanel geo

- `/import` and `/engage` pass the collector's IP when Grade10 knows it so Mixpanel sets city and country
- The IP is never stored as an event or profile property; on `/engage`, `$ip` is `0` when none was captured so the worker's location is never written

## User Profile

### 🚧 Server writes the user-profile snapshot via `/engage`

- Only for a user id — never an anonymous device
- Servers that own the fact call `engagePerson` in `packages/mixpanel`; the browser never writes a profile
- Which properties, and when they write:
  [Mixpanel Events · User Profile](/p/grade10-site/analytics/mixpanel-events#user-profile)
- No `$email` / `$name` / `$phone` until Consent and Mixpanel erasure settle

## Failure and dedupe

### Whoever waits, retries

- Nothing on the server holds an event it failed to send
- `/api/track` awaits the send; a Mixpanel failure answers 500, and the browser client re-sends the batch with the same `$insert_id`s
- A backend call site has nobody waiting: hand the promise to `waitUntil` and count the failure (`store.order_paid.track_failed`)
- Backend events are lost when Mixpanel is down — revenue lives in Postgres, analytics only describes it

### The browser client is the durable end

- It queues events (bounded), flushes in batches, and keeps a batch until it is acked
- `sendBeacon` drains the queue on page hide

### Dedupe by `$insert_id`, derived from the domain key

- Mixpanel is the only place that dedupes
- An event mirroring a retryable operation derives its id from the domain key — `deterministicInsertId("order-paid", orderId)` — so a replayed webhook or reconcile pass counts once

### Drop what can never succeed, loudly

- A batch Mixpanel rejects with 400 is dropped with a log and metric, never reported as retryable
- Invalid `$insert_id`s are rewritten before sending (warn + metric); `strict=1` would drop such records silently

### Observability

- Datadog counters via the tail worker: `mixpanel.submitted`, `mixpanel.event.no_identity`, `mixpanel.import.rejected_batch`, `mixpanel.insert_id.sanitized`, `mixpanel.event.invalid_insert_id`

## Testing

### Workers: capture the transport

- `installMixpanelCapture()` (`@grade10/test-helpers/workers`) swaps the HTTP transport for a capture
- Assert event names, properties, and how many requests went out; `failNextWith(503)` simulates an outage
- Always `restore()`

### Web: stub through DI

- `createTrackingClient` (`@grade10/mixpanel/browser`) posts each batch to `/api/track` and retries; a test hands it a `fetch` of its own that records the batches

## Adding tracking to a product

1. Catalog in `src/analytics/events.ts` (client/server split)
2. Tracker in `src/analytics/track.ts`: `createTracker<Events>(env)`
3. Wrangler: `MIXPANEL_PROJECT_TOKEN` secret per environment — the empty dev value keeps tracking a logged no-op locally
4. Route: `handleTrackRequest` behind `withSession` in `src/app.ts`
5. Web: `createTrackingClient` typed by the catalog, bound through DI under `src/core/analytics/`
6. 🚧 User profiles, when the product owns user-profile facts: call `engagePerson` from the backend that holds the fact — not from the browser

## Q & A

- Why first-party instead of Mixpanel's browser SDK?
  - Content blockers do not filter our own API host, and the session cookie gives the server the real user.
- Why one request with no queue?
  - The endpoint already holds the whole validated batch, so it sends it in one `fetch` — no queue table, no scheduler, no Durable Object; the browser client is the retry mechanism and already knows how.
- Does the tracker sync user profiles or gate on consent?
  - 🚧 User-profile sync (`/engage`) lands with this change. A consent gate in front of the browser client is not built until Legal requires one.
