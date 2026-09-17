## MODIFIED Requirements

### Requirement: Watched-list entry fields

Each entry SHALL carry enough to decide whether to act, in the shape
that listing's own surface uses. A closed listing SHALL be shown as
closed. A called-off listing SHALL NOT appear on the watched list — it
is hidden with draft lots under `grade10-site/auction/lot-status`. A
close SHALL follow `dates-and-times`.

| Field | Meaning |
| --- | --- |
| Listing | Identity of the watched listing |
| Current bid | Same shape as that listing's own surface |
| Closes At | Same shape as that listing's close |
| Sale state | Open or closed |

#### Scenario: grade10-site-auction-watchlist-SC-15 - An entry carries the facts needed to act
**Serves:** grade10-site-auction-watchlist-US-03 - Collector reads the listings they watch

- **GIVEN** a collector watching an open listing
- **WHEN** they read the listings they watch
- **THEN** that entry shows the listing's identity, its current bid, and its close

#### Scenario: grade10-site-auction-watchlist-SC-16 - A closed listing stays in the list
**Serves:** grade10-site-auction-watchlist-US-03 - Collector reads the listings they watch

- **GIVEN** a collector watching a listing that then closes
- **WHEN** they read the listings they watch
- **THEN** that listing is still listed
- **AND** it is shown as closed

#### Scenario: grade10-site-auction-watchlist-SC-17 - A called-off listing is shown as called off
**Serves:** grade10-site-auction-watchlist-US-03 - Collector reads the listings they watch

- **GIVEN** a collector watching a listing an operator then calls off
- **WHEN** they read the listings they watch
- **THEN** that listing is not listed
