# UI design

React Email under `apps/emails` is the layout source of truth for the order
letters this extension reshapes. Preview: `pnpm email:dev` →
`/preview/auction/order/…`. No Figma frames. Winner Order and post-sale
surfaces for bank transfer settlement remain design work to add when those
screens are drawn; this file covers the letter drafts that already exist.

Behaviour stays in the capability specs. This file maps letter surfaces and
states — it does not restate requirements.

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

## Components

- `AuctionLetter`, `LotBlock`, `PrimaryCta`, `Grade10EmailShell` under
  `apps/emails` — no new design-system primitive or `@grade10/ui` export
- Campaign tag `payment_reminder` for send / day 3 / day 6 / final notice
  drafts today; a dedicated final-notice tag is optional at delivery
- Copy for new letter strings is `@grade10/i18n` catalog work at delivery —
  templates hold English draft props today

## States

| State | Anchor |
| --- | --- |
| Payment reminder at send: invoice total, Pay by, CTA View invoice and pay | Post-close letters / payment-reminder (first) |
| Payment reminder day 3 after send: escalated unpaid copy | same |
| Payment reminder day 6 after send: further escalated unpaid copy | same |
| Final notice 24h before deadline: last-chance copy while Pay still offered | Final notice |
| Payment received (card): Payment method → brand + masked digits; Received {date}; quiet Receipt ID; amount paid | `winner-order-US-01` / payment-received letter |
| Payment received (bank transfer): Payment method → Bank Transfer; same Received / Receipt ID / processing body; no bank or account details in the letter | `winner-order-US-09` once folded — letter shape in notifications-order |
| Receipt PDF attached on payment-received only (named by receipt ID) | Receipt in the letter |

❓ How the winner asks for a post-confirm address or method change — still
open on the proposal; not a letter state.
