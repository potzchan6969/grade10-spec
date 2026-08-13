# Tasks

## 1. Retire ZZZ loyalty

- [x] 1.1 Remove the ZZZ loyalty application and its service, deploy, database and proxy registrations
- [x] 1.2 Rewrite the multi-product architecture note so identical feature support no longer claims loyalty
- [x] 1.3 Re-run the agent instruction parity check

## 2. Wire contract

- [x] 2.1 Publish the programme's response shapes from the loyalty application, browser-safe
- [x] 2.2 Annotate each member-facing resolver as returning its schema's type
- [x] 2.3 Move the activity-kind and tier-change vocabularies out of the database layer so both ends share one copy
- [x] 2.4 Record that the programme package is now reachable from a browser build, and what that forbids

## 3. Money-event delivery

- [x] 3.1 Record a money event in the same transaction as every purchase state change
- [x] 3.2 Deliver claimed events to an application-registered sink, with backoff
- [x] 3.3 Move the store's existing purchase analytics behind that sink in both brands
- [x] 3.4 Prove a purchase completed during an outage still delivers

## 4. Missing programme actions

- [x] 4.1 Operator campaign grant that counts toward tier, alongside the existing correction
- [x] 4.2 Member redemption list
- [x] 4.3 Operator redemption list, so a reversal can find its subject
- [x] 4.4 Operator invitation list, and the programme's tier vocabulary
- [x] 4.5 Operator reward list including archived and scheduled rewards
- [x] 4.6 A readable name on each member activity entry, including for retired rewards
- [x] 4.7 Narrow the public reward menu so it stops disclosing stock and edit history

## 5. Earning

- [x] 5.1 Move the store's selling currency to the programme's, and fail startup on a mismatch
- [x] 5.2 Record completed purchases against the programme through the sink
- [x] 5.3 Record refunds as amounts per event, including a second partial refund
- [x] 5.4 Count refusals by reason, and never report one as success

## 6. Operator console

- [x] 6.1 Carry the missing-second-factor signal on the error payload, and interpret it in one place
- [x] 6.2 Console shell, address-bar navigation, and the operator log with its tamper check
- [x] 6.3 Member search, state, activity, correction and campaign grant
- [x] 6.4 Invitations: grant, list, revoke
- [x] 6.5 Rewards: create, edit, archive, list including archived
- [x] 6.6 Derive each section's permission from the action it calls, and test that every operator action declares one

## 7. Operator identity lookup

- [x] 7.1 Serve identity on its own connection, requiring the identity permission and a verified second factor
- [x] 7.2 Reach it from the programme through an application-supplied port, with a test double
- [x] 7.3 Index the search for the query actually run, and bound its inputs
- [x] 7.4 Mark responses carrying identity as belonging to one caller
- [x] 7.5 Record identity reads without recording the identities

## 8. Membership surface

- [x] 8.1 Surface shell and sign-in
- [x] 8.2 Membership: tier, balance, expiring points, progress, joining, activity
- [x] 8.3 Rewards: menu, redemption, redemption list
- [x] 8.4 Hold a redemption's retry key across a reload
- [x] 8.5 Render programme-computed dates in the programme's time zone

## 9. Registration

- [x] 9.1 Register both surfaces for local development, preview, and deployment
- [x] 9.2 Fail the build when a surface is missing from the test or build chain
