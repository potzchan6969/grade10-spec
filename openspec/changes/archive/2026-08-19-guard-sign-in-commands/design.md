# Design: guard sign-in commands

## Context

Requirements: [`specs/shared/auth/sign-in/spec.md`](specs/shared/auth/sign-in/spec.md).

Sign-in commands live in the `grade10` repo's auth frontend package as the
mutation shape (`run` + `pending`) over `useState`; the email step's form is
`SignInEmailForm` in this repo's `packages/ui`, already receiving both
commands' in-flight flags (`submitting`, `requestingCode`). The sibling
sign-out command gained an in-flight guard in `unify-sign-out-feedback`;
this change extends the category fix to sign-in.

## Decisions

### The command guards itself, the same way sign-out does

Each sign-in command keeps an in-flight ref: a second activation returns the
running request's promise instead of starting a duplicate. The guard lives in
the shared command helper the three sign-in commands already flow through, so
one edit covers send-link, send-code, and verify.

- **Rejected: rely on button `loading` wiring.** That is today's masking —
  it regresses silently wherever a surface forgets to pass the flag, the
  exact risk the sign-out design recorded before its fix.
- **Rejected: per-use-case guards.** The commands share one helper; guarding
  each use case separately re-implements the same ref three times.

### Joined activations drop edited input

Unlike sign-out, these commands carry input (email, code). Joining the
in-flight promise means an activation with edited input during flight is
ignored, not queued — the spec says so explicitly, so the trade-off is a
requirement rather than a surprise. The window is one request round-trip;
the settled state accepts the corrected input immediately.

- **Rejected: cancel-and-restart on new input.** The transport offers no
  cancellation, and racing a superseded request against its replacement
  reintroduces the ambiguity this change removes.

### The email step gates cross-command in the form, from existing props

`SignInEmailForm` disables both controls when `submitting || requestingCode`;
each button keeps `loading` tied only to its own flag, which is what makes
"only the running command looks busy" hold. No new prop, export, or token —
both flags already arrive.

- **Rejected: gating in the flow (feeding each button the OR of both
  flags as its busy state).** Both buttons would spin for one action —
  wrong feedback, and every consumer of the form would have to repeat it.
- **Rejected: a new `disabled` prop on the form.** It would hand the
  invariant back to each caller; the form holds both flags and can enforce
  it once.

## Risks / Trade-offs

- A double-tap intending "resend" is absorbed; a genuine resend needs the
  first request to settle. Accepted — the settle window is short and the
  alternative is duplicate emails.
- The hook guard and the form gating land in different repos; between the
  `packages/ui` change landing and the submodule bump, the form's gating is
  inert in the app. Harmless — it tightens, never loosens.

## Migration Plan

None. No export, prop, wire, or data changes; the `grade10` repo picks up
the form behavior with its next `external/grade10-spec` submodule bump.

## Open Questions

None.
