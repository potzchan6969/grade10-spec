## Screens

No new screen. This change adds one new state to an existing surface —
the sign-in dialog's Check Your Email step — and expresses it as a toast on
the composing application's page, not as a dialog state of its own. There is
no new Figma frame: the toast composes the design system's existing `Toast`
component set (Figma `Toast`, `6332:3644`, cited in
`packages/design-system/src/components/overlays/toast.tsx`) with new copy,
the same way the existing link-follow and mismatch toasts do
(`::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4666-1488" title="Login Dialog"}`
remains the frame of record for the dialog itself, unchanged by this
change).

## Components

- `Toast` / `toast.info` — `@grade10/design-system/components/overlays/toast`.
  Existing primitive, existing `info` rung; no new variant.
- `SignInLinkSent` — `@grade10/ui`'s `packages/ui/src/blocks/auth-sign-in/sign-in-link-sent.tsx`.
  Unchanged export and props. The consuming application unmounts this step
  (closing the dialog) rather than the component growing a new prop or
  internal state for "settled elsewhere" — the toast, not the card, carries
  the message, matching how a failed link follow and a signed-in mismatch
  are already handled on this surface.
- New copy, delivered with this change: `signIn.settledElsewhere` in
  `packages/i18n/messages/shared/{en,zh-Hans,zh-Hant,ko}/signIn.json` —
  "Signed in on another device." (and each language's equivalent). Answered
  in `shared/` only; no brand claims it.
- New Storybook story: `Auth Sign In/Link Follow Toasts` →
  `Settled elsewhere`, in
  `packages/ui/src/blocks/auth-sign-in/link-follow-toasts.stories.tsx`,
  alongside the existing failure and mismatch toasts it shares a file with.

Nothing else is missing: the dialog-close mechanism itself, and the
client-side detection that triggers it, are the consuming application's
wiring (`tech-design.md`'s and `tasks.md`'s concern in the `grade10` repo),
not a component or token gap in this repository.

## States

### Sign-in dialog, Check Your Email step

| State | Shows | Anchor |
| --- | --- | --- |
| Settled elsewhere | The dialog closes without a reload; the surface shows the `signIn.settledElsewhere` toast (`toast.info`, no action buttons, default auto-dismiss); the surface is not signed in | `shared-auth-sign-in-SC-70`, `SC-71`, `SC-72` |
| Settled elsewhere, another surface open | The same toast and close happens independently on every surface waiting on that address, not only the one that asked | `shared-auth-sign-in-SC-75` |
| A failed attempt elsewhere | No change: Check Your Email keeps showing, Resend keeps counting down, no toast fires | `shared-auth-sign-in-SC-74` |

This change's `spec.md` was written before this file — an inversion of the
usual order, since QA's round ran first. The rows above are closed already
rather than left pointing at the journey; there is no blind pass left to
protect from seeing them.
