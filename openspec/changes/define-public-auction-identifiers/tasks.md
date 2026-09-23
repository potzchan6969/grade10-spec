## 1. Product record (grade10-spec) (owner: @htonyl)

- [ ] 1.1 Reconcile the listing/invoice identifier wording, including permanent
  code and URL reservation, settled admin access and placement, cached-preview
  limits, and sequence continuation after `99`.
  - Verification: `pnpm check:manual` in the registered `grade10-spec` store.

## 2. Listing identifier data (grade10) (owner: @htonyl)

- [ ] 2.1 In `packages/grade10-auction/backend/src/db/schema/listings.ts`, add
  the stored listing/payment reference and the uniqueness/retention mechanism
  required to keep deleted codes unavailable. Verify the existing schema and
  migration exports before selecting a reservation table or tombstone column.
  - Covers: `grade10-admin-auction-listing-SC-87`–`SC-93`.
  - Verification: schema/type checks, create/collision retry and deleted-code
    retention checks.

- [ ] 2.2 In the existing listing creation and schedule/repository paths, add
  atomic candidate allocation with retry. The candidate may be derived from an
  internal UUID/listing ID, but no projection is assumed collision-free and no
  internal value is exposed.
  - Covers: `SC-91`, `SC-92`, `SC-93`.
  - Verification: concurrent create and retained-reservation checks.

## 3. Invoice and payment-reference contracts (grade10)

- [ ] 3.1 In `packages/grade10-auction/backend/src/services/auctions/winnerInvoice.ts`,
  consume the stored listing/payment reference and allocate invoice IDs with
  the existing two-digit minimum, continuing as `100` after `99`. Preserve
  lookup by replaced invoice ID and unchanged payment reference.
  - Covers: `winner-order-SC-114`, `SC-122`, `SC-123`, and `SC-124`.
  - Verification: invoice issuance, reissue, lookup and 99-to-100 boundary
    checks.

- [ ] 3.2 Update winner-order/API projections to carry the stored reference,
  keep it visible on invoices for card and bank transfer, and omit it from the
  public listing page. Do not add receipt breakdown or receipt-format behavior.
  - Covers: `winner-order-SC-125`–`SC-128`, `SC-209`, and `SC-211`.
  - Verification: contract and public-projection checks.

## 4. Stripe reconciliation (grade10)

- [ ] 4.1 Carry the stored payment reference into Stripe metadata under
  `payment_reference_code` through the existing Stripe creation/webhook path;
  keep provider references internal.
  - Covers: `winner-order-SC-210`.
  - Verification: metadata and winner-surface checks.

## 5. Admin surfaces and public address (owner: @htonyl)

- [ ] 5.1 Show the stored code read-only in the existing Listings table and
  `AuctionListingPage` for operators with existing listing-admin read access;
  ensure a known code cannot grant access or disclose private data.
  - Covers: `grade10-admin-auction-listing-SC-87`, `SC-89`, `SC-94`.
  - Verification: admin table/detail and unauthorized-access checks.

- [ ] 5.2 Keep the called-off listing's canonical URL directly accessible after
  removing it from browse and search, while retaining the URL and listing code
  reservations. Keep the listing code out of the public page and unable to
  resolve as a route. Explicit hard deletion remains outside this change.
  - Covers: `grade10-site-auction-listing-page-SC-26`, `SC-28`, and
    `grade10-site-auction-lot-status-SC-13`.
  - Verification: direct URL, browse/search exclusion and code-as-route checks.

Receipt identifier and receipt-breakdown work is owned by the receipt/payment
changes and is not added here.
