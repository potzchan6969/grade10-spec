## Purpose

What Grade10 records in Mixpanel: the collector events, who may send
each name, how a visitor is named, the user-profile snapshot, what never
leaves the site, and what reaches Mixpanel after a Mixpanel or worker
failure. SQL records stay the ledger. Datadog counters stay how-often.
Identity rules in `shared/auth/session` still name a signed-in person by
user id and an anonymous visit by device.

## Feature set

- Delivery
  - Recorded with the fact: a backend send exists for every fact that commits and for none that rolls back
  - Sent until accepted: a failed backend send is sent again with no attempt limit, and counts once
  - Held on refusal: a record Mixpanel refuses waits for an engineer, counted and alarmed, never dropped
  - Latest profile write: a profile ends on the latest write of each property, whatever failed or was held
  - Erased with the account: an erased account's unsent records go with it
  - No project, no record: a worker with no Mixpanel token writes nothing
  - Browser and counters best effort: `/api/track` and Datadog keep today's path

## ADDED Requirements

### Requirement: A backend Mixpanel send is recorded with the fact it describes

Each backend send to Mixpanel is a record kept in the emitting worker's own
database until Mixpanel accepts it.

- **With the fact** - A server event or profile write that a backend fact triggers SHALL be recorded in the same commit as that fact, so it exists for every fact that commits and for none that rolls back.
- **After a drained record** - Where the send follows a record the worker already committed with the fact, it SHALL be recorded in the commit that marks that record done.
- **No stored fact** - A send that describes no stored fact SHALL be recorded in a commit of its own before the request that raised it answers.
- **Frozen** - A record SHALL keep the event name, time, distinct_id and `$insert_id` it was recorded with, and every attempt SHALL send those same values.
- **Once per key** - Recording a second event with an `$insert_id` the worker already keeps SHALL NOT add a second record.

#### Scenario: grade10-site-analytics-SC-46 - A committed fact has its record
**Serves:** Delivery - a paid order's event exists once its payment commits

- **GIVEN** a backend fact that triggers a Mixpanel event
- **WHEN** the fact commits
- **THEN** the worker keeps one record for that event
- **AND** the record is sent even if the worker stops right after the commit

#### Scenario: grade10-site-analytics-SC-47 - A rolled-back fact has none
**Serves:** Delivery - a failed write leaves nothing to send

- **GIVEN** a backend fact that triggers a Mixpanel event
- **WHEN** the transaction writing the fact rolls back
- **THEN** the worker keeps no record for that event
- **AND** Mixpanel never receives it

#### Scenario: grade10-site-analytics-SC-48 - A replayed fact records once
**Serves:** Delivery - a replayed webhook or reconcile pass counts once

- **GIVEN** a record already held for an event
- **WHEN** the same fact is processed again and records an event with the same `$insert_id`
- **THEN** the worker still keeps one record for it

### Requirement: A backend record is sent until Mixpanel accepts it

Each worker's scheduled sweep sends the records waiting in its database.

- **On the sweep** - A worker SHALL send its due records on its scheduled sweep, in batches Mixpanel accepts.
- **Accepted** - A record Mixpanel accepts SHALL be removed.
- **Sent again** - A record whose send fails for any reason other than Mixpanel refusing it SHALL be sent again on a later sweep, backing off, with no attempt limit.
- **Counted once** - A record sent more than once SHALL count once in Mixpanel.

#### Scenario: grade10-site-analytics-SC-49 - A waiting record is sent on the next sweep
**Serves:** Delivery - a backend event reaches Mixpanel within a sweep

- **GIVEN** a record waiting in a worker and Mixpanel accepting sends
- **WHEN** the worker's sweep runs
- **THEN** Mixpanel receives the record
- **AND** the worker no longer keeps it

#### Scenario: grade10-site-analytics-SC-50 - An outage delays but does not lose
**Serves:** Delivery - a long Mixpanel outage loses no backend event

- **GIVEN** records waiting in a worker
- **AND** Mixpanel failing every send for many sweeps
- **WHEN** Mixpanel recovers and the worker's next due sweep runs
- **THEN** Mixpanel receives every waiting record

#### Scenario: grade10-site-analytics-SC-51 - A lost acknowledgement counts once
**Serves:** Delivery - a send repeated after a lost ack counts once

- **GIVEN** a record Mixpanel accepted whose acknowledgement never reached the worker
- **WHEN** the worker sends the record again
- **THEN** Mixpanel counts the event once

### Requirement: A record Mixpanel refuses is held, counted and alarmed

A refusal is judged record by record, and a held record waits for an engineer.

- **Per record** - When Mixpanel refuses some records of a batch, only those records SHALL be held; the rest SHALL be treated as accepted.
- **Held** - A held record SHALL NOT be sent again by the sweep and SHALL NOT be deleted by it.
- **Visible** - Each worker SHALL report, on every sweep, how many records wait, the age of the oldest, and how many are held, and a held record SHALL raise an alarm.

#### Scenario: grade10-site-analytics-SC-52 - One refused record in a batch
**Serves:** Delivery - one bad record does not hold its neighbours

- **GIVEN** a batch of waiting records of which Mixpanel refuses one
- **WHEN** the worker's sweep sends the batch
- **THEN** the refused record is held
- **AND** Mixpanel receives the other records

#### Scenario: grade10-site-analytics-SC-53 - A held record stays until an engineer acts
**Serves:** Delivery - a refused record is never dropped

- **GIVEN** a held record
- **WHEN** later sweeps run
- **THEN** the record is neither sent nor deleted
- **AND** the held count reports it

### Requirement: A user's profile ends on the latest write of each property

Profile writes follow the latest-snapshot rule whatever fails.

- **Latest wins** - For each profile property, the value Mixpanel ends on SHALL be the latest one written for that user.
- **Not held up** - A later profile write SHALL NOT wait behind an earlier one that is held.

#### Scenario: grade10-site-analytics-SC-54 - A retried older write does not overwrite a newer one
**Serves:** Delivery - a retried Tier never overwrites a newer Tier

- **GIVEN** a user's Tier write that failed and waits to be sent again
- **AND** a later Tier write for the same user
- **WHEN** the worker's sweep sends the user's profile
- **THEN** the user's profile ends on the later Tier

#### Scenario: grade10-site-analytics-SC-55 - A held write does not block a later one
**Serves:** Delivery - a later profile write passes a held one

- **GIVEN** a held profile write for a user
- **WHEN** a later profile write for that user is recorded and the sweep runs
- **THEN** Mixpanel receives the later write

### Requirement: An erased account's unsent records are deleted with it

Erasure reaches the records waiting for Mixpanel.

- **Deleted** - Erasing an account SHALL delete every unsent record for that account in every worker that keeps one, waiting or held.
- **Erasure's own write** - The profile write the erasure itself makes SHALL still be sent.

#### Scenario: grade10-site-analytics-SC-56 - Erasure deletes waiting and held records
**Serves:** Delivery - a forgotten collector's records never reach Mixpanel

- **GIVEN** an account with a waiting record and a held record
- **WHEN** the account is erased
- **THEN** the worker keeps neither record
- **AND** neither reaches Mixpanel
- **AND** the profile write the erasure makes is still sent

### Requirement: A worker with no Mixpanel token records nothing

- **No-op** - A worker with no Mixpanel token SHALL record no backend send and SHALL log that it has none.

#### Scenario: grade10-site-analytics-SC-57 - An empty token records nothing
**Serves:** Delivery - a brand with no project yet keeps no records

- **GIVEN** a worker with no Mixpanel token
- **WHEN** a backend fact that triggers a Mixpanel event commits
- **THEN** the worker keeps no record for it

### Requirement: Browser events and Datadog counters stay best effort

- **Browser** - `/api/track` SHALL await one Mixpanel request per batch and answer 500 when it fails, and SHALL NOT keep the batch.
- **Counters** - Datadog counters SHALL NOT be recorded for a later send.

#### Scenario: grade10-site-analytics-SC-58 - A failed browser batch is not kept
**Serves:** Delivery - browsing stays on the browser's own retry

- **GIVEN** Mixpanel failing sends
- **WHEN** the browser posts a batch to `/api/track`
- **THEN** the route answers 500
- **AND** no worker keeps a record for the batch
