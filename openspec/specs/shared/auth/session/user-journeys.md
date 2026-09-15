## User journeys

### shared-auth-session-US-01: Collector is named on every surface they use

**As a** collector,
**I want** a signed-in read to report my id, email, name, and roles, and a signed-out read to report nobody,
**so that** every surface of this brand knows it is me, or that I have not signed in.

### shared-auth-session-US-02: Collector stays signed in across the brand

**As a** collector,
**I want** one sign-in to cover every site of this brand and none of another,
**so that** I do not sign in twice on the same brand or leak into the other.

### shared-auth-session-US-03: Collector's visits are named as them, not as a device

**As a** collector,
**I want** a signed-in event to name me and an anonymous event to name the device,
**so that** analytics does not mix my account with a browser I have not signed in on.
