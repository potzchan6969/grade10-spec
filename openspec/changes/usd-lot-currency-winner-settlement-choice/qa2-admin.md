# QA2 Admin Reconciliation - usd-lot-currency-winner-settlement-choice

## Done

- Reconciled the five admin feature suites and the active admin domain suite after the corrected blind QA1 and Dev readings. The required pre-QA2 Dev review preflight passed.
- Inputs read: `openspec/changes/usd-lot-currency-winner-settlement-choice/{proposal.md,decisions.md,tech-design.md,tasks.md}`; the five admin delta `user-journeys.md` and `spec.md` files; their durable admin `spec.md`, `user-journeys.md`, `feature-tcs.md`, and `domain-tcs.md`; the linked admin auction PRDs; the corrected blind QA1 reports for the admin cases and internal-bid cases; `docs/governance/specs-to-test-cases.md`; and `.claude/skills/planning-dev/SKILL.md`.
- The product decisions are settled: all listing and bid amounts use USD; the premium minimum is USD; card rules remain per settlement currency in USD and HKD; regular winners choose settlement and method in normal setup; internal house wins receive HKD and bank transfer on FPS at close and still require the operator to quote and send the invoice; rail-only changes qualify for reissue when the rail is offered for the currency. Q23, Q20, Q29, Q30, Q31 and Q32 settle the relevant prior QA1 findings. No admin product question remains open.

## Considerations & Trade-off

- A `covers` link is recorded only where one case's own route and Expected Results assert the scenario's complete THEN. A partial assertion spread across cases remains uncovered.
- All new or changed cases remain draft. This reconciliation does not claim execution or human approval.
- The internal order path is distinct from regular winner setup: HKD/FPS is assigned at close, but quote entry and invoice send remain operator actions.

## Questions & Blockers

None.

## Follow-up

- The parent coordinator ran the case validator before restoring the unchanged internal-bid journey context. That run reported 53 errors, including undefined internal-bid journeys and three legacy heading suffix mismatches; the three heading suffixes have since been corrected. No final validator pass is claimed. Rerun validation after restoring the durable journey context.

## Anchor coverage and dispositions

| Suite | Anchor coverage | Case dispositions | Scenario coverage and findings |
| --- | --- | --- | --- |
| Admin listing | `grade10-admin-auction-listing-US-01`, `US-03`, `US-09`, and `US-74` each retain at least one active case. | All 14 active cases remain draft. TC-lej retains its marker ID and route at rev2; other active IDs, revisions, routes and classifications remain unchanged. | `SC-159` is asserted by `US74-TC1`; `SC-160` by `US3-TC25`; `SC-164` and `SC-57` by `US74-TC2` and TC3 respectively; `SC-165` by TC3; `SC-161` by TC4; `SC-162` by TC5. `SC-57`'s active THEN asserts API refusal and the draft remains unchanged, both asserted by TC3's EUR row. Its historical title and serving-anchor wording mention the form, but the active scenario body does not require form refusal. `SC-163` remains out of suite because the unchanged-USD migration guard is owned by the migration check. |
| Admin payment settings | The retained payment-settings journeys each have active cases, including the new USD/HKD card-rule anchor. | All 11 active draft cases retain their current IDs, revisions, routes and classifications. | Existing cases continue to cover settlement minimum and card-rule behavior. The Out of suite entries for permission, malformed-rule, and example-fee scenarios remain out of this UI suite where the case route does not assert the complete THEN. No changed settlement rule is over-claimed. |
| Admin post-sale | The quote, order-status, invoice-send, reissue, pre-send edit, payment-fee and total-read journeys retain active cases. | All 12 active cases remain draft. TC-70n and TC-r3c retain their IDs and routes at rev2; other IDs, revisions and routes remain unchanged. | TC-70n covers `SC-251` and `SC-252`; TC-w5z covers `SC-247`; TC-r3c covers `SC-245`; TC-9i1 covers refusal scenarios `SC-246` and `SC-248`; TC-pjh covers `SC-249`; TC-rail covers `SC-254` and `SC-255`. The Out of suite list retains only scenarios whose full THEN is not asserted by a route in this suite. |
| Admin internal bid | All nine internal-bid journeys retain active coverage; US-08 still covers window and USD starting-price changes. | The obsolete currency-edit case remains deprecated (`covers=none`). TC-v7q stays active draft, keeps its route ID, moves to rev2 and traces US-01. All other active IDs, revisions and routes remain unchanged. | TC-v7q covers `SC-35`, `SC-42` and `SC-43` through its JPY, HKD and EUR refusal rows. The domain walk fully asserts `SC-71`, `SC-73` and `SC-75`. Internal `SC-74` remains out of suite only for the no-account-suspension assertion, covered by the backend expiry check. |
| Admin test winners | The single root journey, Making a test winner, retains active coverage. | The 12 active draft cases retain their IDs and routes; US1-TC7 changes from rev 2 to rev 3 within the same anchor route. | Revised US1-TC7 fully asserts `SC-11` and `SC-25`; US1-TC18 fully asserts `SC-24`. `SC-13` remains out of suite under the production-console bundle check. |
| Admin domain | Cross-feature US1, US2, US3 and US4 have active cases; the two retained deprecated cases stay historical. | TC1 and TC4 remain draft; TC2 remains deprecated. US4-TC2 retains its marker ID and route at rev3. | US3-TC1 remains the normal winner route with HKD/FPS chosen by the winner. US4-TC2 (`g10adm.auction-dmn.TC-sjg`) asserts internal-bid `SC-71`, `SC-73` and `SC-75` plus winner-order `SC-277` on the complete internal HKD/FPS route. At close it asserts one internal order, `not_issued`, no invoice issued, and `bank_transfer`/`fps`; after send it asserts quote USD inputs, HKD/FPS, and a pending invoice; after cancellation, it asserts no order letters to any recipient from close through expiry and cancellation. It does not claim regular winner setup behavior. The no-suspension part of internal `SC-74` remains outside the domain case. Independent QA2 winner review agrees the `SC-277` THEN is asserted. |

## Current case disposition ledger

Every active case below was read against its anchor and the changed requirements. “Retain” means the ID, route and classification remain unchanged and the case stays draft. The listed exceptions retain their ID but are deprecated. US1-TC7 in test-winners keeps its ID and route and is revised to rev 3 because it now asserts normal setup as part of the same journey. No case is treated as an execution result or human approval.

### listing

- `g10adm.auction-listing.TC-qk8` rev 3 - retain as active draft; covers: none. grade10-admin-auction-listing-US1-TC3-3: Draft refuses a negative or non-whole starting price
- `g10adm.auction-listing.TC-uka` rev 2 - retain as active draft; covers: none. grade10-admin-auction-listing-US1-TC6-2: Draft keeps a starting price of 0 apart from an empty one
- `g10adm.auction-listing.TC-igg` rev 2 - retain as active draft; covers: none. grade10-admin-auction-listing-US3-TC1-2: Operator creates a filled draft
- `g10adm.auction-listing.TC-8u6` rev 2 - retain as active draft; covers: none. grade10-admin-auction-listing-US3-TC15-2: Operator corrects a created listing's starting price
- `g10adm.auction-listing.TC-h7v` rev 2 - retain as active draft; covers: none. grade10-admin-auction-listing-US3-TC21-2: Create accepts a starting price of 0 in USD
- `g10adm.auction-listing.TC-fc7` rev 2 - retain as active draft; covers: none. grade10-admin-auction-listing-US3-TC22-2: API create refuses a negative or non-whole starting price
- `g10adm.auction-listing.TC-ebb` rev 2 - retain as active draft; covers: none. grade10-admin-auction-listing-US3-TC24-2: Operator lowers a created listing's starting price to 0
- `g10adm.auction-listing.TC-g4v` rev 2 - retain as active draft; covers: grade10-admin-auction-listing-SC-160. grade10-admin-auction-listing-US3-TC25-2: API create with 0 and no currency creates as USD 0
- `g10adm.auction-listing.TC-m53` rev 2 - retain as deprecated; covers: none. grade10-admin-auction-listing-US3-TC26-2: Currency change reformats the same minor-unit price
- `g10adm.auction-listing.TC-xzh` rev 3 - retain as active draft; covers: none. grade10-admin-auction-listing-US9-TC3-3: Relist from the row opens a new draft holding stock on Save
- `g10adm.auction-listing.TC-htj` rev 1 - retain as active draft; covers: grade10-admin-auction-listing-SC-159. g10adm.auction-listing.US74-TC1: The listing form offers no currency and a created listing reads USD
- `g10adm.auction-listing.TC-e4m` rev 1 - retain as active draft; covers: grade10-admin-auction-listing-SC-164. g10adm.auction-listing.US74-TC2: A draft refuses any currency other than USD
- `g10adm.auction-listing.TC-lej` rev 2 - QA2 repair; retain as active draft; covers: `SC-165`, `SC-57`. g10adm.auction-listing.US74-TC3: Create refuses any currency other than USD; EUR row asserts API refusal and unchanged draft.
- `g10adm.auction-listing.TC-ctn` rev 1 - retain as active draft; covers: grade10-admin-auction-listing-SC-161. g10adm.auction-listing.US74-TC4: An update of a created listing refuses any currency other than USD
- `g10adm.auction-listing.TC-mig` rev 1 - retain as active draft; covers: grade10-admin-auction-listing-SC-162. g10adm.auction-listing.US74-TC5: Earlier HKD and JPY listings keep their amounts and history when converted to USD
### payment-settings

- `g10adm.auction-payment-settings.TC-q43` rev 2 - retain as active draft; covers: none. grade10-admin-auction-payment-settings-US1-TC1-2: Initial page shows one USD minimum
- `g10adm.auction-payment-settings.TC-nzx` rev 2 - retain as active draft; covers: none. grade10-admin-auction-payment-settings-US1-TC2-2: A saved USD minimum persists
- `g10adm.auction-payment-settings.TC-s5q` rev 2 - retain as active draft; covers: none. grade10-admin-auction-payment-settings-US1-TC3-2: Invalid save changes nothing
- `g10adm.auction-payment-settings.TC-gof` rev 2 - retain as active draft; covers: none. grade10-admin-auction-payment-settings-US1-TC5-2: Finance saves the minimum in major units, zero included
- `g10adm.auction-payment-settings.TC-6sl` rev 1 - retain as active draft; covers: none. grade10-admin-auction-payment-settings-US1-TC6-1: A premium minimum in HKD or JPY is refused
- `g10adm.auction-payment-settings.TC-df4` rev 2 - retain as active draft; covers: none. grade10-admin-auction-payment-settings-US2-TC1-2: No rule until Finance sets one
- `g10adm.auction-payment-settings.TC-lto` rev 1 - retain as active draft; covers: none. g10adm.auction-payment-settings.US3-TC1: Card rules are held for USD and HKD, and for no other currency
- `g10adm.auction-payment-settings.TC-xsy` rev 1 - retain as active draft; covers: none. g10adm.auction-payment-settings.US3-TC2: The USD and HKD rules are kept apart
- `g10adm.auction-payment-settings.TC-93a` rev 1 - retain as active draft; covers: none. g10adm.auction-payment-settings.US3-TC3: A JPY card rule is refused
- `g10adm.auction-payment-settings.TC-c9t` rev 1 - retain as active draft; covers: none. g10adm.auction-payment-settings.US3-TC4: Clearing a currency's rule withdraws card there
- `g10adm.auction-payment-settings.TC-80l` rev 1 - retain as active draft; covers: none. g10adm.auction-payment-settings.US3-TC5: Saving a USD rule with HKD empty offers card in USD
### post-sale

- `g10adm.auction-post-sale.TC-u4w` rev 2 - retain as active draft; covers: none. post-sale-US5-TC9-2: Operator sends an invoice with tax typed in USD
- `g10adm.auction-post-sale.TC-70n` rev 2 - retain as active draft; covers: `SC-251`, `SC-252`. post-sale-US5-TC20-2: Every quote amount is typed in USD and sent in the settlement currency
- `g10adm.auction-post-sale.TC-w5z` rev 1 - retain as active draft; covers: `SC-247`. post-sale-US5-TC21-1: The settlement currency is changed before send
- `g10adm.auction-post-sale.TC-r3c` rev 2 - retain as active draft; covers: `SC-245`. post-sale-US5-TC22-2: The settlement currency is changed on a reissue after send
- `g10adm.auction-post-sale.TC-d4e` rev 1 - retain as active draft; covers: none. post-sale-US5-TC23-1: The quote names the payment method and rail the winner chose
- `g10adm.auction-post-sale.TC-9yj` rev 1 - retain as active draft; covers: none. post-sale-US5-TC24-1: A typed amount that does not convert to a whole HK$ is rounded up
- `g10adm.auction-post-sale.TC-jru` rev 1 - retain as active draft; covers: none. post-sale-US5-TC25-1: Sending prices the invoice in the settlement currency and locks the order
- `g10adm.auction-post-sale.TC-qz7` rev 1 - retain as active draft; covers: none. post-sale-US5-TC26-1: A large bank transfer fee is accepted and converts with the other lines
- `g10adm.auction-post-sale.TC-9i1` rev 1 - retain as active draft; covers: `SC-246`, `SC-248`. post-sale-US5-TC27-1: A currency change that leaves the held rail unoffered is refused
- `g10adm.auction-post-sale.TC-pjh` rev 1 - retain as active draft; covers: `SC-249`. post-sale-US5-TC28-1: An operator edits the method and rail before send, and a rail the currency does not offer is refused
- `g10adm.auction-post-sale.TC-ddn` rev 1 - retain as active draft; covers: none. post-sale-US5-TC30-1: Recording setup by telephone carries a settlement currency
- `g10adm.auction-post-sale.TC-rail` rev 1 - retain as active draft; covers: grade10-admin-auction-post-sale-SC-254,grade10-admin-auction-post-sale-SC-255. post-sale-US5-TC31-1: A rail-only change is accepted on reissue
### internal-bid

- `g10adm.auction-internal-bid.TC-d07` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US1-TC1-2: At its time the internal bid is committed and resolved like a maximum
- `g10adm.auction-internal-bid.TC-5y2` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US1-TC2-2: Commit time at the limits of the window is accepted
- `g10adm.auction-internal-bid.TC-39a` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US1-TC3-2: A value outside the save limits or a missing value is refused
- `g10adm.auction-internal-bid.TC-of0` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US1-TC4-2: Before its time the house is not in the bidding
- `g10adm.auction-internal-bid.TC-x4y` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US1-TC5-2: An internal bid is refused on a listing it cannot be set on
- `g10adm.auction-internal-bid.TC-88a` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US1-TC6-2: An internal bid at the currency ceiling is committed
- `g10adm.auction-internal-bid.TC-jm4` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US1-TC7-2: The amount is entered in whole major units and held in minor units
- `g10adm.auction-internal-bid.TC-kyo` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US1-TC8-2: An internal bid on a created listing published before its time commits at its time
- `g10adm.auction-internal-bid.TC-huh` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US1-TC9-2: A commit time already past is refused on a lot taking bids
- `g10adm.auction-internal-bid.TC-dui` rev 2 - retain as deprecated; covers: none. grade10-admin-auction-internal-bid-US1-TC10-2: A created listing's edit clears the internal bid only when it falls outside
- `g10adm.auction-internal-bid.TC-qzd` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US1-TC11-2: A second save edits the one internal bid
- `g10adm.auction-internal-bid.TC-6a2` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US1-TC12-2: One internal bidder serves internal bids on several listings
- `g10adm.auction-internal-bid.TC-akn` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US1-TC13-2: The internal bidder changes only before the internal bid's time
- `g10adm.auction-internal-bid.TC-h13` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US1-TC14-2: A save naming a retired internal bidder is refused
- `g10adm.auction-internal-bid.TC-qbl` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US2-TC1-2: A changed amount and time commit as changed
- `g10adm.auction-internal-bid.TC-1p0` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US2-TC2-2: A removed internal bid never commits
- `g10adm.auction-internal-bid.TC-kok` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US2-TC3-2: A changed time outside the window is refused
- `g10adm.auction-internal-bid.TC-ul9` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US2-TC4-2: Calling off the listing drops its internal bid
- `g10adm.auction-internal-bid.TC-gem` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US3-TC1-2: A raise while outbid resolves as a new commitment
- `g10adm.auction-internal-bid.TC-vk1` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US3-TC2-2: A raise while leading moves neither the price nor the leader
- `g10adm.auction-internal-bid.TC-ben` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US3-TC3-2: A raise at or after the close is refused
- `g10adm.auction-internal-bid.TC-t5b` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US3-TC4-2: The commit time is fixed once committed
- `g10adm.auction-internal-bid.TC-nrn` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US3-TC5-2: A raise still short of the next minimum is refused
- `g10adm.auction-internal-bid.TC-fku` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US3-TC6-2: A placed internal bid still raises after its internal bidder is retired
- `g10adm.auction-internal-bid.TC-pw6` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US4-TC1-2: A lower that keeps the leader and the current bid is accepted
- `g10adm.auction-internal-bid.TC-cu7` rev 3 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US4-TC2-3: A lower that would move the lead or the price is refused
- `g10adm.auction-internal-bid.TC-79d` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US4-TC3-2: A lower at or after the close is refused
- `g10adm.auction-internal-bid.TC-0l0` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US4-TC4-2: A lower behind another's lead is held only to the house's own bid
- `g10adm.auction-internal-bid.TC-6at` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US5-TC1-2: Placed at the next minimum, not placed one major unit below it
- `g10adm.auction-internal-bid.TC-7rg` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US5-TC2-2: Raising a not-placed internal bid places it at once
- `g10adm.auction-internal-bid.TC-2dl` rev 3 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US5-TC3-3: A not-placed internal bid lets the lot sell to the collector
- `g10adm.auction-internal-bid.TC-kew` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US5-TC4-2: A not-placed internal bid can be lowered
- `g10adm.auction-internal-bid.TC-wf1` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US5-TC5-2: A not-placed internal bid can be removed
- `g10adm.auction-internal-bid.TC-jzx` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US5-TC6-2: A raise or re-save of a not-placed internal bid still short is refused
- `g10adm.auction-internal-bid.TC-ipm` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US5-TC7-2: An internal bid whose time passes while the listing is created is not placed
- `g10adm.auction-internal-bid.TC-54s` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US5-TC8-2: While the listing is created a not-placed internal bid takes a raise or a lower and stays not placed
- `g10adm.auction-internal-bid.TC-rzs` rev 3 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US6-TC1-3: A house win opens one order for its internal bidder, flagged internal
- `g10adm.auction-internal-bid.TC-17a` rev 3 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US6-TC2-3: Only a reserve holder reads the listing flagged as its internal bidder's win
- `g10adm.auction-internal-bid.TC-vuc` rev 3 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US6-TC3-3: A house win's order enters Orders and sends no order letter
- `g10adm.auction-internal-bid.TC-cww` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US6-TC4-2: At the close the internal order takes HKD settlement and FPS with the internal bidder's billing address
- `g10adm.auction-internal-bid.TC-dqh` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US6-TC5-2: An operator sends the internal order's invoice by hand, and no invoice letter goes out
- `g10adm.auction-internal-bid.TC-kgs` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US6-TC6-2: The internal invoice expires after its 7 days, silently, and the order waits for the operator
- `g10adm.auction-internal-bid.TC-2d2` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US6-TC7-2: An operator cancels the internal order by hand and the lot goes back to stock
- `g10adm.auction-internal-bid.TC-hy3` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US7-TC1-2: Before the house bids staff cannot tell a lot is protected
- `g10adm.auction-internal-bid.TC-kku` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US7-TC2-2: The API refuses every internal bid read and write without secret-floor access
- `g10adm.auction-internal-bid.TC-jjr` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US7-TC3-2: The audit trail records each internal bid act, never its amount or time
- `g10adm.auction-internal-bid.TC-rfj` rev 3 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US7-TC4-3: After the close staff read the lot sold and its buyer as House, never the amount, time or internal bidder
- `g10adm.auction-internal-bid.TC-net` rev 3 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US7-TC5-3: A staff listing edit that clears the internal bid tells staff nothing
- `g10adm.auction-internal-bid.TC-r33` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US7-TC6-2: Stats counts the house as a bidder, matching the public count
- `g10adm.auction-internal-bid.TC-g02` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US7-TC7-2: Once the house bids staff see House, never the amount or time
- `g10adm.auction-internal-bid.TC-gnk` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US7-TC8-2: The staff listing read names the house only once it bids
- `g10adm.auction-internal-bid.TC-4b4` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US7-TC9-2: Staff see no row for a house raise or lower
- `g10adm.auction-internal-bid.TC-mnc` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US7-TC10-2: A reserve holder reads which internal bidder bid on each listing
- `g10adm.auction-internal-bid.TC-k1j` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US7-TC11-2: An internal bidder's email label finds no listing and no bidder
- `g10adm.auction-internal-bid.TC-81p` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US7-TC12-2: After the close only a reserve holder's reads carry the internal bidder and its win
- `g10adm.auction-internal-bid.TC-bgs` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US8-TC1-2: A window change clears the internal bid only when its time falls outside
- `g10adm.auction-internal-bid.TC-96e` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US8-TC2-2: A starting-price change clears the internal bid only when the price passes it
- `g10adm.auction-internal-bid.TC-qxx` rev 2 - retain as deprecated; covers: none. grade10-admin-auction-internal-bid-US8-TC3-2: A listing currency change no longer exists
- `g10adm.auction-internal-bid.TC-o5e` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US8-TC4-2: A reserve holder sees the clearing whoever made the edit
- `g10adm.auction-internal-bid.TC-m9d` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US8-TC5-2: After a clearing the admin sets a new internal bid and it commits
- `g10adm.auction-internal-bid.TC-v7q` rev 2 - QA2 repair; retain as active draft; covers: `SC-35`, `SC-42`, `SC-43`. grade10-admin-auction-internal-bid-US8-TC6-2: A non-USD listing update leaves its internal bid unchanged; its Trace now names US-01, the serving journey.
- `g10adm.auction-internal-bid.TC-wkj` rev 3 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US9-TC1-3: An added internal bidder keeps its billing address, is offered at Save and has no site account
- `g10adm.auction-internal-bid.TC-kg8` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US9-TC2-2: A new internal bidder without a name or with a label already used is refused
- `g10adm.auction-internal-bid.TC-g99` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US9-TC3-2: An internal bidder's name changes at any time
- `g10adm.auction-internal-bid.TC-xjb` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US9-TC4-2: An internal bidder's email label is fixed once it has bid
- `g10adm.auction-internal-bid.TC-8at` rev 3 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US9-TC5-3: A retired internal bidder is no longer offered and keeps its history
- `g10adm.auction-internal-bid.TC-skz` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US9-TC6-2: An internal bidder named on a Scheduled or Not placed internal bid cannot be retired
- `g10adm.auction-internal-bid.TC-eo1` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US9-TC7-2: Internal bidders cannot be added, renamed or retired without secret-floor access
- `g10adm.auction-internal-bid.TC-fnh` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US9-TC8-2: The audit trail records each internal bidder act, never a listing
- `g10adm.auction-internal-bid.TC-nbx` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US9-TC9-2: An internal bidder whose only Not placed internal bid is on a closed lot can be retired
- `g10adm.auction-internal-bid.TC-2nf` rev 2 - retain as active draft; covers: none. grade10-admin-auction-internal-bid-US9-TC10-2: A billing address change after a win leaves the internal order's address as it was
### test-winners

- `g10adm.auction-test-winners.TC-7qq` rev 3 - retain as active draft; covers: grade10-admin-auction-test-winners-SC-11,grade10-admin-auction-test-winners-SC-25. g10adm.auction-test-winners.US1-TC7: One action makes a winner waiting on setup
- `g10adm.auction-test-winners.TC-abd` rev 1 - retain as active draft; covers: none. g10adm.auction-test-winners.US1-TC8: Production, or a missing grant, makes nothing
- `g10adm.auction-test-winners.TC-p4o` rev 1 - retain as active draft; covers: none. g10adm.auction-test-winners.US1-TC9: An address not the operator's tagged one, or holding a signed-in account, is refused
- `g10adm.auction-test-winners.TC-3qi` rev 1 - retain as active draft; covers: none. g10adm.auction-test-winners.US1-TC10: The same address makes one test winner
- `g10adm.auction-test-winners.TC-47e` rev 1 - retain as active draft; covers: none. g10adm.auction-test-winners.US1-TC11: A past close up to 30 days back, at the limit included, opens an overdue order
- `g10adm.auction-test-winners.TC-b5b` rev 1 - retain as active draft; covers: none. g10adm.auction-test-winners.US1-TC12: A close beyond 30 days back or in the future is refused
- `g10adm.auction-test-winners.TC-uu2` rev 1 - retain as active draft; covers: none. g10adm.auction-test-winners.US1-TC13: The test lot takes no bid, its order cancelled or not
- `g10adm.auction-test-winners.TC-69r` rev 1 - retain as active draft; covers: none. g10adm.auction-test-winners.US1-TC14: The emailed link signs in as the test winner, and a new one can be sent
- `g10adm.auction-test-winners.TC-ohr` rev 1 - retain as active draft; covers: none. g10adm.auction-test-winners.US1-TC15: Winners lists test winners newest first
- `g10adm.auction-test-winners.TC-nom` rev 1 - retain as active draft; covers: none. g10adm.auction-test-winners.US1-TC16: Without both grants Winners names the access it needs
- `g10adm.auction-test-winners.TC-setup` rev 1 - retain as active draft; covers: none. g10adm.auction-test-winners.US1-TC17: A test winner chooses settlement currency and rail with no default
- `g10adm.auction-test-winners.TC-currency` rev 1 - retain as active draft; covers: none. g10adm.auction-test-winners.US1-TC18: A non-USD bid currency refuses the test winner atomically

### domain-tcs

- `g10adm.auction-domain.TC-y1d` rev 1 - retain as active draft; covers: none. grade10-admin-auction-e2e-US1-TC1-1: Published cover leaves an unpublished lot off the catalogue
- `g10adm.auction-domain.TC-t49` rev 4 - retain as active draft; covers: none. grade10-admin-auction-e2e-US2-TC1-4: Campaign cancellation releases addresses for later lots
- `g10adm.auction-domain.TC-dly` rev 3 - retain as active draft; covers: none. grade10-admin-auction-e2e-US3-TC1-3: A published lot closes and is collected through to delivered
- `g10adm.auction-domain.TC-z12` rev 2 - retain as deprecated; covers: none. grade10-admin-auction-e2e-US3-TC2-2: A wire request on a closed lot releases the card hold
- `g10adm.auction-dmn.TC-sjg` rev 3 - retain as active draft; covers: `SC-71`, `SC-73`, `SC-75`, winner-order `SC-277` (`g10.auction-winner-order.SC-los`). The close result asserts exactly one order with `not_issued`, no invoice, HKD and bank transfer on FPS. After send, it asserts the quote names HKD/FPS and the invoice is pending. The send-log result excludes all order letters to every recipient through send, expiry and cancellation. grade10-admin-auction-e2e-US4-TC2-3: An internal bidder's win is invoiced, expires and is cancelled, and the stock comes back
- `g10adm.auction-domain.TC-98w` rev 2 - retain as deprecated; covers: none. grade10-admin-auction-e2e-US4-TC1-2: A bought-in lot releases its stock and relists with no internal bid

## Source paths

- Change inputs: `openspec/changes/usd-lot-currency-winner-settlement-choice/proposal.md`, `decisions.md`, `tech-design.md`, `tasks.md`.
- Changed contracts: `openspec/changes/usd-lot-currency-winner-settlement-choice/specs/grade10-admin/auction/{listing,payment-settings,post-sale,internal-bid,test-winners}/{spec.md,user-journeys.md}`; `openspec/changes/usd-lot-currency-winner-settlement-choice/specs/grade10-site/auction/winner-order/spec.md` for winner-order `SC-277`.
- Durable baseline: `openspec/specs/grade10-admin/auction/{listing,payment-settings,post-sale,internal-bid,test-winners}/{spec.md,user-journeys.md,feature-tcs.md}` and `openspec/specs/grade10-admin/auction/domain-tcs.md`.
- PRD sources: `docs/prds/products/grade10-admin/auction/{management.md,internal-bid.md}` and linked auction pages under `docs/prds/products/grade10-site/auction/` and `docs/prds/products/shared/ui/`.
- Blind and preflight evidence: corrected blind QA1 reports for admin cases and internal-bid cases; independent Dev review preflight passed before QA2.
- Governing QA rules: `docs/governance/specs-to-test-cases.md` and `.claude/skills/planning-dev/SKILL.md`.
