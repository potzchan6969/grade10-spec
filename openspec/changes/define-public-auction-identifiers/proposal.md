**Author:** @htonyl - 2026-09-21

## Why

Collectors and operators currently meet internal auction, order and invoice
keys in places where they need a stable reference they can read, quote and
reconcile. The existing invoice note and winner-order product record establish
some conventions, but they do not yet give PM and Finance one confirmed family
for the lot, winner order, invoice and bank reference; support and payment
matching therefore fall back to implementation identifiers.

The change proposes a public identifier family while keeping internal keys
private. It should reduce support ambiguity and payment-matching errors without
revealing a platform-wide sequential volume. The success measure is the share
of collector and operator surfaces that can identify the same lot and order
with one stable public reference, and the share of bank-transfer proofs matched
without manual identifier clarification.

## What Changes

- Propose a stable, opaque listing code that operators and winner records can
  quote without exposing the internal listing key or global listing volume; it
  does not replace the public lot slug or appear on the public listing page.
- Propose a stable public winner-order identifier for order lists, order detail,
  support contact and operator reconciliation.
- Propose an invoice identifier that remains unique across reissues while
  retaining a human-readable relationship to the billed listing.
- Propose a short bank reference that is safe to type into FPS, local bank
  transfer and SWIFT notes, and that can be copied from the payment surface.
- Keep internal database IDs, gapless audit numbers and provider references
  separate from every collector-facing identifier.
- Record the format recommendations as provisional PM/Finance decisions; the
  requirements remain waiting until PM and Finance confirm the formats and the
  rules for allocation, reissue and retention.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/listing-page`: define the stable listing code associated
  with a published auction listing without changing its public slug.
- `grade10-site/auction/winner-order`: define public winner-order, invoice and
  bank-reference identifiers and their relationship to reissues and payment
  records.

## Impact

- Winner-order and auction-listing API projections will eventually need
  explicit public identifier fields rather than exposing database IDs.
- Shared order and listing blocks will consume application-supplied display
  identifiers; they will not generate or infer them.
- Operator reconciliation, invoice PDFs, payment instructions, support
  messages and bank-transfer proof matching will use the approved public
  values.
- Existing internal IDs, audit numbering and provider references remain
  available to operators and integrations where authorized, but are outside
  the collector-facing format.

## Follow-on changes

- PM and Finance confirmation can unlock the requirements delta, API projection
  work and shared UI adoption for the approved formats.

## References

- [Auction Listing · Public listing ID](../../../docs/prds/products/grade10-site/auction/display.md#auction-listing)
- [Post-Bidding](../../../docs/prds/products/grade10-site/auction/post-bidding.md)
