---
title: Profile Blocks
spec: shared/ui/store-profile
order: 10
---

Three blocks make the account profile, rendered the same way by both brands'
stores: a card that frames the surface, the read view of a collector's basic
information, and the form that edits it. The details and the form render
without the card, so a surface takes the part it needs.

## Blocks

- **Card** — shows whichever body the application selects: loading, empty,
  failed or ready; it decides nothing itself
- **Read view** — shows the display name, bio and meta it is given, and
  defaults none of them
- 🚧 **Edit control** — the read view offers editing only when the application
  names it and handles it
- **Form** — edits the display name and bio, and reports what the collector
  submitted
- 🚧 **Avatar** — the read view and the form show the image they are given,
  and the fallback the application supplies when there is none or it fails to
  load; the form lets the collector choose a new image, preview it, or remove
  the current one, and judges no file
- 🚧 **Email** — the read view and the form show the address they are given,
  and neither edits it
- **Saving** — while a save is pending, the form's save shows busy and
  cannot be sent again

## Left to the Application

What is valid, what is stored, and every word on screen belong to the
application.

- 🚧 **Limits** — the form applies only the length limits the application
  passes, and refuses nothing itself; a refusal reaches the collector through
  the error the application supplies

The rules those props carry — the field limits, what falls back where — are
[the account profile](/p/grade10-site/account/profile); this capability is
the component contract underneath it.
