## Context

Public Recent bids are drawn by `ListingBidHistoryList` in `@grade10/ui`,
composed by `ListingAuctionBidCard`. The lot page in `grade10` builds the rows
in `listingBidHistory` (`packages/grade10-auction/frontend/src/features/listings/presentation/mappers/listingLotExtras.ts`)
from the lot's public bids, each with its state (`leading`, `won`, and the
rest). The shared block decides nothing about who won or who leads; the lot
page already knows both.

Both legs are built ahead of acceptance: the shared block and its stories in
this store, and the lot page's mapper in `grade10` (`684cdc9`). This design
records them and the two places the build differs from the contract.

## Goals / Non-Goals

**Goals:**

- Two optional row flags, set by the consumer, drawn by the list.
- The crown and the tip named only by consumer copy.
- One place in `grade10` decides each flag, from the bids it already reads.

**Non-Goals:**

- Changing how auction-service ranks equal maxima; the earlier one already
  leads.
- A new Badge size or variant; the crown is a Phosphor icon in the primary
  colour.
- The personal Your bidding dialog's own same-price description.

## Decisions

1. **Two optional flags on `ListingBidHistoryRow`, decided by the consumer**
   - `isWinner?: boolean` and `samePricePriority?: boolean` in
     `packages/ui/src/blocks/auction-listing/types.ts`. The list reads them and
     never compares amounts or states itself.
   - Alternatives rejected: the list working out ties from `amountMinor`
     (it cannot see who leads, and a viewer's collapsed rows would mislead
     it); one `outcome` enum (two facts that can hold together on one row).

2. **The crown and the tip render only with their copy**
   - `ListingBidHistoryList` draws the tip only where
     `copy.samePricePriorityTip` is supplied, as built. The crown follows the
     same rule: drawn where `row.isWinner` and `copy.winner` are both present,
     with `copy.winner` as its accessible name.
   - **Differs from the build:** the crown falls back to the literal
     `"Winner"` when `copy.winner` is absent
     (`listing-bid-history-list.tsx`, the `row.isWinner` branch). That breaks
     the durable rule that a control has no copy of its own. Task 2.4 removes
     the fallback. The existing `copy.you ?? "You"` fallback predates this
     change and stays out of scope.
   - Alternatives rejected: keeping an English default (a Korean page would
     announce "Winner").

3. **The crown sits after the amount and any tip, before You**
   - Inside the amount's `Text`, so the tip's Info icon inherits the amount's
     tone with no colour of its own; the crown sets `text-primary`.
     `CrownSimple`, `size` 12, `weight` fill, `role="img"`.

4. **The lot page sets both flags in `listingBidHistory`**
   - `isWinner` on a row whose bid state is `won`, only when the page is in
     its sold panel (`closedSold: screen.panel === "postSold"` in
     `ListingView.tsx`), so a live lot or one Closed without a result
     crowns nothing.
   - `samePricePriority` on a row when another public row with the same
     amount ranks above it: leading or won first, then newer, then
     pseudonym, the order the public ledger read also uses. This covers the
     current price and any older tie.
   - Copy: `bidHistory.winner` and `bidHistory.samePricePriorityTip` from
     `auctionListing.bidHistoryWinner` and `auctionListing.samePricePriorityTip`,
     answered in `en`, `ko`, `zh-Hans` and `zh-Hant`.
   - Alternatives rejected: auction-service sending the flags (a
     presentation fact on the wire, and the page already holds every input).

5. **A tie lists the earlier maximum first because its answer is stamped
   after the challenger**
   - In an equal-maximum tie, `resolveStandingMaxima.ts` stamps the
     leader's automatic answer one ms after the challenger's bid. The public
     read in `repositories/listings.ts` orders an amount by leader or won
     first, then newer `createdAt`, and the mapper ranks the same way, so
     the earlier maximum's row stays above the challenger's at the current
     price and after both are outbid. Built in `684cdc9`; the backend's
     `autoBidding.spec.ts` asserts an older tie's order.
   - The stamp is the rule's mechanism: task 4.2 keeps it and names the
     scenarios in the tests that prove it.
   - Alternatives rejected: a sequence column on `bids` (a migration for an
     order the stamp already gives); the server sending the flag
     (presentation on the wire).

## API Contracts

| Export | Change |
| --- | --- |
| `ListingBidHistoryRow` | `isWinner?: boolean`, `samePricePriority?: boolean` |
| `ListingAuctionBidCard` `copy.bidHistory` | `winner?: string`, `samePricePriorityTip?: string`, threaded to the list |

No new export, endpoint or stored field.

## Verification against the build

| Contract | Built | Proof |
| --- | --- | --- |
| Row flags | `types.ts` | Typecheck |
| Crown after amount and tip, before You | `listing-bid-history-list.tsx` | `ClosedSoldEqualMax` play |
| Live lot shows no crown | Default story | Default play, `queryByLabelText("Winner")` absent |
| Tip in the amount tone, with tip copy | `listing-bid-history-list.tsx` | `ClosedSoldEqualMax` play |
| Bid card threads both words | `listing-auction-bid-card.tsx` | `ClosedSoldEqualMax` play |
| Crown needs `copy.winner` | **No** - falls back to `"Winner"` | Task 2.4 |
| `isWinner` doc comment | **Stale** - says "Winner badge" | Task 2.4 |
| Sold lot crowns the won row only | `listingLotExtras.ts` | `listingLotExtras.test.ts`, "crowns only the won bid of a closed sold lot" |
| Tied row ranked second carries the tip, older ties included | `resolveStandingMaxima.ts` stamp, `listings.ts` read, `listingLotExtras.ts` | `autoBidding.spec.ts`, `listingLotExtras.test.ts`; scenario ids in titles by task 4.2 |
| `samePricePriority` doc comment | **Stale** - says "matches the leading price" | Task 2.4 |
| Copy in every language | `packages/i18n/messages/shared/*/auctionListing.json` | `pnpm --dir packages/i18n test` |

## Risks / Trade-offs

- [Risk] A consumer that sets `isWinner` and supplies no `copy.winner` loses
  the crown silently → Mitigation: the lot page supplies it in every language;
  the bid card's copy type names the field beside `samePricePriorityTip`.
- [Risk] The mapper's ranking and auction-service's ranking drift → Mitigation:
  the mapper ranks by the states the service publishes (`leading`, `won`),
  never by amounts alone.

## Migration Plan

None. Both flags are optional; a consumer that sets neither renders as before.

## Open Questions

None.
