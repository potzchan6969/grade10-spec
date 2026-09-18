## Purpose

The shared auction-order address form lets an application collect the billing
address alongside delivery without owning the address-book or order rules.

## Feature set

- **Billing address form**
  - Same as delivery address is checked by default
  - Unchecking it reveals a second saved or one-time address
  - The application owns copy, validation and submitted values
- **Address form export**
  - The existing `AuctionAddressForm` surface carries the billing choice and
    the second address values
  - The component remains controlled and renderable on its own

## MODIFIED Requirements

### Requirement: The auction-order surface exports

The shared UI package SHALL export the existing auction-order components and
extend its address form contract for billing.

The shared UI package SHALL export, from its public entry, exactly these
components for the winner's auction orders — `AuctionOrderList`,
`AuctionOrderRow`, `AuctionOrderEmpty`, `AuctionOrderDetail` and
`AuctionAddressForm` — and exactly these types: `AuctionOrderListProps`,
`AuctionOrderRowProps`, `AuctionOrderRowCopy`, `AuctionOrderEmptyProps`,
`AuctionOrderDetailProps`, `AuctionOrderDetailCopy`,
`AuctionAddressFormProps`, `AuctionAddressFormCopy` and
`AuctionAddressFormValues`.

`AuctionAddressForm` SHALL render the delivery fields named in
`grade10-site/auction/winner-order`, mark the required ones, show an
application-supplied error beside each field it names, and report Confirm with
the entered delivery and billing values and Cancel. It SHALL NOT validate a
phone number's format and SHALL NOT offer a billing address unless the billing
variant is enabled by the consuming application.

For the billing variant, `AuctionAddressForm` SHALL expose a Same as delivery
address choice selected by default and SHALL reveal a second saved or one-time
address when that choice is cleared. Confirm SHALL report delivery and billing
values separately while preserving application-owned copy and validation.

`AuctionOrderRow` SHALL render the lot's key image and title, the auction, the
winning bid and the order status as the application supplies them, a **View
lot** action, and exactly one next action whose label the application supplies.
It SHALL report which action was selected and SHALL NOT choose the action from
the status itself.

`AuctionOrderDetail` SHALL render the Order Information, Collection Method,
Order Status and Lots sections in that order, and SHALL render in Collection
Method whichever of an address form, a read-only address, or nothing the
application supplies, and an invoice with Pay Now only when the application
supplies one.

Each of `AuctionOrderRow` and `AuctionAddressForm` SHALL be renderable on its
own.

#### Scenario: shared-ui-auction-order-SC-01 - The address form defaults billing to delivery
**Serves:** Order list and Order detail - the surface exports its names

- **WHEN** an application imports each name above from the shared UI package's
  public entry
- **THEN** every import resolves
- **AND** no other component or type is exported for this surface

#### Scenario: shared-ui-auction-order-SC-02 - The form reveals a second billing address
**Serves:** Order list - a row reports its action without choosing it

- **GIVEN** an `AuctionOrderRow` supplied with the action label Pay Invoice
- **WHEN** the winner selects it
- **THEN** the row reports the next action as selected
- **AND** the label shown is the one supplied

#### Scenario: shared-ui-auction-order-SC-03 - The form shows supplied errors and reports values
**Serves:** Order detail - the form shows supplied errors and reports values

- **GIVEN** an `AuctionAddressForm` supplied with an error for Town/City
- **WHEN** the winner selects Confirm
- **THEN** the error shows beside Town/City
- **AND** the form reports Confirm with the entered values

#### Scenario: shared-ui-auction-order-SC-04 - The detail omits an invoice it was not given
**Serves:** Order detail - the detail omits an invoice it was not given

- **GIVEN** an `AuctionOrderDetail` supplied with no invoice
- **WHEN** it renders
- **THEN** it shows the four sections
- **AND** shows no invoice and no Pay Now

#### Scenario: shared-ui-auction-order-SC-05 - The billing form defaults to delivery
**Serves:** Billing address form - the form starts with one shared address

- **GIVEN** an `AuctionAddressForm` with billing enabled and a complete delivery
  address
- **WHEN** it renders
- **THEN** Same as delivery address is selected
- **AND** no second billing address picker is required

#### Scenario: shared-ui-auction-order-SC-06 - The billing form reports two addresses
**Serves:** Billing address form - the form collects a different address

- **GIVEN** an `AuctionAddressForm` with Same as delivery address selected
- **WHEN** the winner clears that choice and selects a saved or one-time address
- **THEN** the form reveals the second address
- **AND** Confirm reports the delivery and billing values separately
