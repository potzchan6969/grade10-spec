---
title: Session
spec: shared/auth/session
order: 2
---

Reading the caller on a signed-in request gives four things: id, email, name and
roles. Reading it on a signed-out request gives no person at all — there is no
half-signed-in state for a product to interpret.

The user id is the only identity key. Account data and one person's reference to
another are stored against it; an email is an attribute of the account, never
the thing it is filed under. That is what makes changing an address a change of
data rather than a migration.

Signing in covers the brand. Every site of that brand sees the same person, and
no site of another brand sees them at all.

Analytics follows the same key: a signed-in event names the person by user id,
an anonymous one names the device, and signing in links that device to the
person so a visit does not read as two strangers. Which events a product records
is that product's business.
