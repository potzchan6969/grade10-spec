## User journeys

### grade10-site-vault-documents-and-signing-US-01: Collector signs their case's papers at the counter

**As a** collector standing at the shop counter,
**I want** to read every page on the iPad, agree to sign electronically and
sign each document once,
**so that** I know exactly what I signed and leave with a copy of it.

**Accepted by:**

- `grade10-site-vault-documents-and-signing-SC-10` — A link opened on a second device is refused
- `grade10-site-vault-documents-and-signing-SC-12` — Every page is turned before the signature is taken
- `grade10-site-vault-documents-and-signing-SC-13` — The typed name must be the verified one
- `grade10-site-vault-documents-and-signing-SC-17` — The copies reach the signer

### grade10-site-vault-documents-and-signing-US-02: Collector refuses to sign electronically

**As a** collector who would rather not sign on a screen,
**I want** to decline on the spot and have nothing at all signed,
**so that** the member of staff with me can take it from there without
anything half-executed in my name.

**Accepted by:**

- `grade10-site-vault-documents-and-signing-SC-14` — Declining withdraws the whole set
- `grade10-site-vault-documents-and-signing-SC-09` — An expired packet ends the packet only

### grade10-site-vault-documents-and-signing-US-03: Operator prepares the papers for the visit in front of them

**As a** member of shop staff,
**I want** the packet to carry exactly the documents this case's lane needs,
naming the shop and the person we checked,
**so that** nothing is handed over to sign that we could not be held to.

**Accepted by:**

- `grade10-site-vault-documents-and-signing-SC-01` — A financed packet holds both agreements
- `grade10-site-vault-documents-and-signing-SC-05` — A packet that can name no shop is refused
- `grade10-site-vault-documents-and-signing-SC-06` — A loan packet waits for the terms to be explained
- `grade10-site-vault-documents-and-signing-SC-07` — Preparing again withdraws what was out

### grade10-site-vault-documents-and-signing-US-04: Auditor proves what a document was when it was signed

**As** somebody holding one of our documents in a dispute,
**I want** to check its fingerprint against the vault and see the packet
re-derived from what is stored,
**so that** the record can be tested rather than believed.

**Accepted by:**

- `grade10-site-vault-documents-and-signing-SC-15` — Bytes that changed refuse the seal
- `grade10-site-vault-documents-and-signing-SC-16` — The certificate carries the words that were shown
- `grade10-site-vault-documents-and-signing-SC-18` — A digest nobody sealed answers as unknown
- `grade10-site-vault-documents-and-signing-SC-19` — A packet is re-derived rather than asserted
- `grade10-site-vault-documents-and-signing-SC-21` — Bytes that no longer match are reported
