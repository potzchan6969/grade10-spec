# grade10-site/consignment/documents Specification

## Purpose

The paper a consignment is held to: the consignment agreement and the
intake and return receipts, signed electronically through the documents
service and naming where the consignment was taken, the consignor and the
linked account.

What the terms mean is `grade10-site/consignment/lifecycle`; the money
paper a sale issues is `grade10-site/consignment/payout`; the identity the
paper asks for is `grade10-site/vault/identity-verification`.

## Feature set

- The packet
  - Three documents: the consignment agreement, the intake receipt and the
    return receipt
  - What it names: where the consignment was taken, the consignor's
    information and the linked Grade10 account
  - The terms printed: each item's price and floor, the commission, the
    incentive, the fees and the term pinned at preparation
- Signing
  - Electronically: on the documents service, at the counter or on the
    consignor's own phone
  - Identity first: the check the setting asks for before signing, always
    verified by default
  - Unset refuses: an agreement is not prepared while a figure it prints is
    unset
- After the seal
  - The consignor's copy: the sealed agreement reaches the consignor
  - The receipts: the intake receipt is signed when every item is in, and
    custody starts then; the return receipt is signed and closes the return

## ADDED Requirements

### Requirement: The agreement names where it was taken, the consignor and the linked account

The consignment agreement SHALL print where the consignment was taken, the
counter's shop or the event's name; whether the consignor is an individual
or a company, with a company's registered office; the Grade10 account
linked at intake, or a partner's deal; and for each item its market value
and the incentive it earns, beside the incentive's rate pinned at
preparation.

#### Scenario: grade10-site-consignment-documents-SC-01 - An event agreement names the event, the company and the incentive
**Serves:** grade10-site-consignment-documents-US-01 - the consignor signs the agreement electronically

- **GIVEN** a company consignment taken at the Hong Kong Card Show, its card at a market value of HKD 4,000.00 under a 5% incentive
- **WHEN** staff prepare the agreement
- **THEN** it prints the event, the company's registered office, the linked account, the market value and an incentive of HKD 200.00

### Requirement: An agreement is not prepared while a figure it prints is unset

An agreement SHALL NOT be prepared while the schedule leaves unset a
commission for a channel its items sell in, or the incentive's rate; the
refusal SHALL name the figure.

#### Scenario: grade10-site-consignment-documents-SC-02 - An unset incentive holds the agreement
**Serves:** grade10-site-consignment-documents-US-01 - the consignor signs only figures that are set

- **GIVEN** a schedule whose incentive is unset
- **WHEN** staff prepare the agreement
- **THEN** it is refused, naming the incentive
