# UI: guard sign-in commands

## Screens

No screen or Figma changes: the sign-in card keeps its layout. The only
behavioral delta a person can see is that the email step's idle control
refuses activation while the other control's request runs.

## Components

| Export | Package | Notes |
| --- | --- | --- |
| `SignInEmailForm` | `@grade10/ui` | Behavior only: both controls disabled while either command is in flight; each keeps `loading` tied to its own flag. Props unchanged. |
| `SignInCodeForm` | `@grade10/ui` | Unchanged — single command, its submit already carries the busy state. |
| `Button` | `@grade10/design-system` | Unchanged — `loading` and `disabled` already render the needed states. |

No new component, variant, or token.

## States

| State | Spec scenario |
| --- | --- |
| Send-link busy, send-code refusing but not busy | Only the running command looks busy |
| Send-code busy, send-link refusing but not busy | Only the running command looks busy |
| No duplicate request from re-activation | Activating again during flight does nothing |
| One sign-in email per intent | One sign-in email per intent |
| Both controls live again after settle | A settled request frees the step |
