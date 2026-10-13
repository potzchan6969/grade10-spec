# grade10-site/vault/documents-and-signing Specification

## Feature set

- The documents
  - Three documents: the custody agreement on every case, the loan agreement
    on a financed one, the release receipt at collection
  - Two counterparties: the custodian holds the item and the lender lends
    against it, each on its own paper
  - Named facts: each document prints the facts it is held to and nothing a
    reader has to look up
  - The case by its reference: each document names the case by its
    six-character reference alone, in its facts and its footer, so the paper
    is found the way the collector and the counter know the case
  - The item as registered: the custody agreement prints the register's
    category, title, description, grader, grade and cert, and the loan
    agreement's collateral and the release receipt's item print its category,
    title, grader, grade and cert, each as they stood when its packet was
    prepared
- Preparing a packet
  - The packet is the unit: one ordered set, prepared, read, consented to,
    signed and sealed together
  - The shop is named: a packet that can name no shop is refused, in the
    worker as at the counter
  - Terms explained first: the counter records the conversation before a loan
    packet may be prepared
  - The window: a packet lives a day, or until a day past the visit it belongs
    to
  - The agreement's own terms: what the counter ticks is the loan
    agreement's own list, so the conversation cannot drift from the paper
- The ceremony
  - The link: single-use, short-lived, bound to the device that opens it
  - Read before signing: every page of a document is turned before its tick
    box will take a signature
  - Two consents: one disclosure for the session, one line per document, both
    kept as the words that were shown
  - Declining: withdraws the whole set and is itself on the record
- The seal and the copies
  - One transaction: bytes re-checked, a certificate appended, one anchored
    entry
  - Three ways to a copy: the download, the mail with the PDFs, and the
    collector's own read of the case
  - Verification: anyone holding a document's digest can ask whether it is one
    of ours
  - Durability: sealed bytes are copied to an archive that cannot delete, and
    re-hashed on a schedule
  - Every document at once: every sealed document its owner holds, in one
    download, bounded to what their own read lists and to 52,428,800 bytes,
    and recorded like a search

## ADDED Requirements

### Requirement: A document names the case by its reference

Each document SHALL name the case by its six-character reference, as
`grade10-site/vault/case-intake` issues it, in its `Case` fact and in its
footer, and SHALL NOT print the case's id anywhere on its own page. The labels
SHALL stay as they are:

| Document | `Case` fact | Footer |
| --- | --- | --- |
| Custody agreement | `<reference>` | `<custodian's trading name> custody · case <reference>` |
| Loan agreement | `<reference>` | `<lender's trading name> financing · case <reference>` |
| Release receipt | `<reference>` | `<custodian's trading name> release · case <reference>` |

The certificate page the seal appends to each document SHALL name the case
the same way, as `Case: <reference>`, so no page of a sealed copy prints the
case's id.

A packet SHALL be sealed with the bytes rendered when it was prepared, and a
sealed document SHALL never be rendered again, so a document keeps the case
handle it was prepared with: a packet prepared while the paper printed the
case's id is sealed printing that id, on its certificate as on its own page,
and staff prepare again for one printing the reference.

<!-- trace:scenario id=g10.vault-documents-and-signing.SC-a2s rev=1 -->
#### Scenario: grade10-site-vault-documents-and-signing-SC-39 - A financed packet names the case by its reference
**Serves:** grade10-site-vault-documents-and-signing-US-07 - the collector holding both agreements reads the six characters their letters carry

- **GIVEN** a financed case with reference `QC7PEQ`, under a custodian and a lender whose trading name is `Grade10`
- **WHEN** its packet is prepared
- **THEN** the custody agreement's `Case` fact reads `QC7PEQ` and its footer reads `Grade10 custody · case QC7PEQ`
- **AND** the loan agreement's `Case` fact reads `QC7PEQ` and its footer reads `Grade10 financing · case QC7PEQ`
- **AND** neither document's own page prints the case's id

<!-- trace:scenario id=g10.vault-documents-and-signing.SC-keq rev=1 -->
#### Scenario: grade10-site-vault-documents-and-signing-SC-40 - The release receipt names the case by its reference
**Serves:** grade10-site-vault-documents-and-signing-US-07 - the collector taking the item home reads the same six characters on the receipt

- **GIVEN** a vaulted case with reference `QC7PEQ` that owes nothing, under a custodian whose trading name is `Grade10`
- **WHEN** its release receipt is prepared
- **THEN** the receipt's `Case` fact reads `QC7PEQ` and its footer reads `Grade10 release · case QC7PEQ`
- **AND** the receipt's own page does not print the case's id

<!-- trace:scenario id=g10.vault-documents-and-signing.SC-08p rev=1 -->
#### Scenario: grade10-site-vault-documents-and-signing-SC-41 - Staff find the case by what the paper prints
**Serves:** grade10-site-vault-documents-and-signing-US-08 - staff handed a signed paper open its case from the console

- **GIVEN** a sealed custody agreement whose `Case` fact reads `QC7PEQ`
- **WHEN** staff search the console for `QC7PEQ`
- **THEN** the search answers with the case the agreement belongs to, and only that case

<!-- trace:scenario id=g10.vault-documents-and-signing.SC-37n rev=1 -->
#### Scenario: grade10-site-vault-documents-and-signing-SC-42 - A packet is sealed as it was prepared
**Serves:** grade10-site-vault-documents-and-signing-US-04 - the paper a collector already holds still proves what was signed

- **GIVEN** a prepared packet
- **WHEN** the collector signs every document in it
- **THEN** nothing is rendered again, and each sealed document's source digest is the one taken when the packet was prepared
- **AND** verifying each sealed document's digest answers that the vault sealed it

<!-- trace:scenario id=g10.vault-documents-and-signing.SC-8ct rev=1 -->
#### Scenario: grade10-site-vault-documents-and-signing-SC-43 - The certificate names the case as its document does
**Serves:** grade10-site-vault-documents-and-signing-US-07 - every page of the sealed copy the collector holds names the same six characters

- **GIVEN** a financed case with reference `QC7PEQ` whose packet was prepared
- **WHEN** the collector signs every document in it
- **THEN** each sealed document's certificate reads `Case: QC7PEQ`
- **AND** no page of either sealed copy prints the case's id
