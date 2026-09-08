---
title: Inventory
icon: package
---

Inventory is the house ledger for physical stock more than one application
consumes. One snapshot per catalogue product answers how much Grade10 holds
and where every unit stands — available, reserved, vaulted, sold, withdrawn —
and every hold names its consumer explicitly: a reservation carries a
`holder_kind` of `grade10-auction` or `grade10-vault`, never an inference
from ids. Each application reads availability and its own holds, and no other
application's.

Settling is not one shape, so partial moves are first-class: part of a hold
sells, part releases, the remainder stays held. The auction settles a hold by
selling; the vault settles one by taking custody, not by a sale. Every
quantity change appends one changelog entry — who, what, and the counts
before and after — so the arithmetic is never lost.

This is an operator product: everything here happens in the admin console,
and the number that matters is whether stock reconciles — available plus
every hold, grouped by who holds it, equal to what the house actually has.
