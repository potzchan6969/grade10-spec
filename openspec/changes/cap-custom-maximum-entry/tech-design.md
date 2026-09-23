## Context

The custom maximum field already sanitizes through
`sanitizeMoneyDraft` (whole major units) inside
`ListingQuickMaximumBidActions` in `@grade10/ui`. This change adds a
ceiling on that same draft path. Auction-service lot ceilings stay out of
scope.

## Goals / Non-Goals

**Goals:**

- Enforce a single major-unit ceiling on the custom maximum draft for set
  and raise.
- Restore the previous valid draft when an edit would exceed it.
- Keep the refuse silent at the field.

**Non-Goals:**

- Changing `NumberInput` globally or `shared/money-amounts`.
- Server refuse of the same ceiling (follow-on).
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

2. **Export the ceiling constant for Storybook and tests**
   - Public export `CUSTOM_MAXIMUM_MAJOR_CEILING` beside
     `sanitizeCustomMaximumDraft` from `@grade10/ui`, so stories and tests
     share one number with the helper.
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

## Risks / Trade-offs

- [Risk] Digit-by-digit typing past the ceiling restores one keystroke at a
  time, not the seed → Mitigation: Storybook `CustomMaximumCeiling` documents
  paste-to-restore; unit tests cover both typed and pasted overshoot.
- [Risk] Auction-service still accepts a committed maximum above the UI
  ceiling if a client bypasses the field → Mitigation: accepted follow-on;
  this change is the UI contract only.
- [Risk] Future callers of `sanitizeMoneyDraft` assume no ceiling →
  Mitigation: ceiling lives only on `sanitizeCustomMaximumDraft`;
  `sanitizeMoneyDraft` stays whole-major cleaning alone.

## Open Questions

None. Server refuse timing is a follow-on change, not an open question on
this delivery.
