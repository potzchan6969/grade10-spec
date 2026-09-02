---
title: Money Amounts
spec: shared/money-amounts
order: 1
---

Floating point loses cents. So an amount is never a decimal in this platform:
it is a whole number of the currency's smallest unit plus its ISO 4217 code —
`1250` and `HKD`, not `12.50`. The currency's own exponent is the only thing
that turns those units into a number a person reads, and back again when an
outside system quotes a decimal. A decimal carrying more precision than its
currency allows fails instead of being quietly rounded, and a code the platform
does not recognise stops the conversion and names itself rather than guessing.

The other half of the convention is about who is reading. A collector wants the
symbol and their own locale's punctuation. An operator scanning a table that
spans currencies wants the ISO code on every row, because a column of numbers
where some are dollars and some are yen is a mistake waiting to be made. Two
shapes, chosen by audience, and no third.
