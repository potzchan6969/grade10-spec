---
title: Sessions
spec: shared/auth/sessions
audience: operator
order: 6
---

## Listing

An operator holding the session-list grant lists one person's sessions by user id. The listing names each session without ever carrying the secret that authenticates it, so reading the list can never hand anyone a way in.

- 🚧 **The list names the surface** — each session reads as a site or a console session, so an operator can tell where a person is signed in
- 🚧 **A session from before release reads as the site's** — one made before the separation carries no surface and is listed as a site session

## Revoke

An operator holding the revoke grant can end one session or every session that account holds. Revoking the session they are using signs them out, which is the honest outcome rather than a special case.

- 🚧 **Ending every session ends both** — revoking all of an account's sessions closes its site and console sessions alike, and a ban does the same
- **Closes within 70 seconds** — a revoked session stops answering signed in on every read within 70 seconds, not only on a mutation or an elevated call. A browse page's cached copy of the session would otherwise last five minutes. Seventy, not zero: the session store takes up to a minute to reach every location

## Ban or Revoke

- **Ban** — disables the whole account and refuses new sign-ins — [Users](/p/shared/auth/users)
- **Revoke** — ends a session and leaves the person able to sign in again. That is what a lost laptop needs
- **Sign-out** — ends the surface you are on, and is a different capability again — [Sign-Out](/p/shared/auth/sign-out)

:::detail{title="Product decisions" for="pm"}
| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Browse reads | Decided | A revoke closes the cached browse read too, instead of the requirement naming a five-minute lag for browse pages. | Product |
| Closing bound | Decided | 70 seconds everywhere: the session store's one-minute spread plus a 10-second margin. Not "the next read", which only the location that made the change can keep. | Engineering |
| Under a minute | Decided | Not offered. It needs sessions off the edge session store, a rebuild of sign-in rather than a revoke fix. | Engineering |
:::
