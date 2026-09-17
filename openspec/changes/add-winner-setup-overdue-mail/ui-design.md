## The design reference

| Leg | Used here |
| --- | --- |
| Storybook / React Email preview | `pnpm email:dev` — paths in Screens |
| `packages/design-system` | Email theme via `grade10Theme` / emailcn in `apps/emails` |
| `packages/ui` | None — order letters are React Email, not site blocks |
| `packages/i18n` | Production copy keys are application work; drafts hold English preview strings |

## Screens

Email surfaces — no Figma frame. Preview is the layout source.

### Auction won

- Preview: `/preview/auction/order/auction-won`

### Setup reminder (first)

- Preview: `/preview/auction/order/setup-reminder`

### Setup reminder (second)

- Preview: `/preview/auction/order/setup-reminder-second`

### Setup overdue

- Preview: `/preview/auction/order/setup-overdue`

### Payment overdue

- Preview: `/preview/auction/order/payment-overdue`

## Components

| Piece | Where |
| --- | --- |
| `AuctionLetter` | `apps/emails/emails/auction/_components/auction-letter.tsx` — body, `points`, `afterPoints`, `morePoints` |
| `LotBlock` | `apps/emails/emails/auction/_components/lot-block.tsx` |
| Campaign tags | `setup_reminder`, `setup_overdue`, `payment_overdue` in `campaign-tags.ts` |
| Fixture | `previewLot.setupFields`, `setupDeadline`, `contactUrl` |

**Missing in this repo (flag for tasks):** application i18n keys and send wiring for the new letter kinds — not email draft work.

## States

- Auction-won with setup bullets and Confirm by — `winner-order-US-01`
- Setup reminder first (24h) while setup incomplete — `winner-order-US-01`
- Setup reminder second (72h) while setup incomplete — `winner-order-US-01`
- Setup overdue: Contact Us primary, View order secondary, consequence bullets, no setup field list — `winner-order-US-07`
- Payment overdue: amount owed, Contact Us primary, View order secondary, consequence bullets — `winner-order-US-05`
