# UI design

Two design references for this change: React Email under `apps/emails` for
the order letters, and the Storybook workbench under `apps/preview` for
Winner Order payment and proof surfaces. No Figma frames yet for bank-transfer
Winner Order; Storybook is the layout source until frames land.

Behaviour stays in the capability specs. This file maps surfaces and states —
it does not restate requirements.

## Screens

### Order notification letters

Shared composition: `AuctionLetter` → `LotBlock` + `PrimaryCta` +
`Grade10EmailShell`. Order letters pass Winner Order as the lot image/title
destination.

| Surface | Preview path |
| --- | --- |
| Payment reminder (first — invoice sent) | `/preview/auction/order/payment-reminder` |
| Payment reminder (day 3 after send) | `/preview/auction/order/payment-reminder-day-three` |
| Payment reminder (day 6 after send) | `/preview/auction/order/payment-reminder-day-six` |
| Final notice (24 hours before deadline) | `/preview/auction/order/payment-reminder-final` |
| Payment received | `/preview/auction/order/payment-received` |
| Auction won | `/preview/auction/order/auction-won` |
| Address reminder (first / second) | `/preview/auction/order/address-reminder`, `…/address-reminder-second` |
| Shipped | `/preview/auction/order/order-shipped` |

`invoice-sent` is retired as a preview and campaign; its content is the first
payment-reminder urgency.

### Winner Order — Payment

Storybook: `My Auctions/Winner Order/Payment` in
`apps/preview/src/pages/winner-order.payment.stories.tsx`. Preview-only page
assembly — not a published `@grade10/ui` export.

### Winner Order — Submit Payment Proof

Storybook: `My Auctions/Winner Order/Payment/Submit Payment Proof` in
`apps/preview/src/pages/submit-payment-proof.stories.tsx` (standalone dialog)
and the page flow `Submit Bank Payment Proof` under Payment.

### Winner Order — Delivery (bank transfer paid)

Storybook: `My Auctions/Winner Order/Delivery` —
`Processing Bank Transfer` in
`apps/preview/src/pages/winner-order.delivery.stories.tsx`.

### FileDropzone (design-system primitive)

Storybook: `Components/FileDropzone` in
`packages/design-system/src/components/forms/file-dropzone.stories.tsx`.
Figma component set and Code Connect are TBC.

## Components

### Letters

- `AuctionLetter`, `LotBlock`, `PrimaryCta`, `Grade10EmailShell` under
  `apps/emails` — no new design-system primitive
- Campaign tag `payment_reminder` for send / day 3 / day 6 / final notice
  drafts today; a dedicated final-notice tag is optional at delivery
- Copy for new letter strings is `@grade10/i18n` catalog work at delivery —
  templates hold English draft props today

### Winner Order payment surface

- **Existing primitives:** `Card`, `Alert`, `Stepper`, `Step`, `Text`,
  `Button`, `Link`, `IconButton`, `TextInput`, `Dialog` (+ header / body /
  footer), `Toast`, `HStack`, `VStack`
- **New design-system primitive:** `FileDropzone`, `FileDropzoneTarget`,
  `FileDropzoneFileList` from `@grade10/design-system/components/forms/file-dropzone` —
  work in this store; consumers pass all copy through props; Figma set TBC
- Preview-only dialogs (not published exports):
  `WinnerOrderPaymentProofDialog`, `WinnerOrderSetupDialog` under
  `apps/preview/src/pages/`

## States

### Order notification letters

| State | Anchor |
| --- | --- |
| Payment reminder at send: invoice total, Pay by, CTA View invoice and pay | Post-close letters / payment-reminder (first) |
| Payment reminder day 3 after send: escalated unpaid copy | same |
| Payment reminder day 6 after send: further escalated unpaid copy | same |
| Final notice 24h before deadline: last-chance copy while Pay still offered | Final notice |
| Payment received (card): Payment method → brand + masked digits; Received {date}; quiet Receipt ID; amount paid | `winner-order-US-01` / payment-received letter |
| Payment received (bank transfer): Payment method → Bank Transfer; same Received / Receipt ID / processing body; no bank or account details in the letter | `winner-order-US-09` — letter shape in notifications-order |
| Receipt PDF attached on payment-received only (named by receipt ID) | Receipt in the letter |

### Winner Order — Payment

- Pending Payment (card): Pay with Card; Invoice text link beside Order summary — `winner-order-SC-57`
- Pending Payment (bank transfer): Submit Payment Proof; fee may read Free — `winner-order-SC-111`
- After proof submit: Payment Verifying; payment-method card shows Bank transfer; no Receipt — `winner-order-SC-108`
- Payment Verifying: Payment step current with no pay-by date; Invoice present; Receipt hidden — `winner-order-SC-68`
- Expired Invoice: overdue alert with Contact Us; no Pay CTA — **Out of suite:** Storybook `Expired Invoice` under Payment
- Paid Processing (card): Visa + mask; Invoice beside summary; Receipt under payment-method card — `winner-order-SC-67`
- Processing Bank Transfer: Bank transfer card, no mask; fee may read Free; Invoice + Receipt — `winner-order-SC-67`

### Winner Order — Submit Payment Proof

- Form open with bank details and copy for account, amount, and reference — `winner-order-SC-128`
- Copy amount due / copy reference: success toast and check icon — **Out of suite:** Storybook `Copy amount due` / `Copy reference`
- Successful submit reaches Payment Verifying — `winner-order-SC-108`
- Leave with draft or while submitting: confirm abandon; in-flight submit does not complete — **Out of suite:** Storybook Submit Payment Proof abandon gate
- HEIC converting disables submit until conversion finishes — **Out of suite:** Storybook FileDropzone converting gate
- Rejected file (too many / too large / wrong type / convert failed): error toast — **Out of suite:** Storybook FileDropzone reject toasts

### FileDropzone

- Idle target with choose-files control — **Out of suite:** Storybook `Components/FileDropzone` Target
- File list with remove — **Out of suite:** Storybook `Components/FileDropzone` File list
- Composed target + list vs combined wrapper — **Out of suite:** Storybook `Components/FileDropzone` Composed / Combined

❓ How the winner asks for a post-complete order setup or method change — still
open on the proposal; not a letter or Winner Order payment state.
