## Goals

- A collector who reads their mail on another device still has a link that
  works when they get there.
- The email's promise and the link's lifetime say the same number.

## Non-Goals

- **The resend wait.** Sixty seconds between sends stays as it is; this moves
  only how long the link already sent survives.
- **Newest-mail-wins.** A later send still kills the earlier link, whatever is
  left of its lifetime.
- **One-time use.** A followed link still signs in once.
- **What a failed follow says.** The expired, no-longer-works and cannot-sign-in
  toasts are `sign-in-link-follow-feedback`'s.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | How long does a sign-in link last? | Five minutes | Fifteen, which is what the email already promised and would need no copy edit — but it leaves an intercepted inbox openable for a quarter of an hour to save one line of copy in four languages |
| Q2 | The email promises fifteen minutes. Which side moves? | The copy: the email says five minutes (recommended) | Dropping the number from the email — "it expires shortly" — which never has to move again, and tells the collector nothing they can act on |
| Q3 | Why lengthen it at all? | Mail reaches collectors later than sixty seconds; the dead link is ordinary delivery, not misuse | Treating the expired toast as the fix, which explains the failure rather than removing it |
| Q4 | May the email carry an absolute expiry time beside the duration? | No — the duration is the only form the promise takes | A timestamp as well, which is a second promise to keep in step with the first |
| Q5 | Does the confirmation dialog tell a collector how long they have? | No — the promise lives in the email, where the link is | Putting the lifetime on Check Your Email too, which adds a surface this change does not own |
| Q6 | Is five minutes fixed, or settable per environment or brand? | One lifetime, everywhere | A configurable number, which the email's promise would then have to follow |

## Raised

The blind reading of 2026-09-17 asked ten questions. Six it settled from the
store, or the run folded into the requirements, and those stay on the suite's
`## Reconciliation`. These five needed an answer from outside the input.

| Capability | Raised | Landed |
| --- | --- | --- |
| `shared/auth/sign-in` | Does the link's lifetime bound the session it creates? | ❓ on the Session page — `shared/auth/session` states no session lifetime at all |
| `shared/auth/sign-in` | May the email carry an absolute expiry time beside the duration? | Q4 |
| `shared/auth/sign-in` | Does the confirmation dialog tell a collector how long they have? | Q5 |
| `shared/auth/sign-in` | Is five minutes fixed, or settable per environment or brand? | Q6 |
| `shared/auth/sign-in` | Does every locale write the number the same way — a digit everywhere, or each language's own word for five? | ❓ on the Sign-in page |
