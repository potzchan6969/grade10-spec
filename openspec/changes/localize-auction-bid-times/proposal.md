**Author:** @constancetang - 2026-09-01

## Why

Bid timestamps on auction lot details use hard-coded English relative strings and UTC
absolute deadlines. Collector surfaces must format activity times in the active site
locale and the reader's local timezone, aligned with `grade10-site/auction/bidding-history`
and `localization` SC-32.

## What Changes

- Add **relative** and **local moment** shapes to `shared/dates-and-times` for collector
  audiences; operator and sent messages keep UTC with zone named.
- Add shared `dates` i18n namespace for relative-time wording.
- Change auction-listing bid rows to carry `acceptedAtMs`; format in UI with `locale`,
  `timeZone`, and `activityTimeCopy`.
- Format lot close/opens lines from instants in the reader's timezone without a `UTC`
  suffix.

## Capabilities

### Modified Capabilities

- `shared/dates-and-times`: relative tiers, local moment, activity-time composition.
- `shared/ui/auction-listing`: row contract and locale/timeZone props on bid history.

## Impact

- `@grade10/i18n`: `dates` namespace, `ShippedLocale`, `resolveShippedLocale`.
- `@grade10/ui`: formatters, bid card, bid history list, user bid history dialog.
- `apps/preview`: lot-details page wiring.
