## Goals

- Give collectors and operators stable references for a lot, winner order,
  invoice, receipts and bank transfer.
- Keep internal database IDs, audit numbers and provider references out of
  collector-facing surfaces, except for the deliberately exposed lower-case
  listing-code suffix in a listing URL.
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
| Q6 | Which values may appear on collector surfaces? | Superseded by Q18 — see below | (see Q18) |
| Q7 | When should the proposal become a checkable requirement? | Confirmed by the author: retain every invoice and its receipts for 7 years from issuance, matching Hong Kong's standard tax/audit record-keeping period; nothing else blocks the requirements delta — format, character alphabet, allocation, reissue, receipt sequencing and collision handling were all confirmed in Q12 | A shorter or indefinite period was not evaluated against Grade10's actual audit obligations; 7 years is the common HK baseline and gives the requirements delta a concrete retention rule to build against rather than none. |
| Q8 | How should receipts identify multiple payments when invoices can be reissued? | Superseded by Q11 — see below | (see Q11) |
| Q9 | Which payment reference belongs in Stripe and in generated document filenames? | Confirmed by the author: write the Grade10 payment reference code to Stripe metadata under `payment_reference_code`; obtain Stripe's provider reference from the returned payment object and pass it into subsequent internal invoice, receipt and refund document filenames | Generating a provider-looking reference in Grade10 would duplicate Stripe's identity and could disagree with the PaymentIntent, Charge or Refund returned by Stripe. |
| Q10 | Should auction lots display an auction ID in the UI, or are they referred to by their titles? | Superseded by Q18 — see below | (see Q18) |
| Q11 | Following Q10, with no auction ID shown and no separate public order ID either, what is the winner's one collector-facing reference, and how do invoice and receipt IDs derive from it? | Superseded by Q12 — see below | (see Q12) |
| Q12 | Following Q10 (listing code shown on grade10-admin, never on the public listing page) and Q11 (a payment reference standing in for the order ID), should the listing code and the payment reference be the same value, and how do we derive it so it always leads with 2 letters? | Superseded by Q17 and Q18 — see below | (see Q17 and Q18) |
| Q13 | Does reading the listing code need a permission separate from existing admin listing access? | No. Operators with existing listing-admin read access can see the code; knowing a code cannot grant admin access or expose private listing data. | A new code-specific grant |
| Q14 | Where does an authorized operator see the listing code? | Both the Listings table and the listing detail screen. | Detail only, leaving table reconciliation to a second lookup |
| Q15 | What happens to a cached shared-link preview created before the code existed? | A previously cached preview may persist; Grade10 provides no purge or regeneration guarantee. The current public page and every fresh metadata fetch omit a separate code field and private data, while the canonical address may carry the lower-case code suffix. | Promising cache purge or regeneration |
| Q16 | What happens to a listing's canonical URL after it is removed from browse and search? | The original URL stays reserved and directly accessible for a called-off listing. The listing is absent from browse and search; its code is not a route. Explicit hard deletion has no feature in this change, so this decision does not define the page after hard deletion. | Rewriting and freeing the slug on call off |
| Q17 | When is the UUID-derived listing code allocated when its lower-case form is needed in a draft's generated slug? | Confirmed by the author: allocate and permanently reserve the code on the first explicit draft save. The returned draft can then receive the title-and-code slug before create. | Waiting until create leaves an unfinished listing without the slug assistance that the operator needs. |
| Q18 | Can the public listing URL reveal the lower-case listing code, and when does title editing change its generated slug? | Confirmed by the author: **BREAKING** - the public canonical slug ends with the lower-case listing code, though the page never displays it as a labelled field. The helper replaces the title part on a title edit only while the stored slug remains the previous generated value; an operator's edit is preserved. | A separate opaque suffix keeps the code private but does not use the agreed listing-code suffix; continually rewriting the field can overwrite an operator's chosen address. |
| Q19 | Does pre-Save collision feedback change which existing slugs reserve an address? | Confirmed by the author: no. Leaving the Slug field checks the existing reservation rule and makes its result visible before Save, including completed, expired and unsold listings. | A new state-specific exception would weaken existing address continuity and make the field note disagree with Save. |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-admin/auction/listing` | Does reading the listing code require a separate permission? | Q13 |
| `grade10-admin/auction/listing` | Should the code appear in the Listings table, the detail screen, or both? | Q14 |
| `grade10-site/auction/listing-page` | Can a cached preview persist after the listing is removed from browse and search? | Q15 |
| `grade10-site/auction/listing-page` | Can a delisted lot still be opened at its original URL? | Q16 |
