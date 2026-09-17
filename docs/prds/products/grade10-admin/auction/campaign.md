---
title: Campaigns
spec: grade10-admin/auction/campaign
audience: operator
order: 12
---

A campaign is a catalogue cover: an event that many listings belong to, with a
title and copy of its own and deliberately no clocks and no money. The console
calls it a campaign everywhere and never a sale, a word kept for store checkout
and sold stock.

## Values

| Rule | Value |
| --- | --- |
| Title | Required, trimmed, **1 to 200** characters |
| Copy | Optional, up to **4,000** characters |

## Lifecycle

| Status | Reached when | Offered |
| --- | --- | --- |
| **Draft** | An operator opens the campaign with a title; on no public cover | Edit, Create, Cancel |
| **Created** | The operator creates it; still on no public cover | Edit, Publish, Cancel |
| **Published** | The operator publishes; the cover is public, and each listing under it still publishes on its own | Edit, Cancel |
| **Canceled** | Called off from any of the three; each listing still under it is called off under [the listing rules](/p/grade10-admin/auction/listing) | Nothing: read-only, no edit, no second cancel |

- **Grants** — authoring takes the catalogue grant and calling off the
  call-off grant; a control the operator lacks the grant for is not offered
- **A listing joins** — from the listing editor's Campaign picker, which
  offers draft and created campaigns only — [Listing
  Management](/p/grade10-admin/auction/listing)

## Editor

- **One editor** — authors a campaign end to end; a write that clears the
  title is refused

::cases{id="grade10-admin/auction/campaign"}
