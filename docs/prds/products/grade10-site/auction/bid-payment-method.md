---
title: Payment Method
spec: grade10-site/auction/bid-payment-method
order: 5
---

A bid is honest only when funds sit behind it. Linking a card lives on
[Bid panel enrollment](/p/grade10-site/auction/bid-panel-enrollment); when the
collector commits a maximum, Grade10 authorizes a hold on that linked card in
the background — no confirmation modal — and binds the method to them and the
listing so a raise does not ask again.

Exactly one manual-capture authorization covers the submitted maximum. Raising
the maximum updates that same authorization rather than stacking a second hold,
so a bidder's bank statement carries one pending amount per listing. A decline,
unusable method, or provider failure surfaces on or near the bid action before
the bid stands; a failed raise leaves the prior maximum in place.
