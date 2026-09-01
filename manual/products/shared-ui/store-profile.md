---
title: The profile blocks
summary: The shared display and edit blocks behind the account profile, exported once for every store.
spec: shared-ui/store-profile
order: 10
---

The account profile's surface — the display of a name, avatar and bio, and the
form that edits them — lives here as shared blocks, so both brands' stores
render the same profile the same way and the field limits are enforced in one
place.

The blocks hold no account. Who is being shown, what their fields say, and
what happens on save arrive as props; the application owns the reads and the
writes. The capability spec names the exports and their props — it is the
contract the `add-account-profile` change writes down for behavior that
already ships.
