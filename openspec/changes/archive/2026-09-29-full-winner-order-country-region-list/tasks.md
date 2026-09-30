## 1. Preview catalogue and Autocomplete proof (grade10-spec)

- [x] 1.1 Keep delivery Add Address on the complete A–Z `country-regions` catalogue with Country/Region label, empty refusal, and searchable Autocomplete filter on Complete Order Setup stories (`winner-order-SC-174`, `winner-order-SC-175`, `winner-order-SC-176`, `winner-order-SC-177`, `winner-order-SC-178`)
- [x] 1.2 Prove design-system `Autocomplete` filters a long option list as the query is typed (`winner-order-SC-175`, `winner-order-SC-178`)
- [x] 1.3 Keep Post-Bidding Order Setup 🚧 / Catalogue display locale ❓ lines aligned with the deltas (`pnpm check:manual`)
- [x] 1.4 Verify: `pnpm run typecheck && pnpm run test && pnpm check:manual`

## 2. Winner Order delivery Country/Region (grade10)

Can proceed from contracts and fixtures after the submodule bump; does not need a running backend beyond existing confirm-address.

- [x] 2.1 Bump `external/grade10-spec` for any Autocomplete / i18n / preview catalogue fixes from group 1
- [x] 2.2 Replace delivery Add Address free-text country with an Autocomplete over the owned ISO catalogue (display name shown, ISO `countryCode` submitted) listing every country and region A–Z with label Country/Region (`winner-order-SC-174`, `winner-order-SC-176`)
- [x] 2.3 Wire filter-as-you-type search and refuse confirm when Country/Region is empty or no catalogue value is selected (`winner-order-SC-175`, `winner-order-SC-177`, `winner-order-SC-178`)
- [x] 2.4 Leave billing Add Address country control unchanged until Product settles billing catalogue parity
- [x] 2.5 Verify: `pnpm run typecheck && pnpm run lint && pnpm run test --filter grade10`

## 3. Walk Winner Order delivery Add Address (grade10)

- [x] 3.1 Walk `winner-order-US-01` through delivery Add Address: open the full catalogue, type a filter that narrows matching names, select a mid-list country, and confirm; refuse an empty Country/Region and a no-match query without selection (`winner-order-SC-174`, `winner-order-SC-175`, `winner-order-SC-176`, `winner-order-SC-177`, `winner-order-SC-178`)
- [x] 3.2 Verify: `pnpm run test --filter grade10` (and the e2e lane that covers Winner Order setup when this walk lands there)
