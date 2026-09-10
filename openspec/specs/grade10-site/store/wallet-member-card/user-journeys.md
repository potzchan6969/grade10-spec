## User journeys

### grade10-site-store-wallet-member-card-US-01: Member adds their card to a phone wallet

**As a** loyalty member,
**I want** to add my member card to Google Wallet or Apple Wallet,
**so that** I can scan it at the counter without opening the site.

**Accepted by:**

- `grade10-site-store-wallet-member-card-SC-01` — A pass renders the programme's current standing
- `grade10-site-store-wallet-member-card-SC-02` — A second pass on the same wallet is refused while one is live
- `grade10-site-store-wallet-member-card-SC-12` — A missing credential names itself

### grade10-site-store-wallet-member-card-US-02: Member scans at the counter after their balance moved

**As a** member whose points or tier changed since they last opened the app,
**I want** my wallet pass to show the current balance and tier,
**so that** staff see the same standing the app would show me.

**Accepted by:**

- `grade10-site-store-wallet-member-card-SC-05` — A member whose balance moved is current by the end of the next lap
- `grade10-site-store-wallet-member-card-SC-07` — A live member's refresh is not starved by the vendor-debt arm

### grade10-site-store-wallet-member-card-US-03: Member ends one pass and keeps the other

**As a** member holding passes on both wallets,
**I want** ending one to leave the other untouched,
**so that** losing a phone does not cost me both cards.

**Accepted by:**

- `grade10-site-store-wallet-member-card-SC-03` — Ending one wallet's pass leaves the other's untouched
- `grade10-site-store-wallet-member-card-SC-04` — A non-live pass carries its ended timestamp
- `grade10-site-store-wallet-member-card-SC-08` — An ended pass's vendor copy is discharged by the sweep

### grade10-site-store-wallet-member-card-US-04: Member asks to be erased

**As a** member exercising their right to erasure,
**I want** my wallet passes to stop identifying me and make no further codes,
**so that** deleting my account actually removes what a pass could show
about me.

**Accepted by:**

- `grade10-site-store-wallet-member-card-SC-09` — An erased pass's secret is emptied
- `grade10-site-store-wallet-member-card-SC-10` — A device fetching an erased pass sees nobody

### grade10-site-store-wallet-member-card-US-05: Operator reads what the sweep costs

**As an** operator watching the platform's health,
**I want** the sweep's dormant reads and vendor-debt discharge to be bounded
and observable,
**so that** a slow vendor or a large dormant base cannot starve the members
who are actively spending.

**Accepted by:**

- `grade10-site-store-wallet-member-card-SC-06` — A dormant member's pass is read once a day and sends nothing
- `grade10-site-store-wallet-member-card-SC-11` — A write-surface check pins every wallet table's writer

### grade10-site-store-wallet-member-card-US-06: Member carries their card in a phone wallet

**As a** member,
**I want** my card in the wallet my phone already has, scannable without signal,
**so that** I am served from my lock screen instead of signing in and waiting for a code with a queue behind me.

**Accepted by:**

- `grade10-site-store-wallet-member-card-SC-13` — A member adds their card to their wallet
- `grade10-site-store-wallet-member-card-SC-22` — A pass speaks the phone's language
- `grade10-site-store-wallet-member-card-SC-14` — A pass identifies as the card does
- `grade10-site-store-wallet-member-card-SC-16` — A pass identifies with no signal
- `grade10-site-store-wallet-member-card-SC-25` — A recorded change reaches the wallet on the next sweep
- `grade10-site-store-wallet-member-card-SC-26` — A change nobody recorded is due at the instant it happens
- `grade10-site-store-wallet-member-card-SC-27` — A sweep that has fallen behind says so
- `grade10-site-store-wallet-member-card-SC-29` — A pass says how current it is
- `grade10-site-store-wallet-member-card-SC-33` — The save action is offered beside the card
- `grade10-site-store-wallet-member-card-SC-18` — A member adds their card to Apple Wallet
- `grade10-site-store-wallet-member-card-SC-19` — An Apple pass identifies every time
- `grade10-site-store-wallet-member-card-SC-21` — Adding one wallet's pass leaves the other alive

### grade10-site-store-wallet-member-card-US-07: Member ends a pass they no longer want

**As a** member,
**I want** to end a pass and add a fresh one,
**so that** a phone I no longer have, or a code somebody photographed, stops working the moment I say so.

**Accepted by:**

- `grade10-site-store-wallet-member-card-SC-15` — A photographed code is worth nothing
- `grade10-site-store-wallet-member-card-SC-17` — Removing a pass leaves the membership intact
- `grade10-site-store-wallet-member-card-SC-24` — An ended pass identifies nobody
- `grade10-site-store-wallet-member-card-SC-37` — A member who returns still finds the passes they hold
- `grade10-site-store-wallet-member-card-SC-03` — Ending one wallet's pass leaves the other's untouched

### grade10-site-store-wallet-member-card-US-08: Member spends points when the pass they carry cannot

**As a** member whose pass carries a durable code,
**I want** the counter to identify me from the pass and take the spend from my card on the site,
**so that** a code anybody could photograph never moves my points, and I still lose no time at the till.

**Accepted by:**

- `grade10-site-store-wallet-member-card-SC-20` — An Apple pass cannot move value
