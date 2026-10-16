## Goals

- A shared lot link keeps working for the lot that will sell again after Relist
- Relist still creates a new listing with its own listing code, stock hold and window
- Operators can see that the public address moved, on both listings' activity
- Operators can see on the Unsold source that it was already Relisted

## Non-Goals

- A redirect table or HTTP redirect from an old slug to a new one
- Reusing the source listing code on the successor
- Reopening or editing the closed Unsold listing in place
- Carrying bids, bidders or bid history into the relisted draft
- Changing call-off slug rewrite, or freeing completed/expired addresses generally
- Notifying collectors that the lot was relisted
- Automatic Relist

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | How should a shared link behave after Relist? | Transfer the Unsold source's slug onto the successor on Relist Save so one canonical URL stays with the live lot - @jeff via rehearsal B1 note, recorded @mason5991 2026-10-15 | Keep the closed page at the old slug (today); add a redirect table from old to new |
| Q2 | When does the slug move? | In the same transaction as Relist Save that stores the new draft and its `relistOf` link - @jeff via rehearsal B1 note, recorded @mason5991 2026-10-15 | Only on Publish of the successor; a separate redirect after Save |
| Q3 | Does the successor keep the source listing code? | No. The new draft still receives its own listing code; only the slug transfers - @jeff via rehearsal B1 note, recorded @mason5991 2026-10-15 | Reuse the source code, which would collide with permanent code reservation |
| Q4 | What does the Relist editor show for Slug? | The source's slug, filled in; the operator may still replace it before Save. Save stores the form's slug and frees the source's former slug in the same transaction - recommended, recorded @mason5991 2026-10-15 | Empty slug with a new title-and-code generation (today); read-only slug |
| Q5 | Is a redirect table in scope? | No. Prefer the transfer so one address stays canonical - @jeff via rehearsal B1 note, recorded @mason5991 2026-10-15 | 301/302 or a slug-history table |
| Q6 | What does activity show? | An activity entry on the Unsold source and on the new draft, each naming the slug and the other listing - @jeff via rehearsal B1 note, recorded @mason5991 2026-10-15 | Silent transfer; audit chain only with no operator-facing activity |
| Q7 | After transfer, does the Unsold source still reserve the address? | No. Collision and field-exit treat that slug as free of the source; other completed, expired or unsold listings still reserve theirs - recommended, recorded @mason5991 2026-10-15 | Keep reserving on the source after transfer, which would block the successor |
| Q8 | What opens at the address between Relist Save and Publish? | Not found. Draft and created listings still do not answer publicly; the Unsold source no longer holds the slug - recommended, recorded @mason5991 2026-10-15 | Keep answering the closed page until Publish (needs delayed transfer); serve the draft publicly |
| Q9 | How is success measured? | Shared `/auction/listings/<slug>` hits that open the live successor after Relist - recommended, recorded @mason5991 2026-10-15 | No measure |
| Q10 | How does transfer activity name the other listing? | By listing code and English title when present, else the listing id, and always the slug that moved - recommended, recorded @mason5991 2026-10-15 | Listing id alone; code only; admin deep link only |
| Q11 | If the operator clears the prefilled Relist slug before Save, what is stored? | The ordinary title-and-code generated slug for the new draft's listing code; the source's former slug is still freed in the same transaction - recommended, recorded @mason5991 2026-10-15 | Refuse empty; leave the draft with no slug |
| Q12 | How does admin show that an Unsold source was already Relisted? | A **Relisted** badge beside **Unsold** on the source listing's detail header and in the Listings table Status column, once Relist Save linked a successor (`relistedListingId`) - @mason5991 2026-10-16 | Relist activity alone; a Status word that replaces Unsold; badge only on the detail page |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-admin/auction/listing` | Whether Relist regenerates the slug from the new listing code | Q1 |
| `grade10-admin/auction/listing` | Redirect table versus transferring the slug | Q5 |
| `grade10-admin/auction/listing` | Activity for the transfer | Q6 |
| `grade10-admin/auction/listing` | Editor prefill and operator override of the transferred slug | Q4 |
| `grade10-admin/auction/listing` | Public answer between Save and Publish | Q8 |
| `grade10-admin/auction/listing` | How the transfer activity names the other listing for an operator (listing id as today, listing code, English title, or more than one) | Q10 |
| `grade10-admin/auction/listing` | If the operator clears the prefilled Relist slug before Save, whether Save generates a title-and-code slug or refuses empty | Q11 |
| `grade10-admin/auction/listing` | When the slug moves on Relist Save | Q2 |
| `grade10-admin/auction/listing` | Distinct listing code on the successor | Q3 |
| `grade10-admin/auction/listing` | Admin Relisted badge on the Unsold source after Relist Save | Q12 |
