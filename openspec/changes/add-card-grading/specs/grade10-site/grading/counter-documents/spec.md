# grade10-site/grading/counter-documents Specification

## Purpose

The paper a submission is held to: the agreement signed before any money
moves, the receipt issued when the cards are handed in, and the receipt signed
when they are handed back, each one page of English on the shop iPad with
staff present.

The ceremony that seals them is the vault's
(`grade10-site/vault/documents-and-signing`); grading keeps no identity
record, so its packet names the person from the booking and asks for none.

## Feature set

- The three documents
  - Two signed, one issued: the submission agreement, the hand-back receipt,
    and the intake receipt that needs no signature
  - When each is signed: the agreement once every card is checked, the receipt
    once the balance is settled and every item is ticked
  - Who signs: the collector at hand-in, whoever collects at hand-back
- Signing at the counter
  - One document at a time: a short-lived link shown on the iPad or copied
    from the console
  - No identity asked for: the name is the one on the booking, and the packet
    requires no identity record
  - The postal address: one line taken at signing and kept only for the
    written notice
  - Read before signing: the document is turned to its end before it takes a
    signature
  - Declining: withdraws the document and is itself on the record, with
    nothing paid and nothing handed back
- The submission agreement
  - What it prints: the submission, the customer, the grader and level, the
    cards as a schedule with each declared value and its cover, the fee, the
    estimated return as an estimate, and the complaints contact
  - Seven clauses in the reader's words: who holds the cards and hands them
    back, what the declared value does, when the fee stands, the upcharge, the
    cover and what a lost card is paid, storage and the notice, and the
    governing law
- The intake receipt
  - Issued, not signed: a receipt for money already taken needs no signature
  - What it carries: every intake id, the paid order's reference, the cards as
    checked, and the estimated day back
- The hand-back receipt
  - What it prints: what was handed back with its certs and codes, what was
    paid, refunded and paid out, who collected, and whether an ID was matched
    with nothing kept
  - Three clauses: the items inspected and accepted, nothing outstanding, and
    the submission closed with the record staying on the page
  - Refused while anything is due: it cannot be prepared until the balance is
    settled and every item is ticked
  - A card still out: the receipt names it, and a second receipt closes the
    submission
  - A slab vaulted instead: the receipt says the card went to the vault rather
    than to the customer
- Pinned figures and placeholders
  - Pinned at signing: every figure the agreement prints is the value it held
    at signing, and a setting changed later changes no signed paper
  - No placeholder in production: a document cannot be sealed while a fact it
    prints is unset; outside production the bracket prints
- Copies and fingerprints
  - Three ways to a copy: the download after the seal, the email with the
    signed PDF attached, and the submission page
  - Each with its fingerprint: what was signed can be told apart from what was
    not

## ADDED Requirements

### Requirement: A submission is papered by three documents, two signed and one issued

Every submission is papered by three one-page English documents grading
renders itself, prepared at the counter with the collector in front of it.

| Document | Prepared | Signed by | Reaches the collector |
| --- | --- | --- | --- |
| Submission agreement | at hand-in, once every card on the submission is checked | the collector | the download after the seal, and the hand-in email with the sealed document attached |
| Intake receipt | at hand-in, when the cards are taken in | nobody: it is issued | the hand-in email, and the submission page |
| Hand-back receipt | at collection, once the balance is settled and every item is ticked | whoever collects | the download after the seal, and the collection email with the sealed document attached |

**The two signed** - the submission agreement and the hand-back receipt SHALL
be sealed on the ceremony `grade10-site/vault/documents-and-signing` states,
reached at grading's own signing address, one document to a packet.

**The one issued** - the intake receipt SHALL take no signature and SHALL be
offered no signing link: it receipts money the till has already taken.

**Not before the counter is ready** - an agreement SHALL be refused while any
card on the submission is unchecked, and a hand-back receipt SHALL be refused
while anything is due or any item is unticked. A refusal SHALL name what is
missing and SHALL leave the submission where it stands.

#### Scenario: grade10-site-grading-counter-documents-SC-01 - The agreement waits for every card to be checked
**Serves:** grade10-admin/grading/counter#grade10-admin-grading-counter-US-11 - staff at the desk with one card of the list still unchecked

- **GIVEN** a submission whose list holds a card nobody has checked yet
- **WHEN** staff prepare the submission agreement
- **THEN** it is refused by name
- **AND** nothing is rendered and nothing is offered to sign

#### Scenario: grade10-site-grading-counter-documents-SC-02 - The hand-back receipt waits for the balance and every tick
**Serves:** grade10-site-grading-counter-documents-US-03 - a collector at the counter with an upcharge still to settle

- **GIVEN** a submission with an upcharge outstanding and an item not yet ticked
- **WHEN** staff prepare the hand-back receipt
- **THEN** it is refused by name, saying what is due and what is unticked
- **AND** nothing is handed back

#### Scenario: grade10-site-grading-counter-documents-SC-03 - The intake receipt is issued rather than signed
**Serves:** grade10-admin/grading/counter#grade10-admin-grading-counter-US-02 - a collector handing the cards in once the fee is paid

- **WHEN** the cards are handed in
- **THEN** the intake receipt is issued against the submission
- **AND** nobody is asked to sign it and no signing link is minted for it

### Requirement: The counter's ceremony asks for no identity and takes the name from the booking

Grading signs on the vault's ceremony and keeps no identity record of its own.

**No identity record** - a grading packet SHALL require none: no identity check
SHALL be read, asked for or kept, and the certificate SHALL say the document
was signed without one.

**The name** - the signer SHALL type the name the submission was booked under,
and a name that does not match it SHALL be refused by name. The hand-back
receipt's signing block SHALL refuse a mismatch the same way, against the
booking's name or, where the collector named somebody to collect, that
person's name.

**The link** - one document SHALL be reached at a time, on the link rules
`grade10-site/vault/documents-and-signing` states - single-use, 30 minutes,
bound to the first device that opens it - shown on the shop iPad or copied from
the console. A link past its window SHALL be refused by name, and staff SHALL
be able to prepare another.

**Read before signing** - a document SHALL be turned to its end before it will
take a signature, as that capability's ceremony states.

**The postal address** - one line SHALL be taken when the agreement is signed,
prefilled from the account where the collector has one, kept with the agreement
and used only for the written notice. The signature SHALL be refused while the
line is empty, naming it.

**Declining** - declining SHALL withdraw the document, SHALL be recorded, and
SHALL leave nothing signed: nothing SHALL be paid on a declined agreement, and
nothing SHALL be handed back on a declined receipt.

**Signing once** - a document already sealed SHALL NOT take a second signature;
its sealed copy SHALL be offered instead.

#### Scenario: grade10-site-grading-counter-documents-SC-04 - A name that is not the booking's is refused
**Serves:** grade10-site-grading-counter-documents-US-01 - a collector typing their name on the iPad

- **GIVEN** an agreement prepared for a submission booked under one name
- **WHEN** the signer types another name
- **THEN** the signature is refused by name
- **AND** nothing is sealed

#### Scenario: grade10-site-grading-counter-documents-SC-28 - The hand-back receipt refuses a name the submission does not hold
**Serves:** grade10-site-grading-counter-documents-US-03 - somebody at the collection counter typing a name that is neither the collector's nor the named person's

- **GIVEN** a hand-back receipt prepared for a submission booked under one name, with nobody named to collect
- **WHEN** the signer types another name
- **THEN** the signature is refused by name, against the booking's name
- **AND** nothing is sealed and nothing is handed back

#### Scenario: grade10-site-grading-counter-documents-SC-05 - A grading document is signed with no identity record
**Serves:** grade10-site-grading-counter-documents-US-01 - a collector who has shown the shop no document signing for their cards

- **GIVEN** a collector grading holds no identity check for
- **WHEN** they sign the agreement and it seals
- **THEN** the seal is not refused for want of an identity check
- **AND** no identity record is asked for or kept, and the certificate says the document was signed without one

#### Scenario: grade10-site-grading-counter-documents-SC-06 - The agreement takes no signature without the postal address
**Serves:** grade10-site-grading-counter-documents-US-01 - a collector reaching the signing block with the address line empty

- **GIVEN** an agreement whose postal address line is empty
- **WHEN** the signer signs
- **THEN** it is refused by name, naming the address line

#### Scenario: grade10-site-grading-counter-documents-SC-07 - A document not read to its end takes no signature
**Serves:** grade10-site-grading-counter-documents-US-01 - a collector signing before scrolling through the clauses

- **GIVEN** an agreement the signer has not turned to its end
- **WHEN** they sign it
- **THEN** it is refused by name

#### Scenario: grade10-site-grading-counter-documents-SC-08 - A link past its window is refused and staff prepare another
**Serves:** grade10-site-grading-counter-documents-US-01 - a collector opening the iPad half an hour after staff showed it

- **GIVEN** a signing link minted 31 minutes ago
- **WHEN** it is opened
- **THEN** it is refused by name, saying to ask staff for a new one
- **AND** staff can prepare the same document again

#### Scenario: grade10-site-grading-counter-documents-SC-09 - Declining the agreement leaves nothing paid
**Serves:** grade10-site-grading-counter-documents-US-02 - a collector who would rather not sign on a screen

- **GIVEN** an agreement prepared and unsigned
- **WHEN** the signer declines
- **THEN** the document is withdrawn and the decline is on the record
- **AND** no fee is taken and the submission is still booked

#### Scenario: grade10-site-grading-counter-documents-SC-10 - Declining the hand-back receipt hands nothing back
**Serves:** grade10-site-grading-counter-documents-US-02 - somebody at the collection counter refusing the screen

- **GIVEN** a hand-back receipt prepared and unsigned
- **WHEN** the signer declines
- **THEN** the document is withdrawn and the decline is on the record
- **AND** nothing is handed back and the submission is still ready

#### Scenario: grade10-site-grading-counter-documents-SC-11 - A sealed document's link offers the copy rather than a second signature
**Serves:** grade10-site-grading-counter-documents-US-05 - somebody reopening the iPad after signing

- **GIVEN** a document already sealed
- **WHEN** its link is opened again
- **THEN** a second signature is refused by name
- **AND** the sealed copy is offered

### Requirement: The submission agreement prints the submission and carries seven clauses

The agreement is what the collector signs before any money moves, and it prints
every fact it is held to.

**Printed** - the agreement SHALL print the submission, the customer and the
postal address taken at signing, the grader and the level, the cards as a
schedule with each card's declared value and, where the level carries cover,
its cover line, the declared value in total, the fee payable at the counter
once it is signed, the estimated return as a number of weeks from the day the
batch leaves and said to be an estimate rather than a promise, the date on the
shop's own day, the custodian's registered name, and the complaints contact.

**The schedule is the cards as checked** - a card refused at the check SHALL
appear on neither the schedule nor the fee.

**Seven clauses**, in the reader's words:

| Clause | What it states |
| --- | --- |
| 1 | Grade10 submits the cards to the grader on the customer's behalf under the grader's own terms, and hands them back in person to the customer or a person they name on the submission page, against the pickup code; slabs are not shipped |
| 2 | The declared value sets the level and the insured cover; it does not affect the grade |
| 3 | The fee is charged whether or not the grader encapsulates a card; a card refused at hand-in, or withdrawn before its batch closes, is not charged |
| 4 | Where the grader moves a card to a higher level, the difference between the two levels on the pinned fee sheet is payable at the counter before collection; the grade is the grader's decision |
| 5 | In transit the cards are covered to their declared value under the courier's declared-value cover and the grader's terms; at the shop they are kept in the safe and Grade10 holds no separate policy; a card not returned, or returned damaged, is paid out at its declared value with its fee refunded, inside the payout window pinned at signing |
| 6 | Cards not collected incur the storage fee pinned at signing, per card and per month, from the day pinned at signing after the ready email, payable before collection; after written notice on the notice day pinned at signing, and the days that notice gives from its posting, Grade10 may dispose of them under the Disposal of Uncollected Goods Ordinance (Cap. 456) and holds the proceeds less its fees for the customer |
| 7 | Governing law Hong Kong SAR, and the complaints contact |

#### Scenario: grade10-site-grading-counter-documents-SC-12 - A level that carries cover prints a cover line per card and the cover in total
**Serves:** grade10-site-grading-counter-documents-US-01 - a collector reading what each card is covered for before signing

- **GIVEN** a submission at a level whose sheet carries a cover rate
- **WHEN** the agreement is rendered
- **THEN** the schedule carries a cover line beside each card's declared value
- **AND** the cover is printed in total beside the declared value in total

#### Scenario: grade10-site-grading-counter-documents-SC-13 - A card refused at the check is on neither the schedule nor the fee
**Serves:** grade10-admin/grading/counter#grade10-admin-grading-counter-US-03 - staff turning one card down while the rest go on

- **GIVEN** a list of four cards with one refused at the check
- **WHEN** the agreement is rendered
- **THEN** its schedule lists the three cards that were checked
- **AND** the fee it prints covers those three alone

#### Scenario: grade10-site-grading-counter-documents-SC-14 - The return date prints as an estimate from the day the batch leaves
**Serves:** grade10-site-grading-counter-documents-US-01 - a collector working out when the cards come home

- **WHEN** the agreement is rendered
- **THEN** the estimated return is stated as a number of weeks from the day the batch leaves
- **AND** it says it is an estimate and not a promise

### Requirement: The intake receipt records what was handed in against what was paid

The intake receipt is the paper the collector leaves the shop with.

**Carries** - the receipt SHALL print every card's intake id, the reference of
the paid order, the cards as checked, and the estimated day back.

**Issued at hand-in** - it SHALL be issued as the cards are taken in, as a
document on the submission and in the hand-in email, with the sealed agreement
attached beside it.

#### Scenario: grade10-site-grading-counter-documents-SC-15 - The receipt names every intake id and the order that paid
**Serves:** grade10-admin/grading/counter#grade10-admin-grading-counter-US-02 - a collector leaving the counter with the bag sealed in

- **GIVEN** four cards handed in against one paid order
- **WHEN** the intake receipt is issued
- **THEN** it prints the four intake ids, the paid order's reference, the four cards as checked, and the estimated day back
- **AND** the hand-in email carries it with the sealed agreement attached

### Requirement: The hand-back receipt prints what was handed back and closes the submission

The hand-back receipt is signed at the counter with the cards on the desk.

**Printed** - the receipt SHALL print the customer; what was handed back, each
encapsulated card with its cert and each card returned ungraded with its code;
what was paid, what was refunded and what was paid out, and how; who collected,
the customer in person or the person they named, and whether an ID was matched
to the name with nothing kept; and where and when.

**Three clauses** - the customer inspected each item and accepted it in the
condition it was handed back in; nothing is outstanding; the submission is
closed and the graded record stays on the submission page.

**The named person** - where the collector named somebody to collect, the name
line SHALL be prefilled with that person's name as the submission page holds
it and SHALL NOT be editable; the counter's ID glance is what checks it.

**A card the grader held** - the receipt SHALL name the card still out, the
submission SHALL stay ready for it, and a second receipt SHALL close the
submission when that card is handed back.

**A slab that went to the vault** - the receipt SHALL say the card went into a
vault case rather than to the customer.

**A card withdrawn before its batch closed** - it SHALL be handed back against
a receipt of its own, naming that card and the fee refunded for it.

**Several outcomes at once** - one hand-back SHALL print one receipt however
many exceptions it carries, with a line per card stating that card's outcome -
handed back, held by the grader, gone into a vault case, withdrawn, or paid
out - rather than a receipt per exception.

#### Scenario: grade10-site-grading-counter-documents-SC-16 - The receipt names who collected and the ID that was glanced at
**Serves:** grade10-site-grading-counter-documents-US-03 - a collector collecting cards worth more than the glance threshold

- **GIVEN** a collection above the ID glance threshold
- **WHEN** the hand-back receipt is rendered
- **THEN** it names who collected and says an ID was matched to the name
- **AND** it says nothing was kept from that ID

#### Scenario: grade10-site-grading-counter-documents-SC-17 - A named person signs in the collector's place
**Serves:** grade10-site-grading-counter-documents-US-04 - somebody the collector named coming in for the cards

- **GIVEN** a submission naming one person to collect
- **WHEN** that person opens the hand-back receipt
- **THEN** the name is prefilled as the submission page names them
- **AND** the sealed receipt records that they collected in the customer's place

#### Scenario: grade10-site-grading-counter-documents-SC-29 - The named person's prefilled name does not take an edit
**Serves:** grade10-site-grading-counter-documents-US-04 - somebody the collector named reading their own name on the iPad

- **GIVEN** a hand-back receipt opened by the person the collector named to collect
- **WHEN** they try to retype the prefilled name
- **THEN** the line does not take the edit
- **AND** the receipt seals under the name the submission page holds

#### Scenario: grade10-site-grading-counter-documents-SC-18 - A card the grader held is named, and a second receipt closes the submission
**Serves:** grade10-site-grading-counter-documents-US-03 - a collector taking three slabs home while one card is still with the grader

- **GIVEN** a submission of four cards with one still held by the grader
- **WHEN** the hand-back receipt for the other three is sealed
- **THEN** the receipt names the card still out and the submission stays ready
- **AND** the card handed back later is receipted on a second hand-back receipt that closes the submission

#### Scenario: grade10-site-grading-counter-documents-SC-19 - A slab that went into a vault case says so
**Serves:** grade10-site-grading-counter-documents-US-03 - a collector leaving one slab with the shop to vault

- **GIVEN** a collection where one slab goes into a vault case at the same counter
- **WHEN** the hand-back receipt is rendered
- **THEN** it says that card went to the vault rather than to the customer

#### Scenario: grade10-site-grading-counter-documents-SC-20 - A card withdrawn before its batch closed has a receipt of its own
**Serves:** grade10-site/grading/submission-lifecycle#grade10-site-grading-submission-lifecycle-US-02 - a collector asking for one card back before the cards leave

- **GIVEN** a card withdrawn from a submission before its batch closed
- **WHEN** it is handed back at the counter
- **THEN** a receipt names that card alone and the fee refunded for it

#### Scenario: grade10-site-grading-counter-documents-SC-21 - The receipt prints what was paid, refunded and paid out
**Serves:** grade10-site-grading-counter-documents-US-03 - a collector reading the money on the paper before signing for the cards

- **GIVEN** a collection settling an upcharge, refunding an ungraded card's fee and paying out a card that did not come back
- **WHEN** the hand-back receipt is rendered
- **THEN** it prints what was paid, what was refunded and what was paid out, each with how it moved

#### Scenario: grade10-site-grading-counter-documents-SC-30 - Two exceptions on one hand-back print one receipt with a line per card
**Serves:** grade10-site-grading-counter-documents-US-03 - a collector collecting with one card still at the grader and another going into a vault case

- **GIVEN** a submission of four cards, one still held by the grader and one placed into a vault case at the counter
- **WHEN** the hand-back receipt is rendered
- **THEN** one receipt is prepared for that hand-back rather than one per exception
- **AND** it carries a line per card stating that card's outcome, the two handed back, the one held and the one vaulted

### Requirement: Every figure a document prints is pinned at signing

What the paper says is what the submission is held to from then on.

**Pinned** - when the agreement is prepared, the level's fee and its cover rate
from the sheet pinned when the plan was booked, the storage fee, the day
storage starts, the payout window, the notice day and the days the notice gives
SHALL be read once, and every document of that submission SHALL print those
values from then on.

**A setting changed later** - SHALL change no signed paper, and SHALL reach
only submissions not yet booked.

#### Scenario: grade10-site-grading-counter-documents-SC-22 - A storage fee raised after signing leaves the signed paper as it was
**Serves:** grade10-site-grading-counter-documents-US-01 - a collector holding the agreement they signed weeks before collecting

- **GIVEN** a submission whose agreement was sealed with a storage fee of 3000 HKD minor units a card a month
- **WHEN** the setting is changed to 5000 HKD minor units and the hand-back receipt is prepared
- **THEN** the sealed agreement still prints 3000 HKD minor units
- **AND** what is due on that submission is worked out at the pinned figure

### Requirement: A document is refused rather than sealed while a fact it prints is unset

Nothing the collector signs carries a bracket where a value belongs.

**In production** - a document SHALL be refused by name, before anything is
rendered or sealed, while any fact it prints has no value; the custodian's
registered name and the complaints contact are among those facts.

**Outside production** - the unset fact SHALL print as a bracket, marked as
one, so the page can be read before its values are decided.

#### Scenario: grade10-site-grading-counter-documents-SC-23 - Production refuses paper that names no company
**Serves:** Pinned figures and placeholders, grade10-site-grading-counter-documents-US-01 - a collector who would otherwise be asked to sign against a bracket

- **GIVEN** a production brand whose custodian has no registered name
- **WHEN** an agreement is prepared
- **THEN** it is refused by name and nothing is rendered

#### Scenario: grade10-site-grading-counter-documents-SC-24 - Outside production the bracket prints and is marked
**Serves:** Pinned figures and placeholders, grade10-site-grading-counter-documents-US-01 - the shop reading the paper before Legal has settled its values

- **GIVEN** a staging brand whose complaints contact is unset
- **WHEN** an agreement is rendered
- **THEN** the contact prints as a bracket marked as a placeholder
- **AND** the document is rendered rather than refused

### Requirement: Every document reaches the collector three ways, each with its fingerprint

A signer holds their own copy without asking the shop for one.

**The download** - after the seal, the signer SHALL be able to download the
document there and then.

**The email** - the sealed document SHALL be attached to the email the
submission sends for that step.

**The submission page** - SHALL list every document of the submission with its
fingerprint and a download, for as long as the submission record is kept.

**The fingerprint** - SHALL be the document's SHA-256, and grading SHALL
answer, for a digest anybody holds, whether it is one grading issued or sealed,
naming nobody.

**Nothing withdrawn is offered** - a declined or withdrawn document SHALL NOT
be listed and SHALL offer no download.

#### Scenario: grade10-site-grading-counter-documents-SC-25 - The copies reach the signer three ways
**Serves:** grade10-site-grading-counter-documents-US-05 - somebody who has just signed at the counter

- **WHEN** a document is sealed
- **THEN** the signer can download it there and then
- **AND** the email for that step carries the sealed document attached
- **AND** the submission page lists it with its fingerprint and a download

#### Scenario: grade10-site-grading-counter-documents-SC-26 - A declined document is on none of the three
**Serves:** grade10-site-grading-counter-documents-US-05 - a collector reading the page after declining at the counter

- **GIVEN** an agreement the signer declined
- **WHEN** the submission page is read
- **THEN** that document is not listed and no download is offered for it

#### Scenario: grade10-site-grading-counter-documents-SC-27 - A digest grading never issued answers as unknown
**Serves:** Copies and fingerprints, grade10-site-grading-counter-documents-US-05 - somebody checking a PDF they were handed against the shop's record

- **WHEN** a digest grading never issued or sealed is checked
- **THEN** the answer says it is not one of grading's
- **AND** it names nobody
