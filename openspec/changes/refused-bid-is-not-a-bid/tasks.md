# Tasks: A refused bid is not a bid, and no bid holds the card

## 1. The manual (grade10-spec)

- [ ] 1.1 State on Bidding, Post-Bidding, Display, Account, Auction Management, Auction Record, Listing Page blocks, Account Data and Auction Service that a bid stands on the card on file when accepted, a refused attempt places nothing and is logged for operators, a losing or called-off row reads "Your card was not charged.", and an erased leader hands the lot to the runner-up - unmarked, since grade10 shows it
- [ ] 1.2 With the fold, drop from the durable specs what the fold cannot: the Feature set leaves and groups that name a bid-time authorization (auction "Card authorization" and "Stripe failures"; bid-payment-method "Bid authorization", "Raised authorization", "Refusal resolution", "Bid-CTA outcomes" and "Authorization lifecycle"; auto-bidding "Card authorization"; bid-panel-enrollment "Optional authorization"; winner-order "Hold release"), the Settled lines the delta suites supersede, and "Authorizing…" left in listing-page
- [ ] 1.3 Verify: `pnpm check:manual`, `pnpm run tcs:validate` and `pnpm run validate:changes refused-bid-is-not-a-bid` in grade10-spec

## 2. The refusal log and the refusal rows (grade10)

- [ ] 2.1 Test first: a refusal logs `auction bid refused` once, naming the bidder, the lot, the code, the maximum sent and the floor `grade10-site-auction-auction-SC-93`
- [ ] 2.2 `placeBid()` adds `storefront`, `userId`, `maximumMinor`, and the refusal's `minimumNextAmount` or `ceilingMinor`, to the line, picked field by field
- [ ] 2.3 An auction migration deletes the refused, requested, `pending` and `lost` rows of `bid_action_logs`, tightens its `type` and `standing` checks, and holds `failure_code` null, with a migration spec `grade10-site-auction-bidding-history-SC-37`
- [ ] 2.4 `docs/architecture/auction.md` says a refusal writes nothing the bidder reads and is logged for operators, and links the archived relay change

## 3. The tests name what they prove (grade10)

- [ ] 3.1 Placement and refusal: `grade10-site-auction-auction-SC-89`, `grade10-site-auction-auction-SC-90`, `grade10-site-auction-auction-SC-91`, `grade10-site-auction-auction-SC-92`, `grade10-site-auction-auction-SC-23`, `grade10-site-auction-auction-SC-10`, `grade10-site-auction-auction-SC-86`
- [ ] 3.2 A lost answer: `grade10-site-auction-auction-SC-94`, `grade10-site-auction-auction-SC-95`
- [ ] 3.3 Erasing the leader, with a new test for one maximum left: `grade10-site-auction-auction-SC-96`, `grade10-site-auction-auction-SC-97`, `grade10-site-auction-auction-SC-98`, `grade10-site-auction-auction-SC-99`, `grade10-site-auction-auction-SC-100`, `grade10-site-auction-auction-SC-101`, `grade10-site-auction-auction-SC-102`
- [ ] 3.4 The card on file, with a new test that a losing bidder is never charged: `grade10-site-auction-bid-payment-method-SC-18`, `grade10-site-auction-bid-payment-method-SC-19`, `grade10-site-auction-bid-payment-method-SC-20`, `grade10-site-auction-bid-payment-method-SC-21`, `grade10-site-auction-auto-bidding-SC-32`, `grade10-site-auction-bid-panel-enrollment-SC-20`
- [ ] 3.5 My Auctions and the bidding history: `grade10-site-auction-account-record-SC-71`, `grade10-site-auction-bidding-history-SC-47`, `grade10-site-auction-bidding-history-SC-48`, `grade10-site-auction-bidding-history-SC-49`, `grade10-site-auction-bidding-history-SC-50`
- [ ] 3.6 The lot page and the close, with a new test for a refused maximum in the funnel: `grade10-site-auction-listing-page-SC-45`, `grade10-site-auction-listing-page-SC-47`, `grade10-site-analytics-SC-59`
- [ ] 3.7 Move the tests that cite retired ids: `grade10-site-auction-auction-SC-69` in `test/pg/settle.spec.ts`, "auto-bidding-SC-19" in `e2e/tests/auto-bidding.spec.ts`, `grade10-site-auction-listing-page-SC-46` in `e2e/tests/auction/live-room.spec.ts`, and the never-issued "bid-panel-enrollment-SC-28" and "-SC-29"
- [ ] 3.8 Verify: grade10 `main` CI green at the recorded commit
