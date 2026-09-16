## 1. Shared listing contract, copy, and stories (grade10-spec)

- [ ] 1.1 Make `ListingUserBidHistory` and `ListingUserMaximumHistoryRow` satisfy the two peer-tab, amount-and-time-only contract, including an unconditional **Bid placed** default and the frameless empty-bids state (shared-ui-auction-listing-SC-31, shared-ui-auction-listing-SC-32, shared-ui-auction-listing-SC-33, shared-ui-auction-listing-SC-34)
- [ ] 1.2 Refresh the Grade10 listing and bidding-history catalogs and Storybook fixtures so the entry reads **Your bidding**, the tabs and columns are supplied by copy, and maximum set, raised, and refused events use the settled labels (grade10-site-auction-bidding-history-SC-42, grade10-site-auction-bidding-history-SC-43, grade10-site-auction-bidding-history-SC-44, grade10-site-auction-bidding-history-SC-46)
- [ ] 1.3 Update the Bidding History capability PRD to record the shipped lot tabs, accepted-only maximum rows, and clearer account labels, removing the delivered 🚧 markers (grade10-site-auction-bidding-history-SC-42, grade10-site-auction-bidding-history-SC-44, grade10-site-auction-bidding-history-SC-46)
- [ ] 1.4 Verify: `pnpm run typecheck && pnpm run test && pnpm validate:changes add-lot-maximum-bid-history && pnpm check:manual`

## 2. Lot history projection and account labels (grade10)

- [ ] 2.1 Replace placeholder lot rows with the signed-in owner's accepted maximum and automatic-bid projection from combined history, preserving newest-first ordering and omitting refusals, rival facts, and public-only prices (grade10-site-auction-bidding-history-SC-42, grade10-site-auction-bidding-history-SC-43, grade10-site-auction-bidding-history-SC-44, grade10-site-auction-bidding-history-SC-45)
- [ ] 2.2 Prove the existing `/bids` chronology renders maximum set, maximum raised, and maximum refused wording without adding an account tab, filter, or route (grade10-site-auction-bidding-history-SC-46)
- [ ] 2.3 Verify: `pnpm run typecheck && pnpm run lint && pnpm run test`
