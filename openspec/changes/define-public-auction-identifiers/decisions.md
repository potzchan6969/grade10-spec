## Goals

- Give collectors and operators stable references for a lot, winner order,
  invoice and bank transfer.
- Keep internal database IDs, audit numbers and provider references out of
  collector-facing surfaces.
- Make bank references short, copyable and safe for the supported payment
  channels.

## Non-Goals

- Replacing internal primary keys, audit numbers or provider transaction IDs.
- Deciding tax, receipt or payment-provider reference formats beyond their
  relationship to the invoice and bank reference.
- Revealing platform-wide volume, account identity or bidder identity through a
  public identifier.
- Implementing the API, database allocation, migration, PDF templates or UI
  blocks in this PM proposal.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Should public identifiers be opaque and stable for the record's life, or should they expose internal sequential IDs? | ❓ PM and Finance - recommended: opaque stable identifiers allocated once for a listing/order and never derived from an internal database key | Exposing database IDs or a global sequence would make references brittle and reveal platform volume. |
| Q2 | What listing identifier should collectors, support and finance quote? | ❓ PM and Finance - recommended: one immutable listing code, `L` plus five uppercase Crockford Base32 characters, for example `LK7P2Q`; it remains separate from the public slug and campaign label | Reusing the internal listing UUID or a date-plus-global sequence is harder to quote and leaks implementation or volume. |
| Q3 | What public winner-order format should support and operator surfaces use? | ❓ PM and Finance - recommended: `ORD-[LISTING_CODE]`, for example `ORD-LK7P2Q`, allocated when a lot closes with a winner and stable through cancellation, payment, refund and relisting | Deriving an order identifier from a database key would make related records harder to recognize and support. |
| Q4 | What invoice format should remain readable while distinguishing reissues? | ❓ PM and Finance - recommended: `INV-[YYYYMM]-[LISTING_CODE]-[REVISION]`, for example `INV-202609-LK7P2Q-01`; a reissue increments `REVISION` and retains the old invoice as replaced | A raw database key is not readable; an invoice ID without a revision cannot distinguish reissues. |
| Q5 | What bank reference should be used in FPS, local bank transfer and SWIFT notes? | ❓ PM and Finance - recommended: the separator-free value `[LISTING_CODE][REVISION]`, for example `LK7P2Q01`, uppercase ASCII and copyable | A hyphenated or longer invoice ID can be rejected, truncated or mistyped in banking applications. |
| Q6 | Which values may appear on collector surfaces? | ❓ PM and Finance - recommended: public listing, order, invoice and bank-reference IDs only; internal IDs, audit numbers and provider references remain operator-only | Showing every system key makes support and privacy worse, and offers no collector value. |
| Q7 | When should the proposal become a checkable requirement? | ❓ PM and Finance - recommended: after the format, character alphabet, allocation, reissue, retention and collision rules are confirmed | Guessing those rules now would turn a PM proposal into an unapproved API and migration contract. |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| <!-- blind suite has not run; this proposal is waiting for PM and Finance confirmation --> | <!-- none yet --> | <!-- none yet --> |
