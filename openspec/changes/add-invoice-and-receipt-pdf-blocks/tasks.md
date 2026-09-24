## 1. InvoicePdf and the shared contract (grade10-spec)

- [x] 1.1 Write `invoice-pdf.stories.tsx`'s `play`-function proofs for InvoicePdf's own behaviour, landing before the component exists (`shared-ui-invoice-and-receipt-pdf-SC-1`, `SC-2`, `SC-3`, `SC-4`, `SC-5`, `SC-6`, `SC-13`, `SC-16`, `SC-18`, `SC-19`, `SC-25`, `SC-26`, `SC-27`)
- [x] 1.2 Build `InvoicePdf`, its prop types (`InvoicePdfProps`, `InvoicePdfCopy`, `OrderValueLines`, `OrderValueLinesCopy`), and the shared `pdf-document.tsx` layout pieces (`PdfSheet`, `MetaRow`, `PartyBlock`, `ValueRow`, `SummaryRow`) per `tech-design.md`'s Decisions, making 1.1's stories pass (same scenario ids)
- [x] 1.3 Add `public-exports.test.ts` asserting `InvoicePdf` and its prop types export from `../../index`; add this directory's `public-exports.test.ts` to `packages/ui/vitest.config.ts`'s `audit` project `include` list, per `tech-design.md`
- [x] 1.4 Verify: `pnpm --filter @grade10/ui run typecheck && pnpm --filter @grade10/ui run test:stories`
- [x] 1.5 Amendment: structure `billTo`/`shipTo` as the nine-field `PartyAddress` (`decisions.md` Q11), adding `AddressLines` to `pdf-document.tsx` (`shared-ui-invoice-and-receipt-pdf-SC-31`, `SC-32`)
- [x] 1.6 Amendment: move bank rails from a meta row to a full-width section below the order value (`decisions.md` Q12), adding `BankRailsSection` to `pdf-document.tsx` (`shared-ui-invoice-and-receipt-pdf-SC-1`, `SC-2`, `SC-18`, `SC-35`)
- [x] 1.7 Amendment: remove `bankReference`/`bankReferenceLabel` entirely, redundant once `bankRails` carries the reference (`decisions.md` Q13) (`shared-ui-invoice-and-receipt-pdf-SC-18`, `SC-36`)
- [x] 1.8 Amendment: add a Description/Amount header and divider above the order-value lines, shared by both documents via `OrderValueSection` (`decisions.md` Q14) (`shared-ui-invoice-and-receipt-pdf-SC-37`, `SC-38`)
- [x] 1.9 Amendment: remove `replacedBy`/`replacedByLabel` from `InvoicePdfProps`/`InvoicePdfCopy` entirely, retiring the "InvoicePdf shows Replaced by only when given" requirement and its two scenarios (`decisions.md` Q16). `winner-order/spec.md`'s "Every invoice carries an invoice ID and a bank reference" requirement still claims the PDF names a replacement (`winner-order-SC-98`, `winner-order-SC-123`) — left unreworded here, since `define-public-auction-identifiers` already carries its own MODIFIED delta on it; see `proposal.md`'s Open Questions
- [x] 1.10 Amendment: rename `packages/ui/src/blocks/invoice-and-receipt-pdf/` to `packages/ui/src/blocks/auction-invoice-and-receipt-pdf/`, fixing `packages/ui/src/index.ts`'s import paths (`decisions.md` Q17)

## 2. ReceiptPdf, completing the shared contract (grade10-spec)

Needs group 1's `types.ts` (`OrderValueLines`, `OrderValueLinesCopy`) and `pdf-document.tsx` landed first; not independently parallel with it.

- [x] 2.1 Write `receipt-pdf.stories.tsx`'s `play`-function proofs for ReceiptPdf's own behaviour, plus the two-component scenarios only both together can prove, landing before the component exists (`shared-ui-invoice-and-receipt-pdf-SC-7`, `SC-8`, `SC-9`, `SC-10`, `SC-11`, `SC-12`, `SC-14`, `SC-15`, `SC-17`, `SC-20`, `SC-21`, `SC-22`, `SC-23`, `SC-24`, `SC-28`, `SC-29`, `SC-30`, `SC-33`, `SC-34`)
- [x] 2.2 Build `ReceiptPdf` and its prop types (`ReceiptPdfProps`, `ReceiptPdfCopy`, `PaymentBreakdown`, `PaymentBreakdownCopy`), reusing group 1's `OrderValueLines` and `pdf-document.tsx` pieces per `tech-design.md`'s "One order-value shape, not two", making 2.1's stories pass (same scenario ids)
- [x] 2.3 Extend `public-exports.test.ts` to also assert `ReceiptPdf` and its prop types
- [x] 2.4 Retire `apps/preview`'s sketch (`winner-order.invoice-pdf.stories.tsx`, `winner-order.receipt-pdf.stories.tsx`, `winner-order-pdf.story-shared.tsx`), replacing it with pages that compose the real `InvoicePdf`/`ReceiptPdf` and sample props, dropping the sketch's hardcoded `TAX_RATE` and `formatAmount` per `tech-design.md`'s Risks
- [x] 2.5 Verify: `pnpm --filter @grade10/ui run typecheck && pnpm --filter @grade10/ui run test:stories && pnpm run typecheck && pnpm run lint`
- [x] 2.6 Amendment: extract `OrderValueSection` into `pdf-document.tsx` (dropping ~45 duplicated lines between the two documents), give `MetaRow` an optional `mark` slot, scope the payment breakdown behind its own `data-slot`, and share both story files' fixtures/DOM-reading helpers via `fixtures.ts` — per the build round's readers
- [x] 2.7 Amendment: move the issuer block to the foot of the sheet, right-aligned, adding `IssuerBlock` to `pdf-document.tsx`; add the same required `issuer` prop to `ReceiptPdfProps` (`decisions.md` Q15) (`shared-ui-invoice-and-receipt-pdf-SC-39`, `SC-40`)

## 3. Wire grade10 onto the real components (grade10)

Needs groups 1 and 2 landed on `main` and the submodule bumped first.

- [ ] 3.1 Bump `external/grade10-spec` to this change's landing
- [ ] 3.2 Replace the invoice PDF's rendering path and `PLACEHOLDER_RECEIPT_PDF` with `InvoicePdf`/`ReceiptPdf` from `@grade10/ui`, wiring real order data through `shared/money-amounts`-formatted `ReactNode` props and the application's own `@grade10/i18n` catalog for `copy` (`winner-order-SC-57`, `winner-order-SC-67`, `winner-order-SC-109`)
- [ ] 3.3 Verify: `pnpm run typecheck && pnpm run lint && pnpm run test --filter grade10`

## 4. Walk Winner Order's Invoice and Receipt PDFs (grade10)

- [ ] 4.1 Walk `winner-order-US-01` opening the invoice PDF from a sent invoice, a not-yet-sent order, a cancelled order, and a reissued invoice naming its replacement (`winner-order-SC-57`, `winner-order-SC-64`, `winner-order-SC-65`, `winner-order-SC-109`) — note `winner-order-SC-98`'s "names its replacement" claim is stale against `InvoicePdf`'s `decisions.md` Q16 removal of `replacedBy`; confirm which side has landed by the time this walk runs
- [ ] 4.2 Walk `winner-order-US-02` opening the receipt PDF once paid, before payment, and a manually settled receipt distinguishable from a card- or bank-transfer-settled one (`winner-order-SC-67`, `winner-order-SC-68`, `winner-order-SC-18`, `winner-order-SC-19`)
- [ ] 4.3 Flip the `shared/ui/invoice-and-receipt-pdf` `feature-tcs.md` cases the walks and groups 1–2's stories together decide to automated with `pnpm run tcs:automated <case…> --decided-by <walk path>`; name any that stay manual in the suite and the walk's `rounds.md` row
- [ ] 4.4 Verify: `pnpm run test --filter grade10` (and the e2e lane that covers Winner Order when this walk lands there)
