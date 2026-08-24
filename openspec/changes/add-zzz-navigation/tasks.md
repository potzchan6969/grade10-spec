# Tasks: ZZZ site navigation

Every group lands in the grade10 repository, in order — each builds on the
one before. The framework, its conventions and its worked example are already
in the repository: `apps/frontend/grade10` runs it, `docs/architecture/serving.md`
and the `frontend-structure` skill say what the shape is. ZZZ takes the
navigating half of it and no worker — see design.md.

## 1. The framework and the document (owner: @sean)

- [x] 1.1 The build runs through the framework: `react-router.config.ts`
      (`appDirectory: "src"`, `ssr: false`, no prerender list), the
      `@react-router/dev` Vite plugin in place of `@vitejs/plugin-react`,
      `react-router` and `@react-router/dev` added, the app's `dev`, `build`
      and `typecheck` scripts run through `react-router`, and wrangler's
      asset directory follows the build output in all three environments.
- [x] 1.2 The document moves out of `index.html`: a root module renders it
      with `lang="ko"` and wraps every surface in the providers `main.tsx`
      holds today, and the dev sign-in mount moves to the client entry.
      Localization's `The ZZZ document is Korean` is asserted against the
      rendered root and still passes.
- [x] 1.3 Run typecheck, lint, and the app's test lane as this group's
      verification.

## 2. Addresses (owner: @sean)

- [x] 2.1 Make `Each view has an address`, `A refresh keeps the collector's
      place`, and `An unknown address resolves to not-found` pass:
      `src/surfaces.ts` names every address and the pattern each surface
      matches, `src/routes.ts` gives each one a thin
      `src/routes/<surface>.tsx`, and a catch-all not-found view renders the
      shared `notFound` copy with the address that failed.
- [x] 2.2 Make `Sign-in opens in place`, `Back steps back into the site`, `A
      modified click is the browser's`, and `Another origin is the browser's`
      pass: the state-switched rendering in the app root retires, and one
      click seam in the root turns a same-origin anchor below it into a
      navigation.
- [x] 2.3 Run typecheck, lint, and the app's test lane as this group's
      verification.

## 3. Session-decided addresses (owner: @sean)

- [x] 3.1 Make `A signed-in collector lands on home`, `A signed-in collector
      asks for sign-in`, and `A signed-out collector asks for the profile`
      pass: each correction renders the corrected surface and replaces the
      history entry.
- [x] 3.2 Make `Back never returns to a corrected address` and `Not-found
      does not wait` pass.
- [x] 3.3 Run typecheck, lint, and the app's test lane as this group's
      verification.

## 4. The collector's place and payload (owner: @sean)

- [x] 4.1 Make `Back returns to where they were` and `A new surface starts at
      the top` pass: scroll restoration keyed to history entries, rendered
      once inside the site.
- [x] 4.2 Make `The first visit pays for one surface` and `The destination
      loads on arrival` pass: each route module loads its view lazily, and a
      check reads the built chunks and fails the build when a surface's page
      code lands in the entry — the one grade10's build already runs is the
      shape to follow.
- [x] 4.3 Run the full check suite and a production build as this group's
      verification.

## 5. What the repository says

- [ ] 5.1 Correct the `frontend-structure` skill: framework mode, the address
      table and the route-module shape now hold for both SPAs; what stays
      grade10's alone is the worker, prerendering and the language prefixes.
- [ ] 5.2 Say in `docs/architecture/serving.md` what a site with no worker
      answers an address with, so the two shapes are one document apart.
- [ ] 5.3 Run `pnpm run agent:check-parity` and `pnpm run check:handbook`,
      updating the Handbook where the ZZZ app's surface moved.
