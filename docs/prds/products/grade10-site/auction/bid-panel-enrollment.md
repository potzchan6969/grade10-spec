---
title: Bid panel enrollment
spec: grade10-site/auction/bid-panel-enrollment
order: 6
---

Before a collector’s first bid on a lot, the bid panel walks them through sign-in,
card linking, and age attestation in one setup modal. The linked card sits below
the bid panel — empty until enrollment completes, editable until the first bid,
then locked for that lot.

Authorization and holds belong to [Payment method](/p/grade10-site/auction/bid-payment-method).
Auto-bid confirmation belongs to [Auto bidding](/p/grade10-site/auction/auto-bidding).

::story{id="auction-listing-bid-panel--signed-out" title="Signed out"}
::story{id="auction-listing-bid-panel--need-card" title="Need card"}
::story{id="auction-listing-bid-panel--setup-modal" title="Setup modal"}
::story{id="auction-listing-bid-panel--linked-card-editable" title="Linked card with change"}
::story{id="auction-listing-bid-panel--linked-card" title="Linked card after first bid"}
