# UI design

Storybook workbench under `apps/preview` is the layout source for collector
identifier chrome this change adds. No Figma frames for this pass.

**Out of scope for this file:** grade10-admin listing surfaces; catalogue,
search and watchlist absence for called-off lots (`grade10-site-auction-lot-status-US-02`)
— routing and browse rules stay in the lot-status / listing-page deltas, not
new chrome here.

Rail layout for View Bank Details inherits
`add-winner-how-to-pay-rails/ui-design.md`. Email Grade10 shell inherits
`archive/2026-09-21-add-winner-contact-email/ui-design.md`. This file records
only the identifier deltas.

Behaviour stays in the capability deltas. This file maps surfaces and
states — it does not restate requirements.

## The design reference

| Leg | Where |
| --- | --- |
| Storybook | `My Auctions/Winner Order/Payment/View Bank Details`; `My Auctions/Winner Order/Email Grade10`; auction lot details |
| `packages/design-system` | `Dialog`, `DialogSubtext`, and the primitives how-to-pay / contact-email already compose |
| Preview | `winner-order-how-to-pay-dialog.tsx`; `winner-order-contact-dialog.tsx`; `email-grade10.stories.tsx` |
| `packages/i18n` | Catalog work when `grade10-site` wires; preview holds English stand-ins |

## Screens

### Winner Order — View Bank Details

Storybook: `My Auctions/Winner Order/Payment/View Bank Details`.

**Delta:** `DialogSubtext` shows **Invoice:** plus the order's invoice ID
(e.g. `Invoice: IN-LK42301`) instead of the former transfer-method
instruction. The payment-reference band shows the listing code unchanged
(e.g. `LK423`). Rails, amount due, tabs, footer, and their no-Copy detail rows
stay as `add-winner-how-to-pay-rails` settles them.

### Winner Order — Email Grade10

Storybook: `My Auctions/Winner Order/Email Grade10`.

**Delta:** when an invoice exists, subject and body quote the new invoice ID
shape (`IN-LK42301`). Setup overdue still quotes the lot title. Dialog chrome
unchanged from contact-email.

### Public listing page

Storybook: auction lot details.

**Delta:** no labelled listing code on the page; lower-case code only as the
canonical URL suffix. Fresh metadata omits a separate code.

**No new Order summary chrome** this pass for invoice ID or payment reference
on the page shell (card winners keep invoice ID via Email Grade10 and the
invoice PDF).

## Components

| Export | Package | Role |
| --- | --- | --- |
| `Dialog`, `DialogHeader`, `DialogTitle`, `DialogSubtext`, `DialogBody`, `DialogFooter`, `DialogClose` | `@grade10/design-system` | View Bank Details shell (inherited) |
| `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` | `@grade10/design-system` | Rails (inherited; unchanged) |
| `Alert`, `Text`, `Button` | `@grade10/design-system` | OUR note, field rhythm, Done (inherited) |
| Preview `WinnerOrderHowToPayDialog` | `apps/preview` | Assembly — not a published export |
| Preview `WinnerOrderContactDialog` | `apps/preview` | Email Grade10 — not a published export |

**Missing work for preview / `tasks.md`:** add an `invoiceId` prop to
`WinnerOrderHowToPayDialog` and render it as `DialogSubtext` (today the
subtext is hard-coded instruction copy). Keep `transferReference` = listing
code (`LK423`). i18n keys when `grade10-site` wires.

No new design-system primitive. No new `@grade10/ui` export.

## States

### Winner Order — View Bank Details

| State | Shows | Anchor |
| --- | --- | --- |
| Open with invoice ID | Subtext `Invoice: {invoice ID}`; payment-reference band is the listing code; bank-detail rails remain as settled | `winner-order-SC-114` |

### Winner Order — Email Grade10

| State | Shows | Anchor |
| --- | --- | --- |
| Payment overdue | Subject `Auction order {invoice ID}: payment overdue` | `winner-order-SC-165` |
| Setup overdue | Subject quotes lot title; no invoice ID | `winner-order-SC-164` |
| Partial payment | Subject quotes invoice ID; receipt ids in body | `winner-order-SC-166` |

### Public listing page

| State | Shows | Anchor |
| --- | --- | --- |
| Published lot | Title and URL; no labelled listing code on the page | `grade10-site-auction-listing-page-SC-25` |
