## 1. Preview catalogue and Select proof (grade10-spec)

- [ ] 1.1 Keep delivery Add Address on the complete A–Z `country-regions` catalogue with Country/Region label, empty refusal, and letter typeahead that scrolls the match into view on Complete Order Setup stories (`winner-order-SC-174`, `winner-order-SC-175`, `winner-order-SC-176`, `winner-order-SC-177`, `winner-order-SC-178`)
- [ ] 1.2 Prove design-system `Select` typeahead scrolls the highlighted option into the popup on a list taller than the capped height (`winner-order-SC-175`, `winner-order-SC-178`)
- [ ] 1.3 Keep Post-Bidding Order Setup 🚧 / Catalogue display locale ❓ lines aligned with the deltas (`pnpm check:manual`)
- [ ] 1.4 Verify: `pnpm run typecheck && pnpm run test && pnpm check:manual`

## 2. Winner Order delivery Country/Region (grade10)

Can proceed from contracts and fixtures after the submodule bump; does not need a running backend beyond existing confirm-address.

- [ ] 2.1 Bump `external/grade10-spec` for any Select / i18n / preview catalogue fixes from group 1
- [ ] 2.2 Replace delivery Add Address free-text country with a Select over the owned ISO catalogue (display name shown, ISO `countryCode` submitted) listing every country and region A–Z with label Country/Region (`winner-order-SC-174`, `winner-order-SC-176`)
- [ ] 2.3 Wire letter typeahead scroll-into-view and refuse confirm when Country/Region is empty (`winner-order-SC-175`, `winner-order-SC-177`, `winner-order-SC-178`)
- [ ] 2.4 Leave billing Add Address country control unchanged until Product settles billing catalogue parity
- [ ] 2.5 Verify: `pnpm run typecheck && pnpm run lint && pnpm run test --filter grade10`

## 3. Walk Winner Order delivery Add Address (grade10)

- [ ] 3.1 Walk `winner-order-US-01` through delivery Add Address: open the full catalogue, type a letter that scrolls a match into view, select a mid-list country, and confirm; refuse an empty Country/Region (`winner-order-SC-174`, `winner-order-SC-175`, `winner-order-SC-176`, `winner-order-SC-177`, `winner-order-SC-178`)
- [ ] 3.2 Verify: `pnpm run test --filter grade10` (and the e2e lane that covers Winner Order setup when this walk lands there)
