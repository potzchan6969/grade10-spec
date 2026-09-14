# UI — remove-sign-in-code

## Screens

| Surface | Figma |
| --- | --- |
| Sign-in dialog, email step | [`Login Dialog` 4666:1488](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4666-1488) |

The `Login Dialog` frame draws one send action under the email field and no
code action, so the shipped dialog moves toward the frame rather than away
from it. The `OTP Dialog` frame beside it has no surface left to draw once
this change ships; whether design retires the frame is the proposal's open
question and holds nothing here.

## Components

From `@grade10/ui`, changing in this change:

- `SignInCard` — unchanged in shape; its only step is now the email step.
- `SignInEmailForm` — loses `copy.codeAction`, `requestingCode` and
  `onRequestCode`; renders the email field and one submit.
- `SignInCodeForm`, `SignInCodeFormCopy`, `SignInCodeFormProps` — removed
  from the public entry, with their stories.

From `@grade10/design-system`, all existing and unchanged: `Dialog`,
`DialogContent`, `DialogHeader`, `DialogTitle`, `DialogBody`, `Divider`,
`TextInput`, `Button`, `Text`.

Nothing new is needed in `packages/design-system`.

## States

| State | Spec scenario |
| --- | --- |
| Email step, one send action, no code control | [The email step has no code control](specs/shared/auth/sign-in/spec.md) |
| Send in flight — the one control busy, a second activation ignored | [Activating again during flight does nothing](../../specs/shared/auth/sign-in/spec.md) |
| Sent — the inbox message under the step | [A valid link creates a session](../../specs/shared/auth/sign-in/spec.md) |
| Refused — the wait message on the field | [A second link send in a minute is told to wait](specs/shared/auth/sign-in/spec.md) |
| Failed — the not-sent message on the field | [A failed send is reported](../../specs/shared/auth/sign-in/spec.md) |

The code step's states — the code sent hint, a wrong code, a spent code —
have no scenario behind them any more and no screen.
