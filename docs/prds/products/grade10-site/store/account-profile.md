---
title: Account Profile
spec: grade10-site/store/account-profile
order: 7
---

The profile is the basic information a collector holds about themselves in
the store — display name, bio, avatar, and the address they signed in with —
read and edited on their own account page and shown to nobody else. It is
resolved from the session alone: a signed-out request is refused, and no
input selects another collector's profile.

## Always a profile

A collector who has never saved still sees a complete page: fields fall back
to what the session already knows, the empty states say what a field does
rather than that nothing exists, and reading stores nothing. A value the
collector never chose is not presented as theirs, and member-since appears
only once they have actually saved.

## The fields

Display name is required, trimmed, and at most 80 characters. Bio is
optional, trimmed, and at most 500. The avatar is an uploaded image the
collector can remove to fall back to initials. Email is the address they
signed in with, shown and never editable here.

## Saving

Editing is explicit: a save carrying no field at all is refused, and so is
one that would clear the display name. A failed read or save is reported
rather than hidden, and a failed save keeps the collector's input so nothing
typed is lost.
