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
  The listing code is a support, finance and operator reference only; it does
  not appear on public listing pages where lots are identified by their titles.
- Propose a payment reference code derived from the internal order ID: a
  5-character Crockford Base32 value with no fixed prefix, for example `L9482`
  or `UY294`. It is allocated when a lot closes with a winner and is safe to
  type into FPS, local bank transfer and SWIFT notes. There is no separate
  public order identifier — the payment reference is the one stable reference
  a winner quotes for their order, on order lists, order detail, support
  contact, operator reconciliation and payment instructions.
- Carry the payment reference code into Stripe transaction metadata so
  provider records can be matched during reconciliation without exposing a
  provider transaction ID to the collector.
- Propose an invoice identifier built from the payment reference plus a
  2-digit issuance sequence, so it stays short while remaining unique across
  reissues.
- Propose receipt identifiers built from the invoice identifier plus a
  receipt sequence, distinguishing each payment returned against one invoice,
  including partial-payment and final-settlement receipts.
- Keep internal database IDs, gapless audit numbers and provider references
  separate from every collector-facing identifier.
- Record the format recommendations as provisional PM/Finance decisions; the
  requirements remain waiting until PM and Finance confirm the open listing
  code rules and the rules for allocation, reissue, receipt sequencing and
  retention.

## Examples

| Record | Example | Use |
| --- | --- | --- |
| Listing code | `L9482` | Internal reference for support, finance and operator reconciliation; never displayed on public listing page |
| Payment reference code | `LK423` | The winner's one stable public reference: order lists, order detail, support, FPS/wire/SWIFT notes, and Stripe transaction metadata. There is no separate public order ID. |
| Public invoice ID | `IN-LK42301` | First invoice issued against payment reference `LK423` |
| Reissued invoice | `IN-LK42302` | Reissue of the invoice above; the issuance sequence increments |
| First payment receipt | `RC-LK42301P1` | First receipt returned against invoice `IN-LK42301` |
| Second payment receipt | `RC-LK42301P2` | Second receipt against the same invoice — for example, the first payment was partial and this completes it |

The listing code uses the Crockford Base32 payload charset
`0123456789ABCDEFGHJKMNPQRSTVWXYZ` with a fixed `L` prefix. The listing code
as a whole contains both letters and digits; `L9482` is the format example
supplied for this proposal. The exact payload length remains a format detail
for PM and Finance to confirm.

The payment reference code is a 5-character Crockford Base32 value derived
from the internal order ID, with no fixed prefix — `L9482` and `UY294` are
both valid examples. It is the one collector-facing identifier for the order;
it is written to Stripe metadata under `payment_reference_code`, and it is
the payload both the invoice and receipt identifiers are built from:

- Invoice ID: `IN-[PAYMENT_REF][SEQ]`, where `SEQ` is a 2-digit issuance
  sequence starting at `01` and incrementing on each reissue.
- Receipt ID: `RC-[INVOICE_PAYLOAD][P][n]`, where `INVOICE_PAYLOAD` is the
  invoice ID's payment-reference-plus-sequence part (for example `LK42301`)
  and `P[n]` is the receipt sequence within that invoice.

Stripe supplies a separate provider reference, such as the returned
PaymentIntent ID; Grade10 stores that reference and uses it in internal
document filenames created after the payment is obtained.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/listing-page`: define the stable listing code associated
  with a published auction listing without changing its public slug.
- `grade10-site/auction/winner-order`: define the payment-reference identifier
  that stands in for a public order ID, plus the invoice and receipt
  identifiers built from it, and their relationship to reissues and payment
  records.

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
