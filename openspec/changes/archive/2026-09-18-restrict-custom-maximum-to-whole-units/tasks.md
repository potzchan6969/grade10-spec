## 1. Spec and product record (grade10-spec)

- [x] 1.1 Keep the OpenSpec proposal, auction-listing delta, and journeys
      aligned with whole-major custom maximum entry.
- [x] 1.2 Add the custom-maximum whole-major decision row on the auto-bidding
      manual page.

## 2. Shared UI money draft (grade10-spec)

- [x] 2.1 Make `sanitizeMoneyDraft` strip decimal marks and fractions for
      every currency; update unit tests.
- [x] 2.2 Ensure “use minimum” fills a whole-major draft at or above the floor.
- [x] 2.3 Set the custom maximum `NumberInput` to `inputMode="numeric"` and
      refuse typed `.` / `,` via key and before-input handlers.

## 3. Validation (grade10-spec)

- [x] 3.1 Run `openspec validate restrict-custom-maximum-to-whole-units --strict`.
- [x] 3.2 Run package tests covering `listing-bid-money` and typecheck/lint as
      needed.
