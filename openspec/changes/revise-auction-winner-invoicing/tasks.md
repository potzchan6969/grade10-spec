# Delivery tasks

The application work starts after this change reaches `grade10-spec` main and
the application updates `external/grade10-spec` to that revision. The shared
contract and schema groups land before the independently claimable auction,
admin, and winner-surface groups. The database task is schema deployment only:
there is no auction-state backfill, legacy conversion, or dual-read path.

## 1. Manual and planning record (grade10-spec) (owner: @htonyl)

- [ ] 1.1 Update the winner-order, order-status, notification, account-record, and post-sale manual pages to describe the delivered address-first invoice flow for `winner-order-SC-26`, `winner-order-SC-31`, `auction-status-SC-06`, `order-mail-SC-09`, and `grade10-admin-auction-post-sale-SC-48`
- [ ] 1.2 Verify the change artifacts and manual with `openspec validate revise-auction-winner-invoicing --strict` and `pnpm check:manual`

## 2. Shared auction contracts (grade10) (owner: @htonyl)

- [ ] 2.1 Extend the auction status, order, invoice, invoice-log, receipt, notification, and admin post-sale codecs with `not_issued`, `expired`, Awaiting Address, Preparing Invoice, quote values, deadline choice, payment method details, and proof metadata for `auction-status-SC-01`, `auction-status-SC-06`, `winner-order-SC-04`, and `grade10-admin-auction-post-sale-SC-61`
- [ ] 2.2 Replace the winner and operator procedure inputs and outputs for address confirmation, quote-and-send, re-quote, expiry, card payment, manual settlement, and proof upload so `winner-order-SC-28`, `winner-order-SC-29`, `winner-order-SC-35`, `grade10-admin-auction-post-sale-SC-50`, and `grade10-admin-auction-post-sale-SC-58` have fixed authenticated contracts
- [ ] 2.3 Verify contract fixtures and refusal unions, then run `pnpm run typecheck` and the focused auction contract tests

## 3. Auction persistence (grade10) (owner: @htonyl)

- [ ] 3.1 Add the additive auction schema migration, Drizzle snapshot, constraints, and indexes for an order with no current invoice, `expired` invoices, extended immutable invoice logs, notification work, and 1 to 5 immutable manual-settlement proof records for `auction-status-SC-01`, `auction-status-SC-02`, `grade10-admin-auction-post-sale-SC-56`, and `grade10-admin-auction-post-sale-SC-62`; do not add a record backfill or legacy adapter
- [ ] 3.2 Update repository writes and reads to lock the order/current invoice, keep invoice revisions and logs append-only, and return one derived status for the winner and queue for `auction-status-SC-19`, `auction-status-SC-20`, `auction-status-SC-25`, `grade10-admin-auction-post-sale-SC-35`, and `grade10-admin-auction-post-sale-SC-21`
- [ ] 3.3 Verify generated migration ordering, committed SQL, constraints, query shape, and PGlite repository behavior with `pnpm run db:drizzle:generate`, `pnpm run check:migrations`, and focused backend repository tests

## 4. Auction lifecycle and notifications (grade10)

- [ ] 4.1 Change the locked, idempotent close flow to create one `not_issued` order, release every bid-time hold, and send only the auction-won address request for `winner-order-SC-26`, `winner-order-SC-27`, `winner-order-SC-12`, `winner-order-SC-13`, and `winner-order-SC-14`
- [ ] 4.2 Implement winner address confirmation before send, operator quote-and-send, and re-quote with a required reason and chosen deadline while preserving atomic invoice/log/notification writes for `winner-order-SC-07`, `winner-order-SC-08`, `winner-order-SC-29`, `grade10-admin-auction-post-sale-SC-48`, `grade10-admin-auction-post-sale-SC-49`, `grade10-admin-auction-post-sale-SC-51`, `grade10-admin-auction-post-sale-SC-52`, and `grade10-admin-auction-post-sale-SC-53`
- [ ] 4.3 Replace deadline-derived expiry with the locked expiry sweep, schedule and supersede the three invoice reminders, and preserve card payment, manual settlement, reissue, cancellation, receipt card details, and invoice-log records for `winner-order-SC-33`, `winner-order-SC-37`, `winner-order-SC-36`, `grade10-admin-auction-post-sale-SC-23`, `grade10-admin-auction-post-sale-SC-55`, `grade10-admin-auction-post-sale-SC-59`, `grade10-admin-auction-post-sale-SC-60`, and `order-mail-SC-02`
- [ ] 4.4 Retire the shipping-rate calculation from invoice commands and add private proof-object validation, attachment, authorised operator reads, and orphan cleanup for `winner-order-SC-35`, `winner-order-SC-19`, `grade10-admin-auction-post-sale-SC-57`, and `grade10-admin-auction-post-sale-SC-62`
- [ ] 4.5 Verify service, sweep, notification, and worker paths with `pnpm run test:backend`, `pnpm run test:pg`, `pnpm run lint`, and `pnpm run typecheck`

## 5. Admin post-sale surface (grade10)

- [ ] 5.1 Render Awaiting Address and Preparing Invoice queue states, elapsed stage time, the separate Overdue mark and filter, and the Pending Payment/Expired needs-action combination for `grade10-admin-auction-post-sale-SC-45`, `grade10-admin-auction-post-sale-SC-46`, `grade10-admin-auction-post-sale-SC-47`, `grade10-admin-auction-post-sale-SC-44`, and `grade10-admin-auction-post-sale-SC-21`
- [ ] 5.2 Add authorised quote-and-send, re-quote, expired reissue, pre-invoice cancellation, and manual-settlement forms with deadline choice, reason, method, reference, and proof-file validation for `grade10-admin-auction-post-sale-SC-50`, `grade10-admin-auction-post-sale-SC-52`, `grade10-admin-auction-post-sale-SC-54`, `grade10-admin-auction-post-sale-SC-56`, `grade10-admin-auction-post-sale-SC-57`, and `grade10-admin-auction-post-sale-SC-58`
- [ ] 5.3 Show the chronological invoice trail, quoted amount changes, deadline choices, payment method, reference, and operator-only proof access for `grade10-admin-auction-post-sale-SC-34`, `grade10-admin-auction-post-sale-SC-35`, and `grade10-admin-auction-post-sale-SC-61`
- [ ] 5.4 Verify the post-sale feature module and admin route with focused frontend tests, `pnpm run lint`, `pnpm run typecheck`, and `pnpm run test`

## 6. Winner auction surfaces (grade10)

- [ ] 6.1 Change the winner order to request and confirm an address before an invoice, show no amount or payment action until send, lock the address afterwards, and offer card only for `winner-order-SC-07`, `winner-order-SC-28`, `winner-order-SC-29`, `winner-order-SC-30`, and `winner-order-SC-35`
- [ ] 6.2 Render the sent quote, winner-local deadline, expired-but-payable state, card payment retries, and itemised card or manual receipt without proof files for `winner-order-SC-31`, `winner-order-SC-04`, `winner-order-SC-33`, `winner-order-SC-37`, `winner-order-SC-36`, and `winner-order-SC-19`
- [ ] 6.3 Update the account auction record to project Awaiting Address and Preparing Invoice, retain Pending Payment for expired invoices, and remain read-only for `grade10-site-auction-account-record-SC-22`, `grade10-site-auction-account-record-SC-24`, `grade10-site-auction-account-record-SC-47`, and `grade10-site-auction-account-record-SC-48`
- [ ] 6.4 Verify the buyer routes and feature modules with focused frontend tests, `pnpm run lint`, `pnpm run typecheck`, and `pnpm run test`
