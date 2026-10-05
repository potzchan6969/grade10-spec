## Context

`shared/ui/invoice-and-receipt-pdf` (see `specs/shared/ui/invoice-and-receipt-pdf/spec.md`)
exports `InvoicePdf` and `ReceiptPdf` from `@grade10/ui`. This document
originally designed them as `@grade10/design-system`-composed React
components; `grade10` never adopted that design — it built and shipped its
own pdf-lib renderer instead (`packages/grade10-auction/contracts`:
`pdfDocument.ts`, `receiptPdf.ts`, `invoicePdf.ts`), already replacing
`PLACEHOLDER_RECEIPT_PDF` in production. `decisions.md` Q18 adopts that
renderer as this capability's real implementation; this revision of the
design describes moving it here, not building it fresh.

## Goals / Non-Goals

**Goals:**
- Move `grade10`'s renderer verbatim in behaviour — same layout, same
  `pdf-lib` calls, same tested output — changing only what this move and
  `decisions.md` Q20 require: every hardcoded label routed through a `copy`
  argument, and the boxed-summary grouping keyed on something other than an
  English label string (see "The summary grouping can no longer match on
  label text" below).
- `packages/ui`'s `public-exports.test.ts` convention and a consuming app's
  typecheck are the enforcement that the exported functions and types match
  `spec.md`, not a code review.
- No new exported name beyond `InvoicePdf`, `ReceiptPdf`, and the types a
  caller needs to build their arguments — everything else in
  `pdf-document.ts` stays unexported, as it already is in `grade10`.
- Tests that call the renderer and inspect the returned PDF's structure
  (page count, page size, and whatever `pdf-lib`'s own reader can confirm),
  the same shape `grade10`'s existing `invoicePdf.test.ts`/`receiptPdf.test.ts`
  already prove, colocated here instead.

**Non-Goals:**
- Building bank rails, the manually-settled mark, Superseded invoice, or the
  reserved `taxLine`/`issuerTaxDetails` slots. Retired, `decisions.md` Q19.
- A data model, a service, or a wire contract. Nothing here touches a
  database, a backend service, or an API.
- Pixel-level layout assertions (position, alignment, rule thickness).
  `pdf-lib` writes a content stream, not a DOM; there is no `data-slot` to
  query. Tests prove the data-in/bytes-out contract — order, presence,
  values, page shape — the same ceiling `grade10`'s own tests already
  accepted; a visual regression is caught by the Storybook `pdfjs-dist` preview
  (see Risks), not by an assertion.

## Decisions

**Directory and files carry over, contents change.** Still one directory,
`packages/ui/src/blocks/auction-invoice-and-receipt-pdf/` — the name
`decisions.md` Q17 already settled survives this swap. Files:

| File | Holds |
| --- | --- |
| `pdf-document.ts` | The A4 layout and drawing primitives both documents share, moved from `grade10`'s `pdfDocument.ts` verbatim except for the `copy`-threading and `key`-discriminant changes below. Unexported except through `invoice-pdf.ts`/`receipt-pdf.ts`. |
| `invoice-pdf.ts` | `InvoicePdf`, `InvoicePdfData`, `InvoicePdfCopy`, exported |
| `receipt-pdf.ts` | `ReceiptPdf`, `receiptBreakdown`, `ReceiptPdfData`, `ReceiptPdfCopy`, exported |
| `fixtures.ts` | Sample data both story files and `apps/preview`'s pages share, unexported from the package — the role `grade10`'s `invoiceSample.ts`/`receiptSample.ts` played there, moved here so both consumers stop keeping their own copy |
| `invoice-pdf.stories.tsx`, `receipt-pdf.stories.tsx` | Call the renderer on `fixtures.ts` sample data and preview the returned bytes with `pdf-preview.tsx`'s `pdfjs-dist` viewer — there is no component to render as JSX |
| `pdf-preview.tsx` | `PdfPreview`, a small `pdfjs-dist`-based canvas viewer for the returned bytes — Storybook-only, not exported from `../../index` |
| `public-exports.test.ts` | Asserts every name in this table's second column exports from `../../index`, per `auction-order`'s own test |
| `pdf-document.test.ts`, `invoice-pdf.test.ts`, `receipt-pdf.test.ts` | Moved from `grade10`'s `contracts/test/`, proving `spec.md`'s scenarios at the level Non-Goals fixes |

**Also edits:** `packages/ui/package.json` — adds `pdf-lib` and
`@pdf-lib/fontkit` as dependencies, the two packages `grade10`'s renderer
already depends on, and `pdfjs-dist` as a devDependency for the Storybook
preview. Its `"./blocks/*"` export previously resolved only `*.tsx`
(`["./src/blocks/*.tsx"]`), since every existing block is a component; this
directory's entry files are plain `.ts` (no JSX), so the export becomes
`["./src/blocks/*.tsx", "./src/blocks/*.ts"]` — the first pattern that
resolves wins, and no other block's `.tsx` file is affected.
`packages/ui/vitest.config.ts`'s `audit` project now runs its plain tests
from a glob (`src/**/*.test.ts`) rather than the explicit allowlist this
document originally described, so this directory's `public-exports.test.ts`
and the moved renderer's own tests are picked up automatically — no config
edit needed.

**Data shape carries over from `grade10` unchanged, except money and dates.**
`InvoicePdfData`/`ReceiptPdfData` keep the shape `grade10`'s already-tested
renderer takes — `PdfLineItem { key?, label, amount }` (see below for `key`),
`PdfPartyAddress = Record<string, string | null> | null`, plain `string`
amounts, `Date` for every date. This is a deliberate difference from the
retired DOM design's `ReactNode` props (`decisions.md` Q6): there is no JSX
here to hold a `ReactNode`, so every value is the plain type `pdf-lib` can
draw directly.

```ts
export type PdfLineItem = {
  /** Recognized regardless of `label`'s text, so a translated label still
   * routes into the boxed summary. Absent on an ordinary charge. */
  key?: "subtotal" | "paymentProcessingFee" | "orderTotal";
  label: string;
  amount: string;
};

export type PdfDocumentCopy = {
  billToHeading: string;
  shipToHeading: string;
  descriptionLabel: string;
  amountLabel: string;
};

export type InvoicePdfCopy = PdfDocumentCopy & {
  documentTitle: string;
  invoiceNumberLabel: string;
  sentAtLabel: string;
  paymentDeadlineLabel: string;
  paymentMethodLabel: string;
  bankDetailsHeading: string;
  swiftLabel: string;
  fpsLabel: string;
  hkLocalTransferLabel: string;
  beneficiaryLabel: string;
  swiftBicLabel: string;
  accountIbanLabel: string;
  fpsIdLabel: string;
  bankAndCodeLabel: string;
  accountNoLabel: string;
  bankReferenceNoteLabel: string;
};

export type InvoicePdfBankRails = {
  swift: { beneficiary: string; swiftBic: string; account: string };
  fps: { fpsId: string; beneficiary: string };
  hkLocalTransfer: { bankAndCode: string; beneficiary: string; accountNo: string };
  instructionReference: string;
};

export type InvoicePdfData = {
  listingTitle: string;
  invoiceNumber: string;
  sentAt: Date;
  paymentDeadline: Date;
  paymentMethod: string;
  billTo: PdfPartyAddress;
  shipTo: PdfPartyAddress;
  lineItems: readonly PdfLineItem[];
  /** Given only on a bank-transfer invoice (`decisions.md` Q22); `undefined` omits the whole section. */
  bankRails?: InvoicePdfBankRails;
  issuerName: string;
  issuerEmail: string;
  copy: InvoicePdfCopy;
};

export type ReceiptPdfCopy = PdfDocumentCopy & {
  documentTitle: string;
  receiptNumberLabel: string;
  invoiceNumberLabel: string;
  datePaidLabel: string;
  paymentMethodLabel: string;
  paymentReferenceLabel: string;
  paymentSectionLabel: string;
  transferReferenceLabel: string;
  paymentBreakdownLabel: string;
  originalInvoiceTotalLabel: string;
  previousPaymentsLabel: string;
  currentPaymentReceivedLabel: string;
  remainingBalanceDueLabel: string;
};

export type ReceiptPdfData = {
  listingTitle: string;
  receiptNumber: string;
  paidAt: Date;
  invoiceId: string;
  providerReferenceCode: string;
  billTo: PdfPartyAddress;
  shipTo: PdfPartyAddress;
  lineItems: readonly PdfLineItem[];
  paymentBreakdown: ReceiptPaymentBreakdown;
  paymentMethod: string;
  providerReference: string | null;
  issuerName: string;
  issuerEmail: string;
  copy: ReceiptPdfCopy;
};
```

**The summary grouping can no longer match on label text (`decisions.md`
Q20).** `grade10`'s `drawLineItems` currently sorts a charge into the boxed
summary by `SUMMARY_LABELS.has(item.label)` — a `Set` of the literal English
strings `"Subtotal"`, `"Payment Processing Fee"`, `"Order Total"`. That only
ever worked because `grade10`'s backend happens to hardcode those same
strings; once a caller's `label` is a translated `copy` value, the match
silently stops firing and every summary line falls back into the ordinary
charge list. `key` (above) replaces it: `drawLineItems` groups by
`item.key !== undefined`, and singles out `key === "orderTotal"` for the
bold, rule-set-off treatment `ORDER_TOTAL_LABEL` used to identify by string
equality. This is not part of Q20's literal ask (routing hardcoded labels
through `copy`) but the same class of bug: a mechanism keyed on English text
that a translated label would silently break, caught while doing that work
rather than left for whoever localizes this renderer first.

**Every string `pdf-document.ts`/`invoice-pdf.ts`/`receipt-pdf.ts` currently
hardcodes moves to a `copy` field (`decisions.md` Q20).** `drawParties`'s
`"Bill To"`/`"Ship To"`, `drawLineItems`'s `"Description"`/`"Amount"`
header, `drawTitle`'s caller-supplied `"Invoice"`/`"Receipt"` title, every
meta-row label (`"Receipt number"`, `"Invoice number"`, `"Date paid"`,
`"Payment method"`, `"Payment reference"`, `"Date of issue"`, `"Date due"`),
`drawPaymentSection`'s `"Payment"`/`"Transfer reference"`,
`drawPaymentBreakdown`'s `"Payment breakdown"` and `receiptBreakdown`'s four
row labels, and each footer sentence — all become `copy.*` fields instead of
string literals in `pdf-document.ts`. A line item's own `label` (`"Winning
Bid"`, `"Subtotal"`, …) already arrives as a caller-supplied string on
`PdfLineItem` and needed no change; only the section/meta labels the
renderer itself used to own move.

**Dates stay computed inside the renderer, not routed through `copy` or
taken as strings.** `formatDateTime` (fixed to `Asia/Hong_Kong`, `spec.md`'s
Dates requirement) is the one value this renderer computes rather than
taking preformatted — a deliberate asymmetry with money, since a locale
choice belongs to the caller but the timezone every document is issued
under does not vary by caller. This is unchanged from `grade10`'s current
`pdfDocument.ts` and carries over as-is.

**The Grade10 wordmark stays a component-owned SVG path, not a prop.**
`LOGO_PATHS` (`pdf-document.ts`) is unchanged from `grade10`'s version — a
graphic brand mark keyed by issuer name, falling back to the issuer's name
as text when no mark is on file. Nothing in `spec.md` requires a specific
mark; this is implementation detail carried over rather than newly decided.

**Party address stays `PdfPartyAddress = Record<string, string | null> |
null`, not a structured type.** The retired DOM design's nine-field
`PartyAddress` (`decisions.md`'s prior Q11) is not restored: `grade10`'s
`addressLines` already draws a well-defined six-line shape from this looser
type (`spec.md`'s "Bill To and Ship To render as an address, or 'Not
recorded' when withheld"), and restructuring it into named fields here would
mean rewriting and re-testing working code for a stronger type than any
current caller needs. A future change can tighten it if a real requirement
calls for validating the shape at the type level.

**Failure is not handled — it propagates.** Unchanged from `grade10`'s
version: neither renderer catches a `pdf-lib` failure or a bad font byte;
both surface as a rejected `Promise` to the caller.

**InvoicePdf gains a fourth meta row, `paymentMethod` (`decisions.md`
Q21).** `drawMetaBlock` in `invoice-pdf.ts` draws it last, after Date due —
appending rather than reordering the three rows already there, since no
decision fixes a different order and this is the least disruptive place to
add one. The value arrives preformatted (`"Card"`, `"Bank transfer"`, or
whatever string the caller already built for `ReceiptPdf`'s own
`paymentMethod`), matching the presentation-only contract every other field
here already follows — this renderer does not know payment methods exist as
a concept, only that it draws whatever string it is given.

**InvoicePdf gains a conditional `drawBankRails` section, full width below
the order value (`decisions.md` Q22).** Living in `invoice-pdf.ts` itself,
matching `receipt-pdf.ts`'s own document-specific sections
(`drawPaymentSection`, `drawPaymentBreakdown`) rather than the shared
`pdf-document.ts` — no other document draws it. `drawBankRails` draws
`copy.bankDetailsHeading`
then three columns at equal thirds of the content width — SWIFT, FPS, HK
local transfer, each column its own heading plus its own stack of label/value
lines, independently sized the way `drawParties`'s Bill To/Ship To columns
already are — followed by a rule and one wrapped line of
`copy.bankReferenceNoteLabel` ending in the bold
`bankRails.instructionReference`. Called
only when `data.bankRails` is given; `invoice-pdf.ts` skips the call and the
vertical space entirely on a card invoice, the same `!== undefined` gate
`OrderValueSection`'s summary rows already use. Every field arrives as a
plain string — no rail-specific formatting, validation or a rail's absence
within `bankRails` (all three are required once `bankRails` is given at
all, since a caller with only some of Grade10's rails on file is not a
shape this contract is asked to represent yet).

**`footer`/`drawFooter` removed from both renderers (`decisions.md`
Q23).** Neither document draws a footer sentence any more; `InvoicePdfCopy`
and `ReceiptPdfCopy` drop the field, and each `drawFooter` function is
deleted along with its call site.

## Risks / Trade-offs

- **[Risk]** Moving `pdf-document.ts`'s hardcoded strings to `copy` fields is
  a mechanical but wide-reaching edit across every `draw*` function; a
  missed call site silently keeps drawing English regardless of `copy`.
  → **Mitigation:** `pdf-document.ts`'s functions take `copy` (or the
  specific label they need) as a parameter with no default — `tsc` refuses a
  call site that forgot to pass one, rather than falling back to a hardcoded
  string.
- **[Risk]** Without DOM assertions, a layout regression (wrong position,
  wrong page) is only caught visually. → **Mitigation:** the Storybook
  stories preview every fixture through `pdf-preview.tsx`'s `pdfjs-dist`
  viewer, so a
  reviewer sees the rendered page on every PR that touches this directory;
  Non-Goals already accepts this ceiling rather than pretending pixel
  assertions exist.
- **[Risk]** `grade10`'s backend and demo lab currently import
  `@grade10/auction-contracts/{invoice-pdf,receipt-pdf}`; after this move
  those subpaths either re-export from `@grade10/ui` or are removed, and a
  consumer left on the old import breaks at build time, not silently.
  → **Mitigation:** `grade10`'s own task group (`tasks.md`) switches both
  consumers in the same change that bumps the submodule, verified by that
  repository's own typecheck.

## Migration Plan

1. Move `pdfDocument.ts`, `receiptPdf.ts`, `invoicePdf.ts`, and their tests
   from `grade10`'s `packages/grade10-auction/contracts` into
   `packages/ui/src/blocks/auction-invoice-and-receipt-pdf/`, renamed per
   the file table above, threading `copy` through every `draw*` call and
   replacing `SUMMARY_LABELS`'s string match with `key` (this repository).
   Delete the retired DOM component files (`pdf-document.tsx`,
   `invoice-pdf.tsx`, `receipt-pdf.tsx`, `types.ts`, the old `fixtures.ts`)
   and their stories, replacing the latter with the `pdfjs-dist`-preview
   versions. Add `pdf-lib`/`@pdf-lib/fontkit` to `packages/ui/package.json`.
2. Retire `apps/preview`'s `winner-order.invoice-pdf.stories.tsx`/
   `winner-order.receipt-pdf.stories.tsx`, which currently render
   `InvoicePdf`/`ReceiptPdf` as JSX (group 2.4's landing) — switch them to
   calling the renderer and previewing the bytes, the same pattern as the
   block's own stories (this repository).
3. `grade10` bumps its `external/grade10-spec` submodule SHA past this
   change's landing, then switches `packages/grade10-auction/backend/src/
   services/auctions/{receiptPdf,invoicePdf}.ts` and the `/demo/pdf` lab
   from importing `@grade10/auction-contracts/{invoice-pdf,receipt-pdf}` to
   importing `InvoicePdf`/`ReceiptPdf` from `@grade10/ui`, then removes its
   own now-redundant copy under `packages/grade10-auction/contracts`. Data
   it already builds (`InvoicePdfData`/`ReceiptPdfData`) needs a `copy`
   argument added at each of the two call sites, sourced from
   `@grade10/i18n`; no other shape changes. `grade10`'s own task
   (`tasks.md`), not built here.

Rollback: step 1 only adds and moves files inside this repository — nothing
consumes them until `grade10` bumps its submodule pin, so it reverts
independently. Step 3 is an ordinary application-side dependency bump
`grade10` can defer or revert on its own.

## Open Questions

None. `decisions.md` Q18-Q23 settle the approach; the `key` discriminant and
the `copy` field list above are this document's own implementation choices,
not product judgments needing a decision row.
