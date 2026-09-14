## User journeys

### shared-auth-sign-in-US-01: Collector asks for and follows a sign-in link

**As a** collector,
**I want** a link emailed to the address I submit to sign me in once,
**so that** I reach my account without a password, and a used or expired link cannot.

**Accepted by:**

- `shared-auth-sign-in-SC-01` — Activating again during flight does nothing
- `shared-auth-sign-in-SC-05` — A valid link creates a session
- `shared-auth-sign-in-SC-06` — A used link does not sign in again
- `shared-auth-sign-in-SC-07` — An expired link does not sign in
- `shared-auth-sign-in-SC-08` — A failed send is reported
- `shared-auth-sign-in-SC-09` — A first send does not disclose whether the address is new
- `shared-auth-sign-in-SC-36` — A new link kills the earlier link
- `shared-auth-sign-in-SC-33` — The email step has no code control

### shared-auth-sign-in-US-03: Collector signs in with Google when the brand offers it

**As a** collector,
**I want** Google sign-in when this brand offers it,
**so that** I can use an account I already have, and a brand that does not offer it does not show it.

**Accepted by:**

- `shared-auth-sign-in-SC-14` — A brand with Google sign-in offers it
- `shared-auth-sign-in-SC-15` — An unverified Google email does not sign in
- `shared-auth-sign-in-SC-16` — A brand without Google sign-in hides it

### shared-auth-sign-in-US-04: Collector keeps one account for one verified address

**As a** collector,
**I want** every successful sign-in at an address to be the same person,
**so that** a later visit, a product-created account, or letter case does not split me.

**Accepted by:**

- `shared-auth-sign-in-SC-17` — A first visit creates the account
- `shared-auth-sign-in-SC-18` — A later visit is the same account
- `shared-auth-sign-in-SC-19` — Letter case does not create a second account
- `shared-auth-sign-in-SC-20` — A plus-tag is a different address
- `shared-auth-sign-in-SC-21` — A new verified email creates the account
- `shared-auth-sign-in-SC-22` — A known verified email is the same account
- `shared-auth-sign-in-SC-23` — A trusted product can sign the person in
- `shared-auth-sign-in-SC-24` — A client cannot claim an email
- `shared-auth-sign-in-SC-25` — Sign-in after a product-created account is the same person

### shared-auth-sign-in-US-05: Collector is not spammed or sent off-brand

**As a** collector,
**I want** a second email within a minute to wait, and a return only to this brand,
**so that** I am not flooded and not delivered to an untrusted address.

**Accepted by:**

- `shared-auth-sign-in-SC-35` — A second link send in a minute is told to wait
- `shared-auth-sign-in-SC-31` — An untrusted redirect is ignored
- `shared-auth-sign-in-SC-32` — A missing redirect stays on the brand
