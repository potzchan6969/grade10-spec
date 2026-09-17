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
- **Alert on Payment Verifying:** `Alert` with `status=default` and a custom
  Hourglass icon (title-only inline); copy through props —
  “We’re verifying your transfer. We’ll email you when payment is confirmed.”
- **New design-system primitive:** `FileDropzone`, `FileDropzoneTarget`,
  `FileDropzoneFileList` from `@grade10/design-system/components/forms/file-dropzone` —
  work in this store; consumers pass all copy through props; Figma set TBC
- **i18n:** verifying Alert title is catalog work at delivery (`shared/` unless
  brand-specific); preview holds English draft props today
- Preview-only dialogs (not published exports):
  `WinnerOrderPaymentProofDialog`, `WinnerOrderSetupDialog` under
  `apps/preview/src/pages/`

## States

### Order notification letters

| State | Shows | Anchor |
| --- | --- | --- |
| Payment reminder at send | Invoice total, Pay by, CTA View invoice and pay | **Out of suite:** email preview `/preview/auction/order/payment-reminder` |
| Payment reminder day 3 | Escalated unpaid copy | **Out of suite:** email preview `/preview/auction/order/payment-reminder-day-three` |
| Payment reminder day 6 | Further escalated unpaid copy | **Out of suite:** email preview `/preview/auction/order/payment-reminder-day-six` |
| Final notice | Last-chance copy while Pay still offered | **Out of suite:** email preview `/preview/auction/order/payment-reminder-final` |
| Payment received (card) | Payment method → brand + masked digits; Received {date}; quiet Receipt ID; amount paid | `winner-order-SC-57` |
| Payment received (bank transfer) | Payment method → Bank Transfer; same Received / Receipt ID / processing body; no bank or account details | `winner-order-SC-108` |
| Receipt PDF on payment-received | Receipt PDF attached, named by receipt ID; only this letter attaches a PDF | **Out of suite:** payment-received letter attach — notifications-order |

### Winner Order — Payment

| State | Shows | Anchor |
| --- | --- | --- |
| Pending Payment (card) | Pay with Card; Invoice text link beside Order summary | `winner-order-SC-57` |
| Pending Payment (bank transfer) | Submit Payment Proof; bank-transfer fee may read Free | `winner-order-SC-111` |
| Payment Verifying | Payment step current with no pay-by date; Invoice link; Receipt hidden; Bank transfer payment-method card; Pay and further uploads hidden | `winner-order-SC-108` |
| Payment Verifying alert | Inline Alert (`status=default`, Hourglass): “We’re verifying your transfer. We’ll email you when payment is confirmed.” Under Order progress below `lg`; under the lot from `lg` up | `winner-order-US-09` |
| Expired Invoice | Overdue alert with Contact Us; no Pay CTA | **Out of suite:** Storybook `Expired Invoice` under Payment |
| Paid Processing (card) | Visa + mask; Invoice beside summary; Receipt under payment-method card | `winner-order-SC-67` |
| Processing Bank Transfer | Bank transfer card, no mask; fee may read Free; Invoice + Receipt | `winner-order-SC-67` |

### Winner Order — Submit Payment Proof

| State | Shows | Anchor |
| --- | --- | --- |
| Form open | Bank details; copy for account, amount, and reference | `winner-order-SC-128` |
| Copy amount / reference | Success toast and check icon on the copy control | **Out of suite:** Storybook `Copy amount due` / `Copy reference` |
| Successful submit | Reaches Payment Verifying on Winner Order | `winner-order-SC-108` |
| Leave with draft or while submitting | Confirm abandon; in-flight submit does not complete | **Out of suite:** Storybook Submit Payment Proof abandon gate |
| HEIC converting | Submit disabled until conversion finishes | **Out of suite:** Storybook FileDropzone converting gate |
| Rejected file | Error toast (too many / too large / wrong type / convert failed) | **Out of suite:** Storybook FileDropzone reject toasts |

### FileDropzone

| State | Shows | Anchor |
| --- | --- | --- |
| Idle target | Choose-files control | **Out of suite:** Storybook `Components/FileDropzone` Target |
| File list with remove | Listed files; remove control | **Out of suite:** Storybook `Components/FileDropzone` File list |
| Composed vs combined | Target + list vs combined wrapper | **Out of suite:** Storybook `Components/FileDropzone` Composed / Combined |

❓ How the winner asks for a post-complete order setup or method change — still
open on the proposal; not a letter or Winner Order payment state.
