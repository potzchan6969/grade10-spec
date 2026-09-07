## Context

The auction already stores bidder commitments in `auction.bids`, writes an
append-only `auction.bid_action_logs` stream, projects bidder standing from
accepted action groups, and serves the combined listing history through the
existing auction contracts. The current implementation still names the
incoming action as a manual bid, filters standing maxima to `source = manual`,
and renders at most one accepted public price per action group.

The product change is therefore a semantic and projection change across the
existing seams, not a new bidding flow. Every accepted submission is an
automatic maximum. The settlement rule remains the current two-maximum rule:
the leader's public price is the lesser of its maximum and one increment above
the next maximum, with the existing tie owner unchanged.

## Goals / Non-Goals

### Goals

- Treat every accepted bidder submission as a configured or raised automatic
  maximum, including legacy callers that still send `amountMinor`.
- Preserve one retained account index and one combined, cursor-paged history.
- Record the challenger's accepted public action before an automatic response
  in the same action group when both records are applicable.
- Implement the eight boundary outcomes in SC-29 through SC-36, including the
  equal-maximum case and the capped response above the leader's maximum.
- Keep submitted maximums and refused maximum attempts private.
- Keep old persisted manual action rows readable without rewriting append-only
  history.

### Non-Goals

- No new bidding endpoint, payment provider, notification channel, or
  settlement algorithm.
- No intermediate bid ladder between the submitted maximum and the resolved
  public price.
- No change to index grouping, filters, paging shape, or `/bids` navigation.
- No rewrite or deletion of historical manual rows.

## Decisions

### Automatic maximum is the canonical submission

`PlaceBidArgs.maximumMinor` is the semantic input. The existing
`amountMinor` compatibility field may remain accepted at the internal boundary,
but it is normalized to `maximumMinor` before validation and never creates a
manual source or manual action-log event. New accepted bidder rows use
`bids.source = auto`; existing `source = manual` rows remain valid historical
commitments and continue to participate in maxima resolution.

The initial accepted private event is
`automatic_max_configured`; a later accepted higher maximum is
`automatic_max_raised`. A server-evaluated refusal is
`automatic_max_refused` with the existing failure-code vocabulary. Browser-only
validation still writes no auction event.

### Append-only storage with legacy read compatibility

The action-log migration adds `automatic_max_refused` and its field
combination to the database constraints. Existing manual action types and
`source = manual` remain allowed for historical rows, but new application
writes stop producing them. Readers accept both generations and map legacy
manual rows through the same history projection until those rows naturally
fall outside retained history.

The `bids` table keeps its existing amount/maximum model and foreign keys. Its
default source may move to `auto` after the code path is explicit, but the
database check continues to accept `manual` so old rows and old settlement
records remain readable.

### One atomic action group, with sequence as the tie-breaker

The hold-capture/acceptance path owns one transaction for resolution, bid-state
changes, hold changes, public action logs, private maximum events, and standing
projection. The action group is idempotent by its existing group identity.

For a challenger who is immediately outbid, the writer inserts the public
accepted-price action for the challenger first, then the automatic response for
the existing leader. The response contains only the resolved public amount;
neither row reveals the leader's hidden maximum. For a challenger who takes the
lead, only the challenger's public accepted-price action is written. For an
equal maximum, the challenger maximum is accepted privately, the earlier leader
remains the leader at the same resolved amount, and the public history emits
one record for the earlier leader at that resolved amount. The challenger does
not receive a separate public record in this tie case, and the single public
record does not reveal the earlier leader's maximum beyond the resolved amount.

The existing identity `bid_action_logs.sequence` is the authoritative ordering
key. Combined-history rendering preserves the normal newest-first page order,
but renders accepted public rows within one action group in ascending sequence
so the challenger precedes the automatic response. Pagination cursors retain
the existing timestamp-plus-sequence stability and are not based on wall-clock
ordering alone.

### Boundary resolution contract

With A at a resolved 400 and maximum 1000, and an increment of 100, the
acceptance writer must produce these public outcomes:

| B maximum | Result | Public records in action order |
| --- | --- | --- |
| 450 | refused | none |
| 500 | B is challenged, A resolves at 600 | B 500, A 600 |
| 700 | B is challenged, A resolves at 800 | B 700, A 800 |
| 950 | B is challenged, A resolves at 1000 | B 950, A 1000 |
| 1000 | A keeps the tie, resolved at 1000 | A 1000 |
| 1001 | B leads at 1001 | B 1001 |
| 1100 | B leads at 1100 | B 1100 |
| 1120 | B leads, capped at 1100 | B 1100 |

This table is an executable contract. The backend SHALL have one deterministic
resolver function, named for the implementation seam as
`resolveAutomaticMaximumOutcome`, that is called once for each accepted
submission. The database transaction loads the current change set and passes
exactly these four values to the function:

- `currentLeaderMaximumMinor`
- `currentBidMinor`
- `incomingMaximumMinor`
- `incrementMinor`

The function SHALL return the acceptance/refusal result, the winning actor,
the resolved public amount, and the optional challenger and automatic-response
public records needed by the action-group writer. It SHALL not read the
database, mutate bids, create action logs, or contain separate repository
branches for individual cases. The transaction adapter applies its returned
change set atomically to bids, holds, listing state, and action logs. This
keeps the boundary rule in one place while leaving persistence and history
projection responsible only for applying and presenting the result.

The resolver SHALL have a corresponding unit-test case for every row in this
table, with the exact input tuple and expected output asserted independently:
(950/B950/A1000), SC-33 (1000/A1000 only), SC-34
(1001/B1001), SC-35 (1100/B1100), and SC-36 (1120/B1100). The tests SHALL
also assert that the response amount never exceeds the current leader's
maximum plus one increment and that the incoming maximum remains private.

The private account history additionally records B's accepted maximum action or
refusal. A receives a standing/outbid transition and any existing notification
behavior when displaced, but no separate bid-history row unless the engine
actually emits a visible automatic response under the table above.

### Contracts and history projection

The auction contract remains the existing combined-history response rather than
introducing a new endpoint. New accepted-price records use automatic source
semantics. The decoder remains tolerant of legacy `manual` source values and
legacy request/refusal action types so old persisted history can be read.

The backend projection changes from “find one accepted row” to “render every
accepted public row in the action group in sequence order.” It maps the new
maximum refusal to the existing refusal presentation with maximum-specific
copy, keeps automatic maximum configuration/raise events private to their
actor, and never includes another bidder's maximum amount.

### Service interfaces and transaction boundaries

The following existing services retain their public boundaries:

- `placeBid` accepts the normalized maximum, checks listing/account/payment
  preconditions, creates the pending commitment, and records only a pending
  standing transition before payment completion. It does not write a public
  accepted record before the hold is capturable.
- The hold-capture acceptance processor resolves the maxima once under the
  listing transaction, writes the accepted action group in the sequence defined
  above, and is safe to retry by group id.
- The acceptance processor obtains the four database values, calls
  `resolveAutomaticMaximumOutcome` exactly once, and applies its returned
  change set; no second resolver or case-specific amount calculation is allowed
  in the persistence or history layers.
- `processBidActionGroup` validates and inserts append-only action rows, then
  rebuilds account standing idempotently. It recognizes both the new automatic
  maximum events and legacy manual events.
- Combined-history reads continue to enforce storefront and account ownership,
  merge public rows with only the requesting account's private rows, and use
  the stable cursor contract.

Before the change, a 700 maximum can produce only an accepted manual action and
one resolved public row for A. After the change, the same acceptance commits B's
automatic maximum, B's public 700 action, A's automatic response at 800, and
the standing transitions as one retry-safe group; B's 700 maximum is never
returned as a private fact to A.

## Database Schema

### Authoritative tables

- `auction.bids` remains the authoritative commitment/settlement record. The
  existing `amount`, `maximum`, `source`, standing, listing, storefront, and
  bidder-account fields remain non-null where they are today; `source = auto`
  is the default for new application writes, while `manual` remains a legacy
  read value.
- `auction.bid_action_logs` remains the immutable audit and public-history
  stream. Its existing sequence identity is the primary key; listing,
  storefront, actor, scope, type, group, source-bid, amount, source type,
  failure code, standing, and timestamps retain their existing ownership and
  nullability rules.

### Constraints and indexes

- Extend the action-type check and field-combination checks for
  `automatic_max_refused`.
- Keep the existing group/type/actor uniqueness and public/account pagination
  indexes; no new index is needed because ordering remains sequence-based.
- Preserve append-only guards and the existing account-erasure exception.
- Do not backfill or rewrite old manual action rows.

### Authoritative versus derived data

Maximums and action logs are authoritative. Listing current price, bidder
standing, and the account index remain derived projections of accepted bids and
action groups. The history response is a read projection; it must not mutate
the action log or bidder state.

## Risks / Trade-offs

- **Legacy vocabulary:** retaining old values makes the storage contract less
  pure, but avoids destructive history rewrites. New-write tests must assert
  that no manual action is emitted.
- **Same-time rendering:** group-local sequence ordering is more precise than
  timestamps, but all readers and cursors must preserve it or the two-record
  cases will appear reversed or duplicate across pages.
- **Equal maximums:** retaining any internal resolver row while suppressing its
  public history representation protects settlement compatibility, but the
  distinction must be covered by action-group and public-history tests.
- **Compatibility input:** accepting `amountMinor` avoids breaking old clients,
  but its tests must prove that it means maximum rather than reintroducing
  manual bidding.
- **Privacy:** challenger public amounts are visible by design in the eight
  cases, while hidden maxima remain private; contract tests must check both the
  positive public records and the absence of rival maximum fields.

## Migration Plan

1. Land the spec-store copy and translation changes, then update the app's
   submodule/store boundary before application code consumes the new vocabulary.
2. Apply an additive database migration for the new refusal type and checks;
   keep legacy manual values and append-only guards intact.
3. Deploy the compatibility-aware contracts, backend writer/resolver, status
   projection, and combined-history reader. New writes use automatic sources
   and action types; old rows remain readable.
4. Deploy the `/bids` history copy and rendering changes, then verify the eight
   cases against backend, contract, and page tests.
5. After the behavior ships, carry the change's Feature set and user journeys
   into the durable spec/manual and archive the change. No data backfill is
   required.

## Open Questions

None. The product decision is that all bids are automatic maximums, manual bids
are not accepted, and the eight boundary outcomes above are the required
history behavior.
