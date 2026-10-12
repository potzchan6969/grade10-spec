## Context

The [shared ceiling requirement](specs/shared/ui/auction-listing/spec.md) replaces a universal field limit. The shared sanitizer in `packages/ui/src/blocks/auction-listing/listing-bid-money.ts` currently cleans whole-major input and restores the previous draft on every oversized edit. `ListingQuickMaximumBidActions` owns that ephemeral draft and restores the input DOM when React state does not change.

In grade10, `packages/grade10-auction/contracts/src/bidIncrements.ts` owns `bidCeiling(currency)` in minor units. `bidRefusalCopy.ts` currently maps `AMOUNT_TOO_HIGH` to ceiling copy or the generic fallback, and `ListingView.tsx` sets every refused answer to error status. These are the app seams to change.

## Goals / Non-Goals

- **Goal** - Keep currency policy consumer-owned while making one shared field correction work in set and raise
- **Goal** - Preserve exact whole-unit arithmetic and distinguish appended typing from paste or replacement
- **Non-goal** - Add response-driven field state, automatic retries, service changes, copy keys or visual variants

## Decisions

- **Policy input** - The shared contract governs entry, while the app owns auction ceilings. Add required `ceilingMinor: number` to `ListingAuctionBidView`, carried through `ListingAuctionBidCard` to its existing actions. The app's view adapter derives it using `bidCeiling(listing.currency)`; shared stories and preview fixtures supply the declared ceiling explicitly. Convert it to whole major units using existing currency-unit utilities. Reject a duplicated USD/HKD/JPY policy table or fallback cap in `@grade10/ui`: either would leave the shared layer deciding product policy.
- **Compatibility** - This is a required presentation-field addition on existing exported view and props types, not a new component export. Update all bid-card fixtures, previews and application consumers in their owning repositories. The consumer's currency and ceiling must use the same currency. Type checks enforce the required input.
- **Correction** - Keep whole-major cleaning in `listing-bid-money.ts`, compare the cleaned digit string with the supplied whole-major ceiling using exact integer arithmetic, and return one corrected draft. Empty input stays empty; a valid draft retains the existing cleaning behavior. Above-ceiling appended typing restores the prior valid draft; paste and replacement use the ceiling string. Preserve existing floor validation and minor-unit commit conversion.
- **Edit origin** - Classify genuine single-digit append versus replacement from native operation metadata, inserted data and the previous draft, not value length or inputType alone; a fill may use insertText with multi-character data. Explicit paste is always paste, including a paste at the end of a draft. Track only transient DOM edit metadata through the existing handlers; do not use browser storage or application state. Handle native paste before the number input discards fractional syntax, so whole-major cleaning sees the raw pasted text. Keyboard, selection replacement, paste, clear and fallback input paths use the same correction helper. If the corrected string equals current state, restore the displayed DOM value as the existing implementation already does.
- **Silent refusal** - Change `bidRefusalCopy` to return `undefined` for `AMOUNT_TOO_HIGH`, including when no ceiling field is present. In `ListingView.commitMaximum`, use idle status with no authorization message for that code; leave the remaining error mappings and status behavior unchanged. This clears the existing authorization message and preserves the other refusal mappings. Do not consume `ceilingMinor` from a refused answer to mutate the custom draft, add reset props, or call the mutation again.
- **Test boundaries** - Shared helper and component tests establish correction and actual DOM behavior; app mapper/view tests establish the silent defensive refusal with exactly one mutation. Browser tests exercise real append, selection replacement and paste in set and raise for all supported currencies. The bid-increments ceiling contract remains byte-for-byte unchanged; verify oversized requests through the authenticated API instead of attempting impossible oversized UI entry. API assertions cover refusal code and ceiling, unchanged price/leader/maxima and operational refusal evidence.
- **Scope** - Existing quick-bid calculations, identity checks, floor recovery and backend records remain with their current owners. Updating the neighboring API execution path changes test evidence only, not the service contract.

## Risks / Trade-offs

- **Input events** - Number inputs and native paste can normalize text before change handlers run. Capture paste text and preserve edit origin; verify actual browser operations alongside unit tests
- **Consumer migration** - A required ceiling field makes missed adapters fail compilation. Land the shared source in a reviewable PR, then update the app submodule and adapter together after authorized landing
- **Generic refusal fallback** - The current mapper produces generic refusal copy when a ceiling is absent. Mapper and view tests assert the no-message idle branch together
- **Arithmetic** - Very long pasted strings exceed safe Number precision. Compare cleaned strings with BigInt before conversion into bounded minor units

## Migration Plan

The placeholder correction is separate from the ceiling contract: reuse customAmountPlaceholder in the shared auctionListing catalog, align English with the existing Storybook `{amount} min.` string and keep equivalent short minimum wording in the other three locales. Preserve the existing numeric formatter and consumer-copy seam; no new prop, copy key or requirement is needed. Verify the rendered app field agrees with the story before browser evidence is captured.

1. Publish the shared source and fixtures in a reviewable grade10-spec PR; merging requires coordinator authority.
2. After authorized landing, update the grade10 submodule pin, ceiling adapter and refusal presentation together.
3. Run focused checks and the full currency set/raise browser walk, including the neighboring direct API ceiling verification.
4. Roll back the app wiring and shared pin together if required; no database or API migration is involved.
