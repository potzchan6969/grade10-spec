# grade10-site/vault/documents-and-signing Specification

## Feature set

- The seal and the copies
  - Three ways to a copy: the download, the mail with the PDFs, and the
    collector's own read of the case
  - Every document at once: every sealed document its owner holds, in one
    download, bounded to what their own read lists and to 52,428,800 bytes,
    and recorded like a search

## MODIFIED Requirements

### Requirement: Every signer keeps a copy, three ways

After the seal, the signer SHALL be able to download each sealed document on a
grant minted with the seal and lasting 15 minutes, SHALL be sent the sealed
documents to the case's own address, and SHALL find them on their own read of
the case, each with its digest, for as long as the case is kept.

Every case belongs to an account, so every signer SHALL have a durable copy
path.

<!-- trace:scenario id=g10.vault-documents-and-signing.SC-faf rev=1 -->
#### Scenario: grade10-site-vault-documents-and-signing-SC-17 - The copies reach the signer
**Serves:** grade10-site-vault-documents-and-signing-US-01 - Collector signs their case's papers at the counter

- **WHEN** a packet is sealed
- **THEN** the signer can download each document there and then, the sealed set is mailed to the case's address, and the owner's read of the case carries each document with its digest

### Requirement: Every sealed document a collector holds is taken in one download

A collector takes every document they have signed as one file, bounded to the
page of their cases Your data answers for.

- **What it holds** - the download SHALL hold every sealed document of a
  completed packet on a case the collector owns, each carrying the digest the
  owner's read of the case carries for it.
- **The bound** - the download SHALL hold exactly the documents Your data
  carries for the same page of cases, named by the same cursor and no wider,
  and SHALL take no list of cases from whoever asks for it.
- **The count** - Your data SHALL carry the documents the download for that
  page holds, so their number is known before it is taken; a collector
  holding none is carried none, and a download taken anyway holds none.
- **Past the ceiling** - the download SHALL be refused by name, before any
  document is read, where what it would hold is past 52,428,800 bytes, and
  nothing SHALL be sent.
- **On the record** - every document the download reads SHALL be recorded as
  a read of that document, and the download SHALL write one entry on the
  service's audit trail naming who took it, when, and how many documents it
  held.
- **Signed in** - the download SHALL be refused to a request carrying no
  session, and no document SHALL be served.

#### Scenario: grade10-site-vault-documents-and-signing-SC-26 - The download carries every case's sealed documents
**Serves:** grade10-site-vault-documents-and-signing-US-05 - the collector takes their own signed papers without opening each case in turn

- **GIVEN** a collector holding sealed documents on two of their own cases
- **WHEN** they take the download
- **THEN** it holds every sealed document of both cases, each with its digest,
  and holds nothing from a case they do not own
- **AND** Your data carried that same set of documents before it was taken

#### Scenario: grade10-site-vault-documents-and-signing-SC-27 - A collector who has signed nothing is offered no download
**Serves:** grade10-site-vault-documents-and-signing-US-05 - the collector looks for their signed papers and has none yet

- **GIVEN** a collector whose cases hold no sealed document
- **WHEN** they read Your data
- **THEN** it carries no signed document

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

#### Scenario: grade10-site-vault-documents-and-signing-SC-38 - The download is refused to a request with no session
**Serves:** grade10-site-vault-documents-and-signing-US-05 - nobody takes a collector's signed papers without being that collector

- **GIVEN** collectors holding sealed documents in the vault
- **WHEN** a request carrying no session asks for the download
- **THEN** it is refused and no document is served
