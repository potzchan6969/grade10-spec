# Write down how a failure is said

**Author:** @sean - 2026-10-27

## Why

A collector's failure notice reads in the page's language on both brands' sites, and nothing in the durable spec says it must. The behaviour shipped under `localize-failure-copy` (`03ed94473f`, `26619f671b`, and `3e92b3807a` for the card field), but that change was dropped without acceptance, so `shared/localization` holds no failure requirement.

- **The rules live only in code and tests.** The closed set of five kinds, "classified once", and "nothing from the backend" are enforced by `failureKindOf`, `useFailureWords` and their tests. A later change can add a sixth kind or render `error.message` again without breaking any stated rule.
- **The page already promises it.** `docs/prds/platform/shared/localization.md` says a failure notice reads in the page's language, and a PRD never restates a requirement.
- **The card field was the last gap.** A refused card confirmation used to show Stripe's own text; it now shows the catalog's declined line.

**Metric:** failure requirements in the durable `shared/localization` spec, from none to two, each with a scenario.

## What Changes

- **Write the two requirements the code already meets.** A failure is classified once into a closed set of kinds, and a collector reads the catalog's words for that kind, never the backend's.
- **Carry the five scenarios** of the dropped change, one per outcome a reader would notice.
- **State the card field's rule as shipped.** A refused card confirmation shows the surface's own declined line, and the provider's text stays in the technical account.
- **No code changes.** Everything described is already in the application repository.

## Non-Goals

See `decisions.md`.

## Capabilities

### Modified Capabilities

- `shared/localization` - gains the two failure requirements and five scenarios.

## Impact

- **`openspec/specs/shared/localization/`** gains the requirements, the feature cases and the journeys note.
- **`docs/prds/platform/shared/localization.md`** is unchanged; it already carries the prose.
- **No application, backend, contract or database change.**

## Open questions

None.
