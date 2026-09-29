---
title: Product Analytics
order: 3
reviewed: 2026-09-29
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
## *Domain worker* — 🚧 **Records the event with its fact**
Store, auction, vault, or loyalty — server events only; its sweep sends the record to `/import`; same project token per environment; no browser hop.
## *Mixpanel* — **Receives the event**
:::

Domain signals and the Mixpanel catalog sit on
[Analytics](/p/grade10-site/analytics) and
[Mixpanel Events](/p/grade10-site/analytics/mixpanel-events).

## Catalog

### One typed catalog per product

- Lives in the backend at `src/analytics/events.ts`; one `z.strictObject` per event
- Title Case names and property keys (`"Trade Placed"`, `Market`) — the convention every sister site uses
- The backend compiles against it (🚧 through its outbox, `createMixpanelOutbox<StoreServerEvents>`), the web client too (`createTrackingClient<StoreClientEvents>`, type-only via the backend package's `/analytics` subpath), and `/api/track` validates against it at runtime
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

### Sign-out and session expiry rotate the device

- The browser client drops the device id and mints a new one so the next guest is not merged onto the last person

### Server emits keep `$device_id` when Grade10 still holds it

- Checkout Started, web Order Paid, and every other server event that continues a browser or till visit attach that `$device_id` when Grade10 still has it, so pre-login browse joins after pay or sign-in

### Collector IP for Mixpanel geo

- `/import` and `/engage` pass the collector's IP when Grade10 knows it so Mixpanel sets city and country
- The IP is never stored as an event or profile property; on `/engage`, `$ip` is `0` when none was captured so the worker's location is never written

## User Profile

### Server writes the user-profile snapshot via `/engage`

- Only for a user id — never an anonymous device
- 🚧 Servers that own the fact record the write through their outbox (`engage`); the browser never writes a profile
- Which properties, and when they write:
  [Mixpanel Events · User Profile](/p/grade10-site/analytics/mixpanel-events#user-profile)
- No `$email` / `$name` / `$phone` until Consent and Mixpanel erasure settle

## Delivery

What happens to a record after a Mixpanel or worker failure depends on who
sent it.

| Sent by | Arrives | After a failure |
| --- | --- | --- |
| Browser - client events | Within 5 seconds | Sent again while the page is open; lost if it closes first |
| Backend - server events and profile writes | 🚧 On the worker's next sweep: within 5 minutes, 15 on the vault | 🚧 Sent again until Mixpanel accepts it; after an outage, within 20 minutes of Mixpanel recovering |
| Datadog counters | At once | Lost |

### Browser Events

- **Awaited** - `/api/track` awaits one Mixpanel request for the batch; a failure answers 500
- **Sent again by the browser** - the client keeps a batch until the route acks it, sends it again with the same `$insert_id`s, and hands what is left to `sendBeacon` as the page closes
- **Audience with each batch** - the Audience profile write a signed-in batch makes is best effort too; the next batch writes it again

### Backend Sends

- 🚧 **With the fact** - a backend event is recorded for every fact that commits and for none that rolls back
- 🚧 **Never dropped** - a record is sent again with no attempt limit; one Mixpanel refuses is held until an engineer sends a held event again or removes the held record
- 🚧 **Latest profile write** - a user's profile ends on the latest write of each property; a held write is never sent over a later one
- 🚧 **Erasure** - an erased account's unsent records, waiting or held, are deleted with it
- **Not shaped** - an event with neither a user nor a device is refused with a counter, and the fact it describes still commits

### Dedupe by `$insert_id`

- **Derived from the domain key** - an event mirroring a retryable operation takes `deterministicInsertId("order-paid", orderId)`, so a replayed webhook or reconcile pass counts once
- **Four fields** - Mixpanel keeps one of any events that share event name, time, distinct_id and `$insert_id`
- 🚧 **Same record on every attempt** - a backend record is sent again unchanged, so a retry counts once

### Refusals

- **Invalid `$insert_id`s are rewritten** before sending, with a warning and a counter; `strict=1` would refuse the record
- **A browser batch Mixpanel refuses** with 400 is dropped with a log and a counter; the same bytes cannot succeed later

### Observability

- **Counters** - sends, failures and rewritten ids, named in the [tracking architecture](https://github.com/9gag/grade10/blob/main/docs/architecture/tracking.md#observability)
- 🚧 **Waiting records** - how many backend records wait in each worker, the age of the oldest, and how many are held; a held record raises an alarm

## Testing

### Workers: capture the transport

- `installMixpanelCapture()` (`@grade10/test-helpers/workers`) swaps the HTTP transport for a capture
- Assert event names, properties, and how many requests went out; `failNextWith(503)` simulates an outage
- Always `restore()`

### Web: stub through DI

- `createTrackingClient` (`@grade10/mixpanel/browser`) posts each batch to `/api/track` and retries; a test hands it a `fetch` of its own that records the batches

## Adding tracking to a product

1. Catalog in `src/analytics/events.ts` (client/server split)
2. 🚧 Outbox in `src/analytics/track.ts`: `createMixpanelOutbox<ServerEvents>(env, tables, { product, clock })`
3. Wrangler: `MIXPANEL_PROJECT_TOKEN` secret per environment — the empty dev value keeps tracking a logged no-op locally
4. Route: `handleTrackRequest` behind `withSession` in `src/app.ts`
5. Web: `createTrackingClient` typed by the catalog, bound through DI under `src/core/analytics/`
6. 🚧 User profiles, when the product owns user-profile facts: record them with the outbox's `engage` in the backend that holds the fact — not from the browser

## Q & A

- Why first-party instead of Mixpanel's browser SDK?
  - Content blockers do not filter our own API host, and the session cookie gives the server the real user.
- Why does `/api/track` send in one request, with no queue?
  - The route already holds the whole validated batch, and the browser client sends it again until the route acks it; browser events are best effort, so nothing on the server holds them.
- Why are backend sends kept until Mixpanel accepts them, and browser events not?
  - 🚧 Backend events carry the money and domain facts the boards count - Order Paid, Bid Placed, a payout - and no browser is waiting to send them again. Browser events describe browsing, and the browser sends them again while the page is open.
- Does the tracker sync user profiles or gate on consent?
  - User-profile sync (`/engage`) is live. A consent gate in front of the browser client is not built until Legal requires one.
