## Goals

- Mark the winning public Recent bids row with a primary crown after the
  amount once the lot closes sold.
- Explain equal-max priority on the non-leading same-price row with an Info
  tip in the amount tone.
- Keep live lots without a winner crown; leading stays first-row treatment
  only.

## Non-Goals

- Changing auction-service tie resolution (earlier max already leads).
- A footnote under the Recent bids list — tip stays on the row Info control.
- Renaming personal Your bidding dialog priority copy in this change.
- New Badge sizes, variants, or Figma-owned chrome.
- Any lot page change beyond setting the two flags and their copy.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | When does public Recent bids mark the winner? | Only when the lot is closed and sold; consumer sets `isWinner` on the winning row - carried by `bidding.md` Recent bids Winner, `shared-ui-auction-listing-SC-50`, `grade10-site-auction-listing-page-SC-48` and `-SC-50` | Winner mark on live high bidder |
| Q2 | How is equal-max priority explained? | Info tooltip on `samePricePriority` rows; icon matches amount tone; tip says when maximums match, the earlier one leads - carried by `auction-listing.md` Equal-max tip and `shared-ui-auction-listing-SC-51` | Footnote under the list; badge on the non-leader |
| Q3 | How is the winner marked? | Small filled crown in primary color after the amount, before You - carried by `auction-listing.md` Winner after close and the shared requirement's Winner crown clause | Winner text badge |
| Q4 | Does the tip show only on a tie at the current price, or also on an older tie lower down Recent bids? | Every row tied on amount with a row above it carries the tip, at the current price and at any older tie; the row above carries none - the owner's word, 2026-10-05. Carried by `bidding.md` Recent bids Winner, `auction-listing.md` Equal-max tip, `grade10-site-auction-listing-page-SC-49` and `-SC-51` | The current price only, which leaves an older tie unexplained when it is still on screen |
| Q5 | Do the tip icon's tone and the crown's place before You need scenarios of their own? | No: the shared requirement states both and the cases walk them; no scenario is added - the owner's word, 2026-10-05 | An AND on `shared-ui-auction-listing-SC-51` and a placement scenario |
| Q6 | Two rows tied on amount; which is listed above? | The leading or won row first, then the row whose bidder set that maximum earlier; the tip goes on the later one. The build keeps that order by stamping the leader's automatic answer one ms after the challenger, so it holds once both are outbid - the owner's word, 2026-10-05, corrected to the built mechanism the same day. Carried by `bidding.md` Recent bids Winner, the lot page requirement's Tied maximum clause, `grade10-site-auction-listing-page-SC-49` and `-SC-51` | The later maximum listed first, which puts the tip on the bidder whose maximum leads |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `shared/ui/auction-listing` | Winner while live vs closed only? | Q1 |
| `shared/ui/auction-listing` | Footnote vs tooltip for equal-max? | Q2 |
| `shared/ui/auction-listing` | Badge vs crown for the winner? | Q3 |
| `grade10-site/auction/listing-page` | Accept-review: the tip on an older tie lower down had no page line or decision | Q4 |
| `shared/ui/auction-listing` | QA2: no scenario for the tip icon's tone or the crown's place | Q5 |
| `grade10-site/auction/listing-page` | Accept-review: which row of a tie is listed above, and is that order kept once both are outbid? | Q6 |
