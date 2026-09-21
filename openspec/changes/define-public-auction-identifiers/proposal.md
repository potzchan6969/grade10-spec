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
  is allocated when the listing is created, is stored in a unique-constrained
  column, and is never reused unless the listing record is deleted entirely.
  It does not replace the public lot slug or appear on the public listing page.
- Propose a stable public winner-order identifier for order lists, order detail,
  support contact and operator reconciliation.
- Propose an invoice identifier that remains unique across reissues while
  retaining a human-readable relationship to the billed listing.
- Propose a short payment reference code that is safe to type into FPS, local
  bank transfer and SWIFT notes, and that can be copied from the payment
  surface.
- Carry the payment reference code into Stripe transaction metadata so
  provider records can be matched during reconciliation without exposing a
  provider transaction ID to the collector.
- Propose receipt identifiers that distinguish each payment against one
  invoice, including partial-payment and final-settlement receipts.
- Keep internal database IDs, gapless audit numbers and provider references
  separate from every collector-facing identifier.
- Record the format recommendations as provisional PM/Finance decisions; the
  requirements remain waiting until PM and Finance confirm the open listing
  code rules and the rules for allocation, reissue, receipt sequencing and
  retention.

## Examples

| Record | Example | Use |
| --- | --- | --- |
| Public invoice ID | `INV-202609-L9482-01` | Names the invoice month, listing code and revision |
| Payment reference code | `L948201` | Hyphen-free value for FPS, local wire and SWIFT; also written to Stripe transaction metadata |
| First partial receipt | `REC-202609-ORD-L9482-P1-R1` | Identifies the first payment receipt against the stable order |
| Final settlement receipt | `REC-202609-ORD-L9482-P2-R1` | Identifies the payment that settles the stable order |
| Reversal or refund revision | `REC-202609-ORD-L9482-P1-R2` | Revises the receipt for payment sequence `P1` without changing the order or invoice reference |

The listing code uses the Crockford Base32 payload charset
`0123456789ABCDEFGHJKMNPQRSTVWXYZ` with a fixed `L` prefix. The listing code
as a whole contains both letters and digits; `L9482` is the format example
supplied for this proposal. The exact payload length remains a format detail
for PM and Finance to confirm. The Grade10 payment reference is written to
Stripe metadata under `payment_reference_code`. Stripe supplies a separate
provider reference, such as the returned PaymentIntent ID; Grade10 stores that
reference and uses it in internal document filenames created after the payment
is obtained.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/listing-page`: define the stable listing code associated
  with a published auction listing without changing its public slug.
- `grade10-site/auction/winner-order`: define public winner-order, invoice,
  payment-reference and receipt identifiers and their relationship to reissues
  and payment records.

## Impact

- Winner-order and auction-listing API projections will eventually need
  explicit public identifier fields rather than exposing database IDs.
- Shared order and listing blocks will consume application-supplied display
  identifiers; they will not generate or infer them.
- Operator reconciliation, invoice and receipt PDFs, payment instructions,
  support messages and bank-transfer proof matching will use the approved
  public values.
- Stripe transaction metadata will carry the approved Grade10 payment
  reference code for reconciliation.
- The Stripe-supplied provider reference is stored after payment creation or
  confirmation and passed into internal invoice, receipt and refund document
  filenames; it is not a collector-facing identifier.
- Existing internal IDs, audit numbering and provider references remain
  available to operators and integrations where authorized, but are outside
  the collector-facing format.

## Follow-on changes

- PM and Finance confirmation can unlock the requirements delta, API projection
  work and shared UI adoption for the approved formats.

## References

- [Auction Listing · Public listing ID](../../../docs/prds/products/grade10-site/auction/display.md#auction-listing)
- [Post-Bidding](../../../docs/prds/products/grade10-site/auction/post-bidding.md)
