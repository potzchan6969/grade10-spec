## Context

The walk-in form is `WalkInForm` in
`packages/vault/admin-frontend/src/features/custody/cases/presentation/views/WalkInDialog.tsx`.
It already refuses a title or description past the intake's limit beside its
field and holds Open case while one stands. The address goes to the worker
unchecked; the worker's input schema, `walkInInputSchema` in
`packages/vault/contracts/src/walkIn.ts`, holds it to `email` from
`@grade10/utils/schema`, and a refusal there reaches the footer through
`walkInRefusal`, which has no words for it and prints the raw text.

At ten photographs the console's `MediaGallery` disables its input and drops
Add media, which `apps/frontend/grade10/e2e/tests/vault/walk-in.spec.ts`
already proves.

## Decisions

The [walk-in requirement](specs/grade10-admin/vault/operator-queue/spec.md)
governs the refusal row and both scenarios. The change lands in the form only.

- **One rule for an address** - `malformed(value)` is true when the trimmed
  value is not empty and fails `Schema.is(walkInInputSchema.fields.email)`, the
  field the worker decodes, so no second pattern exists to drift. Trim first:
  the field's type side holds the trimmed check. Rejected: `EMAIL_SHAPE` in
  `UserCreateDialog`, a looser pattern that lets through addresses the worker
  refuses.
- **Refused on leaving, cleared on fixing** - the form keeps one
  `addressRefused` flag. The field's `onBlur` sets it to `malformed(email)`;
  `onChange` clears it once `malformed(next)` is false, so an emptied or
  corrected address drops the refusal at once. The refusal is passed only
  while the flag is set. A flag that only records that the field was left
  would refuse on every keystroke after a valid address is left and edited.
  The console's field status would otherwise show a refusal from the first
  keystroke. `valid` includes `!malformed(email)`, so Open case is held either
  way.
- **The words** - `Not an email address. Check it with the customer.`, a
  literal in `WalkInDialog.tsx`, as the title's `At most 200 characters.` is.
  Console strings are literals by `docs/conventions/code-layout.md`; a shared
  catalog key would be the first console string there.
- **Ten photographs** - nothing changes in code. The unit test that names the
  scenario asserts the input is disabled at ten, and keeps its batch that
  runs past ten, which the gallery refuses itself.

## Risks / Trade-offs

- [An address the worker's rule refuses changes later] → The form reads the
  same exported schema, so a change to the rule moves both at once.
- [Enter in the address field before it is left shows nothing new, where
  `FormDialog` moves focus to the first refused field] → Q8 accepts it: Open
  case is visibly held, and the refusal shows as soon as focus leaves the
  field. A console-wide leave-gated refusal mode is the alternative, left for
  a change that needs it in more than one form.
