## Goals

- A collector signed in as one account who opens a sign-in link meant for
  another is told, and chooses Switch or Stay, rather than being moved without
  asking
- Switch enters the link’s account; Stay or dismiss keeps the current session
  and does not enter the link’s account
- The toast names the mismatch, and its description names the link’s email so
  Switch is clear

## Non-Goals

- Changing expired, dead, or banned failure toasts when no session is created
- A success toast when a link signs someone in with no session conflict
- Showing the current session’s email on the toast — only the link’s email
- Wiring verify, redirect, or session switch in the application in this pass —
  Storybook is the design reference; app work follows once requirements land
- A new `@grade10/ui` export that fires the toast
- Cross-tab session sync

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | What happens when a signed-in person follows a link for a different account? | Keep the current session and show a choice toast. Never replace the session on follow alone. | Automatically signing them into the link’s account. |
| Q2 | What does the toast offer? | **Switch** enters the link’s account; **Stay** keeps the current session. | A single dismiss-only notice, or a blocking dialog. |
| Q3 | What does dismiss (X) mean? | Same as Stay — keep the current session and do not enter the link’s account. | Leaving the link pending until they choose, or treating dismiss as Switch. |
| Q4 | Does the toast show an email? | Yes — the link’s email in the description, so Switch is clear. Title still names the mismatch only. | Title only with no email, or naming the current session’s email. |
| Q5 | Which toast type? | Warning, and it stays until Switch, Stay, or dismiss. | An error toast that auto-dismisses like the failed-follow toasts. |
| Q6 | New change or extend `sign-in-link-follow-feedback`? | New change. That change owns follows that create no session; this one owns a signed-in mismatch with a choice. | Folding the choice into the failed-follow change. |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
