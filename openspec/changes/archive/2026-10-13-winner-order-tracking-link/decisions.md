## Goals

- Make the tracking number on Winner Order the carrier tracking control.
- Keep that link after the order is Delivered.
- Drop the separate Track shipment button and carrier name from Order Progress.

## Non-Goals

- Changing Shipped or Delivered letter CTAs (letters stay as today).
- Changing how operators attach a tracking number in admin.
- Delivery-proof contents or placement.
- Breadcrumb, lot-card end date, or stepper width — preview chrome only.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | What opens carrier tracking on Winner Order? | The tracking number is the external link | Separate Track shipment button |
| Q2 | Show carrier name in Order Progress? | No — number only | Carrier · number row |
| Q3 | Keep the link after Delivered? | Yes — while fulfilment stays `fulfilled` | Hide tracker once delivery is confirmed |
| Q4 | OpenSpec vehicle? | New change `winner-order-tracking-link` | Fold into payment-proof feedback |
| Q5 | Does the tracker revise the winner's retained records? | No - it is a separate live Winner Order presentation requirement; the shipped record's tracker contents are carried by `add-winner-order-tax-line` | Fold the tracker into Records the winner keeps |
| Q6 | What does Winner Order show when the operator recorded no tracker link? | The planning owner (@htonyl): the carrier link comes only from the operator's tracker link; with none, the tracking number is plain text, no carrier name, no Track shipment control. Carried by `Winner Order makes the tracking number the carrier link` | Derive a link from the carrier name or tracking number |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-site/auction/winner-order` | Is Track shipment still a page primary after dispatch? | Q1 |
| `grade10-site/auction/winner-order` | Does Delivered drop the tracker? | Q3 |
