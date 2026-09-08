---
title: Profile
spec: grade10-site/store/account-profile
order: 1
---

The profile is what a collector says about themselves in the store, on their
own account page and shown to nobody else.

- **Fields**
  1. **Display name** — required, at most **80** characters; two collectors
     may share one
  2. **Bio** — optional, at most **500** characters
  3. **Avatar** — a JPEG, PNG, or WebP up to **5 MB**; removed, the
     initials of the display name stand in
  4. **Email** — the address signed in with, shown and not editable here
  5. **Member since** — the first save; absent until then
- **Always a page** — a collector who has never saved still sees every
  field, filled from what sign-in already knows, and an empty field says what
  it is for
- **Editing** — explicit: edit, then save or cancel; a save that would clear
  the display name is refused, and a failed save keeps what was typed
- **URL** — `grade10.com/profile`; signed out, it asks for sign-in

## Designs

::story{id="store-profile-profilecard--default" title="The profile, read"}

::story{id="store-profile-profilecard--editing-body" title="The profile, being edited"}

::story{id="store-profile-profilecard--error-state" title="A read that failed"}
