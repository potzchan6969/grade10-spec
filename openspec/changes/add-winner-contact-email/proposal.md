**Author:** @tangconst - 2026-09-18

## Why

A winner whose self-service has closed — setup overdue, payment overdue,
partially paid — is told to Contact Us, but the control only names an
address. Customer support still has to ask which order it is, and a tap
that opens a mail client fails for collectors who send from Gmail or
Outlook in the browser.

**Metric:** share of winner-initiated emails to Grade10 whose subject
already names the invoice or the lot, so CS can open the order without a
follow-up.

## What Changes

- **Contact Us copies a ready email.** On Winner Order the button opens a
  dialog: To `support@grade10.com`, a subject that names the invoice or the
  lot, and a short body with those facts. Copy Message is first; Open Mail
  App is second and optional.
- **Letters use the same ready email.** Overdue, cancelled and delivered
  Contact Us CTAs prefill that subject and body, and the letter names
  `support@grade10.com` so a collector without a mail client still has the
  address.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/winner-order`: Contact Us on a locked order opens
  the copy-first ready email, not a toast and not a mail client.
- `grade10-site/auction/notifications-order`: Contact Us on overdue,
  cancelled and delivered letters is the same ready email, and the letter
  names the address.

## Impact

| Consumer | Change |
| --- | --- |
| `apps/frontend/grade10` | Winner Order Contact Us opens the copy-first dialog; letter `contactUrl`s carry subject and body. |
| `apps/preview` | Winner Order Contact Us dialog on setup overdue, payment overdue and partially paid. |
| `apps/emails` | Overdue, cancelled and delivered (and the partial-payment draft) Contact Us mailto includes subject and body; the letter names `support@grade10.com`. |
| `@grade10/ui`, `@grade10/design-system` | New `Textarea` export for the Message field; Dialog, IconButton and Button already exist. |
| `@grade10/i18n` | Sheet copy is catalog work at delivery; preview holds English drafts. |

## Ordering and dependencies

Does not fold into `add-winner-bank-transfer` or `add-winner-partial-payment`.
Those changes already require the Contact Us control; this one names what
it does. Cancelled Contact Us on Winner Order stays with
`refine-auction-order-cancellation`; this change supplies the destination
those letters already use.

## References

- [Post-Bidding · Winner Order](../../../docs/prds/products/grade10-site/auction/post-bidding.md#winner-order)
- [Post-Bidding · Letters](../../../docs/prds/products/grade10-site/auction/post-bidding.md#letters)
