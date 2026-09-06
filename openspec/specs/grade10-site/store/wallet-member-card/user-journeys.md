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
