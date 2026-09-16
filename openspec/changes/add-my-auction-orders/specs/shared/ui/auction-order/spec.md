## Purpose

The shared blocks a store application composes for a winner's auction orders:
the My Auction Orders list, its row and empty state, the order detail, and the
delivery address form. They display what they are given and report what the
winner did; every status, amount and string belongs to the application.

## Feature set

- **Order list**
  - AuctionOrderList: the page body with rows or the empty state.
  - AuctionOrderRow: one order with View lot and one next action.
- **Order detail**
  - AuctionOrderDetail: the four sections and the status-dependent content.
  - AuctionAddressForm: the address fields, errors, Confirm and Cancel.

## ADDED Requirements

### Requirement: The auction-order surface exports

The shared UI package SHALL export, from its public entry, exactly these
components for the winner's auction orders — `AuctionOrderList`,
`AuctionOrderRow`, `AuctionOrderEmpty`, `AuctionOrderDetail` and
`AuctionAddressForm` — and exactly these types: `AuctionOrderListProps`,
`AuctionOrderRowProps`, `AuctionOrderRowCopy`, `AuctionOrderEmptyProps`,
`AuctionOrderDetailProps`, `AuctionOrderDetailCopy`,
`AuctionAddressFormProps`, `AuctionAddressFormCopy` and
`AuctionAddressFormValues`.

`AuctionOrderRow` SHALL render the lot's key image and title, the auction,
the winning bid and the order status as the application supplies them, a
**View lot** action, and exactly one next action whose label the application
supplies. It SHALL report which action was selected and SHALL NOT choose the
action from the status itself.

`AuctionOrderDetail` SHALL render the Order Information, Collection Method,
Order Status and Lots sections in that order, and SHALL render in Collection
Method whichever of an address form, a read-only address, or nothing the
application supplies, and an invoice with Pay Now only when the application
supplies one.

`AuctionAddressForm` SHALL render the fields named in
`grade10-site/auction/winner-order`, mark the required ones, show an
application-supplied error beside each field it names, and report Confirm with
the entered values and Cancel. It SHALL NOT validate a phone number's format
and SHALL NOT offer a billing address.

Each of `AuctionOrderRow` and `AuctionAddressForm` SHALL be renderable on its
own.

#### Scenario: shared-ui-auction-order-SC-01 - An application imports the surface
**Serves:** `Order list`, `Order detail` - every name the surface exports resolves

- **WHEN** an application imports each name above from the shared UI package's
  public entry
- **THEN** every import resolves
- **AND** no other component or type is exported for this surface

#### Scenario: shared-ui-auction-order-SC-02 - A row reports its action without choosing it
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
