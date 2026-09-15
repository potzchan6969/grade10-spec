## MODIFIED Requirements

### Requirement: A member identifies at the till by a dynamic code or their email

The member card SHALL present a dynamic identification code — short-lived,
usable exactly once, refused on reuse naming where and when it was first
used — rendered both scannable and as a short typed fallback that is
infeasible to guess, with repeated failed attempts pausing entry for that
shop. Staff SHALL also be able to identify a member by their exact email
address; a miss SHALL disclose nothing beyond that no member was found.
Either way the programme SHALL record the account identity and SHALL NOT
store the email address.

Either identification SHALL open a time-limited till session authorizing
the terminal to read and act for that member, with no confirmation on the
member's own device. The session SHALL record how the member was
identified, and every read and act inside it SHALL be recorded with the
claimed staff and location labels; identifier-typed lookups SHALL be
rate-limited.

A lookup that identifies nobody while a member is on the sale — no match, a
used or expired code, paused or throttled entry, or no answer — SHALL leave
that member on the till: their panel, their session, and the points and
coupons staff had chosen. The panel SHALL show the answer the same lookup
gives with nobody on the sale. A lookup that finds a member SHALL replace the
one on the sale. An outdated till or membership switched off SHALL still take
membership off the till, and the sale goes on as an ordinary sale.

#### Scenario: grade10-site-store-membership-SC-09 - A replayed code is refused with its history
**Serves:** grade10-site-store-membership-US-02 - Member identifies and spends at the till

- **WHEN** an identification code is presented a second time
- **THEN** it is refused, naming where and when it was first used
- **AND** the member's own card shows the same

#### Scenario: grade10-site-store-membership-SC-10 - An email miss discloses nothing
**Serves:** grade10-site-store-membership-US-02 - Member identifies and spends at the till

- **WHEN** staff enter an email that matches no member
- **THEN** the answer says only that no member was found
- **AND** it does not distinguish an unknown address from an unpaired one

#### Scenario: grade10-site-store-membership-SC-11 - A lookup is recorded
**Serves:** grade10-site-store-membership-US-02 - Member identifies and spends at the till

- **WHEN** staff identify a member by typed email
- **THEN** the lookup is recorded with the staff and location labels and
  how the member was identified

#### Scenario: grade10-site-store-membership-SC-79 - A lookup that finds nobody keeps the member on the sale
**Serves:** grade10-site-store-membership-US-02 - Member identifies and spends at the till

- **GIVEN** a member is identified at the till and staff have chosen points
  to spend
- **WHEN** a scan or lookup identifies nobody
- **THEN** the member, their session and the chosen points stay on the till
- **AND** the panel shows the answer that lookup gives with nobody on the sale
- **AND** a spend confirmed afterwards spends for that member

#### Scenario: grade10-site-store-membership-SC-80 - A lookup that finds another member replaces the first
**Serves:** grade10-site-store-membership-US-02 - Member identifies and spends at the till

- **GIVEN** a member is identified at the till
- **WHEN** a scan identifies a different member
- **THEN** the till shows the new member
- **AND** every read and spend started after the switch acts for the new
  member only
