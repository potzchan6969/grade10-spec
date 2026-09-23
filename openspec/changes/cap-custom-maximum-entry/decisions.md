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
- Currency-specific ceilings, locale thousand-separator input, or changing
  floor / increment rules.
- Quick-bid preset chips, public or personal bid history, admin, or legacy
  auto/manual bid controls.
- Server / auction-service refuse of oversize maxima (follow-on).
- A helper message or error status solely for an over-ceiling refuse.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | What is the custom maximum draft ceiling? | **9,999,999,999** whole major units, any listing currency - decided by the round | Currency-specific ceilings; tying the field to the lot bid ceiling on the auction-service page |
| Q2 | What happens when an edit would exceed the ceiling? | Restore the previous valid draft, including empty; do not clamp - decided by the round | Clamp to the ceiling; clear the field; show an error and keep the oversize digits |
| Q3 | Does the refuse show dedicated copy? | Silent refuse — no “too large” helper or invalid-amount status for the ceiling alone - decided by the round | Helper copy naming the ceiling (deferred follow-on if collectors misunderstand the restore) |
| Q4 | Does auction-service enforce the same ceiling now? | No — UI contract only in this change; service refuse is a follow-on - decided by the round | Blocking ship on a server refuse in the same change |
| Q5 | After whole-major cleaning, is a fractional paste whose integer part equals the ceiling accepted? | Yes — ceiling applies after cleaning; exactly 9,999,999,999 is accepted; only values above restore - decided by the round | Treating any fractional paste as overshoot; restoring when the cleaned value equals the ceiling |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| shared/ui/auction-listing | After whole-major cleaning, is a fractional paste whose integer part equals the ceiling accepted, or restored? | Q5 |
