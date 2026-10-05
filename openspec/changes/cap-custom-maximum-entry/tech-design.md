## Context

The custom maximum field already sanitizes through
`sanitizeMoneyDraft` (whole major units) inside
`ListingQuickMaximumBidActions` in `@grade10/ui`. This change adds a
ceiling on that same draft path, and lowers the JPY bid ceiling the auction
service refuses above (Q6), so no maximum the service accepts sits above
what the field takes.

## Goals / Non-Goals

**Goals:**

- Enforce a single major-unit ceiling on the custom maximum draft for set
  and raise.
- Restore the previous valid draft when an edit would exceed it.
- Keep the refuse silent at the field.
- JPY bid ceiling at `10_000_000_000` minor units, the one constant every
  ceiling reader shares.

**Non-Goals:**

- Changing `NumberInput` globally or `shared/money-amounts`.
- A second, field-sized refusal in auction-service; its currency ceiling
  already refuses (Q4).
- New error copy or design-system variants.

## Decisions

1. **Dedicated sanitize helper on the custom-maximum path**
   - Spec already governs the ceiling value and restore behaviour. Delivery
     adds `sanitizeCustomMaximumDraft(raw, currency, previousDraft)` that
     runs `sanitizeMoneyDraft` first, then restores `previousDraft` when the
     cleaned whole-major integer exceeds `CUSTOM_MAXIMUM_MAJOR_CEILING`
     (`9_999_999_999`). Empty after sanitize clears the field.
   - Alternatives rejected: inline the compare in the input handler only
     (harder to unit-test and easy to miss on raise); clamp to the ceiling
     (forbidden by the product rule); refuse in `NumberInput` via `max`
     (browser clamping and locale parsing are not the contract).

2. **Export the ceiling constant and helper for stories and tests**
   - `CUSTOM_MAXIMUM_MAJOR_CEILING` and `sanitizeCustomMaximumDraft` are
     exported from `@grade10/ui` (`packages/ui/src/index.ts`), so stories and
     tests share one number with the helper. They are helpers, not part of
     the listing surface's contract: the requirement fixes the ceiling and the
     restore, and no consumer is held to these names.
   - Alternatives rejected: duplicate the literal in stories; keep the
     constant file-private and hard-code `9999999999` in tests.

3. **Compare with BigInt after whole-major cleaning**
   - Ceiling check runs on the cleaned digit string via `BigInt`, so values
     near `Number.MAX_SAFE_INTEGER` stay exact.
   - Alternatives rejected: `Number(sanitized)` (precision loss above
     9e15); string length heuristics (wrong for leading zeros).

4. **No new UI state for the refuse**
   - The field keeps using existing floor / invalidAmount paths for their
     own rules; over-ceiling restore adds no status and no copy.
   - Alternatives rejected: a dedicated `tooLarge` status (non-goal).

5. **The JPY ceiling is one constant in `@grade10/auction-contracts`**
   - `AUCTION_BID_CEILINGS.JPY` in
     `packages/grade10-auction/contracts/src/bidIncrements.ts` moves from
     `150_000_000_000` to `10_000_000_000`. `bidCeiling` reads it for every
     consumer: auction-service's refusal in `placeBid.ts`, the lot page's
     quick bids in `quickBidAmounts.ts`, the bid-enable check in
     `listingUi.ts` and the fixture client. No migration: nothing is
     launched, and no stored row holds a ceiling.
   - Every JPY ceiling sits within the field: JPY's exponent is 0, so
     10,000,000,000 minor units is 10,000,000,000 whole yen, one above the
     field's 9,999,999,999. A collector reaches the ceiling itself from a
     quick bid chip, which the field's restore does not touch.
   - Alternatives rejected: a field ceiling per currency (Q6 keeps one);
     a second ceiling table in the frontend (two numbers that drift).

## Risks / Trade-offs

- [Risk] Digit-by-digit typing past the ceiling restores one keystroke at a
  time, not the seed → Mitigation: Storybook `CustomMaximumCeiling` documents
  paste-to-restore; unit tests cover both typed and pasted overshoot.
- [Risk] A client that bypasses the field sends a maximum above it →
  Mitigation: auction-service refuses above the currency's ceiling, and with
  Q6 no ceiling sits above the field.
- [Risk] A test or fixture still holds a JPY amount between 10,000,000,000
  and 150,000,000,000 → Mitigation: task 4.1 rewrites each one the old
  ceiling named; the contracts test pins the new value.
- [Risk] Future callers of `sanitizeMoneyDraft` assume no ceiling →
  Mitigation: ceiling lives only on `sanitizeCustomMaximumDraft`;
  `sanitizeMoneyDraft` stays whole-major cleaning alone.

## Open Questions

None.
