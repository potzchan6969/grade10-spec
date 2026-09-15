# UI: magic-link-sent-modal

Behavior:
[auth sign-in delta](specs/shared/auth/sign-in/spec.md),
[UI auth-sign-in delta](specs/shared/ui/auth-sign-in/spec.md).

No separate Figma frame for the link-sent body yet — layout composes the
existing [Login Dialog `4666:1488`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4666-1488)
shell with the new step. A frame, when design publishes one, replaces that
assumption.

## Screens

### Login Dialog — link sent

- **Shell** —
  [Login Dialog `4666:1488`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4666-1488);
  Storybook `Auth Sign In/SignInCard` → **Link sent**
  (`auth-sign-in-signincard--link-sent`)
- **Capability** — `shared/ui/auth-sign-in`, `shared/auth/sign-in`

The consumer omits `providerSlot` while this step shows. Back restores the
entry composition (Google when offered + email step).

### Login Dialog — email entry CTA

- **Shell** — same Login Dialog frame; Storybook
  `Auth Sign In/SignInCard` → **Default** and
  `Auth Sign In/SignInEmailForm` stories use **Sign In with Email**
- **Capability** — `shared/auth/sign-in`

## Components

| Export | Package | Role |
| --- | --- | --- |
| `SignInCard` | `@grade10/ui` | Existing dialog shell; consumer owns `open` / `onOpenChange` and which step is `children` |
| `SignInEmailForm` | `@grade10/ui` | Existing email step; `copy.submit` is **Sign In with Email** |
| `SignInLinkSent` | `@grade10/ui` | **New** — confirmation copy, Resend (`onResend`, cooldown via `resendCooldownRemaining`), Back (`onBack`) |
| `Button` | `@grade10/design-system` | Resend and Back controls |
| `Text` | `@grade10/design-system` | Confirmation message |

**Missing / flagged for `tasks.md`**

| Missing | Kind | Where |
| --- | --- | --- |
| `SignInLinkSent` export + stories | compound | `packages/ui` |
| Shared `signIn` catalog keys for confirmation, Resend, Back, CTA | product | `@grade10/i18n` |

## States

| Surface state | Spec scenarios |
| --- | --- |
| Link sent — confirmation names address; Resend counts down (**Resend (n)**); Back present | `shared-auth-sign-in-SC-42`, `shared-auth-sign-in-SC-46`, `shared-ui-auth-sign-in-SC-13`, `shared-ui-auth-sign-in-SC-14` |
| Resend activates `onResend` when cooldown is over | `shared-auth-sign-in-SC-43`, `shared-auth-sign-in-SC-47`, `shared-ui-auth-sign-in-SC-11`, `shared-ui-auth-sign-in-SC-15` |
| Successful resend restarts the sixty-second countdown | `shared-auth-sign-in-SC-48` |
| Back activates `onBack`; entry step (Google + email) returns | `shared-auth-sign-in-SC-44`, `shared-ui-auth-sign-in-SC-12` |
| Email-step CTA is **Sign In with Email** | `shared-auth-sign-in-SC-45` |
| Sign-in link lasts sixty seconds | `shared-auth-sign-in-SC-49` |
