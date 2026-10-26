# Rounds

One row per round: what it read, who read it, what stood and what it asked.
Written by the landing, in the landing's own commit.

| Round | Artifact | Perspectives | Stood | Asked | Tests |
| --- | --- | --- | --- | --- | --- |
| 1 | 2 | qa, simpler, verifier | Reviewed 699cafe14 and c28b497b4e on Standards and Spec. qa: SC46-SC51, SC53, SC54 each have a test citing its id and 91 tests pass. simpler: one hook with one call, no message, timer or second session read; nothing smaller found. verifier: the hook closes only on signed-in to nobody, ignores pending and member-to-member. Unchanged: hook renamed useCloseOnSessionEnd (816e5b8d8f), so tasks.md and tech-design.md cite a stale name. | - | g10.store-cart-drawer.SC46: apps/frontend/grade10/src/chrome/SessionEndsElsewhere.test.tsx; g10.store-cart-drawer.SC47: apps/frontend/grade10/src/chrome/SessionEndsElsewhere.test.tsx; g10.store-cart-drawer.SC48: apps/frontend/grade10/src/chrome/SessionEndsElsewhere.test.tsx; g10.store-cart-drawer.SC49: apps/frontend/grade10/src/chrome/SessionEndsElsewhere.test.tsx; g10.store-cart-drawer.SC50: apps/frontend/grade10/src/chrome/SessionEndsElsewhere.test.tsx; g10.store-cart-drawer.SC51: apps/frontend/grade10/src/chrome/SessionEndsElsewhere.test.tsx; g10.store-cart-drawer.SC53: apps/frontend/grade10/src/chrome/SessionEndsElsewhere.test.tsx; g10.store-cart-drawer.SC54: apps/frontend/grade10/src/chrome/SessionEndsElsewhere.test.tsx |
