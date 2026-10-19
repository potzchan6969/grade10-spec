reviewed: 0df8acf129e8f2aa279d1d65bb1d9ebf513173c7 (working tree)
source-identity: 7f9db83c3f0b41c50f6ef366e00057feda1c21952a58fdff6ed7708be542d12b
baseline-identity: c297c95c253f4d9cc1e558fe03790b521eaaa264f31d97aa731beac91baec299
verdict: Ready to accept

| # | Severity | Change | Where | Finding | Owner | Fix in | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | blocker | remove-my-auction-orders | docs/prds/products/grade10-site/auction/post-bidding.md:526 vs packages/ui/src/index.ts and the delta | The engineer code map still lists `AuctionOrderList`, `AuctionOrderRow` beside `AuctionWinnerOrder` and `AuctionAddressForm` — an unmarked page line the change makes untrue. | planning-dev | post-bidding.md | fixed (working tree) — the removed names are off the line |
| 2 | blocker | omit-profile-account-menu | openspec/changes/omit-profile-account-menu/specs/grade10-site/auction/auction-orders/spec.md | Not an id-authoring error: the change was accepted 2026-10-07 and its requirements are in durable; its unarchived directory kept claiming `auction-orders-SC-01..04` against the archived `add-my-auction-orders` in the post-fold store. Resolved by archiving it: `implementation.json` attests `9gag/grade10-spec`@`ccaca1f49` and `9gag/grade10`@`a67184e0` (PR #1022), the site-chrome suite heading rename was acknowledged editorial, and tasks 3.1–3.4 were waived by @tangconst via `tasks_waived` — the e2e walk is deferred, covered meanwhile by SiteShell unit tests and the Storybook plays. Archived as `openspec/changes/archive/2026-10-12-omit-profile-account-menu` (commit `88ff6c9a5`). | reviewer | archive commit | fixed 88ff6c9a5 — `accept:preflight` no longer reports the issued collision |
| 3 | fix | remove-my-auction-orders | tasks.md 1.1, 1.2 | Both tasks cited `shared-ui-auction-order-SC-01`, a scenario id the change retires; now cite `SC-15`/`SC-16`. | planning-dev | tasks.md | fixed (working tree) |
| 4 | fix | remove-my-auction-orders | shared/ui/auction-order delta SC-15 vs packages/ui/src/index.ts:315-345 | "Exactly these components … and no other component or type is exported for this surface" was untrue before and after: the same export block also ships `AuctionPhoneField`, `AuctionPhoneFieldProps`, `auctionPhoneSoftReady` and `auctionPhoneConfirmValue`. The restated requirement now names them. | planning-dev | spec delta | fixed (working tree) — named in "The winner-order surface exports" |
| 5 | note | store | openspec/changes/usd-lot-currency-winner-settlement-choice; apps/preview/storybook-static/index.json | Store-level `check:manual` failures blocked any acceptance: the draft's malformed journey heading got `winner-order-US-24`, its missing `## Raised` table was added empty, and `page_waived` records it is a draft awaiting PM marks. The stale storybook index was rebuilt with `build-storybook:workbench` (the config that includes package stories). | reviewer | usd-lot files, local index | fixed (working tree / local index rebuild) |
| 6 | note | remove-my-auction-orders | openspec/specs/shared/ui/site-chrome/feature-tcs.md:901 | A durable Settled line still describes `onOrders` ("My Auction Orders") keeping its export contract — a header callback prop, not a removed block; historical reconciliation text, no rule contradicted. | — | — | open |

## Coverage

| Source or dependency | Checked identity | Checks applied | Carried from |
| --- | --- | --- | --- |
| proposal.md, decisions.md, .openspec.yaml, tasks.md | working tree @ 0df8acf | page-to-delta, nothing-open, overlap | — |
| deltas: auction-orders, shared/ui/auction-order, account-record, page-shell (spec + journeys + feature-tcs) | working tree @ 0df8acf | folded-result, same-facts, journeys-and-cases | — |
| durable openspec/specs for the four capabilities + site-chrome | main @ 0df8acf | MODIFIED/REMOVED targets exist, no unchanged requirement contradicts | — |
| PRDs: post-bidding, shared/ui/auction-order, page-shell | working tree | same-facts, warnings, marked lines | — |
| omit-profile-account-menu (delta, acceptance.json, implementation.json, archive:preflight) | main @ 963ac5b79 | cluster ownership and order; accepted 2026-10-07, archived 2026-10-12 | — |
| nav-cart-count-badge, add-winner-partial-payment, draw-account-menu-and-profile deltas | working tree | overlap scan — different requirements in the same capabilities | — |
| `pnpm accept:preflight remove-my-auction-orders` | receipt: fingerprint 7f9db83…, baseline c297c95… | ready to fold and accept; only recorded purpose-rewrite warnings remain | — |
| `pnpm check:manual`, `pnpm archive:preflight omit-profile-account-menu --tasks-waived` | working tree / main | issued failure was post-fold only; archive gate cleared after attestation + acknowledgement | — |
