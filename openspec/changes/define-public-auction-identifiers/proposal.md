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

- Propose one stable, opaque code per listing that doubles as the listing
  code and, once a lot closes with a winner, the payment reference — a
  5-character Crockford Base32 value with no fixed prefix, always leading
  with 2 letters (for example `LK423`, `UY294`). It is allocated when the
  listing is created, stored in a unique-constrained column, and never
  reused, including after deletion. It does not appear
  on grade10-site's public listing pages, where lots are identified by their
  titles; it is shown in both grade10-admin's Listings table and listing detail
  screen to operators with existing listing-admin access, and knowing the code
  cannot grant access to the listing or its private data. It becomes the
  collector-facing payment reference — safe to type into FPS,
  local bank transfer and SWIFT notes — once an order exists on that listing.
  There is no separate public order identifier: this one code is what a
  winner quotes for their order, on order lists, order detail, support
  contact, operator reconciliation and payment instructions.
- Carry the payment reference code into Stripe transaction metadata so
  provider records can be matched during reconciliation without exposing a
  provider transaction ID to the collector.
- Propose an invoice identifier built from the payment reference plus an
  issuance sequence that starts at `01`, uses at least two digits, and
  continues as `100` after `99`, so it remains unique across reissues.
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
| Listing code / payment reference | `LK423` | One code per listing: shown on grade10-admin's listing screens before a winner exists; becomes the winner's payment reference afterward — order lists, order detail, support, FPS/wire/SWIFT notes, Stripe transaction metadata. Never shown on the public listing page, and there is no separate order ID. |
| Public invoice ID | `IN-LK42301` | First invoice issued against payment reference `LK423` |
| Reissued invoice | `IN-LK42302` | Reissue of the invoice above; the issuance sequence increments |
| First payment receipt | `RC-LK42301P1` | First receipt returned against invoice `IN-LK42301` |
| Second payment receipt | `RC-LK42301P2` | Second receipt against the same invoice — for example, the first payment was partial and this completes it |

The listing code / payment reference is a 5-character Crockford Base32 value
with no fixed prefix, always leading with 2 letters — `LK423` and `UY294` are
both valid examples. The first 2 characters are drawn only from the alphabetic
subset of the Crockford charset (`ABCDEFGHJKMNPQRSTVWXYZ`, no digits); the
remaining 3 characters are drawn from the full 32-character charset
`0123456789ABCDEFGHJKMNPQRSTVWXYZ`. It is allocated once, when the listing is
created, and is permanently reserved, including after deletion. One permitted
implementation is a keyed one-way function (for example HMAC-SHA256 with a
server-side secret) over an internal system UUID or listing ID; that 5-character
projection can collide, so allocation must retry against active codes and
retained reservations. It is written to Stripe metadata
under `payment_reference_code` once an order exists, and it is the payload
both the invoice and receipt identifiers are built from:

- Invoice ID: `IN-[CODE][SEQ]`, where `SEQ` is a 2-digit issuance sequence
  starting at `01` and incrementing on each reissue.
- Receipt ID: `RC-[INVOICE_PAYLOAD][P][n]`, where `INVOICE_PAYLOAD` is the
  invoice ID's code-plus-sequence part (for example `LK42301`) and `P[n]` is
  the receipt sequence within that invoice.

Stripe supplies a separate provider reference, such as the returned
PaymentIntent ID; Grade10 stores that reference and uses it in internal
document filenames created after the payment is obtained.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/listing-page`: confirm the listing code / payment
  reference is never shown on the public listing page, which continues to
  identify a lot by its title, without changing the lot's public slug.
- `grade10-admin/auction/listing`: show the listing code on the admin listing
  screens for operator support, finance and reconciliation use.
- `grade10-site/auction/winner-order`: define the payment-reference identifier
  (the listing code carried forward) that stands in for a public order ID,
  plus the invoice and receipt identifiers built from it, and their
  relationship to reissues and payment records.

## Impact

- Winner-order and auction-listing API projections will eventually need
  explicit public identifier fields rather than exposing database IDs.
- Shared order and listing blocks will consume application-supplied display
  identifiers; they will not generate or infer them.
- grade10-admin's listing screens will need a place to display the listing
  code to operators; grade10-site's listing page will not.
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

## Open Questions

A previously cached shared-link preview may persist; Grade10 provides no purge
or regeneration guarantee. The current public page and every fresh metadata
fetch omit the code and private data.

## References

- [Auction Listing · Public listing ID](../../../docs/prds/products/grade10-site/auction/display.md#auction-listing)
- [Post-Bidding](../../../docs/prds/products/grade10-site/auction/post-bidding.md)
