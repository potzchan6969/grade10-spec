## Goals

- An open cart drawer closes by itself when the member it was open for is signed out, in another tab or by expiry.
- The close says nothing: no toast and no notice.
- A guest's drawer, and a drawer open across a switch from one member to another, stay open.

## Non-Goals

- Emptying this browser's cart on sign-out. That stays with `shared/auth/sign-out`.
- Closing or withdrawing anything else a tab holds open when its session ends. The pages that need a session keep asking for one, as `shared/auth/session` states.
- Opening the cart again when the collector signs back in.
- A notice, a toast or a prompt to sign in as the drawer closes.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Should an already-open cart close silently when this site's session ends in another tab? | Close silently - decided by the product owner on #625, 2026-10-09 | Staying open and empty, as it does today: the drawer reads as a cart with nothing in it, beside a header that says Sign In |
| Q2 | Does a guest's drawer close when the session reads as signed out? | No. Only a member's session ending closes it; a guest never had a session to lose - decided by the round (recommended) | Closing on every signed-out reading, which would shut a guest's drawer the moment they open it, against the durable rule that a signed-out Cart press opens the same drawer |
| Q3 | Does a session still being read close the drawer? | No. A reading in flight decides nobody, so a member whose session is still good never sees the drawer shut - decided by the round (recommended) | Closing on the first reading that is not a member, which would shut the drawer during a routine re-read |
| Q4 | Does a switch from one member to another close the drawer? | No. The drawer shows the new member's cart, as `shared/auth/session` already asks of every tab - decided by the round (recommended) | Closing on any change of person, which discards what the new member's own cart is showing and is not what the product owner asked |
| Q5 | When checkout meets an expired session and the sign-in dialog opens, does the drawer stay open behind it? | No. It closes like any other end of a member's session, and signing back in does not reopen it - decided by the round (recommended), confirmed by @seankcw, 2026-10-16 | Reopening the drawer on sign-in from that path, which keeps the member at Proceed to Checkout but makes one path the exception to a rule the product owner stated without one |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
