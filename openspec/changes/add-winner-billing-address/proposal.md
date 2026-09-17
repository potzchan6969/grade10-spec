**Author:** @jeffffej0909 - 2026-09-17

## Why

A winner's invoice and receipt carry no billing address. A collector who buys
through a company, or pays from a different address than the one the card
ships to, cannot use the documents for their own records. The auction-won and
setup-reminder letters already name a billing address among the setup steps,
yet Winner Order never asks for one.

**Metric:** invoices sent with a billing address, over invoices sent — the
target is every invoice. **Second signal:** sends refused for a missing
billing address, which should fall to zero once orders confirmed before this
change are cleared.

## What Changes

- **BREAKING — Order setup asks for a billing address.** It is confirmed with
  the delivery address and the payment method, inside the same 48 hours.
  Use same details for billing address is ticked by default; unticking it
  asks for a saved address or a one-time one, with the same required fields.
  This reverses `add-my-auction-orders`' rule that the form offers no billing
  address.
- **The billing address locks on confirming.** It follows the delivery
  address: an operator edits it with a reason before send, and reissues after.
- **Invoice and receipt show Bill To and Ship To.** Both come from the
  order's snapshot. A receipt shows the addresses of the invoice it pays and
  never changes afterwards.
- **An invoice is never sent without a billing address.** Send is refused
  and names what is missing; the operator adds it with the edit before send.
  Recording an address by phone asks for billing too, same as delivery by
  default.
- **One address book.** A billing address is picked from the same five saved
  addresses; there is no separate billing book and no second cap.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

### Modified Capabilities

- `grade10-site/auction/winner-order`: order setup takes a billing address;
  the invoice and receipt show Bill To and Ship To.
- `grade10-admin/auction/post-sale`: the quote shows the billing address, send
  is refused without one, and the edit before send and the phone record carry
  it.
- `shared/ui/auction-order`: the address form block offers the billing
  checkbox and a second address — the export affected is the address-form
  block `add-my-auction-orders` introduces; the consumer is grade10-site.

## Impact

- **Sequencing** — archives after `add-my-auction-orders` and
  `add-winner-bank-transfer`, whose Winner Order and Post-Sale requirements
  this change's deltas build on; archiving it first would revert them.
- **Consumer apps** — grade10-site (Winner Order form, invoice and receipt
  PDFs), grade10-admin (quote, send, edit before send, phone record).
- **Letters** — the auction-won and setup-reminder letters from
  `add-winner-setup-overdue-mail` already name a billing address; this change
  makes the page match them.

## Open Questions

- ❓ **Postal Code in Hong Kong** — already open on Winner Order; it applies
  to the billing form too. Product confirms.

## References

- [Post-Bidding · Winner Order](../../../docs/prds/products/grade10-site/auction/post-bidding.md#winner-order)
- [Auction Management · Payment](../../../docs/prds/products/grade10-admin/auction/management.md#payment)
