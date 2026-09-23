## 1. Shared AuctionAddressForm phone and kind (grade10-spec)

- [x] 1.1 Unit and Storybook proofs for Personal / Company, soft phone refuse, E.164 when parseable, unusual formats accepted, optional locality, no Apt. field, and Confirm reporting kind + phone (`shared-ui-auction-order-SC-07`, `shared-ui-auction-order-SC-08`, `shared-ui-auction-order-SC-09`, `shared-ui-auction-order-SC-10`, `shared-ui-auction-order-SC-11`, `shared-ui-auction-order-SC-12`)
- [x] 1.2 Keep `AuctionAddressForm` + block-local `AuctionPhoneField` on the soft phone rule and Personal / Company contract; clear company on personal confirm (`shared-ui-auction-order-SC-07`, `shared-ui-auction-order-SC-08`, `shared-ui-auction-order-SC-09`, `shared-ui-auction-order-SC-10`, `shared-ui-auction-order-SC-12`)
- [x] 1.3 Keep Complete Order Setup preview Add Address (phone placeholder `+852 12345678`), delivery picker lean card body, and Order summary full address snapshot on the same contract (`winner-order-SC-187`, `winner-order-SC-190`, `winner-order-SC-191`, `winner-order-SC-192`, `winner-order-SC-193`, `winner-order-SC-201`, `winner-order-SC-202`, `winner-order-SC-203`)
- [x] 1.4 Align Post-Bidding Order Setup and Auction Order Blocks 🚧 lines with the deltas (`pnpm check:manual`)
- [x] 1.5 Verify: `pnpm run typecheck && pnpm run test && pnpm check:manual`

## 2. Winner Order setup wiring (grade10)

Can proceed from contracts and fixtures after the submodule bump; does not need a running backend beyond existing confirm-address once the payload accepts kind and phone.

- [x] 2.1 Bump `external/grade10-spec` for the `AuctionAddressForm` phone / kind contract from group 1
- [x] 2.2 Wire delivery and billing Add Address to Personal / Company, soft phone (country + digits, E.164 when parseable, unusual formats accepted), and optional locality with no Apt. field (`winner-order-SC-185`, `winner-order-SC-186`, `winner-order-SC-187`, `winner-order-SC-188`, `winner-order-SC-189`, `winner-order-SC-190`, `winner-order-SC-191`, `winner-order-SC-195`, `winner-order-SC-196`, `winner-order-SC-197`, `winner-order-SC-198`, `winner-order-SC-199`, `winner-order-SC-200`)
- [x] 2.3 Title delivery / billing picker cards with company name or recipient name from kind; body shows street, city or region, and country only; Order summary Delivery / Billing show the full snapshot (`winner-order-SC-192`, `winner-order-SC-193`, `winner-order-SC-202`, `winner-order-SC-203`)
- [x] 2.4 Answer setup copy keys in `@grade10/i18n` (Personal, Company, Phone, Company Name, phone placeholder `+852 12345678`) (`winner-order-SC-201`)
- [x] 2.5 Extend confirm-address / address snapshot for kind and phone only if the live payload still lacks them (`winner-order-SC-188`, `winner-order-SC-197`)
- [x] 2.6 Verify: `pnpm run typecheck && pnpm run lint && pnpm run test --filter grade10`

## 3. Walk Winner Order Add Address (grade10)

- [x] 3.1 Walk `winner-order-US-01` through delivery Add Address: empty phone refuse, phone placeholder, Personal / Company, unusual phone accepted, optional locality, picker titles and lean body, then Order summary full snapshot (`winner-order-SC-185`, `winner-order-SC-186`, `winner-order-SC-187`, `winner-order-SC-189`, `winner-order-SC-190`, `winner-order-SC-191`, `winner-order-SC-192`, `winner-order-SC-193`, `winner-order-SC-195`, `winner-order-SC-196`, `winner-order-SC-201`, `winner-order-SC-202`, `winner-order-SC-203`)
- [x] 3.2 Walk `winner-order-US-11` billing Add Address phone and kind (`winner-order-SC-199`, `winner-order-SC-200`)
- [x] 3.3 Walk `winner-order-US-12` one-time address at the five-address cap with phone and kind (`winner-order-SC-194`)
- [x] 3.4 Flip the cases the walks decide with `pnpm run tcs:automated <case…> --decided-by <walk path>`; name any that stay manual in the suite and the walk's `rounds.md` row
- [x] 3.5 Verify: `pnpm run test --filter grade10` (and the e2e lane that covers Winner Order setup when this walk lands there)
