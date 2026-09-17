# UI: sign-in link account mismatch

Behavior: [sign-in journeys](specs/shared/auth/sign-in/user-journeys.md). Layout
for the brand home is unchanged; this change is the warning toast with Switch
and Stay when a signed-in collector follows a link meant for another account.

## Screens

### Brand home — different-account toast

- **Figma** — [Toast `6332:3644`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=6332-3644)
  (`type=warning`, title, description with the link’s email, action + cancel,
  dismissible)
- **Capability** — `shared/auth/sign-in`
- **Review surface** — [`Auth Sign In/Link Follow Toasts` · Different account](../../../packages/ui/src/blocks/auth-sign-in/link-follow-toasts.stories.tsx)

The brand home itself is not redesigned; the toast sits over it after verify
detects a session that is not the link’s account.

## Components

| Export | Role |
| --- | --- |
| `Toast` / `toast.warning()` | Design-system overlay. Application mounts one `<Toast />` at root and fires `toast.warning` with catalog title, description (link email), `action` (Switch), `cancel` (Stay), and `duration: Infinity`. |
| `ToastClose` | Close control; same outcome as Stay. |

No `@grade10/ui` export is added or changed. Failed-follow error toasts stay as
they are under `sign-in-link-follow-feedback`.

**Missing / flagged for `tasks.md`**

| Missing | Kind | Where |
| --- | --- | --- |
| Shared `signIn` keys for mismatch title, description with email, Switch, Stay | copy | `@grade10/i18n` — every shared locale |
| App maps signed-in mismatch → toast; Switch / Stay / dismiss | product | application — after requirements |

No new design-system primitive, variant, or token. No new Figma component set.

## States

- Prompt — warning toast with link email in the description, Switch and Stay, no auto-dismiss — `shared-auth-sign-in-US-08`
- Switch — ends current session and enters the link’s account — `shared-auth-sign-in-US-08`
- Stay or dismiss — keeps current session; link does not enter — `shared-auth-sign-in-US-08`
