## 1. Specification

- [x] 1.1 Record relative, local moment, and activity-time deltas in OpenSpec.

## 2. i18n and formatters

- [x] 2.1 Add shared `dates` namespace in every shipped locale.
- [x] 2.2 Export `ShippedLocale`, `ActivityTimeCopy`, and `resolveShippedLocale`.
- [x] 2.3 Implement `formatRelativeAt`, `formatLocalMoment`, `formatActivityAt`, and `formatCollectorDeadline` with tests.

## 3. Auction listing UI

- [x] 3.1 Change bid history row types to `acceptedAtMs`.
- [x] 3.2 Wire `locale`, `timeZone`, and `activityTimeCopy` through bid card and history components.
- [x] 3.3 Format collector deadline line from `deadlineAtMs` in `TimeBlock`.

## 4. Preview and validation

- [x] 4.1 Update fixtures, preview lot-details, and stories.
- [x] 4.2 Run typecheck, tests, and story tests.

## 5. Application follow-up

- [ ] 5.1 Wire grade10 frontend locale resolver and browser time zone into lot details and `/bids`.
