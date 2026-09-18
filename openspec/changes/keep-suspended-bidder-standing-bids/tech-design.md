## Context

The auction service already stores active and lifted auction suspensions in
`packages/grade10-auction/backend/src/db/schema/bidderSuspensions.ts`. The
deadline sweep in
`packages/grade10-auction/backend/src/services/bidders/suspension.ts` currently
retracts bids and re-resolves listings, while the older Bidders moderation
route stores a separate `bidders.banned` flag. The shared Users-panel contract
is in `packages/frontend-console/src/user-directory/`; the Grade10 admin
directory composes it through
`packages/grade10-auth/admin-frontend/src/features/directory/users/`.

The change therefore has two seams to reconcile: one auction-standing source
of truth, and a suspension transition that writes no listing or bid rows.

## Goals / Non-Goals

**Goals:**

- Make the active auction suspension the single standing restriction for deadline and operator causes
- Preserve existing bid rows, maxima, prices, leaders, and close-time winner creation
- Expose idempotent, grant-protected suspend and reinstate commands to the Users panel
- Keep operator reason and cause history private to operators while the collector receives generic suspension copy

**Non-Goals:**

- Removing historical `bid_retracted` records
- Renaming the existing Bidders moderation route in the first migration
- Changing platform bans, settlement, store access, or loyalty

## Decisions

The change spec governs the user-visible standing and suspension outcomes. The
implementation reuses the existing suspension aggregate and changes its
transition and read paths rather than adding an account-level suspension table.

- **One standing source** — treat an unlifted `bidderSuspensions` row with
  `scope = 'auction'` as authoritative. Keep `bidders.banned` during the
  expand/contract window only as a deprecated storage column; Bidders reads
  derive its compatibility `banned` field from the active suspension, and its
  writes call the suspension service.
- **No listing mutation on suspension** — remove the
  `retractOnOpenListing` path from the deadline transition. The transition
  locks the order and active suspension row, writes the suspension/log event,
  and commits. It does not lock listings, update bid state, add a bid-history
  event, or re-resolve a price. The normal listing close transaction remains
  the owner of winner creation.
- **New-bid guard** — keep the active-suspension check at the shared bid and
  maximum-raise command boundary. Existing accepted bids remain eligible to
  auto-bid and are evaluated by the normal listing lock and close paths.
- **Cause history** — make `causeOrderId` and `deadlineAt` nullable for an
  operator-originated row. Keep the existing lifecycle log and record a
  deadline cause with `type = 'expired'` and an operator cause with
  `type = 'suspended'`, distinguished by whether an order or actor is present.
  Existing `bid_retracted` rows remain readable but no new one is written.
- **Command boundary** — add grant-protected suspend and reinstate procedures
  beside the existing Bidders procedures. Each takes a stable
  `(storefront, userId)` key, and the write includes a request/idempotency key.
  The service owns the transaction and returns a tagged success or refusal;
  the router owns authentication and wire decoding.
- **Reason visibility** — the operator projection includes cause, actor,
  timestamps, and operator reason. Collector-facing account and notification
  projections expose only the active state and contact guidance. No operator
  reason crosses the collector API boundary.
- **Shared panel contract** — extend `UserAccountPanel` with optional auction
  standing data and separate suspend/reinstate handlers. The panel renders one
  move according to standing and never confirms it. `UserModerationDialog`
  collects a required reason only for suspend; the Grade10 admin consumer
  performs the authenticated mutation.

## Database Schema

The existing `auction.bidder_suspensions` table remains authoritative.

| Table | Change | PostgreSQL shape |
| --- | --- | --- |
| `auction.bidder_suspensions` | Allow operator causes without an order or deadline | `cause_order_id text NULL`; `deadline_at timestamp(3) with time zone NULL` |
| `auction.bidder_suspension_log` | Keep all causes and reinstatements append-only | Reuse existing `type`, `cause_order_id`, `actor_id`, `reason`, and `idempotency_key`; preserve the legacy `bid_retracted` check value for old rows |
| `auction.bidders` | Stop using the duplicate flag as authority | Retain `banned boolean NOT NULL DEFAULT false` during expand/contract; reads and writes no longer depend on it |

The existing partial unique index on `(storefront, user_id, scope)` where
`lifted_at IS NULL` remains the active-row guard. The suspension row is the
aggregate root; the log is its append-only history; bid and listing rows are
not children of the suspension and are not rewritten.

```text
bidder_suspensions 1 ─── many bidder_suspension_log
        │
        └── 0..1 auction_orders (deadline cause)

bidders (compatibility read) ─── active bidder_suspensions (scope = auction)
```

## Service Interfaces

- **`suspendBidder`** — input `{ storefront, userId, actorId, reason,
  requestId, at }`; success returns `{ outcome: "suspended" | "already_suspended",
  suspensionId }`; refusal returns a typed missing-bidder, empty-reason, or
  unauthorized error. It locks the active-row key, inserts the row when
  absent, appends the operator cause, and commits once. Repeating `requestId`
  is a no-op.
- **`reinstateBidder`** — input `{ storefront, userId, actorId, requestId,
  at }`; success returns `{ outcome: "reinstated", suspensionId }`; an absent
  active row returns a typed not-suspended outcome. It locks the active row,
  stamps `liftedAt` and `liftedBy`, and appends one reinstated log entry.
- **`suspendExpiredOrder`** — input `{ orderId, at }`; the existing sweep
  keeps the order lock and transaction, but no longer touches listings. If an
  active row exists it appends the deadline cause idempotently; otherwise it
  inserts the active row with the order and deadline and appends the cause.
- **Bid admission** — the existing bid and maximum-raise commands read the
  active suspension under their normal bidder/listing transaction and refuse
  new commitments. Auto-bid and close commands do not call this admission
  guard, so an existing maximum can continue and can win normally.

For an admin request, the browser sends the account's `storefront` and
`userId` to the Grade10 admin procedure. The elevated router verifies
`auction:moderate`, the service loads the suspension projection, and the
response returns the operator-safe standing and history. Collector requests
use a separate projection that strips operator reason and actor fields.

## Risks / Trade-offs

- `[Risk]` Old code may still read `bidders.banned` → `[Mitigation]` deploy the
  derived read and delegated write path before dropping the column, and test
  both the Bidders route and the new Users-panel route against one active row.
- `[Risk]` A deadline sweep can race an operator suspension → `[Mitigation]`
  serialize both on the active-suspension key and make each cause log write
  idempotent; the row remains active once and both causes survive.
- `[Risk]` Existing retraction history could be mistaken for new behavior →
  `[Mitigation]` preserve legacy log values for reads, assert no new
  `bid_retracted` insert, and add a migration test over pre-change rows.
- `[Risk]` A suspended leader may be skipped by a future bid query →
  `[Mitigation]` keep suspension out of listing resolution and assert that
  close-time resolution considers active maxima without the admission guard.

## Migration Plan

1. Add the nullable suspension fields and derived operator projection while
   retaining `bidders.banned`; regenerate Drizzle metadata and run migration
   checks.
2. Deploy the service and router changes. Backfill any active `banned` bidder
   into one auction suspension with a migration actor and operator-only legacy
   reason before enabling the derived Bidders read.
3. Deploy the shared panel and Grade10 Users integration, then enable the
   operator notice after the authenticated command is live.
4. Observe the suspension transition and bid-resolution metrics. Once no
   reader or writer uses `bidders.banned`, remove that column in a later
   cleanup migration; rollback before that cleanup is a normal code rollback.

