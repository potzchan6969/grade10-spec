## Feature set

- Invoice at lot close
  - One invoice per lot: a winner of three lots owes three amounts on three deadlines, never one consolidated bill
  - Estimate-first pricing: the invoice is payable from the moment of close rather than waiting on an address
  - Final amount: names every component a winner is asked to pay, so a total is explicable line by line
  - Buyer's premium: 20% of the winning bid or the currency's minimum charge, whichever is higher, computed by Grade10
  - Invoice premium: 20% of the winning bid
  - Integer amount: rounded to the nearest minor unit
  - Bid-panel boundary: only the rate appears before invoicing
- Premium minimum
  - Currency minimum: the current Auction Payment settings mapping sets the lower bound for the calculated premium
- Delivery address
  - Account-wide address book: the platform keeps at most five named shipping addresses and one optional default for the account
  - Selection and confirmation: a winner chooses a saved address or adds one, then affirms it before payment
  - Amendment and recalculation: a winner corrects the destination and sees what it costs before paying
  - Locking at payment: the order snapshot stops moving once money has changed hands
- Settlement
  - Hold release: the bid-time authorization verified a bidder and is not the instrument that settles
  - Single fresh charge: one transaction for the final amount, retryable on failure
- Payment deadline
  - Seven days from close: a fixed end to the winner's obligation, unmoved by anything they do to the invoice
- Records the winner keeps
  - Payment receipt: proof of what was paid, itemised, retrievable for the life of the account
  - Shipping tracker: where the lot is once it has left
  - Delivery proof: what the carrier recorded on handover, given what these lots are worth

## MODIFIED Requirements

### Requirement: The account owns a reusable shipping address book

The platform auth service SHALL own the account's shipping address book. One
account SHALL be able to keep multiple named shipping addresses, up to a
maximum of five, and SHALL have at most one default. The address book SHALL
be available across storefronts that the account can use.

The winner order SHALL allow the winner to choose any saved address, add a new
address, edit an unused address, archive an address, and change the default.
An address selected for an order SHALL be copied into the order as a snapshot;
editing or archiving the saved address later SHALL NOT change that order.
The platform SHALL refuse to archive the address currently selected by an
unpaid order unless the winner first selects another address for that order.

When the account's address book already holds five named addresses, the
winner order SHALL still let the winner add a new address and use it as the
current order's delivery address for that order alone; the platform SHALL
refuse to save that address into the account address book until the winner
removes an existing one to free a slot. An account that already holds more
than five named addresses (for example, from data that predates this cap)
SHALL keep those addresses and SHALL be refused any further save until its
count is below five. Editing an existing saved address SHALL NOT count as
adding one and SHALL NOT require a free slot. The address picker SHALL keep
a one-time address the winner has not saved visible and selectable ahead of
the account's saved addresses for the remainder of this order's confirmation.

#### Scenario: winner-order-SC-22 - An account keeps multiple shipping addresses
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an account with no saved shipping addresses
- **WHEN** the winner saves a home address and a work address
- **THEN** both named addresses are available in the account address book
- **AND** the winner can choose either address for an auction order

#### Scenario: winner-order-SC-23 - The account has one optional default
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an account with a home address set as its default
- **WHEN** the winner makes the work address the default
- **THEN** the work address is the only default
- **AND** a later order is pre-filled from the work address

#### Scenario: winner-order-SC-24 - Editing a saved address does not rewrite an order
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an unpaid order whose delivery snapshot uses the home address
- **WHEN** the winner edits the saved home address in the account address book
- **THEN** the saved home address has the new value
- **AND** the order keeps the address snapshot it already showed

#### Scenario: winner-order-SC-25 - A selected address cannot be archived silently
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an unpaid order whose delivery snapshot uses the work address
- **WHEN** the winner tries to archive the work address
- **THEN** Grade10 asks the winner to select another address for that order
- **AND** does not remove the address while it remains selected

#### Scenario: winner-order-SC-72 - Saving the fifth address still succeeds
**Serves:** winner-order-US-09 - Winner confirms delivery when five addresses are already saved

- **GIVEN** an account with four saved shipping addresses
- **WHEN** the winner saves a fifth named address
- **THEN** the fifth address is added to the account address book
- **AND** the account holds five named addresses

#### Scenario: winner-order-SC-73 - Saving a sixth address is refused at the cap
**Serves:** winner-order-US-09 - Winner confirms delivery when five addresses are already saved

- **GIVEN** an account with five saved shipping addresses
- **WHEN** the winner tries to save a sixth named address to the account address book
- **THEN** Grade10 refuses the save
- **AND** the account address book still holds only the five existing addresses

#### Scenario: winner-order-SC-74 - A one-time address confirms the order at the cap
**Serves:** winner-order-US-09 - Winner confirms delivery when five addresses are already saved

- **GIVEN** an account with five saved shipping addresses
- **WHEN** the winner adds a new address through Add new address and confirms it as the delivery address for the current order without saving it
- **THEN** the order's delivery snapshot uses the new address
- **AND** the account address book still holds only the five existing addresses

#### Scenario: winner-order-SC-75 - Save this address for future orders is refused at the cap
**Serves:** winner-order-US-09 - Winner confirms delivery when five addresses are already saved

- **GIVEN** an account with five saved shipping addresses
- **WHEN** the winner opens Add new address to enter a delivery address for the current order
- **THEN** Save this address for future orders is disabled and unchecked
- **AND** a short reason explains that the address book is full

#### Scenario: winner-order-SC-76 - Removing a saved address frees a slot
**Serves:** winner-order-US-09 - Winner confirms delivery when five addresses are already saved

- **GIVEN** an account with five saved shipping addresses
- **WHEN** the winner archives one saved address and then saves a new named address
- **THEN** the new address is added to the account address book
- **AND** the account holds five named addresses again

#### Scenario: winner-order-SC-77 - Editing a saved address does not consume a slot
**Serves:** winner-order-US-09 - Winner confirms delivery when five addresses are already saved

- **GIVEN** an account with five saved shipping addresses
- **WHEN** the winner edits the details of one of the five saved addresses
- **THEN** the account address book still holds five named addresses
- **AND** the edit does not require freeing a slot first

#### Scenario: winner-order-SC-78 - An account already over the cap keeps its existing addresses
**Serves:** winner-order-US-09 - Winner confirms delivery when five addresses are already saved

- **GIVEN** an account that already holds six named addresses from before the cap existed
- **WHEN** the winner opens the account address book
- **THEN** all six named addresses remain available
- **AND** the platform refuses any further save until the count is below five

#### Scenario: winner-order-SC-79 - The one-time address stays selectable ahead of the saved addresses
**Serves:** winner-order-US-09 - Winner confirms delivery when five addresses are already saved

- **GIVEN** an account with five saved shipping addresses
- **WHEN** the winner adds a one-time address through Add new address without saving it
- **THEN** the address picker lists the one-time address ahead of the five saved addresses
- **AND** the winner can still select it to confirm the order
