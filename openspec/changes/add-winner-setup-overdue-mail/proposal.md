**Author:** @tangconst - 2026-09-17

Product context: [Order Notifications](../../../docs/prds/products/grade10-site/auction/post-bidding.md#winner-order),
[Winner Order](../../../docs/prds/products/grade10-site/auction/post-bidding.md#winner-order).

## Why

A winner who has not finished order setup, or who lets the payment deadline
pass, currently gets weak or missing mail at the moment self-service ends.
Auction-won and reminders still read as address-only, while setup now also
asks for a payment method and (ahead of the page) a billing address. After
either deadline, the winner needs a clear letter: setup or pay is closed on
the platform, Contact Us is the path, and Grade10 may review a claim by hand
before cancelling or re-listing.

**Metric:** share of overdue orders where the winner contacts Grade10 within
48 hours of the overdue letter. **Second signal:** setup completed inside the
48-hour window after the setup-reminder series.

## What Changes

- **Auction-won asks for order setup**, not address alone: delivery address,
  payment method, and billing address as bullets; CTA Complete Order Setup;
  `Confirm by …`.
- **Address reminder is renamed setup reminder**, sent at **24h** and **72h**
  after lot close while setup is incomplete, with the same setup bullets.
- **Setup overdue** is a new letter when the setup deadline passes: generic
  “order setup” copy (no field list); self-service setup closed; Contact Us
  primary; View order secondary; manual review; penalties or extra charges
  named while durable rules stay open; may cancel and re-list after review;
  no automatic cancel from the letter alone.
- **Payment overdue** replaces **invoice expired** as the letter at payment
  deadline expiry: amount owed; same claim path and consequence bullets;
  Contact Us primary; View order secondary.
- **React Email drafts** under `apps/emails/emails/auction/order/` for the
  series above.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/notifications-order`: setup wording on auction-won;
  setup-reminder cadence and rename; setup-overdue letter; payment-overdue
  letter replacing invoice-expired content and trigger naming.

## Impact

| Consumer | Change |
| --- | --- |
| Notification service | Send setup reminders at 24h/72h; send setup-overdue at setup deadline; send payment-overdue at invoice `expired` (replacing invoice-expired). |
| `apps/emails` | Drafts: auction-won, setup-reminder (± second), setup-overdue, payment-overdue. |
| Winner Order / account | No page requirement in this change; billing address on the page stays open. |
| `add-winner-bank-transfer` | Owns payment-reminder series and payment-received; this change does not rewrite those. |
| `close-overdue-address-confirmation` | Owns form lock and operator reopen; this change does not add a reopen letter. |

## Ordering and dependencies

- May archive beside `add-winner-bank-transfer`; both touch
  `notifications-order` — the later archive must not revert the other's
  letter table rows.
- Does not wait on Winner Order billing-address UI.

## Follow-on changes

- Winner Order collects billing address as part of order setup.
- Durable rules for penalties or extra charges after a missed setup deadline.

## References

- [Post-Bidding · Winner Order](../../../docs/prds/products/grade10-site/auction/post-bidding.md#winner-order)
