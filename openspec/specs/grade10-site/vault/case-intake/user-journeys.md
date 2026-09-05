## User journeys

### grade10-site-vault-case-intake-US-01: Collector sends in a card they want cash against

**As a** collector,
**I want** to describe and photograph one card and say how much I want to
borrow against it,
**so that** the shop can value it and offer me terms before I carry it in.

**Accepted by:**

- `grade10-site-vault-case-intake-SC-01` — A request is opened and reopened
- `grade10-site-vault-case-intake-SC-05` — A loan asked for opens the financed lane
- `grade10-site-vault-case-intake-SC-13` — A request with nothing to look at is refused
- `grade10-site-vault-case-intake-SC-14` — Sending it in offers the visit

### grade10-site-vault-case-intake-US-02: Collector sends in a card they only want kept safe

**As a** collector,
**I want** to send in a card without asking for a loan,
**so that** it is kept in a vault and I owe nothing for keeping it there.

**Accepted by:**

- `grade10-site-vault-case-intake-SC-03` — A request in another currency is refused
- `grade10-site-vault-case-intake-SC-06` — No loan asked for opens the storage lane
- `grade10-site-vault-case-intake-SC-14` — Sending it in offers the visit

### grade10-site-vault-case-intake-US-03: Collector photographs the item from their phone

**As a** collector,
**I want** to add photographs of the item from my phone and see anything the
vault will not take refused before I spend the upload,
**so that** the shop can prepare around what it can see and my photographs
carry nothing about where I live.

**Accepted by:**

- `grade10-site-vault-case-intake-SC-08` — An eleventh photograph is refused
- `grade10-site-vault-case-intake-SC-09` — A file of another kind is refused
- `grade10-site-vault-case-intake-SC-10` — The same photograph twice is one photograph
- `grade10-site-vault-case-intake-SC-11` — Location metadata never reaches the vault
- `grade10-site-vault-case-intake-SC-12` — A photograph is not another collector's to read
