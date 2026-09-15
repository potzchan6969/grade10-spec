**Author:** @seankcw - 2026-09-14

## Why

The sign-in dialog carries a second way out beside dismissal: an exit action
the consumer labels and handles, drawn as a ghost button under the status
line. No surface has ever drawn it. The grade10 site, the zzz site and the
admin console each render the dialog and none passes a handler, so the button
has never appeared to a collector or an operator. The admin console says why
in its own code: a console's sign-in is the whole screen, and there is nothing
behind it to return to.

What keeps the prop alive is its own tests. A story exercises it, a flow test
asserts it fires, and both pass against a feature no one can reach. That is
the cost: an export in the cross-repo contract, a prop on two components and a
word in the catalogs, all carried and kept green for a control that does not
exist in the product.

Dismissal already answers what the exit was for. The close control, Escape and
the scrim each hand the collector back the page they were on, and that is the
behaviour the capability specifies and every surface relies on.

**Metric:** none. No collector or operator can reach the control today, so
nothing observable moves. The change is paid for in the contract it shrinks.

**Acceptance signal:** the shared UI package exports no `SignInCardAction`,
the sign-in dialog takes no exit action, and the three surfaces render exactly
as they do now.

## What Changes

- **The sign-in dialog stops taking an exit action.** `exitAction` leaves
  `SignInCard` and the ghost button under the status line goes with it.
- **`shared/ui/auth-sign-in` stops exporting `SignInCardAction`.** The type
  described that action's label and handler and names nothing else.
  **BREAKING** for any consumer importing it. The export set is one
  requirement, and `remove-sign-in-code` is already folding it, so that
  change carries this line rather than a second fold of the same block.
- **The sign-in flow stops offering the exit.** Its `onExit` handler and the
  `exitLabel` word leave with the prop they fed.
- **The catalogs keep `common.backToHome`.** Both brands' not-found pages
  answer from it, so the word stays.

## Non-Goals

- **Dismissal.** The close control, Escape and the scrim are the way out of
  the dialog and are untouched.
- **The console's full-screen sign-in.** Whether a console should offer a way
  out at all is a product question this change does not open; it removes a
  control nobody wired, not the option of wiring one.
- **Any other export.** `SignInCard`, `SignInEmailForm` and their copy and
  props types stay exactly as they are.

## Capabilities

### Modified Capabilities

- `shared/ui/auth-sign-in`: dismissal becomes the only way out the block
  offers. The matching export-set edit rides on `remove-sign-in-code`.

## Impact

Affected: the sign-in block and the public entry in `packages/ui`, and the
sign-in flow and its test in the consuming application. The application reads
the new export set through a submodule bump.

## Follow-on changes

- A console that needs a way out of its full-screen sign-in can specify one as
  the behaviour it is, rather than inheriting a prop nobody asked for.
