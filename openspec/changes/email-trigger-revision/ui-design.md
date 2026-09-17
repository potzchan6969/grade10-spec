# UI design

React Email under `apps/emails` is the layout source for the order letters
this change settles. No Figma frames. Behaviour stays in the capability
specs — this file maps surfaces and states.

## The design reference

| Leg | Where |
| --- | --- |
| React Email preview | `pnpm email:dev` — paths in Screens |
| `packages/design-system` | Email theme via `grade10Theme` / emailcn in `apps/emails` |
| `packages/ui` | None — order letters are React Email, not site blocks |
| `packages/i18n` | Production copy is application work; drafts hold English preview strings |

## Screens

Email surfaces — no Figma frame. Preview is the layout source.

### Delivered

- Preview: `/preview/auction/order/order-delivered`
- Template: `apps/emails/emails/auction/order/order-delivered.tsx`

### Order cancelled

- Preview: `/preview/auction/order/order-cancelled`
- Template: `apps/emails/emails/auction/order/order-cancelled.tsx`

### Payment reminder (reissue)

Reissue uses the same first payment-reminder letter as send — no separate
preview.

- Preview: `/preview/auction/order/payment-reminder` (`urgency: "first"`)
- Template: `apps/emails/emails/auction/order/payment-reminder.tsx`

## Components

| Piece | Where |
| --- | --- |
| `AuctionLetter` | `apps/emails/emails/auction/_components/auction-letter.tsx` |
| `LotBlock` | `apps/emails/emails/auction/_components/lot-block.tsx` |
| `PrimaryCta` | `apps/emails/emails/_components/primary-cta.tsx` |
| `Grade10EmailShell` | `apps/emails/emails/_components/grade10-email-shell.tsx` |
| Campaign tags | `delivered`, `order_cancelled`, `payment_reminder` in `campaign-tags.ts` |
| Fixture | `previewLot.deliveryAddress`, `deliveredAt`, `cancelledAt`, `contactUrl`, `orderUrl` |

No new design-system primitive. No new `@grade10/ui` export.

**Missing in this repo (flag for tasks):** application i18n keys and activating
`delivered` / `order_cancelled` send wiring — owned by `tasks.md` groups 1 and 4,
not new draft work.

## States

### Delivered

| State | Shows | Anchor |
| --- | --- | --- |
| Delivered | Delivery address; Delivered {time}; View order primary; Contact Us secondary; no tracking CTA | `order-mail-SC-41` |

### Order cancelled

| State | Shows | Anchor |
| --- | --- | --- |
| Order cancelled | Cancelled on {time}; no reason; no payment copy; Contact Us primary; View order secondary | `order-mail-SC-42` |

### Payment reminder (reissue)

| State | Shows | Anchor |
| --- | --- | --- |
| Reissue as first reminder | Same first payment-reminder shape as send: total and Pay by …; no separate reissued letter | `order-mail-SC-40` |
