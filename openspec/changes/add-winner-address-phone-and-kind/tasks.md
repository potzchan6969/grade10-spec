## 1. Shared AuctionAddressForm phone and kind (grade10-spec)

- [ ] 1.1 Unit and Storybook proofs for Personal / Company, soft phone refuse, E.164 when parseable, unusual formats accepted, optional locality, no Apt. field, and Confirm reporting kind + phone (`shared-ui-auction-order-SC-07`, `shared-ui-auction-order-SC-08`, `shared-ui-auction-order-SC-09`, `shared-ui-auction-order-SC-10`, `shared-ui-auction-order-SC-11`, `shared-ui-auction-order-SC-12`)
- [ ] 1.2 Keep `AuctionAddressForm` + block-local `AuctionPhoneField` on the soft phone rule and Personal / Company contract; clear company on personal confirm (`shared-ui-auction-order-SC-07`, `shared-ui-auction-order-SC-08`, `shared-ui-auction-order-SC-09`, `shared-ui-auction-order-SC-10`, `shared-ui-auction-order-SC-12`)
- [ ] 1.3 Keep Complete Order Setup preview Add Address and delivery picker card titles on the same contract (`winner-order-SC-187`, `winner-order-SC-190`, `winner-order-SC-191`, `winner-order-SC-192`, `winner-order-SC-193`)
- [ ] 1.4 Align Post-Bidding Order Setup and Auction Order Blocks 🚧 lines with the deltas (`pnpm check:manual`)
- [ ] 1.5 Verify: `pnpm run typecheck && pnpm run test && pnpm check:manual`

## 2. Winner Order setup wiring (grade10)

Can proceed from contracts and fixtures after the submodule bump; does not need a running backend beyond existing confirm-address once the payload accepts kind and phone.

- [ ] 2.1 Bump `external/grade10-spec` for the `AuctionAddressForm` phone / kind contract from group 1
- [ ] 2.2 Wire delivery and billing Add Address to Personal / Company, soft phone (country + digits, E.164 when parseable, unusual formats accepted), and optional locality with no Apt. field (`winner-order-SC-185`, `winner-order-SC-186`, `winner-order-SC-187`, `winner-order-SC-188`, `winner-order-SC-189`, `winner-order-SC-190`, `winner-order-SC-191`, `winner-order-SC-195`, `winner-order-SC-196`, `winner-order-SC-197`, `winner-order-SC-198`, `winner-order-SC-199`, `winner-order-SC-200`)
- [ ] 2.3 Title delivery / billing picker cards with company name or recipient name from kind (`winner-order-SC-192`, `winner-order-SC-193`)
- [ ] 2.4 Answer setup copy keys in `@grade10/i18n` (Personal, Company, Phone, Company Name, Enter phone number)
- [ ] 2.5 Extend confirm-address / address snapshot for kind and phone only if the live payload still lacks them (`winner-order-SC-188`, `winner-order-SC-197`)
- [ ] 2.6 Verify: `pnpm run typecheck && pnpm run lint && pnpm run test --filter grade10`

## 3. Walk Winner Order Add Address (grade10)

- [ ] 3.1 Walk `winner-order-US-01` through delivery Add Address: empty phone refuse, Personal / Company, unusual phone accepted, optional locality, picker titles (`winner-order-SC-185`, `winner-order-SC-186`, `winner-order-SC-187`, `winner-order-SC-189`, `winner-order-SC-190`, `winner-order-SC-191`, `winner-order-SC-192`, `winner-order-SC-193`, `winner-order-SC-195`, `winner-order-SC-196`)
- [ ] 3.2 Walk `winner-order-US-11` billing Add Address phone and kind (`winner-order-SC-199`, `winner-order-SC-200`)
- [ ] 3.3 Walk `winner-order-US-12` one-time address at the five-address cap with phone and kind (`winner-order-SC-194`)
- [ ] 3.4 Flip the cases the walks decide with `pnpm run tcs:automated <case…> --decided-by <walk path>`; name any that stay manual in the suite and the walk's `rounds.md` row
- [ ] 3.5 Verify: `pnpm run test --filter grade10` (and the e2e lane that covers Winner Order setup when this walk lands there)
