# UI — sign-in-dialog-shell

## Screens

| Surface | Figma |
| --- | --- |
| Sign-in dialog | [`Login Dialog` 4666:1488](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4666-1488) |
| Scrim behind it | [`Login Dialog Overlay` 4666:1523](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4666-1523) |
| Provider mark | [`Google Icon` 4674:4180](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4674-4180) |

The `Login Dialog` frame is the layout's source of truth, including the body
order the spec requires.

## Components

From `@grade10/design-system`, all existing:

- `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`,
  `DialogDescription`, `DialogBody` — the shell. `DialogContent` renders
  `DialogOverlay` itself, so the scrim needs no separate mount.
- `Divider` — between the provider slot and the step, carrying `copy.providerDivider`.
- `Text` — the status message and the legal line.
- `Button` — the exit action.

From `@grade10/ui`, changing in this change:

- `SignInCard` — the export whose shell moves. `SignInEmailForm` and
  `SignInCodeForm` are unchanged and keep rendering as its children.

Nothing new is needed in `packages/design-system`. `DialogHeader`'s default
close control is the dismissal affordance, so `showCloseButton` is left at its
default rather than passed.

`Google Icon` (`4674:4180`) is published in Figma with no code counterpart. It
is not needed here — the provider widget reaches the dialog through
`providerSlot` — and is flagged in the proposal's non-goals rather than built.

## States

| State | Spec scenario |
| --- | --- |
| Closed — nothing rendered, no scrim | [Visibility is the consumer's](specs/shared/ui/auth-sign-in/spec.md) |
| Open over a live page | [The triggering page stays mounted](specs/shared/ui/auth-sign-in/spec.md) |
| Dismissing by close control, Escape, or scrim | [Dismissing returns the collector to what they were doing](specs/shared/ui/auth-sign-in/spec.md) |
| With a provider widget — provider above the divider, step below | [A provider widget is supplied](specs/shared/ui/auth-sign-in/spec.md) |
| Without one — step alone, no divider | [No provider widget](specs/shared/ui/auth-sign-in/spec.md) |
| With legal copy — last node in the body | [Legal copy is supplied](specs/shared/ui/auth-sign-in/spec.md) |
| Without legal copy — no legal node | [Legal copy is omitted](specs/shared/ui/auth-sign-in/spec.md) |

Step-level loading and error states are unchanged: they belong to
`SignInEmailForm` and `SignInCodeForm` and travel on their own `pending` and
`error` props. The dialog's `message` slot stays a progress line, not an error
channel.
