## 1. Product record (grade10-spec)

- [ ] 1.1 Update the auction management and listing display pages for first-save
  code allocation, the title-and-code generated slug, retained-address note,
  public URL suffix, and the unchanged public-page disclosure boundary.
  - Covers: grade10-admin-auction-listing-SC-87, SC-118-SC-123,
    grade10-site-auction-listing-page-SC-20-SC-28, and
    grade10-site-auction-lot-status-SC-13.
  - Verification: `pnpm check:manual` in the registered `grade10-spec` store.

## 2. Listing persistence and allocation (grade10) (owner: @htonyl)

- [ ] 2.1 Add the listing-code reservation data and UUID-derived candidate
  projection. Allocate on the first successful explicit draft save, retrying
  unique conflicts atomically and retaining reservations after deletion.
  - Covers: grade10-admin-auction-listing-SC-87, SC-90-SC-93.
  - Verification: `pnpm run test:backend` and the schema migration checks.

- [ ] 2.2 Generate and persist the initial slug from normalized title words and
  the lower-case listing-code suffix, including the `lot` fallback and 64-
  character bound. Preserve an operator-edited slug across title edits.
  - Covers: grade10-admin-auction-listing-SC-118-SC-121.
  - Verification: slug service and repository tests, then `pnpm run test:backend`.

- [ ] 2.3 Expose slug availability on Slug field exit without private details,
  retain the completed/expired/unsold reservation rule, and keep Save
  authoritative when a field-exit result races another listing.
  - Covers: grade10-admin-auction-listing-SC-122-SC-123.
  - Verification: API and repository collision tests, then `pnpm run test:backend`.

## 3. Admin listing surfaces (grade10) (owner: @htonyl)

- [ ] 3.1 Show the stored listing code read-only in the Listings table and
  listing detail screen for existing listing-admin readers. Keep code knowledge
  from granting access or exposing private listing data.
  - Covers: grade10-admin-auction-listing-SC-87-SC-94.
  - Verification: admin frontend tests and `pnpm run build` for the affected app.

## 4. Public listing address (grade10)

- [ ] 4.1 Resolve the generated canonical slug with its lower-case code suffix,
  omit the labelled code from public HTML, metadata and client data, and keep
  the code from resolving as an alternate route.
  - Covers: grade10-site-auction-listing-page-SC-20-SC-27 and
    winner-order-SC-127.
  - Verification: public projection tests and `pnpm run test:backend`.

- [ ] 4.2 Keep a called-off listing's canonical URL directly accessible while
  removing it from browse and search; retain both the URL and code reservations.
  - Covers: grade10-site-auction-listing-page-SC-28 and
    grade10-site-auction-lot-status-SC-13.
  - Verification: lot-status and public-route tests, then `pnpm run test:backend`.

## 5. Winner-order and payment references (grade10)

- [ ] 5.1 Carry the stored listing code into the winner order as its payment
  reference, derive invoice IDs with a two-digit sequence that reaches `100`,
  preserve old-invoice lookup, and keep receipt format unchanged.
  - Covers: winner-order-SC-97-SC-98, SC-114, and SC-122-SC-128,
    SC-209, and SC-211.
  - Verification: winner-invoice and contract tests, then `pnpm run test:backend`.

- [ ] 5.2 Write the payment reference to Stripe metadata under
  `payment_reference_code` while keeping provider references internal.
  - Covers: winner-order-SC-210.
  - Verification: Stripe adapter tests and `pnpm run test:backend`.

Receipt identifier and receipt-breakdown behavior remains owned by the
receipt/payment changes and is not added here.
