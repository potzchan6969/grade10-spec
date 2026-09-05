---
title: Campaigns
spec: grade10-admin/auction/campaign
audience: operator
order: 12
---

A campaign is a catalogue cover — an event that many listings belong to, with
a title and copy of its own and deliberately no clocks and no money. The
console calls it a campaign everywhere and never a sale: that word is kept
for store checkout and sold stock, which a cover is neither.

## The lifecycle

A campaign walks draft → created → published, and any of the three can be
called off to canceled. A draft is an operator's private start and appears on
no public cover; creating it makes it publishable; publishing makes the cover
public without publishing a single listing under it — each listing publishes
on its own. Cancelling a campaign also cancels the listings still under it,
under [the listing rules](/p/grade10-admin/auction/listing), and a canceled
campaign opens read-only: title and copy visible, nothing writable, no second
cancel.

## The editor

One editor authors a campaign end to end. Title is required — trimmed, one to
two hundred characters, and a write that clears it is refused; copy is
optional, up to four thousand. Create, publish and cancel appear exactly when
the campaign's status and the operator's grants allow them: authoring takes
the catalogue grant, calling off takes the call-off grant. The listing editor
offers a campaign picker, so a lot joins its event where the lot is authored.

::journeys{id="grade10-admin/auction/campaign"}
