---
title: Sessions
spec: shared/auth/sessions
audience: operator
order: 6
---

## Listing

An operator with the session-list grant lists one person's sessions by user id. The list never shows the secret that signs a session in, so reading it gives no one a way in.

- 🚧 **The list names the surface** — each session reads as a site or console session, so an operator can tell where a person is signed in
- 🚧 **Sessions from before release read as the site's** — one made before the separation has no surface, and is listed as a site session

## Revoke

An operator with the revoke grant can end one session, or every session an account holds. Revoking the session they are using signs them out too.

- 🚧 **Ending every session ends both** — revoking all of an account's sessions closes its site and console sessions alike. A ban does the same
- **Admins are protected** — nobody can revoke a session of an account holding `admin`, unless the caller holds `admin`
- **Closes within 70 seconds** — a revoked session stops answering signed-in reads within 70 seconds, on every read. Not only on a change or an elevated call. A browse page's cached session would otherwise last five minutes. Seventy, not zero: the session store takes up to a minute to reach every location

## Ban or Revoke

- **Ban** — disables the whole account and refuses new sign-ins — [Users](/p/grade10-site/account/users)
- **Revoke** — ends a session and leaves the person able to sign in again. That is what a lost laptop needs
- **Sign-out** — ends the surface you are on. It is a separate capability — [Sign-Out](/p/grade10-site/account/sign-out)

:::detail{title="Product decisions" for="pm"}
| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Browse reads | Decided | A revoke closes the cached browse read too, instead of the requirement naming a five-minute lag for browse pages. | Product |
| Closing bound | Decided | 70 seconds everywhere: the session store's one-minute spread plus a 10-second margin. Not "the next read", which only the location that made the change can keep. | Engineering |
| Under a minute | Decided | Not offered. It needs sessions off the edge session store, a rebuild of sign-in rather than a revoke fix. | Engineering |
:::
