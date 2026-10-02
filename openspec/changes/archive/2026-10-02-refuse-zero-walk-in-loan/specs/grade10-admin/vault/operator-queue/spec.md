# grade10-admin/vault/operator-queue Specification

## Feature set

- Walk-in intake
  - A loan of zero: refused beside its field before anything is sent, by the
    worker's own rule for the amount

## MODIFIED Requirements

### Requirement: Staff open a draft for a customer at the counter

Staff open a vault request for a customer who walks in with an item and no
request of their own, as a draft under the customer's own account that the
customer then sends from their own phone.

1. **Open a walk-in** — the queue's header SHALL offer it to an operator
   holding the vault operate grant, and to nobody else.
2. **Read the statement** — the form SHALL show the collection statement in
   force before the address field, and the open SHALL keep the version shown.
3. **Type the request** — the customer's email address and the item's facts:
   category, title, optional description and optional financing amount, each
   held to the rules `grade10-site/vault/case-intake` sets for a collector's
   own request. The form SHALL ask for no name and take no contact number; the
   customer adds a number from their own phone.
4. **Photograph the item** — none or more of the operator's own photographs,
   held to the photograph rules of `grade10-site/vault/case-intake`; the
   customer's send still needs one.
5. **Open the case** — the draft SHALL open under the account behind that
   address, or under one created for it where there is none, and the operator
   SHALL land on the draft's own page.

The address SHALL be matched to its account whatever its capitals and the
spaces around it. Opening a walk-in SHALL send nothing to anybody. The draft
SHALL sit in the Drafts view until the customer sends it.

| Refused | When |
| --- | --- |
| Signed in before | the address belongs to an account someone has signed in to; the refusal SHALL say only that, and that the customer sends the request from their own phone |
| Draft cap | the account already holds three unsent requests; the cap's own refusal |
| Statement unwritten | in production, while no collection statement wording is set for the brand; outside production the open SHALL NOT be refused for it |
| Statement not in force | the version the form showed is not the one in force |
| A fact | any fact `grade10-site/vault/case-intake` refuses |
| Not an email address | the address does not meet the worker's rule for an email address; the form SHALL refuse it beside the address field when staff leave the field holding it, and not before; once shown, the refusal SHALL clear as soon as the address meets the rule or is emptied, and SHALL NOT show again until staff next leave the field; the walk-in SHALL NOT open while the address is malformed; an empty address is not refused, Open case waiting for one |
| A loan of zero | a loan is chosen and the amount is not more than zero; the form SHALL refuse it beside the loan field when staff leave the field holding it, and not before; once shown, the refusal SHALL clear as soon as the amount is more than zero or is emptied, and SHALL NOT show again until staff next leave the field; choosing a lane SHALL clear it and keep the amount; the walk-in SHALL NOT open while the amount fails the rule, unless staff choose storage only, which sends no amount; an empty amount is not refused, Open case waiting for one |

A refused open SHALL write no case, and the form SHALL keep what was typed.
Every case SHALL be opened under an account, and every identity SHALL stay
keyed to a person and never to a case. Staff SHALL NOT add a second item, edit
an item, or attach a photograph to a case, except a photograph on an unsent
draft staff opened.

#### Scenario: grade10-admin-vault-operator-queue-SC-55 - A walk-in opens a draft under the customer's account
**Serves:** grade10-admin-vault-operator-queue-US-10 - the operator serves a customer who arrives with no request

- **GIVEN** an address no account answers to
- **WHEN** an operator opens a walk-in for it with the item's facts and two photographs
- **THEN** a draft carrying those facts and photographs opens under a new account for that address
- **AND** the operator lands on the draft's page, and the draft is in the Drafts view
- **AND** nothing is emailed to anybody

#### Scenario: grade10-admin-vault-operator-queue-SC-56 - An account nobody has signed in to takes the draft
**Serves:** grade10-admin-vault-operator-queue-US-10 - the operator serves a customer whose address the shop met before

- **GIVEN** an account made for an address at an earlier checkout, which nobody has signed in to
- **WHEN** an operator opens a walk-in for that address
- **THEN** the draft opens under that account, and no second account exists for the address

#### Scenario: grade10-admin-vault-operator-queue-SC-57 - An address signed in to before is refused
**Serves:** grade10-admin-vault-operator-queue-US-10 - the operator learns this customer sends from their own phone

- **GIVEN** an account someone has signed in to
- **WHEN** an operator opens a walk-in for its address
- **THEN** it is refused by name, saying only that the address has signed in before and that the customer sends the request from their own phone
- **AND** no case is opened, and the form keeps what was typed

#### Scenario: grade10-admin-vault-operator-queue-SC-58 - The statement comes before the address and its version is kept
**Serves:** grade10-admin-vault-operator-queue-US-10 - the operator reads the statement to the customer before taking their address

- **GIVEN** a collection statement in force for the brand
- **WHEN** an operator opens the walk-in form
- **THEN** the statement is shown before the address field
- **AND** the draft the form opens keeps the version that was shown

#### Scenario: grade10-admin-vault-operator-queue-SC-59 - In production, an unwritten statement refuses the open
**Serves:** grade10-admin-vault-operator-queue-US-10 - the operator is not asked to collect an address under a statement that does not exist

- **GIVEN** production and a brand with no collection statement wording set
- **WHEN** an operator opens a walk-in
- **THEN** it is refused by name
- **AND** no case is opened and no account is created

#### Scenario: grade10-admin-vault-operator-queue-SC-60 - Outside production, an unwritten statement does not hold the open
**Serves:** grade10-admin-vault-operator-queue-US-10 - the operator rehearses a walk-in while the wording is still being written

- **GIVEN** an environment that is not production and a brand with no collection statement wording set
- **WHEN** an operator opens a walk-in
- **THEN** the draft opens, and the statement reads as being prepared

#### Scenario: grade10-admin-vault-operator-queue-SC-61 - A fourth unsent request is refused at the counter
**Serves:** grade10-admin-vault-operator-queue-US-10 - the operator meets the same cap the customer meets

- **GIVEN** an account holding three unsent requests, one of them opened at the counter
- **WHEN** an operator opens a walk-in for its address
- **THEN** it is refused with the draft cap's refusal, and no case is opened

#### Scenario: grade10-admin-vault-operator-queue-SC-62 - A walk-in sent twice opens one draft
**Serves:** Walk-in intake - an open the console sends again after its answer was lost

- **GIVEN** a walk-in an operator has opened
- **WHEN** the same open arrives again
- **THEN** it answers the draft already opened, and the account holds one draft for it

#### Scenario: grade10-admin-vault-operator-queue-SC-63 - Only the operate grant opens a walk-in
**Serves:** grade10-admin-vault-operator-queue-US-10 - a treasurer at the counter cannot open a case

- **GIVEN** an operator holding the vault read grant and not the vault operate grant
- **WHEN** they read the queue's header
- **THEN** no walk-in is offered, and sending one is refused by name

#### Scenario: grade10-admin-vault-operator-queue-SC-74 - An address typed in other capitals finds the same account
**Serves:** grade10-admin-vault-operator-queue-US-10 - the operator types the address as the customer spells it

- **GIVEN** an account someone has signed in to at `mei.chan@example.com`
- **WHEN** an operator opens a walk-in for ` Mei.Chan@Example.com `
- **THEN** it is refused as an address signed in before
- **AND** no case is opened, and no second account exists for the address

#### Scenario: grade10-admin-vault-operator-queue-SC-75 - A walk-in holds at most ten photographs
**Serves:** grade10-admin-vault-operator-queue-US-10 - the operator photographs the item under the collector's own limits

- **GIVEN** a walk-in form holding ten photographs
- **WHEN** the operator looks to add another
- **THEN** the form offers no way to add one, and still holds ten

#### Scenario: grade10-admin-vault-operator-queue-SC-76 - A fact the intake refuses is refused at the counter
**Serves:** grade10-admin-vault-operator-queue-US-10 - the operator corrects a field before the draft opens

- **GIVEN** a walk-in whose title runs past 200 characters
- **WHEN** the operator opens it
- **THEN** it is refused by name beside the title
- **AND** no case is opened, and the form keeps what was typed

#### Scenario: grade10-admin-vault-operator-queue-SC-95 - An address that is not an email address is refused beside its field
**Serves:** grade10-admin-vault-operator-queue-US-10 - the operator checks the address with the customer before the draft opens

- **GIVEN** a walk-in form holding a category and a title, and the address `mei.chan@example`
- **WHEN** the operator leaves the address field
- **THEN** it is refused by name beside the address, and the walk-in cannot be opened
- **AND** nothing is sent, and the form keeps what was typed

#### Scenario: grade10-admin-vault-operator-queue-SC-96 - A loan of zero is refused beside its field
**Serves:** grade10-admin-vault-operator-queue-US-10 - the operator asks the customer how much before the draft opens

- **GIVEN** a walk-in form holding an address, a category and a title, a loan chosen, and the amount `0`
- **WHEN** the operator leaves the loan field
- **THEN** it is refused by name beside the loan field, and the walk-in cannot be opened
- **AND** nothing is sent, and the form keeps what was typed

#### Scenario: grade10-admin-vault-operator-queue-SC-79 - A walk-in opens with no photograph
**Serves:** grade10-admin-vault-operator-queue-US-10 - the operator opens the draft before the item is photographed

- **GIVEN** a walk-in form holding a category and a title and no photograph
- **WHEN** the operator opens it
- **THEN** the draft opens
- **AND** the customer's send of it is refused until it holds a photograph

#### Scenario: grade10-admin-vault-operator-queue-SC-80 - Staff do not change a case they did not open as an unsent draft
**Serves:** grade10-admin-vault-operator-queue-US-10 - every case stays the collector's to describe

- **GIVEN** a request the collector sent, and an unsent draft staff opened
- **WHEN** an operator attaches a photograph to each
- **THEN** the sent request refuses it by name and is unchanged
- **AND** the draft staff opened takes it
