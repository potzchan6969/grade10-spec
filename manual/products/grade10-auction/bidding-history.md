---
title: Bidding History
spec: grade10-auction/bidding-history
order: 9
---

A collector can see where one listing stands, but cannot reconstruct what
happened across their bids: which action succeeded, why one failed, when their
private maximum changed, which competing bid left them outbid. That missing
explanation turns an auditable money decision into a support question.

The account keeps one retained bidding index: a scan-friendly list that opens
into a single chronological explanation per listing, combining the public
auction movements with that collector's own private events. Private facts stay
private — another bidder's maximum never appears, only the public consequence
that displaced them.

## Journeys

::journeys{id="grade10-auction/bidding-history"}
