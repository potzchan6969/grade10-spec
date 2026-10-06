# grade10-site/vault/documents-and-signing Specification

## Purpose

The paper a vault case is held to: three one-page documents the vault renders
itself, signed on a shop iPad with staff present, sealed in one transaction
and anchored so that what was signed can be proved afterwards.

No e-signature vendor is involved. What the loan agreement's figures mean is
`grade10-site/vault/loan-and-settlement`; whose name is on the paper is
`grade10-site/vault/identity-verification`.

## Feature set

- The documents
  - Three documents: the custody agreement on every case, the loan agreement
    on a financed one, the release receipt at collection
  - Two counterparties: the custodian holds the item and the lender lends
    against it, each on its own paper
  - Named facts: each document prints the facts it is held to and nothing a
    reader has to look up
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

## Requirements

### Requirement: A case is papered by three documents, each printing its own facts

Every case SHALL be papered by a custody agreement; a financed case SHALL be
papered by a loan agreement beside it; and an item leaving custody SHALL be
papered by a release receipt in a packet of its own.

Each SHALL be a one-page English document the vault renders itself, printing:

| Document | Facts | What its terms state |
| --- | --- | --- |
| Custody agreement | case, customer's verified legal name, the item as the item register holds it - its category, title and description, with its grader, grade and cert beside it where it has a grader - the recorded valuation, the shop it is held at, the date, the complaints contact | the item is kept in a secured vault until release; the valuation is what staff recorded and is not an offer to buy; reasonable care while it is held; storage carries no fee; collection in person against a signed release |
| Loan agreement | case, customer, collateral - the item as the item register holds it, its category and title, with its grader, grade and cert beside it where it has a grader - principal, the interest as a percentage for the term, the same rate stated simple per annum, `Fees: None`, the term as days from the advance, the repayable amount, the date, the licence, the complaints contact | the term runs from the day the principal is advanced and the date is confirmed in writing then; after it the same daily rate continues, uncompounded and with no further fee; early repayment any day with the term's interest payable in full; release on full repayment; a written notice naming a final date at least the brand's notice period away before ownership may be taken, and forfeiture always a person's decision; Hong Kong SAR governing law; executed by the lender on the advance; and the borrower's own line that the key terms were explained before signing |
| Release receipt | case, customer, item - as the item register holds it, its category and title, with its grader, grade and cert beside it where it has a grader - what was settled or that nothing was owed, the date, the complaints contact | the item has been handed back and inspected; nothing is outstanding; the custody agreement ends |

The custody agreement and the release receipt SHALL name the custodian; the
loan agreement SHALL name the lender, and the licence line SHALL print on the
lender's paper alone. In production a document SHALL be refused rather than
printed under the trading name while the party it needs has no registered
name.

A document SHALL be dated the calendar day it was signed on the brand's own
zone, and SHALL print neither a cooling-off period nor a redemption period no
regime has named.

Each document SHALL print the item's facts as the register held them when its
packet was prepared, and SHALL read them again at every re-prepare; an edit to
the register after a packet was prepared SHALL NOT change that packet. The
collector's request as they sent it SHALL NOT be printed in the register's
place.

<!-- trace:scenario id=g10.vault-documents-and-signing.SC-m42 rev=1 -->
#### Scenario: grade10-site-vault-documents-and-signing-SC-01 - A financed packet holds both agreements
**Serves:** grade10-site-vault-documents-and-signing-US-03 - Operator prepares the papers for the visit in front of them

- **GIVEN** a financed case with terms accepted
- **WHEN** its packet is prepared
- **THEN** it holds the custody agreement and the loan agreement, in that order

<!-- trace:scenario id=g10.vault-documents-and-signing.SC-xyk rev=1 -->
#### Scenario: grade10-site-vault-documents-and-signing-SC-02 - A storage packet holds one
**Serves:** The documents - a storage packet holds one

- **GIVEN** a storage case with terms accepted
- **WHEN** its packet is prepared
- **THEN** it holds the custody agreement alone

<!-- trace:scenario id=g10.vault-documents-and-signing.SC-1vg rev=1 -->
#### Scenario: grade10-site-vault-documents-and-signing-SC-03 - Production refuses paper under an unnamed party
**Serves:** The documents - production refuses paper under an unnamed party

- **GIVEN** a brand in production whose custodian has no registered name
- **WHEN** a packet is prepared
- **THEN** it is refused by name and nothing is rendered

<!-- trace:scenario id=g10.vault-documents-and-signing.SC-sg7 rev=1 -->
#### Scenario: grade10-site-vault-documents-and-signing-SC-04 - The loan agreement prints a term, not a date
**Serves:** The documents - the loan agreement prints a term, not a date

- **WHEN** a loan agreement is rendered
- **THEN** it states the term as days from the advance and carries no due date

<!-- trace:scenario id=g10.vault-documents-and-signing.SC-3r0 rev=1 -->
#### Scenario: grade10-site-vault-documents-and-signing-SC-32 - The custody agreement names the item as the register holds it
**Serves:** grade10-site-vault-documents-and-signing-US-06 - the collector signs a paper naming the object the shop keeps

- **GIVEN** a case whose collector asked about "Charizard card", registered as a trading card titled "Charizard 1999 Base Set" with a description
- **WHEN** its packet is prepared
- **THEN** the custody agreement names the item "Charizard 1999 Base Set", a trading card, with the register's description
- **AND** it does not print "Charizard card"

<!-- trace:scenario id=g10.vault-documents-and-signing.SC-mvh rev=1 -->
#### Scenario: grade10-site-vault-documents-and-signing-SC-33 - A graded item prints its grader, grade and cert
**Serves:** grade10-site-vault-documents-and-signing-US-06 - the collector signs for the exact slab

- **GIVEN** a case whose item the register holds as PSA, `10`, cert `12345678`
- **WHEN** its packet is prepared
- **THEN** the custody agreement prints PSA, `10` and certificate number `12345678` beside the item

<!-- trace:scenario id=g10.vault-documents-and-signing.SC-82h rev=1 -->
#### Scenario: grade10-site-vault-documents-and-signing-SC-34 - An item with no grader prints none
**Serves:** grade10-site-vault-documents-and-signing-US-06 - the collector leaves an ungraded watch

- **GIVEN** a case whose item has no grader
- **WHEN** its packet is prepared
- **THEN** the custody agreement prints no grader, grade or certificate number

<!-- trace:scenario id=g10.vault-documents-and-signing.SC-cya rev=1 -->
#### Scenario: grade10-site-vault-documents-and-signing-SC-35 - A paper keeps the facts it was prepared with, and a re-prepare reads again
**Serves:** grade10-site-vault-documents-and-signing-US-06 - the collector is never handed a paper that changed after it was printed

- **GIVEN** a packet prepared while the register held grade `10`
- **WHEN** staff correct the grade to `9` on the register
- **THEN** the prepared custody agreement still prints `10`
- **WHEN** staff prepare the packet again
- **THEN** the new custody agreement prints `9`

<!-- trace:scenario id=g10.vault-documents-and-signing.SC-ahm rev=1 -->
#### Scenario: grade10-site-vault-documents-and-signing-SC-36 - The loan agreement's collateral is the item as the register holds it
**Serves:** grade10-site-vault-documents-and-signing-US-06 - the collector borrows against the exact slab the shop keeps

- **GIVEN** a financed case whose collector asked about "Charizard card", registered as a trading card titled "Charizard 1999 Base Set", PSA, `10`, cert `12345678`
- **WHEN** its packet is prepared
- **THEN** the loan agreement's collateral reads "Charizard 1999 Base Set", a trading card, with PSA, `10` and certificate number `12345678`
- **AND** it does not print "Charizard card"

<!-- trace:scenario id=g10.vault-documents-and-signing.SC-3g3 rev=1 -->
#### Scenario: grade10-site-vault-documents-and-signing-SC-37 - The release receipt names the item as the register holds it
**Serves:** grade10-site-vault-documents-and-signing-US-06 - the collector signs for the slab they take home

- **GIVEN** a vaulted case whose item the register holds as a trading card titled "Charizard 1999 Base Set", PSA, `10`, cert `12345678`
- **WHEN** its release receipt is prepared
- **THEN** the receipt's item reads "Charizard 1999 Base Set", a trading card, with PSA, `10` and certificate number `12345678`

### Requirement: A packet is prepared as one set, for a case that is ready for it

Staff holding the vault operate grant SHALL prepare a packet, in these steps:

1. Read the person the paper names from the case's identity check, refusing an
   identity that may not enter an agreement.
2. Read the shop the item will be held at — the one the case's visit names, or
   one the operator names — and refuse a packet that can name no shop.
3. Render every document the case's lane requires.
4. Re-derive every printed fact under the case's own lock, withdraw whatever
   packet was already out, and open the new one with its documents and its
   signer.

Preparing a financed packet SHALL be refused by name unless the counter has
recorded that the key terms were explained, with the reference of a recording
where one was made.

The case SHALL move to `signing`, and the packet SHALL stay signable for 24
hours, or until a day past the visit the case holds where that is later.

A packet reaching the end of its window SHALL be closed with its links, and
SHALL end nothing else: the case stays where it is and staff prepare again.

<!-- trace:scenario id=g10.vault-documents-and-signing.SC-1ll rev=1 -->
#### Scenario: grade10-site-vault-documents-and-signing-SC-05 - A packet that can name no shop is refused
**Serves:** grade10-site-vault-documents-and-signing-US-03 - Operator prepares the papers for the visit in front of them

- **GIVEN** a case with no visit and no shop named by the operator
- **WHEN** a packet is prepared
- **THEN** it is refused by name

<!-- trace:scenario id=g10.vault-documents-and-signing.SC-l9w rev=1 -->
#### Scenario: grade10-site-vault-documents-and-signing-SC-06 - A loan packet waits for the terms to be explained
**Serves:** grade10-site-vault-documents-and-signing-US-03 - Operator prepares the papers for the visit in front of them

- **GIVEN** a financed case with no record that its terms were explained
- **WHEN** a packet is prepared
- **THEN** it is refused by name

<!-- trace:scenario id=g10.vault-documents-and-signing.SC-iz4 rev=1 -->
#### Scenario: grade10-site-vault-documents-and-signing-SC-07 - Preparing again withdraws what was out
**Serves:** grade10-site-vault-documents-and-signing-US-03 - Operator prepares the papers for the visit in front of them

- **GIVEN** a case holding an unsigned packet
- **WHEN** staff prepare a new one
- **THEN** the first is withdrawn and the case holds exactly one live packet

<!-- trace:scenario id=g10.vault-documents-and-signing.SC-odf rev=1 -->
#### Scenario: grade10-site-vault-documents-and-signing-SC-08 - A packet lasts as long as the visit it belongs to
**Serves:** Preparing a packet - a packet lasts as long as the visit it belongs to

- **GIVEN** a packet prepared on Monday for a visit booked on Friday
- **WHEN** its window is read
- **THEN** it is still signable on Friday

<!-- trace:scenario id=g10.vault-documents-and-signing.SC-lpp rev=1 -->
#### Scenario: grade10-site-vault-documents-and-signing-SC-09 - An expired packet ends the packet only
**Serves:** grade10-site-vault-documents-and-signing-US-02 - Collector refuses to sign electronically

- **GIVEN** a case in `signing` whose packet has run out of window
- **WHEN** the expired packets are swept
- **THEN** the packet and its links are closed and the case is still `signing`

### Requirement: The signing link is single-use, short-lived and bound to one device

The ceremony SHALL be reached at the brand's own signing address, carrying a
256-bit token in the address fragment so that no server, log or referrer
receives it. The token SHALL be stored only as a digest.

The link SHALL last 30 minutes, SHALL be usable once, and SHALL be bound to
the first device that opens it. A signer needs no account.

<!-- trace:scenario id=g10.vault-documents-and-signing.SC-h1q rev=1 -->
#### Scenario: grade10-site-vault-documents-and-signing-SC-10 - A link opened on a second device is refused
**Serves:** grade10-site-vault-documents-and-signing-US-01 - Collector signs their case's papers at the counter

- **GIVEN** a signing link already opened on one device
- **WHEN** it is opened on another
- **THEN** it is refused by name and nothing is shown

<!-- trace:scenario id=g10.vault-documents-and-signing.SC-y38 rev=1 -->
#### Scenario: grade10-site-vault-documents-and-signing-SC-11 - A link past its window is refused
**Serves:** The ceremony - a link past its window is refused

- **GIVEN** a signing link minted 31 minutes ago
- **WHEN** it is opened
- **THEN** it is refused by name, and staff can mint another

<!-- trace:scenario id=g10.vault-documents-and-signing.SC-k3s rev=1 -->
#### Scenario: grade10-site-vault-documents-and-signing-SC-30 - A link that has sealed its packet is refused on a second open
**Serves:** grade10-site-vault-documents-and-signing-US-01 - Collector signs their case's papers at the counter

- **GIVEN** a signing link whose packet was signed and sealed through it
- **WHEN** it is opened again, on the device that signed
- **THEN** it is refused by name and nothing is shown
- **AND** no further signature or seal is taken

### Requirement: The ceremony records what was read and what was agreed to

A signer SHALL be shown the session's e-sign disclosure and SHALL agree to it
before any document may be signed. Each document SHALL carry its own consent
line, ticked before that document may be signed.

A signature SHALL be refused by name when: a page of the document has not been
turned; the document's consent has not been given; the session's disclosure
has not been agreed to; the case carries no identity check; the typed name is
not the verified person's name; or the signer has already signed that
document.

The signer SHALL be able to decline. Declining SHALL withdraw every document
prepared for that session, SHALL be recorded, and SHALL leave nothing signed.

Both the disclosure and each document's consent SHALL be kept as the full text
that was shown, beside its digest, so the record says which wording was on
screen.

<!-- trace:scenario id=g10.vault-documents-and-signing.SC-22x rev=1 -->
#### Scenario: grade10-site-vault-documents-and-signing-SC-12 - Every page is turned before the signature is taken
**Serves:** grade10-site-vault-documents-and-signing-US-01 - Collector signs their case's papers at the counter

- **GIVEN** a document the signer has not read to the end
- **WHEN** they sign it
- **THEN** it is refused by name

<!-- trace:scenario id=g10.vault-documents-and-signing.SC-3o8 rev=1 -->
#### Scenario: grade10-site-vault-documents-and-signing-SC-13 - The typed name must be the verified one
**Serves:** grade10-site-vault-documents-and-signing-US-01 - Collector signs their case's papers at the counter

- **GIVEN** a case whose identity check names one person
- **WHEN** the signer types another name
- **THEN** it is refused by name

<!-- trace:scenario id=g10.vault-documents-and-signing.SC-r20 rev=1 -->
#### Scenario: grade10-site-vault-documents-and-signing-SC-14 - Declining withdraws the whole set
**Serves:** grade10-site-vault-documents-and-signing-US-02 - Collector refuses to sign electronically

- **GIVEN** a packet of two documents, neither signed
- **WHEN** the signer declines
- **THEN** both are withdrawn, the decline is on the record, and the link no longer opens

### Requirement: The seal is one transaction, and it anchors the packet

When the last document of a packet is signed, one transaction SHALL: re-hash
each document's source bytes against the digest taken when it was prepared and
refuse the seal where they differ; append a certificate page to each document;
write the sealed bytes; and anchor one entry for the packet in the service's
hash-chained audit trail.

A packet SHALL be treated as executed only where the packet and every document
in it agree — a status alone SHALL never stand for it.

The certificate SHALL print: the typed name, the consent and signing instants,
which pages were viewed, the address and user agent the signature came from,
the verified legal name in full, the document type and its masked number, the
verifying staff member's name, the full event log, every source digest, and
the disclosure and consent wording in full above their digests.

<!-- trace:scenario id=g10.vault-documents-and-signing.SC-22h rev=1 -->
#### Scenario: grade10-site-vault-documents-and-signing-SC-15 - Bytes that changed refuse the seal
**Serves:** grade10-site-vault-documents-and-signing-US-04 - Auditor proves what a document was when it was signed

- **GIVEN** a prepared document whose stored bytes no longer match the digest taken at preparation
- **WHEN** the signer signs it
- **THEN** the seal is refused by name and nothing is sealed

<!-- trace:scenario id=g10.vault-documents-and-signing.SC-hsh rev=1 -->
#### Scenario: grade10-site-vault-documents-and-signing-SC-16 - The certificate carries the words that were shown
**Serves:** grade10-site-vault-documents-and-signing-US-04 - Auditor proves what a document was when it was signed

- **WHEN** a packet is sealed
- **THEN** each sealed document's certificate prints the disclosure and that document's consent text in full, each above its own digest

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

### Requirement: A document can be verified by anyone holding its digest

The vault SHALL answer, at a public address taking a document's SHA-256,
whether that digest is a document it sealed, and where it is, which template
it was and when it was completed. The answer SHALL carry nothing about the
person.

Staff holding the vault read grant SHALL be able to re-check a whole packet:
the manifest re-derived from its documents, every recorded digest re-taken
from the stored bytes, and the chain entry re-checked against the rows it
describes. The answer SHALL be computed afresh every time and never cached,
and an operator's re-check SHALL itself be recorded.

<!-- trace:scenario id=g10.vault-documents-and-signing.SC-ebj rev=1 -->
#### Scenario: grade10-site-vault-documents-and-signing-SC-18 - A digest nobody sealed answers as unknown
**Serves:** grade10-site-vault-documents-and-signing-US-04 - Auditor proves what a document was when it was signed

- **WHEN** a digest the vault never sealed is verified
- **THEN** the answer says it is not one of ours and names nobody

<!-- trace:scenario id=g10.vault-documents-and-signing.SC-ngu rev=1 -->
#### Scenario: grade10-site-vault-documents-and-signing-SC-19 - A packet is re-derived rather than asserted
**Serves:** grade10-site-vault-documents-and-signing-US-04 - Auditor proves what a document was when it was signed

- **WHEN** an operator re-checks a sealed packet
- **THEN** the answer is recomputed from the stored bytes and the chain, and the re-check is recorded against the case

<!-- trace:scenario id=g10.vault-documents-and-signing.SC-leu rev=1 -->
#### Scenario: grade10-site-vault-documents-and-signing-SC-31 - A digest the vault sealed answers with its document and nobody's name
**Serves:** grade10-site-vault-documents-and-signing-US-01 - Collector signs their case's papers at the counter

- **GIVEN** a document the vault sealed
- **WHEN** anyone, signed in or not, verifies its digest
- **THEN** the answer says it is one the vault sealed, with its template and
  when it was completed
- **AND** the answer names nobody

### Requirement: Sealed bytes are copied to an archive that cannot delete, and re-hashed

Every sealed document SHALL be copied, with its digest, into an archive
reached through a path that cannot delete, and the copy SHALL be checked
against the digest.

Stored sealed bytes SHALL be re-hashed on a schedule, in bounded batches, and
a mismatch SHALL be reported rather than repaired.

The verified heads of the hash chain SHALL be exported to that archive.

<!-- trace:scenario id=g10.vault-documents-and-signing.SC-mjh rev=1 -->
#### Scenario: grade10-site-vault-documents-and-signing-SC-20 - A sealed document reaches the archive
**Serves:** The seal and the copies - a sealed document reaches the archive

- **WHEN** a document is sealed
- **THEN** a copy of its bytes and its digest reaches the archive, checked against the digest

<!-- trace:scenario id=g10.vault-documents-and-signing.SC-ayk rev=1 -->
#### Scenario: grade10-site-vault-documents-and-signing-SC-21 - Bytes that no longer match are reported
**Serves:** grade10-site-vault-documents-and-signing-US-04 - Auditor proves what a document was when it was signed

- **GIVEN** a stored sealed document whose bytes no longer match its recorded digest
- **WHEN** the integrity pass reaches it
- **THEN** the mismatch is reported and nothing is overwritten

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

<!-- trace:scenario id=g10.vault-documents-and-signing.SC-h2m rev=1 -->
#### Scenario: grade10-site-vault-documents-and-signing-SC-22 - The terms offered are the agreement's own
**Serves:** grade10-site-vault-documents-and-signing-US-03 - staff record the conversation for the financed case in front of them

- **GIVEN** a financed case
- **WHEN** staff open the record of the key terms
- **THEN** the terms offered are the terms the loan agreement states, in that
  document's order

<!-- trace:scenario id=g10.vault-documents-and-signing.SC-z0d rev=1 -->
#### Scenario: grade10-site-vault-documents-and-signing-SC-23 - A record short of the list is refused
**Serves:** grade10-site-vault-documents-and-signing-US-03 - staff record the conversation for the financed case in front of them

- **GIVEN** a financed case whose counter has ticked every term but one
- **WHEN** the record is taken
- **THEN** it is refused by name and nothing is recorded

<!-- trace:scenario id=g10.vault-documents-and-signing.SC-i4k rev=1 -->
#### Scenario: grade10-site-vault-documents-and-signing-SC-24 - A recorded set says when and by whom, and opens the packet
**Serves:** grade10-site-vault-documents-and-signing-US-03 - staff move from the conversation to the papers for the visit in front of them

- **GIVEN** a financed case whose counter has ticked every term
- **WHEN** the record is taken and staff read the case
- **THEN** the case shows the day it was taken and who took it, and preparing
  the packet is offered

<!-- trace:scenario id=g10.vault-documents-and-signing.SC-kzm rev=1 -->
#### Scenario: grade10-site-vault-documents-and-signing-SC-25 - A storage case is held to no list
**Serves:** grade10-site-vault-documents-and-signing-US-03 - staff paper a case that borrows nothing

- **GIVEN** a case whose lane carries no loan agreement
- **WHEN** staff read the case
- **THEN** no key-terms list is offered, and preparing the packet asks for
  none

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

<!-- trace:scenario id=g10.vault-documents-and-signing.SC-pe0 rev=1 -->
#### Scenario: grade10-site-vault-documents-and-signing-SC-26 - The download carries every case's sealed documents
**Serves:** grade10-site-vault-documents-and-signing-US-05 - the collector takes their own signed papers without opening each case in turn

- **GIVEN** a collector holding sealed documents on two of their own cases
- **WHEN** they take the download
- **THEN** it holds every sealed document of both cases, each with its digest,
  and holds nothing from a case they do not own
- **AND** Your data carried that same set of documents before it was taken

<!-- trace:scenario id=g10.vault-documents-and-signing.SC-wzw rev=1 -->
#### Scenario: grade10-site-vault-documents-and-signing-SC-27 - A collector who has signed nothing is offered no download
**Serves:** grade10-site-vault-documents-and-signing-US-05 - the collector looks for their signed papers and has none yet

- **GIVEN** a collector whose cases hold no sealed document
- **WHEN** they read Your data
- **THEN** it carries no signed document

<!-- trace:scenario id=g10.vault-documents-and-signing.SC-itg rev=1 -->
#### Scenario: grade10-site-vault-documents-and-signing-SC-28 - A download past the ceiling is refused before anything is read
**Serves:** grade10-site-vault-documents-and-signing-US-05 - the collector asks for more signed papers than one file can carry

- **GIVEN** a collector whose sealed documents come to more than 52,428,800
  bytes together
- **WHEN** they take the download
- **THEN** it is refused by name, no document is read and nothing is sent

<!-- trace:scenario id=g10.vault-documents-and-signing.SC-03w rev=1 -->
#### Scenario: grade10-site-vault-documents-and-signing-SC-29 - The download is on the record
**Serves:** grade10-site-vault-documents-and-signing-US-05 - the collector takes their own signed papers and the vault keeps the trail

- **GIVEN** a collector holding three sealed documents
- **WHEN** they take the download
- **THEN** each of the three is recorded as a read, and one entry on the audit
  trail names who took it, when, and that it held three documents

<!-- trace:scenario id=g10.vault-documents-and-signing.SC-wpb rev=1 -->
#### Scenario: grade10-site-vault-documents-and-signing-SC-38 - The download is refused to a request with no session
**Serves:** grade10-site-vault-documents-and-signing-US-05 - nobody takes a collector's signed papers without being that collector

- **GIVEN** collectors holding sealed documents in the vault
- **WHEN** a request carrying no session asks for the download
- **THEN** it is refused and no document is served
