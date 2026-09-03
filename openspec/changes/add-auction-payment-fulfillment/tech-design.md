## Context

See [proposal.md](proposal.md#why) for the product motivation and the
[post-sale capability](specs/grade10-admin/auction/post-sale/spec.md) for the
requirements.

The Auction service already owns the listing row lock, winner settlement,
Stripe capture sweep, payment holds, and a fulfillment row. Its admin UI
currently exposes those concerns as separate Listings, Settlements, and
Fulfillment panels. Settlement state distinguishes capture due, captured, and
capture failed, but does not record a manual source or wire; fulfillment has an
address and the legacy `created → paid → shipped → received` ladder. The global
auction audit chain records elevated mutations, but Stripe and sweep changes do
not pass through it and the chain is not a listing-facing operational trail.

Bidder identity is `(storefront, userId)`. Each storefront backend is the
identity oracle for its users and passes authenticated identity snapshots over
its pinned Auction service entrypoint. The shared Auction worker must not call
another storefront's auth service or expose Stripe identifiers to the admin
browser.

## Goals / Non-Goals

**Goals:**

- Preserve one lock-serialized source of truth for payment and shipment
  transitions, including races between Stripe and an operator.
- Give the admin frontend one decoded, fixture-backed post-sale feature slice
  whose queue and detail do not depend on a running backend.
- Add the new states and trail without rewriting existing captured settlements
  or fulfillment history.
- Keep the global audit chain and the listing operational trail serving their
  different audiences.

**Non-Goals:**

- Replacing the existing capture, release, reconciliation, or notification
  sweeps with a queue or a second state machine.
- Calling the Grade10 identity directory for ZZZ users, or granting finance and
  shipment operators bidder-moderation or identity-console access.
- Introducing a shared `@grade10/ui` block, a design-system variant, a carrier
  address model, or a tracking integration.
- Removing legacy fulfillment columns or states in this change.

## Decisions

### The post-sale surface is one feature slice and one app-owned assembly

Add `features/operations/post-sale` to
`@grade10/auction-admin-frontend`. It is a shallow slice: domain models and a
repository port, decoded procedure datasources, a fixture procedure client,
DI tokens, query/mutation hooks, and one module in `auctionAdminModules`. There
is no forwarding use-case layer because the server owns every transition rule.

`apps/admin/grade10` owns the queue/detail assembly and the caller's selected
listing and outcome filter. It becomes the Auction section's default Queue
panel. Existing catalogue and bidder surfaces remain; the standalone
Settlements and Fulfillment panels retire after their retry and transition
actions are reachable from the listing detail.

Alternatives rejected:

- Extending the three current panels preserves the workflow fragmentation this
  change exists to remove.
- Putting the page in the frontend package would make shared feature code own
  brand application layout and navigation.
- Adding use cases that only call repositories adds a layer with no rule to
  protect.

### One backend projection owns the operator-facing outcome

Create one repository-level SQL outcome expression, parameterized by the
request clock, and use that same expression in queue selection, outcome
filtering, and detail reads. It joins listing, settlement, and fulfillment
state and applies the precedence in the capability spec. `published` listings
derive Scheduled, Live, or Ending soon from the supplied instant; a closed
listing without a settlement is Unsold. Fulfillment `shipped` and `received`
project as Shipped and Delivered. Legacy fulfillment `created` and `paid`
remain pre-shipment and therefore keep the paid outcome.

The queue is keyset-paged by `(updatedAt, listingId)`. An optional closed-set
outcome filter applies to the projection before the page limit. Detail reads
use the same projection, so the same listing cannot acquire a different label
between endpoints at one instant.

Alternatives rejected:

- Persisting the queue outcome duplicates time-dependent Live and Ending soon
  state and requires a new clock sweep only to keep labels current.
- Deriving outcomes independently in TypeScript and SQL lets filtered rows and
  displayed labels drift.
- Loading every listing and filtering in memory makes an operator queue grow
  without a bound.

### Settlement additions distinguish wire and paid source without replacing the ladder

Extend settlement state with `awaiting_wire` and add nullable
`payment_source: "stripe" | "manual"`. Backfill every existing `captured`
settlement to `stripe`. New Stripe success keeps state `captured` and writes
source `stripe`; operator collection writes state `captured` and source
`manual`. The existing capture timestamps and notification ladder remain.

Awaiting wire is a real settlement state rather than a display-only flag, so
the capture work list excludes it by construction. Manual paid and awaiting
wire mark the winner's open hold `release_due` inside the listing transaction;
the existing release sweep performs the provider call.

Alternatives rejected:

- Renaming `captured` to two paid states forces a destructive state migration
  through capture, notification, deletion, and admin code that already relies
  on the settled terminal.
- Inferring manual payment from the absence of a Stripe event cannot prove an
  operator recorded collection.
- Releasing the hold inline in the admin request would put an external call
  inside the money transaction and create a second release path.

### The listing lock arbitrates Stripe and operator payment races

Wire, manual paid, Stripe success, shipment started, and shipment completed all
take the listing row lock and compare-and-set their source rows in the same
transaction as their listing-trail entry. A wire or manual-paid request does
not commit while the winner hold is already `capturing`; it returns a
retryable conflict so the in-flight provider answer can settle first. Once the
capture result lands, either Stripe is the first paid source and the operator
action is refused, or the hold returns to an open state and the operator action
can mark it for release. No path changes the winner.

The capture sweep and verified `payment_intent.succeeded` handling funnel into
the same idempotent Stripe-paid transition. Reconciliation uses that transition
when it discovers a succeeded intent. A settlement in `awaiting_wire` is never
claimed for a new capture.

Alternatives rejected:

- Letting an operator overwrite an in-flight capture can record Manual after
  Stripe already took money.
- Holding a database transaction open across Stripe removes the race but makes
  every bidder wait on a network call and contradicts the existing money-path
  boundary.
- Last-write-wins makes the paid source presentation untrustworthy and can
  hide a double charge.

### Shipment reuses fulfillment storage but exposes only the two required milestones

Keep the fulfillment table and map its existing `shipped` and `received`
states to shipment Started and Completed. Recording shipment started upserts a
row when needed and moves it to `shipped` only from a paid settlement;
recording completion moves only `shipped → received`. The legacy `created` and
`paid` states are accepted as pre-shipment rows but are no longer operator
steps. The paid source remains on the settlement after shipment wins the queue
outcome.

The existing JSON address column stores one app-neutral `{ formatted: string }`
value. A shipment operator can set it only while it is absent; the write does
not move fulfillment state. A formatted offline address is the smallest shape
that satisfies this manual, carrier-free workflow without inventing a country
or rate-shopping contract.

Alternatives rejected:

- Creating a second shipment table duplicates the existing listing key,
  address, proof-document ownership, and erasure rules.
- Keeping `created` and `paid` as visible milestones adds two operator steps the
  capability explicitly reduces to Started and Completed.
- Designing structured international address fields here would make product
  decisions reserved for the later address-collection flow.

### A dedicated append-only table is the listing trail

Add `listing_trail_entries`, ordered deterministically by `(createdAt, id)` and
indexed by listing. Each row is either an outcome change or a comment. Outcome
rows carry actor kind (`operator`, `stripe`, or `system`), an actor identifier
and display snapshot where applicable, and previous/new operator outcomes.
Comment rows carry only the trimmed comment and operator snapshot. Database
checks keep those two shapes disjoint, and the same trigger pattern as the
audit chain refuses update, delete, and truncate.

The trail API is cursor-paged and the detail supplies its first page. Stripe
success names Stripe; capture give-up names the system; operator transitions
and comments use the fresh elevated session. Winner email and address are
never copied into an event. The existing audit middleware continues to append
every elevated mutation separately; its hashes and infrastructure fields are
not exposed through the listing trail.

Alternatives rejected:

- Filtering the global audit chain misses sweep and Stripe events, exposes the
  wrong fields, and couples an operator timeline to a compliance structure.
- Reconstructing history from current settlement and fulfillment rows loses
  actors, comments, and previous outcomes.
- Making comments editable contradicts both the operational record and the
  capability contract.

### Winner contact is a storefront-authenticated snapshot

Extend bidder registration, bid, and watch inputs with the optional name from
the authenticated storefront session, and refresh it beside the existing
email snapshot. A won-listing detail joins the winning bid to that bidder and
returns storefront, email, optional name, and the fulfillment address. It
never selects Stripe customer, payment-method, or fingerprint columns.

This preserves the pinned-entrypoint trust boundary: Grade10 and ZZZ each
vouch for their own user's snapshot, while the shared Auction worker does not
query the wrong identity directory. Queue access alone is sufficient to read
the winner block.

Alternatives rejected:

- Calling Grade10 auth with a ZZZ user id can resolve the wrong person and
  cannot satisfy the storefront boundary.
- Requiring `user:list` couples winner contact to bidder moderation and would
  deny the new finance role.
- Using Stripe customer data as identity leaks provider identifiers onto an
  operational surface.

### RBAC adds payment and shipment grants without reusing catalogue grants

Add `auction:payment` and `auction:shipment` to the shared permission
vocabulary. `finance` receives `auction:read` and `auction:payment`; `staff`
keeps its current catalogue and floor grants and receives
`auction:shipment`; `admin` receives both through the complete permission
set. Existing `auction:operate` continues to govern publishing, scheduling,
and notification operations. Existing `auction:settle` remains the admin-only
grant for canceling live sales/listings and release-recovery operations.

Post-sale payment routes use `auction:payment`, shipment/address routes use
`auction:shipment`, reads and comments use `auction:read`, and capture retry
moves from `auction:settle` to `auction:payment`. The app computes disabled
controls with `hasPermission` from the same vocabulary; it does not compare
role names.

Alternatives rejected:

- Reusing `auction:operate` would let catalogue floor staff record payment and
  makes publishing accidentally depend on shipment authority.
- Granting `auction:settle` to finance also grants cancellation, which is not a
  payment-processing job in this capability.
- Hiding forbidden controls makes an operator read a missing step instead of a
  step assigned to another role.

### Contracts decode every post-sale response at the browser boundary

Add the outcome, queue page, detail, winner, payment, shipment, trail, and
mutation-result Effect schemas to `@grade10/auction-contracts/admin`. The
backend declares those schemas as tRPC outputs. The admin procedure port keeps
returning `unknown`; its post-sale datasource decodes every answer before the
repository returns a domain model. Fixture procedures implement the same
transitions and refusals, letting the frontend group run independently of the
backend group.

Alternatives rejected:

- Inferring the router type alone does not protect a browser bundle left open
  across a deploy.
- Defining frontend-only response types creates a second wire contract.
- Testing pages against a running worker couples frontend delivery to backend
  completion and leaves the DI/decode seam unproved.

## Risks / Trade-offs

- [A capture is already in flight when an operator chooses wire or manual]
  → Refuse with a retryable conflict until the provider result is reconciled;
  never let the operator overwrite an uncertain charge.
- [Outcome SQL changes without its filter changing] → One expression supplies
  both selected outcome and filter predicate, with scenario tests at the
  60-minute boundary and every precedence rung.
- [Existing captured rows have no source] → Backfill them to Stripe before new
  code reads the source as required.
- [Legacy fulfillment rows use extra states] → Treat `created` and `paid` as
  pre-shipment and retain them; do not manufacture trail history for events
  whose actor and time cannot be proved.
- [The new trail duplicates a subset of audit facts] → Keep purposes explicit:
  the trail is listing-scoped domain history; the audit chain remains the
  privileged-action compliance record.
- [A free-form address cannot power carrier automation] → That is deliberate
  for the manual MVP; the later address-collection/carrier change owns a
  structured migration.

## Migration Plan

1. Apply an additive Auction database migration before the application deploy:
   add bidder name and settlement payment source, allow `awaiting_wire`, create
   the append-only listing-trail table and indexes, and backfill every existing
   captured settlement to source `stripe`.
2. Deploy the shared contracts/RBAC and both auth workers before the Auction
   worker and admin SPA so the `finance` role and new grants are understood at
   every gate.
3. Deploy the Auction worker. Existing rows continue to project through the
   legacy fulfillment mapping; new mutations begin writing trail entries.
4. Deploy the Grade10 admin SPA and verify queue filtering, Stripe/manual
   labels, disabled controls for staff/finance, and the payment-to-shipment
   path on staging.

Rollback keeps the additive columns and trail table. Before rolling the
Auction worker back, convert any `awaiting_wire` settlement to
`capture_failed` and leave its hold on the release ladder; old code already
treats captured manual rows as terminal and therefore cannot charge them
again. Do not reverse the migration or delete trail entries. A later cleanup
change may remove legacy fulfillment states only after every deployed reader
has stopped naming them.
