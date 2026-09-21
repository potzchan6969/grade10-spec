## Goals

- Give collectors and operators stable references for a lot, winner order,
  invoice, receipts and bank transfer.
- Keep internal database IDs, audit numbers and provider references out of
  collector-facing surfaces.
- Make bank references short, copyable and safe for the supported payment
  channels.
- Let reconciliation match a Stripe transaction to the Grade10 payment
  reference code without exposing the provider transaction ID.
- Let generated payment documents retain the Stripe-supplied provider
  reference without making it a public identifier.

## Non-Goals

- Replacing internal primary keys, audit numbers or provider transaction IDs.
- Deciding formal tax-receipt content or provider transaction ID formats.
- Revealing platform-wide volume, account identity or bidder identity through a
  public identifier.
- Implementing the API, database allocation, migration, PDF templates or UI
  blocks in this PM proposal.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Should public identifiers be opaque and stable for the record's life, or should they expose internal sequential IDs? | Confirmed by the author: use opaque stable identifiers allocated once for a listing/order and never derived from an internal database key; PM and Finance will receive the confirmation offline | Exposing database IDs or a global sequence would make references brittle and reveal platform volume. |
| Q2 | What listing identifier should collectors, support and finance quote? | Confirmed by the author: use a listing code with a fixed `L` prefix and the Crockford Base32 payload charset `0123456789ABCDEFGHJKMNPQRSTVWXYZ`; the code as a whole contains letters and digits. Allocate it when the listing is created, store it in a unique-constrained column, and never reuse it unless the record is deleted entirely. The proposal's format example is `L9482`; PM and Finance still confirm the payload length | Reusing the internal listing UUID or a date-plus-global sequence is harder to quote and leaks implementation or volume. A uniqueness constraint makes a collision a failed creation rather than a duplicate public reference. |
| Q3 | What public winner-order format should support and operator surfaces use? | Confirmed by the author: use `ORD-[LISTING_CODE]`, for example `ORD-L9482`, allocated when a lot closes with a winner and stable through cancellation, payment, refund and relisting | Deriving an order identifier from a database key would make related records harder to recognize and support. |
| Q4 | What invoice format should remain readable while distinguishing reissues? | Confirmed by the author: use `INV-[YYYYMM]-[LISTING_CODE]-[REVISION]`, start `REVISION` at `01`, increment it on reissue, and derive `YYYYMM` in the Hong Kong timezone; for example, `INV-202609-L9482-01` | A raw database key is not readable; an invoice ID without a revision cannot distinguish reissues. |
| Q5 | What payment reference should be used in FPS, local bank transfer and SWIFT notes? | Confirmed by the author: use a hyphen-free Grade10 payment reference code, for example `L948201`, and write the same value to Stripe transaction metadata under `payment_reference_code`; Stripe supplies a separate provider reference after payment creation or confirmation | A hyphenated or longer invoice ID can be rejected, truncated or mistyped in banking applications. Treating a Stripe provider ID as the bank-facing code would make the payment instruction long, provider-specific and unsuitable for manual matching. |
| Q6 | Which values may appear on collector surfaces? | ❓ PM and Finance - recommended: public listing, order, invoice, receipt and payment-reference IDs only; internal IDs, audit numbers, Stripe transaction IDs and other provider references remain operator-only | Showing every system key makes support and privacy worse, and offers no collector value. |
| Q7 | When should the proposal become a checkable requirement? | ❓ PM and Finance - recommended: after the format, character alphabet, allocation, reissue, receipt sequencing, retention and collision rules are confirmed | Guessing those rules now would turn a PM proposal into an unapproved API and migration contract. |
| Q8 | How should receipts identify multiple payments when invoices can be reissued? | Confirmed by the author: anchor receipts to the stable order, not the invoice, using `REC-[YYYYMM]-[ORDER_ID]-P[n]-R[m]`; for example, `REC-202609-ORD-L9482-P1-R1` is the first partial receipt, `REC-202609-ORD-L9482-P2-R1` is the final settlement receipt, and `REC-202609-ORD-L9482-P1-R2` is a later refund or reversal revision of the first payment; `P[n]` follows payment sequence and `R[m]` follows receipt revision | An invoice-anchored receipt would need a new document identity when an invoice is reissued, making one order's payment history harder to reconcile. |
| Q9 | Which payment reference belongs in Stripe and in generated document filenames? | Confirmed by the author: write the Grade10 payment reference code to Stripe metadata under `payment_reference_code`; obtain Stripe's provider reference from the returned payment object and pass it into subsequent internal invoice, receipt and refund document filenames | Generating a provider-looking reference in Grade10 would duplicate Stripe's identity and could disagree with the PaymentIntent, Charge or Refund returned by Stripe. |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| <!-- blind suite has not run; this proposal is waiting for PM and Finance confirmation --> | <!-- none yet --> | <!-- none yet --> |
