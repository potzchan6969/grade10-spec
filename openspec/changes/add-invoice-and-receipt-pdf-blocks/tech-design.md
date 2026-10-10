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

**Amendment, `decisions.md` Q31-Q39.** Both renderers draw one page today. One
cursor runs down page 1, `drawLineItems` draws the lot title and a
Description/Amount list, and `drawIssuer` pins the issuer block to the foot of
that page. The amendment replaces the lot title and the list with an item
table, lets a long table continue on further pages, and moves the issuer block
to the last page. `grade10` supplies one item per invoice, so no order draws a
second page until an order holds more than one lot. The data contract changes
shape, so this store and `grade10` must move together (see "Landing the item
contract").

## Goals / Non-Goals

**Goals:**
- Move `grade10`'s renderer verbatim in behaviour — same layout, same
  `pdf-lib` calls, same tested output — changing only what this move and
  `decisions.md` Q20 require: every hardcoded label routed through a `copy`
  argument, and the summary grouping keyed on something other than an
  English label string (see "The summary grouping can no longer match on
  label text" below).
- `packages/ui`'s `public-exports.test.ts` convention and a consuming app's
  typecheck are the enforcement that the exported functions and types match
  `spec.md`, not a code review.
- No new exported name beyond `InvoicePdf`, `ReceiptPdf`, and the types a
  caller needs to build their arguments. `../../index` exports only those;
  the rest of `pdf-document.ts` is reachable only by importing the file
  directly through the block's `*` subpath, which no caller needs.
- Tests that call the renderer and inspect the returned PDF's structure
  (page count, page size, and whatever `pdf-lib`'s own reader can confirm),
  the same shape `grade10`'s existing `invoicePdf.test.ts`/`receiptPdf.test.ts`
  already prove, colocated here instead.
- Draw the item table and its continuation with `pdf-lib` alone. No table or
  layout library, and no second pass over the document.
- One layout for one item and for many. The table, the Item Total row and the
  tail under them never branch on the item count.
- Land the breaking item contract in two repositories without a red `main` on
  either side.

**Non-Goals:**
- Computing or validating tax. The optional `taxLine` is a supplied PDF row;
  tax policy, persistence and operator input belong to
  `add-winner-order-tax-line`.
- Building the manually-settled mark, Superseded invoice, or
  `issuerTaxDetails`. Those remain retired under `decisions.md` Q19.
- Implementing the data model, services and wire contracts in this store.
  Grade10 owns its data model, services and wire contracts.
- Pixel-level layout assertions (position, alignment, rule thickness).
  `pdf-lib` writes a content stream, not a DOM; there is no `data-slot` to
  query. Tests prove the data-in/bytes-out contract — order, presence,
  values, page shape — the same ceiling `grade10`'s own tests already
  accepted; a visual regression is caught by the Storybook `pdfjs-dist` preview
  (see Risks), not by an assertion. The amendment adds one read-back: the test
  helper reads each drawn string with the x, y and font size of its text matrix,
  so a test can prove "on the same line", "below", "on page 2", column order and
  that an amount is drawn no smaller than the amounts beside it. It asserts no
  absolute coordinate, rule thickness or font size.
- Combining lots into one invoice (`decisions.md` Q31), computing any amount in
  the block, page numbers and continuation notes (Q36), and a Figma frame
  (Q35).
- Re-rendering PDFs `grade10` has already archived. They keep the layout they
  were stored with.

## Decisions

**Directory and files carry over, contents change.** Still one directory,
`packages/ui/src/blocks/auction-invoice-and-receipt-pdf/` — the name
`decisions.md` Q17 already settled survives this swap. Files:

| File | Holds |
| --- | --- |
| `pdf-document.ts` | The A4 layout and drawing primitives both documents share, moved from `grade10`'s `pdfDocument.ts` verbatim except for the `copy`-threading and `key`-discriminant changes below. Not in `../../index`. From the Q31-Q38 amendment it also holds the item types, the measured item table, the fit check, the page `Sheet` that places the blocks, and `renderDocument`, the one page sequence both documents run. |
| `invoice-pdf.ts` | `InvoicePdf`, `InvoicePdfData`, `InvoicePdfCopy`, exported |
| `receipt-pdf.ts` | `ReceiptPdf`, `receiptBreakdown`, `ReceiptPdfData`, `ReceiptPdfCopy`, exported |
| `fixtures.ts` | Sample data both story files and `apps/preview`'s pages share, unexported from the package - the role `grade10`'s `invoiceSample.ts`/`receiptSample.ts` played there, moved here so both consumers stop keeping their own copy. The item samples (`sampleItems(count)`, `itemTotalOf(items)`, the five table labels) land first and are all the amendment needs; the whole-document samples stay with group 4's open task 4.1 |
| `pdf-test-helpers.ts` | Test helper, unexported: reads every string a page draws from its content stream, with the x, y and font size of its text matrix, and every rule and box, for any page index |
| `invoice-pdf.stories.tsx`, `receipt-pdf.stories.tsx` | Call the renderer on `fixtures.ts` sample data and preview the returned bytes with `pdf-preview.tsx`'s `pdfjs-dist` viewer — there is no component to render as JSX |
| `pdf-preview.tsx` | `PdfPreview`, a small `pdfjs-dist`-based canvas viewer for the returned bytes - Storybook-only, not exported from `../../index`. It draws every page, one canvas each, since the first version drew page 1 only and a long table runs on |
| `public-exports.test.ts` | Asserts every name in this table's second column exports from `../../index`, per `auction-order`'s own test |
| `pdf-document.test.ts`, `invoice-pdf.test.ts`, `receipt-pdf.test.ts` | Moved from `grade10`'s `contracts/test/`, proving `spec.md`'s scenarios at the level Non-Goals fixes |
| `pdf-pages.test.ts` | The page-break scans of a long table, the continuation pages, the issuer on the last page, and the same bytes a day later |

**Also edits:** `packages/ui/package.json` — adds `pdf-lib` and
`@pdf-lib/fontkit` as dependencies, the two packages `grade10`'s renderer
already depends on, and `pdfjs-dist` as a devDependency for the Storybook
preview. Its `"./blocks/*"` export resolves only `*.tsx`, since every other
block is a component. This directory's entry files are plain `.ts` (no JSX), and
an array fallback does not resolve for an external consumer (task 5.5), so two
subpath entries sit before it:
`"./blocks/auction-invoice-and-receipt-pdf/*"` resolves `*.ts`, and
`"./blocks/auction-invoice-and-receipt-pdf/pdf-preview"` resolves the `.tsx`
viewer. No other block's `.tsx` export is affected.
`packages/ui/vitest.config.ts`'s `audit` project now runs its plain tests
from a glob (`src/**/*.test.ts`) rather than the explicit allowlist this
document originally described, so this directory's `public-exports.test.ts`
and the moved renderer's own tests are picked up automatically — no config
edit needed.

**Data shape carries over from `grade10` unchanged, except the agreed
contract additions.** `InvoicePdfData`/`ReceiptPdfData` keep the shape
`grade10`'s already-tested renderer takes — `PdfLineItem { key?, label,
amount }` (see below for `key`), `PdfPartyAddress = Record<string, string |
null> | null`, plain `string` amounts and `Date` for every date. No caller
supplies a time zone. This revision adds the optional supplied
`taxLine` to both documents and `replacesInvoice` to invoices. The Q31-Q35
amendment swaps `listingTitle` for `items` and `itemTotal`, and the
Description and Amount labels for the table's five (see "Items replace the lot
title"). This is a
deliberate difference from the
retired DOM design's `ReactNode` props (`decisions.md` Q6): there is no JSX
here to hold a `ReactNode`, so every value is the plain type `pdf-lib` can
draw directly.

```ts
export type PdfLineItem = {
  /** Recognized regardless of `label`'s text, so a translated label still
   * routes into the summary. Absent on an ordinary charge. */
  key?: "subtotal" | "paymentProcessingFee" | "orderTotal";
  label: string;
  amount: string;
};

export type InvoicePdfReplacement = {
  invoiceId: string;
};

/** One row of the item table; every amount arrives preformatted (Q31-Q33). */
export type PdfItemRow = {
  title: string;
  winningBid: string;
  buyersPremium: string;
  total: string;
};

/**
 * The Item Total row's amounts, supplied and never summed (Q33). All three are
 * required (Q38): a missing amount is a type error, and the block has no blank
 * or dash fallback for it.
 */
export type PdfItemTotal = {
  winningBid: string;
  buyersPremium: string;
  total: string;
};

export type PdfDocumentCopy = {
  billToHeading: string;
  shipToHeading: string;
  itemLabel: string;
  winningBidLabel: string;
  buyersPremiumLabel: string;
  totalLabel: string;
  itemTotalLabel: string;
};

export type InvoicePdfCopy = PdfDocumentCopy & {
  documentTitle: string;
  invoiceNumberLabel: string;
  sentAtLabel: string;
  paymentDeadlineLabel: string;
  paymentMethodLabel: string;
  replacesInvoiceLabel: string;
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
  swift?: { beneficiary: string; swiftBic: string; account: string };
  fps?: { fpsId: string; beneficiary: string };
  hkLocalTransfer?: { bankAndCode: string; beneficiary: string; accountNo: string };
  reference: string;
};

export type InvoicePdfData = {
  items: readonly PdfItemRow[];
  itemTotal: PdfItemTotal;
  invoiceNumber: string;
  sentAt: Date;
  paymentDeadline: Date;
  paymentMethod: string;
  billTo: PdfPartyAddress;
  shipTo: PdfPartyAddress;
  /** The charges under the table, then the keyed summary rows. */
  lineItems: readonly PdfLineItem[];
  taxLine?: PdfLineItem | null;
  replacesInvoice?: InvoicePdfReplacement | null;
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
  items: readonly PdfItemRow[];
  itemTotal: PdfItemTotal;
  receiptNumber: string;
  paidAt: Date;
  invoiceId: string;
  paymentReferenceCode: string;
  billTo: PdfPartyAddress;
  shipTo: PdfPartyAddress;
  /** The charges under the table, then the keyed summary rows. */
  lineItems: readonly PdfLineItem[];
  taxLine?: PdfLineItem | null;
  paymentBreakdown: ReceiptPaymentBreakdown;
  paymentMethod: string;
  paymentReference: string | null;
  issuerName: string;
  issuerEmail: string;
  copy: ReceiptPdfCopy;
};
```

**The summary grouping can no longer match on label text (`decisions.md`
Q20).** `grade10`'s `drawLineItems` currently sorts a charge into the
summary by `SUMMARY_LABELS.has(item.label)` — a `Set` of the literal English
strings `"Subtotal"`, `"Payment Processing Fee"`, `"Order Total"`. That only
ever worked because `grade10`'s backend happens to hardcode those same
strings; once a caller's `label` is a translated value, the match silently
stops firing and every summary line falls back into the ordinary charge list.
`key` (above) replaces it: `drawLineItems` groups by `item.key !== undefined`,
and singles out `key === "orderTotal"` for the bold, rule-set-off treatment
`ORDER_TOTAL_LABEL` used to identify by string equality. The optional
`taxLine` is a separate ordinary charge inserted immediately before the
summary and is never grouped into it.

**Every string `pdf-document.ts`/`invoice-pdf.ts`/`receipt-pdf.ts` currently
hardcodes moves to a `copy` field (`decisions.md` Q20).** `drawParties`'s
`"Bill To"`/`"Ship To"`, the item table's column header and Item Total label
(`"Description"`/`"Amount"` until the Q31-Q35 amendment), `drawTitle`'s caller-supplied `"Invoice"`/`"Receipt"` title, every
meta-row label (`"Receipt number"`, `"Invoice number"`, `"Date paid"`,
`"Payment method"`, `"Payment reference"`, `"Date of issue"`, `"Date due"`),
`paymentSectionBlock`'s `"Payment"`/`"Transfer reference"`,
`paymentBreakdownBlock`'s `"Payment breakdown"` and `receiptBreakdown`'s four
row labels, and the replacement label — all become `copy.*` fields instead of
string literals in `pdf-document.ts`. A line item's own `label` (`"Shipping
& Handling"`, `"Subtotal"`, and so on) already arrives as a caller-supplied string on
`PdfLineItem` and needed no change; only the section/meta labels the
renderer itself used to own move.

**Document dates use Hong Kong time.** `formatDateTime` formats each `Date`
in `Asia/Hong_Kong` and labels it `GMT+8`, as required by the accepted
`shared/dates-and-times` contract. The caller passes no zone. Money remains
preformatted by the caller.

**The Grade10 wordmark stays a component-owned SVG path, not a prop.**
`LOGO_PATHS` (`pdf-document.ts`) is unchanged from `grade10`'s version — a
graphic brand mark keyed by issuer name, falling back to the issuer's name
as text when no mark is on file. Nothing in `spec.md` requires a specific
mark; this is implementation detail carried over rather than newly decided.

**Party address stays `PdfPartyAddress = Record<string, string | null> |
null`, not a structured type.** The retired DOM design's nine-field
`PartyAddress` (`decisions.md`'s prior Q11) is not restored: `grade10`'s
`addressLines` already draws a well-defined shape from this looser type: six
lines today, and seven once task 7.3 adds the phone line (`spec.md`'s "Bill To
and Ship To render as an address, or 'Not recorded' when withheld"). Restructuring
it into named fields here would mean rewriting and re-testing working code for a
stronger type than any current caller needs. A future change can tighten it if a real requirement
calls for validating the shape at the type level.

**Failure is not handled - it propagates.** Unchanged from `grade10`'s
version: neither renderer catches a `pdf-lib` failure or a bad font byte;
both surface as a rejected `Promise` to the caller. Q38 adds three refusals on
top of that, set out under "Three refusals".

**InvoicePdf gains a fourth meta row, `paymentMethod` (`decisions.md`
Q21).** `drawMetaBlock` in `invoice-pdf.ts` draws it last, after Date due —
appending rather than reordering the three rows already there, since no
decision fixes a different order and this is the least disruptive place to
add one. The value arrives preformatted (`"Card"`, `"Bank transfer"`, or
whatever string the caller already built for `ReceiptPdf`'s own
`paymentMethod`), matching the presentation-only contract every other field
here already follows — this renderer does not know payment methods exist as
a concept, only that it draws whatever string it is given.

**InvoicePdf gains a conditional `bankDetailsBlock` section, full width below
the order value (`decisions.md` Q22).** Living in `invoice-pdf.ts` itself,
matching `receipt-pdf.ts`'s own document-specific sections
(`paymentSectionBlock`, `paymentBreakdownBlock`) rather than the shared
`pdf-document.ts` — no other document draws it. `bankDetailsBlock` draws
`copy.bankDetailsHeading`
then one column for each enabled rail - SWIFT, FPS, and HK local transfer in
that order when supplied. Each column has its own heading and stack of
label/value lines; the enabled columns divide the content width equally.
Disabled or retired rails have no column or reserved width. A rule follows
the columns, then one wrapped line of
`copy.bankReferenceNoteLabel` ending in the bold
`bankRails.reference`. Called
only when `data.bankRails` is given; `invoice-pdf.ts` skips the call and the
vertical space entirely on a card invoice, the same `!== undefined` gate
`OrderValueSection`'s summary rows already use. Every field arrives as a
plain string - no rail-specific formatting or validation. The caller
supplies at least one enabled rail when it supplies `bankRails`.

**A replacement invoice names its predecessor.** `InvoicePdfData` accepts
optional `replacesInvoice` with `invoiceId`. `drawMetaBlock` draws
`copy.replacesInvoiceLabel` and the replaced ID as a plain-text row only when
the relationship is present. The current invoice number remains the
document's own number. The PDF carries no link to the replaced invoice.

**`footer`/`drawFooter` removed from both renderers (`decisions.md`
Q23).** Neither document draws a footer sentence any more; `InvoicePdfCopy`
and `ReceiptPdfCopy` drop the field, and each `drawFooter` function is
deleted along with its call site. The replacement row is the only
replacement-specific output, and its label comes from
`InvoicePdfCopy.replacesInvoiceLabel` while its ID comes from
`InvoicePdfData.replacesInvoice`.

**Items replace the lot title (`decisions.md` Q31-Q33).** `spec.md` governs what
the table shows. This is how the data reaches the renderer. `InvoicePdfData`
and `ReceiptPdfData` lose `listingTitle` and gain `items`, one `PdfItemRow` per
item in the order drawn, and `itemTotal`, the three Item Total amounts. The
caller supplies both. The block sums nothing, so a row's `total` and the Item
Total amounts are whatever strings arrive.

| Export | Change |
| --- | --- |
| `InvoicePdfData`, `ReceiptPdfData` | `listingTitle` removed. `items` and `itemTotal` added. Breaking. |
| `PdfDocumentCopy`, and so `InvoicePdfCopy` and `ReceiptPdfCopy` | `descriptionLabel` and `amountLabel` removed. `itemLabel`, `winningBidLabel`, `buyersPremiumLabel`, `totalLabel` and `itemTotalLabel` added. Breaking. |
| `PdfItemRow`, `PdfItemTotal` | New types. Exported from `pdf-document.ts` and `../../index`, and added to `public-exports.test.ts`. |
| `PdfLineItem`, `InvoicePdfLineItem`, `ReceiptPdfLineItem` | Same shape. `lineItems` holds only the other charges under the table and the keyed summary rows. Winning Bid and Buyer's Premium leave it for the items, and Tax leaves it for `taxLine`, the only route for Tax (`decisions.md` Q30). |
| `InvoicePdf`, `ReceiptPdf`, `receiptBreakdown`, `addressLines`, `PdfPartyAddress`, `ReceiptPaymentBreakdown`, `InvoicePdfRenderOptions`, `ReceiptPdfRenderOptions` | Unchanged. |

**The keyed summary rows stay in `lineItems`.** `key` still routes Subtotal,
Payment Processing Fee and Order Total into the summary, and the charges
are the rows with no `key`. A caller that still lists Winning Bid, Buyer's
Premium or Tax there gets them drawn again as charges, Tax once more beside
`taxLine`. The renderer cannot tell them from other charges without matching
English text, which Q20 removed. The guard is the caller's mapping test (see
Risks).

**One list, no item-count branch.** `items` is a plain `readonly
PdfItemRow[]`. One item is the same code path as many, with one row. Q33 puts
an Item Total row on every document, so the table has no second variant to
branch to.

**New `copy` labels (Q20, Q32).** The five labels sit in `PdfDocumentCopy`, not
in the invoice or receipt copy, because both documents draw the same table.
`totalLabel` and `itemTotalLabel` stay two fields: a translation may differ
between a column header and a row label. `grade10` supplies English literals
for now. The shared catalog `@grade10/i18n` `auctionInvoicePdf.document` still
holds `descriptionLabel` and `amountLabel`, and `ui-design.md` says this change
moves no catalog key. So the block's tests and stories spread the catalog and
add the five labels from `fixtures.ts` beside it. The two dead catalog keys
wait for the follow-up in Open Questions.

**The table is measured once, before any page is drawn.** Every page lines up
because widths and wrapped lines come from the whole table.

- **Amount columns** - Winning Bid, Buyer's Premium and Total, right-aligned,
  each as wide as its widest header, row amount or Item Total amount, with a
  floor of `MIN_AMOUNT_COLUMN`. The Total column ends at `RIGHT_EDGE`, so the
  charges and the summary under the table keep their right edge. An amount
  is never wrapped, drawn smaller or allowed to overflow (Q38,
  `shared-ui-invoice-and-receipt-pdf-SC-72`).
- **Item column** - the content width left after the amount columns and one
  `COLUMN_GAP`. The title wraps in it at `BODY_SIZE`.
- **Row** - the title's wrapped lines at `LINE_HEIGHT`, then `ROW_PADDING`. The
  three amounts sit on the first line.
- **Header** - the four labels at `SMALL_SIZE`, bold, over a strong rule, as the
  Description/Amount header was. The rule stays under the header on every page
  (Q38).
- **Item Total row** - `copy.itemTotalLabel` and the three amounts, bold, under
  a strong rule.
- **Long words** - `wrap` splits on spaces only, so an unspaced title (CJK, a
  long code) is one word and overruns its column. It gains a fallback: a word
  wider than the width breaks at the code point that no longer fits, inside the
  word (Q38, `shared-ui-invoice-and-receipt-pdf-SC-59`). The Bank details values
  use the same function and gain the same fallback.

| Constant | Value | Role |
| --- | --- | --- |
| `BODY_BOTTOM` | `MARGIN + 3 * LINE_HEIGHT` | Lowest y any body block reaches on every page. Keeps the issuer band clear |
| `ROW_PADDING` | 6 | Space under an item row's last line |
| `COLUMN_GAP` | 12 | Between the Item column and the first amount column, and between amount columns |
| `MIN_AMOUNT_COLUMN` | 72 | Floor for an amount column |
| `MIN_TITLE_COLUMN` | 120 | Below this the renderer rejects the document |

The values are starting points for the Storybook review (`decisions.md` Q35).
Changing one moves no requirement.

**Pages are a loop over measured blocks (`decisions.md` Q34).** `pdf-lib` has no
layout engine and cannot undo a drawn operator, so nothing is drawn until it is
known to fit. Each section that can reach a page end is a block: a height
measured from the same wrapped lines and row metrics its `draw` uses, and a
`draw` that takes a page and a top y. A `Sheet` holds the document, the current
page and the current y. `place(block)` adds an A4 page when `y - block.height`
would fall below `BODY_BOTTOM`, then draws the block and moves y down. A page is
added only when a block needs it, so a document that fits is exactly one page.

| Block | Holds | Breaks |
| --- | --- | --- |
| Column header | The four labels and the rule under them | Never alone at a page foot. Placed with the row after it, and drawn again at the top of every continuation page, with nothing else of the page head |
| Item row | The wrapped title lines and the three amounts on the first line | Never inside a row. A row that does not fit moves whole |
| Tail | The Item Total row, the charges, the optional Tax line and the summary | Never inside the tail. It moves whole, under a repeated header, with no item row moved over |
| Bank details (invoice) | Heading, rail columns, rule and reference note | Moves whole, and is not tied to the summary above it |
| Payment section (receipt) | The "Payment" heading and the transfer reference, only when one is given | Moves whole, and is not tied to the summary above it |
| Payment breakdown (receipt) | Its heading and the four lines | Moves whole |

The head (title, meta rows, parties) is drawn on page 1 as it is today, and on
no other page. It holds at most five meta rows and seven address lines a party,
so it cannot reach a page end. No page carries a page number or a continuation
note (Q36, `shared-ui-invoice-and-receipt-pdf-SC-73`). Before any of this,
`InvoicePdf` and `ReceiptPdf` reject an empty `items`. The sections after the
head run in this order:

1. Place the header together with the first item row.
2. Place each further row. A row that does not fit opens a page, draws the
   header, then the row.
3. Place the tail. A tail that does not fit opens a page, draws the header, then
   the tail, and moves no item row with it. The header repeats above a page that
   holds only the Item Total row and what follows, since the header is what
   labels that row's cells.
4. Place Bank details on an invoice, or the Payment section and the Payment
   breakdown on a receipt, each whole.
5. Draw the issuer block once, on the Sheet's current page, which is the last.

The tail keeps the Item Total row and the summary together by keeping what sits
between them with them. `grade10` supplies at most three charges, so the tail
is a fraction of a page.

**The issuer block is drawn once, on the last page, pinned to its bottom edge
(`decisions.md` Q36, Q38).** It sits on the last page only, with no page numbers
or continuation notes. `BODY_BOTTOM` keeps the issuer band clear on every page,
so no block reaches the band, the block never takes a page of its own
(`shared-ui-invoice-and-receipt-pdf-SC-76`), and the last page needs no
look-ahead. `drawIssuer` runs after the last placement at a fixed y, as
`grade10`'s renderer does today, so the block sits in the same place on every
document, whatever ends above it (`SC-39`, `SC-40`, `SC-48`, `SC-66`). Other
pages leave the band empty.

**Three refusals (`decisions.md` Q38, Q39).** `spec.md` states each one. None draws a
page first: each check runs while the table and the blocks after it are
measured, before the first page exists.

| Refusal | Raised by | Error |
| --- | --- | --- |
| An empty item list (`SC-69`) | `measureItemTable`, before any page exists | A `RangeError` that says no items were given |
| A title the standard font cannot draw, with no embedded font supplied (`SC-70`) | `pdf-lib`, when the title is first measured: the standard font throws on a character it cannot encode. The block adds no check and draws no placeholder | The `pdf-lib` error, unchanged |
| A row, the tail or the amount columns that cannot fit (`SC-71`) | The measuring step. An item row or the tail taller than a page body, or an Item column narrower than `MIN_TITLE_COLUMN` | A `RangeError` that names which of the three does not fit |

`requireFits` is the one fit check. It also refuses Bank details, the Payment
section or the payment breakdown taller than a page body, naming the section,
since a document that cannot be drawn whole is refused (Q39).

Nothing draws off the page and nothing is truncated or shrunk. `grade10` picks the
embedded font from the item titles (see "What `grade10` maps"), so a Chinese
title reaches the block with its face and is not refused.

**Rejected for the pagination.** Smaller type to fit one page, and a row split at
the page foot, are the two options Q34 refused. A table library (pdfmake,
jspdf-autotable) is a new dependency that needs its own recorded decision, and
`pdf-lib` already draws everything the table needs. Drawing a page and
discarding it to retry draws everything twice and lets measure and draw disagree
unnoticed. Measured blocks make them one computation.

**Landing the item contract across the two repositories.** The contract breaks
for every caller, and `grade10` consumes this store at a pinned commit, so the
order is fixed.

1. The store lands first. Groups 8 and 9 move the store's `main` to the new
   contract. Group 8 also moves every consumer inside the store (the block's two
   story files and `apps/preview`'s two pages) to the new fields, so the store's
   typecheck stays green after group 9 alone. The store's CI sees the contract
   and all its consumers together. It knows nothing of `grade10`.
2. `grade10` sees nothing until it bumps `external/grade10-spec`. It stays green
   on its pin.
3. `grade10` then lands the bump and the mapping as one commit in one pull
   request (group 11).
   - The bump alone fails `grade10`'s typecheck in `invoicePdf.ts`,
     `receiptPdf.ts`, `invoiceSample.ts` and `receiptSample.ts`: `items`,
     `itemTotal` and the five labels are missing, and `listingTitle`,
     `descriptionLabel` and `amountLabel` are unknown. Their tests that assert
     `lineItems` fail at run time too.
   - The mapping alone against the old pin fails the other way.
   - `check:submodules` refuses a pin that is not already on the store's branch
     (`main`), so step 1 comes first. Its required checks (typecheck, smoke, biome,
     submodules, schemas) all run on that one pull request.
4. The bump takes in every store commit since the pin, not only this change.
   Group any other failure by cause before attributing it here.
5. The same bump carries group 8's `grade10` task (still numbered 7.4), which edits the same
   `invoiceDataFrom` function. One engineer, or two in sequence on one branch,
   lands both so the submodule moves once.

**What `grade10` maps.** One item per invoice, because an order holds one lot.
`hammerAmount` and `buyerPremiumAmount` are not-null columns, so every field of
the item exists.

| Field | Source |
| --- | --- |
| `items[0].title` | `listing.title`, or `"Auction lot"` when it has none, as `listingTitle` does today |
| `items[0].winningBid` | `formatAmount(hammerAmount, currency)`: `formatMoney` without the currency, so the item table's amounts carry none (`decisions.md` Q41) |
| `items[0].buyersPremium` | `formatAmount(buyerPremiumAmount, currency)` |
| `items[0].total` | `formatAmount(hammerAmount + buyerPremiumAmount, currency)`. `grade10` adds the two integers of minor units. The block adds nothing |
| `itemTotal` | The same three strings, since the one item is the whole table |
| `lineItems` | Shipping & Handling, Insurance, then the three keyed summary rows, each omitted when its amount is null, as `lineItems()` does today minus its first two entries and its Tax entry |
| `taxLine` | `Tax` with `formatMoney(taxAmount, currency)`, or `null` when `taxAmount` is null. It is the only place Tax travels (`decisions.md` Q30), so the block draws it once, after the charges and before the summary |
| `copy` | The five labels as English literals in `PDF_DOCUMENT_COPY`, replacing `descriptionLabel` and `amountLabel` |

The shared helper `lineItems()` in `receiptPdf.ts` splits in three: `lineItems()`
for the other charges and the summary, a new `itemTable()` returning `{ items,
itemTotal }`, and a new `taxLine()`. `invoiceNeedsEmbeddedFont` and
`receiptNeedsEmbeddedFont` read the item titles in place of `listingTitle`, since
a title is what carries non-Latin text, and the `taxLine` label in place of the
Tax entry they read from `lineItems`; a title that needs the embedded face always arrives with it, because the
block refuses one without (`shared-ui-invoice-and-receipt-pdf-SC-70`).

**The money checks stay in `grade10`.** The block computes nothing
(`shared-ui-invoice-and-receipt-pdf-SC-61`), so `grade10`'s mapping tests hold
both checks: each item's `total` equals its Winning Bid plus its Buyer's Premium,
summed as integers of minor units and then formatted, and the three `itemTotal`
amounts equal the sums of the item rows' columns. With one item per invoice the
second check compares the same three strings, and it holds for several items
without a change. The receipt formats with `payment.currency` and the invoice with
`invoice.currency`, as they do now. `grade10`'s PDF lab gains a several-item and
a long-table sample so a reviewer can see a second page, which no real order
produces.

**Fixtures and stories.** `fixtures.ts` holds `sampleItems(count)`, which
returns count items titled `Lot 01`, `Lot 02`, ... with amounts a test can read,
`itemTotalOf(items)`, which the fixtures (not the block) use to build the Item
Total strings, and the five table labels. The two story files and `apps/preview`'s
two pages each gain a `SeveralItems` story (three items) and a `LongTable` story
(30 items, which runs onto a second page). The existing stories keep their
names and move to one item. Group 8 migrates them to the new fields so the
store compiles. Group 9 adds the two new stories and the all-pages preview.

**Validation.** The store's own commands are the evidence:
`pnpm --filter @grade10/ui run typecheck`, `... run test`, `... run test:stories`,
then `pnpm run typecheck`, `pnpm run lint`, and `pnpm --dir apps/preview exec
storybook build`.

- **Unit tests per scenario** read the returned bytes with `pdf-lib`: page
  count, page size, and every string per page with its x and y from
  `pdf-test-helpers.ts`. The Latin fallback face writes readable hex strings. The
  store ships no CJK face, so the embedded-face path stays in `grade10`'s tests.
- **Page-break scenarios scan item counts** (1 to 40) rather than hard-code the
  count where a break falls, so a change to a row height moves no test. A scan
  also asserts that at least one count lands the break it is about, so the test
  cannot pass without ever reaching the break. This covers `SC-63` to `SC-65`
  and `SC-74` to `SC-76`.
- **Refusals** (`SC-69` to `SC-71`) expect the call to reject. `SC-70` renders
  an item titled `中8號` with no font bytes, so it asserts the `pdf-lib` error
  and not a result the block built.
- **Nothing reaches the issuer band.** Every scan reads each page's strings,
  rules back from the bytes and finds them at or above `BODY_BOTTOM`, except the
  issuer block's two lines on the last page, and finds no box on any page.
- **Determinism** (`SC-77`, `decisions.md` Q39). Two renders of one 30-item input, the second with
  the clock a day later, return identical bytes. The renderer stamps each
  document's own date as its creation and modification date and reads the clock
  nowhere else.
- **Stories** show every fixture through `PdfPreview`, all pages, so a reviewer
  sees a long table on every pull request that touches the directory, and each
  `LongTable` story checks that the preview draws more than one page. The
  Design Override check reads class strings and style props, not pdf-lib's
  drawing, so it stops no commit here; the person's review of these stories is
  the design check (Q35).
- **`grade10`** runs `pnpm run typecheck`, `pnpm run lint`,
  `pnpm run test --filter grade10`, and the focused auction PDF service tests.
  Its mapping tests assert that `lineItems` carries no Winning Bid, Buyer's
  Premium or Tax row (the guard named above), that `taxLine` carries Tax when
  the invoice holds one and is `null` when not, that a one-item invoice maps to
  one item whose total is the sum, and that the Item Total amounts equal the
  column sums.

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
- **[Risk]** `grade10`'s backend and demo lab imported
  `@grade10/auction-contracts/{invoice-pdf,receipt-pdf}`; after the move
  those subpaths were removed, and a consumer left on the old import breaks at
  build time, not silently. → **Mitigation:** `grade10`'s group 5 switched both
  consumers in the same change that bumped the submodule, verified by that
  repository's own typecheck.
- **[Risk]** A block's measured height drifts from what its `draw` puts on the
  page, so a row clips the footer band or two blocks overlap. →
  **Mitigation:** `measuredBlock` measures a block by running its own `draw` on
  a page that records coordinates, so height and drawing are one layout, and
  every scan finds the real bytes at or above `BODY_BOTTOM`.
- **[Risk]** One item row or the tail is taller than a page body, or the amount
  columns leave the title column too narrow. → **Mitigation:** the measuring step
  rejects the document with an error naming what does not fit (see "Three
  refusals") rather than draw off the page.
- **[Risk]** A caller keeps listing Winning Bid, Buyer's Premium or Tax in
  `lineItems`, so each is drawn twice (Tax beside `taxLine`) and nothing in the
  type says so. → **Mitigation:** `grade10`'s mapping test asserts `lineItems`
  carries none of the three labels, and the several-item sample in the PDF lab
  shows the rows once.
- **[Risk]** The bump alone, or the mapping alone, leaves `grade10`'s `main` red.
  → **Mitigation:** one commit carries both (see "Landing the item contract").
- **[Risk]** `grade10` stores the first-rendered bytes of each document, so an
  invoice or receipt opened before this ships keeps the flat layout and a
  document first opened after it reads as a table (`decisions.md` Q37). →
  **Mitigation:** the archive keeps the bytes of the first open, so no stored
  document changes layout and no purge is needed. The stored copy is the record
  of what the winner was shown, and the block does nothing about it.

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
3. Landed in group 5: `grade10` bumped its `external/grade10-spec` submodule
   SHA past this change's landing, switched
   `packages/grade10-auction/backend/src/services/auctions/{receiptPdf,invoicePdf}.ts`
   and the `/demo/pdf` lab from importing
   `@grade10/auction-contracts/{invoice-pdf,receipt-pdf}` to importing
   `InvoicePdf`/`ReceiptPdf` from `@grade10/ui`, removed its own redundant copy
   under `packages/grade10-auction/contracts`, and added a `copy` argument of
   English literals at each call site (task 5.2). The `replacesInvoice` mapping
   is task 7.4 and the `taxLine` mapping is task 11.3, both built in `grade10`.
4. Q31-Q35, this repository (groups 9 and 10). Group 9 swaps `listingTitle` for
   `items` and `itemTotal`, swaps the two copy labels for five, draws the
   measured item table and tail, and moves every in-store consumer to the new
   fields. Group 10 adds the page loop, the all-pages preview, and the
   several-item and long-table samples.
5. Q31-Q35, `grade10` (group 11), after groups 9 and 10 are on the store's
   `main`: bump the submodule, map one item per invoice and receipt, split
   `lineItems()` into `lineItems()`, `itemTable()` and `taxLine()`, supply the
   five literals, and add the lab samples. One commit, one pull request, so the pin and the mapping never sit
   apart.
6. Documents `grade10` already archived are not touched. The next first open of
   any other document renders the table.

Rollback: step 1 only adds and moves files inside this repository — nothing
consumes them until `grade10` bumps its submodule pin, so it reverts
independently. Step 3 is an ordinary application-side dependency bump
`grade10` can defer or revert on its own. Steps 4 and 5 revert the same way:
the store keeps its history, and `grade10` can re-pin the previous commit in a
single commit that also restores the old mapping. Archived documents are the
same either way.

## Open Questions

`decisions.md` Q18-Q24, Q26 and Q31-Q39 settle the approach; the `key`
discriminant, the `copy` field list, the item contract and the page loop above
are this document's implementation choices, not product judgments needing
another decision row. One thing remains that a later answer settles without
moving the approach or the task breakdown:

1. **The dead catalog keys.** Adding the five labels to
   `auctionInvoicePdf.document` in all four locales and removing
   `descriptionLabel` and `amountLabel` is a separate catalog change with
   translations to confirm. Until then the fixtures hold the five labels.
