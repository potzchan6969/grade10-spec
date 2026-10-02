## Goals

- Stock held by a listing that closes Unsold is available again, with no operator step
- An operator sees on the listing, the product page and the history that the stock came back
- Stock held by earlier Unsold closes is freed
- An operator can list an Unsold lot again in one move

## Non-Goals

- Releasing stock at any other close; a sold listing keeps moving its hold to sold
- Changing call-off, cancellation or unpaid-order stock rules
- Relisting automatically
- Relisting a listing in a campaign
- Reopening or editing a closed listing
- Carrying bids, bidders, history, slug, listing code or window into the relisted draft
- Holding released stock back for a period before it is available
- Notifying collectors or watchers that the lot is back

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | When does an Unsold listing release its hold? | Automatically at the Unsold close (recommended) | An operator releasing by hand, which leaves stock stuck until somebody remembers |
| Q2 | What happens to holds earlier Unsold closes left behind? | One release of every such hold, logged in the history (recommended) | Leaving them for operators to release from the product page one by one |
| Q3 | What does the operator see on the listing? | A note that the stock was released, with the date (recommended) | Nothing, leaving the operator to check the product page |
| Q4 | What does the product page show? | Available up by the released units; the hold closed and released, naming the listing (recommended) | Available up alone, with no trace of why |
| Q5 | What does the history record? | One entry for the release, naming the listing and that the Unsold close caused it (recommended) | Folding it into the ordinary release entry with no reason |
| Q6 | How does the operator list the lot again? | Relist on the Unsold listing's row opens a new draft for the same product, quantity, Cert ID choice, title, copy, price, currency and gallery; campaign, reserve, extension, taxonomy and sandbox start as on any new draft (recommended) | Creating the listing from scratch, as today; carrying the product and quantity alone |
| Q7 | Does the new draft reuse the closed listing? | No, it is a new draft that takes its own hold on Save (recommended) | Reopening the closed listing, which reverses closed as terminal |
| Q8 | Does a top bid under the reserve count as Unsold? | Retired: no listing carries a reserve price, so the case cannot arise and its scenario, SC-131, is withdrawn - @mason5991, 2026-09-30 | Treating it apart, though the listing closes `unsold` either way |
| Q9 | How is success measured? | Unsold listings still holding stock, and days to the next listing (recommended) | No measure |
| Q10 | Which listings offer Relist, where, and to whom? | The Unsold listing's row in the Listings table, once its stock is released, when it sits in no campaign and has not been relisted; only to an operator holding `auction:operate`, hidden from anyone else - decided by the round, revised on the pages 2026-09-30 | Also a called-off listing, which an operator chose to withdraw and nobody asked to relist; showing it disabled; offering it before the release, which lets the new hold compete with the old for the same units; offering it in a campaign, where the draft's place in the campaign is a choice nobody has made; offering it on the listing's page alone, which the operator reaches one step later |
| Q11 | What does Relist store, and what if stock is short? | Nothing until Save; it opens the editor filled in, a second Relist opens another, and Save is refused when available is below the quantity, as any draft save is - decided by the round | Storing a draft on click, which leaves half-made drafts and a second hold on the same lot |
| Q12 | What if the release at the close fails? | It is retried until it succeeds and never delays or reverses the close; the listing shows the note only once the stock is released - decided by the round | Holding the close until the release works, which stops bidding from ending on time |
| Q13 | What do the history and the note say? | The remarks of a release by the Unsold close read `Released by unsold listing`, one by the clean-up `Released by unsold listing (clean-up)`, and the note dates the release itself; a call-off release keeps no remarks - decided by the round, revised on the pages 2026-09-30 | The codes `unsold close` and `unsold clean-up` as the remarks, which read as system words to an inventory admin; one text for both, which hides which listings the clean-up freed |
| Q14 | How does the history show whose hold an entry moved? | Each entry shows when, with date and time, its action, quantity and actor, the holder - the listing by code and title, else the holder reference - and its remarks; the product page's hold names the listing the same way - decided by the round, on the pages 2026-09-30 | Naming the listing in the remarks alone, which an admin hold's own remarks would overwrite; a holder reference only, which an inventory admin without Auction access cannot read |
| Q15 | What does an operator read when a relist Save is refused? | The refusal's name, inline in the editor: Listing not found, Not Unsold, In a campaign, Stock not released, Already relisted - @mason5991, 2026-09-30 | A sentence per refusal saying what to do next, which is more copy to keep for a case the Listings row already prevents |
| Q16 | How does the holder kind read in the history's Holder column? | A word an inventory admin reads - Auction, Vault, Admin - shown by the admin app; the stored holder kind stays the code and an Auction hold's stored holder reference stays the listing id - @mason5991, 2026-09-30 | Showing the stored code `grade10-auction`; storing the word, which ties the stored record to one screen's copy |
| Q17 | Does the history's Remarks show an admin hold's typed remarks on its reserve entry? | No: Remarks is the entry's own reason, so a reserve reads `—`; the admin's remarks stay in the reservations table (recommended) | Falling back to the hold's remarks, which repeats them on every later adjust and release and blurs which entry carries them |
| Q18 | Is a listing still relisted when the draft saved from its Relist is later called off? | Yes: once a draft is saved from its Relist, the listing is relisted for good and offers no second Relist (recommended) | Offering Relist again, which needs a relist link that can be undone and a second hold on the same lot |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-admin/auction/listing` | Which listings offer Relist, and whether an operator without the grant sees it | Q10 |
| `grade10-admin/auction/listing` | Whether Relist stores a draft on click, whether it can run twice, and what Save does when stock is short | Q11 |
| `grade10-admin/auction/listing` | Which other fields Relist carries: the Cert ID choice, campaign, reserve, extension, taxonomy, sandbox | Q6 |
| `grade10-admin/auction/listing` | What the listing shows while a failed release is retried | Q12 |
| `grade10-admin/auction/listing` | The date the note shows for a hold the clean-up freed | Q13 |
| `grade10-admin/inventory/catalog` | Whether a called-off hold's history entry gains the Unsold reason | Q13 |
| `grade10-admin/auction/listing` | What an operator reads when a relist Save is refused: the refusal names alone (Already relisted, Stock not released) or a sentence that says what to do next | Q15 |
| `grade10-admin/inventory/catalog` | How the holder kind reads in the history's Holder column: the stored code, `grade10-auction`, or a word an inventory admin reads, Auction, Vault, Admin | Q16 |
| `grade10-admin/inventory/catalog` | Whether the history's Remarks shows the remarks an admin typed on an admin hold, on its reserve entry, or only the entry's own remarks, which a reserve has none of | Q17 |
