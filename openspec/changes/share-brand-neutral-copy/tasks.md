# Tasks: Copy a feature owns, written once

Two groups, in order: the catalogs and their resolution land in grade10-spec,
and the application repository takes them as a submodule bump. Nothing in the
second group waits on anything but the first being pushed.

## 1. The shared layer and how a string resolves (grade10-spec) (owner: @sean)

- [x] 1.1 Add `messages/shared/<locale>/<namespace>.json` for every locale any
      brand speaks, carrying the value each key resolves to today wherever the
      brands agree on it, and leave the keys they disagree on in the brand
      directories — `src/catalogs.ts` assembles the new layer beside the
      brands, and the exported surface does not move.
- [x] 1.2 Make `A brand says nothing of its own` and `A brand names itself`
      pass: `getMessages` resolves the vocabulary's default locale, then the
      vocabulary's requested locale, then the brand's default, then the
      brand's requested, so a brand states only what it says differently.
- [x] 1.3 Make `A brand leaves a key unanswered`, `A brand's own words are
      missing a language` and `A single-locale brand is missing a string`
      pass: the vocabulary is the union of the shared layer and the keys a
      brand states, every catalog is typechecked as an overlay of it, and a
      coverage test names the brand, the key, and the language when the layers
      together leave a gap — this repository has no unit lane yet, so the test
      brings one: `vitest` in `packages/i18n` and a root `test` script that
      runs every package's, beside the story lanes rather than inside them.
- [x] 1.4 Make `A new brand answers only for itself` pass and prove nothing a
      collector reads changed: a test resolves every key for every brand and
      locale and holds it against the value that brand rendered before the
      move.
- [ ] 1.5 Update `packages/i18n/README.md` and the sources-of-truth row in
      `AGENTS.md` for where a value is written now, including what ZZZ takes
      with it when its copy moves to `external/zzz-spec`.
- [ ] 1.6 Run `pnpm run typecheck`, `pnpm run lint`, and `pnpm run test` as
      this group's verification.

## 2. The application takes the catalogs (grade10)

Depends on group 1 being pushed.

- [ ] 2.1 Bump `external/grade10-spec` to the shared-layer catalogs and confirm
      `No raw key on screen` still holds: every message key still typechecks
      against the vocabulary, and no page, component, or worker changes.
- [ ] 2.2 Run `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`,
      `pnpm run test:backend`, and `pnpm run build` as this group's
      verification — the build renders every prerendered document in every
      language, which is what a resolution regression would show up in.
