## Purpose

Winner Order records where a lot is shipped and who is billed before the
invoice is sent, then keeps both addresses on the invoice and receipt.

## Feature set

- **Billing address at setup**
  - Same as delivery address is selected by default
  - A separate saved or one-time address uses the existing address fields
  - Billing is confirmed with delivery and payment method
- **Address snapshots**
  - The confirmed billing address is locked on the order
  - Later account-address changes do not rewrite the order
- **Invoice and receipt addresses**
  - Invoice shows Bill To and Ship To from the order snapshot
  - Receipt keeps the addresses of the invoice it pays

## MODIFIED Requirements

### Requirement: The address form refuses empty required fields

In Awaiting Setup the winner SHALL confirm a delivery address and a billing
address with the fields named by the existing address form. Billing SHALL
default to the delivery address and SHALL be confirmed with the delivery
address and payment method.

Confirming with any required field empty SHALL be refused, SHALL show an error
on each empty required field, and SHALL keep the order in Awaiting Setup.
Grade10 SHALL NOT check the phone number's format. The winner MAY untick Same
as delivery address and choose a saved or one-time billing address. Cancel
SHALL leave the order in Awaiting Setup with no address confirmed.

#### Scenario: winner-order-SC-11 - Same delivery details bill the order by default
**Serves:** winner-order-US-11 - Winner bills a won lot to a different address

- **GIVEN** a winner on the order-setup form with a complete delivery address
- **WHEN** the winner opens the billing step
- **THEN** Same as delivery address is selected by default
- **AND** the delivery address is shown as the billing address
- **AND** the winner can confirm setup with the delivery address and payment method

#### Scenario: winner-order-SC-12 - A different saved address is captured for billing
**Serves:** winner-order-US-11 - Winner bills a won lot to a different address

- **GIVEN** a winner on the billing step with Same as delivery address selected
- **WHEN** the winner unticks it and chooses a saved address
- **THEN** the second address is used as the billing address
- **AND** the delivery address remains the shipping address
- **AND** both addresses are confirmed with the payment method

### Requirement: Invoices and receipts show immutable billing and delivery snapshots

The invoice and receipt identify the address that is billed separately from the
address where the lot is shipped.

**Invoice and receipt** — An invoice SHALL show Bill To and Ship To from the
order's confirmed snapshots. A receipt SHALL show the addresses of the invoice
it pays and SHALL NOT change when a saved address is edited or archived later.

#### Scenario: winner-order-SC-13 - Bill To and Ship To stay on the paid receipt
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** a paid order whose billing and delivery snapshots are different
- **WHEN** the winner opens its invoice and receipt
- **THEN** both documents show Bill To and Ship To
- **AND** the receipt carries the same addresses as the invoice it pays
- **AND** editing the saved billing address does not change either document
