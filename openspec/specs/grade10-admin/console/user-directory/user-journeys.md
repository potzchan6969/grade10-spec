## User journeys

### grade10-admin-console-user-directory-US-01: Admin reviews who holds elevated grants

**As an** admin,
**I want** to narrow Users to the accounts holding a role and read what each
of those accounts can actually do,
**so that** I can review the elevated access in the console without reading
authorization source or asking an engineer.

### grade10-admin-console-user-directory-US-02: Operator works one account from a single address

**As an** operator,
**I want** one address that opens the account I was sent to and carries on to
whatever it points at,
**so that** a colleague's link, a trail entry and my own bookmark all land me
in the same place, and I never hunt for the person twice.

### grade10-admin-console-user-directory-US-03: Operator suspends an account from auctions

**As an** operator holding `auction:moderate`,
**I want** to suspend an account from auctions from its panel on Users, and
reinstate it later,
**so that** I can stop a bidder I have reason to stop without banning them
from the whole platform.

### grade10-admin-console-user-directory-US-04: Admin creates an account from Users

**As an** admin holding `user:create`,
**I want** to create a passwordless Auth account from Users with name, email,
and roles, open the new account's panel when create succeeds, and open the
existing account when the email is already taken,
**so that** I can stand up elevated access before the person signs in without
leaving the access desk or using Override.
