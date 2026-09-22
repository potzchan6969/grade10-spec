# grade10-site/vault/documents-and-signing Specification

## Feature set

- The documents
  - Three documents: the custody agreement on every case, the loan agreement
    on a financed one, the release receipt at collection
  - Two counterparties: the custodian holds the item and the lender lends
    against it, each on its own paper
  - Named facts: each document prints the facts it is held to and nothing a
    reader has to look up
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
  - Three ways to a copy: the download, the mail with the PDFs, and the case
    page
  - Verification: anyone holding a document's digest can ask whether it is one
    of ours
  - Durability: sealed bytes are copied to an archive that cannot delete, and
    re-hashed on a schedule
  - Every document at once: every sealed document its owner holds, in one
    download, bounded to what the page lists and to 52,428,800 bytes, and
    recorded like a search

## ADDED Requirements

### Requirement: The key terms ticked at the counter are the loan agreement's own

The record that the key terms were explained is taken against the loan
agreement's own terms, so what the counter says cannot drift from what the
borrower signs.

- **The list** - the terms offered for ticking SHALL be the terms the loan
  agreement states, in that document's own order, read from the document
  itself rather than from a list kept beside it.
- **Every term** - recording that the key terms were explained SHALL be
  refused by name unless the record names every term on that list, and
  nothing SHALL be recorded where it is refused.
- **What the case then reads** - a case holding the record SHALL show the day
  it was taken and who took it, and SHALL offer preparing the packet from
  there.
- **A case with no loan** - a case whose lane carries no loan agreement SHALL
  be offered no such list and SHALL be held to none.

#### Scenario: grade10-site-vault-documents-and-signing-SC-22 - The terms offered are the agreement's own
**Serves:** grade10-site-vault-documents-and-signing-US-03 - staff record the conversation for the financed case in front of them

- **GIVEN** a financed case
- **WHEN** staff open the record of the key terms
- **THEN** the terms offered are the terms the loan agreement states, in that
  document's order

#### Scenario: grade10-site-vault-documents-and-signing-SC-23 - A record short of the list is refused
**Serves:** grade10-site-vault-documents-and-signing-US-03 - staff record the conversation for the financed case in front of them

- **GIVEN** a financed case whose counter has ticked every term but one
- **WHEN** the record is taken
- **THEN** it is refused by name and nothing is recorded

#### Scenario: grade10-site-vault-documents-and-signing-SC-24 - A recorded set says when and by whom, and opens the packet
**Serves:** grade10-site-vault-documents-and-signing-US-03 - staff move from the conversation to the papers for the visit in front of them

- **GIVEN** a financed case whose counter has ticked every term
- **WHEN** the record is taken and staff read the case
- **THEN** the case shows the day it was taken and who took it, and preparing
  the packet is offered

#### Scenario: grade10-site-vault-documents-and-signing-SC-25 - A storage case is held to no list
**Serves:** grade10-site-vault-documents-and-signing-US-03 - staff paper a case that borrows nothing

- **GIVEN** a case whose lane carries no loan agreement
- **WHEN** staff read the case
- **THEN** no key-terms list is offered, and preparing the packet asks for
  none

### Requirement: Every sealed document a collector holds is taken in one download

A collector takes every document they have ever signed as one file, from the
page that lists them.

- **What it holds** - the download SHALL hold every sealed document of a
  completed packet on a case the collector owns, each carrying the digest the
  case page shows for it.
- **The bound** - the download SHALL hold exactly the documents the page that
  offered it lists, and SHALL take no list of cases from whoever asks for it.
- **The count** - the page SHALL name how many documents the download holds
  before it is taken, and SHALL offer no download to a collector holding
  none.
- **Past the ceiling** - the download SHALL be refused by name, before any
  document is read, where what it would hold is past 52,428,800 bytes, and
  nothing SHALL be sent.
- **On the record** - every document the download reads SHALL be recorded as
  a read of that document, and the download SHALL write one entry on the
  service's audit trail naming who took it, when, and how many documents it
  held.

#### Scenario: grade10-site-vault-documents-and-signing-SC-26 - The download carries every case's sealed documents
**Serves:** grade10-site-vault-documents-and-signing-US-05 - the collector takes their own signed papers without opening each case in turn

- **GIVEN** a collector holding sealed documents on two of their own cases
- **WHEN** they take the download
- **THEN** it holds every sealed document of both cases, each with its digest,
  and holds nothing from a case they do not own
- **AND** the page named that same number of documents before it was taken

#### Scenario: grade10-site-vault-documents-and-signing-SC-27 - A collector who has signed nothing is offered no download
**Serves:** grade10-site-vault-documents-and-signing-US-05 - the collector looks for their signed papers and has none yet

- **GIVEN** a collector whose cases hold no sealed document
- **WHEN** they read the page that lists them
- **THEN** no download is offered

#### Scenario: grade10-site-vault-documents-and-signing-SC-28 - A download past the ceiling is refused before anything is read
**Serves:** grade10-site-vault-documents-and-signing-US-05 - the collector asks for more signed papers than one file can carry

- **GIVEN** a collector whose sealed documents come to more than 52,428,800
  bytes together
- **WHEN** they take the download
- **THEN** it is refused by name, no document is read and nothing is sent

#### Scenario: grade10-site-vault-documents-and-signing-SC-29 - The download is on the record
**Serves:** grade10-site-vault-documents-and-signing-US-05 - the collector takes their own signed papers and the vault keeps the trail

- **GIVEN** a collector holding three sealed documents
- **WHEN** they take the download
- **THEN** each of the three is recorded as a read, and one entry on the audit
  trail names who took it, when, and that it held three documents
