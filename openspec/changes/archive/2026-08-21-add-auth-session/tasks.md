# Tasks: Who is signed in

Group 1 lands first. Groups 2 and 3 depend on group 1, not on each other.
Group 4 depends on groups 1 and 2. Later work (another sign-in method, email
change) appends a group; it does not rename these. Task 2.6 is the port
anonymous checkout will call.

## 1. Who is signed in (grade10) (owner: @rita-liu)

- [x] 1.1 Make `Signed in` and `Signed out` pass: user id, email, name, and roles, or no person.
- [x] 1.2 Make `One sign-in covers the brand` and `Sign-in does not cross brands` pass.
- [x] 1.3 Make `A signed-in event is the user`, `An anonymous event is the device`, and `A client cannot claim a user` pass.
- [x] 1.4 Run `pnpm run typecheck` on the auth contracts package.

## 2. Signing in (grade10) (owner: @rita-liu)

Depends on group 1.

- [x] 2.1 Make `A valid link creates a session`, `A used link does not sign in again`, `An expired link does not sign in`, `A failed send is reported`, and `A first send does not disclose whether the address is new` pass.
- [x] 2.2 Make `A correct code creates a session`, `An incorrect code is refused`, `An expired code is refused`, and `Too many wrong codes kill the code` pass.
- [x] 2.3 Make `A brand with Google sign-in offers it`, `An unverified Google email does not sign in`, and `A brand without Google sign-in hides it` pass.
- [x] 2.4 Make `A first visit creates the account`, `A later visit is the same account`, `Letter case does not create a second account`, and `A plus-tag is a different address` pass.
- [x] 2.5 Make `A second link send in a minute is told to wait`, `A second code send in a minute is told to wait`, and `A code send after a link in a minute is told to wait` pass.
- [x] 2.6 Make `A new verified email creates the account`, `A known verified email is the same account`, `A trusted product can sign the person in`, `A client cannot claim an email`, and `Sign-in after a product-created account is the same person` pass.
- [x] 2.7 Make `An untrusted redirect is ignored` and `A missing redirect stays on the brand` pass.
- [x] 2.8 Make `A new link kills the earlier link` and `A new code kills the earlier link` pass.
- [x] 2.9 Run `pnpm run typecheck`, `pnpm run lint`, and `pnpm run test:backend`.

## 3. Sign-in on the sites (grade10) (owner: @rita-liu)

Depends on group 1. Frontend against fixtures.

- [x] 3.1 Make `A failed send is reported`, `An incorrect code is refused`, `A second link send in a minute is told to wait`, and `A first send does not disclose whether the address is new` pass on both brands' collector and admin sign-in, using `SignInCard`, `SignInEmailForm`, and `SignInCodeForm`.
- [x] 3.2 Make `A brand with Google sign-in offers it` and `A brand without Google sign-in hides it` pass.
- [x] 3.3 Run `pnpm run typecheck`, `pnpm run lint`, and `pnpm run test`.

## 4. Identity in products (grade10) (owner: @rita-liu)

Depends on groups 1 and 2.

- [x] 4.1 Make `Account data is keyed by user id` and `Another person is shown by user id` pass in store, auction, and loyalty.
- [x] 4.2 Make `A signed-in event is the user`, `An anonymous event is the device`, `A client cannot claim a user`, and `Sign-in links the device to the person` pass on every product that records analytics.
- [x] 4.3 Run `pnpm run typecheck`, `pnpm run lint`, and `pnpm run test:backend`.

## 5. Archive when it has shipped (grade10)

- [x] 5.1 Verify every scenario in the two deltas, then run `openspec validate add-auth-session --strict` and `openspec validate --specs`.
- [x] 5.2 After rollout is confirmed, fold the accepted deltas into `openspec/specs/` and archive this change.

5.2 did not wait on a deploy. Implementation merged to grade10 `main` as
`63afbb0d` (#65) on 2026-08-21. The last successful Deploy run
(32458720314) was `6f06b662`, which does not contain that merge; production
does not either. Merge deploys nothing. Archived on owner request.
