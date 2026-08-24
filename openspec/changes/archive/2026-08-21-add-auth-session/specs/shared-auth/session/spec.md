## Purpose

Who a signed-in person is on either brand: what a product receives when it
reads the caller, that sign-in is brand-wide, that user id keys identity,
and how analytics names a visitor. Which events a product records belong to
that product.

## ADDED Requirements

### Requirement: A signed-in person is named by id, email, name, and roles

A signed-in read SHALL report the person's user id, email address, name,
and roles. A signed-out read SHALL report no person.

#### Scenario: Signed in

- **GIVEN** a person signed in to a brand
- **WHEN** a product of that brand reads who is calling
- **THEN** it receives that person's user id, email, name, and roles

#### Scenario: Signed out

- **GIVEN** a caller who is not signed in
- **WHEN** a product reads who is calling
- **THEN** it receives no person

### Requirement: Sign-in covers the brand, not another brand

A person signed in on one site of a brand SHALL be signed in on every site
of that brand. A sign-in on one brand SHALL NOT sign them in on another.

#### Scenario: One sign-in covers the brand

- **GIVEN** a person who signed in on one site of a brand
- **WHEN** they open another site of the same brand
- **THEN** they are signed in as the same person

#### Scenario: Sign-in does not cross brands

- **GIVEN** a person signed in on Grade10
- **WHEN** they open a ZZZ site
- **THEN** they are not signed in there

### Requirement: User id is the only identity key

Every product SHALL key account data by user id. Email SHALL NOT be that
key. A product that presents another person SHALL identify them by user id.

#### Scenario: Account data is keyed by user id

- **WHEN** a product stores data about a signed-in person
- **THEN** it keys that data by user id
- **AND** it does not key it by email

#### Scenario: Another person is shown by user id

- **WHEN** a product must show another person's name
- **THEN** it asks for that person by user id

### Requirement: Analytics names a signed-in person by user id

WHEN a product records an analytics event and the caller is signed in, the
event SHALL be attributed to that person's user id. WHEN the caller is not
signed in, the event SHALL be attributed to the device and SHALL NOT be
attributed to a user id. Identity SHALL come from who is signed in; the
client SHALL NOT choose the user.

#### Scenario: A signed-in event is the user

- **GIVEN** a person signed in
- **WHEN** a product records an analytics event for that visit
- **THEN** the event is attributed to that person's user id

#### Scenario: An anonymous event is the device

- **GIVEN** a caller who is not signed in
- **WHEN** a product records an analytics event for that visit
- **THEN** the event is attributed to the device
- **AND** it is not attributed to a user id

#### Scenario: A client cannot claim a user

- **GIVEN** a caller who is not signed in
- **WHEN** they submit an analytics event that names a user id
- **THEN** the recorded event is not attributed to that user id

### Requirement: Sign-in links the device to the person

WHEN a signed-in visit records an analytics event, that event SHALL also
carry the device so earlier anonymous events for that device can join the
person.

#### Scenario: Sign-in links the device to the person

- **GIVEN** analytics events recorded against a device while unsigned
- **WHEN** that device later records an event while signed in as a person
- **THEN** the later event is attributed to that person
- **AND** it still names that device
