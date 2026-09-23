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
| Q1 | Should public identifiers be opaque and stable for the record's life, or should they expose internal sequential IDs? | Confirmed by the author: use opaque stable identifiers allocated once for a listing/order; no public identifier may expose or reversibly encode the internal system identifier. A keyed one-way derivation over an internal system UUID or listing ID remains a permitted implementation choice. PM and Finance will receive the confirmation offline | Exposing database IDs or a global sequence would make references brittle and reveal platform volume. |
| Q2 | What listing identifier should collectors, support and finance quote? | Superseded by Q12 — see below | (see Q12) |
| Q3 | Should the winner-order carry a separate public order ID distinct from the payment reference? | Superseded by Q11 — see below | (see Q11) |
| Q4 | What invoice format should remain readable while distinguishing reissues? | Superseded by Q11 — see below | (see Q11) |
| Q5 | What payment reference should be used in FPS, local bank transfer and SWIFT notes? | Superseded by Q11 — see below | (see Q11) |
| Q6 | Which values may appear on collector surfaces? | Confirmed by the author, following directly from Q9, Q10 and Q12: a collector sees the payment reference (the listing code carried forward once their order exists), the invoice ID and the receipt IDs — and nothing before the order exists, when a lot shows only its title. Internal database IDs, audit numbers, Stripe transaction IDs and other provider references stay operator-only | Showing every system key makes support and privacy worse, and offers no collector value. |
| Q7 | When should the proposal become a checkable requirement? | Confirmed by the author: retain every invoice and its receipts for 7 years from issuance, matching Hong Kong's standard tax/audit record-keeping period; nothing else blocks the requirements delta — format, character alphabet, allocation, reissue, receipt sequencing and collision handling were all confirmed in Q12 | A shorter or indefinite period was not evaluated against Grade10's actual audit obligations; 7 years is the common HK baseline and gives the requirements delta a concrete retention rule to build against rather than none. |
| Q8 | How should receipts identify multiple payments when invoices can be reissued? | Superseded by Q11 — see below | (see Q11) |
| Q9 | Which payment reference belongs in Stripe and in generated document filenames? | Confirmed by the author: write the Grade10 payment reference code to Stripe metadata under `payment_reference_code`; obtain Stripe's provider reference from the returned payment object and pass it into subsequent internal invoice, receipt and refund document filenames | Generating a provider-looking reference in Grade10 would duplicate Stripe's identity and could disagree with the PaymentIntent, Charge or Refund returned by Stripe. |
| Q10 | Should auction lots display an auction ID in the UI, or are they referred to by their titles? | Confirmed by the author: no auction ID (listing code) is displayed anywhere on grade10-site's public listing pages; auction lots are always referred to by their titles there. The listing code is shown on the grade10-admin listing screens, where operators read it to act on a support, finance or reconciliation request that quotes it | Showing the listing code on the public listing page would expose an implementation detail and complicate the collector's experience; lots are self-identified by their title there. Operators need the code visible somewhere to act on it, and the admin listing screens are where they already work a listing. |
| Q11 | Following Q10, with no auction ID shown and no separate public order ID either, what is the winner's one collector-facing reference, and how do invoice and receipt IDs derive from it? | Superseded by Q12 — see below | (see Q12) |
| Q12 | Following Q10 (listing code shown on grade10-admin, never on the public listing page) and Q11 (a payment reference standing in for the order ID), should the listing code and the payment reference be the same value, and how do we derive it so it always leads with 2 letters? | Confirmed by the author, revising Q2 and Q11: the listing code *is* the payment reference — one 5-character Crockford Base32 code per listing, with no fixed prefix, allocated when the listing is created (not when a lot closes with a winner), carried forward as the payment reference once an order exists, and never reused, including after deletion. The first 2 characters are drawn only from `ABCDEFGHJKMNPQRSTVWXYZ`; the remaining 3 are drawn from the full Crockford charset. Implementation proposal only: a keyed one-way function over an internal system UUID or listing ID may generate a candidate, but the 5-character projection can collide; allocation must retry against active codes and retained reservations. Examples: `LK423`, `UY294` | A single unconstrained 5-character draw has no guarantee of a leading letter — a mostly numeric result reads like an amount or an internal number. Splitting the alphabet by position keeps every code letter-led while the allocator, rather than the projection, guarantees uniqueness and permanent nonreuse. |
| Q13 | Does reading the listing code need a permission separate from existing admin listing access? | No. Operators with existing listing-admin read access can see the code; knowing a code cannot grant admin access or expose private listing data. | A new code-specific grant |
| Q14 | Where does an authorized operator see the listing code? | Both the Listings table and the listing detail screen. | Detail only, leaving table reconciliation to a second lookup |
| Q15 | What happens to a cached shared-link preview created before the code existed? | A previously cached preview may persist; Grade10 provides no purge or regeneration guarantee. The current public page and every fresh metadata fetch still omit the code and private data. | Promising cache purge or regeneration |
| Q16 | What happens to a listing's canonical URL after it is removed from browse and search? | The original URL stays reserved and directly accessible for a called-off listing. The listing is absent from browse and search; its code is not a route. Explicit hard deletion has no feature in this change, so this decision does not define the page after hard deletion. | Rewriting and freeing the slug on call off |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-admin/auction/listing` | Does reading the listing code require a separate permission? | Q13 |
| `grade10-admin/auction/listing` | Should the code appear in the Listings table, the detail screen, or both? | Q14 |
| `grade10-site/auction/listing-page` | Can a cached preview persist after the listing is removed from browse and search? | Q15 |
| `grade10-site/auction/listing-page` | Can a delisted lot still be opened at its original URL? | Q16 |
