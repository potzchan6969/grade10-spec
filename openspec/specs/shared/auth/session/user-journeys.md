## User journeys

### shared-auth-session-US-01: Collector is named on every surface they use

**As a** collector,
**I want** a signed-in read to report my id, email, name, and roles, and a signed-out read to report nobody,
**so that** every surface of this brand knows it is me, or that I have not signed in.

### shared-auth-session-US-02: Collector stays signed in across the brand

**As a** collector,
**I want** one sign-in to cover this brand's site and none of another brand,
**so that** I do not sign in twice on the same brand or leak into the other.

### shared-auth-session-US-03: Collector's visits are named as them, not as a device

**As a** collector,
**I want** a signed-in event to name me and an anonymous event to name the device,
**so that** analytics does not mix my account with a browser I have not signed in on.

### shared-auth-session-US-04: Collector returns to a tab they left and it knows they signed in

**As a** collector,
**I want** the tab I left behind to know I signed in somewhere else,
**so that** I do not reload it or ask for a second link to get back to what I was doing.

### shared-auth-session-US-05: Collector returns to a tab they left and it knows they signed out

**As a** collector,
**I want** the tab I left behind to know my session has ended,
**so that** it stops offering me things every request behind it would refuse.

### shared-auth-session-US-06: Collector who signs in after somebody else sees their own things

**As a** collector signing in on a browser somebody else has just used,
**I want** every open tab to show me, with my own cart, watchlist and orders,
**so that** I never act on the last person's things and they never see mine.

### shared-auth-session-US-07: Operator holds a console session apart from their site session

**As an** operator,
**I want** the admin console and the site to keep separate sign-ins that end on their own,
**so that** a site sign-in never opens the console and leaving the site signed in never leaves the console open.

### shared-auth-session-US-08: Operator signs in to the console once more after release

**As an** operator who was signed in to the console before release,
**I want** to be asked to sign in to the console again,
**so that** no console session rests on a sign-in made for the site.
