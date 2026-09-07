## Context

See `proposal.md` for why. The custom maximum control lives in
`ListingQuickMaximumBidActions` inside `@grade10/ui`. Draft text already
passes through `sanitizeMoneyDraft` before parse/commit; that helper today
keeps fraction digits up to the currency ISO exponent. `NumberInput` uses
`type="number"`, which can strip decimals in the browser, but the product
rule must not depend on that.

## Goals / Non-Goals

**Goals:**

- Enforce whole major units in the draft sanitize path used by the custom
  maximum field.
- Keep commit conversion as whole major × `10^exponent` minor units.
- Avoid below-floor drafts when “use minimum” fills from a non-whole-major
  floor.

**Non-Goals:**

- Changing `NumberInput` globally.
- Changing `shared/money-amounts` conversion helpers used elsewhere.

## Decisions

1. **Sanitize strips all fraction digits for this field**
   - Change `sanitizeMoneyDraft` to always drop the decimal mark and
     fraction (its only caller is the custom maximum field). Update tests to
     match.
   - Alternatives rejected: rely on `type="number"` alone (not a contract);
     add a parallel helper while leaving the old fraction-capped behaviour
     unused (dead API).

2. **Refuse typed `.` / `,` before they enter the draft**
   - `onKeyDown` and `onBeforeInput` call `preventDefault` for a lone decimal
     mark so the character never appears. Paste still reaches `onChange` and
     is sanitized to the digits before the mark.
   - Alternatives rejected: strip only after change (a `.` can still flash or
     sit in the field under `type="number"`).

3. **`inputMode="numeric"` on the custom field**
   - Prefer a digit pad without a decimal key where the OS offers one.
   - Alternatives rejected: leave `inputMode="decimal"` (invites fractions the
     field then strips).

4. **“Use minimum” writes a whole-major draft at or above the floor**
   - When filling the custom draft from `floorMaximumMinor`, ceil to the next
     whole major unit when the floor is not already on a major boundary, so
     stripping cannot drop the draft below the floor.
   - Alternatives rejected: leave `moneyDraftFromMinor` as-is and hope floors
     are always whole (true for current increment tables, brittle).

## Risks / Trade-offs

- [Risk] A collector pastes `100.99` intending cents → Mitigation: strip to
  `100` without an error; floor helper still blocks commits below the
  minimum.
- [Risk] Exported `sanitizeMoneyDraft` behaviour changes for any future
  caller → Mitigation: only the bid panel imports it today; JSDoc states
  whole-major-only.
