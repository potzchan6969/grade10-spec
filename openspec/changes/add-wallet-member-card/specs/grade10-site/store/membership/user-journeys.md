## User journeys

### grade10-site-store-membership-US-04: Member carries their card in a phone wallet

**As a** member,
**I want** my card added to Apple Wallet or Google Wallet and kept current,
**so that** it opens from a lock screen, scans like the card on the site, and shows the balance I have now.

**Accepted by:**

- `grade10-site-store-membership-SC-28` — A card identifies the same member every time
- `grade10-site-store-membership-SC-34` — A member adds their card to either wallet
- `grade10-site-store-membership-SC-35` — A pass carries what the card carries
- `grade10-site-store-membership-SC-36` — A pass scans exactly as the card does
- `grade10-site-store-membership-SC-37` — Removing a pass leaves the membership intact
- `grade10-site-store-membership-SC-38` — A spend at the till reaches the pass
- `grade10-site-store-membership-SC-39` — A burst of changes costs one refresh
- `grade10-site-store-membership-SC-43` — The card offers the wallets, the history and the replacement

### grade10-site-store-membership-US-05: Member replaces a card they no longer trust

**As a** member,
**I want** to see where my card was used and replace it from there,
**so that** a card I did not use, or one somebody photographed, stops working everywhere at once.

**Accepted by:**

- `grade10-site-store-membership-SC-29` — A replaced card identifies nobody
- `grade10-site-store-membership-SC-32` — A use the member did not make is on their card
- `grade10-site-store-membership-SC-33` — A lookup that spent nothing is still a use
- `grade10-site-store-membership-SC-40` — A replaced card reaches the pass

### grade10-site-store-membership-US-06: Operator replaces a card for a member who asks

**As an** operator,
**I want** to replace a member's card at their request under the permission it requires,
**so that** a member without their phone is not left with a card they cannot kill.

**Accepted by:**

- `grade10-site-store-membership-SC-30` — An operator replaces a card under the permission it requires
- `grade10-site-store-membership-SC-31` — The code stays out of every record anyone reads
