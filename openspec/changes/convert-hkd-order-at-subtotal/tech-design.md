## Context

The proposal holds the motive. This file holds how the work lands. The rules are in `grade10-site/auction/winner-order` ("An HKD order converts each USD line at a fixed rate and rounds it up", "Invoice fields", "The Order Summary reads the settlement currency, with USD beneath each HKD line", "An HKD invoice and receipt list the USD lines, then the HKD Subtotal, fee and Order Total"), `grade10-site/auction/notifications-order`, `grade10-admin/auction/post-sale` and `shared/ui/auction-order`.

What `grade10` does today, read at `bf94489156`:

- **One conversion** - `packages/grade10-auction/backend/src/services/orders/quotePolicy.ts` holds `USD_TO_HKD_RATE` (785 over 100) and `settleUsdMinor`, which rounds each line up to a whole HK$. `calculateInvoiceQuote` converts every line, sums the converted lines with `priceInvoice`, and computes the fee on that sum. The send, the reissue and the quote preview all call it, so one function prices all three.
- **One lint** - `scripts/checks/check-settlement-conversion.mjs` fails any file outside that module that names `settleUsdMinor` or `USD_TO_HKD_RATE`. Tests and `e2e/` are exempt.
- **What an invoice stores** - `insertInvoiceRevision` (`repositories/auctionInvoices.ts`) writes the per-line columns `hammer_amount` to `tax_amount`, `subtotal_amount`, `payment_processing_fee_amount` and `final_amount`, in the settlement currency, and one `auction_invoice_settlement_lines` row per line with `usd_minor` and `settlement_minor`.
- **Four readers recompute** - `winnerOrderView.ts` (`summaryLines`) sums `usd_minor` for the note and counts a bank fee in it; `AuctionInvoicePage.tsx` sums `settlement_minor` for its Subtotal; `InvoiceQuoteFields.tsx` and `InvoiceAndPayments.tsx` show each line's `settlement_minor`.
- **The PDFs read the invoice row only** - `services/auctions/orderDocument.ts` (`orderValue`) formats `hammer_amount`, `buyer_premium_amount`, `subtotal_amount` and the rest in the invoice currency. It never reads the settlement lines, so it cannot print a USD line. A document is drawn at its first open and served from the archive after (`archivedOrRendered`).
- **The receipt letter lists no lines** - `email/emailPort.ts` builds `payment_received` with an `Amount paid` highlight and `facts: []`, and attaches no PDF. The durable "Receipt in the letter" asks for itemised lines and an attachment; neither is built. This change builds the lines, because its scenarios need them, and leaves the attachment alone.
- **Store** - `AuctionWinnerOrder` already takes `summary.subtotal` and `summary.feeLines` (grade10-spec#1288) and draws them between separators (`auction-winner-order.tsx`). The invoice and receipt PDF blocks take preformatted strings only (`PdfItemRow`, `PdfLineItem` in `pdf-document.ts`), so a USD item table above an HK$ summary needs no block change.

## Goals / Non-Goals

**Goals:**

- One pure rule prices the Subtotal, the fee and the Order Total, and one call site owns the rate.
- Every surface reads one breakdown of a stored invoice and does no arithmetic of its own beyond adding integers.
- No migration and no backfill.

**Non-Goals:**

- A rate column, a rate table or a third currency.
- Re-pricing or rewriting a sent invoice.
- Attaching the receipt PDF to the receipt letter, which the durable spec already asks for.

## Decisions

### The conversion stays in one module

- **Spec governs** - "An HKD order converts each USD line at a fixed rate and rounds it up".
- **Same name, same file** - `settleUsdMinor` keeps its name and its file, and rounds up to the next HKD cent: `(usd * 785n + 99n) / 100n`, BigInt, with the existing safe-integer guard. The lint regex needs no change and the e2e helper and tests keep a name to import.
- **Three calls, one rounding** - the module calls it on the sum of the five USD lines (the Subtotal), on the bank transfer fee, and on each line for the informational value below. A second rounding function would give two owners of one rule.
- **The rate in the note** - `USD_TO_HKD_RATE_LABEL = "7.85"` in `winnerOrderView.ts` is a second spelling of the rate. A test pins it to `USD_TO_HKD_RATE`; tests may import the constant.

### Subtotal, fee and total

- **Order of work in `calculateInvoiceQuote`** - the USD subtotal is `priceInvoice` over the USD lines with a fee of 0; the Subtotal is `settleUsdMinor` of it; the fee is `processingFeeFor(method, Subtotal, cardRule, settleUsdMinor(typedFee))`; the Order Total is the Subtotal plus the fee. For USD the conversion is the identity, so USD and HKD share one path.
- **`price` no longer comes from the converted lines** - `PricedQuote.price` is built from those three numbers. Under HKD the per-line values do not add up to the Subtotal, so `priceInvoice(lines)` over them is wrong. A new `priceSettledInvoice(subtotalMinor, feeMinor)` beside `priceInvoice` in `packages/grade10-auction/contracts/src/invoicePricing.ts` adds the two with the same safe-integer guards.
- **`QUOTE_CHANGED` is unchanged** - the send compares `price.totalMinor` with the total the operator read, and the preview and the send price through the same call.
- **Worked example** - USD lines 15000, 3000, 4900, 2000 and 200 add to 25100 and convert to 197035 (HK$1,970.35), where the old rule gave 197200. With the HKD card rule of 3.4 per cent and 235 the fee is 7179 and the Order Total 204214. A bank transfer fee of 257 converts to 2018 and the Order Total is 199053.

### What an HKD invoice stores - no schema change

| Column or row | Holds under HKD |
| --- | --- |
| `subtotal_amount` | The Subtotal, converted once. Authoritative |
| `payment_processing_fee_amount` and the `processing_fee` line's `settlement_minor` | The fee in HKD. Authoritative |
| `final_amount` | The Order Total. Authoritative; the card charge, the payment match and the tolerance all read it (`cardPayments.ts` creates the Stripe checkout session with `amountMinor: invoice.finalAmount`) |
| `usd_minor` on each non-fee line | The USD fact. Authoritative; a reissue seeds from it |
| `usd_minor` on the `processing_fee` line | The typed USD fee for a bank transfer, null for a card |
| `hammer_amount` to `tax_amount` and `settlement_minor` of a non-fee line | That line's own conversion, rounded up to the cent. Informational |

- **Nothing to migrate** - every column above exists: `subtotal_amount` is a nullable bigint on `auction_invoices` (`db/schema/auctionOrders.ts`), the lines table came with `0029_usd_settlement_expansion.sql`. No constraint and no code assumes an invoice amount is a multiple of 100: the one `% 100` in the auction packages checks a bid maximum in the admin fixture client, and the others are tests.
- **Per-line `settlement_minor`: keep it as informational** - the choice was keep, derive or drop. Derive or drop means a nullable `settlement_minor`, a changed `AuctionInvoiceSettlementLine` contract and a change to every reader, for a column the legacy NOT NULL line columns still need. Keeping it changes only the values written. The audit fact stays: the USD facts plus the stored Subtotal, fee and Order Total reproduce every printed figure with no conversion. The cost is that the stored line values can add to more than the Subtotal, by up to one cent per line (US$0.04 twice stores 32 and 32 against a Subtotal of 63).
- **The guard** - no surface shows or sums a non-fee `settlement_minor` for an HKD invoice. Readers take their lines from the breakdown below, and a contracts test fails if the breakdown reads it. `invoiceRevisionChanges` also compares these per-line columns for the reissue history, which is why the operator history has a Raised row in `decisions.md`.
- **Rejected: allocate the Subtotal across the lines** - largest-remainder shares would add up, but they are a new rule that no decision states, and they would read as converted prices.

### One breakdown for every reader

- **A pure function in the contracts package** - `invoiceBreakdown` in `packages/grade10-auction/contracts/src/invoicePricing.ts` takes the settlement currency, the stored settlement lines, the stored Subtotal, fee and total, and returns the lines in display order with the amount each reads in, the fee, the total, and the USD sum for the note.
- **It converts nothing** - it picks USD facts and adds integers. The rate stays in the pricing module, so the lint is untouched.
- **A line with no USD fact** reads in the settlement currency, and the note is absent unless every non-fee line has a USD fact. That covers a USD invoice that predates `usd_minor`, and is what a pre-change HKD invoice with no USD fact reads (see Sent invoices below).
- **The note** - the USD sum covers the five lines and never the fee, so a bank transfer fee no longer reaches it. The text is the existing `winner.convertedFrom` key.

| Reader | Where | Change |
| --- | --- | --- |
| Winner Order | `packages/grade10-auction/frontend/.../winnerOrderView.ts` `summaryLines`, the HKD branch | USD lines with `US$` and two decimals, then `subtotal` with the note as its `footnote`, then `feeLines`, then `total`. Before send the branch draws no Subtotal row. `SourceInvoice` gains `subtotalAmountMinor` |
| Invoice page | `apps/frontend/grade10/src/pages/auctions/AuctionInvoicePage.tsx` | A surface of its own, apart from the PDF (Q21). Drops `settlementAmountsFor`; lists the breakdown |
| Invoice and receipt PDF | `services/auctions/orderDocument.ts` `orderValue`, `invoicePdf.ts`, `receiptPdf.ts` | Read the lines with `readAuctionInvoiceSettlementLines` and map the breakdown to the block's strings. Every receipt, a part payment's too, goes through `orderValue`, so each lists the lines above its payment breakdown (Q22) |
| Receipt letter | `email/emailPort.ts`, `sweeps/orderNotifications.ts` | The send carries the breakdown for `payment_received`; the letter lists it as `Label: amount` facts. `payment_received_partial` keeps its receipt IDs and lists no lines (Q24) |
| Operator quote preview and reissue dialog | `admin-frontend/.../dialogs/InvoiceQuoteFields.tsx`, used by `SendInvoiceDialog.tsx` and `ReissueInvoiceDialog.tsx` | Rows from `usd_minor`, then Subtotal, fee and total from the preview, each written by `formatMinor` in the operator shape (`USD 150.00`, `HKD 1,970.35`, Q26). The reissue dialog already renders the same component and shows the previous total beside the new one in its description (Q27), so it needs the new figures only |
| Operator order detail and history (held on the Raised row) | `InvoiceAndPayments.tsx`, `invoiceRevisionChanges` | Per the Raised row, recommended: USD lines, HKD rows; history parts in USD |

`winnerOrderView` has a second caller, the operator console's customer preview (`orderCustomerView.tsx` `winnerSourceOf`). No requirement states that preview, so it is not a reader of its own: it passes `subtotalAmountMinor` from the quote so the shared projection type-checks.

### Sent invoices stay as sent

- **Spec governs** - "Fixed once sent" and `decisions.md` Q16.
- **No re-price, no backfill** - a read takes stored values only. A reissue prices through the same call under the new rule and writes a new revision; the replaced invoice is untouched, as the reissue scenarios in `winner-order` and `post-sale` state with a Winning Bid in USD and a Subtotal in HKD.
- **A pre-change HKD invoice** reads through the same breakdown from its stored amounts, whole-HK$ Subtotal included, which is the PRD's reading of the held `decisions.md` Q12. If it carries `usd_minor` the page lists USD lines and the note names their sum beside a Subtotal that was not converted from it. The Migration Plan counts such invoices first.
- **Stored PDFs** - `archivedOrRendered` serves a PDF drawn before the deploy as drawn. One not yet opened draws in the new layout from the stored amounts.

### The documents and the receipt letter

- **The PDF contract holds** - `shared/ui/invoice-and-receipt-pdf` takes strings. The item row carries `US$` winning bid, premium and total; `lineItems` carries Shipping & Handling and Insurance in USD; `taxLine` carries Tax in USD; the keyed Subtotal, Payment Processing Fee and Order Total rows carry HK$. The payment breakdown stays HKD. No block, copy or export changes; its HKD fixtures, stories and tests do.
- **The block draws each prop on its own** (Q28) - `auction-winner-order.tsx` draws `summary.subtotal` and `summary.feeLines` as one group between two separators, draws neither when both are empty, and draws the older `convertedTotal` and `convertedFee` beside them if they arrive. It picks no policy, so `grade10` supplies one set; the HKD view supplies the new props only.
- **Labels** - the PDFs, the invoice page, the letters and the operator console keep English literals, as they do today. The letter labels join the English map in `email/messages.ts`.
- **The letter lists lines as facts** - `AuctionLetter` takes `facts: string[]`, so the lines go in as `Winning Bid: US$101.00` strings with no component change. The store's `apps/emails` preview takes the same lines as props.

### Language catalogs

- **One new key** - `auctionOrders.winner.subtotal` in `packages/i18n/messages/shared/{en,zh-Hans,zh-Hant,ko}/auctionOrders.json`: `Subtotal`, `小计`, `小計`, `소계`, the words `shared/*/checkout.json` already uses. `winner.convertedFrom` exists in all four and keeps the note's wording.
- **`winnerOrderMessages.ts`** gains `subtotal` from it. The rate stays in no catalog string.

### Where each rule is proven

| Rule | Lane | File |
| --- | --- | --- |
| Conversion, Subtotal, fee, total, bank fee | Backend node, `pnpm run test:backend` | `backend/test/services/orders/quote.test.ts` |
| Stored rows, no re-price | Worker with PGlite | `apps/backend/grade10/auction/test/db/orders/settlementQuote.spec.ts`, `quote.spec.ts` |
| The breakdown | Contracts node | `contracts/test/invoicePricing.test.ts` |
| Fixtures equal the rule | Backend node | `backend/test/services/orders/hkdFixtures.test.ts`, reading the store pin |
| Order Summary rows and note | SPA unit, `pnpm run test` | `winnerOrderView.test.ts` with literal expectations |
| Invoice page | SPA unit | `AuctionInvoicePage.test.tsx` |
| PDFs and the letter | Backend node | `test/services/auctions/invoicePdf.test.ts`, `receiptPdf.test.ts`, `test/email/emailPort.test.ts` |
| Quote preview and order detail | SPA unit | `SendInvoiceDialog.test.tsx`, `OrderDialogs.test.tsx` (the reissue dialog), `quoteDraft.test.ts`, `fixtureOperatorOrders.test.ts`, `OrderDetail.test.tsx` |
| Block rows | Store, `packages/ui` vitest | `auction-winner-order.test.ts` |
| The browser walk | Playwright | `e2e/tests/auction/winner-order/*.spec.ts`, `e2e/tests/admin/auction/post-sale/*.spec.ts` |

A view test never recomputes an amount. The e2e helper `e2e/helpers/settlement-money.ts` mirrors the rounding; it moves to the Subtotal rule and keeps its own name for the exempt copy.

## Service Interfaces

| Service | Input | Success | Refusal |
| --- | --- | --- | --- |
| Price an invoice quote (`calculateInvoiceQuote`) | order id, the USD quote fields, method, card rule, rail | lines per currency, `price` of Subtotal and total, settlement lines, Subtotal, fee, total | `QUOTE_INCOMPLETE`, `CARD_FEE_PRICED`, `CARD_FEE_UNSET`; unchanged |
| Preview quote | as above | the settlement lines, Subtotal, fee, total | as above; unchanged shape |
| Send and reissue invoice | order id, the quote, the total the operator read | an invoice revision; the replaced one untouched | `QUOTE_CHANGED` and the existing refusals |
| Render invoice and receipt PDF | order id, invoice or receipt number | a PDF from the invoice row, its settlement lines and the breakdown | `NOT_FOUND`; unchanged |
| Send payment-received letter | order notification work row | a letter listing the breakdown | retried on the work row; unchanged |

Send runs in the existing `runOperatorCommand` transaction: price, insert the `auction_invoices` row, insert its settlement lines, update the order pointer, write the invoice log, enqueue the notification, schedule the reminders. Nothing is added to it and nothing leaves it.

Example, an HKD card order, rule 340 basis points and 235, USD lines 15000, 3000, 4900, 2000 and 200, expected total 204214:

| Row | Written |
| --- | --- |
| `auction_invoices` | `subtotal_amount` 197035, `payment_processing_fee_amount` 7179, `final_amount` 204214, `currency` and `settlement_currency` HKD; `hammer_amount` 117750, `buyer_premium_amount` 23550, `shipping_amount` 38465, `insurance_amount` 15700, `tax_amount` 1570 (informational) |
| `auction_invoice_settlement_lines` | hammer (15000, 117750), premium (3000, 23550), shipping (4900, 38465), insurance (2000, 15700), tax (200, 1570), processing_fee (null, 7179) |
| `invoiceBreakdown` | lines 15000, 3000, 4900, 2000, 200 in USD; USD sum 25100; Subtotal 197035; fee 7179; total 204214 |

No API contract changes: `AuctionInvoice` already carries `subtotalAmountMinor`, `paymentProcessingFeeMinor`, `finalAmountMinor` and `settlementLines`, and the preview carries `settlementSubtotalMinor`, `settlementFeeMinor` and `settlementTotalMinor`.

## Risks / Trade-offs

- **[Risk] A surface sums or shows the stored per-line values and prints a figure that is not the Subtotal** → Readers take lines from `invoiceBreakdown`; its test fails on a read of a non-fee `settlement_minor`; the contracts test holds the US$0.04 case where the stored lines exceed the Subtotal.
- **[Risk] The note's rate drifts from the pricing constant** → A test pins `USD_TO_HKD_RATE_LABEL` to `USD_TO_HKD_RATE`.
- **[Risk] A bank fee reaches the note or the converted sum again** → A pricing test holds a fee of 257 against lines of 10100, 2020 and 992: the Order Total is 104948, not the 104947 that converting the fee with the lines gives.
- **[Risk] A pre-change HKD invoice reads a note beside a whole-HK$ Subtotal** → Step 0 of the Migration Plan counts them; `decisions.md` Q12 holds the answer.
- **[Risk] The store fixtures drift from the rule** → `hkdFixtures.test.ts` derives each fixture's Subtotal from its USD lines; it reads the store pin, so the store groups land first.
- **[Risk] The receipt letter grows lines it never had, in two codebases** → The store preview and the `grade10` letter take the same lines; each has a test that lists them.
- **[Risk] A cent total at Stripe** → The charge already takes `final_amount` in minor units and HKD has cents; the walk runs a sandbox card charge on a cent total.
- **[Risk] The durable "Receipt in the letter" asks for an attached receipt PDF that the app does not attach** → The gap predates this change and is out of its scope; the route is a bug fix under `docs/governance/bug-fixes.md`. No scenario of this change asserts the attachment, and the new scenarios state only the lines in the letter body.
- **[Trade-off] Informational per-line values** → Kept for the reasons under "What an HKD invoice stores".

## Migration Plan

1. Count sent HKD invoices on production with a read-only query. The expectation is none outside test data; a non-zero count goes to Product under Q12 before step 4.
2. Land the `grade10-spec` groups, then bump the submodule in `grade10`.
3. Land the `grade10` groups: pricing, readers, documents and letter, operator, e2e.
4. Deploy the workers and both SPAs in one release. There is no database migration, no flag and no backfill.
5. Walk the three journeys on staging, including a sandbox card charge on a cent total.

Rollback redeploys the previous release. An invoice sent in between keeps its stored cent Subtotal and total; the previous code draws its stored per-line values, which may not add up to the total, and the winner still pays `final_amount`, so the money stays right.

## Open Questions

- **Invoices sent before this layout** - held as `decisions.md` Q12. The design reads stored amounts, as the PRD does. If Product answers that such an invoice keeps the old layout, one task adds a switch to the breakdown.
- **The receipt letter's attachment** - the app attaches no receipt PDF today, against the durable "Receipt in the letter". Out of scope here; a bug fix owns it.
- **Operator history and detail, and the internal-bid number** - the two rows in `decisions.md` `## Raised` hold acceptance only. The design and the tasks follow their recommended options.
