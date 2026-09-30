## Goals

- Stock held by a listing that closes Unsold is available again, with no operator step
- An operator sees on the listing, the product page and the history that the stock came back
- Stock held by earlier Unsold closes is freed
- An operator can list an Unsold lot again in one move

## Non-Goals

- Releasing stock at any other close; a sold listing keeps moving its hold to sold
- Changing call-off, cancellation or unpaid-order stock rules
- Relisting automatically
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
| Q6 | How does the operator list the lot again? | Relist on the Unsold listing opens a new draft for the same product, quantity, Cert ID choice, title, copy, price, currency and gallery; campaign, reserve, extension, taxonomy and sandbox start as on any new draft (recommended) | Creating the listing from scratch, as today; carrying the product and quantity alone |
| Q7 | Does the new draft reuse the closed listing? | No, it is a new draft that takes its own hold on Save (recommended) | Reopening the closed listing, which reverses closed as terminal |
| Q8 | Does a top bid under the reserve count as Unsold? | Retired: no listing carries a reserve price, so the case cannot arise and its scenario, SC-131, is withdrawn - @mason5991, 2026-09-30 | Treating it apart, though the listing closes `unsold` either way |
| Q9 | How is success measured? | Unsold listings still holding stock, and days to the next listing (recommended) | No measure |
| Q10 | Which listings offer Relist, and to whom? | An Unsold listing only, and only to an operator holding `auction:operate`; hidden from anyone else - decided by the round | Also a called-off listing, which an operator chose to withdraw and nobody asked to relist; showing it disabled |
| Q11 | What does Relist store, and what if stock is short? | Nothing until Save; it opens the editor filled in, a second Relist opens another, and Save is refused when available is below the quantity, as any draft save is - decided by the round | Storing a draft on click, which leaves half-made drafts and a second hold on the same lot |
| Q12 | What if the release at the close fails? | It is retried until it succeeds and never delays or reverses the close; the listing shows the note only once the stock is released - decided by the round | Holding the close until the release works, which stops bidding from ending on time |
| Q13 | What do the history and the note say? | A release by the Unsold close reads `unsold close`, one by the clean-up reads `unsold clean-up`, and the note dates the release itself; a call-off release keeps no reason - decided by the round | One reason for both, which hides which listings the clean-up freed |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-admin/auction/listing` | Which listings offer Relist, and whether an operator without the grant sees it | Q10 |
| `grade10-admin/auction/listing` | Whether Relist stores a draft on click, whether it can run twice, and what Save does when stock is short | Q11 |
| `grade10-admin/auction/listing` | Which other fields Relist carries: the Cert ID choice, campaign, reserve, extension, taxonomy, sandbox | Q6 |
| `grade10-admin/auction/listing` | What the listing shows while a failed release is retried | Q12 |
| `grade10-admin/auction/listing` | The date the note shows for a hold the clean-up freed | Q13 |
| `grade10-admin/inventory/catalog` | Whether a called-off hold's history entry gains the Unsold reason | Q13 |
