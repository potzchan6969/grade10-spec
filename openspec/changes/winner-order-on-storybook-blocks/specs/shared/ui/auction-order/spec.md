## Feature set

- **Order list**
  - AuctionOrderList: the page body with rows or the empty state.
  - AuctionOrderRow: one order with View lot and one next action.
- **Order detail**
  - AuctionWinnerOrder: the Winner Order page body from resolved parts; reports, never acts.
  - AuctionAddressForm: the address fields, errors, Confirm and Cancel.

## MODIFIED Requirements

### Requirement: The auction-order surface exports

The shared UI package SHALL export, from its public entry, exactly these
components for the winner's auction orders — `AuctionOrderList`,
`AuctionOrderRow`, `AuctionOrderEmpty`, `AuctionWinnerOrder` and
`AuctionAddressForm` — and exactly these types: `AuctionOrderListProps`,
`AuctionOrderRowProps`, `AuctionOrderRowCopy`, `AuctionOrderEmptyProps`,
`AuctionWinnerOrderProps`, `AuctionWinnerOrderCopy`,
`AuctionWinnerOrderStep`, `AuctionAddressFormProps`, `AuctionAddressFormCopy`
and `AuctionAddressFormValues`.

`AuctionOrderRow` SHALL render the lot's key image and title, the auction,
the winning bid and the order status as the application supplies them, a
**View lot** action, and exactly one next action whose label the application
supplies. It SHALL report which action was selected and SHALL NOT choose the
action from the status itself.

`AuctionWinnerOrder` SHALL render the header, Order Progress, the lot card,
the alerts and the sidebar that `grade10-site/auction/winner-order` names,
from the parts the application supplies. It SHALL derive each progress
step's state from the current step it is given and show no progress when
given none. It SHALL take every string through its props, amounts and dates
already formatted, and report each press through a callback; a PDF or
tracking link SHALL open the URL the application supplies. It SHALL NOT fetch,
write or read an order status.

`AuctionAddressForm` SHALL render the fields named in
`grade10-site/auction/winner-order`, mark the required ones, show an
application-supplied error beside each field it names, and report Confirm with
the entered values and Cancel. It SHALL NOT validate a phone number's format.

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

- **GIVEN** an `AuctionWinnerOrder` supplied with no invoice PDF and no pay
  control
- **WHEN** it renders
- **THEN** it shows the order summary's lines
- **AND** shows no Invoice PDF link and no pay control

<!-- trace:scenario id=g10.shared-auction-order.SC-qy4 rev=1 -->
#### Scenario: shared-ui-auction-order-SC-13 - The page body derives its steps
**Serves:** Order detail - the block derives the progress from the current step

- **GIVEN** an `AuctionWinnerOrder` supplied with Payment as the current step
- **WHEN** it renders
- **THEN** Address and Invoice read complete, Payment current, Shipping and
  Completed upcoming

<!-- trace:scenario id=g10.shared-auction-order.SC-ofq rev=1 -->
#### Scenario: shared-ui-auction-order-SC-14 - The page body reports a press
**Serves:** Order detail - the block reports, never acts

- **GIVEN** an `AuctionWinnerOrder` supplied with a pay control
- **WHEN** the winner selects it
- **THEN** the block reports the press through the pay callback
- **AND** makes no request of its own
