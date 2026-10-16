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
  - The receipts: the intake receipt is issued, not signed; the return
    receipt is signed and closes the return
