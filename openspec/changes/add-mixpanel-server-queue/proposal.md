**Author:** @rita-liu - 2026-09-23

## Why

A paid order, bid, or vault payout can vanish from Mixpanel when Mixpanel
is down or a worker stops mid-send, so funnels and boards count less than
Postgres already holds. A backend send is one request, counted when it
fails and never sent again. Browser events are sent again by the browser
while the page is open, which is enough for browsing.

**Metric:** backend records waiting in each worker, held ones apart, and
the age of the oldest - zero outside an outage, and back to zero once
Mixpanel recovers. Held records are counted on their own, zero unless
Mixpanel refused one. Once nothing waits, a day's domain Order Paid (or Bid Placed) rows and the
same names in Mixpanel match.

## What Changes

- Every Mixpanel send a backend fact triggers - server events and profile
  writes - reaches Mixpanel however long Mixpanel or the worker is down, and
  counts once.
- A backend event is written with the fact it describes, so it exists for
  every fact that commits and for none that rolls back: a due row in the
  worker's own database, in the transaction that commits the fact, or in
  the commit of the pass that drains the fact's own due row; a send with no
  stored fact writes its record in a transaction of its own (Q10).
- Each worker's sweep sends what is waiting in batches and sends a failed
  record again with no attempt limit. A record Mixpanel refuses is held and
  raises an alarm; nothing is dropped.
- A backend record reaches Mixpanel on the worker's next sweep: within 5
  minutes on the store, auction and loyalty, 15 on the vault.
- A user's profile ends on the latest write of each property: a held write
  is never sent over a later one (Q12).
- An erased account's unsent records, waiting or held, are deleted with it.
- `/api/track`, the browser client, the Audience write each batch repeats,
  and Datadog counters keep today's best-effort path; nothing moves off the
  store.
- **BREAKING** Reverses, for backend sends, the rule that nothing on the
  server holds a Mixpanel event it failed to send
  (`docs/architecture/tracking.md` · Failure and dedupe, and the Analytics
  row of `docs/conventions/backend.md`).

## Non-Goals

See `decisions.md`.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/analytics/analytics`: backend sends reach Mixpanel and count once,
  whatever the outage; browser and Datadog paths are unchanged - on top of
  the catalog and identity from `add-mixpanel-tracking`.

## Impact

- `@grade10/mixpanel`: server sends write a record instead of calling
  Mixpanel; the package gains the record table, as a factory each product
  instantiates, and the send pass (Q10). No component export and no
  consuming app changes.
- Store (both brands), auction, vault, and loyalty: one table and one migration per
  database; the send joins each worker's existing sweep cron; each call
  site writes its record in the transaction that writes its fact.
- No new worker, queue, DLQ, binding, or cron trigger. `/api/track`, the
  SPA, and the API gateway do not change.
- Each product's account erasure deletes that account's unsent records.
- Datadog: waiting records, the oldest one's age, and held records per
  worker - best effort, like every counter.
- `docs/architecture/tracking.md` · Failure and dedupe and its Q & A, and
  the Analytics row of `docs/conventions/backend.md`, are rewritten.
- No collector or admin UI; no Figma or design-system change.

## Open questions

- Consent, Mixpanel erasure, and contact fields stay open on
  `add-mixpanel-tracking` and with Legal.

## References

- [Product Analytics · Delivery](../../../docs/prds/platform/tracking.md#delivery)
- [Mixpanel Events · Events](../../../docs/prds/products/grade10-site/analytics/mixpanel-events.md#events)
- [Mixpanel Events · User Profile](../../../docs/prds/products/grade10-site/analytics/mixpanel-events.md#user-profile)

## Follow-on changes

- Sending a backend record right after its commit as well, if the boards
  need seconds rather than minutes (Q11).
- ZZZ storefront sends once its project has a token; the table ships with
  the store, and Q15 keeps it empty until then.
