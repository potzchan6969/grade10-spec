# Backfill the feature suites the new pairing rule names

**Author:** @kobe - 2026-09-12

## Why

`feature-tcs.md` moved into the product manager's half of a change, and every
`user-journeys.md` now pairs with a suite beside it unless it says
`**Walked by:** nobody`. Nineteen durable capabilities predate that rule: they
hold stories nothing derives cases from, which is exactly the hole the rule
exists to close. Until they are backfilled the `derived` rule in
`pnpm check:manual` can only warn, so a capability that skips its suite today
still looks like one that simply has not been backfilled yet.

## What Changes

- Derive `feature-tcs.md` for each of the nineteen capabilities listed in
  `tasks.md`, with `/spec-to-tcs feature <capability>`, every case `draft`.
- Raise the `derived` rule in `tools/manual/check/context.mjs` from `warn` to
  `fail` once the list is empty, so CI gates the pairing from then on.

## Non-Goals

- No requirement changes. Every suite is a derived reading of a spec and its
  journeys as they already stand; a spec that turns out to be wrong is its own
  change.
- No review. The suites land as `draft`; `/tcs-review` signs them off in its
  own pull request, capability by capability.
- No domain, product or platform suites.

## Capabilities

No spec-level behavior changes, so this change declares no deltas and sets
`skip_specs: true`.

## Impact

`openspec/specs/**/feature-tcs.md` for the nineteen capabilities, and the one
rule level in `tools/manual/check/context.mjs`.
