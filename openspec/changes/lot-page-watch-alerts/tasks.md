## 1. Lot watch toast copy and product record (grade10-spec)

- [ ] 1.1 Answer lot-page watch / unwatch / first-bid alerts toast strings in
      shared `auctionListing` for `en`, `zh-Hant`, `zh-Hans`, and `ko` —
      alerts-on title aligned with My Auctions, **View My Auctions** action
      label, unwatch description, and **Undo** — so
      `grade10-site-auction-listing-page-SC-14`, `SC-15`, and `SC-16` have
      production copy; reuse `auctionRecord` wording where the strings match.
- [ ] 1.2 Confirm Storybook covers locked Watching and watch / unwatch
      confirmation with action labels on `Auction Listing/WatchButton` and
      `ListingLotHeader` (`shared-ui-auction-record-SC-14`, `SC-15`); add only
      what is still missing.
- [ ] 1.3 Mark this change's outcomes on
      `docs/prds/products/grade10-site/auction/listing-page.md` and
      `account-record.md` (🚧 watch / unwatch toasts, bid-locked Watching,
      once-per-lot bid alerts toast, closed lot hides Watch) without restating
      scenarios; verify with `pnpm check:manual`.
- [ ] 1.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`,
      `pnpm check:manual`.

## 2. Bid-alerts stamp and placeBid contract (grade10)

Needs nothing from group 1. Frontend group 3 needs this landed for the
announce flag.

- [ ] 2.1 Migrate nullable `bidder_watches.bid_alerts_announced_at` and stamp
      it inside `placeBid` when null after `recordWatch`, returning
      `announceBidAlerts` on success so
      `grade10-site-auction-account-record-SC-45`, `SC-46` and
      `grade10-site-auction-listing-page-SC-16`, `SC-17` have their account
      gate.
- [ ] 2.2 Extend `placeBidOutcomeSchema` success `data` with required
      `announceBidAlerts: boolean`; update fixtures, demo service, and
      binding tests.
- [ ] 2.3 Verify: focused auction DB / placeBid and contracts tests,
      `pnpm run typecheck` for `@grade10/auction-contracts` and the auction
      backend package, `pnpm run test:backend` for the auction worker lane
      that owns these specs.

## 3. Lot-page watch alerts wiring (grade10)

Needs group 1 for catalogue strings (via submodule bump) and group 2 for
`announceBidAlerts`.

- [ ] 3.1 Advance `external/grade10-spec` to the landed group 1 commit,
      preserving unrelated nested work, and make `pnpm run check:submodules`
      pass.
- [ ] 3.2 Wire `ListingLotHeader` from `ListingView`: toast copy + View My
      Auctions / Undo actions, `watchLocked` from non-null standing on an open
      lot, omit the control when closed, and keep standing / close unchanged
      on watch — `grade10-site-auction-listing-page-SC-10`…`SC-15`, `SC-18`,
      `grade10-site-auction-account-record-SC-01`, `SC-03`.
- [ ] 3.3 On successful `placeBid` with `announceBidAlerts`, toast alerts-on
      once, invalidate watch and standing, and leave later visits quiet —
      `grade10-site-auction-listing-page-SC-16`, `SC-17`,
      `grade10-site-auction-account-record-SC-45`, `SC-46`.
- [ ] 3.4 Verify: focused `ListingView` / watches tests, `pnpm run typecheck`,
      `pnpm run lint`, `pnpm run test`, `pnpm run build`.
