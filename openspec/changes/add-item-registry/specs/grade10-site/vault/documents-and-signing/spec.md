# grade10-site/vault/documents-and-signing Specification

## Feature set

- The documents
  - The item as registered: the custody agreement prints the register's
    category, title, description, grader, grade and cert as they stood when
    the packet was prepared

## MODIFIED Requirements

### Requirement: A case is papered by three documents, each printing its own facts

Every case SHALL be papered by a custody agreement; a financed case SHALL be
papered by a loan agreement beside it; and an item leaving custody SHALL be
papered by a release receipt in a packet of its own.

Each SHALL be a one-page English document the vault renders itself, printing:

| Document | Facts | What its terms state |
| --- | --- | --- |
| Custody agreement | case, customer's verified legal name, the item as the item register holds it - its category, title and description, with its grader, grade and cert beside it where it has a grader - the recorded valuation, the shop it is held at, the date, the complaints contact | the item is kept in a secured vault until release; the valuation is what staff recorded and is not an offer to buy; reasonable care while it is held; storage carries no fee; collection in person against a signed release |
| Loan agreement | case, customer, collateral, principal, the interest as a percentage for the term, the same rate stated simple per annum, `Fees: None`, the term as days from the advance, the repayable amount, the date, the licence, the complaints contact | the term runs from the day the principal is advanced and the date is confirmed in writing then; after it the same daily rate continues, uncompounded and with no further fee; early repayment any day with the term's interest payable in full; release on full repayment; a written notice naming a final date at least the brand's notice period away before ownership may be taken, and forfeiture always a person's decision; Hong Kong SAR governing law; executed by the lender on the advance; and the borrower's own line that the key terms were explained before signing |
| Release receipt | case, customer, item, what was settled or that nothing was owed, the date, the complaints contact | the item has been handed back and inspected; nothing is outstanding; the custody agreement ends |

The custody agreement and the release receipt SHALL name the custodian; the
loan agreement SHALL name the lender, and the licence line SHALL print on the
lender's paper alone. In production a document SHALL be refused rather than
printed under the trading name while the party it needs has no registered
name.

A document SHALL be dated the calendar day it was signed on the brand's own
zone, and SHALL print neither a cooling-off period nor a redemption period no
regime has named.

The custody agreement SHALL print the item's facts as the register held them
when the packet was prepared, and SHALL read them again at every re-prepare; an
edit to the register after a packet was prepared SHALL NOT change that packet.
The collector's request as they sent it SHALL NOT be printed in the register's
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

#### Scenario: grade10-site-vault-documents-and-signing-SC-32 - The custody agreement names the item as the register holds it
**Serves:** grade10-site-vault-documents-and-signing-US-06 - the collector signs a paper naming the object the shop keeps

- **GIVEN** a case whose collector asked about "Charizard card", registered as a trading card titled "Charizard 1999 Base Set" with a description
- **WHEN** its packet is prepared
- **THEN** the custody agreement names the item "Charizard 1999 Base Set", a trading card, with the register's description
- **AND** it does not print "Charizard card"

#### Scenario: grade10-site-vault-documents-and-signing-SC-33 - A graded item prints its grader, grade and cert
**Serves:** grade10-site-vault-documents-and-signing-US-06 - the collector signs for the exact slab

- **GIVEN** a case whose item the register holds as PSA, `10`, cert `12345678`
- **WHEN** its packet is prepared
- **THEN** the custody agreement prints PSA, `10` and certificate number `12345678` beside the item

#### Scenario: grade10-site-vault-documents-and-signing-SC-34 - An item with no grader prints none
**Serves:** grade10-site-vault-documents-and-signing-US-06 - the collector leaves an ungraded watch

- **GIVEN** a case whose item has no grader
- **WHEN** its packet is prepared
- **THEN** the custody agreement prints no grader, grade or certificate number

#### Scenario: grade10-site-vault-documents-and-signing-SC-35 - A paper keeps the facts it was prepared with, and a re-prepare reads again
**Serves:** grade10-site-vault-documents-and-signing-US-06 - the collector is never handed a paper that changed after it was printed

- **GIVEN** a packet prepared while the register held grade `10`
- **WHEN** staff correct the grade to `9` on the register
- **THEN** the prepared custody agreement still prints `10`
- **WHEN** staff prepare the packet again
- **THEN** the new custody agreement prints `9`
