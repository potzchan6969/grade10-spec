## User journeys

### grade10-site-auction-account-record-US-01: Winner opens settlement from My Auctions

**As a** winner,
**I want** every Won row to open Winner Order without helper clutter,
**so that** I can continue settlement without reading contact copy on the table.

**Accepted by:**

- `grade10-site-auction-account-record-SC-22` — A payment problem says how to reach Grade10
- `grade10-site-auction-account-record-SC-47` — A won lot with no address reads Awaiting Address
- `grade10-site-auction-account-record-SC-48` — A confirmed address with no invoice reads Preparing Invoice
- `grade10-site-auction-account-record-SC-49` — Every Won standing offers View order
- `grade10-site-auction-account-record-SC-50` — Didn’t win offers no View order
- `grade10-site-auction-account-record-SC-51` — A Won row carries no secondary helper lines

**Walked by note:** the durable account-record journeys still own open-lot standing; this change journey covers the Storybook Won-entry and calm-row slice.
