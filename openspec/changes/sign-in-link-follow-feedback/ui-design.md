# UI: sign-in link follow feedback

Behavior: [sign-in delta](specs/shared/auth/sign-in/spec.md). Layout for the
brand home is unchanged; this change is the three error toasts after a
magic-link follow that creates no session. How the reason reaches the client
is [tech-design.md](tech-design.md).

## Screens

### Brand home — failed link follow toast

- **Figma** — [Toast `6332:3644`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=6332-3644)
  (`type=error`, title only, dismissible, no action)
- **Capability** — `shared/auth/sign-in`
- **Review surface** — [`Auth Sign In/Link Follow Toasts`](../../../packages/ui/src/blocks/auth-sign-in/link-follow-toasts.stories.tsx)

The brand home itself is not redesigned; the toast sits over it after verify
redirects home.

## Components

| Export | Role |
| --- | --- |
| `Toast` / `toast.error()` | Design-system overlay. Application mounts one `<Toast />` at root and fires `toast.error` with catalog copy. |
| `ToastClose` | Close control on the toast (Figma `Toast / Close` `6332:3599`). |

No `@grade10/ui` export is added or changed. `SignInCard` and
`SignInEmailForm` stay the request dialog; send-path failures remain inline
on the field.

**Missing / flagged for `tasks.md`**

| Missing | Kind | Where |
| --- | --- | --- |
| App maps verify failure → toast on brand home | product | application — tasks group 2 |

No new design-system primitive, variant, or token. No new Figma component set.

## States

| Surface state | Spec scenarios |
| --- | --- |
| Expired — error toast, expired copy | `shared-auth-sign-in-SC-37` |
| Used — error toast, no-longer-works copy | `shared-auth-sign-in-SC-38` |
| Superseded — error toast, no-longer-works copy | `shared-auth-sign-in-SC-39` |
| Invalid / unknown — error toast, no-longer-works copy | `shared-auth-sign-in-SC-40` |
| Banned — error toast, cannot-sign-in copy (no resend nudge) | `shared-auth-sign-in-SC-41` |
