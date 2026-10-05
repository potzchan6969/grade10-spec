## Goals

- Cap the bid panel custom maximum draft at **9,999,999,999** whole major
  units in any listing currency.
- Refuse an edit past that ceiling by restoring the previous valid draft,
  including empty — never clamp to the ceiling.
- Keep the refuse silent: no dedicated “too large” helper or error status in
  this change.
- Record the rule on `shared/ui/auction-listing` for `ListingAuctionBidCard`
  (set and raise share the field).

## Non-Goals

- Folding this into `restrict-custom-maximum-to-whole-units` — that change
  owns whole-major cleaning only; this change owns the ceiling.
- Currency-specific field ceilings, locale thousand-separator input, or
  changing floor / increment rules; the JPY bid ceiling moves (Q6), the
  increment schedules do not.
- Quick-bid preset chips, public or personal bid history, admin, or legacy
  auto/manual bid controls.
- A second, field-sized refusal in auction-service: its currency ceiling
  already refuses, and with Q6 no currency's ceiling sits above the field.
- A helper message or error status solely for an over-ceiling refuse.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | What is the custom maximum draft ceiling? | **9,999,999,999** whole major units, any listing currency - decided by the round. Carried by `auction-listing.md` Custom Maximum Ceiling, `bidding.md` Custom maximum, `shared-ui-auction-listing-SC-38` | Currency-specific ceilings; tying the field to the lot bid ceiling on the auction-service page |
| Q2 | What happens when an edit would exceed the ceiling? | Restore the previous valid draft, including empty; do not clamp - decided by the round. Carried by `auction-listing.md` Custom Maximum Ceiling, `shared-ui-auction-listing-SC-39` to `-SC-43` | Clamp to the ceiling; clear the field; show an error and keep the oversize digits |
| Q3 | Does the refuse show dedicated copy? | Silent refuse — no “too large” helper or invalid-amount status for the ceiling alone - decided by the round. Carried by the requirement's No ceiling error copy clause, `shared-ui-auction-listing-SC-40` | Helper copy naming the ceiling (deferred follow-on if collectors misunderstand the restore) |
| Q4 | Does auction-service enforce the same ceiling now? | No new refusal: the service already refuses an amount above the currency's bid ceiling, naming it. With Q6 every currency's ceiling sits at or under the field's 9,999,999,999, so the field never refuses a maximum the service would accept - decided by the round. Carried by `grade10-site/auction/bid-increments`' ceiling requirement | A second, field-sized refusal in auction-service |
| Q5 | After whole-major cleaning, is a fractional paste whose integer part equals the ceiling accepted? | Yes — ceiling applies after cleaning; exactly 9,999,999,999 is accepted; only values above restore - decided by the round. Carried by the requirement's After cleaning clause, `shared-ui-auction-listing-SC-53` | Treating any fractional paste as overshoot; restoring when the cleaned value equals the ceiling |
| Q6 | The JPY bid ceiling is 150,000,000,000, above the field's 9,999,999,999, so a valid JPY maximum between them cannot be typed. Which moves? | The JPY bid ceiling comes down to **10,000,000,000**, on `grade10-site/auction/bid-increments`; the field ceiling stays. The ceiling itself is still reachable from a quick bid chip, since only typed and pasted edits restore - the owner's word, 2026-10-05 | A field ceiling per currency; leaving JPY maxima above 9,999,999,999 accepted by the auction and unreachable from the panel |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| shared/ui/auction-listing | After whole-major cleaning, is a fractional paste whose integer part equals the ceiling accepted, or restored? | Q5 |
| shared/ui/auction-listing, grade10-site/auction/bid-increments | The JPY bid ceiling sits above the field ceiling, so a valid JPY maximum cannot be typed | Q6 |
