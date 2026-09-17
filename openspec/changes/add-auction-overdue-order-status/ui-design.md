# UI design

Storybook workbench under `apps/preview` is the layout source for overdue
Winner Order and My Auctions Status. No new Figma frames for this pass.

Behaviour stays in the capability specs. This file maps surfaces and states.

## The design reference

| Leg | Where |
| --- | --- |
| Storybook | `My Auctions/Winner Order/Setup` → Expired Setup; `…/Payment` → Expired Invoice; `Pages/My Auctions Page` → Post-auction; `My Auctions/My Auctions` → Post-auction standing |
| `packages/ui` | `AuctionRecord` / `AuctionRecordRow` — Status column + badge tones |
| `packages/i18n` | `shared/*/auctionRecord.json` — `standingColumn`: Status |

## Screens

### Winner Order — Setup Overdue

Storybook: `My Auctions/Winner Order/Setup` → **Expired Setup**
(`awaiting_address_expired`). Contact Us alert; no Complete Order Setup.

### Winner Order — Payment Overdue

Storybook: `My Auctions/Winner Order/Payment` → **Expired Invoice**
(`pending_payment_expired`). Contact Us overdue alert; no Pay CTA.

### My Auctions — Post-auction Status

Storybook: `Pages/My Auctions Page` → **Post-auction** and
`My Auctions/My Auctions` → **Post-auction standing**. Won rows include
Setup Overdue and Payment Overdue; column header **Status**.

## Components

- **Existing:** `Badge` (error tone for Setup Overdue / Payment Overdue),
  `Alert` (warning + Contact Us on Winner Order overdue), `AuctionRecord`,
  `AuctionRecordRow`
- **i18n:** `standingColumn` → Status in en / zh-Hant / zh-Hans / ko
- No new design-system primitive

## States

### Winner Order — Setup

| State | Shows | Anchor |
| --- | --- | --- |
| Awaiting Setup | Complete Order Setup; Confirm by … | `winner-order-US-01` |
| Setup Overdue | Missed setup deadline alert; Contact Us; no Confirm | `winner-order-US-07` |

### Winner Order — Payment

| State | Shows | Anchor |
| --- | --- | --- |
| Pending Payment | Pay CTA; Pay by … | `winner-order-US-01` |
| Payment Overdue | Overdue alert; Contact Us; no Pay | `winner-order-US-05` |

### My Auctions

| State | Shows | Anchor |
| --- | --- | --- |
| Status column | Header reads Status | `grade10-site-auction-account-record-US-08` |
| Won Setup Overdue | Status badge Setup Overdue (error); View order → Expired Setup | `grade10-site-auction-account-record-US-09` |
| Won Payment Overdue | Status badge Payment Overdue (error); View order → Expired Invoice | `grade10-site-auction-account-record-US-09` |
