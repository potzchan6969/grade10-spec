# Tasks: ZZZ site navigation

Every group lands in the grade10 repository, in order — each builds on the
one before. Group 1 assumes `adopt-react-router`'s foundation group has
landed, so the framework, its conventions, and its worked example already
exist in the repository.

## 1. Addresses and the framework

- [ ] 1.1 Make `Each view has an address`, `A refresh keeps the collector's
      place`, and `An unknown address resolves to not-found` pass: the app
      builds through the framework's Vite plugin with a root module, one
      thin route module per surface, and a minimal not-found view naming
      the failed address.
- [ ] 1.2 Make `Sign-in opens in place`, `Back steps back into the site`,
      and `Another origin is the browser's` pass: the state-switched
      rendering in the app root retires and moving between views becomes
      navigation.
- [ ] 1.3 Run typecheck, lint, and the app's test lane as this group's
      verification.

## 2. Session-decided addresses

- [ ] 2.1 Make `A signed-in collector lands on home`, `A signed-in
      collector asks for sign-in`, and `A signed-out collector asks for the
      profile` pass: each correction renders the corrected surface and
      replaces the history entry.
- [ ] 2.2 Make `Back never returns to a corrected address` and `Not-found
      does not wait` pass.
- [ ] 2.3 Run typecheck, lint, and the app's test lane as this group's
      verification.

## 3. The collector's place and payload

- [ ] 3.1 Make `Back returns to where they were` and `A new surface starts
      at the top` pass: scroll restoration keyed to history entries.
- [ ] 3.2 Make `The first visit pays for one surface` and `The destination
      loads on arrival` pass: each route module loads its view lazily, and
      the built output carries no surface's page code in the entry chunk.
- [ ] 3.3 Run the full check suite and a production build as this group's
      verification.
