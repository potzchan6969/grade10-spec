## ADDED Requirements

### Requirement: A lot's page offers to watch it

A lot's page SHALL offer a signed-in collector a control that watches and
unwatches that lot, and SHALL show whether they currently watch it. The
control SHALL act on the lot the address names and no other.

Watching from this page SHALL NOT navigate away from the lot, and SHALL NOT
change the lot's bidding standing, its close, or anything else the page
carries.

What a watch is, who may hold one, how many, and where watched lots are read
belong to `grade10-site/auction/account-record`.

Scenario ids in this capability start at `grade10-site-auction-listing-page-SC-10`: the nine
scenarios this capability already carries were written before ids were
required, and `grade10-site-auction-listing-page-SC-01` through `grade10-site-auction-listing-page-SC-09` are reserved
for them.

#### Scenario: grade10-site-auction-listing-page-SC-10 - A collector watches the lot they are reading

- **GIVEN** a signed-in collector on a published lot's own page who does not
  watch it
- **WHEN** they use the watch control
- **THEN** the page shows the lot as watched
- **AND** they are still on that lot's page

#### Scenario: grade10-site-auction-listing-page-SC-11 - The control acts on the addressed lot

- **GIVEN** two published lots with their own addresses
- **WHEN** a collector watches the lot from one of those addresses
- **THEN** only the lot that address names is watched

#### Scenario: grade10-site-auction-listing-page-SC-12 - Watching changes nothing else on the page

- **GIVEN** a signed-in collector on a live lot's page
- **WHEN** they watch it
- **THEN** the lot's bidding standing and its close are unchanged
