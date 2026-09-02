# shared/auth/session Specification

## Purpose
Who a signed-in person is on either brand: what a product receives when it
reads the caller, that sign-in is brand-wide, that user id keys identity,
and how analytics names a visitor. Which events a product records belong to
that product.

## Feature set

- Caller identity
  - Named person: a signed-in read reports user id, email, name, and roles
  - Signed-out empty: a signed-out read reports no person
- Brand scope
  - One brand: sign-in covers every site of that brand and none of another
- Stable key
  - User id: account data and another person's identity are keyed by user id
- Analytics identity
  - Signed-in is the user: a signed-in event names the person; anonymous names the device

## User journeys

### session-US-01: Collector is named on every surface they use

**As a** collector,
**I want** a signed-in read to report my id, email, name, and roles, and a signed-out read to report nobody,
**so that** every surface of this brand knows it is me, or that I have not signed in.

**Accepted by:**

- `session-SC-01` — Signed in
- `session-SC-02` — Signed out
- `session-SC-05` — Account data is keyed by user id
- `session-SC-06` — Another person is shown by user id
- `session-SC-09` — A client cannot claim a user

### session-US-02: Collector stays signed in across the brand

**As a** collector,
**I want** one sign-in to cover every site of this brand and none of another,
**so that** I do not sign in twice on the same brand or leak into the other.

**Accepted by:**

- `session-SC-03` — One sign-in covers the brand
- `session-SC-04` — Sign-in does not cross brands

### session-US-03: Collector's visits are named as them, not as a device

**As a** collector,
**I want** a signed-in event to name me and an anonymous event to name the device,
**so that** analytics does not mix my account with a browser I have not signed in on.

**Accepted by:**

- `session-SC-07` — A signed-in event is the user
- `session-SC-08` — An anonymous event is the device
- `session-SC-10` — Sign-in links the device to the person

## Requirements

### Requirement: A signed-in person is named by id, email, name, and roles

A signed-in read SHALL report the person's user id, email address, name,
and roles. A signed-out read SHALL report no person.

#### Scenario: session-SC-01 - Signed in

- **GIVEN** a person signed in to a brand
- **WHEN** a product of that brand reads who is calling
- **THEN** it receives that person's user id, email, name, and roles

#### Scenario: session-SC-02 - Signed out

- **GIVEN** a caller who is not signed in
- **WHEN** a product reads who is calling
- **THEN** it receives no person

### Requirement: Sign-in covers the brand, not another brand

A person signed in on one site of a brand SHALL be signed in on every site
of that brand. A sign-in on one brand SHALL NOT sign them in on another.

#### Scenario: session-SC-03 - One sign-in covers the brand

- **GIVEN** a person who signed in on one site of a brand
- **WHEN** they open another site of the same brand
- **THEN** they are signed in as the same person

#### Scenario: session-SC-04 - Sign-in does not cross brands

- **GIVEN** a person signed in on Grade10
- **WHEN** they open a ZZZ site
- **THEN** they are not signed in there

### Requirement: User id is the only identity key

Every product SHALL key account data by user id. Email SHALL NOT be that
key. A product that presents another person SHALL identify them by user id.

#### Scenario: session-SC-05 - Account data is keyed by user id

- **WHEN** a product stores data about a signed-in person
- **THEN** it keys that data by user id
- **AND** it does not key it by email

#### Scenario: session-SC-06 - Another person is shown by user id

- **WHEN** a product must show another person's name
- **THEN** it asks for that person by user id

### Requirement: Analytics names a signed-in person by user id

WHEN a product records an analytics event and the caller is signed in, the
event SHALL be attributed to that person's user id. WHEN the caller is not
signed in, the event SHALL be attributed to the device and SHALL NOT be
attributed to a user id. Identity SHALL come from who is signed in; the
client SHALL NOT choose the user.

#### Scenario: session-SC-07 - A signed-in event is the user

- **GIVEN** a person signed in
- **WHEN** a product records an analytics event for that visit
- **THEN** the event is attributed to that person's user id

#### Scenario: session-SC-08 - An anonymous event is the device

- **GIVEN** a caller who is not signed in
- **WHEN** a product records an analytics event for that visit
- **THEN** the event is attributed to the device
- **AND** it is not attributed to a user id

#### Scenario: session-SC-09 - A client cannot claim a user

- **GIVEN** a caller who is not signed in
- **WHEN** they submit an analytics event that names a user id
- **THEN** the recorded event is not attributed to that user id

### Requirement: Sign-in links the device to the person

WHEN a signed-in visit records an analytics event, that event SHALL also
carry the device so earlier anonymous events for that device can join the
person.

#### Scenario: session-SC-10 - Sign-in links the device to the person

- **GIVEN** analytics events recorded against a device while unsigned
- **WHEN** that device later records an event while signed in as a person
- **THEN** the later event is attributed to that person
- **AND** it still names that device
