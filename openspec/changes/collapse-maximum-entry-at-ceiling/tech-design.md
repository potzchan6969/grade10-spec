## Context

[cap-custom-maximum-at-currency-ceiling](../cap-custom-maximum-at-currency-ceiling/) put the consumer-supplied `view.ceilingMinor` on the typed draft only. `resolveMaximumFloor` and `quickMaximumPresetAmount` in `packages/ui/src/blocks/auction-listing/listing-bid-money.ts` still compute a floor and chip amounts with no ceiling argument, so a maximum at the ceiling draws chips, a `Min.` helper and a dead commit above every amount the service accepts. `ListingQuickMaximumBidActions` owns the group that renders them.

## Goals / Non-Goals

- **Goal** - One ceiling-aware floor resolution drives both the collapse and the chip list
- **Goal** - The collapse is a single early return, before preset computation and before the enrollment lock
- **Non-goal** - New exports, view fields, primitive variants or tokens; currency policy stays consumer-owned

## Decisions

- **Floor resolution** - `resolveMaximumFloor` gains `ceilingMinor` and returns `null` when the computed floor exceeds it. The component already branches on the floor everywhere it matters; `null` short-circuits to the collapsed row instead of inventing a sentinel amount. Rejected: clamping the floor to the ceiling, which would present an amount below the raise floor as committable.
- **Chip amounts** - `quickMaximumPresetAmount` gains `ceilingMinor` and returns `{ amountMinor, clamped }` rather than a bare number - still `null` below the floor, `Math.min(amount, ceilingMinor)` above the ceiling, `clamped` driving the limit caption. Rejected: clamping in the component's memo, which splits one arithmetic rule across two files.
- **Collapse branch** - In `ListingQuickMaximumBidActions`, resolve the floor before the `presets` memo; `floor === null` returns a status row and nothing else, ahead of the `amountEntryLocked` path so the collapse outranks the card lock. The row leads with `copy.currentMaximum` (or `copy.biddingAtCeiling` when the viewer holds no maximum), keeps the existing `privateMaximumTooltip` trigger, and renders the limit line as secondary `xs` text. The mechanism subtext does not render.
- **Copy contract** - Three required keys on the existing copy type: `maximumAtCeiling`, `biddingAtCeiling`, `ceilingChip`. Required, so the consuming app's build fails rather than shipping a blank row - the same posture `ceilingMinor` took on the view.
- **Chip dedupe** - The `presets` memo drops later chips whose amount duplicates an earlier one; `defaultPresetKey`'s middle-element rule already tolerates a shorter list, and the selected chip stays the middle of what remains.
- **Tests before code** - Helper tests cover the null floor and clamped amounts; a rendered component regression covers the collapsed row's absent controls; catalog validation covers the three keys in all four locales.

## Risks / Trade-offs

- **Caller break** - `resolveMaximumFloor` returning `null` changes its signature for `listing-quick-maximum-bid-actions.tsx` and any test exercising it directly; the type system finds every caller
- **Copy migration** - Three required keys break the app build until grade10 supplies them; landed as one app group with the submodule pin, as the ceiling was
- **Fallback presets** - The existing fallback branch in the `presets` memo computes its own amounts; it gets the same clamp and dedupe so no path can render above the ceiling

## Migration Plan

1. Publish the shared source, catalogs, fixtures and stories in a reviewable grade10-spec PR; merging requires coordinator authority and a `Design-Override:` trailer on the commit touching `packages/ui/src/blocks`.
2. After authorized landing, update the grade10 submodule pin and supply the three copy keys together.
3. Run focused checks and the browser walk at the ceiling states.
