## 1. InvoicePdf and the shared contract (grade10-spec)

- [x] 1.1 Write `invoice-pdf.stories.tsx`'s `play`-function proofs for InvoicePdf's own behaviour, landing before the component exists (`shared-ui-invoice-and-receipt-pdf-SC-1`, `SC-2`, `SC-3`, `SC-4`, `SC-5`, `SC-6`, `SC-13`, `SC-16`, `SC-18`, `SC-19`, `SC-25`, `SC-26`, `SC-27`)
- [x] 1.2 Build `InvoicePdf`, its prop types (`InvoicePdfProps`, `InvoicePdfCopy`, `OrderValueLines`, `OrderValueLinesCopy`), and the shared `pdf-document.tsx` layout pieces (`PdfSheet`, `MetaRow`, `PartyBlock`, `ValueRow`, `SummaryRow`) per `tech-design.md`'s Decisions, making 1.1's stories pass (same scenario ids)
- [x] 1.3 Add `public-exports.test.ts` asserting `InvoicePdf` and its prop types export from `../../index`; add this directory's `public-exports.test.ts` to `packages/ui/vitest.config.ts`'s `audit` project `include` list, per `tech-design.md`
- [x] 1.4 Verify: `pnpm --filter @grade10/ui run typecheck && pnpm --filter @grade10/ui run test:stories`
- [x] 1.5 Amendment: structure `billTo`/`shipTo` as the nine-field `PartyAddress` (`decisions.md` Q11), adding `AddressLines` to `pdf-document.tsx` (`shared-ui-invoice-and-receipt-pdf-SC-31`, `SC-32`)
- [x] 1.6 Amendment: move bank rails from a meta row to a full-width section below the order value (`decisions.md` Q12), adding `BankRailsSection` to `pdf-document.tsx` (`shared-ui-invoice-and-receipt-pdf-SC-1`, `SC-2`, `SC-18`, `SC-35`)
- [x] 1.7 Amendment: remove `bankReference`/`bankReferenceLabel` entirely, redundant once `bankRails` carries the reference (`decisions.md` Q13) (`SC-18`, `SC-36`, both retired under Q19)
- [x] 1.8 Amendment: add a Description/Amount header and divider above the order-value lines, shared by both documents via `OrderValueSection` (`decisions.md` Q14) (`shared-ui-invoice-and-receipt-pdf-SC-37`, `SC-38`)
- [x] 1.9 Amendment: remove `replacedBy`/`replacedByLabel` from `InvoicePdfProps`/`InvoicePdfCopy` entirely, retiring the "InvoicePdf shows Replaced by only when given" requirement and its two scenarios (`decisions.md` Q16). `winner-order/spec.md`'s "Every invoice carries an invoice ID and a bank reference" requirement still claims the PDF names a replacement (`winner-order-SC-98`, `winner-order-SC-123`) — left unreworded here, since `define-public-auction-identifiers` already carries its own MODIFIED delta on it; see `proposal.md`'s Open Questions
- [x] 1.10 Amendment: rename `packages/ui/src/blocks/invoice-and-receipt-pdf/` to `packages/ui/src/blocks/auction-invoice-and-receipt-pdf/`, fixing `packages/ui/src/index.ts`'s import paths (`decisions.md` Q17)
- [x] 1.11 Amendment: add `paymentMethod`/`paymentMethodLabel` to `InvoicePdfData`/`InvoicePdfCopy`, drawn by `drawMetaBlock` as a fourth meta row appended after payment deadline, never reordering the three rows before it (`decisions.md` Q21) (`shared-ui-invoice-and-receipt-pdf-SC-1`, `SC-46`)
- [x] 1.12 Amendment: add optional `bankRails: InvoicePdfBankRails` to `InvoicePdfData` and its labels to `InvoicePdfCopy`; add `drawBankRails` to `invoice-pdf.ts` (three columns — SWIFT, FPS, HK local transfer — plus a bold reference line), matching `receipt-pdf.ts`'s convention of document-specific sections living beside their own document rather than in the shared `pdf-document.ts`; called only when `bankRails` is given, full width directly below the order-value summary (`decisions.md` Q22) (`shared-ui-invoice-and-receipt-pdf-SC-47`, `SC-48`, `SC-49`, `SC-50`)
- [x] 1.13 Amendment: remove `footer` from `InvoicePdfCopy`/`ReceiptPdfCopy` and delete each `drawFooter` function and its call site; drop the "A footer line" `## Feature set` bullet under ReceiptPdf export (`decisions.md` Q23)

## 2. ReceiptPdf, completing the shared contract (grade10-spec)

Needs group 1's `types.ts` (`OrderValueLines`, `OrderValueLinesCopy`) and `pdf-document.tsx` landed first; not independently parallel with it.

- [x] 2.1 Write `receipt-pdf.stories.tsx`'s `play`-function proofs for ReceiptPdf's own behaviour, plus the two-component scenarios only both together can prove, landing before the component exists (`shared-ui-invoice-and-receipt-pdf-SC-7`, `SC-8`, `SC-9`, `SC-10`, `SC-11`, `SC-12`, `SC-14`, `SC-15`, `SC-17`, `SC-20`, `SC-21`, `SC-22`, `SC-23`, `SC-24`, `SC-28`, `SC-29`, `SC-30`, `SC-33`, `SC-34`)
- [x] 2.2 Build `ReceiptPdf` and its prop types (`ReceiptPdfProps`, `ReceiptPdfCopy`, `PaymentBreakdown`, `PaymentBreakdownCopy`), reusing group 1's `OrderValueLines` and `pdf-document.tsx` pieces per `tech-design.md`'s "One order-value shape, not two", making 2.1's stories pass (same scenario ids)
- [x] 2.3 Extend `public-exports.test.ts` to also assert `ReceiptPdf` and its prop types
- [x] 2.4 Retire `apps/preview`'s sketch (`winner-order.invoice-pdf.stories.tsx`, `winner-order.receipt-pdf.stories.tsx`, `winner-order-pdf.story-shared.tsx`), replacing it with pages that compose the real `InvoicePdf`/`ReceiptPdf` and sample props, dropping the sketch's hardcoded `TAX_RATE` and `formatAmount` per `tech-design.md`'s Risks
- [x] 2.5 Verify: `pnpm --filter @grade10/ui run typecheck && pnpm --filter @grade10/ui run test:stories && pnpm run typecheck && pnpm run lint`
- [x] 2.6 Amendment: extract `OrderValueSection` into `pdf-document.tsx` (dropping ~45 duplicated lines between the two documents), give `MetaRow` an optional `mark` slot, scope the payment breakdown behind its own `data-slot`, and share both story files' fixtures/DOM-reading helpers via `fixtures.ts` — per the build round's readers
- [x] 2.7 Amendment: move the issuer block to the foot of the sheet, right-aligned, adding `IssuerBlock` to `pdf-document.tsx`; add the same required `issuer` prop to `ReceiptPdfProps` (`decisions.md` Q15) (`shared-ui-invoice-and-receipt-pdf-SC-39`, `SC-40`)

## 3. Retire the DOM component, move the pdf-lib renderer in (grade10-spec)

Amendment (`decisions.md` Q18-Q20). Needs this change's rewritten `spec.md`/`feature-tcs.md`; not built on groups 1-2's DOM output, which this group deletes.

- [x] 3.1 Move `pdfDocument.ts` from `grade10`'s `packages/grade10-auction/contracts/src` into `pdf-document.ts` here, threading a `copy` argument through every `draw*` call for the labels `tech-design.md` lists, and replacing `SUMMARY_LABELS`'s string match with `PdfLineItem.key` (`shared-ui-invoice-and-receipt-pdf-SC-3`, `SC-4`, `SC-37`, `SC-38`, `SC-43`, `SC-44`, `SC-45`)
- [x] 3.2 Move `receiptPdf.ts`/`invoicePdf.ts` into `receipt-pdf.ts`/`invoice-pdf.ts`, adding `copy: InvoicePdfCopy`/`copy: ReceiptPdfCopy` to `InvoicePdfData`/`ReceiptPdfData` per `tech-design.md` (`shared-ui-invoice-and-receipt-pdf-SC-1`, `SC-7`, `SC-8`, `SC-16`, `SC-17`, `SC-19`, `SC-20`, `SC-22`, `SC-27`, `SC-29`, `SC-39`, `SC-40`, `SC-41`, `SC-42`) — the exported names are `InvoicePdf`/`ReceiptPdf` (author's choice), not `renderInvoicePdf`/`renderReceiptPdf`, matching `spec.md`'s prose
- [x] 3.3 Move `pdfDocument.test.ts`/`invoicePdf.test.ts`/`receiptPdf.test.ts` from `grade10`'s `contracts/test/` into colocated `pdf-document.test.ts`/`invoice-pdf.test.ts`/`receipt-pdf.test.ts`, updating fixtures for the new `copy` argument; add cases for the withheld-address fallback (`shared-ui-invoice-and-receipt-pdf-SC-33`) and the then-current Hong Kong-time date formatting (`SC-43`)
- [x] 3.4 Add `public-exports.test.ts` asserting `InvoicePdf`, `ReceiptPdf`, `receiptBreakdown`, and every type `tech-design.md` names export from `../../index` — picked up automatically by `packages/ui/vitest.config.ts`'s `audit` project glob, no config edit needed
- [x] 3.5 Add `pdf-lib` and `@pdf-lib/fontkit` to `packages/ui/package.json`
- [x] 3.6 Delete the retired DOM component: `pdf-document.tsx`, `invoice-pdf.tsx`, `receipt-pdf.tsx`, `types.ts`, and their `fixtures.ts`; fix `packages/ui/src/index.ts`'s exports to the new file names — also widened `package.json`'s `"./blocks/*"` export to resolve `.ts` alongside `.tsx`, since these two entry files carry no JSX (`tech-design.md` "Also edits")
- [x] 3.7 Verify: `pnpm --filter @grade10/ui run typecheck && pnpm --filter @grade10/ui run test`

## 4. Preview the renderer in Storybook and apps/preview (grade10-spec)

Needs group 3 landed.

- [ ] 4.1 Add sample fixtures to `fixtures.ts` (an invoice and a receipt, each with a full `copy` argument) for both story files and `apps/preview`'s pages to share — deferred: each of the four story files (two here, two in `apps/preview`) inlines its own sample data today, duplicated rather than shared; low risk, but the file this task names does not exist yet
- [x] 4.2 Rewrite `invoice-pdf.stories.tsx`/`receipt-pdf.stories.tsx` to call `InvoicePdf`/`ReceiptPdf` on sample data and preview the returned bytes with `pdf-preview.tsx`'s `PdfPreview` (a small `pdfjs-dist`-based canvas viewer), keeping the `Auction Invoice And Receipt Pdf/…` Storybook title (`decisions.md` Q17)
- [x] 4.3 Add `pdfjs-dist` as a devDependency of `packages/ui`, which hosts `pdf-preview.tsx`
- [x] 4.4 Rewrite `apps/preview/src/pages/winner-order.invoice-pdf.stories.tsx`/`winner-order.receipt-pdf.stories.tsx` the same way, replacing their `<InvoicePdf/>`/`<ReceiptPdf/>` JSX (landed by group 2.4, now stale — this was a live typecheck break, `PartyAddress`/`bankRails`/`orderValue`/`taxLine` all gone) with a call to the renderer and `pdf-preview.tsx`'s `PdfPreview`, imported via `@grade10/ui/blocks/auction-invoice-and-receipt-pdf/pdf-preview` since it is not part of the `../../index` barrel
- [x] 4.5 Verify: `pnpm --filter @grade10/ui run typecheck && pnpm --filter @grade10/ui run test:stories && pnpm run typecheck && pnpm run lint` — also `pnpm --dir apps/preview exec storybook build` to catch the `pdf-preview` import resolving through the workspace
- [x] 4.6 Amendment: needs 1.11 landed. Add `paymentMethod`/`paymentMethodLabel` to `invoice-pdf.stories.tsx`'s and `apps/preview/winner-order.invoice-pdf.stories.tsx`'s sample invoice data, and a second `BankTransfer` story beside each existing `Default` (Card) one so a bank-transfer invoice previews too (`decisions.md` Q21) (`shared-ui-invoice-and-receipt-pdf-SC-1`, `SC-46`)
- [x] 4.7 Amendment: needs 1.12 landed. Add `bankRails` to each `BankTransfer` story's sample data (both `invoice-pdf.stories.tsx` and `apps/preview/winner-order.invoice-pdf.stories.tsx`), matching the mockup's field values, so the Bank details section previews (`decisions.md` Q22) (`shared-ui-invoice-and-receipt-pdf-SC-47`, `SC-49`, `SC-50`)
- [x] 4.8 Amendment: needs 1.13 landed. Remove `footer` from every invoice/receipt story's sample `copy` (`invoice-pdf.stories.tsx`, `receipt-pdf.stories.tsx`, both `apps/preview/winner-order.*-pdf.stories.tsx`) (`decisions.md` Q23)

## 5. Wire grade10 onto the real renderer (grade10)

Needs groups 3-4 landed on `main` and the submodule bumped first.

- [x] 5.1 Bump `external/grade10-spec` to this change's landing
- [x] 5.2 Switch `packages/grade10-auction/backend/src/services/auctions/{receiptPdf,invoicePdf}.ts` from importing `@grade10/auction-contracts/{receipt-pdf,invoice-pdf}` to importing `InvoicePdf`/`ReceiptPdf` from `@grade10/ui`, adding a `copy` argument at each call site — hardcoded English literals (`RECEIPT_COPY`/`INVOICE_COPY`), not `@grade10/i18n`: the auction backend's own email catalog (`../email/messages.ts`) is documented as the same interim state, moving to `@grade10/i18n` only as its own, separate pull request; introducing that dependency for this one call site first would be inconsistent with the pattern already established in this package (`winner-order-SC-57`, `winner-order-SC-67`, `winner-order-SC-109`)
- [x] 5.3 Switch `apps/frontend/grade10/src/pages/demo/pdf/PdfLabPage.tsx` (and its `invoiceSample.ts`/`receiptSample.ts`) the same way
- [x] 5.4 Remove `packages/grade10-auction/contracts`'s now-redundant `pdfDocument.ts`/`receiptPdf.ts`/`invoicePdf.ts` and their tests, and the package's `/invoice-pdf`/`/receipt-pdf` subpath exports and `pdf-lib`/`@pdf-lib/fontkit` dependencies
- [x] 5.5 Verify: `pnpm run typecheck && pnpm run lint && pnpm run test --filter grade10` — also surfaced the `"./blocks/*"` export bug this branch's `fix(auction)` commit corrects: the array-fallback pattern PR #627 shipped does not actually resolve for an external consumer
- [x] 5.6 Amendment: needs 1.11 landed and the submodule re-bumped. Pass `paymentMethod` at `invoicePdf.ts`'s call site, sourced from the order's own payment method the same way `receiptPdf.ts` already sources it for `ReceiptPdf` (`decisions.md` Q21) — landed via `paymentMethodLabel`, reading `auctionOrders.paymentMethod`
- [x] 5.7 Amendment: needs 1.12 landed and the submodule re-bumped. Pass `bankRails` at `invoicePdf.ts`'s call site on a bank-transfer invoice, sourced from Grade10's own SWIFT/FPS/HK local transfer details and the order's bank reference; omit it entirely on a card invoice (`decisions.md` Q22) — landed via `bankRailsFor`, backed by the new shared `GRADE10_BANK_RAIL_DETAILS` constant; `PdfLabPage`'s lab now previews both a card and a bank-transfer invoice sample
- [x] 5.8 Amendment: needs 1.13 landed and the submodule re-bumped. Remove `footer` from `INVOICE_COPY`/`RECEIPT_COPY` at `invoicePdf.ts`'s and `receiptPdf.ts`'s call sites, and from the `PdfLabPage` demo's sample copy (`decisions.md` Q23) — confirmed no `footer` field remains in either call site's copy or the demo's sample copy

## 6. The walk - Winner Order's invoice and receipt PDFs (grade10)

Uses draft `feature-tcs.md` as its input; human QA reviews cases after deployment (`/tcs-review add-invoice-and-receipt-pdf-blocks`), and `/tcs-run-sheet` executes manual cases when needed.

- [ ] 6.1 Walk `winner-order-US-01` opening the invoice PDF from a sent invoice, a not-yet-sent order, a cancelled order, and a replacement invoice (`winner-order-SC-57`, `winner-order-SC-64`, `winner-order-SC-65`, `winner-order-SC-98`). Confirm the replacement document names the replaced invoice, as this change's `SC-51` requires.
- [ ] 6.2 Walk `winner-order-US-02` opening the receipt PDF once paid and before payment (`winner-order-SC-67`, `winner-order-SC-68`) — `winner-order-SC-18`/`SC-19`'s manually-settled distinction is not a claim this contract makes any more (`decisions.md` Q19); walk it against whatever `winner-order/spec.md` still requires there, not against a mark this renderer does not draw
- [ ] 6.3 Flip the `shared/ui/invoice-and-receipt-pdf` `feature-tcs.md` cases the walks and groups 3-4's stories together decide to automated with `pnpm run tcs:automated <case…> --decided-by <walk path>`; name any that stay manual in the suite and the walk's `rounds.md` row
- [ ] 6.4 Verify: `pnpm run test --filter grade10` (and the e2e lane that covers Winner Order when this walk lands there)

## 7. Reconcile invoice rendering with the accepted PDF contract

- [ ] 7.1 Update `InvoicePdfBankRails` and `drawBankRails` so only supplied enabled rails receive columns, and use `bankRails.reference` in the note; cover two enabled rails and an absent third (`SC-49`, `SC-50`).
- [ ] 7.2 Add optional `replacesInvoice` to `InvoicePdfData`, render the replaced invoice ID in its own plain-text row (`SC-51`). Cover presence and absence. Keep the document's own invoice number distinct.
- [ ] 7.3 Verify the existing `addressLines` renderer and tests show phone when supplied and leave no line when absent for both documents (`SC-31`, `SC-32`).
- [ ] 7.4 Update the invoice samples and Grade10 backend caller to pass only enabled bank rails, `reference`, and the replacement relationship when one exists; run the focused renderer tests, Grade10 PDF service tests, Storybook preview, and typechecks.
