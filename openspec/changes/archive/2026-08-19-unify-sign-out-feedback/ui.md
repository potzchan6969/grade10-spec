# UI: unify sign-out feedback

## Screens

No screen changes and no Figma frames touched: every surface keeps its
existing sign-out button where it is (admin settings card, page headers, the
no-access card, both profile pages). The only visual delta is an inline
failure text beside the control, composed from existing exports.

## Components

| Export | Package | Notes |
| --- | --- | --- |
| `Button` | `@grade10/design-system` | Existing `loading` prop carries the busy state. No change. |
| `Text` | `@grade10/design-system` | Existing `tone="error"` + `size="sm"` carry the failure feedback ("Sign-out failed — try again."). No change. |

No new component, variant, or token — nothing to build in this repo.

## States

| State | Spec scenario |
| --- | --- |
| Sign-out control busy, further taps ignored | The control is busy while sign-out runs |
| Admin panel back on its sign-in page | An operator signs out of an admin panel |
| grade10 site back on the marketing page | A collector signs out of the grade10 site |
| Inline failure text beside the control, still signed in | A refused sign-out is reported |
| Failure text cleared on the next attempt | A retry clears the failure |
