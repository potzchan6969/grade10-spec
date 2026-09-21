## Goals

- Give collectors and operators stable references for a lot, winner order,
  invoice, receipts and bank transfer.
- Keep internal database IDs, audit numbers and provider references out of
  collector-facing surfaces.
- Make bank references short, copyable and safe for the supported payment
  channels.
- Let reconciliation match a Stripe transaction to the Grade10 payment
  reference code without exposing the provider transaction ID.

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
| Q2 | What listing identifier should collectors, support and finance quote? | ❓ PM and Finance - recommended: one immutable listing code, `L` plus five uppercase Crockford Base32 characters, for example `LK7P2Q`; the author's example `L9482` keeps the `L` prefix but leaves the payload length and alphabet open | Reusing the internal listing UUID or a date-plus-global sequence is harder to quote and leaks implementation or volume. |
| Q3 | What public winner-order format should support and operator surfaces use? | Confirmed by the author: use `ORD-[LISTING_CODE]`, for example `ORD-LK7P2Q`, allocated when a lot closes with a winner and stable through cancellation, payment, refund and relisting | Deriving an order identifier from a database key would make related records harder to recognize and support. |
| Q4 | What invoice format should remain readable while distinguishing reissues? | Confirmed by the author: use `INV-[YYYYMM]-[LISTING_CODE]-[REVISION]`, start `REVISION` at `01`, increment it on reissue, and derive `YYYYMM` in the Hong Kong timezone; for example, `INV-202609-L9482-01` | A raw database key is not readable; an invoice ID without a revision cannot distinguish reissues. |
| Q5 | What payment reference should be used in FPS, local bank transfer and SWIFT notes? | Confirmed by the author: use a hyphen-free payment reference code, for example `L948201`, and write the same value to Stripe transaction metadata under `payment_reference_code`; its listing-code length and alphabet follow Q2 | A hyphenated or longer invoice ID can be rejected, truncated or mistyped in banking applications, while a provider transaction ID is not a collector-safe reconciliation reference. |
| Q6 | Which values may appear on collector surfaces? | ❓ PM and Finance - recommended: public listing, order, invoice, receipt and payment-reference IDs only; internal IDs, audit numbers, Stripe transaction IDs and other provider references remain operator-only | Showing every system key makes support and privacy worse, and offers no collector value. |
| Q7 | When should the proposal become a checkable requirement? | ❓ PM and Finance - recommended: after the format, character alphabet, allocation, reissue, receipt sequencing, retention and collision rules are confirmed | Guessing those rules now would turn a PM proposal into an unapproved API and migration contract. |
| Q8 | How should receipts identify multiple payments against one invoice? | Confirmed by the author: use `REC-[YYYYMM]-[LISTING_CODE]-[REVISION]-P[n]`, for example `REC-202609-L9482-01-P1` for the first partial receipt and `REC-202609-L9482-01-P2` for the final settlement receipt; `P[n]` follows payment sequence | A receipt ID without the invoice revision or payment sequence cannot distinguish reissued invoices or multiple payments. |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| <!-- blind suite has not run; this proposal is waiting for PM and Finance confirmation --> | <!-- none yet --> | <!-- none yet --> |
