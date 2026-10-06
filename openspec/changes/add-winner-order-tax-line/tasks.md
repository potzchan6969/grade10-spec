# Tasks

Group 1 owns the invoice amount and pricing contract that groups 2 and 3
consume. Once it lands, the operator and winner surfaces are claimable in
parallel. `add-shipping-insurance-order-summary-tooltip`, which every group
builds on, archived on 2026-09-24.

The data shape, pricing boundary and rollout order are in
[`tech-design.md`](tech-design.md). The surfaces and their states are in
[`ui-design.md`](ui-design.md).

## 1. Invoice Tax contract and pricing (grade10) (owner: @htonyl)

Needs `add-shipping-insurance-order-summary-tooltip`.

- [ ] 1.1 Add contract and service tests for a taxed card invoice, an untaxed invoice, zero Tax refusal and a Tax-only reissue and a Tax removal (`post-sale-SC-155`, `post-sale-SC-156`, `post-sale-SC-157`, `post-sale-SC-158`, `post-sale-SC-210`, `winner-order-SC-216`, `winner-order-SC-04`)
- [ ] 1.2 Add nullable Tax minor units to the quote input, immutable invoice snapshot and the reissue's change detection; backfill existing invoices to no Tax
- [ ] 1.3 Extend the shared invoice pricing function so preview, send and reissue include present Tax in Subtotal before the existing card-fee gross-up, omit absent Tax and refuse zero, negative, fractional or unsafe values
- [ ] 1.4 Pass persisted Tax through the current-invoice read model and the existing invoice and receipt PDF `taxLine`, without deriving it from an address or adding a rate (`winner-order-SC-214`)
- [ ] 1.5 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run test:backend`, `pnpm run check:migrations`

## 2. Operator quote and reissue (grade10) (owner: @htonyl)

Needs group 1.

- [ ] 2.1 Add admin frontend tests for entering optional positive Tax on a first quote, leaving it empty, refusing zero and changing or removing Tax on a reissue (`post-sale-SC-155`, `post-sale-SC-156`, `post-sale-SC-157`, `post-sale-SC-158`, `post-sale-SC-210`)
- [ ] 2.2 Add the optional Tax amount field beside Insurance on the quote and reissue forms; send `null` for an empty field and show the command's validation refusal without coercing zero to absence
- [ ] 2.3 Show the recalculated Subtotal, Payment Processing Fee and Order Total from the quote preview
- [ ] 2.4 Add the operator field and refusal copy in every Grade10 admin locale
- [ ] 2.5 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, and the focused admin quote and reissue E2E journey

## 3. Winner summary, invoice and receipt (grade10) (owner: @htonyl)

Needs group 1.

- [ ] 3.1 Add winner frontend and document tests for pre-send TBD, the shown Tax amount and tip, absence after an untaxed send, card-fee inclusion, PDF line order and absence from both PDFs (`winner-order-SC-215`, `winner-order-SC-216`, `winner-order-SC-217`, `winner-order-SC-212`, `winner-order-SC-213`, `winner-order-SC-214`)
- [ ] 3.2 Add Tax between Insurance and Payment Processing Fee in the Winner Order line projection: TBD with its tip before send, formatted from the invoice after send and omitted after an untaxed send
- [ ] 3.3 Supply the existing invoice and receipt PDF blocks the `taxLine` when Tax is present (`winner-order-SC-214`), and `null` when absent
- [ ] 3.4 Add the Tax label and `Set by Grade10 for where your order ships. Some orders have none.` tooltip in every Grade10 site locale
- [ ] 3.5 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, and the focused Winner Order and PDF E2E journey

## 4. The walk - the taxed and the untaxed invoice (grade10) (owner: @ecchochan)

Needs groups 2 and 3. Walks the draft `feature-tcs.md` cases; human QA reviews them after deployment with `/tcs-review add-winner-order-tax-line`, and `/tcs-run-sheet` executes manual cases where needed.

- [ ] 4.1 Walk `post-sale-US-05`, `post-sale-US-07` and `winner-order-US-01`: send one taxed card invoice, confirm its summary, invoice and fee; reissue it with changed Tax and confirm the new invoice carries it; pay it and confirm the receipt repeats the reissued Tax (`post-sale-SC-155`, `post-sale-SC-158`, `winner-order-SC-216`, `winner-order-SC-217`, `winner-order-SC-214`)
- [ ] 4.2 Walk an untaxed invoice from quote through payment and confirm the summary, invoice and receipt omit Tax while pre-send still showed TBD and its tip (`post-sale-SC-156`, `winner-order-SC-215`, `winner-order-SC-212`, `winner-order-SC-213`)
- [ ] 4.3 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run test:backend`, and the focused admin and Winner Order E2E journeys

## 5. Records the winner keeps

`define-public-auction-identifiers` archived on 2026-10-06, so this change carries every edit to the requirement.

- [ ] 5.1 Add the receipt's "Tax when added" wording and the tracker's carrier-link row to `Records the winner keeps`: the receipt lists Tax, and the tracker shows the tracking number as the link with no separate carrier name (`winner-order-SC-18`, `winner-order-SC-20`; `clarify-auction-shipping-progress-copy` Q6)
- [ ] 5.2 Verify the Winner Order receipt and tracker against `winner-order-US2-TC1-2` and `winner-order-US2-TC2-2`
