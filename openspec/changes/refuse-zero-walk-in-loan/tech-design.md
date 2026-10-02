## Context

The worker already holds the rule: `intakeInputSchema` in
`packages/vault/contracts/src/schemas.ts` takes `financingRequestedMinor` as
`positiveMinorAmount`, an integer more than zero, and `walkInInputSchema` in
`packages/vault/contracts/src/walkIn.ts` spreads that field. The collector's
wizard holds it too: `refusalOfDetails` in
`packages/vault/frontend/src/features/custody/request/domain/details.ts`
answers `financingNotPositive` for a zero, and the wizard's amount field never
takes one.

The walk-in form is `WalkInForm` in
`packages/vault/admin-frontend/src/features/custody/cases/presentation/views/WalkInDialog.tsx`.
Its loan field is the console's `MoneyField`, which refuses text that is not
an amount in the currency (a minus sign, too many decimals, letters) while it
is typed, and hands `0` on as an amount. The form sends it, the worker refuses
it, and `walkInRefusal` prints the worker's raw text in the footer.

## Decisions

The [walk-in requirement](specs/grade10-admin/vault/operator-queue/spec.md)
governs the refusal row and SC-96; the
[lane requirement](specs/grade10-site/vault/case-intake/spec.md) governs the
rule and SC-42 (Q11). The case-intake change is the rule the code already holds, so
only its tests are named for SC-42.

- **One rule for an amount** - `isLoan = Schema.is(walkInInputSchema.fields.financingRequestedMinor)`,
  the field the worker decodes, beside `isAddress`. No second check exists to
  drift. The field is optional, so it takes `undefined`; the form calls it
  only with a number, behind `amount !== null`.
- **Refused on leaving, cleared on fixing** - the address's pattern again: one
  `amountRefused` flag. `MoneyField`'s `onBlur` sets it to
  `amount !== null && !isLoan(amount)`; its `onChange` clears it once the field is
  emptied (`null`, not refused) or the next amount meets the rule; text
  `MoneyField` refuses, such as `0.`, keeps the flag: deleting `0.` back to
  `0` must not clear it, since the row clears it only for an amount more than
  zero or an emptied field. The refusal is passed to `MoneyField` only
  while the flag is set, and `MoneyField` shows its own text refusal first.
  `valid` asks `amount !== null && isLoan(amount)` on the loan lane, so Open
  case is held whether or not the field was left.
- **The flag it replaces** - the form's current `amountRefused` records only
  that `MoneyField` refused the text. `MoneyField` hands `null` for refused
  text, so `amount !== null` already holds Open case; that flag goes, and the
  name carries the new one.
- **`MoneyField.onBlur`** - an optional `onBlur?: () => void` passed through
  `UnitField` to its `TextField`, as `NotesField` takes one. Nothing else in
  the console changes.
- **The words** - `A loan is more than zero. Ask the customer how much, or choose Storage only.`, a literal in
  `WalkInDialog.tsx`, as the title's `At most 200 characters.` is (Q6). It
  names the lane choice's own label.
- **Switching lane** - choosing a lane clears the flag and keeps the amount.
  Storage only drops the loan field, and the amount stops counting toward
  `valid`. A loan field built again is untouched, so the console would draw a
  kept refusal on the first keystroke, while staff type; cleared, it shows
  again when staff next leave the field.

## Risks / Trade-offs

- [The worker's amount rule changes later] → The form reads the same exported
  field, so a change moves both at once.
- [A negative amount or one finer than the currency's minor unit] →
  `MoneyField` refuses that text itself while it is typed, and hands no amount
  on, so the zero refusal never sees it.
- [Enter in the loan field before it is left shows nothing new] → As for the
  address: Open case is visibly held, and the refusal shows as soon as focus
  leaves the field.
