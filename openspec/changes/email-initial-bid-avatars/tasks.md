## 1. Public avatar initial on the wire (grade10) (owner: @mason5991)

- [ ] 1.1 Add `avatarInitial` to `publicBidSchema` and project it in `publicBidOf` from the bidder email snapshot with the local-part letter rule and `B` fallback; extend the public ledger query to join email. `grade10-site-auction-bidding-history-SC-52`, `grade10-site-auction-bidding-history-SC-53`
- [ ] 1.2 Cover derivation and erasure fallback in auction-service tests; prove the public payload never includes email. `grade10-site-auction-bidding-history-SC-52`, `grade10-site-auction-bidding-history-SC-53`
- [ ] 1.3 Confirm live lot frames carry `avatarInitial` on each ledger row through the shared schema.

## 2. Lot page Recent Bids mapping (grade10) (owner: @mason5991)

- [ ] 2.1 Map `bid.avatarInitial` into `ListingBidHistoryRow.initials` in `listingBidHistory`; stop using `bid.pseudonym` for the avatar. `grade10-site-auction-listing-page-SC-52`, `grade10-site-auction-listing-page-SC-53`
- [ ] 2.2 Add or update listing mapper / ListingView tests for rival letters, the viewer row, and live update paths. `grade10-site-auction-listing-page-SC-52`, `grade10-site-auction-listing-page-SC-53`

## 3. Verify (grade10) (owner: @mason5991)

- [ ] 3.1 Run the auction-service and grade10-auction frontend tests touched by groups 1 and 2.
- [ ] 3.2 Manually open a lot with two bidders whose emails start with different letters and confirm Recent Bids avatars differ while labels stay Bidder N / You.

## 4. The walk - Recent Bids avatar letters (grade10)

- [ ] 4.1 `/tcs-review email-initial-bid-avatars` after the implementation is available for human case classification.
