---
title: Sessions
spec: shared/auth/sessions
audience: operator
order: 6
---

An operator holding the session-list grant can list one person's sessions by
user id. The listing names each session without ever carrying the secret that
authenticates it, so reading the list can never hand anyone a way in.

## Revoke

An operator holding the revoke grant can end one session or every session that
account holds. Revoking the session they are using signs them out, which is the
honest outcome rather than a special case.

This is the surgical version of a ban. A ban disables the whole account and
refuses new sign-ins; a revoke ends a session and leaves the person able to sign
in again, which is what a lost laptop needs. Signing out of the surface you are
on is a different capability again.

- **Closes within 70 seconds** — a revoked session stops answering signed
  in on every read within 70 seconds, not only on a mutation or an elevated
  call, rather than after the five minutes a browse page's cached copy of the
  session would otherwise last. Seventy, not zero: the session store takes up
  to a minute to reach every location.

:::detail{title="Product decisions" for="pm"}
| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Browse reads | Decided | A revoke closes the cached browse read too, instead of the requirement naming a five-minute lag for browse pages. | Product |
| Closing bound | Decided | 70 seconds everywhere: the session store's one-minute spread plus a 10-second margin. Not "the next read", which only the location that made the change can keep. | Engineering |
| Under a minute | Decided | Not offered. It needs sessions off the edge session store, a rebuild of sign-in rather than a revoke fix. | Engineering |
:::
