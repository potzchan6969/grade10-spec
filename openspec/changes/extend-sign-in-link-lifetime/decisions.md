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
| 1 | How long does a sign-in link last? | Five minutes | Fifteen, which is what the email already promised and would need no copy edit — but it leaves an intercepted inbox openable for a quarter of an hour to save one line of copy in four languages |
| 2 | The email promises fifteen minutes. Which side moves? | The copy: the email says five minutes (recommended) | Dropping the number from the email — "it expires shortly" — which never has to move again, and tells the collector nothing they can act on |
| 3 | Why lengthen it at all? | Mail reaches collectors later than sixty seconds; the dead link is ordinary delivery, not misuse | Treating the expired toast as the fix, which explains the failure rather than removing it |
