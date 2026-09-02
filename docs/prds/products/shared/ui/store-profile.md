---
title: Profile Blocks
spec: shared/ui/store-profile
order: 10
---

Three blocks make the account profile, rendered the same way by both brands'
stores: a card that frames the surface, the read view of a collector's basic
information, and the form that edits it. The details and the form render
without the card, so a surface takes the part it needs.

The card shows whichever body the application selects — loading, empty,
failed, or ready — and decides nothing itself. The read view shows the
avatar, display name, email, bio and meta it is given, defaulting none of
them, and the avatar falls back when there is no image to show. The form
edits the avatar alongside the text fields and reports what the collector
submitted; what is valid, what is stored, and every word on screen belong to
the application.

The rules those props carry — the field limits, what falls back where — are
[the account profile](/p/grade10-site/store/account-profile); this capability is
the component contract underneath it.
