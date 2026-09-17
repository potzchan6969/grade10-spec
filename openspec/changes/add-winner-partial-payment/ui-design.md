# UI design

Storybook workbench under `apps/preview` is the layout source for Partially
Paid Winner Order and the My Auctions Partially Paid row. No Figma frames yet
for this pass.

Behaviour stays in the capability specs (`add-winner-partial-payment`
journeys). This file maps surfaces and states — it does not restate
requirements. A new letter kind stays a non-goal; `payment-received-partial`
under `apps/emails` is a draft preview only and is not in this change.

## The design reference

| Leg | Where |
| --- | --- |
| Storybook | `My Auctions/Winner Order/Payment` → Partially Paid; Post-auction My Auctions rows |
| `packages/ui` | `AuctionRecordRow` badge tone `warning` for Partially Paid |
| Preview page | `apps/preview/src/pages/winner-order-page.tsx` — settlement Contact Us alert; Receipt PDF row |

## Screens

### Winner Order — Partially Paid

Storybook: `My Auctions/Winner Order/Payment` → **Partially Paid**.

Locked settlement: no Pay, no pay-by date, Payment step current. Sidebar
warning Alert with Contact Us; no remaining-balance figure. Payment method
shown; Receipt PDF row lists one link per payment (`Receipt · P1`,
`Receipt · P2`, …) in a wrapping row.

### My Auctions — Partially Paid

Won row Status **Partially Paid** (warning badge); subtitle Payment in
progress; View order opens the Partially Paid Winner Order story.

## Components

- **Existing:** `Alert` (`status=warning` — Warning icon), `Badge`, `Link`,
  `HStack` (flex-wrap for receipts), `Card`, `Stepper`
- **i18n:** Partially Paid status label is catalog work at delivery; preview
  holds English draft props today
- No new design-system primitive; no new letter campaign

## States

### Winner Order — Partially Paid

| State | Shows | Anchor |
| --- | --- | --- |
| Partially Paid (locked) | Warning Alert: only part of invoice settled; Contact Us; no balance figure; no Pay | `winner-order-US-12` |
| Receipt PDF row | Wrapping row of Receipt · P1, P2, … oldest first | `winner-order-US-12` |
| Payment method | Bank transfer (or recorded method); Invoice PDF still offered | `winner-order-US-12` |

### My Auctions

| State | Shows | Anchor |
| --- | --- | --- |
| Won Partially Paid | Status Partially Paid (warning); View order | Context: `grade10-site-auction-account-record-US-08` |
