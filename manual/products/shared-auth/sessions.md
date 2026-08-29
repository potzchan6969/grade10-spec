---
title: Where a person is signed in
summary: Listing one account's sessions and ending one or all of them.
spec: shared-auth/sessions
order: 6
---

An operator holding the session-list grant can list one person's sessions by
user id. The listing names each session without ever carrying the secret that
authenticates it, so reading the list can never hand anyone a way in.

An operator holding the revoke grant can end one session or every session that
account holds. Revoking the session they are using signs them out, which is the
honest outcome rather than a special case.

::spec{id="shared-auth/sessions" scenario="sessions-SC-08"}

This is the surgical version of a ban. A ban disables the whole account and
refuses new sign-ins; a revoke ends a session and leaves the person able to sign
in again, which is what a lost laptop needs. Signing out of the surface you are
on is a different capability again.

## What an operator does

::journeys{id="shared-auth/sessions"}

## The contract

::spec{id="shared-auth/sessions"}
