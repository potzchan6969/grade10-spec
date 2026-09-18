## 1. Specification and product record (grade10-spec) (owner: @htonyl)

- [ ] 1.1 Carry the explicit dependency on `revise-auction-winner-invoicing` through the proposal and deltas, preserving its `not_issued`, `pending`, `expired`, `paid`, fulfilment and derived-status ownership; keep expired orders as Pending Payment with Contact Us in the order detail (grade10-site-auction-auction-orders-SC-07, winner-order-SC-44, winner-order-SC-49)
- [ ] 1.2 Update the My Auctions and Winner Order PRDs so the Won-row entry point, invoice-expiry outcome, address-lock ownership and Hong Kong Postal Code question agree with the change (grade10-site-auction-account-record-SC-55, winner-order-SC-45)
- [ ] 1.3 Verify proposal, specs, journeys and feature suites for links, scenario ids and the removal of the deprecated `AuctionRecordTabs` delta with `openspec validate add-my-auction-orders --strict`, `openspec status --change add-my-auction-orders`, `pnpm check:manual` and `pnpm run tcs:validate`

## 2. Shared auction-order UI (grade10-spec) (owner: @htonyl)

- [ ] 2.1 Export `AuctionOrderList`, `AuctionOrderRow`, `AuctionOrderEmpty`, `AuctionOrderDetail`, `AuctionAddressForm` and the exact copy/value/props types from the `@grade10/ui` public entry; keep all content, status and callbacks consumer-owned (shared-ui-auction-order-SC-01)
- [ ] 2.2 Implement the independently renderable order row, list and empty blocks with View lot plus exactly one supplied next action, without choosing actions from status or performing writes (shared-ui-auction-order-SC-02, grade10-site-auction-auction-orders-SC-05–SC-10)
- [ ] 2.3 Implement the detail and address-form blocks with the four supplied sections, supplied invoice/payment slots, required-field markers/errors, Cancel, and no phone-format or billing-address validation (shared-ui-auction-order-SC-03, shared-ui-auction-order-SC-04, winner-order-SC-139, winner-order-SC-152–SC-154)
- [ ] 2.4 Verify shared exports, isolated row/form rendering, copy ownership and supplied-error behavior with focused package tests, Storybook stories, `pnpm run lint` and `pnpm run typecheck`

## 3. Auction reads and actions (grade10)

- [ ] 3.1 Build the authenticated My Auction Orders read from the session owner, joining winning lots to auction orders, current invoices and the revise-owned derived status; apply waiting-first and newest-close ordering and return a distinct read failure (grade10-site-auction-auction-orders-SC-01–SC-04, SC-10, SC-11)
- [ ] 3.2 Build the authenticated Winner Order read model with invoice status/lines, confirmed address, lot, retained records, and ordered `{ status, reachedAt }` timeline items sourced from authoritative lifecycle timestamps; do not synthesize timestamps or add a second status model (winner-order-SC-53, winner-order-SC-139, winner-order-SC-141)
- [ ] 3.3 Adapt the existing revise-owned address-confirmation action to the new route and shared form, mapping required-field refusals to field errors and returning Preparing Invoice without changing the foundational address-lock rule (winner-order-SC-45, winner-order-SC-152–SC-154)
- [ ] 3.4 Adapt hosted card-session creation and payment read reconciliation so expired, timed-out, abandoned, cancelled and declined attempts leave the invoice payable; show Confirming only after provider completion and show Processing only after the authoritative read returns invoice `paid` and fulfilment `unfulfilled` (winner-order-SC-44, SC-49–SC-52)
- [ ] 3.5 Verify owner isolation, derived-status parity, timeline timestamps, address refusals and payment-session outcomes with backend/service tests and the application's focused typecheck and test commands

## 4. Site routes and presentation (grade10)

- [ ] 4.1 Compose My Auctions from `AuctionRecord` plus design-system `Tabs`, `TabsList`, `TabsTrigger` and `TabsContent`; partition rows by bidding window, open on Active, keep the total title count, disable Ended alerts, and preserve the Won-row order link (grade10-site-auction-account-record-SC-49–SC-55)
- [ ] 4.2 Add the authenticated My Auction Orders route, account-menu entry and list-to-order/list-to-lot navigation; render filled, empty and failed-read states through the shared blocks without exposing another collector's orders (grade10-site-auction-auction-orders-SC-01–SC-11)
- [ ] 4.3 Add the authenticated Winner Order route using the shared detail/form blocks; render the four sections, status timeline timestamps, address states, full invoice, expired Pending Payment with Contact Us instead of Pay Now, unfinished-payment message, Confirming and Processing states (winner-order-SC-44–SC-53, SC-72–SC-74)
- [ ] 4.4 Add English, Traditional Chinese and Simplified Chinese copy for tabs, actions, sections, invoice labels, address fields/errors and payment-session messages without placing catalogs in `@grade10/ui` (winner-order-SC-152, SC-153, SC-154, SC-49, SC-73, shared-ui-auction-order-SC-01)
- [ ] 4.5 Verify route guards, navigation, responsive rendering, accessibility semantics and reduced-motion behavior with focused frontend tests, `pnpm run lint`, `pnpm run typecheck` and `pnpm run test`

## 5. Cross-surface acceptance (grade10)

- [ ] 5.1 Run the My Auctions → Won row → My Auction Orders → Winner Order journey and assert the same order id, lot, owner, derived status and invoice status at every entry point (grade10-site-auction-account-record-SC-55, grade10-site-auction-auction-orders-SC-05–SC-09, winner-order-SC-139)
- [ ] 5.2 Run the expired-invoice, abandoned-payment, provider-confirming and recorded-paid cases against the list and detail reads so no surface invents Expired as an order status and the expired detail offers Contact Us (grade10-site-auction-auction-orders-SC-07, winner-order-SC-44, SC-49–SC-52)
- [ ] 5.3 Run the full relevant application validation shelf after the shared package and routes land: `pnpm run lint`, `pnpm run typecheck`, `pnpm run test`, and the focused auction Storybook test suite
