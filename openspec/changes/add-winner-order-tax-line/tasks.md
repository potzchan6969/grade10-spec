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

- [x] 1.1 Add contract and service tests for a taxed card invoice, an untaxed invoice, zero Tax refusal and a Tax-only reissue and a Tax removal (`post-sale-SC-155`, `post-sale-SC-156`, `post-sale-SC-157`, `post-sale-SC-158`, `post-sale-SC-210`, `winner-order-SC-216`, `winner-order-SC-04`)
- [x] 1.2 Add nullable Tax minor units to the quote input, immutable invoice snapshot and the reissue's change detection; backfill existing invoices to no Tax
- [x] 1.3 Extend the shared invoice pricing function so preview, send and reissue include present Tax in Subtotal before the existing card-fee gross-up, omit absent Tax and refuse zero, negative, fractional or unsafe values
- [x] 1.4 Pass persisted Tax through the current-invoice read model and the existing invoice and receipt PDF `taxLine`, without deriving it from an address or adding a rate (`winner-order-SC-214`)
- [ ] 1.5 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run test:backend`, `pnpm run check:migrations`

## 2. Operator quote and reissue (grade10) (owner: @htonyl)

Needs group 1.

- [x] 2.1 Add admin frontend tests for entering optional positive Tax on a first quote, leaving it empty, refusing zero and changing or removing Tax on a reissue (`post-sale-SC-155`, `post-sale-SC-156`, `post-sale-SC-157`, `post-sale-SC-158`, `post-sale-SC-210`)
- [x] 2.2 Add the optional Tax amount field beside Insurance on the quote and reissue forms; send `null` for an empty field and show the command's validation refusal without coercing zero to absence
- [x] 2.3 Show the recalculated Subtotal, Payment Processing Fee and Order Total from the quote preview
- [x] 2.4 Add the operator field and refusal copy in every Grade10 admin locale
- [ ] 2.5 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, and the focused admin quote and reissue E2E journey

## 3. Winner summary, invoice and receipt (grade10) (owner: @htonyl)

Needs group 1.

- [x] 3.1 Add winner frontend and document tests for pre-send TBD, the shown Tax amount and tip, absence after an untaxed send, card-fee inclusion, PDF line order and absence from both PDFs (`winner-order-SC-215`, `winner-order-SC-216`, `winner-order-SC-217`, `winner-order-SC-212`, `winner-order-SC-213`, `winner-order-SC-214`)
- [x] 3.2 Add Tax between Insurance and Payment Processing Fee in the Winner Order line projection: TBD with its tip before send, formatted from the invoice after send and omitted after an untaxed send
- [x] 3.3 Supply the existing invoice and receipt PDF blocks the `taxLine` when Tax is present (`winner-order-SC-214`), and `null` when absent
- [x] 3.4 Add the Tax label and `Set by Grade10 for where your order ships. Some orders have none.` tooltip in every Grade10 site locale
- [ ] 3.5 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, and the focused Winner Order and PDF E2E journey

## 4. The walk - the taxed and the untaxed invoice (grade10) (owner: @ecchochan)

Needs groups 2 and 3. The staging walkthrough is waived in favor of the focused [E2E snapshots posted to PR #920](https://github.com/9gag/grade10/pull/920#issuecomment-6034475365). Uses draft `feature-tcs.md` as its planning input.

- [ ] 4.3 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run test:backend`, and the focused admin and Winner Order E2E journeys

## 5. Records the winner keeps (owner: @htonyl)

`define-public-auction-identifiers` archived on 2026-10-06, so this change carries every edit to the requirement.

- [x] 5.1 Add the receipt's "Tax when added" wording and the tracker's carrier-link row to `Records the winner keeps`: the receipt lists Tax, and the tracker shows the tracking number as the link when the operator recorded a tracker link, plain text otherwise, with no separate carrier name (`winner-order-SC-18`, `winner-order-SC-20`; `clarify-auction-shipping-progress-copy` Q6, Q7)
- [x] 5.2 Verify the Winner Order receipt and tracker against `winner-order-US2-TC1-2` and `winner-order-US2-TC2-3`

## 6. Card fee from the card rule (grade10) (owner: @htonyl)

Needs group 1. The card rule itself is `complete-auction-post-sale`'s Payment Settings requirement; this group prices the quote, the reissue and the invoice from it ([Q17](decisions.md#decisions)).

- [ ] 6.1 Add service and admin frontend tests for a card quote priced from the card rule, `CARD_FEE_UNSET` on a send and a reissue with no rule for the currency, `QUOTE_CHANGED` on a stale total, and a bank transfer send that reads no provider fees (`grade10-admin-auction-post-sale-SC-69`, `-SC-70`, `-SC-117`, `-SC-119`, `-SC-125`, `-SC-126`, `winner-order-SC-62`; `post-sale-US5-TC18-1`, `-TC19-1`, `post-sale-US7-TC47-1`, `-TC48-1`, `-TC25-2`)
- [ ] 6.2 Price the card fee in preview, send and reissue from the card rule for the order's currency; refuse `CARD_FEE_UNSET` with no rule and name the currency; read no provider fees
- [ ] 6.3 Carry the order total the operator read on send and reissue, price again on receipt and refuse `QUOTE_CHANGED` when it differs
- [ ] 6.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run test:backend`
