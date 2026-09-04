# UI: Who is signed in

## Screens

No published Figma frames. This change does not add a frame.

### Sign-in

Collector sites and admin panels, both brands, compose `auth-sign-in`.
Copy is brand-owned. Google is a slot only when the brand has it.

A product that has verified an email creates or signs in the account with
no collector sign-in screen. Checkout UI belongs to the store.

## Components

| Export | Package | Notes |
| --- | --- | --- |
| `SignInCard` | `@grade10/ui` | Unchanged. |
| `SignInEmailForm` | `@grade10/ui` | Unchanged. |
| `SignInCodeForm` | `@grade10/ui` | Unchanged. |

No new component, variant, or token.

## States

| State | Spec scenario |
| --- | --- |
| Link sent | A valid link creates a session; A first send does not disclose whether the address is new |
| Send wait | A second link send in a minute is told to wait |
| Link send failed | A failed send is reported |
| Code step | A correct code creates a session |
| Wrong code | An incorrect code is refused |
| Expired or locked code | An expired code is refused; Too many wrong codes kill the code |
| Google present | A brand with Google sign-in offers it |
| Google absent | A brand without Google sign-in hides it |
