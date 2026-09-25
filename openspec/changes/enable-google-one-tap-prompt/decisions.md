## Goals

- A signed-out collector on a brand that offers Google sign-in is offered
  Google's own prompt without opening sign-in first.
- The prompt never competes with the sign-in dialog for the collector's
  attention.

## Non-Goals

- Provisioning Google sign-in for a brand that does not already have it —
  zzz-site has no Google client id yet, and this change does not add one.
- Admin and operator sign-in (grade10-admin, zzz-admin) — always-logged-in
  staff surfaces are unaffected.
- A staged or gated rollout — the repository carries no feature-flag
  platform, and this change does not build one.
- Withholding the prompt on specific pages such as checkout.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | How does the prompt coordinate with the app's own sign-in dialog, which today owns every other "please sign in" ask? | Suppressed while the dialog is open; opening the dialog dismisses an already-showing prompt. Only one sign-in ask is ever visible. | Letting both show independently — a visitor could see the corner prompt and the dialog at once |
| Q2 | Which brands and apps get the prompt in this change? | Wherever Google sign-in is already brand-offered — grade10-site now; zzz-site automatically once a separate change gives it a Google client id. Admin and operator apps are out of scope. | Explicitly listing zzz-site as in scope now — it has no Google client id, so nothing would show; scoping this change to grade10-site only, which would need a second change the day zzz gets a client id, for a rule that already says "wherever Google is offered" |
| Q3 | How does this ship, given no feature-flag platform exists? | To all eligible traffic at merge. | An ad hoc app-env percentage or environment gate built for this one change — the behavior is easily reverted, and the moving part would outlive the rollout it was built for |
| Q4 | Does the prompt show on every page, or is it withheld on some (e.g. checkout)? | Every page a signed-out collector visits. | Withholding it on checkout or payment steps — no evidence a corner prompt interferes there, and an allow/deny list is upkeep with nothing to justify it |
| Q5 | After the sign-in dialog dismisses an already-showing prompt and the collector closes the dialog without signing in, does the prompt stay suppressed for the rest of the visit, or can it reappear on a later page? | Stays suppressed for the rest of the visit. | Reappearing on a later page — every page is independently eligible, but a collector who already engaged and walked away gets no second ask that visit |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| shared/auth/sign-in | Blind pass: after the sign-in dialog dismisses a showing prompt and the collector closes it without signing in, does the prompt stay suppressed for the rest of the visit, or can it reappear on a later page in the same visit? | Q5 |
