---
title: Sessions
spec: shared/auth/sessions
audience: operator
order: 6
---

An operator holding the session-list grant can list one person's sessions by
user id. The listing names each session without ever carrying the secret that
authenticates it, so reading the list can never hand anyone a way in.

An operator holding the revoke grant can end one session or every session that
account holds. Revoking the session they are using signs them out, which is the
honest outcome rather than a special case.

This is the surgical version of a ban. A ban disables the whole account and
refuses new sign-ins; a revoke ends a session and leaves the person able to sign
in again, which is what a lost laptop needs. Signing out of the surface you are
on is a different capability again.

## What an operator does
