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
| Q3 | Should the winner-order carry a separate public order ID distinct from the payment reference? | Superseded by Q11 — see below | (see Q11) |
| Q4 | What invoice format should remain readable while distinguishing reissues? | Superseded by Q11 — see below | (see Q11) |
| Q5 | What payment reference should be used in FPS, local bank transfer and SWIFT notes? | Superseded by Q11 — see below | (see Q11) |
| Q6 | Which values may appear on collector surfaces? | ❓ PM and Finance - recommended: public listing, payment-reference, invoice and receipt IDs only; internal IDs, audit numbers, Stripe transaction IDs and other provider references remain operator-only | Showing every system key makes support and privacy worse, and offers no collector value. |
| Q7 | When should the proposal become a checkable requirement? | ❓ PM and Finance - recommended: after the format, character alphabet, allocation, reissue, receipt sequencing, retention and collision rules are confirmed | Guessing those rules now would turn a PM proposal into an unapproved API and migration contract. |
| Q8 | How should receipts identify multiple payments when invoices can be reissued? | Superseded by Q11 — see below | (see Q11) |
| Q9 | Which payment reference belongs in Stripe and in generated document filenames? | Confirmed by the author: write the Grade10 payment reference code to Stripe metadata under `payment_reference_code`; obtain Stripe's provider reference from the returned payment object and pass it into subsequent internal invoice, receipt and refund document filenames | Generating a provider-looking reference in Grade10 would duplicate Stripe's identity and could disagree with the PaymentIntent, Charge or Refund returned by Stripe. |
| Q10 | Should auction lots display an auction ID in the UI, or are they referred to by their titles? | Confirmed by the author: no auction ID (listing code) is displayed anywhere on public listing pages; auction lots are always referred to by their titles in the UI. The listing code is for internal support, finance and operator use only | Showing the listing code on the public listing page would expose an implementation detail and complicate the user experience. Lots are self-identified by their title. |
| Q11 | Following Q10, with no auction ID shown and no separate public order ID either, what is the winner's one collector-facing reference, and how do invoice and receipt IDs derive from it? | Confirmed by the author, revising Q3/Q4/Q5/Q8: drop the separate order ID (`ORD-[LISTING_CODE]`) entirely. The payment reference code becomes a standalone 5-character Crockford Base32 value derived from the internal order ID, with no fixed prefix — for example `L9482` or `UY294` — and it is the one public reference a winner quotes for their order (order list, order detail, support, bank notes, Stripe metadata). Invoice ID: `IN-[PAYMENT_REF][SEQ]`, `SEQ` a 2-digit issuance sequence starting `01` and incrementing on reissue — for example `IN-LK42301`, reissued as `IN-LK42302`. Receipt ID: `RC-[INVOICE_PAYLOAD][P][n]`, anchored to the invoice's payment-reference-plus-sequence payload rather than the order or a date — for example `RC-LK42301P1`, then `RC-LK42301P2` for a second receipt against the same invoice (such as completing a partial payment) | Keeping a separate `ORD-[LISTING_CODE]` order ID alongside the payment reference gave a winner two collector-facing codes for the same order, and kept invoice/receipt IDs long (`INV-YYYYMM-LISTING_CODE-REV`, `REC-YYYYMM-ORD-LISTING_CODE-Pn-Rm`). Deriving the payment reference straight from the internal order ID removes the redundant order ID, and building invoice and receipt IDs off that shorter payload shortens both without losing the reissue and multi-receipt distinctions Q4 and Q8 required. Anchoring receipts to the invoice instead of the order is a deliberate reversal of Q8's reasoning: since reissue now advances the invoice's own sequence rather than an order-level revision, an invoice-anchored receipt no longer loses identity on reissue — the next invoice starts its own receipt sequence. |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| <!-- blind suite has not run; this proposal is waiting for PM and Finance confirmation --> | <!-- none yet --> | <!-- none yet --> |
