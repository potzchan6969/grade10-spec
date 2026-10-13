## Decisions

- Derive the 5-character listing-code candidate from the listing's immutable
  system UUID with the approved keyed one-way projection. The UUID is never
  exposed, and the stored code is never regenerated when the allocator changes.
- Allocate the code in the same transaction as the first successful explicit
  draft save. Insert the candidate into a permanent reservation table with a
  unique key; retry a new projection after a conflict. The reservation remains
  after listing deletion.
- The launch has no production listings to backfill. Grade10 stores no legacy
  title-only address or redirect; every production code is allocated by the
  first-draft-save transaction.
- Generate the initial slug from the normalized title and the lower-case stored
  code. Reserve space for the hyphen and suffix before truncating the title
  portion to 64 characters. Use `lot` when the normalized title is empty.
- Track the last generated slug value while a draft is editable. A title edit
  may replace only that untouched generated value; an operator-edited slug is
  preserved.
- Run the same case-insensitive slug reservation query on Slug field exit and
  on Save. The field-exit result is advisory; the database unique constraint
  and transaction remain authoritative for races.
- Keep the lower-case code suffix in the canonical public address, but omit the
  code as a labelled value from public page data, HTML and metadata. The code
  is not an alternate route.

## Boundaries

- `packages/grade10-auction/backend/src/db/schema/listings.ts` and
  `packages/grade10-auction/backend/src/db/schema/listingCodes.ts` own the
  listing code, slug columns, unique indexes and permanent code reservations.
- `packages/grade10-auction/backend/src/services/listings/listingCode.ts`
  owns UUID projection and collision retry. Draft persistence and generated
  slug decisions belong in `services/listings/draft.ts`; create and schedule
  gates stay in `services/listings/schedule.ts`.
- `packages/grade10-auction/backend/src/repositories/listings.ts` owns the
  reservation query used by field-exit feedback and Save. The API maps a
  collision to a safe availability result without revealing the other listing.
- Admin listing form and table surfaces show the code under existing listing
  access. The public listing projection and metadata omit the labelled code
  while retaining the canonical slug.
- Winner-order services consume the stored code for payment references,
  invoice IDs and newly issued receipt IDs. Receipt allocation occurs with a
  finalized full or partial payment: an invoice-scoped sequence starts at `1`,
  stays unpadded and commits atomically with the receipt. Historical receipt
  IDs remain unchanged; refunds, reversals and voids allocate none. Stripe
  metadata uses `payment_reference_code`; provider IDs remain internal.

## Concurrency and retention

- A field-exit availability result can become stale. Save must recheck inside
  its transaction and translate a unique violation to the existing slug-taken
  refusal without changing the draft.
- A code or slug held by a completed, expired or unsold listing remains
  unavailable according to the existing reservation rule. A called-off listing
  leaves browse and search but keeps its canonical URL directly accessible.
- The UUID projection is not assumed collision-free. The unique reservation
  key is the final authority, and bounded retry fails loudly if allocation is
  exhausted.

## Rejected alternatives

- Title-only slugs with `-2`, `-3` retries are not the generated default: they
  are order-dependent under concurrent saves and can change after deletion.
- A random suffix is not the generated default: the settled listing-code
  contract requires deriving the candidate from the system UUID.
- Checking slug availability only in the browser is insufficient: it cannot
  close the race between blur and Save.
- Releasing slugs or codes when a listing is completed, expired, unsold or
  called off would break stable historical addresses and the existing
  reservation rule.
