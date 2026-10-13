## Context

Public ledger rows are shaped in
`packages/grade10-auction/backend/src/services/listings/publicVisibility.ts`
(`publicBidOf` / `pseudonymOf`) from
`buildPublicListingBidsQuery`, which today selects only `pseudonymSeq`, amount,
time, state and source — never the bidder email. The site maps
`bid.pseudonym` into `ListingBidHistoryRow.initials`
(`listingLotExtras.ts`), so every avatar becomes **B**.

Bidder email already lives on the bidder row as a storefront snapshot. Live
lot frames reuse `publicBidSchema` for `ledger`.

## Goals / Non-Goals

**Goals:**

- Public listing and live ledger rows carry one avatar character derived from
  the bidder email local part.
- The lot page maps that character into `ListingBidHistoryRow.initials`.
- Readable `pseudonym` stays `Bidder N`.

**Non-Goals:**

- Persisting a new column for the letter (derive at read from email).
- Changing Storybook or `@grade10/ui` exports.
- Avatars on account history, catalogue cards or admin.

## Decisions

1. **Derive at public projection time, not a stored letter**
   - Join the public ledger query to `bidders` for the email snapshot; compute
     the letter in `publicBidOf` (or a sibling helper).
   - Alternatives rejected: store `avatar_initial` on `bids` (duplicates email
     and drifts on erasure); compute in the site from email (email must not
     leave the auction service on the public wire).

2. **Wire field name `avatarInitial`**
   - Add `avatarInitial: Schema.String` (exactly one character after
     projection) on `publicBidSchema` in `@grade10/auction-contracts`. Live
     frames inherit it via `ledger`.
   - Alternatives rejected: overload `pseudonym` (`A_Bidder#1`); a parallel
     array of initials.

3. **Letter rule in one helper beside `pseudonymOf`**
   - First `[A-Za-z0-9]` of the email local part (before `@`), uppercased;
     otherwise **`B`**. Null/blank email (erasure) → **`B`**.
   - Site passes `avatarInitial` straight into `row.initials` so
     `avatarInitial("A")` stays **A** (and fallback **B** is already a letter,
     not `?`).

4. **Lot page mapper only**
   - `listingBidHistory` sets `initials: bid.avatarInitial` (not
     `bid.pseudonym`). No shared-block change.

## API Contracts

| Surface | Change |
| --- | --- |
| `publicBidSchema` | **BREAKING additive:** required `avatarInitial: string` (one character) |
| `public.listing` / public listing state | Each ledger bid includes `avatarInitial` |
| Live lot `ledger` | Same schema; frames carry the letter on each row |
| `ListingBidHistoryRow` | Unchanged export; consumer fills `initials` from `avatarInitial` |

## Risks / Trade-offs

- **[Risk] Public wire gains a letter correlated with email** → Mitigation:
  never return email or name; letter-only; erasure collapses to **B**.
- **[Risk] Ledger query joins bidders on the hot path** → Mitigation: join
  only columns needed for the letter (`email`); keep the existing ledger
  limit and order.
- **[Risk] Older clients omit the field** → Mitigation: required in the
  contract; ship auction-service and site together.

## Migration Plan

1. Land contracts + auction-service projection and tests.
2. Land site mapper + listing tests.
3. No data migration; erased emails already blank on the bidder row.

## Open Questions

None that change the specs or task breakdown.
