# Tasks

## 1. Retire ZZZ loyalty

- [ ] 1.1 Remove the ZZZ loyalty application and its service, deploy, database and proxy registrations
- [ ] 1.2 Rewrite the multi-product architecture note so identical feature support no longer claims loyalty
- [ ] 1.3 Re-run the agent instruction parity check

## 2. Wire contract

- [ ] 2.1 Publish the programme's response shapes from the loyalty application, browser-safe
- [ ] 2.2 Annotate each member-facing resolver as returning its schema's type
- [ ] 2.3 Move the activity-kind and tier-change vocabularies out of the database layer so both ends share one copy
- [ ] 2.4 Record that the programme package is now reachable from a browser build, and what that forbids

## 3. Money-event delivery

- [ ] 3.1 Record a money event in the same transaction as every purchase state change
- [ ] 3.2 Deliver claimed events to an application-registered sink, with backoff
- [ ] 3.3 Move the store's existing purchase analytics behind that sink in both brands
- [ ] 3.4 Prove a purchase completed during an outage still delivers

## 4. Missing programme actions

- [ ] 4.1 Operator campaign grant that counts toward tier, alongside the existing correction
- [ ] 4.2 Member redemption list
- [ ] 4.3 Operator redemption list, so a reversal can find its subject
- [ ] 4.4 Operator invitation list, and the programme's tier vocabulary
- [ ] 4.5 Operator reward list including archived and scheduled rewards
- [ ] 4.6 A readable name on each member activity entry, including for retired rewards
- [ ] 4.7 Narrow the public reward menu so it stops disclosing stock and edit history

## 5. Earning

- [ ] 5.1 Move the store's selling currency to the programme's, and fail startup on a mismatch
- [ ] 5.2 Record completed purchases against the programme through the sink
- [ ] 5.3 Record refunds as amounts per event, including a second partial refund
- [ ] 5.4 Count refusals by reason, and never report one as success

## 6. Operator console

- [ ] 6.1 Carry the missing-second-factor signal on the error payload, and interpret it in one place
- [ ] 6.2 Console shell, address-bar navigation, and the operator log with its tamper check
- [ ] 6.3 Member search, state, activity, correction and campaign grant
- [ ] 6.4 Invitations: grant, list, revoke
- [ ] 6.5 Rewards: create, edit, archive, list including archived
- [ ] 6.6 Derive each section's permission from the action it calls, and test that every operator action declares one

## 7. Operator identity lookup

- [ ] 7.1 Serve identity on its own connection, requiring the identity permission and a verified second factor
- [ ] 7.2 Reach it from the programme through an application-supplied port, with a test double
- [ ] 7.3 Index the search for the query actually run, and bound its inputs
- [ ] 7.4 Mark responses carrying identity as belonging to one caller
- [ ] 7.5 Record identity reads without recording the identities

## 8. Membership surface

- [ ] 8.1 Surface shell and sign-in
- [ ] 8.2 Membership: tier, balance, expiring points, progress, joining, activity
- [ ] 8.3 Rewards: menu, redemption, redemption list
- [ ] 8.4 Hold a redemption's retry key across a reload
- [ ] 8.5 Render programme-computed dates in the programme's time zone

## 9. Registration

- [ ] 9.1 Register both surfaces for local development, preview, and deployment
- [ ] 9.2 Fail the build when a surface is missing from the test or build chain
