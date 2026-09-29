## Goals

- A backend event or profile write reaches Mixpanel however long Mixpanel or
  the worker that sent it is down, and counts once.
- A backend event is recorded for every fact that commits and for none that
  rolls back.
- A user's profile ends on their latest write, however often a write was
  retried.
- Browser events and Datadog counters keep today's best-effort path.

## Non-Goals

- Guaranteed browser events - `/api/track` keeps one Mixpanel request per
  batch, and the browser sends a batch again only while the page is open
- Guaranteed Datadog counters
- A new analytics worker, or moving `/api/track` off the store
- Changing the Mixpanel event catalog, identity merge rules, or the
  profile property set - those stay with `add-mixpanel-tracking`
- Sending again the events lost before this change ships
- A console to see, send again or remove held records
- Mixpanel's browser SDK, Autocapture, Session Replay, a consent gate, or
  Mixpanel erasure
- Renaming the internal `@grade10/mixpanel` package

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Who owns `/api/track`, and who sends the backend records? | The store keeps `/api/track`; each emitting worker keeps sending its own records with its own token - decided by the round | A new analytics worker owning `/api/track` and draining one central queue - the move served that queue alone, and cost a worker, a binding in every producer and a cutover; with no new worker, `/api/track` keeps the store's session, the SPA and the API gateway keep calling the store, and the package keeps `@grade10/mixpanel` |
| Q2 | Which Mixpanel sends must reach Mixpanel? | Every send a backend fact triggers, server events and profile writes. Browser events, the Audience write each `/api/track` batch repeats, and Datadog counters are not guaranteed | Import-only, leaving profile writes on `waitUntil` - the same outage loses them; first-party track batches too - the browser path stays best-effort |
| Q3 | What happens after a failed send? | Sent again on the shared backoff ladder with no attempt limit; a record Mixpanel refuses is held and raises an alarm, and only an engineer sends it again or removes it - decided by the round | Three delayed requeues (60s / 120s / 180s), then a drop, and a 400 dropped at once (Stakeland AceTrader) - an outage longer than six minutes, or one refused record, lost the event |
| Q4 | What runs where the durable path is missing - local, tests, a branch without the resource? | Nothing is missing: the table ships with its migration like any other, so every environment with a token has one send path - decided by the round | A `waitUntil` fallback when the queue binding is unbound - a second path, and the one that loses events |
| Q5 | Change name and PRD mark? | Keep `add-mixpanel-server-queue`; 🚧 on Product Analytics · Delivery and Mixpanel Events · Events and User Profile - decided by the round | Rename the change - the branch and its draft pull request carry the name; fold into `add-mixpanel-tracking` - that change is already specified |
| Q5b | Exactly-once count on retry? | Every attempt carries the same `$insert_id`, event name, time and distinct_id, the four fields Mixpanel dedupes on (held) | New insert id per attempt - rejected: would double-count under at-least-once send |
| Q7 | Does `/api/track` await Mixpanel, or enqueue? | It awaits Mixpanel, as today: a failure answers 500 and the browser sends the batch again with the same `$insert_id`s - decided by the round | Enqueue, then 200 - a durable queue on a path Q2 leaves best-effort |
| Q10 | Where does a backend record wait until Mixpanel accepts it? | a due row in the emitting worker's own database, written in the transaction that commits the fact it describes - or, where the send follows a due row already committed with the fact (the store's `order_events` drain), in that pass's commit; a send with no stored fact writes its record in a transaction of its own - and sent by that worker's sweep - the shape `docs/conventions/backend.md` sets for a guaranteed side effect - decided by the round | A Cloudflare Queue fed after the commit - it cannot join the transaction, so a worker stopping between the two loses the event as `waitUntil` does today, and it adds a worker, a queue and a DLQ per environment; a reported-at column on each fact's own row - some twenty tables change, and the IP and device a record carries are not stored on them; Workflows, a Durable Object or a nightly re-derivation - the same gap, or the request's context gone |
| Q11 | How soon does a backend record leave for Mixpanel? | On the worker's next sweep, in batches: within 5 minutes on the store, auction and loyalty, 15 on the vault - decided by the round | Sending right after the commit as well, through `waitUntil` or a Cloudflare Queue as a wake path the way auction mail does - seconds instead of minutes, for a second trigger in every emitting request; either can be added later without changing the record |
| Q12 | What does a user's profile end on when a write fails or is held? | The latest write of each property: a held write is never sent over a later one, and a later write is never held up behind it - decided by the round | Later writes wait behind a held one - the profile would freeze until an engineer acts; each write on its own schedule - a retried older Tier would overwrite a newer one, against the latest-snapshot rule `add-mixpanel-tracking` sets |
| Q13 | What happens to an event the backend cannot shape - no user and no device? | It is refused with a counter, and the fact it describes still commits - decided by the round | Rolling the fact back with it - analytics would block money |
| Q14 | What happens to an account's unsent records, waiting or held, when the account is erased? | They are deleted with the account's other personal data; the profile write the erasure itself makes is still sent - decided by the round | Sending them anyway - a record, with the collector IP on it, would reach Mixpanel after the person asked to be forgotten |
| Q15 | What does a worker with no Mixpanel token write? | Nothing: an empty token stays a logged no-op, so a local run, or a brand with no project yet, holds no records - decided by the round | Writing records a sweep never sends - they would pile up in every database without a project |
| Q16 | Is a backlog sent on the first sweep after recovery, or over several? | Over several: a sweep sends up to its budget and the next sweep resumes; the Delivery bound is the time with nothing waiting - decided by the round | Draining every waiting record in one sweep - a sweep with no budget can outrun the worker's limits |
| Q17 | Which Mixpanel answers are a refusal, and which a failure? | A refusal is a record Mixpanel names as failed, or one record too large to send alone; every other answer, a rejected token included, is sent again and alarmed - decided by the round | Holding every record on a rejected token - one bad secret would hold the whole backlog for an engineer |
| Q18 | What happens to waiting records when a worker's token is emptied? | They are kept, and sent once a token returns - decided by the round | Deleting them - they were recorded for a project that still counts on them |
| Q19 | Does erasure delete records that name only a device the person used? | No: they name no account; Mixpanel erasure stays open with Legal - decided by the round | Deleting device-only records too - nothing links a device-only record to the account |
| Q20 | Can a held profile write be sent after a later write of the same property landed? | No: a later write of the same property replaces it, and nothing sends it over the later one - decided by the round | Sending it on an engineer's word - it would overwrite a newer value |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-site/analytics/analytics` | Is a backlog sent on the first sweep after recovery, or over several? | Q16 |
| `grade10-site/analytics/analytics` | Which Mixpanel answers are a refusal, and which a failure? | Q17 |
| `grade10-site/analytics/analytics` | What happens to waiting records when a worker's token is emptied? | Q18 |
| `grade10-site/analytics/analytics` | Does erasure delete records that name only a device the person used? | Q19 |
| `grade10-site/analytics/analytics` | Can a held profile write be sent after a later write of the same property landed? | Q20 |
