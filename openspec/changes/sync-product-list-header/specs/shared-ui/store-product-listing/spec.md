# shared-ui/store-product-listing Delta

## MODIFIED Requirements

### Requirement: The product list header displays the result count and the sort control

The product list header SHALL display a consumer-supplied title and the total
result count exactly as the consumer supplied it, as a formatted string, and
SHALL NOT derive the count from the number of products on the current page.
It SHALL NOT supply a default title.

It SHALL display a sort control listing exactly the sort options supplied, in
the order supplied, with the active option marked as selected. Choosing an
option SHALL report it through a callback. When the active option names a
paired identifier, a further activation of that same control SHALL report the
paired identifier instead, and SHALL rotate the option's trailing control
180°. Choosing an already-active option that has no pair SHALL report nothing.

It SHALL display each supplied chip-filter group as a row of options that can
be selected together, reporting a change that names the group and the option,
and SHALL display an option as selected only when the supplied selection
contains it. A group whose supplied selection contains no option SHALL display
every option as unselected. That empty selection is valid and SHALL NOT hide
or replace the supplied results — it is the unrestricted state of the group.
Selecting a second option SHALL report it without clearing the first, so both
can be selected together. It SHALL display each supplied exclusive-filter group as a
dropdown listing exactly those options, marking the supplied value as
selected and naming it on the trigger. Choosing an exclusive option SHALL
report the group and the option and SHALL dismiss the list. The trigger SHALL
still name the previously selected option until the consumer supplies a new
value.

A chip-filter group or exclusive-filter group whose option list is empty SHALL
not be displayed. An empty list of sort options SHALL hide the sort control.
Sort, chip filters, and exclusive filters SHALL be selectable at the same
time.

#### Scenario: The count is not derived

- **GIVEN** a supplied result count of `38` and a page carrying 8 products
- **THEN** the header displays the supplied `38`

#### Scenario: The title is displayed as supplied

- **WHEN** the header is rendered with a title
- **THEN** that title is displayed exactly as supplied
- **AND** no fallback title is shown

#### Scenario: Sorting is reported

- **WHEN** a shopper chooses a sort option other than the active one
- **THEN** that option is reported once through the callback
- **AND** the previously active option stays marked as selected until the consumer supplies a new one

#### Scenario: A paired sort option reverses on a second activation

- **GIVEN** an active sort option that names a paired identifier
- **WHEN** a shopper activates that same control again
- **THEN** the paired identifier is reported once
- **AND** the trailing control is shown rotated 180° once the consumer supplies the paired identifier as the active option

#### Scenario: No sort options supplied

- **GIVEN** an empty list of sort options
- **THEN** the sort control is not displayed and the title and result count are still displayed

#### Scenario: No chip filter selected

- **GIVEN** a chip-filter group whose supplied selection contains no option
- **THEN** every option is displayed as unselected
- **AND** the supplied results are still displayed

#### Scenario: A chip filter is reported

- **GIVEN** a chip-filter group with no option selected
- **WHEN** a shopper activates one option and the consumer supplies no new selection
- **THEN** that option is still displayed as unselected
- **AND** every other option in the group stays unselected
- **AND** the change was reported once, naming the group and the option

#### Scenario: Two chip filter options selected

- **GIVEN** a chip-filter group whose supplied selection contains two options
- **THEN** both options are displayed as selected together

#### Scenario: An exclusive filter is reported

- **WHEN** a shopper opens an exclusive-filter dropdown and chooses an option other than the active one
- **THEN** that option is reported once, naming the group and the option
- **AND** the option list is dismissed
- **AND** the trigger still names the previously active option until the consumer supplies a new one

#### Scenario: An exclusive filter with no options

- **GIVEN** an exclusive-filter group whose option list is empty
- **THEN** that dropdown is not displayed

#### Scenario: Sort and filters combine

- **WHEN** a sort option, a chip-filter option, and an exclusive-filter option are each selected
- **THEN** all three remain displayed as selected together
