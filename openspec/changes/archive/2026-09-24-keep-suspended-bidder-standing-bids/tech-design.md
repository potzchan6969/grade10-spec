## Context

The auction service already persists active auction suspensions in
`packages/grade10-auction/backend/src/db/schema/bidderSuspensions.ts` and
records deadline suspensions from
`packages/grade10-auction/backend/src/services/bidders/suspension.ts`. The
current expiry path retracts open bids, while the Bidders moderation path keeps
a separate `bidders.banned` flag. The shared account panel is already exported
from `packages/frontend-console/src/user-directory/`; the Grade10 auth admin
feature composes it from `packages/grade10-auth/admin-frontend/`.

The change keeps the existing auction row-lock and append-only audit patterns.
It changes the suspension transition, unifies the active standing, and adds the
Users-panel command without moving auction data into auth.

## Goals / Non-Goals

**Goals:**

- Make one active auction suspension the source of truth for deadline and operator causes
- Preserve existing bid rows, maxima, leaders, prices, and close behavior when suspension starts
- Keep the new-bid guard, operator authorization, reason privacy, and audit history explicit
- Expose a compatibility projection so existing Bidders consumers can migrate without a wire break

**Non-Goals:**

- Replacing the shared account-panel package or changing the platform-ban model
- Rewriting already-recorded `bid_retracted_suspension` history
- Adding a new auction-admin Bidders surface or bulk controls

## Decisions

- **One standing source** — `bidder_suspensions` remains authoritative for an
  active auction suspension. The Bidders list's `banned` value is derived or
  adapted from that active row during the migration window; the existing field
  is not used by new bidding guards. A second independent boolean is rejected
  because it can let the Bidders panel and Users panel disagree.
- **Cause history** — keep one active suspension row and append entries to
  `bidder_suspension_log`. A deadline cause carries the expired order; an
  operator cause carries the actor and reason. Reinstatement locks the active
  row, marks it lifted, and appends one event. Existing `bid_retracted` log
  values remain readable but are never written by the new path.
- **Suspension transition** — change
  `packages/grade10-auction/backend/src/services/bidders/suspension.ts` so the
  deadline sweep locks the order and suspension row, records a new cause when
  needed, and does not call the bid repository or listing resolver. The existing
  listing lock remains owned by bid placement and close, so accepted maxima
  continue through the ordinary auto-bidding path.
- **Bid guard** — the service that accepts a new bid or maximum raise reads the
  active auction suspension under the bidder's standing check and refuses the
  write. It does not filter or rewrite prior `top` or `outbid` rows. Closing a
  listing continues to derive a winner from current maxima, including a
  suspended account.
- **Admin mutation** — add idempotent suspend and reinstate processors beside
  the existing bidder moderation services and expose them through the auction
  admin procedure client. Both procedures require `auction:moderate`; suspend
  requires a non-empty reason, reinstate does not. The server is the authority
  even when the panel hides a control.
- **Public and operator projections** — widen the operator projection to carry
  cause source, actor, timestamp, and reason. The collector projection carries
  the standing and contact copy only; an operator's reason never crosses the
  collector boundary. Keep these projections separate rather than reusing the
  current winner-order suspension shape for both audiences.
- **Shared panel contract** — extend
  `packages/frontend-console/src/user-directory/UserAccountPanel.tsx` with
  optional handler-gated auction-standing actions and state. The panel reports
  the requested action; `UserModerationDialog` remains the confirmation owner.
  `packages/grade10-auth/admin-frontend/` supplies the handlers and maps the
  result into the Users-panel account record.

## Database Schema

Reuse `auction.bidder_suspensions` and `auction.bidder_suspension_log`; do not
create a second suspension table.

| Table | Change | Authority |
| --- | --- | --- |
| `auction.bidder_suspensions` | Make `cause_order_id` and `deadline_at` nullable for operator-only causes; keep the partial unique index on `(storefront, user_id, scope)` where `lifted_at IS NULL` | One active auction standing per bidder |
| `auction.bidder_suspension_log` | Preserve historical event values, add the operator/deadline cause distinction through nullable `cause_order_id` and actor metadata, and keep the idempotency unique index | Append-only cause and reinstatement history |
| `auction.bidders` | Backfill active `banned` rows into `bidder_suspensions`; retain `banned` as a compatibility projection until all callers use the suspension service | Legacy wire compatibility only |

The migration is additive/expand-first: allow nullable cause fields, backfill
legacy active bans with an operator-migration cause, then switch reads and
writes to the suspension service. It does not delete old retraction logs.

Relevant relationships:

```text
auction.bidders (storefront, user_id)
        │
        └──< auction.bidder_suspensions (active auction standing)
                    │
                    └──< auction.bidder_suspension_log (causes and reinstatement)
                                      │
                                      └──> auction.auction_orders (deadline cause, nullable)
```

## Service Interfaces

- **Suspend from Users** — input `{ storefront, userId, actorId, reason,
  idempotencyKey, at }`; success returns the active suspension projection;
  refusal returns `BIDDER_NOT_FOUND`, `ALREADY_SUSPENDED` only for a repeated
  command with no new cause, or `REASON_REQUIRED`. The transaction locks the
  bidder and active suspension, inserts or appends the cause, writes the audit
  event, and commits before notification.
- **Suspend expired order** — input `{ orderId, at }`; success returns the
  suspension id and cause outcome. The transaction locks the order, checks the
  pending deadline, then inserts or appends the deadline cause. It never
  updates bids, listings, or bid history.
- **Reinstate** — input `{ storefront, userId, actorId, idempotencyKey, at }`;
  success returns the lifted projection; refusal returns `NOT_SUSPENDED` or
  `STALE_COMMAND`. The transaction locks the active row, marks it lifted,
  appends the event, and commits once.
- **Bid acceptance** — input remains the existing bid/raise command; the
  suspension guard reads the active standing before inserting or updating a bid.
  A refusal has the existing suspension error shape and does not mutate a
  standing maximum.

For every multi-row mutation, the order is bidder/suspension lock, cause or
lift write, append-only log write, then commit. Notification fanout runs after
commit and is idempotent on the suspension-log sequence. Listing locks are not
held by suspension transitions, avoiding a cross-listing lock loop.

## API Contracts

- Add authenticated admin procedures for auction suspend and reinstate under
  the existing `auction:moderate` grant.
- Keep the existing Bidders list `banned` field and ban/unban procedure during
  migration, but implement them through the same suspension service and return
  the compatibility projection.
- Add auction standing and handler capability fields to the shared
  `UserAccountPanel` props; do not add a new public component export.
- Split the winner-facing suspension projection from the admin projection so
  operator reason, actor, and audit metadata are not returned to a collector.

## Risks / Trade-offs

- **Legacy bans could disappear during migration** → backfill them under a
  locked transaction and keep the compatibility projection until reads and
  writes are switched.
- **A deadline sweep could race a new bid or close** → use the existing bidder
  and listing transaction boundaries; the bid path remains the only writer of
  new commitments and the close path remains the only resolver at close.
- **A duplicate operator command could create duplicate causes** → require an
  idempotency key on the command and enforce it in the append-only log.
- **Reason privacy could leak through a shared contract** → use separate
  collector and operator schemas and assert the omission in contract tests.

## Migration Plan

1. Add nullable cause fields and the compatibility read path; backfill active
   `banned` bidders into active auction suspensions.
2. Deploy the service and router changes that use the suspension row for bid
   guards and route Bidders actions through it.
3. Deploy the deadline transition that records causes without touching bids,
   then deploy the Users-panel handlers and collector/operator projections.
4. Verify the backfill count, active-standing count, and cause-log count before
   removing any legacy `banned` writes in a later cleanup.

Rollback before step 3 is a normal application rollback. After the transition
change is live, rollback is a forward compatibility release: it must not
restore bid retraction, because doing so would make previously preserved bids
change after the fact.

## Open Questions

None. The remaining choices are implementation details covered by the existing
architecture and the decisions above.
