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
| Q2 | What listing identifier should collectors, support and finance quote? | Superseded by Q12 — see below | (see Q12) |
| Q3 | Should the winner-order carry a separate public order ID distinct from the payment reference? | Superseded by Q11 — see below | (see Q11) |
| Q4 | What invoice format should remain readable while distinguishing reissues? | Superseded by Q11 — see below | (see Q11) |
| Q5 | What payment reference should be used in FPS, local bank transfer and SWIFT notes? | Superseded by Q11 — see below | (see Q11) |
| Q6 | Which values may appear on collector surfaces? | ❓ PM and Finance - recommended: the payment-reference, invoice and receipt IDs only, and only once a winner's order exists — a lot with no winner shows only its title. The listing code itself is admin-only per Q10; internal IDs, audit numbers, Stripe transaction IDs and other provider references remain operator-only | Showing every system key makes support and privacy worse, and offers no collector value. |
| Q7 | When should the proposal become a checkable requirement? | ❓ PM and Finance - recommended: after the format, character alphabet, allocation, reissue, receipt sequencing, retention and collision rules are confirmed | Guessing those rules now would turn a PM proposal into an unapproved API and migration contract. |
| Q8 | How should receipts identify multiple payments when invoices can be reissued? | Superseded by Q11 — see below | (see Q11) |
| Q9 | Which payment reference belongs in Stripe and in generated document filenames? | Confirmed by the author: write the Grade10 payment reference code to Stripe metadata under `payment_reference_code`; obtain Stripe's provider reference from the returned payment object and pass it into subsequent internal invoice, receipt and refund document filenames | Generating a provider-looking reference in Grade10 would duplicate Stripe's identity and could disagree with the PaymentIntent, Charge or Refund returned by Stripe. |
| Q10 | Should auction lots display an auction ID in the UI, or are they referred to by their titles? | Confirmed by the author: no auction ID (listing code) is displayed anywhere on grade10-site's public listing pages; auction lots are always referred to by their titles there. The listing code is shown on the grade10-admin listing screens, where operators read it to act on a support, finance or reconciliation request that quotes it | Showing the listing code on the public listing page would expose an implementation detail and complicate the collector's experience; lots are self-identified by their title there. Operators need the code visible somewhere to act on it, and the admin listing screens are where they already work a listing. |
| Q11 | Following Q10, with no auction ID shown and no separate public order ID either, what is the winner's one collector-facing reference, and how do invoice and receipt IDs derive from it? | Superseded by Q12 — see below | (see Q12) |
| Q12 | Following Q10 (listing code shown on grade10-admin, never on the public listing page) and Q11 (a payment reference standing in for the order ID), should the listing code and the payment reference be the same value, and how do we derive it so it always leads with 2 letters? | Confirmed by the author, revising Q2 and Q11: the listing code *is* the payment reference — one 5-character Crockford Base32 code per listing, with no fixed prefix, allocated when the listing is created (not when a lot closes with a winner) and carried forward as the payment reference once an order exists on that listing. Format: the first 2 characters are drawn only from the alphabetic subset of the Crockford charset (`ABCDEFGHJKMNPQRSTVWXYZ`, no digits); the remaining 3 characters are drawn from the full 32-character charset. Proposed derivation: run a keyed one-way function (for example HMAC-SHA256 with a server-side secret) over the internal listing ID, take the first 2 output bytes and map each through `byte mod 22` into the 22-letter subset for the leading pair, then take the next 3 output bytes and map each through `byte mod 32` into the full charset for the tail; store the result in a unique-constrained column, and on a collision append a retry salt to the hash input and recompute. Examples: `LK423`, `UY294` | A single unconstrained 5-character draw has no guarantee of a leading letter — a mostly numeric result (for example `48213`) reads like an amount or an internal number rather than a reference code, undermining Q5's reason for using it in bank notes. Splitting the alphabet by position keeps every code letter-led and readable while staying 5 characters. Keeping the listing code and the payment reference as two separate values (the prior Q2/Q11 split) gave collectors and operators two codes for what is functionally one lot-then-order lifecycle, and needed the payment reference to re-derive itself from a different internal key (the order ID) once a winner existed; deriving one code from the listing ID at listing creation removes that handoff. Deriving from the listing ID with a keyed hash, rather than allocating a random value per Q1, keeps the code deterministic and opaque at once — it cannot be reversed to the internal listing ID without the server-side key, so it does not expose the database key or the record's creation order. |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| <!-- blind suite has not run; this proposal is waiting for PM and Finance confirmation --> | <!-- none yet --> | <!-- none yet --> |
