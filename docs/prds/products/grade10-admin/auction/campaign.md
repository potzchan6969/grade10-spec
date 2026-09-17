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

| Status | Meaning |
| --- | --- |
| **Draft** | An operator's private start; on no public cover |
| **Created** | Publishable |
| **Published** | The cover is public; each listing under it still publishes on its own |
| **Canceled** | Called off from any of the three; read-only, with its listings cancelled under [the listing rules](/p/grade10-admin/auction/listing) |

- **Cancelling** — also cancels the listings still under the campaign, and a
  canceled campaign opens read-only: title and copy visible, nothing
  writable, no second cancel

## Editor

- **One editor** — authors a campaign end to end; a write that clears the
  title is refused
- **Actions by state and grant** — Create, Publish and Cancel appear exactly
  when the campaign's status and the operator's grants allow them: authoring
  takes the catalogue grant, calling off takes the call-off grant
- **From the listing** — the listing editor offers a campaign picker, so a lot
  joins its event where the lot is authored

::cases{id="grade10-admin/auction/campaign"}
