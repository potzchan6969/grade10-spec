## Context

`shared/ui/invoice-and-receipt-pdf` (see `specs/shared/ui/invoice-and-receipt-pdf/spec.md`)
adds `InvoicePdf` and `ReceiptPdf` to `@grade10/ui`. Both are presentation-only
`@grade10/design-system`-composed React components — no data fetching, no
computation, no `@grade10/i18n` import, every amount/date a preformatted
`ReactNode`, every label from a `copy` prop, per the existing component-contract
rule (`docs/governance/ui-component-contracts.md`) every other `packages/ui`
block already follows.

`apps/preview`'s current sketch
(`winner-order.invoice-pdf.stories.tsx`, `winner-order.receipt-pdf.stories.tsx`,
`winner-order-pdf.story-shared.tsx`) composes `@grade10/design-system`
primitives directly, in this repository, with no export contract behind it.
`grade10` opens a hardcoded placeholder PDF today (`PLACEHOLDER_RECEIPT_PDF`).
This design turns the sketch's layout into the real export; wiring `grade10`
onto it is a task this change names but does not build (see Migration Plan).

## Goals / Non-Goals

**Goals:**
- Fix the two components' prop shapes precisely enough that `packages/ui`'s
  `public-exports.test.ts` convention and a consuming app's typecheck are the
  enforcement, not a code review.
- No new exported component beyond `InvoicePdf` and `ReceiptPdf` — every
  prop type in this design exists to type those two, not as a public surface
  of its own.
- Colocated stories, with `play` assertions on every conditional-rendering
  scenario, as the executable proof — the same way every other `packages/ui`
  block's stories are the proof, not `apps/preview`'s.

**Non-Goals:**
- Generating an actual `.pdf` file. See `decisions.md`'s Non-Goals — that is
  `grade10`'s own headless-render step, outside this design entirely.
- A data model, a service, or a wire contract. Nothing here touches a
  database, a backend service, or an API — `Database Schema`, `Service
  Interfaces`, and `API Contracts` are omitted from this document because
  none apply.
- Deciding the tax line's or the formal tax receipt's shape. Both stay the
  loosely-typed `ReactNode` slots `spec.md` already fixes.

## Decisions

**Directory: one block, not two.** Per `decisions.md` Q7 (redrawn after Q9
merged the capability), `InvoicePdf` and `ReceiptPdf` live in one directory,
`packages/ui/src/blocks/invoice-and-receipt-pdf/`, mirroring the one-capability,
one-directory convention every other block already follows
(`packages/ui/src/blocks/auction-order/`). Files:

| File | Holds |
| --- | --- |
| `invoice-pdf.tsx` | `InvoicePdf`, exported |
| `receipt-pdf.tsx` | `ReceiptPdf`, exported |
| `pdf-document.tsx` | Private layout pieces both share: the sheet frame, a meta-row, a party block, a fixed two-column value row, a summary row — lifted and reshaped from `apps/preview`'s sketch (see "Reuse over rebuild" below), unexported |
| `types.ts` | Every exported prop type: `InvoicePdfProps`, `InvoicePdfCopy`, `ReceiptPdfProps`, `ReceiptPdfCopy`, and the shared row shapes both use |
| `invoice-pdf.stories.tsx`, `receipt-pdf.stories.tsx` | Storybook stories with sample props — the behavior proof for `spec.md`'s scenarios (see Risks) |
| `public-exports.test.ts` | Asserts `InvoicePdf`/`ReceiptPdf` and every prop type in this table are exported from `../../index`, per `auction-order`'s own test |

**Also edits:** `packages/ui/vitest.config.ts` — its `audit` project runs
tests from an explicit `include` allowlist rather than a glob, so this
directory's `public-exports.test.ts` is added to that list. Without this edit
the file exists and never runs.

**Prop shape.** Every field `spec.md`'s requirements name becomes exactly one
prop. Content and amounts are `ReactNode` (per `decisions.md` Q6); every
`copy` field is `string`, matching every other `*Copy` type in `packages/ui`
(SC-17: "every label reads the string `copy` gave it"). `manuallySettled` is
the one further exception, explained below.

```ts
type OrderValueLines = {
  lot: ReactNode;
  winningBid: ReactNode;
  buyersPremium: ReactNode;
  shippingAndHandling: ReactNode;
  insurance?: ReactNode; // SC-4, SC-21: omitted, not blank, when withheld — `!== undefined` gates it
  taxLine?: ReactNode; // SC-13, SC-14, SC-23, SC-25: reserved — presence-gated, see below
  subtotal: ReactNode;
  paymentProcessingFee: ReactNode;
  orderTotal: ReactNode;
};

// One shared type for both documents' order-value lines, deliberately not
// split per component — see "One order-value shape, not two" below.
// -? strips the optionality insurance/taxLine would otherwise carry into
// their labels; a line that may not render still owes a real label for when
// it does. lot is excluded — it renders as a bare heading, not a labelled
// line, so nothing needs a label for it.
type OrderValueLinesCopy = {
  [K in keyof Omit<OrderValueLines, "lot">]-?: string;
};

type InvoicePdfCopy = {
  documentTitle: string; // the "Invoice" heading itself is a label, like every other — not component-owned text
  invoiceIdLabel: string;
  paymentMethodLabel: string;
  sentAtLabel: string;
  paymentDeadlineLabel: string;
  bankReferenceLabel: string;
  bankRailsLabel: string;
  replacedByLabel: string;
  billToHeading: string;
  shipToHeading: string;
  orderValue: OrderValueLinesCopy;
};

type InvoicePdfProps = {
  invoiceId: ReactNode;
  paymentMethod: ReactNode;
  sentAt: ReactNode;
  paymentDeadline: ReactNode;
  bankReference?: ReactNode; // SC-2, SC-18: independent of bankRails
  bankRails?: ReactNode; // SC-1, SC-2, SC-18: independent of bankReference
  issuer: ReactNode; // one opaque block, unlike billTo/shipTo — "Grade10" is the issuer's own content, not a copy label the way "Bill to" is
  billTo: ReactNode;
  shipTo: ReactNode; // SC-19: never echoes billTo
  orderValue: OrderValueLines; // SC-3: the lot is orderValue.lot, not a separate prop
  replacedBy?: ReactNode; // SC-5, SC-6
  copy: InvoicePdfCopy;
  className?: string; // convention across every packages/ui block
};

type PaymentBreakdown = {
  originalInvoiceTotal: ReactNode;
  previousPayments: ReactNode;
  currentPaymentReceived: ReactNode;
  remainingBalanceDue: ReactNode; // SC-22: all four render even at zero
};

type PaymentBreakdownCopy = { [K in keyof PaymentBreakdown]: string };

type ReceiptPdfCopy = {
  documentTitle: string; // the "Receipt" heading itself is a label, like every other — not component-owned text
  receiptIdLabel: string;
  invoiceIdLabel: string;
  paymentMethodLabel: string;
  manuallySettledLabel: string;
  supersededInvoiceLabel: string;
  billToHeading: string;
  shipToHeading: string;
  orderValue: OrderValueLinesCopy;
  paymentBreakdown: PaymentBreakdownCopy;
};

type ReceiptPdfProps = {
  receiptId: ReactNode;
  invoiceId: ReactNode;
  paymentMethod: ReactNode;
  manuallySettled?: boolean; // SC-9, SC-10: see below — not presence-gated like the reserved slots
  billTo: ReactNode;
  shipTo: ReactNode; // SC-29: never echoes billTo
  orderValue: OrderValueLines; // SC-21: the same shared type InvoicePdf uses
  paymentBreakdown: PaymentBreakdown;
  supersededInvoice?: ReactNode; // SC-11, SC-12
  issuerTaxDetails?: ReactNode; // SC-15, SC-24, SC-30: independent of taxLine
  copy: ReceiptPdfCopy;
  className?: string;
};
```

**The empty-vs-absent tax convention (`decisions.md` Q10) needs a named
discriminator, not just an optional type.** `taxLine?: ReactNode` alone is
ambiguous: `ReactNode` itself includes `undefined`, so both of the obvious
implementations — `taxLine && <Row>{taxLine}</Row>` and `taxLine !==
undefined` — collapse SC-25's two states (prop withheld: no row; prop
supplied with empty content: a blank row) into one. The actual mechanism is
**key presence**: `InvoicePdf` and `ReceiptPdf` check `"taxLine" in props`
(and `"issuerTaxDetails" in props`), not the value. A consumer who writes
`taxLine={maybeUndefinedValue}` has *supplied* the key either way — that is
the one deliberate difference from `insurance`, `replacedBy`, and
`supersededInvoice`, which stay `!== undefined` checks, because nothing in
`spec.md` reserves an empty-but-present state for them the way SC-25 reserves
one for the tax line and (by the same rule, SC-15/SC-30) for
`issuerTaxDetails`.

**`manuallySettled` stays a `boolean`, the one prop that is not `ReactNode`
and not presence-gated.** The requirement is explicit that `false` and
"not supplied" both mean no mark (SC-10 gives it `false`, not an absent key),
which a presence-gated `ReactNode` cannot express — passing `false` would
still be a supplied key. The `boolean` gates a component-owned visual
treatment (an icon, a badge, a border), and its own text comes from
`copy.manuallySettledLabel`, the same split every other label in this
contract already makes between content and label.

**The Grade10 wordmark is rendered internally, not a prop.** `G10LogoMono`
(`@grade10/design-system`) is a graphic brand mark, not localizable text — no
`spec.md` requirement names it, and it is the same on every document. It is
component-owned the same way `manuallySettled`'s visual treatment is, so it
carries no prop.

**One order-value shape, not two.** `OrderValueLines` is a single type used
by both `InvoicePdfProps.orderValue` and `ReceiptPdfProps.orderValue`,
deliberately, not split per component. The requirement this satisfies is
titled "ReceiptPdf renders its order-value lines in the same fixed order as
InvoicePdf's," and its body states "the Feature set carries one order-value
shape for both documents" — the coupling this type enforces *is* the
requirement, not a risk to mitigate. `decisions.md` Q9 (deltas scope per
requirement, not per capability) is about which change can add a requirement
to which document, not about the two documents' shapes being independent;
nothing in `spec.md` asks for them to diverge, and SC-21 forbids it. Rejected:
`InvoicePdfOrderValue`/`ReceiptPdfOrderValue` as two separate types built from
a private shared base — rejected because it would let `tsc` accept a state
SC-21 explicitly forbids.

**Reuse over rebuild, reshaped.** `pdf-document.tsx`'s pieces are lifted from
`apps/preview/src/pages/winner-order-pdf.story-shared.tsx`, composing
`@grade10/design-system`'s `Divider`, `Text`, `HStack`, `VStack` exactly as
the sketch already proved out over five commits on this branch — but not
verbatim. The sketch's `MultiColumnTable` takes `rows: string[][]` and keys
each row by `row.join("|")`; this contract's cells are `ReactNode`, which
cannot be joined into a string key (every row would stringify to
`[object Object]` and collide). Both this contract's tables are exactly two
columns in one fixed order over named keys, so `pdf-document.tsx` carries a
smaller `ValueRow({ label, value }: { label: ReactNode; value: ReactNode })`
instead, with `OrderValueLines` and `PaymentBreakdown` each mapped from their
own named keys in `invoice-pdf.tsx`/`receipt-pdf.tsx` — the header row is
written twice (once per document) rather than once, a deliberate trade for
dropping the generic table's column/alignment machinery this contract never
varies. `Divider` is not one of `pdf-document.tsx`'s pieces — each document
file imports it directly from `@grade10/design-system`, the same as every
other block does, rather than laundering a primitive through a private
module that does not own it.

**The sheet frame's root names which document it is.** `PdfSheet` takes a
`slot: "invoice-pdf" | "receipt-pdf"` prop and renders it as the root
`data-slot`, since the frame itself is shared: without it, `InvoicePdf`'s and
`ReceiptPdf`'s root elements would carry the identical, unaddressable
`data-slot`. The pieces inside the frame (`MetaRow`, `PartyBlock`, `ValueRow`,
`SummaryRow`, `LotHeading`) keep a plain `pdf-`-prefixed slot each, since they
are genuinely owned by `pdf-document.tsx` and rendered identically by both
documents — a per-component prefix on them would misname where the markup
actually lives.

**Failure is not handled — it propagates.** Neither component adds an error
boundary or a fallback. A `ReactNode` prop that throws when rendered
propagates to the consumer's own boundary; a missing required prop is a
`tsc` failure at the call site, never a silent runtime default. This is
distinct from SC-28 (no *fetch* loading/error state, since neither component
fetches anything) — this is about a broken value the consumer already gave
it, which fails loudly rather than rendering a blank total.

## Risks / Trade-offs

- **[Risk]** A consumer misreads "supplied" as "truthy" and writes
  `taxLine={value || undefined}`, silently turning SC-25's blank-row case back
  into a withheld one. → **Mitigation:** the discriminator is named in this
  document and repeated as a comment beside `taxLine`/`issuerTaxDetails` in
  `types.ts`; `invoice-pdf.stories.tsx` carries a
  `WithEmptyTaxLine` story (see the `Invoice And Receipt Pdf/InvoicePdf`
  title convention below) with a `play` function asserting the row renders
  with empty content when the key is present, distinct from a story that
  omits the key entirely and asserts no row at all.
- **[Risk]** `apps/preview`'s sketch has diverged slightly from `spec.md`'s
  reconciled requirements during this change's own drafting: it still carries
  a `TAX_RATE = 0.09` constant and a `formatAmount` helper, both of which
  SC-16 (no computation) and SC-26 (no reformatting) forbid inside the
  component. → **Mitigation:** neither is lifted into `pdf-document.tsx` —
  every amount and the tax row's content arrive as props; the constant and
  the formatter, if kept at all, stay in the story file as sample-data
  helpers, never inside the exported components.

## Migration Plan

1. Add the `invoice-and-receipt-pdf` block, its stories, and the
   `vitest.config.ts` include-list edit to `@grade10/ui` (this repository).
   No consumer is broken by this step: nothing imports it yet.
2. Retire `apps/preview`'s sketch, replacing its three files with pages that
   compose the real `InvoicePdf`/`ReceiptPdf` and sample props (this
   repository).
3. `grade10` bumps its `external/grade10-spec` submodule SHA past this
   change's landing, then imports `InvoicePdf`/`ReceiptPdf` from
   `@grade10/ui` and replaces its placeholder invoice/receipt PDF rendering,
   wiring real order data through `shared/money-amounts`-formatted `ReactNode`
   props and its own `@grade10/i18n` catalog for `copy`. That step is
   `grade10`'s own task, named in `tasks.md`'s impact but not built in this
   repository — see `proposal.md`'s Impact table.

No rollback beyond a normal revert applies: steps 1–2 add and rename files in
this repository only, and step 3 is an ordinary application-side dependency
bump `grade10` can defer or revert independently.

## Open Questions

None. Every question this design turns on is already settled by `decisions.md`
(Q1–Q10) or reserved as an unshaped `ReactNode` slot by design (the tax line,
the issuer tax-details block) — neither changes this approach, the specs, or
the task breakdown if answered later; both just fill an already-typed prop.
