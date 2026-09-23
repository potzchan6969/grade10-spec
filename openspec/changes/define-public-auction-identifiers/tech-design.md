## Scope

This plan covers the settled identifier behavior. Existing listing-admin read
access governs the code, which is shown in both the Listings table and the
listing detail screen; knowing a code cannot grant admin access or private
data. Previously cached previews may persist without a purge or regeneration
guarantee, while the current public page and fresh metadata fetches omit the
code and private data.

## Shape

- Persist one opaque listing/payment reference on the listing record. A keyed
  one-way candidate over an internal system UUID or listing ID is permitted,
  but the 5-character projection can collide.
- Allocate under a uniqueness check with retry against active codes and
  retained reservations. Deletion never releases a code.
- Keep the public projection separate from the internal UUID/listing ID and
  never expose or reversibly encode the internal value.
- Build invoice IDs from the unchanged payment reference and an issuance
  sequence starting at `01`, with at least two digits and continuation as
  `100` after `99`.

## Boundaries

- `packages/grade10-auction/backend/src/db/schema/listings.ts` owns the stored
  listing code and the uniqueness/reservation data. Verify the existing schema
  export and migration conventions before choosing whether retained codes use
  a reservation table or a tombstone column.
- Listing creation and schedule/repository paths own allocation and persistence;
  use the existing `schedule.ts` and repository seams rather than deriving a
  code in the UI or in a winner-order request.
- `packages/grade10-auction/backend/src/services/auctions/winnerInvoice.ts`
  owns invoice-sequence allocation and old-invoice lookup. The sequence must
  preserve the existing two-digit minimum and continue to three digits after
  99.
- The Stripe creation/webhook path carries the payment reference in
  `payment_reference_code` metadata and keeps provider references internal.
- Winner-order projections consume the stored reference. Public listing-page
  projections omit it. Receipt content and receipt breakdown remain outside
  this change.
- The admin surfaces are the existing Listings table and `AuctionListingPage`.
  Both use existing listing-admin read access and display the same read-only
  code; the code is not an access token.

- The canonical public listing URL remains directly accessible for a called-off
  listing after the listing is removed from browse and search. The listing code
  remains a non-route and never resolves as a public URL. Explicit hard deletion
  is outside this change, so its page accessibility is unspecified.

## Concurrency and retention

Allocation must be atomic: a failed unique insert retries a new candidate in
one create operation. A deleted listing's code remains reserved. A stored code
is never regenerated when hashing or allocator implementation changes. The
called-off listing's canonical URL remains reserved and directly accessible,
even though browse and search omit the listing.
